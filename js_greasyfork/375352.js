// ==UserScript==
// @name         WME FixingMap Plugin
// @description  Script that highlights some of the map problems with a color so they are easy to see and fix
// @include      /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @namespace    https://www.waze.com/ar/editor
// @version      2.1.7
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAH+SURBVGhD1Ze9TQQxEIX3rgKEhAgQIqICEqqADkhpgCIIiEkogBSoAiE6IEIcAQlQAQdv8Zx29/zzbM/6vJ+0ugku+N54vGvPLpudZVOA88WNqdLY2js1VZ+5+a0alzwoEiCn+z55MOoIjTU2XdQD5EoLjDxQC6AlDlh5kB1AUxzEyH+/36cF0JYWYuRBdIBaxAHkARVgLHGQIw+CARj5n+MLU/mZP16Z6p9ceeAMwHadle+y/fZiKp6huGANoNl1FzEhXPJg7ShRQh587h+ayo9PHvQClJIXQiFC8mAVoLS8YAsBcUYetAHYDctwcrDbe2JhxYXZ1+KO+pCFuh+SfXj9MJUdbOpYeVDkPsCQIg9UAjCjkjJOPp6ub9unmhWIAeLC5AJ05cGkAgzlgUqA0BsGMP/xYZMHk1gBlzxQ+w4Iw7cN2/nhURv4xAUqgJzb2QNYLKnyIDhCKZeOHCDOygPvCtjktVdBuh8j3cUZwNd5rRCQTxUXrAGYsckN8Xx2ZKo81vYAO/Mp91pBSx70ViBmw3ZPj+wrVlNcWAVIlWfInXMfbYCx5McUF6ICsPIlxIXZ8g9Te6lRHlCHuVrlAbUCoQCbEBeCK1CzPPAGqF0eUHvARg3ywBmA3bibxhpgCqMjRI9QTfJgLcBURkfoBZiaPLBeaFzUNj5N0zS/umsXLLJwKl8AAAAASUVORK5CYII=
// @match        https://www.waze.com/ar/editor/*
// @match        https://www.waze.com/ar/editor
// @match        https://www.waze.com/editor/*
// @match        https://www.waze.com/editor
// @grant        none
// @author       Sultan Alrefaei
// @copyright    2018 - 2019 Sultan Alrefaei <@sultan_alrefaei>
// @downloadURL https://update.greasyfork.org/scripts/375352/WME%20FixingMap%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/375352/WME%20FixingMap%20Plugin.meta.js
// ==/UserScript==

//Styles
var btn = "width: 50px;" 
            +"height: 30px;"
            +"border: none;"
            +"background-color: #9E9E9E;"
            +"color: white;";

var input = "padding: 5px;"
            +"padding-left: 10px;"
            +"border: 1px solid #ddd;"
            +"border-radius: 3px;"
            +"margin-top: 15px;"
            +"margin-bottom: 10px;"
            +"font-weight: bold;"
            +"font-size: 15px;"
            +"display: block;";

var friendItem = "display: block;"
                +"border-left: 5px solid #4CAF50;"
                +"padding-left: 5px;"
                +"text-decoration: none;"
                +"margin-bottom: 5px;"
                +"color: #03A9F4;"
                +"font-weight: bold;"
                +"display: block;";

//Set up version
var fm_version = GM_info.script.version || "2.1.7";

//Set up variables
var isStarted = false
var stateNode = false;
var stateRoad = false;
var stateLevel = false;
var stateCity = false;
var defaultLevel = 1;

//Set up objects
const nodes = W.model.nodes.objects || null;
const segments = W.model.segments.objects || null;
const streets = W.model.streets.objects || null;
const cameras = W.model.cameras.objects || null;
const users = W.model.users.objects || null;
const cities = W.model.cities.objects || null;

//Set up data default
var settings = {
    option: {
        stateNode: false,
        stateRoad: false,
        stateLevel: false,
        stateCity: false
    },
    level: {
        val: 1
    },
    cityName: {
        val: ""
    },
    friends: []
}

window.onload = e =>{
    if (isStarted) return false;
    run_fm();
}

setTimeout(e =>{
    if (isStarted) return false;
    run_fm();
}, 10000);

//Run app
const run_fm = e =>{
    isStarted = true;
    createTapUI();
    storageManager();
    window.W.map.events.register("move", null, e =>{
        setTimeout(manager, 500);
    });
}

