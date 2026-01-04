// ==UserScript==
// @name         Alis.io Unban
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Bypass alis.io ban
// @author       Yuu
// @match        http://alis.io/
// @icon        http://alis.io/assets/img/banned2.jpg
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/377222/Alisio%20Unban.user.js
// @updateURL https://update.greasyfork.org/scripts/377222/Alisio%20Unban.meta.js
// ==/UserScript==

/*global userid, playerDetails*/

setInterval(function(){
  var skinInput = document.getElementById("skinurl")
  Object.values(playerDetails).forEach(player=>{if(player.uid==userid)player.skinUrl=skinInput.value});
}, 5000);

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
            jwt = 0;
            var jwt2 = 0;
            // Store
            // Retrieve
            var decoded = 0;
            //console.log(decoded);
            userid = decoded.sub;
            //$('#coinswidget .modal-body').append('<iframe src="https://api.paymentwall.com/api/?key=5d6242e544963c739e2c1d0288a15279&uid=' + userid + '&widget=w6_1" width="" height="" style="width:100%;height:100%;min-width:800px;min-height:640px;" frameborder="0"></iframe>');
            getupgrades(userid);
            updatePlayerDetails();
        }
    }
    var failure = function(error) {
        console.log('login failed with error:');
        var message = JSON.parse(error.responseText);
        console.log(message);
    }
    // run the api call specified and wait for its response
    apicall(url, method, data, success, failure)
}
