// ==UserScript==
// @name         AddLinkToNewAtcoder
// @namespace    AddLinkToNewAtcoder
// @version      1.6
// @author       Luzhiled
// @description  ja
// @include      http://*atcoder.jp/*
// @include      https://*atcoder.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34413/AddLinkToNewAtcoder.user.js
// @updateURL https://update.greasyfork.org/scripts/34413/AddLinkToNewAtcoder.meta.js
// ==/UserScript==

(function() {
'use strict';

function ConvertToNewAtcodersURL() {
  let pathName = location.pathname;
  let query = location.search;
  if (pathName.match(/settings/) || pathName.match(/users/)) {
    return 'https://beta.atcoder.jp' + pathName;
  }
  if (location.href.match(/contest.atcoder.jp/)) {
    let contestName = location.href.replace(/^https?:\/\//, '').split('.')[0];
    pathName = pathName.replace(/assignments/g, "tasks");
    pathName = pathName.replace(/\/all/g, "");
    query = query.replace(/user_screen_name/g, "f.User");
    pathName = pathName.replace(/editorial/g, "");
    pathName = pathName.replace(/statistics/g, "");
    return 'https://beta.atcoder.jp/contests/' + contestName + pathName + query;
  } else {
    pathName = pathName.replace(/contest/g, "contests");
    pathName = pathName.replace(/user/g, "users");
    query = query.replace(/categories/g, "category");
    query = query.replace(/p=/g, "page=");
    return 'https://beta.atcoder.jp' + pathName + query;
  }
}

function AddLinkToNewAtcoder() {
  if (location.href.match(/contest.atcoder.jp/)) {
    $('div.nav-collapse')
        .prepend(`
        <ul class="nav">
          <li class="divider-vertical"></li>
          <li><a href="${
            ConvertToNewAtcodersURL()}"><span class="lang lang-selected"><span class="lang-en lang-child hidden-lang">go to beta.atcoder.jp</span><span class="lang-ja lang-child">Beta版へ</span></span></a></li>
        </ul>
      `);
  } else {
    $('ul.nav.navbar-nav').not('.navbar-right').append(`<li><a href="${ConvertToNewAtcodersURL()}">Beta版へ</a></li>`);
  }
}

function ConvertToAtcodersURL() {
  let pathName = location.pathname;
  let query = location.search;
  if (pathName.match(/settings/)) {
    pathName = pathName.replace(/icon/g, "");
    return 'https://practice.contest.atcoder.jp' + pathName;
  }
  if (location.href.match(/contests/)) {
    let contestName = pathName.replace(/\/contests\//, '').split('/')[0];
    if (contestName === "" || contestName === "archive") {
      query = query.replace(/category/g, "categories");
      query = query.replace(/page=/g, "p=");
      query = query.replace(/keyword=/g, "mode=button");
      return `http://atcoder.jp/contest/${contestName + query}`;
    } else {
      pathName = pathName.replace(RegExp('/contests/' + contestName), '');
      if (pathName.endsWith("/")) {
        pathName = pathName.slice(0, -1);
      }
      if (pathName === "/submissions") {
        pathName += "/all";
      }
      if (pathName === "/tasks") {
        pathName = "/assignments";
      }
      query = query.replace(/f.User/g, "user_screen_name");
      console.log(pathName);
      console.log(query);
      return `https://${contestName}.contest.atcoder.jp${pathName + query}`;
    }
  } else {
    return 'https://beta.atcoder.jp' + pathName + query;
  }

  return 'https://atcoder.jp';
}

function AddLinkToAtcoder() {
  $('ul.nav.navbar-nav').not('.navbar-right').append(`<li><a href="${ConvertToAtcodersURL()}">旧AtCoderへ</a></li>`);
}

if (location.href.match(/beta.atcoder.jp/)) {
  AddLinkToAtcoder();
} else {
  AddLinkToNewAtcoder();
}

})();
