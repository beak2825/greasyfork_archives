// ==UserScript==
// @name         謎の予定fix
// @namespace    https://twitter.com/falcon610
// @version      0.1
// @description  一時的なやーつ
// @author       badfalcon
// @match        http://nazo.pics/event/index.php*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/376607/%E8%AC%8E%E3%81%AE%E4%BA%88%E5%AE%9Afix.user.js
// @updateURL https://update.greasyfork.org/scripts/376607/%E8%AC%8E%E3%81%AE%E4%BA%88%E5%AE%9Afix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#frame-contents').on('scroll',function(){
        $('#frame-colhead').scrollLeft($(this).scrollLeft());
        $('#frame-rowhead').scrollTop($(this).scrollTop());
    });

})();