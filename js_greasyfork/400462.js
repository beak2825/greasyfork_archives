// ==UserScript==
// @name     Git Hub - Unroll comments
// @description Adds a button to load (unroll) all "hidden items" (comments).
// @author   monnef
// @version  1
// @match    https://github.com/**
// @grant    none
// @namespace   monnef.eu
// @require  https://cdn.jsdelivr.net/npm/jquery@3.5.0/dist/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/400462/Git%20Hub%20-%20Unroll%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/400462/Git%20Hub%20-%20Unroll%20comments.meta.js
// ==/UserScript==


// settings

const workTime = 500;
const initDelay = 1000;
const scrollingEnabled = true;
const debugLogs = false;

// end of settings

const logPrefix = '[GHUC] ';
const log = (...xs) => console.log(logPrefix, ...xs);
const debug = (...xs) => debugLogs && console.debug(logPrefix, ...xs);

const scrollTo = (_, e) => scrollingEnabled && e.scrollIntoView({behavior: 'smooth', block: 'center'});

const getPagForm = () => $('.ajax-pagination-form');

const getPagBut = () => $('.ajax-pagination-btn');

const clickLoadMore = () => {
  debug('click load more button');
  getPagBut().click();
};

const work = () => {
  if(getPagForm()[0]) {
    const but = getPagBut();
    if (but.text().includes("Loading")) {
      debug("waiting until comments loading finishes...");
      but.each(scrollTo);
    } else {
	    clickLoadMore();
    }
    setTimeout(work, workTime);
  } else {
    debug('pagination form not found, assuming all comments are unrolled');
    $('.js-timeline-item').last().each(scrollTo);
  }
};

const init = () => {
  log('Git Hub - Unroll Comments by monnef is starting...')
  const but = $('<button/>')
    .text('Load all 🧻')
    .attr('title', '[GHUC] Git Hub - Unroll comments by monnef')
    .attr('class', 'btn mt-2')
    .click(() => {
      but.remove();
      work();
    });
  getPagForm().append(but);
  debug('initialized');
};

$(() => setTimeout(init, initDelay));
