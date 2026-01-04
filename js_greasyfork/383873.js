// ==UserScript==
// @name         WME Simple Lock
// @namespace    https://greasyfork.org/users/30701-justins83-waze
// @version      2023.03.28.01
// @description  Locking tool that pulls locking standards from an US locking standards sheet
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://www.waze.com/dashboard/editor
// @author       JustinS83
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @contributionURL https://github.com/WazeDev/Thank-The-Authors
// @downloadURL https://update.greasyfork.org/scripts/383873/WME%20Simple%20Lock.user.js
// @updateURL https://update.greasyfork.org/scripts/383873/WME%20Simple%20Lock.meta.js
// ==/UserScript==

/* global W */
/* global WazeWrap */
/* global $ */
/* global OpenLayers */
/* global _ */
/* global require */
/* eslint curly: ["warn", "multi-or-nest"] */

var UpdateObject, MultiAction;
var lockLevels;

function bootstrapSimpleLock(tries = 1){
    if (W && W.map &&
        W.model && W.loginManager &&
        W.loginManager.user && WazeWrap.Ready)
        initSimpleLock();

    else if (tries < 1000)
        setTimeout(function () {bootstrapSimpleLock(++tries);}, 200);
    else
        console.log('Simple Lock failed to load');
}

function WKT_to_LinearRing(wkt){
    let lines = wkt.split(',');
    let ringPts = [];

    for(var i = 0;i < lines.length;i++){
        let coords = lines[i].trim().match(/(-?\d*(?:\.\d*)?)\s(-?\d*(?:\.\d*))/);
        let pt = WazeWrap.Geometry.ConvertTo900913(coords[1], coords[2]);
        ringPts.push(new OpenLayers.Geometry.Point(pt.lon, pt.lat));
    }
    return new OpenLayers.Geometry.LinearRing(ringPts);
}

async function wrapGMXMLHTTP(url){
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                url,
                method: 'GET',
                onload(res) {
                    if (res.status < 400) {
                        resolve(res.responseText);
                    } else {
                        console.log("error");
                        console.log(res.status);
                        // handle errors here
                    }
                },
                onerror(res) {
                    // handle errors here
                    console.log("Error:");
                    console.log(res.text);
                }
            });
        });
    }

var standardsMap = {};
let apikey = "QUl6YVN5QXBPeUFXZVZVRk84RURQTEg0aGZWclJmNmhZWnpsb1N3"
async function LoadSheet(){
    let r = await wrapGMXMLHTTP(`https://sheets.googleapis.com/v4/spreadsheets/1DJEk390OYv5jWXEINl6PF3I1A8y1WrwrdPIsAL7SihI/values/Sheet1!A2:C?key=${atob(apikey)}`);
    let result = $.parseJSON(r);
    if(result){
    _.each(result.values, function(v, k){
        if(!standardsMap[v[1]])
            standardsMap[v[1]] = JSON.parse(v[0]);
        else{
            if(v.length > 2){
                if(!standardsMap[v[1]].Areas)
                    standardsMap[v[1]].Areas = {};

                standardsMap[v[1]].Areas[v[2]] = JSON.parse(v[0]);
                if(v[2].startsWith("POLYGON")) //if the area is a WKT, create a Polygon property with the linearring so we can easily intersect this polygon
                    standardsMap[v[1]].Areas[v[2]].Polygon = new OpenLayers.Geometry.Polygon(WKT_to_LinearRing(v[2]));
            }
        }
    });
    }
    else
        WazeWrap.Alerts.error(GM_info.script.name, 'Unable to read the <a href="https://docs.google.com/spreadsheets/d/1DJEk390OYv5jWXEINl6PF3I1A8y1WrwrdPIsAL7SihI/edit">locking standard sheet</a>.');
}

