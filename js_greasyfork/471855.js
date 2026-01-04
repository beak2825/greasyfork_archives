// ==UserScript==
// @name        RedditSave button (old reddit)
// @namespace   Violentmonkey Scripts
// @match       https://old.reddit.com/*
// @grant       none
// @version     1.0
// @author      thismoon
// @description created on 2022-06-12, 12:35:31 a.m.
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/471855/RedditSave%20button%20%28old%20reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/471855/RedditSave%20button%20%28old%20reddit%29.meta.js
// ==/UserScript==
buttons = document.querySelectorAll('[data-kind="video"] > .entry > .top-matter > .flat-list, [data-kind="gif"] > .entry > .top-matter > .flat-list');
Array.prototype.forEach.call( buttons, function( node ) {
      //node.parentNode.removeChild( node );
      //node.style.opacity = 0.5;

      //create the button

      //const post = node.parentNode
      //const url = post.querySelector('.title > a').getAttribute("href");
      //const saveurl = 'https://redditsave.com' + url;
      const url = node.querySelector('.comments').getAttribute("href").replace("old.reddit", "redditsave");
      const savebtn = document.createElement("li");
      const link = document.createElement("a");
      //link.href = saveurl;
      link.href = url;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      savebtn.appendChild(link);

      const textnode = document.createTextNode("redditsave");
      link.appendChild(textnode);




      node.appendChild(savebtn);
});