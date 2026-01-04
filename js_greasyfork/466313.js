// ==UserScript==
// @name         svn-buttons
// @namespace    svn-buttons
// @version      2
// @description  Adds Collapse All and Expand All buttons to the bottom left of pages on websvn diff page
// @match        https://websvn.orangehrm.com/orangehrm?op=comp&compare[]=*
// @grant        *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466313/svn-buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/466313/svn-buttons.meta.js
// ==/UserScript==

(function() {
    // create the buttons
    const collapseButton = document.createElement("button");
    collapseButton.innerText = "Collapse All";
    const expandButton = document.createElement("button");
    expandButton.innerText = "Expand All";

    // set up the buttons' styles
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.position = "fixed";
    buttonsContainer.style.bottom = "0";
    buttonsContainer.style.left = "0";
    buttonsContainer.style.padding = "10px";
    buttonsContainer.style.backgroundColor = "#fff";

    // add the buttons to the container
    buttonsContainer.appendChild(collapseButton);
    buttonsContainer.appendChild(expandButton);
  
  
  
  	
  	

  

    // add the container to the page
    document.body.appendChild(buttonsContainer);

    // add event listeners to the buttons
    collapseButton.addEventListener("click", () => {
      [...document.querySelectorAll("#wrap .diff > tbody")].map(o=>o.style.display='none')
    });

    expandButton.addEventListener("click", () => {
      
      [...document.querySelectorAll("#wrap .diff > tbody")].map(o=>o.style.display='')
      
    });
  
  	document.querySelectorAll("#wrap .diff > thead").forEach(fileNameNode=>{
      
      //add delete icons
 		// Create the SVG element
		const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    // Set the SVG attributes
    svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgElement.setAttribute("width", "16");
    svgElement.setAttribute("height", "16");
    svgElement.setAttribute("fill", "currentColor");
    svgElement.setAttribute("class", "bi bi-trash-fill");
    svgElement.setAttribute("viewBox", "0 0 16 16");
    svgElement.setAttribute("style", "margin-top: -20px; margin-left: -20px; color: red");

    // Set the SVG content
    svgElement.innerHTML = `<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>`;

      
      
      fileNameNode.appendChild(svgElement);
      
      svgElement.addEventListener("click", (event) => {
        
        event.target.closest('table').remove()
      
    	});
      
    
    	fileNameNode.addEventListener('click', function handleClick(event) {

        if(fileNameNode.nextElementSibling.style.display==''){
          fileNameNode.nextElementSibling.style.display='none'
        }
         else{
          fileNameNode.nextElementSibling.style.display=''
         }


    	});
      
    })
  
  
  
  
  
  
})();
