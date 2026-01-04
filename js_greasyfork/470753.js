// ==UserScript==
// @name         Mastodon BirdUI Style Override
// @namespace    https://greasyfork.org/en/scripts/470753-mastodon-birdui-style-override
// @version      0.6
// @description  Changes the style of Mastodon  to BirdUI (https://github.com/ronilaukkarinen/mastodon-bird-ui) by Rolle (https://mementomori.social/@rolle)
// @author       Cragsand - (https://mastodon.social/@cragsand)
// @match        https://universeodon.com/*
// @match        https://mastodon.social/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @license      MIT License
// @resource     cssFile  https://raw.githubusercontent.com/ronilaukkarinen/mastodon-bird-ui/master/layout-single-column.css
// @downloadURL https://update.greasyfork.org/scripts/470753/Mastodon%20BirdUI%20Style%20Override.user.js
// @updateURL https://update.greasyfork.org/scripts/470753/Mastodon%20BirdUI%20Style%20Override.meta.js
// ==/UserScript==

// INSTRUCTIONS
// To add support for more instances
// Add another @match followed by the URL to your instance

(function() {
    'use strict';

    // Apply the CSS from Rolles repo
    var cssText = GM_getResourceText('cssFile');
    GM_addStyle(cssText);

    // Change background to black like Twitter - Add two slashes in front to disable
    document.documentElement.style.setProperty('--color-brand-mastodon-bg', 'black');
    document.documentElement.style.setProperty('--color-bg-75', 'black');

    // Fix an error in the CSS by overriding the style for threaded replies and changing the background color to black
    // Comment out or remove this section once it's been fixed
    var customCSS = `
        .status--in-thread .status__content.status__content--with-action  {
            padding-left: 0px !important;
        }
        .columns-area__panels__main {
            background-color: black !important;
        }
    `;
    // Apply the CSS error correction
    GM_addStyle(customCSS);

})();