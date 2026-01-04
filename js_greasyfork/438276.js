// ==UserScript==
// @name         西电一键评教
// @version      1.0
// @description  （西安电子科技大学网上评教应用APP）单选和多选
// @author       Captain-Space
// @match        *://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*default/*
// @grant        Captain-Space
// @grant        Captain-Space
// @grant        Captain-Space
// @grant        window
// @namespace https://greasyfork.org/users/785000
// @downloadURL https://update.greasyfork.org/scripts/438276/%E8%A5%BF%E7%94%B5%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/438276/%E8%A5%BF%E7%94%B5%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';
    alert('打开评教问卷后请稍等几秒，确保页面加载完成');
    setTimeout(function () { check() }, 5000);
    return;
})();

function check() {
    //单选非常满意
    let radioBtn = document.querySelectorAll("bh-radio-label");
    for (var i = 0; i < radioBtn.length; i += 4) {
        radioBtn[i].click();
    }
    //多选框
    document.querySelectorAll('.bh-checkbox-label').forEach((item) => { item.click() })
}

