// ==UserScript==
// @name         Jira Focus: Ticket Sidebar Remover
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Enhance your Jira experience! This script removes all distractions (sidebars, navbar, upperbar, padding) while you're writing or editing a ticket. Just double press the Control key to toggle the focus mode on and off.
// @author       Ameer Jamal
// @match        https://*.atlassian.net/browse/*
// @match        https://*.atlassian.com/browse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472439/Jira%20Focus%3A%20Ticket%20Sidebar%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/472439/Jira%20Focus%3A%20Ticket%20Sidebar%20Remover.meta.js
// ==/UserScript==

// Toggle on Double press Control
(function() {
    let activated = false;
    let isPressing = false;

    const toggle = () => {
        var elements = document.querySelectorAll('div[data-testid="issue.views.issue-details.issue-layout.container-right"]');
        var button = document.querySelector('button[data-testid="ContextualNavigation-grab-area"]');
        var divToClick = document.querySelector('div.css-1x67wrc');
        var header = document.querySelector('.css-1r5q3td');

        if (header) {
            header.style.display = (header.style.display != 'none' ? 'none' : '');
        }

        for (var i = 0; i < elements.length; i++) {
            var styleDisplay = elements[i].style.display;
            var ariaExpanded = button.getAttribute('aria-expanded');
            if (styleDisplay != 'none' && ariaExpanded === 'true') {
                elements[i].style.display = 'none';
                divToClick.click();
            } else if (styleDisplay === 'none' && ariaExpanded === 'false') {
                elements[i].style.display = '';
                divToClick.click();
            } else if (styleDisplay != 'none' && ariaExpanded === 'false') {
                elements[i].style.display = 'none';
            }
        }

        // Toggle padding for the element on the left
        let elem = document.querySelector('div[data-testid="issue.views.issue-details.issue-layout.container-left"]');
        if (elem) {
            elem.style.padding = (elem.style.padding != '0px' ? '0px' : '');
        }
    };

  window.addEventListener('keyup', (event) => {
        if (event.key === 'Control') {
            if (isPressing) {
                activated = !activated;
                toggle();
            }
            isPressing = true;
            setTimeout(() => { isPressing = false; }, 300);
        }
    });
})();