// ==UserScript==
// @name        Creation Chat remover
// @namespace   jiggmin
// @include     http://jiggmin.com/forum.php
// @version     1
// @description removes creation-chat
// @downloadURL https://update.greasyfork.org/scripts/2200/Creation%20Chat%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/2200/Creation%20Chat%20remover.meta.js
// ==/UserScript==
var oldc = document.getElementsByClassName("creation")
oldc[0].parentNode.removeChild(oldc[0])