// ==UserScript==
// @name         github-npm-deps
// @version      0.1.0
// @description  Link dependencies from package.json to respective GitHub homepages
// @license      MIT
// @namespace    https://github.com/eush77/github-npm-deps
// @supportURL   https://github.com/eush77/github-npm-deps
// @include      https://github.com/*
// @downloadURL https://update.greasyfork.org/scripts/11609/github-npm-deps.user.js
// @updateURL https://update.greasyfork.org/scripts/11609/github-npm-deps.meta.js
// ==/UserScript==


init();
document.addEventListener('click', function () {
  setTimeout(init, 500);
});


function init () {
  if (!/\/package\.json$/.test(location.pathname)) {
    return;
  }

  var trs = document.querySelectorAll('.blob-wrapper tr');

  [].reduce.call(trs, function (inDependencies, tr) {
    var row = tr.querySelector('.blob-code');
    if (row.textContent.indexOf('}') >= 0) {
      return false;
    }

    var pls = row.querySelectorAll('.pl-s');

    if (pls.length == 1) {
      pls = pls[0];
      if (pls.nextSibling &&
          pls.nextSibling.textContent.replace(/\s/g, '') == ':{' &&
          /^"\w*[dD]ependencies"$/.test(pls.textContent)) {
        return true;
      }
    }
    else if (inDependencies && pls.length == 2) {
      var name = pls[0].textContent;
      var link = document.createElement('a');
      link.href = 'http://ghub.io/' + name.slice(1, -1);
      link.textContent = name;
      pls[0].parentNode.replaceChild(link, pls[0]);
    }

    return inDependencies;
  }, false);
}
