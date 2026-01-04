// ==UserScript==
// @name         Prefix title with word count
// @version      1.0
// @description  Prefixes tab title with (approx) page word count
// @author       jamesdeluk
// @match        http://*/*
// @match        https://*/*
// @namespace https://greasyfork.org/users/242246
// @downloadURL https://update.greasyfork.org/scripts/481785/Prefix%20title%20with%20word%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/481785/Prefix%20title%20with%20word%20count.meta.js
// ==/UserScript==

(function () {
  function addCount() {
      let wc=document.body.innerText.match(/[\w\d]+/gi).length;
      let title=document.title;
      document.title="["+wc+"] "+title;
  }
  addCount();
})();