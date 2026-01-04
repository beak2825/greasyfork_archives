// ==UserScript==
// @name         Prompt Scheduler
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Schedules prompts for image generation
// @author       sometimes
// @match        https://novelai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novelai.net
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/482039/Prompt%20Scheduler.user.js
// @updateURL https://update.greasyfork.org/scripts/482039/Prompt%20Scheduler.meta.js
// ==/UserScript==

const MXD = {
    "MX1": "[[anime coloring, cel shading]], artist:dino (dinoartforame), [artist:xilmo], [[artist:potg (piotegu)]], [[artist:namori]]",
    "MX2": "[[artist:namori]], artist:dino (dinoartforame), [[artist:xilmo]], [artist:kawakami rokkaku]",
    "MX3": "{{artist:ask (askzy), artist:ciloranko}}, {artist:shnva}, artist:sho (sho lwlw)",
    "MX4": "{{{{artist:ask (askzy), artist:ciloranko}}}}, [[[[[[[artist:as109]]]]]]], [[[[[artist:pumpkinspicelatte, artist:asakuraf]]]]]",
    "MX5": "[artist:as109], artist:kurotsuki (luowei99), {{artist:fukutchi}}, {artist:klaius}, artist:kikurage (crayon arts)",
    "MX6": "[[[artist:as109]]], [[[artist:asakuraf]]], {{artist:reoen}}, artist:kurotsuki (luowei99)"
}

const artists_ecchi = {
    "potg (piotegu)": -1,
    "xilmo": 0,
    "namori": -2,
    "kani biimu": -2,
    "zoirun": -1,
    "rauto": 0,
    "ogipote": -1,
    "dino (dinoartforame)": 0,
    "ciloranko": 0,
    "ask (askzy)": 0,
    "sho (sho lwlw)": 0,
    "shnva": 0,
    "kawakami rokkaku": -1,
    "as109": -3,
    "pumpkinspicelatte": -2,
    "asakuraf": -2,
    "ddal": 0,
    "wlop": -1,
    "loundraw": 0,
    "yakihebi": 0,
    "kikurage (crayon arts)": 0,
    "henreader": 0,
    "kurotsuki (luowei99)": 0,
    "bubukka": -1,
    "blvefo9": 0,
    "fukutchi": 0,
    "mochirong": 0,
    "egami": 0,
    "yuuhagi (amaretto-no-natsu)": -3,
    "eip (pepai)": -2,
    "fuzichoco": -2,
    "muji (uimss)": -1,
    "tsukiyo (skymint)": -1,
    "maccha (mochancc)": -2,
    "healthyman": -1,
    "ruriri": -1,
    "matokechi": 0,
    "anmi": -2,
    "zygocactus": -1,
    "yamamoto souichirou": -2,
    "yazawa oke": 0,
    "sazaki ichiri": -2,
    "mutou mato": -1,
    "kantoku": -2,
    "blade (galaxist)": -4,
    "rasusurasu": 0,
    "klaius": -1,
    "sawayaka samehada": 0,
    "mamyouda": 0,
    "kanzaki hiro": -2,
    "ichimi renge": 0,
    "sincos": -4,
    "yuuki tatsuya": -1,
    "reoen": 0,
    "yone kinji": -2,
    "matsunaga kouyou": -2,
    "sekiya asami": -1,
    "sumiyao (amam)": -4,
    "mignon": -2,
    "hiten": -2,
    "kawacy": -2,
    "kanpa (campagne 9)": -1,
    "rosuuri": -2,
    "ojay tkym": -3,
    "suzumori uina": 0,
    "koutaro": -1,
    "weri": -1,
    "komone ushio": -1,
    "miyasaka miyu": -1,
    "shiratama (shiratamaco)": -2,
    "mimelond": 0,
    "aak": 0,
    "ayamy": -1,
    "shouu-kun": 0,
    "tenjou ryuka": -1,
    "yuizaki kazuya": -2,
    "hiroki (yyqw7151)": -4,
    "musouzuki": -2,
    "mvv": -2,
    "aos": -1,
    "momoko (momopoco)": -2,
    "tatami to hinoki": 0,
    "shirabi": -2,
    "crumbles": -3,
    "matanukinuki": 0,
    "kuroshiro00": 0,
    "bartolomeobari": -1,
    "kaede (sayappa)": -2,
    "garouma": -2,
    "kairunoburogu": -2,
    "lpip": -2,
    "zuima": 1,
    "nagishiro mito": -2,
    "mikaze oto": 0,
    "komachi pochi": 0,
    "rucaco": -1,
    "kokone (coconeeeco)": -3,
    "momozu komamochi": -2,
    "tyakomes": 0,
    "liuliu": 1,
    "kinutani yutaka": 1,
    "roku 6": -1,
    "lm7 (op-center)": -1,
    "bilibili xiaolu": -1,
    "shiro9jira": -2,
    "done (donezumi)": -1,
    "liclac": -2,
    "hosizora mikoto": -2,
    "hizuki yayoi": -2,
    "hoshiibara mato": 0,
    "nyxerebos": -2,
    "kimishima ao": -1,
    "tenmu shinryuusai": -1,
    "asuka (louyun)": 0,
    "tantan men (dragon)": -2,
    "chon (chon33v)": -2,
    "usashiro mani": -3,
    "mesushio": -2,
    "baram": -1,
    "makuran": -2,
    "karory": -2,
    "riri (ri0177)": 0,
    "yuni 0205": 0,
    "ibara riato": -2,
    "darkkanan": -1,
    "a20 (atsumaru)": -2,
    "siragagaga": -1,
    "heripiro": -1,
    "kazutake hazano": -2,
    "kyuukon (qkonsan)": -1,
    "yuno (suke yuno)": -1,
    "leilin": -1,
    "hoshi (snacherubi)": -1,
    "roin": -1,
    "shano-pirika": -1,
    "kushida you": -2,
    "aruka (alka p1)": -3,
    "yumenouchi chiharu": -2,
    "ao jun": -2,
    "ruten (onakasukusuku)": 0,
    "baku-p": -1,
    "mola mola": -1,
    "uekura eku": -1,
    "hisagi (puchimaple)": -1,
    "wind7626": 0,
    "hatoichi reno": -1,
    "nibiiro shizuka": -2,
    "sakura oriko": -4,
    "naga u": -1,
    "sencha (senta 10)": -1,
    "karunabaru": -1,
    "lack": -1,
    "barbarian tk": -2,
    "doribae": -1,
    "luke (b10a3123m)": -3,
    "kanzarin": -2,
    "optionaltypo": -2
}

