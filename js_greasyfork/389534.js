// ==UserScript==
// @name         MITRE ATT&CK
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight searched techniques
// @author       SRI
// @match        https://attack.mitre.org/matrices/enterprise/
// @grant        none
// @icon          data:image/png;base64,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
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389534/MITRE%20ATTCK.user.js
// @updateURL https://update.greasyfork.org/scripts/389534/MITRE%20ATTCK.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // resize left menu
    $(".col-xl-2").css("flex", "0 0 9%");

    $("body").on('DOMSubtreeModified', ".search-results", function() {

        // init style
        document.querySelectorAll("#v-attckmatrix tbody a").forEach(function(eld) {
            eld.style.color = '#4F7CAC';
        });
        document.querySelectorAll("#v-attckmatrix tbody td").forEach(function(eld) {
            eld.style.backgroundColor = 'white';
        });

        //get techniques, set style
        var text = $('#navbarCollapse .search-results a').text();
        var res = text.match(/ID: T\d{4}/g);
        if (res) {
            var index;
            for (index = 0; index < res.length; ++index) {
                res[index] = res[index].replace("ID: ", "/techniques/");
                var els = document.querySelectorAll("#v-attckmatrix a[href='"+res[index]+"']");
                for (var i = 0, l = els.length; i < l; i++) {
                    var el = els[i];
                    el.style.color = 'black';
                    var parent = el.closest('.border');
                    parent.style.backgroundColor = '#d7d6d0';
                }
            }
        }
    });

    // hide top menu
    window.onscroll = function() {
        if(window.scrollY==0){
            document.getElementsByTagName("header")[0].style.display= "block";
        } else {
            document.getElementsByTagName("header")[0].style.display= "none";
        }
    };


})();