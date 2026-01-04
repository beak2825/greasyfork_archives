// ==UserScript==
// @name         Easy Utaten
// @namespace    https://github.com/Yesterday17/Gadgets
// @version      1.0.0
// @description  Simpler utaten page.
// @author       Yesterday17
// @match        https://utaten.com/*
// @run-at       document-end
// @supportURL   https://github.com/Yesterday17/Gadgets/issues
// @downloadURL https://update.greasyfork.org/scripts/389681/Easy%20Utaten.user.js
// @updateURL https://update.greasyfork.org/scripts/389681/Easy%20Utaten.meta.js
// ==/UserScript==
(function() {
  const html = document.documentElement;
  const body = document.body;

  function trycatch(cb) {
    try {
      cb();
    } catch {}
  }

  // Remove iframe ads
  document
    .querySelectorAll('iframe')
    .forEach(ifr => (ifr.style.display = 'none'));

  // Remove aside ads
  document
    .querySelectorAll('aside')
    .forEach(asi => (asi.style.display = 'none'));

  // Remove banner ads
  trycatch(() => (document.querySelector('.topBanner').style.display = 'none'));
  trycatch(
    () => (document.querySelector('.footerBanner').style.display = 'none')
  );

  // Enable copy
  const copy = document.createElement('style');
  copy.innerHTML = '* {\n  user-select: auto !important;\n}';
  document.head.append(copy);
  body.onselectstart = () => {
    return true;
  };

  if (document.location.pathname === '/') {
    // Main Page
    trycatch(
      () =>
        (document.querySelector('.topContents__inner').style.display = 'none')
    );
    document.querySelector('#container').style.display = 'none';
    document
      .querySelectorAll('footer')
      .forEach(footer => (footer.style.display = 'none'));

    const top_contents = document.querySelector('.topContents');
    const top_contents_search = top_contents.querySelector(
      '.topContentsSearch'
    );

    html.style.overflow = 'hidden';

    top_contents.style.height = 'calc(100% - 60px)';
    html.style.height = body.style.height = top_contents_search.style.height =
      '100%';

    top_contents_search.style.display = 'flex';
    top_contents_search.style['align-items'] = 'center';
  } else {
    // Remove sidebar
    document.querySelector('#sidebar').style.display = 'none';
    document.querySelector('#contents').style.width = '100%';

    if (document.location.pathname.startsWith('/search/')) {
      // Search Page
      [2, 4].forEach(i => {
        document.querySelector('.contentBox').children[i].style.display =
          'none';
      });
    } else if (document.location.pathname.startsWith('/lyric/')) {
      // Lyric Page
      Array.from(document.querySelector('main').children).forEach((ch, i) => {
        if (i !== 0 && i !== 2) {
          ch.style.display = 'none';
        }
      });
    } else if (document.location.pathname.startsWith('/artist/')) {
      // Artist Page
      Array.from(document.querySelector('main').children).forEach((ch, i) => {
        if (i !== 0 && i !== 3) {
          ch.style.display = 'none';
        }
      });
    }
  }
})();