const artists_normal = {
    "potg (piotegu)": -1,
    "xilmo": 0,
    "namori": -2,
    "kani biimu": -2,
    "zoirun": -1,
    "rauto": 0,
    "ogipote": -1,
    "dino (dinoartforame)": 0,
    "ciloranko": 0,
    "ask (askzy)": 0,
    "sho (sho lwlw)": 0,
    "shnva": 0,
    "kawakami rokkaku": -1,
    "ddal": 0,
    "wlop": -1,
    "loundraw": 0,
    "kikurage (crayon arts)": 0,
    "kurotsuki (luowei99)": 0,
    "fukutchi": 0,
    "yuuhagi (amaretto-no-natsu)": -3,
    "eip (pepai)": -2,
    "fuzichoco": -2,
    "muji (uimss)": -1,
    "tsukiyo (skymint)": -1,
    "maccha (mochancc)": -2,
    "matokechi": 0,
    "anmi": -2,
    "zygocactus": -1,
    "yamamoto souichirou": -2,
    "yazawa oke": 0,
    "sazaki ichiri": -2,
    "kantoku": -2,
    "blade (galaxist)": -4,
    "rasusurasu": 0,
    "klaius": -1,
    "sawayaka samehada": 0,
    "mamyouda": 0,
    "kanzaki hiro": -2,
    "ichimi renge": 0,
    "sincos": -4,
    "yuuki tatsuya": -1,
    "reoen": 0,
    "sekiya asami": -1,
    "mignon": -2,
    "hiten": -2,
    "kawacy": -2,
    "kanpa (campagne 9)": -1,
    "rosuuri": -2,
    "ojay tkym": -3,
    "suzumori uina": 0,
    "koutaro": -1,
    "weri": -1,
    "komone ushio": -1,
    "miyasaka miyu": -1,
    "shiratama (shiratamaco)": -2,
    "mimelond": 0,
    "aak": 0,
    "ayamy": -1,
    "shouu-kun": 0,
    "yuizaki kazuya": -2,
    "momoko (momopoco)": -2,
    "tatami to hinoki": 0,
    "shirabi": -2,
    "matanukinuki": 0,
    "bartolomeobari": -2,
    "kaede (sayappa)": -2,
    "garouma": -2,
    "kairunoburogu": -2,
    "lpip": -2,
    "zuima": 1,
    "nagishiro mito": -2,
    "mikaze oto": 0,
    "komachi pochi": 0,
    "rucaco": -1,
    "kokone (coconeeeco)": -3,
    "momozu komamochi": -2,
    "tyakomes": 0,
    "liuliu": 1,
    "kinutani yutaka": 1,
    "roku 6": -1,
    "lm7 (op-center)": -1,
    "bilibili xiaolu": -2,
    "shiro9jira": -2,
    "hizuki yayoi": -2,
    "hoshiibara mato": 0,
    "nyxerebos": -2,
    "kimishima ao": -1,
    "tenmu shinryuusai": -1,
    "asuka (louyun)": 0,
    "tantan men (dragon)": -2,
    "chon (chon33v)": -2,
    "mesushio": -2,
    "baram": -1,
    "karory": -2,
    "riri (ri0177)": 0,
    "yuni 0205": 0,
    "ibara riato": -2,
    "darkkanan": -1,
    "a20 (atsumaru)": -2,
    "siragagaga": -1,
    "heripiro": -1,
    "kazutake hazano": -2,
    "kyuukon (qkonsan)": -1,
    "yuno (suke yuno)": -1,
    "leilin": -1,
    "hoshi (snacherubi)": -1,
    "roin": -1,
    "shano-pirika": -1,
    "kushida you": -2,
    "aruka (alka p1)": -3,
    "yumenouchi chiharu": -2,
    "ao jun": -2,
    "ruten (onakasukusuku)": 0,
    "baku-p": -1,
    "mola mola": -1,
    "uekura eku": -1,
    "hisagi (puchimaple)": -1,
    "wind7626": 0,
    "hatoichi reno": -1,
    "nibiiro shizuka": -2,
    "sakura oriko": -4,
    "naga u": -1,
    "sencha (senta 10)": -1,
    "karunabaru": -1,
    "lack": -1,
    "doribae": -1,
    "kanzarin": -2
}


