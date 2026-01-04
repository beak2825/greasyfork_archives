// ==UserScript==
// @name        Monster Respawn Reducer
// @description Reduces the monster respawn timer to 100ms
// @version     1.0.0
// @license     MIT
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @grant       none
// @namespace   buttchouda/melvor-spawn-reducer
// @downloadURL https://update.greasyfork.org/scripts/437512/Monster%20Respawn%20Reducer.user.js
// @updateURL https://update.greasyfork.org/scripts/437512/Monster%20Respawn%20Reducer.meta.js
// ==/UserScript==

(() => {
  const main = () => {
    const respawnTime = player.getMonsterSpawnTime() - 100;
    player.passives.set({ modifiers: { decreasedMonsterRespawnTimer: respawnTime }}, { save: false, display: false });
    updateAllPlayerModifiers();
  };

  const load = () => {
    const isGameLoaded = (window.isLoaded && !window.currentlyCatchingUp) ||
      (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp);
      
    if (!isGameLoaded) {
      setTimeout(load, 50);
      return;
    }

    inject();
  };

  const inject = () => {
      const script = document.createElement('script');
      script.textContent = `try { (${main})(); } catch (e) { console.error(e); }`;

      document.body.appendChild(script);
  };

  load();
})();