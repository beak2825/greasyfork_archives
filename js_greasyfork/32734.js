// ==UserScript==
// @name                WME Invalidated Camera Mass Eraser
// @namespace           https://github.com/TheCre8r/WME-Invalidated-Camera-Mass-Eraser/
// @author              The_Cre8r and Myriades
// @description         Allow delete visible, unvalidated and in your managed area all speed camera in 1 click!
// @include             /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @icon
// @version             0.5.1.02
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/32734/WME%20Invalidated%20Camera%20Mass%20Eraser.user.js
// @updateURL https://update.greasyfork.org/scripts/32734/WME%20Invalidated%20Camera%20Mass%20Eraser.meta.js
// ==/UserScript==
 
(function() {
    var wme_ucme_script_name = 'WME Invalidated Camera Mass Eraser';
    var wme_ucme_version = GM_info.script.version;
    var wme_ucme_script_url = 'https://greasyfork.org/scripts/2377-wme-invalidated-camera-mass-eraser';
 
    function UCME_bootstrap(tries) {
        tries = tries || 1;
 
        if (window.W &&
            window.W.map &&
            window.W.model &&
            window.W.loginManager.user &&
            $ && W.model.cameras &&
           $('#user-details').length > 0) {
            UCME_init();
        } else if (tries < 1000) {
            setTimeout(function () {UCME_bootstrap(tries++);}, 200);
        }
    }
 
    /* helper function */
    function onScreen(obj){
        if (obj.geometry)
            return W.map.getExtent().intersectsBounds(obj.geometry.getBounds());
        return false;
    }
 
    function getId(node){
        return document.getElementById(node);
    }
 
    function UCME_addLog(UCME_text){
        console.log('WME_UCME_' + wme_ucme_version + ' : ' + UCME_text);
    }
 
    function UCME_del_cams(){
        UCME_addLog('del cams called');
        if (W.map.camerasLayer.visibility === false){
            //document.getElementById("_UCME_btn").className = "btn btn-warning disabled";
            //document.getElementById("_UCME_btn").value = "Camera Layer Disabled";
            $("#_UCME_btn").attr("class", "btn btn-warning disabled");
            $("#_UCME_btn").attr("value", "Camera Layer Disabled");
        }
        else
        {
            if(W.model.actionManager.index >= 74){
                alert("Too many pending changes. Please save before continuing.");
                return;
            }
            if (W.map.zoom <= 0)
                return;
 
            var delCams = 0;
            for (var cams in W.model.cameras.objects)
            {
                if(delCams == 75 || W.model.actionManager.index >= 74)
                    break;
                var the_cam = W.model.cameras.objects[cams];
                if (!onScreen(the_cam)){
                    UCME_addLog('Cam n° : ' + cams + ' not on screen -> not deleted');
                    continue;
                }
                if (the_cam.attributes.validated === true){
                    UCME_addLog('Cam n° : ' + cams + ' already validated -> not deleted');
                    continue;
                }
                if (the_cam.state == 'Delete'){
                    UCME_addLog('Cam n° : ' + cams + ' already deleted -> do not delete again');
                    continue;
                }
                if (the_cam.attributes.permissions == -1){
                    UCME_addLog('Cam n° : ' + cams + ' is in editable area -> OK deleted');
                    delCams++;
                    W.model.actionManager.add(new DeleteObject(W.model.cameras.objects[cams]));
                }
                else
                    UCME_addLog('Cam n° : ' + cams + ' is NOT in editable area -> not deleted');
            }
            UCME_addLog('Deleted cams : ' + delCams);
            UCME_count_cams();
        }
    }
 
    function UCME_html()
    {
        let WME_UCME_addon = document.createElement('div');
        WME_UCME_addon.id = 'UCME_btn';
        WME_UCME_addon.style = "width: 100%; text-align: center;height:35px;";
        WME_UCME_addon.innerHTML = '<input type="button" class= "btn btn-danger" id="_UCME_btn" value="Delete invalidated cameras" /><hr>';
        $('#user-details').append(WME_UCME_addon);
        //  Event
        $('#_UCME_btn').click(UCME_del_cams);
        //getId('_UCME_btn').onclick = UCME_del_cams;
 
        UCME_addLog('HTML renderred');
    }
 
    function UCME_count_cams(){
        UCME_addLog('count cams called');
        if (W.map.camerasLayer.visibility === false){
            $("#_UCME_btn").attr("class", "btn btn-warning");
            $("#_UCME_btn").attr("value", "Camera Layer Disabled");
        }
        else
        {
            UCME_addLog('cam layer ok');
            if (W.map.zoom <= 0)
                return;
            UCME_addLog('zoom ok');
            var countCams = 0;
            for (var cams in W.model.cameras.objects){
                var the_cam = W.model.cameras.objects[cams];
                if (!onScreen(the_cam)){
                    UCME_addLog('Cam n° : ' + cams + ' not on screen -> not deleted');
                    continue;
                }
                if (the_cam.attributes.validated === true){
                    UCME_addLog('Cam n° : ' + cams + ' already validated -> not deleted');
                    continue;
                }
                if (the_cam.state == 'Delete'){
                    UCME_addLog('Cam n° : ' + cams + ' already deleted -> do not delete again');
                    continue;
                }
                if (the_cam.attributes.permissions == -1){
                    UCME_addLog('Cam n° : ' + cams + ' is in editable area -> OK deleted');
                    countCams++;
                }
                else
                    UCME_addLog('Cam n° : ' + cams + ' is NOT in editable area -> not deleted');
            }
            UCME_addLog('Total Cams: ' + countCams);
            if (countCams > 0){
                $("#_UCME_btn").attr("class", "btn btn-danger");
                $("#_UCME_btn").attr("value", `Delete invalidated cameras (${countCams})`);
            }
            else{
                $("#_UCME_btn").attr("class", "btn btn-secondary disabled");
                $("#_UCME_btn").attr("value", "No invalidated cameras");
            }
        }
    }
 
    function UCME_init()
    {
        if (W.loginManager.user.rank < 2){
            UCME_addLog('User rank is not high enough. Exiting script.');
            return;
        }
 
        W.map.events.register("moveend", Waze.map, UCME_count_cams);
        Waze.model.actionManager.events.register("afterclearactions", null, UCME_count_cams);
 
        DeleteObject = require("Waze/Action/DeleteObject");
 
        UCME_html();
    }
 
    UCME_bootstrap();
})();