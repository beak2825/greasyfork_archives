// ==UserScript==
// @name         copy playlist from camsites
// @namespace    everywhere
// @version      1.1.2
// @description  Play video from camsoda, chaturbate and many other cam sites in vlc, potplayer or a streamrecorder
// @author       ladroop
// @match        https://*.camsoda.com/*
// @match        https://*streamray.com/*
// @match        https://*cams.com/*
// @match        https://www.streamate.com/cam/*
// @match        https://streamate.com/cam/*
// @match        https://*.cam4.com/*
// @match        https://*.bongacams.com/*
// @match        https://www.flirt4free.com/*
// @match        https://www.xlovecam.com/*
// @match        https://www.myfreecams.com/*
// @match        https://dreamcam.com/*
// @match        https://www.olecams.com/*
// @match        https://www.eplay.com/*
// @match        https://*chaturbate.com/*
// @match        https://*sinparty.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505328/copy%20playlist%20from%20camsites.user.js
// @updateURL https://update.greasyfork.org/scripts/505328/copy%20playlist%20from%20camsites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    makepopitup();
    var pageurl=document.location.href;
    var n=0;
    var playlist="";
    var observer= new MutationObserver(pagechange1);
    var observerConfig = {subtree: true, characterData: true, childList: true };

    pagechange();

    function pagechange1(){
        if (document.location.href==pageurl){return;}
        observer.disconnect();
        pageurl=document.location.href;
        pagechange();
    }

    function pagechange(){
        playlist="";
        document.getElementById("popitup1").style.display="none";
        document.getElementById("popitup").innerHTML="";
        setTimeout(selectsite,5000);
    }

    function selectsite(){
        observer.observe(document.getElementsByTagName("head")[0],observerConfig);
        if (pageurl.indexOf("sinparty")!=-1){
            sinparty();
            return;
        }
        if (pageurl.indexOf("olecams")!=-1){
            olecams();
            return;
        }
        if (pageurl.indexOf("dreamcam")!=-1){
            dreamcam();
            return;
        }
        if (pageurl.indexOf("chaturbate")!=-1){
            chaturbate();
            return;
        }
        if (pageurl.indexOf("myfreecams")!=-1){
            mfc();
            return;
        }
        if (pageurl.indexOf("camsoda")!=-1){
            camsoda();
            return;
        }
        if (pageurl.indexOf("bongacams")!=-1){
            bongacams();
            return;
        }
        if (pageurl.indexOf("streamray")!=-1){
            streamray();
            return;
        }
        if (pageurl.indexOf("cams.com")!=-1){
            streamray();
            return;
        }
        if (pageurl.indexOf("streamate")!=-1){
            streamate();
            return;
        }
        if (pageurl.indexOf("cam4")!=-1){
            cam4();
            return;
        }
        if (pageurl.indexOf("flirt4free.com")!=-1){
            f4f();
            return;
        }
        if (pageurl.indexOf("xlovecam.com")!=-1){
            xlovecam();
            return;
        }
        if (pageurl.indexOf("eplay.com")!=-1){
            eplay();
            return;
        }
    }

    function sinparty(){
        var scripts=document.getElementsByTagName("script");
        var preload="";
        for (n=0; n<scripts.length; n++){
            if (scripts[n].innerHTML.indexOf("var CREATOR_DATA =")!=-1){
                preload=scripts[n].innerHTML;
                break;
            }
        }
        if (preload==""){streamate();return;}
        var user=preload.split('user_hash":"')[1].split('"')[0];
        var url="https://api.sinparty.com/v2/web/live-cams/web-rtc/"+user;
        fetch(url,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist=roomdata.data.playback_url;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });
    }

    function eplay(){
        if(pageurl.split("/")[3]==""){return;}
        if(pageurl.split("/")[3]=="cams"){return;}
        var model=pageurl.split("/")[3];
        var url="https://search-cf.eplay.com/channels?size=1&exactMatch=true&username="+model;
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    if (!roomdata.results[0].isOnline){return;}
                    var manifest=roomdata.results[0].manifest;
                    eplay2(manifest);
                });
            });
    }
    function eplay2(url){
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist=roomdata.formats["mp4-hls"].manifest;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML="<div style='font-size:10px'>"+playlist+"</div>";
                });
            });
    }

    function olecams(){
        var modelnr=parseInt(document.querySelector('[property="og:image"]').getAttribute("content").split("/")[5]);
        var url="https://apiv2.olecams.com/rooms/connect";
         fetch(url,{
             headers: {"Content-Type": "application/json",},
             credentials: "same-origin",
             method: "POST",
             body: JSON.stringify({"id":modelnr,"mode":"free","nick":null,"afno":null,"sitemode":"REGISTERED","paymenttype":null,"ttl":1800})
         }).then(
             function(response) {
                  if (response.status !== 200){
                       return;
                 }
                 response.json().then(function(roomdata) {
                     var manifesturl=roomdata.message.manifest+"?&accessToken="+roomdata.message.accessToken+"&img=true&vdc=true&sbp=true";
                     olecams2(manifesturl);
                 });
             });
    }
    function olecams2(url){
        fetch(url,{ credentials: "same-origin"}).then(
             function(response) {
                 if (response.status !== 200){
                       return;
                 }
                 response.json().then(function(roomdata) {
                     playlist=roomdata.formats["mp4-hls"].manifest;
                     document.getElementById("popitup1").style.display="block";
                     document.getElementById("popitup").innerHTML=playlist;
                 });
             });
    }

    function dreamcam(){
        var model=pageurl.split("/")[4];
        var url="https://bss.dreamcamtrue.com/api/clients/v1/broadcasts/models/"+model+"?partnerId=dreamcam_oauth2&show-hidden=true&stream-types=video2D";
           fetch(url,{ credentials: "same-origin"}).then(
             function(response) {
                 if (response.status !== 200){
                       return;
                 }
                 response.json().then(function(roomdata) {
                     playlist=roomdata.streams[1].url;
                     if (playlist==null){return;}
                     document.getElementById("popitup1").style.display="block";
                     document.getElementById("popitup").innerHTML=playlist;
                 });
             });
    }

    function chaturbate(){
        if (document.getElementById("scriptinfo")){return;}//do not run if chaturbate reloaded script is active
        var model=pageurl.split("/")[3];
        if (model==""){return;}
        var url="https://chaturbate.com/api/chatvideocontext/"+model+"/";
         fetch(url,{ credentials: "same-origin"}).then(
             function(response) {
                 if (response.status !== 200){
                       return;
                 }
                 response.json().then(function(roomdata) {
                     playlist=roomdata.hls_source.split("?")[0];
                     if (playlist==""){return;}
                     if (roomdata.cmaf_edge){
                        playlist=playlist.replace(".m3u8","_sfm4s.m3u8");
                        playlist=playlist.replace("live-edge","live-fhls");
                     }
                     document.getElementById("popitup1").style.display="block";
                     document.getElementById("popitup").innerHTML=playlist;
                 });
             });

    }

    function mfc(){
        var model=pageurl.split("#")[1];
        var jsonfile="https://api-edge.myfreecams.com/usernameLookup/"+model;
        fetch(jsonfile,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    var modelnr=roomdata.result.user.id;
                    var videoserver=roomdata.result.user.sessions[0].server_name;
                    var phase=roomdata.result.user.sessions[0].phase;
                    mfc2(modelnr,videoserver,phase);
                });
            });
    }
    function mfc2(modelnr,videoserver,phase){
        modelnr=modelnr+100000000;
        var servernr=videoserver.split("ideo")[1];
        playlist="https://edgevideo.myfreecams.com/llhls/NxServer/"+servernr+"/ngrp:mfc_"+phase+modelnr+".f4v_cmaf/playlist.m3u8?nc=0.6190622874050598&v=1.97.23";
        fetch(playlist,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.text().then(function(data) {
                    var chunk="chunklist"+data.split("chunklist")[1].split("m3u8")[0]+"m3u8";
                    playlist="https://"+videoserver+".myfreecams.com/NxServer/ngrp:mfc_"+phase+modelnr+".f4v_cmaf/"+chunk+"?nc=0.813118007341&v=1.96";
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });
    }

    function xlovecam(){
        if (pageurl.split("/")[4]!="chat"){return;}
        var model=pageurl.split("/")[5];
        var lang=pageurl.split("/")[3];
        fetch("https://www.xlovecam.com/"+lang+"/performerAction/onlineList/", {
            "credentials": "same-origin",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
            "referrer": "https://www.xlovecam.com/"+lang+"/chat/"+model+"/",
            "body": "config%5Bnickname%5D="+model+"&config%5Bfavorite%5D=0&config%5Brecent%5D=0&config%5Bvip%5D=0&config%5Bsort%5D%5Bid%5D=35&offset%5Bfrom%5D=0&offset%5Blength%5D=35&origin=preload1&stat=0&featureSupported%5BsessionStorageLarge%5D=true&featureSupported%5BlocalStorage%5D=true",
            "method": "POST"
        }).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist=roomdata.content.performerList[0].hlsPlaylist;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });

    }

    function f4f(){
        var modelnr=document.getElementById("bodyTag").getAttribute("data-current-model-id");
        var jsonfile="https://www.flirt4free.com/ws/chat/get-stream-urls.php?model_id="+modelnr;
        fetch(jsonfile,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist="https:"+roomdata.data.hls[0].url;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });

    }

    function bongacams(){
        localStorage.clear();//earase time limit when not logged in
        var domain="https://"+window.location.hostname;
        var model=pageurl.split("/")[3];
        if (model==""){return;}
        fetch(domain+"/tools/amf.php", {
            "credentials": "same-origin",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "X-Requested-With": "XMLHttpRequest",
            },
            "referrer": domain+"/"+model,
            "body": "method=getRoomData&args%5B%5D="+model+"&args%5B%5D=&args%5B%5D=",
            "method": "POST",
        }).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    model=roomdata.performerData.username;
                    if (model==""){return;}
                    var edge=roomdata.localData.videoServerUrl;
                    playlist="https:"+edge+"/hls/stream_"+model+"/playlist.m3u8";
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });
    }

    function cam4(){
        var model=pageurl.split("/")[3].split("?")[0];
        var jsonfile="https://cam4.com/rest/v1.0/profile/"+model+"/streamInfo";
        fetch(jsonfile,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist=roomdata.cdnURL;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });
    }

    function streamate(){
        var model=pageurl.split("/")[4];
        var jsonfile="https://manifest-server.naiadsystems.com/live/s:"+model+".json";
        fetch(jsonfile,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    playlist=roomdata.formats["mp4-hls"].manifest;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });
    }

    function streamray(){
        if (document.getElementsByTagName("video").length==0){return;}
        var model=pageurl.split("/")[3].split("#")[0].toLowerCase();
        if (model==""){return;}
        if (model=="webcam"){return;}
        playlist="https://camshls.cams.com/cdn-"+model+".m3u8";
        document.getElementById("popitup1").style.display="block";
        document.getElementById("popitup").innerHTML=playlist;
    }

    function camsoda(){
        localStorage.clear();//earase time limit when not logged in
        var model=pageurl.split("/")[3];
        var jsonfile="https://www.camsoda.com/api/v1/chat/react/"+model;
        fetch(jsonfile,{ credentials: "same-origin"}).then(
            function(response){
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(roomdata) {
                    if (roomdata.stream.stream_name==""){return;}
                    playlist="https://"+roomdata.stream.edge_servers[0]+"/"+roomdata.stream.stream_name+"_v1/index.m3u8?token="+roomdata.stream.token;
                    document.getElementById("popitup1").style.display="block";
                    document.getElementById("popitup").innerHTML=playlist;
                });
            });

    }

    function makepopitup(){
        var popstyle="color:black;z-index:100000;top:10px;left:10px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32);border-radius:4px;border:1px solid rgb(221, 221, 221);background-color:rgb(200, 200, 200);position:fixed; display:none; white-space: pre-line; text-align: left; line-height: 1.4; height: auto; width:500px; padding: 10px 10px 10px 10px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 15px;";
        var newelem=document.createElement('span');
        newelem.setAttribute("style", popstyle);
        newelem.id="popitup1";
        var newdiv=document.createElement('div');
        newdiv.id="popitup";
        newelem.appendChild(newdiv);
        newdiv=document.createElement('div');
        newdiv.innerHTML="\n(Close)";
        newdiv.style.float="left";
        newdiv.style.cursor="pointer";
        newdiv.addEventListener("click", close );
        newelem.appendChild(newdiv);
        newdiv=document.createElement('div');
        newdiv.id="closecopy";
        newdiv.innerHTML="\n(Close and copy to clipbord)";
        newdiv.style.float="right";
        newdiv.style.cursor="pointer";
        newdiv.addEventListener("click", closecopy );
        newelem.appendChild(newdiv);
        document.getElementsByTagName("body")[0].appendChild(newelem);
    }

    function closecopy(){
        navigator.clipboard.writeText(playlist);
        document.getElementById("popitup1").style.display="none";
    }

    function close(){
        document.getElementById("popitup1").style.display="none";
    }

})();