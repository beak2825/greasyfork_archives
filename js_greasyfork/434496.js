// ==UserScript==
// @name         Roll20 Enhanced Keyboard Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.8.2
// @license      MIT
// @description  Extends and enhances Roll20's keyboard shortcuts.
// @author       Jon Molnar
// @match        *://app.roll20.net/editor/
// @match        *://app.roll20dev.net/editor/
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434496/Roll20%20Enhanced%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/434496/Roll20%20Enhanced%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    // Utilities
    const LOG = true;
    function log(...args) {
        if (LOG) console.log("[REKS]", ...args);
    }

    function waitForDeps(deps, callback) {
        log("Waiting for dependencies:", deps);
        function _waitForDeps() {
            setTimeout(() => {
                if (deps.some(dep => window[dep] === undefined)) {
                    _waitForDeps();
                } else {
                    callback();
                }
            }, 10);
        }
        _waitForDeps();
    }

    waitForDeps(["jQuery"], () => {

        const jQuery = window.jQuery;
        const $ = jQuery;

        log("Inlining jQuery.simulate()");

        /*!
         * jQuery Simulate v@VERSION - simulate browser mouse and keyboard events
         * https://github.com/jquery/jquery-simulate
         *
         * Copyright jQuery Foundation and other contributors
         * Released under the MIT license.
         * http://jquery.org/license
         *
         * Date: @DATE
         */

        ;(function( $, undefined ) {

            var rkeyEvent = /^key/,
                rdashAlpha = /-([a-z])/g,
                rmouseEvent = /^(?:mouse|contextmenu)|click/;

            function fcamelCase( _all, letter ) {
                return letter.toUpperCase();
            }

            function camelCase( string ) {
                return string.replace( rdashAlpha, fcamelCase );
            }

            $.fn.simulate = function( type, options ) {
                return this.each(function() {
                    new $.simulate( this, type, options );
                });
            };

            $.simulate = function( elem, type, options ) {
                var method = camelCase( "simulate-" + type );

                this.target = elem;
                this.options = options;

                if ( this[ method ] ) {
                    this[ method ]();
                } else {
                    this.simulateEvent( elem, type, options );
                }
            };

            $.extend( $.simulate, {

                keyCode: {
                    BACKSPACE: 8,
                    COMMA: 188,
                    DELETE: 46,
                    DOWN: 40,
                    END: 35,
                    ENTER: 13,
                    ESCAPE: 27,
                    HOME: 36,
                    LEFT: 37,
                    NUMPAD_ADD: 107,
                    NUMPAD_DECIMAL: 110,
                    NUMPAD_DIVIDE: 111,
                    NUMPAD_ENTER: 108,
                    NUMPAD_MULTIPLY: 106,
                    NUMPAD_SUBTRACT: 109,
                    PAGE_DOWN: 34,
                    PAGE_UP: 33,
                    PERIOD: 190,
                    RIGHT: 39,
                    SPACE: 32,
                    TAB: 9,
                    UP: 38
                },

                buttonCode: {
                    LEFT: 0,
                    MIDDLE: 1,
                    RIGHT: 2
                }
            });

            $.extend( $.simulate.prototype, {

                simulateEvent: function( elem, type, options ) {
                    var event = this.createEvent( type, options );
                    this.dispatchEvent( elem, type, event, options );
                },

                createEvent: function( type, options ) {
                    if ( rkeyEvent.test( type ) ) {
                        return this.keyEvent( type, options );
                    }

                    if ( rmouseEvent.test( type ) ) {
                        return this.mouseEvent( type, options );
                    }
                },

                mouseEvent: function( type, options ) {
                    var event, eventDoc, doc, body;
                    options = $.extend({
                        bubbles: true,
                        cancelable: (type !== "mousemove"),
                        view: window,
                        detail: 0,
                        screenX: 0,
                        screenY: 0,
                        clientX: 1,
                        clientY: 1,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        button: 0,
                        relatedTarget: undefined
                    }, options );

                    if ( document.createEvent ) {
                        event = document.createEvent( "MouseEvents" );
                        event.initMouseEvent( type, options.bubbles, options.cancelable,
                                             options.view, options.detail,
                                             options.screenX, options.screenY, options.clientX, options.clientY,
                                             options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                                             options.button, options.relatedTarget || document.body.parentNode );

                        // IE 9+ creates events with pageX and pageY set to 0.
                        // Trying to modify the properties throws an error,
                        // so we define getters to return the correct values.
                        if ( event.pageX === 0 && event.pageY === 0 && Object.defineProperty ) {
                            eventDoc = event.relatedTarget.ownerDocument || document;
                            doc = eventDoc.documentElement;
                            body = eventDoc.body;

                            Object.defineProperty( event, "pageX", {
                                get: function() {
                                    return options.clientX +
                                        ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) -
                                        ( doc && doc.clientLeft || body && body.clientLeft || 0 );
                                }
                            });
                            Object.defineProperty( event, "pageY", {
                                get: function() {
                                    return options.clientY +
                                        ( doc && doc.scrollTop || body && body.scrollTop || 0 ) -
                                        ( doc && doc.clientTop || body && body.clientTop || 0 );
                                }
                            });
                        }
                    } else if ( document.createEventObject ) {
                        event = document.createEventObject();
                        $.extend( event, options );
                        // standards event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ff974877(v=vs.85).aspx
                        // old IE event.button uses constants defined here: http://msdn.microsoft.com/en-us/library/ie/ms533544(v=vs.85).aspx
                        // so we actually need to map the standard back to oldIE
                        event.button = {
                            0: 1,
                            1: 4,
                            2: 2
                        }[ event.button ] || ( event.button === -1 ? 0 : event.button );
                    }

                    return event;
                },

                keyEvent: function( type, options ) {
                    var event;
                    options = $.extend({
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        ctrlKey: false,
                        altKey: false,
                        shiftKey: false,
                        metaKey: false,
                        keyCode: 0,
                        charCode: undefined
                    }, options );

                    if ( document.createEvent ) {
                        try {
                            event = document.createEvent( "KeyEvents" );
                            event.initKeyEvent( type, options.bubbles, options.cancelable, options.view,
                                               options.ctrlKey, options.altKey, options.shiftKey, options.metaKey,
                                               options.keyCode, options.charCode );
                            // initKeyEvent throws an exception in WebKit
                            // see: http://stackoverflow.com/questions/6406784/initkeyevent-keypress-only-works-in-firefox-need-a-cross-browser-solution
                            // and also https://bugs.webkit.org/show_bug.cgi?id=13368
                            // fall back to a generic event until we decide to implement initKeyboardEvent
                        } catch( err ) {
                            event = document.createEvent( "Events" );
                            event.initEvent( type, options.bubbles, options.cancelable );
                            $.extend( event, {
                                view: options.view,
                                ctrlKey: options.ctrlKey,
                                altKey: options.altKey,
                                shiftKey: options.shiftKey,
                                metaKey: options.metaKey,
                                keyCode: options.keyCode,
                                charCode: options.charCode
                            });
                        }
                    } else if ( document.createEventObject ) {
                        event = document.createEventObject();
                        $.extend( event, options );
                    }

                    if ( !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() ) || (({}).toString.call( window.opera ) === "[object Opera]") ) {
                        event.keyCode = (options.charCode > 0) ? options.charCode : options.keyCode;
                        event.charCode = undefined;
                    }

                    return event;
                },

                dispatchEvent: function( elem, type, event ) {
                    if ( elem.dispatchEvent ) {
                        elem.dispatchEvent( event );
                    } else if ( type === "click" && elem.click && elem.nodeName.toLowerCase() === "input" ) {
                        elem.click();
                    } else if ( elem.fireEvent ) {
                        elem.fireEvent( "on" + type, event );
                    }
                },

                simulateFocus: function() {
                    var focusinEvent,
                        triggered = false,
                        element = $( this.target );

                    function trigger() {
                        triggered = true;
                    }

                    element.on( "focus", trigger );
                    element[ 0 ].focus();

                    if ( !triggered ) {
                        focusinEvent = $.Event( "focusin" );
                        focusinEvent.preventDefault();
                        element.trigger( focusinEvent );
                        element.triggerHandler( "focus" );
                    }
                    element.off( "focus", trigger );
                },

                simulateBlur: function() {
                    var focusoutEvent,
                        triggered = false,
                        element = $( this.target );

                    function trigger() {
                        triggered = true;
                    }

                    element.on( "blur", trigger );
                    element[ 0 ].blur();

                    // blur events are async in IE
                    setTimeout(function() {
                        // IE won't let the blur occur if the window is inactive
                        if ( element[ 0 ].ownerDocument.activeElement === element[ 0 ] ) {
                            element[ 0 ].ownerDocument.body.focus();
                        }

                        // Firefox won't trigger events if the window is inactive
                        // IE doesn't trigger events if we had to manually focus the body
                        if ( !triggered ) {
                            focusoutEvent = $.Event( "focusout" );
                            focusoutEvent.preventDefault();
                            element.trigger( focusoutEvent );
                            element.triggerHandler( "blur" );
                        }
                        element.off( "blur", trigger );
                    }, 1 );
                }
            });



            /** complex events **/

            function findCenter( elem ) {
                var offset,
                    document = $( elem.ownerDocument );
                elem = $( elem );
                offset = elem.offset();

                return {
                    x: offset.left + elem.outerWidth() / 2 - document.scrollLeft(),
                    y: offset.top + elem.outerHeight() / 2 - document.scrollTop()
                };
            }

            function findCorner( elem ) {
                var offset,
                    document = $( elem.ownerDocument );
                elem = $( elem );
                offset = elem.offset();

                return {
                    x: offset.left - document.scrollLeft(),
                    y: offset.top - document.scrollTop()
                };
            }

            $.extend( $.simulate.prototype, {
                simulateDrag: function() {
                    var i = 0,
                        target = this.target,
                        eventDoc = target.ownerDocument,
                        options = this.options,
                        center = options.handle === "corner" ? findCorner( target ) : findCenter( target ),
                        x = Math.floor( center.x ),
                        y = Math.floor( center.y ),
                        coord = { clientX: x, clientY: y },
                        dx = options.dx || ( options.x !== undefined ? options.x - x : 0 ),
                        dy = options.dy || ( options.y !== undefined ? options.y - y : 0 ),
                        moves = options.moves || 3;

                    this.simulateEvent( target, "mousedown", coord );

                    for ( ; i < moves ; i++ ) {
                        x += dx / moves;
                        y += dy / moves;

                        coord = {
                            clientX: Math.round( x ),
                            clientY: Math.round( y )
                        };

                        this.simulateEvent( eventDoc, "mousemove", coord );
                    }

                    if ( $.contains( eventDoc, target ) ) {
                        this.simulateEvent( target, "mouseup", coord );
                        this.simulateEvent( target, "click", coord );
                    } else {
                        this.simulateEvent( eventDoc, "mouseup", coord );
                    }
                }
            });

        })( jQuery );

        // END INLINED JQUERY.SIMULATE

        log("Roll20 Enhanced Keyboard Shortcuts is starting up...");

        const textBox = $('<input type="text" class="eks eks-input">')

        const K_START = "\\";

        const style = $(`
            <style>
                .eks {
                    position: absolute;
                    left: 50%;
                    z-index: 99999;
                    width: 500px;
                    margin-left: -256px;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    background-color: #000;
                    color: #fff;
                    opacity: 0.7;
                }
                .eks-input {
                    top: -42px;
                    font-size: 20px;
                    text-align: center;
                    transition: top 0.2s;
                }
                .eks-input:focus {
                    top: 20px;
                }
                .eks-help {
                    top: 80px;
                }
                .eks-help pre {
                    background-color: #000;
                    color: #fff;
                    border: none;
                    max-height: calc(100vh - 256px);
                    overflow-y: auto;
                }
                .eks-help button {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    border: none;
                    background-color: #000;
                    color: #fff;
                    font-size: 20px;
                }
            </style>
        `);

        const help_html = `
<div class="eks eks-help">
<button>x</button>
<pre>
${K_START}h Show this help

${K_START}g- Page Controls
  ${K_START}ga&lt;pagename&gt; Send players & GM to the named page
  ${K_START}gp&lt;pagename&gt; Send players only to the named page
  ${K_START}gg&lt;pagename&gt; Send GM only to the named page

  Notes:
    - Page names are case-sensitive.
    - Only players on the bookmark will be moved.

  ${K_START}gs&lt;settings&gt; Set page settings
    Settings are formatted as &lt;key&gt;=&lt;value&gt; pairs and
    separated by commas.

    dl (y|n) Dynamic lighting
    xm (y|n) Explorer mode
    gi (y|n) Global illumination (daylight mode)
    ud (y|n) Update token vision on drop
    rm (y|n) Restrict movement by dynamic lighting barriers
    fw (y|n) Standard fog of war

    ge (y|n) Grid enabled
    gs (number) Grid scale
    gu (unit) Grid unit
      Units: ft, m, km, mi, in, cm, un, hex, sq, custom
    gt (s|v|h) Grid type
      s = square, v = vert. hex, h = horiz. hex

${K_START}c Chat - Send any message, including commands.
  Example: ${K_START}c/w gm Roll with advantage: [[2d20kh1]]
  Note: This command doesn't work with chat popped out.

${K_START}r&lt;dice-expression&gt; Roll dice
  All Roll20 dice expressions are supported. Examples:
    2d20kh1 Roll 2d20, keep highest
    4d6dl1  Roll 4d6, drop lowest
    5d6>4   Roll 5d6, count 4+ as success
    d6!+d8! Roll 1d6 + 1d8, explode both dice
    ?{#}dF  Prompt for a number and roll that many fudge dice

${K_START}a- Audio
  Note: These commands don't work with the Jukebox popped out.
  ${K_START}as Stop all audio
  ${K_START}an Play next track
  ${K_START}ap&lt;name&gt; Play playlist (case sensitive)
    Example: ${K_START}\apCombat
    Leave name blank to be prompted, i.e. \ap
  ${K_START}at&lt;name&gt; Play track (case sensitive)
    Example: ${K_START}\atRain - Heavy
    Leave name blank to be prompted, i.e. \at

${K_START}n- Create new things
  ${K_START}nh New handout
  ${K_START}nc New character
  ${K_START}nt New rollable table

${K_START}t- Turn tracker
  ${K_START}to Open turn tracker
  ${K_START}tc Clear turn tracker
  ${K_START}tx Close turn tracker
  ${K_START}tn Next turn
  ${K_START}ts Sort turns

${K_START}l&lt;bright&gt;[/&lt;dim&gt;] Lighting
  Set the lighting on the currently selected token.
  Example: ${K_START}l25/25

${K_START}v- Vision
  ${K_START}vn Enable normal vision
  ${K_START}vx Blind (disable vision)
  ${K_START}vd&lt;dist&gt; Darkvision

${K_START}s[name] Toggle named status marker on selected token
  If no name is provided, clear all status markers

${K_START}o&lt;options&gt; Set options for selected token
  Options are formatted as &lt;key&gt;=&lt;value&gt; pairs and
  separated by commas.

  Example: ${K_START}o b1a=hp,b2a=ac

  Note: For any option value, you can enter ? to be prompted,
  e.g. ${K_START}o nv=y,np=y,nt=?

  Bars: (# = 1, 2, 3, or * (all bars))
    b#c (number) Bar current value
    b#m (number) Bar max value
    b#a (attribute) Bar linked attribute
    b#v (y|n) Bar visible to players
    b#e (y|n) Bar editable by controlling player
    b#t (h|e|*) Bar text overlay visibility
      h = hidden, e = editors, * = everyone
    bl (a|b|ot|ob) Token bar location:
      a = above, b = below, ot = overlap top,
      ob = overlap bottom
    bs (s|c) Token bar style: s = standard, c = compact

  Auras: (# = 1, 2, or * (both auras))
    a#r (number) Aura radius
    a#s (c|s) Aura shape: c = circle, s = square
    a#v (y|n) Aura visible to players
    a#e (y|n) Aura editable by controlling player

  Global permissions:
    *v (y|n) Bars/auras/name visible to players
    *e (y|n) Bars/auras/name editable by controlling player

  Misc:
    nv (y|n) Token name visible to players
    ne (y|n) Token name editable by controlling player
    np (y|n) Nameplate visible below token
    nt (text) Name text
    tv (y|n) Tooltip visible on hover
    tt (text) Tooltip text

${K_START}m- Run macros
  ${K_START}mcs Start combat
  ${K_START}mce End combat

${K_START}p Preferences
  Preferences are formatted as &lt;key&gt;=&lt;value&gt; pairs and
  separated by commas.

  Example: ${K_START}p aks=y,3dd=y,a3d=y,pas=n,cht=n

  aks (y|n) Advanced keyboard shortcuts
  wpc (y|n) Window popouts for characters
  bcb (y|n) Background chat beep
  add (y|n) Advanced dice
  3dd (y|n) Use 3D dice
  a3d (y|n) Autoroll 3D dice
  cav (y|n) Chat avatars
  cts (y|n) Chat timestamps
  sta (y|n) Sort token actions
  ani (y|n) Animated graphics
  ust (z|p) Use scroll to...
    z = zoom, p = pan
  smp (t|b|l|r) Status marker position
    t = top, b = bottom, l= left, r = right
  pas (l|r|s|n) Player avatar size
    l = large, r = regular, s = small, n = names only
  cht (w|l|n) Chat tech
    w = WebRTC, n = none
</pre></div>`;

        function yn (v) {
            switch (v.toLowerCase()) {
                case "y":
                case "yes":
                case "1":
                case "on":
                    return true;
                default:
                    return false;
            }
        };

        function check_uncheck(jq, checked) {
            if (jq.prop("checked") !== checked) {
                jq.click();
            }
        }

        function unknown_cmd(command) {
            alert("Unknown command: " + K_START + command + " Try " + K_START + "h for help");
        }

        // Turn Tracker
        function clear_turn_tracker() {
            $(".clearlist").click();
            $(".ui-dialog :contains(sure you want to clear the turns)").parent().find("button:contains(Cancel)").prev().click();
        }

        function close_turn_tracker() {
            $(".ui-dialog-title:contains(Turn Order)").next().click();
        }

        function open_turn_tracker() {
            $("#startrounds").click();
        }

        // Audio controls
        function stop_audio_async(callback) {
            let interval;
            let do_stop = () => {
                const btn = $("#jukeboxwhatsplaying .play");
                if (btn.length > 0) {
                    btn.click();
                } else {
                    clearInterval(interval);
                    if (callback) callback();
                }
            };
            interval = setInterval(do_stop, 200);
        }

        function play_playlist(title) {
            if (!title) {
                title = prompt("Playlist title:");
            }
            $("#jukeboxfolderroot .folder-title:contains(" + title + ")")
                .next()
                .find(".play")
                .click();
        }

        function play_track(title) {
            if (!title) {
                title = prompt("Track title:");
            }
            $("#jukeboxfolderroot .title:contains(" + title + ")")
                .next()
                .find(".play")
                .click();
        }

        function next_track() {
            $("#jukeboxwhatsplaying .plnext").click();
        }

        // Dice
        function roll_dice(dice) {
            const ctx = $(".recentroll").first();
            ctx.find(".formula").text(dice);
            ctx.find("button").click();
        }

        // Token Settings
        function open_token_settings_async(callback) {
            const token_settings_btn = $("[data-action-type=tokensettings]");
            if (token_settings_btn.length !== 1) {
                alert("Error: Select one token before using this command.");
            } else {
                token_settings_btn.click();
                if (callback) {
                    setTimeout(() => {
                        const id = $("[data-tokenid]").last().attr("data-tokenid");
                        callback(id);
                    }, 10);
                }
            }
        }

        function save_token_settings(id) {
            $("[data-tokenid="+id+"]").parent().find(".btn-primary").click();
        }

        function set_token_vision(id, bool) {
            if (!bool) set_token_dark_vision(id, 0);
            $("[data-tokenid="+id+"] .dyn_fog_emits_vision").prop("checked", bool);
        }

        function set_token_dark_vision(id, dist) {
            if (dist > 0) set_token_vision(id, true);
            $("[data-tokenid="+id+"] .dyn_fog_emits_dark_vision").prop("checked", dist > 0);
            $("[data-tokenid="+id+"] .dyn_fog_dark_vision_range").val(dist);
        }

        function set_token_bright_light(id, dist) {
            $("[data-tokenid="+id+"] .dyn_fog_emits_light").prop("checked", dist ? true : false);
            $("[data-tokenid="+id+"] .dyn_fog_light_range").val(dist);
        }

        function set_token_dim_light(id, dist) {
            $("[data-tokenid="+id+"] .dyn_fog_emits_dim_light").prop("checked", dist ? true : false);
            $("[data-tokenid="+id+"] .dyn_fog_dim_light_range").val(dist);
        }

        function set_token_bar_attribute(token_id, bar_num, attribute_name) {
            const select = $(`[data-tokenid=${token_id}] .bar${bar_num}_link`);
            const opts = select.find("option").get().filter(e => e.innerHTML === attribute_name);
            if (opts.length > 0) {
                select.val(opts[0].value);
            } else {
                alert("Invalid attribute name: " + attribute_name);
            }
        }

        function set_token_bar_text_overlay(token_id, bar_num, option) {
            const select = $(`[data-tokenid=${token_id}] .bar${bar_num}options`);
            switch (option) {
                case "h":
                    select.val("hidden");
                    break;
                case "e":
                    select.val("editors");
                    break;
                case "*":
                    select.val("everyone");
                    break;
                default:
                    alert(`Invalid text overlay option: ${option}`);
                    return;
            }
        }

        function set_token_aura_shape(token_id, aura_num, shape) {
            const select = $(`[data-tokenid=${token_id}] .aura${aura_num}_options`);
            switch (shape) {
                case "c":
                    select.val("circle");
                    break;
                case "s":
                    select.val("square");
                    break;
                default:
                    alert(`Invalid aura shape: ${shape}`);
                    return;
            }
        }

        function get_token_option_name(short_name) {
            const first = ({
                "b": "Bar",
                "a": "Aura",
                "n": "Name",
                "t": "Tooltip",
                "*": "Global"
            })[short_name[0]];
            const second = ({
                1: " 1",
                2: " 2",
                3: " 3",
                "*": " *",
                "v": " visibility",
                "e": " editability",
                "p": "plate",
                "l": " location",
                "s": " style",
                "t": " text"
            })[short_name[1]];
            const third = ({
                "v": " visibility",
                "e": " editability",
                "c": " current value",
                "m": " max value",
                "a": " linked attribute",
                "t": " text overlay visibility",
                "r": " radius",
                "s": " shape"
            })[short_name[2]] || "";
            return first + second + third;
        };

        function set_token_options(options) {
            const err_invalid_option = option => {
                alert(`Invalid option: ${option.name}=${option.value}`);
            };
            options = options.split(',').map(option => {
                const [name, value] = option.split('=').map(o => o.trim());
                return { name, value };
            });
            open_token_settings_async(id => {
                const get = sel => $("[data-tokenid="+id+"] "+sel);
                for (let i = 0; i < options.length; i++) {
                    const option = options[i];
                    if (option.value === "?") {
                        option.value = prompt(get_token_option_name(option.name)+":");
                    }
                    const n = option.name[1];
                    switch (option.name) {
                        case "b1c": // Bar current value
                        case "b2c":
                        case "b3c": {
                            get(".bar"+n+"_value").val(option.value);
                            break;
                        }
                        case "b*c":
                            get(".bar1_value").val(option.value);
                            get(".bar2_value").val(option.value);
                            get(".bar3_value").val(option.value);
                            break;
                        case "b1m": // Bar max value
                        case "b2m":
                        case "b3m":
                            get(".bar"+n+"_max").val(option.value);
                            break;
                        case "b*m":
                            get(".bar1_max").val(option.value);
                            get(".bar2_max").val(option.value);
                            get(".bar3_max").val(option.value);
                            break;
                        case "b1a": // Bar linked attribute
                        case "b2a":
                        case "b3a":
                            set_token_bar_attribute(id, n, option.value);
                            break;
                        case "b*a":
                            set_token_bar_attribute(id, 1, option.value);
                            set_token_bar_attribute(id, 2, option.value);
                            set_token_bar_attribute(id, 3, option.value);
                            break;
                        case "b1v": // Bar view permission
                        case "b2v":
                        case "b3v":
                            get(".showplayers_bar"+n).prop("checked", yn(option.value));
                            break;
                        case "b*v":
                            get(".showplayers_bar1").prop("checked", yn(option.value));
                            get(".showplayers_bar2").prop("checked", yn(option.value));
                            get(".showplayers_bar3").prop("checked", yn(option.value));
                            break;
                        case "b1e": // Bar edit permissions
                        case "b2e":
                        case "b3e":
                            get(".playersedit_bar"+n).prop("checked", yn(option.value));
                            break;
                        case "b*e":
                            get(".playersedit_bar1").prop("checked", yn(option.value));
                            get(".playersedit_bar2").prop("checked", yn(option.value));
                            get(".playersedit_bar3").prop("checked", yn(option.value));
                            break;
                        case "b1t": // Bar text overlay visibility
                        case "b2t":
                        case "b3t":
                            set_token_bar_text_overlay(id, n, option.value);
                            break;
                        case "b*t":
                            set_token_bar_text_overlay(id, 1, option.value);
                            set_token_bar_text_overlay(id, 2, option.value);
                            set_token_bar_text_overlay(id, 3, option.value);
                            break;
                        case "bl": // Bar location
                            switch (option.value) {
                                case "a":
                                    get(".token_bar_location").val("above");
                                    break;
                                case "b":
                                    get(".token_bar_location").val("below");
                                    break;
                                case "ot":
                                    get(".token_bar_location").val("overlap_top");
                                    break;
                                case "ob":
                                    get(".token_bar_location").val("overlap_bottom");
                                    break;
                                default:
                                    err_invalid_option(option);
                                    return;
                            }
                            break;
                        case "bs": // Bar style
                            switch (option.value) {
                                case "s":
                                    get("[name=barStyle][value=standard]").click();
                                    break;
                                case "c":
                                    get("[name=barStyle][value=compact]").click();
                                    break;
                                default:
                                    err_invalid_option(option);
                                    return;
                            }
                            break;
                        case "a1r":
                        case "a2r":
                            get(".aura"+n+"_radius").val(option.value);
                            break;
                        case "a*r":
                            get(".aura1_radius").val(option.value);
                            get(".aura2_radius").val(option.value);
                            break;
                        case "a1s":
                        case "a2s":
                            set_token_aura_shape(id, n, option.value);
                            break;
                        case "a*s":
                            set_token_aura_shape(id, 1, option.value);
                            set_token_aura_shape(id, 2, option.value);
                            break;
                        case "a1v": // Aura view permission
                        case "a2v":
                            get(".showplayers_aura"+n).prop("checked", yn(option.value));
                            break;
                        case "a*v":
                            get(".showplayers_aura1").prop("checked", yn(option.value));
                            get(".showplayers_aura2").prop("checked", yn(option.value));
                            break;
                        case "a1e": // Aura edit permissions
                        case "a2e":
                            get(".playersedit_aura"+n).prop("checked", yn(option.value));
                            break;
                        case "a*e":
                            get(".playersedit_aura1").prop("checked", yn(option.value));
                            get(".playersedit_aura2").prop("checked", yn(option.value));
                            break;
                        case "nv": // Token name view permission
                            get(".showplayers_name").prop("checked", yn(option.value));
                            break;
                        case "ne": // Token name edit permission
                            get(".playersedit_name").prop("checked", yn(option.value));
                            break;
                        case "np": // Nameplate visibility
                            get(".showname").prop("checked", yn(option.value));
                            break;
                        case "nt": // Name text
                            get(".name").val(option.value);
                            break;
                        case "tv": // Tooltip visible on hover
                            get(".show_tooltip").prop("checked", yn(option.value));
                            break;
                        case "tt": // Tooltip text
                            get(".token-tooltip").val(option.value);
                            break;
                        case "*v": { // Global visibility permission
                            const val = yn(option.value);
                            get(".showplayers_bar1").prop("checked", val);
                            get(".showplayers_bar2").prop("checked", val);
                            get(".showplayers_bar3").prop("checked", val);
                            get(".showplayers_aura1").prop("checked", val);
                            get(".showplayers_aura2").prop("checked", val);
                            get(".showplayers_name").prop("checked", val);
                            break;
                        }
                        case "*e": { // Global editing permission
                            const val = yn(option.value);
                            get(".playersedit_bar1").prop("checked", val);
                            get(".playersedit_bar2").prop("checked", val);
                            get(".playersedit_bar3").prop("checked", val);
                            get(".playersedit_aura1").prop("checked", val);
                            get(".playersedit_aura2").prop("checked", val);
                            get(".playersedit_name").prop("checked", val);
                            break;
                        }
                        default:
                            err_invalid_option(option);
                            return;
                    }
                }
                save_token_settings(id);
            });
        }

        // Game/user preferences
        function set_preferences(prefs) {
            const err_invalid_pref = pref => {
                alert(`Invalid pref: ${pref.name}=${pref.value}`);
            };
            prefs = prefs.split(',').map(pref => {
                const [name, value] = pref.split('=').map(o => o.trim());
                return { name, value };
            });
            for (let i = 0; i < prefs.length; i++) {
                const pref = prefs[i];
                const n = pref.name[1];
                switch (pref.name) {
                    case "aks": // Advanced keyboard shortcuts
                        check_uncheck($("#checkboxAdvancedKeyboardShortcuts"), yn(pref.value));
                        break;
                    case "wpc": // Window pop-outs for characters
                        check_uncheck($("#checkboxCharacterPopoutWindows"), yn(pref.value));
                        break;
                    case "bcb": // Background chat beep
                        check_uncheck($("#checkboxBackgroundChatSounds"), yn(pref.value));
                        break;
                    case "add": // Advanced dice
                        check_uncheck($("#advancedDice"), yn(pref.value));
                        break;
                    case "3dd": // 3D Dice
                        check_uncheck($("#checkbox3dDice"), yn(pref.value));
                        break;
                    case "a3d": // Automatically roll 3D dice
                        check_uncheck($("#checkboxAutoRoll"), yn(pref.value));
                        break;
                    case "cav": // Chat avatars
                        check_uncheck($("#checkboxChatAvatars"), yn(pref.value));
                        break;
                    case "cts": // Chat timestamps
                        check_uncheck($("#checkboxChatTimestamps"), yn(pref.value));
                        break;
                    case "sta": // Sort token actions (alphabetically)
                        check_uncheck($("#checkboxSortTokenActionsByNameAsc"), yn(pref.value));
                        break;
                    case "ani": // Animated graphics
                        check_uncheck($("#checkboxAnimatedGraphics"), yn(pref.value));
                        break;
                    case "ust": // Use scroll to...
                        switch (pref.value) {
                            case "z": // Zoom
                                $("#useScrollTo").val("Zoom").change();
                                break;
                            case "p": // Pan
                                $("#useScrollTo").val("Pan").change();
                                break;
                            default:
                                err_invalid_pref(pref);
                                break;
                        }
                        break;
                    case "smp": // Status marker position
                        switch (pref.value) {
                            case "t": // Top
                                $("#token_marker_position").val("top").change();
                                break;
                            case "b": // Bottom
                                $("#token_marker_position").val("bottom").change();
                                break;
                            case "l": // Left
                                $("#token_marker_position").val("left").change();
                                break;
                            case "r": // Right
                                $("#token_marker_position").val("right").change();
                                break;
                            default:
                                err_invalid_pref(pref);
                                break;
                        }
                        break;
                    case "pas": // Player avatar size
                        switch (pref.value) {
                            case "l": // Large
                                $("#videoPlayerSize").val("large").change();
                                break;
                            case "r": // Regular
                                $("#videoPlayerSize").val("regular").change();
                                break;
                            case "s": // Small
                                $("#videoPlayerSize").val("small").change();
                                break;
                            case "n": // Names only
                                $("#videoPlayerSize").val("names").change();
                                break;
                            default:
                                err_invalid_pref(pref);
                                break;
                        }
                        break;
                    case "cht": { // Chat tech
                        const select = $("option[value=roll20-fm]").parent();
                        switch (pref.value) {
                            case "w": // WebRTC
                                select.val("roll20-fm").change();
                                break;
                            case "n": // None
                                select.val("none").change();
                                break;
                            default:
                                err_invalid_pref(pref);
                                break;
                        }
                        break;
                    }
                    default:
                        err_invalid_pref(pref);
                        break;
                }
            }
        }

        // Page controls
        function get_page(page_name) {
            return $(`.availablepage .page-title:contains(${page_name})`).parent();
        }

        function go_to_page(players, gm, page_name) {
            if (!players && !gm) {
                console.warn("go_to_page() called with neither 'players' nor 'gm' set.");
                return;
            }
            const page = get_page(page_name);
            if (page.length < 1) {
                alert(`No page named '${page_name}' (remember, page names are case sensitive!)`);
                return;
            }

            // Open page toolbar
            $("#page-toolbar.closed .handle.showtip").click();

            setTimeout(() => {
                // Change page for players
                if (players) {
                    const bookmark = $(".playerbookmark");

                    const pageOffset = page.offset();
                    const bookmarkOffset = bookmark.offset();

                    bookmark.simulate("drag", {
                        dx: pageOffset.left - bookmarkOffset.left,
                        dy: pageOffset.top - bookmarkOffset.top
                    });
                }

                // Change page for GM
                if (gm) page.click();

                // Close page toolbar
                $("#page-toolbar .handle").click();
            }, 10);
        }

        function open_page_settings_async(callback) {
            $(".activepage .js__settings-page").click();
            setTimeout(() => {
                const dialog = $(".ui-dialog-title:contains(Page Settings)").parents(".ui-dialog");
                if (callback) {
                    callback(dialog);
                }
            }, 10);
        }

        function set_page_settings(settings) {
            open_page_settings_async((dialog) => {
                const err_invalid_setting = s => {
                    alert(`Invalid setting: ${s.name}=${s.value}`);
                };
                settings = settings.split(',').map(s => {
                    const [name, value] = s.split('=').map(o => o.trim());
                    return { name, value };
                });
                for (let i = 0; i < settings.length; i++) {
                    const setting = settings[i];
                    const n = setting.name[1];
                    switch (setting.name) {
                        case "dl": // Dynamic lighting
                            dialog.find(".dyn_fog_enabled").prop("checked", yn(setting.value));
                            break;
                        case "xm": // Explorer mode
                            if (yn(setting.value)) {
                                dialog.find(".dyn_fog_enabled").prop("checked", true);
                            }
                            dialog.find(".dyn_fog_autofog_mode").prop("checked", yn(setting.value));
                            break;
                        case "gi": // Global illumination / daylight mode
                            if (yn(setting.value)) {
                                dialog.find(".dyn_fog_enabled").prop("checked", true);
                            }
                            dialog.find(".dyn_fog_global_illum").prop("checked", yn(setting.value));
                            break;
                        case "ud": // Update on drop
                            if (yn(setting.value)) {
                                dialog.find(".dyn_fog_enabled").prop("checked", true);
                            }
                            dialog.find(".dyn_fog_update_on_drop").prop("checked", yn(setting.value));
                            break;
                        case "rm": // Lighting restricts movement
                            dialog.find(".lightrestrictmove").prop("checked", yn(setting.value));
                            break;
                        case "fw": // Fog of war
                            $("#page-standard-fog-basic-toggle").prop("checked", yn(setting.value));
                            break;
                        case "ge": // Grid enabled
                            $("#page-grid-display-toggle").prop("checked", yn(setting.value));
                            break;
                        case "gs": // Grid scale
                            $("#page-scale-grid-cell-distance").val(setting.value);
                            break;
                        case "gu": // Grid units
                            switch (setting.value) {
                                case "ft":
                                case "m":
                                case "km":
                                case "mi":
                                case "in":
                                case "cm":
                                case "un":
                                case "hex":
                                case "sq":
                                case "custom":
                                    $("#page-scale-grid-cell-label-select").val(setting.value);
                                    break;
                                default:
                                    alert(`Invalid grid scale unit: ${setting.value}`);
                                    break;
                            }
                            break;
                        case "gt": // Grid type
                            switch (setting.value) {
                                case "s": // Square
                                    $("#gridtype").val("square");
                                    break;
                                case "v": // Square
                                    $("#gridtype").val("hex");
                                    break;
                                case "h": // Square
                                    $("#gridtype").val("hexr");
                                    break;
                                default:
                                    alert(`Invalid grid type: ${setting.value}`);
                                    break;
                            }
                            break;
                        default:
                            err_invalid_setting(setting);
                            break;
                    }
                }
                // Save
                dialog.find(".btn-primary").click();
            })
        }

        // Help
        function help() {
            $(help_html).appendTo("body")
                .find("button")
                .click((e) => {
                $(e.target).parent().detach();
            });
        }

        function create_table() {
            $("#addrollabletable").click();
            setTimeout(() => {
                $(".rollabletable .name:contains(new-table)").last().click();
                setTimeout(() => {
                    const table_dialog = $(".ui-dialog-title:contains(new-table)").last().parents(".ui-dialog");
                    const table_name = prompt("Table name");
                    if (table_name) {
                        table_dialog.find("input.name").val(table_name);
                    }

                    function get_item() {
                        const item = prompt("Table item (blank to end)");
                        if (item) {
                            table_dialog.find(".addtableitem").click();
                            setTimeout(() => {
                                const item_dialog = $(".ui-dialog-title:contains(Edit Table Item)").last().parents(".ui-dialog");
                                item_dialog.find("input.name").val(item);
                                item_dialog.find("button:contains(Save Changes)").click();
                                setTimeout(get_item, 10);
                            }, 10);
                        } else {
                            table_dialog.find("button:contains(Save Changes)").click();
                        }
                    }

                    get_item();
                }, 10);
            }, 500);
        }

        // Main
        function run_cmd(command) {
            const prefix = command[0];
            const rest = command.slice(1);

            switch (prefix) {
                case "h": // Help
                    help();
                    break;
                case "c": // Chat
                    $("#textchat-input textarea").val(rest);
                    $("#textchat-input button").click();
                    break;
                case "g": { // Page controls
                    const subcmd = rest[0];
                    const subrest = rest.slice(1);
                    switch (subcmd) {
                        case "g": // Send GM to named page
                            go_to_page(false, true, subrest);
                            break;
                        case "p": // Send players to named page
                            go_to_page(true, false, subrest);
                            break;
                        case "a": // Send GM & players to named page
                            go_to_page(true, true, subrest);
                            break;
                        case "s": // Open settings for current page
                            set_page_settings(subrest);
                            break;
                        default:
                            unknown_cmd(command);
                            break;
                    }
                    break;
                }
                case "r": { // Roll dice
                    roll_dice(rest);
                    break;
                }
                case "a": { // Audio
                    const subcmd = rest[0];
                    const subrest = rest.slice(1);
                    switch (subcmd) {
                        case "s": {// Stop all audio
                            stop_audio_async();
                            break;
                        }
                        case "p": // Play playlist
                            play_playlist(subrest);
                            break;
                        case "t": // Play track
                            play_track(subrest);
                            break;
                        case "n": // Play next track
                            next_track();
                            break;
                        default:
                            alert("Unknown audio subcommand: " + subcmd);
                            break;
                    }
                    break;
                }
                case "n": // Create new things
                    switch (rest[0]) {
                        case "h": // Handout
                            $("#addnewhandout").click();
                            break;
                        case "c": // Character
                            $("#addnewcharacter").click();
                            break;
                        case "t":
                            create_table();
                            break;
                        default:
                            unknown_cmd(command);
                            break;
                    }
                    break;
                case "t": // Turn tracker
                    switch (rest[0]) {
                        case "o": // Next turn
                            open_turn_tracker();
                            break;
                        case "c": // Clear
                            clear_turn_tracker();
                            break;
                        case "x": // Close
                            close_turn_tracker();
                            break;
                        case "n": // Next turn
                            $("button:contains(])").click();
                            break;
                        case "s": // Sort
                            $(".sortlist_numericdesc").click();
                            break;
                        default:
                            unknown_cmd(command);
                            break;
                    }
                    break;
                case "v": // Vision
                    switch (rest[0]) {
                        case "n": // Normal
                            open_token_settings_async((id) => {
                                set_token_vision(id, true);
                                set_token_dark_vision(id, 0);
                                save_token_settings(id);
                            });
                            break;
                        case "x": // Blind
                            open_token_settings_async((id) => {
                                set_token_vision(id, false);
                                save_token_settings(id);
                            });
                            break;
                        case "d": { // Darkvision
                            const dist = rest.slice(1);
                            if (isNaN(dist)) {
                                alert("Invalid vision range: " + dist);
                            } else {
                                open_token_settings_async((id) => {
                                    set_token_dark_vision(id, Number(dist));
                                    save_token_settings(id);
                                });
                            }
                            break;
                        }
                        default:
                            unknown_cmd(command);
                            break;
                    }
                    break;
                case "l": { // Lighting
                    const match = rest.match(/(\d*)\/?(\d*)/);
                    if (!match) {
                        alert("Invalid light string: " + rest);
                    } else {
                        let [, bright, dim] = match;
                        open_token_settings_async((id) => {
                            set_token_bright_light(id, bright);
                            set_token_dim_light(id, dim);
                            save_token_settings(id);
                        });
                    }
                    break;
                }
                case "s":
                    $("[data-action-type=show_marker_menu]").click();
                    setTimeout(() => {
                        if (rest) {
                            $("[data-action-type=toggle_status_"+rest+"]").click();
                        } else {
                            $(".statusicon.active").click();
                        }
                        $("[data-action-type=hide_marker_menu]").click();
                    }, 10);
                    break;
                case "o": // Token options
                    set_token_options(rest);
                    break;
                case "p": // Preferences
                    set_preferences(rest);
                    break;
                case "m": // Macros
                    switch (rest) {
                        case "cs": // Start Combat
                            open_turn_tracker();
                            clear_turn_tracker();
                            stop_audio_async(() => {
                                play_playlist("Combat");
                            });
                            break;
                        case "ce": // End Combat
                            clear_turn_tracker();
                            close_turn_tracker();
                            stop_audio_async(() => {
                                play_playlist("Dungeon");
                            });
                            break;
                        default:
                            unknown_cmd(command);
                            break;
                    }
                    break;
                default:
                    unknown_cmd(command);
                    break;
            }
        }

        // Event handlers
        function text_keydown(e) {
            switch (e.key) {
                case "Enter": {
                    e.stopPropagation();
                    e.preventDefault();
                    const command = e.target.value;
                    e.target.value = "";
                    $(e.target).blur();
                    run_cmd(command);
                    break;
                }
                case "Escape": {
                    e.stopPropagation();
                    e.preventDefault();
                    e.target.value = "";
                    $(e.target).blur();
                    break;
                }
            }
        }

        function doc_keydown(e) {
            if (e.key === K_START) {
                e.preventDefault();
                e.stopPropagation();
                $(textBox).focus();
            }
        }

        function dialog_trap_esc(e) {
            const focused = document.activeElement;
            if (e.key === "Escape" && $(focused).parents().is(".dialog")) {
                console.log("TRAPPED ESCAPE KEY TO AVOID LOSING DATA");
                e.preventDefault();
                e.stopPropagation();
            }
        }

        // Initialize REKS
        $(style).appendTo("head");
        $(textBox).appendTo("body");

        textBox.get(0).addEventListener("keydown", text_keydown, false);
        document.addEventListener("keydown", doc_keydown, false);
        document.addEventListener("keydown", dialog_trap_esc, true);

        log("Roll20 Enhanced Keyboard Shortcuts initializeed.");
    });
})();