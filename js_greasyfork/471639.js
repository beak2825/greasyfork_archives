// ==UserScript==
// @name        Custom Logo picker for twitter.com
// @namespace   Itsnotlupus Industries
// @match       https://*.twitter.com/*
// @match       https://*.x.com/*
// @version     4.1
// @author      Itsnotlupus
// @license     MIT
// @description We've got birds! old birds, new birds, even pigeons! new competitors, dead competitors, federated competitors!
// @icon        https://abs.twimg.com/favicons/twitter.2.ico
// @require     https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @require     https://greasyfork.org/scripts/471000-itsnotlupus-i18n-support/code/i18n.js
// @run-at      document-start
// @resource    old_twitter_favicon https://i.imgur.com/74OBSr6.png
// @resource    old_twitter_favicon_dot https://i.imgur.com/Yr0Gl7L.png
// @resource    older_twitter_logo https://i.imgur.com/NTT40TK.png
// @resource    older_twitter_favicon https://i.imgur.com/SYEM2RA.png
// @resource    older_twitter_favicon_dot https://i.imgur.com/VEnAuI0.png
// @resource    pigeon_logo https://i.imgur.com/CUspx8m.gif
// @resource    bluesky_logo https://i.imgur.com/fEq4EKr.png
// @resource    bluesky_favicon https://i.imgur.com/nCi5pTh.png
// @resource    threads_favicon https://i.imgur.com/Bv9o1px.png
// @resource    mastodon_favicon https://i.imgur.com/nKmYnXd.png
// @resource    parler_favicon https://i.imgur.com/hc5ccuN.png
// @resource    truthsocial_logo https://i.imgur.com/glC142w.png
// @resource    reddit_favicon https://i.imgur.com/oZcNyNR.png
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addValueChangeListener
// @grant       GM_getResourceURL
// @grant       GM_addElement
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/471639/Custom%20Logo%20picker%20for%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/471639/Custom%20Logo%20picker%20for%20twittercom.meta.js
// ==/UserScript==

/* jshint esversion:11 */
/* jshint -W083 */
/* eslint no-return-assign:0, no-loop-func:0 */
/* global i18n, t, $, $$, $$$, observeDOM, untilDOM, sleep, until, crel, memoize, events, fastDebounce */
/* human  it's fine, it's fine, I promise. */

// utilities
const res = memoize(id => GM_getResourceURL(id)); // ensure we get the same URL for the same id. it helps with stuff.
const fav = memoize(id => GM_getResourceURL(id, false)); // favicons can't be blob: URIs. fine.
const mkNode = html => crel('div', { innerHTML: html}).firstChild;
const cssVars = o => Object.keys(o).forEach(k=>document.documentElement.style.setProperty(k,o[k]));
const testCSSHasSelector = () => { try { $`body:has(*)`; return true } catch { return false } }

// Localizable strings
const strings = {
  logo_menu_label: "Open/Close Logo Menu",
  toggle_branding_changes: "Enable/Disable Brand Changes"
};

// Boring Pre-Musk branding.
const brand = { site: 'Twitter', action: 'Tweet', item: 'Tweet', items: 'Tweets', reaction: 'Retweet', reactions: 'Retweets' };
// Commonly found logos
const X_PATH = "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z";
const BIRD_PATH = "M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z";
// Cheap way to identify uncorrected logos. Twitter currently uses a mix of both of those.
const legacyLogosSelector = [
  `svg:not([class*="hidden"]):not([class*="twitter-x"]) path[d="${X_PATH}"]`,
  `svg:not([class*="hidden"]):not([class*="twitter-bird"]) path[d="${BIRD_PATH}"]`
].join();

