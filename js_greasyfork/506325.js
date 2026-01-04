// ==UserScript==
// @name         Remove Ads in Tieba
// @description  Remove advertisement elements using wildcard
// @name:zh-CN   移除百度贴吧里的广告
// @description:zh-CN  移除百度贴吧里的广告。
// @name:ar      إزالة الإعلانات في تيبا
// @description:ar  إزالة عناصر الإعلانات باستخدام الرمز العام
// @name:bg      Премахване на реклами в Tieba
// @description:bg  Премахване на рекламни елементи с помощта на уайлдкард
// @name:cs      Odstranění reklam v Tieba
// @description:cs  Odstranění reklamních prvků pomocí zástupného znaku
// @name:da      Fjern annoncer i Tieba
// @description:da  Fjern annonceelementer ved hjælp af jokertegn
// @name:de      Werbung in Tieba entfernen
// @description:de  Entfernen von Werbeelementen mit Platzhaltern
// @name:el      Αφαίρεση διαφημίσεων στο Tieba
// @description:el  Αφαίρεση διαφημιστικών στοιχείων με χρήση μπαλαντέρ
// @name:en      Remove Ads in Tieba
// @description:en  Remove advertisement elements using wildcard
// @name:eo      Forigi Reklamojn en Tieba
// @description:eo  Forigi reklamajn elementojn per sovaĝa karto
// @name:es      Eliminar anuncios en Tieba
// @description:es  Eliminar elementos publicitarios usando comodines
// @name:fi      Poista mainokset Tiebasta
// @description:fi  Poista mainoselementit käyttämällä jokerimerkkiä
// @name:fr      Supprimer les publicités dans Tieba
// @description:fr  Supprimer les éléments publicitaires avec un caractère générique
// @name:fr-CA   Supprimer les annonces dans Tieba
// @description:fr-CA  Supprimer les éléments publicitaires à l’aide d’un caractère générique
// @name:he      הסרת פרסומות ב-Tieba
// @description:he  הסרת אלמנטים פרסומיים באמצעות תו כללי
// @name:hr      Ukloni oglase u Tieba
// @description:hr  Ukloni elemente oglasa koristeći džoker znak
// @name:hu      Hirdetések eltávolítása a Tiebában
// @description:hu  Hirdetési elemek eltávolítása helyettesítő karakterrel
// @name:id      Hapus Iklan di Tieba
// @description:id  Hapus elemen iklan menggunakan wildcard
// @name:it      Rimuovi annunci in Tieba
// @description:it  Rimuovi elementi pubblicitari usando caratteri jolly
// @name:ja      Tiebaの広告を削除
// @description:ja  ワイルドカードを使用して広告要素を削除
// @name:ka      Tieba-ში რეკლამების წაშლა
// @description:ka  რეკლამის ელემენტების წაშლა ჯოკერის გამოყენებით
// @name:ko      Tieba에서 광고 제거
// @description:ko  와일드카드를 사용하여 광고 요소 제거
// @name:nb      Fjern annonser i Tieba
// @description:nb  Fjern annonseelementer ved hjelp av jokertegn
// @name:nl      Advertenties verwijderen in Tieba
// @description:nl  Advertentie-elementen verwijderen met een wildcard
// @name:pl      Usuń reklamy w Tieba
// @description:pl  Usuń elementy reklamowe za pomocą symbolu wieloznacznego
// @name:pt-BR   Remover anúncios no Tieba
// @description:pt-BR  Remover elementos de publicidade usando curinga
// @name:ro      Elimină reclamele din Tieba
// @description:ro  Elimină elementele publicitare folosind caractere generice
// @name:ru      Удалить рекламу в Tieba
// @description:ru  Удалить рекламные элементы с помощью подстановочного знака
// @name:sk      Odstrániť reklamy v Tieba
// @description:sk  Odstrániť reklamné prvky pomocou zástupného znaku
// @name:sr      Уклони огласе у Tieba
// @description:sr  Уклони елементе огласа користећи џокер знак
// @name:sv      Ta bort annonser i Tieba
// @description:sv  Ta bort annonselement med hjälp av jokertecken
// @name:th      ลบโฆษณาใน Tieba
// @description:th  ลบองค์ประกอบโฆษณาโดยใช้อักขระตัวแทน
// @name:tr      Tieba'daki reklamları kaldır
// @description:tr  Joker karakter kullanarak reklam öğelerini kaldır
// @name:ug      Tieba دىكى ئېلانلارنى چىقىرىۋەت
// @description:ug  ۋايلدكارد ئىشلىتىپ ئېلان ئېلېمېنتلىرىنى چىقىرىۋەت
// @name:uk      Видалити рекламу в Tieba
// @description:uk  Видалити рекламні елементи за допомогою підстановочного знака
// @name:vi      Xóa quảng cáo trong Tieba
// @description:vi  Xóa các yếu tố quảng cáo bằng ký tự đại diện
// @name:zh      移除Tieba中的广告
// @description:zh  使用通配符移除广告元素
// @name:zh-CN   移除百度贴吧里的广告
// @description:zh-CN  移除百度贴吧里的广告。
// @name:zh-HK   移除Tieba嘅廣告
// @description:zh-HK  用通配符移除廣告元素
// @name:zh-SG   移除Tieba中的广告
// @description:zh-SG  使用通配符移除广告元素
// @name:zh-TW   移除Tieba中的廣告
// @description:zh-TW  使用萬用字元移除廣告元素
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @author       aspen138
// @match        *://tieba.baidu.com/p/*
// @match        *://tieba.baidu.com/*
// @icon         https://tb3.bdstatic.com/public/icon/favicon-v2.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506325/Remove%20Ads%20in%20Tieba.user.js
// @updateURL https://update.greasyfork.org/scripts/506325/Remove%20Ads%20in%20Tieba.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Combined selector for all ad elements
    const AD_SELECTORS = [
        '.fengchao-wrap-feed',
        '[id^="mediago-tb-pb-list-"]',
        '[id^="mediago-tb-frs-list-"]',
        '.mediago-ad-wrapper',
        '.mediago-ad',
        '.thread_item_box:has(.ec-tuiguang)'
    ].join(',');

    // Function to remove advertisement elements
    function removeAds() {
        // Single querySelectorAll call for all ad elements
        const ads = document.querySelectorAll(AD_SELECTORS);
        ads.forEach(element => element.remove());
    }

    // Run the function to remove ads initially
    removeAds();

    // Optimize observer by using a debounced function
    let timeout = null;
    const observer = new MutationObserver(() => {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(removeAds, 100);
    });

    // Start observing with optimized configuration
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();

