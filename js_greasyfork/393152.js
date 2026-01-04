// ==UserScript==
// @name         atcoder_create_filename
// @version      0.1
// @description  It create good filename of atcoder.
// @author       azennto
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @namespace    https://github.com/azenntoyuchi
// @downloadURL https://update.greasyfork.org/scripts/393152/atcoder_create_filename.user.js
// @updateURL https://update.greasyfork.org/scripts/393152/atcoder_create_filename.meta.js
// ==/UserScript==



//インターフェースの作成
(function() {
  var element_main = document.getElementsByClassName("col-sm-12");
  var url = location.href;
  var filename_str= "'"+ url.split("/")[6] + ".cpp'";

  //ボタンのCSSをheadにぶちこむ
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.textContent =
    "#create_filename_button{\n"+
      "position: absolute;\n"+
      "left: 87%;\n"+
      "padding: 10px 20px;\n"+
    "}";
  document.head.appendChild(style);

  //jsをheadにぶちこむ
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.textContent =
    "function copy_filename(str){\n"+
      "var copyFrom = document.createElement('textarea');\n"+
      "copyFrom.textContent = str;\n"+
      "var bodyElm = document.getElementsByTagName('body')[0];\n"+
      "bodyElm.appendChild(copyFrom);\n"+
      "copyFrom.select();\n"+
      "document.execCommand('copy');\n"+
      "bodyElm.removeChild(copyFrom);\n"+
    "}";
  document.head.appendChild(script);

  //ボタンおしたらfilename_strをクリップボードに保存したい
  var button = document.createElement("button");
  button.setAttribute("id", "create_filename_button");
  button.setAttribute("onclick","copy_filename("+filename_str+")");
  button.textContent = "filename copy";
  element_main[1].insertBefore(button,element_main[1].firstChild);
})();
