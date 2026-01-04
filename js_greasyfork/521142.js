// ==UserScript==
// @name         Idle-Pixel TCG Exporter
// @namespace    luxferre.dev
// @version      1.0.0
// @description  Export a table of all your cards
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20241218
// @downloadURL https://update.greasyfork.org/scripts/521142/Idle-Pixel%20TCG%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/521142/Idle-Pixel%20TCG%20Exporter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class TCGExport extends IdlePixelPlusPlugin {
        constructor() {
            super("tcg_export", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            })
            this.card_data = {}
        }

        onLogin() {
            this.createModal()
            Paneller.registerPanel("tcg_export", "Export TCG to Clipboard", IdlePixelPlus.plugins.tcg_export.export_click)
        }
        onMessageReceived(data) {
            if (!data.startsWith("REFRESH_TCG=")){return}
            this.card_data = {}
            const input = data.slice(12)
            const values = input.split("~");
            for (let i = 0; i < values.length; i += 3) {
                if (i + 2 < values.length) {
                    const name = values[i + 1];
                    const holo = values[i + 2].toLowerCase() === "true"
                    if (!(name in this.card_data)) {
                        this.card_data[name] = {
                            base: 0,
                            holo: 0
                        }
                    }
                    if(holo){
                        this.card_data[name].holo += 1
                    } else {
                        this.card_data[name].base += 1
                    }
                }
            }
        }
        createModal(){
            const modalString = `
                <div id="tcg_export_modal" class="modal fade" data-bs-theme="dark" role="dialog" tabindex="-1"">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-body" style="overflow: hidden">
                                <div id="tcg_export_response" class="text-center" style="color: white;"></div>
                            </div>
                        </div>
                    </div>
                </div>
			`

            const modalElement = $.parseHTML(modalString)
            $(document.body).append(modalElement)
        }
        export_click(){
            IdlePixelPlus.sendMessage("RFRESH_TCG_CLIENT")
            setTimeout(() => {
                IdlePixelPlus.plugins.tcg_export.export()
            }, 3000)
        }
        export(){
            let csv = `id,base,holo\n`
            for (const [key, value] of Object.entries(this.card_data)) {
                const new_row = `${key},${value.base},${value.holo}\n`
                csv += new_row
            }
            this.copy_to_clipboard(csv)
        }

        copy_to_clipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                $("#tcg_export_response").text("Text copied to clipboard!")
                $("#tcg_export_modal").modal("show")
            }).catch(err => {
                $("#tcg_export_response").text(`Error copying text: ${err}`)
                $("#tcg_export_modal").modal("show")
            });
        }
    }

    const plugin = new TCGExport();
    IdlePixelPlus.registerPlugin(plugin);
    
})();
