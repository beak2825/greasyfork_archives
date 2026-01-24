// ==UserScript==
// @name         Merge++
// @namespace    http://tampermonkey.net/
// @version      2.19
// @description  Best and only free Farm Merge Valley script
// @author       vk.com/downcasted
// @match        *://1187013846746005515.discordsays.com/*
// @match        *://farm-merge-valley.game-files.crazygames.com/farm-merge-valley/*
// @match        *://*.devvit.net/*
// @icon         https://files.catbox.moe/d5dxaj.png
// @discord      https://discord.gg/PtF4maDP9D
// @license      GPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506276/Merge%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/506276/Merge%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const { hostname, pathname } = location;

    const isFMV =
          hostname === '1187013846746005515.discordsays.com' ||
          (hostname === 'farm-merge-valley.game-files.crazygames.com' &&
           pathname.startsWith('/farm-merge-valley')) ||
          /^playfmv-[^.]+\.devvit\.net$/i.test(hostname);

    if (!isFMV) return;

    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
        this._url = url;
        return originalOpen.call(this, method, url, ...args);
    };

    XMLHttpRequest.prototype.send = function(data) {
        const xhr = this;
        if (this._url && this._url.includes("jsonpack")) {
            const originalDesc = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
            Object.defineProperty(xhr, 'responseText', {
                get: function() {
                    const original = originalDesc.get.call(this);

                    if (this.readyState === 4 && original) {
                        try {
                            const jsonpack = JSON.parse(original);
                            console.log('Original jsonpack:', jsonpack);

                            if (jsonpack.lucky_merge_config) {
                                jsonpack.lucky_merge_config.CHANCE = 100;
                            }

                            if (jsonpack.crate_regeneration_config) {
                                jsonpack.crate_regeneration_config.MAX_AMOUNT = 100;
                                jsonpack.crate_regeneration_config.AMOUNT_PER_INTERVAL = 100;
                                jsonpack.crate_regeneration_config.SPAWN_INTERVAL = 1;
                            }

                            if (jsonpack.energy_regeneration_config) {
                                jsonpack.energy_regeneration_config.MAX_AMOUNT = 100;
                                jsonpack.energy_regeneration_config.AMOUNT_PER_INTERVAL = 100;
                                jsonpack.energy_regeneration_config.SPAWN_INTERVAL = 1;
                            }

                            if (jsonpack.marketplace_items_config) {
                                const shop = jsonpack.marketplace_items_config;
                                for (const item in shop.items) {
                                    let itemrec = shop.items[item];
                                    if (itemrec.payment.type == "iap") {
                                        itemrec.payment = {type: "inventory", key: "gems", amount: 0};
                                    } else {
                                        itemrec.payment.amount = 0;
                                    }

                                    if (itemrec.id == "energy_80") {
                                        itemrec.reward.data.key = "coins";
                                        itemrec.reward.data.amount = 1200;
                                    } else if (itemrec.id == "gems_3500") {
                                        itemrec.image = "bg_marketplace_fb_blackfriday03";
                                        itemrec.reward.data.key = "gems";
                                        itemrec.reward.data.amount = 3500;
                                    }
                                }
                            }
                            if (jsonpack.blueprints_index && jsonpack.blueprints_index.blueprints) {
                                for (const key in jsonpack.blueprints_index.blueprints) {
                                    const blueprint = jsonpack.blueprints_index.blueprints[key];
                                    if (blueprint && typeof blueprint === 'object' && blueprint.components) {
                                        if (blueprint.id && !blueprint.components.shovelable) {
                                            blueprint.components.shovelable = {};
                                        }
                                    }
                                }
                            }
                            return JSON.stringify(jsonpack);

                        } catch (e) {
                            return original;
                        }
                    }
                    return original;
                },
                configurable: true
            });

            Object.defineProperty(xhr, 'response', {
                get: function() {
                    return this.responseText;
                },
                configurable: true
            });
        }

        return originalSend.call(this, data);
    };
})();