//Restart UI
W.app.modeController.model.bind('change:mode', function(){
    if (W.app.modeController.getState() === undefined){
        setTimeout(e =>{
            createTapUI();
            managerButtons();
        }, 1000);
    }
});

//Restart UI
W.prefs.on('change:isImperial', function(){
    setTimeout(e =>{
        createTapUI();
        managerButtons();
    }, 1000);
});

//Check if browser supports storage object & activated
const storageManager = e =>{
    if (typeof(Storage) !== "undefined") {
        if (JSON.parse(localStorage.getItem("settings-fm") == null)) {
            localStorage.setItem("settings-fm", JSON.stringify(settings));
        };
        checkOption();
    }
}

//Set up data storage
const checkOption = e =>{
    var objectsSettings = JSON.parse(localStorage.getItem("settings-fm"));

    if (objectsSettings.option.stateNode){
        stateNode = true;
        settings.option.stateNode = objectsSettings.option.stateNode;
        getElement("#btnNodeOn").style.backgroundColor = "#4caf50";
        getElement("#btnNodeOff").style.backgroundColor = "#9E9E9E";
        manager();
    }
    if (objectsSettings.option.stateRoad){
        stateRoad = true;
        settings.option.stateRoad = objectsSettings.option.stateRoad;
        getElement("#btnRoadOn").style.backgroundColor = "#4caf50";
        getElement("#btnRoadOff").style.backgroundColor = "#9E9E9E";
        manager();
    }
    if (objectsSettings.option.stateLevel){
        stateLevel = true;
        settings.option.stateLevel = objectsSettings.option.stateLevel;
        getElement("#btnLevelOn").style.backgroundColor = "#4caf50";
        getElement("#btnLevelOff").style.backgroundColor = "#9E9E9E";
        manager();
    }
    if (objectsSettings.option.stateCity){
        stateCity = true;
        settings.option.stateCity = objectsSettings.option.stateCity;
        getElement("#btnCityOn").style.backgroundColor = "#4caf50";
        getElement("#btnCityOff").style.backgroundColor = "#9E9E9E";
        manager();
    }
    settings.level.val = objectsSettings.level.val || 1;
    settings.cityName.val = objectsSettings.cityName.val || "";
}

const manager = e =>{
    if (W.map.zoom >= 3){
        if (stateNode){
            checkNIC();
        }
    }
    if (W.map.zoom >= 5){
        if (stateRoad){
            checkIRS();
        }
        if (stateLevel){
            checkLevel();
        }
        if (stateCity){
            findCityByName();
        }
    }else{
        defaultROR();
    }
}

const checkIRS = e =>{
    if (segments == null) return false;
    var segs = [];
    for (seg in segments){
        if (getElement("#" + segments[seg].attributes.geometry.id) != null){
            segs.push(segments[seg]);
        }
    }
    setTimeout(checkIROR(segs), 10);
}

const defaultROR = e =>{
    if (segments == null) return false;
    for (seg in segments){
        if (getElement("#" + segments[seg].attributes.geometry.id) != null){
            getElement("#" + segments[seg].attributes.geometry.id).setAttribute("stroke", "");
            getElement("#" + segments[seg].attributes.geometry.id).setAttribute("stroke-opacity", 0);
        }
    }
}


const checkIROR = segs =>{
    for (var s1 = 0; s1 < segs.length; s1++){
        for (var s2 = 0; s2 < segs.length; s2++){
            if (segs[s1].attributes.id != segs[s2].attributes.id && segs[s1].attributes.fromNodeID == segs[s2].attributes.fromNodeID && 
                segs[s1].attributes.toNodeID == segs[s2].attributes.toNodeID){
                if (getElement("#" + segs[s1].attributes.geometry.id) != null){
                    getElement("#" + segs[s1].attributes.geometry.id).setAttribute("stroke", "red");
                    getElement("#" + segs[s1].attributes.geometry.id).setAttribute("stroke-opacity", 1);
                }
                if (getElement("#" + segs[s2].attributes.geometry.id) != null){
                    getElement("#" + segs[s2].attributes.geometry.id).setAttribute("stroke", "red");
                    getElement("#" + segs[s2].attributes.geometry.id).setAttribute("stroke-opacity", 1);
                }
            }
            /*if (segs[s1].attributes.id != segs[s2].attributes.id && segs[s1].getCenter().x.toString().substr(0, 6) == segs[s2].getCenter().x.toString().substr(0, 6) &&
                segs[s1].getCenter().y.toString().substr(0, 6) == segs[s2].getCenter().y.toString().substr(0, 6)){
                if (getElement("#" + segs[s1].attributes.geometry.id) != null){
                    getElement("#" + segs[s1].attributes.geometry.id).setAttribute("stroke", "red");
                    getElement("#" + segs[s1].attributes.geometry.id).setAttribute("stroke-opacity", 1);
                }
                if (getElement("#" + segs[s2].attributes.geometry.id) != null){
                    getElement("#" + segs[s2].attributes.geometry.id).setAttribute("stroke", "red");
                    getElement("#" + segs[s2].attributes.geometry.id).setAttribute("stroke-opacity", 1);
                }
            }*/
        }
    }
}

