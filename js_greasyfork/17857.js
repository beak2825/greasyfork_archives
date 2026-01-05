// ==UserScript==
// @name        titulky.com - poloskrytí slovenských titulků
// @namespace   monnef.tk
// @include     http://www.titulky.com/*
// @include     https://www.titulky.com/*
// @version     3
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.1/jquery.min.js
// @description poloskrytí slovenských titulků
// @downloadURL https://update.greasyfork.org/scripts/17857/titulkycom%20-%20poloskryt%C3%AD%20slovensk%C3%BDch%20titulk%C5%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/17857/titulkycom%20-%20poloskryt%C3%AD%20slovensk%C3%BDch%20titulk%C5%AF.meta.js
// ==/UserScript==

'use strict';

const t = this || window;
t.$ = t.jQuery = jQuery.noConflict(true);

t.$(function () {
  const $ = t.$;
  $('head').append($("<style>.sk_marker { opacity: 0.15; transition: opacity 1s; } .sk_marker:hover { opacity: 1; }</style>"));
  $('table.soupis img[alt="SK"]').each(function () {
    var e = $(this);
    e.closest('tr').addClass('sk_marker');
  });
});
