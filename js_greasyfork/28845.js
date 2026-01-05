// ==UserScript==
// @name         Ikariam Automation
// @namespace    Danielv123
// @version      1.2.2
// @description  Attempts to automate all the routine tasks in ikariam, like transporting wine
// @author       Danielv123
// @match        *://*.ikariam.gameforge.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/28845/Ikariam%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/28845/Ikariam%20Automation.meta.js
// ==/UserScript==

function main () {
    // Ikariam user tools
    // SEND CTs ---------------------------------------------------------
    // check if the CT option exists in message dialog
    // document.querySelector("option[value='77']").click();
    // OR document.querySelector(".message_subject")[0].value = 77
    // Send the message
    // document.querySelector("#js_messageSubmitButton").click()
    window.sendCulturalTreaty = function(callback, returnN) {
        callback = callback || function(x){};
        // if 77 (send cultural treaty) is an option
        if(document.querySelector("option[value='77']")){
            // Select cultural treaty
            document.querySelector(".message_subject")[0].value = 77;
            // click send button
            document.querySelector("#js_messageSubmitButton").click();
            callback(true, returnN);
        } else {
            if(document.querySelector("#js_backlinkButton")){
                document.querySelector("#js_backlinkButton").click();
            }
            callback(false, returnN);
        }
    };
    window.sendManyCulturalTreaties = function(numberOfTreaties){
        // get array of all players in current high score screen
        let players = [].slice.call(document.querySelectorAll(".table01.highscore tbody tr"), 1);
        // let notPicked = true;
        let luckyPlayer = players[Math.floor(Math.random()*players.length)];
        /*let i = 0;
        while(notPicked){
            // players[i]
        }*/
        // select message, send and then repeat if we got more stuff to send
        setTimeout(function(){
            sendCulturalTreaty(function(status, returnN){
                if(status){
                    returnN -= 1;
                }
                if(returnN > 0){
                    setTimeout(function(){
                        sendManyCulturalTreaties(returnN);
                    }, 2000);
                }
            }, numberOfTreaties);
        },2000);
    };
    // SEND RESOURCES ---------------------------------------------------
    window.sendAlot = function(townNumber, townFromNumber, resource, amount) {
        localStorage.resource = resource;
        localStorage.amount = amount;
        localStorage.destination = townNumber;
        localStorage.origin = townFromNumber;
        // asdadas();
        //sendResources(townNumber, resource, window.asdadas);
    };
    window.asdadas = function(){
        if(localStorage.amount < 0) {
            transporterStatus = "Nothing to do, all resources sent";
        }
        if(document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML < 2) {
            transporterStatus = "Waiting for free cargoships";
        }
        if(localStorage.paused == "true"){
            transporterStatus = "Script is paused";
        }
        if(localStorage.resource && localStorage.amount > 0) {
            //localStorage.amount -= 5000;
            sendResources(localStorage.destination, localStorage.origin, localStorage.resource);
        }
    };
    // send 5000 resources from one town to another
    window.sendResources = function(townNumber, fromTownNumber, resource, callback) {
        if(localStorage.paused == "true" /*|| Number(document.querySelector("#js_GlobalMenu_maxActionPoints").innerHTML) < 1*/ || document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML < 2/* || document.querySelector("#js_CityPosition1PortCountdownText").innerHTML*/) {
            // if we have no action points OR the city is currently loading some ships, wait and do nothing.
            //setTimeout(function(){window.sendResources(townNumber,fromTownNumber,resource,callback);}, 10000);
            // NO, STOP IT, DON'T!
            // we already have a loop that keeps retrying. Relax.
        } else {
            // if sending to the same town, STOP IT. ITS NOT FUNNY.
            if(townNumber == fromTownNumber){
                throw "ERROR sending to same town? Not on my watch!";
            }
            // correct for the fact that the dock GUI does not show the currently selected town
            if(Number(townNumber) > Number(fromTownNumber)){
                townNumber--;
            }
            transporterStatus = "Going to town " + fromTownNumber + " to send resources";
            gotoTown(fromTownNumber, function(){
                if(Number(document.querySelector("#js_GlobalMenu_maxActionPoints").innerHTML) > 0){
                    // click dock on the left (gotta have dock there, no shipyardy stuff) or fixed now?
                    if(document.querySelector("#position1").className.includes("port")){
                        document.querySelector("#js_CityPosition1Link").click();
                    } else if (document.querySelector("#position2").className.includes("port")){
                        document.querySelector("#js_CityPosition2Link").click();
                    } else {
                        transporterStatus = "No dock, what do you think you are doing???";
                    }
                    setTimeout(function(){
                        // get list if town sending targets from dock and click one
                        document.querySelectorAll(".cities.clearfix > li > a")[townNumber].click();
                        setTimeout(function(){
                            // either pick totalShips/actionPoints or 20, whatever is smaller.
                            let numberOfShips = Math.min(Math.floor(document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML / Number(document.querySelector("#js_GlobalMenu_maxActionPoints").innerHTML)), 20);
                            if(document.querySelector("#js_GlobalMenu_freeTransporters").innerHTML >= numberOfShips){
                                // find the right resource selector slider and set it to 5k, then click the send button
                                let resourceID = "#textfield_" + resource;
                                // Set how much we send. Pick whatever is smaller of localStorage and what we can send right now.
                                document.querySelector(resourceID).value = Math.min(500*numberOfShips, localStorage.amount);
                                let sentAmount = Math.min(500*numberOfShips, localStorage.amount);
                                document.querySelector("#submit").click();
                                setTimeout(function(){
                                    // close window when stuff is sent
                                    transporterStatus = "Sent " + sentAmount + " " + resource;
                                    localStorage.amount -= sentAmount;
                                    if(callback && typeof callback == "function"){
                                        setTimeout(callback, 1000);
                                    }
                                    document.querySelector("div.close").click();
                                }, 2000);
                            } else {
                                transporterStatus = "Not enough ships";
                            }
                        },2000);
                    },2000);
                } else {
                    transporterStatus = "No action points left";
                }
            }); // end gototown callback
        }
    };
    window.gotoTown = function(townNumber, callback) {
        console.log("going to town " +townNumber);
        document.querySelector("#js_citySelectContainer > span").click();
        setTimeout(function(){
            try{
                document.querySelectorAll("#dropDown_js_citySelectContainer > div.bg > ul > li > a")[townNumber].click();
            } catch (e){}
            setTimeout(callback, 1000);
        },1000);
    };
    window.getTownResources = function(townNumber, callback) {
        var checkResources = function() {
            console.log(typeof callback);
            var resources = {};
            resources.wood = stringToNumber(document.querySelector("#resources_wood > span").innerHTML);
            resources.wine = stringToNumber(document.querySelector("#resources_wine > span").innerHTML);
            resources.marble = stringToNumber(document.querySelector("#resources_marble > span").innerHTML);
            resources.glass = stringToNumber(document.querySelector("#resources_glass > span").innerHTML);
            resources.sulfur = stringToNumber(document.querySelector("#resources_sulfur > span").innerHTML);
            callback(resources);
        };
        gotoTown(townNumber, checkResources);
    };
    window.stringToNumber = function(str) {
        return parseFloat(str.replace(',','').replace(' ',''));
    };
    setInterval(asdadas, 10000);
    // update userscript status box
    var transporterStatus;
    setInterval(function(){
        $("#transporterMaterial")[0].innerHTML = "Material: " + localStorage.resource;
        $("#transporterAmount")[0].innerHTML = "Amount: " + localStorage.amount;
        // transporterStatus is a global variable that is assigned throughout the functions to give an approximate as to what the script is doing
        $("#transporterStatus")[0].innerHTML = transporterStatus;
    },1000);
    // create form to send resources
    window.createForm = function (){
        let HTML = '<div><span>From: </span><select id="transporterSendFromTown">';
        let townList = document.querySelector("#dropDown_js_citySelectContainer > div.bg > ul").childNodes;
        for(let i = 0; i < townList.length; i++){
            HTML += '<option value="'+i+'">'+townList[i].childNodes[0].innerHTML+'</option>';
        }
        HTML += '</select></div>';
        HTML += '<div><span>Destination: </span><select id="transporterSendDestination">';
        for(let i = 0; i < townList.length; i++){
            HTML += '<option value="'+i+'">'+townList[i].childNodes[0].innerHTML+'</option>';
        }
        HTML += '</select></div>';
        HTML += '<div><span>Resource: </span><select id="transporterSendResource">';
        HTML += '<option value="wood">Wood</option>';
        HTML += '<option value="wine">Wine</option>';
        HTML += '<option value="marble">Marble</option>';
        HTML += '<option value="glass">Crystal</option>';
        HTML += '<option value="sulfur">Sulfur</option>';
        HTML += '</select></div>';
        HTML += '<div><span>Amount: </span><input id="transporterSendAmount" type="number"></div>';
        HTML += '<button onclick="sendResourcesFromForm();">Send resources</button>';
        return HTML;
    };
    window.sendResourcesDialog = function () {
        // use ikariams built in fancy dialog box for our dialog for extra fancyness
        ikariam.createPopup("ikaMationTransporterDialog","Mass transport resources",createForm(),"???","class");
    };
    window.sendResourcesFromForm = function () {
        let destination = document.querySelector("#transporterSendDestination").value;
        let fromTown = document.querySelector("#transporterSendFromTown").value;
        let resource = document.querySelector("#transporterSendResource").value;
        let amount = document.querySelector("#transporterSendAmount").value;
        sendAlot(destination, fromTown, resource, amount);
        document.querySelector("#ikaMationTransporterDialog").outerHTML = "";
    };
}
$('body').append("<div id='userscript' style='position:fixed;background-color:white;z-index:100000000;bottom:0px;right:0px;height:150px;width:200px;'></div>");
$("#userscript").append("<h2 style='font-size:20px;font-weight:bold;'>IkaMation</h2><button onclick='localStorage.paused = localStorage.paused == \"false\"'>Pause/resume script</button><p id='transporterMaterial'>Material: </p><p id='transporterAmount'>Amount:</p><p id='transporterStatus'></p>");

$("#userscript").append('<button onclick="sendResourcesDialog();">Mass send resources</button>');

var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
/*
let infoBox = document.createElement("div");
infoBox.appendChild(document.createTextNode("<div id='userscript' style='position:fixed;background-color:white;z-index:100000000;bottom:0px;right:0px;height:100px;width:200px;'></div>"));
(document.body|| document.documentElement).appendChild(infoBox);
*/