// ==UserScript==
// @name        Link to LBRY on video detail - odysee.com
// @namespace   monnef.eu
// @match       https://odysee.com/*
// @grant       none
// @version     0.1
// @author      monnef
// @require     https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @description Adds a link to LBRY on video detail
// @downloadURL https://update.greasyfork.org/scripts/421284/Link%20to%20LBRY%20on%20video%20detail%20-%20odyseecom.user.js
// @updateURL https://update.greasyfork.org/scripts/421284/Link%20to%20LBRY%20on%20video%20detail%20-%20odyseecom.meta.js
// ==/UserScript==

const logPrefix = '[LTL]';

const log = (...xs) => { console.log(logPrefix, ...xs); };
const info = (...xs) => { console.info(logPrefix, ...xs); };
const debug = (...xs) => { console.debug(logPrefix, ...xs); };

const cssPrefix = 'ltl';
const mkCls = x => `${cssPrefix}--${x}`;
const btnCls = mkCls('lbry-link-btn');

const lbryIcon = `<svg stroke="currentColor" fill="currentColor" x="0px" y="0px" viewBox="0 0 322 254" style="width: 2em"><path d="M296,85.9V100l-138.8,85.3L52.6,134l0.2-7.9l104,51.2L289,96.1v-5.8L164.2,30.1L25,116.2v38.5l131.8,65.2 l137.6-84.4l3.9,6l-141.1,86.4L18.1,159.1v-46.8l145.8-90.2C163.9,22.1,296,85.9,296,85.9z"></path><path d="M294.3,150.9l2-12.6l-12.2-2.1l0.8-4.9l17.1,2.9l-2.8,17.5L294.3,150.9L294.3,150.9z"></path></svg>`;

const work = () => {
  // debug('work');
  const actions = $('.file-page .media__actions .section__actions');
  if (!actions.length) {
    debug('Actions section not found.');
    return;
  }
  if ($(`.${btnCls}`).length) return;
  const btn = $('<a>')
    .addClass('button button--no-style button--file-action')
    .html(lbryIcon)
    .addClass(btnCls)
    .css({display: 'flex'})
    .prop('href', 'https://lbry.tv' + window.location.pathname)
  ;
  actions.prepend(btn);
};

const main = () => {
  log('Starting "Link to LBRY on video detail"');
  setInterval(work, 5000);
  setTimeout(work, 1000);
  setTimeout(work, 2000);
};

$(main);