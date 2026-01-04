// ==UserScript==
// @name         MWI Dungeon Timer
// @namespace    http://tampermonkey.net/
// @version      1.22
// @author       qu
// @description  Automatically displays the time taken between dungeon runs in Milky Way Idle chat.
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        GM.registerMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539918/MWI%20Dungeon%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/539918/MWI%20Dungeon%20Timer.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  const MSG_SEL = '[class^="ChatMessage_chatMessage"]';
  const TIME_PART_RE =
    '(\\d{1,2}\/\\d{1,2})\\s(\\d{1,2}):(\\d{2}):(\\d{2})(?: ([AP]M))?';
  const FULL_TIMESTAMP_RE = new RegExp(`^\\[${TIME_PART_RE}\\]`);
  const KEY_COUNTS_RE = new RegExp(`^\\[${TIME_PART_RE}\\] Key counts: `);
  const BATTLE_ENDED_RE = new RegExp(
    `\\[${TIME_PART_RE}\\] Battle ended: `);
  const PARTY_FAILED_RE = new RegExp(
    `\\[${TIME_PART_RE}\\] Party failed on wave \\d+`);

  const TEAM_DATA_KEY = 'dungeonTimer_teamRuns';
  let teamRuns = {};
  let previousTimes = [];
  let isVerboseLoggingEnabled = false;
  let previousFastestMsg = null;

  // UI Setup
  GM.registerMenuCommand('Toggle Verbose Logging', async () => {
    isVerboseLoggingEnabled = !isVerboseLoggingEnabled;
    await GM.setValue('verboseLogging', isVerboseLoggingEnabled);
    console.log(
      `[DungeonTimer] Verbose logging ${isVerboseLoggingEnabled ? 'enabled' : 'disabled'}`
    );
  });

  // Initialize settings and data
  initDungeonTimer();

  async function initDungeonTimer() {
    isVerboseLoggingEnabled = await GM.getValue('verboseLogging', false);

    const characterId = getCharacterIdFromURL();
    if (!characterId) {
      console.error('Character ID not found in URL');
      return;
    }

    // Initialize the Dungeon Stats UI
    MWI_Toolkit_DungeonStats.initializeDungeonStatsUI(characterId);

    // Initialize dungeon runs for this character
    if (!teamRuns[characterId]) {
      teamRuns[characterId] = {};
    }

    try {
      const raw = localStorage.getItem(`${TEAM_DATA_KEY}_${characterId}`);
      teamRuns[characterId] = raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.warn('[DungeonTimer] Failed to load team data:', e);
    }

    // Wait 1.5 seconds for the chat to populate before scanning.
    setTimeout(() => {
      scanAndAnnotate(characterId);
    }, 1500);

    const observer = new MutationObserver(mutations => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const msg = node.matches?.(MSG_SEL) ? node : node
            .querySelector?.(MSG_SEL);
          if (!msg) continue;
          scanAndAnnotate(characterId);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ===================== Core Logic ======================

  function extractChatEvents() {
    maybeLog('extractChatEvents');
    const nodes = [...document.querySelectorAll(MSG_SEL)];
    const events = [];

    for (const node of nodes) {
      if (node.dataset.processed === '1') continue;
      const text = node.textContent.trim();
      const timestamp = getTimestampFromMessage(node);
      if (!timestamp) continue;

      if (KEY_COUNTS_RE.test(text)) {
        const team = getTeamFromMessage(node);
        if (!team.length) continue;
        events.push({
          type: 'key',
          timestamp,
          team,
          msg: node
        });
      } else if (PARTY_FAILED_RE.test(text)) {
        events.push({
          type: 'fail',
          timestamp,
          msg: node
        });
        node.dataset.processed = '1';
      } else if (BATTLE_ENDED_RE.test(text)) {
        events.push({
          type: 'cancel',
          timestamp,
          msg: node
        });
        node.dataset.processed = '1';
      }
    }

    return events;
  }

  function annotateChatEvents(events, characterId) {
    maybeLog('annotateChatEvents');
    previousTimes.length = 0;

    for (let i = 0; i < events.length; i++) {
      const e = events[i];
      if (e.type !== 'key') continue;

      const next = events[i + 1];
      let label = null;
      let diff = null;

      if (next?.type === 'key') {
        diff = next.timestamp - e.timestamp;
        if (diff < 0) {
          maybeLog("This should never happen!");
          diff += 24 * 60 * 60 * 1000; // handle midnight rollover
        }
        label = formatDuration(diff);

        const teamKey = e.team.join(',');
        const entry = {
          timestamp: e.timestamp.toISOString(),
          diff
        };

        // Only store data for the current character
        if (!teamRuns[characterId]) {
          teamRuns[characterId] = {};
        }
        teamRuns[characterId][teamKey] ??= [];
        const isDuplicate = teamRuns[characterId][teamKey].some(
          r => r.timestamp === entry.timestamp && r.diff === entry.diff
        );
        if (!isDuplicate) {
          teamRuns[characterId][teamKey].push(entry);
        }

        previousTimes.push({
          msg: e.msg,
          diff
        });
      } else if (next?.type === 'fail') {
        label = 'FAILED';
      } else if (next?.type === 'cancel') {
        label = 'canceled';
      }

      if (label) {
        e.msg.dataset.processed = '1';
        insertDungeonTimer(label, e.msg);
      }
    }

    saveTeamRuns(characterId);
  }

  function scanAndAnnotate(characterId) {
    const events = extractChatEvents();
    annotateChatEvents(events, characterId);
  }

  // ===================== Utilities ======================

  function maybeLog(logMessage) {
    if (isVerboseLoggingEnabled) {
      console.log("[DungeonTimer] " + logMessage);
    }
  }

  function getTimestampFromMessage(msg) {
    const match = msg.textContent.trim().match(FULL_TIMESTAMP_RE);
    if (!match) return null;

    let [_, date, hour, min, sec, period] = match;
    const [month, day] = date.split('/').map(x => parseInt(x, 10));

    hour = parseInt(hour, 10);
    min = parseInt(min, 10);
    sec = parseInt(sec, 10);

    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const now = new Date();
    const dateObj = new Date(now.getFullYear(), month - 1, day, hour, min,
      sec, 0);
    return dateObj;
  }

  function getTeamFromMessage(msg) {
    const text = msg.textContent.trim();
    const matches = [...text.matchAll(/\[([^\[\]-]+?)\s*-\s*\d+\]/g)];
    return matches.map(m => m[1].trim()).sort();
  }

  function insertDungeonTimer(label, msg) {
    if (msg.dataset.timerAppended === '1') return;

    const spans = msg.querySelectorAll('span');
    if (spans.length < 2) return;

    const messageSpan = spans[1];
    const timerSpan = document.createElement('span');
    timerSpan.textContent = ` [${label}]`;
    timerSpan.classList.add('dungeon-timer');

    if (label === 'FAILED') timerSpan.style.color = '#ff4c4c';
    else if (label === 'canceled') timerSpan.style.color = '#ffd700';
    else timerSpan.style.color = '#90ee90';

    timerSpan.style.fontSize = '90%';
    timerSpan.style.fontStyle = 'italic';

    messageSpan.appendChild(timerSpan);
    msg.dataset.timerAppended = '1';
  }


  function formatDuration(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }

  function saveTeamRuns(characterId) {
    try {
      localStorage.setItem(`${TEAM_DATA_KEY}_${characterId}`, JSON
        .stringify(teamRuns[characterId]));
    } catch (e) {
      console.error('[DungeonTimer] Failed to save teamRuns:', e);
    }
  }

  // ===================== UI Panel ======================

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) {
      // The element already exists; the callback will be executed directly.
      callback();
      return;
    }
    // The element does not exist; monitoring DOM changes.
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Object to hold Dungeon Stats related functionality
  const MWI_Toolkit_DungeonStats = {
    // Initialize Dungeon Stats UI
    initializeDungeonStatsUI(characterId) {
      waitForElement(
        '[class^="Chat_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]',
        () => {
          this.createDungeonStatsUI(characterId);
        });
    },

    // Create Dungeon Stats UI
    createDungeonStatsUI(characterId) {
      // Check if the panel is already initialized
      if (document.querySelector(
          '[class^="Toolkit_DungeonStats_Container"]')) {
        return;
      }

      // Get the tabs container and tab panels container
      const tabsContainer = document.querySelector(
        '[class^="Chat_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]'
      );
      const tabPanelsContainer = document.querySelector(
        '[class^="Chat_tabsComponentContainer"] [class*="TabsComponent_tabPanelsContainer"]'
      );
      if (!tabsContainer || !tabPanelsContainer) {
        console.error(
          '[MWI_Toolkit_DungeonStats] Unable to find the tab container');
        return;
      }

      // Create the Dungeon Stats tab
      this.createDungeonStatsTab(tabsContainer, tabPanelsContainer,
        characterId);

      maybeLog('UI initialization completed');
    },

    // Create Dungeon Stats Tab and Panel
    createDungeonStatsTab(tabsContainer, tabPanelsContainer,
      characterId) {
      // Create "Dungeon Stats" button
      const oldTabButtons = tabsContainer.querySelectorAll("button");
      this.tabButton = oldTabButtons[1].cloneNode(true);
      this.tabButton.children[0].textContent = 'Dungeon Stats';
      oldTabButtons[0].parentElement.appendChild(this.tabButton);

      // Create Dungeon Stats panel
      const oldTabPanels = tabPanelsContainer.querySelectorAll(
        '[class*="TabPanel_tabPanel"]');
      this.tabPanel = oldTabPanels[1].cloneNode(false);
      oldTabPanels[0].parentElement.appendChild(this.tabPanel);

      // Bind events for tab switching
      this.bindDungeonStatsTabEvents(oldTabButtons, oldTabPanels);

      // Create the Dungeon Stats content
      const statsPanel = this.createDungeonStatsPanel(characterId);
      this.tabPanel.appendChild(statsPanel);
    },

    // Bind events for Dungeon Stats Tab
    bindDungeonStatsTabEvents(oldTabButtons, oldTabPanels) {
      for (let i = 0; i < oldTabButtons.length; i++) {
        oldTabButtons[i].addEventListener('click', () => {
          this.tabPanel.hidden = true;
          this.tabPanel.classList.add('TabPanel_hidden__26UM3');
          this.tabButton.classList.remove('Mui-selected');
          this.tabButton.setAttribute('aria-selected', 'false');
          this.tabButton.tabIndex = -1;
          oldTabButtons[i].classList.add('Mui-selected');
          oldTabButtons[i].setAttribute('aria-selected', 'true');
          oldTabButtons[i].tabIndex = 0;
          oldTabPanels[i].classList.remove('TabPanel_hidden__26UM3');
          oldTabPanels[i].hidden = false;
        }, true);
      }

      // Switch to the Dungeon Stats tab
      this.tabButton.addEventListener('click', () => {
        oldTabButtons.forEach(btn => {
          btn.classList.remove('Mui-selected');
          btn.setAttribute('aria-selected', 'false');
          btn.tabIndex = -1;
        });
        oldTabPanels.forEach(panel => {
          panel.hidden = true;
          panel.classList.add('TabPanel_hidden__26UM3');
        });
        this.tabButton.classList.add('Mui-selected');
        this.tabButton.setAttribute('aria-selected', 'true');
        this.tabButton.tabIndex = 0;
        this.tabPanel.classList.remove('TabPanel_hidden__26UM3');
        this.tabPanel.hidden = false;
      }, true);
    },

    // Create Dungeon Stats Panel (Content)
    createDungeonStatsPanel(characterId) {
      const statsPanelContainer = document.createElement('div');
      statsPanelContainer.classList.add('Toolkit_DungeonStats_Container');
      statsPanelContainer.style.display = 'flex';
      statsPanelContainer.style.alignItems = 'flex-start';
      statsPanelContainer.style.justifyContent = 'flex-start';

      const statsTextPanel = document.createElement('div');
      // Add some space between the text and the graph.
      statsTextPanel.style.marginRight = '200px';
      statsTextPanel.style.textAlign = 'left';
      statsTextPanel.style.flexShrink = '0';

      const teamRunsForCharacter = teamRuns[characterId];
      if (!teamRunsForCharacter) return;

      for (const [teamKey, runs] of Object.entries(
          teamRunsForCharacter)) {
        if (!runs.length) continue;

        const times = runs.map(r => r.diff);
        const avg = Math.floor(times.reduce((a, b) => a + b, 0) / times
          .length);
        const best = Math.min(...times);
        const worst = Math.max(...times);

        const bestTime = runs.find(r => r.diff === best)?.timestamp;
        const worstTime = runs.find(r => r.diff === worst)?.timestamp;

        const line = document.createElement('div');
        line.innerHTML = `
        <strong>${teamKey}</strong> (${runs.length} runs)<br/>
        Avg: ${formatDuration(avg)}<br/>
        Best: ${formatDuration(best)} (${formatShortDate(bestTime)})<br/>
        Worst: ${formatDuration(worst)} (${formatShortDate(worstTime)})
      `;
        statsTextPanel.appendChild(line);
      }

      // Create the right section with the graph.
      const graphContainer = document.createElement('div');
      graphContainer.style.flexGrow = '1';
      graphContainer.style.maxWidth = '100%';
      graphContainer.style.height = '150px';
      const canvas = document.createElement('canvas');
      graphContainer.appendChild(canvas);

      // Append the left (text) and right (graph) sections to the container.
      statsPanelContainer.appendChild(statsTextPanel);
      statsPanelContainer.appendChild(graphContainer);

      const clearBtn = document.createElement('button');
      clearBtn.classList.add('Toolkit_DungeonStats_Container');
      clearBtn.textContent = 'Clear';
      clearBtn.style.background = '#a33';
      clearBtn.style.color = '#fff';
      clearBtn.style.border = 'none';
      clearBtn.style.cursor = 'pointer';
      clearBtn.style.padding = '4px 8px';
      clearBtn.style.margin = '6px';
      clearBtn.style.borderRadius = '4px';
      clearBtn.style.justifyContent = 'center';
      clearBtn.style.display = 'block';
      clearBtn.style.marginLeft = '0';
      clearBtn.style.marginBottom = '8px';

      clearBtn.addEventListener('click', () => {
        if (confirm('Clear previous dungeon run data?')) {
          teamRuns = {};
          saveTeamRuns(characterId);
        }
      });
      statsTextPanel.appendChild(clearBtn);

      // Create a canvas for the line graph.
      canvas.id = 'timeLineGraph';
      canvas.width = 400;
      canvas.height = 200;

      // Wait for the canvas to be added to the DOM before calling createTimeLineGraph.
      const observer = new MutationObserver(() => {
        const canvasElement = document.getElementById(
          'timeLineGraph');
        if (canvasElement) {
          observer.disconnect();
          this.createTimeLineGraph(canvasElement,
            teamRunsForCharacter);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      return statsPanelContainer;
    },

    // Create the line graph
    createTimeLineGraph(canvasElement, teamRunsForCharacter) {
      const ctx = canvasElement.getContext('2d');

      const labels = [];
      const times = [];
      for (const [teamKey, runs] of Object.entries(
          teamRunsForCharacter)) {
        if (!runs.length) continue;

        // Collect the run times for the graph using the timestamp diff.
        for (const run of runs) {
          const timestamp = new Date(run.timestamp);
          labels.push(
            `${timestamp.getMonth() + 1}/${timestamp.getDate()}`);
          times.push(run.diff / 60000);
        }
      }

      const minTime = Math.min(...times);
      const minYValue = minTime > 1 ? minTime - 1 : 0;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Dungeon Run Time',
            data: times,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Dungeon Run Time',
              font: {
                size: 18
              },
              padding: {
                bottom: 20
              }
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Date'
              },
              ticks: {
                // Display one label per day to reduce clutter.
                callback: function(value, index, values) {
                  if (index === 0 || labels[index] !== labels[
                      index - 1]) {
                    return labels[index];
                  }
                  return '';
                },
              }
            },
            y: {
              title: {
                display: true,
                text: 'Time (min)'
              },
              minYValue: 0
            }
          }
        }
      });
    }
  };

  function formatShortDate(isoStr) {
    const d = new Date(isoStr);
    // e.g. Dec 01, 00:00 PM
    const options = {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return d.toLocaleTimeString([], options);
  }

  function getCharacterIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('characterId');
  }

})();