// ==UserScript==
// @name         YouTube → SkipCut (Open in New Tab + Instant Redirect)
// @name:en      YouTube → SkipCut (Open in New Tab + Instant Redirect)
// @name:nl      YouTube → SkipCut (Openen in Nieuw Tabblad + Directe Doorverwijzing)
// @name:es      YouTube → SkipCut (Abrir en Nueva Pestaña + Redirección Instantánea)
// @name:fr      YouTube → SkipCut (Ouvrir dans un Nouvel Onglet + Redirection Instantanée)
// @name:de      YouTube → SkipCut (In neuem Tab öffnen + Sofortige Weiterleitung)
// @name:zh-CN   YouTube → SkipCut (在新标签页打开 + 即时重定向)
// @name:ja      YouTube → SkipCut (新しいタブで開く + 即時リダイレクト)
// @name:ru      YouTube → SkipCut (Открыть в новой вкладке + Мгновенное перенаправление)
// @name:pt      YouTube → SkipCut (Abrir em Nova Aba + Redirecionamento Instantâneo)
// @name:it      YouTube → SkipCut (Apri in Nuova Scheda + Reindirizzamento Istantaneo)
// @namespace    https://greasyfork.org/users/1197317-opus-x
// @version      1.06
// @description  Open YouTube watch/live/playlist links in a new SkipCut tab and instantly redirect direct loads.
// @description:en Open YouTube watch/live/playlist links in a new SkipCut tab and instantly redirect direct loads.
// @description:nl Open YouTube watch-/live-/afspeellijst-links in een nieuw SkipCut-tabblad en leid directe ladingen onmiddellijk door.
// @description:es Abre enlaces de YouTube de visualización/transmisión/lista de reproducción en una nueva pestaña de SkipCut y redirige instantáneamente las cargas directas.
// @description:fr Ouvre les liens YouTube de visionnage/en direct/liste de lecture dans un nouvel onglet SkipCut et redirige instantanément les chargements directs.
// @description:de Öffnet YouTube-Video-/Live-/Wiedergabelisten-Links in einem neuen SkipCut-Tab und leitet direkte Aufrufe sofort weiter.
// @description:zh-CN 在新的 SkipCut 标签页中打开 YouTube 观看/直播/播放列表链接，并立即重定向直接加载。
// @description:ja YouTubeの視聴/ライブ/プレイリストリンクを新しいSkipCutタブで開き、直接読み込みを即座にリダイレクトします。
// @description:ru Открывает ссылки YouTube на просмотр/прямую трансляцию/плейлист в новой вкладке SkipCut и мгновенно перенаправляет прямые загрузки.
// @description:pt Abre links de visualização/transmissão/lista de reprodução do YouTube em uma nova aba SkipCut e redireciona instantaneamente as cargas diretas.
// @description:it Apre i link di visualizzazione/live/playlist di YouTube in una nuova scheda SkipCut e reindirizza istantaneamente i caricamenti diretti.
// @author       Opus-X
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAn1BMVEVHcEz/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr/KTr5KDn7KDnWKDX/KTr////+KTr+IjTxJjf5KDjtpKnrFCn98/T+Gi/pJjX+9/fbIjHiQ0/iIDDCEiLPHi22CBzFSlP8UV3z29y4Mjz9O0r0Fiv8p639i5L5ZW/85efswMPJGCjfn6P+z9L+a3XHY2nNgofWanHTKjevBBkSa/ywAAAAD3RSTlMA1eJM8G8ZywLEjK/Ky+Vq/rygAAABGklEQVQokcWSV3PDMAiAlcRJ7YwzGq1XvGPH8cho+/9/W0Ee59zlpQ+98iA4PoEQwNi/iLna7qy3J7F225VJbLOwX8pig3FLbYrBJcRElyZb99aN994scye6ZhYpt4JrgV5eOFBN1GIGqfIMUF9cW2Q+wHlMbTCOJy/fAcCvXHF00LgWPeU9/CCIMaWGft0/zJk9g9BoCODcNH2GkPuDcRG/g006pP0MFcF5Qd33ScM8jQjOq/UfSaQjm1MUSE7QGGF9T+LgiG92SRtIpZtgadhBjtc9iV95JHFIcdQ+ajyXX3dKpVSYpknsKT40nkbGZdDidWUrL26DkeHI9LCV9DxdgkI9MBr2sCb7g96Pw14b05ogfblZf7e0P1C8J9ljbAzmAAAAAElFTkSuQmCC
// @match        *://youtube.com/*
// @match        *://www.youtube.com/*
// @match        *://youtube-nocookie.com/*
// @match        *://www.youtube-nocookie.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545369/YouTube%20%E2%86%92%20SkipCut%20%28Open%20in%20New%20Tab%20%2B%20Instant%20Redirect%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545369/YouTube%20%E2%86%92%20SkipCut%20%28Open%20in%20New%20Tab%20%2B%20Instant%20Redirect%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TARGET_TAB_NAME = 'SkipCutTab';

    /**
     * Build the matching SkipCut URL for a given YouTube URL
     * @param {string} url
     * @returns {string|null}
     */
    function getSkipCutUrl(url) {
        const u = new URL(url);
        let newUrl = null;

        if (u.pathname === '/watch' && u.searchParams.has('v')) {
            newUrl = `https://www.skipcut.com/watch?v=${u.searchParams.get('v')}`;
        }
        else if (u.pathname.startsWith('/live/')) {
            const liveId = u.pathname.split('/')[2];
            if (liveId) {
                newUrl = `https://www.skipcut.com/live/${liveId}`;
            }
        }
        else if (u.pathname === '/playlist' && u.searchParams.has('list')) {
            newUrl = `https://www.skipcut.com/playlist?list=${u.searchParams.get('list')}`;
        }

        return newUrl;
    }

    /**
     * Instantly redirect current tab to SkipCut if current URL matches
     * Called on page load and SPA navigations.
     */
    function tryDirectRedirect() {
        const redirectUrl = getSkipCutUrl(location.href);
        if (redirectUrl) {
            window.stop(); // Stop YouTube from loading anything
            location.replace(redirectUrl);
            return true;
        }
        return false;
    }

    // Check immediately at document-start for direct loads
    if (tryDirectRedirect()) return;

    /**
     * Open a SkipCut link in the same new tab and prevent YouTube SPA navigation.
     * Intercepts clicks before YouTube handles them.
     */
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        // Match relevant YouTube video/playlist/live links
        if (link.href.includes('/watch') || link.href.includes('/live/') || link.href.includes('/playlist')) {
            const redirectUrl = getSkipCutUrl(link.href);
            if (redirectUrl) {
                e.preventDefault();
                e.stopImmediatePropagation(); // Block YouTube SPA navigation
                window.open(redirectUrl, TARGET_TAB_NAME);
            }
        }
    }, true);

    /**
     * Handle SPA navigations triggered internally by YouTube.
     * If the URL changes directly (e.g. typing or script), redirect instantly.
     */
    function handleSpaNavigation() {
        const redirectUrl = getSkipCutUrl(location.href);
        if (redirectUrl) {
            window.stop();
            location.replace(redirectUrl);
        }
    }

    // Patch History API to detect SPA navigations instantly
    const origPushState = history.pushState;
    const origReplaceState = history.replaceState;

    history.pushState = function (...args) {
        origPushState.apply(this, args);
        handleSpaNavigation();
    };

    history.replaceState = function (...args) {
        origReplaceState.apply(this, args);
        handleSpaNavigation();
    };

    window.addEventListener('popstate', handleSpaNavigation);

    // YouTube-specific SPA hooks (extra safety net)
    window.addEventListener('yt-navigate-start', handleSpaNavigation, true);
    window.addEventListener('yt-page-data-updated', handleSpaNavigation, true);

})();