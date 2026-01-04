// ==UserScript==
// @name         PlusporaExpand
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically expand all "Show More" posts
// @author       Antonio Freixas
// @match        https://pluspora.com/*
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/375794/PlusporaExpand.user.js
// @updateURL https://update.greasyfork.org/scripts/375794/PlusporaExpand.meta.js
// ==/UserScript==

(function() {
    'use strict';
    jQuery.noConflict();
    (function( $ ) {
        $(function() {
            $(document).ready(function() {
                window.setInterval(function() {
                    $("div.collapsible.collapsed").css({ height: "auto" }).removeClass("collapsed").addClass("opened");
                    $("div.expander").css({ display: "none" });
                }, 1000);
            });
        });
})(jQuery);

})();