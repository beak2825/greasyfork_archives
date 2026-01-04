// ==UserScript==
// @name         Webgame - svetovy trh - prodej
// @version      2025-3-15
// @description  Cena zbozi na trhu
// @author       yS
// @match        *://*.webgame.cz/wg/index.php?p=svetovy_trh&s=trhposlat*
// @match        *://*.webgame.cz/wg/index.php?p=svetovy_trh&s=techposlat*
// @match        *://*.webgame.cz/wg/index.php?p=technologie
// @match        *://*.webgame.cz/wg/index.php?p=technologie&s=technologie
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webgame.cz
// @namespace https://greasyfork.org/users/1005892
// @downloadURL https://update.greasyfork.org/scripts/457656/Webgame%20-%20svetovy%20trh%20-%20prodej.user.js
// @updateURL https://update.greasyfork.org/scripts/457656/Webgame%20-%20svetovy%20trh%20-%20prodej.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const market_prices = new Map();
    const gold_offset = document.getElementById("uLista").rows[0].cells[0].children[0].tagName == "IMG" ? 1 : 0;
    const is_technology_page = window.location.href.indexOf("p=technologie") !== -1;

    // trh = pridat k prodavaneho zbozi aktualni cenu na trhu (+ jeho pocet)
    let func = fetchPrices;
    let tables = [];
    let skipped_rows = [];
    let column_id = 4;
    let market_table_offset = 0;

    if (is_technology_page) {
        // stranka technologii - ulozime obe tabulky s technologiemi
        const nodes = document.forms[0].querySelectorAll("table");
        nodes.forEach((node) => {
            tables.push(node);
        });
    } else {
        // stranka trhu
        func = updateSkippedRows;
        addCurrentlySellingAmountsToCurrentPackages();
        tables.push(document.querySelector("form table"));
        column_id = 3;
        market_table_offset = 1;
    }

    // stranka technologii = preskocit

    // obe stranky -> pridat sloupecek do tabulky / tabulek zbozi / technologii, jaky je jeho aktualni pocet na trhu

    let urls = ["index.php?p=svetovy_trh&s=techkoupit", "index.php?p=svetovy_trh&s=trhkoupit"];
    let promise = fetchPage(urls[0], func);
    let promise_2 = fetchPage(urls[1], func);
    Promise.all([promise, promise_2]).then(() => {
        tables.forEach((table) => {
            addCurrentlySellingAmountsOnMarket(table);
            column_id++; // hack kvuli strance s technologiemi, kde vojenske maji o jeden sloupecek navic (zakladny)
        });
    });

    //////////////////////////////////////////
    //              FUNCTIONS               //
    //////////////////////////////////////////
    function addCurrentlySellingAmountsOnMarket(table) {
        const element = document.createElement("th");
        element.textContent = "Zboží na trhu";
        table.rows[0].insertBefore(element, table.rows[0].children[column_id]);

        for (let i = 1; i < table.rows.length - market_table_offset; i++) {
            const row = table.rows[i];
            const cell = row.insertCell(column_id);

            const commodity = row.children[0].innerText;
            const current_values = getValues(commodity);

            const amount_element = document.createElement("span");
            cell.appendChild(amount_element);
            amount_element.textContent = current_values[1].replace(/\B(?=(\d{3})+(?!\d))/g, ".");

            const price_element = document.createElement("span");
            cell.appendChild(price_element);
            price_element.textContent = " (" + current_values[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "$)";
        }

        if (market_table_offset === 1) table.rows[table.rows.length - market_table_offset].children[0].colSpan++;
    }

    function addCurrentlySellingAmountsToCurrentPackages() {
        let table_selling;
        const div = document.getElementById("icontent");
        const tables = div.getElementsByTagName("table");
        table_selling = tables[1];

        let th = document.createElement("th");
        th.innerHTML = "Aktualní cena";

        let rows = table_selling.rows;
        rows[0].insertBefore(th, rows[0].children[4 + gold_offset]);

        for (let i = 1; i < rows.length - 2; i++) {
            const cell = document.createElement("td");
            cell.innerHTML = "-";
            cell.classList.add("msaleprice");
            rows[i].insertBefore(cell, rows[i].children[6 + gold_offset]);
            skipped_rows.push(rows[i]);
        }

        for (let i = rows.length - 2; i < rows.length; i++) {
            rows[i].children[0].colSpan = 11;
        }
    }

    function getMarketTable(doc) {
        const div = doc.getElementById("icontent");
        const tables = div.getElementsByTagName("table");

        // gold ma navic "refreshovani tabulky" v tabulce pred
        return tables[gold_offset];
    }

    function getValues(name) {
        name = formatCommodityName(name);
        if (name == null) {
            return null;
        }

        return market_prices.get(name);
    }

    function getMarketPrices(table_market) {
        for (let i = 1; i < table_market.rows.length - 1; i++) {
            const row = table_market.rows[i];
            const name = row.children[0].innerText;

            const value = parseInt(row.children[4].innerText.replaceAll(" ", ""));
            const amount = row.children[2].innerText.replaceAll(" ", "");

            market_prices.set(name, [value, amount]);
        }
    }

    // Formats the name of the commodity
    // returns null if in the wrong market window (doesn't have price for it)
    function formatCommodityName(name) {
        name = name.split("Technologie ");
        if (name.length == 2) {
            name = name[1];
        } else {
            name = name[0];
        }

        name = name.split("(");
        name = name[0];

        name = name.replace(":", "");

        return name;
    }

    function comparePrices(price1, price2) {
        price2 = price2.slice(0, -1);
        return price1 < price2;
    }

    function fetchPrices(dom) {
        getMarketPrices(getMarketTable(dom));
    }

    function updateSkippedRows(dom) {
        fetchPrices(dom);

        for (let i = 0; i < skipped_rows.length; i++) {
            let values = getValues(skipped_rows[i].children[4 + gold_offset].innerText);
            if (values == null) {
                continue;
            }
            let price = values[0];
            let amount = parseInt(values[1]);
            const market_cheaper = comparePrices(price, skipped_rows[i].children[7 + gold_offset].innerText.replaceAll(" ", ""));

            const cell = skipped_rows[i].children[6 + gold_offset];
            cell.innerText = "";

            let div = document.createElement("div");
            div.innerText = price + "$";
            cell.append(div);

            div = document.createElement("div");
            div.innerText = "(" + new Intl.NumberFormat("de-DE").format(amount) + ")";
            cell.append(div);

            if (price != "-" && market_cheaper) {
                cell.style = "color: red;";
            }
        }
    }

    function fetchPage(url, callback) {
        return new Promise((resolve) => {
            let req = new XMLHttpRequest();
            req.open("GET", url);
            req.onload = function () {
                if (req.readyState == 4 && req.status == 200) {
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(req.response, "text/html");

                    resolve(callback(doc));
                }
            };
            req.send();
        });
    }
})();
