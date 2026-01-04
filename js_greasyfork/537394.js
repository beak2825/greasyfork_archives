// ==UserScript==
// @name         Upwork High-Spend & Niche Keyword Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show only Upwork jobs with $1K+ spend and keywords from your service niche (marketing, design, dev, SEO, etc.)
// @author       You
// @match        https://www.upwork.com/nx/search/jobs*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537394/Upwork%20High-Spend%20%20Niche%20Keyword%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/537394/Upwork%20High-Spend%20%20Niche%20Keyword%20Filter.meta.js
// ==/UserScript==

(function () {
  const keywords = [
    "marketing", "digital marketing", "performance marketing", "social media", "facebook ads", "google ads", "ppc",
    "graphic design", "branding", "logo design", "poster", "canva", "photoshop", "illustrator", "figma",
    "video editing", "reels", "after effects", "premiere pro", "motion graphics", "youtube editing",
    "wordpress", "shopify", "cms", "landing page", "elementor", "woocommerce", "web design", "web development",
    "seo", "on-page", "off-page", "technical seo", "local seo", "link building",
    "content writing", "copywriting", "blog writing", "website content", "article writing", "product description",
    "data analytics", "google analytics", "ga4", "gtm", "ads", "google tag manager", "GHL", "Go high level" , "CRM", "reporting", "dashboard", "data studio"
  ];

  const HIGHLIGHT_STYLE = 'background-color: #e6f7ff !important; border-left: 4px solid #1890ff !important;';

  function filterJobCards() {
    let visibleCount = 0;
    const jobCards = document.querySelectorAll('[data-test="JobTileDetails"]');

    jobCards.forEach(card => {
      const spendElement = Array.from(card.querySelectorAll('span, div, strong')).find(el =>
        el.innerText?.toLowerCase().includes('spent')
      );

      let isHighSpender = false;

      if (spendElement) {
        const match = spendElement.innerText.match(/\$([\d.,]+)\s*[kK]?/);
        if (match && match[1]) {
          let amount = parseFloat(match[1].replace(/,/g, ''));
          if (spendElement.innerText.toLowerCase().includes('k')) {
            amount *= 1000;
          }
          if (!isNaN(amount) && amount >= 1000) {
            isHighSpender = true;
          }
        }
      }

      const jobText = card.innerText.toLowerCase();
      const hasKeyword = keywords.some(keyword =>
        new RegExp(`\\b${keyword}\\b`, 'i').test(jobText)
      );

      if (isHighSpender && hasKeyword) {
        card.style.display = 'block';
        card.style = HIGHLIGHT_STYLE;
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    console.log(`✅ Displaying ${visibleCount} job(s) with $1K+ spend and matching keywords`);
  }

  const observer = new MutationObserver(filterJobCards);
  observer.observe(document.body, { childList: true, subtree: true });

  setTimeout(filterJobCards, 2000);
})();
