// ==UserScript==
// @name         自動跳轉
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動跳轉!
// @author       You
// @match        *://game.granbluefantasy.jp/*
// @match        *://gbf.game.mbga.jp/*
// @run-at       document-end
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/427406/%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/427406/%E8%87%AA%E5%8B%95%E8%B7%B3%E8%BD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getRandom(min,max){
        return Math.floor(Math.random()*max)+min;
    };
    let eventOn = false
    window.addEventListener('hashchange', () => {
        let hash = location.hash
        var url = '';
        if (/^#result(_multi)?\/\d/.test(hash)) {
            if (!eventOn) {
                eventOn = true
                $(document).ajaxSuccess(function(event, xhr, settings, data) {
                    if (/\/result(multi)?\/data\/\d+/.test(settings.url)) {
                        if (data.appearance) {
                            // 如果有出現hell
                        } else {
                            url = "http://game.granbluefantasy.jp/#quest/supporter/776471/1/0/10386"
                            setTimeout(function(){
                               unsafeWindow.location.replace(url)
                            }, getRandom(0, 300))
                        }
                    }
                })
            }
        }
    })
})();