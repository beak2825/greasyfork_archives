// ==UserScript==
// @name         sayakch PE risk script
// @namespace    http://tampermonkey.net/
// @version      2025-01-23
// @license      MIT
// @description  PE risk OE metric
// @author       @sayakch
// @match        https://phonetool.amazon.com/users/*
// @icon         https://badgephotos.corp.amazon.com/?uid=sayakch
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/525146/sayakch%20PE%20risk%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/525146/sayakch%20PE%20risk%20script.meta.js
// ==/UserScript==

(async function() {

    var gmRequest = (url, options, retryTimeout = 1e4, retryLimit = 5) => new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: typeof url === "string" ? url : url.href,
            method: options?.method ?? "GET",
            ...options,
            onload: (res) => {
                res.ok = res.status > 100 && res.status < 400;
                res.json = async () => JSON.parse(res.responseText);
                res.text = async () => res.responseText;
                resolve(res);
            },
            onerror: (err) => {
                if (retryLimit > 0) {
                    gmRequest(url, options, retryTimeout * 2, retryLimit - 1).then(resolve).catch(reject);
                } else {
                    reject(err);
                }
            }
        });
    });

    var policyCache = {};
    const ACKED = "Acked";
    const ACKED_STATUS_NO = "NO";
    const ACKED_STATUS_YES = "YES";
    const PLANNED_TO_FIX_BY = "Plan to fix by";
    const Status = {
        RED: "RED",
        GREEN: "GREEN",
        YELLOW: "YELLOW"
    };


    function parseCSVLineWithQuotes(line) {
        const values = [];
        let current = "";
        let insideQuote = false;
        for (let i = 0; i < line.length; i++) {
            if (insideQuote && line[i] === '"' && line[i + 1] === '"') {
                current += '"';
                i++;
            } else if (line[i] === '"') {
                insideQuote = !insideQuote;
            } else if (line[i] === "," && !insideQuote) {
                values.push(current.trim());
                current = "";
            } else {
                current += line[i];
            }
        }
        values.push(current.trim());
        return values;
    }

    function calculatePEScore(data) {
        let status;
        const currDate = new Date();
        let overDueCount = 0, openRiskCount = 0, unAckRiskDueIn15Days = 0, ackRiskDueIn25Days = 0, unAckRiskCount = 0, isRed = false, isYellow = false;
        data.forEach(row => {
            const dueDate = new Date(row[PLANNED_TO_FIX_BY]);
            openRiskCount++;

            if (row[ACKED] === ACKED_STATUS_NO) {
                unAckRiskCount++;
            }
            if (dueDate < currDate) {
                overDueCount++;
                isRed = true;
            } else {
                if (row[ACKED] == ACKED_STATUS_NO) {
                    if ((dueDate - currDate) < 15*24*60*60*1000) {
                        isYellow = true;
                        unAckRiskDueIn15Days++;
                    }
                } else {
                    if ((dueDate - currDate) < 25*24*60*60*1000) {
                        isYellow = true;
                        ackRiskDueIn25Days++;
                    }
                }
            }
        });

        if(isRed) return {
            status: Status.RED,
            overDueCount: overDueCount,
            openRisks: openRiskCount,
            unAckRiskDueIn15Days: unAckRiskDueIn15Days,
            ackRiskDueIn25Days: ackRiskDueIn25Days,
            unAckRiskCount: unAckRiskCount
        };
        else if(isYellow) return {
            status: Status.YELLOW,
            overDueCount: overDueCount,
            openRisks: openRiskCount,
            unAckRiskDueIn15Days: unAckRiskDueIn15Days,
            ackRiskDueIn25Days: ackRiskDueIn25Days,
            unAckRiskCount: unAckRiskCount
        };
        else return {
            status: Status.GREEN,
            overDueCount: overDueCount,
            openRisks: openRiskCount,
            unAckRiskDueIn15Days: unAckRiskDueIn15Days,
            ackRiskDueIn25Days: ackRiskDueIn25Days,
            unAckRiskCount: unAckRiskCount
        };
    }

    function convertJSONToTable(peScore) {
        // console.log('jsonDate: ' + jsonData[0]);
        let headers = ['status', 'overDueCount', 'openRisks', 'unAckRiskDueIn15Days', 'ackRiskDueIn25Days', 'unAckRiskCount'];
        let table = '<table><thead><tr>';
      
        headers.forEach(header => table += `<th>${header}</th>`);
        table += '</tr></thead><tbody>';

        table += '<tr>';
        headers.forEach(header => { 
            table += `<td>${peScore[header]}</td>`
        });
        table += '</tr>';
      
        // jsonData.forEach(row => {
        //   table += '<tr>';
        //   headers.forEach(header => table += `<td>${row[header]}</td>`);
        //   table += '</tr>';
        // });
      
        table += '</tbody></table>';
      
        return table;
      }

    async function getAndParseCSV(alias) {
        if (policyCache[alias]) {
            return policyCache[alias];
        }
        const url = `https://policyengine.amazon.com/entities/${alias}.csv`;
        const res = await gmRequest(url);
        console.log('Sayak res: ' + JSON.stringify(await res.text()));
        if (res.ok) {
            const text = (await res.text()).trim();
            const lines = text.split(/\s*\r?\n\s*/);

            const headers = parseCSVLineWithQuotes(lines[0]);
            const data = lines.slice(1).map((line) => {
                const values = parseCSVLineWithQuotes(line);
                return headers.reduce(
                    (acc, header, index) => ({
                        ...acc,
                        [header]: values[index]?.trim() ?? ""
                    }),
                    {}
                );
            });
            policyCache[alias] = data;
            return data;
        } else {
            throw new Error(`Failed to fetch CSV: ${res.status}`);
        }
    }
    console.log('Sayak res: ');

    let currAlias = window.location.href.slice(35);

    const data = await getAndParseCSV(currAlias).catch((err) => {
        log.error(err);
        return err.message;
      });

    console.log(JSON.stringify(data));
    const peScore = calculatePEScore(data);
    console.log('Sayak PE score = ' + JSON.stringify(peScore));
    const table = convertJSONToTable(peScore);
    console.log(table);

    const tableElement = document.createElement('table');
    tableElement.id = 'pe-risk-score-table';
    
    document.getElementById('widgets1').appendChild(tableElement);
    document.getElementById('pe-risk-score-table').innerHTML = table;

    // Style the table
    tableElement.style.width = '100%';
    tableElement.style.borderCollapse = 'collapse';
    tableElement.style.marginTop = '20px';

    // Style the table header
    const thead = tableElement.querySelector('thead');
    thead.style.backgroundColor = 'Black';
    thead.style.color = 'white';

    // Style the header cells (th)
    const thElements = thead.getElementsByTagName('th');
    for (let th of thElements) {
      th.style.padding = '10px';
      th.style.textAlign = 'center';
    }

    // Style the table rows (tr)
    const rows = tableElement.querySelectorAll('tbody tr');
    for (let row of rows) {
      row.style.backgroundColor = '#f2f2f2';
    }

    // Style the table cells (td)
    const tdElements = tableElement.querySelectorAll('td');
    for (let td of tdElements) {
      td.style.padding = '10px';
      td.style.textAlign = 'center';
      td.style.border = '1px solid #ddd'; // Adds a border around each cell
    }

    // Style table rows on hover
    table.addEventListener('mouseover', function(event) {
      if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
        event.target.style.backgroundColor = '#ddd';
      }
    });

    // Reset table rows style when mouse leaves
    table.addEventListener('mouseout', function(event) {
      if (event.target.tagName === 'TD' || event.target.tagName === 'TH') {
        event.target.style.backgroundColor = '';
      }
    });
})();