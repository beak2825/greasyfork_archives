// ==UserScript==
// @name         AH/QQ/SB/SV Score
// @description  Add self-calibrating (per subforum) score indicator using the (replies/words) and (likes/views) metrics. Add footer toggles [unsorted|autosort] and [show seen|hide seen].
// @version      0.31
// @author       C89sd
// @namespace    https://greasyfork.org/users/1376767
// @match        https://*.alternatehistory.com/*
// @match        https://*.questionablequesting.com/*
// @match        https://*.spacebattles.com/*
// @match        https://*.sufficientvelocity.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546189/AHQQSBSV%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/546189/AHQQSBSV%20Score.meta.js
// ==/UserScript==
'use strict';

// 0 takes the max of both scores
// 1 selects (replies, words)
// 2 selects (likes, views)
const SELECT_SCORE = 0;
const DISPLAY_BOTH = false;
const OPACITY = 0.4; // gray the non selected score.

const WIDTH = 25; // 25px default
const UNDER_ICON = false; // overrides width 18px

const ALIGN_LEFT = true;
const COMPACT    = false;
const CORNER_INDICATOR = true; // false: text; true: colored box
const CORNER_TOP       = true; // true: trop corner, false: MOBILE-only bottom corner
const VERSION = 36;   // change to reset DB
const NMAX    = 1500; // 10 pages change the score by 20%
const LRU_MAX = 300;  // recount a thread after 10 pages

let IS_SEARCH = window.location.href.includes('/search/');
let IS_FORUM  = window.location.href.includes('/watched/') || window.location.href.includes('/forums/');

let site = location.hostname.split('.').slice(-2, -1)[0];
const FORUM_MAP = {
  alternatehistory: {},
  spacebattles: {
    'story-only': 'quests',
    'creative-writing-archives': 'creative-writing',
    'unlisted-original-fiction': 'creative-writing',
    'original-fiction':          'creative-writing',
    'worm':                      'creative-writing',
  },
  sufficientvelocity: {
    'archive': 'user-fiction',
    'quests-archive': 'quests',
  },
  questionablequesting: {
    'story-archive': 'creative-writing',
    'quest-archive': 'questing',
    'nsfw-story-archive': 'nsfw-creative-writing',
    'nsfw-quest-archive': 'nsfw-questing',
  }
}[site];

if (!IS_SEARCH && !IS_FORUM) return;

GM_addStyle(`
  /* hide on dekstop */
   @media (min-width: 650px) {  .structItem--thread>.scoreA { display: none !important; } }

  :root {
    --boost:    85%;
    --boostDM:  75%; /* 82%; */
    --darken:   55%;
    --darkenDM: 33.3%;
  }
  :root.dark-theme {
    --darken: var(--darkenDM);
    --boost:  var(--boostDM);
  }
  .scoreA {
    background-image: linear-gradient(hsl(0, 0%, var(--boost)), hsl(0, 0%, var(--boost))) !important;
    background-blend-mode: color-burn !important;
  }
  .scoreA.darkenA {
    background-image: linear-gradient(hsl(0, 0%, var(--darken)), hsl(0, 0%, var(--darken))) !important;
    background-blend-mode: multiply !important;
  }
`);
const DM = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;
if (DM) document.documentElement.classList.add('dark-theme');

// if (dimmed) { indicator.classList.add('darkenA'); }


const HSL_STRINGS = [
  'hsl(0.0, 90.7%, 92.3%)',
  'hsl(47.8, 67.1%, 81.5%)',
  'hsl(118.4, 51.2%, 85%)',
  'hsl(122.9, 35.1%, 63.4%)',
];
const COLORS = HSL_STRINGS.map(str => (([h, s, l]) => ({ h, s, l }))(str.match(/[\d.]+/g).map(Number)));
function clamp(a, b, x) { return x < a ? a : (x > b ? b : x); }
function color(t, range=1.0, use3colors=false) {
  let a, b;
  t = t/range;
  if (t < 0)   { t = 0.0; }
  if (use3colors && t > 1.0) { t = 1.0; }
  else if (t > 1.5) { t = 1.5; }

  if (t < 0.5) {
    a = COLORS[0], b = COLORS[1];
    t = t * 2.0;
  } else if (t <= 1.0) {
    a = COLORS[1], b = COLORS[2];
    t = (t - 0.5) * 2.0;
  } else {
    a = COLORS[2], b = COLORS[3];
    t = (t - 1.0) * 2.0;
  }
  const h = clamp(0, 360, a.h + (b.h - a.h) * t);
  const s = clamp(0, 100, a.s + (b.s - a.s) * t);
  const l = clamp(0, 100, a.l + (b.l - a.l) * t);
  return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
}



