// ==UserScript==
// @name         ペンサイズ
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  -
// @author       You
// @match        https://pictsense.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421059/%E3%83%9A%E3%83%B3%E3%82%B5%E3%82%A4%E3%82%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/421059/%E3%83%9A%E3%83%B3%E3%82%B5%E3%82%A4%E3%82%BA.meta.js
// ==/UserScript==

(function() {
    document.getElementById('sizeButtonHolder').innerHTML =
       '<button type="button" class="size size1" data-size="1"></button>'+
     　'<button type="button" class="size size2" data-size="2"></button>'+
       '<button type="button" class="size size3" data-size="5"></button>'+
       '<button type="button" class="size size3" data-size="15"></button>'+
       '<button type="button" class="size size4" data-size="30"></button>'+
       '<button type="button" class="size size5" data-size="99"></button>';
	document.getElementById('undoButton').style.position = 'inherit';
    'use strict';
    // Your code here...
})();