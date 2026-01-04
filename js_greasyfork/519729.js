// ==UserScript==
// @name         Get Duolingo JWT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Support get Duolingo JWT
// @author       lamduck
// @match        https://www.duolingo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519729/Get%20Duolingo%20JWT.user.js
// @updateURL https://update.greasyfork.org/scripts/519729/Get%20Duolingo%20JWT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCookieValue(cookieName) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(cookieName + '=')) {
                return cookie.substring(cookieName.length + 1);
            }
        }
        return null;
    }

    // Hàm xử lý khi nhấn vào nút
    function handleJwtExtraction() {
        var jwtTokenValue = getCookieValue('jwt_token');
        if (jwtTokenValue) {
            var tempTextarea = document.createElement('textarea');
            tempTextarea.value = jwtTokenValue;
            document.body.appendChild(tempTextarea);
            tempTextarea.select();
            tempTextarea.setSelectionRange(0, 99999);
            document.execCommand('copy');
            document.body.removeChild(tempTextarea);
            prompt('', jwtTokenValue); 
        } else {
            alert("Run the code while being on duolingo.com.");
        }
    }

    var button = document.createElement('button');
    button.innerText = 'JWT';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.padding = '10px 20px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '1000';

    button.onclick = handleJwtExtraction;

    document.body.appendChild(button);
})();
