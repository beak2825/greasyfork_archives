// ==UserScript==
// @name         WAZEPT Segments
// @version      2024.06.30
// @description  Facilitates the standardization of segments
// @author       J0N4S13 (jonathanserrario@gmail.com)
// @include 	   /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude        https://www.waze.com/user/*editor/*
// @exclude        https://www.waze.com/*/user/*editor/*
// @grant        none
// @namespace https://greasyfork.org/users/218406
// @downloadURL https://update.greasyfork.org/scripts/406000/WAZEPT%20Segments.user.js
// @updateURL https://update.greasyfork.org/scripts/406000/WAZEPT%20Segments.meta.js
// ==/UserScript==

(function() {
    var version = GM_info.script.version;
    var roads_id = [3,4,6,7,2,1,22,8,20,17,15,18,19];
    var pedonal_id = [5,10,16];
    var array_config_script = {};
    var array_config_country = {};
    var array_language_original = {};
    var array_language_country = {};
    var language = {};
    var indexselected = "";
    var valueselected = "";
    var array_roads = {};
    var last_node_A = null;
    var last_node_B = null;
    var last_coord_esquerda_first = null;
    var last_coord_esquerda_last = null;
    var last_coord_direita_first = null;
    var last_coord_direita_last = null;
    var sentido_base = null;

    function bootstrap() {
        if (typeof W === 'object' && W.userscripts?.state.isReady) {
            init();
        } else {
            document.addEventListener('wme-ready', init, { once: true });
        }
    }

    async function init() {
        var result = await getLanguages();

        result = await getConfigsScript();
        if(array_config_script[W.model.getTopCountry().attributes.abbr] !== undefined)
            result = await getConfigsCountry(array_config_script[W.model.getTopCountry().attributes.abbr]);

        setTimeout(() => {
            W.selectionManager.events.register('selectionchanged', null, selectedFeature);
            selectedFeature();
        }, 250);

    }

    function selectedFeature(){
        var typeData = null;
        setTimeout(() => {
            if(typeof W.selectionManager.getSelectedFeatures()[0] != 'undefined')
                typeData = W.selectionManager.getSelectedFeatures()[0]._wmeObject.type;
            if (typeData == "segment")
            {
                myTimer();
                if(W.loginManager.getUserRank() >= 3)
                    insertButtons();
            }
        }, 100)
    }

    function getConfigsScript() {
        return new Promise(resolve => {

            fetch('https://docs.google.com/spreadsheets/d/1s_vcC-ENS7JdkVmVH2QceGMA058tan2UUPlQGd6AhwU/gviz/tq?tqx=out:json&sheet=Config')
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                let first = false;
                $(json.table.rows).each(function(){
                    if(first == false)
                    {
                        first = true;
                        return;
                    }
                    array_config_script[verifyNull(this["c"][0])] = verifyNull(this["c"][1]);
                });
            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_config_script).length > 0 && W.model.getTopCountry() != null)
                {
                    clearInterval(timer);
                    resolve('true');
                }
            }
        });
    }

    function getConfigsCountry(link) {
        let timeout = 0;
        return new Promise(resolve => {

            fetch(link)
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                $(json.table.rows).each(function(){
                    if(verifyNull(this["c"][0]) == true)
                    {
                        var elem = [verifyNull(this["c"][4]), verifyNull(this["c"][5]), verifyNull(this["c"][6]), verifyNull(this["c"][7]), verifyNull(this["c"][8])];
                        array_config_country[verifyNull(this["c"][1])] = elem;
                        array_roads[verifyNull(this["c"][1])] = [verifyNull(this["c"][2]), verifyNull(this["c"][3])];
                    }
                });
            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_config_country).length > 0 || timeout >= 20)
                {
                    clearInterval(timer);
                    resolve('true');
                }
                timeout = timeout + 1;
            }
        });
    }

    function getLanguages() {
        let timeout = 0;
        return new Promise(resolve => {

            fetch('https://docs.google.com/spreadsheets/d/1qkWpUItMINWmtn7HtrpmZbRPtAnz0x0zjrIWB7lnOqI/gviz/tq?tqx=out:json')
                .then(res => res.text())
                .then(text => {
                const json = JSON.parse(text.substr(47).slice(0, -2))

                let first = false;
                $(json.table.rows).each(function(){
                    if(first == false)
                    {
                        first = true;
                        return;
                    }

                    if(verifyNull(this["c"][0]) == "Original String")
                    {
                        array_language_original["btnSplit"] = verifyNull(this["c"][1]);
                        array_language_original["strMeters"] = verifyNull(this["c"][2]);
                        array_language_original["strDistance"] = verifyNull(this["c"][3]);
                        array_language_original["strSelMoreSeg"] = verifyNull(this["c"][4]);
                    }
                    if(verifyNull(this["c"][0]).toLowerCase() == JSON.parse(localStorage.getItem("editorLocation"))["locale"].toLowerCase())
                    {
                        array_language_country["btnSplit"] = verifyNull(this["c"][1]);
                        array_language_country["strMeters"] = verifyNull(this["c"][2]);
                        array_language_country["strDistance"] = verifyNull(this["c"][3]);
                        array_language_country["strSelMoreSeg"] = verifyNull(this["c"][4]);
                    }
                });

            })

            var timer = setInterval(check_data, 100);

            function check_data() {
                if(Object.keys(array_language_original).length > 0 || timeout >= 20)
                {
                    if(Object.keys(array_language_country).length == 0)
                        language = array_language_original;
                    $.each(array_language_country, function(code, string) {
                        if(string == "")
                            language[code] = array_language_original[code];
                        else
                            language[code] = array_language_country[code];
                    });
                    clearInterval(timer);
                    resolve('true');
                }
                timeout = timeout + 1;
            }
        });
    }

    function myTimer() {

        var n_bloqueio;
        var nivel;
        var lvl_atual;
        var lvl_max;

            if (!$("#signsroad").length) {
                var signsroad = document.createElement("div");
                signsroad.id = 'signsroad';

                $.each(array_roads, function(func , emoji) {

                    // The sign background
                    var addsign = document.createElement("div");
                    addsign.id = 'sign_' + func;

                    // Get width/height of sign background img
                    addsign.style.cssText = 'cursor:pointer;float:left;width:34px;height:34px;';
                    // Credits for some of these parts go to t0cableguy & Rickzabel
                    addsign.onclick = function() {

                        indexselected = func;

                        if(indexselected == 'LD_ROUNDABOUT')
                        {
                            if(W.selectionManager.getSelectedFeatures()[0]._wmeObject.isInRoundabout())
                            {
                                let coords = [];
                                let segsfeitos = [];
                                let segmentos = W.selectionManager.getSelectedFeatures()[0]._wmeObject.getRoundabout().attributes.segIDs;
                                let primeiro = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.id;
                                let segmento = primeiro;
                                let feitos = 0;

                                let polyPoints = [];

                                do{
                                    let seg = W.selectionManager.model.segments.getObjectById(segmento);

                                    if(seg.attributes.fwdDirection)
                                    {
                                        for (let i=0; i<seg.geometry.getVertices().length - 1; i++) {
                                            polyPoints.push(seg.geometry.getVertices()[i])
                                        }
                                    }
                                    else
                                    {
                                        for (let i=0; i<seg.geometry.getVertices().length - 1; i++) {
                                            polyPoints.push(seg.geometry.getVertices().reverse()[i])
                                        }
                                    }

                                    if(seg.attributes.fwdDirection)
                                    {
                                        W.selectionManager.model.nodes.getObjectById(seg.attributes.toNodeID).attributes.segIDs.forEach(function(aux){
                                            if(aux != segmento && segmentos.includes(aux) && !segsfeitos.includes(aux))
                                            {
                                                segsfeitos.push(segmento);
                                                segmento = aux;
                                            }
                                        });
                                    }
                                    else
                                    {
                                        W.selectionManager.model.nodes.getObjectById(seg.attributes.fromNodeID).attributes.segIDs.forEach(function(aux){
                                            if(aux != segmento && segmentos.includes(aux) && !segsfeitos.includes(aux))
                                            {
                                                segsfeitos.push(segmento);
                                                segmento = aux;
                                            }
                                        });
                                    }
                                    feitos++;
                                } while (feitos < segmentos.length)

                                var polygon=new OpenLayers.Geometry.Polygon(new OpenLayers.Geometry.LinearRing(polyPoints));
                                polygon.calculateBounds();

                                let AddLandmark= require("Waze/Action/AddLandmark");
                                var wazefeatureVectorLandmark = require("Waze/Feature/Vector/Landmark");

                                var poi = new wazefeatureVectorLandmark({geoJSONGeometry:W.userscripts.toGeoJSONGeometry(polygon)});

                                var TabLine2 = [];

                                poi.attributes.categories = new Array("JUNCTION_INTERCHANGE");

                                let bloquear;
                                if(W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.lockRank == null)
                                    bloquear = null;
                                else
                                {
                                    let rank = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes.lockRank + 1;
                                    rank--;
                                    if(W.loginManager.user.rank >= rank)
                                        bloquear = rank;
                                    else
                                        bloquear = W.loginManager.user.rank;
                                }
                                poi.attributes.lockRank = bloquear;

                                W.model.actionManager.add(new AddLandmark(poi));

                                W.selectionManager.setSelectedModels(poi);
                            }

                            return;

                        }

                        if(indexselected == 'DATA_TOLLS')
                        {

                            let myRoad = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;

                            var from = "";
                            var to = "";
                            var sentido = "";

                            if(myRoad.fwdDirection == true && myRoad.revDirection == true)
                            {
                                $( "#divSentidos" ).show();
                            }
                            else
                            {
                                if(myRoad.fwdDirection == true) //A to B
                                {
                                    from = myRoad.fromNodeID;
                                    to = myRoad.toNodeID;
                                    sentido = "TRUE";
                                }

                                else if(myRoad.revDirection == true)//B to A
                                {
                                    from = myRoad.toNodeID;
                                    to = myRoad.fromNodeID;
                                    sentido = "FALSE";
                                }
                                let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
                                .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                                var $temp = $("<input>");
                                $("body").append($temp);
                                $temp.val(center.lon.toString().slice(0,8) + "," + center.lat.toString().slice(0,8) + "|" + W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["id"] + "|" + sentido + "|" + getPermalink() + "|" + from + "|" + to).select();
                                document.execCommand("copy");
                                $temp.remove();
                            }

                            return;

                        }

                        if(indexselected == 'REMOVE_INSTRUCTIONS')
                        {
                            RemoveInstructions();
                        }

                        $.each(W.selectionManager.getSelectedFeatures(), function(i, segment) {
                            let seg = segment._wmeObject;
                            let address = true;
                            if(pedonal_id.includes(seg.attributes.roadType) && roads_id.includes(parseInt(array_config_country[indexselected][2])))
                            {
                                seg = convertSegmentType(seg);
                                address = false;
                            }
                            else
                                if(roads_id.includes(seg.attributes.roadType) && pedonal_id.includes(parseInt(array_config_country[indexselected][2])))
                                {
                                    convertSegmentType(seg);
                                    return;
                                }

                            if(array_config_country[indexselected][2] != "")
                                defineRoadType(seg, parseInt(array_config_country[indexselected][2]));
                            if(array_config_country[indexselected][3] != "")
                                defineSpeed(seg, array_config_country[indexselected][3]);
                            if(array_config_country[indexselected][1] != "")
                                defineLockRankRoad(seg, array_config_country[indexselected][1]);
                            if(array_config_country[indexselected][4] && address && seg.getAddress().attributes.isEmpty)
                                defineAddress(seg, "");
                        });
                    }

                    if(W.loginManager.getUserRank() >= array_config_country[func][0] - 1)
                    {
                        var emojivalue = document.createElement("div");
                        emojivalue.id = 'emoji_' + func;
                        emojivalue.style.cssText = 'text-align:center;font-size:14px;visibility:visible;';
                        emojivalue.innerHTML = emoji[0];
                        emojivalue.title = emoji[1];
                        addsign.appendChild(emojivalue);
                        signsroad.appendChild(addsign);
                    }
                });

                var btnAB = document.createElement("button");
                btnAB.innerHTML = 'A->B';
                btnAB.id = 'btnAB';
                btnAB.style.cssText = 'height: 20px;font-size:11px';

                btnAB.onclick = function() {
                    let myRoad = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;
                    if(myRoad.fwdDirection == true) //A to B
                    {
                        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
                        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(center.lon.toString().slice(0,8) + "," + center.lat.toString().slice(0,8) + "|" + W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["attributes"]["id"] + "|" + "TRUE" + "|" + getPermalink() + "|" + myRoad.fromNodeID + "|" + myRoad.toNodeID).select();
                        document.execCommand("copy");
                        $temp.remove();
                    }
                }

                var btnBA = document.createElement("button");
                btnBA.innerHTML = 'B->A';
                btnBA.id = 'btnBA';
                btnBA.style.cssText = 'height: 20px;font-size:11px';

                btnBA.onclick =  function() {
                    let myRoad = W.selectionManager.getSelectedFeatures()[0]._wmeObject.attributes;
                    if(myRoad.revDirection == true) //B to A
                    {
                        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
                        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
                        var $temp = $("<input>");
                        $("body").append($temp);
                        $temp.val(center.lon.toString().slice(0,8) + "," + center.lat.toString().slice(0,8) + "|" + W.selectionManager.getSelectedFeatures()[0]["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["id"] + "|" + "FALSE" + "|" + getPermalink() + "|" + myRoad.toNodeID + "|" + myRoad.fromNodeID).select();
                        document.execCommand("copy");
                        $temp.remove();
                    }
                }

                var divSentidos = document.createElement("div");
                divSentidos.id = 'divSentidos';
                divSentidos.appendChild(btnAB);
                divSentidos.appendChild(btnBA);

                var divLandmarkScript = document.createElement("div");
                divLandmarkScript.id = 'divLandmarkScript';
                divLandmarkScript.style.cssText = 'float:left;';
                divLandmarkScript.appendChild(signsroad);
                divLandmarkScript.appendChild(divSentidos);

                $("div #segment-edit-general").prepend(divLandmarkScript);
                $("div #segment-edit-general .address-edit").css("display", "inline-block");
                $( "#divSentidos" ).hide();
            }
    }

    function defineSpeed (segment, speed) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        if(segment.attributes.fwdMaxSpeed == null && segment.attributes.fwdMaxSpeed == null)
            W.model.actionManager.add(new UpdateObject(segment, {'fwdMaxSpeed': speed, 'revMaxSpeed': speed}));
        else if(segment.attributes.fwdMaxSpeed == null)
            W.model.actionManager.add(new UpdateObject(segment, {'fwdMaxSpeed': speed}));
        else if(segment.attributes.fwdMaxSpeed == null)
            W.model.actionManager.add(new UpdateObject(segment, {'revMaxSpeed': speed}));
    }

    function defineRoadType (segment, type) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        W.model.actionManager.add(new UpdateObject(segment, {'roadType': type}));
    }

    function defineLockRankRoad (segment, rank) {
        let UpdateObject= require("Waze/Action/UpdateObject");
        rank--;
        var bloquear;
        if(W.loginManager.user.rank >= rank)
            bloquear = rank;
        else
            bloquear = W.loginManager.user.rank;
        let lock = segment.attributes.lockRank;
        if(lock < bloquear)
            W.model.actionManager.add(new UpdateObject(segment, {'lockRank': bloquear}));
    }

    function defineAddress(segment, street) {
        let UpdateFeatureAddress = require("Waze/Action/UpdateFeatureAddress");
        var seg_id = segment.getID();
        if(parseInt(seg_id) < 0)
        {
            document.querySelector('#segment-edit-general > div.address-edit > div.address-edit-view > div.preview > wz-card > div.full-address-container > span.full-address').click();
            setTimeout(() => {
                document.querySelector('#segment-edit-general > div.address-edit > div.address-edit-view > wz-card.address-edit-card > form.address-form > div:nth-child(2) > wz-label > div.toggle-empty > wz-checkbox.empty-street').click();
                document.querySelector('#segment-edit-general > div.address-edit > div.address-edit-view > wz-card.address-edit-card > form.address-form > div:nth-child(3) > wz-label > div.toggle-empty > wz-checkbox.empty-city').click();
            }, 50);
            setTimeout(() => {
                document.querySelector('#segment-edit-general > div.address-edit > div.address-edit-view > wz-card.address-edit-card > form.address-form > div.action-buttons > wz-button.save-button').click();
            }, 100);
        }
        else
        {
            var seg = W.model.segments.getObjectById(seg_id);
            var address = segment.getAddress().attributes;
            var newAddressAtts = {
                streetName: street,
                emptyStreet: street==""?true:false,
                cityName: "",
                emptyCity: true,
                countryID: address.country.id
            };
            W.model.actionManager.add(new UpdateFeatureAddress(seg, newAddressAtts,{streetIDField:"primaryStreetID"}));
        }
    }

    function convertSegmentType(segment) {
        let AddSegment = require("Waze/Action/AddSegment");
        let FeatureVectorSegment = require("Waze/Feature/Vector/Segment");
        let DeleteSegment = require("Waze/Action/DeleteSegment");
        let ModifyAllConnections = require("Waze/Action/ModifyAllConnections");
        let UpdateObject = require("Waze/Action/UpdateObject");
        let ConnectSegment = require("Waze/Action/ConnectSegment");

        var newseg1=new FeatureVectorSegment({geoJSONGeometry:W.userscripts.toGeoJSONGeometry(segment.attributes.geometry)});

        newseg1.copyAttributes(segment);

        newseg1.attributes.roadType=parseInt(array_config_country[indexselected][2]);
        newseg1.attributes.lockRank=null;
        newseg1.setID(null);

        W.model.actionManager.add(new DeleteSegment(segment));

        let action = new AddSegment(newseg1);
        W.model.actionManager.add(action);

        let seg = W.model.segments.getObjectById(action.segment.attributes.id);
        if(roads_id.includes(seg.attributes.roadType))
        {
            W.model.actionManager.add(new UpdateObject(seg,{fwdTurnsLocked:true,revTurnsLocked:true}))
            if(seg.getFromNode() != null)
                W.model.actionManager.add(new ConnectSegment(seg.getFromNode(),newseg1));
            if(seg.getToNode() != null)
                W.model.actionManager.add(new ConnectSegment(seg.getToNode(),newseg1));
            if(seg.getFromNode() != null)
                W.model.actionManager.add(new ModifyAllConnections(seg.getFromNode(),true));
            if(seg.getToNode() != null)
                W.model.actionManager.add(new ModifyAllConnections(seg.getToNode(),true));
        }

        return seg;
    }

    // Split Segments

    function insertButtons() {

        if (typeof W.loginManager != 'undefined' && !W.loginManager.isLoggedIn()) {
            return;
        }

        if (W.selectionManager.getSelectedFeatures().length === 0)
            return;

        let exit = false;
        $.each(W.selectionManager.getSelectedFeatures(), function(i, segment) {
            if(segment._wmeObject.attributes.fwdLaneCount != 0 || segment._wmeObject.attributes.revLaneCount != 0)
                exit = true;
            if(segment._wmeObject.attributes.fwdDirection == false || segment._wmeObject.attributes.revDirection == false)
                exit = true;
            if(pedonal_id.includes(segment._wmeObject.attributes.roadType))
                exit = true;
        });

        if(exit)
            return;

        try {
            if (document.getElementById('split-segment') !== null)
                return;
        } catch (e) {}

        var btn1 = $('<wz-button color="secondary" size="sm" style="float:right;margin-top: 5px;">' + language.btnSplit + '</wz-button>');
        btn1.click(mainSplitSegments);

        var strMeters = language.strMeters;

        var selSegmentsDistance = $('<wz-select id="segmentsDistance" data-type="numeric" value="5" style="width: 45%;float:left;" />');
        selSegmentsDistance.append($('<wz-option value="5">5 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="7">7 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="9">9 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="11">11 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="13">13 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="15">15 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="17">17 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="19">19 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="21">21 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="23">23 ' + strMeters + '</wz-option>'));
        selSegmentsDistance.append($('<wz-option value="25">25 ' + strMeters + '</wz-option>'));

        var cnt = $('<div id="split-segment" class="form-group" style="display: flex;" />');

        var divGroup1 = $('<div/>');
        divGroup1.append($('<wz-label>' + language.strDistance + '</wz-label>'));
        divGroup1.append(selSegmentsDistance);
        divGroup1.append(btn1);
        //var divControls1 = $('<div class="controls-container" />');
        //divGroup1.append(divControls1);
        cnt.append(divGroup1);

        /*var divGroup2 = $('<div/>');
        var divControls2 = $('<div class="btn-toolbar" />');
        divControls2.append(btn1);
        divGroup2.append(divControls2);
        cnt.append(divGroup2);*/

        $(cnt).insertAfter("#segment-edit-general .attributes-form");

        $("#segmentsDistance").val(localStorage.getItem("metersSplitSegment"));

        $('#segmentsDistance').change(function(){
            localStorage.setItem("metersSplitSegment", $("#segmentsDistance").val());
        });
    }

    function orderSegments() {
        var segmentosOrdenados = [];
        var nos = [];
        var noSeguinte = null;
        $.each(W.selectionManager.getSelectedFeatures(), function(i1, segment) {
            if(nos.length > 0)
            {
                let fromExiste = false;
                let toExiste = false;
                $.each(nos, function(i2, no1) {
                    let no = null;
                    if(no1[0] == segment._wmeObject.attributes.fromNodeID)
                    {
                        no1[1] = 2;
                        fromExiste = true;
                    }

                    if(no1[0] == segment._wmeObject.attributes.toNodeID)
                    {
                        no1[1] = 2;
                        toExiste = true;
                    }
                });
                if(!fromExiste)
                    nos.push([segment._wmeObject.attributes.fromNodeID,1]);
                if(!toExiste)
                    nos.push([segment._wmeObject.attributes.toNodeID,1]);
            }
            else
            {
                nos.push([segment._wmeObject.attributes.fromNodeID,1]);
                nos.push([segment._wmeObject.attributes.toNodeID,1]);
            }
        });

        let segmentos = W.selectionManager.getSelectedFeatures().length;

        $.each(nos, function(i, no) {
            if(no[1] == 1)
            {
                noSeguinte = no[0];
                return false;
            }
        });

        while(segmentos > 0)
        {
            $.each(W.selectionManager.getSelectedFeatures(), function(i, segment) {
                if(segment._wmeObject.attributes.fromNodeID == noSeguinte)
                {
                    segmentosOrdenados.push(segment._wmeObject.attributes.id);
                    noSeguinte = segment._wmeObject.attributes.toNodeID;
                    segmentos--;
                }
                else if(segment._wmeObject.attributes.toNodeID == noSeguinte)
                {
                    segmentosOrdenados.push(segment._wmeObject.attributes.id);
                    noSeguinte = segment._wmeObject.attributes.fromNodeID;
                    segmentos--;
                }
            });
        }

        return segmentosOrdenados;
    }

    function mainSplitSegments() {

        if (W.selectionManager.getSelectedFeatures().length > 1)
            if(!confirm(language.strSelMoreSeg))
                return;

        var AddNode= require("Waze/Action/AddNode");
        var UpdateObject= require("Waze/Action/UpdateObject");
        var ModifyAllConnections= require("Waze/Action/ModifyAllConnections");

        var distancia = $("#segmentsDistance").val();
        var no = null;
        var seg_esquerda = [];
        var seg_direita = [];

        last_node_A = null;
        last_node_B = null;
        last_coord_esquerda_first = null;
        last_coord_esquerda_last = null;
        last_coord_direita_first = null;
        last_coord_direita_last = null;
        sentido_base = null;

        let segmentosOrdenados = orderSegments();

        $.each(segmentosOrdenados, function(i, idsegment) {
            var segment = W.model.segments.getObjectById(idsegment);
            let action_esquerda = null;
            let action_direita = null;
            if(last_node_A != null && last_node_B != null)
            {
                if(last_node_A == segment.getToNode())
                    no = "AB";
                if(last_node_B == segment.getFromNode())
                    no = "BA";
                if(last_node_A == segment.getFromNode())
                    no = "AA";
                if(last_node_B == segment.getToNode())
                    no = "BB";
                if(i == 1)
                {
                    if(no == "AB" || no == "AA")
                        sentido_base = "BA";
                    if(no == "BA" || no == "BB")
                        sentido_base = "AB";
                }
            }
            if(no == "AA" || no == "BB")
            {
                last_node_A = segment.getToNode();
                last_node_B = segment.getFromNode();
            }
            else
            {
                last_node_A = segment.getFromNode();
                last_node_B = segment.getToNode();
            }
            var segments = createSegments(segment, distancia, no);

            if(i > 0)
            {
                if(no == "BA")
                {
                    action_esquerda = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_esquerda[seg_esquerda.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    W.model.actionManager.add(action_esquerda);

                    action_direita = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_direita[seg_direita.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    W.model.actionManager.add(action_direita);
                }
                if(no == "BB")
                {
                    action_esquerda = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_esquerda[seg_esquerda.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    W.model.actionManager.add(action_esquerda);

                    action_direita = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[0]),[W.model.segments.getObjectById(seg_direita[seg_direita.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    W.model.actionManager.add(action_direita);
                }
                if(no == "AB")
                {
                    action_esquerda = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[W.model.segments.getObjectById(segments[0]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_esquerda[seg_esquerda.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    W.model.actionManager.add(action_esquerda);

                    action_direita = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[W.model.segments.getObjectById(segments[1]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_direita[seg_direita.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    W.model.actionManager.add(action_direita);
                }
                if(no == "AA")
                {
                    action_esquerda = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[0]).attributes.geometry.components[W.model.segments.getObjectById(segments[0]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_esquerda[seg_esquerda.length - 1]), W.model.segments.getObjectById(segments[0])]);
                    W.model.actionManager.add(action_esquerda);

                    action_direita = new AddNode(W.userscripts.toGeoJSONGeometry(W.model.segments.getObjectById(segments[1]).attributes.geometry.components[W.model.segments.getObjectById(segments[1]).attributes.geometry.components.length - 1]),[W.model.segments.getObjectById(seg_direita[seg_direita.length - 1]), W.model.segments.getObjectById(segments[1])]);
                    W.model.actionManager.add(action_direita);
                }
            }
            W.model.actionManager.add(new UpdateObject(W.model.segments.getObjectById(segments[0]),{fwdTurnsLocked:true,revTurnsLocked:true}))
            W.model.actionManager.add(new UpdateObject(W.model.segments.getObjectById(segments[1]),{fwdTurnsLocked:true,revTurnsLocked:true}))
            seg_esquerda.push(segments[0]);
            seg_direita.push(segments[1]);
        });

        $.each(seg_esquerda, function(i, segmentos_esquerda) {
            if(i < seg_esquerda.length - 1)
            {
                let segment = W.model.segments.getObjectById(segmentos_esquerda)
                if(sentido_base == "AB")
                    W.model.actionManager.add(new ModifyAllConnections(segment.getToNode(),true))
                if(sentido_base == "BA")
                    W.model.actionManager.add(new ModifyAllConnections(segment.getFromNode(),true))
            }
        });
        $.each(seg_direita, function(i, segmentos_direita) {
            if(i > 0)
            {
                let segment = W.model.segments.getObjectById(segmentos_direita)
                if(sentido_base == "AB")
                    W.model.actionManager.add(new ModifyAllConnections(segment.getFromNode(),true))
                if(sentido_base == "BA")
                    W.model.actionManager.add(new ModifyAllConnections(segment.getToNode(),true))
            }
        });

    }

    function createSegments(sel, displacement, no) {
        var wazefeatureVectorSegment = require("Waze/Feature/Vector/Segment");
        var UpdateSegmentGeometry= require("Waze/Action/UpdateSegmentGeometry");
        var UpdateObject= require("Waze/Action/UpdateObject");

        var streetVertices = sel.geometry.simplify(0.001).getVertices();
        var esquerdaPoints = null;
        var direitaPoints = null;

        var i;
        var leftPa,
            rightPa,
            leftPb,
            rightPb;
        var prevLeftEq,
            prevRightEq;

        var first = 0;

        for (i = first; i < streetVertices.length - 1; i++) {
            var pa = streetVertices[i];
            var pb = streetVertices[i + 1];

            var points = [pa, pb];
            var ls = new OpenLayers.Geometry.LineString(points);
            var len = ls.getGeodesicLength(W.map.getProjectionObject());
            var scale = (len + displacement / 2) / len;

            leftPa = pa.clone();
            leftPa.resize(scale, pb, 1);
            rightPa = leftPa.clone();
            leftPa.rotate(90, pa);
            rightPa.rotate(-90, pa);

            leftPb = pb.clone();
            leftPb.resize(scale, pa, 1);
            rightPb = leftPb.clone();
            leftPb.rotate(-90, pb);
            rightPb.rotate(90, pb);

            var leftEq = getEquation({
                'x1': leftPa.x,
                'y1': leftPa.y,
                'x2': leftPb.x,
                'y2': leftPb.y
            });
            var rightEq = getEquation({
                'x1': rightPa.x,
                'y1': rightPa.y,
                'x2': rightPb.x,
                'y2': rightPb.y
            });
            if (esquerdaPoints === null && direitaPoints === null) {
                esquerdaPoints = [leftPa];
                direitaPoints = [rightPa];
            } else {
                var li = intersectX(leftEq, prevLeftEq);
                var ri = intersectX(rightEq, prevRightEq);
                if (li && ri) {
                    if (i >= 0) {
                        esquerdaPoints.unshift(li);
                        direitaPoints.push(ri);

                        if (i == 0) {
                            esquerdaPoints = [li];
                            direitaPoints = [ri];
                        }
                    }
                } else {
                    if (i >= 0) {
                        esquerdaPoints.unshift(leftPb.clone());
                        direitaPoints.push(rightPb.clone());

                        if (i == 0) {
                            esquerdaPoints = [leftPb];
                            direitaPoints = [rightPb];
                        }
                    }
                }
            }

            prevLeftEq = leftEq;
            prevRightEq = rightEq;

        }
        esquerdaPoints.push(leftPb);
        direitaPoints.push(rightPb);

        esquerdaPoints.unshift(esquerdaPoints[esquerdaPoints.length-1]);
        esquerdaPoints.pop();

        var newSegEsq = sel.attributes.geometry.clone();
        var newSegDir = sel.attributes.geometry.clone();

        var segmentos = SplitSegment(sel);

        esquerdaPoints = esquerdaPoints.reverse();

        if(no == "AA" || no == "BB")
        {
            let aux = esquerdaPoints.reverse();
            esquerdaPoints = direitaPoints.reverse();
            direitaPoints = aux;
        }

        if(last_coord_esquerda_first != null && last_coord_esquerda_last != null && last_coord_direita_last != null && last_coord_direita_first != null)
        {
            if(no == "AB")
            {
                esquerdaPoints.pop();
                esquerdaPoints.push(last_coord_esquerda_first);
                direitaPoints.pop();
                direitaPoints.push(last_coord_direita_first);
            }
            if(no == "BA")
            {
                esquerdaPoints.shift();
                esquerdaPoints.unshift(last_coord_esquerda_last);
                direitaPoints.shift();
                direitaPoints.unshift(last_coord_direita_last);
            }
            if(no == "AA")
            {
                esquerdaPoints.pop();
                esquerdaPoints.push(last_coord_esquerda_first);
                direitaPoints.pop();
                direitaPoints.push(last_coord_direita_first);
            }
            if(no == "BB")
            {
                esquerdaPoints.shift();
                esquerdaPoints.unshift(last_coord_esquerda_last);
                direitaPoints.shift();
                direitaPoints.unshift(last_coord_direita_last);
            }
        }

        newSegEsq.components = esquerdaPoints;
        newSegDir.components = direitaPoints;

        last_coord_esquerda_first = esquerdaPoints[0];
        last_coord_direita_first = direitaPoints[0];
        last_coord_esquerda_last = esquerdaPoints[esquerdaPoints.length - 1];
        last_coord_direita_last = direitaPoints[direitaPoints.length - 1];

        var segmentoEsquerdo = W.model.segments.getObjectById(segmentos[0]);
        var segmentoDireito = W.model.segments.getObjectById(segmentos[1]);

        W.model.actionManager.add(new UpdateSegmentGeometry(segmentoEsquerdo,segmentoEsquerdo.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(newSegEsq)));
        W.model.actionManager.add(new UpdateSegmentGeometry(segmentoDireito,segmentoDireito.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(newSegDir)));

        if(no == "AA" || no == "BB")
        {
            W.model.actionManager.add(new UpdateObject(segmentoEsquerdo, {'revDirection': false, 'fwdMaxSpeed': segmentoEsquerdo.attributes.revMaxSpeed, 'revMaxSpeed': segmentoEsquerdo.attributes.fwdMaxSpeed}));
            W.model.actionManager.add(new UpdateObject(segmentoDireito, {'fwdDirection': false, 'fwdMaxSpeed': segmentoDireito.attributes.revMaxSpeed, 'revMaxSpeed': segmentoDireito.attributes.fwdMaxSpeed}));
        }
        else
        {
            W.model.actionManager.add(new UpdateObject(segmentoEsquerdo, {'revDirection': false}));
            W.model.actionManager.add(new UpdateObject(segmentoDireito, {'fwdDirection': false}));
        }

        return segmentos;

    }

    function getEquation(segment) {
        if (segment.x2 == segment.x1)
            return {
                'x': segment.x1
            };

        var slope = (segment.y2 - segment.y1) / (segment.x2 - segment.x1);
        var offset = segment.y1 - (slope * segment.x1);
        return {
            'slope': slope,
            'offset': offset
        };
    }


    function intersectX(eqa, eqb, defaultPoint) {
        if ("number" == typeof eqa.slope && "number" == typeof eqb.slope) {
            if (eqa.slope == eqb.slope)
                return null;

            var ix = (eqb.offset - eqa.offset) / (eqa.slope - eqb.slope);
            var iy = eqa.slope * ix + eqa.offset;
            return new OpenLayers.Geometry.Point(ix, iy);
        } else if ("number" == typeof eqa.x) {
            return new OpenLayers.Geometry.Point(eqa.x, eqb.slope * eqa.x + eqb.offset);
        } else if ("number" == typeof eqb.y) {
            return new OpenLayers.Geometry.Point(eqb.x, eqa.slope * eqb.x + eqa.offset);
        }
        return null;
    }


    function SplitSegment(road)
    {
        let SplitSegments= require("Waze/Action/SplitSegments");
        let UpdateSegmentGeometry= require("Waze/Action/UpdateSegmentGeometry");

        if(road.arePropertiesEditable())
        {
            var geo=road.geometry.clone();
            var action=null;
            if(geo.components.length<2)
            {
                return undefined;
            }
            if(geo.components.length==2)
            {
                geo.components.splice(1,0,new OpenLayers.Geometry.Point(((geo.components[1].x+geo.components[0].x)/2),((geo.components[1].y+geo.components[0].y)/2)));
                W.model.actionManager.add(new UpdateSegmentGeometry(road,road.attributes.geoJSONGeometry,W.userscripts.toGeoJSONGeometry(geo)));
            }
            action=new SplitSegments(road,{splitAtPoint:W.userscripts.toGeoJSONGeometry(road.attributes.geometry.components[Math.ceil(road.attributes.geometry.components.length/2-1)])});
            W.model.actionManager.add(action);
            var RoadIds=new Array();
            if(action.splitSegmentPair!==null)
            {
                for(var i=0;i<action.splitSegmentPair.length;i++)
                {
                    RoadIds.push(action.splitSegmentPair[i].attributes.id);
                }
            }
            return RoadIds;
        }
    }

    function RemoveInstructions()
    {
        let SetTurn= require("Waze/Model/Graph/Actions/SetTurn");

        var nos = {};

        /*$.each(W.model.nodes.objects, function(id, no) {
            if(no.attributes.segIDs.length > 2)
                nos[id] = no.attributes.segIDs;
        });*/

        $.each(W.selectionManager.getSelectedFeatures(), function(id, segmento) {
            if(nos[segmento._wmeObject.attributes.fromNodeID] === undefined)
            {
                let aux = W.selectionManager.model.nodes.getObjectById(segmento._wmeObject.attributes.fromNodeID);
                if(aux.attributes.segIDs.length > 2)
                    nos[aux.attributes.id] = aux.attributes.segIDs;
            }
            if(nos[segmento._wmeObject.attributes.toNodeID] === undefined)
            {
                let aux = W.selectionManager.model.nodes.getObjectById(segmento._wmeObject.attributes.toNodeID);
                if(aux.attributes.segIDs.length > 2)
                    nos[aux.attributes.id] = aux.attributes.segIDs;
            }
        });

        $.each(nos, function(id, segmentos) {
            $.each(segmentos, function(index, segmento1) {
                $.each(segmentos, function(index, segmento2) {
                    if(segmento1 != segmento2)
                    {
                        let node = W.selectionManager.model.nodes.getObjectById(id);
                        let seg1 = W.selectionManager.model.segments.getObjectById(segmento1);
                        let seg2 = W.selectionManager.model.segments.getObjectById(segmento2);
                        if(W.model.getTurnGraph().getTurnThroughNode(node,seg1,seg2).getTurnData().getInstructionOpcode() != null)
                        {
                            var turn=W.model.getTurnGraph().getTurnThroughNode(node,seg1,seg2);
                            W.model.actionManager.add(new SetTurn(W.model.getTurnGraph(),turn.withTurnData(turn.getTurnData().withInstructionOpcode(null))));
                        }
                    }
                });
            });
        });
    }

    function getPermalink() {
        let PL = "";
        let center = new OpenLayers.LonLat(W.map.getCenter().lon, W.map.getCenter().lat)
        .transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));

        PL += window.location.origin;
        PL += window.location.pathname;
        PL += '?env=';
        PL += W.app.getAppRegionCode();
        PL += '&lon=';
        PL += center.lon.toString().slice(0,8);
        PL += '&lat=';
        PL += center.lat.toString().slice(0,8);
        PL += '&zoomLevel=';
        PL += W.map.getZoom();
        PL += '&segments=';
        $.each(W.selectionManager.getSelectedFeatures(), function(id, segmento) {
            PL += segmento["attributes"]["wazeFeature"]["_wmeObject"]["attributes"]["id"] + ",";
        });
        return PL.slice(0,-1);
    }

    function verifyNull(variable)
    {
        if(variable === null)
            return "";
        return variable["v"];
    }

    bootstrap();
})();