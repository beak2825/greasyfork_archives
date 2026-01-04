// ==UserScript==
// @name OpenLoad Downloader
// @namespace https://openload.co/
// @version 0.26
// @description Zum downloaden von OpenLoad Videos.
// @author ShafterOne
// @match https://openload.co/*
// @match https://oload.tv/embed/*
// @match https://oload.info/embed/*
// @match https://oload.stream/embed/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/31309/OpenLoad%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/31309/OpenLoad%20Downloader.meta.js
// ==/UserScript==

$( document ).ready(function() {
if($('#streamurl').html().length){
var streamUrl = 'https://openload.co/stream/'+$('#streamurl').html();
var dlBtn = '<a href="'+streamUrl+'" target="_blank" id="oldl-link" style="position:absolute;left:10px;top:10px;z-index:999;color:#fff;padding:10px;background-color:blue">Download</a>';
var removeLink = '<span id="remove-oldl-link"style="position:absolute;left:88px;top:5px;z-index:1000;color:#fff;border-radius:50%;padding:0 5px;background:red;font-weight:bold;cursor:pointer">x<span>';
$('body').prepend(dlBtn+removeLink);
}
$( "#remove-oldl-link" ).click(function() {
$( "#remove-oldl-link,#oldl-link").remove();
});
});