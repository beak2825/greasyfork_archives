// ==UserScript==
// @name         Twitter REMOVE from feed: Who to Follow, Topics to Follow, and Promoted Tweets
// @version      2
// @author       Visualplastik
// @match        https://twitter.com/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @namespace https://greasyfork.org/users/726331
// @description Remove Who to Follow and Topics to Follow
// @downloadURL https://update.greasyfork.org/scripts/420034/Twitter%20REMOVE%20from%20feed%3A%20Who%20to%20Follow%2C%20Topics%20to%20Follow%2C%20and%20Promoted%20Tweets.user.js
// @updateURL https://update.greasyfork.org/scripts/420034/Twitter%20REMOVE%20from%20feed%3A%20Who%20to%20Follow%2C%20Topics%20to%20Follow%2C%20and%20Promoted%20Tweets.meta.js
// ==/UserScript==

function gtfo() {
    $( "span:contains('Who to follow')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide().next().hide().next().hide();
    $( "span:contains('Topics to follow')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide();
    $( "article span:contains('Promoted')" ).parent().parent().parent().parent().parent().hide().next().hide().next().hide().next().hide();
    $( "span:contains('Promoted by')" ).parent().parent().parent().parent().hide().next().hide().next().hide().next().hide();
    $( "span:contains('Promoted Tweet')" ).parent().parent().parent().parent().hide();
    $( "span:contains('Promoted')" ).parent().parent().parent().parent().parent().hide();
    console.log('removed');
}

//Initial Run
setTimeout(function(){
    gtfo();
}, 3000);

//Repeat on Scroll - Thanks Ganymed_ for suggestion
$( window ).scroll(function() {
  gtfo();
});