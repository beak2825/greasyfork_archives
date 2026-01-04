// ==UserScript==
// @name         豆瓣条目跳转NeoDB条目
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!*
// @author       You
// @match        *://m.douban.com/*/subject/*
// @match        *://*.douban.com/subject/*
// @match        *://neodb.social/movie/*
// @match        *://neodb.social/book/*
// @match        *://neodb.social/tv/season/*
// @match        *://neodb.social/discover/*
// @license   MIT
// @match        *://neodb.social/music/*
// @icon         https://neodb.social/static/img/logo_square.f6d14b9fa477.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469658/%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE%E8%B7%B3%E8%BD%ACNeoDB%E6%9D%A1%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/469658/%E8%B1%86%E7%93%A3%E6%9D%A1%E7%9B%AE%E8%B7%B3%E8%BD%ACNeoDB%E6%9D%A1%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var currentUrl = window.location.href;
    var pattern = /^https?:\/\/m\.douban\.com\/(book|movie|music)\/.*/
    if (pattern.test(currentUrl)) {
    const type = currentUrl.match(pattern)[1]
    if (type == "music") {
      var parentElement = document.querySelector(".title");
    } else {
      var parentElement = document.querySelector(".sub-title");
    }
    var gotoURl =
      "https://neodb.social/search/?q=" +
      encodeURIComponent(
        currentUrl
          .replace("https://m.", "https://" + type + ".")
          .replace("/" + type + "/", "/")
      );
    var newdiv = `<a href="${gotoURl}" style="display: inline-block;margin:0 0 5px 2px;background-color:#d94c3a;font-size:13px;padding:2px;border-radius: 2px;color:#fff;">NeoDB</a>`;
    parentElement.insertAdjacentHTML("afterend", newdiv);
  } else if (
      /^https?:\/\/(book|movie|music)\.douban\.com\/subject\/(\d+)\//.test(
        currentUrl
      )
    ) {
      const bbElement = document.querySelector('#interest_sect_level > a:nth-child(1)')
      const aaElement = document.querySelector('#interest_sect_level > div').lastElementChild;
      function createNeoDB (url){
        var newLink = `
        <a href="${url}" rel="nofollow" class="j a_show_login colbutt ll" name="pbtn-36414402-collect">
        <span style="letter-spacing: 0;
            font-weight: bold;
            font-family: serif;
            font-size: 14px;
            color: #423f38;">
            R-NeoDB
        </span>
        </a>
        `;
        return newLink
      }
      var goUrl = "https://neodb.social/search/?q=" + encodeURIComponent(currentUrl);
      var textContent = ''
      if(bbElement){
        const newLinkElement = new DOMParser().parseFromString(createNeoDB (goUrl), "text/html").body.firstChild
        bbElement.insertAdjacentElement('beforebegin',newLinkElement )
      }else{
          if (aaElement) {
              textContent = aaElement.textContent;
          }
          goUrl ="https://neodb.social/discover/?dbUrl="+encodeURIComponent(currentUrl)+'&myReview='+textContent;
          const newLinkElement = new DOMParser().parseFromString(createNeoDB (goUrl), "text/html").body.firstChild
          var parentElement = document.querySelector('#interest_sect_level')
          var firstChildElement = document.querySelector('#interest_sect_level > :first-child');
          parentElement.insertBefore(newLinkElement,firstChildElement)
      }
    }

    if(currentUrl.startsWith('https://neodb.social/discover/')){
      if(window.location.search){
          const item = new URLSearchParams(window.location.search);
          if (item.has('myReview')) {
              const myReview = item.get('myReview');
              console.log('myreview',myReview)
              localStorage.setItem('myReview',myReview)
             window.location.href = "https://neodb.social/search/?q=" + encodeURIComponent(item.get('dbUrl'));
          }
      }else{
          localStorage.removeItem('myReview')
      }
    }
    if (/^https?:\/\/neodb\.social\/book/.test(currentUrl)) {
      const someButton = document.querySelector('#item-primary-action > div.item-action.item-mark-buttons > button:nth-child(3)')
      if(someButton&&localStorage.getItem('myReview')){
        someButton.click()
        setTimeout(function(){
            const textarea = document.querySelector('#id_text')
            if(textarea){
                textarea.value = localStorage.getItem('myReview')
                localStorage.removeItem('myReview')
            }
        },1500)
      }

      var parentElement = document.querySelector("#item-title .site-list");
      var bookTitle = document.getElementById("item-title").querySelector("h1");
      var bookText = bookTitle.innerText;
      var newLink = `
         <a href="https://zh.annas-archive.org/search?q=${bookText}" class="douban" style='background-color:#ef6a32'>AnnA</a>
        `;
      if (bookTitle) {
        parentElement.insertAdjacentHTML("beforeend", newLink);
      }

    } else if (/^https?:\/\/neodb\.social\/(tv\/season|movie)/.test(currentUrl)) {
      var videoTitle = document.getElementById("item-title").querySelector("h1");
      var parentsElement = document.querySelector("#item-title .site-list");
      var videoText = videoTitle.textContent.trim().replace(/[\(\)]/g, "");
      var newsLink = `
        <a href="https://clmclm.com/search-${videoText}-0-0-1.html" class="douban" style='background-color:#061c12'>CaT</a>
        <a href="https://www.alipansou.com/search?k=${videoText}" class="douban" style='background-color:#7f93fa'>Ali</a>
      `;
      if (videoTitle && parentsElement) {
        parentsElement.insertAdjacentHTML("beforeend", newsLink);
      }
    }
  })();