// ==UserScript==
// @name                TM Friendly League Match History
// @name:pt             TM Histórico de partidas para Liga Amistosa
// @version             0.2.2 - 30/01/2024
// @description         (WIP) Add last match results and link to the matchs in the friendly league table.
// @description:pt      (WIP) Adiciona os últimos jogos e o link para o jogo na tabela da Liga Amistosa.
// @author              Irreal Madrid FC. Club ID: 4402745
// @namespace           https://github.com/mayc0njr/trophyManager/
// @match               https://trophymanager.com/friendly-league/
// @match               https://trophymanager.com/friendly-league/*
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/432308/TM%20Friendly%20League%20Match%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/432308/TM%20Friendly%20League%20Match%20History.meta.js
// ==/UserScript==

(function () {
    //Custumizable variables, used to render variables on screen, this values can be changed
    /**
     * Wait till the end of the match to show the match on last column.
     * 0: Show the match in history even if it's still running.
     * 1: Show the match but not the color/result.
     * 2: Show the match only after it's end.
     */
    const WAIT_TILL_END = 0;

    const LAST_MATCHES = 5; // number of last matches displayed
    const columnAdjustment = 50; //adjust the size of the middle block of the page (the one that contains the league table)
    
    const CIRCLE = '\u2b24'; //Character used as coloured ball for each one of the last matches: ⬤
    const WIN_COLOR = '#0fdf0f'; // RGB color for WIN
    const DRAW_COLOR = '#bfbfbf'; // RGB color for DRAW
    const LOSE_COLOR = '#d01f0f'; // RGB color for LOSE
    const ONGOING_COLOR = '#ffbf3f' //RGB color for ONGOING MATCHES #ffff7f
    const LAST_HEADER = "Últimos"; // Last matches text
    const FONT_SIZE = "xx-small"; // size of the last match ball
    
    //==================================================
    // Functional variables, used to get and process match data.
    const LEAGUE = 1;
    const COUNTRY = 2;
    const DIVISION = 3;
    const GROUP = 4;
    const FIXTURES = '/ajax/fixtures.ajax.php';
    const WIN = 'W';
    const DRAW = 'D';
    const LOSE = 'L';
    const ONGOING = 'O';
    const TIME_REGEX = /\d{2}:\d{2}/;
    const SHOW_EVERYTHING = 0;
    const SHOW_MATCH_LINK = 1;
    const SHOW_NOTHING = 2;
    let now = new Date();
    let today = new Date(); today.setUTCHours(0,0,0,0);
    let endOffsetHours = 2;

    function adjustSize(width) {
        let adjust = $('.column2_a').width() + width;
        $('.column2_a').width(adjust);
        adjust = $('.main_center').width() + width;
        $('.main_center').width(adjust);
    }

    function addTableHeader() {
        let header = $('#league_table tbody tr').first();
        let streak = document.createElement('TH');
        streak.textContent = LAST_HEADER;
        $(streak).addClass('align_center');
        $(streak).addClass('header');

        header.append(streak);
    }
    function generateMatchsHistory() {
        let url = $('.content_menu .calendar').attr('href').split(`/`).filter(function (el) {
            return el.length > 0
        });
        console.log(url);
        var postobj = {
            'type': url[LEAGUE],
            'var1': url[COUNTRY],
            'var2': url.length > (DIVISION) ? url[DIVISION] : '',
            'var3': url.length > (GROUP) ? url[GROUP] : ''
        };
        console.log(postobj);
        $.post(FIXTURES,{
            'type': url[LEAGUE],
            'var1': url[COUNTRY],
            'var2': url.length > (DIVISION) ? url[DIVISION] : '',
            'var3': url.length > (GROUP) ? url[GROUP] : ''
        },function(data){
            if(data != null)
            {
                applyResults(data);
            }
        },'json');
    }

    function adjustHighlight(row) {
        row.children().last().removeClass('highlight_td_right');
    }
    function adjustBorder(cell) {
        cell.removeClass('highlight_td_right_std');
        cell.addClass('border_right');
    }
    function filterFixtures(data) {
        let months = [];
        let matches = [];
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                months.push(data[key]);
            }
        }
        for (let index = 0; index < months.length; index++) {
            const thisMonth = months[index];
            matches = matches.concat(thisMonth.matches.filter(function testUnPlayed(match) {
                return match.result != null;
            }));
        }
        return matches;
    }
    function getTeamResults(matches, team) {
        let results = [];
        for(let index = matches.length-1; index >= 0 && results.length < LAST_MATCHES; index--) {
            const match = matches[index];
            let score = match.result.split('-');
            score[0] = parseInt(score[0]);
            score[1] = parseInt(score[1]);
            let result = {};
            result.tooltip = match.hometeam_name + ' ' + match.result + ' ' + match.awayteam_name;
            let teamScore;
            let advScore;
            result.matchLink = $(match.match_link).attr('href');
            result.date = match.date;
            if(match.hometeam_name == team) {
                teamScore = 0;
                advScore = 1;
            }
            else if(match.awayteam_name == team) {
                teamScore = 1;
                advScore = 0;
            } else
                continue;
            
            result.finished = alreadyFinished(result.date);
            console.log("date: " + result.date);
            console.log("date: " + result.date);
            result.tooltip = match.hometeam_name + ' ' + match.result + ' ' + match.awayteam_name;
            if(!result.finished)
            {
                if(WAIT_TILL_END == SHOW_NOTHING)
                    continue;
                if(WAIT_TILL_END == SHOW_MATCH_LINK)
                {
                    result.tooltip = match.hometeam_name + ' - ' + match.awayteam_name;
                    result.result = ONGOING;
                }
            }
            else if(score[teamScore] > score[advScore])
                result.result = WIN;
            else if(score[teamScore] < score[advScore])
                result.result = LOSE;
            else
                result.result = DRAW;
            results.splice(0,0,result);
        }
        return results;
    }

    function applyResults(data) {
        let fixtures = filterFixtures(data);
        let teams = $('#league_table tbody td a');
        teams.each(function(index, team) {
            if(team.text.length == 0)
                return;
            let row = team.parentElement.parentElement;
            adjustBorder($(row).children().last());
            if($(row).children().first().hasClass('highlight_td')) {
                adjustHighlight($(row));
            }
            let streak = row.insertCell(-1);
            let results = getTeamResults(fixtures, team.textContent);
            $(streak).addClass('cell_padding');
            $(streak).addClass('highlight_td_right_std');
            $(streak).css('display', 'flex');
            $(streak).css('justify-content','space-between');
            $(streak).css('font-size', FONT_SIZE);
          
            $(streak).css('cursor', 'default');
            $(streak).disableSelection();
            for (const result of results) {
                let res = document.createElement('A');
                res.textContent = CIRCLE;
                $(res).attr('href', result.matchLink);
                $(res).attr('title', result.tooltip);
                console.log(result);
                switch (result.result) {
                    case WIN:
                        $(res).css('color', WIN_COLOR);
                        break;
                    case DRAW:
                        $(res).css('color', DRAW_COLOR);
                        break;
                    case LOSE:
                        $(res).css('color', LOSE_COLOR);
                        break;
                    case ONGOING:
                        $(res).css('color', ONGOING_COLOR);
                        break;
                    default:
                        break;
                }
                streak.appendChild(res);
            }
            if($(row).children().first().hasClass('highlight_td')) {
                $(streak).removeClass('highlight_td_right_std');
                $(streak).addClass('highlight_td_right');
                $(streak).addClass('highlight_td');
            }
        });
        adjustSize(columnAdjustment);
        addTableHeader();
    }
    
    function isToday(matchDay) { //Checks if the game is today or after
        console.log("isToday");
        console.log("matchDay: " + matchDay);
        let date = new Date(matchDay);
        console.log("date: " + date);
        console.log("today: " + today);
        console.log("date >= today: " + (date >= today));
        return date >= today;
    }
    
    function getEndGameTime() { //calculates the endGameTime (gameStart + offsetHours (default 2 hours))
        startGameTime = TIME_REGEX.exec($("#next_round strong").text())[0].trim().split(":");
        startGameTime[0] = Number(startGameTime[0]) + endOffsetHours;
        startGameTime[1] = Number(startGameTime[1]);
        let endGameTime = new Date();
        endGameTime.setHours(startGameTime[0],
            startGameTime[1],
            0);
        return endGameTime;
    }

    function alreadyFinished(matchDay) {//Checks if the game is already ended
        if(isToday(matchDay) && WAIT_TILL_END) {
            let gameEnd = getEndGameTime();
            let endTime = new Date();
            endTime.setUTCHours(gameEnd.getUTCHours(),
                gameEnd.getUTCMinutes(),
                gameEnd.getUTCSeconds());
            console.log("now: " + now);
            console.log("gameEnd: " + endTime);
            console.log("now: " + now);
            console.log("ja acabou: " + now >= endTime);
            return now >= endTime;
        }
        return true;
    }

    generateMatchsHistory();
})();