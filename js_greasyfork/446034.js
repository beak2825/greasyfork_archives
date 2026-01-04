// ==UserScript==
// @name           BoyzTube paywall remover
// @description    description
// @author         Dmitry SCS <gthescs@gmail.com> (http://github.com/thescs)
// @namespace      https://boyztube.com/
// @version        0.0.1
// @icon           https://github.com/favicon.ico
// @match        https://www.boyztube.com/*
// @grant          none
// @run-at         document-end
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/446034/BoyzTube%20paywall%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/446034/BoyzTube%20paywall%20remover.meta.js
// ==/UserScript==

/* jshint asi: true, esnext: true, -W097 */

(function($) {
  'use strict'
  $("#freeMember").remove();
  $("#loggedinMember").remove();
  var element = document.getElementsByClassName('freeHide');
  var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "attributes" && $('.freeHide').attr('style') !== "") {
        $(".freeHide").attr("style", "");
      console.log("attributes changed")
    }
  });
});

observer.observe(element[0], {
  attributes: true
});

}).bind(this)(jQuery)

jQuery.noConflict()
