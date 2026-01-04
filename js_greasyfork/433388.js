// ==UserScript==
// @name         Defect_Comment_Template
// @version      0.7
// @description  pastes a template in comment section to add details - for JIRA,SIM and Tickets
// @author       You
// @match        https://issues.labcollab.net/browse/*
// @match        https://sim.amazon.com/issues/*
// @match        https://issues.amazon.com/*
// @match        https://t.corp.amazon.com/*
// @grant        GM_addStyle
// @namespace    https://greasyfork.org/users/821760
// @downloadURL https://update.greasyfork.org/scripts/433388/Defect_Comment_Template.user.js
// @updateURL https://update.greasyfork.org/scripts/433388/Defect_Comment_Template.meta.js
// ==/UserScript==

var zNode= document.createElement ('div');
zNode.style= "top:90%;right:10%;position:fixed;";
zNode.innerHTML= '<button id="myButton" type="button">'+'Bug Validation</button>';
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);
//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

function ButtonClickAction() {
    var JIRA = document.getElementById('comment');
    var TICKET = document.getElementById('sim-communicationActions--createComment');
    var SIM = document.getElementById('issue-conversation');

    if(JIRA != null){
        JIRA.value =' *Issue Status* : Reproducible/Fixed/Not Reproducible/Blocked \n \n *Latest observation*  : \n \n \n |Checked in Build|Build number| \n|Android|<link>| \n|iOS|<link>| \n|Environment|Prod / Gamma| \n|Account used|      | \n|CID|   | \n|GUI Device used|   | \n|Alexa device and build details|     | \n \n *Attached logs and video for reference* : \n Video name: \n Log name :\n Screenshot name:\n DeeOps :\n Atocha link : ';
    }
   if(TICKET != null){
        TICKET.value =' Issue Status : Reproducible/Fixed/Not Reproducible/Blocked \n Latest observation  : \n Checked in Build :Build number \n Android :<link> \n iOS : <link> \n Environment :Prod / Gamma \n Account used : \n CID: \n GUI Device used :\n Alexa device and build details :\n Attached logs and video for reference :\n Video name :\n Log name :\n Screenshot name :\n DeeOps :\n Atocha link : ';
   }
    if(SIM != null){
        SIM.value =' Issue Status : Reproducible/Fixed/Not Reproducible/Blocked \n Latest observation  : \n Checked in Build :Build number \n Android :<link> \n iOS : <link> \n Environment :Prod / Gamma \n Account used : \n CID: \n GUI Device used :\n Alexa device and build details :\n Attached logs and video for reference :\n Video name :\n Log name :\n Screenshot name :\n DeeOps :\n Atocha link : ';
    }
}
GM_addStyle ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                0px 0px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
    }
*/} ) ;