const LOGOS_CUTOFF = 4; // The first 4 logos are or were Twitter logos. The rest, well..
const LOGOS = [
  {
    // visionary new X logo
    label: "𝕏",
    brand: { site: "X", action: "eXecrate", item: 'eXecration', items: "eXecrations", reaction: "ReeXecrate", reactions: "ReeXecrations" },
    html: `<svg viewBox="0 0 24 24" aria-hidden="true" class="twitter-x"><path d="${X_PATH}"></path></svg>`,
    favicon: "https://abs.twimg.com/favicons/twitter.3.ico",
    faviconDot: "https://abs.twimg.com/favicons/twitter-pip.3.ico"
  },
  {
    // old twitter bird logo
    label: "Twitter",
    brand,
    html: `<svg viewBox="0 0 24 24" aria-hidden="true" class="twitter-bird"><path d="${BIRD_PATH}"></path></svg>`,
    favicon: "https://abs.twimg.com/favicons/twitter.2.ico",
    faviconDot: "https://abs.twimg.com/favicons/twitter-pip.2.ico",
  },
  { // even older twitter bird logo
    label: "Old Twitter",
    brand,
    html: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="twitter-bird" viewBox="0 0 380 380"><defs><linearGradient id="d"><stop offset="0%" stop-color="#157bab"></stop><stop offset="100%" stop-color="#599dd1"></stop></linearGradient><linearGradient xlink:href="#d" id="e" x1="0" x2="0" y1="0" y2="1" gradientTransform="rotate(154 1 1)" gradientUnits="objectBoundingBox"></linearGradient></defs><path d="M180 137c12-38 27-63 44-81 13-13 20-18 12-3l12-8c21-10 20-2 5 7 39-14 38 4-3 13 33 1 70 22 80 68 1 6 0 6 6 7 14 2 27 2 40-2-1 10-14 16-33 20-8 1-9 1 0 3 10 2 22 3 35 2-10 12-26 18-45 18-12 44-40 76-75 96-83 47-203 40-263-45 40 31 98 38 142-6-29 0-36-21-14-32-21-1-35-7-42-20-4-4-4-5 1-8 6-4 13-6 21-6-22-7-36-18-40-34-2-5-2-5 3-6l18-2c-18-11-28-24-31-38-2-14 0-10 10-6 45 17 90 36 117 63z" style="fill:url(#e)"></path></svg>`,
    favicon: fav`old_twitter_favicon`,
    faviconDot: fav`old_twitter_favicon_dot`
  },
  { // antediluvian twitter bird logo
    label: "Older Twitter",
    brand,
    html: `<img class="twitter-classic" src="${res`older_twitter_logo`}">`,
    logo: res`older_twitter_logo`,
    favicon: fav`older_twitter_favicon`,
    faviconDot: fav`older_twitter_favicon_dot`
  },
  // From the shallow end of nostalgia to the deep end.
  // Those logos are only shown in the dropdown if you press the `Shift` key while opening it.
  // Great care was taken in researching proper branding for each one.
  {
    label: "Pigeon",
    brand: { site: 'Pigeon', action: 'Coo', item: 'Coo', items: 'Coos', reaction: 'Grunt', reactions: 'Grunts' },
    html: `<img class="twitter-classic" src="${res`pigeon_logo`}">`,
    logo: res`pigeon_logo`,
    favicon: fav`pigeon_logo`
  },
  {
    label: "Bluesky",
    brand: { site: 'Bluesky', action: 'Skeet', item: 'Skeet', items: 'Skeets', reaction: 'Reskeet', reactions: 'Reskeets' },
    html: `<img class="twitter-classic" src="${res`bluesky_logo`}">`,
    logo: res`bluesky_logo`,
    favicon: fav`bluesky_favicon`
  },
  {
    label: "Threads",
    brand: { site: 'Threads', action: 'Post', item: 'Post', items: 'Posts', reaction: 'Repost', reactions: 'Reposts' },
    html: `<svg xmlns="http://www.w3.org/2000/svg" class="threads-squiggly" viewBox="0 0 192 192"><path d="m142 89-3-1c-1-27-16-43-41-43h-1c-15 0-27 6-35 18l14 9a24 24 0 0 1 21-10c9 0 15 2 19 7 3 3 5 8 6 14-7-1-15-2-24-1-24 1-39 15-38 34 1 10 5 19 14 24 7 5 16 7 25 6 13 0 23-5 29-14 6-6 9-15 10-26 6 4 11 9 13 14 4 10 4 26-8 39-12 11-25 16-46 16-23 0-40-7-51-22a93 93 0 0 1-16-57c0-25 5-44 16-57 11-15 28-22 51-22s41 7 52 22c6 7 10 16 13 26l16-4c-3-13-9-24-16-33A80 80 0 0 0 97 0C69 0 47 10 33 28 20 44 13 67 13 96s7 52 20 68c14 18 36 28 64 28 25 0 43-7 57-21a50 50 0 0 0-12-82Zm-44 41c-10 0-21-5-21-15-1-7 5-15 22-16a101 101 0 0 1 23 1c-2 25-13 29-24 30Z"></path></svg>`,
    favicon: fav`threads_favicon`
  },
  {
    label: "Mastodon",
    brand: { site: 'Mastodon', action: 'Toot', item: 'Toot', items: 'Toots', reaction: 'Retoot', reactions: 'Retoots' },
    html: `<svg xmlns="http://www.w3.org/2000/svg" class="twitter-bird" viewBox="0 0 75 79"><path fill="url(#a)" d="M74 17C73 9 65 2 57 1L36 0 19 1C11 2 3 8 1 17L0 30l1 19 2 12c2 7 9 13 16 16a43 43 0 0 0 26 0l6-2v-7c-5 2-10 2-15 2-9 0-12-4-12-6a19 19 0 0 1-1-5c5 2 10 2 15 2h4l15-1h1c7-2 15-7 16-19V17Z"></path><path fill="#fff" d="M61 27v21h-8V28c0-5-2-7-6-7s-6 3-6 8v11h-8V29c0-5-2-8-6-8s-5 2-5 7v20h-9V27c0-4 1-8 4-10 2-3 5-4 9-4s7 2 9 5l2 3 2-3c3-3 6-5 10-5s7 1 9 4c2 2 3 6 3 10Z"></path><defs><linearGradient id="a" x1="37.1" x2="37.1" y1="0" y2="79" gradientUnits="userSpaceOnUse"><stop stop-color="#6364FF"></stop><stop offset="1" stop-color="#563ACC"></stop></linearGradient></defs></svg>`,
    favicon: fav`mastodon_favicon`
  },
  {
    label: "Parler",
    brand: { site: 'Parler', action: 'Twat', item: 'Twat', items: 'Twats', reaction: 'Echo', reactions: 'Echoes' },
    html: `<svg xmlns="http://www.w3.org/2000/svg" class="twitter-bird" viewBox="0 0 500 500"><g clip-path="url(#c)"><path fill="url(#b)" d="M200 300v-50h100a50 50 0 0 0 0-100H0C0 67 67 0 150 0h150a200 200 0 1 1 0 400c-55 0-100-45-100-100Zm-50 50V200C67 200 0 267 0 350v150c83 0 150-67 150-150Z"></path></g><defs><linearGradient id="b" x1="0" x2="500" y1="0" y2="500" gradientUnits="userSpaceOnUse"><stop stop-color="#892E5E"></stop><stop offset="1" stop-color="#E90039"></stop></linearGradient><clipPath id="c"><path fill="#fff" d="M0 0h1646v500H0z"></path></clipPath></defs></svg>`,
    favicon: fav`parler_favicon`,
    dot: "#77f"
  },
  {
    label: "Truth Social",
    brand: { site: 'Truth Social', action: 'Truth', item: 'Truth', items: 'Truths', reaction: 'ReTruth', reactions: 'ReTruths' },
    html: `<img class="twitter-classic" src="${res`truthsocial_logo`}">`,
    logo: res`truthsocial_logo`,
    favicon: fav`truthsocial_logo`
  },
  {
    label: "Reddit",
    brand: { site: 'Reddit', action: 'Spez', item: 'Spez', items: 'Spezz', reaction: 'Respez', reactions: 'Respezz' },
    html: `<svg class="twitter-bird" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 810 810"><circle cx="406.6" cy="405.6" r="402.3" fill="#ff4500"></circle><path d="M675 406a59 59 0 0 0-99-41c-46-31-100-48-155-49l26-126 86 18a40 40 0 1 0 5-24l-98-20c-7-1-14 3-15 10l-30 139c-56 1-111 18-157 50a59 59 0 1 0-65 96v18c0 90 105 163 235 163s234-73 234-163v-18c21-10 33-31 33-53zm-402 40a40 40 0 0 1 80 0 40 40 0 0 1-80 0zm233 111c-28 21-63 32-99 31-36 1-71-10-100-31-3-5-3-12 2-16 4-3 10-3 14 0 24 18 54 27 84 26 30 1 59-7 84-25 4-4 11-4 16 0s4 12-1 16v-1zm-7-69a40 40 0 0 1 0-81c22 0 40 18 40 40 1 23-16 41-38 42h-2v-1z" fill="#fff"></path></svg>`,
    favicon: fav`reddit_favicon`,
    dot: "#77f"
  }
];

