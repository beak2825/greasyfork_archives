// ==UserScript==
// @name        FIMFiction - Remaining Words and Reading Time
// @namespace   Selbi
// @include     http*://fimfiction.net/*
// @include     http*://www.fimfiction.net/*
// @version     3.2
// @description Displays average reading time left and overall story progress.
// @downloadURL https://update.greasyfork.org/scripts/1840/FIMFiction%20-%20Remaining%20Words%20and%20Reading%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/1840/FIMFiction%20-%20Remaining%20Words%20and%20Reading%20Time.meta.js
// ==/UserScript==

//////////////////////////////////////
// Read Time in Words-Per-Minute
const WPM = 220;
// You must enter your own speed!
//////////////////////////////////////

(function() {
  // Set up CSS
  let style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    #remainingTimeNode {
      font-size: 90%;
      opacity: 0.8;
      margin-right: 1em;
    }

    #progressBarProgressNode {
      background-color: green;
      height: inherit;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      transition: width 0.2s ease-out;
    }

    .readTime {
      font-size: 80%;
      opacity: 0.5;
      margin-right: 1em;
    }

    @media (max-width: 1280px) { 
      .story_container .chapters-footer .word_count {
        position: initial;
        margin-top: 6px;
      }

      .story_container .chapters-footer {
        padding-right: 10px;
      }
    }
  `;
  document.querySelector("head").appendChild(style);
  
  // Parse on page load
  let storyContainers = document.querySelectorAll("article.story_container");
  for (story of storyContainers) {
    parseStory(story);
  }
  
  function parseStory(story) {
    // Global variables
    let readWordsNode = document.createElement("b");
    let outOfTextNode = document.createElement("span");
    let totalWordCountElem = story.querySelector(".chapters-footer > .word_count > b");
    let remainingTimeNode = document.createElement("span");
    remainingTimeNode.id = "remainingTimeNode";
    let progressBarProgressNode = document.createElement("div");
    progressBarProgressNode.id = "progressBarProgressNode";
    let totalWordCount = parseIntFull(totalWordCountElem.innerHTML);
    let totalReadWords = 0;
    let readChapters = 0;
    let totalChapters = 0;

    // Reusable hook (with timeout troubleshooting)
    let updateHandler = function(){ setTimeout(function(){ updateRemainingReadTime(); }, 1000); };

    // One-time call at page loag
    (function init() {
      // Add hook for toggle all chapters button
      story.querySelector(".chapters-footer > a").addEventListener("click", updateHandler, false);

      // Parse chapters for the first time
      readWordsNode.innerHTML = numberWithCommas(totalWordCount - parseChapters());

      // "x of y words" box
      outOfTextNode.innerHTML = " of ";
      totalWordCountElem.before(outOfTextNode);
      outOfTextNode.before(readWordsNode);
      
      // Write total remaining reading time
      writeReadTime();
      readWordsNode.before(remainingTimeNode);

      // Create and insert the progress bar
      let progressBarNode = document.createElement("div");
      progressBarNode.style.height = "4px";
      let barWidth = getPercent(totalReadWords, totalWordCount);
      progressBarProgressNode.title = barWidth;
      progressBarProgressNode.style.width = barWidth;
      progressBarNode.appendChild(progressBarProgressNode);
      story.querySelector(".chapters-footer").after(progressBarNode);
    })();

    // Central function to read the word count and reading status of each chapter
    // Also adds reading times for each chapter on page loag
    function parseChapters() {
      // All chapters minus the "Show" button for long stories
      let chapterElems = story.querySelectorAll(".chapters > li > div:not(.chapter_expander)");
      totalChapters = chapterElems.length;
      
      // Reset accus
      let readWords = 0;
      readChapters = 0;
      
      for (let ch of chapterElems) {
        // Element references
        let readIconElem = ch.querySelector("a.chapter-read-icon");
        let wordCountElem = ch.querySelector("div.word_count span.word-count-number");
        
        // Skip unpublished chapters
        if (readIconElem.parentNode.querySelector("img") != null) {
          totalChapters--;
          continue;
        }
        
        // Total word count
        let chapterWordCount = parseIntFull(wordCountElem.innerHTML);
        
        // Check if chapter is read
        let isRead = readIconElem.classList.contains("chapter-read");
        
        // Increase global read progress
        if (isRead) {
          readWords += chapterWordCount;
          readChapters++;
        }
        
        // Check if this is an in-progress chapter add its partial read percentage if available
        let readProgress = ch.parentElement.querySelector(".read-progress");
        let partialReadWordsForChapter = 0;
        if (readProgress != null) {
          let inProgressReadPercentage = parseFloat(readProgress.style.width) / 100.0;
          partialReadWordsForChapter = Math.round(chapterWordCount * inProgressReadPercentage);
          if (!isRead) {
            readWords += partialReadWordsForChapter;
          }
        }
        
        // Reading time
        let readTimeNode = wordCountElem.parentNode.querySelector(".readTime");
        if (readTimeNode == null) {
          // Create new
          readTimeNode = document.createElement("span");
          readTimeNode.classList = "readTime";
          wordCountElem.before(readTimeNode);
          wordCountElem.parentNode.title = getPercent(chapterWordCount, totalWordCount);

          // Hook
          readIconElem.addEventListener("click", updateHandler, false);
        }
        
        let readTimeText = convertToTime(chapterWordCount);
        if (partialReadWordsForChapter > 0) {
          readTimeText = convertToTime(chapterWordCount - partialReadWordsForChapter) + " (of " + convertToTime(chapterWordCount) + ")";
        }
        readTimeNode.innerHTML = readTimeText;
      }
      
      if (readChapters >= totalChapters) {
        totalReadWords = totalWordCount;
      } else {
        totalReadWords = readWords;
      }
      return readWords;
    }

    // Gets called on page load and on every
    function updateRemainingReadTime() {
      readWordsNode.innerHTML = numberWithCommas(parseChapters());
      writeReadTime();
      let percent = getPercent(totalReadWords, totalWordCount);
      progressBarProgressNode.style.width = percent;
      progressBarProgressNode.title = percent;
    }

    // Read time with respect to the fact whether a story is read or not
    function writeReadTime() {
      remainingTimeNode.title = readChapters + " / " + totalChapters + " chapters read (" + convertToTime(totalReadWords) + ")";
      if (totalReadWords > 0 && readChapters < totalChapters) {
        readWordsNode.classList.remove("hidden");
        outOfTextNode.classList.remove("hidden");
        remainingTimeNode.innerHTML = convertToTime(totalWordCount - totalReadWords) + " of " + convertToTime(totalWordCount) + " remaining";
        return;
      }
      
      readWordsNode.classList.add("hidden");
      outOfTextNode.classList.add("hidden");
      remainingTimeNode.innerHTML = convertToTime(totalWordCount);
    }
  }
  
  ///////////////////
  // Formatting functions

  function parseIntFull(number) {
    return parseInt(number.replace(/,/g, "").trim());
  }
  
  function numberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  function convertToTime(wordCount) {
    let time = (Math.ceil(wordCount / WPM));
    if (time > 60) {
      time = ((Math.ceil(time / 6)) / 10).toFixed(1) + " h";
    } else {
      time += " min";
    }
    return time;	
  }
  
  function getPercent(num1, num2) {
    return Math.min(100, (Math.round(num1 / num2 * 10000) / 100)).toFixed(2) + "%";
  }
})();
