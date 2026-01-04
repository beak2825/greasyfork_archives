

    // ==UserScript==
    // @name         Move Preferred YouTube Subtitle Auto-translate Language Options To Top
    // @namespace    https://greasyfork.org/en/users/85671-jcunews
    // @version      1.1.1
    // @license      AGPLv3
    // @author       jcunews
    // @description  Move preferred YouTube subtitle auto-translate languages to top of the list for quick access, and optionally remove other languages. Users who use non English (US) language in their YouTube setting, must manually edit the script for their chosen language.
    // @match        https://www.youtube.com/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456691/Move%20Preferred%20YouTube%20Subtitle%20Auto-translate%20Language%20Options%20To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/456691/Move%20Preferred%20YouTube%20Subtitle%20Auto-translate%20Language%20Options%20To%20Top.meta.js
    // ==/UserScript==
     
    (() => {
     
      //*** CONFIGURATION BEGIN ***
     
      //One or more menu titles for "Auto-translate". If YouTube language is not English (US), title must be specified according to current YouTube language.
      //For English (US) language, the menu title is "Auto-translate". So, if the language is French, the title must be "Traduire automatiquement".
      //Multiple titles can be specified as e.g.: ["Auto-translate", "Traduire automatiquement"]
      let menuTitle    = "Перевести";
     
      //One or more auto-translate language(s) to keep. Language names must also be specified according to current YouTube language.
      //For English (US) language, the language name for French is "French". But if the language is French, the language name for French must be "Français".
      //Multiple languages can be specified as e.g.: ["English", "French"]
      let keepLanguage = ["Русский"];
     
      //Also remove non preffered languages from the list, aside from moving the preferred languages to the top.
      let removeOtherLanguages = true;
     
      //*** CONFIGURATION END ***
     
      (function waitPlayerSettingsMenu(a) {
        if (a = document.querySelector(".ytp-settings-menu")) {
          (new MutationObserver(recs => {
            recs.forEach(rec => {
              rec.addedNodes.forEach((nd, a) => {
                if (nd.querySelector && (a = nd.querySelector(".ytp-panel-title")) && menuTitle.includes(a.textContent)) {
                  a = 0;
                  nd.querySelectorAll(".ytp-menuitem:not([aria-checked])>.ytp-menuitem-label").forEach(l => {
                    if (keepLanguage.includes(l.textContent)) {
                      (l = l.parentNode).parentNode.insertBefore(l, l.parentNode.children[a++]);
                    } else if (removeOtherLanguages) l.parentNode.remove();
                  });
                }
              });
            });
          })).observe(a, {childList: true});
        } else setTimeout(waitPlayerSettingsMenu, 100);
      })();
    })();

