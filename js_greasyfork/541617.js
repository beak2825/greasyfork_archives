// ==UserScript==
// @name         MB: Inline per-recording streaming & download links
// @namespace    https://chat.openai.com/
// @version      1.4
// @description  Displays per-recording streaming/download links on MusicBrainz with toggle buttons (collapsed by default).
// @match        *://*.musicbrainz.org/release/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541617/MB%3A%20Inline%20per-recording%20streaming%20%20download%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/541617/MB%3A%20Inline%20per-recording%20streaming%20%20download%20links.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getServiceIcon(domain) {
        domain = domain.toLowerCase().replace(/^www\./, '');
        if (domain.includes('bandcamp.com')) return '🎵';
        if (domain.includes('spotify.com')) return '🟢';
        if (domain.includes('apple.com')) return '🍎';
        if (domain.includes('deezer.com')) return '🟣';
        if (domain.includes('tidal.com')) return '🌊';
        if (domain.includes('youtube.com') || domain.includes('youtu.be')) return '▶️';
        if (domain.includes('soundcloud.com')) return '☁️';
        if (domain.includes('archive.org')) return '🗄️';
        if (domain.includes('qobuz.com')) return '🎼';
        if (domain.includes('beatport.com')) return '🧩';
        if (domain.includes('amazon.com')) return '🅰️';
        return '🌐';
    }

    function mergeRelations(relations) {
        const merged = {};
        for (const rel of relations) {
            const url = rel.url?.resource;
            if (!url) continue;
            if (!merged[url]) merged[url] = { href: url, types: new Set() };
            merged[url].types.add(rel.type);
        }
        return Object.values(merged).map(entry => ({
            href: entry.href,
            typeText: Array.from(entry.types).join(', ')
        }));
    }

    function groupByDomain(mergedLinks) {
        const grouped = {};
        for (const item of mergedLinks) {
            try {
                const domain = new URL(item.href).hostname.replace(/^www\./, '');
                const icon = getServiceIcon(domain);
                const isKnown = icon !== '🌐';
                if (!grouped[domain]) grouped[domain] = { links: [], icon, known: isKnown };
                grouped[domain].links.push(item);
            } catch (e) {
                console.warn('Invalid URL:', item.href);
            }
        }
        return grouped;
    }

    function injectLinks(row, relations) {
        const merged = mergeRelations(relations);
        const grouped = groupByDomain(merged);

        const td = row.querySelectorAll('td')[1];
        if (!td) return;

        const dl = td.querySelector('dl.ar') || Object.assign(document.createElement('dl'), { className: 'ar' });
        if (!td.contains(dl)) td.appendChild(dl);

        const dt = document.createElement('dt');
        const toggle = document.createElement('button');
        toggle.textContent = '►';
        toggle.className = 'recording-toggle';
        toggle.style.marginRight = '0.5em';
        toggle.style.border = 'none';
        toggle.style.background = 'none';
        toggle.style.cursor = 'pointer';
        toggle.style.fontSize = '0.9em';

        const dd = document.createElement('dd');
        dd.classList.add('recording-url-links');
        dd.style.display = 'none';

        toggle.addEventListener('click', () => {
            const isHidden = dd.style.display === 'none';
            dd.style.display = isHidden ? 'block' : 'none';
            toggle.textContent = isHidden ? '▼' : '►';
        });

        dt.appendChild(toggle);
        dt.appendChild(document.createTextNode('Streaming/Downloads:'));

        if (merged.length === 0) {
            dd.textContent = 'No streaming or download links found.';
        } else {
            for (const [domain, { links, icon }] of Object.entries(grouped).sort(([, a], [, b]) => Number(b.known) - Number(a.known))) {
                const label = document.createElement('strong');
                label.textContent = `${icon} ${domain}: `;
                dd.appendChild(label);
                for (const link of links) {
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.target = '_blank';
                    a.rel = 'noopener';
                    a.textContent = `[${link.typeText}]`;
                    a.style.marginRight = '0.5em';
                    dd.appendChild(a);
                }
                dd.appendChild(document.createElement('br'));
            }
        }

        dl.appendChild(dt);
        dl.appendChild(dd);
    }

    async function fetchReleaseRecordingData() {
        const releaseMBID = window.location.pathname.match(/release\/([a-f0-9-]{36})/)?.[1];
        if (!releaseMBID) return null;
        const url = `https://musicbrainz.org/ws/2/release/${releaseMBID}?inc=recordings+recording-level-rels+url-rels&fmt=json`;
        const res = await fetch(url);
        return await res.json();
    }

    function getTrackRows() {
        return Array.from(document.querySelectorAll('.tracklist-and-credits table.tbl.medium tbody tr'))
            .filter(tr => !tr.classList.contains('subh'));
    }

    function onReactHydrated(element, callback) {
        const alreadyHydrated = Object.keys(element).some(key => key.startsWith('_reactListening') && element[key]);
        if (alreadyHydrated) callback();
        else element.addEventListener('mb-hydration', callback);
    }

    onReactHydrated(document.querySelector('.tracklist-and-credits'), async () => {
        const toolbox = document.querySelector('#medium-toolbox');
        if (!toolbox) return;

        const status = document.createElement('span');
        status.style.marginLeft = '1em';

        const toggleAllBtn = document.createElement('button');
        toggleAllBtn.classList.add('btn-link');
        toggleAllBtn.textContent = 'Expand all streaming/download links';

        let allExpanded = false;
        toggleAllBtn.addEventListener('click', () => {
            const dds = document.querySelectorAll('.tracklist-and-credits td dd.recording-url-links');
            const toggles = document.querySelectorAll('.tracklist-and-credits td button.recording-toggle');
            for (const dd of dds) {
                dd.style.display = allExpanded ? 'none' : 'block';
            }
            for (const toggle of toggles) {
                toggle.textContent = allExpanded ? '►' : '▼';
            }
            allExpanded = !allExpanded;
            toggleAllBtn.textContent = allExpanded ? 'Collapse all streaming/download links' : 'Expand all streaming/download links';
        });

        toolbox.firstChild?.before(toggleAllBtn, ' | ');
        toolbox.firstChild?.before(status);

        status.textContent = 'Fetching recording links…';
        const releaseData = await fetchReleaseRecordingData();
        const trackRows = getTrackRows();
        const tracks = releaseData?.media?.flatMap(m => m.tracks) || [];

        for (let i = 0; i < trackRows.length; i++) {
            const row = trackRows[i];
            const recording = tracks[i]?.recording;
            const relations = recording?.relations || [];
            injectLinks(row, relations);
        }

        status.textContent = '';
    });
})();
