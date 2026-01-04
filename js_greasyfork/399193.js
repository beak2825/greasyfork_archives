// ==UserScript==

// @name        Reddit force local search

// @description Force search in subreddit by default

// @namespace   https://www.reddit.com/

// @match       https://www.reddit.com/*

// @grant       none

// @version     1.0

// @author      r/KaKi_87

// @downloadURL https://update.greasyfork.org/scripts/399193/Reddit%20force%20local%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/399193/Reddit%20force%20local%20search.meta.js
// ==/UserScript==

const form = document.querySelector('#SearchDropdown form');

const getInput = () => document.querySelector('#header-search-bar');

const getSubreddit = () => {
  
  const path = window.location.href.split('/');
  
  return path[3] === 'r' ? path[4] : undefined;
  
};

const handler = event => {
  
  const
  
    query = getInput().value,
        
    subreddit = getSubreddit();
  
  if(!subreddit) return;
  
  event.stopPropagation();

  event.stopImmediatePropagation();

  event.preventDefault();

  window.location.href = `https://www.reddit.com/r/${subreddit}/search?q=${query}&restrict_sr=1`;
  
};

form.addEventListener('submit', handler, true);

const loop = () => {
  
  const subreddit = getSubreddit();
  
  const input = getInput();
  
  input.setAttribute('placeholder', subreddit ? `Search in r/${subreddit}` : 'Search');
  
  setTimeout(loop, 250);
  
};

loop();