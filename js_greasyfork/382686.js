// ==UserScript==
// @name         ML Real-Q and Fitness
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modifies Team Selection page to include Real Q of players and their expected fitness after next training session
// @author       Fathima Ruqiya (https://www.facebook.com/fathima.ruqiya.9)
// @match        https://www.managerleague.com/ml/team.pl*
// @run-at       document-idle
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/382686/ML%20Real-Q%20and%20Fitness.user.js
// @updateURL https://update.greasyfork.org/scripts/382686/ML%20Real-Q%20and%20Fitness.meta.js
// ==/UserScript==

this.$ = window.jQuery.noConflict(true);

$(function() {
    'use strict';

    removeTS();
    remainingFitness();
    realQ();

    //if (/team.pl/.test(window.location.href)){
    //    page_TeamSelection();
    //}
});

function removeTS(){
    $(".tsplayertransfer").remove();
}

function realQ(){
    $("[id^='player_row_']").each(function() {
        atts = $(this).find(".tsplayeratt");

        if($(this).is("[class*='tsplayerblue']")){
            realQ = $(atts[1]).text()/3 + $(atts[6]).text()/6 + $(atts[3]).text()/12 + $(atts[7]).text()/12 + $(atts[9]).text()/12 + $(atts[8]).text()/4;
        }else if($(this).is("[class*='tsplayergreen']")){
            realQ = $(atts[2]).text()/3 + $(atts[3]).text()/6 + $(atts[6]).text()/6 + $(atts[7]).text()/6 + $(atts[5]).text()/12 + $(atts[9]).text()/12;
        }else if($(this).is("[class*='tsplayeryellow']")){
            realQ = $(atts[3]).text()/3 + $(atts[2]).text()/6 + $(atts[4]).text()/6 + $(atts[6]).text()/6 + $(atts[7]).text()/12 + $(atts[9]).text()/12;
        }else if($(this).is("[class*='tsplayerred']")){
            realQ = $(atts[4]).text()/3 + $(atts[5]).text()/6 + $(atts[6]).text()/6 + $(atts[8]).text()/6 + $(atts[3]).text()/12 + $(atts[9]).text()/12;
        }

        realQ = realQ + 0.5;
        $(atts[0]).text(Number(realQ).toFixed(3));
        $(atts[0]).width(35);
    });

    header = $(".tsplayertop").find(".tsplayeratt");
    $(header[0]).width(35);
}

function remainingFitness(){
    $("[id^='player_row_']").each(function() {
        atts = $(this).find(".tsplayeratt");
        fit = $(this).find("[id^='player_fit_']");

        fit_cur = $(fit).text() * 1;
        fit_rem = (fit_cur + Math.floor($(atts[7]).text()/10) - 98);

        $(fit).append(formatAttribute(fit_rem));
        $(fit).width(30);
    });

    $(".tsplayerfit").width(30);
}

function formatAttribute(att){
    color = (att < 0 ? "#ff0000" : (att > 0 ? "#00ff00" : "#ffff00"));
    att_withSign = (att >= 0 ? ("+" + att) : att);

    return "<span style='font-size:0.8em;color:" + color + "'>" + att_withSign + "</span>";
}