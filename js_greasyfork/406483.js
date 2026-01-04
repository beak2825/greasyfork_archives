// ==UserScript==
// @name         atcoderAC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://atcoder.jp/contests/*/submissions/me
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406483/atcoderAC.user.js
// @updateURL https://update.greasyfork.org/scripts/406483/atcoderAC.meta.js
// ==/UserScript==

var ans = "";
var func
window.onload = function(){
    var table = document.getElementsByClassName("table table-bordered table-striped small th-center");
    var tr = table[0].rows[1];
    var td = tr.cells[6];
    ans = td.getElementsByTagName("span")[0].innerHTML
    var iswj = (ans == "WJ");
    if(iswj){
        console.log("WJ");
        func = setInterval(AC,1000);
    }
};

function AC(){
    console.log("notAC")
    if(ans == "AC"){
        console.log("AC");
        clearInterval(func);
        open( "https://www.youtube.com/watch?v=9h7wFJfHlIE", "_blank" ) ;
    }else{
        var table = document.getElementsByClassName("table table-bordered table-striped small th-center");
        var tr = table[0].rows[1];
        var td = tr.cells[6];
        ans = td.getElementsByTagName("span")[0].innerHTML
    }
};