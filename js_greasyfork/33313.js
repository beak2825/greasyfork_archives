// ==UserScript==
// @name               Google Cleaner
// @description        Hide (toggle) top bar (All, Videos, News...) and adds quick filtering to the left sidebar.
// @version            3.10
// @include            http://www.google.*/search*
// @include            http://www.google.*/webhp*
// @include            http://www.google.*/images*
// @include            http://www.google.*/imghp*
// @include            https://www.google.*/search*
// @include            https://www.google.*/webhp*
// @include            https://encrypted.google.com/search*
// @namespace https://greasyfork.org/users/153157

// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/33313/Google%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/33313/Google%20Cleaner.meta.js
// ==/UserScript==

var head = document.getElementsByTagName('head')[0];

function init() {
  toggleNavBar();
  toggleFiltersBar();
  addLinks();
  cleanGoogle();
}

var isBarVisible = false;
var hideNavBarStyle = dom("<style type='text/css'>#top_nav, #appbar {display:none;}</style>");
function toggleNavBar() {
  if (isBarVisible) {
    head.removeChild(hideNavBarStyle);
  } else {
    head.appendChild(hideNavBarStyle);
  }

  isBarVisible = !isBarVisible;
}

var isFiltersBarVisible = false;
var hideFiltersBarStyle = dom("<style type='text/css'>#filtersBar {display:none;}</style>");
function toggleFiltersBar() {
  if (isFiltersBarVisible) {
    head.removeChild(hideFiltersBarStyle);
  } else {
    head.appendChild(hideFiltersBarStyle);
  }

  isFiltersBarVisible = !isFiltersBarVisible;
}

function addLinks() {
  var parent = document.getElementById('rcnt');

  createLink("<div id='bartoggle' style='font-size: 11px; top: 25px; left: 23px; position: absolute'>Toggle topbar</div>", toggleNavBar, parent);

  createLink("<div style='font-size: 11px; top: 49px; left: 33px; position: absolute'>Past year</div>", showPastYearPosts, parent);
  createLink("<div style='font-size: 11px; top: 70px; left: 53px; position: absolute'>+</div>", toggleFiltersBar, parent);

  var filtersBar = createLink("<div id='filtersBar' style='font-size: 11px; top: 89px; left: 34px; position: absolute; line-height: 18px'></div>", null, parent);

  createLink("<div style=''>Past year</div>", showPastYearPosts, filtersBar);
  createLink("<div style=''>Any time</div>", showAnyTimePosts, filtersBar);
  createLink("<div style=''>Past hour</div>", showPastHourPosts, filtersBar);
  createLink("<div style=''>Past 24 hours</div>", showPast24HoursPosts, filtersBar);
  createLink("<div style=''>Past week</div>", showPastWeekPosts, filtersBar);
  createLink("<div style=''>Past month</div>", showPastMonthPosts, filtersBar);
  createLink("<div style=''>Custom range</div>", showCustomRangePosts, filtersBar);
}

function showPastYearPosts() { doLink("qdr:y"); }
function showAnyTimePosts() { doLink("qdr:"); }
function showPastHourPosts() { doLink("qdr:h"); }
function showPast24HoursPosts() { doLink("qdr:d"); }
function showPastWeekPosts() { doLink("qdr:w"); }
function showPastMonthPosts() { doLink("qdr:m"); }
function showCustomRangePosts() { document.querySelectorAll('[jsname="oYxtQd"]')[2].click(); }


function doLink(tbsParam) {
  const params = new URLSearchParams(window.location.search);
  params.set('tbs', tbsParam);
  document.location.href=`?${params.toString()}`;
}

function createLink(nodeString, onclick, parent) {
  if (!parent) return null;
  var link = dom(nodeString);
  link.addEventListener("click", onclick, false);
  parent.appendChild(link);
  return link;
}

function dom(nodeString) {
  var div = document.createElement('div');
  div.innerHTML = nodeString;
  return div.firstChild;
}

function cleanGoogle() {
  GM_addStyle_from_string(`
    .ULSxyf, /* Videos and People also Ask sessions */
    .zSS54d {
       display: none;
    }

    #sfcnt {
      margin-bottom: -15px;
    }

    .r {
      height: 26px;
    }

    .LC20lb {
      position: relative;
      top: -49px;
    }

    .g {
       margin-top: 46px;
    }

    .xA33Gc {
      display: none;
    }

    .TbwUpd {
      margin-left: 1px;
    }

    .iUh30, .CvmQuf, .eipWBe {
      color: green
    } 
  `);
}

function GM_addStyle_from_string(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}


init();