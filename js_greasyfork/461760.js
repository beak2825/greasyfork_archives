// ==UserScript==
// @name         豆瓣读书生成BibTeX引用
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  从豆瓣读书网页中提取元数据并生成BibTeX引用
// @author       entr0pia
// @match        https://book.douban.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461760/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%94%9F%E6%88%90BibTeX%E5%BC%95%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461760/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E7%94%9F%E6%88%90BibTeX%E5%BC%95%E7%94%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var title = document.querySelector("#wrapper > h1 > span").textContent;

    var subtitle, author1st, authors, publisher, year, pages, translators='';
    function catSpan(n) {
        var key = n.textContent.trim().split(':')[0];
        var ast;
        switch (key) {
            case '作者':
                author1st = n.querySelectorAll('a')[0].textContent;
                var authorsList = Array.from(n.querySelectorAll('a'))
                    .map(a => a.textContent);
                authors = authorsList.join(' and ');
                ast = authors.split(/[，、]/);
                if (ast.length > 1) {
                    author1st = ast[0]
                    authors = ast.join(' and ');
                }
                console.log('一作:'+author1st);
                break;
            case '出版社':
                publisher = n.nextElementSibling.textContent;
                break;
            case '副标题':
                subtitle = n.nextSibling.textContent.trim();
                console.log('副标题:' + subtitle);
                break;
            case '出版年':
                year = n.nextSibling.textContent.split("-")[0].trim();
                break;
            case '页数':
                pages = n.nextSibling.textContent.trim();
                break;
            case '译者':
                translators = Array.from(n.querySelectorAll('a'))
                    .map(a => a.textContent)
                    .join(' and ');
                ast = authors.split(/[，、]/)
                if (ast.length > 1) {
                    translators = ast.join(' and ');
                }
                console.log('译者:' + translators);
                break;
        }
    }

    // 提取元数据
    Array.from(document.querySelectorAll('#info > span'))
        .map(n => catSpan(n));

    var citekey=`${author1st}${year}${title}`;

    if (subtitle != null){
        title = `${title}：${subtitle}`;
    }

    // 格式化为BibTeX文本
    var bibtex = `@book{${citekey},
    title = {${title}},
    author = {${authors}},
    publisher = {${publisher}},
    year = {${year}},
    pages = {${pages}},
    translator = {${translators}}
}`;


    // 添加一个按钮，点击后将BibTeX文本复制到剪贴板
    const bibButton = document.createElement('button');
    bibButton.textContent = '复制BibTeX引用';
    bibButton.className = 'j a_show_login lnk-sharing lnk-douban-sharing';
    bibButton.type = 'button';
    const container = document.querySelector("#content > div > div.article > div.indent > div.rec-sec");
    if (container != null) {
        container.appendChild(bibButton);
    }

    bibButton.addEventListener('click', () => {
        GM_setClipboard(bibtex);
        alert('复制成功，请手动填写页码');
    });
})();
