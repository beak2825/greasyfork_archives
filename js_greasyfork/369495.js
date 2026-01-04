// ==UserScript==
// @name        Arxiv Full-Author
// @name:en        Arxiv Full-Author
// @name:ja        Arxiv Full-Author
// @description:en This script automatically redirects you to full author name search instead of the last name+monogram
// @description:ja このスクリプトでは、姓+モノグラムではなく完全な著者名検索に自動的にリダイレクトされます
// @version        0.42^69cdb
// @author         ad48
// @match          *://www.arxiv.org/*
// @match          *://arxiv.org/*
// @run-at         document-start
// @namespace https://greasyfork.org/users/184097
// @description This script automatically redirects you to full author name search instead of the last name+monogram
// @downloadURL https://update.greasyfork.org/scripts/369495/Arxiv%20Full-Author.user.js
// @updateURL https://update.greasyfork.org/scripts/369495/Arxiv%20Full-Author.meta.js
// ==/UserScript==
var elhref;

setInterval(function() {
  var els = document.getElementsByTagName("a");
  for(var i=0;i<els.length;i++) {
    elhref=els[i].getAttribute("href");
    if(elhref && elhref.includes("?searchtype=author")) {
      els[i].setAttribute("href","/search/?searchtype=author&query="+els[i].innerText);
    }
  }
},350);