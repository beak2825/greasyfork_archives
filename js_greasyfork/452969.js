// ==UserScript==
// @name         MH - Map Re-inviter
// @description  Repeat invites for RR
// @author       Maidenless
// @version      1.0.6
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @grant        none
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/452969/MH%20-%20Map%20Re-inviter.user.js
// @updateURL https://update.greasyfork.org/scripts/452969/MH%20-%20Map%20Re-inviter.meta.js
// ==/UserScript==

//Inject touchpoint
//universal mapIdl
var mapId;

//Shows button 
$(document).ajaxComplete(async(event,xhr,options) => {
    if (options.url == "https://www.mousehuntgame.com/managers/ajax/board/board.php"){
        $(".mi-invite-repeat")[0] ? null : addRepeater();
    }
})


function addRepeater(){
    var injectNode = $(".mousehuntActionButton.tiny.lightBlue.treasureMapView-previewRewardsButton")[0]
    //Somtimes the script fails to cloneNode when switching maps, but does not matter since it was cloned before;
    if (injectNode){
        var inviteNode = injectNode.cloneNode()
    };
    //bunch of CSS
    inviteNode.className = "mi-invite-repeat";
    inviteNode.style.color = "black";
    inviteNode.style.background = "pink";
    inviteNode.style.boxShadow = "1px 1px 1px #eee";
    inviteNode.style.border = "1px solid #000";
    inviteNode.style.borderColor = "#50549c";
    inviteNode.style.borderRadius = "5px"
    inviteNode.style.padding = "3px 5px";
    inviteNode.style.position = "relative";
    inviteNode.style.verticalAlign = "top";
    inviteNode.style.textAlign = "center";
    inviteNode.style.color = "#000!important";
    inviteNode.style.textDecoration = "none";
    inviteNode.style.fontSize = "10px";
    inviteNode.style.fontWeight = "100";
    inviteNode.style.lineHeight = "normal";
    //Mouse over and mouse out function
    inviteNode.onmouseover = function(){
        inviteNode.style.color = "white";
    }
    inviteNode.onmouseout = function(){
        inviteNode.style.color = "black";
    }
    var span = document.createElement("span");
    span.innerText = "Invite +";
    inviteNode.appendChild(span);
    //onclick function
    inviteNode.onclick = async()=>{
        var mapCurrentlyOpened;
        var maps = user.quests.QuestRelicHunter.maps;
        if(maps.length >1){
            mapCurrentlyOpened = $(".treasureMapRootView-tab.active.map")[0].children[1].innerText;
        } else {
            mapCurrentlyOpened = user.quests.QuestRelicHunter.maps[0].name;
        }
        console.log("Map currently opened is " + mapCurrentlyOpened);
        console.log(maps);
        var index = maps.findIndex(item => item.name == mapCurrentlyOpened);
        mapId = maps[index].map_id;
        await getCurrentHunters(mapId)
        .then(res=>{
            render(res);
        })
    }
    //disable if not maptain   
    /*var maptain = $(".treasureMapView-hunter.captain")[0].children[0].children[0].title;
    var username = user.firstname ? user.firstname : user.lastname;
    if (maptain.indexOf(username)<0){
        inviteNode.onclick = function(){
            return;
        }
        inviteNode.style.background = "grey";
    }*/
    injectNode.insertAdjacentElement("afterend",inviteNode);
    //https://stackoverflow.com/questions/46868091/css-trouble-with-displaynone-not-being-recognized
    var displayValue = window.getComputedStyle($(".mi-invite-repeat")[0]).display
    $(".mi-invite-repeat")[0].style.display = "block";
}

