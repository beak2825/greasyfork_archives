// ==UserScript==
// @name         Скрываем элементы админа на ГК
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Code for hide admin elements in GetCourse
// @author       You
// @license      MIT
// @match        *://*/teach/control/*
// @match        *://*/teach/control
// @match        *://*/pl/notifications/*
// @match        *://*/sales/control/*
// @match        *://*/pl/*
// @match        *://*/notifications/settings/my/*
// @match        *://*/notifications/notifications/*  // Добавлена или исправлена эта строка
// @match        *://*/profile/*
// @match        *://*/cms/*
// @match        *://*/user/my/*
// @match        *://*/sales/shop/*
// @exclude      *://*/sales/control/deal/update/id/*
// @exclude      *://*/pl/sales/deal*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=getscript.ru
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474511/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B0%20%D0%BD%D0%B0%20%D0%93%D0%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/474511/%D0%A1%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D1%8B%20%D0%B0%D0%B4%D0%BC%D0%B8%D0%BD%D0%B0%20%D0%BD%D0%B0%20%D0%93%D0%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide elements
    function hideElements() {
        const styles = `
            .one-panel,
            .two-panel,
            .three-panel,
            .moderation-link,
            .webinar-chat-toggle,
            .__chtm-create-funnel-btn-inserted,
            #gcAccountUserMenu label[for="remake-toggler"],
            .page-header .page-actions,
            .gc-tags,
            .page-header .content-menu,
            .gc-tasks-block,
            .gc-page-nav-items-menu,
            .topNotitication,
            .topNotitication-notice,
            .top-notitication,
            .gc-page-nav-items-menu,
            .menu-item-user,
            .menu-item-cms,
            .menu-item-tasks,
            .global-controls,
            .xdget-image.desc.banner,
            a[href="/pl/teach/training/archived"],
            a[href*="/sales/control/deal/update/"],
            .remake-right-panel-toggler,
            button[onclick="location.href='/teach/control/stream/new'"],
            .isTrainingsPage .page-header,
            .margin-top-notice,
            .notice-top-panel,
            .training-row.no-public,
            .training-row.no-lessons,
            #gl-widget-cont {
                display: none !important;
            }

            .xdget-visible-to-bg-admins {background-image: none !important;}
            
            .gc-page-nav-items-menu,
            .topNotitication,
            .topNotitication-notice,
            .top-notitication {
                opacity: 0;
                position: absolute;
                z-index: -1000;
                pointer-events: none;
            }
            
            .isPaymentsPage .xdget-block.xdget-row.xdget-common-container.xdget-visible-to-bg- {
                background-color: unset !important;
            }
            
            .menu-item.menu-item-sales {
                position: absolute !important;
                bottom: 100px;
                opacity: 0;
            }
            
            .menu-item.menu-item-sales:hover {
                opacity: 1;
            }
            
            .page-actions {
                height: 0 !important;
                opacity: 0;
                display: 0;
                position: absolute;
                top: -9999999px;
            }
            
            .xdget-visible-to-bg-users,
            .xdget-visible-to-bg-admins {
                background-image: unset !important;
            }
            
            .main-page-block .container {
                padding-top: 30px;
            }
        `;
        GM_addStyle(styles);
    }

    // Initial call to hide elements
    hideElements();

    // Use MutationObserver to handle dynamically loaded elements
    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();