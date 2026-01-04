// ==UserScript==
// @name         Clean Twitter(X)
// @namespace    https://x.com/mirabella_777
// @version      1.5
// @description  Removes premium content
// @author       mirabella_777
// @match        *://twitter.com/*
// @match        *://x.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/526682/Clean%20Twitter%28X%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526682/Clean%20Twitter%28X%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isEnabled = true;

    const premiumSelectors = [
        '[data-testid="verified"]',
        '[aria-label="Verified"]',
        '[href="/i/verified-orgs-signup"]',
        '[href="/i/premium_sign_up"]',
        '[href="/jobs"]',
        '[aria-label="Top Articles"]',
        'a[href="/i/premium"]',
        'div[aria-label="Subscribe to Premium"]',
        'div[aria-label="Timeline: Verified"]',
        '.r-vacyoi > div:nth-child(3)',
        'div[role="button"]:has(span)',
        '[aria-label*="premium"]',
        '[aria-label*="Premium"]'
    ];

    function hidePremiumContent() {
        if (!isEnabled) return;
        premiumSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = 'none';
                el.setAttribute('data-hidden-premium', 'true');
            });
        });

        document.querySelectorAll('span').forEach(span => {
            if (/you did .* impressions/i.test(span.textContent)) {
                span.closest('div').style.display = 'none';
            }
        });
    }

    function redirectFromElon() {
        const elonProfile = "/elonmusk";

        if (window.location.pathname.includes(elonProfile)) {
            window.location.href = "/home";
        }

        document.querySelectorAll('a[href*="elonmusk"]').forEach(link => {
            link.closest('article')?.remove();
        });
    }

function highlightCommunityNotes() {
    if (!document.getElementById('community-note-style')) {
        const style = document.createElement('style');
        style.id = 'community-note-style';
        style.textContent = `
            .highlighted-note {
                position: relative;
                border-radius: 12px;
                padding: 8px;
                background-color: #FFFBEA !important;
                z-index: 0;
            }

            .highlighted-note::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                border-radius: 14px;
                background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
                background-size: 300% 300%;
                animation: glowingBorder 4s linear infinite;
                z-index: -1;
            }

            @keyframes glowingBorder {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
        `;
        document.head.appendChild(style);
    }

    // Match by text content of known Community Note strings
    const noteTexts = [
        "readers added context",
        "community notes",
        "people added context" // fallback variants
    ];

    document.querySelectorAll('article').forEach(article => {
        const note = [...article.querySelectorAll('span')].find(span =>
            noteTexts.some(txt => span.textContent.toLowerCase().includes(txt))
        );

        if (note) {
            const container = note.closest('div');
            if (container && !container.classList.contains('highlighted-note')) {
                container.classList.add('highlighted-note');
            }
        }
    });
}



