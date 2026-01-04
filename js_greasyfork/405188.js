// ==UserScript==
// @name     X (Twitter) - own tweets
// @version  5
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://x.com/*
// @author   monnef
// @description Adds a link to users' pages to search for tweets only from them (no retweets without comment).
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/405188/X%20%28Twitter%29%20-%20own%20tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/405188/X%20%28Twitter%29%20-%20own%20tweets.meta.js
// ==/UserScript==

// config
const debug = false;
const numberOfAttempts = 5;
const workInterval = 1000;
// end of config

const linkMarker = 'monnef--no-retweets';
const dLog = (...xs) => debug && console.log('[OwnTweets]', ...xs);
const state = { lastUrl: null, attempts: 0 };

const insertLink = (nameEl) => {
  if (nameEl.parent().parent().parent().parent().find(`.${linkMarker}`).length) return;
  const handle = nameEl.text();
  const linkEl = $("<a/>")
    .attr('href', `/search?q=from%3A%40${handle.slice(1)}&src=typed_query`)
    .text('[Own Tweets]')
    .addClass(linkMarker)
    .css({
      color: 'rgb(29, 161, 242)',
      marginLeft: '5px'
    })
  ;
  nameEl.parent().parent().after(linkEl);
};

const isHandleEl = (el) => el.length && el.text().startsWith('@');

const tryGetAndProcessNameEl = (x, y) => {
  const nameEl = $(document.elementFromPoint(x, y));
  const handle = nameEl.text();
  dLog('tryGetAndProcessNameEl', x, y, ';nameEl', nameEl, ';handle', handle);
  if (isHandleEl(nameEl)) {
    state.attempts = numberOfAttempts;
    insertLink(nameEl);
    return true;
  } else {
    return false;
  }
}

const work = () => {
  const curUrl = window.location.href;
  if (state.lastUrl === curUrl) {
    state.attempts++;
    if (state.attempts >= numberOfAttempts) {
    	dLog('work - url didn\'t change, skipping');
    	return;
    }
  } else {
    state.attempts = 0;
  }
  dLog('work', curUrl, state.lastUrl, state.attempts);
  state.lastUrl = curUrl;
  const handleEl = $('div[data-testid="UserName"]')
    .find('span')
    .filter((_, el) => $(el).text().trim().startsWith('@'));

  dLog('handleEl', handleEl);
  if (handleEl.length) {
    insertLink(handleEl);
  } else {
    dLog('failed to locate handleEl');
  }
}

$(() => setInterval(work, workInterval))