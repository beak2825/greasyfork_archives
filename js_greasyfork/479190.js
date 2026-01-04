// ==UserScript==
// @name        Danbooru Fast Blacklist
// @namespace   Violentmonkey Scripts
// @match       *://danbooru.*.us/*
// @match       *://safebooru.*.us/*
// @match       *://aibooru.online/*
// @grant       none
// @version     1.0
// @run-at      document-start
// @author      -
// @description hides dannbooru posts faster
// @downloadURL https://update.greasyfork.org/scripts/479190/Danbooru%20Fast%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/479190/Danbooru%20Fast%20Blacklist.meta.js
// ==/UserScript==


(() => {

function getBlacklistedTags() {
  let head = document.head;
  if (! head) return [];

  let blacklistedTags = head.querySelector('meta[name="blacklisted-tags"]');
  if (blacklistedTags) {
    return blacklistedTags.content.split(',') // ['1 2 3', '4 5 7']
      .map((tags) => tags.split(' ')); // [['1','2','3'], ['4','5','6'], ...]
  } else {
    return [];
  }
}

function getAllPosts() {
  return document.querySelectorAll('article.post-preview');
}

function getCurrentPost() {
  let content = document.getElementById('content');
  if (content) {
    return content.querySelector('section.image-container');
  } else {
    return null;
  }
}

function areTagsMatchingPost(postTags, searchTags) {
  if (typeof postTags !== 'string') {
    postTags = Array.from(postTags);
    postTags = postTags.map((tag) => tag.replaceAll(' ', '_'));
    postTags = postTags.join(' ');
  } // postTags = 'touhou 1girl smile yakumo_yukari'
  if (typeof searchTags === 'string') {
    searchTags = searchTags.split(' ');
  } // searchTags = ['touhou', '~1girl', '~smile', 'yakumo_yukari', '-crying']

  // ~tag
  function checkUnionTags(tags) { // tags = ['tag1', 'tag2', 'tag3', ...]
    if (tags.length == 0) return true;

    for (let tag of tags) {
      if (postTags.includes(tag)) {
        return true;
      }
    }
    return false;
  }
  // -tag
  function checkDifferenceTags(tags) { // tags = ['tag1', 'tag2', 'tag3', ...]
    if (tags.length == 0) return true;

    for (let tag of tags) {
      if (postTags.includes(tag)) {
        return false;
      }
    }
    return true;
  }
  // tag
  function checkIntersectionTags(tags) { // tags = ['tag1', 'tag2', 'tag3', ...]
    if (tags.length == 0) return true;

    for (let tag of tags) {
      if (!postTags.includes(tag)) {
        return false;
      }
    }
    return true;
  }


  let union = [];        // ~tag
  let difference = [];   // -tag
  let intersection = []; // tag

  for (let tag of searchTags) {
    if (tag[0] === '~') {
      union.push(tag.slice(1));
    } else if (tag[0] === '-') {
      difference.push(tag.slice(1));
    } else {
      intersection.push(tag);
    }
  }

  return checkUnionTags(union)
  && checkDifferenceTags(difference)
  && checkIntersectionTags(intersection);
}

function hideAllBlacklistedPosts() {
  let BlacklistedTags = getBlacklistedTags();
  let posts = getAllPosts();

  for (let post of posts) {
    for (let tags of BlacklistedTags) {
      if (areTagsMatchingPost(post.dataset.tags, tags)) {
        post.classList.add('blacklisted-active');
        break;
      }
    }
  }
}

function hideCurrentBlacklistedPost() {
  let currentPost = getCurrentPost();
  let blacklistedTags = getBlacklistedTags();
  if (currentPost) {
    for (let tags of blacklistedTags) {
      if (areTagsMatchingPost(currentPost.dataset.tags, tags)) {
        currentPost.classList.add('blacklisted-active');
        break;
      }
    }
  }
}

function apply() {
  let listenerAttached = false;
  new MutationObserver((mutations, observer) => {
    if (!listenerAttached) {
      document.addEventListener('DOMContentLoaded', () => observer.disconnect());
      listenerAttached = true;
    }

    hideCurrentBlacklistedPost();
    hideAllBlacklistedPosts();
  }).observe(document.documentElement, {childList:true, subtree: true});
}

apply();

})();
