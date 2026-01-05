// ==UserScript==
// @name        Arf Tools
// @namespace   http://www.ar15.com
// @include     *ar15.com/*
// @version     1.3
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_listValues
// @grant       GM_deleteValue
// @description Various tools for Arfcom
// @downloadURL https://update.greasyfork.org/scripts/2219/Arf%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/2219/Arf%20Tools.meta.js
// ==/UserScript==

//Weird bit.  Keep trying to get left position of tool button dynamically and it never comes out.  Have to hard code. :/
var LEFT_POSITION = 358;
var ACTIVE_WINDOW;

//Key Prefixes
var BAD_WORD_PREFIX = "BadWord_";
var ENHANCE_POST_PREFIX = "EnhancePost_";
var ENHANCE_POST_USER_PREFIX = "EnhancePost_User";
var IGNORE_PREFIX = "IgnoreUser_";
var VALID_KEYS_REGEX_STRING = ["(^" + BAD_WORD_PREFIX + "\\d+$)" + '|' +
        "(^DrunkBoxChecked$)" + '|' +
        "(^SaveIMsBoxChecked$)" + '|' +
        "(^" + ENHANCE_POST_PREFIX + ")" + '|' +
        "(^" + IGNORE_PREFIX + ")"
];
var VALID_KEYS_REGEX = new RegExp(VALID_KEYS_REGEX_STRING);

//A post ignored by the site - I believe the max # of posts per page is 50, so this shouldn't ever run into the 100s
var IGNORE_ID_REGEX = new RegExp("^igid\\d+$");
//A post ignored by this program
var IGNORED_BY_THIS_ID_REGEX = new RegExp("^igid\\d{3}$");

//Should be unlikely to see this in a string
var SETTINGS_DELIM = ']|[';
var EMPTY_SETTINGS_REGEX = '^(' + escapeRegExp(SETTINGS_DELIM) + ')+$';

//Other settings
var EMPTY_ORIGINAL_STYLE = 'empty';

//*****************************************************
//*************** MAIN GUI FUNCTIONALITY **************
//*****************************************************

//I am making the choice to read from the saved values, rather than what's in the GUI.

//I definitely agree that this can not be the right way to do this.
//The 2nd instance of div class "usernamePlateLogged" is the Tools button
var potentialTools = document.getElementsByClassName('usernamePlateLogged');
if(potentialTools.length > 1) {
    var toolsButton = createToolsButton();

    var arfToolsButton = potentialTools[1];
    arfToolsButton.parentNode.insertBefore(toolsButton, arfToolsButton.nextSibling);

    buildMainOptionsDiv();

    initializeSubmitButton();
    checkSaveIMsBox();
    lookAtAllPosts(null);
}

function createToolsButton() {
    var toolLink = document.createElement('a');
    //There's probably a better way to do this too
    toolLink.href="javascript:return false;";
    toolLink.appendChild(document.createTextNode("Script Tools"));
    toolLink.addEventListener("click", toggleShowOptions);

    var toolsButtonDiv1 = document.createElement("div");
    toolsButtonDiv1.className = "usernameTabRight";
    toolsButtonDiv1.appendChild(toolLink);

    var toolsButtonDiv2 = document.createElement("div");
    toolsButtonDiv2.className = "usernameTabLeft";
    toolsButtonDiv2.appendChild(toolsButtonDiv1);

    var toolsButtonDiv3 = document.createElement("div");
    toolsButtonDiv3.className = "usernameTabBg";
    toolsButtonDiv3.appendChild(toolsButtonDiv2);

    var toolsButtonDiv4 = document.createElement("div");
    toolsButtonDiv4.className = "usernamePlateLogged";
    toolsButtonDiv4.setAttribute("style","width:78px;");
    toolsButtonDiv4.appendChild(toolsButtonDiv3);
    toolsButtonDiv4.id = 'ToolButtonDiv';

    return toolsButtonDiv4;
}

function toggleShowOptions() {
    var toggleDiv = document.getElementById("MainOptionsWindow");
    if(toggleDiv.style.display == 'none') {
        toggleDiv.style.display = 'inline';
    } else {
        toggleDiv.style.display = 'none';
        if(ACTIVE_WINDOW) {
            ACTIVE_WINDOW.style.display = 'none';
            closeWindow('enhancePost_colorPicker');
        }
        ACTIVE_WINDOW = null;
    }
}

function toggleSecondaryOptions() {
    var toggleDiv = document.getElementById("MainOptionsWindow");
    if(ACTIVE_WINDOW) {
        if(ACTIVE_WINDOW.style.display == 'none') {
            ACTIVE_WINDOW.style.left = (LEFT_POSITION + toggleDiv.offsetWidth + 5) + "px";
            ACTIVE_WINDOW.style.display = 'inline';
        } else {
            ACTIVE_WINDOW.style.display = 'none';
            ACTIVE_WINDOW = null;
        }
    }
}

