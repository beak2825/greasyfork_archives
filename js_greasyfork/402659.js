// ==UserScript==
// @name        Youtube Screenshot Button
// @namespace   https://riophae.com/
// @version     0.1.8
// @description Adds a button that enables you to take screenshots for YouTube videos.
// @author      Riophae Lee
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       GM.openInTab
// @grant       GM_openInTab
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/402659/Youtube%20Screenshot%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/402659/Youtube%20Screenshot%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Types inspired by
    // https://github.com/Microsoft/TypeScript/blob/9d3707d/src/lib/dom.generated.d.ts#L10581
    // Type predicate for TypeScript
    function isQueryable(object) {
        return typeof object.querySelectorAll === 'function';
    }
    function select(selectors, baseElement) {
        // Shortcut with specified-but-null baseElement
        if (arguments.length === 2 && !baseElement) {
            return null;
        }
        return (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelector(String(selectors));
    }
    function selectLast(selectors, baseElement) {
        // Shortcut with specified-but-null baseElement
        if (arguments.length === 2 && !baseElement) {
            return null;
        }
        const all = (baseElement !== null && baseElement !== void 0 ? baseElement : document).querySelectorAll(String(selectors));
        return all[all.length - 1];
    }
    /**
     * @param selectors      One or more CSS selectors separated by commas
     * @param [baseElement]  The element to look inside of
     * @return               Whether it's been found
     */
    function selectExists(selectors, baseElement) {
        if (arguments.length === 2) {
            return Boolean(select(selectors, baseElement));
        }
        return Boolean(select(selectors));
    }
    function selectAll(selectors, baseElements) {
        // Shortcut with specified-but-null baseElements
        if (arguments.length === 2 && !baseElements) {
            return [];
        }
        // Can be: select.all('selectors') or select.all('selectors', singleElementOrDocument)
        if (!baseElements || isQueryable(baseElements)) {
            const elements = (baseElements !== null && baseElements !== void 0 ? baseElements : document).querySelectorAll(String(selectors));
            return Array.apply(null, elements);
        }
        const all = [];
        for (let i = 0; i < baseElements.length; i++) {
            const current = baseElements[i].querySelectorAll(String(selectors));
            for (let ii = 0; ii < current.length; ii++) {
                all.push(current[ii]);
            }
        }
        // Preserves IE11 support and performs 3x better than `...all` in Safari
        const array = [];
        all.forEach(function (v) {
            array.push(v);
        });
        return array;
    }
    select.last = selectLast;
    select.exists = selectExists;
    select.all = selectAll;

    var noop2 = noop;

    // no operation
    // null -> null
    function noop() {}

    /* eslint unicorn/consistent-function-scoping:0 */

    function memoize(fn) {
      let value;

      return () => {
        if (fn) {
          value = fn();

          if (value != null) {
            fn = null;
          }
        }

        return value
      }
    }

    function generateButtonHtml(buttonId, buttonSvg) {
      return `<button id="${buttonId}" class="ytp-button">${buttonSvg}</button>`
    }

    function generateMenuHtml(menuId, menuItemGenerator, menuItems) {
      return `
<div id="${menuId}" class="ytp-popup ytp-settings-menu" style="display: none">
  <div class="ytp-panel">
    <div class="ytp-panel-menu" role="menu">
      ${menuItems.map(menuItemGenerator).join('')}
    </div>
  </div>
</div>
`
    }

    function getEdgePosition() {
      return parseInt(getChromeBottom().style.left, 10)
    }

    function triggerMouseEvent(element, eventType) {
      const event = new MouseEvent(eventType);

      element.dispatchEvent(event);
    }

    const getChromeBottom = memoize(() => select('.ytp-chrome-bottom'));
    const getSettingsButton = memoize(() => select('.ytp-button.ytp-settings-button'));
    const getTooltip = memoize(() => select('.ytp-tooltip.ytp-bottom'));
    const getTooltipText = memoize(() => select('.ytp-tooltip-text'));

    var createYoutubePlayerButton = opts => {
      const {
        buttonTitle,
        buttonId,
        buttonSvg,

        hasMenu = false,
        menuId,
        menuItemGenerator,
        menuItems,

        onClickButton = noop2, // optional
        onRightClickButton = noop2, // optional
        onShowMenu = noop2, // optional
        onHideMenu = noop2, // optional
      } = opts;

      const isRightClickButtonBound = onRightClickButton !== noop2;

      let isMenuOpen = false;
      let justOpenedMenu = false;
      let isTooltipShown = false;

      const controls = select('.ytp-right-controls');
      controls.insertAdjacentHTML('afterbegin', generateButtonHtml(buttonId, buttonSvg));

      if (hasMenu) {
        const settingsMenu = select('.ytp-settings-menu');
        const menuHtml = generateMenuHtml(menuId, menuItemGenerator, menuItems);

        settingsMenu.insertAdjacentHTML('beforebegin', menuHtml);
      }

      const button = document.getElementById(buttonId);
      const menu = hasMenu ? document.getElementById(menuId) : null;
      const innerMenu = hasMenu ? select(`#${menuId} .ytp-panel-menu`) : null;

      button.addEventListener('click', () => {
        if (hasMenu && !isMenuOpen) {
          justOpenedMenu = true;

          hideTooltip(true);
          showMenu();
        }

        onClickButton();
      });

      button.addEventListener('contextmenu', event => {
        if (hasMenu) {
          hideMenu();
        }

        if (isRightClickButtonBound) {
          event.preventDefault();
          event.stopPropagation();

          showTooltip();
          onRightClickButton();
        } else {
          hideTooltip();
        }
      });

      button.addEventListener('mouseenter', () => {
        if (!(hasMenu && isMenuOpen)) {
          showTooltip();
        }
      });

      button.addEventListener('mouseleave', () => {
        if (!(hasMenu && isMenuOpen)) {
          hideTooltip();
        }
      });

      if (hasMenu) {
        window.addEventListener('click', () => {
          if (!justOpenedMenu) {
            hideMenu();
          }

          justOpenedMenu = false;
        });

        window.addEventListener('blur', () => {
          hideMenu();
        });
      }

      function showTooltip() {
        if (isTooltipShown) return
        isTooltipShown = true;

        triggerMouseEvent(getSettingsButton(), 'mouseover');
        getTooltipText().textContent = buttonTitle;
        adjustTooltipPosition();
      }

      function adjustTooltipPosition() {
        const calculateNormal = () => {
          getTooltip().style.left = '0';

          const offsetParentRect = getTooltip().offsetParent.getBoundingClientRect();
          const tooltipRect = getTooltip().getBoundingClientRect();
          const buttonRect = button.getBoundingClientRect();

          const tooltipHalfWidth = tooltipRect.width / 2;
          const buttonCenterX = buttonRect.x + buttonRect.width / 2;
          const normal = buttonCenterX - offsetParentRect.x - tooltipHalfWidth;

          return normal
        };

        const calculateEdge = () => {
          const offsetParentRect = getTooltip().offsetParent.getBoundingClientRect();
          const tooltipRect = getTooltip().getBoundingClientRect();
          const edge = offsetParentRect.width - getEdgePosition() - tooltipRect.width;

          return edge
        };

        getTooltip().style.left = Math.min(calculateNormal(), calculateEdge()) + 'px';
      }

      function hideTooltip(immediate = false) {
        if (!isTooltipShown) return
        isTooltipShown = false;

        triggerMouseEvent(getSettingsButton(), 'mouseout');

        if (immediate) {
          getTooltip().style.display = 'none';
        }
      }

      function showMenu() {
        if (isMenuOpen) return
        isMenuOpen = true;

        menu.style.opacity = '1';
        menu.style.display = '';

        const { offsetWidth: width, offsetHeight: height } = innerMenu;

        setMenuSize(width, height);
        adjustMenuPosition();

        onShowMenu();
      }

      function setMenuSize(width, height) {
        width += 'px';
        height += 'px';

        Object.assign(innerMenu.parentElement.style, { width, height });
        Object.assign(menu.style, { width, height });
      }

      function adjustMenuPosition() {
        menu.style.right = '0';

        const menuRect = menu.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();

        const menuCenterX = menuRect.x + menuRect.width / 2;
        const buttonCenterX = buttonRect.x + buttonRect.width / 2;
        const diff = menuCenterX - buttonCenterX;

        menu.style.right = Math.max(diff, getEdgePosition()) + 'px';
      }

      function hideMenu() {
        if (!isMenuOpen) return
        isMenuOpen = false;

        menu.style.opacity = '0';
        menu.addEventListener(
          'transitionend',
          event => {
            if (event.propertyName === 'opacity' && menu.style.opacity === '0') {
              menu.style.display = 'none';
              menu.style.opacity = '';
            }
          },
          { once: true },
        );

        onHideMenu();
      }
    };

    const hasLoaded = () => document.readyState === 'interactive' || document.readyState === 'complete';

    const domLoaded = new Promise(resolve => {
    	if (hasLoaded()) {
    		resolve();
    	} else {
    		document.addEventListener('DOMContentLoaded', () => {
    			resolve();
    		}, {
    			capture: true,
    			once: true,
    			passive: true
    		});
    	}
    });

    Object.defineProperty(domLoaded, 'hasLoaded', {
    	get: () => hasLoaded()
    });

    var domLoaded_1 = domLoaded;

    const TIMEOUT = 15 * 1000;

    let readyTime = 0;

    domLoaded_1.then(() => readyTime = Date.now());

    var tolerantElementReady = selector => new Promise(resolve => {
      const check = () => {
        const element = document.querySelector(selector);

        if (element) {
          return resolve(element)
        }

        if (readyTime && readyTime - Date.now() > TIMEOUT) {
          return resolve()
        }

        requestAnimationFrame(check);
      };

      check();
    });

    

    // Based on work by Amio:
    // https://github.com/amio/youtube-screenshot-button
    // (c) MIT License

    const $ = document.querySelector.bind(document);

    const BUTTON_ID = 'youtube-screenshot-button';
    const isEmbed = window.location.pathname.startsWith('/embed/');

    const anchorCacheMap = {};

    function getAnchor(key, initializer) {
      // eslint-disable-next-line no-prototype-builtins
      if (anchorCacheMap.hasOwnProperty(key)) {
        return anchorCacheMap[key]
      }

      const anchor = anchorCacheMap[key] = document.createElement('a');

      anchor.hidden = true;
      anchor.style.position = 'absolute';
      initializer && initializer(anchor);
      document.body.appendChild(anchor);

      return anchor
    }

    function createScreenshotBlobUrlForVideo(video) {
      return new Promise(resolve => {
        const canvas = document.createElement('canvas');
        canvas.width = video.clientWidth;
        canvas.height = video.clientHeight;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(blob => {
          const blobUrl = URL.createObjectURL(blob);
          resolve(blobUrl);

          setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
          }, 60 * 1000);
        });
      })
    }

    function openInNewTab(blobUrl) {
      // Older versions of Greasemonkey (3.x) have both GM_openInTab and GM.openInTab.
      // Newer versions of Greasemonkey (4.x) seem have deleted GM_openInTab, which
      // allows opening blob: urls while GM.openInTab don't.
      // GM.openInTab is too strict even base64 urls are not allowed.
      // So we prefer GM_openInTab whenever available.

      // eslint-disable-next-line camelcase
      if (typeof GM_openInTab === 'function') {
        // eslint-disable-next-line new-cap
        GM_openInTab(blobUrl, false);
      } else {
        // eslint-disable-next-line no-shadow
        const anchor = getAnchor('open_in_new_tab', anchor => {
          anchor.target = '_blank';
        });

        anchor.href = blobUrl;
        // A popup may be blocked by the browser. Make sure to allow it.
        // Another reason why GM_openInTab is preferred.
        anchor.click();
      }
    }

    function download(blobUrl) {
      const anchor = getAnchor('download');

      anchor.href = blobUrl;
      anchor.download = getFileName();
      anchor.click();
    }

    function getFileName() {
      const videoTitle = getVideoTitle();
      const videoTime = formatVideoTime(getVideoCurrentTime()).join('-');
      // The file name may contain invalid characters for the file system.
      // We don't need to handle that ourself, the browser will do.
      const fileName = [
        'youtube-video-screenshot',
        `[${videoTitle}]`,
        videoTime,
      ].join(' ') + '.png';

      return fileName
    }

    function getVideoTitle() {
      const titleElement = isEmbed
        ? $('.ytp-title-link')
        : $('ytd-video-primary-info-renderer h1.title yt-formatted-string');
      const videoTitle = titleElement && titleElement.textContent.trim();

      return videoTitle
    }

    function getVideoCurrentTime() {
      const videoElement = isEmbed
        ? $('.html5-video-container video')
        : $('#ytd-player video');
      const videoCurrentTime = videoElement
        ? videoElement.currentTime
        : NaN;

      return videoCurrentTime
    }

    // The video that is claimed to be the longest on YouTube:
    // https://youtu.be/04cF1m6Jxu8
    // Use it to test how this code handles the time in different situations.
    function formatVideoTime(totalSeconds) {
      // Remove the decimal part (milliseconds).
      // e.g. 90.6 -> 90
      let m = Math.floor(totalSeconds);
      let n;

      // Do the time format conversion.
      let result = [ 60, 60, 24 ].map(factor => {
        n = m % factor;
        m = (m - n) / factor;
        return n
      });
      result.push(m);
      result.reverse();
      // result => [ day, hour, minute, second ]

      // Omit day or hour if 0.
      // The minute is always kept even if 0.
      // e.g.:
      //   [ 0, 0 ]
      //   [ 2, 30 ]
      //   [ 1, 10, 45 ]
      //   [ 4, 0, 50, 15 ]
      while (result.length > 2 && result[0] === 0) {
        result.shift();
      }

      // Left-pad 0 to all numbers but the first (same as YouTube).
      // e.g.:
      //   [ "0", "00" ]
      //   [ "1", "00", "00" ]
      //   [ "1", "00", "00", "00" ]
      result = result.map((number, index) => {
        return index > 0 && number < 10
          ? `0${number}`
          : String(number)
      });

      return result
    }

    async function main() {
      const existingButton = document.getElementById(BUTTON_ID);

      if (existingButton) {
        console.info('Screenshot button already injected.');
        return
      }

      const [ video, controls ] = await Promise.all([
        tolerantElementReady('.html5-main-video'),
        tolerantElementReady('.ytp-right-controls'),
      ]);

      if (!(video && controls)) {
        return
      }

      createYoutubePlayerButton({
        buttonTitle: 'Take a screenshot',
        buttonId: BUTTON_ID,
        buttonSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#fff" style="transform: scale(0.45)"><path d="M512 107.275c-23.658-33.787-70.696-42.691-104.489-19.033L233.753 209.907l-63.183-44.246c23.526-40.618 12.46-93.179-26.71-120.603-41.364-28.954-98.355-18.906-127.321 22.45-28.953 41.358-18.913 98.361 22.452 127.327 28.384 19.874 64.137 21.364 93.129 6.982l77.388 54.185-77.381 54.179c-28.992-14.375-64.743-12.885-93.129 6.982-41.363 28.966-51.404 85.963-22.452 127.32 28.966 41.363 85.963 51.411 127.32 22.457 39.165-27.424 50.229-79.985 26.71-120.603l63.183-44.246L407.51 423.749c33.793 23.665 80.831 14.755 104.489-19.033l-212.41-148.715L512 107.275zM91.627 167.539c-26.173 0-47.392-21.219-47.392-47.392s21.22-47.392 47.392-47.392c26.179 0 47.392 21.219 47.392 47.392s-21.213 47.392-47.392 47.392zm0 271.714c-26.173 0-47.392-21.219-47.392-47.392 0-26.173 21.219-47.392 47.392-47.392 26.179 0 47.392 21.219 47.392 47.392 0 26.172-21.213 47.392-47.392 47.392z"/></svg>',

        async onClickButton() {
          openInNewTab(await createScreenshotBlobUrlForVideo(video));
        },

        async onRightClickButton() {
          download(await createScreenshotBlobUrlForVideo(video));
        },
      });
    }
    main();

}());
