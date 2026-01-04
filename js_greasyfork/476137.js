// ==UserScript==
// @name         Overdrive search MyAnonamouse
// @version      0.2
// @description  Add "Search MAM" button to Overdrive
// @include      https://*.overdrive.com/media/*
// @grant        none
// @license      GPLv3
// @namespace https://greasyfork.org/users/329487
// @downloadURL https://update.greasyfork.org/scripts/476137/Overdrive%20search%20MyAnonamouse.user.js
// @updateURL https://update.greasyfork.org/scripts/476137/Overdrive%20search%20MyAnonamouse.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const overdriveSearchMam = async () => {

    // Get the book title and author
    const book_title = document.querySelector('h1.TitleDetailsHeading-title').textContent;
    const book_author = document.querySelector('a.TitleDetailsHeading-creatorLink').textContent;
    // Generate the search URL.  Search logic is this:  search both title and author fields, match on title OR author.
    const search_url = encodeURI("https://www.myanonamouse.net/tor/browse.php?tor[srchIn][title]=true&tor[srchIn][author]=true&tor[text]=(" + book_title.concat(') | (', book_author, ')'));
    console.log("Suggested search string: " + search_url);

    // Create a button to launch our search.
    const search_button = document.createElement('button');
    search_button.innerText = 'Search MAM';
    search_button.id = 'MAM_search_button';
    search_button.className = 'u-allCaps button radius is-button big';   // Borrow these classes from the OverDrive css so our button looks pretty
    search_button.addEventListener('click', () => window.open(search_url));

    // Append our button to the right container on the webpage.
    let overdrive_button_box = document.querySelector('.Details-buttonContainer');
    overdrive_button_box.appendChild(search_button);

    // Look for the Kindle/Audio/Physical book swatch
    const bookPageCheck = async () => {
        if(document.querySelector('h1.TitleDetailsHeading-title')){
            console.log("Looks like a book! Adding MAM search link...");
            return true;
        }else{
            throw new Error("This does not look like a book detail page; won't add search link!")
        }
    }

}

// Run the script
overdriveSearchMam();