async function render(res){
    document
    .querySelectorAll("#mi-repeater-box")
    .forEach(el=>el.remove())

    //Render Box
    var div = document.createElement("div");
    div.id = "mi-repeater-box"
    div.style.backgroundColor = "#F5F5F5";
    div.style.position = "fixed";
    div.style.zIndex = "9999";
    div.style.left = "35vw";
    div.style.top = "20vh";
    div.style.border = "solid 3px #696969";
    div.style.borderRadius = "20px";
    div.style.padding = "10px";
    div.style.textAlign = "center";
    div.style.fontSize = "12px"
    
    //Close button
    const btnDiv = document.createElement("div");
    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x";
    closeButton.style.marginLeft = "5px";
    closeButton.style.cursor = "pointer";
    closeButton.style.float = "right";
    closeButton.style.position = "relative";
    closeButton.onclick = function () {
        document.body.removeChild(div); 
    }
    btnDiv.appendChild(closeButton);
    div.appendChild(btnDiv);
        
    //Header
    const toolHeader = document.createElement("div");
    toolHeader.className = "repeater-tool-header";
    toolHeader.textContent = "Map Invite Repeater"
    toolHeader.style.marginTop = "5px";
    toolHeader.style.height = "21px";
    toolHeader.style.textAlign = "Left";
    toolHeader.style.marginLeft = "17px";
    toolHeader.style.fontWeight = "bold";
    toolHeader.style.cursor = "Map Invite Repeater"
    div.appendChild(toolHeader);
    
    //Body
    const toolBody = document.createElement("div");
    toolBody.id = "mi-repeater-tool-body"

    //Current hunters
    var currentHunters = res;

    //Checks for record
    console.log("Getting Saved Hunters info from local storage")
    var savedHunters = localStorage.getItem("mi-repeater");
    if (savedHunters){
        console.log("Saved Hunters info obtained");
        savedHunters = JSON.parse(savedHunters);
        console.log(savedHunters);
        var table = document.createElement("table");
        table.style.margin = "auto";
        for(let i=0; i<savedHunters.length;i++){
            //Check whether the invited hunter is already in the map
            let index = currentHunters.findIndex(item => item.name === savedHunters[i].name);
            //If not, create a table row dedicated to invite the hunter
            if (index <0){
                const row = document.createElement("tr");
                row.style.textAlign = "left";

                const checkBoxTD = document.createElement("td");
                const checkBoxInput = document.createElement("input");
                checkBoxInput.type = "checkbox";
                checkBoxInput.className = "mi-checkbox";
                checkBoxInput.checked = true;
                checkBoxTD.appendChild(checkBoxInput);
                row.appendChild(checkBoxTD);

                const nameTd = document.createElement("td");
                const nameLabel = document.createElement("label");
                nameLabel.innerHTML = savedHunters[i].name;
                nameLabel.htmlFor = "mi-checkbox" + i;
                nameTd.appendChild(nameLabel);
                row.appendChild(nameLabel);
                table.appendChild(row);
            } else {
                console.log("Hunter " + i + " is already on the map");
            }
        }
        toolBody.appendChild(table);
    } else {
        //If no saved hunters
        console.log("No hunters saved in local storage")
    }

    //Save Button & Send Invite Button
    const action = document.createElement("div");
    div.style.width = "200px";
    //Save
    const saveBtn = document.createElement("button");
    saveBtn.textContent = "Save Current Hunters";
    saveBtn.style.cursor = "pointer";
    saveBtn.style.marginTop = "10px";
    saveBtn.onclick = async()=>{
        var stringCurrentHunters = JSON.stringify(currentHunters);
        localStorage.setItem("mi-repeater",stringCurrentHunters);
        alert ("Saved current Hunters in Map");
    }
    action.appendChild(saveBtn);
    
    const inviteBtn = document.createElement("button");
    inviteBtn.textContent = "Invite Hunters";
    inviteBtn.style.cursor = "pointer";
    inviteBtn.style.marginTop = "5px";
    action.appendChild(saveBtn);
    inviteBtn.onclick = async() =>{
        var nameChecked = $(".mi-checkbox");
        var combinedId = []
        for (let i=0;i<nameChecked.length;i++){
            if (nameChecked[i].checked == true){
                console.log(nameChecked[i] + "is checked");
                var nameInvite = $(".mi-checkbox")[i].parentNode.parentNode.children[1].innerHTML
                console.log("Inviting " + nameInvite)
                //Get the snuid from the name
                var index = savedHunters.findIndex(item => item.name == nameInvite);
                var snuid = savedHunters[index].sn_user_id;
                combinedId.push(snuid);
            }
        }
        //only send if there is something to send;
        if(combinedId != ""){
            await sendInvite(combinedId,mapId)
            .then(res=>{
                alert("Sent all map invites");
            })
        }
    }
    action.appendChild(inviteBtn);

    toolBody.appendChild(action);
    div.appendChild(toolBody);
    document.body.appendChild(div);
    dragElement(div,toolHeader)
}

function getCurrentHunters(mapId){
    console.log("Getting current hunters in the map")
    return new Promise (async (resolve,reject)=>{
        await postReq("https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
        `sn=Hitgrab&hg_is_ajax=1&action=map_info&map_id=${mapId}&uh=${user.unique_hash}&last_read_journal_entry_id=${lastReadJournalEntryId}`
        ).then(res=>{
            if (!res){
                return;
            } else {
                try{
                    var response = JSON.parse(res.responseText)
                    const mapHunters = response.treasure_map.hunters;
                    if (mapHunters){
                        console.log("Current Hunters info obtained")
                        //check whether hunter is active, if they left their names will still be in the list but their
                        //is_active will be false
                        for(var i=0;i<mapHunters.length;i++){
                            if (mapHunters[i].is_active == false){
                                mapHunters.splice(i,1);
                                i--;
                            }
                        }
                        console.log(mapHunters);
                        resolve(mapHunters);
                    } else {
                        console.log("No hunters on map")
                    }
                        //const stringMapHunters = JSON.stringify(mapHunters);
                        //localStorage.setItem("mi-repeater",stringMapHunters);
                } catch (error){
                    console.log(error)
                }
            }
        })
    })
}

function sendInvite(snuid,mapId){
    console.log("Inviting hunters")
    var combinedId = [];
    for(let i=0;i<snuid.length;i++){
        console.log("Sending to snuid " + snuid[i])
        combinedId = combinedId + "&snuids%5B%5D=" + snuid[i]
    }
    return new Promise ((resolve,reject)=>{
        postReq("https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
        `sn=Hitgrab&hg_is_ajax=1&action=send_invites&map_id=${mapId}` + combinedId + 
        `&uh=${user.unique_hash}&last_read_journal_entry_id=${lastReadJournalEntryId}`
       ).then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                if(data.success == "1"){
                    console.log("Sent map invite to hunter")
                } else {
                    alert("Invite failed:\nYou are not the maptain or\nInvite has been sent before or\nMap is full!")
                }
                resolve();
            } catch(error){
                console.log(error)
            }
        })
    })
}

    

function postReq(url, form) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          resolve(this);
        }
      };
      xhr.onerror = function () {
        reject(this);
      };
      xhr.send(form);
    });
  }

  function dragElement(elmnt,dragEl) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    /*if (elmnt.firstElementChild) {
      // if present, the header is where you move the DIV from:
     elmnt.firstElementChild.onmousedown = dragMouseDown;
    } else {*/
      // otherwise, move the DIV from anywhere inside the DIV:
      dragEl.onmousedown = dragMouseDown;
    //}
  
    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
}