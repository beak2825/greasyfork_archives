
// ==UserScript==
// @name        Mastodon - linki kierują do tej samej instancji - 101010.pl 
// @description	Modyfikacja, dzięki której linki do postów i kont, kierują do tej samej instancji Mastodon - 101010.pl
// @version     1.1
// @author      JaZOsobna
// @include     https://101010.pl*
// @match       https://*/web/*
// @homepageURL https://greasyfork.org/pl/users/864966-jazosobna
// @namespace	  https://greasyfork.org/pl/users/864966-jazosobna
// @grant       none
// @run-at      document-end
// @resource    metadata https://greasyfork.org/scripts/438550-mastodon-linki-kieruj%C4%85-do-tej-samej-instancji-101010-pl/code/Mastodon%20-%20linki%20kieruj%C4%85%20do%20tej%20samej%20instancji%20-%20101010pl.user.js
// @icon        https://external-content.duckduckgo.com/ip3/joinmastodon.org.ico
// @icon64      https://external-content.duckduckgo.com/ip3/joinmastodon.org.ico
// @downloadURL https://update.greasyfork.org/scripts/438550/Mastodon%20-%20linki%20kieruj%C4%85%20do%20tej%20samej%20instancji%20-%20101010pl.user.js
// @updateURL https://update.greasyfork.org/scripts/438550/Mastodon%20-%20linki%20kieruj%C4%85%20do%20tej%20samej%20instancji%20-%20101010pl.meta.js
// ==/UserScript==
(async function() {
"use strict";

  async function cb () {
    // console.log("test m");
    const mastodon = document.querySelectorAll("#mastodon");
    const tabindex = document.querySelectorAll("#mastodon > div[tabindex]");
    const ui = document.querySelectorAll("#mastodon > * > .ui");
    const main = document.querySelectorAll(".columns-area__panels__main");
    
    const column = document.querySelectorAll(".column[role=region][arial-label='Strona główna']");
    const list = document.querySelectorAll(".item-list[role=feed]");
    const els = document.querySelectorAll(".item-list[role=feed] > article");
    // console.log("test m",mastodon,tabindex,ui,main,column,list,els);
    for (const el of els) {
      // console.log("el",el);
      
      const notifyAnchorEl = el.querySelector(".notification .notification__display-name");
      if (notifyAnchorEl) {
         const notifyId = notifyAnchorEl.getAttribute("to").split("/")[2];
         const notifyNewUrl = `https://101010.pl/web/accounts/${notifyId}`;
         
         const notifyOriginalHref = notifyId.href;
         notifyAnchorEl.href = notifyNewUrl;
         notifyAnchorEl.dataset.ldiOriginalUrl = notifyOriginalHref;
      }
      
      const notifyAccountAnchorEl = el.querySelector(".notification .account__display-name");
      if (notifyAccountAnchorEl) {
         const notifyAccountId = notifyAccountAnchorEl.getAttribute("to").split("/")[2];
         const notifyAccountNewUrl = `https://101010.pl/web/accounts/${notifyAccountId}`;
         
         const notifyAccountOriginalHref = notifyAccountId.href;
         notifyAccountAnchorEl.href = notifyAccountNewUrl;
         notifyAccountAnchorEl.dataset.ldiOriginalUrl = notifyAccountOriginalHref;
      }
      
      
      const postAnchorEl = el.querySelector(".status__info > a.status__relative-time");
      // console.log("postAnchorEl",postAnchorEl);
      if (!postAnchorEl) { continue; }
      if (postAnchorEl.dataset.ldiOriginalUrl) { continue; }
      // console.log("brak ldiOriginalUrl")
      const postId = el.dataset.id;
      // console.log("postId",postId);
      if (!postId) { continue; }
      const postNewUrl = `https://101010.pl/web/statuses/${postId}`;
      
      const postOriginalHref = postAnchorEl.href;
      postAnchorEl.href = postNewUrl;
      postAnchorEl.dataset.ldiOriginalUrl = postOriginalHref;
      
      
      const authorAnchorEl = el.querySelector(".status__info > a.status__display-name");
      
      const authorId = authorAnchorEl.dataset.id;
      const authorNewUrl = `https://101010.pl/web/accounts/${authorId}`;
      
      const authorOriginalHref = authorAnchorEl.href;
      authorAnchorEl.href = authorNewUrl;
      authorAnchorEl.dataset.ldiOriginalUrl = authorOriginalHref;
      
      
      const retweetAuthorAnchorEl = el.querySelector(".status__prepend > span > a.status__display-name");
      if (!retweetAuthorAnchorEl) { continue; }
      
      const retweetAuthorId = retweetAuthorAnchorEl.dataset.id;
      const retweetAuthorNewUrl = `https://101010.pl/web/accounts/${retweetAuthorId}`;
      
      const retweetAuthorOriginalHref = retweetAuthorAnchorEl.href;
      retweetAuthorAnchorEl.href = retweetAuthorNewUrl;
      retweetAuthorAnchorEl.dataset.ldiOriginalUrl = retweetAuthorOriginalHref;
      
    }

//     const authorAnchorEl = document.querySelector(".detailed-status > a.detailed-status__display-name");

//     const authorId = authorAnchorEl.dataset.id;
//     const authorNewUrl = `https://101010.pl/web/accounts/${authorId}`;

//     const authorOriginalHref = authorAnchorEl.href;
//     authorAnchorEl.href = authorNewUrl;
//     authorAnchorEl.dataset.ldiOriginalUrl = authorOriginalHref;
    
  }
  
  cb();
  // setTimeout(cb,1000);
  setInterval(cb,1000);

})();
