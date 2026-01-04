// ==UserScript==
// @name        TM League Match History
// @version     0.5
// @description Add last match results and link to the matchs in the league table.
// @author      Maycon Miranda - https://github.com/mayc0njr
// @namespace   https://trophymanager.com
// @include     https://trophymanager.com/league/
// @include     https://trophymanager.com/league/*
// @match       https://trophymanager.com/league/
// @match       https://trophymanager.com/league/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/415031/TM%20League%20Match%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/415031/TM%20League%20Match%20History.meta.js
// ==/UserScript==

(function () {

    const columnAdjustment = 50;
    const CIRCLE = '\u2b24';
    const WIN_COLOR = '#0fdf0f';
    const DRAW_COLOR = '#bfbfbf';
    const LOSE_COLOR = '#d01f0f';
    const LAST_MATCHES = 5;
    const LAST_HEADER = "Last5Results";
    const FONT_SIZE = "xx-small";
    const LETTER_SPACING = "2px";
    //==================================================
    const LEAGUE = 1;
    const COUNTRY = 2;
    const DIVISION = 3;
    const GROUP = 4;
    const FIXTURES = '/ajax/fixtures.ajax.php';
    const WIN = 'W';
    const DRAW = 'D';
    const LOSE = 'L';

    function adjustSize(width) {
        let adjust = $('.column2_a').width() + width;
        $('.column2_a').width(adjust);
        adjust = $('.main_center').width() + width;
        $('.main_center').width(adjust);
    }

    function addTableHeader() {
        let header = $('#overall_table thead tr');
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
            if(match.hometeam_name == team) {
                teamScore = 0;
                advScore = 1;
            }
            else if(match.awayteam_name == team) {
                teamScore = 1;
                advScore = 0;
            } else
                continue;
            if(score[teamScore] > score[advScore])
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
        let teams = $('#overall_table tbody td a');
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
            $(streak).css('letter-spacing', LETTER_SPACING);
          
            $(streak).css('cursor', 'default');
            $(streak).disableSelection();
            for (const result of results) {
                let res = document.createElement('A');
                res.textContent = CIRCLE;
                $(res).attr('href', result.matchLink);
                $(res).attr('title', result.tooltip);
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
    generateMatchsHistory();
})();