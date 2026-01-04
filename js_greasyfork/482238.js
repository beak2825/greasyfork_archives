// ==UserScript==
// @name         SIM-UI (beta)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Monitor SIM Queue Folders
// @author       Josfrost
// @match        https://sim.amazon.com/*
// @match        https://issues.amazon.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/482238/SIM-UI%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/482238/SIM-UI%20%28beta%29.meta.js
// ==/UserScript==
let toggleActive = true;
let site = window.location.href
let toggleMin = GM_getValue('toggleMin2', 0);
let userColor = GM_getValue('userColor', false);
let userTaskColor = GM_getValue('userTaskColor', false);
let userTextColor = GM_getValue('userTextColor', false);
let waitTime = true;
const black = "#000903";
const gray = "#75755d";
const lightWhite = "#e0eff2";
//colorblind specific pallete
const cb_Orange = "#E66100";
const cb_Skyblue = "#00a8e1";
const cb_Green = "#009E73";
const cb_Green2 = "#009e749f";
const cb_darkGreen = "#117733";
const cb_Orange2 = "#e660000"
const cb_Yellow = "#FFB000";
const cb_Purple2 = "#5e3a9b93";
const cb_Blue = "#0072B2";
const cb_Red = "#DC3220";
const cb_Purple = "#5D3A9B";

