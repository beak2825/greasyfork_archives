// ==UserScript==
// @name         Hide Promotion Advertisement at Codewars Site
// @description  Remove certain elements from the page
// @name:ar      إخفاء الإعلانات الترويجية في موقع Codewars
// @description:ar  إزالة عناصر معينة من الصفحة
// @name:bg      Скриване на промоционални реклами в сайта Codewars
// @description:bg  Премахване на определени елементи от страницата
// @name:cs      Skrýt propagační reklamy na webu Codewars
// @description:cs  Odstranit určité prvky ze stránky
// @name:da      Skjul reklamefremstød på Codewars-siden
// @description:da  Fjern visse elementer fra siden
// @name:de      Werbeaktionen auf der Codewars-Seite ausblenden
// @description:de  Bestimmte Elemente von der Seite entfernen
// @name:el      Απόκρυψη διαφημίσεων προώθησης στον ιστότοπο Codewars
// @description:el  Αφαίρεση συγκεκριμένων στοιχείων από τη σελίδα
// @name:en      Hide Promotion Advertisement at Codewars Site
// @description:en  Remove certain elements from the page
// @name:eo      Kaŝi Promociajn Reklamojn en la Retejo Codewars
// @description:eo  Forigi certajn elementojn de la paĝo
// @name:es      Ocultar anuncios promocionales en el sitio Codewars
// @description:es  Eliminar ciertos elementos de la página
// @name:fi      Piilota mainoskampanjat Codewars-sivustolla
// @description:fi  Poista tietyt elementit sivulta
// @name:fr      Masquer les publicités promotionnelles sur le site Codewars
// @description:fr  Supprimer certains éléments de la page
// @name:fr-CA   Cacher les publicités promotionnelles sur le site Codewars
// @description:fr-CA  Retirer certains éléments de la page
// @name:he      הסתר פרסומות קידום באתר Codewars
// @description:he  הסר אלמנטים מסוימים מהדף
// @name:hr      Sakrij promotivne oglase na stranici Codewars
// @description:hr  Ukloni određene elemente sa stranice
// @name:hu      Promóciós hirdetések elrejtése a Codewars oldalon
// @description:hu  Bizonyos elemek eltávolítása az oldalról
// @name:id      Sembunyikan Iklan Promosi di Situs Codewars
// @description:id  Hapus elemen tertentu dari halaman
// @name:it      Nascondi annunci promozionali sul sito Codewars
// @description:it  Rimuovi alcuni elementi dalla pagina
// @name:ja      Codewarsサイトのプロモーション広告を非表示
// @description:ja  ページから特定の要素を削除
// @name:ka      Codewars-ის საიტზე სარეკლამო ხელშეწყობის დამალვა
// @description:ka  გვერდიდან გარკვეული ელემენტების წაშლა
// @name:ko      Codewars 사이트에서 프로모션 광고 숨기기
// @description:ko  페이지에서 특정 요소 제거
// @name:nb      Skjul reklamefremstøt på Codewars-siden
// @description:nb  Fjern visse elementer fra siden
// @name:nl      Verberg promotieadvertenties op de Codewars-site
// @description:nl  Verwijder bepaalde elementen van de pagina
// @name:pl      Ukryj reklamy promocyjne na stronie Codewars
// @description:pl  Usuń niektóre elementy ze strony
// @name:pt-BR   Ocultar anúncios promocionais no site Codewars
// @description:pt-BR  Remover certos elementos da página
// @name:ro      Ascunde reclamele promoționale pe site-ul Codewars
// @description:ro  Elimină anumite elemente de pe pagină
// @name:ru      Скрыть рекламные акции на сайте Codewars
// @description:ru  Удалить определённые элементы со страницы
// @name:sk      Skryť propagačné reklamy na stránke Codewars
// @description:sk  Odstrániť určité prvky zo stránky
// @name:sr      Сакриј промотивне огласе на сајту Codewars
// @description:sr  Уклони одређене елементе са странице
// @name:sv      Dölj reklamkampanjer på Codewars-sidan
// @description:sv  Ta bort vissa element från sidan
// @name:th      ซ่อนโฆษณาโปรโมชั่นที่เว็บไซต์ Codewars
// @description:th  ลบองค์ประกอบบางอย่างออกจากหน้า
// @name:tr      Codewars Sitesinde Tanıtım Reklamlarını Gizle
// @description:tr  Sayfadan belirli öğeleri kaldır
// @name:ug      Codewars تور بېتىدىكى تەشۋىقات ئېلانلىرىنى يوشۇر
// @description:ug  بەتتىن بەزى ئېلېمېنتلارنى چىقىرىۋەت
// @name:uk      Приховати рекламні акції на сайті Codewars
// @description:uk  Видалити певні елементи зі сторінки
// @name:vi      Ẩn quảng cáo khuyến mãi trên trang Codewars
// @description:vi  Xóa một số yếu tố khỏi trang
// @name:zh      隐藏Codewars网站上的促销广告
// @description:zh  从页面中移除某些元素
// @name:zh-CN   隐藏Codewars网站上的促销广告
// @description:zh-CN  从页面中移除某些元素
// @name:zh-HK   隱藏Codewars網站嘅推廣廣告
// @description:zh-HK  從頁面移除某些元素
// @name:zh-SG   隐藏Codewars网站上的促销广告
// @description:zh-SG  从页面中移除某些元素
// @name:zh-TW   隱藏Codewars網站上的促銷廣告
// @description:zh-TW  從頁面中移除某些元素
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       aspen138
// @match        *://*.codewars.com/kata/*
// @icon         https://www.google.com/s2/favicons?domain=codewars.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504357/Hide%20Promotion%20Advertisement%20at%20Codewars%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/504357/Hide%20Promotion%20Advertisement%20at%20Codewars%20Site.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Function to remove elements and adjust styles
    function adjustElements() {
        const descriptionFooter = document.querySelector('.description-footer');
        const partnerDisplay = document.getElementById('partner-display');
        const textCenter = document.querySelector('.text-center');
        const bonusPointsHeader = document.getElementById('bonus-points-not-really-but-just-for-fun');
        const descriptionFullHeight = document.querySelector('.description.h-full');
        const descriptionContent = descriptionFullHeight ? descriptionFullHeight.querySelector('.description-content') : null;

        if (descriptionFooter) {
            descriptionFooter.remove();
        }

        if (partnerDisplay) {
            partnerDisplay.remove();
        }

        if (textCenter) {
            textCenter.remove();
        }

        if (bonusPointsHeader) {
            bonusPointsHeader.remove();
        }

        if (descriptionContent) {
            descriptionContent.style.height = '100%';
            descriptionContent.style.display = 'flex';
            descriptionContent.style.flexDirection = 'column';
        }
    }

    // Initial adjustment
    adjustElements();

    // Listen for URL changes
    window.addEventListener('popstate', adjustElements);
    window.addEventListener('hashchange', adjustElements);

    // Observe DOM changes
    const observer = new MutationObserver(() => {
        adjustElements();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Reapply adjustments every 5 seconds
    setInterval(adjustElements, 5000);

})();


