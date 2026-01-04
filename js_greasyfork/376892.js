// ==UserScript==
// @name         豆瓣読書泥棒
// @namespace    https://gimo.me/
// @version      0.3.0
// @description  从日本读书网站摘取书评显示在豆瓣读书条目页面
// @author       Yuanji
// @match        https://book.douban.com/subject/*
// @connect      booklog.jp
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/376892/%E8%B1%86%E7%93%A3%E8%AA%AD%E6%9B%B8%E6%B3%A5%E6%A3%92.user.js
// @updateURL https://update.greasyfork.org/scripts/376892/%E8%B1%86%E7%93%A3%E8%AA%AD%E6%9B%B8%E6%B3%A5%E6%A3%92.meta.js
// ==/UserScript==

function buildCommentItem(props) {
    return `
<li class="comment-item" data-cid="549875751">
    <div class="comment">
        <h3>
            <span class="comment-info">
                <a href=${props.url}>${props.author}</a>
                <span class="user-stars allstar${props.rating}0 rating" title="推荐"></span>
                <span>${props.date}</span>
            </span>
        </h3>
        <p class="comment-content">
            <span class="short">${props.content}</span>
        </p>
    </div>
</li>
`
}

function buildRatingInfo(props, isbn10) {
    starValue = Math.round(props.rating) * 5
    url = `https://booklog.jp/item/1/${isbn10}`
    return `
    <div class="rating_wrap clearbox" rel="v:rating">
        <div class="rating_logo">ブクログのレビュー</div>
        <div class="rating_self clearfix" typeof="v:Rating">
            <strong class="ll rating_num " property="v:average"> ${props.rating} </strong>
            <span property="v:best" content="10.0"></span>
            <div class="rating_right ">
                <div class="ll bigstar${starValue}"></div>
                <div class="rating_sum">
                    <span class="">
                        <a href="${url}" class="rating_people">レビュー<span property="v:votes">${props.count}</span>件</a>
                    </span>
                </div>
            </div>
        </div>
    </div>
    `
}

function getISBN() {
    const metaInfo = document.querySelector('head > script[type="application/ld+json"]')
    if (metaInfo) {
        return JSON.parse(metaInfo.textContent)['isbn']
    }
}

function isJapaneseBook(isbn) {
    return (typeof isbn === 'string' && isbn[3] === '4')
}

function Request(url, method, opt = {}) {
    Object.assign(opt, {
        url,
        timeout: 2000,
        headers: {
            'User-Agent': window.navigator.userAgent
        },
        method: method
    })

    return new Promise((resolve, reject) => {
        opt.onerror = opt.ontimeout = reject
        opt.onload = resolve
        GM_xmlhttpRequest(opt)
    })
}

function parseBooklogReview(el) {
    const reviewAuthorElement = el.querySelector('span[class="reviewer"]')
    const reivewDateElement = el.querySelector('p[class="review-date"]')
    const reviewURLElement = reivewDateElement && reivewDateElement.firstElementChild
    const reviewTextElement = el.querySelector('p[class="review-txt"]')
    const reviewRatingElement = el.querySelector('span[itemprop="ratingValue"]')
    // すべては存在すべき
    if (![reviewAuthorElement, reivewDateElement, reviewURLElement, reviewTextElement, reviewRatingElement].every(i => !!i)) {
        return null
    }
    return {
        author: reviewAuthorElement.textContent.trim(),
        date: reivewDateElement.textContent.trim(),
        url: reviewURLElement.href.replace('book.douban.com', 'booklog.jp'),
        content: reviewTextElement.innerHTML,
        rating: reviewRatingElement.getAttribute('content')
    }
}

function parseBooklogRating(doc) {
    ratingDiv = doc.querySelector('div[class="rating-value"]')
    rating = ((+ratingDiv.innerText.split('\n')[0])*2).toFixed(1)
    count = +doc.querySelector('span[itemprop="reviewCount"]').innerText
    return {
        rating,
        count
    }
}

function ISBN13ToISBN10(isbn13) {
    const commonChars = isbn13.slice(3, -1)
    let sum = 0
    for (const [idx, char] of Array.from(commonChars).entries()) {
        sum += (10 - idx) * parseInt(char)
    }
    let checkDigest = (11 - (sum % 11)) % 11
    checkDigest = checkDigest !== 10 ? checkDigest.toString() : 'X'
    return commonChars + checkDigest
}

(function () {
    'use strict'
    const isbn = getISBN()
    if (!(isbn && isJapaneseBook(isbn))) {
        return
    }
    const navTab = document.querySelector('div[class="nav-tab"]')
    // ブクログのタブを追加する
    navTab.firstElementChild.insertAdjacentHTML('beforeend', `<span>/<span><a class="short-comment-tabs" href="booklog" data-tab="booklog">ブクログ</a>`)
    const commentListWrapper = document.getElementById('comment-list-wrapper')
    commentListWrapper.insertAdjacentHTML('beforeend', `<div id="comments" class="comment-list booklog noshow"><ul id="booklog-review-list"></ul></div>`)
    const booklogReviewList = document.getElementById('booklog-review-list')
    const RatingInfoList = document.getElementById('interest_sectl')
    const isbn10 = ISBN13ToISBN10(isbn)
    const booklogURL = `https://booklog.jp/item/1/${isbn10}?perpage=10&rating=0&is_read_more=2&sort=1`
    console.log(booklogURL)
    Request(booklogURL, 'GET').then(res => {
        const booklogHTML = res.responseText
        const booklogDoc = new DOMParser().parseFromString(booklogHTML, "text/html")
        return booklogDoc
    }).then(doc => {
        const reviewList = doc.querySelectorAll('li[class="review clearFix"]')
        const reviewPropsList = []
        for (let li of reviewList) {
            const props = parseBooklogReview(li)
            if (props) {
                console.log(props)
                reviewPropsList.push(props)
            }
        }
        for (let props of reviewPropsList) {
            const review = document.createElement('li')
            review.innerHTML = buildCommentItem(props)
            booklogReviewList.appendChild(review)
        }
        console.log(doc.location)
        RatingInfoList.insertAdjacentHTML('beforeend', buildRatingInfo(parseBooklogRating(doc), isbn10))
    })
})();
