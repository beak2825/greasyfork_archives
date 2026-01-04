// ==UserScript==
// @name         Fix google ulr redirects
// @version      0.1
// @description  Prevent redirect from google search results to the redirector site google.com/url
// @author       CoilBlimp
// @grant        none
// @include      http://*.google.com/search*
// @include      https://*.google.com/search*
// @include      https://*.google.*/search*
// @namespace https://greasyfork.org/users/392376
// @downloadURL https://update.greasyfork.org/scripts/391644/Fix%20google%20ulr%20redirects.user.js
// @updateURL https://update.greasyfork.org/scripts/391644/Fix%20google%20ulr%20redirects.meta.js
// ==/UserScript==

(function() {
    let alist = document.getElementsByTagName("a");

    let amountOfChangedUrls = 0;

    let changedUrlDiv = document.createElement("div");
    changedUrlDiv.id = "changedUrlDiv";
    changedUrlDiv.style.cssText = "background: #333333; z-index: 1000000; color: white; position: fixed; top: 13em; right: 1%; border: solid 2px #aaa !important; border-radius: 5px; padding: 5px;"
    changedUrlDiv.innerHTML = "parsing urls...";
    document.body.appendChild(changedUrlDiv);

    for(let i = alist.length-1; i >=0; i--){
        if(alist[i].hasAttribute("onmousedown")){
            alist[i].removeAttribute("onmousedown")
            amountOfChangedUrls++;
        }
    }
    console.log("Changed " + amountOfChangedUrls + " urls ")
    changedUrlDiv.innerHTML = "Changed " + amountOfChangedUrls + " urls";

})();