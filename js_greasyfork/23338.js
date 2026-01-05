// ==UserScript==
// @name 	  WME Map Nav History
// @description   WME Map navigator historic
// @namespace     https://greasyfork.org/fr/scripts/23338-wme-map-nav-history
// @version 	  0.3.1
// @include       https://www.waze.com/editor*
// @include       https://www.waze.com/*/editor*
// @include       https://beta.waze.com/*
// @exclude       https://www.waze.com/user/*editor/*
// @exclude       https://www.waze.com/*/user/*editor/*
// @grant         none
// @copyright     2018 Sebiseba | v0.2 to 0.2.3 by myriades - 2015
// @icon		  data:image/png;base64,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 AAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/23338/WME%20Map%20Nav%20History.user.js
// @updateURL https://update.greasyfork.org/scripts/23338/WME%20Map%20Nav%20History.meta.js
// ==/UserScript==

/***	Bootstrap et inits	***/
function MNH_Bootstrap() {
    if (typeof unsafeWindow === "undefined") {
        unsafeWindow   =( function () {
            var dummyElem=document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    console.info('MNH_Bootstrap ok :',GM_info.script.version);
    MNH_Initialise();
}
function MNH_Initialise(){
    _oldP = '';
    _newP = '';
    _helpers = new helpers();
    _prev = [];
    _next = [];
    _cur = '';
    _layerVisibilityBitmask = [];
    _stopUpdPos = false;
    WMEMNH = {};
    WMEMNH.nav = {'prev':'', 'cur':'', 'next':''};
    _helpers.log('MNH_Initialise', 'info', 'Done');
    MNH_check_Waze_Els();
}
function MNH_check_Waze_Els(){
    // Waze object needed
    W=unsafeWindow.W;    if(typeof(W) === 'undefined'){ window.setTimeout(MNH_check_Waze_Els, 500); return; }
    if(typeof(W.map) === 'undefined'){ window.setTimeout(MNH_check_Waze_Els, 500); return; }
    if(typeof(W.model) === 'undefined'){ window.setTimeout(MNH_check_Waze_Els, 500); return; }
    if(typeof(W.selectionManager) === 'undefined'){ window.setTimeout(MNH_check_Waze_Els, 500); return; }
    if(typeof(unsafeWindow.OL) === 'undefined'){ window.setTimeout(MNH_check_Waze_Els, 500); return; }
    if ('undefined' === typeof localStorage.WMEMNH || !isJsonString(localStorage.WMEMNH)) { localStorage.setItem('WMEMNH', '{"prev":[],"next":[]}'); }
    var a=JSON.parse(localStorage.WMEMNH);
    _prev=a.prev; _next=a.next;

    //	Waze UI
    MNHhandle = getElementsByClassName("waze-icon-trash", getId("edit-buttons"))[0];
    if (typeof (MNHhandle) === 'undefined') { window.setTimeout(MNH_check_Waze_Els, 500); return; }

    //	Waze data init
    for(var i in W.map.layerVisibilityBitmask)_layerVisibilityBitmask[W.map.layerVisibilityBitmask[i]] = i;
    //console.log(_layerVisibilityBitmask);

    //	events
    window.setInterval(checkPermaLink, 1000);
    // W.map.events.register("zoomend", null, updatePos);
    // W.map.events.register("moveend", null, updatePos);
    // W.map.events.register("addlayer", null, updatePos);
    // W.map.events.register("changelayer", null, updatePos);
    // W.selectionManager.events.register('selectionchanged', null, updatePos);
    W.model.events.register('mergeend', null, updateSelectedItems);
    // W.map.events.register("removelayer", null, updatePos);
    // W.model.events.register("mergeend", null, updatePos);
    _helpers.log('MNH_check_Waze_Els', 'info', 'Done');
    MNH_html();
}
/***	HELPERS		***/
function helpers(){ // DEBUG
    this.log = function(fName, type, text){
        var text = GM_info.script.name + ' V' + GM_info.script.version + ' ' + fName + ' : ' + text;
        /*switch(type){
            case 'info':
                console.info(text);
                break;
            case 'error':
                console.error(text);
                break;
            case 'warn':
                console.warn(text);
                break;
                // case 'debug':
                // console.debug(text);
                // break;
            default:
                // console.log(text);
                break;
        }
        if(arguments[3] != null){
            switch(typeof(arguments[3])){
                case 'string':
                case 'boolean':
                    console.log(arguments[3]);
                    break;
                default:
                    console.dir(arguments[3]);
                    break;
            }
        }*/
    }
}
function getId(node) {
    return document.getElementById(node);
}
function getElementsByClassName(classname, node) {
    node || (node=document.getElementsByTagName("body")[0]);
    for (var a=[], re=new RegExp("\\b" + classname + "\\b"), els=
         node.getElementsByTagName("*"), i=
         0, j=
         els.length;i < j;i++) {
        re.test(els[i].className) && a.push(els[i]);
    }
    return a;
}
function isJsonString(str) {
    try { JSON.parse(str); }
    catch (e) { return false; }
    return true;
}
/***	Le script	***/
function MNH_html(){
    //	les boutons
    //// Next Icon
    var next = document.createElement('div');
    next.className='toolbar-button';
    MNHhandle.parentNode.insertBefore(next, MNHhandle);

    var nextIcon=document.createElement('div');
    nextIcon.id='nextIcon';
    nextIcon.style.fontSize='20px';
    nextIcon.innerHTML='<i class="fa fa-arrow-circle-right"></i>';
    nextIcon.ondblclick=clearHistoric;
    nextIcon.onclick=NavNext;
    next.appendChild(nextIcon);

    //// Prev Icon
    var prev = document.createElement('div');
    prev.className='toolbar-button';
    MNHhandle.parentNode.insertBefore(prev, MNHhandle);

    var prevIcon=document.createElement('div');
    prevIcon.id='prevIcon';
    prevIcon.style.fontSize='20px';
    prevIcon.innerHTML='<i class="fa fa-arrow-circle-left"></i>';
    prevIcon.ondblclick=clearHistoric;
    prevIcon.onclick=NavPrev;
    prev.appendChild(prevIcon);

    _helpers.log('MNH_html', 'info', 'Plugin ready');
}
function updatePos(){
    if(_stopUpdPos)return;
    var perma = getPermalink();
    var DPerma = DecodePermalink(perma);
    if(DPerma['zoom'] < 4)return;
    if(_cur == perma)return;
    if(_cur !== ''){
        /***	A FAIRE		***/
        //	On vérifie ce qui doit être mis à jour (total, layer, venues, segments, ...) avant de mettre à jour l'historique
        var newDPerma = DecodePermalink(perma);
        var oldDPerma = DecodePermalink(_cur);
        if(oldDPerma['lat'] == newDPerma['lat'] && oldDPerma['lon'] == newDPerma['lon'] && oldDPerma['zoom'] == newDPerma['zoom']){
            function checkElm(type, patt){
                _cur = _cur.replace(patt, '');
                if(typeof(newDPerma[type]) !== 'undefined'){
                    _cur = _cur + perma.match(patt)[1];
                }
            }
            checkElm('layers', /(&layers=[\d]+)/);
            checkElm('segments', /(&segments=[\d,]+)/);
            checkElm('nodes', /(&nodes=[\d]+)/);
            checkElm('venues', /(&venues=[\d.-]+)/);
            _helpers.log('updatePos', 'info', 'Cur perma updated', _cur);
            return;
        }
        _prev.unshift(_cur);
    }

    _cur = perma;
    if(_prev.length > 0) getId('prevIcon').innerHTML='<i class="fa fa-arrow-left"></i>';
    if(_next.length == 0) { getId('nextIcon').innerHTML='<i class="fa fa-arrow-circle-right"></i>'; }
    else { getId('nextIcon').innerHTML='<i class="fa fa-arrow-right"></i>'; }

    //	Limit historic to 20
    while(_prev.length > 19)_prev.pop();
    _helpers.log('updatePos', 'info','Prev', _prev);
    _helpers.log('updatePos', 'info','Cur', _cur);
    _helpers.log('updatePos', 'info','Next', _next);
    var a={}; a.prev=_prev; a.next=_next;
    localStorage.setItem('WMEMNH', JSON.stringify(a));
}
function NavNext(e){
    if(e.ctrlKey || e.altKey){
        clearHistoric(e,false);
        return;
    }
    if(_next.length > 0){
        _prev.unshift(_cur);
        _cur = _next.shift();
        getId('prevIcon').innerHTML='<i class="fa fa-arrow-left"></i>';
        if(_next.length === 0) getId('nextIcon').innerHTML='<i class="fa fa-arrow-circle-right"></i>';
        _helpers.log('NavNext', 'info','Prev', _prev);
        _helpers.log('NavNext', 'info','Cur', _cur);
        _helpers.log('NavNext', 'info','Next', _next);
        var a={}; a.prev=_prev; a.next=_next;
        localStorage.setItem('WMEMNH', JSON.stringify(a));
        RelocateMap();
    }
    else getId('nextIcon').innerHTML='<i class="fa fa-arrow-circle-right"></i>';
}
function NavPrev(e){
    if(e.ctrlKey || e.altKey){
        clearHistoric(e, true);
        return;
    }
    if(_prev.length > 0){
        _next.unshift(_cur);
        _cur = _prev.shift();
        getId('nextIcon').innerHTML='<i class="fa fa-arrow-right"></i>';
        if(_prev.length === 0) getId('prevIcon').innerHTML='<i class="fa fa-arrow-circle-left"></i>';
        _helpers.log('NavPrev', 'info','Prev', _prev);
        _helpers.log('NavPrev', 'info','Cur', _cur);
        _helpers.log('NavPrev', 'info','Next', _next);
        var a={}; a.prev=_prev; a.next=_next;
        localStorage.setItem('WMEMNH', JSON.stringify(a));
        RelocateMap();
    }
    else getId('prevIcon').innerHTML='<i class="fa fa-arrow-circle-left"></i>';
}
function clearHistoric(e, isPrev){
    if(e.altKey){
        _prev.splice(0, _prev.length);
        getId('prevIcon').innerHTML='<i class="fa fa-arrow-circle-left"></i>';
        _next.splice(0, _next.length);
        getId('nextIcon').innerHTML='<i class="fa fa-arrow-circle-right"></i>';
    }
    else{
        if(isPrev){
            _prev.splice(0, _prev.length);
            getId('prevIcon').innerHTML='<i class="fa fa-arrow-circle-left"></i>';
        }
        else{
            _next.splice(0, _next.length);
            getId('nextIcon').innerHTML='<i class="fa fa-arrow-circle-right"></i>';
        }
    }
    _helpers.log('clearHistoric', 'info','Prev', _prev);
    _helpers.log('clearHistoric', 'info','Cur', _cur);
    _helpers.log('clearHistoric', 'info','Next', _next);
}
function getPermalink(){
    return document.getElementsByClassName('WazeControlPermalink')[0].getElementsByClassName('permalink')[0].href;
}
function checkPermaLink(){
    _newP = getPermalink();
    if(_newP != _oldP){
        _oldP = _newP;
        updatePos();
    }
}
function DecodePermalink(perma){
    var DecodedPerma = [];
    perma = perma.replace(/#$/, '');
    var patt = /[?&](\w+)=([\w\d-.,]+)/g;
    var res = perma.match(patt);
    for(var i=0; i < res.length; i++){
        patt = /[?&](\w+)=([\w\d-.,]+)/;
        nres = res[i].match(patt);
        DecodedPerma[nres[1]] = nres[2];
    }
    DecodedPerma['layersBitmask'] = Number(DecodedPerma['layers']).toString(2);
    while(DecodedPerma['layersBitmask'].length < 13)DecodedPerma['layersBitmask'] = '0' + DecodedPerma['layersBitmask'];
    // _helpers.log('DecodePermalink', 'info', 'DecodedPerma', DecodedPerma);
    return DecodedPerma;
}
function RelocateMap(){
    _stopUpdPos = true;
    W.selectionManager.unselectAll();
    var DecodedPerma = DecodePermalink(_cur);
    var xy=unsafeWindow.OL.Layer.SphericalMercator.forwardMercator(parseFloat(DecodedPerma.lon), parseFloat(DecodedPerma.lat));
    W.map.setCenter(xy, DecodedPerma.zoom);
    //setLayers(DecodedPerma['layersBitmask'].split(""));
    updateSelectedItems();

    function setLayers(layerBits){
        var index = 0;
        while(layerBits.length > 0){
            var layerBit = layerBits.pop();
            if(layerBit == 1)setLayerVisibility(true);
            else setLayerVisibility(false);
            index++;
        }

        function setLayerVisibility(state){
            if(_layerVisibilityBitmask[index] !== undefined) W.map.setLayerVisibility(_layerVisibilityBitmask[index], state); // setLayerVisibility est obsolète
        }
    }
}
function updateSelectedItems(){
    if(_cur == '')return;
    _stopUpdPos = true;
    var DecodedPerma = DecodePermalink(_cur);
    var tmp;
    if(typeof(DecodedPerma['segments']) !== 'undefined'){
        if(!selectSegments(DecodedPerma['segments'].split(",")))return;
    }
    else if(typeof(DecodedPerma['venues']) !== 'undefined'){
        tmp = W.model.venues.getObjectById(DecodedPerma['venues']);
        if(tmp === 'undefined')return;
        selectItem([tmp]);
    }
    else if(typeof(DecodedPerma['nodes']) !== 'undefined'){
        tmp = W.model.nodes.getObjectById(DecodedPerma['nodes']);
        if(tmp === 'undefined')return;
        selectItem([tmp]);
    }
    _stopUpdPos = false;

    function selectSegments(segList){
        var segObj = [];
        for(var i=0; i<segList.length; i++){
            var theSeg = W.model.segments.getObjectById(segList[i]);
            if(typeof(theSeg) !== 'undefined')segObj.push(theSeg);
        }
        if(segObj.length > 0){
            selectItem(segObj);
            return true;
        }
        return false;
    }

    function selectItem(obj){
        W.selectionManager.setSelectedModels(obj);
    }
}
MNH_Bootstrap();