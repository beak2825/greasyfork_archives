// ==UserScript==
// @name         IqiyiRemiveAd
// @namespace    https://www.iqiyi.com/
// @version      0.0.5
// @description  去掉爱奇艺广告
// @author       Neal
// @match        https://www.iqiyi.com/v_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433438/IqiyiRemiveAd.user.js
// @updateURL https://update.greasyfork.org/scripts/433438/IqiyiRemiveAd.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var removeAd = document.createElement('div');
    removeAd.innerHTML = "<div style='text-align:center;line-height:2'><a href='https://jx.lykzl.com/?url="+window.location.href+"' target='_blank' style='color:white;font-size:2rem;'>去广告</a></div>";
    setTimeout(function(){
        document.getElementById("flashOutter").appendChild(removeAd);
    },3000)
})();

