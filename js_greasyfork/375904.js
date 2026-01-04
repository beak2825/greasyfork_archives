// ==UserScript==
// @name         Douban Book Autofill
// @namespace    https://gimo.me/
// @version      0.5.3
// @description  auto fill douban book subject creation form
// @author       Yuanji
// @match        https://book.douban.com/new_subject*
// @connect      www.amazon.co.jp
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375904/Douban%20Book%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/375904/Douban%20Book%20Autofill.meta.js
// ==/UserScript==


const submitBtn = document.querySelector('input[name="detail_subject_submit"]')
const nextStepBtn = document.querySelector('input[name="subject_submit"]')

function createFillBtn() {
    const isbn = document.getElementById('p_9').value
    const amazonURL = 'https://www.amazon.co.jp/dp/' + isbn + '?showDetailProductDesc=1';
    const fillBtn = document.createElement('input');
    fillBtn.setAttribute('type', 'submit')
    fillBtn.setAttribute('class', 'submit')
    fillBtn.setAttribute('value', '自动填写')
    fillBtn.onclick = (e) => { e.preventDefault(); getDoc(amazonURL, updateText)}
    return fillBtn
}

function createCoverBtn(url) {
    const coverBtn = document.createElement('input');
    coverBtn.setAttribute('type', 'submit')
    coverBtn.setAttribute('class', 'submit')
    coverBtn.setAttribute('value', '下载封面')
    coverBtn.onclick = (e) => { e.preventDefault(); window.open(url)}
    return coverBtn
}

function createSearchBtn() {
    const searchBtn = document.createElement('input');
    searchBtn.setAttribute('type', 'submit')
    searchBtn.setAttribute('class', 'submit')
    searchBtn.setAttribute('value', '検索')
    searchBtn.onclick = (e) => {
        e.preventDefault();
        const title = document.getElementById('p_title').value
        const amazonSearchURL = 'https://www.amazon.co.jp/s/?url=search-alias%3Dstripbooks&keywords=' + title
        console.log(amazonSearchURL)
        getDoc(amazonSearchURL, search)
    }
    return searchBtn
}

function search(amazonSearchDoc) {
    let amazonSearchBox = document.getElementById('amazon_search_box')
    if (amazonSearchBox) {
        amazonSearchBox.remove()
    }
    const results = []
    console.log(amazonSearchDoc.querySelector('div.s-result-list.sg-row'))
    for (let li of amazonSearchDoc.querySelector('div.s-result-list.sg-row').children) {
        let result = {}
        const h2 = li.getElementsByTagName('h2')[0]
        if (!h2) {
            continue
        }
        result.title = h2.textContent.trim()
        const a = h2.getElementsByTagName('a')[0]
        const url = a.href
        const match = url.match(/\/dp\/(.*)\//)
        if (match && match[1].length == 10) {
            result.isbn = match[1]
            results.push(result)
            console.log(result)
        }
    }
    let lists = ''
    for (let r of results) {
        lists += `<li><a class="amazon_search_item" isbn="${r.isbn}">${r.title}</a></li>\n`
    }
    let ul = document.createElement('ul')
    ul.innerHTML = `
    <ul id="amazon_search_box"
        style="
        border: solid 1px #000;
        width: 45%;
        padding: 4px;
    ">
        ${lists}
    </ul>
    `
    document.querySelector('div[class="article"]').appendChild(ul)
    for (let item of document.getElementsByClassName('amazon_search_item')) {
        item.onclick = e => {
            e.preventDefault()
            console.log(item.innerText, item.getAttribute('isbn'))
            document.getElementById('p_title').value = item.innerText.trim()
            document.getElementById('uid').value = item.getAttribute('isbn')
        }
    }
}

function getDoc(url, callback) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            'User-agent': window.navigator.userAgent,
        },
        onload: (responseDetail) => {
            let doc = '';
            if (responseDetail.status == 200) {
                doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
                callback(doc)
            }
        }
    });
}

function updateText(amazonDoc) {
    const title = document.getElementById('p_2');
    //const subTitle = document.getElementById('p_42');
    const origTitle = document.getElementById('p_98');
    const author = document.getElementById('p_5_0');
    const price = document.getElementById('p_8');
    const publisher = document.getElementById('p_6');
    const publishYear = document.getElementById('p_7_selectYear');
    const publishMonth = document.getElementById('p_7_selectMonth');
    const publishDay = document.getElementById('p_7_selectDay');
    const pageNum = document.getElementById('p_10');
    const intro = document.querySelector('textarea[name="p_3_other"]');
    const authorIntro = document.querySelector('textarea[name="p_40_other"]');
    // 默认平装
    document.getElementById('p_58_0').checked = true;

    const amazonTitleText = amazonDoc.getElementById('productTitle').innerText;
    const amazonInfo = amazonDoc.getElementById('detail_bullets_id');
    const amazonIntro = amazonDoc.getElementById('productDescription');
    let amazonCoverURL = '';
    const amazonCover = amazonDoc.querySelector("#imgThumbs > div:nth-child(1) > img");
    if (amazonCover) {
        amazonCoverURL = amazonCover.src.replace(/_.*_\./, '');
    }
    const getTextNodeContent = item => {
        for (let n of item.childNodes) {
            if (n.nodeType === Node.TEXT_NODE) {
                console.log(n);
                return n.textContent
            }
        }
    }
    for (let item of amazonInfo.getElementsByTagName('li')) {
        const itemText = item.innerText
        if (itemText.includes('ページ')) {
            pageNum.value = parseInt(getTextNodeContent(item));
        }
        if (itemText.includes('出版社')) {
            const [, publisherText] = getTextNodeContent(item).trim().match(/(.*)\(.*\)/);
            const [, publishDateText] = getTextNodeContent(item).trim().match(/.*\((.*)\)/);
            if (publisherText) {
                publisher.value = publisherText;
            }
            if (publishDateText) {
                let [yearText, monthText, dayText] = publishDateText.split('/').map((x) => parseInt(x));
                dayText = dayText || 1;
                publishYear.value = yearText;
                publishMonth.value = monthText;
                publishMonth.dispatchEvent(new Event('change'));
                publishDay.value = dayText;
                console.log(publisherText, yearText, monthText, dayText);
            }
        }
    }
    for (let el of amazonIntro.children) {
        if (el.innerText.startsWith('内容')) {
            intro.value += el.nextElementSibling.innerText.trim();
        }
        if (el.innerText.startsWith('著者')) {
            authorIntro.value = el.nextElementSibling.innerText.trim();
        }
    }
    title.value = amazonTitleText;
    origTitle.value = amazonTitleText;
    author.value = amazonDoc.getElementsByTagName('title')[0].innerText.split('|')[1].trim();

    if (amazonCoverURL) {
        const coverBtn = createCoverBtn(amazonCoverURL);
        submitBtn.parentNode.insertBefore(coverBtn, submitBtn.parentNode.firstChild)
    }
}

(function() {
    'use strict';
    if (nextStepBtn) {
        const searchBtn = createSearchBtn();
        nextStepBtn.parentNode.insertBefore(searchBtn, nextStepBtn);
    }
    if (submitBtn) {
        const fillBtn = createFillBtn();
        submitBtn.parentNode.insertBefore(fillBtn, submitBtn);
    }
})();
