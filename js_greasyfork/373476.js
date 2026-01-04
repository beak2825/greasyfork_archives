// ==UserScript==
// @name         自定义baidu分享密码
// @namespace    https://pan.baidu.com/
// @version      0.1
// @description  try to take over the world!
// @author       zcy20014@163.com
// @match        https://pan.baidu.com/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/1.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373476/%E8%87%AA%E5%AE%9A%E4%B9%89baidu%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/373476/%E8%87%AA%E5%AE%9A%E4%B9%89baidu%E5%88%86%E4%BA%AB%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("body").bind('DOMNodeInserted', function(e) {
        var createurl=($(".create"));
        console.log(createurl);
        if (createurl){
            if($("#zidingyi").length<=0){
                createurl.before("<div display:none id='zidingyi' onclick=\"javascript:require([\'function-widget-1:share\/util\/shareFriend\/createLinkShare.js\']).prototype.makePrivatePassword=function(){return prompt('密码','Fuli')};\"> </div>");
                $("#zidingyi").click();
            }
        }
    });
})();