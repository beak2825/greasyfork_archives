// ==UserScript==
// @name         remove-elpais.com.uy-redirect
// @description  Evitar redirect de registro en www.elpais.com.uy
// @version  1
// @grant    none
// @include      http://elpais.com.uy/*
// @include      http://www.elpais.com.uy/*
// @include      https://elpais.com.uy/*
// @include      https://www.elpais.com.uy/*
// @namespace    https://github.com/lufte
// @downloadURL https://update.greasyfork.org/scripts/37183/remove-elpaiscomuy-redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/37183/remove-elpaiscomuy-redirect.meta.js
// ==/UserScript==

setTimeout(
  function() {
    unsafeWindow.showEPDSw = false;
  }, 
  1000  // La redirección ocurre a los 4 segundos (https://sc2.elpais.com.uy/js/epd_sw.js?1514887374)
);