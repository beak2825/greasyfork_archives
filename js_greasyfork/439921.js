// ==UserScript==
// @name        Amazon Wishlist Format
// @namespace   
// @description Format wishlist to table
// @include     http*://*.amazon.*/hz/wishlist/ls/*
// @version     0.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/439921/Amazon%20Wishlist%20Format.user.js
// @updateURL https://update.greasyfork.org/scripts/439921/Amazon%20Wishlist%20Format.meta.js
// ==/UserScript==


// Replicate an Amazon button
var button = document.createElement('span');
button.className = 'a-button a-button-primary';
button.setAttribute('style', 'cursor: pointer; float: right; margin-top: 1em;');
button.innerHTML =
  '<span class="a-button-inner"><span class="a-button-text">Format page as table</span></span>';
var head = document.getElementById('wl-list-info');
head.insertBefore(button, head.firstChild);

// On clicking the button, format the page and create a table with the data
button.addEventListener('click', function () {
  // Capture wishlist items
  let c = document.querySelectorAll('.g-item-sortable');
  let books = [];
  for (let i = 0; i < c.length; i++) {
    let book = {};
    let id = c[i].getAttribute('data-itemid');
    book['n'] = i;
    book['id'] = id;
    try {
      book['title'] = c[i].querySelector('#itemName_' + id).title;
    } catch (err) {
      book['title'] = '';
    }

    try {
      book['link'] = c[i].querySelector('#itemName_' + id).href;
    } catch (err) {
      book['link'] = '';
    }

    try {
      book['author'] = c[i].querySelector('#item-byline-' + id).innerText;
    } catch (err) {
      book['author'] = '';
    }
    try {
      book['image'] = c[i].querySelector('#itemImage_' + id + ' img').src;
    } catch (err) {
      book['image'] = '';
    }

    try {
      book['price'] = c[i].querySelector('.itemUsedAndNewPrice').innerText;
    } catch (err) {
      book['price'] = '';
    }

    try {
      book['itemAddedDate'] = c[i]
        .querySelector('#itemAddedDate_' + id)
        .innerHTML.match(/\<\/span\>(.+)/)[1];
    } catch (err) {
      book['itemAddedDate'] = '';
    }

    try {
      book['asin'] = JSON.parse(
        c[i].getAttribute('data-reposition-action-params')
      ).itemExternalId.match(/ASIN:(.+?)\|/)[1];
    } catch (err) {
      book['asin'] = '';
    }
    books.push(book);
  }

  // Clear site
  document.body.innerText = '';

  // Build table w/ wishilist items
  function maketd(val) {
    var td = document.createElement('td');
    td.innerHTML = val.trim();
    return td;
  }

  var table = document.createElement('table');
  table.style.margin = '10px';

  var head = document.createElement('tr');
  table.appendChild(head);

  var head_dateAdded = document.createElement('th');
  head_dateAdded.innerText = 'Date Added';
  head.appendChild(head_dateAdded);

  var head_image = document.createElement('th');
  head_image.innerText = 'Image';
  head.appendChild(head_image);

  var head_title = document.createElement('th');
  head_title.innerText = 'Title';
  head.appendChild(head_title);

  var head_author = document.createElement('th');
  head_author.innerText = 'Author';
  head.appendChild(head_author);

  var head_asin = document.createElement('th');
  head_asin.innerText = 'ASIN/ISBN';
  head.appendChild(head_asin);

  var head_price = document.createElement('th');
  head_price.innerText = 'Price';
  head.appendChild(head_price);

  var head_link = document.createElement('th');
  head_link.innerText = 'Link';
  head.appendChild(head_link);

  for (var i = 0; i < books.length; i++) {
    var tr = document.createElement('tr');
    tr.appendChild(maketd(books[i].itemAddedDate));
    tr.appendChild(maketd(`<img src=${books[i].image}>`));
    tr.appendChild(maketd(books[i].title));
    tr.appendChild(
      maketd(books[i].author.replace('by ', '').replace(/\(.+?\)/, ''))
    );
    tr.appendChild(maketd(books[i].asin));
    tr.appendChild(maketd(books[i].price));
    tr.appendChild(maketd(`<a href='${books[i].link}'>Product Link</a>`));
    table.appendChild(tr);
  }

  document.body.appendChild(table);
});


