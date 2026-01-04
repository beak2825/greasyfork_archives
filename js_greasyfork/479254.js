// ==UserScript==
// @name         图片CDN-修复网页图片不可见的问题
// @namespace    https://leochan.me
// @homepage     https://leochan.me
// @version      1.0.1
// @description  将网页的全部图片套用CDN，从而使得可以更快地显示（前提是图片正常）。
// @author       Leo
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      GPLv2
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leochan.me
// @require https://greasyfork.org/scripts/470241-%E4%BE%A6%E5%90%ACinnerhtml/code/%E4%BE%A6%E5%90%ACinnerHTML.js?version=1215965
// @downloadURL https://update.greasyfork.org/scripts/479254/%E5%9B%BE%E7%89%87CDN-%E4%BF%AE%E5%A4%8D%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8D%E5%8F%AF%E8%A7%81%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/479254/%E5%9B%BE%E7%89%87CDN-%E4%BF%AE%E5%A4%8D%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8D%E5%8F%AF%E8%A7%81%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let disabledThisSite = false;
    let registerMenuId;

    function registerEnableThisSiteMenu(){
        if(registerMenuId){
            GM_unregisterMenuCommand(registerMenuId);
        }
        registerMenuId = GM_registerMenuCommand("✅ 已启用 (点击对当前网站禁用)", () => {
            allDisabledSite.push(location.host);
            GM_setValue("all_disabled_sites", allDisabledSite.join('|'));
            disabledThisSite = true;
            registerDisableThisSiteMenu();
        });
    }

    function registerDisableThisSiteMenu(){
        if(registerMenuId){
            GM_unregisterMenuCommand(registerMenuId);
        }
        registerMenuId = GM_registerMenuCommand("❌ 已禁用 (点击对当前网站启用)", () => {
            allDisabledSite.splice(allDisabledSite.indexOf(location.host), 1);
            GM_setValue("all_disabled_sites", allDisabledSite.join('|'));
            disabledThisSite = false;
            registerEnableThisSiteMenu();
        });
    }

    function replaceAllImagesSrc(){
        if(disabledThisSite){
            return;
        }
        let imageElements = document.querySelectorAll('img'), imageLength = imageElements.length;
        for(let i = 0; i < imageLength; i++){
            let imageSrc = imageElements[i].getAttribute('data-src') || imageElements[i].src;
            if(imageSrc.indexOf("//") === 0){
                imageSrc = location.protocol + imageSrc;
            }
            if(imageSrc.indexOf('i0.wp.com/') === -1 && imageSrc.indexOf('data:image/') === -1){
                if(imageSrc.indexOf('http') !== 0){
                    imageSrc = location.host + (imageSrc.indexOf('/') === 0 ? '' : '/') + imageSrc;
                }
                imageSrc = '//i0.wp.com/' + imageSrc.replace('https://', '').replace('http://', '')
                imageElements[i].src = imageSrc;
            }
        }
    }
    let allDisabledSite = (GM_getValue("all_disabled_sites") || '').split('|');
    disabledThisSite = allDisabledSite.includes(location.host);
    replaceAllImagesSrc();
    leoChanWatchInnerHTML('body', replaceAllImagesSrc);
    if(!disabledThisSite){
        registerEnableThisSiteMenu();
    }else{
        registerDisableThisSiteMenu();
    }
})();