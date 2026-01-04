// ==UserScript==
// @name        Brainslayer DD-WRT Theme Improver
// @version     1
// @match       http://192.168.0.1/*
// @match       http://192.168.1.1/*
// @match       http://192.168.2.1/*
// @match       http://10.0.0.1/*
// @match       http://10.0.1.1/*
// @match       https://192.168.0.1/*
// @match       https://192.168.1.1/*
// @match       https://192.168.2.1/*
// @match       https://10.0.0.1/*
// @match       https://10.0.1.1/*
// @description Improves the functionality of the brainslayer theme for DD-WRT
// @grant       none
// @namespace https://greasyfork.org/users/1783
// @downloadURL https://update.greasyfork.org/scripts/368285/Brainslayer%20DD-WRT%20Theme%20Improver.user.js
// @updateURL https://update.greasyfork.org/scripts/368285/Brainslayer%20DD-WRT%20Theme%20Improver.meta.js
// ==/UserScript==

let el = document.querySelector('div.submitFooter')
el.style.position = 'fixed'
el.style.backgroundColor = '#FAF9F9'
el = document.querySelector('div#menu')
el.style.backgroundColor = '#FAF9F9'
el = document.querySelector('iframe#syslog')
if (el) {
  document.querySelector('div#content').id = 'main'
}