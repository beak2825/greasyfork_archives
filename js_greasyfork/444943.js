// ==UserScript==
// @name          ColorPicker barra facebook migliorato
// @namespace     https://greasyfork.org/users/237458
// @version       12.0
// @description   cambio colore facebook migliorato
// @author        figuccio
// @license       MIT
// @match         https://*.facebook.com/*
// @icon          https://facebook.com/favicon.ico
// @noframes
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_registerMenuCommand
// @require       https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/444943/ColorPicker%20barra%20facebook%20migliorato.user.js
// @updateURL https://update.greasyfork.org/scripts/444943/ColorPicker%20barra%20facebook%20migliorato.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var $ = window.jQuery;

  const createColorPickerMenu = () => {
    const container = document.createElement("div");
    container.style = "top:50%;position:fixed;right:5px;";
    container.innerHTML = `
      <fieldset style="border: 2px solid red; border-radius:6px;padding:10px;background:#ffc800">
        <legend style="color:green;">Color Picker</legend>
        <input type="color" list="colors" id="_input-color" title="Color picker">
        <input type="button" id="hexcolor" title="Hex color" style="margin-top:5px;">
      </fieldset>
    `;
    return container;
  };

  const applyBackgroundColor = (color) => {
  const elementsToStyle = [
 'body','#blueBarDOMInspector>div','#blueBarDOMInspector div[role="banner"]','#fb2k_pagelet_bluebar>#blueBarDOMInspector>div>div', 'div[aria-label="Facebook"][role="navigation"]'

    ];
    elementsToStyle.forEach(selector => {
      $(selector).css('background-color', color);
    });
  };

  $(document).ready(function () {
    const body = document.getElementsByTagName("body")[0];
    const container = createColorPickerMenu();
    body.append(container);

    GM_addStyle(`
      #_input-color {z-index:999999999999;border:2px solid yellow;border-radius:6px;cursor:pointer;height:25px;width:51px;}
      #hexcolor {z-index:999999999999;color:green;border:2px solid green;border-radius:6px;cursor:pointer;}
    `);

    $('#_input-color').on('input', function () {
      const color = this.value;
      $('#hexcolor').val(color);
      GM_setValue('bg', color);
      applyBackgroundColor(color);
    });

    GM_registerMenuCommand("mostra pulsante/nascondi", () => {
      container.style.display = (container.style.display !== 'none') ? 'none' : 'block';
    });

    const savedColor = GM_getValue('bg');
    if (savedColor) {
      $('#hexcolor').val(savedColor);
      $('#_input-color').val(savedColor);
      applyBackgroundColor(savedColor);
    }
  });
})();
