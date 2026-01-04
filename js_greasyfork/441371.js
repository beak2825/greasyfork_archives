// ==UserScript==
// @name         Audible search Torrents
// @namespace    https://greasyfork.org/en/users/886084
// @version      1.0.2
// @license      MIT
// @description  Add "Search on MAM/AudioBookBay/TGx/etc" links to Audible page
// @author       DrBlank
// @include      https://www.audible.com/pd/*
// @include      https://www.audible.in/pd/*
// @include      https://www.audible.tld/pd/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441371/Audible%20search%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/441371/Audible%20search%20Torrents.meta.js
// ==/UserScript==

// list of site names and site search links
let siteDict = {
  'MAM': 'https://www.myanonamouse.net/tor/browse.php?tor[text]=',
  'ABB': 'https://audiobookbay.fi/?s=',
  'TGx': 'https://tgx.rs/torrents.php?c13=1&search=',
  'OvrD':'https://www.overdrive.com/search?q=',
  'Mblsm':'https://forum.mobilism.me/search.php?keywords=',
  'Biblkt':'https://www.librarything.com/catalog/Bibliokit&collection=-1&deepsearch=',
}

// fetching author and title
const TITLE = document.getElementsByTagName("h1")[0].innerHTML;
let authorNode = document.getElementsByClassName("authorLabel")[0];
const AUTHOR = authorNode.getElementsByTagName("a")[0].innerHTML;


// generating links to external sites
let childrenToAdd = [];
let classesToAdd = authorNode.getElementsByTagName("a")[0].className.replace(/\s+/g, ' ').trim();

for (const site in siteDict) {
  if (Object.hasOwnProperty.call(siteDict, site)) {
    const url = siteDict[site];
    let newAnchor = document.createElement("a");
    newAnchor.href = `${url}${TITLE} ${AUTHOR}`;
    newAnchor.innerHTML = site;
    newAnchor.className = classesToAdd;
    newAnchor.target = "_blank";
    childrenToAdd.push(newAnchor);
  }
}

let newMetaData = authorNode.cloneNode();

newMetaData.className = '';
newMetaData.append(`Search on: `)

childrenToAdd.forEach((elem) => {
  newMetaData.appendChild(elem)
  newMetaData.append(' | ')
})
newMetaData.innerHTML = newMetaData.innerHTML.slice(0, -3) // remove the last |

// injecting the links
authorNode.parentElement.appendChild(newMetaData)
