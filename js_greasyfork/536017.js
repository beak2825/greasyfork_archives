// ==UserScript==
// @name         Internet Roadtrip - Vote History
// @description  Show the result of the last votes in neal.fun/internet-roadtrip
// @namespace    me.netux.site/user-scripts/internet-roadtrip/vote-history
// @version      2.3.3
// @author       Netux
// @license      MIT
// @match        https://neal.fun/internet-roadtrip/*
// @icon         https://cloudy.netux.site/neal_internet_roadtrip/Vote%20History%20logo.png
// @grant        GM_addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/internet-roadtrip-framework@0.4.1-beta
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536017/Internet%20Roadtrip%20-%20Vote%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/536017/Internet%20Roadtrip%20-%20Vote%20History.meta.js
// ==/UserScript==

(async () => {
  const MOD_NAME = GM.info.script.name.replace('Internet Roadtrip - ', '');
  const CSS_PREFIX = 'vh-';
  const cssClass = (... names) => names.map((name) => `${CSS_PREFIX}${name}`).join(' ');
  const cssProp = (name) => `--${CSS_PREFIX}${name}`;

  const state = {
    dom: {},
    settings: {
      increasedVisibility: false,
      maxEntries: 8,
      showAllVoteCounts: false,
      fillInPreviousVotes: false,
      showChosenVotePercentage: true,
      containerBackgroundOpacity: 0,
      compactEntries: false,
      debug: {
        honkers: false
      }
    }
  };

  for (const [key, defaultValue] of Object.entries(state.settings)) {
    state.settings[key] = await GM.getValue(key, defaultValue);
  }

  function injectStylesheets() {
    GM_addStyle(`
    .${cssClass('vote-history')} {
      ${cssProp('background-color')}: rgba(0 0 0 / var(${cssProp('background-opacity')}));

      position: fixed;
      left: 10px;
      top: 150px;
      margin: 0;
      padding: 0;
      list-style: none;
      color: white;
      font-family: "Roboto", sans-serif;
      font-size: 0.8rem;
      user-select: none;
      background-color: var(${cssProp('background-color')});
      box-shadow: 0 0 10px 10px var(${cssProp('background-color')});

      &:empty {
        visibility: hidden;
      }

      & .${cssClass('vote-history-entry')} {
        margin: 0.5rem;
        text-shadow: 1px 1px 2px black;
        display: flex;
        align-items: center;
        white-space-collapse: preserve;

        .${cssClass('vote-history--increased-visibility')} & {
          text-shadow: ${[[0, 1], [0, -1], [1, 0], [-1, 0]].map(([x, y]) => `${x}px ${y}px 2px rgba(0 0 0 / 50%)`)};
        }

        .${cssClass('vote-history--compact')} & {
          margin: 0;
        }

        & .${cssClass('vote-history-entry__icon-container')} {
          position: relative;
          height: 12px;
          aspect-ratio: 1;
          margin-right: 0.5rem;
          vertical-align: middle;

          .${cssClass('vote-history--compact')} & {
            margin-right: 0.25rem;
          }

          & > img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: inline-block;
          }

          & .${cssClass('vote-history-entry__icon-shadow')} {
            opacity: .5;
            scale: 1.5;
            filter: blur(5px);
          }

          & .${cssClass('vote-history-entry__icon')} {
            filter: invert(1);
            z-index: 1;
          }
        }

        & .${cssClass('vote-history-entry__highlighted-vote')} {
          color: #FFFEA9;
        }

        & .${cssClass('vote-history-entry__time')} {
          margin-left: 1ch;
          font-size: 80%;
          color: lightgrey;

          .${cssClass('vote-history--compact')} & {
            margin-left: 0.5ch;
          }
        }
      }
    }
    `);

    state.dom.voteHistoryEntriesFadeStyleEl = document.createElement('style');
    document.head.appendChild(state.dom.voteHistoryEntriesFadeStyleEl);
  }

  function createSettingsTab() {
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
        tabName: 'Vote History',
        style: `
        .${cssClass('settings-tab-content')} {
          container: ${cssClass('settings-tab-content')} / size;

          & *, *::before, *::after {
            box-sizing: border-box;
          }

          & .${cssClass('field-group')} {
            margin-block: 1rem;
            gap: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;

            & label {
              white-space: nowrap;
            }

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
              width: 50%;
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
      fieldGroupEl.appendChild(labelEl);

      const inputEl = renderInput({ id });
      fieldGroupEl.appendChild(inputEl);

      return fieldGroupEl;
    }

    tab.container.append(
      makeFieldGroup({ id: `${CSS_PREFIX}max-entries`, label: 'Max entries' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'number';
        inputEl.style.width = '10ch';
        inputEl.value = state.settings.maxEntries;

        inputEl.addEventListener('change', async () => {
          const numberValue = parseInt(inputEl.value);
          if (Number.isNaN(numberValue)) {
            return;
          }

          state.settings.maxEntries = numberValue;

          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}fill-in-previous-votes`, label: 'Fetch old votes on load' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = state.settings.fillInPreviousVotes;

        inputEl.addEventListener('change', async () => {
          state.settings.fillInPreviousVotes = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}increase-visiblity`, label: 'Increased visibility' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = state.settings.increasedVisibility;

        inputEl.addEventListener('change', async () => {
          state.settings.increasedVisibility = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}compact-entries`, label: 'Compact entries' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = state.settings.compactEntries;

        inputEl.addEventListener('change', async () => {
          state.settings.compactEntries = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}container-background-opacity`, label: 'Background opacity' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'range';
        inputEl.className = IRF.ui.panel.styles.slider;
        inputEl.min = 0;
        inputEl.max = 1;
        inputEl.step = 0.05;
        inputEl.value = state.settings.containerBackgroundOpacity;

        inputEl.addEventListener('input', async () => {
          const numberValue = Number.parseFloat(inputEl.value);
          if (Number.isNaN(numberValue)) {
            return;
          }

          state.settings.containerBackgroundOpacity = numberValue;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}show-chosen-vote-percentage`, label: 'Show chosen vote percentage' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = state.settings.showChosenVotePercentage;

        inputEl.addEventListener('change', async () => {
          state.settings.showChosenVotePercentage = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
      makeFieldGroup({ id: `${CSS_PREFIX}show-all-vote-counts`, label: 'Full vote counts' }, ({ id }) => {
        const inputEl = document.createElement('input');
        inputEl.id = id;
        inputEl.type = 'checkbox';
        inputEl.className = IRF.ui.panel.styles.toggle;
        inputEl.checked = state.settings.showAllVoteCounts;

        inputEl.addEventListener('change', async () => {
          state.settings.showAllVoteCounts = inputEl.checked;
          await saveSettings();
          updateDomFromSettings();
        });

        return inputEl;
      }),
    );
  }

  async function setupDom() {
    await IRF.vdom.container; // FIX(netux): required to avoid crashing other userscripts :s

    const containerEl = await IRF.dom.container;

    injectStylesheets();
    createSettingsTab();

    state.dom.voteHistoryContainerEl = document.createElement('ul');
    state.dom.voteHistoryContainerEl.className = cssClass('vote-history');
    containerEl.appendChild(state.dom.voteHistoryContainerEl);

    updateDomFromSettings();
  }

  async function patch() {
    const containerVDOM = await IRF.vdom.container;

    let previousData = null;
    containerVDOM.state.updateData = new Proxy(containerVDOM.methods.updateData, {
      apply(ogUpdateData, thisArg, args) {
        const newData = args[0];

        if (
          previousData != null &&
          newData.stop !== previousData.stop
        ) {
          const payload = {
            currentChosen: newData.chosen,
            currentHeading: previousData.heading,
            currentOptions: { ... previousData.options },
            voteCounts: { ... previousData.voteCounts }
          };

          addVote(payload).catch((error) => {
            console.error('Could not add vote to history:', payload, error);
          });
        }

        previousData = newData;

        return ogUpdateData.apply(thisArg, args);
      }
    });
  }

  async function saveSettings() {
    for (const [key, value] of Object.entries(state.settings)) {
      await GM.setValue(key, value);
    }
  }

  function updateDomFromSettings() {
    removeExcessVotes();

    // TODO(netux): it'd be nice to be able to use CSS variables and counters here,
    // but counter() does not work inside calc() :(
    // See https://github.com/w3c/csswg-drafts/issues/1026
    state.dom.voteHistoryEntriesFadeStyleEl.textContent = `
    .${cssClass('vote-history')} {
      ${new Array(state.settings.maxEntries).fill(null).map((_, i) => `
      .${cssClass('vote-history-entry')}:nth-child(${i + 1}) {
        opacity: ${1.2 - Math.pow(1 - ((state.settings.maxEntries - i) / state.settings.maxEntries), 2)};
      }
      `).join('\n')}
    }
    `;

    state.dom.voteHistoryContainerEl.classList.toggle(cssClass('vote-history--increased-visibility'), state.settings.increasedVisibility);

    state.dom.voteHistoryContainerEl.classList.toggle(cssClass('vote-history--compact'), state.settings.compactEntries);

    state.dom.voteHistoryContainerEl.style.setProperty(cssProp('background-opacity'), state.settings.containerBackgroundOpacity);
  }

  function removeExcessVotes() {
    while (state.dom.voteHistoryContainerEl.childElementCount > Math.max(0, state.settings.maxEntries)) {
      state.dom.voteHistoryContainerEl.lastElementChild.remove();
    }
  }

  async function addVote({
    currentChosen: vote,
    currentHeading: heading,
    currentOptions: options,
    voteCounts,
    time = new Date(),
    retroactive = false,
  }) {
    const resultsVDOM = await IRF.vdom.results;

    const newEntryEl = document.createElement('li');
    newEntryEl.className = cssClass('vote-history-entry');

    let entryActionText = '?';
    let entryIconSrc = null;
    let entryIconRotation = 0;
    switch (vote) {
      case -2: {
        entryActionText = 'HONK!';
        entryIconSrc = '/internet-roadtrip/honk.svg'
        break;
      }
      case -1: {
        entryActionText = 'Seek Radio';
        entryIconSrc = '/internet-roadtrip/skip.svg'
        break;
      }
      default: {
        entryIconSrc = '/internet-roadtrip/chevron-black.svg';
        if (options[vote]) {
          entryActionText = options[vote].description;
          entryIconRotation = resultsVDOM.methods.angleDifference(heading, options[vote].heading);
        } else {
          entryActionText = 'U-Turn';
          entryIconRotation = 180;
        }
        break;
      }
    }

    const voteIconEl = document.createElement('div');
    voteIconEl.className = cssClass('vote-history-entry__icon-container');
    if (entryIconRotation !== 0) {
      voteIconEl.style.rotate = `${entryIconRotation}deg`;
    }
    newEntryEl.appendChild(voteIconEl);

    const voteIconShadowImageEl = document.createElement('img');
    voteIconShadowImageEl.className = cssClass('vote-history-entry__icon-shadow');
    voteIconShadowImageEl.src = entryIconSrc;
    voteIconEl.appendChild(voteIconShadowImageEl);

    const voteIconImageEl = document.createElement('img');
    voteIconImageEl.className = cssClass('vote-history-entry__icon');
    voteIconImageEl.src = entryIconSrc;
    voteIconEl.appendChild(voteIconImageEl);

    const chosenVoteCount = voteCounts[vote];

    const voteCountTextNodes = [];
    if (state.settings.showAllVoteCounts) {
      const combinedVotesCountTextNodes = [... Object.entries(voteCounts)]
        .map(([voteStr, count]) => ({ vote: Number.parseInt(voteStr, 10), count }))
        .sort(({ vote: voteIdx1 }, { vote: voteIdx2 }) => {
          if (voteIdx2 < 0) {
            // Keep seek and honk last
            return 10 + Math.abs(voteIdx2);
          }

          const relativeHeading1 = (options[voteIdx1]?.heading - heading) % 360;
          const relativeHeading2 = (options[voteIdx2]?.heading - heading) % 360;

          const DEG_TO_RAD = Math.PI / 180;
          return (
            Math.sin(relativeHeading1 * DEG_TO_RAD) -
            Math.sin(relativeHeading2 * DEG_TO_RAD)
          );
        })
        .map(({ vote, count }) => {
          if (vote < 0) {
            if (count === 0) {
              return null;
            }

            switch (vote) {
              case -1: {
                // seek
                return {
                  vote,
                  textNode: document.createTextNode(`${count}S`)
                };
              }
              case -2: {
                // honk
                return {
                  vote,
                  textNode: document.createTextNode(`${count}H`)
                };
              }
            }
          }

          return {
            vote,
            textNode: document.createTextNode(count.toString())
          };
        })
        .filter((v) => !!v)
        .reduce((textNodes, option, index, { length: voteCountsLength }) => {
          if (option.vote === vote) {
            const highlightedVoteCountNode = document.createElement('span');
            highlightedVoteCountNode.classList.add(cssClass('vote-history-entry__highlighted-vote'));
            highlightedVoteCountNode.append(option.textNode);
            textNodes.push(highlightedVoteCountNode);
          } else {
            textNodes.push(option.textNode);
          }

          if (index < voteCountsLength - 1) {
            textNodes.push(document.createTextNode('/'));
          }

          return textNodes;
        }, []);

      voteCountTextNodes.push(
        ... combinedVotesCountTextNodes,
        document.createTextNode(` vote${Object.values(voteCounts).reduce((total, count) => total + count, 0) === 1 ? '' : 's'}`)
      );
    } else {
      voteCountTextNodes.push(
        document.createTextNode(`${chosenVoteCount} vote${chosenVoteCount === 1 ? '' : 's'}`)
      );
    }

    let entryVotesTextNodes;
    if (chosenVoteCount != null && chosenVoteCount > 0) {
      entryVotesTextNodes = [... voteCountTextNodes];

      if (state.settings.showChosenVotePercentage) {
        entryVotesTextNodes.push(
          document.createTextNode(`, ${Math.round(chosenVoteCount / Object.values(voteCounts).reduce((acc, votes) => acc + votes, 0) * 100)}%`)
        );
      }
    } else {
      entryVotesTextNodes = [
        document.createTextNode('no votes')
      ];
    }

    newEntryEl.append(
      document.createTextNode(entryActionText ? `${entryActionText} ` : ''),
      document.createTextNode('('),
      ... entryVotesTextNodes,
      document.createTextNode(')'),
    );

    const entryTimeEl = document.createElement('span');
    entryTimeEl.className = cssClass('vote-history-entry__time');
    entryTimeEl.innerText = time.toLocaleTimeString();
    newEntryEl.appendChild(entryTimeEl);

    if (state.dom.voteHistoryContainerEl.childElementCount > 0) {
      if (!retroactive) {
        state.dom.voteHistoryContainerEl.insertBefore(newEntryEl, state.dom.voteHistoryContainerEl.firstChild);
      } else {
        state.dom.voteHistoryContainerEl.appendChild(newEntryEl);
      }
    } else {
      state.dom.voteHistoryContainerEl.appendChild(newEntryEl);
    }

    removeExcessVotes();
  }

  if (typeof unsafeWindow !== 'undefined') {
    unsafeWindow.DEBUG__addVoteToHistory = addVote;
  }

  if (state.settings.fillInPreviousVotes && state.settings.maxEntries > 0) {
    fetch(`https://roadtrip.pikarocks.dev/history?limit=${Math.min(state.settings.maxEntries, 100)}`)
      .then((res) => res.json())
      .then((history) => {
        for (const stop of history) {
          const voteCounts = JSON.parse(stop.voteCounts);
          const chosen = Object.keys(voteCounts)
            .map((key) => Number.parseInt(key, 10))
            .reduce(
              (bestOptionIdx, optionIdx) => (
                voteCounts[optionIdx] > voteCounts[bestOptionIdx]
                  ? optionIdx
                  : bestOptionIdx
              ),
              0
            );
          const options = JSON.parse(stop.options);

          addVote({
            retroactive: true,
            currentChosen: chosen,
            currentHeading: stop.heading,
            currentOptions: options,
            voteCounts,
            time: new Date(stop.timestamp * 1000)
          });
        }
      });
  }

  await Promise.all([
    setupDom(),
    patch()
  ])
    .then(async () => {
      if (state.settings.debug?.honkers) {
        for (let i = 0; i < state.settings.maxEntries; i++) {
          const vote = -2;
          await addVote({
            currentChosen: vote,
            currentHeading: 0,
            currentOptions: { [vote]: { heading: 180 } },
            voteCounts: { [vote]: 100, [9999]: 50 }
          });
        }
      }
    });
})();