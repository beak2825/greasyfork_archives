// ==UserScript==
// @name           Disney+ Subtitles Downloader
// @name:fr        Disney+ Subtitles Downloader
// @namespace      https://greasyfork.org/users/572942-stegner
// @homepage       https://greasyfork.org/scripts/404223-disney-subtitles-downloader
// @description    Download subtitles from Disney+
// @description:fr Télécharger les sous-titres de Disney+
// @version        2.15
// @author         stegner
// @license        MIT; https://opensource.org/licenses/MIT
// @match          https://www.disneyplus.com/*
// @grant          none
// @require        https://cdn.jsdelivr.net/npm/jszip@3.5.0/dist/jszip.min.js
// @require        https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/404223/Disney%2B%20Subtitles%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/404223/Disney%2B%20Subtitles%20Downloader.meta.js
// ==/UserScript==

(function(open, send) {
    'use strict';
    var debug = (location.hash=="#debug");
    debuglog("Script loaded : Disney+ Subtitles Downloader");

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

    document.initsub = function(){
        debuglog("initsub");
        document.langs = [];
        document.segments = "";
        document.wait=false;
        document.m3u8found=false;
        document.url=null;
        document.oldlocation=null;
        document.filename="";
        document.episode="";
        document.downloadall=false;
        document.downloadid=0;
        document.waitsub=false;
        document.segid=0;
        document.vttlist=[];

        // Add download icon
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:before','content:"";color:#fff;padding-right:25px;padding-top:2px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAIGNIUk0AAHonAACAgwAA+mQAAIDSAAB2hgAA7OkAADmeAAAV/sZ+0zoAAAE4SURBVHja1JS7LkRRFIa/M6aYRCEuCUEUgihFBolGVGqiFY1ConfpNB7CiygUGm8hOiMukwiCCMl8mj2xc5yZM8M0/mTlrLP2v75zydo7UclRL3AGlIAl4L6ZuUC+5oEZYBoo55lbAdai/LPTwFongG3pfwI3gZ3ovhjlXVG+BWz/6FbjKPuto1CbjWoLobYf1RZjRho4pt5F5g11QK2F6FFXo/UXdbwZEHVQvY2aztWPECdR/TkNawREHUpB03pSJ7J6Cf9gL3xOvDiiXmfAHtSplLek7qorqI/BeJjxxFG1kgNDPQjrn4VoLPozRqgCzAGXwFXILzJ8w+H6XgRegW7grcGs3gCTOfP8UgfGg139wwapxrugDl0H+oCkTZjAcsiTxBaO7HZUBI6BtfCmv4Un4aw8/RoA7wq6AO4uOhAAAAAASUVORK5CYII=) no-repeat right;width:20px;height:20px;position:absolute;top:6px;right:10px;opacity:0.6;cursor:pointer;');
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:hover:before','opacity:1;');
        document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before','content:"All";');
    };

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

            open.call(this,...args);
        }

        var newSend = function(...args) {
            if(args[0] && args[0].match && args[0].match(/globalization/)){
                this.addEventListener('readystatechange', function(e) {
                    try {
                        document.globalization = JSON.parse(e.target.response).data.globalization;
                    } catch(e) {}
                }, false);
            }
            send.call(this,...args);
        }

        if(typeof unsafeWindow !== "undefined"){
            debuglog("Window state : unsafe");
            var define = Object.defineProperty;
            define(unsafeWindow.XMLHttpRequest.prototype, "open", {value: exportFunction(newOpen, window)});
            define(unsafeWindow.XMLHttpRequest.prototype, "send", {value: exportFunction(newSend, window)});
        }
        else {
            debuglog("Window state : safe");
            XMLHttpRequest.prototype.open = newOpen;
            XMLHttpRequest.prototype.send = newSend;
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

    document.m3u8sub = function(response){
        var regexpm3u8 =/^#.{0,}GROUP-ID="sub-main".{0,}\.m3u8"$/gm;
        var regexpvtt = /^[\w-_\/]{0,}MAIN[\w-_\/]{0,}.vtt$/gm;
        var regexpvtt2 = /^[\w-_\/]{0,}.vtt$/gm;

        if(response.indexOf('#EXT-X-INDEPENDENT-SEGMENTS')>0){
            // sub infos
            var lines = response.match(regexpm3u8);
            lines.forEach(function(line) {
                var lang = linetoarray(line);
                lang.LOCALIZED = document.globalization.timedText.find(t => t.language == lang.LANGUAGE);
                document.langs.push(lang);
                debuglog("Sub found : "+lang.NAME);
            });
        }
        else if(response.indexOf('.vtt')>0) {
            // vtt urls
            debuglog("vtt found");
            var lines = response.match(regexpvtt);
            if(!lines){
                lines = response.match(regexpvtt2);
            }
            if(lines){
                lines.forEach(function(line) {
                    var url = document.baseurl;
                    var uri = document.langs[document.langid].URI;
                    url+=uri.substring(0,2);
                    if(line.indexOf("/")<0){
                       url+= uri.substring(2,uri.lastIndexOf("/")+1);
                    }
                    url+=line;
                    document.vttlist.push(url);
                });
            }
            else {
                alert("Unable to parse the m3u8 file, please report a bug for this video.");
            }
            
            if(document.vttlist.length>0){
                getsegment();
            }
            else {
                alert("Unknown error, please report a bug for this video.");
            }
        }
    }

    function vttloaded(response) {
        debuglog("vttloaded");
        // save segment
        document.segments+=response.substring(response.indexOf("-->")-13);
        document.segid++;
        if(document.segid<document.vttlist.length){
            getsegment();
        }
        else if(document.segments.length>0) {
            // export segments
            exportfile(vtttosrt(document.segments));
            document.segments="";
            document.vttlist=[];
            document.segid=0;
        }
        else {
            alert("Unknown error, please report a bug for this video.");
        }
    }

    function vtttosrt(vtt) {
        var lines = vtt.split(/\r\n|\r|\n/);
        var result = [];
        var subcount = 0;

        lines.forEach(function (line) {
            if(line.indexOf("-->") == 13) {
                subcount++;
                result.push(subcount);
                result.push(line.substring(0,29).replace(/[.]/g,','));
            }
            else if(subcount>0) {
                result.push(line.replace(/<\/?c(\.\w{1,})?>/g,'').replace(/&amp;/g,'&'));
            }
        });

        return result.join('\r\n');
    }

    function linetoarray(line) {
        var result = [];
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

            document.filename = document.getElementsByClassName("title-field")[0]?.innerText;
            if(document.getElementsByClassName("subtitle-field").length>0) {
                document.episode = document.getElementsByClassName("subtitle-field")[0]?.innerText
            }
        }

        if(document.oldlocation!=window.location.href&&document.oldlocation!=null) {
            // location changed
            document.m3u8found=false;
            document.langs = [];
            document.audios = [];
        }

        document.oldlocation=window.location.href;
    }

    document.clickhandlesub = function() {
        var picker = document.getElementsByClassName("options-picker subtitle-track-picker");
        if(picker && picker[0]) {
            picker[0].childNodes.forEach(function(child) {
                var element = child.childNodes[0];
                if(child.onclick==null) {
                    child.onclick = selectsub;
                }
            });
        }
    }

    function selectsub(e) {
        debuglog("selectsub");
        var width = this.offsetWidth;
        // Check click position
        if(e.layerX>=width-30&&e.layerX<=width-10&&e.layerY>=5&&e.layerY<=25){
            var lang = this.childNodes[0].childNodes[1].innerHTML;
            if(lang=="Off"){
                // Download all subs
                debuglog("Download all subs");
                document.zip = new JSZip();
                document.downloadall=true;
                document.downloadid=-1;
                downloadnext();
            }
            else {
                // Download sub
                document.downloadall=false;
                download(lang);
            }
            // Cancel selection
            return false;
        }
    }

    function downloadnext(){
        document.downloadid++;

        if(document.downloadid<document.langs.length){
            document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before','padding-right:35px;content:"'+Math.round((document.downloadid/document.langs.length)*100)+'%";');
            download(document.langs[document.downloadid].NAME,false,false);
        }
        else {
            debuglog("Subs downloaded");
            clearInterval(document.downloadinterval);
            document.styleSheets[0].addRule('#subtitleTrackPicker > div:first-child:before','padding-right:25px;content:"All";');

            debuglog("Save zip");
            document.zip.generateAsync({type:"blob"}).then(function(content) {
                var output = document.filename;
                if(document.episode!="") {
                    output+= " - "+document.episode.replace(':','');
                }
                saveAs(content, output+".zip");
            });
        }
    }

    function download(langname,withForced=true,localized=true) {
        if(!document.wait){
            debuglog("Download sub : "+langname);
            var language;
            var count=0;
            document.forced=false;
            document.langs.forEach(function(lang) {
                if(lang.NAME == langname || (localized && lang.LOCALIZED && Object.values(lang.LOCALIZED.renditions).includes(langname) && lang.FORCED=="NO")) {
                    language=lang.LANGUAGE;
                    document.langid=count;
                    getpagecontent(m3u8loaded,document.baseurl+lang.URI);
                    document.wait=true;
                }
                count++;
            });
            if(withForced)
            {
                count=0;
                var subid;
                document.langs.forEach(function(lang) {
                    if(lang.LANGUAGE==language && lang.NAME!=langname && lang.FORCED=="YES") {
                        subid=count;
                        document.waitsub=true;
                        document.waitInterval = setInterval(function () {
                            if(!document.wait) {
                                debuglog("Download forced : "+langname);
                                clearInterval(document.waitInterval);
                                document.langid=subid;
                                getpagecontent(m3u8loaded,document.baseurl+lang.URI);
                                document.wait=true;
                            }
                        },10);
                    }
                    count++;
                });
            }
            
            if(count==0){
                alert("An error has occurred, please reload the page.");
            }
        }
        
    }

    function getsegment() {
        debuglog("getsegment "+document.segid);
        getpagecontent(vttloaded,document.vttlist[document.segid]);
    }

    function exportfile(text) {
        debuglog("exportfile");
        var output = document.filename;
        if(document.episode!="") {
            output+= " - "+document.episode.replace(':','');
        }
        output += "."+document.langs[document.langid].LANGUAGE;
        if(document.langs[document.langid].FORCED=="YES") {
            output += ".forced";
            document.waitsub=false;
        }
        output += ".srt";

        if(document.downloadall){
            debuglog("Add to zip");
            document.zip.file(output, text);
            document.downloadinterval = setTimeout(function () { 
                document.wait = false;
                if(!document.waitsub){
                    downloadnext();
                }
            },20);
        }
        else {
            debuglog("Save sub");
            var hiddenElement = document.createElement('a');

            hiddenElement.href = 'data:attachment/text,' + encodeURI(text).replace(/#/g, '%23');
            hiddenElement.target = '_blank';
            hiddenElement.download = output;
            hiddenElement.click();
            setTimeout(function () { document.wait = false; },50);
        }
    }

    function getpagecontent(callback,url) {
        debuglog("Downloading : "+url);
        var http=new XMLHttpRequest();
        http.open("GET", url, true);
        http.onloadend = function() {
            if(http.readyState == 4 && http.status == 200) {
                callback(http.responseText);
            }
            else if (http.status === 404) {
                debuglog("Not found");
                callback("");
            }
            else {
                debuglog("Unknown error, retrying");
                setTimeout(function () { getpagecontent(callback,url); },100);
            }
        }
        http.send();
    }

    String.prototype.lpad = function(padString, length) {
        var str = this;
        while (str.length < length) {
            str = padString + str;
        }
        return str;
    }

    function debuglog(message){
        if(debug){
            console.log("%c [debug] "+message, 'background: #222; color: #bada55');
        }
    }
})(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);