// ==UserScript==
// @name         Yandex mail Advertisement Remover
// @description  Remove advertisement at Yandex mail
// @name:ar          مزيل إعلانات ياندكس ميل
// @description:ar   إزالة الإعلانات في ياندكس ميل
// @name:bg          Премахване на реклами в Yandex Mail
// @description:bg   Премахване на реклами в Yandex Mail.
// @name:cs          Odstraňovač reklam v Yandex Mailu
// @description:cs   Odstraní reklamy v Yandex Mailu
// @name:da          Yandex Mail Reklamefjerner
// @description:da   Fjerner reklamer i Yandex Mail
// @name:de          Yandex Mail Werbeentferner
// @description:de   Entfernt Werbung in Yandex Mail
// @name:el          Αφαίρεση διαφημίσεων Yandex Mail
// @description:el   Αφαιρεί διαφημίσεις στο Yandex Mail
// @name:en          Yandex Mail Advertisement Remover
// @description:en   Remove advertisement at Yandex mail
// @name:eo          Yandex Mail Reklamforigardilo
// @description:eo   Forigas reklamojn en Yandex Mail
// @name:es          Eliminador de publicidad de Yandex Mail
// @description:es   Elimina la publicidad en Yandex Mail
// @name:fi          Yandex Mail -mainosten poistaja
// @description:fi   Poistaa mainokset Yandex Mailista
// @name:fr          Suppresseur de publicité Yandex Mail
// @description:fr   Supprime la publicité dans Yandex Mail
// @name:fr-CA       Suppresseur de publicité Yandex Mail
// @description:fr-CA Supprime la publicité dans Yandex Mail
// @name:he          מסיר פרסומות של Yandex Mail
// @description:he   מסיר פרסומות ב-Yandex Mail
// @name:hr          Uklanjanje oglasa Yandex Maila
// @description:hr   Uklanja oglase na Yandex Mailu
// @name:hu          Yandex Mail hirdetéseltávolító
// @description:hu   Eltávolítja a hirdetéseket a Yandex Mailben
// @name:id          Penghilang Iklan Yandex Mail
// @description:id   Menghilangkan iklan di Yandex Mail
// @name:it          Rimozione pubblicità Yandex Mail
// @description:it   Rimuove la pubblicità in Yandex Mail
// @name:ja          Yandex Mail広告リムーバー
// @description:ja   Yandex Mailの広告を削除します
// @name:ka          Yandex Mail-ის რეკლამის ამომშლელი
// @description:ka   აშორებს რეკლამას Yandex Mail-ში
// @name:ko          Yandex 메일 광고 제거기
// @description:ko   Yandex 메일의 광고를 제거합니다.
// @name:nb          Yandex Mail Reklamefjerner
// @description:nb   Fjerner reklame i Yandex Mail
// @name:nl          Yandex Mail Advertentie Verwijderaar
// @description:nl   Verwijdert advertenties in Yandex Mail
// @name:pl          Usuwanie reklam z Yandex Mail
// @description:pl   Usuwa reklamy w Yandex Mail
// @name:pt-BR       Removedor de Anúncios do Yandex Mail
// @description:pt-BR Remove anúncios no Yandex Mail
// @name:ro          Eliminator de reclame Yandex Mail
// @description:ro   Elimină reclamele din Yandex Mail
// @name:ru          Удаление рекламы в Яндекс Почте
// @description:ru   Удаляет рекламу в Яндекс Почте
// @name:sk          Odstraňovač reklám Yandex Mail
// @description:sk   Odstráni reklamy v Yandex Mail
// @name:sr          Уклањање реклама са Yандекс Маила
// @description:sr   Уклања рекламе са Yандекс Маила
// @name:sv          Yandex Mail Annonsborttagare
// @description:sv   Tar bort annonser i Yandex Mail
// @name:th          ตัวลบโฆษณา Yandex Mail
// @description:th   ลบโฆษณาใน Yandex Mail
// @name:tr          Yandex Mail Reklam Kaldırıcı
// @description:tr   Yandex Mail'deki reklamları kaldırır
// @name:ug          Yandex почта ئېلان ئۆچۈرگۈچ
// @description:ug   Yandex почта دىكى ئېلاننى ئۆچۈرۋېتىدۇ
// @name:uk          Видалення реклами в Yandex Mail
// @description:uk   Видаляє рекламу в Yandex Mail
// @name:vi          Trình xóa quảng cáo Yandex Mail
// @description:vi   Xóa quảng cáo trong Yandex Mail
// @name:zh          Yandex 邮件广告移除器
// @description:zh   移除 Yandex 邮件中的广告
// @name:zh-CN       Yandex 邮件广告移除器
// @description:zh-CN 移除 Yandex 邮件中的广告
// @name:zh-HK       Yandex 邮件广告移除器
// @description:zh-HK 移除 Yandex 邮件中的广告
// @name:zh-SG       Yandex 邮件广告移除器
// @description:zh-SG 移除 Yandex 邮件中的广告
// @name:zh-TW       Yandex 邮件广告移除器
// @description:zh-TW 移除 Yandex 邮件中的广告
// @version      0.0.2
// @author       aspen138
// @match        http*://mail.yandex.ru/*
// @match        https://mail.yandex.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @license      MIT
// @icon   data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAPVJREFUOBHFULsOgkAQXOCw0uMrjIUfYGOjlS8STXzEzi/xmyz0w7QyiuIMhzm4gqCJcZM9dm9nZocT+Xd46b6Xyin5zscivCqZKBEP/OOHIstQZBjc/Gz1GCJTZN0geRBkaCPAkk5mNUSWwORk0qwAOzqJK0RWJJfn5Y4iI1wFeJTDnZ2NLWz3jW176TrgBDhZN0Q2yHfsUMcYUNiJsgMFQBN/RdwchDZqIjr5Zo36koo8rIoV8AFugVlc0nUsexhq3J2h8DQi5hF5Rsgi2S4pV8REEDHM/KPRUb1uEEonCCWRSiRIHa/ZrPogQ/uFl66G/276AufFGp4pjOgzAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/532778/Yandex%20mail%20Advertisement%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/532778/Yandex%20mail%20Advertisement%20Remover.meta.js
// ==/UserScript==



