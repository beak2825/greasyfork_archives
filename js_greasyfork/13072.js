// ==UserScript==
// @author      Christopher Engel - christopher.engel@outlook.com
// @name        Uncheck Google Two Factor Authorization Trust This Device 
// @namespace   ugssi
// @description Disable google's automatic "Dont ask again on this computer" checkbox when entering Two Factor code
// @include     http://accounts.google.tld/*
// @include     https://accounts.google.tld/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13072/Uncheck%20Google%20Two%20Factor%20Authorization%20Trust%20This%20Device.user.js
// @updateURL https://update.greasyfork.org/scripts/13072/Uncheck%20Google%20Two%20Factor%20Authorization%20Trust%20This%20Device.meta.js
// ==/UserScript==

var chkbox = document.getElementById('trustDevice');
chkbox.removeAttribute('checked');