// ==UserScript==
// @name             eBay - Block sponsored listings
// @description      Blocks ebay sponsored listings by checking whether the 'Sponsored' text is in the bounds of the 'Sponsored' svg image.
// @license          MIT
// @match            https://www.ebay.com/sch/*
// @match            https://www.ebay.at/sch/*
// @match            https://www.ebay.ca/sch/*
// @match            https://www.ebay.ch/sch/*
// @match            https://www.ebay.com.au/sch/*
// @match            https://www.ebay.com.hk/sch/*
// @match            https://www.ebay.com.my/sch/*
// @match            https://www.ebay.com.sg/sch/*
// @match            https://www.ebay.co.uk/sch/*
// @match            https://www.ebay.de/sch/*
// @match            https://www.ebay.es/sch/*
// @match            https://www.ebay.fr/sch/*
// @match            https://www.ebay.ie/sch/*
// @match            https://www.ebay.it/sch/*
// @match            https://www.ebay.nl/sch/*
// @match            https://www.ebay.pl/sch/*
// @version          1.0
// @namespace https://greasyfork.org/users/1508855
// @downloadURL https://update.greasyfork.org/scripts/547305/eBay%20-%20Block%20sponsored%20listings.user.js
// @updateURL https://update.greasyfork.org/scripts/547305/eBay%20-%20Block%20sponsored%20listings.meta.js
// ==/UserScript==

function isSponsored(listing) {

  var element = listing.querySelector('[style*="data:image/svg+xml"]');

  if (!element) {
    return null;
  }

  var style = element.style.backgroundImage;
  var base64 = style.split('base64,')[1].split('"')[0];

  var svgXml = atob(base64);

  var parser = new DOMParser();
  var svgDoc = parser.parseFromString(svgXml, 'image/svg+xml');
  var textElement = svgDoc.querySelector('text');

  var x = parseFloat(textElement.getAttribute('x'));
  x = x + parseFloat(textElement.getAttribute('dx'));

  var y = parseFloat(textElement.getAttribute('y'));
  y = y + parseFloat(textElement.getAttribute('dy'));

  var transform = textElement.getAttribute('transform');
  if (transform && transform.startsWith('translate')) {
      var matches = transform.match(/translate\(([-\d.]+) ([-\d.]+)\)/);
      if (matches) {
          x = x + parseFloat(matches[1]);
          y = y + parseFloat(matches[2]);
      }
  }

  return (x < 100 && x > -100 && y < 100 && y > -100);
}

var selectors = ['.s-item', '.s-card'];
var listings = [];
for (const selector of selectors) {
  listings.push(...document.querySelectorAll(selector));
}

var sponsored = 0;
listings.forEach(item => {
  if (isSponsored(item)) {
    sponsored = sponsored + 1;
    //item.style.backgroundColor = 'red';
    item.style.display = 'none';
  }
});

console.log("Hid", sponsored, "/", listings.length, " elements that matched the 'sponsored listings' test.");