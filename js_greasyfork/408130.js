// ==UserScript==
// @name         DiceCloud Extender
// @namespace    https://ofdiceandmagic.com/
// @version      1
// @description  Adds additional capabilities to Dicecloud, like rest functions. Coming soon: dice roller, automatic color coding for spell descriptions, spell and preview on hover.
// @author       atill91
// @match        https://dicecloud.com/character/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408130/DiceCloud%20Extender.user.js
// @updateURL https://update.greasyfork.org/scripts/408130/DiceCloud%20Extender.meta.js
// ==/UserScript==


$.noConflict();
jQuery(document).ready(function($){
    'use strict';




    //DISPLAY DCE MESSAGE
    function dcemessage(title,text){
        $("#DCEmessage p").html("<b>"+title+":</b> "+text);
        $("#DCEmessage").fadeIn(800);
    }


    //CONTAINS FUNCTION...finds all elements that contain the text
    //...returns the elements selected not their children
    function contains(selector, text) {
          let elements = document.querySelectorAll(selector);
          return Array.prototype.filter.call(elements, function(element){
            return RegExp(text).test(element.textContent);
          });
        }

    //DICE ROLLER
    //the codepen... https://codepen.io/Atill91/pen/bGEJpJJ?editors=0100

    //function to roll one type of dice
    function roll(numdice,sides,mod) {
        let a = Array(numdice);
        for (let i = 0; i < numdice; i++){
            a[i] = Math.floor(Math.random() * sides) + 1;
        }
        let add = (a, b) => a + b; // function for adding two numbers.
        let result = a.reduce(add); // use reduce to sum the array
        let modifier = mod || 0;
        return result+modifier;
    }

    //function to extract data from standard dice format text
    function extractdice(text){
        let str = text;
        //define result obj
        let result = {
            fullText: str,
            dice: [],
            plusOminus: [],
            numdice: [],
            sides: [],
            mods: [],
            modsTotal: 0, //this will be used later after we call this funciton
            total: 0 //so will this
        }
        const diceExp = /([\+\-]?)(\d+)d(\d+)/gi;
        const modsExp = /([\+\-](\d+)(?!d))/gi;
        //save the diceExp search as an array...also modsExp
        let dice = str.match(diceExp);
        //extract data from dice and save to result obj
        dice.forEach(function(item, i, arr){
            let die = diceExp.exec(item);
            diceExp.lastIndex = 0; //reset search index to perform a second search starting from the beginning. Without this diceExp.exec(item) returns null on the second iteration.
            result.dice = die[0];
            if (die[1] == ""){ result.plusOminus[i] = "+"; }else{ result.plusOminus[i] = die[1]; }
            result.numdice[i] = parseInt(die[2]);
            result.sides[i] = parseInt(die[3]);
        });
        //save mods to result obj
        let mods = str.match(modsExp) || 0; //sets mods to 0 if there are no matches
        if(mods != 0){
            mods.forEach(function(item,i,arr){
                result.mods[i] = parseInt(mods[i]);
            });
        } else{result.mods = 0;}

        return result

    }

    let dicerolltotal = "";
    function displaydice(text){
        let $str = text;
        let dicedata = extractdice($str);
        //roll all the dice and add the total
        dicedata.numdice.forEach(function(item,i,arr){
            let rollresult = parseInt(dicedata.plusOminus[i] + roll(dicedata.numdice[i],dicedata.sides[i]));
            dicedata.total = dicedata.total + rollresult;
        });
        //sum the mods and add it to the total
        if (dicedata.mods != 0){
            let add = (a, b) => a + b;
            let sum = dicedata.mods.reduce(add);
            dicedata.modsTotal = sum;
        }

        dicedata.total = dicedata.total + dicedata.modsTotal;

        dicerolltotal = dicedata.total;

        //add a new paragraph to the container with the result
        let resultText = dicedata.fullText+" = "+"<b>"+dicedata.total+"</b>";
        $("#DCEdicerollerResultContainer").append("<p class='DCEdicerollerResult'>"+resultText+"</p>");

        //scroll the result container to the bottom
        $("#DCEdicerollerResultContainer").animate({ scrollTop: $("#DCEdicerollerResultContainer").prop("scrollHeight")}, 10);

        //show the dice result flash
        $("#DCEdiceresultflash p").html(dicedata.total);
        $("#DCEdiceresultflash").stop(true,true).fadeIn(400).delay(3000).fadeOut(400); //stop() stops the currently running animation

    }//end diceroll()


    //STYLES
    const styles = document.createElement("style");
    styles.innerHTML = `
        #DCEbox{
            width : 256px;
            height : 96px;
            position : absolute;
            top : 50px;
            left : 0;
        }

        #DCE-ShortRest-button{
            position : absolute;
            top : 5px;
            left : 20px;
        }

        #DCE-ShortRest-check{
            color : #76ff76;
            display : none;
            position : absolute;
            top : 7px;
            left : 2px;
        }

        #DCE-LongRest-button{
            position : absolute;
            top : 30px;
            left : 20px;
        }

        #DCE-LongRest-check{
            color : #76ff76;
            display : none;
            position : absolute;
            top : 32px;
            left : 2px;
        }

        #DCE-dawn-button{
            position : absolute;
            top : 55px;
            left : 20px;
        }

        #DCE-dawncheck-check{
            color : #76ff76;
            display : none;
            position : absolute;
            top : 57px;
            left : 2px;
        }

        #DCEmessage{
            background : #5fb962;
            width : 100%;
            height : 100%;
            position : absolute;
            box-shadow : 0 0 8px inset;
            top : 0;
            left : 0;
            display : none;
            z-index : 1;
        }

        #DCEmessage p{
            padding : 0 8px;
            width : calc(100% - 20px);
            color : #ccf2e3;
            margin : 2px;
        }

        #DCEmessagex{
            position : absolute;
            top : 0;
            right : 0;
            margin : 5px 5px 0 0;
            font-size : 1.3em;
            cursor : pointer;
        }

        #DCEdiceroller{
            width : 150px;
            height : 100%;
            position : absolute;
            top : 0;
            right : 0;
            box-shadow: inset 1px 6px 9px -6px black;
        }

        #DCEdicerollerResultContainer{
            width : 100%;
            overflow-y : scroll;
            overflow-x : hidden;
            height : calc(100% - 1.2em);
        }

        .DCEdicerollerResult{
            color: #ccc;
            margin: 0.25em 2px;
            text-align: center;
        }
        .DCEdicerollerResult:last-child{
            color: #fff;
        }
        .DCEdicerollerResult:last-child b{
            font-size: 1.2em;
        }

        #DCEdicerollerinput{
            width : 100%;
            position : absolute;
            bottom : 0;
            text-align : center;
        }

        #DCEdicerollerQ{
            position : absolute;
            top : 2px;
            left : 2px;
            color : #ccc;
            cursor : pointer;
        }
        #DCEdicerollerQ:hover{
            color: #fff;
        }
        #DCEdiceresultflash{
            background: #4caf50;
            width: 100px;
            height: 100px;
            position: fixed;
            top: 10px;
            left: calc(50% - 25px + 255.996px/2);
            border-radius: 8px;
            box-shadow: 0 0 8px inset #a4d7a6;
            border-bottom: 5px solid rgb(0 0 0 / 50%);
            display:none;
        }
        #DCEdiceresultflash p{
            text-align:center;
            margin-top: .5em;
            font-size: 40px;
            color: #eee;
        }

        .paper-font-subhead.modifier:hover,
        .skill-mod:hover,
        #tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(9) > paper-material > div.numbers.paper-font-display1 > div:hover,
        #tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(10) > paper-material > div.numbers.paper-font-display1:hover
        {
            color:white;
            background: #4caf50;
            border-radius:8px;
            box-shadow: 0 0 8px inset #a4d7a6;
            font-size: 1.2em;
        }
        .DCEatkhit:hover{
            color:white;
            background: #4caf50;
            border-radius:8px;
            box-shadow: 0 0 8px inset #a4d7a6;
        }
        .DCEatkdam:hover{
            color:white;
            background: #d13b2e;
            border-radius:8px;
            box-shadow: 0 0 8px inset #e79992;
        }
    `;
    document.head.appendChild(styles);





    //ADD ELEMENTS TO PAGE

    //add font awesome to head (used for checkmarks)
    const fascript = document.createElement('script');
    fascript.type = 'text/javascript';
    fascript.src = 'https://kit.fontawesome.com/a0a5cdaf04.js';
    document.head.appendChild(fascript);

    //add Overlay Scrollbars to head
    const overlayscrollbarsLink = document.createElement("link");
    overlayscrollbarsLink.rel = "stylesheet";
    overlayscrollbarsLink.href = "https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.12.0/css/OverlayScrollbars.min.css";
    document.head.appendChild(overlayscrollbarsLink);
    const overlayscrollbarsScript = document.createElement("script");
    overlayscrollbarsScript.type = "text/javascript";
    overlayscrollbarsScript.src = "https://cdnjs.cloudflare.com/ajax/libs/overlayscrollbars/1.12.0/js/jquery.overlayScrollbars.min.js";
    document.head.appendChild(overlayscrollbarsScript);

    //Add DiceCloud Extender box and buttons and such
    const sidebarnav = document.querySelector("#accountSummary");
    const DCEbox = document.createElement("div");
    DCEbox.id = "DCEbox";
    sidebarnav.appendChild(DCEbox);

    const DCEmenu = document.querySelector("#DCEbox");

    const shortrestButton = document.createElement("button");
    shortrestButton.id = "DCE-ShortRest-button";
    shortrestButton.type = "button";
    shortrestButton.textContent = "Short Rest";
    DCEmenu.appendChild(shortrestButton);

    const shortrestcheck = document.createElement("i");
    shortrestcheck.id = "DCE-ShortRest-check";
    shortrestcheck.classList.add("fas", "fa-check-circle");
    DCEmenu.appendChild(shortrestcheck);

    const longrestButton = document.createElement("button");
    longrestButton.id = "DCE-LongRest-button";
    longrestButton.type = "button";
    longrestButton.textContent = "Long Rest";
    DCEmenu.appendChild(longrestButton);

    const longrestcheck = document.createElement("i");
    longrestcheck.id = "DCE-LongRest-check";
    longrestcheck.classList.add("fas", "fa-check-circle");
    DCEmenu.appendChild(longrestcheck);

    const dawnButton = document.createElement("button");
    dawnButton.id = "DCE-dawn-button";
    dawnButton.type = "button";
    dawnButton.textContent = "Dawn";
    DCEmenu.appendChild(dawnButton);

    const dawncheck = document.createElement("i");
    dawncheck.id = "DCE-dawncheck-check";
    dawncheck.classList.add("fas", "fa-check-circle");
    DCEmenu.appendChild(dawncheck);

    const DCEmessage = document.createElement("div");
    DCEmessage.id = "DCEmessage";
    DCEmenu.appendChild(DCEmessage);
    const DCEmessageP = document.createElement("p");
    document.querySelector("#DCEmessage").appendChild(DCEmessageP);
    const DCEmessagex = document.createElement("i");
    DCEmessagex.id = "DCEmessagex";
    DCEmessagex.classList.add("fas", "fa-times");
    document.querySelector("#DCEmessage").appendChild(DCEmessagex);
    $("#DCEmessagex").click(function(){
        $("#DCEmessage").fadeOut(800);
    });

    const DCEdiceroller = document.createElement("div");
    DCEdiceroller.id = "DCEdiceroller";
    document.querySelector("#DCEbox").appendChild(DCEdiceroller);
    const DCEdicerollerResultContainer = document.createElement("div");
    DCEdicerollerResultContainer.id = "DCEdicerollerResultContainer";
    document.querySelector("#DCEdiceroller").appendChild(DCEdicerollerResultContainer);
    const DCEdicerollerinput = document.createElement("input");
    DCEdicerollerinput.id = "DCEdicerollerinput";
    DCEdicerollerinput.type = "text";
    DCEdicerollerinput.value = "1d20";
    document.querySelector("#DCEdiceroller").appendChild(DCEdicerollerinput);
    //roll the dice and show the result when the user hits enter in the input
    $("#DCEdicerollerinput").keypress(function(e) {
        if(e.which == 13) { //13 is the enter key
            displaydice( $("#DCEdicerollerinput").val() );
        }
    });
    const DCEdicerollerQ = document.createElement("i");
    DCEdicerollerQ.id = "DCEdicerollerQ";
    DCEdicerollerQ.classList.add("fas", "fa-info-circle");
    document.querySelector("#DCEdiceroller").appendChild(DCEdicerollerQ);
    $("#DCEdicerollerQ").click(function(){
        dcemessage("DCE Dice Roller","Type a dice formula (no spaces) and hit enter to display the result. Only + and - are supported at this time.");
    });
    const diceresultflash = document.createElement("div");
    diceresultflash.id = "DCEdiceresultflash";
    document.querySelector("body").appendChild(diceresultflash);
    const diceresultflashP = document.createElement("p");
    document.querySelector("#DCEdiceresultflash").appendChild(diceresultflashP);



    //STAT ROLLS
    //Whenever you click any of the following, roll it: abilities, skills, saving throws, initiative, proficiency bonus.

    //define variables and assign click event to each
    const statrollsInterval = setInterval(function(){
        const strnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(1) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const dexnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(2) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const connum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(3) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const intnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(4) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const wisnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(5) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const chanum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(6) > paper-material > div.numbers > div.paper-font-subhead.modifier");
        const initnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(9) > paper-material > div.numbers.paper-font-display1 > div");
        const profnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(10) > paper-material > div.numbers.paper-font-display1");
        const strsavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(1) > div > div.skill-mod");
        const dexsavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(2) > div > div.skill-mod");
        const consavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(3) > div > div.skill-mod");
        const intsavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(4) > div > div.skill-mod");
        const wissavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(5) > div > div.skill-mod");
        const chasavenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(12) > paper-material > div.bottom.list > div:nth-child(6) > div > div.skill-mod");
        const acrobaticsnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(1) > div > div.skill-mod");
        const animalhandlingnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(2) > div > div.skill-mod");
        const arcananum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(3) > div > div.skill-mod");
        const athleticsnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(4) > div > div.skill-mod");
        const deceptionnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(5) > div > div.skill-mod");
        const historynum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(6) > div > div.skill-mod");
        const insightnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(7) > div > div.skill-mod");
        const intimidationnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(8) > div > div.skill-mod");
        const investigationnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(9) > div > div.skill-mod");
        const medicinenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(10) > div > div.skill-mod");
        const naturenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(11) > div > div.skill-mod");
        const perceptionnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(12) > div > div.skill-mod");
        const performancenum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(13) > div > div.skill-mod");
        const persuasionnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(14) > div > div.skill-mod");
        const religionnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(15) > div > div.skill-mod");
        const sleightofhandnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(16) > div > div.skill-mod");
        const stealthnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(17) > div > div.skill-mod");
        const survivalnum = document.querySelector("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(14) > paper-material > div.bottom.list > div:nth-child(18) > div > div.skill-mod");

        //define an array of all the above vars we want to click
        const numstoclick = [strnum,dexnum,connum,intnum,wisnum,chanum,initnum,profnum,strsavenum,dexsavenum,consavenum,intsavenum,wissavenum,chasavenum,acrobaticsnum,animalhandlingnum,arcananum,athleticsnum,deceptionnum,historynum,insightnum,intimidationnum,investigationnum,medicinenum,naturenum,perceptionnum,performancenum,persuasionnum,religionnum,sleightofhandnum,stealthnum,survivalnum];

        //loop through the array and assign an onclick event to each element in the numstoclick array. Get the element's text (parse it) and roll the dice onclick.
        numstoclick.forEach(function(val){
            val.addEventListener("click",function(e){
                let mod = parseInt( val.textContent );
                let dicetxt = "1d20+"+mod;
                displaydice(dicetxt);

                e.stopPropagation(); //needed to stop the card from expanding. Must be placed at the end of the function.
            });
        });//forEach end

        //ATTACK ROLLS
        const featurestab = document.querySelector("#tabsContent > paper-tab:nth-child(3)");

        //when the features tab is clicked, define atkhits and atkdams.
        //...then when each atkhit is clicked, check if it's a number.
        //...if so, roll the dice.

        featurestab.addEventListener('click',function(){
            const featurestabwait = setTimeout(function(){
                const atkhits = document.querySelectorAll("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.animation-slider > div:nth-child(1) > paper-material > div.bottom.list > div > div > div > div.paper-font-headline.layout.horizontal.center");
                const atkdams = document.querySelectorAll("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.animation-slider > div:nth-child(1) > paper-material > div.bottom.list > div > div > div > div.flex.layout.vertical > div:nth-child(2)");

                for (let i=0; i<atkhits.length; i++){
                    let mod = parseInt(atkhits[i].textContent);
                    if (isNaN(mod)){
                        console.log("mod ( "+atkhits[i].textContent+" ) isn't a number");
                    } else{
                        atkhits[i].addEventListener('click',function(e){
                            let dicetxt = "1d20+"+mod;
                            displaydice(dicetxt);

                            e.stopPropagation();
                        });//atkhit click end
                        atkhits[i].classList.add('DCEatkhit');
                    }

                    //testing the regex... https://regex101.com/r/GFABKl/1
                    let damtxt = atkdams[i].textContent;
                    let dicetxtregex = /([\+\-]?)(\d+)d(\d+)([\+\-]?)(\d+)?(d(\d+))?([\+\-]?)(\d+)?(d(\d+))?([\+\-]?)(\d+)?(d(\d+))?/gi ;
                    let damdice = damtxt.match(dicetxtregex);
                    if (damdice && damdice.length){ //if it found dicetxt, add the click event
                         atkdams[i].addEventListener('click',function(e){
                             let dicetxt = damdice[0];
                             displaydice(dicetxt);
                             e.stopPropagation();
                         });
                        atkdams[i].classList.add('DCEatkdam');
                    } else{ console.log("no dicetxt found in damtxt"); }
                }//loop end
            },100);
        });//featurestab click end






        //check if the stats were saved to the numstoclick array (if not, they weren't loaded yet so we want the interval to keep running).
        if (numstoclick != null){
            clearInterval(statrollsInterval);
        }

    },100);//setInterval end.




    //RESTROLL FORMULA
    function restroll(searchtxt){
        //Rest=Short=Roll[dice text]
        let dicetxtregex = /([\+\-]?)(\d+)d(\d+)([\+\-]?)(\d+)?(d(\d+))?([\+\-]?)(\d+)?(d(\d+))?([\+\-]?)(\d+)?(d(\d+))?/gi ;
        let dicetxtps = contains("paper-material.featureCard > div.bottom.flex > p",searchtxt);
        console.log("dicetxtps = "+dicetxtps+". dicetxtps[0] = "+dicetxtps[0]);
        if(!dicetxtps[0]){return;} //if no p's with searchtxt are found, exit the function
        let i = dicetxtps.length - 1;
        let interval = setInterval(function(){
             //get the dicetxt and roll the dice
            let dicetxt = dicetxtps[i].textContent.match(dicetxtregex)[0];
            displaydice(dicetxt);
            //get the current(old) value of its uses...
            let usestxt = dicetxtps[i].parentNode.parentNode.firstElementChild.firstElementChild.nextElementSibling;
            let olduses = /(\d+)\/(\d+)/g.exec(usestxt.textContent)[1];
            //click the reset button
            let resetbtn = dicetxtps[i].parentNode.nextElementSibling.lastElementChild;
            $(resetbtn).trigger("click");
            //click use btn it a number of times = old value + the roll
            let usebtn = dicetxtps[i].parentNode.nextElementSibling.firstElementChild;
            //If the old value + the roll = current value or if the old value + the roll = the max uses, clear the subinterval
            // else click the use button
            let subinterval = setInterval(function(){
                let theroll = dicerolltotal;
                let currentuses = /(\d+)\/(\d+)/g.exec(usestxt.textContent)[1];
                let maxuses = /(\d+)\/(\d+)/g.exec(usestxt.textContent)[2];
                let newuses = parseInt(olduses) + parseInt(theroll);
                if(newuses == parseInt(currentuses) || newuses >= parseInt(maxuses)){
                    clearInterval(subinterval);
                }else{
                    $(usebtn).trigger("click");
                }
            },10);
            i--;
            if(i < 0){ clearInterval(interval); }
        },100);
    }//function end





    //LONG REST
    document.querySelector('#DCE-LongRest-button').onclick = function(){
        //Reset all feature cards containing the text  Rest=Long, Rest=Long=Roll, Rest=Short, and Rest=Short=Roll
        $("paper-material.card:contains('Rest=Long') paper-button:contains('Reset')").trigger("click");
        restroll("Rest=Long=Roll");
        $("paper-material.card:contains('Rest=Short') paper-button:contains('Reset')").trigger("click");
        restroll("Rest=Short=Roll");

        /*
        //Hit Points
        //not working as of now
        const $hpinput = $("#hitPointSlider").children(":nth-child(2)").children(":first").children(":nth-child(2)").children(":first").children(":nth-child(2)"); //for the label, change last :second to first
        let $hpmax = $hpinput.attr("max");
        console.log("id="+$hpinput.attr("id")+". $hpmax="+$hpmax);
        $hpinput.val("999");
        */


        //Hit Dice... this doesn't work if you have multiple types of hit dice.
        const $uparrow = $("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(11) > paper-material > div.left.green.paper-font-display1.white-text.layout.horizontal > div:nth-child(1) > paper-icon-button.resourceUp.x-scope.paper-icon-button-0");
        const $hd = $("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(11) > paper-material > div.left.green.paper-font-display1.white-text.layout.horizontal > div.resourceValue.layout.vertical.center > div:nth-child(1)");
        let $oldhd = parseInt($hd.text());
        let interval = setInterval (function(){   //this must be set as a variable. every 10ms, it clicks the up arrow if it isn't disabled. if it is it cancels the interval, which ends the clicking.
            if ($uparrow.attr("aria-disabled") == "false"){
                $uparrow.trigger("click");
            } else{
                clearInterval(interval);
                //now the hit dice are set to the max, which we don't want.
                //we need to click the down arrow until we get to a number = $oldhd + $maxhd*0.5. We'll use another interval to do this.
                let $downarrow = $("#tabPages > div.tab-page.fit.iron-selected > div > div.column-container.thin-columns > div:nth-child(11) > paper-material > div.left.green.paper-font-display1.white-text.layout.horizontal > div:nth-child(1) > paper-icon-button.resourceDown.x-scope.paper-icon-button-0");
                let $maxhd = parseInt($hd.text());
                let $newhd = Math.floor( $maxhd*0.5 + $oldhd );
                if ($newhd >= $maxhd) $newhd = $maxhd;
                let subinterval = setInterval (function(){
                  if (parseInt($hd.text()) != $newhd){
                    $downarrow.trigger("click");
                  } else {
                      clearInterval(subinterval);
                  }
                },10);
            }
        },10);

        dcemessage("DCE Long Rest","HP and Spell Slots need to be manually reset for now.");

        //fade in the checkmark
        $("#DCE-LongRest-check").fadeToggle(800).delay(3000).fadeToggle(800);
    };

    //SHORT REST
    document.querySelector('#DCE-ShortRest-button').onclick = function(){
        restroll("Rest=Short=Roll");

        $("paper-material.card:contains('Rest=Short') paper-button:contains('Reset')").trigger("click");

        $("#DCE-ShortRest-check").fadeToggle(800).delay(3000).fadeToggle(800);
    };

    //DAWN (this is for all of the x/day features)
    document.querySelector('#DCE-dawn-button').onclick = function(){

        restroll("Dawn=Roll");

        //Dawn=Full
        $("paper-material.card:contains('Dawn=Full') paper-button:contains('Reset')").trigger("click");

        //checkmark
        $("#DCE-dawncheck-check").fadeToggle(800).delay(3000).fadeToggle(800);
    };

});//documentready end
