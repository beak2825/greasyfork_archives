// ==UserScript==
// @name            dwindly auto clicker
// @name:ja         dwindlyを自動でクリック
// @namespace       http://dwindlyautoclicker/
// @version         1.0
// @description     dwindly auto click.
// @description:ja  dwindlyを自動でクリック。スキップもできるかも
// @author          plgdown
// @include         *://dwindly.io/*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant           none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/40885/dwindly%20auto%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/40885/dwindly%20auto%20clicker.meta.js
// ==/UserScript==

(function() {
  if(document.getElementById("btd1") != null){
    document.getElementById("btd1").click(); 
  }else if(document.getElementById("btd") != null){
    var a = $("script:contains('window.open(encD')").html();
    document.location.href = encD(a.split("window.open(")[1].split(",")[0].split("\"")[1]);
  };
})();
