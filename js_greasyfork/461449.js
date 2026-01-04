// ==UserScript==
// @name         OBN TT Grabber
// @namespace    obn.tt_grabber
// @version      1.3.3
// @license      AGPL v3
// @description  Assistant to assault TTs without having to refresh
// @author       Wootty2000 [2344687]
// @match        https://www.torn.com/city.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461449/OBN%20TT%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/461449/OBN%20TT%20Grabber.meta.js
// ==/UserScript==

function addButton()
{
    //Loop every 1 second, looking for a territory dialogue wrap to appear
    let monitor = setInterval(() =>
    {
        //Grab the info and action wrap pane
        let divActionWraps = document.querySelectorAll('div.territory-dialogue-wrap > div.info-and-action-wrap');
        if(divActionWraps !== null)
        {
            //Grab all the info and action wraps
            for(let divCounter = 0; divCounter < divActionWraps.length; divCounter++)
            {
                //Grab one of the wraps
                let divActionWrap = divActionWraps[divCounter];

                //Grab the children and see if we have our buttons as the last child. If we do, skip the wrap
                let divActionWrapChildren = divActionWrap.children;
                if(divActionWrapChildren[divActionWrapChildren.length - 1].id == 'obn-tt-buttons')
                    continue;

                //Skip the popup pane that gives a reason why we cant claim / abandon / assault
                if(divActionWrap.className == "info-and-action-wrap territory-info-wrap")
                    continue;

                //Define the TT id;
                let id = "";

                //Get the UL Info wrap so we can extract the TT name
                let ulInfoWrap = document.querySelector('div.territory-dialogue-wrap > div.info-and-action-wrap').getElementsByClassName("territory-info-wrap")[0];

                //"Name: " should be the first element, but loop through them just to be sure
                for(let counter = 0; counter < ulInfoWrap.children.length; counter++)
                {
                    //Grab the text and make it all to upper case (just incase casing changes one day)
                    let innerText = ulInfoWrap.children[counter].innerText.toUpperCase();
                    //Did we get the Name element?
                    if(innerText.startsWith("NAME:"))
                    {
                        //Strip off "Name: " and get the TT name
                        id = torn.model.getTerrIDByName(innerText.substring(6));
                        //No point in looping, we have what we want
                        break;
                    }
                }

                //Create the Claim TT button
                let obnButtonClaim = document.createElement('BUTTON');
                obnButtonClaim.id = 'obn-tt-claim';
                obnButtonClaim.className = "torn-btn btn-dark-bg";
                obnButtonClaim.style.color = '#ddd';
                obnButtonClaim.style.cursor = 'pointer';
                obnButtonClaim.style.padding = '0 4px';
                obnButtonClaim.style.fontSize = '13px';
                obnButtonClaim.innerText = 'Claim';
                if(global.enableOBNTTButtons)
                    obnButtonClaim.style.display='';
                else
                    obnButtonClaim.style.display='none';

                //Create the Drop TT button
                let obnButtonDrop = document.createElement('BUTTON');
                obnButtonDrop.id = 'obn-tt-drop';
                obnButtonDrop.className = "torn-btn btn-dark-bg";
                obnButtonDrop.style.color = '#ddd';
                obnButtonDrop.style.cursor = 'pointer';
                obnButtonDrop.style.padding = '0 4px';
                obnButtonDrop.style.fontSize = '13px';
                obnButtonDrop.innerText = 'Drop';
                if(global.enableOBNTTButtons)
                    obnButtonDrop.style.display='';
                else
                    obnButtonDrop.style.display='none';

                //Create the Assult TT button
                let obnButtonAssault = document.createElement('BUTTON');
                obnButtonAssault.id = 'obn-tt-assault';
                obnButtonAssault.className = "torn-btn btn-dark-bg";
                obnButtonAssault.style.color = '#ddd';
                obnButtonAssault.style.cursor = 'pointer';
                obnButtonAssault.style.padding = '0 4px';
                obnButtonAssault.style.fontSize = '13px';
                obnButtonAssault.innerText = 'Assault';
                if(global.enableOBNTTButtons)
                    obnButtonAssault.style.display='';
                else
                    obnButtonAssault.style.display='none';

                //Create the Move TT button
                let obnButtonMove = document.createElement('BUTTON');
                obnButtonMove.id = 'obn-tt-move';
                obnButtonMove.className = "torn-btn btn-dark-bg";
                obnButtonMove.style.color = '#ddd';
                obnButtonMove.style.cursor = 'pointer';
                obnButtonMove.style.padding = '0 4px';
                obnButtonMove.style.fontSize = '13px';
                obnButtonMove.innerText = 'Move';
                if(global.enableOBNTTButtons)
                    obnButtonMove.style.display='';
                else
                    obnButtonMove.style.display='none';

                //Create the enable button
                let obnButtonEnable = document.createElement('BUTTON');
                obnButtonEnable.id = 'obn-tt-enable';
                obnButtonEnable.className = "torn-btn btn-dark-bg";
                obnButtonEnable.style.color = '#ddd';
                obnButtonEnable.style.cursor = 'pointer';
                obnButtonEnable.style.padding = '0 5px';
                obnButtonEnable.style.fontSize = '13px';
                obnButtonEnable.innerText = 'Enable TT Grabber';
                if(global.enableOBNTTButtons)
                    obnButtonEnable.style.display='none';
                else
                    obnButtonEnable.style.display='';


                //Get the RRose Content Div
                let leafletRRoses = document.querySelectorAll('div.leaflet-popup-pane > div.leaflet-rrose');

                //Get the height of the current pane
                let leaftletRRoseHeight = divActionWrap.parentElement.clientHeight;

                //Create the span to hold the new buttons
                let spanOBN = document.createElement('span');

                //Add the buttons to the div
                spanOBN.appendChild(obnButtonClaim);
                spanOBN.appendChild(obnButtonDrop);
                spanOBN.appendChild(obnButtonAssault);
                spanOBN.appendChild(obnButtonMove);

                //Add the button to the span
                spanOBN.appendChild(obnButtonEnable);

                //Create the OBN div that will hold all the outer span
                let divOBN = document.createElement('div');
                divOBN.id = 'obn-tt-buttons';

                divOBN.appendChild(spanOBN);

                //Add the div to the existing HTML
                divActionWrap.appendChild(divOBN);

                //Calculate the additional height needed due to the new buttons
                let additionalSize = divActionWrap.parentElement.clientHeight - leaftletRRoseHeight;

                //Find out how many leaflet-roses we have.
                //More than 1 and we have either a TT with a racket (2), or a war (2) or a war with a racket (4).
                if(document.querySelectorAll('div.leaflet-popup-pane > div.leaflet-rrose').length > 1)
                {
                    //Get the next siblng from way up the tree.
                    let racketDiv = divActionWrap.parentElement.parentElement.parentElement.parentElement.nextSibling;
                    //If the Div is less that 100px height, its a racket pane
                    if(racketDiv != null && racketDiv.clientHeight < 100)
                    {
                        //Get the racket pane style
                        let racketInfoStyleBottom = racketDiv.style.bottom;
                        //Move the racket pane up
                        racketDiv.style.bottom = parseInt(racketInfoStyleBottom.slice(0,-2)) + parseInt(additionalSize) + "px";
                    }
                }

                ///Add the click event listener for Claim.
                obnButtonClaim.addEventListener('click', async () =>
                {
                    //Check that we actually have the TT id
                    if(id == "")
                    {
                        alert("ERROR: Can not find territory ID. Script will not run");
                        return;
                    }

                    await getAction(
                    {
                        type: 'post',
                        action: 'city.php',
                        data:
                        {
                            type: 'claim',
                            id: id,
                            exist: "",
                            exist_data: "",
                            is_old_collection: 0,
                            step: "action"
                        },
                        success: (str) =>
                        {
                            try
                            {
                                //Try to parse the JSON
                                const msg = JSON.parse(str);

                                //Print the msg to the console, used for debug
                                console.log(msg);

                                //Did we succeed?
                                if(msg.success)
                                {
                                    //Update the map
                                    addOwnTerritoryOnMap(id, msg.square);

                                    //Let the user know we were successfull
                                    displayMessage('Territory Sucessfully Claimed');
                                }
                            }
                            catch (e)
                            {
                                //Something went wrong. Throw it in the console
                                alert("Someone has gone wrong. Probably not sending the commands");
                                console.log(e);
                            }
                        }
                    });
                });

                //Add the click event listener for Drop
                obnButtonDrop.addEventListener('click', async () =>
                {
                    //Check that we actually have the TT id
                    if(id == "")
                    {
                        alert("ERROR: Can not find territory ID. Script will not run");
                        return;
                    }

                    //Get the current number of TTs owned.
                    var ttCount = Object.keys(torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID]).length;

                    //Do we need to ask the user if they are sure?
                    if(ttCount == 1 && !global.okToS7)
                        global.okToS7 = confirm('Are you SURE you want to S7 yourself?!');

                    //If we are ok to request the drop, try
                    if(ttCount == 1 && global.okToS7 || ttCount > 1)
                    {
                        await getAction(
                        {
                            type: 'post',
                            action: 'city.php',
                            data:
                            {
                                type: 'abandon',
                                id: id,
                                exist: "",
                                exist_data: "",
                                is_old_collection: 0,
                                step: "action"
                            },
                            success: (str) =>
                            {
                                try
                                {
                                    //Try to parse the JSON
                                    const msg = JSON.parse(str);

                                    //Print the msg to the console, used for debug
                                    console.log(msg);

                                    //Did we succeed?
                                    if(msg.success)
                                    {
                                        //Update the map
                                        deleteOwnTerritoryOnMap(id);

                                        //Lets tell the user know we were successful
                                        displayMessage('Territory Sucessfully Abandoned');
                                    }
                                }
                                catch (e)
                                {
                                    //Something went wrong. Throw it in the console
                                    alert("Someone has gone wrong. Probably not sending the commands");
                                    console.log(e);
                                }
                            }
                        });
                    }
                });

                //Add the click event listener for Assault. This will perform a POST
                obnButtonAssault.addEventListener('click', async () =>
                {
                    //Check that we actually have the TT id
                    if(id == "")
                    {
                        alert("ERROR: Can not find territory ID. Script will not run");
                        return;
                    }

                    await getAction(
                    {
                        type: 'post',
                        action: 'city.php',
                        data:
                        {
                            type: 'take',
                            id: id,
                            exist: "",
                            exist_data: "",
                            is_old_collection: 0,
                            step: "action"
                        },
                        success: (str) =>
                        {
                            try
                            {
                                //Try to parse the JSON
                                const msg = JSON.parse(str);

                                //Print the msg to the console, used for debug
                                console.log(msg);

                                //If we get the TT, close the pane and display a message.
                                //Need to make the new pane only closable with a X click
                                if(msg.success)
                                {
                                    //Update the map
                                    addOwnTerritoryOnMap(id, msg.square);

                                    //Lets tell the user know we were successful
                                    displayMessage('Territory Sucessfully Assaualted');
                                }
                            }
                            catch (e)
                            {
                                //Something went wrong. Throw it in the console
                                alert("Someone has gone wrong. Probably not sending the commands");
                                console.log(e);
                            }
                        }
                    });
                });

                //Add the click event listener for Move. This will perform a POST
                obnButtonMove.addEventListener('click', async () =>
                {
                    //Check that we actually have the TT id
                    if(id == "")
                    {
                        alert("ERROR: Can not find territory ID. Script will not run");
                        return;
                    }

                    await getAction(
                    {
                        type: 'post',
                        action: 'city.php',
                        data:
                        {
                            type: 'move',
                            id: id,
                            exist: "",
                            exist_data: "",
                            is_old_collection: 0,
                            step: "action"
                        },
                        success: (str) =>
                        {
                            try
                            {
                                //Try to parse the JSON
                                const msg = JSON.parse(str);

                                //Print the msg to the console, used for debug
                                console.log(msg);

                                //If we get the TT, close the pane and display a message.
                                //Need to make the new pane only closable with a X click
                                if(msg.success)
                                {
                                    //Get current TT id
                                    var existing = Object.keys(torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID])[0]

                                    //Update the map
                                    deleteOwnTerritoryOnMap(existing);
                                    addOwnTerritoryOnMap(id, msg.square);
                                }
                            }
                            catch (e)
                            {
                                //Something went wrong. Throw it in the console
                                alert("Someone has gone wrong. Probably not sending the commands");
                                console.log(e);
                            }
                        }
                    });
                });

                //Add the click event listener for the Enable button
                obnButtonEnable.addEventListener('click', async() =>
                {
                    //Enable and change colours on the 3 buttons
                    //If we select a warring territory, there are 2 panes with buttons. Need to make sure we do both panes

                    let obnButtonClaims = document.querySelectorAll('[id=obn-tt-claim]');
                    for(let buttons = 0; buttons < obnButtonClaims.length; buttons++)
                    {
                        obnButtonClaims[buttons].style.color = 'rgb(221, 221, 221)';
                        obnButtonClaims[buttons].disabled = false;
                    }

                    let obnButtonDrops = document.querySelectorAll('[id=obn-tt-drop]');
                    for(let buttons = 0; buttons < obnButtonDrops.length; buttons++)
                    {
                        obnButtonDrops[buttons].style.color = 'rgb(221, 221, 221)';
                        obnButtonDrops[buttons].disabled = false;
                    }

                    let obnButtonAssaults = document.querySelectorAll('[id=obn-tt-assault]');
                    for(let buttons = 0; buttons < obnButtonAssaults.length; buttons++)
                    {
                        obnButtonAssaults[buttons].style.color = 'rgb(221, 221, 221)';
                        obnButtonAssaults[buttons].disabled = false;
                    }

                    let obnButtonMoves = document.querySelectorAll('[id=obn-tt-move]');
                    for(let buttons = 0; buttons < obnButtonMoves.length; buttons++)
                    {
                        obnButtonMoves[buttons].style.color = 'rgb(221, 221, 221)';
                        obnButtonMoves[buttons].disabled = false;
                    }

                    let obnButtonEnables = document.querySelectorAll('[id=obn-tt-enable]');
                    for(let buttons = 0; buttons < obnButtonMoves.length; buttons++)
                    {
                        obnButtonClaims[buttons].style.display='';
                        obnButtonDrops[buttons].style.display='';
                        obnButtonAssaults[buttons].style.display='';
                        obnButtonMoves[buttons].style.display='';
                        obnButtonEnables[buttons].style.display='none';
                    }


                    //Mark the global enable parameter as true. This means any new TT info panes are also enabled
                    global.enableOBNTTButtons = true;
                });
            }
        }
    },1000);
};

