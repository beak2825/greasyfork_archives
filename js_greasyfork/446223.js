// ==UserScript==
// @name         the piratebay torrent helper
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  information helper
// @author       PeerLessSoul
// @match        *://thepiratebay10.org/torrent/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thepiratebay10.org
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446223/the%20piratebay%20torrent%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/446223/the%20piratebay%20torrent%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    // Your code here...'''
    //hello
   function getUrlformhtml(subdetail) {
  let returnvalue = [];
  const reg =
    /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  const strValue = subdetail.match(reg);

  if (strValue && strValue.length > 0) {
    strValue.forEach((element) => {
      returnvalue.push({ link: element });
    });
  }
  return returnvalue;
}

function viewall() {
  let urls = getUrlformhtml($(".nfo")[0].innerHTML);
  if (urls.length > 0) {
    var currnwin ;
    for (let i = 0; i < urls.length; i++) {
         window.open(urls[i].link, "_blank");
    }
  } else {
     let title=$("#title")[0].innerHTML
    window.open("https://cn.bing.com/search?q="+title, "_blank");
    window.open("https://search.bilibili.com/all?keyword="+title, "_blank");
    window.open("https://cn.bing.com/videos/search?q="+title, "_blank");

  }
  return false;
}

function go() {
  //alert(location.href);
  var myHref = document.createElement("a");
  myHref.href = "#";
  myHref.text = "View All";
  myHref.onclick = viewall;

  //var text = document.createTextNode("View All");
  //myHref.appendChild(text);
  $(".nfo").append(myHref);
}
    go();

})();