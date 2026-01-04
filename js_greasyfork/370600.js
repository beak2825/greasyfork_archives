// ==UserScript==
// @name         Torn Readability
// @version      1.0.6
// @description  Makes the chat in Torn more readable.
// @author       Nemithrell
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        none
// @namespace    Nemithrell
// @downloadURL https://update.greasyfork.org/scripts/370600/Torn%20Readability.user.js
// @updateURL https://update.greasyfork.org/scripts/370600/Torn%20Readability.meta.js
// ==/UserScript==

//Setting variable for storing font size
var fontSize = localStorage.getItem("tr_fontsize") ? localStorage.getItem("tr_fontsize") : "16px";

//getting chat root
var chatRoot = document.getElementById("chatRoot");
var config = {
  childList: true
};

//Creating CSS for settings window in preferences.php
if (window.location.pathname == "/preferences.php") {
  window.onload = function() {
    var style_settings = document.createElement("style");
    style_settings.type = "text/css";
    style_settings.innerHTML = `
         .trSettings { width: 100%; height: auto; background-color: #F2F2F2; border-radius: 6px; padding: 0px 16px 8px 16px; box-sizing: border-box; }
         .trDivLine { width: 100%; height: 16px; padding-top: 6px; padding-bottom: 6px; }
         .trLabel { font-size: 14px; }
         .trTextInput { -webkit-appearance: none; width: 88%; float: right; height: 16px; border: 1px solid #999999; padding-left: 8px; }
         .trHeader { width: 100%; height: 18px; padding: 6px 0px 6px 0px; font-size: 18px; font-weight: bold; color: #555555; }
         .trSeperator { display: block; height: 1px; border: 0; border-top: 1px solid #CCCCCC; margin: 1em 0; padding 0; }
         .trDivButton { width: 100%; height: 16px; padding-top: 6px; padding-bottom: 6px; display: flex; align-items: center; justify-content: center; }
         .trButton { width: 128px; background: #D5D5D5; padding: 4px 0px 4px 0px; margin: 2px 2px 0px 2px; border: 2px solid #999999; }`
    document.head.appendChild(style_settings);

//Creating settings window
    var clear = document.createElement("div");
    clear.className = "clear";
    var settings = document.createElement("div");
    settings.className = "trSettings";

    var div_header = document.createElement("div");
    div_header.className = "trHeader";
    var span_header = document.createElement("span");
    span_header.innerText = "Torn Readability Settings";
    div_header.appendChild(span_header);
    settings.appendChild(div_header);

    var hr_seperator = document.createElement("hr");
    hr_seperator.className = "trSeperator";
    settings.appendChild(hr_seperator);

    var div_fontSize = document.createElement("div");
    div_fontSize.className = "trDivLine";
    var span_fontSize = document.createElement("span");
    span_fontSize.className = "trLabel";
    span_fontSize.innerText = "Font size:";
    var text_fontSize = document.createElement("input");
    text_fontSize.type = "text";
    text_fontSize.value = localStorage.getItem("tr_fontsize") ? localStorage.getItem("tr_fontsize") : "16px";
    text_fontSize.className = "trTextInput";
    text_fontSize.id = "txt_fontsize";
    div_fontSize.appendChild(span_fontSize);
    div_fontSize.appendChild(text_fontSize);
    settings.appendChild(div_fontSize);


    var div_save = document.createElement("div");
    div_save.className = "trDivButton";
    var button_save = document.createElement("button");
    button_save.type = "button";
    button_save.innerText = "Save";
    button_save.className = "trButton";
    button_save.id = "btn_save";
    var button_reset = document.createElement("button");
    button_reset.type = "button";
    button_reset.innerText = "Reset";
    button_reset.className = "trButton";
    button_reset.id = "btn_reset";
    div_save.appendChild(button_save);
    div_save.appendChild(button_reset);
    settings.appendChild(div_save);

    var cw = document.getElementById("mainContainer").children[document.getElementById("mainContainer").childElementCount - 2];
    cw.appendChild(clear);
    cw.appendChild(settings);

//Save variables
    document.getElementById("btn_save").addEventListener("click", function() {
      let fs = document.getElementById("txt_fontsize");
      let tsr = document.getElementById("txt_TSReadability");

      localStorage.setItem("tr_fontsize", fs.value);
      localStorage.setItem("tr_TSReadability", tsr.checked);
    });
//Reset variables
    document.getElementById("btn_reset").addEventListener("click", function() {
      localStorage.removeItem("tr_fontsize");
      localStorage.removeItem("tr_TSReadability");
    });
  };
}

//Setting fontsize for chat in CSS
  var cssstr = ""
  cssstr+=`div[class^="_message"] { font-size: ` + fontSize + ` }`

  if (cssstr != "") {
      var style = document.createElement('style');
      style.type = "text/css";
      style.innerHTML = cssstr;
      document.head.appendChild(style);
  }