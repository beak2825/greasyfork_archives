// ==UserScript==
// @name         ilpost.it – MP3 tools & transcription
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Open, download and transcribe Il Post podcast MP3 files (AssemblyAI API key required)
// @author       Ovinomaster
// @match        https://www.ilpost.it/podcasts/*
// @icon         https://static-prod.cdnilpost.com/wp-content/uploads/favicon/favicon.ico
// @grant        none
// @license      CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @downloadURL https://update.greasyfork.org/scripts/502356/ilpostit%20%E2%80%93%20MP3%20tools%20%20transcription.user.js
// @updateURL https://update.greasyfork.org/scripts/502356/ilpostit%20%E2%80%93%20MP3%20tools%20%20transcription.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ============================================================
       CONFIGURATION
       ============================================================ */

    // Insert here your AssemblyAI API key
    const ASSEMBLYAI_API_KEY = 'PASTE_HERE_YOUR_API_KEY';
    const LARGE_FILE_MB = 500;
    const UI_LANG_STORAGE_KEY = 'ilpost-ui-lang';

    /* ============================================================
       LOCALIZATION
       ============================================================ */

    const I18N = {
        it: {
            open: '▶ Apri MP3',
            download: '⬇ Scarica MP3',
            copy: '📋 Copia URL MP3',
            transcribe: '📝 Trascrivi (.md)',
            audioBtn: v => `🌐 Audio: ${v}`,
            uiBtn: v => `🈯 UI: ${v}`,
            ready: 'Stato: pronto',
            uploading: 'Invio a AssemblyAI…',
            running: 'Trascrizione in corso…',
            done: '✔ Trascrizione completata',
            reqError: 'Errore richiesta',
            trError: 'Errore trascrizione',
            mp3NotFound: 'MP3 non trovato',
            urlCopied: '✔ URL copiato',
            mp3Downloaded: '✔ MP3 scaricato',
            downloading: 'Download MP3 in corso…',
            bigFile: mb =>
                `Il file pesa circa ${mb} MB.\nSu mobile potrebbe causare problemi di memoria.\nContinuare?`
        },
        en: {
            open: '▶ Open MP3',
            download: '⬇ Download MP3',
            copy: '📋 Copy MP3 URL',
            transcribe: '📝 Transcribe (.md)',
            audioBtn: v => `🌐 Audio: ${v}`,
            uiBtn: v => `🈯 UI: ${v}`,
            ready: 'Status: ready',
            uploading: 'Uploading to AssemblyAI…',
            running: 'Transcription in progress…',
            done: '✔ Transcription completed',
            reqError: 'Request error',
            trError: 'Transcription error',
            mp3NotFound: 'MP3 not found',
            urlCopied: '✔ URL copied',
            mp3Downloaded: '✔ MP3 downloaded',
            downloading: 'Downloading MP3…',
            bigFile: mb =>
                `The file is about ${mb} MB.\nThis may cause memory issues on mobile.\nContinue?`
        }
    };

    function detectUiLanguage() {
        const stored = localStorage.getItem(UI_LANG_STORAGE_KEY);
        if (stored) return stored;
        return navigator.language?.startsWith('en') ? 'en' : 'it';
    }

    let uiLang = detectUiLanguage();
    let T = I18N[uiLang];

    /* ============================================================
       HELPERS
       ============================================================ */

    function getMp3Url() {
        const audio = document.querySelector('audio');
        return audio?.querySelector('source')?.src || audio?.src || null;
    }

    function sanitizeFilename(text) {
        return text.replace(/[<>:"/\\|?*]+/g, '').trim();
    }

    function downloadFile(filename, blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function formatTimestamp(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }

    function buildMarkdown(title, paragraphs) {
        let md = `# ${title}\n\n---\n\n`;
        paragraphs.forEach((p, i) => {
            const ts = p.start ? ` (${formatTimestamp(p.start)})` : '';
            md += `## Section ${i + 1}${ts}\n\n${p.text}\n\n`;
        });
        return md;
    }

    /* ============================================================
       UI
       ============================================================ */

    const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
    const COLORS = {
        bg: isDark ? '#1f1f1f' : '#fff6cc',
        border: isDark ? '#444' : '#e5e5e5',
        text: isDark ? '#eee' : '#000',
        button: '#ffe000'
    };

    function createButton(label) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.padding = '6px 10px';
        btn.style.marginRight = '6px';
        btn.style.marginBottom = '6px';
        btn.style.border = '1px solid #b4b5b6';
        btn.style.borderRadius = '6px';
        btn.style.background = COLORS.button;
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '13px';
        return btn;
    }

    const panel = document.createElement('div');
    panel.style.border = `1px solid ${COLORS.border}`;
    panel.style.padding = '10px';
    panel.style.marginTop = '10px';
    panel.style.background = COLORS.bg;
    panel.style.color = COLORS.text;
    panel.style.fontFamily = 'Red Hat Text, sans-serif';

    const rowMp3 = document.createElement('div');
    const rowTools = document.createElement('div');

    const openBtn = createButton(T.open);
    const downloadBtn = createButton(T.download);
    const copyBtn = createButton(T.copy);
    const transcribeBtn = createButton(T.transcribe);

    let audioLang = 'IT';
    const audioLangCycle = ['IT', 'EN', 'AUTO'];
    const audioLangBtn = createButton(T.audioBtn(audioLang));

    const uiLangCycle = ['IT', 'EN'];
    const uiLangBtn = createButton(T.uiBtn(uiLang.toUpperCase()));

    const statusEl = document.createElement('div');
    statusEl.textContent = T.ready;
    statusEl.style.fontSize = '13px';

    rowMp3.append(openBtn, downloadBtn, copyBtn);
    rowTools.append(transcribeBtn, audioLangBtn, uiLangBtn);

    panel.append(rowMp3, rowTools, statusEl);

    /* ============================================================
       ACTIONS
       ============================================================ */

    audioLangBtn.onclick = () => {
        audioLang = audioLangCycle[(audioLangCycle.indexOf(audioLang) + 1) % audioLangCycle.length];
        audioLangBtn.textContent = T.audioBtn(audioLang);
    };

    uiLangBtn.onclick = () => {
        const next = uiLangCycle[(uiLangCycle.indexOf(uiLang.toUpperCase()) + 1) % uiLangCycle.length];
        localStorage.setItem(UI_LANG_STORAGE_KEY, next.toLowerCase());
        location.reload();
    };

    openBtn.onclick = () => {
        const url = getMp3Url();
        url ? window.open(url, '_blank') : alert(T.mp3NotFound);
    };

    copyBtn.onclick = async () => {
        const url = getMp3Url();
        if (!url) return alert(T.mp3NotFound);
        await navigator.clipboard.writeText(url);
        statusEl.textContent = T.urlCopied;
    };

    downloadBtn.onclick = async () => {
        const url = getMp3Url();
        if (!url) return alert(T.mp3NotFound);

        const head = await fetch(url, { method: 'HEAD' });
        const size = head.headers.get('content-length');
        if (size) {
            const mb = Math.round(size / 1024 / 1024);
            if (mb > LARGE_FILE_MB && !confirm(T.bigFile(mb))) return;
        }

        statusEl.textContent = T.downloading;
        const response = await fetch(url);
        downloadFile(sanitizeFilename(document.title) + '.mp3', await response.blob());
        statusEl.textContent = T.mp3Downloaded;
    };

    transcribeBtn.onclick = async () => {
        const mp3Url = getMp3Url();
        if (!mp3Url) return alert(T.mp3NotFound);

        statusEl.textContent = T.uploading;

        const payload = { audio_url: mp3Url };
        if (audioLang !== 'AUTO') payload.language_code = audioLang.toLowerCase();

        const response = await fetch('https://api.assemblyai.com/v2/transcript', {
            method: 'POST',
            headers: {
                authorization: ASSEMBLYAI_API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const { id } = await response.json();
        if (!id) return statusEl.textContent = T.reqError;

        statusEl.textContent = T.running;

        let paragraphs;
        while (true) {
            await sleep(5000);
            const poll = await fetch(
                `https://api.assemblyai.com/v2/transcript/${id}`,
                { headers: { authorization: ASSEMBLYAI_API_KEY } }
            );
            const data = await poll.json();

            if (data.status === 'completed') {
                paragraphs = data.paragraphs?.paragraphs || [{ text: data.text }];
                break;
            }
            if (data.status === 'error') {
                statusEl.textContent = T.trError;
                return;
            }
        }

        const md = buildMarkdown(document.title, paragraphs);
        downloadFile(
            sanitizeFilename(document.title) + '.md',
            new Blob([md], { type: 'text/markdown;charset=utf-8' })
        );

        statusEl.textContent = T.done;
    };

    /* ============================================================
       INIT
       ============================================================ */

    window.addEventListener('load', () => {
        document.querySelector('audio')?.parentElement?.appendChild(panel);
    });

})();