// ==UserScript==
// @grant             none
// @version           3.0.1
// @author            eye-wave
// @icon              https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/samequizy-autoplay/assets/icon.svg
// @license           GPL-3.0+
// @name:pl           samequizy.pl - Autoplay off
// @description:pl    Wyłącza automatyczne załączanie nowego quizu.
// @name              samequizy.pl - Autoplay off
// @namespace         samequizy.pl utils
// @match             https://samequizy.pl/*
// @description       Disables automatic loading of new quizzes.
// @downloadURL https://update.greasyfork.org/scripts/493332/samequizypl%20-%20Autoplay%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/493332/samequizypl%20-%20Autoplay%20off.meta.js
// ==/UserScript==
// src/index.ts
var removeNextRelated = () => document.querySelector(".next-related")?.remove();
removeNextRelated();
new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList")
      removeNextRelated();
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
