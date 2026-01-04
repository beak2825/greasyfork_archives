// ==UserScript==
// @name         AoG Notifications
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Notification script for Arena of Glory
// @author       Xortrox
// @match        https://play.arenaofglory.io/*
// @icon         https://play.arenaofglory.io/favicon.ico
// @grant        none
// @license MIT
// @require      https://greasyfork.org/scripts/438798-userscript-notification-framework/code/UserScript%20Notification%20Framework.js?v=0.3
// @require      https://greasyfork.org/scripts/438801-userscript-automated-element-text-notifier/code/UserScript%20Automated%20Element%20Text%20Notifier.js?v=0.7
// @downloadURL https://update.greasyfork.org/scripts/438754/AoG%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/438754/AoG%20Notifications.meta.js
// ==/UserScript==

(async function() {
    const scanConfig = [{
        includes: ['claim'],
        excludes: ['claimed'],
        notificationText: 'You have at least one adventure to claim'
    }, {
        includes: ['reload adventures'],
        notificationText: 'You can reload adventures'
    }];

    const automatedElementTextNotifier = new AutomatedElementTextNotifier({
        icon: 'https://play.arenaofglory.io/favicon.ico',
        title: 'Arena of Glory',
        selector: '.button label',
        config: scanConfig,
        interval: 60000,
    });

    await automatedElementTextNotifier.init();
})();
