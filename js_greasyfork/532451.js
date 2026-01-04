// ==UserScript==
// @name         YouTube Shorts Ultimate Cleaner
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Hide all UI elements in YouTube Shorts
// @author       AShayeb
// @match        *://*.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532451/YouTube%20Shorts%20Ultimate%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/532451/YouTube%20Shorts%20Ultimate%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const elementsToHide = {
        channelName: 'a.yt-core-attributed-string__link[href*="/@"]', // اسم القناة
        subscribeButton: '.yt-spec-touch-feedback-shape, ytd-subscribe-button-renderer, yt-button-renderer[id="subscribe-button"], button[aria-label*="Subscribe"], button[aria-label*="اشتراك"], .ytd-subscribe-button-renderer', // أيقونة الاشتراك - محدثة
        titles: 'h2.ytShortsVideoTitleViewModelShortsVideoTitle',
        hashtags: 'a[href*="/hashtag/"]',
        metadata: '#metadata, #description',
        // إضافة عنصر جديد لإخفاء معلومات الموسيقى/الصوت
        musicInfo: '.ytReelSoundMetadataViewModelMarqueeContainer, marquee-scroll, .ytMarqueeScrollHost, .ytMarqueeScrollInnerContainer, .ytMarqueeScrollPrimaryString'
    };

    const nuclearClean = () => {
        // إخفاء العناصر الأساسية
        Object.values(elementsToHide).forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.cssText = 'display: none !important; opacity: 0 !important; height: 0 !important;';
                // لا نقوم بإزالة العناصر لتجنب مشاكل التخطيط
                // el.remove(); - تم تعليق هذا السطر
            });
        });

        // تنظيف إضافي للعناصر الديناميكية
        document.querySelectorAll('[class*="subscribe"], [class*="button"], [aria-label*="Subscribe"], [aria-label*="اشتراك"]').forEach(btn => {
            if(btn.innerText.includes('اشتراك') ||
               btn.innerText.includes('Subscribe') ||
               btn.getAttribute('aria-label')?.includes('اشتراك') ||
               btn.getAttribute('aria-label')?.includes('Subscribe')) {
                btn.style.cssText = 'display: none !important; opacity: 0 !important; height: 0 !important;';
            }
        });

        // إخفاء حاويات زر الاشتراك
        document.querySelectorAll('#subscribe-button, .ytd-subscribe-button-renderer, ytd-button-renderer').forEach(container => {
            if (container.querySelector('[aria-label*="Subscribe"], [aria-label*="اشتراك"]') ||
                container.textContent.includes('Subscribe') ||
                container.textContent.includes('اشتراك')) {
                container.style.cssText = 'display: none !important; opacity: 0 !important; height: 0 !important;';
            }
        });

        // إخفاء إضافي لمعلومات الموسيقى (العنصر في المربع الأحمر)
        document.querySelectorAll('[class*="sound"], [class*="music"], [class*="audio"], [class*="Marquee"]').forEach(el => {
            el.style.cssText = 'display: none !important; opacity: 0 !important; height: 0 !important;';
        });
    };

    // مراقبة مكثفة للتغييرات
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes, attributeName }) => {
            if(attributeName === 'class' || addedNodes.length) nuclearClean();
        });
    });

    // بدء المراقبة الشاملة
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
        attributeFilter: ['class', 'href', 'style']
    });

    // تشغيل مباشر مع تكرار مكثف
    nuclearClean();
    setInterval(nuclearClean, 250);
    window.addEventListener('scroll', nuclearClean);
    document.addEventListener('yt-navigate-finish', nuclearClean);
})();