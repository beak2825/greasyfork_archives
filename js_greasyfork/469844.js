// ==UserScript==
// @name                Prime Video Sólo Contenido Prime [ESP]
// @name:en             Prime Video - Show Prime Content Only
// @name:pt             Prime Video - Mostrar apenas conteúdo Prime
// @name:fr             Prime Video - Afficher uniquement le contenu Prime
// @name:it             Prime Video - Mostra solo contenuti Prime
// @name:de             Prime Video - Nur Prime-Inhalte anzeigen
// @name:nl             Prime Video - Alleen Prime-content weergeven
// @name:da             Prime Video - Vis kun Prime-indhold
// @name:ro             Prime Video - Afișează doar conținutul Prime
// @name:fi             Prime Video - Näytä vain Prime-sisältö
// @name:pl             Prime Video - Pokaż tylko treści Prime
// @name:nn             Prime Video – Vis berre Prime-innhald
// @name:hu             Prime Video - Csak Prime-tartalmat jelenítsen meg
// @name:ms             Prime Video - Paparkan Kandungan Prime Sahaja
// @name:id             Prime Video - Tampilkan Konten Prime Saja
// @name:sv             Prime Video - Visa endast Prime-innehåll
// @name:tr             Prime Video - Sadece Prime içeriğini göster
// @name:fil            Prime Video - Ipakita lamang ang Prime na Nilalaman
// @name:cs             Prime Video - Zobrazit pouze obsah Prime
// @name:el             Prime Video - Εμφάνιση μόνο περιεχομένου Prime
// @name:ru             Prime Video - Показывать только контент Prime
// @name:ar             برايم فيديو - عرض محتوى برايم فقط
// @name:hi             प्राइम वीडियो - केवल प्राइम सामग्री दिखाएं
// @name:ta             பிரைம் வீடியோ - பிரைம் உள்ளடக்கத்தை மட்டும் காட்டு
// @name:te             ప్రైమ్ వీడియో - కేవలం ప్రైమ్ కంటెంట్ మాత్రమే చూపించు
// @name:th             Prime Video - แสดงเฉพาะเนื้อหา Prime เท่านั้น
// @name:ja             Prime Video - プライムコンテンツのみ表示
// @name:zh-CN          Prime Video - 仅显示 Prime 内容
// @name:zh-TW          Prime Video - 僅顯示 Prime 內容
// @name:ko             Prime Video - 프라임 콘텐츠만 표시
// @description         Oculta las secciones de compra o alquiler en la portada de Amazon Prime Video.
// @description:en      Hide the purchase or rental sections on the Amazon Prime Video homepage.
// @description:pt      Oculta as secções de compra ou aluguer no Amazon Prime Video
// @description:fr      Masque les sections d'achat ou de location sur Amazon Prime Video
// @description:it      Nasconde le sezioni di acquisto o noleggio su Amazon Prime Video
// @description:de      Blendet die Kauf- oder Mietbereiche auf Amazon Prime Video aus
// @description:nl      Verbergt de koop- of huursecties op Amazon Prime Video
// @description:da      Skjuler købs- eller lejefelterne på Amazon Prime Video
// @description:ro      Ascunde secțiunile de cumpărare sau închiriere de pe Amazon Prime Video
// @description:fi      Piilottaa osto- tai vuokrausosiot Amazon Prime Videossa
// @description:pl      Ukrywa sekcje zakupu lub wypożyczenia na Amazon Prime Video
// @description:nn      Gøymer kjøps- eller leigedelar på framsida til Amazon Prime Video
// @description:hu      Elrejti a vásárlási vagy bérlési szekciókat az Amazon Prime Videón
// @description:ms      Menyembunyikan bahagian pembelian atau sewaan pada Amazon Prime Video
// @description:id      Menyembunyikan bagian pembelian atau penyewaan di Amazon Prime Video
// @description:sv      Döljer köp- eller uthyrningssektionerna på Amazon Prime Video
// @description:tr      Amazon Prime Video'daki satın alma veya kiralama bölümlerini gizler
// @description:fil     Itinatago ang mga seksyon ng pagbili o pag-upa sa Amazon Prime Video
// @description:cs      Skrývá sekce nákupu nebo pronájmu na Amazon Prime Video
// @description:el      Αποκρύπτει τα τμήματα αγοράς ή ενοικίασης στο Amazon Prime Video
// @description:ru      Скрывает разделы покупки или аренды на Amazon Prime Video
// @description:ar      يخفي أقسام الشراء أو الاستئجار على أمازون برايم فيديو
// @description:hi      अमेज़न प्राइम वीडियो पर खरीद या किराए के अनुभाग छिपाता है
// @description:ta      அமேசான் பிரைம் வீடியோவில் கொள்முதல் அல்லது வாடகைப் பிரிவுகளை மறைக்கிறது
// @description:te      అమెజాన్ ప్రైమ్ వీడియోలో కొనుగోలు లేదా అద్దె విభాగాలను దాస్తుంది
// @description:th      ซ่อนส่วนการซื้อหรือเช่าใน Amazon Prime Video
// @description:ja      Amazon Prime Videoの購入またはレンタルセクションを隠します
// @description:zh-CN   隐藏 Amazon Prime Video 上的购买或租赁部分
// @description:zh-TW   隱藏 Amazon Prime Video 上的購買或租賃部分
// @description:ko      Amazon Prime Video에서 구매 또는 대여 섹션을 숨깁니다
// @namespace           http://tampermonkey.net/
// @version             0.4.3
// @author              Jeau
// @license             MIT
// @match               https://*.amazon.co.jp/*
// @match               https://*.amazon.com/*
// @match               https://*.amazon.ae/*
// @match               https://*.amazon.co.uk/*
// @match               https://*.amazon.it/*
// @match               https://*.amazon.in/*
// @match               https://*.amazon.eg/*
// @match               https://*.amazon.com.au/*
// @match               https://*.amazon.nl/*
// @match               https://*.amazon.ca/*
// @match               https://*.amazon.sa/*
// @match               https://*.amazon.sg/*
// @match               https://*.amazon.se/*
// @match               https://*.amazon.de/*
// @match               https://*.amazon.com.tr/*
// @match               https://*.amazon.com.br/*
// @match               https://*.amazon.fr/*
// @match               https://*.amazon.com.be/*
// @match               https://*.amazon.pl/*
// @match               https://*.amazon.com.mx/*
// @match               https://*.amazon.cn/*
// @match               https://*.primevideo.com/*
// @icon                https://m.media-amazon.com/images/G/01/digital/video/DVUI/favicons/favicon-32x32.png
// @require             https://code.jquery.com/jquery-latest.min.js
// @grant               none
// @run-at              document-end
// @downloadURL https://update.greasyfork.org/scripts/469844/Prime%20Video%20S%C3%B3lo%20Contenido%20Prime%20%5BESP%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/469844/Prime%20Video%20S%C3%B3lo%20Contenido%20Prime%20%5BESP%5D.meta.js
// ==/UserScript==

