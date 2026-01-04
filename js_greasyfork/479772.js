// ==UserScript==
// @name         dmm mission
// @namespace    http://tampermonkey.net/
// @version      2023.12.8
// @description  dmm mission!
// @author       cunhan
// @match      *://mission.games.dmm.com/
// @match      *://library.games.dmm.com/
// @match      *://mission.games.dmm.co.jp/
// @match      *://library.games.dmm.co.jp/
// @match      *://sp-play.games.dmm.com/*
// @match      *://sp-play.games.dmm.co.jp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/479772/dmm%20mission.user.js
// @updateURL https://update.greasyfork.org/scripts/479772/dmm%20mission.meta.js
// ==/UserScript==

/*
1、先手动签到dmm客户端的两个游戏
2、手动开启浏览器手机模式，然后打开https://library.games.dmm.co.jp/
2.1 脚本按顺序执行以下操作，打开https://library.games.dmm.com/
2.2 接着打开https://mission.games.dmm.co.jp/，并重复4次“打开页游，返回mission页面”，完成任务并领取代币。最后在新标签页打开https://mission.games.dmm.co.jp/（PC版）
2.3 接着打开https://mission.games.dmm.com/，同上。最后也是在新标签里打开https://mission.games.dmm.com/（PC版）
2.4 由于没有方法“以手机模式打开某个网页”，所以手机版的签到流程全都在同一个页面里顺序执行。
3、上述2.2和2.3打开的PC版mission页面，会同时在新标签页打开3个页游、library页面以及pachinko页面。等待10s后mission标签页自动刷新，领取代币。
4、上面打开的标签页都可以配置TabAutoClose（30s)来自动关闭

总结，手动签到2个客户端游戏，然后手机模式打开https://library.games.dmm.co.jp/，剩下的事情脚本会全部搞定。
*/

(function() {
    'use strict';
    var a = setTimeout(function() { myFunction(); },3000);//增加等待时间，让sp-play可以加载完成
    function myFunction(){ // 声明一个函数
        console.log("正在运行中...");
        var platform = document.getElementById("i3_vwtp");
        if (platform.value == "pc")
        {
            console.log("pc html");
            //处理PC版：
            //找到daliy challenge，如果有新的期间限定任务，让手机版的脚本去点
            var daily = document.getElementsByClassName("p-captStandard");
            for (i = 0; i < daily.length; i++) {
                console.log(daily[i].innerText)
                if (daily[i].innerText == "毎日チャレンジできる、デイリーミッション")
                {
                    console.log(daily[i].nextSibling.nextSibling)
                    var mission_status = daily[i].nextSibling.nextSibling.getElementsByClassName("listMission_gauge_flame");;
                    if (mission_status.length > 0)
                    {
                        //还没有领取状态的文字，把几个页游点一遍
                        var missionitems_pc = daily[i].nextSibling.nextSibling.getElementsByClassName("listMission_targetGameItem_inner");
                        var i;
                        for (i = 0; i < 3; i++) {
                            console.log(missionitems_pc[i].href);
                            var playstatus = missionitems_pc[i].getElementsByClassName("listMission_targetGameItem_isPlayed");
                            if (playstatus.length == 0)
                            {

                                GM_openInTab(missionitems_pc[i].href);
                            }
                        }
                        GM_openInTab("https://www.dmm.com/netgame/pachinko/-/game/");
                        GM_openInTab("https://library.games.dmm.co.jp/");
                        GM_openInTab("https://library.games.dmm.com/");
                        setTimeout(function() { uselessFunction(); },10000);
                    }
                    else
                    {
                        var adddiv = document.getElementsByClassName("receiveAll_btn");
                        if (adddiv.length > 0)
                        {
                            console.log("PC：找到按钮"+adddiv.length);
                            adddiv[0].click();
                            console.log("PC：已点击接受所有报酬");
                        }
                    }
                }

            }
        }
        //处理手机版
        //手动开启手机模式，按以下顺序依次跳转library.games.dmm.co.jp -> library.games.dmm.com -> mission.games.dmm.com -> mission.games.dmm.co.jp
        if (platform.value == "sp")
        {
            console.log("sp html")
            //从页游跳回mission
            if (document.domain == "sp-play.games.dmm.co.jp")
            {
                window.location.replace("https://mission.games.dmm.co.jp/");
                return;
            }
            if (document.domain == "sp-play.games.dmm.com")
            {
                window.location.replace("https://mission.games.dmm.com/");
                return;
            }

            if (document.domain == "library.games.dmm.co.jp")//#1
            {
                window.location.replace("https://library.games.dmm.com/");
                return;
            }
            if (document.domain == "library.games.dmm.com")//#2
            {
                window.location.replace("https://mission.games.dmm.co.jp/");
                return;
            }
            //未play的逐个点
            var missionitems_mobile = document.getElementsByClassName("target-item-inner");
            var ij;
            for (ij = 0; ij < missionitems_mobile.length; ij++) {
                console.log(missionitems_mobile[ij].href);
                var playstatusm = missionitems_mobile[ij].getElementsByClassName("target-item-text-played");
                if (playstatusm.length == 0)
                {
                    console.log("redirect.")
                    window.location.replace(missionitems_mobile[ij].href);
                    return;
                }
                else
                {
                    console.log(playstatusm[0]);
                }
            }
            //访问mission页面时，先收菜后跳转
            adddiv = document.getElementsByClassName("receive-all-button");
            if (adddiv.length > 0)
            {
                console.log("手机版：找到按钮"+adddiv.length);
                adddiv[0].click();
                console.log("手机版：已点击接受所有报酬");
            }
            //同时在新标签页打开PC版
            if (document.domain == "mission.games.dmm.co.jp")//#3
            {
                console.log("mobile mission.jp -> mobile mission com, new pc mission.jp")
                GM_openInTab("https://mission.games.dmm.co.jp/");
                window.location.replace("https://mission.games.dmm.com/");
                return;
            }
            if (document.domain == "mission.games.dmm.com")//#4 end
            {
                console.log("mobile mission.com -> new pc misson.com")
                GM_openInTab("https://mission.games.dmm.com/");
                return;
            }
        }

    }


    function uselessFunction(){
        console.log("最后刷新页面")
        location.reload();
    }




})();

