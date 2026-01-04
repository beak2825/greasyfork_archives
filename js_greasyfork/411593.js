// ==UserScript==
// @name        Yet Another EpicMafia Script
// @match       https://epicmafia.com/topic/*
// @grant       none
// @version     0.10
// @author      expiredtofu
// @description Attempting to make EM page navigation a bit more user-friendly
// @run-at      document-idle
// @namespace Violentmonkey Scripts
// @downloadURL https://update.greasyfork.org/scripts/411593/Yet%20Another%20EpicMafia%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/411593/Yet%20Another%20EpicMafia%20Script.meta.js
// ==/UserScript==
var lastPage = '1';

function GM_addStyle(cssStr) {
  var n = document.createElement('style');
  n.type = "text/css";
  n.innerHTML = cssStr;
  document.getElementsByTagName('head')[0].appendChild(n);
}

function getLastPage(nav) {
  var liList = nav.getElementsByTagName('li')
  var lastNav = liList[liList.length - 1];
  if (lastNav.classList.contains('selected')) {
    lastPage = lastNav.innerText;
  } else {
    lastPage = lastNav.firstChild.id.slice(4);
  }
}

function replaceUrlPage(currUrl, pageNum) {
  var newUrl = '';
  if (currUrl.search('\\?') == -1) {
    newUrl = currUrl + "?page=" + pageNum;
  } else {
    if (currUrl.search('page=') != -1) {
      newUrl = currUrl.replace(/(page=)([^&]+)+/, '$1' + pageNum);
    } else {
      newUrl = currUrl + "&page=" + pageNum;
    }
  }
  if (currUrl.search('&_pjax=') == -1) {
    newUrl += '&_pjax=%23posts';
  }
  return newUrl;
}

function populateNewNav(nav, currPage) {
  var currUrl = window.location.pathname + window.location.search + window.location.hash;
  var newNavHTML = '<p>Page ' +
    '<input type="number" class="customPageSelect" ' +
    'name="page" min="1" max="' + lastPage + '" value = "' + currPage + '">' +
    ' of ' + lastPage + '</p>';
  newNavHTMLOuter = '<ul>';
  if (parseInt(currPage) > 1) {
    newNavHTMLOuter += '<li><a data-pjax="#posts" href="' + replaceUrlPage(currUrl, '1') + '" id="val_1">⇤</a></li>'
  }
  if (parseInt(currPage) > 2) {
    newNavHTMLOuter += '<li><a data-pjax="#posts" href="' + replaceUrlPage(currUrl, (parseInt(currPage) - 1).toString()) + '" id="val_' + (parseInt(currPage) - 1).toString() + '">⇠</a></li>';
  }
  newNavHTMLOuter += '<li>' + newNavHTML + '</li>';
  if (parseInt(currPage) < parseInt(lastPage) - 1) {
    newNavHTMLOuter += '<li><a data-pjax="#posts" href="' + replaceUrlPage(currUrl, (parseInt(currPage) + 1).toString()) + '" id="val_' + (parseInt(currPage) + 1).toString() + '">⇢</a></li>';
  }
  if (parseInt(currPage) < parseInt(lastPage)) {
    newNavHTMLOuter += '<li><a data-pjax="#posts" href="' + replaceUrlPage(currUrl, lastPage) + '" id="val_' + lastPage + '">⇥</a></li>';
  } else {
    newNavHTMLOuter += '<li><a data-pjax="#posts" href="' + replaceUrlPage(currUrl, lastPage) + '" id="val_' + lastPage + '">🗘</a></li>';
  }
  newNavHTMLOuter += '</ul>';
  newNavHTML = newNavHTMLOuter;
  nav.innerHTML = newNavHTML;
}

function goToPage(page) {
  page = Math.max(Math.min(page, parseInt(lastPage, 10)), 1);
  var currUrl = window.location.pathname + window.location.search + window.location.hash;
  var newUrl = replaceUrlPage(currUrl, page);

  var postsElem = document.getElementById('posts');
  var newHTML = document.createElement('div');
  newHTML.innerHTML = '<a data-pjax="#posts" id="jumpToPage" href="' + newUrl + '" id="val_' + page + '">Jump</a>';

  postsElem.appendChild(newHTML);
  document.getElementById('jumpToPage').click();
  //window.location.replace(url)
};

function populateEvents() {
  // lazily adding event listeners after population
  var elements = document.getElementsByClassName("customPageSelect");
  for (var i = 0; i < elements.length; i++) {
    elements[i].addEventListener("keydown", function(e) {
      if (e.keyCode === 13) {
        goToPage(e.target.value);
      }
    });
  }
}

function setup() {
  var navList = document.getElementsByClassName("pagenav");
  var newNavTopAnchor = document.createElement('div');
  var newNavTop = document.createElement('div');
  var newNavBottom = document.createElement('div');
  var postsElem = document.getElementById('posts');
  var formElem = document.getElementById('create_post');
  newNavTopAnchor.setAttribute("id","newPageNavAnchor");
  newNavTop.setAttribute("class", "newPageNav");
  newNavTop.setAttribute("id", "newPageNavTop");
  newNavBottom.setAttribute("class", "newPageNav");
  posts.parentNode.insertBefore(newNavTopAnchor, postsElem);
  posts.parentNode.insertBefore(newNavTop, postsElem);
  posts.parentNode.insertBefore(newNavBottom, formElem);

  if (navList.length > 0) { // checking if nav exists
    getLastPage(navList[0]);
    var currPage = navList[0].getElementsByClassName("selected")[0].innerText;
    var navPages = document.getElementsByClassName("newPageNav");
    for (var i = 0; i < navPages.length; i++) {
      populateNewNav(navPages[i], currPage);
    }
    populateEvents();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;


    var observer = new MutationObserver(function(mutations, observer) {
      // fired when a mutation occurs
      refreshNav();
      // ...
    });

    // define what element should be observed by the observer
    // and what types of mutations trigger the callback
    observer.observe(postsElem, {
      subtree: true,
      attributes: true
      //...
    });
  }
  GM_addStyle(`
    .pagenav li {
      display: none !important;
    }
    .newPageNav{
      background-color: white;
      z-index: 9999;
    }
    .newPageNav a {
      color: #b11;
      font-size: 2em;
      padding: 0 .1em;
    }
    .newPageNav * {
      display:inline-block;
      vertical-align: middle;
    }
    .newPageNav p {
      margin-top: .5em;
    }
    #jumpToPage {
      display: none !important;
    }
    #posts {
      margin-top: -3em !important;
    }
    #posts_inner {
      padding-top: 3em !important;
    }
`);
}

function refreshNav() {
  var navList = document.getElementsByClassName("pagenav");
  if (navList.length > 0) { // checking if nav exists
    getLastPage(navList[0]);
    var currPage = navList[0].getElementsByClassName("selected")[0].innerText;
    var navPages = document.getElementsByClassName("newPageNav");
    for (var i = 0; i < navPages.length; i++) {
      populateNewNav(navPages[i], currPage);
    }
    populateEvents();
  }
}

setup();

$(function() {
    var a = function() {
        var b = $(window).scrollTop();
        var d = $("#newPageNavAnchor").offset().top;
        var c = $("#newPageNavTop");
        if (b > d) {
            c.css({position:"fixed",top:"0px"})
        } else {
            c.css({position:"inherit",top:""})
        }
    };
    $(window).scroll(a);a()
});
