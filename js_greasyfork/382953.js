// ==UserScript==
// @name pixiv same author remover
// @description Removes same author when browsing related work below a submission in Pixiv
// @match https://www.pixiv.net/member_illust.php*
// @match https://www.pixiv.net/en/artworks/*
// @version 0.0.1.20200403073140
// @namespace https://greasyfork.org/users/301246
// @downloadURL https://update.greasyfork.org/scripts/382953/pixiv%20same%20author%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/382953/pixiv%20same%20author%20remover.meta.js
// ==/UserScript==

var main = function() {

  function filter() {

    var author = document.querySelectorAll('main + aside a[href*="/users/"]')[1];

    if (!author) {
      return; // not loaded
    }

    author = author.innerText;

    document.querySelectorAll('.gtm-illust-recommend-zone li').forEach(function(node) {
      var recAuthor = node.querySelector('.gtm-illust-recommend-user-name').innerText;
      if (recAuthor === author) {
        node.remove();
      }
    });
  }

  var loop = function() {
    filter();
    setTimeout(loop, 2000);
  };
  
  loop();
  
};

window.addEventListener('load', (event) => {
    main();
});