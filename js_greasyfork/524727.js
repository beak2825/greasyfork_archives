// ==UserScript==
// @name         Déplacer la case à coher "Bon Samaritain"
// @author       Pok Marvel
// @namespace    https://r8.fr.bloodwars.net/*
// @version      1.1
// @description  Déplace la case à cocherc "Bon Samaritain" sur la page des expéditions et des RdC de BloodWars, compatible avec Chrome et Firefox.
// @copyright    24.01.2025, Pok Marvel
// @license      GPL version 3 ou suivantes; http://www.gnu.org/copyleft/gpl.html
// @homepageURL  https://github.com/akhlan/Bloodwars/blob/main/BonSamaritain.js
// @supportURL   https://github.com/Akhlan/BloodWarsAideMission/issues
// @match        https://r8.fr.bloodwars.net/?a=cevent*
// @match        https://r8.fr.bloodwars.net/?a=swr*
// @match        https://r3.fr.bloodwars.net/?a=cevent*
// @match        https://r3.fr.bloodwars.net/?a=swr*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524727/D%C3%A9placer%20la%20case%20%C3%A0%20coher%20%22Bon%20Samaritain%22.user.js
// @updateURL https://update.greasyfork.org/scripts/524727/D%C3%A9placer%20la%20case%20%C3%A0%20coher%20%22Bon%20Samaritain%22.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Fonction pour détecter le navigateur
    function getBrowser() {
        if (navigator.userAgent.includes("Firefox")) {
            return "Firefox";
        } else if (navigator.userAgent.includes("Chrome")) {
            return "Chrome";
        } else {
            return "Other";
        }
    }

    // Script pour Chrome
    function chromeSpecificCode() {
        // Fonction pour déplacer le conteneur sous Chrome
        function moveSamaritanOption() {
            const container = document.querySelector('.cevent_newCeventOptionContainer');

            if (container) {
                const targetDiv = document.querySelector('div[style*="margin-top: 15px; text-align: center"]');
                if (targetDiv) {
                    targetDiv.parentNode.insertBefore(container, targetDiv);
                }
            }
        }

        window.addEventListener('load', moveSamaritanOption);
    }

    // Script pour Firefox
    function firefoxSpecificCode() {
        // Fonction pour déplacer le bloc sous Firefox
        function moveSamaritanOption() {
            const samaritanBlock = document.querySelector('#samarytanin')?.closest('div');
            const joinButton = document.querySelector('#joinEvent');

            if (samaritanBlock && joinButton) {
                samaritanBlock.remove();
                joinButton.parentNode.insertBefore(samaritanBlock, joinButton);
            } else {
                // Si l'élément n'est pas encore trouvé, réessayer après un délai
                setTimeout(moveSamaritanOption, 10); // Réessayer dans 500ms
            }
        }

        // Ajouter un délai pour attendre que les éléments soient chargés
        setTimeout(moveSamaritanOption, 100); // Temporisation pour Firefox
    }

    // Détecter le navigateur
    const browser = getBrowser();
    console.log("Navigateur détecté :", browser);

    // Appliquer le bon script selon le navigateur
    if (browser === "Firefox") {
        firefoxSpecificCode();
    } else if (browser === "Chrome") {
        chromeSpecificCode();
    } else {
        console.warn("Navigateur non supporté. Le script pourrait ne pas fonctionner comme prévu.");
    }
})();
