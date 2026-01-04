// ==UserScript==
// @name         Wrench
// @namespace    http://tampermonkey.net/
// @version      2.9.1
// @description  Analyse passive d’un site web : robots.txt, métadonnées, IP / DNS, commentaires HTML et outils OSINT externes.
// @author       Th3rd
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      ipwhois.app
// @connect      dns.google
// @connect      www.google.com
// @connect      urlscan.io
// @connect      shodan.io
// @connect      hunter.io
// @connect      who.is
// @connect      web.archive.org
// @grant        unsafeWindow
// @connect      *
// @run-at       document-end
// @license      GPL-3.0
// @icon         https://github.com/Th3rdMan/wrench-userscript/blob/main/wrench.png?raw=true
// @namespace    https://github.com/Th3rdMan/wrench-userscript
// @downloadURL https://update.greasyfork.org/scripts/538478/Wrench.user.js
// @updateURL https://update.greasyfork.org/scripts/538478/Wrench.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top !== window) return;

    const ICON_WRENCH = 'data:image/png;base64,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';
    const ICON_CLOSE = 'data:image/png;base64,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';
    const baseUrl = location.origin;
    const robotsUrl = `${baseUrl}/robots.txt`;
    // flagcdn bloqué par CSP
    const FLAG_EMOJIS = {
        "AD": "🇦🇩", "AE": "🇦🇪", "AF": "🇦🇫", "AG": "🇦🇬", "AI": "🇦🇮", "AL": "🇦🇱", "AM": "🇦🇲", "AO": "🇦🇴",
        "AR": "🇦🇷", "AS": "🇦🇸", "AT": "🇦🇹", "AU": "🇦🇺", "AW": "🇦🇼", "AX": "🇦🇽", "AZ": "🇦🇿", "BA": "🇧🇦",
        "BB": "🇧🇧", "BD": "🇧🇩", "BE": "🇧🇪", "BF": "🇧🇫", "BG": "🇧🇬", "BH": "🇧🇭", "BI": "🇧🇮", "BJ": "🇧🇯",
        "BL": "🇧🇱", "BM": "🇧🇲", "BN": "🇧🇳", "BO": "🇧🇴", "BQ": "🇧🇶", "BR": "🇧🇷", "BS": "🇧🇸", "BT": "🇧🇹",
        "BV": "🇧🇻", "BW": "🇧🇼", "BY": "🇧🇾", "BZ": "🇧🇿", "CA": "🇨🇦", "CC": "🇨🇨", "CD": "🇨🇩", "CF": "🇨🇫",
        "CG": "🇨🇬", "CH": "🇨🇭", "CI": "🇨🇮", "CK": "🇨🇰", "CL": "🇨🇱", "CM": "🇨🇲", "CN": "🇨🇳", "CO": "🇨🇴",
        "CR": "🇨🇷", "CU": "🇨🇺", "CV": "🇨🇻", "CW": "🇨🇼", "CX": "🇨🇽", "CY": "🇨🇾", "CZ": "🇨🇿", "DE": "🇩🇪",
        "DJ": "🇩🇯", "DK": "🇩🇰", "DM": "🇩🇲", "DO": "🇩🇴", "DZ": "🇩🇿", "EC": "🇪🇨", "EE": "🇪🇪", "EG": "🇪🇬",
        "EH": "🇪🇭", "ER": "🇪🇷", "ES": "🇪🇸", "ET": "🇪🇹", "FI": "🇫🇮", "FJ": "🇫🇯", "FM": "🇫🇲", "FO": "🇫🇴",
        "FR": "🇫🇷", "GA": "🇬🇦", "GB": "🇬🇧", "GD": "🇬🇩", "GE": "🇬🇪", "GF": "🇬🇫", "GG": "🇬🇬", "GH": "🇬🇭",
        "GI": "🇬🇮", "GL": "🇬🇱", "GM": "🇬🇲", "GN": "🇬🇳", "GP": "🇬🇵", "GQ": "🇬🇶", "GR": "🇬🇷", "GT": "🇬🇹",
        "GU": "🇬🇺", "GW": "🇬🇼", "GY": "🇬🇾", "HK": "🇭🇰", "HM": "🇭🇲", "HN": "🇭🇳", "HR": "🇭🇷", "HT": "🇭🇹",
        "HU": "🇭🇺", "ID": "🇮🇩", "IE": "🇮🇪", "IL": "🇮🇱", "IM": "🇮🇲", "IN": "🇮🇳", "IO": "🇮🇴", "IQ": "🇮🇶",
        "IR": "🇮🇷", "IS": "🇮🇸", "IT": "🇮🇹", "JE": "🇯🇪", "JM": "🇯🇲", "JO": "🇯🇴", "JP": "🇯🇵", "KE": "🇰🇪",
        "KG": "🇰🇬", "KH": "🇰🇭", "KI": "🇰🇮", "KM": "🇰🇲", "KN": "🇰🇳", "KP": "🇰🇵", "KR": "🇰🇷", "KW": "🇰🇼",
        "KY": "🇰🇾", "KZ": "🇰🇿", "LA": "🇱🇦", "LB": "🇱🇧", "LC": "🇱🇨", "LI": "🇱🇮", "LK": "🇱🇰", "LR": "🇱🇷",
        "LS": "🇱🇸", "LT": "🇱🇹", "LU": "🇱🇺", "LV": "🇱🇻", "LY": "🇱🇾", "MA": "🇲🇦", "MC": "🇲🇨", "MD": "🇲🇩",
        "ME": "🇲🇪", "MF": "🇲🇫", "MG": "🇲🇬", "MH": "🇲🇭", "MK": "🇲🇰", "ML": "🇲🇱", "MM": "🇲🇲", "MN": "🇲🇳",
        "MO": "🇲🇴", "MP": "🇲🇵", "MQ": "🇲🇶", "MR": "🇲🇷", "MS": "🇲🇸", "MT": "🇲🇹", "MU": "🇲🇺", "MV": "🇲🇻",
        "MW": "🇲🇼", "MX": "🇲🇽", "MY": "🇲🇾", "MZ": "🇲🇿", "NA": "🇳🇦", "NC": "🇳🇨", "NE": "🇳🇪", "NF": "🇳🇫",
        "NG": "🇳🇬", "NI": "🇳🇮", "NL": "🇳🇱", "NO": "🇳🇴", "NP": "🇳🇵", "NR": "🇳🇷", "NU": "🇳🇺", "NZ": "🇳🇿",
        "OM": "🇴🇲", "PA": "🇵🇦", "PE": "🇵🇪", "PF": "🇵🇫", "PG": "🇵🇬", "PH": "🇵🇭", "PK": "🇵🇰", "PL": "🇵🇱",
        "PM": "🇵🇲", "PN": "🇵🇳", "PR": "🇵🇷", "PT": "🇵🇹", "PW": "🇵🇼", "PY": "🇵🇾", "QA": "🇶🇦", "RE": "🇷🇪",
        "RO": "🇷🇴", "RS": "🇷🇸", "RU": "🇷🇺", "RW": "🇷🇼", "SA": "🇸🇦", "SB": "🇸🇧", "SC": "🇸🇨", "SD": "🇸🇩",
        "SE": "🇸🇪", "SG": "🇸🇬", "SH": "🇸🇭", "SI": "🇸🇮", "SJ": "🇸🇯", "SK": "🇸🇰", "SL": "🇸🇱", "SM": "🇸🇲",
        "SN": "🇸🇳", "SO": "🇸🇴", "SR": "🇸🇷", "SS": "🇸🇸", "ST": "🇸🇹", "SV": "🇸🇻", "SX": "🇸🇽", "SY": "🇸🇾",
        "SZ": "🇸🇿", "TC": "🇹🇨", "TD": "🇹🇩", "TF": "🇹🇫", "TG": "🇹🇬", "TH": "🇹🇭", "TJ": "🇹🇯", "TK": "🇹🇰",
        "TL": "🇹🇱", "TM": "🇹🇲", "TN": "🇹🇳", "TO": "🇹🇴", "TR": "🇹🇷", "TT": "🇹🇹", "TV": "🇹🇻", "TZ": "🇹🇿",
        "UA": "🇺🇦", "UG": "🇺🇬", "UM": "🇺🇲", "US": "🇺🇸", "UY": "🇺🇾", "UZ": "🇺🇿", "VA": "🇻🇦", "VC": "🇻🇨",
        "VE": "🇻🇪", "VG": "🇻🇬", "VI": "🇻🇮", "VN": "🇻🇳", "VU": "🇻🇺", "WF": "🇼🇫", "WS": "🇼🇸", "YE": "🇾🇪",
        "YT": "🇾🇹", "ZA": "🇿🇦", "ZM": "🇿🇲", "ZW": "🇿🇼"
    };
    function getFlagEmoji(countryCode) {
    if (typeof countryCode !== 'string' || !countryCode) return '';
    return FLAG_EMOJIS[countryCode.toUpperCase()] || '';
    }

    let bannerVisible = false;

    const toggleIcon = document.createElement('img');
    toggleIcon.src = ICON_WRENCH;
    toggleIcon.style.cssText = 'position:fixed;top:60px;right:10px;width:36px;height:36px;cursor:pointer;z-index:100000;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);transition:transform 0.2s;';
    toggleIcon.addEventListener('mouseenter', () => { toggleIcon.style.transform = 'scale(1.1)'; });
    toggleIcon.addEventListener('mouseleave', () => { toggleIcon.style.transform = 'scale(1)'; });
    toggleIcon.addEventListener('click', toggleBanner);
    document.body.appendChild(toggleIcon);

    const banner = document.createElement('div');
    banner.id = 'osinter-banner';
    banner.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;max-height:300px;overflow:auto;background:#111;color:#0f0;font-family:monospace;font-size:13px;white-space:pre-wrap;padding:10px 16px;z-index:99999;border-bottom:2px solid #444;box-shadow:0 2px 4px rgba(0,0,0,0.3);';
    document.body.prepend(banner);

    const menu = document.createElement('div');
    menu.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px;';
    banner.appendChild(menu);

    const content = document.createElement('div');
    banner.appendChild(content);

    function addButton(label, action) {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.cssText = 'background:#222;color:#0f0;border:1px solid #444;padding:4px 8px;cursor:pointer;font-family:monospace;';
        btn.addEventListener('click', action);
        menu.appendChild(btn);
    }

    function toggleBanner() {
        bannerVisible = !bannerVisible;
        banner.style.display = bannerVisible ? 'block' : 'none';
        toggleIcon.src = bannerVisible ? ICON_CLOSE : ICON_WRENCH;
    }

    function loadRobotsTxt() {
    content.innerHTML = 'Chargement robots.txt...';
    GM_xmlhttpRequest({
        method: 'GET',
        url: robotsUrl,
        onload: res => {
            if (res.status === 404) {
                content.innerHTML = "Aucun fichier robots.txt trouvé (404).";
                return;
            }
            if (res.status >= 400) {
                content.innerHTML = `Erreur lors du chargement du robots.txt (HTTP ${res.status})`;
                return;
            }
            const lines = res.responseText.trim().split('\n');
            const sitemaps = [], others = [];
            for (let line of lines) {
                if (/^Sitemap:/i.test(line)) {
                    const url = line.replace(/^Sitemap:\s*/i, '').trim();
                    sitemaps.push(`<strong><u>Sitemap:</u></strong> <a href='${url}' target='_blank' style='color:#6cf'>${url}</a>`);
                } else if (/^User-agent:/i.test(line)) others.push(`<span style='color:#ff0;'>${line}</span>`);
                else if (/^Disallow:/i.test(line)) others.push(`<span style='color:#f55;'>${line}</span>`);
                else if (/^Allow:/i.test(line)) others.push(`<span style='color:#5f5;'>${line}</span>`);
                else others.push(line);
            }
            content.innerHTML = [...sitemaps, ...others].join('\n');
        },
        onerror: () => { content.innerHTML = 'Erreur lors du chargement.'; }
    });
}

    function loadMeta() {
        const meta = document.getElementsByTagName('meta');
        let info = `<strong>Titre</strong> : ${document.title}`;
        for (let m of meta) {
            if (m.name === 'description') info += `<br><strong>Description</strong> : ${m.content}`;
            if (m.name === 'author') info += `<br><strong>Auteur</strong> : ${m.content}`;
        }
        const c = document.querySelector("link[rel='canonical']");
        if (c) info += `<br><strong>Canonical</strong> : ${c.href}`;
        content.innerHTML = info;
    }

    function loadIPDNS() {
        const d = location.hostname;
        content.innerHTML = 'Résolution DNS...';
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://dns.google/resolve?name=${d}&type=A`,
            onload: res => {
                const data = JSON.parse(res.responseText);
                if (!data.Answer) {
                    content.innerHTML = 'Aucune IP trouvée.';
                    return;
                }
                const aRecords = data.Answer.filter(a => a.type === 1);
                if (aRecords.length === 0) {
                    content.innerHTML = 'Aucune IP trouvée.';
                    return;
                }
                content.innerHTML = 'Chargement des infos IP...';
                Promise.all(
                    aRecords.map(a => new Promise(resolve => {
                        const ip = a.data;
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: `https://ipwhois.app/json/${ip}`,
                            onload: r => {
                                const g = JSON.parse(r.responseText);
                                const f = getFlagEmoji(g.country_code);
                                resolve(`IP : ${ip}<br>Pays : ${g.country} ${f} (${g.country_code})<br>ASN : ${g.org}`);
                            },
                            onerror: () => resolve(`IP : ${ip}<br>Localisation indisponible.`)
                        });
                    }))
                ).then(results => {
                    content.innerHTML = results.join('<br><br>');
                });
            },
            onerror: function() { content.innerHTML = 'Erreur DNS.'; }
        });
    }

