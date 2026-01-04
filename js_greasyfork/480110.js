// ==UserScript==
// @name         公众号文章页面加宽 By Heyl
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  公众号文章页面加宽，原始公众号文章显示过窄
// @author       yongli.he
// @match        https://mp.weixin.qq.com/*
// @icon         none
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/480110/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E5%AE%BD%20By%20Heyl.user.js
// @updateURL https://update.greasyfork.org/scripts/480110/%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%A1%B5%E9%9D%A2%E5%8A%A0%E5%AE%BD%20By%20Heyl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function render(){
        // 修改文章宽度
        document.querySelector('.pages_skin_pc.wx_wap_desktop_fontsize_2 .rich_media_area_primary_inner').style['max-width'] = '80vw';
        // 修改二维码位置
        document.querySelector('.not_in_mm .qr_code_pc').style.cssText = 'position:fixed;top: 20px;right: 20px;';
        // 加宽所有图片
        document.querySelectorAll('img').forEach(e => {
            e.style.minWidth = '70%'
        });
    }
    document.onreadystatechange = function(){
        if(document.readyState === 'complete'){
            setTimeout(render, 600);
        }
    }
})();