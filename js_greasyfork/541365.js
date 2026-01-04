// ==UserScript==
// @name        Lehrgangszuweiser - Erweitert
// @namespace   bos-ernie.leitstellenspiel.de
// @version     1.9.8 // Version aktualisiert
// @license     BSD-3-Clause
// @author      BOS-Ernie
// @description Fügt Buttons hinzu, um zwischen 1 und 10 Personen einer Wache auf einmal einem Lehrgang zuzuweisen. Erweitert um automatische Zuweisung basierend auf Mindestanzahl. Ermöglicht vollständiges Laden ALLER Wachen durch optimiertes simuliertes Scrollen.
// @match       https://www.leitstellenspiel.de/buildings/*
// @match       https://polizei.leitstellenspiel.de/buildings/*
// @match       https://www.leitstellenspiel.de/schoolings/*
// @match       https://polizei.leitstellenspiel.com/schoolings/*
// @match       https://www.meldkamerspel.com/buildings/*
// @match       https://politie.meldkamerspel.com/buildings/*
// @match       https://www.meldkamerspel.com/schoolings/*
// @match       https://politie.meldkamerspel.com/schoolings/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @resource    forum_thread https://forum.leitstellenspiel.de/index.php?thread/23382-script-lehrgangszuweiser-by-bos-ernie/
// @downloadURL https://update.greasyfork.org/scripts/541365/Lehrgangszuweiser%20-%20Erweitert.user.js
// @updateURL https://update.greasyfork.org/scripts/541365/Lehrgangszuweiser%20-%20Erweitert.meta.js
// ==/UserScript==

/* global loadedBuildings, schooling_disable, update_schooling_free, update_costs, $ */

