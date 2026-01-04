// ==UserScript==
// @name         Internet Roadtrip - Combined Votes Counts UI
// @description  Moves the vote counts in neal.fun/internet-roadtrip from the top right panel to be alongside the arrows, on the wheel, and in the radio
// @namespace    me.netux.site/user-scripts/internet-roadtrip/combined-votes-counts-ui
// @version      1.7.2
// @author       netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/*
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Combined%20Vote%20Counts%20UI%20logo.png
// @run-at       document-start
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536347/Internet%20Roadtrip%20-%20Combined%20Votes%20Counts%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/536347/Internet%20Roadtrip%20-%20Combined%20Votes%20Counts%20UI.meta.js
// ==/UserScript==

/* globals IRF */

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');
  const CSS_PREFIX = `cvcui-`;
  const cssClass = (names) => (Array.isArray(names) ? names : [names]).map((name) => `${CSS_PREFIX}${name}`).join(' ');
  const cssProp = (name) => `--${CSS_PREFIX}${name}`;

  await IRF.dom.container;

  GM_addStyle(`
  .container {
    & .results {
      top: 50px;
      right: 10px;
      width: fit-content;
      min-width: 200px;
      padding: 7px 10px;

      &::after {
        /* annoying... */
        pointer-events: none;
      }

      & .results-content {
        padding-bottom: 6px;
        display: none;
      }

      & .${cssClass('results-content-toggle-button')} {
        width: 100%;
        height: 0.6rem;
        margin-block: 0.3rem 0.1rem;
        background-image: url("https://www.svgrepo.com/show/257732/up-arrow.svg");
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        cursor: pointer;
        display: block;
      }

      &.${cssClass('results-content-open')} {
        & .${cssClass('results-content-toggle-button')} {
          rotate: 180deg;
        }

        & .results-content {
          display: revert;
        }
      }
    }

    .${cssClass('vote-count')} {
      position: absolute;
      font-family: "Roboto", sans-serif;
      color: white;
      text-shadow: ${[[0, 1], [0, -1], [1, 0], [-1, 0]].map(([x, y]) => `${x}px ${y}px 2px black`).join(', ')};
      pointer-events: none;
      white-space: nowrap;
    }

    & .options {
      cursor: pointer;

      & .${cssClass('vote-count')} {
        bottom: -0.4em;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 12px;
      }

      &:not(.${cssClass('reduce-arrow-motion')}) :is(
        .option .option-arrow,
        .option .${cssClass('vote-count')}
      ) {
        transition: translate 0.1s linear;
        translate:
          /* x: */ 0
          /* y: */ calc(
            /* simple lerp(min, max, percentage) */
            var(${cssProp('arrow-motion-offset-min')}) +
            (
              var(${cssProp('arrow-motion-offset-max')}) -
              var(${cssProp('arrow-motion-offset-min')})
            ) *
            var(${cssProp('vote-count-percentage')}) *
            -1 /* invert sign so negative offset values correspond to the arrow going down */
          );
      }
    }

    & .wheel-container {
      & .${cssClass('vote-count')} {
        top: 22%;
        left: 50%;
        translate: -50%;
        font-size: 20px;
        user-select: none;
      }
    }
  }

  @media (max-width: 900px) {
    .container {
      & .results {
        top: 41px;
        right: 5px;
      }
    }
  }
  `);

  const resultsEl = await IRF.dom.results;
  const resultsVDOM = await IRF.vdom.results;
  const optionsContainerEl = await IRF.dom.options;
  const wheelContainerEl = await IRF.dom.wheel;
  const radioEl = await IRF.dom.radio;

  const mapSound = await IRF.vdom.map.then((map) => map.data.mapSound); // yoink

  const settings = {
    'results-content-open': false,
    'reduce-arrow-motion': false,
    'arrow-motion-offset-min': -10,
    'arrow-motion-offset-max': 10,
    debug: {
      voteInterpolationTesting: {
        multiplyVotesBy: 1
      }
    }
  };
  for (const key in settings) {
    const value = await GM.getValue(key, settings[key]);
    settings[key] = value;
  }

  async function updateDomFromSettings() {
    optionsContainerEl.classList.toggle(cssClass('reduce-arrow-motion'), settings['reduce-arrow-motion']);
    optionsContainerEl.style.setProperty(cssProp('arrow-motion-offset-min'), `${settings['arrow-motion-offset-min']}px`);
    optionsContainerEl.style.setProperty(cssProp('arrow-motion-offset-max'), `${settings['arrow-motion-offset-max']}px`);
    resultsEl.classList.toggle(cssClass('results-content-open'), settings['results-content-open']);
  }
  updateDomFromSettings();

  async function saveSettings() {
    for (const key in settings) {
      await GM.setValue(key, settings[key]);
    }
  }

  class VoteInterpolator {
    lastValue = 0;
    targetValue = 0;
    lastUpdateTimestamp = Date.now();
    interpolationInterval = null;

    constructor(render) {
      this.render = render;
    }

    setTargetValue(value, renderContext) {
      if (this.targetValue === value) {
        return;
      }

      value *= settings.debug?.voteInterpolationTesting?.multiplyVotesBy ?? 1;

      this.targetValue = value;

      this.stopInterpolation();

      if (this.targetValue > this.lastValue) {
        this.interpolate(renderContext);
      } else {
        this.render(this.targetValue, renderContext);
        this.lastValue = this.targetValue;
      }
    }

    interpolate(renderContext) {
      const now = Date.now();
      const lastUpdateDelta = Math.abs(now - this.lastUpdateTimestamp);

      this.lastUpdateTimestamp = now;

      this.interpolationInterval = setInterval(
        () => {
          if (this.targetValue <= this.lastValue) {
            this.stopInterpolation();
          } else {
            this.lastValue++;
          }

          this.render(this.lastValue, renderContext);
        },
        Math.min(lastUpdateDelta, 250) / (this.targetValue - this.lastValue)
      );
    }

    stopInterpolation() {
      if (this.interpolationInterval) {
        clearInterval(this.interpolationInterval);
        this.interpolationInterval = null;
      }
    }
  }

  const makePercentageStr = (votes, total) => {
    const percentage = total !== 0 ? (votes / total) : 0;
    return `${Math.floor(percentage * 100)}`;
  }

  const wheelHonkVotesEl = document.createElement('span');
  const wheelHonkVoteInterpolator = new VoteInterpolator((votesCount, { totalVotes }) => {
    wheelHonkVotesEl.textContent = `${votesCount} (${makePercentageStr(votesCount, totalVotes)}%)`;
  });
  wheelHonkVoteInterpolator._el = wheelHonkVotesEl;

  const radioSeekVotesTextNode = document.createTextNode('0');
  const radioSeekVoteInterpolator = new VoteInterpolator((votesCount) => {
    radioSeekVotesTextNode.textContent = votesCount;
  });
  radioSeekVoteInterpolator._el = radioSeekVotesTextNode;

  function ensureOptionVoteInterpolator(optionEl) {
    let voteInterpolator = optionEl._voteInterpolator;
    if (!voteInterpolator) {
      const votesEl = document.createElement('span');
      votesEl.className = cssClass('vote-count');
      votesEl.textContent = `0 (0%)`;
      optionEl.appendChild(votesEl);

      voteInterpolator = new VoteInterpolator((votesCount, { totalVotes }) => {
        votesEl.textContent = `${votesCount}  (${makePercentageStr(votesCount, totalVotes)}%)`;
      });
      voteInterpolator._el = votesEl;

      optionEl._voteInterpolator = voteInterpolator;
    }

    return voteInterpolator;
  }

  function updateVotes(votes) {
    const totalVotes = Object.values(votes).reduce((total, count) => total + count, 0);

    const optionEls = optionsContainerEl.querySelectorAll('.option');

    for (const [voteStr, votesCount] of Object.entries(votes)) {
      switch (voteStr) {
        case "-2": {
          wheelHonkVoteInterpolator.setTargetValue(votesCount, { totalVotes });
          break;
        }
        case "-1": {
          radioSeekVoteInterpolator.setTargetValue(votesCount, { totalVotes });
          break;
        }
        default: {
          const voteIndex = parseInt(voteStr, 10);

          const optionEl = optionEls[voteIndex];
          if (!optionEl) {
            continue;
          }

          const voteInterpolator = ensureOptionVoteInterpolator(optionEl);

          voteInterpolator.setTargetValue(votesCount, { totalVotes });

          const percentage = totalVotes !== 0 ? (votesCount / totalVotes) : 0;
          optionEl.style.setProperty(cssProp('vote-count-percentage'), percentage);
        }
      }
    }
  }

  {
    const { set: voteCountsSetter } = Object.getOwnPropertyDescriptor(resultsVDOM.state._props, 'voteCounts');
    Object.defineProperty(resultsVDOM.state._props, 'voteCounts', {
      set(newVoteCounts) {
        updateVotes(newVoteCounts);

        return voteCountsSetter.call(this, newVoteCounts);
      },
      configurable: true,
      enumerable: true,
    });
  }

  {
    const optionsContainerMutationObserver = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type !== 'childList') {
          continue;
        }

        for (const addedOptionEl of record.addedNodes) {
          if (!addedOptionEl.classList?.contains('option')) {
            continue;
          }

          ensureOptionVoteInterpolator(addedOptionEl);
        }
      }
    });
    optionsContainerMutationObserver.observe(optionsContainerEl, {
      childList: true
    });

    const wheelClickArealEl = wheelContainerEl.querySelector('.wheel-click-area');
    wheelHonkVotesEl.className = cssClass('vote-count');
    wheelClickArealEl.appendChild(wheelHonkVotesEl);

    const radioSeekButtonLabelEl = radioEl.querySelector('.control-button .button-label');
    radioSeekButtonLabelEl.append(
      document.createTextNode(' ('),
      radioSeekVotesTextNode,
      document.createTextNode(')'),
    );

    const resultsContentToggleEl = document.createElement('div');
    resultsContentToggleEl.className = cssClass('results-content-toggle-button');
    resultsContentToggleEl.addEventListener('click', async () => {
      mapSound?.play();

      settings['results-content-open'] = !settings['results-content-open'];
      await saveSettings();
      updateDomFromSettings();
    });

    const resultsContentEl = resultsEl.querySelector('.results-content');
    resultsContentEl.insertAdjacentElement('afterend', resultsContentToggleEl);
  }

  {
    const tabContentStyle = `
    .${cssClass('settings-tab-content')} {
      & *, *::before, *::after {
        box-sizing: border-box;
      }

      & h3 {
        margin-block: 0.5rem 1rem;
      }

      & .${cssClass('field-group')} {
        margin-block: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;

        & input:is(:not([type]), [type="text"], [type="number"]) {
          height: 1.5rem;
          margin: 0;
          color: white;
          background: transparent;
          border: 1px solid #848e95;
          text-align: right;
          font-size: 100%;
          border-radius: 5rem;
        }
      }
    }
    `;

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
        tabName: 'Combine Votes Counts UI',
        style: tabContentStyle,
        className: cssClass('settings-tab-content'),
      }
    );

    {
      // FIXME(netux): IRF v0.4.1-beta has a bug where the tab styles may not be injected
      // So we inject them ourselves.
      const styleEl = document.createElement('style');
      styleEl.textContent = tabContentStyle;
      tab.container.append(styleEl);
    }

    function makeHeading(text) {
      const headingEl = document.createElement('h3');
      headingEl.textContent = text;
      return headingEl;
    }

    function makeFieldGroup({ id, label }, renderInput) {
      const fieldGroupEl = document.createElement('div');
      fieldGroupEl.className = cssClass('field-group');

      const labelEl = document.createElement('label');
      labelEl.textContent = label;
      fieldGroupEl.appendChild(labelEl);

      const inputEl = renderInput({ id });
      fieldGroupEl.appendChild(inputEl);

      return fieldGroupEl;
    }

    tab.container.append(
      makeHeading('Arrow Motion'),
      makeFieldGroup({ id: `${CSS_PREFIX}disable-arrow-motion`, label: 'Disable Motion' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = settings['reduce-arrow-motion'];

        inputEl.addEventListener('change', async () => {
          settings['reduce-arrow-motion'] = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}arrow-motion-offset-min`, label: 'Minimum Offset (pixels)' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'number';
        inputEl.value = settings['arrow-motion-offset-min'];

        inputEl.addEventListener('change', async () => {
          settings['arrow-motion-offset-min'] = inputEl.value;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}arrow-motion-offset-max`, label: 'Maximum Offset (pixels)' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'number';
        inputEl.value = settings['arrow-motion-offset-max'];

        inputEl.addEventListener('change', async () => {
          settings['arrow-motion-offset-max'] = inputEl.value;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
    );
  }
})();
