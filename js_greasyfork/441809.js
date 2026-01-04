// ==UserScript==
// @name         Game Search Helper
// @namespace    https://store.steampowered.com/
// @version      1.3.8
// @license      GPLv3
// @description  Adds search buttons on various gaming related websites to search for the game on external sites
// @author       xdpirate
// @include      /^https\:\/\/www\.(nintendolife|pushsquare|purexbox|timeextension)\.com\/(games|news|reviews|features|guides)\/.*/
// @include      /^https\:\/\/store\.steampowered\.com\/(app|bundle)\/.*/
// @include      /^https\:\/\/www\.metacritic\.com/(browse|game)(\/games\/)?.*/
// @match        https://store.epicgames.com/*
// @match        https://en.wikipedia.org/wiki/*
// @match        https://opencritic.com/*
// @match        https://www.gog.com/*/game/*
// @match        https://www.startpage.com/sp/search*
// @match        https://github.com/xdpirate/GameSearchHelper/blob/main/CustomSearchEngines.md
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @icon         data:image/png;base64,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
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/441809/Game%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/441809/Game%20Search%20Helper.meta.js
// ==/UserScript==
if(window.top != window.self) { // Prevent the script from running in frames
    throw `[${GM_info.script.name}] Not running as topmost frame, exiting`;
}

let GSHSettings = GM_getValue("GSHSettings", {
    defaultProviders: {
        Steam: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: true},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        HookshotMedia: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: true},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        Metacritic: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: false},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        EpicGamesStore: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: false},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        Wikipedia: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: false},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        OpenCritic: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: true},
            OpenCritic: {enabled: false},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        },
        GOGcom: {
            Startpage: {enabled: true},
            Google: {enabled: false},
            Metacritic: {enabled: true},
            OpenCritic: {enabled: true},
            eBay: {enabled: true},
            eBayUK: {enabled: false}
        }
    },
    customProviders: {},
    OpenCriticHelperEnabled: true,
    StripSpecialCharsEnabled: true
});

let defaultEnabledContextsForNewSearchEngines = {
    Steam: true, 
    HookshotMedia: true, 
    Metacritic: true, 
    EpicGamesStore: true,
    Wikipedia: true,
    OpenCritic: true,
    GOGcom: true
};

// Gracefully add new options if the user already has saved data that doesn't include them
if(GSHSettings.StripSpecialCharsEnabled == null) {
    GSHSettings.StripSpecialCharsEnabled = true;
}

GM_addStyle(`
    .GSHIcon {
        border: none;
        padding-left: 2px;
        padding-right: 2px;
    }

    #GSHToggleButton, .GSHBuiltInHandle, .GSHCustomHandle {
        cursor: pointer;
    }

    #GSHHeader {
        font-size: 18px !important;
    }

    .GSHSteamBundleContainer, .GSHMetacriticListContainer {
        margin-bottom: 20px;
    }

    .GSHSteamBundleContainer {
        margin-left: 190px;
    }

    #GSHLinkbox {
        float: right;
        font-size: 10px;
    }

    #GSHBuiltInSearchEngines, #GSHCustomSearchEngines, #GSHCustomSearchEngineDiv {
        padding: 10px;
        border: 1px solid white;
        line-height: 16px;
        border-radius: 5px;
    }
    
    #GSHCustomSearchEngineDiv {
        margin-top: 20px;
    }

    #GSHWrapper {
        overflow: hidden;
    }

    #GSHBuiltInSearchEngines, #GSHCustomSearchEngines {
        max-width: 500px;
        height: 120px; 
        overflow-y: scroll;
        overflow-x: scroll;
    }

    .GSHSearchContainer {
        float: left;
    }

    #GSHOuterDiv {
        float: left;
        background-color: black;
        color: white;
        padding: 10px;
        border: 1px solid white;
        border-radius: 10px;
        z-index: 2147483647;
        display: block;
        position: absolute;
        top: 50px;
        left: 10px;
        font-family: Helvetica !important;
        font-size: 14px !important;
    }

    #GSHSaveButton, #GSHOptionsDiv {
        margin-top: 10px;
        padding: 5px;
    }

    .GSHModifyCustomButton, #GSHCancelEditButton, #GSHNewCustomSearchButton, #GSHGetEnginesButton, .GSHLink {
        font-size: 12px !important;
        cursor: pointer;
        color: #AAA;
        text-decoration: none;
    }

    #GSHSaveDiv {
        width: 100%;
        margin: auto;
        text-align: center;
    }

    .GSHTextBox {
        width: 100%;
    }

    .GSHHidden {
        display: none;
    }

    .HMIcon {
        display: inline-block;
        border: none;
        margin-left: 4px;
        margin-right: 4px;
    }

    .HMContainer {
        padding: 5px;
        padding-top: 10px;
        background-color: white;
        border-radius: 5px;
        width: 100%;
        text-align: center;
    }

    .GSHLabel {
        font-weight: normal !important;
    }

    .GSHInputButton, .GSHInputField {
        background-color: black !important;
        color: white !important;
        border: 1px solid white !important;
        border-radius: 10px !important;
        position: relative !important;
        opacity: 1 !important;
        pointer-events: auto !important;
    }

    .GSHWPBox, .GSHOCContainer, .GSHGOGContainer {
        margin-bottom: 10px;
    }
`);

