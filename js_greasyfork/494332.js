// ==UserScript==
// @name                Chaturbate 增强
// @author              nima-rahbar
// @namespace       VisJoker
// @description       Chaturbate 功能增强
// @icon                  https://www.google.com/s2/favicons?sz=64&domain=chaturbate.org
// @copyright         2022, nima-rahbar (https://greasyfork.org/en/users/846327-nima-rahbar)
// @license              MIT
// @version             1.1.0
// @match          https://*.chaturbate.com/*
// @exclude        https://secure.chaturbate.com/*
// @exclude        https://*chaturbate.com/apps/*
// @exclude        https://*chaturbate.com/api/*
// @exclude        https://*chaturbate.com/b/*
// @exclude        https://*chaturbate.com/fullvideo/*
// @exclude        https://*chaturbate.com/accounts/followers/*
// @require        https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js
// @grant          none
// @run-at         document-end
// @license	       MIT
// @copyright      2025 Ladroop
// @downloadURL https://update.greasyfork.org/scripts/494332/Chaturbate%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/494332/Chaturbate%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var version = "1.4.3";
    var scriptname="Chaturbate reloaded";
    var i=0;
    var n=0;
    var currpage=document.location.href;
    var ppage=false;
    var biodata="";
    var referenceNode="";
    var roomname= currpage.split("/")[3];
    if (roomname =="p"){
        ppage=true;
    }
    var hls_source = "";
    var fetching=0;
    var hlsfetching=false;
    var loggedin=false;
    var yourname="";
    var username="";
    var br="";
    var vfilter="brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)";
    var ofils="";
    var vmirror="none";
    var pos1=0;
    var pos2=0;
    var pos3=0;
    var pos4=0;
    var vareaid="";
    if (document.querySelector('[data-testid="username"]')){
        loggedin=true;
        yourname=document.querySelector('[data-testid="username"]').innerHTML;
    }
    var observer4=new MutationObserver(adjusthumbs);
    var observerConfig4 ={attributes : true, attributeFilter : ['class'] };
    var observer41=new MutationObserver(adjusthumbs);
    var observer5=new MutationObserver(adjustbiohumbs);
    var observerConfig5 ={attributes : true, attributeFilter : ['style'] };
    var observer6=new MutationObserver(adjustfollowhumbs);
    var observerConfig6 ={attributes : true, attributeFilter : ['style'] };
    var observer7=new MutationObserver(nextcam);
    var observerConfig7 ={attributes : true, attributeFilter : ['title'] };
    var observerConfig7a ={attributes : true, attributeFilter : ['title'] };
    var observer8=new MutationObserver(restart); // observer ajax switch
    var observerConfig8 ={attributes : true, attributeFilter : ['class'] };
    var observer3 = new MutationObserver(varea);
    var observerConfig3 = {childList: true, subtree: true};
    var pmobserver = new MutationObserver(tabpm);
    var pmobserver2 = new MutationObserver(tabpm);
    var pmobserverConfig = {childList: true};
    var pmobservenode="";
    var pmobservenode2="";
    var tabblink=false;
    var ctitle=document.title;
    var container="";
    var bio=false;
    var thisfap="";
    var fapbr="";
    var cimg = new Image();
    var usernoteslist = "";
    var stor="greg44609";
    var tour="https://chaturbate.com/in/?tour=4uT2&campaign=hgg5k&track=default";
    var note='<svg style="height: 2.0em; width: 2.0em;" viewBox="0 0 12 12" xmlns="https://www.w3.org/2000/svg"><path fill="hsla(0, 100%, 50%, 0.8)" d="M5.5 2.00002H2C1.73478 2.00002 1.48043 2.10537 1.29289 2.29291C1.10536 2.48044 1 2.7348 1 3.00002V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8947 1.73478 11 2 11H9C9.26522 11 9.51957 10.8947 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V6.50002" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 1.24985C9.44891 1.05094 9.7187 0.939194 10 0.939194C10.2813 0.939194 10.5511 1.05094 10.75 1.24985C10.9489 1.44877 11.0607 1.71855 11.0607 1.99985C11.0607 2.28116 10.9489 2.55094 10.75 2.74985L6 7.49985L4 7.99985L4.5 5.99985L9.25 1.24985Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    var nonote='<svg style="height: 2.0em; width: 2.0em;" viewBox="0 0 12 12" xmlns="https://www.w3.org/2000/svg"><path fill="hsla(197, 10%, 98%, 0.3)" d="M5.5 2.00002H2C1.73478 2.00002 1.48043 2.10537 1.29289 2.29291C1.10536 2.48044 1 2.7348 1 3.00002V10C1 10.2652 1.10536 10.5196 1.29289 10.7071C1.48043 10.8947 1.73478 11 2 11H9C9.26522 11 9.51957 10.8947 9.70711 10.7071C9.89464 10.5196 10 10.2652 10 10V6.50002" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.25 1.24985C9.44891 1.05094 9.7187 0.939194 10 0.939194C10.2813 0.939194 10.5511 1.05094 10.75 1.24985C10.9489 1.44877 11.0607 1.71855 11.0607 1.99985C11.0607 2.28116 10.9489 2.55094 10.75 2.74985L6 7.49985L4 7.99985L4.5 5.99985L9.25 1.24985Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';
    var notegrey='<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 12 12" role="img"><path stroke="#48484E" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M5.5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V6.5"></path><path stroke="#48484E" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.25 1.25a1.06 1.06 0 0 1 1.5 1.5L6 7.5 4 8l.5-2z"></path></svg>';
    if (currpage.indexOf(stor)!=-1){document.location.href="https://chaturbate.com";}
    var discoverpage=false;
    var thumbpage=false;
    var tagspage=false;
    var openthumbname="";
    var opennote="";
    var data="";
    var room_status="";
    var videoSrc="";
    var hls = new Hls();
    var errors=0;
    var recording=false;
    var recpause=false;
    var mediaRecorder;
    var recordedBlobs=[];
    var stream;
    var hidurl="https://chaturbate.com/api/ts/roomlist/room-list/?&hidden=true&limit=90&offset=";
    var hprom=false;
    var hidoffset=0;
    var hiddenarray=[];
    var noaccess=false;
    var c1=0;
    var c2=0;
    var c3=0;
    var c4=0;
    var c5=0;
    var c6=0;
    var c7=0;
    var c7a=100;
    var c8=0;
    var firstentry=true;
    var twaiting=false;
    var chatrules="";
    var roomstatus="";
    var oldroomstatus="";
    var alarmaudio = new Audio('https://web.static.mmcdn.com/tsdefaultassets/sounds/classic/huge.mp3');
    var alarmrun=false;
    if (!localStorage.getItem("defaultplaylist")) {
        localStorage.setItem("defaultplaylist","https://edge17-rtm.live.mmcdn.com/live-edge/amlst:XXX-sd-883752acca206f43dfba30fb6a37be0bab0e4cfdd07c3415f24f3146288b427a_trns_h264/playlist.m3u8");
    }
    if (!readCookie("agreeterms")){createCookie("agreeterms","1",30);window.location.reload(true);}
    if (document.getElementsByClassName("dismiss_notice_tfa_and_email").length>0){
        document.getElementsByClassName("dismiss_notice_tfa_and_email")[0].click();
    }
    setadstyle();
    setgenstyle();
    if (roomname=="discover"){
        setdiscoverstyle();
    }
    getmessage();
    if (roomname=="my_collection"){
        if (document.getElementsByTagName("video").length>0){
            savedprvdownload();
        }
        return;
    }
    if (roomname=="photo_videos"){
        collectiondownload();
        return;
    }
    var supporter=true;
    var login=true;
    if (document.querySelector('[class="upgrade"]')){
        supporter=false;
    }
    if (document.querySelector('[href="/auth/login/"]')){
        supporter=false;
        login=false;
    }
    getsaving();
    if (roomname=="discover"){discoverpage=true;}
    if (roomname=="tags"){tagspage=true;}
    var siteversion=1;
    if ((document.getElementById("roomlist_root")!=null)&&(document.getElementById("TheaterModeRoomContents")!=null)){
        siteversion=2;
    }
    if (siteversion==2){
        getpage();
    }else{
        if (document.getElementById("roomlist_root")){thumbpage=true;}
    }
    function getpage(){
        if(!ppage){
            var tab=document.getElementsByClassName("gender-tab")[0].getElementsByTagName("a")[0];
            var tabclas = tab.classList;
            if (!tabclas.contains("activeRoom")){
                thumbpage=true;
            }
        }
        observer8.observe(document.getElementById("main"),observerConfig8);
    }
    function restart(){
        observer3.disconnect();
        cleanpage();
        thumbpage=false;
        getpage();
        if (thumbpage){
            dothumbpagethings();
        }else{
            test();
        }
        hidesw();
    }
    aff();
    noadd();
    moreoptions();
    if (document.querySelector('[data-testid="denied-notice"]')){
        bannedroom();
        return;
    }
    if (roomname=="roomlogin"){
        noaccess=true;
        roomname=currpage.split("/")[4];
        passwordfollow();
        return;
    }
    if (tagspage){setupfollowmove();}
    if (discoverpage){dothumbpagethings();}
    if (thumbpage){dothumbpagethings();}
    if (siteversion==1){
        if (document.getElementById('main')){
            test();
        }
    }
    if (siteversion==2){
        if (document.getElementById('main').classList.contains("roomPage")){
            test();
        }
        if (ppage){test();}
    }
    function test(){
        if(document.getElementsByClassName("BioContents").length>0){
            container=document.getElementsByClassName("BioContents")[0];
            n=0;
            setTimeout(function(){test2();}, 100);
        }else{
            n++;
            if (n==100){
                n=0;
                lastchange();
                return;
            }
            setTimeout(function(){test();}, 100);
        }
    }

    function test2(){
        if (n==100){n=0;lastchange();return;}
        if (container.innerHTML.indexOf("Loading…")!=-1){
            n++;
            setTimeout(function(){test2();}, 100);
        }else{
            n=0;
            test3();
        }
    }

    function test3(){
        n++;
        if (n==100){n=0;lastchange();return;}
        setTimeout(function(){
            if (container.getElementsByTagName("table").length>0){
                if(!ppage){
                    if (siteversion==2){
                        observer7.observe(document.getElementsByClassName("activeRoom")[0],observerConfig7);
                    }
                    if (siteversion==1){
                        observer7.observe(document.querySelector('[data-paction-name="ActiveRoom"]'),observerConfig7a);
                    }
                }
                dobiothings();
            }else{
                test3();
            }
        }, 100);
    }
    function lastchange(){
        if (document.visibilityState!="visible"){
            document.addEventListener("visibilitychange",onemore);
        }
    }
    function onemore(){
        document.removeEventListener("visibilitychange",onemore);
        test();
    }

    function hidemtenter(){
        if (!localStorage.getItem("hidemt")){return;}
        if ((roomname=="male-cams")||(roomname=="trans-cams")){
            document.location.href="https://chaturbate.com";
        }
        var toptabs=document.getElementsByClassName("gender-tab");
        for (n=0; n<toptabs.length; n++){
            if (toptabs[n].href){
                if (toptabs[n].href.indexOf("/male-")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/male/")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/trans-")!=-1){
                    toptabs[n].style.display="none";
                }
                if (toptabs[n].href.indexOf("/trans/")!=-1){
                    toptabs[n].style.display="none";
                }
            }
        }
    }

    function nextcam(){
        if (siteversion==2){
            observer7.disconnect();
            if (document.getElementsByClassName("activeRoom").length==0){return;}
            roomname=document.getElementsByClassName("activeRoom")[0].innerHTML.split("'")[0].toLowerCase();
            container.getElementsByTagName("table")[0].remove();
            restart();
        }
        if (siteversion==1){
            observer7.disconnect();
            observer3.disconnect();
            cleanpage();
            roomname=document.querySelector('[data-paction-name="ActiveRoom"]').innerHTML.split("'")[0].toLowerCase();
            test();
        }
    }

    function cleanpage(){
        if (document.getElementById("notepop")){
            document.getElementById("notepop").remove();
        }
        if (document.getElementById("vcontr")){
            document.getElementById("vcontr").remove();
        }
        if (document.getElementById("ccontr")){
            document.getElementById("ccontr").remove();
        }
        if (document.getElementById("clean")){
            document.getElementById("clean").remove();
        }
        if (document.getElementById("infore")){
            document.getElementById("infore").remove();
        }
        if (document.getElementById("controls")){
            document.getElementById("controls").remove();
        }
        if (document.getElementById("chatcontrols")){
            document.getElementById("chatcontrols").remove();
        }
        if (document.getElementById("rulespop")){
            document.getElementById("rulespop").remove();
        }
    }

    function moreoptions(){
        if (roomname=="auth"){return;}
        var newelemsw=document.getElementById('UserMenuDropDown').firstChild.cloneNode(true);
        var newelemsw2=newelemsw.cloneNode(true);
        var newelemsw3=newelemsw.cloneNode(true);
        var newelemsw4=newelemsw.cloneNode(true);
        var newelemsw5=newelemsw.cloneNode(true);
        var newelemsw6=newelemsw.cloneNode(true);
        var newelemtxt=newelemsw.cloneNode(false);
        var newelemtxt2=newelemsw.cloneNode(false);
        var newelemtxt3=newelemsw.cloneNode(false);
        newelemtxt.innerHTML="脚本设置:";
        newelemtxt.style.cursor="默认";
        newelemtxt2.innerHTML="保存所有设置";
        newelemtxt2.id="保存";
        newelemtxt2.style.cursor="pointer";
        newelemtxt2.addEventListener("click", savesetting );
        newelemtxt3.innerHTML="清除所有保存的设置";
        newelemtxt3.id="清除";
        newelemtxt3.style.cursor="pointer";
        newelemtxt3.addEventListener("click", clearsettings );
        newelemsw.firstChild.data = "关闭缩略图缩放";
        newelemsw.id="h1";
        newelemsw.getElementsByClassName("dmSwitchCircle")[0].id="a1";
        newelemsw.addEventListener("click", zoomoff );
        newelemsw2.firstChild.data = "关闭预览房间";
        newelemsw2.id="h2";
        newelemsw2.getElementsByClassName("dmSwitchCircle")[0].id="a2";
        newelemsw2.addEventListener("click", anionoff );
        newelemsw3.firstChild.data = "在新选项卡中打开房间";
        newelemsw3.getElementsByClassName("dmSwitchCircle")[0].id="a3";
        newelemsw3.addEventListener("click", newtabon );
        newelemsw4.firstChild.data = "自动刷新";
        newelemsw4.id="h3";
        newelemsw4.getElementsByClassName("dmSwitchCircle")[0].id="a4";
        newelemsw4.addEventListener("click", refreshoff );
        newelemsw6.firstChild.data = "大缩略图";
        newelemsw6.id="h4";
        newelemsw6.getElementsByClassName("dmSwitchCircle")[0].id="a6";
        newelemsw6.addEventListener("click", bigthumb );
        newelemsw5.firstChild.data = "隐藏男性/跨性别者";
        newelemsw5.getElementsByClassName("dmSwitchCircle")[0].id="a5";
        newelemsw5.addEventListener("click", hidemt );
        document.getElementById('UserMenuDropDown').appendChild(newelemtxt);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw2);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw3);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw4);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw6);
        document.getElementById('UserMenuDropDown').appendChild(newelemsw5);
        if (login){
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt2);
            document.getElementById('UserMenuDropDown').appendChild(newelemtxt3);
        }
        hidesw();
    }

    function hidesw(){
        document.getElementById("h1").style.display="block";
        document.getElementById("h2").style.display="block";
        document.getElementById("h3").style.display="block";
        document.getElementById("h4").style.display="block";
        if (discoverpage){document.getElementById("h1").style.display="none";}
        if (supporter){document.getElementById("h2").style.display="none";}
        if (!login){document.getElementById("h3").style.display="none";}
        if (!thumbpage){document.getElementById("h4").style.display="none";}
        setsw();
    }

    function setsw(){
        if (localStorage.getItem("bigthumb")){
            document.getElementById("a6").style.left="25px";
        }else{
            document.getElementById("a6").style.left="3px";
        }
        if (localStorage.getItem("hidemt")){
            document.getElementById("a5").style.left="25px";
        }else{
            document.getElementById("a5").style.left="3px";
        }
        if (localStorage.getItem("refreshoff")){
            document.getElementById("a4").style.left="25px";
        }else{
            document.getElementById("a4").style.left="3px";
        }
        if (localStorage.getItem("newtabon")){
            document.getElementById("a3").style.left="25px";
        }else{
            document.getElementById("a3").style.left="3px";
        }
        if (localStorage.getItem("animationoff")){
            document.getElementById("a2").style.left="25px";
        }else{
            document.getElementById("a2").style.left="3px";
        }
        if (localStorage.getItem("zoomoff")){
            document.getElementById("a1").style.left="25px";
        }else{
            document.getElementById("a1").style.left="3px";
        }
        if (roomname=="discover"){
            return;
        }
        if(document.getElementById("bigthumbstyle")!=null){document.getElementById("bigthumbstyle").remove();}
        if(document.getElementById("bigmovestyle")!=null){document.getElementById("bigmovestyle").remove();}
        if(document.getElementById("movestyle")!=null){document.getElementById("movestyle").remove();}
        if(document.getElementById("nomovestyle")!=null){document.getElementById("nomovestyle").remove();}
        if (thumbpage){
            if(localStorage.getItem("zoomoff")){
                setnomovestyle();
            }else{
                if(localStorage.getItem("bigthumb")){
                    setbigmovestyle();
                }else{
                    setmovestyle();
                }
            }
            if(localStorage.getItem("bigthumb")){
                setbigthumbstyle();
            }
            return;
        }
        if(localStorage.getItem("zoomoff")){
            setnomovestyle();
        }else{
            setmovestyle();
        }
    }

    function bigthumb(){
        if (document.getElementById("a6").style.left=="3px"){
            document.getElementById("a6").style.left="25px";
            localStorage.setItem("bigthumb","foo");
            setbigthumbstyle();
            if(document.getElementById("movestyle")!=null){document.getElementById("movestyle").remove();setbigmovestyle();}
        }else{
            document.getElementById("a6").style.left="3px";
            localStorage.removeItem("bigthumb");
            if(document.getElementById("bigthumbstyle")!=null){document.getElementById("bigthumbstyle").remove();}
            if(document.getElementById("bigmovestyle")!=null){document.getElementById("bigmovestyle").remove();setmovestyle();}
        }
    }

    function hidemt(){
        if (document.getElementById("a5").style.left=="3px"){
            document.getElementById("a5").style.left="25px";
            localStorage.setItem("hidemt","foo");
        }else{
            document.getElementById("a5").style.left="3px";
            localStorage.removeItem("hidemt");
        }
    }
    function refreshoff(){
        if (document.getElementById("a4").style.left=="3px"){
            document.getElementById("a4").style.left="25px";
            localStorage.setItem("refreshoff","foo");
        }else{
            document.getElementById("a4").style.left="3px";
            localStorage.removeItem("refreshoff");
        }
    }
    function newtabon(){
        if (document.getElementById("a3").style.left=="3px"){
            document.getElementById("a3").style.left="25px";
            localStorage.setItem("newtabon","foo");
        }else{
            document.getElementById("a3").style.left="3px";
            localStorage.removeItem("newtabon");
        }
    }
    function anionoff(){
        if (document.getElementById("a2").style.left=="3px"){
            document.getElementById("a2").style.left="25px" ;
            localStorage.setItem("animationoff","foo");
        }else{
            document.getElementById("a2").style.left="3px";
            localStorage.removeItem("animationoff");
        }
    }
    function zoomoff(){
        if (document.getElementById("a1").style.left=="3px"){
            document.getElementById("a1").style.left="25px";
            localStorage.setItem("zoomoff","foo");
            if (document.getElementById("movestyle")!=null){document.getElementById("movestyle").remove();}
            if (document.getElementById("bigmovestyle")!=null){document.getElementById("bigmovestyle").remove();}
            setnomovestyle();
        }else{
            document.getElementById("a1").style.left="3px";
            localStorage.removeItem("zoomoff");
            if (document.getElementById("nomovestyle")!=null){document.getElementById("nomovestyle").remove();}
            if (document.getElementById("bigthumbstyle")!=null){
                setbigmovestyle();
            }else{
                setmovestyle();
            }
        }
    }

    function savesetting(){
        document.getElementById("saved").removeEventListener("click", savesetting );
        var theme_name="lightmode";
        if (readCookie("theme_name")){
            theme_name=readCookie("theme_name");
        }
        var bigthumb=0;
        if (localStorage.getItem("bigthumb")){
            bigthumb=1;
        }
        var hidemt=0;
        if (localStorage.getItem("hidemt")){
            hidemt=1;
        }
        var newtabon=0;
        if (localStorage.getItem("newtabon")){
            newtabon=1;
        }
        var refreshoff=0;
        if (localStorage.getItem("refreshoff")){
            refreshoff=1;
        }
        var zoomoff=0;
        if (localStorage.getItem("zoomoff")){
            zoomoff=1;
        }
        var animationoff=0;
        if (localStorage.getItem("animationoff")){
            animationoff=1;
        }
        var cleanprof=0;
        if (localStorage.getItem("pclean")){
            cleanprof=1;
        }
        var isTheaterMode=localStorage.getItem("isTheaterMode");
        var defaultVideoWidth =localStorage.getItem("defaultVideoWidth");
        var videoControls =localStorage.getItem("videoControls");
        var hpfltopen=localStorage.getItem("hpfltopen");
        var allstring="good boy#refreshoff#"+refreshoff+"#bigthumb#"+bigthumb+"#hidemt#"+hidemt+"#newtabon#"+newtabon+"#zoomoff#"+zoomoff+"#animationoff#"+animationoff+"#cleanprof#"+cleanprof+"#isTheaterMode#"+isTheaterMode+"#defaultVideoWidth#"+defaultVideoWidth+"#videoControls#"+videoControls+"#theme_name#"+theme_name+"#hpfltopen#"+hpfltopen;
        var url="https://chaturbate.com/api/notes/for_user/"+stor+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", allstring );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(){document.getElementById("saved").innerHTML="Settings saved";setTimeout(function(){document.getElementById("saved").innerHTML="Save all settings.";document.getElementById("saved").addEventListener("click", savesetting );},2000);});
    }

    function clearsettings(){
        document.getElementById("clear").removeEventListener("click", clearsettings );
        var url="https://chaturbate.com/api/notes/for_user/"+stor+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", "" );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(function(){document.getElementById("clear").innerHTML="Saved settings removed.";setTimeout(function(){document.getElementById("clear").innerHTML="Clear all saved settings.";document.getElementById("clear").addEventListener("click", clearsettings );},2000);});
    }

    function getsaving(){
        if (!login){
            localStorage.removeItem("login");
            return;
        }else{
            if (localStorage.getItem("login")){
                return;
            }
        }
        localStorage.setItem("login","foo");
        var url="https://chaturbate.com/api/notes/for_user/"+stor+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data) {
                    if (data.text == null){return;}
                    restoresettings(data.text);
                });
            });
    }

    function restoresettings(data){
        if (data.indexOf("good boy")!=0){return;}
        if (data.indexOf("refreshoff#")!=-1){
            var refreshoff=data.split("refreshoff#")[1].split("#")[0];
            localStorage.setItem("refreshoff","foo");
            if (refreshoff==0){localStorage.removeItem("refreshoff");}
        }
        if (data.indexOf("newtabon#")!=-1){
            var newtabon=data.split("newtabon#")[1].split("#")[0];
            localStorage.setItem("newtabon","foo");
            if (newtabon==0){localStorage.removeItem("newtabon");}
        }
        if (data.indexOf("hidemt#")!=-1){
            var hidemt=data.split("hidemt#")[1].split("#")[0];
            localStorage.setItem("hidemt","foo");
            if (hidemt==0){localStorage.removeItem("hidemt");}
        }
        if (data.indexOf("bigthumb#")!=-1){
            var bigthumb=data.split("bigthumb#")[1].split("#")[0];
            localStorage.setItem("bigthumb","foo");
            if (bigthumb==0){localStorage.removeItem("bigthumb");}
        }
        if (data.indexOf("zoomoff#")!=-1){
            var zoomoff=data.split("zoomoff#")[1].split("#")[0];
            localStorage.setItem("zoomoff","foo");
            if (zoomoff==0){localStorage.removeItem("zoomoff");}
        }
        if (data.indexOf("animationoff#")!=-1){
            var animationoff=data.split("animationoff#")[1].split("#")[0];
            localStorage.setItem("animationoff","foo");
            if (animationoff==0){localStorage.removeItem("animationoff");}
        }
        if (data.indexOf("cleanprof#")!=-1){
            var cleanprof=data.split("cleanprof#")[1].split("#")[0];
            localStorage.setItem("pclean","foo");
            if (cleanprof==0){localStorage.removeItem("pclean");}
        }
        if (data.indexOf("isTheaterMode#")!=-1){
            var isTheaterMode=data.split("isTheaterMode#")[1].split("#")[0];
            localStorage.setItem("isTheaterMode",isTheaterMode);
        }
        if (data.indexOf("defaultVideoWidth#")!=-1){
            var defaultVideoWidth=data.split("defaultVideoWidth#")[1].split("#")[0];
            localStorage.setItem("defaultVideoWidth",defaultVideoWidth);
        }
        if (data.indexOf("videoControls#")!=-1){
            var videoControls=data.split("videoControls#")[1].split("#")[0];
            if (!jsontest(videoControls)){videoControls='{"volume":60,"isMuted":false}';}
            localStorage.setItem("videoControls",videoControls);
        }
        var exp=new Date().getTime()+86400000;
        if (data.indexOf("hpfltopen#")!=-1){
            var hpfltopen=data.split("hpfltopen#")[1].split("#")[0];
            hpfltopen=hpfltopen.split('expiration":')[0]+'expiration":'+exp+'}';
            localStorage.setItem("hpfltopen",hpfltopen);
        }
        if (data.indexOf("theme_name#")!=-1){
            var theme_name=data.split("theme_name#")[1].split("#")[0];
            createCookie("theme_name",theme_name);
        }
        document.location.reload();
    }
    function jsontest(jsonstr){
        try {
            JSON.parse(jsonstr);
            return true;
        } catch(e) {
            return false;
        }
    }

    function dobiothings(){
        hidemtenter();
        if(ppage){
            if (currpage.split("model=").length==1){return;}
            roomname=currpage.split("model=")[1].split("&")[0];
            if (roomname==yourname){return;}
            rebuildbio();
        }else{
            afterrebuild();
        }
    }

    function afterrebuild(){
        bio=true;
        if(ppage){
            document.querySelector('[data-testid="bio-header"]').innerHTML="<a href='https://chaturbate.com/"+roomname+"?tab=bio' id=biotop>"+roomname.charAt(0).toUpperCase()+roomname.slice(1)+"'s Bio</a>";
        }else{
            document.querySelector('[data-testid="bio-header"]').innerHTML="<a href='https://chaturbate.com/p/"+yourname+"?tab=bio&model="+roomname+"' id=biotop>"+roomname.charAt(0).toUpperCase()+roomname.slice(1)+"'s Bio and Free Webcam</a>";
        }
        document.getElementById("biotop").addEventListener("click", function(event){window.location.replace(this.href);event.stopPropagation();event.preventDefault();return false;});
        makevidcontrol();
        cleaninit();
        linkfix();
        info(true);
        buildnotepop();
        getnoteslist();
        if (document.getElementsByTagName("video").length>0){
            getvid();
            vreset();
            pmlistner();
            iagree();
        }
    }

    function dothumbpagethings(){
        if (!discoverpage){
            refresher();
        }
        buildnotepop();
        getnoteslist();
        return;
    }

    function iagree(){
        triggerMouseEvent (document.getElementsByClassName("inputDiv")[0], "mousedown");
        if (document.getElementsByClassName("acceptRulesButton").length>0){
            document.getElementsByClassName("acceptRulesButton")[0].click();
        }
        if (document.querySelector('[data-testid="dismissible-message-dismiss"]')){
            document.querySelector('[data-testid="dismissible-message-dismiss"]').click();
        }
    }

    function triggerMouseEvent (node, eventType) {
        var clickEvent = new Event(eventType, { bubbles: true, cancelable: true });
        node.dispatchEvent (clickEvent);
    }

    function setgenstyle(){
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = ".userUpload img{display:none}"+
            ".lockOverlayBg {background-color:rgba(0, 0, 0, 0) !important;top:50% !important}"+
            ".lockOverlayBg img{display:none}"+
            ".userUpload div{background-color:rgba(0, 0, 0, 0) !important}"+
            ".previewBorder {display:block !important}"+
            ".previewText {color:black !important}"+
            ".photoVideoDetailSection img{filter: blur(0px) !important;height:auto !important;width:auto !important; margin-left: auto;margin-right: auto;display:block;min-width:50%;min-height:50%;max-width:100%;max-height:100%}"+
            ".BioContents{position:relative !important}"+
            ".bioContentText div{background-color:rgba(0, 0, 0, 0) !important}"+
            ".theme-external select{background-color: #dde9f5 !important; color:#5e81a4 !important; border-color:#8bb3da !important}"+
            ".darkmode select{background-color: #202c39 !important; color:#b3b3b3 !important; border-color:#2d3e50 !important}"+
            "#proftext {width: 200px; height: 45px; line-height: 14px; border-width: 1px; border-style: solid; border-color: #acacac; border-radius: 4px; padding: 7px 8px; overflow: auto;background-color: rgb(230, 230, 230);color:#000;min-width:200px;min-height:45px}"+
            ".darkmode #proftext{width: 200px; height: 45px; line-height: 14px; border-width: 1px; border-style: solid; border-color: #2d3e50; border-radius: 4px; padding: 7px 8px; overflow: auto;background-color: rgb(20,20,20);color:#fff;min-width:200px;min-height:45px}"+
            ".cbLogo {display:none !important}"+
            ".popclass {background-color:rgb(255, 255, 211)}"+
            ".darkmode .popclass {background-color:rgb(30, 30, 10)}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setbigthumbstyle(){
        var style = document.createElement('style');
        style.id="bigthumbstyle";
        style.setAttribute('type', 'text/css');
        style.textContent = "ul.list{grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)) !important}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setmovestyle(){
        var style = document.createElement('style');
        style.id="movestyle";
        style.setAttribute('type', 'text/css');
        style.textContent = ".content{overflow: visible; !important ;margin-right:33px !important;margin-left:33px !important}"+
            ".followedDropdown{z-index:50 !important}"+
            ".list{overflow: visible !important}"+
            ".MoreRooms{overflow: visible !important}"+
            ".roomCard {transition: .3s}"+
            ".roomCard:hover {transform: scale(1.37);border-color:red;z-index:20}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setbigmovestyle(){
        var style = document.createElement('style');
        style.id="bigmovestyle";
        style.setAttribute('type', 'text/css');
        style.textContent = ".content{overflow: visible; !important ;margin-right:33px !important;margin-left:33px !important}"+
            ".followedDropdown{z-index:50 !important}"+
            ".list{overflow: visible !important}"+
            ".MoreRooms{overflow: visible !important}"+
            ".roomCard {transition: .3s}"+
            ".roomCard:hover {transform: scale(1.23);border-color:red;z-index:20}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setnomovestyle(){
        var style = document.createElement('style');
        style.id="nomovestyle";
        style.setAttribute('type', 'text/css');
        style.textContent =".content{overflow: visible; !important ;margin-right:33px !important;margin-left:33px !important}"+
            ".roomCard {transition: .1s}"+
            ".roomCard:hover {border-color:red}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setdiscoverstyle(){
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent =".roomCard {transition: .1s}"+
            ".roomCard:hover {border-color:red}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function setadstyle(){
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = ".ad {padding: 0px;overflow:hidden; font-weight: bold;color:white;border-radius:5px}"+
            ".adinfo {position: relative; display: flex; height: 100%; width: 940px; right:0px}"+
            ".adinfo {transition: 1.0s ease-in-out}"+
            ".adinfo:hover {right: 472px }"+
            ".adscriptinfo {display:block;height:100%;width:468px}";
        document.getElementsByTagName('head')[0].appendChild(style);
    }

    function getnoteslist(){
        if(!login){usernoteslist="";whatpage();return;}
        var url="https://chaturbate.com/api/notes/usernames/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(data) {
                    usernoteslist=data;
                }).then(whatpage);
            });
    }

    function whatpage(){
        setupfollowmove();
        if (thumbpage){setupmove();}
        if (bio){setupbiomove();}
        if (discoverpage){
            setInterval(addevent2,5000);
        }
    }

    function setupfollowmove(){
        var observenode=document.getElementsByClassName("followedDropdown")[0];
        observer6.observe(observenode,observerConfig6);
    }

    function adjustfollowhumbs(){
        if (document.getElementsByClassName("followedDropdown")[0].style.display!="block"){return;}
        addevent2();
    }

    function setupmove(){
        var observenode=document.getElementsByClassName("list")[0];
        observer4.observe(observenode,observerConfig4);
        adjusthumbs();
        addevent2();
    }

    function adjusthumbs(){
        subsel();
        if (document.getElementsByClassName("list")[0].classList.contains("loading")){return;}
        document.getElementById("notepop").style.display="none";
        if (document.getElementsByClassName("list").length>1){
            var observenode=document.getElementsByClassName("list")[1];
            observer41.observe(observenode,observerConfig4);
            setTimeout(addevent2, 1000);
        }else{
            addevent2();
        }
    }

    function setupbiomove(){
        if (ppage){return;}
        var observenode=document.querySelector('[data-testid="more-rooms-like-this-tab-contents"]').firstChild;
        observer5.observe(observenode,observerConfig5);
        addevent2();
    }

    function adjustbiohumbs(){
        if (ppage){return;}
        if(document.querySelector('[data-testid="more-rooms-like-this-tab-contents"]').firstChild.style.display=="block"){return;}
        addevent2();
    }

    function addevent2(){
        hidemtenter();
        var hidrooms=0;
        if (currpage!=document.location.href){
            document.getElementById("notepop").style.display="none";
        }
        currpage=document.location.href;
        var tags=document.querySelectorAll('[data-testid="room-card-image"]');
        for (n=0; n<tags.length; n++){

            if (localStorage.getItem("hidemt")){
                if(tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-gender"]')){
                    if ((tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-gender"]').title=="Male")||(tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-gender"]').title=="Trans")){
                        tags[n].parentNode.parentNode.style.display="none";
                        hidrooms++;
                    }
                }
            }
            if(!tags[n].name){
                tags[n].parentNode.href=tags[n].parentNode.href+"?tab=bio";
                tags[n].parentNode.addEventListener("click", function(event){var target="_self";if (localStorage.getItem("newtabon")){target="_blank";}window.open(this.href, target);event.stopPropagation();event.preventDefault();return false;});
                tags[n].name="Camslut";
                if (!supporter){
                    tags[n].parentNode.parentNode.addEventListener("mouseenter", moveimg);
                    tags[n].parentNode.parentNode.addEventListener("mouseleave", moveimgstop);
                }
                var name=tags[n].parentNode.parentNode.querySelector('[data-testid="room-card-username"]');
                var thumbroomname=name.innerHTML;
                if (loggedin){
                    name.href="https://chaturbate.com/p/"+yourname+"/?tab=bio&model="+thumbroomname;
                }
                name.addEventListener("click", function(event){var target="_self";if (localStorage.getItem("newtabon")){target="_blank";}window.open(this.href, target);event.stopPropagation();event.preventDefault();return false;});
                if (usernoteslist!=""){
                    if (tags[n].parentNode.parentNode.className=="roomCard camBgColor"){
                        var newelem=document.createElement('div');
                        if (usernoteslist.usernames.indexOf(thumbroomname)!=-1){
                            newelem.innerHTML=note;
                        }else{
                            newelem.innerHTML=nonote;
                        }
                        newelem.style.position="absolute";
                        newelem.style.top="0px";
                        newelem.style.left="0px";
                        newelem.addEventListener("click", shownote );
                        newelem.style.cursor="pointer";
                        newelem.setAttribute("name", thumbroomname);
                        newelem.name=thumbroomname;
                        newelem.title="User notes";
                        tags[n].parentNode.parentNode.appendChild(newelem);
                    }
                }
            }
        }
        var mymsgline=0;
        if (document.location.href.split("/")[3]=="spy-on-cams"){
            mymsgline=1;
        }
        var msglines=document.querySelectorAll('[data-testid="num-of-rooms-msg"]');
        var msglinesleng=msglines.length;
        if (msglinesleng !=0){
            msglines[0].style.display="block";
            if (mymsgline == 1){
                msglines[1].style.display="block";
            }
            if (localStorage.getItem("hidemt")){
                var msg=msglines[mymsgline].innerHTML.split("filters")[0]+"filters";
                msglines[mymsgline].innerHTML=msg+". "+hidrooms+" on this page are hidden.";
            }
        }
        hidrooms=0;
        showhidden();
    }

    function showhidden(){
        if (document.location.href.split("/")[3]=="spy-on-cams"){showhidden4();return;}
        if (document.location.href.split("/")[3]!="followed-cams"){return;}
        if (document.location.href.split("/")[4]=="offline"){return;}
        if (!document.querySelector('[data-testid="room-card-image"]')){return;}
        if (document.querySelector('[data-testid="room-card-image"]').name=="hid"){return;}
        document.querySelector('[data-testid="room-card-image"]').name="hid";
        hidoffset=0;
        hiddenarray=[];
        showhidden2();
    }

    function showhidden2(){
        if (hprom){return;}
        hprom=true;
        var url=hidurl+hidoffset*90;
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    hprom=false;
                    return;
                }
                response.json().then(function(data){
                    if (data.rooms != null){
                        var hiddenlist=data.rooms;
                        for (n=0; n<hiddenlist.length; n++){
                            hiddenarray.push(hiddenlist[n].username);
                        }
                        var pages=Math.ceil(data.total_count/90);
                        hidoffset++;
                        if (hidoffset!=pages){
                            hprom=false;
                            showhidden2();
                        }else{
                            hprom=false;
                            showhidden3();
                        }
                    }
                });
            });
    }

    function showhidden3(){
        var tags=document.querySelector('[data-testid="room-list-container"]').querySelectorAll('[data-testid="room-card"]');
        for (n=0; n<tags.length; n++){
            var name=tags[n].querySelector('[data-testid="room-card-username"]').innerHTML;
            if (hiddenarray.indexOf(name)!=-1){
                tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML=tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML+" HIDDEN ";
                tags[n].querySelector('[data-testid="thumbnail-label"]').style.backgroundColor = "blue";
           }
        }
    }

    function showhidden4(){
        if (document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelector('[data-testid="room-card-image"]').name=="hid"){return;}
        document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelector('[data-testid="room-card-image"]').name="hid";
        var tags=document.querySelectorAll('[data-testid="room-list-container"]')[1].querySelectorAll('[data-testid="room-card"]');
        for (n=0; n<tags.length; n++){
            tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML=tags[n].querySelector('[data-testid="thumbnail-label"]').innerHTML+" HIDDEN ";
            tags[n].querySelector('[data-testid="thumbnail-label"]').style.backgroundColor = "blue";
        }
    }

    function shownote(e){
        if(( document.getElementById("notepop").style.display=="block")&&(openthumbname==this.name)){
            document.getElementById("notepop").style.display="none";
            openthumbname="";
            return;
        }
        document.getElementById("notepop").style.height="170px";
        document.getElementById("notearea").value="";
        document.getElementById("notenote").innerHTML=notegrey + " Note";
        opennote="";
        openthumbname=this.name;
        var xpos=e.pageX;
        document.getElementById("notearea").innerHTML="";
        document.getElementById("notepop").style.top=e.pageY+100+"px";
        document.getElementById("notepop").style.left=xpos+20+"px";
        document.getElementById("notepop").style.display="block";
        document.getElementById("notepopName").innerHTML=openthumbname;
        var url="https://chaturbate.com/api/notes/for_user/"+openthumbname+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    return;
                }
                response.json().then(function(data){
                    if (data.text != null){
                        document.getElementById("notearea").value=data.text;
                        opennote=data.text;
                        if (usernoteslist.usernames.indexOf(openthumbname)==-1){
                            usernoteslist.usernames.push(openthumbname);
                            updatedm2();
                        }
                    }
                });
            });
    }

    function buildnotepop(){
        var newelem=document.createElement('span');
        newelem.id="notepop";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.overflow="hidden";
        newelem.style.backgroundColor="rgb(255, 255, 255)";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.borderRadius="4px";
        newelem.style.width="188px";
        newelem.style.height="170px";
        newelem.style.zIndex="999";
        newelem.style.boxShadow="0px 0px 32px rgba(0, 0, 0, 0.32)";
        document.getElementById("footer-holder").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "#dddddd";
        newelem.style.color="grey";
        newelem.style.fontWeight="bold";
        newelem.style.height="15px";
        newelem.style.fontSize="15px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.innerHTML='<span id="notepopName" style="text-Overflow: ellipsis; overflow:hidden; width:150px; height:20px; display:inline-block" ></span><span><img src="https://web.static.mmcdn.com/tsdefaultassets/close-gray.svg" style="position: absolute; height: 13px; width: 13px; right: 8px;" title="Close" id="noteclose"></span>';
        document.getElementById("notepop").appendChild(newelem);

        document.getElementById("noteclose").addEventListener("click", notepopclose);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "white";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.color="grey";
        newelem.style.height="15px";
        newelem.style.fontSize="12px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.style.cursor="pointer";
        newelem.addEventListener("click", function(){opendm2(document.getElementById("notepopName").innerHTML);});
        newelem.id="notepopLink";
        newelem.innerHTML='<img src="https://web.static.mmcdn.com/tsdefaultassets/popout-grey-d.svg" height="12px" width="12px"> Popout in new window';
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.style.backgroundColor = "white";
        newelem.style.color="grey";
        newelem.style.height="10px";
        newelem.style.fontSize="12px";
        newelem.style.padding="8px";
        newelem.style.textAlign="left";
        newelem.id="notenote";
        newelem.innerHTML=notegrey + " Note";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('textarea');
        newelem.id="notearea";
        newelem.style.height="60px";
        newelem.style.fontSize="12px";
        newelem.style.border="1px solid rgb(172, 172, 172)";
        newelem.style.borderRadius="4px";
        newelem.style.backgroundColor="rgb(255, 255, 255)";
        newelem.style.resize="none";
        newelem.style.padding="5px";
        newelem.style.width="85%";
        newelem.setAttribute("placeholder", "Enter notes about this user (only seen by you)");
        newelem.setAttribute("spellcheck", false);
        newelem.addEventListener("input",openbutton);
        newelem.id="notearea";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement('div');
        newelem.id="notecancelsubmit";
        document.getElementById("notepop").appendChild(newelem);

        newelem=document.createElement("span");
        newelem.style.position="relative";
        newelem.style.top="12px";
        newelem.style.left="-15px";
        newelem.addEventListener("click",closebutton);
        newelem.innerHTML='<a href="#" >Cancel</a>';
        document.getElementById("notecancelsubmit").appendChild(newelem);

        var subbutstyle="color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 5px; position: relative; right: 40px; top:10px; float: right; border-radius: 4px; cursor: pointer;";

        newelem=document.createElement("span");
        newelem.setAttribute("style", subbutstyle);
        newelem.addEventListener("click",savenote);
        newelem.innerHTML="Save";
        document.getElementById("notecancelsubmit").appendChild(newelem);
    }

    function savenote(){
        var notetext=document.getElementById("notearea").value;
        var url="https://chaturbate.com/api/notes/for_user/"+openthumbname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", notetext );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            body: data
        }).then(aftersave);
    }

    function aftersave(){
        var notetext=document.getElementById("notearea").value;
        var doupdate=false;
        if ((opennote=="")||(notetext=="")){
            doupdate=true;
        }
        opennote=notetext;
        closebutton();
        if (doupdate){updatedm();}
    }

    function notepopclose(){
        document.getElementById("notepop").style.display="none";
    }
    function openbutton(){
        document.getElementById("notepop").style.height="215px";
        document.getElementById("notenote").innerHTML=notegrey + " Note (unsaved)";
        document.getElementById("notearea").value=document.getElementById("notearea").value.replace("$"," "+new Date().toLocaleDateString()+" ");
        if(opennote==document.getElementById("notearea").value){
            closebutton();
        }
    }
    function closebutton(){
        document.getElementById("notenote").innerHTML=notegrey + " Note";
        document.getElementById("notepop").style.height="170px";
        document.getElementById("notearea").value=opennote;
    }

    function opendm2(that){
        var url="http://chaturbate.com/dm/"+that;
        var dmwindow=window.open(url,that,'toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=800');
        dmwindow.onload = function(){
            this.addEventListener('unload', function(){setTimeout(function(){updatedm();},1000);});
        };
    }

    function updatedm(){
        var url="https://chaturbate.com/api/notes/usernames/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.json().then(function(data) {
                    usernoteslist=data;
                }).then(updatedm2);
            });
    }

    function updatedm2(){
        var tags=document.querySelectorAll('[title="User notes"]');
        for (n=0; n<tags.length; n++){
             if (usernoteslist.usernames.indexOf(tags[n].getAttribute("name"))!=-1){
                 tags[n].innerHTML=note;
             }else{
                 tags[n].innerHTML=nonote;
             }
         }
    }

    function moveimg(){
        if(localStorage.getItem("animationoff")){return;}
        thisfap=this;
        fapbr=thisfap.getElementsByTagName("img")[0].src.split("/")[4].split("?")[0];
        cimg.addEventListener("load",regetimg);
        cimg.src = "https://jpeg.live.mmcdn.com/minifwap/"+fapbr+"?f="+ new Date().getTime();
    }

    function moveimgstop(){
        cimg.removeEventListener("load",regetimg);
    }

    function regetimg(){
        thisfap.getElementsByTagName("img")[0].src=cimg.src;
        setTimeout(function(){ cimg.src = "https://jpeg.live.mmcdn.com/minifwap/"+fapbr+"?f="+ new Date().getTime();}, 50);
    }

    function refresher(){
        document.addEventListener("visibilitychange", function(){
            if (document.hidden){return;}
            if (roomname=="followed-cams"){
                if (!localStorage.getItem("refreshoff")){
                    location.reload();
                }
            }
            setsw();
        });
    }

    function noadd(){
        if (document.getElementsByClassName('ad').length>0){
            document.getElementsByClassName('ad')[0].innerHTML="";

            var newelem=document.createElement('div');
            newelem.className="adinfo";

            var newdiv=document.createElement('div');
            newdiv.id="scriptinfo";
            newdiv.className="adscriptinfo";
            newdiv.style.backgroundColor="darkred";
            newelem.appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.style.width="4px";
            newdiv.style.backgroundColor="white";
            newelem.appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.id="userinfo";
            newdiv.className="adscriptinfo";
            newdiv.style.backgroundColor="darkblue";
            newelem.appendChild(newdiv);
            document.getElementsByClassName('ad')[0].appendChild(newelem);
            var info=scriptname+" version "+version+" is active.";
            newdiv=document.createElement('div');
            newdiv.style.margin="5px";
            if (!readCookie("goodboy")){
                if (!login){
                    info=info+"<br>Support this script, <a href='"+tour+"'>create a new account.</a>";
                    if(document.querySelector('[data-testid="sign-up-tab"]')){
                        document.querySelector('[data-testid="sign-up-tab"]').href=tour;
                    }
                }else{
                    info=info+"<br>Support this script, log out and create a new account.";
                }
                newdiv.innerHTML=info;
            }else{
                newdiv.innerHTML=info+"<br>Thank you for your support.";
            }
            document.getElementById("scriptinfo").appendChild(newdiv);

            newdiv=document.createElement('div');
            newdiv.style.margin="5px";
            if (!localStorage.getItem("topinfo")){
                newdiv.innerHTML="Info not yet available.";
                }else{
                    var topinfo=localStorage.getItem("topinfo").split("{")[1].split("}")[0];
                    topinfo=topinfo.replace(/\[/g,"<");
                    topinfo=topinfo.replace(/\]/g,">");
                    newdiv.innerHTML=topinfo;
                }
            document.getElementById("userinfo").appendChild(newdiv);
        }
    }

    function getmessage(){
        if (!localStorage.getItem("topinfo")){
            getmessage2();
            return;
        }
        var exp=parseInt(localStorage.getItem("topinfo").split("{")[0].split("expires:")[1]);
        if (exp<new Date().getTime()){
            getmessage2();
        }
    }

    function getmessage2(){
        var url="https://chaturbate.com/api/chatvideocontext/"+stor+"/";
        var topinfo="";
        fetch(url,{ credentials: "omit"}).then(
            function(response) {
                if (response.status !== 200){
                    topinfo = "{An error occured retrieving the info}";
                    var exp=new Date().getTime()+3600000;
                    localStorage.setItem("topinfo","expires:"+exp+topinfo);
                    return;
                }
                response.json().then(function(roomdata) {
                topinfo="{No info available}";
                    if (roomdata.chat_rules!=""){
                        topinfo=roomdata.chat_rules;
                    }
                    var exp=new Date().getTime()+14400000;
                    localStorage.setItem("topinfo","expires:"+exp+topinfo);
                });
            });
    }

    function aff(){
        if (currpage=="https://chaturbate.com/accounts/welcome/"){createCookie("goodboy","1",14);return;}
        if (currpage.split("?").length>1){
            if (currpage.split("?")[1].indexOf("campaign=hgg5k")!=-1){// me as aff
                createCookie("agreeterms","1",30);
                if (!login){
                    document.location.href="https://chaturbate.com/accounts/register/?src=header&auipsrc=navbar";
                }
                return;
            }
            if (currpage.split("?")[1].indexOf("campaign=")!=-1){
                if(!login){
                    untrace();
                    document.location.href=tour;
                }
                return;
            }
        }
        if (currpage.split("?")[0]=="https://chaturbate.com/auth/login/"){
            localStorage.clear();
            sessionStorage.clear();
        }
        if (currpage.split("?")[0]=="https://chaturbate.com/accounts/register/"){
            localStorage.clear();
            sessionStorage.clear();
        }
    }
    function untrace(){
        var cookies = document.cookie.split("; ");
        for (var c = 0; c < cookies.length; c++) {
            var d = window.location.hostname.split(".");
            while (d.length > 0) {
                var cookieBase = encodeURIComponent(cookies[c].split(";")[0].split("=")[0]) + '=; expires=Thu, 01-Jan-1970 00:00:01 GMT; domain=' + d.join('.') + ' ;path=';
                var p = location.pathname.split('/');
                document.cookie = cookieBase + '/';
                while (p.length > 0) {
                    document.cookie = cookieBase + p.join('/');
                    p.pop();
                }
                d.shift();
            }
        }
        localStorage.clear();
        sessionStorage.clear();
    }

     function subsel(){
        if (discoverpage){return;}
        if (document.getElementById("subselection")){document.getElementById("subselection").remove();}
        if((document.location.href.indexOf("spy-on-cams")==-1)&&(document.location.href.indexOf("followed-cams")==-1)&&(document.location.href.indexOf("/current_app_use/")==-1)){
            var newelem=document.createElement('li');
            newelem.id="subselection";
            var data='<form><select class="subsel" id="subsel" style="margin: 0px 0px 0px 0px; border-radius: 4px 4px 0px 0px;padding: 5px 1px 4px 12px; font-weight: 400; font-size: 13px; font-family: \'UbuntuMedium\',Arial,Helvetica,sans-serif;" >'+
                '<option value="/XX-cams">ALL CAMS IN CATEGORY</option>'+
                '<option value="/exhibitionist-cams/XX">EXHIBITIONIST CAMS</option>'+
                '<option value="/gaming-cams/XX">GAMING CAMS</option>'+
                '<option value="/new-cams/XX">NEW CAMS</option>'+
                '<option value="/teen-cams/XX">TEEN CAMS (18+)</option>'+
                '<option value="/18to21-cams/XX">18 TO 21 CAMS</option>'+
                '<option value="/21to35-cams/XX">21 TO 35 CAMS</option>'+
                '<option value="/30to50-cams/XX">30 TO 50 CAMS</option>'+
                '<option value="/mature-cams/XX">MATURE CAMS (50+)</option>'+
                '<option value="/north-american-cams/XX">NORTH AMERICAN CAMS</option>'+
                '<option value="/euro-russian-cams/XX">EURO RUSSIAN CAMS</option>'+
                '<option value="/south-american-cams/XX">SOUTH AMERICAN CAMS</option>'+
                '<option value="/asian-cams/XX">ASIAN CAMS</option>'+
                '<option value="/other-region-cams/XX">OTHER REGION CAMS</option>'+
                '<option value="/6-tokens-per-minute-private-cams/XX">6 TOKENS PER MINUTE</option>'+
                '<option value="/12-18-tokens-per-minute-private-cams/XX">12 - 18 TOKENS PER MINUTE</option>'+
                '<option value="/30-42-tokens-per-minute-private-cams/XX">30 - 42 TOKENS PER MINUTE</option>'+
                '<option value="/60-72-tokens-per-minute-private-cams/XX">60 - 72 TOKENS PER MINUTE</option>'+
                '<option value="/90-tokens-per-minute-private-cams/XX">90+ TOKENS PER MINUTE</option>'+
                '</select></form>';
            var	uloc=document.location.href+"//";
            var loc=uloc.split("/");
            var	check=loc[3]+loc[4];
            var gen="";
            if(check.indexOf("male") != -1){gen="male";}
            if(check.indexOf("female") != -1){gen="female";}
            if(check.indexOf("couple") != -1){gen="couple";}
            if(check.indexOf("trans") != -1){gen="trans";}
            data=data.replace(/XX/gi,gen);
            if (gen === ""){data=data.replace("-cams","");}
            data=data.replace('<option value="/'+loc[3],'<option selected value="/'+loc[3]);
            newelem.innerHTML=data;
            document.getElementsByClassName('sub-nav')[0].appendChild(newelem);
            document.getElementById("subsel").addEventListener('change',subselected);
        }
    }

    function subselected(){
        document.location.href=document.getElementById("subsel").options[document.getElementById("subsel").selectedIndex].value;
    }

    function pmlistner(){
        setTimeout(function(){
            pmobservenode=document.getElementById('pm-tab-default');
            pmobservenode2=document.getElementById('pm-tab-fvm');
            pmobserver.observe(pmobservenode, pmobserverConfig);
            pmobserver2.observe(pmobservenode2, pmobserverConfig);
        }, 2000);
    }

    function tabpm(){
        if (document.visibilityState=="visible"){return;}
        if ((pmobservenode.getElementsByTagName("span")[0].innerHTML=="PM")||(pmobservenode2.getElementsByTagName("span")[0].innerHTML=="PM")){return;}
        if (tabblink==true){return;}
        tabblink=true;
        tabblinker();
    }

    function tabblinker(){
        if (document.title == "PM !! PM"){
            document.title = "!! PM !!";
        }else{
            document.title = "PM !! PM";
        }
        if (document.visibilityState!="visible"){
            setTimeout(tabblinker,500);
        }else{
            document.title=ctitle;
            tabblink=false;
        }
    }

    function makevidcontrol(){
        var butstyle="margin-right: 5px;color: rgb(255, 255, 255); background-color:#F47321; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 3px; position: relative;right: 1px;top:-4px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
        var slistyle="text-align: left; width: 310px;margin-right: 4px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative; top: 0px; right: 1px; float: right; border-radius: 4px; display: inline;";
        var cbutstyle="margin-right: 5px;color: rgb(255, 255, 255); background: rgba(0, 0, 0, 0) linear-gradient(rgb(255, 151, 53) 0%, rgb(255, 158, 54) 50%, rgb(255, 112, 2) 60%) repeat scroll 0% 0%; font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; text-shadow: rgb(241, 129, 18) 1px 1px 0px; padding: 4px 10px 3px; position: relative;right: 1px; float: right; border-radius: 4px; cursor: pointer; display: inline;";
        var place2=document.querySelector('[data-paction="BroadcasterFeedback"]');
        if(ppage){
            place2=document.getElementsByClassName("tabBar")[0];
        }
        if (noaccess){
               place2=document.getElementsByClassName("top-section")[0];
        }
        var newelem="";
        if(ppage){
            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="FOLLOW";
            newelem.setAttribute("title", "Follow the bitch.");
            newelem.addEventListener("click", followbut);
            newelem.id="followbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="UNFOLLOW";
            newelem.setAttribute("title", "Dump her.");
            newelem.addEventListener("click", unfollowbut);
            newelem.style.backgroundColor="#8b8b8b";
            newelem.id="unfollowbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="JOIN FAN CLUB";
            newelem.addEventListener("click", function(){
                var fcwindow= window.open("https://chaturbate.com/fanclub/join/"+roomname+"/?source=SupporterSourceJoinFanClubButton","");
                fcwindow.onload = function(){
                    fcwindow.addEventListener('unload', function(){setTimeout(function(){
                        document.getElementById("fanclubbut").style.display="none";
                        document.getElementById("fanclubmembut").style.display="none";
                        newinfo();},1000);});
                };
            });
            newelem.style.backgroundColor="#009900";
            newelem.id="fanclubbut";
            newelem.style.display="none";
            place2.appendChild(newelem);

            newelem=document.createElement('span');
            newelem.setAttribute("style", butstyle);
            newelem.innerHTML="MEMBER";
            newelem.addEventListener("click", function(){window.open("https://chaturbate.com/fanclub/join/"+roomname+"/?source=SupporterSourceJoinFanClubButton","");});
            newelem.style.backgroundColor="#009900";
            newelem.id="fanclubmembut";
            newelem.style.display="none";
            place2.appendChild(newelem);
        }
        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="视频控件";
        newelem.addEventListener("click", vcontrol);
        newelem.style.zIndex="90";
        newelem.id="vcontr";
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.style.display="none";
        newelem.innerHTML="聊天控件";
        newelem.addEventListener("click", ccontrol);
        newelem.id="ccontr";
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="干净的个人资料 = ON";
        newelem.style.width="125px";
        newelem.style.display="none";
        newelem.id="clean";
        newelem.addEventListener("click", cleancookie);
        place2.appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", butstyle);
        newelem.innerHTML="重新加载信息";
        newelem.addEventListener("click", newinfo);
        if (noaccess){
            newelem.style.display="none";
        }
        newelem.id="infore";
        place2.appendChild(newelem);

        newelem=document.createElement('div');
        newelem.id="controls";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.border="2px solid rgb(244, 115, 33)";
        newelem.style.borderRadius="6px";
        newelem.style.width="340px";
        newelem.style.padding="12px";
        newelem.style.marginTop="600px";
        newelem.style.right="320px";
        if ((ppage)||(noaccess)){
            newelem.style.marginTop="140px";
            newelem.style.right="880px";
        }
        newelem.style.zIndex="999";
        newelem.setAttribute("class","popclass");
        document.getElementById("user_information").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="镜像视频";
        newelem.addEventListener("click",mirror);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="反转颜色";
        newelem.addEventListener("click",invert);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="拖曳面板";
        newelem.style.cursor="move";
        newelem.addEventListener("mousedown",dragMouseDown);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="亮度 : <input type='range' id='myRange' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange").addEventListener("input",badjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="对比 : <input type='range' id='myRange1' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange1").addEventListener("input",cadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="饱和 : <input type='range' id='myRange2' min=0 max=200 value=100 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange2").addEventListener("input",sadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.innerHTML="色调 : <input type='range' id='myRange3' min=180 max=540 value=360 style='width: 200px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("controls").appendChild(newelem);
        document.getElementById("myRange3").addEventListener("input",hadjust);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="停止录制";
        newelem.id="stopbut";
        newelem.addEventListener("click",recstop);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="录制/暂停";
        newelem.id="recbut";
        newelem.addEventListener("click",recstart);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="全部重置";
        newelem.addEventListener("click",vreset);
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);
        newelem=document.createElement('br');
        document.getElementById("controls").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", cbutstyle);
        newelem.innerHTML="隐藏面板";
        newelem.id="vcontr2";
        newelem.addEventListener("click",vcontrol);
        document.getElementById("controls").appendChild(newelem);

        if ((noaccess)||(ppage)){return;}

        newelem=document.createElement('div');
        newelem.id="chatcontrols";
        newelem.style.display="none";
        newelem.style.position="absolute";
        newelem.style.border="2px solid rgb(244, 115, 33)";
        newelem.style.borderRadius="6px";
        newelem.style.width="340px";
        newelem.style.padding="12px";
        newelem.style.top="40px";
        newelem.style.right="10px";
        newelem.style.zIndex="99";
        newelem.setAttribute("class","popclass");
        document.querySelector('[data-testid="room-tab-bar"]').appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="缩小表情 : <input type='range' id='c1' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="消息通知 : <input type='range' id='c2' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="主题更改 : <input type='range' id='c3' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Mod/fan enter-leave : <input type='range' id='c4' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        if (document.querySelector('[data-testid="header-slogan-text"]').innerHTML.indexOf("THE ACT OF MASTURBATING ")==-1){newelem.style.display="none";}
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="灰色用户 : <input type='range' id='c5' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="主播消息 : <input type='range' id='c6' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="打赏小于 : <input type='number' id='c7a' min='2' max='1000' value='100' style='width: 4em;height:11px;cursor: pointer; '> tokens.<input type='range' id='c7' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="Lovense消息 : <input type='range' id='c8' min=0 max=1 value=0 style='width: 40px;height:11px;cursor: pointer;float: right;'>";
        document.getElementById("chatcontrols").appendChild(newelem);

        newelem=document.createElement('span');
        newelem.setAttribute("style", slistyle);
        newelem.style.margin="2px";
        newelem.innerHTML="收到代币 : <span id='tclear' style='cursor:pointer'>  (Clear)</span><span id='c9' style='width: 40px;height:11px;float: right; color:black'>0</span>";
        document.getElementById("chatcontrols").appendChild(newelem);
    }

    function followbut(){
        var url="https://chaturbate.com/follow/follow/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowButton" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: "https://chaturbate.com/"+roomname+"/",
            body: data
        }).then(function(){
        document.getElementById("followbut").style.display="none";
        document.getElementById("unfollowbut").style.display="block";
        });
    }

    function unfollowbut(){
        var url="https://chaturbate.com/follow/unfollow/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "location", "FollowButton" );
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: "https://chaturbate.com/"+roomname+"/",
            body: data
        }).then(function(){
        document.getElementById("unfollowbut").style.display="none";
        document.getElementById("followbut").style.display="block";
        });
    }

    function getvid(){
        vareaid=document.getElementsByTagName("video")[0].id;
        observer3.observe(document.getElementsByTagName("video")[0].parentNode, observerConfig3);
    }

    function varea(){
        if((ppage)||(noaccess)){
            var video=document.getElementsByTagName("video")[0];
            video.style.filter=vfilter;
            video.style.transform=vmirror;
            return video;
        }
        var vnode=document.getElementById(vareaid);
        if(!vnode){
            vnode=document.getElementById("chat-player");
            if(!vnode){
                return;
            }
        }
        vnode.style.filter=vfilter;
		vnode.style.transform=vmirror;
        if (document.querySelector('[data-testid="video-container"]')&&vnode.src){
            document.querySelector('[data-testid="video-container"]').style.background="rgb(51, 51, 51)";
        }
        document.getElementById("vcontr").style.display="block";
        if (!vnode.src){
            document.getElementById("vcontr").style.display="none";
            document.getElementById("controls").style.display="none";
        }
        return vnode;
    }

	function badjust(){
		br=document.getElementById("myRange").value;
		ofils=varea().style.filter.split(" ");
        vfilter="brightness("+br+"%) "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" "+ofils[4];
        varea();
	}

	function cadjust(){
		br=document.getElementById("myRange1").value;
		ofils=varea().style.filter.split(" ");
        vfilter=ofils[0]+" contrast("+br+"%) "+ofils[2]+" "+ofils[3]+" "+ofils[4];
		varea();
    }

	function sadjust(){
		br=document.getElementById("myRange2").value;
		ofils=varea().style.filter.split(" ");
		vfilter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" saturate("+br+"%) "+ofils[4];
        varea();
	}

	function hadjust(){
		br=document.getElementById("myRange3").value;
		if (br > 359){br=br-360;}
		ofils=varea().style.filter.split(" ");
		vfilter=ofils[0]+" "+ofils[1]+" "+ofils[2]+" "+ofils[3]+" hue-rotate("+br+"deg)";
        varea();
	}

	function invert(){
		ofils=varea().style.filter.split(" ");
		br=" invert(100%) ";
		if (ofils[2]=="invert(100%)"){br=" invert(0%) ";}
		vfilter=ofils[0]+" "+ofils[1]+br+ofils[3]+" "+ofils[4];
        varea();
	}

	function mirror(){
		if (varea().style.transform=="none"){
            vmirror="matrix(-1, 0, 0, 1, 0, 0)";
			varea();

		}else{
            vmirror="none";
			varea();
		}
	}

	function vreset(){
        vfilter="brightness(100%) contrast(100%) invert(0%) saturate(100%) hue-rotate(0deg)";
        vmirror="none";
  		varea();
 		document.getElementById("myRange").value=100;
		document.getElementById("myRange1").value=100;
		document.getElementById("myRange2").value=100;
		document.getElementById("myRange3").value=360;
	}

    function vcontrol(){
        if (document.getElementById("controls").style.display=="block"){
            if (recording){return;}
            document.getElementById("controls").style.display="none";
        }else{
            document.getElementById("controls").style.display="block";
        }
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        var x =parseInt(document.getElementById("controls").style.right);
        var y =parseInt(document.getElementById("controls").style.marginTop);
        if ((pos3>=110)&&(pos3<=window.innerWidth-324)){
            document.getElementById("controls").style.right = (x + pos1) + "px";
        }
        if ((y-pos2>-50)&&(pos4<=window.innerHeight-20)){
            document.getElementById("controls").style.marginTop = (y - pos2) + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    function info(anon){
        fetching++;
        var cred="same-origin";
        if (!anon){cred="omit";}
        var url="https://chaturbate.com/api/chatvideocontext/"+roomname+"/";
        fetch(url,{ credentials: cred}).then(
            function(response) {
                if (response.status !== 200){
                    wprof("Error:","<div style='color:red'>You have no access to this room</div>");
                    if (anon){
                        noaccess=true;
                        fetching--;
                        info(false);
                    }
                    fetching--;
                    return;
                }
                response.json().then(function(roomdata) {
                    data=roomdata;
                    fetching--;
                    setprofileinfo();
                });
            });
    }

    function setprofileinfo(){
        room_status=data.room_status;
        username=data.viewer_username;
        if (room_status =="offline"){
            document.getElementById("vcontr").style.display="none";
        }
        if(ppage){
            document.getElementById("vcontr").style.display="none";
            document.getElementsByClassName("voteText")[0].innerHTML="";
            document.getElementsByClassName("voteText")[1].innerHTML="";
            document.getElementsByClassName("highPercent")[0].innerHTML="";
            if (data.satisfaction_score.up_votes){
                document.getElementsByClassName("voteText")[0].innerHTML=data.satisfaction_score.up_votes;
                document.getElementsByClassName("voteText")[1].innerHTML=data.satisfaction_score.down_votes;
                document.getElementsByClassName("highPercent")[0].innerHTML=data.satisfaction_score.percent+"%";
                if (data.satisfaction_score.percent<85){
                    document.getElementsByClassName("highPercent")[0].style.color="red";
                }
            }
        }
        wprof("查找主播:","<a href='https://camgirlfinder.net/models?m="+roomname+"&p=cb&g=a' rel=noreferrer target='_new'>点击查看</a>");
        wprof("统计资料:","<a href='https://statbate.com/search/1/"+roomname+"' rel=noreferrer target='_new'>点击查看</a>");
        wprof("直播时间:","<a href='https://www.cbhours.com/user/"+roomname+".html' rel=noreferrer target='_new'>点击查看</a>");
        if (document.getElementById("vcontr").style.display=="none"){
            if (!data.opt_out){
                wprof("Full video (anon):","<a href='https://www.girls4cock.com/fullvideo/?b="+roomname+"' rel=noreferrer target='_new'>Open full video mode as anonymous</a>");
                if (!noaccess){
                    wprof("Full video:","<a href='https://chaturbate.com/fullvideo/?b="+roomname+"' rel=noreferrer target='_new'>Open full video mode</a>");
                }
            }
        }
        if (data.opt_out){
            wprof("On network sites:","No");
        }
        makerulesarea(data.chat_rules);
        if(data.chat_rules!=""){
            wprof ("Chat rules:","<a href=# id='rulesview'>Yes, click to read</a>");
            document.getElementById("rulesview").addEventListener("click",function(){
                if(document.getElementById("rulespop").style.display=="none"){
                    document.getElementById("rulespop").innerHTML=chatrules;
                    document.getElementById("rulespop").style.display="block";
                }
                else{
                    document.getElementById("rulespop").style.display="none";
                    document.getElementById("rulespop").innerHTML="";
                }
            });
        }
        if(ppage){
            if(!noaccess){
                if (data.following){
                    document.getElementById("unfollowbut").style.display="block";
                }else{
                    document.getElementById("followbut").style.display="block";
                }
                if (data.fan_club_is_member){
                    document.getElementById("fanclubmembut").style.display="block";
                }else{
                    if (data.performer_has_fanclub){
                        document.getElementById("fanclubbut").style.display="block";
                    }
                }
            }
        }
        if (data.num_viewers!=0){
            wprof("直播间用户:",data.num_viewers+"<a href=# id='userview'> (点击查看)</a>");
            document.getElementById("userview").addEventListener("click",getuserlist);
        }else{
            wprof("Users in room:","0");
        }
        if (data.low_satisfaction_score){
            wprof("Satisfaction score:","<font color=#CC0000>LOW !!!</font>");
        }
        if (data.is_moderator){
            wprof("Moderator:","Yes");
        }
        if (data.fan_club_is_member){
            wprof("Fanclub member:","Yes");
        }
        if ((room_status=="offline")||(ppage)){
            wprof("Room topic:","<div style='width:450px;height:auto'>"+data.room_title+"</div>");
        }
        if (ppage){
            if (room_status.indexOf("hidden")!=-1){
                wprof("Hidden message:",data.hidden_message);
            }
        }
        if (room_status != "offline"){
            hls_source=data.hls_source;
            if (hls_source!=""){
                localStorage.setItem("defaultplaylist",hls_source.split("?")[0].replace(roomname,"XXX"));
            }
            videoSrc=hls_source;
            navigator.clipboard.writeText(hls_source);
            var vidqual=data.quality.quality;
            if (!vidqual){vidqual= "unknown";}
            wprof("视频质量:",vidqual);
        }
        wprof("Video:",'<div id="rstatus">'+room_status+'</div>');
        if (ppage){
            if (data.is_age_verified){
                wprof("Alarm:","<div id='alarm'><div>");
                makealarm();
            }
        }
        wprof("视频地址:","<a href=# id='hls'>单击复制到剪贴板/更新状态</a>");
        document.getElementById("hls").addEventListener("click",function(){getnewhls(!noaccess,true);});
        if (data.tips_in_past_24_hours !== 0){
            wprof("You tipped:",data.tips_in_past_24_hours+" Tk/24h");
        }
        if (!data.is_age_verified){
            wprof("Status:","Exhibitionist");
        }else{
            if (data.allow_private_shows){
                if (data.spy_private_show_price !== 0){
                    if ((data.fan_club_spy_private_show_price !==null)&&(data.fan_club_spy_private_show_price!==data.spy_private_show_price)){
                        if(data.fan_club_spy_private_show_price==0){
                            wprof("Fan Spy on private:","Free");
                        }else{
                            wprof("Fan Spy on private:",data.fan_club_spy_private_show_price+" Tk/min");
                        }
                    }
                    wprof("Spy on private:",data.spy_private_show_price+" Tk/min");
                }else{
                    wprof("Spy on private:","Disabled");
                }
                wprof("Minimum private:",data.private_min_minutes+" Minutes");
                wprof("Private recording:",data.allow_show_recordings ? "Yes":"No");
                wprof("Privateshow:",data.private_show_price+" Tk/min");
            }else{
                wprof("私人表演:","禁用");
            }
        }
        if (login){
            if (!noaccess){
                if (roomname!=yourname){
                    wprof ("私信:","<a href='https://chaturbate.com/dm/"+roomname+"/' id='dmpop'>打开窗口</a>");
                    document.getElementById("dmpop").addEventListener("click", function(event){opendm(this);event.stopPropagation();event.preventDefault();return false;});
                }
            }
            getnotes();
            createimage();
        }
        if ((room_status!="offline")&&(!ppage)){chatchange();}
    }

    function getuserlist(){
        if(document.getElementById("rulespop").style.display=="block"){
            document.getElementById("rulespop").style.display="none";
            document.getElementById("rulespop").innerHTML="";
            return;
        }else{
            document.getElementById("rulespop").style.display="block";
        }

        var listurl="https://chaturbate.com/api/getchatuserlist/?sort_by=a&roomname="+roomname+"&exclude_staff=false";
        fetch(listurl,{credentials: "omit",referrerPolicy: "no-referrer"}).then(
            function(response) {
                if (response.status !== 200){
                    return;
                }
                response.text().then(function(userdata) {
                    formatuserlist(userdata);
                });
            });
    }

    function makealarm(){
        var newelem=document.createElement('span');
        newelem.innerHTML="Off <input type='range' id='alrm' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> On || Alarm only <input type='range' id='alrmtype' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> Go to page if public";
        document.getElementById("alarm").appendChild(newelem);
        document.getElementById("alrm").addEventListener("change",setalrm);
        document.title=ctitle;
    }

    function setalrm(){
        if (document.getElementById("alrm").value==0){document.title=ctitle;return;}
        ctitle=document.title;
        document.title="\u23F0 "+ctitle;
        getnewhls(true,false);
        setTimeout(function(){
            oldroomstatus=roomstatus;
            if(!alarmrun){
            alarmrun=true;
            testalarm();}},1000);
    }

    function testalarm(){
        setTimeout(function(){
            if(document.getElementById("alrm").value==0){alarmrun=false;return;}
            getnewhls(true,false,2);
        }, 60000);
    }

    function testalarm2(){
        if (roomstatus != oldroomstatus){
            if(document.getElementById("alrmtype").value==1){
                if (roomstatus=="public"){
                    forceopen(roomname);
                }
                oldroomstatus=roomstatus;
                if (alarmrun){
                    testalarm();
                    return;
                }
            }
            playalarm();
            alarmtab();
            alarmrun=false;
        }else{
            if (alarmrun){
                testalarm();
            }
        }
    }

    function playalarm(){
        if (document.getElementById("alrm")){
            if (document.getElementById("alrm").value==0){return;}
        }
        alarmaudio.play();
        setTimeout(playalarm,2000);
    }

    function alarmtab(){
        if (document.getElementById("alrm")){
            if (document.getElementById("alrm").value==0){document.title=ctitle;return;}
        }
        if (document.title != "ALARM"){
            document.title = "ALARM";
        }else{
            document.title = "!!!!!!";
        }
        setTimeout(alarmtab,500);
    }

    function formatuserlist(userdata){
        var userarray=userdata.split(",");
        var height=15*userarray.length+120;
        var scroll="";
        if (height<240){height=240;}
        if (height>500){height=500;scroll=";overflow-y:scroll";}
        var userstring="<div style='float:right;color:black'>(Close)</div><div onclick='event.stopPropagation()' style='cursor:default;color:black;width:350px;height:"+height+"px"+scroll+"'>";
        for (i=1; i<userarray.length; i++){
            var user=userarray[i].split("|");
            if (user[1]=="o"){user[1]="#dc5500";}
            if (user[1]=="m"){user[1]="#dc0000";}
            if (user[1]=="f"){user[1]="#090";}
            if (user[1]=="l"){user[1]="#804baa";}
            if (user[1]=="p"){user[1]="#be6aff";}
            if (user[1]=="tr"){user[1]="#1e5cfb";}
            if (user[1]=="t"){user[1]="#69a";}
            if (user[1]=="g"){user[1]="#939393";}
            if (user[2]=="m"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/male.svg";}
            if (user[2]=="f"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/female.svg";}
            if (user[2]=="c"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/couple.svg";}
            if (user[2]=="s"){user[2]="https://web.static.mmcdn.com/tsdefaultassets/gendericons/trans.svg";}
            if (user[3]=="t"){user[3]="(Follower)";}
            if (user[3]=="f"){user[3]="";}
            if ((user[0]==roomname)||(user[0]==yourname)){
                userstring=userstring+"<img style='height:16px' src='"+user[2]+"'><a style='font-weight: bold;color:"+user[1]+"'>"+user[0]+"</a> "+user[3]+"<br>";
            }else{
                if (loggedin){
                    userstring=userstring+"<img style='height:16px' src='"+user[2]+"'><a target=_blank style='font-weight: bold;color:"+user[1]+"' href='https://chaturbate.com/p/"+yourname+"?tab=bio&model="+user[0]+"'>"+user[0]+"</a> "+user[3]+"<br>";
                }else{
                    userstring=userstring+"<img style='height:16px' src='"+user[2]+"'><a target=_blank style='font-weight: bold;color:"+user[1]+"' href='https://chaturbate.com/"+user[0]+"'>"+user[0]+"</a> "+user[3]+"<br>";
                }
            }
        }
        userstring=userstring+"+"+userarray[0].split("|")[0]+" Anonymous users.</div>";
        document.getElementById("rulespop").innerHTML=userstring;
    }

    function chatchange(){
        document.getElementById("ccontr").style.display="block";
        document.getElementById("c1").addEventListener("change",chatsetchange);
        document.getElementById("c2").addEventListener("change",chatsetchange);
        document.getElementById("c3").addEventListener("change",chatsetchange);
        document.getElementById("c4").addEventListener("change",chatsetchange);
        document.getElementById("c5").addEventListener("change",chatsetchange);
        document.getElementById("c6").addEventListener("change",chatsetchange);
        document.getElementById("c7").addEventListener("change",chatsetchange);
        document.getElementById("c7a").addEventListener("change",chatsetchange);
        document.getElementById("c8").addEventListener("change",chatsetchange);
        var chatobserver = new MutationObserver(chatadjust);
        var chatobserverConfig = {childList: true, subtree: true };
        var observenode=document.getElementsByClassName("message-list")[0];
        if (localStorage.getItem(roomname+"Tokens")){
            document.getElementById("c9").innerHTML=localStorage.getItem(roomname+"Tokens");
            firstentry=false;
        }
        document.getElementById("tclear").addEventListener("click",cleartokens);
        chatobserver.observe(observenode,chatobserverConfig);
    }

    function cleartokens(){
        document.getElementById("c9").innerHTML=0;
        localStorage.removeItem(roomname+"Tokens");
    }

    function chatsetchange(){
        c1=document.getElementById("c1").value;
        c2=document.getElementById("c2").value;
        c3=document.getElementById("c3").value;
        c4=document.getElementById("c4").value;
        c5=document.getElementById("c5").value;
        c6=document.getElementById("c6").value;
        c7=document.getElementById("c7").value;
        c7a=document.getElementById("c7a").value;
        if (c7a<2){c7a=2;document.getElementById("c7a").value=2;}
        if (c7a>1000){c7a=1000;document.getElementById("c7a").value=1000;}
        c8=document.getElementById("c8").value;
        smallemoonoff();
        chatadjust();
    }

    function chatadjust(){
        if (!firstentry){
            twaiting=true;
            setTimeout(function(){twaiting=false;}, 200);
            firstentry=true;
        }
        var tags=document.getElementsByClassName('msg-list-fvm');
        for (n=0; n<tags.length; n++){
            chattamper(n);
        }
    }

    function chattamper(tag){
        var messages=document.getElementsByClassName('msg-list-fvm')[tag].querySelectorAll('[data-testid="chat-message"]');
        var chatmessages=messages.length;
        if (chatmessages==0){return;}
        for (i=0; i<chatmessages; i++){
            var noticeelm=messages[i].querySelector('[data-testid="room-notice"]');
            if (noticeelm!=null){
                var noticeclasses=noticeelm.classList;
                var notetext=noticeelm.querySelector('[data-testid="room-notice-viewport"]').textContent;
                if (noticeclasses.length==1){
                    if (notetext.indexOf("Notice:")==0){
                        if (c2==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                    if (notetext.indexOf("Moderator")==0){
                        if (c4==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                    if (notetext.indexOf("Fan club member")==0){
                        if (c4==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                }
                if (noticeclasses.contains("titleChange")){
                    if (c3==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
                if (noticeclasses.contains("isTip")){
                    var tokens=parseInt(notetext.split("tipped ")[1].split(" ")[0]);
                    if (tag==0){
                        if(messages[i].style.display=="flex"){
                            if(!twaiting){
                                document.getElementById("c9").innerHTML=parseInt(document.getElementById("c9").innerHTML)+tokens;
                                localStorage.setItem(roomname+"Tokens",document.getElementById("c9").innerHTML);
                            }
                        }
                    }
                    if ((c7==1)&&(tokens<c7a)){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
            }
            if (messages[i].querySelector('[data-testid="chat-message-text"]')!=null){
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="broadcaster"){
                    var chattext=messages[i].querySelector('[data-testid="chat-message-text"]').textContent;
                    if ((chattext.indexOf("Lovense")!=-1)||(chattext.indexOf("------")!=-1)||(chattext.indexOf("******")!=-1)||(chattext.indexOf("The High Tipper")!=-1)||(chattext.indexOf("The king Tipper")!=-1)||(chattext.indexOf("Special Commands:")!=-1)||(chattext.indexOf("Blitz Mode")!=-1)){
                        if (c8==1){
                            messages[i].style.display="none";
                        }else{
                            messages[i].style.display="block";
                        }
                    }
                }
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="defaultUser"){
                    if (c5==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
                if (messages[i].querySelector('[data-testid="chat-message-username"]').className=="mod"){
                    if (c6==1){
                        messages[i].style.display="none";
                    }else{
                        messages[i].style.display="block";
                    }
                }
            }
        }
    }

    function smallemoonoff(){
        if ((c1==1)&&(document.getElementById("emostyle")==null)){
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.id="emostyle";
            style.textContent = "img.emoticonImage {max-height:22px !important;}";
            document.getElementsByTagName('head')[0].appendChild(style);
        }
        if ((c1==0)&&(document.getElementById("emostyle")!=null)){
            document.getElementById("emostyle").remove();
        }
    }

    function ccontrol(){
        if (document.getElementById("chatcontrols").style.display=="block"){
            document.getElementById("chatcontrols").style.display="none";
        }else{
            document.getElementById("chatcontrols").style.display="block";
        }
    }

    function opendm(that){
       var dmwindow= window.open(that.href,'DMpop','toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=800');
       dmwindow.onload = function(){
           this.addEventListener('unload', function(){setTimeout(function(){newinfo();},1000);});
       };
    }

    function getnotes(){
        var url="https://chaturbate.com/api/notes/for_user/"+roomname+"/";
        fetch(url,{ credentials: "same-origin"}).then(
            function(response) {
                if (response.status !== 200) {
                    wprof("Attention:","This room is banned.");
                    return;
                }
                response.json().then(function(data) {
                    if (data.text == null){data.text="";}
                    opennote=data.text;
                    buildprofnote();
                });
            });
    }

    function makerulesarea(rule){
        if (document.getElementById("rulespop")){return;}
        var rulestyle="cursor:pointer;z-index:999;top:10px;left:10px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32);border-radius:4px;border:1px solid rgb(221, 221, 221);background-color:rgb(200, 200, 200);position:absolute; display:none; white-space: pre-line; text-align: left; line-height: 1.4; height: auto; width:500px; padding: 10px 10px 10px 10px; box-sizing: border-box; overflow-wrap: break-word; word-break: break-word; padding: 15px;";
        var newelem=document.createElement('span');
        newelem.setAttribute("style", rulestyle);
        newelem.id="rulespop";
        chatrules="<div style='color:black'><b>"+roomname+" chatrules:</b><br><br>"+rule+"<br><br><center>(Click to close)</center></div>";
        newelem.addEventListener("click",function(){this.style.display="none";this.innerHTML="";});
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

     function createimage(){
        if (!ppage&&!noaccess){return;} // only on p and no access rooms
        hls.detachMedia();
        if (document.getElementById("profimg")){document.getElementById("profimg").remove();}//if img remove it
        if (document.getElementById("profplayer")){//player is er
            if ((room_status=="public")||(room_status.indexOf("watching")!=-1)){
                startvid();
                return;
            }
            document.removeEventListener("visibilitychange",vidpause);
            document.getElementById("profplayer").remove();
            document.getElementById("controls").style.display="none";
            document.getElementById("vcontr").style.display="none";
        }
        if ((room_status=="public")||(room_status.indexOf("watching")!=-1)){makevidplayer();return;}
        var url="https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg";
        fetch(url,{
            cache: "no-cache",
            credentials: "same-origin",referrer: "https://chaturbate.com/"}).then(
            function(response){
                var imgsize=response.headers.get("content-length");
                if ((imgsize<4800)||(imgsize>4850)){
                    makeimg();
                }else{
                    makecrd();
                }
            }

        );
    }

    function makecrd(){
        if (data.summary_card_image==""){return;}
        var newelem=document.createElement('img');
        newelem.src=data.summary_card_image;
        newelem.id="profimg";
        newelem.style.zIndex="99";
        newelem.style.position="absolute";
        newelem.style.height="480px";
        newelem.style.maxWidth="854px";
        newelem.style.top="10px";
        newelem.style.right="10px";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.borderRadius="4px";
        newelem.style.boxShadow="0px 0px 32px rgba(0, 0, 0, 0.32)";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

    function makeimg(){
        var newelem=document.createElement('img');
        newelem.src="https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg";
        newelem.id="profimg";
        newelem.style.zIndex="99";
        newelem.style.position="absolute";
        newelem.style.height="270px";
        newelem.style.width="480px";
        newelem.style.top="10px";
        newelem.style.right="10px";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.borderRadius="4px";
        newelem.style.boxShadow="0px 0px 32px rgba(0, 0, 0, 0.32)";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
    }

    function makevidplayer(){
        var control=localStorage.getItem("videoControls");
        var newelem=document.createElement('video');
        newelem.id="profplayer";
        newelem.controls=true;
        newelem.autoplay=true;
        if (control.indexOf("true")!=-1){newelem.muted=true;}
        var volume=control.split(":")[1].split(",")[0];
        newelem.volume=volume/100;
        newelem.poster="https://jpeg.live.mmcdn.com/stream?room="+roomname+"&f="+ new Date().getTime();
        newelem.style.zIndex="99";
        newelem.style.position="absolute";
        newelem.style.width="854px";
        newelem.style.height="480px";
        newelem.style.top="10px";
        newelem.style.right="10px";
        newelem.style.border="1px solid rgb(221, 221, 221)";
        newelem.style.borderRadius="4px";
        newelem.style.boxShadow="0px 0px 32px rgba(0, 0, 0, 0.32)";
        document.querySelector('[data-testid="room-bio-tab-contents"]').appendChild(newelem);
        document.addEventListener("visibilitychange",vidpause);
        startvid();
    }

    function startvid(){
        document.getElementById("vcontr").style.display="block";
        hls.loadSource(videoSrc);
        hls.attachMedia(document.getElementById('profplayer'));
        hls.on(Hls.Events.ERROR, function (event, data) {
            if (data.fatal==true){
                if (errors==0){setTimeout(function(){errors=0;}, 10000);}
                errors++;
                if (errors==4){errorvid();return;}
                getnewhls(true,false,1);
            }
        });
    }

    function vidpause(){
        if (recording){return;}
        if (document.hidden){
            hls.detachMedia();
        }else{
            startvid();
        }
    }

    function errorvid(){
        errors=0;
        hls.detachMedia();
        document.removeEventListener("visibilitychange",vidpause);
        document.getElementById("controls").style.display="none";
        document.getElementById("vcontr").style.display="none";
        document.getElementById("profplayer").remove();
        document.getElementById("rstatus").innerHTML=document.getElementById("rstatus").innerHTML+" !!Video error, try reload!!";
        makeimg();
    }

    function recstop(){
        if (!recording){return;}
        mediaRecorder.stop();
    }
    function recstart(){
        if (recording){
            if (!recpause){
                mediaRecorder.pause();
                recpause=true;
                document.getElementById("recbut").style.color="#990000";
                setTimeout(function(){document.getElementById("recbut").style.color="#990000";},400);
                return;
            }
            mediaRecorder.resume();
            recpause=false;
            return;
        }
        recording=true;
        document.getElementById("vcontr").style.cursor="not-allowed";
        document.getElementById("vcontr2").style.cursor="not-allowed";
        document.getElementById("recbut").style.color="#990000";
        var video=document.getElementsByTagName('video')[0];
        stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.onstop = startDownload;
        mediaRecorder.ondataavailable = handleDataAvailable;
        try {
            mediaRecorder.start(1000);
        } catch (e) {
            document.getElementById("recbut").style.color="white";
            recording=false;
            recpause=false;
        }
    }
    function handleDataAvailable(event) {
        document.getElementById("recbut").style.color="#990000";
        if (event.data && event.data.size > 0) {
            setTimeout(function(){document.getElementById("recbut").style.color="white";},300);
            recordedBlobs.push(event.data);
        }
    }
    function startDownload() {
        recpause=false;
        recording=false;
        document.getElementById("vcontr").style.cursor="pointer";
        document.getElementById("vcontr2").style.cursor="pointer";
        var recname=roomname+"_"+new Date().toISOString().split(".")[0]+"GMT";
        var blob = new Blob(recordedBlobs, {type: 'video/webm codecs="vp9" opus'});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = recname+'.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            recordedBlobs = [];
        }, 100);
    }

    function buildprofnote(){
        var subbutraw="<span id='profsubmit' style='color: rgb(255, 255, 255); background: rgb(244, 115, 33); font-family: UbuntuMedium, Helvetica, Arial, sans-serif; font-size: 12px; padding: 4px 10px 5px; position: relative; left: 120px; float: left; border-radius: 4px; cursor: pointer;'>Save</span>";
        wprof("",'<div width="200px" id="profnote" style="display:none"><a href=# id="profcancel">Cancel</a>'+subbutraw+'</div>');
        wprof("个人备注:","<textarea id='proftext' spellcheck='false' placeholder='输入有关此用户的注释'></textarea>");
        document.getElementById("proftext").value=opennote;
        document.getElementById("proftext").addEventListener("input",profopenbutton);
        document.getElementById("profcancel").addEventListener("click",profclosebutton);
        document.getElementById("profsubmit").addEventListener("click",profsavenote);
    }

    function profsavenote(){
        var notetext=document.getElementById("proftext").value;
        var url="https://chaturbate.com/api/notes/for_user/"+roomname+"/";
        var csrftoken= readCookie("csrftoken");
        var data = new FormData();
        data.append( "text", notetext );
        fetch(url,
              {
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: "https://chaturbate.com/"+roomname+"/",
            body: data
        }).then(profaftersave);
    }

    function profaftersave(){
        opennote=document.getElementById("proftext").value;
        profclosebutton();
    }

    function profopenbutton(){
        document.getElementById("profnote").style.display="block";
        document.getElementById("proftext").value=document.getElementById("proftext").value.replace("$"," "+new Date().toLocaleDateString()+" ");
        if(opennote==document.getElementById("proftext").value){
            profclosebutton();
        }
    }

    function profclosebutton(){
        document.getElementById("profnote").style.display="none";
        document.getElementById("proftext").value=opennote;
    }

    function wprof(col1,col2){
        var container=document.getElementsByClassName("BioContents")[0];
        var newtr=document.createElement('tr');
        newtr.setAttribute("style", "font-size: 14px; font-weight: normal; line-height: 15px; vertical-align: top; text-align: left;");
        newtr.setAttribute("name", "info");
        var newtd=document.createElement('td');
        newtd.setAttribute("style", "padding-bottom: 9px; font-family: UbuntuMedium, Arial, Helvetica, sans-serif; height: 16px;");
        newtd.className="label";
        var newspan=document.createElement('span');
        newspan.className="defaultColor";
        newspan.innerHTML=col1;
        newtd.appendChild(newspan);
        var newtd2=document.createElement('td');
        newtd2.setAttribute("style", "font-size: 14px; line-height: 16px; font-family: UbuntuRegular, Arial, Helvetica, sans-serif;");
        newtd2.className="contentText";
        newtd2.innerHTML=col2;
        newtr.appendChild(newtd);
        newtr.appendChild(newtd2);
        var referenceNode=container.getElementsByTagName("table")[0];
        referenceNode.insertBefore(newtr, referenceNode.getElementsByTagName("tr")[2]);
    }

    function newinfo(){
        if (fetching!==0){alert("Slow down !");return;}
        if(document.getElementById("rulespop")){document.getElementById("rulespop").style.display="none";}
        var tags=document.getElementsByName("info");
        for(i=tags.length-1;i>=0;i--){
            tags[i].remove();
        }
        info(true);
    }

    function cleaninit(){
        var p=0;
        var maxoke="";
        var attr="";
        var tags=document.querySelectorAll('[rel="nofollow"]');
        for (n=0; n<tags.length; n++){
            if (tags[n].style.position){
                if (tags[n].style.position=="fixed"){
                    tags[n].style.position="absolute";
                }
                if (tags[n].style.position.indexOf("var")!=-1){
                    tags[n].style.position="absolute";
                }
                if (tags[n].style.position.indexOf("absolute")!=-1){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profpos");
                    p++;
                }
            }
            if (tags[n].style.marginTop){
                maxoke=-30;
                if(tags[n].style.marginTop.indexOf("px")!=-1){maxoke=-200;}
                if (parseFloat(tags[n].style.marginTop)<maxoke){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profmar");
                    p++;
                }
            }
            if (tags[n].style.margin){
                maxoke=-30;
                if(tags[n].style.margin.split(" ")[0].indexOf("px")!=-1){maxoke=-200;}
                if (parseFloat(tags[n].style.margin)<maxoke){
                    if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                        attr=tags[n].getAttribute("style");
                        attr=attr.split("!important").join("");
                        tags[n].setAttribute("style",attr);
                    }
                    tags[n].classList.add("profmar");
                    p++;
                }
            }
            if (tags[n].style.cursor){
                if (tags[n].getAttribute("style").indexOf("!important")!=-1){
                    attr=tags[n].getAttribute("style");
                    attr=attr.split("!important").join("");
                    tags[n].setAttribute("style",attr);
                }
                tags[n].classList.add("profcur");
                p++;
            }
        }
        document.getElementById("clean").style.display="none";
        if (p!==0){
            document.getElementById("clean").style.display="block";
            cleanup();
        }
    }

	function cleancookie(){
        if (localStorage.getItem("pclean")){
            localStorage.removeItem("pclean");
		}else{
            localStorage.setItem("pclean", "foo");
        }
		cleanup();
	}

    function cleanup(){
        var claction=!localStorage.getItem("pclean");
        if (claction){
            document.getElementById("clean").innerHTML= "干净的个人资料 = ON&nbsp;";
            var style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.id="profstyle";
            style.textContent = ".profpos {display:none !important} .profmar {margin-top:0px !important;} .profcur{cursor:default !important }";
            document.getElementsByTagName('head')[0].appendChild(style);
        }else{
            document.getElementById("clean").innerHTML= "干净的个人资料 = OFF";
            if (document.getElementById("profstyle")!=null){
                document.getElementById("profstyle").remove();
            }
        }
    }

    function linkfix(){
        var bioarea= document.getElementsByClassName('BioContents')[0];
        var tags = bioarea.getElementsByTagName('a');
        for (i=0; i<tags.length; i++){
            if (tags[i].href.indexOf("campaign=")!=-1){
                tags[i].href=tour;
            }
            if (tags[i].href.indexOf('?url=') != -1){
                var linkout=decodeURIComponent(tags[i].href).split("?url=")[1];
                if (linkout.indexOf("campaign=")!=-1){
                    linkout=tour;
                }
                tags[i].href=linkout;
            }
        }
        if(document.querySelector('[data-testid="sign-up-tab"]')){
            document.querySelector('[data-testid="sign-up-tab"]').href=tour;
        }
    }

    function collectiondownload(){
        document.getElementById("main").addEventListener("click", collectiondownload2);
        collectiondownload2();
    }

    function collectiondownload2(){
        setTimeout(function(){collectiondownload3();}, 2000);
    }

    function collectiondownload3(){
        if(document.getElementsByTagName("video").length>0){
            if(document.getElementsByTagName("video")[0].src){
                if(!document.getElementById("link")){
                    var newelem=document.createElement('a');
                    newelem.id="link";
                    newelem.style.position="relative";
                    newelem.style.left="250px";
                    newelem.style.top="5px";
                    newelem.href= document.getElementsByTagName("video")[0].src;
                    newelem.target="_blank";
                    newelem.innerHTML="Right click, save to disk.";
                    newelem.style.backgroundColor="white";
                    newelem.style.marginLeft="20px";
                    document.getElementsByClassName("createdAt")[0].parentNode.appendChild(newelem);
                }
            }
        }
    }

    function savedprvdownload(){
        setTimeout(function(){savedprvdownload3();}, 2000);
    }

    function savedprvdownload3(){
        var newelem=document.createElement('a');
        newelem.href= document.getElementsByTagName("video")[0].src;
        newelem.target="_blank";
        newelem.innerHTML="Right click, save to disk.<br>";
        newelem.style.backgroundColor="white";
        newelem.style.marginLeft="20px";
        document.getElementById("tsRecordedShowPlayer").appendChild(newelem);
    }

     function passwordfollow(){
         setTimeout(function(){
             var unfollow=document.querySelector('[data-testid="unfollow-button"]');
             var follow=document.querySelector('[data-testid="follow-button"]');
             if (unfollow.style.display=="none"){
                 follow.parentNode.parentNode.style.display="block";
                 follow.style.display="block";
             }
             unfollow.addEventListener("click", function(){setTimeout(function(){document.location.reload();}, 500);} );
             follow.addEventListener("click", function(){setTimeout(function(){document.location.reload();}, 500);} );
         }, 1000);
         var newelem=document.createElement('div');
         newelem.className="BioContents";
         var newtable=document.createElement('table');
         newelem.appendChild(newtable);
         var newtr=document.createElement('tr');
         newtable.appendChild(newtr);
         newtr=document.createElement('tr');
         newelem.style.position="relative";
         newelem.style.float="left";
         newtable.appendChild(newtr);
         document.getElementsByClassName("defaultColor")[0].appendChild(newelem);
         wprof ("DM:","<a href='https://chaturbate.com/dm/"+roomname+"/' id='dmpop'>Open window</a>");
         wprof("Video:",'<div id="rstatus"></div>');
         wprof("Video status:","<a href=# id='hls'>Update status</a>");
         wprof("Check:","Off <input type='range' id='pwalrm' min=0 max=1 value=0 style='width: 35px;height:auto;cursor: pointer'> On || Enter the room if you get acces.");
         document.getElementById("pwalrm").addEventListener("change",setpwalrm);
         getnewhls(true,false);
         document.getElementById("hls").addEventListener("click",function(){getnewhls(true,true);});
         document.getElementById("dmpop").addEventListener("click", function(event){opendm3(this);event.stopPropagation();event.preventDefault();return false;});
         getnotes();
         document.getElementsByClassName("tooltip")[0].innerHTML="If follow does not work this room banned your region or gender.";
         document.getElementById("tsContent").style.minHeight="400px";
    }

    function setpwalrm(){
        if (document.getElementById("pwalrm").value==0){return;}
        if (alarmrun==false){
            alarmrun=true;
            checkpwalarm();
        }
    }

    function checkpwalarm(){
        setTimeout(function(){
            if(document.getElementById("pwalrm").value==0){alarmrun=false;return;}
            var url="https://chaturbate.com/api/chatvideocontext/"+roomname+"/";
            fetch(url,{credentials: "same-origin"}).then(
            function(response) {
                if (response.status == 200){
                    forceopen(roomname);
                }
            });
        },60000);
    }

    function forceopen(room){
        if (document.hasFocus()){
            document.location.href="https://chaturbate.com/"+room;
        }
        var mywindow=window.open("https://chaturbate.com/"+room,"");
        if(mywindow!=null){
            mywindow.focus();
            window.close();
        }
        document.location.href="https://chaturbate.com/"+room;
    }

    function opendm3(that){
       window.open(that.href,'DMpop','toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=yes,width=800,height=800');
    }

    function bannedroom(){
        var url="https://chaturbate.com/api/chatvideocontext/"+roomname+"/";
        fetch(url,{method: 'HEAD', credentials: "omit"}).then(
            function(response) {
                if (response.status !== 200){
                    noaccess=true;
                    setprofile();
                    return;
                }else{
                    document.location.href='https://chaturbate.com/p/'+yourname+'?tab=bio&model='+roomname;
                    return;
                }
            });
    }

    function setprofile(){
        document.getElementsByClassName("BaseRoomContents")[0].style.minHeight="505px";
        var newelem=document.createElement('div');
        newelem.style.width="100%";
        newelem.style.height="1px";
        newelem.setAttribute('data-testid', 'room-bio-tab-contents');
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        newelem=document.createElement('div');
        newelem.style.margin="14px 14px";
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        newelem=document.createElement('div');
        newelem.className="BioContents";
        var newtable=document.createElement('table');
        newelem.appendChild(newtable);
        var newtr=document.createElement('tr');
        newtr.id="vcontr";
        newtable.appendChild(newtr);
        newtr=document.createElement('tr');
        newtable.appendChild(newtr);
        document.getElementsByClassName("BaseRoomContents")[0].appendChild(newelem);
        banimgsize(-1);
    }

    function banimgsize(sizeone){
        var url="https://jpeg.live.mmcdn.com/minifwap/"+roomname+".jpg";
        fetch(url,{
            cache: "no-cache",
            credentials: "omit",
            referrerPolicy: "no-referrer"}).then(
            function(response){
                var imgsize=response.headers.get("content-length");
                if (sizeone==-1){
                    setTimeout(function(){banimgsize(imgsize);}, 1000);
                    return;
                }
                if (sizeone!=imgsize){banonline();return;}
                if ((imgsize>4800)&&(imgsize<4850)){banoffline();return;}
                banwasonline();
            });
    }

    function banonline(){
        makevidcontrol();
        wprof("","<a href=# id=moreinfo>Click here to search for more info.</a>");
        document.getElementById("moreinfo").addEventListener("click",moreinfo);
        putinlinks();
        if(login){
            getnotes();
        }
        room_status="public";
        videoSrc=localStorage.getItem("defaultplaylist").replace("XXX",roomname);
        createimage();
    }

    function banwasonline(){
        putinlinks();
        if(login){
            getnotes();
        }
        room_status="offline";
        createimage();
    }

    function banoffline(){
        putinlinks();
        if(login){
            getnotes();
        }
    }

    function putinlinks(){
        wprof("Find:","<a href='https://camgirlfinder.net/models?m="+roomname+"&p=cb&g=a' rel=noreferrer target='_new'>Open in camgirlfinder</a>");
        wprof("Statistics:","<a href='https://statbate.com/search/1/"+roomname+"' rel=noreferrer target='_new'>Open in statbate</a>");
        wprof("Schedule:","<a href='https://www.cbhours.com/user/"+roomname+".html' rel=noreferrer target='_new'>Open in cbhours</a>");
        wprof("Video Url:","<a href=# id='hls'>Click to copy to clipboard/Update status</a>");
        document.getElementById("hls").addEventListener("click",function(){getnewhls(true,true);});
        wprof("Video:",'<div id="rstatus"></div>');
        getnewhls(true,false);
    }

    function moreinfo(){
        document.getElementById("moreinfo").removeEventListener("click",moreinfo);
        document.getElementById("moreinfo").innerHTML="Please wait....";
        var dataurl="https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=b0P2s";
        fetch(dataurl,{credentials: "omit",referrerPolicy: "no-referrer"}).then(
            function(response) {
                if (response.status !== 200){
                    document.getElementById("moreinfo").innerHTML="Error reading roomlist.";
                    return;
                }
                response.json().then(function(data) {
                    for (n=0; n<data.length; n++){
                        if (data[n].username==roomname){
                            wprof("Gender:",data[n].gender);
                            wprof("Given location:",data[n].location);
                            wprof("Country flag:",data[n].country);
                            wprof("Room topic:","<div style='width:450px;height:auto'>"+data[n].room_subject+"</div>");
                            wprof("Spoken languages:",data[n].spoken_languages);
                            wprof("Name:", data[n].display_name);
                            wprof("Birthday:",data[n].birthday);
                            wprof("Age:",data[n].age);
                            wprof("Time online:",toTime(data[n].seconds_online));
                            wprof("Users in room:",data[n].num_users);
                            wprof("Followers:",data[n].num_followers);
                            document.getElementById("moreinfo").innerHTML="";
                            data="";
                            break;
                        }
                    }
                    if (n==data.length){
                        document.getElementById("moreinfo").innerHTML="No information found, user may no longer be in public or opt-out.";
                        data="";
                    }
                });
            });

    }
    function toTime(seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8).replace(":","h").replace(":","m")+"s";
    }

	function createCookie(name,value,days,domain){
        var expires="";
        if (domain){
            domain=";domain=."+domain;
        }else{
            domain = "";
        }
        if (days) {
            var date = new Date();
            date.setTime(date.getTime()+(days*24*60*60*1000));
            expires = "; expires="+date.toGMTString();
        }
        document.cookie = name+"="+value+expires+"; path=/"+domain;
	}

	function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' '){
                c = c.substring(1,c.length);
            }
            if (c.indexOf(nameEQ) === 0){
                return c.substring(nameEQ.length,c.length);
            }
        }
        return null;
	}

	function eraseCookie(name,domain){
        createCookie(name,"",-1,domain);
	}

    function rebuildbio(){
        referenceNode=document.getElementsByClassName("BioContents")[0].getElementsByTagName("table")[0];
        document.querySelector('[data-paction="RoomTabs"]').remove();
        removebionode();
        document.getElementsByClassName("editbio")[0].remove();
        document.getElementsByClassName("tooltip defaultTooltipColor")[0].remove();
        document.querySelector('[data-paction-name="ActiveRoom"]').innerHTML=tocap(roomname) + "'s Bio";
        document.querySelector('[data-paction-name="ActiveRoom"]').title=tocap(roomname) + "'s Bio";
        document.title=tocap(roomname) + "'s Bio";
        ctitle=document.title;
        getbiodata(true);
    }

    function tocap(name){
        if (!name){return "";}
        return name.charAt(0).toUpperCase()+name.slice(1);
    }

    function getbiodata(anon){
        var cred="same-origin";
        if (!anon){cred="omit";}
        var url="https://chaturbate.com/api/biocontext/"+roomname;
        fetch(url,{ credentials: cred,referrer: "https://chaturbate.com/"+roomname+"/"}).then(
            function(response) {
                if (response.status !== 200){
                    if (anon){
                        getbiodata(false);
                        return;
                    }
                    document.location.href="https://chaturbate.com/"+roomname+"/";
                    return;
                }
                response.json().then(function(data) {
                    biodata=data;
                    buildbio();
                    afterrebuild();
                });
            });
    }

    function removebionode(){
        if (referenceNode.getElementsByTagName("tr")[3]){
            referenceNode.getElementsByTagName("tr")[3].remove();
            removebionode();
        }
    }

    function buildbio(){
        referenceNode.getElementsByTagName("tr")[2].getElementsByTagName("span")[0].innerHTML="Real Name:";
        referenceNode.getElementsByTagName("tr")[2].getElementsByTagName("td")[1].innerHTML=tocap(biodata.real_name);

        var newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="Followers:";
        newnode.getElementsByTagName("td")[1].innerHTML=biodata.follower_count;
        referenceNode.appendChild(newnode);

        if (biodata.display_birthday){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Birth Date:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.display_birthday;
            referenceNode.appendChild(newnode);
        }
        if (biodata.display_age){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Age:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.display_age;
            referenceNode.appendChild(newnode);
        }

            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="I Am";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.sex)+" "+tocap(biodata.subgender);
            referenceNode.appendChild(newnode);

            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Interested In:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.interested_in[0])+" "+tocap(biodata.interested_in[1])+" "+tocap(biodata.interested_in[2])+" "+tocap(biodata.interested_in[3]);
            referenceNode.appendChild(newnode);

        if (biodata.location){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Location:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.location);
            referenceNode.appendChild(newnode);
        }
        if (biodata.time_since_last_broadcast){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Last Broadcast:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.time_since_last_broadcast;
            referenceNode.appendChild(newnode);
        }
        if (biodata.languages){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Language(s):";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.languages);
            referenceNode.appendChild(newnode);
        }
        if (biodata.body_type){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Body Type:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.body_type);
            referenceNode.appendChild(newnode);
        }
        if (biodata.smoke_drink){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Smoke / Drink:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.smoke_drink);
            referenceNode.appendChild(newnode);
        }
        if (biodata.body_decorations){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Body Decorations:";
            newnode.getElementsByTagName("td")[1].innerHTML=tocap(biodata.body_decorations);
            referenceNode.appendChild(newnode);
        }
        if (biodata.social_medias[0]){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Social Media:";
            newnode.getElementsByTagName("td")[1].innerHTML="Available on cam page.";
            referenceNode.appendChild(newnode);
        }
        if (biodata.photo_sets[0]){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Photo/video:";
            newnode.getElementsByTagName("td")[1].innerHTML="<a href='https://chaturbate.com/photo_videos/photoset/detail/"+roomname+"/"+biodata.photo_sets[0].id+"' target=_blank> Open in new tab.</a>";
            referenceNode.appendChild(newnode);
        }
        newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
        newnode.getElementsByTagName("span")[0].innerHTML="About Me:";
        newnode.getElementsByTagName("td")[1].innerHTML=biodata.about_me;
        referenceNode.appendChild(newnode);
        if (biodata.wish_list){
            newnode=referenceNode.getElementsByTagName("tr")[2].cloneNode(true);
            newnode.getElementsByTagName("span")[0].innerHTML="Wish List:";
            newnode.getElementsByTagName("td")[1].innerHTML=biodata.wish_list;
            referenceNode.appendChild(newnode);
        }
    }

    function getnewhls(anon,clicked,next){
        if (hlsfetching==true){return;}
        hlsfetching=true;
        var cred="same-origin";
        if (!anon){cred="omit";}
        var oldmsg=document.getElementById("hls").innerHTML;
        if(clicked){
            document.getElementById("hls").innerHTML="Copying....";
        }else{
            document.getElementById("hls").innerHTML="Checking....";
        }
        var url="https://chaturbate.com/get_edge_hls_url_ajax/";
        var csrftoken= readCookie("csrftoken");
        var edge=localStorage.getItem("defaultplaylist").split("/")[2];
        var data = new FormData();
        data.append( "room_slug", roomname );
        if (next==1){
            data.append( "bandwidth", "high" );
            data.append( "current_edge", edge );
            data.append( "exclude_edge", "" );
        }
        data.append( "csrfmiddlewaretoken", csrftoken );
        fetch(url,{
            credentials: cred,
            method: "POST",
            headers: {
                'x-csrftoken': csrftoken,
                'x-requested-with': 'XMLHttpRequest'
            },
            referrer: "https://chaturbate.com/"+roomname+"/",
            body: data
        }).then(function(response){
            if (response.status !== 200) {
                if (anon){
                    hlsfetching=false;
                    getnewhls(false,clicked,next);
                    return;
                }
                if(clicked){navigator.clipboard.writeText(localStorage.getItem("defaultplaylist").replace("XXX",roomname));}
                document.getElementById("rstatus").innerHTML="Error";
                document.getElementById("hls").innerHTML=oldmsg;
                hlsfetching=false;
                return;
            }
            response.json().then(function(data){
                if(data.url !=""){
                    document.getElementById("rstatus").innerHTML=data.room_status;
                    if(clicked){navigator.clipboard.writeText(data.url);}
                    localStorage.setItem("defaultplaylist",data.url.split("?")[0].replace(roomname,"XXX"));
                }else{
                    document.getElementById("rstatus").innerHTML=data.room_status;
                    if(clicked){navigator.clipboard.writeText(localStorage.getItem("defaultplaylist").replace("XXX",roomname));}
                }
                document.getElementById("hls").innerHTML=oldmsg;
                roomstatus=data.room_status;
                room_status=data.room_status;
                videoSrc=data.url;
                if (noaccess&&(data.url=="")){videoSrc=localStorage.getItem("defaultplaylist").replace("XXX",roomname);}
                hlsfetching=false;
                if (next==1){createimage();}
                if (next==2){testalarm2();}
            });
        });
    }

})();