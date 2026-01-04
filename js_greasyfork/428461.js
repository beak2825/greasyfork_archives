// ==UserScript==
// @name         MH - Rank-up Forecaster (v2.0)
// @version      1.0.14
// @description  Records wisdom data over time and predict rank-ups!
// @author       Chromatical
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @require      https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.3.2/chart.min.js
// @require      https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@next/dist/chartjs-adapter-date-fns.bundle.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428461/MH%20-%20Rank-up%20Forecaster%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428461/MH%20-%20Rank-up%20Forecaster%20%28v20%29.meta.js
// ==/UserScript==
var debug = localStorage.getItem("Chro.debug") == 1? true : false;

//Data--------------------------
const title = ['Novice','Recruit','Apprentice','Initiate','Journeyman','Master','Grandmaster','Legendary','Hero','Knight','Lord','Baron','Count','Duke','Grand Duke','Archduke','Viceroy','Elder','Sage','Fabled'];
const wisdomRequired = [0,2000,5000,12500,31250,65440,137813,303188,667013,1467428,3228341,7102349,15625168,34375370,75625813,166376789,366028936,805263659,1771580048,3897476106];
const currentTitle = genderNeutral(user.title_name);
const currentPercent = user.title_percent_accurate;
const nextTitle = title[title.indexOf(currentTitle)+1];
//Data end-----------------------
(function(){
    addEventListener();
    /*global chart*/

   GM_addStyle(`
    .forecaster-chart-wrapper {
      position: fixed;
      left: 36vw;
      top: 48vh;
      background: rgba(255, 255, 255, 1);
      border: thin solid grey;
      z-index: 9999
    }
  `);
})()

function genderNeutral(name){
    var rankNeutral = name;
    name.includes("Journey") ? rankNeutral = "Journeyman/Journeywoman" : null;
    (name.includes("Lord") || name.includes("Lady"))? rankNeutral = "Lord/Lady" : null;
    name.includes("Du")? rankNeutral = "Duke/Duchess" : null;
    name.includes("Grand Du")? rankNeutral = "Grand Duke/Grand Duchess" : null;
    name.includes("Arch")? rankNeutral = "Archduke/Archduchess" : null;
    return rankNeutral
}

$(document).ajaxComplete(async(event,xhr,options) => {
    if(options.url == "https://www.mousehuntgame.com/managers/ajax/users/userInventory.php" ||
      options.url =="https://www.agiletravels.com/uuid.php"||
      options.url == "https://www.agiletravels.com/intake.php" ||
      options.url == "https://www.mousehuntgame.com/managers/ajax/users/getmiceeffectiveness.php"
      ){
         if (debug) console.log("WF - URL useless, ignored")
    } else if (options.url == "https://www.mousehuntgame.com/managers/ajax/users/changeenvironment.php"){
        const promise1 = await wisdomCheck("bypass")
        .then(
            res =>{
                if (debug) console.log("Travel so all bypassed and recorded!")
            })
    } else {
        var storageTime = localStorage.getItem("Chro-forecaster-time");
        const promise = await wisdomCheck()
        .then(
            res =>{
                if (debug) console.log("WF-Check passed! Recording Now")
            },
            err =>{
                if (debug) console.log("WF-Not time yet!")
            })
        }
});

$(document).ready(function(){
    wisdomCheck()
    var storageTime = localStorage.getItem("Chro-forecaster-time")
    if (storageTime){
        if (JSON.parse(storageTime).length == 0){
            localStorage.removeItem("Chro-forecaster-time")
        }
    }
})

