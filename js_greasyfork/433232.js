// ==UserScript==
// @name         Wikidata Episode Generator
// @version      0.13.2
// @description  Creates QuickStatements for Wikidata episode items from Wikipedia episode lists
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Wikipedia%20Episode%20Generator]%20
// @match        https://en.wikipedia.org/wiki/*
// @connect      www.wikidata.org
// @connect      www.imdb.com
// @connect      www.fernsehserien.de
// @icon         https://www.wikidata.org/static/favicon/wikidata.ico
// @grant        GM.xmlHttpRequest
// @grant        GM.setClipboard
// @grant        GM.registerMenuCommand
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/433232/Wikidata%20Episode%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/433232/Wikidata%20Episode%20Generator.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* eslint no-prototype-builtins: "off" */
/* eslint no-return-assign: "off" */
/* eslint curly: "off" */
/* globals mw */

(function() {
    "use strict";
    unsafeWindow.generateEpisodes = generateEpisodes;
    GM.registerMenuCommand("Generate episode items for Wikidata", generateEpisodes, "w");
    async function generateEpisodes(){
        console.clear();
        var article = mw.config.get("wgTitle");
        var response = await fetch(`/w/api.php?action=query&prop=revisions|pageprops&titles=${encodeURIComponent(article)}&rvslots=*&rvprop=content|ids&formatversion=2&format=json`);
        var data = await response.json();
        var version = Object.values(data.query.pages)[0].revisions[0];
        var articleText = version.slots.main.content;
        var subArticles = articleText.match(/{{:(.*)}}/g);
        if (subArticles != null){
            console.log("Loading sub articles from Wikipedia…");
            var sub = subArticles.map(i => encodeURIComponent(i.replace(/{{:|}}/g,""))).join("|");
            response = await fetch(`/w/api.php?action=query&prop=revisions|pageprops&titles=${sub}&rvslots=*&rvprop=content|ids&formatversion=2&format=json`);
            var subData = await response.json();
            var subtexts = Object.values(subData.query.pages);
            subtexts.forEach(i => {articleText = articleText.replace(i.title, i.revisions[0].slots.main.content)});
        }
        var wikibaseId = Object.values(data.query.pages)[0].pageprops?.wikibase_item;
        if (wikibaseId == null){
            console.error("The item for this Wikipedia article doesn't exist at Wikidata, please create it first.");
            return;
        }
        response = await GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.wikidata.org/w/api.php?action=wbgetentities&props=claims&sitefilter=dewiki&ids=${wikibaseId}&format=json`,
            onload: function(response) {
                return response;
            }
        });
        var jsonObj = Object.values((JSON.parse(response.responseText)).entities)[0];
        var seriesId = 0;
        window.addEventListener("unhandledrejection", async (ex) => {
            var propertyUndefined = ex.reason.message.match(/.*\.(P\d+) is undefined/);
            if (propertyUndefined){
                var response = await GM.xmlHttpRequest({
                    method: "GET",
                    url: `https://www.wikidata.org/w/api.php?action=wbgetentities&props=labels&ids=${propertyUndefined[1]}&languages=en&format=json`,
                    onload: function(response) {
                        return response;
                    }
                });
                var url = `https://www.wikidata.org/wiki/${seriesId}`;
                console.error(`The property "${JSON.parse(response.responseText).entities[propertyUndefined[1]].labels.en.value}" (${propertyUndefined[1]}) is missing from the series item (${url})`);
            }
        });
        if (article.split("List of ").length == 2){
            seriesId = jsonObj.claims.P360[0].qualifiers.P179[0].datavalue.value.id;
        }else if(article.split("season").length == 2){
            seriesId = jsonObj.claims.P179[0].mainsnak.datavalue.value.id;
        }else{
            seriesId = wikibaseId;
        }
        response = await GM.xmlHttpRequest({
            method: "GET",
            url: `https://www.wikidata.org/w/api.php?action=wbgetentities&props=sitelinks|claims|labels&sitefilter=dewiki&ids=${seriesId}&format=json`,
            onload: function(response) {
                return response;
            }
        });
        jsonObj = Object.values((JSON.parse(response.responseText)).entities)[0];
        var series = jsonObj.labels.de.value;
        var seriesEn = jsonObj.labels.en.value;
        var networkId = jsonObj.claims.P449[0].mainsnak.datavalue.value.id;
        var imdbId = (jsonObj.claims.hasOwnProperty("P345")) ? jsonObj.claims.P345[0].mainsnak.datavalue.value : prompt("IMDb-Id");
        var fsId = (jsonObj.claims.hasOwnProperty("P5327")) ? jsonObj.claims.P5327[0].mainsnak.datavalue.value : prompt("Fernsehserien.de-Id");
        var originalLanguageId = jsonObj.claims.P364[0].mainsnak.datavalue.value.id;
        var originalCountryId = jsonObj.claims.P495[0].mainsnak.datavalue.value.id;
        var seasons = jsonObj.claims.P527?.sort((a,b) => a.qualifiers.P1545[0].datavalue.value - b.qualifiers.P1545[0].datavalue.value).map(i => i.mainsnak.datavalue.value.id) ?? console.error("season items are missing");
        if (location.pathname.includes("season")){
            var epSeason = document.title.match(/season (\d+)\)/)[1];
            seasons = jsonObj.claims.P527.filter(i => i.qualifiers.P1545[0].datavalue.value == Number(epSeason)).map(i => i.mainsnak.datavalue.value.id);
        }
        var wikilinks = [];
        var plainlinks = [];
        var eps = articleText.split(/{{(?:#invoke:)?Episode list.*\n|==+ *Season (\d+) |== ?(Special)s?(?: episodes?|: [^=]+)? ?(?:\((?:19|20)\d\d(?:[-–](?:19|20)?\d\d)?\))? ?==/i).filter(i => i).map(i => i.split(/\n}}\n/)[0]).slice(1);
        if (articleText.match(/== *Season \d+ /i)){
            var tempSeason = 0;
            eps.forEach((e,i) => {
                if (Number(e) || e.toLowerCase() == "special"){
                    tempSeason = e;
                    eps.splice(i + 1,1);
                }else{
                    eps[i] += "\n |Season = " + tempSeason;
                }
            });
            eps = eps.filter(i => !Number(i) && i.toLowerCase() != "special" && !i.match(/Season *= *Special *$/i));
        }
        eps = eps.flatMap(episode => {
            var lines = episode.split("\n");
            var numParts = lines.find(line => line.startsWith("| NumParts"))?.split("=")[1]?.trim();
            if (numParts) {
                var newEpisodes = [];
                for (let i = 1; i <= parseInt(numParts); i++) {
                    var firstNumberLine = true;
                    var firstNumberLine_2 = true;
                    var newEpisode = lines.map(line => {
                        if (line.startsWith("| EpisodeNumber_") && firstNumberLine) {
                            firstNumberLine = false;
                            return "| EpisodeNumber = " + lines.find(l => l.startsWith("| EpisodeNumber_" + i)).split("=")[1].trim();
                        } else if (line.startsWith("| EpisodeNumber2") && firstNumberLine_2) {
                            firstNumberLine_2 = false;
                            return "| EpisodeNumber2 = " + lines.find(l => l.startsWith("| EpisodeNumber2_" + i)).split("=")[1].trim();
                        } else if (line.startsWith("| Title")) {
                            return "| Title = " + line.split("=")[1].trim() + ", part " + i;
                        } else if (!line.startsWith("| EpisodeNumber_") && !line.startsWith("| EpisodeNumber2_") && !line.startsWith("| NumParts")) {
                            return line;
                        }
                    }).filter(Boolean).join("\n");
                    newEpisodes.push(newEpisode);
                }
                return newEpisodes;
            } else {
                return episode;
            }
        });
        var episodes = eps.map(i => {
            wikilinks = wikilinks.concat([...i.matchAll(/\[\[(.*?)\]\]/g)].map(i => i[1]));
            plainlinks = plainlinks.concat([...i.matchAll(/\[\[(.*?)\]\]/g)].map(i => i[1].split("|")[1] ?? i[1]));
            if (i.match("DirectedBy_?1?2? *= *(.+) *(?:\n|\\|)") == null){console.error("DirectedBy\n",i)}
            if (i.match("WrittenBy_?1?2? *= *(.+) *(?:\n|\\|)") == null){console.error("WrittenBy\n",i)}
            return {
                "NR_GES": (i.match("EpisodeNumber *= *(\\d+) *(?:\n|\\|)") ?? ["",(console.error("EpisodeNumber\n",i),prompt("EpisodeNumber\n" + i.match("EpisodeNumber.*\n")) ?? 0)])[1],
                "NR_ST": (i.match("EpisodeNumber2 *= *(\\d+) *(?:\n|\\|)") ?? i.match("EpisodeNumber *= *(\\d+) *(?:\n|\\|)") ?? ["",(console.error("EpisodeNumber2\n",i),prompt("EpisodeNumber2\n" + i.match("EpisodeNumber2.*\n")) ?? 0)])[1],
                "OT": (i.match("Title *= *(.+) *(?:\n|\\|)") ?? ["",(console.error("Title\n",i),prompt("Title\n" + i.match("Title.*\n")))])[1].replace(/<!--.*?-->/i,"").split(/\[\[.*\||\[\[|\]\]/g).join("").trim().replace(/{{'-}}/g,"'").replace(/{{visible anchor\|(.*)}}/g,"$1").replace(/^(.*?)(?=[^\dXVI]{2}.) ?[,:\-–]? \(?(?:part )?([\dXVI]+)\)?/i,"$1, part $2").replace(/{{va\|(?:.*\|)?(.*)}}/, "$1"),
                "SL": (i.match("Title *= *\\[\\[(.+)\\]\\] *(?:\n|\\|)") ?? ["",""])[1].split("|")[0],
                "EA": getDate((i.match("OriginalAirDate *= *(.+) *(?:\n|\\|)") ?? ["",(console.error("OriginalAirDate\n",i),"")])[1]),
                "REG": [...new Set([...[...(i.matchAll("DirectedBy_?1?2? *= *(.+) *(?:\n|\\|)"))].map(i => i[1]).join(" ").matchAll(new RegExp(plainlinks.join("|"),"g"))].map(i => i[0]).filter(i => i != "").map(p => wikilinks.filter(w => (w.split("|")[1] ?? w) == p)[0]?.split("|")[0]))].filter(i => i),
                "DRB": [...new Set([...[...(i.matchAll("WrittenBy_?1?2? *= *(.+) *(?:\n|\\|)"))].map(i => i[1]).join(" ").matchAll(new RegExp(plainlinks.join("|"),"g"))].map(i => i[0]).filter(i => i != "").map(p => wikilinks.filter(w => (w.split("|")[1] ?? w) == p)[0]?.split("|")[0]))].filter(i => i),
                "PROD": (i.match("ProdCode *= *(.*) *(?:\n|\\|)") ?? ["",""])[1].split("<ref")[0],
                "ST": (i.match(/Season *= *(\d+) *$/) ?? ["",""])[1],
            };
        });
        var seasonId = 0;
        var episodeId = 0;
        var articleName = location.pathname.replace(/^\/wiki\//,"");
        var source = `S143	Q328	S4656	"https://en.wikipedia.org/w/index.php?title=${articleName}&oldid=${version.revid}"`;
        var output = "";
        var lastEA = "";
        var lastEp = "";
        var seasonMissing = false;
        episodes.forEach(i => {
            if (i.ST){
                seasonId = Number(i.ST) - 1;
            }else if (Number(i.NR_ST) < episodeId){
                seasonId++;
            }
            i.season = seasonId;
            episodeId = i.NR_ST;
            seasonMissing = (seasonId != -1 && seasons && !seasons[i.season]);
        });

        await GetEpisodeItems(seriesId, episodes, originalCountryId);

        if (!seasons || seasonMissing){
            var quickstatements = await GetSeasonItems(seriesId);
            if (quickstatements != ""){
                //write Statements for adding seasons to series
                console.warn("Please rerun Wikidata Episode Generator after running these QuickStatements.");
                output += quickstatements;
            }else{
                //write CREATE-Statements for seasons
                console.warn("Please wait some time after running these QuickStatements and then rerun Wikidata Episode Generator.");
                episodeId = 0;
                episodes.forEach(ep => {
                    if (!seasons || !seasons[ep.season - 1]) {
                        //new season, first episode
                        if (Number(ep.NR_ST) < episodeId){
                            output += `LAST	P582	+${lastEA}T00:00:00Z/11	P291	${originalCountryId}	${source}
LAST	P1113	${episodeId}	${source}
`;
                        }
                    }
                    if (!seasons || !seasons[ep.season]) {
                        //new season
                        if (ep.NR_GES == 1 || Number(ep.NR_ST) < episodeId){
                            output += `CREATE
LAST	Len	"${seriesEn}, season ${ep.season + 1}"
LAST	Lde	"${series}/Staffel ${ep.season + 1}"
LAST	Den	"season of ${seriesEn}"
LAST	Dde	"Staffel von ${series}"
LAST	P31	Q3464665
LAST	P179	${seriesId}	P1545	"${ep.season + 1}"	${source}
LAST	P364	${originalLanguageId}	${source}
LAST	P495	${originalCountryId}	${source}
LAST	P449	${networkId}	${source}
LAST	P580	+${ep.EA}T00:00:00Z/11	P291	${originalCountryId}	${source}
`;
                        }
                        //last episode
                        if (ep.NR_GES == episodes.length){
                            output += `LAST	P582	+${ep.EA}T00:00:00Z/11	P291	${originalCountryId}	${source}
LAST	P1113	${ep.NR_ST}	${source}
`;
                        }
                    }
                    lastEA = ep.EA;
                    ep.season = seasonId;
                    episodeId = ep.NR_ST;
                });
            }
        }
        else
        {
            if (fsId){
                await GetFSData(fsId, episodes);
            }
            if (imdbId){
                await GetIMDbIds(imdbId, episodes);
            }
            await GetWikipediaLinks(episodes);
            //write CREATE-Statements for episodes, get DRB and REG
            episodes.forEach(ep => {
                var epText = `CREATE\n`;
                if (ep.hasOwnProperty("OT") && !ep.hasOwnProperty("Len"))
                    epText += `LAST	Len	"${ep.OT}"\n`;
                if (ep.hasOwnProperty("DT") && !ep.hasOwnProperty("Lde"))
                    epText += `LAST	Lde	"${ep.DT}"\n`;
                if (ep.SL != "" && !ep.hasOwnProperty("Senwiki"))
                    epText += `LAST	Senwiki	"${ep.SL}"\n`;
                if (!ep.hasOwnProperty("Den"))
                    epText += `LAST	Den	"episode of ${seriesEn}"\n`;
                if (!ep.hasOwnProperty("Dde"))
                    epText += `LAST	Dde	"Folge von ${series}"\n`;
                if (!ep.hasOwnProperty("P179P1545"))
                    epText += `LAST	P179	${seriesId}	P1545	"${ep.NR_GES}"	${source}\n`;
                if (!ep.hasOwnProperty("P31"))
                    epText += `LAST	P31	Q21191270\n`;
                if (!ep.hasOwnProperty("P1476"))
                    epText += `LAST	P1476	en:"${ep.OT}"	${source}\n`;
                if (!ep.hasOwnProperty("P4908P1545")){
                    if (seasons[ep.season]){
                        epText += `LAST	P4908	${seasons[ep.season]}	P1545	"${ep.NR_ST}"	${source}\n`;
                    } else {
                        console.error("season not found\n", ep);
                    }
                }
                if (!ep.hasOwnProperty("P577P291O"))
                    epText += `LAST	P577	+${ep.EA}T00:00:00Z/11	P291	${originalCountryId}	${source}\n`;
                if (!ep.hasOwnProperty("P449"))
                    epText += `LAST	P449	${networkId}	${source}\n`;
                if (!ep.hasOwnProperty("P364"))
                    epText += `LAST	P364	${originalLanguageId}	${source}\n`;
                if (!ep.hasOwnProperty("P495"))
                    epText += `LAST	P495	${originalCountryId}	${source}\n`;
                if (ep.hasOwnProperty("EAD") && ep.EAD != "" && !ep.hasOwnProperty("P577P291")){
                    ep.EAD = ep.EAD.replace(/(\d{2})\.(\d{2})\.(\d{4})/,"$3-$2-$1");
                    var fsSource = `S248	Q54871129	S5327	"${fsId}"	S813	+${new Date().toISOString().slice(0,10)}T00:00:00Z/11`;
                    epText += `LAST	P577	+${ep.EAD}T00:00:00Z/11	P291	Q183	${fsSource}\n`;
                }
                ep.REGid.forEach(reg => {
                    if (!ep.hasOwnProperty("P57") || !(new RegExp(ep.P57)).test(reg))
                        epText += `LAST	P57	${reg}	${source}\n`;
                });
                ep.DRBid.forEach(drb => {
                    if (!ep.hasOwnProperty("P58") || !(new RegExp(ep.P58)).test(drb))
                        epText += `LAST	P58	${drb}	${source}\n`;
                });
                if (ep.PROD != "" && !ep.hasOwnProperty("P2364"))
                    epText += `LAST	P2364	"${ep.PROD}"	${source}\n`;
                if (ep.hasOwnProperty("imdb") && !ep.hasOwnProperty("P345"))
                    epText += `LAST	P345	"${ep.imdb}"\n`;
                if (ep.hasOwnProperty("qid")){
                    epText = epText.replace(/(CREATE\n)?LAST/g, ep.qid).replace(/CREATE\n/g, "");
                    if (lastEp.hasOwnProperty("qid")){
                        if (!lastEp.hasOwnProperty("P156") && !lastEp.hasOwnProperty("P179P156"))
                            epText = `${lastEp.qid}	P156	${ep.qid}	${source}\n${epText}`;
                        if (!ep.hasOwnProperty("P155") && !ep.hasOwnProperty("P179P155"))
                            epText += `${ep.qid}	P155	${lastEp.qid}	${source}\n`;
                    }
                }
                lastEp = ep;
                if (epText.match(/\bundefined\b/))
                    console.error("episode includes undefined value\n", epText);
                output += epText;
            });
        }
        if (!jsonObj.claims.hasOwnProperty("P5327") && fsId)
            output += `${seriesId}	P5327	"${fsId}"
`;
        if (output)
            console.log(output);
        console.warn(output ? "Please check all QuickStatements for correctness before execution at https://quickstatements.toolforge.org/#/batch." : "No missing QuickStatements found.");
        GM.setClipboard(output);
    }
    function getDate(episodeDate){
        var result = episodeDate.replace(/{{start date ?(?:\|[md]f=y(?:es)?)?\|(\d+) ?\|(\d+) ?\|(\d+) ?(?:\|[md]f=y(?:es)?)?}}.*/i,"$1-$2-$3").replace(/-(\d)\b/g,"-0$1");
        if (!/[1-2][09]\d\d-[0-1]\d-[0-3]\d/.test(result)){
            console.error("OriginalAirDate",episodeDate);
        }
        return result;
    }
    function compareString(title){
        if (!title)
            return null;
        var partEp = title.match(/^(.*?)(?=[^\d]{2}.) ?[,:\-–]? \(?(?:(?:part|teil) )?#?([\dXVI]+|one|two)\)? *$/i);
        if (partEp)
        {
            var part2 = partEp[2].replace(/one/i, "1").replace(/two/i, "2");
            title = partEp[1] + (Number(part2) ? getRomanNumber(part2) : part2);
        }
        return title.trim().toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/&/i, "and").replace(/^the |^a |[\u200B-\u200D\uFEFF]| |\.|'|’|\(|\)|:|,|‚|\?|!|„|“|"|‘|…|\.|—|–|-/gi,"");
    }
    function getRomanNumber(n){
        return n = Number(n) && "x10ix9v5iv4i1".replace(/(\D+)(\d+)/g,(_,r,d)=>r.repeat(n / d,n %= d));
    }
    function levenshteinDistance(str1, str2){
        if (!str1 || !str2){
            return 100;
        }
        var track = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
        for (let i = 0; i <= str1.length; i += 1){
            track[0][i] = i;
        }
        for (let j = 0; j <= str2.length; j += 1){
            track[j][0] = j;
        }
        for (let j = 1; j <= str2.length; j += 1){
            for (let i = 1; i <= str1.length; i += 1){
                var indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
                track[j][i] = Math.min(
                    track[j][i - 1] + 1,
                    track[j - 1][i] + 1,
                    track[j - 1][i - 1] + indicator,
                );
            }
        }
        return track[str2.length][str1.length];
    }
    function SetEpisodeAttributes(output, episode){
        output.P31 = "Q21191270";
        output.P179 = "series";
        for (const prop in episode) {
            output[prop] = episode[prop].value;
        }
        return output;
    }
    async function GetSparqlResponse(request){
        var resp = await fetch("https://query-main.wikidata.org/sparql?format=json", {
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                "Accept": "application/sparql-results+json"
            },
            "body": "query=" + encodeURIComponent(request).replaceAll("%20","+").replaceAll("%5Cd","%5C%5Cd"),
            "method": "POST",
            "mode": "cors"
        });
        return await resp.json();
    }
    async function GetEpisodeItems(qid, episodes, originalCountryId){
        console.log("Loading episode items from Wikidata…");
        var request = `SELECT ?qid ?seasonNr ?Len ?Lde ?Den ?Dde ?Dnl ?Senwiki (GROUP_CONCAT(DISTINCT REPLACE(STR(?P57all), ".*/", ""); SEPARATOR = "|") AS ?P57) (GROUP_CONCAT(DISTINCT REPLACE(STR(?P58all), ".*/", ""); SEPARATOR = "|") AS ?P58) (MIN(?P155all) AS ?P155) (MIN(?P156all) AS ?P156) ?P179P155 ?P179P156 ?P179P1545 ?P345 ?P364 ?P449 ?P495 ?P577P291 ?P577P291O ?P1476 ?P2364 ?P4908P1545 WHERE {
  BIND(wd:${qid} AS ?series)
  ?pSeries ps:P179 ?series.
  ?q wdt:P31 wd:Q21191270;
    p:P179 ?pSeries.
  OPTIONAL { ?pSeries pq:P1545 ?P179P1545. }
  OPTIONAL {
    ?q p:P4908 _:0.
    _:0 pq:P1545 ?P4908P1545.
  }
  OPTIONAL {
    ?q wdt:P4908 _:1.
    _:1 rdfs:label ?wSeason.
    FILTER((LANG(?wSeason)) = "en")
    BIND(REPLACE(STR(?wSeason), ".* ", "") AS ?seasonNr)
  }
  OPTIONAL {
    ?q rdfs:label ?Len.
    FILTER((LANG(?Len)) = "en")
  }
  OPTIONAL {
    ?q rdfs:label ?Lde.
    FILTER((LANG(?Lde)) = "de")
  }
  OPTIONAL {
    ?q schema:description ?Den.
    FILTER((LANG(?Den)) = "en")
  }
  OPTIONAL {
    ?q schema:description ?Dde.
    FILTER((LANG(?Dde)) = "de")
  }
  OPTIONAL {
    ?q schema:description ?Dnl.
    FILTER((LANG(?Dnl)) = "nl")
  }
  OPTIONAL {
	?q p:P577 _:2.
	_:2 ps:P577 ?P577P291;
  	pq:P291 wd:Q183.
  }
  OPTIONAL {
	?q p:P577 _:3.
	_:3 ps:P577 ?P577P291O;
  	pq:P291 wd:${originalCountryId}.
  }
  OPTIONAL {
    ?Senwiki schema:about ?q;
      schema:isPartOf <https://en.wikipedia.org/>;
      schema:name _:4.
  }
  OPTIONAL { ?pSeries pq:P155 ?P179P155. }
  OPTIONAL { ?pSeries pq:P156 ?P179P156. }
  OPTIONAL { ?q wdt:P57 ?P57all. }
  OPTIONAL { ?q wdt:P58 ?P58all. }
  OPTIONAL { ?q wdt:P345 ?P345. }
  OPTIONAL { ?q wdt:P364 ?P364. }
  OPTIONAL { ?q wdt:P449 ?P449. }
  OPTIONAL { ?q wdt:P495 ?P495. }
  OPTIONAL { ?q wdt:P1476 ?P1476. }
  OPTIONAL { ?q wdt:P2364 ?P2364. }
  OPTIONAL { ?q wdt:P155 ?P155all. }
  OPTIONAL { ?q wdt:P156 ?P156all. }
  BIND(REPLACE(STR(?q),".*/","") as ?qid).
  FILTER NOT EXISTS {?qid wdt:P1 wd:Q${new Date() % 1000}.}
}
GROUP BY ?qid ?seasonNr ?Len ?Lde ?Den ?Dde ?Dnl ?Senwiki ?P179P155 ?P179P156 ?P179P1545 ?P345 ?P364 ?P449 ?P495 ?P577P291 ?P577P291O ?P1476 ?P2364 ?P4908P1545`;
        var resp = await GetSparqlResponse(request);
        var sparqlEps = resp.results.bindings;
        for (let ep of sparqlEps){
            var sparqlEp = episodes.filter(e => compareString(e.OT) == compareString(ep.Len.value));
            if (sparqlEp.length == 1){
                sparqlEp[0] = SetEpisodeAttributes(sparqlEp[0], ep);
            }else{
                var matchedEp = episodes.reduce(function(prev, curr) {
                    return levenshteinDistance(compareString(prev.OT), compareString(ep.Len.value)) <= levenshteinDistance(compareString(curr.OT), compareString(ep.Len.value)) ? prev : curr;
                });
                var epSeason;
                if (location.pathname.includes("season")){
                    epSeason = document.title.match(/season (\d+)\)/)[1];
                }else{
                    epSeason = matchedEp.season + 1;
                }
                var matchedEpNr = epSeason + "x" + (matchedEp.NR_ST.length == 1 ? "0" : "") + matchedEp.NR_ST;
                var epNr = (ep.seasonNr?.value ?? "0") + "x" + ((ep.P4908P1545?.value.length ?? 1) == 1 ? "0" : "") + (ep.P4908P1545?.value ?? "0");
                if (matchedEp.NR_GES != ep.P179P1545.value && epNr != matchedEpNr){
                    var message = `Wikipedia: #${matchedEp.NR_GES} / ${matchedEpNr} ${matchedEp.OT}
Wikidata-ID from Wikidata: #${ep.P179P1545.value} / ${epNr} ${ep.Len.value}`;
                    if (confirm("fuzzy match?\n" + message)){
                        matchedEp = SetEpisodeAttributes(matchedEp, ep);
                        message = "matched:\n" + message;
                    }else{
                        message = "not matched:\n" + message;
                    }
                    console.log(message);
                }else{
                    matchedEp = SetEpisodeAttributes(matchedEp, ep);
                }
            }
        }
    }
    async function GetSeasonItems(qid){
        console.log("Loading season items from Wikidata…");
        var request = `SELECT ?quickstatements WHERE {
  BIND(wd:${qid} AS ?series)
  ?qid wdt:P31 wd:Q3464665;
    p:P179 _:s.
  _:s ps:P179 ?series;
    pq:P1545 ?number.
  BIND(CONCAT(REPLACE(STR(?series), ".*/", ""), "	P527	", REPLACE(STR(?qid), ".*/", ""), "	P1545	\\"", ?number, "\\"") AS ?quickstatements)
  MINUS {
    ?series p:P527 ?pQid.
    ?pQid ps:P527 ?qid.
    ?pQid pq:P1545 ?number.
  }
  FILTER NOT EXISTS {?qid wdt:P1 wd:Q${new Date() % 1000}.}
}
ORDER BY (xsd:integer(?number))`;
        var resp = await GetSparqlResponse(request);
        var sparqlSeasons = resp.results.bindings;
        return sparqlSeasons.map(i => i.quickstatements.value).join("\n");
    }
    async function GetFSData(fsId, episodes){
        var url = `https://www.fernsehserien.de/${fsId}/episodenguide`;
        console.log(`loading German labels and dates from Fernsehserien.de… (${url})`);
        var fsDatas = [];
        var response = await GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                return response;
            }
        });
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(response.responseText,"text/html");
        fsDatas = [...xmlDoc.querySelectorAll("a[data-event-category=liste-episoden]")].map(a => {return{"Lde": a.querySelector("div:nth-child(7)>span").innerText.replace(/^(.*?)(?=[^\d]{2}.) ?[,:\-–]? \(?(?:Teil )?(\d+)\)?/i,"$1 – Teil $2"), "Len": a.querySelector("div:nth-child(7)>span.episodenliste-schmal")?.innerText.replace(/ \(a\.k\.a\..*?\)/i,""), "nr": a.querySelector("div:nth-child(2)")?.firstChild?.nodeValue, "epNr": a.querySelector("span:nth-child(1)").innerText.replace(".","x"), "ead": a.querySelector("div:nth-child(8)").childNodes[0]?.data?.trim()}});
        if (fsDatas.length == 0)
            return;
        for (var ep of episodes){
            let ot = ep.OT;
            var fsData = fsDatas.filter(id => compareString(id.Len) == compareString(ot));
            if (fsData.length == 1){
                if (fsData[0].Lde != "–"){
                    ep.DT = fsData[0].Lde;
                    if (fsData[0].ead != "")
                        ep.EAD = fsData[0].ead;
                }
            }else{
                var matchedEp = fsDatas.reduce(function(prev, curr) {
                    return levenshteinDistance(compareString(prev.Len), compareString(ot)) < levenshteinDistance(compareString(curr.Len), compareString(ot)) ? prev : curr;
                });
                var epSeason;
                if (location.href.includes("season")){
                    epSeason = document.title.match(/season (\d+)\)/)[1];
                }else{
                    epSeason = ep.season + 1;
                }
                var epNr = epSeason + "x" + (ep.NR_ST.length == 1 ? "0" : "") + ep.NR_ST;
                if (matchedEp.Lde != "–"){
                    if (!((ep.NR_GES != matchedEp.nr || ep.NR_GES != matchedEp.nr - 1 || ep.NR_GES != matchedEp.nr + 1)
                        && (epSeason != matchedEp.epNr.split("x")[0] || epSeason + 1 != matchedEp.epNr.split("x")[0] || epSeason - 1 != matchedEp.epNr.split("x")[0])
                        && (ep.NR_ST != matchedEp.epNr.split("x")[1] || ep.NR_ST + 1 != matchedEp.epNr.split("x")[1] || ep.NR_ST - 1 != matchedEp.epNr.split("x")[1])))
                    {
                        var message = `Wikipedia: #${ep.NR_GES} / ${epNr} ${ot}
data from Fernsehserien.de: #${matchedEp?.nr ?? 0} / ${matchedEp.epNr} ${matchedEp.Len}`;
                        if (confirm("fuzzy match?\n" + message)){
                            ep.DT = matchedEp.Lde;
                            if (matchedEp.ead != "")
                                ep.EAD = matchedEp.ead;
                            message = "matched:\n" + message;
                        }else{
                            message = "not matched:\n" + message;
                        }
                        console.log(message);
                    }else{
                        ep.DT = matchedEp.Lde;
                        if (matchedEp.ead != "")
                            ep.EAD = matchedEp.ead;
                    }
                }
            }
        }
    }
    async function GetIMDbIds(imdbId, episodes){
        var url = `https://www.imdb.com/search/title/?series=${imdbId}&view=simple&sort=release_date,asc&count=250`;
        console.log(`loading IDs from IMDb… (${url})`);
        var imdbIds = [];
        var startEp = 1;
        var allEps = 0;
        do{
            var response = await GM.xmlHttpRequest({
                method: "GET",
                url: `${url}&start=${startEp}`,
                onload: function(response) {
                    return response;
                }
            });
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(response.responseText,"text/html");
            imdbIds = imdbIds.concat([...xmlDoc.querySelectorAll(".ipc-metadata-list-summary-item .dli-ep-title")].map(i => {return {"title": i.innerText, "id": i.firstChild.href.match(/tt\d+/)?.[0], "nr": i.parentElement.parentElement.querySelector(".dli-title").innerText.split(".")[0]}}));
            allEps = 250;
            startEp = startEp + 250;
        } while (imdbIds.length < allEps);
        for (var ep of episodes){
            let ot = ep.OT;
            let imdbId = imdbIds.filter(id => compareString(id.title) == compareString(ot));
            if (imdbId.length == 1){
                ep.imdb = imdbId[0].id;
            }else{
                var matchedEp = imdbIds.reduce(function(prev, curr) {
                    return levenshteinDistance(compareString(prev.title), compareString(ot)) <= levenshteinDistance(compareString(curr.title), compareString(ot)) ? prev : curr;
                });
                if (ep.NR_GES == matchedEp.nr || ep.NR_GES == Number(matchedEp.nr) + 1 || ep.NR_GES == Number(matchedEp.nr) - 1){
                    ep.imdb = matchedEp.id;
                }else{
                    var epSeason;
                    if (location.pathname.includes("season")){
                        epSeason = document.title.match(/season (\d+)\)/)[1];
                    }else{
                        epSeason = ep.season + 1;
                    }
                    var message = `Wikipedia: #${ep.NR_GES} / ${epSeason}x${(ep.NR_ST.length == 1 ? "0" : "")}${ep.NR_ST} ${ot}
IMDb-ID from IMDb: #${matchedEp.nr} ${matchedEp.title}`;
                    if (confirm("fuzzy match?\n" + message)){
                        ep.imdb = matchedEp.id;
                        message = "matched:\n" + message;
                    }else{
                        message = "not matched:\n" + message;
                    }
                    console.log(message);
                }
            }
        }
    }
    async function GetWikipediaLinks(episodes){
        console.log("Loading Wikidata items from Wikipedia links…");
        var cachedLinks = [];
        var cachedRequests = episodes.flatMap((i) => [
            ...i.DRB,
            ...i.REG,
            ...(i.SL ? [i.SL] : []),
        ]).map(i => encodeURIComponent(i)).join("|");
        var parts = cachedRequests.match(/(?:[^|]+\|){0,49}[^|]+/g);
        if (parts){
            for (var part of parts){
                var cachedRequestsResponse = await fetch(`/w/api.php?action=query&prop=pageprops&ppprop=wikibase_item&redirects=1&titles=${part}&format=json`);
                var { query: { redirects, pages } } = await cachedRequestsResponse.json();
                cachedLinks.push(...Object.values(pages).map(p => ({
                    name: redirects?.find(({ from }) => from === p.title)?.to || p.title,
                    qid: p.pageprops?.wikibase_item,
                })));
            }
        }
        cachedLinks = [...new Set(cachedLinks)];
        for (var ep of episodes){
            ep.DRBid = [];
            ep.REGid = [];
            for (let drb of ep.DRB){
                var cachedDRB = cachedLinks.find(i => i.name == drb);
                if (cachedDRB && cachedDRB.qid){
                    ep.DRBid.push(cachedDRB.qid);
                }
            }
            for (let reg of ep.REG){
                var cachedREG = cachedLinks.find(i => i.name == reg);
                if (cachedREG && cachedREG.qid){
                    ep.REGid.push(cachedREG.qid);
                }
            }
            if (ep.SL != ""){
                let epSL = ep.SL;
                var cachedSL = cachedLinks.find(i => i.name == epSL);
                if (cachedSL && cachedSL.qid){
                    ep.qid = cachedSL.qid;
                }
            }
        }
    }
})();
