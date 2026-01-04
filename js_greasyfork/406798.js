// ==UserScript==
// @name         Remove session login for Fshare
// @namespace    http://anlink.top/
// @version      0.1.1
// @description  Xóa session login Fshare!
// @author       Nguyen Huu Dat
// @match        https://www.fshare.vn/account/security
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/406798/Remove%20session%20login%20for%20Fshare.user.js
// @updateURL https://update.greasyfork.org/scripts/406798/Remove%20session%20login%20for%20Fshare.meta.js
// ==/UserScript==
// @run-at document-idle

(function() {
    'use strict';
    var total_row = $(".confirm-login-session").length;
    if(total_row >0){
        $(".confirm-login-session").each(function( i ) {
            var row = $(this);
            var token = row.data("token");
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.fshare.vn/account/delete-token?id=" + token,
                onload: function(response) {
                    console.log("Đã load: " + token);
                    row.html("Đã xóa");
                    if(i===(total_row-1)){
                        location.reload();
                    }
                }
            });
        });
    }
})();