// Determine current context (site or groups of sites that behave similarly and can reuse code)
let contexts = {
    GithubCustomSearchEngines: ["github.com"],
    Startpage: ["startpage.com"],
    Steam: ["store.steampowered.com"],
    HookshotMedia: ["nintendolife.com", "pushsquare.com", "purexbox.com", "timeextension.com"],
    Metacritic: ["metacritic.com"],
    EpicGamesStore: ["store.epicgames.com"],
    Wikipedia: ["en.wikipedia.org"],
    OpenCritic: ["opencritic.com"],
    GOGcom: ["gog.com"]
};

let currentContext;
for(const [key, value] of Object.entries(contexts)) {
    if(value.some(v => window.location.hostname.includes(v))) {
        currentContext = key;
    }
}

// Non-"normal" context, i.e. contexts that don't place the actual search elements on the page
if(currentContext == "Startpage") {
    if(GSHSettings.OpenCriticHelperEnabled) {
        if(new URLSearchParams(document.location.search).get("ocgsh")) {
            window.location.href = document.querySelector("a.w-gl__result-title.result-link").href;
        }
    }
    die("Done!");
} else if(currentContext == "GithubCustomSearchEngines") {
    let customSearchEngineTable = document.querySelector(".markdown-body > table");
    if(customSearchEngineTable) {
        let rows = customSearchEngineTable.querySelectorAll("tbody > tr");
        for(let i = 0; i < rows.length; i++) {
            let installLink = rows[i].querySelector("td:nth-child(2) > a");
            let params = new URLSearchParams(installLink.href.substring(12));

            let titleCell = rows[i].querySelector("td:nth-child(1)");
            titleCell.innerHTML = `<img src="${params.get("icon")}" /> ${titleCell.innerHTML}`;

            if(GSHSettings.customProviders[params.get("uuid")]) {
                let newSpan = document.createElement("span");
                newSpan.innerHTML = "Added to GSH";
                installLink.insertAdjacentElement("afterend", newSpan);
                installLink.remove();
            } else {
                installLink.innerHTML = "Add to GSH";
                installLink.onclick = function(e){
                    e.preventDefault();

                    let params = new URLSearchParams(this.href.substring(12));
                    let uniqueID = params.get("uuid");

                    let newCustomProvider = {
                        uniqueID: uniqueID,
                        title: params.get("name"),
                        url: params.get("url"),
                        icon: params.get("icon"),
                        enabled: defaultEnabledContextsForNewSearchEngines
                    };

                    GSHSettings.customProviders[uniqueID] = newCustomProvider;
                    GM_setValue("GSHSettings", GSHSettings);
                    location.reload();
                    return false;
                };
            }
        }
    }
}

// Avoid save data errors when new contexts are added
if(!GSHSettings.defaultProviders[currentContext]) {
    GSHSettings.defaultProviders[currentContext] = {
        Startpage: {enabled: true},
        Google: {enabled: false},
        Metacritic: {enabled: true},
        OpenCritic: {enabled: true},
        eBay: {enabled: true},
        eBayUK: {enabled: false}
    };

    for(const provider in GSHSettings.customProviders) {
        GSHSettings.customProviders[provider].enabled[currentContext] = false;
    }
}

