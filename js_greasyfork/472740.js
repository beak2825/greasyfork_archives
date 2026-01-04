// ==UserScript==
// @name        Fix Twitter text
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      alanmburr
// @description 7/31/2023, 9:39:57 AM
// @match       https://x.com/*
// @match       https://twitter.com/*
// @match       https://tweetdeck.twitter.com/*
// @license     LGPL-3.0-or-above
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVRYhe2WTU4bQRCFv9c2CYso8Swj7HhuEG4QcwLMCWIvcMQOTgA+AexQ7Ej4COQEtk+QyQkyCSBlN4OUVbCnsgCD/xkTUBTJbzfVrXpfdfV0Nyy11D+WHitR/jgqkdW+YB3IYYSgzlU/qf/c8cLheb9WCeKqF08ArDWiCkbu4oN3tIj5m+blvmEHs8YtsbpBLKdNmcKz2qvqYGwEoNCITpE2k8T20kKsNaKKk07SzJURur5tXGXIXdS8AMCNkEpFAOd0mG9e7qdJ6pxSzRPECQT9FbWdwx+K3ynfjL/c9PCGiND6Vj3f8TrTkuaPo5KyaqcBuMtp1bOa17otYGywO4btK6t2vhm3X3+MyhO5MneVpFFPtjVsDpAd+VjhKOnx3iA3ykEp61QqNOPYjI6ZdZUQIFcESw3w/IpgPDYCEEP8EquDDmfkyEmUJZWv1y69OUC8SjwX4EWPIEHfJEJsseVN4z/494c1tgc4FZSewBwz+zotPgKQhdZjGw9pov8TAGHNC4TtPYW7zSjOjQd+bHtHmFUlwkczN+sOTr57AQBk5JLEPovJXfsQaU5rs9OCiSMQOlzsJ5shU+uslpsJMHUFzre9jrD633rLCDP9ZG6eue+BQiOqALtIbx8CYNjG+fb0eyQVwEB+I1pPpPb4ET3fffTSeRCA34jWe3KbwnZJaX597drWfZVPABQ+ReUkISfDl1wRZ4ufiGbdTJ9KOPQESw0Atz2vIL1b1NjEQdqqZwIM5J9EfvKbsokS4EsqDvoviM3sO0YgCNwzWuGUS2appf4b/QHXNfBk6YeX2wAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/472740/Fix%20Twitter%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/472740/Fix%20Twitter%20text.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function ready(callback) {
    if (document.readyState != 'loading') {callback();} else {
        window.document.addEventListener('DOMContentLoaded', callback);
  }} window.ready = ready;

  const currentPageURL = window.location.href;
  if (currentPageURL.startsWith('https://twitter.com') ||
      currentPageURL.startsWith('https://tweetdeck.twitter.com') ||
      currentPageURL.startsWith('https://x.com')
  ) {

    //alert("now we look to see about the it :)");

    var checkBody = (mutationList, observer) => {
      document.querySelectorAll("span").forEach(span => {
        if (span.innerHTML == "Post") {span.innerText = "Tweet";}
        if (span.innerHTML == "Post all") {span.innerText = "Tweet all";}
        if (span.innerHTML == "XPro" || span.innerHTML == "X Pro") {span.innerText = "TweetDeck";}
        if (span.innerHTML == ",") {span.innerHTML = "&nbsp;Preview";}
      });
      document.querySelectorAll(".public-DraftEditorPlaceholder-inner").forEach(span => {
        if (span.innerHTML == "What is happening?!") {span.innerHTML = "What&rsquo;s happening?";}
        if (span.innerHTML == "Tweet your reply!") {span.innerText = "Tweet your reply";}
        if (span.innerHTML == "Post your reply!") {span.innerText = "Tweet your reply";}
        if (span.innerText == "Add another Tweet!") {span.innerText = "Add another Tweet";}
      });
    }

    window.ready(()=>{
      checkBody([document], undefined);

      const title = document.querySelector('head > title');
      document.querySelector('head > title').innerHTML = title.innerText.replace('XPro', 'TweetDeck');

      const headObserver = new MutationObserver((mutationList, observer) => {
        document.querySelector('head > tile').innerHTML = title.innerText('XPro', 'TweetDeck;');
      });
      headObserver.observe(document.head, {childList: true, attributes: true, characterData: true});

      const bodyObserver = new MutationObserver(checkBody);
      bodyObserver.observe(document.body, {childList: true, attributes: true, characterData: true});
    });

    document.querySelectorAll("[data-testid=addButton]").forEach(testId => {
      alert('youre about to add a tweet');
      testId.addEventListener("click", ()=>{
        document.querySelectorAll('div[contenteditable]').forEach(contenteditable => checkBody([testId, contenteditable], undefined));
      });
    });

    setInterval(() => {
      document.title = "TweetDeck";
      const divSelector = ".public-DraftEditorPlaceholder-inner"
      document.body.querySelectorAll("span").forEach(span => {
        if (span.innerHTML == "Post") {span.innerText = "Tweet";}
        if (span.innerHTML == "Post all") {span.innerText = "Tweet all";}
        if (span.innerHTML == "XPro" || span.innerHTML == "X Pro") {span.innerText = "TweetDeck";}
        if (span.innerHTML == ",") {span.innerText = "Preview";}
      });
      document.body.querySelectorAll(divSelector).forEach(span => {
        if (span.innerHTML == "What is happening?!") {span.innerHTML = "What&rsquo;s happening?";}
        if (span.innerHTML == "Tweet your reply!") {span.innerText = "Tweet your reply";}
        if (span.innerHTML == "Post your reply!") {span.innerText = "Tweet your reply";}
        if (span.innerHTML == "Add another Tweet!") {span.innerText = "Add another Tweet";}
      });
    }, 250);
  }
})();