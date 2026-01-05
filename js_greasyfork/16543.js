// ==UserScript==
// @name        User Hash
// @namespace   Sality
// @description KIckass Torrent User Hash
// @include     *kat.cr/*
// @version     0.3
// @grant       none
// ==/UserScript==

$(window).load(function(){
  var pathname = window.location.pathname;
try{
if (pathname.indexOf('\/user\/') != -1) {
    var hash_link=$('div.botmarg10px a[href^="/bookmarks/add/user/"]').attr('href');
    var hash=hash_link.substring(21,52);
    $('.mainpart h1.nickname').after('<span style="color:#229977;margin-left:50px;font-weight:bold;float:right;">User Hash:'+hash+'</span>');
     console.log("done");
}
}
    catch(ex){
        Console.log("Error IN User Hash App");
        }
 

});