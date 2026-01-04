// ==UserScript==
// @name         wsmud_plugins_yaota_wanfa_auto
// @namespace    cqv
// @version      0.0.17
// @date         16/08/2021
// @modified     24/09/2021
// @homepage     网站链接
// @description  武神传说 MUD
// @author       sasamila
// @match        http://game.wsmud.com/*
// @match        http://www.wsmud.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue


// @downloadURL https://update.greasyfork.org/scripts/431008/wsmud_plugins_yaota_wanfa_auto.user.js
// @updateURL https://update.greasyfork.org/scripts/431008/wsmud_plugins_yaota_wanfa_auto.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var WG = undefined;
    var T = undefined;
    var G = undefined;
    var messageAppend = undefined;
    var messageClear = undefined;
    $(document).ready(function () {
        WG = unsafeWindow.WG;
        T = unsafeWindow.T;
        G = unsafeWindow.G;
        G.xlInfo={"hio":{"id":undefined,"num":0},"HIZ":{"id":undefined,"num":0},"hiy":{"id":undefined,"num":0},"hic":{"id":undefined,"num":0},"hig":{"id":undefined,"num":0}}
        G.jianXinFlag=false;
        G.zhuifengFlag=false;
        G.jianyuFlag=false;
        G.sanqingFlag=false;
        G.ytXuanlingFlag=false;
        G.yaotacishu=10;
        G.curYaotacishu=0;
        G.fdltId=undefined
        G.thisScriptLoaded=false
        G.lastXlTime=undefined
        G.xuanXlRemainTimeIntervalId=undefined
        G.xuanXlRemainTime=undefined
        G.skillsAndEqs=""

        function eatXl(){
            if(!G.ytXuanlingFlag){
                if (G.xlInfo.hio.id&&G.xlInfo.hio.num>0){
                    WG.SendCmd("use "+G.xlInfo.hio.id);
                }else if (G.xlInfo.HIZ.id&&G.xlInfo.HIZ.num>0){
                    WG.SendCmd("use "+G.xlInfo.HIZ.id);
                }else if (G.xlInfo.hiy.id&&G.xlInfo.hiy.num>0){
                    WG.SendCmd("use "+G.xlInfo.hiy.id);
                }else if (G.xlInfo.hic.id&&G.xlInfo.hic.num>0){
                    WG.SendCmd("use "+G.xlInfo.hic.id);
                }else if (G.xlInfo.hig.id&&G.xlInfo.hig.num>0){
                    WG.SendCmd("use "+G.xlInfo.hig.id);
                }
            }
        }

        function status(data) {
            if (G.id!=data.id) {
                return
            }

            if (data.sid=='food') {
                if (data.action=='add') {
                    G.ytXuanlingFlag=true
                    G.xuanXlRemainTime=data.duration/1000
                    $("#xl_remain_time_span").html(G.xuanXlRemainTime);
                    G.xuanXlRemainTimeIntervalId=window.setInterval(()=>{
                        if(G.xuanXlRemainTime>0){
                            G.xuanXlRemainTime=G.xuanXlRemainTime-1
                            $("#xl_remain_time_span").html(G.xuanXlRemainTime);
                        }else{
                            clearInterval(G.xuanXlRemainTimeIntervalId)
                        }
                    }, 1000)
                    G.lastXlTime=new Date().getTime()
                } else {
                    G.ytXuanlingFlag=false
                    clearInterval(G.xuanXlRemainTimeIntervalId)
                    if(G.yaotaFlag){
                        eatXl()
                    }
                }
            } else if (data.sid=='force') {
                if (data.action=='add') {
                    G.jianXinFlag=true
                } else {
                    G.jianXinFlag=false;
                    if(G.yaotaFlag){
                        if(!G.ytXuanlingFlag){
                            eatXl()
                        }
                        WG.SendCmd("$waitpfm force.xin");
                    }
                }
            }else if (data.sid=='dodge') {
                if (data.action=='add') {
                    G.zhuifengFlag=true
                } else {
                    G.zhuifengFlag=false
                    if(G.yaotaFlag&&G.in_fight) {
                        if(!G.jianXinFlag){
                            if(!G.ytXuanlingFlag){
                                eatXl()
                            }
                            WG.SendCmd("$waitpfm force.xin");
                        }
                        WG.SendCmd("$waitpfm dodge.zhui");
                    }
                }
            }else if (data.sid=='weapon') {
                if (data.action=='add') {
                    G.jianyuFlag=true
                } else {
                    G.jianyuFlag=false
                    if(G.yaotaFlag&&G.in_fight) {
                        if(!G.jianXinFlag){
                            if(!G.ytXuanlingFlag){
                                eatXl()
                            }
                            WG.SendCmd("$waitpfm force.xin");
                        }
                        WG.SendCmd("$waitpfm sword.yu");
                    }
                }
            }else if (data.sid=='sanqing') {
                if (data.action=='add') {
                    G.sanqingFlag=true
                } else {
                    G.sanqingFlag=false;
                    if(G.yaotaFlag){
                        if(!G.jianXinFlag){
                            if(!G.ytXuanlingFlag){
                                eatXl()
                            }
                            WG.SendCmd("$waitpfm force.xin");
                        }
                        WG.SendCmd("$waitpfm force.san");
                    }
                }
            }
        }

        function combat(data){
            if(G.yaotaFlag){
                if(data.end&&data.end==1){

                }
                if(data.start&&data.start==1){
                    if(!G.jianXinFlag){
                        if(!G.ytXuanlingFlag){
                            eatXl()
                        }
                        WG.SendCmd("$waitpfm force.xin");
                    }
                    if (!G.zhuifengFlag){
                        WG.SendCmd("$waitpfm sword.yu");
                    }
                    if (!G.jianyuFlag){
                        WG.SendCmd("$waitpfm dodge.zhui");
                    }
                    if (!G.sanqingFlag){
                        WG.SendCmd("perform force.san");
                    }
                    WG.SendCmd("perform sword.ji;perform unarmed.zuo;$wait 500;perform parry.dao;perform unarmed.luan");
                }
            }

        }

        function itemadd(data) {
            if (G.yaotaFlag && data.name.indexOf("残灵")>=0){
                WG.SendCmd("$waitpfm force.wan");
            }
        }

        function perform(cmd){
            if(G.in_fight) {
                WG.SendCmd(cmd);
            }
        }

        async function dispfm(data){
            if(G.yaotaFlag){
                if (data.id == "sword.ji"){
                    await WG.sleep(data.distime)
                    if(!G.jianXinFlag){
                        if(!G.ytXuanlingFlag){
                            eatXl()
                        }
                        WG.SendCmd("$waitpfm force.xin");
                    }
                    perform("perform sword.ji;perform unarmed.zuo");
                }else if (data.id == "parry.dao"){
                    await WG.sleep(data.distime)
                    if(!G.jianXinFlag){
                        if(!G.ytXuanlingFlag){
                            eatXl()
                        }
                        WG.SendCmd("$waitpfm force.xin");
                    }
                    perform("perform parry.dao;perform unarmed.luan");
                }
            }
        }

        WG.add_hook("dispfm", dispfm);

        WG.add_hook("combat", combat);

        WG.add_hook("status", status);

        WG.add_hook("itemadd", itemadd);

        WG.add_hook("items",(data)=>{
            for (var i= 0;i<data.items.length;i++){
                let item=data.items[i]
                if(item.name == "疯癫的老头"){
                    G.fdltId=item.id;
                    break
                }
            }
        });

        async function flyto(){
            if (typeof(G.lastXlTime) == "undefined"||G.ytXuanlingFlag) {
                WG.SendCmd("flyto muyuan");
                return
            }
            var xlcd=(60*1000)-(new Date().getTime()-G.lastXlTime)
            if(xlcd>0){
                await WG.sleep(xlcd+1000)
            }
            WG.SendCmd("flyto muyuan")
        }

        async function room(data){
            if (G.yaotaFlag&&data.path!="zc/mu/shishenta"){
                G.curYaotacishu=G.curYaotacishu+1;
                if (G.curYaotacishu<G.yaotacishu){
                    WG.SendCmd("enable force changshengjue;perform force.zhen;enable force "+G.id+"");
                    await WG.sleep(1000)
                    flyto()
                }else{
                    await WG.sleep(3000)
                    G.curYaotacishu=0;
                    WG.SendCmd("jh fam 9 start;go enter;enable force none;enable force changshengjue;$wait 1000;$killall;");
                    await WG.sleep(3000)
                    G.jianXinFlag=false;
                    G.zhuifengFlag=false;
                    G.jianyuFlag=false;
                    G.sanqingFlag=false;
                    G.ytXuanlingFlag=false;
                    G.lastXlTime=undefined
                    clearInterval(G.xuanXlRemainTimeIntervalId)
                    G.xuanXlRemainTimeIntervalId=undefined
                    G.xuanXlRemainTime=undefined
                    WG.SendCmd("perform force.zhen;enable force "+G.id+";$zdwk");
                    $('#xl_remain_time_span').remove()
                    $('#xl_remain_time_div').remove()
                }
            }
            if (data.path == 'zc/mu/shishenta'){
                if (typeof(G.xuanXlRemainTimeIntervalId) == "undefined"){
                    $(`.state-bar`).before(`<div class="zdy-item" id=xl_remain_time_div>玄灵丹 <span id=xl_remain_time_span></span></div>`)
                }
                eatXl()
                await WG.sleep(1500)
                WG.SendCmd("$waitpfm force.xin");
            }
            if (data.path == 'zc/muyuan'){
                var html='';
                if (G.xlInfo.hio.id&&G.xlInfo.hio.num>0){
                    html=html+`<span class="zdy-item"><hio>玄灵丹 * `+G.xlInfo.hio.num+`</hio></span>`
                }
                if (G.xlInfo.HIZ.id&&G.xlInfo.HIZ.num>0){
                    html=html+`<span class="zdy-item"><HIZ>玄灵丹 * `+G.xlInfo.HIZ.num+`</HIZ></span>`
                }
                if (G.xlInfo.hiy.id&&G.xlInfo.hiy.num>0){
                    html=html+`<span class="zdy-item"><hiy>玄灵丹 * `+G.xlInfo.hiy.num+`</hiy></span>`
                }
                if (G.xlInfo.hic.id&&G.xlInfo.hic.num>0){
                    html=html+`<span class="zdy-item"><hic>玄灵丹 * `+G.xlInfo.hic.num+`</hic></span>`
                }
                if (G.xlInfo.hig.id&&G.xlInfo.hig.num>0){
                    html=html+`<span class="zdy-item"><hig>玄灵丹 * `+G.xlInfo.hig.num+`</hig></span>`
                }
                if (G.xlInfo.hio.num+G.xlInfo.HIZ.num+G.xlInfo.hiy.num+G.xlInfo.hic.num+G.xlInfo.hig.num<20){
                    html=html+`<span class="zdy-item"><ord>玄灵丹库存不足！</ord></span>`
                }
                $(`.state-bar`).before(`<div id=xl_count>`+html+`</div>`)
            }else{
                $('#xl_count').remove()
            }
        }

        WG.add_hook("room", room)

        WG.add_hook(["dialog"], function (data) {
            if(data.dialog=="pack"){
                if (data.items){
                    for(var i =0;i<data.items.length;i++){
                        if(data.items[i]["name"].indexOf("玄灵丹")>0){
                            if (data.items[i]["name"].indexOf("hig")>0){
                                G.xlInfo.hig.id=data.items[i]["id"]
                                G.xlInfo.hig.num=data.items[i]["count"]
                            }else if (data.items[i]["name"].indexOf("hic")>0){
                                G.xlInfo.hic.id=data.items[i]["id"]
                                G.xlInfo.hic.num=data.items[i]["count"]
                            }else if (data.items[i]["name"].indexOf("hiy")>0){
                                G.xlInfo.hiy.id=data.items[i]["id"]
                                G.xlInfo.hiy.num=data.items[i]["count"]
                            }else if (data.items[i]["name"].indexOf("HIZ")>0){
                                G.xlInfo.HIZ.id=data.items[i]["id"]
                                G.xlInfo.HIZ.num=data.items[i]["count"]
                            }else if (data.items[i]["name"].indexOf("hio")>0){
                                G.xlInfo.hio.id=data.items[i]["id"]
                                G.xlInfo.hio.num=data.items[i]["count"]
                            }
                        }
                    }
                }else{
                    if(data.id&&data.remove){
                        for(var key in G.xlInfo){
                            if (data.id == G.xlInfo[key]["id"]){
                                G.xlInfo[key]["num"]=G.xlInfo[key]["num"]-data.remove
                                break
                            }
                        }
                    }
                }
            }
        })

        WG.add_hook(["login"], (data)=>{
            if (!G.thisScriptLoaded){
                G.thisScriptLoaded=true
                G.yaotacishu= GM_getValue(data.id+"_yaotacishu",G.yaotacishu)
                G.skillsAndEqs= GM_getValue(data.id+"_skillsAndEqs",G.skillsAndEqs)
                $('.WG_button').append(`<span id="go_yt_btn" class="zdy-item yaota" style="float:right;">妖塔</span>`)
                $("#go_yt_btn").on("click", async function(){
                    G.skillsAndEqs = prompt("切换套装", G.skillsAndEqs)
                    if(G.skillsAndEqs!=""){
                        GM_setValue(G.id+"_skillsAndEqs",G.skillsAndEqs)
                        WG.SendCmd("stopstate;"+G.skillsAndEqs);
                    }
                    G.yaotacishu = parseInt(prompt("要进行多少次妖塔？", G.yaotacishu))
                    if(isNaN(G.yaotacishu)){
                        alert("请输入数字");
                        return
                    }
                    await WG.sleep(2000);
                    GM_setValue(G.id+"_yaotacishu",G.yaotacishu)
                    WG.SendCmd("stopstate;jh fam 9 start;go enter;go up")
                    await WG.sleep(1500);
                    WG.SendCmd("ggdl "+G.fdltId+";go north;go north;go north;go north;go north;go north;$wait 1000;look shi;tiao1 shi;tiao3 shi;tiao1 shi;tiao3 shi;tiao2 shi;go north")
                    await WG.sleep(5000);
                    flyto()
                });
            }
        });
        messageAppend = unsafeWindow.messageAppend;
        messageClear = unsafeWindow.messageClear;
    });
})();