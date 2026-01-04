// ==UserScript==
// @name         Geoguessr Map-Making Auto-Tag
// @namespace    https://greasyfork.org/users/1179204
// @version      3.90.4
// @description  Tag your panos by date, exactTime, address, generation, elevation
// @icon         https://www.svgrepo.com/show/423677/tag-price-label.svg
// @author       KaKa
// @license      BSD
// @match        *://map-making.app/maps/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require      https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js
// @require      https://cdn.jsdelivr.net/npm/browser-geo-tz@0.1.0/dist/geotz.min.js
// @downloadURL https://update.greasyfork.org/scripts/475933/Geoguessr%20Map-Making%20Auto-Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/475933/Geoguessr%20Map-Making%20Auto-Tag.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let accuracy=60 /* You could modifiy accuracy here, default setting is 60s */

    let tagBox = ['Year', 'Month','Day', 'Time','Sun','Weather','Type','Country', 'Subdivision', 'Road','Generation', 'Elevation','Update Type','Driving Direction','Pan to Sun','Reset Heading','Update','Fix']

    let months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December'];

    let tooltips = {
        'Year': 'Year of pano in format yyyy',
        'Month': 'Month of pano in format yy-mm',
        'Day': 'Specific date of pano in format yyyy-mm-dd',
        'Time': 'Exact time of pano with optional time range description, e.g., 09:35:21 marked as Morning',
        'Country': 'Country of pano (Google data)',
        'Subdivision': 'Primary administrative subdivision of pano location',
        'Road': 'Road name of pano location',
        'Generation': 'Camera generation of pano, categorized as Gen1, Gen2orGen3, Gen3, Gen4, BadCam',
        'Elevation': 'Elevation of street view location (Google data)',
        'Brightness':'Average brightness of pano',
        'Type': 'Type of pano, categorized as Official, Unofficial, Trekker/Tripod',
        'Driving Direction': 'Absolute driving direction of streetview vehicle',
        'Reset Heading': 'Reset heading to default driving direction',
        'Update Type':'Determine whether the location is newroad or or gen1update or ariupdate or gen2/3update or gen4update',
        'Fix': 'Fix broken locs by updating to latest coverage or searching for specific coverage based on saved date from map-making',
        'Update': 'Update pano to latest coverage or based on saved date from map-making, effective only for locs with panoID',
        'Detect': "Detect pano that is about to be removed and mark it as 'Dangerous' ",
        'Sun':'Detect whether it is sunset or sunrise coverage(effective only for defalut coverage)',
        'Pan to Sun':'Make pano heading to sun(moon),effective only for defalut coverage',
        'Weather':'Weather type recorded by the closest weather station closest, with an accuracy of 10mins(effective only for defalut coverage)',
    };

    const weatherCodeMap = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Mostly cloudy',
        4: 'Overcast',
        61:'Slight Rain',
        63:'Moderate Rain',
        65:'Heavy Rain',
        51:'Light Drizzle',
        53:'Moderate Drizzle',
        55:'Dense Drizzle',
        77:'Snow',
        85:'Slight Snow',
        86:'Heavy Snow',
    };

    function deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        const datePattern = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([.,]\d{1,3})?Z?)$/;

        if (Array.isArray(obj)) {
            return obj.map(item => deepClone(item));
        }

        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }

        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'string' && datePattern.test(obj[key])) {
                        clonedObj[key] = new Date(obj[key]);
                    } else {
                        clonedObj[key] = deepClone(obj[key]);
                    }
                }
            }
            return clonedObj;
        }

        return obj;
    }

    function getSelection() {
        const editor = unsafeWindow.editor;
        if (editor) {
            const selectedLocs = editor.selections;
            const selections = deepClone(
                selectedLocs.flatMap(selection => selection.locations)
            );
            return selections;
        }
    }

    function updateLocation(o,n) {
        const editor=unsafeWindow.editor
        if (editor){
            editor.removeLocations(o)
            editor.importLocations(n)
        }
    }

    function findRange(elevation, ranges) {
        for (let i = 0; i < ranges.length; i++) {
            const range = ranges[i];
            if (elevation >= range.min && elevation <= range.max) {
                return `${range.min}-${range.max}m`;
            }
        }
        if (!elevation) {
            return 'noElevation';
        }
        return `${JSON.stringify(elevation)}m`;
    }

    async function fetchGooglePanorama(t, e, s, d,r) {
        try {
            const u = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/${t}`;
            let payload = createPayload(t, e,s,d,r);

            const response = await fetch(u, {
                method: "POST",
                headers: {
                    "content-type": "application/json+protobuf",
                    "x-user-agent": "grpc-web-javascript/0.1"
                },
                body: payload,
                mode: "cors",
                credentials: "omit"
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            } else {
                return await response.json();
            }
        } catch (error) {
            console.error(`Error fetching google panorama: ${error.message}`);
        }
    }

    function createPayload(mode,coorData,s,d,r) {
        let payload;
        if(!r)r=50 // default search radius
        if (mode === 'GetMetadata') {
            payload = [["apiv3",null,null,null,"US",null,null,null,null,null,[[0]]],["en","US"],[[[2,coorData]]],[[1,2,3,4,8,6]]];
        } else if (mode === 'SingleImageSearch') {

            if(s&&d){
                payload=[["apiv3"],[[null,null,coorData.lat,coorData.lng],r],[[null,null,null,null,null,null,null,null,null,null,[s,d]],null,null,null,null,null,null,null,[2],null,[[[2,true,2]]]],[[2,6]]]
            }else{
                payload =[["apiv3"],
                          [[null,null,coorData.lat,coorData.lng],r],
                          [null,["en","US"],null,null,null,null,null,null,[2],null,[[[2,true,2]]]], [[1,2,3,4,8,6]]];}
        } else {
            throw new Error("Invalid mode!");
        }
        return JSON.stringify(payload);
    }

    async function runScript(tags,sR) {
        let taggedLocs=[]
        let exportMode,selections,fixStrategy

        if (tags.length<1){
            swal.fire('Feature not found!', 'Please select at least one feature!','warning')
            return}
        if (tags.includes('fix')){
            const { value: fixOption,dismiss: fixDismiss } = await Swal.fire({
                title:'Fix Strategy',
                icon:'question',
                text: 'Would you like to fix the location based on the map-making data. (more suitable for those locs with a specific date coverage) Else it will update the broken loc with recent coverage.',
                showCancelButton: true,
                showCloseButton:true,
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',

            })
            if(fixOption)fixStrategy='exactly'
            else if(!fixOption&&fixDismiss==='cancel'){
                fixStrategy=null
            }
            else{
                return
            }
        };

        const { value: option, dismiss: inputDismiss } = await Swal.fire({
            title: 'Export',
            text: 'Do you want to update and save your map? If you click "Cancel", the script will just paste JSON data to the clipboard after finish tagging.',
            icon: 'question',
            showCancelButton: true,
            showCloseButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        });

        if (option) {
            exportMode = 'save'
        }
        else if (!selections && inputDismiss === 'cancel') {
            exportMode = false
        }
        else {
            return
        }

        selections=getSelection()

        if (!selections||selections.length<1){
            swal.fire('Selection not found!', 'Please select at least one location as selection!','warning')
            return
        }

        var CHUNK_SIZE = 1200;
        if (tags.includes('time')){
            CHUNK_SIZE = 1000
        }
        var promises = [];

        if(selections){
            if(selections.length>=1){processData(tags);}
            else{
                Swal.fire('Error Parsing JSON Data!', 'The input JSON data is empty! If you update the map after the page is loaded, please save it and refresh the page before tagging','error');}
        }else{Swal.fire('Error Parsing JSON Data!', 'The input JSON data is invaild or incorrectly formatted.','error');}

        function monthToTimestamp(m) {

            const [year, month] = m.split('-');

            const startDate =Math.round( new Date(year, month-1,1).getTime()/1000);

            const endDate =Math.round( new Date(year, month, 1).getTime()/1000)-1;

            return { startDate, endDate };
        }

        async function binarySearch(c, start,end) {
            let capture
            let response
            while (end - start >= accuracy) {
                let mid= Math.round((start + end) / 2);
                response = await fetchGooglePanorama("SingleImageSearch", c, start,end,15);
                if (response&&response[0][2]== "Search returned no images." ){
                    start=mid+start-end
                    end=start-mid+end
                    mid=Math.round((start+end)/2)
                } else {
                    start=mid
                    mid=Math.round((start+end)/2)
                }
                capture=mid
            }

            return capture
        }

        function getMetaData(svData) {
            let year = 'Year not found',month = 'Month not found'
            let panoType='unofficial'
            let subdivision='Subdivision not found'
            let defaultHeading=0
            if (svData) {
                if (svData.imageDate) {
                    const matchYear = svData.imageDate.match(/\d{4}/);
                    if (matchYear) {
                        year = matchYear[0];
                    }

                    const matchMonth = svData.imageDate.match(/-(\d{2})/);
                    if (matchMonth) {
                        month = matchMonth[1];
                    }
                }
                if (svData.copyright.includes('Google')) {
                    panoType = 'Official';
                }
                if (svData.tiles&&svData.tiles&&svData.tiles.originHeading){
                    defaultHeading=svData.tiles.originHeading
                }
                if(svData.location.description){
                    let parts = svData.location.description.split(',');
                    if(parts.length > 1){
                        subdivision = parts[parts.length-1].trim();
                    } else {
                        subdivision = svData.location.description;
                    }
                }

            }

            return [year,month,panoType,subdivision,defaultHeading]
        }

        function extractDate(array) {
            let year, month;

            array.forEach(element => {
                const yearRegex1 = /^(\d{2})-(\d{2})$/; // Matches yy-mm
                const yearRegex2 = /^(\d{4})-(\d{2})$/; // Matches yyyy-mm
                const yearRegex3 = /^(\d{4})$/; // Matches yyyy
                const monthRegex1 = /^(\d{2})$/; // Matches mm
                const monthRegex2 = /^(January|February|March|April|May|June|July|August|September|October|November|December)$/i; // Matches month names

                if (!month && yearRegex1.test(element)) {
                    const match = yearRegex1.exec(element);
                    year = parseInt(match[1]) + 2000; // Convert to full year
                    month = parseInt(match[2]);
                }

                if (!month && yearRegex2.test(element)) {
                    const match = yearRegex2.exec(element);
                    year = parseInt(match[1]);
                    month = parseInt(match[2]);
                }

                if (!year && yearRegex3.test(element)) {
                    year = parseInt(element);
                }

                if (!month && monthRegex1.test(element)) {
                    month = parseInt(element);
                }

                if (!month && monthRegex2.test(element)) {
                    const months = {
                        "January": 1, "February": 2, "March": 3, "April": 4,
                        "May": 5, "June": 6, "July": 7, "August": 8,
                        "September": 9, "October": 10, "November": 11, "December": 12
                    };
                    month = months[element];
                }
            });
            return {year,month}
        }

        function getDirection(heading) {
            if (typeof heading !== 'number' || heading < 0 || heading >= 360) {
                return 'Unknown direction';
            }
            const directions = [
                { name: 'North', range: [337.5, 22.5] },
                { name: 'Northeast', range: [22.5, 67.5] },
                { name: 'East', range: [67.5, 112.5] },
                { name: 'Southeast', range: [112.5, 157.5] },
                { name: 'South', range: [157.5, 202.5] },
                { name: 'Southwest', range: [202.5, 247.5] },
                { name: 'West', range: [247.5, 292.5] },
                { name: 'Northwest', range: [292.5, 337.5] }
            ];

            for (const direction of directions) {
                const [start, end] = direction.range;
                if (start <= end) {
                    if (heading >= start && heading < end) {
                        return direction.name;
                    }
                } else {
                    if (heading >= start || heading < end) {
                        return direction.name;
                    }
                }
            }

            return 'Unknown direction';
        }

        function getGeneration(svData,country) {
            let gen2Countries = ['AU', 'BR', 'CA', 'CL', 'JP', 'GB', 'IE', 'NZ', 'MX', 'RU', 'US', 'IT', 'DK', 'GR', 'RO',
                                 'PL', 'CZ', 'CH', 'SE', 'FI', 'BE', 'LU', 'NL', 'ZA', 'SG', 'TW', 'HK', 'MO', 'MC', 'SM',
                                 'AD', 'IM', 'JE', 'FR', 'DE', 'ES', 'PT', 'SJ'];
            if (svData&&svData.tiles) {
                if (svData.tiles.worldSize.height === 1664) { // Gen 1
                    return 'Gen1';
                } else if (svData.tiles.worldSize.height === 6656) { // Gen 2 or 3
                    if(country==='US'){
                        var lat;
                        for (let key in svData.Sv) {
                            lat = svData.Sv[key].lat;
                            break;
                        }
                        if(lat > 52 && (date >= new Date('2019-01'))) return 'BadCam'
                    }

                    let date;
                    if (svData.imageDate) {
                        date = new Date(svData.imageDate);
                    }

                    if (date && (date>= new Date('2022-01')||
                                 (country === 'BD' && (date >= new Date('2021-04'))) ||
                                 (country === 'FI' && (date >= new Date('2020-09'))) ||
                                 (country === 'IN' && (date >= new Date('2021-10'))) ||
                                 (country === 'LK' && (date >= new Date('2021-02'))) ||
                                 (country === 'LB' && (date >= new Date('2021-05'))) ||
                                 (country === 'NG' && (date >= new Date('2021-06'))) ||
                                 (country === 'VN' && (date >= new Date('2021-01'))))) {
                        return 'BadCam';
                    }
                    if (gen2Countries.includes(country)&&date <= new Date('2011-11')) {
                        return date >= new Date('2010-09') ?'Gen2/3':'Gen2';
                    }

                    return 'Gen3';
                }
                else if(svData.tiles.worldSize.height === 8192){
                    return 'Gen4';
                }
            }
            return 'Ari';
        }

        async function getLocal(coord, timestamp) {
            const systemTimezoneOffset = -new Date().getTimezoneOffset() * 60;

            try {
                var offset_hours
                const timezone=await GeoTZ.find(coord[0],coord[1])

                const offset = await GeoTZ.toOffset(timezone);

                if(offset){
                    offset_hours=parseInt(offset/60)
                }
                else if (offset===0) offset_hours=0
                const offsetDiff = systemTimezoneOffset -offset_hours*3600;
                const convertedTimestamp = Math.round(timestamp - offsetDiff);
                return convertedTimestamp;
            } catch (error) {
                throw error;
            }
        }

        async function getWeather(coordinate, timestamp) {
            var hours,weatherCodes
            const date = new Date(timestamp * 1000);
            const formatted_date = date.toISOString().split('T')[0]
            try {
                const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${coordinate.lat}&longitude=${coordinate.lng}&start_date=${formatted_date}&end_date=${formatted_date}&hourly=weather_code`;
                const response = await fetch(url);
                const data = await response.json();
                hours = data.hourly.time;
                weatherCodes = data.hourly.weather_code;

                const targetHour = new Date(timestamp * 1000).getHours();
                let closestHourIndex = 0;
                let minDiff = Infinity;

                for (let i = 0; i < hours.length; i++) {
                    const hour = new Date(hours[i]).getHours();
                    const diff = Math.abs(hour - targetHour);

                    if (diff < minDiff) {
                        minDiff = diff;
                        closestHourIndex = i;
                    }
                }

                const weatherCode = weatherCodes[closestHourIndex];
                const weatherDescription = weatherCodeMap[weatherCode] || 'Unknown weather code';
                return weatherDescription;

            } catch (error) {
                console.error('Error fetching weather data:', error);
                return 'Network request failed'
            }
        }

        async function processCoord(coord, tags, svData,ccData) {
            var panoYear,panoMonth
            if (tags.includes(('fix')||('update')||('detect'))){
                if (coord.panoDate){
                    panoYear=parseInt(coord.panoDate.toISOString().substring(0,4))
                    panoMonth=parseInt(coord.panoDate.toISOString().substring(5,7))
                }
                else if(svData&&svData.imageDate){
                    panoYear=parseInt(svData.imageDate.substring(0,4))
                    panoMonth=parseInt(svData.imageDate.substring(5,7))

                }
                else{
                    panoYear=parseInt(extractDate(coord.tags).year)
                    panoMonth=parseInt(extractDate(coord.tags).month)
                }
            }
            try{
                let meta=getMetaData(svData)
                let yearTag=meta[0]
                let monthTag=parseInt(meta[1])
                let typeTag=meta[2]
                let subdivisionTag=meta[3]
                let countryTag,elevationTag
                let genTag,trekkerTag,floorTag,driDirTag,weatherTag,roadTag
                let dayTag,timeTag,exactTime,timeRange
                let history, links

                //if(monthTag){monthTag=months[monthTag-1]}
                if(yearTag&&monthTag) monthTag=yearTag.slice(-2)+'-'+(monthTag.toString())
                if (!monthTag){monthTag='Month not found'}

                if(svData){
                    var date=monthToTimestamp(svData.imageDate)

                    if(tags.includes('day')||tags.includes('time')||tags.includes('sun')||tags.includes('weather')||tags.includes('pan to sun')){
                        const initialSearch=await fetchGooglePanorama('SingleImageSearch',{lat:coord.location.lat,lng:coord.location.lng},date.startDate,date.endDate,15)
                        if (initialSearch){
                            if (initialSearch.length!=3)exactTime=null;
                            else{
                                if(!tags.includes('day')) accuracy=18000
                                if(tags.includes('weather')) accuracy=600
                                if (tags.includes('sun')) accuracy=300
                                if (tags.includes('pan to sun')) accuracy=300
                                if (tags.includes('time')) accuracy=60
                                exactTime=await binarySearch({lat:coord.location.lat,lng:coord.location.lng}, date.startDate,date.endDate)
                            }
                        }
                    }
                }

                if(!exactTime){dayTag='Day not found'
                               timeTag='Time not found'}
                else{

                    if (tags.includes('day')){
                        const currentDate = new Date();
                        const currentOffset =-(currentDate.getTimezoneOffset())*60
                        const dayOffset = currentOffset-Math.round((coord.location.lng / 15) * 3600);
                        const LocalDay=new Date(Math.round(exactTime-dayOffset)*1000)
                        dayTag = LocalDay.toISOString().split('T')[0];
                    }

                    if(tags.includes('time')) {

                        var localTime=await getLocal([coord.location.lat,coord.location.lng],exactTime)
                        var timeObject=new Date(localTime*1000)
                        timeTag =`${timeObject.getHours().toString().padStart(2, '0')}:${timeObject.getMinutes().toString().padStart(2, '0')}:${timeObject.getSeconds().toString().padStart(2, '0')}`;
                        var hour = timeObject.getHours();

                        if (hour < 11) {
                            timeRange = 'Morning';
                        } else if (hour >= 11 && hour < 13) {
                            timeRange = 'Noon';
                        } else if (hour >= 13 && hour < 17) {
                            timeRange = 'Afternoon';
                        } else if(hour >= 17 && hour < 19) {
                            timeRange = 'Dusk';
                        }
                        else{
                            timeRange = 'Night';
                        }
                    }

                    if (tags.includes('sun')){
                        const utcDate=new Date(exactTime*1000)
                        const sunData=calSun(utcDate.toISOString(),coord.location.lat,coord.location.lng)
                        if(sunData){
                            if (exactTime>=(sunData.sunset-30*60)&&exactTime<=(sunData.sunset+30*60)){
                                coord.tags.push('Sunset')
                            }
                            else if (exactTime>=(sunData.sunset-90*60)&&exactTime<=(sunData.sunset+90*60)){
                                coord.tags.push('Sunset(check)')
                            }
                            else if (exactTime>=(sunData.sunrise-30*60)&&exactTime<=(sunData.sunrise+30*60)){
                                coord.tags.push('Sunrise')
                            }
                            else if (exactTime>=(sunData.sunrise-90*60)&&exactTime<=(sunData.sunrise+90*60)){
                                coord.tags.push('Sunrise(check)')
                            }
                            else if (exactTime>=(sunData.noon-30*60)&&exactTime<=(sunData.noon+30*60)){
                                coord.tags.push('Noon')
                            }
                        }
                    }

                    if (tags.includes('pan to sun')){
                        const date = new Date(exactTime * 1000);
                        const position = SunCalc.getPosition(date, coord.location.lat, coord.location.lng);

                        const altitude = position.altitude;
                        const azimuth = position.azimuth;

                        const altitudeDegrees = altitude * (180 / Math.PI);
                        const azimuthDegrees = azimuth * (180 / Math.PI);
                        if(azimuthDegrees&&altitudeDegrees){
                            if (altitudeDegrees<0){
                                const moonPosition = SunCalc.getMoonPosition(date, coord.location.lat, coord.location.lng);
                                const moon_altitude = moonPosition.altitude;
                                const moon_azimuth = moonPosition.azimuth;
                                const moon_altitudeDegrees = moon_altitude * (180 / Math.PI);
                                const moon_azimuthDegrees = moon_azimuth * (180 / Math.PI);
                                coord.heading=moon_azimuthDegrees+180
                                coord.pitch=moon_altitudeDegrees
                                coord.zoom=2
                                coord.tags.push('pan to moon')
                            }
                            else{
                                coord.heading=azimuthDegrees+180
                                coord.pitch=altitudeDegrees
                                coord.tags.push('pan to sun')
                            }
                        }
                    }

                    if(tags.includes('weather')) {
                        weatherTag=await getWeather(coord.location,exactTime)
                        if(weatherTag) coord.tags.push(weatherTag)
                    }
                }

                try {if (ccData.length!=3) ccData=ccData[1][0]
                     else ccData=ccData[1]
                    }
                catch (error) {
                    ccData=null
                }

                if (ccData){
                    try{
                        countryTag = ccData[5][0][1][4]}
                    catch(error){
                        countryTag=null
                    }
                    try{
                        elevationTag=ccData[5][0][1][1][0]}
                    catch(error){
                        elevationTag=null
                    }
                    try{
                        roadTag=ccData[5][0][12][0][0][0][2][0]}
                    catch(error){
                        roadTag=null
                    }
                    try{
                        driDirTag=ccData[5][0][1][2][0]}
                    catch(error){
                        driDirTag=null
                    }
                    try{
                        trekkerTag=ccData[6][5]}
                    catch(error){
                        trekkerTag=null
                    }
                    try{
                        floorTag=ccData[5][0][1][3][2][0]
                    }
                    catch(error){
                        floorTag=null
                    }
                    try{
                        history =ccData[5][0][8]
                    }
                    catch(error){
                        history=null
                    }
                    try{
                        links=ccData[5][0][3][0]
                    }
                    catch(error){
                        links=null
                    }
                }
                if (roadTag==''||!roadTag)roadTag='Road not found'
                if (trekkerTag){
                    trekkerTag=trekkerTag.toString()
                    if( trekkerTag.includes('scout')&&floorTag){
                        trekkerTag='trekker'
                    }
                    else{
                        trekkerTag=false
                    }}

                if(driDirTag){
                    driDirTag=getDirection(parseFloat(driDirTag))
                }
                else{
                    driDirTag='Driving direction not found'
                }
                if (!countryTag)countryTag='Country not found'
                if (!elevationTag)elevationTag='Elevation not found'

                if (tags.includes('generation')&&typeTag=='Official'&&countryTag){
                    genTag = getGeneration(svData,countryTag)
                    coord.tags.push(genTag)
                    /*if(elevationTag &&genTag=='Gen4') {
                        const previous=svData.time[svData.time.length-2].pano
                        const previous_svData=await fetchGooglePanorama('GetMetadata',previous)
                        if(previous_svData){
                            const previous_elevation=previous_svData[1][0][5][0][1][1][0]
                            const is_gen4=previous_svData[1][0][2][2][0]==8192
                            if (Math.abs(previous_elevation-elevationTag)<=0.6 &&Math.abs(previous_elevation-elevationTag>=0.35)&&is_gen4){
                                coord.tags.push('smallcam')
                            }
                        }
                    }*/
                }
                if(elevationTag){
                    elevationTag=Math.round(elevationTag*100)/100
                    if(sR){
                        elevationTag=findRange(elevationTag,sR)
                    }
                    else{
                        elevationTag=elevationTag.toString()+'m'
                    }
                }
                if (tags.includes('year'))coord.tags.push(yearTag)

                if (tags.includes('month'))coord.tags.push(monthTag)

                if (tags.includes('day'))coord.tags.push(dayTag)

                if (tags.includes('time'))coord.tags.push(timeTag)

                if (tags.includes('time')&&timeRange)coord.tags.push(timeRange)

                if (tags.includes('type'))coord.tags.push(typeTag)

                if (tags.includes('driving direction'))coord.tags.push(driDirTag)

                if (tags.includes('road')&&typeTag=='Official')coord.tags.push(roadTag)

                if (tags.includes('type')&&trekkerTag&&typeTag=='Official')coord.tags.push('trekker')

                if (tags.includes('type')&&floorTag&&typeTag=='Official')coord.tags.push(floorTag)

                if (tags.includes('country'))coord.tags.push(countryTag)

                if (tags.includes('subdivision')&&typeTag=='Official')coord.tags.push(subdivisionTag)

                if (tags.includes('elevation'))coord.tags.push(elevationTag)
                if (tags.includes('update type') ){
                    if(!history)coord.tags.push('newroad')
                    else{
                        if(history&&links){
                            const dates = history.map(pano => [pano[1][0], pano[0]]).sort((a, b) => b[0] - a[0]);
                            if (dates.length > 0) {
                                const metaData = await getSVData(new google.maps.StreetViewService(), {pano:links[dates[0][1]][0][1]})
                                var generation = getGeneration(metaData,countryTag)
                                if(generation=='BadCam')generation='ari'
                                const generationTag=`${generation.toLowerCase()}update`
                                if(generationTag)coord.tags.push(generationTag);
                            }
                        }}
                }

                if (tags.includes('reset heading')){
                    if(meta[4]) coord.heading=meta[4]
                }

                if (tags.includes('update')){
                    try{
                        const resultPano=await fetchGooglePanorama('SingleImageSearch',{lat: coord.location.lat, lng: coord.location.lng},null,null,50)
                        const updatedPnaoId=resultPano[1][1][1]
                        const updatedYear=resultPano[1][6][7][0]
                        const updatedMonth=resultPano[1][6][7][1]
                        if (coord.panoId){
                            if (updatedPnaoId&&updatedPnaoId!=coord.panoId) {
                                if(panoYear!=updatedYear||panoMonth!=updatedMonth){
                                    coord.panoId=updatedPnaoId
                                    coord.tags.push('Updated')}
                                else{
                                    coord.panoId=updatedPnaoId
                                    coord.tags.push('Copyright changed')
                                }
                            }
                        }
                        else{
                            if (panoYear&&panoMonth&&updatedYear&&updatedMonth){
                                if(panoYear!=updatedYear||panoMonth!=updatedMonth){
                                    coord.panoId=updatedPnaoId
                                    coord.tags.push('Updated')
                                }
                            }
                            else{
                                coord.panoId=svData.location.pano
                                coord.tags.push('PanoId is added')
                            }
                        }
                    }
                    catch (error){
                        coord.tags.push('Failed to update')
                    }
                }

                else if (tags.includes('fix')){
                    var fixState
                    try{
                        const resultPano=await fetchGooglePanorama('SingleImageSearch',{lat: coord.location.lat, lng: coord.location.lng},null,null,30)
                        if(fixStrategy){
                            const panos=resultPano[1][5][0][8]
                            if(resultPano[1][6][7][0]===panoYear&&resultPano[1][6][7][1]==panoMonth){
                                coord.panoId=resultPano[1][1][1]
                                coord.location.lat=resultPano[1][5][0][1][0][2]
                                coord.location.lng=resultPano[1][5][0][1][0][3]
                                fixState=true
                            }
                            else{
                                for(const pano of panos){
                                    if(pano[1][0]===panoYear&&pano[1][1]===panoMonth){
                                        const panoIndex=pano[0]
                                        const fixedPanoId=resultPano[1][5][0][3][0][panoIndex][0][1]
                                        coord.panoId=fixedPanoId
                                        coord.location.lat=resultPano[1][5][0][1][0][2]
                                        coord.location.lng=resultPano[1][5][0][1][0][3]
                                        fixState=true
                                    }
                                }
                            }
                        }
                        else{
                            coord.panoId=resultPano[1][1][1]
                            coord.location.lat=resultPano[1][5][0][1][0][2]
                            coord.location.lng=resultPano[1][5][0][1][0][3]
                            fixState=true
                        }

                    }
                    catch (error){

                        fixState=null
                    }
                    if (!fixState)coord.tags.push('Failed to fix')
                    else coord.tags.push('Fixed')

                }
            }
            catch (error) {
                if(!svData)coord.tags.push('Pano not found');
                else coord.tags.push('Failed to tag')
            }
            if (coord.tags) { coord.tags = Array.from(new Set(coord.tags))}
            taggedLocs.push(coord);
        }

        async function processChunk(chunk, tags) {
            var service = new google.maps.StreetViewService();
            var panoSource= google.maps.StreetViewSource.GOOGLE
            var promises = chunk.map(async coord => {
                let panoId = coord.panoId;
                let latLng = {lat: coord.location.lat, lng: coord.location.lng};
                let svData;
                let ccData;
                if ((panoId || latLng)) {
                    if(tags!=['country']&&tags!=['elevation']&&tags!=['detect']){
                        svData = await getSVData(service, panoId ? {pano: panoId} : {location: latLng, radius: 50,source:panoSource});
                    }
                }

                if (['generation', 'country', 'elevation', 'type', 'driving direction', 'road', 'update type'].some(tag => tags.includes(tag))) {
                    if(!panoId)ccData = await fetchGooglePanorama('SingleImageSearch', latLng);
                    else ccData = await fetchGooglePanorama('GetMetadata', panoId);
                }

                if (latLng && (tags.includes('detect'))) {
                    var detectYear,detectMonth
                    if (coord.panoDate){
                        detectYear=parseInt(coord.panoDate.toISOString().substring(0,4))
                        detectMonth=parseInt(coord.panoDate.toISOString().substring(5,7))
                    }
                    else{
                        if(coord.panoId){
                            const metaData=await getSVData(service,{pano: panoId})
                            if (metaData){
                                if(metaData.imageDate){
                                    detectYear=parseInt(metaData.imageDate.substring(0,4))
                                    detectMonth=parseInt(metaData.imageDate.substring(5,7))
                                }
                            }
                        }
                    }
                    if (detectYear&&detectMonth){
                        const metaData = await fetchGooglePanorama('SingleImageSearch', latLng,10);
                        if (metaData){
                            if(metaData.length>1){
                                const defaultDate=metaData[1][6][7]
                                if (defaultDate[0]===detectYear&&defaultDate[1]!=detectMonth){
                                    coord.tags.push('Dangerous')}
                            }
                        }
                    }
                }
                if (panoId && tags.includes('brightness')){
                    const brightness=await getBrightness(panoId)
                    if (brightness<45) coord.tags.push('Dim')
                    else if (brightness<90)coord.tags.push('Normal')
                    else if (brightness<160)coord.tags.push('Lightful')
                    else coord.tags.push('Overexposed')
                }
                await processCoord(coord, tags, svData,ccData)
            });
            await Promise.all(promises);
        }

        function getSVData(service, options) {
            return new Promise(resolve => service.getPanorama({...options}, (data, status) => {
                resolve(data);
            }));
        }

        async function processData(tags) {
            let successText = 'The JSON data has been pasted to your clipboard!';
            try {
                const totalChunks = Math.ceil(selections.length / CHUNK_SIZE);
                let processedChunks = 0;

                const swal = Swal.fire({
                    title: 'Tagging',
                    text: 'If you try to tag a large number of locs by exact time, it could take quite some time. Please wait...',
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                    icon:"info",
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                for (let i = 0; i < selections.length; i += CHUNK_SIZE) {
                    let chunk = selections.slice(i, i + CHUNK_SIZE);
                    await processChunk(chunk, tags);
                    processedChunks++;

                    const progress = Math.min((processedChunks / totalChunks) * 100, 100);
                    Swal.update({
                        html: `<div>${progress.toFixed(2)}% completed</div>
                       <div class="swal2-progress">
                           <div class="swal2-progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${progress}%;">
                           </div>
                       </div>`
                    });
                }


                swal.close();
                var newJSON=[]
                if (exportMode) {
                    updateLocation(selections,taggedLocs)
                    successText = 'Tagging completed! Please save the map and refresh the page(The JSON data is also pasted to your clipboard)'
                }
                taggedLocs.forEach((loc)=>{
                    newJSON.push({lat:loc.location.lat,
                                  lng:loc.location.lng,
                                  heading:loc.heading,
                                  pitch: loc.pitch !== undefined && loc.pitch !== null ? loc.pitch : 90,
                                  zoom: loc.zoom !== undefined && loc.zoom !== null ? loc.zoom : 0,
                                  panoId:loc.panoId,
                                  extra:{tags:loc.tags}
                                 })
                })
                GM_setClipboard(JSON.stringify(newJSON))
                Swal.fire({
                    title: 'Success!',
                    text: successText,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'OK'
                })
            } catch (error) {
                swal.close();
                Swal.fire('Error Tagging!', '','error');
                console.error('Error processing JSON data:', error);
            }
        }

    }

    function chunkArray(array, maxSize) {
        const result = [];
        for (let i = 0; i < array.length; i += maxSize) {
            result.push(array.slice(i, i + maxSize));
        }
        return result;
    }

    function generateCheckboxHTML(tags) {

        const half = Math.ceil(tags.length / 2);
        const firstHalf = tags.slice(0, half);
        const secondHalf = tags.slice(half);

        return `
        <div style="display: flex; flex-wrap: wrap; gap: 10px; text-align: left;">
            <div style="flex: 1; min-width: 150px;">
                ${firstHalf.map((tag, index) => `
                    <label style="display: block; margin-bottom: 12px; margin-left: 40px; font-size: 15px;" title="${tooltips[tag]}">
                        <input type="checkbox" class="feature-checkbox" value="${tag}" /> <span style="font-size: 14px;">${tag}</span>
                    </label>
                `).join('')}
            </div>
            <div style="flex: 1; min-width: 150px;">
                ${secondHalf.map((tag, index) => `
                    <label style="display: block; margin-bottom: 12px; margin-left: 40px; font-size: 15px;" title="${tooltips[tag]}">
                        <input type="checkbox" class="feature-checkbox" value="${tag}" /> <span style="font-size: 14px;">${tag}</span>
                    </label>
                `).join('')}
            </div>
            <div style="flex: 1; min-width: 150px; margin-top: 12px; text-align: center;">
                <label style="display: block; font-size: 14px;">
                    <input type="checkbox" class="feature-checkbox" id="selectAll" /> <span style="font-size: 16px;">Select All</span>
                </label>
            </div>
        </div>
    `;
    }

    function showFeatureSelectionPopup() {
        const checkboxesHTML = generateCheckboxHTML(tagBox);

        Swal.fire({
            title: 'Select Features',
            html: `
            ${checkboxesHTML}
        `,
            icon: 'question',
            showCancelButton: true,
            showCloseButton: true,
            allowOutsideClick: false,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Start Tagging',
            cancelButtonText: 'Cancel',
            didOpen: () => {
                const selectAllCheckbox = Swal.getPopup().querySelector('#selectAll');
                const featureCheckboxes = Swal.getPopup().querySelectorAll('.feature-checkbox:not(#selectAll)');

                selectAllCheckbox.addEventListener('change', () => {
                    featureCheckboxes.forEach(checkbox => {
                        checkbox.checked = selectAllCheckbox.checked;
                    });
                });


                featureCheckboxes.forEach(checkbox => {
                    checkbox.addEventListener('change', () => {

                        const allChecked = Array.from(featureCheckboxes).every(checkbox => checkbox.checked);
                        selectAllCheckbox.checked = allChecked;
                    });
                });
            },
            preConfirm: () => {
                const selectedFeatures = [];
                const featureCheckboxes = Swal.getPopup().querySelectorAll('.feature-checkbox:not(#selectAll)');

                featureCheckboxes.forEach(checkbox => {
                    if (checkbox.checked) {
                        selectedFeatures.push(checkbox.value.toLowerCase());
                    }
                });

                return selectedFeatures;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                const selectedFeatures = result.value;
                handleSelectedFeatures(selectedFeatures);
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('User canceled');
            }
        });
    }

    function handleSelectedFeatures(features) {
        if (features.includes('elevation')) {
            Swal.fire({
                title: 'Set A Range For Elevation',
                text: 'If you select "Cancel", the script will return the exact elevation for each location.',
                icon: 'question',
                showCancelButton: true,
                showCloseButton: true,
                allowOutsideClick: false,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        title: 'Define Range for Each Segment',
                        html: `
                        <label> <br>Enter range for each segment, separated by commas</br></label>
                        <textarea id="segmentRanges" class="swal2-textarea" placeholder="such as:-1-10,11-35"></textarea>
                    `,
                        icon: 'question',
                        showCancelButton: true,
                        showCloseButton: true,
                        allowOutsideClick: false,
                        focusConfirm: false,
                        preConfirm: () => {
                            const segmentRangesInput = document.getElementById('segmentRanges').value.trim();
                            if (!segmentRangesInput) {
                                Swal.showValidationMessage('Please enter range for each segment');
                                return false;
                            }
                            const segmentRanges = segmentRangesInput.split(',');
                            const validatedRanges = segmentRanges.map(range => {
                                const matches = range.trim().match(/^\s*(-?\d+)\s*-\s*(-?\d+)\s*$/);
                                if (matches) {
                                    const min = Number(matches[1]);
                                    const max = Number(matches[2]);
                                    return { min, max };
                                } else {
                                    Swal.showValidationMessage('Invalid range format. Please use format: minValue-maxValue');
                                    return false;
                                }
                            });
                            return validatedRanges.filter(Boolean);
                        },
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'Cancel',
                        inputValidator: (value) => {
                            if (!value.trim()) {
                                return 'Please enter range for each segment';
                            }
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            runScript(features, result.value);
                        } else {
                            Swal.showValidationMessage('You canceled input');
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    runScript(features);
                }
            });
        } else {
            runScript(features);
        }
    }

    function calSun(date,lat,lng){
        if (lat && lng && date) {
            const format_date = new Date(date);
            const times = SunCalc.getTimes(format_date, lat, lng);
            const sunsetTimestamp = Math.round(times.sunset.getTime() / 1000);
            const sunriseTimestamp = Math.round(times.sunrise.getTime() / 1000);
            const noonTimestamp = Math.round(times.solarNoon.getTime() / 1000);
            return {
                sunset: sunsetTimestamp,
                sunrise: sunriseTimestamp,
                noon: noonTimestamp,
            };
        }
    }


    async function getBrightness(panoId) {
        const url = `https://streetviewpixels-pa.googleapis.com/v1/tile?cb_client=apiv3&panoid=${panoId}&output=tile&x=0&y=0&zoom=0&nbt=1&fover=2`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);

            const img = new Image();
            img.src = imageUrl;


            await new Promise((resolve) => {
                img.onload = resolve;
            });


            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = Math.floor(img.height*0.4);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);


            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;


            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const brightness = (r + g + b) / 3;
                totalBrightness += brightness;
            }

            const averageBrightness = totalBrightness / (data.length / 4);


            URL.revokeObjectURL(imageUrl);

            return averageBrightness;

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
    var mainButton = document.createElement('button');
    mainButton.textContent = 'Auto-Tag';
    mainButton.id = 'main-button';
    mainButton.style.position = 'fixed';
    mainButton.style.right = '20px';
    mainButton.style.bottom = '15px';
    mainButton.style.borderRadius = '18px';
    mainButton.style.padding = '5px 10px';
    mainButton.style.border = 'none';
    mainButton.style.color = 'white';
    mainButton.style.cursor = 'pointer';
    mainButton.style.backgroundColor = '#4CAF50';
    mainButton.addEventListener('click', showFeatureSelectionPopup);
    document.body.appendChild(mainButton)

})();