// ==UserScript==
// @name         Copy motorola jira id and summary and link
// @name:zh-CN   快速复制jira id和summary/link
// @namespace    http://tampermonkey.net/
// @description  Add three button to copy the jira id and summary and link
// @description:zh-cn  添加三个按钮用于快速复制motorola jira的id和summary和link
// @author       Andy
// @version      0.5
// @match        https://idart.mot.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mot.com
// @run-at       document-end
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/432095/Copy%20motorola%20jira%20id%20and%20summary%20and%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/432095/Copy%20motorola%20jira%20id%20and%20summary%20and%20link.meta.js
// ==/UserScript==


(function () {
    'use strict';


    GM.addStyle(`
      #snackbar {
  visibility: hidden;
  min-width: 250px;
  margin-left: -125px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  padding: 16px;
  position: fixed;
  z-index: 1;
  left: 50%;
  top: 50px;
  font-size: 17px;
}


#snackbar.show {
  visibility: visible;
  -webkit-animation: fadein 0.5s, fadeout 0.5s 2.5s;
  animation: fadein 0.5s, fadeout 0.5s 2.5s;
}


@-webkit-keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}


@keyframes fadein {
  from {top: 0; opacity: 0;}
  to {top: 50px; opacity: 1;}
}


@-webkit-keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}


@keyframes fadeout {
  from {top: 50px; opacity: 1;}
  to {top: 0; opacity: 0;}
}
    `);
    let observeDOM = (function () {
        let MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        let eventListenerSupported = window.addEventListener;



        return function (obj, onAddCallback, onRemoveCallback) {
            if (MutationObserver) {
                // define a new observer
                let mutationObserver = new MutationObserver(function (mutations, observer) {
                    if (mutations[0].addedNodes.length && onAddCallback != undefined) {
                        onAddCallback();
                    }
                });
                // have the observer observe foo for changes in children
                mutationObserver.observe(obj, {
                    childList: true
                });
            } else if (eventListenerSupported) {
                obj.addEventListener('DOMNodeInserted', onAddCallback, false);
            }
        };
    })();




    let ff = function () {
        if (document.getElementById("copy_id") == null) {
            addCopyBtn();
        }
    }



    let c = document.getElementsByClassName('issue-container')[0];
    console.log(`=======================issue-container: ${c}`)
    observeDOM(c, /*onAdd*/ ff, /*onRemove*/ ff);
})();



function addCopyBtn() {
    const container = document.getElementById('stalker');
    const issueKey = document.getElementById("key-val");
    const issueName = document.getElementById("summary-val");



    if(!container) return;



    const divE = document.createElement("div");
    divE.id="snackbar";
    divE.innerHTML="Copied succesfully"
    container.appendChild(divE);

    const newElement = document.createElement("li");
    const idE = document.createElement("a");
    idE.innerHTML="Copy id";
    idE.className="aui-button aui-button-primary aui-style";
    idE.id="copy_id";
    idE.onclick= (e) => {
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        navigator.clipboard.writeText(issueKey.childNodes[0].data);
        //console.log("CopyId_"+ issueKey.childNodes[0].data);

        setTimeout(function(){
            snackbar.className = snackbar.className.replace("show", "");
        }, 1500);
    };
    newElement.appendChild(idE);
    issueKey.parentNode.parentNode.appendChild(newElement);


    const newElement2 = document.createElement("li");
    const summaryE = document.createElement("a");
    summaryE.className="aui-button aui-button-primary aui-style";
    summaryE.innerHTML="Copy summary";
    summaryE.id="copy_summary";
    summaryE.onclick= (e) => {
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        navigator.clipboard.writeText(issueName.childNodes[0].data);
        //console.log("CopySummary_"+ issueName.childNodes[0].data);

        setTimeout(function(){
            snackbar.className = snackbar.className.replace("show", "");
        }, 1500);
    };
    newElement2.appendChild(summaryE);
    issueKey.parentNode.parentNode.appendChild(newElement2);



    const newElement3 = document.createElement("li");
    const linkE = document.createElement("a");
    linkE.className="aui-button aui-button-primary aui-style";
    linkE.innerHTML="Copy link";
    linkE.id="copy_link";
    linkE.onclick= (e) => {
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";
        navigator.clipboard.writeText("https://idart.mot.com/browse/" + issueKey.childNodes[0].data);
        //console.log("CopyLink_"+ "https://idart.mot.com/browse/" + issueKey.childNodes[0].data);

        setTimeout(function(){
            snackbar.className = snackbar.className.replace("show", "");
        }, 1500);
    };



    newElement3.appendChild(linkE);
    issueKey.parentNode.parentNode.appendChild(newElement3);



    const newElement4 = document.createElement("li");
    const idSummaryE = document.createElement("a");
    idSummaryE.className="aui-button aui-button-primary aui-style";
    idSummaryE.innerHTML="Copy as git title";
    idSummaryE.id="copy_id_summary";
    idSummaryE.onclick= (e) => {
        var snackbar = document.getElementById("snackbar");
        snackbar.className = "show";

        navigator.clipboard.writeText(issueKey.childNodes[0].data + " " + issueName.childNodes[0].data);

        setTimeout(function(){
            snackbar.className = snackbar.className.replace("show", "");
        }, 1500);
    };


    newElement4.appendChild(idSummaryE);
    issueKey.parentNode.parentNode.appendChild(newElement4);
}