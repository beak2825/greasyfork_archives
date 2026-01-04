// ==UserScript==
// @name         Reddit Enhancement
// @name:zh-CN   Reddit 增强
// @name:zh-TW   Reddit 增強
// @name:ja      Reddit 拡張
// @name:ko      Reddit 개선
// @name:fr      Amélioration de Reddit
// @name:de      Reddit-Erweiterung
// @name:es      Mejora de Reddit
// @name:ru      Улучшение Reddit
// @name:ar      تحسين Reddit
// @name:pt      Aprimoramento do Reddit
// @name:it      Miglioramento di Reddit
// @name:pl      Ulepszenie Reddita
// @name:nl      Reddit Verbetering
// @name:sv      Reddit-förbättring
// @name:no      Reddit-forbedring
// @name:da      Reddit-forbedring
// @name:fi      Reddit-parannus
// @name:cs      Vylepšení Redditu
// @name:sk      Vylepšenie Redditu
// @name:hu      Reddit fejlesztés
// @name:tr      Reddit Geliştirmesi
// @name:uk      Покращення Reddit
// @name:bg      Подобрение за Reddit
// @name:el      Βελτίωση του Reddit
// @name:he      שיפור Reddit
// @name:hi      Reddit संवर्धन
// @name:vi      Tăng Cường Reddit
// @name:id      Peningkatan Reddit
// @name:ms      Penambahbaikan Reddit
// @name:ro      Îmbunătățire Reddit
// @name:fa      بهبود Reddit
// @description  Removes the promotion element and the "We had a server error..." banner
// @description:en Removes the promotion element and the "We had a server error..." banner
// @description:zh-CN 移除推广元素和"我们遇到服务器错误..."横幅
// @description:zh-TW 移除推廣元素和"我們遇到伺服器錯誤..."橫幅
// @description:ja プロモーション要素と"サーバーエラーが発生しました..."バナーを削除
// @description:ko 프로모션 요소와 "서버 오류가 발생했습니다..." 배너 제거
// @description:fr Supprime l'élément promotionnel et la bannière "Nous avons rencontré une erreur serveur..."
// @description:de Entfernt das Werbeelement und das "Wir hatten einen Serverfehler..."-Banner
// @description:es Elimina el elemento promocional y el banner "Tuvimos un error del servidor..."
// @description:ru Удаляет рекламный элемент и баннер "У нас возникла ошибка сервера..."
// @description:ar يزيل العنصر الترويجي وشعار "لقد واجهنا خطأ في الخادم..."
// @description:pt Remove o elemento promocional e a faixa "Tivemos um erro de servidor..."
// @description:it Rimuove l'elemento promozionale e il banner "Abbiamo riscontrato un errore del server..."
// @description:pl Usuwa element promocyjny i baner "Wystąpił błąd serwera..."
// @description:nl Verwijdert het promotie-element en de banner "We hadden een serverfout..."
// @description:sv Tar bort reklamelementet och bannern "Vi fick ett serverfel..."
// @description:no Fjerner reklameelementet og banneret "Vi fikk en serverfeil..."
// @description:da Fjerner reklameelementet og banneret "Vi fik en serverfejl..."
// @description:fi Poistaa mainoselementin ja bannerin "Kohtasimme palvelinvirheen..."
// @description:cs Odstraňuje propagační prvek a banner "Narazili jsme na chybu serveru..."
// @description:sk Odstraňuje propagačný prvok a banner "Narazili sme na chybu servera..."
// @description:hu Eltávolítja a promóciós elemet és a "Szerverhibát észleltünk..." szalagcímet
// @description:tr Tanıtım öğesini ve "Sunucu hatasıyla karşılaştık..." afişini kaldırır
// @description:uk Видаляє промо-елемент і банер "Ми зіткнулися з помилкою сервера..."
// @description:bg Премахва промоционалния елемент и банера "Получихме грешка на сървъра..."
// @description:el Αφαιρεί το προωθητικό στοιχείο και το πανό "Αντιμετωπίσαμε σφάλμα διακομιστή..."
// @description:he מסיר את רכיב הקידום ואת הכרזה "נתקלנו בשגיאת שרת..."
// @description:hi प्रचार तत्व और "हमें सर्वर त्रुटि मिली..." बैनर हटाता है
// @description:vi Xóa phần khuyến mại và biểu ngữ "Chúng tôi gặp lỗi máy chủ..."
// @description:id Menghapus elemen promosi dan banner "Kami mengalami kesalahan server..."
// @description:ms Menghapus elemen promosi dan banner "Kami menghadapi ralat pelayan..."
// @description:ro Elimină elementul promoțional și bannerul "Am întâmpinat o eroare de server..."
// @description:fa عنصر تبلیغاتی و بنر «با خطای سرور مواجه شدیم...» را حذف می‌کند
// @author       aspen138
// @namespace    http://tampermonkey.net/
// @version      1.0.11
// @match        *://www.reddit.com/*
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAQlBMVEVHcEz/RQD/RQD/QgD/RQD/RQD/RQD/RQD/RQD/RQD/////MgD/OgD/s5//z8P/a0T/5d3/VyH/iGr/qJP/mYD/+vcCA1U1AAAACnRSTlMAJP//y5WUn+ElsgVe0gAAAJFJREFUGJVtT1sOwyAMy0JpIa/C2t3/qjNQaT+zkMAmD5sIqLkwl1zpwcEPjsW3ScxMefv9m7u3WVNXdXJ9Q+BKGYRN+62miXmnMvg7WotT8SzE6ZQHHzkTL+HuIv2SKRTWkHCRC5eiJWOCSJvnNgzFWrtQ4iGuY+0wZt0jHFuWeVhPpmpwsf0PR/TaR/x9xv8CYoYGnu4Mr1kAAAAASUVORK5CYII=
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490614/Reddit%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/490614/Reddit%20Enhancement.meta.js
// ==/UserScript==





