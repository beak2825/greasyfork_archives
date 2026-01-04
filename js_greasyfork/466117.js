// ==UserScript==
// @name         chatGPT nav menu filter
// @name:zh      chatGPT左方列表遮罩
// @namespace    openai
// @version      0.1
// @author       https://github.com/jctneko/
// @description  Filter anchors in nav elements by keyword inputted by user in real time.
// @match        https://chat.openai.com/*
// @run-at       document-idle
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/466117/chatGPT%20nav%20menu%20filter.user.js
// @updateURL https://update.greasyfork.org/scripts/466117/chatGPT%20nav%20menu%20filter.meta.js
// ==/UserScript==

/*
  Note: The OpenAI interface frequent updates, which can sometimes cause issues with this userscript.
  Please report any issues you encounter, and I will make the necessary corrections.
*/

(() => {
  'use strict';

  const observers = {};

  const createInput = () => {
    const inputNode = document.createElement('input');
    inputNode.type = 'text';
    inputNode.id = 'filterKeyword';
    inputNode.style.cssText = 'position: fixed; top:5px; left: 270px; color: white; background-color:#444654; padding:0 5px;';
    inputNode.placeholder = 'filter_';
    document.body.appendChild(inputNode);
    return inputNode;
  }

  const observeFetch = (urlToObserve, onStart, onFinish) => {
    observers[urlToObserve] = { onStart, onFinish };
  }

  const moveLinks = (filterText) => {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link) => {
      link.style.cssText = link.innerText.includes(filterText) ? '' : 'position: absolute; left: -300px;';
    });
    console.log('[gptFilter] items hided.');
  }

  const updateNavLinks = () => {
    const inputNode = document.getElementById('filterKeyword');
    if (inputNode) {
      setTimeout(() => {
        moveLinks(inputNode.value)
      }, 500);
    }
  }

  const handleInputChange = (event) => {
    moveLinks(event.target.value);
  }

  const bindEvents = (inputNode) => {
    let interval = setInterval(() => {
      if (unsafeWindow.next) {
        inputNode.addEventListener('input', handleInputChange);
        unsafeWindow.next.router.events.on('routeChangeComplete', updateNavLinks);
        console.log('[gptFilter] event binded');
        clearInterval(interval);
      }
    }, 1000);

    unsafeWindow.fetch = new Proxy(unsafeWindow.fetch, {
      apply: function(target, thisArg, argumentsList) {
          const [url, options, ...args] = argumentsList;
          const observer = Object.keys(observers).find(key => url.includes(key));

          if (observer) {
              const { onStart, onFinish } = observers[observer];
              onStart && onStart(url, options, ...args);
              return target(url, options, ...args).then(response => {
                  onFinish && onFinish(response);
                  return response;
              });
          }

          return target.apply(thisArg, argumentsList);
      }
    });
  }

  const init = () => {
    const inputNode = createInput();
    bindEvents(inputNode);
  }

  observeFetch(
      "https://chat.openai.com/backend-api/conversations",
      (url, options, ...args) => {
          // console.log("Fetch started: ", url);
      },
      (response) => {
          console.log('[gptFilter] Nav element updated');
          // console.log("Fetch finished: ", response.url);
          updateNavLinks();
      }
  );

  init();
})();
