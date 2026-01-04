// ==UserScript==
// @name         IC Delete with regex
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      MIT
// @description  Delete Items with RegEx
// @icon         https://i.imgur.com/WlkWOkU.png
// @author       @activetutorial on discord
// @match        https://neal.fun/infinite-craft/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521691/IC%20Delete%20with%20regex.user.js
// @updateURL https://update.greasyfork.org/scripts/521691/IC%20Delete%20with%20regex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (window.AT ||= {}).regexdeletedata = {
        infinitecraft: null,
        settingsButton: null,
        trashcan: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgR2VuZXJhdG9yOiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIGZpbGw9IiMwMDAwMDAiIHZlcnNpb249IjEuMSIgaWQ9IkNhcGFfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgDQoJIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDQ5MC42NDYgNDkwLjY0NiINCgkgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTM5OS4xNzksNjcuMjg1bC03NC43OTQsMC4wMzNMMzI0LjM1NiwwTDE2Ni4yMTQsMC4wNjZsMC4wMjksNjcuMzE4bC03NC44MDIsMC4wMzNsMC4wMjUsNjIuOTE0aDMwNy43MzlMMzk5LjE3OSw2Ny4yODV6DQoJCQkgTTE5OC4yOCwzMi4xMWw5NC4wMy0wLjA0MWwwLjAxNywzNS4yNjJsLTk0LjAzLDAuMDQxTDE5OC4yOCwzMi4xMXoiLz4NCgkJPHBhdGggZD0iTTkxLjQ2NSw0OTAuNjQ2aDMwNy43MzlWMTQ2LjM1OUg5MS40NjVWNDkwLjY0NnogTTMxNy40NjEsMTkzLjM3MmgxNi4wMjh2MjUwLjI1OWgtMTYuMDI4VjE5My4zNzJMMzE3LjQ2MSwxOTMuMzcyeg0KCQkJIE0yMzcuMzIxLDE5My4zNzJoMTYuMDI4djI1MC4yNTloLTE2LjAyOFYxOTMuMzcyTDIzNy4zMjEsMTkzLjM3MnogTTE1Ny4xOCwxOTMuMzcyaDE2LjAyOHYyNTAuMjU5SDE1Ny4xOFYxOTMuMzcyeiIvPg0KCTwvZz4NCjwvZz4NCjwvc3ZnPg==",
        addUiOption: function () {
            try{
                this.settingsButton = document.createElement('div');
                this.settingsButton.classList.add('setting');
                this.settingsButton.textContent = 'Delete with RegEx';
                const img = document.createElement('img');
                img.src = this.trashcan;
                this.settingsButton.appendChild(img);
                this.settingsButton.onclick = function () {
                    const regexInput = prompt("Make sure you have a backup and then enter a RegEx to delete:");
                    if (regexInput) {
                        try {
                            const regexPattern = new RegExp(regexInput);
                            for (let n = window.AT.regexdeletedata.infinitecraft.elements.length - 1; n >= 0; n--) {
                                const element = window.AT.regexdeletedata.infinitecraft.elements[n];
                                if (element.text && regexPattern.test(element.text)) {
                                    window.AT.regexdeletedata.infinitecraft.elements.splice(n, 1);
                                }
                            }
                            window.AT.regexdeletedata.infinitecraft.saveItems();
                        } catch (e) {
                            alert('Invalid regex or an error occurred.');
                        }
                    }
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
            } else {
                setTimeout(this.start.bind(this), 200);
            }
        }
    };
    window.AT.regexdeletedata.start();

})();