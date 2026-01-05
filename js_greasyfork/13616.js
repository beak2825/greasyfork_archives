// ==UserScript==
// @name        WME Preferred Layers
// @namespace   
// @description Stores and resets Preferred Layers
// @include     https://www.waze.com/*/editor/*
// @include     https://www.waze.com/editor/*
// @include     https://editor-beta.waze.com/*
// @version     0.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13616/WME%20Preferred%20Layers.user.js
// @updateURL https://update.greasyfork.org/scripts/13616/WME%20Preferred%20Layers.meta.js
// ==/UserScript==

(function() {
	

//wim//
//wim//var idMeters  = 0;
//wim//var idWidth = 1;
//wim//var idTitle = 2;
//wim//var idStreetToRiver = 3;
//wim//var idUnlimitedSize=4
//wim//var idNoUsavedStreet=5
//wim//var idAllSegmentsInside=6
//wim//var idMultipleSegmentsInside=7


	function WPL_Bootstrap() {
		var bGreasemonkeyServiceDefined = false;

		try
		{
			if ("object" === typeof Components.interfaces.gmIGreasemonkeyService)
			{
				bGreasemonkeyServiceDefined = true;
			}
		}
		catch (err)
		{
			//Ignore.
		}
		if ( "undefined" === typeof unsafeWindow  ||  ! bGreasemonkeyServiceDefined)
		{
			unsafeWindow    = ( function ()
			{
				var dummyElem   = document.createElement('p');
				dummyElem.setAttribute ('onclick', 'return window;');
				return dummyElem.onclick ();
			} ) ();
		}
		/* begin running the code! */
		setTimeout(WPL_init,999);
	}

function WPL_init() {
//wim//    var defaultWidth = 20;
//wim//    var scriptLanguage = "us";
//wim//    var langText;
//wim//    
//wim//    function insertButtons() {
//wim//        if(Waze.selectionManager.selectedItems.length === 0) return;
//wim//        
//wim//        try{
//wim//            if(document.getElementById('WPL') !== null) return;
//wim//        }
//wim//        catch(e){ }
//wim//        
//wim//        
//wim//        // 2014-01-09: Add Create River and Create Railway buttons
//wim//        var btn1 = $('<button class="btn btn-primary" title="' + getString(idTitle) + '">' + getString(idStreetToRiver) + '</button>');
//wim//        btn1.click(doRiver);
//wim//        
//wim//        var strMeters =  getString(idMeters);
//wim//        
//wim//        // 2014-01-09: Add River Width Combobox
//wim//        var selRiverWidth = $('<select id="riverWidth" data-type="numeric" class="form-control" />');  
//wim//        selRiverWidth.append( $('<option value="5"> 5 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="8"> 8 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="10">10 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="15">15 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="20">20 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="25">25 ' + strMeters + '</option>') );
//wim//        selRiverWidth.append( $('<option value="30">30 ' + strMeters + '</option>') );
//wim//        
//wim//        
//wim//        // 2014-01-09: Add Unlimited size river with checkbox 
//wim//        var chk = $('<label class="checkbox"><input type="checkbox" id="_isUnlimitedSize">' + getString(idUnlimitedSize) + '</label>');
//wim//        
//wim//
//wim//        // 2014-01-09: Add streetToRiver section with new HTML controls
//wim//        var cnt = $('<section id="WPL" />');
//wim//        
//wim//        // 2014-01-09: Add River width to section
//wim//        var divGroup1 = $('<div class="form-group" />');
//wim//        divGroup1.append( $('<label class="col-xs-4">' + getString(idWidth) + ':</label>') );
//wim//        var divControls1 = $('<div class="col-xs-8 controls" />');
//wim//        divControls1.append(selRiverWidth);
//wim//        divControls1.append(chk);
//wim//        divGroup1.append(divControls1);
//wim//        cnt.append(divGroup1);
//wim//
//wim//        // 2014-01-09: Add river buttons to section
//wim//        var divGroup2 = $('<div class="form-group"/>');
//wim//        divGroup2.append( $('<label class="col-xs-4">&nbsp;</label>') );
//wim//        var divControls2 = $('<div class="col-xs-8 controls" />');
//wim//        divControls2.append(btn1);
//wim//        divGroup2.append(divControls2);
//wim//        cnt.append(divGroup2);
//wim//        
//wim//        // 2014-01-09: Add Script version to section.
//wim//        var divGroup3 = $('<div class="form-group"/>');
//wim//        divGroup3.append( $('<label class="control-label"></label>') );
//wim//        var divControls3 = $('<div class="controls"/>');
//wim//        divControls3.append( $('<label class="checkbox"><a href="https://www.waze.com/forum/viewtopic.php?f=819&t=87931" target="_blank">Street to River+</a> ' + version + '</label>') );
//wim//        divGroup3.append(divControls3);
//wim//        cnt.append(divGroup3);
//wim//        
//wim//        
//wim//        $("#segment-edit-general").append(cnt);
//wim//        
//wim//        
//wim//        // 2013-06-09: Select last river width
//wim//        var lastRiverWidth = getLastRiverWidth(20);
//wim//        console_log("Last river width: " + lastRiverWidth);
//wim//        var selRiverWidth = document.getElementById('riverWidth');
//wim//        if(selRiverWidth!=null){
//wim//            for(var i=0; i < selRiverWidth.options.length; i++){
//wim//                if(selRiverWidth.options[i].value == lastRiverWidth){
//wim//                    selRiverWidth.selectedIndex = i;
//wim//                    break;
//wim//                }
//wim//            }
//wim//        }
//wim//        
//wim//        // 2013-10-20: Last time user select unlimited size?
//wim//        var isUnlimitedSize = document.getElementById('_isUnlimitedSize')
//wim//        if(isUnlimitedSize!=null){
//wim//            isUnlimitedSize.checked = getLastIsUnlimitedSize(false);
//wim//        }
//wim//        
//wim//
//wim//        console_log("Street to River Language: " + scriptLanguage);
//wim//        console_log("Street to river PLUS initialized");
    }
    
    
//wim//    // 2014-01-09: Process River Button
//wim//    function doRiver(ev) {
//wim//        var convertOK;
//wim//        var foundSelectedSegment = false;
//wim//      
//wim//        // 2013-10-20: Get river's width
//wim//        var selRiverWidth = document.getElementById('riverWidth');
//wim//        defaultWidth = parseInt(selRiverWidth.options[selRiverWidth.selectedIndex].value);
//wim//               
//wim//        setLastRiverWidth(defaultWidth);
//wim//        console_log("River width: " + defaultWidth);        
//wim//        
//wim//        // 2013-10-20: Is limited or unlimited?
//wim//        var isUnlimitedSize = document.getElementById('_isUnlimitedSize');
//wim//        setLastIsUnlimitedSize(isUnlimitedSize.checked);
//wim//
//wim//        
//wim//        // 2014-01-09: Search for helper street. If found create or expand a river
//wim//        for (var s=Waze.selectionManager.selectedItems.length-1; s>=0; s--) {
//wim//            var sel = Waze.selectionManager.selectedItems[s].model;
//wim//            if (sel.type == "segment" && sel.state == "Insert") {
//wim//                // found segment
//wim//                foundSelectedSegment = true;
//wim//                convertOK = convertToLandmark(sel, "H3010",isUnlimitedSize.checked);
//wim//            }
//wim//        }
//wim//        if (! foundSelectedSegment) {
//wim//            alert(getString(idNoUsavedStreet));
//wim//        }
//wim//
//wim//    }
//wim//    
//wim//    
//wim//    // 2014-01-09: Base on selected helper street creates or expand an existing river/railway
//wim//    function convertToLandmark(sel, lmtype,isUnlimitedSize) {
//wim//        var leftPa, rightPa, leftPb, rightPb;
//wim//        var prevLeftEq, prevRightEq;
//wim//        var street = getStreet(sel);
//wim//
//wim//        var displacement = getDisplacement(street);
//wim//        var streetVertices = sel.geometry.getVertices();
//wim//        var polyPoints = null;
//wim//        var firstPolyPoint = null;
//wim//        var secondPolyPoint = null;
//wim//
//wim//        var wazeActionUpdateFeatureGeometry = require("Waze/Action/UpdateFeatureGeometry")
//wim//        var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");
//wim//        var wazeActionAddLandmark = require("Waze/Action/AddLandmark");
//wim//        
//wim//        //streetVertices = sel.attributes.geometry.getVertices();
//wim//       
//wim//        console_log("Street vertices: "+streetVertices.length);
//wim//        
//wim//        // 2013-10-13: Is new street inside an existing river?
//wim//        var bAddNew = !0;
//wim//        var riverLandmark=null;
//wim//        var repo = Waze.model.venues;
//wim//        
//wim//        for (var t in repo.objects) 
//wim//        {
//wim//            riverLandmark =  repo.objects[t];                        
//wim//            
//wim//            // 2014-06-27: Veriy if the landkmark object has containsPoint function
//wim//            if ("function" === typeof riverLandmark.geometry.containsPoint){
//wim//                if(riverLandmark.geometry.containsPoint(streetVertices[0])){
//wim//                    bAddNew = false;	// Street is inside an existing river
//wim//                    break;
//wim//                }
//wim//            }
//wim//        }
//wim//        
//wim//        // 2013-10-13: Ignore vertices inside river
//wim//        var bIsOneVerticeStreet = false;
//wim//        var firstStreetVerticeOutside = 0;
//wim//        if(!bAddNew){
//wim//            console_log("Expanding an existing river");
//wim//            while(firstStreetVerticeOutside < streetVertices.length){
//wim//                if(!riverLandmark.geometry.containsPoint(streetVertices[firstStreetVerticeOutside]))
//wim//                    break;
//wim//                firstStreetVerticeOutside += 1;                
//wim//            }
//wim//            if(firstStreetVerticeOutside ===  streetVertices.length){
//wim//                alert(getString(idAllSegmentsInside));
//wim//                return false;
//wim//            }
//wim//            bIsOneVerticeStreet = firstStreetVerticeOutside === (streetVertices.length-1);
//wim//            if(bIsOneVerticeStreet){
//wim//                console_log("It's one vertice street");                
//wim//            }
//wim//            if(firstStreetVerticeOutside > 1){
//wim//                alert(getString(idMultipleSegmentsInside));       
//wim//                return false;
//wim//            }
//wim//            console_log("First street vertice outside river:" + firstStreetVerticeOutside);
//wim//        }
//wim//        
//wim//        
//wim//        // 2013-10-13: Add to polyPoints river polygon
//wim//        console_log("River polygon: Create");
//wim//        var first;
//wim//        if(bAddNew)
//wim//            first = 0;
//wim//        else
//wim//            first = firstStreetVerticeOutside - 1;
//wim//        
//wim//        for (var i=first; i< streetVertices.length-1; i++)
//wim//        {
//wim//            var pa = streetVertices[i];
//wim//            var pb = streetVertices[i+1];
//wim//            var scale = (pa.distanceTo(pb) + displacement) / pa.distanceTo(pb);
//wim//            
//wim//            leftPa = pa.clone();
//wim//            leftPa.resize(scale, pb, 1);
//wim//            rightPa = leftPa.clone();
//wim//            leftPa.rotate(90,pa);
//wim//            rightPa.rotate(-90,pa);
//wim//            
//wim//            leftPb = pb.clone();
//wim//            leftPb.resize(scale, pa, 1);
//wim//            rightPb = leftPb.clone();
//wim//            leftPb.rotate(-90,pb);
//wim//            rightPb.rotate(90,pb);
//wim//            
//wim//            
//wim//            var leftEq = getEquation({ 'x1': leftPa.x, 'y1': leftPa.y, 'x2': leftPb.x, 'y2': leftPb.y });
//wim//            var rightEq = getEquation({ 'x1': rightPa.x, 'y1': rightPa.y, 'x2': rightPb.x, 'y2': rightPb.y });
//wim//            if (polyPoints == null) {
//wim//              	polyPoints = [ leftPa, rightPa ];
//wim//            }
//wim//            else {
//wim//                var li = intersectX(leftEq, prevLeftEq);
//wim//                var ri = intersectX(rightEq, prevRightEq);
//wim//                if (li && ri) {
//wim//                    // 2013-10-17: Is point outside river?
//wim//                    if(i>=firstStreetVerticeOutside){
//wim//                        polyPoints.unshift(li);
//wim//                        polyPoints.push(ri);
//wim//                        
//wim//                        // 2013-10-17: Is first point outside river? -> Save it for later use
//wim//                        if(i==firstStreetVerticeOutside){
//wim//                            firstPolyPoint = li.clone();
//wim//                            secondPolyPoint = ri.clone();
//wim//            				polyPoints = [ li,ri   ]
//wim//                        }
//wim//                    }
//wim//                }
//wim//                else {
//wim//                    // 2013-10-17: Is point outside river?
//wim//                    if(i>=firstStreetVerticeOutside){
//wim//                        polyPoints.unshift(leftPb.clone());
//wim//                        polyPoints.push(rightPb.clone());
//wim//
//wim//                        // 2013-10-17: Is first point outside river? -> Save it for later use
//wim//                        if(i==firstStreetVerticeOutside){
//wim//                            firstPolyPoint = leftPb.clone();
//wim//                            secondPolyPoint = rightPb.clone();
//wim//            				polyPoints = [ leftPb,rightPb   ]
//wim//                        }
//wim//                    }
//wim//                }
//wim//            }
//wim//            
//wim//            prevLeftEq = leftEq;
//wim//            prevRightEq = rightEq;
//wim//            
//wim//            // 2013-06-03: Is Waze limit reached?
//wim//            if( (polyPoints.length > 50) && !isUnlimitedSize){         
//wim//                break;
//wim//            }
//wim//        }
//wim//        
//wim//        if(bIsOneVerticeStreet){
//wim//            firstPolyPoint = leftPb.clone();
//wim//            secondPolyPoint = rightPb.clone();
//wim//            polyPoints = [ leftPb,rightPb   ]
//wim//            console_log("One vertice river:"+polyPoints.length);
//wim//        }
//wim//        else{
//wim//            polyPoints.push(rightPb);
//wim//            polyPoints.push(leftPb);
//wim//        }
//wim//        console_log("River polygon: done");
//wim//             
//wim//        // 2014-01-09: Create or expand an existing river?
//wim//        if(bAddNew){
//wim//            // 2014-01-09: Add new river
//wim//            // 2014-01-09: Create new river's Polygon
//wim//            var polygon = new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));
//wim//            
//wim//            // 2014-10-08: Creates river's Landmark
//wim//            riverLandmark = new wazefeatureVectorLandmark()
//wim//            riverLandmark.geometry = polygon
//wim//            riverLandmark.attributes.categories = ["RIVER_STREAM"]
//wim//            
//wim//            // 2014-01-09: Add river's name base on Street Name
//wim//            if (street) {
//wim//                riverLandmark.attributes.name = street.name.replace(/^\d+(m|ft)\s*/, '');
//wim//            }
//wim//            
//wim//            // 2014-10-08: Add new Landmark to Waze Editor
//wim//            Waze.model.actionManager.add(new wazeActionAddLandmark(riverLandmark));
//wim//        }
//wim//        else{
//wim//            // 2014-01-09: Expand an existing river
//wim//            var i;
//wim//            var originalGeometry = riverLandmark.geometry.clone();
//wim//            var riverVertices = riverLandmark.geometry.getVertices();
//wim//            console_log("Total river vertices:" + riverVertices.length);
//wim//            
//wim//            // 2013-06-01: Adjust first street vertice in case of a 2 vertice river
//wim//            if(firstStreetVerticeOutside==0)
//wim//                firstStreetVerticeOutside=1;
//wim//
//wim//
//wim//            // 2013-06-01: Find on selected river, the nearest point from the begining of road
//wim//                    
//wim//            var distance=0;
//wim//            var minDistance = 100000;           
//wim//            var indexNearestPolyPoint=0;
//wim//            for(i=0; i < polyPoints.length; i++){
//wim//                distance = polyPoints[i].distanceTo(streetVertices[firstStreetVerticeOutside])
//wim//                if(distance < minDistance){
//wim//                    minDistance = distance;
//wim//                    indexNearestPolyPoint = i;
//wim//                }
//wim//            }
//wim//            console_log("polyPoints.length: " + polyPoints.length);
//wim//            console_log("indexNearestPolyPoint: " + indexNearestPolyPoint);
//wim//                
//wim//            var indexNearestRiverVertice=0;
//wim//            var nextIndex;
//wim//            minDistance = 100000; 
//wim//            for(i=0; i < riverVertices.length; i++){
//wim//				nextIndex = getNextIndex(i,riverVertices.length,+1);
//wim//                if(isIntersectingLines(riverVertices[i],riverVertices[nextIndex],streetVertices[0],streetVertices[1])){
//wim//                    distance = polyPoints[indexNearestPolyPoint].distanceTo(riverVertices[i]);
//wim//                    if(distance< minDistance){
//wim//                        minDistance = distance;
//wim//                        indexNearestRiverVertice = i;
//wim//                    }
//wim//            	}
//wim//            }
//wim//            console_log("indexNearestRiverVertice: " + indexNearestRiverVertice);
//wim//            var nextRiverVertice = getNextIndex(indexNearestRiverVertice,riverVertices.length,1);
//wim//                                   
//wim//            
//wim//            
//wim//            // 2013-06-01: Is river's Polygon clockwise or counter-clockwise?
//wim//                      
//wim//            
//wim//            console_log("indexNearestRiverVertice: " + indexNearestRiverVertice);
//wim//            console_log("nextRiverVertice: " + nextRiverVertice);
//wim//            
//wim//            console_log("firstPolyPoint:" + firstPolyPoint );
//wim//            console_log("secondPolyPoint:" + secondPolyPoint);
//wim//            
//wim//            var inc=1;
//wim//            var incIndex=0;
//wim//            if(isIntersectingLines(riverVertices[indexNearestRiverVertice],firstPolyPoint,riverVertices[nextRiverVertice], secondPolyPoint)){
//wim//                //inc = -1;
//wim//                console_log("Lines intersect: clockwise polygon" );
//wim//                inc = +1;
//wim//                incIndex=1;
//wim//            }
//wim//            else{
//wim//                inc = +1;
//wim//                console_log("Lines doesn't itersect: counter-clockwise polygon" );
//wim//            }
//wim//            
//wim//            
//wim//            // 2013-06-03: Update river's polygon (add new vertices)
//wim//           	indexLastPolyPoint =getNextIndex(index,polyPoints.length,-inc);
//wim//            var indexNextVertice=1;
//wim//            var index= polyPoints.length/2 - 1;
//wim//            
//wim//            if(bIsOneVerticeStreet)
//wim//                index +=1;
//wim//            
//wim//            for(i= 0; i < polyPoints.length; i++){
//wim//                if(!originalGeometry.containsPoint(polyPoints[index])){
//wim//                    
//wim//                    // 2014-01-09: Save's old Landmark 
//wim//                    var undoGeometry = riverLandmark.geometry.clone();
//wim//                    
//wim//                    // 2014-01-09: Add a new point to existing river landmark
//wim//                    riverLandmark.geometry.components[0].addComponent(polyPoints[index],indexNearestRiverVertice+indexNextVertice);
//wim//                    
//wim//                    // 2014-01-09: Update river landmark on Waze editor
//wim//                    // 2014-09-30: Gets UptdateFeatureGeometry
//wim//                    Waze.model.actionManager.add(new wazeActionUpdateFeatureGeometry(riverLandmark, Waze.model.venues,undoGeometry,riverLandmark.geometry));
//wim//                    delete undoGeometry;
//wim//                    
//wim//                    console_log("Added: " + index);
//wim//                    indexNextVertice+=incIndex;
//wim//                }
//wim//                index = getNextIndex(index,polyPoints.length,inc);
//wim//            }
//wim//
//wim//            // 2013-06-03: Notify Waze that current river's geometry change.
//wim//        	//Waze.model.actionManager.add(new Waze.Action.UpdateFeatureGeometry(riverLandmark,Waze.model.landmarks,originalGeometry,riverLandmark.geometry));
//wim//            //delete originalGeometry;
//wim//        }
//wim//      return true;
//wim//  }
//wim//    
//wim//    // 2013-06-02: Returns TRUE if line1 intersects lines2
//wim//    function isIntersectingLines(pointLine1From, pointLine1To, pointLine2From, pointLine2To){
//wim//        var segment1;
//wim//        var segment2;
//wim//        
//wim//        // 2013-06-02: OpenLayers.Geometry.segmentsIntersect requires that start and end are ordered so that x1 < x2.
//wim//        if(pointLine1From.x <=  pointLine1To.x)
//wim//            segment1 = { 'x1': pointLine1From.x, 'y1': pointLine1From.y, 'x2': pointLine1To.x, 'y2': pointLine1To.y };
//wim//        else
//wim//            segment1 = { 'x1': pointLine1To.x, 'y1': pointLine1To.y ,'x2': pointLine1From.x, 'y2': pointLine1From.y };
//wim//        
//wim//        if(pointLine2From.x <=  pointLine2To.x)
//wim//            segment2 = { 'x1': pointLine2From.x, 'y1': pointLine2From.y, 'x2': pointLine2To.x, 'y2': pointLine2To.y };
//wim//        else
//wim//            segment2 = { 'x1': pointLine2To.x, 'y1': pointLine2To.y ,'x2': pointLine2From.x, 'y2': pointLine2From.y };
//wim//        
//wim//        return OpenLayers.Geometry.segmentsIntersect(segment1,segment2,!1);
//wim//    }
//wim//    
//wim//    // 2013-06-02: Returns TRUE if polygon's direction is clockwise. FALSE -> counter-clockwise
//wim//    // Based on: http://stackoverflow.com/questions/1165647/how-to-determine-if-a-list-of-polygon-points-are-in-clockwise-order
//wim//    function isClockwise(vertices,index,count){
//wim//        var total=0;
//wim//        var nextIndex;
//wim//        
//wim//        if(count > vertices.length)
//wim//            count = vertices.length;
//wim//        
//wim//        
//wim//        for(var i=0; i < vertices.length-1; i++){
//wim//            nextIndex = getNextIndex(index,vertices.length,+1);
//wim//            total += (vertices[nextIndex].x-vertices[index].x) * (vertices[nextIndex].y+vertices[index].y)
//wim//            index = nextIndex;
//wim//        }
//wim//        return total>=0;
//wim//    }
//wim//    
//wim//    // 2013-06-01: Increment/decrement index by 1
//wim//    function getNextIndex(index,length,inc){
//wim//        var next = index + inc
//wim//        if(next == length)
//wim//            next = 0;
//wim//        if(next < 0)
//wim//            next = length-1;
//wim//        return next;
//wim//    }
//wim//    
//wim//    
//wim//    function getEquation(segment) {
//wim//        if (segment.x2 == segment.x1)
//wim//            return { 'x': segment.x1 };
//wim//        
//wim//        var slope =  (segment.y2 - segment.y1) / (segment.x2 - segment.x1);
//wim//        var offset = segment.y1 - (slope  * segment.x1)
//wim//        return { 'slope': slope, 'offset': offset };
//wim//    }
//wim//    
//wim//    //
//wim//    // line A: y = ax + b
//wim//    // line B: y = cx + b
//wim//    //
//wim//    // x = (d - b) / (a - c)
//wim//    function intersectX(eqa,eqb,defaultPoint) {
//wim//        if ("number" == typeof eqa.slope && "number" == typeof eqb.slope) {
//wim//            if (eqa.slope == eqb.slope)
//wim//                return null;
//wim//            
//wim//            var ix = (eqb.offset - eqa.offset) / (eqa.slope - eqb.slope);
//wim//            var iy = eqa.slope * ix + eqa.offset;
//wim//            return new OpenLayers.Geometry.Point(ix, iy);
//wim//        }
//wim//        else if ("number" == typeof eqa.x) {
//wim//            return new OpenLayers.Geometry.Point(eqa.x, eqb.slope * eqa.x + eqb.offset);
//wim//        }
//wim//            else if ("number" == typeof eqb.y) {
//wim//                return new OpenLayers.Geometry.Point(eqb.x, eqa.slope * eqb.x + eqa.offset);
//wim//            }
//wim//            return null;
//wim//    }
//wim//    
//wim//    
//wim//    function getStreet(segment) {
//wim//        if (! segment.attributes.primaryStreetID)
//wim//            return null;
//wim//        var street = segment.model.streets.get(segment.attributes.primaryStreetID)
//wim//        return street;
//wim//    }
//wim//    
//wim//    function getDisplacement(street) {
//wim//        if (!street)
//wim//            return defaultWidth;
//wim//        if (street.name.match(/^(\d+)m\b/))
//wim//            return parseInt(RegExp.$1);
//wim//        if (street.name.match(/^(\d+)ft\b/))
//wim//            return parseInt(RegExp.$1) * 0.3048;
//wim//        return defaultWidth;
//wim//    }
//wim//
//wim//    // 2013-06-09: Save current river Width    
//wim//    function setLastRiverWidth(riverWidth){
//wim//        if(typeof(Storage)!=="undefined"){
//wim//            // 2013-06-09: Yes! localStorage and sessionStorage support!
//wim//            sessionStorage.riverWidth=Number(riverWidth)
//wim//         }
//wim//         else{
//wim//           // Sorry! No web storage support..
//wim//           console_log("No web storage support"); 
//wim//         }
//wim//    }
//wim//    
//wim//    // 2013-06-09: Returns last saved river width
//wim//    function getLastRiverWidth(defaultRiverWidth){
//wim//        if(typeof(Storage)!=="undefined"){
//wim//            // 2013-06-09: Yes! localStorage and sessionStorage support!
//wim//            if(sessionStorage.riverWidth)
//wim//            	return Number(sessionStorage.riverWidth);
//wim//            else
//wim//                return Number(defaultRiverWidth);	// Default river width
//wim//         }
//wim//         else{
//wim//           // Sorry! No web storage support..
//wim//           return Number(defaultRiverWidth);	// Default river width
//wim//         }        
//wim//    }
//wim//
//wim//    // 2013-10-20: Save current unlimited size preference
//wim//    function setLastIsUnlimitedSize(isUnlimitedSize){
//wim//        if(typeof(Storage)!=="undefined"){
//wim//            // 2013-06-09: Yes! localStorage and sessionStorage support!
//wim//            sessionStorage.isUnlimitedSize=Number(isUnlimitedSize)
//wim//         }
//wim//         else{
//wim//           // Sorry! No web storage support..
//wim//           console_log("No web storage support"); 
//wim//         }
//wim//    }
//wim//    
//wim//    // 2013-10-20: Returns last saved unlimite size preference
//wim//    function getLastIsUnlimitedSize(defaultValue){
//wim//        if(typeof(Storage)!=="undefined"){
//wim//            // 2013-10-20: Yes! localStorage and sessionStorage support!
//wim//            if(sessionStorage.isUnlimitedSize)
//wim//            	return Number(sessionStorage.isUnlimitedSize);
//wim//            else
//wim//                return Number(defaultValue);	// Default preference
//wim//         }
//wim//         else{
//wim//           // Sorry! No web storage support..
//wim//           return Number(defaultValue);	// Default preference
//wim//         }        
//wim//    }
//wim//    
//wim//    // 2014-06-05: Returns WME interface language
//wim//    function getLanguage(){
//wim//        var wmeLanguage;
//wim//        var urlParts;
//wim//        
//wim//        urlParts = location.pathname.split("/");
//wim//        wmeLanguage = urlParts[1].toLowerCase();
//wim//        if (wmeLanguage==="editor")
//wim//            wmeLanguage = "us";
//wim//        
//wim//        return wmeLanguage;
//wim//        
//wim//    }
    

    // 2014-06-05: Returns WME interface language
    function isBetaEditor(){
        var wmeEditor;
        
        wmeEditor = location.host.toLowerCase();
        
        return wmeEditor==="editor-beta.waze.com";
        
    }
    
//wim//   // 2014-06-05: Translate text to different languages
//wim//   function intLanguageStrings(){
//wim//       switch(getLanguage()){
//wim//           case "es":		// 2014-06-05: Spanish
//wim//           case "es-419":
//wim//               langText = new Array("metros","Ancho","Cree una nueva calle, selecciónela y oprima este botón.","Calle a Río","Tamaño ilimitado",
//wim//                                    "¡No se encontró una calle sin guardar!","Todos los segmentos de la calle adentro del río. No se puede continuar.",
//wim//                                    "Múltiples segmentos de la calle dentro del río. No se puede continuar");
//wim//               break;
//wim//           case "fr":		// 2014-06-05: French
//wim//               langText = new Array("mètres","Largura","Crie uma nova rua, a selecione e clique neste botão.","Rue á rivière","Taille illimitée (dangereux)",
//wim//                                    "Pas de nouvelle rue non enregistré trouvée!","Tous les segments de la rue dans la rivière. Vous ne pouvez pas continuer.",
//wim//                                    "Plusieurs segments de rues à l'intérieur de la rivière. Vous ne pouvez pas continuer.");
//wim//               break;
//wim//           case "ru":		// 2014-06-05: Russian
//wim//               langText = new Array("метров","Ширина","Создайте новую дорогу (не сохраняйте), выберите ее и нажмите эту кнопку.","Дорога в реку","Неограниченная длина (небезопасно)",
//wim//                                    "Не выделено ни одной не сохранённой дороги!","Все сегменты дороги находятся внутри реки. Преобразование невозможно.",
//wim//                                    "Слишком много сегментов дороги находится внутри реки. Преобразование невозможно.");
//wim//               break;                
//wim//           case "hu":		// 2014-07-02: Hungarian
//wim//               langText = new Array("méter","Szélesség","Hozzon létre egy új utcát, válassza ki, majd kattintson erre a gombra.","Utcából folyó","Korlátlan méretű (nem biztonságos)",
//wim//                                    "Nem található nem mentett és kiválasztott új utca!","Az útszakasz a folyón belül található! Nem lehet folytatni.",
//wim//                                    "Minden útszakasz a folyón belül található! Nem lehet folytatni.");
//wim//               break;                
//wim//		case "cs":		// 2014-07-03: Czech
//wim//			langText = new Array("metrů","Šířka","Vytvořte osu řeky, vyberte segment a stiskněte toto tlačítko.","Silnice na řeku","Neomezená šířka (nebezpečné)", 
//wim//                                    "Nebyly vybrány žádné neuložené segmenty!","Všechny segmenty jsou uvnitř řeky! Nelze pokračovat.", 
//wim//                                    "Uvnitř řeky je více segmentů! Nelze pokračovat.");
//wim//               break;
//wim//		case "pl":		// 2014-11-08: Polish - By Zniwek 
//wim//			langText = new Array("metrów","Szerokość","Stwórz ulicę, wybierz ją i kliknij ten przycisk.","Ulica w Rzekę","Nieskończony rozmiar (niebezpieczne)",
//wim//                                    "Nie znaleziono nowej i niezapisanej ulicy!","Wszystkie segmenty ulicy wewnątrz rzeki. Nie mogę kontynuować.",
//wim//                                    "Wiele segmentów ulicy wewnątrz rzeki. Nie mogę kontynuować.");
//wim//               break;
//wim//           case "pt-br":// 2015-04-05: Portuguese - By esmota
//wim//               langText = new Array("metros","Largura","Criar uma nova rua, selecione e clique neste botão.","Rua para Rio","Comprimento ilimitado (instável)",
//wim//                                    "Nenhuma nova rua, sem salvar, selecionada!","Todos os segmentos de rua estão dentro de um rio. Nada a fazer.",
//wim//                                    "Múltiplos segmentos de rua dentro de um rio. Impossível continuar.");
//wim//               break;
//wim//           default:		// 2014-06-05: English
//wim//               langText = new Array("meters","Width","Create a new street, select and click this button.","Street to River","Unlimited size (unsafe)",
//wim//                                    "No unsaved and selected new street found!","All street segments inside river. Cannot continue.",
//wim//                                    "Multiple street segments inside river. Cannot continue.");
//wim//       }
//wim//   }
    
//wim//    // 2014-06-05: Returns the translated  string to current language, if the language is not recognized assumes English
//wim//    function getString(stringID){
//wim//        return langText[stringID];
//wim//    }
//wim//    
//wim//    function Log(sMessage)
//wim//    {
//wim//        if(typeof console != "undefined")
//wim//            console.log(" WPL: " + sMessage);
//wim//    }
       
//wim//    // 2014-06-05: Get interface language
//wim//    scriptLanguage = getLanguage();
//wim//    intLanguageStrings();
		Waze.selectionManager.events.register("selectionchanged", null, insertButtons);
	

	log('WPL bootstrap');
	setTimeout(WPL_Bootstrap, 1020);
})();