function buildMainOptionsDiv() {
    var mainOptionsDiv = buildOptionWindow();
    mainOptionsDiv.style.display = 'none';
    mainOptionsDiv.id = "MainOptionsWindow";
    mainOptionsDiv.style.left = LEFT_POSITION + 'px';

    var enhancedIgnoreWindow = buildEnhancedIgnoreWindow();
    var enhancedPostWindow = buildEnhancedPostWindow();
    var saveIMsWindow = buildSaveIMsWindow();
    var drunkOptionsWindow = buildDrunkWindow();
    var fixLinksWindow = buildFixLinksWindow();
    var importExportWindow = buildImportExportWindow();

    var enhancedIgnoreDiv = buildLinkToOptionsWindow(enhancedIgnoreWindow, "Ignore User's Posts");
    var enhancedPostDiv = buildLinkToOptionsWindow(enhancedPostWindow, "Enhance User's Posts");
    var saveIMsDiv = buildLinkToOptionsWindow(saveIMsWindow, "Always Save Sent IMs");
    var drunkDiv = buildLinkToOptionsWindow(drunkOptionsWindow, "Drunk Check Options");
    var fixLinksDiv = buildLinkToOptionsWindow(fixLinksWindow, "Fix Archive/Mobile Link");
    var importExportDiv = buildLinkToOptionsWindow(importExportWindow, "Import/Export Settings");

    enhancedIgnoreDiv.addEventListener("click", function() {
        //This runs after the open/close functionality built in to buildLink
        if(enhancedIgnoreWindow.style.display != 'none') {
            reloadIgnoreFields();
        }
    }, false);

    enhancedPostDiv.addEventListener("click", function() {
        //This runs after the open/close functionality built in to buildLink
        if(enhancedPostWindow.style.display != 'none') {
            reloadEnhancePostFields();
        }
    }, false);

    saveIMsDiv.addEventListener("click", function() {
        if(saveIMsWindow.style.display != 'none') {
            loadIMsOptions();
        }
    }, false);

    drunkDiv.addEventListener("click", function() {
        if(drunkDiv.style.display != 'none') {
            reloadDrunkOptions();
        }
    }, false);

    fixLinksDiv.addEventListener("click", function() {
        if(drunkDiv.style.display != 'none') {
            clearFixLinks();
        }
    }, false);

    importExportDiv.addEventListener("click", function() {
        if(importExportDiv.style.display != 'none') {
            clearImportExportFields();
        }
    }, false);

    var dividerLineDiv = document.createElement("div");
    dividerLineDiv.style.border = '1px solid';
    dividerLineDiv.style.marginTop = "5px";
    dividerLineDiv.style.marginBottom = "5px";

    mainOptionsDiv.appendChild(enhancedIgnoreDiv);
    mainOptionsDiv.appendChild(enhancedPostDiv);
    mainOptionsDiv.appendChild(saveIMsDiv);
    mainOptionsDiv.appendChild(drunkDiv);
    mainOptionsDiv.appendChild(dividerLineDiv);
    mainOptionsDiv.appendChild(fixLinksDiv);
    mainOptionsDiv.appendChild(importExportDiv);

    var arfToolsDropDown = document.getElementById("MainMenuID2");
    arfToolsDropDown.parentNode.insertBefore(mainOptionsDiv, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(enhancedIgnoreWindow, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(enhancedPostWindow, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(saveIMsWindow, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(drunkOptionsWindow, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(fixLinksWindow, arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(importExportWindow, arfToolsDropDown.nextSibling);

    //Tertiary windows
    var enhancePost_colorPicker = createColorPickerPopup('enhancePost_colorPicker');
    arfToolsDropDown.parentNode.insertBefore(enhancePost_colorPicker, arfToolsDropDown.nextSibling);

    arfToolsDropDown.parentNode.insertBefore(buildPopupEnhanceWindow(), arfToolsDropDown.nextSibling);
    arfToolsDropDown.parentNode.insertBefore(buildPopupIgnoreWindow(), arfToolsDropDown.nextSibling);
}

function clearAllSettings() {
    var keys = GM_listValues();
    for (var i=0, key=null; key=keys[i]; i++) {
        GM_deleteValue(key);
    }
}

function loadAllOptions() {
    loadIgnoreFields();
    loadEnhancePostOptions();
    loadIMsOptions();
    loadDrunkOptions();
    clearFixLinks();
    clearImportExportFields();
}

function reloadAllOptions() {
    reloadIgnoreFields();
    reloadEnhancePostFields();
    loadIMsOptions();
    reloadDrunkOptions();
    clearFixLinks();
    clearImportExportFields();
}

//*****************************************************
//*******************ENHANCE IGNORE********************
//*****************************************************
function buildEnhancedIgnoreWindow() {
    var ignoreWindow = buildOptionWindow();
    ignoreWindow.id = "IgnoreWindow";

    var headerDiv = buildHeaderDiv("Ignore User's Posts Options");
    var textFieldsDiv = document.createElement("div");
    textFieldsDiv.id="IgnoreDivs";
    textFieldsDiv.style.marginBottom = "10px";

    var addUserBtnDiv = document.createElement('div');
    addUserBtnDiv.style.marginTop = '10px';
    var addUserBtn = createButton("New User");
    addUserBtn.addEventListener("click", function() {
        textFieldsDiv.appendChild(buildIgnoreDiv(textFieldsDiv, ""));
    }, false);

    addUserBtnDiv.appendChild(addUserBtn);

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.addEventListener("click", function() {
        if(saveIgnoreOptions()) {
            toggleSecondaryOptions();
        }
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        toggleSecondaryOptions();
    }, false);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    ignoreWindow.appendChild(headerDiv);
    ignoreWindow.appendChild(textFieldsDiv);
    ignoreWindow.appendChild(addUserBtn);
    ignoreWindow.appendChild(saveCancelBtnDiv);

    return ignoreWindow;
}

//[["User", nameField, removeLink], "note", noteField]
function buildIgnoreDiv(parentNode, valueText, noteText) {
    if(valueText == null) {
        valueText = "";
    }

    if(noteText = null) {
        noteText = "";
    }

    var ignoreDiv = document.createElement("div");

    var textDiv = document.createElement("div");

    var nameField = document.createElement("input");
    nameField.setAttribute("type", "text");
    nameField.setAttribute("value", valueText);
    nameField.setAttribute("size", 25);
    nameField.setAttribute("maxlength", 50);
    nameField.setAttribute("name", "ignoreField");
    nameField.style.marginLeft = '10px';

    var noteField = document.createElement("textarea");
    noteField.cols = 27;
    noteField.rows = 1;
    noteField.value = noteText;
    noteField.maxlength = 200;
    noteField.type = "text";
    noteField.style.marginLeft = '11px';

    var removeImage = document.createElement("img");
    removeImage.src = 'http://www.ar15.com/images/2008skins/icons/iconDelForum.png';
    removeImage.title = 'Remove User';
    removeImage.alt = 'Remove User';
    removeImage.style.verticalAlign = 'middle';
    removeImage.style.marginLeft = '10px';

    var removeLink = document.createElement("a");
    removeLink.href ="javascript:return false;";
    removeLink.appendChild(removeImage);
    if(parentNode) {
        removeLink.addEventListener("click", function() {
            parentNode.removeChild(ignoreDiv);
        }, false);
    }

    textDiv.appendChild(document.createTextNode("User"));
    textDiv.appendChild(nameField);
    textDiv.appendChild(removeLink);

    textDiv.style.marginTop = '2px';
    textDiv.style.marginBottom = '2px';

    ignoreDiv.appendChild(textDiv);
    ignoreDiv.appendChild(document.createTextNode("Note"));
    ignoreDiv.appendChild(noteField);

    return ignoreDiv;
}

function saveIgnoreOptions() {
    var div = document.getElementById("IgnoreDivs");
    //Collecting words list
    var users = [];
    var notes = [];
    var fieldsToRemove = [];

    var violatedDelim = false;

    for(var i = 0; i < div.childNodes.length; i++) {
        var ignoreDiv = div.childNodes[i];
        if(ignoreDiv != null) {
            var userDiv = ignoreDiv.childNodes[0];
            if(userDiv != null) {
                var textField = userDiv.childNodes[1];
                if(textField != null) {
                    var user = textField.value;
                    if(user != null && user.trim().length > 0) {
                        if(user.indexOf(SETTINGS_DELIM) != -1) {
                            violatedDelim = true;
                        } else {
                            users.push(user);
                            var noteField = ignoreDiv.childNodes[2];
                            if(noteField != null) {
                                var note = noteField.value;
                                if(note != null && note.trim().length > 0) {
                                    if(note.indexOf(SETTINGS_DELIM) == -1) {
                                        notes.push(note);
                                    } else {
                                        violatedDelim = true;
                                        break;
                                    }
                                } else {
                                    notes.push("");
                                }
                            } else {
                                notes.push("");
                            }
                        }
                    } else {
                        fieldsToRemove.push(ignoreDiv);
                    }
                }
            }
        }
    }

    if(violatedDelim) {
        //Do not want people using the SETTINGS_DELIM string in a user name or note.
        alert("The string " + SETTINGS_DELIM + " is not allowed.  It will break this functionality. Please remove it and try saving again.");
    } else {
        for(var i = 0; i < fieldsToRemove.length; i++) {
            div.removeChild(fieldsToRemove[i]);
        }

        //Delete the old saved words
        var keys = getKeysFromStorageByKeyPrefix(IGNORE_PREFIX);
        for(var i = 0; i < keys.length; i++) {
            GM_deleteValue(keys[i]);
        }

        //Save the new ones
        for(var i = 0; i < users.length; i++) {
            if(users.length > 0) {
                GM_setValue(IGNORE_PREFIX + users[i], notes[i]);
            }
        }
    }

    return !violatedDelim;
}

function cancelIgnoreOptions() {
    reloadIgnoreFields();
}

function loadIgnoreFields() {
    var div = document.getElementById("IgnoreDivs");

    var users = getKeysFromStorageByKeyPrefix(IGNORE_PREFIX);
    for(var i = 0; i < users.length; i++) {
        div.appendChild(buildIgnoreDiv(div, users[i].slice(IGNORE_PREFIX.length)), GM_getValue(users[i]));
    }
}

function removeAllIgnoreTextFields() {
    removeAllTextFields("IgnoreDivs", 'ignoreField');
}

function reloadIgnoreFields() {
    removeAllIgnoreTextFields();
    loadIgnoreFields();
}

function buildPopupIgnoreWindow() {
    var popupIgnoreWindow = buildOptionWindow();
    popupIgnoreWindow.style.top = '';
    popupIgnoreWindow.style.display = 'none';
    popupIgnoreWindow.id = "PopupIgnoreWindow";

    var headerDiv = buildHeaderDiv("Ignore User's Posts");
    var textFieldDiv = buildIgnoreDiv(null, "", "");
    textFieldDiv.id="PopupIgnoreFieldDiv";
    textFieldDiv.style.marginBottom = "10px";
    textFieldDiv.childNodes[0].childNodes[1].disabled = true;
    textFieldDiv.childNodes[0].childNodes[2].addEventListener("click", function() {
        //Seems dumb, but this allows me to keep the value for 'author' in the popup for the save action
        textFieldDiv.style.display = 'none';
    }, false);

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.id = 'PopupIgnoreSave';
    saveBtn.style.display = 'inline';
    saveBtn.addEventListener("click", function() {
        var field = textFieldDiv.childNodes[0].childNodes[1];
        var user = field.value;
        var violatedDelim = false;

        if(user != null && user.trim().length > 0) {
            //User wants to remove this user from the list
            if(textFieldDiv.style.display == 'none') {
                GM_deleteValue(IGNORE_PREFIX + user);
            } else {
                var note = textFieldDiv.childNodes[2].value;
                if(note == null) {
                    note = "";
                }
                violatedDelim = (note.indexOf(SETTINGS_DELIM) != -1);
                if(violatedDelim) {
                    //Do not want people using the SETTINGS_DELIM string in a user name or note.
                    alert("The string " + SETTINGS_DELIM + " is not allowed.  It will break this functionality. Please remove it and try saving again.");
                } else {
                    GM_setValue(IGNORE_PREFIX + user, note);
                }
            }

            if(!violatedDelim) {
                lookAtAllPosts(user);
            }
        }

        if(!violatedDelim) {
            popupIgnoreWindow.style.display = 'none';
        }
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.style.display = 'inline';
    cancelBtn.addEventListener("click", function() {
        popupIgnoreWindow.style.display = 'none';
    }, false);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    popupIgnoreWindow.appendChild(headerDiv);
    popupIgnoreWindow.appendChild(textFieldDiv);
    popupIgnoreWindow.appendChild(saveCancelBtnDiv);

    return popupIgnoreWindow;
}

function populatePopupIgnoreWindow(userName, note) {
    var textFieldDiv = document.getElementById("PopupIgnoreFieldDiv");
    textFieldDiv.style.display = 'inline';
    textFieldDiv.childNodes[0].childNodes[1].value = userName;
    textFieldDiv.childNodes[2].value = note;
}


//*****************************************************
//*****************ENHANCE USER POSTS******************
//*****************************************************
function buildEnhancedPostWindow() {
    var postWindow = buildOptionWindow();
    postWindow.id = 'EnhancePostWindow';

    var headerDiv = buildHeaderDiv("Enhance User's Posts Options");

    var subHeaderDiv = document.createElement("div");
    subHeaderDiv.style.marginBottom = "5px";

    var subHeaderLabel = document.createElement("label");
    subHeaderLabel.style.fontSize = '105%';
    subHeaderLabel.appendChild(document.createTextNode("User - Background Color - Text Color"));

    subHeaderDiv.appendChild(subHeaderLabel);

    var textFieldsDiv = document.createElement("div");
    textFieldsDiv.id="EnhancePostFields";
    textFieldsDiv.style.marginBottom = "10px";

    var addUserBtnDiv = document.createElement('div');
    addUserBtnDiv.style.marginTop = '10px';
    var addUserBtn = createButton("New User");
    addUserBtn.addEventListener("click", function() {
        textFieldsDiv.appendChild(buildEnhancePostDiv(textFieldsDiv, "", null, null));
    }, false);

    addUserBtnDiv.appendChild(addUserBtn);

    var changeOpDiv = document.createElement('div');
    changeOpDiv.id = 'EnhancePostChangeOpDiv';
    changeOpDiv.style.marginTop = '10px';

    var changeOpBox = createBox("EnhancePostChangeOpBox");
    var changeOpLabel = document.createElement("label");
    changeOpLabel.setAttribute('for', changeOpBox.id);
    changeOpLabel.appendChild(document.createTextNode("Change Post Color If OP"));

    changeOpDiv.appendChild(changeOpBox);
    changeOpDiv.appendChild(changeOpLabel);

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.addEventListener("click", function() {
        if(saveEnhancePostOptions()) {
            toggleSecondaryOptions();
        }
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        cancelEnhancedPostFields();
        toggleSecondaryOptions();
    }, false);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    postWindow.appendChild(headerDiv);
    postWindow.appendChild(subHeaderDiv);
    postWindow.appendChild(textFieldsDiv);
    postWindow.appendChild(addUserBtn);
    postWindow.appendChild(changeOpDiv);
    postWindow.appendChild(saveCancelBtnDiv);

    return postWindow;
}

//[["User", nameField, colorBox, textColor, removeLink], "Note", noteField]
function buildEnhancePostDiv(parentNode, userName, userColor, textColor, noteText) {
    if(userName == null || userName.trim().length == 0) {
        userName = "";
    }

    if(noteText == null || noteText.trim().length == 0) {
        noteText = "";
    }

    var enhanceDiv = document.createElement("div");

    var userDiv = document.createElement("div");

    var nameField = document.createElement("input");
    nameField.setAttribute("type", "text");
    nameField.setAttribute("value", userName);
    nameField.setAttribute("size", 25);
    nameField.setAttribute("maxlength", 50);
    nameField.setAttribute("name", "enhancePostField");
    nameField.style.display = 'inline-block';
    nameField.style.verticalAlign = 'top';
    nameField.style.marginLeft = '10px';

    var colorBox = document.createElement("td");
    colorBox.style.color = "#CC0000";
    colorBox.style.marginLeft = "7px";
    colorBox.style.height = '16px';
    colorBox.style.width = '16px';
    colorBox.style.display = 'inline-block';

    if(userColor) {
        colorBox.style.backgroundColor = userColor;
    } else {
        resetColorBox(colorBox);
    }

    colorBox.addEventListener("click", function() {showColorPicker(colorBox);}, false);

    var textBox = document.createElement("td");
    textBox.style.color = "#CC0000";
    textBox.style.marginLeft = "7px";
    textBox.style.height = '16px';
    textBox.style.width = '16px';
    textBox.style.display = 'inline-block';

    if(textColor) {
        textBox.style.backgroundColor = textColor;
    } else {
        resetColorBox(textBox);
    }

    textBox.addEventListener("click", function() {showColorPicker(textBox);}, false);

    var removeImage = document.createElement("img");
    removeImage.src = 'http://www.ar15.com/images/2008skins/icons/iconDelForum.png';
    removeImage.title = 'Remove User';
    removeImage.alt = 'Remove User';
    removeImage.style.verticalAlign = 'middle';
    removeImage.style.marginLeft = '10px';

    var removeLink = document.createElement("a");
    removeLink.href ="javascript:return false;";
    removeLink.style.display = 'inline-block';
    removeLink.style.verticalAlign = 'top';
    removeLink.appendChild(removeImage);

    if(parentNode != null) {
        removeLink.addEventListener("click", function() {
            parentNode.removeChild(enhanceDiv);
        }, false);
    }

    var noteField = document.createElement("textarea");
    noteField.cols = 27;
    noteField.rows = 1;
    noteField.value = noteText;
    noteField.maxlength = 200;
    noteField.type = "text";
    noteField.style.marginLeft = '11px';

    userDiv.appendChild(document.createTextNode("User"));
    userDiv.appendChild(nameField);
    userDiv.appendChild(colorBox);
    userDiv.appendChild(textBox);
    userDiv.appendChild(removeLink);

    userDiv.style.marginTop = '2px';
    userDiv.style.marginBottom = '2px';

    enhanceDiv.appendChild(userDiv);
    enhanceDiv.appendChild(document.createTextNode("Note"));
    enhanceDiv.appendChild(noteField);

    return enhanceDiv;
}

function showColorPicker(colorBox) {
    var colorPopup = document.getElementById('enhancePost_colorPicker');
    colorPopup.style.display = 'inline';


    if(ACTIVE_WINDOW) {
        colorPopup.style.left = ((colorBox.offsetWidth/2) + colorBox.offsetLeft + (ACTIVE_WINDOW ? ACTIVE_WINDOW.offsetLeft : 0)) + "px";
        colorPopup.style.top = (colorBox.offsetHeight + colorBox.offsetTop + (ACTIVE_WINDOW ? ACTIVE_WINDOW.offsetTop : 0) + 5) + "px";
    } else {
        var dimensions = colorBox.getBoundingClientRect();
        colorPopup.style.left = (window.pageXOffset + dimensions.left + (colorBox.offsetWidth/2)) + 'px';
        colorPopup.style.top = (window.pageYOffset + dimensions.top - colorPopup.offsetHeight - 5) + 'px';
    }

    colorPopup.style.zIndex = '10000';

    var popupColor;
    var popupText;
    if(colorBox.childNodes.length == 0) {
        popupColor = colorBox.style.backgroundColor;
        popupText = rgb2hex(popupColor);
    } else {
        popupColor = null;
        popupText = "";
    }

    document.getElementById('enhancePost_colorPickerSelectedTd').style.backgroundColor = popupColor;
    document.getElementById('enhancePost_colorPickerSelectedField').value = popupText;
    colorPopup.value = colorBox;
}

function resetColorBox(colorBox) {
    colorBox.style.backgroundColor = "#FFFFFF";

    //The line should be the only child that ever gets added to it
    if(colorBox.childNodes.length == 0) {
        var line = document.createElement("div");
        line.style.borderColor = "#CC0000";
        line.style.border = "1px solid";
        line.style.marginTop = "7px";
        colorBox.appendChild(line);
    }
}

function saveEnhancePostOptions() {
    var div = document.getElementById("EnhancePostFields");
    //Collecting users
    var userNames = [];
    var userColors = [];
    var textColors = [];
    var notes = [];
    var fieldsToRemove = [];

    var violatedDelim = false;

    for(var i = 0; i < div.childNodes.length; i++) {
        var userDiv = div.childNodes[i];
        if(userDiv != null) {
            var textField = userDiv.childNodes[0].childNodes[1];
            if(textField != null) {
                var user = textField.value;
                if(user != null && user.trim().length > 0) {
                    if(user.indexOf(SETTINGS_DELIM) != -1) {
                        violatedDelim = true;
                    } else {
                        userNames.push(user.trim());

                        var colorBox = userDiv.childNodes[0].childNodes[2];
                        if(colorBox && colorBox.childNodes.length == 0) {
                            userColors.push(rgb2hex(colorBox.style.backgroundColor));
                        } else {
                            userColors.push("");
                        }

                        var textBox = userDiv.childNodes[0].childNodes[3];
                        if(textBox && textBox.childNodes.length == 0) {
                            textColors.push(rgb2hex(textBox.style.backgroundColor));
                        } else {
                            textColors.push("");
                        }

                        var noteField = userDiv.childNodes[2];
                        if(noteField) {
                            var note = noteField.value;
                            if(note != null && note.trim().length > 0) {
                                if(note.indexOf(SETTINGS_DELIM) == -1) {
                                    notes.push(note);
                                } else {
                                    violatedDelim = true;
                                    break;
                                }
                            } else {
                                notes.push("");
                            }
                        } else {
                            notes.push("");
                        }
                    }
                } else {
                    fieldsToRemove.push(userDiv);
                }
            }
        }
    }

    if(violatedDelim) {
        //Do not want people using the SETTINGS_DELIM string in a user name or note.
        alert("The string " + SETTINGS_DELIM + " is not allowed.  It will break this functionality. Please remove it and try saving again.");
    } else {
        for(var i = 0; i < fieldsToRemove.length; i++) {
            div.removeChild(fieldsToRemove[i]);
        }

        //Delete the old saved users
        var keys = getKeysFromStorageByKeyPrefix(ENHANCE_POST_PREFIX);
        for(var i = 0; i < keys.length; i++) {
            GM_deleteValue(keys[i]);
        }

        //Save the new ones
        for(var i = 0; i < userNames.length; i++) {
            if(userColors[i] || textColors[i] || notes[i]) {
                GM_setValue(ENHANCE_POST_USER_PREFIX + user, userColors[i] + SETTINGS_DELIM + textColors[i] + SETTINGS_DELIM + notes[i]);
            } else {
                GM_deleteValue(ENHANCE_POST_USER_PREFIX + user);
            }
        }

        var opBox = document.getElementById("EnhancePostChangeOpBox");
        if(opBox.checked) {
            GM_setValue(ENHANCE_POST_PREFIX + "ChangeOp", opBox.checked);
        } else {
            GM_setValue(ENHANCE_POST_PREFIX + "ChangeOp", '');
        }
    }

    return !violatedDelim;
}

function loadEnhancePostOptions() {
    var div = document.getElementById("EnhancePostFields");

    var userSettings = getMapFromStorageByKeyPrefix(ENHANCE_POST_USER_PREFIX);
    for(var key in userSettings) {
        var settings = userSettings[key];

        key = key.slice(ENHANCE_POST_USER_PREFIX.length);

        if(!settings) {
            settings = ["", "", ""];
        }

        div.appendChild(buildEnhancePostDiv(div, key, settings[0], settings[1], settings[2]));
    }

    var opBox = document.getElementById("EnhancePostChangeOpBox");
    opBox.checked = (getBoxStatusFromStorage(ENHANCE_POST_PREFIX + "ChangeOp"));
}

function reloadEnhancePostFields() {
    removeAllEnhancePostTextFields();
    loadEnhancePostOptions();
}

function cancelEnhancedPostFields() {
    closeWindow('enhancePost_colorPicker');
}

function removeAllEnhancePostTextFields() {
    removeAllTextFields("EnhancePostFields", 'enhancePostField');
}

function buildPopupEnhanceWindow() {
    var popupEnhanceWindow = buildOptionWindow();
    popupEnhanceWindow.style.top = '';
    popupEnhanceWindow.style.display = 'none';
    popupEnhanceWindow.id = "PopupEnhanceWindow";

    var headerDiv = buildHeaderDiv("Enhance User's Posts");

    var subHeaderDiv = document.createElement("div");
    subHeaderDiv.style.marginBottom = "5px";

    var subHeaderLabel = document.createElement("label");
    subHeaderLabel.style.fontSize = '105%';
    subHeaderLabel.appendChild(document.createTextNode("User - Background Color - Text Color"));

    subHeaderDiv.appendChild(subHeaderLabel);

    var enhanceDiv = buildEnhancePostDiv(null, "", null, null, "");
    enhanceDiv.id="PopupEnhanceFieldDiv";
    enhanceDiv.style.marginBottom = "10px";
    enhanceDiv.childNodes[0].childNodes[1].disabled = true;
    enhanceDiv.childNodes[0].childNodes[4].addEventListener("click", function() {
        //Seems dumb, but this allows me to keep the value for 'author' in the popup for the save action
        enhanceDiv.style.display = 'none';
    }, false);

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.addEventListener("click", function() {
        var violatedDelim = false;
        var field = enhanceDiv.childNodes[0].childNodes[1];
        if(field) {
            var user = field.value;
            if(user != null && user.trim().length > 0) {
                //User wants to remove this user from the list
                if(enhanceDiv.style.display == 'none') {
                    GM_deleteValue(ENHANCE_POST_USER_PREFIX + user);
                } else {
                    var bgColor = "";
                    var colorBox = enhanceDiv.childNodes[0].childNodes[2];
                    if(colorBox && colorBox.childNodes.length == 0) {
                        bgColor = rgb2hex(colorBox.style.backgroundColor);
                    }

                    var textColor = "";
                    var textBox = enhanceDiv.childNodes[0].childNodes[3];
                    if(textBox && textBox.childNodes.length == 0) {
                        textColor = rgb2hex(textBox.style.backgroundColor);
                    }

                    var noteText = "";
                    var noteField = enhanceDiv.childNodes[2];
                    if(noteField) {
                        noteText = noteField.value.trim();
                        violatedDelim = (noteText.indexOf(SETTINGS_DELIM) != -1);
                    }

                    if(violatedDelim) {
                        //Do not want people using the SETTINGS_DELIM string in a user name or note.
                        alert("The string " + SETTINGS_DELIM + " is not allowed.  It will break this functionality. Please remove it and try saving again.");
                    } else {
                        if(bgColor || textColor || noteText) {
                            GM_setValue(ENHANCE_POST_USER_PREFIX + user, bgColor + SETTINGS_DELIM + textColor + SETTINGS_DELIM + noteText);
                        } else {
                            GM_deleteValue(ENHANCE_POST_USER_PREFIX + user);
                        }
                    }
                }
                if(!violatedDelim) {
                    lookAtAllPosts(user);
                }
            }
        }

        if(!violatedDelim) {
            popupEnhanceWindow.style.display = 'none';
        }
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        popupEnhanceWindow.style.display = 'none';
    }, false);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    popupEnhanceWindow.appendChild(headerDiv);
    popupEnhanceWindow.appendChild(subHeaderDiv);
    popupEnhanceWindow.appendChild(enhanceDiv);
    popupEnhanceWindow.appendChild(saveCancelBtnDiv);

    return popupEnhanceWindow;
}

function populatePopupEnhanceWindow(userName, userColor, textColor, noteText) {
    var enhanceDiv = document.getElementById("PopupEnhanceFieldDiv");
    enhanceDiv.style.display = 'inline';
    enhanceDiv.childNodes[0].childNodes[1].value = userName;

    if(userColor) {
        var colorBox = enhanceDiv.childNodes[0].childNodes[2];
        colorBox.style.backgroundColor = userColor;
        while(colorBox.hasChildNodes()) {
            colorBox.removeChild(colorBox.lastChild);
        }
    } else {
        resetColorBox(enhanceDiv.childNodes[0].childNodes[2]);
    }

    if(textColor) {
        var textBox = enhanceDiv.childNodes[0].childNodes[3];
        textBox.style.backgroundColor = textColor;
        while(textBox.hasChildNodes()) {
            textBox.removeChild(textBox.lastChild);
        }
    } else {
        resetColorBox(enhanceDiv.childNodes[0].childNodes[3]);
    }

    if(!noteText) {
        noteText = "";
    }
    var noteField = enhanceDiv.childNodes[2].value = noteText;
}

//*****************************************************
//********************SAVE SENT IMS********************
//*****************************************************

function buildSaveIMsWindow() {
    var saveIMsWindow = buildOptionWindow();
    saveIMsWindow.id = 'SaveIMsWindow';

    var headerDiv = buildHeaderDiv("Save Sent IMs Options");
    var checkBoxDiv = document.createElement("div");
    var box = createBox("SaveIMsBox");

    var boxLabel = document.createElement("label");
    boxLabel.setAttribute('for', box.id);
    boxLabel.appendChild(document.createTextNode("Always Save Sent IMs"));

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.addEventListener("click", function() {
        saveIMsOptions();
        toggleSecondaryOptions();
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        toggleSecondaryOptions();
    }, false);

    checkBoxDiv.appendChild(box);
    checkBoxDiv.appendChild(boxLabel);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    saveIMsWindow.appendChild(headerDiv);
    saveIMsWindow.appendChild(checkBoxDiv);
    saveIMsWindow.appendChild(saveCancelBtnDiv);

    return saveIMsWindow;
}

function saveIMsOptions() {
    var box = document.getElementById("SaveIMsBox");
    if(box.checked) {
        GM_setValue("SaveIMsBoxChecked", box.checked);
    } else {
        GM_setValue("SaveIMsBoxChecked", '');
    }
}

function loadIMsOptions() {
    var box = document.getElementById("SaveIMsBox");
    box.checked = getBoxStatusFromStorage("SaveIMsBoxChecked");
}


//*****************************************************
//**************DRUNK OPTION FUNCTIONALITY*************
//*****************************************************

function buildDrunkWindow() {
    var drunkOptionsWindow = buildOptionWindow();
    drunkOptionsWindow.id = "DrunkOptionsWindow";

    var drunkDiv = document.createElement("div");
    drunkDiv.id="DrunkDiv";

    var drunkHeaderDiv = buildHeaderDiv("Drunk Posting Options");

    var drunkBox = createBox("DrunkBox");

    var drunkLabel = document.createElement("label");
    drunkLabel.setAttribute('for', drunkBox.id);
    drunkLabel.appendChild(document.createTextNode("Pass a simple math test when trying to post."));

    var badWordsDiv = document.createElement("div");
    badWordsDiv.style.marginTop = "30px";

    var badWordsHeaderDiv = buildHeaderDiv("Words You Shouldn't Post");

    var textFieldsDiv = document.createElement("div");
    textFieldsDiv.id="BadWordFields";

    var addWordBtnDiv = document.createElement('div');
    addWordBtnDiv.style.marginTop = '10px';
    var addWordBtn = createButton("New Word");
    addWordBtn.addEventListener("click", function() {
        textFieldsDiv.appendChild(buildBadFieldDiv(textFieldsDiv));
    }, false);

    addWordBtnDiv.appendChild(addWordBtn);

    badWordsDiv.appendChild(badWordsHeaderDiv);
    badWordsDiv.appendChild(textFieldsDiv);
    badWordsDiv.appendChild(addWordBtnDiv);

    var saveCancelBtnDiv =  document.createElement('div');
    saveCancelBtnDiv.style.marginTop = '20px';

    var saveBtn = createButton("Save");
    saveBtn.style.fontSize = "115%";
    saveBtn.style.marginRight = "2px";
    saveBtn.addEventListener("click", function() {
        saveDrunkOptions();
        toggleSecondaryOptions();
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        toggleSecondaryOptions();
    }, false);

    drunkDiv.appendChild(drunkBox);
    drunkDiv.appendChild(drunkLabel);

    saveCancelBtnDiv.appendChild(saveBtn);
    saveCancelBtnDiv.appendChild(cancelBtn);

    drunkOptionsWindow.appendChild(drunkHeaderDiv);
    drunkOptionsWindow.appendChild(drunkDiv);
    drunkOptionsWindow.appendChild(badWordsDiv);
    drunkOptionsWindow.appendChild(saveCancelBtnDiv);


    return drunkOptionsWindow;
}

function saveDrunkOptions() {
    saveDrunkBox();
    saveBadWordsOptions();
}

function cancelDrunkOptions() {
    loadDrunkBox();
    cancelBadWordsOptions();
}

function loadDrunkOptions() {
    loadDrunkBox();
    loadBadWordFields();
}

function reloadDrunkOptions() {
    loadDrunkBox();
    reloadBadWordFields();
}

function saveDrunkBox() {
    var drunkBox = document.getElementById("DrunkBox");
    if(drunkBox.checked) {
        GM_setValue("DrunkBoxChecked", drunkBox.checked);
    } else {
        GM_setValue("DrunkBoxChecked", '');
    }
}

function loadDrunkBox() {
    var drunkBox = document.getElementById("DrunkBox");
    drunkBox.checked = (getBoxStatusFromStorage("DrunkBoxChecked"));
}


//*****************************************************
//************BAD WORDS OPTION FUNCTIONALITY***********
//*****************************************************

function saveBadWordsOptions() {
    var div = document.getElementById("BadWordFields");
    //Collecting words list
    var badWords = [];
    var fieldsToRemove = [];
    for(var i = 0; i < div.childNodes.length; i++) {
        var textDiv = div.childNodes[i];
        if(textDiv != null) {
            var textField = textDiv.childNodes[0];
            if(textField != null) {
                var word = textField.value;
                if(word != null && word.trim().length > 0) {
                    badWords.push(word);
                } else {
                    fieldsToRemove.push(textDiv);
                }
            }
        }
    }

    for(var i = 0; i < fieldsToRemove.length; i++) {
        div.removeChild(fieldsToRemove[i]);
    }

    //Delete the old saved words
    var keys = getKeysFromStorageByKeyPrefix(BAD_WORD_PREFIX);
    for(var i = 0; i < keys.length; i++) {
        GM_deleteValue(keys[i]);
    }

    //Save the new ones
    for(var i = 0; i < badWords.length; i++) {
        GM_setValue(BAD_WORD_PREFIX + i, badWords[i]);
    }
}

function cancelBadWordsOptions() {
    reloadBadWordFields();
}

function loadBadWordFields() {
    var div = document.getElementById("BadWordFields");

    var words = getValuesFromStorageByKeyPrefix(BAD_WORD_PREFIX);
    for(var i = 0; i < words.length; i++) {
        div.appendChild(buildBadFieldDiv(div, words[i]));
    }
}

function removeAllBadWordTextFields() {
    removeAllTextFields("BadWordFields", 'badWordField');
}

function reloadBadWordFields() {
    removeAllBadWordTextFields();
    loadBadWordFields();
}

function buildBadFieldDiv(parentNode, valueText) {
    if(valueText == null || valueText.trim().length == 0) {
        valueText = "";
    }

    var textDiv = document.createElement("div");

    var textField = document.createElement("input");
    textField.setAttribute("type", "text");
    textField.setAttribute("value", valueText);
    textField.setAttribute("size", 25);
    textField.setAttribute("maxlength", 50);
    textField.setAttribute("name", "badWordField");

    var removeImage = document.createElement("img");
    removeImage.src = 'http://www.ar15.com/images/2008skins/icons/iconDelForum.png';
    removeImage.title = 'Remove Word';
    removeImage.alt = 'Remove Word';
    removeImage.style.verticalAlign = 'middle';
    removeImage.style.marginLeft = '10px';

    var removeLink = document.createElement("a");
    removeLink.href ="javascript:return false;";
    removeLink.appendChild(removeImage);
    removeLink.addEventListener("click", function() {
        parentNode.removeChild(textDiv);
    }, false);

    textDiv.appendChild(textField);
    textDiv.appendChild(removeLink);

    textDiv.style.marginTop = '2px';
    textDiv.style.marginBottom = '2px';

    return textDiv;
}


//*****************************************************
//**********************FIX LINKS**********************
//*****************************************************

function buildFixLinksWindow() {
    var fixLinksWindow = buildOptionWindow();
    fixLinksWindow.id = "FixLinksWindow";

    var headerDiv = buildHeaderDiv("Fix Archive/Mobile Link");

    var badLinkTextField = document.createElement("input");
    badLinkTextField.id = "badLinkTextField";
    badLinkTextField.setAttribute("type", "text");
    badLinkTextField.setAttribute("value", "");
    badLinkTextField.setAttribute("size", 35);
    badLinkTextField.setAttribute("maxlength", 100);
    badLinkTextField.setAttribute("name", "badLinkTextField");

    var fixedLinkTextField = document.createElement("input");
    fixedLinkTextField.id = "fixedLinkTextField";
    fixedLinkTextField.setAttribute("type", "text");
    fixedLinkTextField.setAttribute("value", "");
    fixedLinkTextField.setAttribute("size", 35);
    fixedLinkTextField.setAttribute("maxlength", 100);
    fixedLinkTextField.setAttribute("name", "fixedLinkTextField");
//In Firefox, this seems to prevent selecting and copying as well. Not what I want.
//    fixedLinkTextField.disabled = true;

    var fixBtn = createButton("Fix Link");
    fixBtn.style.fontSize = "115%";
    fixBtn.addEventListener("click", function() {
        var badLink = badLinkTextField.value;
        if(badLink != null && badLink.trim().length > 0) {
            var regex = new RegExp("^(http:\\/\\/)?www\\.ar15\\.com\\/(archive|mobile)\\/topic\\.html\\?b=(\\d+)&f=(\\d+)&t=(\\d+)$", "i");
            var matches = regex.exec(badLink);

            if(matches && matches.length >= 6) {
                fixedLinkTextField.value = fixLink(matches);
            } else {
                alert("Invalid link.  Expecting formats:\n\n" +
                        "[http://]www.ar15.com/archive/topic.html?b=5&f=4&t=146669\n" +
                        "[http://]www.ar15.com/mobile/topic.html?b=7&f=128&t=1315328");
            }
        } else {
            alert("No link provided.");
        }
    }, false);


    var badLinkLabelDiv = document.createElement("div");
    badLinkLabelDiv.appendChild(document.createTextNode("Archive/Mobile Link"));

    var fixLinkLabelDiv = document.createElement("div");
    fixLinkLabelDiv.style.marginTop = "5px";
    fixLinkLabelDiv.appendChild(document.createTextNode("Fixed Link"));

    var fixBtnDiv = document.createElement("div");
    fixBtnDiv.style.marginTop = '10px';
    fixBtnDiv.appendChild(fixBtn);

    fixLinksWindow.appendChild(headerDiv);
    fixLinksWindow.appendChild(badLinkLabelDiv);
    fixLinksWindow.appendChild(badLinkTextField);
    fixLinksWindow.appendChild(fixLinkLabelDiv);
    fixLinksWindow.appendChild(fixedLinkTextField);
    fixLinksWindow.appendChild(fixBtnDiv);

    return fixLinksWindow;
}


function fixLink(matches) {
    //board = 3, forum = 4, thread = 5
    return "http://www.ar15.com/forums/t_" + matches[3] + "_" + matches[4] + "/" + matches[5] + "_.html";
}

function clearFixLinks() {
    document.getElementById("badLinkTextField").value="";
    document.getElementById("fixedLinkTextField").value="";
}


//*****************************************************
//***************IMPORT/EXPORT SETTINGS****************
//*****************************************************

//Setting format - key[value]

function buildImportExportWindow() {
    var ieWindow = buildOptionWindow();
    ieWindow.id = "ImportExportSettingsWindow";

    var headerDiv = buildHeaderDiv("Import/Export Settings");

    var importLabelDiv = document.createElement("div");
    importLabelDiv.appendChild(document.createTextNode("Settings to Import"));
    importLabelDiv.style.fontSize = "105%";

    var importArea = document.createElement("textarea");
    importArea.id = "ImportSettingsArea";
    importArea.rows = 5;
    importArea.cols = 50;

    var exportLabelDiv = document.createElement("div");
    exportLabelDiv.appendChild(document.createTextNode("Exported Settings"));
    exportLabelDiv.style.fontSize = "105%";
    exportLabelDiv.style.marginTop = "10px";

    var exportArea = document.createElement("textarea");
    exportArea.id = "ExportSettingsArea";
    exportArea.rows = 5;
    exportArea.cols = 50;

    var importBtn = createButton("Import");
    importBtn.style.marginRight = "5px";
    importBtn.addEventListener("click", function() {
        var importValue = importArea.value;
        if(importValue != null && importValue.trim().length > 0) {
            var importArray = importValue.split("\n");
            if(importArray && importArray.length > 0) {
                clearAllSettings();
                for(var i = 0; i < importArray.length; i++) {
                    var setting = splitLineToParts(importArray[i]);
                    //Fail silently?

                    if(setting && validateKey(setting[0])) {
                        GM_setValue(setting[0], setting[1]);
                    }
                }
            }

            alert("Settings loaded");
            toggleSecondaryOptions();
        } else {
            alert("Nothing to import.");
        }
    }, false);

    var exportBtn = createButton("Export");
    exportBtn.style.marginLeft = "5px";
    exportBtn.addEventListener("click", function() {
        exportArea.value = '';

        var keys = GM_listValues();
        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = GM_getValue(key);
            if(value != null) {
                exportArea.value += key + '[' + value + ']\n';
            }
        }
    }, false);

    var btnDiv = document.createElement("div");
    btnDiv.style.marginTop = "20px";

    btnDiv.appendChild(importBtn);
    btnDiv.appendChild(exportBtn);

    ieWindow.appendChild(headerDiv);
    ieWindow.appendChild(importLabelDiv);
    ieWindow.appendChild(importArea);
    ieWindow.appendChild(exportLabelDiv);
    ieWindow.appendChild(exportArea);
    ieWindow.appendChild(btnDiv);

    return ieWindow;
}

function validateKey(key) {
    return VALID_KEYS_REGEX.test(key);
}

//Return an array[key, value] based on the line
function splitLineToParts(line) {
    var array = null;

    var startPosit = line.indexOf("[");
    var endPosit = line.lastIndexOf("]");
    if(startPosit != -1 && endPosit > startPosit) {
        array = [line.slice(0, startPosit), line.slice(startPosit + 1, endPosit)];
        if(array[1] == null) {
            array[1] = "";
        }
    }

    return array;
}

function clearImportExportFields() {
    var exportArea = document.getElementById("ExportSettingsArea");
    var importArea = document.getElementById("ImportSettingsArea");

    if(exportArea) {
        exportArea.value = "";
    }

    if(importArea) {
        importArea.value = "";
    }
}


//*****************************************************
//***************SHARED GUI FUNCTIONALITY**************
//*****************************************************

function buildLink(text) {
    var link = document.createElement("a");
    link.href = 'javascript:return false;';
//    link.text = text;
    link.style.fontWeight = "bold";
    link.style.fontSize = "8pt";
    link.style.color = "white";
    link.appendChild(document.createTextNode(text));

    return link;
}

function buildOptionWindow() {
    var optionWindow = document.createElement("div");
    optionWindow.style.display = 'none';
    optionWindow.style.textAlign = 'justify';
    optionWindow.style.position = 'absolute';
    optionWindow.style.top = '23px';
    optionWindow.style.backgroundColor = '#757575';
    optionWindow.style.color = 'white';
    optionWindow.style.border = '2px solid';
    optionWindow.style.borderRadius = '5px';
    optionWindow.style.padding = '5px';
    optionWindow.style.zIndex = '9999';

    return optionWindow;
}

function buildLinkToOptionsWindow(optionsDiv, linkText) {
    var optionsLink = buildLink(linkText);

    var linkWindow = document.createElement("div");
    linkWindow.addEventListener("click", function() {
        if(ACTIVE_WINDOW && ACTIVE_WINDOW != optionsDiv) {
            toggleSecondaryOptions();
        }
        ACTIVE_WINDOW = optionsDiv;
        toggleSecondaryOptions();
    }, false);
    linkWindow.appendChild(optionsLink);

    return linkWindow;
}

function buildHeaderDiv(text) {
    var div = document.createElement("div");
    div.style.marginBottom = "10px";

    var label = document.createElement("label");
    label.style.fontSize = '115%';
    label.style.fontWeight = 'bold';
    label.appendChild(document.createTextNode(text));

    div.appendChild(label);

    return div;
}

function createButton(text) {
    var button = createSquareButton(text);
    button.style.borderRadius = '5px';

    return button;
}

function createSquareButton(text) {
    var button = document.createElement("a");
    button.href ="javascript:return false;";
//    button.text = text;
    button.style.fontWeight = "bold";
    button.style.color = 'black';
    button.style.border = '1px solid';
    button.style.padding = '2px';
    button.style.backgroundColor = '#CCCCCC';
    button.appendChild(document.createTextNode(text));

    return button;
}

function createBox(boxId) {
    var box = document.createElement("input");
    box.setAttribute("type", "checkbox");
    box.id=boxId;

    return box;
}

function closeWindow(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

function getFirstDivByClassName(className, searchUnder) {
    var result;
    var search = document.evaluate(".//div[contains(@class, '" + className + "')]", searchUnder, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if(search.snapshotLength > 0) {
        var result = search.snapshotItem(0);
    }
    return result;
}

function getAllDivsByClassName(className, searchUnder) {
    var result = [];
    var search = document.evaluate(".//div[contains(@class, '" + className + "')]", searchUnder, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for(var i = 0; i < search.snapshotLength; i++) {
        result.push(search.snapshotItem(i));
    }
    return result;
}

//*****************************************************
//************MESS WITH POSTS FUNCTIONALITY************
//*****************************************************

function lookAtAllPosts(changeThisUser) {
    //EnhanceUserPosts
    var enhanceSettings = getMapFromStorageByKeyPrefix(ENHANCE_POST_USER_PREFIX);

    //Build regex of users to look for
    var enhanceRegexString = "";
    for(var key in enhanceSettings) {
        if(enhanceRegexString.length > 0) {
            enhanceRegexString += '|';
        }

        enhanceRegexString += '(^' + escapeRegExp(key.slice(ENHANCE_POST_USER_PREFIX.length)) + '$)';
    }

    //IgnoreUserPosts
    var ignoreSettings = getKeysFromStorageByKeyPrefix(IGNORE_PREFIX);
    var ignoreRegexString = "";
    for(var i = 0; i < ignoreSettings.length; i++) {
        if(ignoreRegexString.length > 0) {
            ignoreRegexString += '|';
        }

        ignoreRegexString += '(^' + escapeRegExp(ignoreSettings[i].slice(IGNORE_PREFIX.length)) + '$)';
    }

    //Can't ignore mods, site staff, and admins
    var specialUsersRegex = new RegExp("(Staff)|(Moderator)|(Admin)", "i");

    var EUPregex;
    var ignoreRegex;

    if(enhanceRegexString.length > 0) {
        EUPregex = new RegExp(enhanceRegexString, "i");
    }

    if(ignoreRegexString.length > 0) {
        ignoreRegex = new RegExp(ignoreRegexString, "i");
    }

    //Number of ignored posts
    var ignoredCount = 0;

    //Look through all posts
    var postArray1 = document.getElementsByClassName("postBoxLight");
    var postArray2 = document.getElementsByClassName("postBoxDark");

    var isHorizontal = true;
    //The nextSibling is an empty text element for some reason...
    //Also had to start checking for existence of siblings because they don't exist for verticals under and ignore window
    if(postArray1[0] && postArray1[0].nextSibling && postArray1[0].nextSibling.nextSibling && 'clearHead' === postArray1[0].nextSibling.nextSibling.className) {
        isHorizontal = false;
    }

    //These aren't actually arrays, so I couldn't concat them
    for(var i = 0; i < postArray1.length; i++) {
        var authorResult = document.evaluate(".//div[contains(@class, 'skinBarAuthorRight')]", postArray1[i], null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if(authorResult.snapshotLength > 0) {
            var author = authorResult.snapshotItem(0).innerHTML;
            if(author) {
                var userButtonsBar = findUserButtonsBar(postArray1[i], isHorizontal);

                //No, I don't much like this either, but I'm tired and it's a simple solution
                if(userButtonsBar.childNodes.length <= 18) {
                    //Add Enhance and Ignore buttons, but only if they haven't been added already
                    addUserButtonsToBar(author, userButtonsBar);
                }
                //Ignore Users
                ignoredCount = ignoreUserPost(ignoreRegex, author, postArray1[i], ignoredCount, userButtonsBar, specialUsersRegex, isHorizontal);
                //Enhance User Posts
                enhanceUserPost(EUPregex, author, enhanceSettings, postArray1[i], userButtonsBar, isHorizontal, changeThisUser);
            }
        }
    }

    for(i = 0; i < postArray2.length; i++) {
        authorResult = document.evaluate(".//div[contains(@class, 'skinBarAuthorRight')]", postArray2[i], null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if(authorResult.snapshotLength > 0) {
            author = authorResult.snapshotItem(0).innerHTML;
            if(author) {
                var userButtonsBar = findUserButtonsBar(postArray2[i], isHorizontal);

                //No, I don't much like this either, but I'm tired and it's a simple solution
                if(userButtonsBar.childNodes.length <= 18) {
                    //Add Enhance and Ignore buttons, but only if they haven't been added already
                    addUserButtonsToBar(author, userButtonsBar);
                }
                //Ignore Users
                ignoredCount = ignoreUserPost(ignoreRegex, author, postArray2[i], ignoredCount, userButtonsBar, specialUsersRegex, isHorizontal);
                //Enhance User Posts
                enhanceUserPost(EUPregex, author, enhanceSettings, postArray2[i], userButtonsBar, isHorizontal, changeThisUser);
            }
        }
    }
}

function findUserButtonsBar(post, isHorizontal) {
    if(isHorizontal) {
        return getFirstDivByClassName('postBarBg', post);
    } else {
        //Yeah, it's way on down there and has no className or id - but it's only way on down there after the first load
        return post.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.childNodes[1].childNodes[1];
    }

    return null;
}

function addUserButtonsToBar(author, postBarBg) {
    var inset1 = document.createElement('div');
    inset1.className = 'insetPostBar';

    var enhanceLink = document.createElement('a');
    enhanceLink.href = 'javascript:return false;';
    enhanceLink.appendChild(document.createTextNode('Enhance Posts'));
    enhanceLink.addEventListener("click", function() {
        var popup = document.getElementById("PopupEnhanceWindow");
        if(popup.style.display != 'none') {
            //If it's a different button being clicked, we don't want to close, we just want to move
            //It's been difficult to determine exactly which button has opened the popup, so I'm just going based on Author for now
            var fieldDiv = document.getElementById("PopupEnhanceFieldDiv");
            var oldAuthor = fieldDiv.childNodes[0].childNodes[1].value;
            if(author == oldAuthor) {
                popup.style.display = 'none';
            } else {
                var settings = GM_getValue(ENHANCE_POST_USER_PREFIX + author);

                if(settings) {
                    settings = settings.split(SETTINGS_DELIM);
                }
                else {
                    settings = ["", ""];
                }

                populatePopupEnhanceWindow(author, settings[0], settings[1], settings[2]);

                var dimensions = enhanceLink.getBoundingClientRect();
                popup.style.top = (window.pageYOffset + dimensions.top - popup.offsetHeight - 5) + 'px';
                popup.style.left = (window.pageXOffset + dimensions.left) + 'px';
            }
        } else {
            popup.style.display = 'inline';
            var settings = GM_getValue(ENHANCE_POST_USER_PREFIX + author);

            if(settings) {
                settings = settings.split(SETTINGS_DELIM);
            }
            else {
                settings = ["", ""];
            }

            populatePopupEnhanceWindow(author, settings[0], settings[1], settings[2]);

            var dimensions = enhanceLink.getBoundingClientRect();
            popup.style.top = (window.pageYOffset + dimensions.top - popup.offsetHeight - 5) + 'px';
            popup.style.left = (dimensions.left) + 'px';
        }

    }, false);

    var inset2 = document.createElement('div');
    inset2.className = 'insetPostBar';

    var ignoreLink = document.createElement('a');
    ignoreLink.href = 'javascript:return false;';
    ignoreLink.appendChild(document.createTextNode('Ignore Posts'));
    ignoreLink.addEventListener("click", function() {
        var popup = document.getElementById("PopupIgnoreWindow");
        if(popup.style.display != 'none') {
            var fieldDiv = document.getElementById("PopupIgnoreFieldDiv");
            var oldAuthor = fieldDiv.childNodes[0].childNodes[1].value;
            if(author == oldAuthor) {
                popup.style.display = 'none';
            } else {
                populatePopupIgnoreWindow(author, GM_getValue(IGNORE_PREFIX + author, ""));

                var dimensions = ignoreLink.getBoundingClientRect();
                popup.style.top = (window.pageYOffset + dimensions.top - popup.offsetHeight - 5) + 'px';
                popup.style.left = (window.pageXOffset + dimensions.left) + 'px';
            }
        } else {
            popup.style.display = 'inline';

            populatePopupIgnoreWindow(author, GM_getValue(IGNORE_PREFIX + author, ""));

            var dimensions = ignoreLink.getBoundingClientRect();
            popup.style.top = (window.pageYOffset + dimensions.top - popup.offsetHeight - 5) + 'px';
            popup.style.left = (window.pageXOffset + dimensions.left) + 'px';
        }

    }, false);

    var ignoreButtonInset = postBarBg.childNodes[5];

    postBarBg.insertBefore(inset1, ignoreButtonInset);
    postBarBg.insertBefore(ignoreLink, ignoreButtonInset);
    postBarBg.insertBefore(inset2, ignoreButtonInset);
    postBarBg.insertBefore(enhanceLink, ignoreButtonInset);
}
function ignoreUserPost(regex, author, post, ignoredCount, userButtonsBar, specialUsersRegex, isHorizontal) {
    //Used to have a check here that wouldn't process this if there wasn't anything to ignore
    //Removed it because now we're ignoring/unignoring on the fly without forcing a page reload
    if(isHorizontal) {
        ignoredCount = ignoreHorizontalUserPost(regex, author, post, ignoredCount, userButtonsBar, specialUsersRegex);
    } else {
        ignoredCount = ignoreVerticalUserPost(regex, author, post, ignoredCount, userButtonsBar, specialUsersRegex);
    }

    return ignoredCount;
}

function ignoreHorizontalUserPost(regex, author, post, ignoredCount, userButtonsBar, specialUsersRegex) {
    var match;
    if(regex) {
        match = author.match(regex);
    }

    if(match) {
        var isMod = false;
        var iconDiv = getFirstDivByClassName('postAuthorIcon', post);
        if(iconDiv) {
            //3 elements in childNodes - text, img, text.  Weird, because looking at the source code there should just be 1 - img.
            isMod = specialUsersRegex.test(iconDiv.childNodes[1].title);
        }

        if(!isMod) {
            ignoredCount++;
            var iqid = "igid" + (100 + ignoredCount);
            //Only ignore if not already ignored
            if(!IGNORE_ID_REGEX.test(post.parentNode.id)) {
                //Post will be moving, so just grab it now
                var parentNode = post.parentNode;
                //Create the ignore bar
                var ignoreBar = document.createElement("div");
                ignoreBar.className = "subheaderContent";

                var newAuthorLink = document.createElement("a");
                newAuthorLink.className = "postAuthorInfo";
                newAuthorLink.setAttribute("href", "javascript:spoilHandler('" + iqid + "');");
                newAuthorLink.appendChild(document.createTextNode("  " + author + "    [ Click To Read Ignored Post ]"));

                ignoreBar.appendChild(newAuthorLink);
                ignoreBar.appendChild(document.createElement("br"));

                parentNode.insertBefore(ignoreBar, post);

                //Move the original post to a new igid# div
                var igidDiv = document.createElement("div");
                igidDiv.id = iqid;
                igidDiv.style.display = 'none';
                igidDiv.appendChild(post);

                parentNode.insertBefore(igidDiv, ignoreBar.nextSibling);

                userButtonsBar.childNodes[6].style.color = "#99CCCC";
            } else if(IGNORED_BY_THIS_ID_REGEX.test(post.parentNode.id)) {
                //Not a fan of this
                //Forcibly reordering the iqid of already ignored posts
                post.parentNode.id = iqid;
                post.parentNode.previousSibling.childNodes[0].setAttribute("href", "javascript:spoilHandler('" + iqid + "');");
            }
        }
    } else if(IGNORED_BY_THIS_ID_REGEX.test(post.parentNode.id)) {
        //This post was ignored previously and should not be ignored now
        var igidNode = post.parentNode;

        //The subheaderContent div
        igidNode.parentNode.removeChild(igidNode.previousSibling);

        igidNode.parentNode.insertBefore(post, igidNode);
        igidNode.parentNode.removeChild(igidNode);

        userButtonsBar.childNodes[6].removeAttribute("style");
    }

    return ignoredCount;
}

function ignoreVerticalUserPost(regex, author, post, ignoredCount, userButtonsBar, specialUsersRegex) {
    var match;
    if(regex) {
        match = author.match(regex);
    }

    if(match) {
        //Only ignore if not already ignored
        if(!IGNORE_ID_REGEX.test(post.parentNode.id)) {
            var isMod = false;
            var iconDiv = getFirstDivByClassName('postAuthorIcon', post);
            if(iconDiv) {
                //3 elements in childNodes - text, img, text.  Weird, because looking at the source code there should just be 1 - img.
                isMod = specialUsersRegex.test(iconDiv.childNodes[1].title);
            }

            if(!isMod) {
                ignoredCount++;
                var iqid = "igid" + (100 + ignoredCount);
                //Post will be moving, so just grab it now
                var parentNode = post.parentNode;

                //Create the ignore bar
                var ignoreBar = document.createElement("div");
                ignoreBar.className = "subheaderContent";

                var newAuthorLink = document.createElement("a");
                newAuthorLink.className = "postAuthorInfo";
                newAuthorLink.setAttribute("href", "javascript:spoilHandler('" + iqid + "');");
                newAuthorLink.appendChild(document.createTextNode("  " + author + "    [ Click To Read Ignored Post ]"));

                ignoreBar.appendChild(newAuthorLink);
                ignoreBar.appendChild(document.createElement("br"));

                parentNode.insertBefore(ignoreBar, post);

                //Move the original post to a new igid# div
                var igidDiv = document.createElement("div");
                igidDiv.id = iqid;
                igidDiv.style.display = 'none';

                //all the way down to the next <a
                //Moving all of it
                while(!post.nextSibling.nodeName || "a" != post.nextSibling.nodeName.toLowerCase()) {
                    igidDiv.appendChild(post.nextSibling);
                }
                igidDiv.insertBefore(post, igidDiv.firstChild);

                parentNode.insertBefore(igidDiv, ignoreBar.nextSibling);

                userButtonsBar.childNodes[6].style.color = "#99CCCC";
            }
        } else if(IGNORED_BY_THIS_ID_REGEX.test(post.parentNode.id)) {
            ignoredCount++;
            var iqid = "igid" + (100 + ignoredCount);

            //Not a fan of this
            //Forcibly reordering the iqid of already ignored posts
            post.parentNode.id = iqid;
            post.parentNode.previousSibling.childNodes[0].setAttribute("href", "javascript:spoilHandler('" + iqid + "');");
        }
    } else if(IGNORED_BY_THIS_ID_REGEX.test(post.parentNode.id)) {
        //This post was ignored previously and should not be ignored now
        var igidNode = post.parentNode;
        //The subheaderContent div
        igidNode.parentNode.removeChild(igidNode.previousSibling);

        //Moving all of it
        while(igidNode.hasChildNodes()) {
            igidNode.parentNode.insertBefore(igidNode.firstChild, igidNode);
        }
        igidNode.parentNode.removeChild(igidNode);

        userButtonsBar.childNodes[6].removeAttribute("style");
    }

    return ignoredCount;
}

//Horizontal and Vertical layout have very different ways of getting the divs
function enhanceUserPost(regex, author, map, post, userButtonsBar, horizontal, changeThisUser) {
    if(regex || changeThisUser) {
        if(horizontal) {
            return enhanceHorizontalUserPost(regex, author, map, post, userButtonsBar, changeThisUser);
        } else {
            return enhanceVerticalUserPost(regex, author, map, post, userButtonsBar, changeThisUser);
        }
    }
}

function enhanceHorizontalUserPost(regex, author, map, post, userButtonsBar, changeThisUser) {
    var match;

    //Might need to revert stuff back to initial settings
    if(author == changeThisUser) {
        match = [changeThisUser];
    } else if(regex) {
        match = author.match(regex);
    }

    if(match) {
        var setting = map[ENHANCE_POST_USER_PREFIX + match[0]];

        var postReplyBar = getFirstDivByClassName('postReplyBar', post);
        var forumTextBody = getFirstDivByClassName('forumTextBody', post);
        var quoteDivs = getAllDivsByClassName('quoteStyle', post);
        var sigDiv = getFirstDivByClassName('sigBoxContent', post);

        enhanceThisPost(userButtonsBar, postReplyBar, post, forumTextBody, "", quoteDivs, sigDiv, setting);
    }
}

function enhanceVerticalUserPost(regex, author, map, post, userButtonsBar, changeThisUser) {
    var match;

    //Might need to revert stuff back to initial settings
    if(author == changeThisUser) {
        match = [changeThisUser];
    } else if(regex) {
        match = author.match(regex);
    }

    if(match) {
        var setting = map[ENHANCE_POST_USER_PREFIX + match[0]];

        //postBoxLight/Dark -> txt -> clearHead -> text -> ??? -> ??? -> postReplyBar -> txt -> postBody -> txt -> bottomDiv
        var postReplyBar = post.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling;
        var postBody = postReplyBar.nextSibling.nextSibling;
        var bottomDiv = postBody.nextSibling.nextSibling;
        var quoteDivs = getAllDivsByClassName('quoteStyle', postBody);
        var sigDiv = getFirstDivByClassName('sigBoxContent', postBody);

        enhanceThisPost(userButtonsBar, postReplyBar, postBody, postBody.childNodes[0].nextSibling, bottomDiv, quoteDivs, sigDiv, setting);
    }
}

function enhanceThisPost(userButtonsBar, postReplyBar, postBody, forumTextBody, bottomDiv, quoteDivs, sigDiv, setting) {
    if(setting && setting[2]) {
        userButtonsBar.childNodes[8].style.color = "#99CCCC";
    } else {
        userButtonsBar.childNodes[8].removeAttribute("style");
    }

    if(setting && (setting[0] || setting[1])) {
        //This is an OP post
        if(postReplyBar && postReplyBar.style.backgroundRepeat) {
            //It's ok to change it
            if(GM_getValue(ENHANCE_POST_PREFIX + "ChangeOp", false)) {
                changePostReplyBar(postReplyBar);
                changePostBoxDiv(postBody, forumTextBody, bottomDiv, setting);
                for(var i = 0; i < quoteDivs.length; i++) {
                    changeQuoteDiv(quoteDivs[i], setting);
                }
                changeSigDiv(sigDiv, setting);
            }
        } else {
            changePostBoxDiv(postBody, forumTextBody, bottomDiv, setting);
            for(var i = 0; i < quoteDivs.length; i++) {
                changeQuoteDiv(quoteDivs[i], setting);
            }
            changeSigDiv(sigDiv, setting);
        }
    } else {
        revertPostReplyBar(postReplyBar);
        revertPostBox(postBody, forumTextBody, bottomDiv);
        for(var i = 0; i < quoteDivs.length; i++) {
            revertQuoteDiv(quoteDivs[i]);
        }
        revertSigDiv(sigDiv);
    }
}

function changePostReplyBar(postReplyBar) {
    //Get rid of the background image of OP posts
    if(postReplyBar && postReplyBar.style.backgroundImage) {
        //Save off the initial image in case it gets changed back later
        if(!postReplyBar._originalBackgroundImage) {
            postReplyBar._originalBackgroundImage = postReplyBar.style.backgroundImage;
        }
        postReplyBar.style.removeProperty('background-image');
    }
}

function revertPostReplyBar(postReplyBar) {
    if(postReplyBar._originalBackgroundImage && postReplyBar._originalBackgroundImage != EMPTY_ORIGINAL_STYLE) {
        postReplyBar.style.backgroundImage = postReplyBar._originalBackgroundImage;
    }
}

function changePostBoxDiv(postBody, forumTextBody, bottomDiv, setting) {
    if(setting[0]) {
        //Save off the initial background color in case it gets changed back later
        if(!postBody._originalBackgroundColor) {
            postBody._originalBackgroundColor = (postBody.style.backgroundColor ? postBody.style.backgroundColor : EMPTY_ORIGINAL_STYLE) ;
        }
        postBody.style.backgroundColor = setting[0];
        if(bottomDiv) {
            if(!bottomDiv._originalBackgroundColor) {
                bottomDiv._originalBackgroundColor = (bottomDiv.style.backgroundColor ? bottomDiv.style.backgroundColor : EMPTY_ORIGINAL_STYLE) ;
            }
            bottomDiv.style.backgroundColor = setting[0];
        }
    } else {
        revertPostBoxBg(postBody, bottomDiv);
    }

    if(setting[1]) {
        //Save off the initial color in case it gets changed back later
        if(forumTextBody) {
            if(!forumTextBody._originalColor) {
                forumTextBody._originalColor = (forumTextBody.style.color ? forumTextBody.style.color : EMPTY_ORIGINAL_STYLE);
            }
            forumTextBody.style.color = setting[1];
        }
        if(bottomDiv) {
            if(!bottomDiv._originalColor) {
                bottomDiv._originalColor = (bottomDiv.style.color ? bottomDiv.style.color : EMPTY_ORIGINAL_STYLE);
            }
            bottomDiv.style.color = setting[1];
        }
    } else {
        revertPostBoxColor(forumTextBody, bottomDiv);
    }
}

function revertPostBox(postBody, forumTextBody, bottomDiv) {
    revertPostBoxBg(postBody, bottomDiv);
    revertPostBoxColor(forumTextBody, bottomDiv);
}

function revertPostBoxBg(postBody, bottomDiv) {
    if(postBody && postBody._originalBackgroundColor) {
        if(postBody._originalBackgroundColor == EMPTY_ORIGINAL_STYLE) {
            postBody.style.removeProperty('background');
        } else {
            postBody.style.backgroundColor = postBody._originalBackgroundColor;
        }
    }

    if(bottomDiv && bottomDiv._originalBackgroundColor) {
        if(bottomDiv._originalBackgroundColor == EMPTY_ORIGINAL_STYLE) {
            bottomDiv.style.removeProperty('background');
        } else {
            bottomDiv.style.backgroundColor = bottomDiv._originalBackgroundColor;
        }
    }
}

function revertPostBoxColor(forumTextBody, bottomDiv) {
    if(forumTextBody && forumTextBody._originalColor) {
        if(forumTextBody._originalColor == EMPTY_ORIGINAL_STYLE) {
            forumTextBody.style.removeProperty('color');
        } else {
            forumTextBody.style.color = forumTextBody._originalColor;
        }
    }

    if(bottomDiv && bottomDiv._originalColor) {
        if(bottomDiv._originalColor == EMPTY_ORIGINAL_STYLE) {
            bottomDiv.style.removeProperty('color');
        } else {
            bottomDiv.style.color = bottomDiv._originalColor;
        }
    }
}

function changeQuoteDiv(quoteDiv, setting) {
    //Not sure if I want to keep this. Without it, quoted text doesn't get colored. - Quoted bg is slightly lighter
    if(quoteDiv) {
        if(setting[0]) {
            //Save off the initial quote background color in case it gets changed back later
            if(!quoteDiv._originalBackgroundColor) {
                quoteDiv._originalBackgroundColor = (quoteDiv.style.backgroundColor ? quoteDiv.style.backgroundColor : EMPTY_ORIGINAL_STYLE);
            }
            quoteDiv.style.backgroundColor = changeColor(hexToRgb(setting[0]), -0.1);
        } else {
            revertQuoteBg(quoteDiv);
        }

        if(setting[1]) {
            //Save off the initial quote color in case it gets changed back later
            if(!quoteDiv._originalColor) {
                quoteDiv._originalColor = (quoteDiv.style.color ? quoteDiv.style.color : EMPTY_ORIGINAL_STYLE);
            }
            quoteDiv.style.color = setting[1];
        } else {
            revertQuoteColor(quoteDiv);
        }
    }
}

function revertQuoteDiv(quoteDiv) {
    revertQuoteBg(quoteDiv);
    revertQuoteColor(quoteDiv);
}

function revertQuoteBg(quoteDiv) {
    if(quoteDiv && quoteDiv._originalBackgroundColor) {
        if(quoteDiv._originalBackgroundColor == EMPTY_ORIGINAL_STYLE) {
            quoteDiv.style.removeProperty('background');
        } else {
            quoteDiv.style.backgroundColor = quoteDiv._originalBackgroundColor;
        }
    }
}

function revertQuoteColor(quoteDiv) {
    if(quoteDiv && quoteDiv._originalColor) {
        if(quoteDiv._originalColor == EMPTY_ORIGINAL_STYLE) {
            quoteDiv.style.removeProperty('color');
        } else {
            quoteDiv.style.color = quoteDiv._originalColor;
        }
    }
}

function changeSigDiv(sigDiv, setting) {
    //Got to get the sig box too? - SigBox bg is slightly darker
    if(sigDiv) {
        if(setting[0]) {
            //You get the point by now
            if(!sigDiv._originalBackgroundColor) {
                sigDiv._originalBackgroundColor = (sigDiv.style.backgroundColor ? sigDiv.style.backgroundColor : EMPTY_ORIGINAL_STYLE);
            }

            if(!sigDiv._originalBorderColor) {
                sigDiv._originalBorderColor = (sigDiv.style.borderColor ? sigDiv.style.borderColor : EMPTY_ORIGINAL_STYLE);
            }

            sigDiv.style.backgroundColor = changeColor(hexToRgb(setting[0]), -0.2);
            sigDiv.style.borderColor = "rgb(111,111,111)";
        } else {
            revertSigBg(sigDiv);
        }

        if(setting[1]) {
            if(EMPTY_ORIGINAL_STYLE != sigDiv._originalColor) {
                sigDiv._originalColor = (sigDiv.style.color ? sigDiv.style.color : EMPTY_ORIGINAL_STYLE);
            }
            sigDiv.style.color = setting[1];
        } else {
            revertSigColor(sigDiv);
        }
    }
}

function revertSigDiv(sigDiv) {
    revertSigBg(sigDiv);
    revertSigColor(sigDiv);
}

function revertSigBg(sigDiv) {
    if(sigDiv && sigDiv._originalBackgroundColor) {
        if(sigDiv._originalBackgroundColor == EMPTY_ORIGINAL_STYLE) {
            sigDiv.style.removeProperty('background');
        } else {
            sigDiv.style.backgroundColor = sigDiv._originalBackgroundColor;
        }
    }
}

function revertSigColor(sigDiv) {
    if(sigDiv && sigDiv._originalColor) {
        if(sigDiv._originalColor == EMPTY_ORIGINAL_STYLE) {
            sigDiv.style.removeProperty('color');
        } else {
            sigDiv.style.color = sigDiv._originalColor;
        }
    }
}

//percent -> 10% lighter -> 0.1
//percent -> 10% darker -> -0.1
function changeColor(rgb, percent) {
    rgb.r = Math.round(Math.min(255, Math.max(0, rgb.r + (rgb.r * percent))));
    rgb.g = Math.round(Math.min(255, Math.max(0, rgb.g + (rgb.g * percent))));
    rgb.b = Math.round(Math.min(255, Math.max(0, rgb.b + (rgb.b * percent))));

    return 'rgb(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ')';
}

//*****************************************************
//***************SAVE IMS FUNCTIONALITY****************
//*****************************************************

function checkSaveIMsBox() {
    //Getting XPath to track down the exact link for the Compose button is proving difficult. This seems to work on most pages.
    var composeTable = document.getElementsByClassName("msgBar")[0];
    if(composeTable) {
        var composeResults = document.evaluate(".//a[contains(@href, 'javascript:ajaxpage')]", composeTable, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        if(composeResults.snapshotLength > 0) {
            var composeLink = composeResults.snapshotItem(0);
            composeLink.addEventListener("click",function() {
                setTimeout(function() {
                    if(getBoxStatusFromStorage("SaveIMsBoxChecked")) {
                        var messengerBottom = document.getElementById("messengerbottom");
                        if(messengerBottom) {
                            var saveBoxes = document.getElementsByName("targetSaveSent");
                            if(saveBoxes.length > 0) {
                                saveBoxes[0].checked = true;
                            }
                        }
                    }
                }, 500);
            }, false);
        }
    }
}

//*****************************************************
//****************SUBMIT FUNCTIONALITY*****************
//*****************************************************

//I can add my own event listener to the submit button
//I can remove the old functionality from the submit button
//I just can't save the old functionality first, then call it later in my event listener, and I don't know why.
//I know that my saved functionality is actually saved, there's just something I'm missing.
//I now think it would need to be called from unsafeWindow somehow
//Ugly solution is to recreate the submit button, hide it, and have the clone call the original when necessary.
function initializeSubmitButton() {
    var postButtonResults = document.evaluate("//a[@tabindex='3'][contains(@onclick, '.submit();')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if(postButtonResults.snapshotLength > 0) {
        var item = postButtonResults.snapshotItem(0);

        var newButton = document.createElement("a");
        newButton.href = "#";
        newButton.tabIndex = "3";
        newButton.innerHTML = "<img width='77' height='20' border='0' src='/images/2006skins/textEditor/buttonSubmit.gif'></img>";

        item.parentNode.insertBefore(newButton, item);
        item.style.display = 'none';

        newButton.setAttribute("onclick","return false;");
        newButton.addEventListener("click", function() {
            if(!checkForSober()) {
                alert("Incorrect answer. Post not submitted.");
            } else if(!checkForBadWords()) {
            } else {
                item.click();
            }
        }, false);
    }
}

function checkForSober() {
    if(getBoxStatusFromStorage("DrunkBoxChecked")) {
        var num1 = randomOneDigitNumber();
        var num2 = randomTwoDigitNumber();
        var answer = num1 * num2;

        var yourAnswer = prompt("What is " + num1 + " x " + num2 + "?", "");
        if(yourAnswer != null && yourAnswer == answer) {
            return true;
        }
    } else {
        return true;
    }

    return false;
}

function checkForBadWords() {
    var regex = populateRegex(getValuesFromStorageByKeyPrefix(BAD_WORD_PREFIX), true);
    if(regex) {
        var textArea = document.getElementById('messageBody');
        var text = textArea.value;
        text = splitAfterLast(text, "[/quote]");
        if(text.length > 0 && regex.source.length > 0) {
            var matches = text.match(regex);
            if(matches != null) {
                var uniqueMatches = matches.filter(function(elem, pos) {
                    return matches.indexOf(elem) == pos;
                });
                var results = "";
                for(var i = 0; i < uniqueMatches.length; i++) {
                    if(results.length > 0) {
                        results += " ";
                    }
                    results += "'" + uniqueMatches[i] + "'";
                }
                var shouldPost = confirm("Are you sure you want to post these words?\n\n" + results);
                if(shouldPost) {
                    return true;
                }
            } else {
                return true;
            }
        } else {
            return true;
        }
    } else {
        return true;
    }

    return false;
}

function splitAfterLast(text, searchFor) {
    var posit = text.lastIndexOf(searchFor);
    if(posit != -1) {
        posit += searchFor.length;
        return text.substring(posit);
    }

    return text;
}

//Random number between 11 and 99
function randomTwoDigitNumber() {
    return Math.floor(Math.random()*89) + 11;
}

//Random number between 2 and 9
function randomOneDigitNumber() {
    return Math.floor(Math.random()*7) + 2;
}


//*****************************************************
//****************SHARED FUNCTIONALITY*****************
//*****************************************************

//Makes user input regex-safe
function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

function populateRegex(array, wholeWord) {
    var wrapper = '';
    if(wholeWord) {
        wrapper = '\\b';
    }

    var regexString = "";
    for(var i = 0; i < array.length; i++) {
        var word = array[i];
        if(word != null && word.length > 0) {
            if(regexString.length > 0) {
                regexString += "|";
            }
            word = escapeRegExp(word);
            regexString += "(" + wrapper + word + wrapper + ")";
        }
    }
    if(regexString) {
        return new RegExp(regexString, "gi");
    }
    return null;
}

function hasExactKey(KEY) {
    var keys = GM_listValues();
    for(var i = 0; i < keys.length; i++) {
        if(keys[i] == KEY){
            return true;
        }
    }

    return false;
}

function getKeysFromStorageByKeyPrefix(PREFIX) {
    var resultKeys = [];
    var keys = GM_listValues();
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if(key.indexOf(PREFIX) == 0) {
            resultKeys.push(key);
        }
    }

    return resultKeys;
}

function getValuesFromStorageByKeyPrefix(PREFIX) {
    var values = [];
    var keys = GM_listValues();
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if(key.indexOf(PREFIX) == 0) {
            values.push(GM_getValue(key, ""));
        }
    }

    return values;
}

function getMapFromStorageByKeyPrefix(PREFIX) {
    var map = {};
    var keys = GM_listValues();
    for(var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if(key.indexOf(PREFIX) == 0) {
            var values = GM_getValue(key, "");
            if(values) {
                map[key] = values.split(SETTINGS_DELIM);
            }
        }
    }

    return map;
}

function getBoxStatusFromStorage(boxKey) {
    return GM_getValue(boxKey);
}



function removeAllTextFields(fieldsDivId, fieldName) {
    var div = document.getElementById(fieldsDivId);

    while(div.hasChildNodes()) {
        div.removeChild(div.lastChild);
    }
}

//*****************************************************
//*************COLOR PICKER FUNCTIONALITY**************
//*****************************************************

//Based on Matt Kruse's Color Picker Swatch Popup
//http://www.mattkruse.com/javascript/colorpicker/source.html


var COLORS_ARRAY = getColorsArray();

function createColorPickerPopup(pickerId) {
    var colorWindow = buildOptionWindow();
    colorWindow.style.display = 'none';
    colorWindow.style.top = '23px';
    colorWindow.id = pickerId;

    var colorsArray = getColorsArray();

    var colorTable = document.createElement("table");
    var numCols = 18;
    var colSize = 9;
    var colPxSize = colSize + "px";
    var currentRow;
    for(var i = 0; i < colorsArray.length; i++) {
        if((i % numCols) == 0) {
            currentRow = document.createElement("tr");
            colorTable.appendChild(currentRow);
        }

        var td = document.createElement("td");
        td.style.height = colPxSize;
        td.style.width =  colPxSize;
        td.style.backgroundColor = colorsArray[i];
        currentRow.appendChild(td);

        td.onclick = function() {
            document.getElementById(pickerId + "SelectedTd").style.backgroundColor = this.style.backgroundColor;
            document.getElementById(pickerId + "SelectedField").value = rgb2hex(this.style.backgroundColor);
        };
    }

    var selectedColorDiv = document.createElement("div");
    selectedColorDiv.style.marginLeft = "2px";
    selectedColorDiv.style.marginTop = "10px";
    selectedColorDiv.style.verticalAlign = 'top';

    var selectedColorTd = document.createElement("td");
    //I think 2 is about right for the td padding
    selectedColorTd.style.width = ((colSize + 3) * 12) + 'px';
    selectedColorTd.style.height = "18px";
    selectedColorTd.style.backgroundColor = null;
    selectedColorTd.style.display = "inline-block";
    selectedColorTd.style.marginRight = "13px";
    selectedColorTd.id = pickerId + "SelectedTd";

    var colorField = document.createElement("input");
    colorField.setAttribute("type", "text");
    colorField.setAttribute("size", 7);
    colorField.setAttribute("maxlength", 7);
    colorField.setAttribute("name", "ColorField");
    colorField.style.fontSize = "115%";
    colorField.style.display = "inline-block";
    colorField.id = pickerId + "SelectedField";

    colorField.onkeyup = function() {
        var val = colorField.value;
        if(val.length == 7) {
            document.getElementById(pickerId + 'SelectedTd').style.backgroundColor = val;
        }
    };

    selectedColorDiv.appendChild(selectedColorTd);
    selectedColorDiv.appendChild(colorField);

    var setCancelBtnDiv =  document.createElement('div');
    setCancelBtnDiv.style.marginTop = '20px';
    setCancelBtnDiv.style.verticalAlign = 'top';

    var setBtn = createButton("Set");
    setBtn.style.fontSize = "115%";
    setBtn.style.marginRight = "2px";
    setBtn.addEventListener("click", function() {
        setPickedColor(colorWindow, selectedColorTd);
        colorWindow.style.display = 'none';
    }, false);

    var cancelBtn = createButton("Cancel");
    cancelBtn.style.fontSize = "115%";
    cancelBtn.style.marginLeft = "2px";
    cancelBtn.addEventListener("click", function() {
        colorWindow.style.display = 'none';
    }, false);

    var clearBtn = createButton("Clear");
    clearBtn.style.fontSize = "115%";
    clearBtn.style.cssFloat = 'right';
    clearBtn.addEventListener("click", function() {
        selectedColorTd.style.backgroundColor = null;
        colorField.value = "";
    }, false);

    setCancelBtnDiv.appendChild(setBtn);
    setCancelBtnDiv.appendChild(cancelBtn);
    setCancelBtnDiv.appendChild(clearBtn);

    colorWindow.appendChild(colorTable);
    colorWindow.appendChild(selectedColorDiv);
    colorWindow.appendChild(setCancelBtnDiv);

    return colorWindow;
}

function setPickedColor(colorWindow, selectedColorTd) {
    var selectedColor = selectedColorTd.style.backgroundColor;
    var colorBox = colorWindow.value;
    while(colorBox.hasChildNodes()) {
        colorBox.removeChild(colorBox.lastChild);
    }

    if(selectedColor) {
        colorBox.style.backgroundColor = selectedColor;
    } else {
        resetColorBox(colorBox);
    }
}

function getColorsArray() {
    return ["#000000","#000033","#000066","#000099","#0000CC","#0000FF","#330000","#330033","#330066","#330099","#3300CC",
        "#3300FF","#660000","#660033","#660066","#660099","#6600CC","#6600FF","#990000","#990033","#990066","#990099",
        "#9900CC","#9900FF","#CC0000","#CC0033","#CC0066","#CC0099","#CC00CC","#CC00FF","#FF0000","#FF0033","#FF0066",
        "#FF0099","#FF00CC","#FF00FF","#003300","#003333","#003366","#003399","#0033CC","#0033FF","#333300","#333333",
        "#333366","#333399","#3333CC","#3333FF","#663300","#663333","#663366","#663399","#6633CC","#6633FF","#993300",
        "#993333","#993366","#993399","#9933CC","#9933FF","#CC3300","#CC3333","#CC3366","#CC3399","#CC33CC","#CC33FF",
        "#FF3300","#FF3333","#FF3366","#FF3399","#FF33CC","#FF33FF","#006600","#006633","#006666","#006699","#0066CC",
        "#0066FF","#336600","#336633","#336666","#336699","#3366CC","#3366FF","#666600","#666633","#666666","#666699",
        "#6666CC","#6666FF","#996600","#996633","#996666","#996699","#9966CC","#9966FF","#CC6600","#CC6633","#CC6666",
        "#CC6699","#CC66CC","#CC66FF","#FF6600","#FF6633","#FF6666","#FF6699","#FF66CC","#FF66FF","#009900","#009933",
        "#009966","#009999","#0099CC","#0099FF","#339900","#339933","#339966","#339999","#3399CC","#3399FF","#669900",
        "#669933","#669966","#669999","#6699CC","#6699FF","#999900","#999933","#999966","#999999","#9999CC","#9999FF",
        "#CC9900","#CC9933","#CC9966","#CC9999","#CC99CC","#CC99FF","#FF9900","#FF9933","#FF9966","#FF9999","#FF99CC",
        "#FF99FF","#00CC00","#00CC33","#00CC66","#00CC99","#00CCCC","#00CCFF","#33CC00","#33CC33","#33CC66","#33CC99",
        "#33CCCC","#33CCFF","#66CC00","#66CC33","#66CC66","#66CC99","#66CCCC","#66CCFF","#99CC00","#99CC33","#99CC66",
        "#99CC99","#99CCCC","#99CCFF","#CCCC00","#CCCC33","#CCCC66","#CCCC99","#CCCCCC","#CCCCFF","#FFCC00","#FFCC33",
        "#FFCC66","#FFCC99","#FFCCCC","#FFCCFF","#00FF00","#00FF33","#00FF66","#00FF99","#00FFCC","#00FFFF","#33FF00",
        "#33FF33","#33FF66","#33FF99","#33FFCC","#33FFFF","#66FF00","#66FF33","#66FF66","#66FF99","#66FFCC","#66FFFF",
        "#99FF00","#99FF33","#99FF66","#99FF99","#99FFCC","#99FFFF","#CCFF00","#CCFF33","#CCFF66","#CCFF99","#CCFFCC",
        "#CCFFFF","#FFFF00","#FFFF33","#FFFF66","#FFFF99","#FFFFCC","#FFFFFF"];
}

//Function to convert rgb color to hex format
function rgb2hex(rgb) {
    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x).toString(16)).slice(-2).toUpperCase();
    }
    return "#" + (hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])).toUpperCase();
}

//Function to convert rgb to hex
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}