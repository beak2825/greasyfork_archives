// ==UserScript==
// @name         Ai Studio ppt下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  左上角出现按钮，帮助下载"https://aistudio.baidu.com/aistudio/education/preview/*"上的ppt
// @author       cjyyx
// @homepage     https://github.com/cjyyx/aistudio_helper
// @match        https://aistudio.baidu.com/aistudio/education/preview/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=aistudio.baidu.com
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459715/Ai%20Studio%20ppt%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/459715/Ai%20Studio%20ppt%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        console.log("油猴脚本开始");

        var globalDocument = window.parent.document;
        var preview_pdf_breadcrumb = globalDocument.querySelector("#main > div.content-main.preview-pdf > div.preview-pdf-breadcrumb");

        // 设置按钮
        var oButNode = document.createElement("input");
        oButNode.type = "button";
        oButNode.value = "点击下载ppt";
        oButNode.onclick = function () {
            console.log("按钮按下，准备下载");

            /** 通过url下载的函数 */
            function downloadURL(url) {
                var aEle = globalDocument.createElement('a');
                aEle.href = url;
                globalDocument.body.append(aEle);
                aEle.click();
            }

            var domUrl = window.location.href;
            var lessonProjectId = domUrl.match("[0-9]+")[0];
            console.log("获取lessonProjectId: ".concat(lessonProjectId));

            $.post(
                "https://aistudio.baidu.com/studio/edu/group/online/preview",
                { lessonProjectId: lessonProjectId },
                function (data, status) {
                    var pptUrl = data["result"]["mediaUrl"];
                    console.log("获取下载链接: \"".concat(pptUrl).concat("\""));
                    downloadURL(pptUrl);
                }
            );
        };

        preview_pdf_breadcrumb.appendChild(oButNode);

    };
})();