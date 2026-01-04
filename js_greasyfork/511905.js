// ==UserScript==
// @name        WME Permalink to several Maps
// @description This script creates buttons to open pages of several other maps based on the WME coordinates
// @namespace   https://github.com/iridium1-waze/WME-P2SM/blob/master/WME%20P2SM.user.js
// @version     2025.08.02.01
// @match       https://*.waze.com/editor*
// @match       https://*.waze.com/*/editor*
// @match       https://beta.waze.com/editor*
// @match       https://beta.waze.com/*/editor*
// @icon        https://raw.githubusercontent.com/iridium1-waze/WME-Core-Files/master/map_icon.png
// @syncURL     https://github.com/iridium1-waze/WME-P2SM/raw/main/WME-P2SM.user.js
// @license     MIT
// @author		Iridium1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/511905/WME%20Permalink%20to%20several%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/511905/WME%20Permalink%20to%20several%20Maps.meta.js
// ==/UserScript==

// Mini howto:
// 1) install this script as Greasy Fork or GitHub script
// 2) Click on buttons on the sidebar to open selected map service with coordinates coming from WME

//changes by Iridium1 (contact either PM or iridium1.waze@gmail.com)
//01: Removed unneccessary buttons for DE
//02: Added Bayernatlas, fixed Mapillary due to URL changes
//03: Graphical Buttons
//04: Fixed UserTab Issues in FF
//05: Removed unused buttons for DE
//06: Added Webatlas - generic button
//07: Added Script to convert MapLatLon to UTM (needed for Webtlas)
//08: Fixed handover of coordinates to BayernAtlas
//09: Fixed Error  with Webatlas, requirers https Suffix
//10: Added TomTom + UI Inprovements
//11: Removed ito (no longer available), added Waze Reporting Tool - thanks to abusimbel!
//12: Added OpenStreetCam
//13: Added OpenStreet Browser (SL layer), BellHouse, Bug fixes
//14: Icon Fix, Maintaining script from GitHub, OSCam in wrong category
//15: Fixed URL for here
//2021.04.02.01: Fixed variable issues, new Link & Icon for KartaView (former OSCam), New Versioning
//2021.04.02.02: Fixed wrong text color for KartaView button
//2021.04.04.01: Fixed wrong URL for KartaView. Fix script initialisation with a more robust bootstrap. Add explicit reference to console.log instead of just log. Add stern warning about using these maps as source for map editing - thanks to Glodenox!
//2021.08.27.01: Fixed zoom issues with new WME version
//2021.12.04.01: Added Bayerninfo - thanks to ralseu!
//2022.03.22.01: Removed Map1, no longer working. Addes msn - thanks to hiwi234!
//2023.01.07.01: Webatlas no longer supported, added basemap.de as new supported version. Thanks to hint from Cha-oZ!
//2023.07.27.01: Changed Link for Waze Reporting Tool (now PartnerHub)
//2023.07.27.02: Fixed Command typo for new Reporting Tool Link
//2023.07.27.03: Fixed Zoom with Reporting Tool Link
//2024.01.03.01: Fixed Link in Reporting Tool (Partner Hub) again due to changes in URL
//2024.03.24.01: Added DuckDuckGo (Apple), code simplification, Design changes
//2024.03.25.01: Design and Icon changes
//2024.04.03.01: Added Blitzer.de, Open Issue: SCDB positioning not yet working, at least page loads with defaults
//2024.04.07.01: Typo in version number
//2024.05.17.01: Quick-Fix for ViaMichelin - URL no longer working. ToDo: Work on zoom settings
//2024.10.04.01: Added Lookmap
//2024.10.08.01: Added webhook for Greasy Fork - thanks to Dancingman81!
//2024.10.08.02: Sync Link Fixed
//2024.10.08.03: Check Link for Download adjusted to Greasy Fork
//2024.12.15.01: Fixed Mappy Link. (No feedback regarding zoom factor), updated Link to Geoportal Bayern, removed msn (no longer showning traffic data), same is on bing anyway.
//2025.08.02.01: Updated Link for Bayerninfo and fixed an issue with the location placement

