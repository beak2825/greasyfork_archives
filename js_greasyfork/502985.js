// ==UserScript==
// @name         GeoGuessr Custom Maps
// @description  playing with modified maps in geoguessr games
// @version      1.2.7
// @match        *://www.geoguessr.com/*
// @author       KaKa
// @license      BSD
// @require      https://update.greasyfork.org/scripts/502813/1423193/Geoguessr%20Tag.js
// @icon         https://www.svgrepo.com/show/392367/interaction-interface-layer-layers-location-map.svg
// @namespace https://greasyfork.org/users/1179204
// @downloadURL https://update.greasyfork.org/scripts/502985/GeoGuessr%20Custom%20Maps.user.js
// @updateURL https://update.greasyfork.org/scripts/502985/GeoGuessr%20Custom%20Maps.meta.js
// ==/UserScript==

(function() {

    /*=========================================================================Modifiy your guess map here==================================================================================*/

    let customOptions={

        Language:'en',                                  //en,zh,ja,fr,de,es

        Region:'us',                                   //us,mx,ca,jp,cn

        Google_StreetView_Layer_Lines_Style:'Default',   // More styles see below

        Google_StreetView_Layer_Shortcut:'V',

        Google_Labels_Layer_Shortcut:'G',

        Emphasise_Borders_Shortcut:'E',

        Google_Terrain_Layer_Shortcut:'T',

        Google_Satellite_Layer_Shortcut:'B',

        Apple_StreetView_Layer_Shortcut:'P',

        Yandex_StreetView_Layer_Shortcut:'Y',

        OpenWeather_Shortcut:'Q',

        OpenWeather_Style:'radar',                      //'radar': Global Precipitation;  'CL':Cloud;  'APM':Pressure;  'TA2'Temperature;  'WS10':Wind Speed;

        OpenWeather_Date:'now',                        // foramt:yyyy-mm-dd, less than one week ago

        Bing_Maps_Style:'r',                           // 'a':satellite(without labels);  'h':hybrid;  'r':roadmap，'sre':terrain

        Map_Tiler_Style:'basic',                       //basic,satellite,bright,landscape,ocean,outdoor,topo,streets,dataviz

        Carto_Style:'light_all',                       //light_all,dark_all

        Thunderforest_Style:'spinal-map'}              //spinal-map,landscape,outdoors,atlas,transport,


    let tileServices=["Google_Maps","OpenStreetMap","Bing_Maps","Map_Tiler","Thunderforest","Carto","Yandex_Maps","Petal_Maps"]

    let colorOptions={

        Default:['1098ad','99e9f2'],

        Crimson:['f03e3e','ffc9c9'],

        Deep_Pink:['d6336c','fcc2d7'],

        Blue_Violet:['ae3ec9','eebefa'],

        Slate_Blue:['7048e8','d0bfff'],

        Royal_Blue:['4263eb','bac8ff'],

        Dodger_Blue: ['1c7ed6','a5d8ff'],

        Sea_Green:['0ca678','96f2d7'],

        Lime_Green:['37b24d','b2f2bb'],

        OliveDrab:['74b816','d8f5a2'],

        Orange:['f59f00','ffec99'],

        Dark_Orange:['f76707','ffd8a8'],

        Brown:['bd5f1b','f7ca9e'],
    }

    /*======================================================================================================================================================================================*/
    const svg=`<svg height="20px" width="20px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <style type="text/css"> .st0{fill:#ffffff;} </style> <g> <polygon class="st0" points="256,381.424 104.628,328.845 0,365.186 256,454.114 512,365.186 407.373,328.845 "></polygon> <polygon class="st0" points="256,272.235 104.628,219.655 0,255.996 256,344.924 512,255.996 407.373,219.655 "></polygon> <polygon class="st0" points="512,146.806 256,57.886 0,146.806 256,235.734 "></polygon> </g> </g></svg>`
    const svgUrl=svgToUrl(svg)

    let map,google,customMapType,initLayer=tag;
    let isApplied=false;
    let currentLayers=JSON.parse(localStorage.getItem('custom_layers'));
    if(!currentLayers){
        currentLayers=["Google_Maps","Google_Labels"]
        localStorage.setItem('custom_layers', JSON.stringify(currentLayers));
    }

    const openWeatherBaseURL = "https://g.sat.owm.io/vane/2.0/weather";
    const radarURL = `https://b.sat.owm.io/maps/2.0/radar/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&day=${getNow(customOptions.OpenWeather_Date)}`;

    const openWeatherURL = (customOptions.OpenWeather_Style === 'radar')
    ? radarURL
    : `${openWeatherBaseURL}/${customOptions.OpenWeather_Style}/{z}/{x}/{y}?appid=9de243494c0b295cca9337e1e96b00e2&&date=${getTimestamp(customOptions.OpenWeather_Date)}&fill_bound=true`;

    let tileUrls = {
        Petal_Maps: `https://maprastertile-drcn.dbankcdn.cn/display-service/v1/online-render/getTile/24.12.10.10/{z}/{x}/{y}/?language=${customOptions.Language}&p=46&scale=2&mapType=ROADMAP&presetStyleId=standard&pattern=JPG&key=DAEDANitav6P7Q0lWzCzKkLErbrJG4kS1u%2FCpEe5ZyxW5u0nSkb40bJ%2BYAugRN03fhf0BszLS1rCrzAogRHDZkxaMrloaHPQGO6LNg==`,
        OpenStreetMap: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        Map_Tiler:`https://api.maptiler.com/maps/${customOptions.Map_Tiler_Style}-v2/256/{z}/{x}/{y}.png?key=0epLOAjD7fw17tghcyee`,
        Thunderforest:`https://b.tile.thunderforest.com/${customOptions.Thunderforest_Style}/{z}/{x}/{y}@2x.png?apikey=6a53e8b25d114a5e9216df5bf9b5e9c8`,
        Carto:`https://cartodb-basemaps-3.global.ssl.fastly.net/${customOptions.Carto_Style}/{z}/{x}/{y}.png`,
        Google_Maps:`https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2s${customOptions.Language}!3s${customOptions.Region}!5e1105!12m1!1e3!12m1!1e2!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0`,
        Google_Terrain:`https://mapsresources-pa.googleapis.com/v1/tiles?map_id=61449c20e7fc278b&version=15797339025669136861&pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e4!2st!3i725!2m3!1e0!2sr!3i725483392!3m12!2s${customOptions.Language}!3s${customOptions.Region}!5e18!12m1!1e3!2m2!1sset!2sTerrain!12m3!1e37!2m1!1ssmartmaps!4e0!5m2!1e3!5f2!23i56565656!26m2!1e2!1e3`,
        Google_Satellite:`https://mts1.googleapis.com/vt?hl=${customOptions.Language}-${customOptions.Region}&lyrs=s&x={x}&y={y}&z={z}`,
        Google_StreetView:`https://maps.googleapis.com/maps/vt?pb=%211m5%211m4%211i{z}%212i{x}%213i{y}%214i256%212m8%211e2%212ssvv%214m2%211scc%212s*211m3*211e2*212b1*213e2*212b1*214b1%214m2%211ssvl%212s*212b1%213m17%212sen%213sUS%215e18%2112m4%211e68%212m2%211sset%212sRoadmap%2112m3%211e37%212m1%211ssmartmaps%2112m4%211e26%212m2%211sstyles%212ss.e%3Ag.f%7Cp.c%3A%23${colorOptions[customOptions.Google_StreetView_Layer_Lines_Style][0]}%7Cp.w%3A1%2Cs.e%3Ag.s%7Cp.c%3A%23${colorOptions[customOptions.Google_StreetView_Layer_Lines_Style][1]}%7Cp.w%3A3%215m1%215f1.35`,
        Google_Satellite_Road:`https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m14!2s${customOptions.Language}!3s${customOptions.Region}!5e18!12m4!1e68!2m2!1sset!2sRoadmapSatellite!12m3!1e37!2m1!1ssmartmaps!12m1!1e3!5m1!5f1.35`,
        Google_Hybrid_Labels:`https://www.google.com/maps/vt?pb=!1m7!8m6!1m3!1i{z}!2i{x}!3i{y}!2i9!3x1!2m2!1e0!2sm!3m7!2s${customOptions.Language}!3s${customOptions.Region}!5e1105!12m1!1e4!12m1!1e2!4e0!5m5!1e0!8m2!1e1!1e1!8i47083502!6m6!1e12!2i2!11e0!39b0!44e0!50e0`,
        Google_Labels:`https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m17!2s${customOptions.Language}!3s${customOptions.Region}!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.t:18|s.e:g.s|p.w:3,s.e:g|p.v:off,s.t:1|s.e:g.s|p.v:off,s.e:l|p.v:on!4i0!5m2!1e0!5f2`,
        Google_Labels_Emphasise_Borders:`https://www.google.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m2!1e0!2sm!3m17!2s${customOptions.Language}!3smx!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2ss.t:18|s.e:g.s|p.w:2,s.e:g|p.v:off,s.t:1|s.e:g.s|p.v:on,s.e:l|p.v:on!4i0!5m2!1e0!5f1.5`,
        Apple_StreetView:`https://lookmap.eu.pythonanywhere.com/bluelines_raster_2x/{z}/{x}/{y}.png`,
        Yandex_StreetView:`https://core-stv-renderer.maps.yandex.net/2.x/tiles?l=stv&x={x}&y={y}&z={z}&scale=1&v=2025.04.04.20.13-1_25.03.31-4-24330`,
        Yandex_Maps:`https://core-renderer-tiles.maps.yandex.net/tiles?l=map&v=5.04.07-2~b:250311142430~ib:250404100358-24371&x={x}&y={y}&z={z}&scale=1&lang=en_US`,
        OpenWeather: openWeatherURL
    }

    function svgToUrl(svgText) {
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
        const svgUrl = URL.createObjectURL(svgBlob);
        return svgUrl;
    }

    function getMap(){
        let element = document.getElementsByClassName("guess-map_canvas__cvpqv")[0]
        if(!element) element=document.getElementsByClassName("run-game-guess-map-contents_canvas__XQRwC")[0]
        if(!element) return
        try{
            //if (!element) element=document.getElementsByClassName("coordinate-result-map_map__Yh2Il")[0]
            const keys = Object.keys(element)

            const key = keys.find(key => key.startsWith("__reactFiber$"))
            const props = element[key]
            map=props.return.return.memoizedProps.map
            if(!map) map=props.return.memoizedState.memoizedState.current.instance
            google=unsafeWindow.google
            customMapType=setMapType()
            const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
            map.mapTypes.set("roadmap",layers)
            }
        catch(error){
            console.error('Failed to get map')
        }
    }

    function OC(controlDiv, layer) {
        controlDiv.style.margin='10px'
        controlDiv.style.backgroundColor = '#fff';
        controlDiv.style.height = '30px';
        controlDiv.style.boxShadow = 'rgba(0, 0, 0, 0.3) 0px 1px 4px -1px';
        controlDiv.style.borderRadius = '5px';

        var opacitySlider = document.createElement('input');

        opacitySlider.setAttribute('type', 'range');
        opacitySlider.setAttribute('min', '0');
        opacitySlider.setAttribute('max', '100');
        opacitySlider.setAttribute('value', '100');
        opacitySlider.setAttribute('step', '1');
        opacitySlider.style.width = '100px';
        opacitySlider.style.height='20px'
        opacitySlider.style.marginTop='5px'
        opacitySlider.addEventListener('input', function() {
            var opacity = opacitySlider.value / 100
            layer.set('opacity',opacity)
        });

        controlDiv.appendChild(opacitySlider);
    }

    function addOpacityControl(m, layer) {
        var opacityControlDiv = document.createElement('div');
        new OC(opacityControlDiv, layer);
        opacityControlDiv.id=layer.name
        opacityControlDiv.index = 1;
        m.controls[google.maps.ControlPosition.TOP_RIGHT].push(opacityControlDiv);
    }

    function removeOpacityControl(id) {
        var controls = map.controls[google.maps.ControlPosition.TOP_RIGHT];
        if(controls&&controls.getLength()>0){
            if(!id) controls.removeAt(0)
            else{
                for (var i = 0; i < controls.getLength(); i++) {
                    var control = controls.getAt(i);
                    if (control.id === id) {
                        controls.removeAt(i);
                        break;
                    }
                }
            }
        }
    }

    function MR(e, t) {
        return new Promise(n => {
            google.maps.event.addListenerOnce(e, t, n);
        });
    }

    function getNow(date) {
        if(date!='now'){
            return date
        }
        const now = new Date();
        now.setHours(now.getHours() - 1);
        return now.toISOString().slice(0, 14)+'00';
    }

    function getTimestamp(date){
        var parsedDate
        if (date=== 'now') {
            parsedDate= new Date()
            return Math.floor(parsedDate.getTime() / 1000)
        }
        parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            throw new Error('Invalid date format');
        }
        return Math.floor(parsedDate.getTime() / 1000);

    }

    function extractTileCoordinates(url) {
        const regex = /!1i(\d+)!2i(\d+)!3i(\d+)!4i(\d+)/;
        const matches = url.match(regex);

        if (matches && matches.length === 5) {
            const z = matches[1];
            const x = matches[2];
            const y = matches[3];
            return { z, x, y };
        } else {
            return null;
        }
    }

    function BaiduProjection() {
        var R = 6378206;
        var R_MINOR = 6356584.314245179;
        var bounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(-19994619.55417086, -20037725.11268234),
            new google.maps.LatLng(19994619.55417086, 20037725.11268234)
        );

        this.fromLatLngToPoint = function(latLng) {

            var lat = latLng.lat() * Math.PI / 180;
            var lng = latLng.lng() * Math.PI / 180;

            var x = lng * R;
            var y = Math.log(Math.tan(Math.PI / 4 + lat / 2)) * R;

            var scale = 1 / Math.pow(2, 18);
            var origin = new google.maps.Point(bounds.getSouthWest().lng(), bounds.getNorthEast().lat());
            return new google.maps.Point(
                (x - origin.x) * scale,
                (origin.y - y) * scale
            );
        };

        this.fromPointToLatLng = function(point) {
            var scale = 1 / Math.pow(2, 18);
            var origin = new google.maps.Point(bounds.getSouthWest().lng(), bounds.getNorthEast().lat());

            var x = point.x / scale + origin.x;
            var y = origin.y - point.y / scale;

            var lng = x / R * 180 / Math.PI;
            var lat = (2 * Math.atan(Math.exp(y / R)) - Math.PI / 2) * 180 / Math.PI;

            return new google.maps.LatLng(lat, lng);
        };

        return this;
    }

    function getBingTiles(tileX, tileY, zoom, type) {
        var quadKey = tileXYToQuadKey(tileX, tileY, zoom);
        if(type==='cn'){
            const subdomains = ['r1', 'r2', 'r0', 'r3'];
            const subdomain = subdomains[(tileX + tileY) % subdomains.length];
            const baseUrl=`https://t.ssl.ak.dynamic.tiles.virtualearth.net/comp/ch/${quadKey}?mkt=${customOptions.Language}-Us&ur=cn&it=G,LC,L&jp=1&og=2618&sv=9.33&n=t&dre=1&o=webp,95&cstl=s23&st=bld|v:0`
            return baseUrl
        }
        else{

            const subdomains = ['ecn.t0', 'ecn.t1', 'ecn.t2', 'ecn.t3'];

            const subdomain = subdomains[(tileX + tileY) % subdomains.length];
            const baseUrl = `https://${subdomain}.tiles.virtualearth.net/tiles/`;

            return baseUrl + type + quadKey + '.jpeg?g=14792';}
    }

    function tileXYToQuadKey(tileX, tileY, zoom) {
        var quadKey = '';
        for (var i = zoom; i > 0; i--) {
            var digit = 0;
            var mask = 1 << (i - 1);
            if ((tileX & mask) !== 0) {
                digit += 1;
            }
            if ((tileY & mask) !== 0) {
                digit += 2;
            }
            quadKey += digit.toString();
        }
        return quadKey;
    }

    function setMapType(){
        class customMapType extends google.maps.ImageMapType {
            constructor(layers, options = null) {
                const defaultOptions = {
                    getTileUrl: function(coord, zoom) {
                        return null;
                    },
                    tileSize: new google.maps.Size(256, 256),
                    maxZoom: 20,
                    name: 'CustomMapType',
                };


                super({...defaultOptions, ...options});
                this.layers = layers;
            }

            getTile(t, n, r) {
                const o = this.layers.map(i => {
                    if (typeof i.getTile !== 'function') {
                        console.error('getTile method is missing in layer:', i);
                    }
                    return i.getTile(t, n, r);
                });
                const s = document.createElement("div");
                s.append(...o);

                Promise.all(o.map(i => MR(i, "load"))).then(() => {
                    google.maps.event.trigger(s, "load");
                });

                return s;
            }


            releaseTile(tile) {
                let index = 0;
                for (const child of tile.children) {
                    if (child instanceof HTMLElement) {
                        this.layers[index]?.releaseTile(child);
                        index += 1;
                    }
                }
            }
        }
        return customMapType
    }

    function setTileLayer(layerName){

        var tileLayer
        const tileUrl = tileUrls[layerName];
        if (layerName==='Bing_Maps'){
            tileLayer = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return getBingTiles(coord.x,coord.y,zoom,customOptions.Bing_Maps_Style)
                        .replace('{z}', zoom)
                        .replace('{x}', coord.x)
                        .replace('{y}', coord.y);
                },
                tileSize: new google.maps.Size(256, 256),
                name: layerName,
                maxZoom:20
            });}
        else if(layerName==='Bing_Terrain'){
            tileLayer = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    if(zoom>15) return ``
                    return getBingTiles(coord.x,coord.y,zoom,'sre')
                        .replace('{z}', zoom)
                        .replace('{x}', coord.x)
                        .replace('{y}', coord.y);
                },
                tileSize: new google.maps.Size(256, 256),
                name: layerName,
                maxZoom:15
            });}
        else if(layerName==='Bing_Maps_CN'){
            tileLayer = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return getBingTiles(coord.x,coord.y,zoom,'cn')
                        .replace('{z}', zoom)
                        .replace('{x}', coord.x)
                        .replace('{y}', coord.y);
                },
                tileSize: new google.maps.Size(256, 256),
                name: layerName,
                maxZoom:20
            });}
        else{
            tileLayer = new google.maps.ImageMapType({
                getTileUrl: function(coord, zoom) {
                    return tileUrl
                        .replace('{z}', zoom)
                        .replace('{x}', coord.x)
                        .replace('{y}', coord.y);
                },
                tileSize: new google.maps.Size(256, 256),
                name:layerName,
                maxZoom:20,
            })}
        if (layerName.includes('StreetView') || layerName.includes('Weather')) {
            if (!document.getElementById(layerName)) addOpacityControl(map, tileLayer);
        }
        return tileLayer
    }

    function resetGoogle(){
        currentLayers[0]='Google_Maps'
        if(!currentLayers.includes('Google_Labels'))currentLayers.push('Google_Labels')
        currentLayers = currentLayers.filter(layer => layer !== 'Google_Hybrid_Labels')
        const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
        map.mapTypes.set("roadmap",layers)
    }

    let onKeyDown = (e) => {
        if ( e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || !isApplied) return
        if (e.key >= '1' && e.key <= '7') {
            e.stopImmediatePropagation();
            if(!map) getMap()
            const tileIndex=parseInt(e.key)
            const layerName=tileServices[tileIndex]
            if(!currentLayers.includes(layerName)){
                initLayer(`layer:${layerName}`)
                currentLayers[0]=layerName
                currentLayers = currentLayers.filter(layer => layer!== 'Google_Labels'&&layer!== 'Google_Hybrid_Labels'&&layer!== 'Google_Labels_Emphasise_Borders')
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)
            }

            else resetGoogle()
        }

        else if (e.key === '0') resetGoogle()

        else if (e.key === customOptions.Google_StreetView_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Google_StreetView_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            initLayer(`layer:Google_StreetView`)
            if(!currentLayers.includes('Google_StreetView')){
                currentLayers.splice(1, 0, 'Google_StreetView');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)
            }
            else{currentLayers = currentLayers.filter(layer => layer !== 'Google_StreetView')
                 removeOpacityControl('Google_StreetView')
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                 map.mapTypes.set("roadmap",layers)}
        }

        else if (e.key === customOptions.Apple_StreetView_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Apple_StreetView_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            if(!currentLayers.includes('Apple_StreetView')){
                initLayer(`layer:Apple_StreetView`)
                currentLayers.splice(1, 0, 'Apple_StreetView');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)
            }
            else{currentLayers = currentLayers.filter(layer => layer !== 'Apple_StreetView')
                 removeOpacityControl('Apple_StreetView')
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                 map.mapTypes.set("roadmap",layers)}
        }

        else if (e.key === customOptions.Yandex_StreetView_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Yandex_StreetView_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            initLayer(`layer:Yandex_StreetView`)
            if(!currentLayers.includes('Yandex_StreetView')){
                currentLayers.splice(1, 0, 'Yandex_StreetView');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)
            }
            else{currentLayers = currentLayers.filter(layer => layer !== 'Yandex_StreetView')
                 removeOpacityControl('Yandex_StreetView')
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                 map.mapTypes.set("roadmap",layers)}
        }

        else if (e.key === customOptions.Google_Labels_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Google_Labels_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            initLayer(`layer:Google_Labels`)
            if(!currentLayers.includes('Google_Labels')&&!currentLayers.includes('Google_Hybrid_Labels')){
                currentLayers.includes('Google_Satellite')?currentLayers.push('Google_Hybrid_Labels'):currentLayers.push('Google_Labels');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)))
                map.mapTypes.set("roadmap",layers)}

            else{currentLayers = currentLayers.filter(layer => layer !== 'Google_Labels'&&layer !== 'Google_Hybrid_Labels')
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)))
                 map.mapTypes.set("roadmap",layers)}
        }

        else if (e.key === customOptions.Emphasise_Borders_Shortcut.toLowerCase()|| e.key === customOptions.Emphasise_Borders_Shortcut) {
            e.stopImmediatePropagation();
            if(currentLayers.includes('Google_Satellite')||!currentLayers.includes('Google_Maps')) return
            if(!currentLayers.includes('Google_Labels_Emphasise_Borders')){
                currentLayers = currentLayers.filter(layer => layer !== 'Google_Labels'&&layer !== 'Google_Hybrid_Labels')
                currentLayers.push('Google_Labels_Emphasise_Borders');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)))
                map.mapTypes.set("roadmap",layers)}

            else{
                currentLayers = currentLayers.filter(layer => layer !== 'Google_Labels_Emphasise_Borders')
                currentLayers.push('Google_Labels');
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)))
                 map.mapTypes.set("roadmap",layers)}
        }

        else if (e.key === customOptions.Google_Terrain_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Google_Terrain_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            initLayer(`layer:Google_Terrain`)
            if(!currentLayers.includes('Google_Terrain')){
                currentLayers[0]='Google_Terrain'
                if(!currentLayers.includes('Google_Labels'))currentLayers.push('Google_Labels')
                currentLayers = currentLayers.filter(layer => layer !== 'Google_Hybrid_Labels')
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)}

            else resetGoogle()
        }

        else if (e.key === customOptions.Google_Satellite_Layer_Shortcut.toLowerCase()|| e.key === customOptions.Google_Satellite_Layer_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            initLayer(`layer:Google_Satellite`)
            if(!currentLayers.includes('Google_Satellite')){
                currentLayers[0]='Google_Satellite'
                if(!currentLayers.includes('Google_Hybrid_Labels'))currentLayers.push('Google_Hybrid_Labels')
                currentLayers = currentLayers.filter(layer => layer !== 'Google_Labels')
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)}

            else resetGoogle()
        }

        else if (e.key === customOptions.OpenWeather_Shortcut.toLowerCase()|| e.key === customOptions.OpenWeather_Shortcut) {
            e.stopImmediatePropagation();
            if(!map) getMap()
            if(!currentLayers.includes('OpenWeather')){
                initLayer(`layer:OpenWeather`)
                currentLayers.splice(1, 0, 'OpenWeather');
                const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                map.mapTypes.set("roadmap",layers)
            }

            else{currentLayers = currentLayers.filter(layer => layer !== 'OpenWeather')
                 removeOpacityControl('OpenWeather')
                 const layers =new customMapType(currentLayers.map(layerName => setTileLayer(layerName)));
                 map.mapTypes.set("roadmap",layers)}
        }

        localStorage.setItem('custom_layers', JSON.stringify(currentLayers));
        map.setMapTypeId("roadmap")
    }
    document.addEventListener("keydown", onKeyDown);
    if (!window.location.href.includes('duel')) {
        const observer = new MutationObserver((mutationsList, observer) => {
            const originalElements = document.querySelectorAll(".styles_control__Pa4Ta");

            if (originalElements.length > 0 && !document.getElementById('cutsom-map-button')) {
                const targetElement = originalElements[originalElements.length - 1];
                const clonedElement = targetElement.cloneNode(true);
                clonedElement.id='cutsom-map-button'
                const parent = targetElement.parentNode;
                parent.insertBefore(clonedElement, targetElement);

                const tooltip = clonedElement.querySelector(".tooltip_tooltip__3D6bz");
                if (tooltip) {
                    tooltip.textContent = "Enable Custom Maps";
                    tooltip.style.transition = "0.3s";
                    const arrow = document.createElement("div");
                    arrow.classList.add("tooltip_arrow__LJ1of");
                    tooltip.appendChild(arrow);


                    const imgElement = clonedElement.querySelector("img");
                    const buttonElement = clonedElement.querySelector("button");
                    if (imgElement) {
                        imgElement.src = svgUrl;
                    }
                    if(isApplied){
                        tooltip.textContent = "Disable Custom Maps";
                        buttonElement.style.outline = '2px solid #e6a014';
                    }
                    clonedElement.addEventListener("mouseover", () => {
                        tooltip.style.visibility = "visible";
                        tooltip.style.opacity = "1";
                        arrow.style.opacity = "1";
                        tooltip.style.transform = "translateY(-50%) scale(1)";
                    });

                    clonedElement.addEventListener("mouseout", () => {
                        tooltip.style.visibility = "hidden";
                        tooltip.style.opacity = "0";
                        tooltip.style.transform = "translateY(-50%) scale(0)";
                    });

                    clonedElement.addEventListener("click", () => {
                        if (!isApplied) {
                            tooltip.textContent = "Disable Custom Maps";
                            buttonElement.style.outline = '2px solid #e6a014';
                        } else {
                            tooltip.textContent = "Enable Custom Maps";
                            buttonElement.style.outline = '';
                        }
                        tooltip.appendChild(arrow);
                        isApplied = !isApplied;
                    });
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
})();