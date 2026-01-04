// ==UserScript==
// @name         Bookmarklets to User Scripts (Everywhere)
// @version      0.1.1
// @description  Any page that has a bookmarklet will show a monkey icon
// @description  next to it, click that icon and it will create a UserScript
// @description  for you to use in Tampermonkey
// @author
// @include       *://*/*
// @icon         data:image/gif;base64,R0lGODlhEAAQAOYAAM6KjNaanO%2Byte%2B6vffDxr2anGtZWq2qraWipXt5e4SChHt9e5SWlISGhK2uraWmpb1RALVNAK1JAKVJAJRBAMZdEL1ZEIxJGIxdOb1NAKVFAJxBAJQ8AM5dELVVEJxNGJRRIYxNIb1pMaVlOa1tQq1JCKVNGJRJGKVVIZxRIZRNIYxVMbV5UoxpUoxtWpQ8CJxNIbVhMZxZMZRVMaV1Wr1hMZRdQr1pQs55UqVhQsZ1UtZ9Ws59Wr1xUs55WrVtUsZ1Wq1pUpRdSsaCa5SOjM6Ca855Y8Z9a86Gc86Cc715a96ajNaOhN6WjNaSjIx1c4RlY9aOjN6enM6mpd62teempf%2FHxv%2FPzgAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFkALAAAAAAQABAAQAewgFmCg4SFgi8eAVdYWIuNARUaGA2CQQNXV1U3VZgDOTSDSVYGjKWMBlZIQgiEGxqvEhIaM4QiEEeYmAS5V0MRGgpZUbzEmE4jD4IhFjxNAs9NOx0nT4ZZIBwcFCnWgj9LTDESNUxLPS6DLBJKvAC8ShMXWSQaQJiMjpg%2BGh%2BUHkWcilUx0mGFgywCqGApQGwKlikCVBzIIkOHlGJXpOCAAYVQCxQaIkTIUMKEDSKDAgEAOw%3D%3D
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/13026
// @downloadURL https://update.greasyfork.org/scripts/476997/Bookmarklets%20to%20User%20Scripts%20%28Everywhere%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476997/Bookmarklets%20to%20User%20Scripts%20%28Everywhere%29.meta.js
// ==/UserScript==

/**
 *
 * This UserScript was originally created by
 * [Jesse Ruderman](mailto:jruderman@gmail.com) it would only create
 * userscripts from his website at
 * [Jesse's Bookmarklets Site](https://www.squarefree.com/bookmarklets/)
 * but it seemed to be
 * broken and did not create a UserScript. I changed the code so that it
 * would take the javascript from a bookmarklet (on any website) and
 * create a UserScript and open it in a new tab. I continue to use his
 * icon and the general idea of his. Much appreciated! With my new
 * version, you can open any webpage, and if you see the monkey icon
 * there you can click on it and a new window will open with the
 * UserScript mostly created for you. Copy the contents and then paste
 * it into a new UserScript in Tampermonkey or your preferred manager.
 *
 */

// Define the regex pattern to check if a link is a bookmarklet.
const bookmarkletPattern = /javascript:\(function\(\).*\{.*\}\)\(\)/;

// Iterate through all the links present on the webpage.
for (let i = 0; i < document.links.length; i++) {
  let bookmarklet = document.links[i];

  // Check if the link matches the bookmarklet pattern using the regex test.
  if (bookmarkletPattern.test(bookmarklet.href)) {
    // Extract the name of the bookmarklet. If not present, default to 'Unnamed Bookmarklet'.
    let bookmarkletName = bookmarklet.textContent.trim() || "Unnamed Bookmarklet";

    // Decode the content of the bookmarklet and remove typical wrappers.
    let bookmarkletContent = decodeURIComponent(bookmarklet.href);
    let contentWithoutJS = bookmarkletContent
      .substring(11)
      .replace(/^\(function\(\)\{|\}\)\(\);?$/g, "");

    // Create an image element and set its properties.
    let img = document.createElement("img");
    img.src =
      "data:image/gif;base64,R0lGODlhEAAQAOYAAM6KjNaanO%2Byte%2B6vffDxr2anGtZWq2qraWipXt5e4SChHt9e5SWlISGhK2uraWmpb1RALVNAK1JAKVJAJRBAMZdEL1ZEIxJGIxdOb1NAKVFAJxBAJQ8AM5dELVVEJxNGJRRIYxNIb1pMaVlOa1tQq1JCKVNGJRJGKVVIZxRIZRNIYxVMbV5UoxpUoxtWpQ8CJxNIbVhMZxZMZRVMaV1Wr1hMZRdQr1pQs55UqVhQsZ1UtZ9Ws59Wr1xUs55WrVtUsZ1Wq1pUpRdSsaCa5SOjM6Ca855Y8Z9a86Gc86Cc715a96ajNaOhN6WjNaSjIx1c4RlY9aOjN6enM6mpd62teempf%2FHxv%2FPzgAAAP%2F%2F%2FwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAFkALAAAAAAQABAAQAewgFmCg4SFgi8eAVdYWIuNARUaGA2CQQNXV1U3VZgDOTSDSVYGjKWMBlZIQgiEGxqvEhIaM4QiEEeYmAS5V0MRGgpZUbzEmE4jD4IhFjxNAs9NOx0nT4ZZIBwcFCnWgj9LTDESNUxLPS6DLBJKvAC8ShMXWSQaQJiMjpg%2BGh%2BUHkWcilUx0mGFgywCqGApQGwKlikCVBzIIkOHlGJXpOCAAYVQCxQaIkTIUMKEDSKDAgEAOw%3D%3D";
    img.alt = `View ${bookmarkletName} as a user script.`;
    img.title = img.alt;
    img.style.border = "none";
    img.style.display = "inline";
    img.style.position = "relative";
    img.style.zIndex = "1000";

    // Construct the content for the user script.
    let scriptContent = `
// ==UserScript==
// @name ${bookmarkletName}
// @description Runs the ${bookmarkletName} bookmarklet from ${location.href}
// ==/UserScript==
${contentWithoutJS}
`;

    // Create a new anchor tag, set its properties, and attach the onclick event handler.
    let a = document.createElement("a");
    a.href = "#";
    a.onclick = function () {
      let newWindow = window.open("", "_blank");
      newWindow.document.write("<pre>" + scriptContent + "</pre>");
      return false;
    };
    a.appendChild(img);

    // Insert the new anchor tag (with the image) just before the bookmarklet link.
    bookmarklet.parentNode.insertBefore(a, bookmarklet);

    // Increment the index since we added a new link.
    i++;
  }
}
