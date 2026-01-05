   // ==UserScript==
// @name                WME Russian States Overlay
// @namespace           https://greasyfork.org/ru/users/26908-aleksey-shabunin
// @description         Polygons regions of the Russia
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.30
// @grant               none
// @copyright           2016 coilamo
// @downloadURL https://update.greasyfork.org/scripts/24672/WME%20Russian%20States%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/24672/WME%20Russian%20States%20Overlay.meta.js
// ==/UserScript==


//---------------------------------------------------------------------------------------


var RSO_qty=4;
var RSO_debug=false;
var RSO_ll;
var states_info = [];
var _settingsStoreName = '_wme_rso';
var _settings;
var colors = ['#FF0000', '#0000FF', '#FFFF00', '#FFAA00', '#800000', '#800080', '#000080', '#008080'];
var addedPolygons = [];

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function GetLatLonZoom(){
    var urPos=new OpenLayers.LonLat(W.map.olMap.center.lon,W.map.olMap.center.lat);
    urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
    return {
        lat: urPos.lat,
        lon: urPos.lon,
        zoom: W.map.olMap.zoom
    };
}

function changeLayer(state_mapLayer)
{
	localStorage.statusStateLayers = state_mapLayer.getVisibility();
    if(localStorage.statusStateLayers == "true") {
        $('#states-list').css('display', 'block');
    } else {
        $('#states-list').css('display', 'none');
    }
}

function ShowInfo(data){
    var html='';
    $('#states-list').html("");
    //console.log('data', data);

    var dups = [];
    var arr = data.filter(function(el) {
        // If it is not a duplicate, return true
        if (dups.indexOf(el.state_1) == -1) {
            dups.push(el.state_1);
            return true;
        }

        return false;
    });

    arr.forEach(function(state, j) {
        states_info.forEach(function(state_color, i) {
            var statename = (state['state_2'] != undefined) ? state['state_1'] + ', ' + state['state_2'] : state['state_1'];
            if(state_color.state == statename)
                //if(state_color.rules !== '') alert(state_color.rules);
                html += '<span style="margin:2px;display:inline-block;line-height:25px;width:25px;background-color:' + state_color.color + ';">&nbsp;</span> <span style="margin:2px;display:inline-block;line-height:25px;">' + state_color.state + '</span><br>';
        });
    });

    if(html !== '') $('#states-list').html(html);
    else $('#states-list').html('<span style="display:inline-block;line-height:28px;">В этой области нет видимых штатов. Пожалуйста, обновите страницу браузера.</span>');
}

function AddPolygon(stateLayer,groupPoints,groupColor,groupNumber){
    //console.log('addPolygon');
    var mro_Map = W.map.olMap;
    var mro_OL = OpenLayers;
    var stateGroupLabel = groupNumber;
    var groupName = groupNumber;
    
    var style = {
        strokeColor: groupColor,
        strokeOpacity: 1,
        strokeWidth: 4,
        strokeDashstyle: "dash",
        fillColor: groupColor,
        fillOpacity: 0.15,
        label: stateGroupLabel,
        labelOutlineColor: "black",
        labelOutlineWidth: 3,
        fontSize: 14,
        fontColor: groupColor,
        fontOpacity: .85,
        fontWeight: "bold"
    };
    
    var attributes = {
        name: groupName,
        number: groupNumber
    };
    
    var pnt= [];
    for(i=0;i<groupPoints.length;i++){
        convPoint = new OpenLayers.Geometry.Point(groupPoints[i].lon,groupPoints[i].lat).transform(new OpenLayers.Projection("EPSG:4326"), mro_Map.getProjectionObject());
        
        pnt.push(convPoint);
    }
		       
    var ring = new mro_OL.Geometry.LinearRing(pnt);
    var polygon = new mro_OL.Geometry.Polygon([ring]);
    
    var feature = new mro_OL.Feature.Vector(polygon,attributes,style);
    stateLayer.addFeatures([feature]);
}

