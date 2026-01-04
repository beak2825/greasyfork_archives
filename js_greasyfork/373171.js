// ==UserScript==
// @name         Filmografie von IMDb nach Wikipedia
// @version      4.2.4
// @description  Wandelt die Filmografie von IMDb mithilfe von Wikidata in Wikipedia-Quelltext um
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Filmografie%20von%20IMDb%20nach%20Wikipedia]%20
// @connect      query-main.wikidata.org
// @connect      www.imdb.com
// @match        https://www.imdb.com/*/name/*
// @match        https://www.imdb.com/name/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/373171/Filmografie%20von%20IMDb%20nach%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/373171/Filmografie%20von%20IMDb%20nach%20Wikipedia.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function(){
    "use strict";
    var sha256 = {
        loadActor: "ea0a755edec9c6292437b817e9a91e81e98262e85afd49bc1d5c7a0a498cf39b",
        loadActress: "f0aa46008175b841ba1364b1828ab30fcf4d989f4c617e196375fa29c81d3ace",
        loadEpisodeActor: "92997ef1786794b3340a89a6fb1a01bd29233c36c414df2bbee3c9cb6cb2de09",
        loadEpisodeActress: "16cb70dca5f908eb5e474305045f4e440a6d3b61913ecf53e78b1e6275e67772"
    };
    unsafeWindow.ladeFilmografie = function(showShort = true, episodeLabel = "Folge", showAlert = false){
        setTimeout(async() =>{
            var isMale = document.querySelector(".filmo-section-actor,.filmo-section-actress").classList.contains("filmo-section-actor");
            var imdbId = location.href.match(/nm\d+/)[0];
            var filmography = [];
            var done = 0;
            var request = 1;
            var checkIfCompleted = setInterval(async () => {
                if (done / request != 1){
                    console.clear();
                    console.log("requests:", done, "/", request);
                } else {
                    await getDataFromWikidata();
                    var formattedFilmography = "== Filmografie ==";
                    filmography.forEach(entry => {
                        formattedFilmography += entry.toString();
                    });
                    GM.setClipboard(formattedFilmography);
                    var successMessage = "Filmografie wurde erfolgreich kopiert.";
                    if (showAlert){
                        alert(successMessage);
                    } else {
                        console.clear();
                        console.log(formattedFilmography);
                        console.log(successMessage);
                    }
                    clearInterval(checkIfCompleted);
                }
            }, 1000);
            var resp = await fetch(`https://caching.graphql.imdb.com/?operationName=NameMainFilmographyPaginatedCredits&variables={"id":"${imdbId}","includeUserRating":false,"locale":"de-DE"}&extensions={"persistedQuery":{"sha256Hash":"${(isMale ? sha256.loadActor : sha256.loadActress)}","version":1}}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-imdb-user-country": "DE"
                }
            });
            var workObj = await resp.json();
            var work = workObj.data.name[(isMale ? "actor_credits" : "actress_credits")].edges.map(i => i.node);
            done++;
            for(var w of work){
                var credit = new Credit();
                credit.yearFrom = w.episodeCredits.yearRange?.year ?? w.title.releaseYear?.year;
                if (!credit.yearFrom){
                    continue;
                }
                credit.yearTo = w.episodeCredits.yearRange ? w.episodeCredits.yearRange.endYear ?? 0 : 0;
                credit.dt = w.title.titleText.text;
                credit.ot = w.title.originalTitleText.text;
                var creditType = w.title.titleType.text;
                if (creditType == "Video Game" || creditType == "Podcast Series"){
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
                                        var season = epCredit.series.displayableEpisodeNumber.displayableSeason.text;
                                        var episode = epCredit.series.displayableEpisodeNumber.episodeNumber.text;
                                        credit.episodeName = ((season == "1" && episode.length > 3 ? "" : season + "x") + episode).replace(/x(\d)$/,"x0$1");
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
                        credit.ot = i.ot?.value || credit.ot;
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
                    return title.replace(/[-–:., \d’'!…]/g, "").toLowerCase();
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
                    this.dt = this.dt.replace(" - ", " – ").replace("...", "…").replace(/'/g, "’");
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
                    this.ot = this.ot.replace(" - ", " – ").replace("...", "…").replace(/'/g, "’");
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
                        }else{
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
        }, 0);
        return "Filmografie lädt …";
    };

    GM.registerMenuCommand("Filmografie laden",() => {
        unsafeWindow.ladeFilmografie(undefined, undefined, true);
    },"f");

    console.log('Um die Filmografie mit Standardeinstellungen zu laden, genügt ein Klick im Menü des Userscripts auf "Filmografie laden".\n' +
                'Die Filmografie kann in der Console mit erweiterten Einstellungen in der Form "ladeFilmografie(showShort, episodeLabel);" aufgerufen werden.\n' +
                'Dabei steht "episodeLabel" für die verwendete Bezeichnung "Folge" oder "Episode" und "showShort" dafür, ob Kurzfilme aufgeführt werden sollen oder nicht (true oder false).');
})();
