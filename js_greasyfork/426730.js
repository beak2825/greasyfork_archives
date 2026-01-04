// ==UserScript==
// @name         Citations
// @version      1.0.0
// @description  Inclus les pseudos dans les citations
// @author       m7r-227
// @match        https://www.jeuxvideo.com/forums/*
// @namespace https://greasyfork.org/users/300879
// @downloadURL https://update.greasyfork.org/scripts/426730/Citations.user.js
// @updateURL https://update.greasyfork.org/scripts/426730/Citations.meta.js
// ==/UserScript==

const textarea = document.querySelector('#message_topic');

document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('picto-msg-quote')) {
        setTimeout(() => {
            const pseudo = getPseudoFromCitationBtn(e.target);
            const date = getDateFromCitationBtn(e.target);

            const regex = new RegExp(`> Le\\s+?${date}\\s+?:`);
            textarea.value = textarea.value.replace(regex, `> Le ${date} ${pseudo} a écrit : `);
        }, 2000);
    }
});

function getPseudoFromCitationBtn(btn) {
    return btn.parentElement.parentElement.querySelector('.bloc-pseudo-msg.text-user').textContent.trim();
}

function getDateFromCitationBtn(btn) {
    return btn.parentElement.parentElement.querySelector('.bloc-date-msg').textContent.trim();
}