// ==UserScript==
// @name           Netflix Audio Downloader
// @description    Download audio from Netflix
// @namespace      https://greasyfork.org/users/572942-stegner
// @version        0.1
// @author         PGNR5 (kinda)
// @license        MIT; https://opensource.org/licenses/MIT
// @match          https://www.netflix.com/*
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/437915/Netflix%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/437915/Netflix%20Audio%20Downloader.meta.js
// ==/UserScript==
 
(function(open) {
    'use strict';
    var debug = (location.hash=="#debug");
    debuglog("Script loaded : Disney+ Audio Downloader");
 
    function init(){
        debuglog("Document state : "+document.readyState);
        if (document.readyState == "complete" || document.readyState == "loaded"){
            start();
            debuglog("Already loaded");
        }
        else {
            if (window.addEventListener) {
                window.addEventListener("load", start, false);
                debuglog("Onload method : addEventListener");
            } else if (window.attachEvent) {
                window.attachEvent("onload", start);
                debuglog("Onload method : attachEvent");
            } else {
                window.onload = start;
                debuglog("Onload method : onload");
            }
        }
        document.listen=true;
    }
 
    function start(){
        debuglog("start");
        if (typeof document.initaudio !== "undefined") {
            document.initaudio();
        }
        if (typeof document.initsub !== "undefined") {
            document.initsub();
        }
        listensend();
        document.handleinterval = setInterval(buttonhandle,100);
    }
 
    if(!document.listen){
        init();
    }
 
    document.initaudio = function(){
        debuglog("initaudio");
        document.audios = new Array();
        document.content = new Uint8Array();
        document.baseurl="";
        document.m3u8found=false;
        document.wait=false;
        document.downloading=false;
        document.filename="";
        document.episode="";
        document.audioid=null;
 
        // Add download icon
        document.styleSheets[0].addRule('#audioTrackPicker > div:before','content:"";color:#fff;padding-right:35px;padding-top:2px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAIGNIUk0AAHonAACAgwAA+mQAAIDSAAB2hgAA7OkAADmeAAAV/sZ+0zoAAAE4SURBVHja1JS7LkRRFIa/M6aYRCEuCUEUgihFBolGVGqiFY1ConfpNB7CiygUGm8hOiMukwiCCMl8mj2xc5yZM8M0/mTlrLP2v75zydo7UclRL3AGlIAl4L6ZuUC+5oEZYBoo55lbAdai/LPTwFongG3pfwI3gZ3ovhjlXVG+BWz/6FbjKPuto1CbjWoLobYf1RZjRho4pt5F5g11QK2F6FFXo/UXdbwZEHVQvY2aztWPECdR/TkNawREHUpB03pSJ7J6Cf9gL3xOvDiiXmfAHtSplLek7qorqI/BeJjxxFG1kgNDPQjrn4VoLPozRqgCzAGXwFXILzJ8w+H6XgRegW7grcGs3gCTOfP8UgfGg139wwapxrugDl0H+oCkTZjAcsiTxBaO7HZUBI6BtfCmv4Un4aw8/RoA7wq6AO4uOhAAAAAASUVORK5CYII=) no-repeat right;width:20px;height:18px;position:absolute;top:6px;right:10px;opacity:0.6;cursor:pointer;');
        document.styleSheets[0].addRule('#audioTrackPicker > div:hover:before','opacity:1;');
    }
 
    // Catch M3U8 files
    function listensend(){
        debuglog("listensend");
 
        var newOpen = function(...args) {
            if(!document.m3u8found && args.length>=2){
                if(args[1].indexOf(".m3u8")>0 && document.url!=args[1]) {
                    // m3u8 url
                    debuglog("m3u8 found : "+args[1]);
                    document.url = args[1];
                    document.langs = [];
                    document.baseurl=document.url.substring(0,document.url.lastIndexOf('/')+1);
                    document.m3u8found=true;
                    getpagecontent(m3u8loaded,document.url);
                }
            }
 
            switch(args.length){
                case 1:
                    open.call(this,args[0]);
                    break;
                case 2:
                    open.call(this,args[0],args[1]);
                    break;
                case 3:
                    open.call(this,args[0],args[1],args[2]);
                    break;
            }
        }
 
        if(typeof unsafeWindow !== "undefined"){
            debuglog("Window state : unsafe");
            let define = Object.defineProperty;
            let exported = exportFunction(newOpen, window);
            define(unsafeWindow.XMLHttpRequest.prototype, "open", {value: exported});
        }
        else {
            debuglog("Window state : safe");
            XMLHttpRequest.prototype.open = newOpen;
        }
    }
 
    function m3u8loaded(response) {
        debuglog("m3u8loaded");
        if (typeof document.m3u8sub !== "undefined") {
            document.m3u8sub(response);
        }
        if (typeof document.m3u8audio !== "undefined") {
            document.m3u8audio(response);
        }
    }
 
    document.m3u8audio = function(response){
        var lines = response.split('#');
        var found = false;
        if(lines[2].indexOf("EXT-X-INDEPENDENT-SEGMENTS")==0){
            // Audio tracks list
            var quality=null;
            lines.forEach(function(line) {
                if(line.indexOf('TYPE=AUDIO')>0) {
                    // audio infos
                    if(line.indexOf('GROUP-ID="eac-3"')>0 && (quality==null||quality=="eac-3")){
                        quality="eac-3";
                        document.audios.push(linetoarray(line));
                        debuglog("Audio found : "+document.audios[document.audios.length-1].NAME);
                    }
                    else if(line.indexOf('GROUP-ID="aac-128k"')>0 && (quality==null||quality=="aac-128k")){
                        quality="aac-128k";
                        document.audios.push(linetoarray(line));
                        debuglog("Audio found : "+document.audios[document.audios.length-1].NAME);
                    }
                    else if(line.indexOf('GROUP-ID="aac-64k"')>0 && (quality==null||quality=="aac-64k")){
                        quality="aac-64k";
                        document.audios.push(linetoarray(line));
                        debuglog("Audio found : "+document.audios[document.audios.length-1].NAME);
                    }
                }
            });
        }
        else if(response.indexOf(".mp4a")>0) {
            downloadmp4a(response);
        }
        
    }
 
    function downloadmp4a(m3u8data){
        debuglog("downloadmp4a");
        var lines = m3u8data.split(/\r?\n/g);
        var mapfound=false;
        var percent;
        var i=0;
        document.downloadInterval = setInterval(function () {
            var line = lines[i];
            var url=null;
            if(line!=null){
                var uri = document.audios[document.audioid].URI;
                if(line.indexOf("map.mp4a")>0 && !mapfound){
                    // Get mp4a map
                    debuglog("Download map");
                    url = document.baseurl+uri.substring(0,uri.lastIndexOf("/")+1)+line.substring(line.indexOf('"')+1,line.lastIndexOf('"'));
                    mapfound=true;
                }
                else if(line.indexOf("_000.mp4a")>0 && line.indexOf("DUB_CARD")<0){
                    // Get mp4a data
                    url = document.baseurl+uri.substring(0,uri.lastIndexOf("/")+1)+line;
                }
 
                if(url!=null && !document.downloading){
                    // Download file
                    getpagecontent(mp4aloaded,url,true);
                    document.downloading=true;
                    i++;
                }
                else if(url==null){
                    // Skip line
                    i++;
                }
 
                if(percent!=Math.round((i/lines.length)*100)){
                    percent=Math.round((i/lines.length)*100);
                    document.styleSheets[0].addRule('#audioTrackPicker > div:nth-child('+(document.audioid+1)+'):before','content:"'+percent+'%";');
                }
            }
            else {
                // Download finished
                clearInterval(document.downloadInterval);
                document.styleSheets[0].addRule('#audioTrackPicker > div:nth-child('+(document.audioid+1)+'):before','content:"";');
                exportblob(document.content, 'video/mp4');
                document.content=new Uint8Array();
                document.wait=false;
            }
        },10);
    }
 
 
    function mp4aloaded(response) {
        debuglog("mp4aloaded");
        document.downloading=false;
        document.content=appendbuffer(document.content,response);
    }
 
    function linetoarray(line) {
        var result = new Array();
        var values = line.split(',');
        values.forEach(function(value) {
            var data = value.replace(/\r\n|\r|\n/g,'').split('=');
            if(data.length>1) {
                var key = data[0];
                var content = data[1].replace(/"/g,'');
                result[key]=content;
            }
        });
        return result;
    }
 
    function buttonhandle() {
        var buttons = document.getElementsByClassName("control-icon-btn");
        if(buttons.length>0) {
            if (typeof document.clickhandlesub !== "undefined") {
                document.clickhandlesub();
            }
            if (typeof document.clickhandleaudio !== "undefined") {
                document.clickhandleaudio();
            }
 
            document.filename = document.getElementsByClassName("title-field")[0].innerText;
            if(document.getElementsByClassName("subtitle-field").length>0) {
                document.episode = document.getElementsByClassName("subtitle-field")[0].innerText
            }
        }
 
        if(document.oldlocation!=window.location.href&&document.oldlocation!=null) {
            // location changed
            document.m3u8found=false;
            document.audios = [];
            document.langs = [];
        }
 
        document.oldlocation=window.location.href;
    }
 
    document.clickhandleaudio = function() {
        var picker = document.getElementsByClassName("options-picker audio-track-picker");
        picker[0].childNodes.forEach(function(child) {
            var element = child.childNodes[0];
            var lang = element.childNodes[1].innerHTML;
            if(child.onclick==null) {
                child.onclick = selectaudio;
            }
        });
    }
 
    function selectaudio(e) {
        debuglog("selectaudio");
        var width = this.offsetWidth;
        // Check click position
        if(e.layerX>=width-30&&e.layerX<=width-10&&e.layerY>=5&&e.layerY<=25){
            // Download audio
            download(this.childNodes[0].childNodes[1].innerHTML);
            // Cancel selection
            return false;
        }
    }
 
    function download(langname) {
        if(!document.wait){
            debuglog("Download audio : "+langname);
            var count=0;
            document.audios.forEach(function(audio) {
                if(audio.NAME==langname) {
                    document.audioid=count;
                    document.ad=(audio.NAME.indexOf("[Audio Description]")>0);
                    getpagecontent(m3u8loaded,document.baseurl+audio.URI);
                    document.wait=true;
                }
                count++;
            });
            if(count==0){
                alert("An error has occurred, please reload the page.");
            }
        }
        
    }
 
    function getpagecontent(callback,url,binary) {
        debuglog("Downloading : "+url);
        var http=new XMLHttpRequest();
        http.open("GET", url, true);
        if(binary){
            http.responseType = "arraybuffer";
        }
        http.onloadend = function() {
            if(http.readyState == 4 && http.status == 200) {
                if(binary){
                    callback(http.response);
                }
                else {
                    callback(http.responseText);
                }
            }
            else if (http.status === 404) {
                debuglog("Not found");
                callback("");
            }
            else {
                debuglog("Unknown error, retrying");
                setTimeout(function () { getpagecontent(callback,url,binary); },100);
            }
        }
        http.send();
    }
 
    function appendbuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp;
    };
 
    // Save file as arraybuffer
    function exportblob(data, mimeType) {
        debuglog("exportblob");
        var blob, url;
        var output = document.filename;
        if(document.episode!="") {
            output+= " - "+document.episode.replace(':','');
        }
        output += "."+document.audios[document.audioid].LANGUAGE;
        if(document.ad){
            output +=".ad";
        }
        output += ".mp4";
 
 
        blob = new Blob([data], {
            type: mimeType
        });
        url = window.URL.createObjectURL(blob);
        downloadurl(url, output);
        setTimeout(function() {
            return window.URL.revokeObjectURL(url);
        }, 1000);
    };
 
    function downloadurl(data, fileName) {
        debuglog("Save audio");
        var a;
        a = document.createElement('a');
        a.href = data;
        a.download = fileName;
        document.body.appendChild(a);
        a.style = 'display: none';
        a.click();
        a.remove();
    };
 
    function debuglog(message){
        if(debug){
            console.log("%c [debug] "+message, 'background: #222; color: #bada55');
        }
    }
})(XMLHttpRequest.prototype.open);