// ==UserScript==
// @name         NDT injector
// @namespace    https://warum-llamas.tk
// @version      2.1
// @description  For those who don't have dev tools. Hit ctrl + shift + i to open and close it
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412652/NDT%20injector.user.js
// @updateURL https://update.greasyfork.org/scripts/412652/NDT%20injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var SCRIPTDW=new XMLHttpRequest();
    SCRIPTDW.open("GET","https://raw.githubusercontent.com/Joe-Capewell/ndt/main/ndt.js");
    SCRIPTDW.onload=function(){
        evalScript(this.response);
    }
    SCRIPTDW.send();
    
    function evalScript(script) {
        //alternative to eval because of xss guards
        var blobText = script;
        var abc = new Blob([blobText],{
            type: "text/plain"
        });
        var def = new FileReader();
        def.addEventListener("loadend", function(e) {
            const script = document.createElement('script');
            script.src = URL.createObjectURL(abc);
            // create blob url and add as script source
            document.body.insertBefore(script, document.body.childNodes[0]);
        });
        def.readAsText(abc);
}
})();