(function() {
    'use strict';

    const observerConfig = { childList: true, subtree: true, attributes: true };
    const allowedViewValues = new Set(['notifications', 'labels', 'footer', 'app']);
    const allowedLayoutDataKeys = new Set([
        'box=fake-head-background-box',
        'box=toolbar-box',
        'box=infoline-box',
        'box=right-box',
        'box=advanced-search-box'
    ]);

    let observer = null;
    let isProcessing = false;

    const cleanupTasks = [
        hideMessageListBanners,
        hideViewPortals,
        hideDisableAdsButtons,
        removeLeftColumnAdPane,
        pruneMailLayoutContent,
        hideBannerBlocks,
        hideAdElement,
    ];

    function processDom() {
        if (isProcessing) {
            return;
        }

        isProcessing = true;

        try {
            for (const task of cleanupTasks) {
                task();
            }
        } finally {
            isProcessing = false;
        }
    }

    function ensureObserver() {
        if (observer || !document.body) {
            return;
        }

        observer = new MutationObserver(processDom);
        observer.observe(document.body, observerConfig);
    }

    function hideElement(element) {
        if (!element || element.nodeType !== Node.ELEMENT_NODE) {
            return false;
        }

        if (element.style.display === 'none') {
            return false;
        }

        element.style.display = 'none';
        return true;
    }

    function removeElement(element) {
        if (!element || !element.remove || !element.isConnected) {
            return false;
        }

        element.remove();
        return true;
    }

    function nextElementSibling(node) {
        if (!node) {
            return null;
        }

        let sibling = node.nextSibling;
        while (sibling) {
            if (sibling.nodeType === Node.ELEMENT_NODE) {
                return sibling;
            }

            sibling = sibling.nextSibling;
        }

        return null;
    }

    function hideMessageListBanners() {
        document.querySelectorAll('[class="message-list-banner-portal"]').forEach((portal) => {
            const banner = nextElementSibling(portal);
            hideElement(banner);
        });
    }

    function hideViewPortals() {
        document.querySelectorAll('[data-key^="view="]').forEach((element) => {
            const key = element.dataset ? element.dataset.key : undefined;
            if (!key) {
                return;
            }

            const matches = key.match(/^view=([a-z]+)$/);
            if (!matches) {
                return;
            }

            const view = matches[1];
            if (allowedViewValues.has(view)) {
                return;
            }

            hideElement(element);
        });
    }

    function hideDisableAdsButtons() {
        document.querySelectorAll('a[class*="DisableAdsButton"]').forEach((element) => {
            hideElement(element);
        });
    }

    function removeLeftColumnAdPane() {
        const leftColumn = document.querySelector('.ns-view-react-left-column');
        if (!leftColumn) {
            return;
        }

        const adPane = nextElementSibling(leftColumn);
        removeElement(adPane);
    }

    function pruneMailLayoutContent() {
        const layout = document.querySelector('.mail-Layout-Content');
        if (!layout) {
            return;
        }

        Array.from(layout.children).forEach((child) => {
            const dataKey = child.getAttribute('data-key');
            if (!dataKey) {
                return;
            }

            if (!allowedLayoutDataKeys.has(dataKey)) {
                removeElement(child);
            }
        });
    }

    function hideBannerBlocks() {
        document.querySelectorAll('.BannersBlock').forEach((block) => {
            if (!hideElement(block.parentElement)) {
                hideElement(block);
            }
        });
    }

    function hideAdElement() {
        const adContainer = document.querySelector('.mtASX4sMdaVI41xsJ');
        if (adContainer) {
            const shadowRoot = adContainer.shadowRoot || adContainer.attachShadow({ mode: 'open' });
            const adElement = shadowRoot.querySelector('.w35dbb536');
            if(adElement){
                hideElement(adElement.parentElement);
            }
        }
    }

    function bootstrap() {
        processDom();
        ensureObserver();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
    } else {
        bootstrap();
    }
})();


