// ==UserScript==
// @name         Kill loop conform click
// @name:zh-CN   杀死循环点击确认
// @namespace    http://github.com/itiharayuuko/
// @version      0.1.2
// @description  Kill learn webset conform click per-30minutes
// @author       ItiharaYuuko
// @match        https://newnhc-kfkc.webtrn.cn/learnspace/learn/learn/templateeight/index.action?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @description:zh-cn 每学习半小时自动点击确认，解放双手无需值守
// @downloadURL https://update.greasyfork.org/scripts/466515/Kill%20loop%20conform%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/466515/Kill%20loop%20conform%20click.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function kill_loop_click() {
        var time_out = 0;
        var count = 0;
        setInterval(() => {
            if (typeof document.getElementsByClassName("layui-layer-btn0")[0] != "undefined") {
                $(".layui-layer-btn0").trigger("click");
                console.log("Loop conform cracked [" + count + "] times.");
                time_out = 0;
                // document.getElementById("container_display").click();  # V 0.1 Bug code.
                if ($("#player_pause").css("display") != "none"){ // # V 0.1.2  Bug fixed code
                    $("#player_pause").click();
                }
                count += 1;
            }
            console.log("Time elapsed [" + time_out + "s].");
            time_out += 1;
        }, 1000);
    }
    kill_loop_click();
})();