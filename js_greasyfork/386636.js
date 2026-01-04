// ==UserScript==
// @name         Investigation Template
// @namespace    https://epicmafia.com/
// @version      0.1
// @description  output a template for a cheating investigation on someone
// @author       shady12 (based on january's comp match)
// @match        https://epicmafia.com/round*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386636/Investigation%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/386636/Investigation%20Template.meta.js
// ==/UserScript==

// type User = {
//     name: string;
//     id: number;
//     games: Game[];
// }

// type Game = {
//     id: number;
//     roleid: number;
//     score: number | string;
//     outcome: string;
// }

(function() {
    'use strict';
    //console.log("Export Investigation");
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

   var uiText = "<div id='compInvestigation'> <h3 style='margin-bottom: 10px;'>Download an investigation template!</h3>"
                +"<form class='form' id='invForm' style='margin-left: 7px;margin-bottom: 10px;'><div class='search'><div class='search-icon'><i class='icon-search'></i></div>"
                +"<input autocomplete='off' id='investigationSearch' placeholder='Player name' type='text' style='border: 1px solid #777;'/></div></form>"
                +"<div id='downloadingReport' style='text-align: center; display: none;'><br /> <img src='http://i.imgur.com/1keL4Ac.gif' width='25' /></div></div>";

    var findId = function (user, cb) {
        var id;
        if (!parseInt(user.name)) {
            $.get("https://epicmafia.com/user/search?q=" + user.name, function (queryResults) {
                queryResults = queryResults.data;
                if (queryResults.length > 0) {
                    user.id = queryResults[0].id;
                    console.log(user.name + ': ' + user.id);
                    cb(user);
                }
                else {
                    alert("User " + user.name + " not found!");
                    $("#downloadingReport").hide();
                    throw new Error("User not found");
                }
            });
        }
        else {
            cb(user);
        }
    };

    var getOpponents = function (user, callback){
        var queryUrl = "https://epicmafia.com/round/" + round + "/user/" + user.id + "/opponents";
        $.get(queryUrl, function (response) {
            var data = JSON.parse(response).data;
            var playerData = data.split("teeny.jpg'/> ")
            playerData.shift();
            var players = playerData.map( player => {
                var endNameIndex = player.indexOf("<");
                var playerName = player.substring(0, endNameIndex);
                var restOfData = player.substring(endNameIndex + 34);

                var endGamesPlayed = restOfData.indexOf("</");
                var gamesPlayed = restOfData.substring(0, endGamesPlayed);
                restOfData = restOfData.substring(endGamesPlayed);

                var begin = restOfData.indexOf("\">");
                restOfData = restOfData.substring(begin);
                var end = restOfData.indexOf("</");
                var mutualWins = restOfData.substring(2, end);
                restOfData = restOfData.substring(end);

                begin = restOfData.indexOf("\">");
                restOfData = restOfData.substring(begin);
                end = restOfData.indexOf("</");
                var mutualLosses = restOfData.substring(2, end);
                restOfData = restOfData.substring(end);

                begin = restOfData.indexOf("\">");
                restOfData = restOfData.substring(begin);
                end = restOfData.indexOf("</");
                var winsOverOpponent = restOfData.substring(2, end);
                restOfData = restOfData.substring(end);

                begin = restOfData.indexOf("\">");
                restOfData = restOfData.substring(begin);
                end = restOfData.indexOf("</");
                var opponentWins = restOfData.substring(2, end);
                restOfData = restOfData.substring(end);

                begin = restOfData.indexOf("\">");
                restOfData = restOfData.substring(begin);
                end = restOfData.indexOf("</");
                var gamesNotCompleted = restOfData.substring(2, end);
                restOfData = restOfData.substring(end);
                return {
                    name: playerName,
                    gamesPlayed,
                    mutualWins,
                    mutualLosses,
                    winsOverOpponent,
                    opponentWins,
                    gamesNotCompleted
                };
            })
            callback(players);
        });
    }

    var getGames = function (user, pageNumber, callback) {
        var queryUrl = "https://epicmafia.com/round/" + round + "/user/" + user.id + "/game/page?page=" + pageNumber;
        $.get(queryUrl, function (data) {
            data = data.data;
            for (var index in data) {
                var game = {
                    id: data[index].id,
                    roleid: data[index].roleid,
                    score: data[index].score,
                    outcome: ""
                };
                if (data[index].win == true){
                    game.outcome = "W";
                }else if(data[index].lose == true){
                    game.outcome = "L";
                }else{
                    game.outcome = "Sui";
                    game.score = "X";
                }
                user.games.push(game);
            }
            if (data.length == 10) {
                getGames(user, pageNumber + 1, callback);
            }
            else {
                console.log(user.games)
                callback();
            }
        });
    };

    var round = $("#breadcrumb span:contains('Round')").text().split(" ")[1];

    $('.container26').append('<div class="grid26" id="bin" style="display: none"></div>')

    $("#round_middle").prepend(uiText);
    $("#invForm").submit(function (e) {
        e.preventDefault();
        $("#downloadingReport").show();
        //$('#alignFilter').show()

        var input = $("#investigationSearch").val();
        var user = {
            name: input,
            games: []
        }
        var templateText = "This Cheating Investigation is done on " + user.name + " by __________ for Round " + round + ".\n"
                + "\n"
                + "This is a summary of games by this player this round with analysis by a role mod.\n"
                + "\n"
                + "Section 1:\n"
                + "Most commonly played with players (and outliers)\n"
                + "\n"
                + "\n";
        console.log(user);
        console.log('displaying 1-user statistics')
        findId(user, function (userWithId) {
            user = userWithId;
            getOpponents(user, function(players) {
                players = players.slice(0, 5);
                templateText += "Player Name         Games Played        Mutual Wins        Mutual Losses       Wins Over           Opponent Wins       Not Completed       \n";
                players.forEach(player => {
                    templateText += player.name;
                    for (var i = player.name.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.gamesPlayed;
                    for (var i = player.gamesPlayed.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.mutualWins;
                    for (var i = player.mutualWins.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.mutualLosses;
                    for (var i = player.mutualLosses.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.winsOverOpponent;
                    for (var i = player.winsOverOpponent.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.opponentWins;
                    for (var i = player.opponentWins.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += player.gamesNotCompleted;
                    for (var i = player.gamesNotCompleted.length; i < 20; ++i){
                        templateText += " ";
                    }
                    templateText += "\n";
                });
                templateText += "\n";
                getGames(user, 1, function() {
                    templateText += "Section 2:\n"
                    + "\n"
                    + "Summary of Games:\n"
                    + "\n";
                    for (var gameIndex = user.games.length-1; gameIndex >=0; gameIndex--) {
                        var gameText = "Game " + user.games[gameIndex].id + ": (https://epicmafia.com/game/" + user.games[gameIndex].id + "/review)\n\n"
                        + "Role: " + user.games[gameIndex].roleid + "\n"
                        + "Outcome: ";
                        if(user.games[gameIndex].outcome == 'W'){
                        gameText += "win\n";
                        }else if(user.games[gameIndex].outcome == 'L'){
                            gameText += "loss\n";
                        }else{
                            gameText += "suicide/veg\n\n";
                        }
                        gameText += "Facts: \n\n";
                        gameText += "Analysis: \n\n";
                        templateText += gameText;
                    }
                    templateText += "Section 3:\n\n";
                    templateText += "Overall Analysis:\n\n";
                    templateText += "Verdict:\n\n\n";
                    templateText += "Section 4:\n\n";
                    templateText += "Checklist for report submission\n\n";
                    templateText += "[] I have separated facts of the games from my analysis of the games.\n";
                    templateText += "[] I included all games in my analysis.\n";
                    templateText += "[] I consulted with other role moderators and took a vote on whether this was sufficient enough\n";
                    $("#downloadingReport").hide();
                    download(user.name + "-investigation-round" + round + ".txt", templateText);
                })
            });
        })
    });
})();