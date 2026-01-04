// ==UserScript==
// @name         timetracking
// @description  timetracking project search
// @include      /^https://timetracking.adrentech.com/
// @version 0.0.1.20211123124845
// @namespace https://greasyfork.org/users/843175
// @downloadURL https://update.greasyfork.org/scripts/435944/timetracking.user.js
// @updateURL https://update.greasyfork.org/scripts/435944/timetracking.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement('link');
    style.href = 'https://cdnjs.cloudflare.com/ajax/libs/select2/3.0.0/select2.css';
    style.rel = 'stylesheet';
    document.body.appendChild(style);

    var script = document.createElement('script');
    script.onload = () => setInterval(() => $(':not(:has(.select2-container))>select').select2(), 1000);
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/select2/3.0.0/select2.js';
    document.body.appendChild(script);
})();