let providers = [
    { 
        uniqueID: "Startpage",
        enabled: GSHSettings.defaultProviders[currentContext].Startpage.enabled,
        title: "Startpage", 
        url: "https://www.startpage.com/sp/search?query=%search%", 
        icon: "data:image/png;base64,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"
    },
    {
        uniqueID: "Google",
        enabled: GSHSettings.defaultProviders[currentContext].Google.enabled,
        title: "Google",
        url: "https://www.google.com/search?q=%search%",
        icon: " data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TiyIVh3YQccjQOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQrPKNKtnHNB028ykkmIuvyr2viKICMIIIS4zy5iTpDR8x9c9Any9S/As/3N/jgG1YDEgIBLPMsO0iTeIpzdtg/M+cZSVZZX4nHjMpAsSP3Jd8fiNc8llgWdGzWxmnjhKLJa6WOliVjY14inimKrplC/kPFY5b3HWqnXWvid/YbigryxzneYIUljEEiSIUFBHBVXYSNCqk2IhQ/tJH/+w65fIpZCrAkaOBdSgQXb94H/wu1urODnhJYWTQOjFcT7iQO8u0Go4zvex47ROgOAzcKV3/LUmMPNJeqOjxY6AwW3g4rqjKXvA5Q4w9GTIpuxKQZpCsQi8n9E35YHILdC/5vXW3sfpA5ClrtI3wMEhMFqi7HWfd/d19/bvmXZ/Py0NcovR+4vhAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH5gMTEhook//1oQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAIkSURBVDjLnVNNSJRRFD33jXzOZ9EsBF20mYRSI8oR2khKZT+6EYrc1a5SaNVAQRERlC6NNtOoy5YVRUJUoFFWZNZiioaRpJmIIBrNEYoZv5l3T4tmzJ+RogMP7uLe9+457xxgBay1zSSjqjpFcoHkQrG+bq0NYS2QrFLVYZLKtaGqOkjSLc1JaZjkAxFppech93wcuZFbsIl3AAlf/Tb4u7rh39UGcRyQfCoiHSKSFQBQ1WEROa7fZzHfdxGF2GTZLZ3dBxC4cKW08ZAxpkestc3GmNf0PMmcO41CbBJS6YfbG4ZT3wAA8KYSWLh3E4G+AfhqahdZq2ozSEZJMh+/z5kjIaY7Wuh9nF7N3hbKaRJBUWEWXnXRG6li9uEN/itUNVEhIkEA4I/HEDePyqbNy3i39/9cpcXBRh/OHvJDRIIG/4Fs/k9tSKYAQNbvxbxW4cXX1LLm0fPrFk93qAIAUFctpZ9IGREZA4B0zSmczLTiTPwOPswmV736Oa24+7YAANi+6fdFIjIm1tqQMeaNZ/MSHr2Mibk4Kn0Owo1H0VC7BUYEyZlPuDbxDfkvndi50UH/MRdGQFUNlYw0JCInZrMZXBq/ipdz78ty3+rsw0B7D6o3CEgOGmN6S1Z2i1Zu8zSPZ8kJ3E4+QiwzDZJoDARxOLgfe+pa4Fb4QfKJiHSKSHZpmNxiUP4WpujSMKFMnJtIRlQ1QTJHMlesI9baHSv7fwEbaLxgvHm01QAAAABJRU5ErkJggg=="
    },
    {
        uniqueID: "Metacritic",
        enabled: GSHSettings.defaultProviders[currentContext].Metacritic.enabled,
        title: "Metacritic", 
        url: "https://www.metacritic.com/search/game/%searchPlus%/results", 
        icon: "data:image/png;base64,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"
    },
    {
        uniqueID: "OpenCritic",
        enabled: GSHSettings.defaultProviders[currentContext].OpenCritic.enabled,
        title: "OpenCritic", 
        url: "https://www.startpage.com/sp/search?query=site:opencritic.com+%search%&ocgsh=1", 
        icon: "data:image/png;base64,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"
    },
    {
        uniqueID: "eBay",
        enabled: GSHSettings.defaultProviders[currentContext].eBay.enabled,
        title: "eBay.com", 
        url: "https://www.ebay.com/sch/i.html?_nkw=%search%", 
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TiyIVh3YQccjQOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQrPKNKtnHNB028ykkmIuvyr2viKICMIIIS4zy5iTpDR8x9c9Any9S/As/3N/jgG1YDEgIBLPMsO0iTeIpzdtg/M+cZSVZZX4nHjMpAsSP3Jd8fiNc8llgWdGzWxmnjhKLJa6WOliVjY14inimKrplC/kPFY5b3HWqnXWvid/YbigryxzneYIUljEEiSIUFBHBVXYSNCqk2IhQ/tJH/+w65fIpZCrAkaOBdSgQXb94H/wu1urODnhJYWTQOjFcT7iQO8u0Go4zvex47ROgOAzcKV3/LUmMPNJeqOjxY6AwW3g4rqjKXvA5Q4w9GTIpuxKQZpCsQi8n9E35YHILdC/5vXW3sfpA5ClrtI3wMEhMFqi7HWfd/d19/bvmXZ/Py0NcovR+4vhAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gMTDAUsT3CxXAAAANZJREFUOMvtkLEKwjAQhi8u4tADBwVx6JZNEIWAS1YFne4BxLcoLoJbVh19h6ylc8c+QbJlKOLYxTkuKpha0FX8IcuXu4+fA+89hM8Yw4lII2KFiBURaWMMfzfbgiDWWi6lzIUQhXMuds7FQohCSplba3k4XzMSkVZKJSFXSiVEpENeEyBilWXZPORpmi4QsQo5897DeTrzj0bDyeml4XU5vjcFYAzg0Ok9/7bzC6vdoCmMvecfC5ryF/yOoNXvld8uRu1B+RR097vNN5KoPShXo+MaAOAGZ02ixyW3i1cAAAAASUVORK5CYII="
    },
    {
        uniqueID: "eBayUK",
        enabled: GSHSettings.defaultProviders[currentContext].eBayUK.enabled,
        title: "eBay United Kingdom", 
        url: "https://www.ebay.co.uk/sch/i.html?_nkw=%search%", 
        icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABg2lDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TiyIVh3YQccjQOlkQFXHUKhShQqgVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6OSk6CIl/i8ptIjx4Lgf7+497t4BQrPKNKtnHNB028ykkmIuvyr2viKICMIIIS4zy5iTpDR8x9c9Any9S/As/3N/jgG1YDEgIBLPMsO0iTeIpzdtg/M+cZSVZZX4nHjMpAsSP3Jd8fiNc8llgWdGzWxmnjhKLJa6WOliVjY14inimKrplC/kPFY5b3HWqnXWvid/YbigryxzneYIUljEEiSIUFBHBVXYSNCqk2IhQ/tJH/+w65fIpZCrAkaOBdSgQXb94H/wu1urODnhJYWTQOjFcT7iQO8u0Go4zvex47ROgOAzcKV3/LUmMPNJeqOjxY6AwW3g4rqjKXvA5Q4w9GTIpuxKQZpCsQi8n9E35YHILdC/5vXW3sfpA5ClrtI3wMEhMFqi7HWfd/d19/bvmXZ/Py0NcovR+4vhAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5gMTDAUsT3CxXAAAANZJREFUOMvtkLEKwjAQhi8u4tADBwVx6JZNEIWAS1YFne4BxLcoLoJbVh19h6ylc8c+QbJlKOLYxTkuKpha0FX8IcuXu4+fA+89hM8Yw4lII2KFiBURaWMMfzfbgiDWWi6lzIUQhXMuds7FQohCSplba3k4XzMSkVZKJSFXSiVEpENeEyBilWXZPORpmi4QsQo5897DeTrzj0bDyeml4XU5vjcFYAzg0Ok9/7bzC6vdoCmMvecfC5ryF/yOoNXvld8uRu1B+RR097vNN5KoPShXo+MaAOAGZ02ixyW3i1cAAAAASUVORK5CYII="
    }
];

