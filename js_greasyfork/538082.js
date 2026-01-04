// ==UserScript==
// @name     _Hide Discover Luna Link on Twitch
// @author       xabyxd
// @description  Basic script to hide Luna
// @grant    GM_addStyle
// @source      https://github.com/xabyxd/hide-discover-Luna-twitch
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @version      2024-03-05
// @include  https://www.twitch.tv/*
// @license MIT
// @namespace https://greasyfork.org/users/1270768
// @downloadURL https://update.greasyfork.org/scripts/538082/_Hide%20Discover%20Luna%20Link%20on%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/538082/_Hide%20Discover%20Luna%20Link%20on%20Twitch.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle('a.top-nav__external-link[data-test-selector="top-nav__presto-link"][href="https://www.amazon.com/luna"] { display: none !important; }');
})();

//<a aria-label="Discover Luna" class="top-nav__external-link" link="8" data-a-target="try-presto-link" data-test-selector="top-nav__presto-link" label="Discover Luna" rel="noopener noreferrer" target="_blank" href="https://www.amazon.com/luna">
//    <div><div class="Layout-sc-1xcs6mc-0 cqxhjh"><div class="Layout-sc-1xcs6mc-0 eLnISm">
//        <p class="CoreText-sc-1txzju1-0 ScTitleText-sc-d9mj2s-0 AAWwv ezNtJL tw-title">Discover Luna</p></div>
//        <div class="Layout-sc-1xcs6mc-0 irBXzy"><p class="CoreText-sc-1txzju1-0 ScTitleText-sc-d9mj2s-0 sghpq caLSIS tw-title">Discover Luna</p></div></div></div></a>
