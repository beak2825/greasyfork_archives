// ==UserScript==
// @author       Bruno Moreira
// @name         SAGRES Ticket Scrapper
// @description  A script to scrap SAGRES' football quiz to easily win football matches tickets.
// @version      1.1.0
// @match        http://www.sagressomosfutebol.pt/pt/passatempos/*
// @namespace    https://greasyfork.org/users/107016
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery.countdown/2.2.0/jquery.countdown.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/27833/SAGRES%20Ticket%20Scrapper.user.js
// @updateURL https://update.greasyfork.org/scripts/27833/SAGRES%20Ticket%20Scrapper.meta.js
// ==/UserScript==

function solveQuiz(oldQuestionID) {
    $.ajax({
        url: '/base/contestService/GetActiveQuestion',
        type: 'post',
        dataType: 'json',
        data: { quizUmbracoNodeId: $('#quizUmbracoNodeId').val() },

        success: function (data) {
            if (data.Result.StatusCode === 0 && oldQuestionID != data.Result.UmbracoQuestionId) { // StatusCode -4 is for logged out user.
                console.log("TICKET SCRAPPER: Everything is OK. Proceeding...\n");
                console.log("TICKET SCRAPPER: Question: " + data.Result.Question + "\nAnswer 1: " + data.Result.Anwser1 + "\nAnswer 2: " + data.Result.Anwser2 + "\nAnswer 3: " + data.Result.Anwser3);

                var questionID = $('#questionUmbracoNodeId', $(data.Result.RenderedHtml)).val();
                var message = "";

                $.ajax({
                    url: '/base/contestService/AnwserQuestion',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        quizUmbracoNodeId: $('#quizUmbracoNodeId').val(),
                        questionUmbracoNodeId: questionID,
                        anwserId: "Answer1"
                    },

                    success: function (data) {
                        console.log("Answer 1:" + data.Result.StatusMsg);
                        message += "Resposta 1:" + data.Result.StatusMsg + "\n";
                        weborama();
                    }
                });

                $.ajax({
                    url: '/base/contestService/AnwserQuestion',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        quizUmbracoNodeId: $('#quizUmbracoNodeId').val(),
                        questionUmbracoNodeId: questionID,
                        anwserId: "Answer2"
                    },

                    success: function (data) {
                        console.log("Answer 2:" + data.Result.StatusMsg);
                        message += "Resposta 2:" + data.Result.StatusMsg + "\n";
                        weborama();
                    }
                });

                $.ajax({
                    url: '/base/contestService/AnwserQuestion',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        quizUmbracoNodeId: $('#quizUmbracoNodeId').val(),
                        questionUmbracoNodeId: questionID,
                        anwserId: "Answer3"
                    },

                    success: function (data) {
                        console.log("Answer 3:" + data.Result.StatusMsg);
                        message += "Resposta 3:" + data.Result.StatusMsg + "\n";
                        weborama();
                    }
                });

                setTimeout(function () {
                    doMessageBar(message);
                }, 2000);
            } else {
                solveQuiz(oldQuestionID);
            }
        }
    });
}

(function() {
    'use strict';

    if ($("div.login-holder").hasClass("log-out") && !$(".hobby-info-text").text().includes("Faltam") && !$(".hobby-info-text").text().includes("já terminou!")) {
        var oldQuestionID = -1;
        var countdownStarted = false;

        $.ajax({
            url: '/base/contestService/GetActiveQuestion',
            type: 'post',
            dataType: 'json',
            data: { quizUmbracoNodeId: $('#quizUmbracoNodeId').val() },

            success: function (data) {
                oldQuestionID = data.Result.UmbracoQuestionId;
            }
        });

        $(".quiz-holder .quiz-holder-info .button-holder").css("margin", "0");
        $(".quiz-holder .quiz-holder-info .info-text").css("max-width", "510px");
        $("a.button-holder").after('<a id="scriptButton" class="button-holder button-small" style="position: absolute; top: 0; right: 0;"><span></span><div class="btn-part-init">Correr Ticket Scrapper</div></a>');
        $(".button-holder").css({"min-height": "88px", "max-height": "88px"});

        $("#scriptButton").click(function () {
            if (!countdownStarted) {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours() + 1;
                month = month >= 10 ? month : "0" + month;
                day = day >= 10 ? day : "0" + day;
                hour = hour < 10 ? 10 : hour;
                $("div", this).countdown(`${year}/${month}/${day} ${hour}:00:00`, function (e) {
                    $(this).text(e.strftime('A começar em %H:%M:%S'));
                }).on('finish.countdown', function () {
                    solveQuiz(oldQuestionID);
                    $(this).text("A CORRER SCRIPT...");
                });
                countdownStarted = true;
            }
        });
    }
})();