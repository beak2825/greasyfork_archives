// ==UserScript==
// @name         Ekşi Sözlük - Tıklanabilir Linkler
// @namespace    
// @version      1.0
// @description  Ekşi Sözlük entry'leri içinde düz metin olarak bulunan linkleri (https://...) tıklanabilir hale getirir. Dinamik olarak yüklenen entry'lerde de çalışır.
// @author       CustMe & Violentmonkey Kod Desteği (Gemini)
// @match        https://eksisozluk.com/*a=caylaklar*
// @icon         data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><circle cx='32' cy='32' r='28' fill='%2384B42C' stroke='white' stroke-width='2'/><path stroke='white' stroke-width='6' stroke-linecap='round' fill='none' d='M25,23 l-9,9 a8,8 0 0,0 11.3,11.3 l5-5 M39,41 l9-9 a8,8 0 0,0 -11.3,-11.3 l-5,5'/></svg>
// @license      MIT
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539644/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20-%20T%C4%B1klanabilir%20Linkler.user.js
// @updateURL https://update.greasyfork.org/scripts/539644/Ek%C5%9Fi%20S%C3%B6zl%C3%BCk%20-%20T%C4%B1klanabilir%20Linkler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Linkleri arayıp <a> etiketine çevirecek olan ana fonksiyon
    const linkifyContent = (contentElement) => {
        // Eğer bu element daha önce işleme alındıysa tekrar dokunma. Bu, performansı artırır ve hataları önler.
        if (contentElement.dataset.linksProcessed) {
            return;
        }

        // Metin içindeki URL'leri bulmak için kullanılacak Regular Expression (Regex)
        // Bu desen, "http://" veya "https://://" ile başlayan ve bir boşluk, < veya > karakteriyle bitmeyen tüm dizeleri yakalar.
        const urlRegex = /(https?:\/\/[^\s<>]+)/g;

        // Elementin HTML içeriğini alıp, bulduğu her URL'yi bir <a> etiketiyle değiştir
        // target="_blank" linkin yeni sekmede açılmasını sağlar.
        // rel="noopener noreferrer" güvenlik için eklenmiş bir standarttır.
        contentElement.innerHTML = contentElement.innerHTML.replace(urlRegex, (url) => {
            // Eğer URL bir noktalama işaretiyle bitiyorsa (örneğin cümlenin sonundaysa), onu linkin dışına al.
            // Bu, "https://example.com." gibi bir metnin linkinin "https://example.com" olmasını sağlar.
            let punctuation = '';
            const lastChar = url.slice(-1);
            if ('. , ; : ! ?'.includes(lastChar)) {
                punctuation = lastChar;
                url = url.slice(0, -1);
            }
            return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${punctuation}`;
        });


        // Elementi işlendi olarak işaretle
        contentElement.dataset.linksProcessed = 'true';
    };

    // Sayfadaki tüm entry'leri barındıran ana listeyi hedef al
    const targetNode = document.getElementById('entry-item-list');

    // Eğer hedef liste bulunamazsa betiği durdur (örneğin, farklı bir sayfadaysak)
    if (!targetNode) {
        return;
    }

    // 1. Adım: Sayfa ilk yüklendiğinde mevcut olan tüm entry'ler için fonksiyonu çalıştır
    const initialEntries = targetNode.querySelectorAll('.content');
    initialEntries.forEach(linkifyContent);

    // 2. Adım: Sayfaya yeni elemanlar eklendiğinde (yeni entry'ler yüklendiğinde) çalışacak olan gözlemciyi (Observer) kur
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            // Sadece yeni node'lar (elemanlar) eklendiğinde ilgileniyoruz
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // Eklenen node'un bir element olduğundan ve bir class'ı olduğundan emin ol
                    if (node.nodeType === 1 && node.classList) {
                        // Eğer eklenen node'un kendisi bir entry ise (.content içeriyorsa) veya
                        // eklenen node'ların içinde entry'ler varsa (.content'leri bul)
                        const contentElements = node.querySelectorAll('.content');
                        contentElements.forEach(linkifyContent);
                    }
                });
            }
        }
    });

    // Gözlemciyi hedef listeyi dinlemesi için başlat
    // childList: doğrudan alt elemanların eklenip çıkarılmasını izle
    // subtree: sadece doğrudan alt elemanları değil, onların da altındakileri (tüm ağacı) izle
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });

})();
