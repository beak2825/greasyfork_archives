// ==UserScript==
// @name        myautonamouse
// @namespace   Violentmonkey Scripts
// @description Scan your kindle or audible library and check if any are missing from myanonamouse database
// @match       https://read.amazon.com/*
// @match       https://www.audible.com/*
// @version     0.0.7
// @author      andromda
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license     MIT
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/511721/myautonamouse.user.js
// @updateURL https://update.greasyfork.org/scripts/511721/myautonamouse.meta.js
// ==/UserScript==

(function (VM) {
'use strict';

class Book {
  constructor(parentElement) {
    this.parent = parentElement;
  }
  static getBooks(type) {
    const books = document.querySelectorAll(type.mainSelector);
    books.forEach(book => {
      Book.library.add(new type(book));
    });
    return Book.library;
  }
  getTitle(type) {
    console.log(this.parent);
    console.log(this.parent.querySelector(type.titleSelector).textContent.trim());
    return this.parent.querySelector(type.titleSelector).textContent.trim();
  }
  getAuthors(type) {
    const titles = new RegExp('\\b(Mr|Mrs|Ms|Miss|Dr|PhD|Professor|Prof)\\.?\\s?\\b', 'g');
    return this.parent.querySelector(type.authorSelector).textContent.trim().replace(titles, '');
  }
  search(count = 0) {
    GM_xmlhttpRequest({
      method: 'POST',
      url: 'https://www.myanonamouse.net/tor/js/loadSearchJSONbasic.php',
      headers: {
        'Content-Type': 'application/json'
      },
      data: this.stringify(),
      onloadend: response => {
        // not authenticated
        if (response.status != 200) return this.insertFailure();
        response = JSON.parse(response.response);

        // no results returned
        if (response.error) return this.withoutSubtitle(count);
        // results returned, no subtitle changes
        else if (response.data && count === 0) return this.insertFound();
        // results returned, subtitle was removed
        else if (response.data) return this.insertPossibleFound(response.data);
      }
    });
  }
  matchPercentage(text1, text2) {
    const words1 = text1.split(/\s+/).sort();
    const words2 = text2.split(/\s+/).sort();
    let matchCount = 0;

    // Count matching words ignoring order
    let i = 0,
      j = 0;
    while (i < words1.length && j < words2.length) {
      if (words1[i] === words2[j]) {
        matchCount++;
        i++;
        j++;
      } else if (words1[i] < words2[j]) {
        i++;
      } else {
        j++;
      }
    }
    const longestLength = Math.max(words1.length, words2.length);
    const percentage = matchCount / longestLength * 100;
    return percentage.toFixed(2).toString() + '%';
  }
  createDivElement(...styles) {
    const div = document.createElement('div');
    styles.forEach(style => {
      div.classList.add(style);
    });
    return div;
  }
  createParagraphElement(prefix, color, ...styles) {
    const p = document.createElement('p');
    p.textContent = prefix;
    p.style.color = color;
    styles.forEach(style => {
      p.classList.add(style);
    });
    return p;
  }
  createListElement(...styles) {
    const li = document.createElement('li');
    styles.forEach(style => {
      li.classList.add(style);
    });
    return li;
  }
  createSpanElement(text, textColor, ...styles) {
    const span = document.createElement('span');
    styles.forEach(style => {
      span.classList.add(style);
    });
    span.style.color = textColor;
    span.textContent = text;
    return span;
  }
  createAnchorElement(text, href, textColor, ...styles) {
    const anchor = document.createElement('a');
    styles.forEach(style => {
      anchor.classList.add(style);
    });
    anchor.style.color = textColor;
    anchor.href = href;
    anchor.textContent = text;
    anchor.target = '_blank';
    return anchor;
  }
  getAuthorString() {
    return this.authors;
  }
  getTitleString() {
    // remove all non-alphanumeric text
    const withSpace = new RegExp('(?<=\\S)[;:,.\\-—](?=\\S)', 'g');
    const withoutSpace = new RegExp('[;:,.\\-—]', 'g');
    const specialCharacters = new RegExp('[^a-zA-Z0-9\\s]', 'g');
    return this.title.replace(withSpace, ' ').replace(withoutSpace, '').replace(specialCharacters, '');
  }
  removeSubtitle(delimiter) {
    this.origTitle = this.title;
    return this.title.split(delimiter)[0].trim();
  }
  hasSubtitle(text) {
    // Define the possible delimiters that separate the title from the subtitle
    const delimiters = [':', '-', '|'];

    // Iterate through the delimiters and check if the title contains any of them
    for (const delimiter of delimiters) {
      if (text.includes(delimiter)) {
        return delimiter;
      }
    }
    return false;
  }
  withoutSubtitle(count) {
    const delimiter = this.hasSubtitle(this.title);

    // does not have subtitle
    if (!delimiter) return this.insertNotFound();else this.title = this.removeSubtitle(delimiter);
    this.searchLink = this.createSearchLink();

    // it does, try search again
    this.search(++count);
  }
  createSearchLink() {
    const query = new URLSearchParams([['tor[text]', this.toString()], ['tor[srchIn][author]', 'true'], ['tor[srchIn][description]', 'true'], ['tor[srchIn][filenames]', 'true'], ['tor[srchIn][narrator]', 'true'], ['tor[srchIn][series]', 'true'], ['tor[srchIn][tags]', 'true'], ['tor[srchIn][title]', 'true'], ['tor[searchIn]', 'torrents'], ['tor[searchType]', 'active'], ['tor[main_cat]', this.isAudiobook ? '13' : '14']]);
    return new URL(`https://www.myanonamouse.net/tor/browse.php?${query}`).toString();
  }
  toString() {
    return `${this.getAuthorString()} ${this.getTitleString()}`;
  }
  stringify() {
    return JSON.stringify({
      tor: {
        text: this.toString(),
        srchIn: {
          author: 'true',
          description: 'true',
          filenames: 'true',
          narrator: 'true',
          series: 'true',
          tags: 'true',
          title: 'true'
        },
        searchType: 'active',
        searchIn: 'torrents',
        main_cat: this.isAudiobook ? ['13'] : ['14'],
        browseFlagsHideVsShow: '0',
        startDate: '',
        endDate: '',
        hash: '',
        sortType: 'default',
        startNumber: '0'
      }
    });
  }
}
Book.loginURL = 'https://www.myanonamouse.net/login.php';
Book.library = new Set();

class Audible extends Book {
  constructor(bookElement) {
    super(bookElement);
    this.isAudiobook = true;
    this.title = this.getTitle(Audible);
    this.authors = this.getAuthors(Audible);
    this.searchLink = this.createSearchLink();
    this.search();
  }
  insertPossibleFound(data) {
    const li = this.createListElement('bc-list-item', 'bc-list-item');
    const span = this.createSpanElement('MAM Status: ', 'orange', 'bc-test', 'authorLabel', 'bc-color-secondary');
    const anchor = this.createAnchorElement(`Possible Match Found (${this.matchPercentage(this.origTitle, data[0].title)})`, this.searchLink, 'orange', 'bc-link', 'bc-color-base');

    // create element
    li.appendChild(span.appendChild(anchor).parentElement);

    // insert into ul
    return this.parent.children[2].insertAdjacentElement('afterend', li);
  }
  insertFailure() {
    const li = this.createListElement();
    const span = this.createSpanElement('MAM ERROR: ', 'red');
    const anchor = this.createAnchorElement('Are you logged in?', Book.loginURL, 'red');

    // create element
    li.appendChild(span.appendChild(anchor).parentElement);

    // insert into ul
    return this.parent.children[2].insertAdjacentElement('afterend', li);
  }
  insertNotFound() {
    const li = this.createListElement();
    const span = this.createSpanElement('MAM Status: ', 'red');
    const anchor = this.createAnchorElement('Not Found!', this.searchLink, 'red');

    // create element
    li.appendChild(span.appendChild(anchor).parentElement);

    // insert into ul
    return this.parent.children[2].insertAdjacentElement('afterend', li);
  }
  insertFound() {
    const li = this.createListElement();
    const span = this.createSpanElement('MAM Status: ', 'green');
    const anchor = this.createAnchorElement('Found!', this.searchLink, 'green');

    // create element
    li.appendChild(span.appendChild(anchor).parentElement);

    // insert into ul
    return this.parent.children[2].insertAdjacentElement('afterend', li);
  }
}
Audible.mainSelector = '.adbl-library-content-row ul.bc-list.bc-list-nostyle';
Audible.titleSelector = 'li a span.bc-text';
Audible.authorSelector = 'li span.authorLabel a';

class Kindle extends Book {
  constructor(bookElement) {
    super(bookElement);
    this.isAudiobook = false;
    this.title = this.getTitle(Kindle);
    this.authors = this.getAuthors(Kindle);
    this.searchLink = this.createSearchLink();
    this.search();
  }
  insertPossibleFound() {
    return this.parent.appendChild(this.createInsertElement('MAM Status: ', 'Possible Matches Found', this.searchLink, 'orange'));
  }
  insertFailure() {
    return this.parent.appendChild(this.createInsertElement('MAM ERROR: ', 'Are you logged in?', Book.loginURL, 'red'));
  }
  insertNotFound() {
    return this.parent.appendChild(this.createInsertElement('MAM Status: ', 'Not Found!', this.searchLink, 'red'));
  }
  insertFound() {
    return this.parent.appendChild(this.createInsertElement('MAM Status: ', 'Found!', this.searchLink, 'green'));
  }
  createInsertElement(prefix, inner, href, color) {
    const div = this.createDivElement();
    const p = this.createParagraphElement(prefix, color);
    const anchor = this.createAnchorElement(inner, href, color);
    div.classList.add(Kindle.divStyle);
    p.classList.add(Kindle.pStyle);
    // anchor.classList.add(Kindle.anchorStyle);

    // create element
    div.appendChild(p.appendChild(anchor).parentElement);

    // insert into ul
    return this.parent.appendChild(div);
  }
}
Kindle.mainSelector = '[id^="tooltip-parent"]';
Kindle.titleSelector = 'div[id^="title-"]';
Kindle.authorSelector = 'div[id^="author-"] p';
Kindle.divStyle = 'author-B008QLXSG8';
Kindle.pStyle = '_33h88ogkqT8qrfT1uutvBI';
Kindle.anchorStyle = '';

VM.observe(document.body, () => {
  const loc = window.location.href.toLowerCase();
  if (loc.includes('audible')) Book.getBooks(Audible);else if (loc.includes('read.amazon.com')) Book.getBooks(Kindle);
  return true;
});

})(VM);
