// ==UserScript==
// @name        Usability Tweaks for Manga sites.
// @namespace   Itsnotlupus Industries
// @match       https://asura.gg/*
// @match       https://asura.nacm.xyz/*
// @match       https://flamescans.org/*
// @match       https://void-scans.com/*
// @match       https://luminousscans.com/*
// @match       https://shimascans.com/*
// @match       https://nightscans.org/*
// @match       https://freakscans.com/*
// @match       https://reaperscans.fr/*
// @match       https://manhwafreak.com/*
// @match       https://manhwa-freak.com/*
// @match       https://manhwafreak-fr.com/*
// @match       https://realmscans.to/*
// @match       https://mangastream.themesia.com/*
// @match       https://manga-scans.com/*
// @match       https://mangakakalot.so/*
// @match       https://reaperscans.com/*
// @noframes
// @version     2.8
// @author      Itsnotlupus
// @license     MIT
// @description Keyboard navigation, inertial drag scrolling, page rotation, chapter preloading and chapter tracking for MangaStream sites, like Asura Scans, Flame Scans, Void Scans, Luminous Scans, Shima Scans, Night Scans, Freak Scans.
// @run-at      document-start
// @require     https://greasyfork.org/scripts/468394-itsnotlupus-tiny-utilities/code/utils.js
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/470552/Usability%20Tweaks%20for%20Manga%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/470552/Usability%20Tweaks%20for%20Manga%20sites.meta.js
// ==/UserScript==

// vague wish list
// - turning sequences of chapter pages into an SLA would be nifty. a bit of a PITA to do in a generic fashion without bugs.
//   - instead of SLA, we could prime a pseudo-offline worker with prefetched content. should still lower navigation time substantially, and less likely to bug out.
// - domains shouldn't be casually mentioned all over the code, but factored out in a data section near the top.
// - click-to-advance? find white spots, deduce areas of content and scroll to next content on click, taking content height and screen height into account. and stuff.
// - moar sites. all the sites.
// - the "track bookmarks if we can, if not, ehh" approach is a bit weak. can we do better?

/* jshint esversion:11 */
/* eslint curly: 0 no-return-assign: 0, no-loop-func: 0, no-multi-spaces: 0 */
/* global log, addStyles, $, $$, $$$, events, rAF, observeDOM, untilDOM, sleep, until, fetchHTML, prefetch, crel */

// Chrome-only APIs.. those need fallbacks.
/* global navigation */

//////////// utilities /////////////

// return strings to be used as classnames to group similar sites together.
function getMangaType() {
  switch (location.hostname) {
    case 'asura.gg':
    case 'asura.nacm.xyz':
    case 'flamescans.org':
    case 'void-scans.com':
    case 'luminousscans.com':
    case 'shimascans.com':
    case 'nightscans.org':
    case 'freakscans.com':
    case 'reaperscans.fr':
    case 'manhwafreak.com':
    case 'manhwafreak-fr.com':
    case 'realmscans.to':
    case 'mangastream.themesia.com':
      return 'mangastream';
    default:
      return '';
  }
}

// is the image all white? sometimes, you just need to know.
function isAllWhite(img) {
  if (!img.width || !img.height) return false;
  const ctx = crel('canvas', { width: img.width, height: img.height }).getContext('2d');
  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0,0,img.width, img.height);
  return imgData.data.reduce((a,b)=>a+b, 0) == img.width * img.height * 4 * 255;
}
// TODO: variants that map a vertical page offset to an image slice and assert it's a single color might be useful.

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// everything below are initializers that (should) return their own deinitializers, and are started in main() //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// manga site hostnames are prone to changing often apparently. adjust.
function transferData() {
  const keys = ["bookmark", "lastReadChapterKey", "seriesIdHrefMap", "seriesIdLatestMap"];
  // NOTE: This transfer map has to be updated manually each time a site changes domain.
  const transfers = {
    "asura.nacm.xyz": "asura.gg",
    "manhwafreak.com": "manhwa-freak.com"
  };

  if (transfers[location.hostname]) {
    const newSite = location.hostname;
    const oldSite = transfers[newSite];
    for (const key of keys) {
      const oldKey = `${oldSite}/${key}`;
      const newKey = `${newSite}/${key}`;
      const oldValue = GM_getValue(oldKey);
      const newValue = GM_getValue(newKey);
      if (newValue) return; // already transferred, or risk of iffy conflict. abort.
      GM_setValue(newKey, oldValue);
    }
    log(`Bookmark data transferred from ${oldSite} to ${newSite} successfully.`);
  }
}