const checkNIC = e =>{
    if (nodes == null) return false;
    for (node in nodes){
        if (nodes[node].attributes.segIDs.length == 1){
            if (getElement("#" + nodes[node].attributes.geometry.id) != null){
                getElement("#" + nodes[node].attributes.geometry.id).setAttribute("fill", "#525252");
                getElement("#" + nodes[node].attributes.geometry.id).setAttribute("fill-opacity", 1);

                getElement("#" + nodes[node].attributes.geometry.id).setAttribute("stroke", "red");
                getElement("#" + nodes[node].attributes.geometry.id).setAttribute("stroke-opacity", 1);
            }
        }
    }
}

const defaultNode = e =>{
    if (nodes == null) return false;
    for (node in nodes){
        if (getElement("#" + nodes[node].attributes.geometry.id) != null){
            getElement("#" + nodes[node].attributes.geometry.id).setAttribute("fill", "");
            getElement("#" + nodes[node].attributes.geometry.id).setAttribute("fill-opacity", 0);

            getElement("#" + nodes[node].attributes.geometry.id).setAttribute("stroke", "");
            getElement("#" + nodes[node].attributes.geometry.id).setAttribute("stroke-opacity", 0);
        }
    }
}

const checkLevel = e =>{
    if (segments == null) return false;
    var level = getElement("#input-level") || 1;
    for ( lvl in segments){
        if (getElement("#" + segments[lvl].attributes.geometry.id) != null){
            var useridCreated = segments[lvl].attributes.createdBy;
            var useridUpdated = segments[lvl].attributes.updatedBy;

            userUpdated(useridUpdated, level);
        }
    }
}

const userCreated = (useridCreated, level) =>{
    if (users == null) return false;
    if (segments == null) return false;
    var usersArray = [];
    if (users[useridCreated].normalizedLevel == parseInt(level.value) && checkDateSig(segments[lvl].attributes.id)){
        
        document.getElementById("users-content").style.display = "block";

        if (usersArray.length == 0){
            usersArray.push(users[useridCreated].userName);
            getElement("#users-content").innerText = usersArray;
        }else{
            for (var i = 0; i < users.length; i++){
                if (usersArray[i] == users[useridCreated].userName){
                    continue;
                }else{
                    usersArray.push(users[useridCreated].userName);
                    getElement("#users-content").innerText = usersArray;
                }
            }
        }
        getElement("#" + segments[lvl].attributes.geometry.id).setAttribute("stroke", "green");
        getElement("#" + segments[lvl].attributes.geometry.id).setAttribute("stroke-opacity", 1);
    }else{
        getElement("#users-content").style.display = "none";
    }
}

const userUpdated = (useridUpdated, level) =>{
    if (users == null) return false;
    if (segments == null) return false;
    var usersArray = [];
    if (users[useridUpdated].normalizedLevel == parseInt(level.value) && checkDateSig(segments[lvl].attributes.id)){

        getElement("#users-content").style.display = "block";

        if (usersArray.length == 0){
            usersArray.push(users[useridUpdated].userName);
            getElement("#users-content").innerText = usersArray;
        }else{
            for (var i = 0; i < users.length; i++){
                if (usersArray[i] == users[useridUpdated].userName){
                    continue;
                }else{
                    usersArray.push(users[useridUpdated].userName);
                    getElement("#users-content").innerText = usersArray;
                }
            }
        }
        getElement("#" + segments[lvl].attributes.geometry.id).setAttribute("stroke", "green");
        getElement("#" + segments[lvl].attributes.geometry.id).setAttribute("stroke-opacity", 1);
        getElement("#" + segments[lvl].attributes.geometry.id).setAttribute("stroke-width", 3);
    }else{
        getElement("#users-content").style.display = "none";
    }
}

