// ==UserScript==
// @name         Toggle InstantMarkdown width
// @description  Adds a button to toggle between full width and GitHub default width
// @match        http://localhost:8090/
// @grant        none
// @namespace    http://foo.at/
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/16912/Toggle%20InstantMarkdown%20width.user.js
// @updateURL https://update.greasyfork.org/scripts/16912/Toggle%20InstantMarkdown%20width.meta.js
// ==/UserScript==

/*
 * Copyright 2015-2016 Stefan Weiss <weiss@foo.at>
 * License: Public Domain
 * Please let me know if this script stops working for you.
 */

/* jshint esversion: 6 */
(function () {

    "use strict";

    if (!_qs("#js-repo-pjax-container")) {
        return;
    }

    let toggled = false;
    const btn = document.createElement("button");
    btn.textContent = "Toggle width";
    btn.style.cssText = "position: absolute; top: 10px; right: 10px";
    document.body.appendChild(btn);

    btn.onclick = function () {
        _qs(".container").style.width = toggled ? "980px" : "auto";
        _qs("#js-repo-pjax-container").style.width = toggled ? "790px" : "auto";
        _qs("article.markdown-body").style.maxWidth = toggled ? "790px" : "100%";
        toggled = !toggled;
    };

    function _qs (sel, base)
    {
        return (base || document).querySelector(sel);
    }

})();

