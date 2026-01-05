// ==UserScript==
// @name             WME Reverse Nodes
// @name:fr          WME Reverse Nodes
// @description      Serves to reverse the nodes A and B of a segment, in order to better manage restrictions on multiples segments.
// @description:fr   Sert à inverser les nodes A et B d'un segment, dans le but de mieux gerer les restrictions sur segments multiples.
// @match            https://beta.waze.com/*editor*
// @match            https://www.waze.com/*editor*
// @exclude          https://www.waze.com/*user/*editor/*
// @namespace        WME_Reverse_Nodes
// @version          2.09
// @grant            unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/15474/WME%20Reverse%20Nodes.user.js
// @updateURL https://update.greasyfork.org/scripts/15474/WME%20Reverse%20Nodes.meta.js
// ==/UserScript==

/* global $ */
/* global require */
/* global W */

var WRNAB_version = "2.09";
var debug = true;
var wazeOBJ = {};
var w;
var newversion = 0;

/* bootstrap */
function WRNAB_bootstrap(){
    if (typeof(unsafeWindow) === "undefined"){
        unsafeWindow = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    /* begin running the code! */
    log("Start");
    if (W.version.substr(0,6) > 'v2.179') { newversion = 1 }
    setTimeout(initializeWazeObjects, 1000);
}

//==========  Helper ==============================//

function getElementsByClassName(classname, node) {
    if(!node) node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i=0,j=els.length; i<j; i++){
        if (re.test(els[i].className)) a.push(els[i]);
    }
    return a;
}

function getId(node) {
    return document.getElementById(node);
}

function log(msg, obj){
    if (obj==null){
        console.log("WME Reverse Nodes AB v" + WRNAB_version + " - " + msg);
    }
    else if(debug){
        console.debug("WME Reverse Nodes AB v" + WRNAB_version + " - " + msg + " " ,obj);
    }
}

function cloneObj(obj){
    var copy = JSON.parse(JSON.stringify(obj));
    return copy;
}

function clone(rest){
    return[].concat(this)
}

function withReverseDirection(rest){
    if(this.isBidi())return this;
    var e=this.isForward()?w.REV:w.FWD;
    return this.with({direction:e})
}

function getByID(obj, id){
    if (typeof(obj.getObjectById) == "function"){
        return obj.getObjectById(id);
    }else if (typeof(obj.getObjectById) == "undefined"){
        return obj.get(id);
    }
}

//==========  /Helper ==============================//

function initializeWazeObjects(){

    log("init");
    var objectToCheck = [
        {o: "W", s: "waze"},
        {o: "W.model", s: "wazeModel"},
        {o: "W.map", s: "wazeMap"},
        {o: "W.loginManager", s: "WazeLoginManager"},
        {o: "W.selectionManager", s: "WazeSelectionManager"},
        {o: "Waze/Action/UpdateObject", s: "WazeActionUpdateObject"},
        {o: "Waze/Action/UpdateSegmentGeometry", s: "WazeUpdateSegmentGeometry"},
        {o: "Waze/Action/ConnectSegment", s: "WazeActionConnectSegment"},
        {o: "Waze/Action/DisconnectSegment", s: "WazeActionDisconnectSegment"},
        {o: "Waze/Action/MultiAction", s: "WazeActionMultiAction"},
        {o: "Waze/Model/Graph/Actions/SetTurn", s: "WazeModelGraphActionsSetTurn"},
        //{o: "Waze/Model/Graph/Turn",              s: "WazeModelGraphTurn"},
        {o: "Waze/Model/Graph/TurnData", s: "WazeModelGraphTurnData"},
        //{o: "Waze/Model/Graph/TurnGraph",         s: "WazeModelGraphTurnGraph"},
        //{o: "Waze/Model/Graph/Vertex",            s: "WazeModelGraphVertex"},
        {o: "W.loginManager.user", s: "me"},
        {o: "localStorage", s: null}
    ];

    if (newversion) {
        objectToCheck.push({o: "W.loginManager.user.attributes.rank", s: "ul"})
        objectToCheck.push({o: "W.loginManager.user.attributes.isAreaManager", s: "uam"})
    } else {
        objectToCheck.push({o: "W.loginManager.user.rank", s: "ul"})
        objectToCheck.push({o: "W.loginManager.user.isAreaManager", s: "uam"})
    }

    for (var i=0; i<objectToCheck.length; i++){
        if (objectToCheck[i].o.indexOf("/") != -1) {
            if (objectToCheck[i].s != null) wazeOBJ[objectToCheck[i].s] = require(objectToCheck[i].o);
        } else {
            var path = objectToCheck[i].o.split(".");
            var object = unsafeWindow;
            for (var j = 0; j < path.length; j++) {
                object = object[path[j]];
                if (typeof object == "undefined" || object == null) {
                    window.setTimeout(initializeWazeObjects, 1000);
                    return;
                }else{ if (objectToCheck[i].s != null) wazeOBJ[objectToCheck[i].s] = object;}
            }
        }
    }
    log("wazeOBJ :",wazeOBJ);
    initializeWazeUI();
}

