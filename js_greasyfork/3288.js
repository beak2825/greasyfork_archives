// ==UserScript==
// @name        Yaruo matome blog open in same tab
// @description やる夫系まとめブログの次話へのリンクを別タブではなく同じタブで開くようにします。
// @namespace   http://devdev.nagoya/
// @include     http://matariyaruo.doorblog.jp/*
// @version     1.02
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3288/Yaruo%20matome%20blog%20open%20in%20same%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/3288/Yaruo%20matome%20blog%20open%20in%20same%20tab.meta.js
// ==/UserScript==

(function(){
var elem = document.getElementsByTagName('a');
elem = Array.slice(elem, 0);
for(var i=0; i<elem.length; i++) {
    elem[i] = elem[i].setAttribute('target','_self');
}
})();