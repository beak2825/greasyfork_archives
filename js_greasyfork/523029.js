// ==UserScript==
// @name         IC Private Server
// @namespace    http://tampermonkey.net/
// @version      1.3
// @license      MIT
// @description  Hooks Infnite craft up to my private server
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523029/IC%20Private%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/523029/IC%20Private%20Server.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (window.AT ||= {}).privateserver = {
        infinitecraft: null,
        make: async function (item) {
            this.hasCrafted = true;

            if (item.disabled) {
                return;
            }

            this.removeCurrentHover();

            item.disabled = true;

            const response = await fetch(
                `https://dec7c21c0fdd68.lhr.life/api/infinite-craft/makealive.php?result=${encodeURIComponent(item.text)}`
            );
            const json = await response.json();

            if (json.result !== "Nothing") {
                const center = this.getCenterOfCraft(item, item); // Placeholder for center calculation

                const instanceId = this.instanceId++;

                const newInstance = {
                    id: instanceId,
                    text: json.result,
                    emoji: json.emoji,
                    disabled: false,
                    zIndex: instanceId,
                    discovered: json.isNew,
                };

                if (json.isNew) {
                    this.discoveries.push(json.result);
                }

                const element = this.elements.find(
                    (element) => element.text.toLowerCase() === newInstance.text.toLowerCase()
                );

                if (element) {
                    newInstance.text = element.text;
                    newInstance.emoji = element.emoji;
                    newInstance.discovered = element.discovered;
                }

                if (!element) {
                    this.elements.push({
                        text: newInstance.text,
                        emoji: newInstance.emoji,
                        discovered: json.isNew,
                    });

                    this.saveItems();

                    this.$nextTick(() => {
                        this.setPinwheelCoords(center);
                    });

                    newInstance.isNew = true;

                    if (json.isNew) {
                        this.discoverySound.play();
                    }

                    const rates = [0.9, 1];
                    this.rewardSound.rate(rates[Math.floor(Math.random() * rates.length)]);
                    this.rewardSound.play();

                    this.$setTimeout(() => {
                        newInstance.isNew = false;
                    }, 1200);
                } else {
                    this.playInstanceSound();
                }

                const itemIndex = this.instances.findIndex(
                    (instance) => instance.id === item.id
                );

                this.instances.splice(itemIndex, 1);

                this.instances.push(newInstance);

                this.$nextTick(() => {
                    this.calcInstanceSize(newInstance);

                    this.setInstancePosition(
                        newInstance,
                        center.x - newInstance.width / 2,
                        center.y - newInstance.height / 2
                    );

                    this.setInstanceZIndex(newInstance, instanceId);
                });
            } else {
                this.errorSound.play();
                item.disabled = false;
            }
        },
        start: function () {
            if (document.querySelector(".container").__vue__) { // Wait for Nuxt
                this.infinitecraft = document.querySelector(".container").__vue__;
                this.infinitecraft.make = this.make;
                const originalFetch = window.fetch;
                window.fetch = function (...args) {
                    if (args[0] && typeof args[0] === 'string') {
                        args[0] = args[0].replace('neal.fun/api/infinite-craft/pair?', 'dec7c21c0fdd68.lhr.life/api/infinite-craft/pair.php?');
                    }
                    return originalFetch.apply(this, args);
                };
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.privateserver.start();
})();
