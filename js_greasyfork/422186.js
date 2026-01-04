// ==UserScript==
// @name         [0000001] Gigabet easy roulette bot + faucet redeem
// @description  https://www.gigabet.com/c/giveaways 
// @version      0.1
// @author       Dauersendung
// @namespace    https://greasyfork.org/de/users/444902-dauersendung
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @run-at       document-start
// @match        https://gigabet.com/game/roulette
// @downloadURL https://update.greasyfork.org/scripts/422186/%5B0000001%5D%20Gigabet%20easy%20roulette%20bot%20%2B%20faucet%20redeem.user.js
// @updateURL https://update.greasyfork.org/scripts/422186/%5B0000001%5D%20Gigabet%20easy%20roulette%20bot%20%2B%20faucet%20redeem.meta.js
// ==/UserScript==



var count_min = 1;
$(document). ready(function(){
    console.log("Status: Page loaded.");
   document.getElementById("OJcchp").style.display = "none";
// 1/4 =  26 0 32 15 19 4 21 2 25 17
var a = document.querySelector(".ro-table-inner").children[22].style.background="#8df3f7"
var b = document.querySelector(".ro-table-inner").children[0].style.background="#8df3f7"
var c = document.querySelector(".ro-table-inner").children[24].style.background="#8df3f7"
var d = document.querySelector(".ro-table-inner").children[5].style.background="#8df3f7"
var e = document.querySelector(".ro-table-inner").children[33].style.background="#8df3f7"
var f = document.querySelector(".ro-table-inner").children[28].style.background="#8df3f7"
var g = document.querySelector(".ro-table-inner").children[7].style.background="#8df3f7"
var h = document.querySelector(".ro-table-inner").children[14].style.background="#8df3f7"
var i = document.querySelector(".ro-table-inner").children[35].style.background="#8df3f7"
// 2/4 =  34 6 27 13 36 11 30 8 23
var j = document.querySelector(".ro-table-inner").children[19].style.background="#f4ff91"
var k = document.querySelector(".ro-table-inner").children[38].style.background="#f4ff91"
var l = document.querySelector(".ro-table-inner").children[2].style.background="#f4ff91"
var m = document.querySelector(".ro-table-inner").children[9].style.background="#f4ff91"
var n = document.querySelector(".ro-table-inner").children[31].style.background="#f4ff91"
var o = document.querySelector(".ro-table-inner").children[12].style.background="#f4ff91"
var p = document.querySelector(".ro-table-inner").children[17].style.background="#f4ff91"
var q = document.querySelector(".ro-table-inner").children[10].style.background="#f4ff91"
var r = document.querySelector(".ro-table-inner").children[16].style.background="#f4ff91"
var s = document.querySelector(".ro-table-inner").children[21].style.background="#f4ff91"
// 3/4 =  10 5 24 16 33 1 20 14 31
var t = document.querySelector(".ro-table-inner").children[30].style.background="#d06bc4"
var u = document.querySelector(".ro-table-inner").children[15].style.background="#d06bc4"
var v = document.querySelector(".ro-table-inner").children[8].style.background="#d06bc4"
var w = document.querySelector(".ro-table-inner").children[32].style.background="#d06bc4"
var x = document.querySelector(".ro-table-inner").children[11].style.background="#d06bc4"
var y = document.querySelector(".ro-table-inner").children[27].style.background="#d06bc4"
var z = document.querySelector(".ro-table-inner").children[20].style.background="#d06bc4"
var aa = document.querySelector(".ro-table-inner").children[18].style.background="#d06bc4"
var bb = document.querySelector(".ro-table-inner").children[37].style.background="#d06bc4"
var cc = document.querySelector(".ro-table-inner").children[3].style.background="#d06bc4"
// 4/4 =  31 9 22 18 29 7 28 12 35 3
var dd = document.querySelector(".ro-table-inner").children[34].style.background="#8b9def"
var ee = document.querySelector(".ro-table-inner").children[6].style.background="#8b9def"
var ff = document.querySelector(".ro-table-inner").children[23].style.background="#8b9def"
var gg = document.querySelector(".ro-table-inner").children[29].style.background="#8b9def"
var hh = document.querySelector(".ro-table-inner").children[36].style.background="#8b9def"
var ii = document.querySelector(".ro-table-inner").children[4].style.background="#8b9def"
var jj = document.querySelector(".ro-table-inner").children[25].style.background="#8b9def"
var kk = document.querySelector(".ro-table-inner").children[1].style.background="#8b9def"
var ll = document.querySelector(".ro-table-inner").children[22].style.background="#8b9def"


setTimeout(function(){

    }, random(2000,4000));


    // 1/4 =  26 0 32 15 19 4 21 2 25 17
setTimeout(function() {

        setTimeout(function(){
        var btnSet1 = document.createElement("button");
        btnSet1.textContent = "26, 0, 32, 15, 19, 4, 21, 2, 25, 17";
        btnSet1.id = "1"
        btnSet1.style.position ="absolute";
        btnSet1.style.backgroundColor="#8df3f7"
        btnSet1.style.left="0";
        btnSet1.style.display="block";
        btnSet1.gridtemplatecolumns="1fr 1fr";
        btnSet1.gridgap="10px";
        btnSet1.style.padding="10px 24px";
        btnSet1.style.left = "0px";
        btnSet1.style.bottom = "45px";
        btnSet1.style.width="300px";
        btnSet1.style.left = "auto";
        btnSet1.style.fontSize="17px";
        btnSet1.style.zIndex = "auto";
        btnSet1.style.margin="4px 2px";
        btnSet1.style.borderColor="black";
        btnSet1.style.borderRadius="4px";
        btnSet1.addEventListener("click", function(){
        $(".btnset6-c").click();
        //26  1
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[22];

if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)

               //0 2
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[0];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//32 3
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[24];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //15 4
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[5];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //19  5
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[33];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)


            ///////
             //4  6
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[28];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//21 7
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[7];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //2  8
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[14];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //25 9
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[35];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
                            $(".btnset6-ro-play").click();

        },500)
        },2020);
        document.body.appendChild(btnSet1);
        },2020)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 2/4 =  34 6 27 13 36 11 30 8 23
     setTimeout(function(){
       var btnSet2 = document.createElement("button");
        btnSet2.textContent = "34, 6, 27, 13, 36, 11, 30, 8, 23";
        btnSet2.id = "2"
        btnSet2.style.position ="absolute";
        btnSet2.style.backgroundColor="#f4ff91"
        btnSet2.style.left="0";
        btnSet2.style.display="block";
        btnSet2.gridtemplatecolumns="1fr 1fr";
        btnSet2.gridgap="10px";
        btnSet2.style.padding="10px 24px";
        btnSet2.style.left = "0px";
        btnSet2.style.bottom = "90px";
        btnSet2.style.width="300px";
        btnSet2.style.fontSize="17px"
        btnSet2.style.left = "auto";
        btnSet2.style.zIndex = "auto";
        btnSet2.style.margin="4px 2px";
        btnSet2.style.borderColor="black";
        btnSet2.style.borderRadius="4px";
        btnSet2.addEventListener("click", function(){
            $(".btnset6-c").click();

        //17 10
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[19];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)

               //34 11
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[38];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//6 12
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[2];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //27 12
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[9];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //13 13
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[31];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
        },500)


            ///////
             //36 14
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[12];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//11 15
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[17];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //30 16
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[10];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //8 17
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[16];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
              //23 18
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[21];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

                $(".btnset6-ro-play").click();

        },500);
        },2020);
         document.body.appendChild(btnSet2);
        },2020)

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 3/4 =  10 5 24 16 33 1 20 14 31
     setTimeout(function(){
       var btnSet3 = document.createElement("button");
        btnSet3.textContent = "10, 5, 24, 16, 33, 1, 20, 14, 31";
        btnSet3.id = "3"
        btnSet3.style.position ="absolute";
        btnSet3.style.backgroundColor="#d06bc4"
        btnSet3.style.left="0";
        btnSet3.style.display="block";
        btnSet3.gridtemplatecolumns="1fr 1fr";
        btnSet3.gridgap="10px";
        btnSet3.style.padding="10px 24px";
        btnSet3.style.left = "0px";
        btnSet3.style.bottom = "135px";
        btnSet3.style.width="300px";
        btnSet3.style.fontSize="17px"
        btnSet3.style.left = "auto";
        btnSet3.style.zIndex = "auto";
        btnSet3.style.margin="4px 2px";
        btnSet3.style.borderColor="black";
        btnSet3.style.borderRadius="4px";
        btnSet3.addEventListener("click", function(){
            $(".btnset6-c").click();
        //10 19
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[30];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)

               //5 20
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[15];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//24 21
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[8];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //16 22
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[32];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //33 24
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[11];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)


            ///////
             //1 25
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[27];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//20 26
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[20];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //14 27
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[18];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //31 28
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[37];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
              //9 29
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[3];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
                    $(".btnset6-ro-play").click();

        },500)
        },2020);
        document.body.appendChild(btnSet3);
        },2020)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // 4/4 =  31 9 22 18 29 7 28 12 35 3
     setTimeout(function(){
        var btnSet4 = document.createElement("button");
        btnSet4.textContent = "31, 9, 22, 18, 29, 7, 28, 12, 35, 3";
        btnSet4.id = "4"
        btnSet4.style.position ="absolute";
        btnSet4.style.backgroundColor="#8b9def"
        btnSet4.style.left="0";
        btnSet4.style.display="block";
        btnSet4.gridtemplatecolumns="1fr 1fr";
        btnSet4.gridgap="10px";
        btnSet4.style.padding="10px 24px";
        btnSet4.style.left = "0px";
        btnSet4.style.bottom = "180px";
        btnSet4.style.width="300px";
        btnSet4.style.fontSize="17px"
        btnSet4.style.left = "auto";
        btnSet4.style.zIndex = "auto";
        btnSet4.style.margin="4px 2px";
        btnSet4.style.borderColor="black";
        btnSet4.style.borderRadius="4px";
        btnSet4.addEventListener("click", function(){
            $(".btnset6-c").click();
         //22 30
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[34];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)

               //18 31
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[6];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//29 32
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[23];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //7 33
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[29];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //28 34
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[36];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)


            ///////
             //12 35
            setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[4];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}},500)
