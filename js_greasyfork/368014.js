// ==UserScript==
// @name         Link to Printer IPs
// @namespace    thewildsun
// @version      0.1
// @description  Link to Printer IPs.
// @author       thewildsun
// @match        http://printers.bah.com/
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/368014/Link%20to%20Printer%20IPs.user.js
// @updateURL https://update.greasyfork.org/scripts/368014/Link%20to%20Printer%20IPs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var reg = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
    
    $('a').each(function(){
        var titlestr = $(this).attr('title');
        //console.log($(this).text().trim());
        if (titlestr && $(this).text().trim().length > 0) {
            var m = titlestr.match(reg);
            if (m) {
                $('<a>', {'href':'http://'+m[0], 'target':'_blank', 'class':'iplink', html:m[0]}).insertBefore($(this));
            }
        }
    });
})();