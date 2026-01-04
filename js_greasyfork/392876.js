// ==UserScript==
// @name         Torn Extensions - Gym Torn Gain
// @namespace    TornExtensions
// @version      1.5.2
// @description  calculates gym gain based on Vladars calculations
// @author       Xradiation
// @match        https://www.torn.com/gym.php*
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.slim.min.js
// @run-at       document-idle
/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/392876/Torn%20Extensions%20-%20Gym%20Torn%20Gain.user.js
// @updateURL https://update.greasyfork.org/scripts/392876/Torn%20Extensions%20-%20Gym%20Torn%20Gain.meta.js
// ==/UserScript==

//you can manually insert an apikey here
var ManualKey = "apikeyhere";

this.$ = this.jQuery = jQuery.noConflict(true);

function readCookie(variable){
    var first = document.cookie.split(variable+'=')[1];
    return (typeof first !== 'undefined')? first.split(';')[0]: false;
}

function en_de_code(text, key, mode){
    var letters = (mode)?'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''):'ZYXWVUTSRQPONMLKJIHGFEDCBA9876543210zyxwvutsrqponmlkjihgfedcba'.split('');
    key = (typeof key == 'number')? key.toString():key;
    var textArr=text.split('');
    var keyArr=key.split('');
    var z=0;
    let coded =[];
    textArr.forEach(function(item){
        let indexTemp= letters.indexOf(item) + parseInt(keyArr[z]);
        let index= indexTemp-letters.length*parseInt(indexTemp/letters.length);
        coded.push(letters[index]);
        (z>=(keyArr.length -1))?z=0:z++;
    });
    return coded.join('');
}
//leave this in global, i am lazy
var playerId = readCookie('uid');

