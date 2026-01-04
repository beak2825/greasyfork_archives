// ==UserScript==
// @name         filter_deploy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动填入搜索词
// @author       You
// @match        https://deploy.pt.xiaomi.com/services/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382114/filter_deploy.user.js
// @updateURL https://update.greasyfork.org/scripts/382114/filter_deploy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var intervalId = setInterval(function() {
	    //console.log($('table>>tr').length);
        //console.log($('#input-search').val());
        if ($('#input-search').length > 0 && $('table>>tr').length > 7 && $('#input-search').val() == '') {
            $('#input-search').val("(mivideo|\\.music)-search").change();
            //console.log("321");
        }
	}, 300);
})();