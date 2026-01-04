// ==UserScript==
// @name         JVC Cloudflare Bypass
// @namespace    https://jeuxvideo.com/
// @version      1.11
// @description  Bypass les captchas avec Cloudflare sur JVC
// @author       HulkDu92
// @match        *://*.jeuxvideo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      cloudflare.com
// @connect      cloudflare.manfredi.io
// @run-at       document-end
// @license      MIT
// @icon         https://image.noelshack.com/fichiers/2025/06/5/1738891409-68747470733a2f2f74616d6e762e696d6769782e6e65742f63665f6279706173735f6c6f676f2e706e67.png
// @downloadURL https://update.greasyfork.org/scripts/526143/JVC%20Cloudflare%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/526143/JVC%20Cloudflare%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const WARP_STATUS_KEY = "jvcWarpStatus";
    const CLOUDFLARE_TRACE_URL = "https://cloudflare.com/cdn-cgi/trace";
    const WARP_BUTTON_URL = "https://1.1.1.1/fr-FR/";
    const CLOUDFLARE_HUMAN_URL = "https://cloudflare.manfredi.io/test/";

    // Injecte les styles des deux boutons
    function injectStyles() {
      GM_addStyle(`
          .btn-warp {
              border: 0.0625rem solid var(--jv-text-secondary);
              background: var(--jv-text-secondary);
              color: #fff;
              font-weight: 500;
              padding: 0;
              font-size: 0.8125rem;
              height: 1.75rem;
              min-width: 6.375rem;
              line-height: 1.6875rem;
              cursor: pointer;
          }
          .btn-warp:hover {
              background: var(--jv-text-secondary-hover, var(--jv-text-secondary));
          }

          .btn-robot {
              border: 0.0625rem solid var(--jv-text-secondary);
              background: transparent;
              color: var(--jv-text-secondary);
              font-weight: 500;
              padding: 0;
              font-size: 0.8125rem;
              height: 1.75rem;
              min-width: 5.775rem;
              line-height: 1.6875rem;
              cursor: pointer;
              transition: all 0.2s ease;
              white-space: nowrap;
          }

          .btn-robot svg {
              width: 1.1rem;
              height: 1.1rem;
              stroke: white;
              padding-bottom: 2px;
          }

          .btn-robot:hover {
              border-color: var(--jv-text-secondary-hover, var(--jv-text-secondary));
              color:  var(--jv-text-secondary-hover, var(--jv-text-secondary));
          }
      `);
    }

    /**
     * Vérifie si Warp est activé et stocke le résultat dans sessionStorage.
     * Affiche le bouton si Warp est désactivé.
     */
    function checkWarpStatus() {
        const storedStatus = sessionStorage.getItem(WARP_STATUS_KEY);
        if (storedStatus !== null) {
            if (storedStatus === "false") showButtons();
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: CLOUDFLARE_TRACE_URL,
            onload: response => {
                const warpActive = response.responseText.includes("warp=on");
                sessionStorage.setItem(WARP_STATUS_KEY, warpActive.toString());
                if (!warpActive) showButtons();
            }
        });
    }

    /**
     * Crée et affiche les deux boutons (Warp et Humanité).
     */
    function showButtons() {
        injectStyles();
        const warpButton = createWarpButton();
        const humanityButton = createHumanityButton();

        // Trouve les conteneurs pour chaque bouton, par exemple dans des zones différentes
        const targetElementWarp = document.querySelector('.header__globalUser'); // pour le bouton Warp
        const targetElementHumanity = document.querySelector('.bloc-pre-right'); // pour le bouton Humanity

        // Si l'élément cible pour Warp est trouvé, insère le bouton Warp dedans
        if (targetElementWarp) {
            targetElementWarp.insertBefore(warpButton, targetElementWarp.firstChild);
        } else {
            // Sinon, affiche le bouton en position fixe
            console.warn("Element cible pour Warp non trouvé, affichage en position fixed.");
            Object.assign(warpButton.style, {
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: "9999"
            });
            document.body.appendChild(warpButton);
        }

        // Si l'élément cible pour Humanity est trouvé, insère le bouton Humanity dedans
        if (targetElementHumanity) {
            targetElementHumanity.insertBefore(humanityButton, targetElementHumanity.firstChild);
        } else {
            // Sinon, affiche le bouton en position fixe aussi pour Humanity
            console.warn("Element cible pour Humanity non trouvé, affichage en position fixed.");
            Object.assign(humanityButton.style, {
                position: "fixed",
                bottom: "20px",
                right: "100px", // Tu peux ajuster cette valeur pour le positionner à côté du premier bouton
                zIndex: "9999"
            });
            document.body.appendChild(humanityButton);
        }

    }

    /**
     * Crée le bouton pour activer Warp.
     * @returns {HTMLElement} Le bouton créé.
     */
    function createWarpButton() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-warp";
        button.title = "Bloquer Captcha 🛇";
        button.textContent = "Bloquer Captcha";

        button.onclick = openCloudflareApp;
        return button;
    }

    /**
     * Ouvre un lien vers 1.1.1.1 pour son installation
     */
    function openCloudflareApp() {
        sessionStorage.removeItem(WARP_STATUS_KEY);
        alert(
            "Le blocage complet des Captchas est possible grâce à l'application officielle de Cloudflare: 1.1.1.1\n\n" +
            "Cette application agit comme un pass VIP pour Cloudflare et empêche tous les captchas sur JVC.\n\n" +
            "Il est recommandé de l'activer uniquement pour JVC.\n\n" +
            "C'est une solution radicale (en espérant qu'elle soit temporaire :hap:) pour éviter les captchas abusifs."
        );
        window.open(WARP_BUTTON_URL, "_blank");
    }

    /**
     * Crée le bouton pour vérifier l'humanité.
     * @returns {HTMLElement} Le bouton créé.
     */
    function createHumanityButton() {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-robot";
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <rect width="20" height="14" x="2" y="9" rx="4"/>
                    <circle cx="12" cy="3" r="2"/>
                    <path d="M12 5v4m-3 8v-2m6 0v2"/>
                </g>
            </svg>
             <span>Humain</span>
        `;

        button.onclick = fetchPercentage;
        return button;
    }

    /**
     * Récupère et affiche le pourcentage d'humanité.
     */
    function fetchPercentage() {
        GM_xmlhttpRequest({
            method: "GET",
            url: CLOUDFLARE_HUMAN_URL,
            onload: function(response) {
                const percentage = extractPercentage(response.responseText);
                if (percentage !== null) {
                    showPopup(percentage);
                } else {
                    alert("Erreur : Pourcentage non trouvé.");
                }
            },
            onerror: function() {
                alert("Erreur de récupération des données.");
            }
        });
    }

    function extractPercentage(htmlString) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(htmlString, "text/html");

        let percentElement = Array.from(doc.querySelectorAll('*'))
            .find(el => el.textContent.includes('%') && el.textContent.includes('human'));

        if (!percentElement) return null;

        let match = percentElement.textContent.match(/(\d+)%/);
        return match ? parseInt(match[1], 10) : null;
    }

    function showPopup(percentage) {
        let popup = document.createElement('div');
        popup.id = 'human-check-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <span class="popup-close">&times;</span>
                <p>Vous êtes ${percentage}% humain.</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${percentage}%;"></div>
                </div>
            </div>
        `;
        document.body.appendChild(popup);

        popup.querySelector('.popup-close').addEventListener('click', function() {
            popup.remove();
        });

       GM_addStyle(`
          #human-check-popup {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #181A1B;
              padding: 20px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
              border-radius: 10px;
              z-index: 10000;
              width: 300px;
              text-align: center;
              color: #F0EEEC;
          }

          .popup-content {
              position: relative;
          }

          .popup-close {
              position: absolute;
              top: 5px;
              right: 10px;
              font-size: 20px;
              cursor: pointer;
          }

          .progress-bar-container {
              width: 100%;
              height: 20px;
              background: #43413D;
              border-radius: 10px;
              margin-top: 10px;
              overflow: hidden;
          }

          .progress-bar {
              height: 100%;
              background: #006600;
              transition: width 0.5s;
          }
      `);

    }

    checkWarpStatus();
})();
