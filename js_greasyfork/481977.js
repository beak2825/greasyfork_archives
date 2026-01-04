// ==UserScript==
// @name         QuizWise Correct Answer Override
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make any answer correct on QuizWise quizzes.
// @author       Your Name
// @match        https://www.quizwise.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481977/QuizWise%20Correct%20Answer%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/481977/QuizWise%20Correct%20Answer%20Override.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addScript(content) {
        const script = document.createElement('script');
        script.textContent = content;
        document.body.appendChild(script);
    }

    // Override the checkAnswer function after the original script has loaded
    function overrideCheckAnswer() {
        addScript(`
        const originalCheckAnswer = window.checkAnswer;
        if (originalCheckAnswer) {
            window.checkAnswer = function(t, e) {
                var r = $("#" + e);
                if (r.hasClass("hide")) {
                    var o = r.attr("qs")
                    , n = t.attr("index")
                    , a = jsonParse(rc4Decrypt(o, hexDecode(r.attr("qd"))))
                    , s = $(t).attr("index")
                    , i = a.correctAnswerId
                    , c = true
                    , l = [null, r.find(".answer1"), r.find(".answer2"), r.find(".answer3"), r.find(".answer4")]
                    , d = l[i].find(".answerText").css("color", "#008800").html()
                    , u = c ? '<img src="/content/images/tick.png" alt="" />' : '<img src="/content/images/cross.png" alt="" />';
                    r.find(".questionIndex").html(r.find(".questionIndex").html() + u),
                        l[s].find(".answerButton").addClass(c ? "correctAnswer" : "wrongAnswer"),
                        $(r).find(".questionInfoAnswer").html("<strong>Correct Answer:</strong> " + d),
                        c && totalCorrect++,
                        r.addClass("reveal").removeClass("hide"),
                        totalAnswered++,
                        refreshScores();
                    var x = r.find(".questionInfoMore").attr("content");
                    if (x && r.find(".questionInfoMore").html('<p class="moreInfoText">' + rc4Decrypt(o, hexDecode(x)) + "</p>").show(),
                        r.find(".questionExtra").slideDown("3000", "linear"),
                        $("#slidingResultPanel").length > 0) {
                        var f = $("#slidingResultPanel").position().top
                        , m = r.position().top + 70
                        , g = Math.abs(m - f);
                        $("#slidingResultPanel").stop().animate({
                            top: m
                        }, g, "easeOutQuart")
                    }
                    $.ajax({
                        type: "POST",
                        url: ajaxRoot + "/quiz-actions/submit-answer",
                        data: "quizId=" + qz + "&instanceId=" + iid + "&questionId=" + o + "&index=" + n + "&result=" + c,
                        dataType: "text"
                    }),
                        reportEventWithValue("Quiz", "Answer", qz, parseInt(n)),
                        ended || totalAnswered != totalQuestions || endQuiz()
                }
            };
         }
     `);
    }

    // Start the override process
    overrideCheckAnswer();
})();