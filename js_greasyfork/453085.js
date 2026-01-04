// ==UserScript==
// @name         javdb 重排序
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  根据评分人数降序排列，且会自动加载十页的内容
// @author       You
// @match        https://javdb.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453085/javdb%20%E9%87%8D%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453085/javdb%20%E9%87%8D%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let peoplePattern = /由(\d+)人/;
    let pagePattern = /page=(\d+)/;
    let movieList = $('.movie-list')[0]
    let maxPageOffset = 0;
    let paginationNext = $('.pagination-next')
    let curPage = getCurPage()
    if (paginationNext && paginationNext.length) {
        paginationNext = paginationNext[0]
        maxPageOffset = 9;
        paginationNext.href = getPageUrl(curPage+maxPageOffset+1)
        paginationNext.textContent = `下${maxPageOffset+1}页`
    }
    main()
    function main(){
        reSortByPeopleCnt()
        for (let pageOffset = 0; pageOffset < maxPageOffset; pageOffset++) {
            let newPage = curPage + pageOffset + 1;
            loadPage(newPage, newList => {
                reSortByPeopleCnt(newList)
                console.log(`load page:${newPage}`)
            })
        }
    }


    function reSortByPeopleCnt(newList) {
        let curList = $('.item', movieList);
        let allList = []
        for (let i of curList) {
            allList.push(i)
        }
        if (newList && newList.length) {
            for (let i of newList) {
                allList.push(i)
            }
        }
        for (let item of allList) {
            let score = $('.score', item)[0]
            let searchRes = peoplePattern.exec(score.textContent)
            let peopleCnt = searchRes[1]
            peopleCnt = Number.parseInt(peopleCnt)
            item.peopleCnt = peopleCnt
            score.innerHTML = score.innerHTML.replace(/由(\d+)人/, '由<span style="color:red">$1</span>人')
        }
        allList.sort((a, b) => b.peopleCnt - a.peopleCnt)
        allList = allList.slice(0, 100)
        movieList.innerHTML = ""
        for (let item of allList) {
            movieList.append(item)
        }
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
    function loadPage(page, cb) {
        let pageUrl = getPageUrl(page)
        getdata(pageUrl, data => {
            let container = document.createElement('div');
            container.style.display = 'none'
            container.innerHTML = data
            let newList = $('.movie-list .item', container)
            cb(newList)
        })
    }

    function getdata(pageUrl, cb) {
        $.get(pageUrl, function (data, status) {
            cb(data)
        });
    }



})();