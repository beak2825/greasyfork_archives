// ==UserScript==
// @name         MH - Maptain Tool
// @description  Maptain Tool: Send SB and Map invite in a click!
// @author       Chromatical
// @version      2.0.7
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @resource     https://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @icon         https://www.google.com/s2/favicons?domain=mousehuntgame.com
// @namespace https://greasyfork.org/users/748165
// @downloadURL https://update.greasyfork.org/scripts/428215/MH%20-%20Maptain%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/428215/MH%20-%20Maptain%20Tool.meta.js
// ==/UserScript==

$(document).ready(function() {
    addTouchPoint();
});

function addTouchPoint() {
    if ($('.snipeHix').length == 0) {
        const invPages = $('.friends .tournament_scoreboards ');
        const snipeHix = document.createElement('li');
        snipeHix.classList.add('maptain_tool');
        const snipeHixBtn = document.createElement('a');
        snipeHixBtn.innerText = "Maptain Tool";
        snipeHixBtn.onclick = function () {
            render();
        };

        const icon = document.createElement("div");
        icon.className = "icon";
        snipeHixBtn.appendChild(icon);
        snipeHix.appendChild(snipeHixBtn);
        $(snipeHix).insertAfter(invPages);
    }
}

function getFriends(){
    return new Promise((resolve, reject) => {
        postReq("https://www.mousehuntgame.com/managers/ajax/users/userData.php",
                `sn=Hitgrab&hg_is_ajax=1&uh=${user.unique_hash}&get_friends=true`
               ).then(res=>{
            try{
                var data = JSON.parse(res.responseText);
                var friendNameList = []
                if(data.user_data){
                    var friendSnuidList = Object.keys(data.user_data)
                    for(var i=0;i<friendSnuidList.length;i++){
                        friendNameList.push(data.user_data[friendSnuidList[i]].name)
                    }
                    resolve([friendSnuidList,friendNameList]);
                }
            } catch(error){
                alert("Error getting friends! Please contact Chromatical on Discord");
                console.log(error)
            }
        })
    })
}


