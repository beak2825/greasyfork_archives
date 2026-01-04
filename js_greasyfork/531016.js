// ==UserScript==
// @name         vérifie les abscences de détection
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  vérifie les abscences de détec.
// @author       vince
// @match        
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531016/v%C3%A9rifie%20les%20abscences%20de%20d%C3%A9tection.user.js
// @updateURL https://update.greasyfork.org/scripts/531016/v%C3%A9rifie%20les%20abscences%20de%20d%C3%A9tection.meta.js
// ==/UserScript==

(function() {
    'use strict';
const blacklist = [
    "Louviere - NUC-Louviere",
    "Longeville - NUC-Longeville",
    "Lichnowy - Concentrateur",
  	"Machault - NUC-Machault",
  	"Mont_de_la_Greviere - V01",
  	"Morlange - E02",
  	"Numancia - Sentinel Numancia_A2",
  	"Numancia - Concentrateur",
  	"Molenbaix - E05",
  	"Les_Taillades - AudioBat2",
    "Lichnowy - AudioBat-BW6",
    "Kozlowo - AudioBat-S10",
    "Licheres - Concentrateur",
    "Les_Taillades - AudioBat1",
    "Labo - LaboDev_D02",
	"Labo - Mini-BS",
    "Labo - SW-CU-2K EV1",
	"LaBaumeDemonstrateur - E01",
    "La_Montagne - NUC-Montagne",
    "Labo - SW-CU-4K EV2",
    "La_Bouleste - Concentrateur",
    "Amoures Bouissac - V01",
    "Bogoria - AudioBat-T06",
    "Betheniville - NUC-BETHENIVILLE",
    "Bogoria - AudioBat-T04",
    "Bogoria - AudioBat-T05",
    "Bogoria - AudioBat-T01",
    "Bogoria - AudioBat-T11",
    "Cuxac_d_Aude - Concentrateur",
    "Avesnes et Bosc-Hyons - Concentrateur",
    "Couture_d_Argenson - Concentrateur",
    "Avesnes et Beauvoir - Concentrateur",
    "Canet_d_Aude - E03-BS",
    "Canet - NUC-CANET",
    "Campillo - C2-16",
    "Calissane - M01",
    "Cabalas - V01",
    "Bogoria - AudioBat-T10",
    "Bogoria - Concentrateur",
    "Dummerstorf - WEA01",
    "Dummerstorf - WEA02",
    "El_Campo - E01",
    "El_Campo - E02",
    "Fageole - Concentrateur",
    "GLX - Concentrateur",
    "GLS - Concentrateur",
    "Flavin - AudioBat-E03",
    "Flavin - AudioBat-E05",
    "Flavin - NUC-FLAVIN",
    "Pays-Saint-Seine - B01_B03",
    "Pays-Saint-Seine - B03_B01",
    "Pays-Saint-Seine - NUC-Est",
    "Pays-Saint-Seine - NUC-NORD",
    "Pays-Saint-Seine - NUC-NORD-OUEST",
    "Pays-Saint-Seine - NUC-SUD",
    "Pays-Saint-Seine - NUC-SUD-OUEST",
    "Pays-Saint-Seine - S01_S02",
    "Scaer - E02",
    "Pays-Saint-Seine - S02_S01",
    "Pays-Saint-Seine - S03_S04-S05",
    "Segur - NUC-SEGUR",
    "Pays-Saint-Seine - S05_S06",
    "Pays-Saint-Seine - VISI-EST",
    "Pays-Saint-Seine - VISI-NORD",
    "Pays-Saint-Seine - VISI-NORD-OUEST",
    "Pays-Saint-Seine - VISI-SUD",
    "Pays-Saint-Seine - VISI-SUD-OUEST",
    "Piatkowo - AudioBat-WTG01",
	"Roussas_Gravieres - NUC-Roussas_Gravieres",
	"Truc_de_l_Homme - Concentrateur",
	"Thory - NUC-Thory",
	"Sainte_Colombe - NUC-SainteColombe",
	"Saint Amans - Concentrateur",
	"Teterchen - NUC-Teterchen",
  "Valtoret - Concentrateur",
	"Piatkowo - AudioBat-WTG03",
	"Piatkowo - Concentrateur",
	"Piatkowo - AudioBat-WTG09",
	"Piatkowo - AudioBat-WTG07",
	"Piatkowo - AudioBat-WTG06"

];

    const navbar = document.querySelector(".navbar-nav");

    let listItem = document.createElement("li");
    listItem.className = "nav-item";

    let button = document.createElement("button");
    button.innerText = "Scanner A-Z";
    button.className = "btn btn-danger mx-2"; 
    button.addEventListener("click", scanEoliennes);

    listItem.appendChild(button);
    navbar.appendChild(listItem);
    let completedScan = false;

    function scanEoliennes() {
        button.classList.remove("btn-danger"); 
        button.style.backgroundColor = "yellow"; 
        button.style.color = "black"; 
		
        let spinner = document.createElement("span");
        spinner.className = "spinner-border spinner-border-sm";
        spinner.role = "status";
        spinner.ariaHidden = "true";
        button.innerHTML = ''; 
        button.appendChild(spinner); 

        let eolienneLinks = document.querySelectorAll("a[onclick*='eolienne.php']");
        let today = new Date();
        let totalScans = eolienneLinks.length;
        let completedScans = 0;

        console.log("🔍 Début du scan des éoliennes...");

        eolienneLinks.forEach(a => {
            let onclickValue = a.getAttribute("onclick");
            let match = onclickValue.match(/'(\d+)'/);

            if (match) {
                let id = match[1];
                let turbineText = a.innerText.trim();
                let parcSpan = a.closest(".treeview-animated-items")?.querySelector("span");

                if (parcSpan) {
                    let parcText = parcSpan.innerText.trim();
                    let eolienneKey = `${parcText} - ${turbineText}`;

                    if (blacklist.includes(eolienneKey)) {
                        completedScans++;
                        if (completedScans === totalScans) {
                            completedScan = true;
                            button.style.backgroundColor = "blue"; 
                            button.style.color = "white"; 
                            console.log("✅ Fin du scan des éoliennes.");
                        }
                        return; 
                    }

                    let url = `http://192.168.0.5/supervision/V2/Get/get_video_nonidentifie.php?id=${id}`;
                    
                    fetch(url)
                        .then(response => response.text())
                        .then(html => {
                            let dates = [...html.matchAll(/\d{4}-\d{2}-\d{2}/g)]
               							 .map(match => new Date(match[0].replace(/_/g, ':').trim()));
                            if (dates.length > 0) {
                                let latestDate = dates.sort((a, b) => b - a)[0];
                                let diffDays = Math.floor((today - latestDate) / (1000 * 60 * 60 * 24));

                                if (diffDays >= 3) {
                                    console.log(`🚨 Pas de Détec. depuis ${diffDays} jours pour ${eolienneKey}`);
                                    a.style.color = "red";
                                    a.style.fontWeight = "bold";

                                    addInfoPanel(parcSpan, `⚠️ Pas de Détec. depuis ${diffDays} jours`);
                                }
                            } else {
                                console.log(`❌ Aucune Détec. trouvée pour ${eolienneKey}`);
                                a.style.color = "red";
                                a.style.fontWeight = "bold";

                                addInfoPanel(parcSpan, "❌ Aucune détec. trouvée");
                            }
                        })
                        .catch(error => console.error(`Erreur avec ${eolienneKey} :`, error))
                        .finally(() => {
                            completedScans++;
                            if (completedScans === totalScans) {
                                console.log("✅ Fin du scan des éoliennes.");

                                button.style.backgroundColor = "blue"; 
                                button.style.color = "white";
                                button.innerHTML = "Scan terminé"; 
                            }
                        });
                }
            }
        });
    }

    function addInfoPanel(span, message) {
        let panel = document.createElement("div");
        panel.className = "info-panel";
        panel.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        panel.style.color = "white";
        panel.style.padding = "5px";
        panel.style.marginTop = "5px";
        panel.style.borderRadius = "5px";
        panel.style.fontSize = "12px";
        panel.style.textAlign = "center";
        panel.innerText = message;

        let existingPanel = span.querySelector(".info-panel");
        if (!existingPanel) {
            span.appendChild(panel);
        }
    }
})();