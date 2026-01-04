// ==UserScript==
// @name         DMM電子書籍 規制画像自動置換
// @author       gochi_AI
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  規制画像を正規画像に置換する
// @match        https://book.dmm.co.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543992/DMM%E9%9B%BB%E5%AD%90%E6%9B%B8%E7%B1%8D%20%E8%A6%8F%E5%88%B6%E7%94%BB%E5%83%8F%E8%87%AA%E5%8B%95%E7%BD%AE%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/543992/DMM%E9%9B%BB%E5%AD%90%E6%9B%B8%E7%B1%8D%20%E8%A6%8F%E5%88%B6%E7%94%BB%E5%83%8F%E8%87%AA%E5%8B%95%E7%BD%AE%E6%8F%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const REGULATION_IMG = "https://ebook-assets.dmm.co.jp/digital/nijigen/regulation_book_ps.webp";
    const imageCache = new Map();

    async function replaceImg(img) {
        if (img.dataset.replaced) return;
        img.dataset.replaced = "1";
        const aTag = img.closest('a[href]');
        if (!aTag) return;
        const href = aTag.href;
        const parts = href.split('/');
        if (parts.length < 2) return;
        const s_id = parts[parts.length - 2];
        if (!s_id) return;

        if (imageCache.has(s_id)) {
            img.src = imageCache.get(s_id);
            return;
        }

        try {
            const url = `https://book.dmm.co.jp/ajax/bff/content/?shop_name=adult&content_id=${s_id}`;
            const res = await fetch(url);
            if (!res.ok) return;
            const data = await res.json();
            if (data?.image_urls?.pl) {
                imageCache.set(s_id, data.image_urls.pl);
                img.src = data.image_urls.pl;
            }
        } catch (e) {
            // エラーは無視
        }
    }

    function replaceAll() {
        document.querySelectorAll(`img[src="${REGULATION_IMG}"]`).forEach(replaceImg);
        removeSpecialImages(); // ← ここで呼び出し
    }

    // 追加部分
function removeSpecialImages() {
    document.querySelectorAll('div.css-1qwclz6').forEach(div => {
        let parent = div;
        // 6階層上の親要素をたどる
        for (let i = 0; i < 6; i++) {
            if (parent) parent = parent.parentElement;
        }
        // その要素がliなら削除
        if (parent && parent.tagName === 'LI') {
            parent.remove();
        }
    });
}


    const observer = new MutationObserver(() => {
        replaceAll();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    replaceAll();
    window.addEventListener('scroll', replaceAll);
})();

