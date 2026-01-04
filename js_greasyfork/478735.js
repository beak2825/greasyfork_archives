// ==UserScript==
// @name     Api Key Grabber by Perfect
// @version  0.3
// @grant    GM_setClipboard
// @match    https://steamcommunity.com/dev*
// @namespace https://greasyfork.org/users/1208248
// @description Api key grabber
// @downloadURL https://update.greasyfork.org/scripts/478735/Api%20Key%20Grabber%20by%20Perfect.user.js
// @updateURL https://update.greasyfork.org/scripts/478735/Api%20Key%20Grabber%20by%20Perfect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var element = document.getElementById('domain');
    if (element) {
        element.value = 'test';
    }

    var checkbox = document.getElementById('agreeToTerms');
    if (checkbox) {
        checkbox.click();
    }

    var buttons = document.getElementsByName('Submit');
    if (buttons.length > 0) {
        buttons[0].click();
    }

    var keyElement = document.getElementById("bodyContents_ex").querySelector("p");
    if (keyElement && keyElement.innerText.includes('Key:')) {
        var key = keyElement.innerText.split(" ")[1];
        GM_setClipboard(key);

        // Save to local storage
        if (localStorage.getItem('keys') === null) {
            var keysArray = [];
            keysArray.push(key);
            localStorage.setItem('keys', JSON.stringify(keysArray));
        } else {
            var keysArray = JSON.parse(localStorage.getItem('keys'));
            keysArray.push(key);
            localStorage.setItem('keys', JSON.stringify(keysArray));
        }

        // Create download button
        var downloadButton = document.createElement('button');
        downloadButton.innerHTML = 'Скачать';
        downloadButton.style.margin = '5px';
        downloadButton.onclick = function() {
            var downloadLink = document.createElement('a');
            downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(keysArray.join('\n'));
            downloadLink.download = 'keys.txt';
            downloadLink.style.display = 'none';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        };
        document.body.appendChild(downloadButton);

        // Create clear button
        var clearButton = document.createElement('button');
        clearButton.innerHTML = 'Удалить ключи';
        clearButton.style.margin = '5px';
        clearButton.onclick = function() {
            localStorage.removeItem('keys');
            location.reload();
        };
        document.body.appendChild(clearButton);

        // Create sign out button
        var signOutButton = document.createElement('button');
        signOutButton.innerHTML = 'Выйти';
        signOutButton.style.margin = '5px';
        signOutButton.onclick = function() {
            Logout();
        };
        document.body.appendChild(signOutButton);
    }
})();