let generateButton = null;
let saveButton = null;
let promptTextArea = null;
let widthInput = null;
let heightInput = null;
let cfgInput = null;
let stepsInput = null;

let totalImages = -1;
let completedImages = 0;
let runButton = null;
let running = false;
let textArea = null;
let previousPlaceholder = "";

let abort = false;
let prevImgUrl = null;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function simulateInput(inputElement, newValue) {
    let lastValue = inputElement.value;
    inputElement.value = newValue;
    let event = new Event('input', { bubbles: true });
    event.simulated = true;
    let tracker = inputElement._valueTracker;
    if (tracker) {
        tracker.setValue(lastValue);
    }
    inputElement.dispatchEvent(event);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function createForm() {
    var styles = `
    .nadis-bg {
        position: absolute;
        width: 100%;
        height: 100vh;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        background: rgb(14, 15, 33, 0.7);
        cursor: pointer;
    }

    .nadis-container {
        padding: 30px;
        background: #13152c;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 20px;
        flex-direction: column;
        border-radius: 3px;
        cursor: auto;
    }

    .nadis-settings {
        display: flex;
        width: 800px;
        gap: 20px;
    }

    .nadis-settings input {
        border: 1px solid rgb(34, 37, 63);
    }

    .nadis-container textarea {
        width: 800px;
        height: 200px;
        background: rgb(14, 15, 33);
        border: 1px solid rgb(34, 37, 63);
        padding: 15px 20px;
        color: rgb(255, 255, 255);
        font-size: 1rem;
    }

    .nadis-container button {
        width: 800px;
        height: 50px;
        background: rgb(245, 243, 194);
        color: rgb(19, 21, 44);
        font-size: 0.875rem;
        font-weight: 700;
        border-radius: 3px;
        cursor: pointer;
    }

    .nadis-container button:disabled {
        opacity: 0.5;
        color: rgb(19, 21, 44);
    }
`

    var styleSheet = document.createElement("style");
    styleSheet.innerHTML = styles;
    document.head.appendChild(styleSheet);

    const background = document.createElement("div");
    background.classList.add("nadis-bg");
    background.style.display = "none";
    background.onmousedown = async () => {
        background.style.display = "none";
        await saveValues();
    }

    const container = document.createElement("div");
    container.classList.add("nadis-container");
    container.onmousedown = (e) => {
        e.stopPropagation();
    }

    const settingsDiv = document.createElement("div");
    settingsDiv.classList.add("nadis-settings");

    const minDurationInput = document.createElement("input");
    minDurationInput.placeholder = "minDuration";
    minDurationInput.type = "text";
    minDurationInput.value = await GM.getValue("minDuration", "");

    const maxDurationInput = document.createElement("input");
    maxDurationInput.placeholder = "maxDuration";
    maxDurationInput.type = "text";
    maxDurationInput.value = await GM.getValue("maxDuration", "");

    const minBreakInput = document.createElement("input");
    minBreakInput.placeholder = "minBreak";
    minBreakInput.type = "text";
    minBreakInput.value = await GM.getValue("minBreak", "");

    const maxBreakInput = document.createElement("input");
    maxBreakInput.placeholder = "maxBreak";
    maxBreakInput.type = "text";
    maxBreakInput.value = await GM.getValue("maxBreak", "");

    const probInput = document.createElement("input");
    probInput.placeholder = "prob";
    probInput.type = "text";
    probInput.value = await GM.getValue("prob", "");

    settingsDiv.appendChild(minDurationInput);
    settingsDiv.appendChild(maxDurationInput);
    settingsDiv.appendChild(probInput);
    settingsDiv.appendChild(minBreakInput);
    settingsDiv.appendChild(maxBreakInput);

    textArea = document.createElement("textarea");
    textArea.placeholder = "IMAGES|WxH|CFG|STEPS: PROMPT";
    // setPrompt to set prompt
    textArea.value = await GM.getValue("prompt", "");

    async function saveValues() {
        await GM.setValue("minDuration", minDurationInput.value);
        await GM.setValue("maxDuration", maxDurationInput.value);
        await GM.setValue("minBreak", minBreakInput.value);
        await GM.setValue("maxBreak", maxBreakInput.value);
        await GM.setValue("prob", probInput.value);
        await GM.setValue("prompt", textArea.value);
    }

    runButton = document.createElement("button");
    runButton.innerHTML = "Run Script";
    runButton.onclick = async (e) => {
        e.preventDefault();

        await saveValues();
        const scriptLines = textArea.value.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);

        const scriptArgs = [];
        const scriptFuncs = [];

        scriptLines.forEach((line, i) => {
            let index = line.indexOf(": ");

            let count, width, height, cfg, steps;
            count = width = height = cfg = steps = -1;

            let generatePrompt = "";
            let placeholder = "";
            let repeatCount = 1;

            if (index >= 0) {
                generatePrompt = line.substring(index + 1).trim();
                line = line.substring(0, index)
            }

            const settings = line.trim().split("|");

            if (settings.length === 4) {
                steps = parseInt(settings.pop());
                if (!Number.isInteger(steps)) steps = -1;
            }
            if (settings.length === 3) {
                cfg = parseFloat(settings.pop());
                if (isNaN(cfg)) cfg = -1;
            }
            if (settings.length === 2) {
                [width, height] = settings.pop().split("x").map(x => parseInt(x));
                if (!Number.isInteger(width)) width = -1;
                if (!Number.isInteger(height)) height = -1;
            }
            if (settings.length === 1) {
                if (settings[0].startsWith("setPrompt")) {
                    scriptArgs.push([generatePrompt]);
                    scriptFuncs.push(setPrompt);
                    return;
                }
                if (settings[0].startsWith("setDimensions")) {
                    // generatePrompt is the dimensions here
                    scriptArgs.push(generatePrompt.split("x").map(x => parseInt(x)));
                    scriptFuncs.push(setDimensions);
                    return;
                }
                if (settings[0].startsWith("setCFG")) {
                    scriptArgs.push([parseFloat(generatePrompt)]);
                    scriptFuncs.push(setCFG);
                    return;
                }
                if (settings[0].startsWith("setSteps")) {
                    scriptArgs.push([parseInt(generatePrompt)]);
                    scriptFuncs.push(setSteps);
                    return;
                }
                if (settings[0].endsWith("p")) {
                    settings[0] = settings[0].substring(0, settings[0].length - 1);
                    placeholder = generatePrompt.length === 0 ? "↑" : generatePrompt;
                    generatePrompt = promptTextArea.value;
                }

                if (settings[0].endsWith("r")) {
                    settings[0] = settings[0].substring(0, settings[0].length - 1);
                    repeatCount = Number(settings.pop());
                    count = 1;
                } else {
                    count = Number(settings.pop());
                }
            }

            if (!Number.isInteger(count)) {
                count = 1;
                generatePrompt = line.trim();
            }

            const sleepSettings = [parseInt(minDurationInput.value), parseInt(maxDurationInput.value), parseInt(minBreakInput.value), parseInt(maxBreakInput.value), parseFloat(probInput.value)];

            for (let j = 0; j < repeatCount; j++) {
                scriptArgs.push([i === scriptLines.length - 1, sleepSettings, count, width, height, cfg, steps, generatePrompt, placeholder, true]);
                scriptFuncs.push(runScript);
            }
        });

        totalImages = scriptArgs.reduce((sum, args, i) => scriptFuncs[i] == runScript ? sum + args[2] : sum, 0);

        runButton.innerHTML = `Running... (0/${totalImages === -1 ? "∞" : totalImages})`;

        running = true;
        runButton.disabled = true;

        for (let i = 0; i < scriptArgs.length; i++) {
            await scriptFuncs[i](...scriptArgs[i]);
            if (scriptFuncs[i] != runScript) {
                while (generateButton.disabled) {
                    await sleep(100);
                }
            }
            if (abort) break;
        }

        completedImages = 0;
        totalImages = -1;

        previousPlaceholder = "";

        runButton.innerHTML = "Run Script";
        runButton.disabled = false;
        running = false;
        abort = false;
    }

    container.appendChild(settingsDiv);
    container.appendChild(textArea);
    container.appendChild(runButton);
    background.appendChild(container);
    document.body.appendChild(background);
}

