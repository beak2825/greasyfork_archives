// ==UserScript==
// @name         Digitally Imported Music Downloader (Free Edition)
// @namespace    https://levelkro.com/
// @version      1.1.34
// @description  Download song files from the DI.FM website.
// @author       levelKro
// @match        https://*.di.fm/*
// @grant        none
// @noframes
// @run-at       document-idle
// @license      MIT
// @copyright    2019-2023, levelKro (https://levelkro.com) (https://openuserjs.org/users/levelKro)
// @downloadURL https://update.greasyfork.org/scripts/389623/Digitally%20Imported%20Music%20Downloader%20%28Free%20Edition%29.user.js
// @updateURL https://update.greasyfork.org/scripts/389623/Digitally%20Imported%20Music%20Downloader%20%28Free%20Edition%29.meta.js
// ==/UserScript==
/*** YOU CAN CHANGE SETTINGS HERE ***/
var buttonRefresh=100; //Refresh of button
var diDebug=false; //Only for debugging.


/*** HALT - STOP - DO NOT CONTINU ***/
/*** DO NOT CHANGE SETTING HERE ***/
// FileSaver Script (MIN) from https://github.com/eligrey/FileSaver.js
(function(a,b){if("function"==typeof define&&define.amd)define([],b);else if("undefined"!=typeof exports)b();else{b(),a.FileSaver={exports:{}}.exports}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(b,c,d){var e=new XMLHttpRequest;e.open("GET",b),e.responseType="blob",e.onload=function(){a(e.response,c,d)},e.onerror=function(){console.error("could not download file")},e.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof global&&global.global===global?global:void 0,a=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(a,b,d,e){if(e=e||open("","_blank"),e&&(e.document.title=e.document.body.innerText="downloading..."),"string"==typeof a)return c(a,b,d);var g="application/octet-stream"===a.type,h=/constructor/i.test(f.HTMLElement)||f.safari,i=/CriOS\/[\d]+/.test(navigator.userAgent);if((i||g&&h)&&"object"==typeof FileReader){var j=new FileReader;j.onloadend=function(){var a=j.result;a=i?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),e?e.location.href=a:location=a,e=null},j.readAsDataURL(a)}else{var k=f.URL||f.webkitURL,l=k.createObjectURL(a);e?e.location=l:location.href=l,e=null,setTimeout(function(){k.revokeObjectURL(l)},4E4)}});f.saveAs=a.saveAs=a,"undefined"!=typeof module&&(module.exports=a)});
//# sourceMappingURL=FileSaver.min.js.map
var chkSong="";
var chkSongArtist="";
var chkSongTitle="";
var chkSongUrl="";
var chkSongUrlVerif="";
var Song="";
var SongUrl="";
var saveTrack=JSON.parse("{}");
var savePlaylist=JSON.parse("{}");
var aStr="DI.FM Downloader [ ";
var bStr=" ]";
var imgDown="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iNTEyIiB2aWV3Qm94PSItMjAgMCA0NDggNDQ4IiB3aWR0aD0iNTEyIiBjbGFzcz0iIj48Zz48cGF0aCBkPSJtMjI0IDI4MGMwIDguODM1OTM4LTcuMTY0MDYyIDE2LTE2IDE2cy0xNi03LjE2NDA2Mi0xNi0xNiA3LjE2NDA2Mi0xNiAxNi0xNiAxNiA3LjE2NDA2MiAxNiAxNnptMCAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiM1QUE3RkYiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+PHBhdGggZD0ibTMyOCAyODhjLTQ0LjE4MzU5NCAwLTgwIDM1LjgxNjQwNi04MCA4MHMzNS44MTY0MDYgODAgODAgODAgODAtMzUuODE2NDA2IDgwLTgwYy0uMDQ2ODc1LTQ0LjE2NDA2Mi0zNS44MzU5MzgtNzkuOTUzMTI1LTgwLTgwem0zOS41OTM3NSA5OS43MTg3NS0zMy45Mjk2ODggMzMuOTI5Njg4Yy0xLjUgMS41MDM5MDYtMy41MzkwNjIgMi4zNTE1NjItNS42NjQwNjIgMi4zNTE1NjJzLTQuMTY0MDYyLS44NDc2NTYtNS42NjQwNjItMi4zNTE1NjJsLTMzLjkyOTY4OC0zMy45Mjk2ODhjLTMuMDMxMjUtMy4xMzY3MTktMi45ODgyODEtOC4xMjg5MDYuMDk3NjU2LTExLjIxNDg0NCAzLjA4NTkzOC0zLjA4NTkzNyA4LjA3ODEyNS0zLjEyODkwNiAxMS4yMTQ4NDQtLjA5NzY1NmwyMC4yODEyNSAyMC4yODEyNXYtNzYuNjg3NWMwLTQuNDE3OTY5IDMuNTgyMDMxLTggOC04czggMy41ODIwMzEgOCA4djc2LjY4NzVsMjAuMjgxMjUtMjAuMjgxMjVjMy4xMzY3MTktMy4wMzEyNSA4LjEyODkwNi0yLjk4ODI4MSAxMS4yMTQ4NDQuMDk3NjU2IDMuMDg1OTM3IDMuMDg1OTM4IDMuMTI4OTA2IDguMDc4MTI1LjA5NzY1NiAxMS4yMTQ4NDR6bTAgMCIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojNUFBN0ZGIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Im0xMS4zMTI1IDgwaDY4LjY4NzV2LTY4LjY4NzV6bTAgMCIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojNUFBN0ZGIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Im0yMjQgMTU0LjYwOTM3NS05NiAyNy40MjE4NzV2MTUuMzU5Mzc1bDk2LTI3LjQyMTg3NXptMCAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiM1QUE3RkYiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+PHBhdGggZD0ibTExMiAzMTJjMCA4LjgzNTkzOC03LjE2NDA2MiAxNi0xNiAxNnMtMTYtNy4xNjQwNjItMTYtMTYgNy4xNjQwNjItMTYgMTYtMTYgMTYgNy4xNjQwNjIgMTYgMTZ6bTAgMCIgZGF0YS1vcmlnaW5hbD0iIzAwMDAwMCIgY2xhc3M9ImFjdGl2ZS1wYXRoIiBzdHlsZT0iZmlsbDojNUFBN0ZGIiBkYXRhLW9sZF9jb2xvcj0iIzAwMDAwMCI+PC9wYXRoPjxwYXRoIGQ9Im0wIDQ0OGgyNzQuOTg0Mzc1Yy0uMDg5ODQ0LS4wNjI1LS4xNjc5NjktLjEzNjcxOS0uMjU3ODEzLS4xOTE0MDYtMi45Mjk2ODctMS45ODA0NjktNS43NTM5MDYtNC4xMTcxODgtOC40NTMxMjQtNi40MDIzNDQtLjc0NjA5NC0uNjIxMDk0LTEuNDI1NzgyLTEuMzAwNzgxLTIuMTQ0NTMyLTEuOTQxNDA2LTEuOTM3NS0xLjczODI4Mi0zLjgwODU5NC0zLjUxOTUzMi01LjYwMTU2Mi01LjQwMjM0NC0uODAwNzgyLS44Nzg5MDYtMS42NDA2MjUtMS43NzM0MzgtMi4zOTg0MzgtMi42ODc1LTEuNjAxNTYyLTEuODM5ODQ0LTMuMTk5MjE4LTMuNzUtNC42NTYyNS01LjcxMDkzOC0uNjg3NS0uOTEwMTU2LTEuMzk0NTMxLTEuODA4NTkzLTIuMDQ2ODc1LTIuNzQyMTg3LTEuODA4NTkzLTIuNTc4MTI1LTMuNDg4MjgxLTUuMjQ2MDk0LTUuMDQyOTY5LTgtLjE5OTIxOC0uMzU1NDY5LS40Mjk2ODctLjY4MzU5NC0uNjI4OTA2LTEuMDQyOTY5LTEuNjk5MjE4LTMuMTM2NzE4LTMuMjIyNjU2LTYuMzY3MTg3LTQuNTYyNS05LjY3MTg3NS0uMzk4NDM3LS45NzY1NjItLjcxODc1LTEuOTc2NTYyLTEuMDg1OTM3LTIuOTY4NzUtLjg5ODQzOC0yLjM5ODQzNy0xLjcxNDg0NC00Ljg3MTA5My0yLjQwMjM0NC03LjM3NS0uMzQzNzUtMS4yMDcwMzEtLjY0ODQzNy0yLjM5ODQzNy0uOTMzNTk0LTMuNjMyODEyLS42MDE1NjItMi40OTYwOTQtMS4wODIwMzEtNS4wMzEyNS0xLjQ3MjY1Ni03LjU5NzY1Ny0uMTc1NzgxLTEuMTM2NzE4LS4zODY3MTktMi4yNjU2MjQtLjUxOTUzMS0zLjQxMDE1Ni0uODc1LTYuODk4NDM3LS45NTMxMjUtMTMuODc4OTA2LS4yMzQzNzUtMjAuNzk2ODc1LjEwNTQ2OS0xLjA2NjQwNi4zMTI1LTIuMDk3NjU2LjQ1NzAzMS0zLjE0NDUzMS4yNzM0MzgtMi4wNjY0MDYuNTM1MTU2LTQuMTI4OTA2LjkzNzUtNi4xNTIzNDQuMjQ2MDk0LTEuMjQyMTg3LjU5NzY1Ni0yLjQwMjM0NC44OTQ1MzEtMy42NTYyNS40MzM1OTQtMS43ODUxNTYuODAwNzgxLTMuNTc4MTI1IDEuMzY3MTg4LTUuMzIwMzEyLjM5NDUzMS0xLjI4MTI1Ljg3MTA5My0yLjUxMTcxOSAxLjMxMjUtMy43Njk1MzIuNTY2NDA2LTEuNTk3NjU2IDEuMTI4OTA2LTMuMjY5NTMxIDEuNzc3MzQzLTQuODU1NDY4LjUxOTUzMi0xLjI2MTcxOSAxLjExNzE4OC0yLjQ4ODI4MiAxLjY5NTMxMy0zLjcxODc1LjcwMzEyNS0xLjUxOTUzMiAxLjM5MDYyNS0zLjAzMTI1IDIuMTc1NzgxLTQuNTAzOTA2LjY0MDYyNS0xLjIyNjU2MyAxLjM1MTU2My0yLjQwMjM0NCAyLjA0Njg3NS0zLjU5Mzc1LjgwMDc4MS0xLjQxNDA2MyAxLjY1NjI1LTIuODI0MjE5IDIuNTU0Njg4LTQuMTkxNDA3Ljc1NzgxMi0xLjE2MDE1NiAxLjU5NzY1Ni0yLjI4MTI1IDIuMzk4NDM3LTMuNDA2MjUuOTQ1MzEzLTEuMzEyNSAxLjg5NDUzMi0yLjYyNSAyLjkwMjM0NC0zLjg4MjgxMi44NzUtMS4wOTM3NSAxLjc4NTE1Ni0yLjE0MDYyNSAyLjY5OTIxOS0zLjE5OTIxOSAxLjA1NDY4Ny0xLjIxNDg0NCAyLjEyNS0yLjM5ODQzOCAzLjIzODI4MS0zLjU2NjQwNi45Njg3NS0xLjAwNzgxMyAxLjk2ODc1LTEuOTc2NTYzIDIuOTg0Mzc1LTIuOTQ1MzEzIDEuMTYwMTU2LTEuMTA1NDY5IDIuMzM1OTM3LTIuMTgzNTkzIDMuNTU4NTk0LTMuMTk5MjE5IDEuMDU4NTkzLS45MTQwNjIgMi4xMjg5MDYtMS43OTI5NjggMy4xOTkyMTktMi42NTYyNSAxLjI3MzQzNy0xIDIuNTYyNS0xLjk2MDkzNyAzLjg3NS0yLjg5NDUzMSAxLjEzNjcxOC0uODAwNzgxIDIuMjc3MzQzLTEuNjAxNTYyIDMuNDUzMTI0LTIuMzU1NDY5IDEuMzYzMjgyLS44Nzg5MDYgMi43NTM5MDctMS43MTg3NSA0LjE2MDE1Ny0yLjUyNzM0MyAxLjIxMDkzNy0uNjk1MzEzIDIuNDAyMzQzLTEuMzgyODEzIDMuNjQ4NDM3LTIuMDMxMjUgMS40NTcwMzItLjc1IDIuOTQ1MzEzLTEuNDU3MDMxIDQuNDQxNDA2LTIuMTM2NzE5IDEuMjY1NjI2LS41NzQyMTkgMi41MTk1MzItMS4xNTIzNDQgMy44MDg1OTQtMS42NzE4NzUgMS41NTA3ODItLjYzMjgxMyAzLjEzNjcxOS0xLjE4MzU5NCA0LjcyNjU2My0xLjczNDM3NSAxLjMwNDY4Ny0uNDQ5MjE5IDIuNjAxNTYyLS45MTQwNjIgMy45Mjk2ODctMS4zMDQ2ODggMS42NDg0MzgtLjQ4ODI4MSAzLjMyODEyNS0uODg2NzE4IDUuMDA3ODEzLTEuMjg5MDYyIDEuMzI4MTI1LS4zMjAzMTIgMi42NDA2MjUtLjY1NjI1IDQtLjkxNzk2OSAxLjc1NzgxMi0uMzM1OTM3IDMuNTQyOTY5LS41NzgxMjUgNS4zMzU5MzctLjgwMDc4MSAxLjMyODEyNS0uMTc1NzgxIDIuNjQwNjI1LS4zOTg0MzggNC0uNTE5NTMxLjMyODEyNSAwIC42NDA2MjUtLjEwNTQ2OS45NjA5MzgtLjEyODkwN3YtMjcyLjM1MTU2MmgtMjI0LjA4OTg0NHY4OGMwIDQuNDE3OTY5LTMuNTgyMDMxIDgtOCA4aC04OHptOTYtMTY4YzUuNjMyODEyLjAzMTI1IDExLjE1NjI1IDEuNTcwMzEyIDE2IDQuNDQ5MjE5di0xMDguNDQ5MjE5YzAtMy41NzQyMTkgMi4zNzEwOTQtNi43MTQ4NDQgNS44MDg1OTQtNy42OTUzMTJsMTEyLTMyYzIuNDE0MDYyLS42ODc1IDUuMDA3ODEyLS4yMDMxMjYgNy4wMTE3MTggMS4zMDg1OTMgMi4wMDM5MDcgMS41MTE3MTkgMy4xNzk2ODggMy44Nzg5MDcgMy4xNzk2ODggNi4zODY3MTl2MTM2YzAgMTcuNjcxODc1LTE0LjMyODEyNSAzMi0zMiAzMnMtMzItMTQuMzI4MTI1LTMyLTMyIDE0LjMyODEyNS0zMiAzMi0zMmM1LjYzMjgxMi4wMzEyNSAxMS4xNTYyNSAxLjU3MDMxMiAxNiA0LjQ0OTIxOXYtNjUuODM5ODQ0bC05NiAyNy40Mjk2ODd2OTcuOTYwOTM4YzAgMTcuNjcxODc1LTE0LjMyODEyNSAzMi0zMiAzMnMtMzItMTQuMzI4MTI1LTMyLTMyIDE0LjMyODEyNS0zMiAzMi0zMnptMCAwIiBkYXRhLW9yaWdpbmFsPSIjMDAwMDAwIiBjbGFzcz0iYWN0aXZlLXBhdGgiIHN0eWxlPSJmaWxsOiM1QUE3RkYiIGRhdGEtb2xkX2NvbG9yPSIjMDAwMDAwIj48L3BhdGg+PC9nPiA8L3N2Zz4=";