function initializeWazeUI(){
    var userInfo = getId('user-info');
    if (userInfo==null)
    {
        window.setTimeout(initializeWazeUI, 500);
        return;
    }

    var navTabs=userInfo.getElementsByTagName('ul');
    if (navTabs.length==0)
    {
        window.setTimeout(initializeWazeUI, 500);
        return;
    }
    if (typeof(navTabs[0])==='undefined')
    {
        window.setTimeout(initializeWazeUI, 500);
        return;
    }

    var tabContents=userInfo.getElementsByTagName('div');
    if (tabContents.length==0)
    {
        window.setTimeout(initializeWazeUI, 500);
        return;
    }
    if (typeof(tabContents[0])==='undefined')
    {
        window.setTimeout(initializeWazeUI, 500);
        return;
    }

    WRNAB_Init();
}

function WRNAB_newSelectionAvailable(){
    //log('wazeOBJ.WazeSelectionManager',wazeOBJ.WazeSelectionManager);
    if (wazeOBJ.WazeSelectionManager.getSelectedFeatures() !== undefined){
        var selection = wazeOBJ.WazeSelectionManager.getSelectedFeatures();
    }
    if (wazeOBJ.WazeSelectionManager.selectedItems !== undefined){
        selection = wazeOBJ.WazeSelectionManager.selectedItems;
    }
    log('selection', selection);

    if (selection === undefined || selection.length !=1 ){
        return;
    }
    var selectedObject = W.version.substr(1,3) > '2.1' ? selection[0]._wmeObject : selection[0].attributes.wazeFeature._wmeObject;
    if (selectedObject.type!="segment"){
        return;
    }
    log('wazeOBJ.uam', wazeOBJ.uam);
    if (!wazeOBJ.uam) return;

    var editPanel=getId('edit-panel');
    log(editPanel)
    if (editPanel.firstElementChild.style.display=='none'){
        window.setTimeout(WRNAB_newSelectionAvailable, 100);
    }

    // ok: 1 selected item and pannel is shown
    append_WRNAB_Controle();
}

function append_WRNAB_Controle() { // wait for 'sidebar'
    var WRNAB_Controle1 = create_WRNAB_Controle

    if (document.getElementById('segment-edit-general')!=null) {
//        if (!document.getElementById('WRNAB_Controle')) {
            $("#segment-edit-general").append(WRNAB_Controle1);
//    }
    }
    else {
        setTimeout (function () {append_WRNAB_Controle();}, 1001);
    }
}

function create_WRNAB_Controle () {
    var WRNAB_Controle = $ ('<div id="WRNAB_Controle" style="border: none;"/>');
    var btn1 = $('<button style="display: block; margin: auto; background-color: #0099FF; color: white; border: none; border-radius: 40px; box-sizing: border-box; line-height: 20px;">Reverse Nodes A/B</button>');
    btn1.click	(invertNodeAB);
    var cnt1 = $('<section id="WRNAB_cnt1" style="margin:2px; display:inline;"/>'); cnt1.append(btn1);
    WRNAB_Controle.append(cnt1);
    return WRNAB_Controle;
}

function WRNAB_Init(){
    wazeOBJ.WazeSelectionManager.events.register("selectionchanged", null, WRNAB_newSelectionAvailable);
    log('init done.');
}

