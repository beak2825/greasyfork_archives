// ==UserScript==
// @name         eterNEETy JS Lib
// @version      0.0.1
// @description  eterNEETy JS Lib Collection
// @author       eterNEETy
// @match        https://nyaa.si/*
// @grant        none
// @namespace    https://greasyfork.org/users/700963
// @downloadURL https://update.greasyfork.org/scripts/446349/eterNEETy%20JS%20Lib.user.js
// @updateURL https://update.greasyfork.org/scripts/446349/eterNEETy%20JS%20Lib.meta.js
// ==/UserScript==

function isArray(a) {
    return (!!a) && (a.constructor === Array);
}

function isObject(a) {
    return (!!a) && (a.constructor === Object);
}

function checkExist(query,qid=0) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}

function checkEl(query,qid=0,callback=false,el=document) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        // console.log("checkEl",query);
        if (checkExist(query,qid)) {
            if (old_top==el.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==el.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            }else{
                old_top = el.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = el.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 200);
}

function checkElements(query,callback=false,timeout=1000) {
    // console.log(query);
    // console.log(typeof query ==);
    if (isArray(query)) {

    } else if (isObject(query)) {
        console.log("hore query");
    }

    // let old_top = -1;
    // let old_left = -1;
    // let loop_checkEl = setInterval(function() {
    //     // console.log("checkEl",query);
    //     if (checkExist(query,qid)) {
    //         if (old_top==el.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==el.querySelectorAll(query)[qid].getBoundingClientRect().left) {
    //             clearInterval(loop_checkEl);
    //             if (typeof callback == "function") {
    //                 callback();
    //             }
    //         }else{
    //             old_top = el.querySelectorAll(query)[qid].getBoundingClientRect().top;
    //             old_left = el.querySelectorAll(query)[qid].getBoundingClientRect().left;
    //         }
    //     }
    // }, 200);
}

(function() {
    'use strict';
    checkElements({"q":"#script-links","qid":0});
    // checkElements([{"q":"#script-links","qid":0}]);

    // checkEl("#logo-icon",0,changeIconSideNav);
    // checkEl("#guide-wrapper",0,sidenav);
})();