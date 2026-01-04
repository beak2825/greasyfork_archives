// ==UserScript==
// @name        [ARCHIVED]Next Chapter Button for YouTube
// @description	Next Chapter Button for YouTube.
// @version     1.0.1
// @author      look997
// @include     https://www.youtube.com/*
// @homepageURL https://greasyfork.org/pl/users/4353-look997
// @namespace	  https://greasyfork.org/pl/users/4353-look997
// @grant       none
// @run-at      document-end
// @resource    metadata https://greasyfork.org/scripts/437859-next-chapter-button-for-youtube/code/Next%20Chapter%20Button%20for%20YouTube.user.js
// @icon        https://www.google.com/s2/favicons?domain=youtube.com
// @icon64      https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/437859/%5BARCHIVED%5DNext%20Chapter%20Button%20for%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/437859/%5BARCHIVED%5DNext%20Chapter%20Button%20for%20YouTube.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  
  function getSec (href) {
    return Number(new URLSearchParams(href).get("t").replace("s",""))
  }

  function getOb () {
    const allDescriltionLinksEls = document.querySelectorAll("#description .yt-simple-endpoint");

    //console.log("NCB YT allDescriltionLinksEls", allDescriltionLinksEls);

    const timeDescriptionLinksEls = Array.from(allDescriltionLinksEls)
                                      .filter(el=>/^(([0-9]+:)*([0-5]*[0-9]):[0-5][0-9])$/.test(el.textContent.trim()));

    const chaptersSecs = timeDescriptionLinksEls.map( el=>getSec(el.href) );

    const timeLines = document.querySelector("#description .content").textContent.split("\n")
                      .filter(line=>/(([0-9]+:)*([0-5]*[0-9]):[0-5][0-9])/.test(line))
                      .map(line=>line.replace(/(([0-9]+:)*([0-5]*[0-9]):[0-5][0-9])/,"").replace(/^[\s-(){}\.]+/,"").replace(/[\s-(){}\.]+$/,""));
    //console.log("NCB YT timeDescriptionLinksEls", timeDescriptionLinksEls);

    const currentPlayTime = document.querySelector("#movie_player video").currentTime;
    //console.log("NCB YT currentPlayTime",currentPlayTime);

    const reverseCurrentChapterSec = chaptersSecs.map(el=>el).reverse().find(sec=>currentPlayTime>=sec);


    const sum = timeDescriptionLinksEls.length;

    const currentChapterIndex = chaptersSecs.indexOf(reverseCurrentChapterSec);
    const nextChapterIndex = timeDescriptionLinksEls[currentChapterIndex+1]?currentChapterIndex+1:0;
    const prevChapterIndex = timeDescriptionLinksEls[currentChapterIndex-1]?currentChapterIndex-1:sum-1;

    return {timeDescriptionLinksEls, timeLines, currentChapterIndex, currentPlayTime, sum, nextChapterIndex, prevChapterIndex};
  }

  function jumpToNextChapter () {

    const {timeDescriptionLinksEls, nextChapterIndex} = getOb();

    document.querySelector("#movie_player video").currentTime = getSec(timeDescriptionLinksEls[nextChapterIndex].href);
  }

  function jumpToPrevChapter () {

    const {timeDescriptionLinksEls, prevChapterIndex} = getOb();

    document.querySelector("#movie_player video").currentTime = getSec(timeDescriptionLinksEls[prevChapterIndex].href);
  }

  function repeatChapter () {

    const {timeDescriptionLinksEls, currentChapterIndex} = getOb();

    document.querySelector("#movie_player video").currentTime = getSec(timeDescriptionLinksEls[currentChapterIndex].href);
  }


  function getTitle (buttonText, index) {
    const {timeDescriptionLinksEls, timeLines, sum} = getOb();

    const chapterTitle = timeLines[index].trim();
    const chapterTime = timeDescriptionLinksEls[index].textContent.trim();

    const chapter = window.document.documentElement.lang==="pl-PL"?"rozdział":"chapter";

    const title = `${buttonText}\n\n${chapterTitle}\n${chapterTime} ${index+1}/${sum} ${chapter}`;
    return title;
  }

  function setChapterElTitle () {
    const {timeDescriptionLinksEls, nextChapterIndex} = getOb();
    if (timeDescriptionLinksEls.length===0) { return true; }

    const title = getTitle(window.document.documentElement.lang==="pl-PL"?"Odtwórz następny rozdział":"Jump to next chapter", nextChapterIndex);

    nextChapterButtonEl.title = title;
  }

  function setChapterPrevElTitle () {
    const {timeDescriptionLinksEls, prevChapterIndex} = getOb();
    if (timeDescriptionLinksEls.length===0) { return true; }

    const title = getTitle(window.document.documentElement.lang==="pl-PL"?"Odtwórz poprzedni rozdział":"Jump to prev chapter", prevChapterIndex);

    prevChapterButtonEl.title = title;
  }

  function setChapterCurrentElTitle () {
    const {timeDescriptionLinksEls, currentChapterIndex} = getOb();
    if (timeDescriptionLinksEls.length===0) { return true; }

    const title = getTitle(window.document.documentElement.lang==="pl-PL"?"Powtórz aktualny rozdział":"Repeat current chapter", currentChapterIndex);

    repeatChapterButtonEl.title = title;
    currentChapterTitleEl.title = title;
  }

  let nextChapterButtonEl;
  let currentChapterTitleEl;

  let prevChapterButtonEl;
  let repeatChapterButtonEl;

  function start () {
    
    
    currentChapterTitleEl = document.querySelector("#movie_player .ytp-chapter-title-content");
    if (currentChapterTitleEl.dataset.ncbfyt=="true") { return false; }
    currentChapterTitleEl.dataset.ncbfyt = "true";

    prevChapterButtonEl = document.createElement("span");
    prevChapterButtonEl.textContent = " |< ";
    prevChapterButtonEl.style.cursor = "pointer";
    prevChapterButtonEl.style.marginRight = "10px";
    currentChapterTitleEl.before(prevChapterButtonEl);

    //prevChapterButtonEl.addEventListener("mousemove", setChapterPrevElTitle);

    prevChapterButtonEl.addEventListener("click", jumpToPrevChapter);


    nextChapterButtonEl = document.createElement("span");
    nextChapterButtonEl.textContent = " >| • ";
    nextChapterButtonEl.style.cursor = "pointer";
    nextChapterButtonEl.style.marginRight = "5px";
    currentChapterTitleEl.before(nextChapterButtonEl);

    //nextChapterButtonEl.addEventListener("mousemove", setChapterElTitle);

    nextChapterButtonEl.addEventListener("click", jumpToNextChapter);


    repeatChapterButtonEl = document.createElement("span");
    repeatChapterButtonEl.textContent = " 🔁 ";
    repeatChapterButtonEl.title = "Repeat current chapter";
    repeatChapterButtonEl.style.cursor = "pointer";
    //repeatChapterButtonEl.style.marginLeft = "5px";
    repeatChapterButtonEl.style.marginRight = "5px";
    //currentChapterTitleEl.before(repeatChapterButtonEl);

    //repeatChapterButtonEl.addEventListener("mousemove", setChapterCurrentElTitle);

    //repeatChapterButtonEl.addEventListener("click", repeatChapter);

    currentChapterTitleEl.style.cursor = "pointer";
    //currentChapterTitleEl.addEventListener("mousemove", setChapterCurrentElTitle);
    currentChapterTitleEl.addEventListener("click", repeatChapter);


    const observer = new MutationObserver(()=>{
      setChapterPrevElTitle();
      setChapterElTitle();
      setChapterCurrentElTitle();
    });
    observer.observe(currentChapterTitleEl, { childList: true, subtree: true });
  }

  
  class NavigateFinish {
    constructor (callback) {
      if (typeof callback  !== "function") { throw "Give me callback function in `new WatchPageLoader(callbackFunction);`"; }
      this.cb = callback;
      
      this.init();
    }
    // main UserScript Function after watch page is load
    scriptMainFunction (...args) {
      this.cb(...args);
    }
    
    mainLoad () {
      function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        const videoId = urlParams.get("v");

        return videoId;
      }

      function isVideoLoaded() {
        const videoId = getVideoId();

        return (
          document.querySelector(`ytd-watch-flexy[video-id='${videoId}']`) !== null
        );
      }

      const setEventListeners = (evt)=> {
        const checkForJS_Finish = ()=> {
          if (isVideoLoaded()) {
            clearInterval(jsInitChecktimer);
            this.scriptMainFunction();
          }
        }

        if (window.location.href.indexOf("watch?") >= 0) {
          var jsInitChecktimer = setInterval(checkForJS_Finish, 111);
        }
      }

      (function () {
        "use strict";
        window.addEventListener("yt-navigate-finish", setEventListeners, true);
        setEventListeners();
      })();
    }
  
    init () {
      this.mainLoad();
    }
  }
  
  new NavigateFinish(start);
})();