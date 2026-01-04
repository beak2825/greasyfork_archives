// ==UserScript==
// @name        Reddit Comment Sort Top
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/r/*
// @grant       none
// @version     1.0
// @author      -
// @description 11/12/2019, 3:02:52 PM
// @downloadURL https://update.greasyfork.org/scripts/392315/Reddit%20Comment%20Sort%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/392315/Reddit%20Comment%20Sort%20Top.meta.js
// ==/UserScript==
var content = document.querySelector("#siteTable")
var moc = { attributes: false, childList: true, subtree: false };
var mo = new MutationObserver(function(){
    var links = document.querySelectorAll("a.bylink.comments.may-blank:not(.gm-sort-added)");
    links.forEach(function(l){
      var url = new URL(l.getAttribute("href"));
      if (url.searchParams.get('sort') !== 'top') {
        url.searchParams.set('sort','top');
        l.setAttribute("href",url.href);
        l.className += " gm-sort-added";
      }
    });
});
mo.observe(content,moc);