(function() {
    if(!site.includes('coworkassignment')){
    createToolBar();
displayFolders();
        setInterval(changePadding,1000);

setInterval(displayFolders,30000)

}
function createToolBar() {
  // Create the toolbar element
  var toolbar = document.createElement('div');
  toolbar.style.position = 'fixed';
  toolbar.style.display = 'flex';
  toolbar.style.flexDirection = 'row';
  toolbar.style.gap = '5px';
  toolbar.style.bottom = '-35px';
  if (toggleMin !== 0) {
    toolbar.style.bottom = '0';
  }
  toolbar.style.left = '0';
  toolbar.style.width = '100%';
  toolbar.style.fontWeight = '700';
  toolbar.style.lineHeight = '30px';
  toolbar.style.transition = '.2s linear';
  toolbar.style.height = '30px';
  toolbar.style.background = cb_Purple;
  toolbar.style.color = lightWhite;
  toolbar.style.padding = '10px';
  toolbar.style.zIndex = '9999';
  toolbar.innerHTML = 'SIM-UI';
  toolbar.style.borderTop = 'dashed 2px #000903';
        if (userColor) {
  toolbar.style.background = userColor;
}
            if (userTextColor) {
  toolbar.style.color = userTextColor;
}

  toolbar.onmouseenter = function() {
    if (toggleMin === 0) {
      toolbar.style.bottom = '0';
    }
  };

  toolbar.onmouseleave = function() {
    if (toggleMin === 0) {
      toolbar.style.bottom = '-35px';
    }
  };

  var addButton = document.createElement('button');
    addButton.textContent = '+';
    addButton.style.fontWeight = "Bold";
    addButton.style.height = "25px";
    addButton.style.padding = "2px";
    addButton.style.fontSize = "20px";
    addButton.style.width = "25px";
    addButton.style.borderRadius = "2px";
    addButton.style.borderStyle = "solid";
    addButton.style.backgroundColor = black;
    addButton.style.color = lightWhite;
            if (userTextColor) {
  addButton.style.color = userTextColor;
}
  toolbar.appendChild(addButton);

  var folderBox = document.createElement('div');
  folderBox.id = 'folderBox';
  folderBox.style.display = 'flex';
  folderBox.style.flexDirection = 'row';
  folderBox.style.gap = '4px';
  //folderBox.style.maxWidth = '60%';
  toolbar.appendChild(folderBox);

  // Create the popup element

  var minButton = document.createElement('button');
    minButton.style.fontSize = "20px";
    minButton.style.fontWeight = "Bold";
    minButton.style.height = "25px";
    minButton.style.width = "25px";
    minButton.style.padding = "2px";
    minButton.style.borderRadius = "2px";
    minButton.style.borderStyle = "solid";
    minButton.style.backgroundColor = black;
    minButton.style.color = lightWhite;
            if (userTextColor) {
  minButton.style.color = userTextColor;
}
    if (toggleMin === 0) {
    minButton.textContent = '↟';
  }
  if (toggleMin === 1) {
    minButton.textContent = '↥';
  }
      if (toggleMin === 2) {
    minButton.textContent = '↴';
  }



  minButton.onclick = function() {
  toggleMin = (toggleMin + 1) % 3;
console.log(toggleMin);
  if (toggleMin === 0) {
      toolbar.style.bottom = '-35px';
    minButton.textContent = '↟';
  } else if (toggleMin === 1) {
      toolbar.style.bottom = '0';
    minButton.textContent = '↥';
  } else if (toggleMin === 2) {
    minButton.textContent = '↴';
  }





      displayFolders();
    GM_setValue('toggleMin2', toggleMin);

  };

  toolbar.prepend(minButton);



var colorPopup = document.createElement('div');
colorPopup.style.position = 'fixed';
colorPopup.style.lineHeight = "30px";
colorPopup.style.top = '50%';
colorPopup.style.fontWeight = '700';
colorPopup.style.left = '50%';
colorPopup.style.transform = 'translate(-50%, -50%)';
colorPopup.style.borderRadius = "5px";
colorPopup.style.flexDirection = "row";
colorPopup.style.gap = "5px";
colorPopup.style.zIndex="9999";
colorPopup.style.background = cb_Purple;
colorPopup.style.padding = '20px';
colorPopup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
colorPopup.style.display = 'none';
    if (userColor) {
  colorPopup.style.background = userColor;
}
        if (userTextColor) {
  colorPopup.style.color = userTextColor;
}


  // Create the color picker input
        let colorPopupheader = document.createElement('div');
    colorPopupheader.textContent = "SIM Background Color : "
    let colorPopupheader1 = document.createElement('div');
    colorPopupheader1.textContent = "Background Color : "
    let colorPopupheader2 = document.createElement('div');
    colorPopupheader2.textContent = "Text Color : "
  var colorPicker = document.createElement('input');
  colorPicker.type = 'color';
    colorPicker.style.width = "30px"
    colorPicker.style.height = "30px"
    colorPopup.appendChild(colorPopupheader1);
 colorPopup.appendChild(colorPicker);
  // Create the color picker input
  var textcolorPicker = document.createElement('input');
    textcolorPicker.type = 'color';
    textcolorPicker.style.width = "30px"
    textcolorPicker.style.height = "30px"
      var SIMcolorPicker = document.createElement('input');
  SIMcolorPicker.type = 'color';
    SIMcolorPicker.style.width = "30px"
    SIMcolorPicker.style.height = "30px"
        if (userColor) {
  colorPicker.value = userColor;
}
        if (userTextColor) {
  textcolorPicker.value = userTextColor;
}
            if (userTaskColor) {
  SIMcolorPicker.value = userTaskColor;
}
    colorPopup.appendChild(colorPopupheader2);
 colorPopup.appendChild(textcolorPicker);
    colorPopup.appendChild(colorPopupheader);
 colorPopup.appendChild(SIMcolorPicker);
var popup = document.createElement('div');
popup.style.position = 'fixed';
popup.style.top = '50%';
popup.style.left = '50%';
popup.style.transform = 'translate(-50%, -50%)';
popup.style.borderRadius = "5px";
popup.style.flexDirection = "row";
popup.style.fontWeight = '700';
popup.style.gap = "5px";
popup.style.zIndex="9999";
popup.style.background = cb_Purple;
popup.style.padding = '20px';
popup.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
popup.style.display = 'none';
    if (userColor) {
  popup.style.background = userColor;
}
        if (userTextColor) {
  popup.style.color = userTextColor;
}

toolbar.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        colorPopup.style.display = "flex";
      });
     // Hide the context menu on click outside
  document.addEventListener('click', function(e) {
    if (!popup.contains(e.target) && popup.style.display == 'flex' && !waitTime) {
      popup.style.display = 'none';
    }


          if (!colorPopup.contains(e.target) && colorPopup.style.display == 'flex') {
      colorPopup.style.display = 'none';
    }
      if (e.target.className !== 'folder') {
                    let folderDivFound = document.getElementsByClassName('folder')
if(folderDivFound){
for (let x in folderDivFound) {
    if(typeof(folderDivFound[x]) === 'object'){
        folderDivFound[x].style.opacity = "0";
        folderDivFound[x].style.pointerEvents = "none";
    }
}
}}



  });

  colorPicker.addEventListener('input', function() {
    var selectedColor = colorPicker.value;
    toolbar.style.background = selectedColor;
      popup.style.background = selectedColor;
      colorPopup.style.background = selectedColor;
     GM_setValue('userColor', selectedColor);


  });
      textcolorPicker.addEventListener('input', function() {
    var selectedColor = textcolorPicker.value;
    toolbar.style.color = selectedColor;
      popup.style.color = selectedColor;
      addButton.style.color = selectedColor;
      minButton.style.color = selectedColor;
      colorPopup.style.color = selectedColor;
     GM_setValue('userTextColor', selectedColor);


  });
          SIMcolorPicker.addEventListener('input', function() {
    var selectedColor = SIMcolorPicker.value;

     GM_setValue('userTaskColor', selectedColor);
userTaskColor = selectedColor;
               let folderDivFound = document.getElementsByClassName('folder')
if(folderDivFound){
for (let x in folderDivFound) {
    if(typeof(folderDivFound[x]) === 'object'){
        folderDivFound[x].style.backgroundColor =selectedColor;
    }
}}

  });
// Create the input element

    var folderNameInput = document.createElement('input');
folderNameInput.type = 'text';
folderNameInput.placeholder = 'New SIM Folder Name';


var folderIdInput = document.createElement('input');
folderIdInput.type = 'text';
folderIdInput.placeholder = 'SIM Folder ID';


// Create the OK button
var okButton = document.createElement('button');
okButton.style.height = "30px";
okButton.textContent = 'Add';
    var currentButton = document.createElement('button');
currentButton.style.height = "30px";
    currentButton.style.width = "max-content";
currentButton.textContent = 'This Folder';

// Create the Cancel button
var cancelButton = document.createElement('button');
    cancelButton.style.height = "30px";
cancelButton.textContent = 'Cancel';

// Add event listener to the OK button
okButton.addEventListener('click', async function() {
  var folderName = folderNameInput.value.trim();
  var folderId = folderIdInput.value.trim();

  if (folderName !== '' && folderId !== '') {
    try {
      var folderList = JSON.parse(GM_getValue('SIMfolderList', '[]'));

      var folderEntry = folderName + '|' + folderId;

      if (!folderList.includes(folderEntry)) {
        folderList.push(folderEntry);
        GM_setValue('SIMfolderList', JSON.stringify(folderList));
        console.log('Folder added:', folderEntry);
      } else {
        console.log('Folder already exists:', folderEntry);
      }
    } catch (error) {
      console.error('Error accessing GM values:', error);
    }
  }
  popup.style.display = 'none';

    displayFolders();
});




// Add event listener to the Cancel button
cancelButton.addEventListener('click', function() {
    folderNameInput.value = "";
    folderIdInput.value = "";
  popup.style.display = 'none';
});

// Add the input, OK button, and Cancel button to the popup
popup.appendChild(folderNameInput);
popup.appendChild(folderIdInput);
popup.appendChild(currentButton);
popup.appendChild(okButton);
popup.appendChild(cancelButton);

// Add event listener to the toolbar button
addButton.addEventListener('click', function() {

    waitTime = true;
    setTimeout(function(){waitTime = false;},600)
  popup.style.display = 'flex';
    folderNameInput.focus();
});

currentButton.addEventListener('click', async function() {
const extractedId = extractIdFromUrl(site);
    if(extractedId){
    folderIdInput.value = extractedId;
        let maxData = await getMaxxisID(extractedId)
        const labels = maxData.response.label;
const labelText = labels.map(label => label.text);
        folderNameInput.value = labelText
        folderNameInput.focus();
    }
});

// Append the toolbar and popup to the body
document.body.appendChild(popup);
document.body.appendChild(colorPopup);
document.body.appendChild(toolbar);


}

    function getMaxxisData(folder){
        let urlP1= "https://maxis-service-prod-iad.amazon.com/issues?q=status%3AOpen+AND+containingFolder%3A"
        let urlP2 = "&sort=lastUpdatedDate+desc&rows=200&omitPath=conversation&maxis%3Aheader%3AAmzn-Version=1.0"
        let wholeUrl = urlP1+folder+urlP2
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: wholeUrl,
            responseType: "json",
            onload: (resOBJ) => {resolve(resOBJ);},
            onabort: httprequestError,
            onerror: httprequestError,
            ontimeout: httprequestError
        });
    });
}
        function getMaxxisID(folder){

        let urlP1= "https://maxis-service-prod-iad.amazon.com/folders/"
        let urlP2 = "?maxis%3Aheader%3AAmzn-Version=1.0"
        let wholeUrl = urlP1+folder+urlP2
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: wholeUrl,
            responseType: "json",
            onload: (resOBJ) => {resolve(resOBJ);},
            onabort: httprequestError,
            onerror: httprequestError,
            ontimeout: httprequestError
        });
    });
}


     function httprequestError(rspObj)
    {
console.log(rspObj)
    }





