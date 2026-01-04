// ==UserScript==
// @name         ChatGPT reduce react repaint duration
// @namespace    https://chatgpt.com/
// @version      1.0.0
// @description  Reduces react repaint duration by limiting initial number of messages
// @author       SadSalmonTwT
// @license MIT
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538906/ChatGPT%20reduce%20react%20repaint%20duration.user.js
// @updateURL https://update.greasyfork.org/scripts/538906/ChatGPT%20reduce%20react%20repaint%20duration.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // defines the number of initially loaded messages
  const INIT_NUMBER_OF_MESSAGES = 10;

  // request for chat history regex
  const conversationRegex = /^https:\/\/chatgpt\.com\/backend-api\/conversation\/[a-f0-9\-]{36}$/i;

  const originalFetch = window.fetch;

  // intercept the fetch api
  window.fetch = function (input, init) {
    const url = (typeof input === 'string')
      ? input
      : input.url;

    // process all other requests like normal, but intercept all chat history request responses
    if (!conversationRegex.test(url))
      return originalFetch.apply(this, arguments);
    else
      return originalFetch.apply(this, arguments)
        .then(async (response) => {
          try {
            const data = await response.clone().json();

            const newMapping = [];

            let nextId = data.current_node;
            let numberOfVisibleMessages = 0;

            // traverse tree upwards from the last message leaf towards root
            while (true) {
              const _message = data.mapping[nextId];

              // if root is encountered early, add it and stop loop
              if (_message.id === "client-created-root") {
                newMapping.push(_message);
                break;
              }

              // traverse downwards tree towards child leaves (these messages are hidden)
              const _childIds = [..._message.children];
              while (_childIds.length !== 0) {
                const _childId = _childIds.pop();
                const _child = data.mapping[_childId];

                // if newMapping already contains child, skip it
                if (newMapping.some(_preservedMessage => _preservedMessage.id === _childId))
                  continue;

                // add hidden message
                newMapping.push(_child);

                // add children's children
                _childIds.push(..._child.children);
              }

              // add message itself (if the number was not reached AND its parent exists AND it's not root)
              if (
                numberOfVisibleMessages < INIT_NUMBER_OF_MESSAGES
                && data.mapping[_message.parent]
              )
                newMapping.push(_message);
              else {
                // add "first" message and link it to root
                newMapping.push({
                  ..._message,
                  parent: "client-created-root"
                });

                // add chat root
                newMapping.push({
                  id: "client-created-root",
                  message: null,
                  parent: null,
                  children: [_message.id]
                });

                // stop loop
                break;
              }

              nextId = _message.parent;
              numberOfVisibleMessages++;
            }

            // if new mappings have same length as old ones, return original response
            if (newMapping.length === Object.keys(data.mapping).length) {
              console.log("ChatGPT_reduce_react_repaint_duration: Response was left unchanged");
              return response;
            }

            // update chat history
            data.mapping = Object.fromEntries(
              newMapping.map(_message => ([
                _message.id,
                _message
              ]))
            );

            console.log('ChatGPT_reduce_react_repaint_duration: Response was trimmed', data);

            // return response with modified data
            return new Response(JSON.stringify(data), {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          } catch (err) {
            console.error('ChatGPT_reduce_react_repaint_duration: An error has occurred', err);
            return response;
          }
        });
  };
})();