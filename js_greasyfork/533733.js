// ==UserScript==
// @name        AO3 Entire work auto link and jump
// @description Open directly as "Entire work" unless the word/chapter ratio is big enough. │ The "Entire work" button jumps down to the current chapter. │ New "Entire next→" bottom button, jump to the next chapter in "Entire work" mode without scrolling. │ Shorten the button names to "←Previous" and "Next→" for mobile.
// @author      C89sd
// @version     1.13
// @match       https://archiveofourown.org/*
// @exclude     /^https:\/\/archiveofourown\.org\/(?:collections\/[^\/]+\/)?works\/\d+(?:\/chapters\/\d+)?\/?(?:\?view_full_work=true)/
// @namespace    https://greasyfork.org/users/1376767
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/533733/AO3%20Entire%20work%20auto%20link%20and%20jump.user.js
// @updateURL https://update.greasyfork.org/scripts/533733/AO3%20Entire%20work%20auto%20link%20and%20jump.meta.js
// ==/UserScript==

'use strict';

// Words/Chapter can have commas 1,234
const isDotComma = /[,\.]/g;
function removeCommaAndDot(str) { return str.replace(isDotComma, ''); }

// 1. Make "Entire Work" button jump to current chapter by appending #chapter-N
const entireWorkButton = document.querySelector('li.chapter.entire > a');
if (entireWorkButton) {
  const firstChapter = document.querySelector('div.chapter');
  const id = firstChapter.id;
  if (id) {
    const entireLink = entireWorkButton.href.split('#')[0];
    if (id !== "chapter-1") entireWorkButton.href = entireLink + "#" + id;

    // 1.2. For every button
    // Rename "Previous Chapter" -> "Previous"
    // Rename "Next Chapter"     -> "Next"
    const nextButtonBars = document.querySelectorAll('ul.actions[role="menu"], ul.actions[role="navigation"]:not(.navigation)'); // 2 bars, top & bottom
    for (const bar of nextButtonBars) {
      const previousButton = Array.from(bar.children).find(li => /^←\ ?Previous/.test(li.textContent));
      const nextButton     = Array.from(bar.children).find(li => li.textContent.startsWith("Next"));

      function stripHash(btn) { let a = btn.firstElementChild; a.href = a.href.split('#')[0]; }

      if (previousButton) {
        previousButton.firstChild.textContent = "← Previous";
        stripHash(previousButton)
      }
      if (nextButton) {
        nextButton.firstChild.textContent     = "Next →";
        stripHash(nextButton)

        let isBottomNextButton = true // nextButton.classList.length === 0; // Top one has ["chapter", "next"]

        // 1.3 Add an "Entire next" button that jumps to the next chapter in Entire work
        if (isBottomNextButton) {
          const customLi   = document.createElement("li");
          const customLink = document.createElement("a");
          const idNext = 1 + parseInt(removeCommaAndDot(id.split('-')[1]), 10)
          customLink.href = entireLink + "#chapter-" + idNext;
          customLink.textContent = "Entire next →";
          customLi.appendChild(customLink);

          nextButton.after(customLi);

          // Add gap
          const spaceNode = document.createTextNode(" ");
          nextButton.after(spaceNode, customLi);
        }
      }
    }
  }
}

const isWork = /works\/(\d+)$/;

// 2. Add '?view_full_work=true' to all links conditionally on word/chapter ratio.
const articles = document.querySelectorAll('li[role="article"]');
for (const article of articles) {

  const link = article.querySelector('h4.heading > a:first-of-type');
  if (!link)
  {
    continue; // Note: "collection/x/bookmarks" may not have links.
  }
  else if (isWork.exec(link.href))
  {
    const words    = article.querySelector('dl.stats > dd.words');
    const chapters = article.querySelector('dl.stats > dd.chapters');
    if (!words || !chapters) {
      console.log('Error (!words||!chapters)', article);
      continue;
    }

    let shouldAdd = true;

    const w = parseInt(removeCommaAndDot(words.textContent), 10);
    const c = parseInt(removeCommaAndDot(chapters.textContent).split('/')[0], 10);
    const ratio = Math.round(w / c);

    // Don't open as "Entire work" if the ratio is large enough.
    // 12,000 words per chapter is always enough, and 8,000 is tolerable.
    // We interpolate between these two values to become more strict as the word count increases.
    // This way, fics with huge word count won't open as "Entire work" unless their ratio is ridiculously low.
    const w1 = 100_000, r1 = 12_000;
    const w2 = 500_000, r2 =  8_000;
    let min_ratio = Math.round(r1 + (r2 - r1) / (w2 - w1) * (w - w1));

    if (ratio > min_ratio) shouldAdd = false;
    if (c == 1)            shouldAdd = false;

    if (shouldAdd) link.href += '?view_full_work=true';

    // const fmt = (n, width = 8) => String(n).padStart(width, ' ');
    // console.log(fmt(w), fmt(ratio,6), fmt(min_ratio,5), shouldAdd?'* ENTIRE WORK':'  normal     ', fmt(c,3), fmt(link.href,43), link.textContent);
  }
}