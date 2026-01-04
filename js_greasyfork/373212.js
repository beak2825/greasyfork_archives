// ==UserScript==
// @name         巴哈動畫瘋自動更新彈幕
// @namespace    https://greasyfork.org/users/179168
// @version      2.2
// @description  可以開關和選擇每10,30,60秒自動更新彈幕
// @author       YellowPlus
// @run-at       document-start
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/373212/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%BD%88%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/373212/%E5%B7%B4%E5%93%88%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E6%9B%B4%E6%96%B0%E5%BD%88%E5%B9%95.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    var t;
    var timer_seconds = [10, 30, 60];

    if (await GM.getValue("index") == null) {
        await GM.setValue("index", 0);
    }

    if (await GM.getValue("switch") == null) {
        await GM.setValue("switch", true);
    }

  	document.addEventListener ("DOMContentLoaded", DOM_ContentReady);

  	async function DOM_ContentReady () {
        var timer_switch = $("<button></button>", {class: "bullet-send-setting", html: '<i id="timer-switch" class="material-icons"></i>'}).click(async()=>{
            toggleTimerSwitch(tsecond);
        });
        var timer_second = $("<button></button>", {class: "bullet-send-setting", html: '<span id="timer-second" style="font-size: small; font-weight:bold"></span>'}).click(async()=>{
            await GM.setValue("index", (await GM.getValue("index") + 1) % timer_seconds.length);
            tsecond = changeTimerSeconds(timer_seconds[await GM.getValue("index")]);
            if (await GM.getValue("switch")) {
                clearInterval(t);
                resetInterval(tsecond);
            }
        });
        $(".bullet-send").prepend(timer_second).prepend(timer_switch);
        var tsecond = changeTimerSeconds(timer_seconds[await GM.getValue("index")]);
        changeTimerSwitch(tsecond, !await GM.getValue("switch"));
	}

    async function changeTimerSwitch(tsecond, flag) {
        if (flag) {
            clearInterval(t);
            $(".bullet-send").find("#timer-switch").html("timer_off");
            await GM.setValue("switch", false);
            console.log("==> Stopped refreshing comment.");
        } else {
            resetInterval(tsecond);
            $(".bullet-send").find("#timer-switch").html("timer");
            await GM.setValue("switch", true);
            console.log("==> Started refreshing comment.");
        }
    }

    async function toggleTimerSwitch(tsecond) {
        changeTimerSwitch(tsecond, await GM.getValue("switch"));
    }

    function changeTimerSeconds(tsecond) {
        $(".bullet-send").find("#timer-second").html(tsecond + "s");
        console.log("==> Changed the time of refreshing comment to " + tsecond + " seconds.");
        return tsecond * 1000;
    }

    function resetInterval (tsecond) {
        t = setInterval(refreshComment, tsecond);
    }

  	function refreshComment () {
      $(".refresh").click();
      console.log("==> Refreshing comment.", new Date() );
    }

})();