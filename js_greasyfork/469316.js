// ==UserScript==
// @name         goto wnacg
// @namespace    http://tampermonkey.net/
// @version      0.24
// @description  在ex和n上增加跳转到hitomi和wnacg的链接方式
// @author       mayako
// @license MIT
// @match        https://exhentai.org/*
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469316/goto%20wnacg.user.js
// @updateURL https://update.greasyfork.org/scripts/469316/goto%20wnacg.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 获取[]正则。主要为了作者名
    let reg1 = /(?<=\[)(.+?)(?=\])/g
    // 获取本子标题
    let reg2 = /(?<=\])(.+?)(?=\[)/g
    // 获取作者的曾用名
    let reg3 = /(?<=\()(.+?)(?=\))/g;

    let getFN = function (name) {
        return name.split('(')[0]
    }
    let style = document.createElement('style')
    style.type = 'text/css';
    style.innerHTML = `
                 .nha{
                     background: #5b7793;
    border-radius: 0.3em;
    padding: 0.13em 0.39em;
    align-items: center;
                 }
            `
    document.querySelector('head').appendChild(style)

    let getAll = function (all) {
        let author = ''
        let author2 = null
        let title = ''
        if(all.match(reg2)){
            title=all.match(reg2)[0]}else{
                title=all.split(']')[1]
            }
        let tmp = all.match(reg1)[0]
        if (tmp.match(reg3)) {
            author2 = tmp.match(reg3)[0]
            author = getFN(tmp)
            return {
                author, author2, title
            }
        } else {
            author = tmp
            return { author, title }
        }
    }
    let createTag = function (author, author2, title, lang) {
        if (lang === 'zh') {
            if (author) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">wnacg作者:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://www.wnacg.com/search/?q=${author}" >${author}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }
            if (author2) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">wnacg作者2:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://www.wnacg.com/search/?q=${author2}" >${author2}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }
            if (title) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">wnacg标题:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://www.wnacg.com/search/?q=${title}" >${title}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }

        } else {
            if (author) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">hitomi作者:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://hitomi.la/search.html?${author}#1" >${author}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }
            if (author2) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">hitomi作者2:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://hitomi.la/search.html?${author2}#1" >${author2}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }
            if (title) {
                const newTagLine = document.createElement('tr');
                let temp = `<td class="tc">hitomi标题:</td><td>`;
                temp += `<div class="gtl" style="opacity:1.0"><a href="https://hitomi.la/search.html?${title}#1" >${title}</a></a></div>`;
                newTagLine.innerHTML = `${temp}</td>`;
                document.querySelector('#taglist tbody').appendChild(newTagLine);
            }
        }
    }
    let createTagN = function (author, author2, title, lang) {
        if (lang === 'zh') {
            if (author) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `wnacg作者: <span class="tags">`;
                temp += `<a class="tag nha" href="https://www.wnacg.com/search/?q=${author}" >${author}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }
            if (author2) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `wnacg作者2: <span class="tags">`;
                temp += `<a class="tag nha" href="https://www.wnacg.com/search/?q=${author2}" >${author2}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }
            if (title) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `wnacg标题: <span class="tags">`;
                temp += `<a class="tag nha" href="https://www.wnacg.com/search/?q=${title}" >${title}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }

        } else {
            if (author) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `hitomi作者: <span class="tags">`;
                temp += `<a class="tag nha" href="https://hitomi.la/search.html?${author}#1" >${author}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }
            if (author2) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `hitomi作者2: <span class="tags">`;
                temp += `<a class="tag nha" href="https://hitomi.la/search.html?${author2}#1" >${author2}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }
            if (title) {
                const newTagLine = document.createElement('div');
                newTagLine.className = "tag-container field-name"
                let temp = `hitomi标题: <span class="tags">`;
                temp += `<a class="tag nha" href="https://hitomi.la/search.html?${title}#1" >${title}</a>`;
                newTagLine.innerHTML = `${temp}</span>`;
                document.querySelector('#tags').appendChild(newTagLine);
            }
        }
    }
    if (location.hostname === 'exhentai.org' && location.pathname.indexOf('/g/') === 0) {
        let gj = document.querySelector('#gj').textContent
        let gn = document.querySelector('#gn').textContent
        if (gj) {
            let { author, author2, title } = getAll(gj)
            createTag(author, author2, title, 'zh')
        }else{
             let { author, author2, title } = getAll(gn)
            createTag(author, author2, title, 'zh')
        }
        if (gn) {
            let { author, author2, title } = getAll(gn)
            createTag(author, author2, title, 'en')
        }
    }
    if (location.hostname === 'nhentai.net' && location.pathname.indexOf('/g/') === 0) {
        let gj = document.querySelectorAll('#info .title')[1].textContent
        let gn = document.querySelectorAll('#info .title')[0].textContent
        if (gj) {
            let { author, author2, title } = getAll(gj)
            createTagN(author, author2, title, 'zh')
        }else{
             let { author, author2, title } = getAll(gn)
            createTag(author, author2, title, 'zh')
        }
        if (gn) {
            let { author, author2, title } = getAll(gn)
            createTagN(author, author2, title, 'en')
        }
    }
    // Your code here...
})();