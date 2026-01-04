// ==UserScript==
// @name         AO3 - Add Chapter Notes to Chapter Index Page
// @namespace    https://greasyfork.org/en/users/1384981-jazzb
// @version      0.1
// @description  Adds individual chapter notes to the Chapter Index page
// @author       JazzB
// @exclude      *://*.archiveofourown.org/works/search/*
// @exclude      *://*.archiveofourown.org/works/new
// @match        *://*.archiveofourown.org/works/*/navigate
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515326/AO3%20-%20Add%20Chapter%20Notes%20to%20Chapter%20Index%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/515326/AO3%20-%20Add%20Chapter%20Notes%20to%20Chapter%20Index%20Page.meta.js
// ==/UserScript==

(function bookmarks(event) {
  'use strict';

  //Get the URL for the full work page so we can grab all of the chapter notes
  let fullWorkURL = window.location.href.slice(0, -9) + "?view_full_work=true";

  // What it says on the tin: getting the chapter notes
  function getChapterNotes(fullWorkChapterDetails) {

    //chapter count
    let chapterCount = fullWorkChapterDetails.querySelector(`dd[class="chapters"]`);

  //splitting the chapter count so we can obtain the current number of chapters
    let splitChapter = chapterCount.innerText.split('/');

    let chapterNumber = Number(splitChapter[0]);

     //empty array to push our chapter summaries and notes into
    let chapterSummariesAndNotes = [];

//obtaining the work summary to put at the top of the chapter listing page
         let workSummary = fullWorkChapterDetails.querySelector(`div[class="summary module"] > h3 ~ blockquote`);

  //selecting where we are going to show the work summary at the top of the chapter listing page
      let workSummaryListing = document.querySelector(`ol[class="chapter index group"]`);

  //prepend the work Summary to the top of the chapter list/beneath the work title on the listing page
    const workSummaryText = document.createElement('div');
    workSummaryText.className = "work-summary-text";
    workSummaryText.innerHTML = `${workSummary}<br/>`;

    workSummaryListing.prepend(workSummary);

//for each chapter, obtain the chapter summary and chapter notes

    for (let i = 0; i < chapterNumber; i++) {

      let chapterCountForId = "chapter-" + (1+i).toString();

        let fullWorkChapterSummaries = fullWorkChapterDetails.querySelector(`[id="${chapterCountForId}"]>[class="chapter preface group"] > h3 ~ div#summary`);

        let fullWorkChapterNotes = fullWorkChapterDetails.querySelector(`[id="${chapterCountForId}"]>[class="chapter preface group"] > h3 ~ div#notes`);

//if else to handle null values and if a chapter doesn't have a summary, but has notes
        if (fullWorkChapterSummaries == null && fullWorkChapterNotes == null) {

//comment out line 60, and remove the two forward slashes from line 61 if you want chapters with no summary or notes to display the 'sorry no notes' message

  chapterSummariesAndNotes.push("");
//chapterSummariesAndNotes.push(`<p>Sorry! Unable to find chapter summary or notes :(</p>`);

       } else if (fullWorkChapterSummaries == null && fullWorkChapterNotes !== null){

       chapterSummariesAndNotes.push(fullWorkChapterNotes.innerHTML);

        } else {
            chapterSummariesAndNotes.push(fullWorkChapterSummaries.innerHTML)
        }
    }

//selecting where to show the chapter summaries/notes beneath the relevant chapter on the listing page

        let chapterListing = document.querySelectorAll('ol[class="chapter index group"] > li');

    //for each chapter, append the summary/notes
    for (let index = 0; index < chapterSummariesAndNotes.length; index++) {

      const chapterSummariesText = document.createElement('div');
      chapterSummariesText.className = "chapter-summaries-text";
      chapterSummariesText.innerHTML = `${chapterSummariesAndNotes[index]}<br/>`;

      chapterListing[index].append(chapterSummariesText);

  }
    }

  //xhr request so we can obtain all the chapter summaries/notes from the full work page
  function requestChapterDetails() {

      let fullWorkChapterDetails = this.response;

      getChapterNotes(fullWorkChapterDetails);
  }

  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", requestChapterDetails);
  xhr.open("GET", fullWorkURL);
  xhr.responseType = "document";
  xhr.send();

})();