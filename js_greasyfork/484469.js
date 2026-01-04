// ==UserScript==
// @name         Spacebattles Userscripts
// @namespace    http://yournamespacehere.com/
// @version      0.1
// @description  The userscript removes both instances of threadmark account, it removes the count of how many replies are left in a thread, it renames the last page number to the word last from the number of the last page, and remove the total reply count when viewing all the threads by a user. 
// @author       YourName
// @match        https://*.spacebattles.com/*
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/484469/Spacebattles%20Userscripts.user.js
// @updateURL https://update.greasyfork.org/scripts/484469/Spacebattles%20Userscripts.meta.js
// ==/UserScript==

(function() {
   try {
    // Select the first element with the class 'u-dimmed' representing the 'remaining replies' section
let remainingReplies = document.querySelector('.u-dimmed');

// Check if the 'remaining replies' section exists on the page
if (remainingReplies != null) {
    // Remove the 'remaining replies' section from the page if it's found
    remainingReplies.remove();
}
     } catch (error) {
        console.error("Error removing 'remaining replies' section:", error.message);
    }
})();

(function() {
  try {
    // Select the first element with the class 'fauxBlockLink' representing the first 'Threadmark Count' section
let firstthreadmarkCount= document.querySelectorAll('.fauxBlockLink')

// Check if the 'Threadmark Count' section exists on the page
if (firstthreadmarkCount != null) {
    // Remove the 'Threadmark Count' section from the page if it's found
    for (let i = 0; i < firstthreadmarkCount.length; i++) {
  firstthreadmarkCount[i].remove();
}
}
    } catch (error) {
        console.error("Error removing 'Threadmark Count' sections:", error.message);
    }
})();

(function() {
    //TODO have it work on every tab in the thread header instead of only the one open
try {
//finds which classes has threadmarks
function threadmarksFinder(element) {
  return element.textContent.includes("threadmarks");
}

//finds every spans class
let spans = document.querySelectorAll('span');

////finds spans which has threadmarks
let filteredSpans = Array.from(spans).filter(threadmarksFinder);
//console.log(filteredSpans)

//applies filteredSpans to every span
filteredSpans.forEach(function(span) {
  let text = span.textContent;
 //console.log(text)
// deletes threadmarks and the count through replacing with an empty space
let newText = text.replace(/\d+ threadmarks, /, '');
//        console.log(newText)
  span.textContent = newText;
});
  } catch (error) {
        console.error("Error modifying threadmarks:", error.message);
    }
})();

(function() {
  try {
      // Select all elements with class 'contentRow-minor' and 'listInline li' to find total replies for each thread
let totalReplies = document.querySelectorAll('.contentRow-minor .listInline li');

// Iterate through each 'li' element in the totalReplies NodeList
totalReplies.forEach(function(li) {
    // Check if the 'li' element text contains 'Replies:' and remove it if true
    if (li.innerText.includes('Replies:')) {
        li.remove();
    }
});
    } catch (error) {
        console.error("Error removing total replies information:", error.message);
    }
})();

(function() {
  try {
    //console.log("console.log from line 11");
//    console.log("Script is running!");
    let bottomButtons = document.querySelectorAll('.block-outer--after .pageNav-page');
    //selects all page navigation buttons in the bottom set excluding next
/*    console.log(bottomButtons)
    console.log(bottomButtons.length - 1)
    console.log(document.querySelectorAll('.block-outer--after .pageNav-page'))*/
    if (bottomButtons .length > 0) {
        bottomButtons[bottomButtons.length - 1].querySelector("a").textContent = "Last";
    /// rename the text of the last button to Last. it doesn't touch the hyperlink        
    }
    } catch (error) {
        console.error("Error renaming bottom navigation button:", error.message);
    }
})();

(function() {
  try {
    //confirm script starts
//    console.log("Second script is running!");
   
// Select all page navigation buttons with the class 'pageNav-page' found in '.block-outer-main' excluding the next buttons
// This includes buttons from both the top and bottom navigation sets becuase I couldn't find a class for only the top set
    let topButtons = document.querySelectorAll('.block-outer-main .pageNav-page');

    let allLi = document.querySelectorAll('.pageNav-page');
    //makes a list of elements with the pageNav-page clas
 if (topButtons .length > 0 && allLi .length > 0) {
// Initialize variable for the class represent the last page button and a counter

let targetLi;
let count = 0;

for(let i = 0; i < allLi.length; i++) {
  if (allLi[i].classList.length === 1 && topButtons[0].classList.contains('pageNav-page--current')){
// checks if I'm on the first page of a thread
    targetLi = allLi[i];
// removes all elements but the one at the index i
      break;  

  }
     {
          if (allLi[i].classList.length === 1) {
// checks for 'pageNav-page--current' class
    count++;
// adds one to the count
    if(count === 2) {
// check if the count is 2
      targetLi = allLi[i];
// removes all elements but the one at the index i
      break;
      }
    }
  }
}   
//console.log(topButtons[0].classList)
//console.log(topButtons[0].querySelector("a"))

targetLi.querySelector("a").textContent = "Last";
    // rename the element returned from targetLi to Last. it specificlly only renames the text and not the hyperlink
 }
//console.log("console.log from line 52");
    } catch (error) {
        console.error("Error renaming top navigation button:", error.message);
    }
})();