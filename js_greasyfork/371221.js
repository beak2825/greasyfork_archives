// ==UserScript==
// @name         Vote Reminder
// @namespace    https://vota.arenacraft.it
// @version      1.0
// @description  Vote Reminder ArenaCraft
// @match        *://*/*
// @grant        GM_notification
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/371221/Vote%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/371221/Vote%20Reminder.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
    var lastReminderDay = GM_getValue('lastReminderDay', 0);
    var lastReminderMillis = GM_getValue('lastReminderMillis', 0);
    var currentDate = new Date();
    var currentDay = currentDate.getDate();
    var currentMillis = currentDate.getTime();

    if (currentDay != lastReminderDay && currentMillis - lastReminderMillis > 5 * 60 * 1000) {
        GM_setValue('lastReminderMillis', currentMillis);
        GM_notification({
            text: 'Ricordati di votare su Minecraft-ITALIA! Clicca per aprire la pagina e disattivare la notifica.',
            title: 'ArenaCraft',
            image: 'https://www.minecraft-italia.it/media/server/logo/915e9c8b098901a1a46732a6bd52c871.png',
            onclick: function() {
                GM_openInTab('https://vota.arenacraft.it', {active: true});
                GM_setValue('lastReminderDay', currentDay);
            },
        });
    }
});