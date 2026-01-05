// ==UserScript==
// @name        Nautiljon signatures off
// @description Désactive les signatures sur Nautiljon
// @namespace   http://userscripts.org/users/349422
// @include     https://www.nautiljon.com/forum/*
// @version     1.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4628/Nautiljon%20signatures%20off.user.js
// @updateURL https://update.greasyfork.org/scripts/4628/Nautiljon%20signatures%20off.meta.js
// ==/UserScript==

$("td.vtop > hr.small").each(function() {
  var $contents = $(this).parent().contents();
  var $sign = $contents.slice($contents.index(this)+1).wrapAll("<div>").parent();
  var $button = $("<a style='cursor:pointer; float:right; text-decoration:none'>▲</a>");
  var signToggle = function() {
    var a = "alt", b = "src";
    if($sign.toggle().is(":visible")) a = "src", b = "alt";
    $sign.find("img").each(function() {
      var $img = $(this);
      $img.attr(a, $img.attr(b));
      $img.attr(b, "");
    });
    $button.text($sign.is(":visible") ? "▲" : "▼");
  };
  $button.insertBefore($sign).click(signToggle);
  signToggle();
});