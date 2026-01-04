// ==UserScript==
// @name         PTT 網頁版黑名單
// @namespace    https://github.com/Peugin/
// @version      2024-07-23
// @description  在 PTT 網頁版中設定你的黑名單！
// @author       Peugin
// @match        https://www.ptt.cc/bbs/*/*
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501553/PTT%20%E7%B6%B2%E9%A0%81%E7%89%88%E9%BB%91%E5%90%8D%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/501553/PTT%20%E7%B6%B2%E9%A0%81%E7%89%88%E9%BB%91%E5%90%8D%E5%96%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const ignoreAuthors = ['---'];
    const ignoreTitles = ['中國'];

    ignoreTitles.forEach(title => {
        var articles = document.querySelectorAll(`.r-ent > .title > a`);
        articles.forEach(article => {
            if(article.text.includes(title)) {
                hideArticle(article);
            }
        });
    });

    //ignoreAuthors.forEach(author => {
      //  var articles = document.querySelectorAll(`.r-ent[data-Author='${author}']`);
        //articles.forEach(article => {
          //  article.querySelector(`.meta > .author`).firstChild.insertAdjacentHTML('afterbegin','(黑名單) ');
            //article.style.color = '#111';
            //console.log(article);
        //});
    //});

    function hideArticle(element) {
        var root = element.closest('.r-ent');
        //作者、日期
        root.style.color = '#000';
        //標題
        root.querySelector('.title > a').style.color = '#000';
        //推文數
        root.querySelector('.nrec > span').style.color = '#000';
    }
})();