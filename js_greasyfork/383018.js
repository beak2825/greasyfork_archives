// ==UserScript==
// @name         FCTK
// @version      1.1
// @description  Enable right click
// @author       NYCC
// @match        http://10.214.200.199:8080/masm/*
// @namespace https://greasyfork.org/users/301652
// @downloadURL https://update.greasyfork.org/scripts/383018/FCTK.user.js
// @updateURL https://update.greasyfork.org/scripts/383018/FCTK.meta.js
// ==/UserScript==

(function(){
    'use strict'

  window.addEventListener('load', () => {
    Fn()
    })

    function Fn() {
        document.oncontextmenu = true;
        document.onselectstart = true;
    }
}())