// ==UserScript==
// @name         ShogiClub24 result viewer
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  将棋倶楽部24の戦績を可視化します。
// @author       sugarAsalt
// @license      MIT
// @supportURL   https://twitter.com/sugarAsalt
// @match        https://www.shogidojo.net/shogi24kifu/search/
// @icon         https://www.google.com/s2/favicons?domain=shogidojo.net
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.js
// @require      https://cdn.jsdelivr.net/npm/chart.js@3.5.1/dist/chart.min.js

// @downloadURL https://update.greasyfork.org/scripts/431241/ShogiClub24%20result%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/431241/ShogiClub24%20result%20viewer.meta.js
// ==/UserScript==
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */


(function() {
    'use strict';

    $('<div id="visualize" style="display: flex;flex-wrap:wrap;justify-content: flex-start;"></div>').insertAfter('#search_wrapper');
    $('<div class="chart-container1" style="position: relative;height: 200px;flex: 0 0 auto;width: 20%;"><canvas id="winrate"></canvas></div>').appendTo("#visualize")
    $('<div class="chart-container3" style="position: relative;height: 200px;flex: 0 0 auto;width: 20%;"><canvas id="firstLog"></canvas></div>').appendTo("#visualize")
    $('<div class="chart-container4" style="position: relative;height: 200px;flex: 0 0 auto;width: 20%;"><canvas id="secondLog"></canvas></div>').appendTo("#visualize")
    $('<div class="chart-container2" style="position: relative;height: 300px;flex: 0 0 auto;width: 60%;"><canvas id="rate"></canvas></div>').appendTo("#visualize")


    var user = $('input[name="name1"]').val();
    var matches = [];
    function resultParser(res){
        var match = {}
        match.decided = true
        if(user === $(res[5])[0].outerText){
            match.turn = "First"
            match.R = parseInt($($(res[4])[0])[0].outerText)
            if($($(res[6]).children()[0]).hasClass("fa-circle")){match.win=true;}
            else if($($(res[6]).children()[0]).hasClass("fa-times")){match.win=false;}
            else{match.decided=false}
        }else{
            match.R = parseInt($($(res[7])[0])[0].outerText)
            match.turn = "Second"
            if($($(res[6]).children()[1]).hasClass("fa-circle")){match.win=true;}
            else if($($(res[6]).children()[1]).hasClass("fa-times")){match.win=false;}
            else{match.decided=false}
        }
        match.date = $(res[3])[0].outerText.split(' ')[0]
        match.time = $(res[2])[0].outerText
        match.kind = $(res[1])[0].outerText
        return match
    }

    var turn = []
    var win = []
    var rate = []
    var date = []
    var time = []
    var kind = []
    var label = []
    var firstWin = 0;
    var firstLose = 0;
    var secondWin = 0;
    var secondLose = 0;
    $("#kifuresultTable tbody tr").each(function(){
        var result = $(this).children();
        var res = resultParser(result)
        if(res.decided){
            turn.push(res.turn)
            win.push(res.win)
            rate.push(res.R)
            date.push(res.date)
            kind.push(res.kind)
            time.push(res.time)
            label.push("")
            if(res.turn==="First"){
                if(res.win){firstWin+=1}
                else{firstLose+=1}
            }
            else{
                if(res.win){secondWin+=1}
                else{secondLose+=1}
            }
        }
    })
    var winrate = $("#winrate")
    var winratechart = new Chart(winrate,{
        type:"pie",
        options: {
            mainteinAspectRatio:false,
            plugins: {
                title:{
                    display:true,
                    text:"この期間の勝率("+String(win.length)+"局)",
                }
            }
        },
        data:{
            labels:["win","lose"],
            datasets:[
                {
                    backgroundColor:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],
                    data:[win.filter(function(x){return x}).length,win.filter(function(x){return !x}).length]}]
        }
    })
    var ratehistory = $("#rate")
    var ratehistorychart = new Chart(ratehistory,{
        type:"line",
        options:{
        },
        data:{
            labels: label,
            datasets: [{
                label: 'Rate history',
                data: rate.reverse(),
                borderColor: 'rgba(255, 100, 100, 1)',
                lineTension: 0,
                fill: false,
                borderWidth: 3
            }]
        }
    })

    var firstLog = $("#firstLog")
    var firstlogchart = new Chart(firstLog,{
        type:"pie",
        options: {
            mainteinAspectRatio:false,
            plugins: {
                title:{
                    display:true,
                    text:'先手番勝率('+String(firstWin+firstLose)+"局)",
                }
            }
        },
        data:{
            labels: ["win","lose"],
            datasets: [{
                data: [firstWin,firstLose],
                backgroundColor:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],
                lineTension: 0,
                fill: false,
                borderWidth: 3
            }]
        }
    })

    var secondLog = $("#secondLog")
    var secondlogchart = new Chart(secondLog,{
        type:"pie",
        options: {
            mainteinAspectRatio:false,
            plugins: {
                title:{
                    display:true,
                    text:'後手番勝率('+String(secondWin+secondLose)+"局)",
                }
            }
        },
        data:{
            labels: ["win","lose"],
            datasets: [{
                data: [secondWin,secondLose],
                backgroundColor:["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"],
                lineTension: 0,
                fill: false,
                borderWidth: 3
            }]
        }
    })


})();