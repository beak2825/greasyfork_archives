// ==UserScript==
// @name         Auto GCP - 2 Recovery
// @version      0.1.0
// @description  Part of Auto GCP Script
// @author       zharfanug
// @match        https://myaccount.google.com/signinoptions/recovery-options-collection*
// @namespace    https://greasyfork.org/users/778355
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427324/Auto%20GCP%20-%202%20Recovery.user.js
// @updateURL https://update.greasyfork.org/scripts/427324/Auto%20GCP%20-%202%20Recovery.meta.js
// ==/UserScript==
// jshint esversion: 6

function doCallback(callback=false) {
    if (typeof callback == "function") {
        callback();
    }
}
function checkExist(query,qid=0,hidden_ok=false) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (hidden_ok) {
            el_exist = true;
        } else if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function clickEl(query,qid) {
	var el = document.querySelectorAll(query)[qid];
	console.log(el);
	el.click();
}
function checkEl(query,qid=0,callback=false,hidden_ok=false) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        console.log("checkEl: "+query+"["+qid+"]");
        if (checkExist(query,qid,hidden_ok)) {
            if (hidden_ok) {
                clearInterval(loop_checkEl);
                doCallback(callback);
            } else if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                doCallback(callback);
            } else {
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 300);
}

(function() {
    'use strict';
    console.log('test');
    var q_el = 'div[role="button"]';
    var clickConfirm = function () {
        var el_buttons = document.querySelectorAll(q_el);
        for (let i = 0; i < el_buttons.length; i++) {
            const el_button = el_buttons[i];
            if (el_button.innerText.trim() == "CONFIRM") {
                el_button.click();
                break
            }
        }
    }
    checkEl(q_el,0,clickConfirm);
})();