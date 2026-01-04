// ==UserScript==
// @name         Fix underscores in Outlook
// @namespace    http://tampermonkey.net/
// @author       yotann
// @version      0.1
// @license      CC-PDDC
// @description  Stops underscores from being converted into italics in the Outlook message editor.
// @match        https://outlook.office.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533046/Fix%20underscores%20in%20Outlook.user.js
// @updateURL https://update.greasyfork.org/scripts/533046/Fix%20underscores%20in%20Outlook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hookPrototype(prototype, overrides) {
        // Set the prototype of the overrides, so `super` refers to an unmodified copy of the original prototype.
        Object.setPrototypeOf(overrides, Object.create(Object.getPrototypeOf(prototype), Object.getOwnPropertyDescriptors(prototype)));
        Object.defineProperties(prototype, Object.getOwnPropertyDescriptors(overrides));
    }

    // Javascript modules are lazily loaded using webpack chunks.
    // Detect when a new chunk is loaded, so we can find the module that includes MarkdownPlugin.
    hookPrototype(globalThis.webpackChunkOwa, {
        push(array) {
            const moduleConstructors = array[1];
            Object.entries(moduleConstructors).forEach(([id, originalModuleConstructor]) => {
                moduleConstructors[id] = function(module, exports, exporter) {
                    originalModuleConstructor.apply(this, arguments);
                    if (exports.hasOwnProperty('MarkdownPlugin')) {
                        console.log('Patching MarkdownPlugin');
                        hookPrototype(exports.MarkdownPlugin.prototype, {
                            initialize(editor) {
                                super.initialize(editor);
                                this.options.italic = false; // "_"
                                // this.options.bold = false; // "*"
                                // this.options.strikethrough = false; // "~"
                                // this.options.codeFormat = false; // "`"
                            }
                        });
                    }
                };
            });
            super.push(array);
        }
    });
})();
