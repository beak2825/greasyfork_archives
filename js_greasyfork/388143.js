// ==UserScript==
// @name         JVC-Reverso
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Reverse your messages on jeuxvideos.com
// @author       VisionElf
// @match        https://www.jeuxvideo.com/forum/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388143/JVC-Reverso.user.js
// @updateURL https://update.greasyfork.org/scripts/388143/JVC-Reverso.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parent = document.getElementsByClassName("jv-editor-toolbar")[0];
    var newElt = document.createElement("div");
    newElt.className = "btn-group";
    var btn = document.createElement("a");
    btn.className = "xXx btn btn-jv-editor-toolbar";
    btn.title = "Test";
    btn.innerHTML = "Reverse";
    btn.onclick = function (){var a=document.getElementById("message_topic");var b="";var c=a.value;var d=c.split('\n');for(var p=0;p<d.length;p++){var e=d[p].split(' ');var f=[];for(var i=0;i<e.length;i++){var g=e[i];var h="";for(var j=g.length-1;j>=0;j--)h+=g[j];f.push(h);}b+=f.join(' ')+"\n";}a.value=b;}
    newElt.appendChild(btn);
    parent.appendChild(newElt);

//     var allMessages = document.getElementsByClassName("txt-msg  text-enrichi-forum");

//     for (var i = 0; i < allMessages.length; i++)
//     {
//         var message = allMessages[i];
//         var msg = message.children[0];
//         var msgBtn = document.createElement("button");
//         msgBtn.onclick = function (){var a=message.children[0];var b="";var c=a.innerHTML;var d=c.split('\n');for(var p=0;p<d.length;p++){var e=d[p].split(' ');var f=[];for(var i=0;i<e.length;i++){var g=e[i];var h="";for(var j=g.length-1;j>=0;j--)h+=g[j];f.push(h);}b+=f.join(' ')+"\n";}a.innerHTML=b;}
//         msgBtn.innerHTML = "reverse";
//         message.appendChild(msgBtn);
//     }
})();