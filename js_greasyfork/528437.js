// ==UserScript==
// @name Mydealz User Profil Enhancer
// @namespace http://tampermonkey.net/
// @version 1.5.2
// @description Erweitert die Profilbuttons um zusätzliche Funktionen
// @author MD928835
// @license MIT
// @match https://www.mydealz.de/*
// @require https://update.greasyfork.org/scripts/528796/1560683/MyDealz%20Comment%20Viewer.js
// @require https://update.greasyfork.org/scripts/528580/1545878/MyDealz%20Reactions%20Viewer%202025.js
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/528437/Mydealz%20User%20Profil%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/528437/Mydealz%20User%20Profil%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Funktion zum Dekodieren von URL-codierten Benutzernamen
    function decodeUsername(encodedUsername) {
        try {
            return decodeURIComponent(encodedUsername);
        } catch (e) {
            console.error('Fehler beim Dekodieren des Benutzernamens:', e);
            return encodedUsername;
        }
    }

    // CSS bestehende Elemente ausblenden
    const style = document.createElement('style');
    style.textContent = `
      /* Originalen Button sofort ausblenden */
      .popover a.width--all-12.space--mt-2.button:not(.custom-button) {
        display: none !important;
      }

      /* Badges sofort ausblenden */
      .popover .flex.gap-1 {
        visibility: hidden !important;
      }

      /* Neue Buttons normal anzeigen */
      .popover .custom-buttons .button {
        display: flex !important;
      }
    `;
    document.head.appendChild(style);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            const popover = document.querySelector('.popover--visible');
            if (popover) {
                setTimeout(() => modifyPopup(popover), 100);
            }
        });
    });

    async function modifyPopup(popover) {
        const profileBtn = popover.querySelector('a.width--all-12.space--mt-2.button');
        if (!profileBtn || popover.querySelector('.custom-buttons')) return;

        const encodedUsername = profileBtn.href.split('/profile/')[1];
        const username = decodeUsername(encodedUsername);
        const container = profileBtn.parentElement;
        container.classList.add('custom-buttons');

        // GraphQL User Metadaten
        const query = `query userProfile($username: String) {
            user(username: $username) {
                joinedAgo isOnline mutable isMuted allowToBeMessaged
            }
        }`;

        try {
            const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        username
                    }
                })
            });
            const data = await response.json();
            const {
                isOnline,
                joinedAgo,
                mutable,
                isMuted,
                allowToBeMessaged
            } = data.data.user;

            // Mitgliedschaftsdauer aktualisieren
            const membershipElement = popover.querySelector('.overflow--wrap-off.size--all-s');
            if (membershipElement) {
                membershipElement.textContent = `Dabei seit ${joinedAgo}`;
            }

