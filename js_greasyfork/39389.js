// ==UserScript==
// @name         Goodreads: ABB link
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Adds a link to Audiobook Bay searching for the title and author
// @author       You
// @include      /^https?://www\.goodreads\.com/book/.*$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39389/Goodreads%3A%20ABB%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/39389/Goodreads%3A%20ABB%20link.meta.js
// ==/UserScript==

/* jshint esnext: true */

(function () {
    'use strict';

    const bookTitle = document.getElementsByClassName('gr-h1')[0];
    const haveAudiobook = document.querySelector('.wtrNonExclusiveShelf[value="have-audiobook"]');
    window.abb = window.abb || {};

    function abbLink() {
        const src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABgFBMVEUefnogfnsegHwhgX0khIAkhIAkhIAkhIA0i4g0i4g0i4g8kIxAko9Jl5RJl5RJl5RJl5RTnZpTnZpZoZ1ZoZ1epKFoqaZoqaZoqaZoqaZoqaZ0rat0rat2sa17tLHaAQHaAQHaAQHaAQHaDxDZEA/aGBjaGBjaGBjaGBjaGBjbHiDfIB7cJSXcJSXeLjDaMC/eODneODneODniAQHiAQHhFxjhFxjhFxjgOTrhSkvhSkvkVVXkVVXjZGTjZGTleXnleXmHuriHuriHuriHuriWv76PwL2Swb6XxMKXxMKXxMKlzMqlzMqlzMqr0M6v0dC72Ne72Ne72NfohYbohYbohYbsmZnsmZnsmZnwn5/tpqftpqfusbHwqanwqanwqanzu7vzu7vD3dzD3dzI4N7I4N7L4uDa6Oja6Oja6Oja6Oj1ycn1ycn32Nn32Nn32Nn32Nn32Nnh7ezq8/Pq8/P66en66en66en+/v7+/v7+/v7+/v7+/v4AAAAAAAAAAACpIptbAAAC0klEQVRIiZWWz2vqQBDHN84eFjSHEOJFnjloLrHYgghPRCSHZ4WAFgqFSgQJJTkULwkL++e/mU3Sxh+tcTxsspnP7Mz++K5MXVqeho4Q9irNr3xk5x3JyhbcYIbBGBdWEP8O5KHFOYBRWAuAg7nOfwbCDofKFaClHwHaJ0gNSB3tDpxzYZqW2caHosOMrwFbob+CGbwU1eZZvMIMW4SsL4FnSh1476zKpI9xsJbeORBwcu+m55OiVNanxHg3PwGeKbzYXrqTfZiaqAMbnBKwsuv+WE2XiOAbSClP59q6VtbnmPDLF2Cjv/2bPxEAnbwENoh3fvdXysGgQQHkHZy25Ia/ytvQ4pkGQm7w1S1/XFgweF8DFtxOqEgKRI5AwoGHDfzVB2ayRWDFoV0f4HU+X8znh+MCbb6sEzZAFwFsgnr3bEL2dtDNuP5lQ6FZLsopkhRysVSLqed5092nRzZTS919JA9yTVlaZXR0KaQrD29kR6mbSA71SJ9lTq1/LMRNod+O49HI9x/lfOK67uT9oJsn+eSjjQpgxZnFHFaVEO2j/T4qU9ofdDNT0Y5MlkUwgb9yUqWHId3hSUqvO/VAvW4xQowTywRNrgYehmj+SUrukxwPBoPhoABSXGxMqgTUO8XcqVNA7fSARUopNwQLKqBIyZNztwb8lX4tpRRYh6VwUsMF4NWABFgPFw7P3ia5DWRrteWQMNys1h86fbeAlDs9LnKGAgPQDED5dHDz4a41eNwEQL9Qn4c7gA0CPWgOgKloezcHDPhgW9LsxgCzmcnuAXBrCOMugON5uANo4WmI76uhy1AC7wBQBEjJm6+DjQuX4UI0Xum4EuM6MPkRKMVYBcVu1WfLP5eZGqCvOX0DrfVtpAUlUtErWSVk32c6pfjVpZhkpBqkjQ9yMUWdmO5KXZJjLZk4Ql7c4N//BOQjaRwCI3QY7T9H9Dorev3jl9t/yTOI1qw6uCMAAAAASUVORK5CYII=';
        const img = `<img style="height: 24px; vertical-align: bottom;" src="${src}">`;
        const title = document.getElementsByClassName('gr-h1')[0].innerText.replace(/\s+/g, ' ').replace(/<.*>/, '').trim();
        const author = document.getElementsByClassName('authorName')[0].querySelectorAll('[itemprop="name"]')[0].innerText.trim();
        const text = `${author} ${title}`;

        return `<a href="http://www.nullrefer.com/?http://audiobookbay.nl/?s=${encodeURIComponent(text)}">${img}</a>`;
    }

    bookTitle.innerHTML += abbLink();
})();