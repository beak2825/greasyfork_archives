// ==UserScript==
// @name         CSGO2.Wiki 特殊模板捡漏大师-悠悠有品版
// @namespace    https://csgo2.wiki
// @version      1.0
// @description  Monitor specific network requests and perform actions
// @author       You
// @match        *://www.youpin898.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512733/CSGO2Wiki%20%E7%89%B9%E6%AE%8A%E6%A8%A1%E6%9D%BF%E6%8D%A1%E6%BC%8F%E5%A4%A7%E5%B8%88-%E6%82%A0%E6%82%A0%E6%9C%89%E5%93%81%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512733/CSGO2Wiki%20%E7%89%B9%E6%AE%8A%E6%A8%A1%E6%9D%BF%E6%8D%A1%E6%BC%8F%E5%A4%A7%E5%B8%88-%E6%82%A0%E6%82%A0%E6%9C%89%E5%93%81%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Override the XMLHttpRequest open method
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this.addEventListener('readystatechange', function() {
            if (this.readyState === 4 && url.includes('GetCsGoPagedList')) {
                try {
                    const response = JSON.parse(this.responseText);
                    const commodityList = response.Data.CommodityList;
                    // Clear the table before adding new data
                    clearTable();
                    commodityList.forEach(item => {
                        fetchCommodityDetails(item.Id, item.CommodityNo);
                    });
                } catch (error) {
                    console.error('Error processing GetCsGoPagedList response:', error);
                }
            }
        }, false);
        originalOpen.apply(this, arguments);
    };

    // Function to fetch and display commodity details
    function fetchCommodityDetails(id, commodityNo) {
        const url = `https://api.youpin898.com/api/commodity/Commodity/Detail?Id=${id}&CommodityNo=${commodityNo}`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText).Data;
                    const paintSeed = data.PaintSeed || 'N/A';
                    const abrade = data.Abrade || 'N/A';
                    displayTable(paintSeed, abrade);
                } catch (error) {
                    console.error('Error parsing Detail response:', error);
                }
            }
        });
    }

    // Function to display data in a table
    function displayTable(paintSeed, abrade) {
        let table = document.getElementById('commodityTable');
        if (!table) {
            createUI();
        }

        const row = table.insertRow();
        [paintSeed, abrade].forEach(text => {
            const cell = row.insertCell();
            cell.innerText = text;
            cell.style.border = '1px solid #dddddd';
            cell.style.padding = '8px';
            cell.style.textAlign = 'center';
        });

        // Convert paintSeed to string for comparison
        const paintSeedStr = String(paintSeed).trim();
        const paintSeedList = getPaintSeedList();
        console.log('Current paintSeed:', paintSeedStr); // Debug output

        // Highlight row if paintSeed matches any in the list
        if (paintSeedList.includes(paintSeedStr)) {
            console.log(`Highlighting row for paintSeed: ${paintSeedStr}`); // Debug output
            row.style.backgroundColor = '#ffeb3b'; // Highlight color
        }
    }

    // Function to create UI elements
    function createUI() {
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.right = '10px';
        container.style.zIndex = 1000;
        container.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        container.style.padding = '15px';
        container.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.2)';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.borderRadius = '8px';

        // Create title with link
        const title = document.createElement('a');
        title.href = 'https://csgo2.wiki?from=jianloudashi-plugin';
        title.innerText = 'CSGO2.Wiki 特殊模板捡漏大师';
        title.style.display = 'block';
        title.style.marginBottom = '10px';
        title.style.fontSize = '16px';
        title.style.color = '#007BFF';
        title.style.textDecoration = 'none';
        title.target = '_blank'; // Open link in new tab

        container.appendChild(title);

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter paintSeed';
        input.value = localStorage.getItem('paintSeeds') || '';
        input.style.marginRight = '5px';
        input.style.padding = '8px';
        input.style.border = '1px solid #ccc';
        input.style.borderRadius = '4px';

        const button = document.createElement('button');
        button.innerText = '更新';
        button.style.padding = '8px 12px';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.backgroundColor = '#007BFF';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.3s';
        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#0056b3';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007BFF';
        });
        button.onclick = function() {
            const cleanedInput = input.value.replace(/\s+/g, ''); // Remove all whitespace
            localStorage.setItem('paintSeeds', cleanedInput);
            clearTable();
        };

        container.appendChild(input);
        container.appendChild(button);

        const table = document.createElement('table');
        table.id = 'commodityTable';
        table.style.marginTop = '10px';
        table.style.borderCollapse = 'collapse';
        table.style.fontSize = '12px';
        container.appendChild(table);

        // Add header
        const header = table.insertRow();
        const headers = ['模板id', '磨损'];
        headers.forEach(text => {
            const th = document.createElement('th');
            th.innerText = text;
            th.style.border = '1px solid #dddddd';
            th.style.padding = '8px';
            th.style.backgroundColor = '#f2f2f2';
            th.style.textAlign = 'center';
            th.style.borderRadius = '4px';
        });

        document.body.appendChild(container);
    }


    // Function to clear the table
    function clearTable() {
        const table = document.getElementById('commodityTable');
        if (table) {
            // Remove all rows except the header
            table.innerHTML = '';
            const header = table.insertRow();
            const headers = ['模板id', '磨损'];
            headers.forEach(text => {
                const th = document.createElement('th');
                th.innerText = text;
                th.style.border = '1px solid #dddddd';
                th.style.padding = '8px';
                th.style.backgroundColor = '#f2f2f2';
                th.style.textAlign = 'center';
                header.appendChild(th);
            });
        }
    }

    // Function to get paintSeed list from local storage
    function getPaintSeedList() {
        const paintSeeds = localStorage.getItem('paintSeeds');
        const list = paintSeeds ? paintSeeds.split(/[\uFF0C\uFF1B,;\u3001]/).map(seed => String(seed).trim()) : [];
        console.log('Stored paintSeed list:', list); // Debug output
        return list;
    }


})();