const camerasOBJ = e =>{
    if (cameras == null) return false;
    for (cam in cameras){
        if (cameras[cam].attributes.geometry.id != null){
            if (cameras[cam].attributes.speed == 100)
            getElement("#" + cameras[cam].attributes.geometry.id).setAttribute("xlink:href", "https://www.dropbox.com/s/oiydd8av9111xwq/download_cr.png?dl=1");
        }
    }
}

const createTapUI = e =>{
    const taps = getElement(".nav nav-tabs")[0];

    const tap = document.createElement("li");
    tap.innerHTML = '<a data-toggle="tab" href="#sidepanel-fm">WME {FM}</a>';
    taps.insertBefore(tap, taps.children[3].nextSibling);


    /*const tapFriends = document.createElement("li");
    tapFriends.innerHTML = '<a data-toggle="tab" href="#sidepanel-fm-friends">Friends</a>';
    taps.insertBefore(tapFriends, taps.children[4].nextSibling);*/
    
    createWindowUI();
}

const createWindowUI = e =>{

    if (location.href.includes("/ar/")){
        customStyle();
    }

    const wins = getElement(".tab-content")[0];

    const win = document.createElement("div");
    win.setAttribute("class", "tab-pane");
    win.setAttribute("id", "sidepanel-fm");
    win.setAttribute("style", "text-align: left;");

    const title = document.createElement("h2");
    title.setAttribute("style", "margin-bottom: 15px; border-bottom: 1px solid;");
    title.innerHTML = "WME FixingMap Plugin <sup style='font-size: 15px; padding: 1.5px; background-color: #FFEB3B;'>{FM}</sup>";
    win.appendChild(title);

    wins.insertBefore(win, wins.children[0]);

    createHintUI();

    NodeController();

    RoadController();

    LevelController();

    CityController();

    //addFriends();

    const footer = document.createElement("div");
    footer.setAttribute("style", "margin-top: 20px; border-top: 1px solid; padding: 10px; text-align: center; color: #888888;");
    footer.innerHTML = "&copy;2018-2019 <a href='https://www.waze.com/ar/user/editor/sultan_alrefaei'>Sultan Alrefaei</a><br>Saudi Arabia<br>Version: " + fm_version;
    win.appendChild(footer);


    //---

    const friendsWindow = document.createElement("div");
    friendsWindow.setAttribute("class", "tab-pane");
    friendsWindow.setAttribute("id", "sidepanel-fm-friends");
    friendsWindow.setAttribute("style", "text-align: left;");

    wins.insertBefore(friendsWindow, wins.children[0]);

    var objectsSettings = JSON.parse(localStorage.getItem("settings-fm"));

    /*var friend = document.createElement("a");
    friend.setAttribute("style", friendItem);
    friend.setAttribute("href", "https://www.waze.com/user/editor/" + objectsSettings.friends[0].username);
    friend.innerText = objectsSettings.friends[0].username + "(" + objectsSettings.friends[0].level + ")";
    
    friendsWindow.appendChild(friend);*/
}

const createHintUI = e =>{
    const hint = document.createElement("div");
    hint.setAttribute("id", "hintUI");
    hint.setAttribute("style", "display: none; position: absolute; z-index: 1000000; background-color: #3d3d3d; width: 200px; color: #fff; border-radius: 3px; padding: 5px; left: 330px; top: 230px;");
    hint.addEventListener("click", e =>{
        e.target.remove();
    });
    document.body.appendChild(hint);
}