function wisdomCheck(status){
    return new Promise(async(resolve,reject) =>{
        var storageTime = localStorage.getItem("Chro-forecaster-time")
        if (storageTime === null){
            var storageTimeParsed = [];
            var last = 0;
            var lastGetTime = 0;
            var currentTime = new Date()
        } else {
            storageTimeParsed = JSON.parse(storageTime)
            last = storageTimeParsed.length -1;
            lastGetTime = storageTimeParsed[last][0]
            currentTime = new Date()
        }
        if (storageTimeParsed.length <4){
            var interval = 3600000
            } else if (storageTimeParsed.length <8){
                interval = 43200000
            } else if (storageTimeParsed.length <12){
                interval = 86400000
            } else {
                interval = 172800000
            }
        if (debug) interval = 120000;
        var previousTimeISO = (new Date(lastGetTime)).getTime()
        var currentTimeISO = currentTime.getTime()
        if (debug) console.log("WF - Interval Differene is " + (currentTimeISO - previousTimeISO))
        if (currentTimeISO - previousTimeISO >= interval || status == "bypass"){
            if (debug && status != "bypass") console.log ("WF - Bigger Interval");
            if (status == "bypass") console.log ("Time check bypassed")
            const promise = await getWisdom()
            .then(
                async res=>{
                    var wisdom = res;
                    //if (status != "bypass"){
                        var oldArray = storageTimeParsed;
                       oldArray.push([currentTime,wisdom]);
                      //  while (oldArray.length > 14){
                        //    oldArray.shift()
                       // }
                        localStorage.setItem("Chro-forecaster-time",JSON.stringify(oldArray));
                    //}
                    const promise2 = await getTotalCalls()
                    .then(
                        res=>{
                            var calls = res;
                            var callArray = localStorage.getItem("Chro-forecaster-current-area")
                            if (callArray){
                                var parsedCallArray = JSON.parse(callArray);
                                //If same name with the current Area
                                if (parsedCallArray[0] == user.environment_name || status == "bypass"){
                                    if (status == "bypass") console.log ("Area checked bypassed")
                                    //Check whether the difference between now and past horns > 0
                                    if (calls-parsedCallArray[2] > 0) {
                                        //Check whether there is a global Area
                                        var areaArray = localStorage.getItem("Chro-forecaster-all-area");
                                        //If got global area
                                        if (areaArray){
                                            var parsedAreaArray = JSON.parse(areaArray)
                                            //Check whether there has already been records of current area
                                            var i = 0;
                                            while (i<parsedAreaArray.length){
                                                if (debug) console.log("WF-There are past records of current area")
                                                //By bypass
                                                if (status == "bypass"){
                                                    if (parsedAreaArray[i][0] == parsedCallArray[0]){
                                                        if (debug) console.log ("WF-Deleting bypass past data");
                                                        parsedAreaArray.splice(i,1);
                                                    } else {
                                                        i++
                                                    }
                                                 //Not by bypass
                                                } else {
                                                    if (parsedAreaArray[i][0] == user.environment_name){
                                                        if (debug) console.log ("WF-Deleting past data");
                                                        parsedAreaArray.splice(i,1);
                                                    } else {
                                                        i++
                                                    }
                                                }
                                            }
                                            if (debug) console.log ("WF-Writing new data")
                                            parsedAreaArray.push([parsedCallArray[0],wisdom-parsedCallArray[1],calls-parsedCallArray[2]])
                                            localStorage.setItem("Chro-forecaster-all-area",JSON.stringify(parsedAreaArray))
                                        //If no global array, write one
                                        } else {
                                            if (debug) console.log("WF-Writing new global array")
                                            var newAreaArray = [[parsedCallArray[0],wisdom-parsedCallArray[1],calls-parsedCallArray[2]]]
                                            localStorage.setItem("Chro-forecaster-all-area",JSON.stringify(newAreaArray))
                                        }
                                    } else if (debug) {console.log("WF-Hunt difference too small")}
                                    if (status == "bypass"){
                                        //bypassed so still need to re-record area
                                        console.log ("bypassed check, so re-record")
                                        callArray = [user.environment_name,wisdom,calls]
                                        localStorage.setItem("Chro-forecaster-current-area",JSON.stringify(callArray))
                                    }
                                } else {
                                    // If different area, re-record
                                    if (debug) console.log ("WF-Area changed! Recording new Area")
                                    callArray = [user.environment_name,wisdom,calls]
                                    localStorage.setItem("Chro-forecaster-current-area",JSON.stringify(callArray))
                                }
                            } else {
                                // if no call array
                                callArray = [user.environment_name,wisdom,calls]
                                localStorage.setItem("Chro-forecaster-current-area",JSON.stringify(callArray))
                            }
                        })
                    resolve()
                }
            )
            }
    })
}

