// ==UserScript==
// @name               gitbookVIP
// @name:en            gitbookVIP
// @namespace          gitbook.taozhiyu.gitee.io
// @version            0.6
// @description        解锁gitbook的VIP功能
// @description:en     Unlock VIP features of gitbook
// @author             涛之雨
// @match              *://app.gitbook.com/*
// @require            https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js
// @resource           toastrCSS https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css
// @icon               https://app.gitbook.com/public/images/logos/rounded/256x256.png
// @grant              GM_addStyle
// @grant              GM_getResourceText
// @license            MIT
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/441008/gitbookVIP.user.js
// @updateURL https://update.greasyfork.org/scripts/441008/gitbookVIP.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
/*global toastr*/
(function() {
    'use strict';
    const i18n={
        "zh-CN": ['解锁成功','gitbook脚本加载成功！'],
        "en": ['Unlocked successfully','gitbook script loaded successfully!']
    };
    GM_addStyle(GM_getResourceText('toastrCSS'));
    [].constructor.prototype._reduce=[].constructor.prototype._reduce||[].constructor.prototype.reduce;
    [].constructor.prototype.reduce=function(){
        return(JSON.stringify(this).includes('github-sync')?this.map(a=>{
            for(const i in a)a[i]===false&&(a[i]=true);
            return a;
        }):this)._reduce(arguments[0],arguments[1]);
    };
    let lan="en";
    if((navigator.language || navigator.userLanguage).toLowerCase().startsWith("zh"))lan="zh-CN";
    toastr.success(...i18n[lan],{progressBar:true,timeOut:3000});
})();