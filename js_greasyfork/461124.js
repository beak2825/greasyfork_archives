// ==UserScript==
// @name        old-reddit-fenced-codeblocks-fix
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/*
// @match       https://old.reddit.com/*
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @connect     reddit.com
// @require     https://unpkg.com/showdown/dist/showdown.min.js
// @require     https://unpkg.com/@highlightjs/cdn-assets@11.7.0/highlight.min.js
// @sandbox     DOM
// @version     0.3
// @author      KerfuffleV2
// @license     MIT
// @description Fixes triple backquote style code blocks in the old reddit layout and can apply syntax highlighting.
// @downloadURL https://update.greasyfork.org/scripts/461124/old-reddit-fenced-codeblocks-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/461124/old-reddit-fenced-codeblocks-fix.meta.js
// ==/UserScript==

const defaultConfig = {
  // Theme used for highlighting. See https://github.com/highlightjs/highlight.js/tree/main/src/styles
  highlight_theme: 'github-dark-dimmed',
  // Apply syntax highlighting for code blocks.
  highlighting: true,
  // Apply syntax highlighting on plaintext codeblocks (for consistent styling).
  highlight_plaintext: true,
  // Run initially when the page is loaded.
  autorun: true,
  // How long to wait for a comment to load in milliseconds.
  comment_load_timeout: 2500,
}

// See this link for possible options: https://github.com/showdownjs/showdown/wiki/Showdown-Options
const showdownOptions = {
  noHeaderId: true,
  strikethrough: true,
  tables: true,
  encodeEmails: false,
  disableForced4SpacesIndentedSublists: true,
  // Comment the next line if you have issues with spoilers inside code blocks. (Should be unlikely.)
  extensions: ['extRedditSpoilers'],
};

const fencedcodere = /^\s*<\s*p\s*>\s*```(?:\n|.)*?```/mi;
const contentselector = '.thing[data-type="comment"], .thing[data-type="link"]';

// End user adjustable options.


let config = null;
let sd = null;

function handleLoad(resp) {
  if (resp.status !== 200 || !sd) {
    return;
  }
  const pj = JSON.parse(resp.responseText);
  const { thing, typ, utbody } = resp.context;
  const body = typ == 'comment' ? pj[1].data.children[0].data.body : pj[0].data.children[0].data.selftext;
  utbody.innerHTML = `<div class="md">${sd.makeHtml(body)}</div>`;
  if (!config.highlighting) {
    return;
  }
  utbody.querySelectorAll('pre > code').forEach(el => {
    if (!Array.from(el.classList.values()).find(v => v.startsWith('language-'))) {
      if (!config.highlight_plaintext) {
        return;
      }
      el.classList.add('language-plaintext');
    }
    hljs.highlightElement(el);
  });
}

function handleThing(thing) {
  const typ = thing.getAttribute('data-type');
  const url = thing.getAttribute('data-url') ?? '';
  const perma = thing.getAttribute('data-permalink');
  if (!typ || !perma || (typ === 'link' && !url.startsWith('/'))) {
    return;
  }
  const utbody = thing.querySelector('div.usertext-body');
  if (!utbody || !utbody.innerHTML.match(fencedcodere)) {
    return;
  }
  // console.log(`THING(${typ}): URL=${url} -- PERMA=${perma}`);
  GM_xmlhttpRequest({
    method: 'GET',
    url: `${perma}.json?raw_json=1`,
    timeout: config.comment_load_timeout,
    responseType: 'json',
    context: { thing, utbody, typ },
    onload: handleLoad,
  });
}

function go() {
  document.querySelectorAll(contentselector).forEach(handleThing);
}

function loadConfig() {
  config = GM_getValue('config');
  if (!config) {
    config = defaultConfig;
    GM_setValue('config', defaultConfig);
  }
}

function init(){
  loadConfig();
  config.highlighting = config.highlighting && typeof hljs !== 'undefined';
  config.highlight_theme = config.highlight_theme ?? defaultConfig.highlight_theme;
  if (config.highlighting) {
    const cssel = document.createElement('link');
    cssel.setAttribute('rel', 'stylesheet');
    cssel.setAttribute('href', `https://unpkg.com/@highlightjs/cdn-assets@11.7.0/styles/${config.highlight_theme}.min.css`);
    document.head.appendChild(cssel);
  }
  GM_registerMenuCommand('Apply', go);
  GM_registerMenuCommand('Toggle autorun', function () {
    loadConfig();
    config.autorun = !config.autorun;
    GM_setValue('config', config);
    GM_notification({
      title: 'old-reddit-fenced-codeblocks-fix',
      text: `Autorun toggled, now: ${config.autorun ? 'ON' : 'OFF'}`,
    });
  });
  showdown.extension('extRedditSpoilers', function() {
    return [{
      type: 'lang',
      regex: /^(?!^    )([^\n]*?)>! *([^\n]+?) *!</gm,
      replace: "$1 <span class='md-spoiler-text' title='Reveal spoiler'>$2</span>",
    }];
  });
  sd = new showdown.Converter(showdownOptions);
}

init();
config.autorun && go();
