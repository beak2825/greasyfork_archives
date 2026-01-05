// ==UserScript==
// @name       斗鱼TV开启CDN加速
// @description  斗鱼TV开启CDN加速，提升画质，减少卡顿
// @namespace  http://www.cdn.dou.yu.tv.com/
// @version    0.2.0
// @icon http://www.douyutv.com/favicon.ico
// @grant unsafeWindow
// @match      http://www.douyutv.com/*
// @copyright  cts
// @author  cts
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/4952/%E6%96%97%E9%B1%BCTV%E5%BC%80%E5%90%AFCDN%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/4952/%E6%96%97%E9%B1%BCTV%E5%BC%80%E5%90%AFCDN%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

// https://greasyfork.org/zh-CN/scripts/4952


! function() {

    if (!$ROOM) {
        return !!0;
    }

    function douyu() {

        var flashvars = {};

        flashvars.RoomId = $ROOM.room_id;
        flashvars.Status = 'true';

        flashvars.DomainName = 'www.douyutv.com';
        flashvars.IsIndex = 'false';
        flashvars.cdn = get_url_param('cdn') || ['ws', 'ws2', 'lx', 'dl'][new Date().getSeconds() % 4];
        flashvars.asset_url = 'http://staticlive.douyutv.com/common/';
        flashvars.room_link = '';

        var params = {};
        params.quality = "high";
        params.bgcolor = "#000";
        params.allowscriptaccess = "always";
        params.allowfullscreen = "true";
        params.allowFullScreenInteractive = "true";
        params.wmode = "opaque";
        var attributes = {};
        attributes.id = "WebRoom";
        attributes.name = "WebRoom";
        attributes.align = "middle";

        swfobject.embedSWF(
            "http://staticlive.douyutv.com/common/simplayer/WebRoom.swf?t13546&" + Date.now().toString().substr(0, 5), "WebRoom",
            "100%", "100%",
            "11", '',
            flashvars, params, attributes);
    }

    $('#WebRoom').ready(douyu);

}();