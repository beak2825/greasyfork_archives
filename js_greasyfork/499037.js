// ==UserScript==
// @name         soupstock.in Türkçe Çeviri
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  soupstock.in sitesindeki belirli kelimeleri Türkçeye çevirir
// @author       ChatGPT
// @match        https://www.soupstock.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499037/soupstockin%20T%C3%BCrk%C3%A7e%20%C3%87eviri.user.js
// @updateURL https://update.greasyfork.org/scripts/499037/soupstockin%20T%C3%BCrk%C3%A7e%20%C3%87eviri.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Çevirilecek kelimeler ve karşılıkları
    const translations = {
        "What are you looking for?": "Ne aramıştınız...",
"Aspect": "Yön",
"All orientations": "Tüm Yönler",
"Horizontal": "Yatay",
"Square": "Kare",
"Vertical": "Dikey",
"People": "İnsanlar",
"All": "Tümü",
"Include": "Dahil Et",
"Exclude": "Hariç Tut",
"People": "İnsan",
"Sort": "Sırala",
"Most relevant": "En İlgili",
"Fresh content": "Yeni İçerik",
"Recently indexed": "Yakın Zamanda İndekslenmiş",
"Relevant": "İlgili",
"Recent": "Yakın Zamanlı"
    };

    // Tüm metin düğümlerini bul
    function translateText(node) {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
        let textNode;

        while (textNode = walker.nextNode()) {
            const text = textNode.nodeValue;
            for (const [key, value] of Object.entries(translations)) {
                const regex = new RegExp(`\\b${key}\\b`, 'gi');
                textNode.nodeValue = textNode.nodeValue.replace(regex, value);
            }
        }
    }

    // Sayfadaki tüm metinleri çevir
    function translatePage() {
        translateText(document.body);
    }

    // Sayfa yüklendiğinde çeviri işlemini başlat
    window.addEventListener('load', translatePage);
})();
