// ==UserScript==
// @name        Parador de música irritante
// @namespace   asdf
// @description para a música irritante
// @include     http://55chan.org/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17931/Parador%20de%20m%C3%BAsica%20irritante.user.js
// @updateURL https://update.greasyfork.org/scripts/17931/Parador%20de%20m%C3%BAsica%20irritante.meta.js
// ==/UserScript==
window.onload = function() {
  $('iframe').remove();
};