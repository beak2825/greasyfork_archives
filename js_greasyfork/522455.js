// ==UserScript==
// @name        original-poster
// @description Add an indicator to all messages by the thread's original poster
// @namespace   https://cfillion.ca
// @version     1.2
// @author      cfillion
// @license     GPL-3.0-or-later
// @include     https://forum.cockos.com/showthread.php*
// @downloadURL https://update.greasyfork.org/scripts/522455/original-poster.user.js
// @updateURL https://update.greasyfork.org/scripts/522455/original-poster.meta.js
// ==/UserScript==

function getPosters(doc)
{
  return doc.querySelectorAll('.bigusername');
}

let label = document.createElement('span');
label.appendChild(document.createTextNode('OP'));
label.title = 'Original poster';
label.style = `
  background-color: #12768c;
  border-radius: 3px;
  color: white;
  cursor: default;
  font-size: 12px;
  font-weight: bold;
  margin-left: 5px;
  padding-left: 4px;
  padding-right: 4px;
`;

(async() => {
  const posters = getPosters(document);
  let op = posters[0];

  const threadId = document.querySelector('form input[name=searchthreadid]');
  const params = new URLSearchParams(window.location.search);
  if(threadId && (params.get('page') > 1 || params.has('p'))) {
    let response = await fetch(new URL(`showthread.php?t=${threadId.value}`, window.location.href));
    const html = await response.text();
    let parser = new DOMParser();
    let firstPage = parser.parseFromString(html, "text/html");
    op = getPosters(firstPage)[0];
  }

  for(const poster of posters) {
    if(poster.href == op.href)
      poster.parentNode.insertBefore(label.cloneNode(true), poster.nextSibling);
  }
})();
