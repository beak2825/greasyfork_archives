// ==UserScript==
// @name         PMT QoL Package
// @namespace    https://ejaz.is-a.dev/scripts
// @version      1.4
// @description  A bunch of tools to enhance your experience on the PMT website.
// @author       Ejaz Ali
// @match        https://www.physicsandmathstutor.com/*
// @match        https://pmt.physicsandmathstutor.com/*
// @match        https://www.physicsandmathstutor.com/pdf-pages/*
// @match        https://pmt.physicsandmathstutor.com/pdf-pages/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=physicsandmathstutor.com
// @license      GPL3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470907/PMT%20QoL%20Package.user.js
// @updateURL https://update.greasyfork.org/scripts/470907/PMT%20QoL%20Package.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const tts = Date.now();

    const verInformation = {
        ver: "1.4",
        description: ["Introducing PDF Cascade: an alternative PDF viewer cloak that allows you to swap between questions, answers and exam booklets from the same tab.", "PMT is actively blocking PMT QoL, so this patch helps circumvent some of those."]
    }

    const baseSettings = {
        ad_blocking: true, // Attempts to patch ads from the DOM level, not the network level.
        native_ad_blocking: true, // Blocks native advertisements

        pdf_bypass: true, // Bypasses
        pdf_newTab: false, // Launches PDFs in New Tabs
        pdf_cloak: false, // Cloaks the PDF viewer rather than attempts to bypass, better for high-latency connections that can't handle redirects that much.

        pinned_topics: true, // Allows topics and PDFs to be pinned

        cascade: false, // PDF Cascade allows for an alternative PDF cloak experience.

        // EXPERIMENTS
        pdf_link_inject: false // EXPERIMENT: Injects PDF bypass into links as well on the PMT website
    }

    const baseStats = {
        adsBlocked: 0,
        nativeAdsBlocked: 0,
        pdfBypassed: 0,
    }

    var settings = baseSettings

    const loclst = window.localStorage;
    const propSettings = loclst.getItem("PMTQoL_settings");

    if (propSettings == null || propSettings == undefined) {
        loclst.setItem("PMTQoL_settings", btoa(JSON.stringify(settings)))
    } else {
        settings = JSON.parse(atob(propSettings));
        Object.keys(baseSettings).forEach((item) => {
            if (!Object.keys(settings).includes(item)) {
                settings[item] = baseSettings[item];
                console.log("PMT QoL: New settings have been discovered, adding them to the registry.")
            }
        })
        loclst.setItem("PMTQoL_settings", btoa(JSON.stringify(settings)))
    }



    var statistics = baseStats;
    const propStatistics = loclst.getItem("PMTQoL_statistics");

    if (propStatistics == null || propStatistics == undefined) {
        loclst.setItem("PMTQoL_statistics", btoa(JSON.stringify(statistics)));
    } else {
        statistics = JSON.parse(atob(propStatistics))
    }

    // We want to bypass as fast as possible
    function pdfBypassSpeed() {
        try {
            if (window.location.pathname.includes("pdf-pages")) {
                if (settings.pdf_bypass) {
                    const pdf = new URL(window.location).searchParams.get("pdf");
                    const pdfDecoded = decodeURIComponent(pdf);
                    incrementStat("pdf-bypass")

                    console.log(`Bypassed  ${Date.now() - tts}ms after`)
                    if (settings.pdf_newTab) {
                        window.open(pdfDecoded, "_BLANK");
                        history.back()
                    } else {
                        window.location.replace(pdfDecoded)
                    }
                }
            }
        } catch(err) {}
    }

    pdfBypassSpeed();

    function pageTypeWorkflow(URL) {
        if (window.location.pathname == "/") {
            indexPage();
        }
        if (!window.location.pathname.includes("pdf-pages")) {
            mainPages();
        } else {
            pdfPages();
        }

        if (window.location.pathname == "/ejaz/qol-settings") {
            settingsPage();
        }

        if (window.location.pathname == "/ejaz/qol-pinned") {
            pinsPage();
        }
    }

    function pinsPage() {
        document.title = "PMT QoL Pins";
        var losa = window.localStorage;
        var pins = losa.getItem("PMTQoL_pins");

        if (pins == undefined || pins == null) {
                pins = [];
                losa.setItem("PMTQoL_pins", btoa(JSON.stringify(pins)))
        } else {
            try {
            pins = JSON.parse(atob(pins))
            } catch(err) {
                alert("There is a problem with your pins.")
                pins = [];
            }
        }

        if (pins.length == 0) {
            document.getElementById("content-full").innerHTML = `You have no pins 😭<br>Click the pin button above a topic and it will show here.`
        } else {
            document.getElementById("content-full").innerHTML = `<h2>Pins</h2>`;

            pins.forEach((item) => {
                const pin = document.createElement("a");
                pin.innerText = item.title;
                pin.href = item.complete;
                const br = document.createElement("br")

                document.getElementById("content-full").appendChild(pin)
                document.getElementById("content-full").appendChild(br)
            })
        }
    }

    function settingsPage() {
        document.title = "PMT QoL Settings"
        document.getElementById("content-full").innerHTML = `
        <div>
            <h2>PMT QoL Settings</h2>
            <p>PMT QoL is a user-script extension that is currently running to enhance your experience on the PMT website.</p>
            <p>If you do not remember installing it, you should <a href="https://www.wikihow.com/Delete-a-Script-in-Tampermonkey">remove it</a>.</p>
            <div>
                <h3>Advertisements</h3>
                <input type="checkbox" id="ad_blocking" name="ad_blocking" ${settings.ad_blocking ? "checked" : ""}>
                <label for="ad_blocking">Hide Advertisements</label>
                <p style="margin-top: 0;">Adverts are hidden on the DOM level. This means requests to ads are still being made, but they aren't shown to the user.<br>
                While this works well, you should consider using an adblock extension like <a href="https://ublockorigin.com/">uBlock Origin</a>, which is a lightweight content blocker.</p>

                <input type="checkbox" id="native_ad_blocking" name="native_ad_blocking" ${settings.native_ad_blocking ? "checked" : ""}>
                <label for="native_ad_blocking">Native Advertisement Blocking</label>
                <p style="margin-top: 0;">Native advertisments are made by PMT internally to promote other PMT services. Bear in mind, this feature is very experimental and doesn't catch everything.</p>

                <h3>PDF Viewer</h3>
                <p style="margin-top: 0;">PMT uses a custom PDF viewer that is shown to the user instead of the system's default PDF viewer.<br>
                This means that PMT is injecting adverts and modifying the appearance of the PDF viewer as they please.</p>

                <input type="checkbox" id="pdf_bypass" name="pdf_bypass" ${settings.pdf_bypass ? "checked" : ""}>
                <label for="pdf_bypass">Bypass Custom PDF Viewer</label>
                <p style="margin-top: 0;">If this is enabled, all your other PDF settings will not work.<br>
                In this mode, PMT's custom PDF viewer is completely bypassed and you will be redirect to the system PDF viewer.<br>
                This is the experience that most other sites give you.</p>

                <input type="checkbox" id="pdf_newTab" name="pdf_newTab" ${settings.pdf_newTab ? "checked" : ""}>
                <label for="pdf_newTab">Launch PDFs in New Tabs</label>
                <p style="margin-top: 0;">This works after the PDF has been launched.<br>
                The current page will go back and a new tab will open with the PDF.<br>
                This works even when bypassing.</p>

                <input type="checkbox" id="pdf_cloak" name="pdf_cloak" ${settings.pdf_cloak ? "checked" : ""}>
                <label for="pdf_cloak">Cloak Custom PDF Viewer</label>
                <p style="margin-top: 0;">This is for people who have internet connections with high latency and cannot use PDF Bypass.<br>
                Requires <b>Bypass Custom PDF Viewer</b> to be OFF.<br>
                In this mode, the custom PDF viewer will be injected to look like the system PDF viewer.<br>
                It may be very restrictive.</p>

                <input type="checkbox" id="cascade" name="cascade" ${settings.cascade ? "checked" : ""}>
                <label for="cascade">PDF Cascade</label>
                <p style="margin-top: 0;">A more modern PDF viewer with fast switching between papers, answers and booklets.<br>
                Requires <b>Bypass Custom PDF Viewer</b> to be OFF.<br>
                Requires <b>Cloak Custom PDF Viewer</b> to be ON.<br>
                This is a new experience and more features are being added to it, leave feedback on Greasyfork.</p>

                <h3>Enhancements</h3>
                <p style="margin-top: 0;">Features that just makes things easier.</p>

                <input type="checkbox" id="pinned_topics" name="pinned_topics" ${settings.pinned_topics ? "checked" : ""}>
                <label for="pinned_topics">Allow pinning topics to quickly access them later</label>
                <p style="margin-top: 0;">When this setting is ON, a new section in the header will display and show all of your Pinned Topics<br>
                To pin a topic, click the link that is shown next to the title of a topic.</p>

                <a href="#unfinished-features" id="unfinished-trigger">Unfinished features and development</a>

                <div id="unfinished-features">
                    <input type="checkbox" id="pdf_link_inject" name="pdf_link_inject" ${settings.pdf_link_inject ? "checked" : ""}>
                    <label for="pdf_link_inject">Bypass PDFs by injecting their links as well</label>
                    <p style="margin-top: 0;">Requires <b>Bypass Custom PDF Viewer</b> to be ON.<br>This is an experimental fix for an issue that is caused when opening a PDF page that isn't focused.</p>
                </div>

                <style>
                    #unfinished-features {
                        display: none;
                    }
                    #unfinished-features:target {
                        display: block;
                    }
                </style>
            </div>
        </div>
        `;
        Object.keys(settings).forEach((item) => {
            console.log(item)
            document.getElementById(item).addEventListener("change", (e) => {
                const value = document.getElementById(item).checked;
                settings[item] = value;

                const ls = window.localStorage;
                ls.setItem("PMTQoL_settings", btoa(JSON.stringify(settings)));
            })
        })
    }

    function pdfPages() {
        const pdf = new URL(window.location).searchParams.get("pdf");
        const pdfDecoded = decodeURIComponent(pdf);

        if (!settings.pdf_bypass) {
            if (settings.pdf_newTab) {
                const Nt = new URL(window.location).searchParams.get("QoLNt");
                if (Nt != "true") {
                    incrementStat("pdf-bypass")
                    window.open(window.location.href + "&QoLNt=true", "_blank")
                    history.back()
                }
            }
        } else {
            console.log("The page should not be in this state as it was expected to bypass ages ago. Retrying that.")
            let attemptNo = 1;
            setTimeout(() => {
                console.log(`Attempt number ${attemptNo}`)
                pdfBypassSpeed();
                attemptNo++

                if (attemptNo > 2) {
                    console.error("PMT QoL: This page was supposed to bypass a very long time ago, but it did not reflect that. PMT may have introduced circumvention which hasn't been fixed in this release, please update to the latest version and then report this issue to the PMT QoL developer.")
                }
            }, 1000);
        }

        if (settings.ad_blocking) {
            adBlocking()
            setInterval(() => {
                adBlocking()
            }, 100)
        }

        if (settings.pdf_cloak) {
            if (settings.cascade) {
                console.log("==== PDF Cascade ====")
                console.log("You're using a new experience of PMT QoL, let me know what you think!");

                document.body.innerHTML = "";

                function createNewCascadeWS() {
                    const cascadeElem = document.createElement("div")
                    cascadeElem.classList.add("cascadeSpace");

                    const cascadeSidebar = document.createElement("div");
                    cascadeSidebar.classList.add("cascadeSidebar");

                    const cascadeTitle = document.createElement("h3");
                    cascadeTitle.innerText = "Cascade";
                    cascadeSidebar.append(cascadeTitle);


                    const cascadeList = document.createElement("div");
                    cascadeList.classList.add("cascadeList");
                    cascadeList.id = "cascadeList";
                    cascadeSidebar.append(cascadeList);

                    const cascadeFinding = document.createElement("p");
                    cascadeFinding.id = "cascadeFinding";
                    cascadeFinding.innerText = "Identifying other documents to cascade..."
                    cascadeFinding.style.display = "none";
                    cascadeSidebar.append(cascadeFinding);


                    cascadeElem.append(cascadeSidebar);


                    const cascadeWorkspaces = document.createElement("div");
                    cascadeWorkspaces.classList.add("cascadeWorkspaces");
                    cascadeWorkspaces.id = "cascadeWorkspaces";
                    cascadeElem.append(cascadeWorkspaces);


                    const cascadeStyle = document.createElement("style");
                    cascadeStyle.innerText = `
                    h1, h2, h3, h4, h5, h6, p {
                        margin: 0;
                    }

                    .cascadeSpace {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        height: 100vh;
                    }

                    .cascadeSidebar {
                        width: 400px;
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        padding: 32px;
                        gap: 16px;
                        box-sizing: border-box;
                    }

                    .cascadeList {
                        width: 100%;
                        display: flex;
                        gap: 8px;
                        flex-direction: column;
                    }

                    .cascadeList button {
                        text-align: left;
                        font-size: 16px;
                        appearance: none;
                        border: 0;
                        padding: 12px;
                        border-radius: 12px;
                        background-color: transparent;
                        animation: flyUp 1s cubic-bezier(.04,.68,.04,.97);
                    }

                    @keyframes flyUp {
                        0% {
                            transform: translateY(40px);
                            opacity: 0;
                        }
                        100% {
                            transform: translateY(0px);
                            opacity: 1;
                        }
                    }

                    .cascadeList button:hover {
                        background-color: rgba(0,0,0,0.1);
                    }

                    .cascadeList button:active {
                        background-color: rgba(0,0,0,0.2);
                    }

                    .cascadeList .selected {
                        background-color: rgba(0,0,0,0.1);
                    }

                    .cascadeWorkspaces {
                        width: 100%;
                        height: 100%;
                    }

                    .workspace {
                        padding: 16px;
                        width: 100%;
                        height: 100%;
                        box-sizing: border-box;
                        display: none;
                    }

                    .selectedWorkspace {
                        display: block;
                        animation: flyUp 1s cubic-bezier(.04,.68,.04,.97);
                    }

                    .workspaceFrameOuter {
                        width: 100%;
                        height: 100%;
                        border-radius: 8px;
                        overflow: hidden;
                        border: solid 1px;
                    }

                    .workspace iframe {
                        width: 100%;
                        height: 100%;
                    }
                    `



                    document.body.append(cascadeElem);
                    document.body.append(cascadeStyle);
                }

                let workspaceID = []


                function selectWorkspace(id, location) {
                    const selectedItems = document.getElementsByClassName("selected");
                    for (const elem of selectedItems) {
                        elem.classList.remove("selected");
                    }

                    document.getElementById(`${id}-btn`).classList.add("selected");

                    let workspace = document.getElementById(`${id}-ws`);

                    if (!document.body.contains(workspace)) {
                        console.log("Workspace " + id + " does not exist.")

                        const wsContainer = document.createElement("div");
                        wsContainer.id = `${id}-ws`
                        wsContainer.classList.add("workspace");
                        const wsFrameOuter = document.createElement("div");
                        wsFrameOuter.classList.add("workspaceFrameOuter")
                        const wsFrame = document.createElement("iframe");

                        wsFrame.src = location;

                        wsFrameOuter.append(wsFrame)
                        wsContainer.append(wsFrameOuter);

                        document.getElementById("cascadeWorkspaces").append(wsContainer);

                        workspace = document.getElementById(`${id}-ws`);
                    }

                    const selectedWorkspace = document.getElementsByClassName("selectedWorkspace");

                    for (const elem of selectedWorkspace) {
                        elem.classList.remove("selectedWorkspace");
                    }

                    workspace.classList.add("selectedWorkspace");
                }

                function addDocumentToWorkspace(url, name = "Unidentified document") {
                    const sidebarList = document.getElementById("cascadeList");

                    const randomID = btoa(Math.random());
                    workspaceID.push(randomID);

                    const button = document.createElement("button");

                    button.addEventListener("click", () => selectWorkspace(randomID, url))
                    button.id = `${randomID}-btn`
                    button.innerText = name;

                    sidebarList.append(button);
                }

                function identifyOtherPages(url) {
                    document.getElementById("cascadeFinding").style.display = "block";

                    let currentDocumentState = "QP";
                    let entries = [];
                    if (url.includes("QP")) {
                        currentDocumentState = "QP"
                    }

                    if (url.includes("MS")) {
                        currentDocumentState = "MS"
                    }

                    if (currentDocumentState == "QP") {
                        entries.push({ url: url.replaceAll("QP","MS"), name: "Mark Scheme" });
                    }

                    if (currentDocumentState == "MS") {
                        entries.push({ url: url.replaceAll("MS","QP"), name: "Original Document" });
                    }


                    async function testEntries(entries) {
                        for (const entry of entries) {
                            if (entry.url == url) continue;

                            const add = await new Promise((res) => fetch(entry.url).then((rs) => res(rs.ok ? true : false)));
                            if (add) {
                                addDocumentToWorkspace(entry.url, entry.name)
                            }
                        }

                        document.getElementById("cascadeFinding").style.display = "none";
                    }

                    testEntries(entries);
                }



                createNewCascadeWS();
                addDocumentToWorkspace(pdfDecoded, pdfDecoded.includes("MS") ? "Mark Scheme" : "Original Document");
                //addDocumentToWorkspace("https://www.physicsandmathstutor.com/", "Physics and Maths Tutor");

                console.log(pdfDecoded);
                selectWorkspace(workspaceID[0], pdfDecoded);
                identifyOtherPages(pdfDecoded);

                return;
            }
        }

        if (settings.pdf_cloak) {
            console.log("Cloaking PDF");
            const pdfContent = document.getElementsByClassName("iframe-wrapper")[0];
            const style = document.createElement("style");
            style.innerHTML = `.iframe-wrapper iframe { width: 100vw; height: 100vh; top: 50%; left: 50%; transform: translate(-50%, -50%); position: fixed; }`;
            document.body.appendChild(style);
            console.log("Pass 1");
            const ifr = pdfContent.firstElementChild;
            ifr.setAttribute("style", "width: 100vw; height: 100vh; top: 50%; left: 50%; transform: translate(-50%, -50%); position: fixed;")
            console.log("Pass 2");

            const sidebar = document.getElementsByClassName("pdf-sidebar")[0];
            sidebar.remove();
        }
    }

    function mainPages() {
        const header = document.getElementsByClassName("ubermenu-nav")[0];
        //<li id="menu-item-42954" class="ubermenu-item ubermenu-item-type-post_type ubermenu-item-object-page ubermenu-item-42954 ubermenu-item-level-0 ubermenu-column ubermenu-column-auto">
        //	<a class="ubermenu-target ubermenu-item-layout-default ubermenu-item-layout-text_only" href="https://www.physicsandmathstutor.com/contact/" tabindex="0">
        //		<span class="ubermenu-target-title ubermenu-target-text">Contact</span>
        //	</a>
        //</li>
        if (settings.ad_blocking) {
            adBlocking()
            setInterval(() => {
                adBlocking()
            }, 100)
        }

        const settingButtonLink = document.createElement("li");
        settingButtonLink.className = "ubermenu-item ubermenu-item-type-post_type ubermenu-item-object-page ubermenu-item-level-0 ubermenu-column ubermenu-column-auto";

        const settingButtonA = document.createElement("a");
        settingButtonA.innerText = "QoL Settings"
        settingButtonA.className = "ubermenu-target ubermenu-item-layout-default ubermenu-item-layout-text_only"
        settingButtonA.href = "/ejaz/qol-settings"

        settingButtonLink.appendChild(settingButtonA)

        header.appendChild(settingButtonLink)

        if (settings.pdf_bypass) {
            if (settings.pdf_link_inject) {
                console.log("Injecting links...");

                const links = document.getElementsByTagName("a");

                for (const link of links) {
                    try {
                        const href = new URL(link.href);
                        if (href.pathname == "/pdf-pages/") {
                            const encodedPdf = href.searchParams.get("pdf");
                            const decodedPdf = decodeURIComponent(encodedPdf);
                            link.href = new URL(decodedPdf);
                        }
                    } catch(e) {
                        console.error(`ERROR: ${e}`)
                    }
                }
            }
        }

        if (settings.native_ad_blocking) {
            document.getElementById("menu-item-44285").remove();
            nativeAdBlocking();
            setInterval(() => {
                nativeAdBlocking()
            }, 100)
        }

        if (settings.pinned_topics) {
            const pinButtonLink = document.createElement("li");
            pinButtonLink.className = "ubermenu-item ubermenu-item-type-post_type ubermenu-item-object-page ubermenu-item-level-0 ubermenu-column ubermenu-column-auto";

            const pinButtonA = document.createElement("a");
            pinButtonA.innerText = "Pinned Topics"
            pinButtonA.className = "ubermenu-target ubermenu-item-layout-default ubermenu-item-layout-text_only"
            pinButtonA.href = "/ejaz/qol-pinned"

            pinButtonLink.appendChild(pinButtonA)

            header.appendChild(pinButtonLink)

            var pins = loclst.getItem("PMTQoL_pins");
            if (pins == undefined || pins == null) {
                pins = [];
                loclst.setItem("PMTQoL_pins", btoa(JSON.stringify(pins)))
            } else {
                try {
                pins = JSON.parse(atob(pins))
                } catch(err) {
                    alert("There is a problem with your pins.")
                    pins = [];
                }
            }

            var URLs = pins.map(x => x.url);

            try {
                const title = document.getElementsByClassName("entry-title")[0];


                title.innerHTML += ` (<a id='pinBtn' href='#pin'>${URLs.includes(window.location.pathname) ? "Remove" : "Pin"}</a>)`

                document.getElementById("pinBtn").addEventListener("click", (e) => {
                    var losa = window.localStorage;

                    pins = loclst.getItem("PMTQoL_pins");
                    if (pins == undefined || pins == null) {
                        pins = [];
                        losa.setItem("PMTQoL_pins", btoa(JSON.stringify(pins)))
                    } else {
                        try {
                        pins = JSON.parse(atob(pins))
                        } catch(err) {
                            alert("There is a problem with your pins.")
                            pins = [];
                        }
                    }

                    URLs = pins.map(x => x.url);
                    const elem = document.getElementById("pinBtn");
                    if (!URLs.includes(window.location.pathname)) {
                        pins.push({
                            url: window.location.pathname,
                            complete: window.location.href,
                            title: document.title,
                        });

                        loclst.setItem("PMTQoL_pins", btoa(JSON.stringify(pins)))
                        elem.innerText = "Remove"
                    } else {
                        pins.forEach((item, index) => {
                            if (item.url == window.location.pathname) {
                                pins.splice(index, 1);
                            }
                        })

                        loclst.setItem("PMTQoL_pins", btoa(JSON.stringify(pins)))
                        elem.innerText = "Pin"

                    }
                })

            } catch(err) {

            }
        }

        document.getElementsByClassName("copyright")[0].innerHTML += "& PMT QoL (Ejaz Ali)";
    }

    function indexPage() {
        // When the index page is ran.

        const whatsNewContainer = document.createElement("div")
        whatsNewContainer.classList.add("dropshadowboxes-container");

        const whatsNew = document.createElement("div");
        whatsNew.className = "dropshadowboxes-drop-shadow dropshadowboxes-rounded-corners dropshadowboxes-inside-and-outside-shadow dropshadowboxes-lifted-both dropshadowboxes-effect-default";
        whatsNew.setAttribute("style", "border: 2px solid #DDD; background-color: white;");

        const title = document.createElement("h3");
        title.innerText = "What's New?"

        const description = document.createElement("ul");
        for (const up of verInformation.description) {
            const li = document.createElement("li");
            li.style.textAlign = "left";
            li.innerText = up;
            description.appendChild(li)
        }
        //description.innerText += "\nTo learn more about the security content of PMT QoL and audit the code visit the Greasyfork page."

        const version = document.createElement("a");
        version.innerText = verInformation.ver;

        whatsNew.appendChild(title);
        whatsNew.appendChild(version);
        whatsNew.appendChild(description);

        whatsNewContainer.appendChild(whatsNew);

        document.getElementsByClassName("col-300")[0].appendChild(whatsNewContainer);



        const statisticsContainer = document.createElement("div")
        statisticsContainer.classList.add("dropshadowboxes-container");

        const statisticsElem = document.createElement("div");
        statisticsElem.className = "dropshadowboxes-drop-shadow dropshadowboxes-rounded-corners dropshadowboxes-inside-and-outside-shadow dropshadowboxes-lifted-both dropshadowboxes-effect-default";
        statisticsElem.setAttribute("style", "border: 2px solid #DDD; background-color: white;");

        const titleA = document.createElement("h3");
        titleA.innerText = "Statistics"

        const individStats = document.createElement("ul");


        if (settings.ad_blocking) {
            const li = document.createElement("li");
            li.style.textAlign = "left";
            li.innerText = "Ads blocked: ";

            setInterval(() => {
                const ls = window.localStorage;
                const internalStats = JSON.parse(atob(ls.getItem("PMTQoL_statistics")));

                li.innerText = `Ads blocked: ${internalStats.adsBlocked}`;
            }, 100)
            individStats.appendChild(li)
        }

        if (settings.native_ad_blocking) {
            const li = document.createElement("li");
            li.style.textAlign = "left";
            li.innerText = "Native Ads Blocked: ";
            setInterval(() => {
                const ls = window.localStorage;
                const internalStats = JSON.parse(atob(ls.getItem("PMTQoL_statistics")));

                li.innerText = `Native Ads Blocked: ${internalStats.nativeAdsBlocked}`;
            }, 100);

            individStats.appendChild(li)
        }

        if (settings.pdf_bypass) {
            const li = document.createElement("li");
            li.style.textAlign = "left";
            li.innerText = "PDFs Bypassed: ";
            setInterval(() => {
                const ls = window.localStorage;
                const internalStats = JSON.parse(atob(ls.getItem("PMTQoL_statistics")));

                li.innerText = `PDFs Bypassed: ${internalStats.pdfBypassed}`;
            }, 100);

            individStats.appendChild(li)
        }

        statisticsElem.appendChild(titleA);
        statisticsElem.appendChild(individStats);

        statisticsContainer.appendChild(statisticsElem);

        document.getElementsByClassName("col-300")[2].appendChild(statisticsContainer);

    }

    function nativeAdBlocking() {
        // Tutors
        try {
            const tutors = document.getElementsByClassName("tutor-profile-box");
            for (const item of tutors) {
                console.log("Killed native tutor ad")
                item.remove()
                incrementStat("native-ads")
            }
        } catch(error) {}

        // Contact Button
        try { document.getElementById("menu-item-42954").remove(); incrementStat("native-ads") } catch(e) {}

        // Teachers Area
        try { document.getElementById("menu-item-46223").remove(); incrementStat("native-ads") } catch(e) {}

        // Teachers Area
        try { document.getElementById("menu-item-48616").remove(); incrementStat("native-ads") } catch(e) {}
    }

    function incrementStat(stat) {
        const ls = window.localStorage;
        let stats = JSON.parse(atob(ls.getItem("PMTQoL_statistics")));

        if (stat == "ads") {
            stats.adsBlocked++;
        }

        if (stat == "native-ads") {
            stats.nativeAdsBlocked++
        }

        if (stat == "pdf-bypass") {
            stats.pdfBypassed++
        }

        ls.setItem("PMTQoL_statistics", btoa(JSON.stringify(stats)));
    }

    function adBlocking() {
        try { document.getElementById("gostory").remove(); console.log("Killed native ad"); incrementStat("ads") } catch(err) {}
        try { document.getElementById("PMT_Top").remove(); console.log("Killed top ad"); incrementStat("ads") } catch(err) {}
        try { document.getElementById("sidebar_ads").remove(); console.log("Killed sidebar ads"); incrementStat("ads") } catch(err) {}
        try { document.getElementById("sidebarSection").remove(); console.log("Killed sidebar ads"); incrementStat("ads") } catch(err) {}
        try { document.getElementsByClassName("pmt_eoc_parrent")[0].remove(); console.log("Killed sidebar ads"); incrementStat("ads") } catch(err) {}
        try { document.getElementsByClassName("ad-hpmpu")[0].remove(); console.log("Killing retention advert (this implementation needs to be fixed)."); incrementStat("ads")} catch(err) {}
        try {
            const stickies = document.getElementsByClassName("PMT_Desktop_Sticky");
            for (const item of stickies) {
                console.log("Killed sticky ad")
                item.remove()
                incrementStat("ads")
            }
        } catch(error) {}
        try {
            const frames = document.getElementsByTagName("iframe");
            for (const item of frames) {
                const kill = iFrameDeathAllowed(window.location, item.src);
                if (kill) {
                    console.log("Killing frame ad (risky move, will improve in a future release)")
                    item.remove()
                    incrementStat("ads")
                } else {

                }
            }
        } catch(error) {}
        try {
            const scripts = document.getElementsByTagName("script");
            for (const item of scripts) {
                if (window.location.pathname.includes("pdf-pages")) {
                    console.log("Killing script, there is no need for these on this type of page.")
                    item.remove()
                    incrementStat("ads")
                } else {

                }
            }
        } catch(error) {}
    }

    function iFrameDeathAllowed(location, src) {
        const readableSrc = new URL(src, window.location)
        const iframeHost = readableSrc.host;
        const allowedHosts = ["www.youtube.com", "docs.google.com"]

        if (location.pathname.includes("pdf-pages")) {
            return false;
        }

        for (const host of allowedHosts) {
            if (iframeHost == host) {
                return false;
            }
        }

        return true;
    }

    document.body.style.display = "none"
    try {
        pageTypeWorkflow(window.location);
        document.body.style.display = "block"
    } catch(err) {
        document.body.style.display = "block"
        const p = document.createElement("p");
        console.error(err);
        p.innerText = "Something went wrong with PMT QoL, please report this to me on Twitter (@ninnmus)"
        document.body.append(p)
    }

    window.addEventListener("load", (event) => {
        if (window.location.pathname.includes("pdf-pages")) {
            //pdfPages();
        }
    });
})();