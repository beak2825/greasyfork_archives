// ==UserScript==
// @name        LibraryThing links to WorldCat on combination/separation pages
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description Adds direct links to WorldCat searches for the editions shown in the combine/separate pages
// @include     http*://*librarything.tld/combine.php?*
// @include     http*://*librarything.com/combine.php?*
// @version     2
// @downloadURL https://update.greasyfork.org/scripts/11641/LibraryThing%20links%20to%20WorldCat%20on%20combinationseparation%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/11641/LibraryThing%20links%20to%20WorldCat%20on%20combinationseparation%20pages.meta.js
// ==/UserScript==

var paras = document.getElementsByTagName("table")[0].getElementsByTagName("p");
var wcOnclick = "onclick='event.stopPropagation()'"; // To prevent the new link from "selecting" that work for combination purposes

for ( var i=0; i<paras.length; i++ ) {

  var para = paras[i];
  var link = "";
  var wcSpan = document.createElement("span");
  var editionText = para.innerHTML; // "[Media -] Title / [Author] / [(ISBN #)] / [Format] (separate)"
  // Remove any media format, such as "Video Recording"
  editionText = editionText.replace(/^<span class="formatnotice">[^<]+<\/span> \u2014 /, "");

  // If there's an ISBN, use that
  var isbnRE = / \/[ ]+\(ISBN ([\dX]+)\)/;
  if (isbnRE.test(editionText)) {
    isbn = editionText.match(isbnRE)[1];
    link = '&nbsp;(<a ' + wcOnclick + ' href="http://worldcat.org/isbn/' + isbn + '">WorldCat</a>)'

  // If there's no match for an ISBN, use title and possible author instead
  } else {
    // Remove the last part, including the separation link and any text format
    editionText = editionText.replace(/&nbsp;\(<.*$/, "") // (separate) link
                             .replace(/ \/ <a .*$/, "") // Empty media format <a>
    var author = title = "";
    // Let's hope that if the title contains any forward slashes, there's an author following the last (non-titular) slash
    var titleAuthor = editionText.split(" / ");
    if (titleAuthor.length > 1) {
      author = titleAuthor[titleAuthor.length - 1];
    }
    authorSafe = author.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"); // This replace from CoolAJ86 at http://stackoverflow.com/questions/3446170
    var authorRE = new RegExp(" / " + authorSafe + "$");
    title = editionText.replace(authorRE, "");
    query = "ti:" + title;
    if (author != "") {
      query = query + " au:" + author;
    }
    query = encodeURIComponent(query);
    link = '&nbsp;(<a ' + wcOnclick + ' href="http://worldcat.org/search?q=' + query + '">WorldCat</a>)';
  }
  
  // Add the newly constructed link to the end of the line
  wcSpan.innerHTML = link;
  para.appendChild(wcSpan);

}