// ==UserScript==
// @name     MAM Search The Guardian Book of the Day
// @description Add button for searching MAM on The Guardian
// @version  1
// @grant    none
// @author   jocw
// @include  https://www.theguardian.com/books/series/book-of-the-day
// @namespace https://greasyfork.org/users/209108
// @downloadURL https://update.greasyfork.org/scripts/371742/MAM%20Search%20The%20Guardian%20Book%20of%20the%20Day.user.js
// @updateURL https://update.greasyfork.org/scripts/371742/MAM%20Search%20The%20Guardian%20Book%20of%20the%20Day.meta.js
// ==/UserScript==

var ulElements = document.getElementsByClassName('u-unstyled l-row  l-row--cols-1 fc-slice fc-slice--f');

function getAllBookTitleElements() {
	return document.getElementsByClassName('js-headline-text');
}

function addSearchByTitleButton(addToElement, bookTitle) {
  console.log('Adding search by title button');
  var li = document.createElement('li');
  var lnk = document.createElement('a');
  lnk.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + bookTitle;
  lnk.target = "_new";
  var text = document.createTextNode("[MAM: Title]");
  lnk.appendChild(text);
  li.appendChild(lnk);
  addToElement.appendChild(li);
}

function addSearchByAuthorAndTitleButton(addToElement, bookTitle, authorName) {
  console.log('Adding search by title and author button');
  var li = document.createElement('li');
  var lnk = document.createElement('a');
  lnk.href = "https://www.myanonamouse.net/tor/browse.php?tor[text]=" + bookTitle + '%20' + authorName;
  lnk.target = "_new";
  var text = document.createTextNode("[MAM: Title + Author]");
  lnk.appendChild(text);
  li.appendChild(lnk);
  console.log('Adding button forreal');
  addToElement.appendChild(li);
}

var hasAuthor = true;
var allBookTitleElements = getAllBookTitleElements();

// For each book
for (i = 0; i < allBookTitleElements.length; i+=2) {
  hasAuthor = true;
  console.log('On Item: ' + i);
  // grab the description text, replace all &nbsp
  var descText = allBookTitleElements[i].innerHTML.replace(/&nbsp;/g, ' ');
  console.log('InnerHTML: ' + descText);
  // search for location of word by in order to seperate title and author
  var byLocation = descText.search('by');
  console.log('byLocation in text: ' + byLocation);
  
  // for some reason they decide to use - review and review - mixed so we have to account for that.
  var reviewLocation = descText.search(' review –');
  if (reviewLocation == -1) {
    reviewLocation = descText.search('– review');
  }
  
  console.log('reviewLocation in text: ' + reviewLocation);
  
  // randomly the word by and author are not in the description
  if (byLocation == -1) {
    hasAuthor = false;
  }
  
	var bookTitle = null;
  var authorName = null;
  if (hasAuthor) {
    bookTitle = descText.substring(0, byLocation - 1);
  	authorName = descText.substring(byLocation + 3, reviewLocation);
    
    // now we need to add proper buttons based on what is available to us.
    addSearchByTitleButton(ulElements[i/2], bookTitle);
    addSearchByAuthorAndTitleButton(ulElements[i/2], bookTitle, authorName);
  } else {
    bookTitle = descText.substring(0, reviewLocation);
    
    // now we need to add proper buttons based on what is available to us.
    addSearchByTitleButton(ulElements[i/2], bookTitle, authorName);
  }
  
  console.log('Book Title: ' + bookTitle);
  console.log('Author Name: ' + authorName);
  console.log('~~~~~~~~~~');
}
