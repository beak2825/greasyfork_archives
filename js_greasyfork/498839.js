// ==UserScript==
// @name         JD Mobile to PC Redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Redirect JD mobile product links to PC version automatically
// @author       多看多学习
// @match        *://*.m.jd.com/*
// @match        *://mitem.jd.com/*
// @match        *://wqs.jd.com/*
// @match        *://wqitem.jd.com/*
// @match        *://item.m.jd.com/*
// @match        *://*.jd.hk/*
// @match        *://m.yiyaojd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498839/JD%20Mobile%20to%20PC%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/498839/JD%20Mobile%20to%20PC%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert mobile JD URL to PC URL
    function convertToPCUrl(mobileUrl) {
        // Handle different mobile URL patterns
        if (/\/\/item\.m\.jd\.com\/product\/\d+\.html/.test(mobileUrl)) {
            // Convert product page URL
            return mobileUrl.replace(/\/\/item\.m\.jd\.com\/product\/(\d+)\.html/, '//item.jd.com/$1.html');
        } else if (/\/\/mitem\.jd\.com\/product\/\d+\.html/.test(mobileUrl)) {
            // Convert another type of product page URL
            return mobileUrl.replace(/\/\/mitem\.jd\.com\/product\/(\d+)\.html/, '//item.jd.com/$1.html');
        } else if (/\/\/wqitem\.jd\.com\/product\/\d+\.html/.test(mobileUrl)) {
            // Convert another type of product page URL
            return mobileUrl.replace(/\/\/wqitem\.jd\.com\/product\/(\d+)\.html/, '//item.jd.com/$1.html');
        } else if (/\/\/m\.yiyaojd\.com\/product\/\d+\.html/.test(mobileUrl)) {
            // Convert another type of product page URL
            return mobileUrl.replace(/\/\/m\.yiyaojd\.com\/product\/(\d+)\.html/, '//item.jd.com/$1.html');
        } else if (/\/\/m\.jd\.hk\/product\/\d+\.html/.test(mobileUrl)) {
            // Convert another type of product page URL
            return mobileUrl.replace(/\/\/m\.jd\.hk\/product\/(\d+)\.html/, '//item.jd.hk/$1.html');
        } else {
            // Default conversion for other pages
            return mobileUrl
                .replace(/\/\/m\.jd\.com/, '//www.jd.com')
                .replace(/\/\/mitem\.jd\.com/, '//item.jd.com')
                .replace(/\/\/wqs\.jd\.com/, '//www.jd.com')
                .replace(/\/\/wqitem\.jd\.com/, '//item.jd.com')
                .replace(/\/\/item\.m\.jd\.com/, '//item.jd.com')
                .replace(/\/\/m\.yiyaojd\.com/, '//www.jd.com')
                .replace(/\/\/m\.jd\.hk/, '//www.jd.hk');
        }
    }

    // Check if the current URL is a mobile JD URL
    function isMobileJDUrl(url) {
        return /\/\/m\.jd\.com|\/\/mitem\.jd\.com|\/\/wqs\.jd\.com|\/\/wqitem\.jd\.com|\/\/item\.m\.jd\.com|\/\/m\.yiyaojd\.com|\/\/m\.jd\.hk/.test(url);
    }

    // Get the current URL
    const currentUrl = window.location.href;

    // If it is a mobile JD URL, redirect to the PC version
    if (isMobileJDUrl(currentUrl)) {
        const pcUrl = convertToPCUrl(currentUrl);
        window.location.replace(pcUrl);
    }
})();