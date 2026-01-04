// ==UserScript==
// @name         Signalement des doublons
// @namespace    doublon.js
// @version      1.0.0
// @description  Vérifier s'il n'y a pas de doublons dans la liste
// @match        https://procuration-front-populaire.fr/console/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      drive.ecomail.earth
// @downloadURL https://update.greasyfork.org/scripts/498940/Signalement%20des%20doublons.user.js
// @updateURL https://update.greasyfork.org/scripts/498940/Signalement%20des%20doublons.meta.js
// ==/UserScript==
(function () {
  "use strict";

  const csvUrl =
    "https://drive.ecomail.earth/index.php/s/Y7wprwRB7xa5Zcj/download/doublon.csv";

  const statusTranslations = {
    matched: "Historique",
    pending: "À valider",
    accepted: "Acceptées",
  };

  function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", buffer).then((hash) => {
      return Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    });
  }

  function parseCSV(text) {
    const rows = text.split("\n");
    const commonIdMapStatus = new Map();
    for (let row of rows) {
      const columns = row.split(",");
      if (columns.length > 1) {
        const commonID = columns[0].trim();
        const status = columns[1].trim();

        // Mapping common id to a list of statuses
        if (!commonIdMapStatus.has(commonID)) {
          commonIdMapStatus.set(commonID, []);
        }
        if (status !== "") commonIdMapStatus.get(commonID).push(status);
      }
    }
    return commonIdMapStatus;
  }

  function checkDivs(commonIdMapStatus) {
    const divs = document.querySelectorAll(
      'div[id^="proposal-"], div[id^="match-"], div[id^="request-"]'
    );
    divs.forEach((div) => {
      const emailLink = div.querySelector('a[href^="mailto:"]');
      if (emailLink) {
        const email = emailLink.innerText.trim();
        sha256(email).then((commonId) => {
          if (commonIdMapStatus.has(commonId)) {
            const statuses = commonIdMapStatus.get(commonId);

            // Création de la div alerte personnalisée
            const alertDiv = document.createElement("div");
            alertDiv.className = "custom-alert"; // Classe pour le style personnalisé
            alertDiv.innerHTML = `<strong>Doublons détectés dans :</strong> ${statuses
              .map((status) => statusTranslations[status])
              .join(", ")}`;

            // Stylisation de la div alerte personnalisée avec CSS
            alertDiv.style.padding = "15px";
            alertDiv.style.backgroundColor = "#f44336";
            alertDiv.style.color = "white";
            alertDiv.style.fontWeight = "bold";
            alertDiv.style.borderRadius = "10px";
            alertDiv.style.marginBottom = "10px";

            // Ajout de la div alerte à la div parent
            div.insertBefore(alertDiv, div.firstChild);

            // Création du bouton "Voir les doublons"
            const button = document.createElement("button");
            button.textContent = "Voir les doublons";
            button.className = "btn btn-primary";
            button.style.marginTop = "10px";
            button.style.marginLeft = "10px";
            button.addEventListener("click", function () {
              if (statuses.includes("matched")) {
                GM_openInTab(
                  `https://procuration-front-populaire.fr/console/history?q=${encodeURIComponent(
                    email
                  )}`,
                  { active: true, insert: true }
                );
              }
              if (statuses.includes("pending")) {
                GM_openInTab(
                  `https://procuration-front-populaire.fr/console/requests?status=pending&q=${encodeURIComponent(
                    email
                  )}`,
                  { active: true, insert: true }
                );
              }
              if (statuses.includes("pending")) {
                GM_openInTab(
                  `https://procuration-front-populaire.fr/console/proposals?status=pending&q=${encodeURIComponent(
                    email
                  )}`,
                  { active: true, insert: true }
                );
              }
              if (statuses.includes("accepted")) {
                GM_openInTab(
                  `https://procuration-front-populaire.fr/console/requests?status=accepted&q=${encodeURIComponent(
                    email
                  )}`,
                  { active: true, insert: true }
                );
              }
              if (statuses.includes("accepted")) {
                GM_openInTab(
                  `https://procuration-front-populaire.fr/console/proposals?status=accepted&q=${encodeURIComponent(
                    email
                  )}`,
                  { active: true, insert: true }
                );
              }
            });

            // Ajout du bouton à la fin de la div
            alertDiv.appendChild(button);
          }
        });
      }
    });
  }

  function fetchCSV() {
    GM_xmlhttpRequest({
      method: "GET",
      url: csvUrl,
      onload: function (response) {
        if (response.status === 200) {
          const commonIdMapStatus = parseCSV(response.responseText);
          checkDivs(commonIdMapStatus);
        } else {
          console.error("Failed to fetch CSV file");
        }
      },
    });
  }
  
  (function (history) {
    const pushState = history.pushState;
    const replaceState = history.replaceState;

    history.pushState = function (state) {
      const result = pushState.apply(history, arguments);
      window.dispatchEvent(new Event("urlchange"));
      return result;
    };

    history.replaceState = function (state) {
      const result = replaceState.apply(history, arguments);
      window.dispatchEvent(new Event("urlchange"));
      return result;
    };

    window.addEventListener("popstate", function () {
      window.dispatchEvent(new Event("urlchange"));
    });

    window.addEventListener("urlchange", function () {
      fetchCSV();
    });

    // Optionnel : vérifier immédiatement l'URL au chargement de la page
    fetchCSV();
  })(window.history);
  
})();
