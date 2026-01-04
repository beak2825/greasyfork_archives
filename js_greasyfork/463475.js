// ==UserScript==
// @name         downtoutemonannee
// @version      1
// @description  Télécharger les albums de toutemonannee.com
// @author       jp
// @match        https://www.toutemonannee.com/*
// @license      MIT 
// @namespace https://greasyfork.org/users/177745
// @downloadURL https://update.greasyfork.org/scripts/463475/downtoutemonannee.user.js
// @updateURL https://update.greasyfork.org/scripts/463475/downtoutemonannee.meta.js
// ==/UserScript==

function downfuck() {
    const urls = [];
    const nodeList = document.querySelectorAll(".fancybox-thumbs__list > a");
    const link = document.createElement('a');
    nodeList.forEach(item => {
        s = item.style.backgroundImage;
        url1 = s.replace('url("', '')
        url2 = url1.replace('")', '')
        urlFinal = url2.replace('/thumbs/', '/hd/')
        urlVraimentFinal = urlFinal.split('?')[0]
        //console.log(urlVraimentFinal);
        urls.push(urlVraimentFinal);
    });
    var name = prompt("Nom de l'album (sera le préfixe des images téléchargées) :", titre);
    if (name === null) {
        return; //break out of the function early
    }
    // console.log(urls);
    urls.forEach(url => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                //link.download = url.split("/").pop();
                link.download = name + "." + url.split(".")[1];
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    })
}

// Créez une instance de MutationObserver avec une fonction de rappel
const observer = new MutationObserver(function (mutationsList, observer) {
   // var tousLesElements = document.querySelectorAll(".photos-counter");
    document.querySelectorAll(".photos-counter")
    	.forEach(function (element) {
        element.addEventListener("click", function (event) {
          ////
          globalThis.titre = event.target
            .parentNode
            .parentNode
            .querySelector('h2')
            .textContent;
        });
    });
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            // Vérifiez chaque nouveau noeud ajouté
            mutation.addedNodes.forEach(function (node) {
                // Vérifiez si le noeud ajouté a la classe "fancybox-container"
                if (node.classList && node.classList.contains('fancybox-container')) {
                    //console.log('Le noeud avec la classe "fancybox-container" a été ajouté à la racine du body.');
                    const monElement = document.querySelector(".fancybox-toolbar");
                    const monBouton = document.createElement("button");
                    monBouton.id = "coolos";
                    monBouton.title = "Télécharger l'album";
                    monBouton.style.backgroundColor = "transparent";
                    monBouton.style.width = "44px";
                    monBouton.style.height = "45px";
                    monBouton.style.margin = "-4px 40px 20px 0px";
                    monBouton.style.backgroundPosition = "center";
                    monBouton.style.backgroundSize = "cover";
                    monBouton.style.backgroundRepeat = "no-repeat";
                    monBouton.style.border = "none";
                    monBouton.style.outline = "none";
                    monBouton.style.cursor = "pointer";
                    monBouton.style.zIndex = "99999";
                    monElement.prepend(monBouton);
                    monBouton.addEventListener("click", downfuck, false);
                    const monImage = document.createElement("img");
                    monImage.src = src = "data:image/png;base64,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"
                    monImage.style.height = "50px"
                  	monBouton.appendChild(monImage);
                  
                }
            });
        }
    }
});
// Démarrez l'observation en utilisant le noeud cible et les options de configuration
observer.observe(document.body, { attributes: false, childList: true, subtree: true });
