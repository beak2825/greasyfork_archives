// ==UserScript==
// @name          BetterHive
// @namespace     Violentmonkey Scripts
// @version       2.1.1
// @description   Nutzt die Hive-Bilderanalyse in der AdU sowie wenn ein Bild direkt geöffnet ist
// @author        Rho
// @license       Proprietary
// @match         https://photo.knuddels.de/*
// @match         https://photo.knuddelscom.de/*
// @grant         GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/542233/BetterHive.user.js
// @updateURL https://update.greasyfork.org/scripts/542233/BetterHive.meta.js
// ==/UserScript==

(function() {
    'use strict';

function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const opts = Object.assign({}, options, { signal: controller.signal });
    return fetch(url, opts).finally(() => clearTimeout(id));
}


async function retryHiveAnalyze(sendUrl, retries = 1, waitMs = 5000) {
    let lastErr = null;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const r = await hiveAnalyzeUrl(sendUrl);
            if (r && r.ok && r.data && r.data.data && Array.isArray(r.data.data.classes)) return r;
            throw new Error("invalid response");
        } catch (e) {
            lastErr = e;
            if (attempt >= retries) break;
            await sleep(waitMs);
        }
    }
    throw lastErr || new Error("failed");
}

function buildCdnVariantsForReverse(url) {
    const variants = ["m", "l", "vl"];
    return variants.map(v => ({
        variant: v,
        url: url
            .replace(/pro0(?:m|l|vl)/g, `pro0${v}`)
            .replace(/alb(\d+)(?:m|l|vl)/g, `alb$1${v}`)
    }));
}
function openReverseHubTabs(baseUrl) {
    const variants = buildCdnVariantsForReverse(baseUrl);

    const engines = [
        {
            key: "google",
            name: "Google",
            make: (u) => `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(u)}&client=app`
        },
        {
            key: "lens",
            name: "Google Lens",
            make: (u) => `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(u)}&hl=en&re=df&st=${Date.now()}&ep=gisbubu`
        },
        {
            key: "yandex",
            name: "Yandex",
            make: (u) => `https://yandex.com/images/search?url=${encodeURIComponent(u)}&rpt=imageview`
        },
        {
            key: "tineye",
            name: "TinEye",
            make: (u) => `https://www.tineye.com/search/?url=${encodeURIComponent(u)}`
        }
    ];

    const w = window.open('', '_blank');
    if (!w) return;

    const escapeHtml = (s) => String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const sectionsHtml = engines.map(eng => {
        const links = variants.map(v => {
            const href = eng.make(v.url);
            return `<li>
                <a class="rev-link" data-engine="${eng.key}" href="${href}" target="_blank" rel="noopener noreferrer">
                    <b>${v.variant}</b>: ${escapeHtml(v.url)}
                </a>
            </li>`;
        }).join("");

        return `
<section style="margin:16px 0; padding:12px; border:1px solid rgba(0,0,0,0.12); border-radius:10px;">
  <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
    <h3 style="margin:0;">${eng.name}</h3>
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="open-all" data-engine="${eng.key}" style="padding:6px 10px; font-size:14px; cursor:pointer;">Alle öffnen</button>
      <button class="open-vl" data-engine="${eng.key}" style="padding:6px 10px; font-size:14px; cursor:pointer;">Nur vl öffnen</button>
    </div>
  </div>
  <ul style="margin:10px 0 0 0; padding-left:18px; line-height:1.6; word-break:break-all;">
    ${links}
  </ul>
</section>`;
    }).join("");

    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Reverse Image – CDN Varianten</title>
</head>
<body style="font-family:system-ui,Segoe UI,Arial,sans-serif; padding:16px;">
  <h2 style="margin:0 0 10px 0;">Reverse Image – alle Dienste (m / l / vl)</h2>

  <div style="display:flex; gap:10px; flex-wrap:wrap; margin:12px 0 18px 0;">
    <button id="openAllGlobal" style="padding:7px 12px; font-size:14px; cursor:pointer;">Alle öffnen (alles)</button>
    <button id="openVlGlobal" style="padding:7px 12px; font-size:14px; cursor:pointer;">Nur vl öffnen (alles)</button>
  </div>

  ${sectionsHtml}

<script>
(function(){
  function openAllLinks(selector) {
    document.querySelectorAll(selector).forEach(a => window.open(a.href, '_blank'));
  }

  document.getElementById('openAllGlobal').onclick = function() {
    openAllLinks('a.rev-link');
  };

  document.getElementById('openVlGlobal').onclick = function() {
    document.querySelectorAll('a.rev-link').forEach(link => {
      if (link.textContent.trim().startsWith('vl:')) window.open(link.href, '_blank');
    });
  };

  document.querySelectorAll('button.open-all').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const key = btn.getAttribute('data-engine');
      openAllLinks('a.rev-link[data-engine="'+key+'"]');
    });
  });

  document.querySelectorAll('button.open-vl').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const key = btn.getAttribute('data-engine');
      document.querySelectorAll('a.rev-link[data-engine="'+key+'"]').forEach(link => {
        if (link.textContent.trim().startsWith('vl:')) window.open(link.href, '_blank');
      });
    });
  });
})();
</script>
</body></html>`;

    w.document.open();
    w.document.write(html);
    w.document.close();
}

    const PROXY_URL = 'https://rhotel.app/hive/api/?https://plugin.hivemoderation.com/api/v1/image/ai_detection';

    function generateUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function popupColorForScore(aiScore) {
        if (aiScore <= 0.20)      return "#1c982b";
        else if (aiScore < 0.70)  return "#98860d";
        else                      return "#a82d2d";
    }

    function colorForScore(entry) {
        if (entry.class === "not_ai_generated" || entry.class === "none") return "#36ce43";
        if (entry.score <= 0.20) return "#36ce43";
        if (entry.score < 0.70)  return "#e7c100";
        return "#e55454";
    }

    function niceClassName(cls) {
        const map = {
            "not_ai_generated": "Nicht KI",
            "ai_generated": "KI-Bild",
            "none": "Unbekannt",
            "inconclusive": "Unklar",
            "inconclusive_video": "Unklar (Video)",
            "deepfake": "Deepfake",
        };
        return map[cls] || cls.replace(/_/g, " ");
    }

    function copyToClipboard(text) {
    try {
        if (typeof GM_setClipboard === "function") {
            GM_setClipboard(text);
            return;
        }
    } catch (_) {}

    const fallback = () => {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.top = "-1000px";
        ta.style.left = "-1000px";
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try { document.execCommand("copy"); } catch (_) {}
        ta.remove();
    };

    try {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).catch(() => fallback());
        } else {
            fallback();
        }
    } catch (_) {
        fallback();
    }
}

    function showPopup(data, jsonText) {
        document.querySelectorAll('.hive-popup').forEach(e => e.remove());
        let tableRows = '';
        let top = null;

        const classes = (data?.data?.classes || [])
            .filter(entry => entry.score > 0.01 || ['ai_generated','not_ai_generated','none'].includes(entry.class))
            .sort((a, b) => b.score - a.score);

        if (classes.length) top = classes[0];

        let copyList = `Hive-Bilderanalyse:
