// ==UserScript==
// @name         CSDN专注脚本
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  删除csdn无用信息
// @author       Your name
// @match        https://blog.csdn.net/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/484843/CSDN%E4%B8%93%E6%B3%A8%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/484843/CSDN%E4%B8%93%E6%B3%A8%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var message = '选择是否开启页面优化脚本';

    var shouldPrompt = GM_getValue('shouldPrompt', true);
    var shouldExecute = GM_getValue('shouldExecute', false);

    if (shouldPrompt) {
        if (confirm(message)) {
            GM_setValue('shouldPrompt', false);
            GM_setValue('shouldExecute', true);
            location.reload();
        } else {
            return;
        }
    }

    if (shouldExecute) {

        //删除标签及其所有子标签内容
        var elements = document.querySelectorAll('div[class*="recommend-box"],div[id*="treeSkill"],div[id*="recommendNps"],aside[class*="recommend-right_aside"],div[id*="rightAside"],div[id="dmp_ad_58"],div[class*="toolbar-advert"]');
        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            element.parentNode.removeChild(element);
        }

        //隐藏并删除
        var divs = document.querySelectorAll("div[id*='app'],div[id*='blogColumnPayAdvert'],div[class*='left-toolbox'],div[class*='user-profile-body-left'], aside[class*='blog_container_aside'],div[id*='copyright-box'],div[class*='user-profile-head'],div[class*='csdn-side-toolbar'],div[id*='blog-slide-new']");
        divs.forEach(function(div) {
            element.style.display = 'none';
            div.remove();
        });

        var mainElement = document.querySelector('main');

        if (mainElement) {
            mainElement.style.width = '100%';
        }

        //替换居中样式
        var mainBox = document.getElementById('mainBox');
        if (mainBox) {
            mainBox.style.width = '-webkit-fill-available';
            mainBox.style.display = '-webkit-inline-box';
            mainBox.style.justifyContent = 'center';
            mainBox.style.flexWrap = 'wrap';
        }

        //设置主题颜色
        var eles = document.querySelectorAll('div[class*="blog-content-box"],div[class*="article-header"],div[class*="article-info-box"],div[id*="csdn-toolbar"]');
        for (var j = 0; j < eles.length; j++) {
            var ele = eles[j];
            ele.style.backgroundColor = 'antiquewhite';
        }


        //删除class属性
        var rmes = document.querySelectorAll("div[class*='container clearfix'],div[class*='toolbar-advert'],div[class*='passport-login-container']");
        for (var k = 0; k < rmes.length; k++) {
            var rme = rmes[k];
            rme.removeAttribute("class");

        }


        // 自动展开
        var click_eles = document.querySelectorAll('span[class*="hide-preCode-bt"]');
        for (var z = 0; z < click_eles.length; z++) {
            var click_ele = click_eles[z];
            click_ele.click();
        }


    }


})();
