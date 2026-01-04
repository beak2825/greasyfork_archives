// ==UserScript==
// @name         Internet Roadtrip - Map Picture in Picture
// @description  Allows you to open the minimap in neal.fun/internet-roadtrip as a Picture in Picture window (Chromium only!)
// @namespace    me.netux.site/user-scripts/internet-roadtrip/picture-in-picture
// @version      1.2.2
// @author       netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/*
// @icon         https://neal.fun/favicons/internet-roadtrip.png
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/538106/Internet%20Roadtrip%20-%20Map%20Picture%20in%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/538106/Internet%20Roadtrip%20-%20Map%20Picture%20in%20Picture.meta.js
// ==/UserScript==

/* globals IRF */

(async () => {
  if (!window.documentPictureInPicture) {
    const wantsToSeeCompatibleBrowsers = confirm([
      `Thanks for installing ${GM.info.script.name}!`,
      `Unfortunately, your browser doesn't support the Document Picture in Picture API, so this userscript won't work for you :(`,
      '',
      `Click OK to open a list of compatible browsers, or Cancel to proceed into Internet Roadtrip.`,
      `This userscript will disable itself now.`
    ].join('\n'));

    if (wantsToSeeCompatibleBrowsers) {
      window.open('https://caniuse.com/mdn-api_documentpictureinpicture');
    }

    return;
  }

  const LOG_PREFIX = '[MPiP]';
  const CSS_PREFIX = `mpip-`;
  const cssClass = (... names) => names.map((name) => `${CSS_PREFIX}${name}`).join(' ');
  const cssProp = (name) => `--${CSS_PREFIX}${name}`;

  function isStylesheetCrossOrigin(styleSheet) {
    const hrefHostname = styleSheet.href ? new URL(styleSheet.href).hostname : null;
    if (hrefHostname && hrefHostname !== window.location.hostname) {
      return true;
    }

    try {
      styleSheet.rules;
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.code === DOMException.SECURITY_ERR
      ) {
        return true;
      }
    }

    return false;
  }

  /*
   * Create a StyleSheet that is the amalgamation of all rules that could be related to the minimap.
   */
  function createPiPStyleSheet(pipWindow) {
    const styleSheet = pipWindow.eval(`new CSSStyleSheet()`); // the stylesheet has to be created on the PiP window, otherwise it gets automatically adopted by the parent window.
    pipWindow.document.adoptedStyleSheets.push(styleSheet);

    const isRuleSelectorMatching = (rule) => ['#mini-map', '.maplibregl-', '.mpip-'].some((part) => rule.selectorText.includes(part));

    const rulesAlreadySeen = new Set();

    function ruleMatchesDeep(rule) {
      if (rulesAlreadySeen.has(rule)) {
        return false;
      }
      rulesAlreadySeen.add(rule);

      if (rule instanceof CSSStyleRule) {
        if (isRuleSelectorMatching(rule)) {
          return true;
        }

        let matches = false;

        for (const innerRule of (rule.cssRules ?? [])) {
          if (ruleMatchesDeep(rule)) {
            break;
          }
        }

        return matches;
      } else if (rule instanceof CSSMediaRule) {
        if (rule.conditionText.includes('display-mode: picture-in-picture')) {
          return true;
        }

        let matches = false;

        for (const innerRule of (rule.cssRules ?? [])) {
          if (ruleMatchesDeep(rule)) {
            break;
          }
        }

        return matches;
      } else if (
        rule instanceof CSSFontFaceRule ||
        rule instanceof CSSKeyframeRule
      ) {
        return true;
      }

      return false;
    }

    function insertCssRuleIfMatching(rule) {
      if (!ruleMatchesDeep(rule)) {
        return;
      }

      styleSheet.insertRule(rule.cssText);
    }

    // Copy from page
    for (const styleSheet of document.styleSheets) {
      if (isStylesheetCrossOrigin(styleSheet)) {
        continue;
      }

      for (const rule of styleSheet.rules) {
        insertCssRuleIfMatching(rule);
      }
    }

    styleSheet.insertRule(`
    body {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      margin: 0;
      overflow: hidden;
    }
    `);
    styleSheet.insertRule(`
    #mini-map {
      width: inherit !important;
      height: inherit !important;
    }
    `);
  }

  /** @type {Map<HTMLElement, Array<Parameters<typeof Element["addEventListener"]>>>} */
  const storedEventListenersToReplicateInPiPWindow = new Map();
  {
    const waitForElementsToStoreEventListenersFor = IRF.dom.map
      .then((mapContainerEl) => [window, document, document.body, mapContainerEl]);

    {
      const addEventListenerProxyConfig = {
        apply(ogAddEventListener, thisArg, args) {
          waitForElementsToStoreEventListenersFor.then((elementsToStoreEventListenersFor) => {
            if (!elementsToStoreEventListenersFor.includes(thisArg)) {
              return;
            }

            const eventListenerArgsList = storedEventListenersToReplicateInPiPWindow.get(thisArg) || [];
            eventListenerArgsList.push(args);
            storedEventListenersToReplicateInPiPWindow.set(thisArg, eventListenerArgsList);
          });

          return ogAddEventListener.apply(thisArg, args);
        }
      };

      window.addEventListener = new Proxy(window.addEventListener, addEventListenerProxyConfig);
      document.addEventListener = new Proxy(document.addEventListener, addEventListenerProxyConfig);
      Element.prototype.addEventListener = new Proxy(Element.prototype.addEventListener, addEventListenerProxyConfig);
    }
  }

  async function webpackPatch(patchConfigs) {
    const WEBPACK_MODULE_INITIALIZER_FUNCTION_REGEXP = /function\s*\((?<argsList>.+?)\)\s*{(?<body>(?:\n|.)*)}/;

    return new Promise((resolve) => {
      const patchesToDo = new Set(patchConfigs);

      function performPatches(modulesInitializersOrWhatever) {
        for (const key in modulesInitializersOrWhatever) {
          if (typeof modulesInitializersOrWhatever[key] !== 'function') {
            continue;
          }

          const moduleInitializerFnStr = modulesInitializersOrWhatever[key].toString();

          const matchingPatches = [];
          for (const patchConfig of patchesToDo) {
            if (!moduleInitializerFnStr.includes(patchConfig.needle)) {
              continue;
            }

            matchingPatches.push(patchConfig);
          }

          if (matchingPatches.length <= 0) {
            continue;
          }

          const {
            argsList: moduleInitializerArgsListStr,
            body: moduleInitializerFnBodyStr
          } = moduleInitializerFnStr.match(WEBPACK_MODULE_INITIALIZER_FUNCTION_REGEXP).groups;

          const moduleInitializerArgs = moduleInitializerArgsListStr.split(',').map((a) => a.trim());

          let patchedModuleInitializerFnBodyStr = moduleInitializerFnBodyStr;
          for (const patchConfig of matchingPatches) {
            patchedModuleInitializerFnBodyStr = patchedModuleInitializerFnBodyStr
              .replace(patchConfig.match, patchConfig.replacement)

            patchesToDo.delete(patchConfig);
          }

          modulesInitializersOrWhatever[key] = new Function(
            ... moduleInitializerArgs,
            patchedModuleInitializerFnBodyStr
          );
        }

        return modulesInitializersOrWhatever;
      }

      function hookWebpackJsonpPush() {
        let push = unsafeWindow.webpackJsonp.push;
        Object.defineProperty(unsafeWindow.webpackJsonp, 'push', {
          get() {
            return push;
          },

          set(value) {
            const prevPush = push;
            push = value;

            if (prevPush !== push && typeof push === 'function' && !push._mpipHooked) {
              push = new Proxy(push, {
                apply(ogPush, thisArg, args) {
                  const [[moduleIdsOrWhatever, modulesInitializersOrWhatever]] = args;

                  let newModulesInitializersOrWhatever = modulesInitializersOrWhatever;
                  if (patchesToDo.size > 0) {
                    newModulesInitializersOrWhatever = performPatches(modulesInitializersOrWhatever);

                    if (patchesToDo.size === 0) {
                      resolve();
                    }
                  }

                  return ogPush.apply(thisArg, args);
                }
              });

              push._mpipHooked = true;
            }
          }
        });
      }

      function hookWebpackJsonp() {
        let webpackJsonp = unsafeWindow.webpackJsonp;
        Object.defineProperty(unsafeWindow, 'webpackJsonp', {
          get() {
            return webpackJsonp;
          },

          set(value) {
            const prevWebpackJsonp = webpackJsonp;
            webpackJsonp = value;

            if (prevWebpackJsonp !== webpackJsonp && typeof webpackJsonp === 'object') {
              hookWebpackJsonpPush();
            }
          }
        });
      }

      if (unsafeWindow.webpackJsonp != null) {
        if (!(unsafeWindow.webpackJsonp.push?.toString().includes('[native code]') ?? true)) {
          console.warn(LOG_PREFIX, 'window.webpackJsonp.push() already initialized. Webpack module patches may not work!');
        }

        hookWebpackJsonpPush();
      } else {
        hookWebpackJsonp();
      }
    });
  }

  webpackPatch([
    {
      // Patch maplibregl's isPointableEvent() util[^1] to not use `instanceof` for checking if an event
      // is a MouseEvent or WheelEvent when handling DOM events[^2].
      //
      // This was a problem because the PiP window has different MouseEvent/WheelEvent objects on its window,
      // which made this test not pass.
      //
      // Fixes scroll to zoom not working in the PiP window.
      //
      // [1]: https://github.com/maplibre/maplibre-gl-js/blob/v5.3.1/src/util/util.ts#L1066-L1068
      // [2]: https://github.com/maplibre/maplibre-gl-js/blob/v5.3.1/src/ui/handler_manager.ts#L390
      needle: 'CooperativeGesturesHandler.WindowsHelpText',
      match: /([\w$]+)\s*instanceof\s*MouseEvent\s*\|\|\s*\1\s*instanceof\s*WheelEvent/,
      replacement: `'clientX' in $1`,
    }
  ])
    .then(() => {
      console.info(LOG_PREFIX, 'Successfully patched Webpack Maplibre module');
    })
    .catch((error) => {
      console.error(LOG_PREFIX, 'Could not perform Webpack Maplibre module patches:', error);
    });

  const settings = {
    keepMarkerCentered: true,
    keepMarkerFacingDirectionOfTravel: true,
    autoContractSiteMinimap: true
  };
  Object.assign(settings, Object.fromEntries(
    await Promise.all(
      Object.keys(settings)
        .map((key) =>
          GM.getValue(key, /* defaultValue: */ settings[key])
            .then((value) => [key, value])
        )
    )
  ));

  async function saveSettings() {
    for (const key in settings) {
      await GM.setValue(key, settings[key]);
    }
  }

  let pipWindow;
  let placeholderMapEl;
  let minimapExpandStateBeforePiP;

  async function openPiP() {
    const mapContainerEl = await IRF.dom.map;
    const mapVDOM = await IRF.vdom.map;
    const minimapEl = mapVDOM.data.map.getContainer();

    if (pipWindow) {
      await closePiP();
    }

    pipWindow = await documentPictureInPicture.requestWindow({
      width: 300,
      height: 300
    });
    createPiPStyleSheet(pipWindow);

    if (settings.autoContractSiteMinimap) {
      minimapExpandStateBeforePiP = mapVDOM.state.isExpanded;
      mapVDOM.state.isExpanded = false;
    }

    placeholderMapEl = minimapEl.cloneNode(/* deep: */ false);
    placeholderMapEl.classList.add(cssClass('placeholder-map'));
    minimapEl.insertAdjacentElement('afterend', placeholderMapEl);

    {
      const placeholderMapInstructionalTextEl = document.createElement('span');
      placeholderMapInstructionalTextEl.textContent = 'Minimap open in Picture in Picture';

      const placeholderMapCloseButtonEl = document.createElement('button');
      placeholderMapCloseButtonEl.textContent = 'Bring back here';
      placeholderMapCloseButtonEl.classList.add(cssClass('placeholder-map__bring-back-button'));
      placeholderMapCloseButtonEl.addEventListener('click', closePiP);

      placeholderMapEl.append(
        placeholderMapInstructionalTextEl,
        placeholderMapCloseButtonEl
      );
    }

    document.body.classList.toggle(cssClass('is-in-pip'), true);

    pipWindow.document.body.append(minimapEl);

    const containerVDOM = await IRF.vdom.container;
    applyEnabledPiPOnlyMinimapTransforms(mapVDOM.data.map, {
      coords: containerVDOM.data.currentCoords,
      heading: containerVDOM.data.currentHeading
    });

    pipWindow.addEventListener('pagehide', closePiP);

    for (const element of storedEventListenersToReplicateInPiPWindow.keys()) {
      let targetElement;

      switch (element) {
        case window: {
          targetElement = pipWindow;
          break;
        }
        case document: {
          targetElement = pipWindow.document;
          break;
        }
        case document.body:
        case mapContainerEl: {
          targetElement = pipWindow.document.body;
          break;
        }
        default: {
          continue;
        }
      }

      for (const addEventListenerArgs of storedEventListenersToReplicateInPiPWindow.get(element)) {
        targetElement.addEventListener(... addEventListenerArgs);
      }
    }
  }

  async function closePiP() {
    const mapVDOM = await IRF.vdom.map;
    const minimapEl = mapVDOM.data.map.getContainer();

    document.body.classList.toggle(cssClass('is-in-pip'), false);

    if (placeholderMapEl) {
      placeholderMapEl.insertAdjacentElement('beforebegin', minimapEl);
      placeholderMapEl.remove();
    }

    if (settings.autoContractSiteMinimap && minimapExpandStateBeforePiP) {
      mapVDOM.state.isExpanded = minimapExpandStateBeforePiP;
    }

    pipWindow?.close();

    pipWindow = null;
  }

  GM.registerMenuCommand('Open Minimap Picture in Picture', openPiP);

  {
    const tab = IRF.ui.panel.createTabFor(
      {
        ... GM.info,
        script: {
          ... GM.info.script,
          name: GM.info.script.name.replace('Internet Roadtrip - ', '')
        }
      },
      {
        tabName: 'Map Picture in Picture',
        style: `
        .${cssClass('settings-tab-content')} {
          & *, *::before, *::after {
            box-sizing: border-box;
          }

          & .${cssClass('field-group')} {
            margin-block: 1rem;
            gap: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & input:is(:not([type]), [type="text"], [type="number"]) {
              --padding-inline: 0.5rem;

              width: calc(100% - 2 * var(--padding-inline));
              min-height: 1.5rem;
              margin: 0;
              padding-inline: var(--padding-inline);
              color: white;
              background: transparent;
              border: 1px solid #848e95;
              font-size: 100%;
              border-radius: 5rem;
            }
          }
        }
        `,
        className: cssClass('settings-tab-content')
      }
    );

    function makeFieldGroup({ id, label }, renderInput) {
      const fieldGroupEl = document.createElement('div');
      fieldGroupEl.className = cssClass('field-group');

      const labelEl = document.createElement('label');
      labelEl.textContent = label;

      const inputEl = renderInput({ id });

      fieldGroupEl.append(
        labelEl,
        inputEl
      )

      return fieldGroupEl;
    }

    tab.container.append(
      makeFieldGroup({ id: `${CSS_PREFIX}keep-marker-centered-toggle`, label: 'Keep Map Marker Centered while in PiP' }, () => {
        const inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = settings.keepMarkerCentered;

        inputEl.addEventListener('change', async () => {
          settings.keepMarkerCentered = inputEl.checked;
          await saveSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}keep-marker-facing-direction-of-travel-toggle`, label: 'Keep Map Marker Facing the Direction of Travel while in PiP' }, () => {
        const inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = settings.keepMarkerFacingDirectionOfTravel;

        inputEl.addEventListener('change', async () => {
          settings.keepMarkerFacingDirectionOfTravel = inputEl.checked;
          await saveSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}auto-contract-site-minimap-toggle`, label: 'Contract minimap when opening PiP' }, () => {
        const inputEl = document.createElement('input');
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = settings.autoContractSiteMinimap;

        inputEl.addEventListener('change', async () => {
          settings.autoContractSiteMinimap = inputEl.checked;
          await saveSettings();
        });

        return inputEl;
      })
    );
  }

  {
    const mapEl = await IRF.dom.map;

    const originalInfoButtonEl = mapEl.querySelector('.info-button');
    const originalInfoButtonComputedStyle = window.getComputedStyle(originalInfoButtonEl);

    GM_addStyle(`
    .map-container {
      & .${cssClass('toggle-pip')} {
        bottom: calc(2 * ${originalInfoButtonComputedStyle.bottom} + ${originalInfoButtonComputedStyle.height});

        & img {
          padding: 0.125rem;
        }

        body.${cssClass('is-in-pip')} & {
          display: none;
        }
      }

      & .${cssClass('placeholder-map')} {
        text-align: center;
        font-size: 0.9rem;
        color: white;
        background-color: rgba(0 0 0 / 75%);
        user-select: none;
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        gap: 0.25rem;
        align-items: center;
        place-content: center;

        & .${cssClass('placeholder-map__bring-back-button')} {
          -webkit-appearance: none;
          appearance: none;
          color: black;
          background-color: white;
          border: none;
          border-radius: 4px;
          padding: 0.25rem;
          cursor: pointer;
        }
      }
    }
    `);

    const togglePiPButtonEl = originalInfoButtonEl.cloneNode(/* deep: */ true);
    togglePiPButtonEl.className = `info-button ${cssClass('toggle-pip')}`;

    const togglePiPButtonImageEl = togglePiPButtonEl.querySelector('img');
    togglePiPButtonImageEl.src = 'https://www.svgrepo.com/show/347276/picture-in-picture.svg';

    togglePiPButtonEl.addEventListener('click', openPiP);

    await IRF.vdom.map; // FIXME(netux): this is needed so a bunch of stuff doesn't crash? 🤷
    mapEl.appendChild(togglePiPButtonEl);
  }

  function applyEnabledPiPOnlyMinimapTransforms(minimap, { coords, heading }) {
    if (settings.keepMarkerCentered) { // minimap is in PiP
      minimap.flyTo({
        center: [coords.lng, coords.lat],
        animate: false
      });
    }

    if (settings.keepMarkerFacingDirectionOfTravel) {
      minimap.rotateTo(heading);
    }
  }

  {
    const containerVDOM = await IRF.vdom.container;
    const mapVDOM = await IRF.vdom.map;

    containerVDOM.state.changeStop = new Proxy(containerVDOM.methods.changeStop, {
      apply(ogChangeStop, thisArg, args) {
        if (pipWindow) {
          const newHeading = args[3];
          applyEnabledPiPOnlyMinimapTransforms(mapVDOM.data.map, { coords: containerVDOM.data.currentCoords, heading: newHeading });
        }
        return ogChangeStop.apply(thisArg, args);
      }
    })
  }
})();