//25 36
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[25];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)

            //3 37
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[1];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}

        },500)
            //26 38
                    setTimeout(function(){
            var targetNode = document.querySelector(".ro-table-inner").children[22];
if (targetNode) {
    //--- Simulate a natural mouse-click sequence.
    triggerMouseEvent (targetNode, "mouseover");
    triggerMouseEvent (targetNode, "mousedown");
    triggerMouseEvent (targetNode, "mouseup");
    triggerMouseEvent (targetNode, "click");
}
else
    console.log ("*** Target node not found!");

function triggerMouseEvent (node, eventType) {
    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent (eventType, true, true);
    node.dispatchEvent (clickEvent);
}
                            $(".btnset6-ro-play").click();

        },500)
        },2020);
        document.body.appendChild(btnSet4);
        },2020)
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // low bal
        setTimeout(function(){
        var btnset6 = document.createElement("button");
        btnset6.textContent='low'
        btnset6.id = "low"
        btnset6.style.position ="absolute";
        btnset6.style.backgroundColor="#ea9292"
        btnset6.style.bottom="0px";
        btnset6.style.left="0";
        btnset6.style.display="block";
        btnset6.gridtemplatecolumns="1fr 1fr";
        btnset6.gridgap="10px";
        btnset6.style.width="300px";
        btnset6.style.padding="10px 24px";
        btnset6.style.left = "auto";
        btnset6.style.fontSize="17px";
        btnset6.style.margin="4px 2px";
        btnset6.style.borderColor="black";
        btnset6.style.borderRadius="4px";
        btnset6.id = "go";
        document.body.appendChild(btnset6);
        btnset6.addEventListener('click', function(){
        setTimeout(function(){
        document.getElementsByClassName("btn--game")[4].click();
        }, 555);
        },2020);
        document.body.appendChild(btnset6);
        },2020)
        },800)

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // claim bal
        setTimeout(function(){
        var btnSet5 = document.createElement("button");
        btnSet5.textContent = "claim";
        btnSet5.id = "claim"
        btnSet5.style.position ="absolute";
        btnSet5.style.backgroundColor="#90fb90"
        btnSet5.style.left="0";
        btnSet5.style.display="block";
        btnSet5.gridtemplatecolumns="1fr 1fr";
        btnSet5.gridgap="10px";
        btnSet5.style.padding="10px 24px";
        btnSet5.style.left = "0px";
        btnSet5.style.bottom = "225px";
        btnSet5.style.width="300px";
        btnSet5.style.fontSize="17px"
        btnSet5.style.left = "auto";
        btnSet5.style.zIndex = "auto";
        btnSet5.style.margin="4px 2px";
        btnSet5.style.borderColor="black";
        btnSet5.style.borderRadius="4px";
        btnSet5.addEventListener("click", function(){
        $(".btnset6-c").click();
        $(".modal .btn--faucet--request").click();
        document.getElementsByClassName("btn--game")[1].click();
        location.reload();
        },2020);

        document.body.appendChild(btnSet5);
        },2020)
})



