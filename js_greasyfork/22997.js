// ==UserScript==
// @name        jiuseteng55
// @namespace   undefined
// @description 取消jiuseteng55播放限制
// @match     http://jiuseteng55.com/*
// @match     http://www.jiuseteng55.com/*
// @version     3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22997/jiuseteng55.user.js
// @updateURL https://update.greasyfork.org/scripts/22997/jiuseteng55.meta.js
// ==/UserScript==
window.alert = function(str){return;};
$.fn.modal = function(str){return;};
$(function() {
    var flv_url = '';
    if (vid) {
        flv_url = 'http://www.jiuseteng55.com/play.php/' + vid + '.m3u8';
    } else {
        var _vid = location.pathname.replace(/[^0-9]+/ig,"");
        flv_url = 'http://www.jiuseteng55.com/play.php/' + _vid + '.m3u8';
    }
    if(flv_url == '') return;
    window.flvurl = flv_url;
    if (yunark) yunark.setup();
})();