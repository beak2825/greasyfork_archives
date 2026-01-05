// ==UserScript==
// @name         Better Donnons.org
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  improve website features
// @author       Romain Racamier
// @match        https://donnons.org/don/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29383/Better%20Donnonsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/29383/Better%20Donnonsorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var convs = document.querySelectorAll('.f-container.conv-line');

    convs.forEach(function(conv){

        var url = conv.querySelector('a.f-container');
        var content = url.querySelector('.f-grow-1');
        url = url.href;

        fetch(url, {
            credentials: 'same-origin'
        }).then(function(response){ return response.text();}).then(function(html){
            var htmlEl = document.createElement("div");
            htmlEl.innerHTML = html;
            var message = htmlEl.querySelector('.peekboo.lui').innerText;
            if (!message) {
                message = 'Failed at getting the message...';
            }
            var newHtml = '<span class="message" style="color: navy; font-weight: 600; padding-left: 10px; margin-top: 15px; display: block; border-left: 4px solid;">';
            newHtml += message;
            newHtml += '</span>';
            content.innerHTML += newHtml;
        });

    });

})();