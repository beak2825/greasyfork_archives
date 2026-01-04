// ==UserScript==
// @name         komga and kavita 3D page effect
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  adds 3d page effect
// @author       Wurmi
// @match        http://192.168.1.193/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/455714/komga%20and%20kavita%203D%20page%20effect.user.js
// @updateURL https://update.greasyfork.org/scripts/455714/komga%20and%20kavita%203D%20page%20effect.meta.js
// ==/UserScript==

(function() {
    var APP_KOMGA=true;
    var APP_KAVITA=true;
    'use strict';
    if(APP_KOMGA){
        GM_addStyle ( `
    .center-horizontal:before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        box-shadow:
            0px 0px calc(17px*3.14) 25px rgb(0 0 0 / 43%),
0px 0px calc(2px*3.14) 2px rgb(0 0 0 / 43%),
0px 0px calc(5px*3.14) 4px rgb(0 0 0 / 43%),
0px 0px calc(0.5px*3.14) 0.3px rgb(0 0 0 / 43%);
}

@supports (-moz-appearance:none) {
.center-horizontal:before{
box-shadow:
0px 0px calc(17px*3.14) 25px rgb(0 0 0 / 43%),
0px 0px calc(2px*3.14) 2px rgb(0 0 0 / 43%),
0px 0px calc(5px*3.14) 4px rgb(0 0 0 / 43%),
0px 0px calc(0.5px*3.14) 0.3px rgb(0 0 0 / 43%),
0px 0px 1px 0.5px rgb(0 0 0 / 43%);
}
}
`);
}
if (APP_KAVITA){
    GM_addStyle ( `
    .image-container.full-height:before {
        content: '';
        position: absolute;
        top: 0;
        left: 50%;
        height: 100%;
        box-shadow:
            0px 0px calc(17px*3.14) 25px rgb(0 0 0 / 43%),
0px 0px calc(2px*3.14) 2px rgb(0 0 0 / 43%),
0px 0px calc(5px*3.14) 4px rgb(0 0 0 / 43%),
0px 0px calc(0.5px*3.14) 0.3px rgb(0 0 0 / 43%);
}

@supports (-moz-appearance:none) {
.image-container.full-height:before{
box-shadow:
0px 0px calc(17px*3.14) 25px rgb(0 0 0 / 43%),
0px 0px calc(2px*3.14) 2px rgb(0 0 0 / 43%),
0px 0px calc(5px*3.14) 4px rgb(0 0 0 / 43%),
0px 0px calc(0.5px*3.14) 0.3px rgb(0 0 0 / 43%),
0px 0px 1px 0.5px rgb(0 0 0 / 43%);
}
}
`);
}
})();