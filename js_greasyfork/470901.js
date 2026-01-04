// ==UserScript==
// @name Post To Stream
// @description Just adds a link so Kiki can show posts on her stream...
// @version  2
// @match  https://boards.4chan.org/*/thread/*
// @grant none
// @run-at document-end
// @require  https://code.jquery.com/jquery-3.5.1.min.js
// @namespace https://greasyfork.org/users/1127585
// @downloadURL https://update.greasyfork.org/scripts/470901/Post%20To%20Stream.user.js
// @updateURL https://update.greasyfork.org/scripts/470901/Post%20To%20Stream.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Endpoint to send the selected posts (don't share this link unless you
    // want whoever to be able to inject stuff into your stream...)
    var endpoint = "https://rabbalabs.com/pyondex/hbokukw7"

    function postIsBlank(text) {
        var regex = /^(\s*>>\d+\s*)+$/;
        return text.trim() === '' || regex.test(text);
    }

    function handlePost(post) {
        if (post.classList.contains('link-added')) {
            return;
        }
        var hasImage = post.getElementsByClassName('fileThumb')[0] !== undefined;
        var linksDiv = document.createElement('div')
        linksDiv.style.textAlign = 'right';
        linksDiv.style.marginRight = '15px';
        linksDiv.style.marginBottom = '5px';
        post.appendChild(document.createElement('br'));
        post.appendChild(linksDiv);
        var postElement = post.getElementsByClassName('postMessage')[0];
        var postText = postElement.textContent;
        var hasText = !postIsBlank(postText);
        if (hasText) {
            var shareTextLink = document.createElement('a');
            shareTextLink.href = 'javascript:void(0)';
            shareTextLink.textContent = 'Share Text';
            shareTextLink.addEventListener('click', shareText);
            linksDiv.appendChild(shareTextLink);
        }
        if (hasImage) {
            var shareImageLink = document.createElement('a');
            shareImageLink.href = 'javascript:void(0)';
            shareImageLink.textContent = 'Share Image';
            shareImageLink.addEventListener('click', shareImage);
            if (hasText) {
                linksDiv.appendChild(document.createTextNode(' '));
            }
            linksDiv.appendChild(shareImageLink);
        }
        post.classList.add('link-added');
    }

    function shareText(event) {
        var post = event.target.parentElement.parentElement;
        $.getJSON(endpoint, {
            id: post.getElementsByClassName('postNum')[0].getElementsByTagName('a')[1].innerText,
            item: post.getElementsByClassName('postMessage')[0].innerText,
            time: Date.now(),
            type: 'text'
        });
    }

    function shareImage(event) {
        var post = event.target.parentElement.parentElement;
        $.getJSON(endpoint, {
            id: post.getElementsByClassName('postNum')[0].getElementsByTagName('a')[1].innerText,
            item: post.getElementsByClassName('fileThumb')[0].href,
            time: Date.now(),
            type: 'image'
        });
    }

    function handleInitialPosts(posts) {
        for (var i = 0; i < posts.length; i++) {
            handlePost(posts[i]);
        }
    }

    function handleNewPosts(mutationsList) {
      for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
          var newPosts = mutation.addedNodes;
          newPosts.forEach(function(newPost) {
            if (newPost.nodeType === Node.ELEMENT_NODE) {
              var post = newPost.querySelector('.post');
              if (post) {
                handlePost(post);
              }
            }
          });
        }
      }
    }

    var posts = document.getElementsByClassName('post');
    handleInitialPosts(posts);

    var observer = new MutationObserver(handleNewPosts);
    observer.observe(document.body, { childList: true, subtree: true });
})();