let scale, PT;
const domain = window.location.hostname.split('.').slice(-2, -1)[0].toLowerCase();
PT = 0;

function ncdf(z) {
  let t = 1 / (1 + 0.2315419 * Math.abs(z));
  let d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  if (z > 0) prob = 1 - prob;
  return prob;
}

// #MEASURE_SCALE#
// ----------- INIT
const KEY = 'measure_scale';
let data = JSON.parse(localStorage.getItem(KEY) || '{}');
if (!data.version || data.version !== VERSION) {
    data = {
      version: VERSION,
      streams: {},
      lruBuffer: []
    };
}
const DEFAULT_STREAM = [ /*words/replies*/ { mean: 0, M2: 0, count: 0 }, /*views/likes*/ { mean: 0, M2: 0, count: 0 }];

// console.log(localStorage.getItem(KEY).length / 1024, 'kb')

const lruArray = data.lruBuffer;
while (lruArray.length > LRU_MAX) lruArray.pop(); // cutoff in case LRU_MAX changes

// inserts/moves key to the front, returns if it was already present
function addToLRU(key) {
    const idx   = lruArray.indexOf(key);
    const miss  = idx === -1; // true: key wasn’t there

    if (!miss) lruArray.splice(idx, 1);            // remove old copy
    lruArray.unshift(key);                         // insert at the front
    if (lruArray.length > LRU_MAX) lruArray.pop(); // cutoff

    return miss;
}

function updateStreaming(forum, s, score) {
    if (!(forum in data.streams)) {
      data.streams[forum] = structuredClone(DEFAULT_STREAM);
    }
    const streams = data.streams[forum];
    const stream = streams[s];

    const weight = stream.count < NMAX ? 1 / (stream.count + 1) : 1 / NMAX;
    const delta  = score - stream.mean;

    stream.mean += weight * delta;
    stream.M2    = (1 - weight) * stream.M2 + weight * delta * (score - stream.mean);

    if (stream.count < NMAX) stream.count++;
}

// --- adjusted score 0–100
function adjustedScore(forum, s, score) {
    const streams = data.streams[forum];

    if (!streams) return NaN;
    const stream = streams[s];

    const MEASUREMENT = getMeasurement(stream);
    if (MEASUREMENT.std === 0) return NaN; // avoid division by zero

    const z = (score - MEASUREMENT.mean) / MEASUREMENT.std;
    const p = ncdf(z);
    return Math.min(Math.max(p * 100, 0), 100);
}

function getMeasurement(stream, s) {
  const { mean, M2, count } = stream;
  const std = Math.sqrt(M2);
  return { mean, std, n: count };
}

GM_addStyle(`
  /* Hide on large screens */
  .mscore {
    display: none;
  }
  /* Show on mobile */
  @media (max-width: 650px) {
    .mscore {
      display: block;
    }
    .mscore.mright {
      float: right !important;
    }
    .mscore.mleft.mcompact {
      padding-left: 4px !important;
    }
    .mscore::before { content: none !important; }
    .mscore.mleft:not(.mcompact)::before{ content: "\\00A0\\00B7\\20\\00A0\\00A0" !important; }
  }
`);

const DEBUG = false;

