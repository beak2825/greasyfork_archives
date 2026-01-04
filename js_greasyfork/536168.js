// ==UserScript==
// @name           fitgirl-safer-content
// @version        1.0.5
// @namespace      https://github.com/JenieX/user-js-next
// @description    Remove games that are tagged as adult games.
// @author         JenieX
// @match          https://fitgirl-repacks.site/*
// @run-at         document-start
// @noframes
// @compatible     edge Violentmonkey
// @compatible     chrome Violentmonkey
// @supportURL     https://github.com/JenieX/user-js-next/issues
// @homepageURL    https://github.com/JenieX/user-js-next/tree/main/fitgirl-safer-content
// @icon           https://fitgirl-repacks.site/wp-content/uploads/2016/08/cropped-icon-192x192.jpg
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/536168/fitgirl-safer-content.user.js
// @updateURL https://update.greasyfork.org/scripts/536168/fitgirl-safer-content.meta.js
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

function $(selectors, parent) {
  const element = (parent ?? document).querySelector(join(selectors));
  if (element === null) {
    throw new Error(`Could not find the element with the selector ${selectors}`);
  }

  return element;
}

function $$(selectors, parent) {
  const elements = (parent ?? document).querySelectorAll(join(selectors));
  if (elements.length === 0) {
    throw new Error(`Could not find any element with the selector ${selectors}`);
  }

  return elements;
}

function addStyle(css, parent = document.documentElement) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = css;
  parent.append(style);

  return style;
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

addStyle('article .entry-content img:not([class*=swiper-]):not([class=alignleft]):not([class*=non-adult]){display:none}');

async function main() {
  await pageLoad();
  const articleElements = $$('article');

  for (const articleElement of articleElements) {
    const firstPElement = $('p', articleElement);
    if (firstPElement.textContent?.includes('Adult')) {
      articleElement.remove();
    }
    else {
      const imgElements = $$('img', articleElement);

      for (const imgElement of imgElements) {
        imgElement.classList.add('non-adult');
        // Extra functionality to clean the screenshots links.
        const anchorElement = imgElement.parentElement;
        const { origin, pathname } = anchorElement;
        anchorElement.href = `${origin}/${pathname}`;
      }
    }
  }
}

main().catch((exception) => {
  console.error(exception.message);
});
