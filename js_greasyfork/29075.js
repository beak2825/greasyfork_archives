// ==UserScript==
// @name         MonzooAnimaux
// @namespace    grenad-monzoo
// @version      1.0
// @description  Ajoute des informations sur l'animal sur la page d'achat
// @author       Grenad
// @match        http://www.monzoo.net/achat_animaux.php*
// @match        http://www.monzoo.net/enclosgestion1.php*
// @copyright   Copyright 2017 -- Grenad
// @downloadURL https://update.greasyfork.org/scripts/29075/MonzooAnimaux.user.js
// @updateURL https://update.greasyfork.org/scripts/29075/MonzooAnimaux.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if(document.querySelector("#jumpMenu") !== null)
        return;

    var parser = new DOMParser();
    var bourse_dom;
    var bourse_animals = [];
    var animals = [];
    var tb = Array.prototype.slice.call(document.querySelector('form[name="formenclos"] table').tBodies[0].rows, 0);

    function loadBourse() {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var bourse = Array.prototype.slice.call(parser.parseFromString(this.responseText, "text/html").querySelectorAll(".content_site table")[4].tBodies[0].rows, 0);
                for(var it = 0 ; it < bourse.length ; it ++) {
                    var obj = {};
                    obj.name = bourse[it].cells[0].textContent.trim().toLowerCase();
                    obj.base = parseInt(bourse[it].cells[1].textContent);
                    obj.prce = parseInt(bourse[it].cells[2].textContent);
                    obj.tdce = ((obj.prce * 100 / obj.base) - 100).toFixed(2);
                    bourse_animals.push(obj);
                }
                initReplace();
            }
        };
        xhttp.open("GET", "http://www.monzoo.net/bourse.php", true);
        xhttp.send();
    }

    loadBourse();

    function search(name) {
        for(var it = 0 ; it < bourse_animals.length ; it ++) {
            if(name == bourse_animals[it].name) {
                return bourse_animals[it];
            }
        }
        return -1;
    }

    function initReplace() {
        for(var it = 0 ; it < tb.length ; it ++) {
            if (it % 2)
                continue;
            var a = tb[it].cells[0].querySelector('table').tBodies[0].rows[0].cells[1];//.innerHTML += (it / 2).toString();
            var b = tb[it].cells[2].querySelector('table').tBodies[0].rows[0].cells[1];
            var name = a.querySelector("strong").nextSibling.nodeValue.trim().toLowerCase();
            var o = search(name);
            var add_span_a = a.querySelector("span");
            var add_span_b = b.querySelector("span");
            var add_span_txt;
            var add_div_a = a.querySelector("div");
            var add_div_b = b.querySelector("div");
            var add_div_txt;
            if(add_span_a !== null) {
                add_span_txt = add_span_a.textContent.trim();
                a.removeChild(add_span_a);
                b.removeChild(add_span_b);
            }
            if(add_div_a !== null) {
                add_div_txt = add_div_a.textContent.trim();
                a.removeChild(add_div_a);
                b.removeChild(add_div_b);
            }
            if(o != -1) {
                a.innerHTML += "<strong>Prix initial :</strong> " + o.base + " Zoo'z";
                b.innerHTML += "<strong>Prix initial :</strong> " + o.base + " Zoo'z";
                a.innerHTML += "<br>";
                b.innerHTML += "<br>";
                a.innerHTML += "<strong>Tendance :</strong> ";
                b.innerHTML += "<strong>Tendance :</strong> ";
                if(o.tdce < 0) {
                    a.innerHTML += '<span style="color: red;">' + o.tdce + '%</span>';
                    b.innerHTML += '<span style="color: red;">' + o.tdce + '%</span>';
                }
                else if(o.tdce > 0) {
                    a.innerHTML += '<span style="color: green;">+' + o.tdce + '%</span>';
                    b.innerHTML += '<span style="color: green;">+' + o.tdce + '%</span>';
                }
                else {
                    a.innerHTML += '<span>Stable</span>';
                    b.innerHTML += '<span>Stable</span>';
                }
            }
            if(add_span_a !== null) {
                a.innerHTML += '<br><span style="color: red;">⚠ ' + add_span_txt + '</span>';
                b.innerHTML += '<br><span style="color: red;">⚠ ' + add_span_txt + '</span>';
            }
            if(add_div_a !== null) {
                a.innerHTML += '<br><span style="color: red;">⚠ ' + add_div_txt + '</span>';
                b.innerHTML += '<br><span style="color: red;">⚠ ' + add_div_txt + '</span>';
            }
        }
    }
})();