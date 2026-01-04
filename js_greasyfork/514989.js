// ==UserScript==
// @name         自动签到（确认）工具
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  自动在网站进行每日签到或跳过弹窗等操作。
// @match        https://www.52pojie.cn/*
// @match        https://squad.moliweb3.com/*
// @match        https://www.gamer520.com/*	
// @match        http://xunlei.me83.com/*
// @grant        Rif
// @license      Rif
// @downloadURL https://update.greasyfork.org/scripts/514989/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%EF%BC%88%E7%A1%AE%E8%AE%A4%EF%BC%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/514989/%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0%EF%BC%88%E7%A1%AE%E8%AE%A4%EF%BC%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 等待页面加载完成
    window.addEventListener('load', function() {
		
        /// 查找 52pojie 签到 链接
        const signLink = document.querySelector('a[href^="home.php?mod=task&do=apply&id=2"]');
        if (signLink) {
            //// 如果找到签到链接，模拟点击
            signLink.click();
            console.log('自动签到成功!');
        } else {
            console.log('未找到确认链接。');
        }
		
        /// 查找 squad.moliweb3.com 我知道了 链接
        const signLink2 = document.querySelector('a[onclick^="document.querySelector"]');
        if (signLink2) {
            //// 如果找到确认链接，模拟点击
            signLink2.click();
            console.log('自动确认成功!');
        } else {
            console.log('未找到确认链接。');
        }
		
        /// 查找 gamer520 弹窗关闭 链接
        const signLink3 = document.querySelector('button[class^="swal2-close"]');
        if (signLink3) {
            //// 如果找到按钮链接，模拟点击
            signLink3.click();
            console.log('自动确认成功!');
        } else {
            console.log('未找到确认链接。');
        }
		
        /// 查找 欣辰宝库 弹窗关闭 链接
        const signLink4 = document.querySelector('a[onclick^="javascript:document.querySelector"]');
        if (signLink4) {
            //// 如果找到按钮链接，模拟点击
            signLink4.click();
            console.log('自动确认成功!');
        } else {
            console.log('未找到确认链接。');
        }
    });
})();