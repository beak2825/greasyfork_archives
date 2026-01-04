// ==UserScript==
// @name         FilmoFix
// @version      0.3.1
// @description  Fixing the filmography of people on Wikipedia pages by fetching data from Wikidata and IMDb.
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[FilmoFix]%20
// @match        https://de.wikipedia.org/wiki/*
// @connect      wikidata.org
// @connect      www.imdb.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=de.wikipedia.org
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545685/FilmoFix.user.js
// @updateURL https://update.greasyfork.org/scripts/545685/FilmoFix.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
/* globals mw */
(function() {
    "use strict";
    let filmogWikitext;
    let wikitextHeader;
    let changed = false;


    /**
     * Gets IMDb-ID using mw.config and API.
     */
    async function getImdbIdMw() {
        const wikidataId = mw.config.get("wgWikibaseItemId");
        if (wikidataId) {
            try {
                const resp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
                const claims = (await resp.json()).entities[wikidataId].claims;
                const imdb = claims?.P345?.[0]?.mainsnak?.datavalue?.value;
                if (imdb) return imdb;
            } catch {
                console.error("Error loading Wikidata data.");
            }
        }
        const title = mw.config.get("wgPageName");
        if (title) {
            try {
                const api = new mw.Api();
                const wikitext = (await api.get({action:"parse",page:title,prop:"wikitext",format:"json"})).parse.wikitext["*"];
                const m = wikitext.match(/\{\{IMDb\|([^}|\n]+)[^}]*}}/i);
                if (m && /^nm\d{7,8}$/.test(m[1])) return m[1];
            } catch {
                console.error("Error loading Wikipedia data.");
            }
        }
        const imdbLink = document.querySelector("a[href*='imdb.com/name/nm']");
        return imdbLink?.href.match(/nm\d{7,8}/)?.[0] || null;
    }

    /**
     * Gets wikitext from filmography section.
     */
    async function getFilmographyWikitext() {
        const title = mw.config.get("wgPageName");
        if (!title) return null;
        try {
            const api = new mw.Api();
            const wikitext = (await api.get({action:"parse",page:title,prop:"wikitext",format:"json"})).parse.wikitext["*"];
            var wikitextMatch = wikitext.match(/(==\s*Filmogra(?:f|ph)ie[^=]*==)([\s\S]*?)(?:\n==[\w ]|$)/i);
            wikitextHeader = wikitextMatch?.[1];
            return wikitextMatch?.[2]?.trim() || null;
        } catch {
            console.error("Error loading Wikipedia data.");
        }
        return null;
    }

    /**
     * Parses entries from filmography section.
     */
    function parseFilmographyFromWikitext(wikitext) {
        return wikitext.split(/\r?\n/).filter(l => /^[*#]/.test(l.trim())).map(line => {
            const year = line.match(/^(?:[*#]\s*)?(\d{4}(?:[–-]\d{4})?(?:,\s*\d{4})?):/)?.[1] || null;
            let dt = line.replace(/^.*?:\s*/, "").split("(")[0].split("''")[0].replace(/\[\[|]]/g, "").replace(" - ", " – ").replace("'", "’").replace("...", "…").trim();
            const ot = (line.match(/\(''(.+?)''\)/)?.[1] || line.match(/''(.+?)''/)?.[1]?.replace(/^\(|\)$/g, ""))?.replace(" - ", " – ")?.replace("'", "’")?.replace("...", "…") || null;
            const link = [...line.matchAll(/\[\[([^|\]]+)/g)][0]?.[1] || null;
            return { year, dt, ot, link, raw: line };
        });
    }

    /**
     * Gets Wikidata entries using sparql and IMDb ids.
     */
    async function fetchWikidataForImdbIds(imdbWorks) {
        if (!imdbWorks.length) return [];
        const values = imdbWorks.map(w => w.imdbid).filter(Boolean).map(id => `"${id}"`).join(" ");
        if (!values) return [];
        const sparql = `SELECT ?item ?imdb ?dt ?ot ?dewiki WHERE {
      VALUES ?imdb { ${values} }
      ?item wdt:P345 ?imdb.
      OPTIONAL { ?item rdfs:label ?dt FILTER(LANG(?dt) = "de") }
      OPTIONAL { ?item rdfs:label ?enLabel FILTER(LANG(?enLabel) = "en") }
      OPTIONAL { ?item wdt:P1476 ?origTitle. }
      OPTIONAL { _:t schema:about ?item; schema:isPartOf <https://de.wikipedia.org/>; schema:name ?dewiki.}
      BIND(COALESCE(?origTitle, ?enLabel) AS ?ot)
    }`;
        const url = "https://query.wikidata.org/sparql?format=json&query=" + encodeURIComponent(sparql);
        const resp = await fetch(url);
        const json = await resp.json();
        json.results.bindings?.forEach(o => Object.values(o).forEach(v => v.value?.replace && (v.value = v.value.replace(/ - /g, " – ").replace(/'/g, "’").replace("...", "…"))));
        return json.results.bindings;
    }

    /**
     * Gets IMDb filmography entries using the actors imdb id.
     */
    async function fetchImdbFilmography(imdbId) {
        let isMale = true;
        try {
            const wikidataId = mw.config.get("wgWikibaseItemId");
            if (wikidataId) {
                const resp = await fetch(`https://www.wikidata.org/wiki/Special:EntityData/${wikidataId}.json`);
                const claims = (await resp.json()).entities[wikidataId].claims;
                const gender = claims?.P21?.[0]?.mainsnak?.datavalue?.value?.id;
                if (gender === "Q6581072") isMale = false; // weiblich
            }
        } catch {
            console.error("Error loading Wikidata data.");
        }
        const hash = isMale ? "ea0a755edec9c6292437b817e9a91e81e98262e85afd49bc1d5c7a0a498cf39b" : "f0aa46008175b841ba1364b1828ab30fcf4d989f4c617e196375fa29c81d3ace";
        const url = `https://caching.graphql.imdb.com/?operationName=NameMainFilmographyPaginatedCredits&variables={"id":"${imdbId}","includeUserRating":false,"locale":"de-DE"}&extensions={"persistedQuery":{"sha256Hash":"${hash}","version":1}}`;
        try {
            var data = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: {"Content-Type": "application/json","x-imdb-user-country": "DE"},
                    onload: r => resolve(JSON.parse(r.responseText)),
                    onerror: reject
                });
            });
            if (data.errors) {
                console.error("Error loading IMDb data.");
                return [];
            }
            const works = isMale ? data.data?.name?.actor_credits?.edges : data.data?.name?.actress_credits?.edges;
            return (works || []).map(e => {
                const n = e.node;
                return {
                    year: n.episodeCredits?.yearRange?.year || n.title.releaseYear?.year || null,
                    dt: n.title.titleText?.text?.replace(" - ", " – ")?.replace(/'/g, "’")?.replace("...", "…") || "",
                    ot: n.title.originalTitleText?.text?.replace(" - ", " – ")?.replace(/'/g, "’")?.replace("...", "…") || "",
                    imdbid: n.title.id || "",
                    type: n.title.titleType?.text || ""
                };
            });
        } catch {
            console.error("Error loading IMDb data.");
            return [];
        }
    }

    /**
    * Starts the check of the filmography
    */
    async function startFilmographyCheck() {
        const imdbId = await getImdbIdMw();
        if (!imdbId) {
            alert("IMDb-ID konnte nicht gefunden werden!");
            return;
        }
        const link = document.querySelector('[title^="Quellcode des Abschnitts bearbeiten: Filmo"]');
        const entries = parseFilmographyFromWikitext(filmogWikitext);
        if (!link || !entries.length) {
            alert("Keine Filmografie-Einträge im Wikitext gefunden!");
            return;
        }

        const loading = addLoadingButton(link);

        const imdbWorks = await fetchImdbFilmography(imdbId);

        const wikidataItems = await fetchWikidataForImdbIds(imdbWorks);

        /**
        * Add loading icon
        */
        function addLoadingButton(link) {
            const p = link.closest(".mw-editsection");
            const loading = document.createElement("span");
            loading.innerHTML = `<img src="https://upload.wikimedia.org/wikipedia/commons/5/59/RefToolbar_spinning_throbber.gif" alt="Lädt..." style="vertical-align:middle">`;
            const sep = document.createElement("span");
            sep.className = "mw-editsection-divider";
            sep.textContent = " | ";
            p.insertBefore(sep, p.lastChild);
            p.insertBefore(loading, p.lastChild);
            return loading;
        }

        /**
        * Finds matching Wikidata entry by german or original title
        */
        function findWikidataMatch(entry) {
            return wikidataItems.find(i => (i.dt && entry.dt && i.dt.value?.toLowerCase() === entry.dt.toLowerCase()) || (i.ot && entry.ot && i.ot.value?.toLowerCase() === entry.ot.toLowerCase()))
            || wikidataItems.find(i => (i.dt && entry.dt && entry.dt.length > 6 && levenshteinDistance(i.dt.value?.toLowerCase(),entry.dt.toLowerCase()) < 3 || (i.ot && entry.ot && entry.ot.length > 6 && levenshteinDistance(i.ot.value?.toLowerCase(),entry.ot.toLowerCase()) < 3)));
            // || wikidataItems.find(i => i.dt?.value && entry.dt && (i.dt.value.toLowerCase().includes(entry.dt.toLowerCase()) || entry.dt.toLowerCase().includes(i.dt.value.toLowerCase())))
            // || wikidataItems.find(i => i.ot?.value && entry.ot && (i.ot.value.toLowerCase().includes(entry.ot.toLowerCase()) || entry.ot.toLowerCase().includes(i.ot.value.toLowerCase())));
        }

        /**
        * Finds matching IMDb entry by german or original title
        */
        function findImdbMatch(entry) {
            return imdbWorks.find(i => (i.ot && entry.ot && i.ot.toLowerCase() == entry.ot.toLowerCase()) || (i.dt && entry.dt && i.dt.toLowerCase() == entry.dt.toLowerCase()))
            || wikidataItems.find(i => (i.ot && entry.ot && entry.ot.length > 6 && levenshteinDistance(i.ot.value?.toLowerCase(),entry.ot.toLowerCase()) < 3 || (i.dt && entry.dt && entry.dt.length > 6 && levenshteinDistance(i.dt.value?.toLowerCase(),entry.dt.toLowerCase()) < 3)));
            // || imdbWorks.find(i => i.dt && entry.dt && (i.dt.toLowerCase().includes(entry.dt.toLowerCase()) || entry.dt.toLowerCase().includes(i.dt.toLowerCase())))
            // || imdbWorks.find(i => i.ot && entry.ot && (i.ot.toLowerCase().includes(entry.ot.toLowerCase()) || entry.ot.toLowerCase().includes(i.ot.toLowerCase())));
        }

        function levenshteinDistance(str1, str2){
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

        /**
        * Inserts original title in line if needed
        */
        function insertOTHtml(html, ot, color, entry) {
            const endOfTitle = html.indexOf("\">");
            const lastOpen = html.indexOf("(", endOfTitle);
            const lastClose = html.indexOf(")", endOfTitle);
            const before = lastOpen >= 0 ? html.slice(0, lastOpen).trimEnd() : html;
            const paren = lastOpen >= 0 && lastClose > lastOpen ? html.slice(lastOpen + 1, lastClose) : "";
            const rest = paren ? paren.replace(/^<i>.+?<\/i>\s*,?\s*/,"") : "";
            const otSpan = `<span style='font-style:italic;background:${color}' title='${entry.ot ?? ""}'>${ot}</span>`;
            return before + " (" + otSpan + (rest ? ", " + rest : "") + ")";
        }

        // fuzzy matching
        entries.forEach((entry) => {
            const wd = findWikidataMatch(entry);
            const imdb = findImdbMatch(entry);
            const diffDt = wd && wd.dt?.value && wd.dt.value !== entry.dt;
            let diffOt = false;
            if (wd && wd.ot?.value) {
                let dtNorm = (entry.dt || "").trim().toLowerCase();
                let otNorm = wd.ot.value.trim().toLowerCase();
                diffOt = wd.ot.value !== entry.ot && dtNorm !== otNorm;
            }
            const diffImdbYear = imdb && imdb.year && imdb.year != entry.year && !entry.year?.includes(",") && !entry.year?.includes("-") && !entry.year?.includes("–");
            const diffImdbOt = imdb && imdb.ot && imdb.ot != entry.ot && imdb.ot != entry.dt;
            const diffImdbDt = imdb && imdb.dt && imdb.dt != entry.dt && imdb.dt != imdb.ot;
            // check if OT already inside brackets
            let otAlreadyPresent = false;
            if (wd && wd.ot?.value) {
                let m = entry.raw.match(/\((.*)\)/);
                if (m && m[1]) {
                    let parenNorm = m[1].replace(/''/g, "").toLowerCase();
                    let otNorm = wd.ot.value.trim().toLowerCase();
                    otAlreadyPresent = parenNorm.includes(otNorm);
                }
            }
            // check entries with matching title
            let candidates = Array.from(document.querySelectorAll("li"));
            candidates.forEach(li => {
                let html = li.innerHTML;
                let origHtml = html;
                if (entry.dt && html.includes(entry.dt)) {
                    // Wikidata OT
                    if (wd && diffOt && wd.ot.value && !otAlreadyPresent) {
                        html = insertOTHtml(html, wd.ot.value, entry.ot ? "#ffeebb" : "#d6ffd6", entry);
                    }
                    // IMDb OT
                    if (imdb && diffImdbOt && !wd && imdb.ot) {
                        html = insertOTHtml(html, imdb.ot, entry.ot ? "#ffeebb" : "#d6ffd6", entry);
                    }
                    // IMDb year
                    if (imdb && diffImdbYear && imdb.year) {
                        html = html.replace(entry.year, `<span style='background:#ffeebb' title='${entry.year}'>${imdb.year}</span>`);
                    }
                    // Wikidata link
                    if (wd && wd.dewiki?.value && !html.includes("<a ") && entry.dt && html.includes(entry.dt)) {
                        html = html.replace(entry.dt, `<span style='background:#d6ffd6' title='${entry.dt}'><a href="${wd.dewiki.value}" target="_blank">${entry.dt}</a></span>`);
                    }
                    if (!html.includes("<a ")) {
                        // IMDb DT
                        if (imdb && diffImdbDt && !wd) {
                            html = html.replace(entry.dt, `<span style='background:#ffeebb' title='${entry.dt}'>${imdb.dt}</span>`);
                        }
                        // Wikidata DT
                        if (wd && diffDt) {
                            html = html.replace(entry.dt, `<span style='background:#ffeebb' title='${entry.dt}'>${wd.dt.value}</span>`);
                        }
                    }
                    if (html !== origHtml) {
                        li.innerHTML = html;
                        changed = true;
                    }
                }
            });
        });

        const a = Object.assign(document.createElement("a"), {
            href: "#",
            textContent: changed ? "Filmografie anpassen" : "✓",
            title: changed ? "Klicken, um veränderte Filmografie zu kopieren und Abschnitt zu bearbeiten" : "Keine Änderungen notwendig",
            onclick: changed ? e => {
                e.preventDefault();
                // use original Filmography wikitext and entries for replacement
                let lines = filmogWikitext.split(/\r?\n/);
                let entryIdx = 0;
                let newLines = lines.map(line => {
                    if (!/^[*#]/.test(line.trim())) return line; // no headers
                    let entry = entries[entryIdx++];
                    if (!entry) return line;
                    let newLine = line;
                    // check for changes
                    const wd = findWikidataMatch(entry);
                    const imdb = findImdbMatch(entry);
                    const diffDt = wd && wd.dt?.value && wd.dt.value !== entry.dt;
                    let diffOt = false;
                    if (wd && wd.ot?.value) {
                        let dtNorm = (entry.dt || "").trim().toLowerCase();
                        let otNorm = wd.ot.value.trim().toLowerCase();
                        diffOt = wd.ot.value !== entry.ot && dtNorm !== otNorm;
                    }
                    const diffImdbYear = imdb && imdb.year && imdb.year != entry.year && !entry.year?.includes(",") && !entry.year?.includes("-") && !entry.year?.includes("–");
                    const diffImdbOt = imdb && imdb.ot && imdb.ot != entry.ot;
                    const diffImdbDt = imdb && imdb.dt && imdb.dt != entry.dt && imdb.dt != imdb.ot;
                    let otAlreadyPresent = false;
                    if (wd && wd.ot?.value) {
                        let m = entry.raw.match(/\((.*)\)/);
                        if (m && m[1]) {
                            let parenNorm = m[1].replace(/''/g, "").toLowerCase();
                            let otNorm = wd.ot.value.trim().toLowerCase();
                            otAlreadyPresent = parenNorm.includes(otNorm);
                        }
                    }
                    // Wikidata OT
                    if (wd && diffOt && wd.ot?.value && wd.dt?.value && wd.ot.value != wd.dt.value && !otAlreadyPresent) {
                        const endOfTitle = newLine.indexOf("]");
                        const lastOpen = newLine.indexOf("(", endOfTitle);
                        const lastClose = newLine.indexOf(")", endOfTitle);
                        let base = lastOpen >= 0 && lastClose > lastOpen ? newLine.slice(0, lastOpen).trimEnd() + newLine.slice(lastClose + 1) : newLine;
                        let paren = lastOpen >= 0 && lastClose > lastOpen ? newLine.slice(lastOpen + 1, lastClose) : "";
                        let rest = paren ? paren.replace(/^''.+?''\s*,?\s*/,"") : "";
                        let newParen = `''${wd.ot.value}''` + (rest ? ", " + rest : "");
                        newLine = base + " (" + newParen + ")";
                        newLine = newLine.replace(/'''' \(''(.*)'', [^)]+\)/,"''($1)''");
                    }
                    // IMDb OT (when Wikidata OT doesn't exist)
                    else if (imdb && diffImdbOt && !wd && imdb.ot && imdb.ot != imdb.dt) {
                        const endOfTitle = newLine.indexOf("]");
                        const lastOpen = newLine.indexOf("(", endOfTitle);
                        const lastClose = newLine.indexOf(")", endOfTitle);
                        let base = lastOpen >= 0 && lastClose > lastOpen ? newLine.slice(0, lastOpen).trimEnd() + newLine.slice(lastClose + 1) : newLine;
                        let paren = lastOpen >= 0 && lastClose > lastOpen ? newLine.slice(lastOpen + 1, lastClose) : "";
                        let rest = paren ? paren.replace(/^''[^']+''\s*,?\s*/,"") : "";
                        let newParen = `''${imdb.ot}''` + (rest ? ", " + rest : "");
                        newLine = base + " (" + newParen + ")";
                        newLine = newLine.replace(/'''' \(''(.*)'', [^)]+\)/,"''($1)''");
                    }
                    // IMDb year
                    if (imdb && diffImdbYear && imdb.year) {
                        newLine = newLine.replace(entry.year, imdb.year);
                    }
                    // Wikidata link
                    if (wd && wd.dewiki && !newLine.includes("[[")) {
                        newLine = newLine.replace(entry.dt, `[[${(wd.dewiki.value != entry.dt ? wd.dewiki.value + "|" : "")}${entry.dt}]]`);
                    }
                    if (!newLine.includes("[[")) {
                        // IMDb DT (when Wikidata DT doesn't exist)
                        if (imdb && diffImdbDt && !wd) {
                            newLine = newLine.replace(entry.dt, imdb.dt).replace(/\[\[(.*)\|\1]]/, "[[$1]]");
                        }
                        // Wikidata DT
                        if (wd && diffDt) {
                            newLine = newLine.replace(entry.dt, wd.dt.value).replace(/\[\[(.*)\|\1]]/, "[[$1]]");
                        }
                    }
                    return newLine;
                });
                let wikitext = [wikitextHeader, ...newLines].join("\n");
                navigator.clipboard.writeText(wikitext).then(() => {a.textContent = "Filmografie kopiert"; link.click()});
            } : null,
        });
        loading.replaceWith(a);
    }

    setTimeout(async()=>{
        filmogWikitext = await getFilmographyWikitext();
        if (!filmogWikitext){
            return;
        }
        await startFilmographyCheck();
    }, 1000);
})();