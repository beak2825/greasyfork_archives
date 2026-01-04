// ==UserScript==
// @name         Fake random.org
// @version      0.2
// @description  Fake ranndom.org result
// @namespace    greasyfork.org/en/scripts/476305-fake-random-org
// @namespace    gist.github.com/nghiepdev/5cab09f3edb35c4a17af2453fb01a852
// @author       nghiepdev
// @match        https://www.random.org/widgets/integers/iframe?*
// @match        https://random.org/widgets/integers/iframe?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=random.org
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/476305/Fake%20randomorg.user.js
// @updateURL https://update.greasyfork.org/scripts/476305/Fake%20randomorg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const RESULT = [13, 14, 15, 16, 17];
    let INDEX = 0;
    const originalReplaceAll = window.replaceAll;
    window.replaceAll = (a, b, c) => {
        const result = originalReplaceAll(a, b, c);
        if(INDEX > RESULT.length - 1) {
          INDEX = 0;
        }
        return result.replace(/\d+(?=\<br)/, RESULT.at(INDEX++));
    };
})();