function showTools() {
    const d = location.hostname;
    const tools = [
        { name: 'URLScan', url: `https://urlscan.io/domain/${d}` },
        { name: 'Shodan', url: `https://www.shodan.io/search?query=hostname:${d}` },
        { name: 'Hunter.io', url: `https://hunter.io/search/${d}` },
        { name: 'WHOIS', url: `https://who.is/whois/${d}` },
        { name: 'Wayback Machine', url: `https://web.archive.org/web/*/${d}` }
    ];

    const emojiMap = {
        "URLScan": "🔎",
        "Shodan": "🛰️",
        "Hunter.io": "🦊",
        "WHOIS": "🕵️",
        "Wayback Machine": "⏳"
    };

    content.innerHTML = tools.map(t =>
        `${emojiMap[t.name] || '🔗'} <a href="${t.url}" target="_blank" style="color:#6cf;text-decoration:none;">${t.name}</a>`
    ).join('<br>');
}

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[c]));
    }

    function extractCommentsFromDOM(node, arr = []) {
        for (let child of node.childNodes) {
            if (child.nodeType === Node.COMMENT_NODE) arr.push(child.nodeValue.trim());
            else extractCommentsFromDOM(child, arr);
        }
        return arr;
    }

function showComments() {
    content.innerHTML = 'Chargement et analyse du code source...';
    GM_xmlhttpRequest({
        method: 'GET',
        url: document.location.href,
        onload: res => {
            const matches = [...res.responseText.matchAll(/<!--([\s\S]*?)-->/g)];
            const uniqueComments = Array.from(new Set(
                matches.map(m => m[1].trim()).filter(Boolean)
                ));
            const emails = [...res.responseText.matchAll(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)]
                .map(m => m[0]);
            const uniqueEmails = Array.from(new Set(emails));

            let html = '';
            html += `<strong><u>Commentaires HTML trouvés :</u></strong><br>`;
            html += uniqueComments.length
                ? uniqueComments.map(c => `<pre style="white-space:pre-wrap;background:#222;color:#6cf;padding:4px;">&lt;!-- ${escapeHTML(c)} --&gt;</pre>`).join('')
                : "<i>Aucun commentaire HTML détecté dans le code source.</i>";

            html += `<hr style="margin:10px 0;border:0;border-top:1px solid #333;">`;
            html += `<strong><u>Adresses e-mail détectées :</u></strong><br>`;
            html += uniqueEmails.length
                ? uniqueEmails.map(email => `<span style="color:#ffd700">${escapeHTML(email)}</span>`).join('<br>')
                : "<i>Aucune adresse e-mail détectée dans le code source.</i>";

            content.innerHTML = html;
        },
        onerror: function() { content.innerHTML = 'Erreur lors du chargement du code source.'; }
    });
}

    const buttonDefinitions = [
        ['Robots.txt', loadRobotsTxt],
        ['Métadonnées', loadMeta],
        ['IP / DNS', loadIPDNS],
        ['Code Source', showComments],
        ['Outils externes', showTools]
    ];
    buttonDefinitions.forEach(([label, action]) => addButton(label, action));
})();
