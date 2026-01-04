// ==UserScript==
// @name         大会员弹幕阐释你的梦
// @namespace    https://qinlili.bid
// @version      0.1
// @description  干掉大会员弹幕的背景，无延迟，极低性能消耗
// @author       You
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/467844/%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BC%B9%E5%B9%95%E9%98%90%E9%87%8A%E4%BD%A0%E7%9A%84%E6%A2%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/467844/%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BC%B9%E5%B9%95%E9%98%90%E9%87%8A%E4%BD%A0%E7%9A%84%E6%A2%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function (concat) {
        String.prototype.concat = function (...str) {
            //console.log(this);
            if (this.includes("-dm-vip")) {
                console.log("李旎我操死你的妈");
                return concat.call(this.replace("background:","cherrymother"), ...str);
            }else{
                return concat.call(this, ...str);
            }
        };
    })(String.prototype.concat);

})();