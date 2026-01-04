// ==UserScript==
// @name         HackerNews Links recap with Comment Anchors
// @namespace    PoKeRGT
// @version      1.00
// @icon         https://www.google.com/s2/favicons?sz=64&domain=news.ycombinator.com
// @description  Shows list of links in article page as an overlay when clicking a button, with anchors to comments
// @author       PoKeRGT
// @match        https://news.ycombinator.com/item?*
// @grant        GM_addElement
// @run-at       document-end
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502980/HackerNews%20Links%20recap%20with%20Comment%20Anchors.user.js
// @updateURL https://update.greasyfork.org/scripts/502980/HackerNews%20Links%20recap%20with%20Comment%20Anchors.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Parse the page for links
  var links = document.querySelectorAll('a');

  // Create a new div to hold the list of links
  var linkListDiv = document.createElement('div');
  linkListDiv.style.display = 'none';
  linkListDiv.style.position = 'fixed';
  linkListDiv.style.top = 0;
  linkListDiv.style.left = 0;
  linkListDiv.style.width = '100%';
  linkListDiv.style.height = '100%';
  linkListDiv.style.backgroundColor = 'rgba(255, 255, 255, 1)';
  linkListDiv.style.overflowY = 'auto'; // Add this line to make the overlay scrollable
  linkListDiv.innerHTML = '<h3>External Links in this article:</h3>';

  // Create an unordered list to hold the links
  var ul = document.createElement('ul');

  // Array to store unique external links and their parent comments
  var uniqueLinks = [];
  // Loop through each link and add it to the list if it's external, not javascript, and unique
  for (var i = 0; i < links.length; i++) {
    if (!links[i].href.includes('ycombinator') && !links[i].href.includes('javascript')) {
      var link = links[i].href;

      // Find the parent comment of the link
      var comment = links[i].closest('tr[id]');
      var commentId = comment ? comment.id : null;
      // Check for duplicates
      if (uniqueLinks.findIndex(item => item.link === link) === -1) {
        uniqueLinks.push({ link, commentId });
        var li = document.createElement('li');
        // If commentId is not null, create an anchor to the comment and add it before the link
        if (commentId) {
          var commentAnchor = document.createElement('a');
          commentAnchor.href = '#' + commentId;
          commentAnchor.textContent = '(Go to Comment) ';
          commentAnchor.addEventListener('click', function () {
            linkListDiv.style.display = 'none';
            btn.textContent = 'Show Links';
          });
          li.appendChild(commentAnchor);

          var a = document.createElement('a');
          a.href = link;
          a.target = '_blank'; // Add this line to open the links in a new tab
          a.textContent = links[i].textContent || link;
          li.appendChild(a);

          ul.appendChild(li);
        }

      }
    }
  }

  // Add the list to the div and then add the div to the page
  linkListDiv.appendChild(ul);
  document.body.insertBefore(linkListDiv, document.body.firstChild);

  // Create a button to show/hide the overlay
  var btn = document.createElement('button');
  btn.textContent = 'Show Links';
  btn.style.position = 'fixed';
  btn.style.top = '10px';
  btn.style.right = '15px';
  btn.style.zIndex = '999';
  btn.addEventListener('click', function () {
    if (linkListDiv.style.display === 'none') {
      linkListDiv.style.display = 'block';
      this.textContent = 'Hide Links';
    } else {
      linkListDiv.style.display = 'none';
      this.textContent = 'Show Links';
    }
  });
  document.body.insertBefore(btn, document.body.firstChild);
})();
