// ==UserScript==
// @name         Internet Roadtrip - Improved Honking
// @description  Adds a "honk" graphic, and lets you change the volume of the honk in neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/internet-roadtrip/improved-honking
// @version      1.1.1
// @author       netux (+nameless.sdk)
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/
// @icon         https://neal.fun/favicons/internet-roadtrip.png
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/542358/Internet%20Roadtrip%20-%20Improved%20Honking.user.js
// @updateURL https://update.greasyfork.org/scripts/542358/Internet%20Roadtrip%20-%20Improved%20Honking.meta.js
// ==/UserScript==

/* globals IRF */

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip -', '').trim();
  const MOD_PREFIX = 'iHONK-';

  const cssClass = (... names) => names.map((name) => `${MOD_PREFIX}${name}`).join(' ');

  const DURATION_MS = 1500;

  GM_addStyle(`
  @keyframes ${cssClass('honked')} {
    0% {
      opacity: 0;
      scale: 0.5;
    }

    10%, 80% {
      opacity: 1;
      scale: 1;
    }

    100% {
      opacity: 0;
      scale: 1.1;
    }
  }

  .container {
    .${cssClass('honked')} {
      position: fixed;
      top: 50%;
      left: 50%;
      translate: -50% -50%;
      pointer-events: none;
      opacity: 0;
      zoom: 0.75;

      &.${cssClass('show')} {
        opacity: 1;
        animation: ${cssClass('honked')} ${DURATION_MS}ms ease-in-out forwards;
      }
    }
  }
  `);

  const containerEl = await IRF.dom.container;
  const containerVDOM = await IRF.vdom.container;
  const wheelVDOM = await IRF.vdom.wheel;
  const { Howl } = await IRF.modules.howler;

  const settings = {
    honkVolume: containerVDOM.state.honkSound.volume(),
    longHonkVolume: containerVDOM.state.honkLongSound.volume(),
    longHonkPlayVisualEffect: true,
    longHonkVisualEffectImageUrl: 'https://cloudy.netux.site/neal_internet_roadtrip/improved-honking/InternetRoadTripHonk%20by%20nameless.sdk.png',
    debug: {
      playLongHonkVisualEffectEveryStop: false,
    }
  };

  // Migration from <1.1.0, renaming of long honk visual effect image URL setting
  {
    const legacyLongHonkVisualEffectImageUrlValue = await GM.getValue('longHonkEffectImageUrl');
    const newLongHonkVisualEffectImageUrlValue = await GM.getValue('longHonkVisualEffectImageUrl')
    if (legacyLongHonkVisualEffectImageUrlValue) {
      await GM.deleteValue('longHonkEffectImageUrl');

      if (newLongHonkVisualEffectImageUrlValue == null) {
        await GM.setValue('longHonkVisualEffectImageUrl', legacyLongHonkVisualEffectImageUrlValue);
      }
    }
  }

  for (const key in settings) {
    settings[key] = await GM.getValue(key, settings[key]);
  }

  async function saveSettings() {
    for (const key in settings) {
      await GM.setValue(key, settings[key]);
    }
  }

  function updateFromSettings() {
    wheelVDOM.data.honkSound.volume(settings.honkVolume);
    containerVDOM.data.honkLongSound.volume(settings.longHonkVolume);
  }
  updateFromSettings();

  const longHonkEffectImageEl = document.createElement('img');
  longHonkEffectImageEl.className = cssClass('honked');
  longHonkEffectImageEl.src = settings.longHonkVisualEffectImageUrl;
  containerEl.append(longHonkEffectImageEl);

  function playEffectVisual() {
    longHonkEffectImageEl.classList.add(cssClass('show'));
    window.setTimeout(() => longHonkEffectImageEl.classList.remove(cssClass('show')), DURATION_MS);
  }

  containerVDOM.state.changeStop = new Proxy(containerVDOM.state.changeStop, {
    apply(ogChangeStop, thisArg, args) {
      if (!thisArg.isChangingStop) {
        const chosen = args[1];

        if (
          (chosen === -2 || settings.debug.playLongHonkVisualEffectEveryStop) &&
          settings.longHonkPlayVisualEffect
        ) {
          playEffectVisual();
        }
      }

      return ogChangeStop.apply(thisArg, args);
    }
  });

  {
    const tab = IRF.ui.panel.createTabFor(
      { ... GM.info, script: { ... GM.info.script, name: MOD_NAME } },
      {
        tabName: MOD_NAME,
        style: `
        .${cssClass('tab-content')} {
          & *, *::before, *::after {
            box-sizing: border-box;
          }

          & .${cssClass('field-group')} {
            margin-block: 1rem;
            gap: 0.25rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & label > small {
              color: lightgray;
              display: block;
            }

            & .${cssClass('field-group__label-container')},
            & .${cssClass('field-group__input-container')} {
              width: 100%;
              display: flex;
              flex-direction: row;
              flex-wrap: nowrap;
              align-items: center;
              gap: 1ch;
            }

            & .${cssClass('field-group__input-container')} {
              justify-content: end;
              white-space: nowrap;
            }
          }

          small {
            color: #aaa;
          }
        }
        `,
        className: cssClass('tab-content')
      }
    );

    function makeFieldGroup({ id, label }, renderInput) {
      const fieldGroupEl = document.createElement('div');
      fieldGroupEl.className = cssClass('field-group');

      const labelContainerEl = document.createElement('div');
      labelContainerEl.className = cssClass('field-group__label-container');
      fieldGroupEl.append(labelContainerEl);

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelContainerEl.append(labelEl);

      const inputContainerEl = document.createElement('div');
      inputContainerEl.className = cssClass('field-group__input-container');
      fieldGroupEl.append(inputContainerEl);

      const renderInputOutput = renderInput({ id });
      inputContainerEl.append(... (Array.isArray(renderInputOutput) ? renderInputOutput : [renderInputOutput]));

      return fieldGroupEl;
    }

    const attributionEl = document.createElement('small');
    attributionEl.textContent = 'Effect visual by @nameless.sdk on Discord';

    tab.container.append(
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}honk-volume`,
          label: 'Honk Volume'
        },
        ({ id }) => {
          const renderValue = () => `${(Math.floor(settings.honkVolume * 100))}%`;

          const valueTextEl = document.createElement('span');
          valueTextEl.style.width = '5ch';
          valueTextEl.textContent = renderValue();

          const inputEl = document.createElement('input');
          inputEl.type = 'range';
          inputEl.className = IRF.ui.panel.styles.slider;
          inputEl.min = 0;
          inputEl.max = 1;
          inputEl.step = 0.05;
          inputEl.value = settings.honkVolume;

          inputEl.addEventListener('input', async () => {
            let numberValue = Number.parseFloat(inputEl.value);
            if (Number.isNaN(numberValue)) {
              return;
            }
            numberValue = Math.min(Math.max(parseFloat(inputEl.min), numberValue), parseFloat(inputEl.max));

            settings.honkVolume = numberValue;
            await saveSettings();
            updateFromSettings();

            valueTextEl.textContent = renderValue();
          });

          return [valueTextEl, inputEl];
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}long-honk-volume`,
          label: 'Long Honk Volume'
        },
        ({ id }) => {
          const renderValue = () => `${(Math.floor(settings.longHonkVolume * 100))}%`;

          const valueTextEl = document.createElement('span');
          valueTextEl.style.width = '5ch';
          valueTextEl.textContent = renderValue();

          const inputEl = document.createElement('input');
          inputEl.type = 'range';
          inputEl.className = IRF.ui.panel.styles.slider;
          inputEl.min = 0;
          inputEl.max = 1;
          inputEl.step = 0.05;
          inputEl.value = settings.longHonkVolume;

          inputEl.addEventListener('input', async () => {
            let numberValue = Number.parseFloat(inputEl.value);
            if (Number.isNaN(numberValue)) {
              return;
            }
            numberValue = Math.min(Math.max(parseFloat(inputEl.min), numberValue), parseFloat(inputEl.max));

            settings.longHonkVolume = numberValue;
            await saveSettings();
            updateFromSettings();

            valueTextEl.textContent = renderValue();
          });

          return [valueTextEl, inputEl];
        }
      ),
      makeFieldGroup(
        {
          id: `${MOD_PREFIX}long-honk-play-visual-effect`,
          label: 'Play Long Honk Visual Effect'
        },
        ({ id }) => {
          const inputEl = document.createElement('input');
          inputEl.type = 'checkbox';
          inputEl.className = IRF.ui.panel.styles.toggle;
          inputEl.checked = settings.longHonkPlayVisualEffect;

          inputEl.addEventListener('change', async () => {
            settings.longHonkPlayVisualEffect = inputEl.checked;
            await saveSettings();
            updateFromSettings();
          });

          return inputEl;
        }
      ),
      attributionEl
    )
  }

  if (typeof unsafeWindow !== undefined) {
    unsafeWindow.improvedHonking = {
      get isVisualEffectEnabled() {
        return settings.longHonkPlayVisualEffect;
      },
      playEffect: () => {
        playEffectVisual();

        containerVDOM.state.honkLongSound.play();
      }
    };
  }
})();