const MY_CSS = `
header[role="banner"] h1[role="heading"] {
  flex-direction: row;
}
header[role="banner"] h1[role="heading"]:hover .logo-dropdown-arrow,
header[role="banner"] h1[role="heading"] a:active + .logo-dropdown-arrow,
body.logo-dropdown-open .logo-dropdown-arrow {
  opacity: 1;
}
.logo-dropdown-anchor {
  height: initial !important;
}
.logo-dropdown-arrow {
  opacity: 0;
  transition: all 250ms;
  width: 20px;
  height: 20px;
  line-height: 22px;
  margin-right: -20px;
  text-align: center;
  color: var(--twitter-icon-color);
  border-radius: 9px;
  background: var(--twitter-bg-color);
}
.logo-dropdown-arrow:hover {
  background: var(--icon-hover-bg);
}
.logo-dropdown-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0);
}
.logo-dropdown {
  position: fixed;
  width: 3rem;
  background: var(--twitter-bg-color);
  padding: 0.5em;
  border-radius: 5px;
  box-shadow: var(--dropdown-box-1) 0px 0px 15px, var(--dropdown-box-2) 0px 0px 3px 1px;
}
.logo-dropdown-item {
  cursor: pointer;
  height: 2rem;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 8px;
  transition: all 250ms;
  border-radius: 999px;
}
.logo-dropdown-item:hover, .logo-dropdown-item:focus {
  background: var(--icon-hover-bg);
}

/* custom CSS for each logo */
.twitter-x {
  height: 2rem;
  -ms-flex-positive: 1;
  -webkit-box-flex: 1;
  -webkit-flex-grow: 1;
  flex-grow: 1;
  color: var(--twitter-icon-color);
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  vertical-align: text-bottom;
  position: relative;
  max-width: 100%;
  fill: currentcolor;
  display: inline-block;
}

/* can probably be used with any SVG logo */
.twitter-bird {
  height: 2rem;
  color: rgba(29,155,240,1.00) !important;
  vertical-align: text-bottom;
  position: relative;
  max-width: 100%;
  fill: currentcolor;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  pointer-events: none;
}

/* can probably be used with any bitmap logo */
.twitter-classic {
  max-width: 2rem;
  vertical-align: text-bottom;
  position: relative;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  display: inline-block;
  pointer-events: none;
}

.threads-squiggly {
  height: 2rem;
  fill: var(--twitter-icon-color);
}

.hidden {
  display: none !important;
}
`;

