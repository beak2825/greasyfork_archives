// ==UserScript==
// @name         ifeng no ad
// @namespace    https://abcd.gov1.cn/
// @version      0.01
// @description  去广告
// @author       older Lee
// @include      https://i.ifeng.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant         unsafeWindow
// @license      AGPL License
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/510675/ifeng%20no%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/510675/ifeng%20no%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let hrefUrl = window.location.href;

    $(function() {
        if (self == top) {
            if($("body :first-child ").nodeName=='DIV'){
                $("body :first-child ").hide();
            }
        }
    });

})();