// ==UserScript==
// @name         LostFilm.tv автоматический вход
// @namespace    LostFilm
// @version      0.1
// @description  автоматический вход с логином и паролем
// @author       drakulaboy
// @include      *lostfilm.tv/login
// @grant        none
// @icon         http://lostfilm.tv/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/28628/LostFilmtv%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B2%D1%85%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/28628/LostFilmtv%20%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9%20%D0%B2%D1%85%D0%BE%D0%B4.meta.js
// ==/UserScript==

var mail = "ваш_логин";
var pass = "ваш_пароль";

$(function() {
  $("input[name=mail]").val(mail);
  $("input[name=pass]").val(pass);
  $("div.bnt-pane > input").click();
});