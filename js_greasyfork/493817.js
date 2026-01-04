// ==UserScript==
// @name         东软智慧教育平台优化&去广告
// @namespace    neuedupukgaai
// @version      0.31
// @description  Combine styles and element blocking on Neuedu personHome page
// @author       nm
// @match        http://study.neuedu.com/
// @match        http://study.neuedu.com/personHome
// @match        http://study.neuedu.com/loginF
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493817/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/493817/%E4%B8%9C%E8%BD%AF%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E4%BC%98%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add flex-wrap style to swiper-wrapper class within neu-teacher-main
    var styleSwiper = document.createElement('style');
    styleSwiper.type = 'text/css';
    styleSwiper.innerHTML = '.neu-teacher-main .swiper-wrapper { flex-wrap: wrap !important; }';
    document.getElementsByTagName('head')[0].appendChild(styleSwiper);

    // Hide the swiper-button-next element within neu-teacher-main
    var styleButtonNext = document.createElement('style');
    styleButtonNext.type = 'text/css';
    styleButtonNext.innerHTML = '.neu-teacher-main .swiper-button-next { display: none !important; }';
    document.getElementsByTagName('head')[0].appendChild(styleButtonNext);

    // Function to remove an element from the page
    function removeElement(selector) {
        var element = document.querySelector(selector);
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // Block pointermove event
    document.addEventListener('pointermove', function(event) {
        event.stopPropagation();
        event.preventDefault();
    }, true);

    // Observe for changes and remove elements if they are added again
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Element added to DOM
                var potentialButtons = document.querySelectorAll('button.msg-confirm-btn');
                if (potentialButtons.length > 0) {
                    var reloginButton = potentialButtons[0];
                    if (reloginButton.innerText.includes('重新登录')) {
                        reloginButton.click();
                    }
                }
                // Remove specified elements
                removeElement('#mask');
                removeElement('div.warp > div.main-content:nth-child(2) > div.banner-mods:first-child');
                removeElement('div.warp > div.main-content:nth-child(2) > div.container:nth-child(2) > div.mods:last-child > div.el-row:first-child');
                removeElement('div.warp > div.main-content:nth-child(2) > div.banner-mods-stu:first-child');
                removeElement('div.warp > div.main-content:nth-child(2) > div.container:nth-child(2) > div.apps:first-child');
                //removeElement('div.container > div.apps');
            }
        });
    });

    var config = { attributes: false, childList: true, subtree: true };
    observer.observe(document.body, config);
})();