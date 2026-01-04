// ==UserScript==
// @name         AO3 - Get Chapter Notes for Bookmarks
// @namespace    https://greasyfork.org/en/users/1384981-jazzb
// @version      0.2
// @description  Gets chapter notes on a Full Work page to add to bookmark notes
// @author       JazzB
// @exclude      *://*.archiveofourown.org/works/search/*
// @exclude      *://*.archiveofourown.org/works/new
// @match        *://*.archiveofourown.org/works/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513660/AO3%20-%20Get%20Chapter%20Notes%20for%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/513660/AO3%20-%20Get%20Chapter%20Notes%20for%20Bookmarks.meta.js
// ==/UserScript==

//GLOBAL VARIABLES - we use these throughout various functions, so they're up top

//this is the bookmark notes text field
let bookmark = document.getElementById('bookmark_notes');

//get landing page/window location
let landingPage = window.location.href;

// END GLOBAL VARIABLES
(function bookmarks(event) {
  'use strict';

  //condition so that the button only displays on full_work and not chapter-by-chapter
  if (!landingPage.includes('view_full_work=true')) {
    return;
  } else {
    // create additional 'Add Bookmark with Chapter Notes' button when we view ENTIRE WORK
    const fullworknotesButton = document.createElement('a');
    fullworknotesButton.href = '#bookmark-form';
    fullworknotesButton.id = 'fullchapternotes';
    fullworknotesButton.innerText = 'Add Bookmark with Chapter Notes';

    const navButtons = document.querySelector('.bookmark');
    navButtons.append(fullworknotesButton);
  }

  //DISPLAY BOOKMARK FUNCTION - Display the bookmark form when we click on the Add Bookmark with Chapter Notes button that we created
  function displayBookmarkForm() {
    //display bookmark form
    const markRead = (document.getElementById(
      'bookmark_form_placement'
    ).style.display = 'block');

    //display cancel bookmark buttons
    const cancelBookmark = document.querySelectorAll(
      '.bookmark_form_placement_close'
    );
    cancelBookmark.forEach((cancelButton) => {
      cancelButton.style.display = 'inline-block';
    });

    //hide the other Bookmark buttons when we display the bookmark form
    const hideBookmarkButton = document.querySelectorAll(
      '.bookmark_form_placement_open'
    );
    hideBookmarkButton.forEach((bookmarkButton) => {
      bookmarkButton.classList.add('hidden');
    });
  }

  //GET CHAPTER NOTES FUNCTION

  function getChapterNotes() {
    //Grab all the notes sections from each chapter

    let fullworknotes = document.querySelectorAll('[id^="notes"]');

    //set chapter counter for bookmark notes
    let chapterCount = 0;

    //empty array to push the chapter notes details into
    let fullWorkNotesBookmarkText = [];

    //magic! For each chapter, obtain the notes details
    fullworknotes.forEach((chapter) => {
      chapterCount += 1;
      let chapterNotes = chapter.textContent;

      //and push the details to the empty array
      fullWorkNotesBookmarkText.push(`${chapterCount}. ${chapterNotes}

        `);
    });
    return `
 ${fullWorkNotesBookmarkText.join('').trim()}`;
  }

  //CREATE BOOKMARK NOTES
  function getBookmarkNotes() {
    //take chapter notes data and add them to the bookmark notes section
    const existingBookmarkNotesData = document.getElementById('bookmark_notes');

    if (
      existingBookmarkNotesData.firstChild === null ||
      existingBookmarkNotesData.firstChild === undefined ||
      existingBookmarkNotesData.length === 0
    ) {
      const bookmarkNotes = `${getChapterNotes()}`;

      bookmark.value = bookmarkNotes;
    } else {
      //if there's exisiting bookmark notes, we keep them.
      bookmark.value = existingBookmarkNotesData.firstChild.data;
    }
  }

  //CREATE BOOKMARK
  function addBookmark(event) {
    displayBookmarkForm();

    getBookmarkNotes();
  }

  //add event listener so that the script runs when you click the Add Bookmark with Chapter Notes

  const bookmarkFullChapterNotesButton =
    document.getElementById('fullchapternotes');
  bookmarkFullChapterNotesButton.addEventListener('click', addBookmark);
})();
