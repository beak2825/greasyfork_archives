// ==UserScript==
// @name         [CityU] Pass3 Auto Create Main.java
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  CityU Pass3 Helper for uploading Java Codes
// @author       You
// @match        https://pass3.cs.cityu.edu.hk/submission.do?method=create*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=edu.hk
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454218/%5BCityU%5D%20Pass3%20Auto%20Create%20Mainjava.user.js
// @updateURL https://update.greasyfork.org/scripts/454218/%5BCityU%5D%20Pass3%20Auto%20Create%20Mainjava.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fileObj = document.getElementById("inputFile(1)")
    let file = new File(['text1', 'text2'], 'Main.java', {type: 'text/plain'});
    let container = new DataTransfer();
    container.items.add(file);
    fileObj.files = container.files;


    let newStyle = `
    html {
        margin-left: 42%;
    }

    #inputFile\\(5\\) {
        position: fixed;
        left: 0;
        top: 0;
        width: 40%;
        height: 47vh;
    }

    a[href='javascript:testProgram()'] {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 40%;
        height: 47vh;
    }

    #inputFile\\(4\\) {
        height: 150px;
    }
    #inputFile\\(3\\) {
        height: 150px;
    }
    #inputFile\\(2\\) {
        height: 150px;
    }
    `;

    let newStyleEle = document.createElement("style");
    newStyleEle.innerHTML = newStyle;
    document.body.appendChild(newStyleEle);


})();