// ==UserScript==
// @name         Stake.com HiLo Bot (Beta - Only Payout Button working in Beta)
// @description  Aint got an Stake.com account yet, use my reflink to support my work here:
// @description  https://stake.com/?c=StakeGiveaways
// @description  to run the bot open https://stake.com/casino/games/hilo
// @description  set up amount by hand
// @description  Click button  "Payout" to choose your favourite Cashout-Multiplayer 
// @description  EG enter 5 for 5x multiplayer
// @description  The bot picks the lower payout cart
// @match        https://stake.com/casino/games/hilo
// @version      1.2
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @description  The bot doesnt work on Tablat modus. Settings-dashbord needs to be visible on the left site.
// @downloadURL https://update.greasyfork.org/scripts/418747/Stakecom%20HiLo%20Bot%20%28Beta%20-%20Only%20Payout%20Button%20working%20in%20Beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/418747/Stakecom%20HiLo%20Bot%20%28Beta%20-%20Only%20Payout%20Button%20working%20in%20Beta%29.meta.js
// ==/UserScript==


window.addEventListener('load', function () {
//var b = prompt("Base","0.00000001");
//var z = prompt("Increment");
//var o = prompt("onlose");
var pi = prompt("Pattern");
var pattern = p;
var p = pattern.split(",");
var a = prompt("Startkarte","A");
var pay1 = pay1 ;
var i=0;
var re = new RegExp(a);
setTimeout(function() {
        setTimeout(function(){
        var btnSet1 = document.createElement("button");
        btnSet1.textContent = "Set Base bet";
        btnSet1.id = "Base"
        btnSet1.style.position ="absolute";
        btnSet1.style.backgroundColor="white"
        btnSet1.style.left="0";
        btnSet1.style.display="block";
        btnSet1.gridtemplatecolumns="1fr 1fr";
        btnSet1.gridgap="10px";
        btnSet1.style.padding="10px 24px";
        btnSet1.style.left = "0px";
        btnSet1.style.bottom = "45px";
        btnSet1.style.width="200px";
        btnSet1.style.left = "auto";
        btnSet1.style.fontSize="17px";
        btnSet1.style.zIndex = "auto";
        btnSet1.style.margin="4px 2px";
        btnSet1.style.borderColor="black";
        btnSet1.style.borderRadius="4px";
        btnSet1.style.backgroundColor="white";
        btnSet1.addEventListener("click", function(){
        var b = prompt("Base");
        //setTimeout(function(){
        //document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").value = b ;
        //setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepUp(1);setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepDown(1);},220);},220)
        //},2020);
        },2020)
        document.body.appendChild(btnSet1);
        },2020)

        setTimeout(function(){
        var btnSet2 = document.createElement("button");
        btnSet2.textContent = "Increment";
        btnSet2.id = "Increment"
        btnSet2.style.position ="absolute";
        btnSet2.style.backgroundColor="white"
        btnSet2.style.left="0";
        btnSet2.style.display="block";
        btnSet2.gridtemplatecolumns="1fr 1fr";
        btnSet2.gridgap="10px";
        btnSet2.style.padding="10px 24px";
        btnSet2.style.left = "0px";
        btnSet2.style.bottom = "90px";
        btnSet2.style.width="200px";
        btnSet2.style.fontSize="17px"
        btnSet2.style.left = "auto";
        btnSet2.style.zIndex = "auto";
        btnSet2.style.margin="4px 2px";
        btnSet2.style.borderColor="black";
        btnSet2.style.borderRadius="4px";
        btnSet2.style.backgroundColor="white";
        btnSet2.addEventListener("click", function(){
        var z = prompt("Increment");
        //setTimeout(function(){
        //document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").value = i ;
        //setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepUp(1);setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepDown(1);},220);},220)
        //},2020);
        },2020)
        document.body.appendChild(btnSet2);
        },2020)

        setTimeout(function(){
        var btnSet3 = document.createElement("button");
        btnSet3.textContent = "on lose";
        btnSet3.id = "onlose"
        btnSet3.style.position ="absolute";
        btnSet3.style.backgroundColor="white"
        btnSet3.style.left="0";
        btnSet3.style.display="block";
        btnSet3.gridtemplatecolumns="1fr 1fr";
        btnSet3.gridgap="10px";
        btnSet3.style.padding="10px 24px";
        btnSet3.style.left = "0px";
        btnSet3.style.bottom = "135px";
        btnSet3.style.width="200px";
        btnSet3.style.fontSize="17px"
        btnSet3.style.left = "auto";
        btnSet3.style.zIndex = "auto";
        btnSet3.style.margin="4px 2px";
        btnSet3.style.borderColor="black";
        btnSet3.style.borderRadius="4px";
        btnSet3.style.backgroundColor="white";
        btnSet3.addEventListener("click", function(){
        var o = prompt("onlose");
        //setTimeout(function(){
        //document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").value = o ;
        //setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepUp(1);setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepDown(1);},220);},220)
        //},2020);
        },2020)
        document.body.appendChild(btnSet3);
        },2020)

    function clickPattern(pattern, index = 0) {
        var buttons = document.querySelectorAll("button.cvZAjo");
        var higherBtn = buttons[0],
        lowerBtn = buttons[1];
        var higherBtnChance = parseFloat(higherBtn.innerText.split("\n")[1].replace("%", "")),
        lowerBtnChance = parseFloat(lowerBtn.innerText.split("\n")[1].replace("%", ""));

        var p = pattern.split(",");

        if(index < p.length) {
        var element = p[index];

        if(element == "n") {
            higherBtn.click();
        }
        else if(element == "s") {
            lowerBtn.click();
        }
        else if(element == "e") {
            if(higherBtnChance > lowerBtnChance) higherBtn.click();
            else lowerBtn.click();
        }
        else if(element == "w") {
            if(higherBtnChance < lowerBtnChance) higherBtn.click();
            else lowerBtn.click();
        }
        index++;

        if (isRunning)
            setTimeout(clickPattern, 800, pattern, index);
        }





setInterval(function(){
//var k = ("A");
//var K = (document.getElementsByClassName("styles__Footer-sc-1e9z9fl-0 jCHXSp")[0].children[0].children[1].innerText)
//setTimeout(function(){if (K=k)(alert("aa"))},1000)
//document.getElementsByClassName("styles__FaceContent-gx1snq-5 jfnwtq")[2].innerText

// var startkarte = console.log("input von inputbox")
// var kA="A";
// var k2= 2;
// var k3= 3;
// var k4= 4;
// var k5= 5;
// var k6= 6;
// var k7= 7;
// var k8= 8;
// var k9= 9;
// var k10= 10;
// var kj= "J";
// var kq= "Q";
// var kk= "K";
var re = new RegExp(a);
    {if (re.test(document.getElementsByClassName("styles__Footer-sc-1e9z9fl-0 jCHXSp")[0].innerText)) {//Aktuelle karte
setTimeout(function(){
setTimeout(clickPattern, 800, pattern, index);
},1000)
// 1. karte document.getElementsByClassName("styles__Footer-sc-1e9z9fl-0 jCHXSp")[0].children[0].children[1].innerText
//setTimeout(function(){
//document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
//setTimeout(function(){
//document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 cvZAjo chromatic-ignore")[1].click();
//setTimeout(function(){document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
//setTimeout(function(){document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[4].click();
//},3500)},3000)},2000)},1000)
    }else{
        //klick next karte
        document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 cvZAjo")[2].click();
    }
       }})

setTimeout(function(){
        var btnSet4 = document.createElement("button");
        btnSet4.textContent = "Set Pattern";
        //    btnSet4.textContent = "Set Pattern: HighOdds(*), LowOdds(/), HigherCard(+), LowerCard(-): *,*,/,*,*,/,* ";
        btnSet4.id = "Pattern"
        btnSet4.style.position ="absolute";
        btnSet4.style.backgroundColor="white"
        btnSet4.style.left="0";
        btnSet4.style.display="block";
        btnSet4.gridtemplatecolumns="1fr 1fr";
        btnSet4.gridgap="10px";
        btnSet4.style.padding="10px 24px";
        btnSet4.style.left = "0px";
        btnSet4.style.top = "315px";
        btnSet4.style.width="200px";
        btnSet4.style.left = "auto";
        btnSet4.style.fontSize="17px"
        btnSet4.style.zIndex = "auto";
        btnSet4.style.margin="4px 2px";
        btnSet4.style.borderColor="black";
        btnSet4.style.borderRadius="4px";
        btnSet4.style.backgroundColor="white";
        btnSet4.addEventListener("click", function(){
        var pi= prompt("Pattern");
        //setTimeout(function(){
        //document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").value = p ;
        //setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepUp(1);setTimeout(function(){document.querySelector(".styles__InputField-ix7z99-3.dqIfCD").stepDown(1);},220);},220)
        //},2020);
        },2020)
        document.body.appendChild(btnSet4);
        },2020)

        setTimeout(function(){
        var btnSet5 = document.createElement("button");
        btnSet5.textContent = "Startkarte";
        btnSet5.id = "Startkarte"
        btnSet5.style.position ="absolute";
        btnSet5.style.backgroundColor="white"
        btnSet5.style.left="0";
        btnSet5.style.display="block";
        btnSet5.gridtemplatecolumns="1fr 1fr";
        btnSet5.gridgap="10px";
        btnSet5.style.padding="10px 24px";
        btnSet5.style.left = "0px";
        btnSet5.style.bottom = "225px";
        btnSet5.style.width="200px";
        btnSet5.style.left = "auto";
        btnSet5.style.fontSize="17px"
        btnSet5.style.zIndex = "auto";
        btnSet5.style.margin="4px 2px";
        btnSet5.style.borderColor="black";
        btnSet5.style.borderRadius="4px";
        btnSet5.style.backgroundColor="white";
        btnSet5.addEventListener("click", function(){
        a = prompt("Startkarte");
        setInterval(function(){
        },10);
        },10)
        document.body.appendChild(btnSet5);
        },10)

        setTimeout(function(){
        var btnSet6 = document.createElement("button");
        btnSet6.textContent ="Skips: "+i++;
        btnSet6.id = "Startkarte"
        btnSet6.style.position ="absolute";
        btnSet6.style.backgroundColor="white"
        btnSet6.style.left="0";
        btnSet6.style.display="block";
        btnSet6.gridtemplatecolumns="1fr 1fr";
        btnSet6.gridgap="10px";
        btnSet6.style.padding="10px 24px";
        btnSet6.style.left = "0px";
        btnSet6.style.bottom = "270px";
        btnSet6.style.width="200px";
        btnSet6.style.left = "auto";
        btnSet6.style.fontSize="17px"
        btnSet6.style.zIndex = "auto";
        btnSet6.style.margin="4px 2px";
        btnSet6.style.borderColor="black";
        btnSet6.style.borderRadius="4px";
        btnSet6.style.backgroundColor="white";
        document.body.appendChild(btnSet6);
        },10)

        ////hilow bot main function von hier
        function start() {
        console.log("Start !");
        //setInterval(function(){
        //check ob runde gestartet ist, wenn nicht runde starten
        if (document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].textContent === 'Einsatz'){
        document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
        console.log("neue runde")}
        //quoten auslesen
        var hi = document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 ldylGE")[0].children[2].innerText.replace("Höher oder gleich","").replace("%","").replace(",","").replace("Gleich","");
        console.log("hi: " + hi)
        var lo = document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 ldylGE")[0].children[3].innerText.replace("Weniger oder gleich","").replace("%","").replace(",","").replace("Niedriger","");
        console.log("lo: " + lo)
        //auszahlung bei x faktor
        var pay1 = pay1 ;
        var pay = document.getElementsByClassName("styles__LabelContent-sc-89rfxt-2 bcHFFd")[3].innerText.replace("Gesamtgewinn (","").replace("×)","").replace(",",".");
        if (pay1 <= pay){
        setTimeout(function(){
        console.log("",+ pay )
        console.log("", + pay1 )
        document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 fbjzSA styles__Button-fc7ea4-0 mGJpP")[0].click();
        },1500)
        //karten spielen wenn x fakter grösser dann klick ihn
        }else if (lo >= hi){
        document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 cvZAjo chromatic-ignore")[1].click();
        hi.onclick = console.log(" lo >= hi karte 1: lo gespielt");
        }else if (hi >= lo){
        document.getElementsByClassName("Button__StyledButton-sc-8bd3dp-0 cvZAjo chromatic-ignore")[0].click();
        lo.onclick = console.log(" lo <= hi karte 1: high gespielt");
        }
        // },3000);
        }
        ////hilow bot main function von hier




        function stop() {var po = console.log("Stop ?");setTimeout(start, 5000)};
        var btn = document.createElement("button");
        btn.textContent='Start'
        btn.style.position ="absolute";
        btn.style.backgroundColor="green"
        btn.style.bottom="0px";
        btn.style.left="0";
        btn.style.display="block";
        btn.gridtemplatecolumns="1fr 1fr";
        btn.gridgap="10px";
        btn.style.width="200px";
        btn.style.padding="10px 24px";
        btn.style.left = "auto";
        btn.style.fontSize="17px";
        btn.style.margin="4px 2px";
        btn.style.borderColor="black";
        btn.style.borderRadius="4px";
        btn.style.backgroundColor="green";
        btn.id = "go";
        document.body.appendChild(btn);
        btn.addEventListener('click', function(){
        if (btn.textContent === "Start") {
        btn.textContent = "Stop";
        btn.style.backgroundColor="red";
        var element = document.getElementById("go");
        setInterval(function(){
        element.onclick = start()
        },1000)
        } else {
        if (btn.textContent === "Stop") {
        btn.textContent = "Start";
        btn.style.backgroundColor="green";
        setInterval(function(){
        element.onclick = stop()
        },100);
        }
        }
        document.body.appendChild(btn);
        }, false);
    }
    })




// setInterval(function(){
//     var k = a;
//     var K = (document.getElementsByClassName("styles__FaceContent-gx1snq-5")[5].textContent);
//     if (K===k){
//           setTimeout(function(){
//           document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[5].click();
//          setTimeout(function(){ //klick lo
//        document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[3].click();},1000)},1000)
//         }},4000)

//         setInterval(function(){
//            var ac="0,00";
// var bc= document.getElementsByClassName("styles__PayoutMultiplier-sc-1e9z9fl-3")[1].innerText.replace("×","");
//              if (ac===bc){
//     setTimeout(function(){ //klick skip
// document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[4].click();},500)
//              }else if (bc>ac){
//         setTimeout(function(){ //klick hi
//        document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[3].click();
//                 setTimeout(function(){ //klick skip
//                 document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[4].click();
//                      setTimeout(function(){ //klick hi
//        document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[3].click();
//                              setTimeout(function(){ //klick payout
//                           document.getElementsByClassName("styles__StyledStack-sc-1154mew-0 styles__Wrap-sc-9aqp7l-0 hFLngE")[0].children[5].click();
//                      },1000)},1000)},1000)},1000)
//   }},4000)



})