/*
  ***********************************************************************************************************
   This script has only been tested on Prime Video Spain site, but it might work in other countries as well.
   If you know how to make it work in your country, please let me know in the comments so I can fix it.
  ***********************************************************************************************************
*/

(function() {
    'use strict';
    // Minimum length of 'd' attribute for svg subscription icons
    const minSVGLength = 1400;

    // Check node added to the webpage
    function checkNodes(n) {
        // Script won't work on 'store' and personal account pages
        if (location.href.includes('/search')) return;
        if (location.href.includes('/detail')) return;
        if (location.href.includes('/settings')) return;
        if (location.href.includes('/mystuff')) return;
        if (location.href.includes('/addons')) return;
        if (location.href.includes('/subscription')) return;
        if (location.href.includes('/livetv')) return;
        if (location.href.includes('/deals')) return;
        if (location.href.includes('/collection/homepremiere')) return;

        let sections = $(n).find('section[data-testid*="carousel"], section[data-testid*="container"]');
        // Hide subscription carousels
        if (sections.length) {
            sections.each(function() {
                try {
                    let cards = $(this).find('article[data-testid*="card"]');
                    let subscriptionSVGs = $(cards).find('div[data-testid="card-overlay"]').find('svg[class*="fbl-icon"] path[d]').toArray().filter(function(e){return e.getAttribute('d').length > minSVGLength})

                    // Check every carousel looking for svg elements with subscription image
                    if (subscriptionSVGs.length) {
                        let carousel = this;

                        // Mainly meant to avoid hiding the 'Continue Watching', 'Watch again"... sections, regardless of the site language
                        // Expected less than 50% of cards with subscription icon
                        if (subscriptionSVGs.length / cards.length < 0.5 ) {
                            cards.each(function() {
                                // Hide the card with purchase requirements only
                                // Useful with short list carousels only. Otherwise card will probably be redrawn
                                if ($(this).find('div[data-testid="card-overlay"]').find('svg').find('path[d]').length &&
                                    $(this).find('div[data-testid="card-overlay"]').find('svg').find('path[d]').attr('d').length > minSVGLength) {
                                    $(this).css('display', 'none');
                                }
                            });
                        } else {
                            $(carousel).parent().css('display', 'none');
                            return true;
                        }
                    }
                } catch(e) {
                    console.log('\n\n\n');
                    console.log('Error userscript "Mostrar Sólo Prime" (MutationObserver) !!!!');
                    console.log('Estructura no reconocida en el siguiente elemento:');
                    console.log(n);
                    console.log('\n\n\n');
                }
            });
        }
    }

    // Check carousels on window load
    checkNodes(document.body);

    // Declaration of Mutation observer
    let observer = new MutationObserver((mutations) => {
        for (const { addedNodes } of mutations) {
            for (const n of addedNodes) {
                if (n.tagName) {
                    checkNodes(n);
                }
            }
        }
    });

    observer.observe(document, {
        subtree: true,
        childList: true,
        characterData: false
    });
})();
