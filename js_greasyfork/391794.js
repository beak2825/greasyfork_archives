// ==UserScript==
// @name                WME IRAN Rule Checker
// @namespace           https://www.waze.com/user/editor/B4ckTrace
// @description         Checks segments and places according to waze rules in Iran
// @author              B4ckTrace
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             1.1.1
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/391794/WME%20IRAN%20Rule%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/391794/WME%20IRAN%20Rule%20Checker.meta.js
// ==/UserScript==


var wmeIRC_Icon = 'data:image/png;base64,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';

(function() {

	// global variables
	var wmeIRC_ver = "1.1.1"
	
	
	function bootstrap(tries) {
        tries = tries || 1;

        if (W &&
			W.map &&
            W.model &&
			W.loginManager.user
			) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }
	
	function saveSettings() {
		if (localStorage) {
			var localsetting = [];

			if (localStorage.wmeIRChecker_Settings)
				localsetting = JSON.parse(localStorage.wmeIRChecker_Settings);

			localsetting[1] = getId('_cbCheckUnPaved').checked;
			localsetting[2] = getId('_cbCheckSmallSegments').checked;
			localsetting[3] = getId('_cbCheckWrongSegmentNames').checked;
			localsetting[4] = getId('_cbCheckWrongSegmentLocks').checked;
			localsetting[5] = getId('_cbCheckWrongSpeed').checked;
			localsetting[6] = getId('_cbCheckSegmentWithoutCityName').checked;

			localsetting[10] = getId('_cbCheckWrongPlaces').checked;
			localsetting[11] = getId('_cbCheckWrongPlaceEntryPoint').checked;
			localsetting[12] = getId('_cbCheckPlaceLockOne').checked;

			try {
				localStorage.setItem('wmeIRChecker_Settings', JSON.stringify(localsetting));
			} catch(e) {
				return false;
			}
		}
	}
	
	function init()
	{
		console.log("WME Iran Rule Checker Init");

		// Add new tab item
		var userTabs = getId('user-info');
		var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
		var tabContent = getElementsByClassName('tab-content', userTabs)[0];
		var addon = document.createElement('section');
		addon.id = "sidepanel-wmeIRChecker";
		addon.className = "tab-pane";
		addon.innerHTML  += '<b>نسخه ' + wmeIRC_ver + '</b>';
		var section = document.createElement('p');
		section.style.paddingTop = "0px";
		section.id = "wmeIRChecker-box";
		section.className = 'checkbox';
		section.innerHTML  = '<b>بررسی سگمنت ها</b><br>'
						 + '<label style="color: ' + Color_unPaved + ';" title="بررسی سگمنت های خاکی"><input type="checkbox" id="_cbCheckUnPaved" /> '
						 + 'بررسی سگمنت های خاکی</label><br>'
						 + '<label style="color: ' + Color_SmallSegments + ';" title="سگمنت های زیر ده متر یا دارای ژئونود اضافه"><input type="checkbox" id="_cbCheckSmallSegments" /> '
						 + 'بررسی سگمنت های کوتاه یا ژئونود دار</label><br>'
						 + '<label style="color: ' + Color_WrongName + ';" title="بررسی نامگذاری اشتباه سگمنت"><input type="checkbox" id="_cbCheckWrongSegmentNames" /> '
						 + 'بررسی نامگذاری اشتباه سگمنت</label><br>'
						 + '<label style="color: ' + Color_WrongLocks + ';" title="بررسی قفل های اشتباه سگمنت"><input type="checkbox" id="_cbCheckWrongSegmentLocks" /> '
						 + 'بررسی قفل های اشتباه سگمنت</label><br>'
						 + '<label style="color: ' + Color_WrongSpeed + ';" title="بررسی سرعت اعمال شده روی سگمنت"><input type="checkbox" id="_cbCheckWrongSpeed" /> '
						 + 'بررسی سرعت اعمال شده روی سگمنت</label><br>'
						 + '<label style="color: ' + Color_NoCityNameSegment + ';" title="بررسی سگمنت های بدون نام شهر"><input type="checkbox" id="_cbCheckSegmentWithoutCityName" /> '
						 + 'بررسی سگمنت های بدون نام شهر</label><br>'

						 + '<br><b>بررسی مکان ها</b><br>'
						 + '<label style="color: ' + Color_WrongPlace + ';" title="بررسی مکان ها"><input type="checkbox" id="_cbCheckWrongPlaces" /> '
						 + 'بررسی مکان ها</label><br>'
						 + '<label title="بررسی نقطه ورود"><input type="checkbox" id="_cbCheckWrongPlaceEntryPoint" /> '
						 + 'بررسی نقطه ورود</label><br>'
						 + '<label title="مشخص کردن مکان با لاک یک"><input type="checkbox" id="_cbCheckPlaceLockOne" /> '
						 + 'مشخص کردن مکان با لاک یک</label><br>'
						 ;
						 
		addon.appendChild(section);
		newtab = document.createElement('li');
		newtab.innerHTML = '<a href="#sidepanel-wmeIRChecker" data-toggle="tab"><img style="padding-bottom: 6px;width: 18px;padding-right: 1px;" id="wmeIRC_Icon" class="wmeIRC_IconClass" src="' + wmeIRC_Icon + '">IR Checker</a>';
		navTabs.appendChild(newtab);
		tabContent.appendChild(addon);

		// Load settings
		if (localStorage.wmeIRChecker_Settings) {
			var localsettings = JSON.parse(localStorage.wmeIRChecker_Settings);

			getId('_cbCheckUnPaved').checked        			= localsettings[1];
			getId('_cbCheckSmallSegments').checked        		= localsettings[2];
			getId('_cbCheckWrongSegmentNames').checked        	= localsettings[3];
			getId('_cbCheckWrongSegmentLocks').checked        	= localsettings[4];
			getId('_cbCheckWrongSpeed').checked        			= localsettings[5];
			getId('_cbCheckSegmentWithoutCityName').checked     = localsettings[6];


			getId('_cbCheckWrongPlaces').checked        		= localsettings[10];
			getId('_cbCheckWrongPlaceEntryPoint').checked     	= localsettings[11];
			getId('_cbCheckPlaceLockOne').checked     			= localsettings[12];
		}

		// Checkbox handlers
		getId('_cbCheckUnPaved').onclick        			= CheckSegments;
		getId('_cbCheckSmallSegments').onclick        		= CheckSegments;
		getId('_cbCheckWrongSegmentNames').onclick        	= CheckSegments;
		getId('_cbCheckWrongSegmentLocks').onclick        	= CheckSegments;
		getId('_cbCheckWrongSpeed').onclick        			= CheckSegments;
		getId('_cbCheckSegmentWithoutCityName').onclick     = CheckSegments;

		getId('_cbCheckWrongPlaces').onclick        		= CheckPlaces;
		getId('_cbCheckWrongPlaceEntryPoint').onclick       = CheckPlaces;
		getId('_cbCheckPlaceLockOne').onclick       		= CheckPlaces;


		window.setInterval(CheckSegments, 200);
		window.setInterval(CheckPlaces, 250);
	} // End of init
	

	var Color_unPaved = "#ababab";
	var Color_SmallSegments = "#003287";
	var Color_WrongName = "#910650";
	var Color_WrongLocks = "#d707de";
	var Color_WrongSpeed = "#cc990c";
	var Color_NoCityNameSegment = "#0fd626";

	var Color_WrongPlace = "#1bc4b6";

	// road types
	var ROAD_STREET = 1
	var ROAD_PRIMARY_STREET = 2
	var ROAD_FREEWAY = 3
	var ROAD_RAMP = 4
	var ROAD_MAJOR_HIGHWAY = 6
	var ROAD_MINOR_HIGHWAY = 7
	var ROAD_OFF_ROAD = 8
	var ROAD_PRIVATE = 17
	var ROAD_RAIL_ROAD = 18
	var ROAD_PARKING_LOT = 20
	var ROAD_NARROW = 22

	var RoadTypePriority = {
			0: 0,
			1: 1,
			2: 2,
			3: 5,
			4: 0,
			5: 0,
			6: 4,
			7: 3,
			8: .5,
			10: 0,
			16: 0,
			17: .7,
			18: 0,
			19: 0,
			20: .8,
			21: .6
		};

	// Check segment main function
	function CheckSegments(event) {
	  var showPaved  = getId('_cbCheckUnPaved').checked; //true;
	  var showSmallSegments = getId('_cbCheckSmallSegments').checked; //true;
	  var ShowWrongNames = getId('_cbCheckWrongSegmentNames').checked; //true;
	  var ShowWrongLocks = getId('_cbCheckWrongSegmentLocks').checked; //true;
	  var ShowWrongSpeed = getId('_cbCheckWrongSpeed').checked; //true;
	  var ShowSegmentWithoutCityName = getId('_cbCheckSegmentWithoutCityName').checked; //true;

	  // Set the base 
	  if (event && event.type && /click|change/.test(event.type))
	  {
			for (var seg in W.model.segments.objects) {
				var segment = W.model.segments.getObjectById(seg);
				var line = getId(segment.geometry.id);
				if (line === null) {
					continue;
				}

				var opacity = line.getAttribute("stroke-opacity");
				if (opacity > 0.1 && opacity < 1) {
					line.setAttribute("stroke", "#ee8811");
					line.setAttribute("stroke-opacity", 0);
					line.setAttribute("stroke-dasharray", "none");
				}
		}
	  }

	  for (var seg in W.model.segments.objects) {
		var segment = W.model.segments.getObjectById(seg);
		if (!W.map.getExtent().intersectsBounds(segment.geometry.getBounds())){
			continue;
		}

		var attributes = segment.attributes;
		var line = getId(segment.geometry.id);

		if (line === null) {
		  continue;
		}

		var sid = attributes.primaryStreetID;

		var opacity = line.getAttribute("stroke-opacity");
		var lineWidth = line.getAttribute("stroke-width");
		if (opacity == 1 || lineWidth == 9)
		  continue;

		var roadType = attributes.roadType;
		if (W.map.zoom <= 3 && (roadType < 2 || roadType > 7) ) {
		  if (opacity > 0.1) {
			line.setAttribute("stroke","#ee8811");
			line.setAttribute("stroke-opacity",0.001);
			line.setAttribute("stroke-dasharray", "none");
		  }
		  continue;
		}
		
		
		var street = W.model.streets.getObjectById(sid);
		if (street == null)
			continue;
		var name = street.name;


		// START CHECKING HERE...
		var strErrors = '';
		if (showPaved && (attributes.flags & 16)) {
		  if (opacity < 0.1) {
			line.setAttribute("stroke",Color_unPaved);
			line.setAttribute("stroke-opacity",0.60);
			line.setAttribute("stroke-width", 10);

			strErrors += '* سگمنت خاکی';
			strErrors += '\n';
		  }
		}

		var roundabout  = attributes.junctionID !== null;
		var BadRA = false;

		var wrong_Speed = false;
		if (roundabout)
		{
			var Junction = W.model.junctions.objects[attributes.junctionID]
			var Junction_Segments = Junction.attributes.segIDs
			var total_junction_length = 0;

			var Connected_Segments = [];
			var Connected_Segments_types = [];
			var MinCurrType = 1000;
			
			if (Junction_Segments.length < 2)
			{
				wrong_Speed = true;
				strErrors += '* میدان با یک سگمنت اشتباه است';
				strErrors += '\n';
				BadRA = true;
			}
			else
			{
				for (var index = 0; index < Junction_Segments.length; index++)
				{
					var Junction_Segment = W.model.segments.getObjectById(Junction_Segments[index]);
					total_junction_length += Junction_Segment.attributes.length;
					if (RoadTypePriority[Junction_Segment.attributes.roadType]<MinCurrType)
						MinCurrType = RoadTypePriority[Junction_Segment.attributes.roadType];


					var fromNodeID = Junction_Segment.attributes.fromNodeID;
					var NodeSegments = W.model.nodes.objects[fromNodeID].attributes.segIDs;
					for (var j = 0; j < NodeSegments.length; j++)
					{
						if (!Junction_Segments.includes(NodeSegments[j]))
						{
							var connected_segment = Waze.model.segments.get(NodeSegments[j]);
							Connected_Segments.push(connected_segment);
							Connected_Segments_types.push(connected_segment.attributes.roadType);
						}
					}

				}
			}


			
			//var

		}


		// Short segments
		var wrong_length = false;
		////////////////////// CHECK EXTRA GEONODES /////////////////////////////////////
		var dmax = 2.5;
		var segment = W.model.segments.getObjectById(seg);
		var attributes = segment.attributes;
		var line = getId(segment.geometry.id);
		if (segment.type == "segment" && segment.geometry.components.length > 2 && attributes.junctionID == null && segment.state != "Delete" && !attributes.hasClosures && attributes.updatedBy && segment.getVirtualNodes().length == 0) {
			var ax = Math.abs(segment.geometry.components[0].x - segment.geometry.components[1].x);
			var ay = Math.abs(segment.geometry.components[0].y - segment.geometry.components[1].y);
			var da = Math.sqrt(ax * ax + ay * ay);
			var bx = Math.abs(segment.geometry.components[segment.geometry.components.length - 2].x - segment.geometry.components[segment.geometry.components.length - 1].x);
			var by = Math.abs(segment.geometry.components[segment.geometry.components.length - 2].y - segment.geometry.components[segment.geometry.components.length - 1].y);
			var db = Math.sqrt(bx * bx + by * by);
			var a1 = null;
			var b1 = null;
			if (da < dmax) {
				a1 = segment.geometry.components[1].clone();
			}
			if (db < dmax) {
				b1 = segment.geometry.components[segment.geometry.components.length - 2].clone();
			}
			if (a1 != null && b1 != null && a1.x == b1.x && a1.y == b1.y) {
				b1 = null;
			}
			var geo = segment.geometry.simplify(0.8);
			if (segment.geometry.components.length != geo.components.length) {
				if (a1 != null) {
					if (a1.x != geo.components[1].x || a1.y != geo.components[1].y) {
						geo.addPoint(a1, 1);
					}
				}
				if (b1 != null) {
					if (b1.x != geo.components[geo.components.length - 2].x || b1.y != geo.components[geo.components.length - 2].y) {
						geo.addPoint(b1, geo.components.length - 1);
					}
				}
			}
			var reduced = segment.geometry.components.length - geo.components.length;
			if (reduced) {
				wrong_length = true;
				strErrors += '* ژئونود اضافه حدف گردد';
				strErrors += '\n';
			}
		}
		
		/////////////////////////// END OF EXTRA GEONODE CHECKING ////////////////////////////////
		if (showSmallSegments) {
			if (attributes.length<10){				
				wrong_length = true;
				strErrors += '* طول سگمنت کمتر از 10';
				strErrors += '\n';
			}
			if ((opacity < 0.1) && wrong_length) {
				line.setAttribute("stroke",Color_SmallSegments);
				line.setAttribute("stroke-opacity",0.60);
				line.setAttribute("stroke-width", 10);
			}
		}

		// https://wazeopedia.waze.com/wiki/Iran/%D9%82%D9%88%D8%A7%D9%86%DB%8C%D9%86_%D9%88_%D9%85%D9%82%D8%B1%D8%B1%D8%A7%D8%AA#.D9.86.D8.A7.D9.85.E2.80.8C.DA.AF.D8.B0.D8.A7.D8.B1.DB.8C_.D8.B1.D8.A7.D9.87.E2.80.8C.D9.87.D8.A7_.D9.88_.D8.A7.D8.B5.D8.B7.D9.84.D8.A7.D8.AD.D8.A7.D8.AA_.DA.A9.D9.88.D8.AA.D8.A7.D9.87_.D8.B4.D8.AF.D9.87_.28.D8.AA.D9.84.D8.AE.DB.8C.D8.B5.E2.80.8C.D9.87.D8.A7.29
		var noCity      = false;
		var countryID   = 0;
		if (segment != null && segment.attributes.primaryStreetID != null){
			var adress = segment.getAddress().attributes;
			var city = adress.city.attributes.name;
			noCity = adress.city.attributes.isEmpty;
		}
		
		var lock_num = attributes.lockRank === null ? 0 : Number(attributes.lockRank) + 1;
		var hasRestrictions = attributes.restrictions !== undefined && attributes.restrictions.length > 0;
		var two_way = attributes.fwdDirection === true && attributes.revDirection === true;

		if (ShowSegmentWithoutCityName && noCity){
			if ((opacity < 0.1)) {
				line.setAttribute("stroke", Color_NoCityNameSegment);
				line.setAttribute("stroke-opacity", 0.60);
				line.setAttribute("stroke-width", 10);

				strErrors += '* سگمنت بدون نام شهر';
				strErrors += '\n';
			}
		}

		if (ShowWrongSpeed){
			if (roundabout && (!BadRA)){
				var ra_diameter = total_junction_length/Math.PI;
				if ( (ra_diameter < 10*2) )
				{
					// less than 10		
					wrong_Speed = true;
					strErrors += '* شعاع میدان کمتر از 10 متر';
					strErrors += '\n';
				}
				
				if (two_way)
				{
					// less than 10		
					wrong_Speed = true;
					strErrors += '* سگمنت میدان دو طرفه رسم شده است';
					strErrors += '\n';
				}
			}
			if (attributes.fwdMaxSpeed || attributes.revMaxSpeed)
			{
				if (roadType == ROAD_RAMP){
					if (name)
					{
						if ( !name.match(/local lane/i) && !name.match(/کنارگذر/) && !name.match(/کنار گذر/) )
						{
							wrong_Speed = true;
							strErrors += '* روی رمپها سرعت ثبت نمی گردد';
							strErrors += '\n';
						}
					}
					else
					{
						wrong_Speed = true;
						strErrors += '* روی رمپها سرعت ثبت نمی گردد';
						strErrors += '\n';
					}
				}
				if (roundabout && ((attributes.fwdMaxSpeed && attributes.fwdDirection) || (attributes.revMaxSpeed && attributes.revDirection))){ // Has speed?!
					wrong_Speed = true;
					strErrors += '* سگمنت میدان نباید سرعت داشته باشد';
					strErrors += '\n';
				}
				else if ( (attributes.fwdMaxSpeed > 120) || (attributes.revMaxSpeed > 120) )
				{
					wrong_Speed = true;
					strErrors += '* سرعت بیشتر از 120 مجاز است؟';
					strErrors += '\n';
				}
				else if ( (attributes.fwdMaxSpeed && attributes.fwdMaxSpeed < 10) || (attributes.revMaxSpeed && attributes.revMaxSpeed < 10) )
				{
					wrong_Speed = true;
					strErrors += '* سرعت کمتر از 10 مجاز است؟';
					strErrors += '\n';
				}
				else if (roadType == ROAD_STREET && ( (attributes.fwdMaxSpeed > 30) || (attributes.revMaxSpeed > 30) ))
				{
					wrong_Speed = true;
					strErrors += '* خیابان با سرعت بیشتر از سی؟';
					strErrors += '\n';
				}
			}
			if ((roadType == ROAD_OFF_ROAD) && (attributes.flags & 16) ) // We have no upaved off-road
			{
				wrong_Speed = true;
				strErrors += '* برای آفرود تیک خاکی نیازی نیست';
				strErrors += '\n';
			}
			
			if ((opacity < 0.1) && wrong_Speed) {
				line.setAttribute("stroke", Color_WrongSpeed);
				line.setAttribute("stroke-opacity", 0.60);
				line.setAttribute("stroke-width", 10);
			}
		}

		var wrong_name = false;
		if (name && ShowWrongNames){
			if (roundabout)
			{
				wrong_name = true;

				strErrors += '* سگمنت میدان نباید نام داشته باشد';
				strErrors += '\n';
			}
			
			if ( (roadType == ROAD_RAIL_ROAD) && (!noCity) )
			{
				wrong_name = true;

				strErrors += '* نام شهر برای سگمنت راه آهن ضروری نیست ';
				strErrors += '\n';
			}


			// check SPACE DASH SPACE
			if (!name.match(/\s-\s/) && (roadType != ROAD_MAJOR_HIGHWAY) && (roadType != ROAD_MINOR_HIGHWAY) && (roadType != ROAD_FREEWAY) && (name.indexOf("/") < 0)){
				wrong_name = true;

				strErrors += '* در نام باید فاصله خط تیره فاصله ( - ) وجود داشته باشد';
				strErrors += '\n';
				//console.log('+++' + name + '\tdash')
			}

			if ( (name.match(/[a-z]/i) && !name.match(/^\d/) && !(/^[A-Z]/.test(name))))
			{
				wrong_name = true;

				strErrors += '* حرف اول باید به صورت بزرگ نوشته شود';
				strErrors += '\n';
			}
			
			if (name.match(/\s\s/)){
				wrong_name = true;

				strErrors += '* دو فاصله پشت سرهم در نام وجود دارد';
				strErrors += '\n';
			}

			if (name.match(/سینزده/)){
				wrong_name = true;

				strErrors += '* سیزده اشتباه نوشته شده';
				strErrors += '\n';
			}

			if (name.match(/فلکه/)){
				wrong_name = true;

				strErrors += '* نباید در نام فلکه نوشته شود';
				strErrors += '\n';
			}

			if (name.match(/هیفده/)){
				wrong_name = true;

				strErrors += '* هفده اشتباه نوشته شده';
				strErrors += '\n';
			}

			if (name.match(/شیش\s/)){
				wrong_name = true;

				strErrors += '* شش اشتباه نوشته شده';
				strErrors += '\n';
			}

			if (name.match(/ي/)){
				wrong_name = true;

				strErrors += '* دارای ي عربی';
				strErrors += '\n';
			}
			if (name.match(/ك/)){
				wrong_name = true;

				strErrors += '* دارای ك عربی';
				strErrors += '\n';
			}
			
			if (name.match(/oo/)){
				wrong_name = true;

				strErrors += '* به جای oo از  u استفاده کنید';
				strErrors += '\n';
			}
			

			var match = name.match(/\d+/g);
			if (match){
				var numbers = match.map(Number);
				if ((numbers.length > 1) && (name.indexOf("/") < 0)){
					wrong_name = true;

					strErrors += '* تعداد دو عدد در نام استفاده شده';
					strErrors += '\n';
				}
			}
			
			if (name.match(/\sجاده/) && name.match(/-/)){
				if (!name.match(/\sRd\s\.\s/i)){
					wrong_name = true;

					strErrors += '* آیا نیازی به وجود Rd .  در نام نیست؟';
					strErrors += '\n'; 
				}
			}
			
			if (name.match(/Towhid/i)){
				wrong_name = true;
				
				strErrors += '* توحید باید در انگلیسی Tohid نوشته شود';
				strErrors += '\n';
			}
			if (name.match(/توحید/)){
				var correct_alter = false;
				if (!name.match(/Tohid/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Guya/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* Tohid در نام یا آلتر دیده نمیشود';
					strErrors += '\n';
				}
			}

			if (name.match(/Guya/i)){
				var correct_alter = false;
				if (!name.match(/گویا/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/گویا/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;
					
					strErrors += '* گویا در نام یا آلتر دیده نمی شود';
					strErrors += '\n';
				}
			}
			if (name.match(/گویا/)){
				var correct_alter = false;
				if (!name.match(/Guya/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Guya/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* Guya در نام یا آلتر دیده نمیشود';
					strErrors += '\n';
				}
			}
			
			if (name.match(/Firuz/i)){
				var correct_alter = false;
				if (!name.match(/فیروز/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/فیروز/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* فیروز در نام یا آلتر دیده نمی شود';
					strErrors += '\n';
				}
			}
			if (name.match(/فیروز/)){
				var correct_alter = false;
				if (!name.match(/Firuz/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Firuz/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* Firuz در نام یا آلتر دیده نمیشود';
					strErrors += '\n';
				}
			}
			if (name.match(/عی/) && !name.match(/سعید/)){
				var correct_alter = false;
				if (!name.match(/ei/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/ei/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* برای عی حروف ei را در نام یا آلتر بنویسید';
					strErrors += '\n';
				}
			}
			if (name.match(/جام/)){
				var correct_alter = false;
				if (!name.match(/Jām/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Jām/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* Jām را در نام یا آلتر بنویسید';
					strErrors += '\n';
				}
			}
			
			
			
			
			
			
			
			
			

			// Use Blvd for بلوار
			if (name.match(/\sBlvd/)){
				var correct_alter = false;
				if (!name.match(/بلوار/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/بلوار/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tBlvd')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت بلوار است باید در نام یا آلتر بلوار نوشته شود';
					strErrors += '\n';
				}
			}

			if (name.match(/بلوار/)){
				var correct_alter = false;
				if (!name.match(/\sBlvd/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sBlvd/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tبلوار')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت بلوار است باید در نام یا آلتر Blvd نوشته شود';
					strErrors += '\n';
				}
			}

			// Use Expy for بزرگراه
			if (name.match(/\sExpy/)){
				var correct_alter = false;
				if (!name.match(/بزرگراه/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/بزرگراه/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tExpy')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت Expy است باید در نام یا آلتر بزرگراه نوشته شود';
					strErrors += '\n';
				}
			}

			// Use Hwy for بزرگراه
			if (name.match(/\sHwy/)){
				var correct_alter = false;
				if (!name.match(/بزرگراه/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/بزرگراه/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت Hwy است باید در نام یا آلتر بزرگراه نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/بزرگراه/)){
				var correct_alter = false;
				if ( (!name.match(/\sHwy/)) && (!name.match(/\sExpy/)) ){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if ( (alter.name.match(/\sHwy/)) || (alter.name.match(/\sExpy/)) ){
							correct_alter = false;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت بزرگراه است باید در نام یا آلتر Hwy یا Expy نوشته شود';
					strErrors += '\n';
				}
			}

			if (name.match(/\sFwy/)){
				var correct_alter = false;
				if (!name.match(/آزادراه/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/آزادراه/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tBlvd')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت Fwy است باید در نام یا آلتر آزاد راه نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/آزادراه/)){
				var correct_alter = false;
				if (!name.match(/\sFwy/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sFwy/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tبلوار')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* اگر سگمنت آزادراه است باید در نام یا آلتر Fwy نوشته شود';
					strErrors += '\n';
				}
			}

			// Use W for غربی
			if (name.match(/\sW\s/)){
				var correct_alter = false;
				if (!name.match(/غربی/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/غربی/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر غربی نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/غربی/)){
				var correct_alter = false;
				if (!name.match(/\sW\s/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sW\s/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر W نوشته شود';
					strErrors += '\n';
				}
			}

			// Use E for شرقی
			if (name.match(/\sE\s/)){
				var correct_alter = false;
				if (!name.match(/شرقی/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/شرقی/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر شرقی نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/شرقی/)){
				var correct_alter = false;
				if (!name.match(/\sE\s/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sE\s/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر E نوشته شود';
					strErrors += '\n';
				}
			}

			// Use S for جنوبی
			if (name.match(/\sS\s/)){
				var correct_alter = false;
				if (!name.match(/جنوبی/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/جنوبی/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر جنوبی نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/جنوبی/)){
				var correct_alter = false;
				if (!name.match(/\sS\s/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sS\s/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر S نوشته شود';
					strErrors += '\n';
				}
			}

			// Use N for شمالی
			if (name.match(/\sN\s/)){
				var correct_alter = false;
				if (!name.match(/شمالی/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/شمالی/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر شمالی نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/شمالی/)){
				var correct_alter = false;
				if (!name.match(/\sN\s/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sN\s/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر N نوشته شود';
					strErrors += '\n';
				}
			}
			if ( ((name.match(/غ/) || []).length==1) && (name.match(/غربی/)) ){
			}
			else if ( ((name.match(/غ/) || []).length>1) ){
				var correct_alter = false;
				if (!name.match(/Gh/) || (!name.match(/gh/))){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Gh/) || alter.name.match(/gh/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نوشتن غ و ق دقت شود';
					strErrors += '\n';
				}
			}

			// Check gh for غ
			if (name.match(/Gh/) || (name.match(/gh/))){
				var correct_alter = false;
				if (!name.match(/غ/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/غ/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نوشتن غ و ق دقت شود';
					strErrors += '\n';
				}
			}

			if ( ((name.match(/ق/) || []).length==1) && (name.match(/شرقی/)) ){
			}
			else if ( ((name.match(/ق/) || []).length>1) ){
				var correct_alter = false;
				if (!name.match(/q/i)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/q/i)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نوشتن غ و ق دقت شود';
					strErrors += '\n';
				}
			}

			// Check q for ق
			if (name.match(/q/i)){
				var correct_alter = false;
				if (!name.match(/ق/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/ق/)){
							correct_alter = true;
							break;
						}
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نوشتن غ و ق دقت شود';
					strErrors += '\n';
				}
			}

			// Check Imam for امام
			if (name.match(/Imam/)){
				var correct_alter = false;
				if (!name.match(/امام/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/امام/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tImam')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر امام نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/\sامام/)){
				var correct_alter = false;
				if (!name.match(/Imam/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Imam/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tامام')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر Imam نوشته شود';
					strErrors += '\n';
				}
			}

			// Check Seyyed for امام
			if (name.match(/Seyyed/)){
				var correct_alter = false;
				if (!name.match(/سید/)){
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/سید/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tSeyyed')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر سید نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/سید/)){
				var correct_alter = false;
				if (!name.match(/Seyyed/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Seyyed/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tسید')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر Seyyed نوشته شود';
					strErrors += '\n';
				}
			}

			// Check Hosein for حسین
			if (name.match(/Hosein/i)){
				var correct_alter = false;
				if (!name.match(/حسین/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/حسین/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tHosein')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام با آلتر حسین نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/حسین/)){
				var correct_alter = false;
				if (!name.match(/Hosein/i)){
					wrong_name = true;

					strErrors += '* در نام یا آلتر Hosein نوشته شود';
					strErrors += '\n';
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Hosein/i)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tحسین')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر Hosein نوشته شود';
					strErrors += '\n';
				}
			}

			// Check Khomeini for خمینی
			if (name.match(/Khomeini/)){
				var correct_alter = false;
				if (!name.match(/خمینی/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/خمینی/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tKhomeini')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر خمینی نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/خمینی/)){
				var correct_alter = false;
				if (!name.match(/Khomeini/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Khomeini/i)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tخمینی')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر Khomeini نوشته شود';
					strErrors += '\n';
				}
			}

			// Check Mohammad for محمد
			if (name.match(/Mohammad/i)){
				var correct_alter = false;
				if (!name.match(/محمد/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/محمد/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tMohammad')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر محمد نوشته شود';
					strErrors += '\n';
				}
			}
			if (name.match(/محمد/)){
				var correct_alter = false;
				if (!name.match(/Mohammad/i)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Mohammad/i)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tمحمد')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر Mohammad نوشته شود';
					strErrors += '\n';
				}
			}

			// Check for شهید
			if (name.match(/شهید\s/)){
				wrong_name = true;

				strErrors += '* شهید در نام نوشته شده';
				strErrors += '\n';
				//console.log('+++' + name + '\tشهید')
			}

			if ( (roadType==ROAD_STREET) || (roadType==ROAD_PRIMARY_STREET) )
			{
				// Check for خیابان
				if (name.match(/خیابان\s/)){
					wrong_name = true;

					strErrors += '* خیابان در نام نوشته شده';
					strErrors += '\n';
					//console.log('+++' + name + '\tخیابان')
				}
				
				if (name.match(/Avenue/i)){
					wrong_name = true;

					strErrors += '* Avenue در نام نوشته شده';
					strErrors += '\n';
				}
				
				if (name.match(/\sST[\s-]/i)){
					wrong_name = true;

					strErrors += '* st در نام نوشته شده';
					strErrors += '\n';
				}

				// Check for کوچه
				if (name.match(/کوچه/)){
					wrong_name = true;

					strErrors += '* کوچه در نام نوشته شده';
					strErrors += '\n';
					//console.log('+++' + name + '\tکوچه')
				}

				// Check for بن‌بست
				if (name.match(/بن‌بست/) || name.match(/بن بست/)){
					wrong_name = true;

					strErrors += '* بن بست در نام نوشته شده';
					strErrors += '\n';
					//console.log('+++' + name + '\tبن‌بست')
				}
			}

			// Check local lane for کنارگذر
			if (name.match(/local lane/i)){
				var correct_alter = false;
				if (!name.match(/کنارگذر/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/کنارگذر/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tlocal lane')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر کنارگذر نوشته نیست';
					strErrors += '\n';
				}
			}
			if (name.match(/کنارگذر/)){
				var correct_alter = false;
				if (!name.match(/local lane/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/local lane/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tکنارگذر')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر local lane با حروف کوچک نوشته نیست';
					strErrors += '\n';
				}
			}

			if (name.match(/1st/i) && (!name.match(/,\s/))){
				var correct_alter = false;
				if ( (!name.match(/\sاول/)) && (!name.match(/\sیکم/)) && (!name.match(/\sنخست/)) ){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/\sاول/) || alter.name.match(/\sیکم/) || alter.name.match(/\sنخست/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\t1st')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر اول یا یکم یا نخست اضافه شود';
					strErrors += '\n';
				}
			}
			if ( ((name.match(/\sاول/)) || (name.match(/\sیکم/)) || (name.match(/\sنخست/))) && !name.match(/\متری/) ){
				var correct_alter = false;
				if (!name.match(/1st/i)){
					if (!name.match(/Metri/i)){						
						// Check alter names
						for (var i = 0; i < attributes.streetIDs.length; i++) {
							alter = W.model.streets.get(attributes.streetIDs[i]);
							if (alter.name.match(/1st/i)){
								correct_alter = true;
								break;
							}
						}
						//console.log('+++' + name + '\tاول')
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

						strErrors += '* در نام یا آلتر 1st نوشته نیست';
						strErrors += '\n';
				}
			}

			if (name.match(/2nd/i) && (!name.match(/,\s/))){
				var correct_alter = false;
				if (!name.match(/دوم/)) {					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/دوم/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\t2nd')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر دوم نوشته نیست';
					strErrors += '\n';
				}
			}
			if (name.match(/دوم/) && !name.match(/\متری/)) {
				var correct_alter = false;
				if (!name.match(/2nd/i)){
					if (!name.match(/Metri/i)){						
						// Check alter names
						for (var i = 0; i < attributes.streetIDs.length; i++) {
							alter = W.model.streets.get(attributes.streetIDs[i]);
							if (alter.name.match(/2nd/i)){
								correct_alter = true;
								break;
							}
						}
						//console.log('+++' + name + '\tدوم')
					}
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر 2nd نوشته نیست';
					strErrors += '\n';
				}
			}

			if (name.match(/3rd/i) && (!name.match(/,\s/))){
				var correct_alter = false;
				if (!name.match(/سوم/)) {					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/سوم/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\t3rd')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر سوم نوشته نیست';
					strErrors += '\n';
				}
			}
			if (name.match(/سوم/) && !name.match(/\متری/)) {
				var correct_alter = false;
				if (!name.match(/3rd/i)){
					if (!name.match(/Metri/i)){
						// Check alter names
						for (var i = 0; i < attributes.streetIDs.length; i++) {
							alter = W.model.streets.get(attributes.streetIDs[i]);
							if (alter.name.match(/3rd/i)){
								correct_alter = true;
								break;
							}
						}
					}
					//console.log('+++' + name + '\tسوم')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;
					
					strErrors += '* در نام یا آلتر 3rd نوشته نیست';
					strErrors += '\n';
				}
			}

			if (name.match(/Metri/i)){
				var correct_alter = false;
				if (!name.match(/متری/)){					
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/متری/)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tMohammad')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;

					strErrors += '* در نام یا آلتر متری نوشته نیست';
					strErrors += '\n';
				}
			}
			if (name.match(/متری/)){
				var correct_alter = false;
				if (!name.match(/Metri/i)){				
					// Check alter names
					for (var i = 0; i < attributes.streetIDs.length; i++) {
						alter = W.model.streets.get(attributes.streetIDs[i]);
						if (alter.name.match(/Metri/i)){
							correct_alter = true;
							break;
						}
					}
					//console.log('+++' + name + '\tمحمد')
				}
				else
				{
					correct_alter = true;
				}
				if (!correct_alter)
				{
					wrong_name = true;
					
					strErrors += '* در نام یا آلتر Metri نوشته نیست';
					strErrors += '\n';
				}
			}


			if ((opacity < 0.1) && wrong_name) {
				line.setAttribute("stroke",Color_WrongName);
				line.setAttribute("stroke-opacity",0.60);
				line.setAttribute("stroke-width", 10);

				continue;
			}
		}

		if (lock_num && ShowWrongLocks){
			var wrong_lock = false
			if (lock_num == 1)
			{
				wrong_lock = true;
				strErrors += '* لاک یک را بهتر است روی خودکار قرار دهید';
				strErrors += '\n';
			}
			if (roundabout){
				if (lock_num < 3)
					{
						wrong_lock = true;
						strErrors += '* سگمنت میدان باید حداقل لاک سه بگیرد';
						strErrors += '\n';
					}
			}
			if (hasRestrictions){
				if (lock_num < 3)
				{
					wrong_lock = true;
					strErrors += '* سگمنت محدودیت دار باید حداقل لاک سه بگیرد';
					strErrors += '\n';
				}
			}
			if (!roundabout && !hasRestrictions)
			{
				switch(roadType) {					
				 case ROAD_STREET:
				  // Avoid خیابان، کوچه و بن‌بست
				  if (lock_num > 2)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع خیابان لاک بالاتر از دو گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_PRIMARY_STREET:
				  // Avoid خیابان، کوچه و بن‌بست
				  if ((lock_num > 3) || (lock_num < 2))
				  {
					  wrong_lock = true;
					  strErrors += '* نوع خیابان اصلی لاک بالای سه یا پایین دو گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_FREEWAY:
				  // code block
				  if (lock_num < 5)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع آزادراه لاک کمتر از پنج گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_RAMP:
				  // code block
				  if ((lock_num < 3) || (lock_num > 5))
				  {
					  wrong_lock = true;
					  strErrors += '* نوع رمپ لاک کمتر از سه یا بیشتر از پنج گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_MAJOR_HIGHWAY:
				  // code block
				  if (lock_num != 4)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع بزرگراه اصلی لاک غیر از چهار گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_MINOR_HIGHWAY:
				  // code block
				  if (lock_num < 3)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع بزرگراه فرعی لاک کمتر از سه گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_PRIVATE:
				  // code block
				  if (lock_num > 2)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع سگمنت خصوصی لاک بیشتر از دو گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_PARKING_LOT:
				  // code block
				  for (var venue_obj in W['model']['venues']['objects']) {
						var venue_obj_id = W['model']['venues']['getObjectById'](venue_obj);
						// If segment is inside a gas station
						if (venue_obj_id['geometry']['intersects'](attributes['geometry'])) {
							var venueCategories = venue_obj_id.attributes.categories;
							if ( (venueCategories.indexOf("GAS_STATION") > -1) && (lock_num != 3) )
							{
								wrong_lock = true;
							    strErrors += '* لاک سگمنت جایگاه سوخت باید سه باشد';
							    strErrors += '\n';
								
								break;
							}
						}
				  }
				  if (lock_num > 3)
				  {
					  wrong_lock = true;
					  strErrors += '* نوع پارکینگ لاک بیشتر از سه گرفته است';
					  strErrors += '\n';
				  }
				  break;
				 case ROAD_NARROW:
				  // code block
				  break;
				}
			}

			if ((opacity < 0.1) && wrong_lock) {
					line.setAttribute("stroke", Color_WrongLocks);
					line.setAttribute("stroke-opacity",0.60);
					line.setAttribute("stroke-width", 10);

					continue;
				}

		}


		if ((wrong_Speed || wrong_lock || wrong_name || wrong_length) && line.getElementsByTagName('title').length < 1)
		{
			var nodeTitle = document.createElementNS("http://www.w3.org/2000/svg", 'title');
			var errors = document.createTextNode(strErrors.trim());
			nodeTitle.appendChild(errors);

			line.appendChild(nodeTitle);
		}
		
	  } // end of loop
	  saveSettings();
	} // end of function

	function CheckPlaces(event) {
	  if (typeof W.model.venues == "undefined") {
		return;
	  }

	  if (W.model.active == false) {
		return;
	  }

	  var ShowWrongPlaces = getId('_cbCheckWrongPlaces').checked; //true;
	  var ShowWrongPlaceEntryPoint = getId('_cbCheckWrongPlaceEntryPoint').checked; //true;
	  var ShowPlaceLockOne = getId('_cbCheckPlaceLockOne').checked; //true;

	  if (event && event.type && /click|change/.test(event.type)) {
		  if (ShowWrongPlaces == false)
		  {
			for (var mark in W.model.venues.objects) {
			  var venue = W.model.venues.getObjectById(mark);
			  var poly = getId(venue.geometry.id);
			  if (poly !== null && poly.getAttribute("stroke-opacity") == 0.987) {
				if (venue.isPoint()) {
				  poly.setAttribute("stroke","white");
				} else {
				  poly.setAttribute("stroke","#ca9ace");
				  poly.setAttribute("stroke-width",2);
				  poly.setAttribute("stroke-dasharray","none");
				}
				poly.setAttribute("fill","#c290c6");
				poly.setAttribute("stroke-opacity", 1)
			  }
			}
		  }
	  }


	  if (ShowWrongPlaces)
	  {
		  for (var mark in W.model.venues.objects) {
			var venue = W.model.venues.getObjectById(mark);
			var approved = venue.attributes.approved
			var venueCategories = venue.attributes.categories;
			var venueServices = venue.attributes.services;
			var venueName = venue.attributes.name;
			var venueAliases = venue.attributes.aliases;
			var poly = getId(venue.geometry.id);
			var entryPoint = venue.attributes.entryExitPoints;
			var venuePhone = venue.attributes.phone;
			var lock_num = venue.attributes.lockRank === null ? 0 : Number(venue.attributes.lockRank) + 1;
			var address = venue.getAddress().attributes.street;
			var hasPicture = venue.attributes.images.length;

			if (!approved){
				continue;
			}

			if (poly == null || mark.state == "Update" || venue.selected) {
			  continue;
			}

			if (poly.getAttribute("fill") == poly.getAttribute("stroke")) {
			  continue;
			}

			if (poly.getAttribute("stroke-opacity") == 0.987) {
			  continue;
			}
			
			var venueArea = null;
			if (!venue.isPoint())
			{
				var venueArea = venue.geometry.getGeodesicArea(W.map.getProjectionObject());
				venueArea = venueArea.toFixed(0);
			}

			poly.setAttribute("stroke-opacity", 0.987);

			var wrong_place = false;

			//for (i = 0, n = venueAliases.length; i < n; i++) {
			//	alter = W.model.streets.get(venueAliases[i]);
			//	if (alter.name.match(/Mohammad/i)){
			//		wrong_name = false;
			//		break;
			//	}
			//}
			var strErrors = '';
			
			if (ShowPlaceLockOne)
			{
				if(lock_num==1)
				{
					wrong_place = true;

					strErrors += '* مکان دارای لاک یک';
					strErrors += '\n';
				}
			}

			if ((venueCategories.indexOf("JUNCTION_INTERCHANGE") == -1 ) && (address === null))
			{
				wrong_place = true;

				strErrors += '* لطفا وضعیت آدرس مکان را مشخص کنید';
				strErrors += '\n';
			}
			
			if (venue.attributes.houseNumber)
			{
				if ( (venue.attributes.houseNumber.startsWith("+")) || (venue.attributes.houseNumber.startsWith("0")) || (venue.attributes.houseNumber.length>=5) )
				{
					wrong_place = true;

					strErrors += '* آیا شماره پلاک این مکان درست است؟';
					strErrors += '\n';
				}
			}

			if ( (venueName.match(/[a-z]/i) && !venueName.match(/^\d/) && !(/^[A-Z]/.test(venueName))))
			{
				wrong_place = true;

				strErrors += '* حرف اول باید به صورت بزرگ نوشته شود';
				strErrors += '\n';
			}

			if ( (!venue.isPoint()) && (venueArea < 500) && (venueCategories.indexOf("GAS_STATION") == -1) && (venueCategories.indexOf("JUNCTION_INTERCHANGE") == -1) )
			{
				wrong_place = true;
				strErrors += '* بهتر است مکانهای محیطی کوچک را به نقطه ای تبدیل کنید';
				strErrors += '\n';
			}

			if (venuePhone && (!venuePhone.startsWith("+98")))
			{
				wrong_place = true;
				strErrors += '* استاندارد شماره تلفن به صورت 980000000000+ می باشد';
				strErrors += '\n';
			}
			if (venueCategories.indexOf("RESIDENCE_HOME") == -1)
			{
				if (!venueName){
						wrong_place = true;
						strErrors += '* یک نام برای این مکان ثبت کنید';
						strErrors += '\n';
				}
				else if (venueName && venueName.match(/-/) && !venueName.match(/\s-\s/)){
						wrong_place = true;
						strErrors += '* فاصله قبل و بعد از خط تیره در نام';
						strErrors += '\n';
				}

				if (venueName && venueName.match(/-/) && venueAliases.length<1){
						wrong_place = true;
						strErrors += '* حداقل یک آلتر اضافه گردد';
						strErrors += '\n';
				}
				if (ShowWrongPlaceEntryPoint && !venue.isPoint() && entryPoint.length==0 && (venueCategories.indexOf("JUNCTION_INTERCHANGE") == -1)){
						wrong_place = true;
						strErrors += '* مکان محیطی حداقل یک نقطه ورود دارد';
						strErrors += '\n';
				}
			}

			if (venueName.match(/میدان/))
			{
				if (!venueName.match(/Sq\s-/i)) {
					wrong_place = true;
					strErrors += '* اگر اینجا میدان است عبارت Sq را نیز در نام اضافه کنید';
					strErrors += '\n';
				}
			}
			else if (venueName.match(/Sq\s/i))
			{
				if (!venueName.match(/میدان/)) {
					wrong_place = true;
					strErrors += '* اگر اینجا میدان است کلمه میدان را نیز درنام اضافه کنید';
					strErrors += '\n';
				}
			}

			if (venueName.match(/مسجد/) || venueName.match(/Mosque/i))
			{
				if (venueCategories.indexOf("RELIGIOUS_CENTER") == -1)
				{
					wrong_place = true;
					strErrors += '* اگر اینجا مسجد است باید در دسته بندی مرکز مذهبی قرار گیرد';
					strErrors += '\n';
				}
			}

			if (venueCategories){ //
				if ( (!venue.isPoint()) && (venueCategories.indexOf("JUNCTION_INTERCHANGE") == -1) && (venueCategories.indexOf("PARKING_LOT") == -1) && (venueCategories.indexOf("GAS_STATION") == -1) && (lock_num < 2) )
				{
					wrong_place = true;
					strErrors += '* حداقل لاک دو برای مکانهای محیطی مناسب است';
					strErrors += '\n';
				}
				else if (venueCategories.indexOf("PHARMACY") > -1)
				{
					if ( (!venueName.match(/داروخانه/)) || (!venueName.match(/Pharmacy/i)) )
					{
						wrong_place = true;
						strErrors += '* داروخانه و Pharmacy در نام اضافه شود';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("AIRPORT") > -1)
				{
					if ( !venueName.match(/فرودگاه/) )
					{
						wrong_place = true;
						strErrors += '* فرودگاه در نام اضافه شود';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("PARK") > -1)
				{
					if (venue.isPoint()){ // Should be as polygon
						wrong_place = true;
						strErrors += '* پارک یا بوستان باید به صورت محیطی باشد';
						strErrors += '\n';
					}
					if (venueServices.indexOf("RESTROOMS") > -1)
					{
						var found = false;
						for (var venue_obj in W['model']['venues']['objects']) {
							var venue_obj_id = W['model']['venues']['getObjectById'](venue_obj);
							// If segment object is visible
							if (!W.map.getExtent().intersectsBounds(venue_obj_id.geometry.getBounds())){
								continue;
							}
							if (venue === venue_obj_id)
							{
								continue;
							}
							if (venue['geometry']['intersects'](venue_obj_id['geometry'])) {
								if (venue_obj_id.attributes.services.indexOf("RESTROOMS") > -1) {
									found = true;
									break;
								}
							}
						}
						if (!found)
						{
							wrong_place = true;
							strErrors += '* برای این پارک باید سرویس بهداشتی را جداگانه نیز تعربف نمایید';
							strErrors += '\n';
						}
					}
					if ( venueName && !venueName.match(/بوستان/) )
					{
						wrong_place = true;
						strErrors += '* از بوستان در نام استفاده کنید';
						strErrors += '\n';
					}
					if ( venueName && !venueName.match(/Park -/i) )
					{
						wrong_place = true;
						strErrors += '* از Park در نام استفاده کنید';
						strErrors += '\n';
					}
				}
				else if ( (venueCategories.indexOf("ATM") > -1) && (venueCategories.length == 1) )
				{
					if ( !venueName.match(/خودپرداز/) )
					{
						wrong_place = true;
						strErrors += '* در نام خودپرداز را اضافه کنید';
						strErrors += '\n';
					}
					if ( !venueName.match(/ATM/i) )
					{
						wrong_place = true;
						strErrors += '* در نام ATM اضافه کنید';
						strErrors += '\n';
					}
				}
				else if ( (venueCategories.indexOf("EMBASSY_CONSULATE") > -1) )
				{
					if (hasPicture)
					{
						wrong_place = true;
						strErrors += '* عکس برداری از نمای سفارتخانه ها قانونا ممنوع است و مکان نباید دارای عکس باشد';
						strErrors += '\n';
					}
					if ( !venueName.match(/سفارت/) )
					{
						wrong_place = true;
						strErrors += '* اگر اینجا سفارت است در نام سفارت اضافه کنید';
						strErrors += '\n';
					}
					if ( !venueName.match(/Embassy/i) )
					{
						wrong_place = true;
						strErrors += '* اگر اینجا سفارت است در نام Embassy اضافه کنید';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("MILITARY") > -1)
				{
					if (hasPicture)
					{
						wrong_place = true;
						strErrors += '* عکس برداری از اماکن نظامی قانونا ممنوع است و مکان نباید دارای عکس باشد';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("TUNNEL") > -1)
				{
					if (venue.isPoint())
					{
						wrong_place = true;
						strErrors += '* تونل باید به صورت محیطی تعریف شود';
						strErrors += '\n';
						break;
					}
				}
				else if (venueCategories.indexOf("BUS_STATION") > -1)
				{
					if ( !venueName.match(/ایستگاه/) )
					{
						wrong_place = true;
						strErrors += '* اگر اینجا ایستگاه اتوبوس است در نام ایستگاه اضافه کنید';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("GAS_STATION") > -1)
				{
					if (venue.isPoint())
					{
						wrong_place = true;
						strErrors += '* جایگاه سوخت نباید به صورت نقطه ای تعریف شود';
						strErrors += '\n';
						break;
					}

					var any_segment = false;
					for (var seg_obj in W['model']['segments']['objects']) {
						var seg_obj_id = W['model']['segments']['getObjectById'](seg_obj);
						// If segment object is visible
						if (!W.map.getExtent().intersectsBounds(seg_obj_id.geometry.getBounds())){
							continue;
						}
						if (venue['geometry']['intersects'](seg_obj_id['geometry'])) {
							any_segment = true;
							var two_way = seg_obj_id.attributes.fwdDirection === true && seg_obj_id.attributes.revDirection === true;
							if (seg_obj_id['attributes']['roadType'] != ROAD_PARKING_LOT) {
								wrong_place = true;
								strErrors += '* سگمنت جایگاه سوخت باید از نوع راه داخل پارگینگ باشد';
								strErrors += '\n';
								break;
							}
							if ( (venueArea < 1000) && (!two_way) )
							{
								wrong_place = true;
								strErrors += '* اگر مساحت این جایگاه، کوچک است نوع سگمنت جایگاه دوطرفه مناسب است';
								strErrors += '\n';
								//break;
							}
						}
					}
					if (!any_segment){
						wrong_place = true;
						strErrors += '* آیا اطمینان دارید که برای این جایگاه نباید سگمنتی رسم شود؟';
						strErrors += '\n';
					}



					if (venue.isPoint()){ // Should be as polygon
						wrong_place = true;
						strErrors += '* جایگاه سوخت به صورت محیطی باید باشد';
						strErrors += '\n';
					}
					if (lock_num < 3)
					{
						wrong_place = true;
						strErrors += '* لاک جایگاه سوخت حداقل سه است';
						strErrors += '\n';
					}
					if (!venueName.match(/جایگاه/))
					{
						wrong_place = true;
						strErrors += '* در نام فارسی کلمه جایگاه نوشته نیست';
						strErrors += '\n';
					}
					if (venueName.match(/[a-z]/i))
					{
						wrong_place = true;
						strErrors += '* در نام اصلی جایگاه سوخت نباید از حروف انگلیسی استفاده شود';
						strErrors += '\n';
					}
					if (venueAliases.length<1)
					{
						wrong_place = true;
						strErrors += '* آلتر جایگاه سوخت فراموش شده است';
						strErrors += '\n';
					}
					else
					{											
						if (venueName.match(/جایگاه سوخت/))						
						{
							var blPetrolStation = false;
							for (var index=0; index<venueAliases.length; index++)
							{							
								if (venueAliases[index].match(/Petrol Station/i))
								{
									blPetrolStation = true;
									break;
								}
							}
							if (!blPetrolStation)
							{
								wrong_place = true;
								strErrors += '* در آلتر Petrol Station نوشته شود';
								strErrors += '\n';
							}
						}
						
						if (venueName.match(/جایگاه گاز طبیعی/))						
						{
							var blCNG_Station = false;
							for (var index=0; index<venueAliases.length; index++)
							{							
								if (venueAliases[index].match(/CNG Station/i))
								{
									blCNG_Station = true;
									break;
								}
							}
							if (!blCNG_Station)
							{
								wrong_place = true;
								strErrors += '* در آلتر CNG Station نوشته شود';
								strErrors += '\n';
							}
						}
						
						if (venueName.match(/جایگاه چندمنظوره/))						
						{
							blPetrol_CNG_Station = false;
							for (var index=0; index<venueAliases.length; index++)
							{							
								if (venueAliases[index].match(/Petrol & CNG Station/i))
								{
									blPetrol_CNG_Station = true;
									break;
								}
							}
							if (!blPetrol_CNG_Station)
							{
								wrong_place = true;
								strErrors += '* در آلتر Petrol & CNG Station نوشته شود';
								strErrors += '\n';
							}
						}
					}
				}
				else if (venueCategories.indexOf("FACTORY_INDUSTRIAL") > -1)
				{
					if (!venueName.match(/صنعتی/))
					{
						wrong_place = true;
						strErrors += '* اگر اینجا شهرک صنعتی است در نام اضافه کنید';
						strErrors += '\n';
					}
					else
					{
						for (var seg_obj in W['model']['segments']['objects']) {
							var seg_obj_id = W['model']['segments']['getObjectById'](seg_obj);
							// If segment object is visible
							if (!W.map.getExtent().intersectsBounds(seg_obj_id.geometry.getBounds())){
								continue;
							}
							if (venue['geometry']['intersects'](seg_obj_id['geometry'])) {
								if (seg_obj_id['attributes']['roadType'] != ROAD_PRIVATE) {
									wrong_place = true;
									strErrors += '* سگمنت شهرک های صنعتی از نوع راه اختصاصی  می باشد';
									strErrors += '\n';
									break;
								}
							}
						}
					}
				}
				else if (venueCategories.indexOf("PARKING_LOT") > -1)
				{
					if (venue.isPoint()){ // Should be as polygon
						wrong_place = true;
						strErrors += '* پارکینگ عمومی به صورت محیطی باشد';
						strErrors += '\n';
					}
					else if ( (venue.attributes.categoryAttributes.PARKING_LOT.parkingType == 'PUBLIC') && (lock_num < 3) )
					{
						wrong_place = true;
						strErrors += '* لاک پارکینگ عمومی حداقل سه است';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("REST_AREAS") > -1)
				{
					if ( (venueServices.indexOf("RESTROOMS") > -1) && (!venue.isPoint()) ){ // Should be as point
						wrong_place = true;
						strErrors += '* سرویس بهداشتی جدا باید به صورت نقطه ای با تیک سرویس باشد';
						strErrors += '\n';
					}
					else if (venueServices.indexOf("RESTROOMS") == -1)
					{
						wrong_place = true;
						strErrors += '* اگر اینجا سرویس بهداشتی است، تیک سرویس بهداشتی را نیز بزنید';
						strErrors += '\n';
					}
				}
				else if (venueCategories.indexOf("JUNCTION_INTERCHANGE") > -1)
				{
					for (var ven_obj in W['model']['venues']['objects']) {
						var ven_obj_id = W['model']['venues']['getObjectById'](ven_obj);
						// If segment object is visible
						if (!W.map.getExtent().intersectsBounds(ven_obj_id.geometry.getBounds())){
							continue;
						}
						if (ven_obj_id.attributes.categories.indexOf("JUNCTION_INTERCHANGE") == -1)
						{
							continue;
						}
						if (venue.attributes.id == ven_obj_id.attributes.id)
						{
							continue;
						}
						if (venue['geometry']['intersects'](ven_obj_id['geometry'])) {
							wrong_place = true;
							strErrors += '* میدان یا تقاطع روی هم رسم شده اند';
							strErrors += '\n';
						}
					}

					var venueStreetObj = ((typeof venue.attributes.streetID == 'undefined' || venue.attributes.streetID == null) ? null : Waze.model.streets.get(venue.attributes.streetID));
					var venueStreetName = (venueStreetObj ? venueStreetObj.name : null);
					if (venue.isPoint()){ // Should be as polygon
						wrong_place = true;
						strErrors += '* میدان یا تقاطع باید به صورت محیطی باشد';
						strErrors += '\n';
					}
					else if (venueStreetName){
						wrong_place = true;
						strErrors += '* اگر اینجا میدان است نام خیابان را حذف نمایید';
						strErrors += '\n';
					}
					else if (lock_num < 3)
					{
						wrong_place = true;
						strErrors += '* لاک مکان میدان یا تقاطع حداقل سه باشد';
						strErrors += '\n';
					}
					else if (venueName && !venueName.match(/Sq\s-/i)) {
						wrong_place = true;
						strErrors += '* اگر اینجا میدان است عبارت Sq را نیز در نام اضافه کنید';
						strErrors += '\n';
					}
					else if (venueName && !venueName.match(/میدان/)) {
						wrong_place = true;
						strErrors += '* اگر اینجا میدان است کلمه میدان را نیز درنام اضافه کنید';
						strErrors += '\n';
					}
				}
				else if ( (venueCategories.length==1) && (venueCategories.indexOf("ATM") > -1) )
				{
					wrong_place = true;
					strErrors += '* در بانک‌ها یا دیگر دسته‌بندی‌هایی که در آن‌ها خودپرداز وجود دارد، نیازی به ایجاد یک مکان جداگانه برای خودپرداز نمی‌باشد';
					strErrors += '\n';
				}
			}
			if ( (venueName.match(/سرویس بهداشتی/)) && ((venueCategories.indexOf("REST_AREAS") == -1)) ){
				wrong_place = true;
				strErrors += '* سرویس بهداشتی باید در دسته بندی استراحتگاه قرار گیرد';
				strErrors += '\n';
			}

			if ( (venueName.match(/بوستان\s/) || venueName.match(/پارک\s/)) && ((venueCategories.indexOf("PARK") == -1)) ){
				wrong_place = true;
				strErrors += '* پارک یا بوستان باید در دسته بندی پارک قرار گیرد';
				strErrors += '\n';
			}

			if (wrong_place){
				if (poly.getElementsByTagName('title').length < 1)
				{
					var nodeTitle = document.createElementNS("http://www.w3.org/2000/svg", 'title');
					var errors = document.createTextNode(strErrors.trim());
					nodeTitle.appendChild(errors);

					poly.appendChild(nodeTitle);
				}


				if (venue.isPoint())
				{
					  poly.setAttribute("stroke-dasharray", "3 3");
					  poly.setAttribute("stroke", Color_WrongPlace);
				}
				else
				{
				  poly.setAttribute("fill", Color_WrongPlace);
				  poly.setAttribute("fill-opacity", "0.6");
				  poly.setAttribute("stroke-dasharray", "3 6");
				  poly.setAttribute("stroke-width", "3");
				}
			}

		  } // End of for
	  }
	  
	  saveSettings();
	}


	/* My utils */
	function getElementsByClassName(classname, node) {
	  if(!node) node = document.getElementsByTagName("body")[0];
	  var a = [];
	  var re = new RegExp('\\b' + classname + '\\b');
	  var els = node.getElementsByTagName("*");
	  for (var i=0,j=els.length; i<j; i++)
		if (re.test(els[i].className)) a.push(els[i]);
	  return a;
	}

	function getId(node) {
	  return document.getElementById(node);
	}

	bootstrap();
})();