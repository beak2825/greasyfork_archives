// ==UserScript==
// @name         微信读书划线自动高亮
// @description  微信读书划线自动高亮(没了)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weread.qq.com/web/reader/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/485109/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%88%92%E7%BA%BF%E8%87%AA%E5%8A%A8%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/485109/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E5%88%92%E7%BA%BF%E8%87%AA%E5%8A%A8%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const path = "#routerView > div.app_content > div.readerChapterContent.fontLevel1 > div.renderTargetContainer > div.reader_toolbar_container > div > div > button.toolbarItem.underlineBg"
    var element = document.querySelector(path);
    var hintCnt = 0
    function checkElement() {
        console.log("hintCnt:"+hintCnt)
        element = document.querySelector(path);
        if (element) {
            if(!isElementVisible(element)){
                hintCnt = 0
            }
            else{
                if(hintCnt!=0) return
                hintCnt++
                element.click();
            }
        }
    }

    function isElementVisible(element) {
        return element.offsetParent !== null;
    }

    // 设置轮询时间间隔（单位：毫秒）
    const interval = 100

    // 开始轮询
    setInterval(checkElement, interval);
})();