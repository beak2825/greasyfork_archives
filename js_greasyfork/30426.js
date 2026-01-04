// ==UserScript==
// @name         Webpages slideshow
// @namespace    https://github.com/aleung/
// @version      1.1.0
// @description  Loop display a serial of webpages. Display time for each page can be set.
// @author       Leo Liang
// @license      MIT License
// @include      *
// @noframes
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/30426/Webpages%20slideshow.user.js
// @updateURL https://update.greasyfork.org/scripts/30426/Webpages%20slideshow.meta.js
// ==/UserScript==


(function(){
  'use strict';

  let redirectTimer;

  function enableRedirect(delay, url) {
    redirectTimer = window.setTimeout( () => window.location.replace(url), delay * 1000 );
  }

  function disableRedirect() {
    if (redirectTimer) {
      window.clearTimeout(redirectTimer);
    }
  }

  function currentStatus() {
    return GM_getValue('enable', false);
  }

  function getPagesConfig() {
    const pagesConfig = GM_config.get('pages');
    return pagesConfig.split('\n')
      .map(line => line.split(/,(.*)/).map(s => s.trim()))
      .filter(arr=> arr.length >= 2 );
  }

  function showStatus() {
    document.getElementById('web-slideshow-status').textContent = currentStatus() ? '\u2759 \u2759' : '\u25B6';
  }

  function play() {
    showStatus();
    if (currentStatus()) {
      const pages = getPagesConfig();
      const validPageId = (page) => (page >= pages.length) ? 0 : ((page < 0) ? pages.length - 1 : page);
      const pageId = validPageId(GM_getValue('page', 0));
      const url = pages[pageId][1];
      const delay = pages[validPageId(pageId - 1)][0];
      GM_setValue('page', pageId + 1);
      enableRedirect(delay, url);
    } else {
      disableRedirect();
    }
  }

  function setupControl() {
    GM_config.init({
      id: 'WebpageSlideshowConfig',
      title: 'Webpages Slideshow Settings',
      fields: {
        pages: {
          label: 'Pages to show. One page per line, in format of: seconds, url',
          type: 'textarea',
          default: `5, http://www.funcage.com/
2, http://www.currenttimestamp.com/`
        }
      },
      css: '#WebpageSlideshowConfig textarea { width: 100%; height: 20em }',
      events: {
        close: () => play()
      }
    });

    GM_addStyle(`
#web-slideshow-control {
padding: 4px;
background-color: dimgrey;
opacity: 0.66;
position: fixed;
right: 12px;
bottom: 12px;
}
#web-slideshow-control button {
color: white;
background:none;
border:none;
margin:0;
padding:4px;
}
#web-slideshow-control button:focus {
  outline: none;
}`);

    const control = document.createElement('div');
    control.id = 'web-slideshow-control';
    control.innerHTML = `
<button id="web-slideshow-status">?</button>
<button id="web-slideshow-config">\u2699</button>`;
    document.body.appendChild (control);
    document.getElementById('web-slideshow-config').addEventListener (
      'click', () => {
        GM_setValue('enable', false);
        GM_config.open();
      }, false
    );
    document.getElementById('web-slideshow-status').addEventListener (
      'click', () => {
        GM_setValue('enable', !currentStatus());
      }, false
    );
    GM_addValueChangeListener('enable', () => {
      play();
    });
  }

  setupControl();
  play();
})();