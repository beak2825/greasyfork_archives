// ==UserScript==
// @name         ylFriendliesPlayedCheckerAI
// @namespace    http://tampermonkey.net/
// @version      0.2.4.2
// @description  Check played friendlies and league matches on ManagerZone matches page
// @author       kostrzak16 (Michal Kostrzewski)
// @match        https://www.managerzone.com/?p=match*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511464/ylFriendliesPlayedCheckerAI.user.js
// @updateURL https://update.greasyfork.org/scripts/511464/ylFriendliesPlayedCheckerAI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const BACKGROUND_COLORS = {
        LESS_THAN_TWO: '#d7ffd7',
        EXACTLY_FOUR: '#ffd8ac',
        MORE_THAN_FOUR: '#f19e9e',
        DEFAULT: '#fff'
    };

    const POLISH_TIME_OFFSET = 2;

    const LEAGUE_TYPES = [
        'series',
        'u18_series',
        'u21_series',
        'u23_series',
        'u18_world_series',
        'u21_world_series',
        'u23_world_series'
    ];

    class FriendliesChecker {
        constructor() {
            this.players = {};
            this.week1players = {};
            this.week2players = {};
            this.leaguePlayers = {};
            this.leaguePlayers2 = {};
            this.playersNr = {};
            this.playersForm = {};
            this.currentWeekData = null;
            this.previousWeekData = null;
            this.setupUI();
        }

        setupUI() {
            const yellowDot = $('.icon-explanation.uxx');
            const checkButton = $('<button>')
                .text('Check Friendlies')
                .css({
                    marginRight: '10px',
                    cursor: 'pointer',
                    padding: '5px 10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: 'bold'
                })
                .click(() => this.initCheck());

            yellowDot.before(checkButton);

            // Disable button when scheduled matches are selected
            const updateButtonState = () => {
                const isScheduledSelected = $('.box_light_on_dark a[href="/?p=match&sub=scheduled"]').hasClass('selected');
                checkButton.prop('disabled', isScheduledSelected);
                checkButton.css('opacity', isScheduledSelected ? 0.5 : 1);
            };

            updateButtonState();
            $(document).ajaxComplete(updateButtonState);

            this.checkButton = checkButton;
        }

        async initCheck() {
            console.log('Starting friendly matches check...');
            this.checkButton.text('Calculating...');
            this.checkButton.prop('disabled', true);
            this.players = {};
            this.playersNr = {};
            this.playersForm = {};

            await this.checkFriendlyMatches();
            this.displayResults();
            this.checkButton.text('Check Friendlies');
            this.checkButton.prop('disabled', false);
        }

        async checkFriendlyMatches() {
            console.log('Changing to friendly matches...');
            await this.changeFixtureTypeAndWait('friendly');

            console.log('Checking current week friendlies...');
            const currentWeekRange = this.calculateDateRange(false);
            const currentWeekLinks = this.gatherMatchLinks(currentWeekRange);
            await this.processMatches(currentWeekLinks, false);
            await this.getPlayerInfo();
            this.currentWeekData = this.getSortedPlayers(this.players);

            console.log('Checking previous week friendlies...');

            this.week1players = Object.assign({}, this.players);
            this.players = {};
            const previousWeekRange = this.calculateDateRange(true);
            const previousWeekLinks = this.gatherMatchLinks(previousWeekRange);
            await this.processMatches(previousWeekLinks, false);
            await this.getPlayerInfo();
            this.previousWeekData = this.getSortedPlayers(this.players);
            this.week2players = Object.assign({}, this.players);
        }

        async checkLeagueMatches() {
            console.log('Starting league matches check...');
            this.checkButton.text('Calculating...');
            this.checkButton.prop('disabled', true);
            this.leaguePlayers = {};    // Current week league matches
            this.leaguePlayers2 = {};   // Previous week league matches

            for (const leagueType of LEAGUE_TYPES) {
                try {
                    await this.changeFixtureTypeAndWait(leagueType);

                    // Process current week league matches
                    console.log(`Processing current week league matches for ${leagueType}...`);
                    const currentWeekRange = this.calculateDateRange(false);
                    const currentWeekLinks = this.gatherMatchLinks(currentWeekRange);

                    // Process current week matches and add directly to leaguePlayers
                    await this.processLeagueMatches(currentWeekLinks, this.leaguePlayers);
debugger;
                    // Process previous week league matches
                    console.log(`Processing previous week league matches for ${leagueType}...`);
                    const previousWeekRange = this.calculateDateRange(true);
                    const previousWeekLinks = this.gatherMatchLinks(previousWeekRange);

                    // Process previous week matches and add directly to leaguePlayers2
                    await this.processLeagueMatches(previousWeekLinks, this.leaguePlayers2);
                    debugger;

                } catch (error) {
                    console.log(`Error or type not available: ${leagueType}`, error);
                    continue;
                }
            }

            console.log('League matches check completed.');
            console.log('Current week league players:', Object.keys(this.leaguePlayers).length);
            console.log('Previous week league players:', Object.keys(this.leaguePlayers2).length);

            // Update the displayed results with both friendly and league matches
            this.currentWeekData = this.getSortedPlayers(this.week1players);
            this.leaguePlayers = {};
            this.previousWeekData = this.getSortedPlayers(this.week2players,false);

            this.displayResults();
            this.checkButton.text('Check Friendlies');
            this.checkButton.prop('disabled', false);
        }

        async processLeagueMatches(matchLinks, targetObject) {
            console.log(`Processing ${matchLinks.length} league matches...`);
            const promises = matchLinks.map(link =>
                $.get(link, content => {
                    $(content).find('.statsLite .player_link.fixed_lite_stats').each((_, player) => {
                        const playerName = $(player).text();
                        targetObject[playerName] = (targetObject[playerName] || 0) + 1;
                    });
                })
            );
            await Promise.all(promises);
        }

        async changeFixtureTypeAndWait(type) {
            const fixtureSelect = $('.results-fixtures-type select');

            // Check if this type is available in the select options
            const typeExists = fixtureSelect.find(`option[value="${type}"]`).length > 0;
            if (!typeExists) {
                console.log(`Type ${type} not available in select options`);
                throw new Error(`Type ${type} not available`);
            }

            if (fixtureSelect.val() !== type) {
                console.log(`Changing fixture type to ${type}...`);
                fixtureSelect.val(type).trigger('change');

                await new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error(`Timeout waiting for ${type}`));
                    }, 5000); // 5 second timeout

                    $(document).ajaxComplete((event, xhr, settings) => {
                        if (settings.url.includes('ajax.php?p=matches&sub=list&sport=soccer')) {
                            const formData = settings.data;
                            if (formData && formData.includes(`selectType=${type}`)) {
                                console.log(`Ajax completed for ${type}`);
                                clearTimeout(timeoutId);
                                resolve();
                            }
                        }
                    });
                });
            }
        }

        gatherMatchLinks(dateRange) {
            let matchLinks = [];
            $('#fixtures-results-list .group').each((_, group) => {
                const dateText = $(group).text().trim();
                const [day, month, year] = dateText.split('-').map(Number);
                const matchDate = new Date(year, month - 1, day);

                const matches = $(group).nextUntil('.group');
                matches.each((_, match) => {
                    const timeStr = $(match).find('.match-time').text().trim();
                    if (this.shouldIncludeMatch(matchDate, timeStr, dateRange)) {
                        const link = $(match).find('a.score-shown').attr('href');
                        if (link) matchLinks.push(link);
                    }
                });
            });
            console.log(`Gathered ${matchLinks.length} match links`);
            return matchLinks;
        }

        shouldIncludeMatch(matchDate, timeStr, dateRange) {
            const matchTime = new Date(matchDate);
            const [hours, minutes] = timeStr.split(':').map(Number);
            matchTime.setHours(hours, minutes);

            const polishMatchTime = getPolishTime(matchTime);

            return polishMatchTime >= dateRange.startDate &&
                   polishMatchTime <= dateRange.endDate;
        }

        async processMatches(matchLinks, isLeague) {
            console.log(`Processing ${matchLinks.length} matches...`);
            const promises = matchLinks.map(link =>
                $.get(link, content => {
                    $(content).find('.statsLite .player_link.fixed_lite_stats').each((_, player) => {
                        const playerName = $(player).text();
                        if (isLeague) {
                            this.leaguePlayers[playerName] = (this.leaguePlayers[playerName] || 0) + 1;
                        } else {
                            this.players[playerName] = (this.players[playerName] || 0) + 1;
                        }
                    });
                })
            );
            await Promise.all(promises);
            console.log('Match processing completed');
        }

        async getPlayerInfo() {
            console.log('Getting player info...');
            return $.get('/?p=players', content => {
                $(content).find('.player_name').each((_, player) => {
                    const playerName = this.formatPlayerName($(player).text());
                    this.playersNr[playerName] = $(player).parent().text().split('.')[0].trim();
                    this.playersForm[playerName] = this.getPlayerForm($(player));

                    if (this.shouldIncludePlayer($(player))) {
                        this.players[playerName] = this.players[playerName] || 0;
                    }
                });
            });
        }

        formatPlayerName(fullName) {
            const nameParts = fullName.split(' ');
            if (nameParts.length === 1) return fullName.trim();
            if (nameParts.length === 2) return `${nameParts[0][0]}. ${nameParts[1]}`;
            return `${nameParts[0][0]}.${fullName.substr(fullName.indexOf(' '))}`;
        }

        getPlayerForm(playerElement) {
            const container = playerElement.closest('.playerContainer');
            if (container.find(".form-minus-icon").length) return "<img src='nocache-818/img/player/formminus.png'>";
            if (container.find(".form-plus-icon").length) return "<img src='nocache-818/img/player/formplus.png'>";
            if (container.find(".weeklyReportBox [src*='training_camp']").length) return "<img src='nocache-904/img/training/training_camp.png'>";
            if (container.find(".form-satisfied-icon").length) return "";
            return "";
        }

        //checks if player is available (not on  training camp)
        shouldIncludePlayer(playerElement) {
            const container = playerElement.closest('.playerContainer');
            return container.find('.player_tc_package_information').length === 0 ||
                   container.find(".player_tc_package_information p[style*='report_ycc_soccer']").length > 0;
        }

        calculateDateRange(previousWeek = false) {
            const now = new Date();
            const startDate = previousWeek ?
                getPreviousWeekTuesday(now) :
                getLastTuesday(now);

            const endDate = previousWeek ?
                getLastTuesday(now) :
                now;

            return { startDate, endDate };
        }

        getSortedPlayers(gracze,current = true) {
            return Object.entries(gracze)
                .filter(([key]) => key !== 'unique')
                .map(([name, matches]) => {
                // const leagueMatches = this.leaguePlayers[name] || this.leaguePlayers2[name] || 0;
                    const leagueMatches = current ? (this.leaguePlayers[name] ||  0) : (this.leaguePlayers2[name] ||  0);
                    const requiredLeagueMatches = Math.min(leagueMatches, 2);
                    return {
                        name,
                        matches,
                        leagueMatches,
                        requiredLeagueMatches,
                        nr: this.playersNr[name],
                        form: this.playersForm[name]
                    };
                })
                .sort((a, b) => b.matches - a.matches || Number(a.nr) - Number(b.nr));
        }

        displayResults() {
            $('#PlayersListYel').remove();

            const container = $('<div id="PlayersListYel">')
                .css({
                    position: 'fixed',
                    fontSize: '14px',
                    zIndex: 1000,
                    left: '5%',
                    top: '20px',
                    backgroundColor: 'white',
                    border: '1px solid #ccc',
                    padding: '10px',
                    borderRadius: '5px'
                });

            const weekSelector = $('<div>')
                .css({
                    marginBottom: '10px'
                });

            const currentWeekBtn = $('<input>')
                .attr({
                    type: 'radio',
                    name: 'weekSelect',
                    id: 'currentWeek',
                    checked: true
                })
                .change(() => this.updateDisplayedWeek(false));

            const previousWeekBtn = $('<input>')
                .attr({
                    type: 'radio',
                    name: 'weekSelect',
                    id: 'previousWeek'
                })
                .change(() => this.updateDisplayedWeek(true));

            const leagueMatchesLink = $('<a>')
                .text('Include league matches')
                .css({
                    marginLeft: '10px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                })
                .click(() => this.checkLeagueMatches());

            weekSelector
                .append(currentWeekBtn)
                .append('<label for="currentWeek">Current Week</label>')
                .append(previousWeekBtn)
                .append('<label for="previousWeek">Previous Week</label>')
              //  .append(leagueMatchesLink);

            container.append(weekSelector);
            container.append('<div id="weekContent"></div>');

            $('body').append(container);

            this.updateDisplayedWeek(false);
        }

        updateDisplayedWeek(isPreviousWeek) {
            const dateRange = this.calculateDateRange(isPreviousWeek);
            const data = isPreviousWeek ? this.previousWeekData : this.currentWeekData;
            const dateStr = `${dateRange.startDate.toLocaleString()} to ${dateRange.endDate.toLocaleString()}`;

                 const leagueMatchesLink = $('<a>')
                .text('Include league matches')
                .css({
                    marginLeft: '10px',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                })
                .click(() => this.checkLeagueMatches());

            $('#weekContent').html('').append(
                $('<h3>').text(`Matches played (${isPreviousWeek ? 'previous' : 'current'} week):`),
              //  $('<p>').text(dateStr),
                leagueMatchesLink,
                this.createPlayerRows(data)
            );
        }

        createPlayerRows(sortedPlayers) {
            return $('<table id="tblPlayers">')
                .css({
                    display: 'block',
                    backgroundColor: 'white',
                    maxHeight: '80vh',
                    // maxHeight: '850px',
                    overflowY: 'auto'
                })
                .append(sortedPlayers.map(player => this.createPlayerRow(player)));
        }

        createPlayerRow(player) {
            const matchesDisplay = player.leagueMatches !== undefined && player.leagueMatches !== 0 ?
                `${player.matches}+${player.requiredLeagueMatches}(${player.leagueMatches})` :
                player.matches;

            const playerNameHtml = player.form === undefined ?
                `<s>${player.name}</s>` :
                `${player.name}${player.form}`;

            return $('<tr>')
                .append($('<td>').text(player.nr))
                .append($('<td>')
                    .css('backgroundColor', this.getBackgroundColor(player.matches))
                    .html(playerNameHtml))
                .append($('<td>').text(matchesDisplay));
        }

        getBackgroundColor(matches) {
            if (matches < 2) return BACKGROUND_COLORS.LESS_THAN_TWO;
            if (matches === 4) return BACKGROUND_COLORS.EXACTLY_FOUR;
            if (matches > 4) return BACKGROUND_COLORS.MORE_THAN_FOUR;
            return BACKGROUND_COLORS.DEFAULT;
        }
    }

    function getPolishTime(date = new Date()) {
        const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        return new Date(utcDate.getTime() + POLISH_TIME_OFFSET * 60 * 60000);
    }

    function getLastTuesday(date = new Date()) {
        const polishTime = getPolishTime(date);
        const day = polishTime.getDay();
        const daysToSubtract = (day + 5) % 7;

        const lastTuesday = new Date(polishTime);
        lastTuesday.setDate(polishTime.getDate() - daysToSubtract);
        lastTuesday.setHours(0, 1, 0, 0);

        return lastTuesday;
    }

    function getPreviousWeekTuesday(date = new Date()) {
        const lastTuesday = getLastTuesday(date);
        lastTuesday.setDate(lastTuesday.getDate() - 7);
        return lastTuesday;
    }

    new FriendliesChecker();
})();