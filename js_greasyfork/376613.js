// ==UserScript==
// @name           video watch page url
// @name:ja        埋め込み動画にURL表示
// @namespace      https://greasyfork.org/users/19523
// @description    Display "https://www.youtube.com/watch?v=***********" of embedded YouTube videos.
// @description:ja ページに埋め込まれたYouTubeの動画の下に動画視聴ページのURLを付け加えます
// @include        *
// @exclude        http://www.youtube.com/*
// @exclude        https://www.youtube.com/*
// @version        0.3.9
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/376613/video%20watch%20page%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/376613/video%20watch%20page%20url.meta.js
// ==/UserScript==


(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode('' +
    'a.youtube-url {' +
      'position: relative;' +
      'display: table;' +
      'font-size: initial;' +
      'z-index: 2147483647;' +
    '}' +
    '#colorbox {' +
      'overflow: visible !important;' +
    '}' +
    '#cboxWrapper {' +
      'overflow: visible !important;' +
    '}' +
    '#cboxContent {' +
      'overflow: visible !important;' +
    '}' +
    ''));
  document.getElementsByTagName('head')[0].appendChild(style);
})();

// IIFE to avoid circular reference by DOM and closure. (Narrow the scope.)
(function () {
  try {
    var observer = new MutationObserver(function (mutations) {
      insertVideoURL(observer);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    if (window.top != window.self) {
      return;
    }

    var elementCounts = document.querySelectorAll('*').length;
    function observeLength() {
      if (elementCounts != document.querySelectorAll('*').length) {
        elementCounts = document.querySelectorAll('*').length;
        insertVideoURL();
      }
      return;
    }
    setInterval(function () { observeLength(); }, 5000);
  }
})();

window.addEventListener('load', insertVideoURL);

function insertVideoURL(observer) {
  try {
    observer.disconnect();
  } catch (e) {
    var event = observer;
    observer = { disconnect: function () {}, observe: function (target, options) {} };
  }

  var elements = document.querySelectorAll('iframe[src*="//www.youtube.com/embed/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    if (element.src.indexOf('videoseries') >= 0) {
      a.href = element.src.replace(/embed\/videoseries/, 'playlist');
    } else {
      a.href = element.src.split('?')[0].replace(/embed\//, 'watch?v=');
    }
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';

    var hasLittle, insertedElement;
    if (hasLittle && elements[i-1] && element.parentElement === elements[i-1].parentElement) {
      element = insertedElement.nextSibling;
    } else if (hasLittle = element.parentNode.children.length < element.parentNode.parentNode.children.length + element.parentNode.parentNode.parentNode.children.length) {
      element = element.parentElement;
    }
    insertedElement = element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].src);
  }

  var elements = document.querySelectorAll('iframe[src*="//www.youtube-nocookie.com/embed/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    if (element.src.indexOf('videoseries') >= 0) {
      a.href = element.src.replace(/-nocookie\.com\/embed\/videoseries/, '.com/playlist');
    } else {
      a.href = element.src.split('?')[0].replace(/-nocookie\.com\/embed\//, '.com/watch?v=');
    }
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';

    var hasLittle, insertedElement;
    if (hasLittle && elements[i-1] && element.parentElement === elements[i-1].parentElement) {
      element = insertedElement.nextSibling;
    } else if (hasLittle = element.parentNode.children.length < element.parentNode.parentNode.children.length + element.parentNode.parentNode.parentNode.children.length) {
      element = element.parentElement;
    }
    element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].src);
  }

  var elements = document.querySelectorAll('iframe[data-src*="//www.youtube.com/embed/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    if (element.getAttribute('data-src').indexOf('videoseries') >= 0) {
      a.href = element.getAttribute('data-src').replace(/embed\/videoseries/, 'playlist');
    } else {
      a.href = element.getAttribute('data-src').split('?')[0].replace(/embed\//, 'watch?v=');
    }
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';

    var hasLittle, insertedElement;
    if (hasLittle && elements[i-1] && element.parentElement === elements[i-1].parentElement) {
      element = insertedElement.nextSibling;
    } else if (hasLittle = element.parentNode.children.length < element.parentNode.parentNode.children.length + element.parentNode.parentNode.parentNode.children.length) {
      element = element.parentElement;
    }
    element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].getAttribute('data-src'));
  }

  var elements = document.querySelectorAll('iframe[data-src*="//www.youtube-nocookie.com/embed/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    if (element.getAttribute('data-src').indexOf('videoseries') >= 0) {
      a.href = element.getAttribute('data-src').replace(/-nocookie\.com\/embed\/videoseries/, '.com/playlist');
    } else {
      a.href = element.getAttribute('data-src').split('?')[0].replace(/-nocookie\.com\/embed\//, '.com/watch?v=');
    }
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';

    var hasLittle, insertedElement;
    if (hasLittle && elements[i-1] && element.parentElement === elements[i-1].parentElement) {
      element = insertedElement.nextSibling;
    } else if (hasLittle = element.parentNode.children.length < element.parentNode.parentNode.children.length + element.parentNode.parentNode.parentNode.children.length) {
      element = element.parentElement;
    }
    element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].getAttribute('data-src'));
  }

  // Flash-embedded videos
  var elements = document.querySelectorAll('embed[src*="//www.youtube.com/v/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    a.href = element.src.split('?')[0].replace(/v\//, 'watch?v=');
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';
    element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].src);
  }

  var elements = document.querySelectorAll('embed[src*="//www.youtube-nocookie.com/v/"]:not([class~="youtube-url"])');
  for (var i = 0, element; element = elements[i]; i++) {
    var a = document.createElement('a');
    a.href = element.src.split('?')[0].replace(/-nocookie\.com\/v\//, '.com/watch?v=');
    a.appendChild(document.createTextNode(a.href));
    element.className += a.className = ' youtube-url';
    element.parentElement.insertBefore(a, element.nextSibling);
    console.log('Detected URL: %s', elements[i].src);
  }

  observer.observe(document.body, { childList: true, subtree: true });
}
