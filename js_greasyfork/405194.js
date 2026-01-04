// ==UserScript==
// @name         蝌蚪网
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       You
// @include      http://www.kkddsex*.*/videos/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405194/%E8%9D%8C%E8%9A%AA%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/405194/%E8%9D%8C%E8%9A%AA%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var getTime = () => {
        var time = new Date();
        time.setTime(time.getTime() + 360 * 24 * 60 * 60 * 1000);
        return time;
    }

    var setCookie = () => {
        var video_log = escape(0);
        var domain = '.' + window.location.host.replace('www.', '');
        var path = '/';
        var expires = getTime().toGMTString();
        document.cookie = 'video_log=' + video_log + ';path=' + path + ';domain=' + domain + ';expires=' + expires;
    }

    var main = () => {
        var buttons = window.$('.info-bar__button');
        if (buttons.length) {
            buttons.unbind();
            buttons[1].href = window.flashvars.video_url;
        }

        setCookie();
    }

    window.onload = () => {
        setTimeout(main);
    }
})();
