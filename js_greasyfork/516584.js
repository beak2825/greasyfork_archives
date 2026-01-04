// ==UserScript==
// @name         Credits-Verbandsrückmeldung
// @namespace    leeSalami.lss
// @version      1.1
// @license      MIT
// @description  Setzt eine Rückmeldung mit den zu verdienen Credits für geplante Einsätze.
// @author       leeSalami
// @match        https://*.leitstellenspiel.de/missions/*
// @downloadURL https://update.greasyfork.org/scripts/516584/Credits-Verbandsr%C3%BCckmeldung.user.js
// @updateURL https://update.greasyfork.org/scripts/516584/Credits-Verbandsr%C3%BCckmeldung.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const MISSION_REPLY_MESSAGE = '🚨__CREDITS__ Credits🚨'
    const CREDITS_THRESHOLD = 30_000;
    const SHORT_CREDITS = false;

    const guardMissionCountdown = document.getElementById('col_left')?.querySelector('span[id^="mission_countdown_"]');

    if (!guardMissionCountdown) {
        return;
    }

    const missionOwner = parseInt(document.querySelector('.alert.alert-info > a[href^="/profile/"]')?.getAttribute('href')?.replace(/[^0-9]/g, '') ?? 0);

    if (missionOwner) {
        return;
    }

    const missionReplyInput = document.getElementById('mission_reply_content');

    if (!missionReplyInput) {
        return;
    }

    const firstMissionReply = document.getElementById('mission_replies')?.querySelector('li:last-of-type');

    if (firstMissionReply) {
        return;
    }

    const creditsText = guardMissionCountdown.parentElement.innerText;
    const re = /Verdienst:[\s\u00A0]([0-9.]+)[\s\u00A0]Credits/;
    const matchedCredits = re.exec(creditsText);
    let credits;

    if (matchedCredits !== null) {
        matchedCredits.forEach((match) => {
            credits = match;
        });
    } else {
        return;
    }

    credits = credits.replace('.', '');
    credits = parseInt(credits);

    if (credits < CREDITS_THRESHOLD) {
        return;
    }

    const allianceChatCheckbox = document.getElementById('mission_reply_alliance_chat');

    if (allianceChatCheckbox) {
        allianceChatCheckbox.checked = true;
    }

    if (SHORT_CREDITS) {
        credits = Math.round(credits / 1000) + 'k';
    } else {
        credits = credits.toLocaleString('de-DE');
    }

    missionReplyInput.value = MISSION_REPLY_MESSAGE.replace('__CREDITS__', credits);
})();
