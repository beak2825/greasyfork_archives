// ==UserScript==
// @name          TradingView: force panel for order view
// @description   Forces panel instead of a pop up for a brokers trading order view
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=tradingview.com
// @version       2.0.0
// @match         https://www.tradingview.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/arrive/2.4.1/arrive.min.js#sha512-wkU3qYWjenbM+t2cmvw2ADRRh4opbOYBjkhrPGHV7M6dcE/TR0oKpoDkWXfUs3HrulI2JFuTQyqPLRih1V54EQ==
// @run-at        document-body
// @grant         unsafeWindow
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/525289/TradingView%3A%20force%20panel%20for%20order%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/525289/TradingView%3A%20force%20panel%20for%20order%20view.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

// There are two popups the script should target:
// order creation and order (position) modification.
// Creation popup: RMB -> Trade -> Create new order
// Modification popup: at the creation popup go to Market tab
// then press Buy or Sell down below. This would create a snippet attached
// to the chart price axis, interact with it in order to open a modification popup.
// Modification popup title contains word Long or Short.
// Depending on which popup is currently active, there is
// either `_orderViewController._orderViewModel`
// or `_orderViewController._positionViewModel` is available.
// These can be used to pin current popup automatically.

(function() {
  'use strict';

  const Q = {
    creationPopupContainer: 'div[data-outside-boundary-for="order-dialog-popup"]',
    modificationPopupContainer: 'div[data-outside-boundary-for="position-dialog-popup"]',
    pinToggleBtn: 'div[data-name="dock-undock-order-panel-button"]',
  };

  const anyPopupContainerQuery = [
    Q.creationPopupContainer,
    Q.modificationPopupContainer,
  ].join();

  let ignorePopupOnce = false;

  document.arrive(anyPopupContainerQuery, {
    existing: true,
  }, () => {
    if (ignorePopupOnce) {
      ignorePopupOnce = false;
      return;
    }

    const { _orderViewController } = (
      unsafeWindow.widgetbar.tradingPanelAccessor.tradingPanel._pages.domPanel._trading
    );

    if (_orderViewController._orderViewModel) {
      _orderViewController._orderViewModel.headerModel.pin();
    } else {
      _orderViewController._positionViewModel.headerModel.pin();
    }
  });

  // Do not pin if unpinned manually
  document.arrive(Q.pinToggleBtn, {
    existing: true,
  }, (pinToggleBtn) => {
    pinToggleBtn.addEventListener('click', () => (ignorePopupOnce = true));
  });
}());
