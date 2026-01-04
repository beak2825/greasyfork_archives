// ==UserScript==
// @name         微信公众号文章阅读优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  公众号文章阅读优化
// @author       lzcer
// @license      lzcer
// @match        https://mp.weixin.qq.com/s*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441453/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/441453/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('js_content').style.color='#b8bfc6'
    document.getElementById('page-content').style.backgroundColor='#363b40'
    document.getElementsByClassName('rich_media_area_primary_inner')[0].style.maxWidth='1100px'
    var titleStyle = document.getElementById('activity-name').style
    titleStyle.color='#b8bfc6'
    titleStyle.textAlign='center'
    document.getElementById('meta_content').style.display='none'
    document.getElementsByClassName('qr_code_pc')[0].style.display='none'
    document.getElementById('js_tags').style.backgroundColor='gainsboro'
    document.getElementById('js_album_keep_read').style.backgroundColor='gainsboro'
    document.getElementsByClassName('rich_media_area_extra')[0].style.display='none'
    // Your code here...
})();