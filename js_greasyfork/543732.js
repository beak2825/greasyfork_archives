// ==UserScript==
// @name         Harmony Link Preferences
// @namespace    https://musicbrainz.org/user/DenizC
// @version      2.6
// @description  Users of Harmony Release Actions can include/exclude/modify release choices from each of the vendors
// @match        https://harmony.pulsewidth.org.uk/release/actions*
// @grant        GM_xmlhttpRequest
// @connect      musicbrainz.org
// @downloadURL https://update.greasyfork.org/scripts/543732/Harmony%20Link%20Preferences.user.js
// @updateURL https://update.greasyfork.org/scripts/543732/Harmony%20Link%20Preferences.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SERVICES = ['spotify','deezer','itunes','tidal','bandcamp','beatport'];
  const MB_API = 'https://musicbrainz.org/ws/2/release/';
  const style = 'margin:1em 0;padding:1em;border:1px solid #ccc;border-radius:6px;background:#f9f9f9';
  const urlParams = new URLSearchParams(location.search);

  function getMBID() {
    const mbid = decodeURIComponent(urlParams.get('release_mbid') || '');
    const match = mbid.match(/([a-f0-9-]{36})/i);
    return match ? match[1] : null;
  }

  function getServiceValue(service) {
    return urlParams.has(service) ? decodeURIComponent(urlParams.get(service)) : null;
  }

  function getRegionParam() {
    return urlParams.get('region') || '';
  }

  function isInitialVisitOnlyReleaseMBID() {
    return urlParams.keys().next().value === 'release_mbid' && [...urlParams.keys()].length === 1;
  }

  function parseAppleRegion(url) {
    const m = url.match(/(?:itunes|music)\.apple\.com\/([a-z]{2})\//i);
    return m ? m[1].toUpperCase() : '';
  }

  function normalizeAppleURL(url) {
    const idMatch = url.match(/id(\d+)/) || url.match(/\/(\d+)(?:[/?#]|$)/);
    const id = idMatch ? idMatch[1] : null;
    const region = parseAppleRegion(url);
    return id && region ? `${id}_${region}` : null;
  }

  function bandcampSlug(url) {
    try {
      const u = new URL(url);
      if (!u.hostname.endsWith('bandcamp.com')) return null;
      if (!u.pathname.startsWith('/album/')) return null;
      const artist = u.hostname.split('.')[0];
      const path = u.pathname.replace(/^\/album\/+/, '');
      return artist && path ? `${artist}/${path}` : null;
    } catch (e) {
      return null;
    }
  }

  function extractLinks(rels) {
    const map = {};
    const seen = new Set();
    let fallbackRegion = '';

    rels.forEach(rel => {
      if (rel.ended) return;
      const url = rel.url?.resource;
      if (!url) return;

      let service, id, label, region, dedupeKey;

      if (url.includes('spotify.com/album/')) {
        service = 'spotify';
        id = url.split('/album/')[1]?.split('?')[0];
        label = id;
        dedupeKey = `${service}_${id}`;
      } else if (url.includes('deezer.com/album/')) {
        service = 'deezer';
        id = url.split('/album/')[1]?.split('?')[0];
        label = id;
        dedupeKey = `${service}_${id}`;
      } else if (/(itunes|music)\.apple\.com/.test(url)) {
        service = 'itunes';
        const normalized = normalizeAppleURL(url);
        if (!normalized) return;
        [id, region] = normalized.split('_');
        label = `${id} [${region}]`;
        dedupeKey = `${service}_${normalized}`;
        if (!fallbackRegion && region) fallbackRegion = region;
      } else if (url.includes('tidal.com/album/')) {
        service = 'tidal';
        id = url.split('/album/')[1]?.split('?')[0];
        label = id;
        dedupeKey = `${service}_${id}`;
      } else if (url.includes('bandcamp.com')) {
        const slug = bandcampSlug(url);
        if (!slug) return;
        service = 'bandcamp';
        id = slug;
        label = slug;
        dedupeKey = `${service}_${slug}`;
      } else if (url.includes('beatport.com/release/')) {
        const parts = url.split('/release/')[1]?.split('/');
        service = 'beatport';
        id = parts?.[1]?.split('?')[0];
        label = id;
        dedupeKey = `${service}_${id}`;
      }

      if (service && id && !seen.has(dedupeKey)) {
        seen.add(dedupeKey);
        map[service] ||= [];
        map[service].push({id, label, region});
      }
    });

    return { map, fallbackRegion };
  }

  function renderUI(map, fallbackRegion, mbid) {
    const details = document.createElement('details');
    details.style = style;

    const summary = document.createElement('summary');
    summary.innerHTML = '<strong>🎚 Link Preferences</strong>';
    details.appendChild(summary);

    const form = document.createElement('form');
    form.style = 'margin-top:1em';

    let regionInput;

    SERVICES.forEach(s => {
      const list = map[s] || [];
      if (list.length === 0) return;

      const div = document.createElement('div');
      div.style = 'margin-bottom:1em';

      const lbl = document.createElement('label');
      lbl.style = 'font-weight:bold;margin-left:0.3em';

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.name = s;

      const selectedVal = getServiceValue(s);
      const showAllChecked = isInitialVisitOnlyReleaseMBID();
      chk.checked = showAllChecked || !!selectedVal;

      lbl.appendChild(chk);
      lbl.appendChild(document.createTextNode(s));
      div.appendChild(lbl);

      if (list.length > 1) {
        list.forEach((entry, i) => {
          const rad = document.createElement('input');
          rad.type = 'radio';
          rad.name = s + '_choice';
          rad.value = entry.id;

          if (selectedVal) {
            rad.checked = (entry.id === selectedVal);
          } else if (i === 0 || entry.region === fallbackRegion) {
            rad.checked = true;
          }

          const rlbl = document.createElement('label');
          rlbl.style = 'margin-left:1.5em;display:block';
          rlbl.appendChild(rad);
          rlbl.appendChild(document.createTextNode(' ' + entry.label));
          div.appendChild(rlbl);

          chk.addEventListener('change', () => { rad.disabled = !chk.checked; });
          rad.disabled = !chk.checked;

          if (s === 'itunes' && entry.region) {
            rad.addEventListener('change', () => {
              if (rad.checked && regionInput) {
                regionInput.value = entry.region;
              }
            });
          }
        });
      } else {
        chk.dataset.id = list[0].id;
      }

      form.appendChild(div);
    });

    const regLbl = document.createElement('label');
    regLbl.textContent = 'Preferred Region: ';
    regionInput = document.createElement('input');
    regionInput.type = 'text';
    regionInput.name = 'region';
    regionInput.placeholder = 'US';
    regionInput.value = getRegionParam() || fallbackRegion || '';
    regLbl.appendChild(regionInput);
    form.appendChild(regLbl);
    form.appendChild(document.createElement('br'));
    form.appendChild(document.createElement('br'));

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Generate URL';
    btn.addEventListener('click', () => {
      const url = new URL('https://harmony.pulsewidth.org.uk/release/actions');
      url.searchParams.set('release_mbid', mbid);
      url.searchParams.set('musicbrainz', mbid);

      SERVICES.forEach(s => {
        const chk = form.querySelector(`input[name="${s}"]`);
        if (chk && chk.checked) {
          const rads = form.querySelectorAll(`input[name="${s}_choice"]`);
          let val = chk.dataset.id;
          if (rads.length > 0) {
            const sel = [...rads].find(r => r.checked);
            if (sel) val = sel.value;
          }
          if (val) url.searchParams.set(s, val);
        }
      });

      const rr = regionInput.value.trim();
      if (rr) url.searchParams.set('region', rr.toUpperCase());

      location.href = url.toString();
    });

    form.appendChild(btn);
    details.appendChild(form);
    document.querySelector('main')?.prepend(details);
  }

  const mbid = getMBID();
  if (mbid) {
    GM_xmlhttpRequest({
      method: 'GET',
      url: MB_API + mbid + '?inc=url-rels&fmt=json',
      headers: { Accept: 'application/json' },
      onload(r) {
        const data = JSON.parse(r.responseText);
        const { map, fallbackRegion } = extractLinks(data.relations || []);
        renderUI(map, fallbackRegion, mbid);
      },
      onerror() {
        console.error('Failed to fetch MB relations');
      }
    });
  }
})();
