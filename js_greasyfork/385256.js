// ==UserScript==
// @name         WME Venue Link
// @description  Generates a link to selected venue
// @namespace    https://greasyfork.org/users/gad_m/wme_venue_link
// @version      0.2.12
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAJCSURBVDhPpVPbS5NxGH7aFpuhbSRtOc2CKCis/oBA08lwzA5DLIjqMugk03SeLrzoKgvNjBVkQyuwi4rAbiQ0F3WblJiHotqcc/StC6ud3d5+39vKkSsveu6+9/m9h+d5328NCeA/sGoBv38BnV29mJ6ZRVGhEbZD1bBazGl2lQLzIvm8vRmfJQkKhQKpVIrjpooydLQ7OKbgSBYkEgnYL7Ry8t49JRh+8gB9N3tQaCzAyKgbrv57Px/KE/wNY+4XVNfQQpFINB0h8njnqNx8kMzWGv5eMYGs+UxdIyotNjx8PITjx45Ao1GnWaB4cxE2GfQIhUIIBr9AsZThgKz5rN2BNxOTiEajeDX+GvWNbei+5kQymeQ3fa478M75kJebC51OC8Xbb0tMyMnnRLIkBVnz0KNBtDU3QKtdjzH3S0iim5zcf3cQSqUSLU12qFQq4L4vTGIUstWeoH37q0iMT4uLX8nR2kHCRJqanqFPHi/duj3AfKnJSsJE1i9DJcVScA642O3dJbtw5dJFhMMRLAQC+PDRg4nJKezYvo1lyZ3l9VWUl/LUDHkCy4Faru6b96frEjvf3eOksspq5kxVh2nk2fM0uwzVzry1fBAyNOplt2XnDcLt61c7EYvFsHVLMfLzN6TZDCRSRJe7erlLfVM7hcNhrvxLc83RkxSLxzmWDXzK38VOT52283p0Wi30+o2Yffc+u+Y/8PtfEJ3Fvm9g+Oko3/y6nBxe1b+SZaz4meLxuLiJAIwFBqgzPMkO4AePpoeoR06F6wAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/385256/WME%20Venue%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/385256/WME%20Venue%20Link.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */
/* global I18n */

(function() {

    function bootstrap(tries) {
        console.debug('wme-venue-link: bootstrap()');
        tries = tries || 1;
        if (typeof W !== 'undefined' && jQuery && W['selectionManager'] && W['selectionManager']['events']) {
            init();
        } else if (tries < 20) {
            setTimeout(function () { bootstrap(tries++); }, 500);
        } else {
            console.info('wme-venue-link: failed to load');
        }
    }

    bootstrap();

    function venueLinkSelectionChanged(event) {
        console.info('wme-venue-link: venueLinkSelectionChanged() ' + W['selectionManager'].getSelectedDataModelObjects().length);
        let found = false;
        if (W['selectionManager'].getSelectedDataModelObjects().length === 1) {
            W['selectionManager'].getSelectedDataModelObjects().forEach(function(element) {
                if (element.type === 'venue') {
                    drowVenueLink(element.attributes.id);
                    found = true;
                }
            });
        }
        if (!found) {
            let element = document.getElementById('wme_venue_link');
            if (element) {
                element.parentNode.removeChild(element);
            }
        }
    }

    function drowVenueLink(venueId) {
        waitForElement(".feature-panel-header-menu", function (venueMenu) {
            if (venueMenu.length === 1) {
                let menuItemId = "copy-venue-link";
                // delete existing one
                jQuery("#" + menuItemId).remove();
                let venueMenuItem = document.createElement("wz-menu-item");
                venueMenuItem.id = menuItemId;
                venueMenuItem.class = "feature-panel-header-menu-option";
                venueMenuItem.innerText = getI18nString(I18N_KEY_TEXT);
                venueMenuItem.title = getI18nString(I18N_KEY_TITLE);
                venueMenuItem.addEventListener('click', function (event) {
                    copyTextToClipboard('https://www.waze.com/ul?preview_venue_id=' + venueId);
                });
                let venueIcon = document.createElement("i");
                venueIcon.className = "w-icon w-icon-copy";
                venueMenuItem.insertBefore(venueIcon, venueMenuItem.firstChild);
                venueMenu[0].appendChild(venueMenuItem);
            } else {
                console.error('wme-venue-link: single .feature-panel-header-menu wz-menu not found');
            }
        });
    }

    function waitForElement(selector, cb, retry=20, timeout=50) {
        console.debug('wme-venue-link: waitForElement for element: \'' + selector + '\'. timeout=' + timeout + ' , retry=' + retry);
        let result = jQuery(selector)
        if (result.length) {
            cb(result);
        } else {
            setTimeout(function () {
                if (retry) {
                    waitForElement(selector, cb, --retry);
                } else {
                    console.error('wme-venue-link: waitForElement failed for element: \'' + selector + '\'. timeout=' + timeout + ' , retry=' + retry);
                }
            }, timeout);
        }
    }

    const I18N_KEY_TEXT = "MENU_ITEM_TEXT";
    const I18N_KEY_TITLE = "MENU_ITEM_TITLE";
    const I18N_STRINGS = {
        "he": {
            MENU_ITEM_TEXT: "\u05d4\u05e2\u05ea\u05e7 \u05e7\u05d9\u05e9\u05d5\u05e8",
            MENU_ITEM_TITLE: "\u05d4\u05e2\u05ea\u05e7 \u05e7\u05d9\u05e9\u05d5\u05e8 \u05d9\u05e9\u05d9\u05e8 \u05dc\u05e0\u05d9\u05d9\u05d3 \u05e9\u05dc \u05de\u05e7\u05d5\u05dd \u05d6\u05d4",
        },
        "en": {
            MENU_ITEM_TEXT: "Copy Link to Clipboard",
            MENU_ITEM_TITLE: "Copy to clipboard a mobile direct link to this venue",
        }
    }

    function getI18nString(key) {
        console.debug('wme-venue-link: getI18nString() for key: ' + key + ' with user locale: ' + I18n.locale);
        if (I18N_STRINGS[I18n.locale]) {
            return I18N_STRINGS[I18n.locale][key];
        } else {
            return I18N_STRINGS["en"][key];
        }
    }

    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text).then(function () {
            console.info('wme-venue-link: Async: Copying to clipboard was successful!');
        }, function (err) {
            console.error('wme-venue-link: Async: Could not copy text: ', err);
        });
    }

    function init() {
        console.info("wme-venue-link: init()");
        W['selectionManager']['events'].register("selectionchanged", null ,venueLinkSelectionChanged);
    } // end init()
}.call(this));