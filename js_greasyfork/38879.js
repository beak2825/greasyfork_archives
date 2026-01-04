// ==UserScript==
// @name         huomao no login HD
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  你需要切换到 html5 播放器, you should switch to html5 player。
// @author       https://steamcommunity.com/profiles/76561198137433074/
// @match        http://www.huomao.com/*
// @match        https://www.huomao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38879/huomao%20no%20login%20HD.user.js
// @updateURL https://update.greasyfork.org/scripts/38879/huomao%20no%20login%20HD.meta.js
// ==/UserScript==

(function() {
    $(document).ready(function(){
        var delLoginPopItvl = setInterval(function(){
            if($('div.h5plauer_login_check.show').length > 0){
                $('div.h5plauer_login_check.show').remove();
                clearInterval(delLoginPopItvl);
            }
        }, 1000);

        window.hmh5.noLoginStateSave = function(){return false;};
        $('div#chat2-box').attr("class", "guess-box hidden");
    });
})();
