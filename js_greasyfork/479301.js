// ==UserScript==
// @name         LOLZ_Hide_Pinned
// @namespace    Lolz Hide Pinned
// @description  Lolz Hide Pinned
// @version      0.5
// @author       el9in
// @license      el9in
// @match        https://zelenka.guru
// @match        https://lolz.guru
// @match        https://zelenka.guru/*
// @match        https://lolz.guru/*
// @match        https://lolz.live
// @match        https://lolz.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/479301/LOLZ_Hide_Pinned.user.js
// @updateURL https://update.greasyfork.org/scripts/479301/LOLZ_Hide_Pinned.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    async function initHidePinned(isNEW = false) {
        const oldButton = document.querySelector(".HidePinButton");
        if(oldButton) oldButton.remove();

        let _saveBool = await GM.getValue("LZT_Hide_Pinned", false);
        const createTabButton = document.querySelector('a.button.middle.CreatePersonalExtendedTab[data-overlaycache="false"][href="feed/create-tab"]');
        let _stickyThreadsElement = document.querySelector('.stickyThreads');
        let _saveElements = null;
        if (createTabButton && _stickyThreadsElement) {
            const styles = window.getComputedStyle(_stickyThreadsElement);
            if(styles.display === "none") return false;
            _saveElements = _stickyThreadsElement.innerHTML;
            if(_saveBool) _stickyThreadsElement.innerHTML = '';
            const hidePinButton = document.createElement("a");
            hidePinButton.className = "button middle HidePinButton";
            hidePinButton.innerText = _saveBool ? "Показать закреп" : "Скрыть закреп";
            hidePinButton.style.marginLeft = "6px";
            createTabButton.insertAdjacentElement("afterend", hidePinButton);
            hidePinButton.addEventListener("click", function(event) {
                if(!_saveBool) {
                    _saveElements = _stickyThreadsElement.innerHTML;
                    _stickyThreadsElement.innerHTML = '';
                    _saveBool = true;
                    GM.setValue("LZT_Hide_Pinned", true);
                    hidePinButton.innerText = "Показать закреп";
                } else {
                    _stickyThreadsElement.innerHTML = _saveElements;
                    _saveElements = _stickyThreadsElement.innerHTML;
                    _saveBool = false;
                    GM.setValue("LZT_Hide_Pinned", false);
                    hidePinButton.innerText = "Скрыть закреп";
                }
            });
        }
    }
    initHidePinned();
    let _currentHref = window.location.href;
    function hrefChecker() {
        if(_currentHref != window.location.href) {
            initHidePinned(true);
            _currentHref = window.location.href;
        }
    }
    setInterval(hrefChecker, 500);
})();