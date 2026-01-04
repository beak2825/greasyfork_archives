// ==UserScript==
// @name        Revert Google search
// @description Alters Google search results to have the old design without favicons
// @run-at      document-end
// @version     0.3
// @namespace   com.example
// @include     https://www.google.com/search?*
// @require     https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/395282/Revert%20Google%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/395282/Revert%20Google%20search.meta.js
// ==/UserScript==

(function() {
  $(".r").find("a").each(function() {
    $(this).find("br").remove();
    $(this).append("<br/>");

    // URL and favicon bar
    $(this).find(".TbwUpd").detach().appendTo($(this).parent());
    $(this).parent().find(".TbwUpd").find("cite").css("color", "#026F24");
    $(this).parent().find(".TbwUpd").css("vertical-align", "top");

    // Google cache little arrow
    $(this).parent().find(".yWc32e").detach().appendTo($(this).parent());
    $(this).parent().find(".yWc32e").css("padding-top", "0px");
    $(this).parent().find(".yWc32e").css("padding-bottm", "0px");

    // URL and favicon bar
    $(this).parent().find(".B6fmyf").remove();

    // Main title
    $(this).find(".LC20lb").css("margin-bottom", "0px");
  });
  // Favicon
  $(".xA33Gc").remove();
})();