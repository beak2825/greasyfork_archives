// ==UserScript==
// @name        BibSonomy Search Switcher
// @namespace   notableTieView
// @description Switches the search selection in BibSonomy to user search (if logged in) or to the general search (search:all)
// @version     1
// @grant       none
// @author       notableTieView
// @match        http://www.bibsonomy.org/
// @match        http://www.bibsonomy.org/*
// @downloadURL https://update.greasyfork.org/scripts/13568/BibSonomy%20Search%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/13568/BibSonomy%20Search%20Switcher.meta.js
// ==/UserScript==

searchAllLink = null;
searchUserLink = null;
menuLinks=$("#search .dropdown-menu li a");
menuLinks.each(function() {
    if ($(this).text().substring(0,6) == "search") {
        if ($(this).text().substring(7,10) == "all") {
            searchAllLink = $(this);
        } else {
            searchUserLink = $(this);
        }
    }
});
              
if (null != searchUserLink) {
    searchUserLink.click();
} else if (null!= searchAllLink) {
    searchAllLink.click();
}
  
$("#inpf").attr("placeholder", "fulltext searches");