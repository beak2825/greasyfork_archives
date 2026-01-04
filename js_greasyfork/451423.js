// ==UserScript==
// @name            OLX.ro Filter out crap bikes
// @name:ro         OLX.ro Ascunde bicle nașpa
// @namespace       https://greasyfork.org/users/40601
// @homepage        https://greasyfork.org/en/scripts/451423
// @supportURL      https://greasyfork.org/scripts/451423/feedback
// @match           https://www.olx.ro/hobby-sport-turism/biciclete-fitness/**
// @match           https://www.olx.ro/d/hobby-sport-turism/biciclete-fitness/**
// @match           https://www.olx.ro/oferte/q-*biciclet*
// @match           https://www.olx.tld/*/q-*bicycle*
// @grant           none
// @version         1.5.4
// @author          Leeroy
// @license         GPL-3.0
// @description     Hide bikes you don't want to see on OLX.ro, because it lacks -keyword filtering
// @description:ro  Ascunde biciclete pe care nu vrei să le vezi pe OLX.ro, pentru că nu poți filtra "căutare -fără -termeni -nedoriți"
// @run-at          document-end
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/451423/OLXro%20Filter%20out%20crap%20bikes.user.js
// @updateURL https://update.greasyfork.org/scripts/451423/OLXro%20Filter%20out%20crap%20bikes.meta.js
// ==/UserScript==

/* eslint-env browser, greasemonkey */
/* globals GM_addValueChangeListener */
/* eslint-disable new-cap */

'use strict';

// Opinionated starter list of unwanted patterns
const defaultCrapBikePatterns = [
  'monociclu',
  'xl',
  'm[aă]rime xl',
  'copii',
  'bmx',
  'dirtbike',
  'cruiser',
  'time[ -]?trial',
  'balance bike',
  'recuperare',
  'stationar[aă]',
  'wahoo',
  'magnetic[aă]',
  'assault bike',
  'toorx',
  'techfit',
  'spinning',
  'indoor',
  'airbike',
  'eliptic[aă]',
  'chopper',
  'fat bike',
  'motor',
  'motoare',
  'scuter',
  'triciclet[aă]',
  'trotinet[aă]',
  'dhs',
  'e-?bike',
  'electric[aă]?',
  'b.?twin',
  'caraiman',
  'first.?bike',
  'ideal',
  'carpat',
  'kreativ',
  'kettler',
  'pegas',
  'rich',
  'rock.?rider',
  'romet',
  'velors',
  'x.?fact'
];

const productCardSelector = '[data-cy="l-card"]';
let patterns = [];

GM_addValueChangeListener('patterns', async () => {
  resetCrap();
  await getPatterns();
});

async function getPatterns() {
  patterns = await GM.getValue('patterns', defaultCrapBikePatterns);
  patterns = ['---'].concat(patterns).concat('---');
}

getPatterns();

// Reapply filtering every 1000ms
(function loop() {
  setTimeout(async function(re = patterns) {
    filterOut({
      target: productCardSelector,
      needle: `/${re.join('|')}/`
      //  selector: ':scope .promoted, :scope .promoted-list'
    });
    loop();
  }, 1000);
})();

function filterOut({ target = '.product', needle = /test123/, selector = null } = {}) {
  init();

  const arr = [...document.querySelectorAll(target)];

  arr.map(el => {
    // Already set
    if (el.classList.contains('crap')) return;
    if (new RegExp(needle, 'i').test(el.textContent) || el.querySelector(selector)) {
      // Useless result, hide entire parent target
      el.classList.add('crap');
    }
  });
}

function resetCrap() {
  [...document.querySelectorAll('.crap')].map(el => el.classList.remove('crap'));
}

function init() {
  if (document.querySelector('style#filter-crap')) return;
  var style = document.createElement('style');
  style.id = 'filter-crap';
  style.appendChild(document.createTextNode('.crap { opacity: 0.1 !important; }'));
  document.head.appendChild(style);
}

// https://stackoverflow.com/a/406408
function not(word = '') {
  return `^((?!${word})[\\s\\S])*$`;
}