function onScreen(obj){
    if (obj.geometry)
    {
        return(wazeOBJ.wazeMap.getExtent().intersectsBounds(obj.geometry.getBounds()));
    }
    return false;
}

function isSegmentEditable(seg){
    var rep = true;
    if (seg==null) return false;
    //if (wazeOBJ.Waze.loginManager.user.isCountryManager() ) rep = true;
    if (!wazeOBJ.uam) rep = false;
    var ndA = getByID(wazeOBJ.wazeModel.nodes,seg.attributes.fromNodeID);
    var ndB = getByID(wazeOBJ.wazeModel.nodes,seg.attributes.toNodeID);

    if ((seg.attributes.permissions == 0) || (seg.attributes.hasClosures)){
        rep = false;
    }
/*    if ((ndA.attributes.permissions == 0) || (seg.attributes.hasClosures)){
        rep = false;
    }
    if ((ndB.attributes.permissions == 0) || (seg.attributes.hasClosures)){
        rep = false;
    }
*/
    return rep;
}

function invertNodeAB(){
    if (wazeOBJ.WazeSelectionManager.getSelectedFeatures() !== undefined){
        var selection = wazeOBJ.WazeSelectionManager.getSelectedFeatures();
    }
    if (wazeOBJ.WazeSelectionManager.selectedItems !== undefined){
        selection = wazeOBJ.WazeSelectionManager.selectedItems;
    }
    log('selection', selection);

    if (selection === undefined || selection.length !=1 ){
        return;
    }
    var seg = getByID(wazeOBJ.wazeModel.segments,W.version.substr(1,3) > '2.1' ? selection[0]._wmeObject.attributes.id : selection[0].attributes.wazeFeature._wmeObject.attributes.id);
    if (seg.type!="segment"){
        return;
    }
    var attr = seg.attributes;
    log("seg",seg);
    log("attr",attr);

    var sid = attr.id;

    // if unnamed, don't touch
    if (attr.primaryStreetID==null){
        log("Unnamed segment. Do not put my name on it!");
        return;
    }

    // if locked, don't touch
    /*if ((attr.lockRank==null && attr.rank>usrRank) ||
        (attr.lockRank!=null && attr.lockRank>usrRank)){
        log("locked: " + attr.rank + " " + attr.lockRank);
        continue;
    }
    */

    var ndA = getByID(wazeOBJ.wazeModel.nodes,attr.fromNodeID);
    var ndB = getByID(wazeOBJ.wazeModel.nodes,attr.toNodeID);
    log("ndA", ndA);
    log("ndB", ndB);
    // verification de pbs sur nodes (unterminated roads par ex)
    // check if bad node (unterminated roads or over...)
    if (!ndA || !ndB){
        log("Bad nodes: A=" + ndA + " or B=" + ndB);
        return;
    }

    // On verifie que le segment est affiche a l'ecran
    if (onScreen(ndA) && onScreen(ndB)){
        log("IN Screen!");
    }
    else{
        log("OUT of Screen");
        return;
    }

    // On verifie que le segment est editable
    console.log(seg)
    if (!isSegmentEditable(seg)){
        log("Not editable!");
        return;
    }

    // Memorisation des parametre du segment pour les reporter apres changement de sens
    // Storing segment parameters for restore them after changing direction
    var newAttr={};
    //var fromConnections = attr.toConnections.clone();
    //var toConnections = attr.fromConnections.clone();
    newAttr.fwdDirection = attr.revDirection;
    newAttr.revDirection = attr.fwdDirection;
    newAttr.fwdTurnsLocked = attr.revTurnsLocked;
    newAttr.revTurnsLocked = attr.fwdTurnsLocked;
    newAttr.fwdMaxSpeed = attr.revMaxSpeed;
    newAttr.revMaxSpeed = attr.fwdMaxSpeed;
    newAttr.fwdMaxSpeedUnverified = attr.revMaxSpeedUnverified;
    newAttr.revMaxSpeedUnverified = attr.fwdMaxSpeedUnverified;
    newAttr.fwdLaneCount = attr.revLaneCount;
    newAttr.revLaneCount = attr.fwdLaneCount;
    newAttr.restrictions = [];

    for (var i=0; i<attr.restrictions.length; i++){
        newAttr.restrictions[i] = attr.restrictions[i].withReverseDirection();
    }

    log("newAttr", newAttr);

    /*----------------------------------------------------------------------------

     New editor:
     f = forward direction (A>B)
     r = reverse direction (B>A)

     W.model.turnGraph._adjacencyList["280125026r"]
     --> {295413973f: {instructionOpcode: null,
                      restrictions:Array[0],
                      state:1 }

     W.model.turnGraph.getTurn(W.model.segments.objects["280125026"],W.model.segments.objects["280125024"])
     --> {fromVertex, toVertex , turnData}

     turn = W.model.getTurnGraph().getTurnThroughNode(W.model.nodes.get("232242442"),W.model.segments.get("280125026"),W.model.segments.get("280125024"))
           = W.model.turnGraph.getTurn( turn.getFromVertex(), turn.getToVertex())
           --> {fromVertex, toVertex , turnData}

     turn.getTurnData().getInstructionOpcode()

     W.model.getRoadGraph().getVertexNodeID(W.model.getTurnGraph().getTurnThroughNode(W.model.nodes.get("232242442"),W.model.segments.get("280125026"),W.model.segments.get("280125024")).getFromVertex())
     e {fromVertex: e, toVertex: e, turnData: e}
            fromVertex:e
                direction:true    --> A>B
                segmentID:69264747
            toVertex:e
                direction:false    --> B>A
                segmentID:69264745
            turnData:e
                instructionOpcode:null
                restrictions:Array[0]
                state:2

     -------------------------------------
     CLASS_NAME: "Waze.Action.SetTurn" --> require("Waze/Model/Graph/Actions/SetTurn");

    -----------------------------------------------------------------------------*/
    var sconA={};
    var sconB={};
    var fromConnections = {};
    var toConnections = {};

    // pour les segments connecte à la node A

    for (var s=0; s<ndA.attributes.segIDs.length; s++){
        var scon=ndA.attributes.segIDs[s];

        // On memorise les directions entrantes
        if (scon != attr.id){
            if (debug){
                log("sconA; mem "+scon+" --> ndA: "+ndA.attributes.id+" --> " + attr.id);
                log("turn",wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndA, getByID(wazeOBJ.wazeModel.segments,scon), getByID(wazeOBJ.wazeModel.segments,attr.id)));
            }
            sconA[scon]= wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndA, getByID(wazeOBJ.wazeModel.segments,scon),getByID(wazeOBJ.wazeModel.segments,attr.id));
            sconA[scon].toVertex.direction = sconA[scon].toVertex.direction == "fwd" ? "rev" : "fwd"
        }

        // On memorise les directions sortantes
        if (debug){
            log("toConnections; mem "+attr.id+" -->  ndA: "+ndA.attributes.id+" --> " + scon);
            log("turn",wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndA,getByID(wazeOBJ.wazeModel.segments,attr.id),getByID(wazeOBJ.wazeModel.segments,scon)));
        }
        toConnections[scon] = wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndA,getByID(wazeOBJ.wazeModel.segments,attr.id),getByID(wazeOBJ.wazeModel.segments,scon));
        toConnections[scon].fromVertex.direction = toConnections[scon].fromVertex.direction == "fwd" ? "rev" : "fwd"
        if (scon == attr.id){ //u-turn
            toConnections[scon].toVertex.direction = toConnections[scon].toVertex.direction == "fwd" ? "rev" : "fwd"
        }
    }
    // pour les segments connecte à la node B
    for (s=0; s<ndB.attributes.segIDs.length; s++){
        scon=ndB.attributes.segIDs[s];
        // On memorise les directions entrantes
        if (scon != attr.id){
            if (debug){
                log("sconB; mem "+scon+" -->  ndB: "+ndB.attributes.id+" --> " + attr.id);
                log("turn",wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndB,getByID(wazeOBJ.wazeModel.segments,scon),getByID(wazeOBJ.wazeModel.segments,attr.id)));
            }
            sconB[scon]= wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndB,getByID(wazeOBJ.wazeModel.segments,scon),getByID(wazeOBJ.wazeModel.segments,attr.id));
            sconB[scon].toVertex.direction = sconB[scon].toVertex.direction == "fwd" ? "rev" : "fwd"
        }
        // On memorise les directions sortantes
        if (debug){
            log("fromConnections; mem "+attr.id+" --> ndB: "+ndB.attributes.id+" --> " + scon);
            log("turn",wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndB,getByID(wazeOBJ.wazeModel.segments,attr.id),getByID(wazeOBJ.wazeModel.segments,scon)));
        }
        fromConnections[scon] = wazeOBJ.wazeModel.getTurnGraph().getTurnThroughNode(ndB,getByID(wazeOBJ.wazeModel.segments,attr.id),getByID(wazeOBJ.wazeModel.segments,scon));
        fromConnections[scon].fromVertex.direction = fromConnections[scon].fromVertex.direction == "fwd" ? "rev" : "fwd"
        if (scon == attr.id){ //u-turn
            fromConnections[scon].toVertex.direction = fromConnections[scon].toVertex.direction == "fwd" ? "rev" : "fwd"
        }
    }

    //log("wazeOBJ.wazeModel.getTurnGraph()._adjacencyList["+attr.id+"f]", wazeOBJ.wazeModel.getTurnGraph()._adjacencyList[attr.id+"f"]);
    //log("wazeOBJ.wazeModel.getTurnGraph()._adjacencyList["+attr.id+"r]", wazeOBJ.wazeModel.getTurnGraph()._adjacencyList[attr.id+"r"]);

    log("sconA",sconA);
    log("sconB",sconB);
    log("fromConnections", fromConnections);
    log("toConnections", toConnections);

    //on inverse la geometrie du segment
    var geo = { ... seg.getGeometry() };
    geo.coordinates.reverse();

    // controle de position
    var nbPoints = geo.coordinates.length-1;
    if (!(JSON.stringify(geo.coordinates[0]) == JSON.stringify(ndB.getGeometry().coordinates))){
        if (debug) log("point 0 et dif de node A");
        var delta = {x:0, y:0};
        delta.x =ndB.attributes.geoJSONGeometry.coordinates[0] - geo.coordinates[0][0];
        delta.y = ndB.attributes.geoJSONGeometry.coordinates[1] - geo.coordinates[0][1];
        geo.coordinates[0][0] += delta.x;
        geo.coordinates[0][1] += delta.y;
    }
    if (!(JSON.stringify(geo.coordinates[nbPoints])) == (JSON.stringify(ndA.getOLGeometry().coordinates))){
        if (debug) log("point "+nbPoints+ " est dif de node B");
        delta = {x:0, y:0};
        delta.x = ndA.attributes.geoJSONGeometry.coordinates[0] - geo.coordinates[nbPoints][0];
        delta.y = ndA.attributes.geoJSONGeometry.coordinates[1] - geo.coordinates[nbPoints][1];
        geo.coordinates[nbPoints][0] += delta.x;
        geo.coordinates[nbPoints][1] += delta.y;
    }

    // On deconnecte le segment
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeActionMultiAction([new wazeOBJ.WazeActionDisconnectSegment(seg, ndA),new wazeOBJ.WazeActionDisconnectSegment(seg, ndB)]));

    // maj de la geo du seg
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeUpdateSegmentGeometry (seg,seg.getGeometry(),geo));

    //on replace les parametre inverse
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeActionUpdateObject(seg, newAttr));

    // On reconnecte le segment
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeActionMultiAction([new wazeOBJ.WazeActionConnectSegment(ndB, seg),new wazeOBJ.WazeActionConnectSegment(ndA, seg)]));

    //on replace les autorisations sortantes

    var actions = [];
    for (sid in fromConnections){
        var segId = fromConnections[sid].toVertex.segmentID;
        log("attr.id: " + attr.id + " --> NodeA: " + ndB.attributes.id + " --> segId: " + segId + " ; state = "+fromConnections[sid].turnData.state);
        if (debug) log("fromConnections["+sid+"] = ", fromConnections[sid]);
        switch (fromConnections[sid].turnData.state){
            case 0 :
            case 1 :
                //var turn = new wazeOBJ.WazeModelGraphTurnData(wazeOBJ.WazeModelGraphTurnData.State.ALLOWED);
                //var turn = new wazeOBJ.WazeModelGraphTurnData.createAllowed;
                var turn = new wazeOBJ.WazeModelGraphTurnData;
                turn = turn.withState(fromConnections[sid].turnData.state);
                turn = turn.withRestrictions(fromConnections[sid].turnData.restrictions);
                turn = turn.withInstructionOpcode(fromConnections[sid].turnData.instructionOpcode);
                turn = turn.withLanes(fromConnections[sid].turnData.lanes);
                if (debug) log("turn ", turn);
                actions.push(new wazeOBJ.WazeModelGraphActionsSetTurn(wazeOBJ.wazeModel.getTurnGraph(), fromConnections[sid].withTurnData(turn)));
                break;
        }
    }

    for (sid in toConnections){
        segId = toConnections[sid].toVertex.segmentID;
        log("attr.id: " + attr.id + " --> NodeB: " + ndA.attributes.id + " --> segId: " + segId + " ; state = "+toConnections[sid].turnData.state);
        if (debug) log("toConnections["+sid+"] = ", toConnections[sid]);
        switch (toConnections[sid].turnData.state){
            case 0 :
            case 1 :
                turn = new wazeOBJ.WazeModelGraphTurnData;
                turn = turn.withState(toConnections[sid].turnData.state);
                turn = turn.withRestrictions(toConnections[sid].turnData.restrictions);
                turn = turn.withInstructionOpcode(toConnections[sid].turnData.instructionOpcode);
                turn = turn.withLanes(toConnections[sid].turnData.lanes);
                if (debug) log("turn ", turn);
                actions.push(new wazeOBJ.WazeModelGraphActionsSetTurn(wazeOBJ.wazeModel.getTurnGraph(), toConnections[sid].withTurnData(turn)));
                break;
        }
    }
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeActionMultiAction(actions));
    actions=[];
    //on replace les autorisations entrantes
    log("ndB", ndB);
    for (sid in sconB){
        log("sconB: "+sid+" --> nodeA: " + ndB.attributes.id + "--> attr.id: " + attr.id + " ; state = "+sconB[sid].turnData.state);
        if (debug) log("sconB["+sid+"]:",sconB[sid]);
        switch (sconB[sid].turnData.state){
            case 0 :
            case 1 :
                turn = new wazeOBJ.WazeModelGraphTurnData;
                turn = turn.withState(sconB[sid].turnData.state);
                turn = turn.withRestrictions(sconB[sid].turnData.restrictions);
                turn = turn.withInstructionOpcode(sconB[sid].turnData.instructionOpcode);
                turn = turn.withLanes(sconB[sid].turnData.lanes);
                if (debug) log("turn ", turn);
                actions.push(new wazeOBJ.WazeModelGraphActionsSetTurn(wazeOBJ.wazeModel.getTurnGraph(), sconB[sid].withTurnData(turn)));
                break;
        }
    }
    log("ndA", ndA);
    for (sid in sconA){
        log("sconA : "+sid+" --> nodeB: " + ndA.attributes.id + " --> attr.id: " + attr.id+ " ; state = "+sconA[sid].turnData.state);
        if (debug) log("sconA["+sid+"]:",sconA[sid]);
        switch (sconA[sid].turnData.state){
            case 0 :
            case 1 :
                turn = new wazeOBJ.WazeModelGraphTurnData;
                turn = turn.withState(sconA[sid].turnData.state);
                turn = turn.withRestrictions(sconA[sid].turnData.restrictions);
                turn = turn.withInstructionOpcode(sconA[sid].turnData.instructionOpcode);
                turn = turn.withLanes(sconA[sid].turnData.lanes);
                if (debug) log("turn ", turn);
                actions.push(new wazeOBJ.WazeModelGraphActionsSetTurn(wazeOBJ.wazeModel.getTurnGraph(), sconA[sid].withTurnData(turn)));
                break;
        }
    }
    wazeOBJ.wazeModel.actionManager.add(new wazeOBJ.WazeActionMultiAction(actions));
    log('Invert node for segment '+attr.id+': Ok');
}

WRNAB_bootstrap();