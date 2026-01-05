// ==UserScript==
// @name         Proiezioni live
// @namespace    http://muccoland.net
// @version      1.2.3
// @description  adding useful numbers to fg live page
// @author       mucco
// @match        http://leghe.fantagazzetta.com/*/live*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23396/Proiezioni%20live.user.js
// @updateURL https://update.greasyfork.org/scripts/23396/Proiezioni%20live.meta.js
// ==/UserScript==

var scores = $("<div class='col-lg-12 darkgreybox'></div>");
var home = $("<div class='col-lg-4' style='font-size: 18px'></div>");
var away = $("<div class='col-lg-4 aight' style='text-align: right; font-size: 18px'></div>");
scores.append(home);
scores.append("<div class='col-lg-4' style='text-align: center; font-size: 18px'>Proiezioni</div>");
scores.append(away);
var container = $(".itemBox")[1];
var teams = container.children[0];
scores.insertAfter(teams);

var subs;
var formations = ["343", "352", "433", "442", "451", "532", "541"];

setInterval(function() {
    $(".sh").css("color", "grey");
    $(".sh").css("font-weight", "normal");
    
    var hScore = 0;
    var aScore = 0;
    
    homeLineup = lineup(true);
    awayLineup = lineup(false);
    for (var i = 0; i < 11; i++) {
        var row = $(homeLineup[i]);
        if (!rowPlayed(row)) {
            hScore += 6;
            continue;
        }
        
        row.find(".sh").css("font-weight", "bold");
        row.find(".sh").css("color", "black");
        hScore += rowScore(row);
    }
    home.html("<strong>" + goals(hScore) + "</strong> (" + hScore + ")");

    for (var i = 0; i < 11; i++) {
        var row = $(awayLineup[i]);
        if (!rowPlayed(row)) {
            aScore += 6;
            continue;
        }
        
        row.find(".sh").css("font-weight", "bold");
        row.find(".sh").css("color", "black");
        aScore += rowScore(row);
    }
    away.html("(" + aScore + ") <strong>" + goals(aScore) + "</strong>");
}, 1000);

function lineup(home) {
    var players;
    subs = 0;
    if (home)
        players = $(".playerrow").slice(0, $(".playerrow").length / 2);
    else
        players = $(".playerrow").slice($(".playerrow").length / 2, $(".playerrow").length);
    
    for (var i = 0; i < 11; i++) {
        if (!rowPlayed($(players[i])))
            sub(players, i);
    }
    
    return players;
}

function validFormation(players) {
    var formation = [0, 0, 0];
    for (var i = 0; i < 11; i++) {
        if ($(players[i]).find(".role").html() == "D")
            formation[0]++;
        if ($(players[i]).find(".role").html() == "C")
            formation[1]++;
        if ($(players[i]).find(".role").html() == "A")
            formation[2]++;
    }
    
    formation = "" + formation[0] + formation[1] + formation[2];
    
    return formations.indexOf(formation) >= 0;
}

function sub(players, out) {
    if (players.length != 18)
        return; // disabling subs for mantra
    
    if (subs == 3)
        return;
    
    for (var i = 11; i < players.length; i++) {
        var s = $(players[i]);
        if (!rowPlayed(s))
            continue;
        
        if (s.find(".role").html() != $(players[out]).find(".role").html())
            continue;
        
        var exit = players[out];
        players[out] = s;
        players[i] = exit;
        subs++;
        return;
    }
    
    for (var i = 11; i < players.length; i++) {
        var s = $(players[i]);
        if (!rowPlayed(s))
            continue;
        
        var exit = players[out];
        players[out] = s;
        
        if (!validFormation(players)) {
            players[out] = exit;
            continue;
        }
        
        players[i] = exit;
        subs++;
        return;
    }
}

function goals(score) {
    return Math.max(Math.floor((score - 66) / 4) + 1, 0);
}

function rowPlayed(row) {
    var vote = row.find("td:last").find("span").html().replace(",", ".");
    return !isNaN(vote);
}

function rowScore(row) {
    if (!rowPlayed(row))
        return 0;
    
    var score = +row.find("td:last").find("span").html().replace(",", ".");
    
    score += 3 * (row.html().match(/rigoresegnato/g) || []).length;
    score -= 3 * (row.html().match(/rigoresbagliato/g) || []).length;
    score += 3 * (row.html().match(/rigoreparato/g) || []).length;
    score += 3 * (row.html().match(/golfatto/g) || []).length;
    score -= 1 * (row.html().match(/golsubito/g) || []).length;
    score -= 0.5 * (row.html().match(/amm.png/g) || []).length;
    score -= 1 * (row.html().match(/esp_s.png/g) || []).length;
    score += 1 * (row.html().match(/assist_s.png/g) || []).length;
    score += 1 * (row.html().match(/assistf_s.png/g) || []).length;
    score -= 2 * (row.html().match(/autogol_s/g) || []).length;
    
    return score;
}