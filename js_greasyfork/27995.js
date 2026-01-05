// ==UserScript==
// @name        Poe Trade Search From Everywhere
// @namespace   https://greasyfork.org/ru/scripts/27995-poe-trade-search-from-everywhere
// @description If you tired of scrolling
// @include     http://poe.trade/*
// @version     1.8
// @grant       none
// @compatible  chrome
// @compatible  firefox
// @downloadURL https://update.greasyfork.org/scripts/27995/Poe%20Trade%20Search%20From%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/27995/Poe%20Trade%20Search%20From%20Everywhere.meta.js
// ==/UserScript==

var buttons = document.getElementsByClassName('search button');
var scrollToTopButton;
var scrollToResultsButtton;
var us_searchButton = document.createElement('button');
document.body.appendChild(us_searchButton);

function ADD_VERY_HACKERS_SCROLL_BUTTON() {
  scrollToTopButton = document.createElement('button');
  scrollToTopButton.innerHTML = 'Go Top!';
  document.body.appendChild(scrollToTopButton);
  setButtonStyle(scrollToTopButton);
  scrollToTopButton.style.top = 130 + 'px';
  scrollToTopButton.onclick = function() {
    $(document).scrollTop(0);
  }
  
  scrollToResultsButtton = document.createElement('button');
  scrollToResultsButtton.innerHTML = 'Go to Results!';
  document.body.appendChild(scrollToResultsButtton);
  setButtonStyle(scrollToResultsButtton);
  scrollToResultsButtton.style.top = 190 + 'px';
  scrollToResultsButtton.onclick = function() {
    $(document).scrollTop(1500);
  }
}

function setButtonStyle(element) {
  element.style.class = 'search button';
  element.style.width = 120 + 'px';
  element.style.position = 'fixed';
  element.style.right = 50 + 'px';
}

//Define search button...
us_searchButton.class = 'search button';
us_searchButton.innerHTML = 'Search!';
us_searchButton.style.position = 'fixed';
us_searchButton.style.right = 50 + 'px';
us_searchButton.style.top = 50 + 'px';
us_searchButton.style.width = 120 + 'px';
us_searchButton.onclick = function() {
  document.getElementById('search').submit();
}

//Adding scroll buttons...
ADD_VERY_HACKERS_SCROLL_BUTTON()

//Show search form...
//toggle_search_form();

setInterval(function() {
  if (document.getElementById('search-form').style.display === 'none') {
    scrollToResultsButtton.onclick = function() {
      $(document).scrollTop(228);
    }
  } else {
    scrollToResultsButtton.onclick = function() {
      $(document).scrollTop(1500);
    }
  }
}, 200);