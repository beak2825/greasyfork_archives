// ==UserScript==
// @name         YouTube Shorts Blocker Ultra + Blocking Youtube Shorts GUI On Homepage And Videos
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  The most advanced youtube shorts blocker on the Net! Blocks YouTube Shorts.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/521795/YouTube%20Shorts%20Blocker%20Ultra%20%2B%20Blocking%20Youtube%20Shorts%20GUI%20On%20Homepage%20And%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/521795/YouTube%20Shorts%20Blocker%20Ultra%20%2B%20Blocking%20Youtube%20Shorts%20GUI%20On%20Homepage%20And%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastValidUrl = window.location.href;
    let isRedirecting = false;

    setInterval(function() {
        const currentUrl = window.location.href;

        if (!currentUrl.includes('/shorts/')) {
            lastValidUrl = currentUrl;
        } else if (!isRedirecting) {
            isRedirecting = true;

            let userResponse = confirm("This video is a YouTube Shorts. To view it as a regular video, click OK. If you click Cancel, you will be redirected to the previous URL.");

            if (userResponse) {
                window.location.href = currentUrl.replace('/shorts/', '/watch?v=');
            } else {
                if (lastValidUrl.includes('youtube.com/shorts')) {
                    window.location.href = 'https://www.youtube.com';
                } else {
                    window.location.href = lastValidUrl;
                }
            }

            setTimeout(function() {
                isRedirecting = false;
            }, 5000);
        }
    }, 1);
})();

(function () {
    'use strict';

    setInterval(function () {
        const elementsToRemove = document.querySelectorAll(
            '.yt-core-image.shortsLockupViewModelHostThumbnail.yt-core-image--fill-parent-height.yt-core-image--fill-parent-width.yt-core-image--content-mode-scale-aspect-fill.yt-core-image--loaded,' +
            '.shortsLockupViewModelHostThumbnailContainer.shortsLockupViewModelHostThumbnailContainerRounded.shortsLockupViewModelHostThumbnailContainerCustomDimensions,' +
            '.shortsLockupViewModelHostThumbnailContainer.shortsLockupViewModelHostThumbnailContainerAspectRatioTwoByThree.shortsLockupViewModelHostThumbnailContainerRounded.shortsLockupViewModelHostThumbnailContainerCustomDimensions,' +
            '.shortsLockupViewModelHostOutsideMetadata.shortLockupViewModelHostMetadataRounded.image-overlay-text,' +
            '.shortsLockupViewModelHostMetadataTitle.shortsLockupViewModelHostOutsideMetadataTitle,' +
            '.shortsLockupViewModelHostMetadataSubhead.shortsLockupViewModelHostOutsideMetadataSubhead,' +
            '.shortsLockupViewModelHostOutsideMetadataMenu.shortsLockupViewModelHostShowOverPlayer,' +
            '.shortsLockupViewModelHostOutsideMetadata.shortsLockupViewModelHostMetadataRounded.image-overlay-text,' +
            'ytd-rich-section-renderer.style-scope.ytd-rich-grid-renderer,' +
            'a.shortsLockupViewModelHostEndpoint.shortsLockupViewModelHostOutsideMetadataEndpoint,' +
            'ytm-shorts-lockup-view-model-v2.shortsLockupViewModelHost.yt-horizontal-list-renderer,' +
            'ytm-shorts-lockup-view-model.shortsLockupViewModelHost.yt-horizontal-list-renderer,' +
            '#title-container.style-scope.ytd-reel-shelf-renderer'
        );

        elementsToRemove.forEach(function (element) {
            element.remove();
        });

        
        const shortsTab = document.querySelector('yt-tab-shape[tab-title="Shorts"]');
        if (shortsTab && shortsTab.innerText.includes('Shorts')) {
            shortsTab.remove();  // 'Shorts' metnini bulursa tüm öğeyi sil
        }

        
        const link = document.querySelector('a[title="Shorts"]');
        if (link && link.querySelector('.title') && link.querySelector('.title').innerText.includes('Shorts')) {
            link.remove();  // 'Shorts' metnini bulursa tüm a öğesini sil
        }

        
        const reelShelf = document.querySelector('ytd-reel-shelf-renderer');
        if (reelShelf && reelShelf.innerHTML.includes('<yt-horizontal-list-renderer class="style-scope ytd-reel-shelf-renderer"')) {
            reelShelf.remove(); 
        }
    }, 1);
})();