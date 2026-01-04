// ==UserScript==
// @name        Finders Keepers for Melvor Idle
// @description Allows the user to quickly add previously found items to their bank via the item log. Also hooks into SEMI's Living Bank Helper if available.
// @version     1.2.0
// @license     MIT
// @match       https://*.melvoridle.com/*
// @exclude     https://wiki.melvoridle.com*
// @grant       none
// @namespace   https://github.com/ChaseStrackbein/melvor-idle-finders-keepers
// @downloadURL https://update.greasyfork.org/scripts/429150/Finders%20Keepers%20for%20Melvor%20Idle.user.js
// @updateURL https://update.greasyfork.org/scripts/429150/Finders%20Keepers%20for%20Melvor%20Idle.meta.js
// ==/UserScript==

const main = () => {
  let initialized = false;

  const init = () => {
    if (initialized) return;
    
    const $itemLog = $('#itemlog-container');
    $itemLog.on('click', '.bank-item[id^="item-log-img"]', onItemLogClick);
    waitForSEMI(() => {
      const $semiLivingBank = $('#living-bank-helper-container');
      $semiLivingBank.on('click', 'img', onItemLogClick);
    });

    initialized = true;
    console.log('Finders Keepers initialized');
  };
  
  const waitForSEMI = (callback, retries = 0) => {
    if ($('#living-bank-helper-container').length) {
      callback();
      return;
    }
    
    if (retries > 59) return;
    
    setTimeout(() => waitForSEMI(callback, ++retries), 1000);
  }
  
  const onItemLogClick = (e) => {
    const $item = $(e.currentTarget);
    
    // Avoid double-adding items that already have this functionality (lore books)
    const existingOnClick = $item.attr('onclick');
    if (existingOnClick && existingOnClick.includes('addItemToBank')) return;
    
    const itemDOMId = $item.prop('id').split('-');
    const itemId = parseInt(itemDOMId[itemDOMId.length - 1]);
    
    if (isNaN(itemId)) return;

    addItemIfDiscovered(itemId);
  };
  
  const addItemIfDiscovered = (itemId) => {
    if (!itemsAlreadyFound.includes(itemId)) return;

    addItemToBank(itemId, 1);
  };

  init();
};

(() => {
  const load = () => {
    const isGameLoaded = (window.isLoaded && !window.currentlyCatchingUp) ||
      (typeof unsafeWindow !== 'undefined' && unsafeWindow.isLoaded && !unsafeWindow.currentlyCatchingUp);
      
    if (!isGameLoaded) {
      setTimeout(load, 50);
      return;
    }

    inject();
  }

  const inject = () => {
      const scriptId = 'bfk-main';

      const previousScript = document.getElementById(scriptId);
      if (previousScript) previousScript.remove();

      const script = document.createElement('script');
      script.id = scriptId;
      script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;

      document.body.appendChild(script);
  }

  load();
})();