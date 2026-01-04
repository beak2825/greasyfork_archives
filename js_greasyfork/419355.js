// ==UserScript==
// @name          CSS: m.facebook.com - text copy
// @description   Corrections to UI of Facebook for mobile browsers: text copy enabled
// @author        MK
// @namespace     max44
// @homepage      https://greasyfork.org/en/users/309172-max44
// @match         *://m.facebook.com/*
// @icon          https://static.xx.fbcdn.net/rsrc.php/yD/r/d4ZIVX-5C-b.ico
// @version       1.3.2
// @license       MIT
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/419355/CSS%3A%20mfacebookcom%20-%20text%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/419355/CSS%3A%20mfacebookcom%20-%20text%20copy.meta.js
// ==/UserScript==

(function() {
  var css = `
  /*Remove the link which covers the whole message text*/
  /*a._5msj {
    visibility: hidden !important;
  }*/

  /*Make cursor normal*/
  .ssr [data-action-id], .ssr, .m {
    cursor: auto !important;
    -webkit-text-size-adjust: auto !important;
    -moz-text-size-adjust: auto !important;
    -ms-text-size-adjust: auto !important;
    -o-text-size-adjust: auto !important;
    text-size-adjust: auto !important;
  }

  /*Allow text selection*/
  .m, html.unselectable * {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    -o-user-select: text !important;
    user-select: text !important;
  }


  /*Normalize font sizes*/

  /*Number of reactions under post - make its text smaller*/
  /*div.m.bg-s2 > div[data-type="container"] > div[data-mcomponent$="TextArea"] > div.native-text,
  div.m.bg-s3 > div[data-type="container"] > div[data-mcomponent$="TextArea"] > div.native-text {
    font-size: var(--tiny-font-size) !important;
  }*/

  /*Name of comment's author - make it's text bigger*/
  div.m.bg-s3 > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f6,
  div.m.bg-s3 > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-type="transactional"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f6,
  div.m.bg-s6 > div[data-mcomponent$="TextArea"] > div.native-text > span.f6,
  div.m.bg-s2 > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-mcomponent="MContainer"] > div[data-type="transactional"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f6 {
    font-size: var(--regular-font-size) !important;
  }
  /*Reactions panel under comment - make its text smaller*/
  /*div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-type="transactional"]:last-of-type > div[data-type="container"] > div[data-mcomponent$="TextArea"] > div.native-text,
  div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-type="transactional"]:last-of-type > div[data-type="container"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f2,
  div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-type="transactional"]:last-of-type > div[data-type="container"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f2,
  div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-type="transactional"]:last-of-type > div[data-type="container"] > div[data-mcomponent="MContainer"]:not(.bg-s6) > div[data-mcomponent$="TextArea"] > div.native-text {
    font-size: var(--tiny-font-size) !important;
  }*/

  /*Name of unfolded reply's to comment author - make its text smaller*/
  /*div.m.bg-s2 > div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text > span.f2,
  div.m.bg-s2 > div[data-mcomponent="MContainer"] > div[data-type="container"] > div[data-mcomponent="MContainer"] > div[data-mcomponent$="TextArea"] > div.native-text {
    font-size: var(--tiny-font-size) !important;
  }*/
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