// ==UserScript==
// @name          DNR
// @namespace     https://forum.dentphoto.com/board/*
// @description   replace nickname and name
// @match       https://forum.dentphoto.com/board/*
// @exclude       https://forum.dentphoto.com/login/*
// @version 20220730
// @downloadURL https://update.greasyfork.org/scripts/426968/DNR.user.js
// @updateURL https://update.greasyfork.org/scripts/426968/DNR.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////
// MAIN

document.body.innerHTML= document.body.innerHTML.replace(/cooltoys/g,"Pizza");
document.body.innerHTML= document.body.innerHTML.replace(/김인우/g,"피자보이");
document.body.innerHTML= document.body.innerHTML.replace(/피지스/g,"피지스");
