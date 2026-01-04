// ==UserScript==
// @name         filter_collie
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://new.collie.pt.xiaomi.com/project/index*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382116/filter_collie.user.js
// @updateURL https://update.greasyfork.org/scripts/382116/filter_collie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var intervalId = setInterval(function() {
        var search_box = $('input[type=search]');
        //console.log(search_box.length);
        //console.log($('table#project_table').length);
        //console.log(search_box.val());
        if (search_box.length > 0 && $('table#project_table').find('tr').length > 10 && search_box.val() == '') {
            search_box.val('liuchenxing').keyup();
        }
	}, 300);
})();