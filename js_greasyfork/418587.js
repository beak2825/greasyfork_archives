// ==UserScript==
// @name             medium.com: read unlimited stories
// @description      removes the "sid" cookie, which is used to detect, how many stories you already read
// @match            http*://medium.com/*
// @run-at           document-start
// @author           Archangel1C
// @license          GPL-3.0-only
// @namespace        https://github.com/Archangel1C
// @version          0.1
// @grant            none
// @compatible       chrome
// @contributionURL  https://flattr.com/@Archangel1C
// @downloadURL https://update.greasyfork.org/scripts/418587/mediumcom%3A%20read%20unlimited%20stories.user.js
// @updateURL https://update.greasyfork.org/scripts/418587/mediumcom%3A%20read%20unlimited%20stories.meta.js
// ==/UserScript==
//
// Sources/Influences:
//

(function resetSidCookie() {
    'use strict';

    const storiesLeftCookie = "sid";
//  const oldValue = cookieValue(storiesLeftCookie);
//  const newValue = "";
    document.cookie = storiesLeftCookie + "=";
//  console.log(`[${GM_info.script.name}] set cookie [${storiesLeftCookie}]: [${oldValue}] -> [${newValue}]`);
    console.log(`[${GM_info.script.name}] cookie [${storiesLeftCookie}] was reset to enable unlimited reading`);

})();

function cookieValue(name) {
    return document.cookie
        .split('; ')
        .find(row => row.startsWith(name))
        .split('=')[1];
}
