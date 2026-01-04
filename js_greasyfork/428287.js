// ==UserScript==
// @name         右上角快速进入咕咕镇
// @icon        https://imglink.win/image/2021/06/22/wPJ53.png
// @version      6
// @description  0
// @author       hanabirinkle
// @include     https://*bakabbs.com/*
// @include     https://*fygal.com/*
// @include     https://*365gal.com/*
// @include     https://*365galgame.com/*
// @include     https://*kfmax.com/*
// @include     https://*kf.miaola.work/*
// @include     https://*9shenmi.com/*
// @include     https://*kfpromax.com/*
// @include     https://*9dkf.com
// @grant        none
// @namespace 0
// @downloadURL https://update.greasyfork.org/scripts/428287/%E5%8F%B3%E4%B8%8A%E8%A7%92%E5%BF%AB%E9%80%9F%E8%BF%9B%E5%85%A5%E5%92%95%E5%92%95%E9%95%87.user.js
// @updateURL https://update.greasyfork.org/scripts/428287/%E5%8F%B3%E4%B8%8A%E8%A7%92%E5%BF%AB%E9%80%9F%E8%BF%9B%E5%85%A5%E5%92%95%E5%92%95%E9%95%87.meta.js
// ==/UserScript==

(function() {
    function ggz(){
	    var div = document.createElement("div");
	    div.innerHTML = '<div id = "ggz" style = "position:fixed;right:1em;top:1em;z-index:88;cursor:pointer;" onclick = "gg()"><img src = "https://imglink.win/image/2021/10/20/QLx2E.png" width = "60px" height = "30px" /></div>';
	    document.body.appendChild(div);
    }
    window.gg = function(){
        window.open("fyg_sjcdwj.php?go=play");
    }
   ggz();
})();