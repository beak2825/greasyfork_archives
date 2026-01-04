// ==UserScript==
// @name         Code Executer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Execute code on any websites!
// @author       cool
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477890/Code%20Executer.user.js
// @updateURL https://update.greasyfork.org/scripts/477890/Code%20Executer.meta.js
// ==/UserScript==

(function(w) {
    'use strict';
    var _codeExecuteio = false;
    var _codeExecutec = document.createElement("button");
    _codeExecutec.setAttribute("style", "width: 80px !important; height: 40px !important; padding: 0px !important; margin: 0px !important; text-size: 14px !important; background-color: dodgerblue !important; color: white !important; border: none !important; border-radius: 5px 0px 5px 0px !important; position: fixed !important; right: 0px !important; bottom: 0px !important; z-index: 99999999 !important; cursor: pointer !important;");
    _codeExecutec.innerHTML = "Code Execute";
    document.body.appendChild(_codeExecutec);
    var _codeExecutei = document.createElement("input");
    _codeExecutei.setAttribute("style", "width: calc(100% - 90px) !important; padding: 0px 5px !important; margin: 0px !important; height: 40px !important; text-size: 14px !important; background-color: white !important; color: black !important; outline: none !important; border: 1px solid gray !important; border-radius: 0px !important; position: fixed !important; left: 0px !important; bottom: 0px !important; z-index: 99999999 !important; cursor: text !important;");
    _codeExecutei.placeholder = "Press enter to execute";
    _codeExecutei.hidden = true;
    document.body.appendChild(_codeExecutei);
    _codeExecutec.addEventListener("click", function() {
        if (_codeExecuteio) {
            _codeExecuteio = false;
            _codeExecutei.hidden = true;
            _codeExecutec.innerHTML = "Code Execute";
        } else {
            _codeExecuteio = true;
            _codeExecutei.hidden = false;
            _codeExecutec.innerHTML = "Close";
            _codeExecutei.focus();
        }
    });
    _codeExecutei.addEventListener("keydown", function(e) {
        if (e.key == "Enter") {
            (function(window, _codeExecuteCode) {
                eval(_codeExecuteCode);
            })(w, _codeExecutei.value);
            _codeExecutei.value = "";
        }
    });
})(window);