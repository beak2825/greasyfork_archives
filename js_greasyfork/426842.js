// ==UserScript==
// @name         MH Rank-up Forecaster (Discontinued due to v2.0)
// @version      1.4.1
// @description  Predicts the rank-up date
// @author       Chromatical
// @match        https://www.mousehuntgame.com/camp.php
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/426842/MH%20Rank-up%20Forecaster%20%28Discontinued%20due%20to%20v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/426842/MH%20Rank-up%20Forecaster%20%28Discontinued%20due%20to%20v20%29.meta.js
// ==/UserScript==

console.log("Wisdom Forecaster Enabled");

//Settings
var timeBetweenCheck = 6; //How often the script automatically records wisdom (in hours)
var storeDataAmount = 50; //How many sets of data to perform calculations on, rest would be removed
//Settings Ends

var hourBetweenCheck = timeBetweenCheck*3600000;

//Checks whether tsitu's tool installed (sometimes it lags, so the script allows 3 seconds for the tsitu too to laoad)
function checkwisdomtool() {
    setInterval(function(){
        var checktool = document.getElementsByClassName("mousehuntHud-userStat-row wisdom")
        if (checktool.length <1){
            alert("The Rank-up Forecaster Tool requires Tsitu's Wisdom-Stats-Tool to run, download at https://greasyfork.org/en/scripts/381219-mousehunt-wisdom-stats");
        }
    },3000);
}

var wisdomArr = localStorage.getItem("predict-wisdom");
        if (wisdomArr === null){
            var emptySet = [];
            localStorage.setItem("predict-wisdom",JSON.stringify(emptySet));
            localStorage.setItem("predict-wisdom-result","");
            getWisdom();
        } else if (wisdomArr.length > storeDataAmount){
            cleanArray();
        }

var wisdomPrediction = localStorage.getItem("predict-wisdom-result");
        if (wisdomPrediction === null){
            localStorage.setItem("predict-wisdom-result","");
        };

var clickpoints = document.querySelectorAll(".label")[3];
clickpoints.title = "Click to check rank-up prediction!";
clickpoints.style.cursor = "pointer";

//Listen if you have clicked 'points'
clickpoints.addEventListener("click",function(){
    let wisdom_Arr = JSON.parse(localStorage.getItem("predict-wisdom"));
    if (wisdom_Arr.length<2){
        alert("Not enough data to predict next rank-up");
    } else {
        var predictedresults = JSON.parse(localStorage.getItem("predict-wisdom-result"));
        alert("Next Rank: ".concat(predictedresults[0],"\nPredicted rank up date: ",(predictedresults[1])));
    }
});

//Runs it once, then runs it at intervals of 1 hour
(function() {
    checktime();
    setInterval(function(){
        checktime();
    },3600000)
}
)();

//Main function
function checktime(){
    let wisdom_Arr = JSON.parse(localStorage.getItem("predict-wisdom"));
    var last_data_number = wisdom_Arr.length -1;
    var last_check_time = wisdom_Arr[last_data_number][0];
    var now = new Date();
    var past = Date.parse(last_check_time);
    if (now.getTime() - past > hourBetweenCheck){
        clickwis();
        getWisdom();
        calculate();
        cleanArray();
    } else {
        return;
    };
}

//Part 1:Data Storage
function clickwis(){
    document.getElementsByClassName("mousehuntHud-userStat-row wisdom")[0].firstElementChild.click();
}

function getWisdom(){
    var current_wisdom = parseFloat(document.getElementById("hud_wisdom").textContent.replace(/,/g, ''));
    var current_time = new Date();
    var wisdomArray = JSON.parse(localStorage.getItem("predict-wisdom"));
    var wisdom_new = [current_time,current_wisdom];
    wisdomArray.push(wisdom_new);
    localStorage.setItem("predict-wisdom",JSON.stringify(wisdomArray));
};

//Clears some data
function cleanArray(){
    var wisdomArray = JSON.parse(localStorage.getItem("predict-wisdom"));
    while (wisdomArray.length > storeDataAmount){
    wisdomArray.shift();
    localStorage.setItem("predict-wisdom",JSON.stringify(wisdomArray));
    }
}

//Part 2: Forecast calculations
//Stolen Line By Least Squares, code from 'https://medium.com/@sahirnambiar/linear-least-squares-a-javascript-implementation-and-a-definitional-question-e3fba55a6d4b'
function findLineByLeastSquares(values_x, values_y) {
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
    for (let i = 0; i< values_length; i++) {
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

    return [m, b];
}

function calculate(){
    var wisdomArray = JSON.parse(localStorage.getItem("predict-wisdom"));
    var x_values = [];
    var y_values = [];

    //Calculates data based on all the data from Storage
    for (var i=0; i<wisdomArray.length; i++){
        var convertedtime = Date.parse(wisdomArray[i][0]);
        x_values.push(convertedtime);
        y_values.push(wisdomArray[i][1]);
    };
    var mAndb = findLineByLeastSquares(x_values,y_values);

    //Getting Next Title
    var current_title = document.getElementsByClassName("label hud_title")[0].innerText;
    var titleConverted = titleConversion(current_title);
    const title = ['Novice','Recruit','Apprentice','Initiate','Journeyman','Master','Grandmaster','Legendary','Hero','Knight','Lord','Baron','Count','Duke','Grand Duke','Archduke','Viceroy','Elder','Sage','Fabled']
    const wisdomReq = [0,2000,5000,12500,31250,65440,137813,303188,667013,1467428,3228341,7102349,15625168,34375370,75625813,166376789,366028936,805263659,1771580048,3897476106]
    var a = title.indexOf(titleConverted) + 1;
    var forecastedTitle =title[a];
    var requiredPoints =wisdomReq[a];

    //Predicting function
    var rankUp = (requiredPoints - mAndb[1])/mAndb[0];
    var convertedrankUp = new Date(rankUp);

    //Save to localStorage
    var dateconverted = new Date(rankUp).toLocaleDateString('en-GB');
    var rankAndDate = [forecastedTitle,dateconverted]
    localStorage.setItem("predict-wisdom-result",JSON.stringify(rankAndDate));
}

//Title conversion so that indexOf will work
function titleConversion(rank){
    if (rank == "Lady"){
        return "Lord"
    } else if (rank == "Baroness"){
        return "Baron"
    } else if (rank == "Countess"){
        return "Count"
    } else if (rank == "Archduchess"){
        return "Archduke"
    } else {
        return rank
    }
}