function getWisdom(){
    return new Promise(async(resolve,reject) =>{
        postReq("https://www.mousehuntgame.com/managers/ajax/users/userInventory.php",`sn=Hitgrab&hg_is_ajax=1&item_types%5B%5D=wisdom_stat_item&action=get_items&uh=${user.unique_hash}`)
        .then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                if (data){
                    var wisdom = data.items[0].quantity
                    resolve(wisdom);
                    }
            } catch (error){
                console.log(error)
            }
        })
    })
}

function getTotalCalls(){
    return new Promise(async(resolve,reject) =>{
        postReq("https://www.mousehuntgame.com/managers/ajax/users/userData.php",`sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}&sn_user_ids%5B%5D=${user.sn_user_id}&fields%5B%5D=num_total_turns`)
        .then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                if (data){
                    var snuid = user.sn_user_id;
                    var calls = data.user_data[snuid].num_total_turns //parseInt(data.page.tabs.profile.subtabs[0].num_total_horn_calls.replace(",","").match(/\d+/g))
                    resolve(calls);
                    }
            } catch (error){
                console.log(error)
            }
        })
    })
}

function addEventListener(){
    var clickPoint;
    ($(".mousehuntHud-userStat-row.points>.label")[0])? clickPoint = $(".mousehuntHud-userStat-row.points>.label")[0] : clickPoint = $(".hudstatlabel")[7];
    //const clickPoint = $(".mousehuntHud-userStat-row.points>.label")[0]
    clickPoint.style.cursor = "pointer"
    clickPoint.addEventListener("click",()=>{
        forecastBox();
    })
}

