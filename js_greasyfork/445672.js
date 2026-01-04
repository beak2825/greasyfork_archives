// ==UserScript==
// @name            mac.bid enhancer
// @description     Shows the true price of an item everywhere on the site to better spend your money. Note: assumes worst case tax scenario (7%, Allegheny county) when it is sometimes 6%
// @author          Mattwmaster58 <mattwmaster58@gmail.com>
// @namespace       Mattwmaster58 Scripts
// @match           https://*.mac.bid/*
// @version         0.3.3
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/445672/macbid%20enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/445672/macbid%20enhancer.meta.js
// ==/UserScript==

function _log(...args) {
  return console.log("%c[MBE]", "color: green", ...args);
}

function _warn(...args) {
  return console.log("%c[MBE]", "color: yellow", ...args);
}

function _debug(...args) {
  return console.log("%c[MBE]", "color: gray", ...args);
}

const MIN_TIME_SENTINEL = 10 ** 10;
const onUrlChange = (state, title, url) => {
  // todo: reset this some other way?
  timeRemainingLastUpdated = MIN_TIME_SENTINEL;
  _log("title change: ", state, title, url);
  const urlExceptions = [[/\/account\/invoices\/\d+/, (url) => `Invoice ${url.split("/").at(-1)}`], [/\/account\/active/, () => "Awaiting Pickup"], // sometimes works, sometimes doesn't. Idk what's going on
    [/\/search\?q=.*/, () => `Search ${new URLSearchParams(location.search).get("q")}`]];
  const noPricePages = [// pages that have no prices on them, thus no true price observation is necessary
    "/account/active", "/account/invoices", "/account/profile", "/account/membership", "/account/payment-method",]
  let activatePrices = true;
  for (const urlPrefix of noPricePages) {
    if (url.startsWith(urlPrefix)) {
      activatePrices = false;
      Observer.deactivateTruePriceObserver();
      break;
    }
  }
  if (activatePrices) {
    Observer.activateTruePriceObserver();
  }
    // special case listeners to add up invoices
  // todo: generalize this behaviour?
  else if (url === "/accounts/invoices") {
    Observer.activateInvoiceObserver();
  }
  let urlExcepted = false;
  let newTitle;
  for (const [re, func] of urlExceptions) {
    if (re.test(url)) {
      newTitle = func(url);
      urlExcepted = true;
      break;
    }
  }
  if (!urlExcepted) {
    newTitle = /\/(?:.*\/)*([\w-]+)/.exec(url)[1].split("-").map((part) => {
      return part.charAt(0).toUpperCase() + part.slice(1);
    }).join(" ");
  }
  _log(`changing title from "${document.title}" to "${newTitle}"`);
  document.title = newTitle;
}

// set onUrlChange proxy
['pushState', 'replaceState'].forEach((changeState) => {
  // store original values under underscored keys (`window.history._pushState()` and `window.history._replaceState()`):
  window.history['_' + changeState] = window.history[changeState];
  window.history[changeState] = new Proxy(window.history[changeState], {
    apply(target, thisArg, argList) {
      const [state, title, url] = argList;
      try {
        onUrlChange(state, title, url);
      } catch (e) {
        console.error(e);
      }
      return target.apply(thisArg, argList)
    },
  })
});

const USERSCRIPT_DIRTY_CLASS = "userscript-dirty";
const NO_BIDS_CLASS = "userscript-no-bids";
const NO_BIDS_CSS = `
.${NO_BIDS_CLASS} {
  background-color: #0061a5;
}

span.${NO_BIDS_CLASS} {
  color: gray;
}
`

function xPathEval(path, node) {
  const res = document.evaluate(path, node || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  let nodes = [];
  for (let i = 0; i < res.snapshotLength; i++) {
    nodes.push(res.snapshotItem(i))
  }
  return nodes;
}

function xPathClass(className) {
  return `contains(concat(" ",normalize-space(@class)," ")," ${className} ")`;
}


function calculateTruePrice(displayed) {
  // https://www.mac.bid/terms-of-use
  const LOT_FEE = 2;
  // Tax is 7% in Allegheny county, 6% elsewhere,
  // assume the worst b/c it would be too complicated otherwise
  const TAX_RATE = 0.07
  const BUYER_PREMIUM_RATE = 0.15
  return (displayed * (1 + BUYER_PREMIUM_RATE) + LOT_FEE) * (1 + TAX_RATE);
}

function extractPriceFromText(text) {
  return parseFloat(/\$(\d+(?:\.\d{2})?)/ig.exec(text)[1])
}

function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}


