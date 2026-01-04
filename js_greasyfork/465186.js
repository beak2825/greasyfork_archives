// ==UserScript==
// @name        auto jump page - manhuabika.com
// @namespace   Violentmonkey Scripts
// @match       https://manhuabika.com/*
// @grant       none
// @version     1.3
// @author      fhyjs
// @description 2023/4/28 14:10:55
// @license MIT
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js
// @require https://cdn.bootcdn.net/ajax/libs/js-cookie/3.0.2/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/465186/auto%20jump%20page%20-%20manhuabikacom.user.js
// @updateURL https://update.greasyfork.org/scripts/465186/auto%20jump%20page%20-%20manhuabikacom.meta.js
// ==/UserScript==
(function () {
  window.jQuery310 = $.noConflict(true);
  blockad = true;
  console.log("loading");
  $(document).ready(function () {
    if (window.location.href.includes("pcomiclist")) { //mode{1:save,2:shoudset,3:clear}
      smode = 1;
    }
    else if (window.location.href.includes("pcomicview")) {
      smode = 2;
    }
    else {
      smode = 2;
      if (!window.location.href.includes("pchapter"))
        smode = 3;
    }
    op = -1;
    mt();
    console.log("ok");
  });

  window.mt = function mt() {
    var at=$("a");
        for (let index = 0; index < at.length; index++) {
            var ht=$(at[index]).attr("href");
            if (blockad&&typeof ht != "undefined" && ht.substr(0,4)=="/ad/") {
                console.log("remove ad");
                $(at[index]).remove();
            }
        }
    if (smode == 1) {

      if (typeof Cookies.get("should-set") != "undefined") {
        if (catPage.toString() != Cookies.get("page-save")) {
          $(".my-input-page").val(Cookies.get("page-save"));
          jumpToPage();
          setTimeout("mt()", "1000");
          return;
        }
        Cookies.remove('should-set', op, {
          expires: 1,
          path: '/'
        })
      }
      cp = catPage;
      if (cp != op) {
        op = cp;
        console.log("Page was Changed:" + op);
        Cookies.set('page-save', op, {
          expires: 1,
          path: '/'
        })
      }
    }
    if (smode == 2) {
      Cookies.set('should-set', true, {
        expires: 1,
        path: '/'
      })
    }
    if (smode == 3) {
      if (typeof closeMoadl != "undefined" && blockad){
        closeMoadl();
        $(".my-insert-flag").hide();
      }
      Cookies.remove('page-save', op, {
        expires: 1,
        path: '/'
      })
      Cookies.remove('should-set', op, {
        expires: 1,
        path: '/'
      })
    }
    setTimeout("mt()", "100");
  }
})();
