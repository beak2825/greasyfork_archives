// ==UserScript==
// @name        Reddit - group by subreddit
// @namespace   valacar
// @author      valacar
// @description Group front page posts into groups based on subreddit
// @include     https://www.reddit.com/
// @include     https://www.reddit.com/new/*
// @include     https://www.reddit.com/rising/*
// @include     https://www.reddit.com/controversial/*
// @include     https://www.reddit.com/top/*
// @include     https://www.reddit.com/gilded/*
// @include     https://www.reddit.com/r/all/*
// @include     https://www.reddit.com/r/popular/*
// @include     https://old.reddit.com/
// @include     https://old.reddit.com/new/*
// @include     https://old.reddit.com/rising/*
// @include     https://old.reddit.com/controversial/*
// @include     https://old.reddit.com/top/*
// @include     https://old.reddit.com/gilded/*
// @include     https://old.reddit.com/r/all/*
// @include     https://old.reddit.com/r/popular/*
// @version     0.6
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/12489/Reddit%20-%20group%20by%20subreddit.user.js
// @updateURL https://update.greasyfork.org/scripts/12489/Reddit%20-%20group%20by%20subreddit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function appendStyle(cssString) {
    const parent = document.head || document.documentElement;
    if (parent) {
      const style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.textContent = cssString;
      parent.appendChild(style);
      return style;
    }
    return null;
  }

  appendStyle(`
.groupTitle {
  color: #369;
  font-size: 20px;
  display: inline-block;
  margin-top: 0.5em;
  padding-top: 0;
}
`);

  let myhash = [];
  let keys = [];

  const subredditLinks = document.querySelectorAll('#siteTable .subreddit');

  for (const link of subredditLinks) {
    const subredditName = link.textContent;

    if (!myhash[subredditName]) {
      myhash[subredditName] = [];
      myhash[subredditName + '_link'] = link.href;
      keys.push(subredditName);
    }

    // save .thing block
    myhash[subredditName].push(link.closest('.thing'));
  }

  let appendList = [];

  console.log("keys before:", keys);

  keys = keys.filter(function(x) {
    // TODO: change this to /regex/.test(x) when adding more than one filter
    if (x === 'r/AskReddit') {
      appendList.push(x);
      return false;
    }
    return true;
  });

  console.log("keys after:", keys);
  console.log("append:", appendList);

  keys.sort();

  keys = keys.concat(appendList);

  const sitetable = document.getElementById('siteTable');

  // remove everything inside #siteTable
  while (sitetable.firstChild) {
    sitetable.removeChild(sitetable.firstChild);
  }

  // rebuild #siteTable
  for (const key of keys) {
    // make group title link
    const title = document.createElement('a');
    title.href = myhash[key + "_link"];
    title.classList.add('groupTitle');
    title.innerHTML = key;
    sitetable.appendChild(title);

    // append .thing block
    for (const thing of myhash[key]) {
      sitetable.appendChild(thing);
    }
  }

})();