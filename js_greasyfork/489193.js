// ==UserScript==
// @name         Crunchyroll VF images pour les titres depuis Crunchyroll
// @namespace    https://greasyfork.org/scripts/489193
// @version      2.2
// @description  Ajoute automatiquement une image d'affiche ou un texte alternatif à partir du lien de l'anime sur Crunchyroll.
// @author       MASTERD
// @match        https://www.crunchyroll.com/fr/news/guides/2022/3/4/crunchyroll-vf-anime
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489193/Crunchyroll%20VF%20images%20pour%20les%20titres%20depuis%20Crunchyroll.user.js
// @updateURL https://update.greasyfork.org/scripts/489193/Crunchyroll%20VF%20images%20pour%20les%20titres%20depuis%20Crunchyroll.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const startTime = Date.now(); // Enregistrer l'heure de début

    const fetchAnimeImage = async (animeUrl) => {
        return new Promise((resolve, reject) => {
            // Ignorer l'URL spécifique
            if (animeUrl.includes("seasonal-lineup")) {
                console.log("seasonal-lineup, passage à l'URL suivante.");
                resolve({ url: null, is404: false });
                return;
            }

            // Créer un iframe
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none'; // Rendre l'iframe invisible
            document.body.appendChild(iframe);

            // Écouter l'événement de chargement de l'iframe
            iframe.onload = () => {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                // Observer les changements dans le document de l'iframe
                const observer = new MutationObserver(() => {
                    // Vérifier la présence d'une erreur 404
                    if (iframeDoc.body && iframeDoc.body.innerText.includes("404")) {
                        console.log("Erreur 404 détectée, passage à l'URL suivante.");
                        const yuzuImage = iframeDoc.querySelector('.exception-artwork');
                        if (yuzuImage) {
                            resolve({ url: yuzuImage.src, is404: true });
                        } else {
                            resolve({ url: "404", is404: true });
                        }
                        observer.disconnect(); // Déconnecter l'observateur
                        document.body.removeChild(iframe);
                        return;
                    }
                    const images = Array.from(iframeDoc.querySelectorAll('img[alt="Series background blurred"][data-t="original-image"]'));
                    if (images.length > 0) {
                        console.log("Images trouvées : ", images);
                        resolve({ url: images[0].src, is404: false }); // Renvoie la première image trouvée
                        observer.disconnect(); // Déconnecter l'observateur
                        document.body.removeChild(iframe);
                    }
                });

                // Commencer à observer les changements
                observer.observe(iframeDoc, { childList: true, subtree: true });
            };

            // Gérer les erreurs de chargement de l'iframe
            iframe.onerror = () => {
                reject(new Error('Erreur de chargement de l\'iframe'));
                document.body.removeChild(iframe);
            };

            // Charger l'URL dans l'iframe
            iframe.src = animeUrl;
        });
    };

    // Fonction pour convertir une image en données base64
    const getBase64Image = async function(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "blob",
                onload: function(response) {
                    const reader = new FileReader();
                    reader.onloadend = function() {
                        resolve(reader.result);
                    };
                    reader.onerror = function(error) {
                        reject(new Error(error));
                    };
                    reader.readAsDataURL(response.response);
                },
                onerror: function(error) {
                    reject(new Error(error));
                }
            });
        });
    };

    // Fonction pour afficher l'affiche de l'anime ou un texte alternatif si l'image n'est pas disponible
    const displayMoviePoster = async function(posterUrl, titleElement) {
        // Vérifier que titleElement existe avant d’insérer l'image
        if (!titleElement) {
            console.warn("Élément de titre introuvable pour l'affichage de l'affiche.");
            return;
        }

        const posterParagraph = document.createElement('p');

        if (posterUrl && posterUrl != "404") {
            const base64Image = await getBase64Image(posterUrl);

            // Créer l'image et lui attribuer les données base64
            const posterImg = document.createElement('img');
            posterImg.src = base64Image;
            posterImg.style.maxHeight = '200px';

            // Ajouter l'image au paragraphe
            posterParagraph.appendChild(posterImg);
        }

        if (posterUrl === "404") {
            const placeholderText = document.createElement('i');
            placeholderText.textContent = '[404]';
            posterParagraph.appendChild(placeholderText);
        }

        // Insérer le paragraphe après le titre
        titleElement.parentNode.insertBefore(posterParagraph, titleElement.nextSibling);
    };

    const getStoredPosterUrl = (title) => {
        const storedData = JSON.parse(localStorage.getItem("animePosterUrls") || "{}");
        return storedData[title] || null;
    };

    const storePosterUrl = (title, url) => {
        const storedData = JSON.parse(localStorage.getItem("animePosterUrls") || "{}");
        storedData[title] = url;
        localStorage.setItem("animePosterUrls", JSON.stringify(storedData));
        console.log("animePosterUrls :", url);
    };

    // Attente jusqu'à ce que des éléments de titre soient disponibles
    let titleElements = [];
    while (titleElements.length === 0) {
        titleElements = $('b > i');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Attente de 1 seconde avant de vérifier à nouveau
    }

    // Récupérer tous les liens d'anime dans la page et afficher les images ou le texte alternatif
    const animeLinks = document.querySelectorAll('li > p > a');
    for (const link of animeLinks) {
        const titleElement = link.querySelector('b > i') || link.querySelector('b');
        const animeUrl = link.href;
        console.log("Url du titre pour l'image :", animeUrl);
        const titleText = titleElement ? titleElement.textContent : "";

        let posterUrl = getStoredPosterUrl(titleText);
        if (posterUrl) {
            console.log("Affiche trouvée dans localStorage :", posterUrl);
        } else {
            posterUrl = await fetchAnimeImage(animeUrl);
            if (posterUrl.url && !posterUrl.is404) {
                storePosterUrl(titleText, posterUrl.url);
            }
            posterUrl = posterUrl.url;
        }
        await displayMoviePoster(posterUrl, titleElement);
    }

    // Calculer le temps écoulé et afficher une alerte
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2); // Durée en secondes avec deux décimales
    alert(`Tous les titres d'anime ont été traités en ${duration} secondes.`);

})();
