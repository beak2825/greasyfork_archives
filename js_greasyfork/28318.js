// ==UserScript==
// @name         rutracker unSpoiler
// @description  Добавляет кнопку для разворачивания спойлеров
// @version      0.1
// @author       gvvad
// @match        *.rutracker.org/forum/viewtopic*
// @namespace https://greasyfork.org/users/100160
// @downloadURL https://update.greasyfork.org/scripts/28318/rutracker%20unSpoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/28318/rutracker%20unSpoiler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    function a(){
        var numb = this.nextSibling.value;
        var a = document.querySelectorAll(".sp-head");
        var isExp = (this.value == "Expand");
        for (var i = 0; i < a.length; i++) {
            var pcount = 0;
            var prev = a[i].parentNode;
            while (prev.parentNode){
                if (prev.className.indexOf("sp-wrap") >= 0) pcount++;
                prev = prev.parentNode;
            }
            if (pcount > numb) continue;
            var isUnfold = !(a[i].className.indexOf("unfolded") == -1);
            if (isExp? !isUnfold : isUnfold) a[i].click();
        }
        this.value = (isExp)? "Collapse" : "Expand";
    }
    var thb = document.querySelector("#thx-btn-div");
    if (!thb) return;
    
    var el = document.createElement("input");
    el.type = "button";
    el.value = "Expand";
    el.classList.add("bold");
    el.addEventListener("click", a);
    thb.appendChild(el);
    
    el = document.createElement("input");
    el.type = "number";
    el.value = "1";
    el.min = "1";
    el.max = "9";
    thb.appendChild(el);
})();