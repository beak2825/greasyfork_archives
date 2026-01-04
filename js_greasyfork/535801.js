// ==UserScript==
// @name         eRepublik Company Holdings Overview & Selector (2025-05-12, v3.4.5)
// @namespace    http://tampermonkey.net/
// @version      3.4.5
// @description  Provides an overview and partial company work-selection interface for eRepublik. This script operates solely on local browser data and does not save, store, or transmit any user data. Panels are draggable, collapsible, and include Reset, Info, and Donations buttons for transparency and support.
// @author       Janko Fran
// @license      Custom License - Personal, Non-Commercial Use Only
// @match        https://www.erepublik.com/en/economy/myCompanies
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iMTIiIHk9IjE1IiBmb250LXNpemU9IjEwIiBmaWxsPSIjZmZmIj5Db21wYW55PC90ZXh0Pjwvc3ZnPg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535801/eRepublik%20Company%20Holdings%20Overview%20%20Selector%20%282025-05-12%2C%20v345%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535801/eRepublik%20Company%20Holdings%20Overview%20%20Selector%20%282025-05-12%2C%20v345%29.meta.js
// ==/UserScript==

/* License: This script is provided free of charge for personal, non-commercial use.
// You are granted a perpetual, royalty-free license to use this script on your own eRepublik account.
// No part of this script may be modified, redistributed, or used for commercial purposes without the express written permission of the author, Janko Fran.
// Donations are welcome to support future improvements. For details, see the Info modal or documentation.
//
// Donation Links:
// • eRepublik Donations: https://www.erepublik.com/en/economy/donate-money/2103304
// • Satoshi Donations: janko7ea63e4e@zbd.gg
// For custom scripts or financial donations, please contact:
// https://www.erepublik.com/en/main/messages-compose/2103304
*/