const NodeController = e =>{
    //Title
    const title = document.createElement("h3");
    title.setAttribute("style", "margin-top: 10px; margin-bottom: 5px;");
    
    if (location.href.includes("/ar/")){
        title.innerHTML = app_lang("Option-1", "ar").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-1", "ar").hint + "</span>";
    }else{
        title.innerHTML = app_lang("Option-1", "en").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-1", "en").hint + "</span>";
    }

    title.children[0].addEventListener("mouseenter", e =>{
        var x = e.target.offsetLeft + e.target.offsetWidth + 20;
        var y = e.target.offsetTop - (e.target.offsetHeight / 2);

        if (location.href.includes("/ar/")){
            getElement("#hintUI").innerText = app_lang("hint", "ar")["#1"].value;
        }else{
            getElement("#hintUI").innerText = app_lang("hint", "en")["#1"].value;
        }

        /*getElement("#hintUI").style.left = x + "px";
        getElement("#hintUI").style.top = y + "px";*/

        getElement("#hintUI").style.display = "block";
    });
    title.addEventListener("mouseleave", e =>{
        getElement("#hintUI").style.display = "none";
    });
    getElement("#sidepanel-fm").appendChild(title);

    //Button Off
    const btnOff = document.createElement("button");
    btnOff.setAttribute("style", btn);
    btnOff.setAttribute("id", "btnNodeOff");
    btnOff.style.backgroundColor = "#e91e63";
    btnOff.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#e91e63";
        getElement("#btnNodeOn").style.backgroundColor = "#9E9E9E";
        stateNode = false;
        settings.option.stateNode = false;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        defaultNode();
    });

    if (location.href.includes("/ar/")){
        btnOff.innerHTML = app_lang("buttons", "ar")["off"];
    }else{
        btnOff.innerHTML = app_lang("buttons", "en")["off"];
    }

    getElement("#sidepanel-fm").appendChild(btnOff);

    //Button On
    const btnOn = document.createElement("button");
    btnOn.setAttribute("style", btn);
    btnOn.setAttribute("id", "btnNodeOn");
    btnOn.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#4caf50";
        getElement("#btnNodeOff").style.backgroundColor = "#9E9E9E";
        stateNode = true;
        settings.option.stateNode = true;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        checkNIC();
    });
    
    if (location.href.includes("/ar/")){
        btnOn.innerHTML = app_lang("buttons", "ar")["on"];
    }else{
        btnOn.innerHTML = app_lang("buttons", "en")["on"];
    }
    
    getElement("#sidepanel-fm").appendChild(btnOn);
}

const RoadController = e =>{
    //Title
    const title = document.createElement("h3");
    title.setAttribute("style", "margin-top: 10px; margin-bottom: 5px;");
    
    if (location.href.includes("/ar/")){
        title.innerHTML = app_lang("Option-2", "ar").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-2", "ar").hint + "</span>";
    }else{
        title.innerHTML = app_lang("Option-2", "en").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-2", "en").hint + "</span>";
    }

    title.children[0].addEventListener("mouseenter", e =>{
        var x = e.target.offsetLeft + e.target.offsetWidth + 20;
        var y = e.target.offsetTop - (e.target.offsetHeight / 2);

        if (location.href.includes("/ar/")){
            getElement("#hintUI").innerText = app_lang("hint", "ar")["#2"].value;
        }else{
            getElement("#hintUI").innerText = app_lang("hint", "en")["#2"].value;
        }

        /*getElement("#hintUI").style.left = x + "px";
        getElement("#hintUI").style.top = y + "px";*/

        getElement("#hintUI").style.display = "block";
    });
    title.addEventListener("mouseleave", e =>{
        getElement("#hintUI").style.display = "none";
    });
    getElement("#sidepanel-fm").appendChild(title);

    //Button Off
    const btnOff = document.createElement("button");
    btnOff.setAttribute("style", btn);
    btnOff.setAttribute("id", "btnRoadOff");
    btnOff.style.backgroundColor = "#e91e63";
    btnOff.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#e91e63";
        getElement("#btnRoadOn").style.backgroundColor = "#9E9E9E";
        stateRoad = false;
        settings.option.stateRoad = false;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        defaultROR();
    });
    
    if (location.href.includes("/ar/")){
        btnOff.innerHTML = app_lang("buttons", "ar")["off"];
    }else{
        btnOff.innerHTML = app_lang("buttons", "en")["off"];
    }


    getElement("#sidepanel-fm").appendChild(btnOff);

    //Button On
    const btnOn = document.createElement("button");
    btnOn.setAttribute("style", btn);
    btnOn.setAttribute("id", "btnRoadOn");
    btnOn.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#4caf50";
        getElement("#btnRoadOff").style.backgroundColor = "#9E9E9E";
        stateRoad = true;
        settings.option.stateRoad = true;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        checkIRS();
    });
    
    if (location.href.includes("/ar/")){
        btnOn.innerHTML = app_lang("buttons", "ar")["on"];
    }else{
        btnOn.innerHTML = app_lang("buttons", "en")["on"];
    }


    getElement("#sidepanel-fm").appendChild(btnOn);
}


