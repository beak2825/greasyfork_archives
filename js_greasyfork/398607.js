// ==UserScript==
// @name         Bilibili Audit Notifier
// @namespace    http://tampermonkey.net/
// @version      0.3.4
// @description  在你的B站稿件状态改变时进行通知，需要挂创作中心在后台
// @author       yuyuyzl
// @match        https://member.bilibili.com/v2*
// @match        https://member.bilibili.com/platform*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398607/Bilibili%20Audit%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/398607/Bilibili%20Audit%20Notifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Notification.requestPermission();
    let prevData=[];
    let lastUpdate=undefined;
    const transformAuditsList=ls=>ls?Object.fromEntries(ls.map(o=>[o.Archive.bvid,o])):{};



    const checkAuditStat=()=>fetch("https://member.bilibili.com/x/web/archives?status=is_pubing&pn=1&ps=10&coop=1&interactive=1").then(res=>{
        res.json().then(res=>{
            console.log(res);
            const curDataObj=transformAuditsList(res.data.arc_audits);
            const prevDataObj=transformAuditsList(prevData);
            res.data.arc_audits&&res.data.arc_audits.forEach(o=>{
                const prevRecord=prevDataObj[o.Archive.bvid];
                if(prevRecord){
                    if(prevRecord.Archive.duration!==o.Archive.duration){
                        //o转码完成
                        Notification.requestPermission( function(status) {
                            var n = new Notification("转码完成", {body: o.Archive.title+"已转码完成",icon:o.Archive.cover});
                            n.onclick=()=>window.open("https://member.bilibili.com/v2#/upload-manager/article/");
                        });
                    }
                    if(prevRecord.Archive.state_desc!==o.Archive.state_desc){
                        //o审核状态改变
                        Notification.requestPermission( function(status) {
                            var n = new Notification("审核状态改变:"+o.Archive.state_desc, {body: o.Archive.title+(o.Archive.reject_reason||"审核状态改变"),icon:o.Archive.cover});
                            n.onclick=()=>window.open("https://member.bilibili.com/v2#/upload-manager/article/");
                        });
                    }
                }else{
                    //新视频提交或脚本启动
                    console.log(`开始监视${o.Archive.bvid} - ${o.Archive.title}`);
                    //测试
                    /*
                    Notification.requestPermission( function(status) {
                        var n = new Notification("[TEST]过审发布成功", {body: o.Archive.title+"已过审",icon:o.Archive.cover});
                        n.onclick=()=>window.open("https://www.bilibili.com/video/"+o.Archive.bvid+"/");
                    });
                    */
                }
            });
            prevData&&prevData.forEach(o=>{
                const curRecord=curDataObj[o.Archive.bvid];
                if(!curRecord&&o.Archive.state!==0){
                    //o过审,解决误报已通过视频问题兜底（我觉得B站接口有问题）
                    Notification.requestPermission( function(status) {
                        var n = new Notification("过审发布成功", {body: o.Archive.title+"已过审",icon:o.Archive.cover});
                        n.onclick=()=>window.open("https://www.bilibili.com/video/"+o.Archive.bvid+"/");
                    });
                }
            });
            prevData=res.data.arc_audits||[];
        })
    }).finally(()=>{//("00"+60).substr(-2)
        lastUpdate=`${new Date().getHours()}:${("00"+new Date().getMinutes()).substr(-2)}:${("00"+new Date().getSeconds()).substr(-2)}`;
        setTimeout(checkAuditStat,30000);
    });


    window.addEventListener("load",()=>{
        const node=document.createElement("div");
        node.style.color="#888888";
        node.style.marginLeft="16px";
        node.style.fontSize="14px";
        node.id="notifier-stat";
        node.innerText="Bilibili Audit Notifier - 已挂载";
        node.onclick=()=>{
            Notification.requestPermission( function(status) {
                var n = new Notification("测试通知", {body: "Bilibili Audit Notifier (@yuyuyzl)"});
                n.onclick=()=>window.open("https://www.bilibili.com/video/"+o.Archive.bvid+"/");
            });
        }
        console.log(node);
        document.querySelector(".header .left-block").appendChild(node);
        setInterval(()=>{
            node.innerText=`Bilibili Audit Notifier - 监视中: ${prevData.length}  上次更新: ${lastUpdate}`;
            node.title=`正在监视:\n${prevData.map(o=>o.Archive.title).join("\n")}\n请保持该页面打开以接收推送消息，单击可触发测试通知`
        },1000);
        checkAuditStat();
    })

    // Your code here...
})();