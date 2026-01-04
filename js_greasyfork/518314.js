// ==UserScript==
// @name         Travel Light
// @version      2025.1
// @description  Your Journey!
// @author       You
// @match        https://www.erepublik.com/en
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @grant        none
// @namespace Amazing Journey
// @downloadURL https://update.greasyfork.org/scripts/518314/Travel%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/518314/Travel%20Light.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const counter = Number(getLocalStorageData('counter'));
    const targetKM = Number(getLocalStorageData('target'));
    const locA = Number(getLocalStorageData('locA'));
    const locB = Number(getLocalStorageData('locB'));
    const locationName = erepublik.citizen.countryLocationName;
    const current = erepublik.citizen.regionLocationId;
    const residenceId = erepublik.citizen.residence.regionId;
    const residenceCountry = erepublik.citizen.residence.countryId;
    const now = getCurrentUnixTimestamp();
    const _token = csrfToken;
    const travelPost = `https://www.erepublik.com/en/main/travelData`;
    const movePost = `https://www.erepublik.com/en/main/travel`;

    if(locA == 0){
        saveToLocalStorage('locA', 173);
    }
    if(locB == 0){
        saveToLocalStorage('locB', 714);
    }

    const captcha = checkSessionValidationExists()
    if (!captcha) {
        if (now > counter) {
            observeAndCreateModal();
        } else {
            travel();
            observeAndCreateModal();
        }
    }

    async function travel() {
        delay(3000);
        let targetLoc;
        let targetCountry;

        // Ambil miles dan target dari localStorage
        let currentMiles = Number(getLocalStorageData("currentMiles")) || 0;
        const targetMiles = Number(getLocalStorageData("target")) || 0;

        // Cek apakah perjalanan harus dilanjutkan
        if (now < counter) {

            // ❗ STOP jika currentMiles sudah mencapai target
            if (currentMiles >= targetMiles) {
                console.log("TARGET REACHED — STOP TRAVEL");
                // masuk ke blok ELSE di bawah
                if (current != residenceId) {
                    targetLoc = residenceId;
                    targetCountry = residenceCountry;

                    const payHome = move(targetLoc, targetCountry);
                    await PostRequest(payHome, movePost);
                    await delay(10000);
                    const now = getCurrentUnixTimestamp();
                    saveToLocalStorage("counter", now);
                    await delay(10000);
                    const anniv = await fetchData(`https://www.erepublik.com/id/main/anniversaryQuestData`);
                    const miles = anniv.status.inventory.miles;
                    const update = getCurrentUnixTimestamp();

                    saveToLocalStorage("currentMiles", miles);
                    saveToLocalStorage("journeyUpdate", update);

                    saveNotice.style.color = "green";
                    saveNotice.innerHTML = "✔ Data updated successfully.";
                    saveNotice.style.display = "block";
                    reloadPage();
                }
                await delay(10000);
                reloadPage();
                return;
            }

            // Lanjutkan perjalanan
            const payloadMap = getTravel(current, _token);
            const dataTravel = await PostRequest(payloadMap, travelPost);

            if (current == locA) {
                const countryB = dataTravel.regions[locB].countryId;
                targetLoc = locB;
                targetCountry = countryB;
            } else {
                const countryA = dataTravel.regions[locA].countryId;
                targetLoc = locA;
                targetCountry = countryA;
            }

            await delay(2000);
            console.log("TRAVEL");

            const payMove = move(targetLoc, targetCountry);
            await PostRequest(payMove, movePost);

            // ❗ Tambahkan miles setiap travel sukses
            currentMiles += 19953;
            saveToLocalStorage("currentMiles", currentMiles);

            console.log("Miles updated:", currentMiles.toLocaleString("en-US"));

            await delay(10000);
            reloadPage();

        } else {

            console.log("NOTHING (COUNTER FINISHED)");

            // Kembali ke residence
            if (current != residenceId) {
                targetLoc = residenceId;
                targetCountry = residenceCountry;

                const payHome = move(targetLoc, targetCountry);
                await PostRequest(payHome, movePost);

                await delay(10000);
                reloadPage();
            }
        }
    }

    // =========================
    // NEW TRAVEL CONTROL MODAL
    // =========================
    async function createModal(currentMiles) {
        if (document.getElementById('travelModal')) return;

        const target = Number(getLocalStorageData('target')) || 0;

        // GAP CALCULATION
        const gap = target > 0 ? target - currentMiles : 0;

        // LAST UPDATE FORMATTER
        const lastUpdate = getLocalStorageData("journeyUpdate");
        let formattedUpdate = "-";

        if (lastUpdate) {
            const d = new Date(lastUpdate * 1000);
            const dd = String(d.getDate()).padStart(2, "0");
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const yyyy = d.getFullYear();

            const hh = String(d.getHours()).padStart(2, "0");
            const min = String(d.getMinutes()).padStart(2, "0");

            formattedUpdate = `${dd}-${mm}-${yyyy} ${hh}:${min}`;
        }

        const modalHTML = `
    <div id="travelModal" style="
        position:fixed;
        inset:0;
        display:flex;
        justify-content:center;
        align-items:center;
        background:rgba(0,0,0,0.55);
        backdrop-filter:blur(6px);
        z-index:999999;
        animation:fadeIn .25s ease;
        font-family:Segoe UI, Roboto, sans-serif;
    ">

        <div style="
            width:400px;
            max-width:92%;
            background:#ffffff;
            padding:28px;
            border-radius:14px;
            box-shadow:0 15px 30px rgba(0,0,0,0.25);
            animation:popIn .25s cubic-bezier(.16,.8,.44,1);
            position:relative;
        ">

            <!-- CLOSE BUTTON -->
            <div id="closeModal" style="
                position:absolute;
                top:12px;
                right:14px;
                font-size:22px;
                color:#888;
                cursor:pointer;
                transition:.25s;
            ">&times;</div>

            <h2 style="
                margin:0 0 14px;
                font-size:22px;
                color:#222;
                font-weight:600;
            ">Travel Control</h2>

            <div style="font-size:14px; color:#444; margin-bottom:20px; line-height:1.55;">
                <b>Current Location:</b> ${locationName}<br>
                <b>Current Miles:</b> ${fmt(currentMiles)} KM<br>
                <b>Current Target:</b> ${fmt(target)} KM<br>
                <b>Gap (Target - Miles):</b> ${fmt(gap)} KM<br>
                <b>Last Update:</b> ${formattedUpdate}
            </div>

            <!-- TIPS / INSTRUCTIONS -->
            <div style="
                background:#f3f7ff;
                border-left:4px solid #4a8af4;
                padding:12px 14px;
                border-radius:6px;
                font-size:13px;
                margin-bottom:24px;
                line-height:1.45;
            ">
                <b>How to use:</b><br>
                1. Press <b>Update Data</b> to refresh Miles & Last Update.<br>
                2. Adjust your <b>Target</b> if needed and press <b>Change Target</b>.<br>
                3. Press <b>Fly</b> to begin auto-travel if miles are lower than target.<br>
                The system will continue automatically until your target is reached or 20 minutes have passed.
            </div>

            <label style="
                font-size:14px;
                font-weight:600;
                margin-bottom:6px;
                display:block;
            ">New Target (KM)</label>

            <input type="number" id="inputTarget" value="${target}" style="
                width:100%;
                padding:12px;
                border:1px solid #ddd;
                border-radius:8px;
                font-size:15px;
                outline:none;
                transition:.25s;
                margin-bottom:6px;
            "/>

            <div id="saveNotice" style="
                margin-top:8px;
                font-size:13px;
                color:green;
                display:none;
            "></div>

            <!-- BUTTONS -->
            <div style="
                display:flex;
                justify-content:flex-end;
                gap:10px;
                margin-top:26px;
            ">

                <button id="btnUpdateData" style="
                    padding:10px 14px;
                    background:#4a8af4;
                    color:white;
                    border:none;
                    border-radius:7px;
                    cursor:pointer;
                    font-size:14px;
                    font-weight:600;
                ">Update Data</button>

                <button id="btnChangeTarget" style="
                    padding:10px 15px;
                    background:#ffc048;
                    border:none;
                    color:#000;
                    border-radius:7px;
                    cursor:pointer;
                    font-size:14px;
                    font-weight:600;
                ">Change Target</button>

                <button id="btnFly" style="
                    padding:10px 16px;
                    background:#2ecc71;
                    color:white;
                    border:none;
                    border-radius:7px;
                    cursor:pointer;
                    font-size:14px;
                    font-weight:600;
                ">Fly</button>

            </div>
        </div>
    </div>

    <style>
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes popIn { from { transform:scale(0.88); opacity:0; } to { transform:scale(1); opacity:1; } }
    </style>
    `;

        document.body.insertAdjacentHTML("beforeend", modalHTML);

        // ELEMENTS
        const modal = document.getElementById("travelModal");
        const closeBtn = document.getElementById("closeModal");
        const btnUpdate = document.getElementById("btnUpdateData");
        const btnChangeTarget = document.getElementById("btnChangeTarget");
        const btnFly = document.getElementById("btnFly");
        const inputTarget = document.getElementById("inputTarget");
        const saveNotice = document.getElementById("saveNotice");

        // CLOSE MODAL
        closeBtn.onclick = () => modal.remove();
        modal.onclick = (e) => { if (e.target.id === "travelModal") modal.remove(); };

        // ================================
        // BUTTON 1 — UPDATE DATA
        // ================================
        btnUpdate.onclick = async () => {
            const anniv = await fetchData(`https://www.erepublik.com/id/main/anniversaryQuestData`);
            const miles = anniv.status.inventory.miles;
            const update = getCurrentUnixTimestamp();

            saveToLocalStorage("currentMiles", miles);
            saveToLocalStorage("journeyUpdate", update);

            saveNotice.style.color = "green";
            saveNotice.innerHTML = "✔ Data updated successfully.";
            saveNotice.style.display = "block";
            reloadPage();
        };

        // ================================
        // BUTTON 2 — CHANGE TARGET
        // ================================
        btnChangeTarget.onclick = () => {
            const newTarget = Number(inputTarget.value);
            if (isNaN(newTarget) || newTarget <= 0) return alert("Target must be greater than 0.");

            saveToLocalStorage("target", newTarget);

            saveNotice.style.color = "green";
            saveNotice.innerHTML = `✔ Target updated to <b>${fmt(newTarget)}</b> KM.`;
            saveNotice.style.display = "block";
        };

        // ================================
        // BUTTON 3 — FLY
        // ================================
        btnFly.onclick = () => {
            const miles = Number(getLocalStorageData("currentMiles")) || currentMiles;
            const targetKM = Number(getLocalStorageData("target")) || 0;

            const now = getCurrentUnixTimestamp();
            const next = now + 1200;

            if (targetKM > miles) {
                saveToLocalStorage("counter", next);
            }

            reloadPage();
        };
    }




    //OBSERVER - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Function to observe DOM changes and create the modal
    async function observeAndCreateModal() {
        const miles = Number(getLocalStorageData("currentMiles"));

        let triggerCount = 0; // Counter for MutationObserver triggers
        const maxTriggers = 2; // Limit for triggers


        const observer = new MutationObserver((mutationsList) => {
            console.log(triggerCount);
            triggerCount += 1;

            // Check if the modal already exists
            if (!document.getElementById('myModal')) {
                createModal(miles);
            }

            // Stop observing after reaching the trigger limit
            if (triggerCount >= maxTriggers) {
                observer.disconnect();
            }
        });

        // Start observing the document for changes
        observer.observe(document, {
            childList: true,
            subtree: true
        });
    }


    function checkSessionValidationExists() {
        if (typeof SERVER_DATA !== 'undefined' && SERVER_DATA.sessionValidation !== undefined) {
            return true;
        } else {
            return false;
        }
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function fmt(num) {
        return Number(num).toLocaleString("en-US");
    }

    async function reloadPage() {
        const refresh = getLocalStorageData('refresh');
        const now = getCurrentUnixTimestamp();
        const next = now + 900;
        saveToLocalStorage('refresh', next);
        await delay(200);

        const culture = erepublik.settings.culture;
        window.location.href = `https://www.erepublik.com/${culture}`;
    }

    async function fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            reloadPage();
            throw new Error(`Failed to fetch data from ${url}: ${error.message}`);

        }
    }

    // Function to send the payload using POST request
    async function PostRequest(payload, url) {

        try {
            await delay(1000);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: Object.keys(payload)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(payload[key])}`)
                .join('&')
            });

            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error("Error:", error);
            reloadPage();
            return null;
        }
    }

    function getCurrentUnixTimestamp() {
        const currentTime = new Date();
        const unixTimestamp = Math.floor(currentTime.getTime() / 1000); // Convert milliseconds to seconds
        return unixTimestamp;
    }


    function saveToLocalStorage(key, value) {
        // Check if the key exists in local storage
        if (localStorage.getItem(key) === null) {
            // If key does not exist, set it to default value 0
            localStorage.setItem(key, '0');
        }
        // Update the key with the new value
        localStorage.setItem(key, value);
    }

    // Function to get data from local storage or set default value
    function getLocalStorageData(key) {
        let value = localStorage.getItem(key);
        if (value === null) {
            value = 0; // Default value is '0'
            localStorage.setItem(key, value);
        }
        return value;
    }

    //PAYLOAD
    function getTravel(residenceId, _token) {
        const regionId = residenceId;
        const holdingId = 0;
        const battleId = 0;

        return {
            regionId,
            _token,
            holdingId,
            battleId
        };
    }

    function move(target, country) {
        const check = "moveAction";
        const travelMethod = "preferTicket";
        const inRegionId = target;
        const toCountryId = country;


        return {
            check,
            _token,
            travelMethod,
            inRegionId,
            toCountryId
        };
    }
})();