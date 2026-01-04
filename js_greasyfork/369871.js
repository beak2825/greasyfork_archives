// ==UserScript==
// @locale       english
// @name         gfy2md
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  convert urls on gfy upload results to reddit markdown
// @run-at       document-end
// @license      MIT
// @author       elopeWithMe
// @match        *://*gfycat.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369871/gfy2md.user.js
// @updateURL https://update.greasyfork.org/scripts/369871/gfy2md.meta.js
// ==/UserScript==
let keys = {
  A: 65,
  Z: 90
};

document.addEventListener('keyup', hotkeys, false);

function hotkeys(e) {
  if (e.shiftKey && e.ctrlKey) {
    switch (e.which) {
      case keys.A:
        gfy2md('results');
        break;
      case keys.Z:
        gfy2md('album');
        break;
    }
  }
}

function gfy2md(page) {
  if (page === 'results') {
    var urls = Array.from(document.getElementsByClassName('copy-input-text'));
    var titles = Array.from(
      document.getElementsByClassName('titleinput-container')
    );
    titles = titles.map(container => {
      return container.firstChild.firstChild.value;
    });
    urls = urls.map(input => {
      return input.value;
    });
  } else if (page === 'album') {
    var urls = Array.from(document.getElementsByClassName('gif-url'));
    var titles = Array.from(document.querySelectorAll('span.name'));
    titles = titles.map(span => {
      return span.textContent;
    });
    urls = urls.map(a => {
      return a.href;
    });
  }
  let md = '';

  // titles = Array.from(titles);
  // urls = Array.from(urls);

  let links = titles.map((title, i) => {
    return [title, urls[i]];
  });

  links = links.sort((a, b) => {
    return compareLists(a[0], b[0]);
  });

  links.forEach(link => {
    md += `[${link[0]}](${link[1]})\n\n`;
  });

  md += '[Source]()';

  copyToClipboard(md);

  function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  }

  function compareLists(a, b) {
    var alist = a.split(/(\d+)/), // split text on change from anything to digit and digit to anything
      blist = b.split(/(\d+)/); // split text on change from anything to digit and digit to anything

    alist.slice(-1) == '' ? alist.pop() : null; // remove the last element if empty
    blist.slice(-1) == '' ? blist.pop() : null; // remove the last element if empty

    for (var i = 0, len = alist.length; i < len; i++) {
      if (alist[i] != blist[i]) {
        // find the first non-equal part
        if (alist[i].match(/\d/)) {
          // if numeric
          return +alist[i] - +blist[i]; // compare as number
        } else {
          return alist[i].localeCompare(blist[i]); // compare as string
        }
      }
    }

    return true;
  }
}
