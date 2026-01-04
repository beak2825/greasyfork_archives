// ==UserScript==
// @license MIT
// @name         LuminaEduSubtitlesEditor
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  course subtitles fontsize editor
// @author       KyleCC
// @match        *://*.luminaedu.com/course/*
// @icon         https://www.google.com/s2/favicons?domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440035/LuminaEduSubtitlesEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/440035/LuminaEduSubtitlesEditor.meta.js
// ==/UserScript==

(function() {
    // insert slider for change font size
    var t = setInterval(myfun, 1000);
    function myfun() {
        var vjsMenu = document.getElementById("show");
        if (vjsMenu == null) {
            return;
        }
        clearInterval(t);
        // insert slider
        let sliderNode = yc_createNode(`<input type="range" min="15" max="120" value="22" class="slider" id="subtitles-fontsize-slider">`);
        vjsMenu.appendChild(sliderNode);
        hookAddText();
    }

    function hookAddText() {
      var player = document.getElementsByClassName('tcplayer')[0];
      var _appendChild = player.appendChild;
      player.appendChild = function() {
          var innerslider = document.getElementById("subtitles-fontsize-slider");
          var textAdding = arguments[0];
          textAdding.style['font-size'] = `${innerslider.value}px`;
          return _appendChild.apply(this, arguments);
      };
    }

    function yc_createNode(txt) {
        const template = txt;
        let tempNode = document.createElement('div');
        tempNode.innerHTML = template;
        return tempNode.firstChild;
    }
})();