// ==UserScript==
// @name        La Nacion no-login
// @namespace   gaston-lanacion
// @include     *://*.lanacion.com.ar/*
// @version     1
// @description Saltear la ventana de login en lanacion.com.ar
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/28784/La%20Nacion%20no-login.user.js
// @updateURL https://update.greasyfork.org/scripts/28784/La%20Nacion%20no-login.meta.js
// ==/UserScript==

$('#lnmodal pantalla-completa login').remove();