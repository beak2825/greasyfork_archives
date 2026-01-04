// ==UserScript==
// @name         Increase desktop switcher padding
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Increases padding around desktop switch button in header
// @author       cookctorn
// @match        https://www.torn.com/*
// @require      https://greasyfork.org/scripts/48306-waitforkeyelements/code/waitForKeyElements.js?version=275769
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390558/Increase%20desktop%20switcher%20padding.user.js
// @updateURL https://update.greasyfork.org/scripts/390558/Increase%20desktop%20switcher%20padding.meta.js
// ==/UserScript==

const desktopSwitchButton = '.top_header_link.desktop-version';
waitForKeyElements(desktopSwitchButton, function () {
    $(desktopSwitchButton).css('padding-left', '20px');
    $(desktopSwitchButton).css('padding-right', '20px');
});

