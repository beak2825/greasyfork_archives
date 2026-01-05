// ==UserScript==
// @name         Quick Otonomai downloads
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  No more having to wait 5 seconds!
// @author       You
// @match        http://otonomai.me/forum/files/file/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14233/Quick%20Otonomai%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/14233/Quick%20Otonomai%20downloads.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

// Get the parent

DownloadButton();

function DownloadButton(){
var parent = $(".ipsToolList.ipsToolList_vertical.ipsClearfix");
var link = $(".ipsButton.ipsButton_fullWidth.ipsButton_large.ipsButton_important").first().attr("href");
console.log(link);
var node = document.createElement("li");
var linkNode = document.createElement("a");
linkNode.classList.add("ipsButton","ipsButton_fullWidth","ipsButton_large","ipsButton_important");
node.classList.add("ipsToolList","ipsToolList_vertical","ipsClearfix");
linkNode.innerText = "Quick Download";
linkNode.href = "#pass";
node.appendChild(linkNode);
linkNode.addEventListener("click",function(){
$.get(link).then(function(data){
var target = $(data).find(".ipsButton.ipsButton_primary.ipsButton_small").first().attr("href");
var downloadLink = target.split(/&csrfKey/)[0];
$.get(downloadLink).then(function(){
linkNode.href = downloadLink;
linkNode.innerText = "Ready to Download";
})
})
})

parent.append(linkNode);

return ;
}
