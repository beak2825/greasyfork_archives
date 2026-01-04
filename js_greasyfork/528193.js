// ==UserScript==
// @name         绅士漫画/紳士漫畫下载按钮正常显示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  绅士漫画故意将下载按钮标为广告元素，导致adBlocker误删，本脚本将在adBlocker正常运行的情况下，正常显示下载按钮以及下载页上内容
// @author       Anaaya
// @match        https://www.wn02.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wn02.uk
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528193/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E6%AD%A3%E5%B8%B8%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528193/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E7%B4%B3%E5%A3%AB%E6%BC%AB%E7%95%AB%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE%E6%AD%A3%E5%B8%B8%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    function info_page() {
        let f_ele = document.querySelector(".asTBcell.uwthumb")
        let c_ele = document.querySelector("#ads>a")
        if (f_ele !== null && c_ele !== null) {
            f_ele.append(c_ele)
        }
    }
    //
    function down_page() {
        // append father
        let ori_f_ele = document.querySelector(".adbox")
        // need change props
        let f_ele = document.querySelector("#adsbox")
        let a_ele_li = document.querySelectorAll("#adsbox>a")

        if (ori_f_ele === null || f_ele === null || a_ele_li.length === 0) {
            return
        }

        f_ele.id = ""
        f_ele.className = "download_btn"

        a_ele_li.forEach(ele => {
            ele.className = "down_btn"
        })

        ori_f_ele.append(f_ele)
    }

    function start() {
        info_page()
        down_page()
    }

    start()
})();