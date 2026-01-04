// ==UserScript==
// @name         nwpu-pj
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  西北工业大学-评教
// @author       BakerBunker
// @match        http://us.nwpu.edu.cn/eams/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385977/nwpu-pj.user.js
// @updateURL https://update.greasyfork.org/scripts/385977/nwpu-pj.meta.js
// ==/UserScript==

(function() {
    'use strict';
        confirm = function() {
        return true;
    }
    autoPJ();

    function autoPJ() {
        //下面这个是主观题的答案
        const inputText="没有意见";

        var url = window.location.href;
        if (url == "http://us.nwpu.edu.cn/eams/teach/quality/stdEvaluate.action" || url == "http://us.nwpu.edu.cn/eams/teach/quality/stdEvaluate!finishAnswer.action"||url.includes("DatePicker")) {
            var table = document.getElementsByClassName("gridtable")[0].lastElementChild;
            console.log('a');
            for (const row of table.children) {
                var item = row.lastElementChild;
                if (item.textContent.includes("进行")) {
                    item.lastElementChild.click();
                    break;
                }
            }
        }
        else if (url.includes("stdEvaluate!answer.action")) {
            var objectives = document.getElementsByClassName("qBox objective required");

            for (const selection of objectives) {
                selection.children[1].children[0].children[0].click();
            }

            var subjectives = document.getElementsByClassName("qBox subjective required");
            for (const subjective of subjectives) {
                subjective.children[1].textContent = inputText;
            }

            var subBtn = document.getElementById("sub");
            subBtn.click();
        }
        setTimeout(autoPJ, "2000");
    }
})();