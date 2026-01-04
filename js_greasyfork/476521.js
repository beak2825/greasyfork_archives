// ==UserScript==
// @name         omdbProjectLegacyTool
// @namespace    omdbProjectLegacyTool
// @version      1.4
// @description  adds forum archive, copy uid buttons to osu! forum pages, uid automatically sends to omdb edit pages
// @author       smugsheep (shizume on osu!)
// @match        https://osu.ppy.sh/community/forums/topics/*
// @match        https://osu.ppy.sh/beatmapsets/*/discussion
// @match        *://omdb.nyahh.net/mapset/edit/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476521/omdbProjectLegacyTool.user.js
// @updateURL https://update.greasyfork.org/scripts/476521/omdbProjectLegacyTool.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*
    GM function stuff to send data between omdb and osu sites
  */

  function GM_onMessage(label, callback) {
    GM_addValueChangeListener(label, function() {
      callback(GM_getValue(label));
    });
  }

  function GM_sendMessage(label) {
    GM_setValue(label, Array.from(arguments).slice(1));
  }

  /*
    for osu forum side
  */

  if (window.location.href.indexOf("osu.ppy.sh/community") != -1) {

    /*
      url
    */

    // grab forum topic id
    const forumId = window.location.href.split('/').pop().split('?')[0];

    // calculate forum archive url
    function getArchiveUrl() {
      var n = new URLSearchParams(window.location.search).get("n");
      var startSlug = (n > 15) ? `/start=${15 * Math.floor((n-1) / 15)}` : ''

      return `https://web.archive.org/web/20171206091058/http://osu.ppy.sh/forum/t/${forumId}` + startSlug;
    }

    /*
      archive button
    */

    // create button
    var button = document.createElement('a');
    button.textContent = 'forum archive';
    button.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 30px;
      padding: 10px 20px;
      background-color: #372e32;
      color: white;
      border-radius: 200px;
      cursor: pointer;
    `;

    // open archive in new tab when clicked
    button.addEventListener('click', function (e) {
      e.preventDefault();
      window.open(getArchiveUrl(), '_blank');
    });

    document.body.appendChild(button);

    /*
      uid stuff
    */

    // get forum element to observe, keep track of post usernames
    const forumPage = document.getElementsByClassName('osu-page--forum-topic')[0];
    var unseen = document.querySelectorAll('a.forum-post-info__row--username');
    var seen = [];

    // create copy uid link for every unseen post
    function createUIDLinks() {
      unseen.forEach(function(userLink) {
        var userID = userLink.getAttribute('data-user-id');
        var copyLink = document.createElement('a');

        copyLink.href = '#';
        copyLink.textContent = 'copy UID';
        copyLink.style.cssText = `
          font-size: 0.6em;
        `;

        copyLink.addEventListener('click', function(event) {
          event.preventDefault();
          navigator.clipboard.writeText(userID);
          GM_sendMessage('_.UID.desu.wa', userID, window.location.href);
        });

        userLink.parentNode.insertBefore(copyLink, userLink.nextSibling);

        seen.push()
      });

      unseen = [];
    }

    // observer for forum page, get new posts while scrolling to new area
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(addedNode => {
            if (addedNode.nodeType === Node.ELEMENT_NODE) {
              unseen = [...unseen, ...addedNode.querySelectorAll('a.forum-post-info__row--username')];
            }
          });
        }
        createUIDLinks();
      });
    });

    // observe, and run once on initial load
    observer.observe(forumPage, { childList: true });
    createUIDLinks();
  }

  /*
    for omdb side
  */

  else if (window.location.href.indexOf("omdb.nyahh.net") != -1) {

    // get elements
    const inputFields = document.querySelectorAll(`input[id^="add-mapper"]`);
    const addButtons = document.querySelectorAll(`input[id^="add-mapper"]`);
    const metaComments = document.querySelectorAll(`input[id^="meta-comment"]`);

    // get active element id
    function getActiveID() {
      for (const input of inputFields) {
        if (input.offsetParent !== null) {
          return input.id.split("-").pop();
        }
      }
    }

    // enter info from osu site
    function enterUID(info) {
      let curr = getActiveID();

      let input = document.getElementById("add-mapper-input-" + curr);
      let button = document.getElementById("add-mapper-btn-" + curr);
      let comment = document.getElementById("meta-comment-" + curr);

      input.value = info[0];
      comment.value = info[1];
      button.click();
    }

    // listener for osu side updates
    GM_onMessage('_.UID.desu.wa', function(message) {
      console.log('[new UID recieved]', message);
      enterUID(message);
    });
  }

  /*
    for osu discussion -> old forum link change
  */

  else if (window.location.href.indexOf("osu.ppy.sh/beatmapsets") != -1) {

    // run until found since discussions don't load instantly
    const timeoutdesuwa = setTimeout(() => {
      // change link if banchobot old forum post
      const discussions = document.querySelectorAll('.osu-md--discussions');
      discussions.forEach(discussion => {
        const text = discussion.querySelector('p');
        if (text && text.textContent.includes('find the associated discussion')) {
          text.querySelector('a').target = '_self';
        }
      });

      clearTimeout(timeoutdesuwa);
    }, 1000);
  }

})();