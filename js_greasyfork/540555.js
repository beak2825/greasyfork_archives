// ==UserScript==
// @name         漫畫櫃自動置中圖片
// @version      0.2
// @description  Autoresize manhuagui to fit 100vh, with optional auto-scroll to center
// @author       Kappa
// @match        http*://www.manhuagui.com/comic/*/*.html
// @namespace https://greasyfork.org/users/829707
// @downloadURL https://update.greasyfork.org/scripts/540555/%E6%BC%AB%E7%95%AB%E6%AB%83%E8%87%AA%E5%8B%95%E7%BD%AE%E4%B8%AD%E5%9C%96%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/540555/%E6%BC%AB%E7%95%AB%E6%AB%83%E8%87%AA%E5%8B%95%E7%BD%AE%E4%B8%AD%E5%9C%96%E7%89%87.meta.js
// ==/UserScript==

  /*!
  * Updated By Kappa Using AI, Original By Sarens Here: "https://greasyfork.org/zh-TW/scripts/372011-manhuagui-autoresize"
  */

let enableAutoScroll = true;

const resizeManga = () => {
    $('body').append('<style>#mangaFile { height: 100vh; }</style>');
    if (enableAutoScroll) {
        $(window).scrollTop($("#mangaFile").offset().top);
    }
};

const initialize = () => {
    resizeManga(); // Initial resize
};

// Manage scrolling
$(window).scroll(() => {
    if (enableAutoScroll) {
        $(window).scrollTop($("#mangaFile").offset().top);
    }
});

// Listen for hash changes
window.addEventListener('hashchange', () => {
    resizeManga(); // Resize without delay
});

// Toggle auto-scroll behavior
$(document).on('keydown', (e) => {
    if (e.key === 's') { // Press 's' key to toggle auto-scroll
        enableAutoScroll = !enableAutoScroll;
        if (enableAutoScroll) {
            resizeManga();
        }
    }
});

// Initialize on page load
$(initialize);