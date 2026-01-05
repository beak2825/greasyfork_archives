// ==UserScript==
// @name       Pioneer N/As
// @author Dormammu
// @version    11.0
// @description helps with hits
// @match       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/12971/Pioneer%20NAs.user.js
// @updateURL https://update.greasyfork.org/scripts/12971/Pioneer%20NAs.meta.js
// ==/UserScript==

var r_org = document.getElementsByTagName('B')[0];
var r_address = document.getElementsByTagName('B')[1];
var r_city = document.getElementsByTagName('B')[3];


var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_org.innerHTML) +' '+ encodeURIComponent(r_address.innerHTML)  +' '+ encodeURIComponent(r_city.innerHTML);
link2.innerHTML = 'Google';
r_org.parentNode.insertBefore(link2, r_org.nextSibling);


$('#name').val($('#name').val()+'NA'); 
$('#ph').val($('#ph').val()+'NA'); 
$('#fax').val($('#fax').val()+'NA');
$('#email').val($('#email').val()+'NA'); 