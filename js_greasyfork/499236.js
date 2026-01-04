// ==UserScript==
// @name         Torn Spotlight Search
// @namespace    http://tampermonkey.net/
// @version      beta-2.5.3
// @description  Navigate Torn Faster
// @author       Jayam Patel
// @match        https://www.torn.com/*
// @match        https://yata.yt/*
// @icon         https://raw.githubusercontent.com/jayam04/torn-scripts/master/tornSpotlightSearch/icon.png
// @license      Apache License 2.0
// @grant        none
// @require      https://update.greasyfork.org/scripts/501645/1416051/Torn%20UI%20Elements%20%28for%20Developers%29.js
// @require      https://update.greasyfork.org/scripts/501648/1416074/Constants%20for%20Torn%20Scripts%20%28for%20Developers%29.js
// @downloadURL https://update.greasyfork.org/scripts/499236/Torn%20Spotlight%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/499236/Torn%20Spotlight%20Search.meta.js
// ==/UserScript==

// Default Settings
const DEFAULT_MAIN_SPOTLIGHT_KEY_COMBINATION = "Ctrl+Shift+K";
const DEFAULT_MARKET_KEY_COMBINATION = "Ctrl+M";
const SETTINGS_PAGE = "/spotlight-settings.php";

// Key Combinations
const storedSpotlightTrigger = loadSetting(
    "spotlightTrigger",
    DEFAULT_MAIN_SPOTLIGHT_KEY_COMBINATION
);
const [mainKey, ...modifiers] = storedSpotlightTrigger.split("+").reverse();
const pressControlKey = modifiers.includes("Ctrl");
const pressAltKey = modifiers.includes("Alt");
const pressShiftKey = modifiers.includes("Shift");

// Define your dictionary of keys and URLs
let urlDictionary = PAGES;

// Generate marketItems from MARKET_ITEMS
let marketItems = {};
for (let i = 0; i < MARKET_ITEMS.length; i++) {
    marketItems[MARKET_ITEMS[i]] = MARKET_ITEMS[i];
}

const NOTICE_NOT_OFFICIAL =
    "Note. This isn't an official page. This page is overwritten by Spotlight Search. And is under construction.";
let overlay = createOverlay();
overlay.style.display = "none";

