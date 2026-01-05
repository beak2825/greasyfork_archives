// ==UserScript==
// @name         Vimeo Download Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  find vimeo download links and display it on the embedded player or on page on vimeo website
// @author       LordKBX
// @icon https://vimeo.com/favicon.ico
// @include http://*.*/*
// @include https://*.*/*
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant GM_addStyle
// @grant GM_getResourceText
// @grant GM_openInTab
// @grant GM_info
// @grant GM_getMetadata
// @grant GM_getMetadata
// @connect *
// @run-at document-start
// @encoding utf-8
// @license https://creativecommons.org/licenses/by-sa/4.0/
// @homepage https://greasyfork.org/fr/scripts/21002-vimeo-embedded-download-helper
// @contactURL mailto:kevboulain@free.fr
// @supportURL mailto:kevboulain@free.fr
// @downloadURL https://update.greasyfork.org/scripts/21002/Vimeo%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/21002/Vimeo%20Download%20Helper.meta.js
// ==/UserScript==
var updateInterval = null;
var timeInterval = 800;
var nbscripts = 0;
var nbscriptsCharges = 0;

(function() {
    'use strict';
    setTimeout(verify, 2000);
})();

function createXhrObject()
{
    if (window.XMLHttpRequest)
        return new XMLHttpRequest();

    if (window.ActiveXObject)
    {
        var names = [
            "Msxml2.XMLHTTP.6.0",
            "Msxml2.XMLHTTP.3.0",
            "Msxml2.XMLHTTP",
            "Microsoft.XMLHTTP"
        ];
        for(var i in names)
        {
            try{ return new ActiveXObject(names[i]); }
            catch(e){}
        }
    }
    window.alert("Votre navigateur ne prend pas en charge l'objet XMLHTTPRequest.");
    return null; // non supporté
}

function verify(){
    var items = null;
    var i = 0;
    var j = 0;
    var ht = '';
    if(window.location.href.search("://player.vimeo.com/video/") != -1){
        ht = window.location.href.substring(0,window.location.href.search("://"));
        items = document.getElementsByTagName('script');
        if(items !== null){ for(i = 0; i< items.length; i++){ if(items[i].innerHTML !== ''){ create_links(items[i].innerHTML); } } }
    }
    if(window.location.href.search("https://vimeo.com/") != -1){
        mlink = window.location.href.split('/');
        if(mlink[mlink.length - 1] === ''){mlink = mlink[mlink.length - 2];}
        else{mlink = mlink[mlink.length - 1];}
        console.log(mlink);
        xhr = createXhrObject();
        xhr.open('GET', "https://player.vimeo.com/video/" + mlink + "/config?autoplay=0", true);
        xhr.onreadystatechange = function (aEvt) {
            if (xhr.readyState == 4) {
                if(xhr.status == 200){
                    console.log(xhr.responseText);
                    create_links(xhr.responseText);
                }
            }
        };
        xhr.send(null);
    }
}

function create_links(matter){
    style = document.createElement('style');
    style.innerHTML = '#Vimeo_Embedded_Download_Helper{font-family:Arial, sans-serif;font-weight:bold;background:#9EE0FF;color:#808080;padding:5px;border:#00AEFF 1px solid} #Vimeo_Embedded_Download_Helper a{color:black !important;text-decoration:underline;} #Vimeo_Embedded_Download_Helper a:hover{color:#49C5FF !important;}';
    document.getElementsByTagName('body')[0].appendChild(style);
    div = document.createElement('div');
    if(window.location.href.search("://player.vimeo.com/video/") != -1){div.setAttribute("style","position:fixed;top:0px;left:0px;right:0px;z-index:999;");}
    div.setAttribute("id","Vimeo_Embedded_Download_Helper");
    htm = 'Video Download Links : ';
    window.console.log(matter);
    tab = matter.split('"progressive":');
    tab2 = matter.split('"text_tracks":');
    if(tab[1] !== undefined){
        lines = tab[1].split("]")[0]+"]";
        lines = JSON.parse(lines);
        for(j=0; j<lines.length; j++){
            htm = htm + '&nbsp;<a href="'+lines[j].url+'" download="'+document.getElementsByTagName('title')[0].innerHTML+'.mp4">' + lines[j].quality + '</a>&nbsp;';
            window.console.log(lines[j].quality + " -> " + lines[j].url);
        }
        if(tab2[1] !== undefined){
            lines2 = tab2[1].split("]")[0]+"]";
            lines2 = JSON.parse(lines2);
            for(j=0; j<lines2.length; j++){
                htm = htm + '&nbsp;<a href="'+lines2[j].url+'" download="'+document.getElementsByTagName('title')[0].innerHTML+'.vtt">sub(' + lines2[j].lang + ')</a>&nbsp;';
                window.console.log('sub(' + lines2[j].lang + ')' + " -> " + lines2[j].url);
            }
        }
        div.innerHTML = htm;
        if(window.location.href.search("://player.vimeo.com/video/") != -1){window.document.getElementsByTagName('body')[0].appendChild(div);}
        else{
            if(document.getElementsByClassName('video_container')[0] !== undefined){document.getElementsByClassName('video_container')[0].appendChild(div);}
            else if(document.getElementsByClassName('clip_main-content')[0] !== undefined){document.getElementsByClassName('clip_main-content')[0].insertBefore(div,document.getElementsByClassName('clip_main-content')[0].firstChild);}
        }
    }
}