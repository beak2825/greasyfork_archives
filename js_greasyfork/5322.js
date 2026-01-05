// ==UserScript==
// @name                WME Data Store
// @author              davielde
// @description         Store objects when panning the map to compile lists for export (i.e. cities, places, segments, URs)
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.7.2
// @grant               none
// @namespace           https://greasyfork.org/users/5252
// @downloadURL https://update.greasyfork.org/scripts/5322/WME%20Data%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/5322/WME%20Data%20Store.meta.js
// ==/UserScript==


function bootstrapDS()
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
    
    setTimeout(initializeDS, 2000);

}

function replaceCommas(commaString){
    var noCommaString = "";
    (commaString == null ? "" : noCommaString = commaString.replace(/,/g, '.')); //commas with period
    var fullyFilteredString = noCommaString.replace(/[\n\r]/g, ' '); //new lines and carriage returns with space
    return fullyFilteredString;
}

function epsg900913to4326(init900913){
    var transformedTo4326 = init900913.transform(new OpenLayers.Projection("EPSG:900913"),new OpenLayers.Projection("EPSG:4326"));
    return transformedTo4326;
}

function prepURs(exportType,WDS_URLabel,WDS_editorCode,WDS_editorVersion){
    var center900913 = Waze.map.getCenter();
	var center4326 = epsg900913to4326(center900913);
    var urData = ['UpdateRequestID','Type','Severity','Open','Resolution','Comment',
                  'DriveDate','ResolvedDate','ResolvedTime','ResolvedByName','ResolvedByRank',
                  //'Problem',
                  'Permalink'
                   ];
    try{
        var currentURs = Waze.model.mapUpdateRequests.additionalInfo.clone();
        for(i=0; i<currentURs.length; i++)
      	{
            var urResolution = '';
            var urID = currentURs[i].attributes.id;
            var urTypeText = currentURs[i].attributes.typeText;
            var urSeverity = currentURs[i].attributes.severity;
            var urOpen = currentURs[i].attributes.open;
            switch(currentURs[i].attributes.open){
                	case true: 
                    	urResolution = 'Open';
                    break;
                	case false: 
                    	switch(currentURs[i].attributes.resolution){
                            case 0: 
                                urResolution = 'Solved';
                                break;
                            case 1: 
                                urResolution = 'Not Identified';
                                break;
                        };
                    break;
            	};
            var urHasComments = currentURs[i].attributes.hasComments;
            var urDriveDateTime = new Date(parseInt(currentURs[i].attributes.driveDate));
            var urDriveDate = urDriveDateTime.toLocaleDateString();
            var urResolvedOn = new Date(parseInt(currentURs[i].attributes.resolvedOn));
            var urResolvedOnDate = ((currentURs[i].attributes.resolvedOn === null) ? null : urResolvedOn.toLocaleDateString());
            var urResolvedOnTime = ((currentURs[i].attributes.resolvedOn === null) ? null : urResolvedOn.toLocaleTimeString());
            var urResolvedByUserObj = ((currentURs[i].attributes.resolvedOn === null) ? null : Waze.model.users.get(currentURs[i].attributes.resolvedBy));
            var urResolvedByName = ((typeof urResolvedByUserObj == 'undefined' || urResolvedByUserObj == null) ? "" : replaceCommas(urResolvedByUserObj.userName));
            var urResolvedByRank = ((typeof urResolvedByUserObj == 'undefined' || urResolvedByUserObj == null) ? "" : urResolvedByUserObj.rank + 1);
            var urDescription = replaceCommas(currentURs[i].attributes.description);
            var urGeometry = new OpenLayers.Geometry.Point(currentURs[i].attributes.geometry.x,currentURs[i].attributes.geometry.y).transform(Waze.map.getProjectionObject(),new OpenLayers.Projection("EPSG:4326"));
            console.log(urGeometry);
            var urPermalink = WDS_editorVersion + '?env=' + WDS_editorCode + '&lon=' + urGeometry.x + '&lat=' + urGeometry.y +'&zoom=6&mapUpdateRequest=' + currentURs[i].attributes.id;

            urData.push('\n'+urID,urTypeText,urSeverity,urOpen,urResolution,urHasComments,
                            urDriveDate,urResolvedOnDate,urResolvedOnTime,urResolvedByName,urResolvedByRank,
                        	//urDescription,
                        	urPermalink
                         ); 
      	} 
        
        if(exportType == 'csv'){
            $('#WDS_URs').each(function(){ 
               this.href = 'data:text/csv;base64,' + btoa(urData);
               this.download = 'URs_' + center4326.lon + '_' + center4326.lat + '.csv';
            });
        }
    }
    catch(e){
        console.log('WME Data Store: unable to process UR list, ' + e);
    }  
}

