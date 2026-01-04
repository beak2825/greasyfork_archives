// ==UserScript==
// @name         Calamari helper
// @namespace    calamarihelper
// @version      0.1.4
// @description  Adds a description to all events.
// @author       Bartek
// @match        https://as.calamari.io/absence/main-new.do
// @match        https://app.calamari.io/absence/main-new.do
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438853/Calamari%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/438853/Calamari%20helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colors = new Map([
        ["EFEE49", "Urlop na żądanie"],
        ["4E6E99", "Urlop wypoczynkowy"],
        ["827081", "Urlop bezpłatny"],
        ["FFBAC6", "Urlop okolicznościowy"],
        ["C6D2ED", "Choroba dziecka"],
        ["6E767E", "Opieka nad dzieckiem (art. 188 KP)"],
        ["B85E73", "Odbiór za święto"],
        ["FF5953", "Choroba"],
        ["6E5684", "Izolacja"],
        ["FFCAA1", "Praca zdalna"],
        ["9FB3BA", "Urlop ojcowski"],
        ["279C83", "Szkolenie / Udział w konferencji"],
        ["5D5142", "Odbiór nadgodzin"],
        ["404040", "Praca zdalna (bez związku z chorobą)"],
        ["91E863", "Delegacja"]
    ]);

    // Options for the observer (which mutations to observe)
    const config = { attributes: false, childList: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer)
    {
        for(const mutation of mutationsList)
        {
            if (mutation.type === 'childList' && mutation.addedNodes.length == 1)
            {
                var tooltip = mutation.addedNodes[0].getElementsByClassName("AbsenceToolTip-Body")[0];
                var elements = document.querySelectorAll(':hover');
                var description = ""
                for(const el of elements)
                {
                    if(el.classList.contains("fc-event"))
                    {
                        var rgb = el.style.backgroundColor;
                        var hex = rgb.substr(4, rgb.indexOf(')') - 4).split(',').map((color) => parseInt(color).toString(16).padStart(2, '0')).join('').toUpperCase();
                        description = colors.get(hex);
                    }
                }
                if(description != "" && typeof description !== 'undefined' && !tooltip.innerHTML.includes(description))
                {
                    tooltip.innerHTML = description + "<br><br>" + tooltip.innerHTML;
                }
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Select the node that will be observed for mutations
    var targetNode = document.getElementsByClassName("ToolTip")[0];
    if(targetNode != null)
    {
        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }

})();