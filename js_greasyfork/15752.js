// ==UserScript==
// @name        Julia REMOVE TEXT BOYZ
// @description lol
// @version       2.0
// @include https://www.mturkcontent.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/15752/Julia%20REMOVE%20TEXT%20BOYZ.user.js
// @updateURL https://update.greasyfork.org/scripts/15752/Julia%20REMOVE%20TEXT%20BOYZ.meta.js
// ==/UserScript==

var r_one = document.getElementsByTagName('P')[2];
var res = r_one.innerHTML.replace('The name to search is: &nbsp;','');
console.log(r_one);
console.log(res);

var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'https://www.facebook.com/search/results.php?q=' + encodeURIComponent(res);
link2.innerHTML = 'Google';
r_one.parentNode.insertBefore(link2, r_one.nextSibling);

var na = document.getElementsByTagName('TEXTAREA')[0].value = 'NA';

$('input[value="no_profile_found"]').click();

$(window).keyup(function(oph) { 
    if (oph.which == 49) {  $( "#submitButton" ).click();  }
});