function toggleForm() {
    const nadisBG = document.querySelector("div.nadis-bg");
    if (nadisBG.style.display.length > 0) {
        nadisBG.style.display = "";
        textArea.focus();
    } else {
        nadisBG.style.display = "none";
    }
}

async function setPrompt(generatePrompt) {
    if (generatePrompt.length > 0) {
        simulateInput(promptTextArea, generatePrompt);
        await sleep(300);
    }
}

async function setDimensions(width, height) {
    if (width > 0) {
        simulateInput(widthInput, Math.floor(width / 64) * 64);
        await sleep(300);
    }

    if (height > 0) {
        simulateInput(heightInput, Math.floor(height / 64) * 64);
        await sleep(300);
    }
}

async function setCFG(cfg) {
    if (cfg > 0) {
        cfgInput.focus();
        simulateInput(cfgInput, cfg);
        cfgInput.blur();
        await sleep(300);
    }
}

async function setSteps(steps) {
    if (steps > 0) {
        stepsInput.focus();
        simulateInput(stepsInput, steps);
        stepsInput.blur();
        await sleep(300);
    }
}

function generateRandomArtists(count = 3, ecchi = false, short = false) {
    const artists = ecchi ? artists_ecchi : artists_normal;
    const artistNames = Object.keys(artists);
    let selectedArtists = [];
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * artistNames.length);
        const artist = artistNames[index];
        artistNames.splice(index, 1);

        const artistWeight = artists[artist];
        let max = 4;
        if (artistWeight < 0) {
            max += (artistWeight / 2)
        }
        const randomWeight = getRandomInt(0, max);
        const weight = artistWeight + randomWeight;
        selectedArtists.push(`${(weight >= 0 ? "{" : "[").repeat(Math.abs(weight))}${short ? "" : "artist:"}${artist}${(weight >= 0 ? "}" : "]").repeat(Math.abs(weight))}`);
    }
    return selectedArtists.join(", ");
}

