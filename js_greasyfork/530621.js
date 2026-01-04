// ==UserScript==
// @name        Huawei AppGallery direct APK Download
// @name:it     Download diretto degli APK da Huawei AppGallery
// @namespace   StephenP
// @match       https://appgallery.huawei.com/*
// @grant       none
// @version     1.0
// @author      StephenP
// @description Directly download APK files from Huawei AppGallery.
// @description:it Scarica direttamente i files APK da Huawei AppGallery.
// @downloadURL https://update.greasyfork.org/scripts/530621/Huawei%20AppGallery%20direct%20APK%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/530621/Huawei%20AppGallery%20direct%20APK%20Download.meta.js
// ==/UserScript==
var lastUrl = "";
const checkInterval = setInterval(function() {
    // Get the current URL
    const currentUrl = window.location.href;

    // Check if the URL has changed
    if (currentUrl !== lastUrl) {
      console.log('URL changed:', currentUrl);

      // Remove the element with ID "ddlButton" if it exists
      const ddlButton = document.getElementById('ddlButton');
      if (ddlButton) {
          ddlButton.remove();
      }

      // Find the first element with class "right_install" and duplicate it [desktop interface]
      const rightInstallElements = document.getElementsByClassName('right_install');
      if (rightInstallElements.length > 0) {
          const firstElement = rightInstallElements[0];
          const clonedElement = firstElement.cloneNode(true);
          firstElement.parentNode.appendChild(clonedElement);
          clonedElement.firstChild.href=window.location.href.replace("appgallery.huawei.com/app/","appgallery.cloud.huawei.com/appdl/");
          clonedElement.firstChild.textContent="Download APK";
          clonedElement.firstChild.style.backgroundColor="#280";
          clonedElement.style.marginLeft="0.5em"
          clonedElement.id="ddlButton";
          // Update lastUrl to the current URL
          lastUrl = currentUrl;
          return
      }
      // Find the first element with class "right_install" and duplicate it [mobile interface]
      const mobileInstallElements = document.querySelectorAll('.mw_detailheadcard>.part_top>.right>.row3');
      if (mobileInstallElements.length > 0) {
          const firstElement = mobileInstallElements[0];
          const clonedElement = firstElement.cloneNode(true);
          firstElement.parentNode.appendChild(clonedElement);
          clonedElement.onclick=function(){window.open(window.location.href.replace("appgallery.huawei.com/app/","appgallery.cloud.huawei.com/appdl/"),"_self")};
          clonedElement.firstChild.textContent="Download APK";
          clonedElement.style.backgroundColor="#280";
          clonedElement.id="ddlButton";
          // Update lastUrl to the current URL
          lastUrl = currentUrl;
          return
      }

    }
}, 1000); // Check every 1 second
