// ==UserScript==
// @name         Memeflag hider v2
// @version      2.0
// @description  hides memeflag threads and replies, updated 4th Jan 2022
// @author       beige
// @grant        none
// @include      http*://*.4chan.org/pol/*
// @run-at       document-idle
// @namespace    https://greasyfork.org/en/scripts/438016-memeflag-hider-v2
// @license      ayyylmao
// @downloadURL https://update.greasyfork.org/scripts/438016/Memeflag%20hider%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/438016/Memeflag%20hider%20v2.meta.js
// ==/UserScript==

// forked from https://greasyfork.org/users/250780 -- 4th Jan 2022

// uses the built in thread hiding mechanism from the 4chan ext. except in catalog where we just nuke things from a global object. 


(function () {
  "use strict";

  let HIDE_MEMEFLAG_THREADS = true;
  let HIDE_MEMEFLAG_REPLIES = true;

  // hide memeflag threads in catalog
  if (window.location.href.indexOf("pol/catalog") > -1) {
    // catalog is a global
    // memeflag thread countries are "undefined" in /catalog  -- 4th Jan 2022
    let memeflaggotthreads = [];
    Object.keys(catalog.threads).map(function (key, index) {
      if (catalog.threads[key].country === undefined) {
        memeflaggotthreads.push(key);
      }
    });

    memeflaggotthreads.forEach(
      (t) => {
        delete catalog.threads[t]
      }
    );
    // trigger thread list redraw without changing sort order
    document.querySelector('#order-ctrl').dispatchEvent(new Event('change'));

    let hidenum = document.createElement('span');
    hidenum.innerHTML = ` [${memeflaggotthreads.length} memeflags hidden]`;
    document.querySelector('.navLinks')?.appendChild(hidenum);

  } else {
    let hiddencnt = 0;
    if (HIDE_MEMEFLAG_THREADS && window.location.href.indexOf("pol/thread/") === -1) {
      var posts = document.getElementsByClassName("postContainer opContainer");
      for (var currentPostNumber = 0; currentPostNumber < posts.length; currentPostNumber++) {
        if (posts[currentPostNumber].getElementsByClassName("bfl").length || posts[currentPostNumber].getElementsByClassName("flag").length === 0) {
          ThreadHiding.hide(posts[currentPostNumber].id.substr(2));
          hiddencnt++;
        }
      }

    }
    if (HIDE_MEMEFLAG_REPLIES) {
      var replies = document.getElementsByClassName("postContainer replyContainer");
      for (var currentPostNumber = 0; currentPostNumber < replies.length; currentPostNumber++) {
        if (replies[currentPostNumber].getElementsByClassName("bfl").length || replies[currentPostNumber].getElementsByClassName("flag").length === 0) {
          ReplyHiding.hide(replies[currentPostNumber].id.substr(2));
          hiddencnt++;
        }
      }

    }

    let hidenumd = document.createElement('div');
    hidenumd.className = 'thread-stats';
    hidenumd.innerHTML = ` ${hiddencnt} memeflags hidden / `;
    document.querySelector('.navLinks.desktop')?.appendChild(hidenumd);
    document.querySelector('#ctrl-top.desktop')?.appendChild(hidenumd);

  }

})();