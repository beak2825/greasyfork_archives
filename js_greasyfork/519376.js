// ==UserScript==
// @name         Qiita Advent Calendar Feed Export
// @namespace    https://fuwa.dev
// @version      2024-11-30
// @description  export subscription list of Qiita Advent Calendar as OPML
// @author       fuwa2003
// @match        https://qiita.com/advent-calendar/*/feed
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qiita.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519376/Qiita%20Advent%20Calendar%20Feed%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/519376/Qiita%20Advent%20Calendar%20Feed%20Export.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
  function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  function run() {

    const entries = Array.from(document.querySelectorAll('main > div > section ol li > div a'))
      .map((a) => ({
        text: a.innerText + " Advent Calendar - Qiita",
        href: a.href,
      }));

    const entries_text = entries.map((entry) => (
          `  <outline title="${entry.text}" text="${entry.text}" type="rss" xmlUrl="${entry.href}/feed" />`
    )).join('\n');

    const opml = `
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <head>
    <title>Qiita Advent Calendar subscriptions</title>
  </head>
  <body>
${entries_text}
  </body>
</opml>
    `.trim();

    // download file
    download('qiita.opml', opml);
  }

  const btn = document.createElement('button');
  btn.innerText = 'Export OPML';
  btn.addEventListener('click', run);
  document.querySelector('main > div > section').prepend(btn);
  console.log(btn);

  // when btn removed, add again
  btn.addEventListener('DOMNodeRemoved', (e) => {
    console.log('removed', e);
    setTimeout(() => {
      document.querySelector('main > div > section').prepend(btn);
    }, 100);
  });

})();
