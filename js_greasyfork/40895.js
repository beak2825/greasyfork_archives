// ==UserScript==
// @name           Yemeksepeti İsim ile filtreleme
// @namespace      https://github.com/onurkerimov
// @description    Sadece seçtiğiniz anahtar kelimelere sahip restoranların görüntülenmesini sağlar.
// @include        http://www.yemeksepeti.com/istanbul/hisarustu
// @include        https://www.yemeksepeti.com/istanbul/hisarustu
// @copyright      OnurKerimov
// @version        1.0
// @license        
// @downloadURL https://update.greasyfork.org/scripts/40895/Yemeksepeti%20%C4%B0sim%20ile%20filtreleme.user.js
// @updateURL https://update.greasyfork.org/scripts/40895/Yemeksepeti%20%C4%B0sim%20ile%20filtreleme.meta.js
// ==/UserScript==

// ==== Settings ====
var MUST_CONTAIN= ["Hisarüstü", "Etiler", "Waffle"]; // Checks for at least one of them.
var MUST_NOT_CONTAIN= ["Levent"]; // This is the black list. Both lists are case sensitive.
var num_hidden = 0, num_tot = 0;

// ====== Code ======
ready(function() {
    var checkExist = setInterval(function() {
      if(document.querySelectorAll('.ys-item').length) {
      mainFunction();
      clearInterval(checkExist);
      }
    }, 100);
});

document.querySelector('.ys-reslist-items').addEventListener("DOMSubtreeModified",mainFunction);

function mainFunction() {
    num_hidden = 0; num_tot = 0;
    document.querySelectorAll('.ys-reslist-items > .ys-item').forEach(function(el) {
        str = el.querySelector('a').innerHTML;
        if(contains(str, MUST_CONTAIN) === false || contains(str, MUST_NOT_CONTAIN) === true){
            el.style.display = 'none';
            num_hidden++;
        } num_tot++;
    });
    document.querySelector('.ys-result-count').querySelector('b').innerHTML = num_tot + " restorandan " + parseInt(num_tot-num_hidden) + " tanesi gösteriliyor.";

}

function contains(str, items){
    for(var i in items){
        var item = items[i];
        if (str.indexOf(item) > -1){
            return true;
        }
    }
    return false;
}

function ready(fn) {
  if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading"){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}