const __send = XMLHttpRequest.prototype.send;
console.log(aStr+"Starting up."+bStr);
var outputStyles='<style>.difmBox { font-size:10px; line-height:12px; min-height:24px;    bottom: 64px;    border: 1px solid #3165ae;    border-radius: 0 8px 0 0;    left: 0;    z-index: -1;    position: fixed;    background: linear-gradient(to bottom left,#444d6a,#2e354a);    display: block;    padding: 8px 8px 5px 5px; white-space:nowrap;} .difmBox img {float:left; margin:0 -24px 0 0; width:24px; height:24px;} .difmBox span { display:block; margin:0 0 0 30px} .difmBox b { font-weight:bold; color:#fff;} #difmStatus b { color:#5986f7; } .difmBox input { opacity:1; float:right; height:12px; display:block; padding:0; margin:0; position:relative;} .difmBox label { float:right;position:relative; padding:0; margin:0 5px;}</style>';
document.getElementsByClassName("preferences-region")[0].innerHTML+=outputStyles+'<div class="difmBox"><a class="ico" id="difmDown" onclick="alert(\'Sorry, no song found, you listen with the web player ?\');" title="Download not ready" style="cursor:pointer;"><img src="'+imgDown+'" width=24 height=24/></a><input type="checkbox" id="difmAuto" name="difmAuto"/><label for="difmAuto" title="When a new song is detected, the file is downloaded without user request. Need to be activate each time you connect to Di.FM website. If download not start, verify if your browser block download. (Chrome make this)">Auto-download</label><span><b>DI.FM Downloader</b></span><span id="difmStatus">Click play or select a music channel to begin.</span></div>';

