// ==UserScript==
// @name        Melvor Unlimited Offline
// @namespace   http://tampermonkey.net/
// @version     0.0.3
// @description Offline progress is no longer limited to 18h
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/435372/Melvor%20Unlimited%20Offline.user.js
// @updateURL https://update.greasyfork.org/scripts/435372/Melvor%20Unlimited%20Offline.meta.js
// ==/UserScript==


((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    setTimeout(() => {
        function patchCode(code, match, replacement) {
            const codeString = code
                .toString()
                .replace(match, replacement)
                .replace(/^function (\w+)/, "window.$1 = function");
            eval(codeString);
        }

        // remove limit from getOfflineTimeDiff function then overwrite
        patchCode(
            getOfflineTimeDiff,
            '64800000',
            'Infinity',
        );
        // "fix" issue with sample_from_binomial
        patchCode(
            sample_from_binomial,
            /(let binomial[^;]+;)/,
            "$1if (binomial.length > numberTrials) return Math.floor(numberTrials * chance);"
        );
    }, 100);
});