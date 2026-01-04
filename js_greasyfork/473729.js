// ==UserScript==
// @name         Easymart
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  lọc tài khoản thanh toán trên trang bán hàng của kiotviet theo chi nhánh
// @author       huynd
// @match        https://*/sale/*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBwQOkhgS1B7sSXyH9dEKOIZt7cmcUqAD0KGy3uOwSlofk6qXeH5Xisxum87Y6hunHBh4&usqp=CAU
// @license      huynd
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473729/Easymart.user.js
// @updateURL https://update.greasyfork.org/scripts/473729/Easymart.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver (function() {

        if (document.getElementsByClassName("nameAcountBank").length > 0
           && document.getElementById("cbSelectBranch_listbox").getElementsByClassName("k-state-default active").length > 0
           ){

            const observer2 = new MutationObserver (function() {

                let x = document.getElementById("cbSelectBranch_listbox").getElementsByClassName("k-state-default active")[0].innerHTML.substring(0,3);
                //let y = x.getElementsByClassName("k-state-default active");
                //let z = y[0].innerHTML.substring(0,3);
                let a = Array.from(document.getElementsByClassName("nameAcountBank"));

                if(document.getElementsByClassName("k-widget k-dropdown k-header dropdown-control dropdown-control-lg")[0].childNodes[0].childNodes[0].innerText.includes(x)){
                    document.getElementsByClassName("k-widget k-dropdown k-header dropdown-control dropdown-control-lg")[0].childNodes[0].style.backgroundColor = "LawnGreen";
                } else {
                    document.getElementsByClassName("k-widget k-dropdown k-header dropdown-control dropdown-control-lg")[0].childNodes[0].style.backgroundColor = "red";
                }
                //https://stackoverflow.com/questions/66166841/javascript-removechild-not-removing-all-elements-inside-loop
                //a = Array.from(a);
                for (let i = 0; i < a.length; i++) {
                    if(!a[i].innerHTML.includes(x)){ //&& !a[i].innerHTML == ""
                        a[i].parentElement.parentElement.parentElement.parentElement.style.display = "none";
                    }
                }
            })

            const target2 = document.getElementsByClassName("k-list-container k-popup k-group k-reset")[7].childNodes[2].childNodes[0];

            observer2.observe(target, {childList: true, subtree:true});

            observer.disconnect();
        }

    })
    const target = document.querySelector('body');

    observer.observe(target, {childList: true});


})();