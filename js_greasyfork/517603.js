// ==UserScript==
// @name         西南交通大学 一键评价
// @namespace    namespaceforthis
// @version      2024-11-15
// @description  用于一键评价课程，快速查看成绩
// @author       Shenli
// @match        http://jwc.swjtu.edu.cn/vatuu/UserFramework
// @icon         https://www.google.com/s2/favicons?sz=64&domain=swjtu.edu.cn
// @grant        unsafewindow
// @grant        GM_addStyle
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/517603/%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/517603/%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%20%E4%B8%80%E9%94%AE%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const iframeSelector = 'iframe';
    let iframe = document.querySelector(iframeSelector);

    let autoMode = false;

    if (iframe) {
    } else {
        const observer = new MutationObserver(function(mutationsList) {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' || (mutation.type === "attributes" && mutation.attributeName === "src")) {
                    iframe = document.querySelector(iframeSelector);
                    if (iframe) {
                        iframe.addEventListener('load', function() {
                            let iframeDocUrl = iframe.contentDocument.location.href;
                            if(iframeDocUrl.includes("AssessAction?setAction=viewAssess")) {
                                handleIframeDocument(iframe);
                            }else if(iframeDocUrl.endsWith("AssessAction?setAction=list")) {
                                const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
                                if (iframeDocument.querySelector("#yjpj_shenli") == null) {
                                    const btnPlace = iframeDocument.querySelector("#r_content > div.b_content.clearfix > font > div > table > tbody > tr:nth-child(2) > td");
                                    let btn = iframeDocument.createElement("button");
                                    btn.id = "yjpj_shenli";
                                    btn.innerHTML = "一键评价";
                                    btn.onclick = function() {
                                        autoMode = true;
                                        if(!detectAuto(iframe)) {
                                            autoMode = false;
                                        }
                                    }
                                    btnPlace.append(btn);
                                }
                                if(autoMode) {
                                    detectAuto(iframe);
                                }
                            }
                        });
                        break;
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function detectAuto(iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const table = iframeDocument.getElementById('table3');
        const links = table.querySelectorAll('tbody a[href]');
        if(links.length > 0) {
            setTimeout(function() { links[0].click() }, 500);
            return true;
        }

        alert("评价完成");
        return false;
    }

    function handleIframeDocument(iframe) {
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        const form = iframeDocument.getElementById('answerForm');
        const elements = form.querySelectorAll('*');
        elements.forEach(el => {
            el.style.display = 'block';
        });
        const radioButtons = form.querySelectorAll('input[type="radio"].answer_radio[score="5.0"]');
        const textareas = form.querySelectorAll('textarea');
        radioButtons.forEach(button => {
            button.click();
        });
        textareas.forEach(textarea => {
            textarea.value = "无";
        });

        const submit = iframeDocument.querySelector("#r_content > div.b_content.clearfix > div > table > tbody > tr:nth-child(2) > td > input[type=button]:nth-child(1)");

        setTimeout(function() { submit.click() }, 60000);
    }
})();