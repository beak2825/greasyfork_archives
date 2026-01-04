// ==UserScript==
// @name         Bypass Banned
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  trying..
// @author       .wmp#8652
// @match        http://alis.io/
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377062/Bypass%20Banned.user.js
// @updateURL https://update.greasyfork.org/scripts/377062/Bypass%20Banned.meta.js
// ==/UserScript==

unsafeWindow.getJWT=function(userid, accesstoken) {
    jwt = null; // flush out our jwt.
    var url = '/api/auth/facebook';
    var method = 'POST';
    var data = {
        userID: userid,
        accessToken: accesstoken,
    };
    var success = function(response) {
        if (!response.token) {
            console.log('webservice failed to provide JWT');
            if (response.message) {
              $('#coingrid').css('display', 'none');
                swal("Could not log in via facebook: ", response.message, "error");
                $("#socialcard .uk-card").html('<p>' + response.message + '</p>');
            }
        } else {
            jwt = response.token;
            var jwt2 = response.token.split(/[.]/);
            console.log("%ctoken:", "font-weight:bold;");
            console.log("%c" + jwt2[0] + ".%c" + jwt2[1] + ".%c" + jwt2[2], "font-size:10px;color:#fb015b;", "font-size:10px;color:#d63aff;", "font-size:10px;color:#00b9f1;", '');

            //$("#jwt").text(jwt);
            // Why was this changed?
            $("#jwt").val(jwt);
            // Store
            localStorage.setItem("jwt", jwt);
            // Retrieve
            var decoded = jwt_decode(jwt);
            //console.log(decoded);
            userid = decoded.sub;
            //$('#coinswidget .modal-body').append('<iframe src="https://api.paymentwall.com/api/?key=5d6242e544963c739e2c1d0288a15279&uid=' + userid + '&widget=w6_1" width="" height="" style="width:100%;height:100%;min-width:800px;min-height:640px;" frameborder="0"></iframe>');
            getupgrades(userid);
            updatePlayerDetails();
            // try to renew the users JWT every 20 minutes
            setInterval(renewJWT, 20 * 60 * 1000);
        }
    };
    var failure = function(error) {
        console.log('login failed with error:');
        var message = JSON.parse(error.responseText);
        console.log(message);
    };
    // run the api call specified and wait for its response
    apicall(url, method, data, success, failure);
};