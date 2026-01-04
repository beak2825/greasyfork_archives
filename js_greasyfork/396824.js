// ==UserScript==
// @name         直播流获取
// @namespace    mscststs
// @version      0.62
// @description  bilibili 获取直播流
// @author       mscststs
// @match        https://live.bilibili.com/blanc/*
// @match        https://live.bilibili.com/*
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=713767
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @grant 		GM_setValue
// @grant 		GM_getValue
// @grant 		GM_addValueChangeListener
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/396824/%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396824/%E7%9B%B4%E6%92%AD%E6%B5%81%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     工具库,拷贝
    */

    const valueKey = "bilibili_live_stream_invisible"
    let showBtn = 0, closeBtn = 0;

    if(GM_getValue(valueKey,0)){

        $("body").append(`<style>#helper_stream{display:block}</style>`)
        showBtn = GM_registerMenuCommand( "隐藏右下角菜单",()=>{
            GM_setValue(valueKey,false);
            location.reload();
        });
    }else{
        $("body").append(`<style>#helper_stream{display:none}</style>`)
        closeBtn = GM_registerMenuCommand( "显示右下角菜单",()=>{
            GM_setValue(valueKey,true);
            location.reload();
        });
    }

    GM_registerMenuCommand( "设置外部播放器协议",()=>{
        const f = prompt("请输入你的播放器协议,例如:  potplayer://  \n 配置此项后就可以在复制直播流时按住 Ctrl 直接拉起外部播放器",GM_getValue("bilibili_live_stream_outer_proto",""));
        if(f){
            GM_setValue("bilibili_live_stream_outer_proto",f);
        }
    });



    function msg(text,level,time,left,top){
        text=text||"这是一个提示";
        level=level||"success";
        time=time||2000;
        if(level!="success"){
            console.log(text);
        }
        var id = (new Date()).valueOf();

        $("body").append('<div class="link-toast '+level+'"data-id="'+id+'" style="left: '+left+'; top: '+top+';"><span class="toast-text">'+text+'</span></div>');
        $("div.link-toast[data-id='"+id+"']").slideDown("normal",function(){setTimeout(function(){$("div.link-toast[data-id='"+id+"']").fadeOut("normal",function(){$("div.link-toast[data-id='"+id+"']").remove();});},time);});

    }
    window.copy = window.copy || function (url) {
        const input = document.createElement('input');
        input.setAttribute('value', url);
        input.setAttribute('readonly', 'readonly');
        document.body.appendChild(input);
        input.select();
        input.setSelectionRange(0, 99999999999);
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            console.log('复制成功',url);
        }
        document.body.removeChild(input);
    }

    let roomid = (()=>{
        try{
            let [[,roomid]] = [...window.location.pathname.matchAll(/\/(\d{1,})/g)]
            return roomid
        }catch(e){
            return false;
        }
    })()
    console.log("roomid >>>>",roomid )
    if(roomid){
        (async ()=>{
            $("body").append(`
<style>
#helper_stream{
    border: 1px solid #e9eaec;
    border-radius: 12px;
    font-size: 12px;
    padding: 16px 12px 24px 12px;
    margin: 0;
    margin-bottom: 24px;
    background-color: #fff;
    user-select:none;
}
#helper_stream .title{
    margin-top: 0;
    font-size: 20px;
    color: #333;
}
#helper_stream ul{
    padding:0 0 0 20px;
    list-style-type: none;
    font-size:16px;
    color:rgb(35, 173, 229);
    line-height:26px;
}

#helper_stream li, #helper_stream a{
    color:rgb(35, 173, 229);
    cursor:pointer;
}

#helper_stream li:hover{
    text-shadow:0 0 0.5px #00f;
}
</style>
`)
            let {data:{play_url}} = await (await fetch(`https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomPlayInfo?room_id=${roomid}&play_url=1&mask=1&qn=20000&platform=web`)).json()
            console.log(play_url.durl[0].url)
            $("div.right-container").prepend(
            `
<div id="helper_stream">
<p class="title">直播流获取器</p>
<ul class="link-list">
${play_url.durl.map((d,i)=>{
    return `<a class="stream_link" data-url="${d.url}" href="${d.url}"> 直播流链接 ${i+1}</a>`
}).join("\n")}
<ul>
</div>
`)
            let contextMenu = await mscststs.wait("ul[class^=_web-player-context-menu_]");
            const hash = contextMenu.className.split("_").reverse()[0];
            $(contextMenu).prepend(`
            <li class="_context-menu-item_${hash}">
            <span class="_context-menu-text_${hash}">
                复制直播流地址
            </span>
            <div class="_context-menu-right-arrow_${hash}"></div>

            <ul class="_context-sub-menu_${hash}">
${play_url.durl.map((d,i)=>{
    return `<li class="_context-sub-menu-item_${hash} stream_link" data-url="${d.url}"> 直播流链接 ${i+1}</li>`
}).join("\n")}
            </ul></li>
            `)
             $("body").on("click",".stream_link",function(e){
                 var url = $(this).attr("data-url");
                 console.log("url",url,e)
                 window.copy(url);
                 if(e.ctrlKey || e.metaKey){
                     let proto = GM_getValue("bilibili_live_stream_outer_proto", "");
                     if(proto){
                         location.href = (proto + url);
                     }
                 }
                 e.preventDefault();
                 msg("复制成功","success",2000,e.pageX+"px",e.pageY+"px")
                 document.querySelector(("ul[class^=_web-player-context-menu_]")).style.opacity=0 // 隐藏contextMenu
              });
        })()
    }
})();