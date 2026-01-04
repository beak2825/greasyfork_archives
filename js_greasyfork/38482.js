// ==UserScript==
// @namespace    http://tampermonkey.net/
// @name         Input Copier
// @version      1.2.1
// @description  just cick on input!
// @author       SuperJava
// @match        http://codeforces.com/*/*/*/*
// @downloadURL https://update.greasyfork.org/scripts/38482/Input%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/38482/Input%20Copier.meta.js
// ==/UserScript==

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        return clipboardData.setData("Text", text);
    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}


var x = document.getElementsByClassName("sample-test")[0].getElementsByClassName("title");
var i;
for (i = 0; i < x.length; i++) {
        x[i].onclick = function(event){myFunction(event);};
}

function myFunction(event) {
    var eea = event.currentTarget;
    var testx = eea.parentElement.getElementsByTagName("PRE")[0];
    var nsq = testx.innerHTML.replace(/<br>/gi,"\n");
    copyToClipboard(nsq);
    eea.style.backgroundColor = "red";
    setTimeout(function() {
        eea.style.backgroundColor = "white";
    }, 1000);
}