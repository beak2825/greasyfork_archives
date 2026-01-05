// ==UserScript==
// @name         Yota Keep-Alive Session
// @namespace    localhost
// @version      0.1
// @author       EnterBrain
// @description  Plugin for best experience Yota 4G.
// @icon         https://static.yota.ru/webapps/yotaSC-theme/images/icon/favicon-16x16.png
// @icon64       https://static.yota.ru/webapps/yotaSC-theme/images/icon/favicon-96x96.png
// @match        https://my.yota.ru/*
// @grant        all
// @require      https://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/18666/Yota%20Keep-Alive%20Session.user.js
// @updateURL https://update.greasyfork.org/scripts/18666/Yota%20Keep-Alive%20Session.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //==variables==//

    var intervalID = 0;

    //==variables==//

    intervalID = setInterval(refresh(), 2000);

    function refresh(){
        var url = window.location.href;
        if ( /profile|cards|finances|devices/.test(url) ){
            $.ajax({
				type: "GET",
				url: url,
				success: function(data, status, xhr) {
					var newUrl = xhr.getResponseHeader('TM-finalURLdhdg');
					//console.log("newUrl:"+newUrl);
					if ( /login/.test(newUrl) ){
						console.log("clearInterval:"+intervalID);
						clearInterval(intervalID);
					}
				}
			});
        }
    }
})();