//===== hide promotion element and banner =====
(function() {
    'use strict';

    // Searches through all Shadow DOM roots
    function deepQuerySelectorAll(selector) {
        const nodes = [];
        function searchInNode(node) {
            if (node.shadowRoot) {
                const matches = node.shadowRoot.querySelectorAll(selector);
                if (matches.length > 0) {
                    nodes.push(...matches);
                }
                Array.from(node.shadowRoot.children).forEach(searchInNode);
            }
            Array.from(node.children).forEach(searchInNode);
        }
        searchInNode(document);
        return nodes;
    }

    // Combined removal function for both error banners and promo elements
    function removeElements() {
        // --- Remove alert-controller and banner-controller at the top level ---
        const alertControllers = document.querySelectorAll('alert-controller[aria-live="polite"]');
        alertControllers.forEach(ctrl => {
            ctrl.style.display = 'none';
            console.log('[Cleaner] Alert controller hidden');
        });

        const bannerControllers = document.querySelectorAll('banner-controller');
        bannerControllers.forEach(ctrl => {
            ctrl.style.display = 'none';
            console.log('[Cleaner] Banner controller hidden');
        });

        // --- Remove faceplate-banner through shadow DOM ---
        const faceplates = deepQuerySelectorAll('faceplate-banner');
        faceplates.forEach(banner => {
            banner.style.display = 'none';
            console.log('[Cleaner] Faceplate banner hidden via shadow DOM');
        });

        // --- Remove classic banners ---
        const oldBanners = deepQuerySelectorAll('div.banner.error');
        oldBanners.forEach(banner => {
            banner.remove();
            console.log('[Cleaner] Old error banner removed');
        });

        // --- Remove error divs inside shadow roots ---
        const errorDivs = deepQuerySelectorAll('div[role="banner"][class*="banner error"]');
        errorDivs.forEach(div => {
            div.style.display = 'none';
            console.log('[Cleaner] Error banner div hidden');
        });

        // --- Remove promotional elements ---
        const promoSelectors = [
            'a.w-100.block.h-100.cursor-pointer',
            'shreddit-ad-post.promotedlink',
            'shreddit-dynamic-ad-link',
            'shreddit-comments-page-ad.promotedlink'
        ];

        promoSelectors.forEach(selector => {
            const promoElements = document.querySelectorAll(selector);
            promoElements.forEach(element => {
                element.remove();
                console.log('[Cleaner] Promotion element removed:', selector);
            });
        });

        // --- Hide sponsored links ---
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.getAttribute('rel') === 'noopener nofollow sponsored') {
                link.style.display = 'none';
                console.log('[Cleaner] Sponsored link hidden');
            }
        });

        // --- Hide specific immersive translate elements ---
        const immersiveElements = deepQuerySelectorAll('div[data-immersive-translate-walked="de111be1-6c63-482a-9f03-7fc8d0ca3ba2"]');
        immersiveElements.forEach(element => {
            element.style.display = 'none';
            console.log('[Cleaner] Immersive translate element hidden');
        });
    }

    // Single MutationObserver for all operations
    const observer = new MutationObserver(() => {
        removeElements();
    });

    observer.observe(document, { childList: true, subtree: true });

    if (document.readyState === 'loading') {
        window.addEventListener('load', removeElements);
    } else {
        removeElements();
    }

    // Run immediately
    removeElements();
})();
