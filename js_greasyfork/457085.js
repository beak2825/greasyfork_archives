// ==UserScript==
// @name         鲸
// @namespace    https://github.com/mefengl
// @version      0.0.4
// @description  🐋 潜入海底，浮出水面
// @author       mefengl
// @match        http://*/*
// @match        https://*/*
// @exclude      https://www.baidu.com/
// @icon         none
// @require      https://cdn.staticfile.org/jquery/3.6.1/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457085/%E9%B2%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/457085/%E9%B2%B8.meta.js
// ==/UserScript==

(function () {
  "use strict";
  $(function () {
    // if page's height is less than 1000px, then return
    if (document.body.scrollHeight < 1000) return;

    // if page's height is less than 2000px, then make button less visible
    const hide_right = document.body.scrollHeight < 3000 ? "-130px" : "-120px";

    // create the button
    $("<button>深潜</button>")
      .click(function () {
        // scroll to the bottom of the page, if already at the bottom, then scroll to the top
        if (document.body.scrollHeight - window.innerHeight - window.scrollY < 100) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          $(this).text("深潜").css({ "background-color": "#0d47a1", color: "#fff" });
        } else {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          $(this).text("浮出").css({ "background-color": "#e0e0e0", color: "#000", border: "1px solid #a0a0a0" });
        }
      })
      .css({ "background-color": "#0d47a1", color: "#fff", position: "fixed", width: "140px", top: "220px", right: hide_right, "z-index": "999999", opacity: "0.8", border: "none", "border-radius": "4px", padding: "10px 16px", "font-size": "18px", cursor: "pointer", })
      .hover(
        // hover to show, and hide when not hover
        function () { $(this).stop().animate({ right: "-10px", }, 400); },
        function () { $(this).stop().animate({ right: hide_right, }, 400); }
      )
      .appendTo("body");

    // hide button if full screen
    $(document).on("fullscreenchange", function () {
      document.fullscreenElement ? $button.hide() : $button.show();
    });
  });
})();
