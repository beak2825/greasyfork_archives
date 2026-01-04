// ==UserScript==
// @name         CE autoSig development
// @namespace    Cartel Empire
// @version      2025-07-26
// @description  Add dynamic content to your profile signature
// @author       Marlis[15746]
// @match        https://cartelempire.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cartelempire.online
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/540338/CE%20autoSig%20development.user.js
// @updateURL https://update.greasyfork.org/scripts/540338/CE%20autoSig%20development.meta.js
// ==/UserScript==

class DataCollector{
    /** @type {object} pages - Contains data about how data is collected */
    pages;

    /**
     * Create a DataCollector object
     *
     * @param {object} pages - Potentially pre-written page data
     */
    constructor(pages = {}){ //3.6e6 = 1 hour in ms
        this.pages = pages;
    }

    /**
     * Register a collection element that collects data based on its parameters
     *
     * @param {string} id - A unique id for the added collection element
     * @param {RegExp} regex - The regular expression to match the url against. If it matches, the handler is executed
     * @param {function} handler - The function that collects the data
     * @param {object} dataFormat - The default object to be stored when no data is present
     * @param {number} [updateInterval=3.6e6] - The minimum amount of time in milliseconds between updating the data
     */
    addPage(id, regex, handler, dataFormat, updateInterval=3.6e6){
        this.pages[id] = {regex: regex, handler: handler, dataFormat: dataFormat, updateInterval: updateInterval};
    }

    /**
     * Check each collection element for matching regexes and if a match is found, execute the element's handler
     *
     * @param {string} croppedURL - the cropped url of the current page
     */
    execute(croppedURL){
        Object.entries(this.pages).forEach(e => {
            if(e[1].regex.test(croppedURL)){
                const existingData = this.getStoredData(e[0], e[1].dataFormat);

                if(Date.now() - existingData.last_updated > e[1].updateInterval){
                    const newData = e[1].handler(croppedURL);
                    this.setStoredData(e[0], newData);
                }
            }
        });
    }

    /**
     * Store given data in tampermonkey's persistent storage
     *
     * @param {string} id - the collection element id of which the data will be stored
     * @param {object} data - the data to be stored
     *
     * @return {undefined} If no data is given, return before storing the (empty) data
     */
    setStoredData(id, data){
        if(!data){
            console.warn(`Attempt to write empty object to ${id} storage`);
            return;
        }
        data.last_updated = Date.now();
        GM_setValue(id, data);
        console.log(`Updated ${id} data`);
    }

    /**
     * Get stored data from tampermonkey's persistent storage
     *
     * @param {string} id - the collection element id of which the data is stored of
     * @param {object} format - the default format of the collection element
     *
     * @return {object} The stored data or the default format, if no data is stored
     */
    getStoredData(id, format){
        const data = GM_getValue(id);
        if(!data){
            format.last_updated = 0;
            GM_setValue(id, format);
        }
        return data || format;
    }
}

class SignatureConstructor{
    /** @type {template} template - A template element to build the signature on */
    template;
    /** @type {array<objects>} signatures - Data to construct the signatures with */
    signatures;

    /**
     * Create a signature object
     *
     * @param {template} template - The template to build the signature on
     * @param {signatures} [signatures=[]] - The data for signature construction
     */
    constructor(template, signatures = []){
        this.template = template;
        this.signatures = signatures;
    }

    /**
     * Register a signature construction element
     *
     * @param {string} elemId - The id of the html-element in which to insert the signature
     * @param {function} signatureConstructor - The handler to construct the signature
     * @param {...string} dataIds - The ids of the collection elements, of which the data can be used in signatureConstructor
     */
    addSignature(elemId, signatureConstructor, ...dataIds){
        this.signatures.push({id: elemId, handler: signatureConstructor, dataIds: dataIds});
    }

    /**
     * Construct the complete signature, using each of the signature construction elements stored in "signatures"
     *
     * @return {string} The complete constructed signature as a string
     */
    constructSignature(){
        const content = this.template.content;

        this.signatures.forEach((e, i) => {
            const tab = content.querySelector("#" + e.id + ".autoSig");
            const data = e.dataIds.map(e => GM_getValue(e));
            if(tab && data.every(e => e)){
                tab.innerHTML = e.handler(...data);
            } else{
                console.warn(`Could not construct profile signature for ${e.id}`);
            }
        });
        return this.template.innerHTML.replaceAll('\n', '');
    }
}

