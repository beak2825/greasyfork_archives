// ==UserScript==
// @name         vidcloud9-type direct linker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  jwplayer dl
// @author       You
// @match        https://vidcloud9.com/streaming.php?*
// @match        https://vidnode.net/streaming.php?*
// @match        https://vidnext.net/streaming.php?*
// @match        https://vidembed.net/streaming.php?*
// @match        https://vidstreaming.io/streaming.php?*
// @match        https://gogo-stream.com/streaming.php?*
// @match        https://gogo-play.net/streaming.php?*
// @match        https://gogo-play.tv/streaming.php?*
// @match        https://streamani.net/streaming.php?*
// @match        https://k-vid.co/streaming.php?*
// @match        https://asianload.cc/streaming.php?*
// @match        https://asianload.io/streaming.php?*
// @match        https://asianload1.com/streaming.php?*
// @match        https://vidembed.cc/streaming.php?*
// @match        https://vidcloud9.com/load.php?*
// @match        https://vidnode.net/load.php?*
// @match        https://vidnext.net/load.php?*
// @match        https://vidembed.net/load.php?*
// @match        https://vidstreaming.io/load.php?*
// @match        https://gogo-stream.com/load.php?*
// @match        https://gogo-play.net/load.php?*
// @match        https://gogo-play.tv/load.php?*
// @match        https://streamani.net/load.php?*
// @match        https://k-vid.co/load.php?*
// @match        https://asianload.cc/load.php?*
// @match        https://asianload.io/load.php?*
// @match        https://asianload1.com/load.php?*
// @match        https://vidembed.cc/load.php?*
// @match        https://vidcloud9.com/loadserver.php?*
// @match        https://vidnode.net/loadserver.php?*
// @match        https://vidnext.net/loadserver.php?*
// @match        https://vidembed.net/loadserver.php?*
// @match        https://vidstreaming.io/loadserver.php?*
// @match        https://gogo-stream.com/loadserver.php?*
// @match        https://gogo-play.net/loadserver.php?*
// @match        https://gogo-play.tv/loadserver.php?*
// @match        https://streamani.net/loadserver.php?*
// @match        https://k-vid.co/loadserver.php?*
// @match        https://asianloadserver.cc/loadserver.php?*
// @match        https://asianloadserver.io/loadserver.php?*
// @match        https://asianloadserver1.com/loadserver.php?*
// @match        https://vidembed.cc/loadserver.php?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/433555/vidcloud9-type%20direct%20linker.user.js
// @updateURL https://update.greasyfork.org/scripts/433555/vidcloud9-type%20direct%20linker.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    var corsproxy="https://api.allorigins.win/raw?url=";

    async function checkStatusOfMp4(url){
        try{
            var tmpv=document.createElement("video"),
                status=0;
            tmpv.onloadedmetadata=function(){
                status=200;
                concludeStatus();
            };
            tmpv.onerror=function(){
                //empty string=cors error (which is why cors proxy is used for non firefox)
                status=(tmpv.error.code==4&&(tmpv.error.message.toLowerCase().includes("decoder")||tmpv.error.message.toLowerCase().includes("demuxer")||tmpv.error.message==""))?200:404;
                concludeStatus();
            };
            tmpv.src=(navigator.userAgent.toLowerCase().includes('firefox')?"":corsproxy)+url;
            function concludeStatus(){
                tmpv.remove();
            }
            for(var i=0;i<10000&&(status==0);i++)await sleep(1);
            if(status==0)status=404;
            return status;
        }catch(e){return 404;}
    }

    var vidurl="";
    var loopInt=setInterval(async ()=>{
        if(vidurl==""){
            try{
                vidurl=jwplayer("myVideo").getPlaylistItem()["file"];
            }catch(e){}
        }else{
            clearInterval(loopInt);
            if(vidurl=="null")return;
            document.close();
            document.open();
            prompt("Video URL:",vidurl);
            var tryfetch=0;
            try{tryfetch=(await fetch(vidurl,{method:"HEAD",mode:"cors"})).status;}catch(e){}
            if(!(tryfetch<310||(await checkStatusOfMp4(vidurl))==200)){
                vidurl=corsproxy+vidurl;
            }
            document.write(`<body bgcolor="black"><video controls style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:999;"></video></body>`);
            document.close();
            var v=document.querySelector("video");
            v.onerror=function(){
                var hlsjs=document.createElement('script');
                hlsjs.onload=function(){
                    if(Hls.isSupported()){
                        var hls=new Hls();
                        hls.loadSource(v.src);
                        hls.attachMedia(v);
                    }
                };
                hlsjs.src='https://cdn.jsdelivr.net/npm/hls.js@latest';
                document.querySelector('head').appendChild(hlsjs);
            };
            v.src=vidurl;
        }
    },10);
})();