// ==UserScript==
// @name        SMF3 Labor Tracking Tool Revamp
// @version      1.3.9
// @description Adds Calm Code Buttons into the FCLM Labor Tracking Kiosk. Select the function your department is in, and select button to the function you want to hard code your associate in. This was written with the intention to help PGs, PAs, AM, Trainers, and Safety Team Members to better assist with Labor Tracking. Code taken and inspired from jeickels@, dkingamz@, salloumr@, @blelliot edited by @trixiefe.
// @author      @trixiefe
// @match      https://fcmenu-iad-regionalized.corp.amazon.com/SMF3/laborTrackingKiosk*
// @match http://fcmenu-iad-regionalized.corp.amazon.com/SMF3/laborTrackingKiosk
// @include http://fcmenu-iad-regionalized.corp.amazon.com/SMF3/laborTrackingKiosk*
// @namespace https://greasyfork.org/users/1028948
// @downloadURL https://update.greasyfork.org/scripts/460210/SMF3%20Labor%20Tracking%20Tool%20Revamp.user.js
// @updateURL https://update.greasyfork.org/scripts/460210/SMF3%20Labor%20Tracking%20Tool%20Revamp.meta.js
// ==/UserScript==
//SMF3 1.3.2 added a Super User labor code to Sort 
var css = document.createElement("style");
css.innerHTML += `
* {
    box-sizing: border-box;
}
#body {
    display: flex;
    flex-flow: row nowrap;
    align-content: space-around;
    justify-content: space-around;
}
#body > .login {
    margin: 0;
    width: 25%;
    max-width: 300px;
}
#body > #toolbox {
    width: 75%;
    flex-grow: 2;
    font-size: 150%;
    display: flex;
    flex-flow: column nowrap;
    align-content: space-around;
    justify-content: space-around;
}
#body > #toolbox > .row {
    margin-bottom: 8px;
}
#body > #toolbox > .row > h1 {
    border-bottom: 2px inset;
    margin-bottom: 4px;
    padding: 0 8px;
    background: rgba(255,255,255,0.5);
}
#body > #toolbox > .row > .roles {
    display: flex;
    flex-flow: row nowrap;
    align-content: space-between;
    justify-content: space-between;
    padding: 0 8px;
    max-width: 1000px;
}
#body > #toolbox > .row > .roles > button {
    display: table-row;
    max-width: 25%;
    background: #3498db;
    border-radius: 13px;
    border:1px solid black;
    color: #ffffff;
    font-size: 20px;
    padding: 4px 12px;
    margin: 0 8px;
}
#body > #toolbox > .row > .roles > button.yes {
    background: #a83232;
}
#body > #toolbox > .row > .roles > button:hover {
    background: #3cb0fd;
}
`;
document.querySelector("head").appendChild(css);
function movebox() {
    let waitForIt;
    if (waitForIt = document.querySelector('#body > .login')) {
        waitForIt.style = '';
    } else {
        setTimeout(movebox, 500);
    }
}
movebox();
var dept = [
    {
        title: 'Department',
        roles: [
            {name: 'Safety', code: 1},
            {name: 'Learning', code: 2},
            {name: 'Inbound', code: 3},
            {name: 'Outbound', code: 4},
           
            ]
}
           ];
