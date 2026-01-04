// ==UserScript==
// @name        Facebook Cleaner
// @namespace   https://openuserjs.org/scripts/freeos
// @version     1.16
// @author      -
// @description Cleans the Facebook UI - sponsored, covid, watch and other options.
// @copyright   2019, freeos (https://openuserjs.org/users/freeos)
// @license     MIT; https://opensource.org/licenses/MIT
// @include     https://www.facebook.com/*
// @include     https://facebook.com/*
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/409912/Facebook%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/409912/Facebook%20Cleaner.meta.js
// ==/UserScript==

let processOptions = true

let options = {
  hideTopNavWatch: true,
  hideTopNavMarketplace: true,
  hideTopNavGroups: true,
  hideTopNavGaming: true,
  hideLeftSideBar: true, ////
  hideRightSideBar: true,
  hideCovid: true,
  hideCreatePostTypes: true, ////
  hideStories: true, ////
  hideVideoChat: true, ////
  hideSuggestedGroups: true, ////
  hideSuggestedForYouPosts: true,
  hideCovidPosts: true,
  hideSponsored: true,
  hidePaidPartnerships: true,
  hideFooter: true,
  hideLoopInterval: 1000
}

let hideClass = 'displayNoneImportant'

let onDocReady = function(){
  //console.log('domain: ' + document.domain)
  if (processOptions) {
    if (document.domain.indexOf("facebook.com") !== -1) {
      addCSSClasses()
      removeOnce()

      removeLoop()
      setInterval(removeLoop, options.hideLoopInterval)
    }
  }
}


function removeLoop() {
  if(options.hideCovid) { removeCovid() }
  if(options.hideSuggestedForYouPosts) { removeSuggestedForYouPosts() }
  if(options.hideCovidPosts) { removeCovidPosts() }
  if(options.hideSponsored) { removeSponsored() }
  if(options.hidePaidPartnerships) { removePaidPartnerships() }
}

function removeSponsored() {
  hideXPath("//div[@aria-label='Sponsored']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
  hideXPath("//a[@aria-label='Sponsored']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
  hideXPath("//div[text()='Sponsored']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removePaidPartnerships() {
  hideXPath("//span[text()='Suggested Groups']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removeSuggestedForYouPosts() {
  hideXPath("//span[text()='Suggested for You']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removeCovidPosts() {
  hideXPath("//span[text()='Coronavirus (COVID-19) Information']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removeSuggestedGroups() {
  hideXPath("//div[text()='Paid Partnership']/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removeCovid() {
  hideXPath("//span[text()='COVID-19 Information Center']/ancestor::li")
  hideXPath("//span[contains(text(),'Spread of COVID-19')]/ancestor::div[starts-with(@data-pagelet,'FeedUnit')]")
}

function removeOnce() {
  let cssWatch = `
    div[role="navigation"][aria-label="Facebook"]>ul>li:nth-child(2) { /* watch */
      display: none !important;
    }
  `;
  let cssMarketplace = `
    div[role="navigation"][aria-label="Facebook"]>ul>li:nth-child(3) { /* marketplace */
      display: none !important;
    }
  `;
  let cssGroups = `
    div[role="navigation"][aria-label="Facebook"]>ul>li:nth-child(4) { /* groups */
      display: none !important;
    }
  `;
  let cssGaming = `
    div[role="navigation"][aria-label="Facebook"]>ul>li:nth-child(5) { /* gaming */
      display: none !important;
    }
  `;
  let cssLeftSideBar = `
    div[data-pagelet="LeftRail"] {  /* left side bar */
      visibility: hidden !important;
    }
  `;
  let cssRightSideBar = `
    div[role="complementary"] { /* right side bar */
      visibility: hidden !important;
    }
  `;
  let cssFooter = `
    footer {
      visibility: hidden !important;
    }
  `;
  let cssCreatePostTypes = `
    div[aria-label="Create a post"]>div:nth-child(2) {
      display: none !important;
    }
  `;
  let cssStories = `
    div[aria-label="Stories"] {
      display: none !important;
    }
  `;
  let cssVideoChat = `
    div[data-pagelet="VideoChatHomeUnit"] {
      display: none !important;
    }
  `;
  
  if(options.hideTopNavWatch) { GM_addStyle(cssWatch); }
  if(options.hideTopNavMarketplace) { GM_addStyle(cssMarketplace); }
  if(options.hideTopNavGroups) { GM_addStyle(cssGroups); }
  if(options.hideTopNavGaming) { GM_addStyle(cssGaming); }
  if(options.hideLeftSideBar) { GM_addStyle(cssLeftSideBar); }
  if(options.hideRightSideBar) { GM_addStyle(cssRightSideBar); }
  if(options.hideFooter) { GM_addStyle(cssFooter); }
  if(options.hideCreatePostTypes) { GM_addStyle(cssCreatePostTypes); }
  if(options.hideStories) { GM_addStyle(cssStories); }
  if(options.hideVideoChat) { GM_addStyle(cssVideoChat); }
  if(options.hideSuggestedGroups) { removeSuggestedGroups() }
  
}

function addCSSClasses() {
  let css = `
    .displayNoneImportant {
      display: none !important;
    }
    .visibilityHiddenImportant {
      visibility: hidden !important;
    }
  `;

  GM_addStyle(css);
}

function hideXPath(xPathStr) {
  let matchingElement = document.evaluate(xPathStr, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
  if(matchingElement) {
    for(var i = 0; i < matchingElement.snapshotLength; i++) {
      let curElement = matchingElement.snapshotItem(i)
      if(!curElement.classList.contains(hideClass)) {
        curElement.className += ' ' + hideClass
      }
    }
  }
}

if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
  onDocReady()
} else {
  document.addEventListener("DOMContentLoaded", onDocReady)
}
