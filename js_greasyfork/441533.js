// ==UserScript==
// @name         Vote
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  vote!
// @author       mksz
// @match        http://www.yzae.com.cn/ZDAdword/adwordInfo.html
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441533/Vote.user.js
// @updateURL https://update.greasyfork.org/scripts/441533/Vote.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){

        $("button").each(function() {
            if(("7" == $(this).attr("data-cid")) && ($(this).attr("data-aid") == "3")) {
                console.log("1")
                for(var i = 0; i < 6; ++i) {
                    $(this).click();
                }
            }

            if(("7" == $(this).attr("data-cid")) && ($(this).attr("data-aid") == "7")) {
                console.log("2")
                for(var j = 0; j < 4; ++j) {
                    $(this).click();
                }
            }
        });
    }

    function clearAllCookie() {
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
		if(keys) {
            for(var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
	}

    setTimeout(() => {
        clearAllCookie();
        location.reload();
    }, 1000);
})();