// ==UserScript==
// @name         Arrow Keys: Next/Prev Chapter
// @namespace    https://greasyfork.org/users/45933
// @version      0.1.13
// @author       Fizzfaldt
// @license      MIT
// @description  Arrow Key Keyboard shortcuts for Multiple Sites (next/prev chapter)
// @run-at       document-end
// @grant        none
// @noframes
// @nocompat    Chrome
// @match        *://*.archiveofourown.org/*/chapters/*
// @match        *://*.asuratoon.com/*
// @match        *://*.asuracomic.net/*
// @match        *://*.fanfiction.net/*
// @match        *://*.flamescans.com/*chapter*
// @match        *://*.manga-scans.com/chapter/*
// @match        *://*.oglaf.com/*
// @match        *://*.realmscans.xyz/*-chapter-*
// @match        *://*.reaperscans.com/*
// @match        *://*.tthfanfic.org/*
// @match        *://*.webtoons.com/*/viewer*episode_no=*
// @match        *://*.wuxiaworld.co/*
// @match        *://*.xcalibrscans.com/*-chapter-*
// @match        *://*.strongfemaleprotagonist.com/*
// @downloadURL https://update.greasyfork.org/scripts/417332/Arrow%20Keys%3A%20NextPrev%20Chapter.user.js
// @updateURL https://update.greasyfork.org/scripts/417332/Arrow%20Keys%3A%20NextPrev%20Chapter.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function xPathResultToUniqueNode(x, context) {
    'use strict';
    if (!x) {
        alert("NULL xPathResult! " + context);
    }
    let first = x.iterateNext();
    if (!first) {
        alert("No xPathResult node! " + context);
        return;
    }
    let second = x.iterateNext();
    while (second != null && second.value == first.value) {
        second = x.iterateNext();
    }
    if (second != null && second.value != first.value) {
        alert("xPathResult had unique second node! [" + second + " ] " +
              context +
              " values [" + first.value + "]!=[" + second.value + "]");
    }
    return first;
}

const prev = "prev";
const next = "next";

function getXpaths() {
   'use strict';

   // fixme: Switch to css selectors as xpath getting annoying
   var xpaths = {
      "archiveofourown.org" : {
         prev : '//a[@href and text()="← Previous Chapter"]/@href',
         next : '//a[@href and text()="Next Chapter →"]/@href',
      },
      "asuracomic.net" : {
         prev : '(//a[.//h2[normalize-space()="Prev"]])[1]/@href',
         next : '(//a[.//h2[normalize-space()="Next"]])[1]/@href',
      },
      "asuratoon.com" : {
         prev : '//a[@class="ch-prev-btn" and @href]/@href',
         next : '//a[@class="ch-next-btn" and @href]/@href',
      },
      "fanfiction.net" : {
         prev : '//button[@class="btn" and contains(@onclick, "self.location=") and text()="< Prev"]/@onclick',
         next : '//button[@class="btn" and contains(@onclick, "self.location=") and text()="Next >"]/@onclick',
      },
      "flamescans.org" : {
         prev : '//a[@class="ch-prev-btn" and @href]/@href',
         next : '//a[@class="ch-next-btn" and @href]/@href',
      },
      "manga-scans.com" : {
         prev : '//div[@class="col-md-6 prev-post"]/a/@href',
         next : '//div[@class="col-md-6 next-post"]/a/@href',
      },
      "oglaf.com" : {
         prev : '//a[@accesskey="k"]/@href',
         next : '//a[@accesskey="j"]/@href',
      },
      "realmscans.xyz" : {
         prev : '//a[@class="ch-prev-btn" and @href]/@href',
         next : '//a[@class="ch-next-btn" and @href]/@href',
      },
      "reaperscans.com" : {
         prev : '//a[@href and text()="\nPrevious\n" and 1]/@href',
         next : '//a[@href and text()="\nNext\n" and 1]/@href',
      },
      "strongfemaleprotagonist.com" : {
         prev : '(//a[contains(concat(" ", normalize-space(@class), " "), " page-nav__item--left ") and @href])[1]/@href',
         next : '(//a[contains(concat(" ", normalize-space(@class), " "), " page-nav__item--right ") and @href])[1]/@href',
      },
      "tthfanfic.org" : {
         prev : '//a[@href and text()="Prev Chapter DOES NOT EXIST I THINK" and 1]/@href',
         next : '//a[@href and @accesskey="n"]/@href',
      },
      "webtoons.com" : {
         prev : '//a[contains(concat(" ", normalize-space(@class), " "), " _prevEpisode ") and @href]/@href',
         next : '//a[contains(concat(" ", normalize-space(@class), " "), " _nextEpisode ") and @href]/@href',
      },
      "wuxiaworld.co" : {
         prev : '//a[@class="prev" and @href]/@href',
         next : '//a[@class="next" and @href]/@href',
      },
      "wuxiaworld.com" : {
         prev : '//li[@class="prev"]/a[contains(@class, "btn-link") and @href]/@href',
         next : '//li[@class="next"]/a[contains(@class, "btn-link") and @href]/@href',
      },
      "xcalibrscans.com" : {
         prev : '//a[@class="ch-prev-btn" and @href]/@href',
         next : '//a[@class="ch-next-btn" and @href]/@href',
      },
   };

   var domain = location.hostname;
   while (domain != '') {
      if (domain in xpaths) {
         return xpaths[domain];
      }
      // Strip one subdomain and try again
      let temp = domain.split('.');
      temp.shift();
      domain = temp.join('.');
   }
   return null;
}

var pathsForHost = getXpaths();

function arrows(e) {
    'use strict';
    /*
Backspace    8
Tab          9
Enter       13
Shift       16
Control     17
Alt         18
CapsLock    20
Escape      27
Space       32
PageUp      33
PageDown    34
End         35
Home        36
ArrowLeft   37
ArrowUp     38
ArrowRight  39
ArrowDown   40
Delete      46
*/
    if (document.activeElement.tagName == "TEXTAREA") {
        // Do nothing when inside a text field.
        return;
    }
    if (e.ctrlKey || e.shiftKey || e.altKey || e.metaKey) {
        // Do nothing when modifiers are held (e.g. allow Alt+Left to go back/...
        return;
    }

    var result;
    switch (e.keyCode) {
        case 37: // Left
            result = document.evaluate(pathsForHost[prev], document, null, XPathResult.ANY_TYPE, null);
            break;
        case 39: // Right
            result = document.evaluate(pathsForHost[next], document, null, XPathResult.ANY_TYPE, null);
            break;
            // case 38: // Up
            // case 40: // Down
        default:
            return;
    }
    let linkHref = xPathResultToUniqueNode(result);
    let href = linkHref.value;
    // Handle location actually being javascript command
    href = href.replace(/^self.location='(.*)'$/, '$1');
    location.href=href;
}

if (pathsForHost) {
    document.addEventListener('keyup', arrows);
}