let providersList = `<div id="GSHBuiltInSortable">`;
for(let i = 0; i < providers.length; i++) {
    providersList += `
        <span id="GSHBuiltinSearchSpan_${providers[i].uniqueID}" data-id-builtin="${i}">
            ${currentContext != "GithubCustomSearchEngines" ? `<span class="GSHBuiltInHandle" title="Drag to reorder search engines">≡</span>
            <input class="GSHInputField" type="checkbox" id="GSHBuiltinSearchCheck_${providers[i].uniqueID}"${providers[i].enabled ? " checked" : ""}>` : ""}
            <label class="GSHLabel" for="GSHBuiltinSearchCheck_${providers[i].uniqueID}" title="${encodeHTMLEntities(providers[i].url)}"><img src="${providers[i].icon}" width="16px" height="16px" /> ${providers[i].title}</label><br />
        </span>
    `;
}
providersList += "</div>";

let customProvidersList = `<div id="GSHCustomSortable">`;
let i = 0;
for(const provider in GSHSettings.customProviders) {
    customProvidersList += `
        <span id="GSHCustomSearchSpan_${GSHSettings.customProviders[provider].uniqueID}" data-id-custom="${provider}">
            ${currentContext != "GithubCustomSearchEngines" ? `<span class="GSHCustomHandle" title="Drag to reorder search engines">≡</span>
            <input class="GSHInputField" type="checkbox" id="GSHCustomSearchCheck_${GSHSettings.customProviders[provider].uniqueID}"${GSHSettings.customProviders[provider].enabled[currentContext] ? " checked" : ""}>` : ""}
            <label class="GSHLabel" for="GSHCustomSearchCheck_${GSHSettings.customProviders[provider].uniqueID}" title="${encodeHTMLEntities(GSHSettings.customProviders[provider].url)}"><img src="${GSHSettings.customProviders[provider].icon}" width="16px" height="16px" /> ${GSHSettings.customProviders[provider].title}</label> 
            <span class="GSHModifyCustomButton" id="GSHEdit_${GSHSettings.customProviders[provider].uniqueID}" title="Edit">[e]</span> 
            <span class="GSHModifyCustomButton" id="GSHDelete_${GSHSettings.customProviders[provider].uniqueID}" title="Delete">[d]</span><br />
        </span>
    `;
    i++;
}
customProvidersList += "</div>";

let newBox = document.createElement("div");
newBox.innerHTML = `
    <div id="GSHOuterDiv">
        <span id="GSHToggleButton" title="${GM_info.script.name}">🔍</span>
        <div id="GSHInnerDiv" class="GSHHidden">
            <div id="GSHLinkbox">[ <a href="https://github.com/xdpirate/GameSearchHelper" class="GSHLink" target="_blank" title="Visit GSH's Github repository">Github</a> | <a href="https://greasyfork.org/en/scripts/441809-game-search-helper/" class="GSHLink" target="_blank" title="Visit GSH's Greasy Fork page">Greasy Fork</a> ]</div>
            <div id="GSHHeader">${GM_info.script.name} v${GM_info.script.version}</div>
            <div id="GSHSettingsContent">
                Current context: <b>${currentContext}</b><br /><br />

                <div id="GSHWrapper">
                    <div class="GSHSearchContainer">
                        Built-in search engines:<br />
                        <div id="GSHBuiltInSearchEngines">
                            ${providersList}
                        </div>
                        ${currentContext != "GithubCustomSearchEngines" ? `Select: <span id="GSHBuiltInSelectAllButton" class="GSHLink">[all]</span> <span id="GSHBuiltInSelectNoneButton" class="GSHLink">[none]</span> <span id="GSHBuiltInSelectInvertButton" class="GSHLink">[invert]</span>` : ""}
                    </div>

                    <div class="GSHSearchContainer">
                        Custom search engines: <span id="GSHNewCustomSearchButton" title="Add a new custom search engine">[new]</span> <a id="GSHGetEnginesButton" href="https://github.com/xdpirate/GameSearchHelper/blob/main/CustomSearchEngines.md" target="_blank" title="Get some premade custom search engines from the Github repository">[get]</a><br />
                        <div id="GSHCustomSearchEngines">
                            ${customProvidersList}
                        </div>
                        ${currentContext != "GithubCustomSearchEngines" ? `Select: <span id="GSHCustomSelectAllButton" class="GSHLink">[all]</span> <span id="GSHCustomSelectNoneButton" class="GSHLink">[none]</span> <span id="GSHCustomSelectInvertButton" class="GSHLink">[invert]</span>` : ""}
                    </div>
                </div>

                <div id="GSHCustomSearchEngineDiv" class="GSHHidden">
                    <span id="GSHSearchEngineEditorHeader"></span> <span id="GSHCancelEditButton" title="Cancel editing this custom search engine">[cancel]</span><br /><br />
                    
                    Display name:<br />
                    <input type="text" class="GSHTextBox GSHInputField" id="GSHDisplayNameInput" title="The display name of the custom search engine"></input>
                    <br /><br />

                    Search URL <span title="Substitute the search term with %search% in the URL. If the site you are searching requires spaces to be replaced with plus-signs, use %searchPlus% instead.">[help]</span>:<br />
                    <input type="text" class="GSHTextBox GSHInputField" id="GSHSearchURLInput" title="The search URL of the custom search engine"></input>
                    <br /><br />

                    Icon (16x16, URL or <a href="https://en.wikipedia.org/wiki/Data_URI_scheme" class="GSHLink" target="_blank">image data URI</a>):<br />
                    <input type="text" class="GSHTextBox GSHInputField" id="GSHIconInput" title="The URL or data URI of the custom search engine's icon"></input>

                    <input type="hidden" id="GSHUniqueIDInput"></input>
                    <input type="hidden" id="GSHModifyMode" value="none"></input>
                </div>

                <div id="GSHOptionsDiv">
                    <input type="checkbox" class="GSHInputField" id="GSHOpenCriticHelperCheckbox"${GSHSettings.OpenCriticHelperEnabled ? " checked" : ""}>
                    <label class="GSHLabel" for="GSHOpenCriticHelperCheckbox">Open Startpage proxy results with one click</label> <sup><a href="https://github.com/xdpirate/GameSearchHelper/blob/main/README.md#options" class="GSHLink" target="_blank" title="Read about this option in the README on Github">?</a></sup><br />
                    <input type="checkbox" class="GSHInputField" id="GSHStripSpecialCharsCheckbox"${GSHSettings.StripSpecialCharsEnabled ? " checked" : ""}>
                    <label class="GSHLabel" for="GSHStripSpecialCharsCheckbox">Strip non-ASCII characters from search term (&trade;, &copy;, etc)</label><br />
                </div>

                <div id="GSHSaveDiv">
                    <input type="button" class="GSHInputButton" value="Save and reload" id="GSHSaveButton" title="Save your settings and reload the page for them to take effect"></input>
                </div>
            </div>
        <div>
    </div>
`;

