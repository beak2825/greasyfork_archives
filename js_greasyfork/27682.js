// ==UserScript==
// @name            tumblr video url
// @name:zh-CN      tumblr 视频链接
// @namespace       http://www.himysql.com/
// @version         1.1.0
// @create          2017-02-25
// @description     Get video url in dashboard or  video blog page
// @description:zh-CN     获取 tumblr 视频链接
// @author          leopku
// @copyright       2017+, leopku
// @license         MIT License
// @match           *://www.tumblr.com/*
// @match           *://*.tumblr.com/*
// @run-at          document-end
// @grant           GM_registerMenuCommand
// @grant           GM_setClipboard
// @require         https://greasyfork.org/scripts/27254-clipboard-js/code/clipboardjs.js?version=174357
// @downloadURL https://update.greasyfork.org/scripts/27682/tumblr%20video%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/27682/tumblr%20video%20url.meta.js
// ==/UserScript==

(function () {
  'use strict';
  function convertPosterToVideo(poster) {
    var arr = poster.split('_', 2);
    var vid = arr[1];
    return 'https://vtt.tumblr.com/tumblr_' + vid + '.mp4';
  }

  function copyURIToClipboard() {
    if (url) {
      GM_setClipboard(url);
      alert('视频链接已经在剪贴板中了');
    }
    else {
      alert('当前页面没有视频资源');
    }
  }

  function insertElementAfterOther(newElement, targetElement) {
    var parent = targetElement.parentNode;

    if (parent.lastChild === targetElement) {
      parent.appendChild(newElement);
    }
    else {
      parent.insertBefore(newElement, targetElement.nextSibling);
    }
  }

  // eslint-disable-next-line no-unused-vars
  function insertPostBody(element) {
    var video = element.getElementsByTagName('video');
    var poster = video[0].getAttribute('poster');
    var postBody = document.createElement('p');
    postBody.setAttribute('class', 'post_body');
    postBody.appendChild(document.createTextNode(convertPosterToVideo(poster)));
    var postMedia = element.querySelectorAll('[class="post_media"]');
    insertElementAfterOther(postBody, postMedia[0]);
  }

  function insertButton(element) {
    var video = element.getElementsByTagName('video');
    var poster = video[0].getAttribute('poster');
    var like = element.getElementsByClassName('like');
    var cb = document.createElement('div');
    cb.setAttribute('data-clipboard-text', convertPosterToVideo(poster));
    cb.setAttribute('class', 'post_control post-control-icon icon_queue');
    insertElementAfterOther(cb, like[0]);
  }

  function parseVideo(elements) {
    for (var i = 0; i < elements.length; i++) {
      insertButton(elements[i]);
    }
  }

  var clipboard = new Clipboard('[data-clipboard-text]'); // eslint-disable-line no-unused-vars

  if (document.domain === 'www.tumblr.com') {
    // add download url for dynamic loaded videos
    document.addEventListener('DOMNodeInserted', function (evt) {
      if (evt.relatedNode.id === 'posts') {
        var el = evt.srcElement.getElementsByClassName('is_video');
        parseVideo(el);
      }
    }, false);

    // add download url for first loaded videos
    var elements = document.getElementsByClassName('is_video');
    parseVideo(elements);
  }
  else {
    var ogImage = document.head.querySelector('[property="og:image"]').content;
    var url = convertPosterToVideo(ogImage);
    GM_registerMenuCommand('Get Tumblr video url', copyURIToClipboard);
  }

})();
