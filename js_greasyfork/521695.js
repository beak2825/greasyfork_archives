// ==UserScript==
// @name         IC Block with regex
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Block Item Creation with RegEx
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521695/IC%20Block%20with%20regex.user.js
// @updateURL https://update.greasyfork.org/scripts/521695/IC%20Block%20with%20regex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (window.AT ||= {}).regexblockdata = {
        trashcan: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGZpbGw9IiMwMDAwMDAiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDI1NiAyNTYiIGlkPSJGbGF0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0yMDIuODI4NjEsMTk3LjE3MTg4YTMuOTk5OTEsMy45OTk5MSwwLDEsMS01LjY1NzIyLDUuNjU2MjRMMTI4LDEzMy42NTcyMyw1OC44Mjg2MSwyMDIuODI4MTJhMy45OTk5MSwzLjk5OTkxLDAsMCwxLTUuNjU3MjItNS42NTYyNEwxMjIuMzQzLDEyOCw1My4xNzEzOSw1OC44MjgxMmEzLjk5OTkxLDMuOTk5OTEsMCwwLDEsNS42NTcyMi01LjY1NjI0TDEyOCwxMjIuMzQyNzdsNjkuMTcxMzktNjkuMTcwODlhMy45OTk5MSwzLjk5OTkxLDAsMCwxLDUuNjU3MjIsNS42NTYyNEwxMzMuNjU3LDEyOFoiLz4KPC9zdmc+",
        infinitecraft: null,
        settingsButton: null,
        settings: {
            resultRegEx: /^$/,
            isNew: false,
            isKindaNew: false
        },
        addUiOption: function () {
            try{
                this.settingsButton = document.createElement('div');
                this.settingsButton.classList.add('setting');
                this.settingsButton.textContent = 'Create Conditions';
                const img = document.createElement('img');
                img.src = this.trashcan;
                this.settingsButton.appendChild(img);
                this.settingsButton.onclick = function () {
                    alert("Current settings:\n" + JSON.stringify(window.AT.regexblockdata.settings));
                    const regexInput = prompt("Please enter RegEx of results to be blocked:");
                    if (regexInput) {
                        try {
                            const regexPattern = new RegExp(regexInput);
                            window.AT.regexblockdata.settings.resultRegEx = regexPattern;
                        } catch (e) {
                            alert('Invalid regex.');
                        }
                    }
                    const firstYesNo = prompt("Should first discoveries also be blocked? Type in true exactly if yes.");
                    window.AT.regexblockdata.settings.isNew = firstYesNo.toLowerCase() === 'true';
                    const secondYesNo = prompt("Should items YOU didnt have yet also be blocked? Type in true exactly if yes.");
                    window.AT.regexblockdata.settings.isKindaNew = secondYesNo.toLowerCase() === 'true';
                    alert("Updated settings:\n" + JSON.stringify(window.AT.regexblockdata.settings))
                };

                document.querySelector('.settings-content').appendChild(this.settingsButton);
                return true;
            } catch {
                return false;
            }
        },
        start: function () {
            if (document.querySelector('.settings-content')) { // Wait for IC Helper
                this.infinitecraft = window.$nuxt.$root.$children[1].$children[0].$children[0];
                this.addUiOption();
                const ogGCR = this.infinitecraft.getCraftResponse
                this.infinitecraft.getCraftResponse = async function (first, second) {
                    const craftResponse = await ogGCR(first, second);
                    let shouldNothing = false;
                    if (window.AT.regexblockdata.settings.resultRegEx.test(craftResponse.result)){
                        shouldNothing = true;
                    }
                    if (window.AT.regexblockdata.settings.resultRegEx.test(craftResponse.result) && !window.AT.regexblockdata.settings.isNew && !window.AT.regexblockdata.settings.isKindaNew) {
                        craftResponse.result = "Nothing";
                    } else if (window.AT.regexblockdata.settings.isNew === craftResponse.isNew) {
                        shouldNothing = false;
                    } else if (window.AT.regexblockdata.settings.isKindaNew) {
                        for (let n = 0; n < this.elements.length; n++) {
                            if (craftResponse.result === this.elements[n].text) {
                                shouldNothing = false;
                                break;
                            }
                        }
                    }
                    if(shouldNothing){
                        craftResponse.result = "Nothing";
                    }
                    // console.log(craftResponse);
                    return craftResponse;
                }
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.regexblockdata.start();

})();