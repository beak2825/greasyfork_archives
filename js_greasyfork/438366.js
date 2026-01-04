// ==UserScript==
// @name         CC163FullScreen
// @namespace    https://greasyfork.org/zh-CN/users/135090
// @version      1.5.6
// @description  获取M3U8地址并使用Dplayer播放
// @author       ZWB
// @license      CC
// @run-at       document-end
// @noframes
// @match        https://cc.163.com/1*/
// @match        https://cc.163.com/2*/
// @match        https://cc.163.com/3*/
// @match        https://cc.163.com/4*/
// @match        https://cc.163.com/5*/
// @match        https://cc.163.com/6*/
// @match        https://cc.163.com/7*/
// @match        https://cc.163.com/8*/
// @match        https://cc.163.com/9*/
// @match        https://cc.163.com/live/channel/*
// @downloadURL https://update.greasyfork.org/scripts/438366/CC163FullScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/438366/CC163FullScreen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.pathname.includes("channel")){
        // require
        var dpscript = document.createElement('script');
        dpscript.src = 'https://cdnjs.cloudflare.com/ajax/libs/dplayer/1.27.1/DPlayer.min.js';
        var hlss=document.createElement('script');
        hlss.src = 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.5.18/hls.min.js';
        document.body.appendChild(dpscript);
        document.body.appendChild(hlss);
        fetch(location.href)
            .then((response) => response.json())
            .then((data) => {return data?.data[0]})
            .then((data)=>{
                var nickname=data?.nickname;
                var cover=data?.cover;
                var sf=data?.sharefile;
                var startat=data?.startat;
                var isaudio=data?.is_audiolive;
                var ccid=data?.ccid;
                setTimeout(function(){
                    document.body.setAttribute("align","center");
                    document.body.innerHTML=("");
                    document.title=nickname;
                    var vdiv=document.createElement("div");
                    vdiv.id="dplayer";
                    vdiv.style.height="auto";
                    vdiv.style.width="64%";
                    var adiv=document.createElement("a");
                    adiv.href="https://cc.163.com/"+ccid;
                    adiv.textContent="直播间"+ccid+"于"+startat+"开播";
                    document.body.append(vdiv);
                    document.body.append(adiv)
                    if(isaudio==1){
                        document.body.innerHTML="<h1>音频直播，暂不支持</h1>";
                    }else{
                        var dp=new DPlayer({
                            container: document.getElementById('dplayer'),
                            live: true,
                            volume: 1.0,
                            video: {
                                url: sf,
                                type: 'hls',
                                pic: cover,
                            },
                        });
                        dp.fullScreen.request('web');
                        dp.play();
                    }
                },500);
            });
    }else{
        player();
    }
    function player(){
        var nqcid=__NEXT_DATA__?.props?.pageProps?.roomInfoInitData?.live?.channel_id;
        var nppid=__NEXT_DATA__?.props?.pageProps?.roomInfoInitData?.live?.cid;
        var status=__NEXT_DATA__?.props?.pageProps?.roomInfoInitData?.live?.status;
        var cid =  nppid == undefined ? nqcid : nppid;
        //"https://coopapi.cc.163.com/v1/msharelive/share_data/?ccid="+location.pathname;
        if (cid == undefined) {cid= -1;}
        var roomdata=__NEXT_DATA__?.props?.pageProps?.roomInfoInitData?.live;
        if (roomdata?.gametype == 95599){
            alert("聊天室不支持弹出播放器播放");
        } else if ( status>0 ){
            if (cid > 0) {
                var liveurl="//cc.163.com/live/channel/?channelids="+cid;
                location.href=liveurl;
            }
        } else{
            alert("未直播");
        }
    }

})();