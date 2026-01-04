// ==UserScript==
// @name         Egg Alert
// @namespace    Heasleys.EggAlert
// @version      1.0.6
// @description  Alert on Easter Eggs
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424494/Egg%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/424494/Egg%20Alert.meta.js
// ==/UserScript==


(function() {

var observer = new MutationObserver(function(mutations, observer) {

      mutations.forEach(function(mutation) {

        for (const element of mutation.addedNodes) {
          if (element.querySelector && element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]')) {
            var image = element.querySelector('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]');
            if ($('img[src^="competition.php"][src*="step=eggImage"][src*="access_token="]').parent('a[class*="-popup-link"]').length > 0) {
            image.onload = function() {detectEgg(this);}
            }
          }
        }
      });
});

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});



function detectEgg(image) {
  var opac = opacityRatio(image);
  if (opac == 0) {
    console.log(`Fake Easter Egg found. Ignoring...`);
  } else {
    alert(`Easter Egg found. Look closely on the page to find it!`);
    console.log(`Easter Egg found. Look closely on the page to find it!`);
  }
}


function opacityRatio(image) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0);
    const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let opacity = 0;
    for (let i = 0; i < data.length; i += 4) {
        opacity += data[i + 3];
    }
    return (opacity / 255) / (data.length / 4);
}


})();
