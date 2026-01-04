// ==UserScript==
// @name        Grailed high res pics
// @namespace   https://greasyfork.org/en/users/230946-odinbrood
// @match       http*://www.grailed.com/*
// @grant       GM_addStyle
// @version     1.2
// @author      OdinBrood
// @description Makes better use of screen space and replaces pictures with high res ones.
// @downloadURL https://update.greasyfork.org/scripts/424171/Grailed%20high%20res%20pics.user.js
// @updateURL https://update.greasyfork.org/scripts/424171/Grailed%20high%20res%20pics.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        var allImg = document.getElementsByTagName("img"), i = 0, img;
        var pattern = /resize.*compress\//;
        setTimeout(() => {
            while (img = allImg[i++]) {
                if (img.srcset.match(pattern) && img.height > 299) {
                    img.srcset = img.src.replace(pattern, "");
                }
            }
        }, 50);
        GM_addStyle(`
            .FiltersInstantSearch, .feed, div[class^='Module--'], .container, #wardrobe, .SimilarListings, .-container, .ForYou, .LayoutContainer, .RelatedDesigners {
                max-width: 99% !important;
            }
            .feed-item {
                max-width: 720px !important;
                max-height: 1209px !important;
            }
            .PhotoGallery--Photo {
                height: ` + (screen.height - 100) + `px !important;
            }
        `);
    });
});
observer.observe(document.body, { childList: true, subtree: true });