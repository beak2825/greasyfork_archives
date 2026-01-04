// ==UserScript==
// @name         果核剥壳关闭去广告提示条
// @name:zh      果核剥壳关闭去广告提示条
// @name:zh-CN   果核剥壳关闭去广告提示条
// @name:zh-TW   果核剥壳关闭去广告提示条
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  果核剥壳去广告
// @description:zh      果核剥壳去广告
// @description:zh-CN   果核剥壳去广告
// @description:zh-TW   果核剥壳去广告
// @author       You
// @match        https://*.ghxi.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448406/%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%85%B3%E9%97%AD%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%90%E7%A4%BA%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/448406/%E6%9E%9C%E6%A0%B8%E5%89%A5%E5%A3%B3%E5%85%B3%E9%97%AD%E5%8E%BB%E5%B9%BF%E5%91%8A%E6%8F%90%E7%A4%BA%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    for(let i=0; i<10000; i++)
    {
        window.clearInterval(i);
    }
    $('.item-no-thumb').remove();
    $('.action').remove();
    $('.footer').remove();
    $('.dengl').remove();
})();



