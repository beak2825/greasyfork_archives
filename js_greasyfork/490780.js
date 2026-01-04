// ==UserScript==
// @name     Ikea 3D Model Downloader
// @version  1.2
// @include  https://www.ikea.com*
// @grant    none
// @author timonsku
// @license MIT
// @description A script to download 3D models in the 3D model viewer on Ikeas product pages.
// @namespace https://greasyfork.org/en/scripts/490780
// @downloadURL https://update.greasyfork.org/scripts/490780/Ikea%203D%20Model%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/490780/Ikea%203D%20Model%20Downloader.meta.js
// ==/UserScript==


window.addEventListener('load', function() {

  let scriptTags = document.body.querySelectorAll('script[type="application/ld+json"]')
  let modelList = []
  for(const script of scriptTags) {
    scriptJson = JSON.parse(script.innerHTML); 
    if(scriptJson["@type"] == "3DModel"){
      console.log("found 3DModel list")  
      modelList = scriptJson.encoding
    }
  }
    
  
  console.log(modelList)
  if(modelList.length == 0){
    console.log("Empty model list")
    return
  }
  
  let favoredURL = ""
  for(const model of modelList) {
    let url = model.contentUrl
    
    if(model.contentUrl.match(/\/glb\/.*iqp3.*/i) != null){
      
      console.log("found IQP3 without draco")
      favoredURL = url
    }
  }
  if(favoredURL == ""){
    console.log("could not find IQP3 checking for lower quality RQ3")
     for(const model of modelList) {
      let url = model.contentUrl
  
      if(model.contentUrl.match(/\/glb\/.*rqp3.*/i) != null){
        console.log("found RQP3 without draco")
        favoredURL = url
      }
    }
  }
  
  if(favoredURL == ""){
  	console.log("no suitable model found, using first one in list")
    favoredURL = modelList[0].contentUrl
  }
  
  let downloadButton = document.createElement("button");
  downloadButton.onclick = function() {
    window.location.href = favoredURL;
  }
  downloadButton.classList.add("pip-btn", "pip-btn--emphasised", "pip-btn--fluid");
  // add span to button
  let span = document.createElement("span");
  span.classList.add("pip-btn__inner");
  // add label to span
  let label = document.createElement("span");
  label.classList.add("pip-btn__label");
  label.innerHTML = "Download 3D Model";
  span.appendChild(label);
  downloadButton.appendChild(span);

  buttonSection = document.querySelector(".js-price-package.pip-price-package")
  //append after buttonSection
  buttonSection.parentNode.insertBefore(downloadButton, buttonSection.nextSibling);
  
}, false);
   