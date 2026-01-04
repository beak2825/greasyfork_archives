// ==UserScript==
// @name         Google Scholar Author Crawler
// @namespace    https://example.com/
// @version      1.0.1
// @description  Crawl author information from Google Scholar and export to TXT file
// @match        https://scholar.google.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465172/Google%20Scholar%20Author%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/465172/Google%20Scholar%20Author%20Crawler.meta.js
// ==/UserScript==

(async () => {
    const button = document.createElement("button");
    button.textContent = "Crawl Authors";
    button.style.position = "fixed";
    button.style.top = "20px";
    button.style.right = "100px";
    button.addEventListener("click", crawlAuthors);

    document.body.appendChild(button);

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    async function crawlAuthors() {
        const urlParams = new URLSearchParams(window.location.search);
        const label = urlParams.get("mauthors").match(/label:([^&]+)/)[1];
        const query = `label:${label}`;
        const authors = await crawlPage(window.location.href, []);
        const rangeElement = document.querySelector("span.gs_nph.gsc_pgn_ppn");
        const rangeText = rangeElement.textContent.trim();
        const startRange = parseInt(rangeText.split(" ")[0]);
        const endRange = parseInt(rangeText.split(" ")[2]);
        const fileName = `${query}_${startRange}-${endRange}.txt`;
        exportToTxt(authors, fileName);
    }

    async function crawlPage(url, authors) {
        return new Promise(async (resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: async (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");

                    for (const author of doc.querySelectorAll("div.gs_ai")) {
                        const name = author.querySelector("h3.gs_ai_name > a").textContent.trim();
                        const affiliation = author.querySelector("div.gs_ai_aff").textContent.trim();
                        const fieldsLinks = author.querySelectorAll("div.gs_ai_int > a.gs_ai_one_int");
                        const separator = ",";
                        const fields = Array.from(fieldsLinks).map(link => link.textContent.trim().toLowerCase().replace(/[^a-zA-Z0-9]/g, ' ')).join(separator);
                        const citation_count_element = author.querySelector("div.gs_ai_cby");
                        const citation_count_match = citation_count_element.textContent.match(/\d+/);
                        const citation_count = citation_count_match ? citation_count_match[0] : "";
                        const profileLink = "https://scholar.google.com" + author.querySelector("h3.gs_ai_name > a").getAttribute("href");

                        const hIndex = await fetchAuthorHIndex(profileLink);

                        authors.push({
                            "Name": name,
                            "Affiliation": affiliation,
                            "Fields": fields,
                            "Citation Count": citation_count,
                            "Profile Link": profileLink,
                            "H-index": hIndex,
                        });
                    }

                    resolve(authors);
                    await delay(1000);
                }
            });
        });
    }

    async function fetchAuthorHIndex(profileLink) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: profileLink,
                onload: (response) => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const hIndex = doc.querySelectorAll("td.gsc_rsb_std")[2].textContent.trim();
                    resolve(hIndex);
                },
            });
        });
    }

    function exportToTxt(authors, fileName) {
        const lines = [
            "Name\tAffiliation\tFields\tCitation Count\tProfile Link\tH-index",
            ...authors.map(
                (a) =>
                `${a.Name}\t${a.Affiliation}\t${a.Fields}\t${a["Citation Count"]}\t${a["Profile Link"]}\t${a["H-index"]}`
            ),
        ];
        const content = lines.join("\n");
        const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();

        URL.revokeObjectURL(url);
    }
})();
