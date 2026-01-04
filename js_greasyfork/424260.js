// ==UserScript==
// @name         屏蔽163邮箱界面广告
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  屏蔽163邮箱登录界面和邮件页面的广告标签和广告图片!
// @author       meihonglou
// @match        https://mail.163.com/*
// @icon         https://www.google.com/s2/favicons?domain=163.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424260/%E5%B1%8F%E8%94%BD163%E9%82%AE%E7%AE%B1%E7%95%8C%E9%9D%A2%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/424260/%E5%B1%8F%E8%94%BD163%E9%82%AE%E7%AE%B1%E7%95%8C%E9%9D%A2%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.location.href.indexOf("?sid=") > -1) {
        // 登陆后
        var js_component_component_CLASS = document.querySelectorAll('.js-component-component');
        for (let i = 0; i < js_component_component_CLASS.length;i++) {
            if (js_component_component_CLASS[i].textContent === "官方App") js_component_component_CLASS[i].parentNode.removeChild(js_component_component_CLASS[i]);
            if (js_component_component_CLASS[i].textContent === "开通邮箱会员") js_component_component_CLASS[i].parentNode.removeChild(js_component_component_CLASS[i]);
        }
        var js_component_tabitem_CLASS = document.querySelectorAll('.js-component-tabitem');
        for (let i = 0; i < js_component_tabitem_CLASS.length;i++) {
            if (js_component_tabitem_CLASS[i].title === "网易严选") js_component_tabitem_CLASS[i].parentNode.removeChild(js_component_tabitem_CLASS[i]);
            //if (js_component_tabitem_CLASS[i].textContent === "开通邮箱会员") js_component_tabitem_CLASS[i].parentNode.removeChild(js_component_tabitem_CLASS[i]);
        }
    } else {
        // 登陆页面
        var B_G_Picture_ID = document.getElementById('mainCnt');
        var B_G_Picture_CLASS = document.getElementsByClassName('main-inner');
        if (B_G_Picture_ID != null) {
            B_G_Picture_ID.style.backgroundImage = "";
        } else {
          if (B_G_Picture_CLASS != null) B_G_Picture_CLASS.style.backgroundImage = "";
        }
        var theme_ID = document.getElementById('theme');
        if (theme_ID != null) theme_ID.parentNode.removeChild(theme_ID);
        var themeCtrl_CLASS = document.querySelector('.themeCtrl');
        if (themeCtrl_CLASS != null) themeCtrl_CLASS.parentNode.removeChild(themeCtrl_CLASS);
        //
        var login_block_Child_CLASS = document.querySelector('.mailApp');
        if (login_block_Child_CLASS != null) login_block_Child_CLASS.parentNode.removeChild(login_block_Child_CLASS);
        var login_block_ID = document.getElementById('loginBlock');
        if (login_block_ID != null) login_block_ID.style.height = "auto";
        var m_footer_CLASS = document.querySelector('.m-footer');
        if (m_footer_CLASS != null) m_footer_CLASS.style.paddingTop = "15px";
        var footer_nav_CLASS = document.querySelector('.footer-nav');
        if (footer_nav_CLASS != null) footer_nav_CLASS.parentNode.removeChild(footer_nav_CLASS);
        //
        var headerNav_Child_CLASS = document.querySelector('.headerNav');
        if (headerNav_Child_CLASS != null) headerNav_Child_CLASS.parentNode.removeChild(headerNav_Child_CLASS);
    }

    // Your code here...
})();