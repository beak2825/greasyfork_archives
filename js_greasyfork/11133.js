// ==UserScript==
// @name        Jennifer Hirano Google Link Creator
// @description Create google search link
// @version       0.1
// @include       https://s3.amazonaws.com/*
// @author        blankboyz
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/11133/Jennifer%20Hirano%20Google%20Link%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/11133/Jennifer%20Hirano%20Google%20Link%20Creator.meta.js
// ==/UserScript==
var r_name = document.getElementsByTagName('TD')[1];
var city_name = document.getElementsByTagName('TD')[5];


var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_name.innerHTML) + '  '+ encodeURIComponent(city_name.innerHTML);
link2.innerHTML = 'Google';
r_name.parentNode.insertBefore(link2, r_name.nextSibling);
