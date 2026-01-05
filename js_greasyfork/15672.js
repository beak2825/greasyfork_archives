// ==UserScript==
// @name         Mi Drive - Total Closures Only
// @namespace    vaindil
// @version      0.3.1
// @description  hides construction on Mi Drive other than total closures
// @author       vaindil
// @match        http://mdotnetpublic.state.mi.us/drive/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/15672/Mi%20Drive%20-%20Total%20Closures%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/15672/Mi%20Drive%20-%20Total%20Closures%20Only.meta.js
// ==/UserScript==

err_num = 0;

startcode = function() {
    try {
        if (document.getElementById('construction_layer') !== null && document.getElementById('construction_layer') !== "") {
            var elem = document.querySelectorAll('[*|href="images/bo_18px_.png"]');
            var elemt = document.querySelectorAll('[*|href="images/bg_18px_.png"]');
            for (var i = elem.length - 1; i >= 0; i--) {
                elem[i].parentNode.removeChild(elem[i]);
            }
            for (var j = elemt.length - 1; j >= 0; j--) {
                elemt[j].parentNode.removeChild(elemt[j]);
            }
            var target = document.querySelector('#construction_layer');
            var config = { childList: true };
            var obs = new MutationObserver(function(m) {
                m.forEach(function(m) {
                    if (m.addedNodes.length > 0) {
                        for (var i = m.addedNodes.length - 1; i >= 0; i--) {
                            h = m.addedNodes[i].outerHTML;
                            if (h.indexOf("bo_18px_.png") > -1 || h.indexOf("bg_18px_.png") > -1) {
                                m.addedNodes[i].parentNode.removeChild(m.addedNodes[i]);
                            }
                        }
                    }
                });
            });
            obs.observe(target, config);
        } else {
            if (err_num == 14) {
                alert("Mi Drive took too long to load, Total Closures can't run.");
                console.log("(TC) too many errors, quitting");
                return;
            }
            err_num++;
            setTimeout(startcode, 1000);
        }
    } catch (err) {
        if (err_num == 14) {
            console.log("TC too many errors, quitting");
            return;
        }
        err_num++;
        setTimeout(startcode, 1000);
    }
};

startcode();