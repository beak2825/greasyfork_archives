// ==UserScript==
// @name        Internet Roadtrip - Time Travel
// @description See the current neal.fun/internet-roadtrip panorama in another time
// @namespace   me.netux.site/user-scripts/internet-roadtrip/time-travel
// @version     0.3.1
// @author      Netux
// @license     MIT
// @icon        https://neal.fun/favicons/internet-roadtrip.png
// @match       https://neal.fun/internet-roadtrip/*
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @require     https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @downloadURL https://update.greasyfork.org/scripts/547314/Internet%20Roadtrip%20-%20Time%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/547314/Internet%20Roadtrip%20-%20Time%20Travel.meta.js
// ==/UserScript==

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');
  const MOD_DOM_SAFE_PREFIX = 'time-travel';

  const cssClass = (... names) => names.map((name) => `${MOD_DOM_SAFE_PREFIX}-${name}`).join(' ');

  GM.fetch = function(details) {
    return new Promise((resolve, reject) => {
      GM.xmlHttpRequest({
        ...details,
        onload: (response) => resolve(response),
        onerror: (err) => reject(err),
      });
    });
  }

  class HTMLYearMonthInputElement extends HTMLElement {
    #year = 0;
    #month = 1;

    #setYearValue;
    #setMonthValue;

    get value() {
      return [this.#year, this.#month];
    }
    set value(value) {
      const [yearStr, monthStr] = Array.isArray(value)
        ? value.slice(0, 2)
        : String(value).split('-', 2);

      this.year = yearStr;
      this.month = monthStr;
    }

    get year() {
      return this.#year;
    }
    set year(newYear) {
      newYear = Number.parseInt(String(newYear));

      if (Number.isNaN(newYear)) {
        return;
      }

      this.#year = newYear;
      this.#setYearValue?.(newYear);
    }

    get month() {
      return this.#month;
    }
    set month(newMonth) {
      newMonth = Number.parseInt(String(newMonth));

      if (Number.isNaN(newMonth)) {
        return;
      }

      this.#month = newMonth;
      this.#setMonthValue?.(newMonth);
    }

    constructor() {
      super();
    }

    #createDatePartElement({
      defaultValue,
      minValue = 0,
      maxValue,
      onChange = (() => {})
    }) {
      let isFocused = false;
      let value = defaultValue;
      const length = maxValue.toString().length;

      const el = document.createElement('div');
      el.setAttribute('tabindex', '0');
      el.classList.add('part');

      const clampValue = () => {
        value = Math.min(Math.max(minValue, value), maxValue);
      };
      const rerender = () => {
        el.textContent = value.toString().padStart(length, '0');
      };

      let wasJustFocused = false;
      el.addEventListener('focus', (event) => {
        wasJustFocused = true;

        if (navigator.virtualKeyboard) {
          navigator.virtualKeyboard.show();
        }
      });
      el.addEventListener('blur', (event) => {
        wasJustFocused = false;
      });

      el.addEventListener('keydown', (event) => {
        if (!(['ArrowUp', 'ArrowDown'].includes(event.key))) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (event.key === 'ArrowUp') {
          value = (value + 1) % (maxValue + 1);
        } else if (event.key === 'ArrowDown') {
          value = value - 1;
          if (value < minValue) {
            value = (maxValue + 1) + value;
          }
        }
        clampValue();
        rerender();

        onChange(value);
      }, { capture: true });

      el.addEventListener('keypress', (event) => {
        if (!(/^[0-9]$/.test(event.key))) {
          return;
        }

        event.preventDefault();

        const currentValueLength = value.toString().length;
        if (wasJustFocused || currentValueLength === length) {
          value = 0;
          wasJustFocused = false;
        }

        value = (value * 10) + Number.parseInt(event.key, 10);
        clampValue();
        rerender();

        onChange(value);
      });

      el.addEventListener('keydown', (event) => {
        if (event.key !== 'Backspace') {
          return;
        }

        event.preventDefault();

        value = Math.floor(value / 10);
        clampValue();
        rerender();

        onChange(value);
      });

      el.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') {
          return;
        }

        event.preventDefault();

        value = minValue > 0 ? minValue : 0;
        clampValue();
        rerender();

        onChange(value);
      });

      rerender();

      return {
        el,
        setValue: (newValue) => {
          value = newValue;
          clampValue();
          rerender();

          onChange(value);
        }
      };
    }

    connectedCallback() {
      if (this.shadowRoot) {
        return;
      }

      const shadowRoot = this.attachShadow({ mode: 'open' });

      const styleEl = document.createElement('style');
      styleEl.textContent = `
      :host {
        display: inline-block;
        padding: 1px 2px;
        color: fieldtext;
        background-color: field;
        text-transform: none;
        text-shadow: none;
        text-align: start;
        cursor: cursor;
        border: 2px inset light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
      }

      .separator {
        pointer-events: none;
      }

      .part {
        display: inline-block;
        user-select: none;

        &:is(:focus, :focus-visible) {
          outline: none;
          background-color: var(--selected-background-color, highlight);
          color: var(--selected-text-color, highlighttext);
        }
      }
      `;

      const { el: yearEl, setValue: setYearValue } = this.#createDatePartElement({
        defaultValue: this.#year,
        minValue: 0,
        maxValue: 9999,
        onChange: (newYear) => {
          this.#year = newYear;
          this.dispatchEvent(new Event('change'));
        }
      });
      this.#setYearValue = setYearValue;
      yearEl.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          event.stopPropagation();

          monthEl.focus();
        }
      });

      const { el: monthEl, setValue: setMonthValue } = this.#createDatePartElement({
        defaultValue: this.#month,
        minValue: 1,
        maxValue: 12,
        onChange: (newMonth) => {
          this.#month = newMonth;
          this.dispatchEvent(new Event('change'));
        }
      });
      this.#setMonthValue = setMonthValue;
      monthEl.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          event.stopPropagation();

          yearEl.focus();
        }
      });

      const separatorEl = document.createElement('span');
      separatorEl.classList.add('separator');
      separatorEl.textContent = '-';

      shadowRoot.append(
        styleEl,
        yearEl,
        separatorEl,
        monthEl
      );
    }
  }
  window.customElements.define(`${MOD_DOM_SAFE_PREFIX}-year-month-input`, HTMLYearMonthInputElement);

  const containerVDOM = await IRF.vdom.container;

  const panoThumbnailSrc = (pano, heading) => `https://streetviewpixels-pa.googleapis.com/v1/thumbnail?cb_client=maps_sv.tactile&w=156&h=100&pitch=0&panoid=${pano}&yaw=${heading}`;

  // Doesn't catch all, but it does catch most.
  const isPanoDefinitelyUgc = (pano) => pano.startsWith('CAoS');

  async function fetchAlternativePanoDates(pano) {
    const responseJson = await GM.fetch({
      url: `https://www.google.com/maps/photometa/v1?authuser=0&hl=en&gl=ar&pb=!1m4!1smaps_sv.tactile!11m2!2m1!1b1!2m2!1sen!2sar!3m3!1m2!1e2!2s${pano}!4m61!1e1!1e2!1e3!1e4!1e5!1e6!1e8!1e12!1e17!2m1!1e1!4m1!1i48!5m1!1e1!5m1!1e2!6m1!1e1!6m1!1e2!9m36!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e3!2b1!3e2!1m3!1e3!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e1!2b0!3e3!1m3!1e4!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e3!11m2!3m1!4b1`,
      headers: {
        'content-type': 'application/json',
      },
    }).then((res) => JSON.parse(res.response.substring(`)]}'\n`.length)));

    const thisPanoDate = {
      pano,
      date: (() => {
        const [year, month] = responseJson?.[1]?.[0]?.[6]?.[7] ?? [];
        return { year, month };
      })()
    };

    const otherPanoDates = responseJson?.[1]?.[0]?.[5]?.[0]?.[8]?.map((panoDate) => {
      const [index, [year, month] = []] = panoDate;
      const panoRef = responseJson[1][0][5][0][3][0][index];
      const [_unk, pano] = panoRef[0];
      return {
        pano,
        date: { year, month }
      };
    }) ?? [];

    const panoDates = [
      thisPanoDate,
      ... otherPanoDates
    ];

    // Sort newest first
    panoDates.sort(({ date: dateA }, { date: dateB }) => {
      if (!dateA) {
        return -1;
      } else if (!dateB) {
        return 1;
      }

      let rank = dateB.year - dateA.year;
      if (rank !== 0) {
        return rank;
      }

      rank = dateB.month - dateA.month;
      return rank;
    });

    return panoDates;
  }

  const settings = new Proxy({
    year: 9999,
    month: 12
  }, {
    get(target, propertyName, _receiver) {
      return GM_getValue(propertyName, target[propertyName]);
    },
    set(_target, propertyName, value, _receiver) {
      GM_setValue(propertyName, value);
      return value;
    }
  });

  GM_addStyle(`
  .place {
    .road {
      width: fit-content;
      margin-inline: auto;
      display: block;
    }

    .${cssClass('pano-year')} {
      background-color: pink;
    }
  }
  `);

  let panoYearEl;
  function setPanoYearText(text) {
    if (!panoYearEl) {
      containerVDOM.state.el$;
      const roadEl = document.querySelector('.place .road');
      panoYearEl = roadEl.cloneNode();
      panoYearEl.classList.add(cssClass('pano-year'));
      roadEl.parentElement.appendChild(panoYearEl);
    }

    if (text == null) {
      panoYearEl.style.display = 'none';
    } else {
      panoYearEl.textContent = text;
      panoYearEl.style.display = '';
    }
  }

  let yearMonthInputEl;
  let alternativeDatesContainerEl;
  function clearAlternativeDatesInIrfTab() {
    while (alternativeDatesContainerEl.firstChild) {
      alternativeDatesContainerEl.firstChild.remove();
    }
  }
  function renderAlternativeDatesInIrfTab(panoDates, chosenPano) {
    clearAlternativeDatesInIrfTab();

    for (const { pano, date } of panoDates) {
      const thumbnailEl = document.createElement('img');
      thumbnailEl.classList.add(cssClass('alternative-date__thumbnail'));
      thumbnailEl.src = panoThumbnailSrc(pano, containerVDOM.state.currentHeading);

      const infoEl = document.createElement('div');
      infoEl.classList.add(cssClass('alternative-date__info'));
      infoEl.textContent = `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}`;

      const alternativeDateEl = document.createElement('div');
      alternativeDateEl.classList.add(cssClass('alternative-date'));
      if (pano === chosenPano) {
        alternativeDateEl.classList.add(cssClass('alternative-date--chosen'));
      }

      alternativeDateEl.addEventListener('click', () => {
        settings.year = date.year;
        settings.month = date.month;
        if (yearMonthInputEl != null) {
          yearMonthInputEl.value = [date.year, date.month];
        }
      });

      alternativeDateEl.append(
        thumbnailEl,
        infoEl
      );

      alternativeDatesContainerEl.append(alternativeDateEl);
    }
  }

  {
    const tab = IRF.ui.panel.createTabFor(
      {
        ... GM.info,
        script: {
          ... GM.info.script,
          name: MOD_NAME,
          icon: null
        }
      },
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

            & input:is(:not([type]), [type="text"], [type="number"]),
            & ${MOD_DOM_SAFE_PREFIX}-year-month-input {
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

          & .${cssClass('alternative-dates-container')} {
            display: grid;
            grid-template-columns: repeat(3, 1fr);

            & .${cssClass('alternative-date')} {
              margin: 0.25rem;
              border: 3px dashed white;
              display: flex;
              flex-direction: column;
              cursor: pointer;

              &.${cssClass('alternative-date--chosen')} {
                border-style: solid;
              }

              & .${cssClass('alternative-date__thumbnail')} {
                aspect-ratio: 156 / 100;
              }

              & .${cssClass('alternative-date__info')} {
                text-align: center;
              }
            }
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

            &:hover {
              background-color: #F5F5F5;
            }

            & > img {
              width: 1rem;
              vertical-align: middle;
              user-select: none;
            }
          }
        }
        `,
        className: cssClass('tab-content')
      }
    );

    function makeFieldGroup({ id, label, labelSubtext = null }, renderInput) {
      const fieldGroupEl = document.createElement('div');
      fieldGroupEl.className = cssClass('field-group');

      const labelContainerEl = document.createElement('div');
      labelContainerEl.className = cssClass('field-group__label-container');
      fieldGroupEl.append(labelContainerEl);

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      labelContainerEl.append(labelEl);

      if (labelSubtext != null) {
        const labelSubtextEl = document.createElement('small');
        labelSubtextEl.textContent = labelSubtext;
        labelEl.append(labelSubtextEl);
      }

      const inputContainerEl = document.createElement('div');
      inputContainerEl.className = cssClass('field-group__input-container');
      fieldGroupEl.append(inputContainerEl);

      const renderInputOutput = renderInput({ id });
      inputContainerEl.append(... (Array.isArray(renderInputOutput) ? renderInputOutput : [renderInputOutput]));

      return {
        fieldGroupEl,
        renderInputOutput
      };
    }

    const {
      fieldGroupEl: dateFieldGroupEl,
      renderInputOutput: [_alwaysLatestButtonEl, _alwaysEarliestButtonEl, dateInputEl]
    } = makeFieldGroup(
      {
        id: `${MOD_DOM_SAFE_PREFIX}date`,
        label: 'Date'
      },
      ({ id }) => {
        const yearMonthInputEl = new HTMLYearMonthInputElement();
        yearMonthInputEl.style.width = 'fit-content';
        yearMonthInputEl.year = settings.year;
        yearMonthInputEl.month = settings.month;

        yearMonthInputEl.addEventListener('change', () => {
          const [year, month] = yearMonthInputEl.value;
          settings.year = year;
          settings.month = month;
        });

        const alwaysLatestButtonEl = document.createElement('button');
        alwaysLatestButtonEl.textContent = 'Always latest';
        alwaysLatestButtonEl.addEventListener('click', () => {
          settings.year = 9999;
          settings.month = 12;
          yearMonthInputEl.value = [settings.year, settings.month];
        });

        const alwaysEarliestButtonEl = document.createElement('button');
        alwaysEarliestButtonEl.textContent = 'Always earliest';
        alwaysEarliestButtonEl.addEventListener('click', () => {
          settings.year = 0;
          settings.month = 1;
          yearMonthInputEl.value = [settings.year, settings.month];
        });

        return [
          alwaysLatestButtonEl,
          alwaysEarliestButtonEl,
          yearMonthInputEl
        ];
      }
    );
    yearMonthInputEl = dateInputEl;

    alternativeDatesContainerEl = document.createElement('div');
    alternativeDatesContainerEl.classList.add(cssClass('alternative-dates-container'));

    tab.container.append(
      document.createTextNode(`The mod will try to find the panorama closest to this date. This will apply after the next panorama change.`),
      dateFieldGroupEl,
      alternativeDatesContainerEl
    );
  }

  let lastStopNum = null;
  containerVDOM.state.changeStop = new Proxy(containerVDOM.state.changeStop, {
    apply(ogChangeStop, thisArg, args) {
      const runOriginal = () => ogChangeStop.apply(thisArg, args);

      // During stop changes, this function runs twice. Once with this flag unset, and another with this flag set.
      // We just care about the first case.
      if (containerVDOM.state.isChangingStop) {
        return runOriginal();
      }

      const stopNum = args[0];
      if (lastStopNum === stopNum) {
        return runOriginal();
      }
      lastStopNum = stopNum;

      const pano = args[2];
      const currentDate = new Date();
      const doAttemptToOverwritePano = !isPanoDefinitelyUgc(pano) && settings.year <= currentDate.getFullYear();

      if (!isPanoDefinitelyUgc(pano)) {
        fetchAlternativePanoDates(pano)
          .then((panoDates) => {
            console.debug(`[${MOD_NAME}] Alternative pano dates:`, panoDates);

            const closestPanoToDesiredDate = panoDates.reduce((closestSoFar, current) => {
              const yearDiff = Math.abs(settings.year - current.date.year);
              const monthDiff = Math.abs(settings.month - current.date.month);

              if (
                !closestSoFar ||
                yearDiff < closestSoFar.yearDiff ||
                (yearDiff === closestSoFar.yearDiff && monthDiff < closestSoFar.monthDiff)
              ) {
                return {
                  panoDate: current,
                  yearDiff,
                  monthDiff
                };
              }

              return closestSoFar;
            }, null)?.panoDate;

            if (doAttemptToOverwritePano) {
              args[2] = closestPanoToDesiredDate.pano;
              runOriginal();
            }

            setPanoYearText(`${closestPanoToDesiredDate.date.year}-${closestPanoToDesiredDate.date.month}`);

            renderAlternativeDatesInIrfTab(panoDates, closestPanoToDesiredDate.pano);
          })
          .catch((error) => {
            console.error(`[${MOD_NAME}] Could not fetch alternative pano dates:`, error);

            if (doAttemptToOverwritePano) {
              runOriginal();
            }

            clearAlternativeDatesInIrfTab();
            setPanoYearText(null);
          });
      } else {
        clearAlternativeDatesInIrfTab();
        setPanoYearText(null);
      }

      if (!doAttemptToOverwritePano) {
        runOriginal();
      }
    }
  });
})();