function InitRussianStateOverlay(){
    console.log('InitRussianStateOverlay');

    var RSO_states_list = document.createElement('div');
    RSO_states_list.id = "states-list";
    RSO_states_list.style.backgroundColor = "#fff";
    RSO_states_list.style.position = "fixed";
    RSO_states_list.style.bottom = "28px";
    RSO_states_list.style.right = "82px";
    RSO_states_list.style.margin = "4px";
    document.getElementById('editor-container').appendChild(RSO_states_list);

    var mro_Map = W.map.olMap;
    var mro_OL = OpenLayers;

    if (!mro_Map) return;
	
    if (!mro_OL) return;

    //I18n.translations[window.I18n.locale].layers.name.russianstates = "Russian states";

    //var mro_mapLayers = mro_Map.getLayersBy("uniqueName","russianstates");

    var state_mapLayer = new mro_OL.Layer.Vector("Russian states", {
        displayInLayerSwitcher: true,
        uniqueName: "russianstates"
    });


    mro_Map.addLayer(state_mapLayer);
    if (localStorage.statusStateLayers == "true") {
        state_mapLayer.setVisibility(true);
        $('#states-list').css('display', 'block');
    } else {
        state_mapLayer.setVisibility(false);
        $('#states-list').css('display', 'none');
    }

    var oldTogglers = document.querySelectorAll('.togglers');
    oldTogglers.forEach(function(elt,idx){
        if(elt.id != "toolboxUl"){
            // if script group dosn't exist we create them.
            if (oldTogglers[idx].querySelector('.layer-switcher-group_scripts') === null)
            {
                var newScriptsToggler = document.createElement('li');
                newScriptsToggler.className = 'group';
                newScriptsToggler.innerHTML = '<div class="controls-container main toggler">\
<input class="layer-switcher-group_scripts toggle" id="layer-switcher-group_scripts" type="checkbox">\
<label for="layer-switcher-group_scripts">\
<span class="label-text">Scripts</span>\
</label>\
</div>\
<ul class="children">\
</ul>';
                oldTogglers[idx].appendChild(newScriptsToggler);

            }


            var newToggler = document.createElement('li');
            newToggler.innerHTML = '<div class="controls-container toggler">\
<input class="layer-switcher-item_russian-states toggle" id="layer-switcher-item_russian-states" type="checkbox">\
<label for="layer-switcher-item_russian-states">\
<span class="label-text">Russian states</span>\
</label>\
</div>';


            var groupScripts = document.querySelector('.layer-switcher-group_scripts').parentNode.parentNode;
            var newScriptsChildren = groupScripts.getElementsByClassName("children")[0];
            // insert RSO toggler at the end of children of "group_scripts"
            newScriptsChildren.appendChild(newToggler);


            var toggler = document.getElementById('layer-switcher-item_russian-states');
            var groupToggler = document.getElementById('layer-switcher-group_scripts');

            // restore old state
            groupToggler.checked = (typeof(localStorage.groupScriptsToggler) !=="undefined" ?
                                    JSON.parse(localStorage.groupScriptsToggler) : true);

            //Set toggler according to user preference
            toggler.checked = false;
            toggler.disabled = !groupToggler.checked;

            // togglers events
            toggler.addEventListener('click', function(e) {
                state_mapLayer.setVisibility(e.target.checked);
            });

            groupToggler.addEventListener('click', function(e) {
                toggler.disabled = !e.target.checked;
                state_mapLayer.setVisibility(toggler.checked ? e.target.checked : toggler.checked);
                localStorage.setItem('groupScriptsToggler', e.target.checked);
            });

            //Set visibility according JAI's toggler and scripts group's toggler state
            state_mapLayer.setVisibility(toggler.checked ? groupToggler.checked : toggler.checked);


        }
    });

    drawState(state_mapLayer);
    W.map.olMap.events.register("changelayer", null, function(){changeLayer(state_mapLayer);});
    W.map.olMap.events.register("zoomout", null, function(){drawState(state_mapLayer);});
    W.map.olMap.events.register("zoomin", null, function(){drawState(state_mapLayer);});
    W.map.olMap.events.register("moveend", null, function(){drawState(state_mapLayer);});
   
}

function drawState(state_mapLayer) {
    if(state_mapLayer.getVisibility()) {
        //console.log('drawState');
        RSO_ll=GetLatLonZoom();
        var states='';
        W.model.states.getObjectArray().forEach(function(item) {
            states += item.id + ' ';
        });
        states = states.trim().replace(/\s+/g, ',');
        $.ajax({
            url:"https://bobalus.ru/api/get-polygons-dev.php?polygons="+states
        }).done(function(data){
            //console.log('addedPolygon', addedPolygons);
            data.forEach(function(polygon) {
                //console.log('state_1', polygon['state_1']);
                if(addedPolygons.indexOf( polygon['state_1'] ) == -1) {
                    var i = addedPolygons.length;
                    addedPolygons.push(polygon['state_1']);
                    states_info.push({"state":(polygon['state_2'] !== undefined) ? polygon['state_1'] + ', ' + polygon['state_2'] : polygon['state_1'], "color":colors[i%8], "rules":polygon['local_rules']});
                    AddPolygon(state_mapLayer, polygon['coords'], colors[i%8], (RSO_debug ? i+". "+polygon['state_1']+' / #'+colors[i%8] : polygon['state_1']));
                }
            });
            ShowInfo(data);
            //console.log('addedPolygons ', addedPolygons);
        });
    }
}

setTimeout(InitRussianStateOverlay, 2000);