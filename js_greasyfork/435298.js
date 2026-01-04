// ==UserScript==
// @name         穿越广播转发里世界
// @namespace    https://www.douban.com/people/MoNoMilky/
// @version      0.3
// @description  Add link to post inner space
// @match        https://www.douban.com/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @author       Bambooom
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435298/%E7%A9%BF%E8%B6%8A%E5%B9%BF%E6%92%AD%E8%BD%AC%E5%8F%91%E9%87%8C%E4%B8%96%E7%95%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/435298/%E7%A9%BF%E8%B6%8A%E5%B9%BF%E6%92%AD%E8%BD%AC%E5%8F%91%E9%87%8C%E4%B8%96%E7%95%8C.meta.js
// ==/UserScript==

(function() {
  'use strict';
  // both self & others
  var posts = document.querySelectorAll('.status-wrapper > .reshared_by');

  Array.from(posts).map(po => {
    var prefix = po.querySelector('a').href;
    var id = po.nextElementSibling.getAttribute('data-reshare-id'); // self
    if (!id) { // others
      var comment = po.parentElement.nextSibling.nextSibling; // comment like 3649983909, say.html, reshared
      id = comment.nodeValue.trim().split(',')[0];
    }

    var link = document.createElement('a');
    link.textContent = '里世界';
    link.href = prefix + 'status/' + id;
    link.target = '_blank';
    link.style = 'margin-left: 10px;';
    po.insertBefore(link, null);
  });

})();