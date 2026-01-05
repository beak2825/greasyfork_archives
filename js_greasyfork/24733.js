// ==UserScript==
// @name         Replace image on Staging.Life
// @namespace    kuma
// @version      0.5
// @description  Lifeのステージングの画像が見れないので置き換える
// @author       kuma
// @match        https://staging.bengo4.com/life/*
// @match        https://*staging.bengo4.com/*/li_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24733/Replace%20image%20on%20StagingLife.user.js
// @updateURL https://update.greasyfork.org/scripts/24733/Replace%20image%20on%20StagingLife.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        var $images = $('img[src*="test_life"]');
        $images.each(function() {
            var $img = $(this);
            var src = $img.prop('src');
            $img.prop('src', src.replace('test_life/', '').replace('bengo4.com', 'bengo4.com/life'));
            $img.error(function() {
              $img.prop('src', src);
            });
        });
    });
})();