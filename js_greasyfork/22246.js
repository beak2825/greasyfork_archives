// ==UserScript==
// @name         Oduzależniacz
// @version      1.0
// @description  Skrypt, który informuje cię, że wszedłeś na stronę od której jesteś uzależniony.
// @author       trzye
// @grant        none
// @include      *
// @namespace https://greasyfork.org/users/13725
// @downloadURL https://update.greasyfork.org/scripts/22246/Oduzale%C5%BCniacz.user.js
// @updateURL https://update.greasyfork.org/scripts/22246/Oduzale%C5%BCniacz.meta.js
// ==/UserScript==

badDomains = [
    "stackoverflow.com",
    "wykop.pl",
    "facebook.com",
    "4chan.org"
]

if (badDomains.indexOf(window.location.hostname) > -1) 
  alert("You'r addicted to this site, are you sure you want to use it?")