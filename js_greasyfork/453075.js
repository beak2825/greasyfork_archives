// ==UserScript==
// @name         Figma scroll fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  https://forum.figma.com/t/horizontal-scroll-on-the-layers-panel/643/54
// @author       aolko + https://forum.figma.com/u/Toni_Andric & https://forum.figma.com/u/Gomes_Ivan
// @match        *://www.figma.com/file/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=figma.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/453075/Figma%20scroll%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/453075/Figma%20scroll%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Old way
    /*
    GM_addStyle(`
    [class*="object_row--indent--"] {
        margin: 0 !important;
        width: 8px;
    }
    `);
    */

    GM_addStyle(`
        [data-testid="layer-row-with-children"],
        [data-testid="layer-row"],
        [class|='scroll_container--innerScrollContainer']:not([class|='object_row--instance--']) {
            /* Make each row take up as much horizontal space as it can. */
            width: 100% !important;
        }
        [class|=pages_panel--objectPanelContent-] {
            /* this is what enables scrolling (if needed) in both directions */
            overflow: auto;
        }
        [class*=js-fullscreen-wheel-event-capture][class*=objects_panel--scrollContainer][class*=objects_panel--scrollContainerWithBorder][class*=scroll_container--clipContainer] {
            /* This overrides the inline styles that get added on sidebar resizing. */
            width: 1000px !important;
            position: relative;
        }
        [class|=object_row--indent-]:not([class|=object_row--indent-]:first-of-type) {
            /* This reduces the indentation of nested layers */
            width: 5px;
        }
    `);
    // Additionally, fix the Layers panel label. Prevent overlaying the main area in certain edge cases
    var header = document.querySelector("[class|=pages_panel--objectPanelContent-] [style*='translate3d(0px, 0px, 0px)']");
    header.style.position = 'absolute';
    header.style.transform = 'translate3d(0px, 0px, 0px);';
})();