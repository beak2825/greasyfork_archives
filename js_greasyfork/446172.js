// ==UserScript==
// @name         Emulate Google Analytics on gitignore.io
// @namespace    https://rabit.pw/
// @version      0.1
// @description  Fix gitignore.io not working with ADBlock enabled
// @author       ttimasdf
// @license      GPLv3
// @match        https://www.toptal.com/*
// @match        https://gitignore.io/*
// @icon         https://icons.duckduckgo.com/ip2/toptal.com.ico
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/446172/Emulate%20Google%20Analytics%20on%20gitignoreio.user.js
// @updateURL https://update.greasyfork.org/scripts/446172/Emulate%20Google%20Analytics%20on%20gitignoreio.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.gtag = (event, ...args) => {
        var cb = args[1].event_callback;
        if (typeof cb === "function") {
            cb();
        }
        console.log(event, ...args);
    };
})();
