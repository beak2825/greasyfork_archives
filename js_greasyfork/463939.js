// ==UserScript==
// @name         PDF search on Google
// @version      1.0.0
// @description  Adds a button to search PDF with Google
// @author       Mario O.M. and D.V
// @namespace    https://github.com/marioortizmanero/reddit-search-on-google/
// @include      http*://www.google.*/search*
// @include      http*://google.*/search*
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463939/PDF%20search%20on%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/463939/PDF%20search%20on%20Google.meta.js
// ==/UserScript==
// Creating the element
let el = document.createElement('div');
el.className = 'hdtb-mitem';
const link = document.createElement('a');

// Adding the svg icon
if (useIcon) {
    const span = document.createElement('span');
    span.className = isImageSearch ? 'm3kSL' : 'bmaJhd iJddsb';
    span.style.cssText = 'height:16px;width:16px';
    span.innerHTML = redditIcon;
    link.appendChild(span);
}

// Hyperlink to add 'site:reddit.com' to the query
link.appendChild(document.createTextNode('PDF'));

// Agregar un menú desplegable
const menu = document.createElement('ul');
menu.id = 'pdf-menu';
menu.style.display = 'none';
const menuItems = ['Opción 1', 'Opción 2', 'Opción 3'];
menuItems.forEach((item) => {
  const menuItem = document.createElement('li');
  const menuItemLink = document.createElement('a');
  menuItemLink.href = '#';
  menuItemLink.innerText = item;
  menuItem.appendChild(menuItemLink);
  menu.appendChild(menuItem);
});
el.appendChild(menu);

link.addEventListener('mouseover', () => {
  menu.style.display = 'block';
});

link.addEventListener('mouseout', () => {
  menu.style.display = 'none';
});

// Reemplazar el enlace original
link.href = window.location.href.replace(queryRegex, (match) => {
    // Replaces the existing `site` flags
    return match.search(siteRegex) >= 0 ? match.replace(siteRegex, redditUrl) : match + redditUrl;
});

if (isImageSearch) {
    link.classList.add('NZmxZe');
    el = link;
} else {
    el.appendChild(link);
}

// Inserting the element into Google search
if (appendRight) {
    const toolsBtn = document.querySelector(isImageSearch ? '.ssfWCe' : '.t2vtad');
    toolsBtn.parentNode.insertBefore(el, toolsBtn.nextSibling);
} else {
    const menuBar = document.querySelector(isImageSearch ? '.T47uwc' : '.MUFPAc');
    if (isImageSearch) {
        menuBar.insertBefore(el, menuBar.children[menuBar.childElementCount - 1]);
    } else {
        menuBar.appendChild(el);
    }
}
