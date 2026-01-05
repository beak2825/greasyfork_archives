// ==UserScript==
// @name         Plonter Save Builds Plugin
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Allows you to save & load builds on plonter
// @author       DaCurse0
// @copyright    2017+, DaCurse0
// @match        http://www.plonter.co.il/buildyourownpc-v2.tmpl
// @require      https://code.jquery.com/jquery-latest.min.js
// @namespace    https://greasyfork.org/users/62051
// @downloadURL https://update.greasyfork.org/scripts/27251/Plonter%20Save%20Builds%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/27251/Plonter%20Save%20Builds%20Plugin.meta.js
// ==/UserScript==

$(function() {
  function c(a) {
    return sPos = String(a), '<li style="direction:rtl;margin-left:30px;">מפרט #' + sPos + ': <a href="#" id="save' + sPos + '"><u>שמור</u></a>  <a href="#" id="load' + sPos + '"><u>טען</u></a></li>'
  }
  var a = "position:fixed;z-index:2147483647;background-color:white;top:260px;right:10px;width:200px;height:190px;border-radius:6px;box-shadow:0px 0px 5px 0px #000000;direction:ltr;",
    b = '<div id="spl_main" style="' + a + '"><h4 style="text-align:center;"><u><b>פלאגין שמירת מפרטים</b></u></h4><ul style="list-style:none;" id="spl_list"></ul><a href="#" id="spl_reset" style="color:red;text-decoration:underline;margin-left:58%;">אפס מפרטים</a></div>';
  $(".inner_wrapper").append(b), $("#spl_reset").on("click", function() {
    if (!confirm("האם אתה בטוח שברצונך לאפס את כל המפרטים ששמרת?")) return !1;
    for (var a = 1; a <= 5; a++) delete localStorage["savedConfig" + String(a)];
    alert("כל המפרטים נמחקו בהצלחה")
  });
  for (var d = 1; d <= 5; d++) $("#spl_list").append(c(d)), $("#save" + String(d)).on("click", function() {
    var a = "savedConfig" + $(this).attr("id").substr(4);
    localStorage[a] = localStorage.savedConfiguration, alert("נשמר בהצלחה!")
  }), $("#load" + String(d)).on("click", function() {
    var a = "savedConfig" + $(this).attr("id").substr(4);
    return "undefined" == typeof localStorage[a] ? (alert("לא נשמר פה כלום..."), !1) : (localStorage.savedConfiguration = localStorage[a], void location.reload())
  })
});