document.addEventListener("keydown", function(event) {
if (event.code === "KeyD") {
//var nene= document.getElementsByClassName("faucet--counter")[1].children[1].firstChild.nodeValue="00";
//var tete = document.getElementById("game--balance--top").innerText="0.00000000";
//if (nene!== tete){
$(".modal .btnset6--faucet--request").click();
  //crypto  $(".primary.second.btnset6--faucet--request")[1].click();
   //diamante  $(".primary.second.btnset6--faucet--request")[0].click();
//}
event.preventDefault();
}
});

//chance -5
document.addEventListener("keydown", function(event) {
if (event.code === "KeyF") {
//var nene= document.getElementsByClassName("faucet--counter")[1].children[1].firstChild.nodeValue="00";
//var tete = document.getElementById("game--balance--top").innerText="0.00000000";
//if (nene!== tete){
$(".primary.second.btnset6--faucet--request")[1].click();
   //diamante  $(".primary.second.btnset6--faucet--request")[0].click();
//}
event.preventDefault();
}
});

//chance -5
document.addEventListener("keydown", function(event) {
if (event.code === "KeyG") {
$("#m--product--btnset6--confirmation.primary.second").click();
//}
event.preventDefault();
}
});
function random(min,max){
   return min + (max - min) * Math.random();
}
