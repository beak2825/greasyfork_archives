// ==UserScript==
// @name         Spirit
// @namespace    https://www.spirit.com/
// @version      0.0.2
// @description  Add points
// @author       sma11sun
// @match        https://www.spirit.com/account/manage-pool
// @match        https://api.spirit.com/prod-family-pooling/graphql
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spirit.com
// @grant        GM_log
// @grant        GM_openInTab
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489615/Spirit.user.js
// @updateURL https://update.greasyfork.org/scripts/489615/Spirit.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_log("Code By sma11sun.");

    // 获取invitationid
    var invitationid = null;
    var url = null

    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        var self = this;

        this.onreadystatechange = function () {
            if (self.readyState === 4) {
                GM_log(self.responseText);
                var obj = JSON.parse(self.response);
                if (obj['data']['addFamilyPoolMemberByEmail']['familyPoolInviteId'] != null) {
                    invitationid = obj['data']['addFamilyPoolMemberByEmail']['familyPoolInviteId']
                    url = 'https://www.spirit.com/account-login?url=%2Faccount%2Fmy-pool&INVITATIONID=' + invitationid;
                    GM_log(url)
                   
                    GM_openInTab(url)
                    // GM_xmlhttpRequest({
                    //     method: "GET", url: url,
                    //     onload: function (response) {
                    //         GM_log(response.responseText)
                    //     }
                    // })

                }
            }
        };

        originalSend.apply(this, arguments);

    }

    

})();
