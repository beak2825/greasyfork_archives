// ==UserScript==
// @name        Show map for treasure hunt
// @namespace   Violentmonkey Scripts
// @match       https://www.dofuspourlesnoobs.com/resolution-de-chasse-aux-tresors.html*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 12/14/2024, 6:30:56 PM
// @downloadURL https://update.greasyfork.org/scripts/520720/Show%20map%20for%20treasure%20hunt.user.js
// @updateURL https://update.greasyfork.org/scripts/520720/Show%20map%20for%20treasure%20hunt.meta.js
// ==/UserScript==

(function () {
    async function fetchMapImage(posX, posY, worldMap = 1) {
        // URL de l'API
        const url = `https://api.dofusdb.fr/map-positions?$and[0][posX]=${posX}&$and[1][posY]=${posY}&$and[3][worldMap]=${worldMap}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.total > 0 && data.data.length > 0) {
                const mapImages = data.data[0].img;
                console.log(`Images pour (${posX}, ${posY}):`, mapImages);
                return mapImages; // Retourne les différentes versions des images (1, 0.25, 0.5, 0.75)
            } else {
                console.warn(`Aucune donnée trouvée pour la position (${posX}, ${posY})`);
                return null;
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données : ", error);
            return null;
        }
    }

    async function renderMapDynamic(centerX, centerY, radius = 1, worldMap = 1) {
        const mapContainer = document.getElementById("map-container");
        mapContainer.innerHTML = ""; // Réinitialiser le conteneur

        for (let dy = -radius; dy <= radius; dy++) {
            const rowDiv = document.createElement("div"); // Crée une ligne pour chaque Y
            rowDiv.style.display = "flex"; // Afficher les images en ligne
            rowDiv.style.justifyContent = "center";

            for (let dx = -radius; dx <= radius; dx++) {
                const posX = centerX + dx;
                const posY = centerY + dy;

                const mapImages = await fetchMapImage(posX, posY, worldMap);

                const cellDiv = document.createElement("div");
                cellDiv.style.width = "100px";

                if (mapImages) {
                    const imgElement = document.createElement("img");
                    imgElement.src = mapImages["0.25"]; // Utiliser la version 1:1 pour la meilleure qualité
                    imgElement.alt = `Carte (${posX}, ${posY})`;
                    imgElement.style.width = "100%";
                    imgElement.style.height = "auto";
                    cellDiv.appendChild(imgElement);

                    if (posX === centerX && posY === centerY) {
                        imgElement.style.border = "3px solid black"; // Contour sombre
                        imgElement.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.8)"; // Ombre autour
                    }
                } else {
                    const placeholder = document.createElement("div");
                    placeholder.textContent = "No Image";
                    placeholder.style.color = "#888";
                    placeholder.style.fontSize = "12px";
                    placeholder.style.textAlign = "center";
                    cellDiv.appendChild(placeholder);
                }

                rowDiv.appendChild(cellDiv);
            }

            mapContainer.appendChild(rowDiv);
        }
    }

    const posXElement = document.querySelector('#huntposx');
    const posYElement = document.querySelector('#huntposy');

    const radius = 2;
    const worldMap = 1;

    function updateMap() {
        const centerX = parseInt(posXElement.value, 10) || 0; // Récupérer et convertir en nombre (par défaut 0 si vide)
        const centerY = parseInt(posYElement.value, 10) || 0;

        renderMapDynamic(centerX, centerY, radius, worldMap);
    }

    const mapContainer = document.createElement("div");
    mapContainer.id = "map-container";
    mapContainer.style.display = "flex";
    mapContainer.style.flexDirection = "column";
    mapContainer.style.alignItems = "center";

    const huntTreasureSearchButtonParent = document.querySelector('#hunt-elt3').parentNode;
    huntTreasureSearchButtonParent.appendChild(mapContainer);

    updateMap();

    posXElement.addEventListener('input', updateMap);
    posYElement.addEventListener('input', updateMap);
})();
