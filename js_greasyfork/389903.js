// ==UserScript==
// @name         Yahoo Mail - No More Ads
// @namespace    https://levelkro.net
// @version      0.4
// @description  Remove ads from main content
// @author       levelKro (https://levelkro.com)
// @match        https://mail.yahoo.com/*
// @grant        none
// @license MIT
// @copyright 2018, levelKro (https://levelkro.com) (https://openuserjs.org/users/levelKro)
// @downloadURL https://update.greasyfork.org/scripts/389903/Yahoo%20Mail%20-%20No%20More%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/389903/Yahoo%20Mail%20-%20No%20More%20Ads.meta.js
// ==/UserScript==
var folderText="<i>error: folder name not found</i>";
console.log("Yahoo Mail - No More Ads loaded");
setInterval(function(){
    var box_main=document.getElementById("mail-app-component");
    var box_child=box_main.children;
    var box_child_obj=Object.values(box_child);
    box_child_obj.forEach(function(item,id,arr) {
        if(item.style!="" && item.className==""){
            if(item.innerHTML!=folderText){
                var span = item.getElementsByTagName("span");
                folderText = span[0].innerHTML;
                item.innerHTML = folderText;
                //item.style="";
                //item.style.width=0;
                //item.style.heigth=0;
                //item.style.display="none";
            }
        }
    });
    var iframes=document.getElementsByTagName("iframe");
    var iframes_obj=Object.values(iframes);
    iframes_obj.forEach(function(item,id,arr) {
        if(item.src!="about:blank"){
            item.style.width=0;
            item.style.heigth=0;
            item.style.display="none";
            item.src="about:blank";
        }
    });
    if(document.getElementById("boxSKY")) document.getElementById("boxSKY").innerHTML="";
    if(document.getElementById("slot_LREC")) document.getElementById("slot_LREC").innerHTML="";
    if(document.getElementById("slot_LREC4")) document.getElementById("slot_LREC4").innerHTML="";

}, 500);