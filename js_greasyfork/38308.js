// ==UserScript==
// @name            GitHub Top Reacted
// @version         0.1
// @description     Show and sort top reacted comments on GitHub
// @author          Drazen Bjelovuk
// @include         /^https?://github.com/.*/issues/.+/
// @grant           none
// @namespace       https://greasyfork.org/users/11679
// @contributionURL https://goo.gl/dYIygm
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/38308/GitHub%20Top%20Reacted.user.js
// @updateURL https://update.greasyfork.org/scripts/38308/GitHub%20Top%20Reacted.meta.js
// ==/UserScript==

(function() {
    var comments = document.querySelectorAll('.timeline-comment-wrapper');
    var reacted = [];

    comments.forEach(function(el) {
        if (el.querySelectorAll('.has-reactions').length) {
            reacted.push(el);
        }
    });

    if (!reacted.length) {
        return;
    }

    function countReactions(comment) {
        var count = 0;
        var reactions = comment.querySelectorAll('button.reaction-summary-item');
        reactions.forEach(function(el) {
            count += parseInt(el.innerText.split(' ')[1]);
        });
        return count;
    }

    reacted.sort(function(a, b) {
        return countReactions(b) - countReactions(a);
    });

    var container = document.createElement('div');
    container.className = 'top-reacted';
    container.setAttribute('hidden', '');
    reacted.forEach(function(el) {
        container.appendChild(el.cloneNode(true));
    });

    var discussion = document.querySelector('.discussion-timeline');
    discussion.insertBefore(container, discussion.firstChild);

    var showTopBtn = document.createElement('button');
    showTopBtn.className = 'btn btn-lg';
    showTopBtn.style = 'margin-bottom: 20px;';
    showTopBtn.innerText = 'Show top reacted';
    showTopBtn.addEventListener('click', function() {
        if (container.hasAttribute('hidden')) {
            container.removeAttribute('hidden');
            showTopBtn.innerText = 'Hide top reacted';
        }
        else {
            container.setAttribute('hidden', '');
            showTopBtn.innerText = 'Show top reacted';
        }
    });

    var bucket = document.querySelector('#discussion_bucket');
    bucket.parentNode.insertBefore(showTopBtn, bucket);
})();