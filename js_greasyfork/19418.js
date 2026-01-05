// ==UserScript==
// @name                WME RosReestr
// @author		        coilamo
// @description         RosReestr Data in WME
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.2.4
// @grant               none
// @namespace           https://greasyfork.org/ru/scripts/19418-wme-rosreestr
// @downloadURL https://update.greasyfork.org/scripts/19418/WME%20RosReestr.user.js
// @updateURL https://update.greasyfork.org/scripts/19418/WME%20RosReestr.meta.js
// ==/UserScript==


//------------------------------------------------------------------------------------------------
function bootstrapRosReestr()
{
    var bGreasemonkeyServiceDefined = false;
    
    try {
        bGreasemonkeyServiceDefined = (typeof Components.interfaces.gmIGreasemonkeyService === "object");
    }
    catch (err) { /* Ignore */ }
    
    if (typeof unsafeWindow === "undefined" || ! bGreasemonkeyServiceDefined) {
        unsafeWindow    = ( function () {
            var dummyElem = document.createElement('p');
            dummyElem.setAttribute('onclick', 'return window;');
            return dummyElem.onclick();
        }) ();
    }
    
    setTimeout(initializeRosReestr, 999);

}


//--------------------------------------------------------------------------------------------------------
function checkLayerNum()
{
    var reLayer = null;
    for(i=0; i<Waze.map.layers.length; i++)
      {
         if(Waze.map.layers[i].uniqueName == '__ros_reestr') reLayer = i;
      }
    //console.log('WME RE: layer number = ' + reLayer);
    return reLayer;
}


//--------------------------------------------------------------------------------------------------------

function GetLatLonZoom()
{
    var urPos=new OpenLayers.LonLat(Waze.map.center.lon,Waze.map.center.lat);
    urPos.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
    return {
        lat: urPos.lat,
        lon: urPos.lon,
       zoom: Waze.map.zoom
    };
}

//--------------------------------------------------------------------------------------------------------
function getFeatureYOffset(){
    
    var yOffset = -30;
    return yOffset;
}

//--------------------------------------------------------------------------------------------------------
function getRosReestr(){
        
    RosReestr_Layer.destroyFeatures();
    
    var ll = GetLatLonZoom();
    var tolerance = Math.pow(2, (18-ll.zoom));
    var type=1;
    

    
    var url = "https://pkk5.rosreestr.ru/api/features/" + type;
    var text = ll.lat + " " + ll.lon;
    var limit = 30;
    var data = {
        "text": text,
        "tolerance": tolerance,
        "limit": limit
	};

    
    $.ajax({
        dataType: "json",
        url: url,
        data: data,
        success: function(json) {

            var reData = json.features;
            try {
                for(var i=0; (i<json.total && i<limit); i++) {
                    if(reData[i].attrs.address !== undefined && reData[i].attrs.address !== '-') {
                        var lat = reData[i].center.y;
                        var long = reData[i].center.x;
                        var image = 'HOUSE';
                        var title = reData[i].attrs.address;
                        //console.log("WME RE: " + image, reData[i].center.x, reData[i].center.y);
                        addImage(lat,long,image,reData[i]);
                    }
                }
            }
            catch(e) {
                console.log('WME RE: No data');
            }
        }
    });
}

//--------------------------------------------------------------------------------------------------------
function addImage(lat, long, type, detail) {

    var coords = OpenLayers.Layer.SphericalMercator.forwardMercator(long, lat);
    //console.log("WME RE: addimage " + type, long, lat);
  var point = new OpenLayers.Geometry.Point(long,lat);
  var alertPx = Waze.map.getPixelFromLonLat(new OpenLayers.LonLat(long,lat));
    
  var imgRoot = '/assets';
  
  switch(type){
      case 'HOUSE':
          var icon = 'data:image/png;base64,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AAAAAEAAAAB/AAAAv/////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA//////8AAAC/AAAAfwAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAABWAAAAigAAAKQAAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAKQAAACKAAAAVgAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgAAADEAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAADEAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhQJmtXs9lMAAAAAElFTkSuQmCC'; break;
      default:
          var icon = 'data:image/png;base64,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AAAAAEAAAAB/AAAAv/////8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA//////8AAAC/AAAAfwAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAABWAAAAigAAAKQAAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAL8AAAC/AAAAvwAAAKQAAACKAAAAVgAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgAAADEAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAAEAAAABAAAAAQAAAADEAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhQJmtXs9lMAAAAAElFTkSuQmCC';
  };
    
  var attributes = {
      type: type,
      title: detail.title1,
      pixel: alertPx
  };
    

        
  var style = { 
    externalGraphic: icon,
    graphicWidth: 30,
    graphicHeight: 32,
    graphicYOffset: getFeatureYOffset(),
    fillOpacity: 1,
    title: 'RE',
    cursor: 'help'
  };
    
  var imageFeature = new OpenLayers.Feature.Vector(point, attributes, style);
    
  RosReestr_Layer.addFeatures([imageFeature]);
  //console.log('WME RE: Added alert at ' + lat + ',' + long);

}

