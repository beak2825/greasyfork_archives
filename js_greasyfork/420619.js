// ==UserScript==
// @name ROMhacking Image Zoomer
// @namespace mitigd
// @description when clicking a screenshot the image will zoom to your browsers height.
// @match https://www.romhacking.net/*
// @grant none
// @version 0.0.1.20210125012953
// @downloadURL https://update.greasyfork.org/scripts/420619/ROMhacking%20Image%20Zoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/420619/ROMhacking%20Image%20Zoomer.meta.js
// ==/UserScript==

(function() {
  
  const a = document.getElementsByClassName('center')[1];

  let links = a.getElementsByTagName('a');
  let result = [].slice.call(links);
  
  let overlay = document.createElement('div')
  overlay.setAttribute('class', 'overlay');
  overlay.setAttribute('style', 'display: none;');
  
  document.body.prepend(overlay);
  
  let box = document.createElement('img');
  box.setAttribute('class', 'box');
  box.setAttribute('style', 'display: none;');
  let sOverlay = document.getElementsByClassName('overlay')[0];
  
  document.body.prepend(box);
  
  let sBox = document.getElementsByClassName('box')[0];
  
  overlay.addEventListener('click', function (e) { 
    
    sOverlay.setAttribute('style', 'display: none;');
    box.setAttribute('style', 'display: none;');
    
  }, false);    

  result.forEach((child) => {
      
    let sElem = child.childNodes[0];
    let sSrc = sElem.getAttribute('src');
    
    child.addEventListener('click', function (e) { 
        
      sOverlay.setAttribute('style', 'background-color: black !important; position: fixed; top: 0; right: 0; bottom: 0; left: 0; opacity: 0.5; display: flex;');
      box.setAttribute('style', 'position: fixed !important; height: 100%; opacity: 1.0; position: absolute; z-index: 10; top: 50%; left: 50%; transform: translate(-50%,-50%); display: flex;');
      sBox.setAttribute('src', sSrc);
      
    }, false);    
    
    child.removeAttribute('href');
    
  });
  
  
})();
