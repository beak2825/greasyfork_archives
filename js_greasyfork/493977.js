// ==UserScript==
// @name        TM Friendly League Chart by rounds CN
// @name:pt     TM Gráfico da liga amistosa por rodadas.
// @version     0.1.2024050201
// @description (WIP) Generates a chart with the friendly league ranking and changes by round.
// @description:pt (WIP) Gera um gráfico com a classificação da liga amistosa e alterações por rodada.
// @author      Irreal Madrid FC. Club ID: 4402745
// @namespace   https://github.com/mayc0njr/trophyManager/spoilers/
// @include     https://trophymanager.com/friendly-league/*
// @license     MIT
// @require     https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js
// @downloadURL https://update.greasyfork.org/scripts/493977/TM%20Friendly%20League%20Chart%20by%20rounds%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/493977/TM%20Friendly%20League%20Chart%20by%20rounds%20CN.meta.js
// ==/UserScript==
 
(function () {
 
    const LABEL_TEXTd = '第';
    const LABEL_TEXT = '轮';
    const BACKGROUND_COLOR = '#ffffff';
 
    //===================================================================
    // Functional variables, used to fetch and process match data.
    const LEAGUE = 2;
    const FIXTURES = '/ajax/fixtures.ajax.php';
    const TIME_REGEX = /\d{2}:\d{2}/;
    let now = new Date();
    const TODAY = new Date(); TODAY.setUTCHours(0,0,0,0);
    const TEAMS_SELECTOR = '#league_table tbody td a.normal';
    let endOffsetHours = 2;
    const CHART_HEIGHT = '600px';
    const CHART_WIDTH = '530px';
 
    function compareTeams(team1, team2) {
        if(team1.points != team2.points)
            return team1.points - team2.points;
 
        let team1Goals = team1.goalsFor - team1.goalsAgainst;
        let team2Goals = team2.goalsFor - team2.goalsAgainst;
        let goalsDifference = team1Goals - team2Goals;
        if(goalsDifference != 0)
            return goalsDifference;
        return team1.goalsFor - team2.goalsFor;
    }
 
    function getRandomColor() {
        return Math.floor(Math.random()*16777215).toString(16);
    }
 
    function generateChartHistory() {
        let url = $('.content_menu .calendar').attr('href').split(`/`).filter(function (el) {
            return el.length > 0
        });
        $.post(FIXTURES,{
            'type': 'friendly-league',
            'var1': url[LEAGUE],
            'var2': '',
            'var3': ''
        },function(data){
            if(data != null)
            {
                let historic = organizeHistoric(data);
                generateChart(historic);
 
            }
        },'json');
    }
 
    function generateDataset(team) {
        let label = team[0].name;
        let positions = team.map(round => round.position);
        let color = getRandomColor();
        return {label: label, data: positions, fill: false, borderColor: `#${color}`, tension: 0.1, backgroundColor: `#${color}`};
    }
    
    function getNumberOfMatches(numberOfTeams) {
        return (numberOfTeams-1)*2;
    }
 
    function generateChart(historic) {
        console.log("generate chart");
        let canvas = document.createElement('canvas');
        $(canvas).css('backgroundColor', BACKGROUND_COLOR);
        $('#league_table').parent().parent().append(canvas);
        console.log("$('#league_table').parent().parent()");
        console.log($('#league_table').parent().parent());
        console.log("$('#league_table')");
        console.log($('#league_table'));
        canvas.id = 'historyChart';
        let important =  ' !important';
        canvas.height = CHART_HEIGHT + important;
        canvas.width = CHART_WIDTH + important;
        const ctx = canvas.getContext("2d");
        let datasets=[];
        let labels = [];
        for(let i = 1; i <= historic[0].length ; i++) {
            labels.push(`${LABEL_TEXTd} ${i}${LABEL_TEXT}`);
        }
        historic.forEach(team => {
            datasets.push(generateDataset(team));
        });
        console.log(labels);
        console.log(datasets);
        const numberOfTeams = historic.length;
        const numberOfMatches = getNumberOfMatches(numberOfTeams);
        const historicChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                legend: {
                    position: 'bottom'
                },
                scales: {
                    xAxis: [
                        {
                            ticks: {
                                min: 1,
                                max: numberOfMatches,
                            },
                        }],
                    x: {
                        ticks: {
                            stepSize: 1,
                            min: 1,
                            max: numberOfMatches
                        }
                    },
                    yAxis: [
                        {
                            ticks: {
                                min: 1,
                                max: numberOfTeams,
                                maxTicksLimit: numberOfTeams,
                            },
                        },
                    ],
                    y: {
                        beginAtZero: false,
                        ticks: {
                            stepSize: 1,
                            min: 1,
                            max: numberOfTeams
                        }
                    }
                }
            }
        });
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
        matches.sort((m1, m2) => m1.date.localeCompare(m2.date))
        return matches;
    }
    function getTeamResults(matches, team) {
        teamMatches = matches.filter(match => match.hometeam_name === team || match.awayteam_name === team);
        let results = [];
        let lastResult = {
            played: 0,
            name: team,
            points: 0,
            wins: 0,
            draws: 0,
            loses: 0,
            goalsFor: 0,
            goalsAgainst: 0
        };
        for(let index = 0; index < teamMatches.length; index++) {
            let thisResult = {};
            const match = teamMatches[index];
            let score = match.result.split('-');
            score[0] = parseInt(score[0]);
            score[1] = parseInt(score[1]);
            let teamScore;
            let enemyScore;
            if(match.hometeam_name === team) {
                teamScore = 0;
                enemyScore = 1;
                thisResult.teamId = match.hometeam;
            }
            else if(match.awayteam_name === team) {
                teamScore = 1;
                enemyScore = 0;
                thisResult.teamId = match.awayteam;
            } else {
                break;
            }
            let finished = alreadyFinished(match.date);
            if(!finished)
                break;
            
            thisResult.wins = lastResult.wins;
            thisResult.draws = lastResult.draws;
            thisResult.points = lastResult.points;
            thisResult.loses = lastResult.loses;
            thisResult.name = lastResult.name;
 
            if(score[teamScore] > score[enemyScore]) {
                thisResult.points = lastResult.points + 3;
                thisResult.goalsFor = lastResult.goalsFor + score[teamScore];
                thisResult.goalsAgainst = lastResult.goalsAgainst + score[enemyScore];
                thisResult.wins = lastResult.wins + 1;
            }
            else if(score[teamScore] < score[enemyScore]) {
                thisResult.goalsFor = lastResult.goalsFor + score[teamScore];
                thisResult.goalsAgainst = lastResult.goalsAgainst + score[enemyScore];
                thisResult.loses = lastResult.loses + 1;
            }
            else {
                thisResult.points = lastResult.points + 1;
                thisResult.goalsFor = lastResult.goalsFor + score[teamScore];
                thisResult.goalsAgainst = lastResult.goalsAgainst + score[enemyScore];
                thisResult.draws = lastResult.draws + 1;
            }
            thisResult.played = lastResult.played + 1;
            thisResult.date = match.date;
            lastResult = thisResult;
            results.push(thisResult);
        }
        return results;
    }
 
    function organizeHistoric(data) {
        let fixtures = filterFixtures(data);
        let teams = $(TEAMS_SELECTOR);
        let resultsFull = [];
        teams.each(function(index, team) {
            if(team.text.length == 0)
                return;
            let results = getTeamResults(fixtures, team.textContent);
            resultsFull.push(results);
        });
        rounds = resultsFull[0].map((_, colIndex) => resultsFull.map(row => row[colIndex])); // transposing array of rounds per team, into array of teams per round.
        rounds.forEach(round => {
            givePositionForRound(round);
        });
        return resultsFull;
    }
    
    function isToday(matchDay) { //Checks if the game is today or after
        let date = new Date(matchDay);
        return date >= TODAY;
    }
 
    function givePositionForRound(round) {
        round.sort((team1, team2) => compareTeams(team2, team1));
        let lastTeam = null;
        let position = -1;
 
        for (let x=0; x < round.length; x++) {
            const team = round[x];
            if(!lastTeam)
                team.position = -1;
            else if(compareTeams(team, lastTeam) == 0)
                team.position = lastTeam.position;
            else
                team.position = position;
            
            position--;
            lastTeam = team;
        }
}    
 
    function getEndGameTime() { //calculates the endGameTime (gameStart + offsetHours (default 2 hours))
        let startGameTime = TIME_REGEX.exec($("#next_round strong").text())[0].trim().split(":");
        startGameTime[0] = Number(startGameTime[0]) + endOffsetHours;
        startGameTime[1] = Number(startGameTime[1]);
        let endGameTime = new Date();
        endGameTime.setHours(startGameTime[0],
            startGameTime[1],
            0);
        return endGameTime;
    }
 
    function alreadyFinished(matchDay) {//Checks if the game is already ended
        if(isToday(matchDay)) {
            let gameEnd = getEndGameTime();
            let endTime = new Date();
            endTime.setUTCHours(gameEnd.getUTCHours(),
                gameEnd.getUTCMinutes(),
                gameEnd.getUTCSeconds());
            return now >= endTime;
        }
        return true;
    }
 
    generateChartHistory();
})();