// ==UserScript==
// @name         OBN TT Grabber
// @namespace    obn.tt_grabber
// @version      1.1.7
// @license      AGPL v3
// @description  Assistant to assault TTs without having to refresh
// @author       Wootty2000 [2344687]
// @match        https://www.torn.com/city.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470661/OBN%20TT%20Grabber.user.js
// @updateURL https://update.greasyfork.org/scripts/470661/OBN%20TT%20Grabber.meta.js
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

                //Create the OBN div that will hold all our span (and buttons)
                let divOBN = document.createElement('div');
                divOBN.id = 'obn-tt-buttons';

                //Create a divider
                let divider = document.createElement('hr');
                divider.className = 'page-head-delimiter m-top10 m-bottom10';

                //Create the Claim TT button
                let obnButtonClaim = document.createElement('BUTTON');
                obnButtonClaim.id = 'obn-tt-claim';
                obnButtonClaim.style.color = '#7f7f7f';
                obnButtonClaim.style.cursor = 'pointer';
                if(global.enableOBNTTButtons)
                {
                    obnButtonClaim.style.color = '#ddd';
                }
                else
                {
                    obnButtonClaim.style.color = '#7f7f7f';
                    obnButtonClaim.disabled = 'true';
                }
                obnButtonClaim.innerText = 'Claim';

                //Create the Drop TT button
                let obnButtonDrop = document.createElement('BUTTON');
                obnButtonDrop.id = 'obn-tt-drop';
                obnButtonDrop.style.color = '#7f7f7f';
                obnButtonDrop.style.cursor = 'pointer';
                if(global.enableOBNTTButtons)
                {
                    obnButtonDrop.style.color = '#ddd';
                }
                else
                {
                    obnButtonDrop.style.color = '#7f7f7f';
                    obnButtonDrop.disabled = 'true';
                }
                obnButtonDrop.innerText = 'Drop';

                //Create the Assult TT button
                let obnButtonAssault = document.createElement('BUTTON');
                obnButtonAssault.id = 'obn-tt-assault';
                obnButtonAssault.style.color = '#7f7f7f';
                obnButtonAssault.style.cursor = 'pointer';
                if(global.enableOBNTTButtons)
                {
                    obnButtonAssault.style.color = '#ddd';
                }
                else
                {
                    obnButtonAssault.style.color = '#7f7f7f';
                    obnButtonAssault.disabled = 'true';
                }
                obnButtonAssault.innerText = 'Assault';

                //Create the enable button
                let obnButtonEnable = document.createElement('BUTTON');
                obnButtonEnable.id = 'obn-tt-enable';
                obnButtonEnable.style.color = '#ddd';
                obnButtonEnable.style.cursor = 'pointer';
                obnButtonEnable.innerText = 'Enable';

                //Get the RRose Content Div
                let leafletRRoses = document.querySelectorAll('div.leaflet-popup-pane > div.leaflet-rrose');

                //Get the height of the current pane
                let leaftletRRoseHeight = divActionWrap.parentElement.clientHeight;

                //Add the buttons to the div
                divOBN.appendChild(obnButtonClaim);
                divOBN.appendChild(obnButtonDrop);
                divOBN.appendChild(obnButtonAssault);
                divOBN.appendChild(obnButtonEnable);

                //Add the div to the existing HTML
                divActionWrap.appendChild(divider);
                divActionWrap.appendChild(divOBN);

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

                    //let id = global.obnTTId;
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
                                    $("#terrResult").html(String(msg.success));
                                    
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

                                    torn.model.__data.territoryModeColours['own-faction'][id] = colour;
                                    torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID][id] = msg.square;
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

                                    //Nake the inner Div
                                    let innerDiv = document.createElement('div');
                                    innerDiv.id = 'url_panel';

                                    //Create the Divs that make the mesasge box
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
                                    message.innerText = 'Territory Sucessfully Claimed';

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
                                else{
                                    $("#terrResult").html(String(msg.error));
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

                    //let id = global.obnTTId;
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
                                    $("#terrResult").html(String(msg.success));
                                    
                                    //Get the TT and colours from the Torn object
                                    var shape = torn.get('collectionById', id);
                                    var colour = torn.model.__data.colour.territory;

                                    //Set the TT config
                                    shape.customFill = false;
                                    shape.owner = false;
                                    shape.factionID = false;
                                    shape.isMyTerritory = false;
                                    shape.removeClass('my-faction-territory');
                                    shape.setColour(colour);

                                    delete torn.model.__data.territoryModeColours['own-faction'][id];
                                    delete torn.model.__data.factionOwnTerritories.ownTerritories[torn.model.__data.factionID][id];
                                    
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

                                    //Nake the inner Div
                                    let innerDiv = document.createElement('div');
                                    innerDiv.id = 'url_panel';

                                    //Create the Divs that make the mesasge box
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
                                    message.innerText = 'Territory Sucessfully Abandoned';

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
                                else{
                                    $("#terrResult").html(String(msg.error));
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
                                    
                                    $("#terrResult").html(String(msg.success));
                                   
                                    
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

                                    //Nake the inner Div
                                    let innerDiv = document.createElement('div');
                                    innerDiv.id = 'url_panel';

                                    //Create the Divs that make the mesasge box
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
                                    message.innerText = 'Territory Sucessfully Assaualted';

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
                                else{
                                    $("#terrResult").html(String(msg.error));
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

                    //Mark the global enable parameter as true. This means any new TT info panes are also enabaled
                    global.enableOBNTTButtons = true;
                });
            }
        }
    },1000);
};

function insert(){
    var box = `<span id="terrResult"></span>`;

    if ($(".content-title").length > 0){
        $('.content-title').append(box);
    }
    else{
        setTimeout(insert,300);
    }

    
}

//Entry point. Runs during page load
(function() {
    'use strict';

    //Set the default as not enabled
    global.enableOBNTTButtons = false;

    insert();

    //Lets try to add the button
    addButton();

})();
