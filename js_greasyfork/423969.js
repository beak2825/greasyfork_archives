// ==UserScript==
// @name        HN: style unread content
// @description Save hashes of displayed comments locally and mark new ones when displayed for the first time
// @namespace   myfonj
// @match       https://news.ycombinator.com/*
// @grant       none
// @version     1.1.3
// @author      myfonj
// @run-at      document end
// @downloadURL https://update.greasyfork.org/scripts/423969/HN%3A%20style%20unread%20content.user.js
// @updateURL https://update.greasyfork.org/scripts/423969/HN%3A%20style%20unread%20content.meta.js
// ==/UserScript==

// https://greasyfork.org/en/scripts/423969/versions/new

/*
 * Changelog
 * 1.1.3 (2024-10-31) Age title lost the "Z" timezone, and gained some raw timestamp after space. Strange.
 * 1.1.2 (2024-10-03) Age title got the "Z" timezone, no need to imply it anymore.
 * 1.1.1 (2023-10-22) visualise age (=offset) original post date (= dotted line) and points × comments
*/

// kinda sorta configuration
const WATCHED_ELEMENTS_SELECTOR = '.commtext, .storylink, .titlelink, .titleline > a';
const VIEWPORT_EXPOSITION_DURATION_UNTIL_READ = 900;
const CSS_CLASSES = {
  unread: 'new',
  read: 'read',
  old: 'old'
};
// Styling. Very lame for now.
const CSS_STR = `
.${CSS_CLASSES.unread} {
  border-right: 2px solid #3F36;
  display: block;
  padding-right: 1em;
}
.${CSS_CLASSES.read} {
  border-right: 2px solid #0F03;
  display: block;
  padding-right: 1em;
}
.${CSS_CLASSES.old} {
  opacity: 0.9;
}
/*
visualise age (=offset) original post date (= dotted line) and points × comments
*/
.subline {
 position: relative;
}
.subline::before ,
.subline::after {
 position: absolute;
 right: 100%;
 bottom: 0;
 content: '';
 background-color: lime;
 width: calc(var(--points) * 1px);
 height: calc(var(--comments) * 1px);
 z-index: 1000000;
 /* 0min = 1 */
 /* 1min = .9 */
 /* 10min = .8 */
 --_minutes_old: calc(var(--age) / 1000 / 60);
 --_minutes_old2: calc(var(--age2) / 1000 / 60);
 --_o: calc( var(--_minutes_old) / 10 );
 opacity: .5;
 border: 1px solid red;
 transform: scale(.2) translatex(calc(var(--_minutes_old2) * -1px));
 transform-origin: bottom right;
}
.subline::after {
 height: 0px;
 width: calc(( var(--_minutes_old) - var(--_minutes_old2) )* 1px);
 border: none;
 border-bottom: 10px dotted lime;
 background-color: transparent;
}
`;
// base64 'SHA-1' digest hash = 28 characters;
// most probably ending with '=' always(?)
const HASH_DIGEST_ALGO = 'SHA-1';

// local storage key
const LS_KEY = 'displayed_hashes_' + HASH_DIGEST_ALGO;

// actual code, yo
document.head.appendChild(document.createElement('style'))
  .textContent = CSS_STR;
// TODO mutation observer for client-side rendered pages
// not case for HN, but it will make this truly universal

const ELS_TO_WATCH = document.querySelectorAll(WATCHED_ELEMENTS_SELECTOR);
/**
 * watched DOM node -> it's text content digest
*/
const MAP_EL_HASH = new WeakMap();
/**
 * watched DOM node -> time counter ID
*/
const MAP_EL_TIMEOUT_ID = new WeakMap();
/**
 * get all "read" digests
*/
const GET_SEEN_HASHES_SET =
  () => new Set((localStorage.getItem(LS_KEY) || '').split(','));
/**
 * intersection observer callback
 */
