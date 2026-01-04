// ==UserScript==
// @name         NEU评教脚本
// @namespace    https://github.com/Huoyuuu
// @version      1.1
// @description  一键完成评教工作
// @author       Huoyuuu
// @match        *://210.30.204.138/school/proj/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      The MIT License
// @downloadURL https://update.greasyfork.org/scripts/455459/NEU%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455459/NEU%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var topBox = "<div style='position:fixed;z-index:999999;background-color:#ccc;cursor:pointer;top:200px;left:0px;'>" +
        "<div id='pre_analysis' style='font-size:13px;padding:10px 2px;color:#FFF;background-color:#25AE84;'>一键评教</div>" +
        "</div>";
    $("body").append(topBox);
    $("body").on("click", "#pre_analysis", function() {
        for (let count = 3; count <= 12; count++) {
            var route = "/html/body/div[3]/div/div/div[2]/div[1]/div/div/div[2]/div/div/div[1]/div/div/form/div/div[2]/table/tbody/tr[" + count + "]/td[5]/input"
            console.log(route)
            var node = document.evaluate(route, document).iterateNext()
            node.click()
            console.log(node)
        }
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
        });
    });
})();