// ==UserScript==
// @name        * Gebäude- & Fuhrparkverwalter
// @namespace   bos-ernie.leitstellenspiel.de
// @version     2.31.0
// @license     BSD-3-Clause
// @author      BOS-Ernie
// @description Bereitet diverse Informationen zu Wachen und Fahrzeugen auf, welche dem Spieler Hinweise über noch fehlende Einstellungen, Ausbauten, Fahrzeugen etc. gibt
// @match       https://*.leitstellenspiel.de/
// @icon        https://www.google.com/s2/favicons?sz=64&domain=leitstellenspiel.de
// @run-at      document-idle
// @grant       none
// @require     https://update.greasyfork.org/scripts/491642/1354160/%2A%20Common%3A%20IndexedDB.js
// @downloadURL https://update.greasyfork.org/scripts/524522/%2A%20Geb%C3%A4ude-%20%20Fuhrparkverwalter.user.js
// @updateURL https://update.greasyfork.org/scripts/524522/%2A%20Geb%C3%A4ude-%20%20Fuhrparkverwalter.meta.js
// ==/UserScript==

/* global $, user_premium */

/**
 *
 * 📝 Aufgaben
 * - [ ] Soll-Personal
 *   - [ ] Grosswachen separat konfigurieren
 *   - [x] Das Soll-Personal für Kleinwachen wird statt dem konfigurierten Wert mit dem der Normalwachen gesetzt (Feuerwehr, Polizei und Rettung)
 *   - [x] Soll-Personal: Gebäudetypen Rettungshubschrauber-Station, Rettungshundestaffel und Wasserrettung ergänzen
 * - [ ] Tab-Inhalte (Informationen, Tabellen etc.) grundsätzlich anzeigen
 * - [ ] Nur 2 Tabs anzeigen: Gebäude und Fahrzeuge. Pro Tab entsprechende Filtermöglichkeiten hinzufügen
 * - [ ] Wachen auf Fahrzeuge überprüfen (richtige Fahrzeuge pro Wache)
 * - [ ] Wachen auf nächstgelegene Leitstelle überprüfen
 * - [ ] Pol-Wachen mit mehr als 1 DGL-Fahrzeug auflisten
 * - [ ] Zugfahrzeug
 *   - [x] Richtiges Zugfahrzeug überprüfen
 *   - [ ] Überprüfen, ob einem Zugfahrzeug mehrere Anhänger zugewiesen sind
 * - [ ] Statistik (Fahrzeug- und Gebäudestatistik)
 * - [ ] Fahrzeuge in Status 6 auflisten
 * - [ ] Informationen und Tabellen immer anzeigen. Wenn keine Daten vorhanden sind, dann entsprechende Hinweise anzeigen.
 * - [ ] Ansicht Ausbauten erweitern: Auflistung der inaktiven Wachen bzw. Wachen mit entsprechend inaktivem Ausbau
 *
 * ✅ Erledigt
 * - [x] Wachen auf Soll-Personal überprüfen
 * - [x] Wachen auf Soll-Personal korrigieren
 * - [x] Wachen auf automatisches Werben überprüfen
 * - [x] Wachen auf Ausbauten überprüfen
 *   - [x] Überprüfen, ob Ausbauten enabled sind
 *   - [x] Resultat der Überprüfung auf Tab anzeigen
 *   - [x] Funktion zum Aktivieren/Deaktivieren von Ausbauten nach Ausbautyp
 * - [x] Fahrzeuge auf Anzahl zugewiesenes Personal überprüfen
 * - [x] Verwendung von sessionStorage durch IndexedDB ersetzen
 * - [x] Präfix [Gebäude- & Fuhrparkverwalter] in der Konsole verwenden
 - [x] Nach der initialen Ladung kein automatisches Neuladen nach Zeit, sondern nur bei Bedarf per Button
 * - [x] operationalReadinessConfiguration automatisch über https://api.lss-manager.de/de_DE/buildings erstellen
 */