function prepCities(exportType,WDS_cityLabel,WDS_editorCode,WDS_editorVersion){
    var center900913 = Waze.map.getCenter();
	var center4326 = epsg900913to4326(center900913);
    var cityData = ['CountryID','Country','StateID','State','CityID',
                    'CityName','CityEnglishName','IsEmpty','Permalink'
                   ];
    try{
        var currentCities = Waze.model.cities.additionalInfo.clone();
        for(i=0; i<currentCities.length; i++)
      	{
            var stateObj = Waze.model.states.get(currentCities[i].stateID);
            var stateName = replaceCommas(stateObj.name);
            var countryObj = Waze.model.countries.get(currentCities[i].countryID);
            var countryName = replaceCommas(countryObj.name);
            var cityPermalink = WDS_editorVersion + '?env=' + WDS_editorCode + '&lon=' + center4326.lon + '&lat=' + center4326.lat +'&zoom=0';

            cityData.push('\n'+currentCities[i].countryID,countryName,currentCities[i].stateID,stateName,
                          currentCities[i].id,currentCities[i].name,currentCities[i].englishName,currentCities[i].isEmpty,cityPermalink
                         );
      	} 
        
        if(exportType == 'csv'){
            $('#WDS_'+WDS_cityLabel).each(function(){ 
               this.href = 'data:text/csv;base64,' + btoa(cityData);
               this.download = WDS_cityLabel + '_' + center4326.lon + '_' + center4326.lat + '.csv';
            });
        }
    }
    catch(e){
        console.log('WME Data Store: unable to process city list, ' + e);
    }  
}

