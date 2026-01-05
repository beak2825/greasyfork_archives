// ==UserScript==
// @name         Shiki Rating
// @namespace    http://shikimori.org/
// @version      1.3.0
// @description  Rating from shiki users
// @author       ImoutoChan
// @match        http://shikimori.org/*
// @match        https://shikimori.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29807/Shiki%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/29807/Shiki%20Rating.meta.js
// ==/UserScript==

var func = function() {
    'use strict';

    var urlpart = window.location.pathname.substring(0,7);
    if (urlpart == "/animes" || urlpart == "/mangas")
    {
        if ($(".scores > .b-rate").length > 1)
        {
            return;
        }

        var newRate = $(".scores > .b-rate").clone();
        newRate.attr('id', 'shiki-score');
        newRate.appendTo(".scores");

        var scoreData = jQuery.parseJSON($("#rates_scores_stats").attr("data-stats"));

        var sumScore = 0;
        var totalCount = 0;
        for (var i = 0; i < scoreData.length; i++)
        {
            sumScore += scoreData[i].value * scoreData[i].name;
            totalCount += scoreData[i].value;
        }

        var shikiScore = sumScore / totalCount;


        for (i = 0; i < 10; i++)
        {
            $("#shiki-score > div.text-score > div.score-value.score-" + i).removeClass("score-" + i);
        }
        $("#shiki-score > div.text-score > div.score-value").html(shikiScore.toFixed(2));
        $("#shiki-score > div.text-score > div.score-value").addClass("score-" + Math.round(shikiScore));

        for (i = 0; i < 10; i++)
        {
            $("#shiki-score > div.stars-container > div.stars.score.score-" + i).removeClass("score-" + i);
        }
        $("#shiki-score > div.stars-container > div.stars.score").attr('style', 'color: #456 !important;');
        $("#shiki-score > div.stars-container > div.stars.score").addClass("score-" + Math.round(shikiScore));

        var labelData = $('body').attr('data-locale') === 'ru' ?
                JSON.parse('{"0":"","1":"Хуже некуда","2":"Ужасно","3":"Очень плохо","4":"Плохо","5":"Более-менее","6":"Нормально","7":"Хорошо","8":"Отлично","9":"Великолепно","10":"Эпик вин!"}') :
                JSON.parse('{"0":"","1":"Worst Ever","2":"Terrible","3":"Very Bad","4":"Bad","5":"So-so","6":"Fine","7":"Good","8":"Excellent","9":"Great","10":"Masterpiece!"}');

        $("#shiki-score > div.text-score > div.score-notice").text(labelData[Math.round(shikiScore)]);
    }
};

$(document).bind('mouseup mousemove ready', function(){
    func();
});

$(document).ready(func);
$(document).on('page:load', func);
$(document).on('turbolinks:load', func);
