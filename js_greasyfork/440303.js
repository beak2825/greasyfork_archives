// ==UserScript==
// @name         ahedu文件下载
// @namespace    aheduDownloader.taozhiyu.gitee.io
// @version      0.4
// @description  ahedu文件下载，右击文件名称下载
// @author       涛之雨
// @homepageURL  https://greasyfork.org/zh-CN/scripts/440303
// @match        *://www.ahedu.cn/EduResource/index.php?*
// @match        *://www.ahedu.cn/search/index.php?*
// @icon         https://www.ahedu.cn/EduResource/addons/theme/stv_resource/_static/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440303/ahedu%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/440303/ahedu%E6%96%87%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/* global layer flvjs*/
/* jshint esversion: 8 */
(function() {
    'use strict';
    //教师资源页
    console.group('%cahedu文件下载脚本 %c  by 涛之雨  ','color:white;background:green;font-size:30px;padding:10px','font-size:30px;padding:10px;background:orange;');
    console.log('彩蛋(算是吧)');
    console.groupEnd('cahedu文件下载脚本   by 涛之雨  ');
    const appName= location.href.match(/app=([^&]+)/),
          acyName=location.href.match(/acy_name=([^&]+)/);
    if(location.pathname.startsWith("/EduResource")){
        if(!location.href.match(/rid=([\da-z]+)/))return;
        if(!appName||appName.length<2||!acyName||acyName.length<2){
            return;
        }

        var getVideoLink=async dom=> await fetch("//www.ahedu.cn/EduResource/index.php?app="+appName[1]+"&mod=ResList&act=downloadRes&acy_name="+acyName[1], {
            "headers": {
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "pragma": "no-cache",
            },
            "referrer": location.href,
            "body": "rid="+ dom.getAttribute("data-value"),
            "method": "POST"
        }).then(a=>a.json()).then(a=>{
            if(a.code!==200){
                throw '';
            }
            return a.url;
        }).catch(a=>!layer.msg("网络请求出错...", {icon: 5}));

        document.querySelectorAll('.zuopin_resource_a').forEach(a=>{
            a.oncontextmenu=async x=>{
                x.preventDefault();
                const v=await getVideoLink(x.target);
                if(v){
                    layer.msg("加载成功，准备下载", {icon: 1});
                    window.location.href=v;
                }
                return false;
            };
        });
        layer.msg("脚本加载成功<br>右键点击[文件名]下载文件", {icon: 1});
        setTimeout(function(){
            const prev=document.querySelector('#preview_flv');
            if(prev&&prev.innerText.startsWith('Error loading')){
                (async function(){
                    var v=await getVideoLink(document.querySelector('.cur a'));
                    if(/\.flv$/.test(v)){
                        // @require      https://cdn.bootcdn.net/ajax/libs/flv.js/1.6.2/flv.min.js
                        //flvjs.isSupported()&&
                        // prev.innerHTML=`<video src='${v}' controls style='width:100%;height:100%' muted></video>`;
                        // var flvPlayer = flvjs.createPlayer({
                        //     type: 'flv',
                        //     url: v
                        // });
                        // flvPlayer.attachMediaElement(prev.querySelector('video'));
                        // flvPlayer.load();
                        layer.msg("暂不支持在线播放flv格式<br>您可以尝试下载", {icon: 7});
                    }if(/\.mp4$/.test(v)){
                        prev.innerHTML=`<video src='${v}' controls style='width:100%;height:100%'></video>`;
                        layer.msg("已为您修复并重构播放界面", {icon: 1});
                    }else{
                        layer.msg("暂不支持的格式<br>您可以尝试下载", {icon: 7});
                    }
                })();
            }
        },2000);
    }else if(location.pathname.startsWith("/search")){
        var rid=location.href.match(/resId=([\da-z]+)/);
        if(rid.length<2){
            return;
        }
        var links=document.body.parentElement.innerHTML.match(new RegExp(`[^'"]+${rid[1]}[^'"]+`,'g'));
        if(!links){
            links=document.body.parentElement.innerHTML.match(/fileurl\s*=\s*['"][^'"]+/g);
            if(!links){
                layer.msg("获取链接出错...", {icon: 5});
                return;
            }
            links=links[0].match(/[^'"]+$/g);
        }
        links=[...new Set(links)].filter(a=>!a.match(/html|qrCode/));
        if(links.length!==1){
            layer.msg("获取到未预期的链接数量...<br>请F12打开控制台查看链接<br>理论上每个都一样", {icon: 3});
            console.clear();
            console.group('%cahedu文件下载脚本 %c  by 涛之雨  ','color:white;background:green;font-size:30px;padding:10px','font-size:30px;padding:10px;background:orange;');
            links.map(a=>console.log(a));
            console.groupEnd('cahedu文件下载脚本   by 涛之雨  ');
            return false;
        }
        document.querySelectorAll('.down').forEach(x=>{
            x.oncontextmenu=x=>{
                layer.msg("加载成功，准备下载", {icon: 1});
                window.location.href=links;
                return false;
            };
        });
        layer.msg("脚本加载成功<br>右键点击[下载]按钮<br>即可下载文件", {icon: 1});
    }
})();