function prepVenues(exportType,WDS_venueLabel,WDS_editorCode,WDS_editorVersion){
	var center900913 = Waze.map.getCenter();
	var center4326 = epsg900913to4326(center900913);
    var venueImageBucketUrl = Waze.Config.venues.image_bucket_url;
    var venueData = ['PlaceID','PlaceName','FirstAltName','Brand','Lock','PrimaryCategory','Type','PublicOrPrivate','PlaceApproved',
                         'Description','Phone','Website','UpdateRequestCount','CountryName','StateName','CityName','StreetName','HouseNumber','NumHours','NumServices',
                         'CreateDate','CreatedByName','CreatedByRank','UpdateDate','UpdatedByName','UpdatedByRank','Permalink',
                         'ImageCount','PrimaryImageThumbnail','ImageApproved','ImageUserName','ImageUserRank','ImageDate'
                        ];
    try{
        var currentVenues = Waze.model.venues.additionalInfo.clone();
        var wdsVenueDataObj = {};
        var wdsVenueDataArray = [];
        if(currentVenues.length>0){
            for(i=0; i<currentVenues.length; i++)
            {
                var venueType = '';
                var venueID = currentVenues[i].attributes.id;
                var venueName = ((typeof currentVenues[i].attributes.name == 'undefined' || currentVenues[i].attributes.name == null) ? "" :replaceCommas(currentVenues[i].attributes.name));
                if(currentVenues[i].attributes.geometry.CLASS_NAME == 'OpenLayers.Geometry.Point'){venueType = 'Point';}else{venueType = 'Area';}
                var venueLockRank = currentVenues[i].attributes.lockRank + 1;
                var venueApproved = currentVenues[i].attributes.approved;
                var venueDescription = ((typeof currentVenues[i].attributes.description == 'undefined' || currentVenues[i].attributes.description == null) ? "" : replaceCommas(currentVenues[i].attributes.description.substring(0,100))); //limit to 100 characters
                var venueUpdateRequest = ((currentVenues[i].attributes.venueUpdateRequests[0] == null) ? 0 : currentVenues[i].attributes.venueUpdateRequests.length);
                var venueBrand = currentVenues[i].attributes.brand;
                var venuePrimaryCategory = I18n.translations[I18n.locale].venues.categories[currentVenues[i].attributes.categories[0]];
                var venueResidential = ((currentVenues[i].attributes.residential == false) ? 'Public' : 'Private');
                
                var venuePhoneNumber = currentVenues[i].attributes.phone;
                var venueWebsite = currentVenues[i].attributes.url;
                var venueNumAlternateNames = currentVenues[i].attributes.aliases.length;
                var venueFirstAlternateName = currentVenues[i].attributes.aliases[0];
                var venueNumHours = currentVenues[i].attributes.openingHours.length;
                var venueNumServices = currentVenues[i].attributes.services.length;
                
                var venueAddressNumber = ((typeof currentVenues[i].attributes.houseNumber == 'undefined') ? "" : currentVenues[i].attributes.houseNumber);
                var venueStreetObj = ((typeof currentVenues[i].attributes.streetID == 'undefined' || currentVenues[i].attributes.streetID == null) ? "" : Waze.model.streets.get(currentVenues[i].attributes.streetID));
                var venueStreetName = ((typeof venueStreetObj == 'undefined' || currentVenues[i].attributes.streetID == null) ? "" : replaceCommas(venueStreetObj.name));
                var venueCityObj = ((venueStreetObj == null) ? null : Waze.model.cities.get(venueStreetObj.cityID));
                var venueCityName = ((typeof venueCityObj == 'undefined' || venueCityObj == null) ? "" : replaceCommas(venueCityObj.name));
                var venueStateObj = ((venueCityObj == null) ? null : Waze.model.states.get(venueCityObj.stateID));
                var venueStateName = ((typeof venueStateObj == 'undefined' || venueStateObj == null) ? "" : replaceCommas(venueStateObj.name));
                var venueCountryObj = ((venueStateObj == null) ? null : Waze.model.countries.get(venueCityObj.countryID));
                var venueCountryName = ((typeof venueCountryObj == 'undefined' || venueCountryObj == null) ? "" : replaceCommas(venueCountryObj.name));
                
                var venueCreatedOn = new Date(parseInt(currentVenues[i].attributes.createdOn));
                var venueCreatedOnDate = venueCreatedOn.toLocaleDateString();
                var venueCreatedOnTime = venueCreatedOn.toLocaleTimeString();
                var venueCreatedByUserObj = Waze.model.users.get(currentVenues[i].attributes.createdBy);
                var venueCreatedByName = ((typeof venueCreatedByUserObj == 'undefined' || venueCreatedByUserObj == null) ? "" : venueCreatedByUserObj.userName);
                var venueCreatedByRank = ((typeof venueCreatedByUserObj == 'undefined' || venueCreatedByUserObj == null) ? "" : venueCreatedByUserObj.rank + 1);
                var venueUpdatedOn = ((typeof currentVenues[i].attributes.updatedOn == 'undefined' || currentVenues[i].attributes.updatedOn == null) ? "" : new Date(parseInt(currentVenues[i].attributes.updatedOn)));
                var venueUpdatedOnDate = (venueUpdatedOn == "" ? "" : venueUpdatedOn.toLocaleDateString());
                var venueUpdatedOnTime = (venueUpdatedOn == "" ? "" : venueUpdatedOn.toLocaleTimeString());   
                var venueUpdatedByUserObj = ((typeof currentVenues[i].attributes.updatedOn == 'undefined' || currentVenues[i].attributes.updatedOn == null) ? null : Waze.model.users.get(currentVenues[i].attributes.updatedBy));
                var venueUpdatedByName = ((typeof venueUpdatedByUserObj == 'undefined' || venueUpdatedByUserObj == null) ? "" : replaceCommas(venueUpdatedByUserObj.userName));
                var venueUpdatedByRank = ((typeof venueUpdatedByUserObj == 'undefined' || venueUpdatedByUserObj == null) ? "" : venueUpdatedByUserObj.rank + 1);
                var venueCentroid =  epsg900913to4326(currentVenues[i].attributes.geometry.getCentroid());
                var venuePermalink = WDS_editorVersion + '?env=' + WDS_editorCode + '&lon=' + venueCentroid.x + '&lat=' + venueCentroid.y +'&zoom=6&venues=' + venueID;
                
                var venueImage = ((currentVenues[i].attributes.images[0] == null) ? 0 : currentVenues[i].attributes.images.length);
                var venuePrimaryImageID = ((currentVenues[i].attributes.images[0] == null) ? null : currentVenues[i].attributes.images[0].attributes.id);
                var venuePrimaryImageApproved = ((currentVenues[i].attributes.images[0] == null) ? null : currentVenues[i].attributes.images[0].attributes.approved);
                var venuePrimaryImageLink = ((currentVenues[i].attributes.images[0] == null) ? "" : venueImageBucketUrl + 'thumbs/thumb347_' + venuePrimaryImageID);
                var venuePrimaryImageUserObj = ((currentVenues[i].attributes.images[0] == null) ? null : Waze.model.users.get(currentVenues[i].attributes.images[0].attributes.creatorUserId));
                var venuePrimaryImageUserName = ((venuePrimaryImageUserObj == null) ? "" : replaceCommas(venuePrimaryImageUserObj.userName));
                var venuePrimaryImageUserRank = ((venuePrimaryImageUserObj == null) ? "" : venuePrimaryImageUserObj.rank + 1);
                var venuePrimaryImageDateTime = ((currentVenues[i].attributes.images[0] == null) ? "" : new Date(parseInt(currentVenues[i].attributes.images[0].attributes.date)));
                var venuePrimaryImageDate = (venuePrimaryImageDateTime == "" ? "" : venuePrimaryImageDateTime.toLocaleDateString());
                
                venueData.push('\n'+venueID,venueName,venueFirstAlternateName,venueBrand,venueLockRank,venuePrimaryCategory,venueType,venueResidential,venueApproved,
                               venueDescription,venuePhoneNumber,venueWebsite,venueUpdateRequest,venueCountryName,venueStateName,venueCityName,venueStreetName,venueAddressNumber,venueNumHours,venueNumServices,
                               venueCreatedOnDate,venueCreatedByName,venueCreatedByRank,venueUpdatedOnDate,venueUpdatedByName,venueUpdatedByRank,venuePermalink,
                               venueImage,venuePrimaryImageLink,venuePrimaryImageApproved,venuePrimaryImageUserName,venuePrimaryImageUserRank,venuePrimaryImageDate
                              );
            }
            if(exportType == 'csv'){
                $('#WDS_'+WDS_venueLabel).each(function(){ 
                   this.href = 'data:text/csv;base64,' + btoa(venueData);
                   this.download = WDS_venueLabel + '_' + center4326.lon + '_' + center4326.lat + '.csv';
                });
            }
        }
    }
    catch(e){
        console.log('WME Data Store: unable to process venue list, ' + e);
    }  
}