class CustomLogoPicker {
  // Which logo is currently shown
  logo = {};
  // Whether silly branding should be shown
  branding = true;
  // A flag to pick a faster path where possible
  canUseHasSelector = testCSSHasSelector(); // :has() selector. useful, but not super well supported yet.

  constructor() {

    this.initI18N();

    this.applyState();
    this.applyFavicon();
    this.applyLogo();

    // insert styles. because this runs very early, document.head may be null.
    untilDOM("head").then(head=> head.prepend(crel('style', { textContent: MY_CSS })));

    // setup event listeners
    GM_addValueChangeListener("logo", this.stateChangeListener);
    GM_addValueChangeListener("branding", this.stateChangeListener);
    observeDOM(fastDebounce(this.DOMChangeListener));
    events({ keypress: this.keyPressListener });

    // start our threads
    this.runThemeWatcher();
    this.runDesktopDropdownWatcher();
    this.runMobileDropdownWatcher();
    this.runKeyboardShortcutDialogWatcher();
  }

  async initI18N() {
    await i18n.init({ strings });
    GM_registerMenuCommand(t`toggle_branding_changes`, () => {
      GM_setValue('branding', !GM_getValue("branding", true));
      this.DOMChangeListener();
    });
  }

  applyState() {
    const logoLabel = GM_getValue("logo")?.label ?? "Twitter";
    const l = LOGOS.find(logo => logo.label === logoLabel) ?? LOGOS[1];
    this.branding = GM_getValue("branding", true);
    this.applyBrand(this.logo.brand ?? brand, l.brand ?? brand);
    this.logo = l;
  }

  async applyFavicon () {
    const hasNotification = document.title[0] == "(";
    let icon = this.logo.favicon;
    if (hasNotification) {
      if (!this.logo.faviconDot) {
        // slap a dot on the favicon
        const img = await new Promise(r => crel('img', { src: icon, onload: e=>r(e.target) }));
        const { width, height } = img;
        const canvas = crel('canvas', { width, height });
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        ctx.fillStyle = this.logo.dot ?? "red";
        ctx.arc(width*3/4, height/4, width/5, 0, Math.PI*2);
        ctx.fill();
        this.logo.faviconDot = canvas.toDataURL();
      }
      icon = this.logo.faviconDot;
    }
    $$`link[rel="shortcut icon"],link[rel="icon"]`.forEach(link => {
      if (link.href !== icon) link.href = icon;
    });
  }

