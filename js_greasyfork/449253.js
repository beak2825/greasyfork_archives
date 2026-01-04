// ==UserScript==
// @name         zara urun bulucu
// @license MUMU
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  zarada yeni urunleri bulun!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @include     *://*.zara.*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/449253/zara%20urun%20bulucu.user.js
// @updateURL https://update.greasyfork.org/scripts/449253/zara%20urun%20bulucu.meta.js
// ==/UserScript==

let arr = [];

async function playAudio() {
  var audio = new Audio('https://cdn.freesound.org/previews/456/456966_6456158-lq.mp3');
  audio.type = 'audio/mp3';
  try {
    await audio.play();

    console.log('Playing...');
  } catch (err) {
    console.log('Failed to play...' + err);
  }
}

function check(){
    let arr2 = [];
    console.log("checking products");
    $( 'ul.carousel__items > li > div > div' ).each(function(i, obj) {
        arr2.push($( obj ).children('img').attr('alt'));
    });
    const arr = GM_getValue('arr', []);
    arr2 = arr2.sort();
    if(arr.length === 0 || (arr.length === arr2.length && arr.every((value, index) => value === arr2[index]))){
        console.log("arrays are the same");
        console.log("arr: ", arr);
        console.log("arr2: ", arr2);
    } else {
        console.log("arr: ", arr);
        console.log("arr2: ", arr2);
        playAudio();
        alert("Yeni ürünler var!");
    }

    GM_setValue('arr', arr2);
    setTimeout(function(){
        window.location.reload();

        check();
    }, 60*5*1000);

}

(function() {
    'use strict';
    setTimeout(function(){
        check();
    }, 1000);
})();