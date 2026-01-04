// ==UserScript==
// @name         AO3 - Add Bookmark Notes (Work In Progress)
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Adds the work title, work author, work summary and specific tags to a bookmark so I can organise my 'To Read' items more easily.
// @author       jazzberries
// @exclude      *://*.archiveofourown.org/works/search/*
// @exclude      *://*.archiveofourown.org/works/new
// @match        *://*.archiveofourown.org/works/*
// @match        *://*.archiveofourown.org/chapters/*
// @match        *://*.archiveofourown.org/series/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542269/AO3%20-%20Add%20Bookmark%20Notes%20%28Work%20In%20Progress%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542269/AO3%20-%20Add%20Bookmark%20Notes%20%28Work%20In%20Progress%29.meta.js
// ==/UserScript==

//GLOBAL VARIABLES - we use these throughout various functions, so they're up top

//this is the bookmark notes text field
let bookmark = document.getElementById('bookmark_notes');

//tags to add to the your tags field
let tagsToAdd = document.getElementById('bookmark_tag_string_autocomplete');

//check the private bookmark check box
const pvt = (document.getElementById('bookmark_private').checked = true);

//grab the work title
let workTitle = document.querySelectorAll('.title.heading');

//grab existing tags
let existingTags = document.getElementsByClassName('added');

//grab the chapter count
let chapters = document.getElementsByClassName('chapters');

//grab the workID - borrwed from Ellililunch's AO3 Re-read Savior script on greasyfork
let workId = window.location.href.split('/')[4];

//get landing page/window location
let landingPage = window.location.href;