document.body.append(newBox);

if(currentContext != "GithubCustomSearchEngines") {
    let builtInSortable = new Sortable(document.getElementById("GSHBuiltInSortable"), {
        group: "GSHBuiltInSearchEnginesSort",
        handle: ".GSHBuiltInHandle",
        dataIdAttr: 'data-id-builtin',
        store: {
            get: function (sortable) {
                var order = GM_getValue(`${sortable.options.group.name}_${currentContext}`, false);
                return order ? order.split('|') : [];
            },
            set: function (sortable) {
                var order = sortable.toArray();
                GM_setValue(`${sortable.options.group.name}_${currentContext}`, order.join('|'));
            },
        }
    });
    
    let customSortable = new Sortable(document.getElementById("GSHCustomSortable"), {
        group: "GSHCustomSearchEnginesSort",
        handle: ".GSHCustomHandle",
        dataIdAttr: 'data-id-custom',
        store: {
            get: function (sortable) {
                var order = GM_getValue(`${sortable.options.group.name}_${currentContext}`, false);
                return order ? order.split('|') : [];
            },
            set: function (sortable) {
                var order = sortable.toArray();
                GM_setValue(`${sortable.options.group.name}_${currentContext}`, order.join('|'));
            },
        }
    });

    document.getElementById("GSHBuiltInSelectAllButton").onclick = function() {
        let builtinSearchCheckboxes = document.querySelectorAll(`input[id^="GSHBuiltinSearchCheck_"]`);
        for(let i = 0; i < builtinSearchCheckboxes.length; i++) {
            builtinSearchCheckboxes[i].checked = true;
        }
    };

    document.getElementById("GSHBuiltInSelectNoneButton").onclick = function() {
        let builtinSearchCheckboxes = document.querySelectorAll(`input[id^="GSHBuiltinSearchCheck_"]`);
        for(let i = 0; i < builtinSearchCheckboxes.length; i++) {
            builtinSearchCheckboxes[i].checked = false;
        }
    };

    document.getElementById("GSHBuiltInSelectInvertButton").onclick = function() {
        let builtinSearchCheckboxes = document.querySelectorAll(`input[id^="GSHBuiltinSearchCheck_"]`);
        for(let i = 0; i < builtinSearchCheckboxes.length; i++) {
            builtinSearchCheckboxes[i].checked = !builtinSearchCheckboxes[i].checked;
        }
    };

    document.getElementById("GSHCustomSelectAllButton").onclick = function() {
        let customSearchCheckboxes = document.querySelectorAll(`input[id^="GSHCustomSearchCheck_"]`);
        for(let i = 0; i < customSearchCheckboxes.length; i++) {
            customSearchCheckboxes[i].checked = true;
        }
    };

    document.getElementById("GSHCustomSelectNoneButton").onclick = function() {
        let customSearchCheckboxes = document.querySelectorAll(`input[id^="GSHCustomSearchCheck_"]`);
        for(let i = 0; i < customSearchCheckboxes.length; i++) {
            customSearchCheckboxes[i].checked = false;
        }
    };

    document.getElementById("GSHCustomSelectInvertButton").onclick = function() {
        let customSearchCheckboxes = document.querySelectorAll(`input[id^="GSHCustomSearchCheck_"]`);
        for(let i = 0; i < customSearchCheckboxes.length; i++) {
            customSearchCheckboxes[i].checked = !customSearchCheckboxes[i].checked;
        }
    };
}

document.getElementById("GSHSaveButton").onclick = function() {
    saveData();
    location.reload();
};

document.getElementById("GSHToggleButton").onclick = function() {
    document.getElementById('GSHInnerDiv').classList.toggle('GSHHidden');
};

document.getElementById("GSHNewCustomSearchButton").onclick = function() {
    let uniqueID = crypto.randomUUID();
    document.getElementById("GSHSearchEngineEditorHeader").innerHTML = "New custom search engine";
    document.getElementById("GSHDisplayNameInput").value = "";
    document.getElementById("GSHSearchURLInput").value = "https://example.com/?s=%search%";
    document.getElementById("GSHIconInput").value = "";

    document.getElementById("GSHUniqueIDInput").value = uniqueID;
    document.getElementById("GSHModifyMode").value = "add";

    document.getElementById("GSHCustomSearchEngineDiv").classList.remove("GSHHidden");
};

