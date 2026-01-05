// ==UserScript==
// @name                WME-Force-Data
// @namespace           https://greasyfork.org/en/users/5920-rickzabel
// @description         When Wazes data does not load this will move the map an unnoticeable amount forcing waze to load in the data
// @include             https://www.waze.com/editor/*
// @include             https://www.waze.com/*/editor/*
// @include             https://editor-beta.waze.com/*
// @version             0.1.1
// @grant               none
// @copyright           2015 rickzabel
// @downloadURL https://update.greasyfork.org/scripts/14746/WME-Force-Data.user.js
// @updateURL https://update.greasyfork.org/scripts/14746/WME-Force-Data.meta.js
// ==/UserScript==
//---------------------------------------------------------------------------------------
(function() {
	var ForecedDataRunOnLoad = "no";
	
    function bootstrap_WMEForceWazeData() {
        if (typeof($) === 'function') {
            console.info('WME-Force-Data: Jquery Loaded');
            window.window.setInterval(WMEForceWazeData_CheckAndMove, 2000);
        } else {
            console.info('WME-Force-Data: no Jquery');
            setTimeout(bootstrap_WMEForceWazeData, 1000);
        }
    }

    function WMEForceWazeData_CheckAndMove() {
        try {
            var UserID = Waze.loginManager.getLoggedInUser().id; //editor's id number
            var UserLevel = W.model.users.objects[UserID].rank + 1; //editor's rank	

			/*if($('#welcome-popup > div > div.login > div.login-form > form > input.form-control.password').val() !== null){
				$('#welcome-popup > div > div.login > div.login-form > form > input.form-control.password').click();
				$('#welcome-popup > div > div.login > div.login-form > form > div.form-action > button').click();
			}
			*/
			
			
        } catch (err) {
			
           // if ((Object.keys(W.model.updateRequestSessions.objects).length === 0 || ForecedDataRunOnLoad = "no") && !$('#welcome-popup > div > div.login > div.login-form > form > input.form-control.password')) {
                console.info('WME-Force-Data: Waze\'s data is missing attempting a map move to force data into loading.');
                WMEForceWazeData_ShowWMEMessage('WME-Force-Data: Waze\'s data is missing attempting a map move to force data into loading.', 5000);
                var CurrentLocation = Waze.map.getCenter();
                CurrentLocation.lat = CurrentLocation.lat - 0.0000001;
                Waze.map.setCenter(CurrentLocation, W.map.mapState.mapLocation.zoom);
				ForecedDataRunOnLoad = "yes";
            //}
        }
    }

    function WMEForceWazeData_ShowWMEMessage(message, delay) {
        var dateNow = new Date();
        var TrickRemove = dateNow.getTime();
        var width = message.length * 10;
        var c = '<div id="WMEForceWazeDataMapNote' + TrickRemove + '" style="width: ' + width + 'px; font-size: 15px; font-weight: bold; margin-left: auto; margin-right: auto; background-color: orange;"><center><b>' + message + '</b></center></div>';
        $("#toolbar").append(c);
        $("#WMEForceWazeDataMapNote" + TrickRemove).show().delay(delay).queue(function(n) {
            $(this).remove();
            n();
        });

    };

    setTimeout(bootstrap_WMEForceWazeData, 1000);
})();