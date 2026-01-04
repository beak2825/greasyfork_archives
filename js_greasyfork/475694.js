// ==UserScript==
// @name            Joyn.de Advanced Live Filter
// @name:de         Joyn.de Erweiterter Live Filter
// @version         1.0.0
// @description     Advanced Filter Options for the Live TV Page on Joyn.de
// @description:de  Erweiterte Filtermöglichkeiten für die Live-TV-Seite auf Joyn.de
// @icon            https://www.joyn.de/favicon.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/joyn.de-advanced-live-filter
// @license         MIT
// @match           https://www.joyn.de/*
// @grant           GM.setValue
// @grant           GM.getValue
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/475694/Joynde%20Advanced%20Live%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/475694/Joynde%20Advanced%20Live%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function newElement(tagName, attributes, content) {
        var tag = document.createElement(tagName);
        for (var key in attributes || {}) {
            if (attributes[key] !== undefined && attributes[key] !== null) {
                tag.setAttribute(key, attributes[key]);
            }
        }
        tag.innerHTML = content || "";
        return tag;
    }

    function injectStyling() {
        const s = document.createElement("style");
        s.innerHTML = `#JALF {
            position: absolute;
            top: 32px;
            left: 50%;
            transform: translateX(-50%);
        }

        #JALF h2 {
            font-size: 28px;
            font-family: Campton-Bold, Helvetica, sans-serif;
            margin-bottom: 1.75%;
            text-align: center;
        }

        #JALF input[type="text"] {
            color: white;
            border: 0px;
            background: rgba(255, 255, 255, 0.2);
            line-height: 18px;
            margin-bottom: 1.75%;
            width: 100%;
        }

        #JALF input[type="checkbox"] {
            display: none;
        }

        #JALF input[type="checkbox"] + label {
            position: relative;
            padding-left: 20px;
            display: inline-block;
            margin-right: 10px;
        }

        #JALF input[type="checkbox"] + label:before {
            content: "";
            position: absolute;
            left: 0;
            width: 14px;
            height: 14px;
            background: rgba(255, 255, 255, 0.2);
            cursor: pointer;
        }

        #JALF input[type="checkbox"]:checked + label:before {
            content: "✔";
            text-align: center;
        }

        #JALF .last {
            margin: 0px !important;
        }`;
        document.head.append(s);
    }

    async function injectFilters() {
        const div = newElement("div", {id: "JALF"});

        const h2 = newElement("h2", null, "Filter");
        div.append(h2);

        const input = newElement("input", {type: "text", id: "JALF-Search", placeholder: "Search...", value: await GM.getValue("search") || ""});
        input.addEventListener("input", filter);
        div.append(input);

        const br = newElement("br");
        div.append(br);

        const check1 = newElement("input", {type: "checkbox", id: "JALF-ChannelOnly", checked: await GM.getValue("isChannelOnly") ? true : undefined});
        check1.addEventListener("change", filter);
        div.append(check1);

        const label1 = newElement("label", {for: "JALF-ChannelOnly"}, "Search Channels only");
        div.append(label1);

        const check2 = newElement("input", {type: "checkbox", id: "JALF-Plus", checked: await GM.getValue("isPlus") ? true : undefined});
        check2.addEventListener("change", filter);
        div.append(check2);

        const label2 = newElement("label", {for: "JALF-Plus"}, "Show Plus Channels");
        div.append(label2);

        const check3 = newElement("input", {type: "checkbox", id: "JALF-VOD", checked: await GM.getValue("isVOD") ? true : undefined});
        check3.addEventListener("change", filter);
        div.append(check3);

        const label3 = newElement("label", {for: "JALF-VOD"}, "Show VOD Channels");
        div.append(label3);

        const check4 = newElement("input", {type: "checkbox", id: "JALF-SD", checked: await GM.getValue("isSD") || await GM.getValue("isSD") == undefined ? true : undefined});
        check4.addEventListener("change", filter);
        div.append(check4);

        const label4 = newElement("label", {for: "JALF-SD", class: "last"}, "Show SD Channels");
        div.append(label4);

        document.querySelector("header").append(div);
    }

    function filter() {
        const [search, isChannelOnly, isPlus, isVOD, isSD] = [document.querySelector("#JALF-Search").value, document.querySelector("#JALF-ChannelOnly").checked, document.querySelector("#JALF-Plus").checked, document.querySelector("#JALF-VOD").checked, document.querySelector("#JALF-SD").checked];
        GM.setValue("search", search);
        GM.setValue("isChannelOnly", isChannelOnly);
        GM.setValue("isPlus", isPlus);
        GM.setValue("isVOD", isVOD);
        GM.setValue("isSD", isSD);

        for (const child of document.querySelector("article div ol").children) {
            const foundChannel = child.querySelector("img").alt.toLowerCase().includes(search.toLowerCase());
            const foundProgramm = [...child.querySelectorAll("h6")].find(item => item.textContent.toLowerCase().includes(search.toLowerCase()));
            const foundPlus = child.querySelector("header").firstChild.tagName == "svg";
            const foundVOD = child.querySelector("header").children[1]?.tagName == "svg" && child.querySelector("header").children[1]?.children.length > 1;
            const foundHD = child.querySelector("header").lastChild.tagName == "svg" && child.querySelector("header").lastChild.children.length == 1;

            if (
                ((isChannelOnly && foundChannel) || (!isChannelOnly && (foundChannel || foundProgramm))) &&
                ((isPlus) || (!isPlus && !foundPlus)) &&
                ((isVOD) || (!isVOD && !foundVOD)) &&
                ((isSD) || (!isSD && foundHD))
            ) {
                child.style.display = "flex";
            } else {
                child.style.display = "none";
            }
        }
    }

    async function backInit() {
        if (! window.location.href.startsWith("https://www.joyn.de/play/live-tv") || ! document.querySelector("article")) {
            return init();
        }

        await new Promise(r => setTimeout(r, 500));
        return backInit();
    }

    async function init() {
        if (! window.location.href.startsWith("https://www.joyn.de/play/live-tv") || ! document.querySelector("article")) {
            await new Promise(r => setTimeout(r, 500));
            return init();
        }

        injectStyling();

        const observer = new MutationObserver(async (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.addedNodes[0]?.tagName != "ASIDE") {
                    continue;
                }

                injectFilters();
                await new Promise(r => setTimeout(r, 50));
                [...document.querySelector("article div ol").querySelectorAll("h6")].forEach(item => item.parentNode.setAttribute("title", item.innerText));
                filter();
                document.querySelector("article div ol").scrollTop = 0;
                break;
            }
        });
        observer.observe(document.querySelector("article"), { childList: true });
        backInit();
    }

    init();
})();