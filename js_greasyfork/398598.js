//-----------------------------------------------------------------------------
// [WoD] Item type / skill bonus auto completion
// Copyright (c) Jim Zhai
//-----------------------------------------------------------------------------
// ==UserScript==
// @name          Wod auto completion
// @author        Jim Zhai
// @namespace     org.toj
// @version       0.6.1
// @description   Add auto completion text field for item type and skill bonus selector
// @include       http*://*.world-of-dungeons.*/wod/*
// @exclude       http*://*.world-of-dungeons.*/wod/spiel/hero/skillconf*
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/js/select2.min.js
// @resource      select2-css https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.3/css/select2.min.css
// @downloadURL https://update.greasyfork.org/scripts/398598/Wod%20auto%20completion.user.js
// @updateURL https://update.greasyfork.org/scripts/398598/Wod%20auto%20completion.meta.js
// ==/UserScript==

GM_addStyle(GM_getResourceText("select2-css"));
GM_addStyle('.select2-results__option {padding: 2px}');
GM_addStyle('.select2-container--default .select2-results>.select2-results__options {max-height: 60vh}');

var minOptionCount = 13;
var ignoreFields = [/^EquipItem\[\d+\]$/i, /^sndgrp\d*\[\d+\]$/i];

var height, outerHeight, backgroundColor, fontColor, border, fontSize, borderRadius;

$("select").each(function() {
  $this = $(this);
  if (minOptionCount > 0 && $this.find("option").length > minOptionCount && doNotIgnore($this.prop("name"))) {
    $this.find("option").each(function() {
      if (!this.text) {
        this.text = "　";
      }
    });
    if (height == null) {
      height = $this.css("height");
      outerHeight = $this.outerHeight() + "px";
      backgroundColor = $this.css("background-color");
      fontColor = $this.css("color");
      border = $this.css("border");
      fontSize = (parseFloat($this.css("font-size")) * 72.0 / 96.0).toFixed() + "pt";
      borderRadius = $this.css("border-radius");
    }
    $this.select2({'width':'resolve'});
  }
});

GM_addStyle(".select2-container .select2-selection--single {" +
            "height: " + outerHeight + ";" +
            "border: " + border + ";" +
            "border-radius: " + borderRadius + ";" +
            "background-color: " + backgroundColor + ";" +
            "}");
GM_addStyle(".select2-container--default .select2-selection--single .select2-selection__rendered {" +
            "height: " + height + ";" +
            "font-size: " + fontSize + ";" +
            "color: " + fontColor + ";" +
            "padding-left: 5px;" +
            "line-height: 1.5;" +
            "text-overflow: inherit;" +
            "}");
GM_addStyle(".select2-container--default .select2-selection--single .select2-selection__arrow {height: " + height + "; top: " + 50% + ";}");
GM_addStyle(".select2-container--default .select2-selection--single {background-color: " + backgroundColor + "; font-size: " + fontSize + "; color: " + fontColor + "; border: " + border + ";}");
GM_addStyle(".select2-dropdown {background-color: " + backgroundColor + "; font-size: " + fontSize + "; color: " + fontColor + "; border: " + border + ";}");
GM_addStyle(".select2-selection {background-color: " + backgroundColor + "; font-size: " + fontSize + ";}");

function doNotIgnore(field) {
  if (ignoreFields.length <= 0) {
    return true;
  }

  var flag = true;
  $.each(ignoreFields, function(index, pattern) {
    if (field.search(pattern) != -1) {
      flag = false;
    }
  });
  return flag;
}
