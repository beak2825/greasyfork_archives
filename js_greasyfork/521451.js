// ==UserScript== 
// @name        eD2k Book Library
// @description Add an eD2k (eDonkey2000) links to Anna’s Archive.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.ed2k-book-library
// @homepageURL https://greasyfork.org/scripts/521451-ed2k-book-library
// @supportURL  https://greasyfork.org/scripts/521451-ed2k-book-library/feedback
// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @match       *://annas-archive.li/md5/*
// @match       *://annas-archive.org/md5/*
// @match       *://annas-archive.se/md5/*
// @match       *://libgen.bz/*
// @match       *://libgen.gs/*
// @match       *://libgen.io/*
// @match       *://libgen.la/*
// @match       *://libgen.li/*
// @match       *://libgen.org/*
// @match       *://libgen.vg/*
// @version     1.0.0 
// @downloadURL https://update.greasyfork.org/scripts/521451/eD2k%20Book%20Library.user.js
// @updateURL https://update.greasyfork.org/scripts/521451/eD2k%20Book%20Library.meta.js
// ==/UserScript==

const
  namespace = 'i2p-schimon-ed2k-book-library';

// create button
(function init() {
  // Properties
  let bookMd5sum, bookUri, bookTitle;
  if (location.search.startsWith('?md5=')) {
    url = new URL (location.href)
    bookMd5sum = url.searchParams.get('md5');
    bookTitle = 'Book ' + document.evaluate('/html/body/table/tbody/tr[2]/td[2]/table/tbody/tr[2]/td[2]/text()[1]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
  } else {
    bookTitle = 'Book ' + document.title;
    bookMd5sum = document.documentURI.split('/')[4];
  }
  //bookFormat = 
  bookSize = 1 // TODO Extract MB and convert to bytes: mb * 1024 * 1024
  // create element
  createButton('🫏', 90, `ed2k://|file|${bookTitle}|${bookSize}|${bookMd5sum}|/`);
  createButton('🧲', 20, `magnet:?dn=${bookTitle}&xt=urn:ed2k:${bookMd5sum}&xt=urn:ed2khash:${bookMd5sum}&xl=${bookSize}`);
})();

function createButton(icon, pixels, uri) {
  btn = document.createElement('a');
  // set content
  btn.textContent = icon;
  btn.id = namespace;
  btn.href = uri
  //btn.style.all = 'unset';
  // set position
  btn.style.position = 'fixed';
  btn.style.bottom = pixels + 'px';
  btn.style.right = '10px';
  // set appearance
  btn.style.background = '#000';
  btn.style.filter = 'drop-shadow(2px 4px 6px #ff0000)';
  btn.style.borderRadius = '50px'
  btn.style.marginTop = '100px';
  btn.style.marginRight = '10px';
  btn.style.minWidth = '50px';
  btn.style.minHeight = '50px';
  btn.style.fontSize = '25px';
  btn.style.zIndex = 10000;
  // center character
  btn.style.justifyContent = 'center';
  btn.style.alignItems = 'center';
  btn.style.display = 'flex';
  btn.style.textDecoration = 'none';
  // disable selection marks
  btn.style.outline = 'none';
  btn.style.userSelect = 'none';
  btn.style.cursor = 'default';
  // set button behaviour
  btn.onclick = () => {
    location.href = uri
  };
  btn.onmouseover = () => {
    btn.style.filter = 'drop-shadow(2px 4px 6px #0000ff)';
  };
  btn.onmouseout = () => {
    btn.style.filter = 'drop-shadow(2px 4px 6px #ff0000)';
  };
  document.body.append(btn);
}
