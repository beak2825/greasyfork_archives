// ==UserScript==
// @name         方便看姐姐
// @namespace    https://leochan.me
// @version      1.0.1
// @description  一些特别的网站
// @author       Leo
// @match        *://*/thread-*-1-1.html
// @match        *://*/forum-*-*.html
// @match        *://*/forum/forum-*.html
// @match        *://*/forum/forum-*-*.html
// @match        *://*/forum.php?mod=forumdisplay&fid=*
// @match        *://*/forum.php?mod=viewthread&tid=*
// @match        *://*/forum.php?mod=forumdisplay&action=list&fid=*
// @match        *://*/group-*-*.html
// @match        *://*/thread-*-*-*.html
// @match        *://*/forum/forumdisplay.php?fid=*
// @match        *://*/thread*.php?fid=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xav0.sbs
// @grant        none
// @license      GPLv2
// @downloadURL https://update.greasyfork.org/scripts/465082/%E6%96%B9%E4%BE%BF%E7%9C%8B%E5%A7%90%E5%A7%90.user.js
// @updateURL https://update.greasyfork.org/scripts/465082/%E6%96%B9%E4%BE%BF%E7%9C%8B%E5%A7%90%E5%A7%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const showAllImages = () => {
        if(location.href.indexOf('pp=-1') === -1 && document.querySelector('a[href$="pp=-1"]')?.textContent === '查看全部图片'){
            location.href = location.href + (location.href.indexOf('?') === -1 ? '?' : '&') + 'pp=-1';
        }
    };
    showAllImages();
    const openUrlInNewTab = (selector) => {
        let links = document.querySelectorAll(selector), length = links.length;
        if(length > 0){
            for(let i = 0; i < length; i++){
                links[i].removeAttribute('onclick');
                links[i].setAttribute('target', '_blank');
            }
        }
    }
    openUrlInNewTab('#moderate a.xst');
    openUrlInNewTab('tbody[id^="normalthread_"] span[id^="thread_"] a');
    openUrlInNewTab('table tbody tr span[id^="thread_"] a');
    openUrlInNewTab('#ajaxtable .tal h3 a');
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