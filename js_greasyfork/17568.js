// ==UserScript==
// @name         ComicReader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You

// @match        http://comics.dekuapp.com/read*
if (document.location.href.startsWith('http://comics.dekuapp.com/read')) {
    reader.maxPages = 40;  
}

// @match        http://bato.to/reader*
else if (document.location.href.startsWith('http://bato.to/reader')) {
    var button = document.createElement('button');
    button.addEventListener('click', function() {
        var url = 'http://comics.dekuapp.com/read?page_url=' + encodeURIComponent(document.location.href);
        document.location.href = url;
    });
    button.innerText = 'ComicReader';
    button.style.width = '100%';
    button.style.marginBottom = '10px';
    button.style.background = '#eee';
    button.style.color = '#111';
    button.style.border = 'none';

    var content = document.querySelector('#content');
    content.insertBefore(button, content.firstChild);
}

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17568/ComicReader.user.js
// @updateURL https://update.greasyfork.org/scripts/17568/ComicReader.meta.js
// ==/UserScript==
