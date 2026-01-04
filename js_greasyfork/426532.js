// ==UserScript==
// @name        Online Document Viewer
// @namespace   Online Document Viewer
// @match       *://*/*
// @grant       none
// @version     1.0
// @author      K.D.
// @description Open documents in Google docs!
// @downloadURL https://update.greasyfork.org/scripts/426532/Online%20Document%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/426532/Online%20Document%20Viewer.meta.js
// ==/UserScript==

let drive= "https://docs.google.com/viewer?url=",
regex= /.+\.pdf|\.doc|\.docx|\.xls|\.xlsx|\.ppt|\.pptx/i;

function main(a){

a.onclick=()=>{
if(regex.test(a.href)){
   location.href= drive + a.href;
   return false;
}
else{
   location.href= a.href;
   return false;   
}
};    
}   

let google= /google\..+?\/search\?q=/i;
if(google.test(location.href)){
let gLinks= document.querySelectorAll(".Zu0yb.UGIkD.qzEoUe");
gLinks.forEach(link => {
let gURL= link.closest("a");
    gURL.removeAttribute("ping");
setInterval(main(gURL), 2000);
});
}
else{
let allLinks= document.querySelectorAll("a");
allLinks.forEach(link => {
setInterval(main(link), 2000);
});
}