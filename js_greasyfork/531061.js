// ==UserScript==
// @name MyDealz Letzten Kommentar bei Sortierung nach 'Diskutiert' anzeigen
// @namespace http://tampermonkey.net/
// @version 1.0
// @description Fängt Klicks auf .metaRibbon ab und zeigt den Kommentar in einem Vorschaupopup
// @author       MD928835
// @license      MIT
// @match https://www.mydealz.de/*-discussed*
// @grant none
// @require https://update.greasyfork.org/scripts/531060/1561179/Comment%20PopUp.js
// @downloadURL https://update.greasyfork.org/scripts/531061/MyDealz%20Letzten%20Kommentar%20bei%20Sortierung%20nach%20%27Diskutiert%27%20anzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/531061/MyDealz%20Letzten%20Kommentar%20bei%20Sortierung%20nach%20%27Diskutiert%27%20anzeigen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', handleClick, true);

    async function handleClick(event) {
        const metaRibbon = event.target.closest('.metaRibbon');
        if (!metaRibbon) return;

        event.stopPropagation();
        event.preventDefault();

        const article = metaRibbon.closest('article');
        if (!article) {
            console.error('Kein umschließendes <article> gefunden');
            return;
        }

        const threadId = article.id.replace('thread_', '');
        const metaText = metaRibbon.querySelector('span').textContent;
        const match = metaText.match(/kommentiert\s(.*?)(?:\s+von\s(.+))?$/);
        const username = match && match[2] ? match[2].trim() : 'Unbekannt';

        // console.log('Thread ID:', threadId);
        // console.log('Autor:', username);

        const { commentId } = await getCommentDirectLink(threadId, username);

        if (commentId) {
            showCommentPopup(commentId);
        } else {
            console.error('Kommentar-ID konnte nicht ermittelt werden');
        }
    }

    async function getCommentDirectLink(threadId, username) {
        const encodedUsername = encodeURIComponent(username);
        let commentId = null;

        try {
            const profileHtml = await fetch(`https://www.mydealz.de/profile/${encodedUsername}`).then(res => res.text());
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = profileHtml;

            const commentRegex = new RegExp(`https://www\\.mydealz\\.de/.*-${threadId}#(?:reply|comment)-([0-9]+)`);
            const directLinkElement = Array.from(tempDiv.querySelectorAll('a')).find(a => commentRegex.test(a.href));

            if (directLinkElement) {
                const match = directLinkElement.href.match(commentRegex);
                if (match && match[1]) {
                    commentId = match[1];
                }
            }
        } catch (error) {
            console.error('Fehler beim Abrufen der Profildaten:', error);
        }

        return { commentId };
    }
})();
