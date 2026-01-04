// ==UserScript==
// @name        Flightyradar Filtery
// @description Custom filter for FR24.
// @match       https://www.flightradar24.com/*
// @run-at      document-start
// @grant       GM_addStyle
// @version     0.43
// @license MIT
// @namespace https://greasyfork.org/users/459561
// @downloadURL https://update.greasyfork.org/scripts/408135/Flightyradar%20Filtery.user.js
// @updateURL https://update.greasyfork.org/scripts/408135/Flightyradar%20Filtery.meta.js
// ==/UserScript==

// query_flight_data
// flight_data_service_cb


function GM_Main() {
    'use strict';
    'use esversion: 6';

    let interesting_airports = [];
    let airport_codes = [];
    let dem_planes;
    let private_jets;
    let big_privates;
    let helis_list;
    let plane_routes;

    let plane_route_names;

    let hasSetup = false;

    function doWhen(fn, getter, ignoreSetup) {
        let obj;
        getter = getter || (() => true);
        try {
            obj = (ignoreSetup || hasSetup) ? getter() : null;
        } catch (_) { }

        if (!obj) {
            setTimeout(() => doWhen(fn, getter, ignoreSetup), 1);
        } else {
            console.log('doing', (ignoreSetup || hasSetup), fn.name);
            fn(obj);
        }
    }

    function _lsGet(key, def) {
        const val = localStorage.getItem(key);
        return val === null ? def : val;
    }

    function _lsSet(key, val) {
        localStorage.setItem(key, val);
        return val;
    }

    function toList(s) {
        return s.toLowerCase().split(",").map(x => x.trim()).filter(x => x);
    }

    function fromList(l) {
        return l.filter(x => x).join(',');
    }

    let fixed_lat = _lsGet("rs_fixed_lat", 52),
        fixed_long = _lsGet("rs_fixed_long", 3);

    let width = _lsGet("rs_fixed_w", 6.5),
        height = _lsGet("rs_fixed_h", 2.5),
        angle = _lsGet("rs_fixed_rot", 27);

    let airport_filter = toList(_lsGet("rs_airport_filter", 'ams,bcn,bqh,man'));

    let airport_pref = _lsGet("rs_airport_pref", "");

    let all_planes = _lsGet("rs_all_planes") === "true";
    let selected_only = _lsGet("rs_selected_only") === "true";
    let override_hover = _lsGet("rs_override_hover") !== "false";
    let move_ellipse = _lsGet("rs_move_ellipse") === "true";

    let ellipse_zone = _lsGet("rs_ellipse_zone") !== "false";
    let filter_airports = _lsGet("rs_filter_airports") !== "false";
    let opts_right = _lsGet("rs_opts_right") === "true";
    let show_helis = _lsGet("rs_show_helis") === "true";
    let hide_options = _lsGet("rs_hide_options") === "true";
    let show_big_privates = _lsGet("rs_show_big_privates") !== "false";

    let good_plane_list;

    function setPlaneList() {
        good_plane_list = Array.from(private_jets);
        if (show_big_privates) {
            good_plane_list.splice(0, 0, ...big_privates);
        }
        // console.log(good_plane_list);
    }

    let invert_ellipse = false;
    let filtered_type = "";

    let latConv, lngConv, I1;

    function showRoute(routeid) {
        const daplane = plane_routes[routeid];
        const aircraft = daplane.data.identification.id;

        if (
            window.polylines_fake[aircraft] &&
            window.polylines_fake[aircraft].length
        ) {
            return;
        }

        const multi_select_mode = window.multi_select_mode;
        window.multi_select_mode = true;

        window.plane_list[aircraft] = window.plane_list_org[aircraft] =
            daplane.plane;

        window.polylines[aircraft] = [];
        window.polylines_index[aircraft] = [];
        window.polylines_fake[aircraft] = [];
        window.polylines_fake_index[aircraft] = [];

        window.flight_data_service_cb_multi(daplane.data, true, aircraft);
        window.multi_select_mode = multi_select_mode;
    }

    function deleteRoute(routeid) {
        const daplane = plane_routes[routeid];
        const aircraft = daplane.data.identification.id;
        const empty = [];

        for (i = 0; i <= (window.polylines[aircraft] || empty).length - 1; i++) {
            window.polylines[aircraft][i].setMap(null);
        }
        delete window.polylines[aircraft];
        delete window.polylines_index[aircraft];

        for (
            let i = 0;
            i <= (window.polylines_fake[aircraft] || empty).length - 1;
            i++
        ) {
            window.polylines_fake[aircraft][i].setMap(null);
        }
        delete window.polylines_fake[aircraft];
        delete window.polylines_fake_index[aircraft];
    }

    function createOptions() {
        const toggle_label = () => (hide_options ? "Show" : "Hide");
        const css_side = () => (opts_right ? "right" : "left");

        function set_check(key, input) {
            return _lsSet(key, input.prop("checked"));
        }

        function set_val(key, input) {
            return _lsSet(key, input.val());
        }

        function onChange() {
            width = _lsSet("rs_fixed_w", input_w.val());
            height = _lsSet("rs_fixed_h", input_h.val());
            angle = _lsSet("rs_fixed_rot", input_rot.val());

            selected_only = set_check("rs_selected_only", input_only);
            all_planes = set_check("rs_all_planes", input_all);
            override_hover = set_check("rs_override_hover", input_hover);
            move_ellipse = set_check("rs_move_ellipse", input_drag);
            ellipse_zone = set_check("rs_ellipse_zone", input_ez);
            show_helis = set_check("rs_show_helis", input_helis);
            
            airport_filter = toList(_lsSet("rs_airport_filter", input_airport.val()));
            airport_pref = set_val("rs_airport_pref", airport_type_select);

            invert_ellipse = input_ie.prop("checked");
            filtered_type = filtered_type_select.val();

            const routes = route_select.val() || [];
            plane_route_names.forEach((plane_route) => {
                if (routes.includes(plane_route)) showRoute(plane_route);
                else deleteRoute(plane_route);
            });

            if (ellipse_zone) {
                createEllipse();
            } else {
                removeEllipse();
            }

            const _filter_airports = set_check("rs_filter_airports", input_pins);
            if (_filter_airports != filter_airports) {
                filter_airports = _filter_airports;
                doAirports();
            }

            const _opts_right = _lsSet("rs_opts_right", input_politi.prop("checked"));
            if (_opts_right !== opts_right) {
                opts_right = _opts_right;
                cont.css("left", "auto").css("right", "auto").css(css_side(), "10px");
                toggle_btn.css("float", css_side());
            }

            const _show_big_privates = set_check("rs_show_big_privates", input_biguns);
            if (_show_big_privates !== show_big_privates) {
                show_big_privates = _show_big_privates;
                setPlaneList();
            }

            doPlanes();
        }

        const $ = window.jQuery;
        let first, prev;

        const css_style = 'z-index: 9999; position: absolute; background-color: lightgrey; ' +
            "bottom: 10px; " +
            css_side() +
            ': 10px;';

        [
            '<aside class="card-panel">',
            '<header class="card-summary">',
            '<div class="card-title">Options</div>',
            '<div class="card-more-info">',
            ].forEach(widget => {
                const $widget = $(widget);
                if(!first) {
                    first = $widget;
                }
                if(prev) {
                    prev.append($widget);
                }
                prev = $widget;
            });
        
        // doWhen(($main) => $main.append(first), () => $('div#widgetPanel'));

        const cont = $(`<table border=1 style="${css_style}">`);

        function addTo(tr, el, colspan) {
            colspan = colspan || 1;
            tr.append($("<td colspan=" + colspan + ">").append(el));
        }

        function newTr(always_show) {
            const tr = $("<tr" + (always_show ? "" : ' class="rs_hideable" ') + ">");
            cont.append(tr);
            return tr;
        }

        function addInput(label, input, tr, colspan) {
            tr = tr || newTr();

            addTo(tr, $("<label>" + label + "</label>"), colspan);
            addTo(tr, input, colspan);
            input.change(onChange);
        }

        function createAddInput(label, initial_val, option_type, tr) {
            option_type = option_type || "text";
            const is_checkbox = option_type === "checkbox";
            const is_textarea = option_type === "textarea";
            const colspan = is_checkbox ? 1 : 2;

            const width = is_checkbox || is_textarea ? "" : "width: 40px;";
            const input = $(
                "<input " +
                'type="' +
                option_type +
                '" value="' +
                initial_val +
                '" ' +
                'style="' +
                width +
                ' text-align: center;"' +
                ">"
            );

            if (is_checkbox && initial_val) {
                input.prop("checked", true);
            }

            addInput(label, input, tr, colspan);

            return input;
        }

        function addCheckbox(label, initial_val, tr) {
            return createAddInput(label, initial_val, "checkbox", tr);
        }

        function addButton(label, callback, tr) {
            const button = createAddInput(label, null, "button", tr);
            $(button).click(() => callback());
            return button;
        }

        const input_w = createAddInput("Width", width);
        const input_h = createAddInput("Height", height);
        const input_rot = createAddInput("Angle", angle);
        
        const input_airport = 
            createAddInput("Route filter", fromList(airport_filter), 'textarea');
        
        let tr;

        tr = newTr();
        const airport_type_select = $("<select>");
        [
            ["", ""],
            ["source", "Came from List"],
            ["dest", "Going to List"],
            ["any", "Any in List"],
            ["both", "Both in List"],
        ].forEach(([val, title]) =>
        airport_type_select.append(
                `<option value="${val}" ${val === airport_pref ? "selected" : ""
                }>${title}</option>`
            )
        );

        addInput("Filter Type", airport_type_select, tr, 2);

        tr = newTr();
        const input_only = addCheckbox("Selected Only", selected_only, tr);
        const input_all = addCheckbox("Show All", all_planes, tr);

        tr = newTr();
        const input_ez = addCheckbox("Ellipse Zone", ellipse_zone, tr);
        const input_drag = addCheckbox("Move Ellipse", move_ellipse, tr);

        tr = newTr();
        const input_ie = addCheckbox("Invert Ellipse", invert_ellipse, tr);
        const input_pins = addCheckbox("Filter Airports", filter_airports, tr);

        tr = newTr();
        const input_helis = addCheckbox("Show Helis", show_helis, tr);
        const input_biguns = addCheckbox("Show big privates?", show_big_privates, tr);

        tr = newTr();
        const input_hover = addCheckbox("Hover Select", override_hover, tr);
        const input_politi = addCheckbox("RU High Maint?", opts_right, tr);

        tr = newTr();
        const filtered_type_select = $("<select>");
        filtered_type_select
            .append('<option value="" selected></option>')
            .append('<option value="LJ">Learjet</option>')
            .append('<option value="GL">Bomb. Global</option>');
        addInput("Filter Type", filtered_type_select, tr, 2);

        tr = newTr();
        const route_select = $("<select multiple>");
        route_select.append('<option value="" selected></option>');
        plane_route_names.forEach((plane) =>
            route_select.append(
                '<option value="' +
                plane +
                '">' +
                plane
                    .split("-")
                    .map((s) => s[0].toUpperCase() + s.substr(1))
                    .join(" -> ") +
                "</option>"
            )
        );
        addInput("Route Select", route_select, tr, 2);

        function toggle_options() {
            hide_options = _lsSet("rs_hide_options", !hide_options);
            // console.log(`toggling options cos hide_options = ${hide_options}/${_lsGet('rs_hide_options')}`);
            toggle_btn.val(toggle_label());
            $(".rs_hideable").toggle();
        }

        tr = newTr(true);
        const toggle_btn = $('<input type="button" value="' + toggle_label() + '">')
            .css("float", css_side())
            .click(toggle_options);
        addTo(tr, toggle_btn, 4);

        $(document.body).append(cont);

        if (hide_options) {
            $(".rs_hideable").css("display", "none");
        }
    }

    const newPoint = (lat, lang) => new window.google.maps.LatLng(lat, lang);

    function makeShape(
        point,
        r1,
        r2,
        r3,
        r4,
        rotation,
        vertexCount,
        strokeColour,
        strokeWeight,
        strokeOpacity,
        fillColour,
        fillOpacity,
        _opts,
        tilt
    ) {
        const rot = (-rotation * Math.PI) / 180;
        const points = [];

        latConv =
            window.google.maps.geometry.spherical.computeDistanceBetween(
                point,
                newPoint(point.lat() + 0.1, point.lng())
            ) * 10;

        lngConv =
            window.google.maps.geometry.spherical.computeDistanceBetween(
                point,
                newPoint(point.lat(), point.lng() + 0.1)
            ) * 10;

        const step = 360 / vertexCount || 10;

        let flop = false;
        I1 = tilt ? 180 / vertexCount : 0;

        for (let i = I1; i <= 360.001 + I1; i += step) {
            points.push(
                convertPoint(point, true, flop ? r1 : r3, flop ? r2 : r4, i, rot)
            );

            flop = !flop;
        }

        return new window.google.maps.Polygon({
            paths: points,
            strokeColor: strokeColour,
            strokeWeight: strokeWeight,
            strokeOpacity: strokeOpacity,
            fillColor: fillColour,
            fillOpacity: fillOpacity,
            draggable: move_ellipse,
            geodesic: true,
        });
    }

    function convertPoint(point, additive, r1, r2, i, rot) {
        const op = additive ? (a, b) => a + b : (a, b) => a - b;

        const y = r1 * Math.cos((i * Math.PI) / 180);
        const x = r2 * Math.sin((i * Math.PI) / 180);

        return newPoint(
            op(point.lat(), (y * Math.cos(rot) + x * Math.sin(rot)) / latConv),
            op(point.lng(), (x * Math.cos(rot) - y * Math.sin(rot)) / lngConv)
        );
    }

    function revertPoint(point, r1, r2, rot) {
        return convertPoint(point, false, r1, r2, I1, rot);
    }

    let custom_ellipse;

    function createEllipse() {
        removeEllipse();

        const source_point = newPoint(fixed_lat, fixed_long),
            r1 = height * 100000,
            r2 = width * 100000;

        custom_ellipse = makeShape(
            source_point,
            r1,
            r2,
            r1,
            r2,
            angle || 0,
            100,
            "#FF0000",
            1,
            0.7,
            "#000000",
            0.15
        );
        custom_ellipse.setMap(window.map);

        window.google.maps.event.addListener(
            custom_ellipse,
            "dragend",
            function (e) {
                doPlanes();

                const origin = revertPoint(
                    custom_ellipse.getPath().getArray()[0],
                    height * 100000,
                    width * 100000,
                    (-angle * Math.PI) / 180
                );

                fixed_lat = _lsSet("rs_fixed_lat", origin.lat());
                fixed_long = _lsSet("rs_fixed_long", origin.lng());
            }
        );

        window.google.maps.event.addListener(custom_ellipse, "click", function () {
            window.google.maps.event.trigger(window.map, "click", {});
        });
    }

    function removeEllipse() {
        if (custom_ellipse) {
            window.google.maps.event.clearInstanceListeners(custom_ellipse);
            custom_ellipse.setMap(null);
        }
    }

    function _get_plane_config(aircraft, track, active, squawk, radar, callsign) {
        // size
        let size = window.init_aircraft_size;
        if (window.init_aircraft_size == "auto") {
            size = "normal";
            if (window.currentZoom >= 8) {
                size = "large";
            }
            if (window.currentZoom <= 7 && window.currentZoom >= 5) {
                size = "normal";
            }
            if (window.currentZoom <= 4 && window.currentZoom >= 1) {
                size = "small";
            }
        }

        // color
        let color = "yellow";
        if (radar && radar.match(/(F-SAT|T-SAT)\d+/) !== null) {
            color = "blue";
        }
        if (
            active === true ||
            (squawk && (squawk == "7500" || squawk == "7600" || squawk == "7700"))
        ) {
            color = "red";
        }
        if (aircraft === "GRND") {
            color = "yellow";
        }

        // Special override for santa;
        // Make as big as possible,
        // blue when unselected,
        // red when selected
        if (aircraft === "SLEI") {
            size = "xlarge";
            color = "blue";
            if (active === true) {
                color = "red";
            }
        }

        return window.AircraftIcon.getConfiguration(color, size);
    }

    function _get_plane_alias(aircraft, track, active, squawk, radar, callsign) {
        var config = _get_plane_config(
            aircraft,
            track,
            active,
            squawk,
            radar,
            callsign
        );
        var iconIcaos = Object.keys(config.response.icons);

        // Match by ICAO
        if (iconIcaos.indexOf(aircraft) !== -1) {
            return aircraft;
        }

        // Match by alias
        for (var i = 0; i < iconIcaos.length; i++) {
            var iconIcao = iconIcaos[i];
            var currentIcon = config.response.icons[iconIcao];
            if (currentIcon.aliases.indexOf(aircraft) !== -1) {
                return currentIcon.aliases[0];
            }
        }

        return "";
    }

    function is_selected(index) {
        return (
            window.selected_aircraft == index ||
            window.selected_aircraft_array.includes(index)
        );
    }

    function hoverOverride(addListener) {
        window.google.maps.event.addListener = function (obj, etype, _callback) {
            let callback = _callback;
            if (etype === "mouseover" && obj.icon) {
                // console.log('hoverOverride, in callback for', etype, obj.icon, override_hover);
                callback = function () {
                    // console.log('hoverOverride, in callback for', etype, obj.icon, override_hover);
                    if (override_hover) {
                        var ident = 
                            (Object.entries(window.planes_array).filter(([a, b]) => b === obj) ||
                            [[null, null]])[0][0];

                        if (!is_selected(ident)) {
                            window.google.maps.event.trigger(obj, "click", {});
                        }
                    } else {
                        _callback.apply(obj);
                    }
                };
            }

            return addListener.apply(
                window.google.maps.event,
                [obj, etype, callback,]
            );
        };
    }
    doWhen(hoverOverride, () => window.google.maps.event.addListener, true);

    function closeAircraftOverride(close_aircraft_data) {
        window.close_aircraft_data = function (noAnim) {
            close_aircraft_data(noAnim);
            doPlanes();
        };
    }
    doWhen(closeAircraftOverride, () => window.close_aircraft_data);

    var _airports;
    var _filteredPorts;
    const KEY_AIRPORT = 'airport';

    function haveAirports() {
        return window.nav_list[KEY_AIRPORT] && window.nav_list[KEY_AIRPORT].length;
    }

    function filterNavlistAirports() {
        var nav_list = window.nav_list;
        var airports = nav_list[KEY_AIRPORT];

        if (filter_airports) {
            if (haveAirports() && (airports !== _filteredPorts)) {
                _airports = airports;
                // {"id":"KORD","icao":"ORD","pos":{"lat":41.978142,"lng":-87.9058},"title":"Chicago O'Hare International Airport (ORD/KORD)","size":2266603,"marker":null}
                _filteredPorts = _airports.filter((port) =>
                    interesting_airports.some((name) => port.title.toLowerCase().includes(name)) ||
                    airport_codes.some((name) => port.icao.toLowerCase().includes(name))
                );
                
                nav_list[KEY_AIRPORT] = _filteredPorts;
            }
        } else {
            if (airports === _filteredPorts) {
                nav_list[KEY_AIRPORT] = _airports;
            }
        }
        console.log(interesting_airports, airport_codes, nav_list);
        console.trace();
    }

    function renderMapPinsOverride(renderMapPins) {
        window.renderMapPins = function (type, bounds, limit) {
            if (type === KEY_AIRPORT) {
                filterNavlistAirports();
            }
            renderMapPins(type, bounds, limit);
        };

        doWhen(() => { filterNavlistAirports(); doAirports() }, () => haveAirports() && airport_codes.length);
    }
    doWhen(renderMapPinsOverride, () => window.renderMapPins, true);

    function doAirports() {
        window.clearMapPins("airport");
        window.lastRenderPinsCacheKey = null;
        window.update_static_pins();
    }

    var _sizeMap = { large: 35, normal: 30, small: 25 };
    var _allColors = ["yellow", "red", "blue"];
    var _allAliases;

    function _get_icons(color, size) {
        var config = window.AircraftIcon.getConfiguration(color, size);
        return config && config.response && config.response.icons
            ? config.response.icons
            : {};
    }

    function _get_allConfigs() {
        var aliases = new Set();
        Object.keys(_sizeMap).forEach((size) =>
            _allColors.forEach((color) =>
                Object.entries(_get_icons(color, size)).forEach(([icon_key, icon]) =>
                    aliases.add(icon.aliases.length ? icon.aliases[0] : icon_key)
                )
            )
        );

        if (!aliases.size) {
            setTimeout(_get_allConfigs, 500);
        } else {
            _allAliases = Array.from(aliases);
        }
    }

    // doWhen(_get_allConfigs, () => window.AircraftIcon);

    function issa_okay_aircraft(alias, callsign) {
        return (
            dem_planes.includes(callsign) ||
            good_plane_list.includes(alias) ||
            (show_helis && helis_list.includes(alias))
        );
    }

    var _plane_list;

    function runthrough_planes(plane_list) {
        _plane_list = plane_list || {};

        if(!hasSetup) {
            plane_list = {};
        }
        
        var new_data = {};
        var havea_selected =
            window.selected_aircraft_array.length ||
            (window.selected_aircraft && window.selected_aircraft !== "NULL");

        // var first_run = true;
        // var run_i = 0;

        Object.keys(plane_list).forEach((index) => {
            var selected = !hasSetup || is_selected(index);

            var elem = plane_list[index];
            /*
                        0: "4C3DAA"
                        1: 51.52
                        2: 0.23
                        3: 313
                        4: 2700
                        5: 224
                        6: "5760"
                        7: "T-EGTO107"
                        8: "C56X"
                        9: "YU-PNK"
                        10: 1623009530
                        11: "PSA"
                        12: "BQH"
                        13: ""
                        14: 0
                        15: 0
                        16: "YUPNK"
                        17: 0
                        18: "PNK"
                        */
            if(Object.prototype.toString.call(elem) !== "[object Array]") {
                return;
            }

            var lat = elem[1],
                long = elem[2],
                radar = elem[7],
                ac_type = elem[8],
                callsign = elem[16];

            // ac_type, track, active, squawk, radar, callsign
            var alias = _get_plane_alias(
                ac_type,
                elem[3],
                false,
                elem[6],
                radar,
                callsign
            );

            if (selected) {
                // console.log('selected', alias, callsign);
            }

            if (
                !selected &&
                ![
                    "version",
                    "full_count",
                    "stats",
                    "selected",
                    "selected-aircraft",
                ].includes(index)
            ) {
                if (selected_only && havea_selected) {
                    return;
                }

                if(airport_pref) {

                    const source = elem[11].toLowerCase() || 'na',
                        dest = elem[12].toLowerCase() || 'na';
                    const source_in_list = airport_filter.includes(source),
                        dest_in_list = airport_filter.includes(dest);
    
                    switch (airport_pref) { 
                        case 'source':
                            if(!source_in_list) {
                                return;
                            }
                            break;
                        case 'dest':
                            if(!dest_in_list) {
                                return;
                            }
                        case 'both':
                            if(!source_in_list || !dest_in_list) {
                                return;
                            }
                        case 'any':
                            if(!source_in_list && !dest_in_list) {
                                return;
                            }
                            break;
                        }
                }

                if (!all_planes && !issa_okay_aircraft(alias, callsign)) {
                    return;
                }

                if (ellipse_zone) {
                    var isin = window.google.maps.geometry.poly.containsLocation(
                        newPoint(lat, long),
                        custom_ellipse
                    );

                    if (isin === invert_ellipse) {
                        return;
                    }
                }

                if (
                    filtered_type &&
                    ![ac_type, callsign].some((pltype) =>
                        pltype.startsWith(filtered_type)
                    )
                ) {
                    return;
                }
            }

            new_data[index] = elem;
        });

        _pd_callback(new_data);
    }

    var _pd_callback;

    function pdcallbackOverride(pd_callback) {
        _pd_callback = pd_callback;

        window.pd_callback = function (plane_list) {
            if (!custom_ellipse && ellipse_zone) {
                createEllipse();
            }

            runthrough_planes(plane_list);
        };
        
        doWhen(doPlanes, () => window.mapCanvasStub && _plane_list);
    }
    doWhen(pdcallbackOverride, () => window.pd_callback, true);

    function doPlanes() {
        runthrough_planes(_plane_list || {});
    }

    function flight_data_service_cbOverride(flight_data_service_cb) {
        window.flight_data_service_cb = function (data, isupdate) {
            console.log({
                plane: window.plane_list[window.selected_aircraft],
                data: data,
            });
            return flight_data_service_cb(data, isupdate);
        };
    }
    doWhen(flight_data_service_cbOverride, () => window.flight_data_service_cb);

    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            const data = JSON.parse(xmlHttp.responseText);
            const remoteConfig = data.config;
            delete data.config;

            interesting_airports = remoteConfig.interesting_airports;
            airport_codes = remoteConfig.airport_codes;
            dem_planes = remoteConfig.dem_planes;
            private_jets = remoteConfig.private_jets;
            big_privates = remoteConfig.big_privates;
            helis_list = remoteConfig.helis_list;

            plane_routes = data;
            plane_route_names = Object.keys(plane_routes).sort();

            // console.log(plane_routes, plane_route_names)

            setPlaneList();
            createOptions();

            hasSetup = true;
        }
    };
    xmlHttp.open("GET", atob("aHR0cHM6Ly9ldXJvcGUtd2VzdDItc2VhZGVycy1ham9ucC1sZXNzb24tMTEuY2xvdWRmdW5jdGlvbnMubmV0L2F0Yy1yb3V0ZXM="), true);
    xmlHttp.send(null);
}

function addJS_Node(text, s_URL, funcToRun, runOnLoad) {
    var D = document;
    var scriptNode = D.createElement("script");
    if (runOnLoad) {
        scriptNode.addEventListener("load", runOnLoad, false);
    }
    scriptNode.type = "text/javascript";
    if (text) scriptNode.textContent = text;
    if (s_URL) scriptNode.src = s_URL;
    if (funcToRun) scriptNode.textContent = "(" + funcToRun.toString() + ")()";

    var targ = D.getElementsByTagName("head")[0] || D.body || D.documentElement;
    targ.appendChild(scriptNode);
}

addJS_Node(null, null, GM_Main);
