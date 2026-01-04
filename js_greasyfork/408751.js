// ==UserScript==
// @name         Tailwind UI -> Valid React
// @namespace    https://github.com/tailwindlabs
// @version      0.1
// @description  Converts Tailwind UI components into valid React JSX
// @author       impulse
// @match        https://tailwindui.com/*
// @grant        GM_notification
// @grant        GM_setClipboard(data, info)
// @downloadURL https://update.greasyfork.org/scripts/408751/Tailwind%20UI%20-%3E%20Valid%20React.user.js
// @updateURL https://update.greasyfork.org/scripts/408751/Tailwind%20UI%20-%3E%20Valid%20React.meta.js
// ==/UserScript==

// Adapted from: https://gist.github.com/RobinMalfait/a90e8651196c273dfa51eec0f43e1676

function convert() {
    window.navigator.clipboard
        .readText()
        .then((data) => {
        return window.navigator.clipboard
            .writeText(
            data
            // Replace `class=` with `className=`
            .replace(/class=/g, "className=")

            // Replace all attributes starting with @.
            //
            // E.g.: `@click.stop` -> `data-todo-at-stop`
            .replace(
                / @([^"]*)=/g,
                (_all, group) => ` data-todo-at-${group.replace(/[.:]/g, "-")}=`
            )

            // Replaces all attributes starting with x-.
            //
            // E.g.: `x-transition:enter` -> `data-todo-x-transition-enter`
            .replace(
                / x-([^ "]*)/g,
                (_all, group) => ` data-todo-x-${group.replace(/[.:]/g, "-")}`
            )

            // Replace html comments with JSX comments
            .replace(/<!--/g, "{/*")
            .replace(/-->/g, "*/}")

            // Replace `tabindex="0"` with `tabIndex={0}`
            .replace(/tabindex="([^"]*)"/g, "tabIndex={$1}")

            // Replace `datetime` with `dateTime` for <time />
            .replace(/datetime=/g, "dateTime=")

            // Replace `clip-rule` with `clipRule` in svg's
            .replace(/clip-rule=/g, "clipRule=")

            // Replace `fill-rule` with `fillRule` in svg's
            .replace(/fill-rule=/g, "fillRule=")

            // Replace `stroke-linecap` with `strokeLinecap` in svg's
            .replace(/stroke-linecap=/g, "strokeLinecap=")

            // Replace `stroke-width` with `strokeWidth` in svg's
            .replace(/stroke-width=/g, "strokeWidth=")

            // Replace `stroke-linejoin` with `strokeLinejoin` in svg's
            .replace(/stroke-linejoin=/g, "strokeLinejoin=")

            // Replace `for` with `htmlFor` in forms
            .replace(/for=/g, "htmlFor=")

            // Replace all attributes starting with :.
            //
            // E.g.`:class="{ 'hidden': open, 'inline-flex': !open` ->
            // `data-todo-colon-class="{ 'hidden': open, 'inline-flex': !open }"`
            .replace(/ :(.*)=/g, " data-todo-colon-$1=")

            // Replace `href="#"` with `href="/"` (Otherwise Create React App complains)
            .replace(/href="#"/g, 'href="/"')

            // Replace relative src paths with absolute src paths.
            .replace(/src="\//g, 'src="https://tailwindui.com/')

            // Drop scripts ¯\_(ツ)_/¯
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

            // Ensure img, input and hr tags are self closed
            .replace(/<(img|input|hr)([^>]*)>/g, "<$1$2 />")

            // Ensure we rewrite the style string to an object
            .replace(/style="([^"]*)"/g, (_, style) => {
                return `style={{${style
                    .split(";")
                    .filter((pair) => pair.trim().length)
                    .map((pair) => pair.split(":").map((part) => part.trim()))
                    .map(([key, value]) =>
                         [
                    key.replace(/-(\w)/g, (_, v) => v.toUpperCase()),
                    JSON.stringify(
                        value.match(/\d*px/) ? parseFloat(value) : value
                    ),
                ].join(": ")
                        )
                    .join(", ")}}}`;
            })

            // Trim the whitespace!
            .trim()
        )
            .then(() => {
            GM_notification ( {title: 'TailwindUI -> React', text: 'Copied to clipboard!'} );
        });
    })
        .catch((err) => {
        GM_notification ( {title: 'Error: TailwindUI -> React', text: err} );
    });
}

(function() {
    'use strict';
    document.addEventListener('copy', (event) => {
        convert();
    });
})();
