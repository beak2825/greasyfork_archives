// ==UserScript==
// @name         Miniflux add more previous and next links
// @namespace    https://reader.miniflux.app/
// @version      23
// @description  Adds another Next button to Miniflux UI that doesn't jump all over the place
// @author       Tehhund
// @match        *://*.miniflux.app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=miniflux.app
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/465074/Miniflux%20add%20more%20previous%20and%20next%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/465074/Miniflux%20add%20more%20previous%20and%20next%20links.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

const addAfter = (node, paginationDiv) => {
  const newNode = paginationDiv.cloneNode(true);
  newNode.style.fontSize = '75%';
  node.after(newNode);
  return newNode;
};

const addLinksByCopyingDivs = () => {
  const paginationDiv = document.querySelector('.pagination');
  /*document.querySelector('.header').after(paginationDiv.cloneNode(true));
  document.querySelector('#page-header-title').after(paginationDiv.cloneNode(true));
  document.querySelector('.entry-actions').after(paginationDiv.cloneNode(true));
  document.querySelector('.entry-header').after(paginationDiv.cloneNode(true));*/
  addAfter(document.querySelector('.header'), paginationDiv);
  addAfter(document.querySelector('#page-header-title'), paginationDiv);
  addAfter(document.querySelector('.entry-header'), paginationDiv);
  document.body.appendChild(paginationDiv.cloneNode(true));
  /*for (let i = 0; i < 4; i++) {
    newPaginationDivs[i] = paginationDiv.cloneNode(true);
    newPaginationDivs[i].querySelector('.elevator').remove();
    paginationDiv.parentElement.appendChild(newPaginationDivs[i]);
    newPaginationDivs[i].style.position = 'relative';
    newPaginationDivs[i].style.top = ((i - 2) * 10) + 'rem';
  }*/
};

addLinksByCopyingDivs();

const addLinksDirectly = () => {
  const nextLink = document.querySelector('[rel="next"]');
  if (nextLink) {
    const newNextLink = nextLink.cloneNode(true);
    newNextLink.style.position = 'fixed';
    newNextLink.style.right = '0';
    newNextLink.style.border = '1px solid #000000';
    const fixedNewNextLinks = [];
    for (let i = 0; i < 3; i++) {
      fixedNewNextLinks[i] = newNextLink.cloneNode(true);
      fixedNewNextLinks[i].style.top = ((i + 1) * 11) + 'rem';
    }
    for (let elem of fixedNewNextLinks) {
      document.body.appendChild(elem);
    }
    const relativeNewNextLinks = [];
    for (let i = 0; i < 3; i++) {
      relativeNewNextLinks[i] = newNextLink.cloneNode(true);
      relativeNewNextLinks[i].style.position = 'relative';
      relativeNewNextLinks[i].style.top = ((i + 1) * 11) - 23 + 'rem';
      relativeNewNextLinks[i].style.left = `${7 - i * 2.2}rem`;
    }
    for (let elem of relativeNewNextLinks) {
      document.querySelector('.pagination-next').insertBefore(elem, nextLink);
    }
  }

  const prevLink = document.querySelector('[rel="prev"]');
  if (prevLink) {
    const newPrevLink = prevLink.cloneNode(true);
    newPrevLink.style.position = 'fixed';
    newPrevLink.style.left = '0';
    newPrevLink.style.border = '1px solid #000000';
    const newPrevLinks = [];
    for (let i = 0; i < 3; i++) {
      newPrevLinks[i] = newPrevLink.cloneNode(true);
      newPrevLinks[i].style.top = ((i + 1) * 11) + 'rem';
    }
    for (let elem of newPrevLinks) {
      document.body.appendChild(elem);
    }
    const relativeNewPrevLinks = [];
    for (let i = 0; i < 3; i++) {
      relativeNewPrevLinks[i] = newPrevLink.cloneNode(true);
      relativeNewPrevLinks[i].style.position = 'relative';
      relativeNewPrevLinks[i].style.top = ((i + 1) * 11) - 23 + 'rem';
      relativeNewPrevLinks[i].style.left = `${-5 - (i * 4.1)}rem`;
    }
    for (let elem of relativeNewPrevLinks) {
      document.querySelector('.pagination-prev').appendChild(elem);
    }
  }
};

//addLinksDirectly();