(function () {
  let requiredNumberOfPersonnel = null;
  let isAutoAssignmentRunning = false;
  let hasScriptBeenFullyInitialized = false;
  let allowPersonnelWithEducation = false; // Steuert, ob die erweiterte Logik aktiv ist (durch Checkbox)
  let requiredPreEducation = ""; // Speichert die erforderliche Vor-Ausbildung (jetzt aus Dropdown-Wert)
  let countMinPersonnelByPreEducation = false; // Zähle Mindestanzahl nur für Personal mit Vor-Ausbildung

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  document.addEventListener("educationValueChanged", function (e) {
    console.log("Event: educationValueChanged triggered", e.detail);
    const numberOfRequiredPersonnel = e.detail;
    if (numberOfRequiredPersonnel === requiredNumberOfPersonnel) {
      return;
    }
    requiredNumberOfPersonnel = numberOfRequiredPersonnel;
  });

  function renderPersonnelSelectors() {
    console.log("renderPersonnelSelectors called.");
    let elements = document.getElementsByClassName("panel-heading personal-select-heading");
    for (let i = 0; i < elements.length; i++) {
      let buildingId = elements[i].getAttribute("building_id");
      if (!elements[i].children[0].querySelector("#schooling-assigner-" + buildingId)) {
          elements[i].children[0].appendChild(createPersonnelSelector(buildingId));
      }
    }
    $(".personal-select-heading").off("click", panelHeadingClickEvent).on("click", panelHeadingClickEvent);
  }

  async function selectPersonnelClick(event) {
    console.log("selectPersonnelClick called for building:", event.target.dataset.buildingId, "capacity:", event.target.dataset.capacity);
    event.preventDefault();
    event.stopPropagation();

    const buildingId = event.target.dataset.buildingId;
    const capacity = event.target.dataset.capacity;

    // Manuelle Klicks verwenden immer die Standard-Logik (keine Vorausbildung, keine Doppelausbildung)
    await ensurePanelLoadedAndReady(buildingId);
    await selectPersonnel(buildingId, capacity, false, "");
  }

  async function resetPersonnelClick(event) {
    console.log("resetPersonnelClick called for building:", event.target.dataset.buildingId);
    event.preventDefault();
    event.stopPropagation();

    const buildingId = event.target.dataset.buildingId;
    await ensurePanelLoadedAndReady(buildingId);
    await resetPersonnel(buildingId);
  }

  async function panelHeadingClickEvent(event) {
    if (
      $(event.target).closest(".schooling-personnel-select-button, .schooling-personnel-reset-button").length > 0 ||
      event.target.id === 'minPersonnelPerBuilding' ||
      event.target.id === 'applyMinPersonnel' ||
      event.target.id === 'allowPersonnelWithEducation' || // Checkbox
      event.target.id === 'requiredPreEducationSelect' || // Dropdown für Vor-Ausbildung
      event.target.id === 'countMinPersonnelByPreEducation' // Checkbox für spezifische Zählung
    ) {
        event.stopPropagation();
        return;
    }

    let buildingIdElement = event.target.outerHTML.match(/building_id="(\d+)"/);
    if (!buildingIdElement) {
      let parent = event.target.parentElement;
      while (parent && !buildingIdElement) {
          if (parent.outerHTML) {
              buildingIdElement = parent.outerHTML.match(/building_id="(\d+)"/);
          }
          parent = parent.parentElement;
      }
    }

    if (buildingIdElement) {
        const buildingId = buildingIdElement[1];
        const panelBody = document.querySelector(".panel-body[building_id='" + buildingId + "']");

        if (panelBody && panelBody.classList.contains("hidden")) {
            await ensurePanelLoadedAndReady(buildingId);
        }
    }
  }

  /**
   * Stellt sicher, dass die Personal-Daten für ein Panel geladen UND die Checkboxen im DOM bereit sind.
   * Macht das Panel NICHT sichtbar.
   * @param {string} buildingId - Die ID des Gebäudes.
   * @returns {Promise<void>} - Ein Promise, das aufgelöst wird, wenn die Daten geladen und Checkboxen bereit sind.
   */
  async function ensurePanelLoadedAndReady(buildingId) {
    const panelHeading = getPanelHeading(buildingId);
    const panelBody = document.querySelector(".panel-body[building_id='" + buildingId + "']");

    if (!panelHeading || !panelBody) {
        console.warn(`ensurePanelLoadedAndReady: Panel heading or body not found for building ID: ${buildingId}`);
        return;
    }

    const hrefMatch = panelHeading.outerHTML.match(/href="([^"]+)"/);
    if (!hrefMatch) {
        console.warn(`ensurePanelLoadedAndReady: Href not found in panel heading for building ID: ${buildingId}`);
        return;
    }
    const href = hrefMatch[1];

    let contentLoaded = false;
    if (loadedBuildings.indexOf(href) === -1 || panelBody.innerHTML.trim() === "") {
        if (loadedBuildings.indexOf(href) === -1) {
            loadedBuildings.push(href);
        }

        contentLoaded = await new Promise(resolve => {
            $.get(href, function (data) {
                $(panelBody).html(data);
                const education_key = $("input[name=education]:checked").attr("education_key");
                if (typeof education_key == "undefined" && typeof globalEducationKey != "undefined") {
                    schooling_disable(globalEducationKey);
                } else if (typeof education_key != "undefined") {
                    schooling_disable(education_key);
                    update_schooling_free();
                }
                resolve(true);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                console.error(`ensurePanelLoadedAndReady: Failed to load personnel data for building ID: ${buildingId} - ${textStatus}, ${errorThrown}`);
                resolve(false);
            });
        });
    } else {
        contentLoaded = true;
    }

    if (!contentLoaded) {
        return;
    }

    let checkboxesReady = false;
    let attempts = 0;
    const maxAttempts = 20; // 20 * 20ms = 400ms Wartezeit
    while (!checkboxesReady && attempts < maxAttempts) {
        const firstCheckbox = panelBody.querySelector(".schooling_checkbox");
        if (firstCheckbox) {
            checkboxesReady = true;
        } else {
            attempts++;
            await sleep(20); // Pause beibehalten, da es um DOM-Bereitschaft geht
        }
    }

    if (!checkboxesReady) {
        console.error(`ensurePanelLoadedAndReady: Checkboxes for building ${buildingId} not found after multiple attempts.`);
        const index = loadedBuildings.indexOf(href);
        if (index > -1) {
            loadedBuildings.splice(index, 1);
        }
    }
  }


  function createPersonnelSelector(buildingId) {
    let existingButtonGroup = document.getElementById("schooling-assigner-" + buildingId);
    if (existingButtonGroup) {
      existingButtonGroup.remove();
    }

    let buttonGroup = document.createElement("div");
    buttonGroup.id = "schooling-assigner-" + buildingId;
    buttonGroup.className = "btn-group btn-group-xs";

    let resetIcon = document.createElement("span");
    resetIcon.className = "glyphicon glyphicon-trash";
    resetIcon.dataset.buildingId = buildingId;
    let resetButton = document.createElement("button");
    resetButton.type = "button";
    resetButton.className = "btn btn-default btn-sm schooling-personnel-reset-button";
    resetButton.appendChild(resetIcon);
    resetButton.addEventListener("click", resetPersonnelClick);

    buttonGroup.appendChild(resetButton);
    for (let i = 1; i < 11; i++) {
      let button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-default btn-sm schooling-personnel-select-button";
      button.dataset.buildingId = buildingId;
      button.dataset.capacity = i.toString();
      button.textContent = i.toString();
      button.addEventListener("click", selectPersonnelClick);
      buttonGroup.appendChild(button);
    }

    if (requiredNumberOfPersonnel > 10) {
      let button = document.createElement("button");
      button.type = "button";
      button.className = "btn btn-default btn-sm schooling-personnel-select-button";
      button.dataset.buildingId = buildingId;
      button.dataset.capacity = requiredNumberOfPersonnel.toString();
      button.textContent = requiredNumberOfPersonnel.toString();
      button.addEventListener("click", selectPersonnelClick);
      buttonGroup.appendChild(button);
    }

    return buttonGroup;
  }

  // selectPersonnel nimmt jetzt zwei zusätzliche Parameter auf
  async function selectPersonnel(buildingId, capacity, allowExistingEducation = false, preEducationRequired = "") {
    console.log(`selectPersonnel called for building: ${buildingId}, capacity: ${capacity}, allowExistingEducation: ${allowExistingEducation}, preEducationRequired: ${preEducationRequired}`);

    let schoolingFree = $("#schooling_free");
    let free = parseInt(schoolingFree.html() || '0', 10);

    const checkboxes = document.querySelectorAll(".schooling_checkbox[building_id='" + buildingId + "']");

    for (let i = 0; i < checkboxes.length; i++) {
      const checkbox = checkboxes[i];
      // !$(checkbox).prop("checked")  -> nicht schon angehakt
      // !$(checkbox).prop("disabled") -> nicht deaktiviert (z.B. weil im Einsatz)
      if (!$(checkbox).prop("checked") && !$(checkbox).prop("disabled") && free > 0 && capacity > 0) {
        const educationCell = document.getElementById("school_personal_education_" + $(checkbox).val());

        const personHasAnyEducation = educationCell && educationCell.innerHTML.trim() !== "";

        let meetsEducationRequirement = false;

        if (allowExistingEducation && preEducationRequired.trim() !== "") {
            const existingEducations = educationCell ? educationCell.innerHTML.trim() : "";
            const cleanedExistingEducations = cleanEducationName(existingEducations);

            if (cleanedExistingEducations.toLowerCase().includes(preEducationRequired.toLowerCase())) {
                meetsEducationRequirement = true;
            }
        } else {
            meetsEducationRequirement = !personHasAnyEducation;
        }

        if (meetsEducationRequirement) {
            $(checkbox).prop("checked", true);
            --free;
            --capacity; // Diese Capacity ist die für die aktuelle Wache gesollte
        }
      }
    }
    schoolingFree.html(free);
    update_costs();

    updateSelectionCounter(buildingId);
  }

  async function resetPersonnel(buildingId) {
    console.log(`resetPersonnel called for building: ${buildingId}`);
    await ensurePanelLoadedAndReady(buildingId);

    let schoolingFree = $("#schooling_free");
    let free = parseInt(schoolingFree.html() || '0', 10);

    $(".schooling_checkbox[building_id='" + buildingId + "']").each(function () {
      if ($(this).prop("checked")) {
        $(this).prop("checked", false);
        ++free;
      }
    });
    schoolingFree.html(free);
    update_costs();

    updateSelectionCounter(buildingId);
  }

  function countSelectedPersonnel(buildingId) {
    let count = 0;
    let checkboxes = document.querySelectorAll(".schooling_checkbox[building_id='" + buildingId + "']");

    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        count++;
      }
    }
    return count;
  }

  // Funktion zum Zählen des Personals mit spezifischer Vor-Ausbildung
  function countSpecificPersonnel(buildingId, requiredPreEducationName) {
      let count = 0;
      const checkboxes = document.querySelectorAll(".schooling_checkbox[building_id='" + buildingId + "']");

      for (let i = 0; i < checkboxes.length; i++) {
          const checkbox = checkboxes[i];
          const educationCell = document.getElementById("school_personal_education_" + $(checkbox).val());
          const personHasAnyEducation = educationCell && educationCell.innerHTML.trim() !== "";

          if (personHasAnyEducation) { // Nur Personen mit irgendeiner Ausbildung prüfen
              const existingEducations = educationCell.innerHTML.trim();
              const cleanedExistingEducations = cleanEducationName(existingEducations);
              if (cleanedExistingEducations.toLowerCase().includes(requiredPreEducationName.toLowerCase())) {
                  count++;
              }
          }
      }
      return count;
  }


  function updateSelectionCounter(buildingId) {
    const element_id = "personnel-selection-counter-" + buildingId;

    let counter = document.createElement("span");
    counter.id = element_id;
    counter.className = "label label-primary";
    counter.textContent = countSelectedPersonnel(buildingId) + " ausgewählt";

    const element = document.getElementById(element_id);
    if (element) {
      element.replaceWith(counter);
    } else {
      const assignerDiv = document.getElementById("schooling-assigner-" + buildingId);
      if (assignerDiv && assignerDiv.parentNode) {
          assignerDiv.parentNode.prepend(counter);
      }
    }
  }

  function getPanelHeading(buildingId) {
    return document.querySelector(".personal-select-heading[building_id='" + buildingId + "']");
  }

  function isElementVisible(el) {
      if (!el) return false;
      return el.offsetWidth > 0 || el.offsetHeight > 0;
  }

  // Funktion zur Bereinigung des Ausbildungsnamens
  function cleanEducationName(name) {
      // 1. Klammerinhalte entfernen (z.B. " (3 Tage)")
      let cleaned = name.replace(/\s*\([^)]*\)\s*/g, '').trim();
      // 2. Bekannte Suffixe entfernen (mit Leerzeichen davor, case-insensitive)
      const suffixes = [' Ausbildung', ' Lehrgang', ' Schulung', ' Fortbildung', ' Einheit'];
      for (const suffix of suffixes) {
          if (cleaned.toLowerCase().endsWith(suffix.toLowerCase())) {
              cleaned = cleaned.substring(0, cleaned.length - suffix.length).trim();
          }
      }
      return cleaned;
  }


  // --- NEUE FUNKTIONALITÄT HIER (AUTOMATISCHE ZUWEISUNG) ---

  function addMinPersonnelInputField() {
    console.log("addMinPersonnelInputField called.");
    let targetHeader = null;
    const h3Elements = document.querySelectorAll('h3');
    for (const h3 of h3Elements) {
        if (h3.textContent.trim() === "Personal auswählen") {
            targetHeader = h3;
            break;
        }
    }

    if (targetHeader) {
        let inputContainer = document.createElement('div');
        inputContainer.id = "schooling-advanced-options";
        inputContainer.style.marginBottom = '15px';
        inputContainer.style.padding = '10px';
        inputContainer.style.border = '1px solid #ddd';
        inputContainer.style.borderRadius = '4px';
        inputContainer.style.backgroundColor = '#f9f9f9';
        inputContainer.style.display = 'inline-block';
        inputContainer.style.marginLeft = '20px';
        inputContainer.style.verticalAlign = 'middle';
        inputContainer.style.maxWidth = '500px';

        // Dropdown für erforderliche Vor-Ausbildung
        let educationSelectOptions = '<option value="">-- Keine Vor-Ausbildung gewählt --</option>';
        const originalEducationSelect = document.getElementById('education_select');
        if (originalEducationSelect) {
            Array.from(originalEducationSelect.options).forEach(option => {
                if (option.value !== "") {
                    const cleanedName = cleanEducationName(option.textContent);
                    educationSelectOptions += `<option value="${cleanedName}">${option.textContent}</option>`;
                }
            });
        }


        inputContainer.innerHTML = `
            <label for="minPersonnelPerBuilding" style="font-weight: bold; margin-right: 10px;">Mindestanzahl Personal pro Wache:</label>
            <input type="number" id="minPersonnelPerBuilding" min="0" value="0" style="width: 80px; margin-right: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 3px;">
            <button id="applyMinPersonnel" class="btn btn-primary btn-sm">Automatisch zuweisen</button>
            <br><br>
            <input type="checkbox" id="allowPersonnelWithEducation" style="margin-right: 5px;">
            <label for="allowPersonnelWithEducation" style="font-weight: normal;">Personal mit spezifischer Vor-Ausbildung wählen</label>
            <br>
            <div id="preEducationFieldGroup" style="display: none; margin-top: 5px;">
                <label for="requiredPreEducationSelect" style="font-weight: normal; margin-right: 5px;">Benötigte Vor-Ausbildung:</label>
                <select id="requiredPreEducationSelect" class="form-control" style="width: 200px; display: inline-block;">
                    ${educationSelectOptions}
                </select>
                <br style="margin-bottom: 5px;">
                <input type="checkbox" id="countMinPersonnelByPreEducation" style="margin-right: 5px; margin-top: 5px;">
                <label for="countMinPersonnelByPreEducation" style="font-weight: normal; margin-top: 5px;">Zusätzliche Zuweisung: Versuche X Personal mit dieser Ausbildung zu finden</label>
            </div>
        `;
        targetHeader.parentNode.insertBefore(inputContainer, targetHeader.nextSibling);

        document.getElementById('applyMinPersonnel').removeEventListener('click', autoAssignPersonnel);
        document.getElementById('applyMinPersonnel').addEventListener('click', autoAssignPersonnel);

        const allowPersonnelWithEducationCheckbox = document.getElementById('allowPersonnelWithEducation');
        const preEducationFieldGroup = document.getElementById('preEducationFieldGroup');
        const requiredPreEducationSelect = document.getElementById('requiredPreEducationSelect');
        const countMinPersonnelByPreEducationCheckbox = document.getElementById('countMinPersonnelByPreEducation');

        allowPersonnelWithEducationCheckbox.addEventListener('change', function() {
            allowPersonnelWithEducation = this.checked;
            if (this.checked) {
                preEducationFieldGroup.style.display = 'block';
            } else {
                preEducationFieldGroup.style.display = 'none';
                requiredPreEducationSelect.value = "";
                requiredPreEducation = "";
                countMinPersonnelByPreEducationCheckbox.checked = false; // Zurücksetzen
                countMinPersonnelByPreEducation = false; // Zurücksetzen
            }
            console.log("Allow personnel with existing education:", allowPersonnelWithEducation);
            localStorage.setItem('lss_allowPersonnelWithEducation', JSON.stringify(allowPersonnelWithEducation));
            localStorage.setItem('lss_requiredPreEducation', requiredPreEducation);
            localStorage.setItem('lss_countMinPersonnelByPreEducation', JSON.stringify(countMinPersonnelByPreEducation));
        });

        requiredPreEducationSelect.addEventListener('change', function() {
            requiredPreEducation = this.value;
            console.log("Required pre-education updated to:", requiredPreEducation);
            localStorage.setItem('lss_requiredPreEducation', requiredPreEducation);
        });

        countMinPersonnelByPreEducationCheckbox.addEventListener('change', function() {
            countMinPersonnelByPreEducation = this.checked;
            console.log("Count min personnel by pre-education:", countMinPersonnelByPreEducation);
            localStorage.setItem('lss_countMinPersonnelByPreEducation', JSON.stringify(countMinPersonnelByPreEducation));
        });

        // Initialer Ladezustand aus Local Storage
        const savedAllowWithEducation = localStorage.getItem('lss_allowPersonnelWithEducation');
        if (savedAllowWithEducation !== null) {
            allowPersonnelWithEducation = JSON.parse(savedAllowWithEducation);
            allowPersonnelWithEducationCheckbox.checked = allowPersonnelWithEducation;
        }
        const savedRequiredPreEducation = localStorage.getItem('lss_requiredPreEducation');
        if (savedRequiredPreEducation !== null) {
            requiredPreEducation = savedRequiredPreEducation;
            requiredPreEducationSelect.value = requiredPreEducation;
        }
        const savedCountMinPersonnel = localStorage.getItem('lss_countMinPersonnelByPreEducation');
        if (savedCountMinPersonnel !== null) {
            countMinPersonnelByPreEducation = JSON.parse(savedCountMinPersonnel);
            countMinPersonnelByPreEducationCheckbox.checked = countMinPersonnelByPreEducation;
        }


        // Sichtbarkeit des Feldes anpassen beim Start
        if (allowPersonnelWithEducationCheckbox.checked) {
            preEducationFieldGroup.style.display = 'block';
        } else {
            preEducationFieldGroup.style.display = 'none';
        }

    } else {
        console.warn("Could not find the 'Personal auswählen' header to insert the input field.");
    }
  }

  /**
   * Lädt alle Wachen durch simuliertes, iteratives Scrollen.
   * Prüft auf neue Gebäude und Scroll-Fortschritt, um das Ende zu erkennen.
   * @returns {Promise<void>}
   */
  async function loadAllBuildingsByScrolling() {
      console.log("Attempting to load all buildings by simulating scroll...");
      const scrollableElement = document.documentElement; // Der scrollbare Bereich

      let lastScrollTop = -1; // Letzte Scroll-Position
      let previousBuildingCount = 0;
      let currentBuildingCount = 0;
      let noProgressCounter = 0;
      const maxNoProgressAttempts = 15; // Max 15 Versuche ohne neuen Gebäude- oder Scroll-Fortschritt
      const maxTotalScrolls = 300; // Schutz gegen Endlosschleifen (erhöht, da viele Wachen)
      let currentScrolls = 0;
      // Scroll-Schritt basierend auf Viewport, aber mit Puffer, um den Lazy Load Trigger zu erreichen
      const scrollAmountPerStep = window.innerHeight * 0.7;

      while (noProgressCounter < maxNoProgressAttempts && currentScrolls < maxTotalScrolls) {
          previousBuildingCount = document.getElementsByClassName("panel-heading personal-select-heading").length;
          lastScrollTop = scrollableElement.scrollTop;

          // Scrolle einen festen Schritt nach unten
          scrollableElement.scrollTop += scrollAmountPerStep;

          // Wenn wir am (fast) Ende sind, stelle sicher, dass wir wirklich am Ende sind.
          if (scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 5) {
              scrollableElement.scrollTop = scrollableElement.scrollHeight; // Erzwinge Scroll ans Ende
          }

          // WICHTIG: Längere Pause hier, um dem Spiel Zeit zum Rendern zu geben
          await sleep(750); // Erhöht auf 750ms

          currentBuildingCount = document.getElementsByClassName("panel-heading personal-select-heading").length;

          // Überprüfe, ob Fortschritt erzielt wurde: neue Gebäude geladen ODER wir konnten weiter scrollen
          if (currentBuildingCount > previousBuildingCount || scrollableElement.scrollTop > lastScrollTop) {
              if (currentBuildingCount > previousBuildingCount) {
                  console.log(`Loaded ${currentBuildingCount - previousBuildingCount} new buildings. Total: ${currentBuildingCount}`);
              } else {
                  console.log(`Scrolled down. Total buildings: ${currentBuildingCount}.`);
              }
              noProgressCounter = 0; // Fortschritt erzielt, Zähler zurücksetzen
          } else {
              noProgressCounter++; // Kein Fortschritt, Zähler erhöhen
              console.log(`No progress detected: ${noProgressCounter} / ${maxNoProgressAttempts} attempts.`);
          }

          currentScrolls++;

          // Zusätzliche Abbruchbedingung: Wenn wir am Ende sind und keine neuen Gebäude mehr geladen werden
          if (scrollableElement.scrollTop + scrollableElement.clientHeight >= scrollableElement.scrollHeight - 5) {
              if (noProgressCounter >= 3) { // Wenn 3x am Ende und keine neuen Gebäude, dann ist Ende der Liste erreicht
                  console.log("Reached very bottom and no new buildings for a while. Assuming all loaded.");
                  break;
              }
          }
      }
      console.log(`Finished loading buildings. Final count: ${document.getElementsByClassName("panel-heading personal-select-heading").length} after ${currentScrolls} scroll attempts.`);
      window.scrollTo(0, 0); // Scrolle zurück an den Anfang
  }


  async function autoAssignPersonnel(event) {
    console.log("autoAssignPersonnel called via button click.");
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    if (isAutoAssignmentRunning) {
        console.log("Auto-assignment is already running. Please wait.");
        return;
    }
    isAutoAssignmentRunning = true;

    const minPersonnel = parseInt(document.getElementById('minPersonnelPerBuilding').value, 10);
    if (isNaN(minPersonnel) || minPersonnel < 0) {
        alert("Bitte geben Sie eine gültige positive Zahl für die Mindestanzahl ein.");
        isAutoAssignmentRunning = false;
        return;
    }
    if (minPersonnel === 0) {
        alert("Mindestanzahl ist 0. Es wird kein Personal zugewiesen.");
        isAutoAssignmentRunning = false;
        return;
    }

    // **************** PRÜFUNG: Vor-Ausbildung, bevor gescrollt wird ****************
    if (allowPersonnelWithEducation && requiredPreEducation.trim() === "") {
        alert("Um Personal mit Vor-Ausbildung zu wählen, muss eine spezifische Vor-Ausbildung aus der Liste ausgewählt werden. Bitte wählen Sie eine Ausbildung aus dem Dropdown aus oder deaktivieren Sie die Checkbox 'Personal mit spezifischer Vor-Ausbildung wählen'.");
        isAutoAssignmentRunning = false;
        return;
    }
    // ***********************************************************************************

    // **************** Wichtig: Zuerst alle Wachen laden ****************
    await loadAllBuildingsByScrolling();
    // *******************************************************************

    let totalAssigned = 0;
    let schoolingFree = parseInt($("#schooling_free").html() || '0', 10);

    let allPanelHeadings = document.getElementsByClassName("panel-heading personal-select-heading");
    let visiblePanelHeadings = [];
    for (let i = 0; i < allPanelHeadings.length; i++) {
        let buildingContainer = allPanelHeadings[i].closest('.panel');
        if (buildingContainer && isElementVisible(buildingContainer)) {
            visiblePanelHeadings.push(allPanelHeadings[i]);
        }
    }
    let panelHeadingsToProcess = visiblePanelHeadings;
    console.log(`Starting auto-assignment for ${panelHeadingsToProcess.length} currently VISIBLE buildings.`);

    for (let i = 0; i < panelHeadingsToProcess.length; i++) {
        let panelHeading = panelHeadingsToProcess[i];
        let buildingId = panelHeading.getAttribute("building_id");

        let capacityForSelectPersonnel = 0; // Dies ist die Zahl, die selectPersonnel übergeben wird

        // Wenn die Checkbox "Zusätzliche Zuweisung" aktiv ist, ignorieren wir die Wachen-Belegung und versuchen,
        // direkt minPersonnel Personen mit der spezifischen Ausbildung zu finden.
        if (countMinPersonnelByPreEducation) {
            capacityForSelectPersonnel = minPersonnel; // minPersonnel ist hier die gewünschte Anzahl an Personen zum Anwählen
            console.log(`Building ${buildingId} (Additional Assignment Mode): Attempting to assign up to ${capacityForSelectPersonnel} personnel with pre-education '${requiredPreEducation}'.`);
        } else {
            // Normalmodus: Zähle alles Personal der Wache und berechne den Bedarf
            let currentSelectedByScript = countSelectedPersonnel(buildingId); // Personen, die bereits vom Skript angewählt wurden
            const trainedAndTrainingSpan = panelHeading.querySelector(".personal-select-heading-building");
            let currentTrainedInBuilding = 0;
            let currentTrainingInBuilding = 0;

            if (trainedAndTrainingSpan) {
                const trainedText = trainedAndTrainingSpan.querySelector(".label-success")?.textContent;
                const trainingText = trainedAndTrainingSpan.querySelector(".label-info")?.textContent;

                if (trainedText) {
                    const match = trainedText.match(/(\d+)\s+ausgebildete/);
                    if (match) currentTrainedInBuilding = parseInt(match[1], 10);
                }
                if (trainingText) {
                    const match = trainingText.match(/(\d+)\s+in Ausbildung/);
                    if (match) currentTrainingInBuilding = parseInt(match[1], 10);
                }
            }
            const effectiveCurrentPersonnelOverall = currentTrainedInBuilding + currentTrainingInBuilding + currentSelectedByScript;
            capacityForSelectPersonnel = Math.max(0, minPersonnel - effectiveCurrentPersonnelOverall); // Normaler Bedarf

            console.log(`Building ${buildingId} (Overall Count Mode): Target=${minPersonnel}, Currently Trained (Overall)=${currentTrainedInBuilding}, Training=${currentTrainingInBuilding}, Selected=${currentSelectedByScript}, Effective (Overall)=${effectiveCurrentPersonnelOverall}, Needed To Assign (Overall)=${capacityForSelectPersonnel}`);
        }

        // Führe die Zuweisung nur aus, wenn tatsächlich Personal zugewiesen werden soll (capacityForSelectPersonnel > 0)
        // UND Lehrgangsplätze frei sind.
        if (capacityForSelectPersonnel > 0 && schoolingFree > 0) {
            // ensurePanelLoadedAndReady muss immer vor selectPersonnel aufgerufen werden
            await ensurePanelLoadedAndReady(buildingId);

            // selectPersonnel wird nun mit der tatsächlich benötigten Menge (capacityForSelectPersonnel)
            // und der verbleibenden Lehrgangsplätze aufgerufen.
            // selectPersonnel kümmert sich intern um die Prüfung der spezifischen Ausbildung.
            await selectPersonnel(buildingId, Math.min(capacityForSelectPersonnel, schoolingFree), allowPersonnelWithEducation, requiredPreEducation);

            totalAssigned = countSelectedPersonnelGlobally();
            schoolingFree = parseInt($("#schooling_free").html() || '0', 10);
        } else {
            console.log(`Skipping building ${buildingId}: No personnel to assign (${capacityForSelectPersonnel <= 0}) or no free schooling slots (${schoolingFree <= 0}).`);
            continue;
        }
    }

    $("#schooling_free").html(schoolingFree);
    update_costs();

    alert(`Automatische Zuweisung abgeschlossen. ${totalAssigned} Personen wurden zugewiesen.`);
    isAutoAssignmentRunning = false;
  }

  // Globale Zählung der ausgewählten Personen
  function countSelectedPersonnelGlobally() {
      let totalCount = 0;
      document.querySelectorAll(".schooling_checkbox:checked").forEach(checkbox => {
          totalCount++;
      });
      return totalCount;
  }


  // --- ENDE NEUE FUNKTIONALITÄT ---

  // --- INITIALISIERUNG DES SKRIPTS ---
  function initializeScript() {
    console.log("Lehrgangszuweiser Extended: initializeScript() called.");
    if (hasScriptBeenFullyInitialized) {
        console.log("Lehrgangszuweiser Extended: Script already initialized, skipping.");
        return;
    }
    hasScriptBeenFullyInitialized = true;

    setTimeout(() => {
        console.log("Lehrgangszuweiser Extended: Delayed initialization start.");
        renderPersonnelSelectors(); // Erstellt Buttons
        addMinPersonnelInputField(); // Fügt das Eingabefeld und den Button hinzu

        console.log("Lehrgangszuweiser Extended: Initialisation complete.");
    }, 2000); // 2 Sekunden Verzögerung
  }

  // Die main-Funktion steuert den Startpunkt des Skripts
  function main() {
    console.log("Lehrgangszuweiser Extended: main() called.");
    if (window.location.href.match(/\/buildings\/\d+\/hire/)) {
      console.log("Lehrgangszuweiser Extended: Skipping hire personnel page.");
      return;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
        console.log("Lehrgangszuweiser Extended: Added DOMContentLoaded listener.");
    } else {
        initializeScript();
        console.log("Lehrgangszuweiser Extended: DOM already loaded, initializing directly.");
    }
  }

  main();
})();