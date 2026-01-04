// ==UserScript==
// @name         Shortcut to hide button in YT subscriptions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Easy access to YouTube subscription hide video
// @author       You
// @match        https://www.youtube.com/feed/subscriptions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465492/Shortcut%20to%20hide%20button%20in%20YT%20subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/465492/Shortcut%20to%20hide%20button%20in%20YT%20subscriptions.meta.js
// ==/UserScript==

(function () {
  function findNextHideButton(button, direction) {
    let parent = button.parentElement;
    while (!parent?.[direction === 'down' ? 'nextSibling' : 'previousSibling']?.querySelector?.('#ext-hide-shortcut')) {
      parent = parent.parentElement;
      if (parent === document) return null;
    }
    return parent[direction === 'down' ? 'nextSibling' : 'previousSibling'].querySelector('#ext-hide-shortcut');
  }

  window.addEventListener('keydown', (ev) => {
    const isHideButtonFocused = document.activeElement.id === 'ext-hide-shortcut';
    if (!isHideButtonFocused || ['ArrowUp', 'ArrowDown', 'Space'].every((c) => ev.code !== c)) return;
    ev.preventDefault();

    ({
      ArrowUp: () => findNextHideButton(document.activeElement, 'up').focus(),
      ArrowDown: () => findNextHideButton(document.activeElement, 'down').focus(),
      Space: () => document.activeElement.click(),
    }[ev.code]());
  });

  window.addEventListener('load', async () => {
    const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
    const waitForHideAndClick = async () => {
      const selector = 'ytd-popup-container ytd-menu-popup-renderer ytd-menu-service-item-renderer:last-child';
      while (document.querySelector(selector).offsetTop === 0) {
        await sleep(1);
      }
      document.querySelector(selector).click();
    };
    while (true) {
      document.querySelectorAll('#title-wrapper > #menu:not(:has(#ext-hide-shortcut))').forEach((e) => {
        const hide = document.createElement('button');
        hide.appendChild(document.createTextNode('Hide'));
        hide.id = 'ext-hide-shortcut';
        hide.style.position = 'absolute';
        hide.style.zIndex = '9999';
        hide.style.fontSize = '2rem';
        hide.style.right = '0';
        hide.style.top = '-10px';
        hide.style.lineHeight = '1.5';
        e.appendChild(hide);
        hide.addEventListener('click', (ev) => {
          ev.target.parentElement.querySelector('#button').dispatchEvent(new Event('click', { bubbles: false }));
          waitForHideAndClick();
          const next = findNextHideButton(hide, 'down');
          setTimeout(() => {
            next?.focus();
            document
              .querySelectorAll('ytd-item-section-renderer:has(ytd-video-renderer[is-dismissed])')
              .forEach((e) => e.remove());
          }, 50);
        });
      });
      await sleep(100);
    }
  });

  function addGlobalStyle(css = '') {
    let target = document.head || document.body;
    let style = document.createElement('style');

    style.type = 'text/css';
    style.innerHTML = css;
    target.append(style);
  }

  addGlobalStyle(`
	#ext-hide-shortcut {
		--tw-translate-x: 0;
    --tw-translate-y: 0;
    --tw-rotate: 0;
    --tw-skew-x: 0;
    --tw-skew-y: 0;
    --tw-scale-x: 1;
    --tw-scale-y: 1;
    --tw-pan-x: ;
    --tw-pan-y: ;
    --tw-pinch-zoom: ;
    --tw-scroll-snap-strictness: proximity;
    --tw-ordinal: ;
    --tw-slashed-zero: ;
    --tw-numeric-figure: ;
    --tw-numeric-spacing: ;
    --tw-numeric-fraction: ;
    --tw-ring-inset: ;
    --tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246 / .5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;
    --tw-blur: ;
    --tw-brightness: ;
    --tw-contrast: ;
    --tw-grayscale: ;
    --tw-hue-rotate: ;
    --tw-invert: ;
    --tw-saturate: ;
    --tw-sepia: ;
    --tw-drop-shadow: ;
    --tw-backdrop-blur: ;
    --tw-backdrop-brightness: ;
    --tw-backdrop-contrast: ;
    --tw-backdrop-grayscale: ;
    --tw-backdrop-hue-rotate: ;
    --tw-backdrop-invert: ;
    --tw-backdrop-opacity: ;
    --tw-backdrop-saturate: ;
    --tw-backdrop-sepia: ;

		--tw-ring-offset-width: 0px;
    --tw-ring-offset-color: #fff;
    --tw-ring-color: rgb(59 130 246 / .5);
    --tw-ring-offset-shadow: 0 0 #0000;
    --tw-ring-shadow: 0 0 #0000;
    --tw-shadow: 0 0 #0000;
    --tw-shadow-colored: 0 0 #0000;

		--tw-bg-opacity: 1;
    --tw-text-opacity: 1;
    --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);
    --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);

		display: inline-flex;
    align-items: center;
    border-radius: 9999px;
    border-width: 1px;
    border-color: transparent;
    background-color: rgb(24 116 152 / var(--tw-bg-opacity));
    padding: 0.5rem 1.25rem;
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 500;
    color: rgb(255 255 255 / var(--tw-text-opacity));
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow);
    transition-property: color,background-color,border-color,fill,stroke,-webkit-text-decoration-color;
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke;
    transition-property: color,background-color,border-color,text-decoration-color,fill,stroke,-webkit-text-decoration-color;
    transition-timing-function: cubic-bezier(.4,0,.2,1);
    transition-duration: .15s;

    background-color: rgb(250 215 87 / var(--tw-bg-opacity));
    color: rgb(7 21 59 / var(--tw-text-opacity));
	}

	#ext-hide-shortcut:focus {
		outline: 2px solid transparent;
    outline-offset: 2px;
    --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
    --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
    box-shadow: var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000);
    --tw-ring-opacity: 1;
    --tw-ring-color: rgb(250 215 87 / var(--tw-ring-opacity));
		background-color: rgb(200 165 37 / var(--tw-bg-opacity));
    }
	`);
})();
