// ==UserScript==
// @namespace https://trajano.net
// @name     Ignore low downvotes on own post
// @version  1
// @locale en
// @description Zeros out low down votes for your own post.
// @include  https://stackoverflow.com/*
// @grant    none
// @license EPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/498204/Ignore%20low%20downvotes%20on%20own%20post.user.js
// @updateURL https://update.greasyfork.org/scripts/498204/Ignore%20low%20downvotes%20on%20own%20post.meta.js
// ==/UserScript==
(function() {
  'use strict';
  const whoami = document.querySelector("#user-profile-button").href
  
  if (document.querySelector("#question .post-signature.owner a").href == whoami) {
    const voteElement = document.querySelector("#question div.js-vote-count")
    const score = parseInt(voteElement.textContent) 
    if (score > -10 && score < 0) {
      voteElement.textContent = "0"
    }
  }

})();