async function render(){
    document
     .querySelectorAll("#map-tool-box")
     .forEach(el=> el.remove())

    const div = document.createElement("div");
    div.id = "map-tool-box";
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

    const closeButton = document.createElement("button", {
        id: "close-button"
    });
    closeButton.textContent = "x"
    closeButton.style.marginLeft = "5px"
    closeButton.style.cursor = "pointer"
    closeButton.onclick = function () {
        document.body.removeChild(div);
        var expandedMap = document.getElementById("track-expand-div")
        var addMap = document.getElementById("add-row-div")
        if (expandedMap){
            document.body.removeChild(expandedMap)
        }
        if (addMap){
            document.body.removeChild(addMap)
        }
    };

    const minButton = document.createElement("button", {
        id: "minimise-button"
    });
    minButton.textContent = "-"
    minButton.style.marginLeft = "57px"
    minButton.style.cursor = "pointer"
    minButton.onclick = function(){
        if (minButton.textContent == "-"){
            $("#maptain-tool-content")[0].style.display = "none"
            $(".maptain-tool-info")[0].style.marginLeft = "0px"
            minButton.textContent = "+"
            minButton.style.marginLeft = "5px"
        } else if (minButton.textContent == "+"){
            $("#maptain-tool-content")[0].style.display = ""
            $(".maptain-tool-info")[0].style.marginLeft = "17px"
            minButton.textContent = "-"
            minButton.style.marginLeft = "57px"
        }
    }

    const toolInfo = document.createElement("div")
    toolInfo.className = "maptain-tool-info"
    toolInfo.textContent = "Maptain Tool"
    toolInfo.style.height = "21px"
    toolInfo.style.textAlign = "Left"
    toolInfo.style.marginLeft = "17px"
    toolInfo.style.fontWeight = "bold"
    toolInfo.style.cursor = "context-menu"

    const contentDiv = document.createElement("div")
    contentDiv.id = "maptain-tool-content"

    const table = document.createElement("table");
    table.id = "maptain-tool-table"
    table.style.textAlign = "left";
    table.style.borderSpacing = "1em 0"

    //hid-------------------------------------------
    const hid_row = document.createElement("tr");
    const hid_td1 = document.createElement("td");
    const hid_td2 = document.createElement("td")

    const hid_radio = document.createElement("input")
    hid_radio.type = "radio";
    hid_radio.name = "chro-hunter-friend"
    hid_radio.id = "chro-hunter-radio"
    hid_radio.style.verticalAlign = "middle"
    hid_radio.style.marginTop = "-2px"
    hid_radio.checked = true;
    hid_radio.onchange = function (){
        processRadio()
    }
    hid_td1.appendChild(hid_radio)

    const hid_label = document.createElement("label");
    hid_label.innerText = "Hunter ID: "
    hid_label.htmlFor = "chro-radio-hid"
    hid_td1.appendChild(hid_label);

    const hid_input = document.createElement("input");
    hid_input.type = "text";
    hid_input.id = "hunter-input-id"
    hid_input.size = "10"
    hid_input.style.placeHolder = "1";
    hid_td2.appendChild(hid_input)

    //friends---------------------------------------
    const friend_row = document.createElement("tr");
    const friend_td1 = document.createElement("td");
    friend_td1.style.textAlign = "right"
    const friend_td2 = document.createElement("td")

    const friend_radio = document.createElement("input")
    friend_radio.type = "radio";
    friend_radio.name = "chro-hunter-friend"
    friend_radio.id = "chro-friend-radio"
    friend_radio.style.verticalAlign = "middle"
    friend_radio.style.marginTop = "-2px"
    friend_radio.style.position = "relative"
    friend_radio.style.right = "17.5px"
    friend_radio.onchange = function(){
        processRadio();
    };
    friend_td1.appendChild(friend_radio)

    const friend_label = document.createElement("label");
    friend_label.innerHTML = "Friend:"
    friend_label.htmlFor = "chro-radio-friend"
    friend_td1.appendChild(friend_label);

    const friend_input = document.createElement("input");
    friend_input.type = "text";
    friend_input.id = "friend-input-id"
    friend_input.disabled = true;
    friend_input.size = "10"

    friend_td2.appendChild(friend_input)

    //Either friend or hunter-------------------------------------
    var friendList;
    var friendSnuid;
    var snuid;
    var name;
    async function processRadio() {
          if (hid_radio.checked) {
            hid_input.disabled = false;
            friend_input.disabled = true;
            friend_input.value = ""
          } else if (friend_radio.checked) {
            hid_input.disabled = true;
            friend_input.disabled = false;
            hid_input.value = ""
              var list = await getFriends();
              friendSnuid = list[0];
              friendList = list[1]
              $("#friend-input-id").autocomplete({
                  source: list[1],
                  open: function(){
                      setTimeout(function () {
                          $('.ui-autocomplete').css('z-index', 99999999999999);
                      }, 0);
                  }
              });
          }
        }


    //sb--------------------------------------------
    const sb_row = document.createElement("tr");
    const sb_td1 = document.createElement("td");
    sb_td1.style.textAlign = "right"
    const sb_td2 = document.createElement("td");

    const sb_label = document.createElement("label");
    sb_label.innerText = "SB Amount: "
    sb_td1.appendChild(sb_label);

    const sb_input = document.createElement("input");
    sb_input.type = "text";
    sb_input.id = "sb-input-id"
    sb_input.size = "10"
    sb_input.placehodler = "112"
    sb_td2.appendChild(sb_input);

    //map--------------------------------------
    if(typeof (user.quests.QuestRelicHunter.maps[0]) == "undefined"){
        var mapName1 = ""
        } else {
            mapName1 = user.quests.QuestRelicHunter.maps[0].name
        }
    mapName1 = await replaceRare(mapName1)

    const map_row = document.createElement("tr");
    const map_td1 = document.createElement("td");
    map_td1.style.textAlign = "right"
    const map_td2 = document.createElement("td");

    const map_label = document.createElement("label");
    map_label.innerText = "Map: "
    map_td1.appendChild(map_label);

    const map_select = document.createElement("select",{
        id: "map_select"});
    map_select.style.width = "103px"
    var user_maps = user.quests.QuestRelicHunter.maps
    if (user_maps){
        for (var i=0;i<user_maps.length;i++){
            var option = document.createElement("OPTION");
            option.innerText = user_maps[i].name;
            map_select.appendChild(option);
        }
    } else {
        option = document.createElement("OPTION");
        option.innerText = "None";
        map_select.appendChild(option);
    }
    map_select.onchange = async function processMap(e){
        mapName1 = map_select.value
        mapName1 = await replaceRare(mapName1)
        renderSbTrack(mapName1)
    }
    map_td2.appendChild(map_select);

    //append-------------------------------------------
    hid_row.appendChild(hid_td1);
    hid_row.appendChild(hid_td2);
    friend_row.appendChild(friend_td1);
    friend_row.appendChild(friend_td2);
    sb_row.appendChild(sb_td1);
    sb_row.appendChild(sb_td2);
    map_row.appendChild(map_td1);
    map_row.appendChild(map_td2);
    table.appendChild(map_row);
    table.appendChild(sb_row);
    table.appendChild(friend_row);
    table.appendChild(hid_row);

    //Buttons---------------------------------------------
    const actionDiv = document.createElement("div");
    actionDiv.className = "action-div"

    const sbBtn = document.createElement("button",{
        id: "sb-button"
    })
    sbBtn.textContent = "Send SB"
    sbBtn.style.cursor = "pointer"
    sbBtn.onclick = async function (){
        if(sb_input.value > 0){
            var snuidAndName = await getSnuidAndName(hid_input.value,friend_input.value,friendList,friendSnuid)
            snuid = snuidAndName[0]
            name = snuidAndName[1]
            var promise = await getConfirmation("sendSB",snuid,name,sb_input.value)
             .then(
                 result => sendSB(snuid,sb_input.value),
                 error => {}
                )
            }
    }

    const mapBtn = document.createElement("button",{
        id: "map-button"
    })
    mapBtn.textContent = "Invite"
    mapBtn.style.cursor = "pointer"
    mapBtn.style.marginLeft = "5px"
    mapBtn.onclick = async function (){
        if(map_select.value != "None"){
            var map_id;
            for (var i=0;i<user_maps.length;i++){
                if (user_maps[i].name == map_select.value){
                    map_id = user_maps[i].map_id
                }
            var snuidAndName = await getSnuidAndName(hid_input.value,friend_input.value,friendList,friendSnuid)
            snuid = snuidAndName[0]
            name = snuidAndName[1]
            var promise = await getConfirmation("sendInvite",snuid,name,map_select.value)
             .then(
                 result => sendInvite(snuid,map_id),
                 error => {}
                )
            }
        }
    }

    const bothBtn = document.createElement("button",{
        id: "both-button"
    })
    bothBtn.textContent = "Both"
    bothBtn.style.cursor = "pointer"
    bothBtn.style.marginLeft = "5px"
    bothBtn.onclick = async function (){
        if(map_select.value != "None" && sb_input.value > 0){
            var map_id;
            for (var i=0;i<user_maps.length;i++){
                if (user_maps[i].name == map_select.value){
                    map_id = user_maps[i].map_id
                }
            }
            var snuidAndName = await getSnuidAndName(hid_input.value,friend_input.value,friendList,friendSnuid)
            snuid = snuidAndName[0]
            name = snuidAndName[1]
            var promise = await getConfirmation("sendSBAndInvite",snuid,name,sb_input.value,map_select.value)
             .then(
                 result => {
                     sendSB(snuid,sb_input.value);
                     sendInvite(snuid,map_id);
                     changeSbTrack(map_select.value,name,sb_input.value)
                     //map_select.value,sb_input,name
                 },
                 error => {}
             )}
    }
    actionDiv.appendChild(sbBtn)
    actionDiv.appendChild(mapBtn)
    actionDiv.appendChild(bothBtn)

    //v2.0 features--------------------------------------------------
    const trackDiv = document.createElement("div")
    trackDiv.id = "map-tool-track-div"
    trackDiv.style.paddingTop = "6px"

    const sbtrackDiv = document.createElement("div")
    sbtrackDiv.id = "map-tool-sb-track-div"
    var currentMapName = mapName1
    currentMapName = await replaceRare(currentMapName)
    if(currentMapName){
        var currentMap = "Chro-".concat(currentMapName)
    }
    if (localStorage.getItem(currentMap) && localStorage.getItem(currentMap) != '[]'){
        var parsedMap = JSON.parse(localStorage.getItem(currentMap));
        var last = parsedMap.length-1;
        var totalSB = parsedMap[last][4]
        } else {
            totalSB = 0
        }
    sbtrackDiv.innerText = "SB+ sent: ".concat(totalSB);
    sbtrackDiv.style.textAlign = "Left"
    sbtrackDiv.style.marginLeft = "5px"
    sbtrackDiv.style.float = "left"
    sbtrackDiv.style.paddingTop = "4px"

    const trackActDiv = document.createElement("div")
    trackActDiv.id = "map-tool-action-div"
    trackActDiv.style.float = "right"

    const plusButton = document.createElement("button", {
        id: "plus-button"
    });
    plusButton.textContent = "+"
    plusButton.style.cursor = "pointer"
    plusButton.onclick = function () {
        var trackdiv = document.getElementById("add-row-div")
        if (trackdiv){
            document.body.removeChild(trackdiv)
        } else {
        addTrackRow(mapName1)
        }
    };

    /*const minusButton = document.createElement("button", {
        id: "minus-button"
    });
    minusButton.textContent = "-"
    minusButton.style.width = "24px"
    minusButton.style.marginLeft = "5px"
    minusButton.style.cursor = "pointer"
    minusButton.onclick = function () {
    };*/

    const bdButton = document.createElement("button", {
        id: "bd-button"
    });
    bdButton.textContent = "?"
    bdButton.style.marginLeft = "5px"
    bdButton.style.cursor = "pointer"
    bdButton.onclick = function () {
        var expandedMap = document.getElementById("track-expand-div")
        if (expandedMap){
            document.body.removeChild(expandedMap)
        } else {
            expandMap(mapName1);
        }
    };

    const resetButton = document.createElement("button", {
        id: "reset-button"
    });
    resetButton.textContent = "Reset"
    resetButton.style.marginLeft = "5px"
    resetButton.style.cursor = "pointer"
    resetButton.marginRight = "5px"
    resetButton.onclick = async function () {
        var promise = await getConfirmation("reset")
         .then(async function(res)
             {
                 var currentMap = "Chro-".concat(map_select.value);
                 currentMap = await replaceRare(currentMap)
                 var emptyset = []
                 localStorage.setItem(currentMap,JSON.stringify(emptyset));
                 document.getElementById("map-tool-sb-track-div").innerText = "SB+ sent: 0";
                 var expandedMap = document.getElementById("track-expand-div")
                 if (expandedMap){
                     expandMap(map_select.value)
                 }
             },
         error=> {})
    }

    trackActDiv.appendChild(plusButton)
    trackActDiv.appendChild(bdButton)
    trackActDiv.appendChild(resetButton)
    trackDiv.appendChild(sbtrackDiv)
    trackDiv.appendChild(trackActDiv)
    //append---------------------------------------------------------

    toolInfo.appendChild(minButton);
    toolInfo.appendChild(closeButton);
    div.appendChild(toolInfo);
    contentDiv.appendChild(document.createElement("br"))
    contentDiv.appendChild(table);
    contentDiv.appendChild(document.createElement("br"))
    contentDiv.appendChild(actionDiv)
    contentDiv.appendChild(trackDiv)
    div.appendChild(contentDiv);
    document.body.appendChild(div);
    dragElement(div);
}

