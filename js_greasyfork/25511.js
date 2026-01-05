// ==UserScript==
// @name         Replace analytics text
// @namespace    http://tampermonkey.net/
// @description  try to take over the world!
// @version      0.1
// @author       kuma
// @match        https://analytics.google.com/analytics/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25511/Replace%20analytics%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/25511/Replace%20analytics%20text.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function replaceText() {
        var target = $('#ID-eventPanel-Table').find('tbody td > span[title]');
        if (!target.length) return; 
        target.each(function() {
            var $this = $(this);
            var prop = decodeURIComponent($this.prop('title'));
            if ($this.text !== prop) {
                $this.text(prop);
            }
        });
    }

    $(function() {
      setInterval(replaceText, 200);
    });
})();