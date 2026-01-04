// ==UserScript==
// @name         Nico Seiga infinite srolling
// @namespace    https://greasyfork.org/zh-CN/scripts/43940
// @version      2022.3.13
// @description  Enable nico seiga infinite scrolling
// @author       ctrn43062
// @match        https://seiga.nicovideo.jp/tag/*
// @match        https://seiga.nicovideo.jp/user/illust/*
// @icon         https://www.google.com/s2/favicons?domain=nicovideo.jp
// @grant        none
// @license MIT 
// @note 2022.3.13 添加 illust 页支持

// @downloadURL https://update.greasyfork.org/scripts/439406/Nico%20Seiga%20infinite%20srolling.user.js
// @updateURL https://update.greasyfork.org/scripts/439406/Nico%20Seiga%20infinite%20srolling.meta.js
// ==/UserScript==


const url = new URL(location.href);
const baseURL = url.origin + url.pathname;
const scrollBuffer = 600;

let currentPage = parseInt(url.searchParams.get('page')) || 1;
let loadingNextPage = false;


function getScrollHeight() {
    const scrollTop =
        document.documentElement.scrollTop === 0 ? document.body.scrollTop : document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollTop === 0 ? document.body.scrollHeight : document.documentElement.scrollHeight;

    const innerHeight = window.innerHeight;

    return {
        scrollTop: scrollTop,
        scrollHeight: scrollHeight,
        innerHeight: innerHeight
    };
}


function getPage(page = 1) {
    currentPage += page;
    url.searchParams.set('page', currentPage);
    return fetch(url).then(resp => resp.text());
}


function createLoadingTip(tip = '') {
    const loadingTip = document.createElement('center');
    const illust_list = document.querySelector('.illust_list')


    loadingTip.style.margin = '30px 0';
    loadingTip.style.color = '#888';
    loadingTip.style.fontSize = '0.85rem';
    loadingTip.style.fontWeight = 'bold';
    loadingTip.style.clear = 'both';
    loadingTip.style.opacity = '0';

    illust_list.appendChild(loadingTip);

    return {
        show: () => {
            // 加载下一页数据的提示文本
            loadingTip.textContent = tip || `Loading Page ${currentPage + 1}`
            loadingTip.style.opacity = '1';
        },
        hide: () => {
            loadingTip.style.opacity = '0';
        }
    };
}


(function() {
    const loadingTip = createLoadingTip();

    window.addEventListener('scroll', () => {
        const scroll = getScrollHeight();
        const scrollTop = scroll['scrollTop'],
            scrollHeight = scroll['scrollHeight'],
            innerHeight = scroll['innerHeight'];

        if (scrollTop + innerHeight >= scrollHeight - scrollBuffer && !loadingNextPage) {
            loadingNextPage = true;
            loadingTip.show();
        
            getPage().then(html => {
                history.replaceState({}, '', url);
                const dummyHTML = document.createElement('html');
                dummyHTML.innerHTML = html;
                const items = dummyHTML.querySelectorAll('.item_list .list_item');
                const newControll = dummyHTML.querySelector('.controll');

                // no more data
                if(!items.length) {
                    loadingTip.hide();
                    return ;
                }

                document.querySelectorAll('.controll').forEach(controll => {
                    controll.innerHTML = newControll.innerHTML;
                })

                const itemList = document.querySelector('.item_list');

                itemList.append.apply(itemList, items);

                loadingTip.hide();
                loadingNextPage = false;
            })
        }
    }, false);
})();