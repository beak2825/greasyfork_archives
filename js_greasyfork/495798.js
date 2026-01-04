// ==UserScript==
    // @name         heheheeheee
    // @namespace    http://tampermonkey.net/
    // @version      1.12.34
    // @description  Something helpful I guess
    // @author       alexanup@
    // @match        https://*/station/dashboard/*
    // @match        https://*.last-mile.amazon.dev/?*
    // @match        https://midway-auth.amazon.com/*
    // @match        https://siw-eu-dub.dub.proxy.amazon.com/*
    // @match        https://siw-na-iad.iad.proxy.amazon.com/*
    // @match        https://www.royalmail.com/find-a-postcode*    // @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
    // @match        https://logistics.amazon.de/internal/capacity/*
    // @match        https://alexpgdev.com/inductflow*
    // @require      https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/495798/heheheeheee.user.js
// @updateURL https://update.greasyfork.org/scripts/495798/heheheeheee.meta.js
    // ==/UserScript==
 
    (function() {
        'use strict';
         console.log(window.location.href)

        let version = `    // @version      ${GM_info.script.version}`
        console.log(version)
        
        let checkStation = 0
         let checkStationInt = setInterval(() => {
            if(document.getElementById("select2-stations-container") || checkStation > 5000){
                clearInterval(checkStationInt)
                localStorage.setItem("heheStation", document.getElementById("select2-stations-container").textContent)
            }
         }, 1);

         if(!window.location.href.includes('last-mile.amazon.dev')){
            let updateHeheDiv = document.createElement('img')
            updateHeheDiv.id = "updateHeheId"
            updateHeheDiv.src = "https://alexpgdev.com/updateHehe.png"
            updateHeheDiv.style.position = "absolute"
            updateHeheDiv.style.bottom = "0"
            updateHeheDiv.style.right = "100px"
            updateHeheDiv.style.cursor = "pointer"
            updateHeheDiv.style.width = "120px"
            updateHeheDiv.style.display = 'none'
            document.body.append(updateHeheDiv)

            document.getElementById('updateHeheId').addEventListener('click', function (e) {
                window.open('https://update.greasyfork.org/scripts/495798/heheheeheee.user.js')
            })
         }

         window.addEventListener('message', (event) => {
            if(event.data.action === 'fetchPackageDetails') {
                const packageId = event.data.packageId
                const packageDimensions = event.data.packageDimensions
                const packageWeight = event.data.packageWeight

                fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": window.location.href,
                    "body": `{\"resourcePath\":\"/os/getPackageHistoryData\",\"httpMethod\":\"post\",\"processName\":\"oculus\",\"requestBody\":{\"packageId\":\"${packageId}\",\"pageSize\":100,\"pageToken\":null,\"startTime\":null,\"endTime\":null}}`,
                    "method": "POST",
                    "mode": "cors"
                    }).then(function (response) {
                        return response.json()
                    }).then(function (packageDet) {
                    console.log(packageDet)

                    if(!packageDet || !packageDet.packageHistory[0]) return;

                    let sortZone = packageDet.packageHistory[0].sortZone

                    const printWindow = window.open('', '_blank');
                    printWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Page</title>
                        </head>
                        <style>
                            body {
                                background-color: white;
                                left: 50%;
                                transform: translate(-50%, 0);
                                position: absolute;
                            }
                        </style>
                        <body>
                            <div style="font-size: 14px; page-break-after: always;">
                                <h1>At Station package</h1>
                                <p>Package ID: ${packageId}</p>
                                <p>Sort Zone: ${sortZone}</p>
                                <p>Dimensions: ${packageDimensions}</p>
                                <p>Weight: ${packageWeight}</p>
                            </div>
                        </body>
                    </html>
                    `);

                    setTimeout(() => {
                        printWindow.document.close();
                        printWindow.onload = function () {
                          printWindow.print();
                          printWindow.close();
                        };
                    }, 300);
                    
                }).catch(function (e) {
                    console.error(e)
                })
            } else if(event.data.action === 'fetchAllPackageDetails'){
                console.log(Object.keys(event.data.packages).length)

                const printWindow = window.open('', '_blank');
                printWindow.document.write(`
                <html>
                    <head>
                        <title>Print Page</title>
                    </head>
                    <style>
                        body {
                            background-color: white;
                            left: 50%;
                            transform: translate(-50%, 0);
                            position: absolute;
                        }
                    </style>
                    <body>

                    </body>
                </html>
                `);

                for(let i = 0; i < Object.keys(event.data.packages).length; i++){
                    const packageId = event.data.packages[Object.keys(event.data.packages)[i]].packageId
                    const sortZone = event.data.packages[Object.keys(event.data.packages)[i]].sortZone
                    const packageDimensions = event.data.packages[Object.keys(event.data.packages)[i]].packageDimensions
                    const packageWeight = event.data.packages[Object.keys(event.data.packages)[i]].packageWeight

                    let newPageDiv = document.createElement('div')
                    newPageDiv.style.fontSize = '14px'
                    newPageDiv.style.pageBreakAfter = 'always'
                    newPageDiv.innerHTML = `
                            <h1>At Station package</h1>
                            <p>Package ID: ${packageId}</p>
                            <p>Sort Zone: ${sortZone}</p>
                            <p>Dimensions: ${packageDimensions}</p>
                            <p>Weight: ${packageWeight}</p>`

                    printWindow.document.body.append(newPageDiv)
                }

                setTimeout(() => {
                    printWindow.document.close();
                    printWindow.onload = function () {
                        printWindow.print();
                        printWindow.close();
                    };
                }, 300)
            } else if(event.data.action === 'startGenWaveplan'){
                let overlayDiv = document.createElement('div')
                overlayDiv.id = "overlay"
                overlayDiv.innerHTML = `<div id="popup">
                    <h3>Generating PDF...</h3>
                    <p id="progress-text">Starting</p>
                </div>
                
                <style>
                    #overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: none;
                        z-index: 999;
                    }

                    #popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        text-align: center;
                        z-index: 1000;
                    }
                </style>
                `
    
                document.body.append(overlayDiv)

                const overlay = document.getElementById('overlay');
                overlay.style.display = 'block';

                const progressText = document.getElementById('progress-text');
                progressText.innerText = `Getting Pending Depart Data..`

                fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": "https://logistics.amazon.co.uk/station/dashboard/depart",
                    "body": `{\"resourcePath\":\"/apigw/route/station/DBW3\",\"httpMethod\":\"get\",\"processName\":\"routeStaging\",\"requestParams\":{\"date\":[\"${new Date().getMonth()+1}/${new Date().getDate()}/${new Date().getFullYear()}\"],\"nodes\":[\"DBW3,OBW2\"]}}`,
                    "method": "POST",
                    "mode": "cors"
                }).then(function (response) {
                    return response.json()
                }).then(function (routes) {
                    progressText.innerText = `Uploading Pending Depart Data..`
                    fetch('https://alexpgdev.com/uploadPendingDepart.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({station: localStorage.getItem("heheStation"), fileName: "pendingDepart.json", data: [{"validation": Math.floor(Math.random() * 10000)}, routes]}),
                        mode: 'no-cors'
                    }).then(() => {
                        progressText.innerText = `Pending Depart Data uploaded`
                        window.open("https://logistics.amazon.de/internal/capacity/rosterview?serviceAreaId=792f3e55-c706-4ea3-be31-efb5713704ae?waveplan")
                        document.getElementById('overlay').remove()
                    })
                })
            } else if(event.data.action === 'newUpdate'){
                document.getElementById('updateHeheId').style.display = ''
            } else if(event.data.action === 'getStation'){
                event.source.postMessage({
                    action: 'station',
                    value: document.querySelector("#select2-stations-container").textContent
                }, `*`)
            } else if(event.data.action === 'getInductTable'){
                fetch('https://alexpgdev.com/inductflowsettings.json', {
                    cache: 'no-cache'
                })
                .then(function (response) {
                    return response.json()
                }).then(function (settings) {

                    console.log(settings.speedNumbers)
                    let inductTarget = settings.inductTarget
                    let induct1Percentage = settings.induct1Percentage
                    let induct2Percentage = settings.induct2Percentage
                    let induct3Percentage = settings.induct3Percentage
                    let auto = settings.auto
                    let finishInductBy = settings.finishInductBy
                    let speedNumbers = settings.speedNumbers
    
                    GM_setValue("inductflowSettings", {
                        inductTarget: inductTarget,
                        induct1Percentage: induct1Percentage,
                        induct2Percentage: induct2Percentage,
                        induct3Percentage: induct3Percentage,
                        auto: auto,
                        finishInductBy: finishInductBy,
                        speedNumbers: speedNumbers
                    })

                    GM_xmlhttpRequest({
                        method: "POST",
                        url: "https://logistics.amazon.co.uk/station/proxyapigateway/data",
                        data: '{\"resourcePath\":\"/ivs/getLocationMetric\",\"httpMethod\":\"post\",\"processName\":\"induct\",\"requestBody\":{\"nodeId\":\"DBW3\"}}',
                        headers: {
                            "Content-Type": "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                            "Referer": "https://logistics.amazon.co.uk/station/dashboard/induct"
                        },
                        onload: function(response) {
                            var inductTableData = JSON.parse(response.responseText)
        
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: "https://logistics.amazon.co.uk/station/proxyapigateway/data",
                                data: '{"resourcePath":"/ivs/getPackageMetric","httpMethod":"post","processName":"induct","requestBody":{"nodeId":"DBW3","groupBy":"Node","filters":{"Cycle":["CYCLE_1"]},"metricList":["CURRENT_CYCLE_RECEIVED","OTHER_CYCLE_RECEIVED","PENDING_DEPART_FROM_UPSTREAM","PENDING_DEPART_FROM_UPSTREAM_UNPLANNED","IN_TRANSIT_FROM_UPSTREAM","PENDING_INDUCT","PENDING_INDUCT_UNPLANNED","PENDING_RE_INDUCT","PENDING_RE_INDUCT_UNPLANNED","INDUCTED_AT_STATION","SIDELINE","PLANNED_MANIFESTED"]}}',
                                headers: {
                                    "Content-Type": "application/json",
                                    "X-Requested-With": "XMLHttpRequest",
                                    "Referer": "https://logistics.amazon.co.uk/station/dashboard/induct"
                                },
                                onload: function(response2) {
                                    var inductData = JSON.parse(response2.responseText)
        
                                    GM_xmlhttpRequest({
                                        method: "POST",
                                        url: "https://logistics.amazon.co.uk/station/flow/sort/data?stationCode=DBW3&cycleId=CYCLE_1",
                                        headers: {
                                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                                            "Accept": "*/*",
                                            "Accept-Language": "en-US,en;q=0.5",
                                            "X-Requested-With": "XMLHttpRequest",
                                            "Content-Type": "application/json",
                                        },
                                        "referrer": "https://logistics.amazon.co.uk/station/dashboard/overview?sortmonitor=flow",
                                        onload: function(response3) {
                                            let sortRateSCC = JSON.parse(response3.responseText)
    
                                            let settings = [
                                                {
                                                    inductTarget: GM_getValue("inductflowSettings").inductTarget,
                                                    induct1Percentage: GM_getValue("inductflowSettings").induct1Percentage,
                                                    induct2Percentage: GM_getValue("inductflowSettings").induct2Percentage,
                                                    induct3Percentage: GM_getValue("inductflowSettings").induct3Percentage,
                                                    auto: GM_getValue("inductflowSettings").auto,
                                                    finishInductBy: GM_getValue("inductflowSettings").finishInductBy,
                                                    speedNumbers: GM_getValue("inductflowSettings").speedNumbers
                                                }
                                            ]
        
                                            window.top.postMessage({
                                                action: 'inductTable',
                                                inductTableData: inductTableData,
                                                inductData: inductData,
                                                sortRate: sortRateSCC,
                                                settings: settings
                                            }, `*`)
                                        }
                                    })
                                }
                            });
                        }
                    });
                })
            }
        })
        
        if(window.location.href.includes('https://alexpgdev.com/inductflow')){

            return;
         }
        
            function checkForUpdate(){
                fetch('https://update.greasyfork.org/scripts/495798/heheheeheee.meta.js', {
	                cache: "no-cache"
                })
                .then(response => response.text())
                .then(textString => {
                    let lines = textString.split("\n")
                    for(let i = 0; i < lines.length; i++){
                        if(lines[i].includes('@version')){
                            console.log(lines[i])
                            if(lines[i] !== version && !version.includes('x')){
                                window.top.postMessage({
                                    action: 'newUpdate'
                                }, `*`)
                            }
                        }
                    }
                })
            }

            checkForUpdate()

            setInterval(() => {
                checkForUpdate()
            }, 30000);
        
         let checkButtons = setInterval(() => {          
            if(document.getElementById('buttons')){
                clearInterval(checkButtons)
                let printDiv = document.createElement('button')
                printDiv.id = 'printPackage'
                printDiv.style.order = '-2'
                printDiv.textContent = 'Print'

                let packageId
                let packageDimensions
                let packageWeight

                let checkPackageId = setInterval(() => {
                    if(document.querySelector('html body.vsc-initialized div#root div div div.css-xx5nu9 div#improveRoot div#improveHead div.wide h1')){
                        clearInterval(checkPackageId)
                        packageId = document.querySelector('html body.vsc-initialized div#root div div div.css-xx5nu9 div#improveRoot div#improveHead div.wide h1').textContent
                        packageDimensions = document.querySelector('html body.vsc-initialized div#root div div div.css-xx5nu9 div#improveRoot div#improveHead div.wide:nth-child(3) div').textContent
                        packageWeight = document.querySelector('html body.vsc-initialized div#root div div div.css-xx5nu9 div#improveRoot div#improveHead div.wide div.spaced span:nth-child(2)').textContent
                    }
                }, 1)

                document.getElementById('buttons').prepend(printDiv)

                document.getElementById('printPackage').addEventListener('click', function (e) {
                    window.top.postMessage({
                        action: 'fetchPackageDetails',
                        packageId: packageId,
                        packageDimensions: packageDimensions,
                        packageWeight: packageWeight
                    }, `*`)
                })
            }
         }, 1);
         

         let check1qnbcrp = setInterval(() => {            
             if(document.getElementsByClassName('css-1qnbcrp')[0]){
                 clearInterval(check1qnbcrp)
                 fetch("https://logistics.amazon.co.uk/rsws/route/station/DBW3").then(function (response){
                    return response.json()
                }).then(function (routeDet) {
                    
                    for(let i = 0; i < routeDet.routes.length; i++){
                        if(routeDet.routes[i].routeCode === document.getElementsByClassName('css-tnic3g')[0].textContent){
                            console.log(routeDet)
                            let newDSPDiv = document.createElement('div')
                            newDSPDiv.classList.add('css-4heyo9')
                            newDSPDiv.innerHTML = `<p class="css-1qfbqrr" mdn-text=""><span>DSP</span>:</p><p class="css-14fuupd" mdn-text="">${routeDet.routes[i].driver.companyShortCode}</p>`

                            let newDriverDiv = document.createElement('div')
                            newDriverDiv.classList.add('css-4heyo9')
                            newDriverDiv.innerHTML = `<p class="css-1qfbqrr" mdn-text=""><span>Driver</span>:</p><p class="css-14fuupd" mdn-text=""><a href="https://logistics.amazon.co.uk/amconsole/transporter/${routeDet.routes[i].driver.transporterId}" target="_blank">${routeDet.routes[i].driver.transporterId}</a></p>`
                
                            document.getElementsByClassName('css-1qnbcrp')[0].append(newDSPDiv)
                            document.getElementsByClassName('css-1qnbcrp')[0].append(newDriverDiv)
                        }
                    }
                })
              }
         }, 1);

         if (window.location.href.includes('rosterview') && window.location.href.includes("waveplan")) {
            let overlayDiv = document.createElement('div')
            overlayDiv.id = "overlay"
            overlayDiv.innerHTML = `<div id="popup">
                    <h3>Generating PDF...</h3>
                    <p id="progress-text">Getting Roster View Data..</p>
                </div>
                
                <style>
                    #overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.5);
                        display: none;
                        z-index: 999;
                    }

                    #popup {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                        text-align: center;
                        z-index: 1000;
                    }
                </style>
                `

                document.body.innerHTML = ``

                document.body.append(overlayDiv)

                const overlay = document.getElementById('overlay');
                overlay.style.display = 'block';

                const progressText = document.getElementById('progress-text');

                progressText.innerText = `Getting Roster View Data..`

                fetch(`https://logistics.amazon.de/internal/capacity/rosterview/api/getWorkSchedules?serviceAreaId=792f3e55-c706-4ea3-be31-efb5713704ae&date=${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}&timeWindowStartTime=${new Date(`${new Date().getMonth()+1}.${new Date().getDate()}.${new Date().getFullYear()} 00:00:00`).getTime()}&timeWindowEndTime=${new Date(`${new Date().getMonth()+1}.${new Date().getDate()}.${new Date().getFullYear()} 23:59:00`).getTime()}&filter=%7B%22fullTimeWindow%22%3Afalse%2C%22isEndingInTimeWindow%22%3Afalse%2C%22isStartingInTimeWindow%22%3Afalse%7D&_=1734088663620`, {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": `https://logistics.amazon.de/internal/capacity/rosterview?serviceAreaId=792f3e55-c706-4ea3-be31-efb5713704ae&date=${new Date().getFullYear()}-${new Date().getMonth()+1}-${new Date().getDate()}`,
                    "method": "GET",
                    "mode": "cors"
                }).then(function (response) {
                    return response.json()
                }).then(function (roster) {
                    progressText.innerText = `Uploading Roster View Data..`
                    fetch('https://alexpgdev.com/waveplan/pendingDepart.json').then(function (response) {
                        return response.json();
                    }).then(function (validation) {
                        console.log(validation[0].validation)
                        fetch('https://alexpgdev.com/uploadRosterView.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({station: "DBW3", fileName: "rosterView.json", data: [{validation: validation[0].validation}, roster]}),
                            mode: 'no-cors'
                        }).then(() => {
                            fetch('https://alexpgdev.com/waveplan/rosterView.json').then(function (response) {
                                return response.json()
                            }).then(function (data) {
                                console.log(data)
                                let checkRoster = setInterval(() => {
                                    if(data[0].validation === validation[0].validation && data[1][0]){
                                        progressText.innerText = `Roster View Data uploaded`
                                        clearInterval(checkRoster)
                                        location.href = 'https://alexpgdev.com/waveplan.html'
                                    }
                                }, 1);
                            })
                        })
                    })
                })
            }

        if(window.location.href === "https://logistics.amazon.co.uk/station/dashboard/outboundAMZL" || window.location.href === "https://eu.sccwebsite.last-mile.amazon.dev/?stationCode=DBW3&cycleId=AllCycles#/outboundAmzl" || window.location.href === "https://eu.sccwebsite.last-mile.amazon.dev/?stationCode=DBW3#/outboundAmzl") {
            let checkInterval = setInterval(() => {
                if(document.getElementsByClassName('css-xlf10u').length > 2){
                    clearInterval(checkInterval)

                    overview()
                }
            }, 1)

            function overview(){
                
              if(document.getElementsByClassName('css-xlf10u').length > 2){
                    clearInterval(checkInterval)

                    let checkStationInt = setInterval(() => {
                        if(document.querySelectorAll('.css-1erdces')){
                            clearInterval(checkStationInt)
                            if(document.querySelectorAll('.css-1erdces')[0].textContent === "DBW3" || document.querySelectorAll('.css-1erdces')[1].textContent === "DBW3"){
                                let wavesDiv = document.createElement('div')
                                wavesDiv.className = `css-1elrb61`
                                wavesDiv.innerHTML = `<div class="css-nlirnw"><p class="css-1qfbqrr" mdn-text=""><b><span>Total Waves</span></b></p><p class="css-l3t0ke" mdn-text="">${document.getElementsByClassName('css-xlf10u').length-2}</p></div>`
                                document.getElementsByClassName('css-6r2ti5')[0].prepend(wavesDiv)
            
                                let genWaveplanDiv = document.createElement('a')
                                genWaveplanDiv.id = `genWavePlanId`
                                genWaveplanDiv.classList.add('css-z2bjb6')
                                genWaveplanDiv.style.marginLeft = "50px"
                                genWaveplanDiv.style.borderRadius = "5%"
                                genWaveplanDiv.style.textAlign = "center"
                                genWaveplanDiv.style.alignContent = "center"
                                genWaveplanDiv.style.textDecoration = "none"
                                //genWaveplanDiv.href = "https://logistics.amazon.co.uk/station/dashboard/outboundAMZL?waveplan"
                                //genWaveplanDiv.target = "_blank"
                                genWaveplanDiv.innerHTML = `Generate Waveplan`
                                document.getElementsByClassName('css-nlardr')[0].append(genWaveplanDiv)
            
                                document.getElementById('genWavePlanId').addEventListener('click', function (e) {
                                    window.top.postMessage({
                                        action: 'startGenWaveplan'
                                    }, `*`)
                                })
                            }
                        }
                    }, 1)

                    for (let i = 0; i < document.querySelectorAll(".css-appfkg tbody > tr:nth-child(2n) > *").length; i++){
                        document.querySelectorAll(".css-appfkg tbody > tr:nth-child(2n) > *")[i].style.backgroundColor = "rgb(220, 220, 220)";
                    }

                    
                    for(let i = 2; i < document.querySelectorAll(".css-xlf10u").length+1; i++){
                        function color(){
                            if(i % 2 === 1){
                                return "#fff"
                            } else {
                                return "rgb(220, 220, 220)"
                            }
                        }
                        let wavesNum = document.createElement("div")
                        wavesNum.innerHTML = `<p style="position: absolute;
                        z-index: 9;
                        margin-left: -99%;
                        color: ${color()};
                        font-weight: bold;
                        margin-top: -9px;
                        font-size: 55px !important;
                        border-bottom: 0px !important;">
                        ${i-1}</p>`
                        document.querySelectorAll(".css-xlf10u")[i].append(wavesNum)
                    }
              }
            }

            let checkGqzgeoInterval = setInterval(() => {
                if(document.getElementsByClassName('css-gqzgeo')[1]){
                    clearInterval(checkGqzgeoInterval)
            let atRiskPackagesDiv = document.createElement('div')
            atRiskPackagesDiv.id = "atRiskDiv"
            atRiskPackagesDiv.innerHTML = `
            <style>
                #atRiskDiv {
                    width: fit-content;
                    /*position: absolute;*/
                    text-align: center;
                    margin-left: 3%;
                    align-items: center;
                    border: 1px solid red;
                }

                #atRiskDiv table tr {
                    border-top: 1px solid red;
                    border-bottom: 1px solid red;
                }

                #atRiskDiv table td {
                    border-right: 1px solid red;
                    padding-left: 10px;
                    padding-right: 10px;
                }
            </style>

            <b>At Risk of Completion</b><br><p style="color:#706e6e;">Routes that have been assigned for longer<br>than 7 minutes with 0 pick progress</p><br><table id="atRiskTable">
                <tbody>
                <tr>
                    <td>Route</td>
                    <td>Associate</td>
                    <td>Time elapsed</td>
                    <td>Aisles</td>
                    <td>Pick progress</td>
                </tr>`
            atRiskPackagesDiv.style.marginLeft = '3%'

            document.getElementsByClassName('css-gqzgeo')[1].appendChild(atRiskPackagesDiv)

            let atRiskNow
            function atRiskComp() {
            atRiskNow = Date.now()

            fetch('https://logistics.amazon.co.uk/rsws/route/station/DBW3?date=5/21/2024').then(function(response) {
                return response.json();
            }).then(function(picklists) {
                // If at list 1 route exists
                if(picklists.routes[0]){
                    let picklistsLength = picklists.routes.length
                    // Array to store picklist info
                    let atRiskCount = []
                    // For each route
                    for(let i = 0; i < picklistsLength; i++){
                        // For each picklist
                        for(let j = 0; j < picklists.routes[i].picklists.length; j++){
                            if(picklists.routes[i].picklists[j].lastActivityTime !== null && Date.now() - picklists.routes[i].picklists[j].lastActivityTime > 420000 && picklists.routes[i].picklists[j].pickProgress.completedCount === 0){
                                if(atRiskCount[picklists.routes[i].routeCode]) return;
                                atRiskCount[atRiskCount.length] = {route: picklists.routes[i].routeCode, associate: picklists.routes[i].picklists[j].associates[0].alias, location: picklists.routes[i].picklists[j].sourceLocation, lastActivityTime: picklists.routes[i].picklists[j].lastActivityTime, pickProgressCompleted: picklists.routes[i].picklists[j].pickProgress.completedCount, pickProgressTotal: picklists.routes[i].picklists[j].pickProgress.totalCount}
                            }
                        }
                    }

                                if(document.querySelectorAll('.atRiskRows')){
                                    let rows = document.querySelectorAll('.atRiskRows')
                                    rows.forEach(e => {
                                        e.remove()
                                    })
                                }

                                for(let i = 0; i < atRiskCount.length; i++){
                                    let name = `${atRiskCount[i].associate}`.replace('@', '')

                            let customIcons = []
                            fetch('https://alexpgdev.com/heheIcons.json', {
	                            cache: "no-cache"
                            }).then(function(response) {
                              return response.json();
                            }).then(function(icons) {
                                for (let i = 0; i < icons.icons.length; i++) {
                                    function fixURL(){
                                        if(!icons.icons[i].icon.includes('alexpgdev.com')){
                                            return `https://alexpgdev.com/${icons.icons[i].icon}`
                                        } else {
                                            return icons.icons[i].icon
                                        }
                                    }
                                    customIcons[icons.icons[i].name] = fixURL()
                                }

                                    function icon() {
                                        if(customIcons[name]){
                                            return customIcons[name]
                                        } else {
                                            return `https://internal-cdn.amazon.com/badgephotos.amazon.com/?login=${name}`
                                        }
                                    }

                                    function millisToMinutesAndSeconds(millis) {
                                        var minutes = Math.floor(millis / 60000);
                                        var seconds = ((millis % 60000) / 1000).toFixed(0);
                                        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                                    }


                                    // Create row for each associate and information
                                    let newAtRiskRow = document.createElement("tr")
                                    newAtRiskRow.className = 'atRiskRows'
                                    newAtRiskRow.innerHTML =
                                    `
                                        <tr>
                                            <td>${atRiskCount[i].route}</td>
                                            <td><img src="${icon()}" style="width: 50px;"><br>${name}</td>
                                            <td>${millisToMinutesAndSeconds(Date.now() - atRiskCount[i].lastActivityTime)}</td>
                                            <td>${atRiskCount[i].location}</td>
                                            <td>${atRiskCount[i].pickProgressCompleted}/${atRiskCount[i].pickProgressTotal}</td>
                                        </tr>
                                     `
                                    // Append row in #atRiskTable
                                    document.getElementById('atRiskTable').appendChild(newAtRiskRow)
                                })
                                }
                }
            })
                function dcMillisToMinutesAndSeconds(millis) {
                    var seconds = ((millis % 60000) / 1000).toFixed(0);
                    return seconds;
                }

                // Interval to update packages in Cancelled Packages popup after 29 seconds
                let atRiskInterval = function() {
                    if(dcMillisToMinutesAndSeconds(Date.now()-atRiskNow) > 5){
                        atRiskRefresh()
                    }
                }

                // Checks if updating packages in at Risk Packages is required each 5 seconds
                let atRiskUpdateInterval = setInterval(atRiskInterval, 1000)

                // Update packages in Cancelled Packages popup
                function atRiskRefresh(){
                    atRiskComp()
                }

                }
                    atRiskComp()
                }
            }, 1)

            // document.querySelectorAll(".css-xlf10u").length

        }

        // Prevents dublicate between page & iframe for QR Code Generator & Cancelled Packages popups
        if(!window.location.href.includes('last-mile.amazon.dev')){
            // Create QR Code Generator popup
            let newQrPopupDiv = document.createElement('div')
            newQrPopupDiv.id = 'newQrPopupDiv'
            newQrPopupDiv.style.height = '0px'
            newQrPopupDiv.innerHTML = `
                <style>
                    #qrdiv {
                        position: absolute;
                        z-index: 9;
                        bottom: 50%;
                        right: 10%;
                    }

                    .qrpopup {
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .qrpopup .qrpopuptext {
                        visibility: hidden;
                        width: 500px;
                        height: 400px;
                        background-color: #555;
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 8px 0;
                        position: absolute;
                        z-index: 1;
                        right: 110%;
                        user-select: text;
                        cursor:auto;
                    }

                    .qrpopup .qrshow {
                        visibility: visible;
                        -webkit-animation: fadeIn 1s;
                        animation: fadeIn 1s;
                    }

                    @-webkit-keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity: 1;}
                    }

                    @keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity:1 ;}
                    }

                    #qrcode {
                        margin-top:10px;
                        margin-left: 185px;
                    }
                    
                    .qrcodeHistoryPanel {
                        background-color: #313131;
                        width: 150px;
                        height: 400px;
                        position: absolute;
                        z-index: 9;
                        margin-top: -8px;
                        overflow-y: scroll;
                    }

                    .historyItem {
                        background: yellow; width: 150px;
                        margin-top: 10px;
                        background-color: #484848;
                        z-index: 10;
                        cursor: pointer;
                        max-height: 70px;
                        overflow: hidden;
                        height: 45px;
                    }

                    .historyItemPrev {
                        height: 45px;
                        max-height: 45px;
                        display: -webkit-box;
                        line-clamp: 2;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: pre-wrap;
                    }
                </style>

                <div id="qrdiv">
                    <div id="myqrdivheader" class="qrpopup" title="QR Code Generator"><img id="qrpopupImg" src="https://cdn.alexpgdev.com/2vdvp.png" style="width: 50px;">
                        <span class="qrpopuptext" id="myqrPopup">
                            <div id="qrcodeHistoryPanelId" class="qrcodeHistoryPanel">
                                <h1>History</h1>
                                <div id="historyPanel">
                                </div>
                            </div>
                            <input id="qrText" type="text" value="Input Text" style="width:60%; margin-left: 147px;"/><br />
                            <div id="qrcode"></div>
                            <p style="margin-left: 147px;">Click inside the popup or press Enter to update</p>
                            <button id="dolphinVerificationId" style="margin-left: 147px; margin-top: -5px; font-size: 18px; height: 30px; width: 230px; color: white; background-color: rgb(6, 185, 255); border: 0px;">Dolphin Verification</button>
                        </span>
                    </div>
                </div>
            `
            
            if(!GM_getValue('history')){
                GM_setValue('history', [])
            }

            let history = GM_getValue('history')

            // Functionality of QR Code Generator
            setTimeout(() => {
                let currentQRCode = `https://barcodeapi.org/api/qr/${document.getElementById("qrText").value}`
                
                for(let i = 0; i < history.length; i++){
                    let newHistoryItem = document.createElement('div')
                    newHistoryItem.innerHTML = `
                    <div class="historyItem" id="historyItemId" data-index="${i}">
                        <p class="historyItemPrev">${history[i]}</p>
                    </div>
                    `
    
                    document.getElementById('historyPanel').prepend(newHistoryItem)    
                }
                
                var qrcode = new QRCode("qrcode");
                // Create the QR Code based on input
                function makeCode (option, dolphinVer) {
                    let elText

                    if(dolphinVer){
                        elText = dolphinVer
                    } else {
                        elText = document.getElementById("qrText");
                    }

                    if(!elText.value && !dolphinVer){
                        document.getElementById('qrcode').style.display = 'none'
                    } else {
                        document.getElementById('qrcode').style.display = ''
                        if(document.getElementById('qrCodeImgId')){
                            document.getElementById('qrCodeImgId').src = `https://barcodeapi.org/api/qr/${elText.value ? elText.value : elText}`
                        } else {
                            let qrcodeimg = document.createElement('img')
                            qrcodeimg.id = 'qrCodeImgId'
                            qrcodeimg.src = `https://barcodeapi.org/api/qr/${elText.value}`
                            qrcodeimg.style.marginTop = '-250px'
                            qrcodeimg.style.marginLeft = '-43px'

                            document.getElementById('qrcode').appendChild(qrcodeimg)
                        }
                    }
                    
                    if(option !== 'Default' && !dolphinVer){
                        if(currentQRCode !== `https://barcodeapi.org/api/qr/${elText.value}`){

                            history.push(elText.value)
                                
                            if(history.length > 100){
                                const elements = document.querySelectorAll(`.historyItemPrev`);
                                Array.from(elements).find(el => el.textContent.trim() === history[0]).parentNode.remove()

                                history.splice(0, 1)
                            }

                            GM_setValue('history', history)
                            
                            document.querySelectorAll('.historyItem').forEach(e => {
                                e.style.backgroundColor = "#484848"
                            })

                            let newHistoryItem = document.createElement('div')
        
                            newHistoryItem.innerHTML = `
                            <div class="historyItem" id="historyItemId" data-index="${history.length-1}" style="background-color: #828282;">
                                <p class="historyItemPrev">${elText.value}</p>
                            </div>
                            `
        
                            document.getElementById('historyPanel').prepend(newHistoryItem)
    
                            currentQRCode = `https://barcodeapi.org/api/qr/${elText.value}`
                        }
                    }
                }

                // Call function on load with default input
                makeCode('default');

                // Call function when Enter key is pressed
                addEventListener("keypress", (event) => {
                    if(event.keyCode === 13){
                        makeCode();
                    }
                });

                // Call function when clicked inside QR Code Generator popup
                document.getElementById('myqrPopup').onclick = function(event) {
                    if(event.target.id !== "dolphinVerificationId" || event.target.id !== "qrText" || event.target.id !== `historyPanel` || event.target.parentNode.id !== `historyPanel` || event.target.parentNode.id !== `historyItemId`){
                        makeCode()
                    }
                };

                document.getElementById('dolphinVerificationId').addEventListener('click', function (e) {
                    let qrText = document.getElementById("qrText");
                    fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                            "Accept": "*/*",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Content-Type": "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"
                        },
                        "referrer": "https://logistics.amazon.co.uk/station/dashboard/dolphinVerification",
                        "body": `{\"resourcePath\":\"/dolphinVerification\",\"httpMethod\":\"post\",\"processName\":\"dolphinVerification\",\"requestBody\":{\"producerId\":\"SCC\",\"tokenExpiry\":\"${Date.now()+300000}\",\"associate\":\"${qrText.value}\"}}`,
                        "method": "POST",
                        "mode": "cors"
                    }).then(function (response) {
                        return response.json()
                    }).then(function (token) {
                        makeCode('', token.Token)
                    })
                })
                
                document.getElementById('historyPanel').addEventListener('click', function (e) {
                    if(e.target.parentNode.className === "historyItem"){
                        document.querySelectorAll('.historyItem').forEach(e => {
                            e.style.backgroundColor = "#484848"
                        })
                        e.target.parentNode.style.backgroundColor = "#828282"
                        
                        var qrPopup = document.getElementById('myqrPopup');

                        document.getElementById('qrcode').style.display = ''
                        if(document.getElementById('qrCodeImgId')){
                            document.getElementById('qrCodeImgId').src = `https://barcodeapi.org/api/qr/${e.target.textContent}`
                        } else {
                            let qrcodeimg = document.createElement('img')
                            qrcodeimg.id = 'qrCodeImgId'
                            qrcodeimg.src = `https://barcodeapi.org/api/qr/${e.target.textContent}`
                            qrcodeimg.style.marginTop = '-250px'
                            qrcodeimg.style.marginLeft = '-43px'

                            document.getElementById('qrcode').appendChild(qrcodeimg)
                        }
                        document.getElementById('qrText').value = e.target.textContent
                        if(qrPopup.classList.toggle('qrshow') !== true){
                            qrPopup.classList.toggle('qrshow');
                        }
                        currentQRCode = `https://barcodeapi.org/api/qr/${e.target.textContent}`
                    }
                })
            }, 100);

            // Append popup in body
            document.body.appendChild(newQrPopupDiv)

            // Toggle between visibilty of content inside popup
            function qrshowPopup() {
                var popup = document.getElementById('myqrPopup');
                popup.classList.toggle('qrshow');
            }

            dragQrElement(document.getElementById("qrdiv"));

            // Ability to drag the popup
            function dragQrElement(elmnt) {
                var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                var isDragging = false;

                if (document.getElementById(elmnt.id + "qrheader")) {
                    document.getElementById(elmnt.id + "qrheader").onmousedown = dragMouseDown;
                } else {
                    elmnt.onmousedown = dragMouseDown;
                }

                function dragMouseDown(e) {
                    if (e.target.closest('.qrpopuptext')) {
                        return;
                    }

                    e = e || window.event;
                    e.preventDefault();
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    isDragging = false;
                    document.onmouseup = closeDragElement;
                    document.onmousemove = elementDrag;
                }

                function elementDrag(e) {
                    e = e || window.event;
                    e.preventDefault();
                    isDragging = true;
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

                    // Show the popup content on right side if popup it's too far left
                    if(elmnt.offsetLeft-500 < 5){
                        document.querySelector('.qrpopuptext').style.left = `60px`
                    } else {
                        document.querySelector('.qrpopuptext').style.left = `-505px`
                    }

                    elmnt.style.width = '50px'

                    if(elmnt.offsetLeft < 0){
                        elmnt.style.left = 0
                    }

                    if(elmnt.offsetTop < 50){
                        elmnt.style.top = 50
                    }
                }

                function closeDragElement() {
                    document.onmouseup = null;
                    document.onmousemove = null;
                }

                // Toggle popup on image click
                document.getElementById('qrpopupImg').onclick = function() {
                    // Not toggling if popup is being dragged
                    if (!isDragging) {
                        qrshowPopup();
                    }
                };
            }

            // Create Cancelled Packages popup
            let popUpDiv = document.createElement('div')
            popUpDiv.id = 'popUpDivId'
            popUpDiv.style.height = '0px'
            popUpDiv.innerHTML = `
                <style>
                    #myPopupDiv {
                        position: absolute !important;
                        z-index: 9 !important;
                        bottom: 15% !important;
                        right: 10% !important;
                    }

                    .popup {
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .popup .popuptext {
                        visibility: hidden;
                        width: 850px;
                        background-color: #555;
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 8px 0;
                        position: absolute;
                        z-index: 1;
                        right: 110%;
                        user-select: text;
                        cursor:auto;
                    }

                    .popup .show {
                        visibility: visible;
                        -webkit-animation: fadeIn 1s;
                        animation: fadeIn 1s;
                    }

                    @-webkit-keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity: 1;}
                    }

                    @keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity:1 ;}
                    }

                    .bottom-right {
                        position: absolute;
                        bottom: 0px;
                        left: 30px;
                        z-index: 10;
                        color: black;
                        background-color: red;
                        border-radius: 50%;
                        width: 40%;
                        height: 40%;
                        text-align: center;
                        font-size: 14px;
                    }
                </style>

                <div id="myPopupDiv">
                    <div id="myPopupDivheader" class="popup" title="Delivery Cancelled"><img id="popupImg" src="https://i.imgur.com/ZU7BaQH.png" style="width: 50px;">
                        <span class="popuptext" id="myPopup" style="font-size: 20px;">
                            <table id="dcTable" style="width:100%; color: white; font-size: 20px;">
                                <tr>Delivery Cancelled</tr>
                                <tr>
                                    <td>QR</td>
                                    <td>Time</td>
                                    <td>Package ID</td>
                                    <td>Sort Zone</td>
                                    <td>Package State</td>
                                    <td>Stage Location</td>
                                    <td>Location</td>
                                    <td>Route</td>
                                </tr>
                                </table>
                        </span>
                    </div>
                </div>
            `
            // Prepend popup in body
            document.body.prepend(popUpDiv)

            let dcNow
            function cancelledPackages() {
                dcNow = Date.now()
                // Fetch cancelled packages
                fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": "https://logistics.amazon.co.uk/station/dashboard/ageing",
                    "body": "{\"resourcePath\":\"/os/getDrillDownData\",\"httpMethod\":\"post\",\"processName\":\"oculus\",\"requestBody\":{\"nodeId\":\"DBW3\",\"packageStatusMap\":{\"Delivery Cancelled\":[]},\"filters\":[{\"__type\":\"TermFilter:http://internal.amazon.com/coral/com.amazon.oculusservice.model.filter/\",\"filterMap\":{\"DWELL_TIME\":[\"0_DAY\",\"1_DAY\"]}},{\"__type\":\"RangeFilter:http://internal.amazon.com/coral/com.amazon.oculusservice.model.filter/\",\"filterMap\":{}}]}}",
                    "method": "POST",
                    "mode": "cors"
                }).then(function(response) {
                    return response.json();
                }).then(function(cancelledPackages) {
                    // Create counter of cancelled packages
                    let dcCount = document.createElement("b")
                    dcCount.id = "counter"
                    dcCount.classList = "bottom-right"

                    // Add counter on popup
                    document.getElementById('myPopupDivheader').prepend(dcCount)

                    for(let i = 0; i < cancelledPackages.packageResultList.length; i++){
                        // Fetch package history for each cancelled package
                        fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                            "credentials": "include",
                            "headers": {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0",
                                "Accept": "*/*",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Content-Type": "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                                "Sec-Fetch-Dest": "empty",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "same-origin"
                            },
                            "referrer": `https://logistics.amazon.co.uk/station/dashboard/search?shareableLink=detailPage%2F${cancelledPackages.packageResultList[i].trackingId}`,
                            "body": `{\"resourcePath\":\"/os/getPackageHistoryData\",\"httpMethod\":\"post\",\"processName\":\"oculus\",\"requestBody\":{\"packageId\":\"${cancelledPackages.packageResultList[i].trackingId}\",\"pageSize\":100,\"pageToken\":null,\"startTime\":null,\"endTime\":null}}`,
                            "method": "POST",
                            "mode": "cors"
                        }).then(function(responsetwo) {
                            return responsetwo.json();
                        }).then(function(detPackage) {
                            //if(detPackage.packageHistory[i]){
                            let packageDate = cancelledPackages.packageResultList[i].lastUpdatedTime
                            packageDate = `${packageDate[8]}${packageDate[9]}`

                            function today(){
                                if(new Date().getDate() < 10){
                                    return `0${new Date().getDate()}`
                                } else {
                                    return `${new Date().getDate()}`
                                }
                            }

                            // Show only packages that are today's date
                            if(`${today()}` === `${packageDate}`){
                                function checkPackage() {
                                    if(detPackage.packageHistory[i]){
                                        return i
                                    } else {
                                        return 0
                                    }
                                }

                                let scanLocation = '-'
                                let container = '-'
                                let route = '-'

                                // Relevant informations about package from package history
                                for(let j = 0; j < detPackage.packageHistory.length; j++) {

                                    if(detPackage.packageHistory[j].packageState === 'STAGED' && `${new Date(detPackage.packageHistory[j].stateTime).getDate()}` === `${new Date().getDate()}`){
                                        if(detPackage.packageHistory[j].scanLocation !== null){
                                            if(scanLocation === '-'){
                                                scanLocation = detPackage.packageHistory[j].scanLocation
                                            }
                                        }
                                    }

                                    if(detPackage.packageHistory[j].scanContainer !== null && `${new Date(detPackage.packageHistory[j].stateTime).getDate()}` === `${new Date().getDate()}`){
                                        if(container === '-'){
                                            container = detPackage.packageHistory[j].scanContainer
                                        }
                                    }

                                    if(detPackage.packageHistory[j].routeCode !== null && `${new Date(detPackage.packageHistory[j].stateTime).getDate()}` === `${new Date().getDate()}`){
                                        if(route === '-'){
                                            route = detPackage.packageHistory[j].routeCode
                                        }
                                    }
                                }

                                let lastUpdateTime = cancelledPackages.packageResultList[i].lastUpdatedTime

                                // Only relevant information regarding container name (ID + Color)
                                function cont(){
                                    if(container === null){
                                        return '-'
                                    } else {
                                        return container.substr(container.length - 8)
                                    }
                                }

                                // Get sort zone of package if exist
                                function sz(){
                                    if(detPackage.packageHistory[checkPackage()].sortZone === null){
                                        return '-'
                                    } else {
                                        return detPackage.packageHistory[checkPackage()].sortZone
                                    }
                                }

                                // Create row for each package
                                let newRow = document.createElement("tr")
                                newRow.className = 'dCrows'
                                newRow.innerHTML = `
                                    <tr>
                                    <td><img id="createQrDc${i}" src="https://cdn.alexpgdev.com/2vdvp.png" style="width: 30px; cursor: pointer;"></td>
                                    <td>${lastUpdateTime.substr(lastUpdateTime.length - 8)}</td>
                                    <td><a href="https://logistics.amazon.co.uk/station/dashboard/search?shareableLink=detailPage%2F${detPackage.packageHistory[checkPackage()].trackingId}" target="_blank" style="color: white;">${detPackage.packageHistory[checkPackage()].trackingId}</a></td>
                                    <td>${sz()}</td>
                                    <td>${detPackage.packageHistory[0].packageState}</td>
                                    <td>${scanLocation}</td>
                                    <td>${cont()}</td>
                                    <td>${route}</td>
                                    </tr>
                                `
                                // Append row in popup table
                                document.getElementById('dcTable').appendChild(newRow)

                                document.getElementById(`createQrDc${i}`).onclick = function() {
                                    var qrPopup = document.getElementById('myqrPopup');

                                        document.getElementById('qrcode').style.display = ''
                                        if(document.getElementById('qrCodeImgId')){
                                            document.getElementById('qrCodeImgId').src = `https://barcodeapi.org/api/qr/${detPackage.packageHistory[checkPackage()].trackingId}`
                                        } else {
                                            let qrcodeimg = document.createElement('img')
                                            qrcodeimg.id = 'qrCodeImgId'
                                            qrcodeimg.src = `https://barcodeapi.org/api/qr/${detPackage.packageHistory[checkPackage()].trackingId}`
                                            qrcodeimg.style.marginTop = '-250px'
                                            qrcodeimg.style.marginLeft = '-43px'

                                            document.getElementById('qrcode').appendChild(qrcodeimg)
                                        }
                                        document.getElementById('qrText').value = detPackage.packageHistory[checkPackage()].trackingId
                                        if(qrPopup.classList.toggle('qrshow') !== true){
                                            qrPopup.classList.toggle('qrshow');
                                        }
                                };
                            //}
                                // Change cancelled packages counter based on length of rows
                                // Not using cancelled packages length to avoid packages from other dates than today
                                document.getElementById('counter').innerHTML = document.getElementsByClassName('dCrows').length
                            }
                            if(document.getElementsByClassName('dCrows').length < 1){
                                document.getElementById('counter').style.display = 'none'
                            } else {
                                document.getElementById('counter').style.display = ''
                            }
                        })
                    }
                })

                // Toggle between visibilty of content inside popup
                function showPopup() {
                    var popup = document.getElementById('myPopup');
                    popup.classList.toggle('show');
                }

                dragElement(document.getElementById("myPopupDiv"));

                // Ability to drag the popup
                function dragElement(elmnt) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    var isDragging = false;

                    if (document.getElementById(elmnt.id + "header")) {
                        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                    } else {
                        elmnt.onmousedown = dragMouseDown;
                    }

                    function dragMouseDown(e) {
                        if (e.target.closest('.popuptext')) {
                            return;
                        }

                        e = e || window.event;
                        e.preventDefault();
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        isDragging = false;
                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        isDragging = true;
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

                        // Show the popup content on right side if popup it's too far left
                        if(elmnt.offsetLeft-850 < 5){
                            document.querySelector('.popuptext').style.left = `60px`
                        } else {
                            document.querySelector('.popuptext').style.left = `-855px`
                        }

                        elmnt.style.width = '50px'

                        if(elmnt.offsetLeft < 0){
                            elmnt.style.left = 0
                        }

                        if(elmnt.offsetTop < 50){
                            elmnt.style.top = 50
                        }
                    }

                    function closeDragElement() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }


                    // Toggle popup on image click
                    document.getElementById('popupImg').onclick = function() {
                        if (!isDragging) {
                            showPopup();
                        }
                    };

                    let int = setInterval(() => {
                        if(document.getElementById('counter')){
                              clearInterval(int)
                        document.getElementById('counter').onclick = function() {
                            if (!isDragging) {
                                showPopup();
                            }
                        };
                        }

                    }, 1);


                    // Prevent popup from closing when clicked
                    document.getElementById('myPopup').onclick = function(event) {
                        event.stopPropagation();
                    };

                    // Close popup when clicking outside of it
                    document.addEventListener('mousedown', function(event) {
                        var popup = document.getElementById('myPopup');
                        var img = document.getElementById('popupImg');
                        var cnt = document.getElementById('counter');

                        if (event.target !== popup && event.target !== img && !popup.contains(event.target) && event.target !== cnt) {
                            popup.classList.remove('show');
                        }
                    });
                }

                function dcMillisToMinutesAndSeconds(millis) {
                    var seconds = ((millis % 60000) / 1000).toFixed(0);
                    return seconds;
                }

                // Interval to update packages in Cancelled Packages popup after 29 seconds
                let dcInterval = function() {
                    if(dcMillisToMinutesAndSeconds(Date.now()-dcNow) > 29){
                        cancelledPackagesRefresh()
                    }
                }

                // Checks if updating packages in Cancelled Packages is required each 5 seconds
                let dcUpdateInterval = setInterval(dcInterval, 5000)

                // Update packages in Cancelled Packages popup
                function cancelledPackagesRefresh(){

                    let rows = document.querySelectorAll('.dCrows')

                    rows.forEach(e => {
                        e.remove()
                    })

                    document.getElementById('counter').remove()

                    cancelledPackages()
                }

            }

            cancelledPackages()

            // Create At Station Packages popup
            let atStationPopUpDiv = document.createElement('div')
            atStationPopUpDiv.id = 'atStationPopUpDivId'
            atStationPopUpDiv.style.height = '0px'
            atStationPopUpDiv.innerHTML = `
                <style>
                    #myAtStationPopupDiv {
                        position: absolute !important;
                        z-index: 9 !important;
                        bottom: 30% !important;
                        right: 10% !important;
                    }

                    .atStationPopup {
                        position: relative;
                        display: inline-block;
                        cursor: pointer;
                    }

                    .atStationPopup .atStationPopuptext {
                        visibility: hidden;
                        width: 950px;
                        max-height: 250px;
                        background-color: #555;
                        color: #fff;
                        text-align: center;
                        border-radius: 6px;
                        padding: 8px 0;
                        position: absolute;
                        z-index: 1;
                        right: 110%;
                        user-select: text;
                        cursor:auto;
                        overflow-y: scroll;
                    }

                    .atStationPopup .atStationShow {
                        visibility: visible;
                        -webkit-animation: fadeIn 1s;
                        animation: fadeIn 1s;
                    }

                    @-webkit-keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity: 1;}
                    }

                    @keyframes fadeIn {
                        from {opacity: 0;}
                        to {opacity:1 ;}
                    }
                </style>

                <div id="myAtStationPopupDiv">
                    <div id="myAtStationPopupDivheader" class="atStationPopup" title="At Station Packages"><img id="atStationPopupImg" src="https://i.imgur.com/YIH52FT.png" style="width: 50px;">
                        <span class="atStationPopuptext" id="myAtStationPopup" style="font-size: 20px;">
                            <table id="atStationTable" style="width:100%; color: white; font-size: 20px;">
                                <tr><b>At Station Packages</b></tr>
                                <br>
                                <p style="color:#c2c2c2;">Top 50 packages with most Minutes in State</p>
                                <p id="printAll" style="color: white; position: sticky; margin-top: -27px; margin-right: 80%; cursor: pointer;top: 0;background-color: rgb(6, 185, 255);z-index: 4; display: none;">Print All Selected</p>
                                <p style="color: rgb(6, 185, 255); position: absolute; margin-top: -27px; margin-left: 90%; cursor: pointer;" id="refreshATS">Refresh</p>
                                <tr>
                                    <td>Check</td>
                                    <td>Print</td>
                                    <td>Tracking ID</td>
                                    <td>Minutes in State</td>
                                    <td>Sort Zone</td>
                                    <td>Package State</td>
                                    <td>L x W x H (cm)</td>
                                    <td>Weight</td>
                                </tr>
                                </table>
                        </span>
                    </div>
                </div>
            `
            // Prepend popup in body
            document.body.prepend(atStationPopUpDiv)

                let ATSPrintPackages = []
                let pauseRefresh = 0

                let atStationNow
                function atStation() {
                atStationNow = Date.now()
                let atStationPackages = []
                ATSPrintPackages = []
                if (document.getElementById('ATSLoading')) document.getElementById('ATSLoading').remove()
                if(document.getElementById('printAll')) document.getElementById('printAll').style.display = 'none'
                function getPackages(min){
                    fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                        "credentials": "include",
                        "headers": {
                            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                            "Accept": "*/*",
                            "Accept-Language": "en-US,en;q=0.5",
                            "Content-Type": "application/json",
                            "X-Requested-With": "XMLHttpRequest",
                            "Sec-Fetch-Dest": "empty",
                            "Sec-Fetch-Mode": "cors",
                            "Sec-Fetch-Site": "same-origin"
                        },
                        "referrer": "https://logistics.amazon.co.uk/station/dashboard/dwell",
                        "body": `{\"resourcePath\":\"/os/getDrillDownData\",\"httpMethod\":\"post\",\"processName\":\"oculus\",\"requestBody\":{\"nodeId\":\"DBW3\",\"packageStatusMap\":{\"Inducted\":[],\"Stow Problem Solve\":[],\"Stow Buffered\":[]},\"filters\":[{\"__type\":\"TermFilter:http://internal.amazon.com/coral/com.amazon.oculusservice.model.filter/\",\"filterMap\":{\"DWELL_TIME\":[\"${min-100}_MINUTES\",\"${min}_MINUTES\"],\"CYCLE\":[\"CYCLE_1\"],\"SHIPMENT_TYPE\":[\"Delivery\"]}},{\"__type\":\"RangeFilter:http://internal.amazon.com/coral/com.amazon.oculusservice.model.filter/\",\"filterMap\":{}}]}}`,
                        "method": "POST",
                        "mode": "cors"
                    }).then(function (response) {
	                    return response.json()
                    }).then(function (packages) {
                        for(let i = 0; i < packages.packageResultList.length; i++) {
                            atStationPackages[atStationPackages.length] = {trackingId: packages.packageResultList[i].trackingId, minutesInState: packages.packageResultList[i].minutesInState, sortZone: packages.packageResultList[i].sortZone, state: packages.packageResultList[i].state, length: packages.packageResultList[i].length, width: packages.packageResultList[i].width, height: packages.packageResultList[i].height, weight: packages.packageResultList[i].weight}
                        }
                        sendPackages()
                    })
                }

                    let min = 500

                    getPackages(min)

                    function sendPackages(){
                        function allPackages() {
                            if(atStationPackages.length > 49){
                                return 49
                            } else {
                                return atStationPackages.length
                            }
                        }
                        if(atStationPackages.length > allPackages() || min < 1){

                                // Convet into an array of objects
                            let sortingArray = Object.keys(atStationPackages).map(key => {
                                let newObj = {};
                                newObj[key] = atStationPackages[key];
                                return newObj;
                            });

                            // Sort array
                            sortingArray.sort((a, b) => {
                                const countA = Object.values(a)[0].minutesInState;
                                const countB = Object.values(b)[0].minutesInState;
                                return countB - countA;
                            });

                            // Remove all rows if any row exists (for updating table)
                            if(document.querySelectorAll('.atStationRows')){
                                let atStationRows = document.querySelectorAll('.atStationRows')
                                atStationRows.forEach(e => {
                                    e.remove()
                                })
                            }

                            function maxPackages() {
                                if(sortingArray.length > 49){
                                    return 50
                                } else {
                                    return sortingArray.length
                                }
                            }
                            
                            if (document.getElementById('ATSLoading')) document.getElementById('ATSLoading').remove()

                            for(let i = 0; i < maxPackages(); i++) {
                                let newAtStationRow = document.createElement("tr")

                                newAtStationRow.className = 'atStationRows'
                                newAtStationRow.innerHTML = `
                                    <tr>
                                    <td><input id="ATS_Select_${i}" type="checkbox" id="scales" name="scales" style="width: 55px; height: 20px;" /></td>
                                    <td><img id="ATSCheck_${i}" class="searchingCheckbox" src="https://alexpgdev.com/print.png" style="width: 30px; cursor: pointer;"></td>
                                    <td><a href="https://logistics.amazon.co.uk/station/dashboard/search?shareableLink=detailPage%2F${sortingArray[i][Object.keys(sortingArray[i])].trackingId}" target="_blank" style="color: white;">${sortingArray[i][Object.keys(sortingArray[i])].trackingId}</a></td>
                                    <td>${sortingArray[i][Object.keys(sortingArray[i])].minutesInState}</td>
                                    <td>${sortingArray[i][Object.keys(sortingArray[i])].sortZone}</td>
                                    <td>${sortingArray[i][Object.keys(sortingArray[i])].state}</td>
                                    <td>${(sortingArray[i][Object.keys(sortingArray[i])].length).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].width).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].height).replace('cm', '')}</td>
                                    <td>${sortingArray[i][Object.keys(sortingArray[i])].weight}</td>
                                    </tr>
                                `
                                // Append row in popup table
                                document.getElementById('atStationTable').appendChild(newAtStationRow)

                                document.getElementById(`ATSCheck_${i}`).addEventListener('click', function(e) {
                                    console.log(`ATS Package Check Clicked: ${sortingArray[i][Object.keys(sortingArray[i])].trackingId}`)
                                    window.top.postMessage({
                                        action: 'fetchPackageDetails',
                                        packageId: `${sortingArray[i][Object.keys(sortingArray[i])].trackingId}`,
                                        sortZone: `${sortingArray[i][Object.keys(sortingArray[i])].sortZone}`,
                                        packageDimensions: `${(sortingArray[i][Object.keys(sortingArray[i])].length).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].width).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].height)}`,
                                        packageWeight: `${sortingArray[i][Object.keys(sortingArray[i])].weight}`
                                    }, `*`)
                                })

                                document.getElementById(`ATS_Select_${i}`).addEventListener('click', function (e) {
                                    if(document.getElementById(`ATS_Select_${i}`).checked){
                                        ATSPrintPackages[sortingArray[i][Object.keys(sortingArray[i])].trackingId] = {
                                            packageId: `${sortingArray[i][Object.keys(sortingArray[i])].trackingId}`,
                                            sortZone: `${sortingArray[i][Object.keys(sortingArray[i])].sortZone}`,
                                            packageDimensions: `${(sortingArray[i][Object.keys(sortingArray[i])].length).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].width).replace('cm', '')} x ${(sortingArray[i][Object.keys(sortingArray[i])].height)}`,
                                            packageWeight: `${sortingArray[i][Object.keys(sortingArray[i])].weight}`
                                        }
                                        console.log(ATSPrintPackages)
                                        console.log(Object.keys(ATSPrintPackages).length)
                                        if(Object.keys(ATSPrintPackages).length > 1){
                                            document.getElementById('printAll').style.display = ''
                                        } else {
                                            document.getElementById('printAll').style.display = 'none'
                                        }
                                    } else {
                                        delete ATSPrintPackages[sortingArray[i][Object.keys(sortingArray[i])].trackingId]
                                        console.log(ATSPrintPackages)
                                        if(Object.keys(ATSPrintPackages).length > 1){
                                            document.getElementById('printAll').style.display = ''
                                        } else {
                                            document.getElementById('printAll').style.display = 'none'
                                        }
                                    }

                                    console.log(Object.keys(ATSPrintPackages).length)
                                    if(Object.keys(ATSPrintPackages).length > 0){
                                        pauseRefresh = 1
                                    } else {
                                        pauseRefresh = 0
                                    }
                                })
                            }
                            //}, 30000);
                        } else {
                            min = min-100
                            getPackages(min)
                        }
                    }

                // Toggle between visibilty of content inside popup
                function showAtStationPopup() {
                    var atStationPopup = document.getElementById('myAtStationPopup');
                    atStationPopup.classList.toggle('atStationShow');
                }

                dragElement(document.getElementById("myAtStationPopupDiv"));

                // Ability to drag the popup
                function dragElement(elmnt) {
                    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                    var isDragging = false;

                    if (document.getElementById(elmnt.id + "header")) {
                        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
                    } else {
                        elmnt.onmousedown = dragMouseDown;
                    }

                    function dragMouseDown(e) {
                        if (e.target.closest('.atStationPopuptext')) {
                            return;
                        }

                        e = e || window.event;
                        e.preventDefault();
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        isDragging = false;
                        document.onmouseup = closeDragElement;
                        document.onmousemove = elementDrag;
                    }

                    function elementDrag(e) {
                        e = e || window.event;
                        e.preventDefault();
                        isDragging = true;
                        pos1 = pos3 - e.clientX;
                        pos2 = pos4 - e.clientY;
                        pos3 = e.clientX;
                        pos4 = e.clientY;
                        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";

                        // Show the popup content on right side if popup it's too far left
                        if(elmnt.offsetLeft-950 < 5){
                            document.querySelector('.atStationPopuptext').style.left = `60px`
                        } else {
                            document.querySelector('.atStationPopuptext').style.left = `-955px`
                        }

                        elmnt.style.width = '50px'

                        if(elmnt.offsetLeft < 0){
                            elmnt.style.left = 0
                        }

                        if(elmnt.offsetTop < 50){
                            elmnt.style.top = 50
                        }
                    }

                    function closeDragElement() {
                        document.onmouseup = null;
                        document.onmousemove = null;
                    }


                    // Toggle popup on image click
                    document.getElementById('atStationPopupImg').onclick = function() {
                        if (!isDragging) {
                            showAtStationPopup();
                        }
                    };

                    // Prevent popup from closing when clicked
                    document.getElementById('myAtStationPopup').onclick = function(event) {
                        event.stopPropagation();
                    };

                    // Close popup when clicking outside of it
                    document.addEventListener('mousedown', function(event) {
                        var popup = document.getElementById('myAtStationPopup');
                        var img = document.getElementById('atStationPopupImg');

                        if (event.target !== popup && event.target !== img && !popup.contains(event.target)) {
                            popup.classList.remove('atStationShow');
                        }
                    });
                }
                function atStationMillisToMinutesAndSeconds(millis) {
                    var seconds = ((millis % 60000) / 1000).toFixed(0);
                    return seconds;
                }

                // Interval to update packages in Cancelled Packages popup after 30 seconds
                let atStationInterval = function() {
                    console.log('trying to refresh ' + pauseRefresh)
                    if(atStationMillisToMinutesAndSeconds(Date.now()-atStationNow) > 30 && pauseRefresh === 0){
                        console.log('refreshed')
                        atStation()
                    }
                }

                // Checks if updating packages in ATS Packages is required each 5 seconds
                let atStationUpdateInterval = setInterval(atStationInterval, 5000)

                var updateATSButton = document.getElementById("refreshATS");
                updateATSButton.addEventListener("click", function(e) {
                    atStation()
                    clearInterval(atStationUpdateInterval)
                    atStationUpdateInterval = setInterval(atStationInterval, 5000)
                    // Remove all rows if any row exists (for updating table)
                    if(document.querySelectorAll('.atStationRows')){
                        let atStationRows = document.querySelectorAll('.atStationRows')
                        atStationRows.forEach(e => {
                            e.remove()
                        })
                        let loading = document.createElement('tr')
                        loading.id = "ATSLoading"
                        loading.innerHTML = `
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td><img src="https://i.gifer.com/ZKZg.gif" style="width: 50px;"></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                        `
                        document.getElementById('atStationTable').appendChild(loading)
                    }
                });

            }

            document.getElementById('printAll').addEventListener('click', function (e) {
                console.log(`ATS Print All Clicked`)
                window.top.postMessage({
                    action: 'fetchAllPackageDetails',
                    packages: ATSPrintPackages
                }, `*`)
            })

            atStation()
        }

        setTimeout(() => {
            
            function getSelectionText() {
                let text = "";
                const activeEl = document.activeElement;
                const activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
                
                if(activeEl.className === "a-meter-animate vsc-initialized") return;
            
                if (
                  (activeElTagName == "textarea") || (activeElTagName == "input" &&
                  /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
                  (typeof activeEl.selectionStart == "number")
                ) {
                    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
                } else if (window.getSelection) {
                    text = window.getSelection().toString();
                }
            
                return text;
            }
    
            function createPopup() {
                const popup = document.createElement("div");
                popup.id = "selection-popup";
                popup.style.position = "absolute";
                popup.style.padding = "5px";
                popup.style.backgroundColor = "#fff";
                popup.style.border = "1px solid #ccc";
                popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                popup.style.zIndex = "9999";
                popup.style.display = "flex";
                popup.style.alignItems = "center";
                
                const imageButton = document.createElement("img");
                imageButton.id = "imageButtonId"
                imageButton.src = "https://cdn.alexpgdev.com/2vdvp.png";
                imageButton.style.width = "24px";
                imageButton.style.height = "24px";
                imageButton.style.cursor = "pointer";
            
                popup.appendChild(imageButton);
                document.body.prepend(popup);
                return popup;
            }
            
            function positionPopup(popup, range) {
                const rect = range.getBoundingClientRect();
                const popupHeight = popup.offsetHeight;
            
                popup.style.top = `${rect.top + window.scrollY - popupHeight - 10}px`;
                popup.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (popup.offsetWidth / 2)}px`;

                if(popup.offsetLeft < 50){
                    popup.style.left = "0px"
                }
                if(popup.offsetTop < 50){
                    popup.style.top = "0px"
                }
            }
    
            function removePopup() {
                const popup = document.getElementById("selection-popup");
                if (popup) {
                    popup.remove();
                }
            }
            
            document.onmouseup = document.onkeyup = document.onselectionchange = function() {
                const selectedText = getSelectionText();
                if (selectedText.length > 0) {
                    const selection = window.getSelection();
                    const range = selection.getRangeAt(0);
            
                    let popup = document.getElementById("selection-popup");
                    if (!popup) {
                        popup = createPopup();
                    }
                    positionPopup(popup, range);
    
                    document.getElementById('selection-popup').addEventListener('click', function (e) {
                        document.getElementById('imageButtonId').src = ''
                        document.getElementById('imageButtonId').src = `https://barcodeapi.org/api/qr/${selection}`
                        document.getElementById('imageButtonId').style.width = "256px"
                        document.getElementById('imageButtonId').style.height = "256px"
                        positionPopup(popup, range);
                    })
                } else {
                    removePopup();
                }
            };
        }, 1000);


        // Create Associate tab (href: https://logistics.amazon.co.uk/station/dashboard/associatepick)
        let associateTab = document.createElement('div')
        associateTab.id = 'associateTabId'
        associateTab.innerHTML = `
            <style>
                .associatesClass {
                    display: inline-block !important;
                    outline: 0 !important;
                    -webkit-text-decoration: none !important;
                    text-decoration: none !important;
                    color: inherit !important;
                    cursor: default !important;
                    cursor: pointer !important;
                    outline: 0 !important;
                    display: block !important;
                    box-sizing: border-box !important;
                    width: 100% !important;
                    color: #232F3E !important;
                    -webkit-transition: background-color .1s ease !important;
                    transition: background-color .1s ease !important;
                    position: relative !important;
                    z-index: 0 !important;
                }

                .associatesClass:hover {
                    background-color: #f0f1f2;
                }
            </style>

            <a id="Associates" href="https://logistics.amazon.co.uk/station/dashboard/associatepick" target="_blank" class="associatesClass">
                <div class="css-1u8dqdz">
                    <div class="nav-active-component css-14g854"></div>
                    <div class="css-1w60e2v"></div>
                    <span class="css-1xwtkcd">Associates</span>
                </div>
            </a>
        `

        // Add Associate tab in navigation under Outbound
        if(document.getElementsByClassName('meridian-nav-tree-item css-hlmocs')[4]){
            document.getElementsByClassName('meridian-nav-tree-item css-hlmocs')[4].appendChild(associateTab)
        }

        setTimeout(() => {
            if(window.location.href === 'https://ui.pvsgb.last-mile.amazon.dev/?stationCode=DBW3&cycleId=AllCycles#/pickassociates'){
            let now = Date.now()
            let verionSwitch = true
            // Hide default table
            document.getElementsByClassName('css-1kxonj9')[0].style.display = 'none'

            function millisToMinutesAndSeconds(millis) {
                var seconds = ((millis % 60000) / 1000).toFixed(0);
                return seconds;
            }

            // Create new table
            let associateTableDiv = document.createElement('div')
            associateTableDiv.id = "associateTableDivId"
            associateTableDiv.innerHTML = `
                <html>
                    <link href="https://alexpgdev.com/heheStyles.css" rel="stylesheet">
                    <style>
                        .animated-box {
                            padding: 0px;
                            font-size: 20px;
                            position: relative;
                            overflow-y: scroll;
                        }

                        .animated-box::-webkit-scrollbar{
                            display: none;
                        }

                        .animated-box:after {
                            background-size: 300% 300%;
                            clip-path: polygon(0% 100%, 1px 100%, 1px 1px, calc(100% - 1px) 1px, calc(100% - 1px) calc(100% - 1px), 1px calc(100% - 1px), 1px 100%, 100% 100%, 100% 0%, 0% 0%);
                        }

                        .animated-box.in:after {
                            animation: gradient-animation 4s ease-in-out infinite;
                        }

                        .classTable {
                            width: 100%;
                            border: 0px;
                        }

                        .classTable th {
                            padding: 8px;
                            text-align: center;
                            border-top: 0px solid;
                            border-left: 0px solid;
                            border-bottom: 1px solid #ddd;
                            border-right: 1px solid #ddd;
                        }

                        .classTable thead {
                            background: white;
                            position: sticky;
                            top: 0;
                            z-index: 1;
                        }

                        .classTable td {
                            padding: 8px;
                            text-align: center;
                            border-top: 0px solid;
                            border-left: 0px solid;
                            border-bottom: 1px solid #ddd;
                            border-right: 1px solid #ddd;
                        }

                        .classTable th:last-child,
                        .classTable td:last-child {
                            border-right: 0px solid;
                        }

                        .classTable tr:last-child td {
                            border-bottom: 0px solid;
                        }

                        .switch {
                            position: relative;
                            display: inline-block;
                            width: 60px;
                            height: 34px;
                        }

                        .switch input {
                            opacity: 0;
                            width: 0;
                            height: 0;
                        }

                        .slider {
                            position: absolute;
                            cursor: pointer;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background-color: #ccc;
                            -webkit-transition: .4s;
                            transition: .4s;
                        }

                        .slider:before {
                            position: absolute;
                            content: "";
                            height: 26px;
                            width: 26px;
                            left: 4px;
                            bottom: 4px;
                            background-color: white;
                            -webkit-transition: .4s;
                            transition: .4s;
                        }

                        input:checked + .slider {
                            background-color: #2196F3;
                        }

                        input:focus + .slider {
                            box-shadow: 0 0 1px #2196F3;
                        }

                        input:checked + .slider:before {
                            -webkit-transform: translateX(26px);
                            -ms-transform: translateX(26px);
                            transform: translateX(26px);
                        }

                        /* Rounded sliders */
                        .slider.round {
                            border-radius: 34px;
                        }

                        .slider.round:before {
                            border-radius: 50%;
                        }
                        #exportCSVId:hover {
                            text-decoration: underline;
                        }
                    </style>

                    <body>
                        <div id="headersId">
                            <div id="switchId" style="margin-top:-2%">
                                <a style="margin-left:3%">alexanup's version</a>
                                <br>
                                <label class="switch" style="margin-left:3%">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                        <div class="animated-box in" style="margin-left: 3%; margin-top:15px" id="animated-boxId">
                            <table class="classTable" id="idTable">
                                <thead>
                                    <tr>
                                        <div style="margin-left: 70%; margin-bottom: 0%; z-index: 3; position: relative;">
                                            <label for="maxHeight">Max Height</label>
                                            <input type="checkbox" id="maxHeight" name="maxHeight"/>
                                        </div>
                                        <div style="margin-left: 70%; margin-bottom: 0%; z-index: 3; position: relative;">
                                            <a id="exportCSVId" style="cursor: pointer; color: blue;">Export as CSV</a>
                                        </div>
                                    <th>Associate</th>
                                    <th style="cursor: pointer;" id="sortA">Picklists <img src="https://i.imgur.com/IDQdAM9.png" id="sortAsrc" style="width: 15px;"></th>
                                    <th style="cursor: pointer;" id="sortB">Average <br> Picking Duration <img src="https://i.imgur.com/kFXEzQV.png" id="sortBsrc" style="width: 25px; top: 20px; position: absolute;"></th>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                    </body>
                </html>
            `

            // Append table in #root
            document.getElementById('root').appendChild(associateTableDiv)
            
            if(new Date().getMonth()+1 === 12){
                let christmasImg = document.createElement('img')
                christmasImg.src = "https://static.wixstatic.com/media/01f3b0_e593ccefe39344398985bfc3e0c00329~mv2.gif"
                christmasImg.style.position = "absolute"
                christmasImg.style.zIndex = "2"
                christmasImg.style.width = "693px"
                christmasImg.style.height = "138px"
                christmasImg.style.top = "-47px"
                christmasImg.style.left = "-26px"
                christmasImg.style.transform = "rotateY(180deg)"
    
                document.getElementById('animated-boxId').prepend(christmasImg)
            }

            let pagesDiv = document.createElement('div')
            pagesDiv.style.marginLeft = "225px"
            pagesDiv.style.fontSize = "25px"
            pagesDiv.id = "pagesDivId"
            pagesDiv.innerHTML = `
                <button id="previousPageButton" style="font-size: 30px;background: transparent; margin-left: 67px;">
                    ⬅️
                </button>
                <button id="todayPageButton" style="font-size: 30px;background: transparent;">
                    TODAY
                </button>
                <button id="nextPageButton" style="font-size: 30px;background: transparent;">
                    ➡️
                </button>
                <br>
                <span id="p&sDateId" style="font-size: 30px; font-weight: bold;">
                    Pick & Stage ${new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}
                </span>
            `

            document.getElementById('headersId').appendChild(pagesDiv)

            // Create button to update table
            let update = document.createElement('div')
            update.id = 'updateId'
            update.innerHTML = `
                <style>
                    .reload {
                        font-family: Lucida Sans Unicode
                    }
                </style>
                <button style="background:none; border:none; margin-left:3%; cursor:pointer; margin-top:7px; font-size: 15px;" class="reload" id="updateButtonId" title="Update now">&#x21bb; Updated ${millisToMinutesAndSeconds(Date.now()-now)} seconds ago</button>
            `

            // Append button in #associateTableDivId
            document.getElementById('root').appendChild(update)

            let csv_data = [];

            let customIcons = []
            fetch('https://alexpgdev.com/heheIcons.json', {
                cache: "no-cache"
            }).then(function(response) {
            return response.json();
            }).then(function(icons) {
                for (let i = 0; i < icons.icons.length; i++) {
                    customIcons[icons.icons[i].name] = icons.icons[i].icon.includes('alexpgdev.com') ? icons.icons[i].icon : `https://alexpgdev.com/${icons.icons[i].icon}`
                }
            })

            let previousAssociatesData = []

            function picklistCounter(option, date){
                now = Date.now()
                console.log(date)
                let dateFormated = `${new Date(parseInt(date)).getDate()}.${new Date(parseInt(date)).getMonth()+1}.${new Date(parseInt(date)).getFullYear()}`
                function url(){
                    console.log(dateFormated)
                    if(`${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}` === `${dateFormated}`){
                        return "https://logistics.amazon.co.uk/rsws/route/station/DBW3"
                    } else {
                        return `https://alexpgdev.com/P&S/PS_${dateFormated}.json`
                    }
                }

                // Fetch picklists
                fetch(`${url()}`, {
                    cache: "no-cache"
                }).then(function(response) {
                    if(`${response.headers.get("content-type")}`.includes("json")){
                        return response.json();
                    }
                }).then(function(picklists) {
                    if(!picklists || !picklists.routes[0]){
                        if(document.querySelectorAll('.rows')){
                            let rows = document.querySelectorAll('.rows')
                            rows.forEach(e => {
                                e.remove()
                            })
                        }

                        let newRow = document.createElement("tr")
                        newRow.className = 'rows'
                        newRow.innerHTML = `<td>No data available for the selected date</td>`
                        document.getElementById('idTable').appendChild(newRow)
                        return;
                    }

                    // Array to store picklist info
                    let picklistCount = []
                    let carts = []
                    // For each route
                    for(let i = 0; i < picklists.routes.length; i++){
                        // For each picklist
                        for(let a = 0; a < picklists.routes[i].carts.length; a++){
                            if(!carts.includes(picklists.routes[i].carts[a].cartId)){
                                carts.push(picklists.routes[i].carts[a].cartId)
                            }
                        }
                        for(let j = 0; j < picklists.routes[i].picklists.length; j++){
                            // For each associate
                            for(let k = 0; k < picklists.routes[i].picklists[j].associates.length; k++){
                                if(picklists.routes[i].picklists[j].associates[k].latest === true){
                                    // If associate found in picklistCount array
                                    if(picklistCount[picklists.routes[i].picklists[j].associates[k].alias]){
                                        // Add +1 depending on type of picklist
                                        if(picklists.routes[i].picklists[j].code.includes("#1")){
                                            picklistCount[picklists.routes[i].picklists[j].associates[k].alias].first += 1
                                        } else if(picklists.routes[i].picklists[j].code.includes("#2")){
                                            picklistCount[picklists.routes[i].picklists[j].associates[k].alias].second += 1
                                        } else if(picklists.routes[i].picklists[j].code.includes("#3")){
                                            picklistCount[picklists.routes[i].picklists[j].associates[k].alias].second += 1
                                        }
                                        if(picklists.routes[i].picklists[j].status === 'Picked'){
                                            picklistCount[picklists.routes[i].picklists[j].associates[k].alias].completed = picklistCount[picklists.routes[i].picklists[j].associates[k].alias].completed += 1
                                            picklistCount[picklists.routes[i].picklists[j].associates[k].alias].pickingDuration = picklistCount[picklists.routes[i].picklists[j].associates[k].alias].pickingDuration+picklists.routes[i].picklists[j].associates[k].pickingDuration
                                        }
                                        picklistCount[picklists.routes[i].picklists[j].associates[k].alias].count += 1 // Count of picklists
                                        picklistCount[picklists.routes[i].picklists[j].associates[k].alias].ovCount = picklistCount[picklists.routes[i].picklists[j].associates[k].alias].ovCount+picklists.routes[i].picklists[j].itemsCount.ovCount // Count of oversize packages
                                        picklistCount[picklists.routes[i].picklists[j].associates[k].alias].bagCount = picklistCount[picklists.routes[i].picklists[j].associates[k].alias].bagCount+picklists.routes[i].picklists[j].itemsCount.bagCount // Count of bags
                                        // If associate is not found in picklistCount array
                                    } else {
                                        function addAssociate(){
                                            if(picklists.routes[i].picklists[j].code.includes("#1")){
                                                if(picklists.routes[i].picklists[j].status === 'Picked'){
                                                    return {count: 1, first: 1, second: 0, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 1, pickingDuration: picklists.routes[i].picklists[j].associates[k].pickingDuration}
                                                } else {
                                                    return {count: 1, first: 1, second: 0, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 0, pickingDuration: 0}
                                                }
                                            } else if(picklists.routes[i].picklists[j].code.includes("#2")){
                                                if(picklists.routes[i].picklists[j].status === 'Picked'){
                                                    return {count: 1, first: 0, second: 1, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 1, pickingDuration: picklists.routes[i].picklists[j].associates[k].pickingDuration}
                                                } else {
                                                    return {count: 1, first: 0, second: 1, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 0, pickingDuration: 0}
                                                }
                                            } else if(picklists.routes[i].picklists[j].code.includes("#3")){
                                                if(picklists.routes[i].picklists[j].status === 'Picked'){
                                                    return {count: 1, first: 0, second: 1, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 1, pickingDuration: picklists.routes[i].picklists[j].associates[k].pickingDuration}
                                                } else {
                                                    return {count: 1, first: 0, second: 1, ovCount: picklists.routes[i].picklists[j].itemsCount.ovCount, bagCount: picklists.routes[i].picklists[j].itemsCount.bagCount, completed: 0, pickingDuration: 0}
                                                }
                                            }
                                        }
                                        // Add associate in picklistCount array along with default information
                                        picklistCount[picklists.routes[i].picklists[j].associates[k].alias] = addAssociate()
                                    }
                                }
                            }
                        }
                    }

                    console.log("CAAAAAAARTS")
                    console.log(carts)
                    console.log(carts.length)

                    let sortingArray
                    sortingArray = Object.keys(picklistCount).map(key => {
                        let newObj = {};
                        newObj[key] = picklistCount[key];
                        return newObj;
                    });

                    if(!option || option === 0){
                        sortingArray.sort((a, b) => {
                            const countA = Object.values(a)[0].count;
                            const countB = Object.values(b)[0].count;
                            return countB - countA;
                        });
                    } else if(option === 2){
                        sortingArray.sort((a, b) => {
                            const countA = Object.values(a)[0].count;
                            const countB = Object.values(b)[0].count;
                            return countA - countB;
                        });
                    } else if(option === 1){
                        sortingArray.sort((b, a) => {
                            const countA = Object.values(a)[0].pickingDuration/Object.values(a)[0].completed;
                            const countB = Object.values(b)[0].pickingDuration/Object.values(b)[0].completed;
                            return countB - countA;
                        });
                    } else if(option === 11){
                        sortingArray.sort((b, a) => {
                            const countA = Object.values(a)[0].pickingDuration/Object.values(a)[0].completed;
                            const countB = Object.values(b)[0].pickingDuration/Object.values(b)[0].completed;
                            return countA - countB;
                        });
                    }

                      if(`${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}` === `${dateFormated}`){
                          const fileName = `PS_${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}.json`
                          window.top.postMessage({
                            action: 'getStation'
                          }, `*`)

                          window.addEventListener('message', (event) => {
                            console.log(event.data.value)
                            if(event.data.action === 'station'){
                                fetch('https://alexpgdev.com/uploadPSData.php', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({station: event.data.value, fileName: fileName, data: picklists}),
                                    mode: 'no-cors'
                                }).then(function (response) {
                                  console.log(response)
                                  console.log(response.text())
                                })
                            }
                          })

                          for(let i = 0; i < sortingArray.length; i++) {
                              // Extract associate name and data
                              let associateName = Object.keys(sortingArray[i])[0];
                              let associateData = sortingArray[i][associateName];

                              // Prepare data to send
                              let jsonData = {
                                  date: `${new Date().getDate()}.${new Date().getMonth()+1}.${new Date().getFullYear()}`,
                                  data: {
                                      count: associateData.count,
                                      averageDuration: associateData.pickingDuration / associateData.completed || 0 // Avoid division by zero
                                  }
                              };

                              // Make POST request to the PHP file
                                  fetch(`https://alexpgdev.com/addAssociates.php`, {
                                      method: "POST",
                                      headers: {
                                          "Content-Type": "application/json"
                                      },
                                      body: JSON.stringify({station: localStorage.getItem("heheStation"), filename: associateName, content: jsonData }),
                                      mode: 'no-cors'
                                  }).then(response => {
                                      if (response.ok) {
                                          console.log(`Successfully updated data for ${associateName}`);
                                      } else {
                                          console.error(`Failed to update data for ${associateName}`);
                                      }
                                  }).catch(error => {
                                      console.error(`Error updating data for ${associateName}:`, error);
                                  });
                          }
                      }

                    document.getElementById('maxHeight').addEventListener('click', function(e){
                        if(e.target.checked){
                            document.querySelector('.animated-box').style.maxHeight = '50000px'
                        } else {
                            document.querySelector('.animated-box').style.maxHeight = `630px`
                        }
                    })

                      // Remove all rows if any row exists (for updating table)
                    if(document.querySelectorAll('.rows')){
                        let rows = document.querySelectorAll('.rows')
                        rows.forEach(e => {
                            e.remove()
                        })
                    }

                    csv_data.push('Associate,Picklists,Average Picking Duration,#1,#2,Bags,OVs')

                      // For each associate in picklistCount array
                    for(let i = 0; i < sortingArray.length; i++){
                        let name = `${Object.keys(sortingArray[i])}`.replace("@", "")
                        function icon() {
                            if(customIcons[name]){
                                return customIcons[name]
                            } else {
                                return `https://internal-cdn.amazon.com/badgephotos.amazon.com/?login=${name}`
                            }
                        }

                        function millisToMinutesAndSeconds(millis) {
                            var minutes = Math.floor(millis / 60000);
                            var seconds = ((millis % 60000) / 1000).toFixed(0);
                            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
                        }

                        // Create row for each associate and information
                        let newRow = document.createElement("tr")
                        newRow.className = 'rows'
                        newRow.innerHTML =
                        `
                            <style>
                                .hoverable${i} {
                                    position: relative;
                                }
                                .hoverable${i}::after {
                                    content: "Bags: ${sortingArray[i][Object.keys(sortingArray[i])].bagCount} | OVs: ${sortingArray[i][Object.keys(sortingArray[i])].ovCount}";
                                    left: auto;
                                    bottom: auto;
                                    background-color: #333;
                                    color: #fff;
                                    padding: 5px;
                                    border-radius: 5px;
                                    opacity: 0;
                                    transition: opacity 0.3s;
                                    white-space: nowrap;
                                    pointer-events: none;
                                    transform: translateY(-10px);
                                    z-index: 1;
                                }
                                .hoverable${i}:hover::after {
                                    opacity: 1;
                                    transform: translateY(0);
                                }
                            </style>

                            <td id="firstColumn_${i}">
                                <img src="${icon()}" loading="lazy" style="width: 75px; max-width: 75px; max-height: 100px;" class="minibadge" title="${name}">
                                <br>
                                <a href="https://fclm-portal.amazon.com/employee/ppaTimeDetails?employeeId=${name}&warehouseId=DBW3" target="_blank">
                                    ${name}
                                </a>
                            </td>
                            <td class="hoverable${i}">
                                <span id="countId${i}">
                                    ${sortingArray[i][Object.keys(sortingArray[i])].count}
                                </span>
                                <table style="border:0px; color:#808080; margin:auto; font-size:15px; width:25%; line-height: 50%;" class="classTable2" id="idTable2">
                                    <tr style="border:0px">
                                        <th style="border:0px">#1</th>
                                        <th style="border:0px">#2</th>
                                    </tr>
                                    <td style="border:0px">
                                        ${sortingArray[i][Object.keys(sortingArray[i])].first}
                                    </td>
                                    <td style="border:0px">
                                        ${sortingArray[i][Object.keys(sortingArray[i])].second}
                                    </td>
                                </table>
                            </td>
                            <td>
                                <span id="timeId${i}">
                                    ${millisToMinutesAndSeconds(sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed)}
                                </span>
                            </td>
                        `

                        // Append row in #idTable
                        document.getElementById('idTable').appendChild(newRow)
                        
                        if(new Date().getMonth()+1 === 12){
                            let christmasHats = document.createElement('img')
                            christmasHats.src = 'https://www.freeiconspng.com/thumbs/christmas-hat-png/christmas-hat-png-15.png'
                            christmasHats.style.width = '70px'
                            christmasHats.style.position = 'absolute'
                            christmasHats.style.left = '53px'
                            christmasHats.style.marginTop = '-6px'
                            document.getElementById(`firstColumn_${i}`).prepend(christmasHats)
                        }

                        csv_data.push(`\n${name},${sortingArray[i][Object.keys(sortingArray[i])].count},${millisToMinutesAndSeconds(sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed)},${sortingArray[i][Object.keys(sortingArray[i])].first},${sortingArray[i][Object.keys(sortingArray[i])].second},${sortingArray[i][Object.keys(sortingArray[i])].bagCount},${sortingArray[i][Object.keys(sortingArray[i])].ovCount}`)

                        if(!previousAssociatesData[name]){
                            fetch(`https://alexpgdev.com/P&S/associates/${name}.json`, {
                                cache: "no-cache"
                            }).then(function(response) {
                                if(response) return response.json();
                            }).then(function(data) {
                                previousAssociatesData[name] = data
                                getPreviousAssociatesData()
                            })
                        } else {
                            getPreviousAssociatesData()
                        }
                        
                        function getPreviousAssociatesData(){
                            let yesterdayDataCount = 0
                            let yesterdayDataAverageDuration = 0
                            let dataFound = false
                            for(let minusDay = 86400000; dataFound === false; minusDay+=86400000){
                                let yesterdayDateFormated = `${new Date(parseInt(date)-minusDay).getDate()}.${new Date(parseInt(date)-minusDay).getMonth()+1}.${new Date(parseInt(date)-minusDay).getFullYear()}`
                                if(previousAssociatesData[name][yesterdayDateFormated] && previousAssociatesData[name][yesterdayDateFormated].count || minusDay > 86400000*30){
                                    dataFound = true
                                    if(previousAssociatesData[name][yesterdayDateFormated]){
                                        yesterdayDataCount = previousAssociatesData[name][yesterdayDateFormated].count
                                        yesterdayDataAverageDuration = previousAssociatesData[name][yesterdayDateFormated].averageDuration
                                    } else {
                                        yesterdayDataCount = sortingArray[i][Object.keys(sortingArray[i])].count
                                        yesterdayDataAverageDuration = sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed
                                    }
                                }
                            }

                            function comparationPicklists(){
                                if(yesterdayDataCount > sortingArray[i][Object.keys(sortingArray[i])].count){
                                    return ["⬇", yesterdayDataCount-sortingArray[i][Object.keys(sortingArray[i])].count, "RED"]
                                } else if(yesterdayDataCount < sortingArray[i][Object.keys(sortingArray[i])].count){
                                    return ["⬆", sortingArray[i][Object.keys(sortingArray[i])].count-yesterdayDataCount, "GREEN"]
                                } else {
                                    return ["", " -", ""]
                                }
                            }

                            let diffDiv = document.createElement('span')
                            diffDiv.innerHTML = `${comparationPicklists()[0]}<a style="font-size: 20px;">${comparationPicklists()[1]}</a>`
                            diffDiv.style.color = comparationPicklists()[2]
                            diffDiv.style.fontSize = "25px"
                            diffDiv.style.position = "absolute"
                            diffDiv.style.marginLeft = "10px"
                            document.getElementById(`countId${i}`).append(diffDiv)

                            function comparationAverageDuration(){
                                let today = sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed
                                if(yesterdayDataAverageDuration > sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed){
                                    let timeDiff = yesterdayDataAverageDuration - today
                                    let percentageFaster = (timeDiff/today)*100
                                    return ["⬆", percentageFaster.toFixed(2), "Faster", "GREEN"]
                                } else if(yesterdayDataAverageDuration < sortingArray[i][Object.keys(sortingArray[i])].pickingDuration/sortingArray[i][Object.keys(sortingArray[i])].completed){
                                    let timeDiff = today - yesterdayDataAverageDuration
                                    let percentageFaster = (timeDiff/today)*100
                                    return ["⬇", percentageFaster.toFixed(2), "Slower", "RED"]
                                } else {
                                    return ["", "", " -", ""]
                                }
                            }

                            let timeDiffDiv = document.createElement('span')
                            timeDiffDiv.innerHTML = `${comparationAverageDuration()[0]}<a style="font-size: 20px;">${comparationAverageDuration()[1]}%</a><br><a style="font-size: 15px; margin-top: -5px; margin-left: -17px; position: absolute;">${comparationAverageDuration()[2]}</a>`
                            timeDiffDiv.style.color = comparationAverageDuration()[3]
                            timeDiffDiv.style.fontSize = "25px"
                            timeDiffDiv.style.position = "absolute"
                            timeDiffDiv.style.marginLeft = "10px"
                            document.getElementById(`timeId${i}`).append(timeDiffDiv)

                        }
                    }

                    // If update button exists, update innerHTML
                    if(document.getElementById('updateId')){
                        document.getElementById('updateId').innerHTML = `
                            <style>
                                .reload {
                                    font-family: Lucida Sans Unicode
                                }
                            </style>

                            <button style="background:none; border:none; margin-left:3%; cursor:pointer; margin-top:7px; font-size: 15px;" class="reload" title="Update now">
                                &#x21bb; Updated ${millisToMinutesAndSeconds(Date.now()-now)} seconds ago
                            </button>
                        `
                    } else {
                        let update = document.createElement('div')
                        update.id = 'updateId'
                        update.innerHTML = `
                            <style>
                                .reload {
                                    font-family: Lucida Sans Unicode
                                }
                            </style>
                            <button style="background:none; border:none; margin-left:3%; cursor:pointer; margin-top:7px; font-size: 15px;" class="reload" title="Update now">&#x21bb; Updated ${millisToMinutesAndSeconds(Date.now()-now)} seconds ago</button>
                        `

                          // Append button in #associateTableDivId
                        document.getElementById('associateTableDivId').appendChild(update)
                    }
                });
            }

            document.getElementById('exportCSVId').addEventListener('click', function (e) {
                downloadCSVFile(csv_data)
            })

            function downloadCSVFile(csv_data) {

                // Create CSV file object and feed
                // our csv_data into it
                let CSVFile = new Blob([csv_data], {
                    type: "text/csv"
                });

                // Create to temporary link to initiate
                // download process
                let temp_link = document.createElement('a');

                // Download csv file
                temp_link.download = `P&S_Associates_${new Date(displayDate).getDate()}${new Date(displayDate).getMonth()+1}${new Date(displayDate).getFullYear()}.csv`;
                let url = window.URL.createObjectURL(CSVFile);
                temp_link.href = url;

                // This link should not be displayed
                temp_link.style.display = "none";
                document.body.appendChild(temp_link);

                // Automatically click the link to
                // trigger download
                temp_link.click();
                document.body.removeChild(temp_link);
            }

            let sorting = 0

            let displayDate = new Date()
            let yesterdayDate = new Date(displayDate.getTime()-86400000)
            let tomorrowDate = new Date(displayDate.getTime()+86400000)
            let todayDate = new Date()

            var previousPageButton = document.getElementById("previousPageButton");
            previousPageButton.addEventListener("click", function(e) {
                displayDate = yesterdayDate
                yesterdayDate = new Date(displayDate.getTime()-86400000)
                tomorrowDate = new Date(displayDate.getTime()+86400000)

                picklistCounter(sorting, `${displayDate.getTime()}`)
                document.getElementById('p&sDateId').textContent = `Pick & Stage ${displayDate.getDate()}.${displayDate.getMonth()+1}.${displayDate.getFullYear()}`
            });

            var todayPageButton = document.getElementById("todayPageButton");
            todayPageButton.addEventListener("click", function(e) {
                displayDate = todayDate
                yesterdayDate = new Date(displayDate.getTime()-86400000)
                tomorrowDate = new Date(displayDate.getTime()+86400000)

                picklistCounter(sorting, `${displayDate.getTime()}`)

                document.getElementById('p&sDateId').textContent = `Pick & Stage ${displayDate.getDate()}.${displayDate.getMonth()+1}.${displayDate.getFullYear()}`
            });

            var nextPageButton = document.getElementById("nextPageButton");
            nextPageButton.addEventListener("click", function(e) {
                displayDate = tomorrowDate
                yesterdayDate = new Date(displayDate.getTime()-86400000)
                tomorrowDate = new Date(displayDate.getTime()+86400000)

                picklistCounter(sorting, `${displayDate.getTime()}`)
                document.getElementById('p&sDateId').textContent = `Pick & Stage ${displayDate.getDate()}.${displayDate.getMonth()+1}.${displayDate.getFullYear()}`
            });

            picklistCounter(sorting, `${displayDate.getTime()}`)

            // Interval to update table after 29 seconds
            let interval = function() {

                if(millisToMinutesAndSeconds(Date.now()-now) > 29){
                    picklistCounter(sorting, `${displayDate.getTime()}`)
                }

                document.getElementById('updateId').innerHTML = `
                        <style>
                        .reload {
                            font-family: Lucida Sans Unicode
                        }
                        </style>
                    <button style="background:none; border:none; margin-left:3%; cursor:pointer; margin-top:7px; font-size: 15px;" class="reload" title="Update now">
                        &#x21bb; Updated ${millisToMinutesAndSeconds(Date.now()-now)} seconds ago
                    </button>
                `
            }

            // Checks if updating table is required each 5 seconds
            let updateInterval = setInterval(interval, 5000)

            // Update table when button is clicked
            var updateButton = document.getElementById("updateId");
            updateButton.addEventListener("click", function(e) {
                picklistCounter(sorting, `${displayDate.getTime()}`)
                clearInterval(updateInterval)
                updateInterval = setInterval(interval, 5000)
            });

            let checkSortButton = setInterval(() => {
                if(document.getElementById('sortA') && document.getElementById('sortB')){
                    clearInterval(checkSortButton)
                    var sortAButton = document.getElementById("sortA");
                    var sortAsrc = document.getElementById("sortAsrc");

                    var sortBButton = document.getElementById("sortB");
                    var sortBsrc = document.getElementById("sortBsrc");

                    sortAButton.addEventListener("click", function(e) {
                        console.log(sorting)
                        if(sorting === 0){
                            sorting = 2
                            picklistCounter(2, `${displayDate.getTime()}`)
                            sortAsrc.src = 'https://i.imgur.com/VpaQMRe.png'
                            sortAsrc.style.width = '15px'
                            sortBsrc.src = 'https://i.imgur.com/kFXEzQV.png'
                            sortBsrc.style.width = '25px'
                        } else if(sorting === 2 || sorting !== 0 && sorting !== 2){
                            sorting = 0
                            picklistCounter(0, `${displayDate.getTime()}`)
                            sortAsrc.src = "https://i.imgur.com/IDQdAM9.png"
                            sortAsrc.style.width = '15px'
                            sortBsrc.src = 'https://i.imgur.com/kFXEzQV.png'
                            sortBsrc.style.width = '25px'
                        }
                    });
                    sortBButton.addEventListener("click", function(e) {
                        if(sorting === 1){
                            sorting = 11
                            picklistCounter(11, `${displayDate.getTime()}`)
                            sortBsrc.src = 'https://i.imgur.com/IDQdAM9.png'
                            sortBsrc.style.width = '15px'
                            sortAsrc.src = 'https://i.imgur.com/kFXEzQV.png'
                            sortAsrc.style.width = '25px'
                            //document.getElementById('sortId').innerHTML = `<button class="sort" title="Sort" style="margin-left: 3%;">Sort by most picklists</button>`
                        } else if(sorting === 11 || sorting !== 1 && sorting !== 11){
                            sorting = 1
                            picklistCounter(1, `${displayDate.getTime()}`)
                            sortBsrc.src = "https://i.imgur.com/VpaQMRe.png"
                            sortBsrc.style.width = '15px'
                            sortAsrc.src = 'https://i.imgur.com/kFXEzQV.png'
                            sortAsrc.style.width = '25px'
                        }
                    });
                }
            }, 1)

            // Switch between table versions
            var slider = document.getElementById("switchId");
            slider.addEventListener("change", function(e) {
                if(verionSwitch === true){
                    verionSwitch = false
                    document.getElementById('idTable').style.display = 'none'
                    document.getElementById('updateId').style.display = 'none'
                    document.getElementById('animated-boxId').style.display = 'none'
                    document.getElementsByClassName('css-1kxonj9')[0].style.display = ''
                    document.getElementById("switchId").style = "margin-top: 0px; margin-left: -2%"
                    document.getElementsByClassName('css-1kxonj9')[0].prepend(slider)
                } else if(verionSwitch === false){
                    verionSwitch = true
                    document.getElementsByClassName('css-1kxonj9')[0].style.display = 'none'
                    document.getElementById('idTable').style.display = ''
                    document.getElementById('updateId').style.display = ''
                    document.getElementById('animated-boxId').style.display = ''
                    document.getElementById("switchId").style.display = ''
                    document.getElementById("switchId").style = "margin-top: -2%"
                    document.getElementById('associateTableDivId').prepend(slider)
                }
            });
            }
        fetch('https://alexpgdev.com/heheStyles.json', {cache: "no-cache"}).then(function(response) {
            return response.json();
        }).then(function(styles) {
            if (document.querySelector('.animated-box')) document.querySelector('.animated-box').style.width = `${styles.width}`
            if (document.querySelector('.animated-box')) document.querySelector('.animated-box').style.maxHeight = `${styles.height}`
            if (document.querySelector('.animated-box')) document.querySelector('.animated-box').style.borderRadius = `${styles.borderRadius}`
            if (document.querySelector('.animated-box')) document.querySelector('.animated-box').style.animationDuration = `${styles.animationSpeed}`
            document.documentElement.style.setProperty('--first-color', styles.firstColor)
            document.documentElement.style.setProperty('--second-color', styles.secondColor)
            document.documentElement.style.setProperty('--blur-radius', `${styles.blurRadius}`)
            document.documentElement.style.setProperty('--spread-radius', `${styles.spreadRadius}`)

                var rootStyles = getComputedStyle(document.documentElement);
                var firstColor = rootStyles.getPropertyValue('--first-color').trim();
                var secondColor = rootStyles.getPropertyValue('--second-color').trim();
                var blurRadius = rootStyles.getPropertyValue('--blur-radius').trim();
                var spreadRadius = rootStyles.getPropertyValue('--spread-radius').trim();
                var animSpeed = rootStyles.getPropertyValue('--anim-speed').trim();
                // Remove existing keyframe styles
                var existingStyleBlockOne = document.getElementById('dynamic-keyframes');
                var existingStyleBlockTwo = document.getElementById('dynamic-keyframes-two');
                if (existingStyleBlockOne) existingStyleBlockOne.parentNode.removeChild(existingStyleBlockOne);
                if (existingStyleBlockTwo) existingStyleBlockTwo.parentNode.removeChild(existingStyleBlockTwo);

                // Create new style blocks for both animations
                var styleBlockOne = document.createElement('style');
                styleBlockOne.id = 'dynamic-keyframes';
                styleBlockOne.innerHTML = `
                    @keyframes gradient-animation {
                        0% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor};
                        }
                        50% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor};
                        }
                        100% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor};
                        }
                    }
                `;

                var styleBlockTwo = document.createElement('style');
                styleBlockTwo.id = 'dynamic-keyframes-two';
                styleBlockTwo.innerHTML = `
                    @keyframes gradient-animation-two {
                        0% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor};
                        }
                        50% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor};
                        }
                        100% {
                            box-shadow: 0 0 ${blurRadius} ${spreadRadius} ${secondColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${firstColor},
                                        0 0 ${blurRadius} ${spreadRadius} ${secondColor};
                        }
                    }
                `;

                // Append the new style blocks to the document
                document.head.appendChild(styleBlockOne);
                document.head.appendChild(styleBlockTwo);

                // Force reflow to restart animation
                var animatedBox = document.querySelector('.animated-box');
                animatedBox.style.animation = 'none';
                animatedBox.offsetHeight; // Trigger a reflow, flushing the CSS changes
                animatedBox.style.animation = `gradient-animation ${animSpeed} ease-in-out infinite`;
        })
        }, 2000)

        if (window.location.href.indexOf("?hehe") > -1) {
            $('#main_row').remove()
            $('#boson-meridian-side-nav').parent().remove()
            $('.fp-navigation-container').remove()
            $('#boson-meridian-side-nav').addClass('boson-meridian-display-none')
            $('div[mrdn-masthead-actions] > *').remove();
            $('#qrdiv').remove()
            $('#myAtStationPopupDiv').remove()
            $('#myPopupDiv').remove()

            let unopenedBagsDiv = document.createElement('div')
            unopenedBagsDiv.id = "unopenedBagsDivId"
            unopenedBagsDiv.innerHTML = `
            <style>
                #unopenedBagsDivId {
                    width: fit-content;
                    /*position: absolute;*/
                    text-align: center;
                    margin-left: 20%;
                    align-items: center;
                    border: 1px solid red;
                    margin-top: -35%;
                }

                #unopenedBagsDivId table tr {
                    border-top: 1px solid red;
                    border-bottom: 1px solid red;
                }

                #unopenedBagsDivId table td {
                    border-right: 1px solid red;
                    padding-left: 150px;
                    padding-right: 150px;
                }
            </style>

            <b>Unopened bags</b><br><p style="color:#706e6e;">Bags that have not been married</p><br><table id="unopenedBagsTable">
                <tbody>
                <tr>
                    <td>Aisle</td>
                    <td>Missing</td>
                    <td>Zone</td>
                </tr>`

            document.body.append(unopenedBagsDiv)
            
                fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                    "credentials": "include",
                    "headers": {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                        "Accept": "*/*",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "cors",
                        "Sec-Fetch-Site": "same-origin"
                    },
                    "referrer": "https://logistics.amazon.co.uk/station/dashboard/stowv2",
                    "body": "{\"resourcePath\":\"svs/bins/metrics\",\"httpMethod\":\"post\",\"processName\":\"stow\",\"requestBody\":{\"groupBy\":\"AISLE\",\"filters\":{\"NODE\":[\"DBW3\"],\"CLUSTER\":[\"A\"],\"CYCLE\":[\"CYCLE_1\"],\"CYCLE_ID\":[\"761553f5-9fc1-4cef-8815-b974bc63f0a9\"]},\"metrics\":[\"BINS_COUNT_MISSING_OPEN_BAG\"]}}",
                    "method": "POST",
                    "mode": "cors"
                }).then(function (response) {
                    return response.json();
                }).then(function (bags) {

                    console.log(bags)

                    let wip = []
                    let unfinishedAisles = []
                    for(let i = 0; i < Object.keys(bags.groupedBinMetrics).length; i++){
                        if(bags.groupedBinMetrics[Object.keys(bags.groupedBinMetrics)[i]].binsCountMissingOpenBag > 0){
                            //console.log(Object.keys(bags.groupedBinMetrics)[i])
                            unfinishedAisles.push(Object.keys(bags.groupedBinMetrics)[i])
                            wip[Object.keys(bags.groupedBinMetrics)[i]] = {aisle: Object.keys(bags.groupedBinMetrics)[i], zone: []}
                        }
                    }

                    console.log(unfinishedAisles)
                    
                    console.log("WIP")

                    unfinishedAisles.sort((a, b) => {
                        return parseInt(a.slice(1)) - parseInt(b.slice(1));
                    })


                    console.log(unfinishedAisles)


                    let unopenedBins = []
                    for(let i = 0; i < unfinishedAisles.length; i++){
                        fetch("https://logistics.amazon.co.uk/station/proxyapigateway/data", {
                            "credentials": "include",
                            "headers": {
                                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:128.0) Gecko/20100101 Firefox/128.0",
                                "Accept": "*/*",
                                "Accept-Language": "en-US,en;q=0.5",
                                "Content-Type": "application/json",
                                "X-Requested-With": "XMLHttpRequest",
                                "Sec-Fetch-Dest": "empty",
                                "Sec-Fetch-Mode": "cors",
                                "Sec-Fetch-Site": "same-origin"
                            },
                            "referrer": "https://logistics.amazon.co.uk/station/dashboard/stowv2",
                            "body": `{\"resourcePath\":\"svs/bags/metrics\",\"httpMethod\":\"post\",\"processName\":\"stow\",\"requestBody\":{\"groupBy\":\"BIN\",\"filters\":{\"NODE\":[\"DBW3\"],\"AISLE\":[\"${unfinishedAisles[i]}\"],\"CYCLE\":[\"CYCLE_1\"],\"CYCLE_ID\":[\"761553f5-9fc1-4cef-8815-b974bc63f0a9\"]},\"metrics\":[\"CLOSED_BAG_COUNT\",\"OPEN_BAG_COUNT\",\"PLANNED_BAG_COUNT\"]}}`,
                            "method": "POST",
                            "mode": "cors"
                        }).then(function (response) {
                            return response.json();
                        }).then(function (bins) {

                            // console.log(bins.groupedBagMetrics)
                            // console.log(Object.keys(bins.groupedBagMetrics))
                            // console.log(bins.groupedBagMetrics[Object.keys(bins.grou)])

                            console.log(bins)
                            console.log(Object.keys(bins.groupedBagMetrics))
                            console.log(Object.keys(bins.groupedBagMetrics).length)


                            let zones = []
                            for (let j = 0; j < Object.keys(bins.groupedBagMetrics).length; j++){
                                console.log("ASDADSADSADADas")
                                console.log(bins.groupedBagMetrics[Object.keys(bins.groupedBagMetrics)[j]].openBagCount)
                                if(bins.groupedBagMetrics[Object.keys(bins.groupedBagMetrics)[j]].openBagCount > 0){
                                    zones.push(Object.keys(bins.groupedBagMetrics)[j])
                                    wip[Object.keys(bins.groupedBagMetrics)[j]].zone = bins[j].groupedBagMetrics
                                    console.log("ZONENENENENENEENNENE")
                                    console.log(bins)
                                }
                            }

                            console.log(wip)

                                let newUnopenedBagRow = document.createElement("tr")
                                newUnopenedBagRow.className = 'unopenedBagRow'
                                newUnopenedBagRow.innerHTML =
                                `
                                    <tr>
                                        <td>${unfinishedAisles[i]}</td>
                                        <td>test2</td>
                                        <td>test3</td>
                                    </tr>
                                 `
                                // Append row in #atRiskTable
                                document.getElementById('unopenedBagsTable').appendChild(newUnopenedBagRow)                
                        })
                    }

                })
        }

    })();