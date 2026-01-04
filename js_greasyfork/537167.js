// ==UserScript==
// @name        OnlineGDB Clean UI and Local AUtosave
// @namespace   onlinegdb.com
// @match       https://www.onlinegdb.com/*
// @version     1.0
// @author      AngelaPuzzle
// @license     GNU GPLv3
// @description Adds a button to temporarily clean the UI and adds a local autosave feature
// @icon        https://www.onlinegdb.com/favicon.ico
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/537167/OnlineGDB%20Clean%20UI%20and%20Local%20AUtosave.user.js
// @updateURL https://update.greasyfork.org/scripts/537167/OnlineGDB%20Clean%20UI%20and%20Local%20AUtosave.meta.js
// ==/UserScript==



//Checks if we are editing or in read only mode by checking the existance of the new file buttons
const editMode = !!document.getElementById("control-btn-newfile");

let autoSaveStatus = false;

const hideablesIds = {
  buttons: ["control-btn-share", "control-btn-save", "control-btn-beautify"],
  buttonsByChild: ["control-btn-newfile", "control-btn-download", "control-btn-fork"],
  sidebar: "left-component"
}


let presElements = {
  mainArea: {
    element: document.getElementById("right-component")
  },
  rightButtonBar: {
    element: document.getElementsByClassName("col-sm-64")[0].children[0]
  }
}

//The button shown in the rightButtonBar
var presButton;

//Sidebar to add the Autosave buttons
var sidebarNavbar = document.getElementsByClassName("nav nav-tabs nav-stacked text-center")[0]

//0: Enable Autosave, 1: Load Autosave
let navbarButtons = []

//codeeditor = document.getElementById("editor_1")

function start() {
  presButton = appendbutton(
    presElements.rightButtonBar.element,
    'btn btn-success',
    'glyphicon glyphicon-play',
    'presentationMode();'
  );
  presElements.rightButtonBar.element.style.paddingRight = "50px";

  if (editMode) {
    addNavbarButtons();
  }
}

function addNavbarButtons() {
  let button;
  //Autosave Button
  let newEnableButton = document.createElement('li')
  let newEnableButtonHref = document.createElement('a')
    newEnableButtonHref.setAttribute('onclick', 'enableAutosave();')
    newEnableButtonHref.text = "Autosave: OFF";
  newEnableButton.appendChild(newEnableButtonHref)

  //Load Autosave Button
  let newLoadButton = document.createElement('li')
  let newLoadButtonHref = document.createElement('a')
    newLoadButtonHref.setAttribute('onclick', 'loadAutosave();')
    newLoadButtonHref.text = "Load Autosave"
  newLoadButton.appendChild(newLoadButtonHref)

  button = sidebarNavbar.appendChild(newEnableButton)
  navbarButtons.push(button)

  button = sidebarNavbar.appendChild(newLoadButton)
  navbarButtons.push(button)
}

function appendbutton(element, class_name, glyphicon, function_name) {
  let newButton = document.createElement('button');
    newButton.type = 'submit';
    newButton.setAttribute('class', class_name);
    newButton.setAttribute('onclick', function_name);
    newButton.style.fontSize = 'small'

  let newSpan = document.createElement('span');
    newSpan.setAttribute('class', glyphicon);
    newSpan.ariaHidden = true;

  newButton.appendChild(newSpan);

  return element.appendChild(newButton);
}

function autosaveLoop() {
  let files = ide.editor.get_files();
  GM_setValue("autosaveFiles", files);
  navbarButtons[0].children[0].text = "Autosave: ON";
  navbarButtons[1].remove();
  autoSaveStatus = true;
  setTimeout(autosaveLoop, 5000);
}



unsafeWindow.enableAutosave = function() {
  let confirmation = window.confirm("Turn Autosave On?\n\nThis will delete the last autosave");

  if (confirmation && !autoSaveStatus) {
    autosaveLoop();
  }
}

unsafeWindow.loadAutosave = function() {
  let confirmation = window.confirm("Load Autosave?\n\nThe current files will be lost");

  if (!confirmation) {
    return;
  }

  let files = GM_getValue("autosaveFiles", -1);

  if (files == -1) {
    alert("No Autosave in storage!");
  }
  else {
    ide.editor.clear_all_editors();
    console.log(files)
    ide.editor.set_files(files);
    ide.editor.delete_file("");
    if (!autoSaveStatus) {
      autosaveLoop();
    }
  }
}

unsafeWindow.presentationMode = function() {

  //Sets the current offset as a key in mainArea
  presElements.mainArea.offset = presElements.mainArea.element.style.left;

  //Fix the value of mainArea and rightButtonBar
  presElements.mainArea.element.style.left = "0%";


  ///Sets display = "none" for the elements in hideablesIds as following
  //Hide sidebar
  let id = hideablesIds.sidebar;
  document.getElementById(id).style.display = "none";

  //Hide buttons directly
  for (let id of hideablesIds.buttons) {
    let element = document.getElementById(id)
    if (element != null) {
      element.style.display = "none";
    }
  }

  //Hide the parent of this buttons
  for (let id of hideablesIds.buttonsByChild) {
    let element = document.getElementById(id)
    if (element != null && element.parentNode != null) {
      element.parentNode.style.display = "none";
    }
  }

  //Setup the button
  presButton.remove()

  presButton = appendbutton(
    presElements.rightButtonBar.element,
    'btn btn-primary',
    'glyphicon glyphicon-stop',
    'exitPresentationMode();'
  );

}

unsafeWindow.exitPresentationMode = function() {

  //Fix the value of mainArea
  presElements.mainArea.element.style.left = presElements.mainArea.offset;

  ///Removes the display property for the elements in hideablesIds as following
  //Hide sidebar
  let id = hideablesIds.sidebar;
  document.getElementById(id).style.display = "";

  //Hide buttons directly
  for (let id of hideablesIds.buttons) {
    let element = document.getElementById(id)
    if (element != null) {
      element.style.display = "";
    }
  }

  //Hide the parent of this buttons
  for (let id of hideablesIds.buttonsByChild) {
    let element = document.getElementById(id)
    if (element != null) {
      element.parentNode.style.display = "";
    }
  }

  //Setup the button
  presButton.remove()

  presButton = appendbutton(
    presElements.rightButtonBar.element,
    'btn btn-success',
    'glyphicon glyphicon-play',
    'presentationMode();'
  );

}

start()