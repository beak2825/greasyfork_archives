// ==UserScript==
// @name         Youtube Popup
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388316/Youtube%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/388316/Youtube%20Popup.meta.js
// ==/UserScript==

const message = "Test text";
const button_text = "Yes";

const timeout = 5000; // In milliseconds
const popup_scale = 1; // Here you can set the size of the popup. 1 is 100% (normal size), 2 is 200% (double). 1.5 is 150%...

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////

(function() {
    'use strict';
    const css_style = `<style>
.custom-popup {
position: fixed;
background: #000000df;
z-index: 99999999;
width: 100%;
height: 100%;
animation: appearIn 0.25s;
display: flex;
justify-content: center;
align-items: center;
transform: scale(${popup_scale});
}

.accept-btn {
font-size: 25px;
padding: 9px 30px;
background: #c42f2a;
border: none;
color: white;
border-radius: 8px;
/* box-sizing: border-box; */
box-shadow: 0px 7px 0px #9d2622;
cursor: pointer;
}

.custom-popup__container { width: 500px; height: 300px; background: #FFFFFF; animation: bringDown 0.25s; display: flex; justify-content: center; align-items: center;flex-flow: column; border-radius: 7px;}
.container__message {height: 67%; display: flex; justify-content: center; align-items: center;        font-size: 25px;
padding: 0px 50px;
width: 100%;
box-sizing: border-box;
text-align: center;}

.container__buttons {height: 33%; display: flex; justify-content: center; align-items: center;    font-size:19px;
padding: 0px 20px;
width: 100%;
box-sizing: border-box;}

@keyframes appearIn { 0% {opacity: 0;} 100% {opacity: 1;} }
@keyframes bringDown { 0% {opacity: 0; margin-top: -100px;} 100% {opacity: 1; margin-top: 0px;} }
</style>`;
    const popup_element = `${css_style}<div class="custom-popup"><div class="custom-popup__container"><div class="container__message">${message}</div><div class="container__buttons"><button class="accept-btn">Yes</button></div></div></div>`;
    let timeoutCallback = undefined;
    let popupShown = false;

    /*
    setTimeout(() => {
        $('body').append(popup_element);
        $('body').on('click', '.accept-btn', x => {
            $('.custom-popup').fadeOut(170, function(){ $('.custom-popup').remove(); });
        });
    }, timeout);
    */

    $(document).on('mousemove scroll click', () => {
        clearTimeout(timeoutCallback);
        timeoutCallback = setTimeout(() => {
            if(!popupShown){
                $('body').append(popup_element);
                $('body').on('click', '.accept-btn', x => {
                    $('.custom-popup').fadeOut(170, function(){ $('.custom-popup').remove(); });
                });
                popupShown = true;
            }

        }, timeout);
    });

})();