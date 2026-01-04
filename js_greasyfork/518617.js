// ==UserScript==
// @name         Pearltrees Copy text button
// @namespace    http://tampermonkey.net/
// @version      2024-11-14
// @description  Tampermonkey script to add a copy button to pearltrees 'notes'.
// @author       You
// @match        https://www.pearltrees.com/*
// @license      GNU GPLv3
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518617/Pearltrees%20Copy%20text%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/518617/Pearltrees%20Copy%20text%20button.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let styleSheet = `
.copyBtn {
    padding:0;
    margin:0;
    font-size: 15px;
    background:rgb(0,0,0,.65);
    color:rgb(255,255,255);
    border-radius:50%;
    border-color:rgb(0,0,0,.65);
    width:20px;
    height:20px;
}
`;
    let s = document.createElement('style');
    s.type = "text/css";
    s.innerHTML = styleSheet;
    (document.head || document.documentElement).appendChild(s);

    var flag = false ;
    var output = " ";
    var previousOutput = null;

    var previousButtonContainer = null;
    var previousContainer = null;
    var pElements = null;
    var previousPElements = null;
    var previousPElementsId = null;
    var vraiContainer="";
    let JSP = 1;
    var previousVraiContainerId = "";


    function checkParagraphCount() {
        const container = document.getElementsByClassName('scrap-selection-container');
        // console.log("container.length : " + container.length + " || flag : "+flag + "|| JSP : " + JSP)

        if(container.length!==0 && flag === true ){

            for(let i=0; i<container.length;i++) {
                  vraiContainer = container[i];
              //  console.log("vraiContainer.id = " + vraiContainer.id + "// previousVraiContainerId = "+ previousVraiContainerId )
                if (vraiContainer.id != previousVraiContainerId ){
                    // console.log("ALORSPEUTETRE")
                    break
                }
            }

            pElements = vraiContainer.querySelectorAll('p');
            if (pElements.length == 0) return // console.log("ABORT THE MISSION" + vraiContainer.id)

            vraiContainer.style.borderRadius = "15px";
            vraiContainer.style.transition = ".7s"
            vraiContainer.title = "click to copy"
            vraiContainer.onclick = function() {
                navigator.clipboard.writeText(output);
                alert('Text Copied Successfully!')
            }
            vraiContainer.onmouseover = function() {vraiContainer.style.background = "rgb(240, 240, 240)"}
            vraiContainer.onmouseout = function() {vraiContainer.style.background = "rgb(255,255,255)"}

            // console.log("1er if passe")
            vraiContainer.id = JSP;
            previousVraiContainerId = JSP;

            if (output != " ") previousOutput = output
            output = "";

            for(let i=0; i<pElements.length;i++) {
                let outputToAdd = pElements[i].textContent
                output+= outputToAdd + '\n\n' ;
            }

            pElements = null;
            flag = false;
            previousContainer=container;
            JSP += 1;

            // console.log("OUTPUT\\\\\\\\\\\\      " +output + "    \\\\\\\\\\\\OUTPUT")
            // output = "";
            // previousButtonContainer = buttonContainer;
            // console.log(pElements);

            // console.log(pElementsId)
            // previousPElementsId = pElementsId;
            // console.log('FLAG = FALSE')

            // console.log ( " JPS + = 1" )
        }
    }


    const observer2 = new MutationObserver(checkParagraphCount);
    observer2.observe(document.body, { childList: true, subtree: true });
    checkParagraphCount();

    function checkUrl() {
        var path = window.location.pathname;
        var page = path.split("/").pop();
        var precedentPath = "";
        if(page.startsWith('item') && precedentPath!=path) {
            flag = true;
            // console.log('FLAG = TRUE')
            precedentPath=path;
        }
    }

    checkUrl();
    window.addEventListener('popstate', checkUrl);
    const pushState = history.pushState;
    const replaceState = history.replaceState;
    history.pushState = function() {
        pushState.apply(history, arguments);
        checkUrl();
    };
    history.replaceState = function() {
        replaceState.apply(history, arguments);
        checkUrl();
    };



})();