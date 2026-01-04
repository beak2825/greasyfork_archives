// ==UserScript==
// @name                  Bandcamp: I'm Not A Fan
// @name:ru               Bandcamp: Я не фанат
// @description           Removes playback limitation and dialog "The time has come to open thy heart/wallet"
// @description:ru        Снимает ограничение воспроизведений и убирает диалог "Пришло время открыть свое сердце/кошелек"
// @namespace             bc-inotafan.user.js
// @version               1.2.0
// @license               MIT
// @author                askornot
// @icon                  https://s4.bcbits.com/img/favicon/safari-pinned-tab.svg
// @match                 https://*.bandcamp.com/*
// @homepageURL           https://greasyfork.org/ru/scripts/438039-bandcamp-i-m-not-a-fan
// @supportURL            https://greasyfork.org/ru/scripts/438039-bandcamp-i-m-not-a-fan/feedback
// @grant                 none
// @run-at                document-start
// @compatible            chrome  Violentmonkey 2.14.0
// @compatible            firefox Greasemonkey 4.11
// @compatible            firefox Violentmonkey 2.14.0
// @downloadURL https://update.greasyfork.org/scripts/438039/Bandcamp%3A%20I%27m%20Not%20A%20Fan.user.js
// @updateURL https://update.greasyfork.org/scripts/438039/Bandcamp%3A%20I%27m%20Not%20A%20Fan.meta.js
// ==/UserScript==

function inject() {
  'use strict';

  const uncap = (o) => (o.is_capped = false);

  const protect = (...namespaces) => {
    for (const namespace of namespaces) {
      const names = Object.keys(namespace);
      for (const name of names) {
        const target = namespace[name];
        Object.freeze(target);
      }
    }
  };

  const freeze = (data) => {
    data.trackinfo.map(uncap);
    data.is_purchased = true;
    data.play_cap_data = {
      streaming_limits_enabled: false,
      streaming_limit: Infinity,
    };
    protect(data);
  };

  const patch = () => {
    if (!Object.prototype.hasOwnProperty.call(window, 'Player')) return false;

    const target = 'init';

    const descriptor = Object.getOwnPropertyDescriptor(Player, target);
    if (descriptor === void 0) {
      console.error(`Failed extract "${target}" descriptor of "Player"!`);
      return false;
    }

    Object.defineProperty(Player, target, {
      ...descriptor,
      value: function () {
        freeze(...arguments);
        return descriptor.value.apply(this, arguments);
      },
    });
    console.info('The injection was successful!');
    return true;
  };

  new MutationObserver((_, observer) => {
    if (patch()) observer.disconnect();
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

(function (source) {
  (
    document.getElementsByTagName('head')[0] ||
    document.body ||
    document.documentElement
  ).appendChild(
    Object.assign(document.createElement('script'), {
      textContent: '(' + source.toString() + ')()',
    })
  );
})(inject);
