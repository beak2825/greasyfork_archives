// ==UserScript==
// @name         WME-PermanentlyClosed
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  A Waze Map Editor Script to find permanently closed places
// @author       deqline
// @source       https://github.com/deqline/WME-PermanentlyClosed
// @match        https://www.waze.com/*/editor
// @match        https://www.waze.com/editor
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481447/WME-PermanentlyClosed.user.js
// @updateURL https://update.greasyfork.org/scripts/481447/WME-PermanentlyClosed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let api = undefined;
    let scannedPlaces = [];
    let options = {
        'enabled': false,
        'bbox': false,
        'residential': false,
        'category': "",
        'radius': 50,
        'closed': false,
        'overlays': false,
        'debug': false
    };
    let categories = new Set();
    const debug = false;
    let parentLayerElement = null

    //Waze object
    if (W?.userscripts?.state.isReady) { //optional chaining operator ?.
        console.log("user:", W.loginManager.user);
        console.log("segments:", W.model.segments.getObjectArray());

        InitializeScriptTab();
    } else {
        document.addEventListener("wme-ready", InitializeScriptTab, {
            once: true,
        });
    }

    function refreshOptions() {
        options.enabled     = document.getElementById("enable").checked;
        options.bbox        = document.getElementById("bbox_enable").checked;
        options.residential = document.getElementById("residential_enable").checked;
        options.category    = document.getElementById("category_filter").value;
        options.radius      = document.getElementById("radius_number").value;
        options.closed      = document.getElementById("closed_enable").checked;
        options.overlays   = document.getElementById("overlays_enable").checked;
        options.debug       = document.getElementById("debug_check").checked;
    }

    function refreshUI() {
        for (let p in scannedPlaces) {
            if(p.circleOverlay){
                document.getElementById(p.parentFeatureID).removeChild(p.circleOverlay);
            }

        }

        scannedPlaces.length = 0;
        parentLayerElement = null;

        options = {
            'enabled': false,
            'bbox': false,
            'residential': false,
            'category': "",
            'radius': 50,
            'closed': false
        };
        categories = new Set();
        refreshOptions();
        document.getElementById("scanned-places").innerHTML = "";
        document.getElementById("category_filter").innerHTML = "";

        document.getElementById("bbox_enable").checked = false;
        document.getElementById("residential_enable").checked = false;
        document.getElementById("category_filter").value = "";
        document.getElementById("radius_number").value = 50;
        document.getElementById("closed_enable").checked = false;
        document.getElementById("overlays_enable").checked = false;
        document.getElementById("progress").innerText = " (Progress 0%)";

    }

    function InitializeScriptTab()
    {
        api = window.prompt("Enter your google maps api key (optional)");

        const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("PermanentlyClosed");
        tabLabel.innerHTML = "PermanentlyClosed";

        tabPane.innerHTML = `
        <script async src="https://maps.googleapis.com/maps/api/js?key=${api}&libraries=places"></script>
         <style>
         table {
            border-collapse: collapse;
             width: 100%;
         }

        td,th {
            max-width: 10px;
            word-wrap: break-word; /* Enable word wrap */
            border: 1px solid black;
            text-align: left;
            padding: 8px;
            margin: 2px;
        }
  </style>
         <div id="map" style="display:none;"></div>
         <label for="enable" >Enable</label>
         <input name="enable" type="checkbox" id="enable"><br>

         <label for="radius">Nearby Search radius (in m)</label>
         <input name="radius" id="radius_number" type="number" value="50"><br>

         <label for="residential"> Show residential places </label>
         <input name="residential" type="checkbox" id="residential_enable"><br>

         <label for="show_bounding_box">Show areas</label>
         <input name="show_bounding_box" type="checkbox" id="bbox_enable" checked><br>

         <label for="closed"> Show closed places</label>
         <input name="closed" type="checkbox" id="closed_enable"/><small id="progress"> (Progress 0%)</small><br>

         <label for="closed_overlays"> Show overlays on map </label>
         <input name="closed_overlays" type="checkbox" id="overlays_enable"/><br>

         <label for="debug"> Show console debug </label>
         <input name="debug" type="checkbox" id="debug_check"/><br>

         <label for="category_choice">Filter by category</label>
         <select name="category_choice" id="category_filter"></select><br>


         <span>Scanned places (<span id="place_count"></span>)</span>
         <table style="border: 1px solid black">
            <thead>
                <th>Name</th>
                <th>Coords</th>
                <th>Other</th>
            </thead>
            <tbody id="scanned-places"></tbody>
         </table>
        `;

        W.userscripts.waitForElementConnected(tabPane).then(() => {
            InitializeScript();
        });

    }

    function InitializeScript()
    {
        if(debug) {
            getRenderedMarkers();
        }

        document.getElementById("enable").addEventListener("change", function() {
            refreshOptions();


            if(options.enabled) {
                W.map.registerPriorityMapEvent("moveend", MoveZoomHandler, W.issueTrackerController);
                W.map.registerPriorityMapEvent("zoomend", MoveZoomHandler, W.issueTrackerController);
                getRenderedMarkers();
            } else {
                refreshUI();
                W.map.unregisterMapEvent("moveend", MoveZoomHandler, W.issueTrackerController);
                W.map.unregisterMapEvent("zoomend", MoveZoomHandler, W.issueTrackerController);
                return;
            }
        });


        document.addEventListener("click", function(event) {handleRowClick(event)});

        document.addEventListener("change", function(e) {
            refreshOptions();
            filterByCategory();
            displayPlaces();

            if(e.target.id == "closed_enable")
            {
                if(options.closed){
                    showClosed();
                } else {
                    document.getElementById("progress").innerText = ` (Progress 0%)`;
                }
            }

        });

    }

    function handleRowClick(event)
    {
        if (event.target.tagName == "TD" && event.target.closest("tbody").id == "scanned-places") {
            for(let p of scannedPlaces)
            {
                if(p.name == event.target.textContent) {
                    if(debug) console.log("click!", event.target.textContent, p.featureID);
                    if(p.isBbox) {
                        document.getElementById(p.featureID).setAttribute("stroke", "yellow");
                    } else {
                        document.getElementById(p.featureID).setAttribute("r", "10");
                    }


                    return;
                }
            }
        }
    }

    function updatePlaceCount()
    {
        let i = 0, j = 0;
        for(let p of scannedPlaces) {
            if(p.display) {
                i++;
            }
            if(p.closed) {
                j++;
            }
        }
        document.getElementById("place_count").innerHTML = `${scannedPlaces.length} total, ${i} shown, ${j} closed`;
    }

    //implemented for belgium since sometimes places are in dutch in waze
    function checkSimilarity(obj1, obj2)
    {
        const regex = /[\.-;,\/]+/gm;

        let a = obj1.name.toLowerCase().replaceAll(regex, " ").replaceAll("é", "e").replaceAll("à", "a").replaceAll("è", "e").replaceAll("â", "a");
        let b = obj2.name.toLowerCase().replaceAll(regex, " ").replaceAll("é", "e").replaceAll("à", "a").replaceAll("è", "e").replaceAll("â", "a");

        if(a == b || a.includes(b) || b.includes(a)) return true;


        let substr = "";
        let nb_substr = 0;
        for(let ltr of a) {
            if(ltr == " ") {
                if(b.includes(substr)) return true;
                substr = "";
            }
            else substr += ltr;
        }

        for(let ltr of b) {
            if(ltr == " ") {
                if(a.includes(substr)) return true;
                substr = "";
            }
            else substr += ltr;
        }

        for(let t of obj1.types) {
            for(let t2 of obj2.categories) {
                let a = t.toLowerCase()
                let b = t2.toLowerCase();

                if(a == b || a.includes(b) || b.includes(a)) {
                    return true;
                }

            }
        }

        return false;
    }


    function showClosed()
    {
        if(!scannedPlaces.length) return;

        let mapCenter = new google.maps.LatLng(scannedPlaces[0].coords[0], scannedPlaces[0].coords[1]);
        let map = new google.maps.Map(document.getElementById('map'), {center: mapCenter});
        var service = new google.maps.places.PlacesService(map);

        let progress = 0;

        for (let p of scannedPlaces)
        {
            if(p.display) {
                progress++;

                let circleElem = document.getElementById(p.featureID);
                if(!circleElem) continue;

                //Red/orange overlays over map circles

                circleElem.setAttribute("z-index", "2");
                //create new element with a custom qualifier from an URI
                let newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                //set the new circle coordinates to the parent circle coordinates
                newCircle.setAttribute("cx", circleElem.getAttribute("cx"));
                newCircle.setAttribute("cy", circleElem.getAttribute("cy"));
                //set some styling
                newCircle.setAttribute("r", "12");
                newCircle.setAttribute("fill-opacity", "0.7");
                newCircle.setAttribute("z-index", "1");
                let newID = "_" + circleElem.getAttribute("id");
                newCircle.setAttribute("id", newID);

                let match = false;

                //actual closed places logic

                //First try searching the place on google maps by name and address
                let request = {
                    query: p.name + " " + p.fullAddress, //because google sometimes includes street name inside the results name
                    fields: ['name', 'business_status','formatted_address', 'types']
                }
                service.findPlaceFromQuery(request, function(results, status) {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {

                        if(debug) console.log(results);
                        for (var i = 0; i < results.length; i++) {
                            if(options.debug) console.log(`[google_places_api] Fetched results for findPlace query '${p.name + p.fullAddress}' === ${results[i].name} ( ${results[i].formatted_address} )`);
                            if(checkSimilarity(results[i], p)) {
                                match = true;
                                if(options.debug) console.log("Found similarity");

                                if(results[i].business_status == "CLOSED_PERMANENTLY") { //can also check for "CLOSED_TEMPORARILY" if really needed
                                    p.closed = true;
                                    console.log(p.name, "=>Closed:", results[i]);

                                }
                            }
                        }

                    }

                    if(!match && !p.closed) {
                        //search twice in case we haven't found the place with the first search
                        request = {
                            location: new google.maps.LatLng(p.coords[0], p.coords[1]),
                            radius: options.radius,
                            keywords: p.name
                        };
                        service.nearbySearch(request, function(results, status) {
                            if (status === google.maps.places.PlacesServiceStatus.OK) {

                                if(debug) console.log(results);
                                for (var i = 0; i < results.length; i++) {
                                    if(options.debug) console.log(`[google_places_api] Second try: Fetched results for nearby search query '${p.coords.join(",")}' => matched ${results[i].name}`);
                                    if(checkSimilarity(results[i], p)) {
                                        match = true;
                                        if(options.debug) console.log("Found similarity");

                                        if("business_status" in results[i] && results[i].business_status == "CLOSED_PERMANENTLY") {
                                            p.closed = true;
                                            console.log(p.name, "=>Closed:", results[i]);

                                        }
                                    }
                                }
                            }
                        });
                    }

                    //still no match, means missing info or data mismatch between google maps and waze
                    if(!match) {
                        if(p.display) {
                            //p.node.children[0].style.color = "orange";
                            newCircle.setAttribute("fill", "orange");
                        }
                    }

                    if(p.closed) {
                        updatePlaceCount();
                        if(p.display) {
                            p.node.children[0].style.color = "red";
                            newCircle.setAttribute("fill", "red");
                        }
                        document.getElementById(p.parentFeatureID).appendChild(newCircle);
                        p.circleOverlay = newCircle;
                        if(!options.overlays) {
                            p.circleOverlay.style.display = "none";
                        }
                    }
                });

            }
            document.getElementById("progress").innerText = ` (Progress ${(progress/scannedPlaces.length)*100}%)`;
        }
        document.getElementById("progress").innerText = ` (Progress 100%)`;
        //updatePlaceCount(); //update closed place count
    }

    // Calculate the center coordinate of the purple areas by doing an average of all its coords
    function calculatePolygonCenter(coordinates) {
        if (coordinates.length === 0) {
            return null;
        }

        let sumLat = 0;
        let sumLon = 0;

        for (const coordinate of coordinates) {
            sumLon += coordinate[0];
            sumLat += coordinate[1];
        }

        const avgLat = sumLat / coordinates.length;
        const avgLon = sumLon / coordinates.length;

        return [avgLat, avgLon];
    }

    //define what places should appear in the table on the script tab
    function displayPlaces()
    {
        let placesTable = document.getElementById("scanned-places");

        for(let place of scannedPlaces) {
            if (place.node == null) {
                let cell = document.createElement("tr");

                if(place.coords[0].length > 1) {
                    let center = calculatePolygonCenter(place.coords[0]);
                    place.coords = center;
                }
                let coordsString = place.coords.join(",");

                cell.innerHTML = `
                <td>${place.name}</td>
                <td>${coordsString}</td>
                <td>${place.categories.join(",")}</td>
                `;
                place.node = cell;
            }

            if(place.node != null) {
                //we show the areas in the global list, but when filtering by a category, the display will be affected by the filtering function
                if(options.category == "" && place.isBbox) {
                    place.display = options.bbox;
                    place.node.style.display = (options.bbox ? "" : "none");
                }
                if ("RESIDENCE_HOME" in place.categories)
                {
                    place.display = options.residential;
                    place.node.style.display = (options.residential ? "" : "none");
                }

                if(!options.closed) place.node.children[0].style.color = "black";
                if(place.circleOverlay) place.circleOverlay.style.display = (options.overlays ? "" : "none");

            }

        }

        for(let e of scannedPlaces) {
            //avoid duplicate elements
            if(e.added == false) {
                e.node.style.display = (e.display ? "" : "none");
                placesTable.appendChild(e.node);
                e.added = true;
            }

        }
        updatePlaceCount();
    }

    function updateCategories()
    {
        document.getElementById("category_filter").innerHTML = "";
        categories.clear();
        //no filter option
        let emptyOption = document.createElement("option");
        // Set HTML content for the option
        emptyOption.innerHTML = '----';
        // Set a value for the option (optional)
        emptyOption.value = "";
        options.category = "";

        document.getElementById("category_filter").appendChild(emptyOption);
        document.getElementById("category_filter").value = ""; // set it to default to no filter

        //add closed option
        let closedOption = document.createElement("option");
        // Set HTML content for the option
        closedOption.innerHTML = 'CLOSED';
        // Set a value for the option (optional)
        closedOption.value = "CLOSED";
        categories.add("CLOSED");

        document.getElementById("category_filter").appendChild(closedOption);


        for(let place of scannedPlaces) {
            for(let c of place.categories) {
                if(!categories.has(c)) {
                    let optionCategory = document.createElement("option");
                    optionCategory.innerHTML = c;
                    optionCategory.value = c;
                    document.getElementById("category_filter").appendChild(optionCategory);

                    categories.add(c);
                }
            }
        }
    }

    function refreshPlaceList()
    {
        //refresh table first
        for(let p of scannedPlaces) {
            if(p.isBbox && !options.bbox) continue;
            if(("RESIDENCE_HOME" in p.categories) && !options.residential) continue;

            p.display = true;
            if(p.node) {
                p.node.style.display = "";
            }
            if(p.featureID.length > 0) {
                if(document.getElementById(p.featureID) == null) {
                    deletePlace(p.featureID);
                    continue;
                }
                document.getElementById(p.featureID).style.display = "";
            }
        }
    }

    function filterByCategory()
    {
        refreshPlaceList();
        if(options.category == "") return;

        for(let p of scannedPlaces) {
            if(options.category == "CLOSED"){
                if(!p.closed){
                    p.display = false;
                    p.node.style.display = "none";
                    document.getElementById(p.featureID).style.display = "none";
                }
                continue;
            }

            if(p.featureID.length > 0){
                if(document.getElementById(p.featureID) === null) {
                    deletePlace(p.featureID);
                    continue;
                }
            }


            if( !p.categories.includes(options.category)) {
                p.display = false;
                p.node.style.display = "none";
                document.getElementById(p.featureID).style.display = "none";
            }
        }
    }

    function MoveZoomHandler() {
        //remove out of view features

        for(let p of scannedPlaces){
            if(p.featureID.length > 0){
                if(document.getElementById(p.featureID) === null) {
                    deletePlace(p.featureID);
                }
            }
        }
        getRenderedMarkers();
    }

    function deletePlace(featureID)
    {
        let toRemove = [];
        for(let p of scannedPlaces) {
            if(p.featureID == featureID) {
                if(p.node != null){
                    let parent = document.getElementById("scanned-places");
                    if(parent.contains(p.node)){
                        //p.display = false;
                        parent.removeChild(p.node);
                        toRemove.push(p);
                        //scannedPlaces = scannedPlaces.filter((p) => {return p.featureID != featureID;});
                        //console.log("Removing", place.name, " ", scannedPlaces);
                    }

                }
            }
        }
        for(let place of toRemove){
                scannedPlaces = scannedPlaces.filter((p) => {return p != place;});
        }
        updatePlaceCount();
    }

    function sameCoords(coords1, coords2)
    {
        if(coords1.length != coords2.length) {
            return false;
        }

        for(let i = 0; i < coords1.length; i++){
            if(coords1[i] != coords2[i]){
                return false;
            }
        }
        return true;
    }

    function getRenderedMarkers()
    {
        console.log("Rendering");

        let renderedLayers = W.map.nodeLayer.renderer.map.layers;

        if(!parentLayerElement && renderedLayers) {
            for(let layerElement of renderedLayers) {

                if(debug) console.log(layerElement.name, " : ", layerElement);


                if(layerElement.name  == "venues") {
                    parentLayerElement = layerElement;
                }
            }
        }


        let parentFeatureID      = parentLayerElement.renderer.vectorRoot.id;
        let renderedPlaceMarkers = parentLayerElement.features;

        if(debug) console.log("rendered place markers : ", renderedPlaceMarkers);

        for(let marker of renderedPlaceMarkers) {
            let markerFeatureObject = marker.data.wazeFeature._wmeObject;
            let featureElement = W.userscripts.getFeatureElementByDataModel(markerFeatureObject);

            //if we successfully got the id of the circle marker on the map
            if(featureElement) {
                let point = document.getElementById(featureElement.id);

                let markerDetails = markerFeatureObject.attributes;
                if(debug) console.log(markerFeatureObject);

                let streetsObject = markerFeatureObject.model.streets.objects;
                let citiesObject = markerFeatureObject.model.cities.objects;

                let fullAddress = "";
                let partialAddress = "";
                let street = streetsObject[markerFeatureObject.attributes.streetID];
                if(street) {
                    let city = citiesObject[street.attributes.cityID];
                    let country = markerFeatureObject.model.topCountry.attributes.name;
                    if(city && country && markerDetails.houseNumber) {
                        fullAddress = `${markerDetails.houseNumber} ${street.attributes.name}, ${city.attributes.name}, ${country}`;
                    } else if (city && country) {
                        partialAddress = `${city.attributes.name}, ${country}`;
                    }

                }

                let placeDetails = {
                    'name': markerDetails.residential ? "maison n°" +
                    markerDetails.houseNumber : (markerDetails.name.length > 0 ? markerDetails.name : "/"),
                    'coords': markerDetails.geoJSONGeometry.coordinates.reverse(),
                    'topAddress':partialAddress,
                    'fullAddress': fullAddress,
                    'categories': markerDetails.categories,
                    'businessDetails': {
                        'tel': markerDetails.phone,
                        'website': markerDetails.url
                    },
                    'description': markerDetails.description,
                    'node': null,
                    'featureID': featureElement.id,
                    'parentFeatureID': parentFeatureID,
                    'circleOverlay': null,
                    'isBbox': markerDetails.geoJSONGeometry.type == "Polygon",//bounding boxes (polygon of multiple points)
                    'display': true,
                    'closed': false,
                    'added': false //added to table
                };

                let duplicate = false;
                for(let p of scannedPlaces) {
                    if(sameCoords(p.coords, placeDetails.coords) || p.featureID == placeDetails.featureID) {
                        duplicate = true;
                    }
                }
                if(!duplicate) {
                    scannedPlaces.push(placeDetails);
                }
            }
        }
        displayPlaces();
        updateCategories();
    }
})();