(async function () {
  let buildings = [];
  let buildingsWithIncorrectPersonalCountTarget = [];
  let buildingsWithoutAutomaticHiring = [];
  let buildingsWithMissingExtensions = [];
  let buildingTypes = [];
  let vehiclePersonnelAllocations = [];
  let vehicles = [];
  let settings = null;

  const keyBuildings = "Buildings";
  const keyVehicles = "Vehicles";
  const keySettings = "Settings";

  const defaultSettings = {
    personnelSetPoint: {
      "building-type-0": 400, // Feuerwache
      "building-type-2": 400, // Rettungswache
      "building-type-5": 400, // Rettungshubschrauber-Station
      "building-type-6": 400, // Polizeiwache
      "building-type-9": 400, // THW
      "building-type-11": 400, // Bereitschaftspolizei
      "building-type-12": 400, // Schnelleinsatzgruppe (SEG)
      "building-type-13": 400, // Polizeihubschrauberstation
      "building-type-15": 400, // Wasserrettung
      "building-type-17": 400, // Polizei-Sondereinheiten
      "building-type-18": 400, // Feuerwache (Kleinwache)
      "building-type-19": 400, // Polizeiwache (Kleinwache)
      "building-type-20": 400, // Rettungswache (Kleinwache)
      "building-type-21": 400, // Rettungshundestaffel
      "building-type-24": 400, // Reiterstaffel
      "building-type-25": 400, // Bergrettungswache
      "building-type-26": 400, // Seenotrettungswache
      "building-type-28": 400, // Hubschrauberstation (Seenotrettung)
    },
  };

  const pseudoBuildingTypeIdMapping = [
    {
      id: "0",
      caption: "Feuerwache",
      buildingTypeId: 0,
      smallBuilding: false,
    },
    {
      id: "1",
      caption: "Feuerwehrschule",
      buildingTypeId: 1,
      smallBuilding: false,
    },
    {
      id: "2",
      caption: "Rettungswache",
      buildingTypeId: 2,
      smallBuilding: false,
    },
    {
      id: "3",
      caption: "Rettungsschule",
      buildingTypeId: 3,
      smallBuilding: false,
    },
    {
      id: "4",
      caption: "Krankenhaus",
      buildingTypeId: 4,
      smallBuilding: false,
    },
    {
      id: "5",
      caption: "Rettungshubschrauber-Station",
      buildingTypeId: 5,
      smallBuilding: false,
    },
    {
      id: "6",
      caption: "Polizeiwache",
      buildingTypeId: 6,
      smallBuilding: false,
    },
    {
      id: "7",
      caption: "Leitstelle",
      buildingTypeId: 7,
      smallBuilding: false,
    },
    {
      id: "8",
      caption: "Polizeischule",
      buildingTypeId: 8,
      smallBuilding: false,
    },
    {
      id: "9",
      caption: "THW",
      buildingTypeId: 9,
      smallBuilding: false,
    },
    {
      id: "10",
      caption: "THW Bundesschule",
      buildingTypeId: 10,
      smallBuilding: false,
    },
    {
      id: "11",
      caption: "Bereitschaftspolizei",
      buildingTypeId: 11,
      smallBuilding: false,
    },
    {
      id: "12",
      caption: "Schnelleinsatzgruppe (SEG)",
      buildingTypeId: 12,
      smallBuilding: false,
    },
    {
      id: "13",
      caption: "Polizeihubschrauberstation",
      buildingTypeId: 13,
      smallBuilding: false,
    },
    {
      id: "14",
      caption: "Bereitstellungsraum",
      buildingTypeId: 14,
      smallBuilding: false,
    },
    {
      id: "15",
      caption: "Wasserrettung",
      buildingTypeId: 15,
      smallBuilding: false,
    },
    {
      id: "16",
      caption: "Verbandszellen",
      buildingTypeId: 16,
      smallBuilding: false,
    },
    {
      id: "17",
      caption: "Polizei-Sondereinheiten",
      buildingTypeId: 17,
      smallBuilding: false,
    },
    {
      id: "18",
      caption: "Feuerwache (Kleinwache)",
      buildingTypeId: 0,
      smallBuilding: true,
    },
    {
      id: "19",
      caption: "Polizeiwache (Kleinwache)",
      buildingTypeId: 6,
      smallBuilding: true,
    },
    {
      id: "20",
      caption: "Rettungswache (Kleinwache)",
      buildingTypeId: 2,
      smallBuilding: true,
    },
    {
      id: "21",
      caption: "Rettungshundestaffel",
      buildingTypeId: 21,
      smallBuilding: false,
    },
    {
      id: "22",
      caption: "Großer Komplex",
      buildingTypeId: 22,
      smallBuilding: false,
    },
    {
      id: "23",
      caption: "Kleiner Komplex",
      buildingTypeId: 23,
      smallBuilding: false,
    },
    {
      id: "24",
      caption: "Reiterstaffel",
      buildingTypeId: 24,
      smallBuilding: false,
    },
    {
      id: "25",
      caption: "Bergrettungswache",
      buildingTypeId: 25,
      smallBuilding: false,
    },
    {
      id: "26",
      caption: "Seenotrettungswache",
      buildingTypeId: 26,
      smallBuilding: false,
    },
    {
      id: "27",
      caption: "Schule für Seefahrt und Seenotrettung",
      buildingTypeId: 27,
      smallBuilding: false,
    },
    {
      id: "28",
      caption: "Hubschrauberstation (Seenotrettung)",
      buildingTypeId: 28,
      smallBuilding: false,
    },
  ];

  const requiredExtensionsPerBuildingType = [
    {
      pseudoBuildingTypeId: "0", // FW
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "1",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "2",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "3",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "4", // KH
      extensions: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    },
    {
      pseudoBuildingTypeId: "5",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "6", // POL
      extensions: [12, 11, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    },
    {
      pseudoBuildingTypeId: "7",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "8", // POL-SCHULE
      extensions: [0, 1, 2],
    },
    {
      pseudoBuildingTypeId: "9", // THW
      extensions: [0, 1, 2, 3],
    },
    {
      pseudoBuildingTypeId: "10",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "11", // BEPO
      extensions: [10],
    },
    {
      pseudoBuildingTypeId: "12", // SEG
      extensions: [0, 1, 5],
    },
    {
      pseudoBuildingTypeId: "13",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "14",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "15",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "16",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "17",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "18",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "19",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "20",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "21",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "22",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "23",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "24",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "25",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "26",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "27",
      extensions: [],
    },
    {
      pseudoBuildingTypeId: "28",
      extensions: [],
    },
  ];
  const buildingsWithPersonal = [0, 2, 5, 6, 9, 11, 12, 13, 15, 17, 18, 19, 20, 21, 24, 25, 26, 28];

  function addModal() {
    const modal = document.createElement("div");
    modal.className = "modal fade";
    modal.id = "building-and-fleet-manager-modal";
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", "building-and-fleet-manager-modal-label");
    modal.setAttribute("aria-hidden", "true");
    modal.style.display = "none";
    modal.style.zIndex = "5000";
    modal.innerHTML = `<div class="modal-dialog modal-lg" role="document" style="width: 95%; margin: 40px auto;">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title" id="building-and-fleet-manager-modal-label">Gebäude- und Fahrzeugverwalter</h1>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body" style="height: calc(100vh - 350px); overflow-y: auto;">
      <div>
        <ul class="nav nav-tabs" role="tablist" style="margin-bottom: 10px">
          <li role="presentation" class="active">
            <a href="#gfm-buildings-panel" aria-controls="gfm-buildings-panel" role="tab" data-toggle="tab">
              Gebäude
            </a>
          </li>
          <li role="presentation">
            <a href="#operational-readiness-panel" aria-controls="operational-readiness-panel" role="tab" data-toggle="tab">
              Einsatzbereitschaft
            </a>
          </li>
          <li role="presentation" class="active">
            <a href="#vehicles-panel" aria-controls="vehicles-panel" role="tab" data-toggle="tab">
              Fahrzeuge
            </a>
          </li>
          <li role="presentation">
            <a href="#tractive-vehicles-panel" aria-controls="tractive-vehicles-panel" role="tab" data-toggle="tab">
              Zugfahrzeuge
            </a>
          </li>
          <li role="presentation">
            <a
              href="#personnel-allocation-panel"
              aria-controls="personnel-allocation-panel"
              role="tab"
              data-toggle="tab"
            >
              Personalzuweisung
            </a>
          </li>
          <li role="presentation">
            <a href="#settings-panel" aria-controls="settings-panel" role="tab" data-toggle="tab">
              Einstellungen
            </a>
          </li>
        </ul>
        <div class="tab-content">
          <div role="tabpanel" class="tab-pane active" id="gfm-buildings-panel">
            <!-- Filter und Aktionen -->
            <div class="panel panel-default">
              <div class="panel-body">
                <p class="text-uppercase small text-muted">Filter und Aktionen</p>
                <div class="row">
<!--                  <div class="col-md-3 col-sm-12">-->
<!--                    <div class="form-group">-->
<!--                      <label for="filter-control-center">Leitstelle</label>-->
<!--                      <select id="filter-control-center" class="form-control" disabled>-->
<!--                        <option value="-1">Demnächst verfügbar</option>-->
<!--                      </select>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                  <div class="col-md-3 col-sm-12">-->
<!--                    <div class="form-group">-->
<!--                      <label for="filter-building-type">Gebäudetyp</label>-->
<!--                      <select id="filter-building-type" class="form-control" disabled>-->
<!--                        <option value="-1">Demnächst verfügbar</option>-->
<!--                      </select>-->
<!--                    </div>-->
<!--                  </div>-->
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="filter-miscellaneous">Diverses</label>
                      <br />
                      <div id="filter-miscellaneous" class="btn-group btn-group-xs" role="group">
                        <button type="button" id="filter-deviating-personnel-count-target" class="btn btn-default">
                          Abweichendes Soll-Personal (<span id="number-of-deviating-personnel-count-target">-</span>)
                        </button>
                        <button id="fix-personnel-set-point" class="btn btn-default" type="submit" title="Berichtigen"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
                        <button type="button" id="filter-missing-automatic-hiring" class="btn btn-default">
                          Fehlendes automatisches Werben (<span id="number-of-missing-automatic-hiring">-</span>)
                        </button>
                        <button id="fix-automatic-hiring" class="btn btn-default" type="submit" title="Berichtigen"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
                        <button type="button" id="filter-missing-extensions" class="btn btn-default">
                          Fehlende Erweiterungen (<span id="number-of-buildings-with-missing-extensions">-</span>)
                        </button>
                        <button id="fix-missing-building-extensions" class="btn btn-default" type="submit" title="Berichtigen"><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table id="building-table" class="table table-striped table-hover table-condensed table-responsive">
              <thead>
              <tr>
                <th>Gebäude</th>
                <th>Soll-Personal</th>
                <th>Automatisches Werben</th>
                <th>Ausbauten</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td colspan="4">
                  <div class="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div role="tabpanel" class="tab-pane" id="operational-readiness-panel">
            <div class="row">
              <div class="col-md-12 bg">
                <div class="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          
          <div role="tabpanel" class="tab-pane" id="vehicles-panel">
            <!-- Filter und Aktionen -->
            <div class="panel panel-default">
              <div class="panel-body">
                <p class="text-uppercase small text-muted">Filter und Aktionen</p>
                <div class="row">
                  <div class="col-md-6 col-sm-12">
                    <div class="form-group">
                      <label for="filter-miscellaneous">Diverses</label>
                      <br />
                      <div id="filter-miscellaneous" class="btn-group btn-group-xs" role="group">
                        <button type="button" id="filter-vehicle-status-6" class="btn btn-default">
                          Status 6 (<span id="vehicle-status-6-count">-</span>)
                        </button>
                        <button id="fix-vehicle-status-6" class="btn btn-default" type="submit" title="Berichtigen" disabled><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
                        <button type="button" id="filter-max-personnel-override" class="btn btn-default">
                          Abweichende max. Besatzung (<span id="max-personnel-override-count">-</span>)
                        </button>
                        <button id="fix-max-personnel-override" class="btn btn-default" type="submit" title="Berichtigen" disabled><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <table id="vehicle-table" class="table table-striped table-hover table-condensed table-responsive">
              <thead>
              <tr>
                <th>Fahrzeug</th>
                <th>Gebäude</th>
                <th>Max. Besatzung</th>
                <th>Status</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td colspan="4">
                  <div class="loader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          
          <div role="tabpanel" class="tab-pane" id="tractive-vehicles-panel">
            <div class="row">
              <div class="col-md-12 bg">
                <div class="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div role="tabpanel" class="tab-pane" id="personnel-allocation-panel">
            <div class="row">
              <div class="col-md-12 bg">
                <div class="loader">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
          <div role="tabpanel" class="tab-pane" id="settings-panel">
            <h2>Soll-Personal</h2>
            <form id="settings" class="form-horizontal">
              <div class="form-group">
                <label for="building-type-0" class="col-sm-4 control-label">
                  Feuerwache
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-0" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-18" class="col-sm-4 control-label">
                  Feuerwache (Kleinwache)
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-18" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-2" class="col-sm-4 control-label">
                  Rettungswache
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-2" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-20" class="col-sm-4 control-label">
                  Rettungswache (Kleinwache)
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-20" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-5" class="col-sm-4 control-label">
                  Rettungshubschrauber-Station
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-5" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-6" class="col-sm-4 control-label">
                  Polizeiwache
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-6" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-19" class="col-sm-4 control-label">
                  Polizeiwache (Kleinwache)
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-19" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-11" class="col-sm-4 control-label">
                  Bereitschaftspolizei
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-11" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-13" class="col-sm-4 control-label">
                  Polizeihubschrauberstation
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-13" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-17" class="col-sm-4 control-label">
                  Polizei-Sondereinheiten
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-17" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-12" class="col-sm-4 control-label">
                  Schnelleinsatzgruppe (SEG)
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-12" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-9" class="col-sm-4 control-label">
                  THW
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-9" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-21" class="col-sm-4 control-label">
                  Rettungshundestaffel
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-21" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                <label for="building-type-15" class="col-sm-4 control-label">
                  Wasserrettung
                </label>
                <div class="col-sm-1">
                  <input type="number" class="form-control" id="building-type-15" min="0" max="400" />
                </div>
              </div>
              <div class="form-group">
                    <label for="building-type-24" class="col-sm-4 control-label">
                      Reiterstaffel
                    </label>
                    <div class="col-sm-1">
                      <input type="number" class="form-control" id="building-type-24" min="0" max="400" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="building-type-25" class="col-sm-4 control-label">
                      Bergrettungswache
                    </label>
                    <div class="col-sm-1">
                      <input type="number" class="form-control" id="building-type-25" min="0" max="400" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="building-type-26" class="col-sm-4 control-label">
                      Seenotrettungswache
                    </label>
                    <div class="col-sm-1">
                      <input type="number" class="form-control" id="building-type-26" min="0" max="400" />
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="building-type-28" class="col-sm-4 control-label">
                      Hubschrauberstation (Seenotrettung)
                    </label>
                    <div class="col-sm-1">
                      <input type="number" class="form-control" id="building-type-28" min="0" max="400" />
                    </div>
                  </div>
                  <div class="form-group">
                <div class="col-sm-offset-2 col-sm-2">
                  <button id="save-settings" type="submit" class="btn btn-success">
                    Speichern
                      </button>
                    </div>
                    <div class="col-sm-2">
                      <button id="reset-settings" type="button" class="btn btn-danger">
                        Zurücksetzen
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer" style="text-align: left">
      <div class="row">
        <div class="col-md-4">
          <p>
            <button id="reload-buildings" type="button" class="btn btn-xs btn-default" title="Gebäudedaten neu laden">
              <span class="glyphicon glyphicon-repeat"></span>
            </button>
            <strong>Stand Gebäude:</strong>
            <span id="building-state">
              <em>Daten werden geladen</em>
            </span>
            | <button id="reload-vehicles" type="button" class="btn btn-xs btn-default" title="Fahrzeugdaten neu laden">
            <span class="glyphicon glyphicon-repeat"></span>
          </button>
            <strong>Stand Fahrzeuge:</strong>
            <span id="vehicle-state">
              <em>Daten werden geladen</em>
            </span>
          </p>
        </div>
        <div id="footer-info" class="col-md-8">
          <div class="progress">
            <div id="progress-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0;">
              <span class="sr-only">0% Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`;
    document.body.appendChild(modal);
  }

  function resetProgressBar() {
    document.getElementById("footer-info").innerHTML = `<div class="progress">
            <div id="progress-bar" class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0;">
              <span class="sr-only">0% Complete</span>
            </div>
          </div>`;
  }

  function progressBarSuccess() {
    document.getElementById('progress-bar').classList.add('progress-bar-success');
  }

  function setProgressBarMaxValue(value) {
    resetProgressBar();
    document.getElementById("progress-bar").setAttribute("aria-valuemax", value);
  }

  function increaseProgressBarValue() {
    const progressBar = document.getElementById("progress-bar");
    const maxValue = parseInt(progressBar.getAttribute("aria-valuemax"));
    const currentValue = parseInt(progressBar.getAttribute("aria-valuenow"));
    const newValue = currentValue + 1;
    const progress = parseInt((newValue / maxValue) * 100);
    progressBar.setAttribute("aria-valuenow", newValue);
    progressBar.style.width = `${progress}%`;
    progressBar.innerHTML = `<span class="sr-only">${progress}% Complete</span>`;
  }

  function addStyle() {
    const style =
      ".loader{width:100px;height:100px;border-radius:100%;position:relative;margin:0 auto;top:40px;left:-2.5px}.loader span{display:inline-block;width:5px;height:20px;background-color:#c9302c}.loader span:first-child{animation:1s ease-in-out infinite grow}.loader span:nth-child(2){animation:1s ease-in-out .15s infinite grow}.loader span:nth-child(3){animation:1s ease-in-out .3s infinite grow}.loader span:nth-child(4){animation:1s ease-in-out .45s infinite grow}@keyframes grow{0%,100%{-webkit-transform:scaleY(1);-ms-transform:scaleY(1);-o-transform:scaleY(1);transform:scaleY(1)}50%{-webkit-transform:scaleY(1.8);-ms-transform:scaleY(1.8);-o-transform:scaleY(1.8);transform:scaleY(1.8)}}";

    const styleElement = document.createElement("style");
    styleElement.innerHTML = style;
    document.head.appendChild(styleElement);
  }

  function addMenuEntry() {
    const divider = document.createElement("li");
    divider.setAttribute("class", "divider");
    divider.setAttribute("role", "presentation");

    document.getElementById("logout_button").parentElement.parentElement.append(divider);

    const button = document.createElement("a");
    button.setAttribute("href", "javascript: void(0)");
    button.setAttribute("id", "building-and-fleet-manager-button");
    button.append(" Gebäude- und Fahrzeugverwalter");
    button.addEventListener("click", event => menuEntryClick(event));

    const li = document.createElement("li");
    li.appendChild(button);

    document.getElementById("logout_button").parentElement.parentElement.append(li);
  }

  async function menuEntryClick(event) {
    event.preventDefault();

    $("#building-and-fleet-manager-modal").modal("show");

    buildingTypes = await getBuildingTypes();
    vehiclePersonnelAllocations = await getVehiclePersonnelAllocations();
    buildings = await getBuildings();
    vehicles = await getVehicles();
  }

  async function getBuildingTypes() {
    return await fetch("https://api.lss-manager.de/de_DE/buildings")
      .then(res => res.json())
      .then(v =>
        Object.entries(v).map(([id, { caption, extensions }]) => ({
          id,
          caption,
          extensions: extensions.filter(Boolean).map(({ caption }, id) => ({ id, caption })),
        })),
      );
  }

  async function getVehiclePersonnelAllocations() {
    const vehicles = await fetch("https://api.lss-manager.de/de_DE/vehicles").then(res => res.json());

    return Object.keys(vehicles)
      .map(key => {
        const vehicle = vehicles[key];

        if (vehicle.isTrailer) {
          return null;
        }

        return {
          vehicleTypeId: parseInt(key, 10),
          vehicleTypeCaption: vehicle.caption,
          personnelCount: vehicle.maxPersonnel,
        };
      })
      .filter(vehicle => vehicle !== null);
  }

  function addEventListeners() {
    document.getElementById("reload-buildings").addEventListener("click", async () => {
      buildings = await getBuildings(true);
    });

    document.getElementById("reload-vehicles").addEventListener("click", async () => {
      vehicles = await getVehicles(true);
    });

    document.addEventListener("bos-ernie.gebaeude-fuhrpark-verwalter.building-state-changed", async function (event) {
      document.getElementById("building-state").innerHTML = event.detail;
    });

    document.addEventListener("bos-ernie.gebaeude-fuhrpark-verwalter.vehicle-state-changed", async function (event) {
      document.getElementById("vehicle-state").innerHTML = event.detail;
    });

    document.getElementById("filter-deviating-personnel-count-target").addEventListener("click", setFilter);
    document.getElementById("fix-personnel-set-point").addEventListener("click", fixPersonalCountTarget);
    document.getElementById("filter-missing-automatic-hiring").addEventListener("click", setFilter);
    document.getElementById("fix-automatic-hiring").addEventListener("click", startAutomaticHiring);
    document.getElementById("filter-missing-extensions").addEventListener("click", setFilter);
    document.getElementById("fix-missing-building-extensions").addEventListener("click", fixMissingBuildingExtensions);

    document.getElementById("save-settings").addEventListener("click", saveSettings);
    document.getElementById("reset-settings").addEventListener("click", resetSettings);
  }

  async function getBuildings(refresh = false) {
    const reloadBuildingsButton = document.getElementById("reload-buildings");
    reloadBuildingsButton.disabled = true;

    let buildings = await retrieveData(keyBuildings)
      .then(data => {
        return data;
      })
      .catch(() => {
        return null;
      });

    if (!buildings || refresh) {
      buildings = await updateBuildingsCache();
    }

    document.dispatchEvent(
      new CustomEvent("bos-ernie.gebaeude-fuhrpark-verwalter.building-state-changed", {
        detail: new Date(buildings.lastUpdate).toLocaleString(),
      }),
    );

    operationalReadiness();

    renderBuildingsTab(buildings.data);

    reloadBuildingsButton.disabled = false;

    return buildings.data;
  }

  async function updateBuildingsCache() {
    document.dispatchEvent(
      new CustomEvent("bos-ernie.gebaeude-fuhrpark-verwalter.building-state-changed", {
        detail: "<em>Daten werden geladen ...</em>",
      }),
    );

    const buildings = await fetch("/api/buildings.json", {
      cache: "reload",
    }).then(response => response.json());
    const lastUpdate = new Date();
    const buildingsCache = { lastUpdate: lastUpdate.getTime(), data: await prepareBuildingData(buildings) };

    storeData(buildingsCache, keyBuildings).catch(error =>
      console.error("[Gebäude- & Fuhrparkverwalter] Fehler beim Speichern der Gebäudedaten", error),
    );

    return buildingsCache;
  }

  /**
   * @todo Provide a more suitable function name
   */
  async function prepareBuildingData(buildings) {
    const personnelSetPointSettings = await getPersonnelSetPointSettings();

    const controlCenters = buildings.filter(building => building.building_type === 7);

    buildings.forEach(building => {
      let controlCenter = null;
      if (building.leitstelle_building_id) {
        controlCenter = controlCenters.find(controlCenter => controlCenter.id === building.leitstelle_building_id);
      }

      let personnelSetPoint = null;
      let targetPersonnelSet = null;
      let automaticHiringSet = null;
      const pseudoBuildingTypeId = pseudoBuildingTypeIdMapping.find(
        entry => entry.buildingTypeId === building.building_type && entry.smallBuilding === building.small_building,
      ).id;
      if (buildingsWithPersonal.includes(building.building_type)) {
        personnelSetPoint = personnelSetPointSettings["building-type-" + pseudoBuildingTypeId];
        targetPersonnelSet = building.personal_count_target === parseInt(personnelSetPoint);
        automaticHiringSet = building.hiring_automatic === true;
      }

      building.controlCenter = controlCenter;
      building.personnelSetPoint = personnelSetPoint;
      building.targetPersonnelSet = targetPersonnelSet;
      building.automaticHiringSet = automaticHiringSet;
      building.pseudoBuildingTypeId = pseudoBuildingTypeId;
      building.missingRequiredExtensions = hasMissingExtensions(building);
    });

    buildingsWithIncorrectPersonalCountTarget = buildings.filter(building => building.targetPersonnelSet === false);
    buildingsWithoutAutomaticHiring = buildings.filter(building => building.automaticHiringSet === false);
    buildingsWithMissingExtensions = buildings.filter(building => building.missingRequiredExtensions);

    return buildings;
  }

  function hasMissingExtensions(building) {
    if (building.building_type !== 11) {
      return false;
    }

    const requiredExtensions = requiredExtensionsPerBuildingType.find(
      buildingType => buildingType.pseudoBuildingTypeId === building.pseudoBuildingTypeId,
    );

    if (!requiredExtensions) {
      return false;
    }

    return requiredExtensions.extensions.some(
      requiredExtensionId => !building.extensions.some(extension => extension.type_id === requiredExtensionId),
    );
  }

  async function getVehicles(refresh = false) {
    const reloadVehiclesButton = document.getElementById("reload-vehicles");
    reloadVehiclesButton.disabled = true;

    let vehicles = await retrieveData(keyVehicles)
      .then(data => {
        if (data) {
          return data;
        }
        return null;
      })
      .catch(error => console.error("[Gebäude- & Fuhrparkverwalter] Fehler beim Laden der Fahrzeugdaten", error));

    if (!vehicles || refresh) {
      vehicles = await updateVehiclesCache();
    }

    document.dispatchEvent(
      new CustomEvent("bos-ernie.gebaeude-fuhrpark-verwalter.vehicle-state-changed", {
        detail: new Date(vehicles.lastUpdate).toLocaleString(),
      }),
    );

    tractiveVehicles();
    personnelAllocation();

    reloadVehiclesButton.disabled = false;

    return vehicles.data;
  }

  async function updateVehiclesCache() {
    document.dispatchEvent(
      new CustomEvent("bos-ernie.gebaeude-fuhrpark-verwalter.vehicle-state-changed", {
        detail: "<em>Daten werden geladen ...</em>",
      }),
    );

    let vehicles = [];
    let nextPage = null;
    let page = 0;
    let totalPages = null;

    do {
      page++;

      document.dispatchEvent(
        new CustomEvent("bos-ernie.gebaeude-fuhrpark-verwalter.vehicle-state-changed", {
          detail: `Lade Fahrzeuge Seite ${page} von ${totalPages || "?"}...`,
        }),
      );

      if (page === 1) {
        nextPage = "/api/v2/vehicles";
      }

      const response = await fetch(nextPage, {
        cache: "reload",
      }).then(response => response.json());

      vehicles = vehicles.concat(
        response.result.map(vehicle => ({
          id: vehicle.id,
          caption: vehicle.caption,
          building_id: vehicle.building_id,
          vehicle_type: vehicle.vehicle_type,
          assigned_personnel_count: vehicle.assigned_personnel_count,
          tractive_vehicle_id: vehicle.tractive_vehicle_id,
        })),
      );

      nextPage = response.paging.next_page;

      if (totalPages === null) {
        totalPages = Math.ceil(response.paging.count_total / 10000);
      }
    } while (nextPage);

    const lastUpdate = new Date();
    const vehiclesCache = { lastUpdate: lastUpdate.getTime(), data: vehicles };

    storeData(vehiclesCache, keyVehicles).catch(error =>
      console.error("[Gebäude- & Fuhrparkverwalter] Fehler beim Speichern der Fahrzeugdaten", error),
    );

    return vehiclesCache;
  }

  function vehiclesByType(typeId) {
    return vehicles.filter(vehicle => vehicle.vehicle_type === typeId);
  }

  function saveSettings(event) {
    event.preventDefault();

    const saveButton = document.getElementById("save-settings");

    saveButton.disabled = true;

    saveButton.innerHTML = `
    <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
    Speichern...`;

    const settings = { personnelSetPoint: {} };
    const inputs = document.querySelectorAll("#settings input");
    for (let i = 0; i < inputs.length; i++) {
      settings.personnelSetPoint[inputs[i].id] = inputs[i].value;
    }
    setSettings(settings);

    setTimeout(() => {
      saveButton.disabled = false;
      saveButton.innerHTML = '<span class="glyphicon glyphicon-ok"></span> Speichern';
    }, 250);
  }

  function setSettings(newSettings) {
    storeData(newSettings, keySettings);
    settings = newSettings;
  }

  async function loadSettings() {
    settings = await retrieveData(keySettings).then(data => {
      if (data) {
        return data;
      }
      return null;
    });
  }

  async function getPersonnelSetPointSettings() {
    if (settings === null || settings === undefined) {
      await loadSettings();
    }

    return settings["personnelSetPoint"];
  }

  function renderBuildingsTab(buildings) {
    document.getElementById("number-of-deviating-personnel-count-target").innerHTML =
      buildingsWithIncorrectPersonalCountTarget.length.toLocaleString();

    document.getElementById("number-of-missing-automatic-hiring").innerHTML =
      buildingsWithoutAutomaticHiring.length.toLocaleString();

    document.getElementById("number-of-buildings-with-missing-extensions").innerHTML =
      buildingsWithMissingExtensions.length.toLocaleString();

    renderBuildingsTable(buildings);
  }

  function renderBuildingsTable(buildings) {
    function createTableHeader(value) {
      const th = document.createElement("th");
      th.innerHTML = value;

      return th;
    }

    function createTableRow(building) {
      const tr = document.createElement("tr");
      tr.setAttribute("data-building-id", building.id);

      function createTableCell(value) {
        const td = document.createElement("td");

        if (value instanceof HTMLElement) {
          td.appendChild(value);
        } else {
          td.innerHTML = value;
        }

        return td;
      }

      function createBuildingLink(building) {
        if (building === null) {
          return null;
        }

        const buildingLink = document.createElement("a");
        buildingLink.href = `/buildings/${building.id}`;
        buildingLink.innerHTML = building.caption;
        buildingLink.target = "_blank";

        return buildingLink;
      }

      function renderBuildingCellContent(building) {
        const buildingLink = createBuildingLink(building);
        const controlCenterLink = createBuildingLink(building.controlCenter);

        const small = document.createElement("small");
        small.innerText = buildingTypes.find(buildingType => buildingType.id === building.pseudoBuildingTypeId).caption;
        if (controlCenterLink !== null) {
          small.appendChild(document.createTextNode(" | "));
          small.appendChild(controlCenterLink);
        }

        const div = document.createElement("div");
        div.appendChild(buildingLink);
        div.appendChild(document.createElement("br"));
        div.appendChild(small);

        return div;
      }

      function createLabel(type, text) {
        const badge = document.createElement("span");
        badge.setAttribute("class", "label label-" + type);
        badge.innerHTML = text;

        return badge;
      }

      function createExtensionLabel(extensionDefinition, isRequired, buildingExtensions) {
        const extension = buildingExtensions.find(extension => extension.type_id === extensionDefinition.id);

        /**
         * Label types:
         * default: extension is not found in buildingExtensions and not required
         * warning: extension is not found in buildingExtensions and required
         * primary: extension is found in buildingExtensions and being built
         * success: extension is found in buildingExtensions and available
         */
        let type = "";
        let title = extensionDefinition.caption;
        if (extension === undefined) {
          type = isRequired ? "warning" : "default";
        } else {
          type = extension.available_at ? "primary" : "success";

          if (extension.available_at) {
            title += ` (verfügbar ab ${extension.available_at})`;
          }
        }

        const badge = document.createElement("span");
        badge.setAttribute("class", "label label-" + type);
        badge.innerHTML = extensionDefinition.id;
        badge.title = title;

        return badge;
      }

      let personnelSetPointLabel = null;
      if (building.targetPersonnelSet !== null) {
        personnelSetPointLabel = createLabel(
          building.targetPersonnelSet ? "success" : "warning",
          `${building.personal_count_target} / ${building.personnelSetPoint}`,
        );
      }

      let automaticHiringLabel = null;
      if (building.automaticHiringSet !== null) {
        automaticHiringLabel = createLabel(
          building.automaticHiringSet ? "success" : "warning",
          building.automaticHiringSet ? "Ja" : "Nein",
        );
      }

      let extensions = null;
      const buildingTypeDefinition = buildingTypes.find(
        buildingType => buildingType.id === building.pseudoBuildingTypeId,
      );

      if (buildingTypeDefinition.extensions.length > 0) {
        const requiredExtensions = requiredExtensionsPerBuildingType.find(
          buildingType => buildingType.pseudoBuildingTypeId === building.pseudoBuildingTypeId,
        );

        extensions = document.createElement("div");

        buildingTypeDefinition.extensions.forEach(extensionDefinition => {
          const isRequired = requiredExtensions.extensions.includes(extensionDefinition.id);
          extensions.appendChild(createExtensionLabel(extensionDefinition, isRequired, building.extensions));
        });
      }

      tr.appendChild(createTableCell(renderBuildingCellContent(building)));
      tr.appendChild(createTableCell(personnelSetPointLabel));
      tr.appendChild(createTableCell(automaticHiringLabel));
      tr.appendChild(createTableCell(extensions));

      return tr;
    }

    const headerRow = document.createElement("tr");
    headerRow.appendChild(createTableHeader("Gebäude"));
    headerRow.appendChild(createTableHeader("Soll-Personal"));
    headerRow.appendChild(createTableHeader("Automatisches Werben"));
    headerRow.appendChild(createTableHeader("Ausbauten"));

    const thead = document.createElement("thead");
    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");
    buildings.forEach(building => {
      tbody.appendChild(createTableRow(building));
    });

    const table = document.createElement("table");
    table.setAttribute("id", "building-table");
    table.setAttribute("class", "table table-striped table-hover table-condensed table-responsive");
    table.appendChild(thead);
    table.appendChild(tbody);

    const buildingTable = document.getElementById("building-table");
    buildingTable.parentNode.replaceChild(table, buildingTable);
  }

  function operationalReadiness() {
    function disableButtons() {
      document.querySelectorAll(".operation-readiness").forEach(button => {
        button.disabled = true;
      });
    }

    function enableButtons() {
      document.querySelectorAll(".operation-readiness").forEach(button => {
        button.disabled = false;
      });
    }

    async function toggleBuilding(event) {
      event.preventDefault();

      const button = event.target;

      const buildingTypeId = button.getAttribute("data-building-type-id");
      const mode = button.getAttribute("data-mode");
      const enabledState = mode !== "enable";

      disableButtons();

      const buildings = getBuildingsByPseudoBuildingsTypeIdWithEnabledState(buildingTypeId, enabledState);

      if (buildings.length === 0) {
        return;
      }

      setProgressBarMaxValue(buildings.length);

      let numberOfUpdatedBuildings = 0;
      for (const building of buildings) {
        try {
          const response = await fetch(`/buildings/${building.id}/active`, { redirect: "manual" });

          if (!response.status >= 400) {
            console.error(`[Gebäude- & Fuhrparkverwalter] toggleBuilding: ${building.id} to ${mode}`);
          }
        } catch (e) {
          console.error(`[Gebäude- & Fuhrparkverwalter] toggleBuilding: ${building.id} to ${mode} - error: ${e.message}`);
        }

        increaseProgressBarValue();
        numberOfUpdatedBuildings++;
        setTimeout(() => {
        }, 150);
      }

      if (numberOfUpdatedBuildings > 0) {
        const infoSignIcon = document.createElement("span");
        infoSignIcon.classList.add("glyphicon");
        infoSignIcon.classList.add("glyphicon-info-sign");
        infoSignIcon.setAttribute("title", "Daten nicht aktuell");

        const buildingState = document.getElementById("building-state");
        buildingState.appendChild(document.createTextNode(" "));
        buildingState.appendChild(infoSignIcon);
      }

      enableButtons();
    }

    async function toggleExtension(event) {
      event.preventDefault();

      const button = event.target;

      const buildingTypeId = button.getAttribute("data-building-type-id");
      const extensionId = parseInt(button.getAttribute("data-extension-id"));
      const mode = button.getAttribute("data-mode");
      const enabledState = mode !== "enable";

      disableButtons();

      const buildings = getBuildingsWithExtensionsByPseudoBuildingsTypeIdAndEnabledState(
        buildingTypeId,
        extensionId,
        enabledState,
      );

      if (buildings.length === 0) {
        return;
      }

      setProgressBarMaxValue(buildings.length);

      const csrfToken = document.querySelector("meta[name=csrf-token]").getAttribute("content");
      const formData = new FormData();
      formData.append("_method", "post");
      formData.append("authenticity_token", csrfToken);

      let numberOfUpdatedBuildings = 0;
      for (const building of buildings) {
        try {
          const response = await fetch(`/buildings/${building.id}/extension_ready/${extensionId}/${building.id}`, {
            method: "POST",
            "content-type": "application/x-www-form-urlencoded",
            headers: {
              "x-csrf-token": csrfToken.content,
              "x-requested-with": "XMLHttpRequest",
            },
            body: new URLSearchParams(formData),
            redirect: "manual",
          });

          if (!response.status >= 400) {
            console.error(
              `[Gebäude- & Fuhrparkverwalter] toggleExtension: ${building.id} to ${mode}`,
            );
          }
        } catch (e) {
          console.error(
            `[Gebäude- & Fuhrparkverwalter] toggleExtension: ${building.id} to ${mode} - error: ${e.message}`,
          );
        }

        increaseProgressBarValue();
        numberOfUpdatedBuildings++;
        setTimeout(() => {
        }, 150);
      }

      // Enable/disable extension: POST /buildings/{building-id}/extension_ready/{extension-type-id}/{building-id}
      enableButtons();
    }

    const div = document.createElement("div");

    const infoAlert = document.createElement("div");
    infoAlert.className = "alert alert-info";
    infoAlert.innerHTML =
      '<p><strong><span class="glyphicon glyphicon-info-sign"></span></strong> Diese Funktion ist experimentell und klemmt manchmal. Es sind weitere Optimierungen notwendig.</p>';
    div.appendChild(infoAlert);

    buildingTypes.forEach(buildingType => {
      const numberOfBuildings = getNumberOfBuildingsByPseudoBuildingTypeId(buildingType.id);
      const buildingTypeHeader = document.createElement("h3");
      buildingTypeHeader.innerText = buildingType.caption;
      div.appendChild(buildingTypeHeader);

      const numberOfEnabledBuildings = getNumberOfEnabledBuildingsByPseudoBuildingTypeId(buildingType.id);
      const allEnabled = numberOfEnabledBuildings === numberOfBuildings;
      const noneEnable = numberOfEnabledBuildings === 0;

      const buildingTypeCounter = document.createElement("span");
      buildingTypeCounter.innerText = numberOfEnabledBuildings + "/" + numberOfBuildings;
      div.appendChild(buildingTypeCounter);

      const buildingEnableButton = document.createElement("button");
      buildingEnableButton.innerText = "Aktivieren";
      buildingEnableButton.setAttribute("class", "btn btn-xs btn-success operation-readiness");
      buildingEnableButton.setAttribute("data-building-type-id", buildingType.id);
      buildingEnableButton.setAttribute("data-mode", "enable");
      buildingEnableButton.addEventListener("click", toggleBuilding);
      if (allEnabled) {
        buildingEnableButton.disabled = true;
      }

      const buildingDisableButton = document.createElement("button");
      buildingDisableButton.innerText = "Deaktivieren";
      buildingDisableButton.setAttribute("class", "btn btn-xs btn-danger operation-readiness");
      buildingDisableButton.setAttribute("data-building-type-id", buildingType.id);
      buildingDisableButton.setAttribute("data-mode", "disable");
      buildingDisableButton.addEventListener("click", toggleBuilding);
      if (noneEnable) {
        buildingDisableButton.disabled = true;
      }

      const buildingButtonGroup = document.createElement("div");
      buildingButtonGroup.setAttribute("class", "btn-group");
      buildingButtonGroup.setAttribute("style", "float: right;");
      buildingButtonGroup.appendChild(buildingEnableButton);
      buildingButtonGroup.appendChild(buildingDisableButton);
      div.appendChild(buildingButtonGroup);

      const table = document.createElement("table");
      table.setAttribute("class", "table table-striped table-hover table-condensed table-responsive");
      div.appendChild(table);

      const tableHeader = document.createElement("thead");
      table.appendChild(tableHeader);

      const tableHeaderRow = document.createElement("tr");
      tableHeader.appendChild(tableHeaderRow);

      const thCaption = document.createElement("th");
      thCaption.innerText = "Erweiterung";
      tableHeaderRow.appendChild(thCaption);

      const thInfo = document.createElement("th");
      thInfo.innerText = "Aktiv / Gesamt";
      tableHeaderRow.appendChild(thInfo);

      const thButtonGroup = document.createElement("th");
      tableHeaderRow.appendChild(thButtonGroup);

      const tableBody = document.createElement("tbody");
      table.appendChild(tableBody);

      buildingType.extensions.forEach(extension => {
        const numberOfEnabledExtensions = getNumberOfEnabledExtensionsByPseudoBuildingTypeIdAndExtensionId(
          buildingType.id,
          extension.id
        );
        const numberOfDisabledExtensions = getNumberOfDisabledExtensionsByPseudoBuildingTypeIdAndExtensionId(buildingType.id, extension.id);
        const totalExtensions = numberOfEnabledExtensions + numberOfDisabledExtensions;
        const allEnabled = numberOfDisabledExtensions === 0;
        const noneEnable = numberOfEnabledExtensions === 0;

        const extensionEnableButton = document.createElement("button");
        extensionEnableButton.innerText = "Aktivieren";
        extensionEnableButton.setAttribute("class", "btn btn-success btn-xs operation-readiness");
        extensionEnableButton.setAttribute("data-building-type-id", buildingType.id);
        extensionEnableButton.setAttribute("data-extension-id", extension.id);
        extensionEnableButton.setAttribute("data-mode", "enable");
        extensionEnableButton.addEventListener("click", toggleExtension);
        if (allEnabled) {
          extensionEnableButton.disabled = true;
        }

        const extensionDisableButton = document.createElement("button");
        extensionDisableButton.innerText = "Deaktivieren";
        extensionDisableButton.setAttribute("class", "btn btn-danger btn-xs operation-readiness");
        extensionDisableButton.setAttribute("data-building-type-id", buildingType.id);
        extensionDisableButton.setAttribute("data-extension-id", extension.id);
        extensionDisableButton.setAttribute("data-mode", "disable");
        extensionDisableButton.addEventListener("click", toggleExtension);
        if (noneEnable) {
          extensionDisableButton.disabled = true;
        }

        const extensionButtonGroup = document.createElement("div");
        extensionButtonGroup.setAttribute("class", "btn-group");
        extensionButtonGroup.appendChild(extensionEnableButton);
        extensionButtonGroup.appendChild(extensionDisableButton);

        const tableRow = document.createElement("tr");
        tableBody.appendChild(tableRow);

        const tdCaption = document.createElement("td");
        tdCaption.innerText = extension.caption;
        tableRow.appendChild(tdCaption);

        const tdInfo = document.createElement("td");
        tdInfo.classList.add("text-right");
        tdInfo.innerText = numberOfEnabledExtensions + "/" + totalExtensions;
        tableRow.appendChild(tdInfo);

        const tdStatus = document.createElement("td");
        tdStatus.classList.add("text-center");
        tdStatus.appendChild(extensionButtonGroup);
        tableRow.appendChild(tdStatus);
      });
    });

    const panel = document.getElementById("operational-readiness-panel");
    panel.innerHTML = "";
    panel.appendChild(div);
  }












  function renderVehiclesTab(vehicles) {
    document.getElementById('vehicle-status-6-count').innerText = vehiclesInStatus6.length.toLocaleString();
    document.getElementById('max-personnel-override-count').innerText = vehiclesWithOverridenMaxPersonnel.length.toLocaleString();

    renderVehiclesTable(vehicles);
  }

  function renderVehiclesTable(vehicles) {
    function createTableHeader(value) {
      const th = document.createElement("th");
      th.innerHTML = value;

      return th;
    }

    function createTableRow(vehicle) {
      const tr = document.createElement("tr");
      tr.setAttribute("data-vehicle-id", vehicle.id);

      function createTableCell(value) {
        const td = document.createElement("td");

        if (value instanceof HTMLElement) {
          td.appendChild(value);
        } else {
          td.innerHTML = value;
        }

        return td;
      }

      function createBuildingLink(building) {
        if (building === null) {
          return null;
        }

        const buildingLink = document.createElement("a");
        buildingLink.href = `/buildings/${building.id}`;
        buildingLink.innerHTML = building.caption;
        buildingLink.target = "_blank";

        return buildingLink;
      }

      function renderBuildingCellContent(building) {
        const buildingLink = createBuildingLink(building);
        const controlCenterLink = createBuildingLink(building.controlCenter);

        const small = document.createElement("small");
        small.innerText = buildingTypes.find(buildingType => buildingType.id === building.pseudoBuildingTypeId).caption;
        if (controlCenterLink !== null) {
          small.appendChild(document.createTextNode(" | "));
          small.appendChild(controlCenterLink);
        }

        const div = document.createElement("div");
        div.appendChild(buildingLink);
        div.appendChild(document.createElement("br"));
        div.appendChild(small);

        return div;
      }

      function createLabel(type, text) {
        const badge = document.createElement("span");
        badge.setAttribute("class", "label label-" + type);
        badge.innerHTML = text;

        return badge;
      }

      function createExtensionLabel(extensionDefinition, isRequired, buildingExtensions) {
        const extension = buildingExtensions.find(extension => extension.type_id === extensionDefinition.id);

        /**
         * Label types:
         * default: extension is not found in buildingExtensions and not required
         * warning: extension is not found in buildingExtensions and required
         * primary: extension is found in buildingExtensions and being built
         * success: extension is found in buildingExtensions and available
         */
        let type = "";
        let title = extensionDefinition.caption;
        if (extension === undefined) {
          type = isRequired ? "warning" : "default";
        } else {
          type = extension.available_at ? "primary" : "success";

          if (extension.available_at) {
            title += ` (verfügbar ab ${extension.available_at})`;
          }
        }

        const badge = document.createElement("span");
        badge.setAttribute("class", "label label-" + type);
        badge.innerHTML = extensionDefinition.id;
        badge.title = title;

        return badge;
      }

      let personnelSetPointLabel = null;
      if (building.targetPersonnelSet !== null) {
        personnelSetPointLabel = createLabel(
          building.targetPersonnelSet ? "success" : "warning",
          `${building.personal_count_target} / ${building.personnelSetPoint}`,
        );
      }

      let automaticHiringLabel = null;
      if (building.automaticHiringSet !== null) {
        automaticHiringLabel = createLabel(
          building.automaticHiringSet ? "success" : "warning",
          building.automaticHiringSet ? "Ja" : "Nein",
        );
      }

      let extensions = null;
      const buildingTypeDefinition = buildingTypes.find(
        buildingType => buildingType.id === building.pseudoBuildingTypeId,
      );

      if (buildingTypeDefinition.extensions.length > 0) {
        const requiredExtensions = requiredExtensionsPerBuildingType.find(
          buildingType => buildingType.pseudoBuildingTypeId === building.pseudoBuildingTypeId,
        );

        extensions = document.createElement("div");

        buildingTypeDefinition.extensions.forEach(extensionDefinition => {
          const isRequired = requiredExtensions.extensions.includes(extensionDefinition.id);
          extensions.appendChild(createExtensionLabel(extensionDefinition, isRequired, building.extensions));
        });
      }

      tr.appendChild(createTableCell(renderBuildingCellContent(building)));
      tr.appendChild(createTableCell(personnelSetPointLabel));
      tr.appendChild(createTableCell(automaticHiringLabel));
      tr.appendChild(createTableCell(extensions));

      return tr;
    }

    const headerRow = document.createElement("tr");
    headerRow.appendChild(createTableHeader("Gebäude"));
    headerRow.appendChild(createTableHeader("Soll-Personal"));
    headerRow.appendChild(createTableHeader("Automatisches Werben"));
    headerRow.appendChild(createTableHeader("Ausbauten"));

    const thead = document.createElement("thead");
    thead.appendChild(headerRow);

    const tbody = document.createElement("tbody");
    buildings.forEach(building => {
      tbody.appendChild(createTableRow(building));
    });

    const table = document.createElement("table");
    table.setAttribute("id", "building-table");
    table.setAttribute("class", "table table-striped table-hover table-condensed table-responsive");
    table.appendChild(thead);
    table.appendChild(tbody);

    const buildingTable = document.getElementById("building-table");
    buildingTable.parentNode.replaceChild(table, buildingTable);
  }

  function tractiveVehicles() {
    const tractiveVehicleConfiguration = [
      {
        trailerVehicleTypeId: 70,
        trailerVehicleTypeName: "MZB",
        tractiveVehicleTypeId: 64,
        tractiveVehicleTypeName: "GW-Wasserrettung",
        targetDivId: "tractive-vehicles-panel-mzb",
      },
      {
        trailerVehicleTypeId: 43,
        trailerVehicleTypeName: "BRmG R",
        tractiveVehicleTypeId: 42,
        tractiveVehicleTypeName: "LKW K 9",
        targetDivId: "tractive-vehicles-panel-brmgr",
      },
      {
        trailerVehicleTypeId: 44,
        trailerVehicleTypeName: "Anh DLE",
        tractiveVehicleTypeId: 45,
        tractiveVehicleTypeName: "MLW 5",
        targetDivId: "tractive-vehicles-panel-anhdle",
      },
      {
        trailerVehicleTypeId: 101,
        trailerVehicleTypeName: "Anh SwPu",
        tractiveVehicleTypeId: 100,
        tractiveVehicleTypeName: "MLW 4",
        targetDivId: "tractive-vehicles-panel-anhswpu",
      },
      {
        trailerVehicleTypeId: 102,
        trailerVehicleTypeName: "Anh 7",
        tractiveVehicleTypeId: 123,
        tractiveVehicleTypeName: "LKW 7 Lbw (FGr WP)",
        targetDivId: "tractive-vehicles-panel-anh7",
      },
      {
        trailerVehicleTypeId: 110,
        trailerVehicleTypeName: "NEA50 (THW)",
        tractiveVehicleTypeId: 41,
        tractiveVehicleTypeName: "MzGW (FGr N)",
        targetDivId: "tractive-vehicles-panel-nea50",
      },
      {
        trailerVehicleTypeId: 112,
        trailerVehicleTypeName: "NEA200 (THW)",
        tractiveVehicleTypeId: 122,
        tractiveVehicleTypeName: "LKW 7 Lbw (FGr E)",
        targetDivId: "tractive-vehicles-panel-nea200",
      },
      {
        trailerVehicleTypeId: 132,
        trailerVehicleTypeName: "FKH-SEG",
        tractiveVehicleTypeId: 133,
        tractiveVehicleTypeName: "Bt LKW",
        targetDivId: "tractive-vehicles-panel-FKH-SEG",
      },
      {
        trailerVehicleTypeId: 155,
        trailerVehicleTypeName: "Anh Höhenrettung",
        tractiveVehicleTypeId: 150,
        tractiveVehicleTypeName: "GW Bergrettung",
        targetDivId: "tractive-vehicles-panel-Anh-Höhenrettung",
      },
    ];

    function checkTractiveVehicles(vehicleTypeTrailer, vehicleTypeTractiveVehicle) {
      const trailers = vehicles.filter(vehicle => vehicle.vehicle_type === vehicleTypeTrailer);

      const trailersWithoutTractiveVehicle = trailers.filter(trailer => trailer.tractive_vehicle_id === null);

      const trailerWithTractiveVehicle = trailers.filter(trailer => trailer.tractive_vehicle_id !== null);

      const tractiveVehicles = vehicles.filter(vehicle => vehicle.vehicle_type === vehicleTypeTractiveVehicle);
      const trailerWithFalseTractiveVehicle = trailerWithTractiveVehicle.filter(trailer => {
        return !tractiveVehicles.some(tractiveVehicle => {
          return tractiveVehicle.id === trailer.tractive_vehicle_id;
        });
      });

      return [...trailersWithoutTractiveVehicle, ...trailerWithFalseTractiveVehicle];
    }

    function render() {
      const description = document.createElement("p");
      description.innerHTML =
        "<p>Dieser Tab zeigt alle Anhänger, die ein falsches Zugfahrzeug zugewiesen haben. Es kann jedoch nicht überprüft werden, ob nachträglich das Häkchen <em>Zufälliges Zugfahrzeug</em> gesetzt wurde.<br />Folgende Zugfahrzeuge werden erwartet (evtl. zu einem späteren Zeitpunkt konfigurierbar).</p>" +
        "<ul>" +
        "<li><strong>MZB:</strong> GW-Wasserrettung</li>" +
        "<li><strong>BRmG R:</strong> LKW K 9</li>" +
        "<li><strong>Anh DLE:</strong> MLW 5</li>" +
        "<li><strong>Anh SwPu:</strong> MLW 4</li>" +
        "<li><strong>Anh 7:</strong> LKW 7 Lbw (FGr WP)</li>" +
        "<li><strong>NEA50 (THW):</strong> MzGW (FGr N)</li>" +
        "<li><strong>NEA200 (THW):</strong> LKW 7 Lbw</li>" +
        "<li><strong>FKH-SEG:</strong> Bt LKW</li>" +
        "<li><strong>Anh Höhenrettung:</strong> GW Bergrettung</li>" +
        "</ul>";

      const navTabsUl = document.createElement("ul");
      navTabsUl.className = "nav nav-tabs";
      navTabsUl.setAttribute("role", "tablist");

      const tabContentDiv = document.createElement("div");
      tabContentDiv.className = "tab-content";

      let firstConfiguration = true;
      tractiveVehicleConfiguration.forEach(configuration => {
        const trailersWithIncorrectTractiveVehicle = checkTractiveVehicles(
          configuration.trailerVehicleTypeId,
          configuration.tractiveVehicleTypeId,
        );

        const a = document.createElement("a");
        a.className = "nav-link";
        a.href = "#" + configuration.targetDivId;
        a.setAttribute("data-toggle", "tab");
        a.innerText = configuration.trailerVehicleTypeName + " (" + trailersWithIncorrectTractiveVehicle.length + ")";

        const li = document.createElement("li");
        li.className = "nav-item";
        li.appendChild(a);
        navTabsUl.appendChild(li);
        if (firstConfiguration) {
          li.className = "nav-item active";
        }

        const div = document.createElement("div");
        div.className = "tab-pane";
        div.id = configuration.targetDivId;
        div.setAttribute("role", "tabpanel");
        if (firstConfiguration) {
          div.className = "tab-pane active";
          firstConfiguration = false;
        }

        if (trailersWithIncorrectTractiveVehicle.length > 0) {
          const table = document.createElement("table");
          table.className = "table table-striped table-hover";
          const thead = document.createElement("thead");
          const tbody = document.createElement("tbody");
          table.appendChild(thead);
          table.appendChild(tbody);
          div.appendChild(table);

          const tr = document.createElement("tr");
          thead.appendChild(tr);
          const th = document.createElement("th");
          th.innerText = "Fahrzeug";
          tr.appendChild(th);

          trailersWithIncorrectTractiveVehicle.forEach(vehicle => {
            const tr = document.createElement("tr");
            tbody.appendChild(tr);
            const td = document.createElement("td");
            tr.appendChild(td);
            const a = document.createElement("a");
            a.href = "/vehicles/" + vehicle.id + "/edit";
            a.setAttribute("target", "_blank");
            a.innerText = vehicle.caption;
            td.appendChild(a);
          });
        } else {
          const successAlert = document.createElement("div");
          successAlert.className = "alert alert-success";
          successAlert.innerHTML =
            '<span class="glyphicon glyphicon-ok"></span> Alle Anhänger haben das richtige Zugfahrzeug.';
          div.appendChild(successAlert);
        }

        tabContentDiv.appendChild(div);
      });

      const tractiveVehiclesPanel = document.getElementById("tractive-vehicles-panel");
      tractiveVehiclesPanel.innerHTML = "";
      tractiveVehiclesPanel.appendChild(description);
      tractiveVehiclesPanel.appendChild(navTabsUl);
      tractiveVehiclesPanel.appendChild(tabContentDiv);
    }

    render();
  }

  function personnelAllocation() {
    function checkPersonnelAllocations() {
      const vehiclesWithIncorrectPersonnelAllocation = [];
      vehiclePersonnelAllocations.forEach(vehiclePersonnelAllocation => {
        const vehicles = vehiclesByType(vehiclePersonnelAllocation.vehicleTypeId);

        vehicles.forEach(vehicle => {
          if (
            vehicle.assigned_personnel_count === null ||
            vehicle.assigned_personnel_count !== vehiclePersonnelAllocation.personnelCount
          ) {
            vehiclesWithIncorrectPersonnelAllocation.push(vehicle);
          }
        });
      });

      return vehiclesWithIncorrectPersonnelAllocation;
    }

    function render() {
      const vehiclesWithIncorrectPersonnelAllocation = checkPersonnelAllocations();
      const vehiclesAllocationPanel = document.getElementById("personnel-allocation-panel");
      vehiclesAllocationPanel.innerHTML = "";
      if (vehiclesWithIncorrectPersonnelAllocation.length > 0) {
        const description = document.createElement("div");
        description.innerHTML =
          "<p>Listet Fahrzeuge auf, deren zugewiesenes Personal von der gewünschten Anzahl abweicht. Die jeweilige " +
          "Ausbildung des Personals wird nicht überprüft. Es wird auf Maximalwert überprüft, siehe <a " +
          "href='https://api.lss-manager.de/de_DE/vehicles' target='_blank'>LSSM-API</a>.</p>";
        vehiclesAllocationPanel.appendChild(description);

        const allocationInfo = document.createElement("div");
        allocationInfo.innerHTML =
          "<p>Aktuell sind " +
          vehiclesWithIncorrectPersonnelAllocation.length +
          " Fahrzeuge falsch zugewiesen. Ein Klick auf den Fahrzeugnamen führt direkt zur Personalzuweisungsseite, " +
          "wo eine Korrektur durchgeführt werden kann.</p>";
        vehiclesAllocationPanel.appendChild(allocationInfo);

        const table = document.createElement("table");
        table.className = "table table-striped table-hover";
        const thead = document.createElement("thead");
        const tbody = document.createElement("tbody");
        table.appendChild(thead);
        table.appendChild(tbody);
        vehiclesAllocationPanel.appendChild(table);

        const tr = document.createElement("tr");
        thead.appendChild(tr);

        const th1 = document.createElement("th");
        th1.innerText = "Fahrzeug";
        tr.appendChild(th1);

        const th2 = document.createElement("th");
        th2.innerText = "Erwartet";
        tr.appendChild(th2);

        const th3 = document.createElement("th");
        th3.innerText = "Aktuell";
        tr.appendChild(th3);

        vehiclesWithIncorrectPersonnelAllocation.forEach(vehicle => {
          const tr = document.createElement("tr");
          tbody.appendChild(tr);

          const td1 = document.createElement("td");
          tr.appendChild(td1);

          const a = document.createElement("a");
          a.href = "/vehicles/" + vehicle.id + "/zuweisung";
          a.setAttribute("target", "_blank");
          a.innerText = vehicle.caption;
          td1.appendChild(a);

          const td2 = document.createElement("td");
          td2.innerText = vehiclePersonnelAllocations.find(
            vehiclePersonnelAllocation => vehiclePersonnelAllocation.vehicleTypeId === vehicle.vehicle_type,
          ).personnelCount;
          tr.appendChild(td2);

          const td3 = document.createElement("td");
          td3.innerText = vehicle.assigned_personnel_count === null ? "0" : vehicle.assigned_personnel_count;
          tr.appendChild(td3);
        });
      } else {
        const successAlert = document.createElement("div");
        successAlert.className = "alert alert-success";
        successAlert.innerHTML =
          '<span class="glyphicon glyphicon-ok"></span> Alle Fahrzeuge haben die richtige Personalzuordnung.';
        vehiclesAllocationPanel.appendChild(successAlert);
      }
    }

    render();
  }

  function getBuildingsByPseudoBuildingTypeId(pseudoBuildingTypeId) {
    return buildings.filter(building => building.pseudoBuildingTypeId === pseudoBuildingTypeId);
  }

  function getNumberOfBuildingsByPseudoBuildingTypeId(pseudoBuildingTypeId) {
    return getBuildingsByPseudoBuildingTypeId(pseudoBuildingTypeId).length;
  }

  function getBuildingsByPseudoBuildingsTypeIdWithEnabledState(pseudoBuildingTypeId, enabled) {
    return buildings.filter(
      building => building.pseudoBuildingTypeId === pseudoBuildingTypeId && building.enabled === enabled,
    );
  }

  function getNumberOfEnabledBuildingsByPseudoBuildingTypeId(pseudoBuildingTypeId) {
    return getBuildingsByPseudoBuildingsTypeIdWithEnabledState(pseudoBuildingTypeId, true).length;
  }

  function getBuildingsWithExtensionsByPseudoBuildingsTypeIdAndEnabledState(
    pseudoBuildingTypeId,
    extensionsId,
    enabled,
  ) {
    const acquiredBuildings = getBuildingsByPseudoBuildingTypeId(pseudoBuildingTypeId);

    if (acquiredBuildings.length === 0) {
      return [];
    }

    let extensions = [];
    for (const building of acquiredBuildings) {
      for (const extension of building.extensions) {
        if (extension.type_id === extensionsId && extension.enabled === enabled && extension.available === true) {
          extensions.push(building);
        }
      }
    }

    return extensions;
  }

  function getNumberOfEnabledExtensionsByPseudoBuildingTypeIdAndExtensionId(buildingTypeId, extensionTypeId) {
    return getBuildingsWithExtensionsByPseudoBuildingsTypeIdAndEnabledState(buildingTypeId, extensionTypeId, true)
      .length;
  }

  function getNumberOfDisabledExtensionsByPseudoBuildingTypeIdAndExtensionId(buildingTypeId, extensionTypeId) {
    return getBuildingsWithExtensionsByPseudoBuildingsTypeIdAndEnabledState(buildingTypeId, extensionTypeId, false)
      .length;
  }

  async function fillSettingsForm() {
    const personnelSetPointSettings = await getPersonnelSetPointSettings();

    for (let key in personnelSetPointSettings) {
      document.getElementById(key).value = personnelSetPointSettings[key];
    }
  }

  function setActiveFilterButton(activeButton) {
    const filterButtonIds = [
      "filter-deviating-personnel-count-target",
      "filter-missing-automatic-hiring",
      "filter-missing-extensions",
    ];

    filterButtonIds.forEach(buttonId => {
      const button = document.getElementById(buttonId);
      if (button.id === activeButton) {
        button.classList.add("btn-success");
        button.classList.add("active");

        return;
      }

      button.classList.remove("btn-success");
      button.classList.remove("active");
    });
  }

  function setFilter(event) {
    const button = event.target;

    const isActive = button.classList.contains("active");
    if (isActive) {
      setActiveFilterButton("none");
      renderBuildingsTable(buildings);
      return;
    }

    setActiveFilterButton(button.id);
    switch (button.id) {
      case "filter-deviating-personnel-count-target":
        renderBuildingsTable(buildingsWithIncorrectPersonalCountTarget);
        break;
      case "filter-missing-automatic-hiring":
        renderBuildingsTable(buildingsWithoutAutomaticHiring);
        break;
      case "filter-missing-extensions":
        renderBuildingsTable(buildingsWithMissingExtensions);
        break;
    }
  }

  async function resetSettings() {
    if (!confirm("Das Zurücksetzen der Einstellungen kann nicht rückgängig gemacht werden. Fortfahren?")) {
      return;
    }

    setSettings(defaultSettings);
    await fillSettingsForm();
  }

  async function fixPersonalCountTarget(event) {
    event.preventDefault();

    if (buildingsWithIncorrectPersonalCountTarget.length === 0) {
      alert("Keine Gebäude mit falschem Soll-Personal gefunden.");
      return;
    }

    if (
      !confirm(
        "Es wurden " +
        buildingsWithIncorrectPersonalCountTarget.length +
        " Gebäude mit falschem Soll-Personal gefunden. Sollen diese korrigiert werden?",
      )
    ) {
      return;
    }

    setProgressBarMaxValue(buildingsWithIncorrectPersonalCountTarget.length);

    const fixButton = document.getElementById("fix-personnel-set-point");
    fixButton.setAttribute("disabled", "disabled");

    for (const building of buildingsWithIncorrectPersonalCountTarget) {
      await fixPersonalCountTargetForBuilding(building);
      setTimeout(() => {
      }, 150);
      increaseProgressBarValue();
    }

    fixButton.removeAttribute("disabled");
    progressBarSuccess();
  }

  async function fixPersonalCountTargetForBuilding(building) {
    const personnelSetPointSettings = await getPersonnelSetPointSettings();
    const personalCountTarget = parseInt(personnelSetPointSettings["building-type-" + building.pseudoBuildingTypeId]);

    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    const formData = new FormData();
    formData.append("utf8", "✓");
    formData.append("_method", "put");
    formData.append("authenticity_token", csrfToken);
    formData.append("building[personal_count_target]", personalCountTarget);

    return fetch("/buildings/" + building.id + "?personal_count_target_only=1", {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-csrf-token": csrfToken.content,
        "x-requested-with": "XMLHttpRequest",
      },
      body: new URLSearchParams(formData).toString(),
      method: "POST",
      redirect: "manual",
    });
  }

  async function startAutomaticHiring(event) {
    event.preventDefault();

    if (buildingsWithoutAutomaticHiring.length === 0) {
      alert("Alle Gebäude haben automatische Werbung aktiviert.");
      return;
    }

    if (!user_premium) {
      alert("Du benötigst einen Premium-Account, um diese Funktion nutzen zu können.");
      return;
    }

    if (
      !confirm(
        "Es wurden " +
        buildingsWithoutAutomaticHiring.length +
        " Gebäude ohne automatische Werbung gefunden. Sollen diese aktiviert werden?",
      )
    ) {
      return;
    }

    setProgressBarMaxValue(buildingsWithoutAutomaticHiring.length);

    const startButton = document.getElementById("fix-automatic-hiring");
    startButton.setAttribute("disabled", "disabled");

    for (const building of buildingsWithoutAutomaticHiring) {
      await startAutomaticHiringForBuilding(building);
      setTimeout(() => {
      }, 150);
      increaseProgressBarValue();
    }

    startButton.removeAttribute("disabled");
    progressBarSuccess();
  }

  function startAutomaticHiringForBuilding(building) {
    return fetch(`/buildings/${building.id}/hire_do/automatic`, { redirect: "manual" });
  }

  async function fixMissingBuildingExtensions(event) {
    event.preventDefault();

    if (buildingsWithMissingExtensions.length === 0) {
      alert("Keine Gebäude mit fehlenden Ausbauten gefunden.");
      return;
    }

    if (
      !confirm(
        "Es wurden " +
        buildingsWithMissingExtensions.length +
        " Gebäude mit fehlenden Ausbauten gefunden. Sollen diese korrigiert werden?",
      )
    ) {
      return;
    }

    setProgressBarMaxValue(buildingsWithMissingExtensions.length);

    const fixButton = document.getElementById("fix-missing-building-extensions");
    fixButton.setAttribute("disabled", "disabled");

    for (const building of buildingsWithMissingExtensions) {
      const requiredExtensions = requiredExtensionsPerBuildingType.find(
        buildingType => buildingType.pseudoBuildingTypeId === building.pseudoBuildingTypeId,
      ).extensions;

      for (let i = 0, n = requiredExtensions.length; i < n; i++) {
        const extension = building.extensions.find(
          buildingExtension => buildingExtension.type_id === requiredExtensions[i]
        );

        if (extension === undefined) {
          await fixMissingBuildingExtensionsForBuilding(building, requiredExtensions[i]);
          await new Promise(r => setTimeout(r, 500));
        }
      }

      // Polizeiwache
      /*
             await fixMissingBuildingExtensionsForBuilding(building, 0);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 1);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 2);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 3);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 4);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 5);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 6);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 7);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 8);
             setTimeout(() => {}, 200);
             await fixMissingBuildingExtensionsForBuilding(building, 9);
             setTimeout(() => {}, 200);
      */

      increaseProgressBarValue();
    }

    fixButton.removeAttribute('disabled');
    progressBarSuccess();
  }

  async function fixMissingBuildingExtensionsForBuilding(building, extensionId) {
    const csrfToken = document.querySelector("meta[name=csrf-token]").content;
    const formData = new FormData();
    formData.append("_method", "post");
    formData.append("authenticity_token", csrfToken);

    return fetch("/buildings/" + building.id + "/extension/credits/" + extensionId, {
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest",
      },
      body: new URLSearchParams(formData).toString(),
      method: "POST",
      redirect: 'manual'
    });
  }

  async function main() {
    await retrieveData(keySettings)
      .then(settings => {
        if (settings === null || settings === undefined) {
          setSettings(defaultSettings);
        }
      })
      .catch(() => {
        setSettings(defaultSettings);
      });

    addModal();
    addStyle();
    addMenuEntry();
    addEventListeners();

    await fillSettingsForm();
  }

  main();
})();
