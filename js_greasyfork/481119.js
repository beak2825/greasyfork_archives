// ==UserScript==
// @name         javdb resort
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  resort by number of raters，and auto load 10 pages
// @author       q27256751  -> metaphor-pump
// @match        https://javdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481119/javdb%20resort.user.js
// @updateURL https://update.greasyfork.org/scripts/481119/javdb%20resort.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let peoplePattern = /由(\d+)人/;
    let pagePattern = /page=(\d+)/;
    let movieList = $('.movie-list')[0]
    let maxPageOffset = 0;
    let nextPageButton = $('.pagination-next')
    let curPage = getCurPage()
    if (nextPageButton && nextPageButton.length) {
        nextPageButton = nextPageButton[0]
        maxPageOffset = 9;
        nextPageButton.href = getPageUrl(curPage+maxPageOffset+1)
        nextPageButton.textContent = `下${maxPageOffset + 1}页`
    }

    //add sort button
    var sortButton = document.createElement('a');
    sortButton.className = 'button is-small';
    sortButton.textContent = '评分人数排序';
    sortButton.addEventListener('click', sortItem);
    $('.buttons.has-addons')[2].appendChild(sortButton);

    //load page and sort
    for (let i = 0; i < maxPageOffset; i++) {
        let newPage = curPage + i + 1;
        let isLastPage = i == maxPageOffset - 1;
        loadPage(newPage, sortItem, isLastPage);
    }

    function sortItem() {
        debugger;
        console.log(`item start sort`)
        let curList = $('.item', movieList);
        let allList = []
        for (let i of curList) {
            allList.push(i)
        }
        //计算评分人数
        for (let item of allList) {
            let score = $('.score', item)[0]
            let searchRes = peoplePattern.exec(score.textContent)
            let peopleCnt = searchRes[1]
            peopleCnt = Number.parseInt(peopleCnt)
            item.peopleCnt = peopleCnt
            score.innerHTML = score.innerHTML.replace(peoplePattern, '由<span style="color:red">$1</span>人')
        }
        allList.sort((a, b) => b.peopleCnt - a.peopleCnt)
        allList = allList.slice(0, 100)
        movieList.innerHTML = ""
        for (let item of allList) {
            movieList.append(item)
        }
        console.log(`item sorted`)
    }

    function getCurPage() {
        let curPath = window.location.href;
        let searchRes = pagePattern.exec(curPath)
        if (searchRes && searchRes.length > 1) {
            return Number.parseInt(searchRes[1])
        }
        return 1
    }

    function getPageUrl(page) {
        let curPath = window.location.href;
        let pageIdx = curPath.indexOf('page');
        if (pageIdx > 0) {
            return curPath.replace(pagePattern, `page=${page}`)
        } else {
            if (curPath.indexOf('?') > 0) {
                return curPath + `&page=${page}`
            } else {
                return curPath + `?page=${page}`
            }
        }
    }

    //load and sort
    function loadPage(pageNum, sortItem, isLastPage) {
        let pageUrl = getPageUrl(pageNum)
        getdata(pageUrl, data => {
            let container = document.createElement('div');
            container.style.display = 'none'
            container.innerHTML = data
            let newList = $('.movie-list .item', container)
            if (newList && newList.length) {
                for (let i of newList) {
                    movieList.append(i)
                }
            }
            if (isLastPage) {
                sortItem();
            }
            console.log(`load page:${page}`)
        })
    }

    function getdata(pageUrl, cb) {
        $.get(pageUrl, function (data, status) {
            cb(data)
        });
    }

})();