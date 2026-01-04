// ==UserScript==
// @name         JOJ Simple Diff
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make your life easier when comparing the results in JOJ!
// @author       BoYanZh
// @match        https://joj.sjtu.edu.cn/d/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393131/JOJ%20Simple%20Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/393131/JOJ%20Simple%20Diff.meta.js
// ==/UserScript==

(function() {
    'use strict';
    String.prototype.rstrip = function() {
        return String(this).replace(/\s+$/g, '');
    };
    var stdout = document.querySelector("#stdout > div.section__body > pre");
    var answer = document.querySelector("#answer > div.section__body > pre");
    var stdoutTexts = stdout.textContent.split("\n");
    var answerTexts = answer.textContent.split("\n");
    for(var index1 = 0, index2 = 0; index1 < stdoutTexts.length && index2 < answerTexts.length;){
        if(answerTexts[index2].rstrip() !== stdoutTexts[index1].rstrip()){
            stdout.innerHTML = stdout.textContent.replace(stdoutTexts[index1], '<span style="background:red;">' + stdoutTexts[index1] + '</span>');
            --index1;
        }
        ++index1;++index2;
    }
})();