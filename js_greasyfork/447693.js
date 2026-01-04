// ==UserScript==
// @name        Add Books from Amazon to Goodreads
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.co.jp/*
// @match       https://smile.amazon.com/*
// @license     MIT
// @grant       none
// @version     1.2
// @author      -
// @description 3/29/2022, 12:00:00 AM
// @downloadURL https://update.greasyfork.org/scripts/447693/Add%20Books%20from%20Amazon%20to%20Goodreads.user.js
// @updateURL https://update.greasyfork.org/scripts/447693/Add%20Books%20from%20Amazon%20to%20Goodreads.meta.js
// ==/UserScript==
 
function createLink() {
  let title = document.getElementById('productTitle').innerText.trim();
  let contributors = document.querySelectorAll('span[class="contribution"]');
 
  var author = null;
  var illustrator = null;
  var publisher = null;
  var date = null;
  var language = null;
  var language_code = null;
  var format = null;
  var pages = null;
  var isbn10 = null;
  var isbn13 = null;
 
  for (let contributor of contributors) {
    if (contributor.innerText.includes('著')) {
      if (contributor.parentNode.querySelector('a[class="a-link-normal contributorNameID"]')) {
        author = contributor.parentNode.querySelector('a[class="a-link-normal contributorNameID"]').text.trim();
      } else {
        author = contributor.parentNode.querySelector('a[class="a-link-normal"]').text.trim();  
      }
    }
    if (contributor.innerText.includes('イラスト')) {
      illustrator = contributor.parentNode.querySelector('a').text.trim();
    }
  }
 
  let bookDetails = document.querySelectorAll('div[id="detailBullets_feature_div"] > ul > li > span');
  for (let detail of bookDetails) {
    let field = detail.querySelector('span').innerText;
    let data = detail.querySelectorAll('span')[1].innerText;
    if (field.includes('Publisher')) {
      let publisherAndDate = data; 
      publisher = data.split(' ')[0];
    }
    if (field.includes('Publication date')) {
      date = new Date(data);
    }
    if (field.includes('Language')) {
      language = data;
    }
    if (field.includes('Paperback Bunko')) {
      format = 'Paperback';
      pages = data.split(' ')[0];
    }
    if (field.includes('Comic')) {
      format = 'Comic';
      pages = data.split(' ')[0];
    }
    if (field.includes('Tankobon Softcover')) {
        format = 'Paperback';
        pages = data.split(' ')[0];
    }
    if (field.includes('ISBN-10')) {
      isbn10 = data;
    }
    if (field.includes('ISBN-13')) {
      isbn13 = data;
    }
  }
 
  var description = null;
  if (document.querySelector('div[id="editorialReviews_feature_div"] > div > div > span')) {
    description = document.querySelector('div[id="editorialReviews_feature_div"] > div > div > span').innerText.trim();
  } else if (document.querySelector('div[id="bookDescription_feature_div"] > div > div > span')) {
    description = document.querySelector('div[id="bookDescription_feature_div"] > div > div > span').textContent.trim();
  } else {
    description = '';
  }
 
  var publication_year = date.getUTCFullYear();
  var publication_month = date.getUTCMonth() + 1;
  var publication_day = date.getUTCDate();
 
  const encodeGetParams = p => 
    Object.entries(p).map(kv => kv.map(encodeURIComponent).join("=")).join("&");
  
  if (language == "Japanese") {
    language_code = "jpn";
  } else if (language == "English") {
    language_code = "eng";
  }
 
  var params = {
    'book[title]': title,
    'book[sort_by_title]': title,
    'author[name]': author, 
//    'book[author_role]'
//    'book_authors[book_author1][name]'
//    'book_authors[book_author1][role]'
    'book[isbn]': isbn10,
    'book[isbn13]': isbn13,
    'book[publisher]': publisher,
    'book[publication_year]': publication_year,
    'book[publication_month]': publication_month,
    'book[publication_day]': publication_day,
    'book[num_pages]': pages,
    'book[format]': format,
    'book[description_defaulted]': description,
    'book[language_code]': language_code,
    'work[original_title]': title,
    'work[original_publication_year]': publication_year,
    'work[original_publication_month]': publication_month,
    'work[original_publication_day]': publication_day,
  };
  
  if (illustrator) {
    params['book_authors[book_author1][name]'] = illustrator;
    params['book_authors[book_author1][role]'] = 'Illustrator';
  }
 
  let fillLink = document.createElement('a');
 
  fillLink.href = `https://www.goodreads.com/book/new?${encodeGetParams(params)}`;
  fillLink.target = "_blank";
  fillLink.text = "Pre-fill on Goodreads";
  let span = document.querySelector('span[id="productSubtitle"]');
  span.appendChild(fillLink);
}
 
window.addEventListener('load', createLink);