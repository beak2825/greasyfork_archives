// ==UserScript==
// @name Fix and Trash
// @namespace FNT
// @description One click to fix and trash editing forum.
// @include https://apollo.rip/forums.php?action=viewthread*
// @version 0.1
// @grant none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/29419/Fix%20and%20Trash.user.js
// @updateURL https://update.greasyfork.org/scripts/29419/Fix%20and%20Trash.meta.js
// ==/UserScript==
function main(){
//Duplicate the Trash button.
rightButtons = document.querySelector("[name=trash]").parentNode
rightButtons.innerHTML += "<input name='FNT' id='FNTBtn' value='Fix and Trash' type='Button'>"
authkey = document.documentElement.outerHTML.split("authkey=")[1].split("\"")[0];
document.getElementById("FNTBtn").onclick = function(){FNT()};
}
function FNT(){
//Retrieve the thread title.
threadTitle = document.getElementById("thread_title_textbox").value;
newTitle = "[FIXED] "+threadTitle;
trashThread(newTitle);
}
function trashThread(newTitle){
console.log("Fixing and trashing "+newTitle)
var postObj = $.post(
'/forums.php',
{"action":"mod_thread","auth":authkey,"threadid":window.location.href.split("action=viewthread&threadid=")[1].split("&")[0],"page":1,"ranking":0,"title":newTitle,"forumid":"34","trash":"Trash"},
function(r){
console.log(r);
if (r.indexOf('[FIXED]') >= 0){
console.log("Fix successful.")
document.getElementById("FNTBtn").value = "Fixed and Trashed."
}else{
alert("Move thread failed.");
}
},
'html'
);
postObj.fail(function(){
//Failed to get data.
alert("Move thread failed.");
return;
})
}
main();