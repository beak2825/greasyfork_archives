// ==UserScript==
// @name              隐藏知乎网页中的知乎直答外链
// @name:en           Remove Zhida Link and ZDI--FourPointedStar at Zhihu Site
// @name:zh-TW        隱藏知乎網頁中的知乎直答外鏈
// @name:ja           知乎のウェブページ上の知乎直答の外部リンクを非表示
// @name:ko           Zhihu 웹 페이지의 Zhihu 직답 외부 링크 숨기기
// @name:fr           Masquer les liens externes de Zhihu Zhida sur le site de Zhihu
// @name:de           Externe Zhihu Zhida-Links auf der Zhihu-Website ausblenden
// @name:es           Ocultar enlaces externos de Zhihu Zhida en el sitio de Zhihu
// @name:ru           Скрыть внешние ссылки Zhihu Zhida на сайте Zhihu
// @name:ar           إخفاء روابط Zhihu Zhida الخارجية على موقع Zhihu
// @name:pt           Ocultar links externos do Zhihu Zhida no site do Zhihu
// @name:it           Nascondi i link esterni di Zhihu Zhida sul sito di Zhihu
// @description       隐藏知乎网页中的知乎直答外链，并且去掉✦角标
// @description:en    Replace specific links with text-only spans, remove ✦ superscript, too.
// @description:zh-TW 隱藏知乎網頁中的知乎直答外鏈，並且去掉✦角標
// @description:ja    知乎のウェブページ上の知乎直答の外部リンクを非表示にし、✦の上付き文字も削除
// @description:ko    Zhihu 웹 페이지의 Zhihu 직답 외부 링크를 숨기고 ✦ 위첨자도 제거
// @description:fr    Masquer les liens externes de Zhihu Zhida sur la page web de Zhihu et supprimer le symbole ✦ en exposant
// @description:de    Externe Zhihu Zhida-Links auf der Webseite ausblenden und das ✦-Hochgestellte entfernen
// @description:es    Ocultar enlaces externos de Zhihu Zhida en la página web y eliminar el subíndice ✦
// @description:ru    Скрыть внешние ссылки Zhihu Zhida на веб-странице и удалить надстрочный знак ✦
// @description:ar    إخفاء روابط Zhihu Zhida الخارجية على صفحة الويب وإزالة الرمز المرتفع ✦
// @description:pt    Ocultar links externos do Zhihu Zhida na página da web e remover o sobrescrito ✦
// @description:it    Nascondere i link esterni di Zhihu Zhida sulla pagina web e rimuovere il simbolo in apice ✦
// @icon         data:image/png;base64,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
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @author       aspen138
// @match        *://www.zhihu.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510591/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/510591/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%9A%84%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==


// test case:
// 有哪些历史上著名的合影？ - 施耐泽的回答 - 知乎 https://www.zhihu.com/question/23674814/answer/25403040


(function() {
    'use strict';

    // Function to process both links and SVGs
    function processNode(node) {
        const links = node.querySelectorAll('a.RichContent-EntityWord');
        links.forEach(link => {
            if (link.dataset.modified) return; // Skip already processed links
            let keyword = link.textContent;
            if (keyword) {
                let newUrl = `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(keyword)}`;
                link.href = newUrl;
                link.innerHTML = keyword; // Remove any icons
                link.dataset.modified = "true"; // Mark as modified
            }
        });
    }

    // Initial processing on page load
    processNode(document);

    // MutationObserver to detect and process newly added content
    const observer = new MutationObserver(() => {
        processNode(document);
    });

    // Start observing the document for child node changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Set interval to process nodes every 15 seconds
    setInterval(() => {
        processNode(document);
    }, 15000); // 15000ms = 15 seconds

})();




