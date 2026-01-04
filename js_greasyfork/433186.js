// ==UserScript==
// @name         BlackboardNoThinAutocollapse
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Prevent blackboard from collapsing sidebar
// @author       You
// @match        https://blackboard.jhu.edu/webapps/blackboard/*
// @icon         https://www.google.com/s2/favicons?domain=jhu.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433186/BlackboardNoThinAutocollapse.user.js
// @updateURL https://update.greasyfork.org/scripts/433186/BlackboardNoThinAutocollapse.meta.js
// ==/UserScript==

(function() {
    'use strict';


    page.PageMenuToggler.prototype.isLessThanMinWidthToDisplayCourseMenu = function()
    {
        var width = document.viewport.getWidth();
        // 768px is the iPad width
        var minWidthToAutoCollapseInPx = 500;
        return width < minWidthToAutoCollapseInPx;
    }

        // Your code here...
})();