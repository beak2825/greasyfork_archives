// ==UserScript==
// @name         hook_JSON
// @namespace    https://github.com/0xsdeo/Hook_JS
// @version      2024-10-29
// @description  重写parse和stringify方法，以此来获取调用这个方法所传入的内容以及堆栈信息。
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536977/hook_JSON.user.js
// @updateURL https://update.greasyfork.org/scripts/536977/hook_JSON.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let json_p = JSON.parse;
    JSON.parse = function(str){
        console.log(str);
        console.log(new Error().stack);
        console.log("-----------------------------------------------------------------------------------------------------")
        return json_p(str);
    }

    let json_s = JSON.stringify;
    JSON.stringify = function(obj){
        console.log(obj);
        console.log(new Error().stack);
        console.log("-----------------------------------------------------------------------------------------------------")
        return json_s(obj);
    }
})();