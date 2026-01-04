// ==UserScript==
// @name         Shush Extension
// @namespace    http://www.shush.se/userscript/
// @version      1.4.8
// @description  Provides video playback on certain videos
// @author       Shush
// @match        http://www.shush.se/*
// @match        https://www.shush.se/*
// @grant        GM_xmlhttpRequest
// @connect      mycdn.me
// @connect      uptostream.com
// @connect      drive.google.com
// @connect      vidto.me
// @connect      vidzi.tv
// @connect      vidzi.si
// @connect      thevideo.me
// @connect      estream.to
// @connect      verystream.com
// @connect      *
// @noframes
// @run-at       document-start
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/497501/Shush%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/497501/Shush%20Extension.meta.js
// ==/UserScript==

function checkReq(){var list=document.getElementById("gkpluginsExtListReq");if(list==null){return;}
list.title="ready";if(list.childNodes.length>0){var curReq=list.firstChild;if(typeof curReq.innerHTML=="undefined"){list.removeChild(curReq);return;}
var obj=JSON.parse(atob(curReq.innerHTML));obj.onload=obj.onerror=obj.onabor=function(response){var txtout=document.createElement("textarea");txtout.id=obj.extreqid;txtout.style.display="none";var Hfres=response.status+" "+response.statusText+"\r\n"+response.responseHeaders;if(response.finalUrl){Hfres+="FinalLocation: "+response.finalUrl+"\r\n";}
if(obj.returndtaescape){txtout.value=escape(Hfres+"\r\n"+response.responseText);}else if(obj.returndtab64){txtout.value=btoa(Hfres+"\r\n"+response.responseText);}else{txtout.value=Hfres+"\r\n"+response.responseText;}
document.body.appendChild(txtout);};GM_xmlhttpRequest(obj);list.removeChild(curReq);}}
setInterval(checkReq,100);