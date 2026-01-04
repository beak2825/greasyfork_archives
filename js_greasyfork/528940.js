// ==UserScript==
// @namespace         https://greasyfork.org/zh-CN/users/106222-qxin-i
 
// @name              网页右键与复制限制解除(轻量版)
// @name:en           Remove web right-click and copy limits(Lite)
// @name:zh           网页右键与复制限制解除(轻量版)
 
// @description       轻量级的网页限制解除脚本,只解除右键和复制限制,提供更好的兼容性
// @description:en    A lightweight script to remove right-click and copy restrictions with better compatibility
// @description:zh    轻量级的网页限制解除脚本,只解除右键和复制限制,提供更好的兼容性
 
// @author            Cat73 & iqxin(修改) & 小天队长(精简优化)
 
// @version           1.0.0
// @license           LGPLv3
 
// @match             *://*/*
// @exclude        *www.bilibili.com/video*
// @exclude        *www.bilibili.com/v*
// @exclude        *www.bilibili.com/s/*
// @exclude        *www.bilibili.com/bangumi*
// @exclude        https://www.bilibili.com/medialist/play/*
// @exclude        *www.youtube.com/watch*
// @exclude        *www.panda.tv*
// @exclude        *www.github.com*
// @exclude        https://lanhuapp.com/*
// @exclude        https://www.douyu.com/*
// @exclude        https://www.zhihu.com/signin?*
// @exclude        https://tieba.baidu.com/*
// @exclude        https://v.qq.com/*
// @exclude        *.taobao.com/*
// @exclude        *tmall.com*
// @exclude        *signin*
 
// @grant           GM_addStyle
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/528940/%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E4%B8%8E%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E8%BD%BB%E9%87%8F%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528940/%E7%BD%91%E9%A1%B5%E5%8F%B3%E9%94%AE%E4%B8%8E%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%28%E8%BD%BB%E9%87%8F%E7%89%88%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    
    // 添加允许选择文本的CSS
    GM_addStyle('html, body {-webkit-user-select:text!important; -moz-user-select:text!important; user-select:text!important;} ::selection {color:#fff; background:#3390FF!important;}');
    
    // 核心功能: 只处理右键和复制事件
    function enableRightClickAndCopy() {
        // 移除右键菜单限制
        document.addEventListener('contextmenu', function(e) {
            e.stopPropagation();
            return true;
        }, true);
        
        // 移除复制限制
        document.addEventListener('copy', function(e) {
            e.stopPropagation();
            return true;
        }, true);
        
        // 移除选择限制
        document.addEventListener('selectstart', function(e) {
            e.stopPropagation();
            return true;
        }, true);
        
        // 清除可能存在的限制属性
        function clearRestrictions() {
            document.onselectstart = null;
            document.oncontextmenu = null;
            document.oncopy = null;
            document.onmousedown = null;
            document.onmouseup = null;
        }
        
        // 定期清除限制
        setInterval(clearRestrictions, 1000);
        window.addEventListener('load', clearRestrictions, true);
    }
    
    // 启动功能
    enableRightClickAndCopy();
})(); 