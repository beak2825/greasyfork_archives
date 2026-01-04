// ==UserScript==
// @name         WME Reload - Refresh
// @description  Make the refresh button to refresh the browser
// @namespace    https://greasyfork.org/users/gad_m/wme_reload_refresh
// @version      1.0.10
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @grant        GM_openInTab
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/456488/WME%20Reload%20-%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/456488/WME%20Reload%20-%20Refresh.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function() {

    'use strict';
    console.info('wme-reload-refresh: loaded');

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isInitialized']) {
        console.debug('wme-reload-refresh: WME is initialized.');
        init();
    } else {
        console.debug('wme-reload-refresh: WME is not initialized. adding event listener.');
        document.addEventListener("wme-logged-in", init, {
            once: true,
        });
    }

    function init() {
        console.debug('wme-reload-refresh: init()');
        addUI();
        addSaveEvent();
    }

    function addUI() {
        console.debug('wme-reload-refresh: addUI()');
        addRefreshButton();
        addReloadClickEvent();
    }

    function addSaveEvent() {
        console.debug('wme-reload-refresh: addSaveEvent()...');
        waitForElementConnected("#save-button", 10000).then((saveButton) => {
            jQuery(saveButton).on('click', () => {
                console.debug("wme-reload-refresh: 'Save' button clicked...");
                addUI();
            });
        });
    }

    function addRefreshButton() {
        console.debug('wme-reload-refresh: addRefreshButton()...');
        waitForElementConnected(".reload-button", 10000).then((reloadButton) => {
            let exiting = jQuery("#reload-refresh-button").length;
            if (!exiting) {
                let buttonsContainer = jQuery(".overlay-buttons-container.top");
                let clonedButton = jQuery(reloadButton).clone();
                clonedButton.removeClass('reload-button');
                clonedButton.addClass('refresh-button');
                clonedButton.attr("id", "reload-refresh-button");
                clonedButton.removeAttr('disabled');
                buttonsContainer.append(clonedButton);
                console.debug('wme-reload-refresh: addRefreshButton() done.');
            } else {
                console.debug('wme-reload-refresh: addRefreshButton() button exits.');
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    function addReloadClickEvent() {
        console.debug('wme-reload-refresh: addReloadClickEvent()...');
        waitForElementConnected("#reload-refresh-button").then((element) => {
            let reloadRefreshButton = jQuery(element);
            reloadRefreshButton.attr('title', 'Refresh browser with current permalink');
            reloadRefreshButton.on('click', refreshButtonClicked);
            console.debug('wme-reload-refresh: addReloadClickEvent() done.');
            return false;
        }).catch((error) => {
            console.error(error);
        });
    }

    function refreshButtonClicked(evt) {
        console.debug('wme-reload-refresh: refreshButtonClicked() refresh button clicked');
        let permalink = jQuery(".permalink");
        let href = (permalink && permalink[0])?permalink[0].getAttribute("href"):null;
        href = enrichWithLayersBitmask(href);
        console.info('wme-reload-refresh: refreshButtonClicked() setting browser URL to: ' + href);
        if (evt && evt.shiftKey) {
            window.open(href);
        } else if (evt && (evt.metaKey || evt.shiftKey)) {
            GM_openInTab(href);
        } else {
            document.location = href;
        }
    }

    function enrichWithLayersBitmask(href) {
        console.debug('wme-reload-refresh: enrichWithLayersBitmask() href: ' + href);
        if (href) {
            let hasLayersBitmask = getLayersBitmask(href);
            if (!hasLayersBitmask) {
                let layersBitmask = W.map.getLayersBitmask();
                console.debug('wme-reload-refresh: enrichWithLayersBitmask() adding LayersBitmask: ' + layersBitmask);
                href += "&s=" + layersBitmask;
            } else {
                console.debug('wme-reload-refresh: enrichWithLayersBitmask() no need to add LayersBitmask');
            }
        }
        console.debug('wme-reload-refresh: enrichWithLayersBitmask() returning: ' + href);
        return href;
    }

    function getLayersBitmask(href) {
        let urlSearchParams = new URLSearchParams(href);
        return urlSearchParams.get('s');
    }

    function waitForElementConnected(selector, timeout = 2000) {
        console.debug("wme-reload-refresh: waitForElementConnected() selector: '" + selector + "'...");
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
                reject(new Error("wme-reload-refresh: Element '" + selector + "' not found within the timeout period"));
            }, timeout);
        });
    }


}.call(this));