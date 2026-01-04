// ==UserScript==
// @name Vivo-Dl
// @namespace https://vivo.sx
// @version 0.1
// @description Vivo Download Link
// @author You
// @match https://vivo.sx/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/31529/Vivo-Dl.user.js
// @updateURL https://update.greasyfork.org/scripts/31529/Vivo-Dl.meta.js
// ==/UserScript==


getStreamUrl();

function getStreamUrl(){
    var url = $('video').attr('src');
    if(url){
        addDlLink(url.replace('&m=video/mp4',''));
    }else{
        setTimeout(getStreamUrl,1000);
    }
}

function addDlLink(url){
    var dlBtn = '<a href="'+url+'" target="_blank" style="position:absolute;left:10px;top:10px;z-index:9999;color:#fff;padding:10px;background-color:blue">Download</a>';
    $('body').prepend(dlBtn);
}