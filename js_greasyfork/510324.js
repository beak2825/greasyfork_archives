// ==UserScript==
// @name     Instacart Ad Remover
// @description Blocks those nasty Instacart ads on various pages, including in search, store home page, user home page, cart, etc.
// @version  70
// @license      MIT
// @match    https://*.instacart.ca/*
// @match    https://*.instacart.com/*
// @grant    GM_addStyle
// @namespace https://greasyfork.org/users/1354160
// @downloadURL https://update.greasyfork.org/scripts/510324/Instacart%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/510324/Instacart%20Ad%20Remover.meta.js
// ==/UserScript==

unsafeWindow.Element.prototype._attachShadow = unsafeWindow.Element.prototype.attachShadow;
unsafeWindow.Element.prototype.attachShadow = function () {
  return this._attachShadow({
    mode: "open"
  });
};

function waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals) {
  if (typeof waitOnce === "undefined") {
    waitOnce = true;
  }
  if (typeof interval === "undefined") {
    interval = 300;
  }
  if (typeof maxIntervals === "undefined") {
    maxIntervals = -1;
  }
  var targetNodes =
    typeof selectorOrFunction === "function" ?
    selectorOrFunction() :
    document.querySelectorAll(selectorOrFunction);

  var targetsFound = targetNodes && targetNodes.length > 0;
  if (targetsFound) {
    targetNodes.forEach(function (targetNode) {
      var attrAlreadyFound = "data-userscript-alreadyFound";
      var alreadyFound = targetNode.getAttribute(attrAlreadyFound) || false;
      if (!alreadyFound) {
        var cancelFound = callback(targetNode);
        if (cancelFound) {
          targetsFound = false;
        } else {
          targetNode.setAttribute(attrAlreadyFound, true);
        }
      }
    });
  }

  if (maxIntervals !== 0 && !(targetsFound && waitOnce)) {
    maxIntervals -= 1;
    setTimeout(function () {
      waitForKeyElements(selectorOrFunction, callback, waitOnce, interval, maxIntervals);
    }, interval);
  }
}

let sponsoredTexts = ["promoted", "sponsoreed", "sponsored", "spaahnserd", "spawhnserd", "spawnserd", "spaunsered", "spaunserd", "spauncered", "spauncerd", "spohnserd", "spohncerd", "spohncered", "spawncerd", "spawncered"]

function isSponsored(elem) {
  if (elem) {
    // var descendentDivs = elem.querySelectorAll('section, div')

    // var sponsored = Array.from(descendentDivs).find(div => div !== null && div.shadowRoot !== null)

    // if (sponsored) {
      // return true;
    // } else return false;

    const sponsored = elem.querySelector('*[data-cfp-eligible]')

    if (sponsored) {
      return true;
    } else return false;

  } else return false
}

function isSponsoredImg(img) {
  if (img) {
    let attrs = Array.from(img.attributes)

    let isSponsored = attrs.find(({
      name,
      value
    }) => sponsoredTexts.find(txt => value.toLowerCase().includes(txt)))

    // let ariaLabel = img.getAttribute('aria-label')
    // if (sponsoredTexts.includes(img.alt.toLowerCase().trim()) || (ariaLabel && sponsoredTexts.includes(img.getAttribute('aria-label').toLowerCase().trim()))) {
    if (isSponsored) {
      return true;
    } else return false;

  } else return false
}

function individualItems(jNode) {
  let li = jNode.closest('li')

  if (isSponsored(li)) {
    let parent = li.parentNode;
    if (parent.tagName == 'DIV') {
      parent.style.display = 'none'
    } else {
      li.style.display = 'none';
    }
  }
}

function undesiredElement(jNode) {
  jNode.style.display = 'none'
}

function blockAdsInSearch() {
  // var lists = document.querySelectorAll('#store-wrapper .e-1yrpusx:not([style*="display:none"]):not([style*="display: none"]) > ul')

  let [head, ...tail] = [].filter.call(document.querySelectorAll('#store-wrapper .e-1yrpusx:not([style*="display:none"]):not([style*="display: none"]) > ul'), function (elem) {
    return elem.querySelector('div[aria-label="Product"]')
  });

  // lists.filter(list => list.querySelector('div[aria-label="Product"]') !== null)
  if (head) {
    let mainList = head
    let otherLists = tail.map(node => node.querySelectorAll('li'))

    otherLists.forEach(itemList => itemList.forEach(item => mainList.append(item)))

    tail.forEach(node => node.style.display = "none")

    mainList.childNodes.forEach(item => {
      if (isSponsored(item)) {
        item.style.display = 'none';
      }
    })
  }
}