const VIEWPORT_ENTRY_CHECKER = (entry) => {
  const TGT = entry.target;
  if (entry.isIntersecting) {
    // entered viewport
    if (MAP_EL_TIMEOUT_ID.get(TGT)) {
      // already measuring - quick re-entry
      return
    }
    // measure time in viewport
    MAP_EL_TIMEOUT_ID.set(
      TGT,
      window.setTimeout(
        processVisibleEntry,
        VIEWPORT_EXPOSITION_DURATION_UNTIL_READ
      )
    );
  } else {
    // left viewport
    MAP_EL_TIMEOUT_ID.delete(TGT);
  }
  function processVisibleEntry() {
    if (MAP_EL_TIMEOUT_ID.get(TGT)) {
      // HA! STILL in viewport!
      // mark as read
      TGT.classList.remove(CSS_CLASSES.unread);
      TGT.classList.add(CSS_CLASSES.read);
      const NEW_SET = GET_SEEN_HASHES_SET();
      NEW_SET.add(MAP_EL_HASH.get(TGT))
      MAP_EL_TIMEOUT_ID.delete(TGT);
      // not interested in this element anymore
      VIEWPORT_OBSERVER.unobserve(TGT);
      // TODO move the persistence to window unload and/or blur event for fewer LS writes
      localStorage.setItem(
        LS_KEY,
        Array.from(NEW_SET).join(',')
      );
    }
  }
}

/**
 * just a single observer for all watched elements
 */
const VIEWPORT_OBSERVER = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(_ => VIEWPORT_ENTRY_CHECKER(_));
  },
  {
    root: null,
    rootMargin: "-9%", // TODO use computed "lines" height here instead?
    threshold: 0
  }
);

const SEEN_ON_LOAD = GET_SEEN_HASHES_SET();

// compute hash, look into list and mark and observe "new" items

ELS_TO_WATCH.forEach(async el => {
  const hash = await makeHash(el.textContent);
  if (SEEN_ON_LOAD.has(hash)) {
    el.classList.add(CSS_CLASSES.old);
    return;
  }
  el.classList.add(CSS_CLASSES.unread);
  MAP_EL_HASH.set(el, hash);
  VIEWPORT_OBSERVER.observe(el);
});

/**
 * string to base64 hash digest using native Crypto API
 * @param {string} input
 */
async function makeHash (input) {
  return btoa(
    String.fromCharCode.apply(
      null,
      new Uint8Array(
        await crypto.subtle.digest(
          HASH_DIGEST_ALGO,
          (new TextEncoder()).encode(input)
        )
      )
    )
  );
};


// unrelated add some links along "threads"

const threadsLink = document.querySelector('a[href^="threads"]');
const addLink = (key) => {
  const l = threadsLink.cloneNode(true);
  l.setAttribute('href', l.getAttribute('href').replace('threads', key));
  l.textContent = key;
  threadsLink.parentNode.insertBefore(l,threadsLink);
}
['upvoted','favorites'].forEach(addLink);

/*
// also not closely related: create velocity rectangles
// this time tailored to HN structure
tr[id="<numbers>"]
tr
 td[colspan="2"]
 td[class="subtext"]
  span[class="subline"]
   span[class="score"][id="score_<numbers>"] "<##> points"
   a[class="hnuser"]
   span[class="age"][title="<isodate>"]
   ...
   a[href="item?id=<numbers>"] "<##> comments"
*/
const now = Date.now();
Array.from(document.querySelectorAll('.subline'))
.forEach(subline=>{
  const tr = subline.closest('tr');
  const age_el = subline.querySelector('.age');
  const age_title = age_el.getAttribute('title');
  const age_text = age_el.textContent;
  const age_ms = now - (new Date(age_title.split(' ')[0] + 'Z')).getTime();
  const age2_ms = textAgeToMS(age_text);
  subline.querySelector('.age').textContent += ' (' + (age_ms / 1000 / 60 / 60).toFixed(2) + 'h)';
  const points_count = (subline.querySelector('.score')?.textContent?.match(/\d+/)||['1'])[0] * 1;
  const comments_count = (subline.querySelector('& > a:last-child')?.textContent?.match(/\d+/)||['1'])[0] * 1;
  subline.style.setProperty('--age', age_ms);
  subline.style.setProperty('--age2', age2_ms);
  subline.style.setProperty('--points', points_count);
  subline.style.setProperty('--comments', comments_count);
})


function textAgeToMS(text) {
	const rx = /^([0-9]+)\s+(\S+)/;
	const match = text.match(rx);
  const secondsDurationsNames = {
		second:  1,
		minute:  1 * 60,
		hour:    1 * 60 * 60,
		day:     1 * 60 * 60 * 24,
		month:   1 * 60 * 60 * 24 * 30,
		year:    1 * 60 * 60 * 24 * 30 * 365,
	};
  const amount = Number(match[1]);
  const unit = match[2].replace(/s$/,'');
  const secondsPerUnit = secondsDurationsNames[unit];
	return 1000 * amount * secondsPerUnit;
}
function msToHours(ms) {
	return ms / 1000 / 60 / 60;
}