let editButtons = document.querySelectorAll(`span[id^="GSHEdit_`);
for(let i = 0; i < editButtons.length; i++) {
    editButtons[i].onclick = function() {
        let uniqueID = this.id.match(/^GSHEdit_(.+)$/)[1];
        document.getElementById("GSHSearchEngineEditorHeader").innerHTML = "Editing " + GSHSettings.customProviders[uniqueID].title;
        document.getElementById("GSHDisplayNameInput").value = GSHSettings.customProviders[uniqueID].title;
        document.getElementById("GSHSearchURLInput").value = GSHSettings.customProviders[uniqueID].url;
        document.getElementById("GSHIconInput").value = GSHSettings.customProviders[uniqueID].icon;

        document.getElementById("GSHUniqueIDInput").value = uniqueID;
        document.getElementById("GSHModifyMode").value = "edit";

        document.getElementById("GSHCustomSearchEngineDiv").classList.remove("GSHHidden");
    };
}

let deleteButtons = document.querySelectorAll(`span[id^="GSHDelete_`);
for(let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].onclick = function() {
        let uniqueID = this.id.match(/^GSHDelete_(.+)$/)[1];
        if(confirm("Are you sure you want to delete this custom search engine?\nName: " + GSHSettings.customProviders[uniqueID].title + "\nUnique ID: " + uniqueID)) {
            saveData();
            delete GSHSettings.customProviders[uniqueID];
            GM_setValue("GSHSettings", GSHSettings);
            location.reload();
        }
    };
}

document.getElementById("GSHCancelEditButton").onclick = function() {
    document.getElementById("GSHCustomSearchEngineDiv").classList.add("GSHHidden");
    document.getElementById("GSHModifyMode").value = "none";
};

let game = {
    set name(name) {
        this._name = name.trim();
    },
    get name() {
        if(GSHSettings.StripSpecialCharsEnabled) {
            return encodeURIComponent(this._name.replace(/[^\x00-\x7F]/g, "").replace(/  /g, " "));
        } else {
            return encodeURIComponent(this._name);
        }
    },
    get namePlus() {
        if(GSHSettings.StripSpecialCharsEnabled) {
            return encodeURIComponent(this._name.replace(/[^\x00-\x7F]/g, "").replace(/  /g, " ")).replace(/%20/g, "+");
        } else {
            return encodeURIComponent(this._name).replace(/%20/g, "+");
        }
    },
    get namePlusAlphanumericOnly() {
        return encodeURIComponent(this._name.replace(/[^A-Za-z0-9 ]/g, "")).replace(/%20/g, "+");
    }
};

