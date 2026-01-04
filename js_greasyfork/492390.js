// ==UserScript==
// @name 舍利护眼 - 用科技保护健康
// @namespace eye-safe-mode
// @author 茹莱本座
// @version 1.02
// @license LGPL
// @description 自由调节护眼功能，最好的护眼模式插件
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant none
// @require https://code.jquery.com/jquery-3.4.0.js
// @include *://*/*
// @downloadURL https://update.greasyfork.org/scripts/492390/%E8%88%8D%E5%88%A9%E6%8A%A4%E7%9C%BC%20-%20%E7%94%A8%E7%A7%91%E6%8A%80%E4%BF%9D%E6%8A%A4%E5%81%A5%E5%BA%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/492390/%E8%88%8D%E5%88%A9%E6%8A%A4%E7%9C%BC%20-%20%E7%94%A8%E7%A7%91%E6%8A%80%E4%BF%9D%E6%8A%A4%E5%81%A5%E5%BA%B7.meta.js
// ==/UserScript==
$($("*")[0]).append("<style>.slhy_main{position:absolute;top:1mm;right:1mm;height:auto;width:30%;border:1px solid #000}.slhy_small_sub{height:15%;background-color:#666;border-bottom:2px solid #000}.slhy_title{font-weight:700;font-size:120%;word-spacing:-.4}.slhy_bigsub{height:85%;background-color:#888}.slhy_bigsub *{display:inline-block}.slhy_button{background-color:#45bfe4;border:1px solid #fff;color:#fff;text-align:center;mix-blend-mode:lighten;font-size:90%;cursor:pointer;padding:1mm}.slhy_right{float:right;margin-right:1mm}.slhy_left{float:left;margin-left:1mm}.slhy_preview{border:1mm solid #000;min-width:4mm;min-height:4mm}.slhy_input{width:15mm;padding:1mm}.slhy_input::placeholder{padding:.5mm;color:#d3d3d3}</style><div class=\"slhy_main slhy_disableHY\"> <div class=\"slhy_small_sub slhy_header slhy_title_bar slhy_disableHY\"> <big class=\"slhy_title slhy_disableHY\">舍利护眼管理面板</big> <div class=\"slhy_button slhy_right slhy_disableHY\" onclick=\"alert(slhy.aboutInfo.join(\\\"\\\\n\\\"))\">关于</div> </div> <div class=\"slhy_bigsub slhy_mainplane slhy_disableHY\"> <p class=\"slhy_preview slhy_disableHY\" id=\"slhy_previewBGColor\" title=\"预览 背景颜色\"></p> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"背景颜色 R\" oninput=\"slhy.css.background_color = slhy._BuildRGBColorStr(parseInt(this.value), parseInt(slhy._bgColorGInputElem.value), parseInt(slhy._bgColorBInputElem.value))\"/> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"背景颜色 G\" oninput=\"slhy.css.background_color = slhy._BuildRGBColorStr(parseInt(slhy._bgColorRInputElem.value), parseInt(this.value), parseInt(slhy._bgColorBInputElem.value))\"/> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"背景颜色 B\" oninput=\"slhy.css.background_color = slhy._BuildRGBColorStr(parseInt(slhy._bgColorRInputElem.value), parseInt(slhy._bgColorGInputElem.value), parseInt(this.value))\"/> <br class=\"slhy_disableHY\"/> <p class=\"slhy_preview slhy_disableHY\" id=\"slhy_previewTColor\" title=\"预览 文字颜色\"></p> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"文字颜色 R\" oninput=\"slhy.css.color = slhy._BuildRGBColorStr(parseInt(this.value), parseInt(slhy._colorGInputElem.value), parseInt(slhy._colorBInputElem.value))\"/> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"文字颜色 G\" oninput=\"slhy.css.color = slhy._BuildRGBColorStr(parseInt(slhy._colorRInputElem.value), parseInt(this.value), parseInt(slhy._colorBInputElem.value))\"/> <input type=\"number\" max=\"255\" min=\"0\" class=\"slhy_input slhy_disableHY\" placeholder=\"文字颜色 B\" oninput=\"slhy.css.color = slhy._BuildRGBColorStr(parseInt(slhy._colorRInputElem.value), parseInt(slhy._colorGInputElem.value), parseInt(this.value))\"/> <br class=\"slhy_disableHY\"/> <p class=\"slhy_preview slhy_disableHY\" id=\"slhy_previewTSize\" title=\"预览 文字大小\">12345678</p> <input type=\"range\" max=\"26\" min=\"13\" step=\"2\" class=\"slhy_disableHY\" oninput=\"slhy.css.font_size = this.value\"> <br class=\"slhy_disableHY\"/> <p class=\"slhy_preview slhy_disableHY\" id=\"slhy_previewWSpacing\" title=\"预览 文字间距\">hello world</p> <input type=\"range\" max=\"2\" min=\"-2\" step=\"0.1\" class=\"slhy_disableHY\" oninput=\"slhy.css.word_spacing = this.value\"> <br class=\"slhy_disableHY\"/> <div class=\"slhy_button slhy_disableHY\" id=\"slhy_save_button\">保存</div> <div class=\"slhy_button slhy_disableHY\" id=\"slhy_apply_button\">应用</div> <div class=\"slhy_button slhy_disableHY\" id=\"slhy_reset_button\">重置</div> </div> </div>")

