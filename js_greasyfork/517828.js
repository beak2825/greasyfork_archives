// ==UserScript==
// @name         Outlook.com Ad Remover
// @description  Remove ads from Outlook.com mail interface
// @name:ar      مزيل إعلانات Outlook.com
// @description:ar إزالة الإعلانات من واجهة بريد Outlook.com
// @name:bg      Премахване на реклами от Outlook.com
// @description:bg Премахва рекламите от интерфейса на пощата в Outlook.com
// @name:cs      Odstraňovač reklam z Outlook.com
// @description:cs Odstraňuje reklamy z rozhraní pošty Outlook.com
// @name:da      Outlook.com Annoncefjerner
// @description:da Fjerner annoncer fra Outlook.com mail-grænsefladen
// @name:de      Outlook.com Werbung Entferner
// @description:de Entfernt Werbung aus der Outlook.com Mail-Oberfläche
// @name:el      Αφαίρεση διαφημίσεων από το Outlook.com
// @description:el Αφαιρεί διαφημίσεις από τη διεπαφή αλληλογραφίας του Outlook.com
// @name:en      Outlook.com Ad Remover
// @description:en Remove ads from Outlook.com mail interface
// @name:eo      Outlook.com Reklamforigilo
// @description:eo Forigas reklamojn el la poŝtinterfaco de Outlook.com
// @name:es      Eliminador de anuncios de Outlook.com
// @description:es Elimina anuncios de la interfaz de correo de Outlook.com
// @name:fi      Outlook.com Mainosten Poistaja
// @description:fi Poistaa mainokset Outlook.com-sähköpostikäyttöliittymästä
// @name:fr      Suppresseur de publicités Outlook.com
// @description:fr Supprime les publicités de l’interface de messagerie Outlook.com
// @name:fr-CA   Suppresseur de publicités Outlook.com
// @description:fr-CA Supprime les publicités de l’interface de messagerie Outlook.com
// @name:he      מסיר פרסומות של Outlook.com
// @description:he מסיר פרסומות מממשק הדואר של Outlook.com
// @name:hr      Uklanjanje oglasa s Outlook.com
// @description:hr Uklanja oglase iz sučelja pošte na Outlook.com
// @name:hu      Outlook.com Hirdetéseltávolító
// @description:hu Eltávolítja a hirdetéseket az Outlook.com levelezőfelületről
// @name:id      Penghapus Iklan Outlook.com
// @description:id Menghapus iklan dari antarmuka email Outlook.com
// @name:it      Rimuovi annunci da Outlook.com
// @description:it Rimuove gli annunci dall’interfaccia di posta di Outlook.com
// @name:ja      Outlook.com広告リムーバー
// @description:ja Outlook.comメールインターフェースから広告を削除します
// @name:ka      Outlook.com რეკლამის მოცილება
// @description:ka შლის რეკლამებს Outlook.com-ის ელფოსტის ინტერფეისიდან
// @name:ko      Outlook.com 광고 제거기
// @description:ko Outlook.com 메일 인터페이스에서 광고를 제거합니다
// @name:nb      Outlook.com Annonsefjerner
// @description:nb Fjerner annonser fra Outlook.com e-postgrensesnittet
// @name:nl      Outlook.com Advertentieverwijderaar
// @description:nl Verwijdert advertenties uit de Outlook.com e-mailinterface
// @name:pl      Usuwacz reklam Outlook.com
// @description:pl Usuwa reklamy z interfejsu poczty Outlook.com
// @name:pt-BR   Removedor de anúncios do Outlook.com
// @description:pt-BR Remove anúncios da interface de e-mail do Outlook.com
// @name:ro      Îndepărtarea reclamelor din Outlook.com
// @description:ro Elimină reclamele din interfața de e-mail Outlook.com
// @name:ru      Удаление рекламы с Outlook.com
// @description:ru Удаляет рекламу из интерфейса почты Outlook.com
// @name:sk      Odstraňovač reklám z Outlook.com
// @description:sk Odstraňuje reklamy z rozhrania pošty Outlook.com
// @name:sr      Уклањање огласа са Outlook.com
// @description:sr Уклања огласе из интерфејса поште на Outlook.com
// @name:sv      Outlook.com Annonsborttagare
// @description:sv Tar bort annonser från Outlook.com e-postgränssnittet
// @name:th      ตัวลบโฆษณา Outlook.com
// @description:th ลบโฆษณาออกจากอินเทอร์เฟซอีเมลของ Outlook.com
// @name:tr      Outlook.com Reklam Kaldırıcı
// @description:tr Outlook.com posta arayüzünden reklamları kaldırır
// @name:ug      Outlook.com ئېلان ئۆچۈرگۈچ
// @description:ug Outlook.com خەت ئارايۈزىدىن ئېلانلارنى ئۆچۈرىدۇ
// @name:uk      Видаляч реклами з Outlook.com
// @description:uk Видаляє рекламу з інтерфейсу пошти Outlook.com
// @name:vi      Công cụ xóa quảng cáo Outlook.com
// @description:vi Xóa quảng cáo khỏi giao diện thư của Outlook.com
// @name:zh      Outlook.com 广告移除器
// @description:zh 从 Outlook.com 邮件界面中移除广告
// @name:zh-CN   Outlook.com 广告移除器
// @description:zh-CN 从 Outlook.com 邮件界面中移除广告
// @name:zh-HK   Outlook.com 廣告移除器
// @description:zh-HK 從 Outlook.com 郵件介面中移除廣告
// @name:zh-SG   Outlook.com 广告移除器
// @description:zh-SG 从 Outlook.com 邮件界面中移除广告
// @name:zh-TW   Outlook.com 廣告移除器
// @description:zh-TW 從 Outlook.com 郵件介面中移除廣告
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       aspen138
// @match        *://outlook.live.com/mail/0/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517828/Outlookcom%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/517828/Outlookcom%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove ad elements
    function removeAds() {
        // Remove elements with aria-label="广告" (Ad in Chinese)
        document.querySelectorAll('[aria-label="广告"]').forEach(el => {
            el.closest('div[class]').remove();
        });

        // Remove elements with ID starting with 'owaadbar'
        document.querySelectorAll('[id^="owaadbar"]').forEach(el => {
            el.closest('div[class]').remove();
        });

        // Remove ad placeholders or related elements if any
        document.querySelectorAll('.VdboX, .GssDD, .z0duZ').forEach(el => {
            el.remove();
        });
    }

    // Run on page load
    window.addEventListener('load', removeAds);

    // Observe mutations to handle dynamic content (SPA behavior)
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });
})();
