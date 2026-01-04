// ==UserScript==
// @name         Combat CoinBrawl
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simule les combats sur coinbrawl
// @author       You
// @match        https://www.coinbrawl.com/arena
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37695/Combat%20CoinBrawl.user.js
// @updateURL https://update.greasyfork.org/scripts/37695/Combat%20CoinBrawl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        var oldMax = new Array();
        oldMax.score = 0;
        var countLoad = 0;

        function combat(satoshi){
            var tableau = new Array();
            var max = new Array();
            max["score"] = 0;
            max["win"] = 0;
            for (var i = 0; i < 5; i++) {
                var element = new Array();
                element.gold = $('.btn-primary:eq('+i+')').parent().parent().find('td:eq(3)').text();
                element.win = parseInt($('.btn-primary:eq('+i+')').parent().parent().find('td:eq(2)').text().replace("%",""),10);
                element.score = element["gold"]*(element["win"]/100);
                element.button = $('.btn-primary:eq('+i+')').parent().parent().find('td:eq(4)').find('a');
                if(satoshi)
                {
                    if(element.win > max.win)
                        max = element;
                }
                else
                {
                    if(element.score > max.score)
                        max = element;
                }
                tableau.push(element);
            }
            if(max.score == oldMax.score)
            {
                countLoad++;
                if(countLoad>5)
                {
                    localStorage.setItem('load', satoshi);
                    location.reload(true);
                }
            }
            else
            {
                countLoad = 0;
            }
            oldMax.score = max.score;
            max.button.get(0).click();

        }
        $("#battle-table").prepend("&nbsp;&nbsp;<button class='btn btn-success' id='battle-auto'>Combat auto</button><br/><br/>");
        $("#battle-table").prepend("<button class='btn btn-success' id='battle-satoshi'>Combat auto satoshi</button>");
        $("#battle-satoshi").click(function(){
            setInterval(combat,1500,true);
        });
        $("#battle-auto").click(function(){
            setInterval(combat,1500,false);
        });
        var load = localStorage.getItem('load');
        if(load != null)
        {
             localStorage.removeItem('load');
             setInterval(combat,1500,load);
        }


      });
})();