var draggedFolder;

async function displayFolders() {
    if (toggleActive){
  var folderList = JSON.parse(GM_getValue('SIMfolderList')) || [];
  var folderBox = document.getElementById('folderBox');
  folderBox.innerHTML = '';

  for (var i = 0; i < folderList.length; i++) {
    var folderEntry = folderList[i];
    var [folderName, folderId] = folderEntry.split('|');


        let maxData = await getMaxxisData(folderId)

        let totalNumberFound = maxData.response.totalNumberFound
        let maxDataDocs = maxData.response.documents;



    var folderDiv = document.createElement('div');
      var folderDivBox = document.createElement('div');
    folderDiv.textContent = folderName + ': ' + totalNumberFound;
    folderDiv.dataset.folderId = folderId;
    folderDiv.style.lineHeight= "25px";
    folderDiv.style.borderWidth = '2px';
    folderDiv.style.borderColor = black;
    folderDiv.style.padding = '4px';
        folderDiv.style.transition = '.2s linear';
      folderDiv.style.width = "max-content";
    folderDiv.style.borderRadius = '2px';
    folderDiv.style.borderStyle = 'dashed';
    folderDiv.style.cursor = 'pointer';
    folderDiv.draggable = true; // Enable draggable behavior
      folderDiv.appendChild(folderDivBox)
      folderDiv.style.display = "flex";
      folderDiv.style.flexDirection = "column-reverse"
      if (userTaskColor){
          console.log(userTaskColor);
          folderDivBox.style.backgroundColor = userTaskColor;
      }else{
      folderDivBox.style.backgroundColor = "#1D005F";}
      folderDivBox.style.transition = '.2s linear';
      folderDivBox.className = 'folder'
      folderDivBox.style.width = "100%";
      folderDivBox.style.padding = '4px';
      folderDivBox.style.borderRadius = '2px';
       folderDivBox.style.textAlign = "center";
      folderDivBox.style.zIndex = "9999";
      folderDivBox.style.display = "flex";
          if (toggleMin < 2) {
      folderDivBox.style.opacity = "0";
      folderDivBox.style.pointerEvents = "none";
    }
                if (toggleMin == 2) {
        folderDivBox.style.opacity = "1";
      folderDivBox.style.pointerEvents = "auto";
    }


      folderDivBox.style.flexDirection = "column-reverse"
    maxDataDocs.forEach(function(doc) {

  var title = doc.title;
  var id = doc.id;

  var div = document.createElement('div');
        div.style.whiteSpace = 'nowrap'
div.style.borderBottom = "2px dashed #fff";
        var siteValue = findValueById(doc, 'site');
if (siteValue !== null) {
   div.textContent = siteValue;
} else {
   div.textContent = title;
}

          div.addEventListener('mouseenter', function() {
    div.style.opacity = '0.8';
  });

  div.addEventListener('mouseleave', function() {
    div.style.opacity = '1';
  });
  div.addEventListener('click', function() {
    var url = 'https://sim.amazon.com/issues/' + id;
    window.open(url, '_blank');
  });

  folderDivBox.appendChild(div);
});
    (function (folderId) {
      folderDiv.addEventListener('click', function () {
          event.stopPropagation();
        openSIMqueue(folderId);
      });
    })(folderId);

    (function (folderEntry) {
      folderDiv.addEventListener('contextmenu', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var confirmation = confirm('Are you sure you want to remove this folder, '+folderName+'?');
        if (confirmation) {
          var updatedFolderList = folderList.filter((entry) => entry !== folderEntry);
          GM_setValue('SIMfolderList', JSON.stringify(updatedFolderList));
          displayFolders();
        }
      });
    })(folderEntry);

          folderDiv.onmouseenter = function (e) {
              let folderDivFound = this.getElementsByClassName('folder')[0]
if(folderDivFound){
                    folderDivFound.style.opacity = "1";
      folderDivFound.style.pointerEvents = "auto";
}
    }


    // Add dragstart event listener to start dragging the folder
    folderDiv.addEventListener('dragstart', function (e) {
      draggedFolder = this;
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', this.dataset.folderId);
    });

    // Add dragover event listener to allow dropping
    folderDiv.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });


    // Add drop event listener to handle the drop action
    folderDiv.addEventListener('drop', function (e) {
      e.preventDefault();
      var folderIdToMove = e.dataTransfer.getData('text/plain');
      var folderToMove = document.querySelector('[data-folder-id="' + folderIdToMove + '"]');
      if (folderToMove !== this) {
        var folderToMoveIndex = Array.from(this.parentNode.children).indexOf(folderToMove);
        var dropIndex = Array.from(this.parentNode.children).indexOf(this);

        // Rearrange the folderList array
        folderList.splice(dropIndex, 0, folderList.splice(folderToMoveIndex, 1)[0]);
        GM_setValue('SIMfolderList', JSON.stringify(folderList));
        displayFolders(); // Update the display after rearranging the array
      }
    });

    folderBox.appendChild(folderDiv);
  }
}
}

