// ==UserScript==
// @name         Facebook Remove Suggested and Sponsored Posts (Beta)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Remove Suggested for You and Sponsored posts (Beta)
// @author       Visualplastik
// @match        https://www.facebook.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420887/Facebook%20Remove%20Suggested%20and%20Sponsored%20Posts%20%28Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420887/Facebook%20Remove%20Suggested%20and%20Sponsored%20Posts%20%28Beta%29.meta.js
// ==/UserScript==



function gtfo() {

    //Remove Suggested for You
    $( "span:contains('Suggested for you')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide();

    document.querySelectorAll('svg').forEach((el) => {
        if(parseInt(el.style.width.replace('px','')) + parseInt(el.style.marginRight.replace('px','')) > 54) {
            console.log('ad found');
           el.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
    })
}

//Initial Run
setTimeout(function(){
    gtfo();
}, 3000);

//Repeat on Scroll
$( window ).scroll(function() {
  gtfo();
});

