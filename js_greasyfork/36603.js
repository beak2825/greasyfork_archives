// ==UserScript==
// @name         MT防止标题覆盖
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://tp.m-team.cc/upload.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36603/MT%E9%98%B2%E6%AD%A2%E6%A0%87%E9%A2%98%E8%A6%86%E7%9B%96.user.js
// @updateURL https://update.greasyfork.org/scripts/36603/MT%E9%98%B2%E6%AD%A2%E6%A0%87%E9%A2%98%E8%A6%86%E7%9B%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
getname=function(){
var filename = document.getElementById("torrent").value;
filename = filename.toString();
var lowcase = filename.toLowerCase();
var start = lowcase.lastIndexOf("\\"); //for Google Chrome on windows
if (start == -1){
start = lowcase.lastIndexOf("\/"); // for Google Chrome on linux
if (start == -1)
start = 0;
else start = start + 1;
}
else start = start + 1;
var end = lowcase.lastIndexOf("torrent");
var noext = filename.substring(start,end-1);
noext = noext.replace(/H\.264/ig,"H_264");
noext = noext.replace(/5\.1/g,"5_1");
noext = noext.replace(/2\.1/g,"2_1");
noext = noext.replace(/\./g," ");
noext = noext.replace(/H_264/g,"H.264");
noext = noext.replace(/5_1/g,"5.1");
noext = noext.replace(/2_1/g,"2.1");
if(document.getElementById("name").value==="") //add a judgement to avoid title being coverd
document.getElementById("name").value=noext;
console.log("aaaa");
};
    // Your code here...
})();