  applyLogo() {
    if (!this.logo.html) return;
    // initial sweep of legacy logos
    $$(legacyLogosSelector).forEach(path=> {
      const svg = path.closest`svg`;
      this.replaceLegacyLogo(svg, svg.getAttribute("class") ?? '');
    });
    // further updates of legacy logos when user picks another logo
    $$`.legacy-logo`.forEach(l => {
      if (l.outerHTML.replace(/ (data-class|class|style|id)=".*?"/g,'') !== this.logo.html.replace(/ (class|style|id)=".*?"/g,'')) {
        this.replaceLegacyLogo(l, l.dataset.class);
      }
    });
    // special case primary logos on various other twitter pages
    const l = ($`.twtr-grid [aria-label$=" home"]` ?? $`.logo-title .logo` ?? $`[class$="_twitter-logo"]`)?.firstElementChild;
    if (l && !l.classList.contains('hidden') && l.outerHTML !== this.logo.html) {
      l.classList.add('hidden');
      if (this.logo.logo) {
        l.after(GM_addElement('img', { class: 'twitter-classic legacy-logo', src: this.logo.logo }))
      } else {
        const logoElt = mkNode(this.logo.html);
        logoElt.classList.add("legacy-logo");
        l.after(logoElt);
      }
    }
    // on Mobile, logos can disappear, and we need to keep up.
    $$`.legacy-logo`.forEach(l => {
      const previous = l.previousElementSibling;
      if (!previous || !previous.classList.contains("hidden")) {
        l.remove();
      }
    });
  }

  applyBrand(from, to) {
    // the silly branding variants only make sense in English, don't butcher other languages.
    const isEnglish = /^en([-_].*)?$/i.test(document.documentElement.lang);
    if (!this.branding) {
      // force default brand instead of our silly variants
      to = brand;
    }
    // nothing more confusing than a logo that doesn't match its copy. let's help!
    if (!to) return;

    // avoid querying the DOM separately for each word. tweak things to find and replace all words in one shot.
    const dict = { X: to.site, Post: to.action, Repost: to.reaction }; // X shenanigans to keep up with Elon's evolving non-sense.

    (isEnglish?["site","reactions","reaction","items","item","action"]:["site"]).forEach(key => {
      const word = from[key], betterWord = to[key];
      if (!word || !betterWord || word == betterWord) return;
      dict[word] = betterWord;
    });
    const keys = Object.keys(dict);
    if (keys.length==0) return;
    const regexp = new RegExp('\\b'+keys.join('\\b|\\b')+'\\b','g');

    // non-trivial Xpath evaluations are slow. matching CSS selectors, even with additional JS filters are often much faster.
    (this.canUseHasSelector
     ? [...$$`:is(div,span,title,a,b,button,h1,h2,p):not(:has(> *))`]
         .filter(e=>!e.closest`article[data-testid="tweet"],div[data-testid^="User"]`)
     : [...$$`div,span,title,a,b,button,h1,h2,p`]
         .filter(e=>!e.childElementCount && !e.closest`article[data-testid="tweet"],div[data-testid^="User"]`)
    )
      .filter(e => e.textContent.match(regexp))
      .forEach(elt => this.replaceBrandWord(elt, regexp, dict));
    $$$(`//span[text()="${keys.join('" or text()="')}"]`)
      .filter(e => !e.closest`[data-testid="tweetText"`)
      .forEach(elt => this.replaceBrandWord(elt, regexp, dict));
    $$(`[placeholder*="${keys.join('"],[placeholder*="')}"]`)
      .forEach(elt => {
        const newText = elt.placeholder.replace(regexp, w => dict[w]);
        if (elt.placeholder !== newText) elt.placeholder = newText;
      });
  }

  /** utility method to traverse a DOM subtree, look for text node matching a regexp, and replace matches with a dictionary */
  replaceBrandWord(elt, regexp, dict) {
    // update text without damaging the DOM tree.
    if (elt.childNodes.length>0) {
      elt.childNodes.forEach(e => this.replaceBrandWord(e, regexp, dict));
    } else {
      const newText = elt.textContent.replace(regexp, w => dict[w]);
      if (elt.textContent !== newText) elt.textContent = newText;
    }
  }

