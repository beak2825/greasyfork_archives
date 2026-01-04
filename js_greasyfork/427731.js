// ==UserScript==
// @name        See It All
// @namespace   Violentmonkey Scripts
// @match       https://*.nzherald.co.nz/*
// @grant       none
// @version     1.12
// @author      -
// @description NZHerald sends a lot of content to your browser for free ( the premium content) but use CSS to hide it. This will let you view all hidden content and remove unnecessary clutter from page.  All recommended to run ublock origin to block all ads.
// @downloadURL https://update.greasyfork.org/scripts/427731/See%20It%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/427731/See%20It%20All.meta.js
// ==/UserScript==

setTimeout(function(){
  var maxId = setTimeout(function(){}, 0);
for(var i=0; i < maxId; i+=1) { 
    clearTimeout(i);
}
document = document.cloneNode(true);
function classOk(n) {
  console.log(n);
  if(n.startsWith("arti")) return true;
  if(n.startsWith("respo")) return true;
  if(n.startsWith("load")) return true;  
  if(n.startsWith("share-bar")) return true;  
  if(n.startsWith("social")) return true;  
  if(n.startsWith("story-")) return true;  
  if(n.startsWith("meta")) return true;  
  if(n.startsWith("related")) return true;  
  return false;
}
  function removeElementBySelector(s) {
    try {
      let someNodes = document.querySelectorAll(s);
      for(let e of someNodes) {
        e.parentNode.removeChild(e);  
      }      
    } catch(e){      
    }    
  }
  function removeElementClass(n){
    try {
      let someNodes = document.getElementsByClassName(n);
      for(let e of someNodes) {
        e.parentNode.removeChild(e);  
      }      
    } catch(e){      
    }
  }
   function removeElementType(n){
    try {
      let someNodes = document.getElementsByTagName(n);
      for(let e of someNodes) {
        e.parentNode.removeChild(e);  
      }
    } catch(e){
      
    }
  }
  function removeEmptyClass(n){
    try {
      let someNodes = document.getElementsByClassName(n);
      for(let e of someNodes) {
        if(e.innerHTML === "") e.parentNode.removeChild(e);  
      }      
    } catch(e){      
    }
  }
  function removeNewsLetter() {
      try {
      let someNodes = document.getElementsByTagName("a");
      for(let e of someNodes) {
        console.log(e, e.href)
        if(e.href.includes("newsletter") && e.href.includes("nzherald.co.nz")) e.parentNode.removeChild(e);  
      }    
      }
    catch(e){      
    }
    
  }
  function checkElement(e){
    for(let n of e.classList){
    if(!classOk(n)) e.classList.remove(n)
    }; 
    e.style.display = ""
    //e.style = document.createElement('style')
  }
  function checkRecursive(e) {
     checkElement(e)
     for(let c of e.children) {
       checkRecursive(c)
     }
  }
for(let e of document.querySelectorAll("section.article__body > *")) {
  checkRecursive(e)
  }
  
  
 
  setTimeout(function(){     
    removeElementClass("article-offer");
    removeElementClass("premium-toaster");
    removeElementClass("header__sub-btn");      
    removeElementClass("user-actions__premium-subscription-link");
    removeElementClass("website-of-year")
    removeElementClass("masthead")
    removeElementClass("ad-container")
    removeElementClass("ad__heading")  
    removeElementClass("OUTBRAIN")  
    removeElementClass("btn-premium-wrapper")  
    removeElementClass("action-bar")  
    removeElementClass("blank")  
    removeElementClass("section-oneroof-search-bar")  
    removeElementClass("commenting__count")  
    removeElementClass("commenting")  
    removeElementBySelector('[data-test-ui="email-boost--container"]')
    
    
    removeElementType("iframe")
    removeEmptyClass("chain-sidebar")
    removeNewsLetter()
    
    setInterval(function(){      
      removeEmptyClass("chain-sidebar")
      removeElementClass("ad__heading")  
      removeElementClass("ad-container")
      removeElementType("iframe")
    }, 200)
    
  },100);
}, 200);
