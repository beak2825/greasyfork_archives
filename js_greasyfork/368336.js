// ==UserScript==
// @name         Inviter
// @namespace    http://codeot.com
// @version      0.1
// @description  facebook invite
// @author       Talha Habib
// @email        talha@codeot.com
// @match        *://*.facebook.com/*
// @downloadURL https://update.greasyfork.org/scripts/368336/Inviter.user.js
// @updateURL https://update.greasyfork.org/scripts/368336/Inviter.meta.js
// ==/UserScript==

// -- start

function inviteAll(){
    console.log("firing");
    appendHTML(document.querySelector(".status_mt"),"<p>Firing inviter</p>");
for(var i=0; i<=document.querySelectorAll('._5i_q span ._42ft:not(._42fr):not(._59pe)').length;i++){
  setTimeout(Inviter,3000*i,i,document.querySelectorAll('._5i_q span ._42ft:not(._42fr):not(._59pe)').length);
 }
}
function Inviter(i,l){
     console.log("Invited "+ parseInt(i+1) +" Out of "+l);
     appendHTML(document.querySelector(".status_mt"),"<p>Invited "+ parseInt(i+1) +" Out of "+l+"</p>");
     if(parseInt(i+1)==l){
         console.log("Trigger new");
         appendHTML(document.querySelector(".status_mt"),"<p>Reached End of Block</p>");
         if(document.querySelectorAll("a[rel='async'].pam").length==1){
             loadMore();
             console.log("Got some more");
             appendHTML(document.querySelector(".status_mt"),"<p>Got some more</p>");
             setTimeout(inviteAll,5000);
         }else{
             console.log("--------------Closing-----------------");
             console.log("Invited all of them");
             appendHTML(document.querySelector(".status_mt"),"<p>Invited all of them</p>");
             appendHTML(document.querySelector(".status_mt"),"<p>Closing in 2 seconds</p>");
             setTimeout(function(){
                 document.querySelector(".status_mt").remove();
             },2000);
         }
     }else{
         if(document.querySelectorAll('._5i_q span ._42ft:not(._42fr):not(._59pe)').length>0){
             document.querySelectorAll('._5i_q span ._42ft:not(._42fr):not(._59pe)')[i].click();
         }else{
             console.log("Nothing to invite");
             appendHTML(document.querySelector(".status_mt"),"<p>Nothing to invite</p>");
             console.log("Checking more entries");
             appendHTML(document.querySelector(".status_mt"),"<p>Checking more entries</p>");
             if(document.querySelectorAll("a[rel='async'].pam").length==1){
                 console.log("Loading more");
                 appendHTML(document.querySelector(".status_mt"),"<p>Loading more...</p>");
                 loadMore();
                 setTimeout(inviteAll,5000);
             }else{
                 console.log("Nothing found");
                 appendHTML(document.querySelector(".status_mt"),"<p>Nothing found</p>");
                 return false;
             }
         }
     }
}
function loadMore(){
    document.querySelectorAll("a[rel='async'].pam")[0].click();
}
document.addEventListener ("keydown", function (zEvent) {
    if (zEvent.ctrlKey  &&  zEvent.altKey  &&  zEvent.code === "KeyG") {
       if(document.querySelectorAll(".status_mt").length==0){
         appendHTML(document.body,'<div class="status_mt" style="overflow:auto;position:absolute;top:0;left:0;width:300px;height:300px;background:white;z-index:99999;padding:10px"></div>');
       }
       appendHTML(document.querySelector(".status_mt"),"<p>Key Detected</p>");
       console.log("Key Detected");
       inviteAll();
    }
});

function appendHTML(element,html){
    var t = parseHTML(html);
    element.insertBefore(t, element.firstChild);
}
function parseHTML(html) {
    var t = document.createElement('template');
    t.innerHTML = html;
    return t.content.cloneNode(true);
}
// -- end
