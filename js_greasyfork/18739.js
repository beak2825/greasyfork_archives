// ==UserScript==
// @name        Economic collapse blog
// @namespace   130d1b38ed546a17aacadb3b0f1bfde1
// @description Remove crap from Economiccollapseblog and endoftheamericandream
// @include     http://*theeconomiccollapseblog.com/*
// @include     http://*endoftheamericandream.com/*
// @include     http://*thetruthwins.com/*
// @version     1.0
// @run-at      document-end
// @require     http://code.jquery.com/jquery-1.7.1.min.js
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18739/Economic%20collapse%20blog.user.js
// @updateURL https://update.greasyfork.org/scripts/18739/Economic%20collapse%20blog.meta.js
// ==/UserScript==


$(function(){
    $("td#left").remove();
    $("td#right-inner").remove();
    $("td#right").remove();
    $("td#footer").remove();
    
    $("td#middle").attr('colspan','3');
    $("div.sidebar-content").remove();
     $("div.sidebar").remove();
});
  