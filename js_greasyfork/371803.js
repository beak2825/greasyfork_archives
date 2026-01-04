// ==UserScript==
// @name         JDoodle C++ customizer - by rex_wulf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  JDoodle C++ customizer
// @author       Rishabh Bharti - IIT(ISM) DHANBAD
// @match        *.jdoodle.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371803/JDoodle%20C%2B%2B%20customizer%20-%20by%20rex_wulf.user.js
// @updateURL https://update.greasyfork.org/scripts/371803/JDoodle%20C%2B%2B%20customizer%20-%20by%20rex_wulf.meta.js
// ==/UserScript==
'use strict';

    var node;

    node = document.querySelectorAll('a');
    if(node[8].text == "C++ 14" && location.pathname != "/online-compiler-c++14"){
        node[8].click();
    }

    var wait_time = 400;
    setTimeout(function (){

        node = document.querySelector('[title="User\'s Saved Files"]');
        node.click();

        setTimeout(function (){
            node = document.querySelector('.my-files-select');
            node.click();

            setTimeout(function (){
                node = document.querySelectorAll('.btn');
                node[15].click()

                setTimeout(function (){
                    node = document.querySelectorAll('.btn');

                    for (var i = 5; i <= 10; i++) {
                        if(node[i] != null)
                            node[i].style.visibility = "hidden";
                    }

                    setTimeout(function (){
                        node = document.querySelectorAll('.col-xs-12.hidden-print');
                        node[1].parentNode.removeChild(node[1]);
                        node = document.querySelectorAll('.row.footer.hidden-print');
                        node[0].parentNode.removeChild(node[0]);
                        node = document.querySelectorAll('.row.hero-unit');
                        node[0].parentNode.removeChild(node[0]);
                        node = document.querySelectorAll('.col-sm-6');
                        node[1].parentNode.removeChild(node[1]);
                        node = document.querySelectorAll('.autosave');
                        node[0].parentNode.removeChild(node[0]);
                        node = document.querySelectorAll('#auto_save');
                        node[0].parentNode.removeChild(node[0]);
                        node = document.querySelectorAll('.arguments');
                        node[0].parentNode.removeChild(node[0]);
                    }, wait_time+4000);

                }, wait_time);

            }, wait_time);

        }, wait_time);

}, wait_time);

$ = jQuery;
$(document).keyup(function (e) {
    if (e.shiftKey && e.which == 13) {
        node = document.querySelectorAll('.btn.btn-xs.btn-primary.margin-top-10px');
        node[0].click();
    }
});



