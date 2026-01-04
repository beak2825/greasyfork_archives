// ==UserScript==
// @name         简单解决v2新浪图床显示问题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       huanchena
// @match        *://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393513/%E7%AE%80%E5%8D%95%E8%A7%A3%E5%86%B3v2%E6%96%B0%E6%B5%AA%E5%9B%BE%E5%BA%8A%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/393513/%E7%AE%80%E5%8D%95%E8%A7%A3%E5%86%B3v2%E6%96%B0%E6%B5%AA%E5%9B%BE%E5%BA%8A%E6%98%BE%E7%A4%BA%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $(function(){

        var imgs=$("img");
        for(var i=0;i<imgs.length;i++){
            //https://wx1.sinaimg.cn/mw1024/5e5fbf46ly1fwki3soufvj21900xr7wi.jpg
            if (imgs[i].src.indexOf("sinaimg.cn/")) {
                $(imgs[i]).attr("referrerpolicy","no-referrer").attr("src",imgs[i].src.replace("https://","http://"));
            }
        }
    });


})();