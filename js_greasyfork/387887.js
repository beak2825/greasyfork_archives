// ==UserScript==
// @name           VK: Hide Typing
// @name:ru        ВК: Скрыть набор текста
// @description    look @name
// @description:ru Смотри @name:ru
// @namespace      hidetyping.user.js
// @license        MIT
// @author         askornot
// @version        1.0.0
// @match          https://*.vk.com/*
// @compatible     chrome    Violentmonkey 2.12.7
// @compatible     firefox   Greasemonkey 4.11
// @compatible     firefox   Violentmonkey 2.12.14
// @compatible     firefox   Tampermonkey 4.12.6132
// @homepageURL    https://greasyfork.org/en/scripts/387887-vk-hide-typing
// @supportURL     https://greasyfork.org/en/scripts/387887-vk-hide-typing/feedback
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/387887/VK%3A%20Hide%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/387887/VK%3A%20Hide%20Typing.meta.js
// ==/UserScript==

'use strict';

const PROXY = {
  'vk.com': () => {
    const _XMLHttpRequest = XMLHttpRequest.prototype;
    _XMLHttpRequest.send = new Proxy(_XMLHttpRequest.send, {
      apply(target, thisArg, argumentsList) {
        const [ query ] = argumentsList;
        if (/typing|audiomessage/.test(query)) return null;
        return Reflect.apply(target, thisArg, argumentsList);
      },
    });
  },
  'm.vk.com': () => {
    const _fetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const _input = input.clone();
      return input
        .formData()
        .then((x) => [...x.values()].includes('typing'))
        .then((isTyping) =>
          isTyping ? new Promise(() => null) : _fetch(_input, init)
        );
    };
  },
};

const { host } = location;

const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.textContent = `(${PROXY[host].toString()})()`;
document.head.append(script);