async function runScript(isLast, sleepSettings, count, width = -1, height = -1, cfg = -1, steps = -1, generatePrompt = "", placeholder = "", retry = false) {
    if (generateButton.disabled) return;
    if (generatePrompt.length === 0) {
        generatePrompt = promptTextArea.value;
    }
    let originalPrompt = generatePrompt;

    let randomArtists = Array.from(originalPrompt.matchAll(/(?<keyword>R[E]?|RANDOM[E]?)(?<number>[0-9]+)/g)).map(match => {return {match: match[0], number: match.groups.number, keyword: match.groups.keyword}})
    // let randomArtists = originalPrompt.match(/RANDOM[E]?[0-9]+/g) ?? [];

    let artistMixes = originalPrompt.match(/MX[0-9]+/g);

    if (placeholder.length > 0) {
        if (placeholder == "↑") {
            placeholder = previousPlaceholder;
        }
        generatePrompt = originalPrompt.replace("PLACEHOLDER", placeholder);
    }

    if (randomArtists.length > 0) {
        randomArtists.forEach(({match, number, keyword}) => {
            let artistCount = parseInt(number);
            generatePrompt = generatePrompt.replace(match, generateRandomArtists(artistCount, match.includes("E"), keyword.length < 3));
        });
    }

    if (artistMixes != null) {
        artistMixes.forEach(artistMix => {
            if (artistMix in MXD) {
                generatePrompt = generatePrompt.replace(artistMix, MXD[artistMix]);
            }
        })
    }

    await setPrompt(generatePrompt);

    await setDimensions(width, height);

    await setCFG(cfg);

    await setSteps(steps);

    await sleep(500);

    while (generateButton.disabled) {
        await sleep(300);
    }

    await run(...sleepSettings, count, isLast, retry);

    if ((placeholder.length > 0 && originalPrompt.includes("PLACEHOLDER")) || randomArtists.length > 0 || artistMixes != null) {
        await setPrompt(originalPrompt);
    }
    previousPlaceholder = placeholder;

    //console.log("Finished")
}

