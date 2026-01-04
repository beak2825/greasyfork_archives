// ==UserScript==
// @name         EH mpv - Keyboard Page Navigation
// @namespace    http://fabulous.cupcake.jp.net/
// @version      20190206.3
// @description  Jump between pages with keyboard shortcut
// @author       FabulousCupcake
// @match        https://e-hentai.org/mpv/*
// @match        https://exhentai.org/mpv/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377493/EH%20mpv%20-%20Keyboard%20Page%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/377493/EH%20mpv%20-%20Keyboard%20Page%20Navigation.meta.js
// ==/UserScript==

const key = {
    LETTER_W:    87,
    LETTER_A:    65,
    LETTER_S:    83,
    LETTER_D:    68,
    ARROW_LEFT:  37,
    ARROW_UP:    38,
    ARROW_RIGHT: 39,
    ARROW_DOWN:  40,
}

const jumpToPage = num => {
    const jumpTarget = document.getElementById(`image_${num}`);
    if (!jumpTarget) return;

    jumpTarget.scrollIntoView();
}

const jumpForward = () => jumpToPage(window.currentpage + 1);
const jumpBack = () => jumpToPage(window.currentpage - 1);

const insertKeyBinds = () => {
    window.addEventListener('keydown', e => {
        const code = e.which || e.charCode || e.keyCode;

        switch(code) {
        case key.ARROW_LEFT:
        case key.ARROW_UP:
        case key.LETTER_W:
        case key.LETTER_A:
            jumpBack();
            break;

        case key.ARROW_RIGHT:
        case key.ARROW_DOWN:
        case key.LETTER_S:
        case key.LETTER_D:
            jumpForward();
            break;

        default:
            return;
        }

        e.preventDefault();
    });
}

insertKeyBinds();