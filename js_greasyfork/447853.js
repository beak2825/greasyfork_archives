// ==UserScript==
// @name         ordenar los publicaciones
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  Ordenar publicaciones por hora de publicación
// @author       delfino
// @match        *://*/thread0806.php?fid=7
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447853/ordenar%20los%20publicaciones.user.js
// @updateURL https://update.greasyfork.org/scripts/447853/ordenar%20los%20publicaciones.meta.js
// ==/UserScript==

(function () {
    'use strict';

function sortEles(eleArr, compFunc) {
    if (!eleArr.length) {
        return;
    }
    var parent = eleArr[0].parentNode;
    var sorting = [];
    for (var i = eleArr.length - 1; i >= 0; --i) {
        sorting.push(eleArr[i]);
        parent.removeChild(eleArr[i]);
    }
    sorting.sort(compFunc);
    for (let child of sorting) {
        parent.appendChild(child);
    }
}

function changeLayout(){
    var unsafeWindow = self.unsafeWindow||window;
    var $ = unsafeWindow.$;
    let trs = $("#tbody tr").toArray();
    for (let index in trs) {
        let dt=trs[index].querySelector("td:nth-child(3) > div.f12 > span").getAttribute("data-timestamp");
        if(dt){ trs[index].sortBy = dt.slice(0,-1); }else{trs[index].sortBy =0}
    }
    sortEles(trs, function(a, b) {
        return b.sortBy-a.sortBy;
    });
}

setTimeout(function(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML=".tal{ width:66% }";
    document.getElementsByTagName('HEAD')[0].appendChild(style);
},100)
document.getElementById("header").style.display="none"
document.getElementsByClassName("t")[0].style.display="none"
document.getElementById("ajaxtable").getElementsByTagName("tbody")[0].style.display="none";

changeLayout();
})();