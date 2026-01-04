// ==UserScript==
// @name         Wirecutter Paywall Bypass
// @namespace    https://greasyfork.org/en/scripts/458566-wirecutter-paywall-bypass/
// @version      0.2
// @description  Bypass Wirecutter paywall
// @author       dy-dx
// @match        https://www.nytimes.com/wirecutter/*/*
// @icon         https://siren-production.freetls.fastly.net/static/img/favicon-32x32.png
// @grant        none
// @license      MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/458566/Wirecutter%20Paywall%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/458566/Wirecutter%20Paywall%20Bypass.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// First strategy: change initial props before hydration.
// Luckily there is a "shouldBypassPayWall" flag for us to use.
function setBypassProp() {
    if (window.__NEXT_DATA__ && window.__NEXT_DATA__.props) {
        throw new Error('too late, already hydrated');
    }
    const $script = document.getElementById('__NEXT_DATA__');
    const data = JSON.parse($script.textContent);
    data.props.shouldBypassPayWall = true;
    data.props.shouldBypassRegiWall = true;
    $script.textContent = JSON.stringify(data);
}

// Otherwise we can remove some elements and restore scrolling to the main content div.

// There's this one div that contains the elems we're interested in. Get its children.
const getMainElems = () => {
    const $nextWrapper = document.getElementById('__next');
    const $wrapper1 = [...$nextWrapper.children].find(e => e.attributes.length === 0);
    return [...$wrapper1.children];
}

const getOverlayElem = () => {
    return getMainElems().find(e => window.getComputedStyle(e).opacity !== '1');
}

function main() {
    const $aside = getMainElems().find(e => e.tagName === 'ASIDE');
    if ($aside) {
        $aside.remove();
    } else {
        console.warn('uh oh, no $aside');
    }

    const $overlay = getOverlayElem();
    if ($overlay) {
        $overlay.remove();
    } else {
        console.warn('uh oh, no $overlay');
    }

    // enable scrolling by unsetting `position: fixed`
    const $content = getMainElems().find(e => !!e.querySelector('#site_header_wrapper'));
    if ($content) {
        const computedStyle = window.getComputedStyle($content);
        if (computedStyle.position === 'fixed') {
            $content.style.position = 'initial';
        } else {
            console.warn('uh oh, expected position:fixed, but got', $content.style.position);
        }
    } else {
        console.warn('uh oh, no $content');
    }
}

try {
    setBypassProp();
} catch (e) {
    console.error(e);

    // wait until this overlay element appears
    let handle = setInterval(() => {
        const $overlay = getOverlayElem();
        if ($overlay) {
            clearInterval(handle);
            main();
        }
    }, 300);
}