function cssCleanup() {
  // now with origin prefixes. man, if CSS Nesting was a little more widespread, it'd be great for this.
  addStyles(`
  /* remove ads and blank space between images were ads would have been */
  .mangastream [class^="ai-viewport"], .mangastream .code-block, .mangastream .blox, .mangastream .kln, .mangastream [id^="teaser"],
  .mangastream .rev-src, .mangastream .radio-ad {
    display: none !important;
  }

  /* hide various header and footer content. */
  .mangastream .socialts, .mangastream .chdesc, .mangastream .chaptertags,
  .mangastream .postarea >#comments, .mangastream .postbody>article>#comments, #commentaires, .realmscans_to .chapterbody > .bixbox:last-child,
  .mangastream .container>.row>.margin-small,
  .reaperscans_com #comments, .reaperscans_com iframe {
    display: none;
  }
  .mangastream .container>.row>.bg-alert {
    visibility: hidden;
  }

  /* asura broke some of MangaStream's CSS. whatever. */
  .mangastream .black #thememode {
    display: none
  }

  /* luminousscans junk */
  .mangastream .flame, .mangastream .flamewidthwrap { display: none !important }
  .mangastream .listupd .bs .bsx .limit .type { right: initial; left: 5px }

  .manhwafreak_com .maincontent + div, .manhwafreak-fr_com .maincontent + div, .footercopyright {
    display: none;
  }

  /* manga-scans tweaks */
  .manga-scans_com .navbar.navbar-fixed-top {
    position: absolute;
  }
  .manga-scans_com .manga-footer1 {
    display: none;
  }
  @media(max-width: 900px) {
    .manga-scans_com .post-navigation.post-navigation:nth-of-type(1) {
      display:block;
    }

    .manga-scans_com .post-navigation.post-navigation {
      bottom: auto !important;
      position: static !important;
      width: auto;
    }
  }

  /* mangakakalot.so */
  .mangakakalot_so .default-container.default-container.default-container {
    height: auto !important;
  }
  .mangakakalot_so #main-container {
    overflow-y: hidden !important;
  }
  .mangakakalot_so .reading-container img[src][src] {
    margin-top: -4px;
  }
  .mangakakalot_so .social-container {
    display: none;
  }
  .mangakakalot_so footer.footer-container {
    background: var(--background) !important;
  }
  .mangakakalot_so footer>div {
    height: 3em;
  }

  /* get slightly more discrete scrollbars */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(127,127,127,0.5) transparent;
  }

  *::-webkit-scrollbar {
    width: .6em !important;
  }

  *::-webkit-scrollbar:horizontal {
    height: .6em !important;
  }

  *::-webkit-scrollbar-thumb {
    background-color: rgba(127,127,127,0.5);
    border-radius: 10px
  }
  `);


  let undone = false;

  // set classes to allow better CSS targeting.
  document.documentElement.classList.add(...[location.hostname.replace(/\./g, '_'), getMangaType()].filter(v=>!!v));

  // on asura.gg, poorly placed discord links are breaking the bottom chapter selector. lose nothing of value.
  (async()=>{
    while(!undone) {
      const a =await untilDOM(`a[href*="discord"]:not([itemprop="url"])`);
      a.replaceWith(...a.childNodes)
    }
  })();

  // recover from asura's half-assing their domain change.
  addEventListener('load', () => {
    const { jQuery, sf_input } = unsafeWindow;
    if (jQuery && sf_input) {
      jQuery(sf_input)?.unbind?.().removeData?.();
      jQuery(sf_input)?.ajaxyLiveSearch?.({"expand":false,"searchUrl":location.origin+"/?s=%s","text":"Search","delay":500,"iwidth":180,"width":350,"ajaxUrl":location.origin+"/wp-admin\/admin-ajax.php","rtl":0});
    }
  });

  // reduce the time during which asura's prev/next buttons are broken on load..
  untilDOM(()=>$$$(`//script[contains(text(),"ts_reader.run")]`)[0]).then(tsr=>{
    const { prevUrl, nextUrl } = JSON.parse($$$(`//script[contains(text(),"ts_reader.run")]`)[0].textContent.match(/ts_reader.run\((?<json>.*)\);/).groups.json);
    $$`a.ch-prev-btn`.forEach(a => a.href = prevUrl);
    $$`a.ch-next-btn`.forEach(a => a.href = nextUrl);
  });


  // manga-scans junk
  untilDOM(()=>$$$(`//div[contains(text(),"[rp-form]")]/..`)[0]).then(junk=>junk.remove());

  return () => {
    undone = true;
  };
}

/**
 * - left/right arrow keys or A/D keys can be used to navigate chapers
 * - K/L keys can be used to rotate the page orientation
 * - F key for fullscreen mode
 * - dragging with the mouse can scroll the page
 * - mouse swiping horizontally can be used to navigate chapters
 * - in landscape mode, the primary mousewheel can scroll the page
 */
