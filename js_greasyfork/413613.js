// ==UserScript==
// @name         WME Import HMP
// @icon         https://cdn1.iconfinder.com/data/icons/Momentum_MatteEntireSet/32/list-edit.png
// @namespace    WMEI
// @version      2020.10.17.2
// @description  Import place points into the Waze Map
// @author       Sjors 'GigaaG' Luyckx
// @copyright    2019, Sjors 'GigaaG' Luyckx
// @include      https://www.waze.com/editor*
// @include      https://www.waze.com/*/editor*
// @include      https://beta.waze.com/editor*
// @include      https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/*
// @exclude      https://www.waze.com/*/user/*
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
// @grant        GM_xmlhttpRequest
// @connect      https://hmps.sjorsluyckx.nl/

// @downloadURL https://update.greasyfork.org/scripts/413613/WME%20Import%20HMP.user.js
// @updateURL https://update.greasyfork.org/scripts/413613/WME%20Import%20HMP.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function bootstrap(tries = 1) {
        if (W && W.map && W.model && W.loginManager.user && $ && WazeWrap && WazeWrap.Ready && require) {
            init();
        } else if (tries < 1000)
            setTimeout(function () {bootstrap(tries++);}, 200);
    }

    // Set variables
    var hmpdata;
    var count;
    var h = 0;
    var p = 0;
    var username;
    var rankUser;
    var lockLevel;
    var imported = [];

    var waitForEl = function(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    function init(){
        username = W.loginManager.user.userName;
        rankUser = W.loginManager.user.rank;
        if (rankUser < 3){
            lockLevel = rankUser
        } else {
            lockLevel = 3
        }

        var $section = $("<div>");
        $section.html([
            '<div>',
            '<h2>WME Import</h2>',
            '<b>Hoi ' + username + '! </b>',
            '<p>Selecteer uit onderstaand dropdown menu de weg waarvan je de hectometerpaaltjes wilt gaan importeren. Voeg eventuele extra opties toe in de input velden en druk vervolgens op de donwload button.</p>',
            '<b>Opties:</b><br>',
            '<span>Begin: <input id="beginHMP" style="width:50px"></input>',
            '<span>Eind: <input id="eindHMP" style="width:50px"></input>',
            '<span>Letter: <input id="letter" style="width:25px"></input><br>',
            '<span><select style="width:25%;margin-top:5px;align:center" id="WMEIRoadSelect"><option value=""></option></select><button id="WMEIdownloadButton"><center>Klik om te downloaden</center></button><span>',
            '<p id="WMEIMessage"></p>',
        ].join(' '));

        new WazeWrap.Interface.Tab('WME Import', $section.html(), initializeSettings);
        document.getElementById('WMEIdownloadButton').style.visibility = "hidden";
        document.getElementById('WMEIRoadSelect').addEventListener("change", downloadButton);
        document.getElementById('beginHMP').addEventListener("keyup", downloadButton);
        document.getElementById('eindHMP').addEventListener("keyup", downloadButton);
        document.getElementById('WMEIdownloadButton').addEventListener("click", downloadHMPS);
        document.getElementsByClassName('toolbar-button waze-icon-save')[0].addEventListener("click", saveImported);
        requestAssignedRoads();
    }

    function initializeSettings(){
    }

    function saveImported(){
        if ($("#WMEImportButton").length > 0){
        $("#WMEImportButton").attr("disabled", "disabled");
        // Make sure the save popover is shown before running the script
        var selector = ".save-popover"
        waitForEl(selector, function() {
        if ($(".save-popover").find(".error-list").length > 0){
            if (imported.length > 0){
                if (window.confirm("De hmp's zijn niet opgeslagen. Refresh de pagina en probeer het opnieuw.")){
                    location.reload();
                } else {
                    location.reload();
                }
            }
        } else {
            if (imported.length > 0){
                var jsonString = JSON.stringify(imported);

                $.ajax({
                    url: 'https://hmps.sjorsluyckx.nl/save.php',
                    type: "GET",
                    data: {"ID":jsonString},
                    dataType: 'json',
                    crossDomain: true,
                    success: function(response){
                        var countSaved = imported.length;
                        document.getElementById('WMEIMessage').innerHTML = countSaved + " hmp's zijn geimporteerd en opgeslagen.";
                        imported = [];
                        h = 0;
                    },
                    error: function(response){
                        console.log('Error:' + JSON.stringify(response));
                    }
                })
            }
        }
        $("#WMEImportButton").attr("disabled", false);
        });
        }
    }

    function downloadHMPS(){
        getHMPS();
        var WMEButton = document.getElementById('WMEImportButton');

        if (WMEButton == null){
            var editbuttons = document.getElementById('edit-buttons');
            var button = document.createElement('button');
            button.innerText = 'Loading...';
            button.classList.add("btn", "btn-default");
            button.setAttribute("id", "WMEImportButton");
            button.style.marginTop = "7px";
            button.style.marginLeft = "1px";
            button.onclick = buttonClick;
            editbuttons.appendChild(button);
        } else {
            console.log('Button already exists');
            WMEButton.innerText = 'Loading...';
            document.getElementById('WMEIMessage').innerHTML = ""
        }
    }

    function downloadButton(){
        var value = document.getElementById('WMEIRoadSelect').value
        var beginHMP = document.getElementById('beginHMP').value
        var eindHMP = document.getElementById('eindHMP').value
        var button = document.getElementById('WMEIdownloadButton')
        if (value != ""){
            if ((beginHMP == "" && eindHMP == "") || (beginHMP != "" && eindHMP != "")){
                button.style.visibility = "visible";
            } else {
                button.style.visibility = "hidden";
            }
        } else {
            button.style.visibility = "hidden";
        }
    }

    function getHMPS(){
        var weg = document.getElementById('WMEIRoadSelect').value
        var beginHMP = document.getElementById('beginHMP').value
        var eindHMP = document.getElementById('eindHMP').value
        var letter = document.getElementById('letter').value
        $.ajax({
            url: 'https://hmps.sjorsluyckx.nl/hmp.php',
            type: "GET",
            data: {"weg":weg,"begin":beginHMP,"eind":eindHMP,"letter":letter},
            dataType: 'json',
            crossDomain: true,
            success: function(response){
                hmpdata = response;
                console.log(hmpdata);
                count = response.length
                document.getElementById('WMEIMessage').innerHTML = count + " hmp's staan klaar om geimporteerd te worden.";
                document.getElementById('WMEImportButton').innerText = "Volgende (" + count + ")";
            },
            error: function(response){
                console.log('Error:' + JSON.stringify(response));
            }
        })
    }

    function requestAssignedRoads(){
        $.ajax({
            url: 'https://hmps.sjorsluyckx.nl/roads.php',
            type: "GET",
            data: {'editor':username},
            dataType: 'json',
            crossDomain: true,
            success: function(response){
                var selectRoad = document.getElementById('WMEIRoadSelect');
                var i;
                for(i=0 ; i < response.length ; i++){
                    var opt = document.createElement('option');
                    opt.value = response[i];
                    opt.innerHTML = response[i];
                    selectRoad.appendChild(opt);
                }
            },
            error: function(response){
                console.log('Error:' + JSON.stringify(response));
            }
        })
    }

    function buttonClick(){
        // If there are 50 hmp's imported, save them to avoid trouble saving later.
        if (h == 50){
            document.getElementsByClassName('toolbar-button waze-icon-save')[0].click();
            return
        }

        // Getting the data for the place point.
        var pointdata = hmpdata[p];
        var id = pointdata.id;
        var x = pointdata.X;
        var y = pointdata.Y;
        var hmp = pointdata.hmp;
        console.log(hmp);
        hmp = parseFloat(hmp).toFixed(1);
        var hmpl = pointdata.letter;
        var hmpz = pointdata.zijde;
        var weg = pointdata.weg;

        // Building the correct title
        if (hmpl != ""){
            hmp += " " + hmpl;
        }
        if (hmpz != ""){
            hmp = hmpz + " " + hmp;
        }
        var pointtitle = weg + " " + hmp;
        pointtitle = pointtitle.replace(".", ",");

        // Adjust the i variable and add ID to array
        imported.push(id);
        h = h + 1;
        p = p + 1;
        document.getElementById('WMEImportButton').innerText = "Next import (" + (count - h) + ")";

        // Create point
        createPlace(x,y,pointtitle);
    }

    function createPlace(x, y, title){
        // Set screen to point place
        W.map.setCenter([x , y], 6);

        var PlaceObject = require("Waze/Feature/Vector/Landmark");
        var AddPlace = require("Waze/Action/AddLandmark");
        var NewPlace = new PlaceObject();

        // Creating NewPlace with place details
        NewPlace.geometry = new OL.Geometry.Point(x, y);
        NewPlace.attributes.categories.push("TRANSPORTATION");
        NewPlace.attributes.categories.push("JUNCTION_INTERCHANGE");
        NewPlace.attributes.name = title;
        NewPlace.attributes.description = "Ten behoeve van de hulpdiensten. \nBron: Rijkswaterstaat";
        NewPlace.attributes.lockRank = lockLevel; // <- insert lock level -1

        // Adding the NewPlace to the map
        W.model.actionManager.add(new AddPlace(NewPlace));

        // Because selecting fails sometimes.
        try {
            W.selectionManager.setSelectedModels([NewPlace]);
            // Set address 'empty'
            var selector = ".full-address"
            waitForEl(selector, function() {
                $(".full-address").click();
                var selector = ".city-name.form-control"
                console.log("wait for address");
                waitForEl(selector, function(){
                    while ($(".street-name.form-control").is(":enabled")){
                        $(".empty-street").click();
                    }
                    while ($(".city-name.form-control").is(":enabled")){
                        $(".empty-city").click();
                    }
                    $(".save-button.waze-btn.waze-btn-blue.waze-btn-smaller").click();
            })
            })
        } catch (error) {
            console.log(error);
            W.selectionManager.setSelectedModels([NewPlace]);
            var selector = ".tab-content"
            waitForEl(selector, function() {
                $(".full-address").click();
                var selector = ".city-name.form-control"
                waitForEl(selector, function(){
                    $(".empty-city").prop('checked', true);
                    $(".empty-street").prop('checked', true);
                    $(".save-button.waze-btn.waze-btn-blue.waze-btn-smaller").click();
                });
            })
        }
    }

    bootstrap();
})();