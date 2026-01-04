// ==UserScript==
// @name         免广
// @namespace    http://tampermonkey.net/
// @icon         https://www.baidu.com/favicon.ico
// @version      0.2
// @description  隐藏网页显示信息
// @author       for419
// @match        *://*.kimi.com/*
// @match        *://*.baidu.com/*
// @match        *://10.160.12.1234/*/view/*2
// @match        *://10.2.10.29/docview/*2
// @match        *://10.129.248.111:9097/*2
// @match        *://10.2.10.29:9101/*2
// @match        *://10.2.10.29/*11
// @match        *://picclearning.piccgroup.cn/*

// @exclude      *://10.2.10.29/oa/frames/1*1
// @exclude      *://127.0.0.1:800/*/index.htm*
// @exclude      *://127.0.0.1:800/*/oa0000/*/2025*.htm*

// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540409/%E5%85%8D%E5%B9%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/540409/%E5%85%8D%E5%B9%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 检测当前页面域名
    const url = window.location.href;

    if (url.includes('www.kimi.com')) {
        GM_addStyle(`
            div.chat-content-list {max-width: 80% !important;}
            div.chat-editor {max-width: 80% !important;}
        `);
    } else if (url.includes('picclearning.piccgroup.cn')) {
        GM_addStyle(`
            .image-text-water, .vjs-marquee, .marquee-text {display: none !important;}
        `);
    } else if (url.includes('baidu.com')) {
        if (url.includes('www.baidu.com')) {
            // 删除元素
            removeElementByClass('classa');
            removeElementById('id2');
            // 隐藏元素和修改样式
            GM_addStyle(`
                .classb {
                    display: none;
                }
                #id5 {
                    display: none;
                }
                .a {
                    width: 100px;
                    padding: 10px;
                }
            `);
        } else if (url.includes('baijiahao.baidu.com')) {
            // 删除元素
            removeElementByClass('_2v051');
            removeElementById('id22');
            // 隐藏元素和修改样式
            GM_addStyle(`
                .class2b {
                    display: none;
                }
                #id25 {
                    display: none;
                }
                .sKHSJ {
                    text-align: center;
                }
                .EaCvy {
                    width: auto !important;
                }
                .q1J1i {
                    width: auto !important;
                }
                ._3PLyv {
                    margin-left: -90px;
                }
            `);
        } else if (url.includes('baike.baidu.com')) {
            // 删除元素
            removeElementByClass('classay2');
            removeElementById('id2y2');
            // 隐藏元素和修改样式
            GM_addStyle(`
                .class2yb {
                    display: none;
                }
                #idy25 {
                    display: none;
                }
                .bb {
                    width: 100em;
                    padding: 15px;
                }
            `);

            /* 备份
        // 删除元素
        removeElementByClass('classay2');
        removeElementById('id2y2');
        // 隐藏元素
        hideElementByClass('class2yb');
        hideElementById('idy25');
        // 修改样式
        modifyStyle('.bb', {'width': '100em', 'padding': '15px'});

            */
        }
    } else if (url.includes('10.2.10.29')) {
        GM_addStyle(`
            /* 下载 */
            .fileBarCon #download {
                display: inline-block !important;
            }
            /* 相关文件*/
            .sublist div .fileContainer {
                display: inline !important;
            }

            /* 附件 */
            .fileBarCon #fileNameCon {
                padding: 0px 5px;
                width: calc(100% - 380px);
                float: left;
            }
            .fileContainer #fileNameCon {
                padding: 0px 5px;
                width: calc(100% - 380px);
                float: left;
            }
        `);
    }
    //-----------------------------------------------------------
    // 删除元素的函数
    function removeElementByClass(className) {
        const elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    }

    function removeElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    /*  弃用 bak
    // 隐藏元素的函数
    function hideElementByClass(className) {
        const elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = 'none';
        }
    }

    function hideElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    // 修改样式的函数
    function modifyStyle(selector, styleObj) {
        const style = document.createElement('style');
        document.head.appendChild(style);
        let cssRule = `${selector} {`;
        for (const prop in styleObj) {
            cssRule += `${prop}: ${styleObj[prop]};`;
        }
        cssRule += '}';
        style.sheet.insertRule(cssRule, style.sheet.cssRules.length);
    }
    */
})();