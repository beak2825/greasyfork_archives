// ==UserScript==
// @name         IdlePixel Var Viewer
// @namespace    com.anwinity.idlepixel
// @version      1.2.7
// @description  Easily view all game variables in a table.
// @author       Anwinity
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/441319/IdlePixel%20Var%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/441319/IdlePixel%20Var%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class VarViewerPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("varviewer", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin() {
            const usernameElement = $("#menu-bar-buttons item-display[data-key=username]");
            const onlineCount = $(".game-top-bar .gold:not(#top-bar-admin-link)");
            onlineCount.before(`
            <a href="#" class="hover float-end link-no-decoration" onclick="event.preventDefault(); IdlePixelPlus.setPanel('varviewer')" title="Open VarViewer">Vars&nbsp;&nbsp;&nbsp;</a>
            `);

            IdlePixelPlus.addPanel("varviewer", "Var Viewer", function() {
                let content = `
                <style>
                #varviewer-table {
                    margin-top: 0.25em;
                    color: black;
                    background-color: white;
                }
                #varviewer-table, #varviewer-table tr, #varviewer-table th, #varviewer-table td {
                    border: 1px solid black;
                    font-family: 'Courier New', monospace;
                }
                #varviewer-table th, #varviewer-table td {
                    padding: 2px;
                }
                #varviewer-table td:last-child {
                    text-align: right;
                }
                </style>
                <input id="varviewer-filter" type="text" placeholder="text or /regex/" style="min-width: 250px" onkeyup="IdlePixelPlus.plugins.varviewer.onFilterKeyUp(event)" />
                <button onclick="IdlePixelPlus.plugins.varviewer.refilter()">Filter / Refresh</button>
                <br />
                <table id="varviewer-table">
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                `;
                return content;
            });
            IdlePixelPlus.refreshPanel("varviewer");
            this.refilter();
        }

        onFilterKeyUp(event) {
            if(event.keyCode === 13) {
                this.refilter();
            }
            return false;
        }

        refilter() {
            const tbody = $("#varviewer-table tbody");
            const filter = ($("#varviewer-filter").val() || "").trim().toLowerCase();
            let regex = null;
            if(filter.startsWith("/") && filter.endsWith("/")) {
                try {
                    regex = new RegExp(filter.substring(1, filter.length-1), 'i');
                }
                catch(err) {

                }
            }
            let content = "";
            Object.keys(window)
                .filter(key => key.startsWith("var_"))
                .sort()
                .forEach(key => {
                let show = false;
                    if(!filter) {
                        show = true;
                    }
                    else if(regex) {
                        const val = window[key];
                        if(regex.test(key) || regex.test(val)) {
                            show = true;
                        }
                    }
                    else {
                        const keyLower = key.toLowerCase();
                        const valLower = `${window[key]}`.toLowerCase();
                        if(keyLower.includes(filter) || valLower.includes(filter)) {
                            show = true;
                        }
                    }

                    if(show) {
                        let value = window[key] ?? "";
                        if(key == "var_animal_data") {
                            value = value.replace(/=/g, "=<br />");
                        }
                        content += `<tr><td>${key}</td><td>${value}</td></tr>`;
                    }
            });
            tbody.empty();
            tbody.append(content);
            return false;
        }

    }

    const plugin = new VarViewerPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();