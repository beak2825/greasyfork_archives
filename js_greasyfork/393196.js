// ==UserScript==
// @name         vClass Examing Frame
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://vclass.neusoft.edu.cn/exam/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393196/vClass%20Examing%20Frame.user.js
// @updateURL https://update.greasyfork.org/scripts/393196/vClass%20Examing%20Frame.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $.get($(document)[0].location.href.replace("examing", "report"), (data) => {
        var newDocument = (new DOMParser()).parseFromString(data, 'text/html');
        let questons = document.getElementsByClassName("question-opt-list")
        ,answers = newDocument.getElementsByClassName("answer_value");
        for (var i = questons.length - 1; i >= 0; i--) {
            console.log("Question" + i);
            switch(answers[i].innerText) {
                case "正确":
                    $("input", questons[i])[0].checked = true;break;
                case "错误":
                    $("input", questons[i])[1].checked = true;break;
                case "A":
                    $("input", questons[i])[0].checked = true;break;
                case "B":
                    $("input", questons[i])[1].checked = true;break;
                case "C":
                    $("input", questons[i])[2].checked = true;break;
                case "D":
                    $("input", questons[i])[3].checked = true;break;
            }
        }
    })
})();
