// ==UserScript==
// @name         GC Flask Calculator
// @namespace    http://devipotato.net/
// @version      1
// @description  Displays probabilities of different Flask of Rainbow Fountain Water results at the Rainbow Pool at grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license MIT
// @match        https://www.grundos.cafe/rainbowpool/neopetcolours/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/486281/GC%20Flask%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/486281/GC%20Flask%20Calculator.meta.js
// ==/UserScript==

(async function() {
    const carbonatedRemovedColors = ["Blue", "Green", "Red", "Yellow", "White", "Purple", "Brown", "Pink", "Orange", "Invisible"];

    function urlParam(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null) {
            return null;
        }
        return decodeURI(results[1]) || 0;
    }

    function querySelectorIncludesText (selector, text){
        return Array.from(document.querySelectorAll(selector))
            .filter(el => el.textContent.includes(text));
    }
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function countColors(species) {
        let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
        let normal = 0;
        let carbonated = 0;
        for (const color in colorData[species]) {
            normal += colorData[species][color];
            if(!carbonatedRemovedColors.includes(color)) {
                carbonated += 1;
            }
        }
        return { normal, carbonated };
    }

    async function calculateColorChances(species, color) {
        let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
        let capsColor = capitalizeFirstLetter(color);
        let totalNormalColors = 0;
        let totalCarbonatedColors = 0;
        for (const color in colorData[species]) {
            totalNormalColors += colorData[species][color];
            if(!carbonatedRemovedColors.includes(color)) {
                totalCarbonatedColors += 1;
            }
        }
        let normalChance = colorData[species][capsColor] / totalNormalColors;
        let specificNormalChance = 1 / totalNormalColors;
        let carbonatedChance = (carbonatedRemovedColors.includes(capsColor)?0:1/totalCarbonatedColors);
        return { normalChance, specificNormalChance, carbonatedChance }
    }

    function calculateMultiflaskChances(colorChances, flasks) {
        let normalChance = 1 - Math.pow(1 - colorChances.normalChance, flasks);
        let specificNormalChance = 1 - Math.pow(1 - colorChances.specificNormalChance, flasks);
        let carbonatedChance = 1 - Math.pow(1 - colorChances.carbonatedChance, flasks);
        return { normalChance, specificNormalChance, carbonatedChance }
    }

    function colorStats(colorChances, colorName, isAlt=false) {
        let hasAlts = colorChances.normalChance != colorChances.specificNormalChance;
        let container = document.createElement("div");
        container.classList.add("flask_statscontainer");
        let stats = document.createElement("div");
        stats.classList.add("flask_stats");
        container.append(stats);
        let form = document.createElement("div");
        form.classList.add("multiflask_form");
        form.textContent = "Number of flasks: ";
        container.appendChild(form);
        let flaskCount = document.createElement("input");
        flaskCount.type = "text";
        flaskCount.inputmode = "numeric";
        flaskCount.pattern = "[0-9]*";
        flaskCount.value = 1;
        flaskCount.classList.add("multiflask_count","form-control");
        flaskCount.size = 5;
        //workaround to prevent auto-focus on mobile
        flaskCount.disabled = true;
        flaskCount.autofocus = false;
        form.appendChild(flaskCount);
        form.appendChild(document.createTextNode(" "));
        let calculateButton = document.createElement("input");
        calculateButton.type = "button";
        calculateButton.classList.add("multiflask_button","form-control");
        calculateButton.value = "Calculate";
        form.appendChild(calculateButton);
        flaskCount.addEventListener("input", (event) => {
            if (isNaN(flaskCount.value) || !Number.isInteger(flaskCount.value)) {
                flaskCount.value = flaskCount.value.replace(/\D/g, '');
            }
        }, false);
        flaskCount.addEventListener("keydown", (event) => {
            if(event.key === "Enter") {
                calculateButton.click();
            }
        }, false);
        calculateButton.addEventListener("click", async () => {
            if(flaskCount.value == 0) flaskCount.value = 1;
            let multiflaskChances = calculateMultiflaskChances(colorChances, flaskCount.value);
            let hasAlts = colorChances.normalChance != colorChances.specificNormalChance;
            stats.innerHTML = formatFlaskStats(multiflaskChances, colorName, isAlt);
        }, false);
        stats.innerHTML = formatFlaskStats(colorChances, colorName, isAlt);
        return container;
    }

    //workaround to prevent auto-focus on mobile
    function enableFlaskBoxes() {
        let boxes = document.querySelectorAll(".multiflask_count");
        boxes.forEach(box => {
            box.disabled = false;
        })
    }

    function miniStats(colorChances, isAlt=false) {
        let miniStats = document.createElement("span");
        miniStats.classList.add("flask_ministats");
        miniStats.innerHTML = `(${(colorChances.normalChance*100).toFixed(2)}% | ✨${(colorChances.carbonatedChance*100).toFixed(2)}%)`
        return miniStats;
    }

    function formatFlaskStats(colorChances, colorName, isAlt=false) {
        let hasAlts = colorChances.normalChance != colorChances.specificNormalChance;
        if(isAlt) {
            return `Normal Flasks: <b>${(colorChances.normalChance*100).toFixed(2)}%</b> ${hasAlts?`(any ${colorName}) |  <b>${(colorChances.specificNormalChance*100).toFixed(2)}%</b> (this version)`:""}<br>
    ✨Carbonated Flasks: <b>${(colorChances.carbonatedChance*100).toFixed(2)}%</b> (base ${colorName}) | <b>${(0).toFixed(2)}%</b> (this version)`
        }
        else {
            return `Normal Flasks: <b>${(colorChances.normalChance*100).toFixed(2)}%</b> ${hasAlts?`(any ${colorName}) |  <b>${(colorChances.specificNormalChance*100).toFixed(2)}%</b> (this version)`:""}<br>
    ✨Carbonated Flasks: <b>${(colorChances.carbonatedChance*100).toFixed(2)}%</b>`
        }
    }

    function formatColorTotals(totals) {
        return `There are <b>${totals.normal}</b> possible results for normal flasks and <b>${totals.carbonated}</b> possible results for ✨carbonated flasks.`
    }

    //count the colors and update data, return if a new color was found
    async function parseColors(content, species) {
        let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
        if(!colorData[species]) {
            colorData[species] = {};
        }
        let newColors = false;
        let colorElements = content.querySelectorAll('.flex-column.small-gap');
        colorElements.forEach(element => {
            let colorName = element.getElementsByTagName("span")[0].innerText.trim();
            if(element.innerHTML.includes("https://grundoscafe.b-cdn.net/items/100012.gif")) {
                if(colorData[species] && colorData[species][colorName]==1) {
                    newColors = true; // there is an alt icon for a color we don't know the alts for
                }
            }
            if(!colorData[species][colorName]) {
                newColors = true; // this is a color we did not know about before
                colorData[species][colorName] = 1;
            }
        })
        await GM.setValue("colorData", JSON.stringify(colorData));
        return newColors;
    }

    async function parseAlts(content, species) {
        let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
        if(!colorData[species]) {
            colorData[species] = {};
        }
        let colorElements = content.querySelectorAll('.flex-column.small-gap');
        let totals = {};
        let newColors = false;
        colorElements.forEach(element => {
            let colorName = element.getElementsByTagName("span")[0].innerText.trim();
            let imgSrc = element.getElementsByTagName("img")[0].src;
            if(colorName == "Royal" || colorName == "Usuki" || colorName == "Quiguki") {
                if(imgSrc.includes("boy")) {
                    colorName = colorName + "boy";
                }
                else if(imgSrc.includes("girl")) {
                    colorName = colorName + "girl";
                }
            }
            totals[colorName] = (totals[colorName] || 0) + 1;

        })
        for (const color in totals) {
            let newTotal = totals[color] + 1;
            if(colorData[species] && colorData[species][color] != newTotal) {
                newColors = true; // this is a different total of alts than we had before
                colorData[species][color] = newTotal;
            }
        }
        await GM.setValue("colorData", JSON.stringify(colorData));
        return newColors;
    }

    async function attachMiniStats(elements, species) {
        for(let element of elements) {
            let colorName = element.getElementsByTagName("span")[0].innerText.trim();
            let imgSrc = element.getElementsByTagName("img")[0].src;
            let isAlt = imgSrc.includes("alt") || imgSrc.includes("classic")
            if(colorName == "Royal" || colorName == "Usuki" || colorName == "Quiguki") {
                if(imgSrc.includes("boy")) {
                    colorName = colorName + "boy";
                }
                else if(imgSrc.includes("girl")) {
                    colorName = colorName + "girl";
                }
            }
            let colorChances = await calculateColorChances(species, colorName)
            element.querySelector("span").after(miniStats(colorChances,isAlt));
        }
    }

    // thank you twiggies!
    async function fetchPage(url) {
        try {
            const response = await fetch(url);
            if(response.ok) {
                const html = await response.text();
                const node = await new DOMParser().parseFromString(html, "text/html");
                // show RE if the fetched page contains a RE
                if (node.getElementById('page_event').innerHTML.trim() != '') {
                    document.getElementById('page_event').innerHTML += node.getElementById('page_event').innerHTML
                }
                return node;
            } else {
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }
        catch(err) {
            console.log(`Encountered error fetching url ${url}:`)
            console.log(err)
        }
    }

    async function fetchColors(species) {
        const colorPage = await fetchPage(`https://www.grundos.cafe/rainbowpool/neopetcolours/?species=${species}`);
        return await parseColors(colorPage, species);
    }

    async function fetchAlts(species) {
        const altPage = await fetchPage(`https://www.grundos.cafe/rainbowpool/neopetcolours/?species=${species}&altsonly=true`);
        return await parseAlts(altPage, species);
    }

    if(document.querySelectorAll(".errorpage").length==0)
    {
        if(urlParam("species")) {
            let species = urlParam("species");
            // for all color/all alt color pages
            if(!urlParam("colour")) {
                let isAlts = urlParam("altsonly")=="true";
                let newColors = false;
                let colorElements = document.querySelectorAll('.flex-column.small-gap');
                if(!isAlts) {
                    newColors = await parseColors(document, species);
                    if(newColors) await fetchAlts(species);
                } else {
                    newColors = await parseAlts(document, species);
                    if(newColors) await fetchColors(species)
                }
                let colorData = JSON.parse(await GM.getValue("colorData", "{}"));
                let flaskTotals = document.createElement("p");
                let totals = await countColors(species);
                flaskTotals.innerHTML = formatColorTotals(totals);
                querySelectorIncludesText("strong","Colours")[0].after(flaskTotals);
                await attachMiniStats(colorElements, species);
            }
            // for specific color pages
            else {
                let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
                if(!colorData[species]) {
                    await fetchColors(species);
                    await fetchAlts(species);
                    colorData = JSON.parse(await GM.getValue("colorData", "{}"))
                }
                if(colorData[species]) {
                    let color = urlParam("colour");
                    let capsSpecies = species=="jubjub"?"JubJub":capitalizeFirstLetter(species);
                    let capsColor = capitalizeFirstLetter(color);
                    capsColor = capsColor.split("_")[0]
                    if(!colorData[species][capsColor]) {
                        await fetchColors(species);
                        await fetchAlts(species);
                        colorData = JSON.parse(await GM.getValue("colorData", "{}"))
                    }
                    let colorChances = await calculateColorChances(species, capsColor)
                    if(!color.includes("alt") && !color.includes("classic")) {
                        let altHeaders = querySelectorIncludesText("strong",`Alternate`);
                        let classicHeaders = querySelectorIncludesText("strong",`Classic`);
                        let allAlts = [...altHeaders, ...classicHeaders];

                        if(colorData[species][capsColor] != allAlts.length+1) {
                            await fetchColors(species);
                            await fetchAlts(species);
                            colorChances = await calculateColorChances(species, capsColor)
                        }

                        querySelectorIncludesText("strong",`${capsColor} ${capsSpecies}`)[0].after(colorStats(colorChances,capsColor,false));

                        allAlts.forEach(header => {
                            header.after(colorStats(colorChances,capsColor,true));
                        })
                    }
                    else {
                        querySelectorIncludesText("strong",capsSpecies)[0].after(colorStats(colorChances,capsColor,true));
                    }

                }
                //workaround to prevent auto-focus on mobile
                setTimeout(() => {
                    enableFlaskBoxes();
                }, 300)
            }
        }
        // color page of all species
        else if(urlParam("colour")) {
            let colorData = JSON.parse(await GM.getValue("colorData", "{}"))
            let color = urlParam("colour");
            let capsColor = capitalizeFirstLetter(color);
            let speciesElements = document.querySelectorAll('.flex-column.small-gap');
            let missingData = false;
            for(let element of speciesElements) {
                let species = element.getElementsByTagName("span")[0].innerText.trim().toLowerCase();
                if(colorData[species] && colorData[species][capsColor]) {
                    let colorChances = await calculateColorChances(species, capsColor)
                    element.querySelector("span").after(miniStats(colorChances));
                }
                else {
                    missingData = true;
                    let noData = document.createElement("span");
                    noData.innerHTML = `(???%)`
                    element.querySelector("span").after(noData);
                }
            }
            if(missingData) {
                let warning = document.createElement("p");
                warning.innerHTML = `Colour data for some of these species is missing or out of date. Please visit their pages to see their flask chances.`
                querySelectorIncludesText("strong","Available")[0].after(warning);
            }
        }
    }
})();