async function forecastBox(){
    document
     .querySelectorAll("#chro-forecast-div")
     .forEach(el=> el.remove())

    const mainDiv = document.createElement("div")
    mainDiv.id = "chro-forecast-div"
    mainDiv.style.cursor = "default"
    $(mainDiv).css({
        "background-color": "#F5F5F5",
        "position": "fixed",
        "z-index": "9999",
        "left": "35vw",
        "top": "20vh",
        "border": "solid 3px #696969",
        "border-radius": "20px",
        "padding": "10px",
        "text-align": "center",
        "font-size": "12px",
        "min-width": "177px"
    })

    const headerDiv = document.createElement("div")
    headerDiv.id = "main-header-div"
    headerDiv.innerText = "Rank-up Forecaster"
    $(headerDiv).css({
        "float": "left",
        "font-weight":"bold",
        "width":"120px",
        "padding-top": "4px"
    })

    const contentDiv = document.createElement("div");
    contentDiv.id = "forecaster-content-div"
    $(contentDiv).css({
        "padding-top":"6px"
    })


    const btnDiv = document.createElement("div")
    btnDiv.id = "forecast-button-Div"
    $(btnDiv).css({
    })

    const minBtn = document.createElement("button")
    minBtn.id ="forecast-min-btn"
    minBtn.className = "forecaster-main-btn"
    minBtn.innerText = "-"
    minBtn.onclick = () =>{
        if (minBtn.innerText == "-"){
            contentDiv.style.display = "none"
            minBtn.innerText = "+"
        } else {
            contentDiv.style.display = ""
            minBtn.innerText = "-"
        }
    }

    const closeBtn = document.createElement("button")
    closeBtn.id = "forecast-close-btn"
    closeBtn.className = "forecaster-main-btn"
    closeBtn.innerText = "x"
    closeBtn.onclick = ()=>{
        document.body.removeChild(mainDiv);
        var historybox = $("#chro-forecast-history-div")[0]
        var canvasbox = $(".forecaster-chart-wrapper")[0]
        var locationbox = $("#chro-forecast-location-div")[0]
        if(historybox) document.body.removeChild($("#chro-forecast-history-div")[0]);
        if(canvasbox) document.body.removeChild($(".forecaster-chart-wrapper")[0]);
        if(locationbox) document.body.removeChild($("#chro-forecast-location-div")[0]);
    };
    [$(minBtn),$(closeBtn)].forEach(el=>{el.css({"margin-left":"5px"})});

    const titleTable = document.createElement("table");
    titleTable.id = "forecaster-table"
    $(titleTable).css({
        "border-spacing":"6px 3px"
    })

    const currentRow = document.createElement("tr")
    const currentHeaderData = document.createElement("td");
    currentHeaderData.innerText = "Current:"
    const currentTitleData = document.createElement("td");
    currentTitleData.innerText = currentTitle + " (" + currentPercent + "%)"

    const wisdomRow = document.createElement("tr")
    const wisdomHeaderData = document.createElement("td");
    wisdomHeaderData.innerText = "Wisdom:"
    const data = localStorage.getItem("Chro-forecaster-time")
    if(data){
        const parsedData = JSON.parse(data)
        var last = parsedData.length-1
        var wisdom = parsedData[last][1]
        } else {
            wisdom = 0
        }
    const wisdomTitleData = document.createElement("td");
    wisdomTitleData.innerText = numberWithCommas(wisdom);

    const nextRow = document.createElement("tr");
    const nextHeaderData = document.createElement("td");
    nextHeaderData.innerText = "Predict:"
    const nextTitleData = document.createElement("td");
    const titleList = document.createElement("select")
    titleList.style.width = "103px"
    titleList.id = "chro-forecaster-title-list"
    var a = title.indexOf(currentTitle)
    title.forEach(el=>{
        if (title.indexOf(el)>a || el == "Fabled"){
            var options = document.createElement("OPTION");
            options.innerText = el;
            titleList.appendChild(options);
        }
    });
    var selectedRank = titleList.value;
    var pointsRequired = wisdomRequired[title.indexOf(titleList.value)]
    titleList.onchange = async function processTitle(e){
        selectedRank = titleList.value;
        pointsRequired = wisdomRequired[title.indexOf(titleList.value)]
        var text = await getPredictDate(pointsRequired)
        .then(
           res => {
               $("#Chro-forecaster-forecasted-data")[0].innerText = res;
               if ($("#my-canvas")[0]){
                   renderChart(pointsRequired,selectedRank)
               }
           })
    }
    nextTitleData.appendChild(titleList);

    const timeRow = document.createElement("tr")
    const timeHeaderData = document.createElement("td");
    timeHeaderData.innerText = "Time:"
    const timeTitleData = document.createElement("td");
    timeTitleData.id = "Chro-forecaster-forecasted-data"
    timeTitleData.style.width = "10px"
    var p = await getPredictDate(pointsRequired)
    .then(
        res=> {timeTitleData.innerText = res}
        );
    //timeTitleData.innerText = inner_text;

     [$(currentHeaderData),$(wisdomHeaderData),$(nextHeaderData),$(timeHeaderData)].forEach(el=>{el.css({
         "font-weight": "bold",
         "text-align" : "right"
     })});

    const contButtonDiv = document.createElement("div")
    contButtonDiv.id = "forecast-content-button-div"

    const historyBtn = document.createElement("button")
    historyBtn.id = "forecast-history-button"
    historyBtn.className = "forecaster-content-button"
    historyBtn.innerText = "History"
    historyBtn.onclick = () => {
        if($("#chro-forecast-history-div")[0]){
            document.body.removeChild($("#chro-forecast-history-div")[0])
        } else {
        renderHistoryBox()
        }
    }

    const chartBtn = document.createElement("button")
    chartBtn.id = "forecast-history-button"
    chartBtn.className = "forecaster-content-button"
    chartBtn.innerText = "Chart"
    chartBtn.style.marginLeft = "5px";
    chartBtn.onclick = async () => {
        if($(".forecaster-chart-wrapper")[0]){
            document.body.removeChild($(".forecaster-chart-wrapper")[0])
        } else {
        var p = await renderChart(pointsRequired,selectedRank).then(
            res => {
                var x = $("#Chro-forecaster-chart")[0];
                dragElement(x,x)
            })
        }
    }

    const locationBtn = document.createElement("button")
    locationBtn.id = "forecast-location-button"
    locationBtn.className = "forecaster-content-button"
    locationBtn.innerText = "Location"
    locationBtn.style.marginLeft = "5px";
    locationBtn.onclick = async () => {
        if($("#chro-forecast-location-div")[0]){
            document.body.removeChild($("#chro-forecast-location-div")[0])
        } else {
            renderLocationBox()
        }
    }

    btnDiv.appendChild(minBtn)
    btnDiv.appendChild(closeBtn)
    mainDiv.appendChild(headerDiv)
    mainDiv.appendChild(btnDiv)
    currentRow.appendChild(currentHeaderData)
    currentRow.appendChild(currentTitleData)
    wisdomRow.appendChild(wisdomHeaderData)
    wisdomRow.appendChild(wisdomTitleData)
    nextRow.appendChild(nextHeaderData)
    nextRow.appendChild(nextTitleData)
    timeRow.appendChild(timeHeaderData)
    timeRow.appendChild(timeTitleData)
    titleTable.appendChild(currentRow)
    titleTable.appendChild(wisdomRow)
    titleTable.appendChild(nextRow)
    titleTable.appendChild(timeRow)
    contentDiv.appendChild(titleTable)
    contButtonDiv.appendChild(historyBtn);
    contButtonDiv.appendChild(chartBtn);
    contButtonDiv.appendChild(locationBtn);
    contentDiv.appendChild(contButtonDiv);
    mainDiv.appendChild(contentDiv)
    document.body.appendChild(mainDiv)
    dragElement(mainDiv,headerDiv)
}

