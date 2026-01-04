// ==UserScript==
// @name         Auto abogados
// @namespace    es.csnv.auto-abogados
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://oficina.icamalaga.es/web/ColegiadoBusqueda.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398044/Auto%20abogados.user.js
// @updateURL https://update.greasyfork.org/scripts/398044/Auto%20abogados.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONTINUE = true;
    const RESULTS_TABLE_INDEX = 5;
    const lastIndex = localStorage.getItem("LAST_INDEX"); // Previously run

    const idNext = "#ctl00_MainContent_gridColegiados_ctl00_paginador_imgNext";
    const idList = "#ctl00_MainContent_gridColegiados_ctl00_paginador_lstListaPaginas";
    const indexedDB = window.indexedDB;

    const queries = {
        NOMBRE: "span#ctl00_MainContent_WebGroupBox2_lblColegiado",
        EMAIL: "span#ctl00_MainContent_WebGroupBox2_lblEmail",
        ESTADO: "span#ctl00_MainContent_WebGroupBox2_lblEstado"
    };

    let _data;

    /**
     * Get data from table and request each one individually
     */
    const process = async () => {
        const list = document.querySelector(idList);
        if (!list) {
            return;
        }

        const index = list.selectedIndex;

        if (CONTINUE && lastIndex > index) { // Resume
            list.selectedIndex = lastIndex;
            next();
            return;
        }

        // Get the desired result, as it changes
        const table = document.querySelectorAll("table")[RESULTS_TABLE_INDEX];
        // Get each result profile url
        const links = table.querySelectorAll("tr td:nth-child(2) a");
        // Request each url, parse as plaint text
        const promises = Array.from(links).map(a => fetch(a.href).then(resp => resp.text()));
        // Wait for all
        Promise.all(promises).then(all => {
            const data = all.map(each => {
                // Convert to HTML for easy manipulation
                const div = document.createElement("div");
                div.innerHTML = each;

                const getInnerText = (o) => o ? o.innerText : null;

                return {
                    nombre: getInnerText(div.querySelector(queries.NOMBRE)) || "Sin nombre",
                    email: getInnerText(div.querySelector(queries.EMAIL)) || new Date().getTime(),
                    estado: getInnerText(div.querySelector(queries.ESTADO)) || "Sin estado"
                };


            });
            store(data);
        });
        next();
    };

    /**
     * Store data in IndexedDB
     */
    const store = (arr) => {
        return new Promise((res, rej) => {
            const request = indexedDB.open("abogados", 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("abogados", { keyPath: "email"});
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["abogados"], "readwrite");
                const store = transaction.objectStore("abogados");

                arr.forEach(data => store.put(data));

                transaction.oncomplete = res;
                transaction.onerror = rej;
            };
        });
    };

    /**
     * Next page, old fashioned timing
     */
    const next = () => {
        const next = document.querySelector(idNext);
        const list = document.querySelector(idList);
        const oldIndex = list.selectedIndex;
        localStorage.setItem("LAST_INDEX", oldIndex);

        if (!next || (list.options.length - 1) === oldIndex) { // End reached, show message
            release();
            return;
        }

        const interval = setInterval(() => {
            if (oldIndex !== document.querySelector(idList).selectedIndex) {
                // Current page number has changed at least, process this page
                clearInterval(interval);
                process();
            }
        }, 1);

        next.click();
    };

    /**
     * Display and update number of results retreived
     */
    const updateCounter = (num) => {
        const current = document.querySelector("#counter > #num");

        if (!current) {
            onMessage(`
                <span id="counter"><span id="num">${num}</span> resultados</span>
            `)
            return;
        }

        const total = parseInt(current.innerHTML) + num;
        current.innerHTML = total;
    };

    /**
     * Construct popup
     */
    const onMessage = (mes) => {
        let message = document.getElementById("mess");

        if (!message) {
            message = `<div id="mess" style="position: absolute;
                top: 20px;
                right: 20px;
                background: #fff0a8;
                padding: 5px 10px;
                border-radius: 5px 5px;
                line-height: 2rem;
                border: 1px solid black;
                box-shadow: 1px 1px 7px -1px;">
            </div>`;

            document.body.innerHTML += message;
            message = document.getElementById("mess");
        }

        message.innerHTML = mes;
    };

    /**
     * Display popup
     */
    const release = () => {
        onMessage(`
            <span style="margin-right: 1rem;">¿Imprimir datos ahora?</span>
            <div style="float: right"><button id="imp">Imprimir</button></div>
            </div>`);

        document.getElementById("imp").addEventListener("click", onPrint, {});
    };

    /**
     * Destroy current HTML and create table
     */
    const onPrint = async () => {
        _data = await collect();
        
        document.open();
        document.write(`
<html>
    <head>
    </head>
    <body>
        <table>
            `);
            for (var i = 0; i < _data.length; i++) {
                const current = _data[i];
                if (current.estado !== "EJERCIENTE")
                    continue;
                document.write(`
                <tr><td>${getName(current.nombre)} &lt;${current.email}&gt;,</td></tr>
                `);
            }
        document.write(`  
        </table>
    <body>
</html>
        `);
        document.close();

        // Delete db entries
        clear();
        // Remove bookmark
        localStorage.setItem("LAST_INDEX", null);
    };

    /**
     * Converts this:
     * [3456] NOMBRE APELLIDOS
     * to this:
     * Nombre Apellidos
     */
    const getName = (rawName) => {
        const arrName = rawName.split("]");
        const name = (arrName[1] || arrName[0]).trim();

        return name[0].toUpperCase() + name.slice(1).toLowerCase();
    }

    /**
     * Get data from IndexedDB
     */
    const collect = () => {
        return new Promise((res, rej) => {
            const request = indexedDB.open("abogados", 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("abogados", { keyPath: "email"});
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["abogados"], "readwrite");
                const store = transaction.objectStore("abogados");
                const request = store.getAll();

                request.onsuccess = (data) => res(data.target.result);
                transaction.onerror = rej;
            };
        });

    };

    /**
     * Deletes all db entries
     */
    const clear = () => {
        return new Promise((res, rej) => {
            const request = indexedDB.open("abogados", 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore("abogados", { keyPath: "email"});
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(["abogados"], "readwrite");
                const store = transaction.objectStore("abogados");
                const request = store.clear();

                request.onsuccess = res;
                transaction.onerror = rej;
            };
        });
    };

    const error = (err) => console.error(err);

    process();
})();