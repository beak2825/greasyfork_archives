// ==UserScript==
// @name        Sofia BOYZ
// @description Create google search link
// @version       0.1
// @include       https://s3.amazonaws.com/*
// @author        blankboyz
// @copyright    2012+, You
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/12384/Sofia%20BOYZ.user.js
// @updateURL https://update.greasyfork.org/scripts/12384/Sofia%20BOYZ.meta.js
// ==/UserScript==
var r_one = document.getElementsByTagName('TD')[1];
var r_two = document.getElementsByTagName('INPUT')[3].value = 'no results found';

var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_one.innerHTML) + ' ' + 'CEO';
link2.innerHTML = 'CEO';
r_one.parentNode.insertBefore(link2, r_one.nextSibling);

var link4 = document.createElement('a');
link4.target = '_blank';
link4.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_one.innerHTML) + ' ' + 'chief executive officer';
link4.innerHTML = 'Chief';
r_one.parentNode.insertBefore(link4, r_one.nextSibling);

var link3 = document.createElement('a');
link3.target = '_blank';
link3.href = 'http://www.google.com/search?q=' + encodeURIComponent(r_one.innerHTML) + ' ' + 'staff';
link3.innerHTML = 'Staff';
r_one.parentNode.insertBefore(link3, r_one.nextSibling);