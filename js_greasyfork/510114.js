// ==UserScript==
// @name         External Links from iNaturalist taxon pages
// @namespace    http://tampermonkey.net/
// @version      2.7.1
// @description  Adds a dropdown with links to external species pages (INPN, Artemisiae, ODIN, Biodiv'PDL, Biodiv'Orne, Biodiv'Normandie-Maine) on iNaturalist taxon pages, with a settings button to control visible links, now with favicons.
// @author       Sylvain Montagner (with ChatGPT help)
// @match        https://www.inaturalist.org/taxa/*
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/510114/External%20Links%20from%20iNaturalist%20taxon%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/510114/External%20Links%20from%20iNaturalist%20taxon%20pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addExternalLinksDropdown() {
        console.log("iNaturalist page loaded.");

        // Remove any existing elements before adding new ones
        const existingDropdown = document.querySelector('.external-links-dropdown');
        const existingSettings = document.querySelector('.settings-button');
        if (existingDropdown) existingDropdown.remove();
        if (existingSettings) existingSettings.remove();

        // Retrieve the scientific name from the iNaturalist page
        let scientificNameElement = document.querySelector('.sciname.species');
        if (scientificNameElement) {
            let scientificName = scientificNameElement.textContent.trim();
            console.log("Scientific name retrieved: " + scientificName);
            let lowscientificName = scientificName.toLowerCase().replace(/ /g, '-');
            let [genusName, speciesName] = scientificName.split(' ');

            // Call the INPN API to find taxa using fuzzyMatch
            let inpnApiUrl = `https://taxref.mnhn.fr/api/taxa/fuzzyMatch?term=${encodeURIComponent(scientificName)}`;
            console.log("Requesting from INPN API: " + inpnApiUrl);

            fetch(inpnApiUrl)
                .then(response => response.json())
                .then(jsonData => {
                let taxonId = 0; // default value if taxon not found
                if (jsonData._embedded && jsonData._embedded.taxa && jsonData._embedded.taxa.length > 0) {
                    let matchingTaxon = jsonData._embedded.taxa[0];
                    taxonId = matchingTaxon.id;
                    console.log("INPN Taxon ID found: " + taxonId);
                } else {
                    console.log("No matching taxon found, setting Taxon ID to 0.");
                }

                // Call the GBIF API to find taxa
                let gbifApiUrl = `https://api.gbif.org/v1/species/match?name=${encodeURIComponent(scientificName)}`;
                console.log("Requesting from GBIF API: " + gbifApiUrl);

                fetch(gbifApiUrl)
                    .then(response => response.json())
                    .then(gbifData => {
                    let speciesKey = 0; // default value if taxon not found
                    if (gbifData.speciesKey) {
                        speciesKey = gbifData.speciesKey;
                        console.log("GBIF speciesKey found: " + speciesKey);
                    } else {
                        console.log("No matching taxon found in GBIF, setting speciesKey to 0.");
                    }

                        // Create a dropdown button for external links
                        let dropdownButton = document.createElement('button');
                        let userLang = navigator.language || navigator.userLanguage;
                        let buttonText = userLang.startsWith('fr') ? 'Liens externes' : 'External Links';
                        dropdownButton.textContent = buttonText;
                        dropdownButton.className = 'btn btn-primary btn-inat btn-xs external-links-dropdown';
                        dropdownButton.style.marginLeft = "10px";

                        // Create a container for the dropdown links
                        let dropdownContent = document.createElement('div');
                        dropdownContent.style.display = "none"; // Initially hidden
                        dropdownContent.style.position = "absolute";
                        dropdownContent.style.backgroundColor = "#f9f9f9";
                        dropdownContent.style.minWidth = "300px"; // Increased width for two columns
                        dropdownContent.style.maxHeight = "400px"; // Limit the height to avoid overflow
                        dropdownContent.style.overflowY = "auto"; // Enable vertical scrolling
                        dropdownContent.style.boxShadow = "0px 8px 16px 0px rgba(0,0,0,0.2)";
                        dropdownContent.style.zIndex = "1";
                        dropdownContent.style.borderRadius = "4px";
                        dropdownContent.style.textAlign = "left";
                        dropdownContent.style.columnCount = "3"; // Two columns layout
                        dropdownContent.style.columnGap = "10px"; // Gap between columns

                        // Toggle dropdown visibility
                        dropdownButton.onclick = function() {
                            dropdownContent.style.display = dropdownContent.style.display === "none" ? "block" : "none";
                        };

                        // Close dropdown if clicked outside
                        window.onclick = function(event) {
                            if (!event.target.matches('.external-links-dropdown')) {
                                dropdownContent.style.display = "none";
                            }
                        };

                        // Retrieve link preferences from localStorage
                        let linkPreferences = JSON.parse(localStorage.getItem('externalLinkPreferences')) || {};

                        // Define external links
                        const links = [
                            { href: `https://www.gbif.org/species/${speciesKey}`, textContent: "GBIF", domain: "gbif.org" },
                            { href: `https://inpn.mnhn.fr/espece/cd_nom/${taxonId}`, textContent: "INPN", domain: "inpn.mnhn.fr" },
                            { href: `https://openobs.mnhn.fr/redirect/inpn/taxa/${taxonId}?view=map`, textContent: "INPN - OpenObs", domain: "openobs.mnhn.fr" },
                            { href: `https://siflore.fcbn.fr/?cd_ref=${taxonId}&r=metro`, textContent: "FCBN - SI Flore", domain: "siflore.fcbn.fr" },
                            { href: `https://atlas.lashf.org/espece/${taxonId}`, textContent: "SHF Reptiles & Amphibiens", domain: "atlas.lashf.org" },
                            { href: `https://oreina.org/artemisiae/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "Artemisiae", domain: "oreina.org" },
                            { href: `http://www.lepiforum.de/lepiwiki.pl?${scientificName}`, textContent: "LepiForum", domain: "lepiforum.de" },
                            { href: `https://odin.anbdd.fr/espece/${taxonId}`, textContent: "ODIN", domain: "anbdd.fr" },
                            { href: `https://biodiv-paysdelaloire.fr/espece/${taxonId}`, textContent: "Biodiv'PDL", domain: "cenpaysdelaloire.fr" },
                            { href: `http://data.biodiversite-bretagne.fr/espece/${taxonId}`, textContent: "Biodiv'Bretagne", domain: "data.biodiversite-bretagne.fr" },
                            { href: `https://atlas.biodiversite-auvergne-rhone-alpes.fr/espece/${taxonId}`, textContent: "Biodiv'AURA", domain: "atlas.biodiversite-auvergne-rhone-alpes.fr" },
                            { href: `https://clicnat.fr/espece/${taxonId}`, textContent: "ClicNat Picardie Nature", domain: "clicnat.fr" },
                            { href: `https://nature.silene.eu/espece/${taxonId}`, textContent: "Silene Nature (PACA)", domain: "nature.silene.eu" },
                            { href: `https://geonature.arb-idf.fr/atlas/espece/${taxonId}`, textContent: "Biodiv'îDF", domain: "geonature.arb-idf.fr" },
                            { href: `https://natureocentre.org/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "Nature'O'Centre", domain: "natureocentre.org" },
                            { href: `https://obsindre.fr/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "Obs'Indre", domain: "obsindre.fr" },
                            { href: `https://obs28.org/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "Obs'28", domain: "obs28.org" },
                            { href: `https://biodivorne.affo-nature.org/espece/${taxonId}`, textContent: "Biodiv'Orne", domain: "affo-nature.org" },
                            { href: `https://biodiversite.parc-naturel-normandie-maine.fr/espece/${taxonId}`, textContent: "Biodiv'Normandie-Maine", domain: "biodiversite.parc-naturel-normandie-maine.fr" },
                            { href: `https://biodiversite.ecrins-parcnational.fr/espece/${taxonId}`, textContent: "Biodiv'Ecrins", domain: "biodiversite.ecrins-parcnational.fr" },
                            { href: `https://www.insecte.org/forum/search.php?keywords=${scientificName}&terms=all&author=&sc=1&sf=titleonly&sr=topics&sk=t&sd=d&st=0&ch=300&t=0&submit=Rechercher`, textContent: "LMDI Forum", domain: "insecte.org" },
                            { href: `https://www.galerie-insecte.org/galerie/wikige.php?tax=${scientificName}`, textContent: "LMDI Galerie", domain: "galerie-insecte.org" },
                            { href: `https://base-aer.fr/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "AER Nantes", domain: "base-aer.fr" },
                            { href: `https://lorraine-entomologie.org/webobs/index.php?module=taxon&action=taxon&id=${taxonId}`, textContent: "SLE Entomo Grand-Est", domain: "lorraine-entomologie.org" },
                            { href: `https://atlas-odonates.insectes.org/odonates-de-france/${lowscientificName}`, textContent: "Odonates de France", domain: "atlas-odonates.insectes.org" },
                            { href: `https://bladmineerders.nl/?s=${scientificName}`, textContent: "Plant Parasites of Europe", domain: "bladmineerders.nl" },
                            { href: `https://observation.org/species/search/?q=${scientificName}`, textContent: "Observation.org", domain: "observation.org" },
                            { href: `https://fr.wikipedia.org/wiki/${scientificName}`, textContent: "Wikipedia FR", domain: "fr.wikipedia.org" },
                            { href: `https://www.wikidata.org/w/index.php?search=${scientificName}`, textContent: "Wikidata", domain: "wikidata.org" },
                            { href: `https://jessica-joachim.com/?s=${scientificName}`, textContent: "Carnets nature Jessica", domain: "jessica-joachim.com" },
                            { href: `https://www.featherbase.info/fr/search/${scientificName}?searchterm=${scientificName}`, textContent: "Featherbase", domain: "www.featherbase.info" },
                            { href: `https://www.mycodb.fr/fiche.php?genre=${genusName}&espece=${speciesName}`, textContent: "MycoDB", domain: "mycodb.fr" },
                            { href: `https://araneae.nmbe.ch/search?freeSearchType=genspec&freeSearchMatch=begins&freeSearch=Araneus%20diadematus`, textContent: "Aranea Europe", domain: "araneae.nmbe.ch" },
                            { href: `https://www.qwant.com/?l=fr&q=${scientificName}`, textContent: "Qwant Fr", domain: "qwant.com" },
                            { href: `https://www.google.fr/search?q=${scientificName}`, textContent: "Google Fr", domain: "google.fr" },
                            { href: `https://doris.ffessm.fr/find/species/(name)/${scientificName}`, textContent: "DORIS", domain: "doris.ffessm.fr" }
                        ];

                        // Loop to create link elements with favicons
                        links.forEach(linkInfo => {
                            let linkElement = document.createElement('a');
                            linkElement.href = linkInfo.href;
                            linkElement.target = "_blank";

                            linkElement.style.display = linkPreferences[linkInfo.textContent] !== false ? "block" : "none";
                            linkElement.style.padding = "8px";
                            linkElement.style.textDecoration = "none";
                            linkElement.style.color = "black";
                            linkElement.style.backgroundColor = "#f9f9f9";
                            linkElement.style.display = "flex";
                            linkElement.style.alignItems = "center";

                            linkElement.onmouseover = function() {
                                linkElement.style.backgroundColor = "#ddd";
                            };
                            linkElement.onmouseout = function() {
                                linkElement.style.backgroundColor = "#f9f9f9";
                            };

                            // Add favicon
                            let favicon = document.createElement('img');
                            favicon.src = `https://www.google.com/s2/favicons?domain=${linkInfo.domain}`;
                            favicon.style.width = '16px';
                            favicon.style.height = '16px';
                            favicon.style.marginRight = '8px';
                            linkElement.appendChild(favicon);

                            // Add link text
                            let linkText = document.createElement('span');
                            linkText.textContent = linkInfo.textContent;
                            linkElement.appendChild(linkText);

                            dropdownContent.appendChild(linkElement);
                        });

                        dropdownButton.appendChild(dropdownContent);
                        scientificNameElement.parentNode.insertBefore(dropdownButton, scientificNameElement.nextSibling);

                        // Create a settings button for checkboxes
                        let settingsButton = document.createElement('button');
                        settingsButton.innerHTML = '⚙'; // Settings icon
                        settingsButton.className = 'btn btn-xs settings-button';
                        settingsButton.style.marginLeft = '5px';
                        settingsButton.style.backgroundColor = '#e0e0e0';
                        settingsButton.style.color = '#555';
                        settingsButton.style.border = 'none';
                        settingsButton.style.cursor = 'pointer';

                        // Create settings dropdown for checkboxes
                        let settingsContent = document.createElement('div');
                        settingsContent.style.display = 'none'; // Initially hidden
                        settingsContent.style.position = 'absolute';
                        settingsContent.style.backgroundColor = '#f9f9f9';
                        settingsContent.style.minWidth = '160px';
                        settingsContent.style.boxShadow = '0px 8px 16px 0px rgba(0,0,0,0.2)';
                        settingsContent.style.zIndex = '1';
                        settingsContent.style.borderRadius = '4px';

                        // Toggle settings dropdown visibility
                        settingsButton.onclick = function() {
                            settingsContent.style.display = settingsContent.style.display === "none" ? "block" : "none";
                        };

                        // Close settings dropdown if clicked outside
                        window.onclick = function(event) {
                            if (!event.target.matches('.settings-button') && !event.target.matches('.external-links-dropdown')) {
                                settingsContent.style.display = 'none';
                                dropdownContent.style.display = 'none';
                            }
                        };

                        // Create checkboxes for settings
                        links.forEach(linkInfo => {
                            let settingsWrapper = document.createElement('div');
                            settingsWrapper.style.display = "flex";
                            settingsWrapper.style.alignItems = "center";

                            let checkbox = document.createElement('input');
                            checkbox.type = 'checkbox';
                            checkbox.style.marginRight = '5px';
                            checkbox.checked = linkPreferences[linkInfo.textContent] !== false;

                            checkbox.addEventListener('change', function() {
                                linkPreferences[linkInfo.textContent] = checkbox.checked;
                                localStorage.setItem('externalLinkPreferences', JSON.stringify(linkPreferences));

                                let linkElements = dropdownContent.querySelectorAll('a span');
                                linkElements.forEach(function(linkTextElement) {
                                    if (linkTextElement.textContent === linkInfo.textContent) {
                                        let linkElement = linkTextElement.parentNode;
                                        linkElement.style.display = checkbox.checked ? "block" : "none";
                                    }
                                });
                            });

                            let label = document.createElement('label');
                            label.textContent = linkInfo.textContent;
                            label.style.fontWeight = "normal";

                            settingsWrapper.appendChild(checkbox);
                            settingsWrapper.appendChild(label);
                            settingsContent.appendChild(settingsWrapper);
                        });

                        settingsButton.appendChild(settingsContent);
                        scientificNameElement.parentNode.insertBefore(settingsButton, dropdownButton.nextSibling);
                    })
                        .catch(error => console.error("Error while requesting the GBIF API: ", error));
                }
            )
                .catch(error => console.error("Error while requesting the INPN API: ", error));
        } else {
            console.log("Scientific name not found on this page.");
        }
    }

    addExternalLinksDropdown();
    window.addEventListener('popstate', addExternalLinksDropdown);
})();