async function initSimpleLock(){
    console.log("Simple Lock loaded");
    var rankCheck = W.loginManager.user.rank;

    if(rankCheck >= 5){
        //Add icon to toolbar
        $('<div id="SimpleLockIconContainer">').insertBefore($('.waze-icon-trash').first());
        $('<div class="SimpleLockIcon">').appendTo($('#SimpleLockIconContainer'));
        $("#SimpleLockIconContainer").addClass('toolbar-button toolbar-button-with-icon');
        $('#edit-buttons')[0].style.width = ($('#edit-buttons')[0].offsetWidth+60)+'px';
        $('<i class="fa fa-lock fa-3x">').appendTo($('.SimpleLockIcon'));

        //Click event
        $('.SimpleLockIcon').click(MainLockSegments);

        await LoadSheet();

        UpdateObject= require("Waze/Action/UpdateObject");
        MultiAction = require("Waze/Action/MultiAction");
    }
}

function onScreen(obj) {
    if (obj.geometry)
        return(W.map.getExtent().intersectsBounds(obj.geometry.getBounds()));
    return(false);
}

function LockSegment(v, rLock, count){
    if(v.attributes.lockRank < rLock){
        W.model.actionManager.add(new UpdateObject(v,{lockRank:rLock}));
        return true;
    }
    return false;
}


function GetLockLevel(segObj){
    let currState = WazeWrap.Model.getStateNameFromSegmentObj(segObj);
    let cityName = WazeWrap.Model.getCityNameFromSegmentObj(segObj);

    let lockLookup = standardsMap[currState];
    let enumItem = lockLookup;
    let polygonsToCheck = [];
    if(lockLookup.Areas){
        _.each(lockLookup.Areas, function(v, k){
            if(!k.startsWith("POLYGON")){
                if(k == cityName)
                    enumItem = v;
            }
            else
                polygonsToCheck.push(v);
        });
    }
    for(let i=0; i < polygonsToCheck.length; i++){
        if(polygonsToCheck[i].Polygon.intersects(segObj.geometry)){
            enumItem = polygonsToCheck[i];
            break;
        }
    }

    let LockLevel = 0;
    switch(segObj.attributes.roadType){
        case 1: //street
            if(enumItem.LS1Way != "" && ((segObj.attributes.fwdDirection + segObj.attributes.revDirection) == 1) )
                LockLevel = enumItem.LS1Way;
            break;
        case 2: //primary
            LockLevel = enumItem.PS;
            if(enumItem.PS1Way != "" && ((segObj.attributes.fwdDirection + segObj.attributes.revDirection) == 1))
                LockLevel = enumItem.PS1Way;
            break;
        case 3: //freeway
            LockLevel = enumItem.Fwy;
            break;
        case 4: //ramp
            if(enumItem.Ramp != "HRCS")
                LockLevel = enumItem.Ramp;
            else
                LockLevel = findHighestConnected(segObj);
            break;
        case 6: //MH
            LockLevel = enumItem.MH;
            break;
        case 7: //mH
            LockLevel = enumItem.mH;
            break;
        case 8:
            LockLevel = enumItem.Offroad;
            break;
        case 10: //non-routable pedestrian path
            LockLevel = enumItem.NonRoutablePedestrian;
            break;
        case 14: //ferry
            LockLevel = enumItem.Ferry;
            break;
        case 17: //private road
            if(enumItem.Private1Way != "" && ((segObj.attributes.fwdDirection + segObj.attributes.revDirection) == 1))
                LockLevel = enumItem.Private1Way;
            else
                if(enumItem.Private != "")
                    LockLevel = enumItem.Private;
            break;
        case 18: //railroad
            LockLevel = enumItem.Railroad;
            break;
        case 19: //runway
            LockLevel = enumItem.Runway;
            break;
        case 20: //PLR
            if(enumItem.PLR1Way != "" && ((segObj.attributes.fwdDirection + segObj.attributes.revDirection) == 1))
                LockLevel = enumItem.PLR1Way;
            else
                if(enumItem.PLR != "")
                    LockLevel = enumItem.PLR;
            break;
    }

    let newLockLevel = LockLevel;
    if(segObj.attributes.fwdToll || segObj.attributes.revToll && enumItem.Toll != ""){
        if(enumItem.Toll.startsWith("+"))
            newLockLevel = Math.min(6, LockLevel + (parseInt(enumItem.Toll.replace("+",""))));
        else
           newLockLevel = Math.max(LockLevel, enumItem.Toll);
    }

    if(segObj.attributes.flag & 16 && enumItem.Unpaved != ""){ //unpaved
        if(enumItem.Unapved.startsWith("+"))
            newLockLevel = Math.max(newLockLevel, Math.min(6, LockLevel + (parseInt(enumItem.Unpaved.replace("+",""))))); //higher between what was set for toll and unpaved
        else
            newLockLevel = Math.max(newLockLevel, Math.max(LockLevel, enumItem.Unpaved)); //higher between toll and unpaved
    }

    return newLockLevel - 1;
}

