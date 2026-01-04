// ==UserScript==
// @name         Wikipedia Artikel Generator
// @version      1.6.6
// @description  Erstellt Grundgerüste für Wikipedia-Artikel von Personen aus Wikidata-Daten
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Wikipedia%20Artikel%20Generator]%20
// @match        https://de.wikipedia.org/w/index.php?title=*&action=edit*
// @match        https://de.wikipedia.org/wiki/*?action=edit*
// @connect      wikidata.org
// @connect      www.imdb.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=de.wikipedia.org
// @grant        GM.xmlHttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430516/Wikipedia%20Artikel%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/430516/Wikipedia%20Artikel%20Generator.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* globals mw */

(async()=>{
    "use strict";
    if (mw.config.get("wgAction") != "edit" || mw.config.get("wgArticleId") != 0 || mw.config.get("wgNamespaceNumber") != 0){
        return;
    }
    var wikiText = "";
    var checkboxesSet = false;
    var wikidataId = await getWikidataIdFromPrompt();
    $("#wpTextbox1").textSelection("setContents", "Lädt ...");
    let wikiItem = (await getEntitiesFromIds(wikidataId,"sitelinks|claims|labels|aliases|descriptions"))[0];
    wikiText = await getArticleFromSPARQL(wikidataId);
    wikiText = wikiText.replace(/\n\n\n+/g,"\n\n").replace(/  +/g," ");
    $("#wpTextbox1").textSelection("setContents", wikiText);

    //Filmografie
    let isFemale = false;
    let surname = "";
    let creditList = [];
    let filmography = [];
    let filmographyText = "";
    let filmographyStart = wikiText.indexOf("== Filmografie ==");
    let filmographyEnd = filmographyStart + 26;
    let imdbid = getPropertyFromItem(wikiItem,"P345");
    if (imdbid != "")
    {
        var syntaxButton = document.querySelector("#mw-editbutton-codemirror>a[aria-pressed='false']");
        syntaxButton?.click();
        isFemale = getPropertyFromItem(wikiItem,"P21").id == "Q6581072";
        surname = getPropFromItem(wikiItem,"labels").split(" ").pop();
        filmographyText = await ladeFilmografie(imdbid, !isFemale);
        unsafeWindow.checkboxes = function(index = -1){
            setTimeout(()=>{
                if (index != -1){
                    if (creditList.includes(index)){
                        creditList = creditList.filter(c => c != index);
                    } else {
                        creditList.push(index);
                    }
                    reloadCareerText();
                }
                var filmographyLineNumber = wikiText.substring(0, filmographyStart).split("\n").length + (creditList.length == 0 ? 0 : 2);
                var lines = [...document.querySelectorAll(".cm-lineNumbers .cm-gutterElement:not(:first-child)")];
                if (!checkboxesSet){
                    checkboxesSet = true;
                    lines.slice(filmographyLineNumber,filmography.length + filmographyLineNumber)
                        .forEach(c => {c.innerHTML = "<input type='checkbox' onclick='checkboxes(" + Number(c.innerHTML - filmographyLineNumber - 1) + ")'/>"});
                }
                creditList.forEach(i => {lines[filmographyLineNumber + i].querySelector("input").checked = true});
            },100);
        };
        unsafeWindow.checkboxes(-1);
        $("#wpTextbox1").textSelection("setSelection", {start: filmographyStart, end: filmographyEnd});
        $("#wpTextbox1").textSelection("replaceSelection", filmographyText);
        filmographyEnd = filmographyStart;
        reloadCareerText(true);

        var elem = document.querySelector(".group-insert");
        var span = document.createElement("span");
        span.innerHTML = '<span class="tool oo-ui-buttonElement oo-ui-buttonElement-frameless oo-ui-iconElement"><a class="oo-ui-buttonElement-button" title="Karriere-Text neu generieren" tabindex="0"><span class="oo-ui-iconElement-icon oo-ui-icon-reload"></span></a></span>';
        elem.appendChild(span);
        span.addEventListener("click", () => reloadCareerText(false));
    } else {
        $("#wpTextbox1").textSelection("setSelection", {start: filmographyStart - 2, end: filmographyEnd});
        $("#wpTextbox1").textSelection("replaceSelection", "");
    }
    if (wikiText == ""){
        wikiText = "Fehler bei Artikelgenerierung.\nDas Script befindet sich derzeit in Entwicklung.\nZurzeit werden Biografien unterstützt, vor allem bei Schauspielerbiografien werden gute Ergebnisse erzielt.";
        $("#wpTextbox1").textSelection("setContents", wikiText);
    }

    function reloadCareerText(firstReload = false){
        filmographyText = getCareerText(filmography,isFemale,surname,firstReload);
        filmographyText += filmographyText.length != 0 ? "\n\n" : "";
        $("#wpTextbox1").textSelection("setSelection", {start: filmographyStart, end: filmographyEnd});
        $("#wpTextbox1").textSelection("replaceSelection", filmographyText);
        filmographyEnd = filmographyStart + filmographyText.length;
    }

    function getCareerText(filmography, isFemale, surname, firstReload = false){
        filmography.forEach(i => {i.type = (i.type == "" ? "Film" : i.type)});
        let careerText = "";
        let careerTemplates = [
            {"id": 0, get text() {return `${(isFemale ? "Ihr" : "Sein")} Debüt als Schauspieler${(isFemale ? "in" : "")} hatte ${(useName ? surname : isFemale ? "sie" : "er")} ${yearText} in der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": true, "debuttype": false, "multiple": false, "type": "serie"},
            {"id": 1, get text() {return `${(isFemale ? "Ihren" : "Seinen")} ersten Auftritt absolvierte ${(useName ? surname : isFemale ? "sie" : "er")} ${yearText} in ${getEpisodeNumberText(credit.numberOfEpisodes)} der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": true, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 2, get text() {return `${(useName ? (surname + "s").replace(/ss$/,"s") : isFemale ? "Ihr" : "Sein")} erster Auftritt in einer ${credit.type} war ${yearText} in ''${credit.getTitlePart()}''.`}, "debut": true, "debuttype": true, "multiple": false, "type": "serie"},
            {"id": 2, get text() {return `${(useName ? (surname + "s").replace(/ss$/,"s") : isFemale ? "Ihr" : "Sein")} erster Auftritt in einem ${credit.type} war ${yearText} in ''${credit.getTitlePart()}''.`}, "debut": true, "debuttype": true, "multiple": false, "type": "film"},
            {"id": 3, get text() {return `${(useName ? (surname + "s").replace(/ss$/,"s") : isFemale ? "Ihre" : "Seine")} erste wiederkehrende Rolle hatte ${(isFemale ? "sie" : "er")} ${yearText} in der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": true, "multiple": true, "type": "serie"},
            {"id": 4, get text() {return `${(useName ? surname : isFemale ? "Sie" : "Er")} hatte ${yearText} mit einem Gastauftritt in der ${credit.type} ''${credit.getTitlePart()}'' ${(isFemale ? "ihr" : "sein")} Fernsehdebüt.`}, "debut": true, "debuttype": true, "multiple": false, "type": "serie"},
            {"id": 5, get text() {return `${(useName ? surname : isFemale ? "Sie" : "Er")} machte ${(isFemale ? "ihr" : "sein")} Fernsehdebüt ${yearText} in ${getEpisodeNumberText(credit.numberOfEpisodes)} der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": true, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 6, get text() {return `${(useName ? surname : isFemale ? "Sie" : "Er")} spielte ${yearText} in der ${credit.type} ''${credit.getTitlePart()}'' ${(debuttype ? "erstmals " : "")}einen größeren Handlungsbogen${(credit.role ? " als " + credit.role : "")}.`}, "debut": false, "debuttype": null, "multiple": true, "type": "serie"},
            {"id": 7, get text() {return `${(useName ? surname : isFemale ? "Sie" : "Er")} war ${yearText} in der ${credit.type} ''${credit.getTitlePart()}'' zu sehen.`}, "debut": false, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 8, get text() {return `${yearText} erhielt ${(useName ? surname : isFemale ? "sie" : "er")} ${(isFemale ? "ihre" : "seine")} erste ${(credit.numberOfEpisodes > 1 ? "wiederkehrende " : "")}Rolle in der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": true, "multiple": null, "type": "serie"},
            {"id": 9, get text() {return `${yearText} erhielt ${(useName ? surname : isFemale ? "sie" : "er")} eine Rolle in der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": false, "multiple": false, "type": "serie"},
            {"id": 10, get text() {return `${yearText} erhielt ${(useName ? surname : isFemale ? "sie" : "er")} in der ${credit.type} ''${credit.getTitlePart()}'' ${(debuttype ? "erstmals " : "")}eine wiederkehrende Rolle${(credit.role ? " als " + credit.role : "")}.`}, "debut": false, "debuttype": null, "multiple": true, "type": "serie"},
            {"id": 11, get text() {return `${yearText} erschien ${(useName ? surname : isFemale ? "sie" : "er")} in ${getEpisodeNumberText(credit.numberOfEpisodes)} der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 12, get text() {return `${yearText} folgte ${(useName ? surname : isFemale ? "ihr" : "sein")} Spielfilmdebüt in dem ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": true, "multiple": false, "type": "film"},
            {"id": 13, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} ${(isFemale ? "ihre" : "seine")} erste ${(credit.numberOfEpisodes > 1 ? "wiederkehrende " : "")}Rolle in der ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": null, "debuttype": true, "multiple": null, "type": "serie"},
            {"id": 13, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} ${(isFemale ? "ihre" : "seine")} erste Filmrolle in ''${credit.getTitlePart()}''.`}, "debut": null, "debuttype": true, "multiple": false, "type": "film"},
            {"id": 14, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} bei dem ${credit.type} ''${credit.getTitlePart()}'' ${debut ? "erstmals " : ""}eine Rolle inne.`}, "debut": null, "debuttype": false, "multiple": false, "type": "film"},
            {"id": 15, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} in ${getEpisodeNumberText(credit.numberOfEpisodes)} der ${credit.type} ''${credit.getTitlePart()}'' eine Rolle inne.`}, "debut": false, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 16, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} in dem ${credit.type} ''${credit.getTitlePart()}'' ${debut ? (isFemale ? "ihren " : "seinen ") + "ersten" : "einen"} Auftritt.`}, "debut": null, "debuttype": false, "multiple": false, "type": "film"},
            {"id": 16, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} in der ${credit.type} ''${credit.getTitlePart()}'' ${(isFemale ? "ihren" : "seinen")} ersten Fernsehauftritt.`}, "debut": true, "debuttype": true, "multiple": false, "type": "serie"},
            {"id": 17, get text() {return `${yearText} hatte ${(useName ? surname : isFemale ? "sie" : "er")} mit ${getEpisodeNumberText(credit.numberOfEpisodes)} in der ${credit.type} ''${credit.getTitlePart()}'' ${(isFemale ? "ihr" : "sein")} Fernsehdebüt.`}, "debut": true, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 18, get text() {return `${yearText} spielte ${(useName ? surname : isFemale ? "sie" : "er")} eine Rolle in dem ${credit.type} ''${credit.getTitlePart()}''.`}, "debut": false, "debuttype": false, "multiple": false, "type": "film"},
            {"id": 19, get text() {return `${yearText} spielte ${(useName ? surname : isFemale ? "sie" : "er")} in der ${credit.type} ''${credit.getTitlePart()}'' mit.`}, "debut": false, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 20, get text() {return `${yearText} stand ${(useName ? surname : isFemale ? "sie" : "er")} in der ${credit.type} ''${credit.getTitlePart()}'' ${(debut || debuttype ? "erstmals " : "")}für das Fernsehen vor der Kamera.`}, "debut": null, "debuttype": null, "multiple": false, "type": "serie"},
            {"id": 21, get text() {return `${yearText} war ${(useName ? surname : isFemale ? "sie" : "er")} in ${getEpisodeNumberText(credit.numberOfEpisodes)} der ${credit.type} ''${credit.getTitlePart()}'' ${(debut ? "erstmals " : "")}im Fernsehen zu sehen.`}, "debut": null, "debuttype": false, "multiple": null, "type": "serie"},
            {"id": 22, get text() {return `${yearText} war ${(useName ? surname : isFemale ? "sie" : "er")} in der ${credit.type} ''${credit.getTitlePart()}'' zu sehen.`}, "debut": false, "debuttype": false, "multiple": true, "type": "serie"},
            {"id": 23, get text() {return `In der ${credit.type} ''${credit.getTitlePart()}'' hatte ${(useName ? surname : isFemale ? "sie" : "er")} ${yearText} in ${getEpisodeNumberText(credit.numberOfEpisodes)} ${(debuttype ? "erstmals " : "")}eine wiederkehrende Rolle${(credit.role ? " als " + credit.role : "")}.`}, "debut": false, "debuttype": null, "multiple": true, "type": "serie"},
            {"id": 24, get text() {return `In der ${credit.type} ''${credit.getTitlePart()}'' spielte ${(useName ? surname : isFemale ? "sie" : "er")} ${yearText} in ${getEpisodeNumberText(credit.numberOfEpisodes)} ${(debuttype ? "erstmals " : "")}eine durchgehende Rolle${(credit.role ? " als " + credit.role : "")}.`}, "debut": false, "debuttype": null, "multiple": true, "type": "serie"},
        ];

        let credit = {};
        let yearText = "";
        let useName = true;
        let debut = true;
        let debuttype = false;

        if (firstReload){
            //debut
            creditList.push(0);

            //debut other type
            let type = filmography[0].type.toLowerCase().endsWith("film") ? "film" : "serie";
            let cIndex = filmography.findIndex(i => !(i.type.toLowerCase().includes(type)));
            if (cIndex != -1){
                creditList.push(cIndex);
            }

            //debut multiple episodes
            cIndex = filmography.findIndex(i => i.numberOfEpisodes > 1);
            if (cIndex != -1){
                creditList.push(cIndex);
            }

            //most episodes
            cIndex = filmography.reduce((maxIndex, current, curIndex, array) => (current.numberOfEpisodes > array[maxIndex].numberOfEpisodes) ? curIndex : maxIndex, 0);
            creditList.push(cIndex);
        }

        //generate text from credits
        creditList = [...new Set(creditList.sort((a,b) => a - b))]; //remove duplicates, sort by index
        creditList.forEach((creditIndex, index) => {
            credit = filmography[creditIndex];
            yearText = credit.yearFrom;
            if (credit.yearFrom != credit.yearTo && credit.yearTo != 0){
                yearText += ` bis ${credit.yearTo}`;
            }
            useName = !(index % 3);
            debut = creditIndex == 0;
            debuttype = !debut && (filmography.find(i => i.type.toLowerCase().endsWith(credit.type.toLowerCase().endsWith("film") ? "film" : "serie")) == credit || filmography.find(i => i.numberOfEpisodes > 1) == credit);
            let possibleCreditTexts = careerTemplates.filter(i => (i.debut == debut || i.debut == null)
                                                             && (i.debuttype == debuttype || i.debuttype == null)
                                                             && credit.type.toLowerCase().includes(i.type)
                                                             && (credit.numberOfEpisodes > 1 == i.multiple || i.multiple == null));
            var creditText = possibleCreditTexts[Math.floor(Math.random() * possibleCreditTexts.length)];
            careerText += creditText.text + " ";
        });
        return careerText.trim();
    }

    function getEpisodeNumberText(number){
        var result;
        switch(number){
            case 1:
                return "einer Folge";
            case 2:
                result = "zwei";
                break;
            case 3:
                result = "drei";
                break;
            case 4:
                result = "vier";
                break;
            case 5:
                result = "fünf";
                break;
            case 6:
                result = "sechs";
                break;
            case 7:
                result = "sieben";
                break;
            case 8:
                result = "acht";
                break;
            case 9:
                result = "neun";
                break;
            case 10:
                result = "zehn";
                break;
            case 11:
                result = "elf";
                break;
            case 12:
                result = "zwölf";
                break;
            default:
                result = number.toString();
        }
        return result + " Folgen";
    }

    function getPropFromItem(wikiItem,property){
        return wikiItem[property].de.value;
    }

    function getPropertyFromItem(wikiItem,property){
        let claims = wikiItem.claims[property];
        if (claims == undefined)
        {
            return "";
        }
        else if (claims.length == 1)
        {
            return claims[0].mainsnak.datavalue.value;
        }
        else
        {
            //only for id?
            return claims.map(i=>i.mainsnak.datavalue.value.id).join("|");
        }
    }

    async function getWikidataIdFromPrompt(){
        let articleTitle = mw.config.get("wgTitle");
        let searchRequest = await GM.xmlHttpRequest({
            method: "GET",
            url: "https://www.wikidata.org/w/api.php?action=query&format=json&list=search&srlimit=5&srsearch=" + articleTitle,
            onload: function(response) {
                return response;
            }
        });
        let searchItem = JSON.parse(searchRequest.responseText);
        let ids = searchItem.query.search.map(i => i.title).join("|");
        let promptText = "";
        let filteredDescriptionItems = [];
        if (ids != ""){
            let descriptionRequest = await GM.xmlHttpRequest({
                method: "GET",
                url: "https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=sitelinks|labels|descriptions&languages=de&sitefilter=dewiki&languagefallback=true&ids=" + ids,
                onload: function(response) {
                    return response;
                }
            });
            let descriptionItems = JSON.parse(descriptionRequest.responseText);
            filteredDescriptionItems = Object.values(descriptionItems.entities).filter(i => Object.values(i.sitelinks).length != 1);
            promptText = "Wähle den passenden Eintrag:\n";
            promptText += filteredDescriptionItems.map((i,e) => (Number(e + 1) + ": " + (Object.keys(i.labels).length == 0 ? "Unbekannt" : i.labels.de.value) + " (" + (i.descriptions.de?.value ?? "") + ")").replace("((","(").replace("))",")").replace(" ()","")).join("\n");
            promptText += "\n\nAlternativ kann ein Wikidata-Bezeichner (Q…) direkt angegeben werden.";
        } else {
            promptText = "Kein passender Eintrag auf Wikidata gefunden.\nBitte gib den Wikidata-Bezeichner (Q…) direkt an:";
        }
        let id = prompt(promptText, filteredDescriptionItems.length == 1 ? "1" : "");
        if (id.startsWith("Q")){
            return id;
        }
        return filteredDescriptionItems[id - 1].id;
    }

    async function getEntitiesFromIds(ids,props){
        let wikidataRequest = await GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.wikidata.org/w/api.php?action=wbgetentities&format=json&props=${props}&languages=de&languagefallback=true&sitefilter=dewiki&ids=${ids}`,
            onload: function(response) {
                return response;
            }
        });
        let item = JSON.parse(wikidataRequest.responseText);
        let results = Object.values(item.entities);
        if (results.length == 0){
            return "";
        } else {
            return results;
        }
    }

    async function ladeFilmografie(imdbId, isMale){
        var showShort = true;
        var episodeLabel = "Folge";
        var showAlert = false;
        var sha256 = {
            loadActor: "ea0a755edec9c6292437b817e9a91e81e98262e85afd49bc1d5c7a0a498cf39b",
            loadActress: "f0aa46008175b841ba1364b1828ab30fcf4d989f4c617e196375fa29c81d3ace",
            loadEpisodeActor: "92997ef1786794b3340a89a6fb1a01bd29233c36c414df2bbee3c9cb6cb2de09",
            loadEpisodeActress: "16cb70dca5f908eb5e474305045f4e440a6d3b61913ecf53e78b1e6275e67772"
        };
        var request = 0;
        var done = 0;

        var resp = await GM.xmlHttpRequest({
            url: `https://caching.graphql.imdb.com/?operationName=NameMainFilmographyPaginatedCredits&variables={"after":"${btoa("nm0000001/tt0000001/actor")}","id":"${imdbId}","includeUserRating":false,"locale":"en-US"}&extensions={"persistedQuery":{"sha256Hash":"${(isMale ? sha256.loadActor : sha256.loadActress)}","version":1}}`,
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-imdb-user-country": "DE"
            },
            onload: function(response) {
                return response;
            }
        });
        var workObj = JSON.parse(resp.responseText);
        var work = workObj.data.name[(isMale ? "actor_credits" : "actress_credits")].edges.map(i => i.node);
        for(var w of work){
            var credit = new Credit();
            credit.yearFrom = w.episodeCredits.yearRange?.year ?? w.title.releaseYear?.year;
            if (!credit.yearFrom){
                continue;
            }
            credit.yearTo = w.episodeCredits.yearRange ? w.episodeCredits.yearRange.endYear ?? 0 : 0;
            credit.dt = w.title.titleText.text.replace(" - ", " – ").replace("...", "…");
            credit.ot = w.title.originalTitleText.text.replace(" - ", " – ").replace("...", "…");
            var creditType = w.title.titleType.text;
            if (creditType == "Video Game"){
                continue;
            }
            if (creditType == "Video" && w.title.titleGenres.genres.some(i => i.genre.text == "Short")){
                creditType = "Kurzfilm";
            }
            credit.type = creditType
                .replace(/Documentary short/, "Dokumentar-Kurzfilm")
                .replace(/(TV Movie d|D)ocumentary/, "Dokumentarfilm")
                .replace(/TV Series short/, "Webserie")
                .replace(/TV Series( documentary)?/, "Fernsehserie")
                .replace(/TV Mini Series( documentary)?/, "Miniserie")
                .replace(/TV Movie/, "Fernsehfilm")
                .replace(/(Video s|TV S|TV Mini Series s|S)hort/, "Kurzfilm")
                .replace(/(Movie|Music Video|Video)/, "");
            if (!showShort && credit.type.includes("Kurzfilm")){
                continue;
            }
            credit.imdbid = w.title.id;
            credit.voice = w.attributes?.[0].text == "voice";
            credit.role = w.characters?.[0].name;
            filmography.push(credit);
            if (credit.type.includes("serie")){
                getDataFromIMDb(credit.imdbid, "");
            }
        }

        filmography = filmography.reverse().sort((a,b) => {
            return a.yearFrom - b.yearFrom;
        });

        function getDataFromIMDb(titleId, page){
            request++;
            GM.xmlHttpRequest({
                method: "GET",
                url: `https://caching.graphql.imdb.com/?operationName=EpisodeBottomSheetCast&variables={"after":"${page}","episodeCreditsFilter":{},"locale":"de-DE","nameId":"${imdbId}","titleId":"${titleId}"}&extensions={"persistedQuery":{"sha256Hash":"${(isMale ? sha256.loadEpisodeActor : sha256.loadEpisodeActress)}","version":1}}`,
                headers: {
                    "Content-Type": "application/json",
                    "x-imdb-user-country": "DE"
                },
                onload: function(response){
                    done++;
                    var respText = response.responseText;
                    if (respText.length > 0){
                        var jsonObj = JSON.parse(respText);
                        var credit = filmography.find(c => {
                            return c.imdbid == titleId;
                        });
                        var ep = jsonObj.data.name.credits.edges[0]?.node;
                        if (credit && ep){
                            credit.numberOfEpisodes += ep.episodeCredits.edges.filter(i => i.node.attributes?.[0]?.text != "credit only").length;
                            if (ep.episodeCredits.pageInfo.hasNextPage){
                                getDataFromIMDb(titleId, ep.episodeCredits.pageInfo.endCursor);
                            }
                            if (credit.numberOfEpisodes == 1){
                                var epCredit = ep.episodeCredits.edges[0].node.title;
                                credit.episodeid = epCredit.id;
                                if (epCredit.series.displayableEpisodeNumber.episodeNumber.text != "unknown"){
                                    credit.episodeName = (epCredit.series.displayableEpisodeNumber.displayableSeason.text + "x" + epCredit.series.displayableEpisodeNumber.episodeNumber.text).replace(/x(\d)$/,"x0$1");
                                }
                            } else {
                                credit.episodeName = "";
                            }
                        }
                    }
                },
                onerror: function(response){
                    done++;
                    console.error("Error in fetching contents: " + response.responseText);
                }
            });
        }

        async function getDataFromWikidata(){
            request++;
            var imdbIds = filmography.flatMap(i => [i.episodeid, i.imdbid]).filter(i => i).join('" "');
            var sparqlQuery = `SELECT ?imdb ?dt (SAMPLE(?ot) AS ?ot) ?dewiki WHERE {
                VALUES ?imdb { "${imdbIds}" }
                ?item wdt:P345 ?imdb.
                OPTIONAL {
                    ?item rdfs:label ?dt.
                    FILTER((LANG(?dt)) = "de")
                }
                OPTIONAL {
                    ?item wdt:P1476 ?ot.
                }
                OPTIONAL {
                    ?dewiki schema:about ?item;
                            schema:isPartOf <https://de.wikipedia.org/>.
                }
            }
            GROUP BY ?imdb ?dt ?dewiki`;
            var resp = await fetch("https://query-main.wikidata.org/sparql?format=json", {
                "headers": {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                "body": "query=" + encodeURIComponent(sparqlQuery),
                "method": "POST",
                "mode": "cors"
            });
            var jsonObj = await resp.json();
            jsonObj.results.bindings.forEach(i => {
                var credit = filmography.find(c => c.imdbid == i.imdb.value);
                i.dewiki = i.dewiki ? decodeURIComponent(i.dewiki.value).slice(30).replace(/_/g," ") : "";
                if (credit){
                    credit.link = i.dewiki;
                    credit.dt = i.dt?.value || credit.dt;
                    credit.ot = i.ot?.value.replace(/'/g, "’") || credit.ot;
                }
                var episodeCredit = filmography.find(c => c.episodeid == i.imdb.value);
                if (episodeCredit){
                    if (i.dewiki){
                        var article = i.dewiki;
                        if (article.slice(-1) == ")"){
                            article += `|${article.split(" (")[0]}`;
                        }
                        episodeCredit.episodeName += ` ''[[${article}]]''`;
                    } else if (i.dt){
                        episodeCredit.episodeName += ` ''${i.dt?.value}''`;
                    }
                }
            });
            done++;
        }

        function Credit(){
            this.numberOfEpisodes = 0;
            this.episodeid = "";
            this.formatTitle = function(title = ""){
                return title.replace(/[-–:., \d’'!]/g, "").toLowerCase();
            };
            this.compareTitles = function(titleA,titleB){
                return this.formatTitle(titleA) == this.formatTitle(titleB);
            };
            this.getYearPart = function(){
                var currentYear = new Date().getFullYear();
                if (this.type.includes("serie") && this.numberOfEpisodes > 1 && (this.yearFrom == currentYear || (this.yearTo && this.yearTo == currentYear))){
                    return `seit ${this.yearFrom}`;
                }
                if (!this.yearTo || this.yearTo == this.yearFrom){
                    return this.yearFrom;
                }
                if (this.numberOfEpisodes == 2 && parseInt(this.yearFrom) + 1 != this.yearTo){
                    return `${this.yearFrom}, ${this.yearTo}`;
                }
                return `${this.yearFrom}–${this.yearTo}`;
            };
            this.getTitlePart = function(){
                if (!this.link){
                    return this.dt;
                }
                if (this.link.slice(-1) == ")"){
                    this.dt = this.link.split(" (")[0];
                    return `[[${this.link}|${this.dt}]]`;
                }
                this.dt = this.link;
                return `[[${this.link}]]`;
            };
            this.getDescriptionPart = function(){
                if (!this.compareTitles(this.ot, this.dt) && !this.type && !this.voice){
                    return ` ''(${this.ot})''`;
                }
                var descriptionPart = "";
                if (!this.compareTitles(this.ot, this.dt)){
                    descriptionPart += ` (''${this.ot}''`;
                }
                if (this.type){
                    descriptionPart += (descriptionPart ? ", " : " (") + this.type;
                }
                if (!`${this.getYearPart()}`.startsWith("seit")){
                    if (this.numberOfEpisodes > 1){
                        descriptionPart += `, ${this.numberOfEpisodes} ${episodeLabel}n`;
                    } else if (this.numberOfEpisodes && this.episodeName){
                        descriptionPart += `, ${episodeLabel} ${this.episodeName}`;
                    } else if (this.numberOfEpisodes){
                        descriptionPart += `, eine ${episodeLabel}`;
                    }
                }
                if (this.voice){
                    if (this.role){
                        descriptionPart += (descriptionPart ? ", " : " (") + "Stimme von ''" + this.role.split(" (")[0] + "''";
                    } else {
                        descriptionPart += (descriptionPart ? ", " : " (") + "Sprechrolle";
                    }
                }
                descriptionPart += descriptionPart ? ")" : "";
                return descriptionPart;
            };
            this.toString = function(){
                return `\n* ${this.getYearPart()}: ${this.getTitlePart()}${this.getDescriptionPart()}`;
            };
        }
        return new Promise(resolve => {
            var checkIfCompleted = setInterval(async () => {
                if ((done / request) != 1){
                    console.log("requests:",done,"/",request);
                } else if (request != 0) {
                    await getDataFromWikidata();
                    var formattedFilmography = "== Filmografie ==";
                    filmography.forEach(entry => {
                        formattedFilmography += entry.toString();
                    });
                    var successMessage = "Filmografie wurde erfolgreich erstellt.";
                    if (showAlert){
                        alert(successMessage);
                    } else {
                        console.log(successMessage);
                    }
                    clearInterval(checkIfCompleted);
                    resolve(formattedFilmography);
                }
            }, 1000);
        });
    }

    async function getArticleFromSPARQL(wikidataId){
        var personSparqlRequest = `SELECT DISTINCT ?source WHERE {
  #lade Person
  BIND(wd:${wikidataId} AS ?item)
  #Name/Label
  OPTIONAL {
    ?item rdfs:label ?name.
    FILTER((LANG(?name)) = "de")
  }
  #Alternativnamen
  OPTIONAL {
    SELECT ?item (GROUP_CONCAT(DISTINCT ?aliasText; SEPARATOR = "; ") AS ?alias) WHERE {
      ?item skos:altLabel ?aliasDe.
      FILTER((LANG(?aliasDe)) = "de")
      BIND(COALESCE(REPLACE(?aliasDe, "(.*) (.*)", "$2, $1"), "") AS ?aliasText)
    }
    GROUP BY ?item
  }
  #Name/enLabel
  OPTIONAL {
    ?item rdfs:label ?nameEn.
    FILTER((LANG(?nameEn)) = "en")
  }
  #falls kein deutsches Label, nutze englisches
  BIND(COALESCE(?name, ?nameEn) AS ?name)
  #beschreibung
  OPTIONAL {
    ?item schema:description ?description.
    FILTER((LANG(?description)) = "de")
  }
  #Geschlecht
  ?item wdt:P21 ?sx.
  #Bild
  OPTIONAL { ?item wdt:P18 ?image. }
  #Dateiname, Dateibeschreibung inklusive Jahr
  BIND(COALESCE(CONCAT("[[Datei:", REPLACE(wikibase:decodeUri(STR(?image)), ".*/", ""), "|mini|", ?name, IF(REGEX(wikibase:decodeUri(STR(?image)), "[1-2]\\d\\d\\d"), CONCAT(" (", REPLACE(wikibase:decodeUri(STR(?image)), ".*?([1-2]\\d\\d\\d).*", "$1"), ")"), ""), "]]\\n"), "") AS ?imagePart)
  #Commons-Link
  OPTIONAL { ?item wdt:P373 ?commons. }
  BIND(COALESCE(CONCAT("{{Commonscat", IF(?commons = (STR(?name)), "", CONCAT("|", ?commons, "|", ?name)), "}}\\n"), "") AS ?commonscat)
  #IMDb
  OPTIONAL { ?item wdt:P345 ?imdb. }
  #bekannt für
  OPTIONAL {
    SELECT ?item (GROUP_CONCAT(DISTINCT ?knownText; SEPARATOR = "° ") AS ?knowns) WHERE {
      ?item wdt:P800 ?known.
      ?known rdfs:label ?knownDe.
      FILTER((LANG(?knownDe)) = "de")
      #Wikilink
      OPTIONAL {
        _:t1 schema:about ?known;
             schema:isPartOf <https://de.wikipedia.org/>;
             schema:name ?knownWP.
      }
      BIND(COALESCE(CONCAT("''[[", ?knownWP, IF(?knownWP = ?knownDe, "", CONCAT("|", ?knownDe)), "]]''"), ?knownDe) AS ?knownText)
    }
    GROUP BY ?item
  }
  #Land
  OPTIONAL {
    SELECT ?item (CONCAT(GROUP_CONCAT(DISTINCT ?citizenWP; SEPARATOR = "° ")," ") AS ?citizens) (GROUP_CONCAT(DISTINCT ?countryCatText; SEPARATOR = " ") AS ?countryCats) WHERE {
      ?item wdt:P27 ?country.
      ?country wdt:P1792 _:t2.
      _:t2 rdfs:label ?countryCat.
      FILTER((LANG(?countryCat)) = "de")
      BIND(COALESCE(CONCAT("\\n[[", ?countryCat, "]]"), "") AS ?countryCatText)
      OPTIONAL {
        ?item wdt:P21 ?sx.
        ?citizen p:P31 _:t3.
        _:t3 ps:P31 wd:Q33829;
             pq:P642 ?country.
        ?citizen rdfs:label ?citizenDe.
        FILTER((LANG(?citizenDe)) = "de")
        BIND(CONCAT(REPLACE(REPLACE(REPLACE(REPLACE(LCASE(?citizenDe), "(.*)..", "$1ische"), "^us-", "US-"), "iische$", "ische"), "scische$", "sche"), IF(?sx = wd:Q6581097, "r", "")) AS ?citizenText)
        OPTIONAL {
          _:t4 schema:about ?country;
               schema:isPartOf <https://de.wikipedia.org/>;
               schema:name ?countryWP.
        }
        BIND(CONCAT("[[", ?countryWP, "|", ?citizenText, "]]") AS ?citizenWP)
      }
    }
    GROUP BY ?item
  }
  #Geburtsort
  OPTIONAL {
    ?item wdt:P19 ?bPlace.
    ?bPlace rdfs:label ?bPlaceDe.
    FILTER((LANG(?bPlaceDe)) = "de")
    OPTIONAL {
      _:t5 schema:about ?bPlace;
           schema:isPartOf <https://de.wikipedia.org/>;
           schema:name ?bPlaceWP.
    }
    BIND(COALESCE(CONCAT("[[", IF(?bPlaceWP = ?bPlaceDe, ?bPlaceWP, CONCAT(?bPlaceWP, "|", ?bPlaceDe)), "]]"), ?bPlaceDe) AS ?bPlaceText)
    OPTIONAL {
      ?bPlace (wdt:P131+) ?bState.
      ?bState wdt:P31 wd:Q35657;
              rdfs:label ?bStateDe.
      FILTER((LANG(?bStateDe)) = "de")
      OPTIONAL {
        _:t6 schema:about ?bState;
             schema:isPartOf <https://de.wikipedia.org/>;
             schema:name ?bStateWP.
      }
      BIND(COALESCE(CONCAT("[[", IF(?bStateWP = ?bStateDe, ?bStateWP, CONCAT(?bStateWP, "|", ?bStateDe)), "]]"), ?bStateDe) AS ?bStateText)
    }
  }
  #Helfer Geburtsdatum
  OPTIONAL {
    ?item wdt:P569 ?bDate.
    BIND(MONTH(?bDate) AS ?bM)
    VALUES (?bM ?bMonth) {
      (1  "Januar")
      (2  "Februar")
      (3  "März")
      (4  "April")
      (5  "Mai")
      (6  "Juni")
      (7  "Juli")
      (8  "August")
      (9  "September")
      (10  "Oktober")
      (11  "November")
      (12  "Dezember")
    }
  }
  #Sterbeort
  OPTIONAL {
    ?item wdt:P20 ?dPlace.
    ?dPlace rdfs:label ?dPlaceDe.
    FILTER((LANG(?dPlaceDe)) = "de")
    OPTIONAL {
      _:t7 schema:about ?dPlace;
           schema:isPartOf <https://de.wikipedia.org/>;
           schema:name ?dPlaceWP.
    }
    BIND(COALESCE(CONCAT("[[", IF(?dPlaceWP = ?dPlaceDe, ?dPlaceWP, CONCAT(?dPlaceWP, "|", ?dPlaceDe)), "]]"), ?dPlaceDe) AS ?dPlaceText)
    OPTIONAL {
      ?dPlace (wdt:P131+) ?dState.
      ?dState wdt:P31 wd:Q35657;
              rdfs:label ?dStateDe.
      FILTER((LANG(?dStateDe)) = "de")
      OPTIONAL {
        _:t8 schema:about ?dState;
             schema:isPartOf <https://de.wikipedia.org/>;
             schema:name ?dStateWP.
      }
      BIND(COALESCE(CONCAT("[[", IF(?dStateWP = ?dStateDe, ?dStateWP, CONCAT(?dStateWP, "|", ?dStateDe)), "]]"), ?dStateDe) AS ?dStateText)
    }
  }
  #Helfer Sterbedatum
  OPTIONAL {
    ?item wdt:P570 ?dDate.
    BIND(MONTH(?dDate) AS ?dM)
    VALUES (?dM ?dMonth) {
      (1  "Januar")
      (2  "Februar")
      (3  "März")
      (4  "April")
      (5  "Mai")
      (6  "Juni")
      (7  "Juli")
      (8  "August")
      (9  "September")
      (10  "Oktober")
      (11  "November")
      (12  "Dezember")
    }
  }
  #Arbeit, Arbeitskategorien
  OPTIONAL {
    SELECT ?item (GROUP_CONCAT(DISTINCT ?workText; SEPARATOR = "° ") AS ?works) (GROUP_CONCAT(DISTINCT ?workCatText; SEPARATOR = " ") AS ?workCats) WHERE {
      ?item wdt:P106 ?work;
            wdt:P21 ?sx.
      ?work rdfs:label ?workDe.
      FILTER((LANG(?workDe)) = "de")
      OPTIONAL {
        ?work wdt:P910 _:t9.
        _:t9 rdfs:label ?workCat.
        FILTER((LANG(?workCat)) = "de")
      }
      BIND(COALESCE(CONCAT("\\n[[", ?workCat, "]]"), "") AS ?workCatText)
      OPTIONAL {
        _:t10 schema:about ?work;
              schema:isPartOf <https://de.wikipedia.org/>;
              schema:name ?workWP.
      }
      BIND(COALESCE(IF(?workWP = ?workDe, CONCAT("[[", ?workWP, "]]", IF(?sx = wd:Q6581097, "", "in")), CONCAT("[[", ?workWP, "|", ?workDe, IF(?sx = wd:Q6581097, "", "in"), "]]")), CONCAT(?workDe, IF(?sx = wd:Q6581097, "", "in"))) AS ?workText)
    }
    GROUP BY ?item
  }
  #besuchte, Uni-Kategorie
  OPTIONAL {
    SELECT DISTINCT ?item (GROUP_CONCAT(DISTINCT ?schoolText; SEPARATOR = "° ") AS ?schools) (GROUP_CONCAT(DISTINCT ?schoolCats; SEPARATOR = "\\n") AS ?schoolCatPart) WHERE {
      SELECT ?item ?schoolStart ?schoolEnd ?schoolText (GROUP_CONCAT(DISTINCT ?schoolCatText; SEPARATOR = " ") AS ?schoolCats) WHERE {
        ?item p:P69 ?pSchool.
        ?pSchool ps:P69 ?school.
        OPTIONAL {
          ?school rdfs:label ?schoolDe.
          FILTER((LANG(?schoolDe)) = "de")
        }
        OPTIONAL {
          ?school rdfs:label ?schoolEn.
          FILTER((LANG(?schoolEn)) = "en")
        }
        OPTIONAL {
          ?school wdt:P3876 _:t11.
          _:t11 rdfs:label ?schoolCat.
          FILTER((LANG(?schoolCat)) = "de")
        }
        BIND(COALESCE(CONCAT("\\n[[", ?schoolCat, "]]"), "") AS ?schoolCatText)
        OPTIONAL {
          _:t12 schema:about ?school;
                schema:isPartOf <https://de.wikipedia.org/>;
                schema:name ?schoolWP.
        }
        OPTIONAL { ?pSchool pq:P580 ?schoolStart. }
        OPTIONAL { ?pSchool pq:P582 ?schoolEnd. }
        BIND(CONCAT(COALESCE(CONCAT(IF(BOUND(?schoolEnd), "von ", "ab "), STR(YEAR(?schoolStart))), ""), COALESCE(CONCAT(" bis ", STR(YEAR(?schoolEnd))), ""), IF(REGEX(COALESCE(?schoolDe, ?schoolEn), "(ollege|nstitue)$"), " das ", " die "), COALESCE(IF(?schoolWP = ?schoolDe, CONCAT("[[", ?schoolWP, "]]"), CONCAT("[[", ?schoolWP, "|", ?schoolDe, "]]")), COALESCE(?schoolDe, ?schoolEn))) AS ?schoolText)
      }
      GROUP BY ?item ?schoolStart ?schoolEnd ?schoolText
                     ORDER BY DESC (?schoolEnd) DESC (?schoolStart)
    }
    GROUP BY ?item
  }
  #GND
  OPTIONAL { ?item wdt:P227 ?gnd. }
  #VIAF
  OPTIONAL { ?item wdt:P214 ?viaf. }
  #LCCN
  OPTIONAL { ?item wdt:P244 ?lccn. }
  #Kinder
  OPTIONAL {
    ?item wdt:P1971 ?kids.
    VALUES (?nr ?kidsText) {
      (1  "ein")
      (2  "zwei")
      (3  "drei")
      (4  "vier")
      (5  "fünf")
      (6  "sechs")
      (7  "sieben")
      (8  "acht")
      (9  "neun")
      (10  "zehn")
    }
    FILTER(?kids = ?nr)
  }
  #Wohnort
  OPTIONAL {
    SELECT ?item (GROUP_CONCAT(DISTINCT ?lPlaceText; SEPARATOR = "° ") AS ?lPlaces) WHERE {
      ?item wdt:P551 ?lPlace.
      ?lPlace rdfs:label ?lPlaceDe.
      FILTER((LANG(?lPlaceDe)) = "de")
      OPTIONAL {
        _:t13 schema:about ?lPlace;
              schema:isPartOf <https://de.wikipedia.org/>;
              schema:name ?lPlaceWP.
      }
      BIND(COALESCE(IF(?lPlaceWP = ?lPlaceDe, CONCAT("[[", ?lPlaceWP, "]]"), CONCAT("[[", ?lPlaceWP, "|", ?lPlaceDe, "]]")), ?lPlaceDe) AS ?lPlaceText)
    }
    GROUP BY ?item
  }
  #Ehepartner
  OPTIONAL {
    SELECT DISTINCT ?item (GROUP_CONCAT(DISTINCT ?spouseText; SEPARATOR = "° ") AS ?spouses) WHERE {
      SELECT ?item ?spouseStart ?spouseEnd ?spouseText WHERE {
        ?item p:P26 ?pSpouse.
        ?pSpouse ps:P26 ?spouse.
        ?spouse rdfs:label ?spouseDe.
        FILTER((LANG(?spouseDe)) = "de")
        ?spouse rdfs:label ?spouseEn.
        FILTER((LANG(?spouseEn)) = "en")
        OPTIONAL {
          _:t14 schema:about ?spouse;
                schema:isPartOf <https://de.wikipedia.org/>;
                schema:name ?spouseWP.
        }
        OPTIONAL { ?pSpouse pq:P580 ?spouseStart. }
        OPTIONAL { ?pSpouse pq:P582 ?spouseEnd. }
        BIND(CONCAT(COALESCE(CONCAT(IF(BOUND(?spouseEnd), "war von ", "ist seit "), STR(YEAR(?spouseStart))), ""), COALESCE(CONCAT(" bis ", STR(YEAR(?spouseEnd))), ""), " mit ", COALESCE(CONCAT("[[", ?spouseWP, IF(?spouseWP = ?spouseDe, "", CONCAT("|", ?spouseDe)), "]]"), COALESCE(?spouseDe, ?spouseEn))) AS ?spouseText)
      }
      GROUP BY ?item ?spouseStart ?spouseEnd ?spouseText
                     ORDER BY DESC (?spouseStart) DESC (?spouseEnd)
    }
    GROUP BY ?item
  }
  #Lebenspartner
  OPTIONAL {
    SELECT DISTINCT ?item (GROUP_CONCAT(DISTINCT ?partnerText; SEPARATOR = "° ") AS ?partners) WHERE {
      SELECT ?item ?partnerStart ?partnerEnd ?partnerText WHERE {
        ?item p:P451 ?pPartner.
        ?pPartner ps:P451 ?partner.
        ?partner rdfs:label ?partnerDe.
        FILTER((LANG(?partnerDe)) = "de")
        ?partner rdfs:label ?partnerEn.
        FILTER((LANG(?partnerEn)) = "en")
        OPTIONAL {
          _:t15 schema:about ?partner;
                schema:isPartOf <https://de.wikipedia.org/>;
                schema:name ?partnerWP.
        }
        OPTIONAL { ?pPartner pq:P580 ?partnerStart. }
        OPTIONAL { ?pPartner pq:P582 ?partnerEnd. }
        BIND(CONCAT(COALESCE(CONCAT(IF(BOUND(?partnerEnd), "war von ", "ist seit "), STR(YEAR(?partnerStart))), ""), COALESCE(CONCAT(" bis ", STR(YEAR(?partnerEnd))), ""), " mit ", COALESCE(CONCAT("[[", ?partnerWP, IF(?partnerWP = ?partnerDe, "", CONCAT("|", ?partnerDe)), "]]"), COALESCE(?partnerDe, ?partnerEn))) AS ?partnerText)
      }
      GROUP BY ?item ?partnerStart ?partnerEnd ?partnerText
                     ORDER BY DESC (?partnerStart) DESC (?partnerEnd)
    }
    GROUP BY ?item
  }
  BIND(CONCAT("'''", ?name, "'''") AS ?namePart)
  BIND(COALESCE(CONCAT(" (* [[", STR(DAY(?bDate)), ". ", ?bMonth, "]] [[", STR(YEAR(?bDate)), "]]", COALESCE(CONCAT(" in ", ?bPlaceText, COALESCE(CONCAT(", ", ?bStateText), "")), ""), COALESCE(CONCAT("; † [[", STR(DAY(?dDate)), ". ", ?dMonth, "]] [[", STR(YEAR(?dDate)), "]]", COALESCE(CONCAT(" in ", ?dPlaceText, COALESCE(CONCAT(", ", ?dStateText), "")), ""), ")"), ")")), "") AS ?dates)
  BIND(REPLACE(CONCAT(" ist ", IF(?sx = wd:Q6581097, "ein ", "eine "), COALESCE(CONCAT(COALESCE(?citizens, ""), REPLACE(?works, "° ([^°]*$)", " und $1")), ?description)), "° ", ", ") AS ?descriptionPart)
  BIND(REPLACE(COALESCE(CONCAT(IF(?sx = wd:Q6581097, ", der ", ", die "), "bekannt ist für ", REPLACE(?knowns, "° ([^°]*$)", " und $1")), ""), "° ", ", ") AS ?knownPart)
  BIND(IF((BOUND(?bPlace)) || (BOUND(?bDate)), CONCAT(?name, " wurde ", COALESCE(CONCAT(STR(YEAR(?bDate)), " "), ""), COALESCE(CONCAT("in ", ?bPlaceText), ""), COALESCE(CONCAT(", im US-Bundesstaat ", ?bStateText), ""), " geboren."), "") AS ?born)
  BIND(REPLACE(COALESCE(CONCAT(IF(?sx = wd:Q6581097, " Er", " Sie"), " besuchte ", REPLACE(?schools, "° ([^°]*$)", " und $1"), ". "), ""), "° ", ", ") AS ?education)
  BIND(REPLACE(CONCAT(REPLACE(?name, ".* (.*)", "\\n\\n$1 "), REPLACE(?partners, "° ([^°]*$)", " und $1"), " liiert. "), "(° war |° )", ", ") AS ?partnerPart)
  BIND(REPLACE(CONCAT(REPLACE(?name, ".* (.*)", "$1 "), REPLACE(?spouses, "° ([^°]*$)", " und $1"), " verheiratet"), "(° war |° )", ", ") AS ?spousePart)
  BIND(CONCAT(" hat ", ?kidsText, " Kind", IF(?kids = 1 , ".", "er.")) AS ?kidsPart)
  BIND(REPLACE(CONCAT(" ", IF(?sx = wd:Q6581097, "Er", "Sie"), " lebt in ", REPLACE(?lPlaces, "° ([^°]*$)", " und $1"), "."), "° ", ", ") AS ?lPlacesPart)
  BIND(IF((BOUND(?spousePart)) && (BOUND(?kidsPart)), " und", IF(BOUND(?spousePart), ". ", IF(BOUND(?kidsPart), IF(?sx = wd:Q6581097, "Er ", "Sie "), ""))) AS ?connection)
  BIND(CONCAT("\\n\\n== Weblinks ==\\n", ?commonscat, COALESCE(CONCAT("* {{IMDb|", ?imdb, "}}\\n"), "")) AS ?weblinks)
  BIND("\\n== Einzelnachweise ==\\n<references responsive />\\n" AS ?references)
  BIND(CONCAT("\\n{{Normdaten|TYP=p|GND=", COALESCE(?gnd, ""), "|LCCN=", COALESCE(?lccn, ""), "|VIAF=", COALESCE(?viaf, ""), IF(BOUND(?gnd), "", "|GNDfehlt=ja"), "|GNDCheck=", REPLACE(STR(NOW()),"T.*",""), "}}") AS ?normdata)
  BIND(CONCAT("\\n\\n{{SORTIERUNG:", REPLACE(REPLACE(?name, "(.*) (.*)", "$2, $1"), "\\\\.", ""), "}}") AS ?sortorder)
  BIND(CONCAT(COALESCE(CONCAT("\\n[[Kategorie:Geboren ", STR(YEAR(?bDate)), "]]"), ""), COALESCE(CONCAT("\\n[[Kategorie:Gestorben ", STR(YEAR(?dDate)), "]]"), ""), CONCAT("\\n[[Kategorie:", IF(?sx = wd:Q6581097, "Mann", "Frau"), "]]")) AS ?categories)
  BIND(CONCAT(COALESCE(?workCats, ""), COALESCE(?schoolCatPart, ""), COALESCE(?countryCats, ""), ?categories) AS ?cats)
  BIND(CONCAT("\\n\\n{{Personendaten", "\\n|NAME=", REPLACE(?name, "(.*) (.*)", "$2, $1"), "\\n|ALTERNATIVNAMEN=", COALESCE(?alias, ""), "\\n|KURZBESCHREIBUNG=", COALESCE(?description, REPLACE(CONCAT(COALESCE(?citizens, ""), REPLACE(?works, "° ([^°]*$)", " und $1")), "° ", ", ")), "\\n|GEBURTSDATUM=", COALESCE(CONCAT(STR(DAY(?bDate)), ". ", ?bMonth, " ", STR(YEAR(?bDate))), ""), "\\n|GEBURTSORT=", COALESCE(CONCAT(?bPlaceText, COALESCE(CONCAT(", ", ?bStateText), "")), ""), "\\n|STERBEDATUM=", COALESCE(CONCAT(STR(DAY(?dDate)), ". ", ?dMonth, " ", STR(YEAR(?dDate))), ""), "\\n|STERBEORT=", COALESCE(CONCAT(?dPlaceText, COALESCE(CONCAT(", ", ?dStateText), "")), ""), "\\n}}") AS ?persondata)
  BIND(CONCAT(?imagePart, ?namePart, ?dates, ?descriptionPart, ?knownPart, ".\\n\\n== Leben ==\\n", ?born, ?education, COALESCE(?partnerPart, "\\n\\n"), COALESCE(?spousePart, ""), ?connection, COALESCE(?kidsPart, ""), COALESCE(?lPlacesPart, ""), "\\n\\n== Filmografie ==\\nLädt ...\\n\\n", ?weblinks, ?references, ?normdata, ?sortorder, ?cats, ?persondata) AS ?source)
}`;
        var resp = await fetch("https://query.wikidata.org/sparql?format=json", {
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            "body": "query=" + encodeURIComponent(personSparqlRequest).replaceAll("%20","+").replaceAll("%5Cd","%5C%5Cd"),
            "method": "POST",
            "mode": "cors"
        });
        var obj = await resp.json();
        var result = obj.results.bindings;
        return result.length && Object.keys(result[0]).length ? result[0].source.value : "";
    }
})();
