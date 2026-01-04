// ==UserScript==
// @name         Geoguessr Like Games - Location Finder
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Pinpointing location finder (Geoguessr, Geotastic, GeoHub, etc.).
// @author       Meffiu
// @match        https://geotastic.net/*
// @match        https://www.geoguessr.com/*
// @match        https://www.geohub.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geotastic.net
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520062/Geoguessr%20Like%20Games%20-%20Location%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/520062/Geoguessr%20Like%20Games%20-%20Location%20Finder.meta.js
// ==/UserScript==

(async function () {
    "use strict";

    // Vars
    let alertOffset = 0;
    let geocodingApiKey = loadData("geocodingApiKey");
    if (!geocodingApiKey) editGeocodingApiKey();
    let flagIDs = await loadFlagIDs();
    let defaultDescription =
        "Press search button to find location.<br>Press key button to edit Geocoding API key. (geocode.maps.co)<br>Press refresh button if searching is stuck on same location.";

    // Menu
    const style = document.createElement("style");
    style.innerHTML = `
        #dynamicMenu {
            position: fixed;
            bottom: -300px;
            left: 40px;
            width: 400px;
            background-color: #f4f4f4;
            box-shadow: 0 -2px 5px rgba(0,0,0,0.5);
            transition: bottom 0.3s ease;
            z-index: 10000;
            border-radius: 10px 10px 0 0;
        }
        #dynamicMenu.open {
            bottom: 0;
        }
        #menuTitle {
            background-color: #4CAF50;
            color: white;
            padding: 15px;
            font-size: 18px;
            text-align: left;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
        }
        #menuDescription {
            padding: 15px;
            font-size: 14px;
            color: #333;
            text-align: left;
        }
        #toggleMenu {
            position: fixed;
            bottom: 10px;
            left: 150px;
            transform: translateX(-50%);
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 15px;
            font-size: 16px;
            cursor: pointer;
            z-index: 10001;
            border-radius: 20px;
        }
        #toggleMenu:hover {
            background-color: #45a049;
        }
        #searchIcon, #keyIcon, #refreshIcon {
            position: absolute;
            top: 10px;
            width: 24px;
            height: 24px;
            cursor: pointer;
        }
        #searchIcon {
            right: 10px;
        }
        #keyIcon {
            right: 40px;
        }
        #refreshIcon {
            right: 70px;
        }
    `;
    document.head.appendChild(style);

    const toggleButton = document.createElement("button");
    toggleButton.id = "toggleMenu";
    toggleButton.textContent = `Location Finder v${GM_info.script.version}`;
    document.body.appendChild(toggleButton);

    const menu = document.createElement("div");
    menu.id = "dynamicMenu";

    const title = document.createElement("div");
    title.id = "menuTitle";
    title.textContent = `Location Finder v${GM_info.script.version}`;

    const searchIcon = document.createElement("img");
    searchIcon.id = "searchIcon";
    searchIcon.src = "https://img.icons8.com/FFFFFF/452/search--v1.png";
    title.appendChild(searchIcon);

    const keyIcon = document.createElement("img");
    keyIcon.id = "keyIcon";
    keyIcon.src = "https://img.icons8.com/FFFFFF/452/key--v1.png";
    title.appendChild(keyIcon);

    const refreshIcon = document.createElement("img");
    refreshIcon.id = "refreshIcon";
    refreshIcon.src = "https://img.icons8.com/win10/FFFFFF/452/refresh--v1.png";
    title.appendChild(refreshIcon);

    searchIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        getLocation();
    });

    keyIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        editGeocodingApiKey();
    });

    refreshIcon.addEventListener("click", (event) => {
        event.stopPropagation();
        performance.clearResourceTimings();
        log("Performance resource timings cleared.");
        showAlert(
            "Refreshed",
            "Performance resource timings has been cleared.\nTry to move around and press search button.",
            "green",
            2000
        );
    });

    const description = document.createElement("div");
    description.id = "menuDescription";
    description.innerHTML = defaultDescription;

    menu.appendChild(title);
    menu.appendChild(description);
    document.body.appendChild(menu);

    toggleButton.addEventListener("click", () => {
        menu.classList.add("open");
        toggleButton.style.display = "none";
    });

    title.addEventListener("click", () => {
        menu.classList.remove("open");
        toggleButton.style.display = "block";
    });

    // Functions
    function log(message) {
        if (message.startsWith("Error:")) {
            console.error(`[Location Finder v${GM_info.script.version}]\n${message}`);
        } else {
            console.log(`[Location Finder v${GM_info.script.version}]\n${message}`);
        }
    }

    function saveData(key, data) {
        GM_setValue(key, JSON.stringify(data));
    }

    function loadData(key) {
        const data = GM_getValue(key, null);
        return data ? JSON.parse(data) : null;
    }

    function editGeocodingApiKey() {
        const key = prompt("Please enter your Geocoding API key:");
        if (key) {
            geocodingApiKey = key;
            saveData("geocodingApiKey", key);
            log(`API key set to ${key}`);
        }
    }

    function handleError(error) {
        log(`Error:\n${error.stack}`);
        if (
            error.stack.includes("Failed to fetch") &&
            error.stack.includes("at getLatestGeoPhotoService")
        ) {
            alert(
                "CORS is not unlocked!\nDownload an extension to unlock (eg. CORS Unlocker)\n(Or unlock it by any other method)"
            );
        }
    }

    async function getLocation() {
        description.innerHTML = "Searching...";
        if (
            window.location.href.includes("geotastic.net") &&
            document.querySelector(".flag-icon")
        ) {
            const flagID = document
                .querySelector(".flag-icon img")
                .getAttribute("src")
                .split("/")[4]
                .split(".")[0];
            const country = flagIDs[flagID];
            description.innerHTML = "";
            const countryElement = document.createElement("h2");
            countryElement.style.display = "flex";
            countryElement.style.alignItems = "center";
            const flagImg = document.createElement("img");
            flagImg.src = `https://static.infra.geotastic.net/flags_rect/${flagID}.svg`;
            flagImg.alt = `${country} flag`;
            flagImg.style.marginLeft = "10px";
            flagImg.style.width = "32px";
            countryElement.textContent = country;
            countryElement.append(flagImg);
            description.appendChild(countryElement);
            return;
        }
        const geoBody = await getLatestGeoPhotoService();
        if (!geoBody) return;
        log("Got GeoPhotoService response.");

        const location = lonlatExtraction(geoBody);
        log(`Lat & Lon: ${location}`);
        const address = await getAddress(location);

        if (address) {
            description.innerHTML = "";

            if (address.country) {
                const countryElement = document.createElement("h2");
                countryElement.style.display = "flex";
                countryElement.style.alignItems = "center";
                const flagImg = document.createElement("img");
                flagImg.src = `https://flagsapi.com/${address.country_code.toUpperCase()}/flat/32.png`;
                flagImg.alt = `${address.country} flag`;
                flagImg.style.marginLeft = "10px";
                countryElement.textContent = address.country;
                countryElement.append(flagImg);
                description.appendChild(countryElement);
            }

            const ul = document.createElement("ul");

            for (let key in address) {
                if (key.includes("ISO") || key === "country_code" || key === "country") {
                    continue;
                }

                const li = document.createElement("li");
                li.textContent = `${key}: ${address[key]}`;
                ul.appendChild(li);
            }

            description.appendChild(ul);

            const button = document.createElement("button");
            button.textContent = "Open in Google Maps";
            button.style.display = "block";
            button.style.margin = "10px 0";
            button.style.padding = "5px 10px";
            button.style.fontSize = "16px";
            button.style.color = "#fff";
            button.style.backgroundColor = "#4CAF50";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.style.cursor = "pointer";
            button.style.transition = "background-color 0.3s ease";

            button.addEventListener("mouseover", () => {
                button.style.backgroundColor = "#45a049";
            });

            button.addEventListener("mouseout", () => {
                button.style.backgroundColor = "#4CAF50";
            });

            button.addEventListener("click", () => {
                window.open(`https://maps.google.com/?q=${location[0]},${location[1]}`, "_blank");
            });

            description.appendChild(button);
            performance.clearResourceTimings();
        }
    }

    async function getLatestGeoPhotoService() {
        const performanceEntries = await performance.getEntriesByType("resource");

        let lastGeoPhotoServiceRequest = null;

        for (let i = performanceEntries.length - 1; i >= 0; i--) {
            if (performanceEntries[i].name.includes("GeoPhotoService.GetMetadata")) {
                lastGeoPhotoServiceRequest = performanceEntries[i];
                break;
            }
        }

        if (lastGeoPhotoServiceRequest) {
            const geoBody = await fetch(lastGeoPhotoServiceRequest.name)
                .then((response) => response.text())
                .catch((error) => handleError(error));
            return geoBody;
        } else {
            log("No GeoPhotoService request found.");
            showAlert(
                "No GeoPhotoService request found",
                "1. Make sure you are in Street View game.\n2. Move around a few times before searching.",
                "red",
                5000
            );
            description.innerHTML = defaultDescription;
            return null;
        }
    }

    function lonlatExtraction(body) {
        const regex = /-?\d+\.\d+/g;
        const matches = body.match(regex);

        const lonlat = matches.slice(0, 2);
        return lonlat;
    }

    async function getAddress([lat, lon]) {
        const url = `https://geocode.maps.co/reverse?lat=${lat}&lon=${lon}&api_key=${geocodingApiKey}`;
        const response = await fetch(url)
            .then((response) => response.json())
            .catch((error) => handleError(error));

        log(`Address:\n${JSON.stringify(response)}`);

        if (response) {
            return response.address;
        } else {
            log(`No response from Geocoding API.`);
            showAlert(
                "No response from Geocoding API",
                "Make sure your api key is correct.",
                "red",
                5000
            );
            return null;
        }
    }

    function showAlert(title, description, color, duration) {
        const alertBox = document.createElement("div");

        alertBox.style.position = "fixed";
        alertBox.style.top = `${20 + alertOffset}px`;
        alertBox.style.right = "20px";
        alertBox.style.padding = "15px";
        alertBox.style.color = "white";
        alertBox.style.backgroundColor = color;
        alertBox.style.maxWidth = "400px";
        alertBox.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        alertBox.style.borderRadius = "10px";
        alertBox.style.zIndex = "1000";
        alertBox.style.opacity = "0";
        alertBox.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        alertBox.style.transform = "translateY(-20px)";

        const alertTitle = document.createElement("div");
        alertTitle.textContent = title;
        alertTitle.style.fontWeight = "bold";
        alertTitle.style.fontSize = "16px";
        alertTitle.style.marginBottom = "5px";

        const alertDescription = document.createElement("div");
        alertDescription.innerHTML = description.replace(/\n/g, "<br>");
        alertDescription.style.fontSize = "14px";

        alertBox.appendChild(alertTitle);
        alertBox.appendChild(alertDescription);

        document.body.appendChild(alertBox);

        requestAnimationFrame(() => {
            alertBox.style.opacity = "1";
            alertBox.style.transform = "translateY(0)";
        });

        setTimeout(() => {
            alertBox.style.opacity = "0";
            alertBox.style.transform = "translateY(-20px)";
            setTimeout(() => {
                document.body.removeChild(alertBox);
                alertOffset -= 90;
            }, 500);
        }, duration);

        alertOffset += 90;
    }

    async function loadFlagIDs() {
        const url =
            "https://gist.githubusercontent.com/Meff1u/1e596b84c8772355636326cc422a9fd0/raw/c6bf24bda96ce457b715688a692006c01807159c/flags.json";
        const response = await fetch(url)
            .then((response) => response.json())
            .catch((error) => handleError(error));

        if (response) {
            return response;
        } else {
            return null;
        }
    }

    function antiAdblockSkip() {
        const skipButton = document.querySelector(".ad-blocker-info button");
        if (skipButton) {
            skipButton.removeAttribute("disabled");
            skipButton.classList.remove("v-btn-disabled");
            skipButton.click();
        }
    }

    // MutationObserver
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                mutation.addedNodes.forEach((node) => {
                    if (
                        node.nodeType === Node.ELEMENT_NODE &&
                        node.tagName.toLowerCase() === "div" &&
                        node.getAttribute("role") === "dialog"
                    ) {
                        antiAdblockSkip();
                    }
                });
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
