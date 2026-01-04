// ==UserScript==
// @name          Template Twitch's "Go Live Notification"
// @description   Make your life easier by templating Twitch's Go Live Notification field!
// @version       0.3.0
// @author        adarah
// @match         https://dashboard.twitch.tv/u/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @homepage      https://github.com/adarah/tampermonkey-scripts
// @namespace     adarah
// @downloadURL https://update.greasyfork.org/scripts/454526/Template%20Twitch%27s%20%22Go%20Live%20Notification%22.user.js
// @updateURL https://update.greasyfork.org/scripts/454526/Template%20Twitch%27s%20%22Go%20Live%20Notification%22.meta.js
// ==/UserScript==
'use strict'

// Edit your template here!
// The contents in {category} will be replaced by the category you select in the Stream Manager.
const template = `Hello viewers, I'm playing {category}!`

// For advanced users!
// You can generate your own dynamic messages by defining a javascript function called `genMessage`.
// (if genMessage is defined, then the template variable is ignored)
// It should take a {category} string as input and return a fully formed string.
// Below is a pretty complex example. Uncomment it and edit to your liking:
/*
function genMessage(category) {
    if (category === 'Pokémon Unite') {
        return `Pikachu I choose you! Playing ${category}!`
    }

    const now = new Date()
    switch (now.getDay()) {
        case 1:
            return `Got them Monday feels. Playing ${category}.`
        case 6:
            return `Woohoo it's Saturday! I'll be playing ${category} ;P`
        default:
            return `I don't usually stream today but I'll be making an exception for ${category}!`
    }
}
*/


"use strict";
(() => {
  // src/dom.ts
  function observe(selector, observer) {
    let mounted = false;
    const mutObserver = new MutationObserver((_records) => {
      const el = document.querySelector(selector);
      if (!mounted && el) {
        mounted = true;
        observer.onMount(el);
        return;
      }
      if (mounted && !el) {
        mounted = false;
        observer.onDestroy();
        return;
      }
    });
    mutObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    return () => mutObserver.disconnect();
  }

  // bin/twitch-template-go-live/main.ts
  var Templater = class {
    _observer;
    onMount(el) {
      if (!(el instanceof HTMLInputElement))
        return;
      const updateTemplateCallback = (mutations) => {
        const record = mutations[mutations.length - 1];
        const target = record?.target;
        if (target === void 0)
          return;
        this.setGoLiveNotif(target);
      };
      this.setGoLiveNotif(el);
      this._observer = new MutationObserver(updateTemplateCallback);
      this._observer.observe(el, { attributeFilter: ["value"] });
    }
    onDestroy() {
      this._observer?.disconnect();
    }
    setGoLiveNotif(categoryInput) {
      let msg;
      if (typeof genMessage === "function") {
        msg = genMessage(categoryInput.value);
      } else {
        msg = template.replaceAll("{category}", categoryInput.value);
      }
      const el = document.getElementById("edit-broadcast-go-live-formgroup");
      if (el === null)
        throw Error("Go Live textarea was not found!");
      el.value = msg;
    }
  };
  function main() {
    const tpl = new Templater();
    observe("#dropdown-search-input", tpl);
  }
  main();
})();

