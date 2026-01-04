// ==UserScript==
// @name:ru     kemono.su - Микс скрипт
// @name        kemono.su - Mix script
// @namespace   kemono-su_Re_Nyako
// @match       https://kemono.cr/*
// @grant       none
// @version     0.1.2
// @author      https://t.me/Nyako_TW
// @license     Apache License 2.0
// @description 30.07.2024, 10:20:47
// @description:ru 30.07.2024, 10:20:47
// @downloadURL https://update.greasyfork.org/scripts/502672/kemonosu%20-%20Mix%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/502672/kemonosu%20-%20Mix%20script.meta.js
// ==/UserScript==
function error_print(err, text_data) {
  console.log("[ERROR] "+text_data+"\nName: "+err.name+"\nInfo: "+err.message+"\nDetail: "+err.stack)
}
if (window.location.pathname == "/") {
  try {
    input_text = document.createElement("input");
    input_text.setAttribute("id", "q");
    input_text.setAttribute("class", "search-input");
    input_text.setAttribute("type", "text");
    input_text.setAttribute("name", "q");
    input_text.setAttribute("autocomplete", "off");
    input_text.setAttribute("value", "");
    input_text.setAttribute("minlength", "2");
    input_text.setAttribute("placeholder", "search for posts...");
    input_text.setAttribute("style", "width: 100%; opacity: 0.8;");
    input_ok = document.createElement("input");
    input_ok.setAttribute("type", "submit");
    input_ok.setAttribute("style", "display: none");
    form_res = document.createElement("form");
    form_res.setAttribute("action", "/posts");
    form_res.setAttribute("method", "GET");
    form_res.setAttribute("enctype", "application/x-www-form-urlencoded");
    form_res.appendChild(input_text);
    form_res.appendChild(input_ok);
    document.getElementsByClassName("jumbo-welcome-description-header")[0].innerHTML = "";
    document.getElementsByClassName("jumbo-welcome-description-header")[0].appendChild(form_res);
  } catch (err) {
    error_print(err, "Render search line")
  }
  try {
    document.getElementsByClassName("jumbo-welcome-mascot")[0].remove();
  } catch (err) {
    error_print(err, "Mascot remove")
  }
}
if (window.location.pathname == "/posts") {
  try {
    search_bar = document.getElementsByClassName("search-input")[0];
    search_bar.setAttribute("style", "width: 100%");
  } catch (err) {
    error_print(err, "Search bar change")
  }
}