function parseForumMetrics(thread) {
  let threadid = parseInt(thread.className.match(/\bjs-threadListItem-(\d+)/)[1], 10);

  let meta = thread.querySelector(':scope > .structItem-cell--meta');
  if (!meta) { DEBUG && console.log('Scorer skip: no meta cell', thread); return { hasMeta: false }; }


  // Hover replies to see title="First message reaction score: 30"
  // SB/SV: Total likes
  // QQ: First message likes
  let likes = parseInt(meta.getAttribute('title')?.match(/([\d,]+)/)[1].replace(/,/g, ''), 10);

  // Replies
  let replies = parseKmDigit(meta.firstElementChild?.lastElementChild?.textContent);

  let pagesEl = thread.querySelector('.structItem-pageJump a:last-of-type');
  if (pagesEl && pagesEl.textContent.trim() === 'New') { pagesEl = pagesEl.previousElementSibling; }  // on AH, the last page number is a "New" link
  const pages = pagesEl ? parseInt(pagesEl.textContent, 10) : 1;
   // Better estimate of the replies via page count (25 posts per page) above 1k
  if (replies >= 1000) {
    replies = Math.max(replies, Math.floor((pages - 0.5) * 25)); // assume last page is half
  }

  // // Views
  let views = parseKmDigit(meta.firstElementChild?.nextElementSibling?.lastElementChild?.textContent);

  // Words
  // let isThread = !!thread.querySelector('.structItem-parts > li > a[data-xf-click="overlay"]');
  let words = parseKmDigit(thread.querySelector('.structItem-parts > li > a[data-xf-click="overlay"]')?.textContent?.trim().split(' ').pop());
  // let dates = thread.querySelectorAll('time');
  // let first_message = dates[0].getAttribute('data-time');
  // let last_message = dates[1].getAttribute('data-time');

  // let forum = location.pathname.split('/')[2];
  // let title = thread.querySelector('.structItem-title a[href*="/threads/"][data-tp-primary="on"]').textContent;
  // let url = thread.querySelector('.structItem-title a[href*="/threads/"][data-tp-primary="on"]').href;
  // let author = thread.querySelector('.username').textContent;
  // let tags = Array.from(thread.querySelectorAll('.structItem-tagBlock > a')).map(a => a.textContent.trim());

  return {hasMeta: true, threadid, replies, words, likes, views};
}

function parseKmDigit(text) {
    if (!text) return NaN;
    const cleanedText = text.trim().toLowerCase();
    const multiplier = cleanedText.endsWith('k') ? 1000 : cleanedText.endsWith('m') ? 1000000 : 1;
    return parseFloat(cleanedText.replace(/,/g, '')) * multiplier;
}

function slugify(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-');
}


let threads;
// if (IS_FORUM)  threads = document.querySelectorAll('.structItem--thread[class*="js-threadListItem-"]');
if (IS_FORUM)  threads = document.querySelectorAll(
  '.js-threadList>.structItem--thread[class*="js-threadListItem-"],' + // main forum, 'js-threadList' ignores sticky
  '.structItemContainer>.structItem--thread[class*="js-threadListItem-"]' // /watched/threads
);
if (IS_SEARCH) threads = document.querySelectorAll('.block-body > li.block-row');

function getForum(url) { return url?.match(/\/forums\/([^\/]*)\.\d+/)[1]; }

let FORUM;

// -------- pass 1: gather raw data
let rawData = [];

