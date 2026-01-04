// ==UserScript==
// @name         wsmud_plugins_extends
// @namespace    cqv
// @version      0.0.3.10
// @date         09/04/2021
// @modified     20/10/2022
// @homepage     网站链接
// @description  武神传说 MUD
// @author       sasamila
// @match        http://game.wsmud.com/*
// @match        http://www.wsmud.com/*
// @match        http://wsmud.com/*
// @match        http://game.wamud.com/*
// @match        http://www.wamud.com/*
// @match        http://wamud.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT


// @downloadURL https://update.greasyfork.org/scripts/428538/wsmud_plugins_extends.user.js
// @updateURL https://update.greasyfork.org/scripts/428538/wsmud_plugins_extends.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var WG = undefined;
    var T = undefined;
    var G = undefined;
    var messageAppend = undefined;
    var messageClear = undefined;
    $(document).ready(function () {
        var css = `.ext-item{
                display: inline-block;border: solid 1px gray;color: gray;background-color: black;
                text-align: center;cursor: pointer;border-radius: 0.25em;min-width: 2.5em;margin-right: 0em;
                margin-left: 0.4em;position: relative;padding-left: 0.4em;padding-right: 0.4em;line-height: 24px;}
                .WG_log{flex: 1;overflow-y: auto;border: 1px solid #404000;max-height: 15em;width: calc(100% - 40px);}
                .WG_log > pre{margin: 0px; white-space: pre-line;}
                .WG_button { width: calc(100% - 40px); overflow-x: auto;display: block;line-height:2em;}
                .WG_button > .ext-item:active {background-color: gray;color:black;}
                .item-plushp{display: inline-block;float: right;width: 100px;}
                .item-dps{display: inline-block;float: right;width: 100px;}
                .settingbox {margin-left: 0.625 em;border: 1px solid gray;background-color: transparent;color: unset;resize: none;width: 80% ;height: 3rem;}
                .runtest textarea{display:block;width:300px;height:160px;border:10px solid #F8F8F8;border-top-width:0;padding:10px;line-height:20px;overflow:auto;background-color:#3F3F3F;color:#eee;font-size:12px;font-family:Courier New}
                .layui-btn,.layui-input,.layui-select,.layui-textarea,.layui-upload-button{outline:0;-webkit-appearance:none;transition:all .3s;-webkit-transition:all .3s;box-sizing:border-box}
                .layui-btn{display:inline-block;height:38px;line-height:38px;padding:0 18px;background-color:#009688;color:#fff;white-space:nowrap;text-align:center;font-size:14px;border:none;border-radius:2px;cursor:pointer}
                .layui-btn-normal{background-color:#1E9FFF}
                .layui-layer-moves{background-color:transparent}
                .switch2 {display: inline-block;position: relative;height: 1.25em;width: 3.125em;line-height: 1.25em;
                border-radius: 0.875em;background: #dedede;cursor: pointer;-ms-user-select: none;-moz-user-select: none;
                -webkit-user-select: none;user-select: none;vertical-align: middle;text-align: center;}
                .switch2 > .switch-button {position: absolute;left: 0px;height: 1.25em;width: 1.25em;
                border-radius: 0.875em;background: #fff;box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
                transition: 0.3s;-webkit-transition: 0.3s;left: 0px;}
                .switch2 > .switch-text {color:#898989;margin-left: 0.625em;}
                .on>.switch-button {right:0px;left:auto;}
                .on>.switch-text {color:#ffffff;margin-right: 0.625em;    margin-left: 0px;}
                .on {background-color:#008000;}
                .crit{
                    height:24px;
                    position:relative;
                    animation:myfirst 1s;
                    -webkit-animation:myfirst 0.4s; /* Safari and Chrome */
                }
                    @keyframes myfirst
                {
                    0%   {background:red; left:0px; top:0px;}
                    33% {background:red; left:0px; top:-14px;}
                    66% {background:red; left:0px; top:14px;}
                    100% {background:red; left:0px; top:0px;}
                }

                @-webkit-keyframes myfirst /* Safari and Chrome */
                {
                    0%   {background:red; left:0px; top:0px;}
                    33% {background:red; left:0px; top:-30px;}
                    100% {background:red; left:0px; top:0px;}
                }
                .rainbow-text{
                    color:red;
                    background-image: repeating-linear-gradient(45deg, violet, indigo, blue, green, yellow, orange, red, violet);
                    background-size:800% 800%;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: rainbow 8s ease infinite;
                    -webkit-animation: rainbow 8s ease infinite;
                }
                @keyframes rainbow
                {
                    0%{background-position:0% 50%}
                    50%{background-position:100% 25%}
                    100%{background-position:0% 50%}
                }`;
        GM_addStyle(css);
        setTimeout(function(){
            WG = unsafeWindow.WG;
            T = unsafeWindow.T;
            G = unsafeWindow.G;

            G.SKILL={"unarmed":"none","force":"none","parry":"none","dodge":"none","sword":"none","throwing":"none","blade":"none","whip":"none","club":"none","staff":"none"};
            G.XLStatus = false;
            G.performSkills=[];
            WG.add_hook("status", function (data) {
                if (data.id == G.id && data.action == "add" && data.sid=='food' && data.name=="玄灵丹") {
                    G.XLStatus=true;
                }else if (data.id == G.id && data.action == "remove"&& data.sid=='food'){
                    G.XLStatus=false;
                }
            });
            WG.add_hook("perform", function (data) {
                G.performSkills=[];
                for (var skill of G.skills){
                    G.performSkills.push(skill.id);
                }
            });
            WG.add_hook("dialog", function (data) {
                if (data.dialog == "skills") {
                    if (data.items) {
                        console.log(data.items)
                        for (let item of data.items) {
                            if (item.name.indexOf("基本") >= 0) {
                                G.SKILL[item.id]=item.enable_skill
                            }
                        }
                    }
                    if (data.enable != undefined) {
                        for (let item of G.enable_skills) {
                            if (item.type == data.id) {
                                item.name = data.enable
                                break;
                            }
                        }
                    }
                }


            });
            messageAppend = unsafeWindow.messageAppend;
            messageClear = unsafeWindow.messageClear;
            T.perform=async function (idx = 0, n, cmds) {
                if(G.in_fight){
                    cmds = T.recmd(idx, cmds);
                    WG.SendCmd("perform "+n+";"+cmds);
                }
            };
            T.skillPerform=async function (idx = 0, n, cmds) {
                if(G.in_fight){
                    var sksp=n.split(".")
                    cmds = T.recmd(idx, cmds);
                    if (sksp[0]==G.SKILL[sksp[1]]){
                        WG.SendCmd("perform "+sksp[1]+"."+sksp[2]+";"+cmds);
                    }else{
                        WG.SendCmd(cmds);
                    }
                }
            };
            T.xperform=async function (idx = 0, n, cmds) {
                if(G.in_fight){
                    cmds = T.recmd(idx, cmds);
                    var inde=G.performSkills.indexOf(n);
                    if (inde>=0){
                        WG.SendCmd("perform "+n+";"+cmds);
                    }else{
                        WG.SendCmd(cmds);
                    }
                }
            };
            T.cdpfm=async function (idx = 0, n, cmds) {
                if(G.in_fight){
                    cmds = T.recmd(idx, cmds);
                    var inde=G.performSkills.indexOf(n);
                    if ( inde>=0 && ((!G.cds.has(n)) || (!G.cds.get(n))) ){
                        WG.SendCmd("perform "+n+";"+cmds);
                    }else{
                        WG.SendCmd(cmds);
                    }
                }
            };
            T.xuanling=async function (idx = 0, n, cmds) {
                while (!G.XLStatus){
                    WG.SendCmd("use "+ n);
                    await WG.sleep(2*G.wsdelay);
                }
            };
            $('.content-bottom').after(`<div class="ext-func"><span class="ext-item act-item-ext act-item">I</span><span class="ext-item act-item-ext act-item">II</span><span class="ext-item act-item-ext act-item">III</span><span class="ext-item act-item-ext act-item">IV</span><span class="ext-item act-item-ext act-item">V</span><span class="ext-item act-item-ext act-item">VI</span><span class="ext-item act-item-ext act-item">VII</span></div>`);
            $(".act-item-ext").on('click', function () {
                WG.SendCmd("$usezml "+this.textContent);
            });
        },200);
    });
})();