  /** utility method to replace a logo with the currently chosen logo (and carry some classes on the replacement logo) */
  replaceLegacyLogo(oldLogo, classes) {
    const logoElt = this.logo.logo ? GM_addElement('img', { class: 'twitter-classic', src: this.logo.logo }) : mkNode(this.logo.html);
    if (oldLogo.classList.contains("legacy-logo")) {
      // it's one of ours, safe to blow up
      oldLogo.replaceWith(logoElt);
    } else {
      // this may be a React node. hide but don't destroy.
      oldLogo.classList.add('hidden');
      oldLogo.after(logoElt);
    }
    logoElt.dataset.class = classes;
    logoElt.setAttribute('class', logoElt.getAttribute('class') + ' ' + classes + ' legacy-logo');
    logoElt.setAttribute('style', "max-height: initial;max-width:999px;padding: 0 10px");
  }

  /** show the logo dropdown anchored to the logo, in front of an invisible backdrop (to catch clicks), and hook pointer, key and focus events */
  openLogoDropDown(full, focus) {
    if (!$`.logo-dropdown-anchor`) return;
    let index = LOGOS.findIndex(l => this.logo.label === l.label);
    if (index==-1) index = 0;
    if (index >= LOGOS_CUTOFF) full = true;
    const disconnect = observeDOM(() => {
      const { bottom, left } = $`.logo-dropdown-anchor`.getBoundingClientRect();
      const dropdown = $`.logo-dropdown`;
      if (dropdown.style.top !== `${bottom}px`) dropdown.style.top = `${bottom}px`;
      if (dropdown.style.left !== `${left}px`) dropdown.style.left = `${left}px`;
    });
    const cleanupEventListener = events({
      keydown(e) {
        const a = document.activeElement, active = a.parentElement == dropdown ? a : dropdown.childNodes[index];
        switch (e.code) {
          case 'Escape': backdrop.parentElement && backdrop.click(); e.preventDefault(); break;
          case 'ArrowUp': active.previousSibling?.focus(); e.preventDefault(); break;
          case 'ArrowDown': active.nextSibling?.focus(); e.preventDefault(); break;
        }
      }
    });
    const backdrop = crel('div', {
      className: "logo-dropdown-backdrop",
      ariaHaspopup: "true",
      ariaControls: "menu",
      onclick() {
        disconnect();
        backdrop.remove();
        dropdown.remove();
        document.body.classList.remove('logo-dropdown-open');
        cleanupEventListener();
      }
    });
    const dropdown = crel('div', {
      className: "logo-dropdown",
      role: "menu",
      ariaLabel: 'Logo Picker',
      tabIndex: "-1",
    }, ...LOGOS.slice(0,full?void 0:LOGOS_CUTOFF).map(l => crel('div', {
      className: 'logo-dropdown-item',
      role: "menuitem",
      ariaLabel: l.label,
      title: l.label,
      tabIndex: "0",
      onclick() {
        backdrop.click();
      },
      onfocus: () => {
        this.applyBrand(this.logo.brand ?? brand, l.brand ?? brand);
        this.logo = l;
        GM_setValue("logo", {label: this.logo.label}); // don't store more than needed.
      },
      onkeypress(e) {
        if (e.code == "Enter" || e.code =="Space") {
          e.target.click();
          e.preventDefault();
        }
      }
    }, l.logo ? GM_addElement('img', { class: "twitter-classic", src: l.logo}): mkNode(l.html))));
    document.body.append(backdrop, dropdown);
    document.body.classList.add('logo-dropdown-open');
    if (focus) dropdown.childNodes[index].focus();
  }

  // # Event Listeners

  /** this fires where stored userscript data has changed (ie the logo or some settings have changed from another tab) */
  stateChangeListener = () => {
    this.applyState();
    this.DOMChangeListener();
  };

  /** this fires where the DOM has changed. it is also called manually in places where an update is needed. */
  DOMChangeListener = () => {
    this.applyFavicon();
    this.applyLogo();
    this.applyBrand(brand, this.logo.brand);
  };

  /** this fires when a key is pressed. this is used to react to the "Q" key being pressed. */
  keyPressListener = e => {
    const a = document.activeElement;
    if (a.contentEditable == 'true' || a.tagName == 'INPUT' || a.tagName == 'TEXTAREA') return;
    if (e.code == 'KeyQ') {
      if ($`.logo-dropdown`) {
        $`.logo-dropdown-backdrop`?.click();
      } else {
        this.openLogoDropDown(e.shiftKey, true);
      }
    }
  };

