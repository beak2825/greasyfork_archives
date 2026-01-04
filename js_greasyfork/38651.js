// ==UserScript==
// @name         TweetdeckPlayerDisableHLS
// @namespace    https://rinsuki.net/
// @version      0.1
// @description  Tweetdeck等の動画プレイヤーで画質が可変になるのをなんとかするやつ(なんとかできないときもある)
// @author       rinsuki
// @match        https://twitter.com/i/videos/tweet/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38651/TweetdeckPlayerDisableHLS.user.js
// @updateURL https://update.greasyfork.org/scripts/38651/TweetdeckPlayerDisableHLS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var params = location.search.slice(1).split("&").map(a => {
        a = a.split("=")
        var name = a[0]
        var value = a.slice(1).join("=")
        return [name, decodeURIComponent(value)]
    }).reduce((obj, [k, v]) => ({...obj, [k]: v}), {})
    var dom = document.getElementById("playerContainer")
    var attrName = "data-config"
    var json = JSON.parse(dom.getAttribute(attrName))
    console.log(params)
    if (!params.content_type || !params.video_url) return
    json.content_type = params.content_type
    json.video_url = params.video_url
    dom.setAttribute(attrName, JSON.stringify(json))
})();