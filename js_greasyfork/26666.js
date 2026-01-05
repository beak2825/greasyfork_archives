// ==UserScript==
// @name         Replace image on Renewal and Staging
// @namespace    nori
// @version      0.1
// @description  Category,Life,CategoryGuide, Office のステージング,renewalの画像が見れないので置き換える
// @author      　nori
// @match        https://c-1012.staging.bengo4.com/*
// @match        https://staging.bengo4.com/*
// @match        https://renewal.bengo4.com/*
// @match        http://bengo4.com.b4/*
// @match        https://c-1012.renewal.bengo4.com/*
// @match        http://c-1012.bengo4.com.b4/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26666/Replace%20image%20on%20Renewal%20and%20Staging.user.js
// @updateURL https://update.greasyfork.org/scripts/26666/Replace%20image%20on%20Renewal%20and%20Staging.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        // life
        var $images = $('img[src*="test_life"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_life/', '').replace('bengo4.com', 'bengo4.com/life'));
        });
        
        // categoryGuide
        var $images = $('img[src*="test_categoryGuideImage"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_categoryGuideImage/', '').replace('bengo4.com', 'bengo4.com/categoryGuideImage'));
        });
        // category
        var $images2 = $('img[src*="test_categoryImage"]');
        $images2.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_categoryImage/', '').replace('bengo4.com', 'bengo4.com/categoryImage'));
        });
        
        // office
         var $images = $('img[src*="test_office"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_office/', '').replace('bengo4.com', 'bengo4.com/office'));
        });
    });
})();