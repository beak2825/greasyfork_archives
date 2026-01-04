// ==UserScript==
// @description Adds infinite scroll to HackerNews
// @name Hacker News Infinite Scroll
// @namespace Violentmonkey Scripts
// @match https://news.ycombinator.com/
// @version 1.1.0
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/390837/Hacker%20News%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/390837/Hacker%20News%20Infinite%20Scroll.meta.js
// ==/UserScript==

const regex = new RegExp(/<center>.*(<table id="hnmain".*)<\/center>/gms);
let moreLinkAnchor = document.querySelector('td.title > a.morelink');
let count = 2;

function getHTML(url) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', url, true);
        xhr.responseType = 'document';
        xhr.onload = function () {
            var status = xhr.status;
            if (status == 200) {
                resolve(xhr.response.documentElement.innerHTML);
            } else {
                reject(status);
            }
        };
        xhr.send();
    });
}

let tableName = (document.querySelector('table.itemlist') === null) ? "comment-tree" : "itemlist"

const insertAfter = (el, referenceNode) => {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

const isMoreLink = elm => {
  return [...elm.getElementsByTagName("*")].map(e => e.className).includes('morelink');
}

const parseNextPage = (nextPage, tableType, moreTr) => {
    const page = new DOMParser().parseFromString(nextPage, 'text/html');
    let queryStr = (tableType === 'comment-tree') ? `table.${tableType} tr.athing` : `table.${table.class} tr`
    let newTrs = [...page.querySelectorAll(queryStr)];
    if (tableType === 'comment-tree' && newTrs.length < 259) {
        noMoreLeft = true;
        moreTr.nextElementSibling.style.display = "none";
    }
    let filteredTrs = (tableType === 'itemlist') ? newTrs.filter(e => !isMoreLink(e)) : newTrs
    filteredTrs.forEach(tr => {
        if (tr.className !== "morespace") {
            moreTr.parentNode.insertBefore(tr, moreTr)
        }
    });
}

let noMoreLeft = false;
window.onscroll = async function() {
    if (((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) && (noMoreLeft !== true)) {
        console.log('bottom of page reached');
        let testResponse;
        let parsed;
        if (moreLinkAnchor !== null) {
            //let table;
            let moreLink = /^(.*?p=)/.exec(moreLinkAnchor['href'])[0];
            let nextPage = `${moreLink}${count}`;
            table = document.querySelector('table.itemlist') === null ? {
                class: "comment-tree",
                element: document.querySelector('table.comment-tree')
            } : {
                class: "itemlist",
                element: document.querySelector('table.itemlist')
            };
            let tableRowMore = table.element.querySelector('.morespace');
            let pageRes = await getHTML(nextPage);
            parseNextPage(pageRes, table.class, tableRowMore)
            count++;
        }
    }
};