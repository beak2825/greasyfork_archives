// ==UserScript==
// @name         Steam国区内容锁区修复
// @namespace    http://danke666.top/
// @version      1.1
// @author       DanKe
// @description  修复Steam国区部分内容锁区导致的选项不可见
// @match        https://store.steampowered.com/account/preferences/
// @match        https://store.steampowered.com/account/preferences/*
// @match        https://store.steampowered.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476379/Steam%E5%9B%BD%E5%8C%BA%E5%86%85%E5%AE%B9%E9%94%81%E5%8C%BA%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/476379/Steam%E5%9B%BD%E5%8C%BA%E5%86%85%E5%AE%B9%E9%94%81%E5%8C%BA%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有 class 为 "preference_row account_setting_not_customer_facing" 的元素
    const elements = document.querySelectorAll(".preference_row.account_setting_not_customer_facing");

    const element1 = elements[0];
    const label1 = element1.querySelector(".store_pref_desc label.account_manage_checkbox");
    label1.textContent = "频繁的裸露画面或色情内容";
    const span1 = element1.querySelector(".store_pref_desc span.account_setting_parenthetical")
    span1.innerHTML = '主要展示裸露画面或色情主题的游戏或内容。勾选此复选框即表示您确认自己已至少年满18周岁。<br><a href="https://github.com/DanKE123abc/Steam-Preferences-Fixer">** 国区隐藏选项 勾选后不显示已勾选**</a>';
    element1.classList.remove("account_setting_not_customer_facing");
    element1.classList.add("preference_row");


    const element2 = elements[1];
    const label2 = element2.querySelector(".store_pref_desc label.account_manage_checkbox");
    label2.textContent = "仅限成人的色情内容";
    const span2 = element2.querySelector(".store_pref_desc span.account_setting_parenthetical")
    span2.innerHTML = '包含仅针对成人受众的性意味明显或露骨的游戏或内容。勾选此复选框即表示您确认自己已至少年满18周岁。<br><a href="https://github.com/DanKE123abc/Steam-Preferences-Fixer">** 国区隐藏选项 勾选后不显示已勾选**</a>';
    element2.classList.remove("account_setting_not_customer_facing");
    element2.classList.add("preference_row");


})();
