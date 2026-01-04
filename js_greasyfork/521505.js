// ==UserScript==
// @name         IC Instance Restore on Ctrl + Z
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @license      MIT
// @description  Undo a craft with Ctrl + Z and redo with Ctrl + Y
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521505/IC%20Instance%20Restore%20on%20Ctrl%20%2B%20Z.user.js
// @updateURL https://update.greasyfork.org/scripts/521505/IC%20Instance%20Restore%20on%20Ctrl%20%2B%20Z.meta.js
// ==/UserScript==

(function () {
    'use strict';

    (window.AT ||= {}).controlzdata = {
        ingredientInstances: {
            deletedInstances: [],
            InstanceIds: []
        },
        resultInstances: {
            deletedInstances: [],
            InstanceIds: []
        },
        infinitecraft: null,

        processInstance: function (instanceCopy) {
            if (instanceCopy.isNew) {
                instanceCopy.isNew = false;
            }
        },

        updateIds: function (oldId, newId) {
            const replaceId = (list) => {
                for (let pair of list) {
                    const index = pair.indexOf(oldId);
                    if (index !== -1) {
                        pair[index] = newId;
                    }
                }
            };

            replaceId(this.resultInstances.InstanceIds);
            replaceId(this.ingredientInstances.InstanceIds);
        },

        deleteInstance: function (id) {
            const instances = this.infinitecraft.instances;
            const index = instances.findIndex(instance => instance.id === id);

            if (index !== -1) {
                const deletedInstance = { ...instances[index] };
                instances.splice(index, 1);
                return deletedInstance; // Return deleted instance
            }
            return null;
        },

        makeInstance: function (instanceCopy) {
            this.processInstance(instanceCopy); // Remove pinwheel and therefore also the pinwheel glitch

            const newInstance = Object.assign({}, instanceCopy);
            newInstance.id = this.infinitecraft.instanceId++;
            newInstance.elem = null;
            newInstance.hasMoved = false;
            newInstance.fromPanel = false;
            newInstance.disabled = false;
            this.infinitecraft.instances.push(newInstance);

            this.infinitecraft.$nextTick(() => {
                newInstance.elem = document.getElementById("instance-" + newInstance.id);
                if (newInstance.elem) {
                    this.infinitecraft.setInstancePosition(newInstance, newInstance.left, newInstance.top);
                    this.infinitecraft.setInstanceZIndex(newInstance, this.infinitecraft.instanceId);
                }
            });

            if (newInstance) {
                this.updateIds(instanceCopy.id, newInstance.id);
            }

            return newInstance ? newInstance.id : null; // Return id of recreated instance
        },

        restoreInstances: function () {
            if (this.ingredientInstances.deletedInstances.length > 0) {
                const instancePair = this.ingredientInstances.deletedInstances.pop();
                const [instanceA, instanceB] = instancePair;

                const instanceAId = this.makeInstance(instanceA); // Reinstate ingredients
                const instanceBId = this.makeInstance(instanceB);

                if (instanceAId && instanceBId) {
                    this.ingredientInstances.InstanceIds.push([instanceAId, instanceBId]);
                }

                const resultInstanceId = this.resultInstances.InstanceIds.pop()?.[0];
                if (resultInstanceId) {
                    const deletedInstance = this.deleteInstance(resultInstanceId); // Delete result instance
                    if (deletedInstance) {
                        this.resultInstances.deletedInstances.push(deletedInstance);
                    }
                }
            }
        },

        unrestoreInstances: function () {
            if (this.ingredientInstances.InstanceIds.length > 0) {
                const lastRestoredIds = this.ingredientInstances.InstanceIds.pop();
                const [instanceAId, instanceBId] = lastRestoredIds;

                const instanceA = this.deleteInstance(instanceAId); // Delete ingredient instances
                const instanceB = this.deleteInstance(instanceBId);

                if (instanceA && instanceB) {
                    this.ingredientInstances.deletedInstances.push([instanceA, instanceB]);
                }

                if (this.resultInstances.deletedInstances.length > 0) {
                    const deletedInstance = this.resultInstances.deletedInstances.pop();
                    const newInstanceId = this.makeInstance(deletedInstance); // Make result instances
                    if (newInstanceId) {
                        this.resultInstances.InstanceIds.push([newInstanceId]);
                    }
                }
            }
        },

        start: function () {
            if (document.querySelector(".container").__vue__) { // Wait for Nuxt

                this.infinitecraft = document.querySelector(".container").__vue__; // Assign Infinite Craft
                const ogGCR = this.infinitecraft.getCraftResponse;
                this.infinitecraft.getCraftResponse = async function (instanceA, instanceB) { // Patch getCraftResponse to intercept and save stuff
                    const response = await ogGCR.apply(this, arguments);

                    if (instanceA.elem && instanceB.elem) { // Used to detect if it's used through GUI or console
                        window.AT.controlzdata.ingredientInstances.deletedInstances.push([{ ...instanceA }, { ...instanceB }]);
                        window.AT.controlzdata.resultInstances.InstanceIds.push([this.instanceId]);
                        window.AT.controlzdata.resultInstances.deletedInstances = [];
                        window.AT.controlzdata.ingredientInstances.InstanceIds = [];
                    }

                    return response;
                };

                document.addEventListener("keydown", function (event) { // To make the script actually do something
                    if (event.ctrlKey && event.key === "z") {
                        window.AT.controlzdata.restoreInstances();
                    }
                    if (event.ctrlKey && event.key === "y") {
                        window.AT.controlzdata.unrestoreInstances();
                    }
                });
            } else {
                setTimeout(this.start.bind(this), 2000); // Change the timeout if it still conflicts with other scripts
            }
        }
    };

    window.AT.controlzdata.start();
})();
