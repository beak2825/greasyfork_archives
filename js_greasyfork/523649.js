// ==UserScript==
// @name         traQ Arrows Linkifier
// @namespace    https://github.com/TwoSquirrels
// @version      0.2
// @description  traQ 上のメッセージ先頭の「↑n」をリンクに置き換えます
// @author       TwoSquirrels
// @license      MIT
// @match        https://q.trap.jp/*
// @match        https://q.ex.trap.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trap.jp
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/523649/traQ%20Arrows%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/523649/traQ%20Arrows%20Linkifier.meta.js
// ==/UserScript==

"use strict";

// ================================================================================================================== //
//  traQ UserScript Library (v0.2)
//    copyright: Copyright (c) 2025 TwoSquirrels
//    license: MIT
//    url: https://greasyfork.org/ja/scripts/523634-traq-userscript-library-template
// ------------------------------------------------------------------------------------------------------------------ //

async function initQusl() {
  unsafeWindow.qusl ??= (async () => {
    class SimpleEventEmitter {
      constructor() {
        this.events = new Map();
      }

      /**
       * Add a listener for a specific event type.
       * @param {string} type - Event type.
       * @param {function} listener - Callback function.
       * @param {boolean} prepend - If true, add the listener at the beginning of the list.
       */
      on(type, listener, prepend = false) {
        const listeners = this.events.get(type);
        if (!listeners) {
          this.events.set(type, [listener]);
          return;
        }
        if (prepend) listeners.unshift(listener);
        else listeners.push(listener);
      }

      /**
       * Add a one-time listener for a specific event type.
       * The listener is automatically removed after it is called.
       * @param {string} type - Event type.
       * @param {function} listener - Callback function.
       * @param {boolean} prepend - If true, add the listener at the beginning of the list.
       */
      once(type, listener, prepend = false) {
        const wrapper = (...args) => {
          listener(...args);
          this.off(type, wrapper);
        };
        this.on(type, wrapper, prepend);
      }

      /**
       * Remove a specific listener for an event type.
       * If no listener is provided, all listeners for the event type are removed.
       * @param {string} type - Event type.
       * @param {function} [listener] - Callback function to remove.
       */
      off(type, listener) {
        const listeners = this.events.get(type);
        if (!listeners) return;
        if (listener) {
          const index = listeners.indexOf(listener);
          if (index >= 0) listeners.splice(index, 1);
        }
        if (!listener || listeners.length <= 0) this.events.delete(type);
      }

      /**
       * Emit an event, calling all associated listeners with the provided arguments.
       * Listeners can cancel further event propagation by returning `true`.
       * @param {string} type - Event type.
       * @param {...any} args - Arguments to pass to listeners.
       * @returns {Promise<boolean>} - True if propagation was canceled, false otherwise.
       */
      async emit(type, ...args) {
        const listeners = this.events.get(type);
        if (!listeners) return;
        for (const listener of listeners) {
          if (await listener(...args)) return true;
        }
        return false;
      }
    }

    const index = Object.values(await import(document.head.querySelector('script[src^="/assets/index-"]').src));

    return Object.assign(new SimpleEventEmitter(), { SimpleEventEmitter, index });
  })();

  const qusl = await unsafeWindow.qusl;

  // APIs
  if (qusl.apis == null) {
    qusl.apis = qusl.index.find((x) => typeof x.postMessage === "function");

    // Hook all methods of the APIs object
    for (const methodName of Object.getOwnPropertyNames(Object.getPrototypeOf(qusl.apis))) {
      if (methodName === "constructor") continue;
      const method = qusl.apis[methodName];
      if (typeof method !== "function") continue;

      // Wrap each method to allow event handling and cancellation
      qusl.apis[methodName] = async function (...args) {
        if (await qusl.emit(`${methodName}`, args)) throw new Error(`apis.${methodName} was canceled by QUSL.`);
        const response = await method.apply(this, args);
        await qusl.emit(`after.${methodName}`, args, response);
        return response;
      };
    }
  }

  return qusl;
}

// ================================================================================================================== //

initQusl().then((qusl) => {
  // 投稿するメッセージの先頭の「↑n」をリンクに置換します
  qusl.on("postMessage", async ([channelId, body]) => {
    const arrow = /^\s*↑ ?([0-9]+)|^\s*↑+/.exec(body.content);
    if (arrow == null) return;
    const n = Number(arrow[1] ?? arrow[0].match(/↑/g).length);
    if (n < 1 || n > 999) return;
    const message = (await qusl.apis.getMessages(channelId, 1, n - 1)).data[0];
    if (message == null) return;
    body.content =
      `[${arrow[0]}](${unsafeWindow.location.origin}/messages/${message.id})` + arrow.input.slice(arrow[0].length);
    console.log(
      "[traQ Arrows Linkifier]",
      "Replaced",
      JSON.stringify(arrow.input),
      "with",
      JSON.stringify(body.content),
    );
  });
});
