// ==UserScript==
// @name         Assist Request
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Assist request script
// @author       Sarlacc [2161398]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/419551/Assist%20Request.user.js
// @updateURL https://update.greasyfork.org/scripts/419551/Assist%20Request.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(addAssist, 500);
    function addAssist(){
        let nav = document.querySelector('.titleContainer___37lPS');
        let link = document.createElement('a');
        link.classList.add('linkContainer___47uQr','inRow___J1Bmd','greyLineV___HQIEI','link-container-Back');
        link.innerHTML += `<span class="iconContainer___2qPqa linkIconContainer___y6qJ3">
                          <svg xmlns="http://www.w3.org/2000/svg" class="" filter="" fill="" stroke="transparent" stroke-width="0" width="12.47" height="17" viewBox="0 1 11.47 16"><path d="M3.46,17H9.12V12.29A6,6,0,0,0,10.59,9L9,9.06,6.61,8v1.1H5.44l2.34,1.11L6.61,13.49,6,10.79,2.32,8.46V7.83L5.44,8,6.61,6.85l-4.5-2L0,8.08l3.46,4.3Zm6.66-9,1.61-1.42-.58-1.63L9.46,7.61ZM9,6.85,10.43,4,8.81,3.21l-1,3.64ZM6.61,5.74,8.25,2.63,6.46,1.87l-.77,3ZM2.73,3.84l2,.9L5.8,1.62,4.41,1Z"></path>
                          </svg>
                          </span>
                          <span>ASSIST ME!</span>`;
        link.addEventListener('click', e => {
            e.preventDefault();

            let player = document.querySelectorAll('.playersModelWrap___3qL-2 .user-name');

            var postData = {content: `${player[0].innerHTML} needs help attacking ${player[1].innerHTML}\n` + location.href};

            GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'https://discord.com/api/webhooks/794970741669494794/yW1ymQvXH2xG6F3kjCHfqWO0W1U4boRFs1aqrdzgJvKaE-n_jBVJ8-ghUbUKQen1Ncul',
                headers:    {'Content-Type': 'application/json'},
                data:       JSON.stringify(postData),
                onload:     function (responseDetails) {
                    // DO ALL RESPONSE PROCESSING HERE...
                    console.log(responseDetails, responseDetails.responseText);
                }
            });
        })
        nav.appendChild(link);
    }
})();