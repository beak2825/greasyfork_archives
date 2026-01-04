// ==UserScript==
// @name         orix url local to dev
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       within
// @include http://localhost:8000/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/35743/orix%20url%20local%20to%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/35743/orix%20url%20local%20to%20dev.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('load', function() {
    'use strict';
        var vars = "var rep = 'http://localhost:8000/wp-content/uploads/'; var dev = 'https://storage.googleapis.com/orix-tripps-dev-media/1/';";
        var head ="function () {  " ;
        var im =  " var imgs = document.getElementsByTagName('img');  if(imgs.length > 0){ for(var i=0; i < imgs.length; i++){ var s =imgs[i].getAttribute('src'); if(s ===null) { continue;}  if (/s/.test(rep)){ imgs[i].setAttribute('src', s.replace(rep, dev)); }}}";
        var pi =  " var pics = document.getElementsByClassName('pic'); if(pics.length > 0){ for(var i=0; i < pics.length; i++){ var s =pics[i].getAttribute('style'); if(s ===null) { continue;}  if (/s/.test(rep)){ pics[i].setAttribute('style', s.replace(rep, dev)); }}}";
        var spa =  " var spa = document.querySelectorAll('span'); if(spa.length > 0){ for(var i=0; i < spa.length; i++){ var s =spa[i].getAttribute('style'); if(s ===null) { continue;}   if (/s/.test(rep)){ var a = s.replace(rep, dev); spa[i].setAttribute('style', a); }}}";
        var tail = "}";

        var trans = head + vars + im + pi + spa + tail;
       //var btnStyle = "width:auto;position:absolute; top:50%; left:20px;color:#fff;padding:9px 14px;border-radius:5px;line-height:1;background:#f00;";
       var btnStyle = "position: fixed;width:100px;height:100px;bottom:10px;right:10px;margin-bottom: 0 !important;z-index:2;background:red;display:block;";
     $('body').append('<button class="btn ttl-font btn-convert js_trans_convert" style="' + btnStyle + '" onClick="(' + trans + ')();" >Image Translate </button>');
    }, false);
})();