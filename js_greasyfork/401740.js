// ==UserScript==
// @name         Call for assist
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Send message to jump in for assist
// @author       Jox [1714547]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        GM_xmlhttpRequest
// @connect      nukefamily.org
// @downloadURL https://update.greasyfork.org/scripts/401740/Call%20for%20assist.user.js
// @updateURL https://update.greasyfork.org/scripts/401740/Call%20for%20assist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(addAction, 500);

    function addAction(){
        let nav = document.querySelector('.linksContainer___E11fx');
        let link = document.createElement('a');
        link.classList.add('linkContainer___AOKtu','inRow___uFQ4S','greyLineV___mY84h','link-container-Back');

        link.innerHTML += `<span class="iconContainer___q3CES linkIconContainer___IqlVh">
                          <svg xmlns="http://www.w3.org/2000/svg" class="" filter="" fill="" stroke="#990000" stroke-width="1" width="12.47" height="17" viewBox="0 1 11.47 16"><path d="M3.46,17H9.12V12.29A6,6,0,0,0,10.59,9L9,9.06,6.61,8v1.1H5.44l2.34,1.11L6.61,13.49,6,10.79,2.32,8.46V7.83L5.44,8,6.61,6.85l-4.5-2L0,8.08l3.46,4.3Zm6.66-9,1.61-1.42-.58-1.63L9.46,7.61ZM9,6.85,10.43,4,8.81,3.21l-1,3.64ZM6.61,5.74,8.25,2.63,6.46,1.87l-.77,3ZM2.73,3.84l2,.9L5.8,1.62,4.41,1Z"></path>
                          </svg>
                          </span>
                          <span>Call Assist</span>`;
        link.addEventListener('click', e => {
            e.preventDefault();
            //alert('help me!!!');

            let player = document.querySelectorAll('.playersModelWrap___h62rQ .user-name');

            var postData = {content: `${player[0].innerHTML} needs help attacking ${player[1].innerHTML}\n` + location.href};

            GM_xmlhttpRequest ( {
                method:     'POST',
                url:        'https://nukefamily.org/dev/assistme.php',
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