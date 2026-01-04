// ==UserScript==
// @name         Block Justin Y.
// @match        *.youtube.com/*
// @description  Hides posts made by Justin Y. on Youtube.
// @version 0.0.1.20190130045008
// @namespace https://greasyfork.org/users/243229
// @downloadURL https://update.greasyfork.org/scripts/377278/Block%20Justin%20Y.user.js
// @updateURL https://update.greasyfork.org/scripts/377278/Block%20Justin%20Y.meta.js
// ==/UserScript==

var config = {childList: true, subtree: true };

// Waiting for comments section to load
function observeComments1() {
    var commentsCallback1 = function(mutationsList, observer) {
        let commentsSection = document.getElementById('comments');
        if (commentsSection) {
            commentObserver1.disconnect();
            observeComments2(commentsSection);
        }
    };
    var commentObserver1 = new MutationObserver(commentsCallback1);
    commentObserver1.observe(document.body, config);
}

// Waiting for comments section inside comments section to load
function observeComments2(commentsSection) {
    var commentsCallback2 = function(mutationsList, observer) {
        let commentsList = commentsSection.querySelector('#contents');
        if (commentsList) {
            commentObserver2.disconnect();
            observeComments3(commentsList);
        }
    };
    var commentObserver2 = new MutationObserver(commentsCallback2);
    commentObserver2.observe(commentsSection, config);
}

// Checking comments for username
function observeComments3(commentsList) {
    var commentsCallback3 = function(mutationsList, observer) {
        for(var mutation of mutationsList) {
            mutation.addedNodes.forEach(function(comment) {
                let usernameParent = comment.querySelector('#author-text');
                let username = usernameParent.children[0].textContent.trim();
                if (username == 'Justin Y.' || username == 'add_as_many_names' || username == 'as_you_want_here') {
                    comment.hidden = true;
                    console.log('Blocked ' + username);
                }
            });
        }
    };
    let config2 = {childList: true};
    var observer = new MutationObserver(commentsCallback3);
    observer.observe(commentsList, config2);
}

observeComments1();