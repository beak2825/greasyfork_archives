// ==UserScript==
// @name         [hwm]_one_page_facilities_enroll
// @namespace    Facilities to enroll on one page
// @version      0.1
// @description  Displays mining, machining, and production facilities all on one map page
// @author       Hapkoman
// @include      https://www.lordswm.com/map.php*
// @include      https://www.heroeswm.ru/map.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lordswm.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522515/%5Bhwm%5D_one_page_facilities_enroll.user.js
// @updateURL https://update.greasyfork.org/scripts/522515/%5Bhwm%5D_one_page_facilities_enroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //script name
    let scriptName = "[hwm]_one_page_facilities_enroll";
    //variables declaration
    let facilities = [];

    //check if moving and if yes do not execute script.
    if (document.getElementById("map_right_block") === null){
        console.log(scriptName + " moving across sectors");
    } else {
        //hwm_map_send_obj_block_request(event, 48, 52, 'hs');
        //get the mining/machining/production buttons on map page to get current page looked at
        let aLinks = document.getElementsByClassName("map_sel_obj_t");
        //Only get list of facilities for the first 3 links (i.e., mining, machining, production) in backwards order to get highest profit first
        for (let i = 2; i >=0; i--){
            //get the region and type of facility for request
            let hrefParams = aLinks[i].href.split("?")[1].split("&");
            let cx = hrefParams[0].split("=")[1];
            let cy = hrefParams[1].split("=")[1];
            let st = hrefParams[2].split("=")[1];
            //request facilities and store in a facilities array and render
            sendFacilityBlockRequest(cx, cy, st);
        }

    }

    //Sends the XML request to get list of facilities for certain page
    function sendFacilityBlockRequest(cx, cy, st){
        //Using lords admin code to send request but can't use their functions as they reload page
        let facilityXMLHttpReq = new XMLHttpRequest();
        facilityXMLHttpReq.open('GET', 'map.php?cx='+cx+'&cy='+cy+'&st='+st+'&action=get_objects&js_output=1;');
        facilityXMLHttpReq.onreadystatechange = handleFacilityResponse;
        facilityXMLHttpReq.send(null);
    }
    //Handle the response after requesting facility
    function handleFacilityResponse(){
        var obj = this;
        if (obj.readyState == 4){
            var txt = obj.responseText;
            var data = txt.split(MAP_CSS_GOOD_JS_ANSWER_DELIMITER);
            //check for valid data from admin code
            if (data && data.length >= 3 && data[0] == MAP_CSS_GOOD_JS_ANSWER_PREFIX && data[1] && data[2] && document.getElementById(data[1])){
                //move text response into html to easily filter and find facilities that have an open enrollment
                let htmlElementContainer = document.createElement('div');
                htmlElementContainer.innerHTML = data[2];
                [...htmlElementContainer.querySelectorAll("a")].filter(a => a.textContent === " »»» ").forEach(a => facilities.push(a.parentElement.parentElement));
                //render all facilities each time
                renderFacilitiesList();
            }
        } else {
            console.log(scriptName + " failed to gather facility list from XMLHttp request");
        }
    }
    function renderFacilitiesList(){
        //Find table with all facilities
        let facilityTBodyElem = document.getElementById("hwm_map_objects_and_buttons").children[1].children[1].children[0].children[0];
        //add each elem to map list
        facilities.filter(tr => !facilityTBodyElem.innerHTML.includes(tr.children[0].children[0].innerHTML)).forEach(tr => facilityTBodyElem.insertBefore(tr, facilityTBodyElem.childNodes[2]));

    }
})();