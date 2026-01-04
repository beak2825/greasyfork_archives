// ==UserScript==
// @name         Shop by Interest Highlighter
// @version      1.0.0
// @description  Highlights matches between categories and listings
// @author       lucassilvas1
// @match        https://www.mturkcontent.com/*
// jshint        esversion: 8
// @namespace https://greasyfork.org/users/846945
// @downloadURL https://update.greasyfork.org/scripts/491604/Shop%20by%20Interest%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/491604/Shop%20by%20Interest%20Highlighter.meta.js
// ==/UserScript==

(function () {
  if (
    !document
      .querySelector("classification-target h2")
      .textContent.startsWith("Is the below item relevant")
  ) {
    return;
  }

  // grab elements to replace existing textContent with hightlighted elements
  const textEl = document.querySelector("classification-target a div");
  const keywordsEl = document.querySelector("classification-target span");

  // grab category and listing to highlight
  const text = textEl.textContent;
  // get rid of the single quotes and underscores
  const keywords = keywordsEl.textContent.slice(1, -1).replaceAll("_", " ");

  const [textSegments, keywordSegments] = findMatchingIndices(text, keywords);

  if (!textSegments.length) return; // nothing to highlight, just quit

  // get rid of existing text
  textEl.textContent = "";
  keywordsEl.textContent = "";

  // colors that can be used to highlight the keywords
  const lightColors = [
    "aqua",
    "aquamarine",
    "azure",
    "bisque",
    "blue",
    "blueviolet",
    "cadetblue",
    "chartreuse",
    "chocolate",
    "coral",
    "cornflowerblue",
    "crimson",
    "darkblue",
    "darkorange",
    "darkorchid",
    "forestgreen",
  ];
  // maps keywords to unique colors
  const keywordColors = mapKeywordColors(
    keywords,
    keywordSegments,
    lightColors
  );

  appendElements(textEl, text, textSegments, keywordColors);
  appendElements(keywordsEl, keywords, keywordSegments, keywordColors);
})();

/**
 *
 * @param {HTMLElement} parent
 * @param {string} str
 * @param {number[][]} segments
 * @param {Map<string, string>} colorMap
 */
function appendElements(parent, str, segments, colorMap) {
  let i = 0;
  const len = segments.length;

  // create element with first chars if first segment doesn't start at index 0
  if (segments[0][0] > 0) {
    parent.appendChild(createElement(str.slice(0, segments[0][0])));
  }

  while (true) {
    const segment = segments[i];
    const keyword = str.slice(segment[0], segment[1]);
    parent.appendChild(
      createElement(keyword, colorMap.get(keyword.toLowerCase()))
    );
    // if current segment is last, then next element should go to the end of str
    const nextStartIdx = segments[i + 1]?.[0] ?? str.length;
    i = i + 1;
    // check if there's gap between current and next segment
    if (segment[1] === nextStartIdx[0]) continue;
    // create an element with the chars between current and next segment
    parent.appendChild(createElement(str.slice(segment[1], nextStartIdx)));
    if (i === len) break;
  }
}

/**
 * @param {string} keywords
 * @param {number[][]} keywordSegments
 * @param {string[]} colors
 * @returns {Map<string, string>}
 */
function mapKeywordColors(keywords, keywordSegments, colors) {
  keywords = keywords.toLowerCase();
  return new Map(
    keywordSegments.map(([start, end]) => [
      keywords.slice(start, end),
      colors.pop(),
    ])
  );
}

/**
 * @param {string} text
 * @param {string | undefined} color
 * @returns {HTMLSpanElement}
 */
function createElement(text, color) {
  const span = document.createElement("span");
  if (color) span.style.color = color;
  span.textContent = text;
  return span;
}

/**
 * @param {string} keywords
 * @returns {Map<string, number[]>}
 */
function mapKeywordChars(keywords) {
  const map = new Map();

  for (let i = 0, len = keywords.length; i < len; i++) {
    const idxArray = map.get(keywords[i]);
    if (idxArray) idxArray.push(i);
    else map.set(keywords[i], [i]);
  }

  return map;
}

/**
 * @param {string} str
 * @param {number} start
 * @param {number} end
 * @param {number[][]} segments
 */
function pushSegment(str, start, end, segments) {
  // if start !== -1 and end > start here, that means we have a match with len >= 1
  if (start === -1 || end - start < 3) return;

  // trim spaces before pushing
  if (str[start] === " ") start++;
  if (str[end - 1] === " ") end--;

  const prevSegment = segments.at(-1);
  if (prevSegment) {
    // push if new segment ends before or starts after the previous one
    if (end <= prevSegment[0] || start >= prevSegment[1]) {
      segments.push([start, end]);
    }
    // if new segment is longer than the last one, replace it
    else if (end > prevSegment[1]) {
      segments[segments.length - 1] = [start, end];
    }
  } else segments.push([start, end]); // add segment if there's no other segment
}

/**
 * @param {string} text
 * @param {string} keywords
 * @returns {[number[][], number[][]]}
 */
function findMatchingIndices(text, keywords) {
  text = text.toLowerCase();
  keywords = keywords.toLowerCase();

  // keep start and end indices for matches found
  let tSegments = []; // text segments
  let kSegments = []; // keyword segments
  const keywordCharMap = mapKeywordChars(keywords); // used to improve performance

  let oldTextIdx = 0; // index of `text` before a char match was found
  let tStart = -1; // index of the beginning of the potential matching segment
  let kStart = -1; // ^^^

  let tLen = text.length;
  let kLen = keywords.length;

  for (let i = 0; i < tLen; i++) {
    // no need to loop if char is not in keywords
    if (!keywordCharMap.get(text[i])) continue;
    oldTextIdx = i; // here to avoid infinite loops
    // runs past the length so that the if statement can run at the end of the string
    for (let j = 0; j <= kLen; j++) {
      // keep checking until we find two chars that match
      if (text[i] !== keywords[j]) {
        // need to save it before `i` gets reset
        pushSegment(text, tStart, i, tSegments);
        pushSegment(keywords, kStart, j, kSegments);
        // next line ensures that we go back to looking for a match for the
        // previous char when the current streak ends
        i = oldTextIdx;
        tStart = -1;
        kStart = -1;
        j = keywordCharMap.get(text[i]).find((idx) => idx > j) - 1 || 1_000_000;
        continue;
      }
      if (tStart === -1) tStart = i; // found the start of a potential matching segment
      if (kStart === -1) kStart = j; // ^^^
      // save the current text index so we can revert to it to look for
      // potentially longer matching segments
      oldTextIdx = i++;
    }
  }

  // segmentsneed to be sorted and deduped, otherwise `appendElements` will freak out
  tSegments = dedupe(tSegments);
  kSegments = dedupe(kSegments);

  return [tSegments, kSegments];
}

/**
 * @param {number[][]} segments
 */
function dedupe(segments) {
  segments.sort((a, b) => a[1] > b[1]);
  return segments.filter(
    ([start, end], i) =>
      !segments[i - 1] ||
      (start !== segments[i - 1][0] && end !== segments[i - 1][1])
  );
}