function renderLocationBox(){
    document
     .querySelectorAll("#chro-forecast-location-div")
     .forEach(el=> el.remove())

    const locationDiv = document.createElement("div")
    locationDiv.id = "chro-forecast-location-div"
    $(locationDiv).css({
        "background-color": "#F5F5F5",
        "position": "fixed",
        "z-index": "9999",
        "left": "52vw",
        "top": "20vh",
        "border": "solid 3px #696969",
        "border-radius": "20px",
        "padding": "10px",
        "text-align": "center",
        "font-size": "12px",
        "min-width": "177px"
    })
    const locationMainTable = document.createElement("table")
    locationMainTable.id = "location-table"
    $(locationMainTable).css({
        "border-spacing": "1em 6px",
        "border-collapse": "collapse",
    })

    const placeHeading = document.createElement("th")
    placeHeading.id = "Chro-forecaster-place-heading"
    placeHeading.innerText = "Location";
    const wisdomHeading = document.createElement("th")
    wisdomHeading.id = "Chro-forecaster-location-wisdom-heading"
    wisdomHeading.innerText = "Wisdom/Hunt";
    const percentHeading = document.createElement("th")
    percentHeading.id = "Chro-forecaster-location-percent-heading"
    percentHeading.innerText = "%+/Hunt";
    const huntNumberHeading = document.createElement("th")
    huntNumberHeading.id = "Chro-forecaster-location-hunt-heading"
    huntNumberHeading.innerText = "Hunts";

    [$(placeHeading),$(wisdomHeading),$(percentHeading),$(huntNumberHeading)].forEach(el=>{el.css({
         "font-weight": "bold",
         "text-align" : "center",
         "background-color": "#eaeef0",
         "padding": "3px",
         "padding-top": "3px",
         "padding-bottom": "3px",
         "border":"0.5px solid #696969",
     })});

    locationMainTable.appendChild(placeHeading);
    locationMainTable.appendChild(wisdomHeading);
    locationMainTable.appendChild(percentHeading);
    locationMainTable.appendChild(huntNumberHeading);

    const locationData = localStorage.getItem("Chro-forecaster-all-area")
    if (locationData){
        var parsedLocationData = JSON.parse(locationData);
        for (var i=0;i<parsedLocationData.length;i++){
            var row = document.createElement("tr")
            var location_data = document.createElement("td")
            location_data.innerText = parsedLocationData[i][0]
            var hunt_data = document.createElement("td");
            var total_wisdom = parsedLocationData[i][1];
            var total_hunts = parsedLocationData[i][2];
            hunt_data.innerText = (total_wisdom/total_hunts).toFixed(2)
            var percent_data = document.createElement("td");
            var a = wisdomRequired[title.indexOf(currentTitle)];
            percent_data.innerText = ((total_wisdom/total_hunts)/a).toFixed(6) + "%";
            var hunt_number_data = document.createElement("td");
            hunt_number_data.innerText = total_hunts;

            if (i%2 ==0){
            [$(location_data),$(hunt_data),$(percent_data),$(hunt_number_data)].forEach(el=>{el.css({
            "text-align":"right",
            "border":"0.5px solid #696969",
            "padding":"3px",
            })})
        } else {
            [$(location_data),$(hunt_data),$(percent_data),$(hunt_number_data)].forEach(el=>{el.css({
            "text-align":"right",
            "border":"0.5px solid #696969",
            "padding":"3px",
            "background-color":"white"
            })})
        }
            row.appendChild(location_data);
            row.appendChild(hunt_data);
            row.appendChild(percent_data)
            row.appendChild(hunt_number_data);
            locationMainTable.appendChild(row)
        }
    }
    locationDiv.appendChild(locationMainTable)
    document.body.appendChild(locationDiv)
    dragElement(locationDiv,locationDiv)
}

