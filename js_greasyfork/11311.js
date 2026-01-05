// ==UserScript==
// @name        LibraryThing which of my books tagged
// @namespace   https://greasyfork.org/en/users/11592-max-starkenburg
// @description On any site-wide tag page, shows which one's own books have been tagged that way (without having to page through)
// @include     http*://*librarything.tld/tag/*
// @include     http*://*librarything.com/tag/*
// @version     4
// @downloadURL https://update.greasyfork.org/scripts/11311/LibraryThing%20which%20of%20my%20books%20tagged.user.js
// @updateURL https://update.greasyfork.org/scripts/11311/LibraryThing%20which%20of%20my%20books%20tagged.meta.js
// ==/UserScript==

// Some variables
var cataloglink = document.getElementById("masttab_books");
var username = cataloglink ? cataloglink.getAttribute("href").substr(9) : null; // The chunk after "/catalog/"
var params = "{v: 1.0, width: 500, height: 650, modal: false}";

// Bring in the CSS for the tagmirror lightbox
var link = document.createElement("link");
    link.setAttribute("rel","stylesheet");
    link.setAttribute("href","/css/tagmirror.css");
    link.setAttribute("type","text/css");
document.getElementsByTagName("head")[0].appendChild(link);

// Add a "my books" link to the tag page
if (username) {
    var bodyScripts = document.getElementsByTagName("body");
    var tagNumber = 0;
    for (i=0; bodyScripts.length; i++) {
      if (bodyScripts[i].textContent.indexOf("load_tagtranslation_print(") >= 0) {
        tagNumber = bodyScripts[i].textContent.match(/load_tagtranslation_print\((\d*?),/)[1]; // The number between "load_tagtranslation_print(" and ",", since the number in "fromtag" sometimes doesn't work
        break;
      }
    }
    var myBooks = document.createElement('span');
    myBooks.className = "my-books-tagged";
    var tagText = document.getElementsByClassName("first")[0].textContent;
    tagText = tagText.substring(tagText.indexOf(":") + 1);
    myBooks.innerHTML = '(<a href="javascript:LibraryThing.lightbox.ajax(\'/ajax_tagmirror_tagtobooks.php?view='+username+'&tag='+tagNumber+'\', '+params+')">My books globally tagged '+tagText+'</a>)';
    var aka = document.getElementsByClassName("alsoknownas")[0];
    aka.nextSibling.appendChild(myBooks);
}
