// ==UserScript==
// @name         Calculate exp from exp
// @namespace    http://tampermonkey.net/
// @version      1.04
// @description  If you think which expedition give you the most exp. Use it.
// @author       Artemis
// @include      https://*.bloodwars.*
// @downloadURL https://update.greasyfork.org/scripts/418367/Calculate%20exp%20from%20exp.user.js
// @updateURL https://update.greasyfork.org/scripts/418367/Calculate%20exp%20from%20exp.meta.js
// ==/UserScript==

(function useMe() {
    function sleep(ms) {
   return new Promise(resolve => setTimeout(resolve, ms));
}
    //Initialize li item with eventListener
    initialize();
    async function initialize(){
    let link = document.createElement("li");
    link.setAttribute("calss","menu") ;
    let linkName = document.createElement("span");
    linkName.textContent="Exp Calculator";
    link.appendChild(linkName);
    //let lastmenuitem = document.getElementsByTagName("li"); querySelectorAll
    let lastmenuitem = document.querySelectorAll("li.menu");
    lastmenuitem = lastmenuitem[lastmenuitem.length-6];
    lastmenuitem.parentNode.insertBefore(link, lastmenuitem);
    link.addEventListener("click", CreateWindow);
    }
//Creating a white window overlay BW site.
    async function CreateWindow(){
        //create white window
    let overlayWindow = document.createElement("div");
    overlayWindow.setAttribute("id","overlayWin");
    overlayWindow.style.width="384px";
    overlayWindow.style.height="480px";
    overlayWindow.style.backgroundColor="white";
    overlayWindow.style.position = "absolute";
        overlayWindow.style.top="5%";
         overlayWindow.style.left="40%";
        overlayWindow.style.zIndex = "999999999";
//create level label
        let levelLabel = document.createElement("Label");
        levelLabel.innerHTML = "Twój poziom: <br>";
        levelLabel.style.color="black";
        levelLabel.style.fontSize="15px";
        overlayWindow.appendChild(levelLabel);

//create levelInput
        let levelInput = document.createElement("Input");
        levelInput.id="myLvl";
        levelInput.setAttribute("type", "number");
        levelInput.setAttribute("value", "100");
        overlayWindow.appendChild(levelInput);

//create sumLevel label
        let sumLabel = document.createElement("Label");
        sumLabel.innerHTML = "<br>Suma poziomów uczestników: <br>";
        sumLabel.style.color="black";
        sumLabel.style.fontSize="15px";
        overlayWindow.appendChild(sumLabel);

//create sumLevelInput
        let sumLvl = document.createElement("Input");
        sumLvl.id="sumLvl";
        sumLvl.setAttribute("type", "number");
        sumLvl.setAttribute("value", "100");
        overlayWindow.appendChild(sumLvl);


//create TwojAkt label
        let ActLabel = document.createElement("Label");
        ActLabel.innerHTML = "<br>Twój akt: <br>";
        ActLabel.style.color="black";
        ActLabel.style.fontSize="15px";
        overlayWindow.appendChild(ActLabel);

//create sumLevelInput
        let Act = document.createElement("Input");
        Act.id="act";
        Act.setAttribute("type", "number");
        Act.setAttribute("value", "3");
        Act.min="1";
        Act.max="3";
        overlayWindow.appendChild(Act);

//create expLocation1 label
        let expLocation1Label = document.createElement("Label");
        expLocation1Label.innerHTML = "<br>Wybierz lokację z 1 mapy: <br>";
        expLocation1Label.style.color="black";
        expLocation1Label.style.fontSize="15px";
        overlayWindow.appendChild(expLocation1Label);

//create expLocation1
        let expLocation1Array = ["brak","Biała Wieża","Pustynia Rozpaczy","Pustynia Efermeh","Oaza Gorących Źródeł","Wielki Step","Złota Wieża","Palec Diabła","Pustynia Efermeh II","Kamienne Bagna","Pajęcza Przepaść","Wielki Step II","Góry Mądrości","Skorupia Pustynia","Góry Przemiany","Świątynia Śmierci","Pole Wielu Kości","Talerz Kronosa"];
        let expLocation1 = document.createElement("select");
        expLocation1.id="expLocation1id";

        for (var i = 0; i < expLocation1Array.length; i++) {
            var option = document.createElement("option");
            //option.value = expLocation1Array[i];
            option.text = expLocation1Array[i];
            expLocation1.appendChild(option);
        }
        overlayWindow.appendChild(expLocation1);

//create expLocation2 label
        let expLocation2Label = document.createElement("Label");
        expLocation2Label.innerHTML = "<br>Wybierz lokację z 2 mapy: <br>";
        expLocation2Label.style.color="black";
        expLocation2Label.style.fontSize="15px";
        overlayWindow.appendChild(expLocation2Label);
//create expLocation2
        let expLocation2Array = ["brak","Pole lawy","Kanały","Torturownica","Szlak zabójców","Tajemniczy artefakt","Robacze gniazdo","Wielka siekaczka","Cmentarz niewiernych","Szubieniczne drzewo","Jezioro topielców","Spalona biblioteka","Obelisk","Sala przemienionych","Ziemia pokryta wrzodami","Duma obrońców","Ostatni bastion","Portal"]
        let expLocation2 = document.createElement("select");
        expLocation2.id="expLocation2id";

        for (var j = 0; j < expLocation2Array.length; j++) {
            var option2 = document.createElement("option");
            //option.value = expLocation1Array[i];
            option2.text = expLocation2Array[j];
            expLocation2.appendChild(option2);
        }
        overlayWindow.appendChild(expLocation2);
//create evo potega label
        let potegaEvoLabel = document.createElement("Label");
        potegaEvoLabel.innerHTML = "<br>Poziom evolucji Potęga: <br>";
        potegaEvoLabel.style.color="black";
        potegaEvoLabel.style.fontSize="15px";
        overlayWindow.appendChild(potegaEvoLabel);

//create potegaEvoInput
        let potegaEvo = document.createElement("Input");
        potegaEvo.id="potegaEvoId";
        potegaEvo.setAttribute("type", "number");
        potegaEvo.setAttribute("value", "0");
        potegaEvo.min="0";
        potegaEvo.max="5";
        overlayWindow.appendChild(potegaEvo);

//create erudyta label
        let erudytaLabel = document.createElement("Label");
        erudytaLabel.innerHTML = "<br>Poziom Erudyty: <br>";
        erudytaLabel.style.color="black";
        erudytaLabel.style.fontSize="15px";
        overlayWindow.appendChild(erudytaLabel);

//create erudytaInput
        let erudyta = document.createElement("Input");
        erudyta.id="erudytaId";
        erudyta.setAttribute("type", "number");
        erudyta.setAttribute("value", "0");
        erudyta.min="0";
        erudyta.max="5";
        overlayWindow.appendChild(erudyta);

        //create label (lider)
        let liderLabel = document.createElement("Label");
        liderLabel.innerHTML = "<br>Zaznacz, jeśli lider: ";
        liderLabel.style.color="black";
        liderLabel.style.fontSize="15px";
        overlayWindow.appendChild(liderLabel);

        //create lider checkbox
        let liderCheckbox = document.createElement("Input");
        liderCheckbox.setAttribute("type", "checkbox");
        liderCheckbox.id="liderCheckboxId";
        overlayWindow.appendChild(liderCheckbox);
//create button to calculate
        let br = document.createElement("br")
        let calculate = document.createElement("Button");
        calculate.innerHTML="Oblicz";
        calculate.addEventListener("click",calculateExp);
        overlayWindow.appendChild(br);
        overlayWindow.appendChild(calculate);

    document.body.appendChild(overlayWindow);
    }
    async function calculateExp(){
    let minHPArray = [0,1000,2000,3725,4753,6083,5600,7800,8000,9800,12900,11900,16800,22000,26400,59700,74300,95000];
    let maxHPArray = [0,2000,3500,5590,6603,8071,10350,12100,13400,16900,19400,24000,27800,33800,55300,75000,95000,148300];
    let minHPArray2 = [0,8500,12050,21250,27750,52500,80375,104260,142572, 184455,227500,275000,320400,380534,402000,802910,1000000,1306667];
    let maxHPArray2 = [0,11440,14450,25000,36750,76728,110000,130000,170000,250000,300000,339375,377200,412534,520000,1114182,1440000,1476667];
    let minExp=0;
    let maxExp=0;
    let myLvl = document.getElementById("myLvl").value;
    let sumLvl = document.getElementById("sumLvl").value;
    let locationIndex = document.getElementById("expLocation1id").selectedIndex;
    let location2Index = document.getElementById("expLocation2id").selectedIndex;
    let ActMod = [];
    let ActMod2 = [];
        if(locationIndex!=0){
    minExp=myLvl*minHPArray[locationIndex]/sumLvl;
    maxExp=myLvl*maxHPArray[locationIndex]/sumLvl;
        }
        if(location2Index!=0){
            minExp=myLvl*minHPArray2[location2Index]/sumLvl;
            maxExp=myLvl*maxHPArray2[location2Index]/sumLvl;
        }
    if(document.getElementById("act").value==1){
    console.log("Zapierdalaj z tymi aktami wyżej...");
    ActMod = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    ActMod2 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    }
     else if(document.getElementById("act").value==2){
     ActMod = [1,1,1,1,1,1.17,1.24,1.31,1.38,1.45,1.52,1.59,1.66,1.73,1.8,1.87,1.94,2.01];
     ActMod2 = [1,1.17,1.24,1.31,1.38,1.45,1.52,1.59,1.66,1.73,1.8,1.87,1.94,2.01,2.08,2.15,2.22,2.29];
     }
        else {
        ActMod = [1,1,1,1,1,1.17,1.24,1.31,1.38,1.45,1.69,1.83,1.97,2.11,2.25,2.39,2.53,2.67];
        ActMod2 = [1,1.17,1.24,1.31,1.38,1.45,1.69,1.83,1.97,2.11,2.25,2.39,2.53,2.67,2.81,2.95,3.09,3.23];
        }
if(locationIndex!=0){
        minExp=minExp*ActMod[locationIndex];
        maxExp=maxExp*ActMod[locationIndex];
}
if(location2Index!=0){
        minExp=minExp*ActMod2[location2Index];
        maxExp=maxExp*ActMod2[location2Index];
}
        let potegaArray=[0,0.07,0.14,0.20,0.25,0.3];
        let erudytaArray=[0,0.05,0.15,0.25,0.35,0.5];
        let potega=document.getElementById("potegaEvoId").value;
        let erudyta=document.getElementById("erudytaId").value;
        let bonus=potegaArray[potega]+erudytaArray[erudyta]+1;
        if(document.getElementById("liderCheckboxId").checked){
        minExp=minExp*bonus*8;
        maxExp=maxExp*bonus*8;
        }
        else {
        minExp=minExp*bonus*4;
        maxExp=maxExp*bonus*4;
        }

        let overlayWindow = document.getElementById("overlayWin");
        //create erudyta label
        let minExpLabel = document.createElement("Label");
        minExpLabel.innerHTML = "<br>min exp: "+minExp+"<br>";
        minExpLabel.style.color="black";
        minExpLabel.style.fontSize="15px";
        overlayWindow.appendChild(minExpLabel);

        let maxExpLabel = document.createElement("Label");
        maxExpLabel.innerHTML = "<br>max exp: "+maxExp+"<br>";
        maxExpLabel.style.color="black";
        maxExpLabel.style.fontSize="15px";
        overlayWindow.appendChild(maxExpLabel);

    }

})();