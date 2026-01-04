// ==UserScript==
// @name        Free amazon books
// @namespace   Violentmonkey Scripts
// @match       https://www.amazon.com/*
// @grant       none
// @version     1.001
// @author      Ogun
// @description 5/5/2021, 9:30:43 PM
// @downloadURL https://update.greasyfork.org/scripts/426004/Free%20amazon%20books.user.js
// @updateURL https://update.greasyfork.org/scripts/426004/Free%20amazon%20books.meta.js
// ==/UserScript==



var url = window.location.href ;
var isbn = url.match(/dp.\d+/);

isbn = isbn[0].replace("dp/","");
if (isbn != null){
  
  var url_link = "https://libgen.is/search.php?req="+ isbn +  "&lg_topic=libgen&open=0&view=simple&res=25&phrase=1&column=identifier"
  var link = document.getElementById('acrCustomerReviewLink');

  link.setAttribute('href', url_link);

  var span = document.getElementById('acrCustomerReviewText');
  span.style.color = 'green';
  span.style.fontSize = 'x-large';
  span.innerHTML = 'libgen' ;
}
else{
  
  
}

