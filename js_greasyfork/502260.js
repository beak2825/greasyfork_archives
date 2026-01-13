// ==UserScript==
// @name         Hide Promotion Advertisement at Zhihu Site
// @description  - Hide "发布想法" 以及上方的活动banner, Promotion Advertisement, "搜索发现" section, "大家都在搜" section, 右侧的活动banner
// @name:ar      إخفاء إعلانات الترويج في موقع Zhihu
// @description:ar إخفاء عناصر إعلانية محددة على Zhihu
// @name:bg      Скриване на промоционални реклами в сайта Zhihu
// @description:bg Скриване на специфични рекламни елементи в Zhihu
// @name:cs      Skrýt propagační reklamy na webu Zhihu
// @description:cs Skrýt konkrétní reklamní prvky na Zhihu
// @name:da      Skjul promoveringsannoncer på Zhihu-siden
// @description:da Skjul specifikke annoncelementer på Zhihu
// @name:de      Werbeanzeigen auf der Zhihu-Seite ausblenden
// @description:de Bestimmte Werbeelemente auf Zhihu ausblenden
// @name:el      Απόκρυψη διαφημίσεων προώθησης στον ιστότοπο Zhihu
// @description:el Απόκρυψη συγκεκριμένων διαφημιστικών στοιχείων στο Zhihu
// @name:en      Hide Promotion Advertisement at Zhihu Site
// @description:en Hide specific advertisement elements on Zhihu
// @name:eo      Kaŝi Promociajn Reklamojn en la Retejo Zhihu
// @description:eo Kaŝi specifajn reklamajn elementojn en Zhihu
// @name:es      Ocultar anuncios promocionales en el sitio Zhihu
// @description:es Ocultar elementos publicitarios específicos en Zhihu
// @name:fi      Piilota mainoskampanjat Zhihu-sivustolla
// @description:fi Piilota tietyt mainoselementit Zhihussa
// @name:fr      Masquer les publicités promotionnelles sur le site Zhihu
// @description:fr Masquer des éléments publicitaires spécifiques sur Zhihu
// @name:fr-CA   Masquer les publicités promotionnelles sur le site Zhihu
// @description:fr-CA Masquer des éléments publicitaires spécifiques sur Zhihu
// @name:he      הסתר פרסומות קידום באתר Zhihu
// @description:he הסתר אלמנטים פרסומיים ספציפיים ב-Zhihu
// @name:hr      Sakrij promotivne oglase na stranici Zhihu
// @description:hr Sakrij specifične oglasne elemente na Zhihu
// @name:hu      Promóciós hirdetések elrejtése a Zhihu oldalon
// @description:hu Specifikus hirdetési elemek elrejtése a Zhihu-n
// @name:id      Sembunyikan Iklan Promosi di Situs Zhihu
// @description:id Sembunyikan elemen iklan tertentu di Zhihu
// @name:it      Nascondi annunci promozionali sul sito Zhihu
// @description:it Nascondi elementi pubblicitari specifici su Zhihu
// @name:ja      Zhihuサイトのプロモーション広告を非表示にする
// @description:ja Zhihu上の特定の広告要素を非表示にする
// @name:ka      დამალე სარეკლამო განცხადებები Zhihu-ს საიტზე
// @description:ka დამალე კონკრეტული სარეკლამო ელემენტები Zhihu-ზე
// @name:ko      Zhihu 사이트에서 프로모션 광고 숨기기
// @description:ko Zhihu에서 특정 광고 요소 숨기기
// @name:nb      Skjul reklameannonser på Zhihu-siden
// @description:nb Skjul spesifikke annonseelementer på Zhihu
// @name:nl      Verberg promotieadvertenties op de Zhihu-site
// @description:nl Verberg specifieke advertentie-elementen op Zhihu
// @name:pl      Ukryj reklamy promocyjne na stronie Zhihu
// @description:pl Ukryj określone elementy reklamowe na Zhihu
// @name:pt-BR   Ocultar anúncios promocionais no site Zhihu
// @description:pt-BR Ocultar elementos de anúncio específicos no Zhihu
// @name:ro      Ascunde reclamele promoționale pe site-ul Zhihu
// @description:ro Ascunde elemente publicitare specifice pe Zhihu
// @name:ru      Скрыть рекламные объявления на сайте Zhihu
// @description:ru Скрыть определённые рекламные элементы на Zhihu
// @name:sk      Skryť propagačné reklamy na stránke Zhihu
// @description:sk Skryť špecifické reklamné prvky na Zhihu
// @name:sr      Sakrij promotivne reklame na sajtu Zhihu
// @description:sr Sakrij specifične reklamne elemente na Zhihu
// @name:sv      Dölj reklamannonser på Zhihu-sidan
// @description:sv Dölj specifika annonselement på Zhihu
// @name:th      ซ่อนโฆษณาโปรโมชั่นที่เว็บไซต์ Zhihu
// @description:th ซ่อนองค์ประกอบโฆษณาเฉพาะบน Zhihu
// @name:tr      Zhihu sitesindeki tanıtım reklamlarını gizle
// @description:tr Zhihu'daki belirli reklam öğelerini gizle
// @name:ug      Zhihu تور بېتىدىكى تەشۋىقات ئېلانلىرىنى يوشۇرۇش
// @description:ug Zhihu دىكى ئالاھىدە ئېلان ئېلېمېنتلىرىنى يوشۇرۇش
// @name:uk      Приховати рекламні оголошення на сайті Zhihu
// @description:uk Приховати певні рекламні елементи на Zhihu
// @name:vi      Ẩn quảng cáo khuyến mãi trên trang Zhihu
// @description:vi Ẩn các yếu tố quảng cáo cụ thể trên Zhihu
// @name:zh      
// @description:zh 隐藏Zhihu上的特定广告元素
// @name:zh-CN   隐藏Zhihu网站上的促销广告
// @description:zh-CN 隐藏“发布想法”以及上方的活动横幅、推广广告、“搜索发现”栏目、“大家都在搜”栏目、右侧的活动横幅
// @name:zh-HK   隱藏Zhihu網站嘅促銷廣告
// @description:zh-HK 隱藏「發布想法」以及上方的活動橫幅、促銷廣告、「搜尋發現」區塊、「大家都在搜」區塊、右側的活動橫幅
// @name:zh-SG   隐藏Zhihu网站上的促销广告
// @description:zh-SG 隐藏Zhihu上的特定广告元素
// @name:zh-TW   隱藏Zhihu網站上的促銷廣告
// @description:zh-TW 隱藏Zhihu上的特定廣告元素
// @namespace    http://tampermonkey.net/
// @version      0.1.7.2
// @icon         data:image/png;base64,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
// @author       aspen138
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502260/Hide%20Promotion%20Advertisement%20at%20Zhihu%20Site.user.js
// @updateURL https://update.greasyfork.org/scripts/502260/Hide%20Promotion%20Advertisement%20at%20Zhihu%20Site.meta.js
// ==/UserScript==





