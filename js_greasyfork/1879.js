// ==UserScript==
// @name 			WME Street to River PLUS
// @description 	This script create a new river landmark in waze map editor (WME). It transforms the the geometry of a new unsaved street to a polygon.
// @namespace 		https://greasyfork.org/scripts/1879-wme-street-to-river-plus
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @include         https://editor-beta.waze.com/*
// @include         https://beta.waze.com/*
// @exclude         https://www.waze.com/user/*editor/*
// @exclude         https://www.waze.com/*/user/*editor/*
// @grant 			none
// @version 		16.07.25
// @downloadURL https://update.greasyfork.org/scripts/1879/WME%20Street%20to%20River%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/1879/WME%20Street%20to%20River%20PLUS.meta.js
// ==/UserScript==

// Base on WME Street to river
// de         https://*.waze.com/*editor*

// Mini howto:
// 1) install this script as greasemonkey script or chrome extension
// 2) draw a new street but do not save the street
// 3) add and apply a street name to define the rivers name and the the width of the river
//    Example: "20m Spree" creates a 20 meters width river named "Spree"
// 4) Select the helper street
// 5) Click the "Street to river" button
// 4) Delete the helper street
// 5) Edit the new landmark as you like
//
// Updated by: Eduardo Carvajal

var version = '16.07.25';

var idMeters  = 0;
var idWidth = 1;
var idTitle = 2;
var idStreetToRiver = 3;
var idUnlimitedSize=4;
var idNoUsavedStreet=5;
var idAllSegmentsInside=6;
var idMultipleSegmentsInside=7;


function streetToRiver_bootstrap()
{
   var wazeapi = W || window.W;
   if(!wazeapi || !wazeapi.map) {
      setTimeout(streetToRiver_bootstrap, 1000);
      return;
   }

    /* begin running the code! */
    streetToRiver_init();
    //setTimeout(streetToRiver_init,3000);
	//window.setTimeout(streetToRiver_init,500);
}




