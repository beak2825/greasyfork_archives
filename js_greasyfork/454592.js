// ==UserScript==
// @name         MultipleSchools
// @version      1.0.6
// @description  Use more than 4 classes at once
// @author       Allure149; translated by tylernelson224
// @match        https://*www.missionchief.com/buildings/*
// @grant        none
// @namespace https://greasyfork.org/users/981346
// @downloadURL https://update.greasyfork.org/scripts/454592/MultipleSchools.user.js
// @updateURL https://update.greasyfork.org/scripts/454592/MultipleSchools.meta.js
// ==/UserScript==
/* global $ */

(async function(){
    var schoolToSearch = +$("h1:first").attr("building_type") || null;
    var accessibleBuildings = [19, 4, 7, 24,];

    if(schoolToSearch == null || !accessibleBuildings.includes(schoolToSearch)){
        return false;
    }

    async function loadBuildingsApi(){
        if(!sessionStorage.aBuildings || JSON.parse(sessionStorage.aBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) {
            await $.getJSON("/api/buildings.json").done(data => sessionStorage.setItem("aBuildings", JSON.stringify({lastUpdate: new Date().getTime(), value: data})) );
        }
        return JSON.parse(sessionStorage.aBuildings).value;
    }

    async function loadAllianceBuildingsApi(){
        if(!sessionStorage.aAllianceBuildings || JSON.parse(sessionStorage.aAllianceBuildings).lastUpdate < (new Date().getTime() - 5 * 1000 * 60)) {
            await $.getJSON("/api/alliance_buildings.json").done(data => sessionStorage.setItem("aAllianceBuildings", JSON.stringify({lastUpdate: new Date().getTime(), value: data})) );
        }
        return JSON.parse(sessionStorage.aAllianceBuildings).value;
    }

    var aBuildings = await loadBuildingsApi();
    var personalIds = [];

    var thisSchoolId = +window.location.pathname.match((/[0-9]+/));
    var thisSchoolName = $("h1:first").text();
    var thisSchoolFreeClasses = $("#building_rooms_use option").length || 1;
    var schoolsToUse = [{"id": thisSchoolId, "name": thisSchoolName, "free": thisSchoolFreeClasses}];

    var searchThroughBuildings = await (async function(){
        if($(".dl-horizontal:first a").length > 0 && $(".dl-horizontal:first a").attr("href").indexOf("alliances") > -1){
            var aAllianceBuildings = await loadAllianceBuildingsApi();
            return aAllianceBuildings;
        } else {
            return aBuildings;
        }
    })();

    var freeClasses = 1;
    for(var building of searchThroughBuildings){
        freeClasses = 1;
        if(building.building_type == schoolToSearch && building.caption != thisSchoolName){
            for(var extension of building.extensions){
                if(extension.available && extension.enabled) freeClasses++;
            }

            if(building.schoolings.length > 0) freeClasses -= building.schoolings.length;
            if(freeClasses > 0) {
                schoolsToUse.push({"id": building.id, "name": building.caption, "free": freeClasses});
            }
        }
    }

    schoolsToUse.sort((a,b)=>a.name>b.name);

    var savedSchoolsToUse = schoolsToUse;

    if($("#building_rooms_use").length == 0){
        $("h3:first").before(`<label for="building_rooms_use">How many rooms should be used for this training? </label>
                              <select id="building_rooms_use" name="building_rooms_use">
                                  <option value="1">1</option>
                              </select>`);

    }

    $("input[name=commit]:last").after(`<span class="btn btn-success navbar-btn" id="multiple_commits">Start Education</span>`);
    $("input[name=commit]").remove();

    $("#building_rooms_use").after(`<br><label for="multipleClassesSelect">Should special schools be used?</label> <input class="form-check-input" type="checkbox" value="" id="cbxMultipleClassrooms"><select multiple="" class="form-control hidden" id="multipleClassesSelect" style="height:10em;width:32em"></select>`);

    for(var school of schoolsToUse){
        if(school.name != thisSchoolName) $("#multipleClassesSelect").append(`<option value="${school.free}" building_id="${school.id}">${school.name}</option>`);
    }

    var freeTotal = (function(){
        var multivalues = $("#multipleClassesSelect").val();
        if(multivalues && multivalues.val().length > 0) return $("#multipleClassesSelect").val().map((s)=>Number(s)).reduce((a,b)=>a+b,0);
        else return Object.values(schoolsToUse).reduce((a,b)=>a+b.free,0);
    })();

    function createGlobalOptions(){
        $("#building_rooms_use option").remove();
        for(var i = 1; i <= freeTotal; i++){
            $("#building_rooms_use").append(`<option value="${i}">${i}</option>`);
        }
    }

    createGlobalOptions();

    $("#building_rooms_use").on("change", function(){
        update_schooling_free();
    });

    $("#cbxMultipleClassrooms").on("change", function(a){
        $("#multipleClassesSelect option:selected").each(function(){
            $(this).prop("selected", false);
        });

        schoolsToUse = savedSchoolsToUse;
        createGlobalOptions();

        if(a.target.checked) $("#multipleClassesSelect").removeClass("hidden");
        else $("#multipleClassesSelect").addClass("hidden");
    });

    $("#multipleClassesSelect").on("change", function(){
        update_schooling_free();

        var classCounter = 0;

        schoolsToUse = [{"id": thisSchoolId, "name": thisSchoolName, "free": thisSchoolFreeClasses}];

        $("#building_rooms_use option").remove();
        var options = $("option:selected", this);
        if(options.length == 0) {
            createGlobalOptions();
            schoolsToUse = savedSchoolsToUse;
        } else {
            for(var i = 0; i < options.length; i++){
                var el = options[i];
                schoolsToUse.push({"id": +el.attributes.building_id.value, "name": el.text, "free": +el.value});
                classCounter += +el.value;
            }

            for(var j = 1; j <= classCounter+thisSchoolFreeClasses; j++){
                $("#building_rooms_use").append(`<option value="${j}">${j}</option>`);
            }
        }
    });

    $("#multiple_commits").on("click", async function(){
        $("#multiple_commits").after(`<span id="multipleClassesOutput" class="label label-warning" style="font-size: 14px">Loading... Please wait...</span>`);
        for(var counter in $(".schooling_checkbox")){
            var el = $(".schooling_checkbox")[counter];
            var usePersonal = el.checked;
            if(usePersonal) personalIds.push(el.value);
        }

        var education = (function() {
            for(var counter in $("form input.radio")){
                var el = $("form input.radio")[counter];

                if(el && el.checked) return +el.attributes.value.value;
            }
        });

        var classCounter = +$("#building_rooms_use")[0].value;
        var auswertung = {"schulen": 0, "klassen": classCounter};

        var persTemp = [];
        for(var school of schoolsToUse){
            auswertung.schulen++;
            persTemp = [];
            var loopCounter = school.free * 10 > personalIds.length ? personalIds.length : school.free * 10;

            for(var j = 0; j < loopCounter; j++){
                persTemp.push(personalIds[0]);
                personalIds.splice(0,1);

                if(personalIds.length == 0) break;
            }

            var usedClasses = classCounter <= school.free ? classCounter : school.free;

            var params = {
                "education": education,
                "personal_ids": persTemp,
                "building_rooms_use": usedClasses
            }

            if($("#alliance_duration")[0].value != 0){
                params.alliance = {
                    "duration": $("#alliance_duration")[0].value,
                    "cost": $("#alliance_cost")[0].value
                };
            }

            await $.post("/buildings/" + school.id + "/education", params, function(){
                $("#multipleClassesOutput").text(`${school.name} was over ${usedClasses} ${(usedClasses==1?"new course":"new courses")} informed.`);
            });

            classCounter -= school.free;
            if(classCounter <= 0) break;
        }

        $("#multipleClassesOutput").toggleClass("label-warning label-success").text(`${auswertung.schulen} ${(auswertung.schulen==1?"school became":"schools became")} über ${auswertung.klassen} ${(auswertung.klassen==1?"new course":"new courses")} successfully informed.`);
        setTimeout(window.location.reload(), 1000);
    });
})();
