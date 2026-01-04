// ==UserScript==
// @name				Twitch Latency Overlay
// @name:ja				Twitch 遅延オーバーレイ
// @name:zh-CN				Twitch 延迟浮窗
// @name:zh-TW				Twitch 延遲覆蓋
// @license				CC-BY-NC-SA-4.0
// @namespace				https://twitch.tv/kikka1225
// @version				2025-04-20
// @description				Display latency to the broadcaster as an overlay on Twitch without embedding. - Fixed version of https://greasyfork.org/scripts/416704
// @description:ja			配信者への遅延を埋め込みなしで Twitch 上のオーバーレイとして表示します。 - https://greasyfork.org/scripts/416704 の修正バージョン
// @description:zh-CN			将延迟显示为 Twitch 上的叠加层，无需嵌入。 - 修复了 https://greasyfork.org/scripts/416704 的版本
// @description:zh-TW			將延遲顯示為 Twitch 上的疊加層，無需嵌入。 - 為 https://greasyfork.org/scripts/416704 的修復版本
// @author				Misha
// @match				https://www.twitch.tv/*
// @icon				data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22utf-8%22%3F%3E%0A%0D%3C!----%3E%0A%3Csvg%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2016%2016%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%3E%0A%0D%3Cpath%20fill%3D%22%23ffffff%22%20d%3D%22M13%207.5l-2%202H9l-1.75%201.75V9.5H5V2h8v5.5z%22%2F%3E%0A%0D%3Cg%20fill%3D%22%239146FF%22%3E%0A%0D%3Cpath%20d%3D%22M4.5%201L2%203.5v9h3V15l2.5-2.5h2L14%208V1H4.5zM13%207.5l-2%202H9l-1.75%201.75V9.5H5V2h8v5.5z%22%2F%3E%0A%0D%3Cpath%20d%3D%22M11.5%203.75h-1v3h1v-3zM8.75%203.75h-1v3h1v-3z%22%2F%3E%0A%0D%3C%2Fg%3E%0A%0D%3C%2Fsvg%3E
// @grant				none
// @run-at				document-idle
// @supportURL				https://github.com/Mishasama/UserScript/issues
// @homepageURL				https://github.com/Mishasama/UserScript/tree/master/Misha's%20US
// @contributionURL			https://ko-fi.com/mishasama
// @contributionAmount			1￥
// @compatible				chrome
// @compatible				edge
// @downloadURL https://update.greasyfork.org/scripts/491524/Twitch%20Latency%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/491524/Twitch%20Latency%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
//////////////////////////////////////////////
// Set the position for the Overlay: [1 by default (top right)](you can click on the overlay button to toggle to the next position automatically)
// 0: Outside of the Video (not visible for Theatre and Full-Screen) - 1, 2, 3, 4: Inside of the Video (work for Theatre and Full-Screen)
// 0 = Menu Bar (in the top), near the search bar.
// 1 = Top Right.
// 2 = Bottom Right.
// 3 = Bottom Left.
// 4 = Top Left.
    var tlo_position=1;
// Set the font color for the Overlay ["#9463E8cc" by default (Twitch's light-purple with 80% opacity), using format #RGBA]
    var tlo_font_color="#9463E8cc";
// Set the button background color for the Overlay ["#18181ba8" by default (deep gray with 65% opacity), using format #RGBA]
    var tlo_bb_color="#18181ba8";
// Set the font size for the Overlay [13 by default]
    var tlo_font_size=13;
// Set the delay required before creating the overlay (in milliseconds, after loading the page) [3000 by default]
    var tlo_create_delay=3000;
//////////////////////////////////////////////
///////// DO NOT EDIT PAST THIS LINE /////////
//////////////////////////////////////////////
    var tlo_main;
    var tlo_index="width:90px;height:30px;font:bold "+tlo_font_size+"px Arial,sans-serif;line-height:30px;border-radius:4px;text-align:center;cursor:pointer;color:"+tlo_font_color;
    var tlo_list=[];
    tlo_list[0]="right:15px;top:10px;"+tlo_index;
    tlo_list[1]="position:absolute;right:15px;top:10px;box-shadow:#111011e6 0px 0px 2px;background:"+tlo_bb_color+";"+tlo_index;
    tlo_list[2]="position:absolute;right:15px;bottom:44px;box-shadow:#111011e6 0px 0px 2px;background:"+tlo_bb_color+";"+tlo_index;
    tlo_list[3]="position:absolute;left:15px;bottom:44px;box-shadow:#111011e6 0px 0px 2px;background:"+tlo_bb_color+";"+tlo_index;
    tlo_list[4]="position:absolute;left:15px;top:10px;box-shadow:#111011e6 0px 0px 2px;background:"+tlo_bb_color+";"+tlo_index;
//////////////////////////////////////////////
    function tlo_function_click(){
        if(tlo_position == 4 || tlo_position == -1){tlo_position=0;document.querySelector("div[class='Layout-sc-1xcs6mc-0 kuGBVB']").appendChild(tlo_main);}
        else{tlo_position+=1;document.querySelector("div[data-a-target='video-player']").appendChild(tlo_main);}
        tlo_main.style.cssText=tlo_list[tlo_position];
    }
//////////////////////////////////////////////
    function tlo_function_over(){tlo_main.style.background="#451B92c0";tlo_main.style.color="#ffffffff";if(tlo_position != 0){tlo_main.style.boxShadow="#7346b5e6 0px 0px 2px";}}
//////////////////////////////////////////////
    function tlo_function_out(){tlo_main.style.color=tlo_font_color;if(tlo_position == 0){tlo_main.style.background="transparent";}else{tlo_main.style.background=tlo_bb_color;tlo_main.style.boxShadow="#111011e6 0px 0px 2px";}}
//////////////////////////////////////////////
    window.addEventListener('load',function(){
//////////////////////////////////////////////
        setTimeout(function(){
//////////////////////////////////////////////
            setTimeout(function(){
                document.querySelector("button[data-a-target='player-settings-button']").click();
                setTimeout(function(){
                    document.querySelector("button[data-a-target='player-settings-menu-item-advanced']").click();
                    setTimeout(function(){
                        document.querySelector("div[data-a-target='player-settings-submenu-advanced-video-stats'] input").click();
                        setTimeout(function(){
                            document.querySelector("div[data-a-target='player-overlay-video-stats']").style.display="none";
//////////////////////////////////////////////
                            tlo_main=document.querySelector("div[data-a-target='player-overlay-video-stats'] > table > tbody > tr:nth-child(8) > td:nth-child(2) > p");
//////////////////////////////////////////////
                            tlo_main.addEventListener("click", tlo_function_click);
                            tlo_main.addEventListener("mouseover", tlo_function_over);
                            tlo_main.addEventListener("mouseout", tlo_function_out);
//////////////////////////////////////////////
                            tlo_position-=1;tlo_function_click();
                            setTimeout(function(){
                                document.querySelector("button[data-a-target='player-settings-button']").click();
                            },100);
                        },50);
                    },150);
                },200);
            },2000);
//////////////////////////////////////////////
        }, tlo_create_delay);
//////////////////////////////////////////////
    })
//////////////////////////////////////////////
})();
