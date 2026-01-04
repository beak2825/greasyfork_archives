// ==UserScript==
// @name         IdlePixel Notes Panel
// @namespace    lbtechnology.info
// @version      1.2.1
// @description  Adds a panel for storing semi-persistant notes
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240410
// @downloadURL https://update.greasyfork.org/scripts/474767/IdlePixel%20Notes%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/474767/IdlePixel%20Notes%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class NotePanelPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("notespanel", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
            });
            this.previous = "";
        }

    	createPanel(){
            IdlePixelPlus.addPanel("notes", "Notes", function() {
                let content = `<div>`
                content += `<br/>`
                content += `<form onsubmit='event.preventDefault(); IdlePixelPlus.plugins.notespanel.saveNotes()'>`
                content += `<textarea id="notes_box" maxlength="2000" style="width:100%;height:75%;background-color:rgb(25,25,25);color:rgb(255,255,255)"></textarea>`
                content += `<input type="submit" value="Save">`
                content += `</form>`
                content += `</div>`
                return content
            });
        }

    	onLogin(){
            this.createPanel()

			Paneller.registerPanel("notes", "Notes")
    	}

		onPanelChanged(panelBefore, panelAfter){
			if (panelAfter==="notes"){
				const notes = localStorage.getItem("IPNotes")
				$("#notes_box").val(notes)
			}
		}

    	saveNotes(){
            const currentNotes = $("#notes_box").val()
        	localStorage.setItem("IPNotes", currentNotes)
        }
    }

    const plugin = new NotePanelPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})(); 