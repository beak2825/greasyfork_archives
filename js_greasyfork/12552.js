// ==UserScript==
// @name         SB nGage Auto
// @namespace    https://greasyfork.org/en/users/5431-allen
// @version      1.3.2
// @description  Automatically goes to the next page on nGage
// @author       Allen
// @include      http://player.ngage-media.com/*
// @include      http://www.swagbucks.com/watch/sponsored
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/12552/SB%20nGage%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/12552/SB%20nGage%20Auto.meta.js
// ==/UserScript==

//gotoUrl();

// linkTimeout = 15;

if (GM_getValue("first") == undefined){
    GM_setValue("first", "0");
}
if (GM_getValue("second") == undefined){
    GM_setValue("second", "0");
}

var nGages = ["sponsor-137.jpg", "sponsor--2.jpg"];

if (window.location.href == "http://www.swagbucks.com/watch/sponsored"){

    if (localStorage.autoOn == undefined){
        localStorage.setItem("autoOn", "1");
    }

    /*
    // Reload page in 10 minutes
    setTimeout(function(){
        location.reload();
    }, 600000);
    */

    // ON/OFF 
    var onOffButton = document.createElement("input");
    onOffButton.type = "button";

    var value = "";
    var bg = "";

    if (localStorage.autoOn == "1"){
        value = "AUTO OPEN NGAGE IS NOW ON";
        bg = "#20DF25";
    }
    else if (localStorage.autoOn == "0"){
        value = "AUTO OPEN NGAGE IS NOW OFF";
        bg = "#FF1919";
    }

    onOffButton.value = value;
    onOffButton.style.background = bg;
    onOffButton.onclick = function(){onOff();};
    var placeHolder = document.getElementById("sbStreamType");
    placeHolder.appendChild(onOffButton);

    var myButton = document.createElement("input");
    myButton.type = "button";
    myButton.value = "RESET";
    myButton.onclick = function(){reset();};
    var placeHolder = document.getElementById("sbStreamType");
    placeHolder.appendChild(myButton);

    var myButton2 = document.createElement("input");
    myButton2.type = "button";
    myButton2.value = "REMOVE";
    myButton2.onclick = function(){remove();};
    var placeHolder = document.getElementById("sbStreamType");
    placeHolder.appendChild(myButton2);


    setTimeout(function(){
        if (localStorage.autoOn == "1"){
            run();
        }
    }, 2000);


    setInterval(function(){
        if (localStorage.autoOn == "1"){
            run();
        }
    }, 10000);

}
/*
else if (window.location.href == "http://player.ngage-media.com/redirecting.html"){
    setTimeout(function(){
        window.close();
    }, 1000);
}*/
else if(window.location.href.substring(0, 32) == "http://player.ngage-media.com/s/"){

    var urlParts = window.location.href.split("=");
    var trackId = urlParts[3];

    // alert(trackId);

    // Get the "Next" button
    var nextId = document.getElementById('startEarning');
    var doneId = document.getElementById('stdFinished');


    // Checks whether the "Next" button can be pressed every 3 seconds. If yes, press it. 
    setInterval(function(){
        if (doneId.style.display == 'block'){

            if (GM_getValue("first") == trackId){
                GM_setValue("first", "0");
            }
            else if (GM_getValue("second") == trackId){
                GM_setValue("second", "0");
            }


            setTimeout(function(){
                child.close();
                window.close();
            }, 1000);

        }
        else if ((nextId.className == "success" && (nextId.innerHTML == "Start Earning" || nextId.innerHTML == "Next Page")) || nextId.className == "error"){
            // alert("click");
            
            if (document.getElementById('nowDiscovering') == undefined){
                document.getElementById('startEarning').click();
            }
            else{
                if (document.getElementById('nowDiscovering').style.display != "inline-block"){
                    document.getElementById('startEarning').click();
                    // if (document.getElementsByClassName('desc')[0].innerHTML == "Like it or not like it when prompted to move on to the next page"){
                        // alert("fuck");
                        setTimeout(function(){
                            window.close();
                        }, 3000);
                        
                        
                   // }
                }
            }
            
            
        }
    }, 3000);

}
else if(window.location.href.substring(0, 32) == "http://player.ngage-media.com/i/"){
    // setTimeout(function(){
        // document.getElementsByTagName("iframe")[0].outerHTML = "";
    // }, 3000);
    
    
    setInterval(function(){
        if (document.getElementById('nextPage').style.display == "block"){
            likePage();
        }
    }, 3000);
    
    
    setInterval(function(){
        if (document.getElementById('done').style.display == "block"){
            window.close();
        }
    }, 10000);
    
    
}

function onOff(){
    if (localStorage.autoOn == "1"){
        localStorage.autoOn = "0";
        onOffButton.value = "AUTO OPEN NGAGE IS NOW OFF";
        onOffButton.style.background = "#FF1919";
    }
    else if (localStorage.autoOn == "0"){
        localStorage.autoOn = "1";
        onOffButton.value = "AUTO OPEN NGAGE IS NOW ON";
        onOffButton.style.background = "#20DF25";
    }
}

function reset(){
    GM_setValue("first", "0");
    GM_setValue("second", "0");
}

function remove(){
    GM_deleteValue("first");
    GM_deleteValue("second");
}


function run(){

    var i = 0;
    while (i < initialCardLoad.cards.length){

        var j = 0;
        while ( j < nGages.length){

            if(initialCardLoad.cards[i].image.includes(nGages[j])){

                // alert("yes");

                if (j == 0 && GM_getValue("first") == 0){

                    GM_setValue("first", initialCardLoad.cards[i].trkId);

                    document.getElementById("sbHomeCard" + initialCardLoad.cards[i].cardId).click();

                }
                else if(j == 1 && GM_getValue("second") == 0){

                    GM_setValue("second", initialCardLoad.cards[i].trkId);

                    document.getElementById("sbHomeCard" + initialCardLoad.cards[i].cardId).click();

                }

            }

            j++;
        }

        i++;
    }
}