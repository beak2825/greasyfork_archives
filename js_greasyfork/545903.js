// ==UserScript==
// @name         Vjudge example for custom name in Competitive Companion Customized
// @version      0.1
// @description  This is an example for vjudge, more details in https://github.com/lnw143/competitive-companion-customized
// @author       ZnPdCo
// @namespace    competitive-companion-customized
// @license      MIT
// @match        https://vjudge.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vjudge.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545903/Vjudge%20example%20for%20custom%20name%20in%20Competitive%20Companion%20Customized.user.js
// @updateURL https://update.greasyfork.org/scripts/545903/Vjudge%20example%20for%20custom%20name%20in%20Competitive%20Companion%20Customized.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elem = document.createElement('div')
    elem.innerHTML = 'Myself ' + decodeURI(location.href.split('/').last())
    elem.id = 'customNameForCompetitiveCompanionCustomized'
    elem.style.display = 'none'
    document.body.append(elem)
})();