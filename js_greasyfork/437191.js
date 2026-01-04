// ==UserScript==
// @name         自动评教 for NPU
// @namespace    http://tampermonkey.net/
// @version      0.3.0
// @description  西北工业大学-评教
// @author       Sekiro
// @match        http://us.nwpu.edu.cn/eams/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437191/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20for%20NPU.user.js
// @updateURL https://update.greasyfork.org/scripts/437191/%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%20for%20NPU.meta.js
// ==/UserScript==


(function() {
    autoPJ();

    function autoPJ() {
        //下面这个是主观题的答案
        const inputText="无";
        console.log('b');
        var url = window.location.href;
        if (url == "http://us.nwpu.edu.cn/eams/teach/quality/stdEvaluate.action" || url == "http://us.nwpu.edu.cn/eams/teach/quality/stdEvaluate!finishAnswer.action"|| url.includes("DatePicker")) {
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
