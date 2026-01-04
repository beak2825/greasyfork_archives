// ==UserScript==
// @name         Animation Remove
// @namespace    ar.nao.zero
// @version      0.3
// @description  animation remove
// @author       nao
// @match        https://www.torn.com/item.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/502281/Animation%20Remove.user.js
// @updateURL https://update.greasyfork.org/scripts/502281/Animation%20Remove.meta.js
// ==/UserScript==

const originalAjax = $.ajax;

$.ajax = function (options) {
    console.log(options);
    if (options.url && options.url.includes("page.php?sid=inventory")) {
        console.log(options);
        const originalSuccess = options.success;
        options.success = function (data, textStatus, jqXHR) {
            console.log(data);
            let responsedata = data;
            responsedata.modelled = "None";
            responsedata.modelPosition = {"x":null, "y":null, "z":null};
            responsedata.modelHdri = "";




           data = responsedata;

            console.log("Response Change");
            console.log(responsedata);

            if (originalSuccess){
                originalSuccess(data, textStatus, jqXHR);
            }

        };

    }



    return originalAjax(options);
}


