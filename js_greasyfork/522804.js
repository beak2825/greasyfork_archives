// ==UserScript==
// @name         BookCrossing BCID Export
// @namespace    http://tampermonkey.net/
// @version      2025-01-05
// @description  Export BCIds, title, author, and category of books on the current page to a CSV file. This can than be used to print labels.
// @author       Kiki
// @match        https://www.bookcrossing.com/mybookshelf/*/available
// @icon         https://www.bookcrossing.com/images/site/bookcrossing-icon-new-256.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522804/BookCrossing%20BCID%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/522804/BookCrossing%20BCID%20Export.meta.js
// ==/UserScript==

(function() {
    'use strict';

    createButton();
})();

function createButton()
{
    var menu = document.querySelector('div#content > h2 + div');
    if(null == menu)
    {
        console.log('Menu not found, cannot create button.');
        return;
    }
    console.log('createButton 1');

    var btn = createElementFromHTML(`
    <a target="_blank" class="plain" href="" title="Export BCIDs" onclick="return false;">
      <i class="fas fa-save muted">
      </i>
    </a>
    `);
    btn.innerHTML += "&nbsp;&nbsp;";

    btn.onclick = exportAll;

    menu.insertBefore(btn, menu.firstChild);
}

function createElementFromHTML(htmlString)
{
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div.firstChild;
}


function exportAll()
{
    var txt = "BCID\tTitle\tAuthor\tCategory";
    document.querySelectorAll('div.book-list-detail').forEach(
        (book) => {
            var title = book.querySelector('h5 > a').innerText;
            var author = book.querySelector('div > a').innerText;
            var cat = book.querySelector('div > a:nth-of-type(2)').innerText;
            var bcid = book.querySelector('div:nth-of-type(4)  > div:nth-of-type(2) > span').innerText;
            bcid = bcid.replace('BCID: ', '');
            txt += `\r\n${bcid}\t${title}\t${author}\t${cat}`;
        });

    var dlurl = 'data:text/csv;base64,' + btoa(txt);

    saveFile(dlurl);

    return false;
}


function exportBCIDs()
{
    var ids = "BCID\r\n";
    document.querySelectorAll('div.my-2 > span').forEach(
        (e) => {
            ids = ids + e.textContent.replace('BCID: ', '') + "\n";
        });

    var dlurl = 'data:text/csv;base64,' + btoa(ids);

    saveFile(dlurl);

    return false;
}


function saveFile(fileURL, fileName)
{
  var save = document.createElement('a');
  save.href = fileURL;
  save.target = '_blank';
  save.download = fileName || 'unknown';

  var evt = new MouseEvent('click',
  {
      //'view': window,
      'bubbles': true,
      'cancelable': false
  });
  save.dispatchEvent(evt);
}
