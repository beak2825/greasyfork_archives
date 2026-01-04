// ==UserScript==
// @name         Google Docs Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Turn Google Docs into dark mode.
// @author       You
// @match        https://docs.google.com/document/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @run-at       context-menu
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460731/Google%20Docs%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/460731/Google%20Docs%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...

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
    changeClassCss("navigation-item-content", "color", "#FFF");
    changeClassCss("left-sidebar-container", "box-shadow", "1px 0 0 0 #070c16");
    changeClassCss("left-sidebar-container", "background", "#15151c");
    changeClassCss("navigation-item-content", "filter", "brightness(2.5)");
    //changeClassCss("docs-ruler-face", "background-color", "#58575e");
    //changeClassCss("docs-ruler-mask", "background-color", "#39393a");
    //changeClassCss("docs-ruler-background", "background-color", "#3F3F40");

    changeClassCss(
        "docs-horizontal-ruler",
        "border-bottom",
        "1px solid #4f5052"
    );

    GM_addStyle(`

        .kix-appview-editor {
            background-color: #2b2b39 !important;
        }
        #kix-horizontal-ruler > div > div.docs-ruler-background {
            background: #3F3F40;
        }
        #kix-horizontal-ruler > div > div.docs-ruler-face {
            background: #58575e;
        }
        #kix-horizontal-ruler {
            background: #39393a;
        }
        .navigation-item-list .navigation-item .navigation-item-content {
            filter: brightness(1.5);
        }
        .navigation-item-list .navigation-item .navigation-item-level-0 {
            filter: brightness(4.5);
            font-size: 18px;
        }
        
        .goog-toolbar-menu-button-inner-box .goog-toolbar-menu-button-caption{
            color: white;
        }

        .goog-toolbar-combo-button-input {
            color: white !important;
        }

        #navigation-widget-top-shadow {
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

        #qJTzr > div.app-switcher-button-icon-container {
            filter: contrast(0) !important;
        }
        .docs-titlebar-buttons {
            background-color: #15151c !important;
        }

        .goog-toolbar[role=toolbar] .docs-font-size-inc-dec-action-button.goog-toolbar-button,
        #fontSizeSelect.docs-font-size-inc-dec-combobox
        {
            border-color: #303040 !important;
        }

        #docs-meet-in-editors-entrypointbutton {
            background: #1e1e2a !important;
        }
    `);
})();

function changeClassCss(className, property, value) {
    const nodeList = document.querySelectorAll(`.${className}`);
    for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].style.setProperty(property, value, "important");
    }
}