async function getSnuidAndName(hid_input,friend_input,friendList,friendSnuid){
    return new Promise(async(resolve, reject) => {
        if(hid_input){
            var snuidAndName = await getSnuidId(hid_input);
            var snuid = snuidAndName[0];
            var name = snuidAndName[1];
        } else if (friend_input){
            var friend_index = friendList.indexOf(friend_input);
            snuid = friendSnuid[friend_index];
            name = friend_input;
        }
        resolve ([snuid,name])
    })
}

function getSnuidId(hid){
    return new Promise((resolve, reject) => {
        if(hid != user.user_id && hid.length >0){
            postReq("https://www.mousehuntgame.com/managers/ajax/pages/friends.php",
                   `sn=Hitgrab&hg_is_ajax=1&action=community_search_by_id&user_id=${hid}&uh=${user.unique_hash}`
                   ).then(res=>{
                try{
                    var data = JSON.parse(res.responseText);
                    if (data){
                        var hunter_name = data.friend.name;
                        var hunter_snuid = data.friend.sn_user_id;
                        resolve([hunter_snuid,hunter_name])
                    }
                }catch (error){
                    console.log(error)
                }
            })
        }
    })
}

function getConfirmation(action,snuid,name,input_value,input_value2){
     return new Promise((resolve, reject) => {
         document
             .querySelectorAll("#confirm-action-box")
             .forEach(el=> el.remove())

        const actdiv = document.createElement("div");
        actdiv.id = "confirm-action-box";
        actdiv.style.backgroundColor = "#F5F5F5";
        actdiv.style.position = "fixed";
        actdiv.style.zIndex = "9999";
        actdiv.style.left = "28vw";
        actdiv.style.top = "28vh";
        actdiv.style.border = "solid 3px #696969";
        actdiv.style.borderRadius = "20px";
        actdiv.style.padding = "10px";
        actdiv.style.textAlign = "center";

        const cfmdiv = document.createElement("div")
        cfmdiv.id = "map-confirm-header"
        cfmdiv.style.fontSize = "12px"

        if (action == "sendSB"){
            cfmdiv.innerText = "Send ".concat(input_value," SUPER|Brie+ to ",name,"?")
        } else if (action == "sendInvite"){
            cfmdiv.innerText = "Send ".concat(input_value," invite to ",name,"?")
        } else if (action == "sendSBAndInvite"){
            cfmdiv.innerText = "Send ".concat(input_value," SUPER|Brie+ and ",input_value2," invite to ",name,"?")
        } else if (action == "reset"){
             cfmdiv.innerText = "Reset current map history?"
        }

        //Buttons -----------
        const doBtnDiv = document.createElement("div");

        const cfmBtn = document.createElement("button",{
            id: "cfm-button"
        })
        cfmBtn.style.cursor = "pointer"
        cfmBtn.innerText = "Confirm"
        cfmBtn.onclick = function(){
            document.body.removeChild(actdiv);
            resolve()
        }

        const noBtn = document.createElement("button",{
            id: "no-button"
        })
        noBtn.innerText = "Cancel"
        noBtn.style.marginLeft = "5px"
        noBtn.style.cursor = "pointer"
        noBtn.onclick = function(){
            document.body.removeChild(actdiv);
            reject(this)
        }
        doBtnDiv.appendChild(cfmBtn)
        doBtnDiv.appendChild(noBtn)
        actdiv.appendChild(cfmdiv)
        actdiv.appendChild(document.createElement("br"))
        actdiv.appendChild(doBtnDiv)
        document.body.appendChild(actdiv);
        dragElement(actdiv);
    })
}

