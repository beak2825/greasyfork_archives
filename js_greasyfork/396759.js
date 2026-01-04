// ==UserScript==
// @name         Nyaa bad uploaders
// @namespace    NyaaBadUps888
// @version      0.1
// @description  Will blur the title of the torrent that start with the words in names array
// @author       Samu
// @match        https://nyaa.si/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/396759/Nyaa%20bad%20uploaders.user.js
// @updateURL https://update.greasyfork.org/scripts/396759/Nyaa%20bad%20uploaders.meta.js
// ==/UserScript==

(function() {

  /**

  [Judas] video quality is bad, file size is small

  **/

  //Group name must be first word in the title
  var names = [
    "[Judas]",
  ];
  var selectors = names.map(name => `a[href^='/view'][title^='${name}']`);

  GM_addStyle(`
    ${selectors.join(",\n")} {
      filter: blur(2px);
      opacity: 0.7;
    }
  `);

})();