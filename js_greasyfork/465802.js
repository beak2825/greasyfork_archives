// ==UserScript==
// @name         WME Switch Environment
// @description  Switch between Prod and Beta
// @namespace    https://greasyfork.org/users/gad_m/wme_switch_environment
// @version      1.0.8
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_openInTab
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCeRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgExAAIAAAAeAAAAWodpAAQAAAABAAAAeAAAAAAAAABIAAAAAQAAAEgAAAABQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykAAAKgAgAEAAAAAQAAAECgAwAEAAAAAQAAAEAAAAAA/+EK/Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3ODhBMkEyNUQwMjUxMUU3QTBBRUM4NzlCNjJCQUIxRCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3ODhBMkEyNkQwMjUxMUU3QTBBRUM4NzlCNjJCQUIxRCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjc4OEEyQTIzRDAyNTExRTdBMEFFQzg3OUI2MkJBQjFEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjc4OEEyQTI0RDAyNTExRTdBMEFFQzg3OUI2MkJBQjFEIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz4A/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/iEaxJQ0NfUFJPRklMRQABAQAAEZxhcHBsAgAAAG1udHJHUkFZWFlaIAfcAAgAFwAPAC4AD2Fjc3BBUFBMAAAAAG5vbmUAAAAAAAAAAAAAAAAAAAAAAAD21gABAAAAANMtYXBwbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWRlc2MAAADAAAAAeWRzY20AAAE8AAAIGmNwcnQAAAlYAAAAI3d0cHQAAAl8AAAAFGtUUkMAAAmQAAAIDGRlc2MAAAAAAAAAH0dlbmVyaWMgR3JheSBHYW1tYSAyLjIgUHJvZmlsZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABtbHVjAAAAAAAAAB8AAAAMc2tTSwAAAC4AAAGEZGFESwAAADoAAAGyY2FFUwAAADgAAAHsdmlWTgAAAEAAAAIkcHRCUgAAAEoAAAJkdWtVQQAAACwAAAKuZnJGVQAAAD4AAALaaHVIVQAAADQAAAMYemhUVwAAABoAAANMa29LUgAAACIAAANmbmJOTwAAADoAAAOIY3NDWgAAACgAAAPCaGVJTAAAACQAAAPqcm9STwAAACoAAAQOZGVERQAAAE4AAAQ4aXRJVAAAAE4AAASGc3ZTRQAAADgAAATUemhDTgAAABoAAAUMamFKUAAAACYAAAUmZWxHUgAAACoAAAVMcHRQTwAAAFIAAAV2bmxOTAAAAEAAAAXIZXNFUwAAAEwAAAYIdGhUSAAAADIAAAZUdHJUUgAAACQAAAaGZmlGSQAAAEYAAAaqaHJIUgAAAD4AAAbwcGxQTAAAAEoAAAcuYXJFRwAAACwAAAd4cnVSVQAAADoAAAekZW5VUwAAADwAAAfeAFYBYQBlAG8AYgBlAGMAbgDhACAAcwBpAHYA4QAgAGcAYQBtAGEAIAAyACwAMgBHAGUAbgBlAHIAaQBzAGsAIABnAHIA5QAgADIALAAyACAAZwBhAG0AbQBhAC0AcAByAG8AZgBpAGwARwBhAG0AbQBhACAAZABlACAAZwByAGkAcwBvAHMAIABnAGUAbgDoAHIAaQBjAGEAIAAyAC4AMgBDHqUAdQAgAGgA7ABuAGgAIABNAOAAdQAgAHgA4QBtACAAQwBoAHUAbgBnACAARwBhAG0AbQBhACAAMgAuADIAUABlAHIAZgBpAGwAIABHAGUAbgDpAHIAaQBjAG8AIABkAGEAIABHAGEAbQBhACAAZABlACAAQwBpAG4AegBhAHMAIAAyACwAMgQXBDAEMwQwBDsETAQ9BDAAIABHAHIAYQB5AC0EMwQwBDwEMAAgADIALgAyAFAAcgBvAGYAaQBsACAAZwDpAG4A6QByAGkAcQB1AGUAIABnAHIAaQBzACAAZwBhAG0AbQBhACAAMgAsADIAwQBsAHQAYQBsAOEAbgBvAHMAIABzAHoA/AByAGsAZQAgAGcAYQBtAG0AYQAgADIALgAykBp1KHBwlo5RSV6mADIALgAygnJfaWPPj/DHfLwYACDWjMDJACCsELnIACAAMgAuADIAINUEuFzTDMd8AEcAZQBuAGUAcgBpAHMAawAgAGcAcgDlACAAZwBhAG0AbQBhACAAMgAsADIALQBwAHIAbwBmAGkAbABPAGIAZQBjAG4A4QAgAWEAZQBkAOEAIABnAGEAbQBhACAAMgAuADIF0gXQBd4F1AAgBdAF5AXVBegAIAXbBdwF3AXZACAAMgAuADIARwBhAG0AYQAgAGcAcgBpACAAZwBlAG4AZQByAGkAYwEDACAAMgAsADIAQQBsAGwAZwBlAG0AZQBpAG4AZQBzACAARwByAGEAdQBzAHQAdQBmAGUAbgAtAFAAcgBvAGYAaQBsACAARwBhAG0AbQBhACAAMgAsADIAUAByAG8AZgBpAGwAbwAgAGcAcgBpAGcAaQBvACAAZwBlAG4AZQByAGkAYwBvACAAZABlAGwAbABhACAAZwBhAG0AbQBhACAAMgAsADIARwBlAG4AZQByAGkAcwBrACAAZwByAOUAIAAyACwAMgAgAGcAYQBtAG0AYQBwAHIAbwBmAGkAbGZukBpwcF6mfPtlcAAyAC4AMmPPj/Blh072TgCCLDCwMOwwpDCsMPMw3gAgADIALgAyACAw1zDtMNUwoTCkMOsDkwO1A70DuQO6A8wAIAOTA7oDwQO5ACADkwOsA7wDvAOxACAAMgAuADIAUABlAHIAZgBpAGwAIABnAGUAbgDpAHIAaQBjAG8AIABkAGUAIABjAGkAbgB6AGUAbgB0AG8AcwAgAGQAYQAgAEcAYQBtAG0AYQAgADIALAAyAEEAbABnAGUAbQBlAGUAbgAgAGcAcgBpAGoAcwAgAGcAYQBtAG0AYQAgADIALAAyAC0AcAByAG8AZgBpAGUAbABQAGUAcgBmAGkAbAAgAGcAZQBuAOkAcgBpAGMAbwAgAGQAZQAgAGcAYQBtAG0AYQAgAGQAZQAgAGcAcgBpAHMAZQBzACAAMgAsADIOIw4xDgcOKg41DkEOAQ4hDiEOMg5ADgEOIw4iDkwOFw4xDkgOJw5EDhsAIAAyAC4AMgBHAGUAbgBlAGwAIABHAHIAaQAgAEcAYQBtAGEAIAAyACwAMgBZAGwAZQBpAG4AZQBuACAAaABhAHIAbQBhAGEAbgAgAGcAYQBtAG0AYQAgADIALAAyACAALQBwAHIAbwBmAGkAaQBsAGkARwBlAG4AZQByAGkBDQBrAGkAIABHAHIAYQB5ACAARwBhAG0AbQBhACAAMgAuADIAIABwAHIAbwBmAGkAbABVAG4AaQB3AGUAcgBzAGEAbABuAHkAIABwAHIAbwBmAGkAbAAgAHMAegBhAHIAbwFbAGMAaQAgAGcAYQBtAG0AYQAgADIALAAyBjoGJwZFBicAIAAyAC4AMgAgBkQGSAZGACAGMQZFBicGLwZKACAGOQYnBkUEHgQxBEkEMARPACAEQQQ1BEAEMARPACAEMwQwBDwEPAQwACAAMgAsADIALQQ/BEAEPgREBDgEOwRM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
// @downloadURL https://update.greasyfork.org/scripts/465802/WME%20Switch%20Environment.user.js
// @updateURL https://update.greasyfork.org/scripts/465802/WME%20Switch%20Environment.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function() {

    'use strict';
    console.info('wme-switch-environment: loaded');

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isInitialized']) {
        console.debug('wme-switch-environment: WME is initialized.');
        init();
    } else {
        console.debug('wme-switch-environment: WME is not initialized. adding event listener.');
        document.addEventListener("wme-logged-in", init, {
            once: true,
        });
    }

    function init() {
        console.debug('wme-switch-environment: init()');
        addUI();
        addSaveEvent();
    }

    function addUI() {
        addSwitchButton();
        addSwitchClickEvent();
    }

    function addSaveEvent() {
        console.debug('wme-switch-environment: addSaveEvent()...');
        waitForElementConnected("#save-button", 10000).then((saveButton) => {
            jQuery(saveButton).on('click', () => {
                console.debug("wme-switch-environment: 'Save' button clicked...");
                addUI();
            });
        });
    }

    function addSwitchButton() {
        console.debug('wme-switch-environment: addSwitchButton()...');
        waitForElementConnected(".reload-button", 10000).then((reloadButton) => {
            let exiting = jQuery(".switch-button").length;
            if (!exiting) {
                let buttonsContainer = jQuery(".overlay-buttons-container.top");
                let clonedButton = jQuery(reloadButton).clone();
                clonedButton.removeClass('reload-button');
                clonedButton.addClass('switch-button');
                clonedButton.removeAttr('disabled');
                let iconI = jQuery(clonedButton).find("i.w-icon.w-icon-refresh");
                iconI.removeClass('w-icon-refresh');
                iconI.text("β");
                iconI.css("padding-bottom", "10px");
                buttonsContainer.append(clonedButton);
                console.debug('wme-switch-environment: addSwitchButton() done.');
            } else {
                console.debug('wme-switch-environment: addSwitchButton() button exits.');
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function addSwitchClickEvent() {
        console.debug('wme-switch-environment: addSwitchClickEvent()...');
        waitForElementConnected(".switch-button").then((element) => {
            let switchButton = jQuery(element);
            switchButton.attr('title', 'Switch Prod/Beta with current permalink');
            switchButton.on('click', switchButtonClicked);
            console.debug('wme-switch-environment: addSwitchClickEvent() done.');
            return false;
        }).catch((error) => {
            console.error(error);
        });
    }

    function switchButtonClicked(evt) {
        console.debug('wme-switch-environment: switchButtonClicked() switch button clicked');
        let permalink = jQuery(".permalink");
        let href = (permalink && permalink[0])?permalink[0].getAttribute("href"):null;
        href = enrichWithLayersBitmask(href);
        console.info('wme-switch-environment: switchButtonClicked() setting browser URL to: ' + href);
        href = switchEvn(href);
        if (evt && evt.shiftKey) {
            window.open(href);
        } else if (evt && (evt.metaKey || evt.shiftKey)) {
            GM_openInTab(href);
        } else {
            document.location = href;
        }
    }

    function switchEvn(url) {
        if (url.startsWith("https://www.waze.com")) {
            return url.replace("https://www.waze.com", "https://beta.waze.com");
        } else if (url.startsWith("https://beta.waze.com")) {
            return url.replace("https://beta.waze.com", "https://www.waze.com");
        } else {
            console.info('wme-switch-environment: switchEvn() invalid URL: ' + url + "'");
        }
    }

    function enrichWithLayersBitmask(href) {
        console.debug('wme-switch-environment: enrichWithLayersBitmask() href: ' + href);
        if (href) {
            let hasLayersBitmask = getLayersBitmask(href);
            if (!hasLayersBitmask) {
                let layersBitmask = W.map.getLayersBitmask();
                console.debug('wme-switch-environment: enrichWithLayersBitmask() adding LayersBitmask: ' + layersBitmask);
                href += "&s=" + layersBitmask;
            } else {
                console.debug('wme-switch-environment: enrichWithLayersBitmask() no need to add LayersBitmask');
            }
        }
        console.debug('wme-switch-environment: enrichWithLayersBitmask() returning: ' + href);
        return href;
    }

    function getLayersBitmask(href) {
        let urlSearchParams = new URLSearchParams(href);
        return urlSearchParams.get('s');
    }

    function waitForElementConnected(selector, timeout = 5000) {
        console.debug("wme-switch-environment: waitForElementConnected() selector: '" + selector + "'...");
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element && document.body.contains(element)) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element && document.body.contains(element)) {
                    resolve(element);
                    obs.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error("wme-switch-environment: Element '" + selector + "' not found within the timeout period"));
            }, timeout);
        });
    }

}.call(this));