function prepSegments(exportType,WDS_segmentLabel,WDS_editorCode,WDS_editorVersion){
    var center900913 = Waze.map.getCenter();
	var center4326 = epsg900913to4326(center900913);
	var segmentData = ['SegmentID','CountryName','StateName','CityName','PrimaryStreetName','RoadType','RoadTypeName',
                           'FwdToll','ReverseToll','FwdDirection','ReverseDirection','Elevation','Rank','LengthInMeters','ClosureCount',
                           'CreateDate','CreatedByName','CreatedByRank','UpdateDate','UpdatedByName','UpdatedByRank','Permalink'
                          ];    
    if(Waze.map.zoom < 3){
        alert('WME Data Store: Zoom must increase to 3+ to load primary segments or 4+ to load all segments','WME Data Store');
    }
    else{
        try{
            var currentSegments = Waze.model.segments.additionalInfo.clone();
            var statsSegMaxUpdate = '';
            var statsDistinctEditors = {};
            var wdsSegmentDataObj = {};
            var wdsSegmentDataArray = [];
			
            if(currentSegments.length>0){
                for(i=0; i<currentSegments.length; i++)
                {
                    var segmentID = currentSegments[i].attributes.id;
                    var primaryStreetObj = Waze.model.streets.get(currentSegments[i].attributes.primaryStreetID);
                    var primaryStreetName = ((typeof primaryStreetObj == 'undefined' || primaryStreetObj.name == null) ? "" : replaceCommas(primaryStreetObj.name));
                    var segCityObj = ((primaryStreetObj == null) ? null : Waze.model.cities.get(primaryStreetObj.cityID));
                    var segCityName = ((typeof segCityObj == 'undefined' || segCityObj.name == null) ? "" : replaceCommas(segCityObj.name));
                    var segStateObj = ((segCityObj == null) ? null : Waze.model.states.get(segCityObj.stateID));
                    var segStateName = ((typeof segStateObj == 'undefined' || segStateObj.name == null) ? "" : replaceCommas(segStateObj.name));
                    var segCountryObj = ((segCityObj == null) ? null : Waze.model.countries.get(segCityObj.countryID));
                    var segCountryName = ((typeof segCountryObj == 'undefined' || segCountryObj.name == null) ? "" : replaceCommas(segCountryObj.name));
                    var segRoadType = currentSegments[i].attributes.roadType;
                    var segRoadTypeName = I18n.translations[I18n.locale].segment.road_types[segRoadType];
                    var segCreatedOn = new Date(parseInt(currentSegments[i].attributes.createdOn));
                    var segCreatedOnDate = segCreatedOn.toLocaleDateString();
                    var segCreatedOnTime = segCreatedOn.toLocaleTimeString();
                    var segCreatedByUserObj = Waze.model.users.get(currentSegments[i].attributes.createdBy);
                    var segCreatedByName = ((segCreatedByUserObj == null) ? "" : replaceCommas(segCreatedByUserObj.userName));
                    var segCreatedByRank = ((segCreatedByUserObj == null) ? "" : segCreatedByUserObj.rank + 1);
                    var segUpdatedOn = ((currentSegments[i].attributes.updatedOn == null) ? "" : new Date(parseInt(currentSegments[i].attributes.updatedOn))); //segments with no updates will throw errors
                    var segUpdatedOnDate = (segUpdatedOn == "" ? "" : segUpdatedOn.toLocaleDateString());
                    var segUpdatedOnTime = (segUpdatedOn == "" ? "" : segUpdatedOn.toLocaleTimeString());
                    var segUpdatedByUserObj = ((currentSegments[i].attributes.updatedOn == null) ? "" : Waze.model.users.get(currentSegments[i].attributes.updatedBy));
                    var segUpdatedByName = ((segUpdatedByUserObj == "") ? "" : replaceCommas(segUpdatedByUserObj.userName));
                    var segUpdatedByRank = ((currentSegments[i].attributes.updatedOn == null) ? "" : segUpdatedByUserObj.rank + 1);
                    var segFwdToll = currentSegments[i].attributes.fwdToll;
                    var segRevToll = currentSegments[i].attributes.revToll;
                    var segFwdDirection = currentSegments[i].attributes.fwdDirection;
                    var segRevDirection = currentSegments[i].attributes.revDirection;
                    var segElevation = currentSegments[i].attributes.level;
                    var segRank = currentSegments[i].attributes.lockRank + 1;
                    var segLength = currentSegments[i].attributes.length;
                    var segClosures = currentSegments[i].attributes.closuresCount;
                    var segCentroid = epsg900913to4326(currentSegments[i].geometry.getCentroid());
                    var segPermalink = WDS_editorVersion + '?env=' + WDS_editorCode + '&lon=' + segCentroid.x + '&lat=' + segCentroid.y +'&zoom=5&segments=' + segmentID;
        
                    segmentData.push('\n'+segmentID,segCountryName,segStateName,segCityName,primaryStreetName,segRoadType,segRoadTypeName,
                                     segFwdToll,segRevToll,segFwdDirection,segRevDirection,segElevation,segRank,segLength,segClosures,
                                     segCreatedOnDate,segCreatedByName,segCreatedByRank,segUpdatedOnDate,segUpdatedByName,segUpdatedByRank,segPermalink
                                    );
                }
                
                if(exportType == 'csv'){
                    $('#WDS_'+WDS_segmentLabel).each(function(){ 
                       this.href = 'data:text/csv;base64,' + btoa(segmentData);
                       this.download = WDS_segmentLabel + '_' + center4326.lon + '_' + center4326.lat + '.csv';
                    });
                }
            }
        }
        catch(e){
            console.log('WME Data Store: unable to process segment list, ' + e);
        }  
    }
}


