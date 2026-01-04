// ==UserScript==
// @name         BaiDu Edit scroll to bottom
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动跳动到页面底部!
// @author       You
// @match        https://jingyan.baidu.com/edit/content?type=*
// @grant        none
// @require    https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456800/BaiDu%20Edit%20scroll%20to%20bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/456800/BaiDu%20Edit%20scroll%20to%20bottom.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);

(function() {
    'use strict';

    setTimeout(function(){
       jq(document).scrollTop(jq(document).height() + 200);
       jq(".release-btn").focus();
    }, 200);
    //jq("#wgt-footer")[0].scrollIntoView();
    //document.getElementById("").scrollTop = document.getElementById("").scrollHeight;

})();