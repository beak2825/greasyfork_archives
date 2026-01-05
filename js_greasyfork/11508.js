// ==UserScript==
// @name        Church BOYZ
// @description Create google search link
// @version       2.0
// @include       https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @author        blankboyz
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/11508/Church%20BOYZ.user.js
// @updateURL https://update.greasyfork.org/scripts/11508/Church%20BOYZ.meta.js
// ==/UserScript==
var r_org = document.getElementsByTagName('SPAN')[21];
var r_address = document.getElementsByTagName('SPAN')[23];
var r_city = document.getElementsByTagName('SPAN')[25];
var r_state = document.getElementsByTagName('SPAN')[27];
var r_zip = document.getElementsByTagName('SPAN')[29];
var search = document.getElementsByTagName('SPAN')[34];


var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_org.innerHTML) +' '+ encodeURIComponent(r_address.innerHTML)  +' '+ encodeURIComponent(r_city.innerHTML) +' '+ encodeURIComponent(r_city.innerHTML) +' '+ encodeURIComponent(r_state.innerHTML) +' '+ encodeURIComponent(r_zip.innerHTML);
link2.innerHTML = 'Google';
search.parentNode.insertBefore(link2, search.nextSibling);

var link = document.createElement('a');
link.target = '_blank';
link.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_org.innerHTML) +' '+ encodeURIComponent(r_address.innerHTML)  +' '+ encodeURIComponent(r_city.innerHTML) +' '+ encodeURIComponent(r_city.innerHTML) +' '+ encodeURIComponent(r_state.innerHTML) +' '+ encodeURIComponent(r_zip.innerHTML) + ' ' + 'pastor';
link.innerHTML = 'Pastor Search';
search.parentNode.insertBefore(link, search.nextSibling);


$('input[name="Website URL"]').val($('input[name="Website URL').val()+'N/A');
$('input[name="Organization Name"]').val($('input[name="Organization Name').val()+'N/A');
$('input[name="Address"]').val($('input[name="Address').val()+'N/A');
$('input[name="City"]').val($('input[name="City').val()+'N/A');
$('input[name="Zip Code"]').val($('input[name="Zip Code').val()+'N/A');
$('input[name="First Name"]').val($('input[name="First Name').val()+'N/A');
$('input[name="Last Name"]').val($('input[name="Last Name').val()+'N/A');
$('input[name="Job Title"]').val($('input[name="Job Title').val()+'N/A');
$('input[name="Phone"]').val($('input[name="Phone').val()+'N/A');
$('input[name="State"]').val($('input[name="State').val()+'N/A');