function renderChart(pointsRequired,rank){
 return new Promise((resolve, reject) => {
    document
     .querySelectorAll("#my-canvas")
     .forEach(el=> el.remove())

    const parsedData = JSON.parse(localStorage.getItem("Chro-forecaster-time"));
    const timeData = [];
    const wisdomData = [];
    parsedData.forEach(el=>{
        var d = new Date(el[0])
        var date_converted = d.getTime();
        timeData.push(date_converted)
    });
    parsedData.forEach(el=>{wisdomData.push(el[1])});

    const createElement = (tagName, config = {}) => {
        const el = document.createElement(tagName);
        if (config.attrs) Object.entries(config.attrs).forEach(([attr, val]) => el.setAttribute(attr, val));
        if (config.props) Object.entries(config.props).forEach(([prop, val]) => el[prop] = val);
        if (config.css) Object.entries(config.css).forEach(([prop, val]) => el.style[prop] = val);
        if (config.children) config.children.forEach(child => el.append(child));
            return el;
        };

    function main() {
        const chartMain = document.body.prepend(createElement('div', {
            props: {
                className: 'forecaster-chart-wrapper',
                id: 'Chro-forecaster-chart'
            },
            children: [
                createElement('canvas', {
                    props: {
                        height: "200",
                        width: "400"
                    },
                    attrs: { id: 'my-canvas' }
                })
            ]
        }));

        const historyChartData = []
        for (var i=0;i<wisdomData.length;i++){
            historyChartData.push({
                x: timeData[i],
                y: wisdomData[i]
            });
        }

        const bfChartData = []
        bfChartData.push({
            x:timeData[0],
            y:wisdomData[0]
        });
        var last = timeData.length-1;
        var find_wisdom = findLineByLeastSquares(timeData,wisdomData)
        var y_value = find_wisdom[0]*(timeData[last])+find_wisdom[1]
        bfChartData.push({
            x: timeData[last],
            y: y_value
        });

        const predictChartData = []
        predictChartData.push({
            x: timeData[0],
            y: wisdomData[0]
        });
        predictChartData.push({
            x: findLineByLeastSquares(timeData,wisdomData,pointsRequired)[2],
            y: pointsRequired
        });

        const chartData = [{
            label: 'History',
            data: historyChartData,
            borderWidth: 1,
            fill: false,
            borderColor: '#25c9f6',
            backgroundColor: '#4dc9f6',
            tension: 0.1,
        },{
            label: 'Best Fit',
            data: bfChartData,
            borderWidth: 1,
            fill: false,
            borderColor: '#9966FF',
            backgroundColor: '#9966FF',
            tension: 0.1
        },{
            label: rank,
            data: predictChartData,
            borderWidth: 1,
            fill: false,
            borderColor: '#953553',
            backgroundColor: '#953553',
            tension: 0.1
        }];

        const myChart = createSimpleLineChart('#my-canvas', chartData);

    }

    function createChart (canvas, settings) {
        new Chart((typeof canvas === 'string' ? document.querySelector(canvas) : canvas).getContext('2d'), settings)
    };

    function createSimpleLineChart (selector, chartData){
        const {data,label} = chartData;
        return createChart(selector, {
            type: 'line',
            data: {datasets: chartData},
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                        }
                    }],
                    x: {
                        type: 'time',
                    }
                },
            },
            plugins: {
                datalabels: {
                    color: 'blue'
                }
            }
        });
    };
    main();
    resolve();
 })
};

