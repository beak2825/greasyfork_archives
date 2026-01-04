// ==UserScript==
// @name         Google Form Barcode Scanner
// @version      0.9.3
// @description  Submit the form on Enter, auto redirect & focus
// @author       Hafizan Yassin
// @match        https://docs.google.com/*/formResponse*
// @match        https://docs.google.com/*/viewform*
// @grant        none
// @namespace https://greasyfork.org/users/583038
// @downloadURL https://update.greasyfork.org/scripts/404995/Google%20Form%20Barcode%20Scanner.user.js
// @updateURL https://update.greasyfork.org/scripts/404995/Google%20Form%20Barcode%20Scanner.meta.js
// ==/UserScript==


if (document.getElementsByTagName("form").length === 0) {
    setTimeout(function(){
        document.location = document.location.href.replace("formResponse", "viewform");
    }, 0);
}



document.querySelector("input[type=text]").addEventListener('keypress', function(e){
    if (e.keyCode == 9) {
        window.onbeforeunload = null;
        e.target.form.submit();
    }
})


document.querySelector("input[type=text]").focus();
        return;