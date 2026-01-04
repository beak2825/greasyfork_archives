// ==UserScript==
// @name        ScriptSource: The Leading Portal for Web Apps [YouTube / Reddit]
// @namespace    -
// @version      38.9
// @description  Currently trusted by over 100,000 users!
// @author       Sammy «Z»#7383
// @match        *://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @require https://greasyfork.org/scripts/368273-msgpack/code/msgpack.js?version=598723
// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require https://code.jquery.com/ui/1.12.0/jquery-ui.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.0/jquery-confirm.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/381666/ScriptSource%3A%20The%20Leading%20Portal%20for%20Web%20Apps%20%5BYouTube%20%20Reddit%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/381666/ScriptSource%3A%20The%20Leading%20Portal%20for%20Web%20Apps%20%5BYouTube%20%20Reddit%5D.meta.js
// ==/UserScript==

if (window.location.href.includes("reddit")){ // "Old reddit, please!"
   if (!window.location.href.includes("old.reddit") && window.oldReddit) window.location.assign(window.location.href.replace("https://www.", "old."));
} else {
  var currentTitle = "";
  setInterval(() => {
     if (window.location.href.includes("watch")){
         if (document.title != currentTitle || !(document.querySelector("#timeBtn"))){
             let btn = document.createElement("button");
             btn.id = "timeBtn";
             btn.style = "width: 150px; height: 50px; font-size: 17.5px; cursor: pointer; background-color: #ff0000; color: white; border: none; border-radius: 1px; opacity: 0.95; outline: none; box-shadow: 0 10px 30px 0 rgba(73,85,114,.18);";
             btn.innerText = "Get Time!";
             document.querySelector("#meta-contents").appendChild(btn);
             currentTitle = document.title;
             $(btn).click(() => {
                 let w = window.open("http://scriptsourceapp.com/portal.html?yturl="+window.location.href.split("v=")[1], null, `height=497, width=1009, status=yes, toolbar=no, menubar=no, location=no`);
             });
         }
     }
  }, 50);
}