// "Normal" contexts where search elements will be placed on the page
if(currentContext == "Steam") {
    if(window.location.href.includes("/app/")) {
        let headerElement = document.getElementById("appHubAppName");

        if(headerElement) {
            game.name = headerElement.innerHTML;
            addGSHBox(game, headerElement, "", "GSHIcon");
        } else {
            die("Could not find header element");
        }
    } else if(window.location.href.includes("/bundle/")) {
        let multiGames = document.querySelectorAll("div.bundle_package_item");
        if(multiGames) {
            for(let i = 0; i < multiGames.length; i++) {
                let containerElement = multiGames[i].querySelector("div.tab_item_content");
                game.name = containerElement.querySelector("div.tab_item_name").innerHTML;

                let newAdjElem = multiGames[i].insertAdjacentElement("afterend", document.createElement("div"));
                addGSHBox(game, newAdjElem, "GSHSteamBundleContainer", "GSHIcon");
            }    
        }
    }
} else if(currentContext == "HookshotMedia") {
    let gameOverview, headerElement;
    if(window.location.href.includes("/games/")) {
        headerElement = document.querySelector("div.info");

        if(headerElement) {
            game.name = headerElement.querySelector("h1.title > a").innerHTML.match(/^(.+) \(.+\)$/)[1];
            addGSHBox(game, headerElement, "HMContainer", "HMIcon");
        } else {
            die("Could not find header element");            
        }
    } else {
        gameOverview = document.getElementById("game-overview");

        if(gameOverview) {
            headerElement = gameOverview.querySelector("header.widget-header");
            game.name = gameOverview.querySelector("div.body > div.items > div.item > p.definition > a").innerHTML;
            addGSHBox(game, headerElement, "HMContainer", "HMIcon"); 
        } else {
            // No single game overview found, is there a "featured games" multi-game section?
            let multiGames = document.querySelector("section.block.related-games");
            if(multiGames) {
                let games = multiGames.querySelectorAll("li.item");
                for(let i = 0; i < games.length; i++) {
                    game.name = games[i].querySelector("h2.heading > a").innerHTML.match(/(.*?)</)[1].trim();
                    addGSHBox(game, games[i], "HMContainer", "HMIcon");
                }
            } else {
                die("Could not find game overview or featured games");
            }
        }
    }
} else if(currentContext == "Metacritic") {
    if(window.location.href == "https://www.metacritic.com/game" || window.location.href.match(/\/game\/(?!legacy)([A-Za-z0-9\-]+)$/)) {
        // Game home page or any system's game home page, /game/legacy is excluded because it acts like a browse page
        let mainBox = document.getElementById("main");
        if(mainBox) {
            let observer = new MutationObserver(function(event) {
                let bodyBox = document.getElementById("main").querySelector("div.body_wrap.has_genre_nav");
                if(bodyBox) {
                    if(!bodyBox.querySelector(".GSHIcon")) { // Avoids infinite recursion
                        let multiGames = bodyBox.querySelectorAll(`table.clamp-list > tbody > tr:not(.spacer)`);
                        if(multiGames) {
                            for(let i = 0; i < multiGames.length; i++) {
                                let headerElement = multiGames[i].querySelector("td.clamp-summary-wrap > a.title");
                                game.name = headerElement.querySelector("h3").innerHTML;

                                let newAdjElem = headerElement.insertAdjacentElement("afterend", document.createElement("div"));
                                addGSHBox(game, newAdjElem, "GSHMetacriticListContainer", "GSHIcon");
                            }
                        }
                    }
                }
            });
        
            observer.observe(mainBox, {subtree: true, childList: true});

            let multiGames = document.querySelectorAll(`table.clamp-list > tbody > tr:not(.spacer)`);
            if(multiGames) {
                for(let i = 0; i < multiGames.length; i++) {
                    let headerElement = multiGames[i].querySelector("td.clamp-summary-wrap > a.title");
                    if(headerElement) {
                        game.name = headerElement.querySelector("h3").innerHTML;

                        let newAdjElem = headerElement.insertAdjacentElement("afterend", document.createElement("div"));
                        addGSHBox(game, newAdjElem, "GSHMetacriticListContainer", "GSHIcon");
                    }
                }
            } else {
                die("Could not find game elements");
            }
        }
    } else if(window.location.href.includes("/browse/games/") || window.location.href.endsWith("/game/legacy")) {
        // Any game list / browse page
        let multiGames = document.querySelectorAll(`table.clamp-list > tbody > tr:not(.spacer)`);
        if(multiGames) {
            for(let i = 0; i < multiGames.length; i++) {
                let headerElement = multiGames[i].querySelector("td.clamp-summary-wrap > a.title");
                game.name = headerElement.querySelector("h3").innerHTML;

                let newAdjElem = headerElement.insertAdjacentElement("afterend", document.createElement("div"));
                addGSHBox(game, newAdjElem, "GSHMetacriticListContainer", "GSHIcon");
            }
        } else {
            die("Could not find game elements");
        }
    } else if(window.location.href.match(/\/game\/([A-Za-z0-9\-]+)\/([A-Za-z0-9\-]+)$/)) {
        // Any specific game page
        let titleElement = document.querySelector("div.product_title");
        if(titleElement) {
            game.name = titleElement.querySelector("a > h1").innerHTML;
            addGSHBox(game, titleElement, "", "GSHIcon");
        } else {
            die("Could not get title element");
        }
    }
} else if(currentContext == "EpicGamesStore") {
    let observer = new MutationObserver(function(event) {
        if(document.documentElement) {
            let titleElement = document.querySelector(`div[data-component="PDPTitleHeader"] > span[data-component="Text"]`);
            if(titleElement) {
                if(titleElement.GSHDetected != true) {
                    titleElement.GSHDetected = true;
                    game.name = titleElement.innerHTML;
                    addGSHBox(game, titleElement.insertAdjacentElement("afterend", document.createElement("div")), "", "GSHIcon");
                }
            }
        }
    });
    
    observer.observe(document.documentElement, {subtree: true, childList: true});
} else if(currentContext == "Wikipedia") {
    let blacklistedCategories = ["fictional video games", "nintendo hardware", "video game locations"];
    let categories = document.querySelectorAll("div#catlinks > div#mw-normal-catlinks > ul > li > a");
    
    let isGame = false;
    for(let i = 0; i < categories.length; i++) {
        let category = categories[i].innerHTML.toLowerCase();
        if(blacklistedCategories.includes(category) || category.includes("characters in video games") || category.includes("about video games")) {
            isGame = false;
            break;
        }

        if(category.includes("video games") || category.includes("video game franchises")) {
            isGame = true;
        }
    }

    if(isGame) {
        let headerElement = document.querySelector("h1#firstHeading");
        game.name = headerElement.querySelector("i").innerHTML;
        addGSHBox(game, headerElement.insertAdjacentElement("afterend", document.createElement("div")), "GSHWPBox", "GSHIcon");
    }
} else if(currentContext == "OpenCritic") {
    let observer = new MutationObserver(function(event) {
        if(document.documentElement) {
            let titleElement = document.querySelector("h1.mb-0");
            if(titleElement) {
                if(titleElement.GSHDetected != true) {
                    titleElement.GSHDetected = true;
                    game.name = titleElement.innerHTML;
                    addGSHBox(game, titleElement.insertAdjacentElement("afterend", document.createElement("div")), "GSHOCContainer", "GSHIcon");
                }

                let titleUpdateObserver = new MutationObserver(function(event) {
                    let titleElement = document.querySelector("h1.mb-0");
                    document.getElementsByClassName("GSHOCContainer")[0].parentNode.remove();
                    game.name = titleElement.innerHTML;
                    addGSHBox(game, titleElement.insertAdjacentElement("afterend", document.createElement("div")), "GSHOCContainer", "GSHIcon");
                });

                titleUpdateObserver.observe(titleElement, {subtree: true, characterData: true});
            }
        }
    });

    observer.observe(document.documentElement, {subtree: true, childList: true});
} else if(currentContext == "GOGcom") {
    let titleElement = document.querySelector(`div.productcard-basics > h1.productcard-basics__title`);
    if(titleElement) {
        titleElement.GSHDetected = true;
        game.name = titleElement.innerHTML;
        addGSHBox(game, titleElement.insertAdjacentElement("afterend", document.createElement("div")), "GSHGOGContainer", "GSHIcon");
    }
}