function initializeDS(){    

    var WDS_cityLabel = I18n.translations[I18n.locale].layers.name.cities;
    var WDS_venueLabel = I18n.translations[I18n.locale].layers.name.landmarks;
    var WDS_segmentLabel = I18n.translations[I18n.locale].layers.name.segments;
    var WDS_urLabel = I18n.translations[I18n.locale].layers.name.update_requests;
    var WDS_editorCode = Waze.location.code;
    var WDS_editorVersion = '';

    if(I18n.locale == 'en' && Waze.Config.api_base == "/Descartes-beta/app"){
        WDS_editorVersion = 'https://editor-beta.waze.com/editor/';
    }
    else if(I18n.locale == 'en'){
        WDS_editorVersion = 'https://www.waze.com/editor/';
    }
    else if(Waze.Config.api_base == "/Descartes-beta/app"){
      WDS_editorVersion = 'https://editor-beta.waze.com/' + I18n.locale + '/editor/';
    }
    else{
      WDS_editorVersion = 'https://www.waze.com/' + I18n.locale + '/editor/';
    }
    
	  //WDS artifacts
    $(document.body).append('<div id="WDS_menu"/>');
    $('#WDS_menu').css({
        position:'absolute',
        bottom:'35px',
        left:'425px',
        text:'white',
        backgroundColor:'transparent',
        borderWidth:'2px',
        borderStyle:'groove',
        boxShadow:'1px 1px 1px Grey',
        padding:'1px',
        color:'#F8F8F8'
    	});  
    
    $('#WDS_menu').append('<img id="WDS_icon" src="data:image/png;base64,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" />');
    $('#WDS_menu').append('<a id="WDS_' + WDS_cityLabel + '" download="" href=""/>');
    $('#WDS_menu').append('<a id="WDS_' + WDS_venueLabel + '"/>');
    $('#WDS_menu').append('<a id="WDS_' + WDS_segmentLabel + '"/>');
    $('#WDS_menu').append('<a id="WDS_URs"/>');
    $('#WDS_'+WDS_cityLabel).text(WDS_cityLabel+' ').css({color:'#F8F8F8',cursor:'pointer'});
    $('#WDS_'+WDS_venueLabel).text(WDS_venueLabel+' ').css({color:'#F8F8F8',cursor:'pointer'});
    $('#WDS_'+WDS_segmentLabel).text(WDS_segmentLabel+' ').css({color:'#F8F8F8',cursor:'pointer'});
    $('#WDS_URs').text('URs'+' ').css({color:'#F8F8F8',cursor:'pointer'});
    
    $('#WDS_'+WDS_cityLabel).click(function(){
    	prepCities('csv',WDS_cityLabel,WDS_editorCode,WDS_editorVersion);
    });
    $('#WDS_'+WDS_venueLabel).click(function(){
    	prepVenues('csv',WDS_venueLabel,WDS_editorCode,WDS_editorVersion);
    });
    $('#WDS_'+WDS_segmentLabel).click(function(){
        prepSegments('csv',WDS_segmentLabel,WDS_editorCode,WDS_editorVersion);
    });
    $('#WDS_URs').click(function(){
        prepURs('csv',WDS_urLabel,WDS_editorCode,WDS_editorVersion);
    });

    console.log('WME Data Store: ready');

}

bootstrapDS();