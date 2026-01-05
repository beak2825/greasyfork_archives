// ==UserScript==
// @name         riss eats poop 2
// @namespace    saqfish
// @version      1
// @description  riss sux 
// @author       saqfish/*
// @include      https://s3.amazonaws.com/*
// @include      https://home.wellsfargoadvisors.com/*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/16264/riss%20eats%20poop%202.user.js
// @updateURL https://update.greasyfork.org/scripts/16264/riss%20eats%20poop%202.meta.js
// ==/UserScript==



if (window.location.toString().indexOf('s3.amazonaws.com') != -1){
    var link = $('a:contains("their profile")').attr('href').toString();
    console.log(link);
    
    window.open(link);
    window.addEventListener('message',function(event) {
        console.log(event.data);
    });

}
if (window.location.toString().indexOf('wellsfargoadvisors') != -1){
    var img =$('#faimg');
    window.opener.postMessage({a: img},'*'); 
}