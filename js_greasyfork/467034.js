// ==UserScript==
// @name         LPSG動画アンローカ
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  LPSG YES
// @author       You
// @match        https://www.lpsg.com/threads/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lpsg.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467034/LPSG%E5%8B%95%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%AD%E3%83%BC%E3%82%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/467034/LPSG%E5%8B%95%E7%94%BB%E3%82%A2%E3%83%B3%E3%83%AD%E3%83%BC%E3%82%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Array.from(document.getElementsByClassName('bbMediaWrapper')).forEach(function(tempix) {
    Array.from(tempix.getElementsByTagName('img')).forEach(function(vgn){
        var htmlix="";
        var videourl1=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.mp4');
        var videourl2=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.mov');
        var videourl3=vgn.src.replaceAll('attachments/posters','video').replaceAll('.jpg','.m4v');
        htmlix+="<video controls height='360' style='width:100%; object-fit:contain'> <source src='"+videourl1+"' type='video/mp4'> <source src='"+videourl2+"' type='video/mp4'> <source src='"+videourl1+"' type='video/mp4'> <source src='"+videourl3+"' type='video/mp4'> </video>"
        tempix.innerHTML=htmlix;
        //https://cdn-videos.lpsg.com/data/attachments/posters/96689/96689401-08eafd4138f5223a9baa111250811dbc.jpg
        //https://cdn-videos.lpsg.com/data/video/97093/97093021-14491058b48aa3d7974e171ae88e66a1.mp4
    })
})

})();