// ==UserScript==
// @name         auto travel(demo v0.0.1)
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       You
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @match        https://web.simple-mmo.com/travel
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407981/auto%20travel%28demo%20v001%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407981/auto%20travel%28demo%20v001%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var count = $("#current_steps").text() - 0;
    while(true){
        count = $("#current_steps").text() - 0;
        while(count >= 0){
            // 点击
            $("#travel > div:nth-child(9) > button.btn.btn-primary.stepbuttonnew").click();
            var inter = 13000 + Math.round(Math.random()*2000);
            sleep(inter)
            --count;
            if(count < 0){
                sleep(1000)
                location.reload();
                count = $("#current_steps").text() - 0;
            }
        }
        sleep(1000)
        location.reload();
    }
})();

function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}