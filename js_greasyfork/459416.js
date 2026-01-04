// ==UserScript==
// @name         迅牛网盘
// @namespace    https://leochan.me
// @version      0.1
// @description  直接下载迅牛网盘内容
// @author       Leo
// @match        http://www.xunniupan.co/down-*.html
// @match        http://www.xunniupan.co/file-*.html
// @match        http://www.xunniufile.com/down-*.html
// @match        http://www.xunniufile.com/file-*.html
// @license MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xunniupan.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459416/%E8%BF%85%E7%89%9B%E7%BD%91%E7%9B%98.user.js
// @updateURL https://update.greasyfork.org/scripts/459416/%E8%BF%85%E7%89%9B%E7%BD%91%E7%9B%98.meta.js
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