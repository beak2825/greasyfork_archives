// ==UserScript==
// @name         Torn Racing: Highlight & Move Car
// @namespace    https://greasyfork.org/users/YOUR_ID   // <-- change this
// @author       YOUR_NAME                               // <-- change this
// @version      1.3.0
// @description  Highlights your mapped race car, moves it under the race title, and (optionally) hides stat bars.
// @match        https://www.torn.com/loader.php?sid=racing*
// @run-at       document-idle
// @grant        GM_addStyle
// @license      MIT
// @homepageURL  https://greasyfork.org/scripts/YOUR_SCRIPT_ID            // <-- optional
// @supportURL   https://greasyfork.org/scripts/YOUR_SCRIPT_ID/feedback   // <-- optional
// @downloadURL https://update.greasyfork.org/scripts/543348/Torn%20Racing%3A%20Highlight%20%20Move%20Car.user.js
// @updateURL https://update.greasyfork.org/scripts/543348/Torn%20Racing%3A%20Highlight%20%20Move%20Car.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /******** CONFIG *********/
  const RACE_TO_TAG = {
    '^Vector': 'Vec',
    '^Concord': 'Con',
    '^Wit': 'Wit',
    '^Doc': 'Doc',
    '^Upl': 'Upl'
    // add more…
  };
  const SCROLL_ONCE = false; // set true if you want a one-time scroll per race
  const REMOVE_BARS = true;  // set false if you want to keep them
  /**************************/

  // style
  (typeof GM_addStyle === 'function' ? GM_addStyle : addStyle)(`
    .trc-highlight{
      outline:3px solid #3fb950!important;
      box-shadow:0 0 10px #3fb950;
      background:rgba(63,185,80,.08)!important;
    }
    ${REMOVE_BARS ? `
      /* hide the stat bars */
      .trc-hidden-bars{ display:none !important; }
    ` : ''}
  `);

  function addStyle(css){
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  let lastRace = '';
  let scrolledThisRace = false;

  function getRaceName(){
    const el = document.querySelector('.enlisted-btn-wrap');
    return el ? el.textContent.trim().replace(/-.*$/,'').trim() : '';
  }

  function pickTag(race){
    for (const [pat, tag] of Object.entries(RACE_TO_TAG)){
      if (new RegExp(pat,'i').test(race)) return tag;
    }
    return null;
  }

  function getContainer(){
    return document.querySelector('#racingAdditionalContainer .cont-black.bottom-round.enlist');
  }

  function getCarBlocks(){
    return [...document.querySelectorAll('.enlist-info-wrap')];
  }

  function getCarName(infoWrap){
    const span = infoWrap.querySelector('span[class^="model-car-name-"]');
    return span ? span.textContent.trim() : '';
  }

  // collect the bars (and delimiters) after a car block
  function collectBars(infoWrap){
    const bars = [];
    let n = infoWrap.nextElementSibling;
    while (n && !n.classList.contains('enlist-info-wrap')){
      if (n.matches('.enlist-bars, .t-delimiter, .b-delimiter, span.clear')) bars.push(n);
      n = n.nextElementSibling;
    }
    return bars;
  }

  function moveCarUnderTitle(infoWrap){
    const container = getContainer();
    if (!container) return;

    // find the header block with race title
    const titleWrap = container.querySelector('.enlisted-btn-wrap');
    if (!titleWrap) return;

    // remove/hide bars first if desired
    if (REMOVE_BARS){
      collectBars(infoWrap).forEach(el => el.classList.add('trc-hidden-bars'));
    }

    // insert AFTER the title wrap (so it's "under the race name")
    // titleWrap is inside a div; we insert after that exact node
    const afterNode = titleWrap.parentElement === container ? titleWrap : titleWrap.parentElement;
    if (!afterNode) return;

    if (afterNode.nextSibling === infoWrap) return; // already there

    container.insertBefore(infoWrap, afterNode.nextSibling);
  }

  function highlightAndPlace(infoWrap){
    infoWrap.classList.add('trc-highlight');
    infoWrap.dataset.trcDone = '1';

    moveCarUnderTitle(infoWrap);

    if (SCROLL_ONCE && !scrolledThisRace){
      infoWrap.scrollIntoView({behavior:'smooth', block:'center'});
      scrolledThisRace = true;
    }
  }

  function run(){
    const race = getRaceName();
    if (!race) return;

    if (race !== lastRace){
      lastRace = race;
      scrolledThisRace = false;
      document.querySelectorAll('.trc-highlight').forEach(el => el.classList.remove('trc-highlight'));
      document.querySelectorAll('[data-trc-done]').forEach(el => delete el.dataset.trcDone);
    }

    const tag = pickTag(race);
    if (!tag) return;

    const blocks = getCarBlocks();
    const match = blocks.find(b => !b.dataset.trcDone && getCarName(b).toLowerCase().includes(tag.toLowerCase()));
    if (match){
      highlightAndPlace(match);
    }
  }

  const mo = new MutationObserver(() => {
    clearTimeout(mo._t);
    mo._t = setTimeout(run, 200);
  });
  mo.observe(document.body, {childList:true, subtree:true});

  run();
})();