const LevelController = e =>{
    //Title
    const title = document.createElement("h3");
    title.setAttribute("style", "margin-top: 10px; margin-bottom: 5px;");

    if (location.href.includes("/ar/")){
        title.innerHTML = app_lang("Option-3", "ar").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-3", "ar").hint + "</span>";
    }else{
        title.innerHTML = app_lang("Option-3", "en").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-3", "en").hint + "</span>";
    }

    title.children[0].addEventListener("mouseenter", e =>{
        var x = e.target.offsetLeft + e.target.offsetWidth + 20;
        var y = e.target.offsetTop - (e.target.offsetHeight / 2);

        if (location.href.includes("/ar/")){
            getElement("#hintUI").innerText = app_lang("hint", "ar")["#3"].value;
        }else{
            getElement("#hintUI").innerText = app_lang("hint", "en")["#3"].value;
        }

        /*getElement("#hintUI").style.left = x + "px";
        getElement("#hintUI").style.top = y + "px";*/

        getElement("#hintUI").style.display = "block";
    });
    title.addEventListener("mouseleave", e =>{
        getElement("#hintUI").style.display = "none";
    });
    getElement("#sidepanel-fm").appendChild(title);

    var objectsSettings = JSON.parse(localStorage.getItem("settings-fm"));


    if (objectsSettings != null){
        settings.level.val = objectsSettings.level.val || 1;
    }else{
        settings.level.val = 1;
    }
    

    //Input for level
    const inputLevel = document.createElement("input");
    inputLevel.setAttribute("type", "number");
    inputLevel.setAttribute("id", "input-level");
    inputLevel.setAttribute("placeholder", "Enter the level");
    inputLevel.setAttribute("value", settings.level.val);
    inputLevel.setAttribute("min", "1");
    inputLevel.setAttribute("max", "7");
    inputLevel.setAttribute("style", input);
    getElement("#sidepanel-fm").appendChild(inputLevel);

    //Button Off
    const btnOff = document.createElement("button");
    btnOff.setAttribute("style", btn);
    btnOff.setAttribute("id", "btnLevelOff");
    btnOff.style.backgroundColor = "#e91e63";
    btnOff.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#e91e63";
        getElement("#btnLevelOn").style.backgroundColor = "#9E9E9E";
        getElement("#users-content").style.display = "none"; 
        stateLevel = false;
        settings.option.stateLevel = false;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        defaultROR();
    });
    
    if (location.href.includes("/ar/")){
        btnOff.innerHTML = app_lang("buttons", "ar")["off"];
    }else{
        btnOff.innerHTML = app_lang("buttons", "en")["off"];
    }


    getElement("#sidepanel-fm").appendChild(btnOff);

    //Button On
    const btnOn = document.createElement("button");
    btnOn.setAttribute("style", btn);
    btnOn.setAttribute("id", "btnLevelOn");
    btnOn.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#4caf50";
        getElement("#btnLevelOff").style.backgroundColor = "#9E9E9E";
        stateLevel = true;
        settings.option.stateLevel = true;
        settings.level.val = parseInt(getElement("#input-level").value);
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        checkLevel();
    });
    
    if (location.href.includes("/ar/")){
        btnOn.innerHTML = app_lang("buttons", "ar")["on"];
    }else{
        btnOn.innerHTML = app_lang("buttons", "en")["on"];
    }


    getElement("#sidepanel-fm").appendChild(btnOn);

    //Users content
    const content = document.createElement("div");
    content.setAttribute("id", "users-content");
    content.setAttribute("style", "display: none; height: 30px; background-color: #0000004d; border-top: 1px solid #fff; border-left: 10px solid #03A9F4; padding-left: 5px; color: #fff; line-height: 2;");
    getElement("#topbar-container").appendChild(content);

}

