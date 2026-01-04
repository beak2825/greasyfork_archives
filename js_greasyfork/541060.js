// ==UserScript==
// @name         ATRL Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Script to adjust the styling on ATRL to dark mode.
// @author       Clearblue on ATRL, flexdisplay, @nickeloose
// @match        https://atrl.net/*
// @icon         https://atrl.net/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541060/ATRL%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/541060/ATRL%20Dark%20Mode.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const style = document.createElement('style');
    const elements = document.querySelectorAll('*');
    const body = document.querySelector('body.ipsApp.ipsApp_front.ipsJS_has.ipsClearfix.ipsApp_noTouch');
    if (body) {
        body.style.background = 'repeating-linear-gradient(135deg, rgb(34,34,34), rgb(34,34,34) 15em, rgb(24,24,24) 0, rgb(24,24,24) 60em)';
    }
    elements.forEach(el => {
        const computed = getComputedStyle(el);
        if (
            computed.backgroundColor === 'rgb(255, 255, 255)' ||
            computed.backgroundColor === 'rgb(255,255,255)'
        ) {
            el.style.backgroundColor = 'rgb(24,24,24)';
            el.style.color = 'rgb(241,241,241)';
        }
        if (
            computed.backgroundImage &&
            (
                computed.backgroundImage.includes('rgb(255, 255, 255)') ||
                computed.backgroundImage.includes('rgb(255,255,255)')
            )
        ) {
            el.style.backgroundImage = 'none';
            el.style.backgroundColor = 'rgb(24,24,24)';
            el.style.color = 'rgb(241,241,241)';
        }
    });
    style.textContent = `
        .ipsPad_half {
            background-color: rgb(24, 24, 24) !important;
            color: rgb(241, 241, 241) !important;
            border: .4px solid #333333;
        }
        html {
            position: relative !important;
        }

        html:before {
            position: absolute !important;
            width: 100% !important;
            height: 100% !important;
            background: rgb(42 42 42 / 4%) !important;
            content: " " !important;
            z-index: 11111 !important;
            pointer-events: none !important;
        }
        a, [data-focus-post-header] .cPost .cAuthorPane .cAuthorPane_author a {
            color: rgb(230,230,230) !important;
            transition: color 0.2s;
        }
        a:hover {
            color: #d13434 !important;
        }
        li.ipsDataItem, .ipsApp .cke_wysiwyg_frame, .ipsApp .cke_wysiwyg_div, .ipsComposeArea_dropZone, .ipsHovercard, .ipsApp .ipsButton_primary  {
            background: #181818 !important;
        }
        [data-role="breadcrumbList"] li a:hover {
            color: black !important;
        }
        .ipsCoverPhoto_container, [data-focus-blocks~="contrast"] .ipsToolList > li > .ipsButton_link {
            background: #a90100 !important;
        }
        li.ipsReact_reactCount a {
            background: #2e2e2e !important;
        }
        h3.ipsWidget_title.ipsType_reset, h2.ipsWidget_title.ipsType_reset, div#elWarningInfo {
            background: #b72c2c !important;
        }
        .ipsNavBar_primary > ul > li:hover {
            background: #9d2727 !important;
            border-radius: 4px !important;
        }
        #ipsLayout_header header {
            background-color: rgb(var(--theme-header)) !important;
            color: rgb(var(--theme-header_text)) !important;
        }
        .ipsNavBar_primary > ul > li > a {
            background: none !important;
        }
        [data-focus-toggle-theme] {
            display: none !important;
        }
        [data-focus-post-header] .cPost::before {
            background: #151615 !important;
        }
        .cTopicOverview__preview:after {
            display: none !important;
        }
        #elUserNav > li {
            border: none !important;
        }
        .focus-secondary-header, #elUserNav {
            background: transparent !important;
        }
        .ipsNavBar_primary > ul > li > a:hover, #elUserNav > li:hover a {
            color: white !important;
        }
        .ipsCommentCount, .ipsQuote_citation {
            background: rgb(31, 31, 31) !important;
            color: rgb(241,241,241) !important;
        }
        .ipsBreadcrumb [data-role="breadcrumbList"] li:hover > a::before, .ipsBreadcrumb [data-role="breadcrumbList"] li:hover > a::after, .ipsBreadcrumb .ipsList_inline a:hover, [data-role="breadcrumbList"] li a:hover {
            color: #fff !important;
        }
        .ipsApp .ipsNotificationCount {
            background: #fff !important;
            color: #a6292a !important;
        }
        [data-ipseditor], .ipsApp .cke_top, .ipsQuote {
            background: rgb(31, 31, 31) !important;
        }
        :root {
            --ATRL-dark-grey: #fff !important;
            --theme-light_button: 18, 18, 18 !important;
            --theme-area_background_dark: 33, 33, 33 !important;
            --theme-area_background_reset : 33, 33, 33 !important;
            --theme-area_background: 33, 33, 33 !important;
            --theme-area_background_light: 33, 33, 33 !important;
            --informational-dark: rgb(18, 18, 18) !important;
            --theme-text_color: 255, 255, 255 !important;
            --theme-important_button: 18, 18, 18 !important;
            --theme-link: rgb(241,241,241) !important;
            --theme-text_dark : rgb(241,241,241) !important;
            --theme-text_light: rgb(227,227,227) !important;
            --theme-widget_title_bar:rgb(209, 52, 52) !important;
            --theme-tab_background: 209, 52, 52 !important;
            --theme-button_bar: rgb(34,34,34) !important;
            --box--backgroundColor: rgb(24,24,24) !important;
            --focus-bg--color: rgb(34,34,34) !important;
            --logo--color: rgb(241,241,241) !important;
            --header--background-color: rgb(24,24,24) !important;
            --nav-bar--color: rgb(241,241,241) !important;
            --nav--background: rgb(24,24,24) !important;
            --nav--color: rgb(241,241,241) !important;
            --nav-hover--color: #d13434 !important;
            --nav-hover--background: rgb(51,51,51) !important;
            --nav-active--color: rgb(255,255,255) !important;
            --nav-active--background: rgb(68,68,68) !important;
            --secondary-nav--background: rgb(34,34,34) !important;
            --secondary-nav--box-shadow: rgb(17,17,17) 0px 1px 2px !important;
            --secondary-nav--border-color: rgb(51,51,51) !important;
            --nav-dropdown--background: rgb(34,34,34) !important;
            --nav-dropdown--color: rgb(241,241,241) !important;
            --nav-dropdown--border: rgb(51,51,51) !important;
            --nav-dropdown--box-shadow: rgb(17,17,17) 0px 0px 0px 1px, rgb(17,17,17) 0px 6px 20px, rgb(17,17,17) 0px 2px 2px !important;
            --nav-dropdown-hover--background: rgb(51,51,51) !important;
            --user-nav--background: rgb(24,24,24) !important;
            --user-nav--hover-background: rgb(132 30 30) !important;
            --user-nav--color: rgb(241,241,241) !important;
            --user-nav--border-color: rgb(51,51,51) !important;
            --user-nav-cta--color: rgb(255,255,255) !important;
            --user-nav-cta--background: rgb(51,51,51) !important;
            --search--background: rgb(183 44 44) !important;
            --search--color: rgb(241,241,241) !important;
            --breadcrumb--color: rgb(241,241,241) !important;
            --breadcrumb--background: rgb(24,24,24) !important;
            --breadcrumb--border: rgb(51,51,51) !important;
            --breadcrumb-angle-1: rgb(51,51,51) !important;
            --breadcrumb-angle-2: rgb(68,68,68) !important;
            --breadcrumb-hover: #d13434 !important;
            --breadcrumb-active: #d13434 !important;
            --focus-social--color: rgb(241,241,241) !important;
            --customizer-overlay: rgb(24,24,24) !important;
            --toggle-active--background: rgb(51,51,51) !important;
            --editor-save--background: rgb(34,34,34) !important;
            --box--border-color: rgb(51,51,51) !important;
            --box--boxShadow: rgb(17,17,17) 0px 4px 6px -2px !important;
            --sectiontitle--background: rgb(34,34,34) !important;
            --sectiontitle--border-color: rgb(51,51,51) !important;
            --widgettitle--border-color: rgb(51,51,51) !important;
            --forum-icon--color: rgb(241,241,241) !important;
            --avatar--box-shadow: rgb(17,17,17) 0px 3px 8px !important;
            --mega-footer--color: rgb(241,241,241) !important;
            --mega-footer--background: rgb(24,24,24) !important;
            --mobile-footer--background: rgb(24,24,24) !important;
            --mobile-footer--color: rgb(241,241,241) !important;
            --mobile-footer--active: #d13434 !important;
            --theme-mentions: 51, 51, 51 !important;
            --liveActivity--ba-co: rgb(34,34,34) !important;
            --liveActivity--co: rgb(241,241,241) !important;
            --post-header--background: rgb(183, 44, 44) !important;
            --post-header--color: rgb(241,241,241) !important;
            --post-header--border: 1px solid rgb(51,51,51) !important;
            --itemControls--background: rgb(34,34,34) !important;
            --theme-very_light_button: 34, 34, 34 !important;
            --itemControls--border-color: rgb(51,51,51) !important;
            --commentControlButton--color: rgb(241,241,241) !important;
            --commentControlButton--background:rgb(51,51,51) !important;
            --commentControlButton-hover--background: rgb(51,51,51) !important;
            --commentControlButton--border-color: rgb(51,51,51) !important;
            --commentControlText--color: rgb(241,241,241) !important;
            --ipsmenu--background: rgb(24,24,24) !important;
        }
        `;
    document.head.appendChild(style);

    document.querySelectorAll('.cPost_contentWrap').forEach(wrap => {
        wrap.querySelectorAll('[style]').forEach(el => {
            const styleAttr = el.getAttribute('style');
            if (styleAttr && styleAttr.replace(/\s/g, '').toLowerCase().includes('color:#000000;')) {
                const newStyle = styleAttr.replace(/color:\s*#000000;?/gi, '');
                if (newStyle.trim() === '') {
                    el.removeAttribute('style');
                } else {
                    el.setAttribute('style', newStyle);
                }
            }
        });
    });
})();

