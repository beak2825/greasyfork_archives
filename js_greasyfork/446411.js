/* globals jQuery, $, Vue */
// ==UserScript==
// @name       izix Tools
// @description  视频打开新网页播放
// @homepage   https://slicli.com
// @match    https://www.ttsp.tv/*
// @exclude    https://slicli.com/*
// @license MIT
// @version   0.0.1
// @GM_info
// @run-at     document-start
// @require    https://cdn.staticfile.org/vue/2.6.11/vue.min.js
// @require    https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @grant      GM_addStyle
// @include    */play*
// @include    *play/*
// @exclude    *olevod.com/index.php/vod/play/id/*
// @exclude    *olevod.tv/index.php/vod/play/id/*
// @grant      window.onurlchange
// @grant      unsafeWindow
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM_getValue
// @namespace  https://greasyfork.org/users/458930
// @downloadURL https://update.greasyfork.org/scripts/446411/izix%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/446411/izix%20Tools.meta.js
// ==/UserScript==

"use strict";

// 配置控制类
class Config {
    get(key, value) {
        var cookie = $.cookie(key);
        if (cookie == undefined) {
            new Config().set(key, value);
            console.debug("Renew key: " + key + " : " + value);
            return value;
        }
        console.debug("Read key: " + key + " : " + cookie);
        if (cookie === "true") { return true; }
        if (cookie === "false") { return false; }
        return cookie;
    }

    getS(key, value) {
        var cookie = $.cookie(key);
        if (cookie == undefined) {
            new Config().set(key, value);
            console.debug("Renew key: " + key + " : " + value);
            return value;
        }
        console.debug("Read key: " + key + " : " + cookie);
        return cookie;
    }

    set(setKey, setValue) {
        $.cookie(setKey, setValue, {
            path: '/',
            expires: 365
        });
        console.debug("Key set: " + setKey + " : " + setValue);
    }

    listenButton(element, listenKey, trueAction, falseAction) {
        $(element).click(function () {
            let status = new Config().get(listenKey, true);
            console.debug("Status: " + status);
            if (status === "true" || status) {
                console.debug("Key set: " + listenKey + " :: " + false);
                new Config().set(listenKey, false);
            } else {
                console.debug("Key set: " + listenKey + " :: " + true);
                new Config().set(listenKey, true);
            }
        });
    }

    listenButtonAndAction(element, listenKey, trueAction, falseAction) {
        $(element).click(function () {
            let status = new Config().get(listenKey, true);
            console.debug("Status: " + status);
            if (status === "true" || status) {
                console.debug("Key set: " + listenKey + " :: " + false);
                new Config().set(listenKey, false);
                falseAction();
            } else {
                console.debug("Key set: " + listenKey + " :: " + true);
                new Config().set(listenKey, true);
                trueAction();
            }
        });
    }
}
var config = new Config();

//
var videoUrl = $('#playleft').context.URL;
window.open(videoUrl,'_blank');