XMLHttpRequest.prototype.send = function () {
    this.addEventListener('loadend', e => {
        if(document.getElementsByClassName("artist-name").length>=1 && document.getElementsByClassName("track-name").length>=1){
            // Check current request
            if(e.target.responseURL.search("api.audioaddict.com/")!="-1"){
                // OK, this is from di.fm, working with response
                var re=e.target.response;
                if(re=="" || re==" ") {
                    // Empty answer, skip it!
                }
                else if(e.target.responseURL.search("channel/")!="-1"){
                    // Channel information, try to get playlist and current file details
                    if(diDebug) console.log(aStr+"Save channel details."+bStr);
                    savePlaylist=JSON.parse(re);
                }
                else if(e.target.responseURL.search("tracks/")!="-1"){
                    // Track details, try to get update details
                    if(diDebug) console.log(aStr+"Save track details."+bStr);
                    saveTrack=JSON.parse(re);
                }
                else {
                    // Unkown output, ignore it
                    if(diDebug) console.log('intercepted', e.target.responseURL);
                    //console.log('answer', "'"+e.target.response+"'");
                }
            }
            else if(diDebug) console.log(aStr+"Unknown source :  "+e.target.responseURL+bStr);
            //https://content.audioaddict.com/
        }
        else {
            console.log(aStr+"Unknown source : "+e.target.responseURL+bStr);
        }
    }, {once: true});
    __send.apply(this, arguments);
};

