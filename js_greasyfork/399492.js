// ==UserScript==
// @name         jisho-shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description  Shortcuts for Jisho.
// @author       Long Huynh Huu
// @match        https://jisho.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399492/jisho-shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/399492/jisho-shortcuts.meta.js
// ==/UserScript==


const SHIFT_UP_KEY = "K";
const SHIFT_DOWN_KEY = "J";
const SCROLL_UP_KEY = "k";
const SCROLL_DOWN_KEY = "j";
const PLAY_KANJI = "Enter";
const START_IN_INSERT_MODE = false;

(function() {
    'use strict';

    var shift = 0;
    var tags = [];
    var details = document.getElementsByClassName("light-details_link");
    let keyword = document.getElementById("keyword");
    keyword.style.fontSize = "1.125rem";
    const mode = document.createElement("div");
    const body = document.getElementsByClassName("text_input")[0];
    body.append(mode);
    body.style.position = "relative";
    mode.style.width = 100;
    mode.style.height = 100;
    mode.style.position = "absolute";
    mode.style.right = 0;
    mode.style.bottom = 0;
    mode.style.fontFamily = "Iosevka, monospace";
    mode.style.fontWeight = 800;
    mode.style.padding = "4px";
    mode.style.fontSize = "0.875rem";

    function indicateInsertMode() {
        mode.innerText = "INSERT";
        mode.style.color = "#f1f5f9";
        mode.style.backgroundColor = "#4d7c0f";
    }

    function indicateNormalMode() {
        mode.innerText = "NORMAL";
        mode.style.color = "#713f12";
        mode.style.backgroundColor = "#facc15";
    }
    keyword.onblur = indicateNormalMode;
    keyword.onfocus = indicateInsertMode;

    let install = function() {
        keyword.placeholder = "Press 'i' to search";
        for (var i = 0; i < details.length; ++i) {
            let tag = document.createElement("div");
            tag.style = "font-family: Iosevka, monospace; font-weight: 600; background-color: #facc15; color: #713f12; font-size: 1.5rem; border: 1px solid #facc15; padding: 4px; aspect-ratio: 1; text-align: center;";
            if (shift*10 <= i && i < (shift+1)*10) {
                tag.innerText = "" + (i - shift*10);

            } else {
                tag.innerText = "" + ((i < shift*10) ? SHIFT_UP_KEY : SHIFT_DOWN_KEY);
            }
            tags.add(tag);
            details[i].prepend(tag);
            details[i].style = "text-decoration: none; opacity: 1;";
        }
    }

    let update = function() {
        for (var i = 0; i < tags.length; ++i) {
            let tag = tags[i]
            if (shift*10 <= i && i < (shift+1)*10) {
                tag.innerText = "" + (i - shift*10);

            } else {
                tag.innerText = "" + ((i < shift*10) ? SHIFT_UP_KEY : SHIFT_DOWN_KEY);
            }
        }
    }

    let is_INSERT_mode = function() {
        return keyword == document.activeElement;
    }

    if (START_IN_INSERT_MODE) {
        keyword.focus();
    } else {
        keyword.blur();
    }
    install();

    window.onkeydown = function(ev) {
        if (ev.key === "Escape") {
            keyword.blur();
            shift = 0;
            update();
        }
    }

    window.onkeypress = function(ev) {
        var no_modifier = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
        if (no_modifier && !is_INSERT_mode()) {
            if (ev.key === "i") {
                ev.preventDefault();
                keyword.focus();
                shift = 0;
                update();
            } else if (ev.key in "0 1 2 3 4 5 6 7 8 9".split(" ")) {
                let i = parseInt(ev.key) + 10*shift;
                if (i < details.length) {
                    details[i].click();
                }
                // shift tags up and down with k/j
            } else if (ev.key === SHIFT_DOWN_KEY) {
                if (10*(shift + 1) < details.length) {
                    shift += 1;
                    update();
                }
            } else if (ev.key === SHIFT_UP_KEY) {
                if (shift > 0) {
                    shift -= 1;
                    update();
                }
            } else if (ev.key == SCROLL_DOWN_KEY) {
                window.scroll(window.scrollX,window.scrollY + window.innerHeight/3);
            } else if (ev.key == SCROLL_UP_KEY) {
                window.scroll(window.scrollX,window.scrollY - window.innerHeight/3);
            } else if (ev.key == PLAY_KANJI) {
                var kanjis = document.getElementsByClassName("kanji_play_button");
                for (var i = 0; i < kanjis.length; ++i) {
                    kanjis[i].click();
                }
            }
        }
    };
})();
