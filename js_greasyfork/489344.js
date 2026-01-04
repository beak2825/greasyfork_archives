// ==UserScript==
// @name             Quora Enhancement
// @name:ar          تحسين كويورا
// @name:bg          Подобрение на Quora
// @name:cs          Vylepšení Quora
// @name:da          Quora Forbedring
// @name:de          Quora Verbesserung
// @name:el          Βελτίωση του Quora
// @name:en          Quora Enhancement
// @name:eo          Plibonigo de Quora
// @name:es          Mejora de Quora
// @name:fi          Quora-parannus
// @name:fr          Amélioration de Quora
// @name:fr-CA       Amélioration de Quora
// @name:he          שיפור Quora
// @name:hr          Poboljšanje Quore
// @name:hu          Quora Fejlesztés
// @name:id          Peningkatan Quora
// @name:it          Miglioramento di Quora
// @name:ja          Quoraの拡張
// @name:ka          Quora-ს გაუმჯობესება
// @name:ko          Quora 개선
// @name:nb          Quora Forbedring
// @name:nl          Quora Verbetering
// @name:pl          Ulepszenie Quora
// @name:pt-BR       Aprimoramento do Quora
// @name:ro          Îmbunătățire Quora
// @name:ru          Улучшение Quora
// @name:sk          Vylepšenie Quora
// @name:sr          Побољшање Quora
// @name:sv          Quora Förbättring
// @name:th          การปรับปรุง Quora
// @name:tr          Quora Geliştirmesi
// @name:ug          Quora يۇقىرى دەرىجىلىك قىلىش
// @name:uk          Покращення Quora
// @name:vi          Nâng Cao Quora
// @name:zh          Quora增强
// @name:zh-CN       Quora增强
// @name:zh-HK       Quora增強
// @name:zh-SG       Quora增强
// @name:zh-TW       Quora增強
// @description      Make specific elements less wide on a page, remove Advertisement
// @description:ar   اجعل عناصر معينة أقل عرضًا على الصفحة، وقم بإزالة الإعلانات
// @description:bg   Направете определени елементи по-тесни на страницата, премахнете рекламата
// @description:cs   Zmenšete šířku určitých prvků na stránce, odstraňte reklamu
// @description:da   Gør specifikke elementer mindre brede på en side, fjern reklamer
// @description:de   Machen Sie bestimmte Elemente auf einer Seite schmaler, entfernen Sie Werbung
// @description:el   Κάντε συγκεκριμένα στοιχεία στενότερα σε μια σελίδα, καταργήστε τη διαφήμιση
// @description:en   Make specific elements less wide on a page, remove Advertisement
// @description:eo   Faru specifajn elementojn malpli largajn sur paĝo, forigu Reklamon
// @description:es   Haga que algunos elementos sean menos anchos en una página, elimine la publicidad
// @description:fi   Tee tietyistä elementeistä kapeampia sivulla, poista mainokset
// @description:fr   Réduisez la largeur de certains éléments sur une page, supprimez les publicités
// @description:fr-CA Réduisez la largeur de certains éléments sur une page, supprimez les publicités
// @description:he   הפוך רכיבים מסוימים צרים יותר בדף, הסר פרסומות
// @description:hr   Napravite određene elemente užima na stranici, uklonite oglase
// @description:hu   Tegye az egyes elemeket keskenyebbé az oldalon, távolítsa el a hirdetéseket
// @description:id   Buat elemen tertentu lebih sempit di halaman, hapus Iklan
// @description:it   Rendere alcuni elementi meno larghi su una pagina, rimuovere la pubblicità
// @description:ja   ページ上の特定の要素を狭くし、広告を削除
// @description:ka   გახადეთ გარკვეული ელემენტები ნაკლებ განიერი გვერდზე, მოაშორეთ რეკლამა
// @description:ko   페이지의 특정 요소를 덜 넓게 만들고, 광고 제거
// @description:nb   Gjør bestemte elementer mindre brede på en side, fjern reklame
// @description:nl   Maak specifieke elementen minder breed op een pagina, verwijder advertenties
// @description:pl   Zawęź określone elementy na stronie, usuń reklamy
// @description:pt-BR Torne elementos específicos menos largos em uma página, remova anúncios
// @description:ro   Faceți anumite elemente mai puțin late pe o pagină, eliminați reclamele
// @description:ru   Сделайте определенные элементы менее широкими на странице, удалите рекламу
// @description:sk   Zmeňte šírku určitých prvkov na stránke, odstráňte reklamu
// @description:sr   Учините одређене елементе мање широким на страници, уклоните рекламе
// @description:sv   Gör specifika element smalare på en sida, ta bort annonser
// @description:th   ทำให้องค์ประกอบเฉพาะน้อยลงบนหน้า ลบโฆษณา
// @description:tr   Sayfadaki belirli öğeleri daha dar yapın, reklamları kaldırın
// @description:ug   بەتتىكى مەلۇم ئېلېمېنتلارنى تار قىلىڭ، ئېلان چىقىرىۋېتىڭ
// @description:uk   Зробіть певні елементи менш широкими на сторінці, видаліть рекламу
// @description:vi   Làm cho các phần tử cụ thể ít rộng hơn trên trang, loại bỏ Quảng cáo
// @description:zh   使页面上的特定元素变窄，删除广告
// @description:zh-CN 使页面上的特定元素变窄，删除广告
// @description:zh-HK 使頁面上的特定元素變窄，刪除廣告
// @description:zh-SG 使页面上的特定元素变窄，删除广告
// @description:zh-TW 使頁面上的特定元素變窄，刪除廣告
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @author       aspen138
// @match        *://www.quora.com/*
// @icon        https://qsf.cf2.quoracdn.net/-4-images.favicon-new.ico-26-07ecf7cd341b6919.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489344/Quora%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/489344/Quora%20Enhancement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to adjust width and position with animation
    function adjustWidthAndPosition() {
        // Find elements by the class name and specific inline style
        const elements = document.querySelectorAll('.q-box[style*="width: 356px;"]');

        // Loop through found elements and adjust width and position with animation
        elements.forEach(function (element) {
            element.style.transition = 'width 0.5s ease-in-out, right 0.5s ease-in-out'; // Animate width and right property
            element.style.width = '156px'; // Adjust width as desired
            element.style.position = 'relative'; // Set position to relative
            element.style.right = '0px'; // Move closer to the right, adjust as needed
        });

        // Find elements by the class name and specific inline style
        const elements1 = document.querySelectorAll('.q-box[id="mainContent"]');

        // Loop through found elements and adjust width and position with animation
        elements1.forEach(function (element) {
            element.style.transition = 'width 0.5s ease-in-out'; // Animate width property
            element.style.width = '956px'; // Adjust width as desired
            element.style.position = 'relative'; // Set position to relative
            // Animation for moving to the right is not necessary here as the original code was commented out
        });

    }

    // Run the adjustment function after the page loads
    window.addEventListener('load', adjustWidthAndPosition);



    // ------------ Function to Remove Ads and Sponsored Elements ------------

    // Function to remove ads and sponsored elements
    function removeAdsAndSponsored() {
        // Select ads by specific classes or IDs
        const ads = document.querySelectorAll('.q-box.spacing_log_question_page_ad, #bunwaeabjd');

        ads.forEach(ad => {
            if (ad) ad.remove();
        });

        // Select sponsored elements by their specific class
        const sponsoredElements = document.querySelectorAll('.dom_annotate_ad_image_ad');

        sponsoredElements.forEach(elem => {
            if (elem) elem.remove();
        });

        // Optionally, hide elements that indicate sponsorship without removing them
        // For example, if there's a "Sponsored" label you want to hide:
        const sponsoredLabels = document.querySelectorAll('.sponsored-label-class'); // Replace with actual class
        sponsoredLabels.forEach(label => {
            if (label) label.style.display = 'none';
        });
    }

    // Run the removeAdsAndSponsored function on page load
    window.addEventListener('load', removeAdsAndSponsored);

    // Optionally, run the removeAdsAndSponsored function periodically to catch and remove ads/sponsored content that load asynchronously
    setInterval(removeAdsAndSponsored, 3000); // Checks and removes ads/sponsored content every 3 seconds

    // ------------ Function to Remove Ads and Sponsored Elements ------------


})();