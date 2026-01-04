// ==UserScript==
// @name         Ecosia + Google
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Adds Google Button to Ecosia.org + a customizable Shortcut (default "G")
// @author       You
// @match        https://www.ecosia.org/*
// @icon         https://www.google.com/s2/favicons?domain=ecosia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433630/Ecosia%20%2B%20Google.user.js
// @updateURL https://update.greasyfork.org/scripts/433630/Ecosia%20%2B%20Google.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // >>>>>>>>>>>> SETTINGS >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

    const GOOGLE_SHORTCUT = "G"

    // <<<<<<<<<<<< SETTINGS <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    const shortcut = {
        'all_shortcuts':{},//All the shortcuts are stored in this array
        'add': function(shortcut_combination,callback,opt) {
            //Provide a set of default options
            var default_options = {
                'type':'keydown',
                'propagate':false,
                'disable_in_input':false,
                'target':document,
                'keycode':false
            }
            if(!opt) opt = default_options;
            else {
                for(var dfo in default_options) {
                    if(typeof opt[dfo] == 'undefined') opt[dfo] = default_options[dfo];
                }
            }

            var ele = opt.target;
            if(typeof opt.target == 'string') ele = document.getElementById(opt.target);
            var ths = this;
            shortcut_combination = shortcut_combination.toLowerCase();

            //The function to be called at keypress
            var func = function(e) {
                e = e || window.event;

                if(opt['disable_in_input']) { //Don't enable shortcut keys in Input, Textarea fields
                    var element;
                    if(e.target) element=e.target;
                    else if(e.srcElement) element=e.srcElement;
                    if(element.nodeType==3) element=element.parentNode;

                    if(element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') return;
                }

                //Find Which key is pressed
                var code;
                if (e.keyCode) code = e.keyCode;
                else if (e.which) code = e.which;
                var character = String.fromCharCode(code).toLowerCase();

                if(code == 188) character=","; //If the user presses , when the type is onkeydown
                if(code == 190) character="."; //If the user presses , when the type is onkeydown

                var keys = shortcut_combination.split("+");
                //Key Pressed - counts the number of valid keypresses - if it is same as the number of keys, the shortcut function is invoked
                var kp = 0;

                //Work around for stupid Shift key bug created by using lowercase - as a result the shift+num combination was broken
                var shift_nums = {
                    "`":"~",
                    "1":"!",
                    "2":"@",
                    "3":"#",
                    "4":"$",
                    "5":"%",
                    "6":"^",
                    "7":"&",
                    "8":"*",
                    "9":"(",
                    "0":")",
                    "-":"_",
                    "=":"+",
                    ";":":",
                    "'":"\"",
                    ",":"<",
                    ".":">",
                    "/":"?",
                    "\\":"|"
                }
                //Special Keys - and their codes
                var special_keys = {
                    'esc':27,
                    'escape':27,
                    'tab':9,
                    'space':32,
                    'return':13,
                    'enter':13,
                    'backspace':8,

                    'scrolllock':145,
                    'scroll_lock':145,
                    'scroll':145,
                    'capslock':20,
                    'caps_lock':20,
                    'caps':20,
                    'numlock':144,
                    'num_lock':144,
                    'num':144,

                    'pause':19,
                    'break':19,

                    'insert':45,
                    'home':36,
                    'delete':46,
                    'end':35,

                    'pageup':33,
                    'page_up':33,
                    'pu':33,

                    'pagedown':34,
                    'page_down':34,
                    'pd':34,

                    'left':37,
                    'up':38,
                    'right':39,
                    'down':40,

                    'f1':112,
                    'f2':113,
                    'f3':114,
                    'f4':115,
                    'f5':116,
                    'f6':117,
                    'f7':118,
                    'f8':119,
                    'f9':120,
                    'f10':121,
                    'f11':122,
                    'f12':123
                }

                var modifiers = {
                    shift: { wanted:false, pressed:false},
                    ctrl : { wanted:false, pressed:false},
                    alt  : { wanted:false, pressed:false},
                    meta : { wanted:false, pressed:false}	//Meta is Mac specific
                };

                if(e.ctrlKey)	modifiers.ctrl.pressed = true;
                if(e.shiftKey)	modifiers.shift.pressed = true;
                if(e.altKey)	modifiers.alt.pressed = true;
                if(e.metaKey)   modifiers.meta.pressed = true;

                var k;
                for(var i=0; k=keys[i],i<keys.length; i++) {
                    //Modifiers
                    if(k == 'ctrl' || k == 'control') {
                        kp++;
                        modifiers.ctrl.wanted = true;

                    } else if(k == 'shift') {
                        kp++;
                        modifiers.shift.wanted = true;

                    } else if(k == 'alt') {
                        kp++;
                        modifiers.alt.wanted = true;
                    } else if(k == 'meta') {
                        kp++;
                        modifiers.meta.wanted = true;
                    } else if(k.length > 1) { //If it is a special key
                        if(special_keys[k] == code) kp++;

                    } else if(opt['keycode']) {
                        if(opt['keycode'] == code) kp++;

                    } else { //The special keys did not match
                        if(character == k) kp++;
                        else {
                            if(shift_nums[character] && e.shiftKey) { //Stupid Shift key bug created by using lowercase
                                character = shift_nums[character];
                                if(character == k) kp++;
                            }
                        }
                    }
                }

                if(kp == keys.length &&
                   modifiers.ctrl.pressed == modifiers.ctrl.wanted &&
                   modifiers.shift.pressed == modifiers.shift.wanted &&
                   modifiers.alt.pressed == modifiers.alt.wanted &&
                   modifiers.meta.pressed == modifiers.meta.wanted) {
                    callback(e);

                    if(!opt['propagate']) { //Stop the event
                        //e.cancelBubble is supported by IE - this will kill the bubbling process.
                        e.cancelBubble = true;
                        e.returnValue = false;

                        //e.stopPropagation works in Firefox.
                        if (e.stopPropagation) {
                            e.stopPropagation();
                            e.preventDefault();
                        }
                        return false;
                    }
                }
            }
            this.all_shortcuts[shortcut_combination] = {
                'callback':func,
                'target':ele,
                'event': opt['type']
            };
            //Attach the function with the event
            if(ele.addEventListener) ele.addEventListener(opt['type'], func, false);
            else if(ele.attachEvent) ele.attachEvent('on'+opt['type'], func);
            else ele['on'+opt['type']] = func;
        },

        //Remove the shortcut - just specify the shortcut and I will remove the binding
        'remove':function(shortcut_combination) {
            shortcut_combination = shortcut_combination.toLowerCase();
            var binding = this.all_shortcuts[shortcut_combination];
            delete(this.all_shortcuts[shortcut_combination])
            if(!binding) return;
            var type = binding['event'];
            var ele = binding['target'];
            var callback = binding['callback'];

            if(ele.detachEvent) ele.detachEvent('on'+type, callback);
            else if(ele.removeEventListener) ele.removeEventListener(type, callback, false);
            else ele['on'+type] = false;
        }
    }

    const googleCont = document.createElement("div");
    googleCont.style = "display: flex; align-items: center; justify-content: center; width: 4px; height: 70px; margin-bottom: -20px;"
    const google = document.createElement("a");
    google.id = "google"
    googleCont.appendChild(google);
    google.innerHTML = `
    <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
  </g>
</svg>
   `
    google.href = "https://google.de/search"+window.location.search
    document.getElementsByClassName("row")[0].insertBefore(googleCont,document.getElementsByClassName("row")[0].children[2])

    shortcut.add(GOOGLE_SHORTCUT,function() {google.click()},
                 {
    type: "keydown",
    'disable_in_input': true
    });
})();