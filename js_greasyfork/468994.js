// ==UserScript==
// @name        HamroCSIT Bypass
// @namespace   Violentmonkey Scripts
// @match       https://*.hamrocsit.com/*
// @grant       none
// @version     4.0.1
// @author      Grizz1e
// @description Bypass paywall bs, remove junks and enable dark mode by default in HamroCSIT.com
// @run-at      document-end
// @license GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/468994/HamroCSIT%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/468994/HamroCSIT%20Bypass.meta.js
// ==/UserScript==

(function ($) {
    'use strict';

    $(window).on('load', function () {
        const currentHost = location.hostname;

        // 1. Set hassubscription = true
        const checkInterval = setInterval(function () {
            if (typeof window.tucsitnotes !== 'undefined') {
                window.tucsitnotes.hassubscription = true;
                console.log('✅ tucsitnotes.hassubscription set to true');
                clearInterval(checkInterval);
            }
        }, 100);

        // 2. Remove external image links
        $('a:has(img)').each(function () {
            const href = $(this).attr('href');
            if (!href) return;
            const linkHost = new URL(href, location.href).hostname;
            if (linkHost !== currentHost) {
                $(this).remove();
            }
        });

        // 3. Remove Messenger live chat widget
        $('.messanger_floating').remove();

        // 4. Remove "Course" and "Subscription" nav items (using presence of .application_version)
        $('nav#menu a:has(span.application_version)').closest('li.menu-item').remove();

        // 5. Remove floating theme toggle widget
        $('.style-switcher').remove();

        // 6. Move theme toggle button into navbar
        const themeToggle = $(`
            <li class="menu-item">
                <a href="#" id="navbar-theme-toggle">
                    <i class="fas fa-moon"></i> Theme
                </a>
            </li>
        `);
        $('nav#menu ul.menu-section').append(themeToggle);

        // 8. Handle theme toggle click
        $('#navbar-theme-toggle').on('click', function (e) {
            e.preventDefault();

            // Trigger original toggle if exists
            $('.day-night').trigger('click');

            // Fallback manual toggle
            $('body').toggleClass('dark');

            // Update color of #myTab
            updateMyTabColor();

            console.log('🌓 Theme toggled');
        });

        // 10. Center contents of all .row elements
        $('<style>')
            .prop('type', 'text/css')
            .html(`.row { display: flex !important; justify-content: center !important; } .course-single-tab .nav .nav-link, .question-bank-sidebar { color: #03af92 !important; }`)
            .appendTo('head');

        // 11. Remove empty divs with class starting with 'row' or class 'col-md-3'
        $('div').filter(function () {
            const cls = this.className || '';
            const isTarget = cls.startsWith('row') || cls.split(/\s+/).includes('col-md-3');
            const isEmpty = this.children.length === 0 && this.textContent.trim() === '';
            return isTarget && isEmpty;
        }).remove();
    });

})(window.jQuery);