// Function to hide the advertisement elements
function hideAds() {
    GM_addStyle(`
      .Pc-word-card { display: none !important; }
      .Banner-link { display: none !important; }
      .Banner-adTag { display: none !important; }
      .AdvertImg { display: none !important; }
      iframe[src*="baidu.com"] { display: none !important; }
      .Pc-card-button-close { display: none !important; }
      .TopstoryItem--advertCard { display: none !important; }
      .Pc-Business-Card-PcTopFeedBanner { display: none !important; }
      .Pc-word-new { display: none !important; }
      .WriteArea { display: none !important; }
      .HotSearchCard { display: none !important; }
  `);

}


(function() {
    'use strict';

    hideAds();

    // Run the function to hide the elements when the page loads
    window.addEventListener('load', hideAds);

    // Observe the page for dynamic content loading and hide ads accordingly
    // The observer will call hideAds, which now includes the new rule for '.Pc-word-new'
    var observer = new MutationObserver(hideAds);
    observer.observe(document.body, { childList: true, subtree: true });

    // Function to remove the ad element (Note: This function removes, not just hides)
    function removeAdElement() {
        const adElement = document.querySelector('.Business-Card-PcRightBanner-link');
        if (adElement) {
            adElement.remove();
        }
    }

    // Wait for the page to load before removing the element
    window.addEventListener('load', removeAdElement);

    // Also observe for any dynamic content loading
    const observer1 = new MutationObserver(() => {
        removeAdElement();
    });

    observer1.observe(document.body, { childList: true, subtree: true });

})();