(function() {
    'use strict';

    const dataCollector = new DataCollector();
    dataCollector.addPage("jobs", /^jobs\/?$/, inJobs, {percentages: [], prestiges: []});
    dataCollector.addPage("stats", /^user\/stats\/?$/, inStats, {attempts: [], successes: []});
    dataCollector.addPage("profileSettings", /^settings/, inSettings, {}, 0);

    const URL = window.location.href.split(/\/|\?/g).slice(3).join('/').replace(/#[^\?\/]*$/, "").toLowerCase() || "home";
    dataCollector.execute(URL);

})();

/**
 * Collect job data on the job page
 *
 * @param {string} url - The cropped url that matches the collection element's regex
 *
 * @return {object} The collected data, should follow the collection element's dataFormat
 */
function inJobs(url) {
    const jobPanels = document.querySelectorAll("div.equipmentModule div.flex-column");
    const bars = document.querySelectorAll("div.equipmentModule .progress-bar");
    if(jobPanels === null) return;

    const prestiges = [];
    const percentages = [];

    for(const i in [...jobPanels]) {
        const jobPanel = jobPanels[i];
        const bar = jobPanel.querySelector(".progress-bar");
        const val = parseFloat(bar.getAttribute("aria-valuenow"));
        percentages.push(parseFloat(val.toFixed(2)));

        let prestige = jobPanel.querySelector(".bi.bi-star-fill.align-baseline")
        prestige = prestige ? prestige.nextSibling.innerText : "x0";
        prestige = parseInt(prestige.slice(1));
        prestiges.push(prestige);
    }
    return {percentages: percentages, prestiges: prestiges};
}

/**
 * Collect job data on the stats page
 *
 * @param {string} url - The cropped url that matches the collection element's regex
 *
 * @return {object} The collected data, should follow the collection element's dataFormat
 */
function inStats(url) {
    const attemptList = new Array(10);
    const successList = new Array(10);
    //for some reason the order of jobs is different here than everywhere else
    const indexMap = [0, 1, 2, 3, 8, 9, 4, 5, 6, 7];
    const statList = document.querySelectorAll("#mainBackground > div > div > div.col-12 > div.mb-4.card > div.card-body > div > ul:nth-of-type(4) > li > .row > .col-4:nth-child(3)");
    for(const i in [...statList]){
        if(i % 2 === 1) attemptList[indexMap[(i-1)/2]] = parseInt(statList[i].textContent.replaceAll(',', ''));
        else if(i != 0) successList[indexMap[(i/2)-1]] = parseInt(statList[i].textContent.replaceAll(',', ''));
    }

    return {attempts: attemptList, successes: successList};
}

/**
 * Put the constructed profile signature into the tinyMCE editor that edits the profile signature
 *
 * @param {string} url - The cropped url that matches the collection element's regex
 */
function inSettings(url) {
    const profileBtn = document.querySelector("#v-tab-profile");
    const evtListener = profileBtn.addEventListener("click", e => {
        const template = document.createElement("template");
        const editor = tinymce.get("profileSignatureEditor")
        const textSig = editor.getContent().replaceAll('\n', '');

        if(!tinymce || !textSig) return;
        template.innerHTML = textSig;

        const sigConstructor = new SignatureConstructor(template);
        sigConstructor.addSignature("jobs", constructJobSig, "jobs", "stats");

        const updatedSignature = sigConstructor.constructSignature();

        editor.setContent(updatedSignature);
    }, {once: true});
}

/**
 * Construct the profile signature for the job tab
 *
 * @param {object} jobs - The "job" collection element data
 * @param {object} stats - The "stats" collection element data
 *
 * @return {string} The constructed job signature
 */
function constructJobSig(jobs, stats){
    const jobNames = ["Intimidation", "Arson", "GTA", "Drug Transport", "Farm Robbery", "Agave Robbery", "Paste Robbery", "Construction Robbery", "Blackmail", "Hacking"];

    const prestHSL = jobs.prestiges.map(e => (e/10)*120); // [0, 10] prestige HSL
    const percHSL = jobs.percentages.map(e => Math.floor((e/100)*120)); // [0, 100] percentage HSL

    const attemptHSL = stats.successes.map(e => Math.floor((e/5000)*120)); // [0, 5000] achievement
    const successHSL = stats.successes.map((e, i) => Math.floor((e/stats.attempts[i])*120)); // relative success (success/attempts)

    const tableRow = new Array(10).fill(0).map((e, i) =>
`<tr>
<td><p class="card-text">${jobNames[i]}</p></td>
<td><p class="card-text"><span style="color: hsl(${prestHSL[i] || 0}, 67%, 50%);">P${jobs.prestiges[i] || 0}</span></p></td>
<td><p class="card-text"><span style="color: hsl(${percHSL[i] || 0}, 67%, 50%);">${jobs.percentages[i] || 0}%</span></p></td>
<td><p class="card-text"><span style="color: hsl(${attemptHSL[i] || 0}, 67%, 50%);">${stats.attempts[i] || 0}</span></p></td>
<td><p class="card-text"><span style="color: hsl(${successHSL[i] || 0}, 67%, 50%);">${stats.successes[i] || 0}</span></p></td>
</tr>`);

    return `<h3>Job Progress</h3>
<div class="card border-0">
<div class="card-body">
<table class="table">
<thead>
<tr>
<th scope="col">Job</th>
<th scope="col">Prestige</th>
<th scope="col">Percentage</th>
<th scope="col">Attempts</th>
<th scope="col">Successes</th>
</tr>
</thead>
<tbody>
${tableRow.join('')}
</tbody>
</table>
<p>&nbsp;</p>
<p class="card-text">Last updated: ${new Date(Math.min(jobs.last_updated, stats.last_updated)).toGMTString()}</p>
</div>
</div>`;
}