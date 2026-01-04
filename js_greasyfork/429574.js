// ==UserScript==
// @name         wsmud_plugins_yaota_dingqiankun
// @namespace    cqv
// @version      0.0.5
// @date         16/07/2021
// @modified     23/07/2021
// @homepage     网站链接
// @description  武神传说 MUD
// @author       sasamila
// @match        http://game.wsmud.com/*
// @match        http://www.wsmud.com/*
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue


// @downloadURL https://update.greasyfork.org/scripts/429574/wsmud_plugins_yaota_dingqiankun.user.js
// @updateURL https://update.greasyfork.org/scripts/429574/wsmud_plugins_yaota_dingqiankun.meta.js
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

        G.dingQKIntervalId=undefined;
        G.autoPerformIntervalId=undefined;

        G.canPerformSkills=false;

        G.maxDamage=0;

        G.canlingHp={};
        G.lastCanlingHp=0;

        G.jianXinFlag=false;
        G.lingboFlag=false;
        G.jianyuFlag=false;
        G.yihuaFlag=false;

        G.killedClCount=0;

        G.skillCds={}

        WG.add_hook("sc",async function (data) {
            if (G.yaotaFlag&&data.id!=G.id){
                var damage=G.canlingHp[data.id]-data.hp;    // 计算当前伤害值
                G.canlingHp[data.id]=data.hp                // 设置 当前妖灵剩余hp
                if (G.maxDamag<damage){                     // 判断当前伤害时否大于最大伤害值
                    G.maxDamag=damage;                       // 设置最大伤害值
                }
                if (data.hp<2*G.maxDamag){                  // 如果当前妖灵剩余hp 小于两倍的最大伤害值
                    G.canPerformSkills=false;               // 停止自动出招
                    clearInterval(G.dingQKIntervalId);
                    clearInterval(G.autoPerformIntervalId);
                    setTimeout(()=>{
                        var lastDing=Date.parse(new Date())-G.skillCds["force.ding"]["time"]
                        var dingCd=G.skillCds["force.ding"]["distime"]-(Date.parse(new Date())-G.skillCds["force.ding"]["time"])
                        if(dingCd>0){
                            setTimeout(()=>{
                                if(!G.jianXinFlag){         // 剑心buff不存在时，强制释放剑心通明
                                    WG.SendCmd("$waitpfm force.xin;");
                                }
                                WG.SendCmd("$waitpfm force.ding");      // 定乾坤
                                 G.dingQKIntervalId=setInterval(()=>{         // 启动一个新的定乾坤计时器，每9秒释放一次
                                     G.canPerformSkills=false;                // 释放前停止其他技能释放
                                     if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                                         WG.SendCmd("$waitpfm force.xin;");
                                     }
                                     WG.SendCmd("$waitpfm force.ding");      // 定乾坤
                                     G.canPerformSkills=true;                // 定乾坤后，其他技能可以继续释放
                                 },9000);
                                setTimeout(()=>{
                                    WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");  // 打死
                                    G.canPerformSkills=true;
                                    G.autoPerformIntervalId=setInterval(()=>{  // 开始新的技能循环
                                        if(G.canPerformSkills){
                                            WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");
                                        }
                                    },3000+2*G.wsdelay);
                                },3000+2*G.wsdelay)
                            },dingCd)
                        }else{
                            if(!G.jianXinFlag){         // 剑心buff不存在时，强制释放剑心通明
                                WG.SendCmd("$waitpfm force.xin;");
                            }
                            WG.SendCmd("$waitpfm force.ding");      // 定乾坤
                             G.dingQKIntervalId=setInterval(()=>{         // 启动一个新的定乾坤计时器，每9秒释放一次
                                 G.canPerformSkills=false;                // 释放前停止其他技能释放
                                 if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                                     WG.SendCmd("$waitpfm force.xin;");
                                 }
                                 WG.SendCmd("$waitpfm force.ding");      // 定乾坤
                                 G.canPerformSkills=true;                // 定乾坤后，其他技能可以继续释放
                             },9000);
                            setTimeout(()=>{
                                WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");  // 打死
                                G.canPerformSkills=true;
                                G.autoPerformIntervalId=setInterval(()=>{  // 开始新的技能循环
                                    if(G.canPerformSkills){
                                        WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");
                                    }
                                },3000+2*G.wsdelay);
                            },3000+2*G.wsdelay)
                        }
                    }, G.wsdelay+15);
                }
            }
        });

        WG.add_hook("dispfm", function (data) {
            if(G.yaotaFlag){
                G.skillCds[data.id]={"time":Date.parse(new Date()), "distime":data.distime}
            }
        });

        WG.add_hook("combat", function (data) {
            if(G.yaotaFlag){
                if(data.end&&data.end==1){
                    G.canPerformSkills=false;
                    G.skillCds={}
                    if (G.autoPerformIntervalId){
                        clearInterval(G.autoPerformIntervalId);
                    }
                    if(G.dingQKIntervalId){            // 删除上一次刷怪后启动的定乾坤定时器
                        clearInterval(G.dingQKIntervalId)
                    }
                }
                if(data.start&&data.start==1){
                    G.skillCds={}
                    if(!G.lingboFlag) WG.SendCmd("$waitpfm dodge.lingbo;");
                    if(!G.jianyuFlag) WG.SendCmd("$waitpfm sword.yu;");
                    if(!G.yihuaFlag) WG.SendCmd("$waitpfm parry.yi;");
                    WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");
                    G.autoPerformIntervalId=setInterval(()=>{  // 开始新的技能循环
                        if(G.canPerformSkills){
                            WG.SendCmd("perform force.tu;perform sword.ji;perform unarmed.zuo;");
                        }
                    },3000+2*G.wsdelay);
                }
            }
        });

        WG.add_hook("status", function (data) {
            if(G.yaotaFlag&&G.id==data.id){
                if(data.action=="add"&&data.sid=="force"){      // 新增剑心buff
                    G.jianXinFlag=true
                    G.canPerformSkills=true;
                }
                if(data.action=="remove"&&data.sid=="force"){   // 移除剑心buff
                    G.jianXinFlag=false;
                    G.canPerformSkills=false;                   // 剑心不存在 停止技能释放
                    WG.SendCmd("$waitpfm force.xin;");          // 强制释放剑心
                }

                if(data.action=="add"&&data.sid=="dodge"){      // 凌波
                    G.lingboFlag=true
                }
                if(data.action=="remove"&&data.sid=="dodge"){
                    G.lingboFlag=false
                    if(G.in_fight) {
                        if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                            WG.SendCmd("$waitpfm force.xin;");
                        }
                        WG.SendCmd("$waitpfm dodge.lingbo;");
                    }
                }

                if(data.action=="add"&&data.sid=="weapon"){    // 剑雨
                    G.jianyuFlag=true
                }
                if(data.action=="remove"&&data.sid=="weapon"){
                    G.jianyuFlag=false
                    if(G.in_fight) {
                        if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                            WG.SendCmd("$waitpfm force.xin;");
                        }
                        WG.SendCmd("$waitpfm sword.yu;");
                    }
                }

                if(data.action=="add"&&data.sid=="yihua"){    // 移花
                    G.yihuaFlag=true
                }
                if(data.action=="remove"&&data.sid=="yihua"){
                    G.yihuaFlag=false;
                    if(G.in_fight) {
                        if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                            WG.SendCmd("$waitpfm force.xin;");
                        }
                        WG.SendCmd("$waitpfm parry.yi;");
                    }
                }
            }
        });

        WG.add_hook("itemadd", function (data) {     // 刷新妖灵
            if (G.yaotaFlag && data.name.indexOf("残灵")>=0){
                G.canlingHp[data.id]=data.hp;        // 记录当前妖灵的总血量
                if(G.lastCanlingHp != data.hp){      // 如果当前妖灵的总血量跟上次妖灵的总血量不同，则重置最大事实伤害
                    G.lastCanlingHp=data.hp;
                }
                G.canPerformSkills=false;   // 刷怪时停止其他技能释放
                if(!G.jianXinFlag){         // 剑心buff不存在时，强制释放剑心通明
                    WG.SendCmd("$waitpfm force.xin;");
                }
                WG.SendCmd("$waitpfm force.ding");  // 定乾坤
                G.canPerformSkills=true;           // 定乾坤后，其他技能可以继续释放
                if(G.dingQKIntervalId){            // 删除上一次刷怪后启动的定乾坤定时器
                    clearInterval(G.dingQKIntervalId)
                }
                G.dingQKIntervalId=setInterval(()=>{         // 启动一个新的定乾坤计时器，每9秒释放一次
                    G.canPerformSkills=false;                // 释放前停止其他技能释放
                    if(!G.jianXinFlag){                      // 剑心buff不存在时，强制释放剑心通明
                        WG.SendCmd("$waitpfm force.xin;");
                    }
                    WG.SendCmd("$waitpfm force.ding");      // 定乾坤
                    G.canPerformSkills=true;                // 定乾坤后，其他技能可以继续释放
                },9000);
            }
        });
        WG.add_hook("itemremove", function (data){
            delete G.canlingHp[data.id];                  // 移除死亡的残灵hp数据
            G.killedClCount=G.killedClCount+1;
            if(G.killedClCount%7==0){
                G.maxDamage=0;
            }
        });
        WG.add_hook("room", (data) => {                     // 进入妖塔后启动 定时器 条件允许的情况下每三秒释放一次伤害技能
                if (G.yaotaFlag&&data.path!="zc/mu/shishenta"){
                    if (G.autoPerformIntervalId){
                        clearInterval(G.autoPerformIntervalId);
                    }
                    if(G.dingQKIntervalId){            // 删除上一次刷怪后启动的定乾坤定时器
                        clearInterval(G.dingQKIntervalId)
                    }
                }
                if (data.path == 'zc/mu/shishenta'){
                    WG.SendCmd("$waitpfm force.xin;");
                }
            })
        messageAppend = unsafeWindow.messageAppend;
        messageClear = unsafeWindow.messageClear;
    });
})();