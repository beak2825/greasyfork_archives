// ==UserScript==
// @name        z css
// @description a
// @match       https://chat.z.ai/*
// @run-at      document-start
// @version 0.0.1.20251230140455
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/543909/z%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/543909/z%20css.meta.js
// ==/UserScript==

(function () {

    function handleColorScheme() {

        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {

            document.documentElement.classList.add('dark');
        }

        else {

            document.documentElement.classList.remove('dark');
        }
    }

    handleColorScheme();

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleColorScheme);

    const css = `
    :root {
            color-scheme: light dark !important;
        }

        div.chat-user > div > div > div.rounded-xl {
            background-color: red !important;
            color: black !important;
        }

        div:has(> div > div.suggestionContainer) {
            display: none !important;
        }

        body > div > div.app > div {
    background: revert !important;
}

button:has(> svg.rotate-45 > path[d^="M512 853.333333c-25.6"]) {
            display: none !important;
        }
        `;

    /*
        *:not(div[data-language="python"]):not(div[data-language="python"] *):not(code):not(code *) {
            color: revert !important;
        }

        * {
            background: revert !important;
            min-width: revert !important;
        }

        nav {
            background-color: canvas !important;
        }

        div:has(> div > div > div > button > svg > path[d^="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75"]) {
            display: none !important;
        }

        div[data-popover-content] {
            display: none !important;
        }
    */

    const style = document.createElement('style');
    style.id = 'zCssStyleId';
    style.textContent = css;
    document.head.appendChild(style);
})();