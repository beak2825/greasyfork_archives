// ==UserScript==
// @name         Internet Roadtrip - Custom Steering Wheel and co.
// @description  Allows you to customize the steering wheel image, among other images, in neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/custom-steering-wheel
// @match        https://neal.fun/internet-roadtrip/*
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Custom%20Steering%20Wheel%20and%20Co.%20logo.png
// @version      2.13.1
// @author       netux
// @license      MIT
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/536018/Internet%20Roadtrip%20-%20Custom%20Steering%20Wheel%20and%20co.user.js
// @updateURL https://update.greasyfork.org/scripts/536018/Internet%20Roadtrip%20-%20Custom%20Steering%20Wheel%20and%20co.meta.js
// ==/UserScript==

/* globals IRF, VM, Howl */

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');
  const CSS_PREFIX = 'cswaco-';
  const SUPPORTS_ELEMENT_COMPUTED_STYLE_MAP = Element.prototype.computedStyleMap != null;

  const UNIT_TO_CSS_UNIT_MAP = {
    'number': '',
    'percentage': '%'
  };
  const CSS_UNIT_TO_UNIT_MAP = Object.fromEntries(
    Object.entries(UNIT_TO_CSS_UNIT_MAP).map(([key, value]) => [value, key])
  );

  function cssValueFromRawValue(cssValue) {
    const numericValueMatch = cssValue.match(/^(?<value>[-+]?\d*\.?\d+)(?<unit>[^\d]+)$/);
    if (numericValueMatch) {
      return new window.CSSUnitValue(parseFloat(numericValueMatch.groups.value), numericValueMatch.groups.unit);
    } else {
      return new window.CSSKeywordValue(cssValue);
    }
  }

  // polyfills
  window.CSSUnitValue = (() => {
    if (!window.CSSUnitValue) {
      window.CSSUnitValue = class {
        constructor(value, unit) {
          this.value = value;
          this.unit = CSS_UNIT_TO_UNIT_MAP[unit] || unit;
        }

        toString() {
          return `${this.value}${UNIT_TO_CSS_UNIT_MAP[this.unit] || this.unit || ''}`;
        }
      }
    }

    return window.CSSUnitValue;
  })();
  window.CSSKeywordValue = (() => {
    if (!window.CSSKeywordValue) {
      window.CSSKeywordValue = class {
        constructor(value) {
          this.value = value;
        }

        toString() {
          return `${this.value}`;
        }
      }
    }

    return window.CSSKeywordValue;
  })();

  await IRF.vdom.container;

  const cssClass = (nameOrNames) => (Array.isArray(nameOrNames) ? nameOrNames : [nameOrNames]).map((name) => `${CSS_PREFIX}${name}`).join(' ');

  const numberOr = (value, defaultValue) => typeof value === "number" && !isNaN(value) ? value : defaultValue;

  class CustomizingTab {
    constructor(customizing) {
      this.customizing = customizing;

      this.irfTab = IRF.ui.panel.createTabFor(
        {
          ... GM.info,
          script: {
            ... GM.info.script,
            name: MOD_NAME,
            icon: null
          }
        },
        {
          tabName: this.customizing.config.tabName,
          style: CustomizingTab.TAB_CONTENT_STYLESHEET
        }
      );

      this.render();
    }

    async _render() {
      // TODO(netux): re-implement once IRF has hooks for when its panel is open
      //const initialValues = this.initialValues;
      //let formValues = structuredClone(initialValues);

      const formValues = await this.customizing.getFieldValues();

      const copyButtonEl = VM.hm('button', {}, 'Copy all to clipboard');
      copyButtonEl.addEventListener('click', async () => {
        await navigator.clipboard.writeText(JSON.stringify(formValues));

        VM.showToast('Copied to clipboard', {
          theme: 'dark',
          duration: 1500
        });
      });

      const pasteButtonEl = VM.hm('button', {}, 'Paste from clipboard');
      pasteButtonEl.addEventListener('click', async () => {
        let clipboardData = await navigator.clipboard.readText();
        try {
          clipboardData = JSON.parse(clipboardData);
        } catch (error) {
          VM.showToast('Invalid data on clipboard', {
            theme: 'dark',
            duration: 1500
          });
          console.error("Could not parse JSON from clipboard", error);
          return;
        }

        formValues = structuredClone(clipboardData);
        await this.customizing.apply(formValues);
        await this.render(); // rerender

        VM.showToast('Pasted from clipboard', {
          theme: 'dark',
          duration: 1500
        });
      });

      // TODO(netux): re-enable once IRF has hooks for when its panel is open
      /*
      const submitButtonEl = VM.hm('button', {}, 'Apply & Save');
      submitButtonEl.addEventListener('click', async () => {
        await this.customizing.save(formValues);
        await this.customizing.apply(formValues);
        this.irfTab.hide();
      });

      const revertButtonEl = VM.hm('button', {}, 'Undo all changes');
      revertButtonEl.addEventListener('click', async () => {
        Object.assign(formValues, initialValues);
        await this.customizing.apply(formValues);
        this.irfTab.setContent(await this._render());
      });

      const cancelButtonEl = VM.hm('button', {}, 'Revert & Close');
      cancelButtonEl.addEventListener('click', async () => {
        await this.customizing.apply(initialValues);
        this.irfTab.hide();
      });
      */

      const fieldElements = Object.entries(this.customizing.config.fields).map(([fieldId, fieldConfig]) => {
        const getValue = (value) => formValues[fieldConfig.key];
        const setValue = async (value) => {
          formValues[fieldConfig.key] = value;
          this.customizing.save(formValues);
          this.customizing.apply(formValues);
        };

        const render = fieldConfig.render || (({ getValue, setValue, fieldId, fieldConfig }) => {
          const isCheckbox = fieldConfig.renderParams?.attrs?.type === 'checkbox';
          const inputEl = VM.hm('input', { id: fieldId, ... (fieldConfig.renderParams?.attrs ?? {}), [isCheckbox ? 'checked' : 'value']: getValue() });
          const labelEl = VM.hm('label', { for: fieldId, style: !isCheckbox ? 'display: block' : null }, fieldConfig.renderParams?.label);
          const subLabelEl = fieldConfig.renderParams?.subLabel != null && VM.hm('small', { className: cssClass('field-group__sub-label') }, fieldConfig.renderParams.subLabel);

          const getInputValue = (inputEl) => inputEl.type === 'checkbox' ? inputEl.checked : inputEl.value;
          inputEl.addEventListener('change', () => {
            const inputValue = getInputValue(inputEl);
            const value = fieldConfig.renderParams?.parseInputValue?.(inputValue) ?? inputValue;
            setValue(value);
          });

          return VM.hm('div', { className: cssClass('field-group') }, isCheckbox ? [inputEl, labelEl] : [labelEl, subLabelEl || null, inputEl]);
        });

        return render({ getValue, setValue, fieldId, fieldConfig });
      });

      return VM.hm('div', { className: cssClass('customizing-tab-content') }, [
        VM.hm('div', { className: cssClass('button-row') }, [
          copyButtonEl,
          pasteButtonEl
        ]),
        ... fieldElements,
        // TODO(netux): re-implement once IRF has hooks for when its panel is open
        /*
        VM.hm('div', { className: cssClass('button-row') }, [
          submitButtonEl,
          revertButtonEl,
          cancelButtonEl
        ])
        */
      ]);
    }

    async render() {
      while (this.irfTab.container.firstChild) {
        this.irfTab.container.firstChild.remove();
      }

      const newContentEl = await this._render();
      this.irfTab.container.appendChild(newContentEl);
    }
  }
  CustomizingTab.TAB_CONTENT_STYLESHEET = `
  .${cssClass('customizing-tab-content')} {
    min-width: 300px;

    & * {
      box-sizing: border-box;
    }

    & .${cssClass('field-group')} {
      margin-block: 0.5em;

      & input {
        &:not([type="checkbox"]) {
          width: 100%;
        }
        &[type="checkbox"] {
          vertical-align: middle;
        }
      }

      & .${cssClass('field-group__sub-label')} {
        white-space: pre-wrap;
      }
    }

    & .${cssClass('button-row')} {
      margin-block: 0.5em;
      gap: 1em;
      justify-content: space-evenly;
      display: flex;
    }
  }
  `;

  class Customizing {
    constructor(config) {
      this.config = config;
      this.customizingTab = new CustomizingTab(this);
    }

    registerCustomizingTab() {
      this.customizingTab.register();
    }

    async getFieldValues() {
      const defaultValues = Object.fromEntries(
        Object.values(this.config.fields)
          .map(({ key, defaultValue }) => [key, defaultValue])
      );
      const storageValues = await GM.getValue(this.config.storageKey);

      return {
        ... defaultValues,
        ... storageValues
      };
    }

    async save(config) {
      await GM.setValue(this.config.storageKey, config);
    }

    async apply(config) {
      config ||= await GM.getValue(this.config.storageKey);
      this.config.onApply(config);
    }
  }

  async function migrateV1SteeringWheelImage() {
    const LEGACY_STEERING_WHEEL_IMAGE_SRC_STORE_ID = "imageSrc";
    const STEERING_WHEEL_STORE_ID = "steeringWheel";

    const legacyImageSrc = await GM.getValue(LEGACY_STEERING_WHEEL_IMAGE_SRC_STORE_ID, null);
    if (legacyImageSrc) {
      await GM.setValue(STEERING_WHEEL_STORE_ID, {
        imageSrc: legacyImageSrc
      });
      await GM.deleteValue(LEGACY_STEERING_WHEEL_IMAGE_SRC_STORE_ID);
    }
  }
  await migrateV1SteeringWheelImage();


  const FIELD_RENDERERS = {
    urlAndFileUpload({ getValue, setValue, fieldId, fieldConfig }) {
      const isDataUrl = () => getValue()?.startsWith('data:') ?? false;

      const urlInputEl = VM.hm('input', { id: fieldId, style: 'display: block', ... (fieldConfig.renderParams?.urlInputAttrs ?? {}) });
      urlInputEl.addEventListener('change', () => {
        setValue(urlInputEl.value);

        updateDom();
      });

      const errorTextEl = VM.hm('small', { style: 'color: red' });

      const fileInputEl = VM.hm('input', { id: fieldId, type: 'file', style: 'display: block' });
      fileInputEl.addEventListener('change', () => {
        const file = fileInputEl.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      const removeButtonEl = VM.hm('button', { style: 'white-space: nowrap' }, 'Remove');
      removeButtonEl.addEventListener('click', () => {
        if (
          fieldConfig.renderParams?.confirmPrompt &&
          isDataUrl() &&
          !confirm(fieldConfig.renderParams?.confirmPrompt.text)
        ) {
          return;
        }

        setValue('');

        updateDom();
      });

      const downloadButtonEl = VM.hm('button', { style: 'white-space: nowrap' }, 'Download');
      downloadButtonEl.addEventListener('click', async () => {
        const url = getValue();
        if (!url) {
          return;
        }

        const fileBlob = await fetch(url).then((res) => res.blob());
        const fileBlobUrl = URL.createObjectURL(fileBlob);
        window.open(fileBlobUrl, /* target */ "_blank");
        URL.revokeObjectURL(fileBlobUrl);
      });

      const updateDom = () => {
        urlInputEl.value = isDataUrl() ? '(uploaded file)' : getValue();
        urlInputEl.disabled = isDataUrl();

        removeButtonEl.style.display = getValue() ? '' : 'none';
        downloadButtonEl.style.display = getValue() ? '' : 'none';

        if (fieldConfig.renderParams.checkUrl) {
          Promise.resolve().then(() => fieldConfig.renderParams.checkUrl(getValue())).then((error) => {
            errorTextEl.style.display = error ? '' : 'none';
            errorTextEl.textContent = error;
          });
        }
      };
      updateDom();

      function handleFileUpload(file) {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          setValue(event.target.result);

          updateDom();
        };
        fileReader.readAsDataURL(file);
      }

      const dropAreaEl = VM.hm('small', { className: cssClass('drop-area') }, 'or drag and drop the file *here*');

      const containerEl = VM.hm('div', { className: cssClass(['field-group', 'field-group--image-upload']) }, [
        VM.hm('style', {}, `
        .${cssClass('field-group--image-upload')} {
          & > *:not(style) {
            display: block;
          }

          & .${cssClass('header')} {
            display: flex;
            gap: 0.25em;
            align-items: center;

            & .header__label {
              width: 100%;
            }
          }

          & .${cssClass('drop-area')} {
            padding: 0.5em;
            margin-block: 0.5em 0.25em;
            border: 3px dashed grey;
            user-select: none;
            transition: background-color 0.25s linear;

            &.${cssClass('drop-area__dropping')} {
              background-color: #007300;
            }
          }
        }
        `),
        VM.hm('div', { className: cssClass('header') }, [
          VM.hm('label', { for: fieldId, className: cssClass('header__label') }, fieldConfig.renderParams?.label),
          removeButtonEl,
          downloadButtonEl
        ]),
        errorTextEl,
        VM.hm('small', {}, 'URL:'),
        urlInputEl,
        VM.hm('small', {}, 'or upload a file'),
        fileInputEl,
        dropAreaEl
      ]);

      containerEl.addEventListener('paste', (event) => {
        const file = event.clipboardData.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      containerEl.addEventListener('dragover', (event) => {
        event.preventDefault();

        const containsValidData = event.dataTransfer.types.includes("Files");
        event.dataTransfer.dropEffect = containsValidData ? "move" : "none";
        dropAreaEl.classList.toggle(cssClass('drop-area__dropping'), containsValidData);
      });
      containerEl.addEventListener('dragleave', (event) => {
        dropAreaEl.classList.toggle(cssClass('drop-area__dropping'), false);
      });
      containerEl.addEventListener('drop', (event) => {
        event.preventDefault();
        dropAreaEl.classList.toggle(cssClass('drop-area__dropping'), false);

        const file = event.dataTransfer.files[0];
        if (!file) {
          return;
        }

        handleFileUpload(file);
      });

      return containerEl;
    },
    volumeSlider({ getValue, setValue, fieldId, fieldConfig }) {
      const numericInputEl = VM.hm('input', {
        id: fieldId,
        type: 'number',
        className: cssClass('field-group--volume-slider__numeric-input'),
        min: 0,
        max: 100
      });
      const rangeInputEl = VM.hm('input', {
        id: fieldId,
        type: 'range',
        className: cssClass('field-group--volume-slider__range-input'),
        min: 0,
        max: 100,
        step: 1
      });

      function updateDom() {
        const value = Math.floor(getValue() * 100);
        numericInputEl.value = value;
        rangeInputEl.value = value;
      }
      updateDom();

      function handleInputInput(event) {
        const numericValue = parseInt(event.target.value, 10);
        if (isNaN(numericValue)) {
          return;
        }

        setValue(numericValue / 100);
        updateDom();
      }

      numericInputEl.addEventListener('input', handleInputInput);
      rangeInputEl.addEventListener('input', handleInputInput);

      return VM.hm('div', { className: cssClass('field-group field-group--volume-slider') }, [
        VM.hm('style', {}, `
        .${cssClass('field-group--volume-slider')} {
          & .${cssClass('field-group--volume-slider__inputs-container')} {
            display: flex;
          }

          & .${cssClass('field-group--volume-slider__numeric-input')} {
            width: 6ch !important;
          }
        }
        `),
        VM.hm('label', { for: fieldId }, fieldConfig.renderParams?.label),
        VM.hm('div', { className: cssClass('field-group--volume-slider__inputs-container') }, [
          rangeInputEl,
          numericInputEl
        ])
      ]);
    }
  }

  const FIELDS = {
    hide: {
      key: 'hide',
      defaultValue: false,
      renderParams: {
        label: 'Hide',
        attrs: {
          type: 'checkbox'
        }
      }
    },
    interactable: {
      key: 'interactable',
      defaultValue: true,
      renderParams: {
        label: 'Interactable',
        attrs: {
          type: 'checkbox'
        }
      }
    },
    volume: {
      key: 'volume',
      defaultValue: 0.5,
      renderParams: {
        label: 'Volume'
      },
      render: FIELD_RENDERERS.volumeSlider
    },
    imageSrc: {
      key: 'imageSrc',
      defaultValue: '',
      renderParams: {
        label: 'Image',
        confirmPrompt: {
          text: [
            `Are you sure you want to remove this image?`,
            `You may want to make a backup of it for later: press "Cancel"/"No" on this prompt and then "Download" to get a copy of the current image.`
          ].join("\n\n")
        },
        urlInputAttrs: {
          placeholder: '(default)'
        },
        checkUrl: async (url) => {
          const isDiscordCdnUrl = () => {
            if (!url) {
              return false;
            }

            try {
              const urlUrl = new URL(url);
              return urlUrl.hostname === "cdn.discordapp.com";
            } catch (_) {
              return false;
            }
          };

          if (isDiscordCdnUrl(url)) {
            return 'Avoid using Discord CDN URLs as these eventually expire! Instead, try directly uploading the image below.';
          }
        }
      },
      render: FIELD_RENDERERS.urlAndFileUpload
    },
    imageScale: {
      key: 'imageScale',
      defaultValue: 1,
      renderParams: {
        label: 'Image Scale',
        attrs: {
          type: 'number',
          step: 0.1
        },
        parseInputValue: (value) => numberOr(parseFloat(value), 1)
      }
    },
    imageOffsetX: {
      key: 'offsetX',
      defaultValue: 0,
      renderParams: {
        label: 'Image Offset X',
        attrs: {
          type: 'number',
        },
        parseInputValue: (value) => numberOr(parseFloat(value), 1)
      }
    },
    imageOffsetY: {
      key: 'offsetY',
      defaultValue: 0,
      renderParams: {
        label: 'Image Offset Y',
        attrs: {
          type: 'number',
        },
        parseInputValue: (value) => numberOr(parseFloat(value), 1)
      }
    },
    imageZIndex: {
      key: 'imageZIndex',
      defaultValue: null,
      renderParams: {
        label: 'Image Z-Index',
        subLabel: 'Higher values make this render above other things, while lower values make this render behind other things. Leave empty for default.',
        attrs: {
          type: 'number',
          placeholder: '(default)'
        },
        parseInputValue: (value) => numberOr(parseFloat(value), null)
      }
    }
  };

  const debugSettings = Object.assign({
    interactable : false
  }, await GM.getValue("DEBUG", {}));


  /**
   * Things this bad polyfill doesn't consider:
   * - Rule priority (it always assumes the last rule is the better one)
   * - Attribute value checks (it only supports checking the presence of an attribute)
   * - Lots of other CSS features I can't even think of
   *
   * @param {Element[]} elements
   * @returns {Map<Element, { get(propName: string) => CSSUnitValue | CSSKeywordValue }}
   */
  function bulkComputedStyleMapBadPolyfill(elements) {
    if (SUPPORTS_ELEMENT_COMPUTED_STYLE_MAP && !debugSettings.forceComputedStyleMapPolyfill) {
      return new Map(elements.map((element) => [element, element.computedStyleMap()]));
    }

    const isStylesheetCrossOrigin = (styleSheet) => {
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
    };

    function scanRules(styleSheetOrRule, callback) {
      for (const rule of (styleSheetOrRule.rules ?? styleSheetOrRule.cssRules ?? [])) {
        if (rule.cssRules?.length > 0) {
          scanRules(rule.cssRules, callback);
          continue;
        }

        callback(rule);
      }
    }

    const propsAndValuesPerElement = new Map();

    const CSS_SELECTOR_PIECE_PARTS_SPLIT_REGEXP = /(?=[#.\[])/g;

    for (const styleSheet of document.styleSheets) {
      if (isStylesheetCrossOrigin(styleSheet)) {
        continue;
      }

      scanRules(styleSheet, (rule) => {
        if (!(rule instanceof CSSStyleRule)) {
          return;
        }

        // The little CSS engine that could...
        const ruleSelectors = rule.selectorText.split(',').map((rawSelector) => rawSelector.trim());

        const ruleSelectorLastPieces = ruleSelectors
          .map((selector) => selector.split(' ').at(-1) ?? '')
          .filter((selectorLastPiece) => {
            if (selectorLastPiece.includes('::')) {
              // Pseudo-elements, which we don't care about
              return false;
            }

            return true;
          });

        const ruleSelectorLastPieceParts = ruleSelectorLastPieces.map((lastPiece) => lastPiece.split(CSS_SELECTOR_PIECE_PARTS_SPLIT_REGEXP));

        const doesRuleSeemToMatchElement = (element) => ruleSelectorLastPieceParts.some((splitPiecePart) => splitPiecePart.every((piecePart) => {
          switch (piecePart[0]) {
            case '#': {
              return element.id === piecePart.slice(1);
            }
            case '.': {
              return element.classList.contains(piecePart.slice(1));
            }
            case '[': {
              return element.hasAttribute(piecePart.slice(1, -1));
            }
            default: {
              return element.tagName.toLowerCase() === piecePart.toLowerCase();
            }
          }
        }));


        for (const element of elements) {
          if (!doesRuleSeemToMatchElement(element)) {
            continue;
          }

          const styleMapEntries = {};
          for (const propName of rule.style) {
            const rawValue = rule.style[propName];
            if (rawValue == null) {
              continue;
            }

            styleMapEntries[propName] = cssValueFromRawValue(rawValue);
          }

          let propsAndValuesForThisElement = propsAndValuesPerElement.get(element) ?? {};
          propsAndValuesForThisElement = {
            ... propsAndValuesForThisElement,
            ... styleMapEntries
          };

          propsAndValuesPerElement.set(element, propsAndValuesForThisElement);
        }
      });
    }

    return new Map(
      Array.from(propsAndValuesPerElement.entries()).map(([element, propsAndValues]) => [
        element,
        {
          _propsAndValues: propsAndValues,
          get(propName) {
            const values = propsAndValues[propName];
            if (Array.isArray(values) && values.length === 1) {
              return values[0];
            }

            // ¯\_(ツ)_/¯ I don't know how this API works, and I don't feel like checking
            return values;
          }
        }
      ])
    );
  }

  const computedStyleMapBadPolyfill = (element) => bulkComputedStyleMapBadPolyfill([element]).get(element);

  function getStyleMapFirstProp(styleMap, propsToCheck) {
    for (const propName of propsToCheck) {
      const propValue = styleMap.get(propName);
      if (propValue && propValue.value !== 'auto') {
        return { name: propName, value: propValue };
      }
    }
  }

  const wheelContainerEl = await IRF.dom.wheel;
  const wheelImageEl = wheelContainerEl.querySelector('img.wheel');

  const hangablesContainerEl = await IRF.dom.freshener;

  const freshenerImageEl = hangablesContainerEl.querySelector('img.freshener-img');
  const freshenerImageParentEl = freshenerImageEl.parentElement;

  const leftDiceImageEl = hangablesContainerEl.querySelector('.dice.left-dice img.dice-face');
  const leftDiceImageParentEl = leftDiceImageEl.parentElement;

  const rightDiceImageEl = hangablesContainerEl.querySelector('.dice.right-dice img.dice-face');
  const rightDiceImageParentEl = rightDiceImageEl.parentElement;

  const radioContainerEl = await IRF.dom.radio;
  const coffeeCupImageEl = radioContainerEl.querySelector('img.coffee');
  const odometerContainerEl = await IRF.dom.odometer;

  const initialComputedStyleMapResults = bulkComputedStyleMapBadPolyfill([
    wheelContainerEl, wheelImageEl,
    freshenerImageEl, freshenerImageParentEl,
    leftDiceImageEl, leftDiceImageParentEl,
    rightDiceImageEl, rightDiceImageParentEl,
    radioContainerEl, coffeeCupImageEl,
    odometerContainerEl,
  ]);

  Promise.all([]).then(() => {
    const containerEl = wheelContainerEl;
    const imageEl = wheelImageEl;

    const defaultImageSrc = imageEl.src;

    const initialContainerStyle = initialComputedStyleMapResults.get(containerEl);
    const initialContainerStyleTopOrBottom = getStyleMapFirstProp(initialContainerStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialContainerStyleLeftOrRight = getStyleMapFirstProp(initialContainerStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const initialImageStyle = initialComputedStyleMapResults.get(imageEl);
    const initialImageStyleTopOrBottom = getStyleMapFirstProp(initialImageStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialImageStyleLeftOrRight = getStyleMapFirstProp(initialImageStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const steeringWheelCustomizing = new Customizing({
      storageKey: 'steeringWheel',
      tabName: 'Custom Steering Wheel',
      fields: {
        'steering-wheel-hide': {
          ... FIELDS.hide,
          renderParams: {
            ... FIELDS.hide.renderParams,
            label: 'Hide Image',
          }
        },
        'steering-wheel-image': FIELDS.imageSrc,
        'steering-wheel-container-scale': {
          ... FIELDS.imageScale,
          key: 'containerScale',
          renderParams: {
            ... FIELDS.imageScale.renderParams,
            label: 'Container Scale',
          }
        },
        'steering-wheel-container-offset-x': {
          ... FIELDS.imageOffsetX,
          key: 'containerOffsetX',
          renderParams: {
            ... FIELDS.imageOffsetX.renderParams,
            label: 'Container Offset X',
          }
        },
        'steering-wheel-container-offset-y': {
          ... FIELDS.imageOffsetY,
          key: 'containerOffsetY',
          renderParams: {
            ... FIELDS.imageOffsetY.renderParams,
            label: 'Container Offset Y',
          }
        },
        'steering-wheel-image-scale': FIELDS.imageScale,
        'steering-wheel-offset-x': FIELDS.imageOffsetX,
        'steering-wheel-offset-y': FIELDS.imageOffsetY
      },
      onApply(config) {
        const {
          hide = false,
          imageSrc = null,
          containerScale = 1,
          containerOffsetX = 0,
          containerOffsetY = 0,
          imageScale = 1,
          offsetX = 0,
          offsetY = 0
        } = config || {};
        imageEl.style.display = hide ? 'none' : '';
        imageEl.src = imageSrc || defaultImageSrc;

        imageEl.style.scale = imageScale;
        imageEl.style[initialImageStyleLeftOrRight.name] = `calc(${initialImageStyleLeftOrRight.value.toString()} + ${(initialImageStyleLeftOrRight.name === 'left' ? 1 : -1) * offsetX}px)`;
        imageEl.style[initialImageStyleTopOrBottom.name] = `calc(${initialImageStyleTopOrBottom.value.toString()} + ${(initialImageStyleTopOrBottom.name === 'top' ? 1 : -1) * offsetY}px)`;

        containerEl.style.scale = containerScale;
        containerEl.style[initialContainerStyleLeftOrRight.name] = `calc(${initialContainerStyleLeftOrRight.value.toString()} + ${(initialContainerStyleLeftOrRight.name === 'left' ? 1 : -1) * containerOffsetX}px)`;
        containerEl.style[initialContainerStyleTopOrBottom.name] = `calc(${initialContainerStyleTopOrBottom.value.toString()} + ${(initialContainerStyleTopOrBottom.name === 'top' ? 1 : -1) * containerOffsetY}px)`;
      }
    });
    steeringWheelCustomizing.apply();
  });

  Promise.all([]).then(() => {
    const containerEl = hangablesContainerEl;

    const defaultFreshenerImageSrc = freshenerImageEl.src;
    const initialFreshenerImageParentStyle = initialComputedStyleMapResults.get(freshenerImageParentEl);
    const initialFreshenerImageParentStyleTopOrBottom = getStyleMapFirstProp(initialFreshenerImageParentStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialFreshenerImageParentStyleLeftOrRight = getStyleMapFirstProp(initialFreshenerImageParentStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const defaultLeftDiceImageSrc = leftDiceImageEl.src;
    const initialLeftDiceImageParentStyle = initialComputedStyleMapResults.get(leftDiceImageParentEl);
    const initialLeftDiceImageParentStyleTopOrBottom = getStyleMapFirstProp(initialLeftDiceImageParentStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialLeftDiceImageParentStyleLeftOrRight = getStyleMapFirstProp(initialLeftDiceImageParentStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const defaultRightDiceImageSrc = rightDiceImageEl.src;
    const initialRightDiceImageParentStyle = initialComputedStyleMapResults.get(rightDiceImageParentEl);
    const initialRightDiceImageParentStyleTopOrBottom = getStyleMapFirstProp(initialRightDiceImageParentStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialRightDiceImageParentStyleLeftOrRight = getStyleMapFirstProp(initialRightDiceImageParentStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const hangablesCustomizing = new Customizing({
      storageKey: 'airFreshener',
      tabName: 'Custom Hangables',
      fields: {
        'hangables-hide': FIELDS.hide,

        'air-freshener-interactable': {
          ... FIELDS.interactable,
          renderParams: {
            ... FIELDS.interactable.renderParams,
            label: `Air Freshener ${FIELDS.interactable.renderParams.label}`
          }
        },
        'air-freshener-image': {
          ... FIELDS.imageSrc,
          renderParams: {
            ... FIELDS.imageSrc.renderParams,
            label: `Air Freshener ${FIELDS.imageSrc.renderParams.label}`
          }
        },
        'air-freshener-image-scale': {
          ... FIELDS.imageScale,
          renderParams: {
            ... FIELDS.imageScale.renderParams,
            label: `Air Freshener ${FIELDS.imageScale.renderParams.label}`
          }
        },
        'air-freshener-offset-x': {
          ... FIELDS.imageOffsetX,
          renderParams: {
            ... FIELDS.imageOffsetX.renderParams,
            label: `Air Freshener ${FIELDS.imageOffsetX.renderParams.label}`
          }
        },
        'air-freshener-offset-y': {
          ... FIELDS.imageOffsetY,
          renderParams: {
            ... FIELDS.imageOffsetY.renderParams,
            label: `Air Freshener ${FIELDS.imageOffsetY.renderParams.label}`
          }
        },

        'left-dice-interactable': {
          ... FIELDS.interactable,
          key: 'leftDiceInteractable',
          renderParams: {
            ... FIELDS.interactable.renderParams,
            label: `Left Dice ${FIELDS.interactable.renderParams.label}`
          }
        },
        'left-dice-image': {
          ... FIELDS.imageSrc,
          key: 'leftDiceImageSrc',
          renderParams: {
            ... FIELDS.imageSrc.renderParams,
            label: `Left Dice ${FIELDS.imageSrc.renderParams.label}`
          }
        },
        'left-dice-image-scale': {
          ... FIELDS.imageScale,
          key: 'leftDiceImageScale',
          renderParams: {
            ... FIELDS.imageScale.renderParams,
            label: `Left Dice ${FIELDS.imageScale.renderParams.label}`
          }
        },
        'left-dice-offset-x': {
          ... FIELDS.imageOffsetX,
          key: 'leftDiceOffsetX',
          renderParams: {
            ... FIELDS.imageOffsetX.renderParams,
            label: `Left Dice ${FIELDS.imageOffsetX.renderParams.label}`
          }
        },
        'left-dice-offset-y': {
          ... FIELDS.imageOffsetY,
          key: 'leftDiceOffsetY',
          renderParams: {
            ... FIELDS.imageOffsetY.renderParams,
            label: `Left Dice ${FIELDS.imageOffsetY.renderParams.label}`
          }
        },

        'right-dice-interactable': {
          ... FIELDS.interactable,
          key: 'rightDiceInteractable',
          renderParams: {
            ... FIELDS.interactable.renderParams,
            label: `Right Dice ${FIELDS.interactable.renderParams.label}`
          }
        },
        'right-dice-image': {
          ... FIELDS.imageSrc,
          key: 'rightDiceImageSrc',
          renderParams: {
            ... FIELDS.imageSrc.renderParams,
            label: `Right Dice ${FIELDS.imageSrc.renderParams.label}`
          }
        },
        'right-dice-image-scale': {
          ... FIELDS.imageScale,
          key: 'rightDiceImageScale',
          renderParams: {
            ... FIELDS.imageScale.renderParams,
            label: `Right Dice ${FIELDS.imageScale.renderParams.label}`
          }
        },
        'right-dice-offset-x': {
          ... FIELDS.imageOffsetX,
          key: 'rightDiceOffsetX',
          renderParams: {
            ... FIELDS.imageOffsetX.renderParams,
            label: `Right Dice ${FIELDS.imageOffsetX.renderParams.label}`
          }
        },
        'right-dice-offset-y': {
          ... FIELDS.imageOffsetY,
          key: 'rightDiceOffsetY',
          renderParams: {
            ... FIELDS.imageOffsetY.renderParams,
            label: `Right Dice ${FIELDS.imageOffsetY.renderParams.label}`
          }
        },
      },
      onApply(config) {
        const {
          hide = false,

          interactable = true,
          imageSrc = null,
          imageScale = 1,
          offsetX = 0,
          offsetY = 0,

          leftDiceInteractable = false,
          leftDiceImageSrc = null,
          leftDiceImageScale = 1,
          leftDiceOffsetX = 0,
          leftDiceOffsetY = 0,

          rightDiceInteractable = false,
          rightDiceImageSrc = null,
          rightDiceImageScale = 1,
          rightDiceOffsetX = 0,
          rightDiceOffsetY = 0,
        } = config || {};
        containerEl.style.display = hide ? 'none' : '';

        freshenerImageParentEl.style.pointerEvents = interactable ? '' : 'none';
        freshenerImageEl.src = imageSrc || defaultFreshenerImageSrc;
        freshenerImageParentEl.style.scale = imageScale;
        freshenerImageParentEl.style[initialFreshenerImageParentStyleLeftOrRight.name] = `calc(${initialFreshenerImageParentStyleLeftOrRight.value.toString()} + ${offsetX}px)`;
        freshenerImageParentEl.style[initialFreshenerImageParentStyleTopOrBottom.name] = `calc(${initialFreshenerImageParentStyleTopOrBottom.value.toString()} + ${offsetY}px)`;

        leftDiceImageParentEl.style.pointerEvents = leftDiceInteractable ? '' : 'none';
        leftDiceImageEl.src = leftDiceImageSrc || defaultLeftDiceImageSrc;
        leftDiceImageParentEl.style.scale = leftDiceImageScale;
        leftDiceImageParentEl.style[initialLeftDiceImageParentStyleLeftOrRight.name] = `calc(${initialLeftDiceImageParentStyleLeftOrRight.value.toString()} + ${leftDiceOffsetX}px)`;
        leftDiceImageParentEl.style[initialLeftDiceImageParentStyleTopOrBottom.name] = `calc(${initialLeftDiceImageParentStyleTopOrBottom.value.toString()} + ${leftDiceOffsetY}px)`;

        rightDiceImageParentEl.style.pointerEvents = rightDiceInteractable ? '' : 'none';
        rightDiceImageEl.src = rightDiceImageSrc || defaultRightDiceImageSrc;
        rightDiceImageParentEl.style.scale = rightDiceImageScale;
        rightDiceImageParentEl.style[initialRightDiceImageParentStyleLeftOrRight.name] = `calc(${initialRightDiceImageParentStyleLeftOrRight.value.toString()} + ${rightDiceOffsetX}px)`;
        rightDiceImageParentEl.style[initialRightDiceImageParentStyleTopOrBottom.name] = `calc(${initialRightDiceImageParentStyleTopOrBottom.value.toString()} + ${rightDiceOffsetY}px)`;
      }
    });
    hangablesCustomizing.apply();
  });

  Promise.all([IRF.vdom.radio]).then(([radioVDOM]) => {
    const defaultCoffeeCupOnHoverSound = radioVDOM.state.coffeeSound;
    const defaultCoffeeCupOnHoverSoundVolume = defaultCoffeeCupOnHoverSound.volume();

    const imageEl = coffeeCupImageEl;

    const defaultImageSrc = imageEl.src;

    const initialImageStyle = initialComputedStyleMapResults.get(imageEl);
    const initialImageStyleTopOrBottom = getStyleMapFirstProp(initialImageStyle, ['top', 'bottom']) ?? { name: 'top', value: new window.CSSUnitValue(0, 'px') };
    const initialImageStyleLeftOrRight = getStyleMapFirstProp(initialImageStyle, ['left', 'right']) ?? { name: 'left', value: new window.CSSUnitValue(0, 'px') };

    const initialRadioContainerStyle = initialComputedStyleMapResults.get(radioContainerEl);
    const initialRadioContainerZIndex = initialRadioContainerStyle.get('z-index');

    const initialOdometerContainerStyle = initialComputedStyleMapResults.get(odometerContainerEl);
    const initialOdometerContainerZIndex = initialOdometerContainerStyle.get('z-index');

    let lastCoffeeCupOnHoverSoundSrc = null;

    const coffeeCupCustomizing = new Customizing({
      storageKey: 'coffeeCup',
      tabName: 'Custom Coffee Cup',
      fields: {
        'coffee-cup-hide': FIELDS.hide,
        'coffee-cup-interactable': FIELDS.interactable,
        'coffee-cup-on-hover-sound': {
          key: 'hoverSoundSrc',
          defaultValue: '',
          renderParams: {
            label: 'Sound',
            confirmPrompt: {
              text: [
                `Are you sure you want to remove this sound?`,
                `You may want to make a backup of it for later: press "Cancel"/"No" on this prompt and then "Download" to get a copy of the current sound effect.`
              ].join("\n\n")
            },
            urlInputAttrs: {
              placeholder: '(default)'
            },
            checkUrl: async (url) => {
              const isDiscordCdnUrl = () => {
                if (!url) {
                  return false;
                }

                try {
                  const urlUrl = new URL(url);
                  return urlUrl.hostname === "cdn.discordapp.com";
                } catch (_) {
                  return false;
                }
              };

              if (isDiscordCdnUrl(url)) {
                return 'Avoid using Discord CDN URLs as these eventually expire! Instead, try directly uploading the sound below.';
              }
            }
          },
          render: FIELD_RENDERERS.urlAndFileUpload
        },
        'coffee-cup-on-hover-sound-volume': {
          ... FIELDS.volume,
          key: 'hoverSoundVolume',
          defaultValue: defaultCoffeeCupOnHoverSoundVolume,
          renderParams: {
            ... FIELDS.volume.renderParams,
            label: 'Sound Volume'
          }
        },
        'coffee-cup-image': FIELDS.imageSrc,
        'coffee-cup-image-scale': FIELDS.imageScale,
        'coffee-cup-offset-x': FIELDS.imageOffsetX,
        'coffee-cup-offset-y': FIELDS.imageOffsetY,
        'coffee-cup-image-z-index': FIELDS.imageZIndex,
        'odometer-z-index': {
          ... FIELDS.imageZIndex,
          key: 'odometerZIndex',
          renderParams: {
            ... FIELDS.imageZIndex.renderParams,
            label: 'Odometer Z-Index',
            subLabel: [
              'Same as image z-index, but for the odometer. Play around with lower values to make the odometer go behind the coffee cup.',
              initialRadioContainerZIndex && `Radio z-index: ${initialRadioContainerZIndex?.value}`,
              initialOdometerContainerZIndex && `Odometer default z-index: ${initialOdometerContainerZIndex?.value}`
            ].filter((str) => !!str).join('\n'),
          }
        }
      },
      onApply(config) {
        const {
          hide = false,
          interactable = true,
          hoverSoundSrc = null,
          hoverSoundVolume = defaultCoffeeCupOnHoverSoundVolume,
          imageSrc = null,
          imageScale = 1,
          imageZIndex = null,
          offsetX = 0,
          offsetY = 0,
          odometerZIndex = null
        } = config || {};
        imageEl.style.display = hide ? 'none' : '';
        imageEl.style.pointerEvents = interactable ? '' : 'none';

        if (lastCoffeeCupOnHoverSoundSrc !== hoverSoundSrc) {
          radioVDOM.state.coffeeSound = hoverSoundSrc
            ? new Howl({
              src: [hoverSoundSrc],
              volume: defaultCoffeeCupOnHoverSound.volume()
            })
            : defaultCoffeeCupOnHoverSound;
          lastCoffeeCupOnHoverSoundSrc = hoverSoundSrc;
        }
        radioVDOM.state.coffeeSound.volume(hoverSoundVolume);

        imageEl.src = imageSrc || defaultImageSrc;

        imageEl.style.zIndex = imageZIndex || '';

        imageEl.style.zoom = imageScale;
        imageEl.style[initialImageStyleLeftOrRight.name] = `calc(${initialImageStyleLeftOrRight.value.toString()} + ${(initialImageStyleLeftOrRight.name === 'left' ? 1 : -1) * offsetX}px)`;
        imageEl.style[initialImageStyleTopOrBottom.name] = `calc(${initialImageStyleTopOrBottom.value.toString()} + ${(initialImageStyleTopOrBottom.name === 'top' ? 1 : -1) * offsetY}px)`;

        odometerContainerEl.style.zIndex = odometerZIndex || '';
      }
    });
    coffeeCupCustomizing.apply();
  });
})();
