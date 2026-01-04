// ==UserScript==
// @name         Tool for automating FootPrints workflow.
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds automation features for CWRU UTech Receiptionists.
// @author       trm109
// @match        https://cdi-its-servicedesk.com/MRcgi/MRTicketPage.pl*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451773/Tool%20for%20automating%20FootPrints%20workflow.user.js
// @updateURL https://update.greasyfork.org/scripts/451773/Tool%20for%20automating%20FootPrints%20workflow.meta.js
// ==/UserScript==



debug = true;


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


var getTicketStatusOptions = function() {
    var status = document.querySelectorAll(
        'select#status[class="ticketField"]'
    )[0];
    var output = status.options;
    if(debug){console.log(output);}
    return output;
}
var getTicketStatus = function() {
    var output = getIssueStatus()
    return output;
}
//Usage; setTicketStatus(3);
var setTicketStatus = function(statusId) {
    var x = statusId
    //0 = assigned
    //1 = acknowledged
    //2 = pending customer
    //3 = customer responded
    //4 = pending vendor
    //5 = pending approval
    //6 = resolved.
    var status = document.querySelectorAll(
        'select#status[class="ticketField"]'
    )[0].selectedIndex = x;
}
//




//List all workspaces
function getWorkspaces() {
    var workspaces = document.querySelectorAll(
        'select#pmember'
    )[0];
    var output = workspaces
    if(debug){console.log(output)}
    return output;
    
}
//assigneeWidgets[0].setField(0) means add selected workspace.
//assigneeWidgets[0].setField(1) means remove selected workspace
function setWorkspace() {
    var x = "UTech__bCARE__bCenter"
    var workspaces = document.querySelectorAll(
        'select#pmember'    
    )[0];
    
}
function getSelectedWorkspace() {

    var options = assigneeWidgets[0].box1.options;
    console.log("[DEBUG] Finding selected options...")
    for(var i =0; i < options.length; i++){
        if(options[i].selected == true){
            console.log(options[i])
        }
    }
    
}
//adds workspace to assignees.
function addWorkspace(assigneeName) {
    console.log("[DEBUG] Attempting to add workspace...")
    var options = assigneeWidgets[0].box1.options;
    //Clear already selected options
    for( var i = 0; i < options.length; i++){
        if(options[i].selected == true){
            options[i].selected = false
        }
    }
    options = assigneeWidgets[0].box1.options;
    //Find the correct box and expand
    for(var i = 0; i < options.length; i++){
        if((options[i].value == assigneeName)){
            //console.log("[DEBUG] 1 Found option that matches")
            options[i].selected = true
            assigneeWidgets[0].collapseExpand()
            break;
        }
    }
    setTimeout(() => {
        
    }, 1000);
    console.log("[DEBUG] options length: " + options.length)
    //Then set new options.
    options = assigneeWidgets[0].box1.options;
    for(var j = 0; j < options.length; j++){
        if(options[j].value == assigneeName){
            //console.log("[DEBUG] 2 Option has same assigneeName");
            if((options[j].className == "member") ){
                console.log("[DEBUG] 3 Option has valid className");
                options[j].selected = true;
                break;
            }else{
                //console.log("[DEBUG] 3 Option has className: " + options[j].className + ", which is not equal to member");
            }
            //console.log("01")
        }else{
            //console.log("[DEBUG] " + j + " Option value: " + options[j].value + ", which is not equal to " + assigneeName)
        }
        //console.log("02")
    }
    //console.log("03")
    //then apply the seleced workspaces.
    assigneeWidgets[0].setField(0);
}
function removeWorkspaces() {
    var options = assigneeWidgets[0].box2.options;
    //setTimeout(() => {}, 1000)
    for (var k = 0; k < options.length; k++){
        console.log("index: " + k)
        assigneeWidgets[0].box2.options.selectedIndex = k
        //setTimeout(() => {}, 1000)
        assigneeWidgets[0].setField(1)
    }
    //assigneeWidgets[0].setField(1)
}
function chooseYourOwnAdventure(selection){
    
}
function setupIB(){
    //Set status to resolved.
    setTicketStatus(6)
    //change pEquip.adventure to IB
    var adventureSelect = document.querySelector('select#Choose__bYour__bOwn__bAdventure')
    //change pEquip.time to 1-15 minutes

    //change pEquip.analyst to other
    
    //change pEquip.ibao to $USER

    //change pEquip.traffic to KSL

    //change pIssue.source to walk up

    //prompt user for presets; wireless/citrix/software/other.

}

function generateUI(){
    let panel = document.querySelector('div#StaticAreaSideInfoDiv')
    panel.style.height = 300;
    let customUlOne = document.createElement('ul')
    customUlOne.style.height = 25;
    let customUlTwo = document.createElement('ul')
    customUlOne.style.height = 25;
    let customUlThree = document.createElement('ul')
    customUlOne.style.height = 25;
    let customUlFour = document.createElement('ul')
    customUlOne.style.height = 25;
    panel.appendChild(customUlOne);
    panel.appendChild(customUlTwo);
    panel.appendChild(customUlThree);
    panel.appendChild(customUlFour);
    let buttonIB = document.createElement('button')
    buttonIB.textContent = "IB"
    buttonIB.style.height = 25
    buttonIB.style.width = 50
    buttonIB.onclick = () => {
        setupIB()
    };
    customUlOne.appendChild(buttonIB);
}

function isEditing(){
    var saveButtons = document.querySelectorAll('span#goButton_textSpan')

    if (saveButtons.length > 0){
        console.log('[DEBUG] Currently editing ticket!')
        return true;
    }else{
        console.log('[DEBUG] Currently viewing ticket detail!')
        return false;
    }
}
function isCreating(){
    if (!isEditing()){
        return false;
    }
    var prefix = document.querySelectorAll('td[class="dialogTitle"]')[0].textContent.substring(0,3)
    //console.log('[DEBUG] prefix:: ' + prefix)
    if(prefix == "New"){
        console.log('[DEBUG] Currently creating new ticket!')
        return true
    }else if(prefix == "Edi"){
        console.log('[DEBUG] Currently editing existing ticket!')
        return false
    }
    console.error('[DEBUG] Invalid prefix:: ' + prefix);
}
function run(){
    //var currentStatus = getTicketStatus();
    //console.log("[DEBUG] Using status: " + currentStatus)
    //console.log("[DEBUG] Options: " + getTicketStatusOptions())
    //console.log("[DEBUG] Changing status to 1")
    //setTimeout(() => {}, 1000)
    
    if( isCreating() ){
        console.log("[DEBUG] Creating a ticket, adding UTech Care Center as Assignee.")
        removeWorkspaces()
        addWorkspace("UTech__bCARE__bCenter")   
    }
    //generateUI();
    //setInterval(constantDebug,1000)
    //console.log("[DEBUG] completed running.")

}
function constantDebug(){
    console.log("ruleNumbers..")
    console.log(ruleNumbers)
    console.log('activeDD...')
    console.log(activeDD)
    console.log('status..')
    console.log(status)
}

(
    function() {
        'use strict';
        //Options should be:
        //Dropoff
        //Pickup
        //IB
        //Leave alone.
        //alert('TamperMonkey instance runnning!')
        
        run()
    }
)();