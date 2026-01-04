    // ==UserScript==
    // @name         Empty Stations RSP
    // @namespace    http://tampermonkey.net/
    // @version      2.0
    // @description  Version for MAN1
    // @author       milcz
    // @match        https://roboscout.amazon.com/dashboards/10390/?sites=(MAN1)
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536084/Empty%20Stations%20RSP.user.js
// @updateURL https://update.greasyfork.org/scripts/536084/Empty%20Stations%20RSP.meta.js
    // ==/UserScript==
     
    setTimeout(function() {
        'use strict';
    function main() {
        let style = document.createElement('style')
        style.type = 'text/css'
        document.getElementsByTagName('head')[0].appendChild(style);
        style.innerHTML = '.table-head-cell { padding: 10px; }';
     
        const exceptionStations = [
            {
                field: 'paKivaA02',
                number: 2114,
                comment: 'ISS'
            },
            {
                field: 'paKivaA02',
                number: 22305,
                comment: 'ISS'
            },
            {
                field: 'paKivaA03',
                number: 3108,
                comment: 'ISS'
            },
            {
                field: 'paKivaA03',
                number: 3304,
                comment: 'Force Pick'
            },
            {
                field: 'paKivaA04',
                number: 4105,
                comment: 'ISS'
            },
            {
                field: 'paKivaA04',
                number: 4305,
                comment: 'Force Pick'
            },
            {
                field: 'paKivaB02',
                number: 2314,
                comment: 'ISS'
            },
            {
                field: 'paKivaB02',
                number: 2403,
                comment: 'Force Pick'
            },
            {
                field: 'paKivaB03',
                number: 3245,
                comment: 'ISS'
            },
            {
                field: 'paKivaB03',
                number: 3403,
                comment: 'Force Pick'
            },
            {
                field: 'paKivaB04',
                number: 4245,
                comment: 'ISS'
            },
            {
                field: 'paKivaB04',
                number: 4403,
                comment: 'Force Pick'
            },
        ]
     
        const allSpans = document.querySelectorAll('span')
        const availableStations = [...allSpans].filter(e => e.innerText == "AVAILABLE")
     
        const littleContainer = document.getElementById('little_container')
        const contentContainer = document.createElement('div')
        contentContainer.classList.add('content')
        contentContainer.setAttribute('id', 'content-container')
        contentContainer.style.display = 'flex'
        contentContainer.style.width = '100%'
        contentContainer.style.justifyContent = 'space-around'
        const table2 = document.createElement('div')
        const table3 = document.createElement('div')
        const table4 = document.createElement('div')
        const tableHead2 = document.createElement('div')
        const tableHeader2 = document.createElement('div')
        const tableHeaderCell2 = document.createElement('div')
        tableHeaderCell2.innerHTML = 'Empty Stations P2'
        tableHeaderCell2.style.textAlign = 'center'
        tableHeaderCell2.style.backgroundColor = '#e0f3ff'
        tableHeaderCell2.style.fontSize = '1.2em'
        tableHeaderCell2.style.padding = '4px'
        const tableHead3 = document.createElement('div')
        const tableHeader3 = document.createElement('div')
        const tableHeaderCell3 = document.createElement('div')
        tableHeaderCell3.innerHTML = 'Empty Stations P3'
        tableHeaderCell3.style.textAlign = 'center'
        tableHeaderCell3.style.backgroundColor = '#e0f3ff'
        tableHeaderCell3.style.fontSize = '1.2em'
        tableHeaderCell3.style.padding = '4px'
        const tableHead4 = document.createElement('div')
        const tableHeader4 = document.createElement('div')
        const tableHeaderCell4 = document.createElement('div')
        tableHeaderCell4.innerHTML = 'Empty Stations P4'
        tableHeaderCell4.style.textAlign = 'center'
        tableHeaderCell4.style.backgroundColor = '#e0f3ff'
        tableHeaderCell4.style.fontSize = '1.2em'
        tableHeaderCell4.style.padding = '4px'
        const tableHeadRow2 = document.createElement('div')
        tableHeadRow2.style.display = 'grid';
        tableHeadRow2.style.gridTemplateColumns = 'repeat(5, 1fr)'
        tableHeadRow2.style.backgroundColor = '#cae9fc'
        const tableHeadRow3 = document.createElement('div')
        tableHeadRow3.style.display = 'grid';
        tableHeadRow3.style.gridTemplateColumns = 'repeat(5, 1fr)'
        tableHeadRow3.style.backgroundColor = '#cae9fc'
        const tableHeadRow4 = document.createElement('div')
        tableHeadRow4.style.display = 'grid';
        tableHeadRow4.style.gridTemplateColumns = 'repeat(5, 1fr)'
        tableHeadRow4.style.backgroundColor = '#cae9fc'
        const tableHeadUniversal2 = document.createElement('div')
        const tableHeadUniversal3 = document.createElement('div')
        const tableHeadUniversal4 = document.createElement('div')
        tableHeadUniversal2.classList.add('table-head-cell')
        tableHeadUniversal3.classList.add('table-head-cell')
        tableHeadUniversal4.classList.add('table-head-cell')
        tableHeadUniversal2.innerHTML = 'Universal'
        tableHeadUniversal3.innerHTML = 'Universal'
        tableHeadUniversal4.innerHTML = 'Universal'
        const tableHeadLegacy2 = document.createElement('div')
        const tableHeadLegacy3 = document.createElement('div')
        const tableHeadLegacy4 = document.createElement('div')
        tableHeadLegacy2.classList.add('table-head-cell')
        tableHeadLegacy3.classList.add('table-head-cell')
        tableHeadLegacy4.classList.add('table-head-cell')
        tableHeadLegacy2.innerHTML = 'Legacy'
        tableHeadLegacy3.innerHTML = 'Legacy'
        tableHeadLegacy4.innerHTML = 'Legacy'
        const tableHeadArsaw2 = document.createElement('div')
        const tableHeadArsaw3 = document.createElement('div')
        const tableHeadArsaw4 = document.createElement('div')
        tableHeadArsaw2.classList.add('table-head-cell')
        tableHeadArsaw3.classList.add('table-head-cell')
        tableHeadArsaw4.classList.add('table-head-cell')
        tableHeadArsaw2.innerHTML = 'ARSAW'
        tableHeadArsaw3.innerHTML = 'ARSAW'
        tableHeadArsaw4.innerHTML = 'ARSAW'
        const tableHeadIss2 = document.createElement('div')
        const tableHeadIss3 = document.createElement('div')
        const tableHeadIss4 = document.createElement('div')
        tableHeadIss2.classList.add('table-head-cell')
        tableHeadIss3.classList.add('table-head-cell')
        tableHeadIss4.classList.add('table-head-cell')
        tableHeadIss2.innerHTML = 'ISS'
        tableHeadIss3.innerHTML = 'ISS'
        tableHeadIss4.innerHTML = 'ISS'
        const tableHeadForce2 = document.createElement('div')
        const tableHeadForce3 = document.createElement('div')
        const tableHeadForce4 = document.createElement('div')
        tableHeadForce2.classList.add('table-head-cell')
        tableHeadForce3.classList.add('table-head-cell')
        tableHeadForce4.classList.add('table-head-cell')
        tableHeadForce2.innerHTML = 'Force Pick'
        tableHeadForce3.innerHTML = 'Force Pick'
        tableHeadForce4.innerHTML = 'Force Pick'
     
        const table2Body = document.createElement('div')
        const table3Body = document.createElement('div')
        const table4Body = document.createElement('div')
        const universal2col = document.createElement('div')
        const universal3col = document.createElement('div')
        const universal4col = document.createElement('div')
        const legacy2col = document.createElement('div')
        const legacy3col = document.createElement('div')
        const legacy4col = document.createElement('div')
        const arsaw2col = document.createElement('div')
        const arsaw3col = document.createElement('div')
        const arsaw4col = document.createElement('div')
        const iss2col = document.createElement('div')
        const iss3col = document.createElement('div')
        const iss4col = document.createElement('div')
        const force2col = document.createElement('div')
        const force3col = document.createElement('div')
        const force4col = document.createElement('div')
        table2Body.style.display = 'grid'
        table2Body.style.gridTemplateColumns = 'repeat(5, 1fr)'
        table3Body.style.display = 'grid'
        table3Body.style.gridTemplateColumns = 'repeat(5, 1fr)'
        table4Body.style.display = 'grid'
        table4Body.style.gridTemplateColumns = 'repeat(5, 1fr)'
        universal2col.style.display = 'flex'
        universal2col.style.flexDirection = 'column'
        universal3col.style.display = 'flex'
        universal3col.style.flexDirection = 'column'
        universal4col.style.display = 'flex'
        universal4col.style.flexDirection = 'column'
        legacy2col.style.display = 'flex'
        legacy2col.style.flexDirection = 'column'
        legacy3col.style.display = 'flex'
        legacy3col.style.flexDirection = 'column'
        legacy4col.style.display = 'flex'
        legacy4col.style.flexDirection = 'column'
        arsaw2col.style.display = 'flex'
        arsaw2col.style.flexDirection = 'column'
        arsaw3col.style.display = 'flex'
        arsaw3col.style.flexDirection = 'column'
        arsaw4col.style.display = 'flex'
        arsaw4col.style.flexDirection = 'column'
        iss2col.style.display = 'flex'
        iss2col.style.flexDirection = 'column'
        iss3col.style.display = 'flex'
        iss3col.style.flexDirection = 'column'
        iss4col.style.display = 'flex'
        iss4col.style.flexDirection = 'column'
        force2col.style.display = 'flex'
        force2col.style.flexDirection = 'column'
        force3col.style.display = 'flex'
        force3col.style.flexDirection = 'column'
        force4col.style.display = 'flex'
        force4col.style.flexDirection = 'column'
     
     
     
        littleContainer.insertBefore(contentContainer, littleContainer.childNodes[57])
        contentContainer.appendChild(table2)
        contentContainer.appendChild(table3)
        contentContainer.appendChild(table4)
        table2.appendChild(tableHead2)
        table3.appendChild(tableHead3)
        table4.appendChild(tableHead4)
        tableHead2.appendChild(tableHeader2)
        tableHeader2.appendChild(tableHeaderCell2)
        tableHead2.appendChild(tableHeadRow2)
        tableHead3.appendChild(tableHeader3)
        tableHeader3.appendChild(tableHeaderCell3)
        tableHead3.appendChild(tableHeadRow3)
        tableHead4.appendChild(tableHeader4)
        tableHeader4.appendChild(tableHeaderCell4)
        tableHead4.appendChild(tableHeadRow4)
        table2.appendChild(table2Body)
        table3.appendChild(table3Body)
        table4.appendChild(table4Body)
        tableHeadRow2.appendChild(tableHeadUniversal2)
        tableHeadRow3.appendChild(tableHeadUniversal3)
        tableHeadRow4.appendChild(tableHeadUniversal4)
        tableHeadRow2.appendChild(tableHeadLegacy2)
        tableHeadRow3.appendChild(tableHeadLegacy3)
        tableHeadRow4.appendChild(tableHeadLegacy4)
        tableHeadRow2.appendChild(tableHeadArsaw2)
        tableHeadRow3.appendChild(tableHeadArsaw3)
        tableHeadRow4.appendChild(tableHeadArsaw4)
        tableHeadRow2.appendChild(tableHeadIss2)
        tableHeadRow3.appendChild(tableHeadIss3)
        tableHeadRow4.appendChild(tableHeadIss4)
        tableHeadRow2.appendChild(tableHeadForce2)
        tableHeadRow3.appendChild(tableHeadForce3)
        tableHeadRow4.appendChild(tableHeadForce4)
     
        table2Body.appendChild(universal2col)
        table2Body.appendChild(legacy2col)
        table2Body.appendChild(arsaw2col)
        table2Body.appendChild(iss2col)
        table2Body.appendChild(force2col)
        table3Body.appendChild(universal3col)
        table3Body.appendChild(legacy3col)
        table3Body.appendChild(arsaw3col)
        table3Body.appendChild(iss3col)
        table3Body.appendChild(force3col)
        table4Body.appendChild(universal4col)
        table4Body.appendChild(legacy4col)
        table4Body.appendChild(arsaw4col)
        table4Body.appendChild(iss4col)
        table4Body.appendChild(force4col)
     
        function printStationNumbers() {
            availableStations.sort((a, b) => a.parentElement.parentElement.childNodes[3].textContent - b.parentElement.parentElement.childNodes[3].textContent).sort((a, b) => a.parentElement.parentElement.childNodes[2].textContent > b.parentElement.parentElement.childNodes[2].textContent)
     
            for (let station of availableStations) {
                //field.innerHTML = station.parentElement.parentElement.childNodes[2].textContent
                //stationNumber.innerHTML = station.parentElement.parentElement.childNodes[3].textContent
                //type.innerHTML = station.parentElement.parentElement.childNodes[6].textContent
     
                    for (let exceptionStation of exceptionStations) {
                    if (station.parentElement.parentElement.childNodes[3].textContent == exceptionStation.number) {
                     if (exceptionStation.comment == 'ISS') {
                         const issCell = document.createElement('div')
                         issCell.style.backgroundColor = '#D50000'
                         issCell.style.color = 'white'
                         issCell.style.textShadow = '1px 1px #000'
                         issCell.style.padding = '4px 0px'
                         issCell.style.border = '1px solid white'
                         issCell.style.borderRadius = '5px'
                         issCell.innerHTML = station.parentElement.parentElement.childNodes[2].textContent.slice(6, 7) + station.parentElement.parentElement.childNodes[3].textContent
                         if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA02' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB02') {
                             iss2col.appendChild(issCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'ISS'
                             station.parentElement.parentElement.childNodes[6].textContent = 'ISS'
                         } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA03' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB03') {
                             iss3col.appendChild(issCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'ISS'
                             station.parentElement.parentElement.childNodes[6].textContent = 'ISS'
                         } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA04' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB04') {
                             iss4col.appendChild(issCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'ISS'
                             station.parentElement.parentElement.childNodes[6].textContent = 'ISS'
                         }
                     } else if (exceptionStation.comment == 'Force Pick') {
                         const forceCell = document.createElement('div')
                         forceCell.style.backgroundColor = '#FFEB3B'
                         forceCell.style.color = 'white'
                         forceCell.style.textShadow = '1px 1px #000'
                         forceCell.style.padding = '4px 0px'
                         forceCell.style.border = '1px solid white'
                         forceCell.style.borderRadius = '5px'
                         forceCell.innerHTML = station.parentElement.parentElement.childNodes[2].textContent.slice(6, 7) + station.parentElement.parentElement.childNodes[3].textContent
                         if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA02' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB02') {
                             force2col.appendChild(forceCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'Force Pick'
                             station.parentElement.parentElement.childNodes[6].textContent = 'Force Pick'
                         } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA03' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB03') {
                             force3col.appendChild(forceCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'Force Pick'
                             station.parentElement.parentElement.childNodes[6].textContent = 'Force Pick'
                         } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA04' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB04') {
                             force4col.appendChild(forceCell)
                             station.parentElement.parentElement.childNodes[9].textContent = 'Force Pick'
                             station.parentElement.parentElement.childNodes[6].textContent = 'Force Pick'
                         }
                     }
                    }
                }
                if (station.parentElement.parentElement.childNodes[9].textContent == 'FCX-Sortable-PickStow-Nike-Pick22-V4.6586') {
                    const legacyCell = document.createElement('div')
                    legacyCell.style.backgroundColor = '#03A9F4'
                    legacyCell.style.color = 'white'
                    legacyCell.style.textShadow = '1px 1px #000'
                    legacyCell.style.padding = '4px 0px'
                    legacyCell.style.border = '1px solid white'
                    legacyCell.style.borderRadius = '5px'
                    legacyCell.innerHTML = station.parentElement.parentElement.childNodes[2].textContent.slice(6, 7) + station.parentElement.parentElement.childNodes[3].textContent
                    if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA02' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB02') {
                        legacy2col.appendChild(legacyCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA03' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB03') {
                            legacy3col.appendChild(legacyCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA04' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB04') {
                            legacy4col.appendChild(legacyCell)
                        }
                } else if (station.parentElement.parentElement.childNodes[6].textContent == 'Universal') {
                    const universalCell = document.createElement('div')
                    universalCell.style.backgroundColor = '#1B5E20'
                    universalCell.style.color = 'white'
                    universalCell.style.textShadow = '1px 1px #000'
                    universalCell.style.padding = '4px 0px'
                    universalCell.style.border = '1px solid white'
                    universalCell.style.borderRadius = '5px'
                    universalCell.innerHTML = station.parentElement.parentElement.childNodes[2].textContent.slice(6, 7) + station.parentElement.parentElement.childNodes[3].textContent
                    if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA02' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB02') {
                        universal2col.appendChild(universalCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA03' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB03') {
                            universal3col.appendChild(universalCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA04' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB04') {
                            universal4col.appendChild(universalCell)
                        }
                } else if (station.parentElement.parentElement.childNodes[6].textContent == 'ARSAW') {
                    const arsawCell = document.createElement('div')
                    arsawCell.style.backgroundColor = '#FF9800'
                    arsawCell.style.color = 'white'
                    arsawCell.style.textShadow = '1px 1px #000'
                    arsawCell.style.padding = '4px 0px'
                    arsawCell.style.border = '1px solid white'
                    arsawCell.style.borderRadius = '5px'
                    arsawCell.innerHTML = station.parentElement.parentElement.childNodes[2].textContent.slice(6, 7) + station.parentElement.parentElement.childNodes[3].textContent
                    if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA02' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB02') {
                        arsaw2col.appendChild(arsawCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA03' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB03') {
                            arsaw3col.appendChild(arsawCell)
                        } else if (station.parentElement.parentElement.childNodes[2].textContent == 'paKivaA04' || station.parentElement.parentElement.childNodes[2].textContent == 'paKivaB04') {
                            arsaw4col.appendChild(arsawCell)
                        }
                }
     
     
            }
        }
        printStationNumbers()
    }
        main()
    setInterval(function() {
        let contentContainer = document.getElementById('content-container')
        contentContainer.remove()
        main()
    }, 300000)
    }, 5000)();

