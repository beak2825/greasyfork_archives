// ==UserScript==
// @name         youtube-playlist-randomizer improvements
// @namespace    https://r5ne.carrd.co/
// @version      1.1
// @include      https://youtube-playlist-randomizer.bitbucket.io*
// @include      https://ytplr.bitbucket.io*
// @description  Improve your youtube-playlist-randomizer experience with these cosmetic changes.
// @author       r5ne
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/537152/youtube-playlist-randomizer%20improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/537152/youtube-playlist-randomizer%20improvements.meta.js
// ==/UserScript==


;(function() {
  const html = document.documentElement;
  const body = document.body;
  const CENTER_CSS = `
    html, body {
      margin: 0; padding: 0; height: 100%; width: 100%;
      display: flex; flex-direction: column;
      align-items: center; text-align: center;
    }
    body { margin: 0; }
    body > div { max-width: 100%; width: auto; }
    iframe {
      display: block; margin: 1em 0;
      flex: 0 0 auto; /* respect its own width/height */
    }
  `;
  const centerStyle = document.createElement('style');
  centerStyle.textContent = CENTER_CSS;
  document.head.appendChild(centerStyle);
  const contentOverlayCSS = document.createElement('style');
  contentOverlayCSS.textContent = `
    /* Box all top‑level DIVs except the placeholder */
    body > div:not(#video-placeholder) {
      background: rgba(0,0,0,0.35);
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 90vw;
      box-sizing: border-box;
    }
  `;
  document.head.appendChild(contentOverlayCSS);

  const dynamicStyle = document.createElement('style');
  dynamicStyle.id = 'dynamic-theme';
  document.head.appendChild(dynamicStyle);

  const LUMINANCE_THRESHOLD  = `120`;  // Increase to have the dark theme (e.g. white font) used for lighter images.
  const DARK_TEXT_COLOR      = '#000';
  const LIGHT_TEXT_COLOR     = '#fff';
  const DARK_LINK_COLOR      = '#0066cc';
  const DARK_LINK_VISITED    = '#551A8B';
  const LIGHT_LINK_COLOR     = '#66CCFF';
  const LIGHT_LINK_VISITED   = '#AA99FF';
  const HEAVY_TEXT_SHADOW    = `
    1px 1px 2px rgba(0,0,0,0.8),
    -1px -1px 2px rgba(0,0,0,0.8),
    1px -1px 2px rgba(0,0,0,0.8),
    -1px 1px 2px rgba(0,0,0,0.8)
  `;
  const UNSPLASH_ACCESS_KEY = 'bla bla bla ble ble ble blu blu blu';  // Replace with your own unsplash access key. See userscript description for more info.
  const queries = ["landscape", "abandoned", "cosmos", "waterfall", "mountain", "desert landscape", "stars", "sky", "day", "night", "night sky", "nature"];  // Replace with whatever themes you want your images to be.

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleCanvas.height = 10;
  const sampleCtx = sampleCanvas.getContext('2d');

  function pickTextColorFromImage(url) {
    return new Promise(resolve => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        sampleCtx.drawImage(img, 0, 0, 10, 10);
        const data = sampleCtx.getImageData(0, 0, 10, 10).data;
        let total = 0, count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const [r,g,b] = [data[i], data[i+1], data[i+2]];
          total += 0.2126*r + 0.7152*g + 0.0722*b;
          count++;
        }
        console.log('average Luminance = ', (total/count));
        resolve((total/count) < LUMINANCE_THRESHOLD);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  function showAttribution({ photoHref, authorHref, authorName, homeHref, location, tag, fallback }) {
    let el = document.getElementById('bg-attribution');
    if (!el) {
      el = document.createElement('div');
      el.id = 'bg-attribution';
      Object.assign(el.style, {
        position:       'fixed',
        bottom:         '8px',
        right:          '8px',
        padding:        '4px 8px',
        background:     'rgba(0,0,0,0.25)',
        color:          'white',
        fontSize:       '14px',
        borderRadius:   '4px',
        zIndex:         9999,
        pointerEvents:  'auto',
        lineHeight:     '1.2',
        whiteSpace:     'nowrap',
      });
      document.body.appendChild(el);
    }

    const linkStyles = `
      <style>
        #bg-attribution a {
          color: #fff !important;
          text-decoration: none !important;
        }
        #bg-attribution a:hover {
          text-decoration: underline !important;
        }
      </style>
    `;

    let html = `
      ${linkStyles}
      <div>
        <a href="https://greasyfork.org/en/scripts/537152-youtube-playlist-randomizer-improvements" target="_blank">
          Userscript
        </a>
        by
        <a href="https://r5ne.carrd.co" target="_blank">
          r5ne
        </a>
      </div>
    `;

    if (!fallback) {
      html += `
        <div>
          <a href="${photoHref}"  target="_blank">Photo</a> by
          <a href="${authorHref}" target="_blank">${authorName}</a> on
          <a href="${homeHref}"   target="_blank">Unsplash</a>
        </div>
        <div>
          ${location? `${location}`:''}
        </div>
        <div>
          ${tag? `Query: ${tag}`:''}
        </div>
      `;
    } else {
      html += `
        <div>
          <a href="https://picsum.photos/" target="_blank">
            Image from Lorem Picsum
          </a>
        </div>
      `;
    }

    el.innerHTML = html;
  }

  async function BG_change() {
    const selectedQuery = queries[Math.floor(Math.random() * queries.length)];
    const apiUrl = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_ACCESS_KEY}&query=${selectedQuery}&orientation=landscape`;
    try {
      const res   = await fetch(apiUrl);
      if (!res.ok) throw new Error(res.status);
      const photo = await res.json();

      const finalUrl = `${photo.urls.raw}&w=2560&h=1440&fit=crop&crop=entropy`;
      const isDark   = await pickTextColorFromImage(finalUrl);

      const linkColor   = isDark ? LIGHT_LINK_COLOR  : DARK_LINK_COLOR;
      const linkVisited = isDark ? LIGHT_LINK_VISITED: DARK_LINK_VISITED;
      const textColor   = isDark ? LIGHT_TEXT_COLOR : DARK_TEXT_COLOR;
      const textShadow  = isDark ? HEAVY_TEXT_SHADOW : 'none';

      dynamicStyle.textContent = `
        html { color: ${textColor}; }
        body { text-shadow: ${textShadow}; }
        a, a:visited { color: ${linkColor} !important; }
        a:visited { color: ${linkVisited} !important; }
      `;

      body.style.backgroundImage    = `url("${finalUrl}")`;
      body.style.backgroundSize     = 'cover';
      body.style.backgroundRepeat   = 'no-repeat';
      body.style.backgroundPosition = 'center';
      html.style.minHeight          = '100vh';
      body.style.minHeight          = '100vh';
      body.style.margin             = '0';

      showAttribution({
        photoHref:  photo.links.html,
        authorHref: photo.user.links.html,
        authorName: photo.user.name,
        homeHref:   'https://unsplash.com',
        location:   photo.location?.name,
        tag:        selectedQuery,
        fallback:   false
      });
    }
    catch (err) {
      console.error('BG_change error:', err);
      body.style.backgroundImage = 'url("https://picsum.photos/1920/1080")';
      showAttribution({
        fallback: true
      });
    }
  }

  window.addEventListener('load', BG_change);
})();