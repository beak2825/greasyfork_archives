// ==UserScript==
// @name         Add Check Mark next to Authors
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Helps you mark certain authors in list.
// @author       grin3671
// @match        https://shikimori.one/*
// @match        https://shikimori.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402706/Add%20Check%20Mark%20next%20to%20Authors.user.js
// @updateURL https://update.greasyfork.org/scripts/402706/Add%20Check%20Mark%20next%20to%20Authors.meta.js
// ==/UserScript==

'use strict';


function grabAllAuthors () {
  let matches = document.querySelectorAll('.p-authors .b-log_entry');
  let stored = getFromStorage();
  matches.forEach(function(elem) {
    let author = elem.querySelector('a').textContent;
    elem.dataset.authorName = author;
    if (stored.indexOf(author) >= 0) addCheckMark(elem, true);
    addMarkAction(elem);
  });
}


function addMarkAction (elem) {
  elem.addEventListener('click', {
    handleEvent(event) {
      if (event.target.tagName.toUpperCase() === 'A') return false;
      elem.classList.contains('marked') ? removeCheckMark(elem) : addCheckMark(elem);
    }
  });
}


function newMark () {
  let markEl = document.createElement('span');
  markEl.classList.add('js_mark');
  markEl.style.marginLeft = '8px';

  let mark = document.createTextNode('✔');
  markEl.appendChild(mark);

  return markEl;
}


function addCheckMark (elem, safe) {
  elem.appendChild(newMark());
  if (!safe) addToStorage(elem.dataset.authorName);
  elem.classList.add('marked');
}

function removeCheckMark (elem) {
  elem.querySelector('.js_mark').remove();
  removeFromStorage(elem.dataset.authorName);
  elem.classList.remove('marked');
}


function getFromStorage () {
  let authors = localStorage.getItem('storedAuthors');
  authors = authors ? JSON.parse(authors) : [];
  return authors;
}

function addToStorage (author) {
  let authors = getFromStorage();
  authors.push(author);
  localStorage.setItem('storedAuthors', JSON.stringify(authors));
}

function removeFromStorage (author) {
  let authors = getFromStorage();
  authors.splice(authors.indexOf(author), 1);
  localStorage.setItem('storedAuthors', JSON.stringify(authors));
}


function ready (f) {
  document.addEventListener('page:load', f);
  document.addEventListener('turbolinks:load', f);

  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
    f();
  } else {
    document.addEventListener('DOMContentLoaded', f);
  }
}


ready(grabAllAuthors);