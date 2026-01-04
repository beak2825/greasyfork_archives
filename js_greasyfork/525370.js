// ==UserScript==
// @name         Autotrading (Buy)
// @version      2.4
// @description  Auto buy
// @include      https://*/game.php*screen=market&mode=exchange*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/525370/Autotrading%20%28Buy%29.user.js
// @updateURL https://update.greasyfork.org/scripts/525370/Autotrading%20%28Buy%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getVillageId() {
        const match = window.location.href.match(/village=([^&]*)/);
        return match ? match[1] : null;
    }


    const villageId = getVillageId();
    if (!villageId) {
        console.error('Village ID not found in URL.');
        return; // Stop execution if no villageId is found
    }

    // const coefStock = 0.0041;
    // const coefCapacity = -0.0037;
    // const intercept = 411.86;

    const coefStock = 0.00173;
    const coefCapacity = -0.00129;
    const intercept = 225.27;

    let Continue =  true ;
    let ContinueBuy =  true ;

    let targetbuy = 600;
    let ppLimit = 0;
    let selectedResources = { wood: true, stone: true, iron: true };
    let settingsPopup = null;
    // let lastSubmitTime = 5100;
    let lastSubmitTime = parseInt(localStorage.getItem('lastSubmitTime')) || 5100;
    let intervalId = null;
    let woodtot = 0;
    let stonetot = 0;
    let irontot = 0;
    let limit = 400000;
    let error =  false ;

    function getRessStock(Ress) {
        return {
            RessStock: parseFloat(document.getElementById(Ress).innerText),
        };
    }

    function totalRes(resource) {
        const marketTableRows = document.querySelectorAll("#market_status_bar table.vis tbody tr")[1];
        let incomres = 0;  // Set default incomres to 0 if it's not found

        if (marketTableRows) {
            const resourceElement = marketTableRows.children[0].querySelector(`.icon.header.${resource}`);
            if (resourceElement) {
                const fullText = resourceElement.parentElement.textContent;
                incomres = parseInt(fullText.replace(/\D/g, ""), 10) || 0;  // Jika parsing gagal, set 0
            }
        }

        const ressStock = parseInt(document.getElementById(resource).innerText, 10) || 0;  // Jika tidak ditemukan, set 0
        const total = ressStock + incomres;

        return total;
    }



    function getStockAndCapacity(idStock, idCapacity) {
        return {
            stock: parseFloat(document.getElementById(idStock).innerText),
            capacity: parseFloat(document.getElementById(idCapacity).innerText)
        };
    }

    function getPremiumPoints() {
        return parseInt(document.getElementById('premium_points')?.textContent.trim(), 10) || 0;
    }

    function autoFillAllMaterials() {
        const countdownPopup = document.getElementById('countdown-timer');
        if (isNaN(targetbuy)) {
            console.error("Harap masukkan harga target yang valid.");
            return;
        }

        if (getPremiumPoints() < ppLimit) {
            console.error("PP tidak mencukupi untuk melakukan autofill.");
            return;
        }

        const materials = [
            { stockId: "premium_exchange_stock_wood", capacityId: "premium_exchange_capacity_wood", buyInput: "buy_wood", sellInput: "sell_wood", key: "wood" },
            { stockId: "premium_exchange_stock_stone", capacityId: "premium_exchange_capacity_stone", buyInput: "buy_stone", sellInput: "sell_stone", key: "stone" },
            { stockId: "premium_exchange_stock_iron", capacityId: "premium_exchange_capacity_iron", buyInput: "buy_iron", sellInput: "sell_iron", key: "iron" }
        ];

        let maxStockDiffMaterial = null;
        let maxStockDiff = -Infinity;

        materials.forEach(material => {
            if (!selectedResources[material.key])
              return;

            const { stock, capacity } = getStockAndCapacity(material.stockId, material.capacityId);
            material.requiredStockBuy = (targetbuy - intercept - coefCapacity * capacity) / coefStock;
            material.stockDifferenceBuy = stock - material.requiredStockBuy;

            if (material.stockDifferenceBuy > maxStockDiff) {
                maxStockDiff = material.stockDifferenceBuy;
                maxStockDiffMaterial = material;
            }
        });

        if (maxStockDiffMaterial && maxStockDiff > 0) {
            if (document.getElementsByName('sell_wood')[0].value === "" &&
                document.getElementsByName('sell_stone')[0].value === "" &&
                document.getElementsByName('sell_iron')[0].value === "") {

                document.getElementsByName(maxStockDiffMaterial.buyInput)[0].value = Math.abs(Math.round(maxStockDiff));
                document.getElementsByName(maxStockDiffMaterial.sellInput)[0].value = "";
                error = false;
            } else {
              countdownPopup.innerText = `Error input sell terisi \n Reload dalam 6s`;
              console.log("Error Input Buy Terisi");
              intervalId = setInterval(() => {
                  console.log("2 detik sudah berlalu");
              }, 2000);
              setTimeout(() => {
                                  location.reload();
                                  }, Math.random() * 1500 + 5500);
              error = true;
            }

        }
    }

    function checkAndSubmit() {
        let submitButton = document.querySelector('input[type="submit"][value="Calculate best offer "]');
        let lastSubmitTime = parseInt(localStorage.getItem('lastSubmitTime')) || 0;
        let timeElapsed = Date.now() - lastSubmitTime;

        if (timeElapsed < 5000) {
            console.log("Waiting for cooldown...");
            setTimeout(checkAndSubmit, 5500 - timeElapsed);
            return;
        }

        if (submitButton && error === false) {
            console.log("Buy res");
            submitButton.click();
            lastSubmitTime = Date.now();
            localStorage.setItem('lastSubmitTime', lastSubmitTime);

            setTimeout(() => {
                let confirmButton = document.querySelector('.confirmation-buttons .btn.evt-confirm-btn.btn-confirm-yes');
                if (confirmButton) confirmButton.click();
            }, Math.random() * 500 + 500);

            setTimeout(() => {
                location.reload();
            }, Math.random() * 1500 + 4500);
        } else if (error === true) {
            countdownPopup.innerText = `Belum 5s dari terakhir`;
            console.log("reload in 6s");
            setTimeout(() => {
                location.reload();
            }, Math.random() * 1500 + 5500);
        }
    }

    function autoProcessMaterials() {
        const materials = [
            { stockId: "premium_exchange_stock_wood", capacityId: "premium_exchange_capacity_wood", key: "wood" },
            { stockId: "premium_exchange_stock_stone", capacityId: "premium_exchange_capacity_stone", key: "stone" },
            { stockId: "premium_exchange_stock_iron", capacityId: "premium_exchange_capacity_iron", key: "iron" }
        ];

        const countdownPopup = document.getElementById('countdown-timer');

        for (let material of materials) {
            countdownPopup.innerText = `Tidak ada yang dipilih \n atau Harga rendah (standby)`;
            if (!selectedResources[material.key]) continue;

            const { stock, capacity } = getStockAndCapacity(material.stockId, material.capacityId);
            let requiredStockBuy = (targetbuy - intercept - coefCapacity * capacity) / coefStock;

            if (stock > requiredStockBuy) {
                countdownPopup.innerText = `Checking PP`;
                if (getPremiumPoints() < ppLimit) {
                    countdownPopup.innerText = `PP tidak cukup`;
                    console.error("PP tidak mencukupi untuk melakukan autofill.");
                    if (Continue == false){
                        localStorage.setItem(`buttonStatus${villageId}`, false);
                        location.reload();
                    }
                    return;
                }

                const anyChecked = selectedResources.wood || selectedResources.stone || selectedResources.iron;
                woodtot = totalRes('wood');
                stonetot = totalRes('stone');
                irontot = totalRes('iron');

                const exceededLimit = (selectedResources.wood === true && woodtot > limit) ||
                                      (selectedResources.stone === true && stonetot > limit) ||
                                      (selectedResources.iron === true && irontot > limit);

                if (anyChecked) {
                    console.log("Resource telah dipilih");
                    if (!exceededLimit) {
                        console.log("Resource belum limit");
                        autoFillAllMaterials();
                        countdownPopup.innerText = `Buy res at ${targetbuy}`;
                        if (document.getElementsByName('buy_wood')[0].value !== "" ||
                            document.getElementsByName('buy_stone')[0].value !== "" ||
                            document.getElementsByName('buy_iron')[0].value !== "") {
                            checkAndSubmit();
                        }
                    } else {
                        const resources = [
                            { name: "wood", total: woodtot, limit: limit },
                            { name: "stone", total: stonetot, limit: limit },
                            { name: "iron", total: irontot, limit: limit }
                        ];

                        resources.forEach(resource => {
                            if (selectedResources[resource.name] === true && resource.total > resource.limit && ContinueBuy === true) {
                                console.log(`${resource.name.charAt(0).toUpperCase() + resource.name.slice(1)} melebihi limit`);
                                countdownPopup.innerText = `${resource.name.charAt(0).toUpperCase() + resource.name.slice(1)} melebihi limit \n reload dalam 6s`;
                                selectedResources[resource.name] = false;
                                localStorage.setItem(`selectedResources${villageId}`, JSON.stringify(selectedResources));
                                setTimeout(() => {
                                    location.reload();
                                }, Math.random() * 1500 + 5500);
                            }
                        });

                        if (exceededLimit && ContinueBuy === false) {
                            console.log("Resource limit");
                            countdownPopup.innerText = `Ada resource melebihi limit`;
                        }
                    }
                } else {
                    localStorage.setItem(`buttonStatus${villageId}`, false);
                    console.log("Tidak ada yang diisi");
                    countdownPopup.innerText = `Tidak ada resource terpilih`;
                    location.reload();
                }
            }
        }
    }


    function saveSettings() {
        localStorage.setItem(`targetbuy${villageId}`, targetbuy);
        localStorage.setItem(`ppLimit`, ppLimit);
        localStorage.setItem(`limit${villageId}`, limit);
        localStorage.setItem(`selectedResources${villageId}`, JSON.stringify(selectedResources));
        localStorage.setItem(`continuePP`, Continue);
        localStorage.setItem(`ContinueBuy`, ContinueBuy);
        toggleSettingsPopup();
    }

    function loadSettings() {
        targetbuy = parseFloat(localStorage.getItem(`targetbuy${villageId}`)) || 600;
        ppLimit = parseFloat(localStorage.getItem(`ppLimit`)) || 0;
        limit = parseFloat(localStorage.getItem(`limit${villageId}`)) || 400000;
        selectedResources = JSON.parse(localStorage.getItem(`selectedResources${villageId}`)) || { wood: true, stone: true, iron: true };
        Continue = localStorage.getItem(`continuePP`) === 'true';
        ContinueBuy = localStorage.getItem(`ContinueBuy`) === 'true';
    }

    function toggleSettingsPopup() {
        if (settingsPopup) {
            settingsPopup.remove();
            settingsPopup = null;
            return;
        }

        settingsPopup = document.createElement('div');
        settingsPopup.style.position = 'fixed';
        settingsPopup.style.bottom = '100px';
        settingsPopup.style.right = '10px';
        settingsPopup.style.backgroundColor = '#222';
        settingsPopup.style.color = '#fff';
        settingsPopup.style.padding = '20px';
        settingsPopup.style.borderRadius = '10px';
        settingsPopup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        settingsPopup.style.zIndex = '1000';
        settingsPopup.style.width = '190px';
        settingsPopup.style.height = 'auto';

        settingsPopup.innerHTML = `
            <h3 style="margin: 0 0 5px 0; font-size: 12px; text-align: center;">Buy Settings</h3>
            <label>Target Buy: <input type="number" id="targetbuyInput" value="${targetbuy}" style="width: 100%; margin-bottom: 10px;"></label>
            <label>PP Limit: <input type="number" id="ppLimitInput" value="${ppLimit}" style="width: 100%; margin-bottom: 10px;"></label>
            <label>Res Limit: <input type="number" id="resLimitInput" value="${limit}" style="width: 100%; margin-bottom: 10px;"></label>
            <div style="margin-bottom: 3px; display: flex;">
                <label><input type="checkbox" id="woodCheckbox" ${selectedResources.wood ? 'checked' : ''}> Wood</label><br>
                <label><input type="checkbox" id="stoneCheckbox" ${selectedResources.stone ? 'checked' : ''}> Stone</label><br>
                <label><input type="checkbox" id="ironCheckbox" ${selectedResources.iron ? 'checked' : ''}> Iron</label>
                <label><input type="checkbox" id="Contbox" ${Continue ? 'checked' : ''}> CnPP</label>
                <label><input type="checkbox" id="ContBuybox" ${ContinueBuy ? 'checked' : ''}> CnBuy</label>
            </div>
            <button id="saveSettingsButton" style="width: 100%; padding: 5px; background-color: #28a745; color: white; border: none; border-radius: 5px;">Save</button>
        `;

        document.body.appendChild(settingsPopup);

        document.getElementById('saveSettingsButton').addEventListener('click', () => {
            targetbuy = parseFloat(document.getElementById('targetbuyInput').value);
            ppLimit = parseFloat(document.getElementById('ppLimitInput').value);
            limit = parseFloat(document.getElementById('resLimitInput').value);
            selectedResources.wood = document.getElementById('woodCheckbox').checked;
            selectedResources.stone = document.getElementById('stoneCheckbox').checked;
            selectedResources.iron = document.getElementById('ironCheckbox').checked;
            Continue = document.getElementById('Contbox').checked;
            ContinueBuy = document.getElementById('ContBuybox').checked;
            saveSettings();
        });
    }

    function createUI() {
        loadSettings();

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '10px';
        container.style.backgroundColor = '#222';
        container.style.color = '#fff';
        container.style.padding = '12px';
        container.style.borderRadius = '8px';
        container.style.zIndex = '1000';
        container.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        container.style.backdropFilter = 'blur(5px)';

        const countdownElement = document.createElement('div');
        countdownElement.id = 'countdown-timer';
        countdownElement.style.marginBottom = '1px';
        countdownElement.style.fontSize = '12px';
        countdownElement.style.fontWeight = 'bold';
        countdownElement.style.textAlign = 'center';
        countdownElement.innerText = 'Auto Trading (Buy)';
        container.appendChild(countdownElement);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.width = '100%';
        buttonContainer.style.gap = '5px';

        const startButton = document.createElement('button');
        startButton.innerText = 'Manual';
        startButton.style.padding = '5px 10px';
        startButton.style.fontSize = '13px';
        startButton.style.backgroundColor = '#ff7f00';
        startButton.style.color = '#ffff';
        startButton.style.border = 'none';
        startButton.style.borderRadius = '5px';
        startButton.style.cursor = 'pointer';
        startButton.style.transition = 'background-color 0.3s ease';
        startButton.addEventListener('click', autoFillAllMaterials);

        const AutoButton = document.createElement('button');
        AutoButton.id = 'Status';
        AutoButton.style.padding = '5px 10px';
        AutoButton.style.fontSize = '13px';
        AutoButton.style.color = '#fff';
        AutoButton.style.border = 'none';
        AutoButton.style.borderRadius = '5px';
        AutoButton.style.cursor = 'pointer';
        AutoButton.style.transition = 'background-color 0.3s ease';

        const savedStatus = localStorage.getItem(`buttonStatus${villageId}`);

        function updateButtonState(isRunning) {
            if (isRunning) {
                AutoButton.innerText = 'StopBuy';
                countdownElement.innerText = 'Wait 2-15s';
                AutoButton.style.backgroundColor = '#dc3545';
            } else {
                AutoButton.innerText = 'AutoBuy';
                countdownElement.innerText = 'Auto Trading (Buy)';
                AutoButton.style.backgroundColor = '#28a745';
            }
            localStorage.setItem(`buttonStatus${villageId}`, isRunning ? 'running' : 'stopped');
        }

        if (savedStatus === 'running') {
            intervalId = setInterval(autoProcessMaterials, Math.random() * 15000 + 2000);
            updateButtonState(true);
        } else {
            updateButtonState(false);
        }

        AutoButton.addEventListener('click', function() {
            if (intervalId === null) {
                intervalId = setInterval(autoProcessMaterials, Math.random() * 15000 + 2000);
                updateButtonState(true);
            } else {
                clearInterval(intervalId);
                intervalId = null;
                updateButtonState(false);
            }
        });

        const settingsButton = document.createElement('button');
        settingsButton.innerText = 'Settings';
        settingsButton.style.padding = '5px 10px';
        settingsButton.style.fontSize = '13px';
        settingsButton.style.backgroundColor = '#007bff';
        settingsButton.style.color = '#fff';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.transition = 'background-color 0.3s ease';
        settingsButton.addEventListener('click', toggleSettingsPopup);

        buttonContainer.appendChild(AutoButton);
        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(settingsButton);

        container.appendChild(buttonContainer);

        document.body.appendChild(container);
    }

    createUI();

})();