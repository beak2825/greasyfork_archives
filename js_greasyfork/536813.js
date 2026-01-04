// ==UserScript==
// @name         bigscreen zoom subtitles
// @description  Größere Untertitel, keine Avatare, Header und alle Footer-Elemente werden bei Inaktivität ausgeblendet (inkl. .video-avatar__avatar-footer)
// @match        https://*.zoom.us/*
// @grant        none
// @version      0.3
// @license      MIT
// @namespace    https://greasyfork.org/users/1473309
// @downloadURL https://update.greasyfork.org/scripts/536813/bigscreen%20zoom%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/536813/bigscreen%20zoom%20subtitles.meta.js
// ==/UserScript==

// -------- Avatare und Icons ausblenden --------
function hideAvatarNameInShadowRoots() {
    function hideIn(root) {
        root.querySelectorAll('.video-avatar__avatar-name').forEach(e => { e.style.display = 'none'; });
        root.querySelectorAll('.zmu-data-selector-item__icon').forEach(e => { e.style.display = 'none'; });
    }
    hideIn(document);
    document.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) hideIn(el.shadowRoot);
    });
}
setInterval(hideAvatarNameInShadowRoots, 300);

// -------- Subtitlebox und Schrift anpassen --------
function resizeSubtitleBoxAndText() {
    function resizeIn(root) {
        root.querySelectorAll('.live-transcription-subtitle__box').forEach(e => {
            e.style.width = '1200px';
            e.style.height = '400px';
            e.style.minWidth = '1200px';
            e.style.minHeight = '400px';
            e.style.maxWidth = '1200px';
            e.style.maxHeight = '400px';
            e.style.removeProperty('background');
            e.style.removeProperty('background-color');
            e.style.background = 'none';
            e.style.backgroundColor = 'transparent';

            if (!e._zoomCustomListener) {
                e.addEventListener('mouseup', () => {
                    setTimeout(() => {
                        e.querySelectorAll('.live-transcription-subtitle__item, .live-transcription-subtitle__yellowitem').forEach(sub => {
                            sub.style.fontSize = '2em';
                        });
                    }, 10);
                });
                e._zoomCustomListener = true;
            }
        });

        root.querySelectorAll('#live-transcription-subtitle').forEach(e => {
            e.style.width = '100%';
            e.style.fontSize = '48px';
            e.style.lineHeight = '48px';
            e.style.maxWidth = 'none';
            e.style.minWidth = '0';
        });

        root.querySelectorAll('.live-transcription-subtitle__item, .live-transcription-subtitle__yellowitem').forEach(e => {
            e.style.fontSize = '48px';
            e.style.lineHeight = '48px';
            e.style.maxHeight = 'none';
            e.style.width = 'auto';
        });

        root.querySelectorAll('.live-transcription-subtitle').forEach(e => {
            e.style.width = 'auto';
        });

        root.querySelectorAll('.video-avatar__avatar').forEach(e => {
            e.style.removeProperty('background');
            e.style.removeProperty('background-color');
            e.style.background = 'none';
            e.style.backgroundColor = 'transparent';
        });
    }
    resizeIn(document);
    document.querySelectorAll('*').forEach(el => {
        if (el.shadowRoot) resizeIn(el.shadowRoot);
    });
}
setInterval(resizeSubtitleBoxAndText, 100);

// -------- Header, Footer und Avatar-Footer nach Inaktivität ausblenden --------
let uiTimeout = null;
let uiHidden = false;

function setUiBarVisible(visible) {
    // Meeting-Header
    document.querySelectorAll('.meeting-header').forEach(e => {
        e.style.display = visible ? '' : 'none';
    });
    // Footer-Bar (innen und ganz außen)
    document.querySelectorAll('#foot-bar, #wc-footer').forEach(e => {
        e.style.display = visible ? '' : 'none';
    });
    // Avatar-Footer
    document.querySelectorAll('.video-avatar__avatar-footer').forEach(e => {
        e.style.display = visible ? '' : 'none';
    });

        // === Mauszeiger ein-/ausblenden ===
    if (!visible) {
        document.body.style.cursor = 'none';
    } else {
        document.body.style.cursor = '';
    }
    uiHidden = !visible;
}

function onMouseMoveUiBar() {
    if (uiHidden) setUiBarVisible(true); // Sofort einblenden
    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(() => setUiBarVisible(false), 5000);
}

window.addEventListener('mousemove', onMouseMoveUiBar);

// Direkt nach Scriptstart: Header/Footer/Avatar-Footer nach 5 Sek. ausblenden
setUiBarVisible(true);
uiTimeout = setTimeout(() => setUiBarVisible(false), 5000);