function processPriceElem(node) {
  // this is required even tho our xpath should avoid this, i suspect due to async nature of mutation observer
  const zeroWidthSpace = '​';
  if (node.classList.contains(USERSCRIPT_DIRTY_CLASS) || node.innerText.includes(zeroWidthSpace)) {
    return;
  }

  if (/(.*)\$((\d+)\.?(\d{2})?)/i.test(node.textContent)) {
    node.classList.add(USERSCRIPT_DIRTY_CLASS);
    // noinspection JSUnusedLocalSymbols2
    node.innerHTML = node.innerHTML.replace(/(.*)\$((\d+)(?:<small>)?(?:\.\d{2})?(?:<small>)?)/i, (_match, precedingText, displayPrice, price) => {
      node.title = `true price is active - displayed price was ${price}`;
      // really no reason to show site price if we know the "real" price
      // return `${precedingText} ~$${Math.round(calculateTruePrice(parseFloat(price)))} <sup>($${integralPart})</sup>`;
      return `${zeroWidthSpace}${precedingText} $${Math.round(calculateTruePrice(parseFloat(price)))}`;
    });
  }
}


function secondsFromTimeLeft(timeLeftStr) {
  const conversions = Object.values({
    day: 60 * 60 * 24, hour: 60 * 60, minute: 60, second: 1,
  });

  return /(\d{1,2})d(\d{1,2})h(\d{1,2})m(\d{1,2})s/i
    .exec(timeLeftStr)
    .slice(1)
    .map(parseFloat)
    .map((num, idx) => Object.values(conversions)[idx] * num)
    .reduce((a, b) => a + b);
}

function tabTitle(prefix, suffix) {
  // gets an appropriate tab title based on url
  prefix = prefix || "";
  suffix = suffix || "";
  if (location.pathname === "/account/watchlist") {
    return `${prefix} - Watchlist ${suffix}`;
  } else if (/\/auction\/.*\/lot\/\d+/.test(location.pathname)) {
    const itemTitle = document.querySelector(".page-title-overlap h1").textContent;
    return `${prefix} - ${itemTitle} ${suffix}`;
  } else {
    return `${prefix} mac.bid ${suffix}`;
  }
}

