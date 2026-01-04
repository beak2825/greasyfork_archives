// ==UserScript==
// @name         Blind typing targets panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.keybr.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406517/Blind%20typing%20targets%20panel.user.js
// @updateURL https://update.greasyfork.org/scripts/406517/Blind%20typing%20targets%20panel.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const appData = {
    storageName: 'dailyTargets',
    progressColor: 'BLACK',
    targets: {
      nothing: { count: 0, color: 'STEELBLUE' },
      basic: { count: 3000, color: 'CORAL' },
      plus: { count: 5000, color: 'LIGHTSEAGREEN' },
      elite: { count: 6000, color: 'DARKMAGENTA' },
    },
  };

  const getState = () => {
    const stateJSON = localStorage.getItem(appData.storageName);
    const initialState = {
      symbolsCount: 0,
      achievedTarget: 'nothing',
      lastSessionDate: new Date(),
    };

    if (!stateJSON) {
      return initialState
    }

    const state = JSON.parse(stateJSON);
    const isSameDay = Math.floor(new Date(state.lastSessionDate).getTime() / 864e5) === Math.floor(new Date().getTime() / 864e5);
    return isSameDay ? state : initialState;
  };

  const saveState = (state) => {
    localStorage.setItem(appData.storageName, JSON.stringify(state));
  };

  const mountContainer = (state) => {
    const container = document.createElement('div');
    container.id = 'daily-targets';
    container.style.boxSizing = 'border-box';
    container.style.height = '40px';
    container.style.width = '100%';
    container.style.color = 'white';
    container.style.fontSize = '18px';
    container.style.letterSpacing = '3px';
    container.style.textAlign = 'center';
    container.style.padding = '7px';
    container.style.fontFamily = 'sans-serif';
    container.style.position = 'absolute';
    document.body.prepend(container);
    return container;
  };

  const calcProgressPercent = (state) => {
    const targetNames = Object.keys(appData.targets);
    const achievedTargetIndex = targetNames.findIndex((name) => name === state.achievedTarget);
    const nextTargetName = targetNames[achievedTargetIndex + 1] || targetNames[achievedTargetIndex];
    if (nextTargetName === state.achievedTarget) {
      return 0;
    }
    const range = appData.targets[nextTargetName].count - appData.targets[state.achievedTarget].count;
    const symbolsAboveAchievedTarget = state.symbolsCount - appData.targets[state.achievedTarget].count;
    return Math.floor(symbolsAboveAchievedTarget * 100 / range);
  };

  const getAchievedTarget = (state) => Object.entries(appData.targets).reduce(
    (acc, [name, data]) => state.symbolsCount >= data.count ? name : acc,
    'nothing',
  );

  const render = (state) => {
    const container = document.getElementById('daily-targets') || mountContainer(state);
    container.innerHTML = state.achievedTarget.toUpperCase();
    const progressColor = appData.progressColor;
    const mainColor = appData.targets[state.achievedTarget].color;
    const progressPercent = calcProgressPercent(state);
    container.style.background = `linear-gradient(
    to right,
    ${progressColor} 0%,
    ${progressColor} ${progressPercent}%,
    ${mainColor} ${progressPercent}%,
    ${mainColor} 100%
  )`;
  }

  const app = () => {
    const state = getState();

    document.body.addEventListener('keypress', () => {
      state.symbolsCount += 1;
      const newAchievedTarget = getAchievedTarget(state);
      if (state.achievedTarget !== newAchievedTarget) {
        state.achievedTarget = newAchievedTarget;
        saveState(state);
      }
      render(state);
    });

    render(state)
  };

  app();
})();