function sendSB(snuid,quantity){
    postReq("https://www.mousehuntgame.com/managers/ajax/users/supplytransfer.php",
            `sn=Hitgrab&hg_is_ajax=1&receiver=${snuid}&uh=${user.unique_hash}&item=super_brie_cheese&item_quantity=${quantity}`
           ).then(res=>{
        try{
            var data = JSON.parse(res.responseText);
            if(data.success == "1"){
                alert("SB Successfully Sent!")
            } else {
                alert("Supply trasnfer Failed! User is probably not your friend.")
            }
        } catch(error){
            alert("Ajax Request Failed! Please contact Chromatical on Discord.");
            console.log(error)
        }
    })
}

function sendInvite(snuid,mapId){
        postReq("https://www.mousehuntgame.com/managers/ajax/users/treasuremap.php",
            `sn=Hitgrab&hg_is_ajax=1&action=send_invites&map_id=${mapId}&snuids%5B%5D=${snuid}&uh=${user.unique_hash}&last_read_journal_entry_id=${lastReadJournalEntryId}`
           ).then(res=>{
        try{
            var data = JSON.parse(res.responseText);
            if(data.success == "1"){
                alert("Sent Map Invite!")
            } else {
                alert("Invite failed:\nYou are not the maptain or\nInvite has been sent before or\nMap is full!")
            }
        } catch(error){
            alert("Ajax Request Failed! Please contact Chromatical on Discord.");
            console.log(error)
        }
    })
}