const Observer = (() => {
  let states = {
    remainingTime: false,
    truePrice: false,
    invoice: false,
  }
  const configs = {
    truePrice: {childList: true, subtree: true},
    remainingTime: {characterData: true, subtree: true},
    invoice: {},
  }
  const mutationObservers = {
    remainingTime: new MutationObserver((mutations) => {
      // or anywhere there's a countdown?
      // remark: i think this covers 99% of where it's useful already AFAICT
      let minTimeText = "";
      if (location.pathname === "/account/watchlist" || /\/auction\/.*\/lot\/\d+/.test(location.pathname)) {
        let countdownMutationOccurred = false;
        mutations
          .map((mut) => {
            const parent = mut.target.parentElement.parentElement.parentElement;
            if (Array.from(parent.classList).includes("cz-countdown")) {
              numUpdatedSinceLastMinTimeUpdate++;
              countdownMutationOccurred = true;
              let m;
              if ((m = secondsFromTimeLeft(parent.textContent)) < minTime) {
                minTime = m;
                numUpdatedSinceLastMinTimeUpdate = 0;
                // we would like to see the two most significant digits
                // eg: 2d19h7m11s → 2d19h
                minTimeText = /^(?:0[dhms])*((?:[1-9]\d?[dhms]){1,2})/i.exec(parent.textContent)[1];
                document.title = tabTitle(minTimeText);
              }
            }
          });
        if (countdownMutationOccurred) {
          // todo: theoretically handles the handover on the *next* cycle of text change instead of instantly
          // we would expect a perfect cycle of timer updates to never generate more mutations than the amount of timers
          // present on the page. however, the async nature of timers and the fact that multiple mutation
          // events are generated when a timer decrease causes unit rollover (eg 1d0h0m0s → 0d23h59m59s will be 4)
          // means it makes more sense to have a 2*number of timers on page before abandoning
          // a timer as stale or inaccurate. This detections should occur withing ~2s even with the improved cushion
          // additionally, if minTime is <= 1, the auction has ended and will be removed imminently
          // this means that there should be a longer item on the wl,
          // let it naturally take over in the course of the loop
          if (minTime <= 1 || numUpdatedSinceLastMinTimeUpdate > document.querySelectorAll("[data-countdown]").length * 2) {
            minTime = MIN_TIME_SENTINEL;
          }
        }
      }
    }),
    truePrice: new MutationObserver((mutations) => {
      const USERSCRIPT_NOT_DIRTY_CLASS_SELECTOR = `[not(contains(concat(" ",normalize-space(@class)," ")," ${USERSCRIPT_DIRTY_CLASS} "))]`;
      let xPathEvalCallback = (element) => {
        // the xpathClass btn are necessary because those are added later, otherwise we're operating on old elements
        return xPathEval(
          [
            // current bid, green buttons
            `.//a[${xPathClass("btn")}][starts-with(., 'Current Bid')]${USERSCRIPT_NOT_DIRTY_CLASS_SELECTOR}`,
            // current bid, green buttons (yes, theres almost 2 of the exact same ones here
            `.//div[${xPathClass("btn")}][starts-with(., 'Current Bid')]${USERSCRIPT_NOT_DIRTY_CLASS_SELECTOR}`,
            // bid page model, big price
            `.//div[${xPathClass("h1")}]/span${USERSCRIPT_NOT_DIRTY_CLASS_SELECTOR}`,
            // bid amount dropdown
            `.//select/option${USERSCRIPT_NOT_DIRTY_CLASS_SELECTOR}`,
            // status indicator when you have highest bid
            `.//p[${xPathClass("alert")}][starts-with(., " YOU'RE WINNING ")]`,
            // different status indicator that uses slightly different wording
            `.//p[${xPathClass("alert")}][starts-with(., ' You are WINNING ')]`,
            // popup notification telling you you bid
            `.//div[${xPathClass("notification__title")}]`,
          ].join(" | ")
          , element);
      };

      const matchingElems = [...(new Set(mutations
        .map((rec) => {
          if (rec.addedNodes.length === 0) {
            return rec.target;
          }
          return Array.from(rec.addedNodes)
        })
        .flat()))]
        .map(xPathEvalCallback)
        .flat()
      // if we try to modify the nodes right away, we get some weird react errors
      // so instead, we use setTimeout(..., 0) to yield to the async event loop, letting react do its react things
      // and immediately executing this when react is done doing its things
      if (matchingElems) {
        setTimeout(() => {
          for (const elem of matchingElems) {
            processPriceElem(elem);
          }
        }, 0);
      }
    }),
    invoice: new MutationObserver((mutations) => {
      for (const mut of mutations) {
        console.log(mut.addedNodes)
      }
    })
  }

  function setObserver(key, state) {
    const stateKey = `${key}Active`;
    _debug(`${key}=${states[stateKey]}, setting to ${state}`);
    if (states[stateKey] !== state) {
      states[stateKey] = state;
      if (state) {
        mutationObservers[key].observe(document.body, configs[key]);
      } else {
        mutationObservers[key].disconnect();
      }
    }
  }

  function activateTruePriceObserver() {
    setObserver("truePrice", true);
    setObserver("remainingTime", true);
  }

  function deactivateTruePriceObserver() {
    setObserver("truePrice", false);
    setObserver("remainingTime", false);
  }

  function activateInvoiceObserver() {
    setObserver("invoice", true)
  }

  function deactivateInvoiceObserver() {
    setObserver("invoice", false);
  }

  let minTime = MIN_TIME_SENTINEL;
  let numUpdatedSinceLastMinTimeUpdate = 0;


  const bodyObserver = new MutationObserver(function () {
    if (document.body) {
      _log("document.body found, attaching mutation observers");
      activateTruePriceObserver();
      bodyObserver.disconnect();
      // sets the title on initial page load
      onUrlChange(null, document.title, location.pathname);
    }
  });

  return {
    activateTruePriceObserver,
    deactivateTruePriceObserver,
    activateInvoiceObserver,
    deactivateInvoiceObserver,
    bodyObserver
  };
})();

Observer.bodyObserver.observe(document.documentElement, {childList: true});