const CityController = e =>{
    //Title
    const title = document.createElement("h3");
    title.setAttribute("style", "margin-top: 10px; margin-bottom: 5px;");

    if (location.href.includes("/ar/")){
        title.innerHTML = app_lang("Option-4", "ar").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-4", "ar").hint + "</span>";
    }else{
        title.innerHTML = app_lang("Option-4", "en").value + " <span style='padding: 1.5px; background-color: #FFEB3B; cursor: help;'>" + app_lang("Option-4", "en").hint + "</span>";
    }

    title.children[0].addEventListener("mouseenter", e =>{
        var x = e.target.offsetLeft + e.target.offsetWidth + 20;
        var y = e.target.offsetTop - (e.target.offsetHeight / 2);

        if (location.href.includes("/ar/")){
            getElement("#hintUI").innerText = app_lang("hint", "ar")["#4"].value;
        }else{
            getElement("#hintUI").innerText = app_lang("hint", "en")["#4"].value;
        }

        /*getElement("#hintUI").style.left = x + "px";
        getElement("#hintUI").style.top = y + "px";*/

        getElement("#hintUI").style.display = "block";
    });
    title.addEventListener("mouseleave", e =>{
        getElement("#hintUI").style.display = "none";
    });
    getElement("#sidepanel-fm").appendChild(title);

    var objectsSettings = JSON.parse(localStorage.getItem("settings-fm"));


    if (objectsSettings != null){
        if (objectsSettings.cityName != undefined){
            settings.cityName.val = objectsSettings.cityName.val || "";
        }else{
            settings.cityName.val = "";
        }
    }else{
        settings.level.val = "";
    }
    


    //Input for City name
    const inputCity = document.createElement("input");
    inputCity.setAttribute("type", "text");
    inputCity.setAttribute("id", "cityName");

    if(location.href.includes("/ar/")){
        inputCity.setAttribute("placeholder", app_lang("inputs", "ar").city.placeholder);
    }else{
        inputCity.setAttribute("placeholder", app_lang("inputs", "en").city.placeholder);
    }
    
    inputCity.setAttribute("value", settings.cityName.val);
    inputCity.setAttribute("style", input);
    getElement("#sidepanel-fm").appendChild(inputCity);

    //Button Off
    const btnOff = document.createElement("button");
    btnOff.setAttribute("style", btn);
    btnOff.setAttribute("id", "btnCityOff");
    btnOff.style.backgroundColor = "#e91e63";
    btnOff.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#e91e63";
        getElement("#btnCityOn").style.backgroundColor = "#9E9E9E";
        stateCity = false;
        settings.option.stateCity = false;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        defaultROR();
    });
    
    if (location.href.includes("/ar/")){
        btnOff.innerHTML = app_lang("buttons", "ar")["off"];
    }else{
        btnOff.innerHTML = app_lang("buttons", "en")["off"];
    }


    getElement("#sidepanel-fm").appendChild(btnOff);

    //Button On
    const btnOn = document.createElement("button");
    btnOn.setAttribute("style", btn);
    btnOn.setAttribute("id", "btnCityOn");
    btnOn.addEventListener("click", e =>{
        e.target.style.backgroundColor = "#4caf50";
        getElement("#btnCityOff").style.backgroundColor = "#9E9E9E";
        stateCity = true;
        settings.option.stateCity = true;
        settings.cityName.val = getElement("#cityName").value;
        localStorage.setItem("settings-fm", JSON.stringify(settings));
        findCityByName();
    });
    
    if (location.href.includes("/ar/")){
        btnOn.innerHTML = app_lang("buttons", "ar")["on"];
    }else{
        btnOn.innerHTML = app_lang("buttons", "en")["on"];
    }


    getElement("#sidepanel-fm").appendChild(btnOn);
}

const findCityByName = e =>{
    cityName = getElement("#cityName").value;
    for (city in cities){
        if (cities[city].attributes.name == cityName){
            findStreetByCityID(cities[city].attributes.id);
        }
    }
}

const findStreetByCityID = cityID =>{
    for (street in streets){
        if (streets[street].cityID == cityID){
            findSegmentByStreetID(streets[street].id);
        }
    }
}

const findSegmentByStreetID = streetID =>{
    for (segment in segments){
        if (segments[segment].attributes.primaryStreetID == streetID){
            if (getElement("#" + segments[segment].attributes.geometry.id) != null){
                getElement("#" + segments[segment].attributes.geometry.id).setAttribute("stroke", "#03a9f4");
                getElement("#" + segments[segment].attributes.geometry.id).setAttribute("stroke-opacity", 1);
            }
        }
    }
}

const checkDateSig = id =>{
    if (segments == null) return false;
    var timestampCreated = segments[id].attributes.createdOn;
    var timestampUpdated = segments[id].attributes.updatedOn;

    var createdOn = new Date(timestampCreated);
    var fullDateCreated = createdOn.getMonth() + "/" + createdOn.getFullYear();

    var updatedOn = new Date(timestampUpdated);
    var fullDateUpdated = updatedOn.getMonth() + "/" + updatedOn.getFullYear();

    var dateNow = new Date();
    var fullDateNow = dateNow.getMonth() + "/" + dateNow.getFullYear();

    var isSameYearCreated = fullDateNow == fullDateCreated ? true : false;
    var isSameYearUpdated = fullDateNow == fullDateUpdated ? true : false;

    var daysLimit = dateNow.getDay() - updatedOn.getDay();

    if (isSameYearUpdated){
        return daysLimit <= 7 ? true : false;
    }else{
        return false;
    }
};

const getElement = element =>{
    if (element.charAt(0) == "#"){
        element = element.replace("#", "");
        return document.getElementById(element) != null ? document.getElementById(element) : null;
    }else if (element.charAt(0) == "."){
        element = element.replace(".", "");
        return document.getElementsByClassName(element) != null ? document.getElementsByClassName(element) : null;
    }else{
        return null;
    }
}

