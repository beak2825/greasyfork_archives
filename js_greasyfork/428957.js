// ==UserScript==
// @name         1024FormShowImage
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  123
// @author       You
// @match        http://t66y.com/htm_data/*.html
// @icon         https://www.google.com/s2/favicons?domain=t66y.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/428957/1024FormShowImage.user.js
// @updateURL https://update.greasyfork.org/scripts/428957/1024FormShowImage.meta.js
// ==/UserScript==

(function() {
        $("img").each(function()
        {
            if($(this).attr("ess-data")){
              //$(this).html('<img src="' + $(this).attr("ess-data") + '">');$(".myImg").attr('src',"hackanm.gif");
                $(this).attr('src',$(this).attr("ess-data"));
            }
            console.log($(this).attr("ess-data"))

        });

})();