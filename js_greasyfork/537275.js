// ==UserScript==
// @name           jx-google-play-breaker
// @version        1.0.0
// @namespace      https://github.com/JenieX/user-js-next
// @description    Break the scrips on Google Play store and linkify the screenshot images.
// @author         JenieX
// @match          https://play.google.com/*
// @grant          none
// @run-at         document-start
// @noframes
// @compatible     chrome Violentmonkey
// @compatible     edge Violentmonkey
// @supportURL     https://github.com/JenieX/user-js-next/issues
// @homepageURL    https://github.com/JenieX/user-js-next/tree/main/google-play-breaker
// @icon           http://www.google.com/s2/favicons?domain=play.google.com&sz=128
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/537275/jx-google-play-breaker.user.js
// @updateURL https://update.greasyfork.org/scripts/537275/jx-google-play-breaker.meta.js
// ==/UserScript==

function isString(object) {
  return typeof object === 'string';
}

/**
 * Joins an array's items or do nothing if it is joined already.
 *
 * @category Array
 */
function join(object, separator = ',') {
  if (isString(object)) {
    return object;
  }

  return object.join(separator);
}

let infoObject;
if (typeof GM !== 'undefined') {
  infoObject = GM.info;
  // eslint-disable-next-line unicorn/no-negated-condition
}
else if (typeof GM_info === 'undefined') {
  infoObject = { script: { name: document.title } };
}
else {
  infoObject = GM_info;
}

const scriptName = infoObject.script.name;

function alert(message) {
  if (message === undefined) {
    window.alert(`[ ${scriptName} ]`);

    return;
  }

  window.alert(`[ ${scriptName} ]\n\n${message}`);
}

function $$(selectors, parent) {
  const elements = (parent ?? document).querySelectorAll(join(selectors));
  if (elements.length === 0) {
    throw new Error(`Could not find any element with the selector ${selectors}`);
  }

  return elements;
}

/**
 * Waits for the page to load.
 * @param completely Whether or not to wait for resources to load as well.
 */
async function pageLoad(completely) {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      resolve();

      return;
    }

    if (completely === true) {
      window.addEventListener('load', () => resolve());

      return;
    }

    document.addEventListener('DOMContentLoaded', () => resolve());
  });
}

Object.defineProperty(window, 'WIZ_global_data', {
  set() {},
  get() {
    return 'Hello world!';
  },
});

async function main() {
  await pageLoad();
  const imgElements = $$('img[data-screenshot-index]');

  for (const imgElement of imgElements) {
    const aElement = document.createElement('a');
    aElement.href = imgElement.src.replace(/=w.+/, '=w0');
    aElement.target = '_blank';
    imgElement.parentNode.insertBefore(aElement, imgElement);
    aElement.append(imgElement);
  }
}

main().catch((exception) => {
  alert(exception.message);
});