// ==UserScript==
// @name         ペンサイズ拡張(ピクトセンス）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  ボタンの数を５つから６つに増やして、最大ペンサイズを99にしてます。これでいちいち検証からかきかえる必要もないね！
// @author       You
// @match        https://pictsense.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409831/%E3%83%9A%E3%83%B3%E3%82%B5%E3%82%A4%E3%82%BA%E6%8B%A1%E5%BC%B5%28%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/409831/%E3%83%9A%E3%83%B3%E3%82%B5%E3%82%A4%E3%82%BA%E6%8B%A1%E5%BC%B5%28%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    document.getElementById('sizeButtonHolder').innerHTML =
       '<button type="button" class="size size1" data-size="1"></button>'+
     　'<button type="button" class="size size2" data-size="2"></button>'+
       '<button type="button" class="size size3" data-size="15"></button>'+
       '<button type="button" class="size size3" data-size="20"></button>'+
       '<button type="button" class="size size4" data-size="40"></button>'+
       '<button type="button" class="size size5" data-size="99"></button>';
	document.getElementById('undoButton').style.position = 'inherit';
    'use strict';
    // Your code here...
})();