// ==UserScript==
// @name        myconnectwise.net enhancements
// @namespace   Violentmonkey Scripts
// @match       https://aus.myconnectwise.net/v202*ise.aspx
// @grant       none
// @version     2.25
// @author      mike-Inside
// @description Modifies Manage page to allow for collapsible ticket notes
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/481044/myconnectwisenet%20enhancements.user.js
// @updateURL https://update.greasyfork.org/scripts/481044/myconnectwisenet%20enhancements.meta.js
// ==/UserScript==

// watch the page for elements that are created dynamically and may not be ready even on document-end
const disconnect = VM.observe(document.body, () => {

  const autosortServiceBoardByAge = true;

  // find the target node
  const ticketField = document.querySelector('#SR_Service_RecID-input');
  const rowWrap = document.querySelectorAll(".TicketNote-rowWrap");
  //const comboBox = document.querySelectorAll(".cw_CwComboBox"); //might be needed later if I want to do different sorting depending on the board

  // runs on service board pages to stop autocomplete from blocking visibility
  if (ticketField) {
    ticketField.setAttribute("autocomplete", "off");

    // wait an additonal couple of seconds for page to finish loading
    setTimeout(function() {
      if (autosortServiceBoardByAge) {
        clickHeader("Age"); // sort by age
      }
    }, 1000);

    return true;
  }

  // runs on individual ticket pages
  if (rowWrap[0]) { // wait until the ticket notes have been generated before starting the script
    // start by generating the primary controller buttons
    generateControls();

    // wait an additonal couple of seconds for all ticket notes to finish loading
    setTimeout(function() {
      modifyNotes();
    }, 2000);

    // disconnect observer
    return true;
  }
});


function generateControls(){
  let noteTab = document.querySelectorAll(".TicketNote-newNoteButton");
  let controlButtons = document.getElementsByClassName("control-button"); // make sure we don't add them more than once

  if(noteTab[0] && controlButtons.length == 0) {
    noteTab[0].nextElementSibling.style.display = "none"; //hide the buttons that filter by ticket type - this conflicts with my changes and sometimes causes the entire notes section to disappear
    noteTab[0].after(createButton("Next"));
    noteTab[0].after(createButton("Previous"));
    noteTab[0].after(createButton("Expand All"));
    noteTab[0].after(createButton("Collapse All"));
  }
}

// used for the controller buttons above the notes, they are all exactly the same except for their content
function createButton(buttName){
  let bCss = "padding:3px; margin-left:12px; margin-bottom:0px; margin-top:22px; font-size:0.90em; width:125px";
  let butt;

  butt = document.createElement("button");
  butt.classList.add("control-button");
  butt.style.cssText = bCss;
  butt.textContent = buttName;
  butt.addEventListener("click", buttonPress);
  return butt;
}

// runs when a controller button is pressed, loops through ticket notes to set the display attribute
function buttonPress(evt){
  let buttName = evt.currentTarget.textContent;
  let newDisplayState = 0;
  if (buttName == "Expand All") {
    newDisplayState = 1;
  }
  let coll = document.getElementsByClassName('collapsible');
  if (coll.length == 0) { // check if collapsibles have been wiped out (eg. by a ticket note refresh)
    modifyNotes();
  }
  let found = -1; // value to store the location of the first ticket note which is visible / not hidden
  for (let i = 0; i < coll.length; ++i) {
    let initialState = displayChange(coll[i], newDisplayState);

    if(newDisplayState == 0 && initialState != "none" && found < 0) {
      found = i;
    }
  }

  if(buttName == "Previous") {
    if (found > 0) { // open the note prior to the one that was open before the 'previous' button was clicked, unless...
      displayChange(coll[found-1], 1);
    } else { // ...if no note open, or the first note was open, then open the final note
      displayChange(coll[coll.length-1], 1);
    }
  } else if (buttName == "Next") {
    if (found < coll.length-1) { // if no note was open, or any note except the last note was open, then open the next note after the opened one
      displayChange(coll[found+1], 1);
    } else { // otherwise open the first note
      displayChange(coll[0], 1);
    }
  }
}

