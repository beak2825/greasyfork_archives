// ==UserScript==
// @name         不要百度经验的内容
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  百度经验不需要
// @author       Exisi
// @match        *://www.baidu.com/*
// @grant        none
// @supportURL
// @downloadURL https://update.greasyfork.org/scripts/435405/%E4%B8%8D%E8%A6%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%9A%84%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/435405/%E4%B8%8D%E8%A6%81%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E7%9A%84%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==
 
(function () {
    baiduDiabledPreload();
    let nodeList = document.getElementsByClassName("result c-container new-pmd"); //获取搜索项
    if (nodeList != null) {
        for (let i in nodeList) {
            const t = nodeList[i].textContent; //文本内容
            if (t != null && t.search(/(百度经验)|(jingyan.baidu.com)/g) > 0) {
                nodeList[i].style.display = "none";
            }
        }
    }
 
    function baiduDiabledPreload() {
        let page_btn = document.getElementsByClassName("page-inner_2jZi2")[0].getElementsByTagName("a");
        if (page_btn != null) {
            for (let i in page_btn) {
                if (page_btn[i] != null) {
                    page_btn[i].onclick = function () {
                        setTimeout("location.reload()", 100);
                    }
                }
            }
        }
        let submit_btn = document.getElementsByClassName("bg s_btn_wr")[0];
        if (submit_btn != null) {
            submit_btn.onclick = function () {
                setTimeout("location.reload()", 500);
            }
        }
    }
})();