(function() {
    'use strict';
    //the userscript is currently diabled due to api
    if(readCookie('GTGdisabled') == 'true') return;

    //EDIT AT OWN RISK!!!
    manualEstimator();

    //remove old apikeys if stil there
    if(localStorage.apiKey || localStorage.XrayApiKey) {
        localStorage.enXrayApiKey = en_de_code((localStorage.XrayApiKey || localStorage.apiKey),readCookie('uid'),0);
        localStorage.removeItem("apiKey");
        localStorage.removeItem("XrayApiKey");
    }

    if(typeof(ManualKey) != "undefined"&&
       ManualKey != "apikeyhere" &&
       ManualKey != "" &&
       ManualKey != null) localStorage.enXrayApiKey = en_de_code(ManualKey,playerId,0);

    //minified vars
    var Gymlist2=[{Gym:"Premier Fitness",Energy:5,Str:2,Spe:2,Def:2,Dex:2},{Gym:"Average Joes",Energy:5,Str:2.4,Spe:2.4,Def:2.8,Dex:2.4},{Gym:"Woody's Workout",Energy:5,Str:2.8,Spe:3.2,Def:3,Dex:2.8},{Gym:"Beach Bods",Energy:5,Str:3.2,Spe:3.2,Def:3.2,Dex:"0"},{Gym:"Silver Gym",Energy:5,Str:3.4,Spe:3.6,Def:3.4,Dex:3.2},{Gym:"Pour Femme",Energy:5,Str:3.4,Spe:3.6,Def:3.6,Dex:3.8},{Gym:"Davies Den",Energy:5,Str:3.7,Spe:"0",Def:3.7,Dex:3.7},{Gym:"Global Gym",Energy:5,Str:4,Spe:4,Def:4,Dex:4},{Gym:"Knuckle Heads",Energy:10,Str:4.8,Spe:4.4,Def:4,Dex:4.2},{Gym:"Pioneer Fitness",Energy:10,Str:4.4,Spe:4.6,Def:4.8,Dex:4.4},{Gym:"Anabolic Anomalies",Energy:10,Str:5,Spe:4.6,Def:5.2,Dex:4.6},{Gym:"Core",Energy:10,Str:5,Spe:5.2,Def:5,Dex:5},{Gym:"Racing Fitness",Energy:10,Str:5,Spe:5.4,Def:4.8,Dex:5.2},{Gym:"Complete Cardio",Energy:10,Str:5.5,Spe:5.8,Def:5.5,Dex:5.2},{Gym:"Legs Bums and Tums",Energy:10,Str:"0",Spe:5.6,Def:5.6,Dex:5.8},{Gym:"Deep Burn",Energy:10,Str:6,Spe:6,Def:6,Dex:6},{Gym:"Apollo Gym",Energy:10,Str:6,Spe:6.2,Def:6.4,Dex:6.2},{Gym:"Gun Shop",Energy:10,Str:6.6,Spe:6.4,Def:6.2,Dex:6.2},{Gym:"Force Training",Energy:10,Str:6.4,Spe:6.6,Def:6.4,Dex:6.8},{Gym:"Cha Cha's",Energy:10,Str:6.4,Spe:6.4,Def:6.8,Dex:7},{Gym:"Atlas",Energy:10,Str:7,Spe:6.4,Def:6.4,Dex:6.6},{Gym:"Last Round",Energy:10,Str:6.8,Spe:6.6,Def:7,Dex:6.6},{Gym:"The Edge",Energy:10,Str:6.8,Spe:7,Def:7,Dex:6.8},{Gym:"George's",Energy:10,Str:7.3,Spe:7.3,Def:7.3,Dex:7.3},{Gym:"Balboas Gym",Energy:25,Str:"0",Spe:"0",Def:7.5,Dex:7.5},{Gym:"Frontline Fitness",Energy:25,Str:7.5,Spe:7.5,Def:"0",Dex:"0"},{Gym:"Gym 3000",Energy:50,Str:8,Spe:"0",Def:"0",Dex:"0"},{Gym:"Mr. Isoyamas",Energy:50,Str:"0",Spe:"0",Def:8,Dex:"0"},{Gym:"Total Rebound",Energy:50,Str:"0",Spe:8,Def:"0",Dex:"0"},{Gym:"Elites",Energy:50,Str:"0",Spe:"0",Def:"0",Dex:8},{Gym:"Sports Science Lab",Energy:25,Str:9,Spe:9,Def:9,Dex:9}];
    var Gym,gymNumber,speed,strength,defense,dexterity,strength_modifier,defense_modifier,speed_modifier,dexterity_modifier,happy,energy,i,n,modifierSpe=1,modifierAll=1,modifierStr=1,modifierDex=1,modifierDef=1,a=3.480061091*Math.pow(10,-7),b=250,c=3.091619094*Math.pow(10,-6),d=6.82775184551527*Math.pow(10,-5),e=-.0301431777;
    var apiKey;

    if (localStorage.enXrayApiKey === null ||
        localStorage.enXrayApiKey === undefined ||
        localStorage.enXrayApiKey === "") {

        console.info('api is null');

        // poppup message to set api key
        poppupMesage("Please insert your API key in order to use gymtorngains:", "apikey")

    } else{
        apiKey = en_de_code(window.localStorage.enXrayApiKey,playerId,1);
        statsEstimator();
    }

    function statsEstimator() {
        if (document.getElementById("gymroot")) {
            var urlStats = 'https://api.torn.com/user/?selections=battlestats,gym,bars,perks&key=' + apiKey;
            //api call
            fetch(urlStats).then(function(response) {
                response.json().then(function(data) {
                    if(data.hasOwnProperty("error")) {
                        handleErrorCode(data.error);
                        return;
                    }
                    //apiRequest1
                    //console.log(data);
                    strength = data.strength;
                    defense = data.defense;
                    speed = data.speed;
                    dexterity = data.dexterity;
                    strength_modifier = data.strength_modifier;
                    defense_modifier = data.defense_modifier;
                    speed_modifier = data.speed_modifier;
                    dexterity_modifier = data.dexterity_modifier;
                    //apiRequest2
                    happy = data.happy.current;
                    energy = data.energy.current;
                    //apiRequest3
                    gymNumber = data.active_gym - 1;
                    Gym = Gymlist2[gymNumber].Gym;
                    //apiRequest4
                    var string;
                    if (data.hasOwnProperty('property_perks')) {
                        for (i = 0; i < data.property_perks.length; i++) {
                            string = data.property_perks[i];
                            if (string.includes('gym gains')) {
                                n = parseFloat(data.property_perks[i].match(/\d+/)[0]);
                                n = (n / 100) + 1;
                                modifierAll *= n;
                            }
                        }
                    }
                    if (data.hasOwnProperty('education_perks')) {
                        for (i = 0; i < data.education_perks.length; i++) {
                            string = data.education_perks[i];
                            modifierAll *= (string.includes('1% gym gains')) ? 1.01 : 1;
                            modifierDex *= (string.includes('dexterity gym gains')) ? 1.01 : 1;
                            modifierDef *= (string.includes('defense gym gains')) ? 1.01 : 1;
                            modifierSpe *= (string.includes('speed gym gains')) ? 1.01 : 1;
                            modifierStr *= (string.includes('strength gym gains')) ? 1.01 : 1;
                        }
                    }
                    if (data.hasOwnProperty('company_perks')) {
                        for (i = 0; i < data.company_perks.length; i++) {
                            string = data.company_perks[i];
                            modifierDex *= (string.includes('dexterity gym gains')) ? 1.1 : 1;
                            modifierDef *= (string.includes('defense gym gains')) ? 1.1 : 1;
                            modifierAll *= (string.includes('gym gains')) ? 1.03 : 1;
                        }
                    }
                    if (data.hasOwnProperty('book_perks')) {
                        for (i = 0; i < data.book_perks.length; i++) {
                            string = data.book_perks[i];
                            modifierAll *= (string.includes('all gym gains')) ? 1.2 : 1;
                            modifierStr *= (string.includes('strength gym gains')) ? 1.3 : 1;
                            modifierDef *= (string.includes('defense gym gains')) ? 1.3 : 1;
                            modifierSpe *= (string.includes('speed gym gains')) ? 1.3 : 1;
                            modifierDex *= (string.includes('dexterity gym gains')) ? 1.3 : 1;
                        }
                    }
                    if (data.hasOwnProperty('faction_perks')) {
                        for (i = 0; i < data.faction_perks.length; i++) {
                            string = data.faction_perks[i];
                            if (string.includes('gym gains')) {
                                n = parseFloat(string.match(/\d+/)[0]);
                                n = (n / 100) + 1;
                                if (string.includes('strength')) {
                                    modifierStr *= n;
                                }
                                else if (string.includes('speed')) {
                                    modifierSpe *= n;
                                }
                                else if (string.includes('defense')) {
                                    modifierDef *= n;
                                }
                                else if (string.includes('dexterity')) {
                                    modifierDex *= n;
                                }
                            }
                        }
                    }
                  	
                    modifierStr *= modifierAll;
                    modifierSpe *= modifierAll;
                    modifierDef *= modifierAll;
                    modifierDex *= modifierAll;
                    var GymDotsSpe = Gymlist2[gymNumber].Spe;
                    var GymDotsDef = Gymlist2[gymNumber].Def;
                    var GymDotsDex = Gymlist2[gymNumber].Dex;
                    var GymDotsStr = Gymlist2[gymNumber].Str;
                    var EnergyPerTrain = Gymlist2[gymNumber].Energy;
                    var trains = parseInt(energy / EnergyPerTrain);
                    //new formula
                    var gainSpe = calculateTotal(speed, happy, GymDotsSpe, EnergyPerTrain, modifierSpe, 'spe', trains);
                    var gainDef = calculateTotal(defense, happy, GymDotsDef, EnergyPerTrain, modifierDef, 'def', trains);
                    var gainDex = calculateTotal(dexterity, happy, GymDotsDex, EnergyPerTrain, modifierDex, 'dex', trains);
                    var gainStr = calculateTotal(strength, happy, GymDotsStr, EnergyPerTrain, modifierStr, 'str', trains);

                    var [strText, defText, speText, dexText] = [gainStr,gainDef,gainSpe,gainDex].map(gain=>{
                        return `<br><span style="float: left;margin:5px;background:#494949;border: 4px solid #494949">+${ROUND(gain[0],2)}</span>
                        <span style="float: right;margin:5px;background:#494949;border: 4px solid #494949"><b>+${ROUND(gain[1],2)}</b></span>`;
                    });

                    var arr = [{
                        'speText': speText,
                        'value': GymDotsSpe
                    }, {
                        'defText': defText,
                        'value': GymDotsDef
                    }, {
                        'dexText': dexText,
                        'value': GymDotsDex
                    }, {
                        'strText': strText,
                        'value': GymDotsStr
                    }];
                    var largest = [[{
                        'value': 0
                    },]];
                    arr.forEach(function(element,i) {
                        if (element.value > largest[0][0].value) {
                            largest = [[element,i]];
                        }
                        else if (element.value == largest[0][0].value) {
                            largest.push([element,i]);
                        }
                    });
                    largest.forEach(function(e) {
                        let i=e[1];
                        e=e[0];
                        var x = Object.keys(e)[0];
                        arr[i][x] = e[x].replaceAll('solid #494949', 'inset lightgreen');
                    });
                  
                  
                    $('#gymroot h3:contains("Strength")').parent().append(arr[3].strText);
                  	$('#gymroot h3:contains("Defense")').parent().append(arr[1].defText);
                    $('#gymroot h3:contains("Speed")').parent().append(arr[0].speText);
                  	$('#gymroot h3:contains("Dexterity")').parent().append(arr[2].dexText);

                  	// old selection method - stopped working
                    //$(arr[3].strText).insertAfter('#strength-val');
                    //$(arr[1].defText).insertAfter('#defense-val');
                    //$(arr[0].speText).insertAfter('#speed-val');
                    //$(arr[2].dexText).insertAfter('#dexterity-val');
                });
            }).catch((error) => {
                console.error('Error:', error);
                //still needs error handeling
            });
        }
    }

    function manualEstimator(){
        let tempID = ($('#gymroot').length) ? '#gymroot' : '#mainContainer';
        $(tempID).prepend(`
<div id="customEstimate" class="tutorial-cont m-top10">
<div class="title-gray top-round" role="heading" aria-level="5">
<span>Custom Estimation</span>
</div>
<div class="tutorial-desc bottom-round cont-gray p10" tabindex="0">
<p>Happy: <input id="happy" type="number" class="input___2D0YE" required> Energy: <input type="number" id="energy" class="input___2D0YE" required></p>
<p>Gym: <select id="gyms">
<option>Premier Fitness</option><option>Average Joes</option><option>Woody's Workout</option><option>Beach Bods</option><option>Silver Gym</option><option>Pour Femme</option><option>Davies Den</option><option>Global Gym</option><option>Knuckle Heads</option><option>Pioneer Fitness</option><option>Anabolic Anomalies</option><option>Core</option><option>Racing Fitness</option><option>Complete Cardio</option><option>Legs Bums and Tums</option><option>Deep Burn</option><option>Apollo Gym</option><option>Gun Shop</option><option>Force Training</option><option>Cha Cha's</option><option>Atlas</option><option>Last Round</option><option>The Edge</option><option>George's</option><option>Balboas Gym</option><option>Frontline Fitness</option><option>Gym </option><option>Mr Isoyamas</option><option>Total Rebound</option><option>Elites</option><option>Sports Science Lab</option>
</select></p>
<p>speed: <input id="spe" type="number" class="input___2D0YE" required> str: <input id="str" type="number" class="input___2D0YE" required> dex: <input id="dex" type="number" class="input___2D0YE" required> def: <input id="def" type="number" class="input___2D0YE" required>
<p><button id="estimateButton">calculate</button>
</div>
</div>`);
        $('#customEstimate').hide();
        $('#skip-to-content').css({
            color: 'green',
            cursor: 'pointer'
        });
        $('#skip-to-content').on('click', function() {
            $('#customEstimate').toggle("slide", {
                direction: "right"
            }, 500);
        });
        $('#estimateButton').on('click', function() {
            let energy = $('#energy').val();
            let happy = $('#happy').val();
            let gym = $('#gyms option:selected').text();
            let gymThis = Gymlist2.filter(function(g) {
                return g.Gym == gym
            });
            let modifierStr = 1;
            let modifierSpe = 1;
            let modifierDef = 1;
            let modifierDex = 1;
            speed = parseInt($('#spe').val());
            defense = parseInt($('#def').val());
            dexterity = parseInt($('#dex').val());
            strength = parseInt($('#str').val());
            let GymDotsSpe = gymThis[0].Spe;
            let GymDotsDef = gymThis[0].Def;
            let GymDotsDex = gymThis[0].Dex;
            let GymDotsStr = gymThis[0].Str;
            var EnergyPerTrain = gymThis[0].Energy;
            let trains = parseInt(energy / EnergyPerTrain);
            let gainSpe = calculateTotal(speed,happy,GymDotsSpe,EnergyPerTrain,modifierSpe,'spe',trains);
            let gainDef = calculateTotal(defense,happy,GymDotsDef,EnergyPerTrain,modifierDef,'def',trains);
            let gainDex = calculateTotal(dexterity,happy,GymDotsDex,EnergyPerTrain,modifierDex,'dex',trains);
            let gainStr = calculateTotal(strength,happy,GymDotsStr,EnergyPerTrain,modifierStr,'str',trains);
            console.table({
                Str: gainStr[1],
                Dex: gainDex[1],
                Def: gainDef[1],
                Spe: gainSpe[1]
            });
            alert(`\n
            speed: ${gainSpe[0]} Total:${gainSpe[1]}\n
            defense: ${gainDef[0]} Total:${gainDef[1]}\n
            dexterity: ${gainDex[0]} Total:${gainDex[1]}\n
            strength: ${gainStr[0]} Total:${gainStr[1]}`
                 );
        });
    }

})();

