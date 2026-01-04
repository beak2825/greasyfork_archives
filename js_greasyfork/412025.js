// ==UserScript==
// @name         Travel Agency 3.0D
// @namespace    https://greasyfork.org/en/users/3898
// @version      0.25.4
// @description  3D version of Torn's world map
// @author       Xiphias[187717]
// @match        https://www.torn.com/travelagency.php
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/build/three.min.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/controls/OrbitControls.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/lines/LineSegmentsGeometry.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/lines/LineSegments2.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/lines/Line2.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/lines/LineMaterial.js
// @require      https://cdn.jsdelivr.net/npm/three@0.119.1/examples/js/lines/LineGeometry.js
// @require      https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.min.js
// @require      https://greasyfork.org/scripts/412024-ztext-by-bennett-feely/code/ZText%20by%20Bennett%20Feely.js?version=851816
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/412025/Travel%20Agency%2030D.user.js
// @updateURL https://update.greasyfork.org/scripts/412025/Travel%20Agency%2030D.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var captcha_exists = document.getElementsByClassName('captcha').length > 0;
    if (!captcha_exists) {

        let is_firefox = false;
        if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
            is_firefox = true;
        }

        GM_addStyle(
            '#earth_location{cursor: grab} \
.invisible{visibility: hidden;transition: visibility 250ms linear} \
.opaque{opacity: .1;transition: opacity 250ms linear} \
.visible{opacity: 1;transition: opacity 250ms linear} \
.argentina{background: url(/images/v2/travel_agency/pinpoints/pinpoints_argentina.svg) left top no-repeat} \
.canada{background: url(/images/v2/travel_agency/pinpoints/pinpoints_canada.svg) left top no-repeat} \
.cayman_islands{background: url(/images/v2/travel_agency/pinpoints/pinpoints_cayman_islands.svg) left top no-repeat} \
.china{background: url(/images/v2/travel_agency/pinpoints/pinpoints_china.svg) left top no-repeat} \
.hawaii{background: url(/images/v2/travel_agency/pinpoints/pinpoints_hawaii.svg) left top no-repeat} \
.japan{background: url(/images/v2/travel_agency/pinpoints/pinpoints_japan.svg) left top no-repeat} \
.mexico{background: url(/images/v2/travel_agency/pinpoints/pinpoints_mexico.svg) left top no-repeat} \
.south_africa{background: url(/images/v2/travel_agency/pinpoints/pinpoints_south_africa.svg) left top no-repeat} \
.switzerland{background: url(/images/v2/travel_agency/pinpoints/pinpoints_switzerland.svg) left top no-repeat} \
.torn{background: url(/images/v2/travel_agency/pinpoints/pinpoints_torn.svg) left top no-repeat} \
.uae{background: url(/images/v2/travel_agency/pinpoints/pinpoints_uae.svg) left top no-repeat} \
.uk{background: url(/images/v2/travel_agency/pinpoints/pinpoints_uk.svg) left top no-repeat} \
.instahide{visibility: hidden}'
        );

        // Style for the controls
        GM_addStyle(
            '#gui { position: absolute; top: 2px; right: 5px } \
.dg .cr.number input[type=text] { \
border-radius: 0 !important; \
height: 13px; \
}'
        );

        // Spline js
        const GLOBE_RADIUS = 250;
        const CURVE_MIN_ALTITUDE = 50;
        const CURVE_MAX_ALTITUDE = GLOBE_RADIUS / 2.5;
        const DEGREE_TO_RADIAN = Math.PI / 180;

        function clamp(num, min, max) {
            return num <= min ? min : (num >= max ? max : num);
        }

        /**
     * @return {number}
     */
        function C(n) {
            return n > 1 ? (Math.PI/2) : n < -1 ? -Math.PI/2 : Math.asin(n);
        }
        /**
     * @return {number}
     */
        function P(n) {
            return (n = Math.sin(n / 2)) * n;
        }

        function geoInterpolate(n, t) {
            const p = 180 / Math.PI
            , h = Math.PI / 180
            , d = Math.atan2
            , E = Math.cos
            , x = Math.sin
            , _ = Math.sign || function (n) { return n > 0 ? 1 : n < 0 ? -1 : 0 }
            , N = Math.sqrt;

            let r = n[0] * h
            , i = n[1] * h
            , e = t[0] * h
            , o = t[1] * h
            , u = E(i)
            , c = x(i)
            , a = E(o)
            , l = x(o)
            , f = u * E(r)
            , s = u * x(r)
            , g = a * E(e)
            , v = a * x(e)
            , y = 2 * C(N(P(o - i) + u * a * P(e - r)))
            , S = x(y)
            , m = y ? function(n) {
                let t = x(n *= y) / S
                , r = x(y - n) / S
                , i = r * f + t * g
                , e = r * s + t * v
                , o = r * c + t * l;
                return [d(e, i) * p, d(o, N(i * i + e * e)) * p]
            }
            : function() {
                return [r * p, i * p]
            }
            ;
            return m.distance = y, m;
        }

        // util function to convert lat/lng to 3D point on globe
        function coordinateToPosition(lat, lng, radius) {
            const phi = (90 - lat) * DEGREE_TO_RADIAN;
            const theta = (lng + 180) * DEGREE_TO_RADIAN;

            return new THREE.Vector3(
                - radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.cos(phi),
                radius * Math.sin(phi) * Math.sin(theta)
            );
        }

        function quartic(x) {
            return -0.000212614*Math.pow(x,4) + 0.00601681*Math.pow(x,3) - 0.0393748*Math.pow(x,2) - 0.0526971*x + 1.10919
        }

        let getSplineFromCoords = function(coords) {
            const startLat = coords[0];
            const startLng = coords[1];
            const endLat = coords[2];
            const endLng = coords[3];

            // start and end points
            const start = coordinateToPosition(startLat, startLng, GLOBE_RADIUS);
            const end = coordinateToPosition(endLat, endLng, GLOBE_RADIUS);

            // altitude
            let distance = start.distanceTo(end);
            let max_distance = 2 * GLOBE_RADIUS; // Yeah yeah
            let max_altitude = CURVE_MAX_ALTITUDE + CURVE_MAX_ALTITUDE*(max_distance / distance);

            // Naive weighted max altitude to make the lines not too high for short flights and low for long flights
            let steps = 15;

            let c = quartic((distance-25)/(max_distance - 25) * steps);
            max_altitude *= c;

            const altitude = clamp(distance * 0.5, CURVE_MIN_ALTITUDE, max_altitude);
            // 2 control points
            const interpolate = geoInterpolate([startLng, startLat], [endLng, endLat]);
            const midCoord1 = interpolate(0.25);
            const midCoord2 = interpolate(0.75);
            const mid1 = coordinateToPosition(midCoord1[1], midCoord1[0], GLOBE_RADIUS + altitude);
            const mid2 = coordinateToPosition(midCoord2[1], midCoord2[0], GLOBE_RADIUS + altitude);

            return {
                start,
                end,
                spline: new THREE.CubicBezierCurve3(start, mid1, mid2, end)
            };
        };

        // ------ Marker object ------------------------------------------------

        function Marker() {
            THREE.Object3D.call(this);

            const radius = 3.005;
            const sphereRadius = 5.02;
            const height = 12.0;

            const material = new THREE.MeshPhongMaterial({ color: 0xe85d64 }); // old color 0x636363

            let cone = new THREE.Mesh(new THREE.ConeBufferGeometry(radius, height, 8, 1, true), material);
            cone.position.y = height * 0.5;
            cone.rotation.x = Math.PI;

            let sphere = new THREE.Mesh(new THREE.SphereBufferGeometry(sphereRadius, 16, 8), material);
            sphere.position.y = height * 0.95 + sphereRadius;
            material.visible = false;

            this.add(cone, sphere);
        }

        Marker.prototype = Object.create(THREE.Object3D.prototype);

        function createMarker(name, radius, lat,lon ) {
            const marker = new Marker();

            marker.lat = lat;
            marker.lon = lon;

            marker.name = name;
            marker.country_flag = $('.raceway.' + name);
            marker.is_visible = false;

            const lonRad = -lon * (Math.PI / 180);
            const latRad = lat * (Math.PI / 180);
            const r = radius;

            marker.position.set(Math.cos(latRad) * Math.cos(lonRad) * r, Math.sin(latRad) * r, Math.cos(latRad) * Math.sin(lonRad) * r);
            marker.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);

            return marker;
        }

        let clock = new THREE.Clock();

        let options = {
            rotation_speed: 0.03
        };

        let state = {
            rotation_speed: options.rotation_speed,
            flag_scale: 1.0
        };

        const imgLoc = "https://i.imgur.com/9cupfma.png"; ///images/v2/travel_agency/map.png";
        let travel_map_obj = $('.travel-map');
        let camera = new THREE.PerspectiveCamera(50, travel_map_obj.width() / travel_map_obj.height(), 0.1, 25000);
        let light = new THREE.AmbientLight(0xffffff, 1);

        var zoom_level = 750;
        camera.position.set(zoom_level, 0, 0);
        let scene = new THREE.Scene();

        camera.lookAt(scene.position);
        light.position.set(2000, 2000, 1500);
        scene.add(light);

        let canvas_location;

        const radius = 250;
        let earth = new THREE.SphereGeometry (radius,360,180);
        let material = new THREE.MeshPhongMaterial();
        let mesh = new THREE.Mesh(earth, material);


        let renderer = new THREE.WebGLRenderer( {antialias : true} );
        let maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

        let loader = new THREE.TextureLoader();
        material.map = loader.load(imgLoc);

        material.displacementMap = new THREE.TextureLoader().load("https://i.imgur.com/FccON1I.png");
        material.displacementScale = 4.5;
        material.displacementBias = -4.0;

        //Filters
        material.map.magFilter = THREE.LinearFilter;
        material.map.minFilter = THREE.LinearMipMapLinearFilter;
        material.specular = new THREE.Color('#000000');
        material.map.anisotropy = maxAnisotropy;

        renderer.setSize(travel_map_obj.width(), travel_map_obj.height());

        let earth_location = document.createElement('div');
        earth_location.setAttribute("id", "earth_location");
        earth_location.appendChild(renderer.domElement);
        $(renderer.domElement).css('border-radius', '0 0 5px 5px');

        let china = createMarker("china", radius,  17.0832, 213.3532); // China
        let japan = createMarker("japan", radius,  12.220, 235.5); // Japan
        let hawaii = createMarker("hawaii", radius, -4.921, 301.5); // US
        let mexico = createMarker("mexico", radius, 6, -11); // Mexico
        let torn = createMarker("torn", radius, 4.75, 2.5); // Torn
        let canada = createMarker("canada", radius, 20.75, 17.812); // Canada
        let cayman_islands = createMarker("cayman", radius, -6.75, 16.112); // Cayman
        let argentina = createMarker("argentina", radius, -60.50, 37.812); // Argentina
        let switzerland = createMarker("switzerland", radius, 24.40, 105.812); // switzerland
        let uk = createMarker("uk", radius, 30.30, 95.412); // UK
        let south_africa = createMarker("south-africa", radius, -52.00, 125.412); // SA
        let uae = createMarker("uae", radius, -0.50, 152.012); // UAE

        let tabs = [$('#tab4-1'), $('#tab4-2'), $('#tab4-3'), $('#tab4-4')];

        for (let i = 0; i < tabs.length; ++i)
        {
            let elem = tabs[i];
            if (elem.attr('aria-hidden') === "false") {
                // Found active tab

                let travelmap = elem.find('.travel-map');
                let height = travelmap.height();
                $(earth_location).height(height);
                travelmap.after(earth_location);
                travelmap.hide();
            }
        }

        // Fix for hiding flags behind bottom padding of tabs
        $('.tabs.tabs-order').css('padding', '0 3px 0');
        let d = `<div id="paddington" style="position: relative;height: 5px;background: linear-gradient(0deg,black 10%,#383839,#2e2e2e);z-index: 20;"></div>`;
        $('.tabs.tabs-order').after(d);

        function removeTravelLine() {
            if (group !== undefined)
            {
                if (lineDashed !== null) {
                    group.remove(lineDashed);
                }
                if (lineSolid !== null) {
                    group.remove(lineSolid);
                }
            }
        }

        function tabClicked(a, tab_id) {
            if (a.parent().attr('aria-disabled') === "true") {
                return;
            }
            let travelmap = $(tab_id).find('.travel-map');
            travelmap.after($('#earth_location'));
            travelmap.hide();
            $(renderer.domElement).css('border-radius', '0 0 5px 5px');
            removeTravelLine();
        }

        $('.tabs > .standard > a').click(function () {
            tabClicked($(this), '#tab4-1');
        });

        $('.tabs > .airstrip > a').click(function () {
            tabClicked($(this), '#tab4-2');
        });

        $('.tabs > .private > a').click(function () {
            tabClicked($(this), '#tab4-3');
        });

        $('.tabs > .business > a').click(function () {
            tabClicked($(this), '#tab4-4');
        });

        // remove all pathways
        $('#tab-menu4').find('.path').each(function(i, el) {
            el.remove();
        });

        mesh.add(china);
        mesh.add(japan);
        mesh.add(hawaii);
        mesh.add(mexico);
        mesh.add(torn);
        mesh.add(canada);
        mesh.add(cayman_islands);
        mesh.add(argentina);
        mesh.add(switzerland);
        mesh.add(uk);
        mesh.add(south_africa);
        mesh.add(uae);

        let marker_array= [];
        marker_array.push(china);
        marker_array.push(japan);
        marker_array.push(hawaii);
        marker_array.push(mexico);
        marker_array.push(torn);
        marker_array.push(canada);
        marker_array.push(cayman_islands);
        marker_array.push(argentina);
        marker_array.push(switzerland);
        marker_array.push(uk);
        marker_array.push(south_africa);
        marker_array.push(uae);

        var timeout;

        for (let i = 0; i < marker_array.length; ++i)
        {
            let marker = marker_array[i];
            let class_to_find = '.raceway.' + marker.name;
            $(class_to_find).each(function(i, el) {
                el.marker = marker;
                $(el).addClass('opaque invisible');
                marker.is_visible = false;
            });

            $(class_to_find).click(function(event) {
                let this_marker = $(this)[0].marker;
                if (this_marker.name !== "torn") {
                    setTravelLine(this_marker.lat, this_marker.lon);
                    $(renderer.domElement).css('border-radius', '0 0 0 0');

                    clearTimeout(timeout);
                    let current_rotation_speed = options.rotation_speed;
                    let sign = Math.sign(current_rotation_speed);
                    if (Math.abs(current_rotation_speed) > 0.000001) {

                        let steps = 20;
                        let step = current_rotation_speed / steps;
                        let spin_up_time = 2500;

                        state.rotation_speed = 0.00;

                        function Start(target_speed)
                        {
                            state.rotation_speed += step;

                            if (sign*state.rotation_speed < sign*current_rotation_speed) {
                                timeout = setTimeout(Start, spin_up_time/steps, target_speed);
                            }

                        }

                        let delay = 6000;
                        timeout = setTimeout(Start, delay, current_rotation_speed);
                    }
                }
            });
        }


        let group = new THREE.Group();
        group.add(mesh);
        for (let i = 0; i < marker_array.length; ++i) {
            group.add(marker_array[i]);
        }

        group.position.set(0, 0, 0);
        group.scale.set(1, 1, 1);

        scene.add(group);

        let frustum = new THREE.Frustum();

        let controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enablePan = false;
        controls.minDistance = 350;
        controls.maxDistance = 15000;
        controls.addEventListener('change', render);

        function createTravelLine(destination_lat, destination_long, isDash) {
            let spline = getSplineFromCoords([destination_lat, destination_long, 4.75, 2.5]).spline;

            let spline_points = spline.getPoints( 50 );

            let linewidth_ = 5;
            let geometry = new THREE.LineGeometry();
            let positions = [];
            for (let i = 0; i < spline_points.length; ++i){
                positions.push(spline_points[i].x, spline_points[i].y, spline_points[i].z );
            }
            geometry.setPositions( positions );

            let spline_material = new THREE.LineMaterial(
                {
                    color : 0xffffff,
                    linewidth: linewidth_-1
                } );

            let spline_dashed = new THREE.LineMaterial(
                {
                    color: 0x49caf5,
                    linewidth: linewidth_,
                    dashSize: 9,
                    gapSize: 6,
                    dashed: true,
                    transparent: true
                } );

            let line;
            if (isDash) {
                line = new THREE.Line2( geometry, spline_dashed );
                line.computeLineDistances();
            } else {
                line = new THREE.Line2( geometry, spline_material );
            }

            line.scale.set( 1, 1, 1 );

            // resolution of the viewport
            spline_dashed.resolution.set( window.innerWidth, window.innerHeight );
            spline_material.resolution.set( window.innerWidth, window.innerHeight );
            spline_dashed.defines.USE_DASH = "";

            return line;
        }

        function findPos(obj) {
            let curleft = 0;
            let curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                    obj = obj.offsetParent
                } while (obj);
            }
            return [curleft,curtop];
        }

        function updateCanvasLocation(){
            canvas_location = findPos(renderer.domElement);
        }


        $('.raceway').css({'top': '0', 'left': '0'});

        function updateByMarker(offsetWidth, offsetHeight, marker, tab_index, flag_scale_normalized) {
            let v = new THREE.Vector3(0, 0, 0);
            v.setFromMatrixPosition(marker.matrixWorld);

            camera.updateMatrixWorld();
            camera.updateProjectionMatrix();
            v.project(camera);

            let boxes = marker.country_flag;
            let box = boxes[tab_index];

            let boundingRect = box.getBoundingClientRect();

            let screenpos = new THREE.Vector3(0, 0, 0);

            screenpos.x = ( v.x + 1 ) * (offsetWidth/2);
            screenpos.y = ( 1 - v.y ) * (offsetHeight/2);

            let scale = flag_scale_normalized;
            let pos_x = screenpos.x - (boundingRect.width / scale)/2;
            let pos_y = screenpos.y - (boundingRect.height / scale) - 7*(scale-1);

            // Scale 1
            //  x - 9
            //  y - 20

            // Scale 2
            //  x - 9
            //  y - 26

            // Scale 3
            //  x - 9
            //  y - 34

            // Scale 6
            //  x - 9
            //  y - 57

            let transform;
            if (is_firefox) {
                transform = 'translate(' + pos_x + 'px, ' + pos_y + 'px) scale(' + scale + ') rotate(0.2deg)'; // Minimize jerky movement
            } else {
                transform = 'translate(' + pos_x + 'px, ' + pos_y + 'px) scale(' + scale + ')';
            }
            $(box).css({'transform': transform});
        }

        function checkPinVisibility(frustum, earth, camera, markers) {
            if (earth == null || earth.boundingSphere == null) {
                return;
            }

            frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

            let cameraToEarth = earth.boundingSphere.center.distanceTo(camera.position);
            zoom_level = cameraToEarth;

            let L = Math.sqrt(Math.pow(cameraToEarth, 2) - Math.pow(earth.boundingSphere.radius, 2));

            let ratio = earth.boundingSphere.radius / L;

            for (let i = 0; i < markers.length; ++i) {
                let classes = markers[i].country_flag;
                let v = new THREE.Vector3();
                v.setFromMatrixPosition(markers[i].matrixWorld);
                let cameraToPin = v.distanceTo(camera.position);

                if (!frustum.containsPoint(v)) {
                    classes.removeClass('visible opaque invisible');
                    classes.addClass('instahide opaque invisible');
                    markers[i].is_visible = false;
                }


                else if(cameraToPin > L* (1 + ratio/4)) { // Try to hide flag if it is actually behind the earth
                    classes.removeClass('instahide');
                    classes.addClass('invisible');
                    markers[i].is_visible = false;
                } else if (cameraToPin > L) {
                    classes.removeClass('instahide visible invisible');
                    classes.addClass('opaque');
                    markers[i].is_visible = true;
                } else {
                    classes.removeClass('instahide opaque invisible');
                    classes.addClass('visible');
                    markers[i].is_visible = true;
                }
            }
        }

        function normalize(value, min, max, t_min, t_max) {
            let a = (t_max - t_min) / (max - min)
            let b = t_max - a * max
            return a * value + b
        }

        let lineDashed = null;
        let lineSolid = null;

        function animate(){
            requestAnimationFrame(animate);

            checkPinVisibility(frustum, earth, camera, marker_array);

            let offsetWidth = renderer.domElement.offsetWidth;
            let offsetHeight = renderer.domElement.offsetHeight;

            let flag_boxes = marker_array[0].country_flag;

            let tab_index = 0;
            for (let i = 0; i < flag_boxes.length; ++i)
            {
                if (flag_boxes[i].parentNode.getAttribute('aria-hidden') === "false")
                {
                    tab_index = i;
                    break;
                }
            }

            let flag_scale_normalized = state.flag_scale;


            for (let i = 0; i < marker_array.length; ++i)
            {
                // Improve by doing batch-read first, then write
                // So first get dimensions of elements and such, then update CSS

                if (marker_array[i].is_visible) {
                    updateByMarker(offsetWidth, offsetHeight, marker_array[i], tab_index, flag_scale_normalized);
                }
            }

            controls.update();
            render();
        }

        function render(){

            let delta = clock.getDelta();

            group.rotateY( state.rotation_speed * delta );

            renderer.clear();
            renderer.render(scene, camera);
        }

        animate();

        updateCanvasLocation();

        earth_location.addEventListener('mousedown', function() {
            earth_location.style.cursor = "-moz-grabbing";
            earth_location.style.cursor = "-webkit-grabbing";
            earth_location.style.cursor = "grabbing";
        });

        earth_location.addEventListener('mouseup', function() {
            earth_location.style.cursor = "-moz-grab";
            earth_location.style.cursor = "-webkit-grab";
            earth_location.style.cursor = "grab";
        });

        renderer.domElement.addEventListener("wheel", function() {
            const max_zoom = 15000;
            const middle_point = 1000;
            const min_zoom = 350;

            const t_min = 0.4;
            const t_middle = 1.0;
            const t_max = 2.0;

            if (zoom_level > middle_point) {
                state.flag_scale = normalize(zoom_level, middle_point, max_zoom, t_middle, t_min);
            } else {
                state.flag_scale = normalize(zoom_level, min_zoom, middle_point, t_max, t_middle);
            }
        });

        function updateFlagScaling() {
            const max_zoom = 15000;
            const middle_point = 1000;
            const min_zoom = 350;

            const t_min = 0.5;
            const t_middle = 1.0;
            const t_max = 2.0;

            if (zoom_level > middle_point) {
                state.flag_scale = normalize(zoom_level, middle_point, max_zoom, t_middle, t_min);
            } else {
                state.flag_scale = normalize(zoom_level, min_zoom, middle_point, t_max, t_middle);
            }
        }

        window.addEventListener( 'resize', onWindowResize, false );

        function onWindowResize(){
            let tab_containers = $('.tab-menu-cont')
            let active_tab_container = null;
            for (let i = 0; i < tab_containers.length; ++i)
            {
                if (tab_containers[i].getAttribute('aria-hidden') === "false"){
                    active_tab_container = $(tab_containers[i]);
                    break;
                }
            }

            if (active_tab_container != null) {
                let width = active_tab_container.width();
                let height = active_tab_container.height();
                let ratio = width / height;

                updateCanvasLocation();
            }

        }

        function setTravelLine(lat, lon)
        {
            let newLineDashed = createTravelLine(lat, lon, true);
            let newLineSolid = createTravelLine(lat, lon, false);

            if (lineDashed !== null) {
                group.remove(lineDashed);
            }

            if (lineSolid !== null) {
                group.remove(lineSolid);
            }

            group.add(newLineDashed);
            group.add(newLineSolid);
            lineDashed = newLineDashed;
            lineSolid = newLineSolid;
        }


        // MENU
        var gui = new dat.GUI({ autoPlace: false, width: 147 });
        gui.domElement.id = 'gui';
        gui.add(options, "rotation_speed", -0.5, 0.5, 0.01).name("Rotation").onChange(
            function() {
                clearTimeout(timeout);
                state.rotation_speed = options.rotation_speed;
            }
        );
        gui.close();

        earth_location.appendChild(gui.domElement);
        //----------------

        $('#skip-to-content').after($('<h4 class="ta3D left" style="margin-left: 6px; font-size: 16px">3.0D</h4>'));

        GM_addStyle('.z-text {  transform: rotateX(23deg) rotateY(-31deg) rotateZ(-5deg); }');
        var ztxt = new Ztextify(".ta3D", {
            depth: "18px",
            layers: 3,
            fade: true,
            direction: "both"
        });

        updateFlagScaling();
    }
})();









