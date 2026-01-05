// ==UserScript==
// @name        Alex Crowman
// @description Create google search link
// @version       2.0
// @include       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/12646/Alex%20Crowman.user.js
// @updateURL https://update.greasyfork.org/scripts/12646/Alex%20Crowman.meta.js
// ==/UserScript==
var r_org1 = document.getElementsByTagName('TD')[1];
var r_org2 = document.getElementsByTagName('TD')[5];
var search = document.getElementsByTagName('TD')[7];
var search1 = document.getElementsByTagName('TD')[11];
var search2 = document.getElementsByTagName('TD')[13];




var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_org1.innerHTML) +' '+ encodeURIComponent(r_org2.innerHTML)  +' '+ encodeURIComponent(search.innerHTML) +' '+ encodeURIComponent(search1.innerHTML) +' '+ encodeURIComponent(search2.innerHTML);
link2.innerHTML = 'Google';
search.parentNode.insertBefore(link2, search.nextSibling);

var link3 = document.createElement('a');
link3.target = '_blank';
link3.href = 'http://www.google.com/search?q=' + encodeURIComponent(search.innerHTML) +' '+ encodeURIComponent(search1.innerHTML) +' '+ encodeURIComponent(search2.innerHTML);
link3.innerHTML = 'Company';
search.parentNode.insertBefore(link3, search.nextSibling);
