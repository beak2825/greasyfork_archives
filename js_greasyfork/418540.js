// ==UserScript==
// @name         Munzee Map Permalinks
// @version      2.0
// @description  Adds a Map Permalink button to events on the Munzee Calendar.
// @author       sohcah
// @match        https://calendar.munzee.com/*
// @grant        none
// @namespace https://greasyfork.org/users/398283
// @downloadURL https://update.greasyfork.org/scripts/418540/Munzee%20Map%20Permalinks.user.js
// @updateURL https://update.greasyfork.org/scripts/418540/Munzee%20Map%20Permalinks.meta.js
// ==/UserScript==

// NOTE: Based on https://greasyfork.org/en/scripts/444804-crunchyroll-watchlist-userscript/code
const h = '__REACT_DEVTOOLS_GLOBAL_HOOK__';
if (!window[h]) {
  window[h] = {
    onCommitFiberRoot: () => 0,
    onCommitFiberUnmount: () => 0,
    inject(renderer) {
        this.renderers.push(renderer)
    },
    checkDCE: () => 0,
    supportsFiber: true,
    on: () => 0,
    sub: () => 0,
    renderers: [],
    emit: () => 0
  };
}


const BITS = [16, 8, 4, 2, 1];

const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
const NEIGHBORS = {
  right: { even: "bc01fg45238967deuvhjyznpkmstqrwx" },
  left: { even: "238967debc01fg45kmstqrwxuvhjyznp" },
  top: { even: "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
  bottom: { even: "14365h7k9dcfesgujnmqp0r2twvyx8zb" }
};
const BORDERS = {
  right: { even: "bcfguvyz" },
  left: { even: "0145hjnp" },
  top: { even: "prxz" },
  bottom: { even: "028b" }
};

NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
NEIGHBORS.top.odd = NEIGHBORS.right.even;
NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
NEIGHBORS.right.odd = NEIGHBORS.top.even;

BORDERS.bottom.odd = BORDERS.left.even;
BORDERS.top.odd = BORDERS.right.even;
BORDERS.left.odd = BORDERS.bottom.even;
BORDERS.right.odd = BORDERS.top.even;

function encodeGeoHash(latitude, longitude) {
  let is_even = 1;
  const lat = [];
  const lon = [];
  let bit = 0;
  let ch = 0;
  const precision = 9;
  let geohash = "";
  let mid;

  lat[0] = -90.0;
  lat[1] = 90.0;
  lon[0] = -180.0;
  lon[1] = 180.0;

  while (geohash.length < precision) {
    if (is_even) {
      mid = (lon[0] + lon[1]) / 2;
      if (longitude > mid) {
        ch |= BITS[bit];
        lon[0] = mid;
      } else
        lon[1] = mid;
    } else {
      mid = (lat[0] + lat[1]) / 2;
      if (latitude > mid) {
        ch |= BITS[bit];
        lat[0] = mid;
      } else
        lat[1] = mid;
    }

    is_even = !is_even;
    if (bit < 4)
      bit++;
    else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}

function getCoordinates() {
  const renderer = __REACT_DEVTOOLS_GLOBAL_HOOK__.renderers.values().next().value;
  const divFiber = renderer.findFiberByHostInstance(document.querySelector("#event-page"));
  const eventPageComponentFiber = divFiber.return.return.return;

  function findStateWhere(memoizedState, predicate) {
    if (predicate(memoizedState)) {
      return memoizedState;
    }
    if (memoizedState.next) {
      return findStateWhere(memoizedState.next, predicate);
    }
    return null;
  }

  const eventPageComponentState = findStateWhere(eventPageComponentFiber.memoizedState, state => state?.baseState?.latitude);
  return {
    latitude: eventPageComponentState?.baseState?.latitude,
    longitude: eventPageComponentState?.baseState?.longitude
  };
}


// Create mutation observer which finds creation or changes to [alt="Event Indicator Pin"], and logs the coordinates
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if(!mutation?.target?.querySelector) return;
    const link = [...mutation.target.querySelectorAll("[href*=\"/m/EventIndicator/\"]")]
      .find(element => element.href.match(/\/m\/EventIndicator\/\d+\/?$/));
    if (!link) return;

    // Repeat until coordinates are found (lat/long are not null)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (attempts > 10) {
        clearInterval(interval);
        return;
      }
      const coordinates = getCoordinates();
      if (coordinates.latitude && coordinates.longitude) {
        console.log(coordinates);
        const tag = link.parentElement.querySelector(".sohcah-patch-coordinates") || document.createElement("a");
        tag.textContent = `| 📌 Map Link`;
        tag.href = `https://www.munzee.com/map/${encodeGeoHash(coordinates.latitude, coordinates.longitude)}/16`;
        tag.target = "_blank";
        tag.rel = "noopener noreferrer";
        tag.className = "sohcah-patch-coordinates";

        if(!tag.parentElement) {
          link.parentElement.appendChild(tag);
        }
        clearInterval(interval);
      }
    }, 100);
  });
});

// Observe changes to the document
observer.observe(document, {
  childList: true,
  subtree: true
});
