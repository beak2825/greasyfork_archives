// ==UserScript==
// @name        Error icon on site-front for blocked sites 
// @namespace   english
// @description Error icon on site-front for blocked sites ~
// @include     http*://*fotor.com*
// @version     1.9
// @run-at document-end
// @grant       GM_addStyle
// @license MIT
// @include     http*://*forbes.com*
// @include     http*://*upworthy.com*
// @include     http*://*lyricsmania.com*
// @include     http*://*zdnet.com*
// @include     http*://*bloomberg.com*
// @include     http*://*wpmudev.org*
// @include     http*://*attitude.co.uk*
// @include     http*://*freepik.com*
// @include     http*://*freevector.com*
// @include     http*://*vecteezy.com*
// @include     http*://*websiteplanet.com*
// @include     http*://*youtubnow.com*
// @include     http*://*wsj.com*


// @downloadURL https://update.greasyfork.org/scripts/467045/Error%20icon%20on%20site-front%20for%20blocked%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/467045/Error%20icon%20on%20site-front%20for%20blocked%20sites.meta.js
// ==/UserScript==


// Main - CSS hides two classes - video add box, and call to action box under it. - also social media


var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = '   #puka-error{width:233px;height:233px; background-image:url("https://pushka.com/p/wp-content/uploads/2023/05/error-pushka-com.png");background-repeat:no-repeat;background-size:233px 233px ;z-index:999999;position:absolute;display:block;top: 90px;left:90px;}         ';
document.getElementsByTagName('head')[0].appendChild(style);



//https://pushka.com/p/wp-content/uploads/2023/05/error-pushka-com.png

 

 

document.body.innerHTML += '<div id="puka-error"></div>';



