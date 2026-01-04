// ==UserScript==
// @name         FlatMMO UI Tweaks
// @namespace    com.pizza1337.flatmmo.uitweaks
// @version      1.2.7
// @description  Adds a modern skills panel, custom themes, virtual levels, and a portrait mode layout
// @author       Pizza1337
// @match        *://flatmmo.com/play.php*
// @grant        none
// @require      https://update.greasyfork.org/scripts/544062/FlatMMOPlus.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543994/FlatMMO%20UI%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/543994/FlatMMO%20UI%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class UITweaksPlugin extends FlatMMOPlusPlugin {
        constructor() {
            super("ui-tweaks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "showSkillsPanel",
                        label: "Modern Skills Panel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "showVirtualLevels",
                        label: "Show Virtual Levels (100+)",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "portraitMode",
                        label: "Portrait Mode (F5 Required)",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "theme",
                        label: "UI Theme",
                        type: "select",
                        options: [
                            { value: "default", label: "Default" },
                            { value: "dark", label: "Dark Mode" },
                            { value: "pumpkin", label: "Pumpkin Spice" },
                            { value: "sea", label: "Deep Sea" },
                            { value: "mystic", label: "Mystic Vale" },
                            { value: "omboko", label: "Omboko" }
                        ],
                        default: "default"
                    }
                ]
            });

            this.skillUI = { elements: {}, total: {} };
            this.isGridCreated = false;
            this.initialized = false;
            this.xpTable = null;

            this.injectStyles();
        }

        onLogin() {
            if (this.initialized) return;
            this.initialized = true;

            this.applyTheme(this.getConfig('theme'));

            if (this.getConfig('portraitMode')) {
                const layoutObserver = new MutationObserver((mutations, observer) => {
                    if (document.querySelector('#game table canvas')) {
                        this.moveUiBelowCanvas();
                        observer.disconnect();
                    }
                });
                layoutObserver.observe(document.body, { childList: true, subtree: true });
            }
        }

        onPanelChanged(panelBefore, panelAfter) {
            if (panelAfter === 'skills') {
                this.createSkillsGrid();
            }
        }

        onConfigsChanged() {
            this.applyTheme(this.getConfig('theme'));

            if (this.getConfig('showSkillsPanel')) {
                if (document.querySelector("#ui-panel-skills")?.style.display !== "none") {
                    this.createSkillsGrid();
                }
            } else {
                this.destroySkillsGrid();
            }

            // Update skills display when virtual levels setting changes
            if (this.isGridCreated) {
                Object.keys(this.skillUI.elements).forEach(skillName => this.updateSkillCell(skillName));
            }
        }

        injectStyles() {
             const styles = `
                /* --- General UI Fixes --- */
                .settings-ui td:first-child {
                    padding-left: 10px;
                }
                .tm-settings-row td {
                    padding-top: 5px;
                    padding-bottom: 5px;
                }

                /* --- Shared Theme Variables --- */
                :root {
                    --fmp-ui-button-bg: ButtonFace;
                    --fmp-ui-button-bg-hover: ButtonFace;
                    --fmp-ui-button-text: ButtonText;
                    --fmp-ui-button-border: grey;
                    --fmp-ui-button-disabled-bg: ButtonFace;
                    --fmp-ui-button-disabled-text: GrayText;
                    --fmp-ui-button-disabled-border: grey;
                    --fmp-ui-element-active-bg: Highlight;
                    --fmp-ui-input-bg: Field;
                    --fmp-ui-requirement-met-bg: #d2ffd1;
                    --fmp-ui-requirement-met-border: #8ad68c;
                    --fmp-ui-requirement-met-text: #224422;
                    --fmp-ui-requirement-miss-bg: #ffe1dc;
                    --fmp-ui-requirement-miss-border: #f4a199;
                    --fmp-ui-requirement-miss-text: #5f1f1f;
                    --fmp-ui-card-bg: #ffffff;
                    --fmp-ui-card-border: #dcdcdc;
                    --fmp-ui-card-text: #222222;
                    --fmp-ui-card-heading: #1a1a1a;
                    --fmp-ui-card-muted: #555555;
                    --fmp-ui-card-row: rgba(0, 0, 0, 0.04);
                    --fmp-ui-card-row-alt: rgba(0, 0, 0, 0.08);
                }

                body.theme-dark {
                    --fmp-ui-button-bg: #4a4e53;
                    --fmp-ui-button-bg-hover: #5a5e63;
                    --fmp-ui-button-text: #f1f1f1;
                    --fmp-ui-button-border: #6a6e73;
                    --fmp-ui-button-disabled-bg: #2a2e33;
                    --fmp-ui-button-disabled-text: #6a6e73;
                    --fmp-ui-button-disabled-border: #4a4e53;
                    --fmp-ui-element-active-bg: #4a4e53;
                    --fmp-ui-input-bg: #23272a;
                    --fmp-ui-requirement-met-bg: rgba(111, 191, 115, 0.2);
                    --fmp-ui-requirement-met-border: #3f6943;
                    --fmp-ui-requirement-met-text: #e3ffe4;
                    --fmp-ui-requirement-miss-bg: rgba(255, 138, 128, 0.2);
                    --fmp-ui-requirement-miss-border: #694343;
                    --fmp-ui-requirement-miss-text: #ffe1dd;
                    --fmp-ui-card-bg: #26292d;
                    --fmp-ui-card-border: #40444a;
                    --fmp-ui-card-text: #f1f1f1;
                    --fmp-ui-card-heading: #8ab4f8;
                    --fmp-ui-card-muted: #c3c6cc;
                    --fmp-ui-card-row: rgba(255, 255, 255, 0.05);
                    --fmp-ui-card-row-alt: rgba(255, 255, 255, 0.1);
                }

                body.theme-pumpkin {
                    --fmp-ui-button-bg: #4a3c35;
                    --fmp-ui-button-bg-hover: #5a4c45;
                    --fmp-ui-button-text: #f5e4d9;
                    --fmp-ui-button-border: #6a5c55;
                    --fmp-ui-button-disabled-bg: #2a2421;
                    --fmp-ui-button-disabled-text: #6a5c55;
                    --fmp-ui-button-disabled-border: #4a3421;
                    --fmp-ui-element-active-bg: #4a3c35;
                    --fmp-ui-input-bg: #2a2421;
                    --fmp-ui-requirement-met-bg: rgba(230, 126, 34, 0.18);
                    --fmp-ui-requirement-met-border: #e67e22;
                    --fmp-ui-requirement-met-text: #f5e4d9;
                    --fmp-ui-requirement-miss-bg: rgba(232, 76, 61, 0.2);
                    --fmp-ui-requirement-miss-border: #e84c3d;
                    --fmp-ui-requirement-miss-text: #f5e4d9;
                    --fmp-ui-card-bg: #2f2622;
                    --fmp-ui-card-border: #4a3421;
                    --fmp-ui-card-text: #f5e4d9;
                    --fmp-ui-card-heading: #f39c12;
                    --fmp-ui-card-muted: #d8c3ad;
                    --fmp-ui-card-row: rgba(243, 156, 18, 0.18);
                    --fmp-ui-card-row-alt: rgba(243, 156, 18, 0.28);
                }

                body.theme-sea {
                    --fmp-ui-button-bg: #133a5f;
                    --fmp-ui-button-bg-hover: #234a6f;
                    --fmp-ui-button-text: #e1f5fe;
                    --fmp-ui-button-border: #235a7f;
                    --fmp-ui-button-disabled-bg: #0d253f;
                    --fmp-ui-button-disabled-text: #235a7f;
                    --fmp-ui-button-disabled-border: #133a5f;
                    --fmp-ui-element-active-bg: #133a5f;
                    --fmp-ui-input-bg: #071726;
                    --fmp-ui-requirement-met-bg: rgba(16, 74, 53, 0.45);
                    --fmp-ui-requirement-met-border: #1a694f;
                    --fmp-ui-requirement-met-text: #e1f5fe;
                    --fmp-ui-requirement-miss-bg: rgba(63, 29, 63, 0.45);
                    --fmp-ui-requirement-miss-border: #5f2a5f;
                    --fmp-ui-requirement-miss-text: #e1f5fe;
                    --fmp-ui-card-bg: #0f2236;
                    --fmp-ui-card-border: #1a3a55;
                    --fmp-ui-card-text: #e1f5fe;
                    --fmp-ui-card-heading: #90cea1;
                    --fmp-ui-card-muted: #a4c8d1;
                    --fmp-ui-card-row: rgba(255, 255, 255, 0.05);
                    --fmp-ui-card-row-alt: rgba(255, 255, 255, 0.1);
                }

                body.theme-mystic {
                    --fmp-ui-button-bg: #7A7EA1;
                    --fmp-ui-button-bg-hover: #868AAD;
                    --fmp-ui-button-text: #f0f0f0;
                    --fmp-ui-button-border: #9598B9;
                    --fmp-ui-button-disabled-bg: #6A6E94;
                    --fmp-ui-button-disabled-text: #9598B9;
                    --fmp-ui-button-disabled-border: #5f6284;
                    --fmp-ui-element-active-bg: #7A7EA1;
                    --fmp-ui-input-bg: #5f6284;
                    --fmp-ui-requirement-met-bg: rgba(94, 140, 97, 0.35);
                    --fmp-ui-requirement-met-border: #5e8c61;
                    --fmp-ui-requirement-met-text: #f0f0f0;
                    --fmp-ui-requirement-miss-bg: rgba(129, 82, 102, 0.35);
                    --fmp-ui-requirement-miss-border: #8c5a6e;
                    --fmp-ui-requirement-miss-text: #f0f0f0;
                    --fmp-ui-card-bg: #5f6284;
                    --fmp-ui-card-border: #7a8aa1;
                    --fmp-ui-card-text: #f0f0f0;
                    --fmp-ui-card-heading: #b2fab4;
                    --fmp-ui-card-muted: #d1d3e0;
                    --fmp-ui-card-row: rgba(255, 255, 255, 0.06);
                    --fmp-ui-card-row-alt: rgba(255, 255, 255, 0.12);
                }

                body.theme-omboko {
                    --fmp-ui-button-bg: #3D5426;
                    --fmp-ui-button-bg-hover: #4B682E;
                    --fmp-ui-button-text: #d1dcc6;
                    --fmp-ui-button-border: #4B682E;
                    --fmp-ui-button-disabled-bg: #1D2319;
                    --fmp-ui-button-disabled-text: #4B682E;
                    --fmp-ui-button-disabled-border: #25311B;
                    --fmp-ui-element-active-bg: #3D5426;
                    --fmp-ui-input-bg: #11150f;
                    --fmp-ui-requirement-met-bg: rgba(61, 84, 38, 0.45);
                    --fmp-ui-requirement-met-border: #4B682E;
                    --fmp-ui-requirement-met-text: #d1dcc6;
                    --fmp-ui-requirement-miss-bg: rgba(75, 46, 46, 0.45);
                    --fmp-ui-requirement-miss-border: #4B2E2E;
                    --fmp-ui-requirement-miss-text: #d1dcc6;
                    --fmp-ui-card-bg: #1f2916;
                    --fmp-ui-card-border: #3D5426;
                    --fmp-ui-card-text: #d1dcc6;
                    --fmp-ui-card-heading: #cbe3b1;
                    --fmp-ui-card-muted: #9eb883;
                    --fmp-ui-card-row: rgba(255, 255, 255, 0.05);
                    --fmp-ui-card-row-alt: rgba(255, 255, 255, 0.1);
                }

                body.tm-portrait-mode .ui-panel {
                    max-width: none !important;
                    width: 100% !important;
                }
                body.tm-portrait-mode #tm-portrait-header-bar-wrapper {
                    margin-bottom: 12px;
                }
                body.tm-portrait-mode #tm-portrait-header-bar-wrapper .top-bar {
                    width: 100%;
                    border-radius: 6px 6px 0 0;
                }
                #donor-dashboard .modal-content {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border-color: var(--fmp-ui-card-border);
                }
                #donor-dashboard .modal-content .close {
                    color: var(--fmp-ui-card-text);
                }
                #donor-dashboard .donor-coins-table td {
                    background-color: var(--fmp-ui-card-bg);
                    color: var(--fmp-ui-card-text);
                    border-color: var(--fmp-ui-card-border);
                }
                #donor-dashboard .purchase-donor-coins {
                    color: var(--fmp-ui-element-active-bg);
                }
                #donor-dashboard .donor-entry {
                    background-color: var(--fmp-ui-card-bg);
                    color: var(--fmp-ui-card-text);
                    border-color: var(--fmp-ui-card-border);
                }
                #donor-dashboard .donor-entry .donor-entry-premium-title {
                    color: var(--fmp-ui-card-heading) !important;
                }
                #donor-dashboard .donor-entry .donor-entry-pricing {
                    color: var(--fmp-ui-card-heading);
                }
                #donor-dashboard .donor-entry ul.donor-options li {
                    color: var(--fmp-ui-card-muted);
                }
                #donor-dashboard .donor-active-section-timer {
                    color: var(--fmp-ui-card-text);
                }
                #ui-panel-donor .donor-coins-table {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border: 1px solid var(--fmp-ui-card-border) !important;
                }
                #ui-panel-donor .donor-coins-table td {
                    color: var(--fmp-ui-card-text);
                }
                #ui-panel-donor .donor-coins-table.hover:hover {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    border-color: var(--fmp-ui-button-border) !important;
                }
                #ui-panel-donor .donor-coins-table.hover:hover td {
                    color: var(--fmp-ui-button-text);
                }
                #ui-panel-donor .purchase-donor-coins {
                    color: var(--fmp-ui-element-active-bg);
                }
                #ui-panel-donor hint {
                    color: var(--fmp-ui-card-muted);
                }
                #ui-panel-donor .donor-coins-table.hover:hover hint {
                    color: var(--fmp-ui-button-text);
                }
                #ui-panel-donor-shop .donor-coins-table {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border: 1px solid var(--fmp-ui-card-border) !important;
                }
                #ui-panel-donor-shop .donor-coins-table td {
                    color: var(--fmp-ui-card-text);
                }
                #ui-panel-donor-shop hint {
                    color: var(--fmp-ui-card-muted);
                }
                #ui-panel-donor-shop .donor-coins-table.hover:hover {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    border-color: var(--fmp-ui-button-border) !important;
                }
                #ui-panel-donor-shop .donor-coins-table.hover:hover td {
                    color: var(--fmp-ui-button-text);
                }
                #ui-panel-donor-shop .donor-coins-table.hover:hover hint {
                    color: var(--fmp-ui-button-text);
                }
                #ui-panel-donor-shop .purchase-donor-coins {
                    color: var(--fmp-ui-element-active-bg);
                }
                .modal-content.modal-content-xl {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border: 1px solid var(--fmp-ui-card-border);
                }
                .modal-content.modal-content-xl .close {
                    color: var(--fmp-ui-card-text);
                }
                .modal-content.modal-content-xl h3 {
                    color: var(--fmp-ui-card-heading);
                }
                table.table-key-bindings,
                .table-key-bindings {
                    width: 100%;
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text) !important;
                    border: 1px solid var(--fmp-ui-card-border) !important;
                    border-collapse: separate;
                    border-spacing: 0;
                }
                table.table-key-bindings th,
                .table-key-bindings th {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    color: var(--fmp-ui-button-text) !important;
                    border-bottom: 1px solid var(--fmp-ui-card-border) !important;
                }
                table.table-key-bindings td,
                .table-key-bindings td {
                    border-bottom: 1px solid var(--fmp-ui-card-border) !important;
                    border-right: 1px solid var(--fmp-ui-card-border) !important;
                    color: var(--fmp-ui-card-text) !important;
                }
                table.table-key-bindings tr:nth-child(odd) td,
                .table-key-bindings tr:nth-child(odd) td {
                    background-color: var(--fmp-ui-card-row) !important;
                }
                table.table-key-bindings tr:nth-child(even) td,
                .table-key-bindings tr:nth-child(even) td {
                    background-color: var(--fmp-ui-card-row-alt) !important;
                }
                .table-key-bindings .key {
                    background-color: var(--fmp-ui-card-row) !important;
                    color: var(--fmp-ui-card-heading) !important;
                    border: 1px solid var(--fmp-ui-card-border) !important;
                }
                .table-key-bindings td[style*="color:grey"],
                .table-key-bindings td[style*="color: grey"],
                .table-key-bindings td .color-grey,
                .table-key-bindings td.color-grey {
                    color: var(--fmp-ui-card-muted) !important;
                }
                #post-donor-scrolls-market .modal-content {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border-color: var(--fmp-ui-card-border);
                }
                #post-donor-scrolls-market .modal-content .close {
                    color: var(--fmp-ui-card-text);
                }
                #post-donor-scrolls-market .post-donor-scrolls-market-scroll-wrapper {
                    background-color: var(--fmp-ui-card-row);
                    color: var(--fmp-ui-card-text);
                }
                #post-donor-scrolls-market .post-donor-scrolls-market-scroll {
                    background-color: var(--fmp-ui-card-bg);
                    border-color: var(--fmp-ui-card-border);
                }
                #post-donor-scrolls-market .post-donor-scrolls-market-scroll:hover,
                #post-donor-scrolls-market .post-donor-scrolls-market-scroll.active,
                #post-donor-scrolls-market .post-donor-scrolls-market-scroll.selected {
                    background-color: var(--fmp-ui-element-active-bg);
                    border-color: var(--fmp-ui-button-border);
                }
                #post-donor-scrolls-market button.hover {
                    background-color: var(--fmp-ui-button-bg);
                    color: var(--fmp-ui-button-text);
                    border-color: var(--fmp-ui-button-border);
                }
                #post-donor-scrolls-market button.hover:hover {
                    background-color: var(--fmp-ui-button-bg-hover);
                }
                table.artifacts-modal-table,
                .artifacts-modal-table {
                    width: 100%;
                    border: 1px solid var(--fmp-ui-card-border);
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border-collapse: separate;
                    border-spacing: 0;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                }
                table.artifacts-modal-table th,
                .artifacts-modal-table th {
                    background-color: var(--fmp-ui-element-active-bg);
                    color: var(--fmp-ui-button-text);
                    padding: 10px;
                    border-bottom: 1px solid var(--fmp-ui-card-border);
                }
                table.artifacts-modal-table td,
                .artifacts-modal-table td {
                    padding: 10px;
                    border-bottom: 1px solid var(--fmp-ui-card-border);
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text) !important;
                }
                table.artifacts-modal-table tbody tr:nth-child(odd) td,
                .artifacts-modal-table tbody tr:nth-child(odd) td {
                    background-color: var(--fmp-ui-card-row) !important;
                }
                table.artifacts-modal-table tbody tr:nth-child(even) td,
                .artifacts-modal-table tbody tr:nth-child(even) td {
                    background-color: var(--fmp-ui-card-row-alt) !important;
                }
                table.artifacts-modal-table tr:last-child td,
                .artifacts-modal-table tr:last-child td {
                    border-bottom: none;
                }
                table.artifacts-modal-table td:nth-child(2),
                .artifacts-modal-table td:nth-child(2) {
                    color: var(--fmp-ui-card-text) !important;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .modal-content.modal-quest {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text);
                    border: 1px solid var(--fmp-ui-card-border);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                    border-radius: 12px;
                }
                .modal-quest .quest-completed-modal-table {
                    width: 100%;
                    border-collapse: separate;
                    border-spacing: 0;
                    border: 1px solid var(--fmp-ui-card-border);
                    border-radius: 10px;
                    overflow: hidden;
                    background-color: var(--fmp-ui-card-bg);
                }
                .modal-quest .quest-completed-modal-table td {
                    border-color: var(--fmp-ui-card-border) !important;
                    color: var(--fmp-ui-card-text);
                }
                .modal-quest .quest-completed-modal-table td:first-child {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    width: 20%;
                }
                .modal-quest .quest-completed-modal-table td:last-child {
                    background-color: var(--fmp-ui-card-bg) !important;
                }
                .monster-log-modal-table,
                .monster-log-modal-sub-table {
                    background-color: var(--fmp-ui-card-bg) !important;
                    border: 1px solid var(--fmp-ui-card-border);
                    border-collapse: separate;
                    border-spacing: 0;
                }
                .monster-log-modal-table {
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                    overflow: hidden;
                }
                .monster-log-modal-sub-table {
                    width: 100%;
                    border-radius: 8px;
                    overflow: hidden;
                }
                .monster-log-modal-table td,
                .monster-log-modal-sub-table td {
                    border-color: var(--fmp-ui-card-border) !important;
                }
                .monster-log-modal-table td:not(#monster-log-modal-sub-hit-chance),
                .monster-log-modal-sub-table td:not(#monster-log-modal-sub-hit-chance) {
                    color: var(--fmp-ui-card-text) !important;
                }
                .monster-log-modal-table td:first-child {
                    background-color: var(--fmp-ui-card-row-alt) !important;
                }
                .monster-log-modal-sub-table tr:nth-child(odd) td:not(#monster-log-modal-sub-hit-chance) {
                    background-color: var(--fmp-ui-card-row) !important;
                }
                .monster-log-modal-sub-table tr:nth-child(even) td:not(#monster-log-modal-sub-hit-chance) {
                    background-color: var(--fmp-ui-card-row-alt) !important;
                }
                .monster-log-modal-sub-table .color-grey {
                    color: var(--fmp-ui-card-muted) !important;
                }
                #monster-log-modal-sub-hit-chance {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    border-top: 2px solid var(--fmp-ui-button-border) !important;
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(210, 255, 209)"],
                body[class*="theme-"] table.make-items-table tr[style*="#d2ffd1"],
                body[class*="theme-"] table.make-items-table tr[style*="#ceffd1"],
                body[class*="theme-"] table.make-items-table tr[style*="210,255,209"] {
                    background-color: var(--fmp-ui-requirement-met-bg) !important;
                    color: var(--fmp-ui-requirement-met-text);
                    border-left: 4px solid var(--fmp-ui-requirement-met-border);
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(210, 255, 209)"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="#d2ffd1"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="#ceffd1"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="210,255,209"] a[style*="color:black"] {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(210, 255, 209)"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="rgb(210, 255, 209)"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="#d2ffd1"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="#d2ffd1"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ceffd1"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ceffd1"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="210,255,209"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="210,255,209"] span[style*="color: green"] {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] {
                    background-color: var(--fmp-ui-requirement-miss-bg) !important;
                    color: var(--fmp-ui-requirement-miss-text);
                    border-left: 4px solid var(--fmp-ui-requirement-miss-border);
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"] a[style*="color:black"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] a[style*="color:black"] {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }
                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"] span[style*="color:red"],
                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"] span[style*="color: red"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"] span[style*="color:red"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"] span[style*="color: red"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"] span[style*="color:red"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"] span[style*="color: red"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] span[style*="color:red"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] span[style*="color: red"] {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }

                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="rgb(255, 216, 209)"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd8d1"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="#ffd1d1"] span[style*="color: green"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] span[style*="color:green"],
                body[class*="theme-"] table.make-items-table tr[style*="255,216,209"] span[style*="color: green"] {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }

                                body[class*="theme-"] tr[style*="#D1FFC9"],
                body[class*="theme-"] tr[style*="#d1ffc9"],
                body[class*="theme-"] tr[style*="rgb(209, 255, 201)"],
                body[class*="theme-"] tr[style*="213, 255, 207"],
                body[class*="theme-"] tr[style*="#cecaa2"],
                body[class*="theme-"] tr[style*="rgb(206, 202, 162)"] {
                    background-color: var(--fmp-ui-requirement-met-bg) !important;
                    color: var(--fmp-ui-requirement-met-text);
                }
                body[class*="theme-"] tr[style*="#D1FFC9"] a,
                body[class*="theme-"] tr[style*="#D1FFC9"] span,
                body[class*="theme-"] tr[style*="#d1ffc9"] a,
                body[class*="theme-"] tr[style*="#d1ffc9"] span,
                body[class*="theme-"] tr[style*="rgb(209, 255, 201)"] a,
                body[class*="theme-"] tr[style*="rgb(209, 255, 201)"] span,
                body[class*="theme-"] tr[style*="209, 255, 201"] a,
                body[class*="theme-"] tr[style*="209, 255, 201"] span {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }
                body[class*="theme-"] tr[style*="#FFD2C9"],
                body[class*="theme-"] tr[style*="#ffd2c9"],
                body[class*="theme-"] tr[style*="rgb(255, 210, 201)"],
                body[class*="theme-"] tr[style*="255, 210, 201"] {
                    background-color: var(--fmp-ui-requirement-miss-bg) !important;
                    color: var(--fmp-ui-requirement-miss-text);
                }
                body[class*="theme-"] tr[style*="#FFD2C9"] a,
                body[class*="theme-"] tr[style*="#FFD2C9"] span,
                body[class*="theme-"] tr[style*="#ffd2c9"] a,
                body[class*="theme-"] tr[style*="#ffd2c9"] span,
                body[class*="theme-"] tr[style*="rgb(255, 210, 201)"] a,
                body[class*="theme-"] tr[style*="rgb(255, 210, 201)"] span,
                body[class*="theme-"] tr[style*="255, 210, 201"] a,
                body[class*="theme-"] tr[style*="255, 210, 201"] span {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }

                body[class*="theme-"] tr[style*="#D1FFC9"],
                body[class*="theme-"] tr[style*="#d1ffc9"],
                body[class*="theme-"] tr[style*="rgb(213, 255, 207)"],
                body[class*="theme-"] tr[style*="213, 255, 207"],
                body[class*="theme-"] tr[style*="#cecaa2"],
                body[class*="theme-"] tr[style*="rgb(206, 202, 162)"] {
                    background-color: var(--fmp-ui-requirement-met-bg) !important;
                    color: var(--fmp-ui-requirement-met-text);
                }
                body[class*="theme-"] tr[style*="#D1FFC9"] a,
                body[class*="theme-"] tr[style*="#D1FFC9"] span,
                body[class*="theme-"] tr[style*="#d1ffc9"] a,
                body[class*="theme-"] tr[style*="#d1ffc9"] span,
                body[class*="theme-"] tr[style*="rgb(213, 255, 207)"] a,
                body[class*="theme-"] tr[style*="rgb(213, 255, 207)"] span,
                body[class*="theme-"] tr[style*="213, 255, 207"] a,
                body[class*="theme-"] tr[style*="213, 255, 207"] span,
                body[class*="theme-"] tr[style*="#cecaa2"] a,
                body[class*="theme-"] tr[style*="#cecaa2"] span,
                body[class*="theme-"] tr[style*="rgb(206, 202, 162)"] a,
                body[class*="theme-"] tr[style*="rgb(206, 202, 162)"] span {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }

                body[class*="theme-"] .loot-modal-context-entry table {
                    background-color: var(--fmp-ui-requirement-met-bg) !important;
                    color: var(--fmp-ui-requirement-met-text);
                    border: 1px solid var(--fmp-ui-requirement-met-border);
                    border-radius: 6px;
                }
                body[class*="theme-"] .loot-modal-context-entry table td,
                body[class*="theme-"] .loot-modal-context-entry table span {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }

                body[class*="theme-"] .quest-completed-modal-table td[style*="background-color"],
                body[class*="theme-"] .quest-completed-modal-table td:first-child {
                    background-color: var(--fmp-ui-element-active-bg) !important;
                    border-right: 4px solid var(--fmp-ui-button-border);
                }
                body[class*="theme-"] .quest-completed-modal-table td:last-child {
                    background-color: var(--fmp-ui-card-bg) !important;
                    color: var(--fmp-ui-card-text) !important;
                }
                body[class*="theme-"] .quest-completed-modal-table td:last-child ul,
                body[class*="theme-"] .quest-completed-modal-table td:last-child li,
                body[class*="theme-"] .quest-completed-modal-table td:last-child span {
                    color: var(--fmp-ui-card-text) !important;
                }
                body[class*="theme-"] .quest-completed-modal-table td:last-child h1 {
                    color: var(--fmp-ui-card-heading) !important;
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(236, 255, 214)"],
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ecffd6"],
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ECFFD6"] {
                    background-color: var(--fmp-ui-requirement-met-bg) !important;
                    color: var(--fmp-ui-requirement-met-text);
                    border: 1px solid var(--fmp-ui-requirement-met-border);
                    box-shadow: 0 0 0 1px var(--fmp-ui-requirement-met-border);
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(236, 255, 214)"] td,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ecffd6"] td,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ECFFD6"] td {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(236, 255, 214)"] strong,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ecffd6"] strong,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ECFFD6"] strong {
                    color: var(--fmp-ui-requirement-met-text) !important;
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(255, 214, 214)"],
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ffd6d6"],
                body[class*="theme-"] table.player-sell-booth-entry[style*="#FFD6D6"] {
                    background-color: var(--fmp-ui-requirement-miss-bg) !important;
                    color: var(--fmp-ui-requirement-miss-text);
                    border: 1px solid var(--fmp-ui-requirement-miss-border);
                    box-shadow: 0 0 0 1px var(--fmp-ui-requirement-miss-border);
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(255, 214, 214)"] td,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ffd6d6"] td,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#FFD6D6"] td {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(255, 214, 214)"] strong,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ffd6d6"] strong,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#FFD6D6"] strong {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }

                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(236, 255, 214)"] .color-grey,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ecffd6"] .color-grey,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ECFFD6"] .color-grey {
                    color: var(--fmp-ui-button-text) !important;
                }
                body[class*="theme-"] table.player-sell-booth-entry[style*="rgb(255, 214, 214)"] .color-grey,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#ffd6d6"] .color-grey,
                body[class*="theme-"] table.player-sell-booth-entry[style*="#FFD6D6"] .color-grey {
                    color: var(--fmp-ui-requirement-miss-text) !important;
                }

                /* --- Virtual Level Display --- */
                .virtual-level-display {
                    color: #9eb883;
                    margin-left: 4px;
                }
                body.theme-dark .virtual-level-display { color: #6fbf73; }
                body.theme-pumpkin .virtual-level-display { color: #f39c12; }
                body.theme-sea .virtual-level-display { color: #01b4e4; }
                body.theme-mystic .virtual-level-display { color: #b2fab4; }
                body.theme-omboko .virtual-level-display { color: #7a9560; }

                /* --- Shared readability rules for dark themes --- */
                body.theme-dark #ui-panel-database a,
                body.theme-pumpkin #ui-panel-database a,
                body.theme-sea #ui-panel-database a,
                body.theme-omboko #ui-panel-database a,
                body.theme-mystic #ui-panel-database a { color: #8ab4f8 !important; }
                body.theme-dark #ui-panel-database a:hover,
                body.theme-pumpkin #ui-panel-database a:hover,
                body.theme-sea #ui-panel-database a:hover,
                body.theme-omboko #ui-panel-database a:hover,
                body.theme-mystic #ui-panel-database a:hover { color: #c3dafa !important; }

                /* --- Dark Mode Theme --- */
                body.theme-dark .ui-panel, body.theme-dark .modal-content,
                body.theme-dark .ach-sub-menu-btn-td, body.theme-dark .donor-shop-entry, body.theme-dark .ui-donor-chat-tags-info,
                body.theme-dark .npc-chat-options-modal-title, body.theme-dark .npc-chat-options-modal-options div {
                    background-color: #2c2f33; color: #f1f1f1; box-shadow: 1px 1px 5px #121212;
                }
                body.theme-dark table.settings-ui tr:nth-child(odd), body.theme-dark .quests-ui tr:nth-child(odd),
                body.theme-dark .monster-log-ui-table tr:nth-child(odd) { background-color: #3c4045; }
                body.theme-dark table.settings-ui tr:nth-child(even), body.theme-dark .quests-ui tr:nth-child(even),
                body.theme-dark .monster-log-ui-table tr:nth-child(even) { background-color: #32353b; }
                body.theme-dark .achievements-ui tr { background-color: #323b33; border-color: #455a46; }
                body.theme-dark .total-level-div { background-color: #23272a !important; }
                body.theme-dark .hint, body.theme-dark .color-grey, body.theme-dark .modal-content h3[style*="color: grey"] { color: #b0b0b0 !important; }
                body.theme-dark .right-click-item-modal-table { background-color: #32353b; }
                body.theme-dark .right-click-item-modal-table span[style*="color:grey"] { color: #b0b0b0 !important; }
                body.theme-dark .equipement-stats-ui-table, body.theme-dark .right-click-item-modal-table-stats,
                body.theme-dark .monster-log-modal-drops, body.theme-dark .npc-chat-message-modal-message,
                body.theme-dark .player-sell-booth-entry td, body.theme-dark .player-lookup-modal-quests,
                body.theme-dark .player-lookup-modal-achievements { background-color: rgba(0, 0, 0, 0.2); }
                body.theme-dark div[style*="color:green"], body.theme-dark .color-green { color: #6fbf73 !important; }
                body.theme-dark .color-red { color: #ff8a80 !important; }
                body.theme-dark .ach-sub-menu-btn-td:hover,
                body.theme-dark .ach-sub-menu-btn-td.active,
                body.theme-dark .npc-chat-options-modal-options div:hover,
                body.theme-dark .npc-chat-options-modal-options div.active { background-color: var(--fmp-ui-element-active-bg); }
                body.theme-dark .hover-continue-npc-chat-message-modal:hover { color: #ff8a80 !important; }
                body.theme-dark button { background-color: var(--fmp-ui-button-bg); color: var(--fmp-ui-button-text); border: 1px solid var(--fmp-ui-button-border); }
                body.theme-dark button:hover { background-color: var(--fmp-ui-button-bg-hover); }
                body.theme-dark button:disabled { background-color: var(--fmp-ui-button-disabled-bg); color: var(--fmp-ui-button-disabled-text); border-color: var(--fmp-ui-button-disabled-border); }
                body.theme-dark input[type="text"],
                body.theme-dark input[type="number"],
                body.theme-dark input[type="password"],
                body.theme-dark input[type="email"],
                body.theme-dark input[type="search"],
                body.theme-dark textarea { background-color: var(--fmp-ui-input-bg); color: var(--fmp-ui-button-text); border-color: var(--fmp-ui-button-border); }
                body.theme-dark .player-lookup-modal-table-skills td { background-color: #3c4045 !important; }
                body.theme-dark .player-lookup-modal-quest-entry { background-color: #32353b; }
                body.theme-dark .hunter-shop-modal-table th { background-color: #23272a; }
                body.theme-dark .hunter-shop-modal-table, body.theme-dark .hunter-shop-modal-table tr { background-color: #3c4045 !important; }
                body.theme-dark .trade-offer-section { background-color: #23272a; }
                body.theme-dark .trade-accepted-msg { background-color: #2e4b30; border-color: #6fbf73; }
                body.theme-dark #trade-inventory-items div.item[style*="background-color"] { background-color: #23272a !important; }
                body.theme-dark .worship-timers-table th { background-color: #23272a; }
                body.theme-dark .worship-timers-table tr[style*="#CEFFB5"] { background-color: #2e4b30 !important; } /* Green */
                body.theme-dark .worship-timers-table tr[style*="#f6ffb5ff"] { background-color: #4b4b30 !important; } /* Yellow */
                body.theme-dark .worship-timers-table tr[style*="#FFCAC2"] { background-color: #4b3030 !important; } /* Red */
                body.theme-dark button[style*="#cee3c9"] { background-color: #2e4b30 !important; color: #f1f1f1 !important; } /* Accept Button */
                body.theme-dark button[style*="#e3d3c9"] { background-color: #4b3030 !important; color: #f1f1f1 !important; } /* Decline Button */
                body.theme-dark button[style*="#cee3c9"]:hover { background-color: #3f6943 !important; }
                body.theme-dark button[style*="#e3d3c9"]:hover { background-color: #694343 !important; }

                /* --- Pumpkin Spice Theme --- */
                body.theme-pumpkin .ui-panel, body.theme-pumpkin .modal-content,
                body.theme-pumpkin .ach-sub-menu-btn-td, body.theme-pumpkin .donor-shop-entry, body.theme-pumpkin .ui-donor-chat-tags-info,
                body.theme-pumpkin .npc-chat-options-modal-title, body.theme-pumpkin .npc-chat-options-modal-options div {
                    background-color: #2a2421; color: #f5e4d9; box-shadow: 1px 1px 5px #1a1411; border: 1px solid #4a3421;
                }
                body.theme-pumpkin .ui-panel-title { color: #e67e22; }
                body.theme-pumpkin table.settings-ui tr:nth-child(odd), body.theme-pumpkin .quests-ui tr:nth-child(odd),
                body.theme-pumpkin .monster-log-ui-table tr:nth-child(odd) { background-color: #3b312c; }
                body.theme-pumpkin table.settings-ui tr:nth-child(even), body.theme-pumpkin .quests-ui tr:nth-child(even),
                body.theme-pumpkin .monster-log-ui-table tr:nth-child(even) { background-color: #312925; }
                body.theme-pumpkin .achievements-ui tr { background-color: #3b2e25; border-color: #5a4431; }
                body.theme-pumpkin .skill-cell-bar-fill { background-color: #d35400 !important; }
                body.theme-pumpkin .total-level-div { background-color: #1c1815 !important; }
                body.theme-pumpkin .hint, body.theme-pumpkin .color-grey, body.theme-pumpkin .modal-content h3[style*="color: grey"] { color: #c9bca2 !important; }
                body.theme-pumpkin .right-click-item-modal-table { background-color: #312925; }
                body.theme-pumpkin .right-click-item-modal-table span[style*="color:grey"] { color: #c9bca2 !important; }
                body.theme-pumpkin .equipement-stats-ui-table, body.theme-pumpkin .right-click-item-modal-table-stats,
                body.theme-pumpkin .monster-log-modal-drops, body.theme-pumpkin .npc-chat-message-modal-message,
                body.theme-pumpkin .player-sell-booth-entry td, body.theme-pumpkin .player-lookup-modal-quests,
                body.theme-pumpkin .player-lookup-modal-achievements { background-color: rgba(40, 26, 13, 0.2); }
                body.theme-pumpkin div[style*="color:green"], body.theme-pumpkin .color-green { color: #e67e22 !important; }
                body.theme-pumpkin .color-red { color: #e84c3d !important; }
                body.theme-pumpkin a { color: #f39c12 !important; }
                body.theme-pumpkin .ach-sub-menu-btn-td:hover,
                body.theme-pumpkin .ach-sub-menu-btn-td.active,
                body.theme-pumpkin .npc-chat-options-modal-options div:hover,
                body.theme-pumpkin .npc-chat-options-modal-options div.active { background-color: var(--fmp-ui-element-active-bg); }
                body.theme-pumpkin .hover-continue-npc-chat-message-modal:hover { color: #ffab70 !important; }
                body.theme-pumpkin button { background-color: var(--fmp-ui-button-bg); color: var(--fmp-ui-button-text); border: 1px solid var(--fmp-ui-button-border); }
                body.theme-pumpkin button:hover { background-color: var(--fmp-ui-button-bg-hover); }
                body.theme-pumpkin button:disabled { background-color: var(--fmp-ui-button-disabled-bg); color: var(--fmp-ui-button-disabled-text); border-color: var(--fmp-ui-button-disabled-border); }
                body.theme-pumpkin input[type="text"],
                body.theme-pumpkin input[type="number"],
                body.theme-pumpkin input[type="password"],
                body.theme-pumpkin input[type="email"],
                body.theme-pumpkin input[type="search"],
                body.theme-pumpkin textarea { background-color: var(--fmp-ui-input-bg); color: var(--fmp-ui-button-text); border-color: var(--fmp-ui-button-border); }
                body.theme-pumpkin .player-lookup-modal-table-skills td { background-color: #3b312c !important; }
                body.theme-pumpkin .player-lookup-modal-quest-entry { background-color: #312925; }
                body.theme-pumpkin .hunter-shop-modal-table th { background-color: #1c1815; }
                body.theme-pumpkin .hunter-shop-modal-table, body.theme-pumpkin .hunter-shop-modal-table tr { background-color: #3b312c !important; }
                body.theme-pumpkin .trade-offer-section { background-color: #1c1815; }
                body.theme-pumpkin .trade-accepted-msg { background-color: #5a4431; border-color: #e67e22; }
                body.theme-pumpkin #trade-inventory-items div.item[style*="background-color"] { background-color: #1c1815 !important; }
                body.theme-pumpkin .worship-timers-table th { background-color: #1c1815; }
                body.theme-pumpkin .worship-timers-table tr[style*="#CEFFB5"] { background-color: #4a3c35 !important; } /* Green */
                body.theme-pumpkin .worship-timers-table tr[style*="#f6ffb5ff"] { background-color: #4a3421 !important; } /* Yellow */
                body.theme-pumpkin .worship-timers-table tr[style*="#FFCAC2"] { background-color: #4a2a21 !important; } /* Red */
                body.theme-pumpkin button[style*="#cee3c9"] { background-color: #662500 !important; color: #f5e4d9 !important; } /* Accept Button */
                body.theme-pumpkin button[style*="#e3d3c9"] { background-color: #4a2a21 !important; color: #f5e4d9 !important; } /* Decline Button */
                body.theme-pumpkin button[style*="#cee3c9"]:hover { background-color: #853100 !important; }
                body.theme-pumpkin button[style*="#e3d3c9"]:hover { background-color: #693a2a !important; }


                /* --- Deep Sea Theme --- */
                body.theme-sea .ui-panel, body.theme-sea .modal-content,
                body.theme-sea .ach-sub-menu-btn-td, body.theme-sea .donor-shop-entry, body.theme-sea .ui-donor-chat-tags-info,
                body.theme-sea .npc-chat-options-modal-title, body.theme-sea .npc-chat-options-modal-options div {
                    background-color: #0d253f; color: #e1f5fe; box-shadow: 1px 1px 5px #051525; border: 1px solid #01b4e4;
                }
                body.theme-sea .ui-panel-title { color: #90cea1; }
                body.theme-sea table.settings-ui tr:nth-child(odd), body.theme-sea .quests-ui tr:nth-child(odd),
                body.theme-sea .monster-log-ui-table tr:nth-child(odd) { background-color: #0a1d31; }
                body.theme-sea table.settings-ui tr:nth-child(even), body.theme-sea .quests-ui tr:nth-child(even),
                body.theme-sea .monster-log-ui-table tr:nth-child(even) { background-color: #102a45; }
                body.theme-sea .achievements-ui tr { background-color: #103a45; border-color: #1a5a65; }
                body.theme-sea .skill-cell-bar-fill { background-color: #01b4e4 !important; }
                body.theme-sea .total-level-div { background-color: #071726 !important; }
                body.theme-sea .hint, body.theme-sea .color-grey, body.theme-sea .modal-content h3[style*="color: grey"] { color: #a4c8d1 !important; }
                body.theme-sea .right-click-item-modal-table { background-color: #102a45; }
                body.theme-sea .right-click-item-modal-table span[style*="color:grey"] { color: #a4c8d1 !important; }
                body.theme-sea .equipement-stats-ui-table, body.theme-sea .right-click-item-modal-table-stats,
                body.theme-sea .monster-log-modal-drops, body.theme-sea .npc-chat-message-modal-message,
                body.theme-sea .player-sell-booth-entry td, body.theme-sea .player-lookup-modal-quests,
                body.theme-sea .player-lookup-modal-achievements { background-color: rgba(1, 180, 228, 0.1); }
                body.theme-sea div[style*="color:green"], body.theme-sea .color-green { color: #90cea1 !important; }
                body.theme-sea .color-red { color: #5eb5b9 !important; }
                body.theme-sea a { color: #01b4e4 !important; }
                body.theme-sea .ach-sub-menu-btn-td:hover,
                body.theme-sea .ach-sub-menu-btn-td.active,
                body.theme-sea .npc-chat-options-modal-options div:hover,
                body.theme-sea .npc-chat-options-modal-options div.active { background-color: var(--fmp-ui-element-active-bg); }
                body.theme-sea .hover-continue-npc-chat-message-modal:hover { color: #66d9ff !important; }
                body.theme-sea button { background-color: var(--fmp-ui-button-bg); color: var(--fmp-ui-button-text); border: 1px solid var(--fmp-ui-button-border); }
                body.theme-sea button:hover { background-color: var(--fmp-ui-button-bg-hover); }
                body.theme-sea button:disabled { background-color: var(--fmp-ui-button-disabled-bg); color: var(--fmp-ui-button-disabled-text); border-color: var(--fmp-ui-button-disabled-border); }
                body.theme-sea input[type="text"],
                body.theme-sea input[type="number"],
                body.theme-sea input[type="password"],
                body.theme-sea input[type="email"],
                body.theme-sea input[type="search"],
                body.theme-sea textarea { background-color: var(--fmp-ui-input-bg); color: var(--fmp-ui-button-text); border-color: var(--fmp-ui-button-border); }
                body.theme-sea .player-lookup-modal-table-skills td { background-color: #0a1d31 !important; }
                body.theme-sea .player-lookup-modal-quest-entry { background-color: #102a45; }
                body.theme-sea .hunter-shop-modal-table th { background-color: #071726; }
                body.theme-sea .hunter-shop-modal-table, body.theme-sea .hunter-shop-modal-table tr { background-color: #0a1d31 !important; }
                body.theme-sea .trade-offer-section { background-color: #071726; }
                body.theme-sea .trade-accepted-msg { background-color: #103a45; border-color: #90cea1; }
                body.theme-sea #trade-inventory-items div.item[style*="background-color"] { background-color: #071726 !important; }
                body.theme-sea .worship-timers-table th { background-color: #071726; }
                body.theme-sea .worship-timers-table tr[style*="#CEFFB5"] { background-color: #104a35 !important; } /* Green */
                body.theme-sea .worship-timers-table tr[style*="#f6ffb5ff"] { background-color: #133a5f !important; } /* Yellow */
                body.theme-sea .worship-timers-table tr[style*="#FFCAC2"] { background-color: #3f1d3f !important; } /* Red */
                body.theme-sea button[style*="#cee3c9"] { background-color: #104a35 !important; color: #e1f5fe !important; } /* Accept Button */
                body.theme-sea button[style*="#e3d3c9"] { background-color: #3f1d3f !important; color: #e1f5fe !important; } /* Decline Button */
                body.theme-sea button[style*="#cee3c9"]:hover { background-color: #1a694f !important; }
                body.theme-sea button[style*="#e3d3c9"]:hover { background-color: #5f2a5f !important; }


                /* --- Mystic Vale Theme (Darker) --- */
                body.theme-mystic .ui-panel, body.theme-mystic .modal-content,
                body.theme-mystic .ach-sub-menu-btn-td, body.theme-mystic .donor-shop-entry, body.theme-mystic .ui-donor-chat-tags-info,
                body.theme-mystic .npc-chat-options-modal-title, body.theme-mystic .npc-chat-options-modal-options div {
                    background-color: #6A6E94; color: #f0f0f0; box-shadow: 1px 1px 5px #4a4c6a;
                }
                body.theme-mystic .ui-panel-title { color: #d1d3e0; }
                body.theme-mystic table.settings-ui tr:nth-child(odd), body.theme-mystic .quests-ui tr:nth-child(odd),
                body.theme-mystic .monster-log-ui-table tr:nth-child(odd) { background-color: #7A7EA1; }
                body.theme-mystic table.settings-ui tr:nth-child(even), body.theme-mystic .quests-ui tr:nth-child(even),
                body.theme-mystic .monster-log-ui-table tr:nth-child(even) { background-color: #868AAD; }
                body.theme-mystic .achievements-ui tr { background-color: #7a8aa1; border-color: #9598b9; }
                body.theme-mystic .skill-cell-bar-fill { background-color: #9598B9 !important; }
                body.theme-mystic .skill-cell { background-color: #5f6284 !important; }
                body.theme-mystic .total-level-div { background-color: #5f6284 !important; color: #f0f0f0 !important; }
                body.theme-mystic .hint, body.theme-mystic .color-grey, body.theme-mystic .modal-content h3[style*="color: grey"] { color: #d1d3e0 !important; }
                body.theme-mystic .right-click-item-modal-table { background-color: #868AAD; }
                body.theme-mystic .right-click-item-modal-table span[style*="color:grey"] { color: #d1d3e0 !important; }
                body.theme-mystic .equipement-stats-ui-table, body.theme-mystic .right-click-item-modal-table-stats,
                body.theme-mystic .monster-log-modal-drops, body.theme-mystic .npc-chat-message-modal-message,
                body.theme-mystic .player-sell-booth-entry td, body.theme-mystic .player-lookup-modal-quests,
                body.theme-mystic .player-lookup-modal-achievements { background-color: rgba(60, 62, 84, 0.2); }
                body.theme-mystic div[style*="color:green"], body.theme-mystic .green-hover:hover, body.theme-mystic .color-green { color: #b2fab4 !important; }
                body.theme-mystic .color-red { color: #f5c0c0 !important; }
                body.theme-mystic .color-blue { color: #a6cfff !important; }
                body.theme-mystic a { color: #d1d3e0 !important; }
                body.theme-mystic .ach-sub-menu-btn-td:hover,
                body.theme-mystic .ach-sub-menu-btn-td.active,
                body.theme-mystic .npc-chat-options-modal-options div:hover,
                body.theme-mystic .npc-chat-options-modal-options div.active { background-color: var(--fmp-ui-element-active-bg); }
                body.theme-mystic .hover-continue-npc-chat-message-modal:hover { color: #f5c0c0 !important; }
                body.theme-mystic button { background-color: var(--fmp-ui-button-bg); color: var(--fmp-ui-button-text); border: 1px solid var(--fmp-ui-button-border); }
                body.theme-mystic button:hover { background-color: var(--fmp-ui-button-bg-hover); }
                body.theme-mystic button:disabled { background-color: var(--fmp-ui-button-disabled-bg); color: var(--fmp-ui-button-disabled-text); border-color: var(--fmp-ui-button-disabled-border); }
                body.theme-mystic input[type="text"],
                body.theme-mystic input[type="number"],
                body.theme-mystic input[type="password"],
                body.theme-mystic input[type="email"],
                body.theme-mystic input[type="search"],
                body.theme-mystic textarea { background-color: var(--fmp-ui-input-bg); color: var(--fmp-ui-button-text); border-color: var(--fmp-ui-button-border); }
                body.theme-mystic .player-lookup-modal-table-skills td { background-color: #7A7EA1 !important; }
                body.theme-mystic .player-lookup-modal-quest-entry { background-color: #868AAD; }
                body.theme-mystic .hunter-shop-modal-table th { background-color: #5f6284; }
                body.theme-mystic .hunter-shop-modal-table, body.theme-mystic .hunter-shop-modal-table tr { background-color: #7A7EA1 !important; }
                body.theme-mystic .trade-offer-section { background-color: #5f6284; }
                body.theme-mystic .trade-accepted-msg { background-color: #7a8aa1; border-color: #b2fab4; }
                body.theme-mystic #trade-inventory-items div.item[style*="background-color"] { background-color: #5f6284 !important; }
                body.theme-mystic .worship-timers-table th { background-color: #5f6284; }
                body.theme-mystic .worship-timers-table tr[style*="#CEFFB5"] { background-color: #3e5e40 !important; } /* Green */
                body.theme-mystic .worship-timers-table tr[style*="#f6ffb5ff"] { background-color: #5f6284 !important; } /* Yellow */
                body.theme-mystic .worship-timers-table tr[style*="#FFCAC2"] { background-color: #4a4c6a !important; } /* Red */
                body.theme-mystic button[style*="#cee3c9"] { background-color: #3e5e40 !important; color: #f0f0f0 !important; } /* Accept Button */
                body.theme-mystic button[style*="#e3d3c9"] { background-color: #4a4c6a !important; color: #f0f0f0 !important; } /* Decline Button */
                body.theme-mystic button[style*="#cee3c9"]:hover { background-color: #5e8c61 !important; }
                body.theme-mystic button[style*="#e3d3c9"]:hover { background-color: #696d9a !important; }


                /* --- Omboko Theme --- */
                body.theme-omboko .ui-panel, body.theme-omboko .modal-content,
                body.theme-omboko .ach-sub-menu-btn-td, body.theme-omboko .donor-shop-entry, body.theme-omboko .ui-donor-chat-tags-info,
                body.theme-omboko .npc-chat-options-modal-title, body.theme-omboko .npc-chat-options-modal-options div {
                    background-color: #1D2319; color: #d1dcc6; box-shadow: 1px 1px 5px #000; border: 1px solid #4B682E;
                }
                body.theme-omboko .ui-panel-title { color: #9eb883; }
                body.theme-omboko table.settings-ui tr:nth-child(odd), body.theme-omboko .quests-ui tr:nth-child(odd),
                body.theme-omboko .monster-log-ui-table tr:nth-child(odd) { background-color: #25311B; }
                body.theme-omboko table.settings-ui tr:nth-child(even), body.theme-omboko .quests-ui tr:nth-child(even),
                body.theme-omboko .monster-log-ui-table tr:nth-child(even) { background-color: #30411F; }
                body.theme-omboko .achievements-ui tr { background-color: #30411F; border-color: #4B682E; }
                body.theme-omboko .skill-cell-bar-fill { background-color: #4B682E !important; }
                body.theme-omboko .skill-cell { background-color: #30411F !important; }
                body.theme-omboko .total-level-div { background-color: #11150f !important; }
                body.theme-omboko .hint, body.theme-omboko .color-grey, body.theme-omboko .modal-content h3[style*="color: grey"] { color: #8f9984 !important; }
                body.theme-omboko .right-click-item-modal-table { background-color: #30411F; }
                body.theme-omboko .right-click-item-modal-table span[style*="color:grey"] { color: #8f9984 !important; }
                body.theme-omboko .equipement-stats-ui-table, body.theme-omboko .right-click-item-modal-table-stats,
                body.theme-omboko .monster-log-modal-drops, body.theme-omboko .npc-chat-message-modal-message,
                body.theme-omboko .player-sell-booth-entry td, body.theme-omboko .player-lookup-modal-quests,
                body.theme-omboko .player-lookup-modal-achievements { background-color: rgba(75, 104, 46, 0.1); }
                body.theme-omboko div[style*="color:green"], body.theme-omboko .color-green { color: #9eb883 !important; }
                body.theme-omboko .color-red { color: #e57373 !important; }
                body.theme-omboko a { color: #9eb883 !important; }
                body.theme-omboko .ach-sub-menu-btn-td:hover,
                body.theme-omboko .ach-sub-menu-btn-td.active,
                body.theme-omboko .npc-chat-options-modal-options div:hover,
                body.theme-omboko .npc-chat-options-modal-options div.active { background-color: var(--fmp-ui-element-active-bg); }
                body.theme-omboko .hover-continue-npc-chat-message-modal:hover { color: #c4d6b1 !important; }
                body.theme-omboko button { background-color: var(--fmp-ui-button-bg); color: var(--fmp-ui-button-text); border: 1px solid var(--fmp-ui-button-border); }
                body.theme-omboko button:hover { background-color: var(--fmp-ui-button-bg-hover); }
                body.theme-omboko button:disabled { background-color: var(--fmp-ui-button-disabled-bg); color: var(--fmp-ui-button-disabled-text); border-color: var(--fmp-ui-button-disabled-border); }
                body.theme-omboko input[type="text"],
                body.theme-omboko input[type="number"],
                body.theme-omboko input[type="password"],
                body.theme-omboko input[type="email"],
                body.theme-omboko input[type="search"],
                body.theme-omboko textarea { background-color: var(--fmp-ui-input-bg); color: var(--fmp-ui-button-text); border-color: var(--fmp-ui-button-border); }
                body.theme-omboko .player-lookup-modal-table-skills td { background-color: #25311B !important; }
                body.theme-omboko .player-lookup-modal-quest-entry { background-color: #30411F; }
                body.theme-omboko .hunter-shop-modal-table th { background-color: #11150f; }
                body.theme-omboko .hunter-shop-modal-table, body.theme-omboko .hunter-shop-modal-table tr { background-color: #25311B !important; }
                body.theme-omboko .trade-offer-section { background-color: #11150f; }
                body.theme-omboko .trade-accepted-msg { background-color: #30411F; border-color: #9eb883; }
                body.theme-omboko #trade-inventory-items div.item[style*="background-color"] { background-color: #11150f !important; }
                body.theme-omboko .worship-timers-table th { background-color: #11150f; }
                body.theme-omboko .worship-timers-table tr[style*="#CEFFB5"] { background-color: #3D5426 !important; } /* Green */
                body.theme-omboko .worship-timers-table tr[style*="#f6ffb5ff"] { background-color: #4B682E !important; } /* Yellow */
                body.theme-omboko .worship-timers-table tr[style*="#FFCAC2"] { background-color: #30411F !important; } /* Red */
                body.theme-omboko button[style*="#cee3c9"] { background-color: #3D5426 !important; color: #d1dcc6 !important; } /* Accept Button */
                body.theme-omboko button[style*="#e3d3c9"] { background-color: #30411F !important; color: #d1dcc6 !important; } /* Decline Button */
                body.theme-omboko button[style*="#cee3c9"]:hover { background-color: #4B682E !important; }
                body.theme-omboko button[style*="#e3d3c9"]:hover { background-color: #4B682E !important; }
            `;
            const styleSheet = document.createElement("style");
            styleSheet.type = "text/css";
            styleSheet.innerText = styles;
            document.head.appendChild(styleSheet);
        }

        applyTheme(themeName) {
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            if (themeName && themeName !== 'default') {
                document.body.classList.add(`theme-${themeName}`);
            }
        }

        getLevelFromXP(xp) {
            const xpTable = Array.isArray(FlatMMOPlus?.level) ? FlatMMOPlus.level : null;
            if (!xpTable || xpTable.length === 0) return 1;

            for (let i = xpTable.length - 1; i >= 1; i--) {
                if (xp >= (xpTable[i] || 0)) {
                    return i;
                }
            }
            return 1;
        }

        recalculateAndDisplayTotal() {
            if (!this.skillUI.total.textSpan || !this.skillUI.total.tooltip) return;

            let totalLevel = 0;
            let virtualTotalLevel = 0;
            let totalXp = 0;

            for (const skillName in this.skillUI.elements) {
                const element = this.skillUI.elements[skillName];
                totalXp += element.xp || 0;

                // Calculate both normal and virtual levels
                const normalLevel = Math.min(element.level || 0, 100);
                totalLevel += normalLevel;

                if (this.getConfig('showVirtualLevels')) {
                    virtualTotalLevel += element.level || 0;
                }
            }

            if (this.getConfig('showVirtualLevels') && virtualTotalLevel > totalLevel) {
                // Show regular level first, then virtual level in parentheses with different color
                this.skillUI.total.textSpan.innerHTML = `TOTAL ${totalLevel} <span class="virtual-level-display">(${virtualTotalLevel})</span>`;
            } else {
                this.skillUI.total.textSpan.innerText = `TOTAL ${totalLevel}`;
            }

            this.skillUI.total.tooltip.textContent = `${totalXp.toLocaleString('en-US')} XP`;
        }

        updateSkillCell(skillName) {
            const component = this.skillUI.elements[skillName];
            if (!component || !component.originalLevelEl) return;

            const xpTable = Array.isArray(FlatMMOPlus?.level) ? FlatMMOPlus.level : null;
            if (!xpTable || xpTable.length === 0) return;

            const levelText = component.originalLevelEl.innerText;
            const xpTooltipText = component.originalXpEl.innerHTML;
            const xpDataText = xpTooltipText.split('<br>').pop().trim();

            let displayLevel = parseInt(levelText);
            const [currentStr, maxStr] = xpDataText.replace(" XP", "").split("/");
            const currentXP = parseInt(currentStr.replace(/,/g, "")) || 0;

            // Calculate virtual level if enabled
            if (this.getConfig('showVirtualLevels')) {
                displayLevel = this.getLevelFromXP(currentXP);
            }

            component.level = displayLevel;
            component.xp = currentXP;
            component.label.innerText = displayLevel;

            // Handle progress bar and tooltip
            const lookupXp = (lvl) => {
                if (lvl < 0) return 0;
                return xpTable[Math.min(lvl, xpTable.length - 1)] || 0;
            };

            if (displayLevel >= 100 && !this.getConfig('showVirtualLevels')) {
                // At level 100 without virtual levels
                component.barFill.style.width = '100%';
                component.tooltip.textContent = `${currentXP.toLocaleString('en-US')} XP`;
            } else {
                // Calculate progress for current level
                const currentLevelXP = lookupXp(displayLevel);
                const nextLevelXP = lookupXp(displayLevel + 1) || currentXP;

                const xpGainedThisLevel = Math.max(0, currentXP - currentLevelXP);
                const xpNeededForThisLevel = nextLevelXP - currentLevelXP;

                let progress = 0;
                if (xpNeededForThisLevel > 0) {
                    progress = Math.min((xpGainedThisLevel / xpNeededForThisLevel) * 100, 100);
                }

                component.barFill.style.width = `${progress}%`;

                if (displayLevel >= 200) {
                    // Max virtual level
                    component.tooltip.textContent = `${currentXP.toLocaleString('en-US')} XP`;
                } else {
                    component.tooltip.textContent = `${currentXP.toLocaleString('en-US')} / ${nextLevelXP.toLocaleString('en-US')} XP`;
                }
            }

            this.recalculateAndDisplayTotal();
        }

        moveUiBelowCanvas() {
            const table = document.querySelector('#game table');
            if (!table) return;

            const canvas = table.querySelector('canvas');
            const canvasTd = canvas?.closest('td');
            const uiTd = table.querySelector('.td-ui');
            const headerBar = document.querySelector('.top-bar');
            let headerWrapper = null;

            if (canvas && canvasTd && uiTd) {
                document.body.classList.add('tm-portrait-mode');

                if (headerBar) {
                    // Move the site header links above the canvas so quick navigation stays visible.
                    headerWrapper = document.createElement('div');
                    headerWrapper.id = 'tm-portrait-header-bar-wrapper';
                    headerWrapper.style.transformOrigin = 'top left';
                    headerWrapper.style.display = 'inline-block';
                    headerWrapper.appendChild(headerBar);
                }

                const tableBody = table.tBodies[0];
                const preservedRows = [];

                const collectRows = parent => {
                    Array.from(parent.children).forEach(node => {
                        if (node.tagName !== 'TR') return;
                        if (node.contains(canvasTd) || node.contains(uiTd)) return;
                        preservedRows.push(node);
                    });
                };

                if (tableBody) {
                    collectRows(tableBody);
                } else {
                    collectRows(table);
                }

                const newTbody = document.createElement('tbody');
                preservedRows.forEach(row => newTbody.appendChild(row));

                const canvasRow = document.createElement('tr');
                const uiRow = document.createElement('tr');

                canvasRow.appendChild(canvasTd);
                uiRow.appendChild(uiTd);
                newTbody.append(canvasRow, uiRow);

                if (headerWrapper && canvas) {
                    canvasTd.insertBefore(headerWrapper, canvas);
                }

                if (tableBody) {
                    table.replaceChild(newTbody, tableBody);
                } else {
                    table.innerHTML = '';
                    table.appendChild(newTbody);
                }

                uiTd.style.cssText = 'padding: 0; margin: 0; overflow: visible; position: relative;';
                const uiWrapper = document.createElement('div');
                uiWrapper.style.transformOrigin = 'top left';
                uiWrapper.style.display = 'inline-block';

                while (uiTd.firstChild) {
                    uiWrapper.appendChild(uiTd.firstChild);
                }
                uiTd.appendChild(uiWrapper);

                const applyZoomAndWidthFix = () => {
                    const canvasWidth = canvas.offsetWidth;
                    const ratio = window.devicePixelRatio || 1;
                    const scale = 1 / ratio;

                    uiWrapper.style.transform = `scale(${scale})`;
                    uiWrapper.style.width = `${canvasWidth * ratio}px`;

                    if (headerWrapper) {
                        headerWrapper.style.transform = `scale(${scale})`;
                        headerWrapper.style.width = `${canvasWidth * ratio}px`;
                    }

                    requestAnimationFrame(() => {
                        const realHeight = uiWrapper.getBoundingClientRect().height;
                        uiTd.style.height = `${realHeight}px`;
                    });
                };

                applyZoomAndWidthFix();
                window.addEventListener('resize', applyZoomAndWidthFix);
            }
        }

        createSkillsGrid() {
            if (this.isGridCreated || !this.getConfig('showSkillsPanel')) {
                if (this.isGridCreated && !this.getConfig('showSkillsPanel')) {
                    this.destroySkillsGrid();
                }
                return;
            }

            const skillPanel = document.querySelector("#ui-panel-skills");
            const skillContainer = skillPanel?.querySelector("center");

            if (skillPanel && skillContainer) {
                const skillDivs = Array.from(skillContainer.querySelectorAll("div.skills-ui-new"));
                if (skillDivs.length > 0) {
                    this.isGridCreated = true;

                    const grid = document.createElement("div");
                    grid.style.cssText = "display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0;";
                    grid.id = "tm-skills-grid";

                    skillDivs.slice(0, -1).forEach(skillDiv => {
                        const levelEl = skillDiv.querySelector("span[id$='-level']");
                        if (!levelEl) return;
                        const skillName = levelEl.id.replace('-level', '');
                        const iconEl = skillDiv.querySelector("img");
                        const xpEl = skillDiv.querySelector("span[id$='-xp']");
                        const onclickAttr = skillDiv.getAttribute("onclick");

                        const cell = document.createElement("div");
                        cell.style.cssText = `display: flex; flex-direction: column; align-items: center; justify-content: space-between; background: #222; color: #fff; padding: 10px; border-radius: 8px; cursor: pointer;`;
                        cell.classList.add('skill-cell');
                        if (onclickAttr) cell.onclick = () => eval(onclickAttr);

                        const img = document.createElement("img");
                        img.src = iconEl.src;
                        img.style.cssText = "width: 32px; height: 32px; margin-bottom: 5px;";

                        const label = document.createElement("div");
                        label.style.fontSize = '16pt';
                        label.style.fontWeight = 'bold';

                        const spacer = document.createElement("div");
                        spacer.style.flexGrow = "1";

                        const barContainer = document.createElement("div");
                        barContainer.style.cssText = `width: 100%; height: 6px; background: #444; border-radius: 4px; margin-top: 6px; overflow: hidden;`;
                        const barFill = document.createElement("div");
                        barFill.style.cssText = "height: 100%; background: #00cc66; border-radius: 4px 0 0 4px;";
                        barFill.classList.add('skill-cell-bar-fill');
                        barContainer.appendChild(barFill);

                        const tooltip = document.createElement("div");
                        let tooltipStyle = `position: fixed; padding: 6px 10px; background: #333; color: #fff; border-radius: 6px; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.4); pointer-events: none; z-index: 9999; white-space: nowrap; display: none;`;

                        if (this.getConfig('portraitMode')) {
                            const ratio = window.devicePixelRatio || 1;
                            const scale = 1 / ratio;
                            tooltipStyle += `transform: scale(${scale}); transform-origin: left top;`;
                        }
                        tooltip.style.cssText = tooltipStyle;
                        document.body.appendChild(tooltip);

                        cell.addEventListener("mousemove", e => {
                            tooltip.style.left = `${e.pageX + 15}px`;
                            tooltip.style.top = `${e.pageY + 10}px`;
                        });
                        cell.addEventListener("mouseenter", () => { tooltip.style.display = "block"; });
                        cell.addEventListener("mouseleave", () => { tooltip.style.display = "none"; });

                        cell.append(img, label, spacer, barContainer);
                        grid.appendChild(cell);

                        this.skillUI.elements[skillName] = { label, barFill, tooltip, originalLevelEl: levelEl, originalXpEl: xpEl };
                        this.updateSkillCell(skillName);
                    });

                    const totalDiv = document.createElement("div");
                    totalDiv.style.cssText = `display: flex; align-items: center; justify-content: center; text-align: center; margin-top: 10px; padding: 10px; background: #444; color: #fff; font-weight: bold; border-radius: 8px; font-size: 16pt;`;
                    totalDiv.classList.add('total-level-div');
                    totalDiv.id = "tm-total-level-div";

                    const totalIcon = document.createElement("img");
                    totalIcon.src = "images/icons/skills_large.png";
                    totalIcon.style.cssText = "width: 24px; height: 24px; margin-right: 10px;";

                    const totalTextSpan = document.createElement("span");
                    totalDiv.append(totalIcon, totalTextSpan);

                    this.skillUI.total.textSpan = totalTextSpan;

                    const totalTooltip = document.createElement("div");
                    let tooltipStyle = `position: fixed; padding: 6px 10px; background: #333; color: #fff; border-radius: 6px; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.4); pointer-events: none; z-index: 9999; white-space: nowrap; display: none;`;
                     if (this.getConfig('portraitMode')) {
                        const ratio = window.devicePixelRatio || 1;
                        const scale = 1 / ratio;
                        tooltipStyle += `transform: scale(${scale}); transform-origin: left top;`;
                    }
                    totalTooltip.style.cssText = tooltipStyle;
                    document.body.appendChild(totalTooltip);
                    this.skillUI.total.tooltip = totalTooltip;

                    totalDiv.addEventListener("mousemove", e => {
                        totalTooltip.style.left = `${e.pageX + 15}px`;
                        totalTooltip.style.top = `${e.pageY + 10}px`;
                    });
                    totalDiv.addEventListener("mouseenter", () => { totalTooltip.style.display = "block"; });
                    totalDiv.addEventListener("mouseleave", () => { totalTooltip.style.display = "none"; });

                    this.recalculateAndDisplayTotal();

                    skillContainer.style.display = "none";
                    skillPanel.append(grid, totalDiv);

                    const skillObserver = new MutationObserver(() => {
                        Object.keys(this.skillUI.elements).forEach(skillName => this.updateSkillCell(skillName));
                    });
                    skillObserver.observe(skillContainer, { childList: true, subtree: true, characterData: true });
                }
            }
        }

        destroySkillsGrid() {
            if (!this.isGridCreated) return;

            const skillPanel = document.querySelector("#ui-panel-skills");
            const skillContainer = skillPanel?.querySelector("center");
            const grid = document.getElementById('tm-skills-grid');
            const totalDiv = document.getElementById('tm-total-level-div');

            if (grid) grid.remove();
            if (totalDiv) totalDiv.remove();
            if (this.skillUI.total.tooltip) this.skillUI.total.tooltip.remove();
            if (skillContainer) skillContainer.style.display = "";

            this.isGridCreated = false;
        }
    }

    const plugin = new UITweaksPlugin();
    FlatMMOPlus.registerPlugin(plugin);

})();