// Zeitangabe von der Profilseite holen
let lastActivityTime = 'unbekannt';
try {
    const profileHtml = await fetch(`https://www.mydealz.de/profile/${encodedUsername}`);
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = await profileHtml.text();

    // Den relevanten Bereich finden
    const timeElement = tempDiv.querySelector('.userProfile-action-text .color--text-AccentBrand.text--b');
    if (timeElement) {
        const zeitText = timeElement.parentNode.innerHTML
            .split('</span>')[1] // Trennt am schließenden </span>
            .split('</div>')[0] // Trennt am schließenden </div>
            .trim(); // Entfernt überflüssige Leerzeichen
        lastActivityTime = zeitText;
    }
} catch (error) {
    console.error('Fehler beim Abrufen der Profilseite:', error);
}

            // Badge-Container durch Online-Status ersetzen
            const badgeContainer = popover.querySelector('.flex.gap-1');
            if (badgeContainer) {
                const statusContainer = document.createElement('div');
                statusContainer.className = 'size--all-s space--mt-2 space--mb-4';
                const status = isOnline ? 'ON_line' : 'OFF_line';
                statusContainer.textContent = `${status}, zuletzt aktiv ${lastActivityTime}`;
                badgeContainer.replaceWith(statusContainer);
            }

            // Buttons Container erstellen
            const btnContainer = document.createElement('div');
            btnContainer.className = 'flex flex--grow-1 gap--all-2';
            btnContainer.style.gap = '5px';
            btnContainer.style.width = '100%';

            // Profil Button
            const profileButton = document.createElement('a');
            profileButton.href = `/profile/${encodedUsername}`;
            profileButton.className = 'flex button button--shape-circle button--type-secondary button--mode-default';
            profileButton.style.flex = '1';
            profileButton.innerHTML = `<svg width="17" height="14" class="icon icon--mail"><use xlink:href="/assets/img/ico_632f5.svg#person"></use></svg><span class="space--ml-2"> Profil </span>`;

            // Nachricht Button
            const messageButton = document.createElement('button');
            messageButton.type = 'button';
            messageButton.className = 'flex button button--shape-circle button--type-secondary button--mode-default';
            messageButton.style.flex = '1';
            messageButton.innerHTML = `<svg width="17" height="14" class="icon icon--mail"><use xlink:href="/assets/img/ico_632f5.svg#mail"></use></svg><span class="space--ml-2"> Nachricht </span>`;

            // Styling für nicht anschreibbar
            if (!allowToBeMessaged) {
                messageButton.style.color = '#e02020';
                messageButton.style.borderColor = '#e02020';
                messageButton.style.cursor = 'not-allowed';
                messageButton.disabled = true;
                messageButton.title = 'Dieser Nutzer möchte keine Nachrichten empfangen';
            }
            if (allowToBeMessaged) {
                messageButton.onclick = async () => {
                    const encodedUsername = document.querySelector('.popover--visible a[href^="/profile/"]')?.href.split('/profile/')[1];
                    if (!encodedUsername) return;

                    try {
                        // GET-Request zur Prüfung des Inhalts
                        const response = await fetch(`/profile/messages/${encodedUsername}`);
                        const html = await response.text();
                        const decodedUsername = decodeUsername(encodedUsername);

                        // Prüfen, ob der Username im HTML vorkommt
                        const isSpecificMessagePage = html.includes(`<span class="size--all-l text--b space--mr-1">${decodedUsername}</span>`);

                        if (isSpecificMessagePage) {
                            // Bei existierendem User direkt zur Nachrichtenseite
                            const win = window.open(`/profile/messages/${encodedUsername}`, '_blank');

                            if (win) {
                                win.addEventListener('load', () => {
                                    const observer = new MutationObserver((mutations, obs) => {
                                        const sendButton = win.document.querySelector('button[data-t="sendButton"]');
                                        if (sendButton) {
                                            sendButton.click();
                                            obs.disconnect();
                                        }
                                    });

                                    observer.observe(win.document.body, {
                                        childList: true,
                                        subtree: true
                                    });

                                    setTimeout(() => observer.disconnect(), 3000);
                                });
                            }
                        } else {
                            // Bei nicht-existierendem User zur Profilseite
                            const win = window.open(`/profile/${encodedUsername}`, '_blank');

                            if (win) {
                                win.addEventListener('load', () => {
                                    const observer = new MutationObserver((mutations, obs) => {
                                        const sendButton = win.document.querySelector('button[data-t="sendButton"]');
                                        if (sendButton) {
                                            sendButton.click();
                                            obs.disconnect();
                                        }
                                    });

                                    observer.observe(win.document.body, {
                                        childList: true,
                                        subtree: true
                                    });

                                    setTimeout(() => observer.disconnect(), 3000);
                                });
                            }
                        }
                    } catch (error) {
                        console.error('Fehler beim Prüfen der Nachrichtenseite:', error);
                        window.open(`/profile/${encodedUsername}`, '_blank');
                    }
                };
            };

            // Buttons hinzufügen
            btnContainer.appendChild(profileButton);
            btnContainer.appendChild(messageButton);

            // Alten Button ersetzen
            profileBtn.replaceWith(btnContainer);

            // Statistikbereich finden und "letzte anzeigen" Link hinzufügen
            setTimeout(() => {
                const kommentareElement = Array.from(popover.querySelectorAll('li.lbox--f.lbox--v-3 .size--all-s'))
                    .find(el => el.textContent.includes('Kommentare'));

                if (kommentareElement) {
                    // "letzte anzeigen" Link erstellen
                    const linkElement = document.createElement('span');
                    linkElement.className = 'showCommentsBtn';
                    linkElement.textContent = 'anzeigen';
                    linkElement.style.backgroundColor = '#e6f7e6';
                    linkElement.style.padding = '0 4px';
                    linkElement.style.borderRadius = '3px';
                    linkElement.style.cursor = 'pointer';
                    linkElement.style.marginLeft = '5px';
                    linkElement.style.fontSize = '14px';

                    linkElement.onclick = () => {
                        const p = document.querySelector('.popover--visible');
                        const encodedUsername = p?.querySelector('a[href^="/profile/"]')?.getAttribute('href')?.split('/')[2];
                        if (!encodedUsername) return;
                        const username = decodeUsername(encodedUsername);
                        window.viewUserComments(username);
                    };

                    // Link zum Kommentare-Element hinzufügen
                    kommentareElement.appendChild(document.createTextNode(' '));
                    kommentareElement.appendChild(linkElement);
                }
                const reactionsElement = Array.from(popover.querySelectorAll('li.lbox--f.lbox--v-3 .size--all-s'))
                    .find(el => el.textContent.includes('Reaktionen'));

                if (reactionsElement) {
                    const linkElement = document.createElement('span');
                    linkElement.className = 'showReactionsBtn';
                    linkElement.textContent = 'anzeigen';
                    linkElement.style.backgroundColor = '#e6f7e6';
                    linkElement.style.padding = '0 4px';
                    linkElement.style.borderRadius = '3px';
                    linkElement.style.cursor = 'pointer';
                    linkElement.style.marginLeft = '5px';
                    linkElement.style.fontSize = '14px';

                    linkElement.onclick = () => {
                        const p = document.querySelector('.popover--visible');
                        const encodedUsername = p?.querySelector('a[href^="/profile/"]')?.getAttribute('href')?.split('/')[2];
                        if (!encodedUsername) return;
                        const username = decodeUsername(encodedUsername);
                        viewReactions(username);
                    };

                    reactionsElement.appendChild(document.createTextNode(' '));
                    reactionsElement.appendChild(linkElement);
                }
            }, 500);
        } catch (error) {
            console.error('Fehler:', error);
        }
    }

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
})();