function addOwnTerritoryOnMap(id, square)
{
    //Get the TT and colours from the Torn object
    var shape = torn.get('collectionById', id);
    var colour = torn.model.__data.colour.faction;

    //Set the TT config
    shape.customFill = true;
    shape.owner = true;
    shape.factionID = torn.model.__data.factionID;
    shape.isMyTerritory = true;
    shape.addClass('my-faction-territory');
    shape.removeClass('my-faction-neighbours');
    shape.setColour(colour);

    torn.model.__data.territoryModeColours['own-faction'][id] = torn.model.__data.colour.faction;
    torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID][id] = square;

    var existingId = Object.keys(torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID])[0]
    var strokeColour = torn.model.__data.territoryModeColours['own-faction'][existingId];
    shape.path.setAttribute('stroke', strokeColour);

    //Display the number of tertitories that are held
    updateTerritoryCount();
}

function deleteOwnTerritoryOnMap(id)
{
    //Get the TT and colours from the Torn object
    var shape = torn.get('collectionById', id);
    var colour = torn.model.__data.colour.territory;

    //Set the TT config
    shape.customFill = false;
    shape.owner = false;
    shape.factionID = false;
    shape.isMyTerritory = false;
    shape.removeClass('my-faction-territory');
    shape.addClass('my-faction-neighbours');
    shape.setColour(colour);
    shape.path.setAttribute('stroke', '#999999');

    delete torn.model.__data.territoryModeColours['own-faction'][id];
    delete torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID][id];

    //Display the number of tertitories that are held
    updateTerritoryCount();
}

