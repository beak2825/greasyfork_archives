// ==UserScript==
// @name         מסתיר חדרי הנהלה
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  התוסף מסתיר את חדרי ההנהלה בדף הראשי של האתר
// @author       avishaiUniverse
// @match        https://www.fxp.co.il/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414753/%D7%9E%D7%A1%D7%AA%D7%99%D7%A8%20%D7%97%D7%93%D7%A8%D7%99%20%D7%94%D7%A0%D7%94%D7%9C%D7%94.user.js
// @updateURL https://update.greasyfork.org/scripts/414753/%D7%9E%D7%A1%D7%AA%D7%99%D7%A8%20%D7%97%D7%93%D7%A8%D7%99%20%D7%94%D7%A0%D7%94%D7%9C%D7%94.meta.js
// ==/UserScript==

(function() {
    let a = document.getElementById("forums").getElementsByTagName("li")
    for (var x of a) {
        if (x.id.includes("forum")) {
            console.log(x.innerText)
            if (x.innerText.includes("הנהלת")) x.remove()
        }
    }
    for (var y of a) {
        if (y.id.includes("forum")) {
            console.log(y.innerText)
            if (y.innerText.includes("הנהלת")) y.remove()
        }
    }
})();