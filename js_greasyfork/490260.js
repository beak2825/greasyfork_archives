// ==UserScript==
// @name         IdlePixel Unwanted Popup Suppressor
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Surpresses a variety of popup messages that might be unwanted by the player. Matches the popup by its title and message in english. If these strings change (or are localised) the popup will not be surpressed.
// @author       banban
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/490260/IdlePixel%20Unwanted%20Popup%20Suppressor.user.js
// @updateURL https://update.greasyfork.org/scripts/490260/IdlePixel%20Unwanted%20Popup%20Suppressor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class UnwantedPopupSuppressorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("badPopups", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "suppressDragAndDrop",
                        label: "Suppress farming popup: \"Drag and drop or click a seed you wish to plant.\"",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "suppressTreePopup",
                        label: "Suppress woodcutting popup: \"A tree can start growing here at any moment.\"",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "suppressAllYourFarming",
                        label: "Suppress farming popup: \"All your farming patches are occupied!\"",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "suppressMarketPurchase",
                        label: "Suppress market popup: \"Successfully purchased from player market!\"",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "suppressCookingFishSummary",
                        label: "Suppress fish cooking popup: \"COOKING RESULTS!\"",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "suppressBoatAlreadyOutPrompt",
                        label: "Suppress boat already out popup: \"You're boat is already out in the ocean!\"",
                        type: "boolean",
                        default: true
                    }
                ]
            });
            this.previous = "";
        }

    onLogin(){
            var openImageModalOriginal = Modals.open_image_modal;
            Modals.open_image_modal = (title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable) => {
                // Farming modal - occasionally appears when using slap chop during watering can sessions.
                if (this.getConfig("suppressDragAndDrop") && title === "FARMING" && message === "Drag and drop or click a seed you wish to plant.") {
                    return;
                }
                // Overplanting modal
                if (this.getConfig("suppressAllYourFarming") && title == "PATCHES OCCUPIED" && message === "All your farming patches are occupied!") {
                    return;
                }
                // Market purchase successful modal
                if (this.getConfig("suppressMarketPurchase") && title == "MARKET PURCHASE" && message === "Successfully purchased from player market!") {
                    return;
                }
                // Cooking fish summary
                if (this.getConfig("suppressCookingFishSummary") && title == "COOKING RESULTS" && image_path === "images/ancient_oven.png") {
                    return;
                }
                // Boat already out in the ocean. OR statement optimistically guarding against a break caused by correcting grammar
                if (this.getConfig("suppressCookingFishSummary") && (message == "You're boat is already out in the ocean!" || message == "Your boat is already out in the ocean!") && image_path === "images/warning.png") {
                    return;
                }

                // Click on a woodcutting patch that has no tree
                if (this.getConfig("suppressTreePopup") && (message == "A tree can start growing here at any moment.") && image_path === "images/woodcutting.png") {
                    return;
                }

                // Forward all other basic modals. We do not want to block all of these as many are critical pieces of UI (quests, potion drinking etc).
                openImageModalOriginal(title, image_path, message, primary_button_text, secondary_button_text, command, force_unclosable);
            }
        }
    }

    const plugin = new UnwantedPopupSuppressorPlugin();
    IdlePixelPlus.registerPlugin(plugin);

})();