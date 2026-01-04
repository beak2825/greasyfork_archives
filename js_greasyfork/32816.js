// ==UserScript==
// @name         Append Script
// @version      1.0
// @description  Easier way to write scripts as dom
// @author       A Meaty Alt
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    function appendScript(scriptContent){
        var script = document.createElement("script");
        script.text = scriptContent;
        document.getElementsByTagName("body")[0].appendChild(script);
    }
    appendScript(appendScript.toString());
})();