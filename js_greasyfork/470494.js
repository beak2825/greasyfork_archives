// ==UserScript==
// @name         Beta-WME GIS Locator
// @namespace    https://greasyfork.org/en/users/173378-ramblinwreck
// @version      2024-09-01
// @description  opens associated county GIS map and takes you to the latitude and longitude you were at (in WME) on the GIS map just opened.
// @author       ramblinwreck_81
// @match     https://www.waze.com/en-US/editor*
// @match     /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor\/?.*$/
// @match      https://qpublic.schneidercorp.com
// @include *qpulbic.schneidercorp.com*
// @exclude      https://www.waze.com/user/editor*
// @grant GM_setClipboard
// @require      https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js
 

// @downloadURL https://update.greasyfork.org/scripts/470494/Beta-WME%20GIS%20Locator.user.js
// @updateURL https://update.greasyfork.org/scripts/470494/Beta-WME%20GIS%20Locator.meta.js
// ==/UserScript==
// This script requires WME GIS Buttons script installed
// Because necessary code must be run after the qpublic or schneidercorp page loads, that script (code) is WME-to-Schneider-corp_GIS_Interface.  That code is unique to that
// qpublic or schneidercorp web page.
(function() {
    'use strict';
    var settings = {};
    console.log('GIS-Locator: initiating anonymous function');
    function bootstrap(tries) {
         tries = tries || 1;
        if (W && W.map &&
            W.model && W.loginManager.user)
        {
            console.log('GIS-Locator: initializing WMEGL');
            WMEGLinit();
        } else if (tries < 1000) {
            setTimeout(function () {bootstrap(tries++);}, 200);
         }
    }
 
    function WMEGLinit() {
        init();
    }
 
    function init()
    {
        var $section = $("<div>");
        $section.html([
            '<div id="GIS_Locator">',
            '<h2>GIS Locator</h2>',
            '<input type="checkbox" id="WMEGLEnabled" class="WMEGLSettingsCheckbox"><label for="WMEGLEnabled">Enable This Script</label>',
            '<hr>',
            '<input type="checkbox" id="WMEGLopen2ndWMEWindow" class="WME2window"><label for="WMEGL2ndWin">Open Second WME Window on Locate</label>',
            '<hr>',
            '<div>',
            '<h3>Last latitude and longitude Info</h3>',
            'Latitude: <span id="WMEGLlatitude"></span></br>',
            'Longitude: <span id="WMEGLlongitude"></span></br>',
            '</div>',
            '</div>'
        ].join(' '));
 
        const { tabLabel, tabPane} = W.userscripts.registerSidebarTab('GIS Locator');
        tabLabel.innerHTML = 'GIS Locator';
        tabPane.innerHTML = $section.html();
        W.userscripts.waitForElementConnected(tabPane).then(() => {
            initializeSettings();
            addLocateButton();
        });

//        addLocateButton();
        function addLocateButton () {
 
            var WMEGLy = document.createElement('div');
            WMEGLy.setAttribute('id', 'lat-long-info');
            WMEGLy.setAttribute('style', 'display:inline;');
            document.getElementById('GIS_Locator').appendChild(WMEGLy);
            var WMEGLbb = document.createElement('button');
            WMEGLbb.setAttribute('type', 'button');
            WMEGLbb.setAttribute('value', 'Submit');
            WMEGLbb.setAttribute('id', 'WME-GIS-locator');
            WMEGLbb.setAttribute('title', 'initiate WME GIS Locator script');
            WMEGLbb.innerHTML = 'Locate';
            document.getElementById('lat-long-info').appendChild(WMEGLbb);
            document.getElementById("WME-GIS-locator").style.height="20px";
            document.getElementById("WME-GIS-locator").style.width="50px";
            document.getElementById('WME-GIS-locator').style.padding='1px';
            document.getElementById("WME-GIS-locator").addEventListener("click",localize, false);
            if(settings.Enabled) {
               document.getElementById('WME-GIS-locator').disabled = false;
            } else {
                document.getElementById('WME-GIS-locator').disabled = true;
            }
        }// end of addLocateButton function
 
        function localize()
        {
            if(document.getElementById('gisStatus'))
            {
                var gisButtonsButton = document.getElementById('gisStatus');
            } else {
                alert('Script GIS Buttons must be loaded in order to use this script.')
            }
            if(gisButtonsButton.style.color === 'red')
            {
                gisButtonsButton.click();
            }
            var WMEGLlatTimer;
            var WMEGLgetLat = false;
            document.getElementById('WME-GIS-locator').disabled = true;
            function get4326CenterPoint()
            {
                let projI = new OL.Projection("EPSG:900913");
                let projE = new OL.Projection("EPSG:4326");
                let center_lonlat = (new OL.LonLat(W.map.olMap.center.lon, W.map.olMap.center.lat)).transform(projI,projE);
                let lat = Math.round(center_lonlat.lat * 1000000) / 1000000;
                let lon = Math.round(center_lonlat.lon * 1000000) / 1000000;
                document.getElementById('WMEGLlatitude').innerHTML = lat;
                document.getElementById('WMEGLlongitude').innerHTML = lon;
                return new OL.LonLat(lon, lat);
            }
 
            let latlon = get4326CenterPoint();
            //document.getElementById('gisCounty').click();
            checkForGreen();
 
            function checkForGreen()
            {
                if(document.getElementById('gisStatus').style.color === 'green')
                {
                    clearTimeout(delay);
                    console.log('GIS Buttons verified running by GIS Locator');
                    finishIt();
                } else {
                    console.log('waiting for GIS Buttons...');
                    var delay = setTimeout(checkForGreen,250);
                }
            }
            function finishIt()
            {
                var WMEGLstr = document.getElementById('gisCounty').href;
                var string;
                var newURL;
                 if (WMEGLstr.indexOf('qpublic') > -1) {
                     // matched on qpublic
                     // string = 'http://qpublic9.qpublic.net/qpmap4/map.php?county=ga_fulton&layers=parcels+roads+lakes&mapmode';
                     // https://qpublic.schneidercorp.com/Application.aspx?App=LancasterCountySC
                     var equal = WMEGLstr.indexOf('=');
                     var ampersand = WMEGLstr.indexOf('&');
                     console.log(ampersand);
                     var oldCounty = WMEGLstr.substr(equal, ampersand - equal);
                     oldCounty = $('#gisCounty')[0].text;
                     var space =oldCounty.indexOf(' ');
                     oldCounty = oldCounty.substr(0, space) + oldCounty.substr(space +1)
                     console.log('oldCounty is: ' + oldCounty);
 //                    var underSc = oldCounty.indexOf('_');
                     var newCounty = oldCounty
                     var firstLtr = newCounty.substr(0,1);
                     firstLtr = firstLtr.toUpperCase();
                     if ($('#gisState')[0].text === 'Georgia') {
                         newCounty = firstLtr + newCounty.substr(1) + 'GA';
                     } else {
                         newCounty = firstLtr + newCounty.substr(1) + 'SC';
                     }
                     newURL = 'https://qpublic.schneidercorp.com/Application.aspx?App=' + newCounty //+ '&Layer=Parcels&PageType=Map';
                     console.log('WMEGL new URL is ' + newURL);
 
                } else {
 
                    // no match on qpublic
                    newURL = WMEGLstr;
                    console.log('WMEGL new URL is ' + newURL);
               }
//                window.open(newURL,'gisPage');
 
 
                // end of new code
 
 
                if(settings.open2ndWMEWindow) {
                    var WMEGLurl = 'https://www.waze.com/en-US/editor/?env=usa&lon=' + latlon.lon + '&lat=' + latlon.lat + '&zoom=4';
                    window.open(WMEGLurl,'wmeDup');
                }
                WMEGLcreateElements();

                function WMEGLthisTimeLat() {
                    clearInterval(WMEGLlatTimer);
                    erase();
                } // end of WMEGLthisTimeLat function
//                function WMEGLReset()
//                {
//                    clearInterval(delayTimer);

                function WMEGLcreateElements()
                {
 
                    //var WMEGLz=document.createElement("button");
                    //WMEGLz.setAttribute("type", "button");
                    //WMEGLz.setAttribute("value", "Submit");
                    //WMEGLz.setAttribute("id","grab-long-lat");
                   // WMEGLz.setAttribute("title","Get Long");
                    //WMEGLz.innerHTML = "Get Longitude";
                    var WMEGLaa=document.createElement('textArea');
                    WMEGLaa.setAttribute("id", "long-and-lat-txt");
                    WMEGLaa.textContent = "";
                    document.getElementById("lat-long-info").appendChild(WMEGLaa);
                    //document.getElementById("lat-long-info").appendChild(WMEGLz);
                    //document.getElementById("grab-long-lat").style.height="20px";
                    //document.getElementById("grab-long-lat").style.width="100px";
                    var cancelIt = document.createElement('button');
                    cancelIt.setAttribute('type', 'button');
                    cancelIt.setAttribute('value', 'Cancel');
                    cancelIt.setAttribute('id', 'stop-lat-long');
                    cancelIt.setAttribute('title', 'Cancel Lat/Long');
                    document.getElementById('lat-long-info').appendChild(cancelIt);
                    document.getElementById('stop-lat-long').style.height = '20px';
                    document.getElementById('stop-lat-long').style.width = '100px';
                    cancelIt.innerHTML = "Cancel";
                    document.getElementById('stop-lat-long').addEventListener('click', erase,false);
 
                } // end of WMGGLcreateElements function
 
                function erase()
                {
                    document.getElementById('WME-GIS-locator').disabled = false;
                 //   document.getElementById("grab-long-lat").removeEventListener('click',coordinates, false);
                    var removeElement = document.getElementById("grab-long-lat");
                 //   removeElement.parentNode.removeChild(removeElement);
                    removeElement = document.getElementById('long-and-lat-txt');
                    removeElement.parentNode.removeChild(removeElement);
                    removeElement = document.getElementById('stop-lat-long');
                    removeElement.parentNode.removeChild(removeElement);
                }
                coordinates();
 
 
                function coordinates()
                {
                   // if(WMEGLgetLat !==true) {
                        console.log('latlon is: ' + latlon);
                        document.getElementById("long-and-lat-txt").textContent = latlon;
                        document.getElementById("long-and-lat-txt").select();
                        document.execCommand("copy");
                        //var WMEGLa = document.getElementById("grab-long-lat");
                        //WMEGLa.innerHTML = "Get Latitude";
                        //WMEGLgetLat = true;
                        console.log('lat/lon is: ' + latlon);

                   // } //else {
//                         document.getElementById("long-and-lat-txt").textContent = latlon;
//                         document.getElementById("long-and-lat-txt").select();
//                         document.execCommand("copy");
//                         console.log('lat/lon is: ' + latlon);
                        WMEGLlatTimer = setInterval(function(){WMEGLthisTimeLat();},4000);
                   // }
                    window.open(newURL,'gisPage');
                    if(gisButtonsButton.style.color === 'green')
                    {
                        debugger;
                        gisButtonsButton.click();
                    }
 //                   var delayTimer = setInterval(function(){WMEGLReset();},20000);
                }//end of coordinates function
 //               document.getElementById("grab-long-lat").addEventListener("click",coordinates, false);
            }
 
        }// end of localize function
 
    } // end of init function
    function initializeSettings()
    {
        loadSettings();
        setChecked('WMEGLEnabled', settings.Enabled);
        setChecked('WMEGLopen2ndWMEWindow', settings.open2ndWMEWindow);
 
        $('#WMEGLlatitude').text('');
        $('#WMEGLlongitude').text('');
        $('.WMEGLSettingsCheckbox').change(function() {
            var settingName = $(this)[0].id.substr(5);
            settings[settingName] = this.checked;
            saveSettings();
            if(settings.Enabled) {
                document.getElementById('WME-GIS-locator').disabled = false;
            } else {
                document.getElementById('WME-GIS-locator').disabled = true;
            }
            console.log(settingName + ' checkbox change saved');
        });
        $('#WMEGLopen2ndWMEWindow').change(function() {
            settings.open2ndWMEWindow = this.checked;
            saveSettings();
        });
    }
 
    function setChecked(checkboxId, checked)
    {
        $('#' + checkboxId).prop('checked', checked);
    }
 
    function saveSettings()
    {
        if (localStorage) {
            var localsettings = {
                Enabled: settings.Enabled,
                open2ndWMEWindow: settings.open2ndWMEWindow,
 
            };
 
            localStorage.setItem("WMEGL_Settings", JSON.stringify(localsettings));
        }
        if(settings.Enabled) {
            document.getElementById('WME-GIS-locator').disabled = false;
        } else {
            document.getElementById('WME-GIS-locator').disabled = true;
        }
    }
 
    function loadSettings()
    {
        var loadedSettings = $.parseJSON(localStorage.getItem("WMEGL_Settings"));
        var defaultSettings = {
            Enabled: false,
            open2ndWMEWindow: false,
        };
        settings = loadedSettings ? loadedSettings : defaultSettings;
        for (var prop in defaultSettings) {
            if (!settings.hasOwnProperty(prop)) {
                settings[prop] = defaultSettings[prop];
            }
        }
 
    }
    bootstrap();
})();