function blockAdsInCart(jNode) {
  let div = jNode

  if (div.innerHTML.indexOf('Suggested items') != -1) {
    div.style.display = 'none'
  }
}

function homeBanner(jNode) {
  let carousel = jNode.closest('div[aria-label="carousel"]')

  if (carousel) {
    carousel.style.display = "none"
  }
}

function getbyXpath(xpath, contextNode) {
  let results = [];
  let query = document.evaluate(xpath, contextNode || document,
    null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0, length = query.snapshotLength; i < length; ++i) {
    results.push(query.snapshotItem(i));
  }
  return results;
}

function defaultTip(jNode) {
  const spans = jNode.querySelectorAll('span');

  const otherSpan = [...spans].filter(span => span.innerHTML == 'Other')[0]

  if (otherSpan) {
    let otherBtn = otherSpan.closest('button')
    otherBtn.click()

    const tipDiv = document.querySelector('div[aria-label="Say thanks with a tip"]')
    tipDiv.querySelector('#radio-base-option-4').click()

    const otherInput = tipDiv.querySelector('input[placeholder="Other amount"]')
    otherInput.focus();

    waitForKeyElements('div[aria-label="Say thanks with a tip"] button:has(span)', function (jNode) {
      const btn = jNode

      if (btn.innerText.includes('Continue')) {
        btn.click()
      }
    }, false)
  }
}

function sponsoredCarousel(jNode) {
  let elem = jNode

  function traverseAncestors(node) {
    if (node) {
      if (node.tagName == 'DIV') {
        // let spans = node.querySelectorAll('span')
        // let sponsoredSpans = [...spans].filter(span => span.innerHTML == ' nsored')
        let imgs = node.querySelectorAll('img')
        let sponsoredImgs = [...imgs].filter(img => isSponsoredImg(img))
        let individualSponsored = isSponsored(node)
        let scrollbars = node.querySelectorAll('.u-noscrollbar')

        if ((sponsoredImgs.length > 0) && (!individualSponsored) && (scrollbars.length == 1)) {
          console.log(node)
          node.style.display = 'none';
        } else if (scrollbars.length > 1) {
          return;
        } else {
          traverseAncestors(node.parentNode);
        }
      } else traverseAncestors(node.parentNode)
    }
  }

  if (!window.location.href.endsWith('homeTabForYou')) {
    traverseAncestors(elem.parentNode)
  }
}

function sponsoredPlacement(jNode) {
  let node = jNode

  let imgs = node.querySelectorAll('img')
  let sponsoredImgs = [...imgs].filter(img => isSponsoredImg(img))

  if ((sponsoredImgs.length > 0)) {
    node.style.display = 'none';
  }
}

function continueToNext(jNode) {
  let span = jNode

  if (span.innerText === 'Continue to checkout') {
    setTimeout(function () {
      span.closest('button').click();
    }, 500);
  }
}

waitForKeyElements('#store-wrapper div[aria-label="Product"]', blockAdsInSearch, false);
waitForKeyElements('#store ul li div[aria-label="Product"] > div', individualItems, false);
waitForKeyElements('#store-wrapper div[data-testid="regimen-section"]', undesiredElement, false);
waitForKeyElements('#cart-body > div', blockAdsInCart, false);
waitForKeyElements('#store-wrapper div[aria-label="Treatment Tracker modal"]', undesiredElement, false) // offer banner at bottom
waitForKeyElements('#store div[aria-label="announcement"]', undesiredElement, false)
waitForKeyElements('#store-wrapper div[aria-label="Tip Options"]', defaultTip, false)
waitForKeyElements('#store-wrapper .u-noscrollbar', sponsoredCarousel, false)
waitForKeyElements('footer span', continueToNext, false)
waitForKeyElements('#storefront-placements-content article', sponsoredPlacement, false)
waitForKeyElements('#store-wrapper article', sponsoredPlacement, false)
waitForKeyElements('#store-wrapper div[role="region"] > section', sponsoredPlacement, false)
waitForKeyElements('div[data-testid="recommendations-placements-feed"]', undesiredElement, false)