// ==UserScript==
// @name         Cant Open editorial
// @namespace    test
// @description  editorialを開けなくします.
// @version      1.00
// @author       You
// @include      https://atcoder.jp/contests/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408026/Cant%20Open%20editorial.user.js
// @updateURL https://update.greasyfork.org/scripts/408026/Cant%20Open%20editorial.meta.js
// ==/UserScript==

window.onload=function(){
    var tag=document.getElementsByTagName("a");
    for(var i=0;i<tag.length;i++){
        var str=tag[i].href;
        var result = str.lastIndexOf('editorial');
        if(result!==-1){console.log(result);tag[i].href="";tag[i].target="";}
    }
}