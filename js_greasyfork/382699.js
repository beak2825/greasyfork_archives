// ==UserScript==
// @name        JDSS - JAMF Delete Shared Users
// @description Deletes all shared users for an iPad
// @version     1.0
// @grant       none
// @run-at      document-idle
// @match       https://*/legacy/mobileDevices.html*
// @namespace https://greasyfork.org/users/298805
// @downloadURL https://update.greasyfork.org/scripts/382699/JDSS%20-%20JAMF%20Delete%20Shared%20Users.user.js
// @updateURL https://update.greasyfork.org/scripts/382699/JDSS%20-%20JAMF%20Delete%20Shared%20Users.meta.js
// ==/UserScript==

// JDSS = Jamf Delete Shared userS

var targetButtons = document.getElementsByName("sharedUserDelete");
var appleIDList = [];
var cancelFlag = false; // set by the cancel button

if (targetButtons.length) {
  JDSS_Main();
};



function JDSS_Main() {
  injectRemoveAllButton();
  injectJDSSModal();
  populateJDSSTable();
  unsafeWindow.changeSideTab('Shared_iPad_Users'); // switch to shared ipad users tab because...why not?
};

function populateJDSSTable() {
  var table = document.getElementById('JDSS-table');
  
  for (let a of targetButtons) {
    var appleID = a.getAttribute('onclick').split("'")[1];
    // stupid javascript, have to do this to remove the \x40 escaping of the @ sign (thanks stackoverflow)
    appleID = appleID.replace(/(?:\\x[\da-fA-F]{2})+/g, m => decodeURIComponent(m.replace(/\\x/g, '%')));
    
    // populate global appleid variable
    appleIDList.push(appleID);

    var row = document.createElement('div');
    row.className = "JDSS-row";
    row.id = appleID;
    
    var cellAppleID = document.createElement('span');
    cellAppleID.className = "JDSS-cell-appleid";
    cellAppleID.appendChild(document.createTextNode(appleID));
    
    var cellStatus = document.createElement('span');
    cellStatus.className = "JDSS-cell-status";
    
    row.appendChild(cellAppleID);
    row.appendChild(cellStatus);
    table.appendChild(row);
  };
};

async function JDSS_RemoveAll() {
  // disable remove buttons
  disableRemoveButtons();
  var fatalError = false;
  
  for (let appleID of appleIDList) {
    if(cancelFlag) break; // If cancel button is pressed, stop. (here so the remaining don't have their status icon update)
    
    var done = false;
    
    if(fatalError) {
      setStatus(appleID, "error");
      continue;
    };

    for(var i=0; i<30; i++) { // wait up to 60 seconds (30 * 2) for a delete user command to clear
      if(cancelFlag) break; // If cancel button is pressed, stop.
      
      setStatus(appleID, "working");
      result = await sendDeleteUserCommand(appleID);
      
      switch(result) {
        case "Success":
          setStatus(appleID, "done");
          done = true;
          break;
        case "Access Denied":
          // pending delete command
          //console.log("Waiting 2 seconds for command to clear: " + (i+1));
          await sleep(2000); // wait 2 second and loop
          break;
        case "FATAL ERROR":
          setTimeout(function() { alert("Error:" + result); }, 1);
        default:
          // Anything else is a fatal error, bail out of everything
          setStatus(appleID, "error");
          fatalError = true;
          break;
      };      
      if(done || fatalError) break; // break out of counter loop
    }; // counter loop
    if(!done) {
      // 60 seconds have gone by and there's still a pending command, I give up.
      // Or...there was a fatal error.  Either way, update the icon and give up.
      setStatus(appleID, "error");
      fatalError = true;
    };
  };// for loop
  // One way or another, we're done.  Change the button to reflect that and make it work.
  var btn = document.getElementById("JDSS-modal-btn");
  var modal = document.getElementById('JDSS-modal-Messages');
  
  btn.disabled = false;
  btn.innerText = "Done";
  btn.onclick = function() {
    modal.style.display = "none";
  };
};


function sendDeleteUserCommand(appleID) {
  // was using JAMF's "submitAjaxPredefinedForm" function on the page...this is easier
  // no need to inject a callback function that can only affect the page and not the gs script
  
  // Jamf's buildAJAXUrl works just fine for us
  var url = unsafeWindow.buildAJAXUrl();
  var sessionToken = document.getElementById('session-token').getAttribute('value');
      
  var form = "command=DeleteUser"
    + "&managedAppleId=" + appleID
    + "&force=true"
    + "&ajaxAction=AJAX_ACTION_SEND_MDM_COMMAND"
    + "&session-token=" + sessionToken;
  
  // returns a promise that fulfills the fetch request
  return fetch(url, {
    method: "POST",
    body: new URLSearchParams(form) // URLSearchParams does the urlencoding of the '@' sign.
  }).then( response => response.text() )
    .then(function(response) {
    var xmlResponse = new DOMParser().parseFromString(response, "text/xml");
    var errorTags = xmlResponse.getElementsByTagName("error");
    
    if (errorTags.length == 1) {
      // JAMF returned an error, usually because of a pending delete user command, its normal
      var jamfError = errorTags[0].childNodes[0].nodeValue;
      
      return jamfError;
    };
    
    return "Success";
  }).catch(function(error) {
    // some kind of non-http error occured.  Wrong server url?  Server offline?
    console.log("JAMF Error");
    console.log(error.message);
    return "FATAL ERROR";
  });
};


function disableRemoveButtons() {
  // disable all remove buttons so that they can't be clicked after the remove all is run, even when cancelled
  document.getElementById('JDSS_Button').setAttribute('disabled', true);
  
  for (let a of targetButtons) {
    a.setAttribute('disabled', true);
  };
};


