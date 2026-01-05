// ==UserScript==
// @name        Robert
// @description Create google search link
// @version       3.0
// @include       https://www.mturkcontent.com/*
// @require       http://code.jquery.com/jquery-latest.min.js
// @author        blankboyz
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/16265/Robert.user.js
// @updateURL https://update.greasyfork.org/scripts/16265/Robert.meta.js
// ==/UserScript==
var one = document.getElementsByTagName('INPUT')[1].value = 'NA';
var two = document.getElementsByTagName('INPUT')[2].value = 'NA';
var three = document.getElementsByTagName('INPUT')[3].value = 'NA';
var four = document.getElementsByTagName('INPUT')[4].value = 'NA';
var five = document.getElementsByTagName('INPUT')[5].value = 'NA';
var six = document.getElementsByTagName('INPUT')[6].value = 'NA';

var r_one = document.getElementsByTagName('P')[2];
var res = r_one.innerHTML.replace('The Company Name is:','');
console.log(r_one);
console.log(res);

var link2 = document.createElement('a');
link2.target = '_blank';
link2.href = 'http://www.google.com/search?q=' + encodeURIComponent(res) + ' ' + 'site:linkedin.com';
link2.innerHTML = 'Linkedin';
r_one.parentNode.insertBefore(link2, r_one.nextSibling);

var link3 = document.createElement('a');
link3.target = '_blank';
link3.href = 'http://www.google.com/search?q=' + encodeURIComponent(res) + ' ' + 'site:manta.com';
link3.innerHTML = 'Manta';
r_one.parentNode.insertBefore(link3, r_one.nextSibling);