function findValueById(jsonObj, id) {
  if (typeof jsonObj === 'object') {
    if (jsonObj.hasOwnProperty('id') && jsonObj.id === id) {
      return jsonObj.value;
    } else {
      for (var key in jsonObj) {
        var value = findValueById(jsonObj[key], id);
        if (value !== null) {
          return value;
        }
      }
    }
  }
  return null;
}
    function openSIMqueue(Id){
let SIMurlp1 = "https://sim.amazon.com/issues/search?q=status%3A(Open)+in%3A("
let SIMurlp2 = ")&sort=lastUpdatedDate+desc"
if(Id){
 window.open(SIMurlp1+Id+SIMurlp2, "_blank")
}


    }

    function extractIdFromUrl(url) {
  const regex = /in%3A\((.*?)\)/;
  const match = url.match(regex);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

    // Check if the tab is active or in the foreground
function isTabActive() {
  return !document.hidden;
}

// Handle tab visibility change
function handleVisibilityChange() {
  if (isTabActive()) {
    // Tab is now active, perform necessary actions
    // For example, refresh the data
    refreshData();
  } else {
    // Tab is now inactive, stop any ongoing actions
    // For example, clear any timers or intervals
    stopDataRefresh();
  }
}

// Register event listener for visibility change
document.addEventListener("visibilitychange", handleVisibilityChange);

// Example function to refresh data
function refreshData() {
console.log("Refreshing data...");
toggleActive = true;
}

// Example function to stop data refresh
function stopDataRefresh() {
console.log("Stopping data refresh...");
toggleActive = false;
}


function calculateTimeDifference(createDate) {
    // Parse the createDate string into a Date object
    let createdDate = new Date(createDate);

    // Get the current date and time
    let now = new Date();

    // Calculate the difference in minutes
    let differenceInMilliseconds = now.getTime() - createdDate.getTime();
    let differenceInMinutes = Math.floor(differenceInMilliseconds / 1000 / 60);

    return differenceInMinutes;
}
    function changePadding(){

var elements = document.getElementsByClassName('document-stream');

for (var i = 0; i < elements.length; i++) {
    var item = elements[i];

    if (item instanceof HTMLElement) {
        elements[i].style.paddingBottom = "3rem";
    }
}
    }
})();