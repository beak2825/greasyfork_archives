// ==UserScript==
// @name         Oh God Save My Papers!
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Auto Save your papers from KIIT results page.
// @author       erucix
// @match        *://evaluation.kiitresults.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kiitresults.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486083/Oh%20God%20Save%20My%20Papers%21.user.js
// @updateURL https://update.greasyfork.org/scripts/486083/Oh%20God%20Save%20My%20Papers%21.meta.js
// ==/UserScript==


function takeSS(elementName, page){

    let table = document.querySelectorAll("table")[4];
    let anchor = table.querySelectorAll("a");

    html2canvas(elementName).then(function (canvas) {
        let dataURL = canvas.toDataURL();

        let timestamp = new Date().getTime();
        let fileName = page + '.png';

        let downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = fileName;

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        try {
            anchor[page].click();
            sessionStorage.setItem("page", page + 1);
        } catch(e){
            sessionStorage.setItem("page", 1);
            sessionStorage.setItem("continue", "false");
        }
    });
}

(function() {
    'use strict';
    let toContinue = sessionStorage.getItem("continue") == "true" ? true : false;
    let currentPage = sessionStorage.getItem("page") || 1;
    currentPage = Number(currentPage);


    // Append the library script to body.
    let script = document.createElement("script");
    script.src = "https://html2canvas.hertzen.com/dist/html2canvas.min.js";
    document.body.appendChild(script);


    // let style = document.createElement("style");
    // style.innerHTML = `.download-button:hover{transform: scale(1.5);}`;
    // document.body.append(style);

    let downloadButton = document.createElement("button");

    downloadButton.classList.add("download-button");
    downloadButton.setAttribute("title", "Save the papers to PC");

    Object.assign(downloadButton.style, {
        "position":"fixed",
        "bottom":"0",
        "right":"0",
        "transform":"rotate(90deg)",
        "font-size": "2em",
        "border-radius":"50%",
        "cursor":"pointer",
        "transition":".3s"
    });

    setTimeout(function(){
        if(toContinue){
            takeSS(document.body, currentPage);
            console.log(toContinue);
        }
    }, 1000);

    downloadButton.innerHTML = "&#10161;";

    downloadButton.addEventListener("click", ()=>{
        sessionStorage.setItem("continue", "true");
        takeSS(document.body, currentPage);
    });

    document.body.appendChild(downloadButton);
})();