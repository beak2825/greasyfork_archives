// ==UserScript==
// @name        Hide upgrade plan button on ChatGPT
// @namespace   https://greasyfork.org/en/users/668659-denvercoder1
// @match       https://chat.openai.com/chat*
// @grant       none
// @version     1.0.4
// @author      Jonah Lawrence
// @license     MIT
// @description Hide the animated, bright yellow "upgrade plan" button on ChatGPT
// @downloadURL https://update.greasyfork.org/scripts/459789/Hide%20upgrade%20plan%20button%20on%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/459789/Hide%20upgrade%20plan%20button%20on%20ChatGPT.meta.js
// ==/UserScript==

(function () {
    const COMPACT_MODE = true;

    let style = `
    .shim-yellow,
    .gold-new-button,
    .gold-new-button ~ span {
        display: none;
    }

    nav > div ~ a.rounded-md {
        padding: 0;
        margin: 0px !important;
    }

    nav > div ~ a.rounded-md > svg {
        margin-top: 1rem;
        margin-bottom: 1rem;
        margin-left: 0.75rem;
    }`;

    if (COMPACT_MODE) {
        style += `
        nav > div > div > a.rounded-md {
            padding-top: 0.25rem;
            padding-bottom: 0.25rem;
        }

        nav > div ~ a.rounded-md > svg {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
        }`;
    }

    document.getElementsByTagName("head")[0].insertAdjacentHTML("beforeend", `<style>${style}</style>`);
})();
