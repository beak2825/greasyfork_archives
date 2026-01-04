// ==UserScript==
// @name        3D Youtube Downloader Helper
// @namespace   https://riophae.com/
// @version     0.1.10
// @description One click to send YouTube video url to 3D YouTube Downloader.
// @author      Riophae Lee
// @match       https://www.youtube.com/*
// @run-at      document-start
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/387024/3D%20Youtube%20Downloader%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/387024/3D%20Youtube%20Downloader%20Helper.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var containers = []; // will store container HTMLElement references
    var styleElements = []; // will store {prepend: HTMLElement, append: HTMLElement}

    var usage = 'insert-css: You need to provide a CSS string. Usage: insertCss(cssString[, options]).';

    function insertCss(css, options) {
        options = options || {};

        if (css === undefined) {
            throw new Error(usage);
        }

        var position = options.prepend === true ? 'prepend' : 'append';
        var container = options.container !== undefined ? options.container : document.querySelector('head');
        var containerId = containers.indexOf(container);

        // first time we see this container, create the necessary entries
        if (containerId === -1) {
            containerId = containers.push(container) - 1;
            styleElements[containerId] = {};
        }

        // try to get the correponding container + position styleElement, create it otherwise
        var styleElement;

        if (styleElements[containerId] !== undefined && styleElements[containerId][position] !== undefined) {
            styleElement = styleElements[containerId][position];
        } else {
            styleElement = styleElements[containerId][position] = createStyleElement();

            if (position === 'prepend') {
                container.insertBefore(styleElement, container.childNodes[0]);
            } else {
                container.appendChild(styleElement);
            }
        }

        // strip potential UTF-8 BOM if css was read from a file
        if (css.charCodeAt(0) === 0xFEFF) { css = css.substr(1, css.length); }

        // actually add the stylesheet
        if (styleElement.styleSheet) {
            styleElement.styleSheet.cssText += css;
        } else {
            styleElement.textContent += css;
        }

        return styleElement;
    }
    function createStyleElement() {
        var styleElement = document.createElement('style');
        styleElement.setAttribute('type', 'text/css');
        return styleElement;
    }

    var insertCss_1 = insertCss;
    var insertCss_2 = insertCss;
    insertCss_1.insertCss = insertCss_2;

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

    

    const FALLBACK_LANG = 'en-US';
    const ID_SUFFIX = '3d-youtube-downloader-helper';

    function memoize$1(fn) {
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

    const isWindowsOS = () => [
      'Win32',
      'Win64', // for Pale Moon
    ].includes(navigator.platform);
    const isEmbeddedVideo = () => window.location.pathname.startsWith('/embed/');
    const getLang = () => document.documentElement.getAttribute('lang');
    const getVideoId = () => isEmbeddedVideo() // eslint-disable-line no-confusing-arrow
      ? window.location.pathname.split('/').pop()
      : select('[video-id]').getAttribute('video-id');

    const getDownloadLink = memoize$1(() => select(`#download-link-${ID_SUFFIX}`));
    const getConvertLink = memoize$1(() => select(`#convert-link-${ID_SUFFIX}`));
    const getAnalyzeLink = memoize$1(() => select(`#analyze-link-${ID_SUFFIX}`));

    const dict = {
      'en-US': {
        buttonTitle: 'Download via 3D YouTube Downloader',
        download: 'Download',
        convert: 'Convert',
        analyze: 'Analyze',
      },
      'zh-CN': {
        buttonTitle: '通过 3D YouTube Downloader 下载',
        download: '下载',
        convert: '转换',
        analyze: '分析',
      },
    };
    dict.zh = dict['zh-CN'];

    function i18n(key) {
      let lang = getLang();

      // eslint-disable-next-line no-prototype-builtins
      if (!dict.hasOwnProperty(lang)) {
        lang = FALLBACK_LANG;
      }

      const translated = dict[lang][key] || dict[FALLBACK_LANG][key];

      return translated
    }

    function insertStyle() {
      const css = `
#menu-${ID_SUFFIX} .ytp-panel-menu {
  min-width: 8em;
}
`;

      insertCss_1(css);
    }

    function setDownloadUrls() {
      const videoId = getVideoId();
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      getDownloadLink().href = `s3dyd://download=${videoUrl}`;
      getConvertLink().href = `s3dyd://convert=${videoUrl}`;
      getAnalyzeLink().href = `s3dyd://analyze=${videoUrl}`;
    }

    async function init() {
      if (!isWindowsOS()) {
        return
      }

      const [ youtubeSettingsMenu, youtubeRightControls ] = await Promise.all([
        tolerantElementReady('.ytp-settings-menu'),
        tolerantElementReady('.ytp-right-controls'),
      ]);

      if (!(youtubeSettingsMenu && youtubeRightControls)) {
        return
      }

      insertStyle();

      createYoutubePlayerButton({
        buttonTitle: i18n('buttonTitle'),
        buttonId: `button-${ID_SUFFIX}`,
        buttonSvg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 459 459" style="transform: scale(0.45)"><path fill="#FFF" d="M446.25 56.1l-35.7-43.35C405.45 5.1 395.25 0 382.5 0h-306C63.75 0 53.55 5.1 45.9 12.75L12.75 56.1C5.1 66.3 0 76.5 0 89.25V408c0 28.05 22.95 51 51 51h357c28.05 0 51-22.95 51-51V89.25c0-12.75-5.1-22.95-12.75-33.15zM229.5 369.75L89.25 229.5h89.25v-51h102v51h89.25L229.5 369.75zM53.55 51l20.4-25.5h306L402.9 51H53.55z"/></svg>',

        hasMenu: true,
        menuId: `menu-${ID_SUFFIX}`,
        menuItemGenerator(key) {
          return `
<a id="${key}-link-${ID_SUFFIX}" class="ytp-menuitem" tabindex="0">
  <div class="ytp-menuitem-icon"></div>
  <div class="ytp-menuitem-label" style="white-space: nowrap">${i18n(key)}</div>
  <div class="ytp-menuitem-content"></div>
</a>
`
        },
        menuItems: [
          'download',
          'convert',
          'analyze',
        ],

        onRightClickButton() {
          setDownloadUrls();
          getDownloadLink().click();
        },

        onShowMenu() {
          setDownloadUrls();
        },
      });
    }
    init();

}());
