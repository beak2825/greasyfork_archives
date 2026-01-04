// ==UserScript==
// @name       Filtro Tiktok
// @namespace  URL única do autor
// @version    2.0
// @description  Descrição do script
// @match      http://www.tiktok.com/*
// @match      https://www.tiktok.com/*
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/472570/Filtro%20Tiktok.user.js
// @updateURL https://update.greasyfork.org/scripts/472570/Filtro%20Tiktok.meta.js
// ==/UserScript==

// Add the following helper function to extract the number of interactions from a TikTok video URL
function extractInteractions(url) {
  const match = url.match(/\/stat\/item\/(\d+)/);
  return match ? parseInt(match[1]) : 0;
}

// Add the following function to redirect the video link to Shopee
function redirectToShopee(link) {
  // Replace the following URL with your Shopee store URL
  const shopeeURL = 'https://shopee.com/';
  window.location.href = shopeeURL + encodeURIComponent(link);
}

const init = () => {
  // ... (Existing init function code)

  if (hostname === "www.tiktok.com") {
    window.addEventListener('mouseover', ({ target }) => {
      if (target.tagName == 'VIDEO') {
        const src = target.src;
        const parent = target.parentElement;
        const interactions = extractInteractions(src); // Get the number of interactions from the video URL

        // Define the threshold for the minimum number of interactions to show the download button
        const interactionsThreshold = 1000; // Adjust this value as desired

        if (interactions >= interactionsThreshold) {
          const link = src;
          const style = 'left: 10px; top: 10px;';
          const cfg = {
            parent,
            link,
            style,
            target,
            name: lastItem(src.split('?')[0].split('/').filter(x => x)),
            position: 'beforeEnd',
          };
          createDom(cfg);

          // Add the event listener for the download button to redirect to Shopee
          const downloadButton = parent.querySelector('.download-button');
          downloadButton.addEventListener('click', () => {
            redirectToShopee(link);
          });
        }
      }
    });
  }
};

// ... (Existing script logic)

// Código executável começa aqui
(function() {
    init();
})();
