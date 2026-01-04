// ==UserScript==
// @name         日本語版Quora用、自動でもっと読むクリック+回答初期並び順変更
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  日本語版Quoraで質問をクリックしたときに、並び順を最新にします。また、スクロール時にもっと読むを自動クリックします。
// @match        https://jp.quora.com/*
// @author       Fujio Nakazono
// @grant        none
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/487057/%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88Quora%E7%94%A8%E3%80%81%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%82%E3%81%A3%E3%81%A8%E8%AA%AD%E3%82%80%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%2B%E5%9B%9E%E7%AD%94%E5%88%9D%E6%9C%9F%E4%B8%A6%E3%81%B3%E9%A0%86%E5%A4%89%E6%9B%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/487057/%E6%97%A5%E6%9C%AC%E8%AA%9E%E7%89%88Quora%E7%94%A8%E3%80%81%E8%87%AA%E5%8B%95%E3%81%A7%E3%82%82%E3%81%A3%E3%81%A8%E8%AA%AD%E3%82%80%E3%82%AF%E3%83%AA%E3%83%83%E3%82%AF%2B%E5%9B%9E%E7%AD%94%E5%88%9D%E6%9C%9F%E4%B8%A6%E3%81%B3%E9%A0%86%E5%A4%89%E6%9B%B4.meta.js
// ==/UserScript==

// スクロール時に「もっと読む」を自動クリック
window.onscroll = function() {
  [...document.querySelectorAll('*')].filter(e => e.textContent.trim() == '(もっと読む)')
                                     .map(e => e.click());
};

// インターバルを設定して「おすすめ」ー＞「最新」を自動クリック
let timer = setInterval(() => {
  [...document.querySelectorAll('*')].filter(e => e.textContent.trim() == 'おすすめ')
                                     .map(e => {
                                        e.click();
                                        // 「最新」を自動クリックし、その後タイマーをクリア
                                        [...document.querySelectorAll('*')].filter(e => e.textContent.trim() == '最新')
                                                                           .map(e => {
                                                                               e.click();
                                                                               clearInterval(timer);
                                                                           });
                                     });
}, 1000);
