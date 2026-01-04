// ==UserScript==
// @name           Add button to move widget bar to left side - tradingview.com
// @namespace      Itsnotlupus Industries
// @match          https://*.tradingview.com/*
// @version        1.3
// @author         itsnotlupus
// @license        MIT
// @description    Allows user to move widgets like the chatbox to the left side of the app.
// @require        https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @require        https://greasyfork.org/scripts/471000-itsnotlupus-i18n-support/code/i18n.js
// @grant          GM_xmlhttpRequest
// @grant          GM_setValue
// @grant          GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/463725/Add%20button%20to%20move%20widget%20bar%20to%20left%20side%20-%20tradingviewcom.user.js
// @updateURL https://update.greasyfork.org/scripts/463725/Add%20button%20to%20move%20widget%20bar%20to%20left%20side%20-%20tradingviewcom.meta.js
// ==/UserScript==

/* global i18n, t, $, svg, observeDOM, untilDOM */
/* jshint esversion:11 */
/* eslint no-return-assign:0 */

const LEFT_TOOLBAR_WIDTH = 52;
const RIGHT_WIDGETBAR_WIDTH = 46;

(async function main() {

  const strings = {
    scriptFailure: 'UserScript "Add button to move widget bar to left side" has become incompatible with TradingView and can no longer work.\nPlease disable or update this script.',
    buttonLabel: "Move Widgets to Other Side of Chart",
    nagLog: "We found an UNCLOSABLE modal dialog. My favorite!"
  };

  i18n.setEnStrings([], strings);
  await i18n.initLanguage();

  // If we can't initialize within 60 seconds, let users know the script isn't able to work as intended.
  const failTimer = setTimeout(() => {
    const msg = t`scriptFailure`;
    console.log(`%c${msg}`, 'font-weight:600;font-size:2em;color:red');
    throw new Error(msg);
  }, 60 * 1000);

  // wait for app to load and store refs to relevant elements
  const [
    layoutAreaCenter,
    layoutAreaTradingPanel,
    layoutAreaLeft,
    layoutAreaRight,
    layoutAreaBottom,
    chartContainer,
    widgetbarPages,
    widgetbarWrap,
    widgetbarTabs,
    drawingToolbar,
    widgetToolbarFiller
  ] = await untilDOM(()=>{
    const elts = [
      $`.layout__area--center`,
      $`.layout__area--tradingpanel`,
      $`.layout__area--left`,
      $`.layout__area--right`,
      $`.layout__area--bottom`,
      $`.chart-container`,
      $`.widgetbar-pages`,
      $`.widgetbar-wrap`,
      $`.widgetbar-tabs`,
      $`#drawing-toolbar`,
      $`.widgetbar-tabs div[class^='filler-']`
    ];
    return elts.some(e=>!e) ? null : elts;
  });

  // If we're here, we're probably fine.
  clearTimeout(failTimer);

  // persistent state
  let widgetsMovedLeft = localStorage.widgetsMovedLeft === 'true';
  let lastAd = 0;

  // augment UI
  // clone a button and customize it to make our "move widgets" button.
  const button = widgetToolbarFiller.nextElementSibling.cloneNode(true);
  button.dataset.name = "move_widgets";
  button.dataset.tooltip = button.ariaLabel = t`buttonLabel`;
  button.querySelector('svg').remove();
  button.querySelector('span').append(svg('svg', { width: 44, height: 44, viewBox: "0 0 21 21" }, // random SVG icon goes here. a UX person I am not. https://www.svgrepo.com/svg/343314/toggles
                                          svg('g', { fill:"none", "fill-rule":"evenodd", stroke:"currentColor", "stroke-width":"0.4", "stroke-linecap":"round", "stroke-linejoin":"round", transform:"translate(3 4)" },
                                              svg('circle', { cx:"3.5", cy:"3.5", r:"3"}),
                                              svg('path', {d:"M6 1.5h6.5c.8 0 2 .3 2 2s-1.2 2-2 2H6m5.5 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"}),
                                              svg('path', {d:"M9 8.5H2.5c-.8 0-2 .3-2 2s1.2 2 2 2H9"})
                                          )
                                     ));
  button.addEventListener('click', () => toggleWidgets());
  widgetToolbarFiller.after(button);

  // apply state to app.
  toggleWidgets(widgetsMovedLeft);

  // start observing DOM to adjust layout continuously.
  observeDOM(adjustLayout);

  function toggleWidgets(left = !widgetsMovedLeft) {
    const parent = left ? layoutAreaLeft : layoutAreaRight;
    parent.prepend(widgetbarWrap);
    widgetbarTabs.style.right = left ? '' : '0';
    widgetbarTabs.style.left = left ? '0' : '';
    widgetbarPages.style.right = left ? '51px' : '';

    widgetsMovedLeft = left;
    localStorage.widgetsMovedLeft = left;
    adjustLayout();
  }

  function adjustLayout() {
    const widgetWidth = RIGHT_WIDGETBAR_WIDTH + widgetbarPages.clientWidth;
    const rightWidth = widgetsMovedLeft ? 0 : widgetWidth;
    const leftWidth = LEFT_TOOLBAR_WIDTH + (widgetsMovedLeft ? widgetWidth : 0);
    const centerWidth = innerWidth - leftWidth - rightWidth - 8;
    const centerLeft = leftWidth + 4;

    const set = (elt, props) => Object.keys(props).forEach(p => elt.style[p] = props[p] + 'px');

    set(drawingToolbar, {
      width: LEFT_TOOLBAR_WIDTH,
      marginLeft: leftWidth - LEFT_TOOLBAR_WIDTH + 2
    });

    set(layoutAreaRight, { width: rightWidth });
    set(layoutAreaLeft, { width: leftWidth });

    set(layoutAreaCenter, {
      width: centerWidth,
      left: centerLeft
    });
    set(chartContainer, { width: centerWidth });
    set(layoutAreaBottom, {
      width: centerWidth,
      left: centerLeft
    });
    set(layoutAreaTradingPanel, { right: rightWidth });

    // remove some nags since we're already here.
    $`div[data-role='toast-container']`?.querySelector('button')?.click();
    const gopro = $`[data-dialog-name='gopro']`;
    if (gopro) {
      // does it have a close button?
      const closeButton = gopro.querySelector('button[aria-label="close"],button[class^="close"]');
      if (closeButton) {
        closeButton.click();
      } else {
        // unclosable nag? Cool.
        console.error(t`nagLog`);
        gopro.parentElement.remove();
      }
    }
  }
})();