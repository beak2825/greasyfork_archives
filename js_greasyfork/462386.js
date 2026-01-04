// ==UserScript==
// @name         UnderHentai小工具
// @namespace    http://tampermonkey.net/
// @version      0.8.2
// @description  手机端因为广告基本不能正常观看，故有此脚本，里番动漫站点：https://www.underhentai.net/
// @author       thunder-sword
// @match        *://www.underhentai.net/*
// @match        *://doodstream.com/e/*
// @match        *://dood.yt/e/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=underhentai.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462386/UnderHentai%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/462386/UnderHentai%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
//更新日志：
//v0.8：已兼容pc和手机端（kiwi浏览器）；kiwi可以安装低版本的油猴插件，但是低版本无法使用可选链操作符“?.”，否则脚本不会执行，于是将所有的可选链操作符替换成等效兼容代码即可成功运行；同时默认使player页面的js不会被清除以提高稳定性
//v0.7：此版本在pc端使用油猴插件基本上已经不会导致广告弹出，但是手机端还会，原因是手机端如果不用油猴工作方式有些不同，比如via浏览器和x浏览器，它们不会像油猴那样识别iframe中的url进行多次执行，而只会在主iframe执行一次，所以bood的广告在手机端根本没有去除


// 通过修改参数可以修改广告作用效果。
const settings={
    "del_nomal_adv":true,
    "del_sex_adv":false,//player页面上的sex广告依托于js实现，如果不想关闭同时需要使clear_player_script=false
    "delay":300,
    "clear_player_script":false,//删除播放器页面的所有script和iframe，再手动引入播放iframe，可能能加快页面速度，但也可能引起页面异常
};

//作用：删除普通广告（烦人的，让视频无法观看的）
function del_nomal_adv(){
    if(-1!==window.location.host.indexOf("underhentai")){
        //删除侧栏广告
        var afiEl = document.querySelector("div.afi-sm");
        if (afiEl) {
            afiEl.remove();
        }
        //删除点击watch按钮会弹出页面广告
        document.querySelectorAll("#main > div.col-sm-8.col-md-9.col-lg-9.content > div.content-table > table > tbody > tr > td.c8 > a").forEach(function(e) {
            if (e) {
                e.setAttribute("class", "");
            }
        });
        if('/watch/'===window.location.pathname){
            //删除视频播放前的弹窗广告【删除好像会使视频加载不出来，改为隐藏】
            //document.querySelectorAll("div#overlay").forEach(function(e) {if (e) {e.remove();}});
            document.querySelectorAll("div#overlay").forEach(function(e) {if (e) {e.hidden=true;}});
        }
    }else if(-1!==window.location.host.indexOf("dood")){
        setInterval(() => {
            //删除所有script
            document.querySelectorAll('script').forEach(function(e) {if (e) {e.remove();}});
            //删除所有iframe
            document.querySelectorAll('iframe').forEach(function(e) {if (e) {e.remove();}});
            //删除检查对话框
            document.querySelectorAll('#checkresume_div').forEach(function(e) {if (e) {e.remove();}});
            //删除body所有一层子孩子有id的div，除了os_player，有一个id随机的div就是手机点击视频会弹窗的元凶
            document.querySelectorAll('body > div').forEach(function(div) {
                if (div && div.id && "os_player" !== div.id){
                    div.remove();
                    //alert(div.id);
                }
            });
        }, 1000);
        console.log("dood普通广告清理完毕");
        //alert("dood普通广告清理完毕");
    }
}

//作用：删除sex广告（不影响观看体验的，提升情趣的）
function del_sex_adv(){
    if(-1!==window.location.host.indexOf("underhentai")){
        var afiEl = document.querySelector("div.afi-lg");
        if (afiEl) {
            afiEl.remove();
        }
        if('/watch/'===window.location.pathname){
            //删除播放页面上下两个广告框
            document.body.querySelectorAll('.visible-xs').forEach(function(e) {if (e) {e.remove();}});
        }
    }
}

//作用：一种思路，获取到url后再替换video，缺点是不能切换源，同时还要识别不同的url，舍去这种思路【舍去】
function get_url_replace_video(){
    let url=document.body.innerHTML.match("(https://video.storangeunderh.com/player/.*?)\\\\")[1];
    if(!url){
        alert("未找到videourl");
        console.log("未找到videourl");
    }
    console.log(url);
    url+="?ads=false";

    //删除所有script
    document.body.querySelectorAll('script').forEach(function(e) {if (e) {e.remove();}});
    //删除所有iframe
    document.body.querySelectorAll('iframe').forEach(function(e) {if (e) {e.remove();}});
    //删除视频播放前的弹窗广告
    document.querySelectorAll("div#overlay").forEach(function(e) {if (e) {e.remove();}});
    //添加新的iframe播放视频
    var iframe=document.createElement("iframe");
    iframe.scrolling='no';
    iframe.frameborder="0";
    iframe.allowFullscreen=true;
    iframe.src=url;
    document.querySelector("#doodstream").appendChild(iframe);
    //document.querySelector(".sidebar-dark").append(iframe);
    //document.querySelector(".embed-responsive").forEach(function(e) {if (e) {e.remove();}});
}

//作用：删除掉视频播放页面中的所有script和iframe，再手动引入播放iframe，可能能加快页面速度，但更可能引起页面异常
function clear_player_script(){
    if(-1!==window.location.host.indexOf("underhentai") && '/watch/'===window.location.pathname){
        console.log("清除播放界面的广告");
    }else{
        return;
    }
    let ret=document.body.innerHTML.match(/\$\(function.*<\/iframe>"\);}\);/);
    if(!ret){
        alert("未找到视频加载脚本");
        console.log("未找到视频加载脚本");
    }
    let content=ret[0];
    content=content.slice(1)+"})();";//去除掉开头的$，因为发现有这玩意函数总是执行不成功，去掉之后用普通jquery方式执行就可以成功执行了，话说为什么啊
    console.log(content);

    //删除所有script
    document.body.querySelectorAll('script').forEach(function(e) {if (e) {e.remove();}});
    //删除所有iframe
    document.body.querySelectorAll('iframe').forEach(function(e) {if (e) {e.remove();}});

    //先加载jquery，然后执行代码
    var jquery=document.createElement("script");
    jquery.src="https://code.jquery.com/jquery-latest.min.js";
    jquery.onload = function() {
        //console.log("start");
        // jQuery 加载完成后执行的代码
        var script=document.createElement("script");
        script.innerHTML=content;
        document.body.append(script);
        //console.log("end");
    };
    document.body.append(jquery);
}

(function() {
    //取消所有 interval
    var highestIntervalId = setInterval(";");
    for (var i = 0 ; i < highestIntervalId ; i++) {
        clearInterval(i);
    }
    if(settings["del_nomal_adv"]){
        setTimeout(del_nomal_adv(), settings["delay"]);
    }
    if(settings["del_sex_adv"]){
        setTimeout(del_sex_adv(), settings["delay"]);
    }
    if(settings["clear_player_script"]){
        //alert("删除播放器广告已执行");
        setTimeout(clear_player_script(), settings["delay"]);
    }
    //alert("可以运行");
})();