function augmentInteractions() {

  const CURSOR_PREV = 'data:image/svg+xml;base64,'+btoa`
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#913fe2" viewBox="0 0 14 14" width="32" height="32">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 1 7.3 6.3a1 1 180 0 0 0 1.4L13 13M7 1 1.3 6.3a1 1 180 0 0 0 1.4L7 13"/>
  </svg>`;

  const CURSOR_NEXT = 'data:image/svg+xml;base64,'+btoa`
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#913fe2" viewBox="0 0 14 14" width="32" height="32">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 13 5.7-5.3a1 1 0 0 0 0-1.4L1 1m6 12 5.7-5.3a1 1 0 0 0 0-1.4L7 1"/>
  </svg>`;

  addStyles(`
  /* animate transitions to/from portrait modes */
  html {
    transition: transform .25s, filter .5s;
  }
  /* disable builtin drag behavior to allow drag scrolling and swiping */
  * {
    user-select: none;
    -webkit-user-drag: none;
  }
  /* nav swiping cursors */
  body.prev.prev {
    cursor: url("${CURSOR_PREV}") 16 16, auto !important;
  }
  body.next.next {
    cursor: url("${CURSOR_NEXT}") 16 16, auto !important;
  }
  /* drag scrolling cursor */
  body.drag {
    cursor: grabbing !important;
  }
  img.curdown.curdown {
    cursor: inherit;
  }
  html.animate-prev {
    transition: transform .5s cubic-bezier(0,.5,.34,1);
    transform: translateX(100vw);
  }
  html.animate-next {
    transition: transform .5s cubic-bezier(0,.5,.34,1);
    transform: translateX(-100vw);
  }
  /* swipe recognition */
  html.swiping {
    overflow-x: hidden;
  }
  html.swiping body {
    width: 100vw;
    overflow-x: auto;
  }
  html.swiping body > *:not(.scrollToTop) {
    width: 300vw;
    padding: 0 100vw;
  }
  `);

  const cleanup = [];

  // keyboard navigation. good for long strips, which is apparently all this site has.
  const PREV = ".ch-prev-btn,.prev-post>a";
  const XPREV = `//button[contains(text(),'Prev')]`;
  const NEXT = ".ch-next-btn,.next-post>a";
  const XNEXT = `//button[contains(text(),'Next')]`;
  const prev = () => ($(PREV) ?? $$$(XPREV)[0])?.click();
  const next = () => ($(NEXT) ?? $$$(XNEXT)[0])?.click();
  // animate chapter changes
  untilDOM("body").then(body=> cleanup.push(events({ click(e) {
    if (e.target.closest(PREV)?.getAttribute('href')?.[0]=='h') document.documentElement.classList.add('animate-prev');
    if (e.target.closest(NEXT)?.getAttribute('href')?.[0]=='h') document.documentElement.classList.add('animate-next');
  } }, body, true)));
  $`meta[name="viewport"]`?.remove();
  document.head.append(crel("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }));
  // fullscreen support is weirdly easy to add
  const fullscreen = (d=document) => d.fullscreenElement ? d.exitFullscreen() : d.documentElement.requestFullscreen();

  cleanup.push(events({ keydown(e) {
    if (document.activeElement.tagName != 'INPUT' && !e.ctrlKey && !e.altKey && !e.metaKey) ({
      ArrowLeft: prev,
      ArrowRight: next,
      a: prev,
      d: next,
      f: fullscreen,
      k: () => rotatePage(false), // counter-clockwise
      l: () => rotatePage(true), // clockwise
    }[e.key]?.());
  }}, window, true));


  // inertial drag scrolling, swipe navigation, some rotation logic.
  let orientation = 0; // degrees. one of [0, 90, 180, 270 ];
  let rotating = false; // disable rotation until rotating is false again.
  const wheelFactor = { 0:0, 90: 1, 180: 0, 270: -1 };
  let [ delta, drag, dragged, navPos ] = [0, false, false, 0];
  let previousTouch;
  const eventListeners = {
    // wheel event, used to handle landscape scrolling
    wheel: e => scrollBy({left: e.wheelDeltaY * wheelFactor[orientation], behavior:'instant'}),
    // mouse dragging/swiping
    mousedown: () => {
      [ delta, drag, dragged, navPos ] = [0, true, false, 0];
    },
    mousemove: e => {
      if (drag) {
        if (wheelFactor[orientation]) {
          scrollBy({left:delta=-e.movementX, behavior:'instant'});
        } else {
          scrollBy({top: delta=-e.movementY, behavior:'instant'});
        }
        if (!wheelFactor[orientation]) { // nav swiping is just too confusing in landscape mode.
          const width = $`#readerarea,body`.clientWidth;
          navPos+=e.movementX;
          if (navPos < -width/8) document.body.classList.add("prev");
          else if (navPos > width/8) document.body.classList.add("next");
          else document.body.classList.remove("prev", "next");
        }
        if (Math.abs(delta)>3) {
          dragged = true;
          document.body.classList.add('drag');
        }
      }
    },
    mouseup: () => {
      if (drag) {
        drag=false;
        rAF((_, next) => Math.abs(delta*=0.98)>1 && next(wheelFactor[orientation]?scrollBy({left:delta,behavior:'instant'}):scrollBy({top:delta,behavior:'instant'})));
      }
      const goPrev = document.body.classList.contains("prev");
      const goNext = document.body.classList.contains("next");
      document.body.classList.remove("prev", "next", "drag");
      if (dragged) {
        dragged = false;
        addEventListener('click', e => {
          if (goPrev || goNext) return;
          e.preventDefault();
          e.stopPropagation();
        }, { capture: true, once: true });
      }
      if (goPrev) prev();
      if (goNext) next();
    }
  };
  cleanup.push(events(eventListeners));
  // mobile nav swiping
  cleanup.push(swipeHandler({ left: next, right: prev }));
	// non-webkit browsers need this for -webkit-user-drag: none
  cleanup.push(events({ dragstart(e) { e.preventDefault() }}, document));

  /**
   * Swipe recognition. leverage native scroll => less jankiness
   *
   * vertical scroll happens on <html>
   * horizontal scroll happens on <body>
   * This (hopefully) prevents scrolling from happening on both axis simultaneously.
   */
  async function swipeHandler({ left=()=>0, right=()=>0 }) {
    const isTouchDevice = () => 'ontouchstart' in window;
    if (!isTouchDevice()) return;

    const html = document.documentElement;
    await untilDOM('body');

    // move to utility? reshape?
    /** wait for a few consecutive frames without a scroll event before calling fn() */
    const whenNotScrolling = (fn, tick=0, cleanup=events({scroll(){tick<5 && (tick=0)},scrollend(){tick=1e3}})) => rAF((_, next) => ++tick>5 ? (cleanup(),fn()) : next());

    const recenter = fast => html.classList.contains('swiping') && whenNotScrolling(() => document.body.scrollLeft !== innerWidth && document.body.scrollTo({left: innerWidth, behavior: fast?'instant':'smooth'}));

    // add side margins by default to allow horizontal scrolling/swiping to happen. remove them on zoom.
    html.classList.add('swiping');
    recenter(true);

    const cleanups = [];

    cleanups.push(events({
      resize() {
        // remove swiping margins when the user pinch/zoomed in.
        html.classList.toggle('swiping', visualViewport.scale == 1);
      }
    }, visualViewport));

    if (!('onscrollend' in window)) {
      let scrollendTimer;
      cleanups.push(events({
        scroll(e) {
          // cheap mitigation for missing scrollend event on safari/iOS
          clearTimeout(scrollendTimer);
          scrollendTimer = setTimeout(()=>e.target.dispatchEvent(new Event('scrollend')), 250);
        }
      }, document.body));
    }

    cleanups.push(events({
      scrollend() {
        // check if we landed far enough to trigger an action (slow drag/scroll)
        const pos = document.body.scrollLeft;
        if (pos < innerWidth/2) return right();
        if (pos > innerWidth*3/2) return left();
        recenter();
      }
    }, document.body));

    return () => cleanups.forEach(c=>c());
  }

  cleanup.push(events({
    beforeunload(e) {
      // save scroll position.
      GM_setValue('scrollPos', Object.assign(GM_getValue('scrollPos', {}), { [location.href]: ~~document.documentElement.scrollTop }));
    }
  }));
  // restore scroll position
  (async()=> {
    const scrollPos = GM_getValue('scrollPos', {})[location.href] ?? 0;
    const t = Date.now();
    let scrolled=false;
    addEventListener('load', ()=>scrolled=true, {once:true});
    while (Math.abs(document.documentElement.scrollTop - scrollPos)>2) {
      scrollTo({top:scrollPos, behavior:'instant'});
      const tt = Date.now()-t;
      const wait = tt<1000 ? 0 : tt<2000 ? 1 : tt<3000 ? 10 : tt<5000 ? 50 : 100;
      if (scrolled) break;
      await sleep(wait);
    }
  })();

  // This page rotation thingy actually feels good now.
  async function rotatePage(clockwise) {
    if (rotating) return;
    rotating = true;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const { scrollTop, scrollLeft, clientWidth, clientHeight, style } = html;
    const { scrollHeight } = document.body;
    const oldOriginY = parseInt(style.transformOrigin.split(" ")[1]);
    let scrollWidth; // html.scrollWidth is wrong on Firefox. compute it ourselves.

    const from = ({ angle, originY, sw=()=>0, topFactor=0 }) => next => () => {
      style.transition = "initial";
      style.transformOrigin = `${clientWidth/2}px ${originY()}px`;
      style.transform=`rotate(${angle(next == to0)}deg)`;
      scrollBy({top: topFactor*(originY() - oldOriginY), behavior:"instant"});
      scrollTo({left: angle()%180?0:void 0, behavior: "instant"});
      style.transition='';
      scrollWidth = clientWidth/2 + originY();
      return next(angle()==0);
    };
    const to = ({angle, ty=()=>0, left=()=>void 0, top=()=>void 0}) => (flag) => new Promise(next => {
      style.transform=`rotate(${angle(flag)}deg)`;
      html.addEventListener('transitionend', () => {
        style.transition="initial";
        if (angle()==180) style.transformOrigin = `${clientWidth/2}px ${scrollHeight/2}px`;
        style.transform=`rotate(${angle(true)}deg) translate(0,${ty()}px)`;
        scrollTo({left:left(), top:top(), behavior: "instant"});
        style.transition ="";
        style.overflow = angle()%180 ? "auto hidden" : "hidden auto";
        if (angle()==0) style.transform ='';
        next(angle());
      }, {once: true});
    });

    const from0   = from({ angle:()=>0,            originY:()=>scrollTop + clientHeight/2 });
    const from90  = from({ angle:()=>90,           originY:()=>scrollHeight - scrollLeft - clientWidth/2 - 1, topFactor:1 });
    const from180 = from({ angle:()=>180,          originY:()=>scrollHeight - scrollTop - clientHeight/2,     topFactor:2 });
    const from270 = from({ angle:to0=>to0?-90:270, originY:()=>scrollLeft + clientHeight/2,                   topFactor:1 });

    const to0   = to({ angle:()=>0 });
    const to90  = to({ angle:()=>90,               ty:()=>scrollWidth - scrollHeight,      left:()=>scrollHeight - html.scrollTop - clientWidth/2 - clientHeight/2 });
    const to180 = to({ angle:()=>180,                                                       top:()=>scrollHeight - html.scrollTop - clientHeight });
    const to270 = to({ angle:from0=>from0?-90:270, ty:()=>html.scrollTop,                  left:()=>html.scrollTop });

    const rotations = {
      0:   [ from0(to270),   from0(to90)    ],
      90:  [ from90(to0),    from90(to180)  ],
      180: [ from180(to90),  from180(to270) ],
      270: [ from270(to180), from270(to0)   ]
    }
    orientation = await rotations[orientation][~~clockwise]();
    rotating = false;
  }

  return () => cleanup.forEach(f=>f());
}

function loadAllChapterImages() {
  // don't be shy about loading an entire chapter
  untilDOM(()=>$$`img[loading="lazy"]`).then(images=>images.forEach(img => img.loading="eager"));
  // since we're here, hide small pure blank images that break the flow on some sites.
  [...$$`#readerarea > img`].filter(img=>img.height<200).filter(img=>isAllWhite(img)).forEach(img =>img.style.display='none');
}

function retryLoadingBrokenImages() {
  // retry loading broken images
  const imgBackoff = new Map();
  const imgNextRetry = new Map();
  const retryImage = img => {
    log("RETRY LOADING IMAGE! ",img.src, {complete:img.complete, naturalHeight:img.naturalHeight}, img);
    const now = Date.now();
    const nextRetry = imgNextRetry.has(img) ? imgNextRetry.get(img) : (imgNextRetry.set(img, now),now);
    if (nextRetry <= now) {
      // exponential backoff between retries: 0ms, 250ms, 500ms, 1s, 2s, 4s, 8s, 10s, 10s, ...
      imgBackoff.set(img, Math.min(10000,(imgBackoff.get(img)??125)*2));
      imgNextRetry.set(img, now + imgBackoff.get(img));
      img.src=img.src;
    } else {
      setTimeout(()=>retryImage(img), nextRetry - now);
    }
  }
  const cleanup = [];
  cleanup.push(events({ load() {
    cleanup.push(observeDOM(() => {
      [...document.images].filter(img=>img.complete && !img.naturalHeight && getComputedStyle(img).display!='none').forEach(retryImage);
    }));
  }}));
  return () => cleanup.forEach(f=>f());
}

async function prefetchNextChapterImages() {
  // don't block this step
  (async()=>{
    // and prefetch the next chapter's images for even less waiting.
    const nextBtn = await untilDOM(`a.ch-next-btn[href^="http"],div.next-post>a[href]`);
    // None of these seem to accomplish more than a plain fetch() already does: link prefetch, link prerender, speculation rules.
    // prefetch(nextBtn.href);
    // document.head.append(crel('link', { rel: 'prerender', href: nextBtn.href }));
    if (HTMLScriptElement.supports("speculationrules")) {
    // document.head.append(crel('script', {
    //   type: 'speculationrules',
    //   textContent: JSON.stringify({
    //     prerender: [ {
    //       source: "list",
    //       urls: [ nextBtn.href ],
    //       // eagerness: "eager"
    //     } ]
    //   })
    // }));

    // I'm literally not cool enough to try this (not to future self: try again later):
    // document.head.append(crel('script', {
    //   type: 'speculationrules',
    //   textContent: JSON.stringify({
    //     prerender: [
    //       {
    //         source: "document",
    //         where: {
    //           href_matches: location.href.split('/').slice(0,-2).join('/')+"/*"
    //         },
    //         eagerness:"eager"
    //       }
    //     ]
    //   })
    // }));
    }
    const html = await fetch(nextBtn.href).then(r=>r.text());
    const doc = new DOMParser().parseFromString(html, 'text/html');
    [...doc.images].forEach(img => prefetch(img.src));
  })();
}

/**
 * This only works on a subset of mangastream sites that haven't
 * deployed their own account and bookmark tracking system.
 * TODO: document, or expose some mean to show which sites have this.
 */
function trackLastReadChapterAndBookmarks() {
  addStyles(`
  /* add a badge on bookmark items showing the number of unread chapters */
  .unread-badge {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 9999;
    display: block;
    padding: 2px;
    margin: 5px;
    border: 1px solid #0005b1;
    border-radius: 12px;
    background: #ffc700;
    color: #0005b1;
    font-weight: bold;
    font-family: cursive;
    transform: rotate(10deg);
    width: 24px;
    height: 24px;
    line-height: 18px;
    text-align: center;
  }
  /* text mode badge */
  .soralist .unread-badge {
    position: initial;
    display: inline-block;
    zoom: 0.8;
  }
  `);

  let undone = false;

  // have bookmarks track the last chapter you read
  // NOTE: If you use TamperMonkey, you can use their "Utilities" thingy to export/import this data across browsers/devices
  // (I wish this was an automatic sync tho.)
  const LAST_READ_CHAPTER_KEY = `${location.hostname}/lastReadChapterKey`;
  const SERIES_ID_HREF_MAP = `${location.hostname}/seriesIdHrefMap`;
  const SERIES_ID_LATEST_MAP = `${location.hostname}/seriesIdLatestMap`;
  const BOOKMARK = `${location.hostname}/bookmark`;
  const BOOKMARK_HTML = `${location.hostname}/bookmarkHTML`;

  // backward-compatibility - going away soon.
  const X_LAST_READ_CHAPTER_KEY = "lastReadChapter";
  const X_SERIES_ID_HREF_MAP = "seriesIdHrefMap";
  const X_SERIES_ID_LATEST_MAP = "seriesIdLatestMap";
  const lastReadChapters = GM_getValue(LAST_READ_CHAPTER_KEY, GM_getValue(X_LAST_READ_CHAPTER_KEY, JSON.parse(localStorage.getItem(X_LAST_READ_CHAPTER_KEY) ?? "{}")));
  const seriesIdHrefMap = GM_getValue(SERIES_ID_HREF_MAP, GM_getValue(X_SERIES_ID_HREF_MAP, JSON.parse(localStorage.getItem(X_SERIES_ID_HREF_MAP) ?? "{}")));
  const seriesIdLatestMap = GM_getValue(SERIES_ID_LATEST_MAP, GM_getValue(X_SERIES_ID_LATEST_MAP, JSON.parse(localStorage.getItem(X_SERIES_ID_LATEST_MAP) ?? "{}")));
  // sync site bookmarks into userscript data.
  // rules:
  // 1. A non-empty usBookmarks is always correct on start.
  // 2. any changes to localStorage while the page is loaded updates usBookmarks.
  const usBookmarks = GM_getValue(BOOKMARK, GM_getValue('bookmark', [])) ?? [];
  if (usBookmarks.length) {
    localStorage.bookmark = JSON.stringify(usBookmarks);
  } else {
    GM_setValue(BOOKMARK, JSON.parse(localStorage.bookmark ?? '[]'));
  }
  (async function watchBookmarks() {
    let lsb = localStorage.bookmark;
    while (!undone) {
      await until(() => lsb !== localStorage.bookmark);
      lsb = localStorage.bookmark;
      GM_setValue(BOOKMARK, JSON.parse(lsb));
    }
  })();

  function getLastReadChapter(post_id, defaultValue = {}) {
    return lastReadChapters[post_id] ?? defaultValue;
  }

  function setLastReadChapter(post_id, chapter_id, chapter_number) {
    lastReadChapters[post_id] = {
      id: chapter_id,
      number: chapter_number
    };
    GM_setValue(LAST_READ_CHAPTER_KEY, lastReadChapters);
  }

  function getSeriesId(post_id, href) {
    if (post_id) {
      seriesIdHrefMap[href] = post_id;
      GM_setValue(SERIES_ID_HREF_MAP, seriesIdHrefMap);
    } else {
      post_id = seriesIdHrefMap[href];
    }
    return post_id;
  }

  function getLatestChapter(post_id, chapter) {
    if (chapter) {
      seriesIdLatestMap[post_id] = chapter;
      GM_setValue(SERIES_ID_LATEST_MAP, seriesIdLatestMap);
    } else {
      chapter = seriesIdLatestMap[post_id];
    }
    return chapter;
  }


  // series card decorations, used in bookmarks and manga lists pages.
  const CHAPTER_REGEX = /\bChapter (?<chapter>\d+)\b|\bch.(?<ch>\d+)\b/i;
  async function decorateCards(reorder = true) {
    const cards = await untilDOM(() => $$$("//div[contains(@class, 'listupd')]//div[contains(@class, 'bsx')]/.."));
    cards.reverse().forEach(b => {
      const post_id = getSeriesId(b.firstElementChild.dataset.id, $('a', b).href);
      const epxs = $('.epxs',b)?.textContent ?? b.innerHTML.match(/<div class="epxs">(?<epxs>.*?)<\/div>/)?.groups.epxs;
      const latest_chapter = getLatestChapter(post_id, parseInt(epxs?.match(CHAPTER_REGEX)?.groups.chapter));
      const { number, id } = getLastReadChapter(post_id);
      if (id) {
        const unreadChapters = latest_chapter - number;
        if (unreadChapters) {
          // reorder bookmark, link directly to last read chapter and slap an unread count badge.
          if (reorder) b.parentElement.prepend(b);
          $('a',b).href = '/?p=' + id;
          $('.limit',b).prepend(crel('div', {
            className: 'unread-badge',
            textContent: unreadChapters<100 ? unreadChapters : '💀',
            title: `${unreadChapters} unread chapter${unreadChapters>1?'s':''}`
          }))
        } else {
          // nothing new to read here. gray it out.
          b.style = 'filter: grayscale(70%);opacity:.9';
        }
      } else {
        // we don't have data on that series. leave it alone.
      }
    });
  }
  // text-mode /manga/ page. put badges at the end of each series title, and strike through what's already read.
  async function decorateText() {
    const links = await untilDOM(()=>$`.soralist a.series` && $$`.soralist a.series`);
    links.forEach(a => {
      const post_id = getSeriesId(a.rel, a.href);
      const latest_chapter = getLatestChapter(post_id);
      const { number, id } = getLastReadChapter(post_id);
      if (id) {
        const unreadChapters = latest_chapter - number;
        if (unreadChapters) {
          a.href = '/?p=' + id;
          a.append(crel('div', {
            className: 'unread-badge',
            textContent: unreadChapters<100 ? unreadChapters : '💀',
            title: `${unreadChapters} unread chapter${unreadChapters>1?'s':''}`
          }))
        } else {
          // nothing new to read here. gray it out.
          a.style = 'text-decoration: line-through;color: #777'
        }
      }
    })
  }

  // page specific tweaks
  const chapterMatch = document.title.match(CHAPTER_REGEX);
  if (chapterMatch) {
    until(()=>unsafeWindow.post_id).then(() => {
      // We're on a chapter page. Save chapter number and id if greater than last saved chapter number.
      const chapter_number = parseInt(chapterMatch.groups.chapter ?? chapterMatch.groups.ch);
      const { post_id, chapter_id } = unsafeWindow;
      const { number = 0 } = getLastReadChapter(post_id);
      if (number<chapter_number) {
        setLastReadChapter(post_id, chapter_id, chapter_number);
      }
    });
  }

  if (location.pathname.match(/^\/bookmarks?\/$/)) (async () => {
    // We're on a bookmark page. Wait for them to load, then tweak them to point to last read chapter, and gray out the ones that are fully read so far.
    setTimeout(()=> {
      if (!$`#bookmark-pool [data-id]`) {
        // no data yet from bookmark API. show a fallback.
        $`#bookmark-pool`.innerHTML = GM_getValue(BOOKMARK_HTML, localStorage.bookmarkHTML ?? '');
        // add a marker so we know this is just a cached rendering.
        $`#bookmark-pool [data-id]`?.classList.add('cached');
        // decorate what we have.
        decorateCards();
      }
    }, 1000);
    // wait until we get bookmark markup from the server, not cached.
    await untilDOM("#bookmark-pool .bs:first-child [data-id]:not(.cached)");
    // bookmarks' ajax API is flaky (/aggressively rate-limited) - mitigate.
    GM_setValue(BOOKMARK_HTML, $`#bookmark-pool`.innerHTML);
    decorateCards();
  })(); else {
    // try generic decorations on any non-bookmark page
    decorateCards(false);
    decorateText();
  }

  untilDOM(`#chapterlist`).then(() => {
    // Add a "Continue Reading" button on main series pages.
    const post_id = $`.bookmark`.dataset.id;
    const { number, id } = getLastReadChapter(post_id);
    // add a "Continue Reading" button for series we recognize
    if (id) {
      $`.lastend`.prepend(crel('div', {
          className: 'inepcx',
          style: 'width: 100%'
        },
         crel('a', { href: '/?p=' + id },
           crel('span', {}, 'Continue Reading'),
           crel('span', { className: 'epcur' }, 'Chapter ' + number))
         )
      );
    }
  });
}

function collapseFooters() {
  addStyles(`
  /* style a custom button to expand collapsed footer areas */
  button.expand {
    float: right;
    border: 0;
    border-radius: 20px;
    padding: 2px 15px;
    font-size: 13px;
    line-height: 25px;
    background: #333;
    color: #888;
    font-weight: bold;
    cursor: pointer;
  }
  button.expand:hover {
    background: #444;
  }
  `);

  function makeCollapsedFooter({ label, section }) {
    const elt = crel('div', {
      className: 'bixbox',
      style: 'padding: 8px 15px;min-height:3em'
    }, crel('button', {
      className: 'expand',
      textContent: label,
      onclick() {
        section.style.display = 'block';
        elt.style.display = 'none';
      }
    }));
    section.parentElement.insertBefore(elt, section);
  }

  untilDOM(()=>$$$("//span[text()='Related Series' or text()='Similar Series']/../../..")[0] ?? $`.related-series`).then(related => {
    // Tweak footer content on any page that has them
    // 1. collapse related series.
    makeCollapsedFooter({label: 'Show Related Series', section: related});
    related.style.display = 'none';
  });

  untilDOM("#comments,#commentaires,.margin-small,.realmscans_to .chapterbody > .bixbox").then(comments => {
    // 2. collapse comments.
    makeCollapsedFooter({label: 'Show Comments', section: comments});
  });
}

// a catch-all function to address site-specific nonsense.
async function siteSpecificTweaks() {
  let undone = false;
  switch (location.origin) {
    // mangakakalot doesn't load all their images upfront. that's fine. I'm not annoyed.
    case 'https://mangakakalot.so': {
      const chapter = location.pathname.split('/').at(-1);
      // we could use $nuxt.$options.$config.apiRootUrl $nuxt.$route.params.chapter, but.. why?
      const {results} = await fetch(`https://api.mangago.to/v1/chapters/${chapter}/images?page_size=100`).then(r=>r.json());
      const container = await untilDOM(".reading-container");
      container.replaceChildren(...results.map(o=>crel('img', { src: o.image, style: `max-width:100%;width:720px` })));
      const count = container.childElementCount;
      (async()=>{
        while(!undone) {
          await until(() => undone || container.childElementCount < count);
          if (undone) break;
          container.replaceChildren(...results.map(o=>crel('img', { src: o.image, style: `max-width:100%;width:720px` })));
        }
      })();
      break;
    }
    // manhwafreaks has buggy code and prevent right clicks. also, remove recruitment images since we're already here.
    case 'https://manhwafreak.com':
    case 'https://manhwafreak-fr.com': {
      (async()=> {
        const jQuery = await untilDOM(()=>unsafeWindow.jQuery);
        jQuery(unsafeWindow).off("scroll"); // buggy handler
        jQuery("#readerarea").off('contextmenu'); // generally obnoxious
      })();
      (async()=> {
        while(!undone) {
          const badImages = [
            "/uploads/2022/10/100.5.png",
            "/uploads/2022/12/9-3.jpg",
            "/plugins/page-views-count/ajax-loader-2x.gif",
            "/uploads/2022/08/Comp-11.gif",
            "/uploads/2022/06/101.jpg",
            "/uploads/2022/08/donate.png",
          ];
          $$(badImages.map(path=>`img[src="https://manhwafreak.com/wp-content${path}"]`).join()).forEach(img => img.remove());
          await sleep();
        }
      })();
      break;
    }
    case 'https://reaperscans.com': {
      (async()=> {
        while(!undone) {
          $`img[src$="/999.jpg"]`?.remove();
          await sleep();
        }
      })();
      break;
    }
    default:
      // nothing.
  }

  return () => undone = true;
}


// some mangastream sites have broken chapter dropdowns. work around.
function setupLoadChapterList() {
  let loaded = false;
  until(()=>loaded || $`select#chapter`?.childElementCount > 1).then(async () => {
    if ($`select#chapter`?.childElementCount <2) await loadChapterList();
    if ($(`select#chapter`)) $(`select#chapter`).value = location;
  });
  return events({ load() { loaded = true; }});

  async function loadChapterList() {
    if (JSON.parse(localStorage.currentChapterList??{})?.html?.trim()) return;
    const seriesURL = $(`a[itemprop="item"]:not([href="${location}"]):not([href="${location.origin}/"])`).href;
    const doc = new DOMParser().parseFromString(await (await fetch(seriesURL)).text(), 'text/html');
    const links = [...doc.querySelectorAll(".chapter-li>a,#chapterlist>ul>li a")];
    const options = links.map(a => {
      const label = (a.querySelector("div>p:first-child,span:first-child")??a).textContent;
      const link = a.href;
      return `<option value="${link}">${label}  </option>`;
    });
    const html = options.join('\n');
    localStorage.currentChapterList = JSON.stringify({
      id: unsafeWindow.post_id,
      html,
      time: (new Date).toISOString().split("T")[0]
    });
    $`select#chapter`.innerHTML = html;
  }
}

////////////////////////////////////////////

// survive SPAs
async function detectNavigation() {
  let currentURL = location.href;
  while (true) {
    await until(()=>currentURL !== location.href, 10); // rapid interval, but cheap check
    await unmain()
    currentURL = location.href;
    await main();
  }
}

let untasks = [];
/**
 * A function called when we need to undo things setup by main() below.
 * Typically, clean up event listeners and break out of async infinite loops.
 */
async function unmain() {
  await Promise.all(untasks.filter(v=>!!v).map(f=>f()));
  untasks = [];
}

// userscript entrypoint
async function main() {
  const tasks = [
    // survive domain changes
    transferData(),
    // ads and antifeatures
    cssCleanup(),
    // input
    augmentInteractions(),
    // network
    loadAllChapterImages(),
    retryLoadingBrokenImages(),
    prefetchNextChapterImages(),
    // UI
    trackLastReadChapterAndBookmarks(),
    collapseFooters(),
    //
    siteSpecificTweaks(),
    // manhwafreak broke their chapter list fetch. this is fine.
    setupLoadChapterList(),
  ];
  untasks = await Promise.all(tasks);
}

detectNavigation();
main();