async function saveImage() {
    // nai auto save
    return true;

    await sleep(getRandomInt(500, 1000));
    const newImage = document.querySelector("div.sc-5db1afd3-28");
    const newImageUrl = window.getComputedStyle(newImage).getPropertyValue("background-image");
    if (newImageUrl === prevImgUrl) {
        return false;
    }
    prevImgUrl = newImageUrl;
    newImage.click();
    await sleep(100);
    saveButton = document.querySelector("div.hpVEuL").parentElement;
    saveButton.click();
    return true;
}

async function firstRun() {
    //console.log("firstRun start");
    if (generateButton.disabled){
        return;
    }
    generateButton.click();
    await sleep(2000);

    while (generateButton.disabled) {
        await sleep(500);
    }

    // await saveImage();

    runButton.innerHTML = `Running... (${++completedImages}/${totalImages === -1 ? "∞" : totalImages})`;

    const interval = 33.3;
    const intervalId = setInterval(updateProgress, interval, 1000, interval)
    await sleep(1000);
    clearInterval(intervalId);
    progress = 0
    generateButton.style.background = "";
    //console.log("firstRun finish");
}

let progress = 0;

function updateProgress(total, interval) {
    progress += interval;
    if (progress > total) return;
    const percent = (progress / total) * 100;
    generateButton.style.background = `linear-gradient(90deg, rgba(245, 243, 194, 1) ${percent}%, rgba(245, 243, 194, 0.5) ${percent}%)`;
}

