// ==UserScript==
// @name         更方便的mangabz页面章节跳转功能
// @namespace    tao'sScript
// @version      0.3
// @description  鼠标左键：页面左侧单击上一页，右侧单击下一页；鼠标右键：页面左侧单击上一章，右侧单击下一章
// @author       谷雨
// @match        *://www.mangabz.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539492/%E6%9B%B4%E6%96%B9%E4%BE%BF%E7%9A%84mangabz%E9%A1%B5%E9%9D%A2%E7%AB%A0%E8%8A%82%E8%B7%B3%E8%BD%AC%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/539492/%E6%9B%B4%E6%96%B9%E4%BE%BF%E7%9A%84mangabz%E9%A1%B5%E9%9D%A2%E7%AB%A0%E8%8A%82%E8%B7%B3%E8%BD%AC%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==
(function () {
    "use strict";
    let container = null;
    let curPage = 0;
    let maxPage = 0;
    const pageWidth = window.innerWidth;

    function isReading() {
        const url = window.location.href;
        const params = url.replace("https://www.mangabz.com/", "")?.split("/");
        const chapter = params[0];
        if (chapter.includes("m")) {
            const page = document.querySelector("#lbcurrentpage");
            curPage = Number(page.innerText);
            maxPage = Number(page.nextSibling.wholeText.replace("-", ""));
            console.log('page', curPage, maxPage)
            return true;
        }
        return false;
    }

    /**
   * 跳转漫画
   * @param {string} direction 跳转方向，nextPage, prevPage, nextChapter, prevChapter
   */
    function jump(direction) {
        if (isReading()) {
            container = document.querySelector("body > .container");
            if (container) {
                const btnContainer = container.querySelector("div");
                if (btnContainer) {
                    if (direction === "nextPage") {
                        if (curPage < maxPage) {
                            const nextPage = btnContainer.querySelector(
                                'a[href^="javascript:ShowNext();"]'
                            );
                            if (nextPage) {
                                nextPage.click();
                            }
                        } else {
                            jump("nextChapter");
                        }
                    } else if (direction === "prevPage") {
                        if (curPage > 1) {
                            const prevPage = btnContainer.querySelector(
                                'a[href^="javascript:ShowPre();"]'
                            );
                            if (prevPage) {
                                prevPage.click();
                            }
                        } else {
                            jump("prevChapter");
                        }
                    } else if (direction === "nextChapter") {
                        const nextChapter = btnContainer.querySelector(
                            'a[href^="javascript:ShowNext();"]'
                        ).nextElementSibling;
                        if (nextChapter) {
                            nextChapter.click();
                        }
                    } else if (direction === "prevChapter") {
                        const prevChapter = btnContainer.querySelector(
                            'a[href^="javascript:ShowPre();"]'
                        ).previousElementSibling;
                        if (prevChapter) {
                            prevChapter.click();
                        }
                    }
                }
            }
        }
    }
    // 跳转至下一页/上一页
    document.addEventListener("click", (e) => {
        if (e.clientX === 0) return;
        console.log('click', e.clientX, pageWidth / 2);
        if (e.target === document.querySelector('#cp_img')) {
            if (e.clientX > pageWidth / 2) {
                jump("nextPage");
            } else if (e.clientX < pageWidth / 2) {
                jump("prevPage");
            }
            e.stopPropagation(); // 阻止事件冒泡
        }
    }, true);

    // 跳转下一章/上一章
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        if (e.clientX === 0) return;
        console.log('right', e.clientX, pageWidth / 2);
        if (e.target === document.querySelector('#cp_img')) {
            if (e.clientX > pageWidth / 2) {
                jump("nextChapter");
            } else if (e.clientX < pageWidth / 2) {
                jump("prevChapter");
            }
            e.stopPropagation(); // 阻止事件冒泡
        }
    }, true);
})();
