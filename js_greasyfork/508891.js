// ==UserScript==
// @name         Stream recorder for adult cam sites that do not support HLS
// @namespace    Everywhere
// @version      1.0.8
// @description  Record stripchat, livejasmin and other cam sites that do not full support HLS/m3u8
// @author       Ladroop
// @license	     MIT
// @copyright    2025 Ladroop
// @match        https://*.stripchat.com/*
// @match        https://www.livejasmin.com/*
// @match        https://www.xcams.com/*
// @match        https://www.secretfriends.com/*
// @match        https://www.manyvids.com/*
// @match        https://www.soulcams.com/*
// @match        https://cameraprive.com/*
// @match        https://showup.tv/*
// @noframes
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508891/Stream%20recorder%20for%20adult%20cam%20sites%20that%20do%20not%20support%20HLS.user.js
// @updateURL https://update.greasyfork.org/scripts/508891/Stream%20recorder%20for%20adult%20cam%20sites%20that%20do%20not%20support%20HLS.meta.js
// ==/UserScript==


(function() {
    'use strict';

   var recbutton='<svg fill="#000000" version="1.1" id="recbutton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="0 0 50 50" xml:space="preserve" style="cursor:pointer;display:inline-block">'+
       '<g><g>'+
		'<path d="M0,18.961h4.842V6.052c0-0.446,0.362-0.807,0.807-0.807H18.56V0.404H5.649C2.535,0.404,0,2.939,0,6.053V18.961z"/>'+
		'<path d="M39.539,0.403h-12.91v4.841h12.91c0.445,0,0.807,0.362,0.807,0.807v12.91h4.842V6.052    C45.189,2.938,42.654,0.403,39.539,0.403z"/>'+
		'<path d="M4.842,39.136V26.225H0v12.911c0,3.113,2.535,5.648,5.649,5.648H18.56v-4.842H5.649    C5.204,39.942,4.842,39.58,4.842,39.136z"/>'+
		'<path d="M40.346,39.136c0,0.446-0.362,0.807-0.807,0.807H26.628v4.842h12.91c3.115,0,5.648-2.536,5.648-5.65V26.225h-4.842    L40.346,39.136L40.346,39.136z"/>'+
        '<circle fill="#FF0000" cx="22.594" cy="22.594" r="6.455"/>'+
        '</g></g></svg>';


    var stopbutton='<svg fill="#000000" version="1.1" id="stopbutton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="0 0 50 50" xml:space="preserve" style="cursor:pointer;display:inline-block">'+
        '<g><g>'+
		'<path d="M0,18.961h4.842V6.052c0-0.446,0.362-0.807,0.807-0.807H18.56V0.404H5.649C2.535,0.404,0,2.939,0,6.053V18.961z"/>'+
		'<path d="M39.539,0.403h-12.91v4.841h12.91c0.445,0,0.807,0.362,0.807,0.807v12.91h4.842V6.052    C45.189,2.938,42.654,0.403,39.539,0.403z"/>'+
		'<path d="M4.842,39.136V26.225H0v12.911c0,3.113,2.535,5.648,5.649,5.648H18.56v-4.842H5.649    C5.204,39.942,4.842,39.58,4.842,39.136z"/>'+
		'<path d="M40.346,39.136c0,0.446-0.362,0.807-0.807,0.807H26.628v4.842h12.91c3.115,0,5.648-2.536,5.648-5.65V26.225h-4.842    L40.346,39.136L40.346,39.136z"/>'+
        '<rect fill="#00FF00" x="15.5" y="15.5"  width="15" height="15"/>'+
        '</g></g></svg>';

    var pauzebutton='<svg fill="#000000" version="1.1" id="pauzebutton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="0 0 50 50" xml:space="preserve" style="cursor:pointer;display:none">'+
        '<g><g>'+
		'<path d="M0,18.961h4.842V6.052c0-0.446,0.362-0.807,0.807-0.807H18.56V0.404H5.649C2.535,0.404,0,2.939,0,6.053V18.961z"/>'+
		'<path d="M39.539,0.403h-12.91v4.841h12.91c0.445,0,0.807,0.362,0.807,0.807v12.91h4.842V6.052    C45.189,2.938,42.654,0.403,39.539,0.403z"/>'+
		'<path d="M4.842,39.136V26.225H0v12.911c0,3.113,2.535,5.648,5.649,5.648H18.56v-4.842H5.649    C5.204,39.942,4.842,39.58,4.842,39.136z"/>'+
		'<path d="M40.346,39.136c0,0.446-0.362,0.807-0.807,0.807H26.628v4.842h12.91c3.115,0,5.648-2.536,5.648-5.65V26.225h-4.842    L40.346,39.136L40.346,39.136z"/>'+
        '<rect fill="#111111" x="10" y="10"  width="10" height="25"/>'+
        '<rect fill="#111111" x="25" y="10"  width="10" height="25"/>'+
        '</g></g></svg>';

    var pauzerecbutton='<svg fill="#000000" version="1.1" id="pauzerecbutton" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="50px" height="50px" viewBox="0 0 50 50" xml:space="preserve" style="cursor:pointer;display:none">'+
        '<g><g>'+
		'<path d="M0,18.961h4.842V6.052c0-0.446,0.362-0.807,0.807-0.807H18.56V0.404H5.649C2.535,0.404,0,2.939,0,6.053V18.961z"/>'+
		'<path d="M39.539,0.403h-12.91v4.841h12.91c0.445,0,0.807,0.362,0.807,0.807v12.91h4.842V6.052    C45.189,2.938,42.654,0.403,39.539,0.403z"/>'+
		'<path d="M4.842,39.136V26.225H0v12.911c0,3.113,2.535,5.648,5.649,5.648H18.56v-4.842H5.649    C5.204,39.942,4.842,39.58,4.842,39.136z"/>'+
		'<path d="M40.346,39.136c0,0.446-0.362,0.807-0.807,0.807H26.628v4.842h12.91c3.115,0,5.648-2.536,5.648-5.65V26.225h-4.842    L40.346,39.136L40.346,39.136z"/>'+
        '<rect fill="#111111" x="10" y="10"  width="10" height="25"><animate attributeName="fill" values="#ff0000;#111111" begin="0s" dur="2s" calcMode="discrete" repeatCount="indefinite"/></rect>'+
        '<rect fill="#111111" x="25" y="10"  width="10" height="25"><animate attributeName="fill" values="#ff0000;#111111" begin="0s" dur="2s" calcMode="discrete" repeatCount="indefinite"/></rect>'+
        '</g></g></svg>';

    var status="stop";
    var count=0;
    var recName="";
    var location=document.location.href;
    var site=location.split("/")[2].split(".");
    site=site[site.length-2];

    var mediaRecorder;
    var recordedBlobs;
    var stream;
    var video;
    var blob;
    var vidObj=0;
    var observer= new MutationObserver(pagechange1);
    var wtime=false;
    var interval=false;
    var firefox=false;
	var starttime="";


    pagechange();

    function pagechange1(){
        if (wtime){return;}
        wtime=true;
        setTimeout(function(){
            if (document.location.href==location){wtime=false;return;}
            observer.disconnect();
            wtime=false;
            if (status=="rec"){stoprecord();}
            location=document.location.href;
            pagechange();
       },100);
    }

    function pagechange(){
        if (document.getElementById("popitup1")){
            document.getElementById("popitup1").remove();
        }
        getrecname();
    }

    function getrecname(){
        var name="video";
        if (site=="livejasmin"){
            observer.observe(document.body,{attributes: true});
            if (location.indexOf("chat")==-1){return;}
            name=location.split("/")[location.split("/").length-1];
            vidObj=1;
        }
        if (site=="stripchat"){
            name=location.split("/")[3].split("?")[0];
            observer.observe(document.head,{subtree: true, characterData: true, childList: true });
        }
        if (site=="showup"){
            name=location.split("/")[3];
            if(name==""){return;}
        }
        if (site=="secretfriends"){
            name=location.split("/")[4].split("?")[0];
        }
        if (site=="xcams"){
            observer.observe(document.body,{attributes: true});
            if (location.split("/")[4]!="chat"){return;}
            name=location.split("/")[5];
        }
        if (site=="manyvids"){
            if(!interval){
                setInterval(pagechange1,2000);
                interval=true;
            }
            if (location.split("/")[4]!="cam"){return;}
            name=location.split("/")[5];
        }
        if (site=="soulcams"){
            name=location.split("/")[4];
            observer.observe(document.head,{subtree: true, characterData: true, childList: true });
        }
        if (site=="cameraprive"){
            name=location.split("/")[5];
        }
        recName=site+"-"+name;
        wtime=true;
        setTimeout(findvideo,6000);
    }

    function findvideo(){
        wtime=false;
        if (document.getElementsByTagName("video").length > vidObj){
            video=document.getElementsByTagName("video")[vidObj];
            getStream();
        }
    }

    function getStream(){
        stream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
        if (!video.captureStream) {firefox=true;}
        makepopitup();
        document.getElementById("minivideo").srcObject=stream;
    }

    function startDownload() {
        blob = new Blob(recordedBlobs, {type: 'video/webm'});
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = recName+starttime+'.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(function(){
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            recordedBlobs = [];
        }, 100);
    }

    function handleDataAvailable(event) {
        msg("Recording "+count);
        count++;
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function startRecording() {
		starttime="_"+new Date().toISOString().split(".")[0]+"GMT";
        starttime=starttime.replaceAll(":","-");
        count=0;
        recordedBlobs = [];
        try {
            mediaRecorder = new MediaRecorder(stream);
        } catch (e) {
            msg("Not supported");
            status="stop";
            document.getElementById("recbutton").style.display="inline-block";
            document.getElementById("pauzebutton").style.display="none";
            document.getElementById("pauzerecbutton").style.display="none";
            setTimeout(function(){msg("Stopped");},3000);
            return;
        }
        mediaRecorder.onstop = mediaRecorderStopped;
        mediaRecorder.ondataavailable = handleDataAvailable;
        try {
            mediaRecorder.start(1000);
        } catch (e) {
            msg("Error");
            status="stop";
            document.getElementById("recbutton").style.display="inline-block";
            document.getElementById("pauzebutton").style.display="none";
            document.getElementById("pauzerecbutton").style.display="none";
            setTimeout(function(){msg("Stopped");},3000);
            return;
        }
    }

    function mediaRecorderStopped(){
        msg("Stopped");
        document.getElementById("recbutton").style.display="inline-block";
        document.getElementById("pauzebutton").style.display="none";
        document.getElementById("pauzerecbutton").style.display="none";
        status="stop";
        startDownload();
    }

    function stopRecording() {
        msg("Stopped");
        mediaRecorder.stop();
    }

    function msg(message){
        document.getElementById("message123").innerHTML=message;
    }

    function stoprecord(){
        if (status=="stop"){return;}
        status="stop";
        stopRecording();
    }

    function startrecord(){
        if (status!="stop"){return;}
        status="rec";
        document.getElementById("recbutton").style.display="none";
        document.getElementById("pauzebutton").style.display="inline-block";
        startRecording();
    }

    function pauzerecord(){
        mediaRecorder.pause();
        document.getElementById("pauzebutton").style.display="none";
        document.getElementById("pauzerecbutton").style.display="inline-block";
    }

    function resumerecord(){
        status="rec";
        mediaRecorder.resume();
        document.getElementById("pauzebutton").style.display="inline-block";
        document.getElementById("pauzerecbutton").style.display="none";
    }

    function miniunmute(){
        document.getElementById("minivideo").muted=false;
        document.getElementById("minimute").style.display="none";
    }

    function makepopitup(){
        var popstyle="color:black;z-index:100000;top:100px;left:10px;box-shadow:0px 0px 32px rgba(0, 0, 0, 0.32);border-radius:4px;border:1px solid rgb(221, 221, 221);background-color:rgb(200, 200, 200);position:fixed; display:inline-block; height: auto; width:auto; padding: 6px 0px 6px 6px;";
        var newelem=document.createElement('span');
        newelem.setAttribute("style", popstyle);
        newelem.id="popitup1";
        var newdiv=document.createElement('div');
        newdiv.style.width="100%";
        newdiv.style.height="50px";
        newdiv.innerHTML=pauzebutton+pauzerecbutton+recbutton+"&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"+stopbutton;
        newelem.appendChild(newdiv);
        newdiv=document.createElement('div');
        newdiv.style.width="100%";
        newdiv.style.height="20px";
        newdiv.style.color="black";
        newdiv.id="message123";
        newdiv.className="notranslate";
        newdiv.innerHTML="Stopped";
        newdiv.style.cursor="move";
        newdiv.addEventListener("mousedown",dragMouseDown);
        newelem.appendChild(newdiv);
        var newdiv2=document.createElement('div');
        newdiv2.style.position="relative";
        if (firefox){
            newdiv=document.createElement('div');
            newdiv.innerHTML="🔇";
            newdiv.id="minimute";
            newdiv.style.position="absolute";
            newdiv.style.zIndex="100001";
            newdiv.style.top="0px";
            newdiv.style.cursor="pointer";
            newdiv.addEventListener("click",miniunmute);
            newdiv2.appendChild(newdiv);
        }
        newdiv=document.createElement('video');
        newdiv.style.position="relative";
        newdiv.style.width="120px";
        newdiv.style.height="auto";
        newdiv.style.border="1px solid rgb(20, 20, 20)";
        newdiv.style.top="0px";
        newdiv.style.backgroundColor="black";
        newdiv.id="minivideo";
        newdiv.muted = true;
        newdiv.autoplay = true;
        newdiv.playsinline = true;
        newdiv.style.cursor="move";
        newdiv.addEventListener("mousedown",dragMouseDown);
        newdiv2.appendChild(newdiv);
        newelem.appendChild(newdiv2);
        document.getElementsByTagName("body")[0].appendChild(newelem);
        document.getElementById("recbutton").addEventListener("click",startrecord);
        document.getElementById("stopbutton").addEventListener("click",stoprecord);
        document.getElementById("pauzerecbutton").addEventListener("click",resumerecord);
        document.getElementById("pauzebutton").addEventListener("click",pauzerecord);
    }

    var pos1=0;
    var pos2=0;
    var pos3=0;
    var pos4=0;

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
        var x =parseInt(document.getElementById("popitup1").style.left);
        var y =parseInt(document.getElementById("popitup1").style.top);
        if ((pos3>=110)&&(pos3<=window.innerWidth-150)){
            document.getElementById("popitup1").style.left = (x - pos1) + "px";
        }
        if ((y-pos2>-50)&&(pos4<=window.innerHeight-20)){
            document.getElementById("popitup1").style.top = (y - pos2) + "px";
        }
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
})();