// Hide Zhihu Hotlist at the bottom of the comments section of Zhihu articles
(function() {
    'use strict';

    /**
     * Function to remove the target element.
     */
    function removeTargetElement() {
        // Note: Original comment says css-194mey8, but code targets div.css-1ildg7g
        const target = document.querySelector('div.css-1ildg7g');
        if (target) {
            target.remove();
            console.log('Target element removed: div.css-1ildg7g');
            // If the element is removed, disconnect the observer if it's set
            if (observer) { // Refers to the observer variable in this scope
                observer.disconnect();
                console.log('MutationObserver for div.css-1ildg7g disconnected.');
            }
        }
    }

    let observer; // Declared here to be accessible by removeTargetElement

    /**
     * Sets up a MutationObserver to watch for changes in the DOM and remove the target element when it appears.
     */
    function setupMutationObserver() {
        // Only set up if not already set up to avoid duplicates
         if (!observer) {
            observer = new MutationObserver((mutationsList, obs) => {
                // No need to iterate, just call the removal function
                removeTargetElement();
                // removeTargetElement will disconnect the observer if successful
            });

            // Start observing the document body for added nodes
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('MutationObserver set up to monitor DOM changes for div.css-1ildg7g.');
         } else {
             console.log('MutationObserver for div.css-1ildg7g already active.');
         }
    }

    /**
     * Initial attempt to remove the element once the DOM is fully loaded,
     * then set up observer if needed.
     */
    window.addEventListener('load', () => {
        removeTargetElement(); // Attempt removal on load

        // After the initial attempt, check if the element still exists.
        // If it does, set up the observer.
        // This matches the original logic provided.
        if (document.querySelector('div.css-1ildg7g')) {
             setupMutationObserver(); // Setup observer only if element is found (meaning it wasn't removed by the load handler)
        } else {
             console.log('div.css-1ildg7g not found or removed on load. Observer not set up initially.');
             // Note: This original logic might miss elements that appear *later* if they weren't present *immediately* after the load handler ran.
             // A more robust approach would set up the observer regardless if not found, but keeping original logic as requested.
        }
    });

    // No need for the direct call to removeTargetElement or setupMutationObserver outside the load listener
    // based on the structure of this second IIFE in the original request. It relies on 'load' and conditional observing.


})();


// hide the "搜索发现" section
// ==UserScript==
// @name         Hide Zhihu Search Discovery
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Hide "搜索发现" section in Zhihu search dropdown
// @author       You
// @match        *://*.zhihu.com/*
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Hide the "搜索发现" section and its items
    GM_addStyle(`
        /* Hide the "搜索发现" label */
        .SearchBar-label:not(.SearchBar-label--history) {
            display: none !important;
        }

        /* Hide the AutoComplete group containing "搜索发现" items */
        .AutoComplete-group:has(.SearchBar-label:not(.SearchBar-label--history)) {
            display: none !important;
        }

        /* Alternative: Hide specific search discovery items */
        .SearchBar-topSearchItem {
            display: none !important;
        }

        /* Hide menu items with topSearch in their ID */
        [id*="topSearch"] {
            display: none !important;
        }

        /* Hide placeholder text in search input */
        .SearchBar-input input::placeholder {
            color: transparent !important;
        }

        .SearchBar-input input::-webkit-input-placeholder {
            color: transparent !important;
        }

        .SearchBar-input input::-moz-placeholder {
            color: transparent !important;
        }

        .SearchBar-input input:-ms-input-placeholder {
            color: transparent !important;
        }
    `);

    console.log('Zhihu Search Discovery and placeholder hidden');

    // Prevent search button from working when input is empty
    function disableEmptySearch() {
        // Find all search buttons
        const searchButtons = document.querySelectorAll('.SearchBar-searchButton, button[aria-label="搜索"]');

        searchButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Find the associated input field
                const searchInput = this.closest('.SearchBar-tool, .SearchBar')?.querySelector('input[type="text"]');

                if (searchInput && searchInput.value.trim() === '') {
                    e.preventDefault();
                    e.stopPropagation();
                    e.stopImmediatePropagation();
                    return false;
                }
            }, true); // Use capture phase to intercept early
        });

        // Also prevent form submission when input is empty
        const searchForms = document.querySelectorAll('.SearchBar-tool');
        searchForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const searchInput = this.querySelector('input[type="text"]');
                if (searchInput && searchInput.value.trim() === '') {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }
            }, true);
        });
    }

    // Run on page load
    disableEmptySearch();

    // Re-run when DOM changes (for dynamically loaded content)
    const observer = new MutationObserver(() => {
        disableEmptySearch();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();