var Forhighest, Revhighest;
var rampsChecked = [];
function findHighestConnected(segment){
    Forhighest = 0;
    Revhighest = 0;
    rampsChecked = [];
    return Math.max(checkForward(segment), checkReverse(segment));
}

function checkForward(segment){
    rampsChecked.push(segment.attributes.id);
    let toNode;
    toNode = segment.getToNode();
    let nodeSegs = [...toNode.attributes.segIDs];
    for(let i=0; i< nodeSegs.length; i++){
        if(nodeSegs[i] === segment.attributes.id)
            nodeSegs.splice(i, 1);
    }
    //Check if any connecting segments are not ramp - if any are not, check for the highest non-ramp segment
    let nonRampConnected = nodeSegs.some(function(segID){
        let seg = W.model.segments.getObjectById(segID);
        return seg.attributes.roadType != 4;
    });
    let rank = 0;
    if(!nonRampConnected){
        for(let i=0; i<nodeSegs.length; i++){
            if(!rampsChecked.some(function(id){return id === nodeSegs[i];})){
                let h = checkForward(W.model.segments.getObjectById(nodeSegs[i]));
                if(h > rank)
                    rank = h;
            }
        }
    }
    else{
        for(let i=0; i<nodeSegs.length; i++){
            let seg = W.model.segments.getObjectById(nodeSegs[i]);
            if(seg.attributes.roadType !=4)
                rank = Math.max(seg.attributes.lockRank, rank);
        }
    }
    return rank;
}

function checkReverse(segment){
    rampsChecked.push(segment.attributes.id);
    let fromNode;
    fromNode = segment.getFromNode();
    let nodeSegs = [...fromNode.attributes.segIDs];
    for(let i=0; i< nodeSegs.length; i++){
        if(nodeSegs[i] === segment.attributes.id)
            nodeSegs.splice(i, 1);
    }
    //Check if any connecting segments are not ramp - if any are not, check for the highest non-ramp segment
    let nonRampConnected = nodeSegs.some(function(segID){
        let seg = W.model.segments.getObjectById(segID);
        return seg.attributes.roadType != 4;
    });
    let rank = 0;
    if(!nonRampConnected){
        for(let i=0; i<nodeSegs.length; i++){
            if(!rampsChecked.some(function(id){return id === nodeSegs[i];})){
                let h = checkReverse(W.model.segments.getObjectById(nodeSegs[i]));
                if(h > rank)
                    rank = h;
            }
        }
    }
    else{
        for(let i=0; i<nodeSegs.length; i++){
            let seg = W.model.segments.getObjectById(nodeSegs[i]);
            if(seg.attributes.roadType !=4)
                rank = Math.max(seg.attributes.lockRank, rank);
        }
    }
    return rank;
}

function processSegment(seg, thisUser){
    let count = 0;
    let usrRank = thisUser.rank + 1;

    if(count<100 && onScreen(seg) && seg.isGeometryEditable()){
        let lockLevel = GetLockLevel(seg);
        if(lockLevel>(usrRank-1)) lockLevel=usrRank-1;
        if(lockLevel > seg.attributes.lockRank){
            if(LockSegment(seg, lockLevel))
                count++;
        }
    }
}

function MainLockSegments(){
    let thisUser = W.loginManager.user;

    if(thisUser === null)
        return;

    let ramps = [];
    _.each(W.model.segments.objects,function(v,k){
        if(v.attributes.roadType != 4)
            processSegment(v, thisUser);
        else
            ramps.push(v);
    });

    //process ramps after all other segments to ensure we detect the correct lock level
    _.each(ramps, function(v,k){
        processSegment(v, thisUser);
    });
}

bootstrapSimpleLock();