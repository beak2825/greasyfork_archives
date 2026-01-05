// ==UserScript==
// @name         Replace image on Renewal.Staging_Category_Life_Guide
// @namespace    nori
// @version      0.4
// @description  Category,Life,CategoryGuideのステージング,renewalの画像が見れないので置き換える
// @author      　nori
// @match        https://c-1012.staging.bengo4.com/*
// @match        https://staging.bengo4.com/*
// @match        https://renewal.bengo4.com/*
// @match        https://c-1012.renewal.bengo4.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24744/Replace%20image%20on%20RenewalStaging_Category_Life_Guide.user.js
// @updateURL https://update.greasyfork.org/scripts/24744/Replace%20image%20on%20RenewalStaging_Category_Life_Guide.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
                var $images = $('img[src*="test_life"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_life/', '').replace('bengo4.com', 'bengo4.com/life'));
        });
        
        var $images = $('img[src*="test_categoryGuideImage"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_categoryGuideImage/', '').replace('bengo4.com', 'bengo4.com/categoryGuideImage'));
        });
        var $images2 = $('img[src*="test_categoryImage"]');
        $images2.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_categoryImage/', '').replace('bengo4.com', 'bengo4.com/categoryImage'));
        });
    });
})();