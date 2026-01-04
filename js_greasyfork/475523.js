// ==UserScript==
// @name         Territory Color Mapper 100000
// @namespace    http://tampermonkey.net/
// @version      0.77
// @description  Quickly color the map! Use A and D to quickly add and remove tiles fast.
// @author       olesien
// @match        https://www.torn.com/city.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @license      BSD
// @downloadURL https://update.greasyfork.org/scripts/475523/Territory%20Color%20Mapper%20100000.user.js
// @updateURL https://update.greasyfork.org/scripts/475523/Territory%20Color%20Mapper%20100000.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const keybindsEnabled = true; //Change to false if you want to disable keybinds, you can customize them at the bottom.
    const showRackets = true;
    //Styles
    GM_addStyle ( `
        #mapper-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 10px;
            margin: 10px;
        }
        #mapper-list ol {
            display: flex;
            flex-direction: column;
            gap: 10px;
            padding: 5px;
            margin: 5px;
        }
        #mapper-list .action-item {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: rgba(0,0,0,0.1);
            padding: 5px;
            border-radius: 5px;
        }

        #mapper-list .action-item > * {
            flex: 2;
            height: 30px;
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
            white-space: nowrap;
        }
        #mapper-list .action-item .tert-order-id {
           flex: 1;
        }
        #mapper-list .tert-sep {
           display:flex;
           justify-content: space-between;
           align-items: center;
        }
        #mapper-list #action-button-territory {
           width: 120px;
        }

        #action-mapper {
            padding-top: 10px;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }
        #action-mapper > div {
            flex: 1;
            display: flex;
            gap: 10px;
            align-items: center;
            justify-content: center;
        }
        #mapper-list .box {
           width: 30px;
           height: 30px;
        }

        #top-div-mapper {
           width: 100%;
           display: flex;
           align-items: center;
           justify-content: space-between;
        }
        #top-div-mapper > div {
           flex: 1;
           display: flex;
           align-items: center;
           gap: 10px;
        }

        #top-div-mapper .top-right {
           justify-content: flex-end;
        }
        #top-div-mapper .export-btn {
            background-color: darkgreen;
            color: white;
            padding: 10px 20px;
        }
     `);
    const formattedNumber = (num) => {
        if (!num || isNaN(num)) {
            return "";
        }
        return "$" + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };
    let currId = 0;
    let loading = false;
    let maxCount = 0;
    //{db_id, territory,sector, respect, label: activeLabel, color: activeColor}
    let selectedTiles = localStorage.getItem("custom-map") ? JSON.parse(localStorage.getItem("custom-map")) : [];
    let activeColor = localStorage.getItem("custom-color") ?? "#FFFFFF";
    let activeLabel = localStorage.getItem("custom-label") ?? "";
    let hasQuickAdd = false;
    let hasQuickRemove = false;

    const parseRackets = (racketReward) => {
        if (racketReward.includes("Red Cow")) {
            return 2568000;
        }
        if (racketReward.includes("Munster")) {
            return 2025000;
        }
        if (racketReward.includes("Taurine Elite")) {
            return 4200000;
        }
        if (racketReward.includes("Moonshine")) {
            return 2200000;
        }
        if (racketReward.includes("Erotic")) {
            return 3750000;
        }
        if (racketReward.includes("Serotonin")) {
            return 1300000;
        }
        if (racketReward.includes("Epinephrine")) {
            return 900000;
        }
        if (racketReward.includes("Tyrosine")) {
            return 600000;
        }
        if (racketReward.includes("Melatonin")) {
            return 300000;
        }
        if (racketReward.includes("Morphine")) {
            return 16000;
        }
        if (racketReward.includes("Neume")) {
            return 700000;
        }
        if (racketReward.includes("Xanax")) {
            return 840000;
        }
        if (racketReward.includes("Cannabis")) {
            return 3900;
        }
        if (racketReward.includes("Ecstasy")) {
            return 50000;
        }
        if (racketReward.includes("Tear Gas")) {
            return 62600;
        }
        if (racketReward.includes("Smoke")) {
            return 90000;
        }
        if (racketReward.includes("Molotov")) {
            return 64000;
        }
        if (racketReward.includes("HEG")) {
            return 15000;
        }
        if (racketReward.includes("Flash")) {
            return 20500;
        }
        if (racketReward.includes("Points")) {
            return 45540;
        }
        return 1;
    }
    //const apiKey = "9xSZKev0texGQ7f5";
    let apiKey = String(localStorage.getItem("current_rackets_key"));
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("current_rackets_key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }
    let storedRackets = JSON.parse(localStorage.getItem("current_rackets") ?? JSON.stringify({}));
    let storedData;
    if (storedRackets && storedRackets?.timeAdded) {
        if (storedRackets.timeAdded + (60 * 60) >= (Date.now() / 1000)) {
            console.log("we have data from localstorage on current_rackets");
            storedData = storedRackets.data;
        }
    }

    const saveTiles = () => {
        localStorage.setItem("custom-map", JSON.stringify(selectedTiles));
    }

    const fixTile = (tile, tileData) => {
        tile.style.fill = tileData.color;
        tile.style.stroke = tileData.color;
        tile.style.fillOpacity = "0.9";
    }

    const undoTile = (tile) => {
        tile.style.fill = null;
        tile.style.stroke = null;
        tile.style.fillOpacity = null;
    }

    const fetchData = async () => {
        if (loading) return;
        try {
            loading = true;
            const resp = await fetch(`https://api.torn.com/torn/?selections=rackets&key=${apiKey}`);
            const body = await resp.json();

            console.log("BODY", body);

            if (body.rackets) {
                //Parse
                let theRackets = {};
                for (const [key, value] of Object.entries(body.rackets)) {
                    const moneyPer = parseRackets(value.reward);
                    const amount = Number(value.reward.replace(/\D/g,''));
                    theRackets[key] = {...value, cash: moneyPer * amount};
                }
                const newData = {timeAdded:  Math.round(Date.now() / 1000), data: theRackets}
                storedData = theRackets;

                localStorage.setItem("current_rackets", JSON.stringify(newData));
            } else {
                localStorage.setItem("current_rackets_key", "");
            }
            loading = false;
            return;

        } catch (err) {
            console.log(err);
            loading = false;
            return;
        }
    }
    setTimeout(() => {
        if (!storedData) fetchData();
    }, 2000);

    console.log(storedData);

    const render = async (withClear = false) => {

        const mapEl = document.querySelector(".territories");
        if (mapEl) {
            const tiles = Array.from(mapEl.children)
            if (withClear) {
                tiles.forEach(tile => {
                    const dbId = tile.getAttribute("db_id");
                    if (!dbId) return;
                    const exists = selectedTiles.find(tileData => Number(tileData?.db_id) === Number(dbId));
                    if (!exists) {
                        undoTile(tile);
                    }
                });
            }

            selectedTiles.forEach((tileData) => {
                const tile = tiles.find(tile => {
                    const dbId = tile.getAttribute("db_id");
                    if (!dbId) return false;
                    return Number(dbId) === Number(tileData.db_id)
                } );
                if (tile) {
                    fixTile(tile, tileData);
                }
            })
        }

    }
    const renderList = () => {
        console.log(selectedTiles);
        const labelList = selectedTiles.reduce((list, currentTile) => {
            const tileCash = storedData && storedData[currentTile.territory] ? storedData[currentTile.territory]?.cash : 0;
            if (!currentTile) return list;
            const existingTileIndex = list.findIndex((listTile) => listTile.label === currentTile.label);
            if (existingTileIndex >= 0) {
                const existingTile = list[existingTileIndex];
                list.splice(existingTileIndex, 1, {...existingTile, sectors: [...existingTile.sectors, Number(currentTile.sector)],
                                                   respect: Number(existingTile.respect) + Number(currentTile.respect), totalTiles: existingTile.totalTiles + 1, rackets: existingTile.rackets + tileCash});

            } else {
                list.push({label: currentTile.label, respect: Number(currentTile.respect), sectors: [Number(currentTile.sector)], totalTiles: 1, color: currentTile.color, rackets: tileCash});
            }
            return list;
        }, [])
        if (maxCount < labelList.length) maxCount = labelList.length;

        const root = document.querySelector("#tab-menu");

        const list = document.createElement("div");
        list.style.minHeight = `${150 + maxCount * 50}px`
        list.id = "mapper-list";

        const listEls = labelList.map((team, index) => {
            let sectors = [0,0,0,0,0,0,0];
            team.sectors.forEach((sector) => {
                if (sector >= 1 && sector <= 7) {
                    sectors.splice(sector - 1, 1, sectors[sector - 1] + 1);
                }
            });
            return `<li class="action-item"><div><div class="box" style="background-color: ${team.color}"></div></div><p>${team.label}</p><p>Res: ${team.respect}</p><p> S: ${sectors.join("/")}</p><p>Avg: ${Math.round(team.respect / team.totalTiles)}
            </p><p>Tiles: ${team.totalTiles}</p><p>R$: ${formattedNumber(team.rackets)}</p>
            <div><button class="torn-btn action" style="margin-left:5px" data-id="${index}">Select</button><button class="torn-btn danger" data-id="${index}">X</button></div></li>`
        }).join("");
        list.innerHTML = `<ol>${listEls}</ol>`;

        const mapEl = document.querySelector("#mapper-list");
        if (mapEl) {
            mapEl.remove();
        }
        root.appendChild(list);

        const items = list.querySelectorAll(".action-item");
        items.forEach((item) => {
            const removeButton = item.querySelector(".danger");
            const selectButton = item.querySelector(".action");
            removeButton.addEventListener("click", (button) => {
                const id = removeButton.dataset.id;
                console.log("REMOVING");
                if (Number(id) >= 0) {
                    const index = labelList.findIndex((action, index) => index === Number(id));
                    if (Number(index) >= 0) {
                        const allianceName = labelList[index]?.label ?? "";

                        const confirmedRemove = confirm(`Are you sure you would like to remove all tiles under ${allianceName}?`)
                        if (confirmedRemove) {
                            selectedTiles = selectedTiles.filter((tile) => {

                                if (!allianceName) {
                                    console.log("alliance is wrong");
                                    return !!tile?.label
                                } else {
                                    console.log("default");
                                    return tile?.label !== allianceName
                                }


                            });
                            render(true);
                            renderList();
                            saveTiles();
                        }

                    }

                }
            });
            selectButton.addEventListener("click", (button) => {
                const id = selectButton.dataset.id;
                console.log("Selecting", id);
                if (Number(id) >= 0) {
                    const index = labelList.findIndex((action, index) => index === Number(id));
                    if (Number(index) >= 0) {
                        const LabelName = labelList[index]?.label ?? "";
                        const color = labelList[index]?.color ?? "#FFFFFFF";
                        console.log(LabelName, color);
                        activeColor = color;
                        activeLabel = LabelName;
                        localStorage.setItem("custom-color", color);
                        localStorage.setItem("custom-label", LabelName);

                        //Update current
                        const currentColorEl = document.getElementById("custom-color");
                        const currentLabelEl = document.getElementById("custom-label");

                        if (currentColorEl && currentLabelEl) {
                            currentColorEl.value = color;
                            currentLabelEl.value = LabelName;
                        }
                    }

                }
            });
        });
    }

    const processData = (csvContent) => {
        const rows = csvContent.split('\n').map(row => row.split(','));
        // Assuming the first row contains headers
        const headers = rows[0];
        const data = rows.slice(1);

        // Now you have the headers and data, you can work with them
        console.log('Headers:', headers);
        console.log('Data:', data);
        if (data && Array.isArray(data) && data[0].length > 5) {
            selectedTiles = data.filter((cols) => (cols.length > 4 && cols[0] && cols[1] && cols[2] && cols[3] && cols[4] && cols[4] != "" && cols[5])).map((cols) => {
                return {territory: cols[0], db_id: cols[1], sector: cols[2], respect: cols[3], label: cols[4], color: cols[5]}
            });
            render(true);
            saveTiles();
            renderList();
        }
    };

    //Handle upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const content = e.target.result;
                processData(content);
            };

            reader.readAsText(file);
        }
    };

    const exportToCsv = () => {
        const rest = selectedTiles.map((tile) => ([tile.territory, tile.db_id, tile.sector, tile.respect, tile.label, tile.color]));
        const rows = [
            ["Territory Name", "Territory Id", "Sector", "Respect", "Label", "Color"],
            ...rest
        ];
        console.log(rows);
        console.log(rest);

        let csvContent = rows.map(e => e.join(",")).join("\n");
        console.log(JSON.stringify(csvContent));
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `tile-data.csv`;
        link.click();
        link.remove();
    }

    const removeIcons = async () => {
        //We all hate the map shit

        const markers = document.querySelector(".leaflet-marker-pane");
        const shadows = document.querySelector(".leaflet-shadow-pane");
        if (markers && shadows) {

            shadows.replaceChildren();
            if (showRackets) {
                Array.from(markers.children).forEach(child => {
                    if (child?.src && !child.src.includes("rackets")) {
                        child.remove();
                    }
                });
            } else {
                markers.replaceChildren();
            }

        }
    }


    const trunc = (str) => {
        if (!str.includes(":")) return str;
        return str.split(":")[1].replace(/ /g,'');
    }

    const addTile = (db_id, territory, sector, respect, selected) => {
        const tileData = {db_id, territory,sector, respect, label: activeLabel, color: activeColor}

        //Make sure there are no dups
        const existingIndex = selectedTiles.findIndex((tile) => Number(db_id) === Number(tile.db_id))
        if (existingIndex >= 0) {
            selectedTiles.splice(existingIndex, 1);
        }
        selectedTiles.push(tileData)
        fixTile(selected, tileData)
        saveTiles();
        renderList();
    }

    const removeTile = (db_id, selected) => {
        const existingIndex = selectedTiles.findIndex((tile) => Number(db_id) === Number(tile.db_id))
        if (existingIndex >= 0) {
            selectedTiles.splice(existingIndex, 1);
            saveTiles();
            undoTile(selected)
            renderList();
        }
    }

    document.addEventListener("keyup", (e) => {
        const map = document.querySelector(".territories");
        const selected = map?.querySelector(".selected");
        const db_id = selected?.getAttribute("db_id");

        if (db_id) {
            const innerPanel = document.querySelector(".territory-info-wrap");
            const tert = innerPanel?.children[0];
            const sector = innerPanel?.children[1];
            const res = innerPanel?.children[5];
            const territoryField = tert?.innerText;
            const sectorField = sector?.innerText;
            const resField = res?.innerText;
            if (territoryField && sectorField && resField) {
                if (keybindsEnabled) {
                    //Add
                    const territory = trunc(territoryField);
                    const sector = trunc(sectorField)[0];
                    const respect = trunc(resField);
                    if (e.code === "KeyA") {
                        addTile(db_id, territory, sector, respect, selected);
                    }

                    //Remove
                    if (e.code === "KeyD") {
                        removeTile(db_id, selected);

                    }
                }

            }

        }



    });

    const onMapClick = (e) => {
        console.log("map change triggered");
        if (hasQuickAdd || hasQuickRemove) {
            //Wait a sec
            setTimeout(() => {
                const map = document.querySelector(".territories");
                const selected = map?.querySelector(".selected");
                const db_id = selected?.getAttribute("db_id");

                if (db_id) {
                    const innerPanel = document.querySelector(".territory-info-wrap");
                    const tert = innerPanel?.children[0];
                    const sector = innerPanel?.children[1];
                    const res = innerPanel?.children[5];
                    const territoryField = tert?.innerText;
                    const sectorField = sector?.innerText;
                    const resField = res?.innerText;
                    if (territoryField && sectorField && resField) {
                        if (keybindsEnabled) {
                            //Add
                            const territory = trunc(territoryField);
                            const sector = trunc(sectorField)[0];
                            const respect = trunc(resField);
                            if (hasQuickAdd) {
                                addTile(db_id, territory, sector, respect, selected);
                            }

                            //Remove
                            if (hasQuickRemove) {
                                removeTile(db_id, selected);

                            }
                        }

                    }

                }
            }, 250);
        }


    }

    const addToQueue = (type) => {
        const map = document.querySelector(".territories");
        const selected = map?.querySelector(".selected");
        const db_id = selected?.getAttribute("db_id");

        if (db_id) {
            const innerPanel = document.querySelector(".territory-info-wrap");
            const tert = innerPanel?.children[0];
            const sector = innerPanel?.children[1];
            const res = innerPanel?.children[5];
            const territoryField = tert?.innerText;
            const sectorField = sector?.innerText;
            const resField = res?.innerText;
            if (territoryField && sectorField && resField) {
                if (keybindsEnabled) {
                    //Add
                    const territory = trunc(territoryField);
                    const sector = trunc(sectorField)[0];
                    const respect = trunc(resField);
                    if (type === "add") {
                        addTile(db_id, territory, sector, respect, selected);
                    }

                    //Remove
                    if (type === "remove") {
                        removeTile(db_id, selected);

                    }
                }

            }

        }

    }

    //Used by below if there are buttons
    const addButtons = (root) => {
        console.log("trying to add buttons");
        const div = document.createElement("div");
        div.id = "action-mapper";
        div.style.paddingLeft = "10px";

        const leftDiv = document.createElement("div");
        const button1 = document.createElement("button");
        button1.innerText = "Add Tile";
        button1.className = "torn-btn";
        button1.style.margin = "5px";
        button1.addEventListener("click", () => addToQueue("add"));
        leftDiv.appendChild(button1);

        const button2 = document.createElement("button");
        button2.innerText = "Remove Tile";
        button2.className = "torn-btn";
        button2.style.margin = "5px";
        button2.addEventListener("click", () => addToQueue("remove"));
        leftDiv.appendChild(button2);

        div.appendChild(leftDiv);

        const rightDiv = document.createElement("div");
        const styleLabel = document.createElement("label");
        styleLabel.innerText = "color";
        styleLabel.for = "custom-color";
        rightDiv.appendChild(styleLabel);

        const styleInput = document.createElement("input");
        styleInput.type = "color";
        styleInput.id = "custom-color";
        styleInput.value = activeColor;
        rightDiv.appendChild(styleInput);
        styleInput.addEventListener("change", () => {
            console.log(styleInput.value);
            activeColor = styleInput.value;
            localStorage.setItem("custom-color", styleInput.value);

            //Map through entire map
            selectedTiles = selectedTiles.map((tile) => {
                if (tile.label === activeLabel) {
                    return {...tile, color: activeColor}
                }
                return tile;
            });

            render();
            saveTiles();
            renderList();
        });

        const textLabel = document.createElement("label");
        textLabel.innerText = "label";
        textLabel.for = "custom-label";
        rightDiv.appendChild(textLabel);

        const textInput = document.createElement("input");
        textInput.type = "text";
        textInput.id = "custom-label";
        textInput.value = activeLabel;
        textInput.style.padding = "10px";
        rightDiv.appendChild(textInput);
        textInput.addEventListener("change", () => {
            console.log(textInput.value);
            activeLabel = textInput.value;
            localStorage.setItem("custom-label", textInput.value);
        });

        div.appendChild(rightDiv);
        root.appendChild(div);

        // export/import
        const headerEl = document.querySelector(".content-title");
        const topDiv = document.createElement("div");
        topDiv.id = "top-div-mapper";


        const topLeftDiv = document.createElement("div");
        topLeftDiv.className="top-left";
        //Export CSV
        const button3 = document.createElement("button");
        button3.innerText = "Export as CSV";
        button3.className = "export-btn";
        button3.style.margin = "5px";
        button3.addEventListener("click", () => exportToCsv());
        topLeftDiv.appendChild(button3);


        //Upload CSV file
        const uploadLabel = document.createElement("label");
        uploadLabel.innerText = "Import CSV";
        uploadLabel.for = "custom-upload";
        topLeftDiv.appendChild(uploadLabel);

        const uploadInput = document.createElement("input");
        uploadInput.type = "file";
        uploadInput.id = "custom-upload";
        uploadInput.accept = ".csv"
        topLeftDiv.appendChild(uploadInput);

        topDiv.appendChild(topLeftDiv);

        const topRightDiv = document.createElement("div");
        topRightDiv.className="top-right";
        //Quick adds/removes

        //Quick Add
        const quickAddLabel = document.createElement("label");
        quickAddLabel.innerText = "Quick Add";
        quickAddLabel.for = "custom-quickadd";
        topRightDiv.appendChild(quickAddLabel);

        const quickAddCheckbox = document.createElement("input");
        quickAddCheckbox.type = "checkbox";
        quickAddCheckbox.id = "custom-quickadd";
        topRightDiv.appendChild(quickAddCheckbox);
        ;
        topDiv.appendChild(topRightDiv);

        //Quick Remove
        const quickRemoveLabel = document.createElement("label");
        quickRemoveLabel.innerText = "Quick Remove";
        quickRemoveLabel.for = "custom-quickremove";
        topRightDiv.appendChild(quickRemoveLabel);

        const quickRemoveCheckbox = document.createElement("input");
        quickRemoveCheckbox.type = "checkbox";
        quickRemoveCheckbox.id = "custom-quickremove";
        topRightDiv.appendChild(quickRemoveCheckbox);

        quickAddCheckbox.addEventListener("change", (e) => {
            hasQuickAdd = e.target.checked;
            if (hasQuickRemove) {
                quickRemoveCheckbox.checked = false;
                hasQuickRemove = false;
            }
        })
        quickRemoveCheckbox.addEventListener("change", (e) => {
            hasQuickRemove = e.target.checked;
            if (hasQuickAdd) {
                quickAddCheckbox.checked = false;
                hasQuickAdd = false;
            }
        });
        topDiv.appendChild(topRightDiv);

        headerEl.appendChild(topDiv);

        uploadInput.addEventListener("change", handleFileUpload);
    }

    const observer = new MutationObserver((_, observer) => {
        const root = document.querySelector('#tab-menu');
        if (root) {
            observer.disconnect();
            addButtons(root);
            renderList();
        }
    });
    observer.observe(document, { subtree: true, childList: true });

    const observer2 = new MutationObserver((_, observer) => {
        const root = document.querySelector('.territories');
        if (root) {
            observer.disconnect();
            render();
        }
    });
    observer2.observe(document, { subtree: true, childList: true });

    const observer3 = new MutationObserver((_, observer) => {
        const root = document.querySelector('.leaflet-marker-pane');
        if (root) {
            removeIcons();
        }
    });
    observer3.observe(document, { subtree: true, childList: true });

    const observer4 = new MutationObserver((_, observer) => {
        const root = document.querySelector('.leaflet-popup-pane');
        if (root) {

            const observerInternal = new MutationObserver((_, observer) => {
                const root = document.querySelector('.leaflet-popup-pane');
                if (root) {
                    onMapClick(root)
                }
            });
            observerInternal.observe(root, { subtree: true, childList: true });
            observer4.disconnect();
        }
    });
    observer4.observe(document, { subtree: true, childList: true });


})();