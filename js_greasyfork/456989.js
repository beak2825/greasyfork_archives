// ==UserScript==
// @name         Midjourney Stats & Search
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Compiles statistics of and searches your Midjourney prompts
// @match        https://legacyalpha.midjourney.com/*
// @match        https://mj-gallery.com/*
// @match        https://cdn.discordapp.com/attachments/*
// @match        https://media.discordapp.net/attachments/*
// @match        https://cdn.midjourney.com/*
// @match        https://discord.com/*
// @match        https://i.mj.run/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.global.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/456989/Midjourney%20Stats%20%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/456989/Midjourney%20Stats%20%20Search.meta.js
// ==/UserScript==


'use strict';

console.log("Stats & Search loaded");

const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});

if(window.location.hostname == "discord.com") {
    if(window.opener){

        window.addEventListener("message", async (event) => {
            console.log(event.data);
            window.lastMouseImage.title = event.data;
            //window.mjPrompts[event.data.id] = event.data.full_command;
        }, false);

        document.addEventListener('mouseover', (event) => {
            if (event.target.matches('img')) {
                let matches = event.target.src.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i);
                if(matches?.length > 0){

                    //window.open("https://i.mj.run/" + matches[0] + "/grid_0.webp", "mj_preview");

                    if(!window.mjPrompts) window.mjPrompts = [];
                    if (window.mjPrompts[matches[0]]) event.target.title = mjPrompts[matches[0]];
                    else {
                        window.opener.postMessage(matches[0], "https://legacyalpha.midjourney.com");
                        window.lastMouseImage = event.target;
                    }
                }
            }
        });
    }

    //     window.setTimeout(() => {
    //         // Select the target element where the images will be added
    //         const targetElement = document.body;

    //         // Create a mutation observer to listen for changes in the target element
    //         const observer = new MutationObserver((mutationsList) => {
    //             // Check each mutation for added nodes
    //             for (const mutation of mutationsList) {
    //                 if (mutation.type === 'childList') {
    //                     // Check each added node if it is an <img> element
    //                     mutation.addedNodes.forEach((node) => {
    //                         if (node instanceof HTMLImageElement) {
    //                             // Execute your desired logic here when an <img> element is added
    //                             console.log('An <img> element was added:', node);
    //                         }
    //                     });
    //                 }
    //             }
    //         });

    //         // Start observing the target element for changes
    //         observer.observe(targetElement, { childList: true, subtree: true });

    //     },2000);
}

if(window.location.hostname == "mj-gallery.com"
   || window.location.hostname == "cdn.discordapp.com"
   || window.location.hostname == "media.discordapp.net"
   || window.location.hostname == "i.mj.run"
   || window.location.hostname == "cdn.midjourney.com") {
    let bootstrap = document.createElement('link');
    bootstrap.rel = "stylesheet";
    bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css";
    document.head.append(bootstrap);
    let matches = window.location.pathname.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    if (matches.length > 0) {
        let guid = matches[0];
        let div = document.createElement("div");
        div.style.position = "fixed";
        div.style.margin = "3px";
        div.innerHTML = `
            <a class="btn btn-primary" href="https://legacyalpha.midjourney.com/app/jobs/${guid}/">View in gallery</a>
            <button class="btn btn-primary" onclick="window.copyId()">Copy job id</button>`;
        document.body.prepend(div);
        window.copyId = () => window.navigator.clipboard.writeText(guid);
    }
}
if (window.location.href.includes("https://legacyalpha.midjourney.com/app/ss/") || window.ssOffline) {
    ssInit();
}
else if (window.location.href.includes("https://legacyalpha.midjourney.com/app/") || window.location.href.includes("https://legacyalpha.midjourney.com/imagine/")) {
    window.setTimeout(() => {
        [...document.getElementsByTagName("p")]
            .find(x => x.innerHTML == "Create Images")
            .parentNode.insertAdjacentHTML('afterend',
`<a id="ss-link" href="#" class="flex relative ease-out justify-start border border-transparent items-center .overflow-hidden text-base group p-3 rounded-lg w-full gap-4 hover:bg-[#172B51]/50 transition-colors">
<svg height="22" class="inline-block text-[#95B4F0] shrink-0 grow-0" width="22" viewBox="0 0 16 16" fill="currentColor" stroke="none" xmlns="http://www.w3.org/2000/svg">
<g id="Table"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.3335 8.66732H10.0002C9.26378 8.66732 8.66683 9.26427 8.66683 10.0007V13.334C8.66683 14.0704 9.26378 14.6673 10.0002 14.6673H13.3335C14.0699 14.6673 14.6668 14.0704 14.6668 13.334V10.0007C14.6668 9.26427 14.0699 8.66732 13.3335 8.66732ZM10.0002 13.334V10.0007H13.3335V13.334H10.0002ZM7.3335 2.66732V13.334C7.3335 14.0704 6.73654 14.6673 6.00016 14.6673H2.66683C1.93045 14.6673 1.3335 14.0704 1.3335 13.334V2.66732C1.3335 1.93094 1.93045 1.33398 2.66683 1.33398H6.00016C6.73654 1.33398 7.3335 1.93094 7.3335 2.66732ZM6.00016 2.66732H2.66683V13.334H6.00016V2.66732ZM13.3335 1.33398H10.0002C9.26378 1.33398 8.66683 1.93094 8.66683 2.66732V6.00065C8.66683 6.73703 9.26378 7.33398 10.0002 7.33398H13.3335C14.0699 7.33398 14.6668 6.73703 14.6668 6.00065V2.66732C14.6668 1.93094 14.0699 1.33398 13.3335 1.33398ZM10.0002 6.00065V2.66732H13.3335V6.00065H10.0002Z"></path></g>
</svg><p class="leading-none truncate">Stats & Search</p></a>`);
        document.getElementById("ss-link").onclick = () => { window.location.href = "https://legacyalpha.midjourney.com/app/ss/" };
    }, 1000);
}

