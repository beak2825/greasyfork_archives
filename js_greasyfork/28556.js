// ==UserScript==
// @name         Wishlist profile linkifier and contest search fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       noeatnosleep
// @match        https://www.reddit.com/r/Wishlist/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28556/Wishlist%20profile%20linkifier%20and%20contest%20search%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/28556/Wishlist%20profile%20linkifier%20and%20contest%20search%20fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

var flairs=document.getElementsByClassName('flair');
    for(var i=0;i<flairs.length;i++){flairs[i].innerHTML='<a href=\''+flairs[i].title+'\'>Profile</a>'}})();



var url1,url2;
url1 = ['www.reddit.com/r/Wishlist/search?q=flair:%27contest%27+OR+flair:%27closed%27&restrict_sr=on&sort=new&feature=legacy_search'];
url2 = ['www.reddit.com/r/Wishlist/search?q=flair:%27contest%27&restrict_sr=on&sort=new&feature=legacy_search' ]; 
var a, links;
var tmp="a";
var p,q;
links = document.getElementsByTagName('a');
for (var i = 0; i < links.length; i++) {
    a = links[i];
    for(var j=0;j<url1.length; j++)
    {
    tmp = a.href+"" ;
    if(tmp.indexOf(url1[j]) != -1)
    {
    p=tmp.indexOf(url1[j]) ;
    q="http://";
    q = q + url2[j] + tmp.substring(p+url1[j].length,tmp.length);
    a.href=q ;
    }
    }
    }




document.addEventListener("DOMContentLoaded", replaceLinks, false );

if( document.readyState === "complete" ) {
    replaceLinks();
}

function replaceLinks() {
    Array.forEach( document.links, function(a) {
        a.href = a.href.replace( "'contest'+OR+flair:'closed'&amp", "'contest'&amp");
    });
}