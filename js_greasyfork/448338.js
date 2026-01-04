// ==UserScript==
// @name         ImgBlaze Skipper
// @namespace    https://greasyfork.org/en/users/801832
// @version      1.0.2
// @description  Skip ImgBlaze
// @author       Naieth Norp
// @include      https://*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448338/ImgBlaze%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/448338/ImgBlaze%20Skipper.meta.js
// ==/UserScript==

// -------------------------- Lib version 0.0.2 ------------------------------------
function isArray(a) {
    return (!!a) && (a.constructor === Array);
}
function isObject(a) {
    return (!!a) && (a.constructor === Object);
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
function checkEl(query,qid=0,callback=false,hidden_ok=false,el=document) {
    let old_top = -1;
    let old_left = -1;
    let loop_counter = 0;
    let loop_checkEl = setInterval(function() {
        if (checkExist(query,qid,hidden_ok)) {
            if (hidden_ok) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            } else if (old_top==el.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==el.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            }else{
                old_top = el.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = el.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
        if (loop_counter >= 50) {
            clearInterval(loop_checkEl);
        }
        loop_counter += 1;
        console.log(loop_counter);
    }, 500);
}
// -------------------------- Lib version 0.0.2 ------------------------------------

var img_q = "#newImgE"

function showImage() {
    var el_img = document.querySelector(img_q);
    let loop_waitURL = setInterval(function() {
        if (el_img.src.substring(0,4) == "http") {
            clearInterval(loop_waitURL);
            window.location.href = el_img.src;
        }
    }, 200);
}

(function() {
    'use strict';
    checkEl(img_q,0,showImage,true);
})();