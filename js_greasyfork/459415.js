// ==UserScript==
// @name         在新标签打开论坛帖子
// @namespace    https://leochan.me
// @description  一个简单的工具
// @version      1.0.0
// @description  try to take over the world!
// @author       Leo
// @match        *://*/thread-*-1-1.html
// @match        *://*/forum-*-*.html
// @match        *://*/forum.php?mod=forumdisplay&fid=*
// @match        *://*/forum.php?mod=viewthread&tid=*
// @match        *://*/forum.php?mod=forumdisplay&action=list&fid=*
// @match        *://*/group-*-*.html
// @match        *://*/thread-*-*-*.html
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459415/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/459415/%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E8%AE%BA%E5%9D%9B%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showAllImages = () => {
        if(location.href.indexOf('pp=-1') === -1 && document.querySelector('a[href$="pp=-1"]')?.textContent === '查看全部图片'){
            location.href = location.href + (location.href.indexOf('?') === -1 ? '?' : '&') + 'pp=-1';
        }
    };
    showAllImages();
    const openUrlInNewTab = () => {
        let links = document.querySelectorAll('#moderate a.xst'), length = links.length;
        if(length > 0){
            for(let i = 0; i < length; i++){
                links[i].removeAttribute('onclick');
                links[i].setAttribute('target', '_blank');
            }
        }
    }
    openUrlInNewTab();
    const replaceLinksDomain = () => {
        if(location.href.replace('https://', 'http://').indexOf('http://bisi666.cc/thread-') === 0){
            let links = document.querySelectorAll('a[href*="/thread"],a[href*="/forum.php?mod=forumdisplay&action=list"],a[href*="/forum.php?mod=group&fid="]'), length = links.length;
            if(length > 0){
                for(let i = 0; i < length; i++){
                    if(location.href.indexOf('http') === 0 && new URL(links[i].href).host !== 'bisi666.cc'){
                        links[i].setAttribute('href', links[i].href.replace('https://', 'http://').replace(new URL(links[i].href).host, 'bisi666.cc'));
                    }
                }
            }
        }
    }
    replaceLinksDomain();
    const hideAds = () => {
        if(location.href.replace('https://', 'http://').indexOf('http://bisi666.cc') === 0 && document.querySelector('#mu + .a_mu')){
            document.querySelector('#mu + .a_mu').style.display = 'none';
        }
    }
    hideAds();
})();