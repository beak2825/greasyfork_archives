// ==UserScript==
// @name         Remotive.io: keep tab name
// @namespace    https://hoa.ro
// @version      0.1
// @description  Prevent tab to switch to dummy doge favicon and title.
// @author       ArthurHoaro
// @match        https://remotive.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421518/Remotiveio%3A%20keep%20tab%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/421518/Remotiveio%3A%20keep%20tab%20name.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.removeEventListener("visibilitychange", onVisibilityChange, true);
})();