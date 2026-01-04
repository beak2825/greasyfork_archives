// ==UserScript==
// @name         IdlePixelPlus Config Backup
// @namespace    lbtechnology.info
// @version      1.1.0
// @description  Creates a panel for backing up IP+ Configs
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/466355/IdlePixelPlus%20Config%20Backup.user.js
// @updateURL https://update.greasyfork.org/scripts/466355/IdlePixelPlus%20Config%20Backup.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    class IPPBackupPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("IPPBackup", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.previous = "";
        }

        createPanel(){
            IdlePixelPlus.addPanel("ippbackup", "Backup/Restore Panel", function() {
                let content = `<div>`
                    content += `<br/>`
                    IdlePixelPlus.forEachPlugin(plugin=>{
                        const id = plugin.id
                        content += `<div>`
                            content += `<label for='${id}_text'><p style="-webkit-text-stroke:1px cadetblue;">${id}:&nbsp&nbsp</p></label>`
                            content += `<input id="${id}_text" type="text" style="width: 90%; float:right" readonly>`
                        content += `</div>`
                    })

                    content += `<input type="button" value="Load All" onClick="IdlePixelPlus.plugins.IPPBackup.loadAll()" id="load_all_button">`
                    content += `<input type="button" value="Restore" onClick="IdlePixelPlus.plugins.IPPBackup.restoreAll()" id="restore_all_button">`
                content += `</div>`
                content += `<div>`
                    content += `<label for='allConfigs'><p style="-webkit-text-stroke:1px cadetblue;">All Configs:&nbsp&nbsp</p></label>`
                    content += `<input id="allConfigs" type="text" style="width: 90%; float:right" readonly>`
                content += `</div>`
                return content
            });
        }

        loadAll(){
            var data = {}
            IdlePixelPlus.forEachPlugin(plugin=>{
                var sub_data = {}
                const id = plugin.id
                const plugin_textbox = `#${id}_text`
                let stored = localStorage.getItem(`idlepixelplus.${id}.config`);
                if (stored == null){
                    sub_data = "";
                }
                else {
                    sub_data[id] = stored
                    data[id] = stored;
                }
                $(plugin_textbox).val(JSON.stringify(sub_data))
            })

            const allConfigs = $("#allConfigs")
            allConfigs.val(JSON.stringify(data))
        }

        restoreAll(){
            var data = {}
            const raw_input = prompt("Paste backup here:")

            if (raw_input == null){return;}

            const config_obj = JSON.parse(raw_input)

            for (const [key, value] of Object.entries(config_obj)) {
                localStorage.setItem(`idlepixelplus.${key}.config`, value);
            }
        }

        onLogin(){
            this.createPanel()
            const lastMenuItem = $("#menu-bar-buttons > .hover-menu-bar-item").last();
            lastMenuItem.after(`
                <div onclick="IdlePixelPlus.setPanel('ippbackup')" class="hover hover-menu-bar-item">
                    <p>💾 PLUGIN BACKUP</p>
                </div>
            `)
        }
     }
    
    const plugin = new IPPBackupPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})(); 