var sftCodes = [
    {
        title: 'Safety',
        roles: [
            {name: 'SFT SAFETY STAFF', code: 'SFTSTAF'},
            {name: 'SFT AMCARE NONOCC IN', code: 'SFTAMNO'},
            {name: 'SFT AMCARE OCC IN', code: 'SFTAMOI'},
            {name: 'SFT ASSOC SFTY COMM', code: 'SFTASC'},
            {name: 'SFT SAFETY DRILLS', code: 'SFTDRLL'},
            {name: 'SFT OTHER/MISC', code: 'SFTMISC'},
        ]
    },
     {
        title: 'Other',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
        ]
    },
    {
        title: 'Go Back to Department Selection',
        roles: [
            {name: 'Back', code: 'back'},
        ]
    },
];
var lrnCodes = [
    {
        title: 'Learning',
        roles: [
            {name: 'IB TRAINEE', code: 'RSVTR'},
            {name: 'RPND TRAINEE', code: 'RSVTR'},
            {name: 'SORT TRAINEE', code: 'RSRTTR'},
            {name: 'EOL/FLUID TRAINEE', code: 'TRFOTR'},
            {name: 'COC/HAZMAT REFRESH', code: 'LNTRAIN'},
            {name: 'LEARNING MISC', code: 'LNMISC'},
            {name: 'IB AMB', code: 'RAMB'},
            {name: 'Sort AMB', code: 'RCRSA'},
            {name: 'EOL/FL AMB', code: 'TOTOA'},
            {name: 'PIT AMB', code: "LNPITC"},
        ]
    },
     {
        title: 'Other',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
        ]
    },
    {
        title: 'Go Back to Department Selection',
        roles: [
            {name: 'Back', code: 'back'},
        ]
    },
];
var ibCodes = [
    {
        title: 'Inbound *NOTE- Red Filled can cause ATV, check for training before coding',
        roles: [
            {name: 'IB Sweep', code: 'LPSWEEP'},
            {name: 'Receive AO', code: 'RSV5S'},
            {name: 'IB Dock Clerk', code: 'RSVDC'},
            {name: 'IB TDR', code: 'RSVTDR'},
            {name: 'IB Yard Driver', code: 'RSVIYD'},
            {name: 'PID Truck Unload', code: 'PIDTRUNL'},
            {name: 'Receive Dock Crew', code: 'RSVCRW'},
            {name: 'Receive Line Loader', code: 'RSVLD', atv:'yes'},
            {name: 'Dock PG ', code: 'DCKPG'},
            {name: 'IB PA', code: 'LDOCK'},
        ]
    },
    {
        title: 'RPND',
        roles: [
            {name: 'IB Tote Replen', code: 'RSVRPL'},
            {name: 'RPND PG', code: 'PRGREC'},
            {name: 'RPND PA', code: 'RSLR'},
            {name: 'Prep Omake', code: 'PRPOMK'},
            {name: 'Decant PS', code: 'DCNTPS'},
            {name: 'Stow PSolve Backlog', code: 'PSBL'},
            {name: 'Prep Problem Solve', code: 'PREPPS'},
            {name: 'ATAC Problem Solve', code: 'ATACPS'},
            {name: 'RPND WS', code: 'WATER'},
            {name: 'Decant Backlog PS', code: 'DCNTPSBL'},
        ]
    },
      {
        title: 'ALL PROBLEM SOLVE FUNCTIONS',
        roles: [
            {name: 'Prep Problem Solve', code: 'PREPPS'},
            {name: 'ATAC Problem Solve', code: 'ATACPS'},
            {name: 'IB Sweeper', code: 'LPSWEEP'},
            {name: 'Receive PS', code: 'IBPS'},
            {name: 'Stow PS Backlog', code: 'PSBL'},
            {name: 'Manual Sort PS', code: 'PSRSPS'},
            {name: 'UIS PS', code: 'UISPS'},
            {name: 'Jackpot PS', code: 'PSTOPS'},
            {name: 'FLUID Sweeper', code: 'FSWEEP'},
            {name: 'EOL PS', code: 'WRKFLOW'},
            {name: 'Robotic PS', code: 'ROBPS'},
            {name: 'General Audit', code: 'GENAUDIT'},
            {name: '98 Tool Scanner', code: 'PLTBLD'},
            
        ]
      },
      {
        title: 'ICQA/QUALITY',
        roles: [ 
            
            {name: 'Gatekeeper', code: 'ICVR'},
            {name: 'Tickets', code: 'ICVR'},
            {name: 'PI', code: 'IBPS'}, 
            {name: 'Piles', code: 'IBPS'},
            {name: 'WIP', code: 'IBPS'},
            {name: 'Damageland', code: 'DAMAGES'},
            {name: 'HCC', code: 'IBPS'},
            {name: 'PR Audit', code: 'GENAUDIT'}, 
            {name: 'Work Flow', code: 'WRKFLOW'},
        ]
    },
    {
        title: 'Admin/HR/IT',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
            {name: 'Safety Drills', code: 'SFTDRLL'},
            {name: 'HR Other/Misc', code: 'HRMISC'},
            {name: 'Network-SEV1/2', code: 'NTWRKSEV'},
            {name: 'RME-SEV1/2', code: 'RMESEV'},
            {name: 'Weather-SEV1/2', code: 'WTHRSEV'}, 
            {name: 'Overstaffing', code: 'OVERSTA'},
        ]
    },
    {
        title: 'Other',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
        ]
    },
    {
        title: 'Go Back to Department Selection',
        roles: [
            {name: 'Back', code: 'back'},
        ]
    },
];
var obCodes = [
    {
        title: 'RC Sort',
        roles: [
            {name: 'Presort Diverter', code: 'DIVERT'},
            {name: 'Presort Cases', code: 'PRESRT'},
            {name: 'RC Sort WS ', code: 'RCWS '},
            {name: 'Manual Sort PS', code: 'PSRSPS'},
            {name: 'UIS PS', code: 'UISPS'},
            {name: 'Jackpot PS', code: 'PSTOPS'},
            {name: 'RC Sort PA', code: 'SLPS'},
            {name: 'ATAC/JP', code: 'OVRFLOW'},
            {name: 'Sort 5S', code: 'RSRT5S'},
            {name: 'UIS Super User', code: 'UIS5SU'},
            
        ]
    },
    {
        title: 'EOL',
        roles: [
            {name: 'Robotics Operator', code: 'ROBPS'},
            {name: 'EOL Jackpot', code: 'OVRFLW'},
            {name: 'Transfer Out PA', code: 'TOTOL'},
            {name: 'EOL WS', code: 'EOLWS'},
        ]
    },
      {
        title: 'FLUID *NOTE- Red Filled can cause ATV, check for training before coding',
        roles: [
            {name: 'Wall Builder', code: 'WALLBLD', atv: 'yes'},
            {name: 'Transfer Out Doc Crew', code: 'TRFOCR'},
            {name: 'Truck Loader', code: 'MTTL'},
            {name: 'Transfer Out PA', code: 'TOTOL'},
            {name: 'FLUID Jackpot', code: 'OVRFLW'},
        ]
    },
     {
        title: 'Admin/HR/IT',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
            {name: 'Safety Drills', code: 'SFTDRLL'},
            {name: 'HR Other/Misc', code: 'HRMISC'},
            {name: 'Network-SEV1/2', code: 'NTWRKSEV'},
            {name: 'RME-SEV1/2', code: 'RMESEV'},
            {name: 'Weather-SEV1/2', code: 'WTHRSEV'}, 
            {name: 'Overstaffing', code: 'OVERSTA'},
        ]
    },
            {
        title: 'Other',
        roles: [
            {name: 'Stop Labor Track', code: 'ISTOP'},
            {name: 'Master Stop Labor Track', code: 'MSTOP'},
        ]
    },
     {
        title: 'Go Back to Department Selection',
        roles: [
            {name: 'Back', code: 'back'},
        ]
    },
];
//creates toolbox(space to the right side of LT box)
let toolbox = document.createElement('div'), toolboxHTML = '';
toolbox.id = "toolbox";
createCodes(dept);
addCodes();
addEvents();

