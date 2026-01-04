// ==UserScript==
// @name         Bangumi显示更新进度
// @namespace    https://zeng.games/
// @version      0.1.0
// @description  显示动画的更新进度，高亮已完结的，便于挑选已完结的看
// @author       JiaChen ZENG
// @match        https://bgm.tv/*
// @icon         https://bgm.tv/img/favicon.ico
// @run-at       document-end
// @license      MIT
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/490472/Bangumi%E6%98%BE%E7%A4%BA%E6%9B%B4%E6%96%B0%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/490472/Bangumi%E6%98%BE%E7%A4%BA%E6%9B%B4%E6%96%B0%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Use GM_addStyle to inject CSS
    GM_addStyle('.airComplete { color: #60c460; }');
    GM_addStyle('.airInProgress { }');

    // Select all elements with the class 'subjectCover'
    const covers = document.querySelectorAll('.subjectCover');

    // Function to create a new span element with the count or error message and append it to the specified element
    function setAirCountOrErrorToElement(element, content) {
      const episodeRe = /(?<=^\n)(\d+)话(?=[^\n]+$)/;
      element.innerHTML = element.innerHTML.match(episodeRe)[1] == content
      ? element.innerHTML.replace(episodeRe, '<span class="airComplete">$&全</span>')
      : element.innerHTML.replace(episodeRe, `<span class="airInProgress">$& 最新${content}</span>`)
    }

    // Function to handle the GM_xmlhttpRequest response
    function handleResponse(responseText, cover) {
      // Parse the HTML response and find the '.inner h3' element next to the '.subjectCover'
      const parser = new DOMParser();
      const doc = parser.parseFromString(responseText, 'text/html');
      const targetElement = cover.nextElementSibling.querySelector('.info');
      const airCount = doc.querySelectorAll('.epBtnAir').length;
      // Append the count or error message to the '.inner h3' element
      setAirCountOrErrorToElement(targetElement, airCount);
    }

    // Function to handle errors
    function handleError(cover) {
      const targetElement = cover.nextElementSibling.querySelector('.info');
      setAirCountOrErrorToElement(targetElement, '?');
    }

    // Loop through each 'subjectCover' element
    covers.forEach((cover, index) => {
      // Extract the 'href' attribute
      const href = cover.getAttribute('href');
      if (href) {
        // Delay the GM_xmlhttpRequest call by index * 1000 milliseconds to space out the requests
        setTimeout(() => {
          // Use GM_xmlhttpRequest to make the request
          GM_xmlhttpRequest({
            method: 'GET', url: href,
            headers: {
              // Set a user-agent string
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
            },
            onload: (response) => {
              if (response.status === 200 && response.responseText) handleResponse(response.responseText, cover);
              else handleError(cover);
            },
            onerror: () => handleError(cover)
          });
        }, index * 100);
      }
    });
})();