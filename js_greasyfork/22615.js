// ==UserScript==
// @name         Freeport7 visible sage
// @namespace    http://freeport7.org/
// @version      0.0001
// @description  Brings back red sage span on FP7
// @author       紫
// @match        http://freeport7.org/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/22615/Freeport7%20visible%20sage.user.js
// @updateURL https://update.greasyfork.org/scripts/22615/Freeport7%20visible%20sage.meta.js
// ==/UserScript==

(function() {
  "use strict";

  var process, addSage, postsWithSage;

  addSage = function(selected_post) {
    var sage_span, post_id, opening_id, post_info;

    sage_span = document.createElement('span');
    sage_span.className = 'sage';
    sage_span.style.cssText = `
      color: red;
      text-shadow: 0 0 2px red;
      font-weight: bold;
      margin-left: 15px;
      margin-right: 5px;
    `;

    post_id = selected_post.id.replace(/^i/, '');
    opening_id = selected_post.dataset.openingId;
    post_info = selected_post.getElementsByClassName('info')[0];
    if (selected_post.getElementsByClassName('sage').length === 0) {
      post_info.insertAdjacentElement('beforeend', sage_span);
      GM_xmlhttpRequest({
        method: 'GET',
        url: "/" + opening_id + "/" + post_id + ".json",
        onload: function(response) {
          var resp = JSON.parse(response.responseText);
          if (resp.post.sage === true) {
            sage_span.textContent = 'sage';
          }
        }
      });
    }
  };

  process = function() {
    var replies = document.getElementsByClassName('post reply');
    for (var i = 0, len = replies.length; i < len; i++) {
      addSage(replies[i]);
    }
  };

  document.onload = process();
  document.addEventListener('page:update', function() {
    setTimeout(process(), 500);
  });
})();