function modifyNotes(){
  const rowWrap = document.querySelectorAll('.TicketNote-rowWrap');
  rowWrap.forEach((rowItem) => {

    // create button to be placed above each ticket note
    let butt = document.createElement("button");
    butt.classList.add("collapsible");
    butt.style.cssText = 'padding:3px; margin-bottom:0px; margin-top:0px; width:100%; font-size:0.90em';
    butt.innerHTML = "";

    let basicName = classText(rowItem, "TicketNote-basicName", "<strong>", "</strong>")
    let clickableName = classText(rowItem, "TicketNote-clickableName", "<strong>", "</strong>")
    butt.innerHTML += basicName + clickableName; // add name to button

    // let timeDateText = classText(rowItem, "TimeText-date", " [","]"); // copy date to button without any changes - nah
    // let's instead change date to Australian locale:
    let timeDateChild = rowItem.getElementsByClassName("TimeText-date");
    if (timeDateChild[0]) {
      let timeDateText = timeDateChild[0].textContent;
      let timeDateHTML = timeDateChild[0].innerHTML;
      const regexDate = new RegExp(/(\d{1,2})\/(\d{1,2})\/(\d{4})/, "g"); //matches date, make sure you have got connectwise using (en-AU) D/M/YYYY format
      // set language to English Australia in browser, then clear cookies and cache
      //let timeDateFormat = timeDateText.replace(regexDate, "$2/$1/$3"); // simple method to just swap month and day around - nah let's go all in
      let timeDateMatch = regexDate.exec(timeDateText);
      let dateObject = new Date(timeDateMatch[3],timeDateMatch[2]-1,timeDateMatch[1]); //creates JS Date object, note month parameter is inexplicably 0-11 to represent jan-dec
      const dateOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      let dateFormat = dateObject.toLocaleString("en-AU", dateOptions);
      let timeDateFormat = timeDateText.replace(regexDate, dateFormat); //adds the time info back to formatted date
      butt.innerHTML += " [" + timeDateFormat + "]"; //adds date to button
      //timeDateChild[0].innerHTML = timeDateChild[0].innerHTML.replace(timeDateText, ""); // we could just delete the existing date, but people may want to copy/paste it
      timeDateFormat = "<span style=\"color:#fff;opacity:0.1\">" + timeDateFormat + "<\/span>"; //date can still be selected and copied, but is not too noticible
      timeDateChild[0].innerHTML = timeDateChild[0].innerHTML.replace(timeDateText, timeDateFormat); //replaces the existing date inside ticket note with formatted date
    }

    // this is the pill shaped icon that shows for 'resolved' or 'internal' notes
    let pill = rowItem.getElementsByClassName("TicketNote-pill");
    let pillText = "";
    if (pill[0]) {
       pillText = pill[0].innerText;
    }

    //rowItem.style.removeProperty('margin-top');
    rowItem.style.cssText = "margin-top:6px";

    // set custom styles for each ticket button
    if (pillText == "Internal") {
      butt.style.cssText += ";background-color:#026CCF;color:#DDEEFF;text-align:right";
      rowItem.style.cssText += ";background-color:#ecf2ff";
    } else if (pillText == "Resolution") {
      butt.style.cssText += ";background-color:#549c05;color:#DDFFCC;text-align:right";
      rowItem.style.cssText += ";background-color:#ecfff2";
    } else if (clickableName.length > 0) { //only falco team have this class
      butt.style.cssText += ";background-color:#AABBEE;color:#3366AA;text-align:right";
    } else if (basicName.length > 0) { // only end users have this class
      butt.style.cssText += ";background-color:#CCAAEE;color:#6644AA;text-align:left";
    }
    // rowItem.parentElement.insertBefore(butt, rowItem); //previous method, works but causes issues
    // instead we place the button inside the "TicketNote-rowWrap" class so that it will get wiped if the ticket notes are refreshed
    let rowChild = rowItem.getElementsByClassName("TicketNote-row");
    if (rowChild[0]) {
      rowChild[0].before(butt);
    }

  } );

  //add click listener functions to all collapsible buttons
  var coll = document.getElementsByClassName("collapsible");
  for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
      this.classList.toggle("active");
      displayChange(this, -1);
    });
  }
}

// toggle the display state of the sibling element that is directly after the passed parameter
// (We use this to hide or show the 'TicketNote-row' located directly after the 'collapsible' button in the DOM)
function displayChange(collapsible, state = -1) {
  // state -1 toggle, 0 off, 1 on
  let content = collapsible.nextElementSibling;
  let initialState = content.style.display;
  if ((state != 0 && initialState === "none"))  {
    content.style.display = "flex";
  } else if (state < 1) {
    content.style.display = "none";
  }
  return initialState; // returns the state the element was in *prior* to being changed
}


// find first matching classString that is a child of the startParent, return its innerText with optional pre/postfix text
// ended up not using this much, special handling required too often
function classText(startParent, classString, prefix = "", postfix = "") {
  let foundChild = startParent.getElementsByClassName(classString);
  if (foundChild[0]) {
    return prefix + foundChild[0].innerText + postfix;
  } else {
    return "";
  }
}


function clickHeader(text){
  //const boardHeaders = document.querySelectorAll('.GL4OBY5BBEI');
  const boardHeaders = document.querySelectorAll('.GL4OBY5BDEI');
  if(boardHeaders[0]) {
    for (var i=0, im=boardHeaders.length; im>i; i++) {
      if(boardHeaders[i].nextSibling.innerHTML == text){
        boardHeaders[i].nextSibling.click();
      }
    }
  }
}

// Press Control-i in order to:
// * Regenerate the controls and buttons on ticket page
// * sort by Age on a service board page
VM.shortcut.register('c-i', () => {
  generateControls();
  modifyNotes();
  clickHeader("Age");
  // just a reminder to self on ways to debug output:
  // console.log('You just pressed Ctrl-I');
  // alert("I am an alert box!");
});

// sort by Status on a service board page
VM.shortcut.register('c-o', () => {
  clickHeader("Status");
});