/* global W */
/* global proj4 */
/* global firstProj */
/* global newtab */
/* global OpenLayers */
/* eslint-env jquery */ // we are working with jQuery

// indicate used variables to be assigned

var p2sm_version = "2025.08.02.01";

function getCenterZoom() {
    var map = W.map.getOLMap()
    var zoom = map.getZoom()
    var center = map.getCenter().transform(new OpenLayers.Projection('EPSG:900913'), new OpenLayers.Projection('EPSG:4326'))
    center.zoom = zoom
    return center
}

function add_Buttons() {
    if (document.getElementById('user-info') == null) {
        setTimeout(add_Buttons, 500)
        console.log('user-info element not yet available, page still loading')
        return
    }
    if (!W.loginManager.user) {
        W.loginManager.events.register('login', null, add_Buttons)
        W.loginManager.events.register('loginStatus', null, add_Buttons)
        // Double check as event might have triggered already
        if (!W.loginManager.user) {
            return
        }
    }
    if ("undefined" == typeof proj4) {
        // Using Proj4js to transform coordinates. See http://proj4js.org/
        var script = document.createElement('script') // dynamic load the library from https://cdnjs.com/libraries/proj4js
        script.type = 'text/javascript'
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.4.4/proj4.js'
        document.getElementsByTagName('head')[0].appendChild(script) // Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
    }

    // Style sheet for buttons
    var style = document.createElement('style')
    style.type = 'text/css'
    style.append('#sidepanel-p2sm > div { margin-bottom: 1em; }')
    style.append('#sidepanel-p2sm button { color: inherit;text-align: left; padding-left: 23px; width: 31%; height: 27px; margin: 1.1%; font-size: 83%; font-weight:500; background-repeat: no-repeat; border-radius: 7px; border-color: LightGrey; border-width: 1thin; background-position: 2px, center }')
    style.append('#sidepanel-p2sm .txtbtn { width: 96%;text-align: center;font-weight: bold;border: 1px solid silver;background-color: ghostwhite; }')
    document.getElementsByTagName('head')[0].appendChild(style)

    // define buttons
    var btn_google = $('<button style="background-image: url(https://bit.ly/3bltdQi);">Google</button>')
    btn_google.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://www.google.com/maps/@' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z/data=!5m1!1e1'
        window.open(mapsUrl, '_blank');
    })

    var btn_googlesat = $('<button style="width: 90px;height: 24px;font-size:90%;">Google Sat</button>')
    btn_googlesat.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://www.google.com/maps/@' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z/data=!5m1!1e1'
        window.open(mapsUrl, '_blank');
    })

    var btn_bing = $('<button style="background-image: url(https://bit.ly/2ESClzU);">Bing</button>')
    btn_bing.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://www.bing.com/maps/traffic?cp=' + cz.lat + '~' + cz.lon + '&lvl=' + cz.zoom
        window.open(mapsUrl, '_blank');
    })

    var btn_osm = $('<button style="background-image: url(https://bit.ly/3jCiB2j);">OSM</button>')
    btn_osm.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'http://www.openstreetmap.org/#map=' + cz.zoom + '/' + cz.lat + '/' + cz.lon
        window.open(mapsUrl, '_blank');
    })

    // https://duckduckgo.com/?q=48.1438654413661%2C11.413202257558536%2C17&iaxm=maps (Apple)
    var btn_apple = $('<button style="background-image: url(https://bit.ly/497XfDw);">Apple</button>')
    btn_apple.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://duckduckgo.com/?q=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + '&iaxm=maps'
        window.open(mapsUrl, '_blank');
    })

  //https://www.viamichelin.de/karten-stadtplan/verkehr?bounds=10.856722502563473~48.04212268258002~10.878523497436527~48.05778931741998&center=10.867623~48.049956&&detailedView=true&itinerary=&page=1&poiCategories=0
    var btn_vm = $('<button style="background-image: url(https://bit.ly/3hSLI0O);">ViaM</button>')
    btn_vm.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://www.viamichelin.de/karten-stadtplan/verkehr?bounds=' + cz.lon*1.0001 + '~' + cz.lat*1.0001 + '~' + cz.lon *0.9999 + '~' + cz.lat*0.9999 + '&center=' + cz.lon + '~' +cz.lat+ '&detailedView=true&itinerary=&page=1&poiCategories=0'
        window.open(mapsUrl, '_blank');
    })

    // https://wego.here.com/?map=53.24623,7.77117,18,satellite&x=ep
    var btn_here = $('<button style="background-image: url(https://bit.ly/2YZi7eS);">Here</button>')
    btn_here.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://wego.here.com/traffic/explore?map=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + ',traffic'
        window.open(mapsUrl, '_blank');
    })

    // https://www.mapillary.com/app/?lat=49.97940953634415&lng=9.127301585621836&z=14.19223566766781&focus=map
    var btn_mapillary = $('<button style="background-image: url(https://bit.ly/2DlCYBo);">Mapillary</button>')
    btn_mapillary.click(() => {
        var cz = getCenterZoom()
        cz.zoom = 0.991 * cz.zoom - 1.0997
        var mapsUrl = 'https://www.mapillary.com/app/?lat=' + cz.lat + '&lng=' + cz.lon + '&z=' + cz.zoom
        window.open(mapsUrl, '_blank');
    })

    // https://www.openstreetbrowser.org/#map=18/51.18321/6.71228&categories=car_maxspeed
    var btn_osbrowser = $('<button style="background-image: url(https://bit.ly/2Gfre4s);">OSBrowser</button>')
    btn_osbrowser.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://www.openstreetbrowser.org/#map=' + cz.zoom + '/' + cz.lat + '/' + cz.lon + '&categories=car_maxspeed'
        window.open(mapsUrl, '_blank');
    })

    // https://en.mappy.com/plan#/49.041426495%2C9.144027995
    var btn_mappy = $('<button style="background-image: url(https://bit.ly/2EVea3B);">Mappy</button>')
    btn_mappy.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://en.mappy.com/plan#/' + cz.lat + '%2C' + cz.lon
        window.open(mapsUrl, '_blank');
    })

    // https://map.atudo.com/v4/?lat=52.1548982153146&lng=10.4580277141803&zoom=30
	var btn_blitzer_de = $('<button style="background-image: url(https://bit.ly/4aF5O9X);">Blitzer.de</button>')
	btn_blitzer_de.click(() => {
		var cz = getCenterZoom()
		var mapsUrl = 'https://map.atudo.com/v4/?lat=' + cz.lat + '&lng=' + cz.lon + '&zoom=' + cz.zoom
		window.open(mapsUrl, '_blank');
	})

    // http://map.scdb.info/speedcameramap/ll/51.563412,9.997559/z/12
    var btn_speedcam = $('<button style="background-image: url(https://bit.ly/2QNtBha);">SpeedCam</button>')
    btn_speedcam.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'https://www.scdb.info/de/karte/'
        window.open(mapsUrl, '_blank');
    })

    // https://atlas.bayern.de/?c=628328,5321528&z=17.54&r=0&l=atkis&t=ba
    var btn_byatlas = $('<button style="background-image: url(https://bit.ly/2YXn1sK);">BY Atlas</button>')
    btn_byatlas.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 0.5

        if (!proj4) {
            console.log('proj4 not loaded :-(')
            return
        }

        var firstProj = '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
        var utm = proj4(firstProj, [cz.lon, cz.lat])
        var mapsUrl = 'https://atlas.bayern.de/?c=' + utm[0] + ',' + utm[1] + '&z=' + cz.zoom + '&r=0&l=atkis&t=ba'
        window.open(mapsUrl, '_blank');
    })

    // https://basemap.de/viewer/?config=<Base64 encoded coordinates>
    var btn_basemap = $('<button style="background-image: url(https://bit.ly/2QJJ8OZ);">Basemap</button>')
    btn_basemap.click(() => {
        var cz = getCenterZoom()
        cz.zoom = 0.985 * cz.zoom - 1.05
        var mapsUrl = 'https://basemap.de/viewer?config=' + btoa('{"lat":' + cz.lat + ',"lon":' + cz.lon + ',"zoom":' + cz.zoom + ',"styleID":0,"pitch":0,"bearing":0,"saturation":0,"brightness":0,"hiddenControls":[],"hiddenLayers":[],"changedLayers":[],"hiddenSubGroups":[],"changedSubGroups":[],"externalStyleURL":""}')
        window.open(mapsUrl, '_blank');
    })

    // http://frink.bplaced.de/blitzer/#map=11/51.9026/10.5036
    var btn_osmblitzer = $('<button style="background-image: url(https://bit.ly/2QNtBha);">OSM Blitzer</button>')
    btn_osmblitzer.click(() => {
        var cz = getCenterZoom()
        var mapsUrl = 'http://frink.bplaced.de/blitzer/#map=' + cz.zoom + '/' + cz.lat + '/' + cz.lon
        window.open(mapsUrl, '_blank');
    })

    // https://mydrive.tomtom.com/de_de/#mode=viewport+viewport=49.76137,9.70753,15,0,-0+ver=3
    var btn_tomtom = $('<button style="background-image: url(https://bit.ly/2QJPZry);">TomTom</button>')
    btn_tomtom.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://plan.tomtom.com/de?p=' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z'
        window.open(mapsUrl, '_blank');
    })

    // Waze Reportingtool (Partner Hub): https://www.waze.com/partnerhub/map-tool?lat=48.053457344200254&lon=11.06443238703241&zoom=18
    var btn_reporting = $('<button style="background-image: url(https://bit.ly/3jEtjWg);">Reporting</button>')
    btn_reporting.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://www.waze.com/partnerhub/map-tool?lat=' + cz.lat + '&lon=' + cz.lon + '&zoom=' + cz.zoom
        window.open(mapsUrl,'_blank');
    })

    // https://kartaview.org/map/@48.110432829485546,11.527876853942873,16z
    var btn_kartaview = $('<button style="background-image: url(https://bit.ly/3sNABM3);">KartaView</button>')
    btn_kartaview.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://kartaview.org/map/@' + cz.lat + ',' + cz.lon + ',' + cz.zoom + 'z'
        window.open(mapsUrl, '_blank');
    })

    // https://bayerninfo.de/de/baustellenkalender?bounds=48.088327%2C11.186653%2C48.081225%2C11.206061
    var btn_byinfo = $('<button style="background-image: url(https://bit.ly/2Y3CfyA);">Bayerninfo</button>')
    btn_byinfo.click(() => {
        var cz = getCenterZoom()
	var latOffset = 0.01;
    var lonOffset = 0.01;
    var northLat = cz.lat + latOffset;
    var southLat = cz.lat - latOffset;
    var eastLon = cz.lon + lonOffset;
    var westLon = cz.lon - lonOffset;
    var bounds = southLat + '%2C' + westLon + '%2C' + northLat + '%2C' + eastLon;
    var now = new Date();
    var then = new Date()
    then.setDate(then.getDate() + 28)
	var fromDate = now.toISOString().replace(/:/g, '%3A');
	var toDate = then.toISOString().replace(/:/g, '%3A');

        let mapsUrl = 'https://www.bayerninfo.de/de/baustellenkalender?bounds=' + bounds;
         mapsUrl += '&datetimeFrom=' + fromDate + '&datetimeTo=' + toDate;
        window.open(mapsUrl, '_blank');
    })

    // https://lookmap.eu.pythonanywhere.com/#c=20/48.053487/11.064571&p=48.053487/11.064571&a=208.15/-5.87
    var btn_lookmap = $('<button style="background-image: url(https://bit.ly/3XVRJA4);">Lookmap</button>')
    btn_lookmap.click(() => {
        var cz = getCenterZoom()
        cz.zoom -= 1
        var mapsUrl = 'https://lookmap.eu.pythonanywhere.com/#c=' + cz.zoom + '/' + cz.lat + '/' + cz.lon
        window.open(mapsUrl, '_blank');
    })


    // alert("Create Tab");
    let userTabs = document.getElementById('user-info')
    let navTabs = document.getElementsByClassName('nav-tabs', userTabs)[0]
    let tabContent = document.getElementsByClassName('tab-content', userTabs)[0]
    let newtab = ''

    newtab = document.createElement('li')
    newtab.innerHTML = '<a href="#sidepanel-p2sm" data-toggle="tab">P2SM</a>'
    navTabs.appendChild(newtab)

    // add new box to left of the map
    let addon = document.createElement('section')
    addon.id = 'sidepanel-p2sm'
    addon.className = 'tab-pane'
    tabContent.appendChild(addon)

    let divInfo 	= $('<div id="p2sm-Info"></div>')
    let divAllgem 	= $('<div id="p2sm-Allgem" style="color: DarkSlateGrey;"></div>')
    let divBlitzer 	= $('<div id="p2sm-Blitzer" style="color: DarkCyan;"></div>')
    let divBilder 	= $('<div id="p2sm-Bilder" style="color: DarkGreen;"></div>')
    let divGeoPort 	= $('<div id="p2sm-GeoPort" style="color: MediumBlue;"></div>')
    let divMisc 	= $('<div id="p2sm-Misc" style="color: LightSeaGreen;"></div>')

    let txtinfo = $('<a href="https://update.greasyfork.org/scripts/511905/WME%20Permalink%20to%20Several%20Maps.user.js" target="_blank">P2SM V' + p2sm_version + ' - Check for Updates</a>')
    let txtbtn1 = $('<button class="txtbtn">ALLGEMEINE KARTEN</button>')
    let txtbtn2 = $('<button class="txtbtn">BLITZER</button>')
    let txtbtn3 = $('<button class="txtbtn">GESCHWINDIGKEITEN / BILDER</button>')
    let txtbtn4 = $('<button class="txtbtn">GEOPORTALE</button>')
    let txtbtn5 = $('<button class="txtbtn">WAZE INTERN</button>')
    let safeSourcesText = $('<div><i class="w-icon w-icon-warning" style="font-size: 30px;float: left;margin-right: 50x;margin-bottom: 20px;"></i> Hinweis: Einige der externen Karten sind als Informationsquelle zur Kartenbearbeitung nicht zulässig!</div>')

    $('#sidepanel-p2sm').append(divInfo)
    divInfo.append(txtinfo)

    $('#sidepanel-p2sm').append(divAllgem)
    divAllgem.append(txtbtn1) //  ■■■■■ "ALLGEMEINE KARTEN" ■■■■■
    divAllgem.append(btn_google) // GOOGLE
    divAllgem.append(btn_bing) // BING
    divAllgem.append(btn_osm) // OSM
    divAllgem.append(btn_vm) // VIAM
    divAllgem.append(btn_here) // HERE
    divAllgem.append(btn_mappy) // MAPPY
    divAllgem.append(btn_tomtom) // TOMTOM
    divAllgem.append(btn_apple) // APPLE
    divAllgem.append(btn_lookmap) //LOOKMAP

    $('#sidepanel-p2sm').append(divBlitzer)
    divBlitzer.append(txtbtn2) //  //  ■■■■■ "BLITZER" ■■■■■
    divBlitzer.append(btn_speedcam) // SPEEDCAM DB
	divBlitzer.append(btn_blitzer_de) // BLITZER.DE
    divBlitzer.append(btn_osmblitzer) // OSM BLITZER

    $('#sidepanel-p2sm').append(divBilder)
    divBilder.append(txtbtn3) // // ■■■■■ "GESCHWINDIGKEITEN / BILDER" ■■■■■
    divBilder.append(btn_mapillary) // MAPILLARY
    divBilder.append(btn_osbrowser) // OSBROWSER
    divBilder.append(btn_kartaview) // KARTAVIEW

    $('#sidepanel-p2sm').append(divGeoPort)
    divGeoPort.append(txtbtn4) // // ■■■■■ "GEOPORTALE" ■■■■■
    divGeoPort.append(btn_byatlas) // BAYERNATLAS
    divGeoPort.append(btn_byinfo) // BAYERNINFO
    divGeoPort.append(btn_basemap) // BASEMAP

    $('#sidepanel-p2sm').append(divMisc)
    divMisc.append(txtbtn5) // // ■■■■■ "WAZE INTERN" ■■■■■
    divMisc.append(btn_reporting) // Waze Reporting

    $('#sidepanel-p2sm').append(safeSourcesText)
}

add_Buttons()
