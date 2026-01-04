// ==UserScript==
// @name         Diep.io Minimap AFK
// @namespace    https://diep.io/*
// @version      1.01
// @description  Moves back to original position when someone bumps you
// @author       Binary
// @match        https://diep.io/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412171/Diepio%20Minimap%20AFK.user.js
// @updateURL https://update.greasyfork.org/scripts/412171/Diepio%20Minimap%20AFK.meta.js
// ==/UserScript==

(function() {
    /// UI ///

    var selflocation = [0, 0];
    var homebaselocation = [0, 0];
    var debug = false;
    var isleader = false;
    var afk = false;
    var acceptable_distance = 2;

    var overlay_elements = {};
    var singular_keydown_events = {};

    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '20px';
    overlay.style.left = '30px';
    overlay.style.fontFamily = 'Lucida Console, Courier, monospace';
    overlay.style.fontSize = '12px';
    overlay.style.color = '#ffffff';
    overlay.style.pointerEvents = 'none';
    overlay.style.userSelect = 'none';
    document.body.appendChild(overlay);

    document.body.addEventListener('keydown', function (event) {
        if (!event.ctrlKey && !event.shiftKey && !event.altKey && !event.repeat) {
            if (singular_keydown_events[event.code]) singular_keydown_events[event.code]();
        }
    });

    function addToOverlay(value_name, value_key = 'default') {
        var wrap_element = document.createElement('p');
        wrap_element.textContent = value_name + (value_key === 'default' ? '' : ': ');
        overlay_elements[value_key] = document.createElement('span');
        wrap_element.appendChild(overlay_elements[value_key]);
        overlay.appendChild(wrap_element);
    }
    addToOverlay('Diep.io Minimap AFK');
    addToOverlay('Press / to show/hide this overlay');
    addToOverlay('X-Axis', 'location_x');
    addToOverlay('Y-Axis', 'location_y');
    addToOverlay('Press q to enable AFK', 'afk_boolean');
    addToOverlay('Press j to save AFK location', 'home_base_location');
    addToOverlay('Press , to change AFK radius', 'acceptable_distance');
    addToOverlay('Press [ if you are a leader (IMPORTANT)', 'isleader_boolean');
    addToOverlay('Press r to enable debug (attempts to turn minimap triangle to white)', 'debug_boolean');

    var show_overlay = false;
    overlay.style.display = 'none';
    singular_keydown_events['Slash'] = function () {
        overlay.style.display = (show_overlay = !show_overlay) ? '' : 'none';
    };

    overlay_elements['afk_boolean'].textContent = afk;
    singular_keydown_events['KeyQ'] = function() {
        overlay_elements['afk_boolean'].textContent = (afk = !afk);
    };

    overlay_elements['home_base_location'].textContent = JSON.stringify(homebaselocation);
    singular_keydown_events['KeyJ'] = function() {
        homebaselocation[0] = selflocation[0];
        homebaselocation[1] = selflocation[1];
        overlay_elements['home_base_location'].textContent = JSON.stringify(homebaselocation);
    };

    overlay_elements['acceptable_distance'].textContent = acceptable_distance;
    singular_keydown_events['Comma'] = function() {
        overlay_elements['acceptable_distance'].textContent = (acceptable_distance = parseFloat(prompt('Change acceptable distance to...', acceptable_distance)));
    };

    overlay_elements['isleader_boolean'].textContent = isleader;
    singular_keydown_events['BracketLeft'] = function() {
        overlay_elements['isleader_boolean'].textContent = (isleader = !isleader);
    };

    overlay_elements['debug_boolean'].textContent = debug;
    singular_keydown_events['KeyR'] = function() {
        overlay_elements['debug_boolean'].textContent = (debug = !debug);
    };

    /// GET SELF LOCATION ///

    var position = 0;
    var position2 = 0;
    var original_getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(...args){
        var context = original_getContext.apply(this, args);

        // I have included these wrapping functions for y'all programmers to play around with (it's kinda fun)
        var wrapFunc = function(targetproperty, wrapfunction){
            var property = context[targetproperty];
            context[targetproperty] = function(...args){
                if(wrapfunction(args)) return;
                property.apply(context, args);
            };
        };
        var wrapSetter = function(targetproperty, wrapfunction){
            var setter = context.__lookupSetter__(targetproperty);
            context.__defineSetter__(targetproperty, function(newvalue){
                var callbackResult = wrapfunction(newvalue);
                if(callbackResult === true) return;
                setter.call(context, callbackResult || newvalue);
            });
        };
        wrapFunc('strokeRect', function(){
            position = 0;
        });
        wrapFunc('moveTo', function(args){
            if(position2++ === 0) {
                selflocation = args;
                overlay_elements['location_x'].textContent = selflocation[0];
                overlay_elements['location_y'].textContent = selflocation[1];
            }
        });

        wrapSetter('fillStyle', function(newValue){
            if(newValue === 'rgb(0,0,0)' && position++ === (isleader ? 1 : 2)){
                position2 = 0;
                if(debug) return 'rgb(255,255,255)';
            }
        });

        return context;
    };

    /// MOVE ALGORITHM ///

    var movement_control_keys = {
        left: 37,
        up: 38,
        right: 39,
        down: 40
    };
    var control_order = [
        function(){press(movement_control_keys.up)},
        function(){press(movement_control_keys.up);press(movement_control_keys.right)},
        function(){press(movement_control_keys.right)},
        function(){press(movement_control_keys.right);press(movement_control_keys.down)},
        function(){press(movement_control_keys.down)},
        function(){press(movement_control_keys.down);press(movement_control_keys.left)},
        function(){press(movement_control_keys.left)},
        function(){press(movement_control_keys.left);press(movement_control_keys.up)},
        function(){press(movement_control_keys.up)},
    ];
    function getBearing(selfx, selfy, targetx, targety) {
        // flip y axis for canvas's weird non-cartesian plane;
        selfy *= -1;
        targety *= -1;

        var bearing = Math.PI - Math.atan2(targety - selfy, targetx - selfx);
        bearing -= Math.PI / 2;
        if (bearing < 0) bearing += 2 * Math.PI;
        return bearing;
    }
    function getDistance(selfx, selfy, targetx, targety) {
        return Math.sqrt(Math.pow(selfx - targetx, 2) + Math.pow(selfy - targety, 2));
    }
    function flushInputs(){
        for(var eachKey in movement_control_keys){
            unsafeWindow.input.keyUp(movement_control_keys[eachKey]);
        }
    }
    function press(key){
        unsafeWindow.input.keyDown(key);
    }

    var clock = 1; // 1 to 10
    var end_tick = 10;
    var tick_time = 60; // end_tick * tick_time = total time for one cycle
    var previousafk = false; // flush keydown events when afk is turned off
    var gotolocation = function () {
        if (afk) {
            previousafk = true;
            flushInputs();

            var bearing = getBearing(selflocation[0], selflocation[1], homebaselocation[0], homebaselocation[1]);
            var distance = getDistance(selflocation[0], selflocation[1], homebaselocation[0], homebaselocation[1]);
            if (acceptable_distance < distance) {
                var key_sections = bearing / (2 * Math.PI); // normalize bearing
                var time_section = 0; // portion of one cycle allocated to the first key
                var first_key = function(){};
                var second_key = function(){};

                for (let section = 1; section <= 8; section++) {
                    if (key_sections < section / 8) {
                        time_section = (key_sections - ((section - 1) / 8)) * 8;
                        first_key = control_order[section - 1];
                        second_key = control_order[section];
                        break;
                    }
                }
                if ((clock++ / end_tick) > time_section) {
                    first_key();
                } else {
                    second_key();
                }

                if (clock > end_tick) clock = 1;
            } else {
                clock = 1;
            }
        }else{
            if(previousafk){
                flushInputs();
                previousafk = false;
            }
        }
        setTimeout(gotolocation, tick_time);
    };
    gotolocation();
})();