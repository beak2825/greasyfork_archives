// ==UserScript==
// @name         Get GIF
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       NKL
// @include      https://www.gif-vif.com*/*
// @include      https://www.alucinoconfeisbuk.com*/*
// @include      https://media*.giphy.com*/*
// @include      https://gif15.videosgifs.com*/*
// @include      https://videosgifs.*/*
// @include      https://floobee.me*/*
// @include      https://gifer.com*/*
// @include      https://gif*
// @include      https://tenor.com*/*
// @include      https://giphy.com*/*
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/405997/Get%20GIF.user.js
// @updateURL https://update.greasyfork.org/scripts/405997/Get%20GIF.meta.js
// ==/UserScript==

(function() {
    'use strict';

   var a = document.querySelector("meta[property='og:url']").getAttribute("content");

    //alert(a);

    $(document).keypress(function(event){
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        //alert('You pressed a "enter" key in somewhere');
        var txt;
        if (confirm("Bạn có chắc muốn tải file không?")) {
            txt = "You pressed OK!";
            //document.location.href = 'yourfile.exe';
           // a.href;
            window.open(a, 'Download');
            /*function downloadFile(filePath){
                var link=document.createElement('a');
                link.href = filePath;
                link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
                link.click();
            }
            downloadFile(a);*/
        } else {
            txt = "You pressed Cancel!";
        }
        //document.getElementById("demo").innerHTML = txt;
    }
});
})();