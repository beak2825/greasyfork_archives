// ==UserScript==
// @name         appendAmount
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  append model in amount
// @author       FengXia
// @match        http://47.107.106.156/*
// @match        http://122.13.25.247/*
// @icon
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456155/appendAmount.user.js
// @updateURL https://update.greasyfork.org/scripts/456155/appendAmount.meta.js
// ==/UserScript==


(function() {
    'use strict';
    let currentUrl = window.location.hostname;
    let name = document.querySelector('.userdetail');
    if (currentUrl.indexOf('247')<0){
        if (name) {
            let name_str = name.innerHTML
            if (name.innerHTML.indexOf('李国强&nbsp') > 0) {
                let modify_str = `<a href="https://app.powerbi.cn/view?r=eyJrIjoiZTYzYWI4ZmQtMWZiMy00ZmQ5LWI5OWYtNjVhZjE2NWJiN2RmI
            iwidCI6ImQxODE5NWE5LTQ0MGMtNDViYS04ODg1LTgyZmU3YmZhYTI2NCJ9" target="_blank" style="text-decoration: none;color: white;">
            ${name_str}</a>`;
                name.innerHTML = modify_str;
            } else if (name.innerHTML.indexOf('李湛辉') > 0) {
                let modify_str = `<a href="https://app.powerbi.cn/view?r=eyJrIjoiZTYzYWI4ZmQtMWZiMy00ZmQ5LWI5OWYtNjVhZjE2NWJiN2RmI
            iwidCI6ImQxODE5NWE5LTQ0MGMtNDViYS04ODg1LTgyZmU3YmZhYTI2NCJ9" target="_blank" style="text-decoration: none;color: white;">
            ${name_str}</a>`;
                name.innerHTML = modify_str;
            }
        }}
    else{
        if (name) {
            let name_str = name.innerHTML
            if (name.innerHTML.indexOf('李国强&nbsp') > 0) {
                let modify_str = `<a href="https://app.powerbi.cn/view?r=eyJrIjoiYTFmMTJkOTEtYWUzMC00YzdmLTg1NTUtYmRhYTJhNWIwZDg4IiwidCI6ImQxODE5NWE5LTQ0MGMtNDViYS04ODg1LTgyZmU3YmZhYTI2NCJ9" target="_blank" style="text-decoration: none;color: white;">
            ${name_str}</a>`;
                name.innerHTML = modify_str;
            } else if (name.innerHTML.indexOf('李湛辉') > 0) {
                let modify_str = `<a href="https://app.powerbi.cn/view?r=eyJrIjoiYTFmMTJkOTEtYWUzMC00YzdmLTg1NTUtYmRhYTJhNWIwZDg4IiwidCI6ImQxODE5NWE5LTQ0MGMtNDViYS04ODg1LTgyZmU3YmZhYTI2NCJ9" target="_blank" style="text-decoration: none;color: white;">
            ${name_str}</a>`;
                name.innerHTML = modify_str;
            }
        }
    }
})();