// ==UserScript==
// @name           StartPage.com - Number Results
// @namespace      tag:r-a-y@gmx.com,2012:monkey
// @description    Number search results on StartPage.com
// @match          https://*.startpage.com/*/search*
// @author         r-a-y
// @version        1.2.1
// @license        GPL v3
// @downloadURL https://update.greasyfork.org/scripts/2886/StartPagecom%20-%20Number%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/2886/StartPagecom%20-%20Number%20Results.meta.js
// ==/UserScript==

let results = document.querySelectorAll( '.result' ), pageNumber, numItems;

if ( results.length ) {
  results = document.querySelectorAll( '.result h2' );
  pageNumber = document.querySelector( '.pagination form[aria-label^=current] button' );

  if ( pageNumber ) {
    pageNumber = pageNumber.textContent;
  } else {
    pageNumber = 1;
  }

  // Deal with custom results per page.
  if ( results.length % 20 === 0 ) {
    numItems = 20;
  } else {
    numItems = 10;
  }

  // On last page, default to 20.
  if ( ! document.querySelector( '.pagination form[aria-label^=current] + form' ) ) {
    numItems = 20;
  }
}

// DOM inject.
for ( let i = 0, len = results.length; i < len; ++i ) {
  let newContent;
  let newSpan = document.createElement( "span" );
  newSpan.setAttribute( "style", "float:left; font-weight:600; font-size:1em; display:inline-block; margin-right:5px;" );

  newContent = document.createTextNode( ( ( pageNumber - 1 ) * numItems + i + 1 ) + ". ");

  newSpan.appendChild( newContent );

  results[i].insertBefore( newSpan, results[i].firstChild );
}