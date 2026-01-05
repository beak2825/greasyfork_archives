// ==UserScript==
// @name        LibraryThing ignore articles/punctuation on combine page
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Don't take articles ("a", "an", "the", etc.) or punctuation into account when sorting works on the "Combine Works" pages
// @include     http*://*librarything.tld/combine.php?*
// @include     http*://*librarything.com/combine.php?*
// @exclude     http*://*librarything.tld/combine.php?*&sort=1
// @exclude     http*://*librarything.com/combine.php?*&sort=1
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/20060/LibraryThing%20ignore%20articlespunctuation%20on%20combine%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/20060/LibraryThing%20ignore%20articlespunctuation%20on%20combine%20page.meta.js
// ==/UserScript==

var articles = localStorage.ignoredArticles ? localStorage.ignoredArticles : "the,a,an";
var table = document.getElementsByClassName("combinetable")[0];
var rows = table.getElementsByTagName("tr");
for (var i=0; i<rows.length; i++) {
  var row = rows[i];
  var sortTitle = row.getElementsByTagName("h2")[0].childNodes[1].textContent.toLowerCase();
  // Strip out anything that isn't a number, space, or alpha character (include diacritics)
  // Thanks to SO users Wak and Cœur here http://stackoverflow.com/a/11550799/5285945
  // as well as SO user bjornd here http://stackoverflow.com/a/6163180/5285945
  sortTitle = sortTitle.replace(/[^A-Za-z0-9 \u00C0-\u017F]/g,"").trim().replace(/\s+/g," ");
  // Strip out any articles
  var articlesArray = articles.split(",");
  for (var j=0; j<articlesArray.length; j++) {
    // Thanks to SO user Jason McCreary here http://stackoverflow.com/a/4029123/5285945
    var articleRE = new RegExp("^" + articlesArray[j].trim() + " ");
    sortTitle = sortTitle.replace(articleRE, "");
  }
  row.sortTitle = sortTitle;
}

// Sort the titles with punctuation and articles removed
// Thanks to SO user Oriol here http://stackoverflow.com/a/28311228/5285945
var sortedRows = [].slice.call(rows).sort(function(a,b) {
  return a.sortTitle.localeCompare(b.sortTitle);
})

// Reattach the works in their new order
for (var k=0; k<sortedRows.length; k++) {
  table.getElementsByTagName("tbody")[0].appendChild(sortedRows[k]);
}

/* The following lines are necessary because LT has some malformed HTML, basically something like:
   <div class="combineHead">
     <form>
   </div>
   <table .../>
   </form>
   So reattach the form to the "content" div, then reattach elements inside the form
*/
var form = document.getElementsByName("works")[0];
document.getElementsByClassName("content")[0].appendChild(form);
var hr = document.getElementsByTagName("hr")[0];
var h2 = form.getElementsByTagName("h2")[0];
var buttons1 = form.getElementsByTagName("p")[0];
var buttons2 = table.nextSibling;
form.appendChild(buttons1);
// detour for new feature (customize ignored words)
var articlesInput = document.createElement("div");
articlesInput.innerHTML = '<br/><div style="float: right;">\
  Sort should ignore: <input id="gm-articles-input" type="text" value="' + articles.replace(/,([^\s])/g,", $1") + '"/>\
  <input type="button" value="Update page" id="gm-articles-update" onclick="\
  localStorage.ignoredArticles = document.getElementById(\'gm-articles-input\').value; \
  setTimeout( function() { window.location.reload(false) }, 100);"/></div>';
h2.style.marginTop = "-1em";
form.appendChild(articlesInput);
// end detour
form.appendChild(h2);
form.appendChild(hr);
form.appendChild(table);
if (buttons2 && buttons2.nodeType != 3) form.appendChild(buttons2);
// Only adding the following because those who have the "LT better Combine Works button" script 
// end up having the size of the new box affected by the shenanigans in this script
var newButtons = document.getElementById("gm-new-buttons");
if (newButtons) {
  newButtons.style.fontSize = ".9em";
}

// If "Enter" is typed while editing the ignored articles form, don't inadvertently submit the page's combine form
document.getElementById("gm-articles-input").addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode == 13) {
    document.getElementById("gm-articles-update").click();
  }
});
document.getElementById("gm-articles-input").addEventListener("keydown", function(event) {
  if (event.keyCode == 13) {
    event.preventDefault();
  }
});