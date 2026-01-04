// ==UserScript==
// @name         crack_gooboo
// @namespace    http://tampermonkey.net/
// @version      0.18
// @description  try to crack gooboo
// @author       niushuai233
// @match        https://gityxs.github.io/gooboo/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495768/crack_gooboo.user.js
// @updateURL https://update.greasyfork.org/scripts/495768/crack_gooboo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var answering = false;
    var ansInterval;
    var ansSec = 0;

    $(".v-toolbar__content").prepend('<button id="autoAnswerME" style="margin-right: 10px; margin-left: 10px;">开启自动答题</button>');
    $(".v-toolbar__content").prepend('<button id="answerME" style="margin-right: 10px; margin-left: 10px;">开始答题</button>');

    var study = false;
    var studyInterval;
    $("#autoAnswerME").click(function() {
        if (study) {
            // 停止
            study = false;
            runOnce(true);
        } else {
            // 开启
            study = true;
            // 定时触发
            studyInterval = setInterval(runOnce, 5000, false);
        }
    });

    function runOnce(stop) {
        if (stop) {
            // 终止答题
            clearInterval(studyInterval);
            $("#autoAnswerME").html("开启自动答题");
        } else {
            // 开启答题
            var item = undefined;
            document.querySelectorAll(".v-btn__content").forEach(e => {
                if ('学习' === $(e).html()) {
                    item = $(e);
                }
            })
            if (!item) {
                return;
            }
            item.click();
            setTimeout(startAnswer, 1000);
            $("#autoAnswerME").html("停止自动答题");
        }
    }

    $("#answerME").click(function() {
        if (study) {
            // 终止答题
            stopAnswer();
        } else {
            // 开启答题
            startAnswer();
        }
    });

    function startAnswer() {
        // 开启答题
        answering = true;

        // 判定多少秒后停止
        //ansSec = prompt("需要多少秒");

        setTimeout(stopAnswer, 30 * 1000)

        $("#answerME").html("终止答题");
        ansInterval = setInterval(answerOnce, 300);
    }

    function stopAnswer() {
        // 终止答题
        answering = false;
        clearInterval(ansInterval);
        $("#answerME").html("开始答题");
    }

    function answerOnce() {
        // 获取答案
        var ansElem = $("#answer-input-math");
        if (!!!ansElem) {
            stopAnswer();
            return;
        }
        var htm = $(".question-text").html();
        var ansVal;
        if (htm.startsWith("√")) {
            ansVal = Math.sqrt(htm.replace("√",""));
            $(ansElem[0]).val(ansVal);
        } else {
            ansVal = eval(htm);
            $(ansElem[0]).val(ansVal);
        }

        var event = new InputEvent('input', {
            'bubbles': true,
            'cancelable': true
        });
        ansElem[0].dispatchEvent(event);

        // 提交答案
        var btnElem = $(".ma-1.v-btn.v-btn--is-elevated");
        $(btnElem[0]).click();
    }

})();