async function run(minDuration, maxDuration, minBreak, maxBreak, prob, count = -1, isLast = false, retry = false) {
    //console.log("run start");
    let runs = 0
    while (true) {
        if (count >= 0 && runs >= count) break;

        //console.log("start");
        if (abort) {
            return;
        }

        if (generateButton.disabled){
            return;
        }

        generateButton.click();
        //console.log("click");

        await sleep(2000);
        while (generateButton.disabled) {
            await sleep(500);
        }


        if (abort) {
            // saveButton.click();
            return;
        }

        //console.log("finished generate");

        const successful = await saveImage();
        //console.log("save");

        if (successful || !retry) {
            runButton.innerHTML = `Running... (${++completedImages}/${totalImages === -1 ? "∞" : totalImages})`;
            runs++;
        }


        if (isLast && count >= 0 && runs >= count) break;

        let sleepDuration;
        if (Math.random() < prob) {
            sleepDuration = getRandomInt(minBreak, maxBreak);
        } else {
            sleepDuration = getRandomInt(minDuration, maxDuration);
        }
        const interval = 33.3;
        const intervalId = setInterval(updateProgress, interval, sleepDuration, interval)
        await sleep(sleepDuration);
        clearInterval(intervalId);
        progress = 0
        generateButton.style.background = "";
        //console.log("end");
    }
    //console.log("run finish");
}

(async function() {
    'use strict';

    while (generateButton === null) {
        generateButton ??= document.querySelector("button.dnBVDh");
        promptTextArea ??= document.querySelector("textarea.sc-a2d0901c-45.kyIdtk");
        saveButton ??= document.querySelector("div.hpVEuL")?.parentElement;

        const dimensionInputs = document.querySelectorAll("input.sc-a2d0901c-43.cuolnK");
        widthInput ??= dimensionInputs[0];
        heightInput ??= dimensionInputs[1];

        const cfgSteps = document.querySelectorAll("div.sc-c87c6dcc-9.fUNIFR");
        stepsInput ??= cfgSteps[0]?.querySelector(":scope input");
        cfgInput ??= cfgSteps[1]?.querySelector(":scope input");

        await sleep(500);
    }

    await createForm();

    document.onkeydown = async (e) => {
        if (e.key === "Escape") {
            // throw new Error("Stopped JavaScript.");
            if (!running) return;
            abort = true;
            runButton.innerHTML = "Aborting...";
        }

        if (e.key === "s" && e.altKey && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();
            toggleForm();
        }

        if (e.key === "S" && e.altKey && e.ctrlKey) {
            running = true;
            runButton.disabled = true;
            runButton.innerHTML = `Running... (0/∞)`;

            await runScript(true, [1000, 1500, 1500, 3000, 0.1], -1);

            completedImages = 0;
            runButton.innerHTML = "Run Script";
            runButton.disabled = false;
            running = false;
            abort = false;
        }

        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            e.stopPropagation();

            runButton.disabled = true;
            runButton.innerHTML = `Running... (0/1)`;

            await runScript(true, [0, 0, 0, 0, 0], 1);

            completedImages = 0;
            runButton.innerHTML = "Run Script";
            runButton.disabled = false;
            abort = false;
        }
    }

    textArea.onkeydown = async (e) => {
        if (e.key === "Enter" && e.ctrlKey) {
            e.preventDefault();
            e.stopImmediatePropagation();

            runButton.click();
        }
    }

    promptTextArea.onkeydown = async (e) => {
        if (e.key === "Enter") {
            // allpw for selecting tags by pressing Enter
            if (document.querySelector("div.sc-a2d0901c-10.dompKh") !== null) return;

            e.preventDefault();
            e.stopImmediatePropagation();

            runButton.disabled = true;
            runButton.innerHTML = `Running... (0/1)`;

            await runScript(true, [0, 0, 0, 0, 0], 1);

            completedImages = 0;
            runButton.innerHTML = "Run Script";
            runButton.disabled = false;
            abort = false;
        }
    };

    let mouseClicked = false;

    generateButton.onmousedown = () => {
        mouseClicked = true;
    }

    document.onmouseup = (e) => {
        mouseClicked = false;
    }

    generateButton.onmouseup = async (e) => {
        if (!mouseClicked) return;
        if (running) return;

        runButton.disabled = true;
        runButton.innerHTML = `Running... (0/1)`;

        await sleep(2000);

        while (generateButton.disabled) {
            await sleep(500);
        }

        await saveImage();

        completedImages = 0;
        runButton.innerHTML = "Run Script";
        runButton.disabled = false;
        abort = false;
    }
})();