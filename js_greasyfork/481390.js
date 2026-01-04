// ==UserScript==
// @name         ZJUlib2douban Enhanced
// @namespace    https://github.com/AlainAlan/ZJUlib2douban/tree/main
// @version      0.4
// @description  在ZJU图书馆书目详情页面右上角添加一个悬浮按钮，通过豆瓣ISBN页面抓取评分数据。如果有评分数据，则显示“豆瓣评分8.8分”，否则显示“豆瓣暂无评分”。
// @author       AlainAllen
// @match        *://opac.zju.edu.cn/*
// @grant        GM_xmlhttpRequest
// @connect      douban.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/481390/ZJUlib2douban%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/481390/ZJUlib2douban%20Enhanced.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to extract the last ISBN using regular expression
    function extractLastISBN() {
        var isbnRegex = /ISBN(?:-1[03])?:?\s*(\d{0,3}-?\d{1,5}-?\d{1,7}-?\d{1,7}-?[\dX])/g;
        var bodyText = document.body.innerText;
        var isbnMatches = [...bodyText.matchAll(isbnRegex)];
        if (isbnMatches.length > 0) {
            var lastIsbnMatch = isbnMatches[isbnMatches.length - 1];
            return lastIsbnMatch[1]; // Capture group 1 contains the ISBN
        } else {
            return null;
        }
    }

    // Function to fetch Douban rating by ISBN
    function fetchDoubanRating(isbn, callback) {
        const url = `https://douban.com/isbn/${isbn}/`;
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const ratingElement = doc.querySelector('.rating_num');
                    if (ratingElement && ratingElement.textContent.trim()) {
                        const rating = ratingElement.textContent.trim();
                        callback(null, rating);
                    } else {
                        callback(null, "暂无评分");
                    }
                } else {
                    callback("Error fetching Douban rating");
                }
            },
            onerror: function () {
                callback("Error connecting to Douban");
            }
        });
    }

    // Function to create and append the floating button
    function appendFloatingButton(text, isbn) {
        const button = document.createElement('div');
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#007722';
        button.style.color = '#fff';
        button.style.borderRadius = '5px';
        button.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        button.style.cursor = 'pointer';
        button.style.zIndex = '9999';
        button.style.fontSize = '14px';
        button.textContent = text;
        button.title = '点击查看豆瓣页面';
        button.onclick = function () {
            window.open(`http://douban.com/isbn/${isbn}/`, '_blank');
        };
        document.body.appendChild(button);
    }

    // Main function
    window.addEventListener('load', function () {
        const isbn = extractLastISBN();
        if (isbn) {
            fetchDoubanRating(isbn, function (error, rating) {
                if (error) {
                    console.error(error);
                    appendFloatingButton("豆瓣暂无评分", isbn);
                } else {
                    const text = rating === "暂无评分" ? "豆瓣暂无评分" : `豆瓣评分 ${rating}分`;
                    appendFloatingButton(text, isbn);
                }
            });
        } else {
            console.log('ISBN not found. Cannot create button.');
        }
    });
})();