function addStylesAndFonts() {
    // Add Bootstrap CSS
    const bootstrapLink = document.createElement("link");
    bootstrapLink.rel = "stylesheet";
    bootstrapLink.href =
        "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css";
    document.head.appendChild(bootstrapLink);

    // Add Google Fonts
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
        "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;700&display=swap";
    document.head.appendChild(fontLink);

    // Add custom styles
    const style = document.createElement("style");
    style.textContent = `
        body {
            font-family: 'Bricolage Grotesque', sans-serif;
            background-color: #f8f9fa;
        }
        h1, h3 {
            font-weight: 700;
        }
        .custom-combo {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
}
function createOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "spotlight-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.WebkitBackdropFilter = "blur(5px)"; // For Safari
    overlay.style.zIndex = "9999999999999"; // One less than spotlight
    overlay.style.display = "none";
    document.body.appendChild(overlay);
    return overlay;
}

// const overlay = createOverlay();

const spotlightDiv = document.createElement("div");
spotlightDiv.style.zIndex = 100000000000000;
spotlightDiv.style.position = "fixed";
spotlightDiv.style.left = "50%";
spotlightDiv.style.transform = "translateX(-50%)";
spotlightDiv.style.width = "500px";
spotlightDiv.style.top = "100px";
spotlightDiv.style.visibility = "hidden";

const spotlight = document.createElement("input");
spotlight.setAttribute("type", "text");
spotlight.setAttribute("id", "spotlight");
spotlight.setAttribute("placeholder", "Spotlight Search");
spotlight.classList.add("spotlight");
// spotlight.style.width = "100%";
spotlight.style.visibility = "hidden";

spotlightDiv.appendChild(spotlight);
document.body.appendChild(spotlightDiv);

function showSpotlight(dictionary, onSelect, previewURL = true) {
    const spotlightDiv = document.createElement("div");
    spotlightDiv.setAttribute("id", "spotlightDiv");
    spotlightDiv.style.zIndex = 100000000000000;
    spotlightDiv.style.position = "fixed";
    spotlightDiv.style.left = "50%";
    spotlightDiv.style.transform = "translateX(-50%)";
    spotlightDiv.style.width = "500px";
    spotlightDiv.style.top = "100px";

    const spotlight = document.createElement("input");
    spotlight.setAttribute("type", "text");
    spotlight.setAttribute("id", "spotlight");
    spotlight.setAttribute("placeholder", "Spotlight Search");
    spotlight.classList.add("spotlight");

    spotlightDiv.appendChild(spotlight);
    document.body.appendChild(spotlightDiv);

    const overlay = createOverlay();
    overlay.style.display = "block";
    overlay.style.zIndex = "99999";

    spotlight.style.visibility = "visible";
    spotlight.value = "";
    spotlight.focus();

    setupAutocomplete(
        spotlight,
        dictionary,
        (selectedKey) => {
            document.body.removeChild(spotlightDiv);
            overlay.style.display = "none";
            onSelect(selectedKey);
        },
        previewURL
    );

    spotlight.dispatchEvent(new Event("input"));
    document.addEventListener("click", function closeSpotlight(event) {
        if (event.target.id !== "spotlight") {
            document.body.removeChild(spotlightDiv);
            overlay.style.display = "none";
            document.removeEventListener("click", closeSpotlight);
        }
    });
}

function KeyPress(e) {
    var evtobj = window.event ? event : e;
    const mainSpotlight = loadSetting(
        "mainSpotlight",
        DEFAULT_MAIN_SPOTLIGHT_KEY_COMBINATION
    );
    const marketSpotlight = loadSetting(
        "marketSpotlight",
        DEFAULT_MARKET_KEY_COMBINATION
    );
    const customCombinations = loadSetting("customCombinations", {});

    function checkKeyCombo(combo) {
        const [key, ...modifiers] = combo.split("+").reverse();
        return (
            evtobj.ctrlKey === modifiers.includes("Ctrl") &&
            evtobj.altKey === modifiers.includes("Alt") &&
            evtobj.shiftKey === modifiers.includes("Shift") &&
            evtobj.key.toUpperCase() === key
        );
    }

    // Check for main spotlight
    let keys = initializeSpotlightDictionary();
    if (checkKeyCombo(mainSpotlight)) {
        showSpotlight(keys, (selectedValue) => {
            window.location.href = keys[selectedValue];
        });
        return;
    }

    // Check for market spotlight
    if (checkKeyCombo(marketSpotlight)) {
        showSpotlight(
            marketItems,
            (selectedItem) => {
                const marketSearchUrl =
                    "https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname={q}";
                const url = marketSearchUrl.replace(
                    "{q}",
                    encodeURIComponent(selectedItem)
                );
                window.location.href = url;
            },
            (previewURL = false)
        );
        return;
    }

    // Check for custom combinations
    for (const [combo, action] of Object.entries(customCombinations)) {
        if (checkKeyCombo(combo)) {
            if (urlDictionary[action]) {
                window.location.href = urlDictionary[action];
            } else {
                window.location.href = action;
            }
            return;
        }
    }

    // Check for /add command
    if (
        evtobj.key === "Enter" &&
        document.activeElement.tagName === "INPUT" &&
        document.activeElement.value.startsWith("/add")
    ) {
        if (handleAddCommand(document.activeElement.value)) {
            document.activeElement.value = "";
            return;
        }
    }
}
function matchScore(word, string) {
    word = word.toLowerCase();
    string = string.toLowerCase();

    // Split the string into words
    const words = string.split(/\s+/);

    // Check for exact word match
    if (words.includes(word)) return [2, 0];

    // Check for partial word match
    for (let w of words) {
        if (w.includes(word)) return [1, w.indexOf(word)];
    }

    // Check for ordered character match
    let i = 0;
    let gaps = 0;
    for (let char of string) {
        if (char === word[i]) {
            i++;
            if (i === word.length) return [0, gaps];
        } else {
            gaps++;
        }
    }

    return [-1, Infinity]; // No match
}

function sortKeys(input, dictionary) {
    return Object.keys(dictionary).sort((a, b) => {
        const [scoreA, gapsA] = matchScore(input, a);
        const [scoreB, gapsB] = matchScore(input, b);

        if (scoreA !== scoreB) return scoreB - scoreA;
        if (gapsA !== gapsB) return gapsA - gapsB;
        return a.localeCompare(b);
    });
}

let currentFocus = 0;
function setupAutocomplete(
    inputElement,
    dictionary,
    onSelect,
    previewURL = true
) {
    let currentFocus = 0;

    inputElement.addEventListener("input", function () {
        closeAllLists();
        currentFocus = 0;
        const autocompleteList = document.createElement("div");
        autocompleteList.setAttribute("id", this.id + "-autocomplete-list");
        autocompleteList.setAttribute("class", "autocomplete-items");
        autocompleteList.classList.add("spotlight-suggestion-box");
        autocompleteList.style.maxHeight = "400px";
        autocompleteList.style.overflowY = "scroll";
        this.parentNode.appendChild(autocompleteList);

        const sortedKeys = sortKeys(this.value, dictionary);

        for (let i = 0; i < sortedKeys.length; i++) {
            const key = sortedKeys[i];
            const [score, _] = matchScore(this.value, key);
            if (score >= 0 || !this.value) {
                const item = document.createElement("DIV");
                item.innerHTML = key;
                if (dictionary[key] && previewURL === true) {
                    item.innerHTML +=
                        "<br><small style='font-size: 12px'>" +
                        dictionary[key] +
                        "</small>";
                }
                item.innerHTML += "<input type='hidden' value='" + key + "'>";
                item.addEventListener("click", function () {
                    inputElement.value =
                        this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                    onSelect(inputElement.value);
                });
                item.classList.add("spotlight-suggestion-item");
                if (i === currentFocus) {
                    item.classList.add("spotlight-suggestion-active");
                }
                autocompleteList.appendChild(item);
            }
        }
    });

    inputElement.addEventListener("keydown", function (e) {
        let x = document.getElementById(this.id + "-autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            } else {
                onSelect(this.value);
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = x.length - 1;
        x[currentFocus].classList.add("spotlight-suggestion-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("spotlight-suggestion-active");
        }
    }

    function closeAllLists(elmnt) {
        const x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inputElement) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

document.onkeydown = KeyPress;

document.addEventListener("click", function (event) {
    if (event.target.id != "spotlight") {
        const spotlight = document.getElementById("spotlight");
        if (spotlight) {
            spotlight.style.visibility = "gone";
            overlay.style.display = "none";
        }
        const spotlightDiv = document.getElementById("spotlightDiv");
        if (spotlightDiv) {
            spotlightDiv.style.visibility = "gone";
            overlay.style.display = "none";
        }
    }
});

let styleSheet = document.createElement("style");
styleSheet.innerHTML = `
    .spotlight {
        list-style: none;
        font: inherit;
        font-size: 18px;
        vertical-align: middle;
        border: 0;
        text-shadow: none;
        background: linear-gradient(0deg,#111,#000);
        border-radius: 5px;
        box-shadow: 0 1px 0 hsla(0,0%,100%,.102);
        box-sizing: border-box;
        color: #9f9f9f;
        display: inline;
        font-weight: 600;
        height: 36px;
        margin: 0;
        outline: none;
        padding: 0 25px 0 10px;
        width: 100%;
        line-height: 26px;
        padding-right: 26px;

        position: relative;
        zIndex: 1;
    }

    .spotlight-suggestion-item {
        text-shadow: 0 1px 0 #333;
        list-style: none;
        scrollbar-color: #666 #333;
        margin: 0;
        border: 0;
        font: inherit;
        vertical-align: baseline;
        text-decoration: none;
        color: #ccc;
        cursor: pointer;
        display: block;
        font-size: 12px;
        line-height: 18px;
        padding: 4px 10px;
        background: #333;
    }

    .spotlight-suggestion-box {
        text-shadow: 0 1px 0 #333;
        list-style: none;
        color: #666;
        scrollbar-color: #666 #333;
        margin: 0;
        padding: 0;
        border: 0;
        font: inherit;
        vertical-align: baseline;
    }

    .spotlight-suggestion-active {
        background-color: rgba(0,0,0);
    }

    .spotlight-input {
      list-style: none;
      margin: 0;
      font: inherit;
      font-family: Arial, serif;
      color: var(--input-color);
      background: var(--input-background-color);
      border: 1px solid;
      border-color: var(--input-border-color);
      line-height: 14px;
      height: 14px;
      border-radius: 5px;
      text-align: left;
      padding-top: 4px;
      padding-right: 5px;
      padding-bottom: 4px;
      display: inline-block;
      vertical-align: middle;
      padding-left: 5px;
      width: 212px;
    }

    #settingsContainer {
      padding: 50px;
    }
`;

document.body.appendChild(styleSheet);

function createSettingsPage() {
    addNotificationOfNotTornPage();

    // Create settings container
    const settingsContainer = document.createElement("div");
    settingsContainer.id = "settingsContainer";
    // settingsContainer.id = 'spotlight-settings';
    // settingsContainer.style.padding = '20px';
    // settingsContainer.style.maxWidth = '800px';
    // settingsContainer.style.margin = '0 auto';

    // Add title
    // const title = document.createElement('h1');
    // title.textContent = 'Torn Spotlight Search Settings';
    // settingsContainer.appendChild(title);

    // const additionalConfig = createOtherSettingsDivision();
    // settingsContainer.appendChild(additionalConfig);
    //

    // Donation Links
    const donationDiv = createDonationLinks();
    settingsContainer.appendChild(donationDiv);

    // 1. Main Spotlight
    const mainSpotlightSection = createKeyBindingSection(
        "Main Spotlight",
        "mainSpotlight",
        loadSetting("mainSpotlight", DEFAULT_MAIN_SPOTLIGHT_KEY_COMBINATION)
    );
    settingsContainer.appendChild(mainSpotlightSection);

    // 2. Market Spotlight
    const marketSpotlightSection = createKeyBindingSection(
        "Market Spotlight",
        "marketSpotlight",
        loadSetting("marketSpotlight", DEFAULT_MARKET_KEY_COMBINATION)
    );
    settingsContainer.appendChild(marketSpotlightSection);

    // Custom key combinations section
    const customSection = document.createElement("div");
    customSection.id = "custom-key-combinations";
    const customTitle = document.createElement("h3");
    customTitle.textContent = "Custom Key Combinations";
    customSection.appendChild(customTitle);

    // Add button for new custom combination
    const addButton = document.createElement("button");
    addButton.textContent = "Add Custom Combination";
    addButton.classList.add("torn-btn");
    addButton.classList.add("btn-small");
    addButton.addEventListener("click", () =>
        addCustomCombination(customSection)
    );
    customSection.appendChild(addButton);

    settingsContainer.appendChild(customSection);

    // Load existing custom combinations
    const customCombinations = loadSetting("customCombinations", {});
    for (const [key, value] of Object.entries(customCombinations)) {
        addCustomCombination(customSection, key, value);
    }

    // Custom Pages
    // Spotlight Dictionary section
    const dictionarySection = document.createElement("div");
    dictionarySection.id = "spotlight-dictionary";
    dictionarySection.className = "mt-4";
    const dictionaryTitle = document.createElement("h3");
    dictionaryTitle.textContent = "Spotlight Dictionary";
    dictionaryTitle.className = "mb-3";
    dictionarySection.appendChild(dictionaryTitle);

    const spotlightDict = initializeSpotlightDictionary();
    for (const [name, url] of Object.entries(spotlightDict)) {
        addDictionaryItemToSettings(dictionarySection, name, url);
    }

    // Add new item button
    const addButton2 = document.createElement("button");
    addButton2.textContent = "Add New Page";
    addButton2.className = "torn-btn btn-small";
    addButton2.addEventListener("click", () =>
        addDictionaryItemToSettings(dictionarySection, "", "")
    );
    dictionarySection.appendChild(addButton2);

    settingsContainer.appendChild(dictionarySection);
    // const customPagesSection = document.createElement("div");
    // customPagesSection.id = "custom-pages";
    // customPagesSection.className = "mt-4";
    // const customPagesTitle = document.createElement("h3");
    // customPagesTitle.textContent = "Custom Pages";
    // customPagesTitle.className = "mb-3";
    // customPagesSection.appendChild(customPagesTitle);

    // const customPages = loadSetting("customPages", {});
    // for (const [name, url] of Object.entries(customPages)) {
    //   addCustomPageToSettings(customPagesSection, name, url);
    // }

    // settingsContainer.appendChild(customPagesSection);

    // Save button
    const footerDiv = document.createElement("div");
    footerDiv.style.position = "fixed";
    footerDiv.style.bottom = "0";
    footerDiv.style.width = "100%";
    settingsContainer.appendChild(footerDiv);
    const saveButton = document.createElement("button");
    saveButton.textContent = "Save Settings";
    saveButton.classList.add("torn-btn");
    saveButton.style.marginTop = "20px";
    saveButton.addEventListener("click", saveSettings);
    footerDiv.appendChild(saveButton);

    // Change title of Page
    document.title = "Settings | Spotlight Search";

    // Add settings to main container
    const defaultMainContainer = document.getElementById("mainContainer");
    defaultMainContainer.innerHTML = "";
    defaultMainContainer.appendChild(settingsContainer);
}

function createKeyBindingSection(label, id, defaultValue) {
    const section = document.createElement("div");
    section.style.marginBottom = "20px";

    const sectionLabel = document.createElement("p");
    sectionLabel.textContent = label;
    section.appendChild(sectionLabel);

    const input = document.createElement("input");
    input.type = "text";
    input.id = id;
    input.value = defaultValue;
    input.classList.add("input-text");
    input.classList.add("spotlight-input");
    input.addEventListener("keydown", captureKeyCombo);
    section.appendChild(input);

    return section;
}

function addCustomCombination(
    parentElement,
    existingKey = "",
    existingValue = ""
) {
    const combinationDiv = document.createElement("div");
    combinationDiv.style.marginBottom = "10px";

    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.placeholder = "Key Combination";
    keyInput.value = existingKey;
    keyInput.classList.add("spotlight-input");
    keyInput.addEventListener("keydown", captureKeyCombo);
    combinationDiv.appendChild(keyInput);

    const selectElement = document.createElement("select");
    selectElement.style.marginLeft = "10px";

    // Add options from urlDictionary
    for (const key of Object.keys(urlDictionary)) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        option.classList.add("item");
        selectElement.appendChild(option);
    }

    // Add 'Other' option
    const otherOption = document.createElement("option");
    otherOption.value = "other";
    otherOption.textContent = "Other";
    selectElement.appendChild(otherOption);

    combinationDiv.appendChild(selectElement);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.placeholder = "Custom URL";
    urlInput.style.display = "none";
    urlInput.style.marginLeft = "10px";
    urlInput.classList.add("spotlight-input");
    combinationDiv.appendChild(urlInput);

    if (existingValue && !urlDictionary[existingValue]) {
        selectElement.value = "other";
        urlInput.style.display = "inline-block";
        urlInput.value = existingValue;
    } else if (existingValue) {
        selectElement.value = existingValue;
    }

    selectElement.addEventListener("change", () => {
        if (selectElement.value === "other") {
            urlInput.style.display = "inline-block";
        } else {
            urlInput.style.display = "none";
        }
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.style.marginLeft = "10px";
    removeButton.classList.add("torn-btn");
    removeButton.classList.add("btn-small");
    removeButton.addEventListener("click", () =>
        parentElement.removeChild(combinationDiv)
    );
    combinationDiv.appendChild(removeButton);

    parentElement.insertBefore(combinationDiv, parentElement.lastElementChild);
}

function saveSettings() {
    const mainSpotlight = document.getElementById("mainSpotlight").value;
    const marketSpotlight = document.getElementById("marketSpotlight").value;

    saveSetting("mainSpotlight", mainSpotlight);
    saveSetting("marketSpotlight", marketSpotlight);

    const customCombinations = {};
    const customSection = document.getElementById("custom-key-combinations");
    const combinationDivs = customSection.getElementsByTagName("div");

    for (const div of combinationDivs) {
        const keyCombo = div.getElementsByTagName("input")[0].value;
        const selectElement = div.getElementsByTagName("select")[0];
        const urlInput = div.getElementsByTagName("input")[1];

        if (keyCombo) {
            if (selectElement.value === "other") {
                customCombinations[keyCombo] = urlInput.value;
            } else {
                customCombinations[keyCombo] = selectElement.value;
            }
        }
    }

    // const customPages = {};
    // const customPagesSection = document.getElementById("custom-pages");
    // const pageDivs = customPagesSection.getElementsByClassName("custom-page");
    // for (const div of pageDivs) {
    //   const nameInput = div.getElementsByTagName("input")[0];
    //   const urlInput = div.getElementsByTagName("input")[1];
    //   customPages[nameInput.value] = urlInput.value;
    // }
    // saveSetting("customPages", customPages);

    const spotlightDict = {};
    const dictionarySection = document.getElementById("spotlight-dictionary");
    const itemDivs =
        dictionarySection.getElementsByClassName("dictionary-item");
    for (const div of itemDivs) {
        const nameInput = div.getElementsByTagName("input")[0];
        const urlInput = div.getElementsByTagName("input")[1];
        if (nameInput.value && urlInput.value) {
            spotlightDict[nameInput.value] = urlInput.value;
        }
    }
    saveSetting("spotlightDictionary", spotlightDict);

    saveSetting("customCombinations", customCombinations);

    alert("Settings saved successfully!");
}

function loadSetting(key, defaultValue) {
    const value = localStorage.getItem(`spotlightSearch_${key}`);
    return value !== null ? JSON.parse(value) : defaultValue;
}

function saveSetting(key, value) {
    localStorage.setItem(`spotlightSearch_${key}`, JSON.stringify(value));
}

function captureKeyCombo(event) {
    event.preventDefault();
    const key = event.key.toUpperCase();
    const combo = [];
    if (event.ctrlKey) combo.push("Ctrl");
    if (event.altKey) combo.push("Alt");
    if (event.shiftKey) combo.push("Shift");
    combo.push(key);
    event.target.value = combo.join("+");
}

// Add this near the top of your script
if (window.location.pathname === SETTINGS_PAGE) {
    styleSheet += `
    * {
    font-family: 'Bricolage Grotesque';
    }
    `;
    createSettingsPage();
    return;
}

function createOtherSettingsDivision() {
    const mainDivision = document.createElement("div");

    // Preview URL
    const previewURL = document.createElement("div");
    const previewURLCheckbox = document.createElement("input");
    previewURLCheckbox.type = "checkbox";
    previewURLCheckbox.id = "previewURLCheckbox";
    previewURLCheckbox.checked = loadSetting("previewURL", true);
    previewURL.appendChild(previewURLCheckbox);
    previewURL.appendChild(document.createTextNode("Preview URL"));

    // Add all childs
    mainDivision.appendChild(previewURL);

    return mainDivision;
}

function addCustomPageToSettings(parentElement, name, url) {
    const pageDiv = document.createElement("div");
    pageDiv.className = "custom-page mb-3 p-3 custom-combo";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "form-control mb-2 spotlight-input";
    nameInput.value = name;
    pageDiv.appendChild(nameInput);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.className = "form-control mb-2 spotlight-input";
    urlInput.value = url;
    pageDiv.appendChild(urlInput);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "btn btn-danger btn-sm torn-btn btn-small";
    removeButton.addEventListener("click", () => {
        parentElement.removeChild(pageDiv);
        const customPages = loadSetting("customPages", {});
        delete customPages[name];
        saveSetting("customPages", customPages);
    });
    pageDiv.appendChild(removeButton);

    parentElement.appendChild(pageDiv);
}

/**
 * Add a notification that this is not an official Torn page.
 */
function addNotificationOfNotTornPage() {
    const headerRootElement = document.getElementById("header-root");
    const notifyUser = document.createElement("div");
    const notifyUserText = document.createElement("h4");
    notifyUserText.textContent = NOTICE_NOT_OFFICIAL;
    notifyUser.style.color = "#f00";
    notifyUser.style.marginTop = "20px";
    notifyUserText.style.fontSize = "12px";
    notifyUser.appendChild(notifyUserText);
    headerRootElement.appendChild(notifyUser);
}

function handleAddCommand(command) {
    const match = command.match(/^\/add\s*(.*)$/);
    if (match) {
        const pageName = match[1].trim() || `Custom Page ${Date.now()}`;
        const currentUrl = window.location.href;
        addCustomPage(pageName, currentUrl);
        return true;
    }
    return false;
}

function addCustomPage(name, url) {
    const spotlightDict = loadSetting("spotlightDictionary", {});
    spotlightDict[name] = url;
    saveSetting("spotlightDictionary", spotlightDict);
    alert(`Added "${name}" to spotlight dictionary.`);
}

function addDictionaryItemToSettings(parentElement, name, url) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "dictionary-item mb-3 p-3 custom-combo";
    itemDiv.style.marginBottom = "10px";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.className = "form-control mb-2 spotlight-input";
    nameInput.value = name;
    nameInput.placeholder = "Name";
    itemDiv.appendChild(nameInput);

    const urlInput = document.createElement("input");
    urlInput.type = "text";
    urlInput.className = "form-control spotlight-input";
    urlInput.value = url;
    urlInput.placeholder = "URL";
    itemDiv.appendChild(urlInput);

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "btn btn-danger btn-sm torn-btn btn-small";
    removeButton.addEventListener("click", () => {
        parentElement.removeChild(itemDiv);
    });
    itemDiv.appendChild(removeButton);

    parentElement.appendChild(itemDiv);
}

function initializeSpotlightDictionary() {
    const storedDictionary = loadSetting("spotlightDictionary", null);
    if (storedDictionary === null) {
        saveSetting("spotlightDictionary", urlDictionary);
        return urlDictionary;
    }
    return storedDictionary;
}

function createDonationLinks() {
    const donationLinks = document.createElement("div");

    const buyMeACoffee = document.createElement("a");
    buyMeACoffee.href = "https://www.buymeacoffee.com/jayampatel";
    buyMeACoffee.target = "_blank";
    buyMeACoffee.className = "btn btn-primary btn-sm torn-btn btn-big";
    buyMeACoffee.textContent = "Buy me a Coffee";

    buyMeACoffee.style.marginRight = "10px";

    const orBuySomeXanax = document.createElement("a");
    orBuySomeXanax.href = "https://www.torn.com/profiles.php?XID=3165209";
    orBuySomeXanax.target = "_blank";
    orBuySomeXanax.className = "btn btn-primary btn-sm torn-btn btn-big";
    orBuySomeXanax.textContent = "Or buy some Xanax";

    const notice = document.createElement("p");
    notice.textContent =
        "You are donating to me (developer of this extension) and NOT to Torn.";
    notice.style.marginTop = "10px";
    notice.style.marginBottom = "10px";
    notice.style.fontSize = "12px";
    notice.style.color = "#088";

    donationLinks.appendChild(buyMeACoffee);
    donationLinks.appendChild(orBuySomeXanax);
    donationLinks.appendChild(notice);
    return donationLinks;
}

// Add Spotlight Icon in Status Icons
addIconInStatusIcons(
    SETTINGS_PAGE,
    "https://raw.githubusercontent.com/jayam04/torn-scripts/master/tornSpotlightSearch/icon.png"
);
