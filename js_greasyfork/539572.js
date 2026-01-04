// ==UserScript==
// @name         Persistent Music UI & Lyrics Appender
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Injects music UI on mount, re-injects on React remount, and appends lines into Riffusion’s lyrics textarea so React always registers them.
// @match        https://www.riffusion.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539572/Persistent%20Music%20UI%20%20Lyrics%20Appender.user.js
// @updateURL https://update.greasyfork.org/scripts/539572/Persistent%20Music%20UI%20%20Lyrics%20Appender.meta.js
// ==/UserScript==


(function() {
  'use strict';

  const CONTAINER_SEL = 'div.horizontal-scroll.mt-2.flex.justify-between.gap-2';
  const WRAPPER_CLASS = 'my-music-ui-wrapper';

  // ——— React‐friendly setter ———
  function setNativeValue(element, value) {
    const lastValue = element.value;
    element.value = value;
    const tracker = element._valueTracker;
    if (tracker) tracker.setValue(lastValue);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // ——— Build & inject the UI into a given container ———
  function injectUI(container) {
    if (container.querySelector(`.${WRAPPER_CLASS}`)) return;
    const wrap = document.createElement('div');
    wrap.classList.add(WRAPPER_CLASS);
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    wrap.style.alignItems = 'center';
    wrap.style.marginLeft = '12px';

    // helper to make selects
    const makeSelect = (opts, bg) => {
      const s = document.createElement('select');
      s.style.padding = '6px';
      s.style.borderRadius = '6px';
      s.style.border = '1px solid #ccc';
      s.style.fontSize = '14px';
      if (bg) s.style.background = bg;
      opts.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o; opt.textContent = o;
        s.appendChild(opt);
      });
      return s;
    };

    // 1) phrasing (static now; you already have wiki version if you like)
    const phr = makeSelect(['Intro','Verse','Pre-Chorus','Chorus','Refrain','Post-Chorus','Bridge','Middle 8','Hook','Instrumental','Instrumental Solo','Vamp','Build-up','Riser','Drop','Breakdown','Interlude','Transition','Head','Solo Section','Spoken Word','Ad Lib','Tag','Outro','Coda','Silence','Pause','Skit','Ellison'],'#4e4960');
    wrap.appendChild(phr);

    // 2) timing
    const timing = makeSelect(['4/4','3/4','6/8','5/4'],'#4e4960');
    wrap.appendChild(timing);

    // 3) BPM
    const bpm = makeSelect(['60','75','90','105','120','135','150','180'],'#4e4960');
    wrap.appendChild(bpm);

    // 4) genre (placeholder; you can re-add fetch logic)
    const genre = makeSelect(['Genre…'],'#4e4960');
       // **4) Populate genres** (optional — remove if you don’t want it)
   wrap.appendChild(genre);
 fetch('https://gist.githubusercontent.com/regtable/270cb48aaaa586e610e4bbc12d93c23b/raw/2d2ed4f6b98da2d721ebf158f8d9b359f3d1cf3e/genres.json')
          .then(r => r.json())
          .then(list => {
            genre.innerHTML = '';
            list.forEach(g => {
              const o = document.createElement('option');
                if(g.name===g.slug) return
              o.value = g.name;
              o.textContent = g.slug;
              genre.appendChild(o);
            });
     console.log(genre.length)
          })
          .catch(() => {
            genre.innerHTML = '<option>Failed to load</option>';
          });
    // 5) notes
    const notes = document.createElement('input');
    notes.type = 'text';
    notes.placeholder = 'Transition notes…';
    notes.style.padding = '6px';
    notes.style.border = '1px solid #ccc';
    notes.style.borderRadius = '6px';
    notes.style.fontSize = '14px';
    wrap.appendChild(notes);

    // 6) submit
    const btn = document.createElement('button');
    btn.textContent = 'Submit';
    btn.style.padding = '6px 12px';
    btn.style.backgroundColor = '#4B5563';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '9999px';
    btn.style.cursor = 'pointer';
    btn.addEventListener('click', () => {
      // build line
const items = [
  phr.value + ' -',
  timing.value + ' time',
  bpm.value + ' BPM',
  'genre: ' + genre.value
];

if (notes.value.trim()) {
  items.push(notes.value.trim());
}

const line = `[${items.join(' , ')}],`;


      // find textarea
      const ta = document.querySelector('textarea[placeholder="Add lyrics..."]');
      if (!ta) return console.warn('Lyrics textarea not found');
      const current = ta.value;
      const prefix = current && !current.endsWith('\n') ? '\n' : '';
      setNativeValue(ta, current + prefix +line);
    });
    wrap.appendChild(btn);

    container.appendChild(wrap);
  }

  // ——— Watch the document for react mounting/unmounting ———
  const observer = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        const container =
          node.matches(CONTAINER_SEL) ? node :
          node.querySelector(CONTAINER_SEL);
        if (container) injectUI(container);
      });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // ——— Also try to inject right away if it’s already there ———
  document.querySelectorAll(CONTAINER_SEL).forEach(injectUI);

})();
