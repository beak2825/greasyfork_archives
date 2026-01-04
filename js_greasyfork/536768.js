// ==UserScript==
// @name         Bookracy Download (Multi-Site)
// @namespace    http://tampermonkey.net/
// @version      1.98
// @description  Adds a free download modal on various book sites: Amazon, Goodreads, FiveBooks, The Greatest Books, Reddit Reads, and Most Recommended Books.
// @license      MIT
// @author       Dan, Custom, internetninja, fmhy.net, Perplexity, ChatGPT, Gemini
// @match        https://thegreatestbooks.org/*
// @match        https://fivebooks.com/*
// @match        https://www.goodreads.com/*
// @match        https://www.redditreads.com/*
// @match        https://www.mostrecommendedbooks.com/*
// @match        https://www.amazon.com/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536768/Bookracy%20Download%20%28Multi-Site%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536768/Bookracy%20Download%20%28Multi-Site%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const API_BASE = 'https://backend.bookracy.ru/api/books';
  const SELECTORS = {
    greatestBooksItem: '.list-group-item.book-list-item, tr.book-list-item',
    greatestBooksAction: '.d-flex.flex-row.bd-highlight, div[id^="user-book-actions-container"], div[id^="user-lists-actions-container"]',
    fiveBooksItem: 'li.single-book',
    fiveBooksTitle: 'h2.book-title span.title',
    goodreadsSingleTitle: 'h1.Text[data-testid="bookTitle"]',
    goodreadsSingleAuthor: 'span.ContributorLink__name[data-testid="name"]',
    goodreadsSingleContainer: '.BookActions',
    goodreadsListItem: '.bookTitle',
    amazonInsertion: '#desktop_buybox, #buybox, #tmmSwatches, #addToCart_feature_div',
    amazonContainer: '#dpx-detail-container, body',
    amazonTitle: '#productTitle, #ebooksProductTitle',
    amazonAuthor: '.author a, .contributorNameID, #bylineInfo',
    redditReadsTitle: '.book-title',
    mostRecommendedContainer: '.styles_book-category-container__pAtxc',
    mostRecommendedButtonArea: '.styles_book-category-button__0z5MS',
    mostRecommendedTitle: 'h3',
    mostRecommendedAuthor: 'h4'
  };

  // Inject modal and styles
  const modalHTML = `
    <div id="bookracy-modal-overlay" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:9998;">
      <div id="bookracy-modal" style="background:#fff;border-radius:6px;max-width:400px;margin:10% auto;padding:20px;position:relative;">
        <button id="bookracy-modal-close" style="position:absolute;top:8px;right:8px;border:none;background:transparent;font-size:16px;cursor:pointer;">×</button>
        <div id="bookracy-modal-content" style="text-align:center;">
          <img src="https://bookracy.ru/assets/logo-DRqwxaug.svg" alt="Bookracy" style="width:48px;margin-bottom:16px;" />
          <div id="bookracy-modal-body">Searching...</div>
          <div style="margin-top:16px;font-size:12px;color:#666;">Powered by Bookracy</div>
        </div>
      </div>
    </div>`;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  function showModal(html) {
    document.getElementById('bookracy-modal-body').innerHTML = html;
    document.getElementById('bookracy-modal-overlay').style.display = 'block';
  }
  function hideModal() {
    document.getElementById('bookracy-modal-overlay').style.display = 'none';
  }
  document.getElementById('bookracy-modal-close').onclick = hideModal;

  function fetchAndShow(title) {
    const sanitizedTitle = title.replace(/[^\w\s]/gi, '').trim(); // removes punctuation
    const q = encodeURIComponent(sanitizedTitle);
    showModal('Searching...');
    fetch(`${API_BASE}?query=${q}&lang=en&limit=1&force=true`)
      .then(res => res.json())
      .then(data => {
        const book = data.results && data.results[0];
        if (book && book.link) {
          showModal(
            `<h3>${book.title}</h3>` +
            `<p>${book.author}</p>` +
            `<a href="${book.link}" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#28a745;color:#fff;border-radius:4px;text-decoration:none;">Download ${book.book_filetype.toUpperCase()}</a>`
          );
        } else {
          showModal('<p>No results found.</p>');
        }
      })
      .catch(() => showModal('<p>Error fetching data.</p>'));
  }

  function createButton(title, small = false) {
    const btn = document.createElement('button');
    btn.className = 'bookracy-download-button' + (small? ' small':'');
    btn.style = 'display:inline-flex;align-items:center;gap:6px;margin-top:8px;border:none;background:#f5f5f5;padding:4px 8px;border-radius:4px;cursor:pointer;';
    btn.innerHTML = '<img src="https://bookracy.ru/assets/logo-DRqwxaug.svg" alt="B" style="width:16px;height:16px;">' +
                    `<span>Download from Bookracy</span>`;
    btn.onclick = e => { e.preventDefault(); fetchAndShow(title); };
    return btn;
  }

  function getFullTitle(item) {
    const t = item.querySelector('h4 a, tr.book-list-item td:nth-child(2) a, h3, #productTitle, .book-title');
    const a = item.querySelector('h4 a + a, tr.book-list-item td:nth-child(3) a, .ContributorLink__name, .authorName span, .author a');
    const title = t? t.textContent.trim(): '';
    const author = a? a.textContent.trim(): '';
    return author? `${title} by ${author}`: title;
  }

  // Site handlers
  function handle(selectorItems, selectorAction) {
    document.querySelectorAll(selectorItems).forEach(item => {
      const container = item.querySelector(selectorAction);
      if (container && !container.querySelector('.bookracy-download-button')) {
        const full = getFullTitle(item);
        container.appendChild(createButton(full));
      }
    });
  }
  function handleGrid(selectorItems, selectorAction) {
    document.querySelectorAll(selectorItems).forEach(item => {
      const container = item.querySelector(selectorAction);
      if (container) {
        container.innerHTML = '';
        const full = getFullTitle(item);
        container.appendChild(createButton(full));
      }
    });
  }

  function handlerGreatest() {
    handle(SELECTORS.greatestBooksItem, SELECTORS.greatestBooksAction);
  }
  function handlerFive() {
    document.querySelectorAll(SELECTORS.fiveBooksItem).forEach(li => {
      if (!li.querySelector('.bookracy-download-button')) {
        const full = getFullTitle(li);
        const parent = li.querySelector(SELECTORS.fiveBooksTitle)?.closest('a')?.parentNode;
        if (parent) parent.appendChild(createButton(full));
      }
    });
  }
  function handlerGoodreads() {
    const single = document.querySelector(SELECTORS.goodreadsSingleContainer);
    if (single && !single.querySelector('.bookracy-download-button')) {
      const full = getFullTitle(document);
      single.appendChild(createButton(full));
    }
    document.querySelectorAll(SELECTORS.goodreadsListItem).forEach(el => {
      const row = el.closest('tr');
      if (row && !row.querySelector('.bookracy-download-button')) {
        const full = getFullTitle(row);
        const cell = row.querySelector('td:last-child') || row.appendChild(document.createElement('td'));
        cell.appendChild(createButton(full, true));
      }
    });
  }
  function handlerAmazon() {
    const inject = () => {
      const box = document.querySelector(SELECTORS.amazonInsertion);
      if (box && !box.querySelector('.bookracy-download-button')) {
        const full = getFullTitle(document);
        box.appendChild(createButton(full));
      }
    };
    const c = document.querySelector(SELECTORS.amazonContainer);
    if (c) new MutationObserver(inject).observe(c,{childList:true,subtree:true});
    inject();
  }
  function handlerReddit() {
    document.querySelectorAll(SELECTORS.redditReadsTitle).forEach(el => {
      const parent = el.parentNode;
      if (parent && !parent.querySelector('.bookracy-download-button')) {
        parent.appendChild(createButton(el.textContent.trim()));
      }
    });
  }
  function handlerMost() {
    document.querySelectorAll(SELECTORS.mostRecommendedContainer).forEach(cont => {
      const area = cont.querySelector(SELECTORS.mostRecommendedButtonArea);
      if (area) {
        area.innerHTML = '';
        const full = getFullTitle(cont);
        area.appendChild(createButton(full));
      }
    });
  }

  const host = window.location.hostname;
  const map = {
    'thegreatestbooks.org': handlerGreatest,
    'fivebooks.com': handlerFive,
    'www.goodreads.com': handlerGoodreads,
    'www.redditreads.com': handlerReddit,
    'www.mostrecommendedbooks.com': handlerMost,
    'amazon': handlerAmazon
  };
  const fn = Object.keys(map).find(k=>host.includes(k));
  if (fn) {
    const run = () => map[fn]();
    document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
    new MutationObserver(run).observe(document.body,{childList:true,subtree:true});
  }
})();