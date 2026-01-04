// ==UserScript==
// @namespace     http://www.squarefree.com/userscripts
// @name          Bookmarklets to User Scripts
// @description   Lets you install any bookmarklet as a user script.
// @include       *
// @version 0.0.1.20171027182952
// @downloadURL https://update.greasyfork.org/scripts/34584/Bookmarklets%20to%20User%20Scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/34584/Bookmarklets%20to%20User%20Scripts.meta.js
// ==/UserScript==

// Ideas for improvements:
// * Pretty-print the bookmarklet using something like http://subsimple.com/bookmarklets/format.js but without the bugs.

var i, bookmarklet, bookmarkletName, img, a;

for (i = 0; bookmarklet = document.links[i]; ++i)
{
  if (bookmarklet.protocol == "javascript:")
  {
    bookmarkletName = bookmarklet.textContent;

    img = document.createElement("img");
    img.src = "data:image/gif;base64,R0lGODlhEAAQAOYAAM6KjNaanO%2Byte%2B6vffDxr2anGtZWq2qraWipXt5e4SChHt9e5SWlISGhK2uraWmpb1RALVNAK1JAKVJAJRBAMZdEL1ZEIxJGIxdOb1NAKVFAJxBAJQ8AM5dELVVEJxNGJRRIYxNIb1pMaVlOa1tQq1JCKVNGJRJGKVVIZxRIZRNIYxVMbV5UoxpUoxtWpQ8CJxNIbVhMZxZMZRVMaV1Wr1hMZRdQr1pQs55UqVhQsZ1UtZ9Ws59Wr1xUs55WrVtUsZ1Wq1pUpRdSsaCa5SOjM6Ca855Y8Z9a86Gc86Cc715a96ajNaOhN6WjNaSjIx1c4RlY9aOjN6enM6mpd62teempf%2FHxv%2FPzgAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFkALAAAAAAQABAAQAewgFmCg4SFgi8eAVdYWIuNARUaGA2CQQNXV1U3VZgDOTSDSVYGjKWMBlZIQgiEGxqvEhIaM4QiEEeYmAS5V0MRGgpZUbzEmE4jD4IhFjxNAs9NOx0nT4ZZIBwcFCnWgj9LTDESNUxLPS6DLBJKvAC8ShMXWSQaQJiMjpg%2BGh%2BUHkWcilUx0mGFgywCqGApQGwKlikCVBzIIkOHlGJXpOCAAYVQCxQaIkTIUMKEDSKDAgEAOw%3D%3D";
    img.alt = "Install " + bookmarkletName + " as a user script.";
    img.title = img.alt;
    img.style.border = "none";

    // hack for http://www.squarefree.com/bookmarklets/
    img.style.display = "inline"; 
    
    a = document.createElement("a");
    //// This works in FF4!
    a.href = "data:text/javascript;charset=utf-8,"
    // a.href = "data:application/octet-stream,"
           + "// ==UserScript==%0A"
           + "// @namespace http://www.squarefree.com/bookmarklets-to-user-scripts%0A"
           + "// @name " + bookmarkletName + "%0A"
           + "// @description Runs the " + bookmarkletName + " bookmarklet from " + location.href + "%0A"
           + "// ==/UserScript==%0A"
           + "%0A"
           + encodeURIComponent(bookmarklet.href.replace(/%20/g,' ')) 
           + "%0A//.user.js";
 
    a.appendChild(img);
    a.appendChild(document.createTextNode(" "));
    bookmarklet.parentNode.insertBefore(a, bookmarklet);

    // We just added a link, and document.links is live, so...
    ++i; 
  }
}