async function ssInit() {
    window.Vue = Vue;
    window.ssApp = Vue.createApp({
        data() {
            return {
                ssOffline: window.ssOffline || false,
                jobs: [],
                slices: [],
                sliceLookup: [],
                jobLookup: [],
                searchResults: [],
                resultCount: 0,
                countPhrases: "",
                promptMass: "",
                stats: "",
                words: "",
                wordCounts: [],
                searchString: "",
                hoverMessage: "",
                settings: {
                    thumbnailSize: "3",
                    startDate: null,
                    endDate: null
                },
                searchSettings: {
                    type: "upscale",
                    view: "list",
                    orientation: "all",
                    order: "newest",
                    show: "1000",
                    skip: "",
                    service: "all",
                    linkTo: "gallery",
                    version: ["v5"],
                },
                urlSettings: {
                    prompts: "",
                    urls: "",
                    missingJobs: "",
                    format: "https://cdn.midjourney.com/<guid>/grid_0.webp",
                    type: "grid"
                },
                versionCheck: {
                    v6: x => x._parsed_params?.version?.toString().charAt(0) == "6"
                    || x._job_type?.startsWith("diffusion_upsample_v6") && x._parsed_params?.niji == false,
                    v5: x => x._parsed_params?.version?.toString().charAt(0) == "5"
                    || ((x._job_type == "diffusion_upsample_v5_virtual" || x._job_type == "diffusion_upsample_v5_2x" || x._job_type == "diffusion_upsample_v5_4x") && x._parsed_params?.niji == false),
                    test: x => x._parsed_params?.test == true || x.full_command.includes(" --test") && !x.full_command.includes(" --testp"),
                    testp: x => x._parsed_params?.testp == true || x.full_command.includes(" --testp"),
                    v4: x => x._parsed_params?.version == 4 || x.event.eventType?.substring(0,2) == "v4" || x._job_type?.includes("v4") && !this.versionCheck.niji(x)
                    || x.event.eventType == "beta-upscale" && !this.versionCheck.test(x) && !this.versionCheck.testp(x) && !this.versionCheck.niji(x) && x._job_type !== null,
                    niji5: x => x._parsed_params?.niji == "5" || x.type == "v5_upscaler_anime" || x.type == "v5-1_diffusion_anime" || (x._parsed_params?.niji == true && x.type == "v5_upscale"),
                    niji: x => !this.versionCheck.niji5(x) && (x._job_type?.includes("anime") || x._parsed_params?.anime || x._parsed_params?.niji || x.event?.eventType == "beta-upscale-niji"),
                    v123: x => x._parsed_params?.version == 3 || x._job_type === null && !this.versionCheck.test(x) && !this.versionCheck.testp(x) && !this.versionCheck.v4(x) && !this.versionCheck.niji(x),
                    leftover: x => !this.versionCheck.niji5(x) && !this.versionCheck.v5(x) && !this.versionCheck.test(x) && !this.versionCheck.testp(x) && !this.versionCheck.v4(x) && !this.versionCheck.niji(x) && !this.versionCheck.v123(x)
                }
            }
        },
        mounted: async function () {
            window.localforage.config({
                name: params.id ? 'statsAndSearch_' + params.id : 'statsAndSearch',
                version: 1.0,
                size: 4980736,
                storeName: 'keyvaluepairs',
                description: ''
            });

            if (window.ssOffline) {
                this.toggleShow("searchTab");
                this.jobs = window.ssOfflineJobs;
            }
            else {
                await this.loadJobs();
                this.flashMessage("Jobs loaded");
            }

            this.countPhrases = await this.load("phrases") || "";

            let settings = await this.load("settings");
            if (settings) Object.assign(this.settings, settings);

            let searchSettings = await this.load("searchSettings");
            if (searchSettings) Object.assign(this.searchSettings, searchSettings);

            let urlSettings = await this.load("urlSettings");
            if (urlSettings) Object.assign(this.urlSettings, urlSettings);


            //message listener
            window.addEventListener("message", async (event) => {
                if (event.origin !== "https://discord.com") return;
                if(typeof event.data == 'string' && event.data.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i)?.length > 0){
                    let jobs = await this.fetchJobsByIds([event.data]);
                    event.source.postMessage(jobs[0].full_command, "https:/discord.com");
                }
            }, false);
        },
        watch: {
            settings: {
                handler: function (value) {
                    this.save("settings", value);
                },
                deep: true
            },
            searchSettings: {
                handler: async function (value) {
                    this.save("searchSettings", value);
                    if(document.getElementById("searchTab").style.display != "none"){
                        this.search();
                    }
                },
                deep: true
            },
        },
        methods: {
            openDiscord:  function() {
                window.open('https://discord.com/channels/@me');
            },
            save: async function (key, value) {
                await window.localforage.setItem(key, JSON.stringify(value));
            },
            load: async function (key) {
                let json = await window.localforage.getItem(key);
                if (json !== null) return JSON.parse(json);
                else return null;
            },
            saveJobs: async function() {
                let removeDuplicateObjects = function(arr) {
                    const uniqueObjects = [];
                    const uniqueIds = new Set();

                    for (const obj of arr) {
                        if (!uniqueIds.has(obj.id)) {
                            uniqueIds.add(obj.id);
                            uniqueObjects.push(obj);
                        }
                    }

                    return uniqueObjects;
                }
                this.jobs = removeDuplicateObjects(this.jobs);

                let jobs = this.jobs;
                let promises = [];
                jobs.sort((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time));

                for(let i = 0; i < jobs.length / 1000; i++){
                    let chunk = jobs.slice(i*1000,(i+1)*1000);
                    promises.push(this.save("jobs_" + i, chunk));
                    console.log("Saved chunk_" + i);
                }
                await Promise.all(promises);
            },
            loadJobs: async function () {
                window.userJobs = [];
                for(let i = 0; true; i++) {
                    let chunk = await this.load("jobs_" + i);
                    if (chunk){
                        this.jobs.push(...chunk);
                        window.userJobs.push(...chunk);
                        console.log("Loaded chunk_" + i);
                    }
                    else break;
                };

                this.jobs.forEach(x => {
                    if (x._job_type == "diffusion") x.type = "grid";
                });

            },
            fetchJobs: async function () {
                await this.fetchJobsByDateInterval(
                    new Date(this.settings.startDate),
                    new Date(this.settings.endDate)
                );
            },
            catchMeUp: async function () {
                this.jobs.sort((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time));
                let startDate = this.jobs[0].enqueue_time;
                await this.fetchJobsByDateInterval(new Date(startDate), new Date());
            },
            setupSlices: async function() {
                this.flashMessage("Building slice cache...");
                await timeout(200);
                let slices = [];
                let sliceLookup = [];
                this.jobs.filter(x => x.type.includes("grid")).forEach(x => {
                    for(let i = 0; i < x.event.batchSize; i++) {
                        let newSlice = JSON.parse(JSON.stringify(x));
                        newSlice.slice_num = i;
                        newSlice.upscales = [];
                        slices.push(newSlice);
                        sliceLookup[newSlice.id + "_" + i] = newSlice;
                    }
                });
                let upscales = this.jobs.filter(x => x.type.includes("upscale"));
                upscales.forEach(x => {
                    let parent = sliceLookup[x.reference_job_id + "_" + x.reference_image_num];
                    if(parent) parent.upscales.push(x.id);
                });

                slices.sort(((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time)));
                this.slices = slices;
                this.sliceLookup = sliceLookup;
                let jobLookup = [];
                this.jobs.forEach(x => { jobLookup[x.id] = x });
                this.jobLookup = jobLookup;
                this.flashMessage("Slice cache completed");
            },
            escapeRegExp: function (text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            },
            compileStats: function () {
                this.save("phrases", this.countPhrases);
                let promptMass = this.jobs.map(x => {
                    if (Array.isArray(x.event.textPrompt)) return x.event.textPrompt.join(" ");
                    else return x.event.textPrompt;
                }).join(" §§ ").toLowerCase();
                let phrases = this.countPhrases.split("\n").map(x => x.toLowerCase());
                let results = [];
                for (let phrase of phrases) {
                    let count = promptMass.match(new RegExp(this.escapeRegExp(phrase), "g"))?.length || 0;
                    results.push({ phrase, count });
                }
                results.sort((a, b) => b.count - a.count);
                this.stats = results.map(x => x.count + " " + x.phrase).join("\n");
                this.countWords();
            },
            countWords: async function () {
                let jobs = this.jobs;
                let words = (jobs.map(job => {
                    if (Array.isArray(job.event.textPrompt)) return getWords(job.event.textPrompt.join(" "));
                    else return getWords(job.event.textPrompt);
                })).flat().filter(x => x);
                let counts = Object.values(group(words)).map(x => ({ count: x.length, word: x[0] })).sort((a, b) => b.count - a.count);
                this.wordCounts = counts.map(x => x.count + " " + x.word).filter(x => x != "§§").join("\n");
            },
            toggleShow: function (id) {
                let div = document.getElementById(id);
                if (div.style.display === "none") {
                    div.style.display = "block";
                } else {
                    div.style.display = "none";
                }
                ["loadTab", "statsTab", "searchTab", "urlsTab", "downloadTab"].filter(x => x != id).forEach(x => { document.getElementById(x).style.display = "none" });
            },
            imgSrc: function (item) {

                if(item.slice_num !== undefined) return `https://cdn.midjourney.com/${item.id}/0_${item.slice_num}.webp`;

                let imgSize = this.imgSize(item);
                let size = imgSize;

                if (imgSize < 640) size = imgSize;

                //adjust for available thumbnail sizes
                if (item.type == "grid" && item.event.height * 2 < 640 || item.event.width * 2 < 640) size = "384";
                if (item.type == "upscale" && item.event.height < 640 || item.event.width < 640) size = "384";
                if (imgSize > 128 && imgSize < 384) size = "384";

                //Virtual upscale
                if(item._job_type?.includes("virtual")) {
                    return `https://cdn.midjourney.com/${item.parent_id}/0_${item.parent_grid}_${size}_N.webp`;
                }

                //Virtual upscale
                //if((item.type == "upscale" || item._job_type == "diffusion_upsample_v5_virtual" || item.type == "v5_virtual_upsample" || item.type == "v5_upscale")
                //   && (item.type == "v5_upscale" || item._job_type == "diffusion_upsample_v5_virtual" || item._parsed_params?.version == "5" || item._parsed_params?.version == "5a" || item._parsed_params?.version == "5.1" || item._parsed_params?.niji == 5)){
                //    return `https://cdn.midjourney.com/${item.parent_id}/0_${item.parent_grid}.webp`;
                //}

                //Actual upscale
                return `https://cdn.midjourney.com/${item.id}/grid_0_${size}_N.webp`;
            },
            imgSize: function(item) {
                let sizes = [128, 196, 256, 384, 640];

                if (this.searchSettings.view == "list" && item.event.width < item.event.height && this.settings.thumbnailSize < 4) return sizes[parseInt(this.settings.thumbnailSize) + 1];
                if (this.searchSettings.view == "tiles" && item.event.width > item.event.height && this.settings.thumbnailSize < 4) return sizes[parseInt(this.settings.thumbnailSize) + 1];
                return sizes[this.settings.thumbnailSize];
            },
            tileDisplaySize: function() {
                let sizes = [128, 196, 256, 384, 640];
                return sizes[this.settings.thumbnailSize];
            },
            listDisplaySize: function() {
                let sizes = [128, 196, 256, 384, 640];
                return sizes[this.settings.thumbnailSize];
            },
            imgHref: function (item) {

                //Virtual upscale
                if(item._job_type?.includes("virtual")) {
                    return `https://cdn.midjourney.com/${item.parent_id}/0_${item.parent_grid}.webp`;
                }

                //Actual upscale
                return item.slice_num !== undefined ? `https://cdn.midjourney.com/${item.id}/0_${item.slice_num}.webp`
                : `https://cdn.midjourney.com/${item.id}/grid_0.webp`;
            },
            imgOver: function(item, event) {
                let prompt = item.full_command;
                this.hoverMessage = prompt;
            },
            imgLeave: function(item, event) {
                this.hoverMessage = "";
            },
            copyHover: async function() {
                navigator.clipboard.writeText(this.hoverMessage);
            },
            version(item) {
                return item.event.eventType.replaceAll("-", " ");
                let version = item._parsed_params?.version;
                if (!version) {
                    return item.event.eventType.replaceAll("-", " ");
                }
                if (!!parseInt(version)) version = "v" + version;
                return version + " " + item.type;
            },
            fetchIdsForDate: async function (date) {
                let url = `https://legacyalpha.midjourney.com/api/app/archive/day/?day=${date.getDate()}&month=${date.getMonth() + 1}&year=${date.getFullYear()}`;
                if(params.id) url += "&userId=" + params.id;
                let response = await fetch(url);
                if (!response.ok) return null;
                return await response.json();
            },
            fetchJobsByIds: async function (jobIds) {
                let response = await fetch('https://legacyalpha.midjourney.com/api/app/job-status/', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ jobIds: jobIds })
                });
                if (!response.ok) return null;
                let jobs = await response.json();
                if (Array.isArray(jobs)) return jobs;
                else return [jobs];
            },
            fetchJobsByDateInterval: async function (startDate, stopDate) {
                const loadOutput = document.getElementById("loadOutput");
                const output = function (text) {
                    let output = document.createElement('li');
                    output.innerHTML = text;
                    loadOutput.prepend(output);
                    return output;
                }

                let ids = [];
                let existingIds = this.jobs.map(x => x.id);
                let dates = getDates(startDate, stopDate);

                for (let date of dates) {
                    let outputRow = output(`Fetching job ids for ${date.toDateString()}`);
                    let newIds = await this.fetchIdsForDate(date);
                    if (newIds === null) {
                        output("error!");
                        break;
                    }
                    ids.push(...newIds);
                    outputRow.innerHTML += ` | ${newIds.length} ids found`;
                }
                ids = ids.filter(x => !existingIds.some(y => y == x));
                output("Collected " + ids.length + " new ids");

                let loopCount = 0;
                let expectedLoops = Math.ceil(ids.length / 2000);
                while (ids.length > 0) {
                    loopCount++;
                    let idsToRequest = ids.splice(0, 2000);
                    let outputRow = output(`Fetching batch of ${idsToRequest.length} jobs (${loopCount}/${expectedLoops})`);
                    let newJobs = await this.fetchJobsByIds(idsToRequest);
                    if (newJobs === null) {
                        output("error!");
                        break;
                    }
                    this.jobs.push(...newJobs);
                    await timeout(1000);
                    outputRow.innerHTML += " | Done!";
                }
                this.jobs.forEach(x => { //fix typeless jobs
                    //if (!x.type) {
                    if(x._job_type == "diffusion") x.type = "grid"
                    else if(x._job_type?.includes("virtual")) x.type = "upscale"
                    else if (x.event.width > 512 && x.event.height > 512 && x._parsed_params?.version != 5) x.type = "upscale"
                    else x.type = "grid"
                    //}
                });

                this.jobs.sort((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time));
                this.slices = [];
                await this.saveJobs();
            },
            search: _.debounce(async function () {

                if(this.slices.length == 0 && (this.searchSettings.type == "slice" || this.searchSettings.type == "notUpscaled")){
                    await this.setupSlices();
                }

                let searchString = this.searchString;
                let quotes = [];
                let words = [];
                let commands = [];
                //if (searchString == "") return;
                if ((searchString.match(/"/g) || []).length % 2 == 0) {
                    quotes = (searchString.match(/"([^"]*)"/g) || []);
                }
                quotes.forEach(x => {
                    searchString = searchString.replace(`${x}`, "");
                });
                commands = searchString.split(" ").filter(x => x.substring(0, 2) == "--").map(x => x.toLowerCase());
                words = searchString.split(" ").filter(x => x != '""' && x != "" && x.substring(0, 2) != "--").map(x => x.toLowerCase());
                quotes = quotes.map(x => x.replaceAll('\"', "")).map(x => x.toLowerCase());
                let commandQuotes = quotes.filter(x => x.substring(0, 2) == "--");
                quotes = quotes.filter(x => x.substring(0, 2) != "--");
                if (quotes.length + words.length + commands.length + commandQuotes.length == 0) quotes.push("");

                let base = this.searchSettings.type == "slice" ? this.slices
                : this.searchSettings.type == "notUpscaled" ? this.slices.filter(x => x.upscales.length == 0)
                : this.jobs;


                //filter by search terms
                let results = base.filter(x => {
                    let prompt;
                    if (Array.isArray(x.event.textPrompt)) prompt = x.event.textPrompt.join("").toLowerCase();
                    else prompt = x.event.textPrompt;

                    if ((this.searchSettings.type == "upscale" || this.searchSettings.type == "grid") && !x.type.includes(this.searchSettings.type)) return false;

                    return words.some(y => y == "§") && x.event.textPrompt.length == 0
                    || quotes.every(y => prompt.includes(y))
                    && words.every(y => prompt.includes(y))
                    && commands.every(y => x.full_command.includes(y))
                    && commandQuotes.every(y => x.full_command.includes(y));
                });

                if (this.searchSettings.orientation != "all") { //filter by orientation
                    results = results.filter(x => orientation(x.event.width, x.event.height) == this.searchSettings.orientation);
                }


                //filter by version
                const versionCheck = this.versionCheck;
                results = results.filter(job => this.searchSettings.version.some(version => versionCheck[version](job)));

                //order by
                if (this.searchSettings.order == "newest") results.sort(((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time)));
                else if (this.searchSettings.order == "oldest") results.sort(((a, b) => new Date(a.enqueue_time) - new Date(b.enqueue_time)));
                else if (this.searchSettings.order == "longest") results.sort(((a, b) => b.full_command.length - a.full_command.length));
                else if (this.searchSettings.order == "shortest") results.sort(((a, b) => a.full_command.length - b.full_command.length));
                else if (this.searchSettings.order == "random") results = shuffle(results);

                this.resultCount = results.length;

                let skip = parseInt(this.searchSettings.skip) || 0;
                let show = parseInt(this.searchSettings.show) || results.length;
                if (skip > 0 || show > 0) results = results.slice(skip, skip + show);

                this.searchResults = results;
                console.log(this.searchResults);

            }, 300, { leading: true, trailing: true }),
            getUrls: async function () {
                let prompts = this.urlSettings.prompts.split(/\r?\n|\r|\n/g);
                let urls = prompts.map(x => {
                    let prompt = x.replace("/imagine prompt:", "").trim();
                    let job = this.jobs.find(y => y.full_command == prompt && y.type == this.urlSettings.type);

                    if (job) return this.urlSettings.format.replace("<guid>", job.id);
                    else return "";
                });
                this.urlSettings.urls = urls.join("\n");

                let missingJobs = prompts.filter(x => !this.jobs.some(y => y.full_command == x.replace("/imagine prompt:", "").trim()));
                this.urlSettings.missingJobs = missingJobs.join("\n");

                await this.save("urlSettings", this.urlSettings);
            },
            getDownload: function() {
                let document =
`
<html>
<head>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.global.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        window.ssOffline = true;
        window.ssOfflineJobs =${JSON.stringify(this.jobs)};
    </script>
    <script src="https://greasyfork.org/scripts/456989-midjourney-stats-search/code/Midjourney%20Stats%20%20Search.js"></script>
</body>
</html>
`
                let anchor = `<a class="btn btn-primary" download='ss-bundle.htm' href="data:application/octet-stream;charset=utf-8;base64,${btoa(unescape(encodeURIComponent(document)))}">Download Bundle</a>`
                window.document.getElementById("ssBundleDiv").innerHTML = anchor;
            },
            flashMessage: async function(text) {
                let target = document.getElementById("message");
                let line = document.createElement("span");
                line.innerHTML = text + "<br/>";
                target.prepend(line);
                window.setTimeout(() => line.remove(), 1000);
                return;
            },
            imageClick: async function(item, event) {
                console.log(JSON.parse(JSON.stringify(item)));

                if(this.searchSettings.linkTo == "image") return;
                else event.preventDefault();

                if(this.searchSettings.linkTo == "discord" && item.guild_id){
                    window.open(
                        `https://discord.com/channels/${item.guild_id}/${item.platform_channel_id}/${item.platform_message_id}/`,
                        "_blank");
                    return;
                }
                if(this.searchSettings.linkTo == "discord" && item.platform == "discord") {
                    window.open(
                        `https://discord.com/channels/@me/${item.platform_channel_id}/${item.platform_message_id}/`,
                        "_blank");
                    return;
                }
                if(this.searchSettings.linkTo == "discord") {
                    this.flashMessage("This job is not in Discord");
                    return;
                }
                if(this.searchSettings.linkTo == "prompt") {
                    await navigator.clipboard.writeText(item.full_command);
                    this.flashMessage(`Copied prompt: ${item.full_command}`);
                }
                if(this.searchSettings.linkTo == "gallery") {
                    window.open(
                        `https://legacyalpha.midjourney.com/app/jobs/${item.id}`,
                        "_blank");
                    return;
                }

                if(this.searchSettings.linkTo == "clipboard"){
                    let url = this.imgHref(item);
                    let clipboard = await navigator.clipboard.readText();
                    if(clipboard.split(" ").some(x => x.substring(0,4) != "http")) clipboard = "";
                    if(clipboard.includes(url)){
                        clipboard = clipboard.replaceAll(url, "");
                        clipboard = clipboard.replaceAll("  ", " ");

                        let clips = clipboard.trim().split(" ").length;
                        if(clipboard.trim() == "") clips = 0;
                        this.flashMessage(`Image URL removed from clipboard (${clips})`);
                    }
                    else {
                        clipboard += " " + url;
                        this.flashMessage(`Image URL added to clipboard (${clipboard.trim().split(" ").length})`);
                    }
                    await navigator.clipboard.writeText(clipboard.trim());
                    return;
                }

                if (this.searchSettings.linkTo == "id") {
                    await navigator.clipboard.writeText(`${item.id}`);
                    this.flashMessage(`ID copied to clipboard`);
                    return;
                }
            }
        }
    });

    let vueDiv = document.createElement('div');
    vueDiv.style = "margin:25px;";
    let bootstrap = document.createElement('link');
    bootstrap.rel = "stylesheet";
    bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css";
    let style = document.createElement('style');
    style.innerHTML = `
body {
  color: white;
  background-color: black;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 22px;
}

.btn-primary {
  margin-left: 4px;
  margin-top: 6px;
}

.message {
  background-color: black;
  position: fixed;
  margin-top: 20px;
  z-index:100;
}

.hoverMessage {
  background-color: black;
  position: fixed;
  padding 7px;
  margin: 20px;
  left: 0;
  bottom: 0;
  z-index:100;
}

.searchTop {
  position: sticky;
}
`;
    vueDiv.innerHTML = `
<div class="message" id="message"></div>
<div class="hoverMessage" @click="copyHover">{{hoverMessage}}</div>
<div class="container">
    <div class="row">
        <div style="margin-bottom:20px;">
            <button @click="toggleShow('loadTab')" class="btn btn-primary" v-if="ssOffline == false">Load</button>
            <button @click="toggleShow('statsTab')" class="btn btn-primary">Stats</button>
            <button @click="toggleShow('searchTab')" class="btn btn-primary">Search</button>
            <button @click="toggleShow('urlsTab')" class="btn btn-primary">Urls</button>
            <button @click="toggleShow('downloadTab')" class="btn btn-primary">Download</button>
            <button @click="openDiscord()" class="btn btn-primary">Discord</button>
        </div>
    </div>
</div>



<div id="loadTab" style="display:block" class="container">

    <h1>Load jobs</h1>
    <div class="row">
        <div class="col-md-6">
            <p>
                This is where you fetch all your job data from the MJ server. The data is saved in your local browser
                storage.
            </p>
            <p>
                At first you need to specify a date interval to load from. On later visits you can use the "Catch me up"
                button to fetch all new jobs since the last time.</p>
        </div>
    </div>

    <div class="row">
        <div class="col-md-2">
            <label>Start date (yyyy-mm-dd)</label><input class="form-control" type="text" v-model="settings.startDate">
            <label>End date (yyyy-mm-dd)</label><input class="form-control" type="text"
                v-model="settings.endDate"><span></span>

        </div>
        <div class="row">
            <div class="col-12">
                <button class="btn btn-primary" @click="fetchJobs">Load jobs from date interval</button>
                <button v-if="jobs.length > 0" class="btn btn-primary" @click="catchMeUp">Catch me up</button>
            </div>
        </div>

    </div>

    <p>Jobs currently loaded: {{jobs.length}}</p>

    <div style="overflow:scroll;overflow-x:hidden;height:400px;max-width:600px;">
        <ul id="loadOutput"></ul>
    </div>

</div>



<div id="statsTab" style="display:none" class="container">

    <h1>Count words</h1>
    <p style="max-width:600px;" class="text-sm">
        Type phrases to count in the box below or paste a long list. One per line.</p>

    <div style="display:block">
        <textarea class="form-control" v-model="countPhrases" cols="60" rows="20"
            style="background-color: black; color: white;"></textarea>
        <button class="form-control" @click="compileStats" style="display:block">Count Phrases</button>
    </div>
    <hr />

    <div style="display:inline-block">
        <label>Phrase counts</label><br \>
        <textarea class="form-control" readonly v-model="stats" cols="60" rows="20"></textarea>
    </div>

    <div style="display:inline-block">
        <label>Word counts</label><br \>
        <textarea class="form-control" readonly v-model="wordCounts" cols="60" rows="20"></textarea>
    </div>
</div>

<div id="statsTab" style="display:none" class="container">

    <h1>Count words</h1>
    <p style="max-width:600px;" class="text-sm">
        Type phrases to count in the box below or paste a long list. One per line.</p>

    <div style="display:block">
        <textarea class="form-control" v-model="countPhrases" cols="60" rows="20"
            style="background-color: black; color: white;"></textarea>
        <button class="form-control" @click="compileStats" style="display:block">Count Phrases</button>
    </div>
    <hr />

    <div style="display:inline-block">
        <label>Phrase counts</label><br \>
        <textarea class="form-control" readonly v-model="stats" cols="60" rows="20"></textarea>
    </div>

    <div style="display:inline-block">
        <label>Word counts</label><br \>
        <textarea class="form-control" readonly v-model="wordCounts" cols="60" rows="20"></textarea>
    </div>
</div>



<div id="searchTab" style="display:none;">
    <div class="container">
        <h1>Search</h1>
<div class="sticky-top row">
    <div class="col-10">
        <form @submit.prevent="search">
        <input type="text" class="form control" style="width:100%;" v-model="searchString"></input>
</form>
<div class="row">
    <div id="searchSettings" style="display:flex;flex-direction:row;">
        <div style="margin:8px;">
            <select class="form-control" v-model="searchSettings.type">
                <option value="upscale">Upscales</option>
<option value="grid">Grids</option>
<option value="both">Grids and upscales</option>
<option value="slice">Slices</option>
<option value="notUpscaled">Not upscaled</option>
</select>
</div>
<div style="margin:8px;">
    <select class="form-control" v-model="searchSettings.view">
        <option value="list">List</option>
<option value="tiles">Tiles</option>
</select>
</div>
<div style="margin:8px;">
    <select class="form-control" v-model="settings.thumbnailSize">
        <option value="0">Tiny</option>
<option value="1">Smaller</option>
<option value="2">Small</option>
<option value="3">Medium</option>
<option value="4">Large</option>
</select>
</div>
<div style="margin:8px;">
    <select class="form-control" v-model="searchSettings.orientation">
        <option value="all">All ratios</option>
<option value="square">Square</option>
<option value="portrait">Portrait</option>
<option value="landscape">Landscape</option>
</select>
</div>
<div style="margin:8px;">
    <select class="form-control" v-model="searchSettings.order">
        <option value="newest">Newest</option>
<option value="oldest">Oldest</option>
<option value="longest">Longest</option>
<option value="shortest">Shortest</option>
<option value="random">Random</option>
</select>
</div>
<div style="margin:8px;">
    <select class="form-control" v-model="searchSettings.linkTo">
        <option value="gallery">Link to gallery</option>
<option value="image">Link to image</option>
<option value="discord">Link to discord</option>
<option value="prompt">Copy prompt</option>
<option value="clipboard">Add to clipboard</option>
<option value="id">Copy id</option>
</select>
</div>
</div>
<div class="row" style="display:flex;flex-direction:row;">
    <div class="input-group mb-3" style="margin:8px;">
        <span class="input-group-text">Show</span><input class="form-control" type="text"
v-model="searchSettings.show">
    <span class="input-group-text">Skip</span><input class="form-control" type="text"
v-model="searchSettings.skip">
    </div>
<label>Showing {{searchResults.length}} out of {{resultCount}} results</label>
</div>
</div>
</div>
<div class="col-2">
    <select class="form-control" size="6" v-model="searchSettings.version" multiple>
<option value="v6">v6</option>
<option value="niji5">niji5</option>
<option value="v5">v5</option>
<option value="v4">v4</option>
<option value="niji">niji</option>
<option value="test">test</option>
<option value="testp">testp</option>
<option value="v123">v1-v3</option>
<option value="leftover">leftover</option>
</select>
</div>
<hr />
    </div>



<div class="container-fluid">

    <div v-if="searchSettings.view == 'list'">
        <div v-for="(item, index) in searchResults" style="display:flex;flex-direction:row;">
            <div style="flex-shrink:0;margin:6px">
                <a target="_blank" @mouseover="imgOver(item, $event)" @mouseleave="imgLeave(item, $event)"
@click="imageClick(item, $event)" :href="imgHref(item)">
    <img loading="lazy" :alt="item.full_command" :src="imgSrc(item)"
    :style="{width: listDisplaySize(item) + 'px',  height: 'auto'}"></a>
</div>
<div class="text-sm" style="max-width:600px;margin:18px">
    <p>{{item.enqueue_time.substring(0, item.enqueue_time.indexOf("."))}} - {{version(item)}}</p>
<p>{{item.full_command}}</p>
</div>
</div>
</div>

<div v-if="searchSettings.view == 'tiles'">
    <div v-for="(item, index) in searchResults" style="margin:3px;display:inline-block;vertical-align:top;">
        <a target="_blank" @mouseover="imgOver(item, $event)" @mouseleave="imgLeave(item, $event)"
@click="imageClick(item, $event)" :href="imgHref(item)">
    <img loading="lazy" :alt="item.full_command" :src="imgSrc(item)"
    :style="{height: tileDisplaySize(item) + 'px',  width: 'auto', maxWidth: '100%'}"></a>
</div>
</div>

</div>
</div>
</div>



<div id="urlsTab" style="display:none" class="container">
    <h1>Make URL list</h1>
<p style="max-width:600px;" class="text-sm">
    Paste a list of exact prompts (full command) and get back the corresponding image urls in the same
    order.
    "/imagine prompt:" will be ignored if present.</p>

<div style="margin:8px;">
    <label>URL format<input class="form-control" type="text" v-model="urlSettings.format"
style="width:600px;"></label><br />
    </div>

<div style="margin:8px;">
    <label><input type="radio" v-model="urlSettings.type" value="grid">Grids</label><br />
        <label><input type="radio" v-model="urlSettings.type" value="upscale">Upscales</label><br />
            </div>

<button class="btn btn-primary" @click="getUrls" style="display:block">Get URLs</button>

<div style="display:inline-block">
    <label>Prompt list (paste here)</label><br \>
<textarea class="form-control" v-model="urlSettings.prompts" cols="140" rows="20"></textarea>
</div>

<div style="display:inline-block">
    <label>Urls</label><br \>
<textarea class="form-control" readonly v-model="urlSettings.urls" cols="140" rows="20"></textarea>
</div>

<div style="display:inline-block">
    <label>Missing jobs</label><br \>
<textarea class="form-control" readonly v-model="urlSettings.missingJobs" cols="140" rows="20"></textarea>
</div>

</div>



<div id="downloadTab" style="display:none" class="container">
    <div class="row">
        <h1>Download </h1>
<div class="col-md-6">
    <p>This feature embeds your prompt data in an html file which launches this app using the
    bundled data rather than requiring access to your MJ gallery. This allows you access without an
    active
    subscription.</p>
<div id="ssBundleDiv"><button class="btn btn-primary" @click="getDownload">Prepare download</button>
</div>
</div>
</div>
</div>
`;

    let target = document.body;

    if(!window.ssOffline){
        await timeout(1000);
        target.innerHTML = "";
        document.head.innerHTML = "";
    }

    target.prepend(vueDiv);
    document.head.append(bootstrap);
    document.head.append(style);
    window.ssApp.mount(vueDiv);
    window.scrollTo(0, 0);

    window.setTimeout(() => { window.onhashchange = () => window.location.reload(); }, 100);

    function orientation(width, height) {
        if (width > height) return "landscape";
        if (width < height) return "portrait";
        else return "square";
    }

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    function getDates(startDate, stopDate) {
        var dateArray = new Array();
        var currentDate = startDate;
        while (currentDate < new Date(stopDate.addDays(1).toDateString())) {
            dateArray.push(new Date(currentDate));
            currentDate = currentDate.addDays(1);
        }
        return dateArray;
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function compileStats(jobs) {
        let words = (jobs.map(job => getWords(job.event?.textPrompt?.join(" ")))).flat().filter(x => x);
        let counts = Object.values(group(words)).map(x => ({ count: x.length, word: x[0] })).sort((a, b) => b.count - a.count);

        var elemDiv = document.createElement('div');
        elemDiv.innerHTML = counts.map(x => x.count + " " + x.word).join("<br />");
        document.body.prepend(elemDiv);
    }

    function getWords(textString) {
        textString = textString.toLowerCase().replaceAll(",", " ").replaceAll("+", " ").replaceAll(";", " ");
        return textString.split(" ").filter(x => x != "");
    }

    function shuffle(array) {
        const newArray = [...array];
        const length = newArray.length;

        for (let start = 0; start < length; start++) {
            const randomPosition = Math.floor((newArray.length - start) * Math.random());
            const randomItem = newArray.splice(randomPosition, 1);

            newArray.push(...randomItem);
        }

        return newArray;
    }

    function group(strings) {
        return strings.reduce(function (rv, x) {
            (rv[x] = rv[x] || []).push(x);
            return rv;
        }, {});

    };
};