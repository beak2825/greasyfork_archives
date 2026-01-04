// ==UserScript==
// @name         Douban book download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  豆瓣图书下载, 备份自用, 不提供支持
// @author       wangb
// @match        https://book.douban.com/subject/*
// @connect      b-ok.global
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/408662/Douban%20book%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/408662/Douban%20book%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const title = $('h1').text().trim()

    const $aside = $('.aside')

    const downloadEl = document.createElement('div')
    downloadEl.classList.add('gray_ad')
    downloadEl.style.maxhHeight = '500px'
    downloadEl.style.overflow = 'auto'
    downloadEl.onclick = function (e) {
        console.log(e.target.classList)
        if (e.target.classList.contains('d-retry')) {
            getLink()
        }
    }

    $aside.prepend(downloadEl)

    function getLink() {
        downloadEl.innerHTML = 'Loading...'
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://b-ok.global/s/' + title,
            onload: function (res) {
                const $res = $($.parseHTML(res.responseText))
                const matchBooks = $res.find('#searchResultBox .exactMatch')

                if (matchBooks.length === 0) {
                    downloadEl.innerText = '没有找到!'
                } else {
                    downloadEl.innerHTML = matchBooks.map(function (i, el) {
                        try {
                            const link = 'https://b-ok.global' + el.querySelector('[itemprop="name"] a').getAttribute('href')
                            const title = el.querySelector('[itemprop="name"]').innerText.trim()
                            const cover = el.querySelector('.cover').getAttribute('data-src')
                            const author = [...el.querySelectorAll('[itemprop="author"]')].map(el => el.innerText.trim()).join(',')
                            const publisher = el.querySelector('[title="Publisher"]').innerText.trim()

                            const year = el.querySelector('.property_year .property_value').innerText.trim()
                            const file = el.querySelector('.property__file .property_value').innerText.trim()

                            return `<div style="overflow: auto; margin-bottom: 5px;">
                                       <img src="${cover}" width="auto" height="50px" style="float: left; margin-right: 5px;"/>
                                       <div>
                                           <a href="${link}">${title}</a>
                                       </div>
                                       <div style="font-size: 12px; color: rgba(0,0,0,0.5)">
                                           <p>
                                               <span style="padding-right: 5px">${author}</span>/<span>${publisher}</span>
                                               <p style="float: right">
                                                   <span style="padding-right: 5px">${year}年</span><span>${file}</span>
                                               </p>
                                           </p>
                                       </div>
                                   </div>`
                        } catch (e) {
                            console.log('发生错误', el, e)
                            return ''
                        }
                    }).toArray().filter(e => !!e).join(' ')
                }
            },
            onerror: function() {
                downloadEl.innerHTML = '加载失败, 请<button class="d-retry">重试</button>'
            }
        })
    }

    getLink()

    // Your code here...
})();