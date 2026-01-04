// ==UserScript==
// @name         Download photos from Badoo
// @namespace    StephenP
// @version      1.0
// @description  Download photos from Badoo. Useful to check if they are stolen photos appearing somewhere else on the web using Google Images or Tineye.
// @author       StephenP
// @icon         data:image/x-icon;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9OHgA+Dl+APg9eAD8RYcA+UeOAPdSmgD9X6QA+WayAPlruwDzfNIA8oDZAPWQ5wDykuwA8Zf0APCb+gAAAAAA/wASEQAgAP/yIiEiIhIgDwESAiIiMgAhEiEjiZhCISECIWvu7rYhIBIW7u297WIREkvscze+tCIjjuZ8yH7YIRKutM7sTOkREq7b7u686iEifN3t3u3YEQIZ3cds7ZIhEiJFQiRUEQEBASAAAAIiEfARESIiIgEf/xAQEBAQEP/AAwAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA
// @match        https://badoo.com/*
// @match        https://*.badoo.com/*
// @downloadURL https://update.greasyfork.org/scripts/415182/Download%20photos%20from%20Badoo.user.js
// @updateURL https://update.greasyfork.org/scripts/415182/Download%20photos%20from%20Badoo.meta.js
// ==/UserScript==
var isGalleryAlreadyOpen=false;
var observer2;
(function(){
  const targetNode = document.getElementsByClassName('page__content js-page-content')[0];
  const config = { attributes: false, childList: true, subtree: true };
  const callback = function(mutationsList, observer) {
      for(const mutation of mutationsList) {
          if (mutation.type === 'childList') {
              console.log('A child node has been added or removed.');
              if((document.getElementById("mm_cc"))&&(isGalleryAlreadyOpen==false)){
                createDlButton();
            		isGalleryAlreadyOpen=true;
              }
            	else if((!document.getElementById("mm_cc"))&&(isGalleryAlreadyOpen==true)){
                isGalleryAlreadyOpen=false;
                try{
                  observer2.disconnect();
                }
                catch(err){
                  console.log("Cannot disconnect observer2. It should be a MutationObserver, but it is a "+observer2);
                }
              }
          }
          else if (mutation.type === 'attributes') {
              console.log('The ' + mutation.attributeName + ' attribute was modified.');
          }
      }
  };
  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
})();

function createDlButton(){
  const dlButton=document.createElement("DIV");
  dlButton.className="photo-gallery__abuse";
  dlButton.style.bottom="70px";
  dlButton.innerHTML="▼";
  const photoHolder=document.getElementsByClassName("js-mm-photo-holder")[0];
  photoHolder.parentNode.appendChild(dlButton);
  addLink(photoHolder,dlButton);
  const config2 = { attributes: false, childList: true, subtree: true };
  const callback = function(mutationsList, observer2) {
      for(const mutation of mutationsList) {
          if(mutation.type === 'childList') {
            if(!photoHolder.parentNode.parentNode.className.includes("mm_private_photos")){
              dlButton.style.display="flex";
              addLink(photoHolder,dlButton);
            }
            else{
              dlButton.style.display="none";
            }
          }
      }
  };
  observer2 = new MutationObserver(callback);
  observer2.observe(photoHolder, config2);
}
function addLink(photoHolder,dlButton){
  if(photoHolder.getElementsByTagName("VIDEO").length==0){
  	dlButton.onclick=function(){window.open(photoHolder.getElementsByTagName("img")[0].getAttribute("src"),"_blank")};
  }
  else{
    dlButton.onclick=function(){window.open(photoHolder.getElementsByTagName("video")[0].getAttribute("src"),"_blank")};
  }
}