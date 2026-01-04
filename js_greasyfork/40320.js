// ==UserScript==
// @name         Canvas Theming
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds css customization options to Canvas
// @author       Mikerific, JoeSorensen
// @match        https://stem.instructure.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40320/Canvas%20Theming.user.js
// @updateURL https://update.greasyfork.org/scripts/40320/Canvas%20Theming.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = `
    :root {
        --background: #131313;
        --primary: #282828;
        --text-primary: #FFFFFF;
        --text-secondary: #0D0D0D;
        --link-primary: #3EA6FF;
    }
    html {
        background-color: var(--background);
    }
    body {
        color: var(--text-primary);
    }
    a {
        color: var(--link-primary) !important;
    }
    .ic-app-main-content {
        background-color: var(--background);
    }
    .ic-Dashboard-header__layout {
        border-bottom: 1px solid var(--primary);
        background-color: var(--background);
    }
    .ic-notification {
        border: 2px solid var(--primary);
    }
    .ic-notification__icon {
        background: var(--primary);
    }
    .ic-notification__content {
        background: var(--primary);
    }
    .ToDoSidebarItem__Close {
        color: var(--link-primary);
    }
    a.Button--primary {
        color: var(--text-primary) !important;
    }
    .btn, .Button, .ui-button {
        background: var(--primary);
        border-color: var(--primary);
    }
    .btn-primary, .Button--primary {
        background: var(--ic-brand-button--primary-bgd);
        border-color: var(--ic-brand-button--primary-bgd-darkened-15);
    }
    .Button--icon-action, .Button--icon-action-rev {
        background: transparent;
    }
    .ic-app-footer {
        border-top: 1px solid var(--primary);
        background: var(--primary);
    }
    .ic-Layout-wrapper {
        background: var(--primary);
    }
    .ic-DashboardCard {
        background: var(--primary);
    }
    .ic-DashboardCard__header_content {
        background: var(--primary);
    }
    .ic-DashboardCard__header-subtitle, .ic-DashboardCard__header-term {
        color: var(--text-primary);
    }`;

    var theme = document.createElement("style");
    theme.innerHTML = css;
    document.head.insertAdjacentElement("beforeend", theme);
    window.onload = function(){
        document.querySelector('[data-cid="Button PopoverTrigger PositionTarget"]').style.color = "var(--text-primary)";
        for(var i = 0; i < document.querySelectorAll('[data-cid="CloseButton"]').length; i++) {
            document.querySelectorAll('[data-cid="CloseButton"]')[i].firstElementChild.style.color = "var(--link-primary)";
        }
        for(var i = 0; i < document.querySelectorAll('[label="Assignment"]').length; i++) {
            document.querySelectorAll('[label="Assignment"]')[i].firstElementChild.style.color = "var(--link-primary)";
        }
    };
})();