setInterval(function () {
    var chkme="";
    if(!document.getElementsByClassName("icon-play")[0] && document.getElementsByClassName("icon-pause")[0] && document.getElementsByClassName("artist-name").length>=1 && document.getElementsByClassName("track-name").length>=1){
        chkSongArtist=document.getElementsByClassName("artist-name")[0].innerText;
        chkSongTitle=document.getElementsByClassName("track-name")[0].innerText;
        chkSong=chkSongArtist+chkSongTitle;
        chkSong=chkSong.replace("  "," ");
        if(diDebug) console.log(aStr+"Trying to find : "+chkSong+""+bStr);
        var chkFind=false;
        if(chkSong!=Song && chkSong!=""){
            if(diDebug) console.log(aStr+"New song detected."+bStr);
            for (var z in savePlaylist.tracks){
                // working on available playlist
                chkme=savePlaylist.tracks[z].display_artist+" - "+savePlaylist.tracks[z].display_title;
                chkme=chkme.replace("  "," ");
                if(diDebug) console.log(aStr+"Saved Playlist #"+z+" : "+chkme+""+bStr);
                if(chkme==chkSong) {
                    // This is the current song, great, update details
                    if(diDebug) console.log(aStr+" '-This is the new song, update cache details."+bStr);
                    Song=chkSong;
                    SongUrl=savePlaylist.tracks[z].content.assets[0].url;
                    chkFind=true;
                }
            }
            if(!chkFind && saveTrack.display_artist && saveTrack.display_title){
                chkme=saveTrack.display_artist+" - "+saveTrack.display_title;
                chkme=chkme.replace("  "," ");
                if(diDebug) console.log(aStr+"Saved Track : '"+chkme+"'"+bStr);
                if(chkme==chkSong && chkme!="undefined - undefined") {
                    // This is the current song, great, update details
                    if(diDebug) console.log(aStr+"The cached track is the current, update details."+bStr);
                    Song=chkSong;
                    SongUrl=saveTrack.content.assets[0].url;
                    chkFind=true;
                }
            }
            //Apply changes
            if(chkFind){
                if(diDebug) console.log(aStr+"Update button with new details."+bStr);
                document.getElementById("difmDown").onclick = function() {console.log(aStr+"Downloading file, please wait."+bStr); alert("Downloading file in background, you see the song audio file for '"+Song+"' in the download folder when is done."); saveAs(SongUrl,Song.replace(":","-")+".m4a");};
                document.getElementById("difmDown").title="Download '"+Song+"' now!";
                document.getElementById("difmStatus").innerHTML="Download link for <b>"+Song+"</b> is ready.";
                if(document.getElementById("difmAuto").checked==true) {
                    if(diDebug) console.log(aStr+"Auto download the new track."+bStr);
                    var tmpFile=Song.replace(":","-")+".m4a";
                    setTimeout("saveAs(\""+SongUrl+"\",\""+tmpFile+"\");",1000);
                }
            }
            else {
                if(diDebug) console.log(aStr+"Disable download button."+bStr);
                savePlaylist="";
                saveTrack="";
                document.getElementById("difmDown").onclick = function() {alert("Sorry, the url of the current song "+chkSong+" can't be found. You can try to change channel and go back if is not find after few seconds.");};
                document.getElementById("difmDown").title="Current song link is not detected!";
                document.getElementById("difmStatus").innerHTML="Unable to detect the current song.";
            }
        }
        else {
            //Nothing to do, song not changed
        }
    }
    else {
        //Wait the user to start player, or paused, or adroll is playing
    }
},buttonRefresh);

console.log(aStr+"Debug mode: "+((diDebug) ? "enabled":"disabled") +"."+bStr);
console.log(aStr+"Refresh: "+buttonRefresh+"ms."+bStr);
console.log(aStr+"Ready to monitoring."+bStr);