function renderHistoryBox(){
    document
     .querySelectorAll("#chro-forecast-history-div")
     .forEach(el=> el.remove())

    const historyDiv = document.createElement("div")
    historyDiv.id = "chro-forecast-history-div"
    $(historyDiv).css({
        "background-color": "#F5F5F5",
        "position": "fixed",
        "z-index": "9999",
        "left": "18vw",
        "top": "20vh",
        "border": "solid 3px #696969",
        "border-radius": "20px",
        "padding": "10px",
        "text-align": "center",
        "font-size": "12px",
        "min-width": "177px"
    })
    const historyMainTable = document.createElement("table")
    historyMainTable.id = "history-table"
    $(historyMainTable).css({
        "border-spacing": "1em 6px",
        "border-collapse": "collapse",
    })

    const tableBody = document.createElement("tbody");

    const data = localStorage.getItem("Chro-forecaster-time")
    const parsedData = JSON.parse(data)

    const timeHeading = document.createElement("th")
    timeHeading.id = "Chro-forecaster-time-heading"
    timeHeading.innerText = "Date  " + String.fromCharCode("0x23F7");
    timeHeading.style.cursor = "pointer";
    timeHeading.onclick = function(){
        if (timeHeading.innerText == "Date ⏷"){
            timeHeading.innerText = "Date  " + String.fromCharCode("0x23F6")
        } else {
            timeHeading.innerText = "Date  " + String.fromCharCode("0x23F7")
        };
        reverse(tableBody);
    };
    const wisdomHeading = document.createElement("th")
    wisdomHeading.id = "Chro-forecaster-wisdom-heading"
    wisdomHeading.innerText = "Wisdom+";
    const percentageHeading = document.createElement("th")
    percentageHeading.id = "Chro-forecaster-percentage-heading"
    percentageHeading.innerText = "%";
    const percentageIncreaseHeading = document.createElement("th")
    percentageIncreaseHeading.id = "Chro-forecaster-percentage-increase-heading"
    percentageIncreaseHeading.innerText = "%+";
    const removeHeading = document.createElement("th")
    removeHeading.id = "Chro-forecaster-remove-heading";

    [$(timeHeading),$(wisdomHeading),$(percentageHeading),$(percentageIncreaseHeading),$(removeHeading)].forEach(el=>{el.css({
         "font-weight": "bold",
         "text-align" : "center",
         "background-color": "#eaeef0",
         "padding": "3px",
         "padding-top": "3px",
         "padding-bottom": "3px",
         "border":"0.5px solid #696969",
     })});

    historyMainTable.appendChild(timeHeading)
    historyMainTable.appendChild(wisdomHeading)
    //historyMainTable.appendChild(percentageHeading)
    historyMainTable.appendChild(percentageIncreaseHeading)

    const dataLength = parsedData.length
    for (var i=0;i<parsedData.length;i++){
        const row = document.createElement("tr")
        row.id = "row"+i
        const time_value = parsedData[i][0]
        const wisdom_value = parsedData[i][1]

        var d = new Date(time_value)
        var hunt_date = formatDate(d)//d.getDate() + '/' + (d.getMonth()+1) //+ '/' + d.getFullYear()
        var hunt_time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)

        const time_data = document.createElement("td")
        time_data.className = "Chro-forecaster-time-data"
        time_data.innerText = hunt_date + " " + hunt_time

        const wisdom_data = document.createElement("td")
        wisdom_data.className = "Chro-forecaster-wisdom-data"
        var previous_wisdom = parsedData[Math.max(i-1,0)][1]
        var wisdom_difference = wisdom_value-previous_wisdom
        wisdom_data.innerText = numberWithCommas(wisdom_difference);
        $(wisdom_data).css({"text-align":"right"})

        const percentage_data = document.createElement("td")
        percentage_data.innerText = (wisdom_value/(wisdomRequired[title.indexOf(currentTitle)+1])*100).toFixed(2)+ "%"

        const percentage_increase_data = document.createElement("td")
        var percentage_increase = ((wisdom_value-previous_wisdom)*100/(previous_wisdom)).toFixed(2)
        percentage_increase_data.innerText = percentage_increase + "%"

        const remove_btn = document.createElement("button")
        remove_btn.innerText = "x";
        remove_btn.onclick =()=>{
            for (var i=0;i<parsedData.length;i++){
                var d = new Date(parsedData[i][0])
                var hunt_date = formatDate(d);//d.getDate() + '/' + (d.getMonth()+1) //+ '/' + d.getFullYear()
                var hunt_time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
                var remove_time = hunt_date + " " + hunt_time
                if(remove_time == remove_btn.parentElement.children[0].innerText){
                    parsedData.splice([i],1);
                    tableBody.removeChild(remove_btn.parentElement);
                }
            }
            var unparsed_data = JSON.stringify(parsedData)
            localStorage.setItem("Chro-forecaster-time",unparsed_data);
        }
        $(remove_btn).css({
            "width": "15px",
            "height": "15px",
            "font-size": "10px",
            "text-align": "center",
            "padding": "0px",
            "background-color":"#F5F5F5",
            "border":"none",
            "border-color":"#F5F5F5",
            "cursor":"pointer"
        });
        if (i%2 ==0){
            [$(time_data),$(wisdom_data),$(percentage_increase_data)].forEach(el=>{el.css({
            "text-align":"right",
            "border":"0.5px solid #696969",
            "padding":"3px",
            })})
        } else {
            [$(time_data),$(wisdom_data),$(percentage_increase_data)].forEach(el=>{el.css({
            "text-align":"right",
            "border":"0.5px solid #696969",
            "padding":"3px",
            "background-color":"white"
            })})
        }

        row.appendChild(time_data)
        row.appendChild(wisdom_data)
        //row.appendChild(percentage_data)
        row.appendChild(percentage_increase_data)
        row.appendChild(remove_btn)
        tableBody.appendChild(row)
    }
    historyMainTable.appendChild(tableBody)
    historyDiv.appendChild(historyMainTable)
    document.body.appendChild(historyDiv)

    dragElement(historyDiv,historyDiv);
    reverse(tableBody);

}