saveData();

function addGSHBox(game, containerElement, boxClass, iconClass) {
    let GSHBox = document.createElement("div");
    if(boxClass !== "") {
        GSHBox.classList.add(boxClass);
    }

    let builtinSortOrder = GM_getValue(`GSHBuiltInSearchEnginesSort_${currentContext}`, false);
    if(!builtinSortOrder) {
        builtinSortOrder = [0, 1, 2, 3, 4, 5];
    } else {
        builtinSortOrder = builtinSortOrder.split("|");
    }

    for(let i = 0; i < providers.length; i++) {
        if(providers[builtinSortOrder[i]].enabled) {
            let searchLink = document.createElement("span");
            searchLink.classList.add(iconClass);

            let title = providers[builtinSortOrder[i]].title;
            let searchURL = providers[builtinSortOrder[i]].url.replace("%search%", game.name).replace("%searchPlus%", game.namePlus).replace("%searchPlusAlpha%", game.namePlusAlphanumericOnly);
            let icon = providers[builtinSortOrder[i]].icon;

            searchLink.innerHTML = `
                <a target="_blank" title="${title}" href="${searchURL}"><img src="${icon}" width="16px" height="16px" /></a>
            `;

            GSHBox.append(searchLink);
        }
    }

    let i = 0;
    let customProvidersArray = [];
    for(const provider in GSHSettings.customProviders) {
        customProvidersArray[i] = provider;
        i++;
    }

    let customSortOrder = GM_getValue(`GSHCustomSearchEnginesSort_${currentContext}`, false);
    if(customSortOrder) {
        customSortOrder = customSortOrder.split("|");
    }

    for(let i = 0; i < customProvidersArray.length; i++) {
        if(customSortOrder) {
            provider = customSortOrder[i];
        } else {
            provider = customProvidersArray[i];
        }

        if(GSHSettings.customProviders[provider]) {
            if(GSHSettings.customProviders[provider].enabled[currentContext]) {
                let searchLink = document.createElement("span");
                searchLink.classList.add(iconClass);

                let title = GSHSettings.customProviders[provider].title;
                let searchURL = GSHSettings.customProviders[provider].url.replace("%search%", game.name).replace("%searchPlus%", game.namePlus).replace("%searchPlusAlpha%", game.namePlusAlphanumericOnly);
                let icon = GSHSettings.customProviders[provider].icon;

                searchLink.innerHTML = `
                    <a target="_blank" title="${title}" href="${searchURL}"><img src="${icon}" width="16px" height="16px" /></a>
                `;

                GSHBox.append(searchLink);
            }
        }
        
    }
    
    containerElement.append(GSHBox);
}

function saveData() {
    if(currentContext != "GithubCustomSearchEngines") {
        let builtinSearchCheckboxes = document.querySelectorAll(`input[id^="GSHBuiltinSearchCheck_"]`);
        for(let i = 0; i < builtinSearchCheckboxes.length; i++) {
            let uniqueID = builtinSearchCheckboxes[i].id.match(/GSHBuiltinSearchCheck_(.+)$/)[1];
            GSHSettings.defaultProviders[currentContext][uniqueID].enabled = builtinSearchCheckboxes[i].checked;
        }

        let customSearchCheckboxes = document.querySelectorAll(`input[id^="GSHCustomSearchCheck_"]`);
        for(let i = 0; i < customSearchCheckboxes.length; i++) {
            let uniqueID = customSearchCheckboxes[i].id.match(/GSHCustomSearchCheck_(.+)$/)[1];
            GSHSettings.customProviders[uniqueID].enabled[currentContext] = customSearchCheckboxes[i].checked;
        }
    }
    

    if(!document.getElementById("GSHCustomSearchEngineDiv").classList.contains("GSHHidden")) {
        let modifyMode = document.getElementById("GSHModifyMode").value;
        if(modifyMode == "add") {
            let uniqueID = document.getElementById("GSHUniqueIDInput").value;

            let newCustomProvider = {
                uniqueID: uniqueID,
                title: document.getElementById("GSHDisplayNameInput").value,
                url: document.getElementById("GSHSearchURLInput").value,
                icon: document.getElementById("GSHIconInput").value,
                enabled: defaultEnabledContextsForNewSearchEngines
            };

            GSHSettings.customProviders[uniqueID] = newCustomProvider;
        } else if(modifyMode == "edit") {
            let uniqueID = document.getElementById("GSHUniqueIDInput").value;

            GSHSettings.customProviders[uniqueID].title = document.getElementById("GSHDisplayNameInput").value;
            GSHSettings.customProviders[uniqueID].url = document.getElementById("GSHSearchURLInput").value;
            GSHSettings.customProviders[uniqueID].icon = document.getElementById("GSHIconInput").value;
        }

    }

    GSHSettings.OpenCriticHelperEnabled = document.getElementById("GSHOpenCriticHelperCheckbox").checked;
    GSHSettings.StripSpecialCharsEnabled = document.getElementById("GSHStripSpecialCharsCheckbox").checked;

    GM_setValue("GSHSettings", GSHSettings);
}

function encodeHTMLEntities(text) { // modified from SO answer to include the full range
    text = text.replace(/[\u0000-\u9999<>\&]/g, function(i) {
        return '&#'+i.charCodeAt(0)+';';
    });

    return text;
}

function die(errorMsg) {
    throw `[${GM_info.script.name}] ${errorMsg} (${currentContext})`;   
}
