// ==UserScript==
// @name         Koji Button (Reddit)
// @namespace    https://withkoji.com
// @version      0.3
// @description  Adds a Koji Button to supported websites
// @author       Koji
// @match        https://reddit.com/*
// @match        https://www.reddit.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407365/Koji%20Button%20%28Reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407365/Koji%20Button%20%28Reddit%29.meta.js
// ==/UserScript==

/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line func-names
(function () {
  const setUrlResult = (url, title) => {
    // Set the URL
    const urlInput = Array.from(document.getElementsByTagName('textarea'))
      .find((textarea) => (textarea.placeholder || '').toLowerCase() === 'url');

    if (urlInput) {
      urlInput.focus();
      document.execCommand('insertText', false, url);
    }

    // Focus the title
    const titleInput = Array.from(document.getElementsByTagName('textarea'))
      .find((textarea) => (textarea.placeholder || '').toLowerCase() === 'title');

    if (titleInput) {
      titleInput.focus();
    }
  };

  const setCommentResult = (url) => {
    // Set the URL
    const urlInput = document.querySelector('[role="textbox"]');

    if (urlInput) {
      urlInput.focus();
      document.execCommand('insertText', false, url);
    }
  };

  const sendMessage = (eventName, message) => {
    const frame = document.getElementById('koji_button_frame');
    frame.contentWindow.postMessage({
      _kojiEventName: eventName,
      ...message,
    }, '*');
  };

  window.KOJI_HAS_INJECTED = false;
  window.KOJI_HAS_LOADED = false;
  window.KOJI_RESULT_TARGET = setUrlResult;

  const hide = () => {
    const frame = document.getElementById('koji_button_frame');
    frame.style.opacity = '0';
    frame.style.pointerEvents = 'none';
  };

  const show = (e, resultTarget) => {
    if (!window.KOJI_HAS_LOADED) {
      return;
    }

    if (resultTarget === 'post') {
      window.KOJI_RESULT_TARGET = setUrlResult;
    } else {
      window.KOJI_RESULT_TARGET = setCommentResult;
    }

    const { x, y, width, height } = e.target.getBoundingClientRect();
    sendMessage('@@koji_sdk/create/SHOW_PICKER', {
      top: y + height,
      left: x,
      origin: `${x + (width / 2)}px ${y + height}px`,
    });

    const frame = document.getElementById('koji_button_frame');
    frame.style.opacity = '1';
    frame.style.pointerEvents = 'all';
  };

  // Add listener
  window.addEventListener('message', ({ data }) => {
    try {
      if (data._kojiEventName === '@@koji_sdk/create/DISMISS') {
        hide();
      }

      if (data._kojiEventName === '@@koji_sdk/create/POST_CREATED') {
        const { url, title } = data.payload;
        window.KOJI_RESULT_TARGET(url, title);
        hide();
      }

      if (data._kojiEventName === '@@koji_sdk/create/LOADED') {
        window.KOJI_HAS_LOADED = true;

        // Initialize the button with default options
        sendMessage('@@koji_sdk/create/INITIALIZE', {
          defaultDescription: '#reddit',
        });
      }
    } catch (err) {
      //
    }
  });

  const el = document.createElement('iframe');
  el.id = 'koji_button_frame';
  el.src = 'https://withkoji.com/_embeds/create';
  el.style = [
    'outline: none;',
    'border: none;',
    'position: fixed;',
    'top: 0;',
    'left: 0;',
    'width: 100vw;',
    'height: 100vh;',
    'z-index: 8675309;',
    'transition: opacity 0.2s ease-in-out;',
    'pointer-events: none;',
    'opacity: 0;',
  ].join(' ');
  document.body.appendChild(el);

  // Add the koji button
  const injectButton = () => {
    try {
      // Find the poll button
      const pollButton = Array.from(document.getElementsByTagName('button'))
        .find((button) => button.innerText.toLowerCase() === 'poll');

      // Add a "more button" to open the koji picker
      const kojiButton = pollButton.cloneNode(true);
      kojiButton.innerText = 'More';
      kojiButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Show the picker
        show(e, 'post');

        // Select the link tab, so we're ready to use the result
        const linkButton = Array.from(pollButton.parentElement.children)
          .find((button) => button.innerText.toLowerCase() === 'link');
        linkButton.click();
      };
      pollButton.parentElement.appendChild(kojiButton);

      // Fix reddit's CSS for them
      Array.from(pollButton.parentElement.children)
        .forEach((child) => {
          // eslint-disable-next-line no-param-reassign
          child.style.whiteSpace = 'nowrap';
        });
    } catch (err) {
      console.log(err);
    }
  };

  const injectCommentsButton = () => {
    try {
      // Find the more button
      const moreButton = Array.from(document.querySelectorAll('[aria-label="more options"]'))
        .find((node) => node.id.includes('Comment'));
      if (moreButton) {
        moreButton.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          show(e, 'comments');
        };
      }
    } catch (err) {
      console.log(err);
    }
  };

  document.querySelector('html').addEventListener('DOMNodeInserted', (e) => {
    if (window.location.href.endsWith('/submit')) {
      if (window.KOJI_HAS_INJECTED) {
        return;
      }
      window.KOJI_HAS_INJECTED = true;
      setTimeout(() => injectButton(), 1000);
    } else if (window.location.href.includes('/comments/')) {
      if (window.KOJI_HAS_INJECTED_COMMENTS) {
        return;
      }
      window.KOJI_HAS_INJECTED_COMMENTS = true;
      setTimeout(() => injectCommentsButton(), 1000);
    } else {
      window.KOJI_HAS_INJECTED = false;
    }
  });
}());