function expandMap(mapName){
    document
        .querySelectorAll("#track-expand-div")
        .forEach(el=> el.remove())

    const expandDiv = document.createElement("div");
    expandDiv.id = "track-expand-div";
    expandDiv.style.backgroundColor = "#F5F5F5";
    expandDiv.style.position = "fixed";
    expandDiv.style.zIndex = "9999";
    var left = document.getElementById("map-tool-box").style.left
    expandDiv.style.left = left;
    var top = document.getElementById("map-tool-box").style.top
    var top_value = top.match(/\d+/g)
    if (top.includes("px")){
        var this_value = Number(top_value) + 208
        var this_height = "".concat(this_value,"px")
        } else{
            this_value = Number(top_value) + 35
            this_height = "".concat(this_value,"vh")
        }
    expandDiv.style.top = this_height;
    expandDiv.style.border = "solid 3px #696969";
    expandDiv.style.borderRadius = "20px";
    expandDiv.style.padding = "10px";
    expandDiv.style.textAlign = "center";

    var table = document.createElement("table")
    table.id = "track-expand-table"
    table.style.textAlign = "center"
    table.style.borderSpacing = "17px 5px"
    var trackDate = document.createElement("th", {
        innerTex:"track-date"
    })
    trackDate.innerText = "Date"
    trackDate.style.fontWeight = "bold"
    trackDate.style.textAlign = "center"
    var trackName = document.createElement("th", {
        id:"track-name"
    })
    trackName.innerText = "Name"
    trackName.style.fontWeight = "bold"
    trackName.style.textAlign = "center"
    var trackSign = document.createElement("th", {
        id:"track-Sign"
    })
    trackSign.innerText = "+/-"
    trackSign.style.fontWeight = "bold"
    trackSign.style.textAlign = "center"
    var trackAmt = document.createElement("th", {
        id:"track-amt"
    })
    trackAmt.innerText = "SB"
    trackAmt.style.fontWeight = "bold"
    trackAmt.style.textAlign = "center"
    table.appendChild(trackDate)
    table.appendChild(trackName)
    table.appendChild(trackSign)
    table.appendChild(trackAmt)

    var currentMap = "Chro-".concat(mapName);
    var localMap = localStorage.getItem(currentMap);
    if (localMap){
         var parsedLocalMap = JSON.parse(localStorage.getItem(currentMap))
             for (var i=0;i<parsedLocalMap.length;i++){
                 //for (var j=0;j<4;j++){
                     var row = document.createElement("tr");
                     var date_data = document.createElement("td");
                     var name_data = document.createElement("td");
                     name_data.style.textAlign = "center"
                     var sign_data = document.createElement("td");
                     sign_data.style.textAlign = "center"
                     var amt_data = document.createElement("td");
                     amt_data.style.textAlign = "center"
                     var d = new Date(parsedLocalMap[i][0]);
                     var hunt_date = d.getDate() + '/' + (d.getMonth()+1) //+ '/' + d.getFullYear()
                     var hunt_time = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
                     date_data.textContent = hunt_date.concat("\n",hunt_time)
                     name_data.textContent = parsedLocalMap[i][1];
                     sign_data.textContent = parsedLocalMap[i][2];
                     amt_data.textContent = parsedLocalMap[i][3];

                     row.appendChild(date_data);
                     row.appendChild(name_data);
                     row.appendChild(sign_data);
                     row.appendChild(amt_data);
                     table.appendChild(row);
                 //}
             }
    }
    var dragDiv = document.createElement("div")
    dragDiv.id = "drag-div"
    dragDiv.appendChild(table);
    expandDiv.appendChild(dragDiv)
    document.body.appendChild(expandDiv);
    dragElement(expandDiv)
}