function calculateTotal(stat,happy,dots,energyP,perks,typ,trains){
    let S = stat;
  	if (S > 5e7) S = 5e7 + (S - 5e7) / (8.77635 * Math.log(S));
    let H = happy;
    let [A,B,C] = {str:[1600,1700,700],spe:[1600,2000,1350],dex:[1800,1500,1000],def:[2100,-600,1500]}[typ];
  	
    let result = (S * ROUND(1 + 0.07 * ROUND(Math.log(1+H/250),4),4) + 8 * H**1.05 + (1-(H/99999)**2) * A + B) * (1/200000) * dots * energyP * perks;
    
    let total = 0;
    for(let i=0;i<trains;i++){
      	S = stat+total;
      	if (S > 5e7) S = 5e7 + (S - 5e7) / (8.77635 * Math.log(S));
        total += (S * ROUND(1 + 0.07 * ROUND(Math.log(1+H/250),4),4) + 8 * H**1.05 + (1-(H/99999)**2) * A + B) * (1/200000) * dots * energyP * perks;
        let dH = ROUND(energyP/2, 0);
        H-=dH;
    }
    return [result,total];
}

function ROUND(num,places) {
    return +(Math.round(num + "e+" + places) + "e-" + places);
}

function handleErrorCode(errorObj){

    switch(errorObj.code){
        case 2:
            //Incorrect Key
            poppupMesage("Did you reset your apiKey? Please insert your API key in order to use gymtorngains:", "apikey");

            break;
        case 5:
            //Too many requests
            var time = new Date();
            time.setMinutes(time.getMinutes() + 5);
            document.cookie = "GTGdisabled=true; expires=" + time;
        		poppupMesage("Too many request, wait 5 minutes: until " +time, "warning");

            break;
        case 14:
            //Daily read limit reached
            var tomorrow = new Date();
            tomorrow.setDate(new Date().getDate()+1);
            tomorrow.setHours(0,0,0,0);
            document.cookie = "GTGdisabled=true; expires=" + tomorrow;
						poppupMesage("Hit daily api limit, wait until tomorrow: until "+tomorrow, "warning");

            break;
        default:
            console.error(errorObj.error);
    }

}

function poppupMesage(message, poppupType){
    // poppup message to inform you on setting api key
    var span = document.createElement('span');
    span.onclick = function () {
        this.parentElement.parentElement.removeChild(this.parentElement);
    };
    span.innerHTML = '&times;';
    span.style = "margin-left: 25px;color:white;font-weight:bold;\nfloat: right;font-size:30px;line-height:20px;cursor:pointer;";

    var child = document.createElement('div');
    child.style = "z-index:999999;width:100%;height:auto;position:fixed;top:0px;\ntext-align:center;background-color:#5D3A9B;color:rgb(185,166,45);padding-bottom:1%;padding-top:1%;";
    child.innerHTML = message + '\n';
  	
    var input = document.createElement('input');
    
    var button = document.createElement('button');
    button.style = 'background-color:black; color:white;';
    button.innerHTML = "submit";
  	if (poppupType== "apikey"){
      child.append(input);
      child.append(button);
      
    }
    
    child.appendChild(span);
    document.body.appendChild(child);

    button.onclick = function(e) {
        window.localStorage.enXrayApiKey = en_de_code(input.value,playerId,0);
        window.location.href = window.location.href;
    }

}