// ==UserScript==
// @name          CSS: twitter.com
// @description   Corrections to UI of twitter.com
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://twitter.com/*
// @match         *://mobile.twitter.com/*
// @match         *://x.com/*
// @match         *://mobile.x.com/*
// @icon          data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACWUlEQVRYhe2WTU4bQRCFv9c2CYso8Swj7HhuEG4QcwLMCWIvcMQOTgA+AexQ7Ej4COQEtk+QyQkyCSBlN4OUVbCnsgCD/xkTUBTJbzfVrXpfdfV0Nyy11D+WHitR/jgqkdW+YB3IYYSgzlU/qf/c8cLheb9WCeKqF08ArDWiCkbu4oN3tIj5m+blvmEHs8YtsbpBLKdNmcKz2qvqYGwEoNCITpE2k8T20kKsNaKKk07SzJURur5tXGXIXdS8AMCNkEpFAOd0mG9e7qdJ6pxSzRPECQT9FbWdwx+K3ynfjL/c9PCGiND6Vj3f8TrTkuaPo5KyaqcBuMtp1bOa17otYGywO4btK6t2vhm3X3+MyhO5MneVpFFPtjVsDpAd+VjhKOnx3iA3ykEp61QqNOPYjI6ZdZUQIFcESw3w/IpgPDYCEEP8EquDDmfkyEmUJZWv1y69OUC8SjwX4EWPIEHfJEJsseVN4z/494c1tgc4FZSewBwz+zotPgKQhdZjGw9pov8TAGHNC4TtPYW7zSjOjQd+bHtHmFUlwkczN+sOTr57AQBk5JLEPovJXfsQaU5rs9OCiSMQOlzsJ5shU+uslpsJMHUFzre9jrD633rLCDP9ZG6eue+BQiOqALtIbx8CYNjG+fb0eyQVwEB+I1pPpPb4ET3fffTSeRCA34jWe3KbwnZJaX597drWfZVPABQ+ReUkISfDl1wRZ4ufiGbdTJ9KOPQESw0Atz2vIL1b1NjEQdqqZwIM5J9EfvKbsokS4EsqDvoviM3sO0YgCNwzWuGUS2appf4b/QHXNfBk6YeX2wAAAABJRU5ErkJggg==
// @version       1.1.5
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/452411/CSS%3A%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/452411/CSS%3A%20twittercom.meta.js
// ==/UserScript==

(function() {
  //CSS for any mode
  var css = `
  /*No opacity for header*/
  .r-6026j { /*white UI*/
    background-color: rgba(255, 255, 255, 1) !important;
  }
  .r-ii8lfi { /*dim UI*/
    background-color: rgba(21, 32, 43, 1) !important;
  }
  .r-5zmot { /*lights out UI*/
    background-color: rgba(0, 0, 0, 1) !important;
  }
  .r-1e5uvyk {
    backdrop-filter: none !important;
  }
  /*Add bottom border to header*/
  main[role="main"] div[data-testid="primaryColumn"] > div[tabindex="0"] > div, /*Desktop browser*/
  div[data-testid="TopNavBar"] { /*Mobile browser*/
    border-bottom-width: 1px !important;
    border-bottom-style: solid !important;
    border-bottom-color: rgb(239, 243, 244) !important;
  }
  /*No opacity for floating button in mobile twitter*/
  div#layers aside > div[data-testid="FloatingActionButtonBase"] {
    opacity: 1 !important;
  }
  /*No opacity for bottom bar in mobile twitter*/
  div#layers div[data-testid="BottomBar"] {
    opacity: 1 !important;
  }
  .r-1i6wzkk {
    transition-property: unset !important;
  }
  `;

  if (typeof GM_addStyle != 'undefined') {
    GM_addStyle(css);
  } else if (typeof PRO_addStyle != 'undefined') {
    PRO_addStyle(css);
  } else if (typeof addStyle != 'undefined') {
    addStyle(css);
  } else {
    var node = document.createElement('style');
    node.type = 'text/css';
    node.appendChild(document.createTextNode(css));
    document.documentElement.appendChild(node);
  }
})();
