// ==UserScript==
// @name            Tokopedia Select/Unselect All Wishlist
// @name:id         Tokopedia Pilih Semua/Hapus Semua Pilihan  Wishlist
// @description     Select/unselect all Tokopedia wishlist items of a page
// @description:id  Pilih semua/hapus semua pilihan item wishlist Tokopedia dalam satu halaman
// @icon            https://ecs7.tokopedia.net/assets-tokopedia-lite/prod/icon512.png
// @match           https://www.tokopedia.com/*
// @grant           none
// @version         0.18
// @license         GPL-3.0-only
// @namespace       https://gitlab.com/undrilled
// @author          undrilled
// @downloadURL https://update.greasyfork.org/scripts/460391/Tokopedia%20SelectUnselect%20All%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/460391/Tokopedia%20SelectUnselect%20All%20Wishlist.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Injection retry duration
  const RUN_INTERVAL = 250;
  // Browser path check
  const PATH_CHECK_REGEX = '^/wishlist/(all|collection/.+)';
  // Select all button properties
  const SELECT_ALL_BUTTON_CLASS_NAME = 'undrilled_select_all_btn';
  const UNSELECT_ALL_BUTTON_CLASS_NAME = 'undrilled_unselect_all_btn';
  const SELECT_ALL_BUTTON_LABEL = 'Centang semua';
  const UNSELECT_ALL_BUTTON_LABEL = 'Hapus centang';
  // Selector targets
  const MANAGE_LABEL = 'Atur';
  const CANCEL_LABEL = 'Batal';
  const MANAGE_SELECTOR = '.manage';
  const PRODUCTS_SELECTOR = '.content__grid .product';
  const PRODUCT_TARGET_SELECTOR = '.target';

  const NOT_READY_MESSAGE = 'Manage button is not yet loaded. Retrying Select All Wishlist injection in ' + RUN_INTERVAL + 'ms.';

  let documentUrl = '';
  let observer = null;

  const isCorrectPage = () => {
    return !! window.location.pathname.match(PATH_CHECK_REGEX);
  }
  const showIsNotReadyMessage = () => {
    console.info(NOT_READY_MESSAGE);
  }
  const getManageButtonContainer = () => {
    return document.querySelector(MANAGE_SELECTOR) ?? null;
  }
  const getProducts = () => {
    return document.querySelectorAll(PRODUCTS_SELECTOR) ?? null;
  }
  const isProductSelected = (product) => {
    return product.querySelector('input').checked;
  }
  const getProductTarget = (product) => {
    return product.querySelector(PRODUCT_TARGET_SELECTOR) ?? null;
  }
  const getAnyManageButton = () => {
    const btnEl = getManageButtonContainer()?.querySelectorAll('button');
    if (!btnEl) {
      return null;
    }
    return Array
            .from(btnEl)
            .find(el => (el.innerText === MANAGE_LABEL || el.innerText === CANCEL_LABEL)) ?? null;
  }
  const getManageButton = () => {
    const el = getAnyManageButton();
    return el?.innerText === MANAGE_LABEL ? el : null;
  }
  const getCancelButton = () => {
    const el = getAnyManageButton();
    return el?.innerText === CANCEL_LABEL ? el : null;
  }
  const getSelectAllButton = () => {
    return document.querySelector('.' + SELECT_ALL_BUTTON_CLASS_NAME);
  }
  const getUnselectAllButton = () => {
    return document.querySelector('.' + UNSELECT_ALL_BUTTON_CLASS_NAME);
  }
  const isAnyManageButtonReady = () => {
    return !! getAnyManageButton();
  }
  const isManageButtonReady = () => {
    return !! getManageButton();
  }
  const isCancelButtonReady = () => {
    return !! getCancelButton();
  }
  const isInjected = () => {
    return !! observer;
  }

  const handleSelectAll = () => {
    getProducts().forEach(el => {
      if (isProductSelected(el)) {
        return;
      }
      getProductTarget(el).click();
    });
  }
  const handleClearSelection = () => {
    getProducts().forEach(el => {
      if (!isProductSelected(el)) {
        return;
      }
      getProductTarget(el).click();
    })
  }
  const inject = () => {
    const manageEl = getAnyManageButton();
    const newButtons = [
      {
        label: SELECT_ALL_BUTTON_LABEL,
        class: SELECT_ALL_BUTTON_CLASS_NAME,
        event: handleSelectAll
      },
      {
        label: UNSELECT_ALL_BUTTON_LABEL,
        class: UNSELECT_ALL_BUTTON_CLASS_NAME,
        event: handleClearSelection,
      }
    ];
    for (const x of newButtons) {
      const el = manageEl.cloneNode(true);
      el.classList.add(x.class);
      el.innerText = x.label;
      el.addEventListener('click', x.event);
      getManageButtonContainer().insertBefore(el, manageEl);
    }
  }
  const removeSelectAll = () => {
    const selectAllButton = getSelectAllButton();
    if (!selectAllButton) {
      return;
    }
    getManageButtonContainer()?.removeChild(selectAllButton);
  }
  const removeUnselectAll = () => {
    const unselectAllButton = getUnselectAllButton();
    if (!unselectAllButton) {
      return;
    }
    getManageButtonContainer()?.removeChild(unselectAllButton);
  }
  const removeAll = () => {
    removeSelectAll();
    removeUnselectAll();
  }

  const addHookManageChange = (fn) => {
    observer = new MutationObserver(fn);
    observer.observe(getAnyManageButton(), {
      characterData: true,
      subtree: true
    });
    // Run it once
    fn();
  }
  const removeHookManageChange = (fn) => {
    if (!observer) {
      return;
    }
    fn();
    observer.disconnect();
    observer = null;
  }

  const patchPathChange = () => {
    const handlePathChange = () => {
      requestAnimationFrame(() => {
        if (documentUrl !== location.href) {
          documentUrl = location.href;
          removeHookManageChange(() => {
            removeAll();
          });
          if (!isCorrectPage()) {
            return;
          }
          setup();
        }
      });
    }
    document.addEventListener('click', handlePathChange);
    document.addEventListener('keyup', handlePathChange);
  }

  const setup = () => {
    const intervalId = setInterval(() => {
      if (!isAnyManageButtonReady()) {
        showIsNotReadyMessage();
        return;
      }
      if (isInjected()) {
        clearInterval(intervalId);
        return;
      }

      addHookManageChange(() => {
        if (!isCancelButtonReady()) {
          removeAll();
          return;
        }
        inject();
      });

      clearInterval(intervalId);
    }, RUN_INTERVAL);
  }

  setup();
  patchPathChange();
})();