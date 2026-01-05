// ==UserScript==
// @name        LibraryThing alphabetize book tags
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Sort a book's tag in alphabetical order
// @include     http*://*librarything.tld/addbooks
// @include     http*://*librarything.tld/catalog_bottom.php*
// @include     http*://*librarything.tld/work/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22025/LibraryThing%20alphabetize%20book%20tags.user.js
// @updateURL https://update.greasyfork.org/scripts/22025/LibraryThing%20alphabetize%20book%20tags.meta.js
// ==/UserScript==

var url = document.URL;
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var field, tags;

// Reused sort function
function sortTags(tagList) {
  return tagList.split(", ").sort(function(a,b) {
    return a.localeCompare(b);
  }).join(", ");
}

// "Add books" pages
if (url.indexOf("/addbooks") > -1) {
  var observer = new MutationObserver(function(mutations, observer) {
    var fields = document.getElementsByName("form_tags");
    for (var i=0; i<fields.length; i++) {
      editableTags = fields[i].value;
      fields[i].value = sortTags(editableTags);
    }
    var briefs = document.getElementsByClassName("briefinfo");
    for (var l=0; l<briefs.length; l++) {
      displayTagsSpan = briefs[l].getElementsByTagName("span")[0];
      displayTagsSpan.textContent = sortTags(displayTagsSpan.textContent);
    }
  });
  observer.observe(document.getElementById("bookframe"), {
    childList: true
  });
}

// Catalog pages
if (url.indexOf("/catalog_bottom.php") > -1) {
  var tagsHeader = document.getElementById("head_tags");
  if (tagsHeader) {
    var tagsRow = [].indexOf.call(tagsHeader.parentNode.children, tagsHeader);
    var rows = document.getElementById("lt_catalog_list").getElementsByTagName("tr");
    for (var j=0; j<rows.length; j++) {
      cell = rows[j].getElementsByTagName("td")[tagsRow];
      cell.innerHTML = sortTags(cell.innerHTML);
      cell.addEventListener("dblclick", function(event) {
        field = event.target.getElementsByTagName("textarea")[0];
        tags = field.value;
        field.value = sortTags(tags);
      });
    }
  }
}

// Book pages
if (url.indexOf("/work/") > -1) {
  // Edit book page
  if (url.indexOf("/edit/") > -1) {
    field = document.getElementById("form_tags");
    tags = field.value;
    field.value = sortTags(tags);
    var displayTags = field.nextSibling.getElementsByTagName("div")[1];
    var displayTagsText = displayTags.textContent;
    var currentTagsLabel = displayTagsText.split(": ")[0];
    displayTagsText = displayTagsText.substring(displayTagsText.indexOf(": ") + 1);
    displayTags.textContent = currentTagsLabel + ": " + sortTags(displayTagsText);
  // Book details page
  } else if (url.indexOf("/details/") > -1) {
    field = document.getElementById("bookedit_tags");
    tags = field.innerHTML;
    field.innerHTML = sortTags(tags);
  // Main work page (which sometimes just has a URL like, e.g. /work/NNNN/NNNN)
  } else {
    var tagEdit = document.getElementById("tagEditSpan");
    var tagTrigger = tagEdit.getElementsByTagName("a")[0];
    tagTrigger.addEventListener("click", function(event) {
      field = event.target.parentNode.parentNode.getElementsByTagName("textarea")[0];
      tags = field.value;
      field.value = sortTags(tags);
    });
    var tagEditList = tagEdit.parentNode.getElementsByTagName("span")[0];
    tagEditList.innerHTML = sortTags(tagEditList.innerHTML);
  }
}
