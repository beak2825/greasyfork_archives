// ==UserScript==
// @name        AO3: Archived Bookmarks
// @version     2.2
// @description Tag bookmarks with 'Archived' or another chosen tag to have them automatically hidden from searches
// @author      sharkcat
// @namespace   https://github.com/sharkcatshark/Userscripts
// @match       *://archiveofourown.org/users/*/bookmarks
// @match       *://archiveofourown.org/bookmarks*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499196/AO3%3A%20Archived%20Bookmarks.user.js
// @updateURL https://update.greasyfork.org/scripts/499196/AO3%3A%20Archived%20Bookmarks.meta.js
// ==/UserScript==

var archiveTag = "Archived"; // tag to use for fics you want to archive
var archiveTagID = 1254691;  // THIS MUST BE USER SET IF YOU CHANGE THE ABOVE // ID CAN BE FOUND HERE: &include_bookmark_search[tag_ids][]=1254691

var archiveString = "&include_bookmark_search%5Btag_ids%5D%5B%5D=" + archiveTagID;
var archiveString2 = "&bookmark_search%5Bother_bookmark_tag_names%5D=" + archiveTag;
var hiddenCount = 0;

// if actively searching for Archived works, do not hide
if ((window.location.href.includes(archiveString)) || (window.location.href.includes(archiveString2))) {
    console.log("Currently searching for archived tags");
}
else { 
    console.log("Not currently searching for archived tags")
    var bookmarks = document.querySelectorAll(".bookmark.blurb.group");
    bookmarks.forEach(checkForArchived);
    displayNumberArchived();
    console.log("Hidden Fic Count: " + hiddenCount);
};

function checkForArchived(item) {
    var userTags = item.lastElementChild.querySelector(".meta.tags.commas");

    if (userTags != null) { // if bookmark has user made tags
        var tags = userTags.getElementsByTagName("li");
        for (var i = 0; i < tags.length; ++i) { // loop through tags
            if (tags[i].innerText == archiveTag) { // if a tag matches archive tag
                item.style.display = "none"; // hide bookmark
                hiddenCount += 1;
            }
        }
    }
};

function displayNumberArchived() {
    if (hiddenCount > 0) {
        var header = document.querySelector("h2.heading");
        header.innerText += " (" + hiddenCount + " Hidden)";
    }
};
