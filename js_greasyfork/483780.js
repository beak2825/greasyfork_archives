// ==UserScript==
// @name         ANT - Seeding Adoptions Check
// @description  Check for Seeding Torrents in Adoption Page
// @version      1.9
// @author       BovBrew
// @license      MIT
// @namespace    BovBrewANT
// @icon         https://anthelion.me/favicon.ico
// @match        http*://anthelion.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483780/ANT%20-%20Seeding%20Adoptions%20Check.user.js
// @updateURL https://update.greasyfork.org/scripts/483780/ANT%20-%20Seeding%20Adoptions%20Check.meta.js
// ==/UserScript==

const testing = false; // Used for test purposes. Will Simulate Seeds Found for Adoption and show Adoptions Table as Example.

(function () {
    'use strict';
    var runCount = 0;
    setupButton();
    setupTableCSS();
    lastAdoptionCheck();

    function main() {
        const adoptionURL = 'https://anthelion.me/torrents.php?type=adoption';

        fetch(adoptionURL)
            .then(response => response.text())
            .then(html => {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;

                const adoptionTorrentsTable = tempDiv.querySelectorAll('.torrent.torrent_row.zeroseed, .torrent.torrent_row');
                const adoptionTable         = [];
                const seedingAdoptionsTable = [];

                adoptionTorrentsTable.forEach(element => {
                    let seedingStatus = 'Not Seeding';
                    const seedingElement = element.querySelector('.torrent_label.tooltip.tl_seeding');
                    if (seedingElement) seedingStatus = 'Seeding';

                    let title  = "Title Not Found",
                        href   = "URL Not Found";
                    const dataElement = element.querySelector('a[data-title]');
                    if (dataElement) {
                        title  = dataElement.getAttribute('data-title');
                        href   = dataElement.getAttribute('href');
                    };
                    let size   = "Size Not Found",
                        bounty = "Bounty Not Found";
                    const rightElements = element.querySelectorAll('td.right');

                    if (rightElements.length >= 2) {
                        size   = rightElements[0].textContent.trim();
                        bounty = rightElements[1].textContent.trim();
                    }
                    if (seedingElement) seedingAdoptionsTable.push({ title, href, seedingStatus, size, bounty });
                    adoptionTable.push({ title, href, seedingStatus, size, bounty });
                });

                console.log('Adoption Table: ');
                console.table(adoptionTable);
                console.log('adoptionTable Length: ', adoptionTable.length);
                console.log('Seeding Adoption Table: ');
                console.table(seedingAdoptionsTable);
                console.log('seedingAdoptionsTable Length: ', seedingAdoptionsTable.length)

                if (testing){
                    AdoptionsFound();
                    displayTable(adoptionTable, 20, true)
                }else{
                    if (seedingAdoptionsTable.length > 0) {
                        alert('Seeding Torrents Found!');
                        AdoptionsFound();
                        displayTable(seedingAdoptionsTable, 20, true);
                    } else {
                        noAdoptionsFound();
                        displayTable(adoptionTable, 20, false);
                    };
                };

            })
            .catch(error => {
                console.log(`Error Loading Adoption Page: ${error}`);
                adoptionsError();
            });
    };

    function displayTable(tableData, rowsPerPage, seedsFound) {
        if(document.getElementById('AdoptionCheckHeader'))document.getElementById('AdoptionCheckHeader').remove();

        let boarderColor = seedsFound ? '#008a22' : '#960000';
        let lableText    = seedsFound ? 'Seeds up for Adoption Found!' : 'Adoption Table... No Seeds Up for Adoption...';

        const MainElement = document.createElement('div');
        MainElement.id    = 'AdoptionCheckHeader';
        MainElement.classList.add('adoptTableWrapper');

        const headerContainer = document.createElement('div');
        headerContainer.style.display        = 'flex';
        headerContainer.style.flexDirection  = 'row';
        headerContainer.style.justifyContent = 'space-between';
        headerContainer.style.width          = '100%';
        headerContainer.style.paddingTop     = '5px';

        const MainHeaderElement = document.createElement('div');
        MainHeaderElement.classList.add('adoptTablehead');
        MainHeaderElement.id           = 'adoptTableHeader';
        MainHeaderElement.style.border = `2px solid ${boarderColor}`;

        const MainHeaderLabelElement = document.createElement('div');
        MainHeaderLabelElement.textContent      = lableText;
        MainHeaderLabelElement.style.width      = '75%';
        MainHeaderLabelElement.style.marginLeft = '10px';

        headerContainer.appendChild(MainHeaderLabelElement);

        const showHideLink = document.createElement('a');
        showHideLink.textContent       = '[Show]';
        showHideLink.style.cursor      = 'pointer';
        showHideLink.style.marginRight = '10px';

        showHideLink.addEventListener('click', function () {
            if (dataTable.style.display === 'none' || dataTable.style.display === '') {
                dataTable.style.display  = 'table';
                showHideLink.textContent = '[Hide]';
            } else {
                dataTable.style.display  = 'none';
                showHideLink.textContent = '[Show]';
            };
        });

        headerContainer.appendChild(showHideLink);
        MainHeaderElement.appendChild(headerContainer);
        MainElement.appendChild(MainHeaderElement);
        document.getElementById('header').insertAdjacentElement('beforeEnd', MainElement);

        const dataTable = document.createElement('table');
        dataTable.classList.add('adoptionTable');
        dataTable.style.display = 'none';

        const tbody        = document.createElement('tbody');
        const itemsPerPage = rowsPerPage || 10;
        const totalPages   = Math.ceil(tableData.length / itemsPerPage);

        const displayPage = (pageNumber) => {
            tbody.innerHTML = '';

            const startIndex = (pageNumber - 1) * itemsPerPage;
            const endIndex   = startIndex + itemsPerPage;

            for (let i = startIndex; i < endIndex && i < tableData.length; i++) {
                const row = tableData[i];
                const tr  = document.createElement('tr');
                tr.innerHTML = `
                    <td><a href="${row.href}" target="_blank">${row.title}</a></td>
                    <td>${row.size}</td>
                    <td>${row.bounty}</td>
                    <td>${row.seedingStatus}</td>`;
                tbody.appendChild(tr);
            };
        };

        const thead     = document.createElement('thead');
        const headerRow = document.createElement('tr');
        headerRow.style.textAlign = 'left';

        headerRow.innerHTML = `
                                <th>Title</th>
                                <th>Size</th>
                                <th>Bounty</th>
                                <th>Seeding Status</th>`;
        thead.appendChild(headerRow);

        const tfoot     = document.createElement('tfoot');
        const footerRow = document.createElement('tr');
        const footer    = document.createElement('td');
        footer.colSpan = '4';
        footerRow.appendChild(footer);
        tfoot.appendChild(footerRow);

        displayPage(1);

        const paginationContainer = document.createElement('div');
        paginationContainer.style.marginTop = '10px';
        paginationContainer.classList.add('links');

        const maxPagesToShow = 3;

        const calculatePagesToShow = (currentPage, totalPages) => {
            const pagesToShow        = [];
            const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);

            for (let i = 1; i <= totalPages; i++) {
                if (i <= maxPagesToShow || i === totalPages || (i >= currentPage - halfMaxPagesToShow && i <= currentPage + halfMaxPagesToShow)) {
                    pagesToShow.push(i);
                } else if (pagesToShow[pagesToShow.length - 1] !== '...') {
                    pagesToShow.push('...');
                };
            };

            return pagesToShow;
        };

        const updatePagination = (currentPage) => {
            paginationContainer.innerHTML = '';

            const pagesToShow    = calculatePagesToShow(currentPage, totalPages);
            const prevPageButton = document.createElement('button');
            prevPageButton.textContent = 'Previous';
            prevPageButton.addEventListener('click', () => {
                const prevPage = currentPage - 1 > 0 ? currentPage - 1 : 1;
                displayPage(prevPage);
                updatePagination(prevPage);
            });
            prevPageButton.style.marginRight = '5px';
            paginationContainer.appendChild(prevPageButton);

            for (let i = 0; i < pagesToShow.length; i++) {
                const pageItem = document.createElement('span');

                if (pagesToShow[i] === '...') {
                    pageItem.textContent = '...';
                } else {
                    const pageButton = document.createElement('button');
                    pageButton.textContent = pagesToShow[i];
                    pageButton.addEventListener('click', () => {
                        displayPage(pagesToShow[i]);
                        updatePagination(pagesToShow[i]);
                    });
                    pageItem.appendChild(pageButton);

                    if (currentPage === pagesToShow[i]) {
                        pageItem.classList.add('current-page');
                        pageButton.style.background = '#317f8e'/*#6FA699;*/
                    }
                }

                pageItem.style.marginRight = '5px';

                paginationContainer.appendChild(pageItem);
            }

            const nextPageButton = document.createElement('button');
            nextPageButton.textContent = 'Next';
            nextPageButton.addEventListener('click', () => {
                const nextPage = currentPage + 1 <= totalPages ? currentPage + 1 : totalPages;
                displayPage(nextPage);
                updatePagination(nextPage);
            });
            paginationContainer.appendChild(nextPageButton);
        };

        dataTable.appendChild(thead);
        dataTable.appendChild(tbody);
        footer.appendChild(paginationContainer);
        dataTable.appendChild(tfoot);

        MainElement.appendChild(dataTable);

        updatePagination(1);
    };

    function setupButton() {
        var userNav     = document.getElementById('nav_links')
        var adoptionBtn = createButton('adoptionBtn', 'adoption_Button', 'Check Adoptions');
        adoptionBtn.style.borderRadius = '0 5px 0 0';
        adoptionBtn.style.width        = '90px';
        document.getElementById('nav_links').style.borderRadius = '0';
        adoptionBtn.addEventListener('click', function () {
            if (runCount === 0) {
                adoptionBtn.disabled = true;
                adoptionBtn.readOnly = true;
                adoptionBtn.classList.add('disabled');
                main();
            };
            runCount++;
        });
        var adoptionBtnCSS = `.adoption_Button.disabled {
                                background-color: grey;
                                color: white;
                            }`;
        var adoptionBtnStyleSheet = document.createElement("style");
        adoptionBtnStyleSheet.innerText = adoptionBtnCSS;
        document.head.appendChild(adoptionBtnStyleSheet);
        userNav.after(adoptionBtn);

        function createButton(id, className, labelText) {
            const button = document.createElement('button');
            button.type        = 'button';
            button.id          = id;
            button.className   = className;
            button.textContent = labelText;
            return button;
        };
    };

    function setupTableCSS() {
        var tableCSS = `.adoptTableWrapper {
                            position: relative !important;
                            margin: 0 !important;
                            width: 100% !important;
                            max-width: 1280px !important;
                            right: 0 !important;
                            overflow: hidden;
                            border-bottom: 2px solid #23252a;
                        }
                        #adoptTableHeader {
                            text-align: Left;
                            width: 100% !important;
                            height: 30px;
                            box-sizing: border-box;
                            border: 2px solid #008a22;
                            border-collapse: collapse;
                        }
                        .adoptTablehead {
                          background: rgba(82,85,92, 0.75);
                          box-sizing: border-box;
                        }
                        table.adoptionTable {
                            border: 2px solid #000000;
                            background-color: #25272D;
                            width: 100%;
                            text-align: left;
                            border-collapse: collapse;
                        }
                        table.adoptionTable td, table.adoptionTable th {
                            border: 3px solid #2B2E35;
                            padding: 3px 2px;
                        }
                        table.adoptionTable tbody td {
                            font-size: 12px;
                            color: #F0F0F0;
                        }
                        table.adoptionTable td:nth-child(1){
                            width: 70%;
                        }
                        table.adoptionTable td:nth-child(2){
                            width: 10%;
                        }
                        table.adoptionTable td:nth-child(3){
                            width: 10%;
                        }
                        table.adoptionTable td:nth-child(4){
                            width: 10%;
                        }
                        table.adoptionTable tr:nth-child(even) {
                            background: #3A393A;
                        }
                        table.adoptionTable thead {
                            background: #40424A;
                            background: -moz-linear-gradient(top, #707177 0%, #53555c 66%, #40424A 100%);
                            background: -webkit-linear-gradient(top, #707177 0%, #53555c 66%, #40424A 100%);
                            background: linear-gradient(to bottom, #707177 0%, #53555c 66%, #40424A 100%);
                            border-bottom: 5px solid #2B2E35;
                        }
                        table.adoptionTable thead th {
                            font-size: 13px;
                            font-weight: bold;
                            color: #F0F0F0;
                            border-left: 2px solid #2B2E35;
                        }
                        table.adoptionTable thead th:first-child {
                            border-left: none;
                        }

                        table.adoptionTable tfoot {
                            font-size: 12px;
                            font-weight: bold;
                            color: #F0F0F0;
                            background: #264849;
                            background: -moz-linear-gradient(top, #93bcb2 0%, #7dafa3 66%, #6FA699 100%);
                            background: -webkit-linear-gradient(top, #93bcb2 0%, #7dafa3 66%, #6FA699 100%);
                            background: linear-gradient(to bottom, #93bcb2 0%, #7dafa3 66%, #6FA699 100%);
                            border-top: 2px solid #2B2E35;
                        }
                        table.adoptionTable tfoot td {
                            font-size: 12px;
                            top: 50%;
                            -ms-transform: translateY(-10%);
                            transform: translateY(-10%);
                        }
                        table.adoptionTable tfoot .links {
                            text-align: right;
                            margin-right: 5px;
                        }
                        table.adoptionTable tfoot .links a{
                            display: inline-block;
                            background: #1F515B;
                            color: #FFFFFF;
                            padding: 2px 8px;
                            border-radius: 5px;
                        }`;
        var tableStyleSheet = document.createElement("style");
        tableStyleSheet.innerText = tableCSS;
        document.head.appendChild(tableStyleSheet);
    };

    function noAdoptionsFound() {
        var button = document.getElementById('adoptionBtn');
        button.style.backgroundColor = '#960000';
        button.textContent           = 'No Seeds for Adoption';
        setTimeout(function () {
            resetButton();
        }, 30000 /* 30 sec */);
    };

    function AdoptionsFound() {
        var button = document.getElementById('adoptionBtn');
        button.style.backgroundColor = '#008a22';
        button.textContent           = 'Adoptions Found!';
        setTimeout(function () {
            resetButton();
        }, 60000 /* 60 sec */);
    };

    function adoptionsError() {
        var button = document.getElementById('adoptionBtn');
        button.style.backgroundColor = '#FF6600';
        button.textContent           = 'Error! See Console';
        setTimeout(function () {
            resetButton();
        }, 30000 /* 30 sec */);
    };

    function resetButton() {
        var button = document.getElementById('adoptionBtn');
        button.disabled              = false;
        button.readOnly              = false;
        button.style.backgroundColor = '';
        button.textContent           = 'Check Adoptions';
        button.classList.remove('disabled');
        runCount = 0;
    };

    function lastAdoptionCheck() {
        const lastExecution = localStorage.getItem('lastAdoptionCheck');

        if (!lastExecution || (Date.now() - lastExecution > 10 * 60 * 1000)) {
            document.getElementById('adoptionBtn').click();
            localStorage.setItem('lastAdoptionCheck', Date.now());
        } else {
            console.log('Adoption Check already executed within the last 10 minutes.');
        };
    };

})();