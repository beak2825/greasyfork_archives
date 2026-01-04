// ==UserScript==
// @name         【改】迅牛网盘直接下载
// @namespace    http://leochan.me
// @version      1.0.2
// @description  迅牛网盘免等待
// @author       Leo
// @match        http://www.xunniupan.co/down-*.html
// @match        http://www.xunniupan.co/file-*.html
// @match        http://www.xunniufile.com/down-*.html
// @match        http://www.xunniufile.com/file-*.html
// @match        http://www.xunniuwp.com/file-*.html
// @match        http://www.xueqiupan.com/file-*.html
// @match        http://www.xunniufxpan.com/file-*.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @license      GPLv2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483187/%E3%80%90%E6%94%B9%E3%80%91%E8%BF%85%E7%89%9B%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483187/%E3%80%90%E6%94%B9%E3%80%91%E8%BF%85%E7%89%9B%E7%BD%91%E7%9B%98%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const openDownloadPage = () => {
        if(location.href.indexOf('/file-') !== -1){
            location.href = location.href.replace('/file-', '/down-');
        }
    }
    openDownloadPage();
    const showDownloadLink = () => {
        if(document.querySelector('#down_box')){
            setTimeout(() => {
                document.querySelector('#down_box').style.display = 'block';
                let links = document.querySelectorAll('.down_btn'), length = links.length, last = length - 1;
                if(length > 0){
                    location.href = links[last].href;
                }
            }, 1000);
        }
    }
    showDownloadLink();
})();