function setStatus(appleID, status) {
  var links = {
    "working": "/ui/images/mdmcommands/progress.gif",
    "done": "/ui/images/settings/utilized.png",
    "error": "/ui/images/settings/LimitedAccessSettings.png"
  };

  var statusCell = document.getElementById(appleID).getElementsByClassName('JDSS-cell-status')[0];
  
  var image = document.createElement('img');
  image.className = "JDSS-status-image";
  image.src = links[status]
  
  statusCell.innerHTML = "";
  statusCell.appendChild(image);
};


function injectRemoveAllButton() {
  var a = document.getElementsByClassName("payload-heading-wrapper");
  var target;
  for (let b of a) {
    if (b.firstElementChild.getAttribute('translate') === "SHARED_IPAD_USERS") {
      target = b;
    };
  };
  
  var JSSButton = document.createElement('button');
  JSSButton.id = "JDSS_Button";
  JSSButton.className = "insideActionButton jamf-button jamf-button-table ng-scope";
  JSSButton.setAttribute("type", "button");
  JSSButton.style.minWidth = "97.7167px"; // exactly the same width as jamf's "Remove User" buttons with text.
  JSSButton.appendChild(document.createTextNode("Remove All"));
  
  var JDSSDiv = document.createElement('div');
  JDSSDiv.id = "JDSS_Div";
  JDSSDiv.appendChild(JSSButton);
  
  target.append(JDSSDiv);
  
  //document.getElementById('JDSS_Button').addEventListener('click', JDSS_RemoveAll);
  document.getElementById('JDSS_Button').addEventListener('click', displayJDSSModal);
};


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
};


function displayJDSSModal() {
  var modal = document.getElementById('JDSS-modal-Messages');
  var btn = document.getElementById("JDSS-modal-btn");

  btn.onclick = function() {
    btn.innerText = "Canceling";
    btn.disabled = true;
    cancelFlag = true;
  };
  
  modal.style.display = "block";
  JDSS_RemoveAll();
};


function injectJDSSModal() {
  var modalWindow = `
<div id="JDSS-modal-Messages" class="JDSS-modal">
  <div class="JDSS-modal-content">
    <div class="JDSS-modal-header">
      <h2>Sending Delete User Commands</h2>
    </div>
    <div class="JDSS-modal-body">
      <div id="JDSS-table">
        <div class="JDSS-header">
          <span class="JDSS-cell-appleid">Managed AppleID</span>
          <span class="JDSS-cell-status">Status</span>
        </div>
      </div>
    </div>
    <div class="JDSS-modal-footer">
      <button id="JDSS-modal-btn" type="button" style="min-width: 97.7167px;">Cancel</button>
    </div>
  </div>
</div>`;
  
  var modalCSS = `
/* The Modal (background) */
.JDSS-modal {
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 100; /* Sit on top */
  padding-top: 151px; /* Jamf Values */
  padding-left: 255px; /* Jamf Values */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0,0,0); /* Fallback color */
  background-color: rgba(0,0,0,0.2); /* Black w/ opacity */
}

/* Modal Content */
.JDSS-modal-content {
  display: flex;
  flex-flow: column;
  position: relative;
  top: 15%;
  background-color: #fefefe;
  margin: auto;
  padding: 0;
  border: 1px solid #888;
  width: 30%;
  height: 300px;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  -webkit-animation-name: JDSS-modal-animatetop;
  -webkit-animation-duration: 0.4s;
  animation-name: JDSS-modal-animatetop;
  animation-duration: 0.4s
}

/* Add Animation */
@-webkit-keyframes JDSS-modal-animatetop {
  from {top:-300px; opacity:0} 
  to {top:15%; opacity:1}
}

@keyframes JDSS-modal-animatetop {
  from {top:-300px; opacity:0}
  to {top:15%; opacity:1}
}

/* The Close Button */
/*
#JDSS-modal-close {
  color: white;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

#JDSS-modal-close:hover,
#JDSS-modal-close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
*/

.JDSS-modal-header {
  padding: 2px 16px;
  height: 40px;
  background-color: #3b3b3b;
  color: white;
}

.JDSS-modal-header h2,
.JDSS-modal-footer h2 {
  color: #a9b1bc;
  font-size: 20px;
  text-align: center;
}

.JDSS-modal-body {
  flex-grow: 1;
}

.JDSS-modal-footer {
  padding: 0px 16px;
  height: 30px;
  background-color: #505050;
  color: white;
  text-align: center;
}

#JDSS-table {
  display: table;
  border-collapse: collapse;
}

.JDSS-header {
  display: table-row;
  border-bottom: 1px solid black ;
}

.JDSS-row {
  display: table-row;
  margin: 20px;
}

.JDSS-row:nth-child(odd) {
  background-color: #f8f8f8;
}

.JDSS-cell-appleid,
.JDSS-cell-status {
  padding: 2.4px 0px;
}

.JDSS-cell-appleid {
  display: table-cell;
  width: 100%;
  padding-left: 6px;
}

.JDSS-cell-status {
  display: table-cell;
  width: 46px;
  padding-right: 6px;
  text-align: center;
}

#JDSS-modal-btn {
  color: #666;
  font-family: ProximaNova,"Helvetica Nueu",Verdana,sans-serif;
  font-weight: 400;
  font-size: 14px;
  margin: 3px;
  height: 24px;
  background-image: linear-gradient(to top,#f8f8f8 0,#fff 100%);
  border: 1px solid #cbd0d8;
  border-radius: 40px;
  text-align: center;
  cursor: pointer;
}

.JDSS-status-image {
  height: 16px;
  width: 16px;
  vertical-align: middle;
}

`;
  addGlobalStyle(modalCSS);
  
  document.body.insertAdjacentHTML('beforeend', modalWindow);
};