${classes.map(entry => `${niceClassName(entry.class)} = ${(entry.score*100).toFixed(2)}%`).join('\n')}

Bild-URL:
${window._hiveImgUrlToCopy || ''}`;

        for (const entry of classes) {
            const color = colorForScore(entry);
            tableRows += `<tr>
                <td style="padding:6px 0 6px 10px;">
                    <span style="background:${color};display:inline-block;width:14px;height:14px;border-radius:3px;margin-right:8px;border:1.5px solid #fff;vertical-align:middle;"></span>
                </td>
                <td style="padding:6px 0 6px 0; font-weight:${entry.class === top.class ? 'bold' : 'normal'}; word-break:break-all; text-align:left;">
                    ${niceClassName(entry.class)}
                </td>
                <td style="padding:6px 10px 6px 10px; font-family:monospace; color:${color}; font-weight:bold; text-align:right;">
                    ${(entry.score*100).toFixed(2)}%
                </td>
            </tr>`;
        }

        let aiClass = (data?.data?.classes || []).find(c => c.class === 'ai_generated');
        let aiScore = aiClass ? aiClass.score : 0;
        let popupBg = popupColorForScore(aiScore);

        const isAI = (aiScore >= 0.5);
        const popup = document.createElement('div');
        popup.className = 'hive-popup';
        popup.style.position = 'fixed';
        popup.style.top = '32px';
        popup.style.right = '36px';
        popup.style.background = popupBg;
        popup.style.color = '#fff';
        popup.style.padding = '24px 22px 18px 22px';
        popup.style.borderRadius = '16px';
        popup.style.zIndex = 99999;
        popup.style.boxShadow = '0 9px 32px rgba(0,0,0,0.23)';
        popup.style.fontSize = '17px';
        popup.style.fontFamily = '"Segoe UI", Arial, "Helvetica Neue", sans-serif';
        popup.style.width = '300px';
        popup.style.maxWidth = '300px';

        popup.innerHTML = `
            <div style="font-size:21px;font-weight:700;margin-bottom:6px;text-align:center;">BetterHive Bildercheck</div>
            <div style="font-size:16px;text-align:center;">
                <b>Ergebnis:</b> <span style="color:#fff;">${isAI ? "KI-Bild" : "Echtes Bild"}</span>
                <br><b>KI-Wahrscheinlichkeit:</b> ${(aiScore*100).toFixed(2)}%
            </div>
            <div style="margin-top:18px;">
                <table style="width:100%;table-layout:fixed;border-collapse:collapse;font-size:15px;background:rgba(0,0,0,0.10);border-radius:8px;overflow:hidden;">
                    <thead>
                        <tr>
                            <th style="width:32px; padding-left:10px;"></th>
                            <th style="text-align:left;">Klasse</th>
                            <th style="text-align:right; padding-right:10px;">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            </div>
            <div style="margin-top:14px; display:flex; gap:12px; align-items:center; justify-content:center;">
                <button id="hive-popup-close" style="background:#fff;color:#222;padding:6px 22px;border-radius:6px;border:none;cursor:pointer;font-size:15px;">Schließen</button>
                <button id="hive-popup-copy" style="background:#fff;color:#222;padding:6px 22px;border-radius:6px;border:none;cursor:pointer;font-size:15px;">Kopieren</button>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('hive-popup-close').onclick = () => popup.remove();
        document.getElementById('hive-popup-copy').onclick = function() {
            copyToClipboard(currentCopyText);
            this.textContent = "Kopiert!";
            setTimeout(() => { this.textContent = "Kopieren"; }, 1600);
        };
    }

    function buildCdnVariantUrls(imgUrl) {
        const variants = ["m", "l", "vl"];

        const out = {};
        for (const v of variants) {
            let u = imgUrl;

            u = u.replace(/pro0(?:m|l|vl)/g, `pro0${v}`);

            u = u.replace(/alb(\d+)(?:m|l|vl)/g, `alb$1${v}`);

            out[v] = u;
        }
        return out;
    }

    async function hiveAnalyzeUrl(sendUrl) {
        const res = await fetchWithTimeout(sendUrl, {}, 20000);
        const blob = await res.blob();

        const formData = new FormData();
        const fileName = sendUrl.split('/').pop() || 'file.png';
        formData.append('media', blob, fileName);
        formData.append('request_id', generateUuid());

        const response = await fetchWithTimeout(PROXY_URL, { method: 'POST', body: formData }, 20000);
        const text = await response.text();

        try {
            const data = JSON.parse(text);
            return { ok: true, data, raw: text };
        } catch (e) {
            return { ok: false, data: null, raw: text };
        }
    }

    function showPopupMulti(resultsByVariant) {
        window._hivePopupState = window._hivePopupState || { current: "vl", currentCopyText: "" };
        const state = window._hivePopupState;

        const variants = ["m", "l", "vl"];
        const existing = document.querySelector('.hive-popup');
        const popup = existing || document.createElement('div');

        popup.className = 'hive-popup';
        popup.style.position = 'fixed';
        popup.style.top = '32px';
        popup.style.right = '36px';
        popup.style.zIndex = 99999;

        if (!existing) document.body.appendChild(popup);

        function escapeUnderscoreIfNeeded(url) {
            return url ? url.replace(/_/g, '\\_') : url;
        }

        function render(variant) {
            state.current = variant;

            const pack = resultsByVariant[variant] || { sendUrl: "", pending: true, hive: { data: { classes: [] } } };
            const data = pack.hive || { data: { classes: [] } };
            const sendUrl = pack.sendUrl || "";
            const stateStr = pack.state || (pack.pending ? 'pending' : 'done');
            const manual = (stateStr === 'manual');
            const pending = (stateStr === 'pending' || stateStr === 'retrying');

            const classes = (data?.data?.classes || [])
                .filter(entry => entry.score > 0.01 || ['ai_generated','not_ai_generated','none'].includes(entry.class))
                .sort((a, b) => b.score - a.score);

            let aiClass = (data?.data?.classes || []).find(c => c.class === 'ai_generated');
            let aiScore = aiClass ? aiClass.score : 0;

            const popupBg = (pending || manual) ? "#444" : popupColorForScore(aiScore);
            const isAI = (!pending && !manual && aiScore >= 0.5);

            let tableRows = '';
            if (pending) {
                tableRows = `<tr>
                    <td style="padding:10px 10px 10px 10px; text-align:center; font-size:14px;" colspan="3">
                        Wird geprüft…
                    </td>
                </tr>`;
            } else if (manual) {
                tableRows = `<tr><td style="padding:10px 10px 10px 10px; text-align:center; font-size:14px;" colspan="3">Nicht geprüft</td></tr>`;

            } else {
                const top = classes.length ? classes[0] : null;
                for (const entry of classes) {
                    const color = colorForScore(entry);
                    tableRows += `<tr>
                        <td style="padding:6px 0 6px 10px;">
                            <span style="background:${color};display:inline-block;width:14px;height:14px;border-radius:3px;margin-right:8px;border:1.5px solid #fff;vertical-align:middle;"></span>
                        </td>
                        <td style="padding:6px 0 6px 0; font-weight:${top && entry.class === top.class ? 'bold' : 'normal'}; word-break:break-all; text-align:left;">
                            ${niceClassName(entry.class)}
                        </td>
                        <td style="padding:6px 10px 6px 10px; font-family:monospace; color:${color}; font-weight:bold; text-align:right;">
                            ${(entry.score*100).toFixed(2)}%
                        </td>
                    </tr>`;
                }
                if (!tableRows) {
                    tableRows = `<tr><td style="padding:10px 10px 10px 10px; text-align:center; font-size:14px;" colspan="3">Keine Daten</td></tr>`;
                }
            }

            if (!pending && !manual) {
                const escapedUrl = escapeUnderscoreIfNeeded(sendUrl);
                state.currentCopyText = `Hive-Bilderanalyse (${variant}):\n\n${classes.map(entry => `${niceClassName(entry.class)} = ${(entry.score*100).toFixed(2)}%`).join('\n')}\n\nBild-URL:\n${escapedUrl}`;
            } else {
                state.currentCopyText = "";
            }

            popup.style.background = popupBg;
            popup.style.color = '#fff';
            popup.style.padding = '22px 20px 16px 20px';
            popup.style.borderRadius = '16px';
            popup.style.boxShadow = '0 9px 32px rgba(0,0,0,0.23)';
            popup.style.fontSize = '16px';
            popup.style.fontFamily = '"Segoe UI", Arial, "Helvetica Neue", sans-serif';
            popup.style.width = '340px';
            popup.style.maxWidth = '340px';

            const progress = variants.map(v => {
                    const st = resultsByVariant[v] ? (resultsByVariant[v].state || (resultsByVariant[v].pending ? 'pending' : 'done')) : 'pending';
                    if (st === 'done') return '✓';
                    if (st === 'failed') return '✗';
                    return '…';
                }).join(' ');

            popup.innerHTML = `
                <div style="font-size:21px;font-weight:700;margin-bottom:8px;text-align:center;">BetterHive Bildercheck</div>

                <div style="display:flex; gap:8px; justify-content:center; margin:6px 0 8px 0;">
                    ${variants.map(v => `
                        <button data-variant="${v}" style="
                            background:${v===variant ? '#fff' : 'rgba(255,255,255,0.18)'};
                            color:${v===variant ? '#222' : '#fff'};
                            padding:6px 12px;border-radius:10px;border:none;cursor:pointer;font-size:14px;">
                            ${v}
                        </button>
                    `).join('')}
                </div>

                <div style="text-align:center; font-size:13px; opacity:0.95; margin-bottom:10px;">
                    Status: ${progress} &nbsp;|&nbsp; Versuche: ${(resultsByVariant[variant] && resultsByVariant[variant].tries) ? resultsByVariant[variant].tries : 0}
                </div>

                <div style="font-size:15px;text-align:center;">
                    <b>Ergebnis:</b> <span style="color:#fff;">${pending ? "Wird geprüft…" : (manual ? "Nicht geprüft" : (isAI ? "KI-Bild" : "Echtes Bild"))}</span>
                    <br><b>KI-Wahrscheinlichkeit:</b> ${pending ? "…" : (manual ? "—" : `${(aiScore*100).toFixed(2)}%`)}
                    <div style="margin-top:8px; font-size:12px; opacity:0.9; word-break:break-all;">
                        ${sendUrl}
                    </div>
                </div>

                <div style="margin-top:16px;">
                    <table style="width:100%;table-layout:fixed;border-collapse:collapse;font-size:14px;background:rgba(0,0,0,0.10);border-radius:8px;overflow:hidden;">
                        <thead>
                            <tr>
                                <th style="width:32px; padding-left:10px;"></th>
                                <th style="text-align:left;">Klasse</th>
                                <th style="text-align:right; padding-right:10px;">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableRows}
                        </tbody>
                    </table>
                </div>

                <div style="margin-top:14px; display:flex; gap:12px; align-items:center; justify-content:center;">
                    <button id="hive-popup-close" style="background:#fff;color:#222;padding:6px 20px;border-radius:6px;border:none;cursor:pointer;font-size:15px;">Schließen</button>
                    ${stateStr === 'manual' ? `<button id="hive-popup-run" style="background:#fff;color:#222;padding:6px 20px;border-radius:6px;border:none;cursor:pointer;font-size:15px;">Prüfen</button>` : ``}
                    <button id="hive-popup-copy" ${stateStr !== 'done' ? "disabled" : ""} style="background:#fff;color:#222;padding:6px 20px;border-radius:6px;border:none;cursor:pointer;font-size:15px; opacity:${stateStr !== 'done' ? "0.6" : "1"};">Kopieren</button>
                </div>
            `;

            popup.querySelectorAll('button[data-variant]').forEach(btn => {
                btn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    render(btn.getAttribute('data-variant'));
                };
            });

            popup.querySelector('#hive-popup-close').onclick = () => { try { if (window._hiveAbort) window._hiveAbort.aborted = true; } catch(_) {} popup.remove(); };
            popup.querySelector('#hive-popup-copy').onclick = function() {
                if (!state.currentCopyText) return;
                copyToClipboard(state.currentCopyText);
                this.textContent = "Kopiert!";
                setTimeout(() => { this.textContent = "Kopieren"; }, 1600);
            };

            const runBtn = popup.querySelector('#hive-popup-run');
            if (runBtn) {
                runBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    try { if (typeof window._hiveRunVariant === 'function') window._hiveRunVariant(variant); } catch(_) {}
                };
            }
        }

        render(state.current || "vl");
}

    async function analyzeImageAsBlob(imgUrl) {
        const urls = buildCdnVariantUrls(imgUrl);
        window._hiveImgUrlToCopy = urls.vl || imgUrl;

        window._hiveAbort = { aborted: false };

        const results = {
            m:  { sendUrl: urls.m  || imgUrl, pending: false, state: 'manual', tries: 0, hive: { data: { classes: [] } } },
            l:  { sendUrl: urls.l  || imgUrl, pending: false, state: 'manual', tries: 0, hive: { data: { classes: [] } } },
            vl: { sendUrl: urls.vl || imgUrl, pending: true,  state: 'pending', tries: 0, hive: { data: { classes: [] } } }
        };

        window._hiveRunVariant = async (variant) => {
            if (!results[variant]) return;
            if (results[variant].state === 'done') return;

            const sendUrl = results[variant].sendUrl;

            results[variant].pending = true;
            results[variant].state = 'pending';
            showPopupMulti(results);

            while (true) {
                if (window._hiveAbort && window._hiveAbort.aborted) return;

                results[variant].tries = (results[variant].tries || 0) + 1;
                results[variant].state = results[variant].tries > 1 ? 'retrying' : 'pending';
                showPopupMulti(results);

                try {
                    const r = await hiveAnalyzeUrl(sendUrl);
                    const ok = (r && r.ok && r.data && r.data.data && Array.isArray(r.data.data.classes) && r.data.data.classes.length);
                    if (ok) {
                        results[variant] = { sendUrl, pending: false, state: 'done', tries: results[variant].tries, hive: r.data, raw: r.raw };
                        showPopupMulti(results);
                        break;
                    }
                } catch (e) {}

                if (window._hiveAbort && window._hiveAbort.aborted) return;
            }
        };

        showPopupMulti(results);

        await window._hiveRunVariant('vl');
}

    const isImage = (
        document.contentType &&
        document.contentType.startsWith('image/')
    );
    if (isImage) {
        const absUrl = window.location.href;

        const style = document.createElement('style');
        style.textContent = `
        .hive-bar {
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0,0,0,0.7);
            padding: 8px 12px;
            border-radius: 8px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }
        .hive-bar button {
            background: #206CFD;
            color: #fff;
            border: none;
            border-radius: 4px;
            padding: 4px 13px;
            font-size: 15px;
            cursor: pointer;
        }
        .hive-bar button:hover {
            background: #338af3;
        }
        .hive-bar .fake {
            background: #5cb85c;
        }
        .hive-popup { font-family: "Segoe UI", Arial, "Helvetica Neue", sans-serif !important; }
        `;
        document.head.appendChild(style);

        const bar = document.createElement('div');
        bar.className = 'hive-bar';

        const kiButton = document.createElement('button');
        kiButton.textContent = 'KI';
        kiButton.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            analyzeImageAsBlob(absUrl);
        });

        const fakeButton = document.createElement('button');
        fakeButton.textContent = 'Fake';
        fakeButton.className = 'fake';
        fakeButton.addEventListener('click', e => {
            e.stopPropagation();
            e.preventDefault();
            const urls = [
                `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(absUrl)}&client=app`,
                `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(absUrl)}&hl=en&re=df&st=${+ new Date()}&ep=gisbubu`,
                `https://yandex.com/images/search?url=${encodeURIComponent(absUrl)}&rpt=imageview`,
                `https://www.tineye.com/search/?url=${encodeURIComponent(absUrl)}`
            ];
            openReverseHubTabs(absUrl);
        });

        bar.appendChild(kiButton);
        bar.appendChild(fakeButton);
        document.body.appendChild(bar);
        return;
    }

    const images = document.querySelectorAll('img');
    images.forEach(img => {
        const a = document.createElement('a');
        a.href = img.src;
        const absUrl = a.href;

        const addButtons = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            if (width < 100 || height < 100) return;
            const wrapper = document.createElement('div');
            wrapper.className = 'hive-wrapper';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);

            const container = document.createElement('div');
            container.className = 'hive-container';

            const toggleButton = document.createElement('button');
            toggleButton.className = 'hive-toggle';
            toggleButton.textContent = '⋯';

            const kiButton = document.createElement('button');
            kiButton.className = 'hive-button';
            kiButton.textContent = 'KI';
            kiButton.style.display = 'none';
            kiButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                analyzeImageAsBlob(absUrl);
            });

            const fakeButton = document.createElement('button');
            fakeButton.className = 'hive-fake';
            fakeButton.textContent = 'Fake';
            fakeButton.style.display = 'none';
            fakeButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                const urls = [
                    `https://www.google.com/searchbyimage?image_url=${encodeURIComponent(absUrl)}&client=app`,
                    `https://lens.google.com/uploadbyurl?url=${encodeURIComponent(absUrl)}&hl=en&re=df&st=${+ new Date()}&ep=gisbubu`,
                    `https://yandex.com/images/search?url=${encodeURIComponent(absUrl)}&rpt=imageview`,
                    `https://www.tineye.com/search/?url=${encodeURIComponent(absUrl)}`
                ];
                openReverseHubTabs(absUrl);
            });

            const closeButton = document.createElement('button');
            closeButton.className = 'hive-close';
            closeButton.textContent = 'X';
            closeButton.style.display = 'none';
            closeButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                kiButton.style.display = 'none';
                fakeButton.style.display = 'none';
                closeButton.style.display = 'none';
                toggleButton.style.display = 'inline-block';
            });

            toggleButton.addEventListener('click', e => {
                e.stopPropagation();
                e.preventDefault();
                kiButton.style.display = 'inline-block';
                fakeButton.style.display = 'inline-block';
                closeButton.style.display = 'inline-block';
                toggleButton.style.display = 'none';
            });

            container.appendChild(toggleButton);
            container.appendChild(kiButton);
            container.appendChild(fakeButton);
            container.appendChild(closeButton);
            wrapper.appendChild(container);
        };

        if (img.complete) addButtons();
        else img.addEventListener('load', addButtons);
    });

    const style = document.createElement('style');
    style.textContent = `
    .hive-popup { animation: hive-popup-fadein 0.3s; font-family: "Segoe UI", Arial, "Helvetica Neue", sans-serif !important;}
    @keyframes hive-popup-fadein {
        from { opacity: 0; transform: translateY(-18px);}
        to { opacity: 1; transform: translateY(0);}
    }
    .hive-container {
        position: absolute;
        top: 4px;
        right: 4px;
        display: flex;
        gap: 2px;
        z-index: 9999;
    }
    .hive-button, .hive-fake, .hive-close, .hive-toggle {
        background: #206CFD;
        color: #fff;
        border: none;
        border-radius: 3px;
        padding: 2px 6px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0.85;
    }
    .hive-fake { background: #5cb85c; }
    .hive-close { background: #d9534f; }
    .hive-toggle { background: #888; }
    .hive-button:hover, .hive-fake:hover, .hive-close:hover, .hive-toggle:hover { opacity: 1; }
    .hive-wrapper { position: relative; display: inline-block; }
    `;
    document.head.appendChild(style);

})();