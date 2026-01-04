// ==UserScript==
// @name         ピクトセンスカラーパレット拡張星型1.0.2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  -
// @author       You
// @match        https://pictsense.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426612/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%E6%98%9F%E5%9E%8B102.user.js
// @updateURL https://update.greasyfork.org/scripts/426612/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E6%8B%A1%E5%BC%B5%E6%98%9F%E5%9E%8B102.meta.js
// ==/UserScript==

(function() {
    document.getElementById('colorPalette').innerHTML =
    '<button type="button" class="color" data-color=“000000” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“1f1f1f” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“404040” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“5f5f5f” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“808080” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“9e9e9e” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“bfbfbf” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“dfdfdf” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“ffffff” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“e90000” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ee8632” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“f49800” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“ffffab" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“fff000" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“bdfc50” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“8ec41a” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“64af32" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“009942" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“2a6351" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“009e96” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“75fbd7” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“aedcf8” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“50b1f8” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“00a0ea” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“0067b9” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“0000f4” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“2a458c” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“1a1e88” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“9b1ef5” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“c8b8f8” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“8069d8” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“920083” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“e7007e” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“e25b86” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“ed7470” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color=“e8004d” style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="bf574f" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="fed1ad" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="f6b070" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffefe1" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffcfc0" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffa799" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ec988f" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="d0746c" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="683b33" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffe4c6" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ffc7a2" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="ecb18c" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="4a3f3d" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="211715" style="background-color: #FF0; height: 8px;"></button>';
    'use strict';
    document.getElementById('undoButton').style.position = 'inherit';
    // Your code here...
})();
