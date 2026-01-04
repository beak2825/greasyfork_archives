// ==UserScript==
// @name        FB Video Saver
// @match       https://www.facebook.com/*
// @match       https://cobalt.tools/*
// @match       https://*.fbcdn.net/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_download
// @version     2.1
// @author      Macxzew
// @description Un script pour facebook.com permettant de télécharger des vidéos ou des collections de vidéos.
// @license     MIT
// @namespace   https://greasyfork.org/users/1425005
// @downloadURL https://update.greasyfork.org/scripts/524263/FB%20Video%20Saver.user.js
// @updateURL https://update.greasyfork.org/scripts/524263/FB%20Video%20Saver.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    const HOST = location.hostname;
    const KEY_PENDING_URL = 'fbVS_pending_url';
    const KEY_DONE_URLS = 'fbVS_done_urls';
    const KEY_DONE_FBCDN = 'fbVS_done_fbcdn';

    const isSavedPage = (url) =>
        url.includes('/saved/');

    const isVideoUrl = (url) =>
        url.includes('/watch/') ||
        url.includes('/reel/') ||
        url.includes('/videos/');

    const loadDoneList = async () => {
        const arr = await GM_getValue(KEY_DONE_URLS, []);
        return Array.isArray(arr) ? arr : [];
    };

    const saveDoneList = (arr) =>
        GM_setValue(KEY_DONE_URLS, arr);

    const addToDoneList = async (url) => {
        if (!url)
            return;
        const arr = await loadDoneList();
        if (!arr.includes(url)) {
            arr.push(url);
            await saveDoneList(arr);
            console.log('[FB Video Saver] URL ajoutée à DONE :', url);
        }
    };

    const createNotification = (message) => {
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: 'rgba(0, 128, 0, 0.9)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            fontSize: '14px',
            zIndex: '9999',
            animation: 'fadeout 3s forwards',
        });
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);

        const styleId = 'fb-video-saver-notif-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
                @keyframes fadeout {
                    0% { opacity: 1; }
                    80% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    };

    const extractVideoKey = (href) => {
        if (!href)
            return '';
        try {
            const u = new URL(href);
            const path = u.pathname;

            if (path.startsWith('/watch')) {
                const v = u.searchParams.get('v');
                if (v)
                    return 'watch:' + v;
            }

            const mReel = path.match(/\/reel[s]?\/([^\/?&#]+)/);
            if (mReel)
                return 'reel:' + mReel[1];

            const mVid = path.match(/\/videos\/([^\/?&#]+)/);
            if (mVid)
                return 'videos:' + mVid[1];

            return 'url:' + u.origin + path;
        } catch (_) {
            const m = href.match(/\/(reel[s]?|videos)\/([^\/?&#]+)/);
            if (m)
                return m[1] + ':' + m[2];
            const vMatch = href.match(/[?&]v=([^&]+)/);
            if (vMatch)
                return 'watch:' + vMatch[1];
            return 'url:' + href.split('#')[0].split('?')[0];
        }
    };

    const sendToCobalt = async (urlToProcess) => {
        if (!urlToProcess)
            return false;
        try {
            await GM_setValue(KEY_PENDING_URL, urlToProcess);
            const w = window.open('https://cobalt.tools/', '_blank', 'noopener,noreferrer');
            if (!w)
                console.warn('[FB Video Saver] impossible d’ouvrir un onglet cobalt');
            console.log('[FB Video Saver] Cobalt ouvert pour :', urlToProcess);
            return true;
        } catch (e) {
            console.error('[FB Video Saver] sendToCobalt error', e);
            return false;
        }
    };

    const refreshPageContent = async () => {
        let lastHeight = document.body.scrollHeight;
        let lastScrollTop = window.scrollY;
        let lastActivityTime = Date.now();

        while (true) {
            // 1) activité utilisateur : changement de scroll (haut ou bas)
            const currentScrollTop = window.scrollY;
            if (currentScrollTop !== lastScrollTop) {
                lastScrollTop = currentScrollTop;
                lastActivityTime = Date.now(); // la page "bouge", on reset le timer
            }

            // 2) scroll auto en bas (pour forcer le chargement infini)
            window.scrollTo(0, document.body.scrollHeight);

            // 3) on attend un peu que le contenu ait le temps de se charger
            await sleep(500);

            // 4) activité contenu : la hauteur de la page change
            const currentHeight = document.body.scrollHeight;
            if (currentHeight !== lastHeight) {
                lastHeight = currentHeight;
                lastActivityTime = Date.now(); // nouveau contenu, on reset le timer
            }

            // 5) si aucune activité (ni scroll ni nouvelle hauteur) depuis > 10 s, on stop
            if (Date.now() - lastActivityTime > 10000) {
                break;
            }
        }
    };



    const collectAllVideoLinks = (doneSet) => {
        const map = new Map();
        for (const a of document.querySelectorAll('a')) {
            const href = a.href;
            if (!href || !isVideoUrl(href))
                continue;
            if (doneSet.has(href)) {
                console.log('[FB Video Saver] Lien déjà dans DONE, ignoré :', href);
                continue;
            }
            const key = extractVideoKey(href);
            if (!key || map.has(key))
                continue;
            map.set(key, { href, key });
        }
        return Array.from(map.values());
    };

    const downloadVisibleVideo = async () => {
        const url = window.location.href;
        if (!isVideoUrl(url)) {
            alert('Aucune vidéo détectée sur cette page.');
            return false;
        }
        const ok = await sendToCobalt(url);
        if (ok)
            createNotification('Vidéo envoyée à Cobalt (onglet séparé).');
        return ok;
    };

    const processSavedVideos = async () => {
        const url = window.location.href;
        if (!isSavedPage(url))
            return;

        const doneArr = await loadDoneList();
        const doneSet = new Set(doneArr);
        let lastSentKey = null;
        const processedKeys = new Set();

        createNotification('Scan des vidéos enregistrées en cours...');
        await refreshPageContent();

        const links = collectAllVideoLinks(doneSet);
        console.log('[FB Video Saver] Liens uniques (par ID vidéo) à traiter :', links.length);
        if (!links.length) {
            createNotification('Aucune vidéo détectée sur cette page.');
            return;
        }

        let index = 0;

        const processNext = async () => {
            if (index >= links.length) {
                console.log('[FB Video Saver] File de liens terminée.');
                createNotification('Collection terminée, actualisation /saved...');
                setTimeout(() => window.location.reload(), 3000);
                return;
            }

            const { href: link, key } = links[index++];

            if (processedKeys.has(key)) {
                console.log('[FB Video Saver] ID vidéo déjà traité dans ce run, skip :', key, link);
                setTimeout(processNext, 0);
                return;
            }

            if (key === lastSentKey) {
                console.log('[FB Video Saver] Même ID vidéo que le précédent, skip :', key, link);
                setTimeout(processNext, 0);
                return;
            }

            processedKeys.add(key);
            console.log('[FB Video Saver] Envoi à Cobalt (queue 20s, anti-doublon ID) :', key, link);

            const success = await sendToCobalt(link);
            if (!success)
                console.warn('[FB Video Saver] Echec sendToCobalt pour :', link);

            lastSentKey = key;
            setTimeout(processNext, 20000);
        };

        processNext();
    };

    const addUIButton = () => {
        setTimeout(() => {
            if (document.getElementById('fb-video-saver-button'))
                return;

            const button = document.createElement('button');
            button.id = 'fb-video-saver-button';
            button.textContent = 'Télécharger';
            Object.assign(button.style, {
                position: 'fixed',
                top: '1%',
                right: '20%',
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                zIndex: '9999',
            });

            button.addEventListener('click', async () => {
                const url = window.location.href;
                if (isSavedPage(url)) {
                    await GM_setValue(KEY_PENDING_URL, '');
                    await GM_setValue(KEY_DONE_URLS, []);
                    await GM_setValue(KEY_DONE_FBCDN, []);
                    console.log('[FB Video Saver] Réinitialisation file, DONE fb et DONE fbcdn');
                    await processSavedVideos();
                } else if (isVideoUrl(url)) {
                    // reset anti-doublon fbcdn pour permettre le re-download
                    await GM_setValue(KEY_DONE_FBCDN, []);
                    await downloadVisibleVideo();
                } else {
                    alert('Aucune action disponible pour cette page.');
                }
            });

            document.body.appendChild(button);
        }, 2500);
    };

    const previousUrl = { value: window.location.href };

    const checkUrlChange = () => {
        const currentUrl = window.location.href;
        if (isSavedPage(currentUrl) && !isSavedPage(previousUrl.value)) {
            console.log('[FB Video Saver] Passage vers /saved, reload forcé...');
            window.location.reload();
        }
        previousUrl.value = currentUrl;
    };

    ((history) => {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = function (...args) {
            const result = originalPushState.apply(this, args);
            window.dispatchEvent(new Event('pushstate'));
            return result;
        };
        history.replaceState = function (...args) {
            const result = originalReplaceState.apply(this, args);
            window.dispatchEvent(new Event('replacestate'));
            return result;
        };
    })(window.history);

    // fbcdn: auto-download + close, avec anti-doublon path (ignore les query)
    if (HOST.endsWith('.fbcdn.net')) {
        try {
            const rawUrl = window.location.href;
            let canon;
            try {
                const u = new URL(rawUrl);
                canon = u.origin + u.pathname;       // même fichier si même path, même si query diff
            } catch {
                canon = rawUrl.split('?')[0].split('#')[0];
            }

            const doneArr = await GM_getValue(KEY_DONE_FBCDN, []);
            if (doneArr.includes(canon)) {
                console.log('[FB Video Saver] fbcdn déjà téléchargé (canonique), skip :', canon);
            } else {
                doneArr.push(canon);
                await GM_setValue(KEY_DONE_FBCDN, doneArr);
                await GM_download({ url: rawUrl, name: 'video.mp4' });
                console.log('[FB Video Saver] Download video.mp4 depuis fbcdn :', canon);
            }
        } catch (e) {
            console.error('[FB Video Saver] GM_download error', e);
        }
        setTimeout(() => {
            try { window.close(); } catch (_) {}
        }, 1000);
        return;
    }

    // cobalt.tools: remplir le champ + marquer comme DONE + lancer download
    if (HOST === 'cobalt.tools') {
        const urlToProcess = await GM_getValue(KEY_PENDING_URL, '');
        if (!urlToProcess)
            return;
        await GM_setValue(KEY_PENDING_URL, '');

        const tryFill = () => {
            const input = document.querySelector('#link-area');
            if (!input)
                return false;
            input.value = urlToProcess;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('[FB Video Saver] URL collée dans #link-area');
            addToDoneList(urlToProcess).catch(() => {});
            return true;
        };

        let filled = false;
        for (let i = 0; i < 20; i++) {
            filled = tryFill();
            if (filled)
                break;
            await sleep(500);
        }
        if (!filled) {
            console.warn('[FB Video Saver] Impossible de remplir le champ sur Cobalt');
            return;
        }

        window.__fbVS_dlClicked = false;
        window.__fbVS_saveClicked = false;

        setTimeout(async () => {
            let clicked = false;
            for (let i = 0; i < 20 && !clicked; i++) {
                const btn =
                    document.querySelector('button#download-button.svelte-1s9ornv') ||
                    document.querySelector('#download-button');
                if (btn) {
                    if (!window.__fbVS_dlClicked) {
                        btn.click();
                        window.__fbVS_dlClicked = true;
                        console.log('[FB Video Saver] Clic sur #download-button (une seule fois)');
                    }
                    clicked = true;
                    break;
                }
                await sleep(200);
            }
            if (!clicked)
                console.warn('[FB Video Saver] #download-button introuvable');

            setTimeout(async () => {
                let clickedSave = false;
                for (let j = 0; j < 30 && !clickedSave; j++) {
                    const saveBtn =
                        document.querySelector('button#button-save-download') ||
                        document.querySelector('#button-save-download');

                    if (saveBtn) {
                        if (!window.__fbVS_saveClicked) {
                            saveBtn.click();
                            window.__fbVS_saveClicked = true;
                            console.log('[FB Video Saver] Clic sur #button-save-download (1 fois)');
                        }
                        clickedSave = true;
                        break;
                    }
                    await sleep(300);
                }
                if (!clickedSave)
                    console.warn('[FB Video Saver] #button-save-download non trouvé (OK si non proposé)');
                setTimeout(() => {
                    console.log('[FB Video Saver] Fermeture auto de Cobalt');
                    try { window.close(); } catch (_) {}
                }, 5000);
            }, 4000);
        }, 2000);
        return;
    }

    if (!HOST.includes('facebook.com'))
        return;

    window.addEventListener('load', addUIButton);
    window.addEventListener('pushstate', checkUrlChange);
    window.addEventListener('replacestate', checkUrlChange);
    window.addEventListener('popstate', checkUrlChange);
    setInterval(checkUrlChange, 500);

    GM_registerMenuCommand('Download Video (via Cobalt, onglet séparé)', async () => {
        const url = window.location.href;
        if (!isSavedPage(url) && !isVideoUrl(url)) {
            alert('Aucune action disponible pour cette page.');
        } else {
            // reset anti-doublon fbcdn (download manuel)
            await GM_setValue(KEY_DONE_FBCDN, []);
            await downloadVisibleVideo();
        }
    });

    GM_registerMenuCommand('Process Saved Videos (via Cobalt, queue 20s)', processSavedVideos);
})();
