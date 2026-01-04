// ==UserScript==
// @name         Neopets - Clock Always Visible
// @author       Vincent_r_a
// @match        http://www.neopets.com/*
// @version      1
// @namespace    Vincent_r_a
// @description  Will make the NST Clock visible when you scroll down.
// @downloadURL https://update.greasyfork.org/scripts/401507/Neopets%20-%20Clock%20Always%20Visible.user.js
// @updateURL https://update.greasyfork.org/scripts/401507/Neopets%20-%20Clock%20Always%20Visible.meta.js
// ==/UserScript==

function isVisible($el) {
  var winTop = $(window).scrollTop();
  var winBottom = winTop + $(window).height();
  var elTop = $el.offset().top;
  var elBottom = elTop + $el.height();
  return ((elBottom<= winBottom) && (elTop >= winTop));
}


$(window).scroll(function() {
    if (!isVisible($("#navigation"))) {
        $("#nst").css({
            "position":"fixed",
            "bottom":"5px",
            "right":"5px",
            "background-color":$("ul.dropdown").css("background-color"),
            "border":"1px solid black",
            "padding":"8px",
            "font-size":"12px"
        });
    } else {
        $("#nst").css({
            "position":"",
            "bottom":"",
            "right":"",
            "background-color":"",
            "border":"",
            "padding":"",
            "font-size":""
        });
    }
});