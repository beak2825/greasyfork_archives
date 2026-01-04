// ==UserScript==
// @name         M.A.Y.A
// @namespace    hardy.maya
// @version      1.1
// @description  Helps you and your spouse to track the Vault Transactions
// @author       Hardy[2131687]
// @match        https://www.torn.com/properties.php*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect   script.google.com
// @downloadURL https://update.greasyfork.org/scripts/395888/MAYA.user.js
// @updateURL https://update.greasyfork.org/scripts/395888/MAYA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //setting up options for user to set the webapp link
    function setWebapp(link, defaultvalue, menuText, promptText) {
        GM_registerMenuCommand(menuText, function() {
            var value = prompt(promptText, GM_getValue(link, defaultvalue));
            if (value === null) {
                return;
            }
            GM_setValue(link, value);
        });
    }



    setWebapp(
        'link',
        '',
        "Webapp",
        'Enter the Link to Webapp here:'
    );

    var webapp = GM_getValue('link');


    //getting details of the user
    var user_id = $("script[src*='js/chat/chat']").attr("uid");
    var username = $("script[src*='js/chat/chat']").attr("name");

//defining a function to send data to your Webapp
    function sendData(bish) {
        var data = JSON.parse(bish);
        var send = {};
        send["vault"] = {}
        send["vault"]["info"] = username + '['+ user_id + ']';
        send["vault"]["text"] = data["text"];
        if (webapp == '') {
            console.log("Webapp is not set.");
        } else {
            GM_xmlhttpRequest({
                method: "POST",
                data: JSON.stringify(send),
                url: webapp,
                onload: function(e) {
                    console.log("Data has been sent to your Webapp.");
                }
            });
        }
    }

    //main function

    $(document).ajaxComplete(function(event, jqXHR, ajaxObj) {
        if (location.hash.includes('tab=vault')) {
            if (ajaxObj.url.split("?")[0] == 'properties.php') {
                if (ajaxObj.data.split("&")[0] == 'step=vaultProperty') {
                    sendData(jqXHR.responseText);
                }
            }
        }
    });
})();
