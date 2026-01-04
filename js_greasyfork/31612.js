/// ==UserScript==
// @name         CSONE_Check_Availibility
// @namespace    csone
// @description  This script will check the number of available engineers, will notify if it goes below your minimum required engineers.
// @match        https://*/apex/casemonapp*
// @match        https://*/*CaseMonApp*
// @author       Ionut Alazaroae <ialazaro@cisco.com> & Sergiu Daniluk <mdaniluk@cisco.com>
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version      1.0
// @grant        All
// @include      https://*/*CaseMonApp*
// @include      https://csone.my.salesforce.com/console

// @downloadURL https://update.greasyfork.org/scripts/31612/CSONE_Check_Availibility.user.js
// @updateURL https://update.greasyfork.org/scripts/31612/CSONE_Check_Availibility.meta.js
// ==/UserScript==

var backlogURL = "https://csone--c.na22.visual.force.com/apex/CaseMonGetJSON?op=TA";
flagBeep = false ;
engr = [];
minimumReq = 4;
counter = 0;
numberOfEngineers = 0;

listEngr = "";

function showDiv() {
    document.getElementById("lineListEngr").style.display = "block";
  }
function hideDiv() {
    document.getElementById("lineListEngr").style.display = "none";
  }
function createLineEngr(listOfEngr){
    var divparent = document.getElementById("divOfEngr");
    var beforeNode =  document.getElementById("lineAvailableEngr");
    var line = document.createElement("p");
    line.setAttribute("id","lineListEngr");
    line.style.display = "none";
    divparent.appendChild(line);
    console.log( "CSE ONLINE: List of engr appended to div" );
    line.innerHTML=listOfEngr;
    console.log( "CSE ONLINE: listOfEngineer displayed on screen , list : "+ listOfEngr );
}
function create_line(counter) {
    'use strict';
    var divparent = document.getElementById("divOfEngr");
    var line = document.createElement("p");
    line.setAttribute("id","lineAvailableEngr");
    line.addEventListener("click", function(){document.getElementById("lineListEngr").style.display = "block";},false);
    divparent.appendChild(line);
    console.log( "CSE ONLINE: Line of available engineers appended to the div" );
    line.innerHTML="Available engineers : " + counter;
    console.log( "CSE ONLINE: Line of Available engineers filled with the data : "+ counter );
}
function create_div(){
  var div = document.getElementById("profileBtn");
  var diva = document.createElement("div");
  diva.setAttribute("id","divOfEngr");
  insertAfter(div,diva);

}
function checkIfLower(counter,number){
    var line = document.getElementById("lineAvailableEngr");
    if(counter < number){
        if (flagBeep === false){
        flagBeep= true;
        //console.log("CSE ONLINE: Flag beep changed to : "+flagBeep);
        //console.log("CSE ONLINE:  Beeped");
        beep();}
        else{
         console.log("CSE ONLINE: Flag beep changed to : "+flagBeep);}
        console.log("CSE ONLINE: Color of the line changed to RED");
         line.style.backgroundColor= "red";
        line.style.color = "white";
     }
     else{
         flagBeep = false;
     console.log("CSE ONLINE: Color Of the line changed to GREEN");
          line.style.backgroundColor= "green";
         line.style.color = "white";
     }
}
function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");  
    snd.play();
}
function get_list_of_sr(){
    engr = [];
    test =  $.ajax({url:backlogURL,
         type:"GET",
         dataType:"json",
         success:function(data)
          {
              console.log("CSE ONLINE: AJAX REQUEST DONE" );
             for (i = 0; i < data.length; i++) {
                 var inger = data[i];
                 if(inger.profileStatus === "ACTIVE"){
                     console.log("CSE ONLINE: Active engineers " + inger.engrId  );
                     engr.push(inger);
                     //console.log("CSE ONLINE: Active engineer " + inger.engrId +" pushed to the array");
                     if( firstTime === true){
                     firstTime = false;
                      //console.log("CSE ONLINE:First time flag turned to false ");
                     }else{
                         listEngr += inger.engrId + " ";
                         console.log("CSE ONLINE: Engineers added to the string for later use ( list of engineers) ");
                     }
                     counter = counter +1;
                 }}
          }});
  return counter;


}
function insertAfter(referenceNode, newNode) {

    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
function checkIfDivIsEmpty(counter){
    if ( document.getElementById('divOfEngr').innerHTML === ""){
    console.log("CSE ONLINE: Div is empty ");
    create_line(counter);
    console.log("CSE ONLINE: Line created");
    createLineEngr();
    console.log("CSE ONLINE:List of engineers created");
    }
    else{
    console.log("CSE ONLINE:Div is not empty");
    var div = document.getElementById('divOfEngr');
    var line = document.getElementById('lineAvailableEngr');
    var lineTwo = document.getElementById('lineListEngr');
    line.outerHTML = "";
    lineTwo.outerHTML = "";
    delete lineTwo;
    //console.log("CSE ONLINE:List of engineers removed");
    delete line;
    //console.log("CSE ONLINE:Line removed");
    create_line(counter);
    //console.log("CSE ONLINE:Line replaced");
    createLineEngr(listEngr);
    //console.log("CSE ONLINE:List of engineers replaced ");
    }
}
function main(){
    numberOfEngineers =  get_list_of_sr();
    //console.log( "CSE ONLINE: return value of the function(counter) appended to numberOfEngineers , Value : "+ numberOfEngineers );
    checkIfDivIsEmpty(numberOfEngineers);
    //console.log( "CSE ONLINE: Empty Div Check function passed " );
    checkIfLower(numberOfEngineers,minimumReq);
    //console.log( "CSE ONLINE: Lower test passed " );
    setCounter();


}

function setCounter(){
    counter = 0;
    //console.log( "CSE ONLINE: Counter set to 0 " );
    listEngr = "";
    //console.log( "CSE ONLINE: List of engineers is set to blank " );

}



firstTime = true;

numberOfEngineers =  get_list_of_sr();
console.log( "CSE ONLINE: Start of the script" );



setTimeout(function(){create_div();},10000);
setInterval(function(){main();}, 15000);