  // # Threads - methods that never return, typically watching and reacting to some changes.

  /** detect a theme change (Twitter's white/dim/black, or even extensions like Dark Reader messing with it.) */
  async runThemeWatcher() {
    const bodyStyles = getComputedStyle(await until('body'));
    while (true) {
      var bgColor = await until((bg = bodyStyles.backgroundColor) => bg !== bgColor && bg);
      const isDarkMode = bgColor.replace(/[rgba( )]+/g,'').split(',').reduce((v,a)=>+a+v, 0) < 255;
      cssVars({
        "--twitter-bg-color": bgColor,
        "--twitter-icon-color": isDarkMode ? "#d6d9db" : "#242e36",
        "--icon-hover-bg": isDarkMode ? "rgba(239, 243, 244, 0.1)" : "rgba(15, 20, 25, 0.1)",
        "--dropdown-bg-color": isDarkMode ? "#111" : "#fff",
        "--dropdown-box-1": isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(101, 119, 134, 0.2)",
        "--dropdown-box-2": isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(101, 119, 134, 0.15)"
      })
    }
  }

  /** install a dropdown arrow next to the logo and hook some events */
  async runDesktopDropdownWatcher() {
    while (true) {
      const heading = await untilDOM(`header[role="banner"] h1[role="heading"]`);
      heading.append(crel('a', {
        className: "logo-dropdown-arrow logo-dropdown-anchor",
        textContent: '▾',
        onclick: e => this.openLogoDropDown(e.shiftKey)
      }));
      const logo = heading.firstChild;
      const cleanupEventListener = events({
        keypress: e => {
          if (e.code == 'Space' || e.code == 'Enter') {
            this.openLogoDropDown(e.shiftKey, true);
            e.preventDefault();
          }
        }
      }, logo);

      logo.tabIndex = "0";
      // wait until our dropdown gets wiped by React, and reapply our tweaks
      await untilDOM(()=>!$`.logo-dropdown-anchor`);
      cleanupEventListener();
    }
  }

  /** hook single tap and long press events on the mobile logo to show our dropdown */
  async runMobileDropdownWatcher() {
    while (true) {
      const logo = await untilDOM(() => $`[data-testid="TopNavBar"] :not([role="button"]) > div > svg`?.parentElement);
      logo.classList.add("logo-dropdown-anchor");
      let longPressTimer;
      const cleanupEventListeners = events({
        touchstart: () => {
          longPressTimer = setTimeout(() => this.openLogoDropDown(true), 500);
        },
        touchend(e) {
        clearTimeout(longPressTimer);
          if ($`.logo-dropdown`) {
            e.preventDefault();
            e.stopPropagation();
          }
        },
        click: e => {
          this.openLogoDropDown()
          e.stopImmediatePropagation();
        },
        contextmenu(e) { e.preventDefault() }
      }, logo);
      // wait until React wipes us out to reapply our tweaks
      await untilDOM(()=>!$`.logo-dropdown-anchor`);
      // `logo` isn't our node, clean up.
      cleanupEventListeners();
    }
  }

  /** wait for the Keyboard Shortcut list to show up, and inject our shortcut in it. */
  async runKeyboardShortcutDialogWatcher() {
    while (true) {
      // wait until something we see that has the shape of a keyboard shortcut modal, and grab the last "Actions" shortcut from it.
      // this unwiedly selector looks for the spot we want in desktop mode first, then in mobile device mode.
      const lastActionsRow = await untilDOM(`
        #layers [role="dialog"][aria-labelledby] [data-viewportview]>div:last-child>div:nth-child(2) [role="row"]:last-child,
        main[role="main"] div>div>div:last-child>div:nth-child(2) [role="row"]:last-child`);
      const label = lastActionsRow.innerText.split('\n')[0];
      if (label == t`logo_menu_label`) { // we already have our shortcut label shown. chill.
        await sleep(500);
        continue;
      }
      // clone, customize and insert our own action shortcut.
      const newRow = lastActionsRow.cloneNode(true);
      $('span', newRow).textContent = t`logo_menu_label`;
      $('[role="cell"]>div', newRow).textContent = 'q';
      lastActionsRow.after(newRow);
    }
  }
}

const main = new CustomLogoPicker();