(function () {
    'use strict';

    /*************************
     * Configuration Section *
     *************************/
    const config = {
        defaultPositions: {
            leftPanel: { top: "10px", left: "10px" },
            workPanel: { top: "80px", left: "calc(100% - 370px)" }
        },
        panelTitles: {
            leftPanel: "Company Holding(s) Overview Panel",
            workPanel: "Work Selection Panel"
        },
        panelIcon: `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+PHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNjY2Ii8+PHRleHQgeD0iMTIiIHk9IjE1IiBmb250LXNpemU9IjEwIiBmaWxsPSIjZmZmIj5Db21wYW55PC90ZXh0Pjwvc3ZnPg==`,
        leftPanelAlpha: 0.85,
        overlayAlpha: 0.70,
        workPanelPadding: "4px",
        borderRadius: "8px",
        buttonBorderRadius: "2px",
        baseFontSize: "12px",
        modalZIndex: 11000,
        modalMaxWidth: "500px",
        textLabels: {
            overallHeader: "eRepublik Holdings Overview",
            managerDetails: "Manager Mode Details",
            employeeDetails: "Employee Mode Details",
            holdingsOverview: "Aggregated Overview by Holding",
            detailedOverview: "Detailed Overview by Holding",
            totalCompanies: "Total Companies",
            totalManager: "Total Manager",
            totalEmployee: "Total Employee",
            worked: "Worked",
            assigned: "Assigned",
            infoText: `<h4>Personal Motivation</h4>
<p>
  Since official development of eRepublik has slowed significantly in recent years, I decided to improve the player experience myself. This project began as a personal tool, and I’m sharing it for the benefit of other active players who still enjoy the game. In many ways, this is how the company workflow should have worked from the beginning. This project is a small contribution toward keeping eRepublik fun, efficient, and rewarding.
</p>

<hr>

<h4>What the Script Does</h4>
<p>
  This script helps you manage your eRepublik companies more efficiently by grouping them by industry type, quality, and holding, while giving you precise control over your work. It runs entirely in your browser session, with no data stored, transmitted, or shared externally.
</p>

<hr>

<h4>Who Will Benefit</h4>
<p>
  For tycoons managing hundreds or thousands of companies, this tool is indispensable. It lets you specify exactly how many companies to work in for each group, optimizing time, energy, and storage, all while avoiding repetitive clicking.
</p>

<p>
  While the default <i>Select all</i> or <i>Select none</i> buttons may suffice for smaller company sets, this tool becomes especially useful when time is short or precision matters. Whether you're optimizing for speed, strategy, or limited energy, this tool offers a faster, more flexible alternative that gives you greater control over your workflow and adapts to your playstyle from casual to large-scale.
</p>

<hr>

<h4>⚠️ Important Note</h4>
<p>
  This script does <em>not</em> automate any actions beyond selecting companies in your browser. You still need to manually <strong>travel</strong> and click <i>Work as Manager</i> or perform other actions yourself. Its purpose is to enhance visibility and reduce manual clicking, without violating the game rules.
</p>

<hr>

<h4>Free, Transparent, Player-Driven</h4>

<p class="footnote">
  This script is free, transparent, and built entirely with players in mind. There are no trackers, no ads, and no hidden behavior. It was created with genuine passion for the game and a commitment to fair, efficient, and enjoyable gameplay.
</p>

<hr>

<h4>Tech Stack</h4>

<p class="footnote">
  This script was developed using the following technologies:
    <b>Tampermonkey</b>: <i>A userscript manager used to inject and run the script within your browser session.</i>
    <b>JavaScript (ES5)</b>: <i>The script is written in vanilla JavaScript (ECMAScript 5) to ensure compatibility with older browsers and eRepublik’s frontend.</i>
    <b>HTML & CSS</b>: <i>Custom interface panels, modals, and styling are built using pure HTML and CSS, directly injected into the DOM.</i>
    <b>ChatGPT Plus</b>: <i>Used extensively to assist in development, testing, and refining the script across over 60 iterations during the period of 2 months.</i>
</p>

<hr>

<h4>License</h4>

<p class="footnote">
  For personal, non-commercial use only. Redistribution or commercial use is not permitted without the author's written consent.
</p>

<hr>

<h4>Support Future Development</h4>
<p>
  If this script has saved you time or made company management easier, please consider supporting future improvements of this and other scripts. Donations help cover development time, testing, and enhancements, and are a much-appreciated motivation to keep going.
</p>

<ul>
  <li><img src="https://www.erepublik.net/images/modules/sidebar/currency.png?1698060179" style="height: 10px; vertical-align: text-bottom;"> <strong><a href="https://www.erepublik.com/en/economy/donate-money/2103304" target="_blank">Donate via eRepublik</a></strong></li>
  <li><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAArlBMVEUIIvUIIvYIIOcII/kAEa0AHfxFTXwAGvMAAP+vuTcMH80AIPkAAOrt+wB5g4IAEP9kbo37/xjf7AAAHvoAANvk8gDw/yf1/ySdp1AEH/bO2hqTnVkAAPIAFv0AHusRI83U4Q1ueI96g3uSnWoqNrW6xTM6RKi/yywAANKdp1tFc8I2XdKapGRKVK0lRuCP4jiJ2kkePOY/SaQQK+9+yWGb9AB3vnAAFcRwtIFkopY0Lz+5AAAAtklEQVR4AbzRQwLEQBAAwO7YtpO1rf8/LLjFx51rTRv+8nDOiBklKXIaaYbFSeR4QZwylGRFnUJV0w0Jx820bMf1uBFFX7UC13H0MIrJviepYtdWa5anCXanp4pMb8xx5cWytwskY1WTG1tZqjgsi+padtxNNDEpV+jydsxoEwAje8eNWLw/xADq8UQPzTxfrjcTzLuAA/Mfz9frDUh+xg7qc98fh4DJkBq9PfxquJOJJFBuMAAAWPsMsDR/OjAAAAAASUVORK5CYII=" style="height: 10px; vertical-align: text-bottom;"> <strong><a href="mailto:janko7ea63e4e@zbd.gg">Donate via Satoshi (ZBD)</a></strong></li>
</ul>

<p>
  For feedback, bug reports, suggestions, or custom script requests, feel free to <strong><a href="https://www.erepublik.com/en/main/messages-compose/2103304" target="_blank">send me a message</a></strong>.
</p>

<p>
  Sincerely Yours,<br>
  <strong><a href="https://www.erepublik.com/en/citizen/profile/2103304" target="_blank">Janko Fran</a></strong>
</p>
<hr>
`
        }
    };

    const theme = {
        modalBackground: "rgba(255,255,255,0.95)",
        modalText: "#333",
        modalBorder: "#ccc",
        modalHeaderBg: "#222",
        modalHeaderText: "#fff",
    };

    const NameDefinitions = {
        factoryTypes: [
            "Food Factory",
            "Weapons Factory",
            "House Factory",
            "Aircraft Weapons Plant"
        ],
        rawMaterials: {
            food: ["Grain Farm", "Fruit Orchard", "Fishery", "Cattle Farm", "Hunting Lodge"],
            weapon: ["Iron Mine", "Oil Rig", "Aluminum Mine", "Saltpeter Mine", "Rubber Plantation"],
            house: ["Sand Mine", "Clay Pit", "Sawmill", "Limestone Quarry", "Granite Quarry"],
            aircraft: ["Magnesium Refinery", "Titanium Refinery", "Wolfram Mine", "Cobalt Plant", "Neodymium Mine"]
        },
        rawLookup: {} // To be autogenerated from the arrays above.
    };

    /**************************
     * Named CSS Style Blocks *
     **************************/
    const CSS_BASE_STYLES = `
      html, body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      ::-webkit-scrollbar {
        width: 8px;
      }
      ::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #555;
      }`;

    const CSS_LEFT_PANEL_STYLES = `
      #left-panel {
        position: fixed;
        top: ${config.defaultPositions.leftPanel.top};
        left: ${config.defaultPositions.leftPanel.left};
        background-color: rgba(255,255,255,${config.leftPanelAlpha});
        border: 1px solid #333;
        padding: 0;
        z-index: 10000;
        font-size: ${config.baseFontSize};
        color: #333;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
        border-radius: ${config.borderRadius};
      }

      #left-panel-header {
        background: #ddd;
        padding: 4px 8px;
        cursor: move;
        border-top-left-radius: ${config.borderRadius};
        border-top-right-radius: ${config.borderRadius};
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #left-panel-content {
        padding: 10px;
      }

      .overall-summary, .mode-details, .holdings-overview, .detailed-overview {
        margin-bottom: 10px;
        padding: 5px;
        background: rgba(255,255,255,${config.overlayAlpha});
        border: 1px solid #ccc;
        border-radius: 4px;
      }

      .holding > h3 {
        font-size: 13px;
        margin-top: 12px;
        margin-bottom: 4px;
        border-bottom: 1px solid #ccc;
        padding-bottom: 2px;
    }`;

    const CSS_RIGHT_PANEL_STYLES = `
      #work-automation-ui-selection {
        position: fixed;
        top: ${config.defaultPositions.workPanel.top};
        left: ${config.defaultPositions.workPanel.left};
        background: rgba(0,0,0,0.9);
        color: white;
        padding: ${config.workPanelPadding};
        border-radius: 5px;
        font-size: 14px;
        max-height: 80vh;
        overflow-y: auto;
        z-index: 10000;
        width: 370px;
      }

      #work-panel-header {
        background: #222;
        padding: 4px 8px;
        cursor: move;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        color: #fff;
      }

      #work-panel-content {
        padding: 10px;
      }

      .work-btn-manager {
        background: green;
        color: white;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        margin-top: 3px;
        border-radius: ${config.buttonBorderRadius};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      }

      .work-btn-employee {
        background: orange;
        color: white;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        margin-top: 3px;
        border-radius: ${config.buttonBorderRadius};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      }

      #refresh-work-ui {
        background: blue;
        color: white;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        margin-top: 10px;
        border-radius: ${config.buttonBorderRadius};
        box-shadow: 0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2);
      }

      #work-automation-ui-selection button:hover {
        opacity: 0.8;
      }

      .work-btn-manager:active, .work-btn-employee:active, #refresh-work-ui:active {
        box-shadow: 0 1px 2px rgba(0,0,0,0.3) inset;
        transform: translateY(1px);
      }

      .manager-mode {
        text-align: left;
      }

      .employee-mode {
        text-align: right;
      }`;

    const CSS_INFO_MODAL_FRAME = `
      #info-modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255,255,255,0.95);
        border: 1px solid #ccc;
        border-radius: ${config.borderRadius};
        padding: 15px;
        max-width: 500px;
        z-index: 11000;
        display: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
      }

      #info-modal h3 {
        margin-top: 0;
        font-size: 1.2em;
      }

      #info-modal p {
        font-size: 11px;
        line-height: 1.1em;
        white-space: pre-line;
      }

      #info-modal button {
        margin-top: 10px;
        padding: 5px 10px;
        border: none;
        cursor: pointer;
        background: #222;
        color: #fff;
        border-radius: ${config.buttonBorderRadius};
      }
    `;

    const CSS_INFO_MODAL_CONTENT = `
      #info-modal-content {
        font-family: Arial, sans-serif;
        font-size: ${config.baseFontSize};
        color: #333;
        line-height: 1.25em;
      }

      #info-modal-content h3 {
        margin-top: 0;
        margin-bottom: 0.1em;
        font-size: 1em;
      }

      #info-modal-content h4 {
        margin-top: 0em;
        margin-bottom: 0em;
        font-size: 11.25px;
      }

      #info-modal-content hr {
        margin: 3px 0;
        border: none;
        border-top: 1px solid #ccc;
      }

      #info-modal-content ul {
        padding-left: 4px;
        margin-top: 0.5em;
      }

      #info-modal-content li {
        margin-bottom: 0.25em;
      }

      #info-modal-content p {
        margin-top: 0em;
        margin-bottom: 0em;
      }

      #info-modal-content p[style*="font-size: 11px"] {
        font-size: 11px;
        color: gray;
      }
    `;
    /**
     * StyleManager
     * ------------
     * Injects reusable CSS styles into the page.
     * Used to style panels, modals, and overall UI elements.
     * Supports named CSS blocks for different UI components.
     */
    const StyleManager = {
        injectNamed(cssText) {
            const style = document.createElement('style');
            style.textContent = cssText;
            document.head.appendChild(style);
        },
        injectBaseStyles() { this.injectNamed(CSS_BASE_STYLES); },
        injectLeftPanelStyles() { this.injectNamed(CSS_LEFT_PANEL_STYLES); },
        injectRightPanelStyles() { this.injectNamed(CSS_RIGHT_PANEL_STYLES); },
        injectInfoModalFrameStyles() { this.injectNamed(CSS_INFO_MODAL_FRAME); },
        injectInfoModalContentStyles() { this.injectNamed(CSS_INFO_MODAL_CONTENT); },
        injectAll() {
            this.injectBaseStyles();
            this.injectLeftPanelStyles();
            this.injectRightPanelStyles();
            this.injectInfoModalFrameStyles();
            this.injectInfoModalContentStyles();
        }
    };

    /**************************
     * Class Definitions      *
     **************************/

    /**
     * DOMManager
     * ----------
     * Provides utility methods for accessing and interacting with
     * DOM elements on the eRepublik "My Companies" page.
     *
     * Methods:
     * - getHoldingGroups(): Returns all company holding group elements.
     * - getHoldingName(holdingElement): Returns the name of a given holding group.
     * - getCompanyElements(holdingElement): Returns all company elements under a holding group.
     * - getBuildingImage(companyElement): Returns the image element for the factory building.
     * - getRawMaterialImage(companyElement): Returns the image element for raw materials.
     * - getStarElement(companyElement): Returns the star-rating element (for factory quality).
     * - getWorkButton(companyElement): Returns the "Work as Manager" or "Assign" button.
     * - getEmployeeSelector(companyElement): Returns the container for employee assignment buttons.
     * - getEmployeeLinks(selectorElement): Returns all clickable links to assign employees.
     */
    class DOMManager {
        getHoldingGroups() {
            return Array.from(document.querySelectorAll('.companies_group'));
        }

        getHoldingName(holdingElement) {
            const nameEl = holdingElement.querySelector('.companies_header .name');
            return nameEl ? nameEl.textContent.trim() : "Unnamed Holding";
        }

        getCompanyElements(holdingElement) {
            return Array.from(holdingElement.querySelectorAll('.companies_listing .listing.companies'));
        }

        getBuildingImage(companyElement) {
            return companyElement.querySelector('.area_pic img[src*="/buildings/"]');
        }

        getRawMaterialImage(companyElement) {
            return companyElement.querySelector('.area_raw img');
        }

        getStarElement(companyElement) {
            return companyElement.querySelector(".mini_stars");
        }

        getWorkButton(companyElement) {
            return companyElement.querySelector('.area_options a.as_employee.owner_work');
        }

        getEmployeeSelector(companyElement) {
            return companyElement.querySelector('.company_employees .employees_selector');
        }

        getEmployeeLinks(selectorElement) {
            return selectorElement ? Array.from(selectorElement.querySelectorAll('a.employee_select:not(.worked)')) : [];
        }
    }

    /**
     * DataProcessor
     * -------------
     * Responsible for extracting, parsing, classifying, and aggregating
     * company data from the DOM. Provides business logic for grouping and
     * evaluating work states.
     *
     * Core Responsibilities:
     * - Extract data from company DOM elements.
     * - Classify companies into Factories and Raw Materials.
     * - Parse work state (worked, assigned, not worked, etc).
     * - Aggregate data per holding and across all holdings.
     * - Maintain reusable definitions for raw material mappings.
     */
    class DataProcessor {
        constructor(domManager) {
            this.domManager = domManager;
            this.holdingsData = null;
            this.rawLookup = this.buildRawLookup();
        }

        buildRawLookup() {
            const lookup = {};
            // Loop over each raw material category and fill the lookup.
            for (let category in NameDefinitions.rawMaterials) {
                NameDefinitions.rawMaterials[category].forEach(material => {
                    // Using the lower‑case version of the material name as the key.
                    lookup[material.toLowerCase()] = material;
                });
            }
            return lookup;
        }

        refineRawMaterialType(rawTitle, src) {
            src = src.toLowerCase();
            for (let key in this.rawLookup) {
                if (src.includes(key)) {
                    return this.rawLookup[key];
                }
            }
            return rawTitle || "Unknown Raw Material";
        }

        extractCompanyData(companyElement) {
            const data = { company: companyElement };
            const buildingImg = this.domManager.getBuildingImage(companyElement);
            if (buildingImg) {
                data.type = buildingImg.getAttribute('alt').trim();
                if (NameDefinitions.factoryTypes.includes(data.type)) {
                    data.category = "Factories";
                    const titleText = buildingImg.getAttribute('title') || "";
                    data.quality = this.parseQualityFromTitle(titleText);
                } else {
                    data.category = "Raw Materials";
                }
            } else {
                const rawImg = this.domManager.getRawMaterialImage(companyElement);
                if (rawImg) {
                    data.category = "Raw Materials";
                    const rawTitle = (rawImg.getAttribute('title') || "").trim();
                    data.type = this.isStandardRawMaterialsTitle(rawTitle)
                        ? this.refineRawMaterialType(rawTitle, rawImg.getAttribute('src') || "")
                    : rawTitle;
                }
            }
            if (data.category === "Raw Materials") {
                data.subCat = this.getRawMaterialCategory(data.type);
                data.quality = "N/A";
                data.workMode = this.determineWorkMode(data.category, data.type, data.subCat);
                if (this.isEmployee(data)) {
                    data.employeeStatus = this.getEmployeeStatus(companyElement);
                    if (data.subCat === "Aircraft Raw Materials" && data.employeeStatus.total < 5) {
                        data.employeeStatus.total = 5;
                    }
                } else if (this.isManager(data)) {
                    data.managerStatus = this.getManagerStatus(companyElement);
                }
            } else {
                data.workMode = this.determineWorkMode(data.category, data.type, null);
                if (this.isEmployee(data)) {
                    data.employeeStatus = this.getEmployeeStatus(companyElement);
                } else if (this.isManager(data)) {
                    data.managerStatus = this.getManagerStatus(companyElement);
                }
            }
            if (data.category === "Factories" && !data.quality) {
                data.quality = this.extractQuality(companyElement);
            }
            return data;
        }

        groupCompaniesByHolding() {
            const holdingsData = {};
            this.domManager.getHoldingGroups().forEach(holding => {
                const holdingName = this.domManager.getHoldingName(holding);
                if (!holdingsData[holdingName]) {
                    holdingsData[holdingName] = { Factories: {}, "Raw Materials": {}, Unknown: 0 };
                }
                this.domManager.getCompanyElements(holding).forEach(company => {
                    const data = this.extractCompanyData(company);
                    if (!data.category || !data.type) {
                        holdingsData[holdingName].Unknown++;
                        return;
                    }
                    if (data.category === "Factories") {
                        this.groupFactory(holdingsData[holdingName], data);
                    } else if (data.category === "Raw Materials") {
                        this.groupRawMaterial(holdingsData[holdingName], data);
                    }
                });
            });
            this.holdingsData = holdingsData;
            return holdingsData;
        }

        aggregateHoldingsData(results) {
            const aggregated = {};
            for (let holdingName in results) {
                aggregated[holdingName] = { manager: {}, employee: {} };
                const factories = results[holdingName].Factories;
                for (let fType in factories) {
                    for (let qual in factories[fType]) {
                        const group = factories[fType][qual];
                        if (this.isManager(group)) {
                            if (!aggregated[holdingName].manager[fType]) {
                                aggregated[holdingName].manager[fType] = { completed: 0, total: 0, count: 0 };
                            }
                            aggregated[holdingName].manager[fType].completed += group.completed;
                            aggregated[holdingName].manager[fType].total += group.totalSlots;
                            aggregated[holdingName].manager[fType].count += group.count;
                        } else if (this.isEmployee(group)) {
                            if (!aggregated[holdingName].employee[fType]) {
                                aggregated[holdingName].employee[fType] = { completed: 0, total: 0, count: 0 };
                            }
                            aggregated[holdingName].employee[fType].completed += group.completed;
                            aggregated[holdingName].employee[fType].total += group.totalSlots;
                            aggregated[holdingName].employee[fType].count += group.count;
                        }
                    }
                }
                const rawMaterials = results[holdingName]["Raw Materials"];
                for (let subCat in rawMaterials) {
                    for (let rType in rawMaterials[subCat]) {
                        const group = rawMaterials[subCat][rType];
                        if (this.isManager(group)) {
                            if (!aggregated[holdingName].manager[rType]) {
                                aggregated[holdingName].manager[rType] = { completed: 0, total: 0, count: 0 };
                            }
                            aggregated[holdingName].manager[rType].completed += group.completed;
                            aggregated[holdingName].manager[rType].total += group.totalSlots;
                            aggregated[holdingName].manager[rType].count += group.count;
                        } else if (this.isEmployee(group)) {
                            if (!aggregated[holdingName].employee[rType]) {
                                aggregated[holdingName].employee[rType] = { completed: 0, total: 0, count: 0 };
                            }
                            aggregated[holdingName].employee[rType].completed += group.completed;
                            aggregated[holdingName].employee[rType].total += group.totalSlots;
                            aggregated[holdingName].employee[rType].count += group.count;
                        }
                    }
                }
            }
            return aggregated;
        }

        aggregateOverall(aggregatedData) {
            const overall = { manager: {}, employee: {} };
            for (let holding in aggregatedData) {
                for (let mode of ['manager', 'employee']) {
                    for (let industry in aggregatedData[holding][mode]) {
                        if (!overall[mode][industry]) {
                            overall[mode][industry] = { completed: 0, total: 0, count: 0 };
                        }
                        overall[mode][industry].completed += aggregatedData[holding][mode][industry].completed;
                        overall[mode][industry].total += aggregatedData[holding][mode][industry].total;
                        overall[mode][industry].count += aggregatedData[holding][mode][industry].count;
                    }
                }
            }
            return overall;
        }

        // Helper Methods
        parseQualityFromTitle(title) {
            const qualityMatch = title.match(/Quality Level\s*(\d+)/i);
            return (qualityMatch && qualityMatch[1]) ? "Q" + qualityMatch[1] : "Unknown Quality";
        }

        isStandardRawMaterialsTitle(title) {
            const allRawMaterials = Object.values(NameDefinitions.rawMaterials).flat();
            return allRawMaterials.includes(title);
        }

        getRawMaterialCategory(buildingName) {
            if (NameDefinitions.rawMaterials.food.includes(buildingName)) return "Food Raw Materials";
            if (NameDefinitions.rawMaterials.weapon.includes(buildingName)) return "Weapon Raw Materials";
            if (NameDefinitions.rawMaterials.house.includes(buildingName)) return "House Raw Materials";
            if (NameDefinitions.rawMaterials.aircraft.includes(buildingName)) return "Aircraft Raw Materials";
            return "Other Raw Materials";
        }

        determineWorkMode(category, type, subCat) {
            if (category === "Factories") {
                return (type === "House Factory" || type === "Aircraft Weapons Plant") ? "employee" : "manager";
            }
            if (category === "Raw Materials") {
                return (subCat === "House Raw Materials" || subCat === "Aircraft Raw Materials") ? "employee" : "manager";
            }
            return "unknown";
        }

        isManager(data) { return data.workMode === "manager"; }
        isEmployee(data) { return data.workMode === "employee"; }

        parseStatusFromTitle(title) {
            // Use regex to match patterns like "Worked: 1/5"
            const match = title.match(/Worked:\s*(\d+)\/(\d+)/i);
            if (match) {
                return {
                    completed: parseInt(match[1], 10), // First number (e.g., 1)
                    total: parseInt(match[2], 10) // Second number (e.g., 5)
                };
            }
            return null; // Return null if no match is found
        }

        // Updated getManagerStatus method
        getManagerStatus(companyElement) {
            const anchor = this.domManager.getWorkButton(companyElement);
            let worked = 0, total = 0;

            if (anchor) {
                const title = anchor.getAttribute("title") || "";
                const parsed = this.parseStatusFromTitle(title);

                if (parsed) {
                    // If parsing succeeds, use the extracted values
                    worked = parsed.completed;
                    total = parsed.total;
                } else if (title.includes("Already worked today")) {
                    // Handle case where work is already done
                    worked = 1;
                    total = 1;
                }

                if (title.includes("Already worked today")) {
                    return { worked, total, status: "already worked" };
                }
            }

            // Ensure total is at least 1 to avoid division issues
            if (total === 0) total = 1;
            return { worked, total, status: "not worked" };
        }

        getEmployeeStatus(companyElement) {
            const selector = this.domManager.getEmployeeSelector(companyElement);
            if (selector) {
                const total = parseInt(selector.getAttribute('data-employee_limit'), 10) || 1;
                const workedCount = selector.querySelectorAll('a.employee_select.worked').length;
                return { assigned: workedCount, total, status: workedCount > 0 ? "already assigned" : "not assigned" };
            }
            const anchor = this.domManager.getWorkButton(companyElement);
            let assigned = 0, total = 0;
            if (anchor) {
                const title = anchor.getAttribute("title") || "";
                const parsed = this.parseStatusFromTitle(title);
                if (parsed) {
                    assigned = parsed.completed;
                    total = parsed.total;
                }
                if (title.includes("Already worked today")) {
                    if (assigned === 0) assigned = 1;
                    return { assigned, total, status: "already assigned" };
                }
            }
            if (total === 0) total = 1;
            return { assigned, total, status: "not assigned" };
        }

        extractQuality(companyElement) {
            const star = this.domManager.getStarElement(companyElement);
            if (star) {
                const m = /q(\d+)/i.exec(star.className);
                if (m && m[1]) return "Q" + m[1];
            }
            return "Unknown";
        }

        groupFactory(holdingObj, data) {
            const type = data.type;
            const quality = data.quality;
            if (!holdingObj.Factories[type]) holdingObj.Factories[type] = {};
            if (!holdingObj.Factories[type][quality]) {
                holdingObj.Factories[type][quality] = { count: 0, workMode: data.workMode, totalSlots: 0, completed: 0, remaining: 0, companies: [] };
            }
            const status = this.getWorkStatus(data);
            this.updateGroup(holdingObj.Factories[type][quality], status, data.company);
        }

        groupRawMaterial(holdingObj, data) {
            const subCat = data.subCat;
            const type = data.type;
            if (!holdingObj["Raw Materials"][subCat]) holdingObj["Raw Materials"][subCat] = {};
            if (!holdingObj["Raw Materials"][subCat][type]) {
                holdingObj["Raw Materials"][subCat][type] = { count: 0, workMode: data.workMode, totalSlots: 0, completed: 0, remaining: 0, companies: [] };
            }
            const status = this.getRawMaterialStatus(data);
            this.updateGroup(holdingObj["Raw Materials"][subCat][type], status, data.company);
        }

        updateGroup(group, status, company) {
            group.count++;
            group.totalSlots += status.total;
            group.completed += status.completed;
            group.remaining += status.remaining;
            if (status.remaining > 0) group.companies.push(company);
        }

        getWorkStatus(data) {
            if (this.isManager(data) && data.managerStatus) {
                return {
                    completed: data.managerStatus.worked,
                    total: data.managerStatus.total,
                    remaining: data.managerStatus.total - data.managerStatus.worked
                };
            } else if (this.isEmployee(data) && data.employeeStatus) {
                return {
                    completed: data.employeeStatus.assigned,
                    total: data.employeeStatus.total,
                    remaining: data.employeeStatus.total - data.employeeStatus.assigned
                };
            }
            return { completed: 0, total: 0, remaining: 0 };
        }

        getRawMaterialStatus(data) {
            if (data.subCat === "Aircraft Raw Materials") {
                return this.getWorkStatus(data);
            }
            if (this.isManager(data)) {
                let completed = (data.managerStatus && data.managerStatus.status === "already worked") ? 1 : 0;
                return { completed, total: 1, remaining: 1 - completed };
            } else if (this.isEmployee(data)) {
                let completed = data.employeeStatus ? data.employeeStatus.assigned : 0;
                return { completed, total: 1, remaining: 1 - completed };
            }
            return { completed: 0, total: 1, remaining: 1 };
        }
    }

    /**
     * WorkSelector
     * ------------
     * Provides logic to select companies for working (manager or employee).
     * Interfaces with DOM and DataProcessor to locate companies and trigger actions.
     *
     * Responsibilities:
     * - Construct a selection structure from grouped holdings data.
     * - Provide a method to apply a selection to the DOM.
     * - Handle click interactions for assignment and work.
     */
    class WorkSelector {
        constructor(domManager, dataProcessor) {
            this.domManager = domManager;
            this.dataProcessor = dataProcessor;
        }

        buildSelectionData(holdingsData) {
            const selectionData = {};
            for (let holdingName in holdingsData) {
                if (/^unassigned companies$/i.test(holdingName)) {
                    let totalCount = 0;
                    for (let fType in holdingsData[holdingName].Factories) {
                        for (let qual in holdingsData[holdingName].Factories[fType]) {
                            totalCount += holdingsData[holdingName].Factories[fType][qual].count;
                        }
                    }
                    for (let subCat in holdingsData[holdingName]["Raw Materials"]) {
                        for (let rType in holdingsData[holdingName]["Raw Materials"][subCat]) {
                            totalCount += holdingsData[holdingName]["Raw Materials"][subCat][rType].count;
                        }
                    }
                    totalCount += holdingsData[holdingName].Unknown;
                    if (totalCount === 0) continue;
                }
                selectionData[holdingName] = {};
                const fac = holdingsData[holdingName].Factories;
                for (let fType in fac) {
                    let total = 0;
                    const qualityBreakdown = {};
                    let companies = [];
                    for (let qual in fac[fType]) {
                        const group = fac[fType][qual];
                        if ((group.workMode === "manager" || group.workMode === "employee") && group.remaining > 0 && group.companies.length > 0) {
                            total += group.remaining;
                            qualityBreakdown[qual] = group.remaining;
                            companies = companies.concat(group.companies);
                        }
                    }
                    if (total > 0) {
                        const selKey = `Factory - ${fType}`;
                        selectionData[holdingName][selKey] = { total, qualityBreakdown, companies, workMode: fac[fType][Object.keys(fac[fType])[0]].workMode };
                    }
                }
                const rm = holdingsData[holdingName]["Raw Materials"];
                for (let subCat in rm) {
                    let total = 0;
                    const typeBreakdown = {};
                    let companies = [];
                    for (let rType in rm[subCat]) {
                        if (!rType || rType === "undefined") continue;
                        const group = rm[subCat][rType];
                        if ((group.workMode === "manager" || group.workMode === "employee") && group.remaining > 0 && group.companies.length > 0) {
                            total += group.remaining;
                            typeBreakdown[rType] = group.remaining;
                            companies = companies.concat(group.companies);
                        }
                    }
                    if (total > 0) {
                        const selKey = `Raw Materials - ${subCat}`;
                        selectionData[holdingName][selKey] = { total, typeBreakdown, companies, workMode: rm[subCat][Object.keys(rm[subCat])[0]].workMode };
                    }
                }
            }
            return selectionData;
        }

        selectCompanies(group, holdingName, groupName, limit, showPopup = true) {
            let selectedCount = 0;
            let skippedCount = 0;
            const expectedType = this.getExpectedType(groupName);
            for (const company of group.companies) {
                if (selectedCount >= limit) break;
                const data = this.dataProcessor.extractCompanyData(company);
                if (expectedType && data.type !== expectedType && data.subCat !== expectedType) {
                    console.warn(`Skipped company due to type mismatch: expected ${expectedType} but got ${data.type} / ${data.subCat}`);
                    skippedCount++;
                    continue;
                }
                if (this.dataProcessor.isManager(data)) {
                    const workButton = this.domManager.getWorkButton(company);
                    if (workButton && !workButton.getAttribute('title').includes('Already worked today')) {
                        workButton.click();
                        selectedCount++;
                    } else {
                        skippedCount++;
                    }
                } else if (this.dataProcessor.isEmployee(data)) {
                    const selector = this.domManager.getEmployeeSelector(company);
                    if (selector) {
                        const availableLinks = this.domManager.getEmployeeLinks(selector);
                        for (const link of availableLinks) {
                            if (selectedCount >= limit) break;
                            link.click();
                            selectedCount++;
                        }
                        if (availableLinks.length === 0) skippedCount++;
                    } else {
                        skippedCount++;
                    }
                }
            }
            if (showPopup) {
                alert(`✅ Selected ${selectedCount} ${groupName} companies for work in ${holdingName}\n❌ Skipped ${skippedCount} (already worked/assigned, unavailable, or type mismatch).\n👉 Now manually click "Work as Manager" to execute.`);
            }
        }

        getExpectedType(groupName) {
            if (groupName.startsWith("Factory - ")) return groupName.replace("Factory - ", "").trim();
            if (groupName.startsWith("Raw Materials - ")) return groupName.replace("Raw Materials - ", "").trim();
            return "";
        }
    }

    /**
     * UIManager
     * ---------
     * Responsible for rendering UI panels, controls, summaries, and modals.
     * Integrates overview and selection interface based on processed data.
     *
     * Responsibilities:
     * - Build and render draggable/collapsible panels.
     * - Render overview summaries and selection interfaces.
     * - Inject Info modal.
     * - Display breakdowns by holding, industry, and company type.
     */
    class UIManager {

        constructor(dataProcessor) {
            this.dataProcessor = dataProcessor;
        }

        createPanel(id, title) {
            let panel = document.getElementById(id);
            if (!panel) {
                panel = document.createElement('div');
                panel.id = id;
                panel.setAttribute('data-title', title);
                document.body.appendChild(panel);
            } else {
                panel.setAttribute('data-title', title);
            }
            return panel;
        }

        addPanelControls(panelId, defaultPos) {
            const panel = document.getElementById(panelId);
            if (!panel) return;
            let header = panel.querySelector('.panel-header') || document.createElement('div');
            header.className = 'panel-header';
            header.style.display = 'flex';
            header.style.justifyContent = 'space-between';
            header.style.alignItems = 'center';
            header.style.background = (panelId === "work-automation-ui-selection") ? "#222" : "#ddd";
            header.style.color = (panelId === "work-automation-ui-selection") ? "#fff" : "#000";
            header.style.padding = '4px 8px';
            header.style.cursor = 'move';
            if (!header.parentNode) panel.insertBefore(header, panel.firstChild);

            let titleEl = header.querySelector('.panel-title') || document.createElement('span');
            titleEl.className = 'panel-title';
            titleEl.textContent = panel.getAttribute('data-title');
            if (!titleEl.parentNode) header.appendChild(titleEl);

            let controls = header.querySelector('.panel-controls') || document.createElement('span');
            controls.className = 'panel-controls';
            if (!controls.parentNode) header.appendChild(controls);
            controls.innerHTML = "";

            const collapseBtn = document.createElement('button');
            collapseBtn.textContent = '–';
            collapseBtn.style.marginRight = '4px';
            collapseBtn.onclick = () => {
                const content = panel.querySelector('.panel-content');
                if (content) {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    collapseBtn.textContent = content.style.display === 'none' ? '+' : '–';
                }
            };

            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset';
            resetBtn.style.marginLeft = '4px';
            resetBtn.style.marginRight = '4px';
            resetBtn.onclick = () => {
                panel.style.top = defaultPos.top;
                panel.style.left = defaultPos.left;
                const content = panel.querySelector('.panel-content');
                if (content) {
                    content.style.display = 'block';
                    collapseBtn.textContent = '–';
                }
            };
            controls.appendChild(resetBtn);

            const infoBtn = document.createElement('button');
            infoBtn.textContent = 'Info';
            infoBtn.style.marginRight = '4px';
            infoBtn.onclick = (e) => {
                e.stopPropagation();
                document.getElementById('info-modal').style.display = 'block';
            };
            controls.appendChild(infoBtn);

            const donateBtn = document.createElement('button');
            donateBtn.textContent = 'Donations';
            donateBtn.style.marginRight = '4px';
            donateBtn.onclick = (e) => {
                e.stopPropagation();
                window.open("https://www.erepublik.com/en/economy/donate-money/2103304", "_blank");
            };
            controls.appendChild(donateBtn);

            controls.appendChild(collapseBtn);

            if (!panel.querySelector('.panel-content')) {
                const contentWrapper = document.createElement('div');
                contentWrapper.className = 'panel-content';
                while (header.nextSibling) contentWrapper.appendChild(header.nextSibling);
                panel.appendChild(contentWrapper);
            }
            this.makeDraggable(panel, header);
        }

        makeDraggable(panel, handle) {
       /* ------------------------------------------------------------------
        Modern path – Pointer Events (covers mouse, touch, pen)
       ------------------------------------------------------------------ */
            if (window.PointerEvent) {

                handle.style.touchAction = 'none'; // stop browser scroll/zoom on handle
                handle.style.cursor = 'move';

                let startX, startY, startLeft, startTop;

                handle.addEventListener('pointerdown', e => {
                    // 1) only primary button / finger
                    // 2) don’t start drag if the tap was on a control button
                    if (e.button !== 0 || e.target.closest('.panel-controls, .mt-button, .mt-toggle-button')) return;

                    e.preventDefault();
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = panel.offsetLeft;
                    startTop = panel.offsetTop;

                    /* move handler */
                    function onMove(ev) {
                        ev.preventDefault();
                        const dx = ev.clientX - startX;
                        const dy = ev.clientY - startY;

                        let newLeft = startLeft + dx;
                        let newTop = startTop + dy;

                        // clamp inside viewport (keep header visible)
                        newLeft = Math.min(Math.max(0, newLeft),
                                           window.innerWidth - panel.offsetWidth);
                        newTop = Math.min(Math.max(0, newTop),
                                           window.innerHeight - 46);

                        panel.style.left = newLeft + 'px';
                        panel.style.top = newTop + 'px';
                    }

                    /* up handler */
                    function onUp() {
                        document.removeEventListener('pointermove', onMove);
                        // remember position
                        localStorage.setItem('panelPos_'+panel.id, JSON.stringify({
                            left: panel.style.left,
                            top:  panel.style.top
                        }));
                    }

                    document.addEventListener('pointermove', onMove, { passive:false });
                    document.addEventListener('pointerup', onUp, { once:true });
                }, { passive:false });

                // restore saved position (if any)
                try {
                    const saved = JSON.parse(localStorage.getItem('panelPos_'+panel.id) || 'null');
                    if (saved && saved.left && saved.top) {
                        panel.style.left = saved.left;
                        panel.style.top = saved.top;
                    }
                } catch (_) { /* ignore */ }

                return; // nothing else to wire
            }

            /* ------------------------------------------------------------------
       Legacy path – no Pointer Events (old Android stock, IE11)
    ------------------------------------------------------------------ */

            handle.style.cursor = 'move';
            handle.style.touchAction = 'none';

            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            function startDrag(x, y) { pos3 = x; pos4 = y; }
            function moveDrag(x, y) {
                pos1 = pos3 - x; pos2 = pos4 - y;
                pos3 = x; pos4 = y;

                let newLeft = panel.offsetLeft - pos1;
                let newTop = panel.offsetTop - pos2;

                newLeft = Math.min(Math.max(0, newLeft),
                                   window.innerWidth - panel.offsetWidth);
                newTop = Math.min(Math.max(0, newTop),
                                   window.innerHeight - 46);

                panel.style.left = newLeft + 'px';
                panel.style.top = newTop + 'px';
            }
            function endDrag() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', endDrag);

                localStorage.setItem('panelPos_'+panel.id, JSON.stringify({
                    left: panel.style.left,
                    top:  panel.style.top
                }));
            }

            /* mouse */
            function onMouseDown(e) {
                if (e.button !== 0 || e.target.closest('.panel-controls, .mt-button, .mt-toggle-button')) return;
                e.preventDefault();
                startDrag(e.clientX, e.clientY);
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', endDrag);
            }
            function onMouseMove(e){ e.preventDefault(); moveDrag(e.clientX, e.clientY); }

            /* touch */
            function onTouchStart(e) {
                if (e.touches.length !== 1 || e.target.closest('.panel-controls, .mt-button, .mt-toggle-button')) return;
                e.preventDefault();
                const t = e.touches[0];
                startDrag(t.clientX, t.clientY);
                document.addEventListener('touchmove', onTouchMove, { passive:false });
                document.addEventListener('touchend', endDrag);
            }
            function onTouchMove(e){ e.preventDefault(); moveDrag(e.touches[0].clientX, e.touches[0].clientY); }

            handle.addEventListener('mousedown', onMouseDown);
            handle.addEventListener('touchstart', onTouchStart, { passive:false });

            // restore saved position for legacy path
            try {
                const saved = JSON.parse(localStorage.getItem('panelPos_'+panel.id) || 'null');
                if (saved && saved.left && saved.top) {
                    panel.style.left = saved.left;
                    panel.style.top = saved.top;
                }
            } catch (_) { /* ignore */ }
        }


        createInfoModal() {
            if (document.getElementById('info-modal')) return;
            const modal = document.createElement('div');
            modal.id = 'info-modal';
            modal.innerHTML = `
              <div id="info-modal-content">
                <h3>About This Script - eRepublik Company Holdings Overview & Work Selector</h3>
                <p>${config.textLabels.infoText}</p>
              </div>
              <button id="close-info-modal">Close</button>
            `;
            document.body.appendChild(modal);
            document.getElementById('close-info-modal').onclick = () => modal.style.display = 'none';
        }

        renderOverviewPanel(holdingsData, dataProcessor) {
            const aggregated = dataProcessor.aggregateHoldingsData(holdingsData);
            const overall = dataProcessor.aggregateOverall(aggregated);
            let overallManager = { completed: 0, total: 0, count: 0 };
            for (let industry in overall.manager) {
                overallManager.completed += overall.manager[industry].completed;
                overallManager.total += overall.manager[industry].total;
                overallManager.count += overall.manager[industry].count;
            }
            const overallManagerPercentage = overallManager.total > 0 ? ((overallManager.completed / overallManager.total) * 100).toFixed(1) : '0';
            let overallEmployee = { completed: 0, total: 0, count: 0 };
            for (let industry in overall.employee) {
                overallEmployee.completed += overall.employee[industry].completed;
                overallEmployee.total += overall.employee[industry].total;
                overallEmployee.count += overall.employee[industry].count;
            }
            const overallEmployeePercentage = overallEmployee.total > 0 ? ((overallEmployee.completed / overallEmployee.total) * 100).toFixed(1) : '0';
            const totalCompanies = document.querySelectorAll('.companies_listing .listing.companies').length;

            const overallHTML = this.buildOverallSummary(totalCompanies, {
                completed: overallManager.completed, total: overallManager.total, count: overallManager.count, percentage: overallManagerPercentage
            }, {
                completed: overallEmployee.completed, total: overallEmployee.total, count: overallEmployee.count, percentage: overallEmployeePercentage
            });
            const managerDetailsHTML = this.buildModeDetails(config.textLabels.managerDetails, overall.manager);
            const employeeDetailsHTML = this.buildModeDetails(config.textLabels.employeeDetails, overall.employee);
            const holdingsHTML = this.buildHoldingsOverview(aggregated, holdingsData);
            const detailedHTML = this.buildDetailedOverview(holdingsData);

            const finalHTML = overallHTML + managerDetailsHTML + employeeDetailsHTML + holdingsHTML + detailedHTML;
            const panel = this.createPanel('left-panel', config.panelTitles.leftPanel);
            panel.innerHTML = finalHTML;
            this.addPanelControls('left-panel', config.defaultPositions.leftPanel);
        }

        renderWorkSelectionPanel(selectionData, onSelect, dataProcessor, workSelector) {
            const panel = this.createPanel('work-automation-ui-selection', config.panelTitles.workPanel);
            let panelHTML = `
                <strong>Work Selection</strong><br>
                <span>Select companies by group & quality (with bonus):</span><br><hr>
            `;
            const holdingNames = Object.keys(selectionData);
            holdingNames.forEach((holdingName, idx) => {
                panelHTML += `<strong>${holdingName}</strong><br>`;
                const groups = selectionData[holdingName];
                for (let groupName in groups) {
                    const group = groups[groupName];
                    const isMgr = group.workMode === "manager";
                    const modeIcon = isMgr ? "🧑‍💼" : "👷";
                    const btnClass = isMgr ? "work-btn-manager" : "work-btn-employee";
                    const containerClass = isMgr ? "manager-mode" : "employee-mode";
                    panelHTML += `<div class="work-group ${containerClass}">
                        <span style="color: lightblue;">${modeIcon} ${groupName} (${group.total})</span><br>`;
                    if (groupName.startsWith("Factory - ")) {
                        panelHTML += this.renderFactoryGroup(group);
                    } else {
                        panelHTML += this.renderRawMaterialGroup(group);
                    }
                    const sanitizedGroupName = Utils.sanitize(groupName);
                    panelHTML += `
                        <input type="number" id="work-limit-${idx}-${sanitizedGroupName}" value="${group.total}" min="0" max="${group.total}" style="width: 50px;">
                        <button class="start-work-btn ${btnClass}" data-holding="${holdingName}" data-group="${groupName}" data-index="${idx}">Select</button><br>
                    </div>`;
                }
                if (idx < holdingNames.length - 1) panelHTML += `<hr>`;
            });
            panelHTML += `
                <div style="display: flex; align-items: center; justify-content: flex-start; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <input type="checkbox" id="show-popup-checkbox" checked style="margin: 0;">
                        <label for="show-popup-checkbox" title="Show a message after selecting companies" style="margin: 0;">Selection Info</label>
                    </div>
                    <button id="refresh-work-ui">Refresh</button>
                </div>
            `;
            panel.innerHTML = panelHTML;
            this.addPanelControls('work-automation-ui-selection', config.defaultPositions.workPanel);

            document.querySelectorAll('.start-work-btn').forEach(button => {
                button.addEventListener('click', () => {
                    const holding = button.getAttribute('data-holding');
                    const groupName = button.getAttribute('data-group');
                    const idx = button.getAttribute('data-index');
                    const sanitizedGroupName = Utils.sanitize(groupName);
                    const input = document.getElementById(`work-limit-${idx}-${sanitizedGroupName}`);
                    const limit = parseInt(input.value, 10);
                    const showPopup = document.getElementById('show-popup-checkbox')?.checked;
                    onSelect(holding, groupName, limit, showPopup);
                });
            });

            document.getElementById('refresh-work-ui')?.addEventListener('click', () => {
                const holdingsData = dataProcessor.groupCompaniesByHolding();
                this.renderOverviewPanel(holdingsData, dataProcessor);
                const selectionData = workSelector.buildSelectionData(holdingsData);
                this.renderWorkSelectionPanel(selectionData, (holding, groupName, limit, showPopup) => {
                    workSelector.selectCompanies(selectionData[holding][groupName], holding, groupName, limit, showPopup);
                }, dataProcessor, workSelector);
            });
        }

        // Helper Methods
        buildOverallSummary(totalCompanies, overallManager, overallEmployee) {
            return `
                <div class="overall-summary">
                    <div class="overall-header">${config.textLabels.overallHeader}</div>
                    <div class="summary-row total-companies">🏢 ${config.textLabels.totalCompanies}: ${totalCompanies}</div>
                    ${overallManager.count > 0 ? `<div class="summary-row total-manager">🧑‍💼 ${config.textLabels.totalManager}: ${config.textLabels.worked}: ${overallManager.completed}/${overallManager.total} (${overallManager.percentage}%) over ${overallManager.count} companies</div>` : ''}
                    ${overallEmployee.count > 0 ? `<div class="summary-row total-employee">👷 ${config.textLabels.totalEmployee}: ${config.textLabels.assigned}: ${overallEmployee.completed}/${overallEmployee.total} (${overallEmployee.percentage}%) over ${overallEmployee.count} companies</div>` : ''}
                </div>
            `;
        }

        buildModeDetails(title, data) {
            if (!Object.keys(data).length) return "";
            let listItems = "";
            for (let industry in data) {
                const group = data[industry];
                if (group.count === 0) continue;
                const percentage = group.total > 0 ? ((group.completed / group.total) * 100).toFixed(1) : '0';
                listItems += `<li>${industry}: ${title === config.textLabels.managerDetails ? config.textLabels.worked : config.textLabels.assigned}: ${group.completed}/${group.total} (${percentage}%) over ${group.count} companies</li>`;
            }
            return `<div class="mode-details"><h3>${title}</h3><ul>${listItems}</ul></div>`;
        }

        buildHoldingsOverview(aggregated, results) {
            let holdingsHTML = `<div class="holdings-overview"><h2>${config.textLabels.holdingsOverview}</h2>`;
            for (let holdingName in results) {
                let totalCount = 0;
                const holdingData = results[holdingName];
                for (let fType in holdingData.Factories) {
                    for (let qual in holdingData.Factories[fType]) totalCount += holdingData.Factories[fType][qual].count;
                }
                for (let subCat in holdingData["Raw Materials"]) {
                    for (let rType in holdingData["Raw Materials"][subCat]) totalCount += holdingData["Raw Materials"][subCat][rType].count;
                }
                totalCount += holdingData.Unknown;
                if (totalCount === 0) continue;
                holdingsHTML += `<div class="holding"><h3>${holdingName}</h3>`;
                let holdingManager = { completed: 0, total: 0, count: 0 };
                for (let industry in aggregated[holdingName].manager) {
                    const group = aggregated[holdingName].manager[industry];
                    holdingManager.completed += group.completed;
                    holdingManager.total += group.total;
                    holdingManager.count += group.count;
                }
                if (holdingManager.count > 0) {
                    const holdingManagerPercentage = holdingManager.total > 0 ? ((holdingManager.completed / holdingManager.total) * 100).toFixed(1) : '0';
                    holdingsHTML += `<div class="holding-total manager-total">🧑‍💼 ${config.textLabels.totalManager}: ${config.textLabels.worked}: ${holdingManager.completed}/${holdingManager.total} (${holdingManagerPercentage}%) over ${holdingManager.count} companies</div><ul>`;
                    for (let industry in aggregated[holdingName].manager) {
                        const group = aggregated[holdingName].manager[industry];
                        if (group.count === 0) continue;
                        const percentage = group.total > 0 ? ((group.completed / group.total) * 100).toFixed(1) : '0';
                        holdingsHTML += `<li>${industry}: ${config.textLabels.worked}: ${group.completed}/${group.total} (${percentage}%) over ${group.count} companies</li>`;
                    }
                    holdingsHTML += `</ul>`;
                }
                let holdingEmployee = { completed: 0, total: 0, count: 0 };
                for (let industry in aggregated[holdingName].employee) {
                    const group = aggregated[holdingName].employee[industry];
                    holdingEmployee.completed += group.completed;
                    holdingEmployee.total += group.total;
                    holdingEmployee.count += group.count;
                }
                if (holdingEmployee.count > 0) {
                    const holdingEmployeePercentage = holdingEmployee.total > 0 ? ((holdingEmployee.completed / holdingEmployee.total) * 100).toFixed(1) : '0';
                    holdingsHTML += `<div class="holding-total employee-total">👷 ${config.textLabels.totalEmployee}: ${config.textLabels.assigned}: ${holdingEmployee.completed}/${holdingEmployee.total} (${holdingEmployeePercentage}%) over ${holdingEmployee.count} companies</div><ul>`;
                    for (let industry in aggregated[holdingName].employee) {
                        const group = aggregated[holdingName].employee[industry];
                        if (group.count === 0) continue;
                        const percentage = group.total > 0 ? ((group.completed / group.total) * 100).toFixed(1) : '0';
                        holdingsHTML += `<li>${industry}: ${config.textLabels.assigned}: ${group.completed}/${group.total} (${percentage}%) over ${group.count} companies</li>`;
                    }
                    holdingsHTML += `</ul>`;
                }
                holdingsHTML += `</div>`;
            }
            holdingsHTML += `</div>`;
            return holdingsHTML;
        }

        buildDetailedOverview(results) {
            let detailedHTML = `<div class="detailed-overview"><h2>${config.textLabels.detailedOverview}</h2>`;
            for (let holdingName in results) {
                let totalCount = 0;
                const holdingData = results[holdingName];
                for (let fType in holdingData.Factories) {
                    for (let qual in holdingData.Factories[fType]) totalCount += holdingData.Factories[fType][qual].count;
                }
                for (let subCat in holdingData["Raw Materials"]) {
                    for (let rType in holdingData["Raw Materials"][subCat]) totalCount += holdingData["Raw Materials"][subCat][rType].count;
                }
                totalCount += holdingData.Unknown;
                if (totalCount === 0) continue;
                detailedHTML += `<div class="holding"><h3>${holdingName}</h3>`;
                if (Object.keys(holdingData.Factories).length > 0) {
                    detailedHTML += '  <strong>Factories:</strong><br>';
                    for (let fType in holdingData.Factories) {
                        detailedHTML += `    <strong>${fType}</strong>:<br>`;
                        let qualities = Object.keys(holdingData.Factories[fType]).sort((a, b) => parseInt(b.replace("Q", "")) - parseInt(a.replace("Q", "")));
                        qualities.forEach(qual => {
                            let group = holdingData.Factories[fType][qual];
                            let labelCompleted = group.workMode === "employee" ? config.textLabels.assigned : config.textLabels.worked;
                            let labelRemaining = group.workMode === "employee" ? "Assign" : "Not worked";
                            let line = `${qual}: Total Companies: ${group.count}, ${labelCompleted}: ${group.completed}/${group.totalSlots}`;
                            if (group.remaining > 0) line += ` [${labelRemaining}: ${group.remaining}]`;
                            detailedHTML += `      ${line}<br>`;
                        });
                    }
                }
                if (Object.keys(holdingData["Raw Materials"]).length > 0) {
                    detailedHTML += '  <strong>Raw Materials:</strong><br>';
                    for (let subCat in holdingData["Raw Materials"]) {
                        detailedHTML += `    <strong>${subCat}</strong>:<br>`;
                        for (let rType in holdingData["Raw Materials"][subCat]) {
                            if (!rType || rType === "undefined") continue;
                            let group = holdingData["Raw Materials"][subCat][rType];
                            let labelCompleted = group.workMode === "employee" ? config.textLabels.assigned : config.textLabels.worked;
                            let labelRemaining = group.workMode === "employee" ? "Assign" : "Not worked";
                            let line = `${rType}: Total: ${group.count}, ${labelCompleted}: ${group.completed}/${group.totalSlots}`;
                            if (group.remaining > 0) line += ` [${labelRemaining}: ${group.remaining}]`;
                            detailedHTML += `      ${line}<br>`;
                        }
                    }
                }
                if (holdingData.Unknown > 0) detailedHTML += `  Unknown: ${holdingData.Unknown}<br>`;
                detailedHTML += `</div>`;
            }
            detailedHTML += `</div>`;
            return detailedHTML;
        }

        renderFactoryGroup(group) {
            let out = '';
            for (let qual in group.qualityBreakdown) {
                const sampleCompany = group.companies.find(c => c.querySelector(".mini_stars")?.className.includes(`q${qual.replace("Q", "")}`));
                const bonus = sampleCompany?.querySelector(".area_final_products .resource_bonus")?.textContent.trim() || "-";
                out += `<span style="color: lightgray;">- ${qual}: ${group.qualityBreakdown[qual]} | Bonus: <strong>${bonus}</strong></span><br>`;
            }
            return out;
        }

        renderRawMaterialGroup(group) {
            let out = '';
            for (let t in group.typeBreakdown || {}) {
                // Use the DataProcessor's extractCompanyData() method here
                const sampleCompany = group.companies.find(c =>
                                                           this.dataProcessor.extractCompanyData(c).type === t
                                                          );

                let bonus = "-";

                if (sampleCompany) {
                    const bonusEl =
                          // First try the original working selector:
                          sampleCompany.querySelector(".area_final_products .resource_bonus") ||
                          // Then try other fallbacks:
                          sampleCompany.querySelector(".resource_bonus") ||
                          sampleCompany.querySelector(".area_bonus .resource_bonus") ||
                          sampleCompany.querySelector(".bonus_icon + span") ||
                          sampleCompany.querySelector(".bonus_area .resource_bonus") ||
                          // Last chance: scan all spans/divs
                          [...sampleCompany.querySelectorAll("span, div")]
                    .find(el => el.textContent.trim().match(/^\+\d+%$/));
                    bonus = bonusEl?.textContent.trim() || "-";
                }

                out += `<span style="color: lightgray;">- ${t}: ${group.typeBreakdown[t]} | Bonus: <strong>${bonus}</strong></span><br>`;
            }
            return out;
        }
    }

    /**
     * Utils
     * -----
     * Utility class providing stateless helper functions.
     * - sanitize(str): Converts strings into ID-safe format.
     */
    class Utils {
        static sanitize(str) {
            return str.replace(/\W/g, '_');
        }
    }

    /**
     * Initialization
     * --------------
     * Orchestrates initial DOM scan, debounce observation,
     * auto-expansion of collapsed holdings, and rendering of panels.
     *
     * Logic:
     * - Injects all styles and modals.
     * - Checks if company groups are present; if yes, proceeds.
     * - Otherwise, uses MutationObserver + debounce to detect late-load.
     * - Includes 5-second fallback timeout.
     */
    const domManager = new DOMManager();
    const dataProcessor = new DataProcessor(domManager);
    const workSelector = new WorkSelector(domManager, dataProcessor);
    const uiManager = new UIManager(dataProcessor);

    function expandAllHoldings() {
        document.querySelectorAll('.companies_group').forEach(group => {
            const header = group.querySelector('.companies_header');
            const listing = group.querySelector('.companies_listing');
            if (header && listing && listing.style.display === 'none') {
                header.click(); // Simulate click to expand
            }
        });
    }

    function renderInterface() {
        const holdingsData = dataProcessor.groupCompaniesByHolding();
        uiManager.renderOverviewPanel(holdingsData, dataProcessor);
        const selectionData = workSelector.buildSelectionData(holdingsData);
        uiManager.renderWorkSelectionPanel(selectionData, (holding, groupName, limit, showPopup) => {
            workSelector.selectCompanies(selectionData[holding][groupName], holding, groupName, limit, showPopup);
        }, dataProcessor, workSelector);
    }

    function initialize() {
        StyleManager.injectAll();
        uiManager.createInfoModal();

        if (domManager.getHoldingGroups().length > 0) {
            console.log('[DEBUG] Companies group already present, initializing...');
            expandAllHoldings();
            renderInterface();
        } else {
            let debounceTimeout = null;

            const observer = new MutationObserver((mutations, obs) => {
                clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(() => {
                    if (domManager.getHoldingGroups().length > 0) {
                        console.log('[DEBUG] Companies group detected (debounced), initializing...');
                        obs.disconnect();
                        expandAllHoldings();
                        renderInterface();
                    }
                }, 200); // 200ms debounce
            });
            observer.observe(document.body, { childList: true, subtree: true });

            setTimeout(() => {
                if (domManager.getHoldingGroups().length > 0) {
                    console.log('[DEBUG] Fallback initialization after 5s');
                    renderInterface();
                } else {
                    console.log('[DEBUG] No company groups found after 5s, GUI not initialized.');
                }
            }, 5000);
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();