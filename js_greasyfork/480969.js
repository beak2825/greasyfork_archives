// ==UserScript==
// @name         IdlePixel Kaat Client
// @namespace    lbtechnology.info
// @version      1.1.1
// @description  Kaat account interaction panel
// @author       Lux-Ferre
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require		 https://greasyfork.org/scripts/491983-idlepixel-plugin-paneller/code/IdlePixel%2B%20Plugin%20Paneller.js?anticache=20240410
// @downloadURL https://update.greasyfork.org/scripts/480969/IdlePixel%20Kaat%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/480969/IdlePixel%20Kaat%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class KaatClientPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("kaat-client", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        id: "kaatAccount",
                        label: "Account name to running the v-pet.",
                        type: "string",
                        max: 20,
                        default: "ᓚᘏᗢ"
                    }
                ]
            });
            this.previous = "";
        }

        onLogin() {
            this.createPanel()
            this.acquireKaatStats()
            this.addStyles()

            if (!("kaat-host" in IdlePixelPlus.plugins)){
                $("#controlTabButton").hide()
            }
    
			Paneller.registerPanel("kaat-client", "Kaat Client")
            }

        onCustomMessageReceived(player, content, callbackId) {
            const customData = this.parseCustom(player, content, callbackId)
            if (!(customData.plugin === "kaatpet" || customData.anwinFormatted)){
                return
            }
            if (customData.player === this.getConfig("kaatAccount")){
                if (customData.command === "kaatData"){
                    this.refreshKaatStats(customData.payload)
                }
            }
        }

        addStyles(){
            let borderColour
            
            if ("ui-tweaks" in IdlePixelPlus.plugins){
                borderColour = IdlePixelPlus.plugins["ui-tweaks"].config["font-color-panels"]
            } else {
                borderColour = "black"
            }

            $("head").append(`
                <style id="styles-kaat-client">
                    :root {
                        --border-colour: ${borderColour}
                    }
                </style>
            `)
        }

        parseCustom(player, content, callbackId){
            const customData = {
                player: player,
                callbackId: callbackId,
                anwinFormatted: false
            }
            const splitPayload = content.split(":")
            if(splitPayload.length >= 3){
                customData.anwinFormatted = true
                customData.plugin = splitPayload[0]
                customData.command = splitPayload[1]
                customData.payload = splitPayload.slice(2).join(":")
            } else {
                customData.anwinFormatted = false
                customData.plugin = "unknown"
                customData.command = "unknown"
                customData.payload = content
            }
    
            return customData
        }
    
        createPanel(){
            IdlePixelPlus.addPanel("kaat-client", "Nya~", function() {
                const content = `
<div class="container" style="width: 100%;">
    <header>
        <h1>Kaat Client</h1>
    </header>
    <div>
        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item" role="presentation"><a class="nav-link active" role="tab" data-bs-toggle="tab" href="#tab-1">Status</a></li>
            <li id="controlTabButton" class="nav-item" role="presentation"><a class="nav-link" role="tab" data-bs-toggle="tab" href="#tab-2">Control</a></li>
        </ul>
        <div class="tab-content">
            <div id="tab-1" class="tab-pane active" role="tabpanel">
                <h2>Kaat Status</h2>
                <div class="vstack">
                    <div style="border: 2px solid var(--border-colour);">
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h3 style="border: 0px solid var(--border-colour);">Overall Mood</h3>
                        </div>
                        <div class="row" style="margin: 0px;">
                            <div class="col-xl-9 d-flex flex-column justify-content-between align-self-center">
                                <div class="progress" style="height: 24px;">
                                    <div id="mood" class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <div class="row">
                                            <div class="col-xl-2"><label class="col-form-label fw-bold">Is alive?</label></div>
                                            <div class="col-xl-1"><label id="isAliveLbl" class="col-form-label fw-bold"></label></div>
                                            <div class="col"><label class="col-form-label"></label></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-xl-2"><label class="col-form-label fw-bold">Is asleep?</label></div>
                                            <div class="col-xl-1"><label id="isAsleepLbl" class="col-form-label fw-bold"></label></div>
                                            <div class="col"><label class="col-form-label"></label></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col flex-shrink-1" style="text-align: center;"><img class="img-fluid flex-shrink-1" src="https://cdn.discordapp.com/attachments/1170262289803390997/1177053355240075314/DALLE_2023-11-22_12.57.21_-_Create_a_black_and_white_pixelated_image_of_a_cat_sleeping_with_black_coloration_around_its_ears_on_its_head._The_cat_should_be_depicted_in_a_peaceful.png" style="max-width: 10vw;" /></div>
                        </div>
                    </div>
                    <div style="border: 2px solid var(--border-colour);">
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h3>Individual Stats</h3>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-1"><label class="col-form-label" for="hunger">Hunger</label></div>
                            <div class="col align-self-center">
                                <div class="progress" style="height: 24px;">
                                    <div id="hunger" class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-1"><label class="col-form-label" for="tiredness">Tiredness</label></div>
                            <div class="col align-self-center">
                                <div class="progress" style="height: 24px;">
                                    <div id="tiredness" class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-1"><label class="col-form-label" for="social">Social</label></div>
                            <div class="col align-self-center">
                                <div class="progress" style="height: 24px;">
                                    <div id="social" class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                                </div>
                            </div>
                        </div>
                        <div class="row" style="margin: 0px;">
                            <div class="col-xl-1"><label class="col-form-label" for="energy">Energy</label></div>
                            <div class="col align-self-center">
                                <div class="progress" style="height: 24px;">
                                    <div id="energy" class="progress-bar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 50%;">50%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="tab-2" class="tab-pane" role="tabpanel">
                <h2>Kaat Configs</h2>
                <div class="vstack">
                    <div style="border: 2px solid var(--border-colour);">
                        <div class="row d-flex flex-wrap" style="margin: 0px;border-bottom: 1px dotted var(--border-colour);">
                            <div class="col-xl-1"><label class="col-form-label"></label></div>
                            <div class="col-2 col-xl-2 text-center"><button class="btn btn-secondary" type="button" onclick="IdlePixelPlus.plugins[&#39;kaat-client&#39;].populateConfigs()">Load Configs</button></div>
                            <div class="col-2 col-xl-2 text-center"><label class="col-form-label"></label></div>
                            <div class="col-2 col-xl-2 text-center"><button class="btn btn-success" type="button" onclick="IdlePixelPlus.plugins[&#39;kaat-host&#39;].revive()">Revive ᓚᘏᗢ</button><label class="form-label"></label></div>
                            <div class="col-2 col-xl-2 text-center"><label class="col-form-label"></label></div>
                            <div class="col-4 col-xl-2 text-center" style="text-align: center;"><button class="btn btn-secondary" type="button" onclick="IdlePixelPlus.plugins[&#39;kaat-client&#39;].saveConfigs()">Save Configs</button></div>
                            <div class="col-xl-1"><label class="col-form-label"></label></div>
                        </div>
                    </div>
                    <div style="border: 2px solid var(--border-colour);">
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h3 style="border: 0px solid var(--border-colour);">Controls</h3>
                        </div>
                        <div class="row d-flex flex-wrap" style="margin: 0px;border-bottom: 1px dotted var(--border-colour);">
                            <div class="col-2 col-xl-2 text-center justify-content-center align-self-center">
                                <p>Tick Length (ms)</p>
                            </div>
                            <div class="col" style="text-align: center;border-right: 1px dotted var(--border-colour);"><input id="tickLengthInput" type="number" min="1000" max="300000" style="width: 100%;" /></div>
                            <div class="col-2 col-xl-2 text-center" style="text-align: center;">
                                <p>Cooldown Length (ms)</p>
                            </div>
                            <div class="col-4 col-xl-4" style="text-align: center;"><input id="cooldownLengthInput" type="number" min="1000" max="300000" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="margin: 0px;border-bottom: 1px dotted var(--border-colour);">
                            <div class="col-2 col-xl-2 text-center justify-content-center align-self-center">
                                <p>Hunger removed by !feed</p>
                            </div>
                            <div class="col-4 col-xl-4 align-self-center" style="text-align: center;border-right: 1px dotted var(--border-colour);"><label id="feedHungerSliderLbl" class="form-label" for="feedHungerSlider">0</label><input id="feedHungerSlider" class="form-range" type="range" min="1" max="100" step="1" value="50" oninput="$(&#39;#feedHungerSliderLbl&#39;).html(this.value)" /></div>
                            <div class="col-2 col-xl-2 text-center align-self-center" style="text-align: center;">
                                <p>Social restored by !pet</p>
                            </div>
                            <div class="col-4 col-xl-4 align-self-center" style="text-align: center;"><label id="petSocialSliderLbl" class="form-label" for="petSocialSlider">0</label><input id="petSocialSlider" class="form-range" type="range" min="1" max="100" step="1" value="50" oninput="$(&#39;#petSocialSliderLbl&#39;).html(this.value)" /></div>
                        </div>
                        <div class="row" style="margin: 0px;">
                            <div class="col-2 col-xl-2 text-center justify-content-center">
                                <p>Energy used by !play</p>
                            </div>
                            <div class="col-4 col-xl-4 align-self-center" style="text-align: center;border-right: 1px dotted var(--border-colour);"><label id="playEnergySliderLbl" class="form-label" for="playEnergySlider">0</label><input id="playEnergySlider" class="form-range" type="range" min="1" max="100" step="1" value="50" oninput="$(&#39;#playEnergySliderLbl&#39;).html(this.value)" /></div>
                            <div class="col-2 col-xl-2 text-center flex-shrink-1 align-self-center" style="text-align: center;">
                                <p>Social restored by !play</p>
                            </div>
                            <div class="col-4 col-xl-4 align-self-center" style="text-align: center;"><label id="playSocialSliderLbl" class="form-label" for="playSocialSlider">0</label><input id="playSocialSlider" class="form-range" type="range" min="1" max="100" step="1" value="50" oninput="$(&#39;#playSocialSliderLbl&#39;).html(this.value)" /></div>
                        </div>
                        <div class="row" style="margin: 0px;">
                            <div class="col-2 col-xl-2 justify-content-center"></div>
                            <div class="col-4 col-xl-4 flex-shrink-1" style="text-align: center;"></div>
                            <div class="col-2 col-xl-2 flex-shrink-1" style="text-align: center;"></div>
                            <div class="col-4 col-xl-4 flex-shrink-1" style="text-align: center;"></div>
                        </div>
                    </div>
                    <div style="border: 2px solid var(--border-colour);">
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h3>Reply Strings</h3>
                        </div>
                        <div class="row" style="margin: 0px;border-top: 2px solid var(--border-colour);border-bottom: 1px solid var(--border-colour);">
                            <h4>Hunger</h4>
                        </div>
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h5>!feed</h5>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Not hungry</label></div>
                            <div class="col align-self-center"><input id="notHungryInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part one</label></div>
                            <div class="col align-self-center"><input id="beenFedInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part two - high hunger</label></div>
                            <div class="col align-self-center"><input id="stillHungryInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part two - low hunger</label></div>
                            <div class="col align-self-center"><input id="wellFedInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="margin: 0px;border-top: 2px solid var(--border-colour);border-bottom: 1px solid var(--border-colour);">
                            <h4>Tiredness</h4>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Wake up</label></div>
                            <div class="col align-self-center"><input id="wakeUpInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Is sleeping</label></div>
                            <div class="col align-self-center"><input id="isSleepingInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h5>!sleep</h5>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Not tired</label></div>
                            <div class="col align-self-center"><input id="notTiredInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Start sleep</label></div>
                            <div class="col align-self-center"><input id="startSleepInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="margin: 0px;border-top: 2px solid var(--border-colour);border-bottom: 1px solid var(--border-colour);">
                            <h4>Social</h4>
                        </div>
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h5>!play</h5>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">No play</label></div>
                            <div class="col align-self-center"><input id="noPlayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">No energy to play</label></div>
                            <div class="col align-self-center"><input id="noEnergyForPlayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part one</label></div>
                            <div class="col align-self-center"><input id="hadPlayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part two - high social</label></div>
                            <div class="col align-self-center"><input id="donePlayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Part two - low social</label></div>
                            <div class="col align-self-center"><input id="morePlayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px solid var(--border-colour);margin: 0px;">
                            <h5>!pet</h5>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">No pets</label></div>
                            <div class="col align-self-center"><input id="noPetsInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Had pets</label></div>
                            <div class="col align-self-center"><input id="hadPetsInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="margin: 0px;border-top: 2px solid var(--border-colour);border-bottom: 1px solid var(--border-colour);">
                            <h4>Status</h4>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Very high hunger</label></div>
                            <div class="col align-self-center"><input id="starvingInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">High hunger</label></div>
                            <div class="col align-self-center"><input id="hungryInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Very high tiredness</label></div>
                            <div class="col align-self-center"><input id="exhaustedInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">High tiredness</label></div>
                            <div class="col align-self-center"><input id="sleepyInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Very low social</label></div>
                            <div class="col align-self-center"><input id="lonelyInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Low social</label></div>
                            <div class="col align-self-center"><input id="needsAttentionInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">All stats high</label></div>
                            <div class="col align-self-center"><input id="feelGreatInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">All stats mid</label></div>
                            <div class="col align-self-center"><input id="feelOkayInput" type="text" style="width: 100%;" /></div>
                        </div>
                        <div class="row" style="border-bottom: 1px outset var(--border-colour);margin: 0px;">
                            <div class="col-xl-2"><label class="col-form-label">Has died</label></div>
                            <div class="col align-self-center"><input id="hasDiedInput" type="text" style="width: 100%;" /></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                    `
                    return content
                });
        }
    
        acquireKaatStats(){
            const kaatAccount = this.getConfig("kaatAccount")
            const command = "kaatDataRequest"
            const data = "None"
            this.sendCustom(kaatAccount, command, data)
        }
    
        refreshKaatStats(rawData){
            const data = JSON.parse(rawData)
            
            const dataPointMap = {
                hunger: {value: data.hunger, negative: true},
                tiredness: {value: data.tiredness, negative: true},
                energy: {value: data.energy, negative: false},
                social: {value: data.social, negative: false},
            }

            dataPointMap.mood = {
                value: Math.floor(( (100-dataPointMap.hunger.value) + (100-dataPointMap.tiredness.value) + dataPointMap.social.value) / 3),
                negative: false
            }
            
            for (const [key, data] of Object.entries(dataPointMap)) {
                const value = data.value
                const isNegative = data.negative
                let hue = Math.floor(value * 1.2)
                if (isNegative){
                    hue = 120 - hue
                }
                $(`#${key}`)
                    .attr({
                        "aria-valuenow": value,
                        "style": `width: ${value}%; background-color: hsl(${hue}, 70%, 50%) !important;`
                    })
                    .html(value+'%')
            }
            
            $("#isAliveLbl").html(data.alive? "Yes" : "No")
            $("#isAsleepLbl").html(data.sleeping? "Yes" : "No")
        }
                
        sendCustom(recipient, command, data){
            const pluginValue = "kaatpet"
            
            const content = `${pluginValue}:${command}:${data}`
    
            const payload = {
                content: content, 
                onResponse: function(player, content, callbackId) {
                    return true;
                    },
                onOffline: function(player, content) {
                    console.log(content)
                },
                timeout: 2000 // callback expires after 2 seconds
            }
            IdlePixelPlus.sendCustomMessage(recipient, payload)
        }
    
        populateConfigs(){
            const storedReplyStrings = localStorage.getItem("kaatReplies")
            if (storedReplyStrings){
                this.replyStrings = JSON.parse(storedReplyStrings)
            } else {
                this.replyStrings = {
                    notHungry: "",
                    beenFed: "",
                    stillHungry: "",
                    wellFed: "",
                    wakeUp: "",
                    notTired: "",
                    startSleep: "",
                    isSleeping: "",
                    noPlay: "",
                    noEnergyForPlay: "",
                    hadPlay: "",
                    donePlay: "",
                    morePlay: "",
                    noPets: "",
                    hadPets: "",
                    starving: "",
                    hungry: "",
                    exhausted: "",
                    sleepy: "",
                    lonely: "",
                    needsAttention: "",
                    feelGreat: "",
                    feelOkay: "",
                    hasDied: "",
                }
            }

            for (const [key, value] of Object.entries(this.replyStrings)) {
                $(`#${key}Input`).val(value)
            }

            const storedConfigs = localStorage.getItem("kaatConfigs")
            if (storedConfigs){
                this.configValues = JSON.parse(storedConfigs)
            } else {
                this.configValues = {
                    tickLength: {
                        value: 0,
                        element: "tickLengthInput"
                    },
                    cooldownLength: {
                        value: 0,
                        element: "cooldownLengthInput"
                    },
                    feedHungerDif: {
                        value: 0,
                        element: "feedHungerSlider"
                    },
                    playEnergyDif: {
                        value: 0,
                        element: "playEnergySlider"
                    },
                    playSocialDif: {
                        value: 0,
                        element: "playSocialSlider"
                    },
                    petSocialDif: {
                        value: 0,
                        element: "petSocialSlider"
                    },
                }
            }

            for (const [key, value] of Object.entries(this.configValues)) {
                $(`#${value.element}`).val(value.value)
                if (value.element.endsWith("Slider")){
                    $(`#${value.element}Lbl`).html(value.value)
                }
            }
        }

        saveConfigs(){
            const newConfigValues = {
                tickLength: {
                    value: 0,
                    element: "tickLengthInput"
                },
                cooldownLength: {
                    value: 0,
                    element: "cooldownLengthInput"
                },
                feedHungerDif: {
                    value: 0,
                    element: "feedHungerSlider"
                },
                playEnergyDif: {
                    value: 0,
                    element: "playEnergySlider"
                },
                playSocialDif: {
                    value: 0,
                    element: "playSocialSlider"
                },
                petSocialDif: {
                    value: 0,
                    element: "petSocialSlider"
                },
            }

            const newReplyStrings = {
                notHungry: "",
                beenFed: "",
                stillHungry: "",
                wellFed: "",
                wakeUp: "",
                notTired: "",
                startSleep: "",
                isSleeping: "",
                noPlay: "",
                noEnergyForPlay: "",
                hadPlay: "",
                donePlay: "",
                morePlay: "",
                noPets: "",
                hadPets: "",
                starving: "",
                hungry: "",
                exhausted: "",
                sleepy: "",
                lonely: "",
                needsAttention: "",
                feelGreat: "",
                feelOkay: "",
                hasDied: "",
            }

            for (const [key, value] of Object.entries(newReplyStrings)) {
                newReplyStrings[key] = $(`#${key}Input`).val()
            }

            for (const [key, value] of Object.entries(newConfigValues)) {
                newConfigValues[key].value = parseInt($(`#${value.element}`).val())
            }

            const configString = JSON.stringify(newConfigValues)
            const replyStringsString = JSON.stringify(newReplyStrings)

            localStorage.setItem("kaatConfigs", configString)
            localStorage.setItem("kaatReplies", replyStringsString)
        }
}

    const plugin = new KaatClientPlugin();
    IdlePixelPlus.registerPlugin(plugin);
    
})();