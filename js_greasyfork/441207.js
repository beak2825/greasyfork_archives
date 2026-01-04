// ==UserScript==
// @name         IdlePixel+ SamplePlugin
// @namespace    com.anwinity.idlepixel.sample
// @version      0.0.7
// @description  IdlePixel+ sample plugin
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/441207/IdlePixel%2B%20SamplePlugin.user.js
// @updateURL https://update.greasyfork.org/scripts/441207/IdlePixel%2B%20SamplePlugin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class SamplePlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("sample", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: "label",
                        label: "Section Label:"
                    },
                    {
                        id: "MyCheckbox",
                        label: "Yes / No",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "MyInteger",
                        label: "Pick a Number",
                        type: "integer",
                        min: 1,
                        max: 10,
                        type: "integer",
                        default: 1
                    },
                    {
                        id: "MyNumber",
                        label: "Pick a Cooler Number",
                        type: "number",
                        min: 0,
                        max: 10,
                        step: 0.1,
                        default: 1.5
                    },
                    {
                        id: "MyString",
                        label: "Enter a Thing",
                        type: "string",
                        max: 20,
                        default: "x"
                    },
                    {
                        id: "MySelect",
                        label: "Pick One",
                        type: "select",
                        options: [
                            {value: "opt1", label: "Option 1"},
                            {value: "opt2", label: "Option 2"},
                            {value: "opt3", label: "Option 3"}
                        ],
                        default: "opt2"
                    }
                ]
            });
        }

        onConfigsChanged() {
            console.log("SamplePlugin.onConfigsChanged");
        }

        onLogin() {
            console.log("SamplePlugin.onLogin");
        }

        onMessageReceived(data) {
            // Will spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onMessageReceived: ", data);
        }

        onVariableSet(key, valueBefore, valueAfter) {
            // Will spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onVariableSet", key, valueBefore, valueAfter);
        }

        onChat(data) {
            // Could spam the console, uncomment if you want to see it
            //console.log("SamplePlugin.onChat", data);
        }

        onPanelChanged(panelBefore, panelAfter) {
            console.log("SamplePlugin.onPanelChanged", panelBefore, panelAfter);
        }

        onCombatStart() {
            console.log("SamplePlugin.onCombatStart");
        }

        onCombatEnd() {
            console.log("SamplePlugin.onCombatEnd");
        }

    }

    const plugin = new SamplePlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();