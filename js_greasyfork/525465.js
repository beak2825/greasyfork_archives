// ==UserScript==
// @name         Alerte Prix - Suivi de produit
// @namespace    https://www.example.com/
// @version      1.0
// @description  Suivi des prix de produits sur des sites de commerce avec alerte lorsque le prix descend sous un seuil
// @author       Lakfu Sama
// @match        https://www.amazon.*/*
// @match        https://www.cdiscount.com/*
// @match        https://www.fnac.com/*
// @match        https://www.darty.com/*
// @match        https://www.boulanger.com/*
// @match        https://www.rakuten.fr/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525465/Alerte%20Prix%20-%20Suivi%20de%20produit.user.js
// @updateURL https://update.greasyfork.org/scripts/525465/Alerte%20Prix%20-%20Suivi%20de%20produit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Vérifier si l'utilisateur a défini un seuil de prix
    let threshold = GM_getValue("price_threshold");
    if (!threshold) {
        threshold = prompt("Entrez le prix souhaité pour l'alerte (ex: 100.00)", "100.00");
        GM_setValue("price_threshold", threshold);  // Sauvegarder le seuil pour la prochaine fois
    }

    // Fonction pour extraire le prix du produit sur différents sites
    function getPrice() {
        let price = null;

        // Amazon
        if (window.location.hostname.includes("amazon")) {
            price = document.querySelector('#priceblock_ourprice') ? document.querySelector('#priceblock_ourprice').innerText :
                    document.querySelector('#priceblock_dealprice') ? document.querySelector('#priceblock_dealprice').innerText :
                    document.querySelector('.a-price .a-offscreen') ? document.querySelector('.a-price .a-offscreen').innerText : null;
        }

        // Cdiscount
        else if (window.location.hostname.includes("cdiscount")) {
            price = document.querySelector('.price') ? document.querySelector('.price').innerText : null;
        }

        // La Fnac
        else if (window.location.hostname.includes("fnac")) {
            price = document.querySelector('.f-price') ? document.querySelector('.f-price').innerText : null;
        }

        // Darty
        else if (window.location.hostname.includes("darty")) {
            price = document.querySelector('.price') ? document.querySelector('.price').innerText : null;
        }

        // Boulanger
        else if (window.location.hostname.includes("boulanger")) {
            price = document.querySelector('.product-card-price') ? document.querySelector('.product-card-price').innerText : null;
        }

        // Rakuten
        else if (window.location.hostname.includes("rakuten")) {
            price = document.querySelector('.price') ? document.querySelector('.price').innerText : null;
        }

        // Si le prix est trouvé, nettoyer et renvoyer
        if (price) {
            // Nettoyer le texte du prix et le convertir en nombre
            price = parseFloat(price.replace(/[^\d.-]/g, ''));
            return price;
        }
        return null;
    }

    // Fonction de vérification du prix
    function checkPrice() {
        let price = getPrice();
        
        if (price === null) {
            console.log("Prix non trouvé.");
            return;
        }
        
        console.log(`Prix actuel: ${price} €`);
        
        // Comparer le prix avec le seuil
        if (price <= parseFloat(threshold)) {
            alertPrice(price);
        }
    }

    // Fonction d'alerte
    function alertPrice(price) {
        if (Notification.permission === "granted") {
            new Notification("Alerte Prix", {
                body: `Le prix du produit a baissé à ${price}€ !`,
                icon: "https://www.amazon.com/favicon.ico"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification("Alerte Prix", {
                        body: `Le prix du produit a baissé à ${price}€ !`,
                        icon: "https://www.amazon.com/favicon.ico"
                    });
                }
            });
        }

        // Afficher une notification dans la barre d'outils de GreasyFork
        GM_notification({
            text: `Le prix du produit a baissé à ${price}€ !`,
            title: "Alerte Prix",
            timeout: 5000
        });
    }

    // Vérifier le prix toutes les heures
    setInterval(checkPrice, 3600000);  // 1 heure (en millisecondes)

    // Affichage de l'interface de suivi
    const toolbar = document.createElement("div");
    toolbar.style.position = "fixed";
    toolbar.style.top = "20px";
    toolbar.style.right = "20px";
    toolbar.style.padding = "10px";
    toolbar.style.backgroundColor = "#ff9800";
    toolbar.style.color = "white";
    toolbar.style.borderRadius = "5px";
    toolbar.style.zIndex = "1000";
    toolbar.style.cursor = "pointer";

    toolbar.innerHTML = `Seuil actuel: ${threshold}€<br><strong>Suivi en cours</strong>`;

    toolbar.addEventListener("click", function() {
        const newThreshold = prompt("Entrez un nouveau seuil de prix (ex: 80.00)", threshold);
        if (newThreshold && !isNaN(newThreshold)) {
            GM_setValue("price_threshold", newThreshold);
            toolbar.innerHTML = `Seuil actuel: ${newThreshold}€<br><strong>Suivi en cours</strong>`;
        }
    });

    // Ajouter la barre d'outils à la page
    document.body.appendChild(toolbar);

    // Initialiser la première vérification dès que la page est chargée
    checkPrice();
})();
