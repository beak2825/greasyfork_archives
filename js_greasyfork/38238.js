// ==UserScript==
// @name         Go To Initial Commit
// @name:zh-CN   跳转到第一次提交
// @namespace    https://github.com/Liu233w/
// @version      0.1
// @description  Add a button on Github commit page which allow you to nevigate to the first commit page
// @description:zh-CN 在 Github 的 commits 页面添加一个按钮，可以跳转到 repo 的第一次提交页面
// @author       Liu233w
// @license      BSD 3-Clause License
// @icon         https://assets-cdn.github.com/pinned-octocat.svg
// @match        https://github.com/*/commits/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38238/Go%20To%20Initial%20Commit.user.js
// @updateURL https://update.greasyfork.org/scripts/38238/Go%20To%20Initial%20Commit.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function openFirstCommit(args) {
    // args[1] is the `orgname/repo` url fragment
    // args[2] is the optional branch or hash

    return fetch('https://api.github.com/repos/' + args[1] + '/commits?sha=' + (args[2] || ''))

    // the link header has additional urls for paging
    // parse the original JSON for the case where no other pages exist
      .then(res => Promise.all([res.headers.get('link'), res.json()]))

    // get last page of commits
      .then(results => {
      // results[0] is the link
      // results[1] is the first page of commits

      if (results[0]) {
        // the link contains two urls in the form
        // <https://github.com/...>; rel=blah, <https://github.com/...>; rel=thelastpage
        // split the url out of the string
        var pageurl = results[0].split(',')[1].split(';')[0].slice(2, -1);
        // fetch the last page
        return fetch(pageurl).then(res => res.json());
      }

      // if no link, we know we're on the only page
      return results[1];
    })

    // get the last commit and extract the url
      .then(commits => commits.pop().html_url)

    // navigate there
      .then(url => window.location = url);
  }

  // add button
  var nav = document.querySelector('.file-navigation');
  var tempDom = document.createElement('div');
  tempDom.innerHTML = '<span type="button" class="btn btn-sm" title="go to the initial(first) commit">initial commit</button>';
  var button = tempDom.firstChild;
  button.addEventListener('click', function () {
    openFirstCommit(window.location.pathname.match(/\/([^\/]+\/[^\/]+)(?:\/tree\/([^\/]+))?/));
  });
  nav.appendChild(button);
  button.previousElementSibling.style.display = "inline"
})();
