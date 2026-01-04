// ==UserScript==
// @name         FaceBook Delete all friends
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  open the page with the list of friends.set russian language. enable script. update page and press START. max remove is 600 per day
// @author       jmatg1
// @match        https://*.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454618/FaceBook%20Delete%20all%20friends.user.js
// @updateURL https://update.greasyfork.org/scripts/454618/FaceBook%20Delete%20all%20friends.meta.js
// ==/UserScript==
(function() {
    'use strict';

    if(!confirm('START?')) return;


    const delay = 1000;
    let scroll = 0;
    let arrayFunc = [];
    let foundFriends = 0;
    let lastFoundFriends = 0;
    const doit = () => {
        setTimeout(() => {
            console.log(arrayFunc)
            arrayFunc[0]();
            arrayFunc = arrayFunc.slice(1);
            if(arrayFunc.length) {
                doit();
            }
        }, delay);
    }

    function sleep(sec) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }

    const start = () => {
        $('[aria-label="Друзья"]').each(function(){
            const $this = $(this);
            arrayFunc.push(() => {
                $(window).scrollTop($this.offset().top - 116);
                $this.click();
            });
            arrayFunc.push(() => {
                $("span:contains('Удалить из друзей')").click();
            });
            arrayFunc.push(() => {
                $("span:contains('Подтвердить')").click();
                $('#deleted').text(foundFriends - Math.round(arrayFunc.length / 3));
                $('#time').text(Math.round(arrayFunc.length / 60) + 'min');
                if(arrayFunc.length <= 1){
                alert('Done!');
                }
            });
        })

           doit();
    }

    async function scan() {
         $(document).scrollTop($(document).height());
        await sleep(2);
        foundFriends = $('[aria-label="Друзья"]').length;
        if(lastFoundFriends === foundFriends || foundFriends >= 1000) {
           console.log('SCAN READY');
           start();
            return
        }
        lastFoundFriends = foundFriends;
        console.log('FOUND: ', foundFriends);
        $('#count').text(foundFriends);
        scan();
    }

    function render() {
       $('body').append(`
       <div style="position: fixed; background-color: red; top: 0; padding: 5px; color: white; font-size: 16px;">
       <div>Friends found: <span id="count">0</span></div>
       <div>Deleted friends: <span id="deleted">0</span></div>
       <div>Time left: <span id="time">0</span></div>
       </div>`)
    }

    $( document ).ready(function() {

        scan();
        render();


    });



    
})();











