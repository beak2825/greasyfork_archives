// ==UserScript==
// @name         destinytracker to  light.gg
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  make destinytracker to  light.gg, dim默认perk查询网站跳到light.gg
// @author       zxhyc131
// @match        https://destinytracker.com/destiny-2/db/items/*
// @icon         https://www.google.com/s2/favicons?domain=destinytracker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430839/destinytracker%20to%20%20lightgg.user.js
// @updateURL https://update.greasyfork.org/scripts/430839/destinytracker%20to%20%20lightgg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg= /https:\/\/destinytracker.com\/destiny-2\/db\/items\/(.*)\?.*/
    var url=location.href
    var id =url.match(reg)[1]
    if(id){
        var lightUrl='https://www.light.gg/db/zh-cht/items/'+id
        console.log(lightUrl,'lightUrl')
        location.href=lightUrl
    }
})();