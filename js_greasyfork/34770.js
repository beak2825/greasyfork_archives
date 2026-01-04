// ==UserScript==
// @name NoADGle
// @namespace https://greasyfork.org/zh-CN/users/14853
// @author bibubi
// @description avgle无广告纯净播放 avgle not adgle!!!
// @match *://avgle.com/*
// @require http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version 1.0.4
// @grant  GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/34770/NoADGle.user.js
// @updateURL https://update.greasyfork.org/scripts/34770/NoADGle.meta.js
// ==/UserScript==
function checkCloseBtn() {
    var closeBtn = document.getElementById('iframe').contentWindow.document.getElementById('player_3x2_close');
    if(closeBtn !== null){
        closeBtn.click();
    }
}

(function() {
    'use strict';
    console.log(window.location.href);
    var url = window.location.href;

    var reg = /https:\/\/*.avgle.com\/video\/[0-9]{0,100}/;


    var substr = url.match(reg);
    var adblock =  url.match('adblock_detected');

    if(substr !== null && adblock ===null){
        window.location = substr + '/?adblock_detected';
    }else if(substr !== null && adblock !==null){
        const embed = document.getElementsByTagName('head')[0].innerHTML.match('https://avgle.com/embed/[^"]+')[0];
        $("head").remove();
        $("body").remove();
        $("html").css("background","black");
        $("html").append( '<center><iframe  id="iframe" width="1280" height="640" src="' + embed + '" frameborder="0" allowfullscreen></iframe></center>');
    }
    window.setInterval(checkCloseBtn,200);

})();