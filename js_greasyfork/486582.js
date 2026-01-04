// ==UserScript==
// @name         DownLoadLiveImage
// @namespace    http://tampermonkey.net/
// @version      2024-02-04
// @description  Download Success livness detection pictures
// @author       MeGa
// @match        https://playground.bioid.com/LivenessDetection
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bioid.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486582/DownLoadLiveImage.user.js
// @updateURL https://update.greasyfork.org/scripts/486582/DownLoadLiveImage.meta.js
// ==/UserScript==

var WaiterForLiveSucess = setInterval(function(){
if(document.querySelector("#result-view > h4") !==null){
downloadImageById('image1');
downloadImageById('image2');
//Reload Pages
setTimeout(function(){window.location.reload();} ,3000);
    clearInterval(WaiterForLiveSucess)
}

},3000)

//Déclaration, function
function downloadImageById(elementId) {
  // Récupérer l'élément image par son ID
  var myElement = document.getElementById(elementId);

  // Vérifier si l'élément existe
  if (myElement) {
    // Récupérer l'URL de l'image
    var imageUrl = myElement.src;

    // Utiliser fetch pour récupérer le contenu de l'image
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => {
        // Créer un objet Blob à partir du contenu de l'image
        var blobUrl = window.URL.createObjectURL(blob);

        // Créer un lien (a) pour déclencher le téléchargement
        var downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download =  elementId +'_download.png'; // Nom du fichier à télécharger avec l'extension .png

        // Ajouter le lien à la page et déclencher le téléchargement
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Retirer le lien de la page après le téléchargement
        document.body.removeChild(downloadLink);
      })
      .catch(error => {
        console.error('Erreur lors du téléchargement de l\'image :', error);
      });
  } else {
    console.error('L\'élément image avec l\'ID ' + elementId + ' n\'existe pas.');
  }
}