function getPredictDate(points){
    return new Promise((resolve, reject) => {
        const parsedData = JSON.parse(localStorage.getItem("Chro-forecaster-time"));
        if (parsedData){
        const timeData = [];
        const wisdomData = [];
        parsedData.forEach(el=>{
            var d = new Date(el[0])
            var date_converted = d.getTime();
            timeData.push(date_converted)
        });
        parsedData.forEach(el=>{wisdomData.push(el[1])});
        //function end --------------
          var timeRequired = findLineByLeastSquares(timeData,wisdomData,points)[2]
        var d = new Date(timeRequired);
        resolve(d);
        } else {
            d = "Insufficient Data"
        }
    })
}

function formatDate(d){
    var allMonths = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    var month = d.getMonth()+1
    var monthFormat = allMonths[Number(month) -1]
    var dateFormat = (d.getFullYear()).toString().substr(-2);
    return(d.getDate() + ' ' + monthFormat + ' ' + dateFormat);
}

function reverse(table){
    $(table).each(function(elem,index){
            var arr = $.makeArray($("tr",this).detach());
            arr.reverse();
            $(this).append(arr);
        });
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function findLineByLeastSquares(values_x, values_y,rank_value) {
    var x_sum = 0;
    var y_sum = 0;
    var xy_sum = 0;
    var xx_sum = 0;
    var count = 0;

    /*
     * The above is just for quick access, makes the program faster
     */
    var x = 0;
    var y = 0;
    var values_length = values_x.length;

    if (values_length != values_y.length) {
        throw new Error('The parameters values_x and values_y need to have same size!');
    }

    //Above and below cover edge cases
    if (values_length === 0) {
        return [ [], [] ];
    }

    //Calculate the sum for each of the parts necessary.
    for (var i = 0; i< values_length; i++) {
        x = values_x[i];
        y = values_y[i];
        x_sum+= x;
        y_sum+= y;
        xx_sum += x*x;
        xy_sum += x*y;
        count++;
    }

    // y = m*x + b
    var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
    var b = (y_sum/count) - (m*x_sum)/count;

    //x = (y-b)/m
    var time_value = (rank_value - b)/m

    return [m, b,time_value];
}


function dragElement(elmnt,dragEl) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  /*if (elmnt.firstElementChild) {
    // if present, the header is where you move the DIV from:
   elmnt.firstElementChild.onmousedown = dragMouseDown;
  } else {*/
    // otherwise, move the DIV from anywhere inside the DIV:
    dragEl.onmousedown = dragMouseDown;
  //}

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
}