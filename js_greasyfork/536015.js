// ==UserScript==
// @name         Internet Roadtrip - Look Out the Window v1
// @description  Allows you rotate your view 90 degrees and zoom in on neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/internet-roadtrip/look-out-the-window-v1
// @version      1.22.0
// @author       netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Look%20Out%20the%20Window%20logo.png
// @grant        GM.setValues
// @grant        GM.getValues
// @grant        GM.registerMenuCommand
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536015/Internet%20Roadtrip%20-%20Look%20Out%20the%20Window%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/536015/Internet%20Roadtrip%20-%20Look%20Out%20the%20Window%20v1.meta.js
// ==/UserScript==

/* globals IRF, VM */

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');
  const MOD_PREFIX = 'lotwv1-';
  const LEGACY_LOCAL_STORAGE_KEY = "internet-roadtrip/mod/look-out-the-window";

  // https://developers.google.com/maps/documentation/embed/embedding-map#streetview_mode
  const MIN_FOV = 10;
  const MAX_FOV = 100;

  const MIN_ZOOM = 1; // not to be confused with zeroeth zoom
  const MAX_ZOOM = 20;

  const MIN_ZOOM_SPEED = 1.001;
  const MAX_ZOOM_SPEED = 1.5;

  const MIN_ZEROETH_ZOOM_FOV = 90;
  const MIN_ZEROETH_ZOOM_ZOOM = 1;

  const MAX_ZEROETH_ZOOM_FOV = MAX_FOV;
  const MAX_ZEROETH_ZOOM_ZOOM = 1.48; // roughly visually equal to 1x at 90° FOV on a 16:9 display

  const calculateZeroethZoom = () => {
    const clampedFov = Math.max(MIN_ZEROETH_ZOOM_FOV, state.settings.fov);

    // Gradually set zeroeth zoom according to fov level
    // When fov = MIN_ZEROETH_ZOOM_FOV => zeroeth zoom = MIN_ZEROETH_ZOOM_ZOOM
    // When fov = MAX_ZEROETH_ZOOM_FOV => zeroeth zoom = MAX_ZEROETH_ZOOM_ZOOM
    // https://www.desmos.com/calculator/8dssjjiog1
    return Math.sqrt(
        Math.pow(
          (MAX_ZEROETH_ZOOM_ZOOM - MIN_ZEROETH_ZOOM_ZOOM) / (MAX_ZEROETH_ZOOM_FOV - MIN_ZEROETH_ZOOM_FOV),
          1 / Math.sqrt(2)
        ) *
        (clampedFov - MIN_ZEROETH_ZOOM_FOV) -
        (-MIN_ZEROETH_ZOOM_ZOOM)
    );
  };

  const Direction = Object.freeze({
    FRONT: 0,
    RIGHT: 1,
    BACK: 2,
    LEFT: 3
  });

  const DEFAULT_SETTINGS = {
    lookingDirection: Direction.FRONT,
    fov: 90,
    zoom: 1, // normalized [MIN_ZOOM, MAX_ZOOM]
    zoomSpeed: 1.1,
    zoomParallax: {
      multiplier: null, // null => multiplier = 1 - offset
      offset: 0.6
    },
    showVehicleUi: true,
    alwaysShowGameUi: false,
    frontOverlay: {
      imageSrc: null
    },
    backOverlay: {
      imageSrc: `https://cloudy.netux.site/neal_internet_roadtrip/back%20window.png`,
      transformOrigin: {
        x: "50%",
        y: "20%"
      }
    },
    leftOverlay: {
      imageSrc: `https://cloudy.netux.site/neal_internet_roadtrip/side%20window.png`,
      transformOrigin: {
        x: "50%",
        y: "40%"
      },
      flip: true
    },
    rightOverlay: {
      imageSrc: `https://cloudy.netux.site/neal_internet_roadtrip/side%20window.png`,
      transformOrigin: {
        x: "50%",
        y: "40%"
      }
    }
  };

  const state = {
    settings: structuredClone(DEFAULT_SETTINGS),
    tabFields: {},
    dom: {},
  };

  {
    // migrate locals storage data form versions <=1.12.0
    if (LEGACY_LOCAL_STORAGE_KEY in localStorage) {
      const localStorageSettings = JSON.parse(localStorage.getItem(LEGACY_LOCAL_STORAGE_KEY));
      await GM.setValues(localStorageSettings);
      localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
    }
  }

  {
    const storedSettings = await GM.getValues(Object.keys(state.settings))
    Object.assign(
      state.settings,
      storedSettings
    );
  }

  { // migrate from single side overlay config from versions <=1.16.0
    if (state.settings.sideOverlay) {
      state.settings.rightOverlay = state.settings.sideOverlay;
      state.settings.leftOverlay = { ... state.settings.sideOverlay, flip: true };
      delete state.settings.sideOverlay;
    }
  }

  // Set zoom level so, no matter the configured fov, it looks like 90°.
  state.settings.zoom = Math.max(state.settings.zoom, calculateZeroethZoom());

  const cssClass = (... names) => names.map((name) => `${MOD_PREFIX}${name}`).join(' ');

  let aisvApi;
  const waitForAisvApi = new Promise((resolve) => {
    if (unsafeWindow._AISV) {
      resolve(unsafeWindow._AISV);
    } else {
      let aisvApi = unsafeWindow._AISV;
      Object.defineProperty(unsafeWindow, '_AISV', {
        get() {
          return aisvApi;
        },
        set(newAisvApi) {
          aisvApi = newAisvApi;
          resolve(aisvApi);
          return aisvApi;
        },
        configurable: true,
        enumerable: true,
      });
    }
  });
  waitForAisvApi.then((newAisvApi) => {
    aisvApi = newAisvApi;
  });

  function setupDom() {
    injectMainStylesheet();
    injectMinimapMarkerTurnStylesheet();
    preloadOverlayImages();

    const containerEl = document.querySelector('.container');
    state.dom.containerEl = containerEl;

    state.dom.panoIframeEls = Array.from(containerEl.querySelectorAll('.pano'));

    state.dom.overlayImageEl = VM.hm('div', { className: cssClass('overlay__image') });
    state.dom.overlayEl = VM.hm('div', { className: cssClass('overlay') }, state.dom.overlayImageEl);
    state.dom.panoIframeEls.at(-1).insertAdjacentElement('afterend', state.dom.overlayEl);

    async function lookRight() {
      state.settings.lookingDirection = (state.settings.lookingDirection + 1) % 4;
      updateLookAt();
      await saveSettings();
    }

    async function lookLeft() {
      state.settings.lookingDirection = state.settings.lookingDirection - 1;
      if (state.settings.lookingDirection < 0) {
        state.settings.lookingDirection = 3;
      }
      updateLookAt();
      await saveSettings();
    }

    const chevronImage = (rotation) => VM.hm('img', {
      src: '/sell-sell-sell/arrow.svg', // yoink
      style: `
        width: 10px;
        aspectRatio: 1;
        filter: invert(1);
        rotate: ${rotation}deg;
      `
    });

    state.dom.lookLeftButtonEl = VM.hm('button', { className: cssClass('look-left-btn') }, chevronImage(90));
    state.dom.lookLeftButtonEl.addEventListener('click', lookLeft);
    containerEl.appendChild(state.dom.lookLeftButtonEl);

    state.dom.lookRightButtonEl = VM.hm('button', { className: cssClass('look-right-btn') }, chevronImage(-90));
    state.dom.lookRightButtonEl.addEventListener('click', lookRight);
    containerEl.appendChild(state.dom.lookRightButtonEl);

    async function handleKeyDown({ key }) {
      switch (key) {
        case "ArrowLeft": {
          await lookLeft();
          break;
        }
        case "ArrowRight": {
          await lookRight();
          break;
        }
      }
    }

    window.addEventListener('keydown', (event) => {
      if (event.target !== document.body) {
        return;
      }

      handleKeyDown(event);
    });
    waitForAisvApi.then((aisvApi) => {
      aisvApi.messenger.addEventListener('keyDown', (event) => {
        handleKeyDown(event.args);
      });
    });

    window.addEventListener('wheel', async (event) => {
      if (event.target !== document.documentElement) { // pointing at nothing but the backdrop
        return;
      }

      if (aisvApi?.patched) {
        // AISV's frame is interactible, meaning it eats our wheel inputs, so this is a bit useless.
        // Still, it doesn't hurt to try and prevent any possible "double zoom" issues down the line.
        return;
      }

      const scrollingForward = event.deltaY < 0;

      const newZoom = state.settings.zoom * (scrollingForward ? state.settings.zoomSpeed : (1 / state.settings.zoomSpeed));

      state.settings.zoom = Math.min(Math.max(MIN_ZOOM, newZoom), MAX_ZOOM);
      updateZoom();
      await saveSettings();
    });

    createSettings();

    updateUiFromSettings();
    updateOverlays();
    updateLookAt();
    updateZoom();
  }

  function injectMainStylesheet() {
    GM_addStyle(`
    body {
      & .${cssClass('look-right-btn')}, & .${cssClass('look-left-btn')} {
        position: fixed;
        bottom: 200px;
        transform: translateY(-50%);
        padding-block: 1.5rem;
        border: none;
        background-color: whitesmoke;
        cursor: pointer;
      }

      & .${cssClass('look-right-btn')} {
        right: 0;
        padding-inline: 0.35rem 0.125rem;
        border-radius: 15px 0 0 15px;
      }

      & .${cssClass('look-left-btn')} {
        left: 0;
        padding-inline: 0.125rem 0.25rem;
        border-radius: 0 15px 15px 0;
      }

      &:not(.${cssClass('always-show-game-ui')}):not([data-look-out-the-window-direction="${Direction.FRONT}"]) :is(.freshener-container, .wheel-container, .options) {
        display: none;
      }

      & .${cssClass('overlay')} {
        position: fixed;
        width: 100%;
        height: 100%;
        pointer-events: none;
        display: none;

        &.${cssClass('overlay--flipped')} {
          rotate: y 180deg;
        }

        & .${cssClass('overlay__image')} {
          position: absolute;
          top: 0%;
          left: 0%;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
        }
      }

      &[data-look-out-the-window-direction="${Direction.FRONT}"] .${cssClass('overlay__image')} {
        transform-origin: var(--${MOD_PREFIX}front-overlay-transform-origin);
        background-image: var(--${MOD_PREFIX}front-overlay-image-src);
      }
      &[data-look-out-the-window-direction="${Direction.LEFT}"] .${cssClass('overlay__image')} {
        transform-origin: var(--${MOD_PREFIX}left-overlay-transform-origin);
        background-image: var(--${MOD_PREFIX}left-overlay-image-src);
      }
      &[data-look-out-the-window-direction="${Direction.RIGHT}"] .${cssClass('overlay__image')} {
        transform-origin: var(--${MOD_PREFIX}right-overlay-transform-origin);
        background-image: var(--${MOD_PREFIX}right-overlay-image-src);
      }
      &[data-look-out-the-window-direction="${Direction.BACK}"] .${cssClass('overlay__image')} {
        transform-origin: var(--${MOD_PREFIX}back-overlay-transform-origin);
        background-image: var(--${MOD_PREFIX}back-overlay-image-src);
      }

      &.${cssClass('show-vehicle-ui')} .${cssClass('overlay')} {
        display: initial;
      }

      & .pano, & .${cssClass('overlay')}.${cssClass('overlay__image')} {
        transition: opacity 300ms linear, scale 100ms linear;
      }
    }
    `);
  }

  async function injectMinimapMarkerTurnStylesheet() {
    let markerStyleImageUrlCss = 'none';

    const styleEl = GM_addStyle();

    const emptyStylesheet = () => {
      styleEl.textContent = '';
    };

    const rerenderStylesheet = () => {
      styleEl.textContent = `
        #mini-map {
          .marker {
            background-image: none !important;

            &::before {
              content: "";
              position: absolute;
              width: 100%;
              height: 100%;
              background: inherit;
              background-image: ${markerStyleImageUrlCss};
            }
          }
        }

        body {
          &[data-look-out-the-window-direction="${Direction.FRONT}"] #mini-map .marker::before {
            rotate: 0deg;
          }
          &[data-look-out-the-window-direction="${Direction.LEFT}"] #mini-map .marker::before {
            rotate: -90deg;
          }
          &[data-look-out-the-window-direction="${Direction.RIGHT}"] #mini-map .marker::before {
            rotate: 90deg;
          }
          &[data-look-out-the-window-direction="${Direction.BACK}"] #mini-map .marker::before {
            rotate: 180deg;
          }
        }
      `;
    };

    const markerEl = await (new Promise(async (resolve) => {
      const mapContainerEl = await IRF.dom.map;

      const getMarkerEl = () => mapContainerEl.querySelector('.marker');

      if (getMarkerEl()) {
        resolve(getMarkerEl());
        return;
      }

      new MutationObserver((_records, mutationObserver) => {
        const markerEl = getMarkerEl();

        if (markerEl) {
          mutationObserver.disconnect();
          resolve(markerEl);
        }
      }).observe(
        mapContainerEl,
        {
          childList: true,
          subtree: true
        }
      )
    }));

    const updateAndRerenderStylesheet = () => {
      emptyStylesheet();
      markerStyleImageUrlCss = markerEl.style.backgroundImage;
      rerenderStylesheet();
    };

    new MutationObserver(updateAndRerenderStylesheet).observe(
      markerEl,
      {
        attributes: true,
        attributeFilter: ['style']
      }
    );

    updateAndRerenderStylesheet();
  }

  function preloadOverlayImages() {
    const configuredOverlayImagesSources = [state.settings.frontOverlay, state.settings.sideOverlay, state.settings.backOverlay]
      .map((overlay) => overlay?.imageSrc)
      .filter((imageSrc) => !!imageSrc);

    for (const imageSrc of configuredOverlayImagesSources) {
      if (imageSrc.startsWith('data:')) {
        continue;
      }

      const image = new Image();
      image.onload = () => {
        console.debug(`Successfully preloaded Look Out the Window overlay image at "${imageSrc}"`);
      };
      image.onerror = (event) => {
        console.error(`Failed to preload Look Out the Window overlay image at "${imageSrc}"`, event);
      };
      image.src = imageSrc;
    }
  }

  function createSettings() {
    const UNDO_ICON_SRC = 'https://www.svgrepo.com/show/511181/undo.svg';

    const settingsTab = IRF.ui.panel.createTabFor(
      {
        ... GM.info,
        script: {
          ... GM.info.script,
          name: MOD_NAME,
          icon: null
        }
      },
      {
        tabName: 'Look Out the Window',
        style: `
        .${cssClass('settings-tab-content')} {
          container-name: lotw-settings-tab-content;
          container-type: inline-size;

          & *, *::before, *::after {
            box-sizing: border-box;
          }

          & button {
            padding: 0.25rem;
            margin-left: 0.125rem;
            gap: 0.25rem;
            cursor: pointer;
            border: none;
            align-items: center;
            justify-content: center;
            background-color: white;
            display: inline-flex;

            & > img {
              width: 1rem;
              vertical-align: middle;
              user-select: none;
            }
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

            & input[type="range"] {
              width: 200px;
            }

            & .${cssClass('field-group__label-container')},
            & .${cssClass('field-group__input-container')} {
              display: flex;
              justify-content: space-between;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              gap: 1ch;
            }

            & .${cssClass('field-group__input-container')} {
              white-space: nowrap;
            }
          }

          & .${cssClass('overlay-settings-container')} {
            display: grid;
            gap: 0.5rem;
            grid-template: 1fr / repeat(4, 1fr);

            & .${cssClass('overlay-setting')} {
              position: relative;
              display: flex;
              flex-direction: column;
              background-color: rgba(255 255 255 / 10%);

              & .${cssClass('overlay-setting__header')} {
                padding: 0.25rem;
                background-color: rgba(255 255 255 / 10%);
                align-items: center;
                justify-content: space-between;
                display: flex;
              }

              & .${cssClass('overlay-preview')} {
                position: relative;
                height: fit-content;
                min-height: 100px;
                margin-block: auto;
                cursor: pointer;
                overflow: hidden;

                /* Checkerboard */
                background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAAXNSR0IArs4c6QAAABtJREFUGFdj7Ovr+29oaMjAuG///v8Xzl9gAABLjgjpsdlMqQAAAABJRU5ErkJggg==");
                background-repeat: repeat;
                background-size: 10px;
                image-rendering: pixelated;

                & .${cssClass('overlay-preview__image')} {
                  image-rendering: revert;
                  width: 100%;
                  display: block;
                }

                & .${cssClass('overlay-preview__transform-origin')} {
                  position: absolute;
                  left: var(--transform-origin-x);
                  top: var(--transform-origin-y);
                  translate: -50% -50%;
                  zoom: 7;
                  stroke: #bb1313;
                  stroke-width: 0.3;
                  pointer-events: none;
                }

                & .${cssClass('overlay-preview__no-image-text')},
                & .${cssClass('overlay-preview__image-load-failed-text')} {
                  text-align: center;
                  white-space: pre-wrap;
                  pointer-events: none;
                  display: none;
                }

                & .${cssClass('overlay-preview__no-image-text')} {
                  color: grey;
                }

                & .${cssClass('overlay-preview__image-load-failed-text')} {
                  color: red;
                }

                &::after {
                  content: "";
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  pointer-events: none;
                  background-color: transparent;
                  transition: background-color 0.15s linear;
                }
                &.${cssClass('overlay-preview--dropping-file')}::after {
                  background-color: rgb(32 213 32 / 27%);
                }
              }
              &.${cssClass('overlay-setting--no-transform-origin')} .${cssClass('overlay-preview')} {
                & .${cssClass('overlay-preview__transform-origin')} {
                  display: none;
                }
              }
              &.${cssClass('overlay-setting--no-image')} .${cssClass('overlay-preview')},
              &.${cssClass('overlay-setting--image-load-failed')} .${cssClass('overlay-preview')} {
                height: 100%;
                background-image: none;
                display: flex;

                &::after {
                  box-shadow: 0 0 7px black inset;
                }

                & .${cssClass('overlay-preview__image')},
                & .${cssClass('overlay-preview__transform-origin')} {
                  display: none;
                }
              }
              &.${cssClass('overlay-setting--no-image')} .${cssClass('overlay-preview')} .${cssClass('overlay-preview__no-image-text')} {
                margin: auto;
                display: revert;
              }
              &.${cssClass('overlay-setting--image-load-failed')} .${cssClass('overlay-preview')} .${cssClass('overlay-preview__image-load-failed-text')} {
                margin: auto;
                display: revert;
              }
              &.${cssClass('overlay-setting--image-flipped')} .${cssClass('overlay-preview')} {
                rotate: y 180deg;

                & .${cssClass('overlay-preview__no-image-text')},
                & .${cssClass('overlay-preview__image-load-failed-text')} {
                  /* Unflip the text */
                  rotate: y 180deg;
                }
              }

              & .${cssClass('overlay-image-actions')} {
                display: flex;

                & button {
                  width: 100%;
                }
              }

              & .${cssClass('overlay-fields')} {
                margin-top: 0.25rem;

                & .${cssClass('field-group')} {
                  margin: 0.25rem;
                }
              }

              &.${cssClass('overlay-setting--no-image')} .${cssClass('overlay-thing--only-show-with-image')},
              &:not(.${cssClass('overlay-setting--no-image')}) .${cssClass('overlay-thing--only-show-without-image')} {
                display: none;
              }
            }
          }

          @container lotw-settings-tab-content (width < 600px) {
            .${cssClass('overlay-settings-container')} {
              grid-template-columns: repeat(2, 1fr);
            }
          }

          & .${cssClass('info-icon')} {
            --icon-size: 1rem;
            --tip-height: 15px;

            position: relative;
            width: var(--icon-size);
            aspect-ratio: 1;
            margin-inline: 0.25rem;
            vertical-align: text-top;
            background-image: url("https://www.svgrepo.com/show/509372/info.svg");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            display: inline-block;

            /* The background image is black. Invert it to match the color scheme of the IRF panel */
            filter: invert(1);
            &::before, &::after {
              /* But undo the inversion on the tooltip content */
              filter: invert(1);
            }

            &::before {
              content: "";
              position: absolute;
              height: var(--tip-height);
              aspect-ratio: 1.5;
              background-color: white;
              pointer-events: none;
              z-index: 1;
            }

            &::after {
              position: absolute;
              top: 0;
              left: 0;
              min-width: 200px;
              content: attr(data-tooltip);
              white-space: pre-wrap;
              padding: 0.5rem;
              border-radius: 0.5rem;
              color: black;
              font-size: 80%;
              background-color: white;
              pointer-events: none;
              z-index: 2;
            }

            &:not([data-tooltip-text-align]) {
              text-align: center;
            }
            &[data-tooltip-text-align] {
              text-align: attr(data-tooltip-text-align);
            }

            &:not([data-tooltip-prefer-direction]), &[data-tooltip-prefer-direction="up"] {
              &::before {
                top: 0;
                left: 50%;
                translate: -50% -100%;
                clip-path: polygon(0 0, 100% 0%, 50% 100%);
              }

              &::after {
                translate: -50% calc(-100% - var(--tip-height) + 1px);
              }
            }
            &[data-tooltip-prefer-direction="down"] {
              &::before {
                bottom: 0;
                left: 50%;
                translate: -50% 100%;
                clip-path: polygon(0 100%, 100% 100%, 50% 0);
              }

              &::after {
                translate: -50% calc(var(--icon-size) + var(--tip-height) - 1px);
              }
            }

            &::before, &::after {
              opacity: 0;
            }
            &:hover::before, &:hover::after {
              transition: opacity 0s;
              transition-delay: 0.5s;
              opacity: 1;
            }
          }
        }
        `,
        className: cssClass('settings-tab-content')
      }
    );


    class FieldGroup {
      /** @type {string} */
      id;
      /** @type {any} */
      defaultValue;
      /** @type {(() => boolean)?} */
      isDefaultValue;

      /** @type {HTMLDivElement} */
      fieldGroupEl;
      /** @type {HTMLElement} */
      inputEl;

      /** @type {HTMLSpanElement} */
      #inputValueEl;
      /** @type {HTMLButtonElement} */
      #revertToDefaultButtonEl;
      /** @type {(() => Promise<void>)} */
      #changeHandler;

      constructor(config, renderInput) {
        this.id = config.id;
        Object.defineProperty(this, 'defaultValue', Object.getOwnPropertyDescriptor(config, 'defaultValue')); // this.defaultValue = config.defaultValue;
        this.isDefaultValue = config.isDefaultValue;

        const labelContents = [];
        const inputContents = [];

        if (config.hasValueText != null) {
          this.#inputValueEl = VM.hm('span', {});
          inputContents.unshift(this.#inputValueEl);
        }

        this.#changeHandler = null;

        labelContents.push(
          VM.hm('label', { labelFor: config.id }, config.label)
        );

        if (config.helpTooltip) {
          const helpTooltipEl = VM.hm('div', {
            className: cssClass('info-icon'),
            'data-tooltip': config.helpTooltip.text
          });

          if (config.helpTooltip.preferDirection) {
            helpTooltipEl.dataset.tooltipPreferDirection = config.helpTooltip.preferDirection;
          }

          if (config.helpTooltip.textAlign) {
            helpTooltipEl.dataset.tooltipTextAlign = config.helpTooltip.textAlign;
          }

          labelContents.push(helpTooltipEl);
        }

        this.inputEl = renderInput({
          id: this.id,
          triggerUpdate: this.triggerUpdate.bind(this),
          onChange: this.onChange.bind(this)
        });
        inputContents.push(this.inputEl);

        if (config.hasRevertToDefaultButton) {
          this.#revertToDefaultButtonEl = VM.hm('button', {}, VM.h('img', { src: UNDO_ICON_SRC }));
          this.updateRevertToDefaultButtonVisibility();

          this.#revertToDefaultButtonEl.addEventListener('click', () => {
            this.#changeHandler?.(this.defaultValue);
          });

          labelContents.push(this.#revertToDefaultButtonEl);
        }

        this.fieldGroupEl = VM.hm('div', { className: cssClass('field-group') }, [
          labelContents.length === 1 ?
            labelContents[0]
            : VM.hm('div', { className: cssClass('field-group__label-container') }, labelContents),
          inputContents.length === 1 ?
            inputContents[0]
            : VM.hm('div', { className: cssClass('field-group__input-container') }, inputContents)
        ]);
      }

      onChange(handler) {
        this.#changeHandler = handler;
      }

      async triggerUpdate() {
        this.updateRevertToDefaultButtonVisibility();
        await saveSettings();
        updateUiFromSettings();
      }

      updateInputValue(value) {
        this.#changeHandler?.(value);
        updateUiFromSettings();
      }

      updateValueText(text) {
        if (this.#inputValueEl != null) {
          this.#inputValueEl.textContent = text;
        }
      }

      updateRevertToDefaultButtonVisibility() {
        if (this.#revertToDefaultButtonEl !== undefined && this.isDefaultValue != null) {
          this.#revertToDefaultButtonEl.style.display = this.isDefaultValue() ? 'none' : '';
        }
      }
    }

    state.tabFields.toggleVehicleOverlay = new FieldGroup(
      {
        id: `${MOD_PREFIX}toggle-vehicle-overlay`,
        label: 'Enable Vehicle Overlay',
        hasRevertToDefaultButton: true,
        defaultValue: DEFAULT_SETTINGS.showVehicleUi,
        isDefaultValue: () => state.settings.showVehicleUi === DEFAULT_SETTINGS.showVehicleUi,
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'checkbox',
          className: IRF.ui.panel.styles.toggle
        });
        inputEl.checked = state.settings.showVehicleUi;

        inputEl.addEventListener('change', async () => {
          state.settings.showVehicleUi = inputEl.checked;
          await triggerUpdate();
        });

        onChange(async (newValue) => {
          state.settings.showVehicleUi = newValue;
          inputEl.checked = newValue;
          await triggerUpdate();
        });

        return inputEl;
      }
    );

    state.tabFields.alwaysShowGameUi = new FieldGroup(
      {
        id: `${MOD_PREFIX}always-show-game-ui`,
        label: 'Always show Game UI',
        helpTooltip: {
          text: [
            `By default, the steering wheel, car hangables, and vote arrows are hidden when not looking straight ahead.`,
            `Enabling this option makes those elements always visible.`
          ].join('\n'),
          preferDirection: 'down'
        },
        hasRevertToDefaultButton: true,
        defaultValue: DEFAULT_SETTINGS.alwaysShowGameUi,
        isDefaultValue: () => state.settings.alwaysShowGameUi === DEFAULT_SETTINGS.alwaysShowGameUi,
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'checkbox',
          className: IRF.ui.panel.styles.toggle
        });
        inputEl.checked = state.settings.alwaysShowGameUi;

        inputEl.addEventListener('change', async () => {
          state.settings.alwaysShowGameUi = inputEl.checked;
          await triggerUpdate();
        });

        onChange(async (defaultValue) => {
          state.settings.alwaysShowGameUi = defaultValue;
          inputEl.checked = defaultValue;
          await triggerUpdate();
        });

        return inputEl;
      }
    );

    state.tabFields.fov = new FieldGroup(
      {
        id: `${MOD_PREFIX}fov`,
        label: 'FOV (changes after pano refresh)',
        hasRevertToDefaultButton: true,
        defaultValue: DEFAULT_SETTINGS.fov,
        isDefaultValue: () => state.settings.fov === DEFAULT_SETTINGS.fov,
        hasValueText: true
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'range',
          className: IRF.ui.panel.styles.slider,
          min: MIN_FOV,
          max: MAX_FOV
        });
        inputEl.value = state.settings.fov;

        inputEl.addEventListener('change', async () => {
          state.settings.fov = Number.parseFloat(inputEl.value);
          await triggerUpdate();
        });

        onChange(async (defaultValue) => {
          state.settings.fov = defaultValue;
          inputEl.value = defaultValue.toString();
          await triggerUpdate();
        });

        return inputEl;
      }
    );

    state.tabFields.zoom = new FieldGroup(
      {
        id: `${MOD_PREFIX}zoom`,
        label: 'Zoom',
        hasRevertToDefaultButton: true,
        get defaultValue() { return calculateZeroethZoom() },
        isDefaultValue: () => state.settings.zoom === calculateZeroethZoom(),
        hasValueText: true
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'range',
          className: IRF.ui.panel.styles.slider,
          min: MIN_ZOOM,
          max: MAX_ZOOM,
          step: 0.0005
        });
        inputEl.value = state.settings.zoom;

        inputEl.addEventListener('change', async () => {
          state.settings.zoom = Number.parseFloat(inputEl.value);
          await triggerUpdate();
          updateZoom();
        });

        onChange(async (defaultValue) => {
          const previousValue = state.settings.zoom;

          state.settings.zoom = defaultValue;
          inputEl.value = defaultValue.toString();

          await triggerUpdate();

          if (previousValue !== state.settings.zoom) {
            updateZoom();
          }
        });

        return inputEl;
      }
    );

    state.tabFields.zoomSpeed = new FieldGroup(
      {
        id: `${MOD_PREFIX}zoomSpeed`,
        label: 'Zoom Speed',
        hasRevertToDefaultButton: true,
        defaultValue: DEFAULT_SETTINGS.zoomSpeed,
        isDefaultValue: () => state.settings.zoomSpeed === DEFAULT_SETTINGS.zoomSpeed,
        hasValueText: true
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'range',
          className: IRF.ui.panel.styles.slider,
          min: 0,
          max: 1,
          step: 0.01
        });
        inputEl.value = (state.settings.zoomSpeed - MIN_ZOOM_SPEED) / (MAX_ZOOM_SPEED - MIN_ZOOM_SPEED); // normalize to [0, 1] range;

        inputEl.addEventListener('change', async () => {
          const inputValue = parseFloat(inputEl.value);
          state.settings.zoomSpeed = (inputValue * (MAX_ZOOM_SPEED - MIN_ZOOM_SPEED)) + MIN_ZOOM_SPEED; // expand to [MIN_ZOOM_SPEED, MAX_ZOOM_SPEED] range
          await triggerUpdate();
        });

        onChange(async (defaultValue) => {
          state.settings.zoomSpeed = defaultValue;
          inputEl.value = defaultValue.toString();
          await triggerUpdate();
        });

        return inputEl;
      }
    );

    state.tabFields.zoomParallaxStrength = new FieldGroup(
      {
        id: `${MOD_PREFIX}zoomParallaxStrength`,
        label: 'Zoom Parallax Strength',
        helpTooltip: {
          text: [
            `Controls how much the overlay "disconnects" from the streetview image when zooming in.`,
            `• A value of 0% makes both zoom at the same time.`,
            `• A value of 50% makes the streetview image zoom half as fast as the overlay.`,
            `• A value of 100% only makes the overlay zoom (essentially disabling zooming into the streetview image).`
          ].join('\n'),
          textAlign: 'left'
        },
        hasRevertToDefaultButton: true,
        defaultValue: DEFAULT_SETTINGS.zoomParallax.offset,
        isDefaultValue: () => state.settings.zoomParallax.offset === DEFAULT_SETTINGS.zoomParallax.offset,
        hasValueText: true
      },
      ({ id, triggerUpdate, onChange }) => {
        const inputEl = VM.hm('input', {
          id,
          type: 'range',
          className: IRF.ui.panel.styles.slider,
          min: 0,
          max: 1,
          step: 0.01
        });
        inputEl.value = state.settings.zoomParallax.offset;

        inputEl.addEventListener('input', async () => {
          const inputValue = parseFloat(inputEl.value);
          state.settings.zoomParallax.offset = inputValue;
          await triggerUpdate();
          updateZoom();
        });

        onChange(async (defaultValue) => {
          const previousValue = state.settings.zoomParallax.offset;

          state.settings.zoomParallax.offset = defaultValue;
          inputEl.value = defaultValue.toString();
          await triggerUpdate();

          if (previousValue !== state.settings.zoomParallax.offset) {
            updateZoom();
          }
        });

        return inputEl;
      }
    );

    for (const { fieldGroupEl } of Object.values(state.tabFields)) {
      settingsTab.container.append(fieldGroupEl);
    }

    // #region Overlay settings
    const overlaySettingsContainerGroupEl = VM.hm('div', { className: cssClass('overlay-settings-container') });

    const OVERLAY_SETTINGS_RENDER_CONFIG = [
      {
        fieldId: `${MOD_PREFIX}front-overlay`,
        label: 'Front Overlay',
        overlaySetting: state.settings.frontOverlay,
        defaultOverlaySetting: DEFAULT_SETTINGS.frontOverlay,
      },
      {
        fieldId: `${MOD_PREFIX}back-overlay`,
        label: 'Back Overlay',
        overlaySetting: state.settings.backOverlay,
        defaultOverlaySetting: DEFAULT_SETTINGS.backOverlay,
      },
      {
        fieldId: `${MOD_PREFIX}left-overlay`,
        label: 'Left Overlay',
        overlaySetting: state.settings.leftOverlay,
        defaultOverlaySetting: DEFAULT_SETTINGS.leftOverlay,
      },
      {
        fieldId: `${MOD_PREFIX}right-overlay`,
        label: 'Right Overlay',
        overlaySetting: state.settings.rightOverlay,
        defaultOverlaySetting: DEFAULT_SETTINGS.rightOverlay,
      },
    ];

    for (const {
      fieldId,
      label,
      overlaySetting,
      defaultOverlaySetting
    } of OVERLAY_SETTINGS_RENDER_CONFIG) {
      function handleFileUpload(file) {
        const fileReader = new window.FileReader();
        fileReader.onload = async (event) => {
          overlaySetting.imageSrc = event.target.result;
          await saveSettings();
          updateDom();
        };
        fileReader.readAsDataURL(file);
      }

      const previewImageEl = VM.hm('img', { className: cssClass('overlay-preview__image') });
      const transformOriginCrosshairEl = VM.hm('svg', {
        xmlns: 'http://www.w3.org/2000/svg',
        className: cssClass('overlay-preview__transform-origin'),
        width: 2,
        height: 2
      }, [
        VM.h('line', { x1: 1, y1: 0, x2: 1, y2: 2 }),
        VM.h('line', { x1: 0, y1: 1, x2: 2, y2: 1 })
      ]);

      const fileInputEl = VM.hm('input', { type: 'file' });
      fileInputEl.addEventListener('change', () => {
        const file = fileInputEl.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      const previewEl = VM.hm('div', { className: cssClass('overlay-preview') }, [
        previewImageEl,
        transformOriginCrosshairEl,
        VM.h('span', { className: cssClass('overlay-preview__no-image-text') }, `No image set for this overlay\nClick to select one or drag one in`),
        VM.h('span', { className: cssClass('overlay-preview__image-load-failed-text') }, `Failed to load image`),
      ]);

      previewEl.addEventListener('click', () => fileInputEl.click());

      previewEl.addEventListener('dragover', (event) => {
        event.preventDefault();

        const containsValidData = event.dataTransfer.types.includes("Files");
        event.dataTransfer.dropEffect = containsValidData ? "move" : "none";
        previewEl.classList.toggle(cssClass('overlay-preview--dropping-file'), containsValidData);
      });
      previewEl.addEventListener('dragleave', (event) => {
        previewEl.classList.toggle(cssClass('overlay-preview--dropping-file'), false);
      });
      previewEl.addEventListener('drop', (event) => {
        event.preventDefault();
        previewEl.classList.toggle(cssClass('overlay-preview--dropping-file'), false);

        const file = event.dataTransfer.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      const setImageFromUrlButtonEl = VM.hm('button', {}, [
        VM.h('img', { src: 'https://www.svgrepo.com/show/474041/edit.svg' }),
        'Set image URL'
      ]);
      setImageFromUrlButtonEl.addEventListener('click', async () => {
        const url = prompt([
          'Enter image URL. Ensure it ends in .png, .jpeg, etc.',
          'Do not use Discord CDN links, as they will eventually expire'
        ].join('\n'));

        if (!url) {
          return;
        }

        overlaySetting.imageSrc = url;
        await saveSettings();

        imageLoadFailed = false;
        updateDom();
      });

      const uploadImageButtonEl = VM.hm('button', { className: cssClass('overlay-thing--only-show-without-image') }, [
        VM.h('img', { src: 'https://www.svgrepo.com/show/491151/upload.svg' }),
        'Upload image'
      ]);
      uploadImageButtonEl.addEventListener('click', () => fileInputEl.click());

      const removeImageButtonEl = VM.hm('button', { className: cssClass('overlay-thing--only-show-with-image') }, [
        VM.h('img', { src: 'https://www.svgrepo.com/show/533007/trash.svg' }),
        'Remove image'
      ]);
      removeImageButtonEl.addEventListener('click', async () => {
        if (overlaySetting.imageSrc == null) {
          return;
        }

        if (!confirm(`Are you sure you want to delete this overlay's image?`)) {
          return;
        }

        overlaySetting.imageSrc = null;
        await saveSettings();

        imageLoadFailed = false;
        updateDom();
      });

      const revertToDefaultButtonEl = VM.hm('button', {}, [
        VM.h('img', { src: UNDO_ICON_SRC })
      ]);
      revertToDefaultButtonEl.addEventListener('click', async () => {
        if (!confirm("This will revert the overlay to its default image and settings. Are you sure you want to proceed?")) {
          return;
        }

        for (const key in overlaySetting) {
          delete overlaySetting[key];
        }
        Object.assign(overlaySetting, defaultOverlaySetting);

        await saveSettings();

        imageLoadFailed = false;
        updateDom();
      });

      const transformOriginXInputEl = VM.hm('input', { id: `${fieldId}-transform-origin-x` });
      transformOriginXInputEl.addEventListener('change', async () => {
        overlaySetting.transformOrigin ??= { x: '50%', y: '50%' };
        overlaySetting.transformOrigin.x = transformOriginXInputEl.value;
        await saveSettings();
        updateDom();
      });
      const transformOriginYInputEl = VM.hm('input', { id: `${fieldId}-transform-origin-Y` });
      transformOriginYInputEl.addEventListener('change', async () => {
        overlaySetting.transformOrigin ??= { x: '50%', y: '50%' };
        overlaySetting.transformOrigin.y = transformOriginYInputEl.value;
        await saveSettings();
        updateDom();
      });

      const flipToggleInputEl = VM.hm('input', { id: `${fieldId}-flip`, type: 'checkbox', className: IRF.ui.panel.styles.toggle });
      flipToggleInputEl.addEventListener('change', async () => {
        overlaySetting.flip = flipToggleInputEl.checked;
        await saveSettings();
        updateDom();
      });

      const transformOriginHelpTooltipEl = VM.hm('div', {
        className: cssClass('info-icon'),
        'data-tooltip': [
          'Adjusts the point at which the overlay image will be zoomed in.',
          'Valid values include percentages (%) and "top", "bottom", "left", "right", and "center".'
        ].join('\n')
      });

      const overlaySettingEl = VM.hm('div', { className: cssClass('overlay-setting') }, [
        VM.h('header', { className: cssClass('overlay-setting__header') }, [
          VM.h('label', { labelFor: fieldId }, label),
          VM.h('div', {}, [
            revertToDefaultButtonEl
          ])
        ]),
        previewEl,
        VM.h('div', { className: cssClass('overlay-image-actions') }, [
          setImageFromUrlButtonEl,
          uploadImageButtonEl,
          removeImageButtonEl,
        ]),
        VM.h('div', { className: cssClass('overlay-fields') }, [
          VM.h('div', { className: cssClass('field-group') }, [
            VM.h('label', { labelFor: `${fieldId}-flip` }, 'Flip'),
            flipToggleInputEl,
          ]),
          VM.h('div', { className: cssClass('field-group') }, [
            VM.h('label', { labelFor: `${fieldId}-transform-origin-x` }, ['Transform Origin X', transformOriginHelpTooltipEl.cloneNode()]),
            transformOriginXInputEl,
          ]),
          VM.h('div', { className: cssClass('field-group') }, [
            VM.h('label', { labelFor: `${fieldId}-transform-origin-y` }, ['Transform Origin Y', transformOriginHelpTooltipEl.cloneNode()]),
            transformOriginYInputEl,
          ]),
        ]),
      ]);
      overlaySettingsContainerGroupEl.appendChild(overlaySettingEl);

      overlaySettingEl.addEventListener('paste', (event) => {
        const file = event.clipboardData.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      let lastPreviewImageSrc = null;
      let imageLoadFailed = false;
      function updateDom() {
        if (overlaySetting.imageSrc && lastPreviewImageSrc !== overlaySetting.imageSrc) {
          previewImageEl.src = overlaySetting.imageSrc;
          lastPreviewImageSrc = overlaySetting.imageSrc;
        }
        overlaySettingEl.classList.toggle(cssClass('overlay-setting--no-image'), !overlaySetting.imageSrc);
        overlaySettingEl.classList.toggle(cssClass('overlay-setting--image-load-failed'), imageLoadFailed);

        flipToggleInputEl.checked = overlaySetting.flip ?? false;
        overlaySettingEl.classList.toggle(cssClass('overlay-setting--image-flipped'), overlaySetting.flip ?? false);

        transformOriginXInputEl.value = overlaySetting.transformOrigin?.x ?? '';
        transformOriginYInputEl.value = overlaySetting.transformOrigin?.y ?? '';
        if (overlaySetting.transformOrigin) {
          const normalizeTransformOriginValue = (value) => ({
            'center': '50%',
            'top': '0%',
            'left': '0%',
            'right': '100%',
            'bottom': '100%',
          }[value] || value);

          transformOriginCrosshairEl.style.setProperty('--transform-origin-x', normalizeTransformOriginValue(overlaySetting.transformOrigin.x));
          transformOriginCrosshairEl.style.setProperty('--transform-origin-y', normalizeTransformOriginValue(overlaySetting.transformOrigin.y));
        }
        overlaySettingEl.classList.toggle(cssClass('overlay-setting--no-transform-origin'), !overlaySetting.transformOrigin);

        updateOverlays();
      }

      previewImageEl.addEventListener('load', () => {
        imageLoadFailed = false;
        updateDom();
      });
      previewImageEl.addEventListener('error', () => {
        imageLoadFailed = true;
        updateDom();
      });

      updateDom();
    }

    settingsTab.container.append(overlaySettingsContainerGroupEl);
    // #endregion Overlay settings
  }

  function patch(vue) {
    const calculateOverridenHeadingAngle = (baseHeading) =>
      (baseHeading + state.settings.lookingDirection * 90) % 360;

    function replaceParametersInPanoUrl(urlStr, vanillaHeadingOverride = null) {
      if (!urlStr) {
        return urlStr;
      }

      const url = new URL(urlStr);

      if (vanillaHeadingOverride != null || url.searchParams.has('heading')) {
        const currentHeading = vanillaHeadingOverride ?? parseFloat(url.searchParams.get('heading'));
        if (!Number.isNaN(currentHeading)) {
          url.searchParams.set('heading', calculateOverridenHeadingAngle(currentHeading));
        }
      }

      url.searchParams.set('fov', state.settings.fov);

      return url.toString();
    }

    vue.state.getPanoUrl = new Proxy(vue.methods.getPanoUrl, {
      apply(ogGetPanoUrl, thisArg, args) {
        const urlStr = ogGetPanoUrl.apply(thisArg, args);
        return replaceParametersInPanoUrl(urlStr);
      }
    });

    const panoEls = Object.keys(vue.$refs).filter((name) => name.startsWith('pano')).map((key) => vue.$refs[key]);

    let isVanillaTransitioning = false;
    {
      /**
       * For reference, this is what the vanilla code more-or-less does:
       *
       * ```js
       * function changeStop(..., newPano, newHeading, ...) {
       *    // ...
       *    this.currFrame = this.currFrame === 0 ? 1 : 0;
       *    this.currentPano = newPano;
       *    // ...
       *    setTimeout(() => {
       *      this.switchFrameOrder();
       *      this.currentHeading = newHeading;
       *      // ...
       *    }, someDelay));
       * }
       * ```
       *
       * Note the heading is set with a delay, after switchFrameOrder is called.
       */

      vue.state.changeStop = new Proxy(vue.methods.changeStop, {
        apply(ogChangeStop, thisArg, args) {
          isVanillaTransitioning = true;
          return ogChangeStop.apply(thisArg, args);
        }
      });

      function isCurrentFrameFacingTheCorrectDirection() {
        const currPanoSrc = panoEls[vue.state.currFrame]?.src;
        const currPanoUrl = currPanoSrc && new URL(currPanoSrc);
        if (!currPanoUrl) {
          return false;
        }

        const urlHeading = parseFloat(currPanoUrl.searchParams.get('heading'));
        if (isNaN(urlHeading)) {
          return false;
        }

        const correctHeading = calculateOverridenHeadingAngle(state.vue.data.currentHeading);

        return Math.abs(urlHeading - correctHeading) < 1e-3;
      }

      vue.state.switchFrameOrder = new Proxy(vue.methods.switchFrameOrder, {
        apply(ogSwitchFrameOrder, thisArg, args) {
          isVanillaTransitioning = false;

          requestIdleCallback(() => { // run after currentHeading is updated (see reference method implementation above)
            if (!isCurrentFrameFacingTheCorrectDirection()) {
              attemptManualPanoTransition(/* animate: */ true);
            }
          });

          return ogSwitchFrameOrder.apply(thisArg, args);
        }
      });
    }

    let modTransitionTimeout = null;
    function attemptManualPanoTransition(animate = true) {
      const now = Date.now();

      const currFrame = vue.state.currFrame;
      const nextFrame = (currFrame + 1) % panoEls.length;

      const activePanoEl = panoEls[currFrame];
      const attemptManualPanoTransitionEl = panoEls[nextFrame];

      if (!activePanoEl.src) {
        // The vanilla code hasn't set a src on the current pano iframe yet, meaning this ran too soon.
        // We'll let the vanilla code do the transition for us.
        clearTimeout(modTransitionTimeout);
        return;
      }

      const newPanoUrl = replaceParametersInPanoUrl(activePanoEl.src, state.vue.data.currentHeading);

      if (aisvApi?.patched) {
        // AISV completely replaces the vanilla frames. However, it is still triggered by changing
        // the source URL on any of them.
        // AISV is also fast enough to where we don't need to bother with transitions and animations, or
        // changing the order of the frames.
        activePanoEl.src = newPanoUrl;
        return;
      }

      if (isVanillaTransitioning) {
        // The page will do the transition for us
        clearTimeout(modTransitionTimeout);
        return;
      }

      if (animate) {
        if (modTransitionTimeout == null) {
          state.vue.state.currFrame = nextFrame;
          attemptManualPanoTransitionEl.src = newPanoUrl;
        } else {
          clearTimeout(modTransitionTimeout);
          activePanoEl.src = newPanoUrl;
        }

        modTransitionTimeout = setTimeout(() => {
          modTransitionTimeout = null;
          state.vue.methods.switchFrameOrder();
        }, 500);
      } else {
        activePanoEl.src = newPanoUrl;
      }
    };
    state.attemptManualPanoTransition = attemptManualPanoTransition;
  }

  function updateUiFromSettings() {
    document.body.classList.toggle(cssClass('show-vehicle-ui'), state.settings.showVehicleUi);
    document.body.classList.toggle(cssClass('always-show-game-ui'), state.settings.alwaysShowGameUi);

    state.tabFields.fov.updateValueText(`${state.settings.fov}°`);
    state.tabFields.zoom.updateValueText(`${((state.settings.zoom - (calculateZeroethZoom() - MIN_ZOOM)) * 100).toFixed(2)}%`);
    state.tabFields.zoomSpeed.updateValueText((Math.round(state.settings.zoomSpeed * 1000) / 1000).toString());
    state.tabFields.zoomParallaxStrength.updateValueText(`${(Math.floor(state.settings.zoomParallax.offset * 100))}%`);

    for (const field of Object.values(state.tabFields)) {
      field.updateRevertToDefaultButtonVisibility();
    }
  }

  function updateOverlays() {
    const setCssVariable = (element, name, value) => value ? element.style.setProperty(`--${name}`, value) : element.style.removeProperty(`--${name}`);

    function setOverlayCssVariables(overlayName, overlaySetting) {
      const cssVariable = (name) => `${MOD_PREFIX}${overlayName}-overlay-${name}`;

      setCssVariable(
        state.dom.overlayEl, cssVariable('image-src'),
        overlaySetting.imageSrc
          ? `url("${overlaySetting.imageSrc}")`
          : null
      );

      setCssVariable(
        state.dom.overlayEl, cssVariable('transform-origin'),
        overlaySetting.transformOrigin
          ? `${overlaySetting.transformOrigin.x} ${overlaySetting.transformOrigin.y}`
          : null
      );
    }

    setOverlayCssVariables('front', state.settings.frontOverlay);
    setOverlayCssVariables('back', state.settings.backOverlay);
    setOverlayCssVariables('left', state.settings.leftOverlay);
    setOverlayCssVariables('right', state.settings.rightOverlay);


    const lookingDirectionOverlaySettings = {
      [Direction.FRONT]: state.settings.frontOverlay,
      [Direction.RIGHT]: state.settings.rightOverlay,
      [Direction.BACK]: state.settings.backOverlay,
      [Direction.LEFT]: state.settings.leftOverlay,
    }[state.settings.lookingDirection];
    state.dom.overlayEl.classList.toggle(cssClass('overlay--flipped'), lookingDirectionOverlaySettings?.flip ?? false);
  }

  function updateLookAt(animate = true) {
    document.body.dataset.lookOutTheWindowDirection = state.settings.lookingDirection;

    updateOverlays();

    state.attemptManualPanoTransition(animate);
  }

  function updateZoom() {
    for (const panoIframeEl of state.dom.panoIframeEls) {
      const parallaxOffset = state.settings.zoomParallax.offset;
      const parallaxMultiplier = state.settings.zoomParallax.multiplier ?? (1 - state.settings.zoomParallax.offset);
      panoIframeEl.style.scale = (state.settings.zoom * parallaxMultiplier + parallaxOffset /* parallax */).toString();
    }
    state.dom.overlayImageEl.style.scale = state.settings.zoom.toString();

    state.tabFields.zoom.updateInputValue(state.settings.zoom);
  }

  async function saveSettings() {
    await GM.setValues(state.settings);
  }

  state.vue = await IRF.vdom.container;

  patch(state.vue);
  setupDom();
  saveSettings();

  if (typeof unsafeWindow !== undefined) {
    unsafeWindow.LOtWv1 = {
      attemptManualPanoTransition: () => state.attemptManualPanoTransition(),

      async setZoom(value) {
        state.settings.zoom = value;
        updateZoom();

        await saveSettings();
      },
      async setZoomSpeed(value) {
        state.settings.zoomSpeed = value;
        updateUiFromSettings();

        await saveSettings();
      },
      async setFov(value) {
        state.settings.fov = value;
        updateUiFromSettings();

        await saveSettings();
      },
      async setLookingDirection(value) {
        state.settings.lookingDirection = value;
        updateLookAt();

        await saveSettings();
      }
    };
  }
})();