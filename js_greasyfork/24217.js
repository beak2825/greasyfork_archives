// ==UserScript==
// @name         kukuku link to green
// @namespace   https://greasyfork.org/zh-CN/users/15432-kirikiri
// @version      0.2
// @description  kukuku串内网址激活
// @author       kirikiri
// @match        http://www.kukuku.cc/*
// @match        https://h.nimingban.com/*
// @match        http://h.adnmb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24217/kukuku%20link%20to%20green.user.js
// @updateURL https://update.greasyfork.org/scripts/24217/kukuku%20link%20to%20green.meta.js
// ==/UserScript==

//(function() {
//    'use strict';
var link = /((https?:\/\/)(\w|-|#|\?|=|\/|\.|\+|%|&|:|;|!)+)/g;
activelink(link);
function activelink(lnk){
  var content = document.getElementsByClassName("h-threads-content");
//console.log(content);
  for(i=0;i<document.getElementsByClassName("h-threads-content").length;i++){
 //   console.log(content[i].innerHTML);
    var match = content[i].innerHTML.match(lnk);
    console.log(match);
    if (match) {
     content[i].innerHTML = content[i].innerHTML.replace(lnk, '<a target="_blank" href="$1" style="color: rgb(63, 211, 68); text-decoration:none;">$1</a>');
     }
  }
}
    // Your code here...
//})();
