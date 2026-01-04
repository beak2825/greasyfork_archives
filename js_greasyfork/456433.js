// ==UserScript==
// @name         Atcoder All Tasks
// @namespace    https://github.com/Satrpx/
// @description  Adds a button which opens all the tasks in an atcoder contest. Saves loads of time!
// @author       Satrpx
// @version      1.0
// @match        *://atcoder.jp/contests/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456433/Atcoder%20All%20Tasks.user.js
// @updateURL https://update.greasyfork.org/scripts/456433/Atcoder%20All%20Tasks.meta.js
// ==/UserScript==

function open(){
    var num=document.getElementsByClassName("table table-bordered table-striped")[0].children[1].childElementCount;
    for(var i=0;i<num;i++) window.open('https://atcoder.jp/contests/'+ind+'/tasks/'+ind+'_'+String.fromCharCode('a'.charCodeAt(0)+i));
}
var parent=document.getElementsByClassName("nav nav-tabs")[0];
var add=document.createElement("li");
var ind=location.href.split('/')[4];
parent.insertBefore(add,parent.children[2]);
var a=document.createElement("a");
add.appendChild(a);
a.textContent="All";
a.addEventListener('click',open);