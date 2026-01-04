// ==UserScript==
// @name         百度题库默认展示答案和解析
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.3
// @description  省去手动点击
// @author       小废物
// @match        https://easylearn.baidu.com/edu-page/tiangong/*
// @license      EPL
// @downloadURL https://update.greasyfork.org/scripts/465281/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E9%BB%98%E8%AE%A4%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88%E5%92%8C%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/465281/%E7%99%BE%E5%BA%A6%E9%A2%98%E5%BA%93%E9%BB%98%E8%AE%A4%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88%E5%92%8C%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {
        let searchButton = document.querySelector('.more-text')
         let limitTiYanCardDialog = document.querySelector('.kaixue-dialog-text')
 let toogleBtn = document.querySelector('.toogle-btn')
        if (limitTiYanCardDialog) {
            document.querySelector('.kaixue-dialog-close').click()
        }
 if (toogleBtn) {
            toogleBtn.click()
        }
        // 存在我们就点击
        if (searchButton) {
            searchButton.click()
            setTimeout(() => {
                // 仅查本地按钮
                let onlySearchOne = document.querySelector('.exercise-btn.exercise-btn-4')
                onlySearchOne.click()
            }, 1000)
        }
    }, 2000)
})();