// ==UserScript==
// @name         Dropbox Paper Dyschromia Helper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  "Glad to help u."
// @author       Jared
// @include      https://paper.dropbox.com/doc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420979/Dropbox%20Paper%20Dyschromia%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/420979/Dropbox%20Paper%20Dyschromia%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var dropbox_paper_a11y_sucks;
    dropbox_paper_a11y_sucks = document.createElement("style");
    dropbox_paper_a11y_sucks.innerHTML = `
      :root.paper-dig-base {--hp-hld-red: #FF0000; --hp-hld-yellow: #DDDD00; --hp-hld-green: #006600; --hp-hld-blue: #002FA7; --hp-hld-purple: #800080; --hp-hld-blue: #002FA7;}
      :root.paper-dig-base.paper-dig-dark {--hp-hld-red: #FF0000; --hp-hld-yellow: #DDDD00; --hp-hld-green: #009900; --hp-hld-blue: #002FA7; --hp-hld-purple: #900090; --hp-hld-blue: #00CCFF;}
    `;
    document.body.appendChild(dropbox_paper_a11y_sucks);
})();