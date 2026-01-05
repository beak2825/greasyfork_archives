// ==UserScript==
// @name         Twitter black background
// @namespace    http://www.kennyzaron.com
// @description  Changes twitter's new image-less background to a more palatable color
// @include      https://twitter.com/*
// @grant        none
// @version      1.3.08142015
// @downloadURL https://update.greasyfork.org/scripts/11106/Twitter%20black%20background.user.js
// @updateURL https://update.greasyfork.org/scripts/11106/Twitter%20black%20background.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//makes background color dark grey
addGlobalStyle('html { background-color: #363636; }');
//adds light grey color style to various text items
addGlobalStyle('.ProfileHeaderCard-locationText, .ProfileHeaderCard-screenname, \
                .ProfileHeaderCard, .AdaptiveSearchPage-moduleLink, \
                .ProfileHeaderCard-joinDateText, .PhotoRail-headingWithCount { color: #EFEFEF !important; }');
//adds dark grey style to various text
addGlobalStyle('.AdaptiveSearchPage-moduleTitle { color: #66757F !important; }');
//makes various header text white to contrast against dark grey background
addGlobalStyle('.AdaptiveSearchTimeline-separationModule .AdaptiveSearchPage-moduleHeader .AdaptiveSearchPage-moduleTitle, \
               .AdaptiveFiltersBar-label, .AdaptiveFiltersBar-target { color: #FFF !important; }');
//changes the background colors to white for various elements on search pages
addGlobalStyle('.TwitterCardsGrid, .AdaptiveRelatedSearches, .WhoToFollow, .Trends  { background-color: #FFF !important; }');
//adds the rounded border for various elements on search pages
addGlobalStyle('.AdaptiveRelatedSearches, .WhoToFollow, .TrendsInner {  border-radius: 6px; border: 1px solid #FFF; margin-bottom: 15px; }');
//adds the same background dark grey color to page-outer for scroll consistency
document.getElementById('page-outer').setAttribute("style", "background-color: #363636;");
//changes the border bottom color for selected filter style on search pages
addGlobalStyle('.is-selected { border-bottom-color: #FFF !important; }')