// END GLOBAL VARIABLES
(function bookmarks(event) {
    'use strict';
    // create additional Bookmark as Read or Bookmark as Reading button
    const readButton = document.createElement('a');
    readButton.href = '#bookmark-form';

    //if the work has already been bookmarked, we want the additional button to display the first bookmark tag so we know if it is To Read or has been Read
    //if the work is completed, then we want the button to display 'Bookmark as Read'
    //if the work is NOT completed, then we want the button to display 'Bookmark as Reading' (and have some different actions later on)

  const complete = document.getElementsByClassName('status');


 //this variable is used later to see if our chapter count matches (i.e is the work 1/2 or 2/2)
 let compareChapter

 //but Series landing pages don't have chapter count, so we need an if/else to handle Series pages and Work pages.
 if (landingPage.includes('series')) {
      compareChapter = 0;

} else {
compareChapter = chapters[1].firstChild.data.split('/');

}


    try {
        //if the existing tag is Read or did not finish, update the button id to be markread
        if (
            existingTags[0].firstChild.data === 'Read ' ||
            existingTags[0].firstChild.data === 'did not finish '
        ) {
            readButton.innerHTML = existingTags[0].firstChild.data;
            readButton.id = 'markread';
            readButton.style.background =
                'linear-gradient(#ffffff, rgba(217, 76, 33, 0.7))';
            console.log('existing tags Read and dnf');

            //if the Chapters section includes a ? we want the button id to markreading so it updates the tags correctly
        } else if (
            (existingTags[0].firstChild.data === 'To Read ') &
            chapters[1].firstChild.data.includes('?') ||
            compareChapter[0] !== compareChapter[1]
        ) {
            readButton.innerHTML = existingTags[0].firstChild.data;
            readButton.id = 'markreading';
            readButton.style.background =
                'linear-gradient(#ffffff, rgba(78, 138, 89,0.7))';
            console.log('mark read - compare chapters + ?');

            //if the existing tag is 'Worth Re-Reading' or 'Reading', update the button id to be markread
        } else if (
            existingTags[0].firstChild.data === 'Worth Re-Reading ' ||
            existingTags[0].firstChild.data === 'Reading ' ||
            existingTags[0].firstChild.data === 'Favourite '
        ) {
            readButton.innerHTML = existingTags[0].firstChild.data;
            readButton.id = 'markread';
            readButton.style.background =
                'linear-gradient(#ffffff, rgba(173, 124, 204,0.7))';
            console.log('existing tags worth re-reading');

            //if the existing tag is To Read but the Chapter count does not include a ?, update the button id to be markread
        } else if (existingTags[0].firstChild.data === 'To Read ') {
            readButton.innerHTML = existingTags[0].firstChild.data;
            readButton.id = 'markread';
            readButton.style.background =
                'linear-gradient(#ffffff, rgba(78, 138, 89,0.7))';
            console.log('mark read - to read');
        }
    } catch (error) {
        if (complete.length === 0) {
            readButton.innerHTML = 'Bookmark as Read';
            readButton.id = 'markread';
            console.log('this is the mark read error function');
        } else if (
            window.location.href.includes('series') &&
            existingTags.length !== 0
        ) {
            readButton.innerHTML = 'Bookmark as Read';
            readButton.id = 'markSeries';
            console.log('this is the mark series error function');
        } else {
            readButton.innerHTML = 'Bookmark as Reading';
            readButton.id = 'markreading';
            console.log('this is the mark reading error function');
        }
    }

    //select the bookmark button in the nav buttons section and append the new readButton to the bookmark button
    if (landingPage.includes('series')) {
        //because the bookmark button on the seres landing page shares a class with the primary navigation menu, we need to select all the elements with that class name and then specify which index we want
        const navButtons = document.querySelectorAll('.navigation.actions')[2];
        navButtons.append(readButton);
    } else {
        const navButtons = document.querySelector('.bookmark');
        navButtons.append(readButton);
    }

    //DISPLAY BOOKMARK FUNCTION - Display the bookmark form when we click on the bookmark button that we created
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

    //GET AUTHOR NAME FUNCTION
    function getAuthorName() {
        let authName = document.querySelectorAll('[rel="author"');

        // condition to handle works that are Anonymous (since they don't have an anchor to an Author page)
        if (authName.length === 0) {
            authName = 'Anonymous';
        } else {
            authName = authName[0].innerText;
        }
        return authName;
    }

    //GET WORK SUMMARY
    function getWorkSummary() {
        let workSummary = document.querySelectorAll('.summary.module');

        // condition to handle works where there is no work summary
        if (
            workSummary === null ||
            workSummary === undefined ||
            workSummary.length === 0
        ) {
            let chapterCount = `${chapters[0].innerText} ${chapters[0].nextSibling.innerText}`;
            workSummary = `${chapterCount}<p>No summary :(`;
        } else {
            workSummary = workSummary[0].lastElementChild.innerHTML;
        }
        return workSummary;
    }

    //CREATE BOOKMARK NOTES
    function getBookmarkNotes() {
        //take the work title, author name and summary details and add the bookmarkNotes to the bookmark notes section
        const existingBookmarkNotesData = document.getElementById('bookmark_notes');

        if (
            existingBookmarkNotesData.firstChild === null ||
            existingBookmarkNotesData.firstChild === undefined ||
            existingBookmarkNotesData.length === 0
        ) {
            const bookmarkNotes = `<details><summary>Work Details</summary><strong>Work ID: </strong>${workId}<p><strong>${workTitle[0].innerText
                }</strong> by ${getAuthorName()}</p><strong>Summary: </strong>${getWorkSummary()}</details>`;

            bookmark.value = bookmarkNotes;
        } else {
            bookmark.value = existingBookmarkNotesData.firstChild.data;
        }
    }

    //CHECK IF WORK IS PART OF A SERIES
    function isSeries() {
        //check if the work is a series so we can add a 'Series' tag.
        const partOfSeries = document.getElementsByClassName('series');

        let workSeries;

        if (Object.keys(partOfSeries).length === 0) {
            workSeries = '';
        } else {
            workSeries = ', Series';
        }
        return workSeries;
    }

    //GET WORD COUNT
    function getWordCount() {
        let words;
        let wordCountString;

        //since Series landing pages handle wordcounts differently, we need
        //to have an if/else to handle both series landing pages, and the work itself

        if (landingPage.includes('series')) {
            words = document.querySelectorAll('dl.stats');
            //replace the comma that is returned for wordcounts over 1,000 with nothing then parse as an integer
            wordCountString = parseInt(
                words[0].childNodes[3].innerText.replace(',', '')
            );
            console.log(words[0].childNodes[3].innerHTML);
        } else {
            words = document.getElementsByClassName('words');
            //replace the comma that is returned for wordcounts over 1,000 with nothing then parse as an integer
            wordCountString = parseInt(
                words[0].nextSibling.innerText.replace(',', '')
            );
        }

        //round the wordCountString to the nearest 5000
        const wordCountInt = Math.ceil(wordCountString / 5000) * 5000;

        //change localeString to pt-BR so that the separator for numbers is a . That way it won't break the tags when adding the Wordcount: Under X tag
        const wordCount = `Wordcount: Under ${wordCountInt.toLocaleString(
            'pt-BR'
        )}`;
        return wordCount;
    }

    //GET DATE
    function getDate() {
        //get today's date for the bookmark notes
        const date = new Date();

        //options so we can format the date as 01 Jan 2023
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };

        const formattedDate = new Intl.DateTimeFormat('en-AU', options).format(
            date
        );
        return formattedDate;
    }

    //CREATE TAGS
    function createTags() {
        //Tag creation time! Let's start with getting the Wordcount
        //thank you nexidava for this idea. Also https://stackoverflow.com/questions/3254047/round-number-up-to-the-nearest-multiple-of-3

        //if there are already tags, do not add tags. This prevents duplication when editing the bookmark


        switch (existingTags) {
            case Object.keys(existingTags).length !== 0:
                tagsToAdd.value = '';
                break;
            case Object.values(existingTags) === 'Reading':
                tagsToAdd.value = '';
                break;
            case compareChapter[0] !== compareChapter[1]:
                tagsToAdd.value = `Reading`;
                break;
            default:
                tagsToAdd.value = `To Read,${getWordCount()}${isSeries()}`;
        }
        return tagsToAdd;
    }

    //DELETE TAGS
    function deleteTags(event) {
        //clear previous tags
        let deleteTags = document.querySelectorAll(`a[title^="remove"]`);
        deleteTags.forEach((tagToDelete) => {
            tagToDelete.click();
        });
    }

    //CREATE BOOKMARK
    function addBookmark(event) {
        displayBookmarkForm();

        getBookmarkNotes();

        createTags();
        //tick private bookmark check box
        pvt;
    }

    function markAsRead(event) {
        displayBookmarkForm();

        //adding a trycatch on the off chance there are existing bookmark notes...
        try {
            let existingBookmarkNotes =
                document.getElementById('bookmark_notes').firstChild.data;

            bookmark.value = `${existingBookmarkNotes}`;
        } catch (error) {
            //if there's no existing notes, create bookmark notes
            const words = document.getElementsByClassName('words');

            let chapterCount = `${chapters[0].nextSibling.innerText}`;

            //add the date to the bookmark notes textfield
            bookmark.value = `${getDate()}<details><summary>Work Details</summary><strong>Work ID: </strong>${workId}<p><strong>Chapters: </strong>${chapterCount}</p><p><strong>${workTitle[0].innerText
                }</strong> by ${getAuthorName()}<p><strong>Summary:</strong>${getWorkSummary()}</p><strong>Words: ${words[0].nextSibling.innerText
                }</details>`;
        }

        deleteTags();

        //add tags
        tagsToAdd.value = 'Read';

        //ensure the private bookmark checkbox is ticked
        pvt;
    }

    function markAsReading(event) {
        let chapterCount = `${chapters[0].innerText} ${chapters[0].nextSibling.innerText}`;

        //try grab the data from the existing bookmark notes so we don't lose it when adding in the chapter count. We've put this in a trycatch because it will
        //error if there's no existing bookmark notes and we can then run our addBookmark function to add the bookmarkNotes and reading tag
        try {
            displayBookmarkForm();
            let existingBookmarkNotes =
                document.getElementById('bookmark_notes').firstChild.data;

            bookmark.value = `${chapterCount}<p>${existingBookmarkNotes}`;
            console.log('trying markasreading');
        } catch {
            addBookmark();
        }

        //if there are already tags, do not add tags. This prevents duplication when editing the bookmark
        if (Object.values(existingTags) !== 'Reading ') {
            deleteTags();
            tagsToAdd.value = 'Reading';
        }

        //ensure the private bookmark checkbox is ticked
        pvt;
    }

    function bookmarkSeries() {
        console.log('bookmark series function');

        displayBookmarkForm();
        //but what if we want to bookmark a series? everything is different. Sort of. >.>

        let seriesData = document.getElementsByClassName('series');
        let seriesName = document.getElementsByClassName('flash');
        let seriesTitle = seriesName[0].nextElementSibling.innerText;
        let seriesDetails = seriesData[0].innerHTML;

        let bookmarkNotes = `<details><summary>Work Details</summary><strong>Work ID: </strong>${workId}<p><strong>Series title:</strong> ${seriesTitle}</p>${seriesDetails}</details>`;

        bookmark.value = bookmarkNotes;

        createTags();
    }

    const bookmarkButton = document
        .querySelector('.bookmark_form_placement_open')
        .addEventListener('click', addBookmark);

    //add event listener so that the script runs when you click the Bookmark as Read button
    let bookmarkAsRead = readButton.id;

    let bookmarkAsReadButton = document.getElementById(bookmarkAsRead);

    if (bookmarkAsRead !== 'markread') {
        bookmarkAsReadButton.addEventListener('click', markAsReading);
        console.log('clicked mark reading');
    } else if (bookmarkAsRead !== 'markread') {
        bookmarkAsReadButton.addEventListener('click', bookmarkSeries);
        console.log('clicked bookmark series' + existingTags[0].firstChild.data);
    } else {
        bookmarkAsReadButton.addEventListener('click', markAsRead);
        console.log('clicked Mark as Read');
    }
})();