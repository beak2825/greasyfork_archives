// ==UserScript==
// @name         My Tasklist organizer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Keeps track of ticket updates2
// @author       You
// @match        https://admin.wayfair.com/v/workflow_management/queues
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/400241/My%20Tasklist%20organizer.user.js
// @updateURL https://update.greasyfork.org/scripts/400241/My%20Tasklist%20organizer.meta.js
// ==/UserScript==
// callback executed when canvas was found

function check1(){
var trigger = document.getElementsByClassName("rt-tr -even")
for(var i =0; i < trigger.length; i++)
{
var src1="https://admin.wayfair.com/tracker/frames/88.php?PrtID="
var src2="&t=&View=89#";
var frame=document.createElement("iframe")
frame.src=src1+trigger[i].querySelectorAll("a")[0].innerText+src2
frame.style.cssText="visibility:hidden;position:relative;width:3px;height:1px"
frame.sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
trigger[i].querySelectorAll("div")[13].appendChild(frame)
}}
var str=function(){
var trigger=document.getElementsByClassName("rt-tr -even")
for (var i =0; i < trigger.length; i++){var lastupdate=trigger[i].querySelectorAll("iframe")[0].contentWindow.document.getElementsByClassName("boldtext")[0].innerText

if(lastupdate.includes("⚠️")){
trigger[i].style.cssText="background-color:#e76e6487"
trigger[i].querySelectorAll("div")[13].innerText="Please update"}
else {trigger[i].style.cssText="background-color:#6be76491"}}
}

function check2(){
var trigger = document.getElementsByClassName("rt-tr is-striped -odd")
for(var i =0; i < trigger.length; i++)
{
var src1="https://admin.wayfair.com/tracker/frames/88.php?PrtID="
var src2="&t=&View=89#";
var frame=document.createElement("iframe")
frame.src=src1+trigger[i].querySelectorAll("a")[0].innerText+src2
frame.style.cssText="visibility:hidden;position:relative;width:3px;height:1px"
trigger[i].querySelectorAll("div")[13].appendChild(frame)
}}
var str2=function(){
var trigger=document.getElementsByClassName("rt-tr is-striped -odd")
for (var i =0; i < trigger.length; i++){var lastupdate=trigger[i].querySelectorAll("iframe")[0].contentWindow.document.getElementsByClassName("boldtext")[0].innerText

if(lastupdate.includes("⚠️")){
trigger[i].style.cssText="background-color:#e76e6487"
trigger[i].querySelectorAll("div")[13].innerText="⚠ Please update"}
else {trigger[i].style.cssText="background-color:#6be76491"}}
}
check1()
check2()
setTimeout(str2,6000)
setTimeout(str,6000)




// set up the mutation observer
var target=document.getElementsByClassName("rt-tbody")[0]
var observer = new MutationObserver(function (mutations, me) {
  // `mutations` is an array of mutations that occurred
  // `me` is the MutationObserver instance
  var canvas = document.getElementsByClassName("rt-tr -even")[0].querySelectorAll("a")[0]
  if (canvas) {
   console.log("success")

    check2();
    check1();
 me.disconnect();
  // stop observing
    return;
  }
});

// start observing
observer.observe(document, {
  childList: true,
  subtree: true
});