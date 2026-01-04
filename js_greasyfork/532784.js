// ==UserScript==
// @name        Force Download Universal Sans Fonts (WOFF2, TTF)
// @description Force download Universal Sans Fonts
// @match       *://universalsans.com/*
// @version     1.2
// @namespace   https://greasyfork.org/users/1457614
// @downloadURL https://update.greasyfork.org/scripts/532784/Force%20Download%20Universal%20Sans%20Fonts%20%28WOFF2%2C%20TTF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532784/Force%20Download%20Universal%20Sans%20Fonts%20%28WOFF2%2C%20TTF%29.meta.js
// ==/UserScript==

(function () {
  // Define both TTF and WOFF2 font sources
  const ttfFonts = [
    { name: 'Display (.ttf)', file: 'UniversalSansDisplayGX.ttf', base: 'https://universalsans.com/UniversalSans/' },
    { name: 'Regular (.ttf)', file: 'UniversalSansGX.ttf', base: 'https://universalsans.com/UniversalSans/' },
    { name: 'Italic (.ttf)', file: 'UniversalSansItalicGX.ttf', base: 'https://universalsans.com/UniversalSans/' },
    { name: 'Italic Display (.ttf)', file: 'UniversalSansItalicDisplayGX.ttf', base: 'https://universalsans.com/UniversalSans/' },
  ];

  const woff2Fonts = [
    { name: 'Display (.woff2)', file: 'UniversalSansDisplayGX.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Regular (.woff2)', file: 'UniversalSansGX.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Italic (.woff2)', file: 'UniversalSansItalicGX.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Italic Display (.woff2)', file: 'UniversalSansItalicDisplayGX.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Universal Sans 400 (.woff2)', file: 'Universal-Sans-400.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Universal Sans 650 (.woff2)', file: 'Universal-Sans-650.woff2', base: 'https://universalsans.com/css/fonts/' },
    { name: 'Universal Sans 400 Italic (.woff2)', file: 'Universal-Sans-400-Italic.woff2', base: 'https://universalsans.com/css/fonts/' }
  ];

  const fonts = [...ttfFonts, ...woff2Fonts];

  // Create container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.left = '10px';
  container.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  container.style.padding = '15px 20px';
  container.style.borderRadius = '10px';
  container.style.zIndex = 10000;
  container.style.color = 'white';
  container.style.fontFamily = 'sans-serif';
  container.style.maxHeight = '90vh';
  container.style.overflowY = 'auto';
  container.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
  container.style.minWidth = '240px';

  // Close button
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✕';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '5px';
  closeBtn.style.right = '8px';
  closeBtn.style.background = 'transparent';
  closeBtn.style.border = 'none';
  closeBtn.style.color = 'white';
  closeBtn.style.fontSize = '16px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.padding = '0';
  closeBtn.style.margin = '0';
  closeBtn.title = 'Close';
  closeBtn.onclick = () => container.style.display = 'none';
  container.appendChild(closeBtn);

  // Heading
  const heading = document.createElement('div');
  heading.textContent = 'Download Fonts';
  heading.style.marginBottom = '10px';
  heading.style.fontWeight = 'bold';
  heading.style.fontSize = '15px';
  container.appendChild(heading);

  // Links
  fonts.forEach(font => {
    const link = document.createElement('a');
    link.href = `${font.base}${font.file}`;
    link.download = font.file;
    link.textContent = `⬇ ${font.name}`;
    link.style.display = 'block';
    link.style.color = '#00ccff';
    link.style.margin = '4px 0';
    link.style.fontSize = '14px';
    container.appendChild(link);
  });

  // Append
  document.body.appendChild(container);
})();