//--------------------------------------------------------------------------------------------------------
function initializeRosReestr()
{    
    console.log("WME RE: Initializing");
    
    var lmaoVisibility = true;
        
    RosReestr_Layer = new OpenLayers.Layer.Vector("RosReestr",{
            rendererOptions: { zIndexing: true }, 
     		uniqueName: '__ros_reestr'
        }          
    ); 
    I18n.translations[I18n.locale].layers.name["__ros_reestr"] = "RosReestr";
    
    // restore saved settings
    if (localStorage.WMERosReestr) {
        //console.log("WME RE: loading options");
        var options = JSON.parse(localStorage.getItem("WMERosReestr"));
        
        lmaoVisibility 							= options[0];
    }

    // overload the WME exit function
    saveREOptions = function() {
        if (localStorage) {
            //console.log("WME RE: saving options");
            var options = [];
            
            lmaoVisibility = RosReestr_Layer.visibility;
            options[0] = lmaoVisibility;
            
            localStorage.setItem("WMERosReestr", JSON.stringify(options));
        }
    }
    window.addEventListener("beforeunload", saveREOptions, false);
    
     function showAlertPopup(f){
        
        //shift popup if UR or MP panel is visible
        try{
            var urPanel = document.getElementById('update-request-panel');
        	var mpPanel = document.getElementById('problem-edit-panel');
            var conversationPanel = urPanel.children[5];
            if (urPanel.className == 'top-panel panel-shown collapsed' && conversationPanel.style.display == 'block'){
                divRE.style.left = '635px';
            }
            else if (urPanel.className == 'top-panel panel-shown' && conversationPanel.style.display == 'block'){
                divRE.style.top = '325px';
                divRE.style.left = '635px';
            }
            else if (urPanel.className == 'top-panel panel-shown' || mpPanel.className == 'top-panel panel-shown'){
                divRE.style.top = '325px';
            }
            else{
                divRE.style.top = '175px';
                divRE.style.left = '375px';
            }
        }
        catch(e){
            //console.log('WME LMAO: Problem getting detail for UR or MP panel');
        }
        
        var attributes = f.attributes;
        
        
                            
        var reportDetail = "<b>Details</b>"
        	+ "<br>DESCRIPTION: " + attributes.title
        	
                
        ;
        document.getElementById("divRE").innerHTML = reportDetail;
        divRE.style.visibility = 'visible';
    };
    
    function hideAlertPopup(){
        divRE.style.visibility = 'hidden';
        divRE.style.top = '175px';
        divRE.style.left = '375px';
    };
        

    RosReestr_Layer.setZIndex(9999);
    Waze.map.addLayer(RosReestr_Layer);
    Waze.map.addControl(new OpenLayers.Control.DrawFeature(RosReestr_Layer, OpenLayers.Handler.Path));
    RosReestr_Layer.setVisibility(lmaoVisibility);
    
    var divPopupCheck = document.getElementById('divRE');
    if (divPopupCheck == null){
        divRE = document.createElement('div');
        divRE.id = "divRE";
        divRE.style.position = 'absolute';
        divRE.style.visibility = 'hidden';
        divRE.style.top = '175px';
        divRE.style.left = '375px';
        divRE.style.zIndex = 1000;
        divRE.style.backgroundColor = 'aliceblue';
        divRE.style.borderWidth = '3px';
        divRE.style.borderStyle = 'ridge';
        divRE.style.borderRadius = '10px';
        divRE.style.boxShadow = '5px 5px 10px Silver';
        divRE.style.padding = '4px';
        document.body.appendChild(divRE);
        //console.log('WME RE: Creating popup divRE');
    }
    
    //clear existing RE features 
    RosReestr_Layer.destroyFeatures();
    
    var reLayer = checkLayerNum();    
    
    Waze.map.events.register("mousemove", Waze.map, function(e) {
        hideAlertPopup();
        var position = this.events.getMousePosition(e);
        //console.log('WME RE: coords xy = ' + position.x + ' ' + position.y);
        var reLayer = checkLayerNum();        
        if(Waze.map.layers[reLayer].features.length > 0){

            //var alertCount = Waze.map.layers[reLayer].features.length;
            //console.log('WME RE: Current LiveMap alert count = ' + alertCount);
            
            var alertFeatures = Waze.map.layers[reLayer];
            for(j=0; j<Waze.map.layers[reLayer].features.length; j++){
                
                var reLayerVisibility = RosReestr_Layer.getVisibility();
                var alertX = alertFeatures.features[j].attributes.pixel.x;
                var alertY = alertFeatures.features[j].attributes.pixel.y + getFeatureYOffset();
                if(reLayerVisibility == true && position.x > alertX - 10 && position.x < alertX + 10 && position.y > alertY - 10 && position.y < alertY + 20){
                	//console.log('WME RE: hover over alert');
                    showAlertPopup(alertFeatures.features[j]);
                }
            }
        }
    });        
    
    //refresh if user moves map
    Waze.map.events.register("moveend", Waze.map, getRosReestr);
    
    window.setTimeout(getRosReestr(), 500);

}

//--------------------------------------------------------------------------------------------------------------
bootstrapRosReestr();