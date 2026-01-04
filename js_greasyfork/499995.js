// ==UserScript==
// @name         F95 Random Bookmark Picker
// @namespace    1330126-edexal
// @license      Unlicense
// @version      1.3
// @description  Randomly picks a bookmark from your f95-like bookmark page. Just press the 'Random' button.
// @author       Edexal
// @match        *://f95zone.to/account/bookmarks*
// @icon         https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant        none
// @homepageURL  https://sleazyfork.org/en/scripts/490810-f95-random-bookmark-picker
// @supportURL   https://github.com/Edexaal/scripts/issues
// @require      https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @downloadURL https://update.greasyfork.org/scripts/499995/F95%20Random%20Bookmark%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/499995/F95%20Random%20Bookmark%20Picker.meta.js
// ==/UserScript==
(() => {
  'use strict';
  const BOOKMARK_QUERY = 'bmpos';

  //CSS styles
  Edexal.addCSS(`
		#randbtn{
			color:yellow;
			border: 1px solid #343638;

		}
		#randbtn:hover{
			cursor: pointer;
			opacity: 0.7;
		}
		#randbtn:active{
			background-color: #ec5555;
		}
		#chosen{
			color: yellow;
			text-shadow: #cc0000 1px 0 8px;
      display:inherit !important;
		}
    #randContainer{
      margin-top:20px;
    }
	`);

  function getRandIntInc(min, max) {
    //Inclusive random number generator
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function highlightBookmarkChoice() {
    if (!location.search.includes(BOOKMARK_QUERY)) {
      return;
    }
    let newURL = location.href.substring(0,
      location.search.includes('&' + BOOKMARK_QUERY) ? location.href.indexOf('&' + BOOKMARK_QUERY) : location.href.indexOf(BOOKMARK_QUERY));// removes '&bmpos'  or 'bmpos' from URL
    history.replaceState({}, "", newURL); //Change the URL to one w/o 'bmpos' query param

    let bookmarkListEl = document.querySelector("ol.listPlain");

    let randBookmarkPos = getRandIntInc(0, bookmarkListEl.children.length - 1);// Pick a random bookmark position (usually 0-19, total 20)
    let chosenBookmarkEl = bookmarkListEl.children[randBookmarkPos];
    chosenBookmarkEl.id = "chosen";
    chosenBookmarkEl.scrollIntoView(false); //scroll selected bookmark into view from the bottom of the page
  }

  highlightBookmarkChoice();

  let randBtn = Edexal.newEl({
    element: 'button',
    name: "random",
    type: "button",
    id: "randbtn",
    class: ["pageNav-jump", "pageNav-jump--next"],
    text: 'Random'
  });

  //Pick bookmark from a selection of all pages
  function pickRandomBookmark() {
    let pagination = document.querySelector("ul.pageNav-main");//Select pagination
    let lastPageNum = pagination.children[pagination.children.length - 1].children[0].textContent;//Get the last page number of the pagination
    let randPageChoiceNum = getRandIntInc(1, Number(lastPageNum));//Pick a random page number
    let curURL = new URL(location.href);//Get the current URL
    curURL.searchParams.set("page", randPageChoiceNum);//Customize URL to point to the randomly chosen page number

    //Customize URL to add bookmark query parameter
    curURL.searchParams.set("bmpos", '1');

    //Go To randomly chosen bookmark page
    location.replace(curURL.toString());
  }

  //Pick bookmark on the first page (if 1 page is only available)
  function pickRandBookmarkOne() {
    let curURL = new URL(location.href);//Get the current URL
    curURL.searchParams.set("page", '1');//Customize URL to point to the randomly chosen page number

    //Customize URL to add bookmark query parameter
    curURL.searchParams.set("bmpos", '1');

    //Go To randomly chosen bookmark page
    location.replace(curURL.toString());
  }

  //Add button to F95
  let entirePaginationEl = document.querySelector("nav > div.pageNav");
  //Checks if there is only a single page of bookmarks or more
  if (!!entirePaginationEl) {
    // > 1
    let isPageNavVisible = window.getComputedStyle(document.querySelector(".pageNavWrapper--mixed .pageNav")).getPropertyValue("display") === "none";
    if (isPageNavVisible) {
      //Mobile Pagination (w/ arrows)
      let randContainerEl = Edexal.newEl({element: "div", id: "randContainer"});
      randContainerEl.appendChild(randBtn);
      let pageArrowsEl = document.querySelector(".block-outer--after");
      pageArrowsEl.appendChild(randContainerEl);
    } else {
      //Desktop Pagination
      entirePaginationEl.appendChild(randBtn);
    }
    Edexal.onEv(randBtn,"click",pickRandomBookmark);

  } else {
    // == 1
    document.querySelector("div > div.breadcrumb.p-breadcrumb--bottom").prepend(randBtn);
    Edexal.onEv(randBtn,"click",pickRandBookmarkOne);
    Edexal.addCSS(`
		#randbtn {
			position:relative;
			left: 50%;
			width:150px;
			height:40px;
			font-size: 16px;
			border: 1pt inset navajowhite;
			box-shadow: 0 1px 5px #988787;
			border-radius: 50px;
		}
		`);
  }

})();