function updateTerritoryCount()
{
    //skip-to-content
    let titleDiv = document.querySelector('div.content-title');
    var element = titleDiv.children[0];

    var ttCount = Object.keys(torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID]).length;
    var ttMaxCount = torn.model.__data.availableTerrQuantity;
    element.textContent = "City - Holding " + ttCount + " of " + ttMaxCount + " territories" ;
}

function displayMessage(text)
{
    //Delete the dialogue wrap so we can display a success message
    let dialogueWrap = document.querySelector('div.territory-dialogue-wrap');
    dialogueWrap.remove();

    //Get the RRose Content Div and correct the width
    let rroseContent = document.querySelector('div.leaflet-rrose-content');
    rroseContent.style = "width: 282px;";

    //Change the class name of the content-wrapper div
    let leatletRRoseContentWrapper = rroseContent.parentElement;
    leatletRRoseContentWrapper.className = 'div.leaflet-rrose-content-wrapper wrapper-info-panel';

    //Make changes to the DOM tree to get the new message in the correct place
    let leafletRRose = leatletRRoseContentWrapper.parentElement;
    leafletRRose.style = 'transform: translate3d(390px, 228px, 0px); bottom: -10px; left: -143px;)';

    //Make the outer Div
    let outerDiv = document.createElement('div');
    outerDiv.id = 'map-info-panel-box';
    outerDiv.className = 'map-info-panel-box';

    //Make the inner Div
    let innerDiv = document.createElement('div');
    innerDiv.id = 'url_panel';

    //Create the Divs that make the message box
    //Left
    let leftDiv = document.createElement('div');
    leftDiv.className = 'left-side';

    //Center
    let middleDiv = document.createElement('div');
    middleDiv.className = 'middle-side';

    //Right
    let rightDiv = document.createElement('div');
    rightDiv.className = 'right-side';

    //Text to display
    let message = document.createElement('h2');
    message.innerText = text;

    //Add the text to the center element
    middleDiv.appendChild(message);

    //Add left, center and right to the inner Div
    innerDiv.appendChild(leftDiv);
    innerDiv.appendChild(middleDiv);
    innerDiv.appendChild(rightDiv);

    //Add inner Div to the outer div
    outerDiv.appendChild(innerDiv);

    //Add the outer div to the parent.
    rroseContent.appendChild(outerDiv);
}


//Entry point. Runs during page load
(function()
{
    'use strict';

    //Set the variable defaults
    global.enableOBNTTButtons = false;
    global.okToS7 = false;

    //Lets try to add the button
    addButton();

    //Display the number of tertitories that are held
    setTimeout(updateTerritoryCount, 500);
})();