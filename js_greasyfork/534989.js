// ==UserScript==
// @name         Google Docs Dark Mode Updated 2025
// @version      1.2
// @description  Turn Google Docs into dark mode.
// @author       Twoinit
// @match        https://docs.google.com/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @run-at       context-menu
// @license      MIT
// @namespace https://greasyfork.org/users/1465820
// @downloadURL https://update.greasyfork.org/scripts/534989/Google%20Docs%20Dark%20Mode%20Updated%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/534989/Google%20Docs%20Dark%20Mode%20Updated%202025.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const observer = new MutationObserver(() => {
        applyDarkModeStyles();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    function applyDarkModeStyles() {
        changeClassCss("docs-font-size-inc-dec-combobox", "color", "#FFF");
        changeClassCss("docs-font-size-inc-dec-combobox", "background", "#2B2B39");
        changeClassCss("goog-toolbar-combo-button-input", "color", "#FFF");
        changeClassCss("goog-toolbar-combo-button-input", "background", "#2B2B39");
        changeClassCss("docs-toolbar-zoom-combobox", "color", "#FFF");
        changeClassCss("docs-toolbar-zoom-combobox", "background", "#2B2B39");
        changeClassCss("goog-toolbar-select", "background", "#2B2B39");
        changeClassCss("goog-toolbar-menu-button", "background", "#2B2B39");
        changeClassCss("goog-toolbar-button", "background", "#2B2B39");
        changeClassCss("docs-icon-img-container", "filter", "brightness(2.5)");
        changeClassCss("docs-main-toolbars", "background", "#15151c");
        changeClassCss("docs-main-toolbars", "border-top", "1px solid #303640");
        changeClassCss("docs-main-toolbars", "border-bottom", "1px solid #303640");
        changeClassCss("docs-omnibox-input", "background", "#2B2B39");
        changeClassCss("docs-material", "background", "#15151c");
        changeClassCss("navigation-item-content", "cssText", "color: #FFF !important; filter: brightness(2.5) !important;");
        changeClassCss("left-sidebar-container", "box-shadow", "1px 0 0 0 #070c16");
        changeClassCss("left-sidebar-container", "background", "#15151c");

        changeClassCss(
            "docs-horizontal-ruler",
            "border-bottom",
            "1px solid #4f5052"
        );
    }

    GM_addStyle(`
        .docs-header {
            background-color: #15151c !important;
            position: sticky !important;
            z-index: 1000 !important;
        }

        .docs-header-container {
            background-color: #15151c !important;
        }

        .docs-primary-toolbars {
            background-color: #15151c !important;
        }

        kix-horizontal-ruler > div > div.docs-ruler-background {
            background: #3F3F40;
        }
        kix-horizontal-ruler > div > div.docs-ruler-face {
            background: #58575e;
        }
        kix-horizontal-ruler {
            background: #39393a;
        }

        .kix-outlines-widget-header-contents, .kix-outlines-widget-header-text-chaptered, .navigation-widget-header {
            background-color: #15151c !important;
            color: white !important;
        }

        .kix-outlines-widget-header-add-chapter-button {
            background-color: #15151c !important;
        }

        .kix-appview-editor {
            background-color: #2b2b39 !important;
            border: none !important;
        }

        .docs-butterbar-container {
            border: none !important;
        }

        .kix-page {
            border: none !important;
            box-shadow: none !important;
        }

        .kix-page-paginated {
            border: none !important;
            outline: none !important;
        }

        .kix-outlines-widget-header-add-chapter-button .jfk-button {
            background-color: #2B2B39 !important;
            border-color: #303040 !important;
        }
        .navigation-item-list .navigation-item .navigation-item-content {
            filter: brightness(1.5);
        }
        .navigation-item-list .navigation-item .navigation-item-level-0 {
            filter: brightness(4.5);
            font-size: 18px;
        }

        .goog-toolbar-menu-button-inner-box .goog-toolbar-menu-button-caption {
            color: white;
        }

        .goog-toolbar-combo-button-input {
            color: white !important;
        }

        .goog-control-hover, .goog-toolbar-button-hover, .goog-toolbar-menu-button-hover,
        .goog-toolbar-button-hover, .goog-toolbar-combo-button-hover, .menu-button.goog-control-hover,
        .goog-toolbar-menu-button.goog-toolbar-menu-button-hover, .goog-toolbar-menu-button:hover, .goog-toolbar-button:hover{
            background-color: #3F3F40 !important;
            border-color: #404050 !important;
            color: white !important;
        }

        .goog-menuitem-highlight, .goog-menuitem-hover {
            background-color: #3F3F40 !important;
            color: white !important;
        }


        .goog-toolbar-menu-button-hover .goog-toolbar-menu-button-caption, .goog-toolbar-button-hover .goog-toolbar-button-caption {
            background-color: #3F3F40 !important;
            color: white !important;
        }

        navigation-widget-top-shadow {
            opacity: 0 !important;
        }

        .menu-button {
            color: white !important;
        }

        .docs-title-widget {
            background: #39393a !important;
        }

        .docs-title-input {
            color: gray !important;
            background-color: #39393a !important;
        }
        .docs-title-input-label-inner {
            color: white !important;
        }
        .companion-app-switcher-container {
            background-color: transparent !important;
            border-color: transparent !important;
        }

        qJTzr > div.app-switcher-button-icon-container {
            filter: contrast(0) !important;
        }
        .docs-titlebar-buttons {
            background-color: #15151c !important;
        }

        .goog-toolbar[role=toolbar] .docs-font-size-inc-dec-action-button.goog-toolbar-button,
        fontSizeSelect.docs-font-size-inc-dec-combobox
        {
            border-color: #303040 !important;
        }

        .goog-menu-button-dropdown, .goog-menu, .goog-menuitem, .goog-menuitem-content, .docs-material-gm-select-outer-box {
            color: white !important;
            background-color: #2B2B39 !important;
        }

        .goog-menu {
            border-color: #303040 !important;
        }

        .goog-menuitem-highlight {
            background-color: #3F3F40 !important;
        }

        docs-meet-in-editors-entrypointbutton {
            background: #1e1e2a !important;
        }
    `);
})();

function changeClassCss (className, property, value) {
    const nodeList = document.querySelectorAll(`.${className}`);
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].style.setProperty(property, value, "important");
    }
}
