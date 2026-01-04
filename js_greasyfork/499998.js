// ==UserScript==
// @name        F95 Random Latest Update Choice
// @namespace   1330126-edexal
// @match       *://f95zone.to/sam/latest_alpha/*
// @icon        https://external-content.duckduckgo.com/ip3/f95zone.to.ico
// @grant       none
// @version     1.2
// @author      Edexal
// @license     Unlicense
// @description Randomly selects a resource(e.g. game,asset,animation) from the 'Latest Update' page. Just press the '?' button in the filter drawer.
// @homepageURL https://sleazyfork.org/en/scripts/499998-f95-random-latest-update-choice
// @supportURL  https://github.com/Edexaal/scripts/issues
// @require     https://cdn.jsdelivr.net/gh/Edexaal/scripts@e58676502be023f40293ccaf720a1a83d2865e6f/_lib/utility.js
// @downloadURL https://update.greasyfork.org/scripts/499998/F95%20Random%20Latest%20Update%20Choice.user.js
// @updateURL https://update.greasyfork.org/scripts/499998/F95%20Random%20Latest%20Update%20Choice.meta.js
// ==/UserScript==
(() => {
  const LATEST_PAGE_QUERY = 'lppos';
  Edexal.addCSS(`
  .fa-question {
    color: yellow;
    background:#641c1c;
    font-size: 15px;
  }

  .fa-question:hover{
			cursor: pointer;
			opacity: 0.7;
		}

  .fa-question::before {
	  content: "\\3f";
  }

  /*Tooltip for button*/
   #filter-random::before {
    content: "lucky";
  }

  /*Chosen item*/
  #chosen {
	  box-shadow: #c00 1px 0 10px 8px !important;
  }
    #chosen > a.resource-tile_link {
      color: yellow !important;
			text-shadow: #cc0000 1px 0 8px;
    }

/*Button Labels*/
    aside#latest-page_filter-wrap
    div#latest-page_filter-wrap_inner
    div.content-block_filter
    h3.content-block_filter-title
    div#filter-controls a::before{
      right:105px;
    }

    aside#latest-page_filter-wrap
    div#latest-page_filter-wrap_inner
    div.content-block_filter
    h3.content-block_filter-title
    div#filter-controls a:hover::before{
      width: 135px;
      color: #ecac31;
    }

  `);

  //Random number
  function getRandIntInc(min, max) {
    //Inclusive random number generator
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Chooses a random item on the page
  function selectAnItem() {
    if (!location.search.includes(LATEST_PAGE_QUERY)) {
      return;
    }
    //Change the URL to one w/o 'lppos' query param
    let curURL = new URL(location.href);
    curURL.searchParams.delete(LATEST_PAGE_QUERY);
    history.replaceState({}, "", curURL.toString());

    //Selects a random item on the page
    let allItemsEls = document.querySelectorAll(".resource-tile"); // Gets all resource tiles
    let randNumChoice = getRandIntInc(1, allItemsEls.length);
    let chosenEl = allItemsEls[randNumChoice - 1];
    chosenEl.id = "chosen";
    chosenEl.scrollIntoView(false);//scroll selected bookmark into view from the bottom of the page
  }

  //Chooses a random page and goes to it
  function goToAPage() {
    let maxPageNum = document.querySelector(".sub-nav_info-paging_nums .nav_num:last-child").dataset.page;
    let chosenNum = getRandIntInc(1, +maxPageNum);
    let curURL = new URL(location.href);//Get the current URL
    //Customize URL to add latest page query parameter
    curURL.searchParams.set(LATEST_PAGE_QUERY, '1');
    //Change page to random one
    let newURL = !curURL.toString().includes("page=") ? `${curURL.toString()}#/cat=games/page=${chosenNum}` :
      curURL.toString().replace(/page=\d+/i, `page=${chosenNum}`);

    location.replace(newURL);//Go To randomly chosen bookmark page
  }

  //Creates the random button
  function makeRandbtn() {
    let randLinkEl = Edexal.newEl({element: "a", class: ["button-icon"], id: "filter-random"});

    let randIconEl = Edexal.newEl({element: "i", class: ["fas", "fa-question"]});

    let parentEl = document.querySelector("#filter-controls");
    Edexal.onEv(randLinkEl, "click", goToAPage);
    randLinkEl.append(randIconEl);
    parentEl.insertAdjacentElement('afterbegin', randLinkEl);
  }

  function run() {
    makeRandbtn();
    setTimeout(selectAnItem, 2500); // [VALUE] Wait for elements to load before executing
  }

  run();

})();