for (const thread of threads) {
    let hasMeta, threadid, replies, words, likes = NaN, views = NaN;

    let forum_in_post; // some posts have links to a subforum
    if (IS_FORUM) {
        ({ hasMeta, threadid, replies, words, likes, views } = parseForumMetrics(thread));
        if (!hasMeta) continue;

        FORUM = getForum(location.href); // DEFAULT, this page
        forum_in_post = slugify(thread.querySelector('.structItem-parts a.labelLink')?.textContent); // not a subforum link but a filter! we slugify ourselves
    }

    if (IS_SEARCH) {
        threadid = parseInt(thread.querySelector('.contentRow-title a[href*="/threads/"]')?.href.match(/\/threads\/[^\/]*?\.(\d+)\//)?.[1], 10);
        words    = parseKmDigit(thread.querySelector('.wordcount')?.textContent);
        const repliesEl = [...thread.querySelectorAll('.contentRow-minor li')].find(li => li?.textContent.trim().startsWith('Replies:'));
        replies  = parseKmDigit(repliesEl?.textContent.split(' ')[1]);

        FORUM = getForum(thread.querySelector('a[href*="/forums/"]')?.href);
        forum_in_post = getForum(thread.querySelector('.contentRow-minor > .listInline > li > a[href*="/forums/"]')?.href); // direct subforum link
    }

    if (forum_in_post) FORUM = forum_in_post;
    FORUM = FORUM_MAP[FORUM] ?? FORUM;

    // -------- independent validity checks
    let score1 = null;
    let score2 = null;

    if (typeof words   === 'number' && !Number.isNaN(words)   && words   >= 10 &&
        typeof replies === 'number' && !Number.isNaN(replies) && replies >= 2) {
        score1 = Math.log1p(replies) - Math.log1p(words);
    }

    if (IS_FORUM &&
        typeof views === 'number' && !Number.isNaN(views) && views >= 100 &&
        typeof likes === 'number' && !Number.isNaN(likes) && likes >= 2) {
        score2 = Math.log1p(likes) - Math.log1p(views);
    }

    rawData.push({ thread, FORUM, score1, score2, threadid, replies, likes });
    // console.log(rawData[rawData.length-1])
}

// -------- pass 2: batch LRU + streaming update
// if (IS_FORUM) {
  for (const d of rawData) {
      if (addToLRU(d.threadid)) {
          if (d.score1 !== null) updateStreaming(d.FORUM, 0, d.score1);
          if (d.score2 !== null) updateStreaming(d.FORUM, 1, d.score2);
      }
  }
// }

// -------- pass 3: adjusted score, rank, indicators, sortData
function round2Decimal(num) { return Math.round(num * 100) / 100; }

let sortData = [], idx = -1;

for (const d of rawData) {
    idx++;
    const { thread, score1, score2, replies, likes } = d;

    let displayScore1 = null;
    if (score1 != null) displayScore1 = adjustedScore(d.FORUM, 0, score1);
    let displayScore2 = null;
    if (score2 != null) displayScore2 = adjustedScore(d.FORUM, 1, score2);

    let displayScore = null;
    if (SELECT_SCORE == 0) {
      if (displayScore1 != null || displayScore2 != null) displayScore = Math.max(displayScore1, displayScore2);
    }
    if (SELECT_SCORE == 1) displayScore = round2Decimal(displayScore1??0.0) + 0.00001*(displayScore2??0);
    if (SELECT_SCORE == 2) displayScore = round2Decimal(displayScore2??0.0) + 0.00001*(displayScore1??0);

    // Sort by score first, then by replies, then likes.
    let rank, sortScore;
    if (displayScore !== null) { rank = 1; sortScore = displayScore; } // sort mixed/fallback at same level in case words were deleted (STUB)
    else if (replies > 1)     { rank = 3; sortScore = replies; }       // fallback replies
    else if (likes   > 1)     { rank = 4; sortScore = likes; }         // fallback likes
    else                      { rank = 5; sortScore = NaN; }           // preserve order; sort has a condition on rank=5 since NaN are not sortable.

    sortData.push({ thread, idx, rank, score: sortScore });

    // MOBILE
    if (CORNER_INDICATOR) {
        let makeIndicator = (score, n, biggest_n=0) => {
            if (score === null) {
              if (IS_FORUM && DISPLAY_BOTH) score = NaN;
              else return null;
            }

            let is_gray = false;
            if (SELECT_SCORE == 0 && n !== biggest_n)    is_gray = true;
            if (SELECT_SCORE != 0 && n !== SELECT_SCORE) is_gray = true;

            let width = 'width:' + WIDTH + 'px';
            if (UNDER_ICON) width = 'width:18px';

            let i = document.createElement('div');
            i.className = 'scoreA';
            i.textContent = isNaN(score) ? '-' : score.toFixed(PT);
            i.style.cssText = [
                'display:block',
                width,
                'text-align:center',
                'line-height:18px',
                'padding:0',
                CORNER_TOP ? 'position:relative' : 'position:absolute',
                'color:rgb(42,42,42)',
                'background:' + color(score / 100, 1, true),
                'float:right',
                n==2 || UNDER_ICON ? 'margin-left:0px' : 'margin-left:4px',
                CORNER_TOP ? 'top:3px' : 'bottom:9px',
                CORNER_TOP ? 'top:3px' : 'right: 9px',
                is_gray ? `filter: opacity(${OPACITY});` : ''
            ].join(';');
            return i;
        };

        const biggest_n = (displayScore1 > displayScore2) ? 1 : 2;

        const indicator = makeIndicator(CORNER_TOP&&DISPLAY_BOTH ? displayScore1 : displayScore, 1, biggest_n);
        thread.style.position = 'relative';

        if (UNDER_ICON) {
          const indicator2 = DISPLAY_BOTH ? makeIndicator(displayScore2, 2, biggest_n) : null;
          const icon = thread.querySelector('.structItem-cell--icon');
          if (indicator2) icon.append(indicator2);
          if (indicator) icon.append(indicator);
        }
        else if (IS_FORUM) {
            const indicator2 = DISPLAY_BOTH ? makeIndicator(displayScore2, 2, biggest_n) : null;

            if (CORNER_TOP) {
                const title = thread.querySelector('.structItem-cell--main');
                title.style.paddingRight = '6px';
                title.style.paddingTop   = '6px';
                title.style.position     = 'relative';
                if (indicator) title.prepend(indicator);
                if (indicator2) title.prepend(indicator2);
            } else {
                if (indicator) thread.append(indicator);
            }

        } else { // IS_SEARCH
            if (indicator) thread.prepend(indicator);
        }
    } else if (IS_FORUM) {
        // DESKTOP indicator
        const desktopScoreEl = document.createElement('dl');
        desktopScoreEl.className = 'pairs pairs--justified structItem-minor';

        const dt = document.createElement('dt');
        dt.textContent = 'Score';

        const dd = document.createElement('dd');
        dd.appendChild(document.createTextNode(displayScore.toFixed(PT)));

        desktopScoreEl.appendChild(dt);
        desktopScoreEl.appendChild(dd);

        const meta = thread.querySelector(':scope > .structItem-cell--meta');
        meta.appendChild(desktopScoreEl);

        // MOBILE under-text indicator (desktop hidden via CSS)
        const mobileScoreEl = document.createElement('div');
        mobileScoreEl.className = 'structItem-cell structItem-cell--latest mscore ' +
            (ALIGN_LEFT ? "mleft" : "mright") + (COMPACT ? " mcompact" : "");
        mobileScoreEl.textContent = displayScore.toFixed(PT);
        mobileScoreEl.style.width = 'auto';

        if (ALIGN_LEFT) thread.insertBefore(mobileScoreEl, thread.querySelector('.structItem-cell--latest') || null);
        else            thread.appendChild(mobileScoreEl);
    }
}

// #MEASURE_SCALE#
localStorage.setItem(KEY, JSON.stringify(data));

// // ----------- VISUALISE
// let MEASUREMENT = getMeasurement();
// console.log(`{ MEASUREMENT = { mean:${MEASUREMENT.mean.toFixed(4)}, std:${MEASUREMENT.std.toFixed(4)}, n:${MEASUREMENT.n} }; }`);


// -------------------------------------------------------------------------------------
// Add footer [sort by score] and [hide seen] selectors.

const DEFAULT_CONFIG = { showSeen: true, showNamed: true, showWatched: true, showALL: true, sortByScore: false };
let config = { ...DEFAULT_CONFIG, ...JSON.parse(localStorage.getItem('_showseen') || '{}') };

// Style injection logic
const style = document.createElement('style');
document.head.appendChild(style);
function updateVisibilityStyles() {
    const base = IS_FORUM ? '.structItem--thread:has(.structItem-title>a' : '.block-row:has(.contentRow-title>a';
    let text = '';
    if (config.showALL) {
        text = '.disabled-look { filter: grayscale(100%); opacity: 0.6; pointer-events: none; }';
    } else {
        if (!config.showSeen)    text += base + '.hl-seen:not(.hl-name-seen):not(.hl-watched)) { display: none !important; }';
        if (!config.showNamed)   text += base + '.hl-name-seen:not(.hl-watched)) { display: none !important; }';
        if (!config.showWatched) text += base + '.hl-watched) { display: none !important; }';
    }
    style.textContent = text;
}

// `sortData` already exists and looks like:
// { thread : <li>,  idx : Number,  rank : 1|2|3|4,  score : Number }
let sorted = false; //
function updateSort () {
  if (sorted === config.sortByScore) return;   // nothing changed
  sorted = config.sortByScore;

  // comparators
  const byRankScoreIdx = (a, b) => {
    if (a.rank  !== b.rank)  return a.rank - b.rank;     // rank 1 beats 2,3,4
    if (a.rank === 5)        return a.idx - b.idx;       // rank 5 keeps old order (NaN score)
    if (a.score !== b.score) return b.score - a.score;   // higher score first
    return a.idx - b.idx;                                // keep old order
  };
  const byIdx          = (a, b) => a.idx - b.idx;        // restore original

  // sort once and redraw
  sortData.sort(sorted ? byRankScoreIdx : byIdx);
  sortData.forEach(({ thread }) => thread.parentElement.appendChild(thread));
}

// Helper function for creating checkboxes
function createCheckbox(name, key, canBeDisabled=false) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = config[key];
    checkbox.addEventListener('change', () => {
        // preserve distance from bottom so the toggled items don't shift the checkbox away from the user's viewport
        const docEl = document.documentElement;
        const distFromBottom = docEl.scrollHeight - window.scrollY - window.innerHeight;

        config[key] = checkbox.checked;
        localStorage.setItem('_showseen', JSON.stringify(config));
        updateVisibilityStyles();

        // restore after layout changes
        requestAnimationFrame(() => {
            const maxScroll = docEl.scrollHeight - window.innerHeight;
            const target = docEl.scrollHeight - window.innerHeight - distFromBottom;
            const newScroll = Math.max(0, Math.min(maxScroll, target));
            window.scrollTo(0, newScroll);
        });
    });

    const labelEl = document.createElement('label');
    if (canBeDisabled) labelEl.classList.add('disabled-look');
    labelEl.style.display = 'flex';
    labelEl.style.alignItems = 'center';
    labelEl.style.gap = '4px';
    labelEl.appendChild(checkbox);
    labelEl.appendChild(document.createTextNode(name));

    return labelEl;
}

// Create checkboxes
const allLabel     = createCheckbox('ALL',     'showALL');
const seenLabel    = createCheckbox('seen',    'showSeen', true);
const namedLabel   = createCheckbox('named',   'showNamed', true);
const watchedLabel = createCheckbox('watched', 'showWatched', true);

// Helper function for creating select elements
function createSelect(options, currentValue, handler) {
    const select = document.createElement('select');
    select.style.width = 'max-content';
    select.innerHTML = options;
    select.value = currentValue;
    select.addEventListener('click', handler);
    select.addEventListener('change', handler);
    return select;
}

// Sorting selector
const sortSelector = createSelect(
    '<option value="false">Unsorted</option><option value="true">Autosort</option>',
    config.sortByScore.toString(),
    () => {
        config.sortByScore = sortSelector.value === 'true';
        localStorage.setItem('_showseen', JSON.stringify(config));
        updateSort();
    }
);

const footer = document.getElementById('footer');
if (footer) {
    let footerInner = footer.querySelector('.p-footer--container, .p-footer-inner');

    updateVisibilityStyles();
    let isUserPage = location.href.includes('/members/') || location.search.includes('c[users]=');
    if (!isUserPage && !IS_SEARCH) updateSort();

    const controlBar = document.createElement('div');
    controlBar.style.width = '100%';
    controlBar.style.paddingTop = '5px';
    controlBar.style.paddingBottom = '5px';
    controlBar.style.display = 'flex';
    controlBar.style.justifyContent = 'center';
    controlBar.style.gap = '10px';
    controlBar.className = 'footer';

    let DM = window.getComputedStyle(document.body).color.match(/\d+/g)[0] > 128;
    let [R, , , A = 1] = getComputedStyle(footer).backgroundColor.match(/[\d.]+/g).map(Number);
    DM = A==1 ? R < 128 : DM;
    if (!DM) controlBar.style.color = '#1d1d1d';

    controlBar.appendChild(sortSelector);
    controlBar.appendChild(allLabel);
    controlBar.appendChild(watchedLabel);
    controlBar.appendChild(namedLabel);
    controlBar.appendChild(seenLabel);

    footer.insertBefore(controlBar, footerInner);
}

