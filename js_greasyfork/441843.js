// ==UserScript==
// @name                DIM清理
// @version             1.02
// @description         一键DIM标记垃圾装备
// @author              一方通行404
// @match               https://app.destinyitemmanager.com/*
// @grant               none
// @license             MIT
// @namespace https://greasyfork.org/users/890176
// @downloadURL https://update.greasyfork.org/scripts/441843/DIM%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/441843/DIM%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var button = document.createElement("button");
        button.textContent = "标记垃圾";
        button.style.width = "80px";
        button.style.height = "20px";
        button.style.slign = "center";
        button.style.color = "#e8a534";
        button.style.border = "1px solid #e8a534";
        button.style.borderRadius = "5px";
        button.addEventListener("click",tagjunk);
        var dt=3000;
        var armor1 = ["is:purple energycapacity:<8 -is:tagged -is:locked -is:titan (basestat:mobility+discipline:<47 and basestat:resilience+discipline:<47)"];
        var weapon0 = ["is:purple -is:tagged -is:masterwork -is:crafted \(perk:\"下风逆转\" or perk:\"元素电容\" or perk:\"移动目标\" or perk:\"创世\" or \
perk:\"脉搏监控\" or perk:\"滑行健射\" or perk:\"滑行射击\" or perk:\"风暴之眼\" or perk:\"强力首发\" or perk:\"越战越勇\" or perk:\"交感军火库\" or \
perk:\"敲打\" or perk:\"狭窄视野\" or perk:\"热力四射\" or perk:\"大合奏\" or perk:\"周而复始\" or perk:\"和谐\" or perk:\"逼入绝境\" or \
perk:\"B计划\" or perk:\"盾牌迷途\" or perk:\"双重装填\" or perk:\"危险区域\" or perk:\"不屈\" or perk:\"速射瞄准\" or perk:\"充盈\" or perk:\"光速拔枪\" or \
perk:\"稳若磐石\" or perk:\"沙场备战\" or perk:\"瓦解破裂\" or perk:\"永动不歇\" or perk:\"居合连斩\" or perk:\"全自动击发系统\" or perk:\"强制填装\" or \
perk:\"稳健之手\" or perk:\"全面提升\" or perk:\"还治彼身\" or perk:\"危险区域\" or perk:\"渗透\" or perk:\"死亡寻觅者\" or perk:\"空中袭击\" or \
perk:\"全面发展\" or perk:\"脆弱专注\" or perk:\"冲击支撑\" or perk:\"覆盖护盾克星\" or perk:\"平顺拔枪\" or perk:\"直击要害\" or perk:\"即时打击\" or \
perk:\"完美浮空\" or perk:\"射击切换\" or perk:\"钢铁握把\" or perk:\"钢铁之触\" or perk:\"无形之手\" or perk:\"失调协议\" or perk:\"腰射握把\" or \
perk:\"涡流电流\" or perk:\"启迪行动\" or perk:\"顺畅换弹\" or perk:\"高地\" or perk:\"羸弱能量球\" or perk:\"解构\" or perk:\"集体行动\" or perk:\"渗透\" or \
perk:\"精准工具\" or perk:\"枪管收缩装置\" or perk:\"快速启动\" or perk:\"痛苦之道\" or perk:\"战略家\" or perk:\"空中扳机\" or perk:\"威胁移除器\" or \
perk:\"禅意时刻\"\)"];
        var armor2 = ["is:purple energycapacity:<8 -is:tagged -is:locked is:titan (basestat:mobility+discipline:<47 and basestat:resilience+discipline:<47)"];
        var weapon1 = ["is:craftable -is:crafted -is:tagged"];
        var weapon3 = ["is:purple -is:tagged -is:masterwork -is:crafted is:handcannon -\(perk:\"延时载荷\" or perk:\"高爆载荷\" or perk:\"墓碑\"\)"];
        var weapon4 = ["is:purple -is:tagged -is:masterwork -is:crafted is:rocketlauncher -\(perk:\"追踪模块\" or perk:\"自动填装枪套\"\)"];
        var weapon5 = ["is:purple -is:tagged -is:masterwork -is:crafted is:shotgun -\(perk:\"雪上加霜\" or perk:\"战嚎炮管\"\)"];
        var weapon6 = ["is:purple -is:tagged -is:masterwork -is:crafted is:grenadelauncher -\(perk:\"致盲榴弹\" or perk:\"尖刺榴弹\"\)"];
        var weapon7 = ["is:purple -is:tagged -is:masterwork -is:crafted is:primary \(perk:\"自动填装枪套\" or perk:\"盒式呼吸法\" or perk:\"聚焦狂怒\" or perk:\"级联点\"\)"];
        function tagjunk(){
            setTimeout(function(){
                operation(weapon0);
                setTimeout(function(){
                    operation(armor2);
                    setTimeout(function(){
                        operation(armor1);
                        setTimeout(function(){
                            operation(weapon1);
                            setTimeout(function(){
                                operation(weapon3);
                                setTimeout(function(){
                                    operation(weapon4);
                                    setTimeout(function(){
                                        operation(weapon5);
                                        setTimeout(function(){
                                            operation(weapon6);
                                            setTimeout(function(){
                                                operation(weapon7);
                                            },dt);
                                        },dt);
                                    },dt);
                                },dt);
                            },dt);
                        },dt);
                    },dt);
                },dt);
            },dt);
        }
        function operation(name){
            document.getElementsByClassName("search-filter NUnHonbN")[0].click();
            var input0 = document.getElementById("downshift-:rd:-input");
            input0.setAttribute("value",name);
            var event = document.createEvent('HTMLEvents');
            event.initEvent("input", true, true);
            event.eventType = 'message';
            input0.dispatchEvent(event);
            document.getElementById("downshift-:rh:-toggle-button").click();
            setTimeout(function(){
                document.getElementById("downshift-:rh:-item-13").click();
            },2000);

        }
        var x = document.getElementsByClassName('YJXTSK8s');
        x[0].appendChild(button);
    },10000);
})();