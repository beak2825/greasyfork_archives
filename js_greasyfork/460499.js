// ==UserScript==
// @name         Treenigence
// @namespace    Treenigence
// @version      0.2
// @description  Enhancement for Treenity(智慧树).
// @author       TripleCamera2022, 14725
// @match        https://ainew.zhihuishu.com/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @require      https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js
// @downloadURL https://update.greasyfork.org/scripts/460499/Treenigence.user.js
// @updateURL https://update.greasyfork.org/scripts/460499/Treenigence.meta.js
// ==/UserScript==

(function () {
    'use strict';
    debugger;
    // 知识点练习报告
    //window.setTimeout(knowledgeAnalysis, 5000);
    if (location.href.includes("knowledgeAnalysis")) {
        knowledgeAnalysis();
    }
})();

function injectCSS(text) {
    var styleEle = document.createElement("style");
    styleEle.innerHTML = text;
    document.documentElement.appendChild(styleEle);
}

function tryUntil(condition, duration, maxTime) {
    var tryCount = Math.ceil(maxTime / duration) + 1;
    return new Promise(function (ok, error) {
        function trier() {
            try {
                if (condition()) {
                    ok();
                    return;
                }
            }
            catch (e) {
                console.warning("[Treenigence] 运行条件判断时出现错误。", e);
                error(e);
            }
            if (tryCount--) setTimeout(trier, duration);
            else error("Timeout");
        }
        trier();
    });
}

function knowledgeAnalysis() {
    // 排版修复
    injectCSS(`
        .wrongLIST,
        .currentLIST {
            display: flex;
            overflow-x: auto;
        }

        .listTi {
            display: block !important;
            width: auto !important;
            border: 1px solid gray;
            margin-top: 15px !important;
            padding: 12px !important;
        }

        .listTi .left {
            width: auto !important;
        }

        .listTi .right {
            width: auto !important;
        }

        .listTi .right .bottom {
            height: auto !important;
        }

        .listTi .right .bottom .el-scrollbar__wrap {
            /* 去除滚动条 */
            overflow: auto !important;
            margin: 0 !important;
        }
    `);

    // 截图
    tryUntil(function () { return document.querySelector(".listTi") }, 50, 10000).then(function () {
        // htmlToImage.toPng(document.querySelector(".listTi")).then(function (dataUrl) {
        //     var link = document.createElement('a');
        //     link.download = 'my-image-name.png';
        //     link.href = dataUrl;
        //     link.click();
        // });
        var listTi = document.querySelectorAll('.listTi');
        for (var i = 0; i < listTi.length; i++) {
            var button = document.createElement('button');
            button.innerHTML = '保存';
            button.style.float = "right";
            button.onclick = function (event) {
                htmlToImage.toPng(event.target.parentNode).then(function (dataUrl) {
                    var link = document.createElement('a');
                    link.download = 'Treenigence_screenshot.png';
                    link.href = dataUrl;
                    link.click();
                });
                htmlToImage.toSvg(event.target.parentNode).then(function (dataUrl) {
                    var link = document.createElement('a');
                    link.download = 'Treenigence_screenshot.svg';
                    link.href = dataUrl;
                    link.click();
                });
            }
            listTi[i].insertBefore(button, listTi[i].firstChild);
        }
    });

    // 自动关闭提示
    tryUntil(function () { return document.querySelector(".Tips .ZHIHUISHU_QZMD") }, 50, 10000).then(function () {
        document.querySelector('.Tips .ZHIHUISHU_QZMD').click();
    });
}
