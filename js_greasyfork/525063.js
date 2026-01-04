// ==UserScript==
// @name         Mydealz Comment-Preview
// @namespace    https://mydealz.de/
// @version      1.1.4
// @description  Zeigt verlinkte Kommentare beim Klick in einem Popup an
// @match        https://www.mydealz.de/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525063/Mydealz%20Comment-Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/525063/Mydealz%20Comment-Preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Popup erstellen
    const popup = document.createElement('div');
    popup.id = 'commentPopup';
    popup.style.position = 'fixed';
    popup.style.backgroundColor = '#fff';
    popup.style.padding = '12px';
    popup.style.border = '1px solid #ccc';
    popup.style.borderRadius = '6px';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    popup.style.zIndex = '9999';
    popup.style.maxWidth = '600px';
    popup.style.maxHeight = '400px';
    popup.style.overflow = 'auto';
    popup.style.display = 'none';
    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
    popup.style.pointerEvents = 'auto';
    document.body.appendChild(popup);

    // GraphQL-Abfrage für einen Kommentar
    async function fetchSingleComment(commentId) {
        const query = `
            query comment($id: ID!) {
                comment(id: $id) {
                    preparedHtmlContent
                    createdAtTs
                    user {
                        userId
                        username
                    }
                }
            }
        `;

        const variables = {
            id: commentId
        };

        const response = await fetch('https://www.mydealz.de/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                query,
                variables
            })
        });

        const data = await response.json();
        if (data.errors) {
            throw new Error(data.errors[0].message);
        }

        return data?.data?.comment;
    }

    // Click-Handler für Links
    async function onLinkClick(event) {
        const link = event.target.closest('a');
        if (!link) return;

        if (!link.closest('.commentList') &&
            !link.closest('li.userProfile-action-item') &&
            !link.closest('.profile-comments')) return;

        const fullUrl = link.title || link.href;

        const commentMatch = fullUrl.match(/(?:\/deals\/|\/diskussion\/|\/feedback\/)(?:.*?-)?(\d+)(?:#comment-|#reply-)(\d+)/i);
        if (!commentMatch) return;

        event.preventDefault();
        event.stopPropagation();

        const dealId = commentMatch[1];
        const commentId = commentMatch[2];

        try {
            const mouseX = event.clientX;
            const mouseY = event.clientY;
            const viewportHeight = document.documentElement.clientHeight;
            const popupHeight = 400; // Feste Popup-Höhe
            const offset = 15;

            popup.style.display = 'block';
            popup.innerHTML = '<em>Lade Kommentar...</em>';
            popup.style.left = `${mouseX + offset}px`;

            // Position basierend auf Cursor-Position in oberer/unterer Fensterhälfte
            if (mouseY > viewportHeight / 2) {
                // Untere Fensterhälfte: Popup über dem Cursor
                popup.style.top = `${mouseY - popupHeight}px`;
            } else {
                // Obere Fensterhälfte: Popup unter dem Cursor
                popup.style.top = `${mouseY}px`;
            }

            const commentData = await fetchSingleComment(commentId);
            if (!commentData) {
                popup.innerHTML = '<em>Kommentar nicht gefunden</em>';
                return;
            }

            const commentDate = new Date(commentData.createdAtTs * 1000).toLocaleString('de-DE', {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(',', '');

            popup.innerHTML = `
                <div style="position:relative;">
                    <div style="background-color:#4CAF50; color:white; margin:-12px -12px 10px -12px; padding:8px 12px; border-radius:5px 5px 0 0; box-sizing:border-box; width:calc(100% + 24px);">
                        <button onclick="document.getElementById('commentPopup').style.display='none'"
                                style="position:absolute; top:8px; right:0px; background:none; color:white;
                                       border:none; cursor:pointer; font-size:16px;
                                       line-height:1; padding:0; font-family:Arial;">
                            ×
                        </button>
                        <div style="font-weight:bold; white-space:nowrap;">
                            @${commentData.user.username} am ${commentDate}&#160;&#160;&#160;&#160;&#160;&#160;
                        </div>
                    </div>
                    <div style="font-size:14px; margin:0 12px 15px 12px;">
                        ${commentData.preparedHtmlContent}
                    </div>
                    <div style="text-align:center; margin:0 12px;">
                        <button onclick="document.getElementById('commentPopup').style.display='none'; window.location.href='${fullUrl}'"
                                style="padding:6px 12px; background-color:#4CAF50; color:white; border:none; border-radius:4px; cursor:pointer;">
                            Zum Kommentar
                        </button>
                    </div>
                </div>
            `;

        } catch (e) {
            console.error(e);
            popup.innerHTML = '<em>Fehler beim Laden</em>';
        }
    }

    // Event-Listener für Klicks
    document.addEventListener('click', onLinkClick, true);

    // Popup schließen wenn außerhalb geklickt wird
    document.addEventListener('click', (event) => {
        if (!popup.contains(event.target) && event.target.tagName !== 'A') {
            popup.style.display = 'none';
        }
    });
})();
