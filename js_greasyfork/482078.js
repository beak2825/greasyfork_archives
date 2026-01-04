// ==UserScript==
// @name         MJ Extensions
// @namespace    http://tampermonkey.net/
// @version      0.42
// @description  Various extended features for the MJ website.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=midjourney.com
// @license      MIT
// @grant        none
// @run-at       document-start
// @require      https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js

// @match        https://alpha.midjourney.com/explore*
// @match        https://alpha.midjourney.com/imagine*
// @match        https://alpha.midjourney.com/archive*
// @match        https://alpha.midjourney.com/jobs*

// @match        https://mj-gallery.com/*
// @match        https://cdn.discordapp.com/attachments/*
// @match        https://media.discordapp.net/attachments/*
// @match        https://cdn.midjourney.com/*
// @match        https://i.mj.run/*
// @match        https://storage.googleapis.com/dream-machines-output/*
// @downloadURL https://update.greasyfork.org/scripts/482078/MJ%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/482078/MJ%20Extensions.meta.js
// ==/UserScript==


(async function() {
    'use strict';

    if(["https://cdn.midjourney.com",
        "https://mj-gallery.com",
        "https://cdn.discordapp.com",
        "https://media.discordapp.net",
        "https://i.mj.run",
        "https://storage.googleapis.com/dream-machines-output/"].some(x => window.location.href.includes(x))) {
        let id = extractGuid(window.location.href);
        if (id) {
            let bootstrap = document.createElement('link');
            bootstrap.rel = "stylesheet";
            bootstrap.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css";
            document.head.append(bootstrap);

            let div = document.createElement("div");
            div.style.position = "fixed";
            div.style.margin = "3px";
            div.innerHTML = `
            <a class="btn btn-primary" href="https://alpha.midjourney.com/jobs/${id}/">Show on Midjourney</a>
            <button class="btn btn-primary" onclick="window.copyId()">Copy job id</button>`;
            document.body.prepend(div);
            window.copyId = () => window.navigator.clipboard.writeText(id);
        }
        return;
    }

    let _ = window._;
    window.loadedJobs = [];
    window.currentId = null;
    window.userId = null;
    window.fetchOptions = null;
    window.lastPrompt = null;
    window.explore = false;
    window.customSearch = null;

    if(window.location.href.startsWith("https://alpha.midjourney.com/jobs/")) window.currentId = extractGuid(window.location.href);

    window.seconds = 0;
    (async () => {
        while(true) {
            await timeout(10000);
            window.seconds += 10;
        }
    })();

    let filters = [
        { name: "upscalesOnly", title: "Upscales only", rule: x => ["upsample", "upscale"].some(y => x.event_type?.includes(y) || x.job_type.includes(y)) && !["virtual"].some(y => x.event_type.includes(y)) },
        { name: "imagePromptsOnly", title: "Image prompts only", rule: x => x.full_command.includes("http") },
        { name: "nijiOnly", title: "Niji only", rule: x => x.event_type?.includes("anime") || x.job_type.includes("anime") },
        { name: "mjOnly", title: "Midjourney only", rule: x => !x.event_type?.includes("anime") && !x.job_type.includes("anime") },
        { name: "parentsOnly", title: "Parents only", rule: x => window.loadedJobs.some(y => y.parent_id == x.id && ["remix", "variation", "remaster"].some(z => y.event_type.includes(z))) },
        { name: "blendsOnly", title: "Blends only", rule: x => x.full_command.replaceAll(/(<?https?:\/\/[^\s]+>?)/g, "").trim().startsWith("--") },
        { name: "tunedOnly", title: "Tuned only", rule: x => { let style = [...x.full_command.matchAll(/--style ([A-Za-z0-9-]+)/g)]?.[0]?.[1]; return style && !["raw", "expressive", "cute", "scenic", "default", "4a", "4b", "4c"].includes(style); }},
        { name: "srefNumberOnly", title: "Sref number only", rule: x => x.full_command.match(/(--sref [0-9:]+)/g) },
        { name: "customSearch", title: "Custom search", rule: x => x.full_command.includes(getCustomSearchString()) },
    ];
    function getCustomSearchString() {
        if (window.customSearch != null) return window.customSearch;
        else {
            window.customSearch = window.prompt("Filter for prompts containing string", "") || "";
            return getCustomSearchString();
        }
    }
    filters.forEach(x => {
        if((new URLSearchParams(window.location.search)).get(x.name)) x.active = true;
    });
    if (filters.some(x => x.active)) window.history.replaceState(null, "", "/archive");

    document.addEventListener("mousemove", (event) => {
        // Get mouse coordinates relative to the viewport
        window.mouseX = event.clientX;
        window.mouseY = event.clientY;
    });

    async function addNav() {
        await timeout(800);
        if(document.getElementById("custom-nav")) return;
        let nav = document.getElementsByTagName("nav")[0].firstElementChild.appendChild(createElement(`<div id="custom-nav"></div>`));
        nav.appendChild(createElement(`<label class="text-sm">global filters</label>`));
        filters.forEach(x => nav.appendChild(createElement(`<a draggable="false" class="flex relative hover:z-[var(--dynamic-z)]  w-full group min-w-fit items-center gap-2 rounded-full  bg-light-bg dark:bg-dark-bg p-2 text-light-primary dark:text-dark-primary" href="/archive?${x.name}=true""><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="truncate text-sm font-semibold ">${x.title}</p></a>`)));
        nav.appendChild(createElement(`<label class="text-sm">pop-ups</label>`));
        nav.appendChild(createElement(`<a onclick="openImagePromptWindow()" onmouseover="" style="cursor: pointer;" draggable="false" class="flex relative hover:z-[var(--dynamic-z)]  w-full group min-w-fit items-center gap-2 rounded-full  bg-light-bg dark:bg-dark-bg p-2 text-light-primary dark:text-dark-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="truncate text-sm font-semibold ">My Image Prompts</p></a>`));
        nav.appendChild(createElement(`<a onclick="openSamplesWindow()" onmouseover="" style="cursor: pointer;" draggable="false" class="flex relative hover:z-[var(--dynamic-z)]  w-full group min-w-fit items-center gap-2 rounded-full  bg-light-bg dark:bg-dark-bg p-2 text-light-primary dark:text-dark-primary"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true" height="22"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg><p class="truncate text-sm font-semibold ">Style Samples</p></a>`));


        nav.appendChild(createElement(`<label class="text-sm">status</label>`));
        let status = await fetch("https://storage.googleapis.com/midjourney-status/status.json").then(x => x.json());
        let statusPicks = {
            v6_fast: status.metrics.find(x => x.name == "jobs.v6.fast.model"),
            v6_relax: status.metrics.find(x => x.name == "jobs.v6.relax.model"),

            v6_relax_upscale: status.metrics.find(x => x.name == "jobs.v6.relax.upscaler"),
            v6_relax_niji: status.metrics.find(x => x.name == "jobs.v6.relax.niji-model"),
            v6_relax_niji_upscale: status.metrics.find(x => x.name == "jobs.v6.relax.niji-upscaler")
        };

        let statusLine = function(name, fast, relax) {
            return `<div class="flex w-full text-light-700 dark:text-dark-200 gap-1 shrink grow items-baseline justify-between whitespace-pre"><p>${name} ${fast}s / ${relax}s</p></div>`;
        }

        nav.appendChild(createElement(`
<div class="flex px-4 text-[13px] font-medium flex-wrap md:flex-col gap-2">
    <div
        class="flex w-full text-light-700/50 dark:text-dark-200/50 gap-1 shrink grow items-baseline justify-between whitespace-pre">
        ${statusLine("v6", (statusPicks.v6_fast.value * 60).toFixed(0), (statusPicks.v6_relax.value * 60).toFixed(0))}
    </div>

</div>`));

        //Add image if deleted
        await timeout(1000);
        const h1_404 = [...document.querySelectorAll("h1")].find(el => el.textContent.trim() === "404")
        if(h1_404) {
            const id = extractGuid(document.location.href);
            const index = getQueryParam("index") || 0;
            h1_404.innerHTML = `<img src="https://cdn.midjourney.com/${id}/0_${index}.jpeg" style="object-fit: contain;"/>`;
        }
    };
    addNav();

    var originalFetch = window.fetch;
    window.fetch = async function(url, options) {
        let body;

        if(typeof url == "string" && url.startsWith("https://alpha.midjourney.com/api/submit-jobs")) {
            body = JSON.parse(options.body);
            if(body?.f?.mode && window.ctrlPressed) body.f.mode = "fast"; //fast with ctrl

            if(body.prompt) { // Interact with prompt string, if available
                //strip leftover weights
                if(body.prompt.includes("--cw ") && !body.prompt.includes("--cref ")) {
                    body.prompt = body.prompt.replaceAll(/--cw [^ -]*/g, "");
                }
                if((body.prompt.includes("--sw ") || body.prompt.includes("--sv ")) && !body.prompt.includes("--sref ")) {
                    body.prompt = body.prompt.replaceAll(/--sw [^ -]*/g, "");
                    body.prompt = body.prompt.replaceAll(/--sv [^ -]*/g, "");
                }
                if(body.prompt.includes("--ow ") && !body.prompt.includes("--oref ")) {
                    body.prompt = body.prompt.replaceAll(/--ow [^ -]*/g, "");
                }
                //change urls with grid_0
                if(body.prompt.includes("grid_0")) {
                    body.prompt = body.prompt.replaceAll("grid_0", "0_0");
                }
                //correct profile pasting for convenience
                if (body.prompt.includes("--profile --p")) {
                    body.prompt = body.prompt.replace("--profile --p", "--p");
                }
                //fix for empty --profile
                if (body.prompt.includes("--profile -")) {
                    //body.prompt = body.prompt.replace("--profile -", "-");
                }
                //switch mode with ctrl
                if(window.ctrlPressed && body.prompt.includes("--niji 6")) {
                    body.prompt = body.prompt.replace("--niji 6", "");
                    body.prompt = body.prompt.replace("--raw", "");
                }
                //switch mode with ctrl
                if(window.ctrlPressed && !body.prompt.includes("--niji 6")) {
                    body.prompt = body.prompt.replace("--v 6.1", "");
                    body.prompt += " --niji 6 --raw";
                }
            }
            if(body.newPrompt) {
                if(body.newPrompt.includes("--cw ") && !body.newPrompt.includes("--cref ")) {
                    body.newPrompt = body.newPrompt.replaceAll(/--cw [^ -]*/g, "");
                }
                if((body.newPrompt.includes("--sw ") || body.newPrompt.includes("--sv ")) && !body.newPrompt.includes("--sref ")) {
                    body.newPrompt = body.newPrompt.replaceAll(/--sw [^ -]*/g, "");
                    body.newPrompt = body.newPrompt.replaceAll(/--sv [^ -]*/g, "");
                }
            }
            if(body.t == "outpaint" || body.t == "pan") {
                body.newPrompt = window.prompt("Alter prompt?", window.loadedJobs.find(x => x.id == window.currentId)?.full_command);
            }
            // Auto turbo
            //if (["pan", "outpaint", "repaint", "upscale"].some(x => body.t == x) || body.prompt?.includes("--oref")) body.f.mode = "turbo";

            options.body = JSON.stringify(body);
            console.log("Posted prompt:", body);
            window.lastPrompt = body.prompt;
        }  // End prompt string interactions

        // Handle response
        let response = await originalFetch.apply(window, [url, options]);
        if(!response.ok || !response.body) return response;
        let responseBody;

        // Modify jobs list
        if(typeof url == "string" && url.startsWith("https://alpha.midjourney.com/api/imagine")) {
            responseBody = await response.json();
            window.fetchOptions = options;
            window.userId = extractGuid(url);
            addJobs(responseBody.data);

            // Re-add deleted
            let firstJob = responseBody.data[0];
            let lastJob = responseBody.data[responseBody.data.length-1];
            let deleted = window.loadedJobs.filter(x => new Date(x.enqueue_time) < new Date(firstJob.enqueue_time) && new Date(x.enqueue_time) > new Date(lastJob.enqueue_time) && !responseBody.data.some(y => y.id == x.id));
            responseBody.data = [...responseBody.data, ...deleted];
            responseBody.data.sort(function(a,b){ return new Date(b.enqueue_time) - new Date(a.enqueue_time); });

            // Apply search filters
            filters.forEach(x => {
                if(x.active) responseBody.data = responseBody.data.filter(x.rule);
            });

            // Replace broken urls
            if(window.brokenUrls) {
                responseBody.data?.forEach(x => { //Bulk fix
                    if(x.full_command.startsWith("<")) {
                        window.brokenUrls.forEach(y => {
                            if(x.full_command.includes(y.originalUrl)) {
                                x.full_command = x.full_command.replace(y.originalUrl, y.redirectedUrl.replace("mj-gallery", "cdn.midjourney"));
                            }
                        });
                    }
                });
            }
        }

        // Handle explore jobs
        else if(typeof url == "string" &&  url.startsWith("https://alpha.midjourney.com/api/recent-jobs")) {
            responseBody = await response.json();
            await addPcodes(responseBody.jobs);
        }

        // Handle single job status
        else if(typeof url == "string" && url.startsWith("https://alpha.midjourney.com/api/job-status")) {
            responseBody = await response.json();
            if (responseBody.length == 0) { // Show deleted job
                let id = extractGuid(window.location.href);
                let job = window.loadedJobs.find(x => x.id == id);
                if (job) responseBody.push(job);
            }
            await addPcodes(responseBody);
            if(window.brokenUrls) {
                responseBody.forEach(x => {
                    if(x.full_command.startsWith("<")) {
                        window.brokenUrls.forEach(y => {
                            if(x.full_command.includes(y.originalUrl)) {
                                x.full_command = x.full_command.replace(y.originalUrl, y.redirectedUrl.replace("mj-gallery", "cdn.midjourney"));
                            }
                        });
                    }
                });
            }
        }

        else {
            return response;
        }

        const modifiedResponse = new Response(JSON.stringify(responseBody), {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
        });
        return modifiedResponse;
    };

    async function addJobs(jobs) {
        let preCount = window.loadedJobs.length;
        let loadedIds = window.loadedJobs.map(x => x.id);
        jobs.filter(x => !loadedIds.includes(x.id)).forEach(x => window.loadedJobs.push(x));
        //         jobs.filter(x => loadedIds.includes(x.id)).forEach(x => {
        //             let existing = window.loadedJobs.find(y => y.id == x.id);
        //             _.merge(existing, x);
        //         });
        if(window.loadedJobs.length > preCount) await saveJobs();
    }
    window.addPcodes = async function(jobs) {
        let pcodes = await load("pcodes", []);
        jobs.forEach(x => {
            if(!x.full_command.includes("--p") || x.user_id == window.userId) return;

            let user = x.username;
            let code = [...x.full_command.matchAll(/--p(?:ersonalize)? ([A-Za-z0-9-]+)/g)]?.[0]?.[1];

            if(!pcodes.some(y => y.code == code)) {
                pcodes.push({user: x.username, code: code});
            }
        });
        await save("pcodes", pcodes.filter(x => x.code));
        window.pcodes = pcodes;
    };

    window.localforage.config({
        name: 'mj_extensions',
        version: 1.0,
        size: 4980736,
        storeName: 'keyvaluepairs',
        description: ''
    });
    async function save (key, value) {
        await window.localforage.setItem(key, JSON.stringify(value));
    };
    async function load (key, fallback = null) {
        let json = await window.localforage.getItem(key);
        if (json !== null) return JSON.parse(json);
        else return fallback;
    }
    let saveJobs = _.debounce(async function saveJobs() {
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
        window.loadedJobs = removeDuplicateObjects(window.loadedJobs);

        let jobs = window.loadedJobs;
        let promises = [];
        jobs.sort((a, b) => new Date(b.enqueue_time) - new Date(a.enqueue_time));

        for(let i = 0; i < jobs.length / 1000; i++){
            let chunk = jobs.slice(i*1000,(i+1)*1000);
            promises.push(save("jobs_" + i, chunk));
            //console.log("Saved chunk_" + i);
        }
        await Promise.all(promises);
        console.log("Saved all jobs");
    }, 5000);
    async function loadJobs() {
        for(let i = 0; true; i++) {
            let chunk = await load("jobs_" + i);
            if (chunk){
                window.loadedJobs.push(...chunk);
            }
            else break;
        }
        console.log("Loaded stored jobs");
    }
    loadJobs();


    // Hotkeys
    async function hotkey(e) {
        if (e.altKey && e.key === 'q') {
            document.getElementById("search-input")?.focus();
        }
        if (e.altKey && e.key === 'w') {
            let status = await fetch("https://storage.googleapis.com/midjourney-status/status.json").then(x => x.json());
            let statusPicks = {
                v6_relax: status.metrics.find(x => x.name == "jobs.v6.relax.model"),
                v6_relax_upscale: status.metrics.find(x => x.name == "jobs.v6.relax.upscaler"),
                v6_relax_niji: status.metrics.find(x => x.name == "jobs.v6.relax.niji-model"),
                v6_relax_niji_upscale: status.metrics.find(x => x.name == "jobs.v6.relax.niji-upscaler")
            };
            console.log(statusPicks);
        }
        if (e.key === '+') {
            let activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' && activeElement.type === 'text' || activeElement.tagName === 'TEXTAREA')) return;
            Array.from(document.getElementsByTagName("button")).find(x => x.title == "Like Image (Alt+L)" || x.title == "Unlike Image (Alt+L)")?.click();
        }
        if(e.ctrlKey && e.key == "b") {
            navigator.clipboard.writeText(window.lastPrompt);
        }
        if (e.ctrlKey && e.key === 'c') {
            if(window.location.href.startsWith("https://alpha.midjourney.com/jobs/") && !window.getSelection().toString()){
                let job = window.loadedJobs.find(x => x.id == window.currentId);
                if(job) {
                    navigator.clipboard.writeText(job.full_command);
                    console.log("copied:", job.full_command);
                }
            }
        }
        if(e.key == 'Control') {
            let element = document.elementFromPoint(mouseX, mouseY);
            if(element.innerText == "sref") element = element.parentNode;
            console.log(element);
            if(element.tagName == "SPAN" && element.innerText.startsWith("sref")) {
                let sref = element.innerText.split(" ")[1].split("::")[0];
                console.log(Number(sref));
                if(Number(sref) < 1000) {
                    let sampleImage = window.loadedJobs.find(x => x.full_command.includes("--seed 101") && x.full_command.includes("--sref " + sref) && x.full_command.includes("--sw 100"));
                    imgModal(`https://cdn.midjourney.com/${sampleImage.id}/0_0.jpeg`);
                }
                else {
                    imgModal(`https://www.prompteraid.com/img/midjourney-7/${sref.toString()[0]}/${sref}.webp`);
                }
            }
        }
    }
    document.addEventListener('keydown', hotkey, false);

    window.ctrlPressed = false;
    // Function to track keydown and keyup events
    document.addEventListener("keydown", (event) => {
        if (event.key === "Control") {
            window.ctrlPressed = true;
        }
    });
    document.addEventListener("keyup", (event) => {
        if (event.key === "Control") {
            window.ctrlPressed = false;
        }
    });


    // URL change routine
    (async () => {
        await timeout(500);
        let oldHref = document.location.href;
        const body = document.body;
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;

                if(document.location.href.includes("editor")) return;
                addNav();

                if(window.location.href.startsWith("https://alpha.midjourney.com/explore")) window.explore = true;
                if(window.location.href.startsWith("https://alpha.midjourney.com/archive") || window.location.href.startsWith("https://alpha.midjourney.com/imagine")) window.explore = false;
                if(window.location.href.startsWith("https://alpha.midjourney.com/jobs")){
                    let id = extractGuid(window.location.href);
                    window.currentId = id;
                    addExtensionDiv();
                }
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    })();

    function imgSrc(job, grid){
        const base = "https://cdn.midjourney.com";
        if(job.event_type?.includes("virtual")) return `${base}/${job.parent_id}/0_${job.parent_grid}_640_N.jpeg`;
        if(job.event_type?.includes("video")) return `${base}/video/${job.id}/${grid || 0}_640_N.webp`;
        if(typeof grid === 'number') return `${base}/${job.id}/0_${grid}_640_N.jpeg`;
        if(["diffusion", "variation", "remix", "repaint", "inpaint", "outpaint", "pan"].some(x =>job.event_type?.includes(x))) return `${base}/${job.id}/0_0_640_N.jpeg`;
        return `${base}/${job.id}/0_0_640_N.jpeg`;
    }

    function getLineage(jobs) {
        let last = jobs.findLast(x => true);

        if(!last.job.parent_id && window.legacyParentMap && window.legacyParentMap[last.job.id]) {
            last.job.parent_id = window.legacyParentMap[last.job.id].parent_id;
            last.job.parent_grid = window.legacyParentMap[last.job.id].parent_grid;
        }

        if(last.job.parent_id){
            let parentJob = window.loadedJobs.find(x => x.id == last.job.parent_id);
            if(parentJob){
                jobs.push({job: parentJob, grid: last.job?.parent_grid});
                return getLineage(jobs);
            }
        }
        return jobs.slice(1); //remove the original job and finish recursion
    }

    function getChildren(parentId, parentIndex) {
        let loadedChildren = window.loadedJobs.filter(x => x.parent_id == parentId && x.parent_grid == parentIndex);
        let legacyChildrenIds = window.legacyParentMap?.filter(x => x.parent_id == parentId && x.parent_grid == parentIndex);
        let legacyChildren = window.loadedJobs.filter(x => legacyChildrenIds.includes(x.id));
        return loadedChildren.concat(legacyChildren);
    }

    async function addExtensionDiv() {
        let extensionDiv = document.getElementById("extensionDiv");
        if(!extensionDiv){
            let target = document.getElementById("lightboxPrompt");
            if(!target) return;
            extensionDiv = document.createElement("div");
            extensionDiv.id = "extensionDiv";
            target.appendChild(extensionDiv);
        }
        extensionDiv.innerHTML = "";

        let currentJob = window.loadedJobs.find(x => x.id == window.currentId);
        let currentIndex = (new URLSearchParams(window.location.search)).get("index");

        if(!currentJob) {
            if(window.explore) return;
            if(window.seconds > 20) {
                window.seconds = 0;
                extensionDiv.innerHTML = '<div class="text-xs">getting jobs...</div>';
                await fetch(`https://alpha.midjourney.com/api/imagine?user_id=${window.userId}&page_size=1000`, window.fetchOptions);
                await timeout(1000);
                extensionDiv.innerHTML = "";
                currentJob = window.loadedJobs.find(x => x.id == window.currentId);
                if(!currentJob) {
                    console.log("Fetching new jobs didn't help");
                    window.seconds = -60;
                    return;
                }
            }
            else return;
        }

        console.log("viewing job:", currentJob);

        try {
            let styles = [...currentJob.full_command.matchAll(/--style ([A-Za-z0-9-]+)/g)][0][1];
            if(styles.length > 0) {
                let domain = currentJob.event_type.includes("anime") || currentJob.job_type.includes("anime") ? "nijijourney" : "midjourney";
                let stylesList = styles.split("-").filter(x => x.length >= 8).map( x => `<a target="_blank" href="https://tuner.${domain}.com/code/${x}">${x.substring(0, 8)}...</a>`).join("<br/>");
                if (stylesList.length > 0) extensionDiv.innerHTML += `<div class="text-xs">Tuners</div><div class="text-xs dark:text-dark-secondary text-light-secondary">${stylesList}</div>`;
            }
        }
        catch (e) {
        }

        let lineage = getLineage([{job: currentJob, grid: null}]);
        if (lineage.length > 0) {
            let divs = lineage.map(x => `<div>${x.job.event_type || x.job.job_type}<br/><a href="https://alpha.midjourney.com/jobs/${x.job.id}?index=${x.grid}" /><img style="width:128px;" src="${imgSrc(x.job, x.grid)}" /></a></div>`);
            let element = createElement(`<div><div class="text-xs">Parent line</div><div class="text-xs dark:text-dark-secondary text-light-secondary">${divs.join(" ")}</div></div>`);
            extensionDiv.appendChild(element);
        }

        let children = getChildren(currentJob.id, currentIndex);
        if(children.length > 0) {
            let divs = children.map(x => `<div>${x.event_type || x.job_type}<br/><a href="https://alpha.midjourney.com/jobs/${x.id}" /><img style="width:128px;" src="${imgSrc(x)}" /></a></div>`);
            let element = createElement(`<div><div class="text-xs">Children</div><div class="text-xs dark:text-dark-secondary text-light-secondary">${divs.join(" ")}</div></div>`);
            extensionDiv.appendChild(element);
        }
    }
    await timeout(1000);
    addExtensionDiv();

    window.openImagePromptWindow = function () {

        let images = extractUrls(window.loadedJobs
                                 .filter(x => x.full_command.includes("http"))
                                 .map(x => x.full_command)
                                 .join(" ")
                                ).filter(onlyUnique);

        if(window.brokenUrls) {
            images = images.map(x => {
                let broken = window.brokenUrls.find(y => y.originalUrl == x);
                if(broken) return broken.redirectedUrl.replace("mj-gallery", "cdn.midjourney");
                else return x;
            });
        }

        let divs = images.map(x => `<div style="display:inline-block;"><img src="${x}" loading="lazy" style="min-width:250px;height:500px;" onerror="imgError(this)"/></div>`).join(" ");

        let viewer = window.open();
        window.viewer = viewer;
        viewer.document.head.appendChild(createElement("<title>My Image Prompts</title>"));
        viewer.document.head.appendChild(createElement('<link rel="icon" type="image/png" sizes="32x32" href="https://alpha.midjourney.com/favicon-32x32.png"/>'));
        viewer.document.body.style.background = "black";
        viewer.document.body.style.margin = "0px";
        viewer.document.body.innerHTML = divs;

        let scriptTag = window.viewer.document.createElement("script");
        scriptTag.innerHTML = `function imgError(img) {
          console.log("imgError:", img.src);
          img.remove();
        }`;
        viewer.document.body.appendChild(scriptTag);
    }

    window.openSamplesWindow = function() {
        let filter = window.prompt("Assemble prompts containing...", "");
        if(filter == "") return;
        let images = window.loadedJobs.filter(x => x.full_command.includes(filter) && x.event_type == "diffusion");

        images.forEach(x => {
            x.sref = [...x.full_command.matchAll(/--sref ([0-9]+)/g)]?.[0]?.[1];
            x.sw = [...x.full_command.matchAll(/--sw ([0-9]+)/g)]?.[0]?.[1];
        });

        images.sort((a, b) => a.sw - b.sw );
        images.sort((a, b) => a.sref - b.sref );
        images = _.uniqBy(images, x => "sw:" + x.sw + " sref:" + x.sref);
        let groups = Object.entries(_.groupBy(images, x => x.sref)).map(x => x[1]);

        let divs = groups.map(images => `<div class="group" id="${images[0].sref}">${images.map(x => `<div><div class="seed-number">${x.sref}</div>
        ${[0, 1, 2, 3].map(y => `<a target="_blank" href="https://cdn.midjourney.com/${x.id}/0_${y}.jpeg"><img src="https://cdn.midjourney.com/${x.id}/0_${y}_640_N.jpeg" loading="lazy" class="image" /></a>`).join("")}
        </div>`).join("\n")}</div>`).join("");

        let viewer = window.open();
        window.viewer = viewer;
        viewer.document.head.appendChild(createElement("<title>Style Samples</title>"));
        viewer.document.head.appendChild(createElement('<link rel="icon" type="image/png" sizes="32x32" href="https://alpha.midjourney.com/favicon-32x32.png"/>'));
        viewer.document.head.appendChild(createElement('<style>.seed-number { color:white; background-color:black; position:absolute; font-size:60px; } .image { max-width:25%;height:33.33vh; } </style>'));
        viewer.document.body.style.background = "black";
        viewer.document.body.style.margin = "0px";
        viewer.document.body.innerHTML = divs;

        let scriptTag = window.viewer.document.createElement("script");
        scriptTag.innerHTML = `
        function hotkey(e) {
            if (e.key === 'ArrowLeft') {
                Array.from(document.getElementsByClassName("group")).findLast(x => x.getBoundingClientRect().top < -1).scrollIntoView(true);
            }
            if (e.key === 'ArrowRight') {
                Array.from(document.getElementsByClassName("group")).find(x => x.getBoundingClientRect().top > 1).scrollIntoView(true);
            }
        }
        document.addEventListener('keydown', hotkey, false);`;

        viewer.document.body.appendChild(scriptTag);
    }

    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function extractGuid(string) {
        let matches = string.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}/i);
        if (matches.length > 0) return matches[0];
        else return null;
    }
    function getQueryParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }
    function createElement(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
    function extractUrls(text) {
        const urlRegex = /(https?:\/\/[^>\s]+)/g;
        const matches = text.match(urlRegex);
        return matches ? matches : [];
    }
    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }
    function imgModal(src) {
        // Remove any existing modal first
        const existingModal = document.getElementById("image-modal");
        if (existingModal) existingModal.remove();

        // Create modal overlay
        const modal = document.createElement("div");
        modal.id = "image-modal";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.background = "rgba(0,0,0,0.8)";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.zIndex = "9999";

        // Create image element
        const img = document.createElement("img");
        img.src = src;
        img.style.maxWidth = "90%";
        img.style.maxHeight = "90%";
        img.style.borderRadius = "8px";
        img.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

        // Append image to modal
        modal.appendChild(img);

        // Close modal on click
        modal.addEventListener("click", () => {
            modal.remove();
        });

        // Append modal to body
        document.body.appendChild(modal);
    }

})(); //END