//every code adds title and assigns calm code, then updates toolbox
function createCodes(codes){
for (let shift of codes) {
    toolboxHTML += '<div class="row"><h1>' + shift.title + '</h1><div class="roles">';
    for (let role of shift.roles) {
        toolboxHTML += '<button class="' + role.atv + ' "value="' + role.code + '">' + role.name + '</button>';
    }
    toolboxHTML += '</div></div>';
}
toolbox.innerHTML = toolboxHTML
}

//submit selection
function submit(){
    document.forms[0].submit();
}
//add buttons and assigns to toolbox also add events to buttons
function addCodes(){
document.querySelector('#body').appendChild(toolbox);
}
//remove codes
function removeCodes(){
    toolboxHTML = "";
}
//reload webpage when back button is clicked.
function reload(){
    location.reload();
}

//iterate through array and value to find match
function iterateArray(array, value){
    for (let k of array) {
          console.log(k);
    for (let v of k.roles) {
        console.log(v);
        console.log(value);
        if(v.code == value){
          return true;
          }
    }
}
    return false;
}
//add events for codes when clicked
function addEvents(){
Array.from(document.querySelectorAll('#body > #toolbox > .row > .roles > button')).forEach(function(el){
    el.addEventListener('click', function(){
     doEvent(el.value);
    });
})
}

//displays CALMS after dept is selected. If more dept are created above they need an action created below
function doEvent(val){
if(dept.includes(val) !== -1) {
 
    if(val == 4 ){
        removeCodes();
        createCodes(obCodes);
        addCodes();
        addEvents();
  }
    if(val == 3 ){
        removeCodes();
        createCodes(ibCodes);
        addCodes();
        addEvents();
  }
     if(val == 2 ){
        removeCodes();
        createCodes(lrnCodes);
        addCodes();
        addEvents();
  }
    if(val == 1 ){
        removeCodes();
        createCodes(sftCodes);
        addCodes();
        addEvents();
  }
}
//action after button is selection when calm codes are displayed after choosing dept
if(iterateArray(sftCodes, val) === true){
    console.log(val);
    document.getElementById('calmCode').value = val;
    submit();
}
    if(iterateArray(lrnCodes, val) === true){
    console.log(val);
    document.getElementById('calmCode').value = val;
    submit();
}
    if(iterateArray(ibCodes, val) === true){
    console.log(val);
    document.getElementById('calmCode').value = val;
    submit();
}
    if(iterateArray(obCodes, val) === true){
    console.log(val);
            if(val == 'back'){
     reload();
    } else {
    document.getElementById('calmCode').value = val;
    submit();
    }
}
    else {
  // it's not
    console.log("Not Found");
}
}

