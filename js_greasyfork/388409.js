// ==UserScript==
// @name     BitChute: search video on twitter
// @version  2
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://www.bitchute.com/*
// @author   monnef
// @description Adds links allowing search on Twitter (by title and url) to video detail screen.
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/388409/BitChute%3A%20search%20video%20on%20twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/388409/BitChute%3A%20search%20video%20on%20twitter.meta.js
// ==/UserScript==

const cls = 'tw-link';

const genTwitterSearchURL = str => `https://twitter.com/search?q=${encodeURIComponent(str)}&src=typed_query`;

const pipe = (...args) => {
  const [input, ...fs] = args;
  return fs.reduce((acc, x) => x(acc), input);
}


const chopVideoLink = x => x.replace(/\/\?.*/, '');

const work = () => {
  const titleEl = $('#video-title');
  if (titleEl.hasClass(cls)) { return; }
  titleEl.addClass(cls);
  const pubDateEl = $('.video-publish-date');
  const linkAddressByTitle = genTwitterSearchURL(titleEl.text());
  const linkAddressByURL = genTwitterSearchURL(pipe(document.location.href, chopVideoLink));
  const titleSearchEl = $('<a/>').text('title').attr('target', '_blank').attr('href', linkAddressByTitle);
  const urlSearchEl = $('<a/>').text('URL').attr('target', '_blank').attr('href', linkAddressByURL);
  const el = $('<div>').text('Search on Twitter: ').append(titleSearchEl).append(' / ').append(urlSearchEl);
  pubDateEl.after(el);
};

$(() => setInterval(work, 1000));
