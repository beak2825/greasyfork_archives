// ==UserScript==
// @name         IdlePixel Filtered Yoink!
// @namespace    lbtechnology.info
// @version      1.2.2
// @description  Based on Yoink v1.2.1
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/484046/code/IdlePixel%2B%20Custom%20Handling.js?anticache=20240616
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240616
// @downloadURL https://update.greasyfork.org/scripts/500701/IdlePixel%20Filtered%20Yoink%21.user.js
// @updateURL https://update.greasyfork.org/scripts/500701/IdlePixel%20Filtered%20Yoink%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class Yoink extends IdlePixelPlusPlugin {
        constructor() {
            super("yoink", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        type: "label",
                        label: "Anti-Jay update. list,items,like,this"
                    },
                    {
                        id: "ignore",
                        label: "ignore list",
                        type: "string",
                        max: 2000,
                        default: "coins,stardust,energy,stone"
                    }
                ]
            });
            this.item_list = []
        }

        onConfigsChanged() {
            this.ignoreList = IdlePixelPlus.plugins.yoink.getConfig("ignore").replace(";",",").replace(" ,", ",").replace(" , ",",").replace(", ",",").toLowerCase().split(',');
        }

        onLogin(){
            this.createModal()
            Paneller.registerPanel("yoink", "Yoink!", IdlePixelPlus.plugins.yoink.showModal)

            $("#game-panels-combat-items-area").before(`<button type="button" onclick="IdlePixelPlus.plugins.teamsqol.withdrawFightPoints()">Yoink FPs</button><br><br>`)
        }

        onMessageReceived(message) {
            if(this.item_list.length === 0 && message.startsWith("TEAMS_TRADABLES_MODAL")){
                this.item_list = message.split("=")[1].split("~")
                this.populateModal()
            }
        }

        createModal(){
            const modalString = `
				<div id="yoink_modal" class="modal fade" role="dialog" tabindex="-1">
				    <div class="modal-dialog modal-xxxl" role="document">
				        <div class="modal-content">
				            <div class="modal-body">
				                <div id="yoink_team_members" class="row row-cols-4">
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralhobnob" class="form-check-input" type="radio" name="yoink_player" checked value="feralhobnob" /><label class="form-check-label" for="formCheck-1">FeralHobnob</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feraljay" class="form-check-input" type="radio" name="yoink_player" value="feraljay" /><label class="form-check-label" for="formCheck-2">FeralJay</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralzlef" class="form-check-input" type="radio" name="yoink_player" value="feralzlef" /><label class="form-check-label" for="formCheck-3">FeralZlef</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralcammy" class="form-check-input" type="radio" name="yoink_player" value="feralcammy" /><label class="form-check-label" for="formCheck-4">FeralCammy</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralofnades" class="form-check-input" type="radio" name="yoink_player" value="feralofnades" /><label class="form-check-label" for="formCheck-5">FeralofNades</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_ferallone" class="form-check-input" type="radio" name="yoink_player" value="ferallone" /><label class="form-check-label" for="formCheck-6">FeralLone</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralamy" class="form-check-input" type="radio" name="yoink_player" value="feralamy" /><label class="form-check-label" for="formCheck-7">FeralAmy</label></div>
				                    </div>
				                    <div class="col">
				                        <div class="form-check"><input id="yoink_radio_feralpiet" class="form-check-input" type="radio" name="yoink_player" value="feralpiet" /><label class="form-check-label" for="formCheck-8">FeralPiet</label></div>
				                    </div>
				                </div>
				                <div id="yoink_search" class="row d-flex justify-content-center">
				                    <div class="col-10">
				                        <div class="input-group"><span class="input-group-text">Search</span><input id="yoink_search_bar" class="form-control" type="text" /></div>
				                    </div>
				                </div>
				                <div class="row"><center id="yoink_items"></center></div>
				            </div>
				        </div>
				    </div>
				</div>
			`

            const modalElement = $.parseHTML(modalString)
            $(document.body).append(modalElement)
        }

        populateModal(){
            const self = IdlePixelPlus.plugins.yoink
            self.item_list.forEach(item=>{
                const element_string = `<div data-bs-dismiss="modal" onclick="IdlePixelPlus.plugins.yoink.modalClicksItem(this.getAttribute('data-modal-team-storage'))" data-modal-team-storage="${item}" class="model-team-storage-item hover"><img class="w30" src="https://cdn.idle-pixel.com/images/${item}.png"></div>`
                const element = $.parseHTML(element_string)

                $("#yoink_items").append(element)
            })

            $("#yoink_search_bar").on("keyup", this.modalSearch)
        }

        modalSearch(){
            const term = $("#yoink_search_bar").val()
            $(".model-team-storage-item", "#yoink_items").each((index, obj)=>{
                const element = $(obj)
                const item = element.data("modal-team-storage")
                item.includes(term) ? element.show() : element.hide()
            })
        }

        modalClicksItem(item){
            const player = $('input[name="yoink_player"]:checked').val()
            Customs.sendBasicCustom(player, "yoink", "yoink", item)
        }

        showModal(){
            $("#yoink_modal").modal("show")
        }

        onCustomMessageReceived(player, content, callbackId) {
            const team_list = ["feralamy", "feralpiet", "feralcammy", "feralzlef", "feralhobnob", "ferallone", "feralofnades", "feraljay"]
            const customData = Customs.parseCustom(player, content, callbackId) // Parses custom data into an object, assumes the Anwinity Standard
            if (!(customData.plugin === "yoink" || customData.anwinFormatted)){ // Checks if custom is formatted in the correct way, and from the correct plugin
                return
            }
            if (team_list.includes(customData.player)){ // Checks if custom is received from the correct player
                if (customData.command === "yoink"){ // Runs relevant command code, replace with switch statment if using many commands
                    const item = customData.payload
                    // console.log(`Attempted yoink: ${item}`);
                    if (this.ignoreList.includes(item)) return; // Check if item is in the ignore list
                    const qty = window[`var_${item}`]
                    IdlePixelPlus.sendMessage(`TEAM_STORE_ITEM=${item}~${qty}`)
                }
            }
        }
    }

    const plugin = new Yoink();
    IdlePixelPlus.registerPlugin(plugin);

})();
