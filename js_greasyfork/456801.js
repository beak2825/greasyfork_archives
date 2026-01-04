// ==UserScript==
// @name         BaiDu Close after publish
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  发布成功后自动关闭页面
// @author       You
// @match        https://jingyan.baidu.com/edit/success*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/456801/BaiDu%20Close%20after%20publish.user.js
// @updateURL https://update.greasyfork.org/scripts/456801/BaiDu%20Close%20after%20publish.meta.js
// ==/UserScript==
var jq = jQuery.noConflict(true);
(function() {
    'use strict';

    setTimeout(function(){
       window.close();
    }, 200);

})();