window.slhy = new Object();

slhy.saveConfig = function (configStr) {
  GM_setValue("slhy_cfg", configStr);
}

slhy.readConfig = function () {
  return slhy.decodeConfig(GM_getValue("slhy_cfg", "background_color:darkgrey;color:skyblue;font_size:5mm;word_spacing:1.5"));
}

slhy.encodeConfig = function (configObj) {
  return Object.entries(configObj).map((co) => co[0] + ":" + co[1] + ";").join("").replace(/\;$/, "");
}

slhy.decodeConfig = function (configStr) {
  return Object.fromEntries(configStr.split(";").filter((co) => typeof co === typeof "" && !co.trim() == "").map((co) => co.split(":")));
}

slhy.updateCSS = function (cssObj) {
  if ($("#slhycss").length === 0) {
    $("head").append("<style id=\"slhycss\"></style>");
  }
  $("#slhycss").text("* {" + Object.entries(cssObj).map((cp) => cp[0].replaceAll("_", "-") + ": " + cp[1] + "; ").join("") + "}");
}

slhy.resetConfig = function () {
  slhy.css = {
    background_color: "darkgrey",
    color: "skyblue",
    font_size: "5mm",
    word_spacing: "1.5"
  };
  GM_deleteValue("slhy_css");
  updateCSS();
  window.location.reload();
}

slhy._BuildRGBColorStr = function (r, g, b) {
  return "rgb(" + r + "," + g + "," + b + ")";
}

slhy._bgColorRInputElem = $(".slhy_bigsub input")[0];
slhy._bgColorGInputElem = $(".slhy_bigsub input")[1];
slhy._bgColorBInputElem = $(".slhy_bigsub input")[2];
slhy._colorRInputElem = $(".slhy_bigsub input")[3];
slhy._colorGInputElem = $(".slhy_bigsub input")[4];
slhy._colorBInputElem = $(".slhy_bigsub input")[5];
slhy._fontSizeInputElem = $(".slhy_bigsub input")[6];
slhy._wordSpacingInputElem = $(".slhy_bigsub input")[7];

slhy._bgColorPreviewBox = $("#slhy_previewBGColor");
slhy._colorPreviewBox = $("#slhy_previewTColor");
slhy._fontSizePreviewBox = $("#slhy_previewTSize");
slhy._wordSpacingPreviewBox = $("#slhy_previewWSpacing");

slhy.css = slhy.readConfig();

$("#slhy_apply_button").click(slhy.updateCSS);
$("#slhy_reset_button").click(slhy.resetConfig);
$("#slhy_save_button").click(() => {slhy.saveConfig(slhy.encodeConfig(slhy.css))});

slhy._bgColorRInputElem.on("input", slhy.updateBgColorPreview);
slhy._bgColorGInputElem.on("input", slhy.updateBgColorPreview);
slhy._bgColorBInputElem.on("input", slhy.updateBgColorPreview);
slhy._colorRInputElem.on("input", slhy.updateColorPreview);
slhy._colorGInputElem.on("input", slhy.updateColorPreview);
slhy._colorBInputElem.on("input", slhy.updateColorPreview);
slhy._fontSizeInputElem.on("input", slhy.updateFontSizePreview);
slhy._wordSpacingInputElem.on("input". slhy.updateWordSpacingPreview)

slhy.updateBgColorPreview = function () {
  slhy._bgColorPreviewBox.style.backgroundColor = slhy.css.background_color;
}
slhy.updateColorPreview = function () {
  slhy._colorPreviewBox.style.color = slhy.css.color;
}
slhy.updateFontSizePreview = function () {
  slhy._fontSizePreviewBox.style.fontSize = slhy.css.font_size;
}
slhy.updateWordSpacingPreview = function () {
  slhy._wordSpacingPreviewBox.style.wordSpacing = slhy.css.word_spacing
}