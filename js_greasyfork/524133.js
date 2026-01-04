// ==UserScript==
// @name          IndeXXX - Show Related Actress v.2.05
// @description	  IndeXXX - Show Related Actress + Button To copy Related Actress list
// @author        janvier57
// @namespace     https://greasyfork.org/users/7434
// @include       https://www.indexxx.com/*
// @match         https://www.indexxx.com/*
// @version       2.05
// @icon          https://www.indexxx.com/apple-touch-icon.png
// @license       unlicense
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/524133/IndeXXX%20-%20Show%20Related%20Actress%20v205.user.js
// @updateURL https://update.greasyfork.org/scripts/524133/IndeXXX%20-%20Show%20Related%20Actress%20v205.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Script started');

  // Find principal actress image URL
  var principalActressImgUrl = document.querySelector('#model-header > div:first-of-type .model-img');
  console.log('Principal actress image URL:', principalActressImgUrl);

  if (principalActressImgUrl) {
    principalActressImgUrl = principalActressImgUrl.getAttribute('src');
    console.log('Principal actress image URL:', principalActressImgUrl);
  } else {
    console.log('Error: Principal actress image URL not found');
  }

  // Find related actress thumbnails
  var relatedActresses = document.querySelectorAll('.pset ul .modelLink.item:not([style="color: red;"])');
  console.log('Related actresses:', relatedActresses);

  if (relatedActresses.length > 0) {
    // Create an object to store unique related actresses
    var uniqueRelatedActresses = {};

    relatedActresses.forEach(function(actress) {
      var actressImgUrl = actress.getAttribute('data-modelphoto');
      var actressName = actress.textContent.trim(); // Get the name and trim whitespace
      var actressLink = actress.getAttribute('href');

      // Check if the actress is not already in the object
      if (!uniqueRelatedActresses[actressImgUrl]) {
        uniqueRelatedActresses[actressImgUrl] = {
          name: actressName,
          link: actressLink,
          imgUrl: actressImgUrl,
          allNames: new Set() // Use a Set to store names for uniqueness
        };
      }
      // Add the actress name to the Set
      uniqueRelatedActresses[actressImgUrl].allNames.add(actressName);
    });

    console.log('Unique related actresses:', uniqueRelatedActresses);

    // Filter related actresses with different image URL than principal actress
    var filteredRelatedActresses = Object.values(uniqueRelatedActresses).filter(function(actress) {
      return actress.imgUrl !== principalActressImgUrl;
    });

    console.log('Filtered related actresses:', filteredRelatedActresses);

    // Create list of related actresses
    var title = '<h2 class="related-actresses-title">Related Actress</h2>';
    var copyButton = '<button class="copy-button">Copy List</button>';
    var relatedActressesList = '<ul class="related-actresses">' + copyButton;
    filteredRelatedActresses.forEach(function(actress) {
      // Get all names, sort them, and convert to a string
      var allNamesArray = Array.from(actress.allNames).sort();
      var firstName = actress.name; // The name from data-modelphoto
      var matchingName = allNamesArray.find(name => name.toLowerCase() === firstName.toLowerCase()); // Find the matching name

      // Prepare other names excluding the matching name
      var otherNamesArray = allNamesArray.filter(name => name.toLowerCase() !== firstName.toLowerCase());
      var otherNamesString = otherNamesArray.join(', '); // Join other names

      // Create the list item with the link, image, and names
      var listItem = '<li><a href="' + actress.link + '"><img src="' + actress.imgUrl + '" alt="' + actress.name + '">';

      // Add the first name in bold if it matches
      if (matchingName) {
        listItem += '<strong>' + matchingName + '</strong>';
      }

      // Add " AKA " only if there are other names
      if (otherNamesArray.length > 0) {
        listItem += ' AKA ' + otherNamesString;
      }

      listItem += '</a></li>';
      relatedActressesList += listItem;
    });
    relatedActressesList += '</ul>';

    var relatedActressesContainer = '<div class="related-actresses-container">' + title + relatedActressesList + '</div>';
    document.querySelector('#pageWrapper > div[itemtype="http://schema.org/ProfilePage"] h1').insertAdjacentHTML('afterend', relatedActressesContainer);

    console.log('List added to page');

// Add event listener to copy button
    var copyButtonElement = document.querySelector('.copy-button');
    copyButtonElement.addEventListener('click', function() {
      var textToCopy = 'RELATED ACTRESS:\n';
      filteredRelatedActresses.forEach(function(actress, index) {
        textToCopy += actress.name;
        if (index < filteredRelatedActresses.length - 1) {
          textToCopy += ', ';
        }
      });
      navigator.clipboard.writeText(textToCopy).then(function() {
        console.log('Text copied to clipboard');
      }, function(err) {
        console.error('Could not copy text: ', err);
      });
    });
  } else {
    console.log('Error: No related actresses found');
  }

  // Add CSS to style the list
  var styles = `
/* (new246) - TEST GM "RELATED ACTRESS" */
.related-actresses-container {
	position: relative;
    display: inline-block;
	height: 3vh !important;
    margin: 0 5px 0 5px !important;
	padding: 4px 5px !important;
	border-radius: 5px  !important;
background: red !important;
}
.related-actresses-container h2.related-actresses-title {
	font-size: 15px !important;
    cursor: pointer;
color: silver !important;
}
.copy-button {
  background-color: #4CAF50;
  color: #fff;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  text-align: center;
}
.copy-button:hover {
  background-color: #3e8e41;
}
.related-actresses {
      display: none;
      position: absolute;
      background-color: #fff;
      border: 1px solid #ddd;
      padding: 10px;
}
.related-actresses-container:hover ul.related-actresses {
    display: inline-block !important;
    position: absolute;
    width: 100% !important;
	min-width: 1000px !important;
	max-width: 1000px !important;
    max-height: 60vh !important;
	margin: -0.5vh 0px 0 -10px !important;
    padding: 10px;
    overflow: hidden auto !important;
	z-index: 50000 !important;
color: peru !important;
background: #222 !important;
border: 1px solid #ddd;
}
.related-actresses li {
    display: block;
	float: left !important;
	width: 19% !important;
    height: 60px !important;
    margin: 0 5px 5px 0 !important;
	padding: 5px  !important;
	border-radius: 5px  !important;
color: peru !important;
background: #222 !important;
border: 1px solid #ddd;
}
.related-actresses-container .related-actresses li a[href^="https://www.indexxx.com/m/"]  {
    display: inline-block !important;
    width: 100% !important;
  background: #111 !important;
}


.related-actresses img {
    width: 50px;
    height: 50px;
	margin: 0 15px 0 0 !important;
    border-radius: 50%;
}

/*.related-actresses .aka {
display: inline-block !important;
    font-size: 12px;
    color: #666;
}*/
.related-actresses-container .related-actresses li a[href^="https://www.indexxx.com/m/"]  {
    display: inline-block !important;
    width: 100% !important;
    line-height: 2vh !important;
    font-size: 12px;
color: peru !important;
}
.related-actresses-container .related-actresses li a[href^="https://www.indexxx.com/m/"]:visited  {
    color: tomato !important;
}

.related-actresses-container .related-actresses li a[href^="https://www.indexxx.com/m/"] img {
    display: block !important;
    float: left !important;
    width: 50px !important;
    height: 50px !important;
border: 1px solid red !important;
}
.related-actresses-container .related-actresses li a[href^="https://www.indexxx.com/m/"] img:hover {
    display: block !important;
    float: left !important;
    width: 50px !important;
    height: 50px !important;
    transform: scale(2) !important;
border: 1px solid aqua !important;
}
  `;
  document.head.insertAdjacentHTML('beforeend', '<style>' + styles + '</style>');

  console.log('Script finished');
})();



