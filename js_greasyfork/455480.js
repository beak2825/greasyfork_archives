// ==UserScript==
// @name         NEU健康上报脚本
// @namespace    https://github.com/Huoyuuu
// @version      1.0
// @description  一键完成健康上报
// @author       Huoyuuu
// @match        https://e-report.neu.edu.cn/notes/create
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The MIT License
// @downloadURL https://update.greasyfork.org/scripts/455480/NEU%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455480/NEU%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    let route = '//*[@id="app"]/main/div/form/div[1]/table/tbody/tr/td[1]/div/div/div/label[1]/span[1]/span'
    let begin_button = document.evaluate(route, document).iterateNext()
    begin_button.click()
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
        "<div id='pre_analysis' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>一键完成</div>" +
        "</div>";
    $("body").append(topBox);
    $("body").on("click", "#pre_analysis", function() {
        var arr = [
            '//*[@id="app"]/main/div/form/div[4]/div[2]/table/tbody/tr[1]/td/div/div/div/label[1]/span[1]/span',
            '//*[@id="app"]/main/div/form/div[3]/div[2]/table/tbody/tr[1]/td/div/div/div/label[1]/span[1]/span',
        ]

        for (let item of arr) {
            let t = document.evaluate(item, document).iterateNext()
            t.click()
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    });
})();