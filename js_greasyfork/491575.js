// ==UserScript==
// @name         Feature Your Map
// @version      2.4.2
// @description  get poi data from osm
// @author       KaKa
// @match        https://map-making.app/maps/*
// @grant        GM_setClipboard
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/491575/Feature%20Your%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/491575/Feature%20Your%20Map.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('DOMContentLoaded', function() {
        document.addEventListener('change', function(event) {
            const checkbox = event.target;
            if (checkbox.type === 'checkbox') {
                const label = checkbox.parentElement;
                if (checkbox.checked) {
                    label.classList.add('checked');
                } else {
                    label.classList.remove('checked');
                }
            }
        });
    });

    let globalSettings = {
        selectedFeature: null,
        isIncluded: null,
        radius: null
    };

    let mapFeatures={'way':['motorway','trunk','primary','secondary','tertiary','unclassified','footway','path','pedestrain','river','bridge','tunnel','roundabout','coastline'],
                     'node':[ 'bus stop', 'level crossing','milestone', 'crosswalk','traffic light','postbox', 'hydrant','utility pole', 'lamppost','waste basket',
                             'waste disposal','yield sign','stop sign','stadium','museum','school','motorway junction','tree','volcano','cape','hill'],
                     'relation':['grassland','forest','residental','farmland','meadow','paddy','vineyard'],
                    'nw':['bollard','hospital','train station','religious','government','hotel','estate agent']}

    let taglist = [['estate agent','"shop"="estate_agent"'],
                   ['coastline','"natural"="coastline"'],
                   ['bollard','"barrier"="bollard"'],
                   ['vineyard','"landuse"="vineyard"'],
                   ['paddy','"landuse"="paddy"'],
                   ['meadow','"landuse"="meadow"'],
                   ['residental','"landuse"="residental"'],
                   ['farmland','"landuse"="farmland"'],
                   ['hill','"natural"="hill"'],
                   ['volcano', '"natural"="volcano"'],
                   ['grassland','"natural"="grassland"'],
                   ['forest','"natural"="wood"'],
                   ['cape', '"natural"="cape"'] ,
                   ['tree', '"natural"="tree"'],
                   ['bridge', '"bridge"="yes"'],
                   ['bus stop', '"highway"="bus_stop"'],
                   ['utility pole', '"power"="pole"'],
                   ['traffic light', '"highway"="traffic_signals"'],
                   ['lamppost', '"highway"="street_lamp"'],
                   ['crosswalk', '"highway"="crossing"'],
                   ['level crossing', '"railway"="level_crossing"'],
                   ['postbox', '"amenity"="post_box"'],
                   ['hydrant', '"emergency"="fire_hydrant"'],
                   ['milestone', '"highway"="milestone"'],
                   ['motorway','"highway"="motorway"'],
                   ['trunk','"highway"="trunk"'],
                   ['primary','"highway"="primary"'],
                   ['secondary','"highway"="secondary"'],
                   ['tertiary','"highway"="tertiary"'],
                   ['unclassified','"highway"="unclassified"'],
                   ['footway','"highway"="footway"'],
                   ['path','"highway"="path"'],
                   ['pedestrain','"highway"="pedestrain"'],
                   ['river','"waterway"="river"'],
                   ['railway','"railway"="rail"'],
                   ['tram','"railway"="tram"'],
                   ['tunnel','"tunnel"="yes"'],
                   ['yield sign','"highway"="give_way"'],
                   ['roundabout','"junction"="roundabout"'],
                   ['waste basket','"amenity"="waste_basket"'],
                   ['waste disposal','"amenity"="waste_disposal"'],
                   ['hospital','"amenity"="hospital"'],
                   ['government','"building"="government"'],
                   ['religious','"amenity"="place_of_worship"'],
                   ['stop sign','"highway"="stop"'],
                   ['museum','"building"="museum"'],
                   ['train station','"building"="train_station"'],
                   ['stadium','"leisure"="stadium"'],
                   ['school','"amenity"="school"'],
                   ['hotel','"building"="hotel"'],
                   ['motorway junction','"highway"="motorway_junction"']
                ];

    let categories = {
        'Traffic': ['bridge', 'roundabout','tunnel', 'level crossing','bollard','milestone', 'crosswalk','yield sign','stop sign','motorway junction'],
        'Public Facility': ['bus stop','postbox', 'hydrant','utility pole', 'lamppost','traffic light','waste basket','waste disposal'],
        'Building':['government','school','hospital','stadium','museum','religious','hotel','estate agent'],
        'Natural':['volcano','tree','cape','hill']};

    let advancedCategories={'Intersection':['motorway','trunk','primary','secondary','tertiary','unclassified','footway','path','pedestrain'],
                              'Around Search':['bridge', 'bus stop', 'level crossing','milestone', 'crosswalk','traffic light','postbox', 'hydrant','utility pole',
                                               'lamppost','river','government','school','hospital','waste basket','waste disposal','stadium','museum','religious',
                                               'tunnel','roundabout','hotel','motorway junction','tree','volcano','cape','coastline','hill','forest','grassland',
                                               'residental','farmland','meadow','paddy','vineyard']}

    const API_URL = "https://overpass-api.de/api/interpreter";
    const checkboxButtonStyle = `.checkbox-button {
    display: inline-block;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 10px;}

    .checkbox-button:hover {
      background-color: #4CAF50;
      border-color: #4CAF50;}

    .checkbox-button input[type="checkbox"] {
      display: none;}

    .checkbox-button.checked {
      background-color: #4CAF50;
      color: #fff;
      font-weight: bold;
      border-color: #4CAF50;}

    .category-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;}

    .category-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      margin-right: 30px;
      margin-left: 30px;}

    .flex-fill {
      flex: 1;}`;

    async function fetchData(query, mode,feature,advanced) {
        const requestBody = getRequestBody(feature,mode,advanced,query)
        const response = await fetch(API_URL, {
            method: "POST",
            body: "data=" + encodeURIComponent(requestBody),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        return response.json();
    }

    async function getData(query, mode,features,advanced) {
        try {
            const swal = Swal.fire({
                title: 'Fetching Coordinates',
                text: 'Please wait...',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            const js = {
                "name": "",
                "customCoordinates": [],
                "extra": {
                    "tags": {},
                    "infoCoordinates": []
                }
            };
            let elements = [];
            if (advanced==='Intersection'){
                const response=await fetchData(query, mode, features,advanced)
                if (response.remark && response.remark.includes("runtime error")) {
                    alert("RAM runned out or query timed out. Please try narrowing your search scope.");

                } else if (response.elements && response.elements.length > 0) {
                    elements.push(...response.elements);
                }
                writeData(elements, features, js,advanced);
            }

            else if(advanced==='Around'){
                const response=await fetchData(query, mode, features,advanced)
                if (response.remark && response.remark.includes("runtime error")) {
                    alert("RAM runned out or query timed out. Please try narrowing your search scope.");

                } else if (response.elements && response.elements.length > 0) {
                    elements.push(...response.elements);
                }
                writeData(elements, features, js,advanced)}
            else{
                for (let feature of features) {
                    let requests = [];

                    requests.push(fetchData(query, mode, feature));

                    const responses = await Promise.all(requests);

                    responses.forEach(response => {if (response.remark && response.remark.includes("runtime error")) {
                        alert("RAM runned out or query timed out. Please try narrowing your search scope.");
                    } else
                        if (response.elements && response.elements.length > 0) {
                            elements.push(...response.elements);
                        }
                                                  });
                    writeData(elements, feature[0], js);

                }
            }
            if (js.customCoordinates.length === 0) {
                swal.close()
                if (mode === 'area') {
                    Swal.fire('Error',"None retrived!The place name you entered may be incorrect,couldn't find this place.",'error');
                } else if (mode === 'polygon') {
                    Swal.fire('Error',"None retrived!Please check if your geojson file format is correct.",'error');
                }
                else{
                    Swal.fire('Error',"None retrived!Please narrow the radius or select a less features combination.",'error')}
            }
            if (js.customCoordinates.length > 0) {
                swal.close()
                GM_setClipboard(JSON.stringify(js));
                 Swal.fire('Success',"JSON data has been copied to your clipboard!",'success');
            }
        } catch (error) {
            Swal.fire('Error',`Error fetching data${error}:`,'error');
        }
    }

    function getFeatureElement(f){
        for (const key in mapFeatures) {
            if (mapFeatures.hasOwnProperty(key)) {
                if (mapFeatures[key].includes(f)) {
                    return key
                }}}}

    function getCategoryHtml(categories) {
        let html = '';
        for (let category in categories) {
            html += `<input type="radio" name="category" value="${category}" id="swal-input-${category}">
        <label for="swal-input-${category}">${category}</label><br>`;
        }
        return html;
    }

    function getSettingFeaturesHtml(features) {
    let html = '';
    for (let feature of features) {
        html += `<input type="radio" name="feature" value="${feature}" id="swal-input-${feature}">
        <label for="swal-input-${feature}">${feature}</label><br>`;
    }
    return html;
}

    async function getSettings() {
        const resetSettings = () => {
            globalSettings.selectedFeature = null;
            globalSettings.isIncluded = null;
            globalSettings.radius = null;
        };

        const setSettings = (feature, isIncluded, radius) => {
            globalSettings.selectedFeature = feature;
            globalSettings.isIncluded = isIncluded;
            globalSettings.radius = radius;
        };

        resetSettings();
        let settingCategories = {
            'Transportation': ['bridge', 'roundabout', 'tunnel', 'level crossing', 'milestone', 'crosswalk', 'yield sign', 'stop sign', 'motorway junction'],
            'Public Facility': ['bus stop', 'postbox', 'hydrant', 'utility pole', 'lamppost', 'traffic light', 'waste basket', 'waste disposal'],
            'Building': ['government', 'school', 'hospital', 'stadium', 'museum', 'religious', 'hotel'],
            'Natural': ['volcano', 'tree', 'cape', 'hill', 'forest', 'grassland', 'coastline'],
            'Landuse': ['farmland', 'paddy', 'meadow', 'vineyard', 'residental']
        };

        let selectedSettingCategory = null;

        const { value: selectedCategory, dismiss: initializeSettings } = await Swal.fire({
            title: 'Setting Categories',
            html: getCategoryHtml(settingCategories),
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            showCloseButton: true,
            cancelButtonText: 'Reset Settings',
            preConfirm: () => {
                const selectedCategoryRadio = document.querySelector('input[name="category"]:checked');
                if (!selectedCategoryRadio) {
                    Swal.showValidationMessage('Please select a category');
                    return;
                }
                selectedSettingCategory = selectedCategoryRadio.value;
                return selectedSettingCategory;
            }
        });

        if (initializeSettings=='cancel') {
            Swal.fire({
                icon: 'success',
                title: 'Settings Reset',
                text: 'Your settings have been successfully reset.',
                showConfirmButton: false,
                timer: 1500
            });
            resetSettings();

        }

        if (selectedCategory) {
            let selectedSettingFeatures = settingCategories[selectedSettingCategory];

            const { value: selectedFeature, dismiss: cancelInput } = await Swal.fire({
                title: 'Setting Features',
                html: getSettingFeaturesHtml(selectedSettingFeatures) + '<a href="https://wiki.openstreetmap.org/wiki/Map_features" target="_blank" style="color: black; font-size: 16px;">More information about features...</a>',
                focusConfirm: false,
                allowOutsideClick: false,
                showCancelButton: true,
                preConfirm: () => {
                    const selectedFeatureRadio = document.querySelector('input[name="feature"]:checked');
                    if (!selectedFeatureRadio) {
                        Swal.showValidationMessage('Please select a feature');
                        return;
                    }
                    return selectedFeatureRadio.value;
                }
            });

            if (selectedFeature) {
                const { value: isIncluded, dismiss: cancelInclude } = await Swal.fire({
                    title: 'Select POI Range',
                    text: 'Do you want to include POIs within a certain range or outside of it?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Within Range',
                    cancelButtonText: 'Outside Range',
                    allowOutsideClick:false,
                });

                let radius = 50;
                if (isIncluded !== Swal.DismissReason.cancel) {
                    const { value: inputRadius, dismiss: cancelRadius } = await Swal.fire({
                        title: 'Enter Radius',
                        input: 'number',
                        inputLabel: 'Radius (in meters)',
                        inputPlaceholder: 'Enter the radius for POIs',
                        inputAttributes: {
                            min: 5,
                            max: 10000,
                            step: 100,
                        },
                        showCancelButton: true,
                        confirmButtonText: 'OK',
                        cancelButtonText: 'Cancel',
                        allowOutsideClick:false,
                        inputValidator: (value) => {
                            if (!value) {
                                return 'You need to enter a radius!';
                            }
                            const radiusValue = parseInt(value);
                            if (radiusValue < 5 || radiusValue > 10000) {
                                return 'Radius must be between 5 and 10000 meters!';
                            }
                        }
                    });

                    if (inputRadius !== undefined && inputRadius !== null) {
                        radius = parseInt(inputRadius);
                    }
                }

                if (selectedFeature && isIncluded !== Swal.DismissReason.cancel) {
                    const filteredTags = taglist.filter(tag => selectedFeature.includes(tag[0]));
                    setSettings(filteredTags[0], isIncluded, radius);
                    Swal.fire({
                        icon: 'success',
                        title: 'Settings Updated',
                        text: 'Your settings have been successfully updated.',
                        showConfirmButton: false,
                        timer: 1200
                    });
                }
            }
        }
    }

    function getRequestBody(features, mode, advanced, query) {
        let requestBody = "";
        var selectedFeatures=globalSettings.selectedFeature
        const outJsonTimeout = "[out:json][timeout:180];";
        if (advanced === "Intersection") {
            if (globalSettings.selectedFeature){
                if (globalSettings.isIncluded){
                    requestBody = `${outJsonTimeout}${getFeatureElement(selectedFeatures[0])}[${selectedFeatures[1]}](poly:"${query}");
                        way(poly:"${query}")[highway~"^(${features[0].join('|')})$"]->.w1;
                        way(poly:"${query}")[highway~"^(${features[1].join('|')})$"]->.w2;
                        node(w.w1)(w.w2)(around:${globalSettings.radius});
                        out geom;`;}
                else {
                    requestBody = `${outJsonTimeout}(${getFeatureElement(selectedFeatures[0])}[${selectedFeatures[1]}](poly:"${query}");)->.default;
                                   way(poly:"${query}")[highway~"^(${features[0].join('|')})$"]->.w1;
                                   way(poly:"${query}")[highway~"^(${features[1].join('|')})$"]->.w2;
                                   node(w.w1)(w.w2)->.all;
                                   (node.all(around.default:${globalSettings.radius});)->.inner;
                                   (.all; - .inner;);
                                   out geom meta;`
                }
            }
            else {
                requestBody = `${outJsonTimeout}
                        way(poly:"${query}")[highway~"^(${features[0].join('|')})$"]->.w1;
                        way(poly:"${query}")[highway~"^(${features[1].join('|')})$"]->.w2;
                        node(w.w1)(w.w2);
                        out geom;`;}
        } else if (advanced === "Around") {
            const aroundPoint = features[1];
            const aroundFeature = features[0].find(feature => feature[0] === aroundPoint);
            const resultFeature = features[0].find(feature => feature[0] !== aroundPoint);
            const aroundParams = mode === "coordinate" ? `around:${features[2].join(',')}` : `around:${features[2]}`;
            requestBody = `${outJsonTimeout}
                        ${getFeatureElement(aroundFeature[0])}(poly:"${query}")[${aroundFeature[1]}];
                        ${getFeatureElement(resultFeature[0])}(${aroundParams})[${resultFeature[1]}];
                        out geom;`;
        } else {
            if (globalSettings.selectedFeature){
                if (globalSettings.isIncluded){
                    requestBody = `${outJsonTimeout}${getFeatureElement(selectedFeatures[0])}[${selectedFeatures[1]}](poly:"${query}");
                                    ${getFeatureElement(features[0])}(around:${globalSettings.radius})[${features[1]}];
                                    out geom;`;}
                else {

                    requestBody = `${outJsonTimeout}(${getFeatureElement(selectedFeatures[0])}[${selectedFeatures[1]}](poly:"${query}");)->.default;
                                   (${getFeatureElement(features[0])}[${features[1]}](poly:"${query}");)->.all;
                                   (${getFeatureElement(features[0])}.all(around.default:${globalSettings.radius});)->.inner;
                                   (.all; - .inner;);
                                   out geom meta;`
                }

            }
            else{
                requestBody = `${outJsonTimeout}${getFeatureElement(features[0])}[${features[1]}](poly:"${query}");out geom;`;}
        }
        return requestBody;
    }

    function writeData(coordinates, feature, js,advanced) {
        for (let i = 0; i < coordinates.length; i++) {
            let tag;
            if (coordinates[i].geometry) {
                let nodes = coordinates[i].geometry;
                let medianIndex = Math.floor(nodes.length / 2);
                let medianCoordinate = nodes[medianIndex]

                if (coordinates[i].tags && coordinates[i].tags.highway) {

                    tag = [coordinates[i].tags.highway ,feature];
                } else {
                    tag = [feature];
                }

                if (medianCoordinate.lat && medianCoordinate.lon) {
                    if (advanced=== 'Intersection') {
                        tag=['Intersection']

                    }
                    else if(advanced=== 'Around'){
                        let advancedTags = [];
                        const resultFeature = feature[0].find(feature => feature[0] !== feature[1])

                        advancedTags.push(resultFeature[0]);
                        tag = advancedTags
                        if (coordinates[i].tags && coordinates[i].tags.highway) {
                            tag .push(coordinates[i].tags.highway);

                        }
                    }
                    if(coordinates[i].tags.religion) tag.push(coordinates[i].tags.religion)
                    js.customCoordinates.push({
                        "lat": medianCoordinate.lat,
                        "lng": medianCoordinate.lon,
                        "extra": {
                            "tags": tag
                        }
                    });
                }
            }

            else if (coordinates[i].lat && coordinates[i].lon && !isCoordinateExists(js.customCoordinates, coordinates[i].lat, coordinates[i].lon)) {
                let tag = [feature];
                if (advanced=== 'Intersection') {
                    tag=['Intersection'];
                }

                else if(advanced=== 'Around'){
                    let advancedTags = [];
                    const resultFeature = feature[0].find(feature => feature[0] !== feature[1])

                    advancedTags.push(resultFeature[0]);

                    tag = advancedTags
                    if (coordinates[i].tags && coordinates[i].tags.highway) {
                        tag.push(coordinates[i].tags.highway);
                    }
                }
                if(coordinates[i].tags.religion) tag.push(coordinates[i].tags.religion)
                js.customCoordinates.push({
                    "lat": coordinates[i].lat,
                    "lng": coordinates[i].lon,
                    "extra": {
                        "tags": tag
                    }
                });
            }


        }
    }

    function isCoordinateExists(coordinates, lat, lon) {
        for (let i = 0; i < coordinates.length; i++) {
            if (coordinates[i].lat === lat && coordinates[i].lng === lon) {
                return true;
            }
        }
        return false;
    }

    function promptInput(f,a){
        const input = document.createElement('input');
        input.type = 'file';
        input.style.position = 'absolute';
        input.style.right = '450px';
        input.style.top = '15px';
        input.style.display='none'
        input.addEventListener('change', async event => {
            const file = event.target.files[0];
            if (file) {
                try {
                    var query = await readFile(file);
                    getData(query, 'polygon', f, a);
                    document.body.removeChild(input);
                } catch (error) {
                    console.error('Error reading file:', error);
                    document.body.removeChild(input);
                }
            } else {
                if (document.getElementById('uploadButton')) {
                    document.getElementById('uploadButton').remove();
                }
            }
        });

        input.click();

        document.body.appendChild(input);

        input.addEventListener('cancel', () => {
            if (document.getElementById('uploadButton')) {
                document.getElementById('uploadButton').remove();
            }
        });
    }

    async function getInput(features, advanced) {
       const { value: upload ,dismiss:inputDismiss} = await Swal.fire({
           title: 'Query Scope Setting',
           text: 'Do you want to upload a GeoJson file? Else you will need to enter a place name or OSM ID to get GeoJson file.You could also draw polygons on the map and download it as GeoJson file from map-making.',
           icon: 'question',
           showCancelButton: true,
           showCloseButton:true,
           allowOutsideClick: false,
           confirmButtonColor: '#3085d6',
           cancelButtonColor: '#d33',
           confirmButtonText: 'Upload',
           cancelButtonText: 'Enter Place Name'
       });

       if (upload) {
           promptInput(features,advanced)

       }
       else if(inputDismiss==='cancel') {
           await downloadGeoJSONFromOSMID(features,advanced)
       }
   }

    function extractCoordinates(p) {
        let results = [];
        if (p.features){
            let polygons=p.features
            polygons.forEach(data => {
                const coordinates = [];
                data.geometry.coordinates.forEach(polygon => {
                    polygon[0].forEach(coordinatePair => {
                        let coordinate = [coordinatePair[1], coordinatePair[0]].join(' ');
                        coordinates.push(coordinate);
                    });
                });
                let result = coordinates.join(' ');
                result = result.replace(/,/g, ' ');
                results.push(result);
            });}
        else if( p.coordinates){
            const coordinates = [];
            p.coordinates.forEach(polygon => {
                polygon.forEach(subPolygon => {
                    subPolygon.forEach(coordinatePair => {
                        let coordinate = [coordinatePair[1], coordinatePair[0]].join(' ');
                        coordinates.push(coordinate);
                    });
                });
            });
            let result = coordinates.join(' ');
            result = result.replace(/,/g, ' ');
            results.push(result);

        }
        else if(p.geometry){
            const coordinates = [];
            p.geometry.coordinates.forEach(polygon => {
                polygon.forEach(subPolygon => {
                    subPolygon.forEach(coordinatePair => {
                        let coordinate = [coordinatePair[1], coordinatePair[0]].join(' ');
                        coordinates.push(coordinate);
                    });
                });
            });
            let result = coordinates.join(' ');
            result = result.replace(/,/g, ' ');
            results.push(result);
        }
        else {
            console.error('Invalid Geojson format.');
            alert('Invalid Geojson format!');
        }
        return results;

    }

    function readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function(event) {
                const jsonContent = event.target.result;

                try {
                    const data = JSON.parse(jsonContent);

                    if (data) {
                        const coordinates = extractCoordinates(data);
                        resolve(coordinates);
                    }
                } catch (error) {
                    console.error('Error parsing Geojson:', error);
                    alert('Error parsing Geojson!');
                    resolve('error')
                }
            };

            reader.readAsText(file);
        });
    }

    function runScript(features,advanced){
        if (features&&features.length>0){
            getInput(features,advanced)
        }
    }

    function getHtml(categories){
        const categoryKeys = Object.keys(categories);
        const numCategories = categoryKeys.length;



        let html = `<style>${checkboxButtonStyle}</style>`;

        for (let i = 0; i < numCategories; i += 2) {
            html += `<div class="category-row">`;
            const category1 = categoryKeys[i];
            const category2 = (i + 1 < numCategories) ? categoryKeys[i + 1] : null;

            html += `
                     <label class="checkbox-button" for="swal-input-${category1}">
                         <input id="swal-input-${category1}" class="swal2-input" type="checkbox" value="${category1}">
                            <span>${category1}</span>
                               </label>`;

            if (category2) {
                html += `
                    <label class="checkbox-button" for="swal-input-${category2}">
                        <input id="swal-input-${category2}" class="swal2-input" type="checkbox" value="${category2}" >
                        <span>${category2}</span>
                    </label>
                `;
            } else {
                html += `<div class="flex-fill"></div>`;
            }

            html += `</div>`;
        }
        return html
    }

    function getFeaturesHtml(features){
        let featuresHtml = '';
        featuresHtml += `<style>${checkboxButtonStyle}</style>`;

        for (let i = 0; i < features.length; i += 2) {
            featuresHtml += `<div class="category-row">`;
            const feature1 = features[i];
            const feature2 = (i + 1 < features.length) ? features[i + 1] : null;

            featuresHtml += `<div style="display: flex; flex-direction: column; align-items: flex-start;">
                        <label class="checkbox-button">
                            <input class="swal2-input" type="checkbox" value="${feature1}" style="display: none;">
                            <span style="margin-left: 1px;">${feature1}</span>
                        </label>
                    </div>`;

            if (feature2) {
                featuresHtml += `<div style="display: flex; flex-direction: column; align-items: flex-start;">
                            <label class="checkbox-button">
                                <input class="swal2-input" type="checkbox" value="${feature2}" style="display: none;">
                                <span style="margin-left: 1px;">${feature2}</span>
                            </label>
                        </div>`;
            } else {

                featuresHtml += `<div style="flex: 1;"></div>`;
            }

            featuresHtml += `</div>`;
        }
        return featuresHtml
    }

    async function getFeatures() {
        let selectedCategories = [];

        const { value: selectedMainCategories, dismiss: mainCategoriesDismiss } = await Swal.fire({
            title: 'Select Categories',
            html: getHtml(categories),
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            showCloseButton:true,
            cancelButtonText: 'Advanced Search',
            preConfirm: () => {

                selectedCategories = [];
                let noCategorySelected = true;
                for (let category in categories) {
                    if (document.getElementById(`swal-input-${category}`).checked) {
                        selectedCategories.push(category);
                        noCategorySelected = false;
                    }
                }
                if (noCategorySelected) {
                    Swal.showValidationMessage('Please select at least one category');
                }

                return selectedCategories;
            }
        });


        if (selectedMainCategories) {
            let selectedFeatures = [];
            for (let category of selectedMainCategories) {
                selectedFeatures = selectedFeatures.concat(categories[category]);
            }
            const { value: selectedSubFeatures, dismiss: cancelInput } = await Swal.fire({
                title: 'Select Features',
                html: getFeaturesHtml(selectedFeatures) + '<a href="https://wiki.openstreetmap.org/wiki/Map_features" target="_blank" style="color: black; font-size: 16px;">More information about features...</a>',
                focusConfirm: false,
                allowOutsideClick: 'cancel',
                showCancelButton: true,
                preConfirm: () => {
                    let selectedSubFeatures = [];
                    const checkboxes = document.querySelectorAll('.swal2-input[type="checkbox"]:checked');
                    checkboxes.forEach((checkbox) => {
                        selectedSubFeatures.push(checkbox.value);
                    });
                    if (selectedSubFeatures.length === 0) {
                        Swal.showValidationMessage('Please select at least one feature');
                    }

                    return selectedSubFeatures;
                }
            });


            if (selectedSubFeatures) {
                const features = [];

                const filteredTags = taglist.filter(tag => selectedSubFeatures.includes(tag[0]));

                features.push(...filteredTags);
                runScript(features,'')
            }
        }

    else if (mainCategoriesDismiss === "cancel"){
        const { value: selectedAdvancedCategories, dismiss: cancelInput } = await Swal.fire({
            title: 'Advanced Search',
            html: getHtml(advancedCategories),
            focusConfirm: false,
            allowOutsideClick: false,
            showCancelButton: true,
            showCloseButton:true,
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                selectedCategories = [];
                for (let category in advancedCategories) {
                    if (document.getElementById(`swal-input-${category}`).checked) {
                        selectedCategories.push(category);
                    }
                }
                if (selectedCategories.length === 0) {
                    Swal.showValidationMessage('Please select at least one option!');
                    return false;
                } else if (selectedCategories.length >1) {
                    Swal.showValidationMessage("You're only allowed to select one option!");
                    return false;
                }


                return selectedCategories;
            }
        });

        if (selectedAdvancedCategories) {
            let selectedFeatures = [];
            let titleText='Select Features';
            if (selectedAdvancedCategories.includes('Intersection')) {
                titleText = 'Select Major way';
            }
            for (let category of selectedAdvancedCategories) {
                selectedFeatures = selectedFeatures.concat(advancedCategories[category]);
            }
            const { value: selectedSubFeatures, dismiss: cancelInput } = await Swal.fire({
                title: titleText,
                html: getFeaturesHtml(selectedFeatures)+ '<a href="https://wiki.openstreetmap.org/wiki/Map_features" target="_blank" style="color: black; font-size: 16px;">More information about features...</a>',
                focusConfirm: false,
                allowOutsideClick: 'cancel',
                showCancelButton: true,
                preConfirm: () => {
                    const checkboxes = document.querySelectorAll('.swal2-input[type="checkbox"]:checked');
                    const selectedSubFeatures = Array.from(checkboxes).map(checkbox => checkbox.value);

                    if (selectedSubFeatures.length < 1) {
                        Swal.showValidationMessage('Please select at least one option!');
                        return false;
                    }

                    if (selectedAdvancedCategories.includes('Intersection')) {
                        const minorFeatures = advancedCategories.Intersection.filter(feature => !selectedSubFeatures.includes(feature));
                        return Swal.fire({
                            title: 'Select Minor Way',

                            html: getFeaturesHtml(minorFeatures) + '<a target="_blank" style="color: black; font-size: 14px;">The script will search for intersections based on the type of minor way you selected and the type of major way you selected previously.</a>',
                            showCancelButton: true,
                            preConfirm: () => {
                                return new Promise((resolve) => {
                                    const checkboxes = document.querySelectorAll('.swal2-input[type="checkbox"]:checked');
                                    const selectedMinorFeatures = Array.from(checkboxes).map(checkbox => checkbox.value);
                                    resolve(selectedMinorFeatures);
                                }).then((selectedMinorFeatures) => {
                                    return [selectedSubFeatures, selectedMinorFeatures];
                                }).catch(() => {
                                    return false;
                                });
                            }
                        });
                    }

                    if (selectedAdvancedCategories.includes('Around Search')) {
                        return Swal.fire({
                            title: 'Select Around Point',
                            html: `
        <p>The script will first search for some points that match the feature, and then search around those points for points that match another feature.</p>
        <div>
            <select id="aroundPoint" class="swal2-select">
                ${selectedSubFeatures.map(option => `<option value="${option}">${option}</option>`)}
            </select>
        </div>
        <p>You could also enter a coordinate as around point to search for points that match the features you selected(e.g. 35.12,129.08)</p>
        <div>
            <input type="text" id="coordinate" class="swal2-input">
        </div>
    `,
                            showCancelButton: true,
    preConfirm: () => {
        const aroundPoint = document.getElementById('aroundPoint').value;
        const coordinates = document.getElementById('coordinate').value.trim();

        const checkFeatures = selectedSubFeatures;
        const aroundPointIndex = checkFeatures.indexOf(aroundPoint);
        checkFeatures.splice(aroundPointIndex, 1);
        const hasRealationFeature = checkFeatures.some(feature => mapFeatures.relation.includes(feature));
        if (hasRealationFeature) {
            Swal.showValidationMessage('Realtion type of points must be set as around point!Better select only one relation type of feature.');
            return false;
        }
        if (isNaN(coordinates) ||selectedSubFeatures.length===1) {
            Swal.showValidationMessage('Please enter a coordinate or select more than 2 features!');
            return false;

        if (coordinates) {
            const [latitude, longitude] = coordinates.split(',').map(coord => parseFloat(coord.trim()));

            if (isNaN(latitude) || isNaN(longitude)) {
                Swal.showValidationMessage('Please enter a valid coordinate!');
                return false;
            }
         }

            return Swal.fire({
                title: 'Please enter a radius(metre)',
                input: 'text',
                inputLabel: 'Radius',
                inputPlaceholder: 'Enter radius...',
                showCancelButton: true,
                inputValue: 100,
                inputValidator: (value) => {
                    const radiusValue = parseInt(value);
                    if (isNaN(radiusValue) || radiusValue < 10 || radiusValue > 10000) {
                        return 'Please enter a valid integer between 10 and 10000!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const radius = result.value;
                    return [selectedSubFeatures, radius, [latitude, longitude]];
                } else {
                    return false;
                }
            });
        } else {
            return Swal.fire({
                title: 'Please enter a radius(metre)',
                input: 'text',
                inputLabel: 'Radius',
                inputPlaceholder: 'Enter radius...',
                showCancelButton: true,
                inputValue: 100,
                inputValidator: (value) => {
                    const radiusValue = parseInt(value);
                    if (isNaN(radiusValue) || radiusValue < 10 || radiusValue > 10000) {
                        return 'Please enter a valid integer between 10 and 10000!';
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const radius = result.value;
                    return [selectedSubFeatures, aroundPoint, radius];
                } else {
                    return false;
                }
            });
        }
    }
                        });
                    }

                    else{return selectedSubFeatures}}

            });
            if (selectedSubFeatures) {

                const features = [];
                let filteredTags;
                if (selectedAdvancedCategories.includes('Intersection')){
                    const intersectionFeatures=selectedSubFeatures.value
                    let majorTags
                    let minorTags

                    features.push(...[intersectionFeatures[0]],...[intersectionFeatures[1]]);

                    runScript(features,'Intersection')
                }
                if (selectedAdvancedCategories.includes('Around Search')){
                    let aroundFeatures=selectedSubFeatures.value
                    filteredTags = taglist.filter(tag => aroundFeatures[0].includes(tag[0]))
                    features.push(...filteredTags)
                    if (Array.isArray(aroundFeatures[2])) {
                        getData('','coordinate',[features,aroundFeatures[1],aroundFeatures[2]],'Around')}
                    else{
                        runScript([features,aroundFeatures[1],aroundFeatures[2]],'Around')}
                }
            }
        }
    }
}

    async function downloadGeoJSONFromOSMID(f,a) {
        Swal.fire({
            title: 'Enter OSM ID or place name',
            input: 'text',
            inputValue: 'Paris or 71525',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
            showCloseButton:true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to enter something!';
                }
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const userInput = result.value;
                if (!isNaN(userInput)) {
                    await downloadGeoJSON(userInput);
                } else {
                    try {
                        const osmID = await getOSMID(userInput);
                        if (osmID) {
                            await downloadGeoJSON(osmID);
                            if(f||a){
                                setTimeout(function() {promptInput(f,a)},500)
                            }
                        } else {
                            Swal.fire('Error', 'OSM ID not found for the provided place name.', 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                console.log('No input provided.');
            }
        });}

    async function getOSMID(placeName) {
        const nominatimURL = `https://nominatim.openstreetmap.org/search?format=json&q=${placeName}&addressdetails=1`;
        const response = await fetch(nominatimURL, {
            headers: {
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        const data = await response.json();
        if (data.length > 0) {
            let options = {};
            for (let i = 0; i < Math.min(5, data.length); i++) {
                options[i + 1] = `${data[i].display_name}\n${data[i].address.country}`;
            }

            const { value: chosenIndex } = await Swal.fire({
                title: "Choose a location",
                input: 'select',
                inputOptions: options,
                showCancelButton:true,
                inputValidator: (value) => {
                    if (value === '') {
                        return 'You must select a location';
                    }
                }
            });

            if (chosenIndex !== '') {
                const index = parseInt(chosenIndex);
                return data[index - 1].osm_id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async function downloadGeoJSON(osmID) {
        const url = `https://polygons.openstreetmap.fr/get_geojson.py?id=${osmID}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch GeoJSON data.');
            }

            const data = await response.json();
            const geojsonString = JSON.stringify(data);
            const blob = new Blob([geojsonString], { type: 'application/json' });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `osm_boundary_${osmID}.geojson`;
            link.click();
        } catch (error) {
            console.error('Error downloading GeoJSON:', error);
            alert('Error downloading GeoJSON')
        }
    }


    var triggerButton = document.createElement("button");
    triggerButton.innerHTML = "Feature Your Map";
    triggerButton.style.position = 'absolute';
    triggerButton.style.right = '10px';
    triggerButton.style.top = '8px';
    triggerButton.style.width='160px'
    triggerButton.style.fontSize='16px'
    triggerButton.style.borderRadius = "16px";
    triggerButton.style.padding = "5px 5px";
    triggerButton.style.border = "none";
    triggerButton.style.backgroundColor = "#4CAF50";
    triggerButton.style.color = "white";
    triggerButton.style.cursor = "pointer";
    document.body.appendChild(triggerButton);

    var button = document.createElement('button');
    button.textContent = 'Download GeoJSON'
    button.style.position = 'absolute';
    button.style.right = '180px';
    button.style.top = '8px';
    button.style.width='160px'
    button.style.fontSize='16px'
    button.style.borderRadius = "16px";
    button.style.padding = "5px 5px";
    button.style.border = "none";
    button.style.backgroundColor = "#4CAF50";
    button.style.color = "white";
    button.style.cursor = "pointer";
    document.body.appendChild(button);

    var settingButton = document.createElement('button');
    settingButton.textContent = 'Default Setting'
    settingButton.style.position = 'absolute';
    settingButton.style.right = '350px';
    settingButton.style.top = '8px';
    settingButton.style.width='160px'
    settingButton.style.fontSize='16px'
    settingButton.style.borderRadius = "16px";
    settingButton.style.padding = "5px 5px";
    settingButton.style.border = "none";
    settingButton.style.backgroundColor = "#4CAF50";
    settingButton.style.color = "white";
    settingButton.style.cursor = "pointer";
    document.body.appendChild(settingButton);

    settingButton.addEventListener('click', getSettings)
    button.addEventListener('click', downloadGeoJSONFromOSMID);
    triggerButton.addEventListener("click", getFeatures);
})();