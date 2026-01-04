// ==UserScript==
// @name         ad bind
// @namespace    http://rainsims.com/
// @version      0.3
// @description  Bind AD to <- ->
// @author       Rain Sims
// @match        http*://*/*
// @exclude      http*://*pr0gramm.com/*
// @exclude      http*://mail.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/377535/ad%20bind.user.js
// @updateURL https://update.greasyfork.org/scripts/377535/ad%20bind.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keyMap = {
        65: {
            "keyCode" : 37,
            "which" : 37,
            "charCode" : 0
            },
        68: {
            "keyCode" : 39,
            "which" : 39,
            "charCode" : 0
            }
    };

    function getMapping(key){
        return (key in keyMap) ? keyMap[key] : undefined;
    }

    function addMapping(eventObj, mapping){
        eventObj.keyCode = mapping.keyCode;
        eventObj.which = mapping.which;
        eventObj.charCode = mapping.charCode;
    }

    function fireEvent(evt) {
        var mapping = getMapping(evt.keyCode);

        if(mapping){
            var eventObj;

            if(document.createEventObject) {
                eventObj = document.createEventObject();
                addMapping(eventObj, mapping);
                document.body.fireEvent("on" + evt.type, eventObj);
            } else if(document.createEvent) {
                eventObj = document.createEvent("Events");
                eventObj.initEvent(evt.type, true, true);
                addMapping(eventObj, mapping);
                document.body.dispatchEvent(eventObj);
            }
        }

    }

    function addEvent(element, eventName, callback) {
        if (element.addEventListener) {
            element.addEventListener(eventName, callback, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + eventName, callback);
        }
    }

    addEvent(document, "keydown", fireEvent);
    addEvent(document, "keyup", fireEvent);
    addEvent(document, "keypress", fireEvent);
})();