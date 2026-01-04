// ==UserScript==
// @name     			Furaffinity Webcomic Autoloader SX
// @version  			0.1.3
// @description  	Gives you the option to load all the subsequent comic pages on a FurAffinity comic page automatically.
// @grant    			none
// @author   			Sofox
// @match    			*://*.furaffinity.net/view/*
// @namespace     https://www.sofoxcentral.com
// @downloadURL https://update.greasyfork.org/scripts/391223/Furaffinity%20Webcomic%20Autoloader%20SX.user.js
// @updateURL https://update.greasyfork.org/scripts/391223/Furaffinity%20Webcomic%20Autoloader%20SX.meta.js
// ==/UserScript==
var rootHolder = document.getElementById("submissionImg");
var counter = 5;

function insertAfter(newElement, referenceElement){
        referenceElement.parentNode.insertBefore(newElement, referenceElement.nextSibling);
}
function insertBreakAfter(referenceElement){
   var br = document.createElement("br");
   insertAfter(br, referenceElement)
}

function getNextLink(doc){
  	if(doc.getElementsByClassName("parsed_nav_links")[0].childNodes.length<5){
      return null;
    }
		return doc.getElementsByClassName("parsed_nav_links")[0].childNodes[4].href
}

function loadNextPage(nextLink){

  if(nextLink){
    console.log("Loading next..."); 
    var request = new XMLHttpRequest();
    request.open('GET', nextLink, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        //var data = JSON.parse(this.response);
        parser = new DOMParser();
        var nextPage = parser.parseFromString(this.response, "text/html");
        //alert(this.response)
        var nl = getNextLink(nextPage)
        var img = nextPage.getElementById("submissionImg")
        img.classList.remove("blocked-content");

        rootHolder.parentNode.insertBefore(img, rootHolder.nextSibling);
        rootHolder = rootHolder.nextSibling
        
        insertBreakAfter(rootHolder);
        rootHolder = rootHolder.nextSibling
        
        var lnk = document.createElement('a');
        var lnkURL = nextLink 
        lnk.innerHTML = lnkURL
        lnk.href = lnkURL
        insertAfter(lnk, rootHolder)
        rootHolder = rootHolder.nextSibling
        
        insertBreakAfter(rootHolder);
        rootHolder = rootHolder.nextSibling
        
        loadNextPage(nl);
      } else {
        // We reached our target server, but it returned an error
        console.log("none")
      }
    };

    request.onerror = function() {
      // There was a connection error of some sort
          console.log("error");
    };

    request.send();
  }
}
function startAutoloader(){
	//alert("starting...");
  var ab = document.getElementById("autoloaderButton");
  ab.parentNode.removeChild(ab);
  loadNextPage(secondPage);
}

var secondPage = getNextLink(document)
if(secondPage){
  var img = document.getElementById("submissionImg")

  insertBreakAfter(rootHolder);
  rootHolder = rootHolder.nextSibling

  var button = document.createElement('input');
  button.value = "Enable Comic Autoloader (SX)"
  button.type = "button"
  button.id = "autoloaderButton";
  button.onclick = startAutoloader
  insertAfter(button, rootHolder)
}