// 2014-01-09: Add new controls to Waze Editors.
function streetToRiver_init() {

    var defaultWidth = 20;
    var scriptLanguage = "us";
    var langText;

    function insertButtons() {

        //if(Waze.selectionManager.selectedItems.length === 0) return;
        if(Waze.selectionManager._selectedFeatures.length === 0) return;

        // 2013-04-19: Catch exception
        try{
            if(document.getElementById('streetToRiver') !== null) return;
        }
        catch(e){ }


        // 2014-01-09: Add Create River and Create Railway buttons
        var btn1 = $('<button class="btn btn-primary" title="' + getString(idTitle) + '">' + getString(idStreetToRiver) + '</button>');
        btn1.click(doRiver);

        var strMeters =  getString(idMeters);

        // 2014-01-09: Add River Width Combobox
        var selRiverWidth = $('<select id="riverWidth" data-type="numeric" class="form-control" />');
        selRiverWidth.append( $('<option value="5"> 5 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="8"> 8 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="10">10 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="15">15 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="20">20 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="25">25 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="30">30 ' + strMeters + '</option>') );
        selRiverWidth.append( $('<option value="40">40 ' + strMeters + '</option>') );


        // 2014-01-09: Add Unlimited size river with checkbox
        var chk = $('<label class="checkbox"><input type="checkbox" id="_isUnlimitedSize">' + getString(idUnlimitedSize) + '</label>');


        // 2014-01-09: Add streetToRiver section with new HTML controls
        var cnt = $('<section id="streetToRiver" />');

        // 2014-01-09: Add River width to section
        var divGroup1 = $('<div class="form-group" />');
        divGroup1.append( $('<label class="col-xs-4">' + getString(idWidth) + ':</label>') );
        var divControls1 = $('<div class="col-xs-8 controls" />');
        divControls1.append(selRiverWidth);
        divControls1.append(chk);
        divGroup1.append(divControls1);
        cnt.append(divGroup1);

        // 2014-01-09: Add river buttons to section
        var divGroup2 = $('<div class="form-group"/>');
        divGroup2.append( $('<label class="col-xs-4">&nbsp;</label>') );
        var divControls2 = $('<div class="col-xs-8 controls" />');
        divControls2.append(btn1);
        divGroup2.append(divControls2);
        cnt.append(divGroup2);

        // 2014-01-09: Add Script version to section.
        var divGroup3 = $('<label><a href="https://www.waze.com/forum/viewtopic.php?f=819&t=87931" target="_blank">Street to River+' + version + '</a></label>');
        cnt.append(divGroup3);


        $("#segment-edit-general").append(cnt);


        // 2013-06-09: Select last river width
        var lastRiverWidth = getLastRiverWidth(20);
        console_log("Last river width: " + lastRiverWidth);
        selRiverWidth = document.getElementById('riverWidth');
        if(selRiverWidth!==null){
            for(var i=0; i < selRiverWidth.options.length; i++){
                if(selRiverWidth.options[i].value == lastRiverWidth){
                    selRiverWidth.selectedIndex = i;
                    break;
                }
            }
        }

        // 2013-10-20: Last time user select unlimited size?
        var isUnlimitedSize = document.getElementById('_isUnlimitedSize');
        if(isUnlimitedSize!==null){
            isUnlimitedSize.checked = getLastIsUnlimitedSize(false);
        }


        console_log("Street to River Language: " + scriptLanguage);
        console_log("Street to river PLUS initialized");
    }


    // 2014-01-09: Process River Button
    function doRiver(ev) {
        var convertOK;
        var foundSelectedSegment = false;

        // 2013-10-20: Get river's width
        var selRiverWidth = document.getElementById('riverWidth');
        defaultWidth = parseInt(selRiverWidth.options[selRiverWidth.selectedIndex].value);

        setLastRiverWidth(defaultWidth);
        console_log("River width: " + defaultWidth);

        // 2013-10-20: Is limited or unlimited?
        var isUnlimitedSize = document.getElementById('_isUnlimitedSize');
        setLastIsUnlimitedSize(isUnlimitedSize.checked);


        // 2014-01-09: Search for helper street. If found create or expand a river
        for (var s=Waze.selectionManager._selectedFeatures.length-1; s>=0; s--) {
            var sel = Waze.selectionManager._selectedFeatures[s].model;
            if (sel.type == "segment" && sel.state == "Insert") {
                // found segment
                foundSelectedSegment = true;
                convertOK = convertToLandmark(sel, "H3010",isUnlimitedSize.checked);
            }
        }
        if (! foundSelectedSegment) {
            alert(getString(idNoUsavedStreet));
        }

    }


    // 2014-01-09: Base on selected helper street creates or expand an existing river/railway
    function convertToLandmark(sel, lmtype,isUnlimitedSize) {
        var i;
        var leftPa, rightPa, leftPb, rightPb;
        var prevLeftEq, prevRightEq;
        var street = getStreet(sel);

        var displacement = getDisplacement(street);
        var streetVertices = sel.geometry.getVertices();
        var polyPoints = null;
        var firstPolyPoint = null;
        var secondPolyPoint = null;

        var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry");
        var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
        var wazeActionAddLandmark = require("Waze/Action/AddLandmark");
        var wazeActionDeleteSegment = require("Waze/Action/DeleteSegment");

//        debugger;

        // 2016-06-10 Remove auto-added city from newly created river
        var UpdateSegmentAddress;
        try {
            UpdateSegmentAddress = require("Waze/Action/UpdateSegmentAddress");
        } catch (e) {}
        if (typeof(UpdateSegmentAddress) != "function") {
            UpdateSegmentAddress = require("Waze/Action/UpdateFeatureAddress");
        }

        //streetVertices = sel.attributes.geometry.getVertices();

        console_log("Street vertices: "+streetVertices.length);

        // 2013-10-13: Is new street inside an existing river?
        var bAddNew = !0;
        var riverLandmark=null;
        var repo = Waze.model.venues;

        for (var t in repo.objects)
        {
            riverLandmark =  repo.objects[t];

            if (riverLandmark.attributes.categories[0] === 'RIVER_STREAM')
            {

                // 2014-06-27: Veriy if the landkmark object has containsPoint function
                if ("function" === typeof riverLandmark.geometry.containsPoint){
                    if(riverLandmark.geometry.containsPoint(streetVertices[0])){
                        bAddNew = false;	// Street is inside an existing river
                        break;
                    }
                }
            }
        }

        // 2013-10-13: Ignore vertices inside river
        var bIsOneVerticeStreet = false;
        var firstStreetVerticeOutside = 0;
        if(!bAddNew){
            console_log("Expanding an existing river");
            while(firstStreetVerticeOutside < streetVertices.length){
                if(!riverLandmark.geometry.containsPoint(streetVertices[firstStreetVerticeOutside]))
                    break;
                firstStreetVerticeOutside += 1;
            }
            if(firstStreetVerticeOutside ===  streetVertices.length){
                alert(getString(idAllSegmentsInside));
                return false;
            }
            bIsOneVerticeStreet = firstStreetVerticeOutside === (streetVertices.length-1);
            if(bIsOneVerticeStreet){
                console_log("It's one vertice street");
            }
            if(firstStreetVerticeOutside > 1){
                alert(getString(idMultipleSegmentsInside));
                return false;
            }
            console_log("First street vertice outside river:" + firstStreetVerticeOutside);
        }


        // 2013-10-13: Add to polyPoints river polygon
        console_log("River polygon: Create");
        var first;
        if(bAddNew)
            first = 0;
        else
            first = firstStreetVerticeOutside - 1;

        for (i=first; i< streetVertices.length-1; i++)
        {
            var pa = streetVertices[i];
            var pb = streetVertices[i+1];
            var scale = (pa.distanceTo(pb) + displacement) / pa.distanceTo(pb);

            leftPa = pa.clone();
            leftPa.resize(scale, pb, 1);
            rightPa = leftPa.clone();
            leftPa.rotate(90,pa);
            rightPa.rotate(-90,pa);

            leftPb = pb.clone();
            leftPb.resize(scale, pa, 1);
            rightPb = leftPb.clone();
            leftPb.rotate(-90,pb);
            rightPb.rotate(90,pb);


            var leftEq = getEquation({ 'x1': leftPa.x, 'y1': leftPa.y, 'x2': leftPb.x, 'y2': leftPb.y });
            var rightEq = getEquation({ 'x1': rightPa.x, 'y1': rightPa.y, 'x2': rightPb.x, 'y2': rightPb.y });
            if (polyPoints === null) {
              	polyPoints = [ leftPa, rightPa ];
            }
            else {
                var li = intersectX(leftEq, prevLeftEq);
                var ri = intersectX(rightEq, prevRightEq);
                if (li && ri) {
                    // 2013-10-17: Is point outside river?
                    if(i>=firstStreetVerticeOutside){
                        polyPoints.unshift(li);
                        polyPoints.push(ri);

                        // 2013-10-17: Is first point outside river? -> Save it for later use
                        if(i==firstStreetVerticeOutside){
                            firstPolyPoint = li.clone();
                            secondPolyPoint = ri.clone();
            				polyPoints = [ li,ri   ];
                        }
                    }
                }
                else {
                    // 2013-10-17: Is point outside river?
                    if(i>=firstStreetVerticeOutside){
                        polyPoints.unshift(leftPb.clone());
                        polyPoints.push(rightPb.clone());

                        // 2013-10-17: Is first point outside river? -> Save it for later use
                        if(i==firstStreetVerticeOutside){
                            firstPolyPoint = leftPb.clone();
                            secondPolyPoint = rightPb.clone();
            				polyPoints = [ leftPb,rightPb   ];
                        }
                    }
                }
            }

            prevLeftEq = leftEq;
            prevRightEq = rightEq;

            // 2013-06-03: Is Waze limit reached?
            if( (polyPoints.length > 50) && !isUnlimitedSize){
                break;
            }
        }

        if(bIsOneVerticeStreet){
            firstPolyPoint = leftPb.clone();
            secondPolyPoint = rightPb.clone();
            polyPoints = [ leftPb,rightPb   ];
            console_log("One vertice river:"+polyPoints.length);
        }
        else{
            polyPoints.push(rightPb);
            polyPoints.push(leftPb);
        }
        console_log("River polygon: done");

        // 2014-01-09: Create or expand an existing river?
        if(bAddNew){
            // 2014-01-09: Add new river
            // 2014-01-09: Create new river's Polygon
            var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));

            // 2014-10-08: Creates river's Landmark
            riverLandmark = new wazefeatureVectorLandmark();
            riverLandmark.geometry = polygon;
            riverLandmark.attributes.categories.push("RIVER_STREAM");

            // 2014-01-09: Add river's name base on Street Name
            if (street) {
                riverLandmark.attributes.name = street.name.replace(/^\d+(m|ft)\s*/, '');
            }

            // 2014-10-08: Add new Landmark to Waze Editor
            Waze.model.actionManager.add(new wazeActionAddLandmark(riverLandmark));


            // 2016-06-10: Remove auto-added city from newly created river - by ruskinz
            var newRiver;
            for (var objs in repo.objects)
            {
                var currentId = 0;
                var segment = repo.objects[objs];
                if (segment.attributes.categories[0] === 'RIVER_STREAM' && segment.attributes.id <= -100)
                {
                    if (segment.attributes.id < currentId){
                        currentId = segment.attributes.id;
                        newRiver = segment;
                    }
                }
            }
            var riverStreet = newRiver.model.streets.get(newRiver.attributes.streetID);
            if (riverStreet !== null) {
                var cityId = riverStreet.cityID;
                if (cityId !== null) {
                    var city = Waze.model.cities.get(cityId);
                    if (newRiver.isGeometryEditable()){
                        Waze.model.actionManager.add(new UpdateSegmentAddress(newRiver, {countryID: city.countryID, stateID: city.stateID, emptyCity: true, emptyStreet: true}));
                    }
                }
            }
        }
        else{
            // 2014-01-09: Expand an existing river
            var originalGeometry = riverLandmark.geometry.clone();
            var riverVertices = riverLandmark.geometry.getVertices();
            console_log("Total river vertices:" + riverVertices.length);

            // 2013-06-01: Adjust first street vertice in case of a 2 vertice river
            if(firstStreetVerticeOutside===0)
                firstStreetVerticeOutside=1;


            // 2013-06-01: Find on selected river, the nearest point from the begining of road

            var distance=0;
            var minDistance = 100000;
            var indexNearestPolyPoint=0;
            for(i=0; i < polyPoints.length; i++){
                distance = polyPoints[i].distanceTo(streetVertices[firstStreetVerticeOutside]);
                if(distance < minDistance){
                    minDistance = distance;
                    indexNearestPolyPoint = i;
                }
            }
            console_log("polyPoints.length: " + polyPoints.length);
            console_log("indexNearestPolyPoint: " + indexNearestPolyPoint);

            var indexNearestRiverVertice=0;
            var nextIndex;
            minDistance = 100000;
            for(i=0; i < riverVertices.length; i++){
				nextIndex = getNextIndex(i,riverVertices.length,+1);
                if(isIntersectingLines(riverVertices[i],riverVertices[nextIndex],streetVertices[0],streetVertices[1])){
                    distance = polyPoints[indexNearestPolyPoint].distanceTo(riverVertices[i]);
                    if(distance< minDistance){
                        minDistance = distance;
                        indexNearestRiverVertice = i;
                    }
            	}
            }
            console_log("indexNearestRiverVertice: " + indexNearestRiverVertice);
            var nextRiverVertice = getNextIndex(indexNearestRiverVertice,riverVertices.length,1);



            // 2013-06-01: Is river's Polygon clockwise or counter-clockwise?


            console_log("indexNearestRiverVertice: " + indexNearestRiverVertice);
            console_log("nextRiverVertice: " + nextRiverVertice);

            console_log("firstPolyPoint:" + firstPolyPoint );
            console_log("secondPolyPoint:" + secondPolyPoint);

            var inc=1;
            var incIndex=0;
            if(isIntersectingLines(riverVertices[indexNearestRiverVertice],firstPolyPoint,riverVertices[nextRiverVertice], secondPolyPoint)){
                //inc = -1;
                console_log("Lines intersect: clockwise polygon" );
                inc = +1;
                incIndex=1;
            }
            else{
                inc = +1;
                console_log("Lines doesn't itersect: counter-clockwise polygon" );
            }


            // 2013-06-03: Update river's polygon (add new vertices)
           	indexLastPolyPoint =getNextIndex(index,polyPoints.length,-inc);
            var indexNextVertice=1;
            var index= polyPoints.length/2 - 1;

            if(bIsOneVerticeStreet)
                index +=1;

            for(i= 0; i < polyPoints.length; i++){
                if(!originalGeometry.containsPoint(polyPoints[index])){

                    // 2014-01-09: Save's old Landmark
                    var undoGeometry = riverLandmark.geometry.clone();

                    // 2014-01-09: Add a new point to existing river landmark
                    riverLandmark.geometry.components[0].addComponent(polyPoints[index],indexNearestRiverVertice+indexNextVertice);

                    // 2014-01-09: Update river landmark on Waze editor
                    // 2014-09-30: Gets UptdateFeatureGeometry
                    Waze.model.actionManager.add(new wazeActionUpdateFeatureGeometry(riverLandmark, Waze.model.venues,undoGeometry,riverLandmark.geometry));
                    //delete undoGeometry;

                    console_log("Added: " + index);
                    indexNextVertice+=incIndex;
                }
                index = getNextIndex(index,polyPoints.length,inc);
            }

            // 2013-06-03: Notify Waze that current river's geometry change.
        	//Waze.model.actionManager.add(new Waze.Action.UpdateFeatureGeometry(riverLandmark,Waze.model.landmarks,originalGeometry,riverLandmark.geometry));
            //delete originalGeometry;
        }

        // 2016-06-16: Remove road line - by ruskinz
        if (sel.isGeometryEditable()){
            Waze.model.actionManager.add(new wazeActionDeleteSegment(sel));
        }

        return true;
  }

    // 2013-06-02: Returns TRUE if line1 intersects lines2
    function isIntersectingLines(pointLine1From, pointLine1To, pointLine2From, pointLine2To){
        var segment1;
        var segment2;

        // 2013-06-02: OpenLayers.Geometry.segmentsIntersect requires that start and end are ordered so that x1 < x2.
        if(pointLine1From.x <=  pointLine1To.x)
            segment1 = { 'x1': pointLine1From.x, 'y1': pointLine1From.y, 'x2': pointLine1To.x, 'y2': pointLine1To.y };
        else
            segment1 = { 'x1': pointLine1To.x, 'y1': pointLine1To.y ,'x2': pointLine1From.x, 'y2': pointLine1From.y };

        if(pointLine2From.x <=  pointLine2To.x)
            segment2 = { 'x1': pointLine2From.x, 'y1': pointLine2From.y, 'x2': pointLine2To.x, 'y2': pointLine2To.y };
        else
            segment2 = { 'x1': pointLine2To.x, 'y1': pointLine2To.y ,'x2': pointLine2From.x, 'y2': pointLine2From.y };

        return OpenLayers.Geometry.segmentsIntersect(segment1,segment2,!1);
    }

    // 2013-06-02: Returns TRUE if polygon's direction is clockwise. FALSE -> counter-clockwise
    // Based on: http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
    function isClockwise(vertices,index,count){
        var total=0;
        var nextIndex;

        if(count > vertices.length)
            count = vertices.length;


        for(var i=0; i < vertices.length-1; i++){
            nextIndex = getNextIndex(index,vertices.length,+1);
            total += (vertices[nextIndex].x-vertices[index].x) * (vertices[nextIndex].y+vertices[index].y);
            index = nextIndex;
        }
        return total>=0;
    }

    // 2013-06-01: Increment/decrement index by 1
    function getNextIndex(index,length,inc){
        var next = index + inc;
        if(next == length)
            next = 0;
        if(next < 0)
            next = length-1;
        return next;
    }


    function getEquation(segment) {
        if (segment.x2 == segment.x1)
            return { 'x': segment.x1 };

        var slope =  (segment.y2 - segment.y1) / (segment.x2 - segment.x1);
        var offset = segment.y1 - (slope  * segment.x1);
        return { 'slope': slope, 'offset': offset };
    }

    //
    // line A: y = ax + b
    // line B: y = cx + b
    //
    // x = (d - b) / (a - c)
    function intersectX(eqa,eqb,defaultPoint) {
        if ("number" == typeof eqa.slope && "number" == typeof eqb.slope) {
            if (eqa.slope == eqb.slope)
                return null;

            var ix = (eqb.offset - eqa.offset) / (eqa.slope - eqb.slope);
            var iy = eqa.slope * ix + eqa.offset;
            return new OpenLayers.Geometry.Point(ix, iy);
        }
        else if ("number" == typeof eqa.x) {
            return new OpenLayers.Geometry.Point(eqa.x, eqb.slope * eqa.x + eqb.offset);
        }
            else if ("number" == typeof eqb.y) {
                return new OpenLayers.Geometry.Point(eqb.x, eqa.slope * eqb.x + eqa.offset);
            }
            return null;
    }


    function getStreet(segment) {
        if (! segment.attributes.primaryStreetID)
            return null;
        var street = segment.model.streets.get(segment.attributes.primaryStreetID);
        return street;
    }

    function getDisplacement(street) {
        if (!street)
            return defaultWidth;
        if (street.name.match(/^(\d+)m\b/))
            return parseInt(RegExp.$1);
        if (street.name.match(/^(\d+)ft\b/))
            return parseInt(RegExp.$1) * 0.3048;
        return defaultWidth;
    }

    // 2013-06-09: Save current river Width
    function setLastRiverWidth(riverWidth){
        if(typeof(Storage)!=="undefined"){
            // 2013-06-09: Yes! localStorage and sessionStorage support!
            sessionStorage.riverWidth=Number(riverWidth);
         }
         else{
           // Sorry! No web storage support..
           console_log("No web storage support");
         }
    }

    // 2013-06-09: Returns last saved river width
    function getLastRiverWidth(defaultRiverWidth){
        if(typeof(Storage)!=="undefined"){
            // 2013-06-09: Yes! localStorage and sessionStorage support!
            if(sessionStorage.riverWidth)
            	return Number(sessionStorage.riverWidth);
            else
                return Number(defaultRiverWidth);	// Default river width
         }
         else{
           // Sorry! No web storage support..
           return Number(defaultRiverWidth);	// Default river width
         }
    }

    // 2013-10-20: Save current unlimited size preference
    function setLastIsUnlimitedSize(isUnlimitedSize){
        if(typeof(Storage)!=="undefined"){
            // 2013-06-09: Yes! localStorage and sessionStorage support!
            sessionStorage.isUnlimitedSize=Number(isUnlimitedSize);
         }
         else{
           // Sorry! No web storage support..
           console_log("No web storage support");
         }
    }

    // 2013-10-20: Returns last saved unlimite size preference
    function getLastIsUnlimitedSize(defaultValue){
        if(typeof(Storage)!=="undefined"){
            // 2013-10-20: Yes! localStorage and sessionStorage support!
            if(sessionStorage.isUnlimitedSize)
            	return Number(sessionStorage.isUnlimitedSize);
            else
                return Number(defaultValue);	// Default preference
         }
         else{
           // Sorry! No web storage support..
           return Number(defaultValue);	// Default preference
         }
    }

    // 2014-06-05: Returns WME interface language
    function getLanguage(){
        var wmeLanguage;
        var urlParts;

        urlParts = location.pathname.split("/");
        wmeLanguage = urlParts[1].toLowerCase();
        if (wmeLanguage==="editor")
            wmeLanguage = "us";

        return wmeLanguage;

    }


    // 2014-06-05: Returns WME interface language
    function isBetaEditor(){
        var wmeEditor;

        wmeEditor = location.host.toLowerCase();

        return wmeEditor==="editor-beta.waze.com";

    }

    // 2014-06-05: Translate text to different languages
    function intLanguageStrings(){
        switch(getLanguage()){
            case "es":		// 2014-06-05: Spanish
            case "es-419":
                langText = new Array("metros","Ancho","Cree una nueva calle, selecciónela y oprima este botón.","Calle a Río","Tamaño ilimitado",
                                     "¡No se encontró una calle sin guardar!","Todos los segmentos de la calle adentro del río. No se puede continuar.",
                                     "Múltiples segmentos de la calle dentro del río. No se puede continuar");
                break;
            case "fr":		// 2014-06-05: French
                langText = new Array("mètres","Largura","Crie uma nova rua, a selecione e clique neste botão.","Rue á rivière","Taille illimitée (dangereux)",
                                     "Pas de nouvelle rue non enregistré trouvée!","Tous les segments de la rue dans la rivière. Vous ne pouvez pas continuer.",
                                     "Plusieurs segments de rues à l'intérieur de la rivière. Vous ne pouvez pas continuer.");
                break;
            case "ru":		// 2014-06-05: Russian
                langText = new Array("метров","Ширина","Создайте новую дорогу (не сохраняйте), выберите ее и нажмите эту кнопку.","Дорога в реку","Неограниченная длина (небезопасно)",
                                     "Не выделено ни одной не сохранённой дороги!","Все сегменты дороги находятся внутри реки. Преобразование невозможно.",
                                     "Слишком много сегментов дороги находится внутри реки. Преобразование невозможно.");
                break;
            case "hu":		// 2014-07-02: Hungarian
                langText = new Array("méter","Szélesség","Hozzon létre egy új utcát, válassza ki, majd kattintson erre a gombra.","Utcából folyó","Korlátlan méretű (nem biztonságos)",
                                     "Nem található nem mentett és kiválasztott új utca!","Az útszakasz a folyón belül található! Nem lehet folytatni.",
                                     "Minden útszakasz a folyón belül található! Nem lehet folytatni.");
                break;
			case "cs":		// 2014-07-03: Czech
				langText = new Array("metrů","Šířka","Vytvořte osu řeky, vyberte segment a stiskněte toto tlačítko.","Silnice na řeku","Neomezená šířka (nebezpečné)",
                                     "Nebyly vybrány žádné neuložené segmenty!","Všechny segmenty jsou uvnitř řeky! Nelze pokračovat.",
                                     "Uvnitř řeky je více segmentů! Nelze pokračovat.");
                break;
			case "pl":		// 2014-11-08: Polish - By Zniwek
				langText = new Array("metrów","Szerokość","Stwórz ulicę, wybierz ją i kliknij ten przycisk.","Ulica w Rzekę","Nieskończony rozmiar (niebezpieczne)",
                                     "Nie znaleziono nowej i niezapisanej ulicy!","Wszystkie segmenty ulicy wewnątrz rzeki. Nie mogę kontynuować.",
                                     "Wiele segmentów ulicy wewnątrz rzeki. Nie mogę kontynuować.");
                break;
            case "pt-br":// 2015-04-05: Portuguese - By esmota
                langText = new Array("metros","Largura","Criar uma nova rua, selecione e clique neste botão.","Rua para Rio","Comprimento ilimitado (instável)",
                                     "Nenhuma nova rua, sem salvar, selecionada!","Todos os segmentos de rua estão dentro de um rio. Nada a fazer.",
                                     "Múltiplos segmentos de rua dentro de um rio. Impossível continuar.");
                break;
			case "it":		// 2016-06-06: Italian - By savex67
                langText = new Array("metri","Larghezza","Crea un nuovo segmento, selezionalo (senza salvarlo) e clicca su questo bottone.","Da strada a fiume","Larghezza illimitata (non usare)",
                                     "Nessun nuovo segmento (non salvato) selezionato","I segmenti selezionati sono già all'interno di un fiume. Non puoi continuare.",
                                     "I segmenti selezionati sono in parte già all'interno di un fiume. Non puoi continuare.");
                break;
            case "sk":      // 2016-06-15: Slovak - By Turrican7
                langText = new Array("metrov","Šírka","Vytvorte os rieky, označte segment a stlačte toto tlačítko.","Cesta na rieku","Neobmedzená šírka (nebezpečné)",
                                     "Nebol označený žiadny neuložený segment!","Všetky segmenty sú vo vnútri rieky! Nie je možné pokračovať.",
                                     "Vo vnútri rieky je viacero segmentov! Nie je možné pokračovať.");
                break;
            default:		// 2014-06-05: English
                langText = new Array("meters","Width","Create a new street, select and click this button.","Street to River","Unlimited size (unsafe)",
                                     "No unsaved and selected new street found!","All street segments inside river. Cannot continue.",
                                     "Multiple street segments inside river. Cannot continue.");
        }
    }

    // 2014-06-05: Returns the translated  string to current language, if the language is not recognized assumes English
    function getString(stringID){
        return langText[stringID];
    }

    function console_log(msg) {
        //if (console.log)
        // 2013-05-19: Alternate method to valided console object
        if(typeof console != "undefined")
            console.log(msg);
    }

    //debugger;

    // 2014-06-05: Get interface language
    scriptLanguage = getLanguage();
    intLanguageStrings();
    Waze.selectionManager.events.register("selectionchanged", null, insertButtons);

}
//debugger;
//streetToRiver_bootstrap();
setTimeout(streetToRiver_bootstrap, 3000);