function changeSbTrack(map,name,sb,plusminus){
    var currentMap = "Chro-".concat(map);
    var localMap = localStorage.getItem(currentMap);
    if (localMap === null){
        var emptySet = [];
        localStorage.setItem(currentMap,JSON.stringify(emptySet));
        var parsedLocalMap = [];
    } else {
        parsedLocalMap = JSON.parse(localStorage.getItem(currentMap))
    }
    if (parsedLocalMap.length >0){
        var last = parsedLocalMap.length-1;
        var total = Number(parsedLocalMap[last][4]);
    } else {
        total = 0
    }
    if (plusminus == "-"){
        total-=Number(sb);
        var now = new Date();
        var sign = "-";
        var newLocalMap = [now,name,sign,Number(sb),total]
        parsedLocalMap.push(newLocalMap);
        localStorage.setItem(currentMap,JSON.stringify(parsedLocalMap));
        document.getElementById("map-tool-sb-track-div").innerText = "SB+ sent: ".concat(total);
    } else {
        total+=Number(sb);
        now = new Date();
        sign = "+";
        newLocalMap = [now,name,sign,Number(sb),total];
        parsedLocalMap.push(newLocalMap);
        localStorage.setItem(currentMap,JSON.stringify(parsedLocalMap));
        document.getElementById("map-tool-sb-track-div").innerText = "SB+ sent: ".concat(total);
    var expandedMap = document.getElementById("track-expand-div")
    }
    if (expandedMap){
        expandMap(map)
    }
}