function addDeveloperBadge() {
    const style = document.createElement('style');
    style.textContent = `
        .dev-badge {
            animation: devPulse 2s infinite;
        }

        @keyframes devPulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

     const badgeSVG = '<svg width="48" height="48" style="margin-left:4px;vertical-align:text-bottom;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 554.4 649.6"><path d="m273.53 531.63-1.2395-1-9.3067-28.8-4.6424-12-9.818-24-17.748-35.2-8.6508-14.4-15.06-22.4-13.001-16.784-19.226-19.216-13.574-10.574-11.2-7.2366-9.0585-4.8934-13.342-5.418-12.169-3.7597 20.169-13.528 9.6-7.622 9.7313-10.168 5.9613-8.9982 4.6761-11.49 1.8536-10.644-.44579-8.4502-.44578-8.4502-4.2296-17.567-5.4146-16.362-3.4264-8.6192-3.4264-8.6192-11.531-23.496-7.5372-13.304-4.8378-8-12.086-19.2-21.358-31.75.61216-.61215 17.504 13.176 11.2 8.674 24 20.062 23.2 20.715 16.8 15.328 26.449 26.408 9.6565 10.4 16.766 20 7.9794 11.2 2.9747 4.5356 2.9746 4.5356v1.1609l-8.4-7.896-12.975-9.8364-20.234-13.684-10.792-5.4178-12.287-4.9044-2.8566-.53589-2.8566-.53591v.93244l4.1268 9.2456 4.7217 12.8 1.1757 6.7048 1.1757 6.7048-.006 12.99-2.3936 14.758-4.6527 11.712-8.0522 13.994-6.7765 8.3356-8.7112 9.0411.89866 1.4541 14.094 8.5536 12.8 9.9316 12.087 11.02 15.664 17.105 8.6992 10.895 11.805 16.8 11.046 17.6 9.4292 16.8 6.1129 11.2 2.6527 5.2h13.131l10.79-19.6 14.435-24 7.9316-12 9.7475-13.6 14.579-17.6 15.89-16.128 13.6-10.775 18.4-12.278.42665-.1792-10.184-10.541-9.981-14.573-6.3921-13.64-2.0371-8.1431-2.0371-8.1431-.062-18.4 2.1096-8 2.1096-8 7.2467-17.467-.73833-.73832-7.6613 1.8785-11.368 4.6767-11.832 6.6356-8.8 5.7196-20.8 15.067-9.2 8.9784v-1.4415l11.966-17.817 21.136-25.491 40.099-39.849 18.279-16.151 22.521-19.81 25.818-20.99 9.3822-7.2772 10.8-7.6632v.76582l-27.647 41.375-8.2699 13.6-9.9886 17.6-6.2336 12-7.3055 16-4.6248 12-2.6501 8-2.6501 8-1.3152 4.4709-1.3152 4.4709-1.1951 7.9291-1.1951 7.9291-.005 5.9345-.005 5.9345 1.8287 10.531 5.3676 11.792 3.5177 4.9042 3.5177 4.9042 13.368 12.954 23.735 15.578-.40504.40505-.40504.40504-18.925 6.3179-14.174 7.2282-10.16 6.1725-12.466 9.3149-16.602 16.025-13.127 16-11.902 16-9.0454 14.4-11.38 20-15.733 32-3.6731 8.8-3.6731 8.8-5.4866 14.4-6.3764 19.2-3.4474 11.6h-2.8481l-1.2396-1zm-39.27-181.47-3.0032-.70782-7.7678-3.9362-13.046-12.273-9.6518-12.809.37408-.37406.37407-.37407 9.3241 2.0225 13.355 6.9654 9.2924 6.3104 4.9404 5.9936 1.3228 4.0254 1.3228 4.0253.36908 1 .36906 1-4.5712-.1608zm75.805-1.7315.52931-2.6.73607-2.8922.73608-2.8922 7.5964-7.1049 10.259-6.012 10.541-4.8537 8.6625-3.0491.27134.27135.27136.27134-12.746 16.847-8.8057 8.0479-7.4467 4.162-8.097 2.4046h-3.0367z" fill="#33fff5"/></svg>';


    document.querySelectorAll('article div[data-testid="User-Name"]').forEach(el => {
        if (el.innerText.includes('@mirabella_777') && !el.querySelector('.dev-badge')) {
            const target = el.querySelector('div > div > span:not(:has(*))');
            if (target) {
                const badge = document.createElement('span');
                badge.className = 'dev-badge';
                badge.title = 'Script Developer';
                badge.innerHTML = badgeSVG;
                target.appendChild(badge);
            }

            // Add flair styling to your tweet container
            const article = el.closest('article');
            if (article && !article.classList.contains('my-tweet-highlight')) {
                article.classList.add('my-tweet-highlight');
            }
        }
    });
}



    function restorePremiumContent() {
        document.querySelectorAll('[data-hidden-premium]').forEach(el => {
            el.style.display = '';
            el.removeAttribute('data-hidden-premium');
        });
    }

    function toggleScript() {
        isEnabled = !isEnabled;
        if (isEnabled) {
            hidePremiumContent();
        } else {
            restorePremiumContent();
        }
        updateToggleButton();
    }

    function addToggleButton() {
        const sidebar = document.querySelector('nav[aria-label="Primary"]');
        if (!sidebar || document.getElementById('togglePremiumBtn')) return;

        let toggleButton = document.createElement('button');
        toggleButton.id = 'togglePremiumBtn';
        toggleButton.innerText = isEnabled ? "Premium Hidden" : "Premium Visible";
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.padding = '8px 16px';
        toggleButton.style.margin = '10px 0';
        toggleButton.style.borderRadius = '50px';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.color = '#fff';
        toggleButton.style.backgroundColor = '#1D9BF0';
        toggleButton.style.border = '1px solid #1D9BF0';
        toggleButton.style.fontFamily = 'inherit';
        toggleButton.onclick = toggleScript;

        sidebar.appendChild(toggleButton);
    }

    function updateToggleButton() {
        const toggleButton = document.getElementById('togglePremiumBtn');
        if (toggleButton) {
            toggleButton.innerText = isEnabled ? "Premium Hidden" : "Premium Visible";
        }
    }

    function ensureGifVisibility() {
        document.querySelectorAll('video[aria-label="GIF"]').forEach(gif => {
            gif.style.visibility = 'visible';
        });
    }

document.addEventListener('DOMContentLoaded', () => {
    addToggleButton();
    hidePremiumContent();
    ensureGifVisibility();
    redirectFromElon();
    addDeveloperBadge();
    highlightCommunityNotes();
});


const observer = new MutationObserver(() => {
    hidePremiumContent();
    addToggleButton();
    ensureGifVisibility();
    redirectFromElon();
    addDeveloperBadge();
    highlightCommunityNotes();
});
    observer.observe(document.body, { childList: true, subtree: true });
})();
