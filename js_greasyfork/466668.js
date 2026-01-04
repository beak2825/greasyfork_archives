// ==UserScript==
// @name         YMS ASSISTANT
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Dodaje przyciski do opisywania assetow w yms, oraz opisuje kolejność assetów na polach
// @author       @nowaratn
// @match        https://trans-logistics-eu.amazon.com/yms/shipclerk/*
// @match        https://jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com*
// @require      https://unpkg.com/axios/dist/axios.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/466668/YMS%20ASSISTANT.user.js
// @updateURL https://update.greasyfork.org/scripts/466668/YMS%20ASSISTANT.meta.js
// ==/UserScript==

let nonInvType = "";
let CONTENT = "";
let department = "";



(async function() {
    'use strict';



    let isProcessing = false;

    function addRefreshButton() {
        if (document.getElementById('refresh-order-button')) return;

        const button = document.createElement('button');
        button.id = 'refresh-order-button';
        button.innerHTML = '↻ Update Order';
        button.style.cssText = `
        position: fixed;
        bottom: 25%;
        right: 20px;
        z-index: 9999;
        background-color: #0087FF;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        transition: background-color 0.3s, transform 0.1s;
    `;

        button.addEventListener('mouseover', () => {
            if (!isProcessing) button.style.backgroundColor = '#006acc';
        });
        button.addEventListener('mouseout', () => {
            if (!isProcessing) button.style.backgroundColor = '#0087FF';
        });
        button.addEventListener('click', () => {
            if (!isProcessing) startMonitoring();
        });

        document.body.appendChild(button);
    }

    function updateButtonState(processing) {
        const button = document.getElementById('refresh-order-button');
        if (button) {
            if (processing) {
                button.style.backgroundColor = '#666666';
                button.style.cursor = 'not-allowed';
                button.innerHTML = '⏳ Processing...';
            } else {
                button.style.backgroundColor = '#0087FF';
                button.style.cursor = 'pointer';
                button.innerHTML = '↻ Update Order';
            }
        }
    }

    function findRowByAssetData(asset) {
        const rows = document.querySelectorAll('tr.ng-scope');
        for (const row of rows) {
            // Sprawdź vehicle number
            if (asset.vehicleNumber) {
                const vehicleNumber = row.querySelector('.vehicle-number-LP span');
                if (vehicleNumber && vehicleNumber.textContent.trim() === asset.vehicleNumber) {
                    return row;
                }
            }

            // Sprawdź license plate
            if (asset.licensePlate && asset.licensePlate.registrationIdentifier) {
                const licensePlate = row.querySelector('.license-plate span');
                if (licensePlate && licensePlate.textContent.includes(asset.licensePlate.registrationIdentifier)) {
                    return row;
                }
            }
        }
        return null;
    }


    function processYardData(data) {
        try {
            data.locationsSummaries.forEach(summary => {
                summary.locations.forEach(location => {
                    if (location.yardAssets?.length > 1) {
                        console.log('Processing location:', location.code);

                        const assets = location.yardAssets
                        .map(asset => ({
                            id: asset.id,
                            vehicleNumber: asset.vehicleNumber,
                            licensePlate: asset.licensePlateIdentifier,
                            arrivalTime: asset.datetimeOfArrivalAtLocation
                        }))
                        .sort((a, b) => b.arrivalTime - a.arrivalTime);

                        assets.forEach((asset, index) => {
                            setTimeout(() => {
                                addOrderInfo(asset, index, assets.length);
                            }, index * 100);
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error processing yard data:', error);
            console.error('Data structure:', data);
        }
    }


    function addOrderInfo(asset, order, totalAssets) {
        console.log(`Trying to add order info for asset ${asset.id}: ${order + 1}/${totalAssets}`);

        const row = findRowByAssetData(asset);
        if (!row) {
            console.log(`Row not found for asset ${asset.id}`);
            return;
        }

        const timeCell = row.querySelector('.col4');
        if (!timeCell) {
            console.log(`Time cell not found for asset ${asset.id}`);
            return;
        }

        const existingOrder = timeCell.querySelector('.order-indicator');
        if (existingOrder) {
            console.log(`Existing order indicator found for ${asset.id}: ${existingOrder.textContent}`);
            if (existingOrder.dataset.order === `${order}/${totalAssets}`) {
                console.log(`Order indicator already has correct value for ${asset.id}`);
                return;
            }
            existingOrder.remove();
        }

        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-indicator';
        orderDiv.dataset.order = `${order}/${totalAssets}`;
        orderDiv.style.cssText = `
        font-weight: bold;
        color: ${order === 0 ? 'green' : (order === totalAssets - 1 ? 'red' : 'orange')};
        height: auto;
    `;
        orderDiv.textContent = `#${order + 1}/${totalAssets}`;
        timeCell.appendChild(orderDiv);
        console.log(`Successfully added order indicator for ${asset.id}: ${order + 1}/${totalAssets}`);
    }


    function getSecurityToken() {
        const scripts = document.getElementsByTagName('script');
        for (let script of scripts) {
            const content = script.textContent || '';
            if (content.includes('window.ymsSecurityToken')) {
                // console.log('Found token script:', content); // Debug
                const match = content.match(/window\.ymsSecurityToken\s*=\s*"([^"]+)"/);
                if (match && match[1]) {
                    const token = match[1];
                    console.log('Extracted token:', token); // Debug
                    // Sprawdź czy token jest aktualny
                    try {
                        const tokenData = JSON.parse(atob(token.split('.')[1]));
                        console.log('Token data:', tokenData); // Debug
                        const now = Math.floor(Date.now() / 1000);
                        if (tokenData.exp < now) {
                            console.warn('Token expired, needs refresh');
                            return null;
                        }
                        return token;
                    } catch (e) {
                        console.error('Error parsing token:', e);
                        return null;
                    }
                }
            }
        }
        return null;
    }

    function startMonitoring() {
        if (isProcessing) return;

        const token = getSecurityToken();
        if (!token) {
            console.error('Security token not found or expired');
            return;
        }



        // console.log('Using token:', token); // Debug

        isProcessing = true;
        updateButtonState(true);


        GM_xmlhttpRequest({
            method: "POST",
            url: "https://jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com/call/getYardStateWithPendingMoves",
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:140.0) Gecko/20100101 Firefox/140.0",
                "Host": "jwmjkz3dsd.execute-api.eu-west-1.amazonaws.com",
                "Accept": "application/json, text/plain, */*",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br, zstd",
                "api": "getYardStateWithPendingMoves",
                "method": "POST",
                "token": token,
                "Content-Type": "application/json;charset=utf-8",
                "Origin": "https://trans-logistics-eu.amazon.com",
                "Connection": "keep-alive",
                "Referer": "https://trans-logistics-eu.amazon.com/",
                "Sec-Fetch-Dest": "empty",
                "Sec-Fetch-Mode": "cors",
                "Sec-Fetch-Site": "cross-site",
                "TE": "trailers"
            },
            data: JSON.stringify({"requester":{"system":"YMSWebApp"}}),
            onload: function(response) {
                console.log('Response status:', response.status);
                console.log('Raw response:', response.responseText);

                try {
                    const data = JSON.parse(response.responseText);
                    if (data && data.locationsSummaries) {
                        processYardData(data);
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                } catch (error) {
                    console.error('Error processing response:', error);
                } finally {
                    isProcessing = false;
                    updateButtonState(false);
                }
            },
            onerror: function(error) {
                console.error('Request error:', error);
                isProcessing = false;
                updateButtonState(false);
            }
        });
    }


    // Dodaj przycisk po załadowaniu strony
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addRefreshButton);
    } else {
        addRefreshButton();
    }


    // Funkcja tworząca przycisk w okienku modalnym
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", onClick);
        return button;
    }

    // Funkcja tworząca okienko modalne z przyciskami
    function createModal() {
        const modal = document.getElementById("yms-annotation-modal");
        if(!document.getElementById("YMS_Assistant_id"))
        {
            const modalContent = document.createElement("div");
            modalContent.style.display = "flex";
            modalContent.id = "YMS_Assistant_id";
            modalContent.style.justifyContent = "space-around";

            // Tworzenie przycisków
            const buttons = [
                { text: "DEFECTS", onClick: createDefectsModal },
                { text: "IB ASSETS", onClick: createIbModal },
                { text: "CRET/CD ASSETS", onClick: createCRETCDModal },
                { text: "NON-INV", onClick: createNonInvModal }
            ];

            // Tworzenie i dodawanie przycisków do okienka modalnego
            buttons.forEach(function(buttonData) {
                const button = createButton(buttonData.text, buttonData.onClick);
                modalContent.appendChild(button);
            });

            // Dodawanie okienka modalnego z przyciskami do modala
            modal.appendChild(modalContent);
        }
    }


    // Funkcja tworząca okienko modalne dla przycisku "CRET/CD Assets"
    function createCRETCDModal () {
        const CRETCD = document.getElementById("CRETCD_id");
        if(!CRETCD) {
            const CRETCD = document.createElement("div");
            CRETCD.id = "CRETCD_id";
            CRETCD.style.position = "fixed";
            CRETCD.style.top = "50%";
            CRETCD.style.left = "20%";
            CRETCD.style.transform = "translate(-50%, -50%)";
            CRETCD.style.width = "20%";
            CRETCD.style.backgroundColor = "white";
            CRETCD.style.padding = "20px";
            CRETCD.style.display = "flex";
            CRETCD.style.flexDirection = "column";
            CRETCD.style.alignItems = "center";
            CRETCD.style.textAlign = "center";
            CRETCD.style.zIndex = "9999";
            CRETCD.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = "CRET/CD Assets";
            title.id = "CRETCD_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            CRETCD.appendChild(title);


            const isavridLabel = document.createElement("h3");
            isavridLabel.textContent = "VRID/ISA";
            CRETCD.appendChild(isavridLabel);

            const isavridInput = document.createElement("input");
            isavridInput.type = "text";
            isavridInput.name = "ISAVRID";
            CRETCD.appendChild(isavridInput);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = "LOGIN";
            CRETCD.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            CRETCD.appendChild(loginInput);


            const radioButtonsContainer = document.createElement("div");
            radioButtonsContainer.style.width = "100%";
            radioButtonsContainer.style.display = "flex";
            radioButtonsContainer.style.justifyContent = "space-around";
            radioButtonsContainer.style.marginBottom = "10px";

            const radioButtonsData = [
                { label: "Customer Returns", value: "CRET" },
                { label: "Clean Decant", value: "CLEAN DECANT" }
            ];


            radioButtonsData.forEach(function(radioButtonData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "DEPARTMENT";
                radioButton.value = radioButtonData.value;
                radioButton.style.marginLeft = "5px";

                const label = document.createElement("label");
                label.innerHTML = radioButtonData.label + "<br>";
                label.appendChild(radioButton);

                radioButtonsContainer.appendChild(label);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        const selectedValue = radioButton.value;
                        CONTENT = selectedValue;
                    }
                });
            });

            const content_label = document.createElement("h3");
            content_label.textContent = "DEPARTMENT";
            CRETCD.appendChild(content_label);
            CRETCD.appendChild(radioButtonsContainer);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = "Date of unloading";
            CRETCD.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            unloadingDateInput.addEventListener("click", function() {
                // Tu można dodać logikę wyświetlania kalendarza
            });
            CRETCD.appendChild(unloadingDateInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = "Description";
            CRETCD.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            CRETCD.appendChild(descrTextarea);


            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = "Report";
            reportTextareaLabel.style.marginTop = "20px";
            CRETCD.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            CRETCD.appendChild(reportTextarea);


            const createButton = document.createElement("button");
            createButton.textContent = "CREATE";
            createButton.addEventListener("click", function() {
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const isavrid = isavridInput.value;

                let report = "";

                if (!isavrid) {
                    report = "Nie wpisano numeru VRID/ISA";
                } else if (!CONTENT) {
                    report = "Nie wybrano czyjego działu jest to Asset (DEPARTMENT)";
                } else if (!unloadingDate) {
                    report = "Nie wpisano dnia rozładunku Assetu (Date of unloading)";
                }
                else
                {
                    if(CONTENT == "CRET")
                    {
                        report = `CRET RETURNS LOAD\nVRID/ISA: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                    else
                    {
                        report = `IBCRET CLEAN DECANT LOAD\nVRID/ISA: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                }

                reportTextarea.value = report;
            });

            CRETCD.appendChild(createButton);


            // Tworzenie guzika kopiuj
            const createButtonCopy = document.createElement("button");
            createButtonCopy.textContent = "COPY";
            createButtonCopy.disabled = true;
            createButtonCopy.addEventListener("click", function() {
                document.getElementById("noteTextArea").value = reportTextarea.value;
            });

            // CRETCD.appendChild(createButtonCopy);

            // Tworzenie guzika zamknij
            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("CRETCD_id"));
                CRETCD.style.display = "none";
            });
            CRETCD.appendChild(closeButton);

            document.body.appendChild(CRETCD);
            dragElement(document.getElementById("CRETCD_id"));
        }
        else
        {
            CRETCD.style.display = "flex";
        }
    }




    // Funkcja tworząca okienko modalne dla przycisku "IB Assets"
    function createIbModal () {
        const modal_ib = document.getElementById("modal_ib_id");
        if(!modal_ib) {
            const modal_ib = document.createElement("div");
            modal_ib.id = "modal_ib_id";
            modal_ib.style.position = "fixed";
            modal_ib.style.top = "50%";
            modal_ib.style.left = "20%";
            modal_ib.style.transform = "translate(-50%, -50%)";
            modal_ib.style.width = "20%";
            modal_ib.style.backgroundColor = "white";
            modal_ib.style.padding = "20px";
            modal_ib.style.display = "flex";
            modal_ib.style.flexDirection = "column";
            modal_ib.style.alignItems = "center";
            modal_ib.style.textAlign = "center";
            modal_ib.style.zIndex = "9999";
            modal_ib.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = "IB Assets";
            title.id = "modal_ib_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            modal_ib.appendChild(title);


            const isavridLabel = document.createElement("h3");
            isavridLabel.textContent = "ISA/VRID";
            modal_ib.appendChild(isavridLabel);

            const isavridInput = document.createElement("input");
            isavridInput.type = "text";
            isavridInput.name = "ISAVRID";
            modal_ib.appendChild(isavridInput);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = "LOGIN";
            modal_ib.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modal_ib.appendChild(loginInput);


            const radioButtonsContainer = document.createElement("div");
            radioButtonsContainer.style.width = "100%";
            radioButtonsContainer.style.display = "flex";
            radioButtonsContainer.style.justifyContent = "space-around";
            radioButtonsContainer.style.marginBottom = "10px";

            const radioButtonsData = [
                { label: "FBA", value: "FBA" },
                { label: "VENDOR", value: "VENDOR" },
                { label: "PARCEL", value: "PARCEL" },
                { label: "TRANS", value: "TRANS" }
            ];


            radioButtonsData.forEach(function(radioButtonData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "CONTENT";
                radioButton.value = radioButtonData.value;
                radioButton.style.marginLeft = "5px";

                const label = document.createElement("label");
                label.innerHTML = radioButtonData.label + "<br>";
                label.appendChild(radioButton);

                radioButtonsContainer.appendChild(label);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        const selectedValue = radioButton.value;
                        CONTENT = selectedValue;
                    }
                });
            });

            const content_label = document.createElement("h3");
            content_label.textContent = "CONTENT";
            modal_ib.appendChild(content_label);
            modal_ib.appendChild(radioButtonsContainer);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = "Date of unloading";
            modal_ib.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            unloadingDateInput.addEventListener("click", function() {
                // Tu można dodać logikę wyświetlania kalendarza
            });
            modal_ib.appendChild(unloadingDateInput);

            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = "Description";
            modal_ib.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            modal_ib.appendChild(descrTextarea);


            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = "Report";
            reportTextareaLabel.style.marginTop = "20px";
            modal_ib.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            modal_ib.appendChild(reportTextarea);


            const createButton = document.createElement("button");
            createButton.textContent = "CREATE";
            createButton.addEventListener("click", function() {
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const isavrid = isavridInput.value;

                let report = "";

                if (!isavrid) {
                    report = "Nie wpisano numeru ISA/VRID";
                } else if (!CONTENT) {
                    report = "Nie wybrano co zawiera dany Asset (CONTENT)";
                } else if (!unloadingDate) {
                    report = "Nie wpisano dnia rozładunku Assetu (Date of unloading)";
                }
                else
                {
                    if(CONTENT == "TRANS")
                    {
                        report = `IB ${CONTENT}\nVRID: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                    else
                    {
                        report = `IB ${CONTENT}\nISA: ${isavrid}\nUnloading date: ${unloadingDate}\nDescr: ${descrTextarea.value}\n${login}`;
                    }
                }

                reportTextarea.value = report;
            });

            modal_ib.appendChild(createButton);


            // Tworzenie guzika kopiuj
            const createButtonCopy = document.createElement("button");
            createButtonCopy.textContent = "COPY";
            createButtonCopy.disabled = true;
            createButtonCopy.addEventListener("click", function() {
                document.getElementById("noteTextArea").value = reportTextarea.value;
            });

            // modal_ib.appendChild(createButtonCopy);

            // Tworzenie guzika zamknij
            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_ib_id"));
                modal_ib.style.display = "none";
            });
            modal_ib.appendChild(closeButton);

            document.body.appendChild(modal_ib);
            dragElement(document.getElementById("modal_ib_id"));
        }
        else
        {
            modal_ib.style.display = "flex";
        }
    }





    // Funkcja tworząca okienko modalne dla przycisku "NON-INV"
    function createNonInvModal () {
        const modal_noninv = document.getElementById("modal_noninv_id");
        if(!modal_noninv) {
            const modal_noninv = document.createElement("div");
            modal_noninv.id = "modal_noninv_id";
            modal_noninv.style.position = "fixed";
            modal_noninv.style.top = "50%";
            modal_noninv.style.left = "20%";
            modal_noninv.style.transform = "translate(-50%, -50%)";
            modal_noninv.style.width = "20%";
            modal_noninv.style.backgroundColor = "white";
            modal_noninv.style.padding = "20px";
            modal_noninv.style.display = "flex";
            modal_noninv.style.flexDirection = "column";
            modal_noninv.style.alignItems = "center";
            modal_noninv.style.textAlign = "center";
            modal_noninv.style.zIndex = "9999";
            modal_noninv.style.border = "10px silver solid";

            const title = document.createElement("h1");
            title.textContent = "NON-INVENTORY";
            title.id = "modal_noninv_idheader";
            title.style.cursor = "move";
            title.style.fontSize = "32px";
            modal_noninv.appendChild(title);


            const departmentLabel = document.createElement("h3");
            departmentLabel.textContent = "DEPARTMENT";
            modal_noninv.appendChild(departmentLabel);


            const radioButtonsContainer = document.createElement("div");
            radioButtonsContainer.style.width = "100%";
            radioButtonsContainer.style.display = "flex";
            radioButtonsContainer.style.justifyContent = "space-around";
            radioButtonsContainer.style.marginBottom = "10px";

            const radioButtonsData = [
                { label: "Vendor", value: "Vendor" },
                { label: "C-RET", value: "C-RET" },
                { label: "IB", value: "IB" },
                { label: "CD", value: "CD" },
                { label: "OB", value: "OB" }
            ];


            radioButtonsData.forEach(function(radioButtonData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "department";
                radioButton.value = radioButtonData.value;
                radioButton.style.marginLeft = "5px";


                const label = document.createElement("label");
                label.innerHTML = radioButtonData.label + "<br>";
                label.appendChild(radioButton);

                radioButtonsContainer.appendChild(label);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        const selectedValue = radioButton.value;
                        department = selectedValue;
                    }
                });
            });



            modal_noninv.appendChild(radioButtonsContainer);

            const storeTrailerLabel = document.createElement("h3");
            storeTrailerLabel.textContent = "STORE Trailer";
            modal_noninv.appendChild(storeTrailerLabel);

            const storeTrailerRadioContainer = document.createElement("div");
            storeTrailerRadioContainer.style.width = "50%";
            storeTrailerRadioContainer.style.display = "flex";
            storeTrailerRadioContainer.style.justifyContent = "space-around";
            storeTrailerRadioContainer.style.marginBottom = "10px";

            const storeTrailerRadioData = [
                { label: "YES", value: "YES" },
                { label: "NO", value: "NO" },
                { label: "EMPTY", value: "EMPTY" }
            ];


            let storeTrailer;
            storeTrailerRadioData.forEach(function(radioData) {
                const radioButton = document.createElement("input");
                radioButton.type = "radio";
                radioButton.name = "storeTrailer";
                radioButton.value = radioData.value;
                radioButton.style.marginLeft = "5px";

                const br = document.createElement("br");
                radioButton.appendChild(br);

                const label = document.createElement("label");
                label.textContent = radioData.label;
                label.appendChild(radioButton);

                radioButton.addEventListener("change", function() {
                    if (radioButton.checked) {
                        const selectedValue = radioButton.value;
                        storeTrailer = selectedValue;
                    }
                });

                storeTrailerRadioContainer.appendChild(label);
            });

            modal_noninv.appendChild(storeTrailerRadioContainer);

            const neqpTypeLabel = document.createElement("h3");
            neqpTypeLabel.textContent = "NEQP Type";
            modal_noninv.appendChild(neqpTypeLabel);

            const neqpTypeSelect = document.createElement("select");
            neqpTypeSelect.style.width = "100%";
            neqpTypeSelect.id = "neqpTypeSelect_id";
            neqpTypeSelect.style.marginBottom = "10px";

            const neqpTypeOptions = [
                "CEQP MISSORT",
                "CEQP ROLL CAGE",
                "NEQP Bags",
                "NEQP BOX",
                "NEQP SEPARATOR",
                "NEQP JP Carts",
                "NEQP EURO PALLETS",
                "NEQP EuroLight PALLETS",
                "NEQP DEFECT PALLETS",
                "NEQP PALLET SLEEVE",
                "NEQP TOTES",
                "NEQP PALLET SLEEVE B/W/T",
                "PROCESS ITEMS",
                "DRUDE",
                "Elektronika",
                "Tekstylia",
                "Metal",
                "Puste kontenery",
                "WRO1",
                "RVR do procesu"
            ];

            neqpTypeOptions.forEach(function(optionText) {
                const option = document.createElement("option");
                option.textContent = optionText;
                neqpTypeSelect.appendChild(option);
            });

            modal_noninv.appendChild(neqpTypeSelect);

            const unloadingDateLabel = document.createElement("h3");
            unloadingDateLabel.textContent = "Date of unloading";
            modal_noninv.appendChild(unloadingDateLabel);

            const unloadingDateInput = document.createElement("input");
            unloadingDateInput.type = "text";
            unloadingDateInput.value = "n/a";
            unloadingDateInput.addEventListener("click", function() {
                // Tu można dodać logikę wyświetlania kalendarza
            });
            modal_noninv.appendChild(unloadingDateInput);

            const loginLabel = document.createElement("h3");
            loginLabel.textContent = "LOGIN";
            modal_noninv.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modal_noninv.appendChild(loginInput);


            const descrTextareaLabel = document.createElement("h3");
            descrTextareaLabel.textContent = "Description";
            modal_noninv.appendChild(descrTextareaLabel);

            const descrTextarea = document.createElement("textarea");
            descrTextarea.style.width = "75%";
            descrTextarea.style.height = "50px";
            modal_noninv.appendChild(descrTextarea);



            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = "Report";
            reportTextareaLabel.style.marginTop = "20px";
            modal_noninv.appendChild(reportTextareaLabel);

            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "20px";
            modal_noninv.appendChild(reportTextarea);

            const createButton = document.createElement("button");
            createButton.textContent = "CREATE";
            createButton.addEventListener("click", function() {
                const neqpType = document.getElementById("neqpTypeSelect_id").value;
                const unloadingDate = unloadingDateInput.value;
                const login = loginInput.value;
                const descr = descrTextarea.value;

                let report = "";

                if (!department) {
                    report = "Nie wybrano działu do którego należy Asset (DEPARTMENT)";
                } else if (storeTrailer === "EMPTY") {
                    report = `STORE ${department} EMPTY`;
                }
                else
                {
                    if (!neqpType) {
                        report = "Nie wybrano co zawiera dany Asset (NEQP Type)";
                    } else if (!unloadingDate) {
                        report = "Nie wpisano dnia rozładunku Assetu";
                    }
                    else if (storeTrailer === "YES") {
                        report = `STORE ${department}\n${neqpType}\nUnloading date: ${unloadingDate}\nDescr: ${descr}\n${login}`;
                    } else if (storeTrailer === "NO") {
                        report = `${department}\n${neqpType}\nUnloading date: ${unloadingDate}\nDescr: ${descr}\n${login}`;
                    } else {
                        report = "Nie wybrano czy STORE czy nie";
                    }

                }

                reportTextarea.value = report;
            });

            modal_noninv.appendChild(createButton);


            // Tworzenie guzika kopiuj
            const createButtonCopy = document.createElement("button");
            createButtonCopy.textContent = "COPY";
            createButtonCopy.disabled = true;
            createButtonCopy.addEventListener("click", function() {
                document.getElementById("noteTextArea").value = reportTextarea.value;
            });

            // modal_noninv.appendChild(createButtonCopy);

            // Tworzenie guzika zamknij
            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_noninv_id"));
                modal_noninv.style.display = "none";
            });
            modal_noninv.appendChild(closeButton);

            document.body.appendChild(modal_noninv);
            dragElement(document.getElementById("modal_noninv_id"));
        }
        else
        {
            modal_noninv.style.display = "flex";
        }
    }


    // Funkcja tworząca modal dla przycisku "DEFECTS"
    function createDefectsModal() {
        const modalDefects = document.getElementById("modal_defects_id");
        if (!modalDefects) {
            const modalDefects = document.createElement("div");
            modalDefects.id = "modal_defects_id";
            modalDefects.style.width = "22%";
            modalDefects.style.margin = "0 auto";
            modalDefects.style.zIndex = "9999";
            modalDefects.style.backgroundColor = "#fff";
            modalDefects.style.padding = "20px";
            modalDefects.style.position = "absolute";
            modalDefects.style.top = "50%";
            modalDefects.style.left = "20%";
            modalDefects.style.transform = "translate(-50%, -50%)";
            modalDefects.style.display = "flex";
            modalDefects.style.flexDirection = "column";
            modalDefects.style.alignItems = "center";
            modalDefects.style.justifyContent = "center";
            modalDefects.style.border = "10px crimson solid";

            const defectsTitle = document.createElement("h1");
            defectsTitle.textContent = "DEFECT";
            defectsTitle.id = "modal_defects_idheader";
            defectsTitle.style.cursor = "move";
            defectsTitle.style.fontSize = "40px";
            modalDefects.appendChild(defectsTitle);

            // Pole tekstowe "CASE NUMBER"
            const caseNumberLabel = document.createElement("h3");
            caseNumberLabel.id = "caseNumber_id";
            caseNumberLabel.textContent = "CASE NUMBER";
            modalDefects.appendChild(caseNumberLabel);

            const caseNumberInput = document.createElement("input");
            caseNumberInput.type = "text";
            caseNumberInput.style.width = "auto";
            modalDefects.appendChild(caseNumberInput);

            // Pole tekstowe "LOGIN"
            const loginLabel = document.createElement("h3");
            loginLabel.textContent = "LOGIN";
            modalDefects.appendChild(loginLabel);

            const loginInput = document.createElement("input");
            loginInput.type = "text";
            loginInput.name = "login";
            loginInput.style.width = "auto";
            loginInput.value = document.getElementsByClassName("a-color-link a-text-bold")[0].innerText;
            modalDefects.appendChild(loginInput);

            // Radio buttony "Swap-Body" i "Trailer"
            const swapBodyRadio = document.createElement("input");
            swapBodyRadio.type = "radio";
            swapBodyRadio.name = "defectType";
            swapBodyRadio.value = "Swap-Body";
            swapBodyRadio.style.marginRight = "10px";

            const swapBodyLabel = document.createElement("h4");
            swapBodyLabel.textContent = "Swap-Body";

            const trailerRadio = document.createElement("input");
            trailerRadio.type = "radio";
            trailerRadio.name = "defectType";
            trailerRadio.value = "Trailer";
            trailerRadio.style.marginRight = "10px";

            const trailerLabel = document.createElement("h4");
            trailerLabel.textContent = "Trailer";

            // Kontener dla radio buttonów
            const radioContainer = document.createElement("div");
            radioContainer.style.display = "flex";
            radioContainer.style.alignItems = "center";
            modalDefects.appendChild(radioContainer);

            // Dodawanie radio buttonów i labeli do kontenera
            radioContainer.appendChild(swapBodyRadio);
            radioContainer.appendChild(swapBodyLabel);
            radioContainer.appendChild(trailerRadio);
            radioContainer.appendChild(trailerLabel);

            // Dodanie klas CSS do radio buttonów i labeli
            swapBodyRadio.classList.add("radio-input");
            swapBodyLabel.classList.add("radio-label");
            trailerRadio.classList.add("radio-input");
            trailerLabel.classList.add("radio-label");

            // Stylowanie elementów
            const radioStyle = ".radio-input {  } .radio-label { margin-right: 5px ; display: inline-block; }";
            const styleElement = document.createElement("style");
            styleElement.textContent = radioStyle;
            document.head.appendChild(styleElement);

            // Lista rozwijana dla wyboru defektów
            const defectListLabel = document.createElement("h3");
            defectListLabel.textContent = "Type of defect:";
            modalDefects.appendChild(defectListLabel);

            const defectListSelect = document.createElement("select");
            defectListSelect.style.marginBottom = "10px";
            defectListSelect.name = "defectListSelect";
            modalDefects.appendChild(defectListSelect);

            // Dodawanie opcji do listy rozwijanej w zależności od wyboru
            swapBodyRadio.addEventListener("change", function () {
                defectListSelect.innerHTML = ""; // Usunięcie istniejących opcji

                const swapBodyOptions = [
                    "Bent support bearing / Krzywy uchwyt na nogę",
                    "Bent crossbeam / Wygięta poprzeczka",
                    "Bent support leg / Krzywa noga",
                    "Defective crossbeam / Uszkodzona poprzeczka",
                    "Defective hitch / Uszkodzony trzpień",
                    "Defective ladder / Uszkodzona drabina",
                    "Defective leg support / Uszkodzone zabezpieczenie nogi",
                    "Defective locking handle / Uszkodzone zabezpieczenie nogi",
                    "Defective rolldoor cable / Uszkodzona linka rolety",
                    "Defective rolldoor handle / Uszkodzona klamka rolety",
                    "Defective rolldoor lock / Uszkodzony zamek rolety",
                    "Defective rolldoor panel / Uszkodzony panel rolety",
                    "Defective rubber gasket / Uszkodzona uszczelka",
                    "Defective support bearing / Uszkodzony uchwyt na nogę",
                    "Defective support leg / Uszkodzona poprzeczka",
                    "Missing hitch / Brak trzpienia",
                    "Missing ladder / Brak drabiny",
                    "Missing leg pin / Brak zawleczki",
                    "Missing leg support / Brak zabezpieczenia nogi",
                    "Missing locking handle / Brak zabezpieczenia nogi",
                    "Missing rolldoor cable / Brak linki rolety",
                    "Missing rolldoor handle / Brak klamki rolety",
                    "Missing rolldoor strap / Brak paska rolety",
                    "Missing rubber gasket / Brak uszczelki",
                    "Missing support bearing / Brak uchwytu na nogę"
                ];

                swapBodyOptions.forEach(function (option) {
                    const defectOption = document.createElement("option");
                    defectOption.textContent = option;
                    defectListSelect.appendChild(defectOption);
                });
            });

            trailerRadio.addEventListener("change", function () {
                defectListSelect.innerHTML = ""; // Usunięcie istniejących opcji

                const trailerOptions = [
                    "Air socket / Gniazda powietrza",
                    "Air System / Układ pneumatyczny",
                    "Front / Przód",
                    "Holes - punctures / Dziury - wgniecenia",
                    "Landing Gear / Nogi",
                    "Left side guard / Osłona lewa",
                    "Left Sidewall / Ściana - lewa",
                    "Lights - Left side / Światła - lewe",
                    "Lights - Right side / Światła - prawe",
                    "Mud flaps / Błotniki",
                    "Rear bumper / Zderzak",
                    "Rear lights / Światła tył",
                    "Right side guard / Osłona prawa",
                    "Right Sidewall / Ściana - prawa",
                    "Roof / Dach",
                    "Roll doors / Roleta",
                    "Swing doors / Drzwi",
                    "Suspension / Zawieszenie",
                    "Wheels - Left side / Koła - lewe",
                    "Wheels - Right side / Koła - prawe"
                ];

                trailerOptions.forEach(function (option) {
                    const defectOption = document.createElement("option");
                    defectOption.textContent = option;
                    defectListSelect.appendChild(defectOption);
                });
            });

            // Radio button "Inne" z polem tekstowym
            const otherRadio = document.createElement("input");
            otherRadio.type = "radio";
            otherRadio.name = "defectType";
            otherRadio.id = "otherDefect_id";
            otherRadio.value = "Inne uszkodzenie (opisz niżej)";
            modalDefects.appendChild(otherRadio);

            const otherLabel = document.createElement("label");
            otherLabel.textContent = "Inne uszkodzenie (opisz niżej)";
            modalDefects.appendChild(otherLabel);

            const otherInput = document.createElement("input");
            otherInput.type = "text";
            otherInput.id = "otherDefect_text";
            modalDefects.appendChild(otherInput);

            const reportTextareaLabel = document.createElement("h3");
            reportTextareaLabel.textContent = "Report";
            reportTextareaLabel.style.marginTop = "20px";
            modalDefects.appendChild(reportTextareaLabel);

            // Pole tekstowe do generowania raportu
            const reportTextarea = document.createElement("textarea");
            reportTextarea.style.width = "75%";
            reportTextarea.style.height = "100px";
            reportTextarea.style.marginBottom = "10px";
            modalDefects.appendChild(reportTextarea);

            // Guzik "CREATE"
            const createButton = document.createElement("button");
            createButton.textContent = "CREATE";
            createButton.addEventListener("click", function() {
                let caseNumber = document.getElementById("caseNumber_id").value;

                if (!caseNumber) {
                    caseNumber = "n/a";
                }

                var descr = document.getElementsByName("defectListSelect")[0].value;
                const login = loginInput.value;
                let report = "";


                if (document.getElementById("otherDefect_id").checked)
                {
                    descr = document.getElementById("otherDefect_text").value;
                    console.log("descr: " + descr);
                    console.log("descr.trim: " + descr.trim());

                    if (descr.trim() != "")
                    {
                        report = `DMG\nCase number: ${caseNumber}\nDescr: ${descr}\n${login}`;
                    }
                    else
                    {
                        report = "Brak wybranego typu uszkodzenia";
                    }
                }
                else
                {
                    report = `DMG\nCase number: ${caseNumber}\nDescr: ${descr}\n${login}`;
                }


                reportTextarea.value = report;
            });

            createButton.style.marginBottom = "10px";
            modalDefects.appendChild(createButton);

            // Tworzenie guzika kopiuj
            const createButtonCopy = document.createElement("button");
            createButtonCopy.textContent = "COPY";
            createButtonCopy.disabled = true;
            createButtonCopy.addEventListener("click", function() {
                document.getElementById("noteTextArea").value = reportTextarea.value;
            });

            // modalDefects.appendChild(createButtonCopy);

            // Tworzenie guzika zamknij
            const closeButton = document.createElement("button");
            closeButton.textContent = "X";
            closeButton.style.position = "absolute";
            closeButton.style.top = "0";
            closeButton.style.right = "0";
            closeButton.style.width = "auto";
            closeButton.addEventListener("click", () => {
                clearElementContent(document.getElementById("modal_defects_id"));
                modalDefects.style.display = "none";
            });
            modalDefects.appendChild(closeButton);

            document.body.appendChild(modalDefects);
            dragElement(document.getElementById("modal_defects_id"));
        }
        else
        {
            modalDefects.style.display = "flex";
        }
    }

    // Sprawdzanie, czy element o id "yms-annotation-modal" istnieje
    const checkModalExistence = setInterval(function() {
        const modal = document.getElementById("yms-annotation-modal");
        if (modal) {
            //clearInterval(checkModalExistence);
            createModal();
        }
    }, 1000); // Sprawdzanie co 1 sekundę
})();


function clearElementContent(element) {
    // Wyczyść checkboxy
    const checkboxes = element.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    // Wyczyść radiobuttony
    const radiobuttons = element.querySelectorAll('input[type="radio"]');
    radiobuttons.forEach((radiobutton) => {
        radiobutton.checked = false;
    });

    // Zresetuj wartość list rozwijanych
    const selectElements = element.querySelectorAll('select');
    selectElements.forEach((select) => {
        select.selectedIndex = 0;
        select.value = "";
    });

    // Wyczyść pola tekstowe
    const textInputs = element.querySelectorAll('input[type="text"]');
    textInputs.forEach((textInput) => {
        if(textInput.name != "login")
        {
            textInput.value = '';
        }
    });

    // Wyczyść pola textarea
    const textAreas = element.querySelectorAll('textarea');
    textAreas.forEach((textArea) => {
        textArea.value = '';
    })

    nonInvType = "";
}



function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}