function renderSbTrack(map){
    var currentMap = "Chro-".concat(map);
    if (localStorage.getItem(currentMap) && localStorage.getItem(currentMap) != '[]'){
        var parsedLocalMap = JSON.parse(localStorage.getItem(currentMap))
        var last = parsedLocalMap.length-1
        var total = Number(parsedLocalMap[last][4])
    } else {
        total = 0
    }
    document.getElementById("map-tool-sb-track-div").innerText = "SB+ sent: ".concat(total);
    var expandedMap = document.getElementById("track-expand-div")
    if (expandedMap){
        expandMap(map)
    }
}

function addTrackRow(map){
     document
        .querySelectorAll("#add-row-div")
        .forEach(el=> el.remove())

    const addRowDiv = document.createElement("div");
    addRowDiv.id = "add-row-div";
    addRowDiv.style.backgroundColor = "#F5F5F5";
    addRowDiv.style.position = "fixed";
    addRowDiv.style.zIndex = "9999";
    var top = document.getElementById("map-tool-box").style.top
    var top_value = top.match(/\d+/g)
    if (top.includes("px")){
        var this_value = Number(top_value) + 120
        var this_height = "".concat(this_value,"px")
        } else{
            this_value = Number(top_value) + 20
            this_height = "".concat(this_value,"vh")
        }
    addRowDiv.style.top = this_height;
    var left = document.getElementById("map-tool-box").style.left
    var left_value = left.match(/\d+/g)
    if (left.includes("px")){
        var this_left_value = Number(left_value) + 236
        var this_left = "".concat(this_left_value,"px")
        } else {
            this_left_value = Number(left_value) + 20
            this_left = "".concat(this_left_value,"vw")
        }
    addRowDiv.style.left = this_left;
    addRowDiv.style.border = "solid 3px #696969";
    addRowDiv.style.borderRadius = "20px";
    addRowDiv.style.padding = "10px";
    addRowDiv.style.textAlign = "center";

    const table = document.createElement("table")
    table.id = "add-row-table"
    table.style.borderSpacing = "1em 0"
    table.style.marginTop = "5px"

    const tableheader = document.createElement("header")
    tableheader.textContent = "Add Changes to Map History"
    tableheader.style.fontWeight = "bold"

    const name_row = document.createElement("tr")
    const name_data = document.createElement("td")
    name_data.innerText = "Name:"
    name_data.style.textAlign = "right"
    const name_input_data = document.createElement("td")
    const name_input = document.createElement("input")
    name_input.type = "text"
    name_input.id = "add-row-name-input"
    name_input.size = "10"
    name_input_data.appendChild(name_input)
    name_row.appendChild(name_data)
    name_row.appendChild(name_input_data)

    const sbadd_row = document.createElement("tr")
    const sbadd_data = document.createElement("td")
    sbadd_data.innerText = "SB+:"
    sbadd_data.style.textAlign = "right"
    const sbadd_input_data = document.createElement("td")
    const sbadd_input = document.createElement("input")
    sbadd_input.type = "text"
    sbadd_input.id = "add-row-sb-input"
    sbadd_input.size = "10"
    sbadd_input.placeholder = "e.g. +200/-150"
    sbadd_input_data.appendChild(sbadd_input)
    sbadd_row.appendChild(sbadd_data)
    sbadd_row.appendChild(sbadd_input_data)

    const cfmBtn = document.createElement("button",{
            id: "row-cfm-button"
        })
    cfmBtn.style.cursor = "pointer"
    cfmBtn.innerText = "Confirm"
    cfmBtn.style.marginTop = "8px"
    cfmBtn.onclick = function(){
        document.body.removeChild(addRowDiv);
        var name = name_input.value
        var pre_sb = sbadd_input.value
        var plusminus = pre_sb.match(/\D+/g)
        var sb = pre_sb.match(/\d+/g)
        changeSbTrack(map,name,sb,plusminus)
        renderSbTrack(map)
        }
    table.appendChild(name_row);
    table.appendChild(sbadd_row);
    addRowDiv.appendChild(tableheader)
    addRowDiv.appendChild(table)
    addRowDiv.appendChild(cfmBtn)
    document.body.appendChild(addRowDiv);
    dragElement(addRowDiv)
}

function replaceRare(string){
    return new Promise((resolve, reject) => {
        var replaced = string.replace(/Rare /g,'')
        resolve(replaced)
    })
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (elmnt.firstElementChild) {
    // if present, the header is where you move the DIV from:
   elmnt.firstElementChild.onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

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