// ==UserScript==
// @license MIT
// @description      wo
// @name             3some helper
// @match            https://www.nitrotype.com/*
// @author           Ginfio
// @run-at           document-start
// @grant            none
// @version          6.9.6
// @namespace httpsasers/943086
// @downloadURL https://update.greasyfork.org/scripts/476035/3some%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/476035/3some%20helper.meta.js
// ==/UserScript==

console.log("loaded")
function removeImagesAndSVGs() {
	console.log("called function")
    const canvas = document.querySelectorAll("canvas");
    const images = document.querySelectorAll("img");
    const header = document.querySelectorAll("header");
    const footer = document.querySelectorAll("footer");
    const btns = document.querySelectorAll("button");
    const svgs = document.querySelectorAll("svg");
     const link = document.querySelectorAll("link");
     const list = document.querySelectorAll(".racev3-header");
 
    
    images.forEach((image) => {
        image.remove();
    });
    
     list.forEach((list) => {
        list.remove();
    });

	header.forEach((header) => {
        header.remove();
    });
    
    footer.forEach((footer) => {
        footer.remove();
    });
    
    btns.forEach((btns) => {
        btns.remove();
    });
    
	
	svgs.forEach((svg) => {
        svg.remove();
    });
    

	 link.forEach((link) => {
        link.remove();
    });
    
  
    
    canvas.forEach((canvas) => {
        canvas.remove();
    });
}

const observerConfig = {
    childList: true, 
    subtree: true,   
};


const observer = new MutationObserver((mutationsList, observer) => {

    removeImagesAndSVGs();
});

window.addEventListener("load", () => {
    // Start observing the document with the specified configuration
    observer.observe(document.body, observerConfig);
});

// Initially remove images and SVGs when the page loads
removeImagesAndSVGs();