const app_lang = (text, lang) =>{
    var langs = {
        "ar": {
            "Option-1": {
                "value": "الطرق الغير متصلة",
                "hint": "مساعدة"
            },
            "Option-2": {
                "value": "طريق فوق طريق",
                "hint": "مساعدة"
            },
            "Option-3": {
                "value": "التحقق من نشاط المستخدمين",
                "hint": "مساعدة"
            },
            "Option-4": {
                "value": "طرق باسم المدينة",
                "hint": "مساعدة"
            },
            "buttons": {
                "on": "تشغيل",
                "off": "إيقاف"
            },
            "inputs": {
                "city": {
                    "placeholder": "اسم المدينة" 
                }
            },
            "hint": {
                "#1": {
                    "value": "يظهر الوصلات الغير متصلة بشكل صحيح"
                },
                "#2": {
                    "value": "يظهر الطرق التي تبدأ وتنتهي بنفس النقطة، أي الطرق المرسومة فوق بعضها"
                },
                "#3": {
                    "value": "يظهر المستخدمين الذين يقومون بالتعديل خلال الأسبوع الحالي حسب المستوى الذي تم تحديده"
                },
                "#4": {
                    "value": "يظهر الطرق حسب اسم المدينة التي تم تحديدها"
                }
            }
        },
        "en": {
            "Option-1": {
                "value": "Check If",
                "hint": "C.N"
            },
            "Option-2": {
                "value": "Check If",
                "hint": "R.O.R"
            },
            "Option-3": {
                "value": "Check User",
                "hint": "I.T"
            },
            "Option-4": {
                "value": "City Name",
                "hint": "C.N.F"
            },
            "buttons": {
                "on": "On",
                "off": "Off"
            },
            "inputs": {
                "city": {
                    "placeholder": "City Name" 
                }
            },
            "hint": {
                "#1": {
                    "value": "Highlights segment end nodes that are not connected to other segments"
                },
                "#2": {
                    "value": "Highlights segments that have hidden segments beneath them"
                },
                "#3": {
                    "value": "Highlits segments that have been updated by the selected editor level during the current week"
                },
                "#4": {
                    "value": "Find City"
                }
            }
        },
        "state": {
            "mode": true,
            "message": "Successfully completed"
        }
    }

    return langs[lang][text];
}

const addFriends = e =>{
    if (users == null) return false;
    var usersList = document.getElementsByClassName("user-list");
    for (var i = 0; i < usersList.length; i++){
        var btnAdd = document.createElement("button");
        btnAdd.setAttribute("id", "btnAdd");
        btnAdd.setAttribute("value", "Add");
        btnAdd.setAttribute("username", usersList[i].children[2].innerText);
        btnAdd.addEventListener("click", e =>{
            settings.friends.push({username: e.target.getAttribute("username"), id: usersList[0].getAttribute("data-id"), level: users[usersList[0].getAttribute("data-id")].normalizedLevel});
            localStorage.setItem("settings-fm", JSON.stringify(settings));
        });
        usersList[i].children[2].appendChild(btnAdd);
    }
}

const managerButtons = e =>{
    if (stateNode){
        getElement("#btnNodeOff").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnNodeOn").style.backgroundColor = "#4caf50"; // green
    }else{
        getElement("#btnNodeOn").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnNodeOff").style.backgroundColor = "#e91e63"; // red
    }
    if (stateRoad){
        getElement("#btnRoadOff").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnRoadOn").style.backgroundColor = "#4caf50"; // green
    }else{
        getElement("#btnRoadOn").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnRoadOff").style.backgroundColor = "#e91e63"; // red
    }
    if (stateLevel){
        getElement("#btnLevelOff").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnLevelOn").style.backgroundColor = "#4caf50"; // green
    }else{
        getElement("#btnLevelOn").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnLevelOff").style.backgroundColor = "#e91e63"; // red
    }
    if (stateCity){
        getElement("#btnCityOff").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnCityOn").style.backgroundColor = "#4caf50"; // green
    }else{
        getElement("#btnCityOn").style.backgroundColor = "#9E9E9E"; // gray
        getElement("#btnCityOff").style.backgroundColor = "#e91e63"; // red
    }
}



const customStyle = e =>{
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(function () {/*
        h3{
            text-align: right;
        }
    */}.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1]));
    
    document.getElementsByTagName("head")[0].appendChild(style);
}