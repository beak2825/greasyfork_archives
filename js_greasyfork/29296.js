// ==UserScript==
// @name            Daptiv PCF Name Changer
// @namespace       CareSource
// @version         0.2.0
// @description     Rewrite Dativ PCF names to be more understandable
// @author          Josh Cope
// @include         https://daptiv.com/*
// @include         https://*.daptiv.com/*
// @downloadURL https://update.greasyfork.org/scripts/29296/Daptiv%20PCF%20Name%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/29296/Daptiv%20PCF%20Name%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var mapping = {
        "10573 - Perform IT research and innovation": "10573 - Discovery",
        "10581 - Manage IT customer satisfaction": "10581 - Feedback",
        "10588 - Perform IT services and solutions life cycle planning": "10588 - Communication",
        "10590 - Create IT services and solutions": "10590 - Implementation, Testing & Training",
        "10591 - Maintain IT services and solutions": "10591 - Maintenance"
    },
    className = "processed",
    interval = 500;


    function doTheThing() {
        var elements = document.querySelectorAll("td.itm.task a");

        Array.prototype.forEach.call(elements, function(el, i){
            if (!el.classList.contains(className)) {
                var title = el.getAttribute('title');
                el.textContent = (mapping[title]?mapping[title]:el.textContent);
                el.classList.add(className);
            }
        });
    }

    doTheThing();
    var timer = setInterval(doTheThing, interval);

})();